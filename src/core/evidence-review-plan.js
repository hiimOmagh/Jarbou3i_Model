/* Jarbou3i Model — deterministic evidence review queue and resolution plan */

const arr = (value) => (Array.isArray(value) ? value : []);
const text = (value) => value === null || value === undefined ? "" : String(value).trim();

function deepFreeze(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  Object.values(value).forEach(deepFreeze);
  return Object.freeze(value);
}

const PHASE_ORDER = Object.freeze({
  resolve_references: 0,
  verify_provenance: 1,
  strengthen_coverage: 2,
});

function orderedTask(task) {
  return {
    phaseOrder: PHASE_ORDER[task.phase] ?? 99,
    reasonOrder: task.reasonOrder ?? 99,
    targetId: text(task.targetId),
    ...task,
  };
}

export function createEvidenceReviewPlan({
  lens,
  analysis,
  relationship,
  evidenceIntelligence,
  traceability,
} = {}) {
  if (!["strategic", "biopolitical"].includes(lens)) {
    throw new TypeError(`Unsupported evidence-review lens: ${lens}`);
  }
  const tasks = [];
  const add = (task) => tasks.push(orderedTask(task));
  const linkFor = (id) => relationship?.deepLink?.(id) || "";

  arr(relationship?.gaps?.duplicateIds).forEach((item) => add({
    phase: "resolve_references", reasonOrder: 0, reasonCode: "duplicate_record_id",
    targetType: "record", targetId: text(item.id), canonicalPath: text(item.path),
    deepLink: linkFor(item.id),
  }));
  arr(relationship?.gaps?.unresolvedRelationships).forEach((item) => {
    const sourceResolved = Boolean(relationship?.resolve?.(item.source));
    const ownerId = sourceResolved ? text(item.source) : text(item.target);
    add({
      phase: "resolve_references", reasonOrder: 1, reasonCode: "unresolved_relationship_endpoint",
      targetType: "relationship", targetId: text(item.id), ownerId,
      missingIds: [item.source, item.target].map(text).filter((id) => !relationship?.resolve?.(id)),
      canonicalPath: text(item.path), deepLink: linkFor(ownerId),
    });
  });
  arr(relationship?.gaps?.unresolvedEvidence).forEach((item) => add({
    phase: "resolve_references", reasonOrder: 2, reasonCode: "unresolved_evidence_reference",
    targetType: "record", targetId: text(item.targetId), ownerId: text(item.ownerId),
    evidenceRole: text(item.role), canonicalPath: text(item.path), deepLink: linkFor(item.ownerId),
  }));

  const evidenceReasons = [
    ["missingIdentity", "missing_source_identity", 0],
    ["untraceableEvidence", "untraceable_source", 1],
    ["titleOnlyIdentity", "title_only_source_identity", 2],
  ];
  evidenceReasons.forEach(([gap, reasonCode, reasonOrder]) => {
    arr(evidenceIntelligence?.gaps?.[gap]).forEach((id) => add({
      phase: "verify_provenance", reasonOrder, reasonCode,
      targetType: "evidence", targetId: text(id), deepLink: linkFor(id),
    }));
  });

  const coverageReasons = [
    ["uncitedEvidence", "uncited_evidence", 0],
    ["missingCounterEvidence", "missing_counter_evidence", 1],
    ["missingSourceDate", "missing_source_date", 2],
  ];
  coverageReasons.forEach(([gap, reasonCode, reasonOrder]) => {
    arr(evidenceIntelligence?.gaps?.[gap]).forEach((id) => add({
      phase: "strengthen_coverage", reasonOrder, reasonCode,
      targetType: "evidence", targetId: text(id), deepLink: linkFor(id),
    }));
  });
  arr(evidenceIntelligence?.gaps?.concentratedClusters).forEach((id) => add({
    phase: "strengthen_coverage", reasonOrder: 3, reasonCode: "exact_source_concentration",
    targetType: "source_cluster", targetId: text(id),
    memberIds: [...arr(evidenceIntelligence?.resolveCluster?.(id)?.memberIds)], deepLink: "",
  }));
  arr(relationship?.gaps?.unsupportedHighConfidence).forEach((id) => add({
    phase: "strengthen_coverage", reasonOrder: 4, reasonCode: "unsupported_declared_high_confidence",
    targetType: "record", targetId: text(id), deepLink: linkFor(id),
  }));
  arr(relationship?.gaps?.isolatedRecords).forEach((id) => add({
    phase: "strengthen_coverage", reasonOrder: 5, reasonCode: "isolated_record",
    targetType: "record", targetId: text(id), deepLink: linkFor(id),
  }));

  tasks.sort((a, b) => a.phaseOrder - b.phaseOrder
    || a.reasonOrder - b.reasonOrder
    || a.targetId.localeCompare(b.targetId, "en"));
  const publicTasks = tasks.map((task, index) => deepFreeze({
    id: `RQ${String(index + 1).padStart(3, "0")}`,
    sequence: index + 1,
    phase: task.phase,
    reasonCode: task.reasonCode,
    targetType: task.targetType,
    targetId: task.targetId,
    ownerId: text(task.ownerId),
    missingIds: [...arr(task.missingIds)],
    memberIds: [...arr(task.memberIds)],
    evidenceRole: text(task.evidenceRole),
    canonicalPath: text(task.canonicalPath),
    deepLink: task.deepLink,
  }));
  const stats = deepFreeze({
    tasks: publicTasks.length,
    resolveReferences: publicTasks.filter((task) => task.phase === "resolve_references").length,
    verifyProvenance: publicTasks.filter((task) => task.phase === "verify_provenance").length,
    strengthenCoverage: publicTasks.filter((task) => task.phase === "strengthen_coverage").length,
    affectedTargets: new Set(publicTasks.flatMap((task) => [task.targetId, task.ownerId]).filter(Boolean)).size,
  });

  function manifest({ appVersion = "", language = "" } = {}) {
    return deepFreeze({
      format: "jarbou3i-evidence-review-plan-v1",
      derived: true,
      canonical_transport: false,
      completion_validates_conclusions: false,
      app_version: text(appVersion),
      analysis_lens: lens,
      analysis_language: text(language || analysis?.language),
      analysis_id: text(analysis?.analysis_id),
      schema_version: text(analysis?.schema_version),
      stats,
      phases: ["resolve_references", "verify_provenance", "strengthen_coverage"],
      tasks: publicTasks.map((task) => ({ ...task })),
      traceability_stats: traceability?.stats ? { ...traceability.stats } : {},
    });
  }

  return Object.freeze({
    lens,
    tasks: Object.freeze(publicTasks),
    stats,
    forPhase(phase) { return Object.freeze(publicTasks.filter((task) => task.phase === text(phase))); },
    task(id) { return publicTasks.find((task) => task.id === text(id)) || null; },
    manifest,
  });
}
