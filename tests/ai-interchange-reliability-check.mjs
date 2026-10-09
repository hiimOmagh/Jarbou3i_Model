import fs from "node:fs";
import vm from "node:vm";
import { interchangeFrom } from "./helpers/bio-interchange.mjs";

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

// An extra closing brace can leave a section member at the top level. It is put
// back in its section; a member the section already has stays quarantined.
const misplaced = structuredClone(interchange);
misplaced.care_control_tensions = misplaced.intervention.care_control_tensions;
delete misplaced.intervention.care_control_tensions;
if (!misplaced.care_control_tensions?.length) fail("fixture has no care_control_tensions to misplace");
const misplacedCompilation = compiler.compile(misplaced, { generatedAt: fixture.generated_at });
if (JSON.stringify(misplacedCompilation.value) !== JSON.stringify(compiled.value)) {
  fail("a section member found at the top level was not put back in its section");
}
if (
  misplacedCompilation.audit.quarantine.length ||
  !misplacedCompilation.audit.transformations.some(
    (item) => item.code === "MISPLACED_MEMBER_RESTORED" && item.path === "/intervention/care_control_tensions",
  )
) {
  fail("putting back a misplaced section member was not reported");
}
const duplicate = structuredClone(interchange);
duplicate.care_control_tensions = [];
const duplicateCompilation = compiler.compile(duplicate, { generatedAt: fixture.generated_at });
if (
  JSON.stringify(duplicateCompilation.value) !== JSON.stringify(compiled.value) ||
  !duplicateCompilation.audit.quarantine.some((item) => item.path === "/care_control_tensions")
) {
  fail("a top-level copy of a member its section already has was not quarantined");
}

// A member a section does not use is kept in the import audit, not dropped
// unseen; top-level members written inside a section are put back.
if (compiled.audit.quarantine.length) {
  fail(`a clean answer had members quarantined: ${compiled.audit.quarantine.map((item) => item.path)}`);
}
const unusedMember = structuredClone(interchange);
unusedMember.power.actor = unusedMember.power.actors;
delete unusedMember.power.actors;
const unusedCompilation = compiler.compile(unusedMember, { generatedAt: fixture.generated_at });
if (!unusedCompilation.audit.quarantine.some((item) => item.path === "/power/actor" && item.value?.length)) {
  fail("a section member the import does not use was dropped without a trace");
}
const nestedTop = structuredClone(interchange);
if (!nestedTop.links?.length || !nestedTop.self_audit_notes?.length) fail("fixture has no links or notes to misplace");
nestedTop.self_audit = { ...nestedTop.self_audit, links: nestedTop.links, self_audit_notes: nestedTop.self_audit_notes };
delete nestedTop.links;
delete nestedTop.self_audit_notes;
const nestedCompilation = compiler.compile(nestedTop, { generatedAt: fixture.generated_at });
if (JSON.stringify(nestedCompilation.value) !== JSON.stringify(compiled.value)) {
  fail("top-level members found inside a section were not put back");
}
if (
  nestedCompilation.audit.quarantine.length ||
  !nestedCompilation.audit.transformations.some(
    (item) => item.code === "MISPLACED_MEMBER_RESTORED" && item.path === "/links" && item.from === "/self_audit/links",
  )
) {
  fail("putting back a top-level member found inside a section was not reported");
}

