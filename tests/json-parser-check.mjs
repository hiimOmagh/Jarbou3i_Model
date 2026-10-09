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

// A continuation that repeats the whole record it was cut in, however long,
// adds it once; one that starts the answer over replaces it, whether the
// restart is finished or cut off again.
{
  const actors = Array.from({ length: 6 }, (_, index) => ({
    id: `A${index + 1}`,
    name: `Actor ${index + 1}`,
    rationale: `${"A rationale long enough to run past four hundred characters. ".repeat(9)}${index}`,
  }));
  const full = JSON.stringify({ schema_version: "2.1.0", analysis_lens: "strategic", actors }, null, 2);
  const start = full.lastIndexOf("\n    {\n") + 1;
  const cut = start + 500;
  const head = full.slice(0, cut);
  const whole = (text) => {
    try {
      return JSON.stringify(parser.extractJson(text).value) === JSON.stringify(JSON.parse(full));
    } catch {
      return false;
    }
  };
  whole(parser.joinContinuation(head, "```json\n" + full.slice(start) + "\n```")) ||
    fail("a record repeated past 400 characters was not added once");
  const restart = "Sorry, here is the whole answer again:\n```json\n" + full + "\n```";
  if (!parser.continuesAnswer(head, restart)) fail("an answer started over was refused as a continuation");
  whole(parser.joinContinuation(head, restart)) ||
    fail("an answer started over was not put in place of the cut-off one");
  const cutAgain = full.slice(0, cut + 300);
  if (parser.joinContinuation(head, "```json\n" + cutAgain + "\n```") !== cutAgain.replace(/[\r\n\t]+$/, "")) {
    fail("an answer started over and cut off again did not replace the first one");
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
  // Also when more nesting follows the stray quote, compact or pretty-printed.
  '```json\n{"subject":{"title":"A 5" screen","context":"x"},"items":[{"id":1}]}\n```',
  '```json\n{\n  "subject": {\n    "title": "A 5" screen",\n    "context": "x"\n  },\n  "items": [\n    {"id": 1}\n  ]\n}\n```',
]) {
  try {
    parser.extractJson(finished);
    fail(`a finished answer with a stray quote was accepted: ${finished}`);
  } catch (error) {
    if (error.code !== "INVALID_JSON") fail(`a finished answer with a stray quote gave ${error.code}: ${finished}`);
  }
}
// Cut off inside a string and then fenced (as some apps copy it): still cut off,
// also when the cut text itself ends on a bracket ("note [1]") or holds one
// that would close the answer ("art. 3}").
for (const cut of [
  '```json\n{"a":"a 5 screen","b":"cut off mid\n```',
  '```json\n{"a":"see note [1]\n```',
  '```json\n{"a":["x","set {b}\n```',
  '```json\n{"summary":"The rule (art. 3} applies and\n```',
  '```json\n{"a":{"b":"x}} y\n```',
]) {
  try {
    parser.extractJson(cut);
    fail(`a cut-off answer with a closing fence was accepted: ${cut}`);
  } catch (error) {
    if (error.code !== "TRUNCATED_JSON") fail(`a cut-off answer with a closing fence gave ${error.code}: ${cut}`);
  }
}

