# Phase 5, Slice 3 — Operational Review Ledger

Release candidate: `2.1.0-alpha.38`

## Outcome

Slice 3 turns the deterministic evidence-review plan into accountable local operations without making the analysis itself mutable. A reviewer can start a task, add notes, complete it with rationale, record a bounded waiver, and reopen completed or waived work. Each action is an immutable event in the workspace’s operational ledger.

The ledger is governance evidence. A completed task means that a reviewer recorded completion; it does not prove that the analysis, evidence, or conclusion is correct. A waiver records an accepted exception; it does not remove the underlying diagnostic or make the report publishable.

## Authority boundary

The workspace keeps three authorities separate:

1. `revisions[]` stores immutable canonical analysis history.
2. `working_draft` stores the editable, checksummed analysis draft.
3. `review_ledger.events[]` stores append-only operational decisions about derived review tasks.

Review events never modify `working_draft.canonical_payload`, revision payloads, analytical confidence, evidence verification, scores, or publication gates. Each event records the draft checksum that was current when the decision was made, so later draft edits cannot silently make an older decision appear current.

## Task identity and lifecycle

A task key is a SHA-256 fingerprint of its semantic identity: phase, reason, target type, target ID, owner, and canonical path. The queue’s display sequence (`RQ001`, etc.) is retained as a snapshot but excluded from the fingerprint, because adding another diagnostic may renumber the queue without changing the underlying task.

Allowed transitions are:

| Current state | Allowed actions | Result |
|---|---|---|
| Pending | Start review | In review |
| Pending | Waive with rationale, scope, and accepted risk | Waived |
| In review | Complete with rationale | Completed |
| In review | Waive with rationale, scope, and accepted risk | Waived |
| Completed | Reopen with rationale | In review |
| Waived | Reopen with rationale | In review |
| Any state | Add a non-empty note | State unchanged |

Direct pending-to-completed transitions are rejected. Reopening appends a new event; it never erases completion or waiver history.

## Event integrity

Each event contains:

- unique event ID and monotonic sequence;
- event type and ISO-8601 timestamp;
- prior-event hash and its own SHA-256 hash;
- workspace ID and repository revision before the transaction;
- exact working-draft checksum;
- semantic task key and task snapshot;
- local reviewer ID, display name, and `identity_assurance: local_assertion`;
- rationale, note, or waiver record as applicable.

Workspace reads verify event hashes, sequence, previous-hash links, task fingerprints, reviewer shape, waiver completeness, workspace identity, and revision ordering. Any mismatch fails closed. The repository still requires the previously read revision and exactly one revision increment, so concurrent tabs cannot silently overwrite one another.

## Reviewer identity and threat model

Reviewer identity is intentionally local-first. The browser creates a stable local reviewer ID and the reviewer supplies a display name. Every event freezes that identity snapshot.

This is not authentication, a digital signature, remote attestation, or organizational authorization. A user controlling the browser profile can delete local data or construct a new ledger. The chain detects accidental corruption and ordinary in-place rewriting when verification runs; it does not prevent a malicious local actor from replacing the entire workspace and recomputing hashes. External notarization and authenticated multi-user identity remain outside this slice.

## Waiver semantics

A waiver requires:

- decision rationale;
- explicit scope;
- explicit accepted risk;
- optional expiry timestamp.

Waivers remain visible in the immutable history and can only leave the waived state through a reasoned reopening event. They do not suppress diagnostics or bypass existing publication blockers.

## Persistence, migration, and portability

Workspace format advances from v1 to v2 by adding an empty operational ledger. Existing Alpha.37 workspaces migrate on repository read and when restored from portable bundles. Migration never invents historical review events. Unknown future versions still fail closed.

The existing workspace bundle carries the complete ledger under its protected workspace checksum. The separate `jarbou3i-operational-review-ledger@1` export contains analysis identity and the event chain, but declares `canonical_transport: false` and `completion_validates_conclusions: false`.

## Product interface

The evidence-review queue now opens a trilingual responsive ledger dialog with:

- task status counts and per-task status;
- locally asserted reviewer identity disclosure;
- state-valid action choices only;
- rationale, note, waiver scope, risk, and expiry controls;
- per-task immutable event history with visible hash prefixes;
- audit-trail export;
- keyboard focus containment and focus restoration.

## Verification

`npm run test:review-ledger` proves:

- semantic task-key stability across display renumbering;
- start, note, waiver, reopening, and completion transitions;
- rationale, note, reviewer, and waiver requirements;
- canonical draft non-mutation;
- exact repository revision increments;
- hash-chain, task-key, and tamper detection;
- non-validating audit-export semantics.

`npm run test:browser:review-ledger` defines two journeys across Chromium, Firefox, WebKit, and mobile Chrome:

1. start → note → complete → reload → reopen with identity and history preserved;
2. waive with bounded risk → reopen → export and verify the two-event hash chain.

This adds eight cases to the 320-case Alpha.37 browser core, making the Alpha.38 target **328 cases**.

## Deferred

- authenticated reviewers, roles, signatures, and remote notarization;
- multi-user synchronization or collaboration;
- proposed canonical patches, diff approval, resolution commits, and regenerated diagnostics (Slice 4);
- revision browser, rollback, and crash-recovery interface (Slice 5).
