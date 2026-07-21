# Phase 4, Slice 4 — Evidence Review Queue and Resolution Planning

Release: `2.1.0-alpha.33`

## Outcome

This slice turns the existing relationship, provenance, source-cluster, and traceability diagnostics into one deterministic review queue. It operationalizes the completed evidence-intelligence chain without adding an analytical judgment layer.

## Deterministic ordering

Every task is derived from an existing authored-data diagnostic and ordered by dependency:

1. **Resolve references** — duplicate identifiers, unresolved relationship endpoints, and unresolved evidence references.
2. **Verify provenance** — missing source identity, untraceable sources, and title-only identity.
3. **Strengthen coverage** — uncited evidence, missing counter-evidence, missing source dates, exact-source concentration, unsupported declared high confidence, and isolated records.

Stable task identifiers and sequence numbers are presentation metadata. They are not severity scores, confidence estimates, truth probabilities, or publication decisions. The queue does not infer source quality, factual correctness, or whether a missing item is relevant to the underlying question.

## Review navigation and export

The Inspection workspace presents the queue in English, Arabic RTL, and French. Resolvable targets open the existing canonical inspector; unresolved targets retain their authored owner and path context without creating a missing record.

The separate `jarbou3i-evidence-review-plan-v1` export identifies itself as derived and non-canonical. It explicitly states `completion_validates_conclusions: false`, contains no raw analysis, and cannot be re-imported as canonical analysis. The existing `jarbou3i-evidence-intelligence-v1` export is unchanged.

## Reliability maintenance

The WebKit explanation reflow test now invokes standards-based DOM scrolling directly instead of Playwright's actionability-scrolling helper. This addresses the retry-recovered Alpha.32 CI flake without altering application behavior or weakening any assertion.

## Compatibility boundary

Strategic v1.1, Biopolitical schema `2.1.0`, `biopolitical-training-map-v2`, canonical JSON, reports, imports, validation, scoring, readiness, publication gates, prompts, relationship semantics, and stored analysis data remain unchanged. No network, provider, backend, OAuth, fuzzy matching, or automated source judgment is introduced.

## Verification

- `npm run test:evidence:review-plan` validates deterministic ordering, both lenses, immutability, lens-scoped navigation, derived-manifest identity, and raw-analysis exclusion.
- `tests/evidence-review-plan.spec.js` validates queue navigation and the separate export across Chromium, Firefox, WebKit, and mobile Chrome.
- The no-browser, static, source-of-truth, CI-contract, accessibility, reflow, hosted-evidence, and visual-audit gates retain their prior authority.

The browser core contains 292 cases after this slice: 284 existing cases plus two review-queue/export scenarios across four browser projects.
