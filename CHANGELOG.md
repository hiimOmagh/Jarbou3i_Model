# Changelog

## 2.1.0-alpha.34 — Phase 5 Workspace Contract and Portability Foundation

- Added the versioned `jarbou3i-local-workspace@1` contract with separate immutable imported revision, working draft, revision pointers, analysis identity, and audit events.
- Added durable IndexedDB storage behind a repository abstraction; substantive analysis data is no longer placed in `localStorage`.
- Added optimistic repository revisions that reject stale replacement and deletion attempts instead of silently overwriting another browser context.
- Added SHA-256 verification for every revision and working draft, plus separate workspace and protected-manifest checksums for portable bundles.
- Added guarded v0-to-v1 migration, explicit unsupported-version rejection, corruption detection, quota/unavailable-storage errors, and a 25 MiB import ceiling.
- Added a trilingual local workspace manager with save state, reopen-after-reload, multi-workspace listing, lossless bundle export, and safe restore.
- Kept canonical JSON export unchanged; workspace bundles declare `canonical_transport: false`, `local_first: true`, and `collaboration_state: false`.
- Added published workspace and bundle JSON Schemas, deterministic no-browser contract tests, and a sixteen-case dual-lens cross-browser persistence/portability matrix.

## 2.1.0-alpha.33 — Phase 4 Evidence Review Queue and Resolution Planning

- Added a deterministic dual-lens review queue derived only from existing relationship, provenance, source-cluster, and traceability diagnostics.
- Ordered tasks into resolve-reference, verify-provenance, and strengthen-coverage phases without introducing truth scores or inferred source judgments.
- Added direct canonical-record navigation and a separate `jarbou3i-evidence-review-plan-v1` derived export.
- Declared that queue completion does not validate conclusions and excluded raw canonical analysis from the review-plan artifact.
- Hardened the retry-recovered WebKit explanation test by replacing helper actionability scrolling with direct standards-based DOM scrolling.
- Preserved schemas, prompts, imports, scoring, publication gates, canonical JSON, reports, and relationship semantics.

## 2.1.0-alpha.32 — Inspection Selector Namespace Correction

- Scoped the legacy `IV1` browser assertion to the canonical Inspection directory surface.
- Added a generic static guard against unscoped record selectors across the complete Inspection workspace.
- Preserved Alpha.31 claim–evidence traceability, derived intelligence export, and all analytical behavior unchanged.

## 2.1.0-alpha.31 — Phase 4 Claim–Evidence Traceability

- Added a dual-lens claim–evidence matrix with authored support, counter-evidence, clusters, unresolved targets, and coverage states.
- Added direct evidence-to-record routes with canonical paths and permanent record links.
- Added a separate `jarbou3i-evidence-intelligence-v1` JSON audit export.
- Marked the new artifact explicitly derived and non-canonical, and excluded raw analysis content.
- Added unit, static, CI-contract, and cross-browser download verification while preserving canonical exports and analytical behavior.

## 2.1.0-alpha.30 — Inspection Selector Namespace Correction

- Scoped the two legacy evidence-card browser assertions to canonical Inspection directory items.
- Preserved the intentional reuse of canonical reference controls inside source clusters and gap groups.
- Added a static regression guard against ambiguous cross-surface record selectors.
- Preserved the complete Alpha.29 Source Cluster and Gap Intelligence implementation without product or analytical changes.

## 2.1.0-alpha.29 — Phase 4 Source Cluster and Gap Intelligence

- Added deterministic dual-lens source clusters using exact authored URL, title-plus-locator, or title identity.
- Kept evidence without source identity in separate record-specific clusters to prevent false equivalence.
- Added citation, traceability, declared-verification, counter-evidence, confidence, and source-date cluster summaries.
- Added localized, navigable coverage signals for missing identity, title-only identity, uncited evidence, missing counter-evidence, missing dates, untraceable sources, and exact-source concentration.
- Added a responsive Source clusters and evidence gaps workspace to the shared Inspection directory.
- Added dedicated unit and cross-browser contracts while preserving every analytical and export contract.

## 2.1.0-alpha.28 — Phase 4 Evidence and Relationship Intelligence Foundation

- Added one immutable, dual-lens registry for canonical records, typed relationships, evidence trails, reverse citations, and objective relationship gaps.
- Added authored supporting/counter-evidence traversal and evidence back-references to the shared inspector.
- Added lens-scoped permanent record links with fragment-driven opening and clean dismissal behavior.
- Added dedicated unit, static, source-of-truth, CI-contract, and cross-browser interaction coverage.
- Preserved Strategic v1.1, Biopolitical schema `2.1.0`, contract `biopolitical-training-map-v2`, prompts, imports, scoring, publication gates, canonical JSON, reports, and existing graph semantics.

## 2.1.0-alpha.27 — Evidence Package Completeness Correction

- Corrected the release archive boundary so hosted-demo and visual-audit test specifications and review checks are included.
- Added package-level verification of all four evidence harness files before delivery.
- Preserved the complete Alpha.26 inspection implementation without product, schema, scoring, prompt, graph, report, or export changes.

## 2.1.0-alpha.26 — Phase 3 Results Inspection Layer

- Added one shared, immutable inspection index for Strategic and Biopolitical canonical records.
- Added a dedicated Inspection tab with human-readable search and secondary canonical identifiers.
- Expanded the accessible inspector with provenance, confidence, canonical paths, supporting and counter-evidence, linked records, audit facts, and occurrence navigation.
- Added Strategic identifier and relationship indexing without fabricating missing IDs or provenance.
- Authored stable IDs, explicit links, source titles, counter-evidence, and uncertainty into the trilingual Strategic demonstration so the public sample exercises the inspection layer honestly.
- Preserved focus across linked-record traversal and returned occurrence activation to the owning detailed record.
- Added unit, static, and cross-browser regression contracts while preserving schemas, scoring, prompts, imports, graphs, reports, and exports.

## 2.1.0-alpha.25 — Results Explanation Runtime-Authority Contract

- Replaced fixture-file evidence-title assertions with runtime-rendered evidence names for both lenses.
- Verified that each promoted evidence name survives keyboard drill-down into the authoritative detailed record.
- Added a static guard that rejects fixture-only evidence phrases in the browser contract.
- Preserved the complete Alpha.24 product implementation unchanged.

## 2.1.0-alpha.24 — Phase 3 Results Explanation Hierarchy

- Added one shared explanation hierarchy for actors, mechanisms, evidence, tensions, and effects across both analytical lenses.
- Added concise authored previews with complete-record counts and keyboard-accessible drill-down into existing detail views.
- Added an immutable lens-neutral explanation view model that never retains canonical analysis objects.
- Added trilingual, RTL, compact-density, forced-colours, print, and 320 px responsive presentation.
- Added cross-lens unit, static, and browser regression contracts.
- Preserved all schemas, scoring, prompts, imports, relationship graphs, standalone reports, and exports.

