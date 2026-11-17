# el Jarbou3i — next-generation phase plan

Proposal for owner review, 2026-11-17; not implementation or release authorization.
This task adds this file only. No prototypes, production changes, commits or pushes are included.
Evidence is the working tree on `ux0-preview`, HEAD `143e170942e9b6b17e4b945714cdf43306571c6b`.
Pre-existing edits include ADR status changes and QA files; working-tree facts do not prove merged or released behavior.
Commands below are future acceptance criteria, not executed results. `NEW` means a proposed check to implement in its phase.

## 1. Vision and measurable outcomes

Make el Jarbou3i an understandable instrument for framing a question, asking an external AI,
testing its answer against evidence, and publishing a traceable record in either lens.
“Next generation” means a better complete analytical journey, with a coherent visual identity;
it does not mean a new framework, a larger feature list, or a predetermined dashboard.
The existing journey and provider boundary are documented in `README.md:40` and `README.md:171`.

Targets below are proposed acceptance thresholds. Current human performance is **unverified**;
Phase 1 establishes persona/heuristic baselines, not human measurements. Human thresholds require **Phase 5 evidence**
against a matched legacy baseline; report raw counts and locale/lens strata, never population-wide claims from a small pilot.

| Outcome | Measurable target | Evidence owner |
|---|---|---|
| Clear orientation | Phase 1: persona/heuristic orientation baseline. Phase 5 evidence: at least 90% of observed task starts identify location and next action within five seconds. | Design + human QA |
| Easier complete journey | Phase 1: persona/heuristic friction baseline. Phase 5 evidence: at least 90% unassisted fixed-task completion; median active time at least 20% below matched human legacy baseline, with no lens/locale stratum losing success. Exclude external AI waiting. | Product + QA |
| Honest analytical meaning | Phase 1: heuristic audit of draft/verification/publication cues. Phase 5 evidence: every participant distinguishes them; zero observed false publication approvals in seeded blocked cases. | Domain + Language |
| Recoverable work | All scripted reload, quota, conflict, corrupt-file and paired-restore cases preserve authored material or show an explicit recoverable failure; zero silent loss. | Security/Data + QA |
| Equal access | Both lenses × AR/EN/FR pass core journeys; zero unresolved blocking a11y defects. Phase 1: AR/EN persona/heuristic access baseline. Phase 5 evidence: native-language/AT/physical-device dispositions at the release SHA. | Language + human QA |

If a target fails, investigate and iterate; visual preference alone cannot override it.
This is a new discovery requirement, not a claim that the historical Gate 0 ran.

## 2. What is questioned, and what stays authoritative

The owner has reopened all UX/UI. Research may question naming, information architecture,
step order, navigation, density, visual identity, typography, themes, onboarding, error recovery,
case/workspace presentation, review surfaces and report presentation. Question even whether
the current case-file metaphor best fits real work. Compare alternatives before choosing.
Historical direction is context, not a next-generation selection (`docs/decisions/0002-select-case-file-and-waive-gate0.md:24`).
Readex Pro is the current decision, not a prohibition on proposing another self-hosted face
(`docs/decisions/0003-self-hosted-typeface.md:20`). Any replacement needs an explicit superseding decision.

