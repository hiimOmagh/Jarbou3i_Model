# Reading a file for its passages (RESEARCH-1D)

The analyst has a document the external AI cannot open: paywalled, exclusive
or local. The app reads it on the device; the analyst chooses passages; the
passages go with the copied prompt like any other excerpt. "Read text from a
file" is the plain meaning here: the original file is **not** attached to the
AI conversation.

This page is `RESEARCH-1D`'s Definition of Ready, trimmed to what the first
three slices deliver (D1, D2: text files; D3: prompt caps and the review).
PDF files (D4) are next and are described at the end. Sources and excerpts are
[research-sources.md](research-sources.md); evidence is
[research-promotion.md](research-promotion.md).

## Ownership and non-goals

A file fills existing excerpts. It is not a second source store. The bytes and
the full extracted text live only in a bounded, temporary reader in the tab's
memory while the analyst chooses passages. What is saved is an ordinary source
and excerpt: no Blob, base64, file handle, local path, attached text, parser
metadata or new record field. Nothing about the stored contracts changes:
dossier formats 1 and 2, the database and its version, the case-file schema,
workspace format v3, workspace bundle v1, import policy and the 28 MiB case-file
limit. The analyst must choose the file again to read passages not yet saved,
and the screen says so.

Selected text stays the analyst's reading, unchecked. Reading is not a claim of
accuracy or authenticity. *Matches the source*, its reason, reopening and
*Make it evidence* keep their meanings; nothing is verified or promoted
automatically.

Non-goals: fetching paywalls or URLs, credentials, OCR, images, PDF (D4),
DOCX, drag and drop, AI summarising or ranking, keeping the complete document.

## What it reads

One file at a time, through a labelled native file input. Types: `.txt`, `.md`,
`.csv`, `.json`, `.html`, `.htm`. The extension is a hint; the bytes are
inspected.

- **Size**: at most 2 MiB, checked before a byte is read. At most 1,000,000
  UTF-16 units of extracted text; over that the whole file is refused, never
  cut.
- **Decoding** (`src/core/source-file-text.js`): UTF-8 (a BOM is dropped), or
  UTF-16 LE/BE when a BOM says so. Invalid UTF-8, an odd-length or unpaired
  UTF-16 body, NUL and other binary controls are refused. No replacement
  character is ever made. Line ends become `\n`.
- **Markdown, CSV and JSON** stay text as written: no rendering, formulas or
  normalising.
- **HTML** goes through a small DOM-free tokenizer (`createHtmlTextJob`) that
  follows the HTML tokenizer where hidden text depends on it, so text a browser
  keeps inside an element is not shown:
  - `script`, `style`, `title`, `textarea`, `iframe`, `noscript`, `noembed` and
    `noframes` hold raw text up to their own end tag (any case, `</x >` and
    `</x/>` included); a slash before `>` never closes them;
  - script data follows the `<!--` / `<script` escape and double-escape states
    exactly (`-->` leaves them, a second `</script>` ends a double escape), so
    `<script><!--<script></script>SECRET</script>` hides `SECRET`;
  - `head` (until `<body>`), `object`, `canvas`, `audio`, `video`, `select`,
    `svg` and `math` are dropped with their content; only `svg` and `math` may
    self-close;
  - comments end at `-->` or `--!>`, and `<!-->` and `<!--->` are empty
    comments; a doctype or instruction ends at the first `>`; a quote opens an
    attribute value only after `=`.
  **Refused, not followed.** The tokenizer does not copy the browser's tree
  building. Where that decides what is hidden, the file is refused whole:
  any tag token named `template`, `xmp` or `plaintext` (any case, opening or
  closing, with attributes or a slash or none, anywhere, also inside `head`,
  `select`, `svg` or `math`) makes the file "unsafe HTML". The reader says
  "This HTML cannot be read safely. Use a text version or paste a passage."
  (Arabic and French too), shows no text and saves nothing; the refusal code is
  `unsafe-html`. The same words inside a comment, a raw-text element, a quoted
  value, as text, or in a longer name (`<templates>`) are not tags and do not
  refuse. A `.txt` file holding the same characters is only text.
  Attributes and link targets are never text. Block ends become line breaks,
  table cells tabs, white space outside `<pre>` collapses to one space, and
  indents and trailing spaces at line ends are trimmed. **It is plain text, not
  a faithful rendering of the page**: it differs from a browser's `textContent`
  where the reader chooses to, and the node check pins a list of about 50 snippets
  against values taken once from Chromium (layout breaks aside), with these
  differences left out on purpose: a reference without its `;` stays as written
  (Chromium also decodes the old names such as `&amp`), and the content of
  `svg`, `math`, `noscript`, `select`, `object`, `iframe`, `textarea` and
  `title` is dropped here although a browser may show some of it.
