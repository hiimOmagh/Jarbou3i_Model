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
  "test:bio:v2",
  "test:bio:integrity",
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
if (pkg.scripts?.["test:browser:reflow"] !== "playwright test tests/reflow-audit.spec.js") {
  fail("dedicated reflow audit script is missing");
}
const visualAudit = pkg.scripts?.["test:browser:visual-audit"] || "";
for (const token of ["tests/visual-audit-evidence.spec.js", "--project=chromium", "--workers=1", "npm run test:evidence:visual-audit"]) {
  if (!visualAudit.includes(token)) fail(`visual audit script is missing ${token}`);
}
if (pkg.scripts?.["test:browser:audit"] !== "playwright test tests/release-audit-matrix.spec.js") {
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
if (pkg.scripts?.test !== "npm run test:ci") {
  fail("default npm test must execute the complete CI contract");
}

for (const token of [
  "PLAYWRIGHT_WORKERS",
  "const DEFAULT_BROWSER_WORKERS = 4;",
  "timeout: 60_000",
  "expect: { timeout: 10_000 }",
  "workers: workerCount",
]) {
  if (!playwright.includes(token)) {
    fail(`Playwright resource contract is missing: ${token}`);
  }
}

for (const token of [
  "name: No-browser gates",
  "name: Browser gates",
  "needs: no-browser",
  "node-version: 20",
  "cache: npm",
  "npm ci",
  "npm run test:ci:no-browser",
  "npx playwright install --with-deps",
  "npm run test:ci:browser",
  "HOSTED_DEMO_EVIDENCE_DIR: hosted-demo-evidence",
  "VISUAL_AUDIT_EVIDENCE_DIR: visual-audit-evidence",
  "name: visual-audit-evidence",
  "actions/upload-artifact@v4",
]) {
  if (!workflow.includes(token)) fail(`workflow is missing: ${token}`);
}
for (const forbidden of ["pnpm", "corepack", "--no-frozen-lockfile"]) {
  if (workflow.includes(forbidden)) {
    fail(`workflow mixes package-manager contracts: ${forbidden}`);
  }
}

if (pkg.version !== "2.0.0-bio-rc.11") {
  fail("package version must be 2.0.0-bio-rc.11");
}

console.log("CI script contract check passed.");