| Keep | Boundary and evidence |
|---|---|
| Native ESM, static delivery, offline/no-network application | Preserve native browser modules, local assets and no runtime backend, telemetry, remote fonts or provider calls. External AI remains a user-mediated copy/paste boundary. `docs/phase0/PM-BRIEF.md:9`; `docs/product-ui-execution-plan.md:52`; `README.md:173`. Hosting initially serves assets; disconnected first installation is not a verified capability. |
| Both lens authorities | Strategic schema `1.1.0`; Biopolitical schema `2.1.0`, `biopolitical-training-map-v2`; equal platform access. Never flatten one lens into the other. `docs/product-ui-execution-plan.md:43`. |
| One canonical state and stable formats | UI projects authorities, never owns a second analysis/evidence/review copy. Preserve workspace v3, bundle v1, ledger and recovery identities; dossier formats 1/2 remain separate from database version 1. `docs/decisions/0001-benchmark-before-runtime-ui-migration.md:34`; `docs/VERSIONING.md:27`; `docs/decisions/0005-sources-in-the-dossier-record.md:36`. |
| Import, evidence and publication discipline | Interchange is a generation interface, not storage or certification; canonical-only new imports, disclosed normalization/quarantine, continuation and targeted completion; no invented evidence or AI self-approval. `docs/ai-interchange-contract-v1.md:9`, `:64`, `:316`. |
| Recovery and human disposition | Preserve immutable revisions, recovery, review/resolution authorities, optimistic conflicts and failure visibility. Promotion requires a human committed resolution; case pointers are separate writes. `README.md:30`; `docs/decisions/0006-promotion-through-resolution.md:33`, `:57`. |
| Export contract | Lossless canonical JSON, equivalent escaped embedded payload, metadata, lens-specific reports, provenance note and publication blockers. Presentation can change; analytical meaning and transport cannot. Report language/direction follows imported analysis, independently of UI locale. `docs/export-contract.md:5`, `:16`, `:18`, `:29`, `:35`. |
| AR/EN/FR, RTL and accessibility | Both lenses, light/dark, keyboard, AT, mixed-direction text, 320px/400% reflow, forced colors, reduced motion and print remain acceptance requirements. No English-only release slice. `docs/product-ui-execution-plan.md:236`; `docs/operations/manual-release-review.md:37`, `:45`, `:70`. |

Prototype approval authorizes the selected experience, not changes to these contracts.
A proposed contract change needs a separate ADR, version/compatibility analysis and explicit migration/rollback decision before implementation.
Existing DOM hooks may migrate through a recorded compatibility decision and updated consumers/tests;
they are not a reason to preserve the old layout (`docs/product-ui-execution-plan.md:56`).
Do not hand-edit generated validators or combine schema migration with a UI slice.

## 3. Phases and acceptance gates

Sizes are relative planning estimates: S = one bounded deliverable; M = several focused PRs;
L = multiple complete journeys. They are not dates or staffing commitments. PM splits phases into
intake rows and reuses matching PM104 work rather than creating duplicate backlog items.
Each row and subrow requires independent different-model review; pairings below are proposed,
with availability **unverified**. No review is claimed by this document.

