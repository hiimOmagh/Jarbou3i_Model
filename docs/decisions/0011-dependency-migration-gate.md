# ADR-0011: Bound dependency migration with an executable baseline

Status: Proposed

## Context

PM104-J and phase0/architecture.md propose layered migration while preserving native ESM, offline behavior, canonical state and storage contracts. The requested historical cycle comprised workspace-contract, review-ledger and resolution-transaction. At base cfce6b77df629f47783bdd96077e4320f93088ff, canonical-json extraction has already removed review-ledger from that SCC. The actual remaining SCC is workspace-contract <-> resolution-transaction. Restoring the historical three-member SCC would regress the tree and is rejected.

## Proposal

Use tests/dependency-boundaries-check.mjs as the no-browser dependency gate. Its explicit, checked-in inventory lists every module edge, browser global consumer and dynamic import found at the base. Parse JavaScript with the parser already shipped by the pinned Playwright dependency; comments, strings and template text are not imports. This internal parser API couples the gate to Playwright upgrades; upgrades must run the self-test.

App composes all layers. Features consume domain/core, lenses, UI and shared. Domain/core and lenses consume shared leaves, never features or browser services by new globals. Shared imports only shared. Platform consumes domain interfaces, shared and localization. Generated modules and locales stay leaves. Existing cross-layer edges are individually grandfathered in the inventory. Browser globals are explicit per-file exceptions, including legacy Jarbou3i registrations and consumers; new consumers require review. Literal dynamic imports and the two explicit app capability retry paths are recorded; unresolved expressions and executable loaders fail closed.

Allow only the actual base SCC and its recorded internal edges. The historical three-module SCC is documented here, not broadly allowlisted: no new cycles or expansion may be accepted. A future cycle-removal slice must shrink the baseline deliberately alongside parity evidence. This gate performs no source migration.

## Compatibility and rollback

Keep legacy globals, eager/lazy readiness and retry semantics, canonical checksum bytes, error identity, schema authorities, repositories and stored formats. Future slices introduce injected services and move ownership one seam at a time; removing a global exception requires consumer parity. Do not bulk move modules or break the cycle in this patch. Revert this gate/ADR package independently; runtime and stored data are unchanged.

## Acceptance evidence

Run the gate self-test, real-tree check and CI script contract. Self-test accepts the literal baseline and injects forbidden layer edges, new cycles, restoration of the old three-module cycle, new globals, unknown loaders, parser decoys and re-exports. CI invokes both checks through test:dependencies in test:ci:no-browser. Existing ADR statuses are unchanged; acceptance of this proposal needs owner decision evidence.

## Known limits

The gate watches a fixed list of browser global names. A bare global outside that list (for example fetch) is not reported. In a file that already has a bare window or globalThis exception, writes through a local alias of it are not reported either. This gate is not a network or security boundary.
