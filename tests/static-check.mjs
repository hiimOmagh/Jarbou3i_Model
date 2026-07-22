import fs from "node:fs";
import { execFileSync } from "node:child_process";

const fail = (message) => {
  console.error(`Static check failed: ${message}`);
  process.exit(1);
};
const read = (file) => fs.readFileSync(file, "utf8");

const index = read("index.html");
const app = read("src/app.js");
const bio = read("src/biopolitics.js");
const integrity = read("src/biopolitics-integrity.js");
const graph = read("src/biopolitics-graph.js");
const bioReport = read("src/biopolitical-report.js");
const referenceUi = read("src/reference-ui.js");
const explorer = read("src/relationship-explorer.js");
const explorerStyles = read("src/relationship-explorer.css");
const styles = read("src/styles.css");
const smokeBrowser = read("tests/smoke.spec.js");
const applicationShellBrowser = read("tests/application-shell.spec.js");
const resultsWorkspaceBrowser = read("tests/results-workspace.spec.js");
const resultsExplanationBrowser = read("tests/results-explanation.spec.js");
const resultsInspectionBrowser = read("tests/results-inspection.spec.js");
const parser = read("src/json-parser.js");
const platformState = read("src/core/platform-state.js");
const shellPreferences = read("src/core/shell-preferences.js");
const shellNavigation = read("src/core/shell-navigation.js");
const resultsOrientation = read("src/core/results-orientation.js");
const resultsExplanation = read("src/core/results-explanation.js");
const resultsInspection = read("src/core/results-inspection.js");
const relationshipIntelligence = read("src/core/relationship-intelligence.js");
const evidenceIntelligence = read("src/core/evidence-intelligence.js");
const evidenceTraceability = read("src/core/evidence-traceability.js");
const evidenceReviewPlan = read("src/core/evidence-review-plan.js");
const persistence = read("src/core/persistence.js");
const localization = read("src/core/localization.js");
const renderRegions = read("src/core/render-regions.js");
const provenance = read("src/core/provenance.js");
const validator = read("src/biopolitics-schema-validator.js");
const pkg = JSON.parse(read("package.json"));
const lock = JSON.parse(read("package-lock.json"));

