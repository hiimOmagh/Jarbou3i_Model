import fs from "node:fs";
import vm from "node:vm";

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
]) {
  try {
    new vm.Script(source, { filename: file });
  } catch (error) {
    fail(`${file} syntax error: ${error.message}`);
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
  "src/reference-ui.js",
  "src/relationship-explorer.js",
  "src/relationship-explorer.css",
  "src/biopolitics-schema-validator.js",
  "src/biopolitics-sample-i18n.js",
  "src/json-parser.js",
  "src/styles.css",
  "schema/strategic-analysis.schema.json",
  "schema/biopolitical-analysis.schema.json",
  "schema/biopolitical-migrated-draft.schema.json",
]) {
  if (!fs.existsSync(file)) fail(`missing required file: ${file}`);
}

const scriptOrder = [
  "src/biopolitics-schema-validator.js",
  "src/biopolitics-sample-i18n.js",
  "src/biopolitics.js",
  "src/biopolitics-integrity.js",
  "src/biopolitics-graph.js",
  "src/reference-ui.js",
  "src/relationship-explorer.js",
  "src/json-parser.js",
  "src/app.js",
].map((file) => index.indexOf(`src="${file}" defer`));
if (scriptOrder.some((position) => position < 0)) fail("runtime script is missing");
if (scriptOrder.some((position, index) => index && position <= scriptOrder[index - 1])) {
  fail("runtime scripts load in an unsafe order");
}

if (pkg.version !== "2.0.0-bio-rc.16") fail("package version is wrong");
if (!index.includes('name="app-version" content="2.0.0-bio-rc.16"')) {
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
