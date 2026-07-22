import fs from "node:fs";
import vm from "node:vm";

const fail = (message) => {
  console.error(`AI interchange reliability check failed: ${message}`);
  process.exit(1);
};

const window = {};
window.window = window;
const context = vm.createContext({ window });
for (const file of ["src/json-parser.js", "src/contract-repair.js"]) {
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

console.log("AI interchange reliability checks passed.");