- **Character references in HTML** are decoded once: the complete HTML 4 set of
  252 names (96 Latin-1 such as `&eacute; &nbsp; &laquo;`, 124 symbols and
  Greek such as `&alpha; &hellip; &rarr;`, 32 special such as `&amp; &quot;
  &oelig; &euro; &rlm;`) and `&apos;`, plus `&#N;` and `&#xH;`. Names are exact
  (`&Eacute;` is not `&eacute;`) and need their semicolon; a name outside the
  set, a reference without `;`, and a number that is NUL, a surrogate, a
  control (other than tab and line feed), U+0080–U+009F or past U+10FFFF stay
  as written. Nothing is repaired with a replacement character.
- **The work is linear, and the text is read in slices.** Every step of the
  tokenizer moves forward over the input (no rescans; a search for a comment's
  `--!>` is kept), and the output stops at the 1,000,000-unit limit. The *text
  emitted* is cut into slices of about 64 KiB with a turn for other work
  between them, so Cancel and the 15-second deadline are heard during a large
  file. A scan for the end of a raw-text element, a script or a comment, and
  for the end of a tag, is **not** cut: it runs in one step (about 9 ms for 2
  MiB), and a read that has ended stops the tokenizer at the next slice. The
  node check bounds worst cases (2 MiB of spaces in `<pre>`, of `<`, `&`,
  unclosed tags, comments, deep nesting) well under a second; they take tens
  of milliseconds.
- **Empty or blank output** says "No readable text found"; nothing is saved.
- **One reader at a time** (`src/features/source-file-reader.js`) with a
  15-second deadline and Cancel. A cancelled, replaced or timed-out read is
  never reported as a result.

Refusals are plain words in Arabic, English and French (not supported, too
large, no readable text, not UTF-8/UTF-16, binary, too long, could not be
read, took too long). The internal codes are `unsupported`, `too-large`,
`empty`, `undecodable`, `binary`, `too-long`, `read-failed`, `timed-out`.

## The reader and what is kept

- **Read text from a file** is in the topic step's *Your sources* fold. It says:
  read on this device, choose passages, the original is not kept or attached.
- The text is shown in a box that is the person's to read and select, not to
  change (`aria-readonly`; every edit is cancelled and a change that gets
  through is undone). It is not the `readonly` attribute because keys do not
  move the caret in a `readonly` textarea in Chromium or WebKit, which would
  leave keyboard-only selection out. The box scrolls and selects by keyboard. The analyst
  selects a passage and chooses it; it fills an editable passage box and a
  locator. A passage is at most 2,000 UTF-16 units after trimming; a longer one
  is refused with its length. A selection cutting a surrogate pair takes the
  whole character.
- A new source gets an editable title suggested from the file's last path
  segment, with controls and bidirectional overrides removed. It is never a
  path, never cut for the analyst. Link, dates and *Opened on* stay empty.
  A title over 500 units, or one already used by a source without a link, is
  refused with a way out: choose that source under *Add to*, or change the title.
- A new source and its first passage are **one change and one save**
  (`addSourceWithExcerpt`, one revision step). A passage for an existing source
  is one `addExcerpt`. Both go through the same write queue and one-replay
  rule as every source change, so capacity, source identity and the case are
  rechecked on replay. A passage for an existing source is made for the source
  as it was shown (id, title, link and the instant it was added,
  `addExcerptToSeen`): replayed on a newer record where it was renamed,
  relinked, or deleted and made again with the same id, title and link, it is
  refused whole, the passage stays in the form, and the screen says the source
  changed and the passage was not saved. The *Send to the AI* switch and the
  other dates are not its identity.
- A failed save keeps the passage and locator in the form, says "Not saved on
  this device", writes nothing, and can be repeated.
- The reader belongs to the case on screen. Switching or removing the case, or
  removing the source a file was for, closes it; a late result is dropped.
  Saved passages survive reload; unsaved selections do not.
- **A source made from a file starts with *Send to the AI* off.** Existing
  sources keep their choice. Saving is not copying.

## Words, access

All new words exist in Arabic, English and French together (`file…` keys in
`src/app.js`); numbers in messages follow the page's existing plain style.
The native input has a visible label and type/size help; errors are associated
with their field; progress, completion and refusal are announced through a
polite status region. Focus moves to the text after reading, to the failing
field on a validation error, to Cancel while reading and to the file input
after Cancel or Close. Layout wraps at 320 px and in right-to-left.

## Verification

- `tests/source-file-text-check.mjs`: decoding (UTF-8/16, BOM, invalid bytes),
  limits, refusals, hostile HTML, Arabic, surrogate pairs, passages, titles and
  the reader lifecycle with a fake `FileReader`.
