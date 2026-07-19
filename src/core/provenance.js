/* Shared evidence-provenance assessment. Imported model claims are never human approval. */

const arr = (value) => (Array.isArray(value) ? value : []);
const text = (value) =>
  value === null || value === undefined ? "" : String(value).trim();
const isRecord = (value) =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const VERIFICATION_WEIGHT = Object.freeze({
  verified: 1,
  partially_verified: 0.6,
  disputed: 0.25,
  unverified: 0,
});

function validHttpUrl(value) {
  try {
    return ["http:", "https:"].includes(new URL(text(value)).protocol);
  } catch {
    return false;
  }
}

function evidenceRecords(analysis, lens) {
  if (lens === "biopolitical") return arr(analysis?.evidence?.items);
  return arr(analysis?.evidence?.items);
}

function collectConfidenceDiagnostics(value) {
  const summary = {
    records: 0,
    high: 0,
    highWithoutDirectEvidence: 0,
  };
  const visit = (candidate) => {
    if (Array.isArray(candidate)) {
      candidate.forEach(visit);
      return;
    }
    if (!isRecord(candidate)) return;
    if (["high", "medium", "low"].includes(candidate.confidence)) {
      summary.records += 1;
      if (candidate.confidence === "high") {
        summary.high += 1;
        const directEvidence = Object.entries(candidate).some(
          ([key, item]) =>
            /(?:^|_)(?:evidence|supporting_evidence|counter_evidence)_ids?$/.test(
              key,
            ) && arr(item).some((id) => text(id)),
        );
        if (!directEvidence) summary.highWithoutDirectEvidence += 1;
      }
    }
    Object.values(candidate).forEach(visit);
  };
  visit(value);
  return Object.freeze(summary);
}

function normalizeReviewDecision(decision) {
  if (!isRecord(decision)) return null;
  if (!['human_reviewed', 'approved'].includes(decision.status)) return null;
  if (!text(decision.reviewer_id) || !text(decision.reviewed_at)) return null;
  if (!text(decision.method)) return null;
  return Object.freeze({
    status: decision.status,
    reviewerId: text(decision.reviewer_id),
    reviewedAt: text(decision.reviewed_at),
    method: text(decision.method),
    sourceSnapshot: text(decision.source_snapshot),
  });
}

export function assessEvidenceProvenance(
  analysis,
  { lens = analysis?.analysis_lens || "strategic", reviewDecisions = {} } = {},
) {
  const records = evidenceRecords(analysis, lens);
  const details = records.map((record, index) => {
    const id = text(record?.id) || `evidence-${index + 1}`;
    const hasUrl = validHttpUrl(record?.source_url);
    const hasLocator = Boolean(text(record?.source_locator));
    const sourceStatus = hasUrl || hasLocator
      ? "traceable"
      : text(record?.source_title || record?.source_note)
        ? "provided"
        : "missing";
    const fit = text(record?.claim_source_fit);
    const claimStatus = fit === "direct"
      ? "traceable"
      : ["indirect", "context_only"].includes(fit)
        ? "contextual"
        : fit === "mismatched"
          ? "mismatched"
          : "unassessed";
    const declaredStatus = text(record?.verification_status) || "unverified";
    const decision = normalizeReviewDecision(reviewDecisions[id]);
    const reviewStatus = decision?.status || "unreviewed";
    const approvalEligible =
      reviewStatus === "approved" &&
      sourceStatus === "traceable" &&
      !["mismatched", "unassessed"].includes(claimStatus);
    return Object.freeze({
      id,
      sourceStatus,
      claimStatus,
      declaredStatus,
      declaredBy: text(record?.verified_by),
      declaredAt: text(record?.verification_date),
      reviewStatus,
      approvalEligible,
      decision,
    });
  });

  const count = details.length;
  const traceable = details.filter((item) => item.sourceStatus === "traceable").length;
  const declaredVerification = count
    ? Math.round(
        (details.reduce(
          (sum, item) => sum + (VERIFICATION_WEIGHT[item.declaredStatus] || 0),
          0,
        ) /
          count) *
          100,
      )
    : 0;
  const humanReviewed = details.filter((item) =>
    ["human_reviewed", "approved"].includes(item.reviewStatus),
  ).length;
  const approved = details.filter((item) => item.approvalEligible).length;
  return Object.freeze({
    lens,
    total: count,
    traceable,
    sourceTraceability: count ? Math.round((traceable / count) * 100) : 0,
    declaredVerification,
    humanReviewed,
    humanReview: count ? Math.round((humanReviewed / count) * 100) : 0,
    approved,
    approval: count ? Math.round((approved / count) * 100) : 0,
    publicationApproved: count > 0 && approved === count,
    confidence: collectConfidenceDiagnostics(analysis),
    records: Object.freeze(details),
  });
}

export function capDecisionReadiness(analyticalCoverage, provenance) {
  const coverage = Math.max(0, Math.min(100, Number(analyticalCoverage) || 0));
  const review = Math.max(0, Math.min(100, Number(provenance?.humanReview) || 0));
  const traceability = Math.max(
    0,
    Math.min(100, Number(provenance?.sourceTraceability) || 0),
  );
  const epistemicCeiling = 40 + review * 0.4 + traceability * 0.2;
  return Math.round(Math.min(coverage, epistemicCeiling));
}

export const PROVENANCE_STATES = Object.freeze({
  source: Object.freeze(["missing", "provided", "traceable"]),
  claim: Object.freeze(["unassessed", "mismatched", "contextual", "traceable"]),
  review: Object.freeze(["unreviewed", "human_reviewed", "approved"]),
});

if (typeof window !== "undefined") {
  window.Jarbou3iProvenance = Object.freeze({
    assessEvidenceProvenance,
    capDecisionReadiness,
    PROVENANCE_STATES,
  });
}
