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
if (!compiler.canRecoverAsDraft(incompleteCanonical)) {
  fail("analytical completion gap was not classified as reviewable");
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

const reusedCanonical = structuredClone(fixture);
while (reusedCanonical.evidence.items.length < 8) {
  const index = reusedCanonical.evidence.items.length;
  reusedCanonical.evidence.items.push({
    ...structuredClone(reusedCanonical.evidence.items[index % 2]),
    id: `E${index + 1}`,
  });
}
reusedCanonical.evidence.items.forEach((item) => {
  item.counter_evidence = "";
});
const reusedValidation =
  window.Jarbou3iBiopoliticsIntegrity.validateImport(reusedCanonical);
if (
  reusedValidation.ok ||
  reusedValidation.errors.length !== 8 ||
  !reusedValidation.errors.every(
    (item) =>
      item.code === "SCHEMA_MINLENGTH" &&
      /\/evidence\/items\/\d+\/counter_evidence$/.test(item.path),
  )
) {
  fail("observed eight-gap canonical reuse case was not reproduced");
}
if (!compiler.canRecoverAsDraft(reusedValidation)) {
  fail("canonical-shaped AI completion gaps were not recoverable");
}
const reusedDraft = compiler.asReviewableDraft(
  reusedCanonical,
  reusedValidation.errors,
  { origin: "canonical" },
);
const reusedDraftValidation =
  window.Jarbou3iBiopoliticsIntegrity.validateImport(reusedDraft);
if (
  !reusedDraftValidation.ok ||
  reusedDraftValidation.canonical ||
  reusedDraft.migration.from_schema !==
    "biopolitical-training-map-v2@2.1.0" ||
  reusedDraft.migration.adapter !==
    "canonical-ai-result-to-reviewable-draft-v1" ||
  reusedDraft.evidence.items.some((item) => item.counter_evidence !== "")
) {
  fail("canonical reuse gaps were not preserved losslessly as a draft");
}
// The completion prompt asks only for the missing parts; resending the whole
// analysis would hit the same output limit that left the gaps.
const bioTemplate = JSON.parse(
  window.Jarbou3iBiopolitics.buildSchemaTemplate("en", "research", "web"),
);
const completionPrompt = compiler.buildCompletionPrompt(
  reusedCanonical,
  reusedValidation.errors,
  "en",
  bioTemplate,
);
if (
  !completionPrompt.includes("/evidence/items/0/counter_evidence") ||
  !completionPrompt.includes("/evidence/items/7/counter_evidence") ||
  !completionPrompt.includes('{"fill":') ||
  !completionPrompt.includes("```json") ||
  completionPrompt.includes(JSON.stringify(reusedCanonical.evidence.items[0]))
) {
  fail("completion prompt must list the exact gaps and ask only for them");
}
if (completionPrompt.length > 4000) {
  fail(`completion prompt for 8 gaps is ${completionPrompt.length} characters`);
}
const shapeGaps = structuredClone(fixture);
delete shapeGaps.power_map.actors[0].formal_mandate;
shapeGaps.meaning_systems.norms = [];
const shapeValidation = window.Jarbou3iBiopoliticsIntegrity.validateImport(shapeGaps);
const shapePrompt = compiler.buildCompletionPrompt(
  shapeGaps,
  shapeValidation.errors,
  "en",
  bioTemplate,
);
if (
  !shapePrompt.includes("/power_map/actors/0/formal_mandate") ||
  !shapePrompt.includes(fixture.power_map.actors[0].name) ||
  !shapePrompt.includes("/meaning_systems/norms") ||
  !shapePrompt.includes('"subject_position"')
) {
  fail("completion prompt must name the record and show the shape of a missing list");
}
const completionTargets = compiler.completionTargets(reusedValidation.errors);
const fillReply = {
  fill: Object.fromEntries(
    completionTargets.map((target, index) => [target, `Counter-evidence ${index + 1}`]),
  ),
};
fillReply.fill["/subject/title"] = "Not asked for";
if (!compiler.isCompletionReply(fillReply) || compiler.isCompletionReply(fixture)) {
  fail("a fill reply must be told apart from a full analysis");
}
const completed = compiler.applyCompletion(reusedCanonical, fillReply, completionTargets);
if (
  completed.applied !== 8 ||
  completed.ignored.join() !== "/subject/title" ||
  completed.value.subject.title !== reusedCanonical.subject.title ||
  reusedCanonical.evidence.items[0].counter_evidence !== ""
) {
  fail("only the listed gaps may be filled, without touching the base");
}
if (!window.Jarbou3iBiopoliticsIntegrity.validateImport(completed.value).canonical) {
  fail("an analysis with every gap filled must become canonical");
}
for (const lang of ["ar", "fr"]) {
  const localizedCompletion = compiler.buildCompletionPrompt(
    reusedCanonical,
    reusedValidation.errors,
    lang,
    bioTemplate,
  );
  if (
    !localizedCompletion.includes('{"fill":') ||
    !localizedCompletion.includes("/evidence/items/7/counter_evidence") ||
    localizedCompletion === completionPrompt
  ) {
    fail(`${lang} completion prompt lost its gaps or its language`);
  }
}

const malformedCanonical = structuredClone(fixture);
malformedCanonical.evidence.items[0].counter_evidence = 42;
const malformedValidation =
  window.Jarbou3iBiopoliticsIntegrity.validateImport(malformedCanonical);
if (
  malformedValidation.ok ||
  compiler.canRecoverAsDraft(malformedValidation)
) {
  fail("malformed field types must remain fail-closed");
}
const brokenReference = structuredClone(fixture);
brokenReference.links[0].to = "MISSING-ENDPOINT";
const brokenReferenceValidation =
  window.Jarbou3iBiopoliticsIntegrity.validateImport(brokenReference);
if (
  brokenReferenceValidation.ok ||
  compiler.canRecoverAsDraft(brokenReferenceValidation)
) {
  fail("broken canonical references must remain fail-closed");
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

// Free-tier drift corpus: realistic answer defects must import (canonical or
// reviewable draft), never be rejected, and never receive invented values.
// Mirrors the import sequence in src/app.js validateJsonInput.
const REPAIR = window.Jarbou3iContractRepair;
const INTEGRITY = window.Jarbou3iBiopoliticsIntegrity;
function importResult(text) {
  const recognized = compiler.recognize(window.Jarbou3iJson.extractJson(text).value);
  let input = recognized.value;
  const fromInterchange = compiler.supports(input);
  if (fromInterchange) input = compiler.compile(input).value;
  const raw = REPAIR.repairBiopolitical(input).value;
  const direct = INTEGRITY.validateImport(raw);
  if (direct.ok || direct.state !== "canonical") {
    return { validation: direct, value: raw, quarantine: [], diagnostics: [] };
  }
  return REPAIR.salvageBiopolitical(raw, {
    origin: fromInterchange ? "interchange" : "canonical",
    language: "en",
    mode: "focused",
  });
}
const drift = (mutate) => {
  const value = structuredClone(interchange);
  return JSON.stringify(mutate(value) ?? value);
};
const driftCases = {
  enumCasing: (d) => { d.power.actors[0].confidence = "Medium"; },
  enumSynonym: (d) => { d.power.actors[0].confidence = "moderate"; },
  guessedSourceTier: (d) => { d.evidence[0].source_tier = "academic"; },
  scalarForArray: (d) => { d.power.actors[0].material_interests = "Budget savings"; },
  nullForString: (d) => { d.power.actors[0].formal_mandate = null; },
  booleanAsString: (d) => { d.power.affected_populations[0].missing_from_record = "false"; },
  selfAuditYes: (d) => { d.self_audit.history_included = "yes"; },
  danglingPopulation: (d) => { d.distribution.items[0].population_id = "POP99"; },
  danglingLink: (d) => { d.links[0].to = "ZZZ9"; },
  subjectText: (d) => { d.subject = d.subject.title; },
  duplicateActor: (d) => { d.power.actors.push(structuredClone(d.power.actors[0])); },
  captureLevelsArray: (d) => {
    d.capture_levels = Object.entries(d.capture_levels).map(([level, item]) => ({ level, ...item }));
  },
  wrappedAndUnlabelled: (d) => {
    delete d.contract;
    return { analysis: d };
  },
  everythingAtOnce: (d) => {
    for (const [name, mutate] of Object.entries(driftCases)) {
      if (!["everythingAtOnce", "wrappedAndUnlabelled", "captureLevelsArray"].includes(name)) mutate(d);
    }
    return { result: d };
  },
};
const driftResults = {};
for (const [name, mutate] of Object.entries(driftCases)) {
  driftResults[name] = importResult(drift(mutate));
  if (!driftResults[name].validation.ok) {
    fail(`free-tier drift case was rejected instead of salvaged: ${name} ${JSON.stringify(driftResults[name].validation.errors.slice(0, 2))}`);
  }
}
if (!driftResults.enumCasing.validation.canonical || driftResults.enumCasing.value.power_map.actors[0].confidence !== "medium") {
  fail("enum casing should normalize to the canonical spelling and stay canonical");
}
const tierQuarantine = driftResults.guessedSourceTier.quarantine.find((item) => item.path === "/evidence/items/0/source_tier");
if (driftResults.guessedSourceTier.validation.canonical || tierQuarantine?.value !== "academic") {
  fail("an out-of-contract enum must be preserved in the audit and leave a reviewable draft");
}
if ("source_tier" in driftResults.guessedSourceTier.value.evidence.items[0]) {
  fail("salvage must not invent a replacement for a quarantined value");
}
if (
  !driftResults.captureLevelsArray.validation.canonical ||
  driftResults.captureLevelsArray.value.capture_levels[0].finding !== fixture.capture_levels[0].finding
) {
  fail("capture levels supplied as an array must keep their findings");
}
if (!driftResults.wrappedAndUnlabelled.validation.canonical) {
  fail("a wrapped result without a contract label should be recognized and compiled");
}
if (driftResults.subjectText.value.subject.title !== fixture.subject.title) {
  fail("a subject given as text must be kept as the subject title");
}
if (
  compiler.recognize({ result: { interests: [], actors: [], tools: [] } })
    .transformations[0]?.code !== "RESULT_WRAPPER_REMOVED"
) {
  fail("a wrapped Strategic result without markers should be unwrapped");
}

// Canonical-shaped answers get the same salvage, including envelope slips.
const canonicalDrift = (mutate) => {
  const value = structuredClone(fixture);
  mutate(value);
  return importResult(JSON.stringify(value));
};
const canonicalSubjectText = canonicalDrift((d) => { d.subject = d.subject.title; });
if (
  !canonicalSubjectText.validation.ok ||
  canonicalSubjectText.value.subject.title !== fixture.subject.title
) {
  fail("a canonical-shaped answer with a text subject must import with its title");
}
for (const [name, wrap] of Object.entries({
  topLevelList: (d) => [d],
  twoLevels: (d) => ({ response: { analysis: d } }),
  besideANote: (d) => ({ analysis: d, note: "Here is your analysis." }),
})) {
  if (!importResult(drift((d) => wrap(d))).validation.canonical) {
    fail(`a wrapped result should be unwrapped: ${name}`);
  }
}
if (!importResult(drift((d) => { d.lens = "Biopolitical"; })).validation.canonical) {
  fail("a loosely written interchange lens should be recognized");
}

// Identity that cannot be read as the 2.1 contract is refused, not relabelled.
for (const [name, mutate] of Object.entries({
  versionAsList: (d) => { d.schema_version = ["2.1"]; },
  legacyShapeClaiming21: (d) => { d.schema_version = "2.1"; d.interests = []; },
})) {
  if (canonicalDrift(mutate).validation.ok) fail(`unreadable identity was relabelled: ${name}`);
}

const canonicalSlips = {
  headerStatusMissing: (d) => { delete d.contract_status; },
  headerStatusNull: (d) => { d.contract_status = null; },
  recordIdAsList: (d) => { d.power_map.actors[0].id = [d.power_map.actors[0].id]; },
  headerVersionShort: (d) => { d.schema_version = "2.1"; },
  headerVersionNumber: (d) => { d.schema_version = 2.1; },
  headerLensCase: (d) => { d.analysis_lens = "Biopolitical"; },
  nullListEntry: (d) => { d.power_map.actors.push(null); },
  languageName: (d) => { d.language = "English"; },
  languageLabel: (d) => { d.language = "English (US)"; },
  languageMissing: (d) => { delete d.language; },
  nullRecordId: (d) => { d.power_map.actors[0].id = null; },
  idKeyedMap: (d) => {
    d.power_map.actors = Object.fromEntries(d.power_map.actors.map((actor) => [actor.id, actor]));
  },
  nullArray: (d) => { d.power_map.actors[0].material_interests = null; },
};
for (const [name, mutate] of Object.entries(canonicalSlips)) {
  const result = canonicalDrift(mutate);
  if (!result.validation.canonical) {
    fail(`canonical-shaped slip should stay canonical: ${name} ${JSON.stringify(result.validation.errors?.slice(0, 2))}`);
  }
  if (name === "languageMissing" && result.value.language !== "en") {
    fail("a missing language must come from the request");
  }
  if (
    name === "idKeyedMap" &&
    result.value.power_map.actors.map((actor) => actor.id).join() !==
      fixture.power_map.actors.map((actor) => actor.id).join()
  ) {
    fail("an ID-keyed map must keep its records and IDs");
  }
}
for (const name of ["danglingPopulation", "everythingAtOnce"]) {
  const result = driftResults[name];
  try {
    compiler.buildCompletionPrompt(result.candidate, result.diagnostics, "en");
  } catch (error) {
    fail(`completion prompt cannot be built for salvaged draft ${name}: ${error.code}`);
  }
}
if (!/"source_tier":"primary_legal_policy\|[a-z_|]+"/.test(compiler.buildTemplate("en", "research"))) {
  fail("the prompt template must list the allowed source_tier values");
}

// A prompt pasted back instead of the reply is recognized by its material markers,
// one per lens and language; a reply that merely mentions a marker is not.
for (const marker of [
  'UNTRUSTED_ANALYSIS_MATERIAL_JSON: {"topic":"x"}',
  'مادة_التحليل_غير_الموثوقة_JSON: {"topic":"x"}',
  'MATIERE_ANALYTIQUE_NON_FIABLE_JSON : {"topic":"x"}',
  "<UNTRUSTED_TOPIC_MATERIAL>\nx\n</UNTRUSTED_TOPIC_MATERIAL>",
  "<مادة_موضوع_غير_موثوقة>\nx\n</مادة_موضوع_غير_موثوقة>",
  "<SUJET_NON_FIABLE>\nx\n</SUJET_NON_FIABLE>",
]) {
  if (!compiler.isCopiedPrompt(`You are a rigorous analyst.\n\n${marker}\nRules: return JSON.`)) {
    fail(`a copied prompt was not recognized: ${marker.slice(0, 40)}`);
  }
}
if (compiler.isCopiedPrompt(JSON.stringify(fixture))) fail("a real reply was mistaken for the prompt");
if (compiler.isCopiedPrompt('{"note":"I treated UNTRUSTED_ANALYSIS_MATERIAL_JSON as data"}')) {
  fail("a reply that only mentions a marker was mistaken for the prompt");
}

// The written language of an analysis is read from its prose, not from its label.
const readFixture = (name) => JSON.parse(fs.readFileSync(`fixtures/${name}`, "utf8"));
for (const [name, expected] of [
  ["sample-analysis-en.json", "en"],
  ["sample-analysis-fr.json", "fr"],
  ["sample-analysis-ar.json", "ar"],
  ["sample-analysis-bio-en.json", "en"],
  ["sample-analysis-bio-fr.json", "fr"],
  ["sample-analysis-bio-ar.json", "ar"],
]) {
  const relabelled = { ...readFixture(name), language: expected === "en" ? "fr" : "en" };
  const detected = REPAIR.detectLanguage(relabelled);
  if (detected !== expected) fail(`${name} was read as ${detected}, expected ${expected}`);
}
if (REPAIR.detectLanguage({ subject: { title: "Short title" }, actors: ["high", "ev-1"] }) !== undefined) {
  fail("too little prose must not produce a language guess");
}

// A reply without its lens label is recognized by its shape, not by the lens
// the page happens to show.
const unlabelledBio = structuredClone(fixture);
delete unlabelledBio.analysis_lens;
if (compiler.recognize(unlabelledBio).value.analysis_lens !== "biopolitical") {
  fail("an unlabelled Biopolitical analysis was not recognized");
}
const unlabelledStrategic = JSON.parse(fs.readFileSync("fixtures/sample-analysis-en.json", "utf8"));
delete unlabelledStrategic.analysis_lens;
if (compiler.recognize(unlabelledStrategic).value.analysis_lens !== "strategic") {
  fail("an unlabelled Strategic analysis was not recognized");
}
if ("analysis_lens" in compiler.recognize(interchange).value) {
  fail("an interchange answer must keep its own lens field");
}

// The record guide names every record with ref, future feedback loops included.
const refLoops = structuredClone(interchange);
refLoops.scale_time.future_feedback_loops = refLoops.scale_time.future_feedback_loops.map(
  ({ id, ...loop }, index) => ({ ref: `FF${index + 1}`, ...loop }),
);
const refLoopIds = compiler
  .compile(refLoops, { generatedAt: fixture.generated_at })
  .value.scale_time.future_feedback_loops.map((loop) => loop.id);
if (refLoopIds.join() !== refLoops.scale_time.future_feedback_loops.map((loop) => loop.ref).join()) {
  fail(`a future feedback loop's ref did not become its id: ${refLoopIds.join()}`);
}
if (!/evidence_of_benefit: evidence IDs/.test(compiler.buildFieldGuide())) {
  fail("the record guide does not say evidence_of_benefit holds evidence IDs");
}

console.log("AI interchange reliability checks passed.");
