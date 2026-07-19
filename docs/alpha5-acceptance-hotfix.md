# Alpha 5 acceptance hotfix

Alpha 5 keeps the alpha.4 application behavior and repairs two acceptance-harness blind spots found in the Windows run:

- each locale/theme cell now synchronizes through the public controls after boot, eliminating an isolated Chromium preload race;
- phone evidence still captures the accessible Connections list, then temporarily opens Map so the reviewer receives real Story geometry instead of an empty measurement.

Run:

```powershell
npm ci
npx playwright install --with-deps
npm run test:ci:no-browser
npm run test:browser:core
npm run test:browser:hosted
npm run test:browser:visual-audit
```

Expected acceptance totals:

- core: 240 passed;
- hosted/local public surface: 2 passed;
- visual audit: 24 passed;
- visual evidence review: 18 matrix cases, 6 report cases, 96 screenshots, 115 artifacts.
