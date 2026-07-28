import fs from "node:fs";
import vm from "node:vm";

const fail = (message) => {
  console.error(`AI interchange reliability check failed: ${message}`);
  process.exit(1);
};

const window = {};
window.window = window;
const context = vm.createContext({ window, URL });
for (const file of [
  "src/biopolitics-schema-validator.js",
  "src/biopolitics-sample-i18n.js",
  "src/biopolitics.js",
  "src/ai-interchange.js",
  "src/biopolitics-integrity.js",
  "src/json-parser.js",
  "src/contract-repair.js",
]) {
  new vm.Script(fs.readFileSync(file, "utf8"), { filename: file }).runInContext(
    context,
  );
}

const malformed = String.raw`{
  "schema_version":"2.1.0",
  "analysis_contract":"biopolitical-training-map-v2",
  "contract_status":"canonical",
  "analysis_lens":"biopolitical",
  "international_comparison":["CMP1":{"transfer_limits":"one limit"}],
  "theoretical_comparison":{"THEORY1":{"tradition":"Theory"}},
  "human_functions":{"HF1":{"name":"Function"}},
  "power_map":{"actors":[{"id":"ACT1","accountability":["Public review","medium"]}]},
  "meaning_systems":{"regimes_of_truth":[{"excluded_knowledge":"local knowledge"}]},
  "evidence":{"items":[{"id":"E1","claim":"Keep this claim exactly"}]}
}`;

const parsed = window.Jarbou3iJson.extractJson(malformed);
if (!parsed.recovered) fail("labeled array entry was not recovered");
if (parsed.value.international_comparison[0].id !== "CMP1") {
  fail("labeled array ID was not preserved");
}
const repaired = window.Jarbou3iContractRepair.repairBiopolitical(parsed.value);
if (!Array.isArray(repaired.value.theoretical_comparison)) {
  fail("theoretical comparison map was not converted to an array");
}
if (!Array.isArray(repaired.value.human_functions)) {
  fail("human-function map was not converted to an array");
}
if (!Array.isArray(repaired.value.international_comparison[0].transfer_limits)) {
  fail("transfer_limits scalar was not wrapped");
}
if (
  !Array.isArray(
    repaired.value.meaning_systems.regimes_of_truth[0].excluded_knowledge,
  )
) {
  fail("excluded_knowledge scalar was not wrapped");
}
if (
  repaired.value.power_map.actors[0].confidence !== "medium" ||
  repaired.value.power_map.actors[0].accountability.length !== 1
) {
  fail("misplaced actor confidence was not recovered safely");
}
if (repaired.value.evidence.items[0].claim !== "Keep this claim exactly") {
  fail("analytical content changed during shape repair");
}
if (repaired.repairs.length !== 5) {
  fail(`expected five contract repairs, received ${repaired.repairs.length}`);
}

let ambiguousRejected = false;
try {
  window.Jarbou3iJson.extractJson(
    '{"items":["CMP1":{"id":"DIFFERENT","value":"ambiguous"}]}',
  );
} catch {
  ambiguousRejected = true;
}
if (!ambiguousRejected) {
  fail("ambiguous labeled-array identity must fail closed");
}

const strategic = { analysis_lens: "strategic", actors: { A1: { name: "A" } } };
const untouched = window.Jarbou3iContractRepair.repairBiopolitical(strategic);
if (untouched.value !== strategic || untouched.repairs.length) {
  fail("out-of-scope contracts must not be rewritten");
}

const fixture = JSON.parse(
  fs.readFileSync("fixtures/sample-analysis-bio-en.json", "utf8"),
);
const interchangeFrom = (sourceFixture) => ({
  contract: "jarbou3i-ai-interchange/1",
  lens: "biopolitical",
  language: sourceFixture.language,
  mode: sourceFixture.model_mode,
  analysis_id: sourceFixture.analysis_id,
  subject: sourceFixture.subject,
  framing: sourceFixture.framing,
  legal_framework: sourceFixture.legal_framework,
  international_comparison: sourceFixture.international_comparison,
  capture_levels: Object.fromEntries(
    sourceFixture.capture_levels.map(({ level, ...item }) => [level, item]),
  ),
  theoretical_comparison: sourceFixture.theoretical_comparison,
  human_functions: sourceFixture.human_functions,
  power: sourceFixture.power_map,
  mechanisms: sourceFixture.mechanisms,
  meaning: sourceFixture.meaning_systems,
  intervention: {
    interventions: sourceFixture.intervention_assessment.interventions,
    capture: {
      ...sourceFixture.intervention_assessment.capture_assessment,
      criteria: Object.fromEntries(
        sourceFixture.intervention_assessment.capture_assessment.criteria.map(
          ({ criterion, ...item }) => [criterion, item],
        ),
      ),
    },
    care_control_tensions:
      sourceFixture.intervention_assessment.care_control_tensions,
  },
  scale_time: sourceFixture.scale_time,
  distribution: sourceFixture.distribution,
  consent_exit: sourceFixture.consent_exit,
  explanations: Object.fromEntries(
    sourceFixture.competing_explanations.map(({ type, ...item }) => [type, item]),
  ),
  evidence: sourceFixture.evidence.items,
  assumptions: sourceFixture.assumptions.items,
  resistance: sourceFixture.resistance_agency.items,
  alternatives: sourceFixture.alternatives.items,
  conclusion: sourceFixture.calibrated_conclusion,
  self_audit: sourceFixture.self_audit,
  self_audit_notes: sourceFixture.self_audit_notes,
  links: sourceFixture.links,
});
const interchange = interchangeFrom(fixture);

