/* Shared platform contract for independent analytical lenses. */

const REQUIRED_METHODS = Object.freeze([
  "buildPrompt",
  "createSample",
  "renderEngineNav",
  "renderReview",
]);

export function defineLensAdapter(definition) {
  if (!definition || typeof definition !== "object") {
    throw new TypeError("Lens adapter definition must be an object.");
  }
  if (!/^[a-z][a-z0-9-]*$/.test(definition.id || "")) {
    throw new TypeError("Lens adapter id must be a stable lowercase identifier.");
  }
  for (const method of REQUIRED_METHODS) {
    if (typeof definition[method] !== "function") {
      throw new TypeError(`Lens adapter ${definition.id} is missing ${method}().`);
    }
  }
  return Object.freeze({ ...definition });
}

export function createLensRegistry(adapters) {
  const entries = new Map();
  for (const adapter of adapters || []) {
    const validated = defineLensAdapter(adapter);
    if (entries.has(validated.id)) {
      throw new TypeError(`Duplicate lens adapter: ${validated.id}.`);
    }
    entries.set(validated.id, validated);
  }
  if (!entries.size) throw new TypeError("At least one lens adapter is required.");

  return Object.freeze({
    has(id) {
      return entries.has(id);
    },
    get(id) {
      const adapter = entries.get(id);
      if (!adapter) throw new TypeError(`Unknown analysis lens: ${id}.`);
      return adapter;
    },
    ids() {
      return Object.freeze([...entries.keys()]);
    },
    resolveAnalysisLens(analysis, fallbackId) {
      const candidate = analysis?.analysis_lens || analysis?.analysisLens;
      return entries.has(candidate) ? candidate : fallbackId;
    },
    createEnvelope(analysis, fallbackId) {
      const lensId = this.resolveAnalysisLens(analysis, fallbackId);
      if (!entries.has(lensId)) throw new TypeError("Analysis lens cannot be resolved.");
      return Object.freeze({
        analysisId: String(analysis?.analysis_id || analysis?.analysisId || ""),
        lensId,
        language: String(analysis?.language || ""),
        schemaVersion: String(analysis?.schema_version || analysis?.schemaVersion || ""),
        subject: analysis?.subject || null,
        canonicalPayload: analysis,
      });
    },
  });
}

export const LENS_ADAPTER_METHODS = REQUIRED_METHODS;
