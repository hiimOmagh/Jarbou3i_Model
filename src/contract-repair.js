/* Jarbou3i Model — auditable, content-preserving contract-shape repair */
(function attachContractRepair(root) {
  "use strict";

  const CONFIDENCE = new Set(["high", "medium", "low"]);
  const isObject = (value) =>
    Boolean(value) && typeof value === "object" && !Array.isArray(value);
  const clone = (value) => JSON.parse(JSON.stringify(value));
  const pointerParts = (pointer) =>
    String(pointer || "")
      .split("/")
      .slice(1)
      .map((part) => part.replaceAll("~1", "/").replaceAll("~0", "~"));

  function ownerAtPointer(value, pointer) {
    return pointerParts(pointer).reduce(
      (current, key) => current?.[key],
      value,
    );
  }

  function quarantineUnknownProperties(
    value,
    repairs,
    quarantine,
    validate = root.Jarbou3iBiopoliticsSchemaValidators?.canonical,
  ) {
    if (typeof validate !== "function") return;
    for (let pass = 0; pass < 64; pass += 1) {
      validate(value);
      const extras = (validate.errors || []).filter(
        (error) => error.keyword === "additionalProperties",
      );
      if (!extras.length) return;
      let changed = false;
      for (const error of extras) {
        const property = error.params?.additionalProperty;
        const owner = ownerAtPointer(value, error.instancePath);
        if (
          !property ||
          !isObject(owner) ||
          !Object.prototype.hasOwnProperty.call(owner, property)
        ) {
          continue;
        }
        const path = `${error.instancePath || ""}/${String(property)
          .replaceAll("~", "~0")
          .replaceAll("/", "~1")}`;
        const originalValue = clone(owner[property]);
        delete owner[property];
        quarantine.push(
          Object.freeze({
            code: "UNKNOWN_PROPERTY_QUARANTINED",
            path: path || "/",
            value: originalValue,
            action: "preserved_in_import_audit",
            severity: "information",
          }),
        );
        repairs.push({
          code: "UNKNOWN_PROPERTY_QUARANTINED",
          path: path || "/",
          count: 1,
        });
        changed = true;
      }
      if (!changed) return;
    }
  }

  // Keywords that describe missing content; the draft fallback lists them as
  // completion gaps, so salvage leaves them alone.
  const COMPLETION_KEYWORDS = new Set(["required", "minLength", "minItems"]);
  // Composite keywords are always accompanied by a concrete child error.
  const COMPOSITE_KEYWORDS = new Set(["anyOf", "oneOf", "allOf", "if", "not"]);
  const PROTECTED_KEYS = new Set([
    "schema_version",
    "analysis_contract",
    "contract_status",
    "analysis_lens",
    "analysis_id",
    "language",
    "subject",
    "id",
  ]);
  const NUMERIC = /^-?\d+(\.\d+)?$/;
  const LANGUAGE_NAMES = {
    english: "en",
    anglais: "en",
    "الإنجليزية": "en",
    "الانجليزية": "en",
    french: "fr",
    "français": "fr",
    francais: "fr",
    "الفرنسية": "fr",
    arabic: "ar",
    arabe: "ar",
    "العربية": "ar",
  };

  // "en", "en-US", "English (US)", "français", "العربية" → a supported code.
  function languageCode(value) {
    const word = String(value ?? "").trim().toLowerCase().split(/[^\p{L}]+/u).find(Boolean) || "";
    if (["ar", "en", "fr"].includes(word)) return word;
    return Object.hasOwn(LANGUAGE_NAMES, word) ? LANGUAGE_NAMES[word] : undefined;
  }

  const ENGLISH_WORDS = new Set(["the", "and", "of", "to", "in", "is", "that", "for", "with", "are", "was", "by", "as", "on", "from", "this", "which", "be", "not", "its", "their"]);
  const FRENCH_WORDS = new Set(["le", "la", "les", "des", "du", "et", "est", "une", "un", "que", "qui", "dans", "pour", "par", "sur", "au", "aux", "pas", "ce", "ces", "sont", "leur", "leurs"]);

  // The language an analysis is actually written in, read from its prose
  // (values of three or more words) rather than from its "language" label.
  // Returns undefined when there is too little prose to tell.
  function detectLanguage(value) {
    const prose = [];
    (function collect(node) {
      if (typeof node === "string") {
        if (node.trim().split(/\s+/).length >= 3 && !/^https?:\/\//i.test(node.trim())) prose.push(node);
      } else if (Array.isArray(node)) node.forEach(collect);
      else if (node && typeof node === "object") Object.values(node).forEach(collect);
    })(value);
    const text = prose.join(" ");
    const arabic = (text.match(/\p{Script=Arabic}/gu) || []).length;
    const latin = (text.match(/[A-Za-zÀ-ÿ]/g) || []).length;
    if (arabic + latin < 200) return undefined;
    if (arabic > latin) return "ar";
    let english = 0;
    let french = 0;
    for (const word of text.toLowerCase().split(/[^a-zà-ÿ]+/)) {
      if (ENGLISH_WORDS.has(word)) english += 1;
      else if (FRENCH_WORDS.has(word)) french += 1;
    }
    if (english + french < 10) return undefined;
    if (english >= french * 2) return "en";
    if (french >= english * 2) return "fr";
    return undefined;
  }

  const OTHER_SCRIPT = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}\p{Script=Cyrillic}]/u;
  const LATIN_PHRASE = /[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ'’-]*(?:[\s,()]+[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ'’-]*)+/g;
  const LOWERCASE_WORD = /(?:^|[\s,()])[a-zà-ÿ][a-zà-ÿ'’-]{2,}/;

  // Paths of text that slips into another language: Chinese, Japanese,
  // Korean, or Cyrillic letters in any answer, and in an Arabic one a phrase of
  // Latin words with a lowercase word in it. Names ("EU DSC Gateway") and
  // one-word glosses ("biopower") pass. Source metadata may quote other
  // languages, and the placeholder record's text comes from the app.
  function foreignTextPaths(value, lang) {
    const found = [];
    (function visit(node, path) {
      if (typeof node === "string") {
        if (/^https?:\/\//i.test(node.trim())) return;
        const latinPhrase =
          lang === "ar" && (node.match(LATIN_PHRASE) || []).some((phrase) => LOWERCASE_WORD.test(phrase));
        if (OTHER_SCRIPT.test(node) || latinPhrase) found.push(path);
      } else if (Array.isArray(node)) node.forEach((item, index) => visit(item, `${path}/${index}`));
      else if (node && typeof node === "object" && !/placeholder/i.test(String(node.source_title || ""))) {
        for (const [key, item] of Object.entries(node)) {
          if (!key.startsWith("source_")) visit(item, `${path}/${key}`);
        }
      }
    })(value, "");
    return found;
  }

  // Pure format coercion; returns undefined when a judgment would be needed.
  function coerce(current, error) {
    if (error.keyword === "enum") {
      const allowed = error.params?.allowedValues || [];
      const normalized = String(current ?? "")
        .trim()
        .toLowerCase()
        .replace(/[\s-]+/g, "_");
      if (allowed.includes(normalized)) {
        return { value: normalized, code: "ENUM_FORMAT_NORMALIZED" };
      }
      const language = allowed.includes("en") ? languageCode(current) : undefined;
      return language && allowed.includes(language)
        ? { value: language, code: "LANGUAGE_NAME_NORMALIZED" }
        : undefined;
    }
    if (error.keyword !== "type") return undefined;
    const types = [error.params?.type].flat();
    if (current === null) {
      // An explicit null is an empty answer; the empty field becomes a listed gap.
      const empty = types.includes("string")
        ? ""
        : types.includes("array")
          ? []
          : types.includes("object")
            ? {}
            : undefined;
      return empty === undefined ? undefined : { value: empty, code: "NULL_TO_EMPTY" };
    }
    if (error.instancePath === "/subject" && typeof current === "string" && current.trim()) {
      return { value: { title: current }, code: "SUBJECT_TEXT_TO_TITLE" };
    }
    if (types.includes("array") && !Array.isArray(current)) {
      const entries = isObject(current) ? Object.entries(current) : [];
      if (entries.length && entries.every(([, item]) => isObject(item))) {
        return {
          value: entries.map(([key, item]) => (item.id ? item : { ...item, id: key })),
          code: "OBJECT_MAP_TO_ARRAY",
          count: entries.length,
        };
      }
      return { value: [current], code: "SCALAR_TO_ARRAY" };
    }
    if (types.includes("string")) {
      if (["number", "boolean"].includes(typeof current)) {
        return { value: String(current), code: "SCALAR_TO_STRING" };
      }
      if (
        Array.isArray(current) &&
        current.length &&
        current.every((item) => ["string", "number"].includes(typeof item))
      ) {
        return { value: current.join("; "), code: "ARRAY_TO_STRING" };
      }
    }
    if (types.includes("boolean") && /^(true|false)$/i.test(String(current).trim())) {
      return {
        value: String(current).trim().toLowerCase() === "true",
        code: "STRING_TO_BOOLEAN",
      };
    }
    if (
      (types.includes("integer") || types.includes("number")) &&
      typeof current === "string" &&
      NUMERIC.test(current.trim()) &&
      (types.includes("number") || Number.isInteger(Number(current)))
    ) {
      return { value: Number(current), code: "STRING_TO_NUMBER" };
    }
    return undefined;
  }

  // Resolves every schema error that is not a completion gap: format slips are
  // coerced, anything else is removed and preserved in the import audit so the
  // draft fallback reports it as a gap instead of rejecting the whole answer.
  function salvageSchemaErrors(value, validate, repairs, quarantine) {
    if (typeof validate !== "function") return;
    for (let pass = 0; pass < 64; pass += 1) {
      validate(value);
      const errors = (validate.errors || []).filter(
        (error) =>
          !COMPLETION_KEYWORDS.has(error.keyword) &&
          !COMPOSITE_KEYWORDS.has(error.keyword) &&
          error.keyword !== "additionalProperties" &&
          error.instancePath,
      );
      // Deepest and highest-index paths first so removals never shift a pending path.
      errors.sort((a, b) =>
        b.instancePath.localeCompare(a.instancePath, undefined, { numeric: true }),
      );
      let changed = false;
      const seen = new Set();
      for (const error of errors) {
        const path = error.instancePath;
        if (seen.has(path)) continue;
        seen.add(path);
        const parts = pointerParts(path);
        const key = parts.at(-1);
        const owner = parts.slice(0, -1).reduce((current, part) => current?.[part], value);
        if (!owner || typeof owner !== "object" || !(key in owner)) continue;
        const current = owner[key];
        const idKey = key === "id" || key === "analysis_id";
        // A null list entry is no record; it is quarantined, not made empty.
        // Several IDs in one list are not one ID; joining them would invent one.
        const coerced =
          (current === null && Array.isArray(owner)) ||
          (idKey && Array.isArray(current) && current.length !== 1)
            ? undefined
            : coerce(current, error);
        if (coerced) {
          owner[key] = coerced.value;
          repairs.push({ code: coerced.code, path, count: coerced.count || 1 });
          changed = true;
          continue;
        }
        // An ID of the wrong type identifies nothing; it is quarantined and
        // regenerated. Other identity values are never removed.
        const unusableId = error.keyword === "type" && idKey;
        if (PROTECTED_KEYS.has(key) && !unusableId) continue;
        quarantine.push(
          Object.freeze({
            code: "INVALID_VALUE_QUARANTINED",
            path,
            value: clone(current ?? null),
            reason: `${error.keyword}: ${error.message || "invalid"}`,
            action: "preserved_in_import_audit",
            severity: "information",
          }),
        );
        repairs.push({ code: "INVALID_VALUE_QUARANTINED", path, count: 1 });
        if (Array.isArray(owner)) owner.splice(Number(key), 1);
        else delete owner[key];
        changed = true;
      }
      if (!changed) return;
    }
  }

  const LANGUAGES = ["ar", "en", "fr"];
  const MODES = ["simple", "focused", "expert", "research"];
  const SUBJECT_KEYS = ["title", "context", "research_question", "executive_finding"];
  const filled = (value) => typeof value === "string" && value.trim();

  // Envelope metadata is not analysis; like the interchange compiler, it comes
  // from the request so that missing metadata never blocks an import.
  function fillEnvelope(value, options, repairs) {
    const fill = (key, fallback) => {
      value[key] = fallback;
      repairs.push({ code: "ENVELOPE_METADATA_FILLED", path: `/${key}`, value: fallback, count: 1 });
    };
    if (!LANGUAGES.includes(value.language) && LANGUAGES.includes(options.language)) {
      fill("language", options.language);
    }
    if (!MODES.includes(value.model_mode) && MODES.includes(options.mode)) fill("model_mode", options.mode);
    if (!filled(value.generated_at)) fill("generated_at", new Date().toISOString());
    if (!filled(value.analysis_id)) fill("analysis_id", `ai-analysis-${value.generated_at.slice(0, 10)}`);
  }

  // Imports any canonical-shaped Biopolitical candidate: canonical when salvage
  // satisfies the contract, otherwise a reviewable draft whose remaining
  // diagnostics are listed for completion. Publication gates are unchanged.
  function salvageBiopolitical(candidate, options = {}) {
    const validators = root.Jarbou3iBiopoliticsSchemaValidators;
    const integrity = root.Jarbou3iBiopoliticsIntegrity;
    const interchange = root.Jarbou3iAiInterchange;
    const repairs = [];
    const quarantine = [];
    const value = clone(candidate);
    salvageSchemaErrors(value, validators?.canonical, repairs, quarantine);
    // After salvage, so records that salvage reshaped also receive an ID.
    interchange?.generateMissingIds?.(value, { transformations: repairs });
    // Map keys kept as IDs can be unknown properties of fixed-set entries.
    quarantineUnknownProperties(value, repairs, quarantine);
    fillEnvelope(value, options, repairs);
    const canonical = integrity.validateImport(value);
    if (canonical.ok || canonical.state !== "canonical") {
      return { value, validation: canonical, candidate: value, diagnostics: [], repairs, quarantine };
    }
    const diagnostics = canonical.errors;
    const draft = interchange.asReviewableDraft(value, diagnostics, options);
    salvageSchemaErrors(draft, validators?.generatedDraft, repairs, quarantine);
    // The draft keeps the subject shape; a missing part is an empty, listed gap.
    if (draft.subject === undefined) draft.subject = {};
    if (isObject(draft.subject)) {
      for (const key of SUBJECT_KEYS) draft.subject[key] ??= "";
    }
    quarantineUnknownProperties(draft, repairs, quarantine, validators?.generatedDraft);
    return {
      value: draft,
      validation: integrity.validateImport(draft),
      candidate: value,
      diagnostics,
      repairs,
      quarantine,
    };
  }

  function mappedCollection(value, path, repairs) {
    if (!isObject(value)) return value;
    const entries = Object.entries(value);
    if (!entries.length || entries.some(([, item]) => !isObject(item))) return value;
    repairs.push({
      code: "OBJECT_MAP_TO_ARRAY",
      path,
      count: entries.length,
    });
    return entries.map(([id, item]) => ({ id: item.id || id, ...item }));
  }

  function wrapStringArray(owner, key, path, repairs) {
    if (!owner || typeof owner[key] !== "string") return;
    owner[key] = [owner[key]];
    repairs.push({ code: "SCALAR_TO_ARRAY", path, count: 1 });
  }

  function repairBiopolitical(raw) {
    if (!isObject(raw))
      return {
        value: raw,
        repairs: Object.freeze([]),
        quarantine: Object.freeze([]),
      };
    if (
      raw.analysis_lens !== "biopolitical" ||
      raw.analysis_contract !== "biopolitical-training-map-v2" ||
      raw.schema_version !== "2.1.0"
    ) {
      return {
        value: raw,
        repairs: Object.freeze([]),
        quarantine: Object.freeze([]),
      };
    }
    const value = clone(raw);
    const repairs = [];
    const quarantine = [];

    for (const key of [
      "international_comparison",
      "theoretical_comparison",
      "human_functions",
    ]) {
      value[key] = mappedCollection(value[key], `/${key}`, repairs);
    }

    (Array.isArray(value.international_comparison)
      ? value.international_comparison
      : []
    ).forEach((item, index) =>
      wrapStringArray(
        item,
        "transfer_limits",
        `/international_comparison/${index}/transfer_limits`,
        repairs,
      ),
    );

    const regimes = value.meaning_systems?.regimes_of_truth;
    (Array.isArray(regimes) ? regimes : []).forEach((item, index) =>
      wrapStringArray(
        item,
        "excluded_knowledge",
        `/meaning_systems/regimes_of_truth/${index}/excluded_knowledge`,
        repairs,
      ),
    );

    const actors = value.power_map?.actors;
    (Array.isArray(actors) ? actors : []).forEach((actor, index) => {
      if (
        !isObject(actor) ||
        actor.confidence !== undefined ||
        !Array.isArray(actor.accountability) ||
        !CONFIDENCE.has(actor.accountability.at(-1))
      ) {
        return;
      }
      actor.confidence = actor.accountability.pop();
      repairs.push({
        code: "MISPLACED_CONFIDENCE_RECOVERED",
        path: `/power_map/actors/${index}/confidence`,
        count: 1,
      });
    });

    quarantineUnknownProperties(value, repairs, quarantine);
    return {
      value,
      repairs: Object.freeze(repairs.map(Object.freeze)),
      quarantine: Object.freeze(quarantine),
    };
  }

  root.Jarbou3iContractRepair = Object.freeze({
    languageCode,
    detectLanguage,
    foreignTextPaths,
    repairBiopolitical,
    salvageBiopolitical,
    salvageSchemaErrors,
  });
})(typeof window !== "undefined" ? window : globalThis);
