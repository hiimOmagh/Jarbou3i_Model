import fs from "node:fs";
import { createResultsInspectionIndex } from "../src/core/results-inspection.js";
import { assessEvidenceProvenance } from "../src/core/provenance.js";
import "../src/biopolitics-graph.js";

const fail = (message) => { console.error(`Evidence traceability check failed: ${message}`); process.exit(1); };
const assert = (condition, message) => { if (!condition) fail(message); };
const fixture = (name) => JSON.parse(fs.readFileSync(new URL(`../fixtures/${name}`, import.meta.url), "utf8"));

const strategic = fixture("sample-analysis-en.json");
const strategicIndex = createResultsInspectionIndex({
  lens: "strategic", analysis: strategic,
  provenance: assessEvidenceProvenance(strategic, { lens: "strategic" }), lang: "en",
});
assert(Object.isFrozen(strategicIndex.traceability), "traceability projection must be immutable");
assert(strategicIndex.traceability.stats.records === 9, "strategic traceability row count drifted");
assert(strategicIndex.traceability.stats.authoredRoutes === 0, "strategic fixture acquired invented evidence routes");
assert(strategicIndex.traceability.rows.every((row) => row.balance === "unreferenced"), "unreferenced strategic rows were misclassified");

const bio = fixture("sample-analysis-bio-en.json");
const graph = globalThis.Jarbou3iBiopoliticsGraph.build(bio, "en");
const bioIndex = createResultsInspectionIndex({
  lens: "biopolitical", analysis: bio, graph,
  provenance: assessEvidenceProvenance(bio, { lens: "biopolitical" }), lang: "en",
});
const intervention = bioIndex.traceability.row("IV1");
assert(intervention.supportingIds.includes("E1"), "intervention support route missing");
assert(bioIndex.traceability.routesForEvidence("E1").some((route) => route.recordId === "IV1"), "reverse evidence route missing");
const manifest = bioIndex.traceability.manifest({ appVersion: "2.1.0-alpha.33", language: "en" });
assert(Object.isFrozen(manifest), "derived manifest must be immutable");
assert(manifest.format === "jarbou3i-evidence-intelligence-v1", "manifest identity drifted");
assert(manifest.derived === true && manifest.canonical_transport === false, "derived boundary missing");
assert(manifest.app_version === "2.1.0-alpha.33", "manifest version missing");
assert(manifest.analysis_lens === "biopolitical", "manifest lens missing");
assert(manifest.claim_evidence_matrix.some((row) => row.recordId === "IV1"), "matrix row missing");
assert(manifest.authored_routes.some((route) => route.evidenceId === "E1"), "authored route missing");
assert(!("analysis" in manifest), "raw canonical analysis leaked into derived manifest");
assert(!JSON.stringify(manifest).includes(bio.subject.executive_thesis), "canonical thesis leaked into derived manifest");

console.log("Evidence traceability checks passed.");
