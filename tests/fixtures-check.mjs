import fs from "node:fs";
import vm from "node:vm";

const fail = (message) => {
  console.error(`Fixture check failed: ${message}`);
  process.exit(1);
};
const readJson = (file) => JSON.parse(fs.readFileSync(file, "utf8"));

const window = {};
window.window = window;
const context = vm.createContext({ window, URL });
for (const file of [
  "src/biopolitics-schema-validator.js",
  "src/biopolitics-sample-i18n.js",
  "src/biopolitics.js",
  "src/biopolitics-integrity.js",
]) {
  new vm.Script(fs.readFileSync(file, "utf8"), { filename: file }).runInContext(
    context,
  );
}
const bio = window.Jarbou3iBiopolitics;
const integrity = window.Jarbou3iBiopoliticsIntegrity;

for (const lang of ["ar", "en", "fr"]) {
  const file = `fixtures/sample-analysis-${lang}.json`;
  const data = readJson(file);
  if (data.schema_version !== "1.1.0" || data.analysis_lens !== "strategic") {
    fail(`${file}: wrong strategic contract`);
  }
  for (const key of [
    "interests",
    "actors",
    "tools",
    "narrative",
    "results",
    "feedback",
  ]) {
    if (!Array.isArray(data[key]) || !data[key].length) {
      fail(`${file}: ${key} must contain records`);
    }
  }
}

for (const lang of ["ar", "en", "fr"]) {
  const file = `fixtures/sample-analysis-bio-${lang}.json`;
  const data = readJson(file);
  const validation = integrity.validateImport(data);
  if (!validation.ok || !validation.canonical) {
    fail(`${file}: canonical integrity failed: ${JSON.stringify(validation.errors)}`);
  }
  if (data.intervention_assessment.capture_assessment.criteria.length !== 13) {
    fail(`${file}: capture assessment must contain exactly 13 criteria`);
  }
  if (data.competing_explanations.length !== 9) {
    fail(`${file}: exactly nine explanation families are required`);
  }
  if (data.capture_levels.length !== 5) {
    fail(`${file}: exactly five capture levels are required`);
  }
  if (!data.legal_framework || !data.international_comparison.length) {
    fail(`${file}: legal and international comparison sections are required`);
  }
  if (!data.theoretical_comparison.length) {
    fail(`${file}: theoretical comparison is required`);
  }
  const health = bio.health(validation.analysis, lang);
  if (health.publishable) {
    fail(`${file}: fixture placeholders must not be presented as publishable`);
  }
  if (!health.missing.some((entry) => /verif|تحقق|vérif/i.test(entry))) {
    fail(`${file}: publication blockers must disclose evidence verification gaps`);
  }
  if (bio.scores(validation.analysis).structural < 90) {
    fail(`${file}: fixture should remain structurally complete`);
  }
}

const french = readJson("fixtures/sample-analysis-bio-fr.json");
const arabic = readJson("fixtures/sample-analysis-bio-ar.json");
if (!/[À-ÿ]/.test(JSON.stringify(french)) || !/[\u0600-\u06ff]/.test(JSON.stringify(arabic))) {
  fail("localized fixtures must contain substantive French and Arabic prose");
}

const legacy = readJson("fixtures/sample-analysis-bio-en.legacy-v1.json");
const migrated = integrity.validateImport(legacy);
if (!migrated.ok || migrated.canonical || migrated.state !== "migrated_draft") {
  fail("legacy input must become a valid, explicitly non-canonical migrated draft");
}
if (
  migrated.analysis.schema_version !== bio.DRAFT_SCHEMA_VERSION ||
  migrated.analysis.analysis_contract !== bio.DRAFT_CONTRACT ||
  migrated.analysis.contract_status !== "migrated_draft"
) {
  fail("legacy migration was falsely stamped with the canonical identity");
}
if (migrated.analysis.power_map.actors.length) {
  fail("legacy migration must not invent governing actors");
}

console.log("Fixture checks passed.");
