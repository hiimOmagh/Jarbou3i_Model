# Research dossier (RESEARCH-1)

The dossier holds what the analyst asks for, before and across the AI's
answers: the case framing and the completion contract. Storage decision:
[ADR-0004](../decisions/0004-research-dossier-store.md). Authorized by the
product owner on 2026-10-30. This page is `RESEARCH-1A`'s Definition of
Ready ([product-ui-execution-plan.md](../product-ui-execution-plan.md#definition-of-ready)).

## User job and baseline

**Job:** before asking the AI, fix the case: the question, what is in and
out of scope, the terms in dispute, what the research cannot cover, and what
"done" means. Keep that framing with every answer imported for the case.

**Today (observed):**

- Only the question and the timeframe exist (`#topicInput`, `#timeframeInput`).
  Nothing holds scope, contested terms, limits or completion criteria.
- They live in a per-tab intake draft (`jarbou3i-intake-draft@1`) that
  expires after 30 days (`TRIP_EXPIRY_MS`) and is deleted once an answer is
  saved (`discardTrip()` after `persistImportedAnalysis`).
- Import overwrites both inputs with the AI's `subject.title` and
  `subject.context`.
- A workspace stores the analysis only (`createWorkspace`), and every new
  answer makes a new workspace, so a case answered in several replies is
  split across unlinked workspaces.

## Ownership and non-goals

**The dossier owns:**

- the framing: question, timeframe, scope in, scope out, contested terms
  (term and working definition), limits;
- the completion contract: criteria, each `open` or `met`. "Met" needs a
  rationale and a time. It is the analyst's claim, never a verification.

**It references, and never copies:**

- analyses, by `workspace_id`, `revision_id` and `payload_checksum`;
- evidence, claims and gaps, which stay in the canonical analysis and its
  projections (evidence intelligence, traceability, review plan).

**Non-goals:**

- crawling, a backend or accounts;
- AI-controlled verification or bulk document intelligence;
- any change to the Strategic 1.1.0 or Biopolitical 2.1.0 payloads, the
  workspace format (v3), the workspace bundle, or the import policy
  (canonical only);
- marking a criterion met automatically;
- sources and observations (`RESEARCH-1B`);
- sending the dossier to the AI as trusted text: framing in a prompt stays
  fenced, as context is today.

## Designs considered

| | Workspace field (v4) | Store in the workspace database | Own database (chosen) |
|---|---|---|---|
| Exists before import | No | Yes | Yes |
| Edits stale recovery and proposals | Yes | No | No |
| Rollback | Old app offers to remove v4 workspaces | Old app cannot open any workspace | Dossiers unread; workspaces untouched |
| Migration | v3 → v4 for every workspace | Database v2 → v3 | None |

Extending the intake draft was rejected: per tab, expiring, deleted on import.

## Acceptance (RESEARCH-1A)

1. A dossier can be created with no analysis. Its framing survives a reload,
   and its checksum verifies.
2. Importing an answer links the analysis to the dossier. The dossier's
   question still reads as the analyst wrote it, not as the AI's title.
3. Each completion criterion is open or met; met carries a rationale and is
   shown as the analyst's claim.
4. Dossier writes leave every workspace record, its `repository_revision`,
   the recovery journal and pending proposals unchanged.
5. AR/EN/FR, RTL, keyboard, 320px reflow, forced colors; each spec under 60s
   in all four browser projects.

## Falsified if

- any evidence item, claim or gap text is stored in a dossier;
- a dossier write changes a workspace record or stales a recovery record;
- the workspace database version changes;
- the analyst's framing is still replaced after import.

## Failure, migration, rollback

- **Old workspaces:** need nothing. Workspaces never point to a dossier.
- **Storage failure or quota:** errors map as workspace storage errors do
  (`STORAGE_QUOTA_EXCEEDED`, `STORAGE_UNAVAILABLE`, `STORAGE_FAILURE`). Text
  the analyst typed stays on screen, marked not saved. A dossier that fails
  its checksum is listed as damaged and never deleted automatically.
- **Rollback:** the database is additive. An earlier app never opens it.
- **Export:** the dossier exports as its own file, never inside the
  workspace bundle. A link to a workspace not on the device is shown as
  such, never removed.

## Slices

1. **S1, contract and store (no UI).** `src/core/research-dossier.js`
   (create, update, link, verify; memory and IndexedDB backends; repository),
   `schema/research-dossier.schema.json`, `tests/research-dossier-check.mjs`,
   `tests/research-dossier.spec.js` (real IndexedDB in all four engines).
2. **S2, framing in the guided flow.** "What this case covers" in the topic
   step; the import links the analysis and keeps the analyst's question;
   "Reset app data" clears dossiers.
3. **S3, completion contract.** Criteria in the case file overview and the
   work panel; met or open, set by a person with a rationale.
4. **S4, export and restore** of a dossier as its own file.

## Record (format version 1)

```text
format             "jarbou3i-research-dossier"
format_version     1
dossier_id         "dossier_<uuid>"
revision           1, +1 per write
created_at, updated_at
framing            question, timeframe, scope_in[], scope_out[],
                   contested_terms[{ term, working_definition }], limits[]
completion[]       { criterion_id, text, status "open" | "met",
                     rationale, decided_at (null while open) }
analyses[]         { workspace_id, revision_id, payload_checksum, linked_at }
checksum           { algorithm "SHA-256", value } over the rest
```

Text fields hold at most 4,000 characters, and each list at most 50 items.
A met criterion keeps its `decided_at` until its rationale changes; the store
sets the time, never the caller.
