# Jarbou3i Model — Strategic Analysis Workbench

A trilingual, client-side workbench for structured strategic analysis using the model:

**Interests → Actors → Tools → Narrative → Results → Feedback**

The tool generates a structured prompt for your preferred AI assistant, imports the JSON answer, then turns it into a navigable analysis with scoring diagnostics, contradictions, scenarios, evidence, assumptions, and a polished standalone HTML report export.

## Live usage model

1. Enter an analysis topic.
2. Choose the analysis language and prompt mode.
3. Copy the generated prompt.
4. Paste it into ChatGPT, Claude, Gemini, Perplexity, or another AI assistant.
5. Copy only the JSON result.
6. Paste the JSON into the workbench.
7. Review, score, inspect, and export the analysis as HTML.

## Key properties

- No API key required
- No backend required
- Static GitHub Pages compatible
- Runs client-side in the browser
- Arabic, English, and French UI
- RTL/LTR aware
- Structured JSON import with recovery from common messy output wrappers
- Weighted scoring diagnostics
- Contradiction analysis with affected layers
- Scenario/falsifier review
- Evidence and assumption review
- HTML report export only, to keep the workflow focused
- Optimized mascot/icon assets for public web deployment
- Small PWA manifest for better install/share metadata

## Privacy model

This repository contains a static browser-based tool. The tool itself does not include backend storage, tracking, account login, or server-side processing.

You control where you send the generated prompt. If you paste sensitive content into a third-party AI assistant, that content is subject to that assistant/provider's privacy terms.

Do not paste confidential, personal, classified, legally sensitive, or proprietary information into third-party AI systems unless you understand the risk and have permission.

## Local use

Open `index.html` directly in a browser, or run a local static server:

```bash
npm install
npm run dev
```

Then open:

```text
http://127.0.0.1:4173
```

## GitHub Pages deployment

Recommended simple deployment:

1. Create a GitHub repository.
2. Upload this folder's contents.
3. Go to **Settings → Pages**.
4. Select **Deploy from branch**.
5. Choose `main` and `/root`.
6. Save.

Your app will be available at the GitHub Pages URL.

## Testing

Install dependencies and run:

```bash
npm install
npx playwright install --with-deps
npm test
```

Available scripts:

```bash
npm run test:static  # no browser required
npm run test:e2e     # Playwright browser flow
npm test             # static checks + Playwright flow
```

The static suite checks:

- JavaScript syntax
- duplicate DOM IDs
- optimized runtime asset references
- manifest integrity
- absence of removed export/self-check code paths

The browser smoke suite checks:

- page load
- optimized icon/mascot references
- language switch and RTL/LTR direction
- theme toggle state
- prompt preview modal
- sample analysis import
- review tab navigation
- HTML-only export workflow

## Files

```text
index.html                         # deployable static app
manifest.webmanifest               # app/share metadata
assets/jarbou3i-mascot.png         # original high-resolution source asset
assets/jarbou3i-mascot-512.png     # optimized welcome/Open Graph/runtime asset
assets/jarbou3i-mascot-192.png     # optimized header/manifest asset
assets/apple-touch-icon.png        # Apple touch icon
assets/favicon-32.png              # browser favicon
fixtures/sample-analysis-en.json   # English sample structured analysis
fixtures/sample-analysis-ar.json   # Arabic sample structured analysis
fixtures/sample-analysis-fr.json   # French sample structured analysis
tests/static-check.mjs             # static release checks
tests/smoke.spec.js                # Playwright smoke test
docs/usage-guide.md                # usage guide
docs/visual-qa.md                  # manual visual QA checklist
.github/workflows/ci.yml           # GitHub Actions smoke test
```

## Public release

Public semantic versioning starts at **1.0.0**. Version **1.1.0** adds the analytical rigor layer: formal schema, Research mode, computed metrics, source discipline, and fixture validation.

Before announcing a public rollout, run:

- `npm run test:static`
- `npm test` after Playwright browsers are installed
- Chrome/Edge manual visual QA
- Arabic RTL visual QA
- mobile viewport QA around 390 px width
- exported HTML report QA

## License

MIT. See [`LICENSE`](LICENSE).


## v1.1 Analytical rigor layer

This release elevates the tool from a polished static workflow into a schema-governed analytical workbench. New additions include Research prompt mode, `schema_version: 1.1.0`, stable IDs, computed API/NSI/tool-pressure/interest-weight metrics, source/counter-evidence fields, and a quality gate before export.

Recommended validation:

```bash
npm run test:static
npm run test:fixtures
npm test
```
