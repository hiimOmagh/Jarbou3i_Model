/* Jarbou3i Model — authored claim–evidence traceability and derived manifest */

const arr = (value) => (Array.isArray(value) ? value : []);
const text = (value) => value === null || value === undefined ? "" : String(value).trim();

function deepFreeze(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  Object.values(value).forEach(deepFreeze);
  return Object.freeze(value);
}

export function createEvidenceTraceability({
  lens,
  analysis,
  nodes = [],
  relationship,
  evidenceIntelligence,
} = {}) {
  if (!["strategic", "biopolitical"].includes(lens)) {
    throw new TypeError(`Unsupported evidence-traceability lens: ${lens}`);
  }
  const evidenceById = new Map(arr(evidenceIntelligence?.evidence).map((item) => [item.id, item]));
  const rows = arr(nodes).filter((node) => node.type !== "evidence").map((node) => {
    const trail = relationship?.evidenceTrail?.(node.id) || { supporting: [], counter: [] };
    const supportingIds = trail.supporting.map((item) => item.targetId);
    const counterIds = trail.counter.map((item) => item.targetId);
    const evidenceIds = [...new Set([...supportingIds, ...counterIds])];
    const clusterIds = [...new Set(evidenceIds.map((id) =>
      evidenceIntelligence?.clusterForEvidence?.(id)?.id).filter(Boolean))];
    const unresolvedIds = evidenceIds.filter((id) => !evidenceById.has(id));
    const balance = supportingIds.length && counterIds.length
      ? "support_and_counter"
      : supportingIds.length ? "support_only" : counterIds.length ? "counter_only" : "unreferenced";
    return deepFreeze({
      recordId: text(node.id), label: text(node.label), type: text(node.type),
      pillar: text(node.pillar), path: text(node.path), confidence: text(node.confidence),
      supportingIds, counterIds, clusterIds, unresolvedIds, balance,
      traceableEvidence: evidenceIds.filter((id) => evidenceById.get(id)?.sourceStatus === "traceable").length,
      evidenceCount: evidenceIds.length,
      deepLink: relationship?.deepLink?.(node.id) || "",
    });
  });

  const routes = arr(evidenceIntelligence?.evidence).flatMap((evidence) => {
    const backlinks = relationship?.backReferences?.(evidence.id)?.evidence || [];
    return backlinks.map((reference) => deepFreeze({
      evidenceId: evidence.id,
      evidenceLabel: evidence.label,
      evidencePath: evidence.path,
      recordId: reference.ownerId,
      recordLabel: text(reference.record?.label),
      recordPath: text(reference.record?.path),
      role: reference.role,
      referencePath: reference.path,
      recordDeepLink: relationship?.deepLink?.(reference.ownerId) || "",
      sourceClusterId: evidenceIntelligence?.clusterForEvidence?.(evidence.id)?.id || "",
    }));
  });
  const stats = deepFreeze({
    records: rows.length,
    referencedRecords: rows.filter((row) => row.evidenceCount).length,
    unreferencedRecords: rows.filter((row) => !row.evidenceCount).length,
    balancedRecords: rows.filter((row) => row.balance === "support_and_counter").length,
    authoredRoutes: routes.length,
    unresolvedReferences: rows.reduce((sum, row) => sum + row.unresolvedIds.length, 0),
  });

  function manifest({ appVersion = "", language = "" } = {}) {
    return deepFreeze({
      format: "jarbou3i-evidence-intelligence-v1",
      derived: true,
      canonical_transport: false,
      app_version: text(appVersion),
      analysis_lens: lens,
      analysis_language: text(language || analysis?.language),
      analysis_id: text(analysis?.analysis_id),
      schema_version: text(analysis?.schema_version),
      contract_status: text(analysis?.contract_status),
      model_status: text(analysis?.model_status),
      stats,
      source_clusters: arr(evidenceIntelligence?.clusters).map((cluster) => ({
        id: cluster.id, label: cluster.label, identity_basis: cluster.identityBasis,
        identity_strength: cluster.identityStrength, member_ids: [...cluster.memberIds],
        cited_by_ids: [...cluster.citedByIds], traceable_count: cluster.traceableCount,
        verified_count: cluster.verifiedCount, counter_evidence_count: cluster.counterEvidenceCount,
        source_dates: [...cluster.sourceDates],
      })),
      claim_evidence_matrix: rows.map((row) => ({ ...row })),
      authored_routes: routes.map((route) => ({ ...route })),
      evidence_gaps: Object.fromEntries(Object.entries(evidenceIntelligence?.gaps || {}).map(
        ([key, values]) => [key, [...values]],
      )),
      relationship_gaps: {
        duplicate_ids: arr(relationship?.gaps?.duplicateIds).map((item) => ({ ...item })),
        unresolved_relationships: arr(relationship?.gaps?.unresolvedRelationships).map((item) => ({ ...item })),
        unresolved_evidence: arr(relationship?.gaps?.unresolvedEvidence).map((item) => ({ ...item })),
      },
    });
  }

  return Object.freeze({
    lens,
    rows: Object.freeze(rows),
    routes: Object.freeze(routes),
    stats,
    row(id) { return rows.find((item) => item.recordId === text(id)) || null; },
    routesForEvidence(id) { return Object.freeze(routes.filter((route) => route.evidenceId === text(id))); },
    manifest,
  });
}
