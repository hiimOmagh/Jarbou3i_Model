# ADR-0004 — The Research Dossier Lives in Its Own Database

- **Status:** Proposed
- **Date:** 2026-10-30
- **Decision owners:** Product owner
- **Authorizes:** `RESEARCH-1` (product owner, 2026-10-30), starting with `RESEARCH-1A`
- **Related work:** [research-dossier.md](../features/research-dossier.md) (Definition of Ready and slice plan), [capability-authority-map.md](../capability-authority-map.md) (Intake rows)

## Context

A researcher frames a case before asking the AI: the question, what is in and
out of scope, the terms in dispute, what the research cannot cover, and what
"done" means. Today only the question and timeframe exist, as loose inputs
(`index.html` `#topicInput`, `#timeframeInput`), kept in a per-tab intake
draft that expires after 30 days and is deleted once an answer is imported
(`src/app.js`, `discardTrip`). On import the inputs are overwritten with the
AI's `subject.title` and `subject.context`. A workspace is created only from an
analysis (`src/core/workspace-contract.js` `resolveIdentity`), so nothing
durable holds what the analyst asked for.

Three places for a durable dossier were considered:

1. **A field of the workspace record (format v4).** A workspace cannot exist
   before an analysis, so the dossier could not exist before import. Every
   write raises `repository_revision`, which makes a pending recovery record
   and a pending resolution proposal stale. The previous app accepts only
   format v3 and offers to remove an unreadable workspace.
2. **A new store in the workspace database.** It exists before import and
   leaves workspace records alone, but it needs `jarbou3i-model-workspaces`
   at version 3. An earlier app opens that database at version 2 and gets a
   `VersionError`, so after a rollback every workspace would be unreadable.
3. **Its own database.** Exists before import, never touches the workspace
   database, its version, its records, the recovery journal or the bundle.

Extending the intake draft was also rejected: it is per tab, expires, and is
deleted on import.

## Decision

- The dossier is a record `jarbou3i-research-dossier`, format version 1, in
  its own IndexedDB database `jarbou3i-model-dossiers` (version 1, store
  `dossiers`, key `dossier_id`). `src/core/research-dossier.js` owns its
  contract, its backends and its repository; `schema/research-dossier.schema.json`
  publishes the record.
- The dossier owns the case framing (question, timeframe, scope in and out,
  contested terms, limits) and the completion contract (criteria, each open
  or met; "met" needs a person's rationale and is a claim, not a
  verification).
- It references analyses only by `workspace_id`, `revision_id` and
  `payload_checksum`. It never copies evidence, claims or gaps: those stay
  with the canonical analysis and its projections. Workspaces never point
  back to a dossier.
- Integrity: a SHA-256 checksum over the canonical record, and a `revision`
  that rises by one per write with the same optimistic-concurrency rule as
  workspaces (`expectedRevision`). The record keeps no edit history in v1;
  framing is the analyst's own text, not evidence.

## Consequences

- Rolling the app back leaves dossiers unread and workspaces untouched.
- "Reset app data" must also clear the dossier database (`RESEARCH-1A` S2,
  when the app first writes one).
- The workspace bundle does not carry the dossier; it exports as its own
  file (`RESEARCH-1A` S4). Links to workspaces that are not on the device are
  shown as such, never removed.
- If analysts need the history of their framing, a format v2 adds an
  append-only event list; v1 records migrate by starting it empty.
