import fs from "node:fs";
import { PRODUCT_VERSION } from "./helpers/product-version.mjs";

const fail = (message) => {
  console.error(`Version authority check failed: ${message}`);
  process.exit(1);
};
const read = (file) => fs.readFileSync(file, "utf8");

const lock = JSON.parse(read("package-lock.json"));
const index = read("index.html");
const readme = read("README.md");
const app = read("src/app.js");
const capabilityMap = read("docs/capability-authority-map.md");
const executionPlan = read("docs/product-ui-execution-plan.md");
const versioning = read("docs/VERSIONING.md");
const operationalBaseline = "df41acca4dbf09e753104f22db18702c5e52da7e";

if (lock.version !== PRODUCT_VERSION || lock.packages?.[""]?.version !== PRODUCT_VERSION) {
  fail("package-lock mirrors do not match package.json");
}
if (!index.includes(`name="app-version" content="${PRODUCT_VERSION}"`)) {
  fail("index metadata does not match package.json");
}
if (!readme.includes(`Version \`${PRODUCT_VERSION}\``)) {
  fail("README release identity does not match package.json");
}
if (!capabilityMap.includes(`**Product version:** \`${PRODUCT_VERSION}\``)) {
  fail("capability map release identity does not match package.json");
}
if ((capabilityMap.match(new RegExp(operationalBaseline, "g")) || []).length !== 1) {
  fail("capability map must declare the accepted operational baseline exactly once");
}
for (const token of [
  "**Proposed roadmap authority:** Strategic Product Roadmap v3.0",
  "**Proposed execution authority:** Product + UI Execution Plan v1.0",
  "→ GATE-0 Human benchmark",
  "→ DECIDE-1",
]) {
  if (!capabilityMap.includes(token)) fail(`capability authority is missing: ${token}`);
}
for (const token of [
  `**Product authority:** \`${PRODUCT_VERSION}\``,
  "**Plan state:** proposed execution authority; no product-version change",
  "No big-bang rewrite is authorized.",
  "At least three complete trials per lens",
]) {
  if (!executionPlan.includes(token)) fail(`product/UI execution plan is missing: ${token}`);
}
for (const token of ["GATE-0", "UIX-1 ... UIX-4", "DECIDE-1"]) {
  if (!versioning.includes(token)) fail(`initiative identity policy is missing: ${token}`);
}
if (app.includes("2.1.0-alpha.")) {
  fail("runtime source contains a hard-coded product-version fallback");
}

console.log(`Version authority checks passed: ${PRODUCT_VERSION}`);
