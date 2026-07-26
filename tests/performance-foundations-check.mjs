import {
  createPerformanceMonitor,
  createRevisionCache,
  createTaskScheduler,
} from "../src/core/performance.js";
import { createRegionRenderer } from "../src/core/render-regions.js";

const fail = (message) => {
  console.error(`Performance foundations check failed: ${message}`);
  process.exit(1);
};
const assert = (condition, message) => {
  if (!condition) fail(message);
};

let time = 0;
const monitor = createPerformanceMonitor({ clock: () => time, capacity: 2 });
const token = monitor.start("boot");
time = 7;
monitor.end(token, { lens: "strategic" });
monitor.measure("render.shell", () => {
  time += 3;
});
await monitor.measureAsync("render.review", async () => {
  time += 5;
});
const snapshot = monitor.snapshot();
assert(snapshot.entryCount === 2, "bounded telemetry did not evict its oldest entry");
assert(Object.isFrozen(snapshot) && Object.isFrozen(snapshot.entries), "telemetry snapshots must be immutable");
assert(
  snapshot.measures.find((entry) => entry.name === "render.review")?.latest === 5,
  "asynchronous measures lost their duration",
);

const cache = createRevisionCache({ capacity: 2 });
let computations = 0;
const first = cache.getOrCompute("analysis", 1, () => (++computations, undefined));
const second = cache.getOrCompute("analysis", 1, () => (++computations, "unexpected"));
assert(first === undefined && second === undefined, "cache must preserve an explicitly undefined value");
assert(computations === 1, "same-revision computation was not memoized");
assert(
  cache.getOrCompute("analysis", 2, () => (++computations, "updated")) === "updated",
  "revision change did not invalidate the cached computation",
);

const queued = [];
const scheduled = [];
const scheduler = createTaskScheduler({ schedule: (task) => scheduled.push(task) });
scheduler.enqueue("render", () => queued.push("stale"));
scheduler.enqueue("render", () => queued.push("latest"));
scheduler.enqueue("persist", () => queued.push("persist"));
assert(scheduled.length === 1, "a coalesced task batch scheduled more than once");
scheduled[0]();
assert(queued.join(",") === "latest,persist", "scheduled work was not deduplicated deterministically");
assert(scheduler.pending().length === 0, "completed tasks remain pending");

const regionCalls = [];
const regionRenderer = createRegionRenderer({
  shell: () => regionCalls.push("shell"),
  workflow: () => regionCalls.push("workflow"),
  engine: () => regionCalls.push("engine"),
  review: () => regionCalls.push("review"),
});
regionRenderer.render(["shell"]);
assert(
  regionCalls.join(",") === "shell",
  "selective rendering executed a region outside the requested shell boundary",
);
assert(
  regionRenderer.stats().find(({ name }) => name === "shell")?.count === 1 &&
    regionRenderer.stats().filter(({ name }) => name !== "shell").every(({ count }) => count === 0),
  "selective rendering changed a non-shell render counter",
);
regionRenderer.renderAll();
assert(
  regionRenderer.stats().every(({ name, count }) => count === (name === "shell" ? 2 : 1)),
  "full rendering did not remain available after a selective cycle",
);

console.log("Performance foundations checks passed.");
