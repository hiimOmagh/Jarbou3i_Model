# Changelog

## v1.3.0 — Stable Editorial UI Refresh

Freshened the stable client-side app with the dark editorial intelligence workspace direction.

### Added

- Three-pane desktop workspace: **Source → Structure → Brief**.
- Empty onboarding state with topic, prompt, and JSON import flow.
- Editorial brief preview with findings, contradiction pullout, layer nodes, evidence, scenarios, and export view.
- Collapsible bottom quality rail with schema, coverage, sourcing, contradiction, falsifier, and publication-risk signals.
- Source ↔ Structure ↔ Brief binding via stable item IDs.
- Trilingual UI chrome for Arabic, English, and French.
- RTL mirroring and Arabic typography rules.
- Reduced-motion and focus-visible support.

### Changed

- Replaced the previous rounded SaaS/glass visual language with a restrained dark editorial system.
- Renamed the primary action from “Publish brief” to “Export brief” to match local/client-side behavior.
- Kept stable-only scope: no provider modes, OAuth, backend worker, or beta research-engine dependency.

### Validated

- `npm run test:qa`
- `npm run test:static`
- `npm run test:schema`
- `npm run test:fixtures`
- `npm run test:a11y:static`

Browser tests require local Playwright dependencies and browsers.
