import fs from "node:fs";
import { createEvidenceIntelligence } from "../src/core/evidence-intelligence.js";
import { createResultsInspectionIndex } from "../src/core/results-inspection.js";
import { assessEvidenceProvenance } from "../src/core/provenance.js";
import "../src/biopolitics-graph.js";

const fail = (message) => { console.error(`Evidence intelligence check failed: ${message}`); process.exit(1); };
const assert = (condition, message) => { if (!condition) fail(message); };
const fixture = (name) => JSON.parse(fs.readFileSync(new URL(`../fixtures/${name}`, import.meta.url), "utf8"));

const strategic = fixture("sample-analysis-en.json");
const strategicIndex = createResultsInspectionIndex({
  lens: "strategic", analysis: strategic,
  provenance: assessEvidenceProvenance(strategic, { lens: "strategic" }), lang: "en",
});
const strategicEvidence = strategicIndex.evidenceIntelligence;
assert(Object.isFrozen(strategicEvidence), "evidence intelligence must be immutable");
assert(Object.isFrozen(strategicEvidence.clusters), "source clusters must be immutable");
assert(strategicEvidence.stats.evidenceRecords === 1, "strategic evidence count drifted");
assert(strategicEvidence.clusters[0].identityBasis === "title", "title-only identity was misclassified");
assert(strategicEvidence.gaps.uncitedEvidence.includes("E1"), "uncited strategic evidence gap missing");
assert(strategicEvidence.gaps.missingSourceDate.includes("E1"), "unknown source date was treated as dated");
assert(strategicIndex.inspect("E1").evidence.sourceCluster?.id === "SC1", "inspection did not receive its source cluster");

const bio = fixture("sample-analysis-bio-en.json");
const graph = globalThis.Jarbou3iBiopoliticsGraph.build(bio, "en");
const bioIndex = createResultsInspectionIndex({
  lens: "biopolitical", analysis: bio, graph,
  provenance: assessEvidenceProvenance(bio, { lens: "biopolitical" }), lang: "en",
});
assert(bioIndex.evidenceIntelligence.stats.evidenceRecords === 2, "biopolitical evidence count drifted");
assert(bioIndex.evidenceIntelligence.stats.citedEvidence === 2, "authored biopolitical citations were not counted");
assert(bioIndex.evidenceIntelligence.gaps.untraceableEvidence.length === 2, "untraceable evidence signal drifted");
assert(bioIndex.evidenceIntelligence.clusters.every((cluster) => cluster.memberIds.length === 1), "distinct source titles were merged");

const synthetic = {
  evidence: { items: [
    { id: "E1", source_title: "Exact Source", source_url: "HTTPS://EXAMPLE.COM/report", source_date: "2025-01-01", counter_evidence: "Counterpoint", confidence: "high" },
    { id: "E2", source_title: "Different display title", source_url: "https://example.com/report", source_date: "2025-01-01", confidence: "medium" },
    { id: "E3", confidence: "low" },
    { id: "E4", confidence: "low" },
  ] },
};
const nodes = synthetic.evidence.items.map((item, index) => ({
  id: item.id, type: "evidence", label: item.source_title || item.id,
  path: `/evidence/items/${index}`, confidence: item.confidence,
}));
const clustered = createEvidenceIntelligence({ lens: "strategic", analysis: synthetic, nodes });
assert(clustered.stats.sourceClusters === 3, "exact URL identities were not clustered deterministically");
assert(clustered.clusters.find((cluster) => cluster.memberIds.includes("E1"))?.memberIds.length === 2, "same canonical URL did not cluster");
assert(clustered.clusterForEvidence("E3")?.id !== clustered.clusterForEvidence("E4")?.id, "missing source identities were falsely merged");
assert(clustered.gaps.concentratedClusters.length === 1, "source concentration signal missing");
assert(clustered.gaps.missingCounterEvidence.includes("E2"), "counter-evidence coverage gap missing");

console.log("Evidence intelligence checks passed.");
