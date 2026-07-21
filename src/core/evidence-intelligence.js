/* Jarbou3i Model — deterministic source clusters and evidence gap intelligence */

const arr = (value) => (Array.isArray(value) ? value : []);
const record = (value) => value && typeof value === "object" && !Array.isArray(value) ? value : {};
const text = (value) => value === null || value === undefined ? "" : String(value).trim();

function deepFreeze(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  Object.values(value).forEach(deepFreeze);
  return Object.freeze(value);
}

function resolvePointer(source, pointer) {
  if (!pointer || pointer === "/") return source;
  return pointer.slice(1).split("/")
    .map((token) => token.replaceAll("~1", "/").replaceAll("~0", "~"))
    .reduce((value, token) => value?.[token], source);
}

function normalizedText(value) {
  return text(value).normalize("NFKC").replace(/\s+/g, " ").toLocaleLowerCase("en");
}

function normalizedUrl(value) {
  try {
    const url = new URL(text(value));
    if (!["http:", "https:"].includes(url.protocol)) return "";
    url.protocol = url.protocol.toLowerCase();
    url.hostname = url.hostname.toLowerCase();
    return url.href;
  } catch {
    return "";
  }
}

function clusterIdentity(source, id) {
  const url = normalizedUrl(source.source_url);
  const title = normalizedText(source.source_title);
  const locator = normalizedText(source.source_locator);
  if (url) return { key: `url:${url}`, basis: "url", strength: "traceable" };
  if (title && locator) return { key: `locator:${title}|${locator}`, basis: "title_locator", strength: "traceable" };
  if (title) return { key: `title:${title}`, basis: "title", strength: "provided" };
  return { key: `missing:${id}`, basis: "missing", strength: "missing" };
}

function hasCounterEvidence(source) {
  return arr(source.counter_evidence_ids).some((id) => text(id))
    || arr(source.counter_evidence).some((item) => text(item))
    || Boolean(text(source.counter_evidence));
}

export function createEvidenceIntelligence({
  lens,
  analysis,
  nodes = [],
  relationship = null,
  provenance = null,
} = {}) {
  if (!["strategic", "biopolitical"].includes(lens)) {
    throw new TypeError(`Unsupported evidence-intelligence lens: ${lens}`);
  }
  const canonical = record(analysis);
  const provenanceById = new Map(arr(provenance?.records).map((item) => [text(item?.id), item]));
  const evidence = arr(nodes).filter((node) => node?.type === "evidence").map((node) => {
    const source = record(resolvePointer(canonical, node.path));
    const identity = clusterIdentity(source, node.id);
    const backlinks = relationship?.backReferences?.(node.id)?.evidence || [];
    return deepFreeze({
      id: text(node.id), label: text(node.label), path: text(node.path),
      confidence: text(node.confidence), sourceTitle: text(source.source_title),
      sourceUrl: normalizedUrl(source.source_url), sourceLocator: text(source.source_locator),
      sourceDate: text(source.source_date), sourceType: text(source.source_type),
      sourceTier: text(source.source_tier), identity,
      sourceStatus: text(provenanceById.get(node.id)?.sourceStatus),
      claimStatus: text(provenanceById.get(node.id)?.claimStatus),
      declaredVerification: text(provenanceById.get(node.id)?.declaredStatus),
      citedByIds: [...new Set(backlinks.map((item) => text(item.ownerId)).filter(Boolean))],
      counterEvidence: hasCounterEvidence(source),
    });
  });

  const clusterMap = new Map();
  evidence.forEach((item) => {
    if (!clusterMap.has(item.identity.key)) clusterMap.set(item.identity.key, []);
    clusterMap.get(item.identity.key).push(item);
  });
  const clusters = [...clusterMap.entries()].map(([key, members], index) => {
    const first = members[0];
    return deepFreeze({
      id: `SC${index + 1}`,
      key,
      label: first.sourceTitle || first.sourceUrl || first.sourceLocator || first.label,
      identityBasis: first.identity.basis,
      identityStrength: first.identity.strength,
      sourceUrl: first.sourceUrl,
      sourceLocator: first.sourceLocator,
      memberIds: members.map((item) => item.id),
      citedByIds: [...new Set(members.flatMap((item) => item.citedByIds))],
      sourceDates: [...new Set(members.map((item) => item.sourceDate).filter(Boolean))],
      traceableCount: members.filter((item) => item.sourceStatus === "traceable").length,
      verifiedCount: members.filter((item) => item.declaredVerification === "verified").length,
      counterEvidenceCount: members.filter((item) => item.counterEvidence).length,
      confidences: deepFreeze(Object.fromEntries(["high", "medium", "low"].map((level) => [
        level, members.filter((item) => item.confidence === level).length,
      ]))),
    });
  });

  const idsWhere = (predicate) => evidence.filter(predicate).map((item) => item.id);
  const gaps = deepFreeze({
    missingIdentity: idsWhere((item) => item.identity.basis === "missing"),
    titleOnlyIdentity: idsWhere((item) => item.identity.basis === "title"),
    uncitedEvidence: idsWhere((item) => !item.citedByIds.length),
    missingCounterEvidence: idsWhere((item) => !item.counterEvidence),
    missingSourceDate: idsWhere((item) => !item.sourceDate || normalizedText(item.sourceDate) === "unknown"),
    untraceableEvidence: idsWhere((item) => item.sourceStatus !== "traceable"),
    concentratedClusters: clusters.filter((cluster) => cluster.memberIds.length > 1).map((cluster) => cluster.id),
  });
  const gapCount = Object.values(gaps).reduce((sum, items) => sum + items.length, 0);
  const cited = evidence.filter((item) => item.citedByIds.length).length;
  const largestCluster = clusters.reduce((largest, cluster) => Math.max(largest, cluster.memberIds.length), 0);
  const stats = deepFreeze({
    evidenceRecords: evidence.length,
    sourceClusters: clusters.length,
    citedEvidence: cited,
    uncitedEvidence: evidence.length - cited,
    traceableEvidence: evidence.filter((item) => item.sourceStatus === "traceable").length,
    gapCount,
    largestCluster,
    concentrationPercent: evidence.length ? Math.round((largestCluster / evidence.length) * 100) : 0,
  });

  return Object.freeze({
    lens,
    evidence: Object.freeze(evidence),
    clusters: Object.freeze(clusters),
    gaps,
    stats,
    resolveCluster(id) { return clusters.find((cluster) => cluster.id === text(id)) || null; },
    clusterForEvidence(id) { return clusters.find((cluster) => cluster.memberIds.includes(text(id))) || null; },
  });
}
