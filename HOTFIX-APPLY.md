# RC 11 emergency hotfix

This overlay targets `2.0.0-bio-rc.11`. Extract it into the repository root and
allow the listed files to be replaced. It does not contain `node_modules`, test
results, visual evidence, or generated reports.

## What it fixes

- Replaces environment-specific npm tarball URLs that caused GitHub Actions
  `npm ci` timeouts with public `registry.npmjs.org` URLs.
- Updates GitHub Actions to `actions/checkout@v5`, `actions/setup-node@v5`, and
  Node.js 24.
- Allows structurally canonical but review-required Biopolitical analyses to
  import with visible warnings while keeping publication blocked.
- Safely clears malformed URLs on non-verified evidence and corrects a
  contradictory verification self-audit to `concern`.
- Keeps malformed schemas, duplicate or broken IDs/references, incomplete
  mandatory protocol sets, and invalid provenance on evidence marked
  `verified` as hard failures.
- Strengthens the generated and JSON-repair prompts in Arabic, English, and
  French so future AI output follows the importer contract.

## Verify on Windows PowerShell

```powershell
npm ci
npm run test:ci:no-browser
npx playwright install --with-deps
npx playwright test tests/import-validation.spec.js --project=chromium --workers=1
```

Then commit and push the replaced files. GitHub Actions should pass the install
stage and proceed from **No-browser gates** to **Browser gates**.

