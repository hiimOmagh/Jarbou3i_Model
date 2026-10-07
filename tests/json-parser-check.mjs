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

// The prompts ask for one ```json block and nothing else; that is not a repair.
// Prose around the block still is.
if (parser.extractJson('\n```json\n{"items":[1]}\n```\n').recovered) {
  fail("an answer in the requested single ```json block was marked recovered");
}
if (!parser.extractJson('Here it is:\n```json\n{"items":[1]}\n```').recovered) {
  fail("prose around a fenced answer was not marked recovered");
}
if (!twoBlocks.recovered) {
  fail("an answer chosen from two fenced blocks was not marked recovered");
}
const continuedAnswer = parser.joinContinuation('```json\n{"items":[1,', '```json\n2]}\n```');
if (parser.extractJson(continuedAnswer).recovered) {
  fail("an answer completed through the continue prompt was marked recovered");
}
if (!parser.extractJson('```json\n{"items":[1]}\nThanks!').recovered) {
  fail("text after an unclosed fenced answer was not marked recovered");
}

// An extra closing brace can end the root object before the answer does. The
// members after it must be kept, not silently dropped.
for (const [label, text] of [
  ["bare", '{"a":{"b":[1]}},"c":{"d":2},"e":3}'],
  ["fenced, with prose", 'Here:\n```json\n{"a":{"b":[1]}},"c":{"d":2},"e":3}\n```\nDone.'],
  ["two extra braces", '{"a":{"b":1}},"c":{"d":2}},"e":3}'],
]) {
  const early = parser.extractJson(text);
  if (early.value.c === undefined || early.value.e !== 3) {
    fail(`members after an early close were dropped (${label}): ${JSON.stringify(early.value)}`);
  }
  if (!early.recovered || !early.repairs?.some((repair) => repair.code === "EARLY_CLOSE_REJOINED")) {
    fail(`an early close was not reported as a repair (${label})`);
  }
}
if (parser.extractJson('{"a":1}\n\n{"b":2}').value.b !== undefined) {
  fail("a second object after the answer was merged into it");
}
// Cut off after an early close: it must be completed, not imported as the part
// before the brace.
const cutAfterEarlyClose = '{"a":{"b":1}},"c":{"d":';
try {
  const lossy = parser.extractJson(cutAfterEarlyClose);
  fail(`a cut-off answer with an early close imported only its first part: ${JSON.stringify(lossy.value)}`);
} catch (error) {
  if (error.code !== "TRUNCATED_JSON") {
    fail(`a cut-off answer with an early close was not reported as cut off: ${error.code}`);
  }
}
if (parser.extractJson(parser.joinContinuation(cutAfterEarlyClose, '2},"e":3}')).value.c?.d !== 2) {
  fail("a completed answer with an early close lost the part after it");
}
// Cut off mid-string after a wrong closing bracket earlier on: the answer still
// needs its remainder, so it must be offered the continue prompt, not a repair.
for (const cutAfterWrongCloser of [
  '{"actors":[{"channels":["court"],"confidence":"high"}},"note":"cut off mid-sent',
  '{"economy":{"items":["a"]],"next":{"stated_purpose',
  // A missing opener makes the answer seem to end early, and the rest follows a comma.
  '{"m":{"list":[{"a":1},"b":2}],"modes":[]},"meaning":{"n":[]},"note":"cut off mid-sent',
]) {
  try {
    parser.extractJson(cutAfterWrongCloser);
    fail(`a cut-off answer with a wrong closing bracket was accepted: ${cutAfterWrongCloser}`);
  } catch (error) {
    if (error.code !== "TRUNCATED_JSON") {
      fail(`a cut-off answer with a wrong closing bracket was not reported as cut off: ${cutAfterWrongCloser}`);
    }
  }
}
// The same missing opener in a complete answer is broken, not cut off.
try {
  parser.extractJson('{"m":{"list":[{"a":1},"b":2}],"modes":[]},"meaning":{"n":[]},"note":"done"}');
  fail("a complete answer with a missing opener was accepted");
} catch (error) {
  if (error.code !== "INVALID_JSON") fail(`a complete answer with a missing opener gave ${error.code}`);
}
// A complete answer with one stray single quote ends "inside a string", so it
// looks cut off. The AI's reply to the continue prompt adds no quote or
// bracket to it, so it does not carry the answer on.
const strayQuote = '{"theories":[{"ref":"T1",\'limits":["x"],"note":"y"}],"links":[]}';
try {
  parser.extractJson(strayQuote);
  fail("an answer with a stray single quote was accepted");
} catch (error) {
  if (error.code !== "TRUNCATED_JSON") fail(`an answer with a stray single quote gave ${error.code}`);
}
for (const reply of [
  "The JSON object was already complete; it ends with `]}` after the links array. Nothing remains.",
  "```json\n}\n```",
]) {
  if (parser.continuesAnswer(strayQuote, reply)) {
    fail(`a reply that adds nothing was taken for a continuation: ${reply}`);
  }
}
// A real continuation carries the answer on wherever it was cut, including
// after an early close.
const whole = JSON.stringify({ a: { b: ["one", "two"] }, c: "three, four", d: [{ e: 1.5 }, null] });
for (let cut = 1; cut < whole.length; cut += 1) {
  if (!parser.continuesAnswer(whole.slice(0, cut), whole.slice(cut))) {
    fail(`a real continuation was refused after ${JSON.stringify(whole.slice(0, cut))}`);
  }
}
if (!parser.continuesAnswer(cutAfterEarlyClose, '2},"e":3}')) {
  fail("the continuation of a cut-off answer with an early close was refused");
}

