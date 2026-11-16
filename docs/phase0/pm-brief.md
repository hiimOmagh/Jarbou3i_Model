# Phase 0 — PM brief

Basis: row 104 / .claude/harness/brief104-phase0.md; [Architecture](architecture.md), [QA](qa.md), [Security/Data](security-data.md), [Frontend](frontend.md), [Language](language.md), [DevOps](devops.md), [Docs](docs.md); .claude/harness/{backlog,STATUS,OWNER-ANSWERS}.md; CEO confirmations supplied with this task.

## 1. Verdict — five lines

1. Conditional GO for maintenance; features wait for Wave 1 and their Wave 2 dependencies: the next phase needs a safe, maintainable base.
2. No confirmed P0 incident; the reported clean dependency audit and focused checks do not establish full release readiness.
3. Preserve native ESM, offline operation, both lens authorities, canonical state, formats and recovery/export contracts.
4. Green CI is necessary but insufficient: omitted specs, permissive release gates, inconsistent hosting controls and unrecorded human checks remain.
5. Always use SDLC + CI/CD + Git flow; the owner only approves/declines main/release merges, and agents execute the approved procedure.

## 2. Shared roots, duplicates and contradictions

- **Policy without enforcement:** DO-02–05/12, Q3 and D3–4 share mismatches between prose, scripts and GitHub settings. Both protected branches reportedly have strict=false and zero required approvals; distinguish intended policy from observed configuration.
- **Incomplete inventories:** Q1–2, L2–5 and D1/8/12 check known cases rather than exhaustive membership. Merge proposals into test-selection, locale and documentation guards with explicit exceptions.
- **Concentrated ownership:** ARCH-01–04 and FE-01/04/05 share app.js orchestration, global services and weak boundaries. Fix seams before loading/controller changes; generated validator size is distinct from authored complexity.
- **Machine-bound operations:** release plumbing and approvals live in the local untracked harness (`git ls-files .claude/harness` returns none). CI cannot depend on the owner's checkout, Windows paths, cygpath or local logs as authorization.
- **False completion signals:** STATUS still says held and row 9 says unmerged; OWNER-ANSWERS records alpha.57 released/back-merged. Gate condition 6 accepts a dated owner-check line explicitly marked machine-only; MAN-001–004 remain pending. Repair evidence semantics, not just labels.
- **Data lifecycle gap:** SD-02–04 describe deliberate separate dossier/workspace stores and two-write promotion. Document paired backups now; add guided completeness/recovery later without promising cross-store atomicity. Checksums detect corruption, not authorship.
- **Release correction:** `release-cut.sh <version> --merge` already merges, tags and back-merges; DO-01 overstates absence. Extend its approval trigger, portability and resumability, rather than building a duplicate engine. Keep fail-on-flaky despite DO-10's relaxation proposal; diagnostic reruns never erase failures.
- **Evidence limits:** CEO confirms eager validators, missing skip-target tabindex, absent Pages CSP, empty GitHub Releases and no current .only/no guard. FE startup/FOUT/CLS claims lack timing evidence: optimization is P2 pending measurement; standalone report classes are not themselves a kernel defect.
- **Deduplication:** rows 75/94/96 are DONE; B adds only the newly omitted dialog specs plus prevention. Rows 50/53, 84/102, 61 and 98/100/101/103 stay closed absent fresh recurrence; E/Q improve prevention. Reuse MAN-001–004 and row 60/100's owed human-review record. Row 93 reverted brevity caps: remove those stale review obligations.
- **Docs judgement:** ADR status changes require acceptance/merge evidence, not “implemented = Accepted.” ADR-0002 waives only Gate 0; ADR-0001's authority/migration boundaries remain. Preserve historical baseline identity separately from release SHA; do not blindly replace D10's pin. Parked rows 8/18/20/25–27 and cross-repo row 54 stay outside this plan; disambiguate duplicate row number 89 without another task.

## 3. Ranked roadmap

PM104-A–U are proposal keys under row 104, not filed numeric rows. Later intake must reuse matching rows before allocating IDs; this task writes only this brief, with no backlog edits or commits.
P0=critical active incident; P1=safety/governance; P2=maintainability/reliability; P3=optional. AUTO=agents prepare/integrate scoped work; ASK=one of D1–D3 packaged in a concrete merge PR. Silence authorizes no ASK action or release. Rank expresses impact; dependencies determine execution order.
Every item uses `feature/<row>-<slug>` from ux0-preview, relevant falsification checks, different-model independent review, updated docs and exact-SHA green CI. Main uses `release/<version>`; `hotfix/<slug>` starts at main. Owner approves/declines main/release merges; agents merge, tag and back-merge through checked PRs. No direct protected-branch pushes, force pushes or shared-history rewrites.
Commands are future acceptance criteria, not executed results. **NEW** marks scripts/checks/specs to implement; negative scenarios must be behaviorally tested inside the check, which then exits 0. Required CI remains additional to each command.

