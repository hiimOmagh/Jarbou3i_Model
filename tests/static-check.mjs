import fs from "node:fs";
import vm from "node:vm";

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
const parser = read("src/json-parser.js");
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
  ["src/relationship-explorer.js", explorer],
  ["src/json-parser.js", parser],
]) {
  try {
    new vm.Script(source, { filename: file });
  } catch (error) {
    fail(`${file}: ${error.message}`);
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
if (!index.includes('src/biopolitical-report.js')) {
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
const styles = read("src/styles.css");
for (const token of ["@media (forced-colors:active)", ":focus,:focus-visible", "color-scheme:light", "HighlightText", "translateY(calc(100% + 48px))"]) {
  if (!styles.includes(token)) fail(`final audit visual resilience contract missing: ${token}`);
}
const releaseAudit = read("tests/release-audit-matrix.spec.js");
for (const token of ['matchMedia("print").matches', "expect.poll"]) {
  if (!releaseAudit.includes(token)) fail(`final audit synchronization contract missing: ${token}`);
}
const relationshipBrowser = read("tests/relationship-explorer.spec.js");
for (const token of ['requestAnimationFrame(resolve)', 'expect(saveView).toBeFocused()', 'saveView.press("Enter")', 'restoreView.press("Enter")', 'openSelected.press("Enter")']) {
  if (!relationshipBrowser.includes(token)) fail(`Firefox explorer stabilization contract missing: ${token}`);
}
for (const token of ["function focusAfterRender", "epoch !== renderEpoch", "force: true", "active !== document.body", "active !== document.documentElement"]) {
  if (!explorer.includes(token)) fail(`deferred focus ownership contract missing: ${token}`);
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
for (const token of ["screenshot_count: cases.length * 2", 'capture_set: "final-language-theme-viewport-audit"', "waitForVisualAssets", "clearTransientUi", "rect.top >= window.innerHeight", 'viewport.id === "phone" ? "#relationshipExplorerMount"']) {
  if (!visualAudit.includes(token)) fail(`RC visual evidence contract missing: ${token}`);
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

if (pkg.version !== "2.0.0-bio-rc.17") fail("package version mismatch");
if (lock.version !== pkg.version || lock.packages?.[""]?.version !== pkg.version) {
  fail("package lock version mismatch");
}
if (!index.includes('name="app-version" content="2.0.0-bio-rc.17"')) {
  fail("app version metadata missing");
}
if (!app.includes('"2.0.0-bio-rc.17"')) {
  fail("report fallback version is stale");
}
for (const token of [
  "analysisLangFollowsUi",
  "settingsPatch.analysisLang = lang",
  "setAnalysisLanguage($(\"analysisLang\").value)",
]) {
  if (!app.includes(token)) fail(`sample-language linkage contract missing: ${token}`);
}
if (!fs.existsSync("tests/sample-language-contract.spec.js")) {
  fail("sample-language browser contract is missing");
}
if (!bio.includes('const SCHEMA_VERSION = "2.1.0"')) {
  fail("biopolitical runtime schema version is stale");
}

for (const token of [
  "test:bio:integrity",
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
