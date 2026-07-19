# Alpha 4 visual-acceptance handoff

## Scope

Alpha 4 repairs the human-review findings from the alpha.3 evidence set without changing either analytical contract:

- localized Relationship Explorer presentation tokens in Arabic and French;
- named resistance records instead of raw enum-led labels;
- fitted or explicitly scrollable Story paths;
- readable active navigation badges in both themes;
- a shorter phone path from the header to the analysis topic;
- deterministic visual-evidence anchors;
- visual coverage for both lenses, import review, Connections, and standalone reports;
- an explicit deployed-site gate separate from local public-surface evidence.

## Required local verification

```powershell
npm ci
npx playwright install --with-deps
npm run test:ci:no-browser
npm run test:browser:core
npm run test:browser:hosted
npm run test:browser:visual-audit
```

The visual-audit command must report 18 matrix cases, 6 report cases, 96 screenshots, and 115 artifacts.

## Required deployed verification

```powershell
$env:PLAYWRIGHT_BASE_URL="https://your-deployment.example/"
npm run test:browser:deployed
Remove-Item Env:PLAYWRIGHT_BASE_URL
```

The hosted evidence metadata must record `capture_target` as `deployed`. A local run is intentionally reported as `Local public-surface evidence`, not hosted proof.

## Human acceptance review

After the automated gates pass, inspect the generated evidence for:

1. all four Story nodes visible at desktop widths, or an obvious horizontal scrollbar at intermediate widths;
2. no English relation verbs or `litigation` in Arabic and French Connections views;
3. readable active navigation counts in light and dark themes;
4. the topic task entering the first phone viewport;
5. identical capture starting positions across locale/theme pairs;
6. no private-use glyphs, mojibake, clipped prose, or page overflow in standalone reports.

Native screen-reader output, linguistic nuance, physical touch behavior, browser zoom UI, print preview, and epistemic sign-off remain human review tasks.
