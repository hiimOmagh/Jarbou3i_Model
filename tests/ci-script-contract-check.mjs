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
  "test:qa",
  "test:static",
  "test:platform",
  "test:platform:services",
  "test:platform:runtime",
  "test:shell",
  "test:shell:navigation",
  "test:results:orientation",
  "test:results:explanation",
  "test:results:inspection",
  "test:relationship:intelligence",
  "test:evidence:intelligence",
  "test:evidence:traceability",
  "test:performance",
  "test:bio:v2",
  "test:bio:integrity",
  "test:bio:report",
  "test:schema",
  "test:fixtures",
  "test:parser",
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

const core = pkg.scripts?.["test:browser:core"] || "";
for (const spec of [
  "tests/results-workspace.spec.js",
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
  "name: Browser gates",
  "needs: no-browser",
  "actions/checkout@v5",
  "actions/setup-node@v5",
  "node-version: 24",
  "cache: npm",
  "npm ci",
  "npm run test:ci:no-browser",
  "npx playwright install --with-deps",
  "npm run test:ci:browser",
  "HOSTED_DEMO_EVIDENCE_DIR: hosted-demo-evidence",
  "VISUAL_AUDIT_EVIDENCE_DIR: visual-audit-evidence",
  "PLAYWRIGHT_WORKERS: 2",
  "name: visual-audit-evidence",
  "name: browser-debug",
  "failure() && hashFiles('test-results/**', 'playwright-report/**') != ''",
  "actions/upload-artifact@v5",
]) {
  if (!workflow.includes(token)) fail(`workflow is missing: ${token}`);
}
for (const forbidden of ["pnpm", "corepack", "--no-frozen-lockfile"]) {
  if (workflow.includes(forbidden)) {
    fail(`workflow mixes package-manager contracts: ${forbidden}`);
  }
}

if (pkg.version !== "2.1.0-alpha.32") {
  fail("package version must be 2.1.0-alpha.32");
}
if (pkg.devDependencies?.["@playwright/test"] !== "1.61.1") {
  fail("@playwright/test must remain pinned to 1.61.1");
}

console.log("CI script contract check passed.");
