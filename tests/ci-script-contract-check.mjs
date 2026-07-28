import fs from "node:fs";

const fail = (message) => {
  console.error(`CI script contract check failed: ${message}`);
  process.exit(1);
};
const read = (file) => fs.readFileSync(file, "utf8");
const pkg = JSON.parse(read("package.json"));
const workflow = read(".github/workflows/ci.yml");
const playwright = read("playwright.config.js");

const noBrowser = pkg.scripts?.["test:ci:no-browser"] || "";
for (const gate of [
  "build:validator",
  "test:version-authority",
  "test:qa",
  "test:static",
  "test:platform",
  "test:platform:services",
  "test:platform:runtime",
  "test:workspace",
  "test:shell",
  "test:shell:navigation",
  "test:results:orientation",
  "test:results:explanation",
  "test:results:inspection",
  "test:relationship:intelligence",
  "test:evidence:intelligence",
  "test:evidence:traceability",
  "test:evidence:review-plan",
  "test:performance",
  "test:bio:v2",
  "test:bio:integrity",
  "test:bio:report",
  "test:schema",
  "test:fixtures",
  "test:parser",
  "test:ai-interchange",
  "test:layout:migration",
  "test:i18n:bio",
  "test:a11y:static",
  "test:ci:contract",
  "test:hygiene",
]) {
  if (!noBrowser.includes(`npm run ${gate}`)) {
    fail(`test:ci:no-browser is missing ${gate}`);
  }
}
if (pkg.scripts?.["upgrade:layout"] !== "node scripts/migrate-release-layout.mjs") {
  fail("upgrade:layout must execute the guarded release-layout migration");
}
if (pkg.scripts?.["build:pages"] !== "node scripts/build-pages-artifact.mjs") {
  fail("build:pages must execute the explicit deployment-artifact builder");
}

const core = pkg.scripts?.["test:browser:core"] || "";
for (const spec of [
  "tests/results-workspace.spec.js",
  "tests/workspace-foundation.spec.js",
  "tests/canonical-editor.spec.js",
  "tests/ai-interchange-reliability.spec.js",
  "tests/results-explanation.spec.js",
  "tests/results-inspection.spec.js",
  "tests/evidence-intelligence.spec.js",
  "tests/a11y.spec.js",
  "tests/smoke.spec.js",
  "tests/rtl-mobile.spec.js",
  "tests/export-contract.spec.js",
  "tests/export-completeness.spec.js",
  "tests/lens-import-contract.spec.js",
  "tests/import-validation.spec.js",
  "tests/cross-locale-export-contract.spec.js",
  "tests/sample-language-contract.spec.js",
  "tests/release-audit-matrix.spec.js",
  "tests/reflow-audit.spec.js",
]) {
  if (!core.includes(spec)) fail(`browser core is missing ${spec}`);
}
if (pkg.scripts?.["test:browser:reflow"] !== "node scripts/run-playwright.mjs tests/reflow-audit.spec.js") {
  fail("dedicated reflow audit script is missing");
}
const visualAudit = pkg.scripts?.["test:browser:visual-audit"] || "";
for (const token of ["tests/visual-audit-evidence.spec.js", "--project=chromium", "--workers=1", "npm run test:evidence:visual-audit"]) {
  if (!visualAudit.includes(token)) fail(`visual audit script is missing ${token}`);
}
if (pkg.scripts?.["test:browser:audit"] !== "node scripts/run-playwright.mjs tests/release-audit-matrix.spec.js") {
  fail("dedicated browser audit script is missing");
}
const hosted = pkg.scripts?.["test:browser:hosted"] || "";
for (const token of [
  "tests/hosted-demo-evidence.spec.js",
  "--project=chromium",
  "--project=mobile-chrome",
  "--workers=1",
  "npm run test:evidence:hosted",
]) {
  if (!hosted.includes(token)) fail(`hosted browser script is missing ${token}`);
}
const deployed = pkg.scripts?.["test:browser:deployed"] || "";
for (const token of ["scripts/require-deployed-base-url.mjs", "npm run test:browser:hosted"]) {
  if (!deployed.includes(token)) fail(`deployed browser gate is missing ${token}`);
}
const deployedGuard = fs.readFileSync("scripts/require-deployed-base-url.mjs", "utf8");
for (const token of ["PLAYWRIGHT_BASE_URL", "new URL", "HTTP or HTTPS"]) {
  if (!deployedGuard.includes(token)) fail(`deployed target guard is missing ${token}`);
}
if (pkg.scripts?.test !== "npm run test:ci") {
  fail("default npm test must execute the complete CI contract");
}

for (const token of [
  "PLAYWRIGHT_MANAGED_BASE_URL",
  "command: 'node scripts/static-server.mjs'",
  "PLAYWRIGHT_WORKERS",
  "const DEFAULT_BROWSER_WORKERS = 4;",
  "timeout: 60_000",
  "expect: { timeout: 10_000 }",
  "workers: workerCount",
  "failOnFlakyTests: Boolean(process.env.CI)",
  "const reuseLocalServer = process.env.PLAYWRIGHT_REUSE_SERVER === '1';",
  "reuseExistingServer: reuseLocalServer",
]) {
  if (!playwright.includes(token)) {
    fail(`Playwright resource contract is missing: ${token}`);
  }
}
const managedRunner = read("scripts/run-playwright.mjs");
for (const token of ["availablePort", "PLAYWRIGHT_MANAGED_BASE_URL", "finally", "stopServer(server)", "playwrightCli"]) {
  if (!managedRunner.includes(token)) fail(`managed Playwright runner is missing: ${token}`);
}
for (const script of ["test:browser:core", "test:browser:hosted", "test:browser:visual-audit"]) {
  if (!pkg.scripts?.[script]?.includes("node scripts/run-playwright.mjs")) {
    fail(`${script} must use the managed Playwright runner`);
  }
}
if ((playwright.match(/channel: 'chromium'/g) || []).length !== 2) {
  fail("desktop and mobile Chromium projects must use new headless mode");
}