## 2.1.0-alpha.23 — Results Namespace Browser Contract Correction

- Updated both Results Workspace metadata assertions to the isolated `data-analysis-lens` contract.
- Added a static guard that rejects the obsolete results-region `data-lens` assertion.
- Preserved the complete Alpha.22 product implementation unchanged.
- Added no analytical, schema, scoring, layout, localization, import, report, or export changes.

## 2.1.0-alpha.22 — Results Lens Namespace Isolation

- Reserved `data-lens` for the interactive lens radio controls and moved results metadata to `data-analysis-lens`.
- Scoped lens rendering and event binding to the `#analysisLens` control group.
- Restored import-contract selector determinism across Chromium, Firefox, WebKit, and mobile Chromium.
- Added a static regression gate for control/metadata namespace separation.
- Preserved analytical, schema, scoring, localization, import, report, and export behavior.

## 2.1.0-alpha.21 — Results Orientation Test Authority Correction

- Replaced an over-specific fixture-text assertion with a direct comparison against the runtime health engine’s rendered next action.
- Preserved the complete Alpha.20 product implementation unchanged.
- Added no analytical, schema, scoring, layout, localization, import, report, or export changes.

## 2.1.0-alpha.20 — Phase 3 Results Orientation

- Added one shared orientation hierarchy across Strategic and Biopolitical results.
- Promoted conclusion, publication gate, decision readiness, analytical coverage, principal uncertainty, and recommended next action above detailed diagnostics.
- Added an immutable lens-neutral results-orientation view model without canonical analysis references.
- Added trilingual, RTL, forced-colours, print, compact-density, and 320 px responsive presentation.
- Preserved all schemas, scoring, prompts, imports, evidence, graphs, reports, and exports.

## 2.1.0-alpha.19

- Consolidated Phase 2 Slice 2 with the Alpha.17 GitHub Actions incident correction.
- Removed global smooth scrolling that could prevent WebKit actionability scrolling from settling.
- Hardened saved-view deletion through its keyboard activation contract.
- Bounded GitHub browser execution to two workers while retaining four-worker local defaults.
- Added conditional evidence uploads and failure-only Playwright trace/report artifacts.

## 2.1.0-alpha.18

- Added a responsive, state-aware topic → import → review shell command.
- Added locale-direction-aware roving keyboard navigation for workspace sections.
- Added explicit primary/secondary command hierarchy and 320 px responsive coverage.
- Added live destination announcements and focus continuity for shell commands.
- Preserved all analytical, schema, import, evidence, graph, report, and export contracts.

## 2.1.0-alpha.17 — Responsive Shell Test Contract Correction

- Removed a new browser assertion that incorrectly required the desktop active-step fill at the intentional 320 px transparent mobile treatment.
- Retained the behaviorally relevant shell checks: 44 px theme target, dark-mode activation, visible active step, persisted density, localization, and lens parity.
- Kept the independent cross-browser axe matrix as the authoritative colour-contrast gate; all 28 release-audit cases passed on Alpha.16.
- No product CSS, runtime behavior, schema, prompt, analysis, evidence, relationship, or export logic changed from Alpha.16.

## 2.1.0-alpha.16 — Shell Reflow and Accessibility Closure

- Restored the theme control’s 44 px minimum target across every 200%/400%-equivalent reflow cell.
- Replaced the dark-theme active step number with a WCAG AA contrast-safe treatment.
- Hardened new shell navigation under forced colours using system Canvas, CanvasText, and Highlight values.
- Scoped the legacy workflow-stage assertion so the valid application-shell `aria-current` marker does not create strict-locator ambiguity.
- Added focused browser regression assertions for the 320 px theme target and dark active-step colour.

## 2.1.0-alpha.15 — Premium Application Shell, Slice 1

- Added one shared Set up → Model → Review application frame across both lenses.
- Added localized live lens context and truthful client-side processing status.
- Added persistent comfortable and compact display density without touching canonical analysis state.
- Added skip navigation, reduced-motion-aware section movement, forced-colours styling, and responsive shell reflow.
- Added pure shell-preference contracts plus browser coverage for orientation, persistence, localization, and lens parity.
- Preserved every Strategic v1.1 and Biopolitical v2.1 schema, prompt, import, score, evidence, relationship, and export contract.

## 2.1.0-alpha.14 — Idempotent Explorer Event Lifecycle

- Makes explorer click binding idempotent across non-destructive search-result renders.
- Prevents one keyboard or pointer activation from creating duplicate saved views after search.
- Applies the same event-lifecycle protection to saved-view, map-reset, tour, selection, and spatial controls.
- Adds a no-browser regression gate that rejects accumulating click listeners in the explorer.

## 2.1.0-alpha.13 — Managed Cross-platform Browser Harness

- Runs every official browser suite through a managed launcher with a temporary free local port.
- Starts the static server as a direct Node child and guarantees teardown in a `finally` block.
- Keeps deployed checks external while distinguishing the managed local base URL from a deployed target.
- Adds parent-process and signal shutdown safeguards to prevent orphan servers on Windows.

## 2.1.0-alpha.12 — Non-destructive Explorer Search

- Updates relationship search results without replacing the search field, saved-view controls, or their active keyboard focus.
- Coalesces graph-only search work to one animation frame and discards stale callbacks after any newer full render.
- Exercises release-audit tab activation through the keyboard contract to avoid transient pointer overlays during concurrent cross-browser runs.
- Makes local Playwright server reuse explicitly opt-in through `PLAYWRIGHT_REUSE_SERVER=1`.

## 2.1.0-alpha.10 — Platform Boot Settings Hotfix

- Fixes the single browser-boot exception behind the Alpha.9 cascade: theme initialization now reads the immutable platform boot settings instead of the removed pre-platform `savedSettings` binding.
- Restores persisted interface language, analysis-language overrides, theme selection, initial render-region measurements, export-tab interaction, and every downstream reflow case.
- Adds a no-browser regression guard that requires theme initialization to use `PLATFORM.bootSettings` and rejects reintroduction of the obsolete binding.
- Retains the complete Phase 1 runtime, lens manifests, performance primitives, Strategic v1.1 behavior, Biopolitical v2.1 behavior, canonical data, and presentation baseline.

## 2.1.0-alpha.9 — Phase 1 Platform Foundation

