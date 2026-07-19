# Jarbou3i Model — Dual-Lens Analysis Workbench

Version `2.1.0-alpha.8` is the protected post-RC17 visual-acceptance track for a static, trilingual workbench with two independent contracts:

- Strategic v1.1: Interests → Actors → Tools → Narrative → Results → Feedback.
- Biopolitical Training Map v2.1: an evidence-calibrated protocol for tracing how human functions, institutions, infrastructures, classifications, and meanings become governed.

The Strategic engine is preserved. Biopolitical analysis has its own schema, prompt, validator, semantic-integrity gate, diagnostics, review interface, export contract, and explicitly non-canonical legacy adapter.

Biopolitical result references are resolved through a read-only relationship index. Review cards show the referenced record’s name alongside its stable canonical ID; selecting a reference opens its type, analytical pillar, confidence, and indexed incoming/outgoing relationships. Standalone HTML reports expand the same names and include a reference directory, while canonical JSON remains unchanged for re-import and verification. RC 12 removes assistant-interface citation artifacts during import, links valid public sources directly, and separates analytical readiness from the independent publication gate in the report hero. RC 13 preserves authored French punctuation; RC 14 completes content-safe Relationship Explorer containment at the 320px/400%-equivalent boundary.

The Connections review tab uses three purpose-built deterministic views: Story presents numbered causal paths, Evidence Trail groups supporting and counter-evidence around the claim or analytical record, and Network exposes the complete nine-pillar topology. Guided mode prioritizes names and plain-language “Why connected?” explanations; Analyst mode reveals canonical IDs, confidence, provenance, source paths, filters, and layer controls. An equivalent accessible connections list remains available. Every visualization is session-only and never mutates canonical analysis data.

Phase 2 adds an escapable Focus workspace, deterministic guided walkthroughs for every relationship mode, and a persistent inspection dock. A selected record or connection keeps its context when users move between Story, Evidence Trail, Network, Map, and List; when filters hide it, the interface states that explicitly and can reveal it in the complete Network view. These interactions remain read-only projections of the validated graph.

Phase 3 adds canonical time and international-comparison overlays, plus analysis-scoped saved views for presentation state. The temporal overlay groups only authored historical continuities, dated evidence, immediate effects, medium-term adaptations and dependencies, and future or intergenerational signals; it never invents chronology. Saved views remain in the local browser and contain filters, mode, overlay, selection, and zoom only—never canonical analysis content. Standalone HTML reports now include a named relationship atlas, temporal projection, and comparison limits while their embedded canonical JSON remains byte-for-data equivalent to the imported analysis.

Phase 4 adds an optional Spatial view for capable desktop browsers. It projects the same filtered records and explicit, evidentiary, and structural connections into deterministic 3D geometry with labeled pillar clusters, orbit and zoom controls, pointer dragging, keyboard equivalents, reduced-motion support, saved orientation, and a localized non-overlapping record picker for cards occluded by depth. Spatial is a progressive enhancement: unsupported or narrow displays keep it disabled with an explanation and default to the complete accessible Connections list. No WebGL, external dependency, force simulation, inferred relationship, or canonical mutation is introduced.

The final hardening phase adds an explicit 24-cell language/theme/runtime intersection gate, plus cross-engine keyboard-focus and Chromium forced-colors checks. Every cell exercises localized rejection of an unsupported future schema, valid sample recovery, relationship presentation, serious/critical accessibility findings, duplicate IDs, horizontal overflow, reduced motion, responsive Spatial fallback, and a theme-neutral print palette. Dark-theme printing and forced-colors state visibility are hardened in the production stylesheet; the canonical analysis contracts remain unchanged.

RC 1 adds a 48-case 200%/400% equivalent reflow matrix at 640px and 320px across every language, theme, and browser profile. It also captures 36 deterministic visual-review screenshots—shell and Connections views across three languages, two themes, and desktop/tablet/phone viewports—and validates 18 machine-readable measurement records through a 55-artifact evidence manifest. Native screen-reader, human linguistic, physical touch, browser-zoom, print-preview, and epistemic sign-off remain intentionally human review tasks.

Alpha 4 expands visual acceptance evidence to 96 deterministic screenshots: shell, Strategic results, Biopolitical results, Connections, and import-audit states across all language/theme/viewport cells, plus localized desktop and phone standalone reports. Alpha 6 closes the human-review blind spots: import findings are fully localized, phone result navigation is compact, named report references cannot leave orphan separator glyphs, and every standalone report is captured at five deterministic surfaces rather than one unsettled scroll position. The evidence contract now contains 120 screenshots and 139 artifacts. `npm run test:browser:hosted` remains a local public-surface gate when no URL is supplied; a release deployment must additionally pass `PLAYWRIGHT_BASE_URL=https://… npm run test:browser:deployed` so local evidence cannot be mistaken for deployed validation.

## Biopolitical protocol

| Pillar | Analytical task |
|---|---|
| Question & context | Form a testable question; define contested terms, historical formation, law, international comparison, and uncertainty. |
| Human functions | Identify the biological, cognitive-affective, reproductive, social-relational, symbolic, or environmental function being governed. |
| Actors & populations | Keep governing actors, institutions, beneficiaries, affected populations, and power asymmetries separate. |
| Mechanisms & infrastructure | Trace law, money, ownership, labor, expertise, statistics, data, algorithms, architecture, and dependency. |
| Meaning & classification | Examine norms, regimes of truth, subject positions, classifications, errors, contestability, and looping effects. |
| Intervention & capture test | Classify protection through expropriation and assess all 13 capture criteria exactly once without presuming domination. |
| Distribution & effects | Compare benefits, burdens, consent, exit, accountability, outcome character, inequality, five capture levels, scale, and time. |
| Evidence & explanations | Distinguish epistemic types, record study-design and verification metadata, and assess all nine explanation families exactly once. |
| Agency & alternatives | Include resistance, counter-conduct, institutional adaptation, lower-harm alternatives, and calibrated judgment. |

