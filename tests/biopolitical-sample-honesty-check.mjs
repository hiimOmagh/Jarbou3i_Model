import fs from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";

const window = {};
window.window = window;
const context = vm.createContext({ window, console, URL });
for (const file of ["biopolitics-schema-validator", "biopolitics-sample-i18n", "biopolitics", "biopolitics-integrity", "biopolitics-graph", "report-theme", "biopolitical-report"]) {
  vm.runInContext(fs.readFileSync(`src/${file}.js`, "utf8"), context);
}
const bio = window.Jarbou3iBiopolitics;
const markers = { en: "Illustrative example", ar: "مثال توضيحي", fr: "Exemple illustratif" };
const unsupported = /Evidence supports|Les preuves soutiennent|تدعم الأدلة وصفًا|The intervention combined protection|L’intervention combinait protection|جمع التدخل بين الحماية/;
for (const lang of ["en", "ar", "fr"]) {
  const fixture = JSON.parse(fs.readFileSync(`fixtures/sample-analysis-bio-${lang}.json`, "utf8"));
  for (const [kind, sample] of [["runtime", bio.sample(lang)], ["fixture", fixture]]) {
    const label = `${lang}/${kind}`;
    assert.ok(sample.evidence.items.length > 0);
    for (const item of sample.evidence.items) {
      assert.equal(item.source_url, "", label);
      assert.equal(item.verification_status, "unverified", label);
      assert.notEqual(item.epistemic_type, "verified_fact", label + ": placeholder cannot be a verified fact");
    }
    assert.ok(sample.subject.executive_finding.includes(markers[lang]), label + ": example marker");
    assert.ok(sample.calibrated_conclusion.strongly_supported.every((text) => text.includes(markers[lang])), label + ": only example notices in supported findings");
    assert.doesNotMatch(JSON.stringify(sample), unsupported, label + ": unsupported evidence claim");
    const html = window.Jarbou3iBiopoliticalReport.build({
      analysis: sample, lang, version: "test", bio,
      graphApi: window.Jarbou3iBiopoliticsGraph,
    });
    assert.ok(html.includes(markers[lang]), label + ": exported example marker");
    assert.doesNotMatch(html, unsupported, label + ": exported evidence claim");
    console.log(`PASS ${label}: unverified example and exported marker`);
  }
}
console.log("Biopolitical sample honesty check passed.");
