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

const missingVerifier = clone(fixture);
Object.assign(missingVerifier.evidence.items[0], {
  source_title: "Reviewed source",
  source_url: "https://example.org/reviewed-source",
  source_locator: "section 1",
  source_date: "2026-01-01",
  verification_status: "verified",
  verified_by: "",
  verification_date: "",
  claim_source_fit: "direct",
});
missingVerifier.self_audit.statistics_quotations_verified = "pass";
const missingVerifierResult = integrity.validateImport(missingVerifier);
if (!missingVerifierResult.ok || !missingVerifierResult.canonical) {
  fail(`missing-verifier evidence was not imported for review: ${JSON.stringify(missingVerifierResult.errors)}`);
}
if (
  missingVerifierResult.analysis.evidence.items[0].verification_status !==
  "partially_verified"
) {
  fail("full verification without audit provenance was not downgraded");
}
for (const code of [
  "VERIFICATION_PROVENANCE_DOWNGRADED",
  "SELF_AUDIT_VERIFICATION_CONTRADICTION",
]) {
  if (!missingVerifierResult.warnings.some((warning) => warning.code === code)) {
    fail(`missing-verifier import omitted warning ${code}`);
  }
}
if (bio.health(missingVerifierResult.analysis, "en").publishable) {
  fail("downgraded verification provenance must remain publication-blocked");
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
    "missing explanation claim",
    (data) => {
      const explanation = data.competing_explanations.find(
        (item) => item.relevance === "relevant",
      );
      explanation.claim = "";
    },
    "MISSING_EXPLANATION_CLAIM",
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

// The no-source prompt asks for a placeholder evidence record that nothing
// cites. It is still not publication-ready, but it is not an uncited source,
// and it scores the same in every language.
const placeholderScores = new Set();
for (const lang of ["en", "ar", "fr"]) {
  const [placeholderItem] = JSON.parse(bio.buildSchemaTemplate(lang, "research", "none")).evidence.items;
  const data = clone(fixture);
  const uncited = {
    ...clone(data.evidence.items[0]),
    id: "E98",
    source_title: "Regulation (EU) 2021/953",
    source_url: "https://eur-lex.europa.eu/eli/reg/2021/953/oj",
  };
  data.evidence.items.push({ ...placeholderItem, id: "E99" }, uncited);
  const result = integrity.validateImport(data);
  const at = (code, id) =>
    result.warnings.some(
      (warning) =>
        warning.code === code &&
        warning.path.startsWith(`/evidence/items/${data.evidence.items.findIndex((item) => item.id === id)}`),
    );
  if (at("UNREFERENCED_EVIDENCE", "E99")) {
    fail(`${lang} placeholder evidence was reported as not cited`);
  }
  if (!at("EVIDENCE_NOT_PUBLICATION_READY", "E99")) {
    fail(`${lang} placeholder evidence was not reported as not publication-ready`);
  }
  if (!at("UNREFERENCED_EVIDENCE", "E98")) {
    fail(`${lang}: an uncited real source was not reported`);
  }
  placeholderScores.add(bio.scores(data).evidence);
}
if (placeholderScores.size !== 1) {
  fail(`placeholder evidence scores differ by language: ${[...placeholderScores]}`);
}

// Scoring and import validation must agree on which titles mark a placeholder.
const scoreWithTitle = (title) => {
  const data = clone(fixture);
  data.evidence.items[0].source_title = title;
  return bio.scores(data).evidence;
};
const placeholderScore = scoreWithTitle("Placeholder source");
for (const title of [
  "Replace with a real source",
  "Example source",
  "Sample source",
  "Source à remplacer",
  "Source d’exemple",
  "Substitut bloquant la publication",
  "استبدل بمصدر حقيقي",
  "مصدر مثال",
  "عنصر نائب",
]) {
  if (!integrity.placeholderPattern.test(title)) {
    fail(`import validation does not treat "${title}" as a placeholder`);
  }
  if (scoreWithTitle(title) !== placeholderScore) {
    fail(`evidence scoring does not treat "${title}" as a placeholder`);
  }
}

// Models reword the placeholder's title (ChatGPT did in French and Arabic), so
// the record is also known by its shape: the only evidence, with no source
// URL, cited by nothing.
const rewordedPlaceholderTitles = {
  en: "Procedural stand-in entry required by the no-access mode",
  ar: "عنصر دليل نائب صريح لغياب الوصول الخارجي",
  fr: "Entrée substitutive procédurale imposée par le mode sans accès externe",
};
const clearEvidenceReferences = (value) => {
  if (!value || typeof value !== "object") return;
  for (const [key, child] of Object.entries(value)) {
    if (["evidence_ids", "supporting_evidence_ids", "counter_evidence_ids", "evidence_of_benefit"].includes(key)) {
      value[key] = [];
    } else {
      clearEvidenceReferences(child);
    }
  }
};
for (const lang of ["en", "ar", "fr"]) {
  const [placeholderItem] = JSON.parse(bio.buildSchemaTemplate(lang, "research", "none")).evidence.items;
  const onlyEvidence = (changes) => {
    const data = clone(fixture);
    clearEvidenceReferences(data);
    data.evidence.items = [{
      ...placeholderItem,
      epistemic_type: "verified_fact",
      source_locator: "Procedural instruction",
      confidence: "high",
      ...changes,
    }];
    return data;
  };
  const reworded = onlyEvidence({ source_title: rewordedPlaceholderTitles[lang] });
  const { warnings } = integrity.validateImport(reworded);
  if (warnings.some((warning) => warning.code === "UNREFERENCED_EVIDENCE")) {
    fail(`${lang} reworded placeholder was reported as an uncited source`);
  }
  if (!warnings.some((warning) => warning.code === "EVIDENCE_NOT_PUBLICATION_READY" && warning.review_only === false)) {
    fail(`${lang} reworded placeholder was taken for real evidence awaiting review`);
  }
  if (bio.scores(reworded).evidence !== bio.scores(onlyEvidence({})).evidence) {
    fail(`${lang} reworded placeholder scored as real evidence`);
  }
  // A single uncited record with a source URL is a source, not the placeholder.
  const sourced = onlyEvidence({
    source_title: rewordedPlaceholderTitles[lang],
    source_url: "https://eur-lex.europa.eu/eli/reg/2021/953/oj",
  });
  if (!integrity.validateImport(sourced).warnings.some((warning) => warning.code === "UNREFERENCED_EVIDENCE")) {
    fail(`${lang}: a single uncited source with a URL was taken for the placeholder`);
  }
}

console.log("Biopolitical integrity checks passed.");
