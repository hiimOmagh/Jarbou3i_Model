# Phase 5, Slice 3 — Alpha.39 Reliability Correction

Release candidate: `2.1.0-alpha.39`

## Scope

Alpha.39 corrects two browser-level transaction defects found while validating the Alpha.38 Operational Review Ledger. It does not change the ledger event schema, task lifecycle, canonical analysis, publication gates, or workspace migration contract.

## Root causes

### Delayed review-DOM replacement

Import and sample-load actions rendered the review UI before asynchronously creating and verifying the local workspace. After persistence completed, `persistImportedAnalysis` called the full renderer again. That replaced review tabs, relationship controls, inspection records, and reference triggers which a user or assistive-technology flow could already have focused.

The failure was timing-dependent before Slice 3. Alpha.38 added review-ledger verification to workspace verification, extending the asynchronous interval enough for Chromium, Firefox, WebKit, and mobile Chrome tests to observe focus loss consistently.

Alpha.39 keeps the first review render authoritative. Persistence completion now updates only application-shell save state and the ledger launcher’s enabled state. It does not replace the active review DOM.

### Concurrent ledger submissions

The ledger retained the prior transaction’s success message while the next append began. A caller could therefore treat stale success as confirmation, initiate another action, and race two writes using the same expected repository revision. The optimistic guard correctly rejected one write, but the UI journey could remain at `In review` instead of reaching `Completed`.

Alpha.39 clears stale success synchronously, disables event submission during the append, and accepts no second invocation until hashing, repository replacement, projection, and rendering have completed. Success is exposed only after that boundary.

## Preserved invariants

- Review events remain append-only and SHA-256 hash-chained.
- Every event remains anchored to the exact draft checksum and prior repository revision.
- Optimistic concurrency continues to fail closed for genuinely stale external writes.
- Completion remains a reviewer action, not validation of a conclusion.
- Canonical revisions and the working draft are not mutated by review actions.
- Browser authority remains 8 focused ledger cases and 328 complete core cases.

## Closure gates

The candidate requires:

- complete no-browser release chain;
- 8/8 focused review-ledger cases;
- 328/328 browser-core cases, including all previously failed focus paths;
- 2/2 hosted evidence cases and evidence review;
- 24/24 visual-audit cases with 138 screenshots and 157 artifacts;
- deployed desktop/mobile evidence after the exact tested commit is published.
