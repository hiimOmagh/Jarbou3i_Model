import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { createLocalizationService } from '../src/core/localization.js';

for (const locale of ['ar', 'en', 'fr']) assert.ok(fs.existsSync(new URL(`../src/locales/${locale}.js`, import.meta.url)), `Missing standalone ${locale} catalog`);
const appCatalog = Object.fromEntries(await Promise.all(['ar', 'en', 'fr'].map(async locale => [locale, (await import(`../src/locales/${locale}.js`)).default])));

const locales = ['ar', 'en', 'fr'];
// Catalog-specific exceptions document existing runtime fallback behavior.
function flatten(value, path = '', result = {}) {
  if (typeof value === 'function') {
    // Exercise callable copy with placeholder sentinels, including optional branches.
    flatten(value('{arg0}', '{arg1}', '{arg2}'), path, result);
    flatten(value('', '', ''), `${path}.__empty`, result);
  } else if (typeof value === 'string') result[path] = value;
  else if (value && typeof value === 'object') {
    for (const key of Object.keys(value).sort()) flatten(value[key], path ? `${path}.${key}` : key, result);
  } else throw new Error(`Unknown copy construction: ${path}`);
  return result;
}
const approvedFallbacks = new Set([
  // English code labels are humanized; Arabic/French canonical uses runtime fallback.
  ...['actors', 'approved', 'contextual', 'contradictions', 'evidence', 'feedback',
    'human_reviewed', 'interests', 'internal_sample', 'mismatched', 'missing',
    'motivates', 'narrative', 'none', 'produces', 'provided', 'results', 'scenarios',
    'tools', 'traceable', 'unassessed', 'unreviewed']
    .map(key => `src/reference-ui.js:CODE_LABELS:en.${key}`),
  'src/reference-ui.js:CODE_LABELS:ar.canonical',
  'src/reference-ui.js:CODE_LABELS:fr.canonical',
  // English/French have no Arabic-only plural categories.
  ...['en', 'fr'].flatMap(locale => ['zero', 'two', 'few', 'many']
    .map(form => `src/biopolitical-report.js:COPY:${locale}.records.${form}`)),
]);
const placeholders = text => JSON.stringify([...String(text).matchAll(/\{([\w]+)\}/g)].map(match => match[1]).sort());
function validate(catalog, approved = approvedFallbacks) {
  const maps = Object.fromEntries(locales.map(locale => [locale, flatten(catalog[locale])]));
  const keys = [...new Set(Object.values(maps).flatMap(Object.keys))].sort();
  const service = createLocalizationService({ catalogs: catalog, supportedLanguages: locales });
  const errors = [];
  for (const locale of locales) for (const key of keys) {
    if (!Object.hasOwn(maps[locale], key) && !approved.has(`${locale}.${key}`)) errors.push(`missing key: ${locale}.${key}`);
    if (!Object.hasOwn(maps[locale], key) && service.raw(locale, key) == null && service.translate(locale, key) !== undefined && !approved.has(`${locale}.${key}`)) errors.push(`unapproved fallback: ${locale}.${key}`);
    if (maps[locale][key] !== undefined && maps.ar[key] !== undefined && !(key === 'records.one' && catalog.ar.records?.two) && placeholders(maps[locale][key]) !== placeholders(maps.ar[key])) errors.push(`placeholder mismatch: ${locale}.${key}`);
    if (maps[locale][key] === '') errors.push(`empty copy: ${locale}.${key}`);
  }
  return { errors, maps, keys };
}
function load(file, name) {
  const source = fs.readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
  const declaration = new RegExp(`const ${name}\\s*=\\s*`).exec(source);
  assert.ok(declaration, `Cannot inventory ${file}:${name}`);
  const start = source.indexOf('{', declaration.index + declaration[0].length);
  let depth = 0, quote = '', comment = '';
  for (let i = start; i < source.length; i++) {
    const ch = source[i], next = source[i + 1];
    if (comment === 'line') { if (ch === '\n') comment = ''; continue; }
    if (comment === 'block') { if (ch === '*' && next === '/') { comment = ''; i++; } continue; }
    if (quote) {
      if (ch === '\\') i++;
      else if (ch === quote) quote = '';
      continue;
    }
    if (ch === '/' && next === '/') { comment = 'line'; i++; continue; }
    if (ch === '/' && next === '*') { comment = 'block'; i++; continue; }
    if (ch === '"' || ch === "'" || ch === '`') { quote = ch; continue; }
    if (ch === '{') depth++;
    if (ch === '}' && --depth === 0) {
      return vm.runInNewContext(`(${source.slice(start, i + 1)})`, { LINK_FILL_TARGET: '/links/-' }, { timeout: 1000 });
    }
  }
  throw new Error(`Unterminated catalog ${file}:${name}`);
}
if (process.argv.includes('--self-test')) {
  const fixture = { ar: { title: 'عنوان' }, en: { title: 'Title' }, fr: { title: 'Titre' } };
  assert.deepEqual(validate(fixture).errors, []);
  const missing = structuredClone(fixture);
  delete missing.en.title;
  assert.ok(validate(missing).errors.includes('missing key: en.title'));
  console.log('PASS injected missing key rejected');
  const mismatch = structuredClone(fixture);
  mismatch.en.title = 'Title {name}';
  assert.ok(validate(mismatch).errors.includes('placeholder mismatch: en.title'));
  console.log('PASS injected placeholder mismatch rejected');
  const fallback = structuredClone(fixture);
  delete fallback.fr.title;
  assert.ok(validate(fallback).errors.includes('unapproved fallback: fr.title'));
  console.log('PASS injected unapproved fallback rejected');
  assert.deepEqual(validate(fallback, new Set(['fr.title'])).errors, []);
  console.log('PASS approved fallback accepted');
} else {
  const allErrors = [];
  for (const [file, name] of [
    ['src/app.js', 'I18N'],
    ['src/biopolitics.js', 'UI'],
    ['src/biopolitics.js', 'copy'],
    ['src/biopolitics.js', 'modeName'],
    ['src/biopolitics.js', 'sampleCopy'],
    ['src/biopolitical-report.js', 'COPY'],
    ['src/biopolitics-graph.js', 'TYPE_LABELS'],
    ['src/core/results-inspection.js', 'TYPE_LABELS'],
    ['src/core/short-text.js', 'SHORT_TEXT'],
    ['src/core/source-prompt-budget.js', 'LABELS'],
    ['src/core/source-prompt-budget.js', 'NOTICE'],
    ['src/reference-ui.js', 'copyByLanguage'],
    ['src/reference-ui.js', 'CODE_LABELS'],
    ['src/report-theme.js', 'COPY'],
    ['src/ai-interchange.js', 'BOUNDARY_COPY'],
    ['src/ai-interchange.js', 'COMPLETION_COPY'],
    ['src/ai-interchange.js', 'LINK_COPY'],
  ]) {
    const scope = `${file}:${name}:`;
    const approved = new Set([...approvedFallbacks].filter(key => key.startsWith(scope)).map(key => key.slice(scope.length)));
    const { errors, maps, keys } = validate(file === 'src/app.js' ? appCatalog : load(file, name), approved);
    for (const locale of locales) console.log(`${file}:${name} ${locale} ${Object.keys(maps[locale]).length}/${keys.length} keys`);
    allErrors.push(...errors.map(error => `${file}:${name} ${error}`));
  }
  assert.deepEqual(allErrors, []);
  console.log('Locale inventory check passed');
}