if (
  /\[data-results-inspection\]\s+\[data-reference-id=/.test(resultsInspectionBrowser)
  || /\.locator\(['"`]\[data-reference-id=/.test(resultsInspectionBrowser)
) {
  fail("inspection browser contract uses an ambiguous cross-surface record selector");
}
for (const recordId of ["E1", "IV1"]) {
  if (!resultsInspectionBrowser.includes(
    `[data-inspection-directory-item] [data-reference-id="${recordId}"]`,
  )) {
    fail(`inspection browser contract does not scope ${recordId} to the canonical directory item`);
  }
}

for (const [name, entry] of Object.entries(lock.packages || {})) {
  if (!entry?.resolved) continue;
  let resolved;
  try {
    resolved = new URL(entry.resolved);
  } catch {
    fail(`lockfile contains an invalid resolved URL for ${name || "root"}`);
  }
  if (resolved.hostname !== "registry.npmjs.org") {
    fail(`lockfile contains a non-public registry URL for ${name || "root"}`);
  }
}

for (const [file, source] of [
  ["src/app.js", app],
  ["src/biopolitics.js", bio],
  ["src/biopolitics-integrity.js", integrity],
  ["src/biopolitics-graph.js", graph],
  ["src/biopolitical-report.js", bioReport],
  ["src/reference-ui.js", referenceUi],
  ["src/relationship-explorer.js", explorer],
  ["src/json-parser.js", parser],
  ["src/core/platform-state.js", platformState],
  ["src/core/shell-preferences.js", shellPreferences],
  ["src/core/shell-navigation.js", shellNavigation],
  ["src/core/results-orientation.js", resultsOrientation],
  ["src/core/results-explanation.js", resultsExplanation],
  ["src/core/results-inspection.js", resultsInspection],
  ["src/core/relationship-intelligence.js", relationshipIntelligence],
  ["src/core/evidence-intelligence.js", evidenceIntelligence],
  ["src/core/evidence-traceability.js", evidenceTraceability],
  ["src/core/persistence.js", persistence],
  ["src/core/localization.js", localization],
  ["src/core/render-regions.js", renderRegions],
  ["src/core/provenance.js", provenance],
]) {
  try {
    void source;
    execFileSync(process.execPath, ["--check", file], { stdio: "pipe" });
  } catch (error) {
    fail(`${file}: ${error.stderr?.toString().trim() || error.message}`);
  }
}

const ids = [...index.matchAll(/id="([^"]+)"/g)].map((match) => match[1]);
if (new Set(ids).size !== ids.length) fail("duplicate DOM IDs found");
if (/<style>[\s\S]*<\/style>/.test(index)) fail("inline stylesheet remains");
if (/<script>[\s\S]*<\/script>/.test(index)) fail("inline script remains");
if (validator.includes("require(")) fail("browser validator contains CommonJS imports");

for (const file of [
  "schema/biopolitical-analysis.schema.json",
  "schema/biopolitical-migrated-draft.schema.json",
  "tests/biopolitical-integrity-check.mjs",
  "tests/biopolitical-graph-check.mjs",
  "tests/biopolitical-report-check.mjs",
  "tests/reference-resolution.spec.js",
  "tests/relationship-explorer.spec.js",
  "tests/json-parser-check.mjs",
  "tests/biopolitical-language-check.mjs",
  "tests/export-completeness.spec.js",
  "tests/import-validation.spec.js",
  "tests/release-audit-matrix.spec.js",
  "tests/reflow-audit.spec.js",
  "tests/visual-audit-evidence.spec.js",
  "tests/visual-audit-evidence-review-check.mjs",
  "tests/platform-architecture-check.mjs",
  "tests/platform-services-check.mjs",
  "tests/provenance-check.mjs",
  "src/core/lens-registry.js",
  "src/core/platform-state.js",
  "src/core/shell-preferences.js",
  "src/core/shell-navigation.js",
  "src/core/results-orientation.js",
  "src/core/results-explanation.js",
  "src/core/results-inspection.js",
  "src/core/persistence.js",
  "src/core/localization.js",
  "src/core/render-regions.js",
  "src/core/provenance.js",
  "src/lenses/strategic/adapter.js",
  "src/lenses/biopolitical/adapter.js",
  "tests/shell-preferences-check.mjs",
  "tests/shell-navigation-check.mjs",
  "tests/results-orientation-check.mjs",
  "tests/results-explanation-check.mjs",
  "tests/results-inspection-check.mjs",
  "tests/results-workspace.spec.js",
  "tests/results-explanation.spec.js",
  "tests/results-inspection.spec.js",
  "tests/application-shell.spec.js",
  "docs/final-audit-matrix.md",
  "docs/manual-release-audit.md",
  "scripts/migrate-release-layout.mjs",
  "tests/release-layout-migration-check.mjs",
]) {
  if (!fs.existsSync(file)) fail(`missing audit regression file: ${file}`);
}

for (const token of [
  'role="radiogroup"',
  'role="radio"',
  'aria-checked="true"',
  'role="tablist"',
  'role="tabpanel"',
  'aria-modal="true"',
]) {
  if (!index.includes(token)) fail(`index accessibility token missing: ${token}`);
}
for (const token of [
  'class="skipLink"',
  'id="workspaceBar"',
  'id="densityBtn"',
  'id="shellNextAction"',
  'id="shellAnnouncement"',
  'data-shell-nav="workflow"',
  'data-shell-nav="engine"',
  'data-shell-nav="review"',
]) {
  if (!index.includes(token)) fail(`Phase 2 application-shell token missing: ${token}`);
}
for (const token of [
  "createShellPreferences",
  "renderApplicationShell",
  "navigateShell",
  "bindWorkspaceNavigation",
  "resolveShellCommand",
  "SHELL_PREFERENCES.apply",
  "state.shellSection = \"review\"",
]) {
  if (!app.includes(token)) fail(`Phase 2 shell runtime token missing: ${token}`);
}
for (const token of [
  'body[data-density="compact"]',
  ".workspaceNavItem.active",
  ".sectionEyebrow",
  ".shellNextAction",
  ".commandActions",
  ".skipLink:focus",
]) {
  if (!styles.includes(token)) fail(`Phase 2 shell stylesheet token missing: ${token}`);
}
for (const token of [
  "body.dark .workspaceNavItem.active .workspaceNavIndex",
  "background:#1d4ed8",
  ".topActions .iconBtn,.topActions .shellControl",
  "min-width:44px",
]) {
  if (!styles.includes(token)) fail(`Alpha.16 shell closure token missing: ${token}`);
}
if (!smokeBrowser.includes('.stageItem[aria-current="step"]')) {
  fail("workflow smoke assertion is not scoped to the workflow stage");
}
if (applicationShellBrowser.includes('"rgb(29, 78, 216)"')) {
  fail("responsive shell test must not require the desktop active-step fill at 320 px");
}
for (const token of [
  'role="tab"',
  "aria-selected",
  "aria-controls",
  "aria-expanded",
  "aria-labelledby",
  "trapModalFocus",
]) {
  if (!app.includes(token)) fail(`runtime accessibility token missing: ${token}`);
}
for (const token of [
  'analysis_id: `sample-strategic-${lang}`',
  "language: lang",
  "showModal(t(\"promptPreview\"), state.lastPrompt, event.currentTarget)",
  "}, 30_000)",
]) {
  if (!app.includes(token)) fail(`browser hotfix token missing: ${token}`);
}
for (const token of [
  "data-focus-toggle",
  "data-tour-toggle",
  "relationshipWalkthroughProgress",
  "data-reveal-selection",
  "function deactivate()",
]) {
  if (!explorer.includes(token)) fail(`Phase 2 relationship contract missing: ${token}`);
}
for (const token of [
  "data-map-overlay",
  "data-save-view",
  "viewSnapshot",
  "loadSavedViews",
]) {
  if (!explorer.includes(token)) fail(`Phase 3 relationship contract missing: ${token}`);
}
for (const token of ["temporalProjection", "comparativeProjection"]) {
  if (!graph.includes(token)) fail(`Phase 3 projection contract missing: ${token}`);
}
if (!bioReport.includes('data-relationship-atlas="complete"')) {
  fail("Phase 3 standalone relationship atlas missing");
}
for (const token of [
  'data-publication-gate="${gate}"',
  'class="reportToc"',
  'data-canonical-contract="complete"',
  'target="_blank" rel="noopener noreferrer"',
  ".reportSection{box-shadow:none;break-inside:auto}",
]) {
  if (!bioReport.includes(token)) {
    fail(`standalone report resilience contract missing: ${token}`);
  }
}
if (!app.includes('import "./biopolitical-report.js";')) {
  fail("standalone report renderer is not loaded by the release shell");
}
for (const token of [
  "data-relationship-spatial",
  "data-spatial-control",
  "detectSpatialCapability",
  "relationshipSpatialViewport",
  "spatialRecordSelect",
  "onpointerdown",
]) {
  if (!explorer.includes(token)) fail(`Phase 4 spatial contract missing: ${token}`);
}
if (!graph.includes("spatialProjection")) {
  fail("Phase 4 deterministic spatial projection missing");
}
if (!explorer.includes('event.code === "Space"')) {
  fail("cross-browser Space-key activation contract missing");
}
for (const token of ["@media (forced-colors:active)", ":focus,:focus-visible", "color-scheme:light", "HighlightText", "translateY(calc(100% + 48px))"]) {
  if (!styles.includes(token)) fail(`final audit visual resilience contract missing: ${token}`);
}
const releaseAudit = read("tests/release-audit-matrix.spec.js");
for (const token of ['matchMedia("print").matches', "expect.poll", "synchronizeAuditState", 'languageButton.press("Enter")', 'themeButton.press("Enter")']) {
  if (!releaseAudit.includes(token)) fail(`final audit synchronization contract missing: ${token}`);
}
const relationshipBrowser = read("tests/relationship-explorer.spec.js");
for (const token of ['requestAnimationFrame(resolve)', 'expect(saveView).toBeFocused()', 'saveView.press("Enter")', 'restoreView.press("Enter")', 'openSelected.press("Enter")']) {
  if (!relationshipBrowser.includes(token)) fail(`Firefox explorer stabilization contract missing: ${token}`);
}
for (const token of ["preventScroll: true", 'deleteView.press("Enter")']) {
  if (!relationshipBrowser.includes(token)) fail(`saved-view keyboard regression token missing: ${token}`);
}
for (const token of [
  "createResultsOrientation",
  "resultsOrientationHtml",
  'data-results-orientation',
  'data-results-orientation data-analysis-lens=',
  'lens: "strategic"',
  'lens: "biopolitical"',
]) {
  if (!app.includes(token)) fail(`Phase 3 results-orientation runtime token missing: ${token}`);
}
if (app.includes('data-results-orientation data-lens=')) {
  fail("results metadata must not reuse the interactive lens-control namespace");
}
if ((app.match(/querySelectorAll\("#analysisLens \[data-lens\]"\)/g) || []).length !== 2) {
  fail("lens-control rendering and event binding must remain scoped to #analysisLens");
}
for (const token of [
  ".resultsOrientation",
  ".orientationConclusion",
  ".orientationGate",
  ".orientationSignals",
  ".diagnosticsDivider",
]) {
  if (!styles.includes(token)) fail(`Phase 3 results-orientation style token missing: ${token}`);
}
for (const token of [
  "promotedNextAction",
  ".intelBrief .nextAction",
  "toContainText(promotedNextAction)",
  "toHaveAttribute('data-analysis-lens', 'strategic')",
  "toHaveAttribute('data-analysis-lens', 'biopolitical')",
]) {
  if (!resultsWorkspaceBrowser.includes(token)) fail(`results authority assertion missing: ${token}`);
}
if (resultsWorkspaceBrowser.includes("orientation).toHaveAttribute('data-lens'")) {
  fail("results browser contract must not assert the reserved lens-control attribute");
}
if (resultsWorkspaceBrowser.includes("Replace generic historical notes")) {
  fail("results workspace test must not substitute fixture text for runtime authority");
}
for (const token of [
  "createResultsExplanation",
  "RESULTS_EXPLANATION_KEYS",
  "sourceItems.slice(0, 2)",
  "Object.freeze",
]) {
  if (!resultsExplanation.includes(token)) fail(`Phase 3 results-explanation model token missing: ${token}`);
}
for (const token of [
  "strategicResultsExplanation",
  "biopoliticalResultsExplanation",
  "resultsExplanationHtml",
  "wireResultsExplanation",
  "data-results-explanation",
  "data-explanation-open",
  "data-analysis-lens=",
]) {
  if (!app.includes(token)) fail(`Phase 3 results-explanation runtime token missing: ${token}`);
}
if (app.includes('data-results-explanation data-lens=')) {
  fail("results explanation must not reuse the interactive lens-control namespace");
}
for (const token of [
  ".resultsExplanation",
  ".explanationGrid",
  ".explanationCard",
  ".explanationInspect",
  "min-height:44px",
]) {
  if (!styles.includes(token)) fail(`Phase 3 results-explanation style token missing: ${token}`);
}
for (const token of [
  'toHaveCount(5)',
  'strategicMechanisms.press("Enter")',
  "strategicEvidenceName",
  'strategicEvidence.press("Enter")',
  'biopoliticalEffects.press("Enter")',
  "biopoliticalEvidenceName",
  'biopoliticalEvidence.press("Enter")',
  'locator("#reviewContent")).toContainText',
  'data-acc="tools"',
  'data-bio-acc="distribution_effects"',
  "Comment la conclusion est construite",
  "width: 320",
]) {
  if (!resultsExplanationBrowser.includes(token)) fail(`results explanation browser contract missing: ${token}`);
}
for (const fixtureOnlyText of [
  "Historical power distribution reference",
  "Jurisdiction-specific health-pass law",
]) {
  if (resultsExplanationBrowser.includes(fixtureOnlyText)) {
    fail(`results explanation browser test must use runtime authority instead of fixture text: ${fixtureOnlyText}`);
  }
}
for (const token of [
  "createResultsInspectionIndex",
  "STRATEGIC_DESCRIPTORS",
  "collectOccurrences",
  "supporting_evidence_ids",
  "counter_evidence_ids",
  "approvalEligible",
  "Object.freeze",
]) {
  if (!resultsInspection.includes(token)) fail(`Phase 3 inspection model token missing: ${token}`);
}
for (const token of [
  "currentResultsInspectionIndex",
  "renderInspectionDirectory",
  "bindResultsInspection",
  "openInspectionOccurrence",
  "data-results-inspection",
  "data-inspection-id",
  'state.activeReview === "inspection"',
]) {
  if (!app.includes(token)) fail(`Phase 3 inspection runtime token missing: ${token}`);
}
for (const token of [
  "data-inspection-section=\"provenance\"",
  "data-inspection-section=\"evidence\"",
  "data-inspection-section=\"audit\"",
  "data-reference-occurrence",
  "onOpenOccurrence",
  "if (rootElement.hidden) returnFocus",
]) {
  if (!referenceUi.includes(token)) fail(`Phase 3 inspector interaction token missing: ${token}`);
}
for (const token of [
  ".inspectionDirectory",
  ".inspectionDirectoryMetrics",
  ".referenceInspectorSection",
  ".referenceOccurrences",
  ".referenceEvidenceGrid",
]) {
  if (!styles.includes(token)) fail(`Phase 3 inspection style token missing: ${token}`);
}
for (const token of [
  'data-review="inspection"',
  'data-bio-review="inspection"',
  'data-inspection-section="provenance"',
  'data-inspection-section="occurrences"',
  'data-inspection-id="E1"',
  'page.keyboard.press("Escape")',
]) {
  if (!resultsInspectionBrowser.includes(token)) fail(`results inspection browser contract missing: ${token}`);
}
if (/html,body\{[^}]*scroll-behavior:smooth/.test(styles)) {
  fail("global smooth scrolling must not block browser actionability scrolling");
}
const staticServer = read("scripts/static-server.mjs");
for (const token of ["const parentPid = process.ppid", "process.kill(parentPid, 0)", "process.once(\"SIGTERM\", shutdown)"]) {
  if (!staticServer.includes(token)) fail(`static server lifecycle contract missing: ${token}`);
}
for (const token of ["function focusAfterRender", "epoch !== renderEpoch", "force: true", "active !== document.body", "active !== document.documentElement"]) {
  if (!explorer.includes(token)) fail(`deferred focus ownership contract missing: ${token}`);
}
for (const token of ["let searchRenderFrame = 0", "function renderSearchResults", "data-relationship-results", "state.query !== value", "renderEpoch !== epoch"]) {
  if (!explorer.includes(token)) fail(`non-destructive explorer search contract missing: ${token}`);
}
for (const token of ["const bindClick = (selector, handler)", "if (element) element.onclick = handler"]) {
  if (!explorer.includes(token)) fail(`idempotent explorer event contract missing: ${token}`);
}
if (explorer.includes('.addEventListener("click"')) {
  fail("relationship explorer click handlers must remain idempotent across partial renders");
}
if (!releaseAudit.includes('connectionsTab.press("Enter")')) {
  fail("release audit connections activation contract missing");
}
for (const token of ['connections.press("Enter")', 'data-bio-review="connections"]\')).toHaveAttribute("aria-selected", "true")']) {
  if (!relationshipBrowser.includes(token)) fail(`explorer tab synchronization contract missing: ${token}`);
}
const lensImportBrowser = read("tests/lens-import-contract.spec.js");
for (const token of ["actors.press('Enter')", "data-bio-acc=\"actors_institutions\"", "aria-expanded"]) {
  if (!lensImportBrowser.includes(token)) fail(`legacy import pillar synchronization contract missing: ${token}`);
}
for (const token of ["requestAnimationFrame(() => container.querySelector", "requestAnimationFrame(() => container?.querySelector"]) {
  if (explorer.includes(token)) fail(`unguarded deferred focus path remains: ${token}`);
}
const reflowAudit = read("tests/reflow-audit.spec.js");
for (const token of ["equivalentZoom: 200", "equivalentZoom: 400", "undersizedTargets", 'locator("#topicInput").fill(locale.topic)', 'locator("#modalBackdrop")', "relationshipList [data-map-node]", 'connectionsTab.press("Enter")']) {
  if (!reflowAudit.includes(token)) fail(`RC reflow contract missing: ${token}`);
}
for (const token of ["flex:0 0 32px", "min-width:32px"]) {
  if (!explorerStyles.includes(token)) fail(`Firefox reflow target contract missing: ${token}`);
}
const visualAudit = read("tests/visual-audit-evidence.spec.js");
for (const token of ["screenshot_count: cases.length * SCREENSHOT_KINDS.length + reportCases.length", 'capture_set: "final-language-theme-viewport-audit"', "waitForVisualAssets", "clearTransientUi", "anchorViewport", "story_geometry", "standalone-report", 'viewport.id === "phone" ? "#relationshipExplorerMount"', 'locator(".relationshipStoryFlow").count() === 0', 'mapView.press("Enter")']) {
  if (!visualAudit.includes(token)) fail(`RC visual evidence contract missing: ${token}`);
}
for (const token of ["minmax(132px,1fr)", "overflow-x:auto", "scrollbar-width:thin", "scroll-snap-type:inline proximity"]) {
  if (!explorerStyles.includes(token)) fail(`story-path visibility contract missing: ${token}`);
}
for (const token of ["visual acceptance repair", ".navBtn.active .badge", "grid-template-columns:64px minmax(0,1fr)"]) {
  if (!styles.includes(token)) fail(`alpha.4 visual repair contract missing: ${token}`);
}
for (const token of ['rel="preload" as="image" href="assets/jarbou3i-mascot-512.png"', 'decoding="sync"']) {
  if (!index.includes(token)) fail(`critical visual asset contract missing: ${token}`);
}

if (index.includes('property="og:image"')) {
  fail("release shell must not advertise a missing relative social image");
}
if (index.includes('id="assistantSelect"') || app.includes("preferredAssistant")) {
  fail("non-functional assistant selector remains");
}
if (fs.existsSync("Editorial_Intelligence_v2.html") || fs.existsSync("TM_BrainMap.html")) {
  fail("legacy pages remain in the production root");
}
for (const archived of [
  "docs/archive/legacy-pages/Editorial_Intelligence_v2.html",
  "docs/archive/legacy-pages/TM_BrainMap.html",
]) {
  if (!fs.existsSync(archived)) fail(`legacy page was not archived: ${archived}`);
}

if (pkg.version !== "2.1.0-alpha.36") fail("package version mismatch");
if (lock.version !== pkg.version || lock.packages?.[""]?.version !== pkg.version) {
  fail("package lock version mismatch");
}
if (!index.includes('name="app-version" content="2.1.0-alpha.36"')) {
  fail("app version metadata missing");
}
if (!app.includes('"2.1.0-alpha.36"')) {
  fail("report fallback version is stale");
}
for (const token of [
  "createRelationshipIntelligence",
  "evidenceTrail(id)",
  "backReferences(id)",
  "resolveDeepLink(value)",
  "unresolvedEvidence",
  "unsupportedHighConfidence",
]) {
  if (!relationshipIntelligence.includes(token)) {
    fail(`Phase 4 relationship-intelligence contract missing: ${token}`);
  }
}
for (const token of [
  "createEvidenceIntelligence",
  "clusterIdentity",
  "missingIdentity",
  "uncitedEvidence",
  "missingCounterEvidence",
  "concentratedClusters",
]) {
  if (!evidenceIntelligence.includes(token)) fail(`Phase 4 source-cluster contract missing: ${token}`);
}
for (const token of [
  "createEvidenceTraceability",
  "jarbou3i-evidence-intelligence-v1",
  "canonical_transport: false",
  "claim_evidence_matrix",
  "authored_routes",
]) {
  if (!evidenceTraceability.includes(token)) fail(`Phase 4 traceability contract missing: ${token}`);
}
for (const token of ["evidenceTraceability", "exportIntelligence", "evidence-intelligence.json"]) {
  if (!app.includes(token)) fail(`Phase 4 traceability UI/export contract missing: ${token}`);
}
for (const token of [
  "createEvidenceReviewPlan",
  "jarbou3i-evidence-review-plan-v1",
  "completion_validates_conclusions: false",
  "resolve_references",
  "verify_provenance",
  "strengthen_coverage",
]) {
  if (!evidenceReviewPlan.includes(token)) fail(`Phase 4 review-plan contract missing: ${token}`);
}
for (const token of ["evidenceReviewQueue", "exportReviewPlan", "evidence-review-plan.json"]) {
  if (!app.includes(token)) fail(`Phase 4 review-plan UI/export contract missing: ${token}`);
}
for (const token of ["renderEvidenceIntelligence", "data-evidence-intelligence", "data-source-cluster", "data-evidence-gap"]) {
  if (!app.includes(token)) fail(`Phase 4 evidence-gap UI contract missing: ${token}`);
}
for (const token of [
  'data-inspection-section="evidence-trail"',
  "referencePermanentLink",
  'window.addEventListener("hashchange"',
]) {
  if (!referenceUi.includes(token)) fail(`Phase 4 evidence UI contract missing: ${token}`);
}
for (const token of [
  'class="scoreMetricCard',
  'class="metricHead"',
  'class="metricHint"',
]) {
  if (!app.includes(token)) fail(`shared score-card markup missing: ${token}`);
}
for (const obsolete of ['class="metricCard ', 'class="metricTop"']) {
  if (app.includes(obsolete)) fail(`obsolete unstyled score-card markup remains: ${obsolete}`);
}
for (const token of [
  "analysisLangFollowsUi",
  "settingsPatch.analysisLang = lang",
  "setAnalysisLanguage($(\"analysisLang\").value)",
]) {
  if (!app.includes(token)) fail(`sample-language linkage contract missing: ${token}`);
}
for (const token of [
  "createPlatformRuntime",
  "PLATFORM.registry",
  "PLATFORM.localization",
  "PLATFORM.state",
  "PLATFORM.renderer",
  "PLATFORM.performance.measure",
  "PLATFORM_RENDERER.renderAll()",
  "Jarbou3iPlatformDiagnostics",
  "Jarbou3iProvenance",
]) {
  if (!app.includes(token)) fail(`shared platform service missing: ${token}`);
}
if (!app.includes("const pref = PLATFORM.bootSettings.theme;")) {
  fail("platform boot settings are not used by theme initialization");
}
if (/\bsavedSettings\b/.test(app)) {
  fail("removed pre-platform settings binding was reintroduced");
}
if (!fs.existsSync("tests/sample-language-contract.spec.js")) {
  fail("sample-language browser contract is missing");
}
if (!bio.includes('const SCHEMA_VERSION = "2.1.0"')) {
  fail("biopolitical runtime schema version is stale");
}

for (const token of [
  "test:bio:integrity",
  "test:platform",
  "test:platform:services",
  "test:shell",
  "test:provenance",
  "test:bio:graph",
  "test:parser",
  "upgrade:layout",
  "test:layout:migration",
  "test:i18n:bio",
  "test:ci:no-browser",
  "test:browser:core",
  "test:browser:audit",
  "test:browser:reflow",
  "test:browser:visual-audit",
  "test:evidence:visual-audit",
]) {
  if (!pkg.scripts?.[token]) fail(`package script missing: ${token}`);
}

console.log("Static checks passed.");
