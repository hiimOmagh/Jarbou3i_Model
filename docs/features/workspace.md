# Local Workspace

A validated import or sample becomes a versioned local workspace stored in the
browser. The workspace keeps imported history immutable, edits a separate
draft, records review decisions in an append-only ledger, and changes canonical
history only through an explicitly approved resolution transaction.

Everything stays on the device. There is no account, authentication, telemetry,
remote database, synchronization, or collaboration. Local data is not encrypted
and is readable by anyone with access to the browser profile.

## Authority model

| Layer | Field | Mutability |
|---|---|---|
| Canonical history | `revisions[]` (`imported_canonical`, `committed_resolution`, `restored_revision`) | Append-only; each revision has its own SHA-256 checksum |
| Head pointer | `head_revision_id` | Advances only by appending a new revision |
| Working draft | `working_draft` | Editable, checksummed, based on an explicit revision |
| Review decisions | `review_ledger.events[]` | Append-only, hash-chained |
| Approved changes | `resolution_ledger` | Append-only, hash-chained |

The workspace also records stable workspace, revision, draft, and audit-event
IDs; exact lens, contract, schema, language, and analysis identity; the
repository revision; timestamps; and archive metadata. The published contracts
are `schema/workspace.schema.json` (format `jarbou3i-local-workspace`, version 3)
and `schema/workspace-bundle.schema.json`.

## Storage

Substantive content lives in the `jarbou3i-model-workspaces` IndexedDB database,
never in `localStorage`, which holds only preferences and the active-workspace
pointer. `createWorkspaceRepository()` separates domain operations from the
backend; a memory backend keeps no-browser tests deterministic.

- Every write must present the previously read repository revision and advance
  it by exactly one. Stale writes and deletes fail with `WRITE_CONFLICT`, so two
  tabs cannot silently overwrite each other.
- Reads verify checksums and analysis identity before returning content; a
  mismatch fails closed.
- IndexedDB failures are reported as unavailable storage, quota exhaustion,
  interrupted transaction, or generic storage errors, without discarding the
  analysis in memory.
- The **Local workspaces** dialog reports storage persistence, usage, and quota,
  and **Protect storage** asks the browser for persistent storage.

## Migration

The current version is read directly after full integrity verification. Older
formats migrate forward on read and on bundle restore: a bounded v0 shape into a
fresh workspace, v1 by adding an empty review ledger, and v2 by adding an empty
resolution ledger. Migration never changes the analysis payload or invents
history. Unknown formats and versions fail with `NO_WORKSPACE_MIGRATION`.

## Portable bundles

The `jarbou3i-workspace-bundle@1` export carries the complete workspace, its
checksum, and a checksum over the artifact identity and these protected flags:

```json
{
  "local_first": true,
  "canonical_transport": false,
  "contains_canonical_revisions": true,
  "collaboration_state": false
}
```

Restore rejects a changed workspace or flag, never overwrites an existing
workspace ID, and refuses files over 25 MiB before parsing. Canonical JSON and
HTML reports keep their own contracts and are separate from workspace backup.

## Structured editor

The editor changes only `working_draft.canonical_payload`:

- lens-aware navigation of the top-level canonical sections;
- JSON-typed values without string coercion, with immediate parse and contract
  validation;
- immutable analysis identity fields;
- 100-step undo/redo;
- dirty-state indication and unload protection;
- explicit save with the optimistic conflict check; each save gets a new checksum;
- `Ctrl/Cmd+Enter` applies a field and `Ctrl/Cmd+S` saves.

Field application is idempotent across keyboard, blur, and change events, so a
late `change` event (seen in WebKit) cannot reapply old text after Undo or clear
the redo stack.

## Crash recovery

While editing, the editor writes a `jarbou3i-editor-recovery@1` record after
500 ms of inactivity. It holds the whole parsed payload, the active JSON Pointer,
and the raw field text, because a crash can happen while a field holds
incomplete JSON. The record is SHA-256 protected and bound to the workspace ID,
repository revision, draft ID, base revision ID, and saved-draft checksum. If any
anchor changed, or the record is older than seven days, fails its checksum, or
has an unknown contract, it is discarded instead of offered.

Reopening the matching draft offers **Restore** or **Discard**. Restore refills
the editor but writes nothing; a normal Save is still required. Saving the
draft, deleting the workspace, or a full reset removes the record. A recovery
record is never a revision, review decision, backup, or publication artifact.

