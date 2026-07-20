/* Jarbou3i Model — shared, read-only results inspection index */

const arr = (value) => (Array.isArray(value) ? value : []);
const record = (value) =>
  value && typeof value === "object" && !Array.isArray(value) ? value : {};
const text = (value) =>
  value === null || value === undefined ? "" : String(value).trim();

const LENSES = Object.freeze(["strategic", "biopolitical"]);

const TYPE_LABELS = Object.freeze({
  en: Object.freeze({
    interest: "Interest", actor: "Actor", tool: "Tool", narrative: "Narrative",
    result: "Result", feedback: "Feedback", contradiction: "Contradiction",
    scenario: "Scenario", evidence: "Evidence", assumption: "Assumption",
  }),
  ar: Object.freeze({
    interest: "مصلحة", actor: "فاعل", tool: "أداة", narrative: "سردية",
    result: "نتيجة", feedback: "تغذية راجعة", contradiction: "تناقض",
    scenario: "سيناريو", evidence: "دليل", assumption: "افتراض",
  }),
  fr: Object.freeze({
    interest: "Intérêt", actor: "Acteur", tool: "Outil", narrative: "Narratif",
    result: "Résultat", feedback: "Rétroaction", contradiction: "Contradiction",
    scenario: "Scénario", evidence: "Preuve", assumption: "Hypothèse",
  }),
});

const STRATEGIC_DESCRIPTORS = Object.freeze([
  ["interest", "interests", "/interests", (analysis) => analysis.interests, ["name", "title", "description"]],
  ["actor", "actors", "/actors", (analysis) => analysis.actors, ["name", "title", "role"]],
  ["tool", "tools", "/tools", (analysis) => analysis.tools, ["name", "title", "description"]],
  ["narrative", "narrative", "/narrative", (analysis) => analysis.narrative, ["name", "title", "frame", "description"]],
  ["result", "results", "/results", (analysis) => analysis.results, ["name", "title", "description"]],
  ["feedback", "feedback", "/feedback", (analysis) => analysis.feedback, ["name", "title", "description"]],
  ["contradiction", "contradictions", "/contradictions/items", (analysis) => analysis.contradictions?.items, ["rhetoric", "name", "title", "interpretation"]],
  ["scenario", "scenarios", "/scenarios/items", (analysis) => analysis.scenarios?.items, ["name", "title", "rationale"]],
  ["evidence", "evidence", "/evidence/items", (analysis) => analysis.evidence?.items, ["source_title", "claim", "name"]],
  ["assumption", "evidence", "/assumptions/items", (analysis) => analysis.assumptions?.items, ["assumption", "name", "title", "description"]],
]);

function deepFreeze(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  Object.values(value).forEach(deepFreeze);
  return Object.freeze(value);
}

function firstValue(source, fields) {
  for (const field of fields) {
    const value = source?.[field];
    if (Array.isArray(value)) {
      const first = value.map(text).find(Boolean);
      if (first) return first;
    } else if (text(value)) return text(value);
  }
  return "";
}

function strategicGraph(analysis, lang) {
  const nodes = [];
  const byId = new Map();
  const duplicates = [];
  for (const [type, pillar, basePath, getter, labelFields] of STRATEGIC_DESCRIPTORS) {
    arr(getter(analysis)).forEach((source, index) => {
      const id = text(source?.id);
      if (!id) return;
      if (byId.has(id)) {
        duplicates.push({ id, path: `${basePath}/${index}` });
        return;
      }
      const typeLabel = TYPE_LABELS[lang]?.[type] || TYPE_LABELS.en[type] || type;
      const label = firstValue(source, labelFields) || `${typeLabel} ${id}`;
      const subtitle = firstValue(
        source,
        labelFields.filter((field) => text(source?.[field]) !== label),
      );
      const node = deepFreeze({
        id,
        type,
        pillar,
        label,
        subtitle,
        confidence: text(source?.confidence),
        path: `${basePath}/${index}`,
      });
      nodes.push(node);
      byId.set(id, node);
    });
  }
  const unresolved = [];
  const edges = arr(analysis.links).map((link, index) => {
    const edge = deepFreeze({
      id: `explicit-${index}`,
      source: text(link?.from),
      target: text(link?.to),
      family: "explicit",
      relation: text(link?.relation) || "related_to",
      mechanism: text(link?.mechanism),
      confidence: text(link?.confidence || link?.strength),
      path: `/links/${index}`,
      provenance: "explicit",
    });
    if (!byId.has(edge.source) || !byId.has(edge.target)) unresolved.push(edge);
    return edge;
  });
  return { nodes, edges, byId, diagnostics: { duplicates, unresolved } };
}

