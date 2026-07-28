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
    if (Array.isArray(value)) return value.map(normalizeRecord);
    if (!isObject(value)) return [];
    return Object.entries(value).map(([id, item]) => ({
      id: object(item).id || id,
      ...normalizeRecord(item),
    }));
  }

  function fixedMap(value, expected, mapper, path, audit) {
    const source = object(value);
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
      records.forEach((record, index) => {
        if (!isObject(record) || text(record.id).trim()) return;
        record.id = `${prefix}${index + 1}`;
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
    const source = object(raw);
    const audit = { transformations: [], quarantine: [] };
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
    const subject = object(top.subject);
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
      scale_time: clone(object(top.scale_time)),
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

  function buildTemplate(lang = "en", mode = "focused") {
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
          source_tier: "canonical source-tier enum",
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
    return JSON.stringify(template);
  }

  function buildFieldGuide() {
    return [
      "Interchange record guide (keys are canonical; ref becomes id locally):",
      "Populate these even though their template arrays are empty: power.actors, power.affected_populations, mechanisms.instruments, mechanisms.power_modes, at least one of mechanisms.infrastructures or mechanisms.political_economy, meaning.norms, meaning.regimes_of_truth, meaning.classifications, intervention.interventions, distribution.items, resistance, alternatives, and evidence.",
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
    ].join("\n");
  }

  function buildCompletionPrompt(candidate, diagnostics = [], lang = "en") {
    const gaps = array(diagnostics).filter(isReviewableCompletionGap);
    if (!gaps.length || gaps.length !== array(diagnostics).length) {
      const error = new Error(
        "A completion prompt can be built only for reviewable completion gaps.",
      );
      error.code = "AI_COMPLETION_UNSAFE_DIAGNOSTICS";
      throw error;
    }
    const diagnosticBlock = gaps
      .slice(0, 50)
      .map(
        (item) =>
          `${text(item.path || item.instancePath || "/")}: ${text(
            item.message || item.code || "completion required",
          )}`,
      )
      .join("\n");
    const payload = JSON.stringify(candidate);
    if (lang === "ar") {
      return `هذه مهمة استكمال تحليلي موجّه وليست إعادة كتابة شاملة أو إصلاح تنسيق JSON. أعد كائن JSON نظاميًا واحدًا كاملًا ومضغوطًا فقط. حافظ على كل المحتوى والمعرّفات والقيم كما هي، وعدّل فقط المسارات المدرجة في التشخيص. املأ كل قيمة فارغة بمحتوى تحليلي محدد ومقتصد يستند إلى الأدلة الموجودة في السجل. إذا لم يحدد السجل دليلًا مضادًا، اذكر ذلك صراحة وحدد ما الذي يجب البحث عنه لاختبار الادعاء؛ لا تختلق مصدرًا أو رابطًا أو محددًا أو حالة تحقق. لا تحذف سجل دليل ولا تغيّر claim أو confidence أو verification_status. لا تُعد Markdown أو أسوار كود أو شرحًا أو JSON Patch أو علامات cite/filecite/turn.

المسارات المطلوب استكمالها:
${diagnosticBlock}

JSON النظامي الأساسي:
${payload}`;
    }
    if (lang === "fr") {
      return `Il s’agit d’une complétion analytique ciblée, pas d’une réécriture générale ni d’une réparation de sérialisation JSON. Retournez exactement un objet JSON canonique complet et minifié. Préservez tout le contenu, les identifiants et les valeurs ; modifiez uniquement les chemins listés dans le diagnostic. Remplissez chaque valeur vide avec un contenu analytique précis et concis fondé sur les preuves déjà présentes. Si le dossier n’identifie aucune contre-preuve, dites-le explicitement et précisez ce qu’il faudrait rechercher pour tester l’affirmation ; n’inventez aucune source, URL, aucun localisateur ni état de vérification. Ne supprimez aucun élément de preuve et ne modifiez ni claim, ni confidence, ni verification_status. Ne retournez ni Markdown, ni bloc de code, ni explication, ni JSON Patch, ni marqueur cite/filecite/turn.

Chemins à compléter :
${diagnosticBlock}

JSON canonique de base :
${payload}`;
    }
    return `This is a targeted analytical completion task, not a general rewrite or JSON serialization repair. Return exactly one complete minified canonical JSON object. Preserve all existing content, IDs, and values; modify only the paths listed in the diagnostics. Fill each empty value with specific, concise analytical content grounded in evidence already present in the record. If the record identifies no counter-evidence, state that explicitly and specify what should be searched to test the claim; do not invent a source, URL, locator, or verification state. Do not delete any evidence record or change claim, confidence, or verification_status. Do not return Markdown, code fences, explanations, JSON Patch, or cite/filecite/turn markers.

Paths to complete:
${diagnosticBlock}

Canonical base JSON:
${payload}`;
  }

  root.Jarbou3iAiInterchange = Object.freeze({
    CONTRACT,
    LENS,
    GENERATED_DRAFT_CONTRACT,
    GENERATED_DRAFT_SCHEMA_VERSION,
    supports,
    compile,
    canRecoverAsDraft,
    isReviewableCompletionGap,
    asReviewableDraft,
    buildTemplate,
    buildFieldGuide,
    buildCompletionPrompt,
  });
})(typeof window !== "undefined" ? window : globalThis);
