import fs from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";
import { PRODUCT_VERSION } from "./helpers/product-version.mjs";

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
    version: PRODUCT_VERSION,
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
  version: PRODUCT_VERSION,
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
assert.ok(html.includes("Decision readiness"));
assert.ok(html.includes("independent human review"));
assert.ok(html.includes("Analytical coverage"));
assert.ok(html.includes("Source traceability"));
assert.ok(html.includes("Not publication-ready"));
assert.ok(html.includes('class="referenceGroup"'), "multiple named references must render as one responsive group");
assert.ok(!html.includes("</a> · <a"), "reference groups must not emit an orphanable separator glyph");
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

// Every relation the relationship atlas prints reads in the report's language.
const graphRelations = ["between", "supported_by", "responds_to_classification", "targets", "governed_by", "uses", "affects", "countered_by", "related_to"];
for (const lang of ["ar", "fr"]) {
  const sampleRelations = graphApi.build(bio.sample(lang), lang).edges.map((edge) => edge.relation);
  for (const relation of new Set([...graphRelations, ...sampleRelations])) {
    assert.notEqual(bio.displayToken(lang, relation), bio.displayToken("en", relation), `${lang} relation ${relation} is shown in English`);
  }
}

// Each evidence record keeps its own ID and source, even when two evidence
// items share a claim or an explanation states the same claim.
{
  const twin = structuredClone(fixture);
  const [first] = twin.evidence.items;
  twin.evidence.items.push({ ...structuredClone(first), id: "E99", source_url: "https://example.org/evidence/E99" });
  twin.competing_explanations[0].claim = first.claim;
  const twinHtml = reportApi.build({ analysis: twin, lang: "en", version: PRODUCT_VERSION, bio, graphApi });
  assert.ok(twinHtml.includes('data-evidence-id="E99"'), "second evidence record lost its own ID");
  const twinIds = [...twinHtml.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(twinIds).size, twinIds.length, "evidence records sharing a claim duplicate an ID");
}

console.log("Biopolitical standalone report checks passed.");