for (const token of [
  "name: No-browser gates",
  "name: Browser core (${{ matrix.label }})",
  "name: Browser evidence",
  "name: Browser gates",
  "needs: no-browser",
  "fail-fast: false",
  "- label: chromium",
  "- label: firefox",
  "- label: webkit shard 1 of 2",
  "- label: webkit shard 2 of 2",
  "- label: mobile-chrome",
  'shard: "1/2"',
  'shard: "2/2"',
  "artifact: webkit-1-of-2",
  "artifact: webkit-2-of-2",
  "actions/checkout@v5",
  "actions/setup-node@v5",
  "node-version: 24",
  "cache: npm",
  "npm ci",
  "npm run test:ci:no-browser",
  "npx playwright install --with-deps ${{ matrix.browser }}",
  "npx playwright install --with-deps chromium",
  "npm run test:browser:core --",
  "--project=${{ matrix.project }}",
  "--shard=${{ matrix.shard }}",
  "--workers=2",
  "npm run test:browser:hosted",
  "npm run test:browser:visual-audit",
  "HOSTED_DEMO_EVIDENCE_DIR: hosted-demo-evidence",
  "VISUAL_AUDIT_EVIDENCE_DIR: visual-audit-evidence",
  "name: visual-audit-evidence",
  "name: browser-debug-${{ matrix.artifact }}",
  "name: browser-evidence-debug",
  "failure() && hashFiles('test-results/**', 'playwright-report/**') != ''",
  "if: ${{ always() }}",
  "CORE_RESULT: ${{ needs.browser-core.result }}",
  "EVIDENCE_RESULT: ${{ needs.browser-evidence.result }}",
  'test "$CORE_RESULT" = "success"',
  'test "$EVIDENCE_RESULT" = "success"',
  "actions/upload-artifact@v7",
  "permissions:",
  "contents: read",
  "concurrency:",
  "timeout-minutes:",
  "name: Deploy accepted GitHub Pages build",
  "needs: browser",
  "pages: write",
  "id-token: write",
  "node scripts/build-pages-artifact.mjs",
  "actions/configure-pages@v6",
  "actions/upload-pages-artifact@v5",
  "actions/deploy-pages@v5",
]) {
  if (!workflow.includes(token)) fail(`workflow is missing: ${token}`);
}
for (const retiredAction of [
  "actions/upload-artifact@v5",
  "actions/upload-artifact@v6",
  "actions/configure-pages@v5",
  "actions/upload-pages-artifact@v4",
  "actions/deploy-pages@v4",
]) {
  if (workflow.includes(retiredAction)) {
    fail(`workflow retains a retired action runtime: ${retiredAction}`);
  }
}
if ((workflow.match(/actions\/upload-artifact@v7/g) || []).length !== 4) {
  fail("workflow must use upload-artifact@v7 for exactly four artifact steps");
}
if ((workflow.match(/project: webkit/g) || []).length !== 2) {
  fail("WebKit must be represented by exactly two core shards");
}
if ((workflow.match(/project: chromium/g) || []).length !== 1) {
  fail("desktop Chromium must be represented by exactly one core matrix leg");
}
if ((workflow.match(/project: firefox/g) || []).length !== 1) {
  fail("Firefox must be represented by exactly one core matrix leg");
}
if ((workflow.match(/project: mobile-chrome/g) || []).length !== 1) {
  fail("mobile Chromium must be represented by exactly one core matrix leg");
}
for (const forbidden of [
  "run: npm run test:ci:browser",
  "PLAYWRIGHT_WORKERS: 2",
  "name: browser-debug\n",
  "name: Browser core (${{ matrix.project }})",
  "name: browser-debug-${{ matrix.project }}",
]) {
  if (workflow.includes(forbidden)) {
    fail(`workflow retains the monolithic browser topology: ${forbidden.trim()}`);
  }
}

const absoluteRootNavigation = [];
for (const file of fs.readdirSync("tests").filter((name) => name.endsWith(".spec.js"))) {
  const source = read(`tests/${file}`);
  if (/page\.goto\(\s*["']\/["']\s*\)/.test(source)) absoluteRootNavigation.push(file);
}
if (absoluteRootNavigation.length) {
  fail(`browser specs must preserve a deployed base path: ${absoluteRootNavigation.join(", ")}`);
}
for (const forbidden of ["pnpm", "corepack", "--no-frozen-lockfile"]) {
  if (workflow.includes(forbidden)) {
    fail(`workflow mixes package-manager contracts: ${forbidden}`);
  }
}

if (pkg.devDependencies?.["@playwright/test"] !== "1.61.1") {
  fail("@playwright/test must remain pinned to 1.61.1");
}

console.log("CI script contract check passed.");
