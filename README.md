# Strategic Analysis Workbench

A bilingual, client-side workbench for structured strategic analysis using the model:

**Interests → Actors → Tools → Narrative → Results → Feedback**

The tool generates a structured prompt for your preferred AI assistant, imports the JSON answer, then turns it into a navigable analysis with scoring diagnostics, contradictions, scenarios, evidence, assumptions, and exportable reports.

## Live usage model

1. Enter an analysis topic.
2. Copy the generated prompt.
3. Paste it into ChatGPT, Claude, Gemini, Perplexity, or another AI assistant.
4. Copy only the JSON result.
5. Paste the JSON into the workbench.
6. Review, score, inspect, and export the analysis.

## Key properties

- **No API key required**
- **No backend required**
- **Static GitHub Pages compatible**
- **Runs client-side in the browser**
- **Arabic and English UI**
- **RTL/LTR aware**
- **Structured JSON import**
- **Weighted scoring diagnostics**
- **Contradiction analysis with affected layers**
- **Scenario/falsifier review**
- **Evidence and assumption review**
- **HTML, Markdown, and JSON export**

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

Install dependencies and run the smoke tests:

```bash
npm install
npx playwright install --with-deps
npm test
```

The smoke suite checks the public user flow:

- page load
- language switch
- dark mode toggle
- sample analysis import
- review tab navigation
- runtime self-check
- invalid JSON handling
- export buttons

## Files

```text
index.html                      # deployable static app
fixtures/sample-analysis-en.json # sample structured analysis
fixtures/sample-analysis-ar.json # Arabic sample structured analysis
tests/smoke.spec.js              # Playwright smoke test
docs/usage-guide.md              # usage guide
docs/visual-qa.md                # manual visual QA checklist
.github/workflows/ci.yml         # GitHub Actions smoke test
```

## Public release

This repository starts public versioning at **1.0.0**. Earlier internal prototype/build numbers are intentionally not part of the public release history.

Before announcing a major public rollout, run:

- browser tests in Chrome, Firefox, Edge, and Safari if available
- Arabic RTL visual QA
- mobile viewport QA
- exported HTML report QA
- print/PDF QA

## Versioning

Public semantic versioning starts at **1.0.0**. Internal development versions are omitted from the public changelog to keep the repository clean and understandable for first-time users.

## License

MIT. See [`LICENSE`](LICENSE).
