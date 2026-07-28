# REL-AUTH-1 — Product Authority Baseline

## Decision

`2.1.0-alpha.55` is the authoritative product version for the revision-history
and safe-restore production state. `REL-AUTH-1` is an unnumbered governance
initiative, not Alpha.56.

`package.json` is the development authority. `package-lock.json`,
`index.html`, README release identity, runtime exports, evidence manifests, and
tests are derived or validated mirrors. Compatibility namespaces remain
independent under `VERSIONING.md`.

## Observed baseline

The repository already contains strong authorities for canonical evidence,
provenance assessment, claim–evidence traceability, source clustering, review
planning, operational review, resolution, immutable revisions, restoration, and
export.

The research lifecycle is incomplete before those authorities:

| Reference task | Current path | Baseline classification |
|---|---|---|
| Create a research case | Enter topic/context and choose source-access mode | Partial; scope and completion criteria are not durable case objects |
| Register three sources | Supply them through generated material or canonical analysis input | Partial; no first-class source register |
| Extract observations with locators | Author complete evidence records in canonical data | Partial; source statement and analyst inference are not a dedicated intake workflow |
| Connect evidence to claims | Use authored evidence references and traceability projection | Complete after canonical input exists |
| Identify an unsupported claim | Use evidence gaps, provenance diagnostics, and review queue | Complete |
| Resolve a reviewer objection | Use review ledger and resolution transaction | Complete |
| Export a defensible report | Export canonical JSON, standalone HTML, and derived evidence artifacts | Complete |
| Restore a previous revision | Compare history and approve append-only restoration | Complete |

This baseline supports `RESEARCH-1`; it disproves the need for another evidence
model or generic dashboard.

## Human workflow benchmark

Automated browser duration is not analyst productivity evidence. A human
benchmark is required before Alpha.56 scope is frozen.

Use one fixed Strategic case and one fixed Biopolitical case. For each case,
record:

| Metric | Definition |
|---|---|
| Completion time | Start of case setup to successful report export |
| Active time | Completion time excluding deliberate reading pauses |
| Recovery time | Time spent reconstructing source provenance during review |
| Input errors | Rejected, corrected, or re-entered data |
| Navigation reversals | Returns caused by unclear workflow location |
| Duplicate entry | Source or evidence data entered more than once |
| Unsupported claims found | Material claims surfaced without evidence disposition |
| Reviewer clarification requests | Questions required to understand provenance or inference |

The benchmark must use screen recording or observer timestamps and preserve the
case files. Minimum sample: three completed runs per lens, with at least one
first-time analyst run. Median and range must be reported; a single expert run
is not a baseline.

## Alpha.56 decision rule

Freeze `RESEARCH-1` only if the benchmark confirms that provenance
reconstruction, source registration, or evidence-to-claim connection is a
material bottleneck.

Alpha.56 is disproven as the correct next release if:

- the dominant friction lies elsewhere;
- the dossier requires duplicate canonical sources or claims;
- it becomes a bibliography disconnected from review and export;
- verification state is lost across lenses or outputs; or
- the reference workflow does not improve materially.

## REL-AUTH-1 acceptance

- All required version surfaces resolve to `2.1.0-alpha.55`.
- The dedicated version-authority contract passes in CI.
- The capability map is linked from the documentation authority index.
- Historical version records remain intact.
- Full no-browser and browser authorities pass on the exact commit.
- Production evidence and deployment identify the same accepted commit and
  product version.
- Human benchmark results are recorded before Alpha.56 scope is frozen.
