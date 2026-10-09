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
  assert.doesNotMatch(html, /<h3>([^<]*)<\/h3><div class="recordList"><h4>\1<\/h4>/, `${lang}: a conclusion group is headed twice`);
  if (lang !== "en") assert.doesNotMatch(html, /· schema /, `${lang}: "schema" is not translated in the report header`);
  assert.doesNotMatch(
    bio.buildPrompt({ lang, mode: "simple", topic: "Digital health passes" }),
    /: simple\./,
    `${lang}: the prompt prints the depth code`,
  );
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

// Two IDs that differ only in punctuation keep their own anchors and links.
{
  const twins = JSON.parse(
    JSON.stringify(fixture).replaceAll('"ACT1"', '"ACT.1"').replaceAll('"POP1"', '"ACT-1"'),
  );
  const twinsHtml = reportApi.build({ analysis: twins, lang: "en", version: PRODUCT_VERSION, bio, graphApi });
  const ids = [...twinsHtml.matchAll(/ id="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length, "two references share one anchor");
  const anchors = Object.fromEntries(
    [...twinsHtml.matchAll(/<article id="([^"]+)"[^>]*data-reference-id="([^"]+)"/g)].map((match) => [match[2], match[1]]),
  );
  for (const id of ["ACT.1", "ACT-1"]) {
    assert.ok(anchors[id] && twinsHtml.includes(`href="#${anchors[id]}"`), `${id} has no anchor of its own`);
  }
}

// A relationship arrow points from the source to the target as the report reads:
// right to left in Arabic.
for (const [lang, arrow] of [["ar", "←"], ["en", "→"], ["fr", "→"]]) {
  const localized = reportApi.build({ analysis: fixture, lang, version: PRODUCT_VERSION, bio, graphApi });
  const arrows = [...localized.matchAll(/<ol class="edgeList">[\s\S]*?<\/ol>/g)].flatMap((list) =>
    [...list[0].matchAll(/<span aria-hidden="true">([^<]*)<\/span>/g)].map((match) => match[1]),
  );
  assert.ok(arrows.length, `${lang} report lists no relationships`);
  assert.deepEqual([...new Set(arrows)], [arrow], `${lang} relationship arrows point the wrong way`);
}

// Values the contract codes ("institutional", "litigation", true) read in
// the report's language wherever it prints them: record fields and lists,
// and the reference directory.
const readableBody = (lang) =>
  reportApi
    .build({ analysis: bio.sample(lang), lang, version: PRODUCT_VERSION, bio, graphApi })
    .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, "");
for (const lang of ["ar", "fr"]) {
  const raw = [...readableBody(lang).matchAll(/>([^<]+)</g)]
    // A coded value is printed whole or joined with others by "·".
    .flatMap((match) => match[1].split("·"))
    .map((part) => part.trim())
    .filter(
      (part) =>
        ["true", "false"].includes(part) ||
        (/^[a-z_]+$/.test(part) && bio.displayToken("ar", part) !== bio.displayToken("en", part)),
    );
  assert.deepEqual([...new Set(raw)], [], `${lang} report prints raw codes`);
}
// A word the AI wrote where a code was asked is capitalized as a word, not
// after each accented letter ("RéGlementé").
assert.equal(bio.displayToken("fr", "statut réglementé"), "Statut Réglementé");
// A link between two records points from one to the other as Arabic reads.
assert.ok(!readableBody("ar").includes("→"), "an Arabic report has an arrow pointing against its reading");

// The dimensions can sit beside the rule or before it, never only below.
for (const lang of ["en", "ar", "fr"]) {
  assert.ok(!/below|أدناه|ci-dessous/.test(bio.ui(lang, "formula")), `the ${lang} scoring rule points below`);
}

// A gate that is not passed reads "not passed", not "banned".
assert.ok(!readableBody("ar").includes("محظورة"), "the Arabic report calls the publication gate banned");

// The Arabic and French rules carry what the English ones say.
for (const [lang, words] of [["ar", ["نزع الملكية", "الأرشيف"]], ["fr", ["expropriation", "archive"]]]) {
  const prompt = bio.buildPrompt({ lang, mode: "research", topic: "T", evidenceAccess: "web" });
  for (const word of words) assert.ok(prompt.includes(word), `the ${lang} prompt leaves out "${word}"`);
}

console.log("Biopolitical standalone report checks passed.");
