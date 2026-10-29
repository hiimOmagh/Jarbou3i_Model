import fs from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";

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
const styles = read("src/styles.css");
// The modern shell (UIX-2) is styled by the kernel and its own sheet.
const shellStyles = read("src/ui/kernel.css") + read("src/ui/shell.css");
const parser = read("src/json-parser.js");
const aiInterchange = read("src/ai-interchange.js");
const platformState = read("src/core/platform-state.js");
const shellPreferences = read("src/core/shell-preferences.js");
const shellNavigation = read("src/core/shell-navigation.js");
const applicationShell = read("src/features/application-shell.js");
const resultsOrientation = read("src/core/results-orientation.js");
const resultsExplanation = read("src/core/results-explanation.js");
const resultsInspection = read("src/core/results-inspection.js");
const relationshipIntelligence = read("src/core/relationship-intelligence.js");
const evidenceIntelligence = read("src/core/evidence-intelligence.js");
const evidenceTraceability = read("src/core/evidence-traceability.js");
const evidenceReviewPlan = read("src/core/evidence-review-plan.js");
const revisionHistory = read("src/core/revision-history.js");
const reviewLedger = read("src/core/review-ledger.js");
const persistence = read("src/core/persistence.js");
const localization = read("src/core/localization.js");
const renderRegions = read("src/core/render-regions.js");
const provenance = read("src/core/provenance.js");
const validator = read("src/biopolitics-schema-validator.js");
const pkg = JSON.parse(read("package.json"));
const lock = JSON.parse(read("package-lock.json"));

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
  ["src/json-parser.js", parser],
  ["src/ai-interchange.js", aiInterchange],
  ["src/core/platform-state.js", platformState],
  ["src/core/shell-preferences.js", shellPreferences],
  ["src/core/shell-navigation.js", shellNavigation],
  ["src/features/application-shell.js", applicationShell],
  ["src/core/results-orientation.js", resultsOrientation],
  ["src/core/results-explanation.js", resultsExplanation],
  ["src/core/results-inspection.js", resultsInspection],
  ["src/core/relationship-intelligence.js", relationshipIntelligence],
  ["src/core/evidence-intelligence.js", evidenceIntelligence],
  ["src/core/evidence-traceability.js", evidenceTraceability],
  ["src/core/revision-history.js", revisionHistory],
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
if (index.length > 50_000) fail("index.html must remain a thin shell");
if (!index.includes('<script type="module" src="src/app.js"></script>')) fail("native module entry point is missing");
// The runtime's side-effect imports load in dependency order.
const importOrder = [
  "biopolitics-schema-validator.js",
  "strategic-schema-validator.js",
  "biopolitics-sample-i18n.js",
  "core/provenance.js",
  "biopolitics.js",
  "biopolitics-integrity.js",
  "reference-ui.js",
  "json-parser.js",
].map((file) => app.indexOf(`import "./${file}";`));
if (importOrder.some((position) => position < 0)) fail("runtime side-effect import is missing");
if (importOrder.some((position, i) => i && position <= importOrder[i - 1])) {
  fail("runtime side-effect imports load in an unsafe order");
}
if (validator.includes("require(")) fail("browser validator contains CommonJS imports");

for (const file of [
  "schema/biopolitical-analysis.schema.json",
  "schema/biopolitical-migrated-draft.schema.json",
  "schema/biopolitical-generated-draft.schema.json",
  "schema/ai-interchange-v1.schema.json",
  "tests/biopolitical-integrity-check.mjs",
  "tests/biopolitical-graph-check.mjs",
  "tests/biopolitical-report-check.mjs",
  "tests/reference-resolution.spec.js",
  "tests/connections-view.spec.js",
  "tests/json-parser-check.mjs",
  "tests/ai-interchange-reliability-check.mjs",
  "tests/ai-interchange-reliability.spec.js",
  "docs/ai-interchange-contract-v1.md",
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
  "tests/revision-history-check.mjs",
  "tests/revision-history.spec.js",
  "docs/operations/manual-release-review.md",
]) {
  if (!fs.existsSync(file)) fail(`missing audit regression file: ${file}`);
}
for (const token of [
  'id="revisionBackdrop"',
  'id="revisionDialog"',
  'id="revisionList"',
  'id="revisionDiff"',
  'id="revisionRestore"',
]) {
  if (!index.includes(token)) fail(`Alpha.55 revision-history UI token missing: ${token}`);
}
for (const token of [
  "projectRevisionHistory",
  "compareRevisions",
  "prepareRevisionRestore",
  "revision_restore",
]) {
  if (!revisionHistory.includes(token) && !app.includes(token)) {
    fail(`Alpha.55 revision-history integration token missing: ${token}`);
  }
}

