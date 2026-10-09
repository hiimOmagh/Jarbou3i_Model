/* Canonical Strategic v1.1 schema and semantic integrity gate. */

const asArray = (value) => (Array.isArray(value) ? value : []);
const clean = (value) => String(value ?? "").trim();

function issue(code, path, message, severity = "error", details = {}) {
  return { code, path, message, severity, ...details };
}

function schemaIssues(errors) {
  return asArray(errors).map((error) => issue(
    `SCHEMA_${clean(error.keyword).toUpperCase()}`,
    error.instancePath || "/",
    `${error.instancePath || "/"} ${error.message || "is invalid"}`,
    "error",
    { keyword: error.keyword, params: error.params },
  ));
}

function semanticValidate(analysis) {
  const errors = [];
  const warnings = [];
  const idIndex = new Map();
  const collections = [
    ["interest", "/interests", analysis.interests],
    ["actor", "/actors", analysis.actors],
    ["tool", "/tools", analysis.tools],
    ["narrative", "/narrative", analysis.narrative],
    ["result", "/results", analysis.results],
    ["feedback", "/feedback", analysis.feedback],
    ["contradiction", "/contradictions/items", analysis.contradictions?.items],
    ["scenario", "/scenarios/items", analysis.scenarios?.items],
    ["evidence", "/evidence/items", analysis.evidence?.items],
    ["assumption", "/assumptions/items", analysis.assumptions?.items],
  ];
  for (const [type, basePath, records] of collections) {
    asArray(records).forEach((record, index) => {
      const id = clean(record?.id);
      if (!id) return;
      const path = `${basePath}/${index}/id`;
      if (idIndex.has(id)) {
        errors.push(issue(
          "DUPLICATE_GLOBAL_ID",
          path,
          `ID ${id} is already used at ${idIndex.get(id).path}.`,
          "error",
          { id, firstPath: idIndex.get(id).path },
        ));
      } else {
        idIndex.set(id, { type, path });
      }
    });
  }
  asArray(analysis.links).forEach((link, index) => {
    for (const endpoint of ["from", "to"]) {
      const id = clean(link?.[endpoint]);
      if (!idIndex.has(id)) {
        errors.push(issue(
          "BROKEN_REFERENCE",
          `/links/${index}/${endpoint}`,
          `Reference ${id || "(empty)"} does not resolve to a canonical record.`,
          "error",
          { reference: id },
        ));
      }
    }
  });
  asArray(analysis.evidence?.items).forEach((record, index) => {
    const url = clean(record?.source_url);
    if (!url) return;
    try {
      const parsed = new URL(url);
      if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error("unsupported protocol");
    } catch {
      warnings.push(issue(
        "INVALID_SOURCE_URL",
        `/evidence/items/${index}/source_url`,
        "Source URL must be an absolute HTTP(S) URL.",
        "warning",
      ));
    }
  });
  return { valid: errors.length === 0, errors, warnings, idIndex };
}

export function validateStrategicAnalysis(raw) {
  const validator = globalThis.Jarbou3iStrategicSchemaValidators?.canonical;
  if (typeof validator !== "function") {
    return {
      ok: false,
      canonical: false,
      analysis: null,
      errors: [issue("VALIDATOR_UNAVAILABLE", "/", "The Strategic schema validator is unavailable.")],
      warnings: [],
    };
  }
  if (!validator(raw)) {
    return {
      ok: false,
      canonical: false,
      analysis: null,
      errors: schemaIssues(validator.errors),
      warnings: [],
    };
  }
  const semantic = semanticValidate(raw);
  return {
    ok: semantic.valid,
    canonical: semantic.valid,
    analysis: semantic.valid ? structuredClone(raw) : null,
    errors: semantic.errors,
    warnings: semantic.warnings,
  };
}

const RECORD_COLLECTIONS = [
  ["interests", "I"],
  ["actors", "A"],
  ["tools", "T"],
  ["narrative", "N"],
  ["results", "R"],
  ["feedback", "F"],
  ["contradictions.items", "C"],
  ["scenarios.items", "S"],
  ["evidence.items", "E"],
  ["assumptions.items", "AS"],
];
const COMPLETION_KEYWORDS = new Set(["required", "minLength", "minItems"]);
// Missing identity or subject cannot be represented as a draft gap.
const IDENTITY_PATH = /^\/(schema_version|analysis_lens|subject)$|\/id$/;

// Imports any Strategic result: canonical when format salvage satisfies the
// contract, otherwise a reviewable draft whose remaining gaps are listed.
const SECTIONS = ["contradictions", "scenarios", "evidence", "assumptions"];
const isRecord = (value) => Boolean(value) && typeof value === "object" && !Array.isArray(value);

