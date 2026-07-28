# Alpha.55 — Revision History and Safe Restore

Alpha.55 closes the documented P0 recovery gap between immutable local history
and practical user recovery. Users can browse verified revisions, inspect their
lineage and checksums, compare a selected historical payload with the current
head, and restore only by approving a new immutable child revision.

## Safety invariants

- History browsing is read-only.
- Restore never overwrites a revision or moves `head_revision_id` backward.
- A restore proposal is anchored to the current repository revision, current
  head, source revision ID, source kind, and source payload checksum.
- The exact head-to-source canonical diff and whole-document validation are
  reviewed through the existing resolution transaction.
- Explicit local reviewer identity, rationale, and confirmation remain required.
- The committed revision has kind `restored_revision`, points to the prior head
  as its parent, and records `restored_from_revision_id`.
- The hash-chained resolution record and audit event preserve restore provenance.
- Dirty working drafts block restore so uncommitted work is never discarded
  implicitly.
- Current-head and payload-identical selections cannot create meaningless
  restore transactions.
- Repository optimistic concurrency still rejects a restore prepared from stale
  state.

## User workflow

1. Open **Local workspaces**.
2. Choose **Revision history** for a verified workspace.
3. Select an immutable revision.
4. Inspect metadata, lineage, checksum, and the exact comparison with the current
   head.
5. Choose **Prepare safe restore**.
6. Inspect the generated resolution proposal.
7. Enter the approver name and rationale, explicitly confirm, and append the
   restored revision.
8. The application reloads from the new head; all earlier revisions remain
   unchanged.

The workflow is available in Arabic, English, and French and uses one responsive
dialog with keyboard focus containment and accessible status updates.

## Contract and falsification

Alpha.55 fails if any of the following occurs:

- a restore changes or removes an earlier revision;
- `head_revision_id` is reassigned to a historical revision;
- the new revision is not a child of the head that was reviewed;
- the restored payload differs from the selected source checksum;
- source provenance can be altered without integrity failure;
- a dirty draft is discarded by restore;
- restore commits without full validation, rationale, reviewer identity, or
  explicit approval;
- a concurrent workspace write is silently overwritten;
- Arabic, English, French, mobile, keyboard, or supported-browser behavior
  diverges.

## Acceptance authority

Deterministic checks cover history projection, exact comparison, safe
preparation, append-only commit, source binding, dirty-draft blocking, stale
selection rejection, and provenance tampering. Browser coverage exercises a
complete Strategic restore and a Biopolitical dirty-draft/localization path.
The complete no-browser authority, four-engine browser suite, hosted evidence,
visual evidence, and exact-commit deployment gates remain required before
production closure.