// A confidence the answer leaves out is a gap to complete, not "low".
{
  const noConfidence = structuredClone(interchange);
  delete noConfidence.conclusion.overall_confidence;
  delete noConfidence.intervention.capture.confidence;
  const value = compiler.compile(noConfidence, { generatedAt: fixture.generated_at }).value;
  if (
    value.calibrated_conclusion.overall_confidence !== undefined ||
    value.intervention_assessment.capture_assessment.confidence !== undefined
  ) {
    fail("a confidence the answer left out was set to low");
  }
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
// A capture criterion is named by its code, the key the AI wrote it under.
const criterionGap = structuredClone(fixture);
delete criterionGap.intervention_assessment.capture_assessment.criteria[1].status;
const criterionPrompt = compiler.buildCompletionPrompt(
  criterionGap,
  window.Jarbou3iBiopoliticsIntegrity.validateImport(criterionGap).errors,
  "en",
  bioTemplate,
);
const criterionLine = criterionPrompt
  .split("\n")
  .find((line) => line.startsWith("/intervention_assessment/capture_assessment/criteria/1/status"));
if (!criterionLine?.includes(`"${fixture.intervention_assessment.capture_assessment.criteria[1].criterion}"`)) {
  fail(`completion prompt must name the criterion whose status is missing: ${criterionLine}`);
}
// A generated ID skips the ones the answer already uses: an AI that drops a
// record and forgets one ref must not end with two records sharing an ID.
const idCandidate = { evidence: { items: [{ id: "E1" }, { id: "E3" }, { claim: "no ref" }] } };
compiler.generateMissingIds(idCandidate, { transformations: [] });
if (idCandidate.evidence.items.map((item) => item.id).join() !== "E1,E3,E4") {
  fail(`a generated ID collided with one in use: ${idCandidate.evidence.items.map((item) => item.id)}`);
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
// Models often leave out the leading "/" of each path.
const slashless = {
  fill: Object.fromEntries(Object.entries(fillReply.fill).map(([key, value]) => [key.slice(1), value])),
};
const slashlessCompleted = compiler.applyCompletion(reusedCanonical, slashless, completionTargets);
if (
  !compiler.isCompletionReply(slashless) ||
  slashlessCompleted.applied !== 8 ||
  JSON.stringify(slashlessCompleted.value) !== JSON.stringify(completed.value)
) {
  fail("a fill reply whose paths lack the leading slash must be applied the same way");
}
// Models also answer one level up, keyed by the record or list that holds
// the missing parts (DeepSeek did); those parts are read from it, and only
// the parts asked for are written.
const parentKeyed = {
  fill: {
    ...Object.fromEntries(
      completionTargets.map((target, index) => {
        const keys = target.split("/");
        return [keys.slice(0, -1).join("/"), { [keys.at(-1)]: `Counter-evidence ${index + 1}`, title: "Not asked for" }];
      }),
    ),
    "/subject": { title: "Not asked for" },
  },
};
const parentCompleted = compiler.applyCompletion(reusedCanonical, parentKeyed, completionTargets);
if (
  parentCompleted.applied !== 8 ||
  parentCompleted.ignored.join() !== "/subject" ||
  JSON.stringify(parentCompleted.value) !== JSON.stringify(completed.value)
) {
  fail("a fill reply keyed by the record that holds each missing part must be applied, and nothing else");
}
const listBase = structuredClone(reusedCanonical);
listBase.power_map.power_asymmetries[0].between = ["", ""];
const listTargets = ["/power_map/power_asymmetries/0/between/0", "/power_map/power_asymmetries/0/between/1"];
const listCompleted = compiler.applyCompletion(
  listBase,
  { fill: { "power_map/power_asymmetries/0/between": ["A1", "A2"] } },
  listTargets,
);
if (listCompleted.applied !== 2 || listCompleted.value.power_map.power_asymmetries[0].between.join() !== "A1,A2") {
  fail("a fill reply keyed by the list that holds the missing entries must be applied");
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

// Rule 10 asks for "concern" in every source mode; the template must not
// offer "pass", which an AI following it would copy.
for (const access of ["web", "provided", "none"]) {
  for (const [name, template] of [
    ["interchange", JSON.parse(compiler.buildTemplate("en", "research", access))],
    ["canonical", JSON.parse(window.Jarbou3iBiopolitics.buildSchemaTemplate("en", "research", access))],
  ]) {
    if (template.self_audit.statistics_quotations_verified !== "concern") {
      fail(`${name} template (${access}) offers statistics_quotations_verified other than concern`);
    }
  }
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
// The gaps a schema failure hides are listed with it, so completing the
// analysis does not reveal new ones.
{
  const raw = structuredClone(fixture);
  delete raw.links[0].relation;
  raw.power_map.power_asymmetries[0].between[0] = "Nobody named";
  const result = REPAIR.salvageBiopolitical(raw, { origin: "canonical", language: "en", mode: "focused" });
  const paths = result.diagnostics.map((item) => item.path);
  if (!paths.some((path) => path.startsWith("/links/0")) || !paths.includes("/power_map/power_asymmetries/0/between/0")) {
    fail(`schema and reference gaps must be listed together: ${paths.join(", ")}`);
  }
  if (new Set(paths).size !== paths.length) fail(`a gap is listed twice: ${paths.join(", ")}`);
}
// A fixed-set entry the reply leaves out is a gap to complete, never a
// judgment the compiler invents ("uncertain", "concern").
{
  const omitted = structuredClone(interchange);
  const [level] = Object.keys(omitted.capture_levels);
  const [criterion] = Object.keys(omitted.intervention.capture.criteria);
  const [type] = Object.keys(omitted.explanations);
  const [auditKey] = Object.keys(omitted.self_audit);
  delete omitted.capture_levels[level];
  delete omitted.intervention.capture.criteria[criterion];
  delete omitted.explanations[type];
  delete omitted.self_audit[auditKey];
  const compiledOmitted = compiler.compile(structuredClone(omitted)).value;
  const at = {
    level: compiledOmitted.capture_levels.findIndex((item) => item.level === level),
    criterion: compiledOmitted.intervention_assessment.capture_assessment.criteria.findIndex((item) => item.criterion === criterion),
    type: compiledOmitted.competing_explanations.findIndex((item) => item.type === type),
  };
  const result = importResult(JSON.stringify(omitted));
  if (result.validation.state === "canonical") fail("a reply missing fixed-set entries imported as canonical");
  // What the completion prompt will ask for.
  const gapPaths = compiler.completionTargets(result.diagnostics);
  for (const expected of [
    `/capture_levels/${at.level}/status`,
    `/intervention_assessment/capture_assessment/criteria/${at.criterion}/status`,
    `/competing_explanations/${at.type}/relevance`,
    `/self_audit/${auditKey}`,
  ]) {
    if (!gapPaths.includes(expected)) fail(`missing fixed-set entry is not a completion gap: ${expected} (gaps: ${gapPaths.join(", ")})`);
  }
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

// Text that slips into another language is found by path, as in real replies.
// Names, one-word glosses, source metadata, and the template's own English
// placeholder record are not flagged.
const foreign = REPAIR.foreignTextPaths(
  {
    results: [
      { name: "نقل الإنتاج", rationale: "انخفاض في relocation of carbon-intensive production." },
      { name: "منظمة التجارة", rationale: "سعت دول إلى شكاوى presso WTO." },
    ],
    interests: [{ name: "بوابة EU DSC Gateway", rationale: "صناعات الصلب وال铝业 تواجه تكلفة مرتفعة" }],
    theory: "مفهوم السلطة الحيوية (biopower) عند فوكو",
    stakes: "مما يؤدي إلى воп",
    evidence: {
      items: [
        { source_title: "UNSOURCED MODEL SYNTHESIS — PLACEHOLDER", claim: "Unsourced conceptual inference; not evidence" },
        { source_title: "Regulation (EU) 2023/956 establishing a carbon border adjustment mechanism", claim: "ينص النظام على آلية" },
      ],
    },
  },
  "ar",
);
if (JSON.stringify(foreign) !== JSON.stringify(["/results/0/rationale", "/results/1/rationale", "/interests/0/rationale", "/stakes"])) {
  fail(`text in another language was not found by path: ${JSON.stringify(foreign)}`);
}
if (JSON.stringify(REPAIR.foreignTextPaths({ conclusion: { gap: "The evidence base 缺乏 depth" } }, "en")) !== '["/conclusion/gap"]') {
  fail("Chinese text in an English answer was not found");
}
for (const [name, lang] of [
  ["sample-analysis-en.json", "en"],
  ["sample-analysis-fr.json", "fr"],
  ["sample-analysis-bio-en.json", "en"],
  ["sample-analysis-bio-fr.json", "fr"],
  ["sample-analysis-bio-ar.json", "ar"],
]) {
  const flagged = REPAIR.foreignTextPaths(readFixture(name), lang);
  if (flagged.length) fail(`${name} was flagged as another language at ${flagged.join(", ")}`);
}

// A reply without its lens label is recognized by its shape, not by the lens
// the page happens to show.
// Sections written in another shape keep their content: the canonical
// {items: [...]} form, plain-text list entries, and text keyed by its ID.
const shapeDrift = JSON.parse(compiler.buildTemplate("en", "research"));
shapeDrift.evidence = { items: [{ ref: "E1", claim: "Real claim one" }, { ref: "E2", claim: "Real claim two" }] };
shapeDrift.assumptions = ["Assumes the registry is accurate"];
shapeDrift.resistance = { RES1: "Doctors refused to comply" };
const shapeDriftCompiled = compiler.compile(shapeDrift, { generatedAt: "2026-10-06T00:00:00Z" }).value;
if (
  shapeDriftCompiled.evidence.items.map((item) => item.claim).join() !== "Real claim one,Real claim two" ||
  !JSON.stringify(shapeDriftCompiled.assumptions.items).includes("Assumes the registry is accurate") ||
  !JSON.stringify(shapeDriftCompiled.resistance_agency.items).includes("Doctors refused to comply")
) {
  fail("a section written in another shape lost its content");
}
// Sections placed next to a wrapped result, not inside it, are kept.
const { contradictions: wrappedContradictions, scenarios: wrappedScenarios, ...wrappedRest } = JSON.parse(
  fs.readFileSync("fixtures/sample-analysis-en.json", "utf8"),
);
const unwrapped = compiler.recognize({
  analysis: wrappedRest,
  contradictions: wrappedContradictions,
  scenarios: wrappedScenarios,
}).value;
if (
  JSON.stringify(unwrapped.contradictions) !== JSON.stringify(wrappedContradictions) ||
  JSON.stringify(unwrapped.scenarios) !== JSON.stringify(wrappedScenarios)
) {
  fail("sections next to a wrapped result were dropped with the wrapper");
}

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
// Without source access the placeholder is not evidence: real replies cited it
// in evidence_of_benefit, the one list the guide asked to fill with evidence IDs.
for (const mode of ["focused", "expert", "research"]) {
  const line = compiler
    .buildFieldGuide("none", mode)
    .split("\n")
    .find((entry) => entry.startsWith("interventions.evidence_of_benefit:"));
  if (!line || /E1/.test(line) || !/empty/.test(line)) {
    fail(`without source access the record guide does not keep evidence_of_benefit empty (${mode}): ${line}`);
  }
}
// A source keeps its own title: real replies translated it into the analysis
// language, which no reader can then find.
const bioLanguageLine = /^(Mandatory output language|Langue de sortie obligatoire|لغة الإخراج الإلزامية)/;
for (const lang of ["ar", "en", "fr"]) {
  if (!compiler.buildChecklist(lang).includes("source_title")) {
    fail(`the ${lang} checklist asks for every text value in the analysis language, source titles included`);
  }
  const line = window.Jarbou3iBiopolitics.buildPrompt({ topic: "Source titles", lang, mode: "research", evidenceAccess: "web" })
    .split("\n")
    .find((entry) => bioLanguageLine.test(entry));
  if (!line?.includes("source_title")) {
    fail(`the ${lang} Biopolitical language rule does not keep source titles untranslated: ${line}`);
  }
}
// Free-tier assistants wrote names here, which no record resolves.
if (
  !/power_asymmetries\.between: refs of .*never names/.test(compiler.buildFieldGuide()) ||
  !/links\.from, links\.to: refs of .*never names/.test(compiler.buildFieldGuide())
) {
  fail("the record guide does not say asymmetry and link ends hold refs, not names");
}

// An answer that follows the prompt exactly (the template, one record per guide
// entry, the first allowed code, each end of every number range) must pass the
// canonical schema in every language and depth. A required field, code or range
// the prompt does not ask for fails here. References are placeholders, so only
// the schema is checked, not reference integrity.
// Research and expert depth ask for assumptions and causal links, whose
// template arrays are empty, so the guide must say to fill them there.
const populateLine = (mode) =>
  compiler.buildFieldGuide("web", mode).split("\n").find((line) => line.startsWith("Populate these"));
for (const mode of ["research", "expert"]) {
  if (!/\bassumptions\b/.test(populateLine(mode)) || !/\blinks\b/.test(populateLine(mode))) {
    fail(`${mode} field guide does not ask to fill assumptions and links`);
  }
}
// The guide's opening line is plain words, not the compiler's.
if (/ref becomes id locally|keys are canonical/.test(compiler.buildFieldGuide("web", "research"))) {
  fail("the field guide opens with compiler jargon");
}
// The template holds example records for most of these.
if (/template arrays are empty/.test(populateLine("research"))) {
  fail("the field guide calls template arrays empty that hold example records");
}
if (/\blinks\b/.test(populateLine("focused"))) {
  fail("focused field guide asks for links it does not need");
}
const guideLines = compiler.buildFieldGuide().split("\n");
const guideRecords = guideLines
  .map((line) => line.match(/^([a-z_.]+): \{(.+)\}$/))
  .filter(Boolean);
const guideCodes = new Map();
const guideNumbers = new Map();
const allowedLines = guideLines.slice(
  guideLines.findIndex((line) => line.startsWith("Allowed codes")) + 1,
);
for (const line of allowedLines) {
  const code = line.match(/^([a-z_.]+): ([a-z_]+(?:\|[a-z_]+)+)$/);
  const number = line.match(/^([a-z_.]+): a (?:number|percentage) from (\d+) to (\d+)/);
  if (code) guideCodes.set(code[1], code[2].split("|")[0]);
  else if (number) guideNumbers.set(number[1], [Number(number[2]), Number(number[3])]);
  else fail(`the conformance check cannot read this guide line: ${line}`);
}
if (guideRecords.length !== guideLines.filter((line) => line.includes(": {")).length) {
  fail("the conformance check cannot read every record guide entry");
}
const firstOption = (value) => {
  if (typeof value === "string") {
    return /^[a-z_]+(\|[a-z_]+)+$/.test(value) ? value.split("|")[0] : value || "Example";
  }
  if (Array.isArray(value)) return value.map(firstOption);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, firstOption(item)]),
    );
  }
  return value;
};
// The shallowest array whose path ends with the guide entry's name.
const findGuideArray = (rootNode, name) => {
  const queue = [[rootNode, ""]];
  while (queue.length) {
    const [node, trail] = queue.shift();
    if (!node || typeof node !== "object" || Array.isArray(node)) continue;
    for (const [key, value] of Object.entries(node)) {
      const path = trail ? `${trail}.${key}` : key;
      if (Array.isArray(value) && (path === name || path.endsWith(`.${name}`))) {
        return value;
      }
      queue.push([value, path]);
    }
  }
  return null;
};
const validateSchema = window.Jarbou3iBiopoliticsSchemaValidators.canonical;
const promptVariants = ["ar", "en", "fr"].flatMap((lang) =>
  ["simple", "expert", "research"].flatMap((mode) =>
    ["web", "none"].flatMap((access) => [
      [lang, mode, 0, access],
      [lang, mode, 1, access],
    ]),
  ),
);
for (const [lang, mode, end, access] of promptVariants) {
  const answer = firstOption(JSON.parse(compiler.buildTemplate(lang, mode, access)));
  let refCount = 0;
  for (const [, name, keys] of guideRecords) {
    const target = findGuideArray(answer, name);
    if (!target) fail(`${lang}/${mode}: the template has no array for guide entry ${name}`);
    if (target.length) continue;
    const record = {};
    for (const raw of keys.split(",")) {
      const key = raw.replace("[]", "");
      const path = `${name}.${key}`;
      if (key === "ref") record.ref = `G${++refCount}`;
      else if (guideCodes.has(path)) record[key] = guideCodes.get(path);
      else if (guideNumbers.has(path)) record[key] = guideNumbers.get(path)[end];
      else if (key === "confidence") record[key] = "medium";
      else record[key] = raw.endsWith("[]") ? ["Example"] : "Example";
    }
    target.push(record);
  }
  const conformance = compiler.compile(answer, { generatedAt: fixture.generated_at });
  if (conformance.value.contract_status !== "canonical" || !validateSchema(conformance.value)) {
    fail(
      `${lang}/${mode}/${access}: an answer that follows the prompt does not match the schema: ${JSON.stringify(
        (validateSchema.errors || []).slice(0, 5).map((error) => `${error.instancePath} ${error.message}`),
      )}`,
    );
  }
}

// With no source access, the prompt's rule names a placeholder evidence record,
// empty evidence reference lists, and a limitation statement. The template the
// prompt carries must contain them.
const evidenceRefLists = (node, found = []) => {
  if (!node || typeof node !== "object") return found;
  for (const [key, value] of Object.entries(node)) {
    if (key.endsWith("evidence_refs")) found.push(value);
    else evidenceRefLists(value, found);
  }
  return found;
};
for (const lang of ["ar", "en", "fr"]) {
  const prompt = window.Jarbou3iBiopolitics.buildPrompt({
    topic: "Conceptual inquiry",
    lang,
    mode: "research",
    evidenceAccess: "none",
  });
  const start = prompt.indexOf('{"contract":"jarbou3i-ai-interchange/1"');
  const sent = JSON.parse(prompt.slice(start, prompt.indexOf("\n", start)));
  const [placeholder, ...others] = sent.evidence;
  if (
    others.length ||
    !window.Jarbou3iBiopoliticsIntegrity.placeholderPattern.test(placeholder?.source_title) ||
    Object.values(placeholder).some((value) => value === "string") ||
    placeholder.verification_status !== "unverified" ||
    placeholder.confidence !== "low"
  ) {
    fail(`${lang}: the no-source prompt has no complete placeholder evidence record`);
  }
  const refLists = evidenceRefLists(sent);
  if (!refLists.length || refLists.some((list) => list.length)) {
    fail(`${lang}: the no-source prompt still cites evidence in its template`);
  }
  if (
    sent.conclusion.strongly_supported.length !== 1 ||
    sent.conclusion.strongly_supported[0] === "string" ||
    sent.conclusion.overall_confidence !== "low" ||
    sent.self_audit.statistics_quotations_verified !== "concern"
  ) {
    fail(`${lang}: the no-source prompt has no limitation statement or low confidence`);
  }
  if (!/placeholder|النائب|substitutive/i.test(prompt.slice(0, start)) || /evidence_ids/.test(prompt.slice(0, start))) {
    fail(`${lang}: the no-source rule does not match the template it is sent with`);
  }
  if (/^Populate these[^\n]*evidence\.$/m.test(prompt)) {
    fail(`${lang}: the no-source record guide asks for evidence beyond the placeholder`);
  }
  const web = JSON.parse(compiler.buildTemplate(lang, "research", "web"));
  if (!evidenceRefLists(web).some((list) => list.length) || web.conclusion.overall_confidence === "low") {
    fail(`${lang}: the no-source changes leaked into the template for other access modes`);
  }
}

// A list answered one level up may hold only the missing records, in order;
// each lands in the record it was asked for. A list of any other length that
// does not reach every record asked for is not guessed at: it is reported.
{
  const base = { list: [{ claim: "a" }, { claim: "" }, { claim: "c" }, { claim: "" }] };
  const targets = ["/list/1/claim", "/list/3/claim"];
  const claims = (result) => result.value.list.map((item) => item.claim).join();
  const compact = compiler.applyCompletion(base, { fill: { "/list": [{ claim: "B" }, { claim: "D" }] } }, targets);
  if (claims(compact) !== "a,B,c,D" || compact.applied !== 2 || compact.ignored.length) {
    fail(`a list holding only the missing records was misplaced: ${claims(compact)}, ${JSON.stringify(compact.ignored)}`);
  }
  const full = compiler.applyCompletion(
    base,
    { fill: { "/list": [{ claim: "x" }, { claim: "B" }, { claim: "y" }, { claim: "D" }] } },
    targets,
  );
  if (claims(full) !== "a,B,c,D" || full.applied !== 2) {
    fail(`a whole list answered one level up was not read by position: ${claims(full)}`);
  }
  const unclear = compiler.applyCompletion(base, { fill: { "/list": [{ claim: "B" }, { claim: "C" }, { claim: "D" }] } }, targets);
  if (claims(unclear) !== "a,,c," || unclear.applied !== 0 || unclear.ignored.join() !== "/list") {
    fail(`a list of unclear length was guessed at: ${claims(unclear)}, ${JSON.stringify(unclear.ignored)}`);
  }
}

// A section written beside its items ({items: [...], note}) keeps every
// record, and what was written beside them is kept for review.
{
  const besideItems = JSON.parse(compiler.buildTemplate("en", "research"));
  besideItems.evidence = { items: [{ id: "E1", claim: "Real claim one" }, { id: "E2", claim: "Real claim two" }], note: "Sources checked in May" };
  const compiled = compiler.compile(besideItems, { generatedAt: "2026-10-07T00:00:00Z" });
  if (compiled.value.evidence.items.map((item) => item.claim).join() !== "Real claim one,Real claim two") {
    fail(`records written beside a note were lost: ${JSON.stringify(compiled.value.evidence.items)}`);
  }
  if (!compiled.audit.quarantine.some((item) => item.path === "/evidence/note" && item.value === "Sources checked in May")) {
    fail("text written beside a section's items was not kept for review");
  }
}

// A section in a shape that cannot be read (a list where a section of named
// parts is asked for, or text where a list is) is kept for review, never
// emptied without a trace.
{
  const wrongShape = JSON.parse(compiler.buildTemplate("en", "research"));
  const distribution = [{ group: "Migrants", burden: "Checks at every border" }];
  wrongShape.distribution = distribution;
  wrongShape.assumptions = "The registry is accurate";
  const compiled = compiler.compile(wrongShape, { generatedAt: "2026-10-07T00:00:00Z" });
  const kept = (path) => compiled.audit.quarantine.find((item) => item.path === path);
  if (JSON.stringify(kept("/distribution")?.value) !== JSON.stringify(distribution)) {
    fail("a section written as a list was emptied without being kept for review");
  }
  if (kept("/assumptions")?.value !== "The registry is accurate") {
    fail("a list written as text was emptied without being kept for review");
  }
}

// An ID made for an explanation never repeats one the answer already uses.
{
  const explained = JSON.parse(compiler.buildTemplate("en", "research"));
  const [first] = Object.keys(explained.explanations);
  explained.explanations[first].id = "EX2";
  const ids = compiler.compile(explained, { generatedAt: "2026-10-07T00:00:00Z" }).value.competing_explanations.map((item) => item.id);
  if (ids[0] !== "EX2" || new Set(ids).size !== ids.length) {
    fail(`explanation IDs collide: ${ids.join()}`);
  }
}

console.log("AI interchange reliability checks passed.");
