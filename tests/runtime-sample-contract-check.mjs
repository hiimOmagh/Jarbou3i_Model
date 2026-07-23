import assert from "node:assert/strict";
import fs from "node:fs";

await import("../src/strategic-schema-validator.js");
const { validateStrategicAnalysis } = await import("../src/strategic-integrity.js");
const source = fs.readFileSync(new URL("../src/app.js", import.meta.url), "utf8");
const start = source.indexOf("function sampleStrategicAnalysis");
assert(start >= 0, "runtime Strategic sample factory is missing");
const brace = source.indexOf("{", start);
let depth = 0;
let end = -1;
for (let index = brace; index < source.length; index += 1) {
  if (source[index] === "{") depth += 1;
  if (source[index] === "}" && --depth === 0) { end = index + 1; break; }
}
assert(end > brace, "runtime Strategic sample factory could not be isolated");
const state = { lang: "en", promptMode: "simple" };
const normalizeAnalysis = (value) => value;
const factory = eval(`(${source.slice(start, end)})`);

for (const language of ["ar", "en", "fr"]) {
  const sample = factory(language, "simple");
  const result = validateStrategicAnalysis(sample);
  assert.equal(result.ok, true, `${language} runtime sample failed: ${JSON.stringify(result.errors)}`);
  assert.equal(result.analysis.language, language, `${language} runtime sample changed language`);
  assert.equal(result.analysis.analysis_lens, "strategic", `${language} runtime sample changed lens`);
}

assert(/loadSampleBtn[\s\S]{0,2400}showOperationFailure\(error, "load_sample"/.test(source), "sample loading lacks an actionable failure boundary");
console.log("Runtime Strategic samples validate in AR/EN/FR and sample failures remain diagnosable.");
