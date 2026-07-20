# Phase 1 — Platform Architecture, Lens Contracts, and Performance Foundations

Release: `2.1.0-alpha.14`

## Decision

Jarbou3i Model remains a dependency-light static application. Phase 1 introduces a modular platform kernel beneath the existing interface instead of rewriting the product in a framework. Strategic and Biopolitical analysis remain independent domain contracts connected through narrow adapters.

```text
Application shell
  -> Platform runtime
     -> Shared state, settings, localization, rendering, diagnostics
     -> Strategic lens adapter -> Strategic v1.1 services
     -> Biopolitical lens adapter -> Biopolitical v2.1 services
```

## Contract boundary

Every lens publishes an immutable manifest containing:

- stable lens and contract identifiers;
- schema version and analytical section count;
- a semantic accent token;
- discoverable capabilities;
- prompt, sample, engine-navigation, and review services.

The registry validates these fields, rejects duplicate or incomplete adapters, and wraps imported analysis in a read-only envelope without copying or mutating the canonical payload.

## Runtime boundary

`src/core/platform-runtime.js` is the only composition root. It assembles:

- the lens registry;
- observable presentation state;
- conservative settings persistence;
- cross-lens localization with explicit fallback;
- deterministic named render regions;
- bounded performance measurements;
- revision-keyed memoization;
- deduplicated scheduled tasks.

The browser exposes read-only diagnostics through `window.Jarbou3iPlatformDiagnostics.inspect()`. Measurements remain in memory, are capped at 160 entries in the application, and are never transmitted or persisted.

## Performance foundation

Phase 1 measures boot initialization and each named render region (`shell`, `workflow`, `engine`, and `review`). The current user-visible rendering remains synchronous to avoid introducing focus or interaction races. The scheduler and revision cache are now tested foundations for later selective rendering, graph projection caching, and safe feature initialization.

This phase intentionally does not claim bundle-size reduction. Large feature extraction and capability-gated lazy loading require browser-matrix verification and belong to the next performance step after this foundation is accepted.

## Preserved invariants

- Strategic v1.1 and Biopolitical v2.1 canonical schemas are unchanged.
- Prompt content, sample content, import normalization, evidence rules, scores, publication gates, graph projections, and standalone reports are unchanged.
- Arabic, English, French, light, dark, desktop, tablet, phone, keyboard, reflow, and export contracts remain authoritative.
- Platform telemetry never contains or changes canonical analysis payloads.
- No network dependency, user tracking, framework migration, or build pipeline is added.

## Verification

```powershell
npm ci
npm run test:ci:no-browser
npx playwright install --with-deps
npm run test:browser:core
npm run test:browser:hosted
npm run test:browser:visual-audit
```

For a deployed target, run the separate public-surface gate:

```powershell
$env:PLAYWRIGHT_BASE_URL="https://your-deployment.example/"
npm run test:browser:deployed
Remove-Item Env:PLAYWRIGHT_BASE_URL
```