- Replaces ad hoc service assembly in the application entry point with one shared platform runtime that composes state, settings, localization, lens registration, render regions, diagnostics, caching, and scheduling.
- Upgrades both analytical adapters to immutable, discoverable lens manifests with stable contract identity, schema identity, section counts, capabilities, and isolated service boundaries.
- Adds bounded in-memory performance telemetry for boot and named render regions; no analytics, network transmission, persistent profiling, or canonical payload mutation is introduced.
- Adds revision-keyed memoization and deduplicated task scheduling primitives for future graph, report, and lens modules without changing current synchronous interaction behavior.
- Extends the no-browser release gate with runtime-composition and performance-foundation contracts, and carries forward the verified phone score-card visual capture anchor from the Alpha.8 closure.
- Preserves Strategic v1.1 and Biopolitical v2.1 schemas, prompts, scoring, evidence discipline, graph projections, import/export behavior, translations, themes, and responsive presentation.

## 2.1.0-alpha.8 — Shared Score-Card Component Closure

- Corrects the shared overview renderer to use the design-system `scoreMetricCard`, `metricHead`, and `metricHint` contracts.
- Restores card containment and deliberate spacing between localized metric labels and `/100` values in both Strategic and Biopolitical results.
- Adds a static regression contract rejecting the obsolete unstyled metric markup.
- Changes presentation markup only; both analytical schemas, scoring formulas, evidence rules, imports, exports, and graph data remain unchanged.

## 2.1.0-alpha.7 — Arabic Product-Language and CI Runtime Polish

- Replaces the Arabic title term `مِشرَحة` (morgue/dissection room) with the professional product phrase `مساحة عمل` across the shared shell and Biopolitical runtime.
- Adds a language-contract regression gate that rejects the former term and requires both Arabic lens titles.
- Upgrades GitHub artifact publishing to `actions/upload-artifact@v5`, removing the remaining Node 20 action-runtime warning.
- Preserves all Alpha.6 report, import-audit, mobile-density, and visual-evidence contracts without changing either analytical schema.

## 2.1.0-alpha.6 — Human Visual-Audit Closure

- Localizes import-audit warning and schema-failure explanations in Arabic and French while preserving canonical JSON paths as isolated left-to-right technical tokens.
- Removes orphanable middle-dot separators between named report references by rendering multi-reference values as responsive, gap-spaced groups.
- Compacts phone result navigation into a two-column decision index so the active judgment reaches the first screen sooner without removing labels, counts, or keyboard semantics.
- Makes standalone-report evidence wait for an actual top anchor instead of capturing during smooth scrolling.
- Expands report evidence from one viewport per case to five deterministic surfaces: hero, first analytical pillar, relationship atlas, reference directory, and canonical appendix.
- Raises the visual evidence contract from 96 screenshots and 115 artifacts to 120 screenshots and 139 artifacts.

## 2.1.0-alpha.5 — Deterministic Acceptance Hotfix

- Synchronizes each release-matrix cell through the public language, analysis-language, and theme controls after startup, closing the isolated Chromium preload race that left one French-light cell in Arabic.
- Preserves the intended accessible Connections-list screenshot on phones, then opens Map only for the Story-geometry measurement required by the evidence reviewer.
- Keeps the alpha.4 application, analytical contracts, localization, responsive styling, imports, exports, and report presentation unchanged.

## 2.1.0-alpha.4 — Visual Acceptance Repair

- Localizes canonical Relationship Explorer relation, confidence, verification, and edge-family labels in Arabic and French without changing stored enum values.
- Names resistance nodes with the authored actor or population before the canonical resistance form, removing raw values such as `litigation` from localized story views.
- Fits four-step Story paths at desktop widths and exposes an explicit, keyboard-scrollable, snap-aligned horizontal surface at intermediate widths instead of silently clipping nodes.
- Restores readable active navigation badges in light and dark themes and compacts the phone header, guide card, and stage rail so the primary task enters the first viewport sooner.
- Makes hosted and audit screenshots deterministically anchored and distinguishes local public-surface evidence from a true deployed-site gate.
- Expands visual evidence from 36 screenshots to 96 across the shell, both analysis lenses, Biopolitical results, Connections, import audit, and standalone reports.
- Adds graph-label, localization, story-geometry, badge, capture-coverage, and deployed-target regression contracts.

## 2.1.0-alpha.3 — Evidence-Provenance and Decision-Readiness Foundation

- Rebased the shared dual-lens platform work on the verified RC17 source.
- Separates model-declared verification from independent human review and publication approval.
- Caps decision readiness using source traceability and independent review, without hiding analytical coverage.
- Promotes the publication gate above diagnostic scores in both lens overviews and the Biopolitical report.
- Preserves the original pasted payload and normalization audit in presentation state.
- Requires generated Biopolitical evidence to remain unverified until reviewed in the workbench.

## 2.0.0-bio-rc.17 — Firefox Spatial Saved-View Synchronization

- Replaces the remaining pointer-dependent Spatial orbit, save, reset, and restore transitions in the release contract with focus-owned keyboard activation.
- Asserts focus ownership and the persisted saved-view option before continuing, so each state transition has an observable completion boundary under parallel Firefox/Linux rendering.
- Addresses the GitHub Actions failure in which either Reset or Restore was intermittently dropped while the Spatial scene was being replaced; the graph, saved-view implementation, analytical contracts, schemas, localization, and report output are unchanged.

## 2.0.0-bio-rc.16 — Reviewable Verification Repair and WebKit CI Synchronization

- Downgrades evidence labelled `verified` without both a verifier identity and verification date to `partially_verified` when traceable, or `unverified` otherwise, with one field-level warning per repaired record.
- Keeps every downgraded analysis importable for review while preserving the strict publication block; malformed provenance that still claims complete verification remains rejected.
- Strengthens Arabic, English, and French analysis and JSON-repair prompts so `verified` is forbidden unless both audit-provenance fields are non-empty.
- Adds direct regression coverage for the supplied Tunisia analysis failure mode and confirms portable citation sanitation still removes all assistant-interface markers.
- Replaces unstable pointer clicks in the four GitHub WebKit timeout paths with focus-owned keyboard activation and explicit selected/pressed-state assertions.
- Leaves both analytical schemas, canonical fixture meaning, graph projections, and report structure unchanged.

## 2.0.0-bio-rc.15 — Deterministic Playwright Worker Shutdown

- Moves desktop Chromium and mobile Chrome from Chrome Headless Shell to Playwright’s newer real-Chrome headless mode, directly avoiding the process Microsoft identified in the RC 13/14 Windows shutdown failures.
- Pins Playwright Test 1.61.1, retaining the upstream worker-stop watchdog so any future unresponsive browser process is force-terminated and reported as a failed run instead of silently losing a queued test.
- Adds CI contract guards for both Chromium projects’ headless channel and the exact runner version, preventing configuration or semver drift.
- Leaves application behavior, analytical logic, schemas, canonical fixtures, report rendering, localization, and responsive presentation unchanged from RC 14.

