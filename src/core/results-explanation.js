/* Shared results-explanation view model. Canonical analysis data is never retained or mutated. */

export const RESULTS_EXPLANATION_KEYS = Object.freeze([
  "actors",
  "mechanisms",
  "evidence",
  "tensions",
  "effects",
]);

const text = (value, fallback = "—") => {
  const normalized = String(value ?? "").trim();
  return normalized || fallback;
};

const optionalText = (value) => String(value ?? "").trim();

const freezeItem = (item = {}) =>
  Object.freeze({
    name: text(item.name),
    summary: optionalText(item.summary),
    meta: Object.freeze(
      (Array.isArray(item.meta) ? item.meta : [])
        .map(optionalText)
        .filter(Boolean)
        .slice(0, 3),
    ),
  });

const freezeTarget = (target = {}) =>
  Object.freeze({
    review: text(target.review),
    pillar: optionalText(target.pillar),
  });

const freezeSection = (key, section = {}) => {
  const sourceItems = Array.isArray(section.items) ? section.items : [];
  const items = Object.freeze(sourceItems.slice(0, 2).map(freezeItem));
  const suppliedTotal = Number(section.total);
  const total = Number.isFinite(suppliedTotal)
    ? Math.max(items.length, Math.max(0, Math.round(suppliedTotal)))
    : sourceItems.length;

  return Object.freeze({
    key,
    label: text(section.label),
    description: text(section.description),
    actionLabel: text(section.actionLabel),
    emptyLabel: text(section.emptyLabel),
    total,
    items,
    target: freezeTarget(section.target),
  });
};

export function createResultsExplanation({ lens, sections = {} } = {}) {
  if (!["strategic", "biopolitical"].includes(lens)) {
    throw new TypeError("Results explanation requires a registered lens.");
  }

  return Object.freeze({
    lens,
    sections: Object.freeze(
      RESULTS_EXPLANATION_KEYS.map((key) => freezeSection(key, sections[key])),
    ),
  });
}
