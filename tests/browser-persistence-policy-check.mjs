import fs from "node:fs";

const fail = (message) => {
  console.error(`Browser persistence policy check failed: ${message}`);
  process.exit(1);
};
const read = (file) => fs.readFileSync(file, "utf8");
const helper = read("tests/helpers/browser-persistence.js");
const playwright = read("playwright.config.js");
const revision = read("tests/revision-history.spec.js");
const ledger = read("tests/review-ledger.spec.js");

for (const token of [
  "INDEXED_DB_OPERATION_TIMEOUT_MS = 10_000",
  '"review-ledger-persistence-staleness"',
  '"revision-history-dirty-localization"',
  "webkitTimeoutMs: 90_000",
  "webkitDurationBudgetMs: 80_000",
  "defaultTimeoutMs: 60_000",
  "defaultDurationBudgetMs: 55_000",
  "test.setTimeout(timeoutMs)",
  "transaction.onerror",
  "transaction.onabort",
  "request.onerror",
  "emptyDatabaseResult",
  "finish(null, emptyDatabaseResult)",
  "could not inspect empty database creation",
  "could not abort empty database creation",
  "long-workflow-budget",
  "long-workflow-duration.json",
]) {
  if (!helper.includes(token)) fail(`bounded helper is missing ${token}`);
}

for (const [file, source, workflow] of [
  [
    "tests/review-ledger.spec.js",
    ledger,
    "review-ledger-persistence-staleness",
  ],
  [
    "tests/revision-history.spec.js",
    revision,
    "revision-history-dirty-localization",
  ],
]) {
  if (
    !source.includes("beginLongPersistenceWorkflow(")
    || !source.includes(`"${workflow}"`)
  ) {
    fail(`${file} is not registered under ${workflow}`);
  }
  if (!source.includes("await finishLongWorkflow();")) {
    fail(`${file} does not enforce its measured duration budget`);
  }
}

for (const file of fs.readdirSync("tests").filter((name) => name.endsWith(".spec.js"))) {
  const source = read(`tests/${file}`);
  if (source.includes("indexedDB.")) {
    fail(`${file} bypasses the bounded browser persistence helper`);
  }
}
const longWorkflowRegistrations = fs.readdirSync("tests")
  .filter((name) => name.endsWith(".spec.js"))
  .reduce(
    (count, file) =>
      count + (read(`tests/${file}`).match(/beginLongPersistenceWorkflow\(/g) || []).length,
    0,
  );
if (longWorkflowRegistrations !== 2) {
  fail(`expected exactly two scoped long-workflow registrations, found ${longWorkflowRegistrations}`);
}

for (const token of [
  "timeout: 60_000",
  "retries: process.env.CI ? 1 : 0",
  "failOnFlakyTests: Boolean(process.env.CI)",
]) {
  if (!playwright.includes(token)) {
    fail(`global Playwright strictness changed: ${token}`);
  }
}

console.log("Browser persistence policy check passed.");
