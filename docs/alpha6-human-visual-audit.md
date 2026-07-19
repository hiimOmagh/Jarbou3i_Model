# Alpha 6 human visual-audit closure

## Decision

Alpha 5 passed its automated gates, but human inspection of all 96 screenshots found three audit blind spots and one phone-density weakness. Alpha 6 repairs those issues without changing either analytical contract, schema, fixture meaning, or canonical export payload.

## Closed findings

| ID | Severity | Alpha 5 finding | Alpha 6 control |
|---|---:|---|---|
| VIS-006 | High | Arabic and French import audits exposed English explanatory warnings beside canonical paths. | Known integrity findings and generic schema failures are localized; canonical paths remain isolated `dir="ltr"`. |
| EVD-004 | High | Report screenshots could be captured mid-smooth-scroll and therefore miss the report hero while still passing. | The audit disables smooth scrolling, polls `scrollY === 0`, asserts the hero is in the viewport, then captures it. |
| VIS-007 | Medium | Multiple named report references could leave a standalone `·` on a narrow line. | Multi-reference values render as a responsive `referenceGroup` without separator glyphs. |
| UX-004 | Medium | Phone result navigation used six full-width rows, delaying the active judgment. | Phone result navigation uses a compact two-column index while preserving tab order, labels, counts, and keyboard behavior. |
| EVD-005 | Medium | One report screenshot per case did not demonstrate the atlas, directory, or appendix. | Every report case captures five surfaces: hero, first pillar, relationship atlas, reference directory, and canonical appendix. |

## Evidence contract

- 18 language/theme/viewport matrix cases.
- 6 standalone-report cases: Arabic, English, and French at desktop and phone widths.
- 5 report surfaces per report case.
- 120 screenshots and 139 total artifacts.
- Chromium is the deterministic screenshot renderer; the core suite remains cross-engine across Chromium, Firefox, WebKit, and mobile Chrome.

## Required verification

```powershell
npm ci
npx playwright install --with-deps
npm run test:ci:no-browser
npm run test:browser:core
npm run test:browser:visual-audit
npm run test:browser:hosted
```

For the deployed gate:

```powershell
$env:PLAYWRIGHT_BASE_URL="https://jarbou3i-model.pages.dev/"
npm run test:browser:deployed
Remove-Item Env:PLAYWRIGHT_BASE_URL
```

## Human review focus

After regenerating the Alpha 6 evidence, inspect these surfaces before promotion:

1. Arabic and French import-audit explanations contain no English prose; paths such as `/evidence/items/0/source_url` remain readable and correctly ordered.
2. Phone Strategic and Biopolitical result captures show the active judgment materially earlier than Alpha 5.
3. Every `report-<lang>-<viewport>.png` begins at the report hero and publication gate.
4. `report-pillar-*`, `report-relationships-*`, `report-references-*`, and `report-canonical-*` contain the intended section rather than an intermediate scroll position.
5. Narrow report reference groups show named records with canonical IDs and no isolated punctuation line.
6. Light and dark themes retain clear active navigation, warning, success, and disabled states in all three languages.

Native screen-reader operation, physical touch ergonomics, browser print-preview pagination, and final Arabic/French editorial terminology remain human sign-off responsibilities rather than claims made by screenshot automation.
