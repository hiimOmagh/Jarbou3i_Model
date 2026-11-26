import assert from 'node:assert/strict';
import fs from 'node:fs';
const labels = { en: 'Checks passed; editorial approval pending', ar: 'اجتاز الفحوص؛ الاعتماد التحريري قيد الانتظار', fr: 'Contrôles réussis ; approbation éditoriale en attente' };
for (const [lang, label] of Object.entries(labels)) {
  const { default: locale } = await import(`../src/locales/${lang}.js`);
  assert.equal(locale.publishReady, label);
  assert.match(locale.rideCheckText, /Editorial approval is still needed|يبقى الاعتماد التحريري مطلوبًا|approbation éditoriale reste nécessaire/);
  assert.match(locale.tripVerdictText, /Editorial approval is still needed|يبقى الاعتماد التحريري مطلوبًا|approbation éditoriale reste nécessaire/);
  assert.ok(fs.readFileSync('src/biopolitical-report.js', 'utf8').includes(`publishReady: "${label}"`));
}
const app = fs.readFileSync('src/app.js', 'utf8');
assert.ok(app.includes('status: t("publishReady")'));
assert.ok(app.slice(app.indexOf('function htmlReport()'), app.indexOf('function buildLosslessStrategicReport()')).includes('qualityGate'));
console.log('Publication wording: all locales, app and report labels passed');