## 2.0.0-bio-rc.14 — True 320px Containment and Lens Transition Synchronization

- Constrains the Relationship Explorer’s implicit grid track so localized min-content widths cannot enlarge the whole explorer behind an `overflow: hidden` ancestor.
- Makes all three saved-view columns genuinely shrinkable and allows long localized actions to wrap without clipping at the 320px/400%-equivalent boundary.
- Upgrades visual and reflow assertions to intersect each control with every clipping ancestor as well as the viewport, closing the blind spot that allowed the 390px evidence checker to miss partially hidden controls.
- Synchronizes the sample-language browser contract on the selected lens state before loading a sample, eliminating the isolated Firefox transition race seen only in the full parallel matrix.
- Preserves RC 13’s French punctuation correction; analytical logic, schemas, canonical fixtures, graph projections, and report output remain unchanged.

## 2.0.0-bio-rc.13 — French Localization and Phone Control Containment

- Preserves authored French spacing before colons, semicolons, exclamation marks, and question marks during recursive citation sanitation.
- Fixes the French Strategic sample title across Chromium, Firefox, WebKit, and mobile Chrome while retaining whitespace repair before commas and full stops.
- Reflows every Relationship Explorer control family onto its own content-safe row at phone widths, preventing longer French labels from being visually clipped despite page-level overflow remaining hidden.
- Adds no-browser punctuation coverage plus viewport-bound control assertions to visual and 200%/400%-equivalent reflow gates; schemas, analytical logic, canonical fixtures, graph projections, and report structure are unchanged.

## 2.0.0-bio-rc.12 — Portable Citations and Outcome Report Remediation

- Removes non-portable assistant-interface citation markers and private-use glyphs recursively during both Strategic and Biopolitical import while preserving authored analytical text, canonical evidence IDs, and valid public source URLs.
- Discloses every citation repair as an import warning and hardens all generated and repair prompts in Arabic, English, and French against `cite`, `filecite`, and `turn` artifacts.
- Replaces the monolithic Biopolitical HTML export with a dedicated, dependency-free report renderer featuring a concise executive layer, explicit publication-gate status, separately labelled analytical readiness, evidence-verification metrics, named reference links, and portable source links.
- Adds a report contents landmark, skip link, keyboard-operable expand/collapse/print controls, progressive disclosure for all 13 sections, responsive reading measures, focus visibility, and print-safe section fragmentation.
- Keeps the complete canonical contract losslessly embedded for re-import and archival while lazily rendering the human JSON appendix, avoiding a second always-visible copy of the largest payload.
- Adds trilingual standalone-report, citation-repair, source-link, publication-gate, canonical-payload, reference-resolution, responsive, and print regression guards.
- Remediates the supplied Tunisia report outcome: 1,261 private-use glyphs are eliminated, 30 encoded assistant citation clusters are disclosed and removed, sources become directly accessible, and the blocked publication state is visually unambiguous beside the 99% analytical-readiness score.

## 2.0.0-bio-rc.11 — Language-Linked Sample Loading

- Hotfix: restores reproducible GitHub Actions installs by replacing environment-specific lockfile tarball URLs with the public npm registry and moving the workflow actions/runtime to Node 24.
- Hotfix: separates canonical import validity from publication readiness. Review-required evidence now imports with explicit warnings while malformed contracts, broken references, and falsely verified provenance remain rejected.
- Hotfix: safely clears non-HTTP(S) URLs on non-verified evidence and corrects contradictory verification self-audits to `concern`; neither condition can pass the publication gate.
- Hotfix: strengthens generated and repair prompts in Arabic, English, and French with exact URL, locator, verification, and self-audit rules.
- Makes the selected interface language the default language for both Strategic and Biopolitical sample topics, while preserving a deliberately different Analysis language as an expert override.
- Persists whether Analysis language follows the interface language; selecting the matching language relinks them, and imported analyses remain authoritative for their declared language.
- Adds cross-engine coverage for all three languages and both lenses, plus override persistence and relinking, increasing the browser core from 208 to 216 cases.
- Closes VIS-002 after human review of regenerated RC 10 evidence confirmed all six phone Connections captures were toast-free and exposed the Relationship Explorer.

## 2.0.0-bio-rc.10 — Localized Toast Exit and Evidence Closure

- Corrects the remaining RC 9 phone evidence obstruction: the toast’s former fixed `84px` hidden translation could leave tall Arabic, English, or French messages partly visible after the active class was removed.
- Moves hidden toasts by their complete rendered height plus safe viewport clearance and disables pointer interception while hidden.
- Strengthens visual capture by polling the toast’s actual bounding rectangle until it is physically outside the viewport, rather than treating class removal as proof of disappearance.
- Records VIS-001 and VIS-003 as human-verified closures and prepares VIS-002 for regenerated RC 10 evidence review; analysis, graph, schema, import, export, and interaction contracts remain unchanged.

## 2.0.0-bio-rc.9 — Human Visual-Evidence Fidelity

- Responded to the fully green RC 8 automated gate (208 core, 2 hosted, and 18 visual cases) with a human inspection of all 36 language/theme/viewport screenshots.
- Preloads and synchronously decodes the above-the-fold guide mascot, preventing blank critical illustration frames observed in French light-phone and hosted Arabic mobile evidence.
- Decode-gates critical visual assets, clears transient toasts before screenshots, and targets the Relationship Explorer itself on phone Connections captures so evidence shows reviewable product content rather than temporary notifications or navigation alone.
- Adds machine-reviewed metadata for asset decoding, transient-UI clearance, and the phone capture target; analytical data, graph behavior, schemas, imports, exports, and interaction logic remain unchanged.

## 2.0.0-bio-rc.8 — Interaction Epoch and Full-Matrix Synchronization

- Added a render epoch to the Relationship Explorer focus scheduler so callbacks from superseded renders are cancelled deterministically.
- Distinguished mandatory focus transfers for Focus mode, overlays, walkthroughs, and node navigation from optional field-focus restoration, fixing WebKit’s Focus-mode entry contract without reopening the saved-view race.
- Hardened Connections and migrated-pillar browser flows through native focus-and-Enter activation plus selected/expanded-state assertions, addressing the two Firefox transitions exposed by the parallel 208-case matrix.
- Canonical analysis, persistence payloads, graph projections, schemas, imports, and exports remain unchanged.

## 2.0.0-bio-rc.7 — Cross-Engine Deferred Focus Arbitration

