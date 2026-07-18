# Deployment Notes

## Release checks

```bash
npm ci
npm run test:ci:no-browser
npx playwright install --with-deps
npm run test:ci:browser
```

The committed workflow uses npm only, Node 20, the package lock, strict no-browser gates, Chromium/Firefox/WebKit/mobile browser coverage, and hosted-evidence artifact review.

## GitHub Pages

1. Push the release root to a repository.
2. In **Settings → Pages**, choose **Deploy from branch**.
3. Select `main` and `/root`.
4. Confirm the deployed entry point is `index.html`.

Do not publish `preview/`, `biopreview/`, `node_modules/`, Playwright reports, test results, or hosted-evidence folders. The archived pages under `docs/archive/legacy-pages/` are historical prototypes, not product entry points.

## Manual verification

- Inspect Arabic, English, and French interface and analysis-language combinations.
- Import one canonical and one migrated-draft Biopolitical fixture.
- Confirm the sample remains blocked from publication because its sources are unverified.
- Open standalone Strategic and Biopolitical HTML exports.
- Parse the embedded `#canonical-analysis` payload and compare it with JSON export.
- Inspect Arabic HTML at mobile width and confirm no horizontal overflow.
- Confirm no runtime network request is required.

