import {
  SHELL_DENSITIES,
  createShellPreferences,
  normalizeShellDensity,
} from "../src/core/shell-preferences.js";
import fs from "node:fs";

const fail = (message) => {
  console.error(`Shell preferences check failed: ${message}`);
  process.exit(1);
};
const assert = (condition, message) => {
  if (!condition) fail(message);
};

const body = { dataset: {} };
const documentElement = { style: {} };
const updates = [];
const preferences = createShellPreferences({
  document: { body, documentElement },
  settings: { update: (patch) => updates.push(patch) },
  initialDensity: "compact",
});

assert(Object.isFrozen(SHELL_DENSITIES), "supported densities must be immutable");
assert(normalizeShellDensity("unknown") === "comfortable", "invalid density did not fall back safely");
assert(preferences.current() === "compact", "persisted compact density was not restored");
assert(preferences.apply("compact", { persist: false }) === "compact", "compact density was not applied");
assert(body.dataset.density === "compact", "density was not exposed to the stylesheet");
assert(updates.length === 0, "boot application unexpectedly rewrote settings");
assert(preferences.toggle() === "comfortable", "density toggle did not return to comfortable");
assert(updates.at(-1)?.density === "comfortable", "density toggle was not persisted");
assert(Object.isFrozen(preferences.snapshot()), "preference snapshot must be immutable");

const app = fs.readFileSync(new URL("../src/app.js", import.meta.url), "utf8");
const strategicSchema = fs.readFileSync(
  new URL("../schema/strategic-analysis.schema.json", import.meta.url),
  "utf8",
);
const biopoliticalSchema = fs.readFileSync(
  new URL("../schema/biopolitical-analysis.schema.json", import.meta.url),
  "utf8",
);
for (const key of [
  "skipToWorkspace",
  "lensContextStrategic",
  "lensContextBiopolitical",
  "densityTitle",
  "densityComfortable",
  "densityCompact",
  "workspaceNavigation",
  "workspaceSectionSetup",
  "workspaceSectionModel",
  "workspaceSectionReview",
  "localProcessing",
  "nextActionLabel",
  "shellActionTopic",
  "shellActionImport",
  "shellActionReview",
  "shellMovedToSetup",
  "shellMovedToModel",
  "shellMovedToReview",
]) {
  const occurrences = app.match(new RegExp(`\\b${key}:`, "g"))?.length || 0;
  assert(occurrences === 3, `${key} must exist once in every interface language`);
}
for (const schema of [strategicSchema, biopoliticalSchema]) {
  assert(!schema.includes('"density"'), "display density leaked into a canonical schema");
  assert(!schema.includes('"shellSection"'), "shell position leaked into a canonical schema");
}

console.log("Shell preferences checks passed.");
