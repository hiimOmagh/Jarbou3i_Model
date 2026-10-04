# Architecture

Jarbou3i Model is one dual-lens analytical workbench delivered as a static,
dependency-light browser application: native ES modules, no framework, no build
step for the app itself, and no network dependency or tracking. Strategic and
Biopolitical analysis stay independent canonical contracts behind a shared
platform kernel. The interface shares navigation, inspection, reference
resolution, relationship exploration, persistence, localization, accessibility,
and export infrastructure without collapsing either method into the other.

```text
index.html -> src/app.js (composition root)
  -> Platform runtime: state, settings, localization, render regions, diagnostics
  -> Strategic lens adapter    -> Strategic v1.1 services
  -> Biopolitical lens adapter -> Biopolitical v2.1 services
  -> Core services: interchange, results, evidence, workspace, review
  -> Capability-gated modules loaded on demand
```

## Lens contracts

Every lens publishes an immutable manifest with:

- stable lens and contract identifiers;
- schema version and analytical section count;
- a semantic accent token;
- discoverable capabilities;
- prompt, sample, engine-navigation, and review services.

`src/core/lens-registry.js` validates these fields and rejects unknown,
incomplete, or duplicate adapters. Imported analysis is wrapped in a read-only
envelope holding only cross-lens identity fields (analysis ID, lens ID,
language, schema version, subject) and the untouched canonical payload. The
envelope never copies, edits, normalizes, or synthesizes analytical content.

## Runtime

`index.html` loads one module, `src/app.js`, which imports the browser contracts
in deterministic dependency order and calls `createPlatformRuntime`
(`src/core/platform-runtime.js`). The runtime assembles:

- the lens registry;
- observable presentation state with transactional patches and immutable snapshots;
- conservative settings persistence (`jarbou3i-model-settings`) and
  analysis-scoped saved-view lists;
- one localization resolver with explicit language fallback and lens-specific lookup;
- named synchronous render regions: `shell`, `workflow`, `engine`, `review`;
- bounded performance measurements (capacity 160);
- revision-keyed memoization and deduplicated scheduled tasks.

`window.Jarbou3iPlatformDiagnostics.inspect()` exposes read-only diagnostics.
Measurements stay in memory and are never transmitted or persisted. Visible
rendering stays synchronous to avoid focus and interaction races.

Three heavy features load only when a view needs them, with a retry on failure:
the Biopolitical graph (`src/biopolitics-graph.js`), the relationship explorer
(`src/relationship-explorer.js` with its stylesheet `src/relationship-explorer.css`), and the Biopolitical report renderer
(`src/biopolitical-report.js`).

## Module map

| Area | Modules |
|---|---|
| Composition and kernel | `src/app.js`, `src/core/platform-runtime.js`, `lens-registry.js`, `platform-state.js`, `persistence.js`, `localization.js`, `render-regions.js`, `performance.js` |
| Shell | `src/features/application-shell.js`, `src/core/shell-navigation.js`, `shell-preferences.js` |
| Lenses | `src/lenses/strategic/adapter.js`, `src/lenses/biopolitical/adapter.js`, `src/biopolitics.js`, `src/biopolitics-sample-i18n.js` |
| Contracts and validation | `src/strategic-schema-validator.js`, `src/biopolitics-schema-validator.js`, `src/strategic-integrity.js`, `src/biopolitics-integrity.js`, `src/core/provenance.js` |
| AI interchange and import | `src/ai-interchange.js`, `src/json-parser.js`, `src/contract-repair.js` |
| Results | `src/core/results-orientation.js`, `results-explanation.js`, `results-inspection.js`, `src/reference-ui.js` |
| Evidence intelligence | `src/core/relationship-intelligence.js`, `evidence-intelligence.js`, `evidence-traceability.js`, `evidence-review-plan.js` |
| Workspace | `src/core/workspace-contract.js`, `workspace-storage.js`, `storage-health.js`, `canonical-editor.js`, `revision-history.js`, `recovery-journal.js` |
| Review | `src/core/review-ledger.js`, `resolution-transaction.js` |
| On demand | `src/biopolitics-graph.js`, `src/relationship-explorer.js`, `src/biopolitical-report.js` |

Feature behavior is described in [Results and Evidence](features/results-and-evidence.md),
[Workspace](features/workspace.md), and the
[AI Interchange Contract](ai-interchange-contract-v1.md).

## Invariants

- Strategic schema `1.1.0` is authoritative for Strategic analyses.
- Biopolitical schema `2.1.0` with contract `biopolitical-training-map-v2` is
  authoritative for canonical Biopolitical analyses.
- Imported lens identity is authoritative.
- Platform state, diagnostics, and presentation preferences never enter or alter
  canonical analysis payloads.
- Both lenses pass the same language, theme, accessibility, responsive, import,
  export, and evidence gates.
- Arabic, English, French, light, dark, desktop, tablet, phone, keyboard, reflow,
  and export contracts are release gates, not optional polish.
