import fs from "node:fs";
import { createResultsInspectionIndex } from "../src/core/results-inspection.js";
import { assessEvidenceProvenance } from "../src/core/provenance.js";
import "../src/biopolitics-graph.js";

const fail = (message) => {
  console.error(`Results inspection check failed: ${message}`);
  process.exit(1);
};
const assert = (condition, message) => {
  if (!condition) fail(message);
};
const fixture = (name) => JSON.parse(
  fs.readFileSync(new URL(`../fixtures/${name}`, import.meta.url), "utf8"),
);

const strategic = fixture("sample-analysis-en.json");
const strategicIndex = createResultsInspectionIndex({
  lens: "strategic",
  analysis: strategic,
  provenance: assessEvidenceProvenance(strategic, { lens: "strategic" }),
  lang: "en",
});
assert(Object.isFrozen(strategicIndex), "index must be immutable");
assert(Object.isFrozen(strategicIndex.nodes), "node collection must be immutable");
assert(strategicIndex.nodes.length === 10, "strategic canonical record count drifted");
assert(strategicIndex.edges.length === 3, "strategic explicit links were not indexed");
assert(strategicIndex.resolve("I1")?.label === "Prevent renewed German hegemony", "human-readable strategic label was lost");
assert(strategicIndex.outgoing("I1")[0]?.target === "A1", "strategic outgoing relationship was not indexed");
assert(strategicIndex.incoming("A1")[0]?.source === "I1", "strategic incoming relationship was not indexed");

const strategicEvidence = strategicIndex.inspect("E1");
assert(Object.isFrozen(strategicEvidence), "inspection view must be immutable");
assert(Object.isFrozen(strategicEvidence.provenance), "provenance view must be immutable");
assert(strategicEvidence.canonicalId === "E1", "canonical identifier was not preserved");
assert(strategicEvidence.path === "/evidence/items/0", "canonical path was not preserved");
assert(strategicEvidence.provenance.sourceStatus === "provided", "provenance assessment was not joined");
assert(strategicEvidence.provenance.reviewStatus === "unreviewed", "independent-review state was not exposed");
assert(strategicEvidence.evidence.counterEvidence.length === 1, "authored counter-evidence was not exposed");
assert(
  strategicEvidence.occurrences.some((item) => item.kind === "canonical" && item.path === "/evidence/items/0/id"),
  "canonical occurrence was not indexed",
);
assert(!("analysis" in strategicEvidence), "canonical analysis leaked into the inspection view");

strategic.evidence.items[0].source_title = "Mutated after indexing";
assert(
  strategicIndex.inspect("E1").provenance.sourceTitle === "Historical power distribution reference",
  "source mutation leaked into the inspection view",
);

const noIdentifiers = createResultsInspectionIndex({
  lens: "strategic",
  analysis: { evidence: { items: [{ claim: "No canonical ID" }] } },
  provenance: { records: [{ id: "evidence-1", sourceStatus: "missing" }] },
});
assert(noIdentifiers.nodes.length === 0, "inspection fabricated a canonical identifier");

const biopolitical = fixture("sample-analysis-bio-en.json");
const graph = globalThis.Jarbou3iBiopoliticsGraph.build(biopolitical, "en");
const biopoliticalIndex = createResultsInspectionIndex({
  lens: "biopolitical",
  analysis: biopolitical,
  graph,
  provenance: assessEvidenceProvenance(biopolitical, { lens: "biopolitical" }),
  lang: "en",
});
const biopoliticalEvidence = biopoliticalIndex.inspect("E1");
assert(biopoliticalIndex.nodes.length === graph.nodes.length, "biopolitical graph nodes were not preserved");
assert(biopoliticalIndex.edges.length === graph.edges.length, "biopolitical graph edges were not preserved");
assert(biopoliticalEvidence.provenance.sourceTier === "primary_legal_policy", "source tier was not exposed");
assert(biopoliticalEvidence.provenance.verificationStatus === "unverified", "declared verification was not exposed");
assert(biopoliticalEvidence.audit.contractStatus === "canonical", "contract audit status was not exposed");
assert(biopoliticalEvidence.audit.limitations.length > 0, "evidence limitations were not exposed");
assert(biopoliticalEvidence.evidence.counterEvidence.length > 0, "biopolitical counter-evidence was not exposed");
assert(biopoliticalEvidence.occurrences.length > 1, "biopolitical occurrences were not indexed");

let rejected = false;
try {
  createResultsInspectionIndex({ lens: "unknown", analysis: {} });
} catch (error) {
  rejected = error instanceof TypeError;
}
assert(rejected, "unregistered lens was accepted");

console.log("Results inspection checks passed.");
