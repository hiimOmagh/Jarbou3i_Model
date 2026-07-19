# RC 12 Audit and Remediation Report

Date: 2026-07-18  
Candidate: `2.0.0-bio-rc.12`  
Scope: Strategic v1.1 and Biopolitical Training Map v2.1 import, validation, review, export, localization, accessibility contracts, and the supplied long-form Tunisia outcome.

## Decision

RC 11 should remain the deployed historical baseline. The corrections in this report are versioned as RC 12 because they materially change import sanitation and the human-readable Biopolitical report without changing the canonical schemas or authored analytical model.

RC 12 passes every executable no-browser release gate in this workspace. Browser binaries are not installed in this environment, so the cross-engine Playwright matrix and the human sign-offs recorded in `docs/manual-release-audit.md` remain release requirements rather than being represented as completed.

## Release-blocking findings resolved

| Area | RC 11 finding | RC 12 disposition |
| --- | --- | --- |
| Citation portability | AI-interface `cite`, `filecite`, and `turn…` markers could enter canonical strings and render as private-use glyphs. | Recursive sanitation runs for both lenses before review/export. Repairs preserve authored text and are disclosed with an exact marker count. |
| Prompt discipline | Generated output could include provider-specific citation syntax that the standalone report could not render. | Strategic and Biopolitical prompts and all repair prompts prohibit assistant-internal markers and require canonical evidence IDs plus public HTTP(S) URLs. |
| Publication truthfulness | A very high analytical-readiness score visually dominated a blocked publication gate. | The report hero labels readiness as a diagnostic index, states that it is not permission to publish, and gives the independent publication gate equal prominence. |
| Evidence usability | Sources were inert text and evidence references often appeared as bare IDs. | Valid public sources are real links with safe external-link attributes. References use human-readable names while retaining canonical IDs. |
| Long-report density | Every record and the full pretty-printed canonical payload were presented in one long document. | The executive judgment and blockers appear first; 13 report sections use native progressive disclosure; the JSON appendix is rendered only on request. |
| Navigation | The standalone outcome had no contents landmark, skip path, or report controls. | A table of contents, skip link, expand/collapse controls, print control, focus styles, and deterministic reference navigation are included. |
| Print fragmentation | Large sections were forced to avoid page breaks, risking clipping or excessive whitespace. | Report sections allow page fragmentation; individual records remain protected where practical; all authored sections expand for print while the machine JSON view is omitted. |
| Modularity | Report generation was embedded in the already large application module. | `src/biopolitical-report.js` is a dedicated dependency-free renderer with its own trilingual contract test. |

## Supplied Tunisia outcome

The supplied RC 11 export was used as a real-world stress fixture. Its embedded canonical JSON was revalidated and rendered with RC 12.

| Measure | Supplied RC 11 export | RC 12 remediated outcome |
| --- | ---: | ---: |
| File size | 524,296 bytes | approximately 438,000 bytes |
| Human-readable words (scripts/styles excluded) | 36,617 | approximately 21,400 |
| Progressive-disclosure regions | 1 | 17 |
| Links | 0 | more than 500 named/internal links, including 20 direct source links |
| Private-use glyph code points | 1,261 | 0 |
| Citation clusters in canonical payload | 30 | 0 |
| Publication status | Blocked, but visually subordinate to the score | Blocked and explicit beside the 99% readiness score |

The reduction is achieved without dropping the canonical contract: the complete sanitized analysis remains embedded once in `#canonical-analysis` and is JSON-equivalent to the normalized imported analysis.

## Automated evidence

`npm run test:ci:no-browser` passes, including:

- generated validator integrity;
- QA and source-of-truth checks;
- static syntax, dependency, version, and release-layout checks;
- Biopolitical schema, semantic-integrity, relationship-graph, and standalone-report contracts;
- exact fixture and parser contracts;
- Arabic, English, and French language coverage;
- static accessibility and CI workflow contracts;
- workspace hygiene.

New regressions cover exact citation-repair counts, preservation of authored text, absence of private-use glyphs and `turn…` IDs, trilingual report metadata and direction, truthful publication messaging, source-link safety, unique IDs, complete reference targets, canonical JSON equality, and print fragmentation rules. Browser specs additionally cover repaired imports and exports for both analysis lenses.

## Required browser and human closure

Before calling RC 12 release-ready, run on a machine with Playwright browsers installed:

```powershell
npm ci
npx playwright install --with-deps
npm run test:ci:no-browser
npm run test:browser:core
npm run test:browser:hosted
npm run test:browser:visual-audit
```

Then complete MAN-001 through MAN-004 in `docs/manual-release-audit.md`, with particular attention to native screen readers, Arabic/French editorial nuance, 200%/400% native zoom, physical touch, and Chromium plus Safari/WebKit print/PDF output of the remediated long report.

## Residual boundary

No automated suite can establish that an analysis is factually true, politically neutral, legally current, or publication-ready. The tool now communicates that boundary accurately: structural/analytical readiness and publication eligibility are separate, and unresolved source verification or self-audit concerns remain blocking.