| Phase | Goal and scope | Entry → exit gate | Command-provable done-check | Dependencies | Size / owner team | Builder → independent reviewer |
|---|---|---|---|---|---|---|
| 1 — Discover and prototype | Agent persona/heuristic walkthroughs of the real app and 2–3 distinct static prototypes outside `src/`; core happy path plus blocked/invalid framing and intake, AR RTL + EN only. Compare and recommend one. | Entry: scope admitted; safe cases ready. Exit: agent baselines, comparison and recommendation; ONE owner walkthrough of the package, looks and says approve/decline only, no questionnaire. Exact prototype approval closes phase; decline keeps it open. Human usability remains unverified. | NEW `node scripts/next-gen/check-prototype.mjs --strict` plus NEW `node scripts/next-gen/check-owner-decision.mjs --prototype` | None; no recruitment or MAN evidence gate; reuse benchmark kit, not its waiver. | L / Design + Product + Language | sol design synthesis → astra critique |
| 2 — Make delivery and migration safe | Revalidate Phase 0 findings; close applicable PM104 safety prerequisites; baseline performance/dependency seams, format inventory, recovery/export fixtures and enforceable approval records. Record architecture and migration decisions. | Entry: Phase 1 approval. Exit: exact-SHA checks, documented authority map, tested negative release/approval paths, no open data-loss/release-authorization blockers. | `npm run test:ci:contract`; NEW `node tests/next-gen-readiness-check.mjs --self-test`; `npm run test:workspace`; `npm run test:dossier`; `npm run test:ai-interchange` | 1; reconcile PM104 A–J and K/L/R admission requirements. | M / Architecture + DevOps + Security/Data + QA | sol implementation → astra security/architecture review |
| 3 — Establish the approved foundation | Implement tokens, components and shell; extract necessary controller/localization seams; migrate intake → copy → import. Expand intake failure/locale/print/viewport matrix below; add tested `?ui=legacy` fallback. | Entry: prototype scope matches; Phase 2 passes. Exit: task parity, truthful status, keyboard/RTL and compatible import/export bytes; fallback works; owner opens preview link/static build and approves/declines only. | `npm run test:static`; `npm run test:platform:runtime`; `npm run test:locale:inventory`; NEW `node scripts/run-playwright.mjs tests/next-gen-intake.spec.js tests/next-gen-foundation.spec.js` | 1–2; relevant PM104 M/N seams. | L / Frontend + Architecture + Language + QA | sol implementation → astra UX/a11y and authority review |
| 4 — Migrate complete analytical journeys | Move framing/sources/excerpts, results, evidence, review/resolution, saved work/history, recovery and exports in bounded slices. Complete full failure/locale/print/viewport matrix below, paired restore and partial-failure handling. | Entry: 3 parity. Exit: every old task accounted for, both-lens/locale parity, restore/conflict/reload evidence, no duplicate authority; owner opens preview link/static build and approves/declines only. Keep legacy entry until Phase 5 exit. | `npm run test:workspace`; `npm run test:dossier`; `npm run test:promotion`; NEW `node scripts/run-playwright.mjs tests/next-gen-journeys.spec.js tests/paired-backup.spec.js tests/promotion-recovery.spec.js`; `node scripts/run-playwright.mjs tests/export-contract.spec.js tests/export-completeness.spec.js` | 3; applicable PM104 S/T/U; storage or authority changes require their own reviewed slices. | L / Frontend + Security/Data + Architecture + Language + QA | sol implementation → astra data/UX review; terra language drafting → sol independent review |
| 5 — Validate and release | External analyst panel measures matched legacy/new tasks; close MAN-001–004 native-language/AT/touch/zoom/print evidence; verify performance/privacy/deployment; prepare release PR and rollback rehearsal. | Entry: 4 complete. Exit: human outcomes and MAN-001–004 dispositions at release SHA, exact-head CI green; owner approves release; agents deploy/tag/verify/back-merge. Missing humans holds release; no agent substitution. Retire legacy only after exit. | `npm ci`; `npm run test:ci:no-browser`; `npm run test:ci:browser`; NEW `node scripts/next-gen/check-release-evidence.mjs --strict`; `npm run test:browser:deployed` with explicit deployed base URL | 1–4; externally supplied panel; supported-origin and approval enforcement resolved; MAN-001–004. | M / QA + Language + DevOps + Product + human reviewers | sol release preparation → astra independent release review |
| 6 — Evaluate next capabilities | Use observed demand to consider compare/challenge/decision/calibration, onboarding refinements and further analytical support. Prepare one falsifiable capability brief at a time, keeping offline dual-lens boundaries. | Entry: verified release and follow-up research. Exit: ranked go/no-go evidence and bounded next scope; new UI behavior returns to prototype approval. No automatic feature implementation. | NEW `node scripts/next-gen/check-capability-briefs.mjs --strict` validates evidence, alternatives, contract impact, reviewer findings and go/no-go records. | 5; research access and measured unmet jobs. | S per brief / Product + Design + Domain + Architecture | sol synthesis → astra challenge |

