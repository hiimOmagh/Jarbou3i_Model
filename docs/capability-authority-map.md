# Capability Authority Map

**Product version:** `2.1.0-alpha.55`
**Baseline commit:** `228ab9b67f541370e29465eff83b012dd411c0db`
**Governing initiative:** `REL-AUTH-1`

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
| Comparison | Semantic cross-analysis comparison | Planned | `COMPARE-1` | Classify evidence, scope, interpretation, confidence, and judgment changes |
| Challenge | Systematic reasoning challenge and disposition | Planned | `CHALLENGE-1` | Extend the existing review/adjudication authorities |
| Learning | Forecast and outcome calibration | Planned | `CALIBRATE-1` | Establish observable outcomes and scoring |
| Collaboration | Multi-user accounts and hosted coordination | Planned | `PRODUCT-MODEL-1` decision gate | Do not build before single-analyst demand is proven |
| Governance | Exact-commit CI, evidence, and deployment | Complete | Protected `main`, CI workflows, deployment operations | Maintain outcome focus; test count is not a product metric |
| Governance | Product-version authority | Complete after `REL-AUTH-1` acceptance | `package.json` plus validated mirrors | CI and production must prove the normalized version |

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

## Roadmap order

```text
REL-AUTH-1
→ RESEARCH-1
→ COMPARE-1
→ CHALLENGE-1
→ CALIBRATE-1
→ PRODUCT-MODEL-1
```

Work outside this order requires an observed production defect, security issue,
or measured user bottleneck.
