/* Jarbou3i Model — shared, read-only evidence and relationship intelligence */

const arr = (value) => (Array.isArray(value) ? value : []);
const record = (value) =>
  value && typeof value === "object" && !Array.isArray(value) ? value : {};
const text = (value) =>
  value === null || value === undefined ? "" : String(value).trim();

const LENSES = Object.freeze(["strategic", "biopolitical"]);
const SUPPORT_FIELDS = Object.freeze([
  "supporting_evidence_ids",
  "evidence_ids",
  "evidence_of_benefit",
]);
const COUNTER_FIELDS = Object.freeze(["counter_evidence_ids"]);

function deepFreeze(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  Object.values(value).forEach(deepFreeze);
  return Object.freeze(value);
}

function resolvePointer(source, pointer) {
  if (!pointer || pointer === "/") return source;
  return pointer
    .slice(1)
    .split("/")
    .map((token) => token.replaceAll("~1", "/").replaceAll("~0", "~"))
    .reduce((value, token) => value?.[token], source);
}

function uniqueIds(value) {
  return [...new Set(arr(value).map(text).filter(Boolean))];
}

function evidenceReferences(node, analysis) {
  const source = record(resolvePointer(analysis, node.path));
  const references = [];
  for (const [role, fields] of [["supporting", SUPPORT_FIELDS], ["counter", COUNTER_FIELDS]]) {
    for (const field of fields) {
      uniqueIds(source[field]).forEach((targetId, index) => {
        references.push(deepFreeze({
          ownerId: node.id,
          targetId,
          role,
          field,
          path: `${node.path}/${field}/${index}`,
        }));
      });
    }
  }
  return references;
}

function publicNode(node) {
  return deepFreeze({
    id: text(node?.id),
    type: text(node?.type),
    pillar: text(node?.pillar),
    label: text(node?.label),
    subtitle: text(node?.subtitle),
    confidence: text(node?.confidence),
    path: text(node?.path),
  });
}

function deepLink(lens, id) {
  return `#record=${encodeURIComponent(lens)}:${encodeURIComponent(text(id))}`;
}

export function parseRelationshipDeepLink(value) {
  const match = /^#record=([^:]+):(.+)$/.exec(text(value));
  if (!match) return null;
  try {
    const lens = decodeURIComponent(match[1]);
    const id = decodeURIComponent(match[2]);
    return LENSES.includes(lens) && id ? Object.freeze({ lens, id }) : null;
  } catch {
    return null;
  }
}

export function createRelationshipIntelligence({
  lens,
  analysis,
  nodes = [],
  edges = [],
  provenance = null,
  diagnostics = {},
} = {}) {
  if (!LENSES.includes(lens)) {
    throw new TypeError(`Unsupported relationship-intelligence lens: ${lens}`);
  }
  const canonical = record(analysis);
  const publicNodes = arr(nodes).map(publicNode);
  const byId = new Map(publicNodes.map((node) => [node.id, node]));
  const incoming = new Map(publicNodes.map((node) => [node.id, []]));
  const outgoing = new Map(publicNodes.map((node) => [node.id, []]));
  const unresolvedRelationships = [];

  const publicEdges = arr(edges).map((edge) => deepFreeze({
    id: text(edge?.id),
    source: text(edge?.source),
    target: text(edge?.target),
    family: text(edge?.family),
    relation: text(edge?.relation) || "related_to",
    mechanism: text(edge?.mechanism),
    confidence: text(edge?.confidence),
    path: text(edge?.path),
    provenance: text(edge?.provenance),
  }));
  publicEdges.forEach((edge) => {
    if (byId.has(edge.source) && byId.has(edge.target)) {
      outgoing.get(edge.source).push(edge);
      incoming.get(edge.target).push(edge);
    } else {
      unresolvedRelationships.push(edge);
    }
  });

  const evidenceByOwner = new Map(publicNodes.map((node) => [node.id, []]));
  const evidenceBacklinks = new Map(publicNodes.map((node) => [node.id, []]));
  const unresolvedEvidence = [];
  publicNodes.forEach((node) => {
    evidenceReferences(node, canonical).forEach((reference) => {
      evidenceByOwner.get(node.id).push(reference);
      if (byId.has(reference.targetId)) evidenceBacklinks.get(reference.targetId).push(reference);
      else unresolvedEvidence.push(reference);
    });
  });

  const provenanceById = new Map(arr(provenance?.records).map((item) => [text(item?.id), item]));
  const isolatedRecords = publicNodes
    .filter((node) =>
      !incoming.get(node.id).length
      && !outgoing.get(node.id).length
      && !evidenceByOwner.get(node.id).length
      && !evidenceBacklinks.get(node.id).length)
    .map((node) => node.id);
  const unsupportedHighConfidence = publicNodes
    .filter((node) => node.confidence === "high"
      && !evidenceByOwner.get(node.id).some((item) => item.role === "supporting"))
    .map((node) => node.id);
  const untraceableEvidence = publicNodes
    .filter((node) => node.type === "evidence"
      && provenanceById.get(node.id)?.sourceStatus !== "traceable")
    .map((node) => node.id);

  const gaps = deepFreeze({
    duplicateIds: arr(diagnostics?.duplicates).map((item) => ({ ...item })),
    unresolvedRelationships,
    unresolvedEvidence,
    isolatedRecords,
    unsupportedHighConfidence,
    untraceableEvidence,
  });
  const stats = deepFreeze({
    records: publicNodes.length,
    relationships: publicEdges.length,
    evidenceReferences: [...evidenceByOwner.values()].reduce((sum, items) => sum + items.length, 0),
    backReferences: [...incoming.values()].reduce((sum, items) => sum + items.length, 0)
      + [...evidenceBacklinks.values()].reduce((sum, items) => sum + items.length, 0),
    unresolved: unresolvedRelationships.length + unresolvedEvidence.length,
    isolated: isolatedRecords.length,
  });

  const relatedNode = (reference) => byId.get(reference.targetId) || null;
  const ownerNode = (reference) => byId.get(reference.ownerId) || null;
  const evidenceView = (reference, direction) => deepFreeze({
    ...reference,
    record: direction === "backlink" ? ownerNode(reference) : relatedNode(reference),
  });

  return Object.freeze({
    lens,
    nodes: Object.freeze(publicNodes),
    edges: Object.freeze(publicEdges),
    stats,
    gaps,
    resolve(id) { return byId.get(text(id)) || null; },
    incoming(id) { return Object.freeze([...(incoming.get(text(id)) || [])]); },
    outgoing(id) { return Object.freeze([...(outgoing.get(text(id)) || [])]); },
    evidenceTrail(id) {
      const items = evidenceByOwner.get(text(id)) || [];
      return deepFreeze({
        supporting: items.filter((item) => item.role === "supporting").map((item) => evidenceView(item, "target")),
        counter: items.filter((item) => item.role === "counter").map((item) => evidenceView(item, "target")),
      });
    },
    backReferences(id) {
      const target = text(id);
      return deepFreeze({
        relationships: [...(incoming.get(target) || [])],
        evidence: (evidenceBacklinks.get(target) || []).map((item) => evidenceView(item, "backlink")),
      });
    },
    deepLink(id) { return byId.has(text(id)) ? deepLink(lens, id) : ""; },
    resolveDeepLink(value) {
      const target = parseRelationshipDeepLink(value);
      return target?.lens === lens ? byId.get(target.id) || null : null;
    },
  });
}

export const RELATIONSHIP_INTELLIGENCE_LENSES = LENSES;