function copyGraph(graph) {
  const nodes = arr(graph?.nodes).map((node) => deepFreeze({
    id: text(node.id), type: text(node.type), pillar: text(node.pillar),
    label: text(node.label), subtitle: text(node.subtitle),
    confidence: text(node.confidence), path: text(node.path),
  }));
  const byId = new Map(nodes.map((node) => [node.id, node]));
  const edges = arr(graph?.edges).map((edge) => deepFreeze({
    id: text(edge.id), source: text(edge.source), target: text(edge.target),
    family: text(edge.family), relation: text(edge.relation) || "related_to",
    mechanism: text(edge.mechanism), confidence: text(edge.confidence),
    path: text(edge.path), provenance: text(edge.provenance),
  }));
  return {
    nodes,
    edges,
    byId,
    diagnostics: {
      duplicates: arr(graph?.diagnostics?.duplicates).map((item) => ({ ...item })),
      unresolved: arr(graph?.diagnostics?.unresolved).map((item) => ({ ...item })),
      ownerlessReferences: arr(graph?.diagnostics?.ownerlessReferences).map((item) => ({ ...item })),
    },
  };
}

function pointerToken(value) {
  return String(value).replaceAll("~", "~0").replaceAll("/", "~1");
}

function collectOccurrences(analysis, nodes) {
  const ids = nodes.map((node) => node.id).sort((a, b) => b.length - a.length);
  const byId = new Map(ids.map((id) => [id, []]));
  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  if (!ids.length) return byId;
  const pattern = new RegExp(
    `(^|[^A-Za-z0-9_-])(${ids.map((id) => id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})(?=$|[^A-Za-z0-9_-])`,
    "g",
  );
  const nodePaths = [...nodes].sort((a, b) => b.path.length - a.path.length);
  const ownerFor = (path, id) =>
    nodePaths.find((node) => path === node.path || path.startsWith(`${node.path}/`))?.id || id;
  const visit = (value, path = "") => {
    if (Array.isArray(value)) {
      value.forEach((item, index) => visit(item, `${path}/${index}`));
      return;
    }
    if (value && typeof value === "object") {
      Object.entries(value).forEach(([key, item]) => visit(item, `${path}/${pointerToken(key)}`));
      return;
    }
    if (typeof value !== "string") return;
    pattern.lastIndex = 0;
    let match;
    while ((match = pattern.exec(value))) {
      const id = match[2];
      const node = nodeById.get(id);
      const kind = path === `${node?.path}/id`
        ? "canonical"
        : path.startsWith("/links/")
          ? "relationship"
          : "reference";
      byId.get(id)?.push(deepFreeze({ path: path || "/", ownerId: ownerFor(path, id), kind }));
      if (pattern.lastIndex === match.index) pattern.lastIndex += 1;
    }
  };
  visit(analysis);
  return byId;
}

function resolvePointer(source, pointer) {
  if (!pointer || pointer === "/") return source;
  return pointer
    .slice(1)
    .split("/")
    .map((token) => token.replaceAll("~1", "/").replaceAll("~0", "~"))
    .reduce((value, token) => value?.[token], source);
}

function stringList(...values) {
  return [...new Set(values.flatMap((value) => arr(value)).map(text).filter(Boolean))];
}

