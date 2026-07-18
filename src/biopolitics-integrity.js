/* Jarbou3i Model — Biopolitical import and semantic integrity gate */
(function attachBiopoliticalIntegrity(root) {
  "use strict";

  const arr = (value) => (Array.isArray(value) ? value : []);
  const object = (value) =>
    value && typeof value === "object" && !Array.isArray(value) ? value : {};
  const str = (value) =>
    value === null || value === undefined ? "" : String(value);
  const filled = (value) => str(value).trim().length > 0;
  const placeholderPattern =
    /replace\s+with|placeholder|example\s+source|sample\s+source|à\s+remplacer|source\s+d['’]exemple|استبدل|مصدر\s+مثال/i;

  function issue(code, path, message, severity = "error", details = {}) {
    return { code, path, message, severity, ...details };
  }

  function schemaIssues(errors) {
    return arr(errors).map((error) =>
      issue(
        `SCHEMA_${str(error.keyword).toUpperCase()}`,
        error.instancePath || "/",
        `${error.instancePath || "/"} ${error.message || "is invalid"}`,
        "error",
        { keyword: error.keyword, params: error.params },
      ),
    );
  }

  function collectRecords(analysis) {
    const a = object(analysis);
    return [
      ["human_function", "/human_functions", arr(a.human_functions)],
      ["actor", "/power_map/actors", arr(a.power_map?.actors)],
      [
        "population",
        "/power_map/affected_populations",
        arr(a.power_map?.affected_populations),
      ],
      ["institution", "/power_map/institutions", arr(a.power_map?.institutions)],
      ["asymmetry", "/power_map/power_asymmetries", arr(a.power_map?.power_asymmetries)],
      ["instrument", "/mechanisms/instruments", arr(a.mechanisms?.instruments)],
      ["infrastructure", "/mechanisms/infrastructures", arr(a.mechanisms?.infrastructures)],
      ["political_economy", "/mechanisms/political_economy", arr(a.mechanisms?.political_economy)],
      ["norm", "/meaning_systems/norms", arr(a.meaning_systems?.norms)],
      ["regime_of_truth", "/meaning_systems/regimes_of_truth", arr(a.meaning_systems?.regimes_of_truth)],
      ["classification", "/meaning_systems/classifications", arr(a.meaning_systems?.classifications)],
      ["looping_effect", "/meaning_systems/looping_effects", arr(a.meaning_systems?.looping_effects)],
      ["intervention", "/intervention_assessment/interventions", arr(a.intervention_assessment?.interventions)],
      ["care_control_tension", "/intervention_assessment/care_control_tensions", arr(a.intervention_assessment?.care_control_tensions)],
      ["future_loop", "/scale_time/future_feedback_loops", arr(a.scale_time?.future_feedback_loops)],
      ["distribution", "/distribution/items", arr(a.distribution?.items)],
      ["necropolitical_dimension", "/distribution/necropolitical_dimensions", arr(a.distribution?.necropolitical_dimensions)],
      ["explanation", "/competing_explanations", arr(a.competing_explanations)],
      ["evidence", "/evidence/items", arr(a.evidence?.items)],
      ["assumption", "/assumptions/items", arr(a.assumptions?.items)],
      ["resistance", "/resistance_agency/items", arr(a.resistance_agency?.items)],
      ["alternative", "/alternatives/items", arr(a.alternatives?.items)],
      ["international_comparison", "/international_comparison", arr(a.international_comparison)],
      ["theoretical_comparison", "/theoretical_comparison", arr(a.theoretical_comparison)],
    ];
  }

  function semanticValidate(analysis, options = {}) {
    const BIO = root.Jarbou3iBiopolitics;
    const a = object(analysis);
    const draft = options.draft === true || a.contract_status === "migrated_draft";
    const errors = [];
    const warnings = [];
    const idIndex = new Map();
    const idsByType = new Map();

    const report = (entry) => (draft ? warnings : errors).push(entry);
    for (const [type, basePath, records] of collectRecords(a)) {
      const typeIds = new Set();
      idsByType.set(type, typeIds);
      records.forEach((record, index) => {
        const id = str(record?.id).trim();
        if (!id) return;
        const path = `${basePath}/${index}/id`;
        typeIds.add(id);
        if (idIndex.has(id)) {
          report(
            issue(
              "DUPLICATE_GLOBAL_ID",
              path,
              `ID ${id} is already used at ${idIndex.get(id).path}.`,
              draft ? "warning" : "error",
              { id, firstPath: idIndex.get(id).path },
            ),
          );
        } else {
          idIndex.set(id, { type, path });
        }
      });
    }

    const checkRef = (value, path, allowedTypes, code = "BROKEN_REFERENCE") => {
      const id = str(value).trim();
      if (!id) {
        report(
          issue(
            code,
            path,
            "Reference is empty.",
            draft ? "warning" : "error",
          ),
        );
        return;
      }
      const target = idIndex.get(id);
      if (!target || (allowedTypes?.length && !allowedTypes.includes(target.type))) {
        report(
          issue(
            code,
            path,
            `Reference ${id} does not resolve to ${allowedTypes?.join(" or ") || "a known record"}.`,
            draft ? "warning" : "error",
            { reference: id, allowedTypes },
          ),
        );
      }
    };
    const checkRefs = (values, path, allowedTypes, code) =>
      arr(values).forEach((value, index) =>
        checkRef(value, `${path}/${index}`, allowedTypes, code),
      );

    arr(a.power_map?.power_asymmetries).forEach((item, index) =>
      checkRefs(
        item.between,
        `/power_map/power_asymmetries/${index}/between`,
        ["actor", "population", "institution"],
      ),
    );
    arr(a.mechanisms?.power_modes).forEach((item, index) =>
      checkRefs(
        item.evidence_ids,
        `/mechanisms/power_modes/${index}/evidence_ids`,
        ["evidence"],
      ),
    );
    arr(a.meaning_systems?.looping_effects).forEach((item, index) =>
      checkRef(
        item.classification_id,
        `/meaning_systems/looping_effects/${index}/classification_id`,
        ["classification"],
      ),
    );
    arr(a.intervention_assessment?.interventions).forEach((item, index) => {
      const base = `/intervention_assessment/interventions/${index}`;
      checkRefs(item.target_function_ids, `${base}/target_function_ids`, ["human_function"]);
      checkRefs(item.actor_ids, `${base}/actor_ids`, ["actor"]);
      checkRefs(item.instrument_ids, `${base}/instrument_ids`, ["instrument"]);
      checkRefs(item.evidence_of_benefit, `${base}/evidence_of_benefit`, ["evidence"]);
    });
    arr(a.intervention_assessment?.capture_assessment?.criteria).forEach(
      (item, index) =>
        checkRefs(
          item.evidence_ids,
          `/intervention_assessment/capture_assessment/criteria/${index}/evidence_ids`,
          ["evidence"],
        ),
    );
    arr(a.capture_levels).forEach((item, index) =>
      checkRefs(item.evidence_ids, `/capture_levels/${index}/evidence_ids`, ["evidence"]),
    );
    arr(a.international_comparison).forEach((item, index) =>
      checkRefs(
        item.evidence_ids,
        `/international_comparison/${index}/evidence_ids`,
        ["evidence"],
      ),
    );
    arr(a.theoretical_comparison).forEach((item, index) =>
      checkRefs(
        item.evidence_ids,
        `/theoretical_comparison/${index}/evidence_ids`,
        ["evidence"],
      ),
    );
    arr(a.distribution?.items).forEach((item, index) =>
      checkRef(item.population_id, `/distribution/items/${index}/population_id`, ["population"]),
    );
    arr(a.distribution?.inequality_dimensions).forEach((item, index) =>
      checkRefs(
        item.evidence_ids,
        `/distribution/inequality_dimensions/${index}/evidence_ids`,
        ["evidence"],
      ),
    );
    arr(a.distribution?.necropolitical_dimensions).forEach((item, index) =>
      checkRef(
        item.population_id,
        `/distribution/necropolitical_dimensions/${index}/population_id`,
        ["population"],
      ),
    );
    arr(a.competing_explanations).forEach((item, index) => {
      checkRefs(
        item.supporting_evidence_ids,
        `/competing_explanations/${index}/supporting_evidence_ids`,
        ["evidence"],
      );
      checkRefs(
        item.counter_evidence_ids,
        `/competing_explanations/${index}/counter_evidence_ids`,
        ["evidence"],
      );
      if (!draft && item.relevance === "relevant" && !arr(item.falsified_if).length) {
        errors.push(
          issue(
            "MISSING_EXPLANATION_FALSIFIER",
            `/competing_explanations/${index}/falsified_if`,
            `Relevant explanation ${item.type} requires a falsifier.`,
          ),
        );
      }
    });
    arr(a.links).forEach((item, index) => {
      checkRef(item.from, `/links/${index}/from`);
      checkRef(item.to, `/links/${index}/to`);
    });

    if (!draft) {
      const exactSet = (actual, expected, path, code) => {
        const unique = new Set(actual);
        const missing = expected.filter((value) => !unique.has(value));
        const duplicates = actual.filter((value, index) => actual.indexOf(value) !== index);
        if (actual.length !== expected.length || missing.length || duplicates.length) {
          errors.push(
            issue(
              code,
              path,
              `Expected each required value exactly once. Missing: ${missing.join(", ") || "none"}; duplicates: ${[...new Set(duplicates)].join(", ") || "none"}.`,
              "error",
              { missing, duplicates: [...new Set(duplicates)] },
            ),
          );
        }
      };
      exactSet(
        arr(a.intervention_assessment?.capture_assessment?.criteria).map(
          (item) => item.criterion,
        ),
        BIO.CAPTURE_CRITERIA,
        "/intervention_assessment/capture_assessment/criteria",
        "CAPTURE_CRITERIA_INCOMPLETE",
      );
      exactSet(
        arr(a.competing_explanations).map((item) => item.type),
        BIO.EXPLANATION_TYPES,
        "/competing_explanations",
        "EXPLANATION_FAMILIES_INCOMPLETE",
      );
      exactSet(
        arr(a.capture_levels).map((item) => item.level),
        BIO.CAPTURE_LEVELS,
        "/capture_levels",
        "CAPTURE_LEVELS_INCOMPLETE",
      );
    }

    const usedEvidence = new Set();
    const rememberEvidence = (values) => arr(values).forEach((id) => usedEvidence.add(id));
    arr(a.mechanisms?.power_modes).forEach((item) => rememberEvidence(item.evidence_ids));
    arr(a.intervention_assessment?.interventions).forEach((item) =>
      rememberEvidence(item.evidence_of_benefit),
    );
    arr(a.intervention_assessment?.capture_assessment?.criteria).forEach((item) =>
      rememberEvidence(item.evidence_ids),
    );
    arr(a.competing_explanations).forEach((item) => {
      rememberEvidence(item.supporting_evidence_ids);
      rememberEvidence(item.counter_evidence_ids);
    });
    arr(a.distribution?.inequality_dimensions).forEach((item) =>
      rememberEvidence(item.evidence_ids),
    );
    arr(a.capture_levels).forEach((item) => rememberEvidence(item.evidence_ids));
    arr(a.international_comparison).forEach((item) =>
      rememberEvidence(item.evidence_ids),
    );
    arr(a.theoretical_comparison).forEach((item) =>
      rememberEvidence(item.evidence_ids),
    );

    let hasUnverifiedEvidence = false;
    arr(a.evidence?.items).forEach((item, index) => {
      const path = `/evidence/items/${index}`;
      const placeholder = placeholderPattern.test(str(item.source_title));
      const traceable = filled(item.source_url) || filled(item.source_locator);
      const verified = item.verification_status === "verified";
      if (!verified) hasUnverifiedEvidence = true;
      if (filled(item.source_url)) {
        try {
          const url = new URL(item.source_url);
          if (!["https:", "http:"].includes(url.protocol)) throw new Error("protocol");
        } catch {
          errors.push(
            issue(
              "INVALID_SOURCE_URL",
              `${path}/source_url`,
              "Source URL must be an absolute HTTP(S) URL.",
            ),
          );
        }
      }
      if (verified && (placeholder || !traceable)) {
        errors.push(
          issue(
            "UNTRACEABLE_VERIFIED_EVIDENCE",
            path,
            "Evidence marked verified cannot use a placeholder and needs a URL or precise locator.",
          ),
        );
      }
      if (verified && ["mismatched", "unknown"].includes(item.claim_source_fit)) {
        errors.push(
          issue(
            "UNJUSTIFIED_VERIFIED_EVIDENCE",
            `${path}/claim_source_fit`,
            "Verified evidence requires a direct, indirect, or context-only claim/source fit assessment.",
          ),
        );
      }
      if (placeholder || !traceable || !verified) {
        warnings.push(
          issue(
            "EVIDENCE_NOT_PUBLICATION_READY",
            path,
            "Evidence is placeholder, untraceable, or not fully verified.",
            "warning",
          ),
        );
      }
      if (!usedEvidence.has(item.id)) {
        warnings.push(
          issue(
            "UNREFERENCED_EVIDENCE",
            `${path}/id`,
            `Evidence ${item.id} is not cited by an assessed claim.`,
            "warning",
          ),
        );
      }
      if (item.epistemic_type === "quantitative_estimate") {
        for (const field of [
          "sample_size",
          "measurement_validity",
          "causal_identification",
          "missing_data",
          "selection_effects",
          "relevant_comparison",
        ]) {
          if (!filled(item[field])) {
            errors.push(
              issue(
                "QUANTITATIVE_METADATA_MISSING",
                `${path}/${field}`,
                `Quantitative evidence requires ${field}.`,
              ),
            );
          }
        }
      }
    });
    if (
      !draft &&
      a.self_audit?.statistics_quotations_verified === "pass" &&
      hasUnverifiedEvidence
    ) {
      errors.push(
        issue(
          "SELF_AUDIT_VERIFICATION_CONTRADICTION",
          "/self_audit/statistics_quotations_verified",
          "The verification audit cannot pass while evidence remains unverified.",
        ),
      );
    }

    if (draft) {
      warnings.unshift(
        issue(
          "MIGRATED_DRAFT_NOT_CANONICAL",
          "/contract_status",
          "This migrated draft preserves legacy material but is not canonical Biopolitical v2.1 data.",
          "warning",
        ),
      );
    }
    return { valid: errors.length === 0, errors, warnings, idIndex };
  }

  function validateImport(raw) {
    const BIO = root.Jarbou3iBiopolitics;
    const validators = root.Jarbou3iBiopoliticsSchemaValidators;
    if (!BIO || !validators) {
      return {
        ok: false,
        state: "runtime_error",
        canonical: false,
        errors: [
          issue(
            "VALIDATOR_UNAVAILABLE",
            "/",
            "The Biopolitical schema validator is unavailable.",
          ),
        ],
        warnings: [],
      };
    }
    const routed = BIO.route(raw);
    if (!routed.supported) {
      return {
        ok: false,
        state: routed.kind,
        canonical: false,
        errors: [
          issue(
            "UNSUPPORTED_CONTRACT",
            "/schema_version",
            `Unsupported Biopolitical contract/schema: ${routed.analysis_contract || "missing"} / ${routed.schema_version || "missing"}.`,
          ),
        ],
        warnings: [],
      };
    }

    let candidate = raw;
    let state = routed.kind;
    if (routed.kind === "legacy") {
      candidate = BIO.migrateLegacy(raw);
      state = "migrated_draft";
    }
    const draft = state === "migrated_draft";
    const schemaValidator = draft ? validators.migratedDraft : validators.canonical;
    const schemaValid = schemaValidator(candidate);
    if (!schemaValid) {
      return {
        ok: false,
        state,
        canonical: false,
        errors: schemaIssues(schemaValidator.errors),
        warnings: [],
      };
    }
    const normalized = BIO.normalize(candidate);
    const semantic = semanticValidate(normalized, { draft });
    return {
      ok: semantic.valid,
      state,
      canonical: !draft && semantic.valid,
      analysis: semantic.valid ? normalized : null,
      errors: semantic.errors,
      warnings: semantic.warnings,
    };
  }

  root.Jarbou3iBiopoliticsIntegrity = Object.freeze({
    validateImport,
    semanticValidate,
    placeholderPattern,
  });
})(typeof window !== "undefined" ? window : globalThis);
