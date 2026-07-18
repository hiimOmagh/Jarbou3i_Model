import fs from "node:fs";

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

console.log("Biopolitical language checks passed.");
