import assert from 'node:assert/strict';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const required = ['MAN-001', 'MAN-002', 'MAN-003', 'MAN-004'];
const surfaces = ['Native assistive technology', 'Linguistic and epistemic nuance', 'Physical zoom, print, and touch', 'Long-form report'];
const dispositions = ['Pending', 'Pass', 'Fixed and reverified', 'Accepted'];
const evidencePath = 'docs/operations/manual-release-review.md';
const git = (...args) => execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
// Committing a record moves HEAD, so a reviewed commit stays current while only the evidence document changed since it.
const onlyEvidence = files => files.every(file => file === evidencePath);
function changedSince(reviewed) {
  try {
    git('merge-base', '--is-ancestor', reviewed, 'HEAD');
    return git('diff', '--name-only', '--no-renames', reviewed, 'HEAD').split(/\r?\n/).filter(Boolean);
  } catch { return null; }
}
function isCurrent(reviewed, sha, changes) {
  if (reviewed === sha) return true;
  const files = changes(reviewed);
  return files !== null && onlyEvidence(files);
}
function validate(document, sha, strict = false, changes = changedSince) {
  const errors = [];
  const blocks = [...document.matchAll(/```release-evidence\s*\n([\s\S]*?)```/g)];
  if (blocks.length !== 1) return ['Expected one release-evidence block'];
  let records;
  try { records = JSON.parse(blocks[0][1]); } catch { return ['Invalid release-evidence JSON']; }
  if (!Array.isArray(records)) return ['Evidence must be an array'];
  for (const id of required) {
    const matches = records.filter(r => r.id === id);
    if (matches.length !== 1) { errors.push(`${id}: missing or duplicate record`); continue; }
    const r = matches[0];
    const table = document.split(/\r?\n/).filter(line => line.startsWith(`| ${id} |`));
    if (table.length !== 1 || table[0].split('|').at(-2).trim() !== r.disposition) errors.push(`${id}: register disposition mismatch`);
    if (!dispositions.includes(r.disposition)) errors.push(`${id}: required disposition missing or invalid`);
    if (!Array.isArray(r.coverage) || !r.coverage.length || r.coverage.some(c => !['ar', 'en', 'fr'].includes(c.locale) || !c.surface?.trim())) errors.push(`${id}: locale/surface coverage missing`);
    for (const locale of ['ar', 'en', 'fr']) {
      if (!Array.isArray(r.coverage) || r.coverage.filter(c => c.locale === locale && c.surface === surfaces[required.indexOf(id)]).length !== 1) errors.push(`${id}: stale locale/surface inventory`);
    }
    if (r.disposition === 'Pending') {
      if (strict) errors.push(`${id}: pending release review`);
      if (['reviewedSha', 'reviewerType', 'reviewer', 'date', 'evidence', 'authorization'].some(k => r[k] !== null)) errors.push(`${id}: pending record must not claim review`);
      continue;
    }
    if (!/^[a-f0-9]{40}$/.test(r.reviewedSha || '') || !isCurrent(r.reviewedSha, sha, changes)) errors.push(`${id}: stale reviewed SHA`);
    if (!['machine', 'native', 'waiver'].includes(r.reviewerType)) errors.push(`${id}: invalid reviewer type`);
    if (typeof r.reviewer !== 'string' || !r.reviewer.trim() || !r.evidence?.trim()) errors.push(`${id}: reviewer/evidence missing`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(r.date || '') || !Number.isFinite(Date.parse(r.date)) || new Date(r.date).toISOString().slice(0, 10) !== r.date || r.date > new Date().toISOString().slice(0, 10)) errors.push(`${id}: invalid review date`);
    if (r.reviewerType === 'machine') errors.push(`${id}: machine review cannot close native obligations`);
    if (r.reviewerType === 'native' && (!r.authorization?.trim() || /machine|agent|codex|gemini|antigravity/i.test(`${r.reviewer} ${r.authorization}`))) errors.push(`${id}: unsupported native completion`);
    if (r.reviewerType === 'waiver' && (r.disposition !== 'Accepted' || !r.authorization?.trim())) errors.push(`${id}: waiver requires explicit authorization`);
    if (r.disposition === 'Accepted' && (!r.impact?.trim() || !r.rationale?.trim())) errors.push(`${id}: acceptance requires impact and rationale`);
    for (const locale of ['ar', 'en', 'fr']) if (!r.coverage.some(c => c.locale === locale)) errors.push(`${id}: stale locale coverage`);
    if (r.coverage.some(c => c.reviewedSha !== r.reviewedSha || !c.evidence?.trim())) errors.push(`${id}: stale surface coverage`);
  }
  if (records.some(r => !required.includes(r.id))) errors.push('Unknown record ID');
  return errors;
}