An 18-point self-audit covers intent attribution, institutional claims, mechanism quality, history, political economy, inequality, agency, source verification, uncertainty, benefits and costs, alternatives, stigmatization risk, and falsifiers.

## Contract identities

| State | Schema | Contract | Publication status |
|---|---|---|---|
| Canonical analysis | `2.1.0` | `biopolitical-training-map-v2` | Eligible only after semantic and evidence-verification gates pass |
| Migrated legacy draft | `1.0.0` | `biopolitical-migrated-draft-v1` | Always blocked until completed as a canonical analysis |
| Strategic analysis | `1.1.0` | Strategic schema | Preserved behavior |

Imported `analysis_lens`, contract, schema version, and status are authoritative. Unknown or future Biopolitical versions are rejected. Canonical input is validated against the generated browser validator before normalization, then checked for global ID uniqueness, typed references, exact 13/9/5 coverage, evidence traceability, placeholder misuse, and self-audit contradictions. Structurally canonical analyses with unresolved evidence or audit concerns may be imported for review with visible warnings, but those warnings keep publication blocked. Non-verified malformed source URLs are safely cleared and contradictory verification self-audits are corrected to `concern`; verified evidence with malformed provenance remains a hard error.

Legacy six-array Biopolitical JSON is retained as a disclosed migrated draft. The adapter preserves recoverable records, does not invent governing actors or intervention modalities, and never stamps partial data as canonical v2.1.

## Evidence and publication discipline

Evidence records separate structural completeness from verification. A source must carry a title, locator or URL, date, population, measurement and design limitations, claim/source fit, conflicts, missing-data and selection effects, uncertainty, counter-evidence, and verification state as applicable.

The readiness score is diagnostic. It cannot make a report publishable. Publication additionally requires:

- the canonical `2.1.0` contract;
- successful schema and semantic-integrity validation;
- every source verified, traceable, and free of placeholders;
- every relevant explanation assessed;
- no unresolved self-audit concern.

The bundled fixtures are structural examples with deliberately unverified source placeholders, so they correctly display “not publication-ready.”

## Safety boundary

Generated prompts treat the topic and context as untrusted analytical material. They prohibit fabricated sources and operational guidance for repression, mass manipulation, discriminatory profiling, eugenics, forced medical intervention, vulnerable-group targeting, covert behavioral control, population punishment, and coercive surveillance. They also prohibit weak-proxy inference of sensitive traits, group-to-individual prediction, dehumanization, harassment, and collective punishment.

## Workflow

1. Choose the interface language and, separately, the desired analysis language.
2. Choose Strategic or Biopolitical and a prompt depth.
3. Enter a topic and optional time/geographic context.
4. Copy the generated prompt to an AI assistant.
5. Paste the returned JSON into the workbench.
6. Import structurally canonical work, then resolve every disclosed semantic and evidence warning before publication.
7. Review the full analytical record.
8. Export a human-readable HTML report and lossless canonical JSON.

The analysis language stored in imported JSON controls report language and direction. Changing the interface language does not relabel an imported analysis.

## Source layout

```text
index.html
src/app.js
src/biopolitics.js
src/biopolitics-integrity.js
src/biopolitical-report.js
src/biopolitics-schema-validator.js
src/biopolitics-sample-i18n.js
src/json-parser.js
schema/biopolitical-analysis.schema.json
schema/biopolitical-migrated-draft.schema.json
fixtures/
tests/
docs/
```

The old standalone prototype pages are retained only under `docs/archive/legacy-pages/`; they are not production entry points.

## Local use and testing

```bash
npm ci
npm run dev
```

Open `http://127.0.0.1:4173`.

For the alpha.5 verification sequence, see [`docs/alpha5-acceptance-hotfix.md`](docs/alpha5-acceptance-hotfix.md). The full alpha.4 visual-acceptance scope and separate deployed-site gate remain documented in [`docs/alpha4-visual-acceptance.md`](docs/alpha4-visual-acceptance.md).

When applying this release over an older working directory, run the safe layout
migration once before testing:

```bash
npm run upgrade:layout
```

It moves a legacy root page when no archive exists, removes it only when the
archived copy is byte-identical, and refuses to overwrite divergent content.

```bash
npm run test:ci:no-browser
npx playwright install --with-deps
npm run test:browser
```

`npm test` runs the complete CI contract. Browser coverage includes Chromium, Firefox, WebKit, mobile Chrome, accessibility scanning, both lenses, EN/AR/FR exports, RTL/mobile layout, strict imports, legacy-draft disclosure, and lossless HTML/JSON export.

The browser matrix uses four workers and a 60-second test budget by default to
keep simultaneous report rendering, downloads, and axe scans stable. On a
resource-constrained Windows host, set `$env:PLAYWRIGHT_WORKERS=2` before
running `npm run test:browser`.

## Deployment and privacy

The project is static and GitHub Pages compatible. Publish the release root and do not deploy duplicate `preview/` or `biopreview/` tracks. The app has no backend storage, tracking, or account system; saved explorer views use analysis-scoped browser-local presentation state. Material sent to an external AI assistant is governed by that provider’s terms; do not submit sensitive material without authorization.

The tool structures analysis but does not establish truth. Verify sources, law, statistics, causal claims, and ethical judgments independently.
