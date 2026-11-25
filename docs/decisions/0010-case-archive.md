# ADR-0010 — A Unified Case Archive Preserves Separate Authorities

- **Status:** Proposed
- **Date:** 2026-11-25
- **Decision owners:** Product owner
- **Builds on:** [ADR-0004](0004-research-dossier-store.md), [ADR-0005](0005-sources-in-the-dossier-record.md), [ADR-0006](0006-promotion-through-resolution.md)
- **Related work:** [Architecture audit A12](../phase0/architecture.md) (row 112)

## Context

A12 (`docs/phase0/architecture.md:25`) proposes a `Jarbou3iCaseArchive`
containing workspaces, the research dossier and excerpts with mutual
checksums. Separate restores can leave references unresolved. This record
proposes a design for review; it does not authorize implementation, change
existing export formats, or add requirement wording. Numbers 0007–0009 are
reserved for other work.

### Current contracts at base 269a91c4b377b2c359890360059400aa32b06226

| Authority | Existing format and behavior | Code evidence |
|---|---|---|
| Workspace storage | `jarbou3i-model-workspaces`, database version 2, `workspaces` plus `recovery-journal`; writes transact only on the workspace store | `src/core/workspace-storage.js:5`, `src/core/workspace-storage.js:49`, `src/core/workspace-storage.js:84` |
| Workspace export | `jarbou3i-local-workspace` format 3 inside `jarbou3i-workspace-bundle` artifact version 1; contains revisions, draft, review and resolution ledgers | `src/core/workspace-contract.js:6`, `src/core/workspace-contract.js:180`, `src/core/workspace-contract.js:266` |
| Bundle integrity | SHA-256 over workspace and protected content (artifact, version, semantics, workspace); `exported_at` is outside that protected content; parser verifies before migration | `src/core/workspace-contract.js:269`, `src/core/workspace-contract.js:280`, `src/core/workspace-contract.js:291` |
| Dossier storage/export | `jarbou3i-research-dossier`, formats 1 and 2, in `jarbou3i-model-dossiers` database version 1, store `dossiers`; export is the sealed record itself | `src/core/research-dossier.js:16`, `src/core/research-dossier.js:388`, `src/core/research-dossier.js:395`, `src/core/research-dossier.js:438`, `src/core/research-dossier.js:495` |
| Sources and excerpts | Format 2 owns both lists, excerpt checks and optional promotion pointers; source-free writes use format 1 | `src/core/research-dossier.js:222`, `src/core/research-dossier.js:252`, `src/core/research-dossier.js:266`, `src/core/research-dossier.js:388` |

The dossier's `analyses` references carry `workspace_id`, `revision_id`,
`payload_checksum` and `linked_at` (`src/core/research-dossier.js:163`).
Promotion pointers carry workspace, revision and evidence IDs, kind, time
and `changed_since`, but no payload checksum
(`src/core/research-dossier.js:222`). Shape validation alone does not prove
those targets exist. ADR-0006 makes the committed revision the proof, not
the pointer or an excerpt check.

Both current file restores are create-only: dossier restore verifies the
record and refuses an existing ID (`src/app.js:11212`); workspace restore
verifies the bundle and creates it (`src/app.js:11478`). File limits are
28 MiB and 25 MiB respectively (`src/app.js:11215`, `src/app.js:11480`).
Repository replacement requires the observed revision and exactly one
increment (`src/core/workspace-storage.js:217`,
`src/core/research-dossier.js:618`). No existing cross-database commit is
available (`src/core/workspace-storage.js:87`,
`src/core/research-dossier.js:528`).

## Decision

**Recommendation for owner review:** add an independent JSON archive
envelope that embeds existing verified exports unchanged. Retain separate
database owners and the existing standalone export/import paths. The
rules below remain proposed except for the bounded owner decision recorded
below; unresolved choices are listed at the end.

**Owner decision a282 (2026-11-25):** v1 exports complete cases only, with
full reference closure and no partial archives. One dossier owns the case,
with zero or more required workspaces. Restore never overwrites: create-only
refusal applies to any existing dossier or workspace ID, including identical
records. This closes questions 1 and 3. Status remains Proposed; atomic
restore remains blocked on its separate coordination design.

### Envelope schema and mutual integrity

Proposed v1 shape (type notation, not a literal example file):

```text
Jarbou3iCaseArchive = {
  artifact: "Jarbou3iCaseArchive",
  artifact_version: 1,
  exported_at: ISO8601,
  dossier: ExistingSealedDossier,
  workspaces: ExistingWorkspaceBundle[],
  manifest: {
    dossier: { dossier_id: string, revision: integer, sha256: hex64 },
    workspaces: [{ workspace_id: string, repository_revision: integer,
                   sha256: hex64 }],
    references: [{ workspace_id: string, revision_id: string,
                   payload_checksum: hex64 }]
  },
  checksum: { algorithm: "SHA-256", protected_content: hex64 }
}
```