function buildInspection(node, analysis, provenanceRecord, occurrences, diagnostics) {
  const source = record(resolvePointer(analysis, node.path));
  const supportingIds = stringList(
    source.supporting_evidence_ids,
    source.evidence_ids,
    source.evidence_of_benefit,
    source.supporting_evidence,
  );
  const counterIds = stringList(source.counter_evidence_ids);
  const counterEvidence = Array.isArray(source.counter_evidence)
    ? source.counter_evidence.map(text).filter(Boolean)
    : text(source.counter_evidence)
      ? [text(source.counter_evidence)]
      : [];
  const provenance = {
    sourceTitle: text(source.source_title),
    sourceUrl: text(source.source_url),
    sourceLocator: text(source.source_locator),
    sourceDate: text(source.source_date),
    sourceType: text(source.source_type),
    sourceTier: text(source.source_tier),
    sourceNote: text(source.source_note),
    verificationStatus: text(source.verification_status),
    verifiedBy: text(source.verified_by),
    verificationDate: text(source.verification_date),
    claimSourceFit: text(source.claim_source_fit),
    sourceStatus: text(provenanceRecord?.sourceStatus),
    claimStatus: text(provenanceRecord?.claimStatus),
    reviewStatus: text(provenanceRecord?.reviewStatus),
    approvalEligible: provenanceRecord?.approvalEligible === true,
  };
  const audit = {
    schemaVersion: text(analysis.schema_version),
    contractStatus: text(analysis.contract_status),
    modelStatus: text(analysis.model_status),
    analysisId: text(analysis.analysis_id),
    uncertainty: text(source.uncertainty),
    limitations: Array.isArray(source.limitations)
      ? source.limitations.map(text).filter(Boolean)
      : text(source.limitations) ? [text(source.limitations)] : [],
    evidenceStrength: text(source.evidence_strength),
    unresolvedLinks: arr(diagnostics?.unresolved).length,
  };
  return deepFreeze({
    canonicalId: node.id,
    label: node.label,
    type: node.type,
    pillar: node.pillar,
    path: node.path,
    confidence: node.confidence,
    summary: node.subtitle,
    provenance,
    evidence: { supportingIds, counterIds, counterEvidence },
    audit,
    occurrences: arr(occurrences),
  });
}

export function createResultsInspectionIndex({
  lens,
  analysis,
  graph = null,
  provenance = null,
  lang = "en",
} = {}) {
  if (!LENSES.includes(lens)) throw new TypeError(`Unsupported inspection lens: ${lens}`);
  const canonical = record(analysis);
  const locale = ["en", "ar", "fr"].includes(lang) ? lang : "en";
  const base = lens === "biopolitical" ? copyGraph(graph) : strategicGraph(canonical, locale);
  const incoming = new Map(base.nodes.map((node) => [node.id, []]));
  const outgoing = new Map(base.nodes.map((node) => [node.id, []]));
  base.edges.forEach((edge) => {
    incoming.get(edge.target)?.push(edge);
    outgoing.get(edge.source)?.push(edge);
  });
  const occurrences = collectOccurrences(canonical, base.nodes);
  const provenanceById = new Map(arr(provenance?.records).map((item) => [text(item.id), item]));
  const inspectionById = new Map(base.nodes.map((node) => [
    node.id,
    buildInspection(node, canonical, provenanceById.get(node.id), occurrences.get(node.id), base.diagnostics),
  ]));
  const typeLabel = (type) =>
    graph?.typeLabel?.(type) || TYPE_LABELS[locale]?.[type] || TYPE_LABELS.en[type] || type;
  return Object.freeze({
    lens,
    nodes: Object.freeze(base.nodes),
    edges: Object.freeze(base.edges),
    diagnostics: deepFreeze({ ...base.diagnostics }),
    occurrenceCount: [...occurrences.values()].reduce((sum, items) => sum + items.length, 0),
    resolve(id) { return base.byId.get(text(id)) || null; },
    incoming(id) { return Object.freeze([...(incoming.get(text(id)) || [])]); },
    outgoing(id) { return Object.freeze([...(outgoing.get(text(id)) || [])]); },
    typeLabel,
    inspect(id) { return inspectionById.get(text(id)) || null; },
  });
}

export const RESULTS_INSPECTION_LENSES = LENSES;
