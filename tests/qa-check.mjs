import fs from "node:fs";
import { execFileSync } from "node:child_process";

const fail = (message) => {
  console.error(`QA check failed: ${message}`);
  process.exit(1);
};
const read = (file) => fs.readFileSync(file, "utf8");

const index = read("index.html");
const app = read("src/app.js");
const bio = read("src/biopolitics.js");
const integrity = read("src/biopolitics-integrity.js");
const graph = read("src/biopolitics-graph.js");
const referenceUi = read("src/reference-ui.js");
const explorer = read("src/relationship-explorer.js");
const parser = read("src/json-parser.js");
const css = read("src/styles.css");
const pkg = JSON.parse(read("package.json"));

for (const [file, source] of [
  ["src/biopolitics.js", bio],
  ["src/biopolitics-integrity.js", integrity],
  ["src/biopolitics-graph.js", graph],
  ["src/reference-ui.js", referenceUi],
  ["src/relationship-explorer.js", explorer],
  ["src/json-parser.js", parser],
  ["src/app.js", app],
  ["src/core/lens-registry.js", read("src/core/lens-registry.js")],
  ["src/core/performance.js", read("src/core/performance.js")],
  ["src/core/platform-runtime.js", read("src/core/platform-runtime.js")],
  ["src/core/render-regions.js", read("src/core/render-regions.js")],
  ["src/core/results-inspection.js", read("src/core/results-inspection.js")],
  ["src/core/relationship-intelligence.js", read("src/core/relationship-intelligence.js")],
  ["src/core/evidence-intelligence.js", read("src/core/evidence-intelligence.js")],
  ["src/core/evidence-traceability.js", read("src/core/evidence-traceability.js")],
]) {
  try {
    void source;
    execFileSync(process.execPath, ["--check", file], { stdio: "pipe" });
  } catch (error) {
    fail(`${file} syntax error: ${error.stderr?.toString().trim() || error.message}`);
  }
}

const ids = [...index.matchAll(/id="([^"]+)"/g)].map((match) => match[1]);
if (new Set(ids).size !== ids.length) fail("duplicate static DOM IDs found");
if (index.length > 50_000) fail("index.html must remain a thin shell");
if (/<style>[\s\S]*<\/style>/.test(index) || /<script>[\s\S]*<\/script>/.test(index)) {
  fail("inline style or script found");
}

for (const file of [
  "src/app.js",
  "src/biopolitics.js",
  "src/biopolitics-integrity.js",
  "src/biopolitics-graph.js",
  "src/biopolitical-report.js",
  "src/reference-ui.js",
  "src/relationship-explorer.js",
  "src/relationship-explorer.css",
  "src/biopolitics-schema-validator.js",
  "src/biopolitics-sample-i18n.js",
  "src/json-parser.js",
  "src/styles.css",
  "src/core/lens-registry.js",
  "src/core/platform-state.js",
  "src/core/persistence.js",
  "src/core/localization.js",
  "src/core/render-regions.js",
  "src/core/performance.js",
  "src/core/platform-runtime.js",
  "src/core/provenance.js",
  "src/core/results-inspection.js",
  "src/core/relationship-intelligence.js",
  "src/core/evidence-intelligence.js",
  "src/core/evidence-traceability.js",
  "src/lenses/strategic/adapter.js",
  "src/lenses/biopolitical/adapter.js",
  "schema/strategic-analysis.schema.json",
  "schema/biopolitical-analysis.schema.json",
  "schema/biopolitical-migrated-draft.schema.json",
]) {
  if (!fs.existsSync(file)) fail(`missing required file: ${file}`);
}

if (!index.includes('<script type="module" src="src/app.js"></script>')) {
  fail("native module entry point is missing");
}
const scriptOrder = [
  "src/biopolitics-schema-validator.js",
  "src/biopolitics-sample-i18n.js",
  "src/core/provenance.js",
  "src/biopolitics.js",
  "src/biopolitics-integrity.js",
  "src/biopolitics-graph.js",
  "src/biopolitical-report.js",
  "src/reference-ui.js",
  "src/relationship-explorer.js",
  "src/json-parser.js",
].map((file) => app.indexOf(`import "./${file.slice(4)}";`));
if (scriptOrder.some((position) => position < 0)) fail("runtime side-effect import is missing");
if (scriptOrder.some((position, index) => index && position <= scriptOrder[index - 1])) {
  fail("runtime side-effect imports load in an unsafe order");
}

if (pkg.version !== "2.1.0-alpha.41") fail("package version is wrong");
if (!index.includes('name="app-version" content="2.1.0-alpha.41"')) {
  fail("app version metadata is wrong");
}
for (const token of [
  'const SCHEMA_VERSION = "2.1.0"',
  'const APP_CONTRACT = "biopolitical-training-map-v2"',
  "function route(",
  "function migrateLegacy(",
  "function evidenceAssessment(",
  "function health(",
  "displayToken,",
  "auditLabel,",
]) {
  if (!bio.includes(token)) fail(`biopolitical runtime token missing: ${token}`);
}
for (const token of [
  "BIO_INTEGRITY.validateImport",
  "JSON_TOOLS.extractJson",
  "buildLosslessBiopoliticalReport",
  'id="canonical-analysis"',
  'id="exportJson"',
  'aria-controls="reviewContent"',
  'aria-expanded="',
]) {
  if (!app.includes(token)) fail(`application integration token missing: ${token}`);
}
if (!css.includes(".canonicalInspector") || !css.includes(".bioAuditGrid")) {
  fail("review/export styles are missing");
}
if (fs.existsSync("Editorial_Intelligence_v2.html") || fs.existsSync("TM_BrainMap.html")) {
  fail("legacy external-dependency pages remain in the release root; run npm run upgrade:layout once, then rerun QA");
}

for (const script of [
  "test:bio:v2",
  "test:bio:integrity",
  "test:bio:graph",
  "test:bio:report",
  "test:platform",
  "test:platform:services",
  "test:provenance",
  "test:parser",
  "test:i18n:bio",
  "test:ci:no-browser",
  "test:ci:browser",
  "test:ci",
  "upgrade:layout",
  "test:layout:migration",
]) {
  if (!pkg.scripts?.[script]) fail(`package script missing: ${script}`);
}

console.log("QA checks passed.");
