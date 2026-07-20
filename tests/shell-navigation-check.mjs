import fs from "node:fs";
import {
  SHELL_SECTIONS,
  availableShellSections,
  nextShellSection,
  resolveShellCommand,
} from "../src/core/shell-navigation.js";

const fail = (message) => {
  console.error(`Shell navigation check failed: ${message}`);
  process.exit(1);
};
const assert = (condition, message) => {
  if (!condition) fail(message);
};

assert(Object.isFrozen(SHELL_SECTIONS), "section registry must be immutable");
assert(
  availableShellSections().join(",") === "workflow,engine",
  "locked review must be removed from the keyboard route",
);
assert(
  availableShellSections({ reviewAvailable: true }).join(",") ===
    "workflow,engine,review",
  "available review must join the keyboard route",
);
assert(
  nextShellSection("workflow", "ArrowRight") === "engine",
  "LTR forward navigation failed",
);
assert(
  nextShellSection("workflow", "ArrowLeft") === "engine",
  "locked navigation did not wrap",
);
assert(
  nextShellSection("workflow", "ArrowRight", { direction: "rtl" }) === "engine",
  "RTL navigation did not follow visual order",
);
assert(
  nextShellSection("engine", "End", { reviewAvailable: true }) === "review",
  "End did not reach the last available section",
);
assert(nextShellSection("engine", "PageDown") === null, "unsupported keys must be ignored");

assert(resolveShellCommand({ stage: "topic" }).id === "topic", "topic command failed");
assert(resolveShellCommand({ stage: "prompt" }).id === "import", "prompt command failed");
assert(resolveShellCommand({ stage: "import" }).focusTarget === "jsonInput", "import focus failed");
assert(
  resolveShellCommand({ stage: "topic", hasAnalysis: true }).section === "review",
  "analysis did not promote review",
);

const app = fs.readFileSync(new URL("../src/app.js", import.meta.url), "utf8");
const index = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");
for (const token of [
  "nextShellSection",
  "resolveShellCommand",
  "bindWorkspaceNavigation",
  "shellNextAction",
]) {
  assert(app.includes(token), `runtime integration is missing ${token}`);
}
for (const token of [
  'id="shellNextAction"',
  'id="shellAnnouncement"',
  'class="commandPrimary"',
  'class="commandSecondary"',
]) {
  assert(index.includes(token), `shell markup is missing ${token}`);
}

console.log("Shell navigation checks passed.");
