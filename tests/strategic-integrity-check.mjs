import assert from "node:assert/strict";
import fs from "node:fs";

await import("../src/strategic-schema-validator.js");
const { validateStrategicAnalysis } = await import("../src/strategic-integrity.js");
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

console.log("Strategic schema, identity, reference, score, and source URL integrity checks passed.");
