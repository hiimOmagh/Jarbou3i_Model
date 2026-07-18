# Evidence Artifact Review — 1.4.0-bio-alpha.4

The hosted-evidence review verifies that browser captures are complete, version-aligned, locale-aware, and honest about their target.

## Capture and review

Local test-server capture:

```bash
npm run test:browser:hosted
```

Deployed capture:

```bash
PLAYWRIGHT_BASE_URL=https://example.invalid npm run test:browser:hosted
```

Manual review of an extracted artifact:

```bash
node tests/hosted-demo-evidence-review-check.mjs hosted-demo-evidence
```

## Required files

```text
desktop-first-screen.png
mobile-first-screen.png
strategic-mode.png
biopolitical-mode.png
visible-text-ar.json
visible-text-en.json
visible-text-fr.json
hosted-demo-metadata.json
```

The metadata must report version `1.4.0-bio-alpha.4`, capture set `public-ui-lock`, the generating spec, Chromium and mobile projects, every required file, and `capture_target` as either `deployed` or `local-test-server`.

Each visible-text snapshot must carry the correct language/direction pair: Arabic/RTL and English or French/LTR. Screenshots are review evidence; they are not described as approved pixel-diff baselines.
