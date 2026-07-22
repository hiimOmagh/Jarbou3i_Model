import fs from "node:fs";
import { createResultsInspectionIndex } from "../src/core/results-inspection.js";
import { assessEvidenceProvenance } from "../src/core/provenance.js";
import "../src/biopolitics-graph.js";

const fail = (message) => { console.error(`Evidence review plan check failed: ${message}`); process.exit(1); };
const assert = (condition, message) => { if (!condition) fail(message); };
const fixture = (name) => JSON.parse(fs.readFileSync(new URL(`../fixtures/${name}`, import.meta.url), "utf8"));

function indexFor(lens, name) {
  const analysis = fixture(name);
  return createResultsInspectionIndex({
    lens, analysis,
    graph: lens === "biopolitical" ? globalThis.Jarbou3iBiopoliticsGraph.build(analysis, "en") : null,
    provenance: assessEvidenceProvenance(analysis, { lens }), lang: "en",
  });
}

const strategic = indexFor("strategic", "sample-analysis-en.json");
assert(Object.isFrozen(strategic.reviewPlan), "review plan must be immutable");
assert(Object.isFrozen(strategic.reviewPlan.tasks), "review tasks must be immutable");
assert(strategic.reviewPlan.tasks.length > 0, "strategic gaps did not produce review tasks");
assert(strategic.reviewPlan.tasks.every((task, index) => task.sequence === index + 1), "review sequence is unstable");
assert(strategic.reviewPlan.forPhase("verify_provenance").some((task) => task.targetId === "E1"), "strategic provenance task missing");

const bio = indexFor("biopolitical", "sample-analysis-bio-en.json");
assert(bio.reviewPlan.forPhase("verify_provenance").filter((task) => task.reasonCode === "untraceable_source").length === 2, "biopolitical untraceable-source tasks drifted");
assert(bio.reviewPlan.tasks.every((task) => !task.deepLink || task.deepLink.startsWith("#record=biopolitical:")), "review task deep link escaped its lens");
const manifest = bio.reviewPlan.manifest({ appVersion: "2.1.0-alpha.34", language: "en" });
assert(Object.isFrozen(manifest), "review-plan manifest must be immutable");
assert(manifest.format === "jarbou3i-evidence-review-plan-v1", "review-plan identity drifted");
assert(manifest.derived === true && manifest.canonical_transport === false, "derived boundary missing");
assert(manifest.completion_validates_conclusions === false, "truth boundary missing");
assert(manifest.app_version === "2.1.0-alpha.34", "review-plan version missing");
assert(!("analysis" in manifest), "raw canonical analysis leaked into review plan");
assert(!JSON.stringify(manifest).includes("Under what conditions did digital health passes"), "canonical research question leaked into review plan");

console.log("Evidence review plan checks passed.");
