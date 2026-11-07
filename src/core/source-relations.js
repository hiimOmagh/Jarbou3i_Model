import { normalizedText, normalizedUrl } from "./evidence-intelligence.js";

/** Derive local source relations without changing either input. */
export function relateEvidence({ evidence = [], sources = [] } = {}) {
  const byEvidence = {}, bySource = {}, ambiguousTitles = [];
  const indexed = sources.map(source => ({ source, link: normalizedUrl(source.url), title: normalizedText(source.title) }));
  for (const item of evidence) {
    const link = normalizedUrl(item.source_url), title = normalizedText(item.source_title);
    let match = link ? indexed.find(source => source.link === link) : null;
    let by = "link";
    if (!match && title) {
      match = indexed.find(source => !source.link && source.title === title);
      by = "title";
      if (!match && !link) {
        const linked = indexed.filter(source => source.link && source.title === title);
        if (linked.length === 1) match = linked[0];
        else if (linked.length > 1 && !ambiguousTitles.includes(title)) ambiguousTitles.push(title);
      }
    }
    if (!match) continue;
    Object.defineProperty(byEvidence, item.id, { value: { source_id: match.source.source_id, by }, enumerable: true, configurable: true, writable: true });
    if (!Object.hasOwn(bySource, match.source.source_id)) Object.defineProperty(bySource, match.source.source_id, { value: [], enumerable: true });
    bySource[match.source.source_id].push(item.id);
  }
  return { byEvidence, bySource, ambiguousTitles };
}
