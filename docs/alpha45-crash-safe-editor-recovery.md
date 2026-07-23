# Alpha.45 — Crash-Safe Editor Recovery

## Scope

Alpha.45 closes the first P0 recovery gap identified by the pre-stable audit. It protects in-progress canonical-editor work from tab, browser, or operating-system interruption without weakening workspace integrity or inventing a second revision history.

## Authority boundary

The saved workspace remains authoritative. A recovery record is a local, temporary convenience artifact with contract `jarbou3i-editor-recovery@1`; it is not a canonical analysis, revision, review decision, resolution event, backup, or publication artifact.

Each record is bound to:

- workspace ID;
- repository revision;
- working-draft ID;
- base revision ID;
- checksum of the saved working draft.

If any anchor changes, the record is stale and is removed instead of offered for restoration. The complete record is SHA-256 protected. Contract mismatch, checksum failure, invalid timestamps, and expiry fail closed.

## Capture and restoration

The editor captures after 500 ms of inactivity. A snapshot includes the parsed whole canonical payload, active JSON Pointer, and raw textarea value. Keeping the raw value is necessary because a crash can occur while a field contains incomplete JSON that cannot yet enter the editor session.

Snapshots expire after seven days. Opening the exact matching draft presents Restore and Discard choices. Restore rehydrates the editor session but does not write the workspace. A normal validated Save remains required to update the canonical working draft through optimistic concurrency.

Successful draft save, current-workspace deletion, and full reset remove relevant recovery state.

## Explicit exclusions

Alpha.45 does not add:

- corrupt-workspace quarantine or raw export;
- revision browsing or revision restoration;
- cross-tab invalidation or blocked-upgrade timeout handling;
- backup freshness;
- cloud synchronization, authentication, telemetry, or collaboration.

Those remain separate roadmap slices to keep the recovery journal falsifiable and regression-bounded.
