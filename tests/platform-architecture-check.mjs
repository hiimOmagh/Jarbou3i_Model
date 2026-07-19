import fs from "node:fs";
import {
  createLensRegistry,
  defineLensAdapter,
  LENS_ADAPTER_METHODS,
} from "../src/core/lens-registry.js";
import { createStrategicLensAdapter } from "../src/lenses/strategic/adapter.js";
import { createBiopoliticalLensAdapter } from "../src/lenses/biopolitical/adapter.js";

const fail = (message) => {
  console.error(`Platform architecture check failed: ${message}`);
  process.exit(1);
};
const assert = (condition, message) => {
  if (!condition) fail(message);
};
const noop = () => {};
const services = {
  buildPrompt: () => "prompt",
  createSample: ({ lang }) => ({
    analysis_id: `sample-${lang}`,
    language: lang,
    subject: { title: "Sample" },
  }),
  renderEngineNav: noop,
  renderReview: noop,
};

const strategic = createStrategicLensAdapter(services);
const biopolitical = createBiopoliticalLensAdapter(services);
const registry = createLensRegistry([strategic, biopolitical]);

assert(Object.isFrozen(strategic), "lens adapters must be immutable");
assert(Object.isFrozen(biopolitical), "lens adapters must be immutable");
assert(Object.isFrozen(registry), "lens registry must be immutable");
assert(
  JSON.stringify(registry.ids()) === JSON.stringify(["strategic", "biopolitical"]),
  "both independent lens ids must be registered",
);
assert(registry.get("strategic").modelSectionCount === 6, "strategic adapter lost six-layer identity");
assert(registry.get("biopolitical").modelSectionCount === 9, "biopolitical adapter lost nine-pillar identity");
assert(
  LENS_ADAPTER_METHODS.every((method) => typeof strategic[method] === "function"),
  "strategic adapter is incomplete",
);
assert(
  LENS_ADAPTER_METHODS.every((method) => typeof biopolitical[method] === "function"),
  "biopolitical adapter is incomplete",
);

const payload = {
  analysis_id: "analysis-1",
  analysis_lens: "biopolitical",
  language: "fr",
  schema_version: "2.1.0",
  subject: { title: "Analyse" },
};
const envelope = registry.createEnvelope(payload, "strategic");
assert(envelope.lensId === "biopolitical", "canonical lens identity was not preserved");
assert(envelope.canonicalPayload === payload, "platform envelope must not copy or mutate canonical data");
assert(Object.isFrozen(envelope), "platform envelope must be immutable");

let invalidRejected = false;
try {
  defineLensAdapter({ id: "invalid" });
} catch {
  invalidRejected = true;
}
assert(invalidRejected, "incomplete lens adapter was accepted");

let duplicateRejected = false;
try {
  createLensRegistry([strategic, strategic]);
} catch {
  duplicateRejected = true;
}
assert(duplicateRejected, "duplicate lens id was accepted");

const index = fs.readFileSync("index.html", "utf8");
const app = fs.readFileSync("src/app.js", "utf8");
assert(
  index.includes('<script type="module" src="src/app.js"></script>'),
  "native module entry point is missing",
);
for (const token of [
  "createLensRegistry",
  "createStrategicLensAdapter",
  "createBiopoliticalLensAdapter",
  "activeLensAdapter().createSample",
  "activeLensAdapter().renderEngineNav()",
  "activeLensAdapter().renderReview()",
  "PLATFORM_RENDERER.renderAll()",
]) {
  assert(app.includes(token), `runtime is not routed through the platform contract: ${token}`);
}
for (const file of [
  "src/core/platform-state.js",
  "src/core/persistence.js",
  "src/core/localization.js",
  "src/core/render-regions.js",
]) {
  assert(fs.existsSync(file), `shared platform service is missing: ${file}`);
}

console.log("Platform architecture checks passed.");
