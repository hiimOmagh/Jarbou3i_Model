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
const reviewRequired = clone(fixture);
reviewRequired.evidence.items[0].source_url = "not-a-url";
reviewRequired.self_audit.statistics_quotations_verified = "pass";
const reviewRequiredResult = integrity.validateImport(reviewRequired);
if (!reviewRequiredResult.ok || !reviewRequiredResult.canonical) {
  fail(`review-required canonical analysis was rejected: ${JSON.stringify(reviewRequiredResult.errors)}`);
}
for (const code of [
  "INVALID_SOURCE_URL",
  "SELF_AUDIT_VERIFICATION_CONTRADICTION",
]) {
  if (!reviewRequiredResult.warnings.some((warning) => warning.code === code)) {
    fail(`review-required import omitted warning ${code}`);
  }
}
if (bio.health(reviewRequiredResult.analysis, "en").publishable) {
  fail("review-required import must remain blocked from publication");
}
if (
  reviewRequiredResult.analysis.evidence.items[0].source_url !== "" ||
  reviewRequiredResult.analysis.self_audit.statistics_quotations_verified !==
    "concern"
) {
  fail("safe review-state contradictions were not normalized on import");
}

expectError(
  (data) => {
    const item = data.evidence.items[0];
    item.source_url = "not-a-url";
    item.source_locator = "section 1";
    item.source_title = "Reviewed source";
    item.source_date = "2026-01-01";
    item.verification_status = "verified";
    item.verified_by = "QA reviewer";
    item.verification_date = "2026-07-17";
    item.claim_source_fit = "direct";
  },
  "INVALID_SOURCE_URL",
  "verified evidence provenance",
);

for (const [label, mutator, code] of [
  [
    "missing explanation falsifier",
    (data) => {
      const explanation = data.competing_explanations.find(
        (item) => item.relevance === "relevant",
      );
      explanation.falsified_if = [];
    },
    "MISSING_EXPLANATION_FALSIFIER",
  ],
  [
    "incomplete quantitative design metadata",
    (data) => {
      data.evidence.items[0].epistemic_type = "quantitative_estimate";
      data.evidence.items[0].sample_size = "";
    },
    "QUANTITATIVE_METADATA_MISSING",
  ],
]) {
  const data = clone(fixture);
  mutator(data);
  const result = integrity.validateImport(data);
  if (!result.ok || !result.warnings.some((warning) => warning.code === code)) {
    fail(`${label}: review-required analysis was not imported with ${code}`);
  }
  if (bio.health(result.analysis, "en").publishable) {
    fail(`${label}: review-required analysis passed the publication gate`);
  }
}

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

const citationPolluted = clone(fixture);
citationPolluted.subject.executive_finding =
  "Portable finding. \uE200cite\uE202turn7search2\uE201";
citationPolluted.evidence.items[0].limitations =
  "Traceable limit \uE200filecite\uE202turn0file0\uE202L5-L10\uE201.";
const citationResult = integrity.validateImport(citationPolluted);
if (!citationResult.ok) {
  fail("non-portable assistant citations should be repaired without rejecting valid analysis");
}
const citationWarning = citationResult.warnings.find(
  (warning) => warning.code === "NON_PORTABLE_CITATION_MARKERS_REMOVED",
);
if (!citationWarning || citationWarning.count !== 2) {
  fail("citation repair must disclose the exact number of removed markers");
}
const repairedText = JSON.stringify(citationResult.analysis);
if (/[\uE000-\uF8FF]/.test(repairedText) || /turn7search2|turn0file0/.test(repairedText)) {
  fail("citation repair leaked assistant-interface identifiers or private-use glyphs");
}
if (!repairedText.includes("Portable finding.") || !repairedText.includes("Traceable limit.")) {
  fail("citation repair removed authored analytical text");
}
for (const phrase of [
  "Exemple : résultat",
  "Constat ; réserve",
  "Attention !",
  "Pourquoi ?",
]) {
  if (bio.sanitizePortableText(phrase) !== phrase) {
    fail(`citation repair changed authored French punctuation: ${phrase}`);
  }
}

console.log("Biopolitical integrity checks passed.");
