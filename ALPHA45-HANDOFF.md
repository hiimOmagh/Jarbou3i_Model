# Jarbou3i Model 2.1.0-alpha.45 Handoff

## Baseline and slice

Alpha.45 is derived from the accepted Alpha.44 baseline:

`9470dfdc29d4cf086110401cbdfdead6ef5a99b4`

This slice implements only crash-safe canonical-editor recovery. Corrupt-workspace quarantine, revision restoration, storage concurrency, backup freshness, and stable-release closure remain separate roadmap slices.

## Implemented

- `jarbou3i-editor-recovery@1` checksummed recovery records.
- IndexedDB database upgrade from version 1 to version 2 with a separate `recovery-journal` object store.
- Workspace/repository/draft/base/checksum anchoring.
- Whole-session canonical payload plus raw active-field capture.
- 500 ms debounce and seven-day expiry.
- Trilingual restore/discard UI.
- Fail-closed deletion of stale, expired, corrupt, and incompatible records.
- Cleanup after saved drafts and guarded workspace resets.
- Unit and browser interruption contracts.

## Validation already completed in the package workspace

```text
npm run test:ci:no-browser
PASS
```

This includes validator regeneration, QA, static, platform, workspace, recovery, ledger, Strategic, Biopolitical, schema, fixtures, parser, accessibility, CI-contract, and hygiene gates.

Browser assertions could not execute in the packaging environment because Playwright browser executables were not installed. All attempted projects stopped before application launch. This is an environment limitation, not a passing browser result.

## Required Windows closure

From the extracted Alpha.45 root:

```powershell
npm install
npx playwright install
```

Run the focused recovery and editor authority:

```powershell
node scripts/run-playwright.mjs `
  tests/canonical-editor.spec.js `
  --project=chromium `
  --project=firefox `
  --project=webkit `
  --project=mobile-chrome `
  --workers=1
```

Required:

```text
28 passed
0 failed
```

Then run the normal release gates:

```powershell
npm run test:browser:core
npm run test:browser:hosted
npm run test:browser:visual-audit
```

Do not freeze or commit Alpha.45 until these browser and evidence gates pass from the same source state.

## Acceptance criteria

Alpha.45 is accepted only if:

- interrupted valid edits restore after reload in all four browser projects;
- raw incomplete JSON survives interruption without entering canonical history;
- successful Save removes the journal record;
- stale, expired, or checksum-invalid records are not offered;
- Alpha.44 workspace, review, resolution, export, locale, accessibility, and evidence contracts remain green.

The recovery design is disproven if a snapshot can attach to a different saved draft, bypass validation, rewrite an immutable revision, or survive a successful save as a misleading restore option.