const compiler = window.Jarbou3iAiInterchange;
const compiled = compiler.compile(interchange, {
  generatedAt: fixture.generated_at,
});
if (
  compiled.value.analysis_contract !== "biopolitical-training-map-v2" ||
  compiled.value.contract_status !== "canonical"
) {
  fail("complete interchange result was not compiled to the canonical target");
}
const compiledValidation =
  window.Jarbou3iBiopoliticsIntegrity.validateImport(compiled.value);
if (!compiledValidation.ok || !compiledValidation.canonical) {
  fail(
    `complete interchange result failed canonical validation: ${JSON.stringify(compiledValidation.errors)}`,
  );
}
if (
  compiled.value.subject.executive_finding !==
  fixture.subject.executive_finding
) {
  fail("compiler rewrote analytical content");
}
for (const lang of ["ar", "fr"]) {
  const localizedFixture = JSON.parse(
    fs.readFileSync(`fixtures/sample-analysis-bio-${lang}.json`, "utf8"),
  );
  const localizedCompiled = compiler.compile(
    interchangeFrom(localizedFixture),
    { generatedAt: localizedFixture.generated_at },
  );
  const localizedValidation =
    window.Jarbou3iBiopoliticsIntegrity.validateImport(
      localizedCompiled.value,
    );
  if (
    !localizedValidation.ok ||
    !localizedValidation.canonical ||
    localizedCompiled.value.subject.executive_finding !==
      localizedFixture.subject.executive_finding
  ) {
    fail(`${lang} interchange compilation did not remain canonical and lossless`);
  }
}

const unknownInterchange = structuredClone(interchange);
unknownInterchange.provider_note = "preserve me";
const unknownCompilation = compiler.compile(unknownInterchange, {
  generatedAt: fixture.generated_at,
});
const extension = unknownCompilation.audit.quarantine.find(
  (item) => item.path === "/provider_note",
);
if (!extension || extension.value !== "preserve me") {
  fail("unknown interchange property was not preserved in the audit");
}
if ("provider_note" in unknownCompilation.value) {
  fail("unknown interchange property leaked into the canonical payload");
}

const extraCanonical = structuredClone(fixture);
extraCanonical.theoretical_comparison[0].confidence = "medium";
const extraRepair =
  window.Jarbou3iContractRepair.repairBiopolitical(extraCanonical);
if (
  extraRepair.value.theoretical_comparison[0].confidence !== undefined ||
  extraRepair.quarantine[0]?.path !==
    "/theoretical_comparison/0/confidence" ||
  extraRepair.quarantine[0]?.value !== "medium"
) {
  fail("safe additional property was not quarantined with its original value");
}
if (
  !window.Jarbou3iBiopoliticsIntegrity.validateImport(extraRepair.value).ok
) {
  fail("quarantined canonical result did not become importable");
}

const incompleteInterchange = structuredClone(interchange);
delete incompleteInterchange.human_functions[0].scientific_definition;
const incompleteCompilation = compiler.compile(incompleteInterchange, {
  generatedAt: fixture.generated_at,
});
const incompleteCanonical =
  window.Jarbou3iBiopoliticsIntegrity.validateImport(
    incompleteCompilation.value,
  );
if (incompleteCanonical.ok) {
  fail("structurally incomplete interchange was promoted to canonical");
}
const reviewableDraft = compiler.asReviewableDraft(
  incompleteCompilation.value,
  incompleteCanonical.errors,
);
const draftValidation =
  window.Jarbou3iBiopoliticsIntegrity.validateImport(reviewableDraft);
if (
  !draftValidation.ok ||
  draftValidation.canonical ||
  draftValidation.state !== "generated_draft" ||
  !draftValidation.warnings.some(
    (item) => item.code === "GENERATED_DRAFT_NOT_CANONICAL",
  )
) {
  fail("incomplete interchange was not preserved as a generated draft");
}

let truncationDetected = false;
try {
  window.Jarbou3iJson.extractJson(
    '{"contract":"jarbou3i-ai-interchange/1","subject":{"title":"cut off"',
  );
} catch (error) {
  truncationDetected = error.code === "TRUNCATED_JSON";
}
if (!truncationDetected) {
  fail("truncated JSON was not classified explicitly");
}

const compactTemplate = compiler.buildTemplate("en", "research");
const canonicalTemplate =
  window.Jarbou3iBiopolitics.buildSchemaTemplate("en", "research", "web");
if (
  !compactTemplate.includes('"contract":"jarbou3i-ai-interchange/1"') ||
  compactTemplate.length >= canonicalTemplate.length * 0.8
) {
  fail(
    `interchange template is not materially smaller (${compactTemplate.length} vs ${canonicalTemplate.length})`,
  );
}

console.log("AI interchange reliability checks passed.");
