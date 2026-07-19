# RC 14 Audit Addendum

Date: 2026-07-19  
Candidate: `2.0.0-bio-rc.14`  
Parent audits: `docs/rc12-audit-report.md`, `docs/rc13-audit-addendum.md`

## RC 13 evidence received

- Focused sample-language contract: 8 of 8 passed across Chromium, Firefox, WebKit, and mobile Chrome.
- Full browser core: 223 of 232 passed. Eight failures were the same French 320px/400%-equivalent control-bound assertion across four engines and both themes. One additional Firefox sample transition mismatch appeared only under the complete parallel workload.
- Hosted evidence: 2 of 2 passed and its evidence-review gate passed.
- Visual evidence: 18 of 18 cases passed and its 55-artifact review gate passed at desktop, tablet, and 390px phone sizes.

The 390px visual set is internally complete, correctly versioned, free of assistant-private glyphs in its JSON artifacts, and reports zero page overflow. Human review and the stricter 320px failures showed that those metrics did not account for clipping by an ancestor.

## RC 14 corrections

- The explorer now declares an explicit `minmax(0, 1fr)` track, preventing a localized child’s min-content width from widening the complete explorer.
- Saved-view actions use three `minmax(0, 1fr)` columns, zero minimum widths, and wrapping labels.
- Phone control groups stretch inside the constrained track instead of supplying a competing intrinsic width.
- Control visibility checks intersect every button with the viewport and all ancestors whose horizontal overflow can clip content.
- Sample-language tests verify `aria-checked="true"` on the requested lens before loading its sample.

## Required closure

RC 14 must pass the complete no-browser suite, the focused French 320px reflow cases in all four engines, the focused sample-language contract, the full browser core, hosted evidence, and regenerated visual evidence. Human MAN-001 through MAN-004 gates remain unchanged.