### Wave 1 — hygiene and safety nets (10 items; small, independently reversible PRs)

| ID | Class | Mode | Item | Done-when command | Owner team | Depends-on |
|---|---|---|---|---|---|---|
| PM104-A | P1 | AUTO | Fix CONTRIBUTING:27–41's feature base; refresh STATUS/row-9 release facts and stale asks from evidence, preserving history and owed reviews (follow-up 95/101/103). | NEW `node tests/process-docs-check.mjs` rejects conflicting branch guidance and stale status snapshots; local metadata is optional in CI, never authorization. | Docs + DevOps | — |
| PM104-B | P1 | AUTO | Wire a11y-editor-dialog-trap and dialog-entry-focus into CI; exhaustive tracked-spec/Node-check membership with evidence exceptions; CI forbidOnly and focused-fixture rejection. | `node tests/ci-script-contract-check.mjs && node scripts/run-playwright.mjs tests/a11y-editor-dialog-trap.spec.js tests/dialog-entry-focus.spec.js` passes all four configured projects. | QA | — |
| PM104-C | P1 | AUTO | Guard existing release entry points with tracked policy: unknown/missing protection or CI fails closed; approval binds PR/head SHA and is single-use; machine review cannot satisfy native evidence. | NEW `node tests/release-policy-check.mjs` rejects unavailable/malformed policy, stale approval, changed head and false human attestations using mocks, without real merges/tags. | DevOps + Security/Data | A, I |
| PM104-D | P1 | AUTO | Add tabindex=-1 and reliable focus to workflowPanel/reviewPanel skip targets; next Tab enters the visible target in both app states and AR/EN/FR. | NEW `node scripts/run-playwright.mjs tests/skip-navigation.spec.js` passes all four projects. | Frontend + QA | B |
| PM104-I | P1 | AUTO | Reuse MAN-001–004/owed-copy records: reviewed SHA, locale/surface, reviewer type/date/disposition; distinguish machine/native/waiver. Document separate backups, import trust and format-2 rollback limits now. | NEW `node tests/release-evidence-check.mjs --self-test` rejects fabricated native completion, stale coverage and missing required dispositions. | Language + QA + Security/Data | A, H |
| PM104-E | P2 | AUTO | Reconcile ship/LESSONS/deployment rerun rules; retain first-failure traces and attempt summaries with bounded artifacts. Diagnostic quarantine requires issue/owner/expiry and cannot remove required acceptance coverage. | NEW `node tests/ci-diagnostics-check.mjs` verifies an actual controlled CI fail-then-pass probe: first trace retained, both attempts recorded, flaky result remains red. | QA + DevOps | B |
| PM104-F | P2 | AUTO | Small docs slices: feature index, onboarding, module map, dossier version namespace, Gate 0 waiver/baseline identity, ADR acceptance evidence and link/index guard. | NEW `node tests/docs-integrity-check.mjs` checks links, feature membership, waiver scope, compatibility namespaces and decision evidence. | Docs + Architecture | A |
| PM104-G | P2 | AUTO | Baseline startup/Arabic fonts and maximum-size/adversarial imports; record latency, long tasks, memory methodology and budgets before optimizing. Byte counts alone do not justify CSS bundling or a framework. | NEW `node scripts/performance-baseline.mjs --startup --imports` repeats fixed cases and reports environment, budgets and bounded-input results. | Frontend + Security/Data + QA | B |
| PM104-H | P2 | AUTO | Inventory every copy source by locale/surface, placeholders and intentional fallbacks; reject unknown constructions/missing keys; development diagnostics retain no user text. | NEW `node tests/locale-inventory-check.mjs` produces deterministic AR/EN/FR coverage and rejects injected missing keys/unapproved fallbacks. | Language + QA | — |
| PM104-J | P2 | AUTO | One migration ADR and dependency gate: layer rules, explicit legacy globals and exact existing three-module SCC allowlist; reject new cycles, forbidden edges and unknown dynamic loaders. | NEW `node tests/dependency-boundaries-check.mjs --self-test` accepts only the recorded baseline and rejects injected violations. | Architecture + Docs | B, F |

### Wave 2 — structural work (8 items; ship each in smaller slices where needed)

