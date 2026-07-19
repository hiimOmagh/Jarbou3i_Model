import fs from "node:fs";
import {
  assessEvidenceProvenance,
  capDecisionReadiness,
} from "../src/core/provenance.js";

const fail = (message) => {
  console.error(`Provenance check failed: ${message}`);
  process.exit(1);
};
const assert = (condition, message) => {
  if (!condition) fail(message);
};

const analysis = JSON.parse(
  fs.readFileSync("fixtures/sample-analysis-bio-en.json", "utf8"),
);
const first = analysis.evidence.items[0];
first.verification_status = "verified";
first.verified_by = first.source_title || "Source publisher";
first.verification_date = "2026-07-19";
first.source_url = "https://example.org/source";
first.claim_source_fit = "direct";

const imported = assessEvidenceProvenance(analysis, { lens: "biopolitical" });
assert(imported.declaredVerification > 0, "model-declared status was not disclosed");
assert(imported.humanReview === 0, "imported model text was mistaken for human review");
assert(!imported.publicationApproved, "model-declared verification approved publication");
assert(
  capDecisionReadiness(100, imported) <= 60,
  "unreviewed evidence did not cap decision readiness",
);

const decisions = Object.fromEntries(
  analysis.evidence.items.map((item) => [
    item.id,
    {
      status: "approved",
      reviewer_id: "reviewer-1",
      reviewed_at: "2026-07-19T12:00:00Z",
      method: "source-and-claim review",
      source_snapshot: `sha256:${item.id}`,
    },
  ]),
);
for (const item of analysis.evidence.items) {
  item.source_url ||= `https://example.org/${item.id}`;
  item.claim_source_fit = "direct";
}
const reviewed = assessEvidenceProvenance(analysis, {
  lens: "biopolitical",
  reviewDecisions: decisions,
});
assert(reviewed.humanReview === 100, "complete human review was not measured");
assert(reviewed.publicationApproved, "eligible independent approvals were rejected");
assert(
  reviewed.confidence.highWithoutDirectEvidence <= reviewed.confidence.high,
  "confidence diagnostics are inconsistent",
);

console.log("Provenance checks passed.");
