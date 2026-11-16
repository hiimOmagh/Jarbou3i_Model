# ADR-0005 — Sources and Excerpts Live in the Dossier Record

- **Status:** Proposed
- **Date:** 2026-11-02
- **Decision owners:** Product owner
- **Builds on:** [ADR-0004](0004-research-dossier-store.md) (the dossier's own database); supersedes its reservation of format 2 for a framing history
- **Related work:** [research-sources.md](../features/research-sources.md) (`RESEARCH-1B` Definition of Ready)

## Context

`RESEARCH-1B` gives a case its sources, the analyst's excerpts of what each
source says, and each excerpt's check (a person's claim that the excerpt
matches its source). The plan makes the dossier their owner. The released app
(`RESEARCH-1A` S1 and S2) reads dossier format 1 only and opens
`jarbou3i-model-dossiers` at version 1. Its repository lists a record that
fails its format check as `corrupt`, refuses to read it, and never deletes
it. Its "Reset app data" clears the workspace, recovery and dossier
databases, and no other.

Three places were considered:

1. **A store in the dossier database.** Needs the database at version 2. The
   released app then fails to open it (`VersionError`), and no case is read.
2. **A database of their own.** The case record stays format 1, so after a
   rollback the released app reads and links every case, and a save seals
   one source, not the case. But the released app's reset does not know the
   new database: an analyst who resets there keeps every excerpt and quote on
   the device. And removing, restoring and exporting a case span two
   databases that no transaction covers.
3. **The dossier record, format 2.** One record, one write, one checksum,
   1A's conflict rule, and a reset in the released app clears it. The released
   app cannot read a format-2 case, and every save re-seals the whole case.

## Decision

- Sources and excerpts are two lists of the dossier record, format version 2
  (`sources`, `excerpts`), in `jarbou3i-model-dossiers` version 1, store
  `dossiers`, unchanged. No database version changes.
- A record is written at the lowest format that holds it: a case with no
  source is written as format 1, exactly as `RESEARCH-1A` writes it, and the
  reader accepts every record the released writer produced.
- The app recognises a later format from `format` and `format_version`
  before shaping it, lists it as made by a newer version, and keeps it.
- Format 2 stays open until `RESEARCH-1` is pushed; after that, a change is a
  later format. A framing history, if analysts need one, takes a later
  format too (ADR-0004 had reserved format 2 for it).

## Consequences

- While rolled back to the released app, a case with sources is not shown:
  its answers reopen under the AI's title, a new import is not linked to it,
  and typing in the topic step starts a second case. After the upgrade both
  are listed, for the analyst to reconcile. Nothing is deleted, and "Reset
  app data" clears both. This was preferred to a reset that leaves the
  analyst's excerpts on the device.
- A case's export stays one file, its restore one write.
- A save re-seals the whole record. The case-file limit is set above the
  largest file the contract allows, which S5 computes and tests.
- Two tabs that save the same case conflict more often (framing in one,
  sources in the other); the loser is made again once on the newer record,
  as in 1A, with a refusal when what the analyst saw has changed.
- 1A's falsifier is made exact (research-dossier.md): it is falsified if any
  evidence item, claim or gap *of an imported analysis* is copied into a
  dossier. Sources and excerpts are the analyst's material, read by no
  evidence projection in 1B, and become evidence only through `RESEARCH-1C`.
