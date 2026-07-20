import {
  createResultsExplanation,
  RESULTS_EXPLANATION_KEYS,
} from "../src/core/results-explanation.js";

const fail = (message) => {
  console.error(`Results explanation check failed: ${message}`);
  process.exit(1);
};
const assert = (condition, message) => {
  if (!condition) fail(message);
};

const sourceItems = [
  { name: "Authority", summary: "Sets the rule.", meta: ["actor", "high"] },
  { name: "Residents", summary: "Bear uneven effects.", meta: ["population"] },
  { name: "Vendor", summary: "Implements the infrastructure.", meta: ["institution"] },
];
const explanation = createResultsExplanation({
  lens: "biopolitical",
  sections: {
    actors: {
      label: "Actors & affected groups",
      description: "Who decides and who is affected.",
      actionLabel: "Inspect details",
      emptyLabel: "No authored signals.",
      total: 3,
      items: sourceItems,
      target: { review: "pillars", pillar: "actors_institutions" },
    },
  },
});

sourceItems[0].name = "Mutated source";
assert(Object.isFrozen(explanation), "view model must be immutable");
assert(Object.isFrozen(explanation.sections), "section collection must be immutable");
assert(Object.isFrozen(explanation.sections[0]), "section must be immutable");
assert(Object.isFrozen(explanation.sections[0].items), "preview items must be immutable");
assert(Object.isFrozen(explanation.sections[0].items[0].meta), "item metadata must be immutable");
assert(
  explanation.sections.map((section) => section.key).join(",") === RESULTS_EXPLANATION_KEYS.join(","),
  "shared explanation order drifted",
);
assert(explanation.sections[0].items.length === 2, "preview was not capped to two authored records");
assert(explanation.sections[0].total === 3, "complete authored count was not preserved");
assert(explanation.sections[0].items[0].name === "Authority", "canonical source mutation leaked into the view model");
assert(explanation.sections[1].total === 0, "missing section did not receive an empty normalized state");
assert(!("analysis" in explanation), "canonical analysis leaked into the explanation view model");

let rejected = false;
try {
  createResultsExplanation({ lens: "unknown" });
} catch (error) {
  rejected = error instanceof TypeError;
}
assert(rejected, "unregistered lens was accepted");

console.log("Results explanation checks passed.");