One dossier owns the case; `workspaces` supports several analyses rather
than silently selecting only the active answer. Proposed complete archives
include the union of workspace IDs referenced by `analyses` and excerpt
promotion pointers. A framing-only dossier can have an empty workspace
list. Do not include unrelated workspaces. Missing targets block a complete
export; owner decision a282 rules out partial archives in v1.

`dossier.excerpts` is the sole excerpt copy. There is no parallel top-level
excerpt list, attachment body or second source of truth. Preserve source,
excerpt and promotion IDs, checks, rationale, times and `changed_since`.

Use the existing canonical JSON and UTF-8 SHA-256 implementation
(`src/core/canonical-json.js:16`, `src/core/canonical-json.js:39`). Hash each
whole embedded bundle and sealed dossier for its manifest entry. Hash the
entire envelope excluding only the outer `checksum` for
`protected_content`; this includes `exported_at` and the manifest. Require
an exact manifest-to-member match, unique IDs, no extra members and stable
workspace/reference ordering by IDs. Object key order is canonicalized;
array order remains significant. References are deduplicated by workspace
and revision and must equal the union derived from the dossier. Resolve
each to the embedded immutable revision and compare its payload checksum.
For a promotion-only target, derive the manifest payload checksum from that
revision rather than adding a checksum field to the pointer. Also check
promotion evidence IDs against the indicated revision using the
appropriate lens contract. Never infer promotion success from text equality.

These are mutual checks through one manifest binding dossier, workspaces
and their relationships, not circular hashes inserted into existing records.
Keep each member's existing checksum and verification as well. A substituted
valid dossier or bundle fails the outer/member binding; a recomputed outer
hash cannot excuse an invalid inner record or reference.

### Versioning and export consistency

Archive versioning is independent of bundle, workspace, dossier, lens and
database versions. Reject unknown archive versions before persistence;
reject unsupported nested versions without discarding local records. Verify
original archive/member hashes before any existing workspace migration;
validate the migrated result separately. A later envelope contract needs an
explicit version and migration policy, never an opportunistic rewrite.

Export reads the dossier and required workspaces, verifies them and their
references, then rereads their revisions and content hashes before producing
the file. A change or deletion restarts or refuses export rather than mixing
observations. This detects concurrent changes; it is not a cross-database
snapshot transaction. A stronger snapshot requirement needs the same
coordination decision as restore.

### Atomic restore and conflicts

1. Parse and validate the entire bounded archive in memory, verify outer,
   member and existing inner checksums, then resolve every reference. No
   persistent writes or active-case changes during preview or cancellation.
2. Prepare a restore plan containing every target ID, verified member hash
   and observed local state. Owner decision a282 requires create-only for the
   whole archive: any existing workspace or dossier ID rejects it, including
   identical records. Do not merge, overwrite, remap IDs or skip members.
3. At commit, recheck absence under coordinated write protection. A race,
   concurrent edit, reset, quota error or storage failure aborts the whole
   restore. A stale preview must be rebuilt; never silently replay it over
   changed local state.
4. Publish success and permit opening the restored case only after every
   member is durably committed. After interruption/restart, readers must see
   either all original state or all restored state, never a partial case.
   Recovery must be idempotent and must not delete another tab's later work.

Calling the existing `create` methods sequentially cannot meet step 4, nor
can a catch block that deletes earlier writes. IndexedDB transactions do
not span these databases. **Implementation is blocked on a reviewed atomic
coordination design.** The recommended direction to investigate is durable
staging plus a single publication marker, with all readers/writers/reset
paths respecting pending operations and recovery before exposing records.
That requires an explicit storage/reset/rollback compatibility decision;
this ADR does not assign a new database or change existing schemas. Older
apps ignore a new marker, so staging records directly in live stores is
insufficient. If compatibility cannot be proved, refuse restore rather than
label best-effort writes atomic. Database consolidation would require a
separate decision revisiting ADR-0004.

### Import trust limits

Checksums detect inconsistency; they do not authenticate an author or prove
source truth. An attacker can recompute every checksum. Validate record
shapes, supported lens/schema identity and existing analysis validation,
ledger invariants, reference targets and numeric/string bounds independently.
Excerpt checks stay human claims; import never promotes excerpts, executes
resolution operations, fills evidence, fetches source URLs or grants a
publication judgement.

Treat all strings as untrusted display data, never HTML or executable input.
Use explicit field construction rather than merging imported properties
into app state. Check total bytes before reading/parsing, plus nesting,
member counts and nested limits before expensive work. Preserve existing
standalone limits; calculate aggregate archive and memory bounds from
maximal fixtures before selecting numeric archive limits. JSON avoids ZIP
path traversal and decompression; attachments and remote downloads are out
of this proposal. Nothing writes if a limit or check fails.

## Options Considered

| Option | Complexity / cost | Capacity and maintenance | Benefit | Cost or limitation |
|---|---|---|---|---|
| Keep independent files | Low; existing code | Current per-file bounds | No new storage protocol | Leaves A12's orphaned-link risk to the analyst |
| New envelope, separate authorities (recommended) | Medium format work; high restore coordination work | Larger files and bounded in-memory verification; reuses current validators | One verifiable relationship set, existing exports preserved | Atomic restore needs a new reviewed protocol and reader/reset integration |
| Consolidate databases or expand existing bundle | High migration and compatibility cost | Could allow one transaction after consolidation | Simpler commit boundary once migrated | Revisits ADR-0004 or changes the existing format; outside this task's scope |

