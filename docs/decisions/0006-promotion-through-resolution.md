# ADR-0006 — An Excerpt Becomes Evidence Only Through a Committed Resolution

- **Status:** Proposed
- **Date:** 2026-11-03
- **Decision owners:** Product owner
- **Builds on:** [ADR-0005](0005-sources-in-the-dossier-record.md) (sources and excerpts in the case record)
- **Related work:** [research-promotion.md](../features/research-promotion.md) (`RESEARCH-1C` Definition of Ready)

## Context

`RESEARCH-1B` gave a case its sources, excerpts and the analyst's checks,
outside the analysis. `RESEARCH-1C` joins them to the analysis: evidence,
review, case file and exports. Three things could own that join: the
payload, the review plan, or the case.

The payload is the only evidence authority (capability map rule 2), and its
schemas (Strategic 1.1.0, Biopolitical 2.1.0) do not change. The review plan
is derived from the payload alone, so a workspace and its bundle give the
same tasks anywhere. The case lives on one device and is not in the bundle.

## Decision

- **Relations are derived, never stored**: an evidence item with a link
  relates to the source with that link, else to the unlinked source with its
  title; an item without a link relates to the unlinked source with its
  title, else to the one linked source with its title. Several linked
  sources with that title, an empty title, or two different links: no
  relation.
- **The review plan does not read the case.** A task on screen may show the
  case's context and start an empty rationale from a check; the person
  edits it and decides. A rationale the person saves is theirs and stays in
  the ledger.
- **An excerpt becomes evidence only through the resolution authority**: a
  form asks for every judgement the lens requires, the change is prepared
  in a copy of the workspace as a revision restore is (nothing saved before
  Confirm), the case is read again at Confirm, the change is shown in the
  resolution dialog, and a person commits it as a revision. A new item, or
  empty fields of a related item filled from the source. The app sets no
  judgement field, except Biopolitical `replication_status` starting at
  "unknown" (the schema's value for no judgement), which the person may
  change.
- **The case keeps a pointer** on the excerpt (workspace, revision, evidence
  id, kind), written after the commit. Format 2 grows; it is unreleased.

## Consequences

- No payload, workspace, bundle or database version changes; reports,
  exports and print change only through committed revisions or review
  rationales a person saved.
- A task for a link-cited item does not exist (except a Biopolitical
  placeholder), so a check on such an item reaches the analysis only by a
  committed change (Biopolitical verification) or stays in the case file.
  Strategic evidence has no verification field: its check is shown, not
  recorded, in the analysis.
- A new item is cited by no claim until the editor cites it: it adds an
  uncited-evidence task, and in Biopolitical warnings that hold publication.
- The commit and the pointer are two writes in two databases. The revision
  is the proof; a pointer that fails while the page is open is said and can
  be written again; one lost to a reload is not rebuilt.
- A shared report, bundle or print does not show the case's sources. The
  case is exported on its own.
