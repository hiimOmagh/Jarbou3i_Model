# Manual Release Audit — RC Sign-off

Automation establishes structural safety; it cannot certify linguistic nuance, screen-reader comprehension, visual hierarchy, touch comfort, or epistemic honesty. This ledger is the required human sign-off for those dimensions.

## Severity

| Level | Meaning | Release action |
| --- | --- | --- |
| Blocker | Data loss, inaccessible core task, false analytical claim, unusable locale, or broken export | Must fix before release |
| Major | Important task is confusing, materially incomplete, or difficult for a user group | Fix or obtain explicit release exception |
| Moderate | Noticeable friction with a workable alternative | Fix when practical and record disposition |
| Minor | Cosmetic or editorial polish | May defer with rationale |

## Linguistic and directional review

For Arabic, English, and French, review the shell, prompt, validation failures, nine-pillar protocol, Connections modes, evidence inspector, judgment, and exports in both themes. Confirm terminology is accurate, natural, consistent, non-stigmatizing, and directionally correct. Arabic mixed-direction IDs, dates, percentages, and citations must remain readable.

## Native assistive technology

| Environment | Required journey | Result | Reviewer / date | Finding IDs |
| --- | --- | --- | --- | --- |
| NVDA + Firefox or Chrome | Change language and lens; import; traverse review; inspect evidence; export | Pending |  |  |
| JAWS + Chrome or Edge | Same core journey | Pending |  |  |
| VoiceOver + Safari | Same core journey, including Spatial fallback | Pending |  |  |
| TalkBack + Android Chrome | Mobile list, inspector sheet, filters, and export | Pending |  |  |

Confirm headings and landmarks, radio groups, tabs, accordions, status messages, modal focus, inspector focus return, relationship names, edge explanations, and disabled Spatial explanation.

## Visual evidence review

Run `npm run test:browser:visual-audit`, then inspect all 36 screenshots in `visual-audit-evidence-local/`:

- shell and Connections review;
- Arabic, English, and French;
- light and dark;
- desktop, tablet, and phone;
- clipping, overlap, truncation, contrast, hierarchy, density, and RTL mirroring;
- no meaning encoded by color alone;
- names remain primary while canonical IDs remain secondary.

RC 8 human evidence review was performed on 2026-07-18 across all 36 supplied screenshots and both supplied evidence archives. Automated structure was complete and archive integrity passed. RC 9 closed the mascot and phone capture-target findings. Regenerated RC 10 evidence then confirmed physical toast clearance and visible explorer content in all six phone Connections intersections, closing the final evidence-fidelity finding.

## Reflow and physical interaction

The automated 320px/640px matrix is a proxy for 400%/200% reflow. Confirm with native browser zoom at 200% and 400% on at least Chrome and Firefox. On a physical touch device, check target comfort, scroll containment, inspector dismissal, focus mode, Spatial fallback, and absence of accidental drag or page lock.

## Print and export

Review Strategic and Biopolitical HTML exports in all languages. Inspect Chromium and Safari/WebKit print or PDF preview from both themes. Confirm readable light print colors, complete canonical metadata, named references, relationship atlas, temporal/comparative limits, and absence of hidden controls or clipped content.

RC 12 additionally requires a real-world long-report pass: confirm that analytical readiness is not mistaken for publication approval, every supplied HTTP(S) source opens from its evidence record, collapsed sections remain keyboard-operable, the complete canonical payload is available on demand, no assistant `cite`/`filecite`/`turn` marker or private-use glyph is visible, and print expands authored report sections without forcing an oversized section onto one page. RC 13 additionally requires the focused four-engine sample-language contract and regenerated French phone Connections evidence.

## Epistemic integrity

For every visual mode, confirm that displayed nodes, edges, time bands, comparisons, confidence, and evidence status trace to authored canonical records. No layout, proximity, 3D depth, animation, or visual prominence may imply an unauthored causal or normative claim.

