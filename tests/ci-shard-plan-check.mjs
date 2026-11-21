import assert from 'node:assert/strict';
import { projects, plan, coreFiles, coverage, checkCoverage } from '../scripts/ci-shard-plan.mjs';
import { parseTimings } from '../scripts/collect-shard-timings.mjs';

const files = ['tests/a.spec.js', 'tests/b.spec.js', 'tests/new.spec.js'];
const data = { [files[0]]: 10, [files[1]]: 30 };
const result = plan('chromium', 2, files, data);
assert.equal(result.weights[files[2]], 20, 'unmeasured spec gets project median');
assert.deepEqual(result, plan('chromium', 2, [...files].reverse(), data), 'input order must not affect packing');
assert.deepEqual(result.shards.map(shard => shard.seconds), [30, 30]);
const expected = files.map(file => ({ file, id: file }));
const selections = result.shards.map(shard => ({ ...shard, tests: expected.filter(test => shard.files.includes(test.file)) }));
checkCoverage(expected, selections, files);
assert.throws(() => checkCoverage(expected, selections.slice(1), files), /coverage/);
assert.throws(() => checkCoverage(expected, [...selections, selections[0]], files), /coverage/);
assert.throws(() => checkCoverage(expected, selections.map(shard => ({ ...shard, tests: [] })), files), /coverage/);
const log = 'Browser core (chromium shard 1 of 4)\tRun core suite\t2026-11-21 ✓ 12 [chromium] › tests/a.spec.js:34:5 › title (1.2s)';
assert.equal(parseTimings(log + '\n' + log).get('chromium\ttests/a.spec.js'), 1.2);
assert.equal(parseTimings(log.replace('(1.2s)', '(120ms)')).get('chromium\ttests/a.spec.js'), .12);

for (const [project, count] of Object.entries(projects)) {
  const files = coreFiles();
  const result = plan(project, count, files);
  console.log(`${project} coverage PASS: ${coverage(project, result, files).message}`);
}
