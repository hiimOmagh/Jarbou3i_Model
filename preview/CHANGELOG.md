# Changelog

## v1.3.1 — Responsive Layout and Mobile QA Fix

Patched the stable editorial UI refresh after visual QA on desktop, iPad, and mobile viewports.

### Fixed

- Reworked tablet layout from a crushed three-column cockpit into a Source/Structure + Brief responsive layout.
- Made the mobile header static and compact to prevent toolbar/header overlap.
- Disabled sticky source controls on mobile to avoid covering content.
- Added horizontal-overflow guards for language controls, brief tabs, legends, and the collapsed quality rail.
- Improved mobile pane flow, typography scaling, button wrapping, and bottom quality rail behavior.
- Preserved the desktop three-pane editorial workspace and stable client-side behavior.

### Validated

- `npm run test:qa`
- `npm run test:static`
- `npm run test:schema`
- `npm run test:fixtures`
- `npm run test:a11y:static`

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