- Consolidated every Relationship Explorer post-render focus restoration behind one guarded scheduler instead of leaving overlay, Focus, walkthrough, and node paths as unconditional animation-frame callbacks.
- Preserves any focus deliberately claimed by a user, assistive technology, or test runner before the deferred callback executes, eliminating the saved-view focus theft reproduced in Firefox and WebKit under the full 208-case matrix.
- Added a static regression guard against reintroducing direct deferred focus paths; canonical analysis, persistence payloads, schemas, imports, and exports remain unchanged.

## 2.0.0-bio-rc.6 — Deferred Focus Ownership Correction

- Corrected a Relationship Explorer focus race where a stale animation-frame callback could return focus to Search after the user or assistive technology had already moved to another control.
- Deferred filter-focus restoration now runs only while document focus remains neutral, preserving deliberate focus ownership across rapid keyboard and programmatic navigation.
- Strengthened the saved-view contract by crossing an animation-frame boundary before asserting Save focus and keyboard activation; canonical analysis, persistence payloads, schemas, imports, and exports remain unchanged.

## 2.0.0-bio-rc.5 — Full-Matrix Saved-View Synchronization

- Added an explicit search-value settlement assertion before saving a Relationship Explorer view after search-driven rerendering.
- Added an explicit focused-button assertion before keyboard activation of Save view, ensuring the full 208-test parallel matrix targets the current rendered control rather than the preceding search field.
- Preserved the saved-view persistence, restore, deletion, keyboard, and analysis-scoping contracts; production runtime behavior and canonical analysis content are unchanged.

## 2.0.0-bio-rc.4 — Firefox Reflow Target Hardening

- Prevented record- and connection-inspector close controls from flex-shrinking below their declared 32px physical width under Firefox at the 320px/400%-equivalent intersection.
- Stabilized the reflow audit’s Connections transition through native focus-and-Enter activation and an explicit selected-tab assertion before inspecting the responsive list.
- Preserved the complete 48-cell reflow contract; no canonical analysis, graph, schema, import, or export content changed.

## 2.0.0-bio-rc.3 — Reflow List-Mode Inspector Correction

- Replaced the reflow audit’s hard-coded `ACT1` Map-node target with the first visible semantic record button in the active Connections list.
- Aligned the inspector contract with the intentional narrow-screen Story/List fallback while preserving keyboard activation, dialog containment, Escape closure, and focus restoration.
- Added a static regression guard for the list-scoped record target; no production analysis, layout, graph, import, export, or schema behavior changed.

## 2.0.0-bio-rc.2 — Reflow Audit Setup Correction

- Added localized, non-empty analysis topics to every 200%/400% equivalent reflow case before activating Preview prompt, satisfying the production validation contract in all 48 language, theme, viewport, and engine intersections.
- Preserved the modal keyboard contract and strengthened it with an explicit open-backdrop assertion before checking initial modal focus, containment, Escape closure, and trigger-focus restoration.
- Added a static regression guard for the topic prerequisite and modal-open assertion; no production analysis, layout, graph, import, export, or schema behavior changed.

## 2.0.0-bio-rc.1 — Reflow and Human Visual-Audit Readiness

- Added 48 reflow cases crossing Arabic, English, and French; light and dark; 200%/400% equivalent 640px/320px viewports; and Chromium, Firefox, WebKit, and mobile Chrome.
- Reflow coverage includes modal containment and focus return, complete mobile Connections fallback, Spatial disablement, reference-inspector containment and focus return, 24px minimum visible button targets, and page-level overflow protection.
- Added deterministic visual evidence capture for 18 language/theme/viewport combinations with shell and Connections screenshots, producing 36 screenshots, 18 measurement records, and one 55-artifact manifest.
- Added a visual-evidence completeness reviewer, dedicated reflow and visual-audit commands, CI artifact retention, and a manual audit ledger for native assistive technology, linguistic nuance, physical touch, native zoom, print/PDF preview, and epistemic integrity.
- Advanced the verified Beta 3 baseline to RC 1 without changing canonical Strategic or Biopolitical analysis content, graph projections, schemas, imports, or exports.

## 2.0.0-bio-beta.3 — Firefox Full-Matrix Explorer Stabilization

- Stabilized saved-view authoring by activating Network, Analyst, Time, Save, and Restore through their native focus-and-Enter semantics and verifying each state before snapshot creation.
- Stabilized Spatial record opening by focusing the freshly rendered “Open record” control before Enter activation.
- Preserved pointer coverage throughout the remaining explorer suite while making the two persistence/accessibility contracts deterministic under the expanded 160-test parallel workload.
- Responded to a fully green 28-case Beta 2 audit and two Firefox-only legacy explorer races in the complete suite; production state, graph geometry, canonical analysis, and export behavior remain unchanged.

## 2.0.0-bio-beta.2 — Forced-Colors Focus and WebKit Print Synchronization

- Extended the forced-colors focus outline from `:focus-visible` to `:focus` and `:focus-visible`, ensuring programmatic and assistive-technology focus remains perceivable in addition to conventional keyboard focus.
- Synchronized the print-palette assertion with WebKit’s asynchronous media transition using `matchMedia("print")` and computed-style polling; the exact readable palette requirement remains unchanged.
- Responded to the Beta 1 matrix result of 26/28 passed while preserving the 24-cell language/theme/runtime coverage, canonical analysis contracts, and all previously verified behavior.

## 2.0.0-bio-beta.1 — Final Intersection Audit and Release Hardening

- Added a 24-cell automated release gate crossing Arabic, English, and French with light and dark themes across desktop Chromium, Firefox, WebKit, and mobile Chrome.
- Each intersection validates persisted locale/theme settings, directionality, localized future-schema rejection, valid sample recovery, responsive Relationship Explorer presentation, duplicate-ID absence, page overflow, serious/critical axe findings, reduced motion, and print readability.
- Added four cross-engine keyboard-focus cases, including forced-colors emulation in Chromium, without manufacturing skipped results on engines that do not emulate that media feature.
- Hardened dark-theme printing with an explicit light print token set and hardened forced-colors focus, selected states, borders, and relationship graphics.
- Added a dedicated `test:browser:audit` command, made the audit part of the complete browser release gate, and documented the remaining native assistive-technology, linguistic, zoom, print-preview, touch-hardware, and epistemic manual sign-offs.
- Preserved the Strategic v1.1 engine, Biopolitical Training Map v2.1 schema and integrity gates, deterministic graph projections, imports, exports, and canonical analysis content unchanged.

## 2.0.0-bio-alpha.3 — WebKit Space-Key Activation Hotfix

