import fs from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";

const context = { window: {} };
vm.createContext(context);
vm.runInContext(
  fs.readFileSync("src/biopolitics-graph.js", "utf8"),
  context,
  { filename: "src/biopolitics-graph.js" },
);

const api = context.window.Jarbou3iBiopoliticsGraph;
assert.ok(api, "relationship index must attach to the browser global");

const analysis = JSON.parse(
  fs.readFileSync("fixtures/sample-analysis-bio-en.json", "utf8"),
);
const before = JSON.stringify(analysis);
const graph = api.build(analysis, "en");

assert.equal(graph.nodes.length, 32, "all canonical ID-bearing fixture records must be indexed");
assert.equal(graph.diagnostics.unresolved.length, 0, "canonical fixture references must resolve");
assert.equal(graph.diagnostics.duplicates.length, 0, "canonical fixture IDs must be globally unique");
assert.equal(JSON.stringify(analysis), before, "building the index must not mutate canonical analysis");

const temporal = api.temporalProjection(analysis);
assert.deepEqual(
  Array.from(temporal, (band) => [band.key, band.items.length]),
  [["historical", 1], ["dated", 0], ["immediate", 2], ["medium", 4], ["future", 1]],
  "temporal projection must expose only the five deterministic canonical bands",
);
assert.ok(Object.isFrozen(temporal) && temporal.every(Object.isFrozen));
assert.equal(temporal[2].items[0].path, "/scale_time/immediate_effects/0");

const comparisons = api.comparativeProjection(analysis);
assert.equal(comparisons.length, 1);
assert.equal(comparisons[0].id, "CMP1");
assert.deepEqual([...comparisons[0].evidenceIds], ["E1", "E2"]);
assert.match(comparisons[0].transferLimits[0], /cannot be inferred/i);
assert.equal(JSON.stringify(analysis), before, "projections must not mutate canonical analysis");

const spatial = api.spatialProjection(graph);
assert.equal(spatial.nodes.length, 32, "spatial projection must preserve every visible canonical record");
assert.equal(spatial.edges.length, 28, "spatial projection must preserve every indexed connection");
assert.equal(spatial.clusters.length, 9, "spatial projection must preserve all nine analytical pillars");
assert.ok(Object.isFrozen(spatial) && Object.isFrozen(spatial.nodes) && spatial.nodes.every(Object.isFrozen));
assert.deepEqual(
  { ...spatial.nodes.find((node) => node.id === "HF1") },
  { id: "HF1", pillar: "human_functions", x: 0, y: -280, z: -59 },
  "spatial coordinates must remain deterministic",
);
const spatialSubset = api.spatialProjection(graph, ["HF1", "INS1"]);
assert.deepEqual(
  { ...spatialSubset.nodes.find((node) => node.id === "HF1") },
  { ...spatial.nodes.find((node) => node.id === "HF1") },
  "filtering must not move surviving spatial records",
);
assert.equal(spatialSubset.edges.length, 1);
assert.equal(JSON.stringify(analysis), before, "spatial projection must not mutate canonical analysis");

const canonicalPillars = [
  "question_context",
  "human_functions",
  "actors_institutions",
  "mechanisms_infrastructure",
  "meaning_classification",
  "intervention_capture",
  "distribution_effects",
  "evidence_explanations",
  "agency_alternatives",
];
assert.deepEqual(
  [...new Set(graph.nodes.map((node) => node.pillar))].sort(),
  [...canonicalPillars].sort(),
  "every graph node must map to one of the nine rendered Biopolitical pillars",
);
for (const pillar of canonicalPillars) {
  assert.ok(
    graph.nodes.some((node) => node.pillar === pillar),
    `fixture must exercise the ${pillar} map lane`,
  );
}

assert.equal(graph.resolve("ACT1")?.label, "Public-health authorities");
assert.match(graph.resolve("E1")?.label || "", /Rules linked defined health credentials/i);
assert.equal(
  graph.resolve("RES1")?.label,
  "Workers and residents subject to access checks",
  "resistance nodes must lead with a named actor or population, not a canonical form enum",
);
assert.equal(graph.resolve("missing"), null);

const explicit = graph.edges.filter((edge) => edge.provenance === "explicit");
assert.equal(explicit.length, 4, "all authored causal links must remain explicit");
assert.ok(explicit.every((edge) => edge.family === "explicit" && edge.id));
assert.ok(explicit.some((edge) => edge.source === "HF1" && edge.target === "INS1" && edge.relation === "enables"));
assert.ok(graph.edges.some((edge) => edge.source === "EX1" && edge.target === "E1" && edge.relation === "supported_by"));
assert.ok(graph.edges.some((edge) => edge.source === "EX1" && edge.target === "E2" && edge.relation === "countered_by"));
assert.ok(graph.edges.some((edge) => edge.relation === "supported_by" && edge.family === "evidence"));
assert.ok(graph.edges.some((edge) => edge.relation === "targets" && edge.family === "structural"));

const named = api.plainText("E1 · E2 · NOT-E1", graph);
assert.match(named, /Rules linked defined health credentials.*\[E1\]/);
assert.match(named, /Implementation and sunset conditions.*\[E2\]/);
assert.match(named, /NOT-E1$/, "IDs embedded in a larger token must not be rewritten");

const arabic = api.build(
  JSON.parse(fs.readFileSync("fixtures/sample-analysis-bio-ar.json", "utf8")),
  "ar",
);
assert.equal(arabic.typeLabel("evidence"), "دليل");
assert.ok(arabic.resolve("E1")?.label, "localized fixtures must retain resolvable names");
assert.equal(arabic.resolve("RES1")?.label, "عمال وسكان خاضعون لفحوص الوصول");

const french = api.build(
  JSON.parse(fs.readFileSync("fixtures/sample-analysis-bio-fr.json", "utf8")),
  "fr",
);
assert.equal(french.resolve("RES1")?.label, "Travailleurs et résidents soumis aux contrôles d’accès");

console.log("Biopolitical relationship graph checks passed.");
