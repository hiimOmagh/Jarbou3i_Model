import { createPlatformRuntime } from "../src/core/platform-runtime.js";
import { createStrategicLensAdapter } from "../src/lenses/strategic/adapter.js";
import { createBiopoliticalLensAdapter } from "../src/lenses/biopolitical/adapter.js";

const fail = (message) => {
  console.error(`Platform runtime check failed: ${message}`);
  process.exit(1);
};
const assert = (condition, message) => {
  if (!condition) fail(message);
};

const values = new Map([["settings", JSON.stringify({ lang: "fr" })]]);
const storage = {
  getItem: (key) => values.get(key) ?? null,
  setItem: (key, value) => values.set(key, value),
  removeItem: (key) => values.delete(key),
};
const service = {
  buildPrompt: () => "prompt",
  createSample: () => ({}),
  renderEngineNav: () => {},
  renderReview: () => {},
};
const runtime = createPlatformRuntime({
  adapters: [createStrategicLensAdapter(service), createBiopoliticalLensAdapter(service)],
  storage,
  settingsKey: "settings",
  initialState: ({ settings, registry }) => ({
    lang: settings.lang,
    lens: registry.ids()[0],
  }),
  localization: {
    catalogs: { en: { title: "Title" }, fr: { title: "Titre" } },
    supportedLanguages: ["en", "fr"],
    fallbackLanguage: "en",
  },
  regions: { shell: () => {} },
});

assert(Object.isFrozen(runtime), "platform runtime must be immutable");
assert(runtime.state.state.lang === "fr", "runtime did not compose persisted boot state");
assert(runtime.registry.ids().length === 2, "runtime did not compose both lenses");
runtime.renderer.renderAll();
const inspection = runtime.inspect();
assert(inspection.renderCycle === 1, "runtime inspection lost the render cycle");
assert(inspection.performance.entryCount === 1, "runtime did not measure its render region");
assert(Object.isFrozen(inspection), "runtime inspection must be immutable");

console.log("Platform runtime checks passed.");
