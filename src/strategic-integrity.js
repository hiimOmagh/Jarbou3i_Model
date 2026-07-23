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

export { semanticValidate as validateStrategicSemantics };
