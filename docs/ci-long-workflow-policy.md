# CI-REL-1 — Long-Workflow WebKit Budget Policy

CI-REL-1 hardens two compound persistence workflows that crossed the global
60-second Playwright test ceiling under parallel WebKit execution:

- operational review-ledger persistence and stale-state verification;
- dirty-draft revision-history localization and final IndexedDB verification.

The policy does not relax the global browser suite. `playwright.config.js`
retains the 60-second test timeout, one CI retry, and `failOnFlakyTests`.

## Scoped budgets

| Workflow | Non-WebKit timeout / duration limit | WebKit timeout / duration limit |
|---|---:|---:|
| Review ledger persistence and staleness | 60 s / 55 s | 90 s / 80 s |
| Dirty revision history and localization | 60 s / 55 s | 90 s / 80 s |

The timeout permits a long workflow to reach a diagnostic boundary. The lower
duration limit still fails the test if its completed runtime deteriorates.
Every successful run emits a machine-readable `long-workflow-budget` log record
and attaches `long-workflow-duration.json` to the Playwright result.

## IndexedDB boundary

Browser persistence tests use one helper with a 10-second operation timeout.
Database open, request, transaction error, abort, and completion paths are all
settled explicitly. Test specs may not open or delete IndexedDB directly.

The helper clears stores instead of deleting the live database, avoiding a
blocked deletion race with the application's existing connection.

## Failure interpretation

- A duration-limit failure means the workflow completed but exceeded its
  governed performance envelope.
- A 90-second timeout means the expanded WebKit allowance was insufficient and
  the workflow requires decomposition or application-level diagnosis.
- A bounded IndexedDB error identifies the failed storage phase instead of
  allowing a page-evaluation promise to consume the entire test budget.
- A retry-only pass remains a CI failure.

The scoped-budget hypothesis is disproven if either workflow repeatedly exceeds
80 seconds in WebKit, if other workflows begin approaching 60 seconds, or if a
bounded IndexedDB failure reveals an application storage defect.
