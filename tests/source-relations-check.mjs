import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { relateEvidence } from '../src/core/source-relations.js';
const source = (source_id, title, url = '') => ({ source_id, title, url });
const evidence = (id, source_title, source_url = '') => ({ id, source_title, source_url });
const sources = [source('a', 'Title', 'https://example.com'), source('b', 'Title', 'https://other.test'), source('c', 'Unlinked')];
const result = relateEvidence({ sources, evidence: [evidence('E1', '', 'https://EXAMPLE.com/'), evidence('E2', 'Title'), evidence('E3', 'Unlinked', 'https://different.test'), evidence('E4', ''), evidence('E5', '  ＵＮＬＩＮＫＥＤ  ', 'file:///tmp')] });
assert.deepEqual(result, { byEvidence: { E1: { source_id: 'a', by: 'link' }, E3: { source_id: 'c', by: 'title' }, E5: { source_id: 'c', by: 'title' } }, bySource: { a: ['E1'], c: ['E3', 'E5'] }, ambiguousTitles: ['title'] });
assert.deepEqual(relateEvidence({ sources, evidence: [evidence('E', 'Title', 'https://different.test')] }).byEvidence, {});
assert.equal(relateEvidence({ sources: [sources[0]], evidence: [evidence('E', 'title')] }).byEvidence.E.source_id, 'a');
assert.equal(relateEvidence({ sources: [...sources, source('d', 'Title')], evidence: [evidence('E', 'Title')] }).byEvidence.E.source_id, 'd');
// An id such as "__proto__" is an own key, never the prototype.
const odd = relateEvidence({ sources: [source('p', 'Odd')], evidence: [evidence('__proto__', 'Odd')] });
assert.deepEqual(Object.keys(odd.byEvidence), ['__proto__']);
assert.equal(Object.getPrototypeOf(odd.byEvidence), Object.prototype);
for (const name of ['en', 'ar', 'fr', 'bio-en', 'bio-ar', 'bio-fr']) {
  const sample = JSON.parse(await readFile(new URL(`../fixtures/sample-analysis-${name}.json`, import.meta.url)));
  const items = sample.evidence?.items;
  assert.ok(Array.isArray(items) && items.length, `${name}: the sample has evidence items`);
  // One case source per distinct title, as 1B would hold them (no links in the samples).
  const titles = [...new Set(items.map(item => item.source_title).filter(Boolean))];
  const local = titles.map((title, index) => source(`S${index}`, title));
  const before = JSON.stringify({ items, local });
  const relations = relateEvidence({ evidence: items, sources: local });
  assert.equal(JSON.stringify({ items, local }), before, `${name}: inputs are not changed`);
  for (const item of items) {
    if (!item.source_title) continue;
    const expected = local.find(entry => entry.title === item.source_title).source_id;
    assert.deepEqual(relations.byEvidence[item.id], { source_id: expected, by: 'title' }, `${name}: ${item.id} relates to its source`);
  }
}
console.log('source-relations-check: PASS');