- Normalized map-node Space activation across printable-key, legacy-key, and physical-key representations (`key`, `Spacebar`, and `code`) while preserving the distinct contract: Space selects and Enter opens the record inspector.
- Added a static regression guard for the physical Space-key path after the focused Alpha 2 matrix passed 11 of 12 tests and isolated the remaining failure to WebKit.
- Preserved deterministic graph geometry, spatial navigation, canonical analysis, imports, exports, schemas, and all non-keyboard behavior unchanged.

## 2.0.0-bio-alpha.2 — Spatial Access and Cross-Browser Test Stabilization

- Added a localized spatial record picker that reliably selects depth-occluded cards without flattening the visual 3D field or removing direct semantic node buttons.
- Replaced exact zero-duration assertions with a numeric one-millisecond ceiling, accommodating the one-microsecond reduced-motion clamp returned by Chromium, Firefox, and WebKit.
- Scoped Biopolitical export-tab and Network-node keyboard actions to their elements to prevent Firefox from losing focus during freshly rendered test transitions.
- Preserved canonical analysis, deterministic spatial geometry, exports, schemas, and all Strategic and Biopolitical runtime behavior.

## 2.0.0-bio-alpha.1 — Phase 4 Capability-Gated Spatial Exploration

- Added a deterministic Spatial relationship view that projects the existing filtered graph into nine labeled 3D pillar clusters while preserving all 32 fixture records and 28 indexed connections.
- Added localized orbit, tilt, zoom, and reset controls; pointer dragging; arrow-key, plus/minus, and Home equivalents; live orientation feedback; and reduced-motion behavior.
- Kept every spatial node as a semantic inspectable button and retained the complete Connections list as the always-available accessible equivalent.
- Added a strict capability boundary: narrow or unsupported displays disable Spatial, explain why, and remain in the labeled list instead of receiving a degraded or overflowing scene.
- Extended analysis-scoped saved views with spatial mode, orientation, tilt, and zoom without storing canonical analysis content.
- Added pure geometry invariants, capability/fallback assertions, keyboard and axe coverage, and eight cross-browser Phase 4 contracts without adding WebGL, network, or third-party runtime dependencies.

## 1.9.0-bio-alpha.2 — Firefox RTL Export-Tab Test Stabilization

- Stabilized the Arabic Strategic cross-locale export contract in Firefox by activating the already accessible Export tab through focus and Enter instead of a timing-sensitive pointer hit on the freshly rendered RTL navigation.
- Preserved the production runtime and all Phase 3 analysis, graph, overlay, saved-view, schema, import, and export behavior unchanged.

## 1.9.0-bio-alpha.1 — Phase 3 Context Overlays and Durable Views

- Added localized temporal overlays that project five canonical bands from authored history, dated evidence, immediate effects, medium-term adaptations and dependencies, and future or intergenerational signals without inferring chronology.
- Added localized international-comparison cards with basis, similarities, differences, transfer limits, confidence, and direct navigation to named supporting evidence.
- Added analysis-scoped saved explorer views that restore mode, view, detail level, overlay, filters, layers, selection, neighborhood, and zoom from browser-local presentation state without storing or mutating canonical analysis data.
- Expanded standalone HTML reports with a complete named relationship atlas, explicit/evidence/structural connection families, canonical time signals, and international comparison limits while preserving the embedded and downloadable canonical JSON contract unchanged.
- Added pure projection invariants, static Phase 3 guards, lossless export markers, and eight cross-browser overlay/persistence contracts.

## 1.8.0-bio-alpha.1 — Phase 2 Guided Exploration

- Added an escapable Focus mode that expands the relationship workspace, locks background scrolling, preserves theme/RTL behavior, and safely deactivates when leaving Connections.
- Added localized deterministic walkthroughs for Story, Evidence Trail, and Network with progress, named endpoints, relationship explanations, previous/next controls, and visual target highlighting.
- Replaced transient bottom-only details with a persistent inspection dock for both records and connections; selections now survive mode and map/list changes.
- Added explicit hidden-selection messaging and a one-action reveal path that restores the full Network context without mutating the analysis.
- Added record-level inspection actions for opening the full canonical record or isolating its one-hop neighborhood.
- Added 12 cross-browser contracts for Focus behavior, walkthrough progress, inspection continuity, and hidden-context recovery, bringing the relationship explorer matrix to 32 tests.

## 1.7.0-bio-alpha.2 — Mobile Story-Test State Hotfix

- Made the Guided/Analyst browser contract explicitly switch from the intentional mobile list default to Story Map before selecting a causal connector.
- Added an immediate four-connector assertion so future failures identify view-state drift instead of waiting for the global timeout.
- No runtime, schema, graph, import, export, accessibility, or visual behavior changed.

## 1.7.0-bio-alpha.1 — Phase 1 Comprehension Architecture

- Replaced the one-layout-fits-all relationship map with three purpose-built views: numbered causal paths for Story, claim-centered support/counter clusters for Evidence Trail, and a compact nine-pillar topology for Network.
- Added Guided and Analyst detail levels so general readers see names and plain-language explanations first, while analysts retain canonical IDs, confidence, provenance, and source paths.
- Added localized “Why connected?” explanations for authored, supporting, counter, and structural relationships in Arabic, English, and French.
- Moved dense filters and layer controls into a progressive disclosure panel, kept search/reset immediately available, and added an always-visible connection legend.
- Removed the forced nine-column Network canvas in favor of a responsive three-column topology, with single-column mobile behavior and preserved RTL, keyboard, reduced-motion, and accessible list support.
- Added cross-browser contracts for deterministic causal paths, evidence clusters, detail-level disclosure, provenance, and connection explanations.

## 1.6.0-bio-alpha.2 — Story Map Pillar-Taxonomy Hotfix

- Corrected the graph-to-view pillar mapping so every indexed record uses the same nine canonical pillar keys as the review protocol and 2D lane renderer.
- Restored the four previously omitted desktop lane groups—actors/institutions, mechanisms/infrastructure, meaning/classification, and human functions—so all 32 fixture records render in Network mode.
- Restored desktop search, node inspection, and keyboard selection for records such as `ACT1`; mobile list mode was unaffected because it does not group records into lanes.
- Added a pure no-browser invariant that requires the fixture graph to populate exactly the nine rendered Biopolitical pillar keys, preventing taxonomy drift from passing CI again.

## 1.6.0-bio-alpha.1 — 2D Relationship Story Map

