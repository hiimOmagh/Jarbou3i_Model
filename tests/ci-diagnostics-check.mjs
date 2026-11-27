// Regression: losing the JSON reporter, first-failure trace, or fail-on-flaky
// would discard evidence or accept a retry-recovered failure.
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, readFileSync, existsSync, rmSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = fileURLToPath(new URL('../', import.meta.url));
const scratch = mkdtempSync(join(root, '.ci-diagnostics-'));
try {
  const report = join(scratch, 'attempts.json');
  writeFileSync(join(scratch, 'probe.spec.js'), `
import { test, expect } from '@playwright/test';
test('controlled fail then pass', async ({ page }, info) => {
  await page.setContent('<p>diagnostic probe</p>');
  expect(info.retry, 'controlled first-attempt failure').toBe(1);
});
`);
  writeFileSync(join(scratch, 'config.js'), `
import config from '../playwright.config.js';
export default { ...config, testDir: ${JSON.stringify(scratch)},
  testMatch: 'probe.spec.js', webServer: undefined, workers: 1,
  outputDir: ${JSON.stringify(join(scratch, 'results'))},
  projects: config.projects.filter(p => p.name === 'chromium') };
`);
  const run = spawnSync(process.execPath, [resolve(root, 'node_modules/@playwright/test/cli.js'),
    'test', '--config', join(scratch, 'config.js')], {
    cwd: root, encoding: 'utf8', timeout: 90_000,
    env: { ...process.env, CI: '1', PLAYWRIGHT_JSON_OUTPUT_NAME: report,
      PLAYWRIGHT_HTML_OUTPUT_DIR: join(scratch, 'html') }
  });
  assert.ifError(run.error);
  assert.ok(existsSync(report), `Missing attempt report. Exit ${run.status}\n${run.stdout}\n${run.stderr}`);
  const data = JSON.parse(readFileSync(report, 'utf8'));
  const tests = [];
  function collect(suite) {
    for (const spec of suite.specs ?? []) tests.push(...spec.tests);
    for (const child of suite.suites ?? []) collect(child);
  }
  data.suites.forEach(collect);
  assert.equal(tests.length, 1);
  assert.equal(tests[0].status, 'flaky');
  assert.deepEqual(tests[0].results.map(r => [r.retry, r.status]), [[0, 'failed'], [1, 'passed']]);
  const first = tests[0].results[0];
  const trace = first.attachments.find(a => a.name === 'trace');
  assert.ok(trace && existsSync(trace.path), 'First failure trace must be retained');
  assert.equal(readFileSync(trace.path).subarray(0, 2).toString(), 'PK');
  assert.ok(first.errors.some(e => e.message.includes('controlled first-attempt failure')));
  assert.equal(run.status, 1, 'Retry-recovered CI failure must remain red');
  console.log('PASS: CI probe ran in Chromium with the repository config');
  console.log('PASS: attempt 0 failed; attempt 1 passed; exactly two records retained');
  console.log('PASS: first-failure trace ZIP retained');
  console.log('PASS: flaky CI probe exited 1');
} finally {
  rmSync(scratch, { recursive: true, force: true });
}