All listed commands must exit 0; running them proves only their stated checks.
NEW tools must include negative fixtures: missing/stale/fabricated evidence fails, never silently skips.
They are future work, not files added now. Verify existing commands against the package at each row's start.
Full required CI is additional to focused phase checks. Mixed legacy/new UI lasts at most two accepted migration
milestones (`docs/decisions/0001-benchmark-before-runtime-ui-migration.md:71`): Phase 3 foundation and Phase 4 completion.
Phase 4 slices converge to a complete new UI; the isolated legacy rollback entry persists through Phase 5, not a mixed shell.
Phase 2 must record this distinction in the compatibility decision; if it conflicts with the ADR, obtain a superseding decision before migration.

Runtime coexistence and deferred matrix:

- Document a zero-build native-ESM entry selector: default loads the migrating/new UI, `?ui=legacy` loads
  the preserved legacy UI exclusively. Both use the same canonical authorities/formats; never mount both or duplicate state.
  Keep local legacy assets and the switch until Phase 5 exit; test selection, reload, saved work and export parity in Phases 3–5.
- On regression, agents provide the owner an openable legacy URL/static build and revert the default selector to legacy
  in a reviewed static change; preserve authored data. Rehearse paired backup/restore and format compatibility before rollback.
  This switch is proposed work, not a currently verified runtime feature or a server flag.
- Phase 3 covers intake empty/busy/invalid/partial/cut-off/stale/offline/unsaved/completion/blocked states;
  Phase 4 covers corrupt files, quota/conflict, restore, resolution confirmation and blocked publication across complete journeys.
  Each applies both lenses × AR/EN/FR, RTL/mixed IDs, light/dark, desktop/tablet/phone, 320px/400% reflow,
  forced colors, reduced motion, keyboard/AT automation and print; native/AT/device human evidence remains Phase 5.
- At Phase 3 and Phase 4 exits agents supply a revision-bound preview link or runnable static build the owner can open,
  with changes, limits and fallback link visible. Record approve/decline only; decline holds the milestone. No owner commands or questionnaires.

Per-phase resource placeholders (agent turns / total tokens, including builder, review and repairs):
P1 `[turns: TBD; tokens: TBD]`; P2 `[turns: TBD; tokens: TBD]`; P3 `[turns: TBD; tokens: TBD]`;
P4 `[turns: TBD; tokens: TBD]`; P5 `[turns: TBD; tokens: TBD]`; P6 `[turns: TBD; tokens: TBD per brief]`.
PM fills numeric caps before admitting rows, splits phase totals into row caps and logs actual usage; placeholders authorize no unbounded run.
Use harness turn discipline (about 12 turns per tick); stop at the tighter row/phase cap and escalate with evidence rather than silently extending it.

Phase 1 research and prototype contract:

- Agents walk the real app and prototypes as first-use and returning analyst personas, covering both lenses.
  Record heuristic friction, orientation and blocker comprehension using fixed fictitious cases; no simulated participant counts/times.
  Phase 1 needs no external analysts, recruitment, questionnaires or MAN-001–004 evidence; human usability remains **unverified**.
- Put self-contained HTML/CSS/native-ESM assets in `prototypes/next-gen/<direction>/`, using fictitious data
  and isolated memory only. No production imports, shared localStorage/IndexedDB writes, network calls or `src/` edits.
  Each must run from a local static server with network access blocked after assets load.
- Candidate A: **guided analysis desk**, one next task with a visible progress map; simple first use, potentially slower expert switching.
  Candidate B: **research notebook**, case framing and linked answers in a readable document; strong continuity, possible long-scroll cost.
  Candidate C (optional): **evidence workbench**, task queue plus inspector; faster expert review, greater orientation burden.
  Vary hierarchy, interaction and visual composition, not merely colors. These are hypotheses, not owner selections.
- Make only the core happy path plus blocked/invalid framing and intake clickable, in Arabic RTL and English, both lenses.
  Defer the full failure-branch/locale/print/viewport matrix to Phases 3–4 above.
