# v2.1 Alpha 3 — Epistemic Foundation

## Purpose

Alpha 3 starts from the verified RC17 source and preserves it as the stable release. It introduces the shared dual-lens platform boundary plus the first evidence-first corrections discovered through the Tunisia import and exported-report audit.

## Corrected invariants

- Imported AI text can declare a verification status, but it cannot create human review or publication approval.
- A source publisher or author is not automatically an independent verifier.
- Decision readiness is separate from analytical coverage and structural completion.
- Decision readiness is capped by source traceability and independent human review.
- Publication status is shown before diagnostic scores.
- The original pasted text remains available in the current import-audit state after normalization.
- Import feedback separates blocking findings, review warnings, and automatic repairs.
- Biopolitical prompts require AI-produced evidence to remain `unverified`, with blank verifier fields.

## Compatibility

- Strategic schema `1.1.0` remains unchanged.
- Biopolitical canonical schema `2.1.0` remains unchanged.
- RC17 citation sanitation, import downgrade, report completeness, accessibility, graph, locale, and export contracts remain in the source baseline.
- Review decisions are a presentation-side overlay and never mutate canonical analytical content.

## Verification performed

- Complete `test:ci:no-browser` gate passes.
- Platform architecture, platform services, provenance, schema, fixtures, integrity, graph, report, parser, i18n, static accessibility, CI contract, and hygiene checks pass.
- Browser tests could not execute in the current workspace because the Playwright browser binary was absent and the permitted download endpoint returned an empty archive. Run the normal browser suite on a machine with installed Playwright browsers before deployment.

## Next implementation slice

1. Authenticated/local reviewer identity and evidence-by-evidence approval controls.
2. Atomic claim-to-source mappings and compound-source migration.
3. Brief / Explain / Audit result modes shared by both lenses.
4. Executive, analytical, and audit-appendix export profiles.
5. Worker-based parsing/graph calculation and lazy result-section mounting.
