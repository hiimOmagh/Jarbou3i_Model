import fs from "node:fs";
import vm from "node:vm";

const fail = (message) => {
  console.error(`Biopolitical integrity check failed: ${message}`);
  process.exit(1);
};
const readJson = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const clone = (value) => structuredClone(value);

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
const fixture = readJson("fixtures/sample-analysis-bio-en.json");

const valid = integrity.validateImport(fixture);
if (!valid.ok || !valid.canonical) {
  fail(`canonical fixture rejected: ${JSON.stringify(valid.errors)}`);
}
if (JSON.stringify(valid.analysis) !== JSON.stringify(fixture)) {
  fail("canonical runtime validation or normalization changed valid source data");
}

function expectError(mutator, code, label) {
  const data = clone(fixture);
  mutator(data);
  const result = integrity.validateImport(data);
  if (result.ok) fail(`${label}: invalid analysis was accepted`);
  if (!result.errors.some((error) => error.code === code)) {
    fail(`${label}: expected ${code}, got ${result.errors.map((error) => error.code).join(", ")}`);
  }
}

expectError(
  (data) => {
    data.power_map.actors[0].id = data.evidence.items[0].id;
  },
  "DUPLICATE_GLOBAL_ID",
  "global ID uniqueness",
);
expectError(
  (data) => {
    data.links[0].to = "MISSING-ID";
  },
  "BROKEN_REFERENCE",
  "typed link references",
);
expectError(
  (data) => {
    data.intervention_assessment.capture_assessment.criteria[1].criterion =
      data.intervention_assessment.capture_assessment.criteria[0].criterion;
  },
  "CAPTURE_CRITERIA_INCOMPLETE",
  "exact capture-criterion set",
);
expectError(
  (data) => {
    data.competing_explanations[1].type = data.competing_explanations[0].type;
  },
  "EXPLANATION_FAMILIES_INCOMPLETE",
  "exact explanation-family set",
);
expectError(
  (data) => {
    data.capture_levels[1].level = data.capture_levels[0].level;
  },
  "CAPTURE_LEVELS_INCOMPLETE",
  "exact capture-level set",
);
expectError(
  (data) => {
    data.evidence.items[0].verification_status = "verified";
    data.evidence.items[0].verified_by = "QA reviewer";
    data.evidence.items[0].verification_date = "2026-07-17";
    data.evidence.items[0].source_date = "2026-01-01";
    data.evidence.items[0].source_locator = "section 1";
    data.evidence.items[0].source_title = "Placeholder source — replace with verified source";
  },
  "UNTRACEABLE_VERIFIED_EVIDENCE",
  "placeholder score-gaming defense",
);
expectError(
  (data) => {
    data.self_audit.statistics_quotations_verified = "pass";
  },
  "SELF_AUDIT_VERIFICATION_CONTRADICTION",
  "self-audit consistency",
);

const malformed = clone(fixture);
malformed.evidence.items[0].sample_size = 25;
const malformedResult = integrity.validateImport(malformed);
if (
  malformedResult.ok ||
  !malformedResult.errors.some((error) => error.code === "SCHEMA_TYPE")
) {
  fail("runtime schema validation did not reject a malformed field type");
}

const future = clone(fixture);
future.schema_version = "99.0.0";
const futureResult = integrity.validateImport(future);
if (
  futureResult.ok ||
  !futureResult.errors.some((error) => error.code === "UNSUPPORTED_CONTRACT")
) {
  fail("future schema versions must be rejected explicitly");
}

const legacy = readJson("fixtures/sample-analysis-bio-en.legacy-v1.json");
const draft = integrity.validateImport(legacy);
if (!draft.ok || draft.canonical || draft.state !== "migrated_draft") {
  fail("legacy input did not remain an explicitly non-canonical draft");
}
if (!draft.warnings.some((warning) => warning.code === "MIGRATED_DRAFT_NOT_CANONICAL")) {
  fail("migrated draft warning is missing");
}

const health = bio.health(valid.analysis, "en");
if (health.publishable || health.evidence.verification !== 0) {
  fail("unverified placeholder fixtures must never pass the publication gate");
}

console.log("Biopolitical integrity checks passed.");