// A copy that misses the first character leaves the answer without its
// opening brace. Every member must be kept: the first nested object is not the
// whole answer.
for (const missingOpener of [
  '"contract":"c","lens":"l","subject":{"title":"t"},"framing":{"x":1}}',
  '```json\n"contract":"c","lens":"l","subject":{"title":"t"},"framing":{"x":1}}\n```',
  '\r\n  "contract": "c",\r\n  "lens": "l",\r\n  "subject": {"title": "t"},\r\n  "framing": {"x": 1}\r\n}',
  // Also after a lead-in line of prose, fenced or not.
  'Here is the analysis:\n```json\n"contract":"c","lens":"l","subject":{"title":"t"},"framing":{"x":1}}\n```',
  'Here is the analysis:\n```json\n"contract":"c","lens":"l","subject":{"title":"t"},"framing":{"x":1}}\n```\nHope this helps!',
  'Here is the analysis:\n"contract":"c","lens":"l","subject":{"title":"t"},"framing":{"x":1}}',
  // After several lines of prose, and in a code block among prose or beside
  // a format example.
  'Sure!\nHere is the analysis:\n"contract":"c","lens":"l","subject":{"title":"t"},"framing":{"x":1}}',
  'Here it is:\n```json\n"contract":"c","lens":"l","subject":{"title":"t"},"framing":{"x":1}}\n```\nI used "medium" where unsure.',
  'Here:\n```json\n"contract":"c","lens":"l","subject":{"title":"t"},"framing":{"x":1}}\n```\nand an example\n```json\n{"id":"X"}\n```',
  // Not indented, so a nested value opens at the start of a line.
  '"contract":"c",\n"subject":\n{"title":"t"},"framing":{"x":1}}',
  '"contract":"c","subject":{"title":"t"},"items":[\n{"id":1}],"framing":{"x":1}}',
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

// A continuation that carries on inside the cut-off code block and closes it
// joins like any other, whatever follows the closing fence.
for (const ending of ['–2024"}}\n```', '–2024"}}```', '–2024"}}\n```\nHope this helps!']) {
  const base = '```json\n{"subject":{"title":"Health passes","context":"EU 2020';
  if (!parser.continuesAnswer(base, ending)) {
    fail(`a continuation that closes the code block was refused: ${JSON.stringify(ending)}`);
  }
  const joined = parser.joinContinuation(base, ending);
  let context;
  try {
    context = parser.extractJson(joined).value.subject?.context;
  } catch {}
  if (context !== "EU 2020–2024") {
    fail(`a continuation that closes the code block did not join: ${JSON.stringify(joined)}`);
  }
}

// Text that only looks like a missing opener ("Legend:\n"high": …") is not
// taken for one when the answer has its own opening brace, and a blank line
// after a lead-in does not stop the opener from being restored.
for (const pasted of [
  'Legend:\n"high": strong evidence, "medium": mixed.\n{"contract":"c","subject":{"title":"t"}}',
  'Here is the analysis:\n"Strategic analysis": below\n{"contract":"c","subject":{"title":"t"}}',
  'Here is the analysis:\n\n"contract":"c","subject":{"title":"t"},"framing":{"x":1}}',
  'Here is the analysis:\r\n\r\n```json\r\n"contract":"c","subject":{"title":"t"},"framing":{"x":1}}\r\n```',
]) {
  let value;
  try {
    value = parser.extractJson(pasted).value;
  } catch (error) {
    value = error.code;
  }
  if (value?.contract !== "c" || value?.subject?.title !== "t") {
    fail(`a lead-in was misread: ${JSON.stringify(value)} from ${JSON.stringify(pasted)}`);
  }
}

// An untagged fence after answer text is read as closing the cut-off code
// block when that reading fits the answer, whatever prose follows it; when
// the text before it is prose, the fence opens the rest of the answer.
{
  const cutInString = '```json\n{"subject":{"title":"Health passes","context":"EU 2020';
  for (const ending of [
    '–2024"}}\n```\nLet me know if you want the "Biopolitical" lens too.',
    '–2024"}}\n```\nSources: [1] Reuters.',
  ]) {
    if (!parser.continuesAnswer(cutInString, ending)) {
      fail(`a continuation followed by a sign-off was refused: ${JSON.stringify(ending)}`);
    }
    let context;
    try {
      context = parser.extractJson(parser.joinContinuation(cutInString, ending)).value.subject?.context;
    } catch {}
    if (context !== "EU 2020–2024") {
      fail(`a sign-off was joined into the answer: ${JSON.stringify(ending)}`);
    }
  }
  const proseFirst = parser.joinContinuation(cutInString, 'Continuing the "context" value:\n```\n–2024 and beyond\n```');
  if (!proseFirst.endsWith('"context":"EU 2020–2024 and beyond')) {
    fail(`a lead-in line before an untagged fence was joined into the answer: ${JSON.stringify(proseFirst)}`);
  }
}

// A whole answer pasted after a line that only looks like a member
// ('"Power is everywhere": Foucault.') is kept, not read as cut off.
for (const pasted of [
  'Here is my answer.\n"Power is everywhere": Foucault.\n  {"contract":"c","subject":{"title":"t"}}',
  'Summary:\n"Biopower": the core.\nJSON: {"contract":"c","subject":{"title":"t"}}',
  'Sure!\n"high": strong. Answer: {"contract":"c","subject":{"title":"t"}}',
]) {
  let value;
  try {
    value = parser.extractJson(pasted).value;
  } catch (error) {
    value = error.code;
  }
  if (value?.contract !== "c" || value?.subject?.title !== "t") {
    fail(`an answer after a member-like line was misread: ${JSON.stringify(value)} from ${JSON.stringify(pasted)}`);
  }
}

// A lead-in with quotes before a continuation that was itself cut off again
// is not joined into the answer.
{
  const cutInString = '```json\n{"subject":{"title":"Health passes","context":"EU 2020';
  const quoted = parser.joinContinuation(
    cutInString,
    'Continuing from "context" (it was cut at "EU 2020")\n```\n–2024 and beyond"}',
  );
  if (!quoted.endsWith('"context":"EU 2020–2024 and beyond"}')) {
    fail(`a quoted lead-in was joined into the answer: ${JSON.stringify(quoted.slice(-60))}`);
  }
  const unquotedEnd = 'Continuing the "context" value\n```\n–2024 and beyond';
  if (parser.continuesAnswer(cutInString, unquotedEnd)) {
    fail("a lead-in before a continuation that adds no quote or bracket was taken for the rest of the answer");
  }
}

console.log("JSON parser checks passed.");
