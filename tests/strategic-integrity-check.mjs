import assert from "node:assert/strict";
import fs from "node:fs";

await import("../src/strategic-schema-validator.js");
await import("../src/contract-repair.js");
const { reshapeStrategicSections, salvageStrategicAnalysis, validateStrategicAnalysis } = await import("../src/strategic-integrity.js");
const fixture = JSON.parse(fs.readFileSync(new URL("../fixtures/sample-analysis-en.json", import.meta.url), "utf8"));
const appSource = fs.readFileSync(new URL("../src/app.js", import.meta.url), "utf8");
for (const language of ["ar", "en", "fr"]) {
  const localized = JSON.parse(fs.readFileSync(new URL(`../fixtures/sample-analysis-${language}.json`, import.meta.url), "utf8"));
  assert.equal(validateStrategicAnalysis(localized).ok, true, `${language} Strategic fixture failed runtime validation`);
}

const invalidScore = structuredClone(fixture);
invalidScore.actors[0].financial = 99;
assert.equal(validateStrategicAnalysis(invalidScore).ok, false, "out-of-range actor score passed runtime validation");

const missingNestedField = structuredClone(fixture);
delete missingNestedField.subject.executive_thesis;
assert.equal(validateStrategicAnalysis(missingNestedField).ok, false, "missing nested required field passed runtime validation");

const duplicate = structuredClone(fixture);
duplicate.actors[0].id = duplicate.interests[0].id;
assert(validateStrategicAnalysis(duplicate).errors.some((item) => item.code === "DUPLICATE_GLOBAL_ID"), "duplicate global ID was not rejected");

const brokenLink = structuredClone(fixture);
brokenLink.links[0].to = "missing-record";
assert(validateStrategicAnalysis(brokenLink).errors.some((item) => item.code === "BROKEN_REFERENCE"), "broken relationship reference was not rejected");

const unsafeUrl = structuredClone(fixture);
unsafeUrl.evidence.items[0].source_url = "javascript:alert(1)";
const unsafeResult = validateStrategicAnalysis(unsafeUrl);
assert.equal(unsafeResult.ok, true, "reviewable invalid source URL should not destroy the draft");
assert(unsafeResult.warnings.some((item) => item.code === "INVALID_SOURCE_URL"), "unsafe source URL was not surfaced");
assert(/UNSOURCED MODEL SYNTHESIS[\s\S]{0,500}evidence_strength: 1/.test(appSource), "no-access prompt placeholder violates the canonical 1–5 evidence-strength range");
assert(!/UNSOURCED MODEL SYNTHESIS[\s\S]{0,500}evidence_strength: 0/.test(appSource), "invalid zero-strength prompt example remains");

