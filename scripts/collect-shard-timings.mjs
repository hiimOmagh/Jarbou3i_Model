// Usage: node scripts/collect-shard-timings.mjs RUN_ID[:ATTEMPT] ...
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';

export function parseTimings(log) {
  const samples = new Map();
  for (const line of log.replace(/\x1b\[[0-9;]*m/g, '').split('\n')) {
    if (!line.startsWith('Browser core (')) continue;
    const match = line.match(/[✓✔✘×]\s+\d+\s+\[([^\]]+)\]\s+›\s+(tests\/[^:]+\.spec\.js):(.+?)\s+\((\d+(?:\.\d+)?)(ms|s|m)\)\s*$/);
    if (!match) continue;
    const [, project, file, identity, duration, unit] = match;
    const key = `${project}\t${file}`;
    if (!samples.has(key)) samples.set(key, new Map());
    // Count retry work, but not repeated copies of a reporter line.
    const test = identity;
    const seconds = Number(duration) * ({ ms: .001, s: 1, m: 60 }[unit]);
    samples.get(key).set(test, seconds);
  }
  return new Map([...samples].map(([key, tests]) => [key, [...tests.values()].reduce((a, b) => a + b, 0)]));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const generatedFrom = process.argv.slice(2);
  if (!generatedFrom.length || generatedFrom.some(id => !/^\d+(?::\d+)?$/.test(id))) throw new Error('Supply RUN_ID[:ATTEMPT] arguments');
  const totals = new Map();
  for (const source of generatedFrom) {
    const [id, attempt] = source.split(':');
    const log = execFileSync('gh', ['run', 'view', id, ...(attempt ? ['--attempt', attempt] : []), '--log'], { encoding: 'utf8', maxBuffer: 100 * 1024 * 1024, windowsHide: true });
    const parsed = parseTimings(log);
    if (!parsed.size) throw new Error(`No core list-reporter durations parsed from ${source}`);
    console.error(`${source}: ${parsed.size} project/spec observations`);
    for (const [key, seconds] of parsed) {
      if (!totals.has(key)) totals.set(key, []);
      totals.get(key).push(seconds);
    }
  }
  const result = { generatedFrom, unit: 'summed test seconds, averaged per observed run attempt (including retry work)' };
  for (const [key, seconds] of [...totals].sort(([a], [b]) => a.localeCompare(b))) {
    const [project, file] = key.split('\t');
    (result[project] ??= {})[file] = Math.round(seconds.reduce((a, b) => a + b, 0) / seconds.length * 1000) / 1000;
  }
  fs.writeFileSync('scripts/ci-shard-timings.json', JSON.stringify(result, null, 2) + '\n');
}