The same recovery store keeps the in-progress intake (topic, context, sources,
answer mode, generated prompt, pasted answer, and stage) under the
`jarbou3i-intake-draft@1` contract, so a reload restores unfinished work on the
Set up screen.

A reload also reopens the last open workspace. Both restores read storage after
the page is usable, which can take a while on a slow device. Anything the user
changes first (topic, context, sources, answer mode, lens, an analysis language
chosen on its own, the pasted answer, or another analysis) is kept: the restore
that would overwrite it is skipped, and the last workspace stays in Workspaces.

## Review ledger

The evidence review queue (see [Results and Evidence](results-and-evidence.md))
opens a ledger where a reviewer can start a task, add notes, complete it with a
rationale, record a bounded waiver, and reopen completed or waived work.

| Current state | Allowed actions | Result |
|---|---|---|
| Pending | Start review | In review |
| Pending or In review | Waive with rationale, scope, and accepted risk (optional expiry) | Waived |
| In review | Complete with rationale | Completed |
| Completed or Waived | Reopen with rationale | In review |
| Any | Add a non-empty note | Unchanged |

A task key is a SHA-256 fingerprint of the task's phase, reason, target type,
target ID, owner, and canonical path; display numbers such as `RQ001` are
excluded, so renumbering the queue does not change task identity. Each event
stores its sequence, timestamp, previous-event hash and own hash, workspace ID,
repository revision, the draft checksum at decision time, the task snapshot, the
reviewer, and the rationale, note, or waiver. A decision becomes visibly stale
when the draft changes after it.

Review events never change the draft, revisions, confidence, evidence status,
scores, or publication gates. Completing a task means a reviewer recorded
completion, not that the analysis is correct; a waiver does not remove the
diagnostic or make a report publishable. The `jarbou3i-operational-review-ledger@1`
export declares `canonical_transport: false` and
`completion_validates_conclusions: false`.

## Resolution transactions

A saved draft reaches canonical history only through this sequence:

1. Read and verify the workspace.
2. Diff the head revision against the saved draft (`jarbou3i-canonical-diff@1`,
   exact JSON Pointer paths with before and after values).
3. Validate the whole draft against the lens contract and immutable identity.
4. Freeze the base revision, repository revision, draft ID and checksum, diff,
   diagnostics, and a proposal checksum.
5. Require a reviewer name, a rationale, and explicit confirmation.
6. Recheck proposal, draft, head, diff, and validation just before writing.
7. Append a `committed_resolution` child revision and a hash-chained resolution record.
8. Advance the head, start a clean draft from it, and re-render so diagnostics
   and the review queue regenerate from the committed payload.

The commit is rejected if the draft has no changes, the contract is invalid,
identity changed, approval details are missing, anything frozen in step 4
changed, another writer won the optimistic check, or any ledger or revision fails
verification.

## Revision history and safe restore

**Local workspaces → Revision history** lists verified revisions with lineage,
checksums, and an exact comparison against the head. **Prepare safe restore**
turns a selected revision into a normal resolution proposal. Approving it appends
a `restored_revision` child of the current head that records
`restored_from_revision_id`; earlier revisions are never changed and the head
never moves backward. Restore is blocked while the draft has unsaved changes, and
selecting the head or a payload-identical revision cannot create a restore.

## Identity and integrity limits

Reviewer identity is a local assertion: a stable browser-generated ID plus a
display name (`identity_assurance: local_assertion`). It is not authentication, a
signature, or organizational authorization. The hash chains detect corruption
and naive in-place edits, but anyone who controls the browser profile can replace
a workspace and recompute every hash. External notarization and authenticated
multi-user identity are not provided.

## Tests

| Area | No-browser check | Browser spec |
|---|---|---|
| Contract, storage, migration, bundles | `npm run test:workspace` | `tests/workspace-foundation.spec.js` |
| Structured editor and crash recovery | `npm run test:workspace` | `tests/canonical-editor.spec.js` |
| Review ledger | `npm run test:review-ledger` | `tests/review-ledger.spec.js` |
| Resolution transactions | `npm run test:resolution` | `tests/resolution-transaction.spec.js` |
| Revision history and restore | `npm run test:revision-history` | `tests/revision-history.spec.js` |
| Intake restore after reload | | `tests/ai-interchange-reliability.spec.js` |
| Restores yield to changes made during load | | `tests/workspace-foundation.spec.js`, `tests/ai-interchange-reliability.spec.js` |
