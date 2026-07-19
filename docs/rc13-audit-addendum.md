# RC 13 Audit Addendum

Date: 2026-07-18  
Candidate: `2.0.0-bio-rc.13`  
Parent audit: `docs/rc12-audit-report.md`

## Evidence received

The RC 12 no-browser suite passed in full. The browser core passed 228 of 232 cases; the four failures were the same deterministic French Strategic sample-title mismatch in Chromium, Firefox, WebKit, and mobile Chrome. Hosted evidence passed two of two cases and its review gate. Visual evidence passed all 18 capture cases and its 55-artifact review gate.

Human inspection of the supplied screenshots found one additional blind spot that the page-level overflow metric did not detect: longer French Relationship Explorer labels were clipped at the physical right edge on phone captures.

## RC 13 corrections

- Citation sanitation now removes whitespace before commas and full stops only, preserving authored French spacing before `:`, `;`, `!`, and `?`.
- Phone explorer option groups occupy separate content-safe rows, with equal flexible buttons and wrapping labels.
- The visual-audit and reflow suites now compare every visible explorer control’s physical bounds with the viewport instead of relying only on document `scrollWidth`.
- No analytical method, schema, fixture content, graph projection, publication gate, or standalone-report structure changed.

## Current decision

RC 13 passes the complete no-browser validation chain and is packaged as the browser-verification candidate. Release closure additionally requires the focused four-engine sample-language test and regenerated visual evidence, especially the two French phone Connections screenshots. The native assistive-technology, linguistic, physical-device, zoom, and print sign-offs in `docs/manual-release-audit.md` remain human gates.
