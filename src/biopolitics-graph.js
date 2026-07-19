/* Jarbou3i Model — canonical biopolitical relationship index */
(function attachBiopoliticalGraph(root) {
  "use strict";

  const arr = (value) => (Array.isArray(value) ? value : []);
  const object = (value) =>
    value && typeof value === "object" && !Array.isArray(value) ? value : {};
  const text = (value) =>
    value === null || value === undefined ? "" : String(value).trim();
  const SPATIAL_PILLARS = Object.freeze([
    "question_context", "human_functions", "actors_institutions",
    "mechanisms_infrastructure", "meaning_classification", "intervention_capture",
    "distribution_effects", "evidence_explanations", "agency_alternatives",
  ]);

  const TYPE_LABELS = {
    en: {
      human_function: "Human function",
      actor: "Actor",
      population: "Affected population",
      institution: "Institution",
      asymmetry: "Power asymmetry",
      instrument: "Instrument",
      infrastructure: "Infrastructure",
      political_economy: "Political economy",
      norm: "Norm",
      regime_of_truth: "Regime of truth",
      classification: "Classification",
      looping_effect: "Looping effect",
      intervention: "Intervention",
      care_control_tension: "Care/control tension",
      future_loop: "Future feedback loop",
      distribution: "Distributional effect",
      necropolitical_dimension: "Necropolitical dimension",
      explanation: "Competing explanation",
      evidence: "Evidence",
      assumption: "Assumption",
      resistance: "Resistance and agency",
      alternative: "Alternative",
      international_comparison: "International comparison",
      theoretical_comparison: "Theoretical comparison",
    },
    ar: {
      human_function: "وظيفة إنسانية", actor: "فاعل", population: "فئة متأثرة",
      institution: "مؤسسة", asymmetry: "لا تناظر القوة", instrument: "أداة",
      infrastructure: "بنية تحتية", political_economy: "اقتصاد سياسي", norm: "معيار",
      regime_of_truth: "نظام حقيقة", classification: "تصنيف", looping_effect: "أثر حلقي",
      intervention: "تدخل", care_control_tension: "توتر الرعاية والسيطرة",
      future_loop: "حلقة مستقبلية", distribution: "أثر توزيعي",
      necropolitical_dimension: "بُعد نكروسياسي", explanation: "تفسير متنافس",
      evidence: "دليل", assumption: "افتراض", resistance: "مقاومة وفاعلية",
      alternative: "بديل", international_comparison: "مقارنة دولية",
      theoretical_comparison: "مقارنة نظرية",
    },
    fr: {
      human_function: "Fonction humaine", actor: "Acteur", population: "Population affectée",
      institution: "Institution", asymmetry: "Asymétrie de pouvoir", instrument: "Instrument",
      infrastructure: "Infrastructure", political_economy: "Économie politique", norm: "Norme",
      regime_of_truth: "Régime de vérité", classification: "Classification",
      looping_effect: "Effet de boucle", intervention: "Intervention",
      care_control_tension: "Tension soin/contrôle", future_loop: "Boucle future",
      distribution: "Effet distributif", necropolitical_dimension: "Dimension nécropolitique",
      explanation: "Explication concurrente", evidence: "Preuve", assumption: "Hypothèse",
      resistance: "Résistance et agentivité", alternative: "Alternative",
      international_comparison: "Comparaison internationale",
      theoretical_comparison: "Comparaison théorique",
    },
  };

  const DESCRIPTORS = [
    ["human_function", "human_functions", "/human_functions", (a) => a.human_functions, ["name", "scientific_definition"]],
    ["actor", "actors_institutions", "/power_map/actors", (a) => a.power_map?.actors, ["name", "formal_mandate"]],
    ["population", "actors_institutions", "/power_map/affected_populations", (a) => a.power_map?.affected_populations, ["name", "classification"]],
    ["institution", "actors_institutions", "/power_map/institutions", (a) => a.power_map?.institutions, ["name", "mandate"]],
    ["asymmetry", "actors_institutions", "/power_map/power_asymmetries", (a) => a.power_map?.power_asymmetries, ["effect", "resource"]],
    ["instrument", "mechanisms_infrastructure", "/mechanisms/instruments", (a) => a.mechanisms?.instruments, ["name", "mechanism"]],
    ["infrastructure", "mechanisms_infrastructure", "/mechanisms/infrastructures", (a) => a.mechanisms?.infrastructures, ["name", "dependency_created"]],
    ["political_economy", "mechanisms_infrastructure", "/mechanisms/political_economy", (a) => a.mechanisms?.political_economy, ["dependency_model", "ownership"]],
    ["norm", "meaning_classification", "/meaning_systems/norms", (a) => a.meaning_systems?.norms, ["name", "definition"]],
    ["regime_of_truth", "meaning_classification", "/meaning_systems/regimes_of_truth", (a) => a.meaning_systems?.regimes_of_truth, ["claim", "validation_procedure"]],
    ["classification", "meaning_classification", "/meaning_systems/classifications", (a) => a.meaning_systems?.classifications, ["category", "definition"]],
    ["looping_effect", "meaning_classification", "/meaning_systems/looping_effects", (a) => a.meaning_systems?.looping_effects, ["institutional_response", "behavioral_adaptation"]],
    ["intervention", "intervention_capture", "/intervention_assessment/interventions", (a) => a.intervention_assessment?.interventions, ["name", "stated_benefit"]],
    ["care_control_tension", "intervention_capture", "/intervention_assessment/care_control_tensions", (a) => a.intervention_assessment?.care_control_tensions, ["care_claim", "interpretation"]],
    ["future_loop", "distribution_effects", "/scale_time/future_feedback_loops", (a) => a.scale_time?.future_feedback_loops, ["name", "rationale"]],
    ["distribution", "distribution_effects", "/distribution/items", (a) => a.distribution?.items, ["name", "burdens", "population_id"]],
    ["necropolitical_dimension", "distribution_effects", "/distribution/necropolitical_dimensions", (a) => a.distribution?.necropolitical_dimensions, ["dimension", "mechanism", "population_id"]],
    ["explanation", "evidence_explanations", "/competing_explanations", (a) => a.competing_explanations, ["claim", "mechanism"]],
    ["evidence", "evidence_explanations", "/evidence/items", (a) => a.evidence?.items, ["claim", "source_title"]],
    ["assumption", "evidence_explanations", "/assumptions/items", (a) => a.assumptions?.items, ["assumption", "disproving_test"]],
    ["resistance", "agency_alternatives", "/resistance_agency/items", (a) => a.resistance_agency?.items, ["actor_or_population", "form", "mechanism"]],
    ["alternative", "agency_alternatives", "/alternatives/items", (a) => a.alternatives?.items, ["proposal", "mechanism"]],
    ["international_comparison", "question_context", "/international_comparison", (a) => a.international_comparison, ["jurisdiction_or_context", "comparison_basis"]],
    ["theoretical_comparison", "meaning_classification", "/theoretical_comparison", (a) => a.theoretical_comparison, ["tradition", "contribution"]],
  ];

  function firstValue(record, fields) {
    for (const field of fields) {
      const value = record?.[field];
      if (Array.isArray(value) && value.length) return text(value[0]);
      if (text(value)) return text(value);
    }
    return "";
  }

  function build(analysis, lang = "en") {
    const a = object(analysis);
    const locale = TYPE_LABELS[lang] ? lang : "en";
    const nodes = [];
    const byId = new Map();
    const diagnostics = { duplicates: [], unresolved: [], ownerlessReferences: [] };

    for (const [type, pillar, basePath, getter, labelFields] of DESCRIPTORS) {
      arr(getter(a)).forEach((record, index) => {
        const id = text(record?.id);
        if (!id) return;
        if (byId.has(id)) {
          diagnostics.duplicates.push({ id, path: `${basePath}/${index}` });
          return;
        }
        const label = firstValue(record, labelFields) || `${TYPE_LABELS[locale][type] || type} ${id}`;
        const subtitle = firstValue(record, labelFields.filter((field) => text(record?.[field]) !== label));
        const node = Object.freeze({
          id, type, pillar, label, subtitle,
          confidence: text(record?.confidence),
          path: `${basePath}/${index}`,
          record,
        });
        nodes.push(node);
        byId.set(id, node);
      });
    }

    const references = [];
    const addReference = (sourceId, targetId, relation, path) => {
      const target = text(targetId);
      if (!target) return;
      const entry = { source: text(sourceId) || null, target, relation, path };
      references.push(Object.freeze(entry));
      if (!byId.has(target)) diagnostics.unresolved.push(entry);
      if (!entry.source) diagnostics.ownerlessReferences.push(entry);
    };
    const eachRefs = (items, base, fields, source = (item) => item.id) =>
      arr(items).forEach((item, index) => fields.forEach(([field, relation]) =>
        arr(item?.[field]).forEach((target, refIndex) =>
          addReference(source(item), target, relation, `${base}/${index}/${field}/${refIndex}`),
        ),
      ));
    const oneRef = (items, base, field, relation) => arr(items).forEach((item, index) =>
      addReference(item?.id, item?.[field], relation, `${base}/${index}/${field}`),
    );

    eachRefs(a.power_map?.power_asymmetries, "/power_map/power_asymmetries", [["between", "between"]]);
    eachRefs(a.mechanisms?.power_modes, "/mechanisms/power_modes", [["evidence_ids", "supported_by"]], () => null);
    oneRef(a.meaning_systems?.looping_effects, "/meaning_systems/looping_effects", "classification_id", "responds_to_classification");
    eachRefs(a.intervention_assessment?.interventions, "/intervention_assessment/interventions", [
      ["target_function_ids", "targets"], ["actor_ids", "governed_by"],
      ["instrument_ids", "uses"], ["evidence_of_benefit", "supported_by"],
    ]);
    eachRefs(a.intervention_assessment?.capture_assessment?.criteria, "/intervention_assessment/capture_assessment/criteria", [["evidence_ids", "supported_by"]], () => null);
    eachRefs(a.capture_levels, "/capture_levels", [["evidence_ids", "supported_by"]], () => null);
    eachRefs(a.international_comparison, "/international_comparison", [["evidence_ids", "supported_by"]]);
    eachRefs(a.theoretical_comparison, "/theoretical_comparison", [["evidence_ids", "supported_by"]]);
    oneRef(a.distribution?.items, "/distribution/items", "population_id", "affects");
    eachRefs(a.distribution?.inequality_dimensions, "/distribution/inequality_dimensions", [["evidence_ids", "supported_by"]], () => null);
    oneRef(a.distribution?.necropolitical_dimensions, "/distribution/necropolitical_dimensions", "population_id", "affects");
    eachRefs(a.competing_explanations, "/competing_explanations", [
      ["supporting_evidence_ids", "supported_by"], ["counter_evidence_ids", "countered_by"],
    ]);

    const explicitEdges = arr(a.links).map((link, index) => Object.freeze({
      id: `explicit-${index}`,
      source: text(link?.from), target: text(link?.to), family: "explicit",
      relation: text(link?.relation) || "related_to",
      mechanism: text(link?.mechanism), confidence: text(link?.confidence),
      path: `/links/${index}`, provenance: "explicit",
    }));
    explicitEdges.forEach((edge) => {
      if (!byId.has(edge.source) || !byId.has(edge.target)) diagnostics.unresolved.push(edge);
    });
    const derivedEdges = references
      .filter((reference) => reference.source && byId.has(reference.source) && byId.has(reference.target))
      .map((reference, index) => Object.freeze({
        id: `derived-${index}`,
        ...reference,
        family: ["supported_by", "countered_by"].includes(reference.relation)
          ? "evidence"
          : "structural",
        mechanism: "", confidence: "", provenance: "derived",
      }));
    const edges = [...explicitEdges, ...derivedEdges];
    const incoming = new Map(nodes.map((node) => [node.id, []]));
    const outgoing = new Map(nodes.map((node) => [node.id, []]));
    edges.forEach((edge) => {
      incoming.get(edge.target)?.push(edge);
      outgoing.get(edge.source)?.push(edge);
    });

    return Object.freeze({
      nodes: Object.freeze(nodes), edges: Object.freeze(edges), references: Object.freeze(references), diagnostics,
      resolve(id) { return byId.get(text(id)) || null; },
      incoming(id) { return Object.freeze([...(incoming.get(text(id)) || [])]); },
      outgoing(id) { return Object.freeze([...(outgoing.get(text(id)) || [])]); },
      typeLabel(type) { return TYPE_LABELS[locale][type] || TYPE_LABELS.en[type] || type; },
    });
  }

  function replaceReferences(value, graph, formatter) {
    const source = value === null || value === undefined ? "" : String(value);
    if (!graph?.nodes?.length) return formatter(source, null);
    const ids = graph.nodes.map((node) => node.id).sort((a, b) => b.length - a.length);
    const escaped = ids.map((id) => id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    const pattern = new RegExp(`(^|[^A-Za-z0-9_-])(${escaped.join("|")})(?=$|[^A-Za-z0-9_-])`, "g");
    let cursor = 0;
    let output = "";
    let match;
    while ((match = pattern.exec(source))) {
      const idStart = match.index + match[1].length;
      output += formatter(source.slice(cursor, idStart), null);
      output += formatter(match[2], graph.resolve(match[2]));
      cursor = idStart + match[2].length;
      if (pattern.lastIndex === match.index) pattern.lastIndex += 1;
    }
    return output + formatter(source.slice(cursor), null);
  }

  function plainText(value, graph) {
    return replaceReferences(value, graph, (chunk, node) =>
      node ? `${node.label} [${node.id}]` : chunk,
    );
  }

  function temporalProjection(analysis) {
    const a = object(analysis);
    const scale = object(a.scale_time);
    const evidence = arr(object(a.evidence).items)
      .filter((item) => text(item?.source_date))
      .map((item, index) => Object.freeze({
        id: text(item.id), label: text(item.source_title) || text(item.claim),
        detail: text(item.source_date), confidence: text(item.confidence),
        path: `/evidence/items/${index}/source_date`, kind: "dated_evidence",
      }));
    const textItems = (items, path, kind) => arr(items).map((value, index) => Object.freeze({
      id: "", label: text(value), detail: "", confidence: "", path: `${path}/${index}`, kind,
    }));
    const future = arr(scale.future_feedback_loops).map((item, index) => Object.freeze({
      id: text(item?.id), label: text(item?.name) || text(item?.rationale),
      detail: text(item?.timeframe), confidence: text(item?.confidence),
      path: `/scale_time/future_feedback_loops/${index}`, kind: "future_feedback",
    }));
    return Object.freeze([
      Object.freeze({ key: "historical", items: Object.freeze(textItems(scale.historical_continuities, "/scale_time/historical_continuities", "historical_continuity")) }),
      Object.freeze({ key: "dated", items: Object.freeze(evidence) }),
      Object.freeze({ key: "immediate", items: Object.freeze(textItems(scale.immediate_effects, "/scale_time/immediate_effects", "immediate_effect")) }),
      Object.freeze({ key: "medium", items: Object.freeze([
        ...textItems(scale.medium_term_adaptations, "/scale_time/medium_term_adaptations", "medium_adaptation"),
        ...textItems(scale.path_dependencies, "/scale_time/path_dependencies", "path_dependency"),
      ]) }),
      Object.freeze({ key: "future", items: Object.freeze([
        ...future,
        ...textItems(scale.intergenerational_effects, "/scale_time/intergenerational_effects", "intergenerational_effect"),
      ]) }),
    ]);
  }

  function comparativeProjection(analysis) {
    return Object.freeze(arr(object(analysis).international_comparison).map((item, index) => Object.freeze({
      id: text(item?.id), context: text(item?.jurisdiction_or_context),
      basis: text(item?.comparison_basis), similarities: Object.freeze([...arr(item?.similarities)]),
      differences: Object.freeze([...arr(item?.differences)]),
      transferLimits: Object.freeze([...arr(item?.transfer_limits)]),
      evidenceIds: Object.freeze([...arr(item?.evidence_ids)]), confidence: text(item?.confidence),
      path: `/international_comparison/${index}`,
    })));
  }

  function spatialProjection(graph, nodeIds) {
    const requested = nodeIds === undefined
      ? new Set(graph?.nodes?.map((node) => node.id) || [])
      : new Set(arr(nodeIds).map(text));
    const positions = new Map();
    const clusters = [];
    SPATIAL_PILLARS.forEach((pillar, pillarIndex) => {
      const members = arr(graph?.nodes)
        .filter((node) => node.pillar === pillar)
        .sort((a, b) => a.id.localeCompare(b.id));
      if (!members.length) return;
      const columns = Math.min(3, Math.max(1, Math.ceil(Math.sqrt(members.length))));
      const rows = Math.ceil(members.length / columns);
      const clusterColumn = pillarIndex % 3;
      const clusterRow = Math.floor(pillarIndex / 3);
      const clusterX = (clusterColumn - 1) * 480;
      const clusterY = (clusterRow - 1) * 280;
      const clusterZ = (clusterColumn - 1) * 110 + (clusterRow - 1) * 35;
      clusters.push(Object.freeze({
        pillar, x: clusterX, y: clusterY - rows * 48 - 48, z: clusterZ,
        count: members.filter((node) => requested.has(node.id)).length,
      }));
      members.forEach((node, index) => {
        const column = index % columns;
        const row = Math.floor(index / columns);
        positions.set(node.id, Object.freeze({
          id: node.id, pillar,
          x: clusterX + Math.round((column - (columns - 1) / 2) * 176),
          y: clusterY + Math.round((row - (rows - 1) / 2) * 92),
          z: clusterZ + ((index % 3) - 1) * 24,
        }));
      });
    });
    const nodes = Object.freeze(
      arr(graph?.nodes)
        .filter((node) => requested.has(node.id) && positions.has(node.id))
        .map((node) => positions.get(node.id)),
    );
    const visible = new Set(nodes.map((node) => node.id));
    const edges = Object.freeze(
      arr(graph?.edges)
        .filter((edge) => visible.has(edge.source) && visible.has(edge.target))
        .map((edge) => Object.freeze({
          id: edge.id, source: edge.source, target: edge.target, family: edge.family,
          from: positions.get(edge.source), to: positions.get(edge.target),
        })),
    );
    return Object.freeze({
      nodes,
      edges,
      clusters: Object.freeze(clusters.filter((cluster) => cluster.count > 0)),
    });
  }

  root.Jarbou3iBiopoliticsGraph = Object.freeze({
    build, plainText, replaceReferences, temporalProjection, comparativeProjection, spatialProjection,
  });
})(typeof window !== "undefined" ? window : globalThis);