// Free-tier drift: Strategic answers are salvaged, never rejected, never invented.
const strategicDrift = (mutate) => {
  const value = structuredClone(fixture);
  mutate(value);
  return salvageStrategicAnalysis(value);
};
const scoreAsText = strategicDrift((d) => { d.actors[0].financial = "5"; d.actors[0].confidence = "High"; });
assert.equal(scoreAsText.canonical, true, "format-only Strategic drift should stay canonical");
assert.equal(scoreAsText.analysis.actors[0].financial, 5, "numeric text was not coerced");
const outOfRange = strategicDrift((d) => { d.actors[0].financial = 7; });
assert.equal(outOfRange.ok, true, "out-of-range score rejected the whole Strategic answer");
assert.equal(outOfRange.canonical, false, "out-of-range score must leave a reviewable draft");
assert.equal("financial" in outOfRange.analysis.actors[0], false, "salvage invented a replacement score");
assert.equal(outOfRange.quarantine[0].value, 7, "out-of-range score was not preserved in the audit");
const combined = strategicDrift((d) => {
  delete d.actors[0].id;
  d.actors[0].rationale = null;
  d.links[0].to = "ZZ9";
  d.tools[0].confidence = "very high";
  d.actors.push(structuredClone(d.actors[1] || d.actors[0]));
});
assert.equal(combined.ok, true, "combined Strategic drift was rejected");
assert.equal(combined.state, "strategic_draft", "combined Strategic drift must be a draft");
assert.ok(combined.diagnostics.some((item) => item.code === "BROKEN_REFERENCE"), "dangling link is not listed as a gap");
const subjectText = strategicDrift((d) => { d.subject = d.subject.title; });
assert.equal(subjectText.ok, true, "a text subject rejected the whole Strategic answer");
assert.equal(subjectText.analysis.subject.title, fixture.subject.title, "a text subject was not kept as the title");
const reshaped = strategicDrift((d) => {
  d.actors = Object.fromEntries(d.actors.map((actor) => [actor.id, actor]));
  d.evidence = d.evidence.items;
});
assert.equal(reshaped.canonical, true, "an ID-keyed pillar or bare section list should stay canonical");
assert.deepEqual(reshaped.analysis.actors.map((actor) => actor.id), fixture.actors.map((actor) => actor.id), "ID-keyed records were lost");
assert.equal(reshaped.analysis.evidence.items.length, fixture.evidence.items.length, "bare evidence list was lost");
for (const [name, mutate] of Object.entries({
  nullRecord: (d) => { d.actors.push(null); },
  singleRecordWithoutId: (d) => { const { id, ...actor } = d.actors[0]; d.actors = actor; },
  idAsObject: (d) => { d.actors[0].id = { value: "A1" }; },
  looseVersion: (d) => { d.schema_version = "1.0"; },
})) {
  const result = strategicDrift(mutate);
  assert.equal(result.ok, true, `Strategic drift was rejected: ${name} ${JSON.stringify(result.errors?.slice(0, 2))}`);
}
assert.equal(strategicDrift((d) => { d.schema_version = "2.0"; }).ok, false, "an unsupported major version must stay refused");
const hiddenAssumptions = structuredClone(fixture);
hiddenAssumptions.assumptions = Object.fromEntries(
  [{ statement: "Budget pressure persists", basis: "context" }].map((item, index) => [`AS${index + 1}`, item]),
);
hiddenAssumptions.assumptions.items = [];
const shapeRepairs = reshapeStrategicSections(hiddenAssumptions).repairs;
assert.equal(hiddenAssumptions.assumptions.items[0]?.id, "AS1", "an ID-keyed section map was left hidden beside empty items");
assert.equal(shapeRepairs[0]?.code, "OBJECT_MAP_TO_ARRAY", "section reshaping was not disclosed");
for (const [name, section] of Object.entries({
  namedList: (items) => ({ records: items }),
  mapBesideNote: (items) => ({ summary: "Section note", ...Object.fromEntries(items.map((item) => [item.id, item])) }),
  mapBesideEmptyItems: (items) => ({ items: [], extra: "note", ...Object.fromEntries(items.map((item) => [item.id, item])) }),
})) {
  const result = strategicDrift((d) => { d.evidence = section(d.evidence.items); });
  assert.equal(result.analysis.evidence.items.length, fixture.evidence.items.length, `section records were hidden: ${name}`);
  assert.deepEqual(Object.keys(result.analysis.evidence), ["items"], `section extras were left unseen: ${name}`);
  if (name !== "namedList") {
    assert.ok(result.quarantine.some((item) => item.path.startsWith("/evidence/")), `section extras were not preserved in the audit: ${name}`);
  }
}
const listedIds = strategicDrift((d) => { d.interests[0].id = ["I1", "I2"]; });
assert.equal(listedIds.ok, true, "a list of IDs rejected the whole Strategic answer");
assert.notEqual(listedIds.analysis.interests[0].id, "I1; I2", "several IDs were joined into an invented one");
assert.deepEqual(listedIds.quarantine.find((item) => item.path === "/interests/0/id")?.value, ["I1", "I2"], "the ID list was not preserved in the audit");
assert.equal(strategicDrift((d) => { d.schema_version = "V1.1"; }).canonical, true, "an upper-case 1.x version was refused");
assert.equal(strategicDrift((d) => { d.schema_version = ["1.1"]; }).ok, false, "a version given as a list must stay refused");
assert.equal(globalThis.Jarbou3iContractRepair.languageCode("constructor"), undefined, "an inherited property was read as a language");
const textSection = strategicDrift((d) => { d.contradictions = "None found"; });
assert.equal(textSection.ok, true, "a text section rejected the whole Strategic answer");
assert.equal(textSection.quarantine[0]?.value, "None found", "a text section was not preserved in the audit");
console.log("Strategic schema, identity, reference, score, and source URL integrity checks passed.");
