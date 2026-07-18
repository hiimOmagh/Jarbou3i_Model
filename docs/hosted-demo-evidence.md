# Hosted UI Evidence — 1.4.0-bio-alpha.4

The browser evidence flow can target either the local static test server or a deployed public URL. The generated metadata explicitly records which one was used.

## Local capture

```bash
npm run test:browser:hosted
```

Output defaults to `hosted-demo-evidence-local/` and is automatically reviewed by the package script.

## Deployed capture

```bash
PLAYWRIGHT_BASE_URL=https://example.invalid \
HOSTED_DEMO_EVIDENCE_DIR=hosted-demo-evidence \
npm run test:browser:hosted
```

When `PLAYWRIGHT_BASE_URL` is set, Playwright does not start the local server. Relative test navigation targets the supplied deployment.

## Evidence contract

The capture covers the first desktop and mobile screens, both analysis lenses, and visible-text snapshots for Arabic, English, and French. The reviewer checks version metadata, file completeness, locale direction, lens visibility, and the disclosed capture target.

Generated evidence, Playwright reports, and test results are ignored outputs. Run `npm run test:hygiene` before handoff.
