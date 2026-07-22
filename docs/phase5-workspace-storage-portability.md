# Phase 5, Slice 1 — Workspace Contract, Durable Local Storage, and Portability Foundation

Release: `2.1.0-alpha.34`

## Outcome

This slice turns the read-only Alpha.33 workbench into a durable local workspace foundation without making canonical analyses mutable in place. A validated import or sample now creates a versioned workspace, persists it in IndexedDB, reopens it after reload, and can round-trip through an integrity-checked portable bundle.

It does not yet provide the structured editor, operational review-state transitions, resolution commits, rollback interface, or collaboration planned for later Phase 5 slices.

## Three-layer authority model

Every v1 workspace records distinct authority layers:

1. `revisions[].kind = imported_canonical` — the normalized validated analysis as received by the workbench. It is an immutable historical revision with its own SHA-256 checksum.
2. `working_draft` — a structurally separate copy based on an explicit revision. In Slice 1 it begins clean and unchanged; Slice 2 will edit this layer.
3. `head_revision_id` — the committed head pointer. Slice 1 points it to the imported revision; later resolution transactions may advance it only by creating a new revision.

The workspace also carries stable workspace, revision, draft, and audit-event identifiers; exact lens, contract, schema, language, and analysis identity; repository revision; timestamps; and archive metadata.

## Storage architecture

Substantive workspace content is stored in the `jarbou3i-model-workspaces` IndexedDB database, never in `localStorage`. `localStorage` retains only preferences and the active-workspace pointer.

`createWorkspaceRepository()` isolates domain operations from the browser backend. The included memory backend makes contract behavior deterministic in no-browser tests. Repository replacement requires the previously read repository revision and exactly one revision increment. Stale writes and deletes fail with `WRITE_CONFLICT` rather than overwriting newer data.

IndexedDB failures are normalized into explicit unavailable-storage, quota-exhaustion, interrupted-transaction, and generic storage errors. The UI reports failure without discarding the active in-memory analysis.

## Integrity and portability

Every immutable revision and working draft has a SHA-256 checksum over a canonical key-sorted serialization. Reads verify these checksums and exact analysis identity before returning content.

The separate `jarbou3i-workspace-bundle@1` artifact contains:

- workspace format and version;
- export timestamp;
- workspace checksum;
- a checksum covering the artifact identity, semantic boundary flags, and workspace;
- the complete versioned local workspace.

The protected semantic flags are:

```json
{
  "local_first": true,
  "canonical_transport": false,
  "contains_canonical_revisions": true,
  "collaboration_state": false
}
```

Changing the workspace or these boundary flags causes import rejection. Existing workspace IDs are never overwritten during restore. Imports larger than 25 MiB fail before parsing. Canonical JSON and HTML reports retain their prior contracts and remain separate from workspace backup.

## Migration

The migration router accepts the current v1 contract directly after full integrity verification. A bounded legacy v0 shape containing a local analysis can migrate into a fresh v1 workspace without changing the analysis payload. Unknown formats and versions fail closed with `NO_WORKSPACE_MIGRATION`; no best-effort coercion is performed.

The published contracts are:

- `schema/workspace.schema.json`
- `schema/workspace-bundle.schema.json`

## Product interface

The trilingual local-workspace dialog supports:

- visible idle, saving, saved, and error states;
- multiple local analyses;
- integrity-verified reopening;
- automatic reopening of the last active workspace;
- lossless workspace-bundle export;
- safe bundle restore with duplicate and corruption rejection;
- keyboard focus containment and focus restoration;
- responsive, RTL, forced-colours-compatible, and print-excluded presentation.

No account, telemetry, live provider, remote database, network transmission, assignment, comment, or collaboration state is introduced.

## Verification

`npm run test:workspace` proves:

- distinct imported revision and draft object identity;
- exact canonical payload preservation;
- revision and draft checksum enforcement;
- protected bundle-boundary enforcement;
- deterministic export/import equality;
- bounded v0 migration and unknown-version rejection;
- create, list, read, guarded replace, conflict rejection, guarded delete, and duplicate rejection.

`tests/workspace-foundation.spec.js` adds two journeys for both Strategic and Biopolitical analyses across Chromium, Firefox, WebKit, and mobile Chrome:

1. save to IndexedDB → reload → integrity-verified automatic reopen;
2. export bundle → clear local repository → restore exact payload → reject corrupt bundle without creating another workspace.

The browser core target becomes 308 cases: the Alpha.33 total of 292 plus sixteen Slice 1 cases.

## Deferred to later slices

- Slice 5.2: field-level structured editing, validation, undo/redo, dirty-state protection.
- Slice 5.3: operational task states, rationale, local reviewer identity, waiver semantics.
- Slice 5.4: proposed changes, diff, validation, commit, and diagnostic regeneration.
- Slice 5.5: revision browser, rollback, crash recovery, broader backup and corruption recovery.
- Slice 5.6: performance budgets, decomposition, security/privacy closure, documentation reconciliation, and manual release sign-off.

Collaboration remains prohibited until the local format, revision identity, audit semantics, and migration behavior are frozen and proven stable.
