# CI browser-performance architecture

## Purpose

The browser gate preserves the complete Chromium, Firefox, WebKit, mobile
Chromium, hosted-evidence, and visual-audit coverage while reducing pull-request
feedback time. It changes execution topology only; it does not weaken test,
retry, flake, evidence, or deployment contracts.

## Execution topology

After the no-browser gate succeeds, five browser runners execute concurrently:

| Runner | Scope | Installed browser |
| --- | --- | --- |
| `Browser core (chromium)` | Complete core suite, Chromium project | Chromium |
| `Browser core (firefox)` | Complete core suite, Firefox project | Firefox |
| `Browser core (webkit)` | Complete core suite, WebKit project | WebKit |
| `Browser core (mobile-chrome)` | Complete core suite, mobile Chromium project | Chromium |
| `Browser evidence` | Hosted evidence and visual-audit evidence | Chromium |

Each core runner uses two Playwright workers. Evidence generation retains the
single-worker limits already encoded in the npm scripts so screenshots and
metadata remain deterministic.

The lightweight `Browser gates` aggregation job succeeds only when both the
complete core matrix and evidence job succeed. Its stable job name remains the
branch-protection and deployment dependency.

## Failure and artifact behavior

- Matrix fail-fast is disabled so one browser failure does not erase diagnostic
  results from the other engines.
- Every failed core leg uploads a uniquely named debug artifact.
- Evidence artifacts upload even when their producing step fails, provided files
  exist.
- Debug artifacts are retained for 7 days.
- Release evidence is retained for 14 days.
- A failed, cancelled, or skipped matrix/evidence dependency makes
  `Browser gates` fail.
- GitHub Pages deployment remains restricted to a successful accepted `main`
  push and still depends on `Browser gates`.

## Local authority

Local execution remains unchanged:

```powershell
npm ci
npx playwright install --with-deps
npm run test:ci:no-browser
npm run test:ci:browser
```

The complete local browser alias still runs the full core suite, hosted
evidence, and visual-audit evidence. CI invokes narrower existing aliases only
to distribute the same authority across isolated runners.

## Acceptance gate

Accept the topology after three consecutive complete pull-request runs satisfy
all of the following:

1. `No-browser gates` succeeds.
2. All four `Browser core (...)` matrix legs succeed.
3. `Browser evidence` succeeds and produces the expected evidence counts.
4. The stable `Browser gates` check succeeds.
5. Median end-to-end workflow duration is below 10 minutes.
6. No test passes only on retry because CI retains `failOnFlakyTests`.
7. A subsequent accepted `main` run deploys only after `Browser gates`.

If the median remains above 10 minutes, inspect per-project timing before
raising worker counts. Increasing workers is rejected as the first response
because GitHub-hosted runners can become CPU- or memory-bound and create
cross-engine flakiness.

## Rollback

Revert the CI-optimization commit through the protected pull-request workflow.
Do not edit required-check names or bypass `Browser gates`. The change contains
no application data migration and no runtime product behavior, so rollback is
limited to the workflow and its CI contract/documentation.
