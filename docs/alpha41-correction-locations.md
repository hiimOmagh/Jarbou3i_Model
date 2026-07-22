# Alpha.41 Correction Locations

Apply these files over the Alpha.40 repository while preserving their relative paths. The correction-only archive already uses this layout.

## Functional correction

- `src/styles.css:13` — change the light-theme `--muted` token from `#65758b` to `#5f6f84`. Do not change the `body.dark` token.
- `tests/a11y-static-check.mjs` — add the calculated 4.75:1 light-token safety-margin guard. Do not alter or exclude the runtime Axe assertion in `tests/a11y.spec.js`.

## Alpha.41 identity authorities

- `package.json`
- `package-lock.json`
- `index.html`
- `src/app.js`
- `src/styles.css`
- `tests/biopolitical-report-check.mjs`
- `tests/ci-script-contract-check.mjs`
- `tests/cross-locale-export-contract.spec.js`
- `tests/evidence-intelligence.spec.js`
- `tests/evidence-review-plan-check.mjs`
- `tests/evidence-review-plan.spec.js`
- `tests/evidence-traceability-check.mjs`
- `tests/export-contract.spec.js`
- `tests/hosted-demo-evidence-review-check.mjs`
- `tests/hosted-demo-evidence.spec.js`
- `tests/lens-import-contract.spec.js`
- `tests/qa-check.mjs`
- `tests/source-of-truth-check.mjs`
- `tests/static-check.mjs`
- `tests/visual-audit-evidence-review-check.mjs`
- `tests/visual-audit-evidence.spec.js`

## Release documentation

- `README.md`
- `CHANGELOG.md`
- `docs/alpha41-resolution-accessibility-correction.md`
- `docs/alpha41-correction-locations.md`

The historical Alpha.40 contract and audit documents remain unchanged. The correction does not modify resolution logic, workspace format, prompts, canonical schemas, imports, exports, or dark-theme colors.
