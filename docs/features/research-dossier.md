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

- any evidence item, claim or gap of an imported analysis is copied into a
  dossier (the analyst's own sources and excerpts, `RESEARCH-1B`, are not
  evidence until `RESEARCH-1C` promotes them);
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
2. **S2, framing in the guided flow (built).** "What the analysis covers" in
   the topic step; the import links the analysis and keeps the analyst's
   question; "Reset app data" clears dossiers. `tests/case-framing.spec.js`.
3. **S3, completion contract (built).** Criteria written in the topic step's
   fold and marked in the case file overview, met or open, by a person with
   a rationale. The work panel does not show them yet.
4. **S4, cases on this device (built).** The Local workspaces dialog lists
   every dossier; each opens, exports as its own file, or is removed. A file
   restores a dossier. `tests/case-framing.spec.js`.

## In the guided flow (S2)

- **Fields.** A fold under the topic, **What the analysis covers**, holds four
  fields, one item per line: in scope, out of scope, terms in dispute (the
  term, a colon, the working definition) and limits. The topic and the
  timeframe are the framing's question and timeframe.
- **When a dossier exists.** Half a second after the analyst writes in one of
  the four fields. A topic alone makes none: the analysis being prepared
  already keeps it. Once it exists, the topic and timeframe are saved to it
  too. A write that fails leaves the text on screen with "Not saved on this
  device".
- **The case on screen.** The tab's analysis being prepared keeps the four
  fields and the dossier id for a reload. While a case is on screen, an
  imported answer, a lens switch or a saved edit never rewrites its question.
- **Prompt.** The four fields go into the prompt's context, under their names
  in the analysis language. The prompt already fences that context as the
  user's material. With the fields empty, the prompt is unchanged.
- **Import.** A pasted answer for the case is linked to its dossier (workspace,
  head revision, payload checksum). Reopening that analysis, or reloading,
  shows its case.
- **Elsewhere.** The sample, another analysis or a restored bundle that no
  dossier holds empties the fields. The dossier stays on the device,
  unchanged.
- **A case left before any answer** is opened again from **Cases** in the
  Local workspaces dialog (S4). "Reset app data" removes it.

## Completion contract (S3)

- **Written before asking.** A fifth field in the fold, **The analysis is done
  when**, holds one criterion per line, and goes into the prompt with the
  rest. A line kept keeps its criterion, its status and its reason. A new or
  changed line is a new criterion, open (`completionFromLines`).
- **Marked in the case file.** At the end of the overview, in both lenses, for
  an analysis the case on screen holds: "Met: n of m", then each criterion.
  "Mark as met" opens a reason field under it. An empty reason is refused at
  the field. A met criterion reads "Met · your claim, date" with its reason,
  and **Reopen** makes it open again. Focus moves to the control that undoes
  the change.
- **Never automatic.** The app never marks a criterion met. A criterion
  changes no score, gate, evidence status or review decision.

## Cases on this device (S4)

- **Listed** under **Cases** in the Local workspaces dialog, newest first: the
  question, the answers linked ("Answers linked: 2"), how many of them are
  not on this device, "Met: n of m" when it has criteria, and the last
  change. A link to an answer not on the device is shown as such, never
  removed.
- **Open.** A case opens its newest answer on this device, with the case on
  screen. Without one, its question, timeframe and fields open in the topic
  step, ready for the next answer. A reply pasted but not imported is
  replaced only on a second click, as elsewhere.
- **Export** downloads the sealed record as `<question>-case.json`, never
  inside a workspace bundle.
- **Restore a case from a file** reads the file back only if it verifies
  (`readDossierFile`; at most `DOSSIER_FILE_LIMIT`, 24 MiB since `RESEARCH-1B`). A case already on the device is never
  overwritten. A restored case opens only when asked.
- **Remove** takes a second click and removes the case, never its answers.
  A damaged case is listed as unreadable and can only be removed.

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

A record holds only what the topic step's fields can hold again, so a
restored case never changes on its first edit: each list item, term,
working definition and criterion is one line, a term has no colon, and each
criterion's line appears once. `created_at` and `updated_at` are times, and
`revision` is a safe integer. A case links at most 50 answers; the next link
is refused as `DOSSIER_FULL`, never as a field too long.

A write that loses to another tab (`WRITE_CONFLICT`) is made again, once, on
the newer record: the framing on screen replaces the stored one, a decision
applies to the same criterion (id and line) or is refused, and a link is
added. An answer is linked to the case that was on screen when its import
began, even if another case has been opened since.