## Trade-off Analysis

The envelope addresses transport integrity without moving evidence or
duplicating excerpts. It preserves rollback boundaries of the current
formats but does not inherit atomic persistence from them. Create-only
restore limits conflict complexity at the cost of refusing a repeat import.
The code establishes existing format expertise; team experience with a
cross-database recovery protocol is unknown. No performance or delivery
claim follows from choosing JSON.

## Consequences

- A complete archive can prove which dossier references match which
  immutable revision payloads; it cannot prove the research is correct.
- Existing exports remain usable independently, with their current limits
  and unresolved-link behavior. This proposal adds no reciprocal dossier
  fields to workspace records and changes no canonical analysis authority.
- Restore release depends on crash, concurrency, reset and rollback proof;
  successful pure roundtrip tests alone are insufficient.

## Action Items

### Failing-first roundtrip test plan

Slices 1–3 add only `src/core/case-archive.js` and its deterministic
`tests/case-archive-check.mjs` transport checks. The pure API snapshots its
inputs, preserves original members, verifies existing inner contracts and
requires an injected `validatePayload(payload, identity)` returning
`{ valid: true }` from the existing appropriate lens validator. Missing
validation fails closed for nonempty archives. No repository reads or writes
occur here; consistency rereads, aggregate limits and restore tests below
remain work for later slices. Run `npm run test:case-archive` directly or
through `npm run test:ci:no-browser`.

Begin with an archive test that fails because the archive API is absent;
do not count the existing dossier-only roundtrip as archive coverage. Use
fixed clocks/IDs and both lenses. Build a dossier with two linked workspaces,
multiple immutable revisions, draft, ledgers, source/excerpt checks and
promotion pointers. Export, serialize/parse, restore into empty repositories,
reread and export again. Compare all embedded records, IDs, payload/checksum
values and relationships; allow only an explicitly injected export time to
change. Include a framing-only format-1 dossier.

Then require failures before any write for a changed excerpt, source,
payload, ledger, manifest, member hash or outer hash; swapped independently
valid members; recomputed outer checksum with invalid inner content; wrong
payload checksum, missing revision/evidence/source, duplicate IDs, omitted
or extra member, unsupported versions, malformed JSON and boundary limits.
Assert both repositories and the active case remain unchanged on rejection.

For the selected coordinator, inject failure before/after every durable
stage and publication operation, quota exhaustion, cancellation and reload.
Assert all-or-none visibility through both list and get, repeat recovery,
concurrent create/edit/reset, and existing-ID refusal for either member type.
Use real IndexedDB/browser coverage for transaction lifetime and cross-tab
behavior; memory mocks cannot prove atomicity. Retain legacy bundle/dossier
fixtures and rerun their current tests to detect format drift.

### Build slices after decisions are accepted

Each slice is a bounded work session of at most 60 minutes; stop and split
unfinished work rather than treating the estimates as a delivery promise.

| Slice | Time box | Reviewable result / gate |
|---|---|---|
| 1 | 45 minutes | Red deterministic full-case roundtrip fixture and missing-API failure |
| 2 | 60 minutes | Pure envelope writer/parser, canonical hashes and inner verification; no persistence |
| 3 | 60 minutes | Reference closure, promotion target validation and negative integrity cases |
| 4 | 45 minutes | Maximal-fixture aggregate bounds and accepted archive-limit proposal |
| 5 | 60 minutes | Atomic coordinator design/spike with crash and old-reader counterexamples; stop for separate storage decision |
| 6 | 60 minutes | After that decision, staging/recovery primitive with failure injection; keep restore unavailable |
| 7 | 60 minutes | Publication/read-write-reset coordination and concurrent conflict tests; split by path if needed |
| 8 | 60 minutes | Restore preview/commit integration only after atomicity gates pass |
| 9 | 60 minutes | Real IndexedDB crash/reload/cross-tab checks and legacy-format regression evidence |

Run `npm run test:ci:no-browser` for each implementation candidate; separately
run the selected browser tests before enabling restore. Pure transport checks do not establish the later persistence guarantees.

### Open questions requiring owner or implementation review

1. **Closed — a282, 2026-11-25:** v1 requires complete reference closure;
   partial archives are excluded. One dossier with zero or more required
   workspaces is the scope.
2. Which durable staging/publication protocol, storage location and reset
   behavior can satisfy atomic visibility across tabs and app rollback? Does
   the product require a strict export snapshot as well?
3. **Closed — a282, 2026-11-25:** v1 restore is create-only and refuses any
   existing ID, including identical records. Replacement, reuse and
   copy/remapping remain outside v1.
4. What measured total byte, nesting and workspace-count bounds fit supported
   devices without excluding valid cases? What extension/fallback UX should
   distinguish this file from the existing standalone exports?
