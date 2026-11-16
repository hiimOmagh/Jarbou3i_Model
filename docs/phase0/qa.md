# Phase 0 — QA discovery

## 1. State in five lines

1. Snapshot: `git rev-parse HEAD` → `3b0af3fd3bcea0551f5dad1ec530b19e9826b193`; package version is alpha.57 (`package.json:3`).
2. Inventory: 58 browser spec files, 54 selected by core, two evidence specs, two omitted dialog specs; 50 `*-check.mjs` files have npm references (command C1 below; references alone do not prove execution).
3. Six read-only Node checks passed locally (C2); no browser suite or validator generation was run, so this report does not claim fresh full-suite acceptance.
4. Latest 100 CI records sampled: 95 success, four failure, one empty conclusion; five records have attempt 2, including successful reruns (C3); this is not a first-attempt flake rate.
5. Main gaps: test-selection enforcement, focused-test protection, attempt-aware reliability evidence and first-failure diagnostics (Q1–Q4); human acceptance gaps remain as already recorded (`docs/operations/manual-release-review.md:113`).

Method: four imagined experts—suite selection, browser reliability, feature coverage, CI/policy—reviewed by this leader without delegation. Context read: `docs/architecture.md`, `docs/decisions/`, `docs/audits/`, `docs/operations/`, `.claude/harness/STATUS.md` and `.claude/harness/backlog.md` (the brief's root `backlog.md` does not exist). Existing rows 75, 84, 94, 96 and 102 are context, not new backlog proposals (`.claude/harness/backlog.md:102`, `:113`, `:122`, `:126`, `:132`).

## 2. Findings

| ID | Severity | Evidence | Impact | Proposed fix |
|---|---|---|---|---|
| Q1 | P1 | C1; `tests/a11y-editor-dialog-trap.spec.js:3`, `tests/dialog-entry-focus.spec.js:19`; explicit list at `package.json:64`; incomplete contract allowlist at `tests/ci-script-contract-check.mjs:64` | Editor boundary wrapping and initial dialog Shift+Tab regressions have dedicated tracked specs that CI never selects. Inferred: green CI can miss these regressions despite earlier orphan-spec fixes. | Wire both specs and enforce exhaustive discovery-to-CI membership, with explicit evidence-suite exceptions. Extend rows 94/96's prevention work rather than reopening their completed fixes. |
| Q2 | P2 | `playwright.config.js:13` through end contains no `forbidOnly`; C4 finds no focused-test guard in tests/scripts/workflow/config | Inferred: an accidentally committed `test.only` can shrink executed coverage while CI remains green. No current `.only` found (C4). | Enable CI `forbidOnly` and require it in the configuration contract. |
| Q3 | P2 | `docs/operations/deployment.md:78` forbids rerunning merely for green; `.claude/harness/LESSONS.md:2` instructs one failed-job rerun; C3/C5 confirm rerun history; `.claude/harness/flake-ledger.md:1` records one historical prompt flake | Conflicting acceptance guidance and latest-attempt summaries obscure reliability. No explicit test-quarantine lifecycle was found in the reviewed operations docs/config (C4); ordinary engine skips are not quarantine. | Agree one rerun policy; retain attempt-level failures with owner, cause, fix SHA and closure evidence. Default to no quarantine; any exception needs issue, expiry and an independently running diagnostic lane. |
| Q4 | P2 | `playwright.config.js:34` uses `trace: 'on-first-retry'`; failed-only uploads at `.github/workflows/ci.yml:140`, retention at `:148`; C5 shows retry-passing failures | The first failed attempt has no configured trace; a retry trace can show only the successful path. Inferred: timing-race diagnosis loses its most useful evidence. | Retain traces from failing attempts, keep artifact uploads bounded, and publish compact machine-readable attempt/duration summaries even on success. |
| Q5 | P3 | `tests/golden-prompts.spec.js:20` builds prompts through a browser; `:49` serializes the group; `tests/prompt-sources.spec.js:53` and `tests/prompt-budget.spec.js:345` explicitly call their checks pure logic; C6 shows core jobs 153–367 s versus 21 s for the Node job | Inferred: some content permutations occupy browser capacity that could be cheaper at the contract layer. File counts alone cannot establish an inverted pyramid or runtime coverage. | Benchmark one pure prompt matrix at Node level; retain browser Copy/Preview wiring checks and deliberate goldens. Move only after byte-equivalence and measured runtime evidence. |

### Flake inventory and CI runtime evidence

| Run / attempt inspected | Observed failure output | Current interpretation |
|---|---|---|
| 43863897340 / 1 | Firefox `results-workspace.spec.js:119`; `Test timeout of 60000ms exceeded.`; `1 flaky` | Already addressed by row 102 / `09f4961`; latest history names waiting for workspace save. Do not file another fix without recurrence. |
| 43540582482 / 1 | Chromium `prompt-budget.spec.js:82`; `expect(locator).not.toBeChecked() failed`; `1 flaky` | Already addressed by row 84 / `35f5eb5`; its stress results are recorded in the backlog, not reproduced here. |
| 43747543490 / 2 | Mobile Chromium `disabled-continue.spec.js:3`; predicate timeout; `1 flaky` | Subsequent `git show f519337 -- tests/disabled-continue.spec.js` adds style-settling polling. Historical failure, not demonstrated current flake. |
| 43221443173 / 1 | Mobile Chromium `results-workspace.spec.js:172`; `toHaveText` failed on both attempts; `1 failed` | Deterministic-looking assertion failure, not counted as a proven flake; root cause not established here. |
| 42930575244 / 1 | Chromium `guided-flow.spec.js:151`; `expect(received).toEqual(expected)` on both attempts; `1 failed` | Assertion failure, not a proven flake; current recurrence not established. |
| 43093440090 / 1 | `--log-failed` returned no matching failure lines; job query showed Browser gates with empty conclusion and deployment skipped | Unclassified orchestration/terminal-state anomaly; do not label it a test flake. |

C3's successful-record wall spans: minimum 328 s, median 419 s, nearest-rank p95 820 s, maximum 1458 s. These are `updatedAt-createdAt`, including queue/rerun time, across changing topology; they are not billed minutes or pure test durations. C6's current run lasted 398 s from creation to update; Node job 21 s, browser evidence 248 s, core jobs 153–367 s, slowest Firefox shard 1. Inferred: optimize browser work from per-test measurements, not by removing required engines. Current topology and budgets are already documented in `docs/operations/ci.md:25` and `:83`.

### Coverage by feature and pyramid limits

| Feature | Present evidence | Gap / limit |
|---|---|---|
| Parser, source extraction, promotion | C2; `package.json:42`, `:44`, `:53` | Behavioral Node checks exist; no branch/line coverage collector is configured in the inspected package/config (C4). No coverage percentage claimed. |
| Dossier compatibility and storage | `tests/research-dossier.spec.js:10`, `:49`, `:70`, `:93`; C2 | Real IndexedDB reload, stale writes, released records and future envelopes have browser cases; not freshly executed here. |
| Promotion transaction / two-store failure | `tests/case-promotion.spec.js:542`, `:700`, `:789` | Concurrent changes, pointer-save failure and workspace refusal are explicitly exercised; power-loss/device-level durability remains outside these examples (inferred). |
| Workspace / recovery / portability | `tests/workspace-foundation.spec.js:149`, `:237`, `:566`, `:584` | Delayed saves, reloads and bundle corruption covered by selected specs; Q1 is a narrower keyboard-dialog omission. |
| Prompts, imports and exports | `package.json:54`, `:64`; `tests/golden-prompts.spec.js:49` | Goldens prove stable output, not quality of generated AI answers (inferred). Human benchmark waiver already documented at `docs/decisions/0002-select-case-file-and-waive-gate0.md:42`. |
| Languages, reflow and accessibility | `docs/operations/manual-release-review.md:10`, `:113`; `playwright.config.js:45` | Browser engines and mobile emulation do not replace NVDA/JAWS/VoiceOver/TalkBack, native language, physical touch or print review; retain MAN-001–004, do not duplicate them. |

## 3. What is good (keep)

- Preserve fail-on-flaky CI, one diagnostic retry and explicit global time budgets (`playwright.config.js:15`–`:20`); no recommendation to make flakes green.
- Keep bounded IndexedDB helper enforcement and the Node contract layer; both policy and selected behavioral checks passed (C2; `docs/operations/ci.md:108`).
- Keep four browser projects, matrix fail-fast disabled and the aggregate browser gate (`playwright.config.js:45`; `.github/workflows/ci.yml:54`, `:214`).
- Keep separate portable-report/evidence checks and human-review dispositions (`package.json:69`, `:78`; `docs/operations/manual-release-review.md:107`).

## 4. Proposed backlog rows

- QA/P1, AUTO, Q1: include both dialog specs and enforce inventory completeness; Done when `node tests/ci-script-contract-check.mjs` rejects an omitted tracked spec, `npm run test:browser:core -- --list` includes both, and targeted four-project dialog runs pass.
- QA/P2, AUTO, Q2: reject focused tests in CI; Done when the contract check requires `forbidOnly` and a temporary focused-test fixture fails a CI-mode Playwright listing (fixture isolated and removed by its check).
- QA/P2, ASK, Q3: reconcile rerun/quarantine acceptance rules with the owner; Done when a proposed `node tests/qa-policy-check.mjs` verifies the chosen policy, every exception has issue/owner/expiry, and an attempt-aware report identifies 43863897340 attempt 1 as flaky despite its final success.
- QA/P2, AUTO, Q4: retain first-failure traces and attempt summaries; Done when an intentional fail-then-pass probe produces a first-attempt trace, both attempt outcomes and a nonzero CI result, with artifact retention verified by `gh run view <probe-run> --json jobs` and its artifact listing.
- QA/P3, AUTO, Q5: measure one prompt matrix migration before broadening it; Done when a proposed `node tests/prompt-matrix-parity-check.mjs` proves byte-equivalence for every migrated fixture and recorded before/after timings show lower runtime while browser Copy/Preview checks still pass.

These are proposals only; no backlog or implementation files were changed. MAN-001–004 remain the existing human-review work, not new rows.

## 5. Questions for the owner

1. Should a failed exact-SHA run remain unacceptable until a corrective commit, as deployment.md says, or may a classified, recorded failed-job rerun qualify, as LESSONS.md currently directs? Recommended: preserve failure history and require an explicit release disposition for exceptions (Q3).

### Command evidence (read-only; run 2026-11-16)

- C1: inline Node script read `package.json`, enumerated `fs.readdirSync('tests')`, counted `.spec.js` / `-check.mjs`, matched core `tests/\S+\.spec\.js` tokens and compared filenames against all npm script strings. Output: `specFiles:58, checkFiles:50, coreSpecs:54, unreferencedSpecs:[a11y-editor-dialog-trap.spec.js,dialog-entry-focus.spec.js], unreferencedChecks:[]`. `git ls-files tests/a11y-editor-dialog-trap.spec.js tests/dialog-entry-focus.spec.js` returned both paths.
- C2: `node tests/ci-script-contract-check.mjs` → `CI script contract check passed.`; `node tests/browser-persistence-policy-check.mjs` → `Browser persistence policy check passed.`; `node tests/json-parser-check.mjs` → `JSON parser checks passed.`
- C2 continued: `node tests/research-dossier-check.mjs` → `568 assertions passed; 0 failed.` and `Largest dossier export: 28117051 bytes; limit: 29360128 bytes.`; `node tests/promotion-check.mjs` → `Promotion checks passed: 7419 cases in 10.3s`; `node tests/source-file-text-check.mjs` → `Source file text check passed (662 assertions).`
- C3: `gh run list --workflow ci.yml --limit 100 --json databaseId,conclusion,createdAt,updatedAt,attempt,headSha`, grouped in PowerShell → `failure 4; success 95; [empty] 1`; sorted successful date differences → `min=328 median=419 p95=820 max=1458`. Attempt-2 IDs: `43863897340,43747543490,43540582482,43218611809,42961442761`. Not all 100 attempt logs were inspected.
- C4: `rg -n 'forbidOnly|test\.only|describe\.only' tests scripts .github playwright.config.js` → no matches. `rg -n -i 'quarant|forbidOnly|coverage|c8|istanbul' playwright.config.js package.json docs/operations tests/ci-script-contract-check.mjs` → only prose CI coverage headings/descriptions. This is bounded search evidence, not proof of absence everywhere.
- C5: `gh run view <ID> --attempt <N> --log-failed`, filtered for errors/timeouts/spec paths, produced the raw excerpts in the inventory table. Additional classification: `gh run view 43093440090 --json jobs --jq '.jobs[] | select(.conclusion != "success") | {name,conclusion}'` → `{"conclusion":"","name":"Browser gates"}` and `{"conclusion":"skipped","name":"Deploy accepted GitHub Pages build"}`.
- C6: `gh run view 43922989242 --json jobs --jq '.jobs[] | {name,conclusion,startedAt,completedAt}'` → No-browser `17:52:58Z–17:53:19Z`, evidence `17:53:22Z–17:57:30Z`, slowest core Firefox shard 1 `17:53:21Z–17:59:28Z`, all success. `gh run list --workflow ci.yml --limit 40 --json databaseId,headSha,headBranch,conclusion,createdAt,updatedAt,status,displayTitle` → that run created `17:52:56Z`, updated `17:59:34Z`.

Limits: no application fixes, browser executions, screenshots, full no-browser command (it generates validators), commits, pushes, PRs or deployments. Pre-existing untracked `test-results-s7a/` was left untouched; other phase0 reports may be written concurrently.
