# QA Matrix — 1.4.0-bio-alpha.4

## No-browser gates

| Command | Coverage |
|---|---|
| `npm run test:qa` | source layout, version, runtime order, release-root hygiene |
| `npm run test:static` | syntax, assets, generated validator, accessibility and export markers |
| `npm run test:bio:v2` | method cardinality, prompt safety, strict routing, review coverage, migration identity |
| `npm run test:bio:integrity` | duplicate IDs, broken references, 13/9/5 exactness, schema types, future versions, evidence gaming |
| `npm run test:schema` | strict Ajv compile and canonical/draft fixture validation |
| `npm run test:fixtures` | Strategic compatibility and trilingual Biopolitical fixture invariants |
| `npm run test:parser` | URLs, string comment markers, fences, comments, trailing commas, invalid input |
| `npm run test:i18n:bio` | Arabic/French analytical prose and language identity |
| `npm run test:a11y:static` | static and generated semantic contracts |
| `npm run test:ci:contract` | npm-only scripts/workflow alignment |

Run them together with `npm run test:ci:no-browser`.

The local cross-browser matrix defaults to four workers and a 60-second
per-test budget. GitHub Actions sets `PLAYWRIGHT_WORKERS=2` after the Alpha.17
run showed WebKit actionability scrolling and a Firefox report download exceed
the budget under concurrent load. The assertions remain fully parallel within
that bounded pool. On a constrained machine, use the same setting without
changing the contract:

```powershell
$env:PLAYWRIGHT_WORKERS=2
npm run test:browser
```

## Browser gates

| Spec | Coverage |
|---|---|
| `a11y.spec.js` | axe serious/critical scan, radio-group and tab keyboards, semantic accordions, modal focus |
| `smoke.spec.js` | main dual-lens workflow |
| `rtl-mobile.spec.js` | Arabic RTL and 390 px overflow |
| `import-validation.spec.js` | future contract, malformed type, duplicate ID, migrated draft |
| `lens-import-contract.spec.js` | imported-lens authority |
| `export-contract.spec.js` | report identities and metadata |
| `export-completeness.spec.js` | lossless high-value field and JSON coverage |
| `cross-locale-export-contract.spec.js` | AR/EN/FR analysis-language exports |
| `hosted-demo-evidence.spec.js` | UI screenshots and visible-text evidence with a disclosed local/deployed target |

`npm run test:browser` runs Chromium, Firefox, WebKit, mobile Chrome, and the hosted-evidence review. `npm test` runs the full no-browser and browser contract.

## Manual release gate

- Inspect light/dark and AR/EN/FR UI.
- Verify interface-language changes do not overwrite imported analysis language.
- Confirm raw enum codes remain in JSON while labels are localized in review/export.
- Confirm every visible publication-ready status agrees with canonical, semantic, source, explanation, and self-audit blockers.
- Open HTML and JSON downloads outside the app and compare payloads.
- Confirm the two archived prototype pages are absent from the release root.
