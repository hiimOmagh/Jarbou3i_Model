# Final Release Audit Matrix

This phase turns the verified Phase 4 feature baseline into an intersection-tested release candidate. It does not change the Strategic engine, the Biopolitical Training Map v2.1 schema, or canonical analysis content.

## Automated release gate

The browser matrix crosses every interface language and theme with every supported runtime class:

| Axis | Coverage |
| --- | --- |
| Interface language | Arabic, English, French |
| Direction | RTL and LTR |
| Theme | Light and dark |
| Desktop engines | Chromium, Firefox, WebKit |
| Mobile runtime | Mobile Chrome / Pixel 5 profile |
| Motion | Standard motion and reduced motion |
| Data condition | Valid canonical sample and rejected future-schema input |
| Relationship presentation | Responsive Map or complete mobile List fallback |
| Accessibility | Axe serious/critical gate, labels, selection semantics, keyboard focus, duplicate-ID check |
| Layout | Page overflow at every matrix cell |
| Print | Theme-neutral readable palette and visible review content |
| System colors | Forced-colors selected-state and focus visibility |
| Human visual evidence | 36 decode-gated, transient-free screenshots: shell and Connections across 3 languages × 2 themes × 3 viewports |

The Cartesian language/theme/runtime gate contains 24 primary cases. Four additional cross-engine keyboard-focus cases supplement it, with forced-colors emulation activated in Chromium where that media feature is supported by the audit runtime.

## Manual audit retained for final sign-off

Automation cannot certify meaning, screen-reader phrasing, or visual taste. Final sign-off therefore retains:

1. Native NVDA or JAWS review on Windows and VoiceOver review on Safari.
2. Human linguistic review of Arabic, English, and French analytical terminology.
3. Visual inspection at 200% and 400% browser zoom.
4. Printed or PDF-preview inspection in at least one Chromium browser and Safari/WebKit.
5. Touch-device inspection for drag, scroll, and target comfort on physical hardware.
6. Epistemic review that every visualization remains a projection of authored records rather than an inferred claim.

## Exit rule

The release candidate is not cleared while any no-browser gate, any of the 24 intersection cases, the forced-colors case, the 216-test browser core, hosted evidence capture, visual-evidence capture, or either evidence review is failing. Manual findings must be recorded as pass, fixed and reverified, or explicitly deferred with impact and rationale.
