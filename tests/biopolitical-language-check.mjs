import fs from "node:fs";
import vm from "node:vm";

const fail = (message) => {
  console.error(`Biopolitical language check failed: ${message}`);
  process.exit(1);
};
const readJson = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const fixtures = Object.fromEntries(
  ["en", "fr", "ar"].map((lang) => [
    lang,
    readJson(`fixtures/sample-analysis-bio-${lang}.json`),
  ]),
);

function walk(value, path = "", output = new Map()) {
  if (typeof value === "string") output.set(path, value);
  else if (Array.isArray(value)) {
    value.forEach((item, index) => walk(item, `${path}/${index}`, output));
  } else if (value && typeof value === "object") {
    for (const [key, item] of Object.entries(value)) {
      walk(item, `${path}/${key}`, output);
    }
  }
  return output;
}

const schema = readJson("schema/biopolitical-analysis.schema.json");
const enumValues = new Set();
function collectEnums(value) {
  if (!value || typeof value !== "object") return;
  if (Array.isArray(value.enum)) value.enum.forEach((item) => enumValues.add(item));
  Object.values(value).forEach(collectEnums);
}
collectEnums(schema);

const machineFields = new Set([
  "schema_version",
  "analysis_contract",
  "contract_status",
  "analysis_id",
  "generated_at",
  "language",
  "model_mode",
  "analysis_lens",
  "id",
  "classification_id",
  "population_id",
  "from",
  "to",
]);
const naturalLoanWords = new Set(["Expertise", "Audit", "Exemption"]);
const english = walk(fixtures.en);

for (const lang of ["fr", "ar"]) {
  const localized = walk(fixtures[lang]);
  const unexpected = [];
  for (const [path, value] of localized) {
    if (!value || value !== english.get(path) || !/[A-Za-z]{3}/.test(value)) {
      continue;
    }
    const field = path.split("/").filter(Boolean).at(-1) || "";
    if (
      machineFields.has(field) ||
      field.endsWith("_id") ||
      field.endsWith("_ids") ||
      enumValues.has(value) ||
      naturalLoanWords.has(value) ||
      /^(?:[A-Z]+\d+|\d{4}-\d{2}-\d{2}|https?:\/\/)/.test(value) ||
      value === "biopolitical-training-map-v2"
    ) {
      continue;
    }
    unexpected.push(`${path}: ${value}`);
  }
  if (unexpected.length) {
    fail(`${lang} fixture retains untranslated analytical prose:\n${unexpected.join("\n")}`);
  }
}

const arabicText = [...walk(fixtures.ar).values()].join(" ");
const arabicLetters = (arabicText.match(/[\u0600-\u06ff]/g) || []).length;
const latinLetters = (arabicText.match(/[A-Za-z]/g) || []).length;
if (arabicLetters <= latinLetters * 1.25) {
  fail("Arabic analytical prose is not dominant over canonical Latin tokens");
}

for (const [lang, fixture] of Object.entries(fixtures)) {
  if (fixture.language !== lang) fail(`${lang} fixture language identity is wrong`);
  if (fixture.capture_levels.some((item) => !item.finding.trim())) {
    fail(`${lang} fixture has an untranslated or empty capture-level finding`);
  }
}

const explorer = fs.readFileSync("src/relationship-explorer.js", "utf8");
for (const token of [
  'enables: "يمكّن"',
  'classifies: "يصنّف"',
  'distributes: "يوزّع"',
  'resists: "يقاوم"',
  'enables: "Permet"',
  'classifies: "Classe"',
  'distributes: "Distribue"',
  'resists: "Résiste"',
  "tokenCopy[lang]?.[token]",
]) {
  if (!explorer.includes(token)) fail(`localized relationship token contract missing: ${token}`);
}
// Every relation the graph draws, authored or derived from a reference, is
// named in the explorer's language rather than in English.
{
  const sandbox = { console, URL };
  sandbox.window = sandbox;
  const context = vm.createContext(sandbox);
  for (const file of [
    "src/biopolitics-schema-validator.js",
    "src/biopolitics-sample-i18n.js",
    "src/biopolitics.js",
    "src/biopolitics-graph.js",
  ]) {
    new vm.Script(fs.readFileSync(file, "utf8"), { filename: file }).runInContext(context);
  }
  const block = explorer.slice(explorer.indexOf("const tokenCopy = {"), explorer.indexOf("let container = null;"));
  const tokenCopy = Function(`${block}; return tokenCopy;`)();
  const schema = fs.readFileSync("src/biopolitics-schema-validator.js", "utf8");
  const linkRelations = [...schema.match(/"relation":\{"enum":\[([^\]]*)\]/)[1].matchAll(/"([a-z_]+)"/g)].map((match) => match[1]);
  const relations = new Set([...linkRelations, "related_to"]);
  for (const [lang, fixture] of Object.entries(fixtures)) {
    const graph = sandbox.Jarbou3iBiopoliticsGraph.build(sandbox.Jarbou3iBiopolitics.normalize(structuredClone(fixture)), lang);
    for (const edge of graph.edges) relations.add(edge.relation);
  }
  for (const lang of ["ar", "fr"]) {
    const missing = [...relations].filter((relation) => !tokenCopy[lang][relation]);
    if (missing.length) fail(`${lang} relationship explorer names these relations in English: ${missing.join(", ")}`);
  }
  if (explorer.includes("مرجع قانوني")) fail("the Arabic explorer calls a canonical reference a legal one (مرجع قانوني)");

  // Every coded value an analysis can hold is named in Arabic and French, not
  // shown as its English code. Language and depth codes are never displayed.
  const bioApi = sandbox.Jarbou3iBiopolitics;
  const codes = new Set();
  for (const match of schema.matchAll(/"enum":\[([^\]]*)\]/g)) {
    for (const value of match[1].matchAll(/"([a-z_]+)"/g)) codes.add(value[1]);
  }
  for (const code of ["ar", "en", "fr", "simple", "focused", "expert", "research"]) codes.delete(code);
  const english = (code) => code.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
  const unnamed = [...codes].filter(
    (code) => bioApi.displayToken("ar", code) === english(code) || !bioApi.displayToken("fr", code),
  );
  if (unnamed.length) fail(`these Biopolitical codes show in English in Arabic and French: ${unnamed.join(", ")}`);
}

const app = fs.readFileSync("src/app.js", "utf8");
for (const token of [
  'appTitle: "مساحة عمل التحليل الاستراتيجي"',
  'appTitleBiopolitical: "مساحة عمل التحليل الحيوسياسي"',
  "رابط المصدر ليس رابط HTTP(S) مطلقًا",
  "L’URL de la source n’est pas une URL HTTP(S) absolue",
  "لا تطابق القيمة بنية عقد التحليل المطلوبة",
  "La valeur ne respecte pas la structure requise",
  'class="importAuditPath" dir="ltr"',
]) {
  if (!app.includes(token)) fail(`localized import-audit contract missing: ${token}`);
}
for (const file of ["index.html", "src/app.js", "src/biopolitics.js"]) {
  const source = fs.readFileSync(file, "utf8");
  if (source.includes("مِشرَحة")) {
    fail(`${file} uses a morgue/dissection-room term for the Arabic workbench title`);
  }
}

console.log("Biopolitical language checks passed.");
