# Shared Platform Architecture — v2.1

## Decision

Jarbou3i Model is one dual-lens analytical workbench. Strategic and Biopolitical analysis remain independent canonical contracts behind a shared platform kernel. The interface may reuse navigation, inspectors, reference resolution, relationship exploration, persistence, localization, accessibility, and export infrastructure without collapsing either analytical method into the other.

## Platform boundary

The shared envelope contains only stable cross-lens identity fields: analysis ID, lens ID, language, schema version, subject, and the untouched canonical payload. It does not normalize one lens into the other.

Each registered lens adapter provides prompt creation, sample creation, model navigation rendering, and result rendering. The initial adapters retain the complete existing Strategic six-layer and Biopolitical nine-pillar implementations. Later phases may add validation, readiness, relationship, judgment, and export ports only after parity gates prove that the current contracts remain unchanged.

## Runtime

The browser loads one native module entry point. Existing browser contracts are imported in deterministic dependency order, then exposed through the platform lens registry.

Alpha 2 adds four shared services without changing either canonical lens contract:

- observable presentation state with transactional patches and immutable snapshots;
- conservative JSON persistence with the existing settings key and compatible analysis-scoped saved-view keys;
- one localization resolver with explicit language fallback and lens-specific lookup;
- named synchronous render regions for shell, workflow, engine, and review.

The regions currently preserve eager visible behavior. They are the boundary for later selector-driven invalidation, feature-level dynamic imports, and incremental rendering.

## Invariants

- Strategic schema version `1.1.0` remains authoritative for Strategic analyses.
- Biopolitical schema version `2.1.0` and contract `biopolitical-training-map-v2` remain authoritative for canonical Biopolitical analyses.
- Imported lens identity remains authoritative.
- The platform envelope never copies, edits, or synthesizes canonical analytical content.
- Unknown, incomplete, or duplicate lens adapters are rejected.
- Both lenses must pass the same language, theme, accessibility, responsive, import, export, and evidence gates.
- Visual redesign begins only after architecture parity passes.

## Current module boundary

```text
src/core/lens-registry.js
src/core/platform-state.js
src/core/persistence.js
src/core/localization.js
src/core/render-regions.js
src/lenses/strategic/adapter.js
src/lenses/biopolitical/adapter.js
src/app.js
```

`src/app.js` remains the temporary composition root. Shared state, persistence, localization, and render-region contracts now sit behind stable modules. Subsequent phases can extract reference indexing, inspectors, feature renderers, and selective invalidation in measured increments.
