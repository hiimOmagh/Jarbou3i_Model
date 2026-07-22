# Alpha.41 Resolution Accessibility Correction

Release candidate: `2.1.0-alpha.41`

## Defect

Alpha.40 used the light-theme token pair `--muted: #65758b` and `--surface-soft: #f8fafc`. Runtime Axe testing measured 4.48:1 contrast for small bold labels in the resolution dialog, below the WCAG 2 AA 4.5:1 minimum. The same shared defect reproduced in Chromium, Firefox, WebKit, and mobile Chrome.

Affected labels included Base revision, Whole-draft validation, Proposal integrity, Before, and After. Resolution transaction behavior itself did not fail.

## Correction

Alpha.41 changes only the light-theme muted token to `#5f6f84`. The calculated contrast against `#f8fafc` is approximately 4.90:1. The dark-theme token remains unchanged.

The static accessibility check now calculates relative luminance and requires at least 4.75:1 for this token pair. That safety margin guards against another nominally compliant but rounding-sensitive value. The runtime Axe test is not excluded, weakened, or modified.

## Falsification and release gate

The correction is disproven if any supported browser reports a serious or critical contrast violation, if the full 336-case core regresses, or if regenerated visual evidence reveals unacceptable hierarchy changes.

Required Windows authority:

```powershell
node scripts/run-playwright.mjs tests/a11y.spec.js `
  --project=chromium `
  --project=firefox `
  --project=webkit `
  --project=mobile-chrome `
  --workers=1

npm run test:ci:no-browser
npm run test:browser:resolution
npm run test:browser:core
npm run test:browser:hosted
npm run test:browser:visual-audit
```

Required results: 4/4 accessibility cases, 8/8 resolution cases, 336/336 browser-core cases, 2/2 hosted cases, 24/24 visual-audit cases, and 156 screenshots / 175 artifacts.