- Deliver a journey map, persona/heuristic baseline, scoped state/locale matrix, runnable instructions,
  side-by-side comparison and recommendation. Compare comprehension cues, reversals, access, density, visual identity
  and migration cost; human success/time and preference remain **unverified**. Include one owner walkthrough, approve/decline only.
- The prototype check must crawl local links, exercise declared paths, check no production/storage/network coupling,
  and validate evidence membership. It cannot certify human usability. Record genuine reviewer and participant evidence separately.

Phase 5 human evidence contract: an external coordinator supplies at least six analysts across AR/EN/FR,
new and experienced, covering both lenses; agents cannot recruit and the owner's role remains approve/decline only.
Counterbalance matched legacy/new fixed tasks and seeds; publish raw counts, locale/lens strata and gaps.
Collect a human legacy baseline while the fallback is available; agent baselines cannot support human improvement percentages.
Required panel evidence and SHA-bound MAN-001–004 dispositions are release prerequisites. Without supplied participants/reviewers,
record **unverified** and hold Phase 5; do not backdate human data or block Phase 1 on recruitment.

## 4. PROTOTYPE GATE — owner final approval

**No production UI work starts until the owner finally approves one prototype through Factory ask.**
This includes tokens, shell, components, navigation, copy integration and runtime UI refactors.
Documentation/research and isolated prototypes may proceed within their admitted scope.
Existing incident maintenance is separate work; it cannot be used to smuggle in the redesign.

Agents first finish the reviewable package: runnable prototypes, evidence comparison, recommendation,
known limitations, contract impact and proposed migration scope. Ask only:
“Approve prototype <direction>, revision <commit/hash>, for <scope>?” with **approve / decline** only.
The owner does not run commands, fill research questionnaires or choose implementation mechanics.
Agents resolve the open options into a concrete recommendation before asking.

Record the Factory ask request/response identifier, owner identity, timestamp, exact artifact commit/content hash,
selected direction, scope, evidence links and literal approve/decline in a tracked future decision record
under `docs/next-gen/decisions/`. Attach the authoritative Factory response reference; an agent-written
`approved: true` alone is invalid. Bind implementation admission to this immutable artifact identity.
Factory ask availability and its machine-verifiable response mechanism are **unverified** in this task;
Phase 2 must validate the adapter and rejection behavior before production admission. If unavailable, hold the gate;
do not substitute chat consent, historical approval, silence or a default.

On decline: record it, keep Phase 1 open, examine evidence, revise or replace directions, repeat comparison
and different-model review, then submit a fresh approve/decline ask. No code migration begins.
An unapproved change to the approved direction/scope invalidates admission; present the revised prototype for a new final decision.
Historical Gate 0 waiver and case-file approval apply to their earlier program only.

## 5. SDLC, GitFlow and release rules

1. PM admits one bounded intake row with user job, scope, dependencies, falsification conditions, contracts,
   acceptance commands, migration/rollback and evidence owners. Design gate precedes production UI implementation.
2. Agents create `feature/<row>-<slug>` from `ux0-preview`, implement, verify and update docs;
   PR targets `ux0-preview`. No direct protected-branch pushes, force pushes or history rewrites.
3. Every row, including docs/prototype/release rows, gets a fresh independent reviewer on a different model
   from its builder. Record model IDs, reviewed SHA, findings and dispositions for bugs, spec, security and cost.
   Unavailable review routes remain pending; never silently claim or substitute a same-model review.
4. Review-cycle circuit breaker: max 2 repair rounds per row, then stop and escalate through the harness resolver;
   record findings, failed attempts and a bounded rebrief/split recommendation. If unresolved, submit one concrete Factory ask,
   approve/decline only; no automatic third repair round or cap reset by renaming a row. Budget exhaustion also stops work.
   Resolve findings; rerun affected checks and full required CI at the final head; merge and verify integration CI.
   Keep failure attempts and diagnostic traces; retry-only green is not acceptance. CI membership must include every required spec.
