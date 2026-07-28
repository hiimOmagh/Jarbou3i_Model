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
if (app.includes("2.1.0-alpha.")) {
  fail("runtime source contains a hard-coded product-version fallback");
}

console.log(`Version authority checks passed: ${PRODUCT_VERSION}`);
