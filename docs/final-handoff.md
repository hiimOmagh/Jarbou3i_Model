# Release Candidate Handoff — 2.0.0-bio-rc.11

This release candidate completes the automated intersection-audit layer around the Strategic and Biopolitical workbench and makes sample topics follow the selected interface language by default. It does not change the Strategic v1.1 engine or the canonical Biopolitical Training Map v2.1 schema, normalization, validation, readiness, publication, or lossless export contracts.

The verified Beta 3 baseline passed 160 core browser cases, two hosted cases, hosted evidence review, and all no-browser gates. RC 1 added 48 cross-engine reflow cases and a deterministic 55-artifact visual evidence set spanning 18 language/theme/viewport combinations. RC 2–8 hardened reflow and focus synchronization, culminating in a fully green 208-case browser core. Human review then identified three evidence-fidelity findings: RC 9 corrected critical image loading and phone capture targeting, and RC 10 made toast exit content-height-safe with physical viewport-clearance proof. Human review of the regenerated RC 10 archives closed all three findings. RC 11 links interface and sample languages by default, preserves deliberate analysis-language overrides, and adds eight cross-engine cases. The Phase 4 Spatial implementation, canonical analysis, and export behavior remain unchanged.

## Delivered

- Story renders authored links as compact, numbered causal paths.
- Evidence Trail groups supporting and counter-evidence around each cited analytical record.
- Network renders all nine analytical pillars in a responsive three-column topology instead of a forced nine-column strip.
- Guided mode foregrounds names, types, relationships, and plain-language explanations.
- Analyst mode reveals stable IDs, confidence, source provenance, canonical paths, filters, layers, neighborhood focus, and zoom.
- “Why connected?” explains authored, evidentiary, counter-evidentiary, and structural links in Arabic, English, and French.
- Search and reset remain immediately available; dense controls use progressive disclosure.
- An accessible connection list remains equivalent to every visual mode.
- Focus mode expands the workspace and exits through its visible control or Escape.
- Guided walkthroughs advance deterministically through the active mode’s connections with named endpoints and explanations.
- Record and connection inspection persists across modes and views, with explicit recovery when a selection is hidden.
- Time exposes five canonical analytical bands without inventing dates, duration, causality, or chronology.
- Compare presents international-comparison basis, similarities, differences, transfer limits, confidence, and named evidence links.
- Saved views are scoped to the current analysis and restore presentation state after reload; they never contain canonical analysis content.
- Standalone HTML reports include named explicit, evidence, and structural relationships plus temporal and comparative projections.
- Spatial projects the active filtered graph into deterministic 3D coordinates grouped by the same nine analytical pillars.
- Spatial nodes remain semantic buttons connected to the existing record inspector; a localized record picker guarantees access when depth occludes a card, and connection families keep their authored, evidence, and structural visual distinction.
- Orbit, tilt, distance, reset, drag, keyboard, reduced-motion, and saved-orientation behavior are available in Arabic, English, and French.
- Narrow or unsupported displays show why Spatial is unavailable and retain the complete labeled Connections list.
- Arabic, English, and French now cross both themes on desktop Chromium, Firefox, WebKit, and mobile Chrome as one release gate instead of isolated test lanes.
- Every intersection exercises localized malformed-data handling, valid recovery, runtime accessibility, responsive relationship presentation, reduced motion, duplicate-ID absence, overflow protection, and print safety.
- Forced-colors and keyboard-focus behavior are explicit release contracts, while native assistive technology, human linguistic review, browser zoom, physical printing, and touch hardware remain documented manual sign-offs.
- Strategic and Biopolitical samples follow the selected interface language by default; a deliberately different Analysis language persists as an explicit override and can be relinked by selecting the matching language.

## Safety and contract boundary

All graph views, overlays, and spatial coordinates are deterministic projections of the validated imported analysis and cannot edit, infer, add, or remove canonical records or links. Spatial uses CSS transforms only—no WebGL, network dependency, force simulation, or hidden analytical inference. Saved views retain only browser-local presentation state. Standalone JSON remains lossless; standalone HTML preserves the complete canonical payload unchanged.

## Validation

```bash
npm ci
npm run upgrade:layout
npx playwright install --with-deps
npm run test:ci:no-browser
npm run test:browser
```

The no-browser suite covers source-of-truth, static structure, schema, fixtures, parser, semantic integrity, graph integrity, all three languages, static accessibility, release migration, CI contract, and workspace hygiene.

The browser core contains 216 tests across Chromium, Firefox, WebKit, and mobile Chrome: the verified 160-case Beta 3 core, 48 reflow cases, and eight sample-language linkage cases. Hosted desktop/mobile evidence adds two execution cases and a separate evidence-review gate. Visual review adds 18 Chromium capture cases, 36 screenshots, 18 measurement records, and a separate 55-artifact evidence-review gate. The relationship explorer matrix retains 52 tests covering spatial capability and mobile fallback, complete deterministic geometry, spatial saved state, orbit and keyboard controls, reduced motion, runtime axe checks, temporal and comparative overlays, Focus, walkthroughs, persistent inspection, Story, Evidence Trail, Network, RTL, and overflow protection.

## Manual release sign-off

- Native NVDA or JAWS on Windows and VoiceOver on Safari.
- Human terminology review in Arabic, English, and French.
- Visual inspection at 200% and 400% browser zoom.
- Chromium and Safari/WebKit print or PDF preview.
- Physical touch-device target, drag, and scroll comfort.
- Final epistemic review that all projections remain traceable to authored records.
