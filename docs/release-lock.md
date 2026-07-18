# Release Lock — 2.0.0-bio-rc.11

This document defines the audit-hardened release-candidate gate. It is not a stable release until automated evidence and the manual sign-off ledger are complete.

## Required source state

The deployable root contains the app, both independent analysis contracts, the generated browser validator, fixtures, tests, and documentation. Historical standalone pages live only under `docs/archive/legacy-pages/`.

Generated evidence and reports must not be committed:

```text
playwright-report/
test-results/
hosted-demo-evidence/
hosted-demo-evidence-local/
visual-audit-evidence/
visual-audit-evidence-local/
dist/
ci-artifacts/
*.zip
```

## Reproducible install and validation

Use Node.js 20 and the committed npm lockfile:

```bash
npm ci
npm run upgrade:layout
npx playwright install --with-deps
npm run test:ci
```

`upgrade:layout` is idempotent. It is especially important when a release was
overlaid onto an older directory; divergent legacy files are preserved and make
the command fail for manual review.

The full gate runs the no-browser contract suite first, followed by browser and hosted-evidence checks. Focused commands are:

```bash
npm run test:ci:no-browser
npm run test:browser:core
npm run test:browser:hosted
npm run test:browser:reflow
npm run test:browser:visual-audit
```

The core matrix is bounded to four workers and 60 seconds per test. This is a
release-stability requirement, not an assertion relaxation: alpha.3 proved that
16 simultaneous report/download/axe workloads could exhaust the 30-second test
budget while the same contracts passed as the queue became lighter.

To capture evidence from an actual deployment instead of the local static server:

```bash
PLAYWRIGHT_BASE_URL=https://example.invalid npm run test:browser:hosted
```

`hosted-demo-metadata.json` must disclose whether the capture target was `deployed` or `local-test-server`.

## Lock criteria

A candidate may be locked only when:

- `package.json` and page metadata report `2.0.0-bio-rc.11`;
- generated validators match the committed schemas;
- canonical Biopolitical v2.1 fixtures pass strict JSON Schema and semantic validation;
- migrated legacy material validates only as `biopolitical-migrated-draft-v1`;
- exact 13-criterion, nine-explanation, and five-capture-level checks pass;
- placeholder or unverified evidence cannot pass the publication gate;
- EN, AR, and FR language checks pass;
- import rejection, lossless export, keyboard, axe, RTL, and cross-browser checks pass;
- hosted evidence is captured, reviewed, and labelled with its true target;
- the 48-case reflow matrix passes and the 55-artifact visual-audit evidence set is captured and reviewed;
- native assistive-technology, linguistic, physical-touch, zoom, print-preview, and epistemic findings are recorded in `docs/manual-release-audit.md`;
- workspace hygiene passes after generated outputs are ignored or removed.

## CI contract

GitHub Actions uses npm only:

1. `npm ci`
2. `npm run upgrade:layout`
3. `npm run test:ci:no-browser`
4. `npx playwright install --with-deps`
5. `npm run test:ci:browser`

The browser job depends on the no-browser job and uploads hosted evidence even when a browser assertion fails.

## Feature freeze

Do not add analytical or visualization capabilities during RC validation. Only release-blocking correctness, accessibility, localization, layout, evidence, or documentation fixes belong in this candidate.