5. Release from accepted `ux0-preview` through `release/<version>` → PR → `main`. Agents prepare evidence,
   compatibility notes and rollback first. Owner **approve/decline only** through Factory ask; approval binds release PR/head.
   Prototype approval never authorizes a main merge. Changed head requires a fresh release decision.
6. After approval, agents execute merge, verify accepted/deployed SHA parity, publish versioned tag/notes,
   run deployed smoke/header checks on every supported origin, and back-merge main into `ux0-preview` through a gated PR.
   `hotfix/<slug>` starts at main and follows the same owner approval and back-merge rules.
7. Recover by checked revert/forward fix and compatible data preservation; never promise format-2 cases work in format-1-only builds.
   Unknown approval, policy, CI or deployment state fails closed. Local untracked harness files cannot be CI authorization.

These are process requirements, not claims that GitHub currently enforces them.
Basis: `docs/operations/release-process.md:7`, `:11`, `:22`, `:32`, `:36`;
`docs/phase0/PM-BRIEF.md:18`, `:30`, `:31`. No release is requested by this document.

## 6. Risks, mitigations and measurement

| Risk | Mitigation / stop condition |
|---|---|
| Attractive prototype conceals analytical uncertainty | Phase 1 heuristic audit seeds blockers; Phase 5 participants explain readiness/verification; stop release on false approval. |
| Redesign duplicates state or breaks authored records | Inject existing authorities; preserve fixture checksums and export equivalence; one task per reversible PR; stop on silent mutation/loss. |
| Browser storage or two-write promotion failure | Paired backup completeness and clean-profile restore; explicit partial-success/conflict repair; never advertise cross-database atomicity. |
| Arabic/access needs appear late | AR-first persona/heuristic walkthroughs in Phase 1, all-language matrix in Phases 3–4, native reviewers and AT users in Phase 5. |
| Broad rewrite overwhelms delivery | Dependency-gated slices, bounded coexistence, reusable PM104 work, no performance refactor without timing evidence. |
| Offline claim exceeds deployment reality | Separate static asset delivery from analysis network activity; exercise disconnected core tasks and inspect supported-origin headers; no remote prototype assets. |
| Wrong snapshot or weak approval becomes release authority | Check current files and policy at admission; exact-artifact approval, changed-head rejection, different-model review and genuine human records. |

Measure task completion, active time, five-second orientation, reversals, duplicate entry, blocker comprehension,
provenance reconstruction and clean-profile restoration on fixed cases. Phase 1 records heuristic/persona findings;
Phase 5 measures human legacy/new baselines and outcomes. No human data means **unverified**, not a synthetic estimate.
Keep browser/device/version, participant stratum, script/case/seed revision, timestamps, errors and raw counts.
Use anonymized local research records; no app analytics/network telemetry. Consent and retention belong in the research protocol.
For startup, interaction latency, large imports, memory and CI feedback time, Phase 2 records repeated baseline
measurements and numeric budgets before optimization; proposed default is no p95 regression over 10% without measured task benefit.
Absolute budgets are **unverified** until measured. Synthetic timings and golden prompts cannot establish AI answer quality.

## 7. Gaps and evidence the owner may have missed

These distinguish verified document content from runtime or hosted facts not re-tested here.