- Added a localized Connections review tab with deterministic Story, Evidence Trail, and Network modes over the canonical relationship index.
- Added searchable and filterable HTML node lanes with authored, evidentiary, and structural SVG connector layers; no force simulation, CDN, canvas, or network dependency is used.
- Added pillar, record-type, relation, confidence, and evidence-verification filters; one-hop neighborhood focus; live result counts; zoom, fit, and reset controls.
- Added an equivalent accessible connections list and inspectable edge details with named endpoints, relation, mechanism, provenance, and canonical source path.
- Synchronized map nodes with the existing reference inspector and added “Show in map” navigation from any named reference.
- Added responsive mobile list defaults, RTL lane mirroring, keyboard mode navigation, keyboard node selection, reduced-motion behavior, and map-specific accessibility tests.

## 1.5.0-bio-alpha.1 — Named Relationship Explorer

- Added a pure, lens-aware relationship index over every canonical Biopolitical ID-bearing record, authored link, and validated cross-reference without changing the v2.1 schema.
- Replaced raw reference-only strings in the review experience with compact chips that show the record’s human-readable name and preserve its canonical ID.
- Added an accessible side inspector (mobile bottom sheet) with type, pillar, confidence, incoming references, outgoing references, keyboard focus containment, Escape dismissal, and focus restoration.
- Added human-readable reference expansion and a named reference directory to standalone HTML reports while preserving the lossless canonical JSON payload unchanged.
- Added fixture-level graph integrity tests and cross-browser interaction/export contracts for named references.

## 1.4.0-bio-alpha.4 — Browser Matrix Resource-Stability Hotfix

- Capped the core Playwright matrix at four workers by default so report generation, downloads, WebKit, and axe scans do not saturate a developer workstation.
- Raised the cross-browser per-test budget from 30 to 60 seconds and assertion budget from five to ten seconds without weakening any contract assertion.
- Added `PLAYWRIGHT_WORKERS` as an explicit override for slower or faster hosts and documented the two-worker PowerShell fallback.
- Added a CI contract guard so the bounded-worker and timeout policy cannot silently regress.

## 1.4.0-bio-alpha.3 — Windows Browser Matrix Hotfix

- Preserved the selected language in generated Strategic samples so Arabic and French exports no longer fall back to English metadata.
- Stabilized review-tab interaction across Firefox and WebKit by removing sticky/hover movement from the navigation hit targets.
- Made modal focus restoration explicit for WebKit, which does not consistently focus buttons on pointer activation.
- Delayed object-URL cleanup so Firefox can complete consecutive HTML and JSON downloads reliably.
- Added selected-tab assertions and atomic download waits to browser tests, with a focused timeout budget for the two-file lossless export contract.
- Added a safe cross-platform release-layout migration for upgrades over an older directory; it preserves divergent files and removes only verified duplicates.

## 1.4.0-bio-alpha.2 — Audit Remediation

- Upgraded the canonical Biopolitical schema to `2.1.0`, added legal, international, five-level capture, theoretical-comparison, evidence-design, verification, and outcome-character requirements, and generated a strict browser validator from the schema.
- Added a separate `biopolitical-migrated-draft-v1` identity so legacy six-layer material is preserved without being falsely stamped canonical.
- Enforced exact 13 capture criteria, nine explanation families, five capture levels, global ID uniqueness, typed references, falsifiers, quantitative metadata, evidence traceability, and self-audit consistency at import time.
- Separated structural readiness from source verification; placeholder fixtures and unverified sources cannot pass the publication gate.
- Hardened prompts against embedded instructions, fabricated evidence, profiling, coercive surveillance, repression, manipulation, stigmatization, and group-to-individual inference.
- Made review/export lossless through expanded analytical cards, canonical JSON download, a complete in-app contract inspector, and an embedded machine-readable payload in HTML reports.
- Made report language follow the analysis language independently of the interface language and completed Arabic/French fixture localization and enum/audit labels.
- Added keyboard-complete tabs, semantic accordions, segmented-control radio states, modal focus restoration/trapping, and automated accessibility scanning.
- Standardized CI on npm, expanded Chromium/Firefox/WebKit/mobile coverage, added adversarial import/parser/export tests, archived non-production root prototypes, and replaced the development server with a minimal dependency-free static server.

## 1.4.0-bio-alpha.1 — Biopolitical Training Map v2 Replacement

- Replaced the former six-array Biopolitical semantic remap with the independent `biopolitical-training-map-v2` contract and schema `2.0.0`.
- Added nine analytical pillars spanning question/context, human functions, actors and affected populations, mechanisms and infrastructure, meaning and classification, intervention/capture, distribution, evidence and rival explanations, and agency/alternatives.
- Added the protection-to-expropriation intervention continuum, 13 capture criteria, source hierarchy, calibrated conclusion, and 18-point self-audit.
- Added trilingual v2 prompts, canonical fixtures, readiness diagnostics, review navigation, responsive rendering, and schema/contract-tagged HTML export.
- Preserved the Strategic v1.1 engine and made lens changes/imports contract-safe.
- Added a conservative legacy Biopolitical v1.1 migration adapter that does not invent governing actors or intervention modality and exposes missing v2 fields as warnings.
- Added dedicated v2, schema, fixture, import, export, cross-locale, accessibility, desktop, RTL, and mobile QA coverage.

## v1.3.0-bio — Stable Release Tag + Archive

- Relabeled the locked alpha.7 evidence/stable baseline as `v1.3.0-bio`.
- Added final handoff documentation for source-of-truth, validation, evidence, CI, and commit/push expectations.
- Preserved the Strategic/Biopolitical dual-lens feature set without product expansion.
- Kept the isolated hosted-evidence browser gate and evidence-review check as stable-release requirements.
- Updated app, export, tests, documentation, package, and lockfile metadata to `1.3.0-bio`.

## v1.3.0-bio — Evidence Artifact Review + Release Candidate Freeze

- Added `tests/hosted-demo-evidence-review-check.mjs` to verify hosted-demo evidence artifacts after browser capture.
- Added `npm run test:evidence:hosted` as the manual/local evidence review alias.
- Updated GitHub Actions to review `hosted-demo-evidence/` before uploading the artifact.
- Added `docs/evidence-artifact-review.md` to document required evidence files, metadata, locale snapshots, and stable-release freeze rules.
- Bumped root app identity and lockfile metadata to `1.3.0-bio`.

## v1.3.0-bio — Hosted Demo Evidence + Public UI Lock

- Added `tests/hosted-demo-evidence.spec.js` for browser-captured public UI evidence.
- Added `npm run test:browser:hosted` as a focused hosted-demo evidence gate.
- Captures desktop/mobile screenshots plus Arabic, English, and French visible-text snapshots.
- Added GitHub Actions artifact upload for `hosted-demo-evidence`.
- Hardened workspace hygiene against both local and CI hosted-demo evidence folders.
- Updated release-lock and export docs to cover public UI evidence capture.
- Bumped root app identity and lockfile metadata to `1.3.0-bio`.