for (const token of [
  'role="radiogroup"',
  'role="radio"',
  'aria-checked="true"',
  // The review is a case file named by its title: a labelled outline beside
  // one document.
  'id="reviewPanel" aria-labelledby="reviewTitle"',
  'class="j-case-outline" id="reviewNav"',
  'id="reviewContent" tabindex="-1"',
  'aria-modal="true"',
]) {
  if (!index.includes(token)) fail(`index accessibility token missing: ${token}`);
}
for (const token of [
  'class="j-skip"',
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
  "createApplicationShell",
  "APPLICATION_SHELL.render()",
  "APPLICATION_SHELL.bind()",
  "state.shellSection = \"review\"",
]) {
  if (!app.includes(token)) fail(`Phase 2 shell composition token missing: ${token}`);
}
for (const token of [
  "createShellPreferences",
  "function render()",
  "function navigate(",
  "function bind()",
  "resolveShellCommand",
  'renderRegion("shell")',
]) {
  if (!applicationShell.includes(token)) {
    fail(`Phase 2 shell feature token missing: ${token}`);
  }
}
if (!styles.includes('body[data-density="compact"]')) fail('Phase 2 shell stylesheet token missing: body[data-density="compact"]');
if (!shellStyles.includes(".j-skip:focus")) fail("Phase 2 shell stylesheet token missing: .j-skip:focus");
// The current phase is marked by more than colour, controls keep a 44px
// target (icon-only on phones too), and the next action is the one primary.
for (const token of [
  '.j-shell-phase[aria-current="step"] .j-shell-phase-index',
  "--j-control: 44px",
  ".j-shell-cluster .j-btn { min-width: var(--j-control)",
  '[data-density="compact"] .j-shell-top',
  ".j-shell-next",
]) {
  if (!shellStyles.includes(token)) fail(`modern shell token missing: ${token}`);
}
for (const token of [
  'class="j-root j-shell" id="appShell"',
  'id="shellNextAction"',
  'data-variant="primary" id="shellNextAction"',
  '<link rel="stylesheet" href="src/ui/shell.css" />',
]) {
  if (!index.includes(token)) fail(`modern shell markup token missing: ${token}`);
}
for (const token of [
  // The case-file outline marks where the reader is.
  '"aria-current", "location"',
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
if (app.includes('import "./biopolitical-report.js";')) {
  fail("standalone report renderer still has an eager side-effect import");
}
for (const token of ["@media (forced-colors:active)", ":focus,:focus-visible", "color-scheme:light", "HighlightText"]) {
  if (!styles.includes(token)) fail(`final audit visual resilience contract missing: ${token}`);
}
// A closed toast waits below the view, still a live region.
if (!shellStyles.includes('.j-toast[data-open="false"]')) fail("final audit visual resilience contract missing: the closed toast");
if (app.includes('import "./biopolitics-graph.js";')) {
  fail("biopolitical graph still has an eager side-effect import");
}
for (const token of [
  '"./biopolitics-graph.js"',
  "biopoliticalGraphPromise",
  "loadBiopoliticalGraph",
  "biopoliticalGraph.attempts",
  "data-retry-biopolitical-graph",
]) {
  if (!app.includes(token)) fail(`biopolitical graph capability loader missing: ${token}`);
}
for (const token of [
  '"./biopolitical-report.js"',
  "biopoliticalReportRendererPromise",
  "biopoliticalReportRenderer.attempts",
  "data-retry-biopolitical-report",
  "buildLosslessBiopoliticalReport(renderer)",
]) {
  if (!app.includes(token)) fail(`report renderer capability loader missing: ${token}`);
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
const briefStyles = read("src/ui/brief.css");
for (const token of [".j-brief-gate", ".j-brief-claim", ".j-brief-figures", ".j-brief-signals", ".j-diag-fold"]) {
  if (!briefStyles.includes(token)) fail(`Phase 3 results-orientation style token missing: ${token}`);
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
for (const token of [".j-brief-steps", ".j-brief-items", ".j-brief-open"]) {
  if (!briefStyles.includes(token)) fail(`Phase 3 results-explanation style token missing: ${token}`);
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
  'inspection: () => renderInspectionDirectory(',
]) {
  if (!app.includes(token)) fail(`Phase 3 inspection runtime token missing: ${token}`);
}
for (const token of [
  "data-inspection-section=\"provenance\"",
  "data-inspection-section=\"evidence\"",
  "data-inspection-section=\"audit\"",
  "data-reference-occurrence",
  "onOpenOccurrence",
  "if (!isOpen(rootElement)) returnFocus",
]) {
  if (!referenceUi.includes(token)) fail(`Phase 3 inspector interaction token missing: ${token}`);
}
const inspectionStyles = read("src/ui/evidence.css") + read("src/ui/section.css");
for (const token of [".j-idir", ".j-idir-head", ".j-stats"]) {
  if (!inspectionStyles.includes(token)) fail(`Phase 3 inspection style token missing: ${token}`);
}
const referenceStyles = read("src/ui/reference.css");
for (const token of [".j-insp-sec", ".j-insp-occ", ".j-insp-pair", ".j-ref"]) {
  if (!referenceStyles.includes(token)) fail(`Phase 3 inspection style token missing: ${token}`);
}
if (/html,body\{[^}]*scroll-behavior:smooth/.test(styles)) {
  fail("global smooth scrolling must not block browser actionability scrolling");
}
const staticServer = read("scripts/static-server.mjs");
for (const token of ["const parentPid = process.ppid", "process.kill(parentPid, 0)", "process.once(\"SIGTERM\", shutdown)"]) {
  if (!staticServer.includes(token)) fail(`static server lifecycle contract missing: ${token}`);
}
for (const token of ['rel="preload" as="image" href="assets/jarbou3i-mascot-192.png"', 'decoding="sync"']) {
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
for (const token of ["data-evidence-traceability", "exportIntelligence", "evidence-intelligence.json"]) {
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
for (const token of ["data-evidence-review-queue", "exportReviewPlan", "evidence-review-plan.json"]) {
  if (!app.includes(token)) fail(`Phase 4 review-plan UI/export contract missing: ${token}`);
}
for (const token of [
  "jarbou3i-operational-review-ledger",
  "previous_event_hash",
  "draft_checksum",
  "identity_assurance",
  "task_waived",
  "task_reopened",
  "completion_validates_conclusions",
]) {
  if (!reviewLedger.includes(token)) fail(`Phase 5 review-ledger contract missing: ${token}`);
}
for (const token of ["openReviewLedger", "ledgerReviewer", "ledgerWaiverScope", "exportReviewLedger"]) {
  if (!app.includes(token)) fail(`Phase 5 review-ledger UI contract missing: ${token}`);
}
for (const token of ["renderEvidenceIntelligence", "data-evidence-intelligence", "data-source-cluster", "data-evidence-gap"]) {
  if (!app.includes(token)) fail(`Phase 4 evidence-gap UI contract missing: ${token}`);
}
for (const token of [
  'data-inspection-section="evidence-trail"',
  "data-permanent-link",
  'window.addEventListener("hashchange"',
]) {
  if (!referenceUi.includes(token)) fail(`Phase 4 evidence UI contract missing: ${token}`);
}
for (const token of ['<div data-metric="', 'class="j-brief-figures" data-layout="grid" data-diagnostic="scores"']) {
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
  "test:i18n:bio",
  "test:version-authority",
  "test:ci:no-browser",
  "test:browser:core",
  "test:browser:audit",
  "test:browser:reflow",
  "test:browser:visual-audit",
  "test:review-ledger",
  "test:browser:review-ledger",
  "test:evidence:visual-audit",
]) {
  if (!pkg.scripts?.[token]) fail(`package script missing: ${token}`);
}

// labelText(en, ar) without a French argument falls back to its French map,
// then to English; every such label needs a French form.
{
  const start = app.indexOf("function labelText(en, ar, fr) {");
  const frMap = app.slice(start, app.indexOf("  };", start));
  for (const match of app.replace(/\r?\n\s*/g, " ").matchAll(/labelText\(\s*"([^"]+)",\s*"[^"]*"\s*,?\s*\)/g)) {
    if (!frMap.includes(`"${match[1]}":`) && !frMap.includes(` ${match[1]}:`)) {
      fail(`labelText "${match[1]}" has no French form`);
    }
  }
}

// index.html preloads every module the app imports at start, and only those:
// the browser then fetches them all at once, not one level of imports at a time.
{
  const startModules = new Set();
  const walk = (file) => {
    if (startModules.has(file)) return;
    startModules.add(file);
    for (const [, specifier] of read(file).matchAll(/^\s*import\s+(?:[^"']*?from\s+)?["'](\.[^"']+)["']/gm)) {
      walk(path.posix.join(path.posix.dirname(file), specifier));
    }
  };
  walk("src/app.js");
  startModules.delete("src/app.js");
  const preloaded = [...index.matchAll(/<link rel="modulepreload" href="([^"]+)"/g)].map(([, href]) => href);
  const missing = [...startModules].filter((file) => !preloaded.includes(file));
  const extra = preloaded.filter((file) => !startModules.has(file));
  if (missing.length) fail(`index.html does not preload ${missing.join(", ")}`);
  if (extra.length || preloaded.length !== startModules.size) fail(`index.html preloads what the app does not import at start: ${extra.join(", ") || "a module twice"}`);
}

console.log("Static checks passed.");
