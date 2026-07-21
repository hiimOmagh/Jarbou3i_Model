# Phase 4, Slice 1 — Evidence and relationship intelligence foundation

Release: `2.1.0-alpha.30`

## Outcome

This slice establishes one shared, immutable relationship-intelligence contract beneath the Strategic and Biopolitical inspection surfaces. It turns authored canonical records, relationships, and evidence references into bidirectional, navigable indexes without altering the canonical analysis.

## Shared intelligence contract

For both lenses the runtime now provides:

- a canonical record registry with stable human labels, types, pillars, confidence, and JSON Pointer paths;
- normalized typed incoming and outgoing relationships;
- authored supporting and counter-evidence trails;
- reverse evidence citations showing every record that cites an evidence record;
- lens-scoped permanent targets in the form `#record=<lens>:<canonical-id>`;
- objective diagnostics for duplicate IDs, unresolved relationship endpoints, unresolved evidence targets, isolated records, declared high-confidence records without authored support, and untraceable evidence;
- immutable counts for records, relationships, evidence references, back-references, unresolved targets, and isolation.

The registry never creates a missing record, identifier, relationship, source, evidence reference, or analytical conclusion. Gap diagnostics describe contract facts only; they do not infer that an authored claim is true or false.

## Lens behavior

| Lens | Canonical records | Relationship authority | Evidence authority |
|---|---|---|---|
| Strategic | Authored IDs in the six causal layers, contradictions, scenarios, evidence, and assumptions | Explicit top-level `links` only | Authored evidence-ID fields only |
| Biopolitical | Existing Training Map v2.1 registry | Existing explicit and schema-derived typed graph | Authored evidence-ID fields resolved against the same canonical graph |

Strategic analyses without authored IDs remain empty rather than receiving generated identifiers. Biopolitical schema `2.1.0`, contract `biopolitical-training-map-v2`, semantic integrity, and relationship-explorer behavior remain unchanged.

## Inspection and navigation

The shared inspector adds a distinct Evidence trail section. A record can show forward supporting/counter-evidence and reverse citations. Every resolvable entry opens the same canonical inspector, preserving the established modal focus contract.

Each record also exposes a permanent fragment link. When the current validated analysis contains the referenced lens and ID, the link opens that record. Closing the inspector clears its active fragment so normal navigation does not reopen a dismissed drawer.

## Compatibility boundary

This is a read-only projection. It does not change:

- Strategic v1.1 or Biopolitical v2.1 schemas;
- prompt generation, import validation, migration, scoring, readiness, or publication gates;
- canonical JSON or standalone HTML export content;
- existing graph semantics, report atlases, timelines, comparison overlays, saved views, or spatial presentation;
- localization authority or persisted analysis data.

There is no live scraping, provider call, OAuth/backend expansion, or source-connector expansion.

## Verification

- `npm run test:relationship:intelligence` validates both lenses, immutability, evidence trails, back-references, deep-link parsing, gap diagnostics, and the no-fabrication rule.
- `npm run test:results:inspection` validates the integrated inspection projection.
- `tests/results-inspection.spec.js` adds a cross-project interaction contract for forward evidence traversal, reverse citations, permanent links, fragment opening, and fragment cleanup.
- Static, QA, source-of-truth, and CI-contract gates require the new module and test.

The browser core contains 272 cases after this slice: the previous 268 cases plus one relationship-intelligence scenario across four browser projects.
