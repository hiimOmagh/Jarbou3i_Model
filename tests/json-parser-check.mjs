import fs from "node:fs";
import vm from "node:vm";

const fail = (message) => {
  console.error(`JSON parser check failed: ${message}`);
  process.exit(1);
};

const window = {};
const context = vm.createContext({ window });
new vm.Script(fs.readFileSync("src/json-parser.js", "utf8"), {
  filename: "src/json-parser.js",
}).runInContext(context);
const parser = window.Jarbou3iJson;

const source = String.raw`Here is the result:

\`\`\`json
{
  "source_url": "https://example.org/path//segment?q=/*literal*/",
  "quoted": "Text containing // and /* comment markers */ must survive",
  "escaped": "A brace in a string: } and an escaped quote: \"",
  // remove this actual comment
  "items": ["one", "two",],
}
\`\`\``;

const parsed = parser.extractJson(source);
if (!parsed.recovered) fail("messy fenced JSON should be marked recovered");
if (
  parsed.value.source_url !==
  "https://example.org/path//segment?q=/*literal*/"
) {
  fail("URL contents were damaged by comment recovery");
}
if (!parsed.value.quoted.includes("// and /* comment markers */")) {
  fail("comment-like text inside strings was damaged");
}
if (parsed.value.items.length !== 2) {
  fail("trailing comma recovery failed");
}

const clean = '{"text":"Curly prose ‘stays’ unchanged","url":"https://x.test/a"}';
const cleanResult = parser.extractJson(clean);
if (cleanResult.recovered || cleanResult.value.text !== "Curly prose ‘stays’ unchanged") {
  fail("valid JSON should parse without editorial mutation");
}

for (const invalid of ["", "plain prose", '{"open": [1, 2}']) {
  let rejected = false;
  try {
    parser.extractJson(invalid);
  } catch {
    rejected = true;
  }
  if (!rejected) fail(`invalid input was accepted: ${invalid}`);
}

console.log("JSON parser checks passed.");
