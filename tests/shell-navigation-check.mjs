import fs from "node:fs";
import {
  SHELL_SECTIONS,
  availableShellSections,
  nextShellSection,
  resolveShellCommand,
} from "../src/core/shell-navigation.js";
import { createApplicationShell } from "../src/features/application-shell.js";

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

class FakeElement {
  constructor(id) {
    this.id = id;
    this.dataset = {};
    this.style = {};
    this.disabled = false;
    this.tabIndex = 0;
    this.attributes = new Map();
    this.classList = { toggle() {} };
  }

  setAttribute(name, value) {
    this.attributes.set(name, String(value));
  }

  removeAttribute(name) {
    this.attributes.delete(name);
  }

  querySelector() {
    return null;
  }

  addEventListener() {}

  focus() {
    this.focused = true;
  }

  scrollIntoView(options) {
    this.scrollOptions = options;
  }
}

const elements = new Map();
const fakeDocument = {
  body: new FakeElement("body"),
  documentElement: new FakeElement("html"),
  getElementById(id) {
    if (!elements.has(id)) elements.set(id, new FakeElement(id));
    return elements.get(id);
  },
  querySelectorAll() {
    return [];
  },
  querySelector() {
    return null;
  },
};
fakeDocument.documentElement.dir = "ltr";
const shellState = {
  density: "comfortable",
  analysisLens: "strategic",
  analysis: null,
  shellSection: "workflow",
  stage: "topic",
  lang: "en",
  workspaceSaveState: "idle",
};
const regionCalls = [];
let shellController;
shellController = createApplicationShell({
  document: fakeDocument,
  state: shellState,
  settings: { update() {} },
  translate: (key) => key,
  localize: (english) => english,
  renderRegion: (name) => {
    regionCalls.push(name);
    if (name === "shell") shellController.render();
  },
  requestFrame: (operation) => operation(),
  reducedMotion: () => true,
});
shellController.setDensity("compact");
assert(shellState.density === "compact", "feature did not update shell density");
assert(
  regionCalls.join(",") === "shell",
  "feature density change escaped the shell render boundary",
);
shellController.navigate("engine");
assert(shellState.shellSection === "engine", "feature navigation did not update shell state");
assert(
  regionCalls.join(",") === "shell,shell",
  "feature navigation escaped the shell render boundary",
);
assert(
  elements.get("enginePanel")?.scrollOptions?.behavior === "auto",
  "feature navigation lost reduced-motion behavior",
);

const app = fs.readFileSync(new URL("../src/app.js", import.meta.url), "utf8");
const feature = fs.readFileSync(
  new URL("../src/features/application-shell.js", import.meta.url),
  "utf8",
);
const index = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");
for (const token of [
  "createApplicationShell",
  "APPLICATION_SHELL.render()",
  "APPLICATION_SHELL.bind()",
  "APPLICATION_SHELL.setDensity",
]) {
  assert(app.includes(token), `runtime integration is missing ${token}`);
}
assert(
  !app.includes("function renderApplicationShell") &&
    !app.includes("function navigateShell") &&
    !app.includes("function bindWorkspaceNavigation"),
  "the entry point still owns extracted shell feature behavior",
);
for (const token of [
  "createShellPreferences",
  "nextShellSection",
  "resolveShellCommand",
  "function render()",
  "function setDensity(",
  "function navigate(",
  "function activateNext()",
  "function bind()",
]) {
  assert(feature.includes(token), `application-shell feature is missing ${token}`);
}
assert(
  (feature.match(/renderRegion\("shell"\)/g) || []).length === 2,
  "density and navigation must remain the only selective shell render paths",
);
for (const token of [
  'id="shellNextAction"',
  'id="shellAnnouncement"',
  'class="commandPrimary"',
  'class="commandSecondary"',
]) {
  assert(index.includes(token), `shell markup is missing ${token}`);
}

console.log("Shell navigation checks passed.");