| ID | Class | Mode | Item | Done-when command | Owner team | Depends-on |
|---|---|---|---|---|---|---|
| PM104-K | P1 | ASK D1 | Reuse cut/tag/back-merge logic in portable tracked scripts/release with local wrappers; hosted approval-triggered execution under distinct bot identity. Strict checks on both branches, owner approval on main, stale dismissal, resolved conversations; resume existing PR/tag; idempotent GitHub Releases from CHANGELOG after tag-SHA verification. | NEW `node tests/release-runner-check.mjs --sandbox && node scripts/release/verify-policy.mjs` proves denied/stale approval, changed base, duplicate events, interrupted resume, tag/notes provenance and actual policy enforcement; no bypass credentials. | DevOps + Security/Data | C, E, J; D1 |
| PM104-L | P1 | ASK D2 | Enforce supported-origin policy; after deployment verify release SHA, CSP/network/framing/referrer controls and smoke journeys. Retiring Pages requires origin-local data export/migration notice before shutdown. | NEW `node scripts/check-deployed-origins.mjs && npm run test:browser:deployed` passes for every supported origin with explicit deployed base URLs. | Security/Data + DevOps + QA | K; D2 |
| PM104-R | P1 | ASK D3 | Close existing MAN-001–004 through named human QA/domain/native-language reviewers at the reviewed SHA, or an explicit limited release waiver. Agents coordinate evidence; owner runs no tests/release commands. | NEW `node tests/release-evidence-check.mjs --strict` validates genuine records or explicit scoped waivers; machine approval alone fails. | Language + QA + Docs | I; D3 |
| PM104-M | P2 | AUTO | Break workspace/review/resolution SCC: pure serialization/hash/error leaves, then resolution-ledger shapes separate from transaction orchestration; preserve error identity/checksums. | NEW `node tests/dependency-boundaries-check.mjs --no-cycles`; then `npm run test:workspace && npm run test:review-ledger && npm run test:resolution` preserves fixture outcomes. | Architecture + Security/Data | J |
| PM104-N | P2 | AUTO | Extract unchanged catalog into native-ESM locale resources, then saved-work controller/view with injected state/repositories; remove each old block in the same PR; one canonical owner. | `node tests/static-check.mjs && npm run test:platform:runtime && node scripts/run-playwright.mjs tests/work-panel.spec.js tests/research-dossier.spec.js tests/golden-prompts.spec.js` and H's inventory pass. | Architecture + Language + Frontend | M, H |
| PM104-O | P2 | AUTO | Replace validator/lens-service globals consumer by consumer; relocate generated artifacts only through generators. Lazy validation requires measured benefit plus readiness/retry/error and first-use parity. | `npm run test:strategic:integrity && npm run test:promotion`; NEW `node tests/validator-loading-check.mjs` and G's repeated baseline prove parity and claimed improvement. | Architecture + Frontend + Security/Data | N, G |
| PM104-P | P2 | AUTO | Consolidate modal lifecycle; trial native dialog one modal per PR only with keyboard/AT parity. Preserve parked layouts; markup counts are insufficient acceptance. | `node scripts/run-playwright.mjs tests/a11y-editor-dialog-trap.spec.js tests/dialog-entry-focus.spec.js tests/a11y.spec.js` and R's affected AT evidence pass. | Frontend + QA | D, N, R |
| PM104-Q | P3 | AUTO | Pilot one pure prompt matrix in Node, retain browser Copy/Preview checks, tune shards from timings and pin runner image. Keep all engines/strict flaky failure; classify superseded cancellations separately. | NEW `node tests/prompt-matrix-parity-check.mjs && node scripts/compare-ci-baseline.mjs` proves byte equality and measured wall/runner-time results; `npm run test:ci:contract` passes. | QA + DevOps + Architecture | E, G, N |

### Wave 3 — user features (3 items; admission requires Wave 1 and K/L/M/N/R complete)

| ID | Class | Mode | Item | Done-when command | Owner team | Depends-on |
|---|---|---|---|---|---|---|
| PM104-S | P1 | AUTO | Guided paired workspace/dossier backup/restore, manifest/completeness preflight and explicit partial-failure/conflict handling; preserve separate stores/formats and canonical links. | NEW `node scripts/run-playwright.mjs tests/paired-backup.spec.js` restores both stores/links in a clean profile and rejects corrupt/incomplete inputs before writes. | Security/Data + Frontend + QA | K, L, M, N, R |
| PM104-T | P2 | AUTO | Reconcile provably recoverable promotion pointers from committed evidence; ambiguous cases remain explicit repair states, never inferred canonical edits; idempotent across reloads. | NEW `node tests/promotion-reconciliation-check.mjs && node scripts/run-playwright.mjs tests/promotion-recovery.spec.js` covers interrupted two-write commits, conflicts, duplicates and case isolation. | Security/Data + Architecture + QA | K, L, M, N, R |
| PM104-U | P2 | AUTO | Actionable backup/storage health using S's completeness status; denied persistence, quota and recovery journeys give one safe next action without guaranteeing browser durability. | `node tests/storage-health-check.mjs`; NEW `node scripts/run-playwright.mjs tests/storage-recovery-guidance.spec.js` covers denied persistence, quota failure and backup/recovery states. | Frontend + Security/Data + Language | S, T |

