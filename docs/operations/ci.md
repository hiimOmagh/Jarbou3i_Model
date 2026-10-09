# Continuous Integration

The CI workflow (`.github/workflows/ci.yml`) runs the complete Chromium, Firefox,
WebKit, mobile Chromium, hosted-evidence, and visual-audit coverage on every pull
request and every push to `main`. The local commands below run the same suites.

## Local commands

```bash
npm ci
npm run test:ci:no-browser
npx playwright install --with-deps
npm run test:ci:browser
```

`test:ci:browser` runs the full browser core suite, hosted evidence, and
visual-audit evidence. CI calls narrower aliases of the same suites so it can
spread them across runners. A focused or repeated test is diagnostic evidence
only; it does not replace either complete command.

## Runner topology

After `No-browser gates` succeeds, six browser runners execute concurrently:

| Runner | Scope | Installed browser |
| --- | --- | --- |
| `Browser core (chromium)` | Complete core suite, Chromium project | Chromium |
| `Browser core (firefox)` | Complete core suite, Firefox project | Firefox |
| `Browser core (webkit shard 1 of 4)` | First quarter of the WebKit core suite | WebKit |
| `Browser core (webkit shard 2 of 4)` | Second quarter of the WebKit core suite | WebKit |
| `Browser core (webkit shard 3 of 4)` | Third quarter of the WebKit core suite | WebKit |
| `Browser core (webkit shard 4 of 4)` | Last quarter of the WebKit core suite | WebKit |
| `Browser core (mobile-chrome)` | Complete core suite, mobile Chromium project | Chromium |
| `Browser evidence` | Hosted evidence and visual-audit evidence | Chromium |

Each core runner uses two Playwright workers. WebKit is split with Playwright's
native `1/4` to `4/4` shards because a single WebKit job, and later the
second of two shards, exceeded the 15-minute job limit; together the four shards
run the complete WebKit suite. Shards follow alphabetical file order, so the
slowest specs fall in the last shard; watch its duration as the suite grows. Evidence
generation keeps the single-worker limits encoded in the npm scripts so
screenshots and metadata remain deterministic.

The lightweight `Browser gates` job succeeds only when the complete core matrix
and the evidence job succeed. Its stable name is a branch-protection and
deployment dependency, together with `No-browser gates`.

## Failure and artifact behavior

- Matrix fail-fast is disabled, so one browser failure does not hide results from
  the other engines.
- Every failed core leg uploads a uniquely named debug artifact, including
  separate artifacts for each WebKit shard.
- Evidence artifacts upload even when their producing step fails, provided files
  exist.
- Debug artifacts are kept for 7 days; release evidence for 14 days.
- A failed, cancelled, or skipped matrix or evidence dependency makes
  `Browser gates` fail.
- GitHub Pages deploys only from a successful push to `main`, after
  `Browser gates`.

Artifact and Pages actions use their Node.js 24 release lines
(`actions/upload-artifact@v7`, `actions/configure-pages@v6`,
`actions/upload-pages-artifact@v5`, `actions/deploy-pages@v5`). The CI contract
check rejects the retired Node.js 20 action lines and requires exactly four
general artifact-upload steps.

## Test budgets

`playwright.config.js` keeps a 60-second test timeout, one CI retry, and
`failOnFlakyTests`, so a test that passes only on retry still fails CI.

Two compound persistence workflows have scoped budgets, because under parallel
WebKit execution they crossed the global 60-second ceiling:

| Workflow | Non-WebKit timeout / duration limit | WebKit timeout / duration limit |
|---|---:|---:|
| Review ledger persistence and staleness | 60 s / 55 s | 90 s / 80 s |
| Dirty revision history and localization | 60 s / 55 s | 90 s / 80 s |

The timeout lets a long workflow reach a diagnostic boundary; the lower duration
limit still fails the test if its completed runtime deteriorates. Each successful
run logs a machine-readable `long-workflow-budget` record and attaches
`long-workflow-duration.json` to the Playwright result. No other test may register
a long-workflow budget.

- A duration-limit failure means the workflow completed but exceeded its budget.
- A 90-second timeout means the WebKit allowance was insufficient and the workflow
  needs decomposition or application-level diagnosis.

If either workflow repeatedly exceeds 80 seconds in WebKit, or other tests begin
approaching 60 seconds, revisit the budgets rather than raising them silently.

## IndexedDB in browser tests

Browser tests reach IndexedDB only through `tests/helpers/browser-persistence.js`,
which bounds every operation to 10 seconds and settles the open, request, error,
abort, and completion paths explicitly. A failure names the storage phase that
failed instead of consuming the whole test budget. The helper clears stores
rather than deleting the live database, avoiding a blocked deletion race with
the application's open connection. Test specs may not call `indexedDB` directly.
