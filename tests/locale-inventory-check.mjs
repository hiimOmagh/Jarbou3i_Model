import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { createLocalizationService } from '../src/core/localization.js';

const locales = ['ar', 'en', 'fr'];
// No missing translations are approved for these catalogs.
function flatten(value, path = '', result = {}) {
  if (typeof value === 'string') result[path] = value;
  else if (value && typeof value === 'object') {
    for (const key of Object.keys(value).sort()) flatten(value[key], path ? `${path}.${key}` : key, result);
  } else throw new Error(`Unknown copy construction: ${path}`);
  return result;
}
function validate(catalog) {
  const maps = Object.fromEntries(locales.map(locale => [locale, flatten(catalog[locale])]));
  const keys = [...new Set(Object.values(maps).flatMap(Object.keys))].sort();
  const service = createLocalizationService({ catalogs: catalog, supportedLanguages: locales });
  const errors = [];
  for (const locale of locales) for (const key of keys) {
    if (!Object.hasOwn(maps[locale], key)) errors.push(`missing key: ${locale}.${key}`);
    if (service.raw(locale, key) == null && service.translate(locale, key) !== undefined) errors.push(`unapproved fallback: ${locale}.${key}`);
    if (maps[locale][key] === '') errors.push(`empty copy: ${locale}.${key}`);
  }
  return { errors, maps, keys };
}
function load(file, name) {
  const source = fs.readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
  const match = source.match(new RegExp(`const ${name} = (\\{[\\s\\S]*?\\n\\s*\\});`));
  assert.ok(match, `Cannot inventory ${file}:${name}`);
  return vm.runInNewContext(`(${match[1]})`, {}, { timeout: 1000 });
}
if (process.argv.includes('--self-test')) {
  const fixture = { ar: { title: 'عنوان' }, en: { title: 'Title' }, fr: { title: 'Titre' } };
  assert.deepEqual(validate(fixture).errors, []);
  const missing = structuredClone(fixture);
  delete missing.en.title;
  assert.ok(validate(missing).errors.includes('missing key: en.title'));
  console.log('PASS injected missing key rejected');
  const fallback = structuredClone(fixture);
  delete fallback.fr.title;
  assert.ok(validate(fallback).errors.includes('unapproved fallback: fr.title'));
  console.log('PASS injected unapproved fallback rejected');
} else {
  for (const [file, name] of [['src/app.js', 'I18N'], ['src/biopolitics.js', 'UI']]) {
    const { errors, maps, keys } = validate(load(file, name));
    for (const locale of locales) console.log(`${file}:${name} ${locale} ${Object.keys(maps[locale]).length}/${keys.length} keys`);
    assert.deepEqual(errors, [], `${file}:${name}`);
  }
  console.log('Locale inventory check passed');
}