- `tests/research-dossier-check.mjs`: the composed change.
- `tests/source-file-reader.spec.js`: a real file input in the four browser
  projects: reading, saving, reload, refusals, cancel, case switch, source
  removal, a failed save, Arabic and French.
- `tests/source-prompt-budget-check.mjs` (D3): the old formatter against the
  new section in both lenses and three languages, the exact boundaries with
  escaping, omission notices counted, surrogates, plural forms, and the cases
  no choice can fix.
- `tests/prompt-budget.spec.js` (D3): the review in the four browser
  projects (Copy and Preview refuse, keyboard, reset and close, every trigger
  that clears the choice, a box over the total, six sources that fit alone,
  Arabic/French, 320 px, kernel), and a Chromium-only matrix of both lenses
  and three languages comparing the review's numbers with the copied text.

## Prompt size and the review (D3)

Supplied material is capped, not the whole prompt: **8,000 UTF-16 units for
each registered source** and **32,000 for all supplied material**, the
Supplied sources box included. They are character budgets, not token
estimates; the schema and other context still take room, and no external AI's
window is promised. The existing whole-prompt character count stays.

- **What is counted** (`src/core/source-prompt-budget.js`, pure, no DOM): the
  text the prompt carries, measured the way the lens carries it. Strategic puts
  the context in a JSON string, so each quote, backslash, newline and control
  grows (`\"`, `\\`, `\n`, `\u0001`; a lone surrogate is `\udXXX`). Biopolitical
  breaks each closing-tag opener, so `</` counts as `&lt;/` (+3). A source's
  size is its block: the `[S2] title` line, link, dates, labels, each
  `> ` passage line, the line breaks and the omission notice. The total is
  the section (`Your sources:` and the blocks, with their `\n\n` breaks), the
  box with its heading, and the breaks that join them to what comes before. The
  framing and the topic are not supplied material. Exactly 8,000 and 32,000
  fit; one more does not (the node check lands on 7,999, 8,000, 8,001,
  31,999, 32,000 and 32,001 in both lenses, and the spec compares the review's
  numbers with the copied text).
- **Within the caps and nothing left out, the prompt is byte for byte what it
  was**: the node check holds the old formatter and compares both lenses and
  three languages; the golden-prompt and prompt-sources specs pass unchanged.
- **Over a cap, Preview and Copy both open the review instead** (one function
  decides for both). Copy copies nothing and does not advance to the answer
  step; the status says "Choose fewer passages before copying". The review is
  in the prompt step, under the buttons: for each source with passages, a
  checkbox per passage (its locator and start, and what it adds), "This source
  uses {n} of 8,000 characters", and a total line, "Supplied material uses {n}
  of 32,000 characters", in the page's language and digits. A passage is
  whole or out; nothing is cut, ranked or chosen for the analyst. Passages
  *differs* have already left the prompt and are not offered.
- **Leaving passages out is explicit.** The review says "{n} passages left
  out of this prompt" for the source (with plural forms in each language), and
  "No text from this source goes to the AI." when none is left. Inside that
  source's block the prompt carries a short note with the same count: only the
  passages above are supplied, infer nothing about the rest; when all are out,
  that no passage of the source is supplied. The note is counted in both
  budgets. A source can stay in by title and link alone, as before. After
  Copy or Preview the status adds the count.
- **Cannot be fixed by choosing**: a source whose details (title, link, dates)
  are over 8,000 on their own, the box alone over 32,000, or details, notes
  and box together over 32,000 even with every passage out. The review names
  which, and says to edit it or switch the source off. The box is never
  shortened for the analyst.
- **The choice lives in memory only**: ids of the passages left out, with a
  key of what it was made for (lens, analysis and page language, access, the
  box, the context, the case's id and revision, each source's details and
  switch, each passage's text and locator, whether it *differs*). It is checked
  whenever a prompt is made and on every change to the case, the box, the
  context or those settings: any difference clears it, closes the review and
  says "The case or the settings changed, so your choice for this prompt was
  cleared." A reload keeps nothing. It is never written to the case, a
  workspace, the draft or the prompt that is kept: a prompt is only kept when
  it fit. *Include every passage again* and *Close this choice* are in the
  review; closing keeps the choice in force until something changes, and the
  status after Copy says so.
- Hostile passage text (closing tags, forged headings, "ignore previous
  instructions", JSON-closing quotes) is only ever measured and carried as
  quoted lines, in both lenses; nothing reads it. `src/biopolitics.js` is
  untouched: its `</` rule is counted by the budget, not changed.

## Next

- **D4, PDF files with a text layer**: a pinned local PDF.js, lazy-loaded, only
  after a readiness gate (encryption detection, CSP, no fetch, deadline).
  Until then a PDF is refused as an unsupported type.
