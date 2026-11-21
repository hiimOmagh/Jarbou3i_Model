import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

export const projects = { chromium: 4, firefox: 3, webkit: 5, 'mobile-chrome': 3 };
export const timings = JSON.parse(fs.readFileSync(new URL('./ci-shard-timings.json', import.meta.url)));
export function coreFiles() {
  const pkg = JSON.parse(fs.readFileSync('package.json'));
  return [...new Set(pkg.scripts['test:browser:core'].match(/tests\/[\w./-]+\.spec\.js/g))].sort();
}
const compare = (a, b) => a < b ? -1 : a > b ? 1 : 0;
export function plan(project, count, files = coreFiles(), data = timings[project]) {
  if (!projects[project] || !Number.isInteger(count) || count < 1) throw new Error('Invalid project or shard count');
  const known = files.map(file => data?.[file]).filter(value => Number.isFinite(value) && value > 0).sort((a, b) => a - b);
  const middle = Math.floor(known.length / 2);
  const median = known.length ? (known.length % 2 ? known[middle] : (known[middle - 1] + known[middle]) / 2) : 1;
  const weights = Object.fromEntries(files.map(file => [file, Number.isFinite(data?.[file]) && data[file] >= 0 ? data[file] : median]));
  const shards = Array.from({ length: count }, () => ({ files: [], seconds: 0 }));
  for (const file of [...files].sort((a, b) => weights[b] - weights[a] || compare(a, b))) {
    const shard = shards.reduce((best, candidate) => candidate.seconds < best.seconds ? candidate : best);
    shard.files.push(file);
    shard.seconds += weights[file];
  }
  for (const shard of shards) shard.files.sort(compare);
  const target = Object.values(weights).reduce((a, b) => a + b, 0) / count;
  return { shards, weights, median, oversized: files.filter(file => weights[file] > target), target };
}

// Use Playwright discovery itself: project-specific declarations and serial groups
// must have the same semantics as the actual CI command.
export function listTests(project, files, shard) {
  const output = execFileSync(process.execPath, ['node_modules/@playwright/test/cli.js', 'test', ...files, `--project=${project}`, '--list', '--reporter=json', ...(shard ? [`--shard=${shard}`] : [])], { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024, windowsHide: true });
  const report = JSON.parse(output);
  if (report.errors?.length) throw new Error(JSON.stringify(report.errors));
  const tests = [];
  function visit(suite) {
    for (const spec of suite.specs || []) {
      const file = 'tests/' + path.relative(report.config.rootDir, path.resolve(report.config.rootDir, spec.file)).replaceAll('\\', '/');
      for (const test of spec.tests) tests.push({ file, id: test.projectName + ':' + spec.id });
    }
    for (const child of suite.suites || []) visit(child);
  }
  for (const suite of report.suites) visit(suite);
  return tests;
}
export function checkCoverage(expected, selections, files) {
  const assigned = selections.flatMap(shard => shard.files);
  if (assigned.length !== files.length || new Set(assigned).size !== files.length || files.some(file => !assigned.includes(file))) throw new Error('Shard file coverage: dropped or duplicated spec');
  const wanted = expected.map(test => test.id).sort();
  const actual = selections.flatMap(shard => shard.tests.map(test => test.id)).sort();
  if (new Set(wanted).size !== wanted.length || JSON.stringify(actual) !== JSON.stringify(wanted)) throw new Error('Shard test coverage: dropped or duplicated test');
  return `${files.length} files exactly once; ${actual.length}/${wanted.length} tests`;
}
export function coverage(project, result, files) {
  const expected = listTests(project, files);
  const selections = result.shards.map(shard => ({ ...shard, tests: shard.files.length ? listTests(project, shard.files) : [] }));
  return { expected, message: checkCoverage(expected, selections, files) };
}
export function summary() {
  console.log('Predicted summed test seconds (not wall time; two workers, startup and contention excluded).');
  console.log('Old native split apportions each file duration by its discovered test counts; within-file durations are unknown.');
  for (const [project, count] of Object.entries(projects)) {
    const files = coreFiles();
    const result = plan(project, count, files);
    const { expected, message } = coverage(project, result, files);
    const totals = Object.fromEntries(files.map(file => [file, expected.filter(test => test.file === file).length]));
    const old = Array.from({ length: count }, (_, index) => listTests(project, files, `${index + 1}/${count}`).reduce((sum, test) => sum + result.weights[test.file] / totals[test.file], 0));
    const next = result.shards.map(shard => shard.seconds);
    console.log(`${project}: timings ${files.filter(file => timings[project]?.[file] > 0).length}/${files.length}; old [${old.map(n => n.toFixed(1)).join(', ')}] max ${Math.max(...old).toFixed(1)}; new [${next.map(n => n.toFixed(1)).join(', ')}] max ${Math.max(...next).toFixed(1)}; coverage PASS: ${message}`);
    for (const file of result.oversized) console.log(`  Oversized: ${file} ${result.weights[file].toFixed(1)}s > target ${result.target.toFixed(1)}s; kept whole to preserve serial/test semantics.`);
  }
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  if (process.argv[2] === '--summary') summary();
  else {
    const [project, shard] = process.argv.slice(2);
    const match = shard?.match(/^(\d+)\/(\d+)$/);
    if (!match || +match[1] < 1 || +match[1] > +match[2]) throw new Error('Usage: node scripts/ci-shard-plan.mjs PROJECT N/M | --summary');
    const result = plan(project, +match[2]);
    for (const file of result.oversized) console.error(`Oversized spec kept whole: ${file} (${result.weights[file].toFixed(1)}s; target ${result.target.toFixed(1)}s)`);
    const files = result.shards[+match[1] - 1].files;
    if (!files.length) throw new Error('Empty shard: refusing an unfiltered Playwright invocation');
    console.log(files.join('\n'));
  }
}