## v1.3.0-bio-alpha.5 — Release Lock + CI Hygiene Hardening

- Added stable CI aliases: `test:ci:no-browser`, `test:ci:browser`, and `test:ci`.
- Updated GitHub Actions to run the same no-browser and browser aliases validated locally.
- Added `tests/ci-script-contract-check.mjs` to prevent workflow/package-script drift.
- Hardened workspace hygiene against preview tracks, Playwright output, patch folders, and root patch/package ZIP artifacts.
- Added release lock documentation in `docs/release-lock.md`.
- Bumped root app identity and lockfile metadata to `1.3.0-bio-alpha.5`.

## v1.3.0-bio-alpha.5 — Review Title Lens Contract Hotfix

- Made the review heading explicitly lens-aware for strategic mode as well as biopolitical mode.
- Preserved the stable `#reviewTitle` browser-test anchor added in alpha.4.1.
- Bumped contract checks to `1.3.0-bio-alpha.5`.

## v1.3.0-bio-alpha.5 — Lens Import Contract + Cross-Locale Export QA

- Added browser import-contract coverage proving `analysis_lens` in imported JSON overrides the previous UI lens state.
- Added browser export coverage across Arabic, English, and French for both Strategic and Biopolitical lenses.
- Added a root source-of-truth guard to reject committed `preview/` or `biopreview/` duplicate app tracks.
- Added optional workspace hygiene checks for patch folders and Playwright output artifacts before commit.
- Preserved the explicit HTML export contract markers introduced in alpha.3.

## v1.3.0-bio-alpha.3.3 — Export Scenario Rationale Contract Hotfix

- Includes scenario rationale text in downloaded HTML reports so export evidence preserves why a scenario is plausible.
- Keeps the biopolitical export contract assertion for the English `proof infrastructure` sample token.
- Adds a static guard so the scenario rationale renderer cannot silently disappear.

## v1.3.0-bio-alpha.3.2 — Export Contract Locale Determinism Hotfix

- Fixed export-contract browser coverage so English sample-token assertions first switch the UI locale to English.
- Preserved the lens contract assertions for Strategic and Biopolitical exports.
- No runtime/export behavior change beyond version identity.

## v1.3.0-bio-alpha.3 — Browser Evidence + Export Contract Hardening

- Added exported HTML contract markers for `app-version` and `analysis-lens`.
- Added `data-analysis-lens` and `data-app-version` attributes to the standalone report shell.
- Added browser export contract coverage that downloads Strategic and Biopolitical HTML reports through the real UI and attaches them as Playwright evidence.
- Added positive/negative export assertions so Strategic reports do not leak Biopolitical report identity and Biopolitical reports do not leak the Strategic report chain.
- Added `docs/export-contract.md` and `npm run test:browser:export`.

## v1.3.0-bio-alpha.2.2 — Runtime Metric Renderer Smoke Fix

- Restored the missing `metricCard` runtime renderer used by the overview quality panel.
- Added a static guard so future scoring UI updates cannot pass without the metric renderer.
- Preserved the alpha.2.1 layout and review-panel stability fixes.


## v1.3.0-bio-alpha.2.1 — Browser Smoke Hotfix

- Hardened the Strategic/Biopolitical lens toggle layout so adjacent select fields cannot intercept browser click targets.
- Added defensive review-tab fallback rendering so sample loading cannot leave the review panel empty after viewport-dependent interaction timing.

## 1.3.0-bio-alpha.2 — Lens-Aware Scoring + Preview Track Decision

- Added biopolitical ontology diagnostics for problematization, population construction, governance techniques, normalization/subjectivation, embodied/social outcomes, and resistance/feedback.
- Made the quality score lens-aware: Strategic keeps the original strategic scoring emphasis, while Biopolitical increases weight on governance coherence and protection/control contradictions.
- Added biopolitical-specific score diagnostics, health warnings, formula text, and evidence pressure checks.
- Added `docs/preview-track-decision.md` to prevent root/preview source-of-truth drift.
- Strengthened QA/static gates to require lens-aware scoring and the preview-track decision document.

## 1.3.0-bio-alpha.1 — Biopolitical Lens Toggle Foundation

- Added a visible Strategic/Biopolitical analysis lens toggle.
- Preserved the original strategic model and backward-compatible six-array JSON structure.
- Added `analysis_lens` support to normalization, generated schema prompts, formal schema, and fixtures.
- Added biopolitical prompt ontology: problematization, populations, governance techniques, norms/subjectivation, embodied/social outcomes, and resistance/feedback.
- Added lens-aware UI labels, topic placeholders, engine map copy, report subtitle, health messages, and score hints.
- Added trilingual biopolitical labels for Arabic, English, and French.
- Added strategic and biopolitical sample routing through the existing sample button.
- Added biopolitical fixtures in Arabic, English, and French.
- Strengthened QA gates to detect missing analysis-lens support and missing biopolitical ontology tokens.


## 1.2.0 — Modular QA hardening

- Split the former single-file app into `index.html`, `src/styles.css`, and `src/app.js` while preserving static GitHub Pages deployment.
- Added app version metadata for release verification.
- Added consolidated QA gate at `tests/qa-check.mjs`.
- Added dedicated schema governance check at `tests/schema-check.mjs`.
- Added static accessibility gate at `tests/a11y-static-check.mjs`.
- Added mobile RTL Playwright smoke coverage at `tests/rtl-mobile.spec.js`.
- Added runtime accessibility Playwright smoke coverage at `tests/a11y.spec.js`.
- Strengthened the formal JSON schema with required IDs, minimum section counts, evidence counter-pressure, and scenario falsifier requirements.
- Updated package scripts for QA, schema, fixture, accessibility, browser, and RTL checks.

## 1.1.0 — Analytical rigor upgrade

- Added formal schema contract at `schema/strategic-analysis.schema.json`.
- Added Research prompt mode with source discipline, counter-evidence, uncertainty, IDs, and silent self-audit instructions.
- Added computed model metrics: API, NSI, tool pressure score, and interest weight.
- Added quality gate logic before publication/export.
- Strengthened evidence handling with source metadata and counter-evidence.
- Added fixture validation tests.

## 1.0.0 — Initial public release

- Public semantic versioning starts here.
- Added optimized runtime image assets: 512 px, 192 px, 180 px, and 32 px versions. The original 2048 px mascot remains as the editable/source asset only.
- Added trilingual UI: Arabic, English, and French.
- Fixed RTL welcome layout and mascot integration.
- Simplified export workflow to HTML report only.
- Added static release checks and Playwright smoke test skeleton.
