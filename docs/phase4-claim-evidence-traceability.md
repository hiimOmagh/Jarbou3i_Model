# Phase 4, Slice 3 — Claim–Evidence Traceability

Release: `2.1.0-alpha.31`

## Outcome

This slice completes the Phase 4 evidence-intelligence chain with a shared claim–evidence matrix, direct authored routes from evidence to citing records, and a separate machine-readable audit export.

## Traceability matrix

Every non-evidence canonical record receives one immutable traceability row containing:

- canonical ID, human label, type, pillar, path, confidence, and permanent link;
- authored supporting and counter-evidence identifiers;
- resolved source-cluster identifiers;
- unresolved evidence identifiers;
- traceable-evidence count;
- an objective balance state: support and counter, support only, counter only, or unreferenced.

The balance state reports field coverage only. It does not decide whether a claim is correct, whether the evidence is sufficient, or whether a counterargument is valid.

## Authored routes

Each direct evidence reference becomes an evidence-to-record route with evidence and record IDs, labels, canonical paths, role, source cluster, and record deep link. Routes are never inferred from semantic similarity or graph proximity.

## Derived intelligence export

The Inspection workspace adds an **Export intelligence JSON** command. The artifact identifies itself as:

```json
{
  "format": "jarbou3i-evidence-intelligence-v1",
  "derived": true,
  "canonical_transport": false
}
```

It contains version/lens metadata, aggregate counts, source clusters, the claim–evidence matrix, authored routes, evidence gaps, and unresolved relationship diagnostics. It intentionally excludes the raw analysis and cannot replace the lossless canonical JSON used for re-import or archival.

## Compatibility boundary

Strategic v1.1, Biopolitical schema `2.1.0`, `biopolitical-training-map-v2`, canonical JSON, standalone reports, imports, validation, scoring, readiness, publication gates, prompts, and graph semantics remain unchanged. No network, provider, OAuth, backend, or source connector is introduced.

## Verification

- `npm run test:evidence:traceability` validates both lenses, matrix states, authored routes, immutability, manifest identity, and raw-analysis exclusion.
- `tests/evidence-intelligence.spec.js` downloads and validates both Strategic and Biopolitical manifests across all browser projects.
- Static, QA, source-of-truth, CI-contract, accessibility, and hygiene gates require the new module and export contract.

The browser core contains 284 cases after this slice: 276 existing cases plus two traceability/export scenarios across four browser projects.
