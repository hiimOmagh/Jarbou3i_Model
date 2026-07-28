# Capability Authority Map

**Product version:** `2.1.0-alpha.55`

**Operational runtime baseline:** `df41acca4dbf09e753104f22db18702c5e52da7e`

**Accepted authority initiative:** `REL-AUTH-1`

**Proposed roadmap authority:** Strategic Product Roadmap v3.0

**Proposed execution authority:** Product + UI Execution Plan v1.0

This document is the current authority for product capability status. Historical
Alpha, phase, audit, and handoff documents remain implementation evidence; they
do not override this map.

## Status vocabulary

| Status | Meaning |
|---|---|
| Complete | A coherent user workflow exists and is protected by acceptance contracts. |
| Partial | Useful primitives exist, but the user workflow or lifecycle is incomplete. |
| Experimental | Available behind an explicit limitation or progressive-enhancement boundary. |
| Planned | Accepted roadmap scope without a production capability. |
| Retired | Deliberately removed from the active roadmap or superseded. |

## Product capabilities

| Layer | Capability | Status | Current authority | Principal gap or next action |
|---|---|---|---|---|
| Intake | Question, context, language, and source-access mode | Partial | Application setup and prompt generation | No durable research-case scope, contested-term register, or completion criteria |
| Intake | Research dossier | Planned | `RESEARCH-1` | Compose existing evidence authorities; do not create a second evidence model |
| Measurement | Human task benchmark | Planned | `GATE-0` benchmark contract | Run at least three comparable completed trials per lens before Alpha.56 is frozen |
| Evidence | Canonical evidence records and provenance assessment | Complete | Lens schemas, provenance service, integrity gates | Preserve source claim versus analyst inference distinction in the next intake workflow |
| Evidence | Source clustering and gap intelligence | Complete | Evidence intelligence projection | Promote gaps into the research dossier without duplicating storage |
| Evidence | Claim–evidence traceability | Complete | Evidence traceability projection and derived manifest | Add first-class source/observation capture before analysis import |
| Evidence | Source verification workflow | Partial | Verification fields, publication gate, review queue | Registration, observation extraction, freshness, and verification disposition are fragmented |
| Analysis | Strategic lens | Complete | Strategic schema, validator, integrity service, adapter | Measure analyst task performance |
| Analysis | Biopolitical lens | Complete | Training Map v2 schema, validator, integrity service, adapter | Measure analyst task performance |
| Analysis | Additional lenses | Retired | Roadmap decision | No new lens until the two current lenses are operationally validated |
| Review | Results orientation, explanation, and inspection | Complete | Read-only result projections | Validate comprehension with real analysts |
| Review | Relationship explorer | Complete | Shared relationship authority and accessible list | Spatial view remains progressive enhancement |
| Review | Spatial relationship view | Experimental | Capability-gated renderer | Keep non-canonical and accessible fallback equivalent |
| Review | Evidence review queue and plan | Complete | Derived review-plan authority | Connect future dossier gaps to the same queue |
| Review | Operational review ledger | Complete | Hash-chained local ledger | Local identity is not externally verified |
| Adjudication | Exact proposal, approval, and resolution | Complete | Resolution transaction and ledger | Preserve one canonical state |
| Recovery | Crash-safe draft recovery | Complete | Recovery journal | Maintain separation from canonical revision history |
| Recovery | Revision history, comparison, and safe restore | Complete | Alpha.55 revision authority | Add cross-case comparison separately under `COMPARE-1` |
| Publication | Canonical JSON and standalone HTML | Complete | Export contracts and report renderers | Preserve dossier verification state in Alpha.56 |
| Publication | Evidence appendix and derived manifests | Complete | Evidence intelligence/review-plan exports | Unify with research intake without parallel truth |
| Interchange | Import, validation, and bounded repair | Complete | Parser, validators, migration, and lens adapters | Keep semantic claims outside automatic repair |
| Experience | Analytical Command Center overhaul | Planned | `UX-0`, `UIX-1` through `UIX-4` | Validate the target experience, then migrate complete workflows without a big-bang rewrite |
| Comparison | Semantic cross-analysis comparison | Planned | `COMPARE-1` | Classify evidence, scope, interpretation, confidence, and judgment changes |
| Challenge | Systematic reasoning challenge and disposition | Planned | `CHALLENGE-1` | Extend the existing review/adjudication authorities |
| Decision | Decision and conditional-scenario support | Planned | `DECIDE-1` | Bind options, trade-offs, affected populations, assumptions, tripwires, and rationale to exact analysis revisions |
| Learning | Forecast and outcome calibration | Planned | `CALIBRATE-1` | Establish observable outcomes and scoring |
| Collaboration | Multi-user accounts and hosted coordination | Planned | `PRODUCT-MODEL-1` decision gate | Do not build before single-analyst demand is proven |
| Governance | Exact-commit CI, evidence, and deployment | Complete | Protected `main`, CI workflows, deployment operations | Maintain outcome focus; test count is not a product metric |
| Governance | Product-version authority | Complete | `package.json` plus validated mirrors; `REL-AUTH-1` | Keep initiative, roadmap, runtime baseline, and product version as distinct identities |
| Governance | Long-workflow browser reliability | Complete with watch condition | `CI-REL-1` | Reopen if either governed workflow exceeds 80 seconds, requires retry, or fails a bounded storage operation |

## Canonical ownership rules

1. Evidence, claims, review events, resolutions, revisions, and exports must
   reuse their current authorities.
2. A research dossier may orchestrate existing objects but must not introduce a
   second canonical evidence or claim store.
3. Strategic and Biopolitical adapters remain equal lenses over shared platform
   services.
4. UI, HTML, JSON, evidence artifacts, and history are projections of one
   validated analytical state.
5. AI material remains proposed until evidence, provenance, and human
   disposition are recorded.

## Authority boundaries

| Identity | Meaning | Current value |
|---|---|---|
| Product version | User-visible compatibility and release identity | `2.1.0-alpha.55` |
| Operational runtime baseline | Latest accepted commit that changed the governed operational baseline | The SHA declared in this document header |
| Initiative | A bounded capability or assurance change | `REL-AUTH-1`, AI interchange completion, `CI-REL-1` |
| Roadmap version | Proposed product sequence; not a release claim | Strategic Product Roadmap v3.0 |
| Execution-plan version | Proposed delivery and UI-migration program | Product + UI Execution Plan v1.0 |

Roadmap and execution-plan documents become repository planning authority only
after review and acceptance. They do not change the product version, claim a
runtime capability, or supersede schema and export contracts.

## Proposed execution order

```text
BR-0 Authority reconciliation
→ GATE-0 Human benchmark
→ UX-0 Target-experience proof
→ UIX-1 Design-system kernel
→ UIX-2 Modern shell
→ RESEARCH-1A Case workspace
→ RESEARCH-1B Intake lifecycle
→ RESEARCH-1C Promotion continuity
→ UIX-3 Results cockpit
→ UIX-4 Operations and exports
→ COMPARE-1
→ CHALLENGE-1
→ DECIDE-1
→ CALIBRATE-1
→ PRODUCT-MODEL-1
```

`GATE-0` may falsify this order. Work outside it requires an observed production
defect, security or privacy issue, canonical-integrity failure, critical
accessibility blocker, sustained reliability regression, or a measured user
bottleneck that changes the priority.
