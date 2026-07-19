import fs from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";

const window = {};
window.window = window;
const context = vm.createContext({ window, console, URL });
for (const file of [
  "src/biopolitics-schema-validator.js",
  "src/biopolitics-sample-i18n.js",
  "src/biopolitics.js",
  "src/biopolitics-integrity.js",
  "src/biopolitics-graph.js",
  "src/biopolitical-report.js",
]) {
  new vm.Script(fs.readFileSync(file, "utf8"), { filename: file }).runInContext(
    context,
  );
}

const bio = window.Jarbou3iBiopolitics;
const graphApi = window.Jarbou3iBiopoliticsGraph;
const reportApi = window.Jarbou3iBiopoliticalReport;
const fixture = JSON.parse(
  fs.readFileSync("fixtures/sample-analysis-bio-en.json", "utf8"),
);
fixture.evidence.items[0].source_url = "https://example.org/evidence/E1";

const localeContracts = {
  en: ["ltr", "Biopolitical Analysis Report — Training Map v2"],
  ar: ["rtl", "تقرير التحليل الحيوسياسي — خريطة التدريب 2"],
  fr: ["ltr", "Rapport d’analyse biopolitique — Carte d’entraînement v2"],
};

for (const [lang, [dir, title]] of Object.entries(localeContracts)) {
  const analysis = bio.sample(lang);
  if (lang === "en") analysis.evidence.items[0].source_url = fixture.evidence.items[0].source_url;
  const html = reportApi.build({
    analysis,
    lang,
    version: "2.0.0-bio-rc.16",
    bio,
    graphApi,
  });
  assert.match(html, new RegExp(`<html lang="${lang}" dir="${dir}"`));
  assert.ok(html.includes(title), `${lang} report title missing`);
  assert.ok(html.includes('data-publication-gate="blocked"'));
  assert.ok(html.includes('data-canonical-contract="complete"'));
  assert.ok(html.includes('data-relationship-atlas="complete"'));
  assert.ok(html.includes('data-reference-directory="named"'));
  assert.ok(html.includes('class="reportToc"'));
  assert.ok(html.includes('class="reportSection"'));
  assert.ok(html.includes('id="canonical-analysis"'));
  assert.ok(!/[\uE000-\uF8FF]/.test(html), `${lang} report leaked private-use glyphs`);
  assert.ok(!html.includes("turn0"), `${lang} report leaked assistant citation IDs`);
}

const html = reportApi.build({
  analysis: fixture,
  lang: "en",
  version: "2.0.0-bio-rc.16",
  bio,
  graphApi,
});
assert.ok(html.includes('href="https://example.org/evidence/E1"'));
assert.ok(html.includes('target="_blank" rel="noopener noreferrer"'));
assert.ok(
  html.includes(
    "Rules linked defined health credentials to access in specified settings. [E1]",
  ),
  "human-readable references must preserve their canonical IDs",
);
assert.ok(html.includes("Analytical readiness"));
assert.ok(html.includes("it is not permission to publish"));
assert.ok(html.includes("Not publication-ready"));
assert.ok(html.includes(".reportSection{box-shadow:none;break-inside:auto}"));
assert.ok(!html.includes(".reportSection{break-inside:avoid}"));
const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
assert.equal(new Set(ids).size, ids.length, "standalone report must not contain duplicate IDs");
for (const match of html.matchAll(/class="referenceChip" href="#([^"]+)"/g)) {
  assert.ok(ids.includes(match[1]), `reference link target #${match[1]} is missing`);
}

const canonicalMatch = html.match(
  /<script type="application\/json" id="canonical-analysis">([\s\S]*?)<\/script>/,
);
assert.ok(canonicalMatch, "machine-readable canonical payload missing");
assert.deepEqual(JSON.parse(canonicalMatch[1]), fixture);

console.log("Biopolitical standalone report checks passed.");
