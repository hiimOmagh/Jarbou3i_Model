/* Immutable shared contract for independently evolvable analytical lenses. */

const REQUIRED_METHODS = Object.freeze([
  "buildPrompt",
  "createSample",
  "renderEngineNav",
  "renderReview",
]);

export const LENS_CAPABILITIES = Object.freeze({
  PROMPT: "prompt",
  SAMPLE: "sample",
  ENGINE_NAVIGATION: "engine-navigation",
  REVIEW: "review",
});

const METHOD_CAPABILITY = Object.freeze({
  buildPrompt: LENS_CAPABILITIES.PROMPT,
  createSample: LENS_CAPABILITIES.SAMPLE,
  renderEngineNav: LENS_CAPABILITIES.ENGINE_NAVIGATION,
  renderReview: LENS_CAPABILITIES.REVIEW,
});

const stableId = (value) => /^[a-z][a-z0-9-]*$/.test(value || "");

function createManifest(definition) {
  if (!stableId(definition.id)) {
    throw new TypeError("Lens adapter id must be a stable lowercase identifier.");
  }
  if (!stableId(definition.contractId)) {
    throw new TypeError(`Lens adapter ${definition.id} requires a stable contract id.`);
  }
  if (!String(definition.schemaVersion || "").trim()) {
    throw new TypeError(`Lens adapter ${definition.id} requires a schema version.`);
  }
  if (!Number.isInteger(definition.modelSectionCount) || definition.modelSectionCount < 1) {
    throw new TypeError(`Lens adapter ${definition.id} requires a positive section count.`);
  }
  if (!stableId(definition.accent)) {
    throw new TypeError(`Lens adapter ${definition.id} requires a stable accent token.`);
  }

  if (definition.capabilities !== undefined && !Array.isArray(definition.capabilities)) {
    throw new TypeError(`Lens adapter ${definition.id} capabilities must be an array.`);
  }
  const capabilities = Object.freeze([
    ...new Set(
      definition.capabilities || REQUIRED_METHODS.map((method) => METHOD_CAPABILITY[method]),
    ),
  ]);
  if (capabilities.some((capability) => !stableId(capability))) {
    throw new TypeError(`Lens adapter ${definition.id} has an invalid capability.`);
  }
  for (const required of Object.values(METHOD_CAPABILITY)) {
    if (!capabilities.includes(required)) {
      throw new TypeError(`Lens adapter ${definition.id} does not declare ${required}.`);
    }
  }
  return Object.freeze({
    kind: "analysis-lens",
    id: definition.id,
    contractId: definition.contractId,
    schemaVersion: String(definition.schemaVersion),
    modelSectionCount: definition.modelSectionCount,
    accent: definition.accent,
    capabilities,
  });
}

export function defineLensAdapter(definition) {
  if (!definition || typeof definition !== "object") {
    throw new TypeError("Lens adapter definition must be an object.");
  }
  for (const method of REQUIRED_METHODS) {
    if (typeof definition[method] !== "function") {
      throw new TypeError(`Lens adapter ${definition.id || "unknown"} is missing ${method}().`);
    }
  }

  const manifest = createManifest(definition);
  const services = Object.freeze(
    Object.fromEntries(REQUIRED_METHODS.map((method) => [method, definition[method]])),
  );
  return Object.freeze({
    ...definition,
    ...manifest,
    manifest,
    services,
    supports(capability) {
      return manifest.capabilities.includes(capability);
    },
  });
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
    manifest(id) {
      return this.get(id).manifest;
    },
    manifests() {
      return Object.freeze([...entries.values()].map((adapter) => adapter.manifest));
    },
    supports(id, capability) {
      return this.get(id).supports(capability);
    },
    resolveAnalysisLens(analysis, fallbackId) {
      const candidate = analysis?.analysis_lens || analysis?.analysisLens;
      return entries.has(candidate) ? candidate : fallbackId;
    },
    createEnvelope(analysis, fallbackId) {
      const lensId = this.resolveAnalysisLens(analysis, fallbackId);
      if (!entries.has(lensId)) throw new TypeError("Analysis lens cannot be resolved.");
      const manifest = this.manifest(lensId);
      return Object.freeze({
        analysisId: String(analysis?.analysis_id || analysis?.analysisId || ""),
        lensId,
        contractId: manifest.contractId,
        language: String(analysis?.language || ""),
        schemaVersion: String(analysis?.schema_version || analysis?.schemaVersion || ""),
        subject: analysis?.subject || null,
        canonicalPayload: analysis,
      });
    },
  });
}

export const LENS_ADAPTER_METHODS = REQUIRED_METHODS;
