# Phase 5 Slice 4 — Resolution Transactions

Release candidate: `2.1.0-alpha.40`

## Outcome

Slice 4 converts a saved working draft into a reviewable proposal and, only after explicit approval, a new immutable canonical revision. It does not rewrite an import, mutate an earlier commit, or treat a saved draft as approved work.

The transaction is:

1. Read and integrity-check the current workspace.
2. Compare the immutable head revision with the saved working draft.
3. Produce a deterministic `jarbou3i-canonical-diff@1` with exact before/after values.
4. Validate the whole draft against the active lens contract and immutable analysis identity.
5. Freeze the base revision, repository revision, draft ID, draft checksum, diff, diagnostics, and proposal checksum.
6. Require a local reviewer snapshot, rationale, and explicit confirmation.
7. Recheck the proposal, draft, head, diff, and validation immediately before persistence.
8. Append a `committed_resolution` child revision and a hash-chained resolution record.
9. Advance the head pointer and create a clean working draft based on the new revision.
10. Re-render the complete analysis so diagnostics and review planning are regenerated from the committed payload.

## Fail-closed conditions

The commit is rejected when the draft has no changes; the full contract is invalid; immutable identity changed; approval, reviewer, or rationale is absent; the proposal or diff changed; the repository revision, head, draft ID, or draft checksum changed; another writer won the optimistic guard; or any immutable revision or ledger fails verification.

## Workspace format v3

Workspace format v3 adds `resolution_ledger` while preserving immutable revisions, the separate working draft, the operational review ledger, optimistic concurrency, checksummed portable bundles, and `canonical_transport: false`. The bounded v2→v3 migration creates an empty resolution ledger and never invents approval history.

Every resolution record carries chain provenance, proposal and diff checksums, base and committed revision IDs, draft and payload checksums, validation and diagnostic snapshots, local approver identity, rationale, and explicit-confirmation mode. The chain is tamper-evident, not a signature or external notarization.

## Review drift and interface

Review decisions remain bound to their event-time draft checksum. A task becomes visibly stale when its latest event differs from the current working draft.

The trilingual responsive dialog provides exact JSON Pointer paths, complete before/after values, base and validation state, local-identity disclosure, explicit confirmation, status feedback, keyboard focus containment, and language/theme/viewport evidence coverage.

The focused authority is **8 browser cases**; the complete core target is **336 cases**. Visual authority becomes **156 screenshots and 175 artifacts**.

## Adjacent hardening

- Strategic topic/context are serialized as explicitly untrusted JSON data.
- Prompt UI exposes character burden and complete-output capacity risk.
- Workspace listings verify content before displaying analytical metadata as healthy.
- Local data is disclosed as unencrypted and browser-profile accessible.
- Deployment headers deny framing, runtime connections, sensors, referrers, and MIME sniffing.
- Hosted and visual evidence metadata embeds the full CI commit SHA; local captures use `local-uncommitted`.

## Deferred boundary

Slice 4 does not implement rollback, revision browsing, crash recovery, automated backup rotation, authenticated reviewers, signatures, notarization, remote sync, or collaboration. Those remain Slice 5 or later. Stable 2.1 also requires Slice 6 performance, security/privacy, documentation, and manual sign-off closure.
