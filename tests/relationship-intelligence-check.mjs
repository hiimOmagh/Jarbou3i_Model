import fs from "node:fs";
import { createRelationshipIntelligence, parseRelationshipDeepLink } from "../src/core/relationship-intelligence.js";
import { createResultsInspectionIndex } from "../src/core/results-inspection.js";
import { assessEvidenceProvenance } from "../src/core/provenance.js";
import "../src/biopolitics-graph.js";

const fail = (message) => {
  console.error(`Relationship intelligence check failed: ${message}`);
  process.exit(1);
};
const assert = (condition, message) => { if (!condition) fail(message); };
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
assert(Object.isFrozen(strategicIndex.intelligence), "shared intelligence must be immutable");
assert(strategicIndex.stats.records === 10, "strategic record registry drifted");
assert(strategicIndex.stats.relationships === 3, "strategic relationship registry drifted");
assert(strategicIndex.backReferences("A1").relationships[0]?.source === "I1", "strategic back-reference missing");
assert(strategicIndex.deepLink("E1") === "#record=strategic:E1", "strategic deep link drifted");
assert(strategicIndex.resolveDeepLink("#record=strategic:E1")?.id === "E1", "strategic deep link did not resolve");
assert(strategicIndex.resolveDeepLink("#record=biopolitical:E1") === null, "cross-lens deep link leaked");
assert(parseRelationshipDeepLink("#record=strategic:E1")?.lens === "strategic", "deep-link parser rejected a valid target");
assert(parseRelationshipDeepLink("#record=unknown:E1") === null, "deep-link parser accepted an unknown lens");

const biopolitical = fixture("sample-analysis-bio-en.json");
const graph = globalThis.Jarbou3iBiopoliticsGraph.build(biopolitical, "en");
const provenance = assessEvidenceProvenance(biopolitical, { lens: "biopolitical" });
const biopoliticalIndex = createResultsInspectionIndex({
  lens: "biopolitical", analysis: biopolitical, graph, provenance, lang: "en",
});
const interventionTrail = biopoliticalIndex.evidenceTrail("IV1");
assert(interventionTrail.supporting.some((item) => item.targetId === "E1"), "authored evidence trail missing");
assert(interventionTrail.supporting.find((item) => item.targetId === "E1")?.record?.type === "evidence", "evidence target was not resolved");
const evidenceBacklinks = biopoliticalIndex.backReferences("E1").evidence;
assert(evidenceBacklinks.some((item) => item.ownerId === "IV1" && item.role === "supporting"), "evidence back-reference missing");
assert(biopoliticalIndex.inspect("IV1").relationship.evidenceTrail.supporting.length > 0, "inspection did not receive relationship intelligence");
assert(biopoliticalIndex.gaps.untraceableEvidence.includes("E1"), "objective source-traceability gap missing");

const snapshot = biopoliticalIndex.inspect("IV1").relationship.evidenceTrail.supporting[0].record.label;
biopolitical.intervention_assessment.interventions[0].name = "Mutated after indexing";
assert(
  biopoliticalIndex.inspect("IV1").relationship.evidenceTrail.supporting[0].record.label === snapshot,
  "canonical mutation leaked into the relationship projection",
);

const unresolved = createRelationshipIntelligence({
  lens: "strategic",
  analysis: { evidence: { items: [{ id: "E1" }] }, results: [{ id: "R1", evidence_ids: ["MISSING"] }] },
  nodes: [
    { id: "E1", type: "evidence", path: "/evidence/items/0" },
    { id: "R1", type: "result", path: "/results/0", confidence: "high" },
  ],
  edges: [{ id: "broken", source: "R1", target: "MISSING", relation: "supports" }],
});
assert(unresolved.gaps.unresolvedRelationships.length === 1, "unresolved relationship was hidden");
assert(unresolved.gaps.unresolvedEvidence.length === 1, "unresolved evidence reference was hidden");
assert(unresolved.resolve("MISSING") === null, "intelligence fabricated a missing record");

console.log("Relationship intelligence checks passed.");
