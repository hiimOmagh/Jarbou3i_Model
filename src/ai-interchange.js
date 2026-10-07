/* Jarbou3i Model — AI Interchange Contract v1 and deterministic compiler */
(function attachAiInterchange(root) {
  "use strict";

  const CONTRACT = "jarbou3i-ai-interchange/1";
  const LENS = "biopolitical";
  const GENERATED_DRAFT_CONTRACT = "biopolitical-generated-draft-v1";
  const GENERATED_DRAFT_SCHEMA_VERSION = "1.0.0";
  const CANONICAL_CONTRACT = "biopolitical-training-map-v2";
  const CANONICAL_SCHEMA_VERSION = "2.1.0";
  const CANONICAL_SOURCE =
    `${CANONICAL_CONTRACT}@${CANONICAL_SCHEMA_VERSION}`;
  const LANGUAGES = new Set(["ar", "en", "fr"]);
  const MODES = new Set(["simple", "focused", "expert", "research"]);
  const isObject = (value) =>
    Boolean(value) && typeof value === "object" && !Array.isArray(value);
  const object = (value) => (isObject(value) ? value : {});
  const array = (value) => (Array.isArray(value) ? value : []);
  const text = (value) =>
    value === null || value === undefined ? "" : String(value);
  const clone = (value) => JSON.parse(JSON.stringify(value));

  const COLLECTIONS = Object.freeze([
    ["international_comparison", "CMP"],
    ["theoretical_comparison", "THEORY"],
    ["human_functions", "HF"],
    ["power_map.actors", "ACT"],
    ["power_map.affected_populations", "POP"],
    ["power_map.institutions", "INST"],
    ["power_map.power_asymmetries", "ASYM"],
    ["mechanisms.instruments", "INS"],
    ["mechanisms.infrastructures", "INF"],
    ["mechanisms.political_economy", "PE"],
    ["meaning_systems.norms", "NORM"],
    ["meaning_systems.regimes_of_truth", "RT"],
    ["meaning_systems.classifications", "CLASS"],
    ["meaning_systems.looping_effects", "LOOP"],
    ["intervention_assessment.interventions", "IV"],
    ["intervention_assessment.care_control_tensions", "TENSION"],
    ["scale_time.future_feedback_loops", "FUT"],
    ["distribution.items", "DIST"],
    ["distribution.necropolitical_dimensions", "NEC"],
    ["evidence.items", "E"],
    ["assumptions.items", "AS"],
    ["resistance_agency.items", "RES"],
    ["alternatives.items", "ALT"],
  ]);

  const TOP_LEVEL_KEYS = new Set([
    "contract",
    "lens",
    "language",
    "mode",
    "analysis_id",
    "subject",
    "framing",
    "legal_framework",
    "international_comparison",
    "capture_levels",
    "theoretical_comparison",
    "human_functions",
    "power",
    "mechanisms",
    "meaning",
    "intervention",
    "scale_time",
    "distribution",
    "consent_exit",
    "explanations",
    "evidence",
    "assumptions",
    "resistance",
    "alternatives",
    "conclusion",
    "self_audit",
    "self_audit_notes",
    "links",
  ]);

  function atPath(value, path) {
    return path.split(".").reduce((current, key) => current?.[key], value);
  }

  function setPath(value, path, next) {
    const keys = path.split(".");
    let current = value;
    keys.slice(0, -1).forEach((key) => {
      if (!isObject(current[key])) current[key] = {};
      current = current[key];
    });
    current[keys.at(-1)] = next;
  }

  function slug(value) {
    const normalized = text(value)
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 64);
    return normalized || "generated-analysis";
  }

  function quarantine(path, value, audit) {
    audit.quarantine.push(
      Object.freeze({
        code: "UNKNOWN_PROPERTY_QUARANTINED",
        path,
        value: clone(value),
        action: "preserved_in_import_audit",
        severity: "information",
      }),
    );
  }

  // An extra closing brace can leave a section member at the top level
  // ("care_control_tensions" outside "intervention"). A top-level key that names
  // a member of exactly one template section is put back when that section does
  // not already have it; anything else is quarantined as before.
  let memberSections;
  function sectionOf(key) {
    if (!memberSections) {
      memberSections = new Map();
      let template = {};
      try {
        template = JSON.parse(buildTemplate("en", "research"));
      } catch {}
      for (const [section, value] of Object.entries(template)) {
        if (!isObject(value)) continue;
        for (const member of Object.keys(value)) {
          memberSections.set(member, memberSections.has(member) ? null : section);
        }
      }
    }
    return memberSections.get(key) || null;
  }

  function restoreMisplacedMembers(source, audit) {
    const out = { ...source };
    for (const [key, value] of Object.entries(source)) {
      const section = TOP_LEVEL_KEYS.has(key) ? null : sectionOf(key);
      if (
        !section ||
        (out[section] !== undefined && !isObject(out[section])) ||
        out[section]?.[key] !== undefined
      ) {
        continue;
      }
      out[section] = { ...object(out[section]), [key]: value };
      delete out[key];
      audit.transformations.push(
        Object.freeze({
          code: "MISPLACED_MEMBER_RESTORED",
          path: `/${section}/${key}`,
          from: `/${key}`,
          count: 1,
        }),
      );
    }
    return out;
  }

  function knownObject(source, keys, path, audit) {
    const input = object(source);
    const out = {};
    for (const [key, value] of Object.entries(input)) {
      if (keys.has(key)) out[key] = value;
      else quarantine(`${path}/${key}`, value, audit);
    }
    return out;
  }

  function normalizeRecord(record) {
    // A list entry written as plain text keeps it, for review, rather than
    // becoming an empty record.
    if (typeof record === "string") return { text: record };
    const item = clone(object(record));
    if (item.ref !== undefined && item.id === undefined) item.id = item.ref;
    delete item.ref;
    if (item.evidence_refs !== undefined && item.evidence_ids === undefined) {
      item.evidence_ids = item.evidence_refs;
    }
    delete item.evidence_refs;
    if (
      item.supporting_evidence_refs !== undefined &&
      item.supporting_evidence_ids === undefined
    ) {
      item.supporting_evidence_ids = item.supporting_evidence_refs;
    }
    delete item.supporting_evidence_refs;
    if (
      item.counter_evidence_refs !== undefined &&
      item.counter_evidence_ids === undefined
    ) {
      item.counter_evidence_ids = item.counter_evidence_refs;
    }
    delete item.counter_evidence_refs;
    return item;
  }

  function normalizeCollection(value) {
    // The canonical {items: [...]} form, written where a list is asked for.
    if (isObject(value) && Array.isArray(value.items) && Object.keys(value).length === 1) {
      return normalizeCollection(value.items);
    }
    if (Array.isArray(value)) return value.map(normalizeRecord);
    if (!isObject(value)) return [];
    return Object.entries(value).map(([id, item]) => ({
      id: object(item).id || id,
      ...normalizeRecord(item),
    }));
  }

  // Canonical-style arrays ([{level:"body",…}]) are keyed by the entry value that
  // names a set member; entries that name none are quarantined, never dropped.
  function keyedSet(value, expected, path, audit) {
    if (!Array.isArray(value)) return object(value);
    const keyed = {};
    value.forEach((item, index) => {
      const key = isObject(item)
        ? Object.values(item).find((field) => expected.includes(field))
        : undefined;
      if (key && !(key in keyed)) keyed[key] = item;
      else quarantine(`${path}/${index}`, item, audit);
    });
    audit.transformations.push(
      Object.freeze({ code: "ARRAY_SET_TO_KEYED", path, count: Object.keys(keyed).length }),
    );
    return keyed;
  }

  function fixedMap(value, expected, mapper, path, audit) {
    const source = keyedSet(value, expected, path, audit);
    for (const [key, item] of Object.entries(source)) {
      if (!expected.includes(key)) quarantine(`${path}/${key}`, item, audit);
    }
    audit.transformations.push(
      Object.freeze({
        code: "KEYED_SET_TO_CANONICAL_ARRAY",
        path,
        count: expected.length,
      }),
    );
    return expected.map((key, index) => mapper(key, object(source[key]), index));
  }

  function addGeneratedIds(candidate, audit) {
    for (const [path, prefix] of COLLECTIONS) {
      const records = array(atPath(candidate, path));
      // A generated ID skips the ones the answer already uses.
      const used = new Set(records.map((record) => text(object(record).id).trim()).filter(Boolean));
      records.forEach((record, index) => {
        if (!isObject(record) || text(record.id).trim()) return;
        let number = index + 1;
        while (used.has(`${prefix}${number}`)) number += 1;
        record.id = `${prefix}${number}`;
        used.add(record.id);
        audit.transformations.push(
          Object.freeze({
            code: "DETERMINISTIC_ID_GENERATED",
            path: `/${path.replaceAll(".", "/")}/${index}/id`,
            value: record.id,
            count: 1,
          }),
        );
      });
    }
  }

  function compile(raw, options = {}) {
    if (!supports(raw)) {
      const error = new Error("Unsupported AI interchange contract.");
      error.code = "AI_INTERCHANGE_UNSUPPORTED";
      throw error;
    }
    const audit = { transformations: [], quarantine: [] };
    const source = restoreMisplacedMembers(object(raw), audit);
    const top = knownObject(source, TOP_LEVEL_KEYS, "", audit);
    const BIO = root.Jarbou3iBiopolitics;
    const captureLevels = BIO?.CAPTURE_LEVELS || [
      "body",
      "mind",
      "relationship",
      "population",
      "environment",
    ];
    const captureCriteria = BIO?.CAPTURE_CRITERIA || [];
    const explanationTypes = BIO?.EXPLANATION_TYPES || [];
    const selfAuditKeys = BIO?.SELF_AUDIT_KEYS || [];
    const subjectText = typeof top.subject === "string" && top.subject.trim();
    if (subjectText) {
      audit.transformations.push(
        Object.freeze({ code: "SUBJECT_TEXT_TO_TITLE", path: "/subject", count: 1 }),
      );
    }
    const subject = subjectText ? { title: top.subject } : object(top.subject);
    const power = object(top.power);
    const mechanisms = object(top.mechanisms);
    const meaning = object(top.meaning);
    const intervention = object(top.intervention);
    const capture = object(intervention.capture);
    const distribution = object(top.distribution);
    const conclusion = object(top.conclusion);
    const language = LANGUAGES.has(top.language) ? top.language : "en";
    const mode = MODES.has(top.mode) ? top.mode : "focused";
    const generatedAt =
      text(options.generatedAt).trim() || new Date().toISOString();

    const candidate = {
      schema_version: CANONICAL_SCHEMA_VERSION,
      analysis_contract: CANONICAL_CONTRACT,
      contract_status: "canonical",
      analysis_id:
        text(top.analysis_id).trim() ||
        `${slug(subject.title || subject.research_question)}-${generatedAt.slice(0, 10)}`,
      generated_at: generatedAt,
      language,
      model_mode: mode,
      analysis_lens: LENS,
      subject: {
        title: text(subject.title),
        context: text(subject.context),
        research_question: text(
          subject.research_question ?? subject.question,
        ),
        executive_finding: text(
          subject.executive_finding ?? subject.finding,
        ),
      },
      framing: clone(object(top.framing)),
      legal_framework: clone(object(top.legal_framework)),
      international_comparison: normalizeCollection(
        top.international_comparison,
      ),
      capture_levels: fixedMap(
        top.capture_levels,
        captureLevels,
        (level, item) => ({
          level,
          status: item.status || "uncertain",
          finding: text(item.finding),
          evidence_ids: array(item.evidence_ids ?? item.evidence_refs),
        }),
        "/capture_levels",
        audit,
      ),
      theoretical_comparison: normalizeCollection(
        top.theoretical_comparison,
      ),
      human_functions: normalizeCollection(top.human_functions),
      power_map: {
        actors: normalizeCollection(power.actors),
        affected_populations: normalizeCollection(
          power.affected_populations ?? power.populations,
        ),
        institutions: normalizeCollection(power.institutions),
        power_asymmetries: normalizeCollection(
          power.power_asymmetries ?? power.asymmetries,
        ),
      },
      mechanisms: {
        instruments: normalizeCollection(mechanisms.instruments),
        infrastructures: normalizeCollection(mechanisms.infrastructures),
        political_economy: normalizeCollection(
          mechanisms.political_economy,
        ),
        power_modes: normalizeCollection(mechanisms.power_modes),
      },
      meaning_systems: {
        norms: normalizeCollection(meaning.norms),
        regimes_of_truth: normalizeCollection(
          meaning.regimes_of_truth ?? meaning.truth_regimes,
        ),
        classifications: normalizeCollection(meaning.classifications),
        looping_effects: normalizeCollection(
          meaning.looping_effects ?? meaning.loops,
        ),
      },
      intervention_assessment: {
        interventions: normalizeCollection(
          intervention.interventions ?? intervention.items,
        ),
        capture_assessment: {
          status: capture.status || "undetermined",
          criteria: fixedMap(
            capture.criteria,
            captureCriteria,
            (criterion, item) => ({
              criterion,
              status: item.status || "uncertain",
              evidence_ids: array(
                item.evidence_ids ?? item.evidence_refs,
              ),
              reason: text(item.reason),
            }),
            "/intervention/capture/criteria",
            audit,
          ),
          counter_evidence: array(capture.counter_evidence),
          legitimate_benefits: array(capture.legitimate_benefits),
          conclusion: text(capture.conclusion),
          confidence: capture.confidence || "low",
        },
        care_control_tensions: normalizeCollection(
          intervention.care_control_tensions ?? intervention.tensions,
        ),
      },
      scale_time: {
        ...clone(object(top.scale_time)),
        ...(object(top.scale_time).future_feedback_loops !== undefined && {
          future_feedback_loops: normalizeCollection(
            top.scale_time.future_feedback_loops,
          ),
        }),
      },
      distribution: {
        items: normalizeCollection(distribution.items),
        inequality_dimensions: normalizeCollection(
          distribution.inequality_dimensions ?? distribution.inequalities,
        ),
        necropolitical_dimensions: normalizeCollection(
          distribution.necropolitical_dimensions ??
            distribution.necropolitics,
        ),
      },
      consent_exit: clone(object(top.consent_exit)),
      competing_explanations: fixedMap(
        top.explanations,
        explanationTypes,
        (type, item, index) => ({
          id: item.id || `EX${index + 1}`,
          type,
          relevance: item.relevance || "uncertain",
          evidentiary_status:
            item.evidentiary_status ?? item.status ?? "not_assessed",
          claim: text(item.claim),
          mechanism: text(item.mechanism),
          supporting_evidence_ids: array(
            item.supporting_evidence_ids ??
              item.supporting_evidence_refs ??
              item.support,
          ),
          counter_evidence_ids: array(
            item.counter_evidence_ids ??
              item.counter_evidence_refs ??
              item.counter,
          ),
          falsified_if: array(item.falsified_if),
          confidence: item.confidence || "low",
        }),
        "/explanations",
        audit,
      ),
      evidence: { items: normalizeCollection(top.evidence) },
      assumptions: { items: normalizeCollection(top.assumptions) },
      resistance_agency: {
        items: normalizeCollection(top.resistance),
      },
      alternatives: { items: normalizeCollection(top.alternatives) },
      calibrated_conclusion: {
        strongly_supported: array(conclusion.strongly_supported),
        plausible_unconfirmed: array(conclusion.plausible_unconfirmed),
        disputed: array(conclusion.disputed),
        unknown: array(conclusion.unknown),
        evidence_that_would_change: array(
          conclusion.evidence_that_would_change,
        ),
        overall_confidence: conclusion.overall_confidence || "low",
      },
      self_audit: Object.fromEntries(
        selfAuditKeys.map((key) => [
          key,
          object(top.self_audit)[key] || "concern",
        ]),
      ),
      self_audit_notes: array(top.self_audit_notes),
      links: normalizeCollection(top.links).map((item) => {
        const link = { ...item };
        delete link.id;
        return link;
      }),
      migration: null,
    };

    addGeneratedIds(candidate, audit);
    audit.transformations.unshift(
      Object.freeze({
        code: "AI_INTERCHANGE_COMPILED",
        path: "/",
        from: CONTRACT,
        to: `${CANONICAL_CONTRACT}@${CANONICAL_SCHEMA_VERSION}`,
        count: 1,
      }),
    );
    return Object.freeze({
      value: candidate,
      audit: Object.freeze({
        transformations: Object.freeze(audit.transformations),
        quarantine: Object.freeze(audit.quarantine),
      }),
    });
  }

  const HARD_REQUIRED_PROPERTIES = new Set([
    "schema_version",
    "analysis_contract",
    "contract_status",
    "analysis_lens",
    "analysis_id",
    "language",
    "subject",
    "id",
  ]);

  function isReviewableCompletionGap(item) {
    const diagnostic = object(item);
    const keyword = text(diagnostic.keyword).toLowerCase();
    const code = text(diagnostic.code).toUpperCase();
    const path = text(diagnostic.path || diagnostic.instancePath || "/");
    const missing = text(diagnostic.params?.missingProperty);
    const allowed =
      ["minlength", "minitems", "required"].includes(keyword) ||
      ["SCHEMA_MINLENGTH", "SCHEMA_MINITEMS", "SCHEMA_REQUIRED"].includes(
        code,
      );
    if (!allowed) return false;
    if (/(^|\/)(analysis_id|id)$/.test(path)) return false;
    if (
      (keyword === "required" || code === "SCHEMA_REQUIRED") &&
      HARD_REQUIRED_PROPERTIES.has(missing)
    ) {
      return false;
    }
    return true;
  }

  function canRecoverAsDraft(validation) {
    const result = object(validation);
    const diagnostics = array(result.errors);
    return (
      result.state === "canonical" &&
      diagnostics.length > 0 &&
      diagnostics.every(isReviewableCompletionGap)
    );
  }

  function draftOrigin(options = {}) {
    if (options.origin === "canonical") {
      return {
        fromSchema: CANONICAL_SOURCE,
        adapter: "canonical-ai-result-to-reviewable-draft-v1",
      };
    }
    return {
      fromSchema: CONTRACT,
      adapter: "ai-interchange-v1-to-biopolitical-v2",
    };
  }

  function asReviewableDraft(candidate, diagnostics = [], options = {}) {
    const value = clone(candidate);
    const origin = draftOrigin(options);
    value.schema_version = GENERATED_DRAFT_SCHEMA_VERSION;
    value.analysis_contract = GENERATED_DRAFT_CONTRACT;
    value.contract_status = "reviewable_generated_draft";
    value.migration = {
      from_schema: origin.fromSchema,
      adapter: origin.adapter,
      warnings: array(diagnostics)
        .slice(0, 50)
        .map((item) =>
          text(
            isObject(item)
              ? `${item.path || "/"}: ${item.message || item.code || "review required"}`
              : item,
          ),
        )
        .filter(Boolean),
      canonical_target: CANONICAL_SOURCE,
    };
    if (!value.migration.warnings.length) {
      value.migration.warnings.push(
        "Canonical completion and semantic review are required.",
      );
    }
    return value;
  }

  function supports(value) {
    const source = object(value);
    return source.contract === CONTRACT && source.lens === LENS;
  }

  // Sections that only the interchange shape uses (canonical names differ).
  const INTERCHANGE_ONLY_KEYS = ["power", "meaning", "intervention", "explanations", "conclusion"];
  const RESULT_MARKERS = ["contract", "lens", "analysis_lens", "analysis_contract", "schema_version"];
  const STRATEGIC_KEYS = ["interests", "actors", "tools", "narrative", "results", "feedback"];
  const CANONICAL_ONLY_KEYS = ["human_functions", "power_map", "meaning_systems", "capture_levels", "intervention_assessment", "competing_explanations"];
  const looksLikeResult = (value) =>
    isObject(value) &&
    (RESULT_MARKERS.some((key) => key in value) ||
      INTERCHANGE_ONLY_KEYS.filter((key) => key in value).length >= 2 ||
      STRATEGIC_KEYS.filter((key) => key in value).length >= 2);

  // Accepts provider envelope drift without touching analytical content: a
  // single wrapper key around the result, and a missing or misspelled
  // interchange contract on an object that has the interchange shape.
  // The single result-shaped value inside up to three wrapper levels (a
  // one-item list or an object); text beside it is commentary, like prose
  // around the JSON. Several candidate results are ambiguous and left alone.
  function findResult(node, path, depth) {
    if (looksLikeResult(node)) return { value: node, path };
    if (!depth) return undefined;
    const children = Array.isArray(node)
      ? node.length === 1 ? [["0", node[0]]] : []
      : isObject(node) ? Object.entries(node) : [];
    const found = children
      .map(([key, child]) =>
        findResult(child, `${path}/${key.replaceAll("~", "~0").replaceAll("/", "~1")}`, depth - 1),
      )
      .filter(Boolean);
    return found.length === 1 ? found[0] : undefined;
  }

  // An explicit null header value counts as missing.
  const token = (value) => (typeof value === "string" ? value.trim().toLowerCase() : value ?? undefined);

  function recognize(value) {
    const transformations = [];
    let source = value;
    if (!looksLikeResult(source)) {
      const found = findResult(source, "", 3);
      if (found) {
        source = found.value;
        // Sections the AI put next to the wrapped result, not inside it,
        // belong to it and are kept rather than dropped with the wrapper.
        if (isObject(value) && isObject(source) && Object.values(value).includes(found.value)) {
          const siblings = Object.entries(value).filter(
            ([key, child]) => child !== found.value && !(key in source),
          );
          if (siblings.length) source = { ...source, ...Object.fromEntries(siblings) };
        }
        transformations.push(
          Object.freeze({ code: "RESULT_WRAPPER_REMOVED", path: found.path, count: 1 }),
        );
      }
    }
    if (isObject(source)) {
      const fixed = { ...source };
      const set = (key, to) => {
        if (fixed[key] === to) return;
        transformations.push(
          Object.freeze({
            code: "ENVELOPE_IDENTITY_NORMALIZED",
            path: `/${key}`,
            from: fixed[key] ?? null,
            to,
            count: 1,
          }),
        );
        fixed[key] = to;
      };
      if (token(fixed.lens) === LENS) set("lens", LENS);
      if (token(fixed.contract) === CONTRACT) set("contract", CONTRACT);
      if (["strategic", LENS].includes(token(fixed.analysis_lens))) {
        set("analysis_lens", token(fixed.analysis_lens));
      }
      // A result with no lens label at all is recognized by its shape, not by
      // the lens the page happens to show.
      if (
        fixed.analysis_lens == null &&
        fixed.lens == null &&
        !("contract" in fixed) &&
        INTERCHANGE_ONLY_KEYS.filter((key) => key in fixed).length < 2
      ) {
        if (
          token(fixed.analysis_contract) === CANONICAL_CONTRACT ||
          CANONICAL_ONLY_KEYS.filter((key) => key in fixed).length >= 2
        ) {
          set("analysis_lens", LENS);
        } else if (STRATEGIC_KEYS.filter((key) => Array.isArray(fixed[key])).length >= 3) {
          set("analysis_lens", "strategic");
        }
      }
      // A canonical-shaped Biopolitical header that is loosely written or
      // incomplete names the 2.1 contract; legacy v1 and other versions are
      // left for the existing migration or unsupported-version paths.
      const version = token(fixed.schema_version);
      const legacyShape = ["interests", "actors", "tools"].some((key) => Array.isArray(fixed[key]));
      if (
        fixed.analysis_lens === LENS &&
        !("contract" in fixed) &&
        !legacyShape &&
        [undefined, CANONICAL_CONTRACT].includes(token(fixed.analysis_contract)) &&
        (version === undefined ||
          (["string", "number"].includes(typeof version) && /^v?2\.1(\.0)?$/.test(String(version)))) &&
        [undefined, "canonical"].includes(token(fixed.contract_status))
      ) {
        set("analysis_contract", CANONICAL_CONTRACT);
        set("schema_version", CANONICAL_SCHEMA_VERSION);
        set("contract_status", "canonical");
      }
      source = fixed;
    }
    if (
      isObject(source) &&
      !supports(source) &&
      !("analysis_contract" in source) &&
      (source.lens == null || source.lens === LENS) &&
      INTERCHANGE_ONLY_KEYS.filter((key) => key in source).length >= 2
    ) {
      transformations.push(
        Object.freeze({
          code: "AI_INTERCHANGE_CONTRACT_INFERRED",
          path: "/contract",
          from: source.contract ?? null,
          to: CONTRACT,
          count: 1,
        }),
      );
      source = { ...source, contract: CONTRACT, lens: LENS };
    }
    return Object.freeze({ value: source, transformations: Object.freeze(transformations) });
  }

  function buildTemplate(lang = "en", mode = "focused", evidenceAccess = "web") {
    const BIO = root.Jarbou3iBiopolitics;
    const keyed = (keys, value) =>
      Object.fromEntries(keys.map((key) => [key, clone(value)]));
    const template = {
      contract: CONTRACT,
      lens: LENS,
      language: lang,
      mode,
      subject: {
        title: "string",
        context: "string",
        research_question: "testable question",
        executive_finding: "calibrated finding",
      },
      framing: {
        contested_terms: [
          {
            term: "string",
            definitions: ["string"],
            working_definition: "string",
            stakes: "string",
          },
        ],
        historical_context: {
          summary: "string",
          turning_points: ["string"],
          continuities: ["string"],
        },
        official_problem_definition: "string",
        critical_problem_definition: "string",
        unknowns: ["string"],
      },
      legal_framework: {
        status: "assessed|not_relevant|unknown",
        jurisdictions: ["string"],
        applicable_authorities: ["string"],
        rights_engaged: ["string"],
        safeguards_and_remedies: ["string"],
        uncertainties: ["string"],
      },
      international_comparison: [
        {
          ref: "CMP1",
          jurisdiction_or_context: "string",
          comparison_basis: "string",
          similarities: ["string"],
          differences: ["string"],
          transfer_limits: ["string"],
          evidence_refs: ["E1"],
          confidence: "high|medium|low",
        },
      ],
      capture_levels: keyed(BIO.CAPTURE_LEVELS, {
        status: "present|absent|uncertain|not_applicable",
        finding: "string",
        evidence_refs: ["E1"],
      }),
      theoretical_comparison: [
        {
          ref: "THEORY1",
          tradition: "string",
          contribution: "string",
          limitations: ["string"],
          relevance: "relevant|not_relevant|uncertain",
          evidence_refs: ["E1"],
        },
      ],
      human_functions: [
        {
          ref: "HF1",
          domain:
            "biological|cognitive_affective|reproductive|social_relational|symbolic|environmental",
          name: "string",
          scientific_definition: "string",
          lived_context: "string",
          governed_variation: "string",
          authority_defining_normality: "string",
          refusal_conditions: "string",
          confidence: "high|medium|low",
        },
      ],
      power: {
        actors: [
          {
            ref: "ACT1",
            name: "string",
            role: "decision_maker|implementer|expert|funder|beneficiary|intermediary|resisting_group|other",
            formal_mandate: "string",
            material_interests: ["string"],
            authority_sources: ["string"],
            funding: ["string"],
            information_advantages: ["string"],
            enforcement_capacities: ["string"],
            dependencies: ["string"],
            stated_objectives: ["string"],
            plausible_unstated_incentives: ["string"],
            internal_disagreements: ["string"],
            accountability: ["string"],
            confidence: "high|medium|low",
          },
        ],
        affected_populations: [
          {
            ref: "POP1",
            name: "string",
            classification: "string",
            exposure: ["string"],
            benefits: ["string"],
            burdens: ["string"],
            agency: "string",
            missing_from_record: false,
            confidence: "high|medium|low",
          },
        ],
        institutions: [],
        power_asymmetries: [],
      },
      mechanisms: {
        instruments: [
          {
            ref: "INS1",
            name: "string",
            type: "law|force|architecture|money|expertise|statistics|surveillance|incentive|norm|algorithm|narrative|infrastructure|medical|other",
            mechanism: "causal mechanism",
            scale: ["string"],
            stated_purpose: "string",
            ownership: "string",
            oversight: "string",
            confidence: "high|medium|low",
          },
        ],
        infrastructures: [],
        political_economy: [],
        power_modes: [],
      },
      meaning: {
        norms: [],
        regimes_of_truth: [],
        classifications: [],
        looping_effects: [],
      },
      intervention: {
        interventions: [],
        capture: {
          status:
            "no_capture|limited_capture|mixed_capture|substantial_capture|undetermined",
          criteria: keyed(BIO.CAPTURE_CRITERIA, {
            status: "present|absent|uncertain|not_applicable",
            evidence_refs: ["E1"],
            reason: "string",
          }),
          counter_evidence: ["string"],
          legitimate_benefits: ["string"],
          conclusion: "string",
          confidence: "high|medium|low",
        },
        care_control_tensions: [],
      },
      scale_time: {
        scales: ["string"],
        immediate_effects: ["string"],
        medium_term_adaptations: ["string"],
        intergenerational_effects: ["string"],
        historical_continuities: ["string"],
        path_dependencies: ["string"],
        future_feedback_loops: [],
      },
      distribution: {
        items: [],
        inequality_dimensions: [],
        necropolitical_dimensions: [],
      },
      consent_exit: {
        consent_status: "valid|partial|invalid|not_applicable|unknown",
        informed: "yes|partial|no|unknown",
        specific: "yes|partial|no|unknown",
        revocable: "yes|partial|no|unknown",
        comprehensible: "yes|partial|no|unknown",
        materially_voluntary: "yes|partial|no|unknown",
        exit_conditions: ["string"],
        contestability: ["string"],
        accountability: ["string"],
      },
      explanations: keyed(BIO.EXPLANATION_TYPES, {
        relevance: "relevant|not_relevant|uncertain",
        evidentiary_status:
          "supported|plausible|disputed|unsupported|not_assessed",
        claim: "string",
        mechanism: "string",
        supporting_evidence_refs: ["E1"],
        counter_evidence_refs: [],
        falsified_if: ["string"],
        confidence: "high|medium|low",
      }),
      evidence: [
        {
          ref: "E1",
          claim: "string",
          epistemic_type:
            "verified_fact|quantitative_estimate|institutional_claim|scholarly_interpretation|political_narrative|legal_classification|ethical_judgment|plausible_inference|speculation|unsupported_allegation",
          source_tier: Object.keys(BIO.SOURCE_TIERS).join("|"),
          source_title: "string",
          source_url: "absolute HTTP(S) URL or empty string",
          source_locator: "page, section, DOI, dataset, or archive locator",
          source_date: "string",
          geography: "string",
          population: "string",
          measurement_method: "string",
          denominator: "string",
          sample_size: "string",
          measurement_validity: "string",
          causal_identification: "string",
          replication_status:
            "replicated|partly_replicated|not_replicated|not_applicable|unknown",
          conflicts_of_interest: "string",
          missing_data: "string",
          selection_effects: "string",
          relevant_comparison: "string",
          cross_context_applicability: "string",
          claim_source_fit: "direct|indirect|context_only|mismatched|unknown",
          verification_status: "unverified",
          verified_by: "",
          verification_date: "",
          uncertainty: "string",
          limitations: "string",
          counter_evidence: "string",
          confidence: "high|medium|low",
        },
      ],
      assumptions: [],
      resistance: [],
      alternatives: [],
      conclusion: {
        strongly_supported: ["string"],
        plausible_unconfirmed: ["string"],
        disputed: ["string"],
        unknown: ["string"],
        evidence_that_would_change: ["string"],
        overall_confidence: "high|medium|low",
      },
      self_audit: keyed(BIO.SELF_AUDIT_KEYS, "pass|concern|not_applicable"),
      self_audit_notes: [],
      links: [],
    };
    // Without source access the placeholder record is the only evidence, nothing
    // cites it, and the conclusion states the limitation.
    if (evidenceAccess === "none") {
      const { copy, evidence } = BIO.unsourcedPlaceholder(lang);
      const clearEvidenceRefs = (value) => {
        if (!value || typeof value !== "object") return;
        for (const [key, child] of Object.entries(value)) {
          if (key.endsWith("evidence_refs")) value[key] = [];
          else clearEvidenceRefs(child);
        }
      };
      clearEvidenceRefs(template);
      const { id, ...record } = evidence;
      template.evidence = [{ ref: id, ...record }];
      template.conclusion.strongly_supported = [copy.noStrong];
      template.conclusion.overall_confidence = "low";
      template.self_audit.statistics_quotations_verified = "concern";
    }
    return JSON.stringify(template);
  }

  function buildFieldGuide(evidenceAccess = "web", mode = "focused") {
    // Research and expert depth also ask for assumptions and causal links.
    const populate = [
      "power.actors",
      "power.affected_populations",
      "mechanisms.instruments",
      "mechanisms.power_modes",
      "at least one of mechanisms.infrastructures or mechanisms.political_economy",
      "meaning.norms",
      "meaning.regimes_of_truth",
      "meaning.classifications",
      "intervention.interventions",
      "distribution.items",
      "resistance",
      "alternatives",
      ...(evidenceAccess === "none" ? [] : ["evidence"]),
      ...(["research", "expert"].includes(mode) ? ["assumptions", "links"] : []),
    ];
    return [
      "Interchange record guide (keys are canonical; ref becomes id locally):",
      // Without source access the template's placeholder is the only evidence.
      `Populate these even though their template arrays are empty: ${populate.slice(0, -1).join(", ")}, and ${populate.at(-1)}.`,
      "institutions: {ref,name,mandate,role,accountability[],confidence}",
      "power_asymmetries: {ref,between[],resource,effect,confidence}",
      "infrastructures: {ref,name,owner,dependency_created,actions_enabled_or_blocked[],access_conditions[],confidence}",
      "political_economy: {ref,ownership,labor,profit,unpaid_care,privatized_risks[],socialized_costs[],scarcity_mechanism,dependency_model,confidence}",
      "power_modes: {mode,mechanism,evidence_refs[],confidence}",
      "norms: {ref,name,definition,authority,subject_position,alternatives[],confidence}",
      "regimes_of_truth: {ref,claim,authorizing_institutions[],validation_procedure,funding_or_interest,excluded_knowledge[],evidence_quality,confidence}",
      "classifications: {ref,category,definition,decision_use,error_risks[],contestability,confidence}",
      "looping_effects: {ref,classification_id,institutional_response,altered_opportunity_or_identity,behavioral_adaptation,new_data,confirmation_or_revision,falsified_if[],confidence}",
      "interventions: {ref,name,target_function_ids[],actor_ids[],instrument_ids[],modality,stated_benefit,evidence_of_benefit[],documented_harms[],necessity,proportionality,dependency_created,consent,exit,contestability,confidence}",
      "care_control_tensions: {ref,care_claim,control_effects[],interpretation,severity,confidence}",
      "future_feedback_loops: {ref,name,timeframe,drivers[],early_signals[],falsified_if[],rationale,probability}",
      "distribution.items: {ref,population_id,benefits[],burdens[],protection[],opportunity[],recognition[],profit[],voice[],risk[],surveillance[],discipline[],displacement[],illness_injury_death[],axes[],scale[],time_horizon,outcome_character,confidence}",
      "inequality_dimensions: {axis,mechanism,affected_groups[],evidence_refs[],confidence}",
      "necropolitical_dimensions: {ref,population_id,exposure,causal_character,visibility,protection_gap,confidence}",
      "assumptions: {ref,assumption,risk,disproving_test,implication_if_wrong,confidence}",
      "resistance: {ref,actor_or_population,form,mechanism,effect_on_system,constraints[],confidence}",
      "alternatives: {ref,level,proposal,mechanism,feasibility,tradeoffs[],rights_safeguards[],evidence_needed[],lower_harm_rationale}",
      "links: {from,to,relation,mechanism,confidence}",
      "interventions.evidence_of_benefit: evidence IDs (E1, E2…), never descriptions; state the benefit itself in stated_benefit",
      "power_asymmetries.between: refs of actors, affected_populations, or institutions in this answer, never names",
      "links.from, links.to: refs of records in this answer (an actor, intervention, evidence item…), never names or descriptions",
      // The importer rejects any other code or number; the AI must see them all.
      "Allowed codes (use exactly one listed value; never invent another):",
      "power_modes.mode: sovereign_power|disciplinary_power|biopower|governmentality|pastoral_power|psychopolitics|necropolitics|datafication|algorithmic_governance|political_economy|coloniality|ecological_governmentality",
      "interventions.modality: protection|assistance|treatment|regulation|persuasion|incentivization|manipulation|exploitation|coercion|capture|expropriation|mixed|undetermined",
      "interventions.necessity: supported|partly_supported|unsupported|unknown",
      "interventions.proportionality: proportionate|mixed|disproportionate|unknown",
      "distribution.items.outcome_character: intended|tolerated|concealed|unforeseen|uncertain",
      "inequality_dimensions.axis: class|race|gender|disability|age|citizenship|other",
      "necropolitical_dimensions.causal_character: deliberate|reckless_indifference|structural_exposure|administrative_failure|unintended_harm|uncertain",
      "assumptions.risk: low|medium|high",
      "resistance.form: refusal|protest|evasion|mutual_aid|counterknowledge|litigation|unionization|artistic_intervention|technological_adaptation|alternative_institution|other",
      "alternatives.level: individual|community|institutional|national|transnational",
      "alternatives.feasibility: high|medium|low",
      "links.relation: causes|enables|constrains|classifies|legitimizes|commodifies|distributes|exposes|resists|feeds_back|contradicts",
      "care_control_tensions.severity: a number from 0 to 5 (0–5)",
      "future_feedback_loops.probability: a percentage from 0 to 100 (0–100), not a fraction",
    ].join("\n");
  }

  // The last thing the AI reads: the rules an importable answer depends on.
  function buildChecklist(lang = "en") {
    if (lang === "ar") {
      return [
        "قبل الإرسال، تحقّق من:",
        "- كل قيمة نصية مكتوبة بالعربية؛ وتبقى المفاتيح والمعرّفات والرموز كما هي في المخطط.",
        "- الحقول المرمّزة تستخدم القيم المدرجة فقط، والأرقام ضمن نطاقاتها المحددة.",
        "- كائن JSON واحد داخل كتلة كود واحدة ```json، دون أي نص قبلها أو بعدها.",
        "- لا \"...\" ولا كلمات القالب مثل \"string\" مكان المحتوى.",
        "- إذا أوقفك حد الإخراج فتوقف عنده؛ سيُطلب منك المتابعة.",
      ].join("\n");
    }
    if (lang === "fr") {
      return [
        "Avant d’envoyer, vérifiez :",
        "- Chaque valeur textuelle est rédigée en français ; clés, identifiants et codes restent tels que dans le schéma.",
        "- Les champs codés n’utilisent que les valeurs listées, et les nombres restent dans leurs plages indiquées.",
        "- Un seul objet JSON, dans un unique bloc de code ```json, sans aucun texte avant ou après.",
        "- Aucun « ... » ni mot du modèle comme \"string\" à la place du contenu.",
        "- Si votre limite de sortie vous arrête, arrêtez-vous là ; la suite vous sera demandée.",
      ].join("\n");
    }
    return [
      "Before you send, check:",
      "- Every text value is written in English; keys, IDs, and codes stay as the schema shows them.",
      "- Coded fields use only the listed values, and numbers stay within their stated ranges.",
      "- One JSON object, inside a single ```json code block, with no text before or after it.",
      "- No \"...\" and no template words such as \"string\" left in place of content.",
      "- If your output limit stops you, stop there; you will be asked to continue.",
    ].join("\n");
  }

  // Reference defects are completed at their listed path like any other gap.
  const REFERENCE_CODES = new Set(["BROKEN_REFERENCE", "DUPLICATE_GLOBAL_ID"]);

  // The value a gap asks for: a missing required property is named under its
  // parent; every other gap is the value at its own path.
  function gapTarget(item) {
    const diagnostic = object(item);
    const path = text(diagnostic.path || diagnostic.instancePath || "/").replace(/\/$/, "");
    const missing = text(diagnostic.params?.missingProperty);
    const required =
      text(diagnostic.keyword).toLowerCase() === "required" ||
      text(diagnostic.code).toUpperCase() === "SCHEMA_REQUIRED";
    return required && missing
      ? `${path}/${missing.replaceAll("~", "~0").replaceAll("/", "~1")}`
      : path || "/";
  }

  function completionTargets(diagnostics = []) {
    return [...new Set(array(diagnostics).map(gapTarget))];
  }

  const pointerKeys = (pointer) =>
    text(pointer)
      .split("/")
      .slice(1)
      .map((key) => key.replaceAll("~1", "/").replaceAll("~0", "~"));

  const LABEL_KEYS = ["name", "title", "term", "claim", "rhetoric", "description"];
  const COMPLETION_COPY = {
    en: {
      intro: `Some parts of your previous answer are missing. Do not resend the whole analysis. Reply with only the missing parts, as one JSON object inside a single \`\`\`json code block, using exactly the paths listed below as keys:
{"fill":{"<path>":<value>}}
Write each value in English, consistent with the rest of your analysis, and use only the codes and number ranges from the original instructions. Do not invent sources, URLs, locators, or verification states; if something cannot be known, say so in the text.

Missing parts:`,
      reference: "the ID of an existing record",
      duplicate: "a new ID that no other record uses",
      records: (shape) => `a list with at least one record shaped like ${shape}`,
      texts: "a list of short texts",
      record: (shape) => `a record shaped like ${shape}`,
      oneOf: (codes) => `one of ${codes}`,
      text: "text",
      number: "a number",
      value: "the missing value",
      within: (label) => ` (in "${label}")`,
    },
    ar: {
      intro: `بعض أجزاء إجابتك السابقة ناقصة. لا تُعد إرسال التحليل كاملًا. أجب بالأجزاء الناقصة فقط، في كائن JSON واحد داخل كتلة كود واحدة \`\`\`json، مستخدمًا المسارات المدرجة أدناه مفاتيحَ كما هي تمامًا:
{"fill":{"<path>":<value>}}
اكتب كل قيمة بالعربية، متسقة مع بقية تحليلك، واستخدم فقط الرموز ونطاقات الأرقام الواردة في التعليمات الأصلية. لا تختلق مصادر أو روابط أو محددات أو حالات تحقق؛ وإذا تعذّرت معرفة شيء فاذكر ذلك في النص.

الأجزاء الناقصة:`,
      reference: "معرّف سجل موجود",
      duplicate: "معرّف جديد لا يستخدمه أي سجل آخر",
      records: (shape) => `قائمة فيها سجل واحد على الأقل بالشكل ${shape}`,
      texts: "قائمة نصوص قصيرة",
      record: (shape) => `سجل بالشكل ${shape}`,
      oneOf: (codes) => `واحدة من ${codes}`,
      text: "نص",
      number: "رقم",
      value: "القيمة الناقصة",
      within: (label) => ` (في "${label}")`,
    },
    fr: {
      intro: `Certaines parties de votre réponse précédente manquent. Ne renvoyez pas toute l’analyse. Répondez uniquement avec les parties manquantes, en un seul objet JSON dans un unique bloc de code \`\`\`json, en utilisant exactement les chemins listés ci-dessous comme clés :
{"fill":{"<path>":<value>}}
Rédigez chaque valeur en français, en cohérence avec le reste de votre analyse, et n’utilisez que les codes et plages de nombres des instructions d’origine. N’inventez ni source, ni URL, ni localisateur, ni état de vérification ; si quelque chose ne peut pas être su, dites-le dans le texte.

Parties manquantes :`,
      reference: "l’identifiant d’un élément existant",
      duplicate: "un nouvel identifiant qu’aucun autre élément n’utilise",
      records: (shape) => `une liste d’au moins un élément de la forme ${shape}`,
      texts: "une liste de textes courts",
      record: (shape) => `un élément de la forme ${shape}`,
      oneOf: (codes) => `l’une des valeurs ${codes}`,
      text: "texte",
      number: "un nombre",
      value: "la valeur manquante",
      within: (label) => ` (dans « ${label} »)`,
    },
  };

  // One line per gap: its path, what kind of value it needs (read from the
  // prompt template), and the record it belongs to.
  function describeGap(item, candidate, template, copy) {
    const target = gapTarget(item);
    const code = text(object(item).code).toUpperCase();
    const keys = pointerKeys(target);
    let description;
    if (code === "BROKEN_REFERENCE") description = copy.reference;
    else if (code === "DUPLICATE_GLOBAL_ID") description = copy.duplicate;
    else {
      // The template holds one example entry per list, so any index reads entry 0.
      const shape = keys.reduce((node, key) => (Array.isArray(node) ? node[0] : node?.[key]), template);
      description = Array.isArray(shape)
        ? isObject(shape[0])
          ? copy.records(JSON.stringify(shape[0]))
          : copy.texts
        : isObject(shape)
          ? copy.record(JSON.stringify(shape))
          : typeof shape === "number"
            ? copy.number
            : typeof shape === "string" && shape.includes("|")
              ? copy.oneOf(shape)
              : typeof shape === "string"
                ? copy.text
                : copy.value;
    }
    let label = "";
    keys.slice(0, -1).reduce((node, key) => {
      const next = node?.[key];
      const name = isObject(next)
        ? LABEL_KEYS.map((field) => next[field]).find((value) => typeof value === "string" && value.trim())
        : "";
      if (name) label = name.trim();
      return next;
    }, candidate);
    const shortLabel = label.length > 80 ? `${label.slice(0, 79)}…` : label;
    return `${target} — ${description}${shortLabel ? copy.within(shortLabel) : ""}`;
  }

  // Asks only for the missing parts: resending the whole analysis would hit
  // the same output limit that left the gaps in the first place.
  function buildCompletionPrompt(candidate, diagnostics = [], lang = "en", template = {}) {
    const gaps = array(diagnostics).filter(
      (item) =>
        isReviewableCompletionGap(item) ||
        REFERENCE_CODES.has(text(object(item).code).toUpperCase()),
    );
    if (!gaps.length || gaps.length !== array(diagnostics).length) {
      const error = new Error(
        "A completion prompt can be built only for reviewable completion gaps.",
      );
      error.code = "AI_COMPLETION_UNSAFE_DIAGNOSTICS";
      throw error;
    }
    const copy = COMPLETION_COPY[lang] || COMPLETION_COPY.en;
    const lines = gaps
      .slice(0, 50)
      .map((item) => describeGap(item, object(candidate), object(template), copy));
    return `${copy.intro}\n${[...new Set(lines)].join("\n")}`;
  }

  // A reply that holds only the missing parts: {"fill": {"/path": value}}.
  // Models often leave out the leading "/" ("feedback/1/speed"); the path
  // means the same.
  const fillTarget = (key) => (key.startsWith("/") ? key : `/${key}`);
  function isCompletionReply(value) {
    const fill = object(value).fill;
    return (
      isObject(fill) &&
      Object.keys(fill).length > 0 &&
      Object.keys(fill).every((key) => key.length > 0)
    );
  }

  // Writes each value into a copy of the analysis. A path the completion
  // prompt did not ask for is reported as ignored, never applied.
  function applyCompletion(base, reply, targets = []) {
    const value = clone(base);
    const asked = new Set(targets);
    const ignored = [];
    let applied = 0;
    const put = (target, next) => {
      const keys = pointerKeys(target);
      const owner = keys.slice(0, -1).reduce((node, key) => node?.[key], value);
      if (!keys.length || !owner || typeof owner !== "object") return false;
      owner[keys.at(-1)] = clone(next);
      return true;
    };
    for (const [key, next] of Object.entries(object(object(reply).fill))) {
      const target = fillTarget(key);
      // Models also answer one level up, keyed by the record or list that
      // holds the missing parts; only the parts asked for are read from it.
      const parts = asked.has(target)
        ? [[target, next]]
        : [...asked]
            .filter((path) => path.startsWith(`${target}/`))
            .map((path) => [path, pointerKeys(path.slice(target.length)).reduce((node, part) => node?.[part], next)])
            .filter(([, part]) => part !== undefined);
      const written = parts.filter(([path, part]) => put(path, part)).length;
      if (!written) ignored.push(target);
      applied += written;
    }
    return { value, applied, ignored };
  }

  // Every prompt wraps the topic in one of these markers (per lens and
  // language), each at the start of a line. A pasted text that has one is the
  // prompt itself, not the AI's reply.
  const PROMPT_MARKER =
    /^(?:(?:UNTRUSTED_ANALYSIS_MATERIAL_JSON|مادة_التحليل_غير_الموثوقة_JSON|MATIERE_ANALYTIQUE_NON_FIABLE_JSON)\s*:|<(?:UNTRUSTED_TOPIC_MATERIAL|مادة_موضوع_غير_موثوقة|SUJET_NON_FIABLE)>)/m;

  function isCopiedPrompt(text) {
    return PROMPT_MARKER.test(String(text || ""));
  }

  root.Jarbou3iAiInterchange = Object.freeze({
    CONTRACT,
    LENS,
    GENERATED_DRAFT_CONTRACT,
    GENERATED_DRAFT_SCHEMA_VERSION,
    supports,
    recognize,
    compile,
    generateMissingIds: addGeneratedIds,
    canRecoverAsDraft,
    isReviewableCompletionGap,
    asReviewableDraft,
    buildTemplate,
    buildFieldGuide,
    buildChecklist,
    buildCompletionPrompt,
    completionTargets,
    isCompletionReply,
    applyCompletion,
    isCopiedPrompt,
  });
})(typeof window !== "undefined" ? window : globalThis);