| Gap / evidence | Planning consequence |
|---|---|
| Requested `docs/adr/` is absent; ADRs 0001–0006 are under `docs/decisions/`. Their current working-tree headers say Accepted (`docs/decisions/0001-benchmark-before-runtime-ui-migration.md:3` through ADR-0006 line 3), whereas Phase 0 reports Proposed (`docs/phase0/architecture.md:7`). ADR files were already modified on entry. | Do not file another automatic status change or assert merged acceptance; reconcile decision/merge evidence in Phase 2. |
| Historical five-second target explicitly remains unmeasured (`docs/decisions/0002-select-case-file-and-waive-gate0.md:41`); old plan's Gate 0 mandate precedes its later waiver (`docs/product-ui-execution-plan.md:20`, `:291`). | New discovery must collect evidence; old waiver cannot stand in for next-generation usability. |
| Human AT, native terminology, physical zoom/touch/print and long-report review remain Pending in the checked register (`docs/operations/manual-release-review.md:113`). | Plan reviewer capacity and SHA-bound dispositions; machine review cannot close MAN-001–004. Actual external reviews are **unverified**. |
| A workspace bundle excludes the case (`docs/decisions/0004-research-dossier-store.md:63`); promotion revision and pointer are two writes (`docs/decisions/0006-promotion-through-resolution.md:57`). | A single “backup complete” message can mislead; prototype and ship completeness and partial-failure handling. Current runtime recovery beyond documented behavior is **unverified**. |
| Source-access mode and sent titles are documented as not stored with the answer (`docs/ai-interchange-contract-v1.md:183`). | Research mismatch after reopening/changing settings; revalidate runtime first, then admit a separate provenance/format row if still present. Runtime defect is **unverified** here. |
| README omits dossier/source/excerpt work from its feature/workflow account (`README.md:18`, `:40`); dossier spec's historical “Today” section differs from its built S2–S4 sections (`docs/features/research-dossier.md:15`, `:106`). | Research the running journey, not just the introductory docs; update onboarding when the approved journey ships. |
| Dossier formats are missing from the compatibility table (`docs/VERSIONING.md:27`), despite format-2 rollback warning (`docs/operations/release-process.md:36`). | Add namespace and downgrade behavior to Phase 2 compatibility admission; do not conflate record and database versions. |
| Branch policy snapshot reports zero approvals and non-strict checks (`docs/operations/release-process.md:22`); Phase 0 reports origin header disparity (`docs/phase0/security-data.md:15`). | Enforcement and supported-origin checks are release prerequisites. Current hosted/API state is **unverified**; do not claim these snapshots still describe it. |
| Phase 0's missing focused-test guard/skip-focus findings have changed in current files: `playwright.config.js:18` has `forbidOnly`; `index.html:179` and `:345` have `tabindex=-1`; package core list includes both dialog specs (`package.json:64`). | Deduplicate and verify behavior before filing more fixes. Presence alone does not prove passing browser/CI coverage. |

## 8. Open owner decisions — at most five

Agents prepare the recommended option as a reviewable package. Each final Factory ask is approve/decline;
the options here inform planning and are not extra owner form fields. Defaults never mean approval.

| Decision | Options and recommendation | Default pending explicit decision |
|---|---|---|
| D1: Experience direction | Guided desk / research notebook / optional evidence workbench. Recommend the best task-performing accessible direction after Phase 1 comparison, not a preselected style. | No direction approved; production UI blocked. |
| D2: Release research/reviewer capacity | Externally coordinated panel plus native/domain/AT reviewers / postpone release. Recommend supplied ≥6 analyst AR/EN/FR panel and SHA-bound MAN-001–004 evidence in Phase 5. Owner only approves/declines; agents do not recruit. | Phase 1 uses agent persona/heuristic baselines plus one owner walkthrough. Human findings stay unverified; missing panel/MAN evidence blocks Phase 5 release only. |
| D3: Supported public origin | Cloudflare only with data migration notice / both origins with equivalent enforceable controls. Recommend one canonical origin after export/migration rehearsal. | Retain origins; no retirement or claim of header parity; release holds if controls fail. |
| D4: Backup experience | Guided paired workspace/case files / new combined archive with separate contract work. Recommend paired files plus completeness manifest while preserving existing formats/stores. | Preserve formats and separate exports; prototype clearer completeness; no archive contract change. |
| D5: Product scope after release | Improve core journeys / one evidence-led compare/challenge/decision/calibration brief. Recommend core quality first, then one demonstrated unmet job. | No new feature family, accounts, provider integration or backend authorized. |