// A section holds only `items`. Its records may arrive as a bare list, as a
// list under another name ({"records": [...]}), or as an ID-keyed map; they
// are moved into `items` before validation so no record is hidden from review.
// Anything else in a section is preserved in the import audit, not left unseen.
export function reshapeStrategicSections(value) {
  const repairs = [];
  const quarantine = [];
  // Links are a bare list; written like a section ({"items": [...]}), the
  // list is taken out of it.
  const links = value?.links;
  if (isRecord(links) && Object.keys(links).length === 1 && Array.isArray(links.items)) {
    value.links = links.items;
    repairs.push({ code: "ITEMS_TO_LIST", path: "/links", count: links.items.length });
  }
  for (const key of SECTIONS) {
    let section = value?.[key];
    if (Array.isArray(section)) {
      value[key] = { items: section };
      repairs.push({ code: "SECTION_LIST_TO_ITEMS", path: `/${key}`, count: section.length });
      continue;
    }
    if (!isRecord(section)) continue;
    const others = Object.entries(section).filter(([name]) => name !== "items");
    if (!others.length) continue;
    section = value[key] = { ...section };
    if (section.items === undefined || (Array.isArray(section.items) && !section.items.length)) {
      const lists = others.filter(([, item]) => Array.isArray(item) && item.length && item.every(isRecord));
      const records = others.filter(([, item]) => isRecord(item));
      if (lists.length === 1 && !records.length) {
        const [name, items] = lists[0];
        section.items = items;
        delete section[name];
        repairs.push({ code: "SECTION_LIST_TO_ITEMS", path: `/${key}/${name}`, count: items.length });
      } else if (records.length) {
        section.items = records.map(([id, item]) => (clean(item.id) ? item : { ...item, id }));
        records.forEach(([id]) => delete section[id]);
        repairs.push({ code: "OBJECT_MAP_TO_ARRAY", path: `/${key}`, count: records.length });
      }
    }
    for (const name of Object.keys(section).filter((name) => name !== "items")) {
      const path = `/${key}/${name.replaceAll("~", "~0").replaceAll("/", "~1")}`;
      quarantine.push({ code: "UNKNOWN_PROPERTY_QUARANTINED", path, value: section[name], action: "preserved_in_import_audit", severity: "information" });
      repairs.push({ code: "UNKNOWN_PROPERTY_QUARANTINED", path, count: 1 });
      delete section[name];
    }
  }
  return { repairs, quarantine };
}

// Schema errors split into completion gaps a draft may keep and errors that
// block it: anything other than a missing or empty value, or a missing identity.
function draftSchemaIssues(validator, value) {
  validator(value);
  const schemaErrors = schemaIssues(validator.errors).filter(
    (error) => !["anyOf", "oneOf", "allOf", "if", "not"].includes(error.keyword),
  );
  const blocking = schemaErrors.filter(
    (error) => !COMPLETION_KEYWORDS.has(error.keyword) || IDENTITY_PATH.test(
      error.keyword === "required"
        ? `${error.path.replace(/\/$/, "")}/${error.params?.missingProperty}`
        : error.path,
    ),
  );
  return { schemaErrors, blocking };
}

// Checks an edited Strategic analysis as it stands, without salvage: it may be
// saved as a draft while its only problems are completion gaps.
export function validateStrategicDraft(raw) {
  const result = validateStrategicAnalysis(raw);
  const validator = globalThis.Jarbou3iStrategicSchemaValidators?.canonical;
  if (result.ok || typeof validator !== "function") return result;
  const { schemaErrors, blocking } = draftSchemaIssues(validator, raw);
  if (blocking.length) return { ...result, errors: blocking };
  const semantic = semanticValidate(raw);
  return { ok: true, canonical: false, state: "strategic_draft", analysis: structuredClone(raw), errors: [], warnings: [...schemaErrors, ...semantic.errors, ...semantic.warnings] };
}

export function salvageStrategicAnalysis(raw) {
  const value = structuredClone(raw && typeof raw === "object" && !Array.isArray(raw) ? raw : {});
  const { repairs, quarantine } = reshapeStrategicSections(value);
  // Strategic has one contract; a 1.x version is that contract written loosely.
  const version = ["string", "number"].includes(typeof value.schema_version) ? clean(value.schema_version) : "";
  if (version !== "1.1.0" && /^v?1(\.\d+){0,2}$/i.test(version)) {
    value.schema_version = "1.1.0";
    repairs.push({ code: "SCHEMA_VERSION_NORMALIZED", path: "/schema_version", value: version, count: 1 });
  }
  const validator = globalThis.Jarbou3iStrategicSchemaValidators?.canonical;
  globalThis.Jarbou3iContractRepair?.salvageSchemaErrors(value, validator, repairs, quarantine);
  // A quarantined section keeps its empty shape, as normalization defaults it.
  for (const key of SECTIONS) {
    value[key] ??= { items: [] };
    if (isRecord(value[key])) value[key].items ??= [];
  }
  // After salvage, so records that salvage reshaped also receive an ID.
  for (const [path, prefix] of RECORD_COLLECTIONS) {
    const records = asArray(path.split(".").reduce((node, key) => node?.[key], value));
    const used = new Set(records.map((record) => clean(record?.id)).filter(Boolean));
    let next = 1;
    records.forEach((record, index) => {
      if (!record || typeof record !== "object" || clean(record.id)) return;
      while (used.has(`${prefix}${next}`)) next += 1;
      record.id = `${prefix}${next}`;
      used.add(record.id);
      repairs.push({ code: "DETERMINISTIC_ID_GENERATED", path: `/${path.replace(".", "/")}/${index}/id`, value: record.id, count: 1 });
    });
  }
  const result = validateStrategicAnalysis(value);
  if (result.ok) return { ...result, repairs, quarantine, diagnostics: [] };
  if (typeof validator !== "function") return { ...result, repairs, quarantine, diagnostics: [] };
  const { schemaErrors, blocking } = draftSchemaIssues(validator, value);
  if (blocking.length) return { ...result, errors: blocking, repairs, quarantine, diagnostics: [] };
  const semantic = semanticValidate(value);
  const diagnostics = [...schemaErrors, ...semantic.errors];
  return {
    ok: true,
    canonical: false,
    state: "strategic_draft",
    analysis: value,
    errors: [],
    warnings: [...diagnostics, ...semantic.warnings],
    repairs,
    quarantine,
    diagnostics,
  };
}

export { semanticValidate as validateStrategicSemantics };
