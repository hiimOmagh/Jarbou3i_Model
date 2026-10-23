/* Shared results-orientation view model. Canonical analysis data is never mutated. */

const text = (value, fallback = "—") => {
  const normalized = String(value ?? "").trim();
  return normalized || fallback;
};

const score = (value) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? Math.max(0, Math.min(100, Math.round(numeric))) : 0;
};

export function createResultsOrientation({
  lens,
  topic,
  conclusion,
  publicationApproved = false,
  publicationLabel,
  publicationTone,
  publicationSummary,
  readiness,
  coverage,
  uncertainty,
  nextAction,
} = {}) {
  if (!['strategic', 'biopolitical'].includes(lens)) {
    throw new TypeError('Results orientation requires a registered lens.');
  }

  return Object.freeze({
    lens,
    topic: text(topic),
    conclusion: text(conclusion),
    publication: Object.freeze({
      approved: Boolean(publicationApproved),
      label: text(publicationLabel),
      // The quality gate's tone; without one, approved or not.
      tone: ['ok', 'warn', 'crit'].includes(publicationTone) ? publicationTone : publicationApproved ? 'ok' : 'crit',
      // Why the gate says so; none, and the verdict stands alone.
      summary: text(publicationSummary, ''),
    }),
    readiness: score(readiness),
    coverage: score(coverage),
    uncertainty: text(uncertainty),
    nextAction: text(nextAction),
  });
}
