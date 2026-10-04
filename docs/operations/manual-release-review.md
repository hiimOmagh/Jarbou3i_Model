# Manual Release Review

Automation establishes structural safety. It cannot certify linguistic nuance,
screen-reader comprehension, visual hierarchy, touch comfort, or epistemic
honesty. This checklist is the human sign-off for those dimensions before a
public release. It complements, and never replaces, the automated gates in
[Continuous Integration](ci.md) and [Deployment and Release Operations](deployment.md).

## What automation already covers

- **Release matrix** (`tests/release-audit-matrix.spec.js`): every interface
  language (Arabic, English, French) and theme (light, dark) on every browser
  project, with standard and reduced motion. Each case checks Axe
  serious/critical findings, labels, selection semantics, duplicate IDs, page
  overflow, rejection of an unsupported future schema, valid sample recovery,
  relationship presentation, and a theme-neutral print palette. A separate case
  checks keyboard focus on every engine and forced-colors visibility in Chromium.
- **Reflow** (`tests/reflow-audit.spec.js`): 640 px and 320 px viewports as
  200% and 400% zoom equivalents across languages and themes.
- **Visual evidence** (`npm run test:browser:visual-audit`): deterministic
  screenshots of the shell, import audit, Strategic and Biopolitical results,
  Connections, review ledger, resolution transaction, workspace health, and the
  standalone report surfaces, across languages, themes, and desktop/tablet/phone
  viewports, checked by `tests/visual-audit-evidence-review-check.mjs`.
- **Hosted evidence** (`npm run test:browser:hosted`, or
  `npm run test:browser:deployed` against a deployed URL).

## Severity

| Level | Meaning | Release action |
| --- | --- | --- |
| Blocker | Data loss, inaccessible core task, false analytical claim, unusable locale, or broken export | Must fix before release |
| Major | Important task is confusing, materially incomplete, or difficult for a user group | Fix or obtain explicit release exception |
| Moderate | Noticeable friction with a workable alternative | Fix when practical and record disposition |
| Minor | Cosmetic or editorial polish | May defer with rationale |

## Linguistic and directional review

For Arabic, English, and French, review the shell, prompts, validation and
import messages, the nine-pillar protocol, Connections modes, the evidence
inspector, judgment, and exports in both themes. Confirm terminology is accurate,
natural, consistent, non-stigmatizing, and directionally correct. Arabic
mixed-direction IDs, dates, percentages, and citations must remain readable.

## Native assistive technology

| Environment | Required journey |
| --- | --- |
| NVDA + Firefox or Chrome | Change language and lens; import; traverse review; inspect evidence; export |
| JAWS + Chrome or Edge | Same core journey |
| VoiceOver + Safari | Same core journey, including the Spatial fallback |
| TalkBack + Android Chrome | Mobile list, inspector sheet, filters, and export |

Confirm headings and landmarks, radio groups, tabs, accordions, status messages,
modal focus, inspector focus return, relationship names, edge explanations, and
the disabled-Spatial explanation.

## Visual review

Run `npm run test:browser:visual-audit` and inspect the screenshots in
`visual-audit-evidence-local/`:

- clipping, overlap, truncation, contrast, hierarchy, density, and RTL mirroring;
- header controls wrap without overlap at phone width;
- evidence rows, score rings, and review tabs remain usable;
- no meaning is encoded by color alone, and scenario-probability colors do not
  read as quality or error states;
- names stay primary and canonical IDs secondary.

## Reflow and physical interaction

The automated 320 px / 640 px matrix is a proxy. Confirm with native browser
zoom at 200% and 400% in at least Chrome and Firefox. On a physical touch device,
check target comfort, scroll containment, inspector dismissal, focus mode, the
Spatial fallback, and the absence of accidental drag or page lock.

## Print and export

Review Strategic and Biopolitical HTML exports in all languages. Inspect print
or PDF preview from both themes in a Chromium browser and in Safari/WebKit.
Confirm readable light print colors, complete canonical metadata, named
references, the relationship atlas, temporal and comparative limits, and that no
hidden controls or clipped content appear.

For a long real-world report, also confirm that analytical readiness is not
mistaken for publication approval, every supplied HTTP(S) source opens from its
evidence record, collapsed sections remain keyboard-operable, the complete
canonical payload is available on demand, no assistant `cite`/`filecite`/`turn`
marker or private-use glyph is visible, and print expands authored sections
without forcing an oversized section onto one page.

## Epistemic integrity

For every visual mode, confirm that displayed nodes, edges, time bands,
comparisons, confidence, and evidence status trace to authored canonical
records. No layout, proximity, 3D depth, animation, or visual prominence may
imply an unauthored causal or normative claim.

## Release assets

- The header logo uses `assets/jarbou3i-mascot-192.png`; the welcome card uses
  `assets/jarbou3i-mascot-512.png`; the favicon uses `assets/favicon-32.png`.
- The Apple touch icon exists and the manifest icon preview works.

## Finding register

Record each finding as Pass, fixed and reverified, or explicitly accepted with
impact, owner, and rationale. A release is eligible only when every required
row has one of those dispositions.

| ID | Surface / locale / theme / viewport | Severity | Finding | Evidence | Owner | Disposition |
| --- | --- | --- | --- | --- | --- | --- |
| MAN-001 | Native assistive technology | Major | NVDA, JAWS, VoiceOver, and TalkBack journeys are not yet recorded. | Assistive technology table above | Human QA | Pending |
| MAN-002 | Linguistic and epistemic nuance | Major | Native Arabic, French, and English terminology review and the authored-relationship trace review are not yet recorded. | Linguistic and epistemic sections above | Human domain reviewer | Pending |
| MAN-003 | Physical zoom, print, and touch | Major | Native 200%/400% zoom, print/PDF preview, and physical touch-device review are not yet recorded. | Reflow, print, and interaction sections above | Human QA | Pending |
| MAN-004 | Long-form report / all locales | Major | Progressive disclosure, source navigation, portable citations, truthful publication status, and long-report print output need human review in Chromium and Safari/WebKit. | Print and export section above | Human QA + domain reviewer | Pending |
