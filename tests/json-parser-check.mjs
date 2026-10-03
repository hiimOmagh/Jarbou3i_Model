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

const cited = parser.extractJson(
  'Based on sources [1] and [draft], here is the analysis:\n{"schema_version":"1.1.0","items":[1,2]}',
);
if (Array.isArray(cited.value) || cited.value.schema_version !== "1.1.0") {
  fail("bracketed prose before unfenced JSON was parsed instead of the JSON object");
}

const arrayPayload = parser.extractJson('Result: [{"a":1},{"b":2},]');
if (!Array.isArray(arrayPayload.value) || arrayPayload.value.length !== 2) {
  fail("an array of objects must not be narrowed to its first element");
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

for (const truncated of [
  '{"open":[1,2',
  '{"text":"unterminated',
  'prefix ```json\n{"contract":"jarbou3i-ai-interchange/1"',
  'See [1]. {"a": [1, 2',
]) {
  let detected = false;
  try {
    parser.extractJson(truncated);
  } catch (error) {
    detected = error.code === "TRUNCATED_JSON";
  }
  if (!detected) fail(`truncated input was not classified: ${truncated}`);
}

const cutOff = '{"subject":{"title":"Digital welfare scoring","context":"The agency scored applic';
for (const [name, continuation] of [
  ["plain remainder", 'ants by risk"},"items":[1,2]}'],
  ["fenced remainder", '```json\nants by risk"},"items":[1,2]}\n```'],
  ["repeated overlap", 'context":"The agency scored applicants by risk"},"items":[1,2]}'],
]) {
  const joined = parser.joinContinuation(cutOff, continuation);
  let value;
  try {
    value = parser.extractJson(joined).value;
  } catch {
    fail(`continuation was not joined into valid JSON: ${name}`);
  }
  if (value.subject.context !== "The agency scored applicants by risk") {
    fail(`continuation altered the joined content: ${name}`);
  }
}

// Repetitive content at the seam is not a repeat and must not be trimmed, and
// a leading space can be string content.
for (const [head, tail, expected] of [
  ['{"s":[0,0,0,0,0,', "0,0,0,0,0]}", '{"s":[0,0,0,0,0,0,0,0,0,0]}'],
  ['{"t":"==========', '=========="}', `{"t":"${"=".repeat(20)}"}`],
  ['{"t":"The quick', ' brown fox"}\n', '{"t":"The quick brown fox"}'],
  ['{"t":"The quick', '\n```json\n brown fox"}\n```\n', '{"t":"The quick brown fox"}'],
  ['{"t":"The quick', 'Here is the rest:\n```json\n brown fox"}\n```\nDone.', '{"t":"The quick brown fox"}'],
  ['{"t":"The quick', '```json "}```', '{"t":"The quick"}'],
]) {
  const joined = parser.joinContinuation(head, tail);
  if (joined !== expected) {
    fail(`seam content was altered: ${joined}`);
  }
}

// Assistants sometimes show a small format example before the real answer.
const twoBlocks = parser.extractJson(
  'Example format:\n```json\n{"example": true}\n```\nFinal answer:\n```json\n{"analysis_lens":"strategic","items":[1,2,3]}\n```',
);
if (twoBlocks.value.example || twoBlocks.value.analysis_lens !== "strategic") {
  fail("a small example block was chosen over the larger answer block");
}
const exampleAfter = parser.extractJson(
  '```json\n{"analysis_lens":"strategic","items":[1,2,3]}\n```\nYou could also return:\n```json\n{"x":1}\n```',
);
if (exampleAfter.value.analysis_lens !== "strategic") {
  fail("a small block after the answer replaced the answer");
}

console.log("JSON parser checks passed.");