// When the AI closed its code block and the answer ends on a closing bracket,
// it is finished: a stray quote, not a cut, leaves it seeming to end inside a
// string, so it is offered a repair rather than a continue prompt.
for (const finished of [
  '```json\n{"a":"a 5\" screen","b":[1,2]}\n```',
  '```json\n{"a":"a 5\" screen","b":[1,2]}\n```\nHope this helps!',
]) {
  try {
    parser.extractJson(finished);
    fail(`a finished answer with a stray quote was accepted: ${finished}`);
  } catch (error) {
    if (error.code !== "INVALID_JSON") fail(`a finished answer with a stray quote gave ${error.code}: ${finished}`);
  }
}
// Cut off inside a string and then fenced (as some apps copy it): still cut off.
try {
  parser.extractJson('```json\n{"a":"a 5 screen","b":"cut off mid\n```');
  fail("a cut-off answer with a closing fence was accepted");
} catch (error) {
  if (error.code !== "TRUNCATED_JSON") fail(`a cut-off answer with a closing fence gave ${error.code}`);
}

// A copy that misses the first character leaves the answer without its
// opening brace. Every member must be kept: the first nested object is not the
// whole answer.
for (const missingOpener of [
  '"contract":"c","lens":"l","subject":{"title":"t"},"framing":{"x":1}}',
  '```json\n"contract":"c","lens":"l","subject":{"title":"t"},"framing":{"x":1}}\n```',
  '\r\n  "contract": "c",\r\n  "lens": "l",\r\n  "subject": {"title": "t"},\r\n  "framing": {"x": 1}\r\n}',
]) {
  const parsed = parser.extractJson(missingOpener);
  if (
    parsed.value.contract !== "c" ||
    parsed.value.subject?.title !== "t" ||
    "title" in parsed.value ||
    !parsed.repairs?.some((repair) => repair.code === "ROOT_OPENER_RESTORED")
  ) {
    fail(`an answer missing its opening brace lost members: ${JSON.stringify(parsed.value)}`);
  }
}
try {
  parser.extractJson('"contract":"c","subject":{"title":"t"},"framing":{"x":"cut off mi');
  fail("a cut-off answer missing its opening brace was accepted");
} catch (error) {
  if (error.code !== "TRUNCATED_JSON") fail(`a cut-off answer missing its opening brace gave ${error.code}`);
}

// Joins keep every character of the answer: a continuation cut off right
// after a space keeps it, a lead-in line of prose is not pasted into the JSON,
// and a cut-off part copied with its closing fence still joins.
const twiceCut = parser.joinContinuation(
  parser.joinContinuation('{"claims":["Claim number 4","Claim ', '```json\nnumber 5","Claim \n```'),
  'number 6"]}',
);
if (parser.extractJson(twiceCut).value.claims?.[2] !== "Claim number 6") {
  fail(`a continuation cut off after a space lost it: ${twiceCut}`);
}
for (const leadIn of ["Here is the rest:", "Voici la suite :", "إليك بقية الإجابة:"]) {
  const joined = parser.joinContinuation('{"a":"x","b":[1,', `${leadIn}\n2,3]}`);
  if (parser.extractJson(joined).value.b?.join() !== "1,2,3") {
    fail(`a lead-in line was pasted into the answer: ${joined}`);
  }
}
const fencedCut = parser.joinContinuation('```json\n{"a":"x","b":[1,\n```', '```json\n2,3]}\n```');
if (parser.extractJson(fencedCut).value.b?.join() !== "1,2,3") {
  fail(`a cut-off part copied with its closing fence did not join: ${fencedCut}`);
}

console.log("JSON parser checks passed.");