## Finding register

| ID | Surface / locale / theme / viewport | Severity | Finding | Evidence | Owner | Disposition |
| --- | --- | --- | --- | --- | --- | --- |
| VIS-001 | Shell / French light phone and hosted Arabic mobile | Moderate | The critical guide mascot was captured as an empty frame because screenshot capture could precede asynchronous image decoding. | RC 8: `shell-fr-light-phone.png`, `mobile-first-screen.png`; RC 9 regenerated equivalents | Engineering | Closed: RC 9 evidence shows the decoded mascot in both formerly affected captures. |
| VIS-002 | Connections / all locales / phone / both themes | Moderate | The sample-loaded toast obscured the Relationship Explorer. RC 9 removed the active class before capture, but the fixed 84px hidden translation left tall localized messages partly visible. | RC 8 and RC 9 phone Connections screenshots; regenerated RC 10 six-phone evidence set | Engineering | Closed: RC 10 evidence is toast-free in Arabic, English, and French across both themes, and each capture exposes the Relationship Explorer. |
| VIS-003 | Connections / all locales / phone / both themes | Major (audit coverage) | Phone captures prioritized the review navigation and showed too little explorer content for meaningful human inspection. | RC 8 and RC 9 phone Connections screenshots | Engineering | Closed: RC 9 captures target `relationshipExplorerMount` and expose the explorer controls in all six phone intersections. |
| LOC-001 | French / Strategic sample / all browser projects | Moderate | Citation sanitation removed the authored French space before the sample title’s colon. | RC 12 browser core: the same sample-language assertion failed in Chromium, Firefox, WebKit, and mobile Chrome; RC 13 focused rerun: 8/8 passed. | Engineering | Closed by RC 13 punctuation preservation. RC 14 also waits for explicit selected-lens state before each sample load in the parallel browser contract. |
| VIS-004 | Connections / French / phone / both themes | Moderate | Longer French labels were clipped despite page-level `scrollWidth` reporting no overflow. RC 13 improved the 390px grouping, but the saved-view grid still forced the implicit explorer track beyond its clipped parent at 320px/400%-equivalent width. | RC 12 and RC 13 French phone screenshots; RC 13 full core: eight consistent 320px failures across four engines and both themes. | Engineering | RC 14 constrains the explorer track, makes saved-view columns shrinkable, and tests controls against every clipping ancestor; focused 320px and regenerated evidence reruns required. |
| TST-001 | Sample-language contract / Firefox / full parallel matrix | Minor (test reliability) | One full-matrix transition loaded the preceding Biopolitical lens while the isolated eight-case contract was fully green. | RC 13 focused contract: 8/8 passed; full core: one Firefox transition mismatch. | Engineering | RC 14 asserts the selected lens state before activating sample load; full browser rerun required. |
| MAN-001 | Native assistive technology | Major (release sign-off) | NVDA, JAWS, VoiceOver, and TalkBack journeys are not yet recorded. | Required environment table above | Human QA | Pending. |
| MAN-002 | Linguistic and epistemic nuance | Major (release sign-off) | Native Arabic/French/English terminology review and final authored-relationship trace review are not yet recorded. | Linguistic and epistemic sections above | Human domain reviewer | Pending. |
| MAN-003 | Physical zoom, print, and touch | Major (release sign-off) | Native 200%/400% zoom, print/PDF preview, and physical touch-device review are not yet recorded. | Reflow, print, and interaction sections above | Human QA | Pending. |
| MAN-004 | RC 12 long-form outcome / all locales | Major (release sign-off) | Progressive disclosure, source navigation, portable citations, truthful publication status, and long-report print output need human review in Chromium and Safari/WebKit. | RC 12 remediated Tunisia report and generated AR/EN/FR samples | Human QA + domain reviewer | Pending. |

The RC is eligible for release only when every required row is Pass, fixed and reverified, or explicitly accepted with impact, owner, and rationale.