function selfTest() {
  const sha = 'a'.repeat(40);
  // Synthetic fixtures only: these never become reviewer records in the document.
  const records = required.map(id => ({ id, reviewedSha: sha, reviewerType: 'native', reviewer: 'Synthetic fixture', date: '2026-01-01', disposition: 'Pass', evidence: 'fixture-only', authorization: 'fixture human attestation', coverage: ['ar', 'en', 'fr'].map(locale => ({ locale, surface: surfaces[required.indexOf(id)], reviewedSha: sha, evidence: 'fixture-only' })) }));
  const render = rows => rows.map(r => `| ${r.id} | fixture | ${r.disposition} |`).join('\n') + '\n```release-evidence\n' + JSON.stringify(rows) + '\n```';
  assert.deepEqual(validate(render(records), sha, true), []);
  const reject = (name, mutate, expected) => {
    const rows = structuredClone(records); mutate(rows);
    assert.ok(validate(render(rows), sha, true).some(e => e.includes(expected)), name);
    console.log(`PASS ${name}`);
  };
  reject('fabricated native completion', r => { r[0].reviewer = 'codex machine agent'; }, 'unsupported native');
  reject('missing native attestation', r => { r[0].authorization = null; }, 'unsupported native');
  reject('machine completion', r => { r[0].reviewerType = 'machine'; }, 'machine review');
  reject('stale reviewed SHA', r => { r[0].reviewedSha = 'b'.repeat(40); }, 'stale reviewed SHA');
  reject('stale surface coverage', r => { r[0].coverage[0].reviewedSha = 'b'.repeat(40); }, 'stale surface');
  reject('missing locale coverage', r => { r[0].coverage.pop(); }, 'stale locale');
  reject('missing surface inventory', r => { r[0].coverage[0].surface = 'unrelated'; }, 'stale locale/surface');
  reject('missing required disposition', r => { delete r[0].disposition; }, 'required disposition');
  reject('missing required record', r => { r.pop(); }, 'missing or duplicate');
  reject('implicit waiver', r => { r[0].reviewerType = 'waiver'; }, 'waiver requires');
  reject('acceptance without impact', r => { r[0].disposition = 'Accepted'; }, 'impact and rationale');
  assert.ok(validate(render(records).replace('| Pass |', '| Pending |'), sha).some(e => e.includes('mismatch')));
  console.log('PASS register cannot contradict evidence');
  const later = 'c'.repeat(40);
  assert.deepEqual(validate(render(records), later, true, () => [evidencePath]), []);
  console.log('PASS record commit keeps the review current');
  for (const files of [[evidencePath, 'src/app.js'], null]) assert.ok(validate(render(records), later, true, () => files).some(e => e.includes('stale reviewed SHA')));
  console.log('PASS later changes or unrelated history make the review stale');
}
if (process.argv.includes('--self-test')) selfTest();
const sha = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const errors = validate(fs.readFileSync(new URL('../docs/operations/manual-release-review.md', import.meta.url), 'utf8'), sha, process.argv.includes('--strict'));
if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
else console.log('Release evidence structure valid; pending records do not authorize release.');