Admission follows dependencies, not dates; K/L can proceed alongside M/N; R's evidence work starts immediately. Defer at P3: authenticated backups without demonstrated demand, broad CSS bundling, export restyling and comparison/collaboration/new lenses; do not reopen parked rows.

## 4. Target structure and migration

Adopt [architecture.md's target and incremental path](architecture.md#target-structure-and-safe-migration-proposal-inferred), with native-ESM locale resources under platform/localization; no framework or JSON-loader requirement.
`src/app.js` wiring → `src/features/{intake,results,review,saved-work}/` and `src/lenses/{strategic,biopolitical}/` → `src/domain/{workspace,review,dossier,evidence}/` → pure `src/shared/`; inject `src/platform/` services/repositories. Keep `src/ui/`; validators belong in generator-owned `src/generated/`.
Keep tracked `schema/`, `tests/`, `scripts/{release,...}/`, `.github/workflows/` and `docs/{decisions,operations,features,...}/`; the local harness becomes a client of tracked delivery logic, not CI authority.
Migrate J baseline/ADR → M primitives/ledger shapes → N unchanged catalog then saved-work → O service facades/lens-owned prompt-report seams → P modal slices. Expand intake/results after parity; existing core paths can temporarily re-export; one implementation/state owner per slice.
Each slice preserves formats and approved prompt/export bytes, updates preloads/import checks, runs focused both-lens AR/EN/FR journeys and full required CI. No bulk rename, combined schema migration or hand-edited generated validator; rollback is one slice reverted through a checked PR.

## 5. Team structure and review pairing

PM owns one deduplicated roadmap, dependency admission and acceptance evidence; leaders own scoped briefs, expert findings and capacity. CEO/integrator owns shipping/logs/merge execution and presents owner decisions. No simultaneous editors for one file; builder != reviewer on different model runs.
Routes are proposed assignments from local templates/org, not availability claims: sol=Codex gpt-6.1-sol medium/high; astra=Codex gpt-6-astra high; terra=Codex gpt-6.1-terra; AG=Antigravity gemini-3.8-flash. Check capabilities before dispatch; report unavailable routes, never silently replace them.

| Team / leader | Experts | Model route and independent review |
|---|---|---|
| PM / product lead | priority, requirements, dependencies/evidence | AG synthesis; astra challenges rank/scope; CEO integrates. |
| Architecture / architecture lead | modules/graph, canonical authorities, storage seams, ADRs | astra designs, sol builds; AG reviews plus Security/Data for authority changes. |
| QA / QA lead | Node contracts, four-engine E2E, flakes, human/AT evidence | sol builds tests; AG falsifies selection/failures; astra reviews high-risk acceptance. |
| Security/Data / security lead | import/XSS, storage/recovery, dependencies, host policy | astra assesses, sol implements; AG reviews independently plus QA fault injection. |
| Frontend / frontend lead | interaction, keyboard/RTL/AT, rendering/performance | sol builds; AG performance and astra UX/a11y review; humans supply device/AT evidence. |
| Language / language lead | AR/EN/FR terminology, inventory, prompts/exports | terra drafts; AG reviews; astra second-checks sensitive Arabic/domain meaning; native humans validate nuance. |
| DevOps / delivery lead | Actions, identity/Git flow, release/deploy, portability | sol implements; astra reviews authorization, AG diagnoses CI; QA runs negative/resume probes. |
| Docs / documentation lead | onboarding, ADR evidence, operations/contracts, links/index | sol maintains technical docs, terra drafts UX prose; AG checks facts, Architecture validates decision history. |

Small hygiene PRs need one independent reviewer; behavior requires bugs/spec evidence; storage/import/release changes add security/failure recovery and cost/deployment review where relevant. Agents prepare concrete PR evidence before asking for a merge; all mandatory CI remains.

## 6. Three owner merge decisions

1. **D1 — approval/execution policy PR (K):** recommend hosted Actions + distinct bot PR author/executor, owner approval bound to exact head, strict checks on both branches and required owner approval on main. Agents provision/execute after approval. **Default:** prepare/test only; no activation or main/release merge without owner approval; historical RELEASE YES is consumed.
2. **D2 — supported-origins PR (L):** recommend Cloudflare as sole application origin, with deployed-SHA/header gates and Pages local-data export/migration notice before retirement. **Default:** change neither origin; keep the Pages security gap open and do not claim deployment-policy completion.
3. **D3 — human-evidence release PR (R):** recommend named native AR/FR/domain and human QA reviewers completing MAN-001–004; agents supply inventory/evidence. **Default:** owed checks stay pending and the next main/release merge waits; any narrower waiver must be explicit in the approved PR, never inferred from machine review or Gate 0's waiver.
