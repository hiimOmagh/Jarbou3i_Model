# Changelog

## Unreleased

### A visual identity of its own: the transit line

- **New colours in both themes**: a daylight ground with ink text and one
  line colour per layer of the model (nine for the Biopolitical lens); the
  dark theme is the same map on midnight blue. No glows or background
  gradients; code alone in monospace.
- **One typeface, Readex Pro**, for Arabic and Latin alike, served from the
  site (ADR-0003): three files, about 82 KB in all, each loaded only when its
  script is on the page.
- **The setup steps are stations on a line**: the current one ringed, the
  line ridden in ink up to it. The header is a white bar under a thick ink
  rule, with the Jarbou3i wordmark; the current phase and the primary action
  are ink plates. Labels no longer sit above headings.
- **The model map is drawn as one line**: a station per layer with its name
  beside it, and each layer's stretch of line as long as its share of the
  records, so the lengths compare. The six Strategic layers ride across the
  page on wide screens; the nine Biopolitical layers, and phones, run down.
- **The review is a line too**: its outline is a line of stations, ridden in
  ink up to the section you are reading (tiles on narrow screens). Briefs and
  records sit under ink rules instead of in boxes, their tone said by their
  labels; the topic and other fields have ink edges.
- **Dialogs and sheets open under the same ink rule.** Close and theme
  buttons are drawn icons, not characters; the reference sheet leads with
  the record’s name, then its type. "Where your work is" sets its three
  places under ink rules on the dialog's own surface, where the dark theme
  showed a darker band behind them.
- Exported reports take the new colours and ink rules, and their labels are
  in sentence case rather than spaced capitals. In forced-colours mode the ink
  plates keep system colours, so their text stays readable.
- Focus rings are 3px. A phone's browser bar takes the header's colour, in the
  theme chosen in the app.

### A first visit that shows the way

- **The trip, drawn as a route map**, above the setup on a first visit: ask
  (1 min), your AI writes (2–5 min), check (5–10 min), then a report to
  share, with "You are here" at the first stop. The line draws itself as it
  appears (instant under reduced motion).
- Two ways in: start with your own topic, or try the example first; Skip
  sits first for the keyboard. It does not come back on its own, and visitors
  who have used the tool before never see it; "How it works", beside "Load
  sample" and in Commands, brings it back (AR/EN/FR).
- **Trying the example is a short ride**: the sample opens and a card at the
  foot of the view stops at four real places, each ringed in ink: the
  verdict, the line of layers, a claim with its evidence, and the export.
  Nothing is dimmed or blocked; "Next stop", "Leave the ride" and Esc are
  always there, and the ride ends at the export (AR/EN/FR, both lenses).
- Arabic year ranges read "من 2022 إلى 2026" in the topic and context
  examples, where a dash range showed reversed in right-to-left text.

### A clearer first step

- The current step, the section you are reading and the chosen option are
  ringed in ink, not red: line colours only mark the model's layers, and red
  stays for what blocks publication.
- Before an analysis, the model map explains its layers without a count of
  zero beside each.
- The guide no longer repeats the step's heading: on the topic it says what
  your topic becomes, and on the answer that a cut-off answer gets a prompt
  to continue (AR/EN/FR).

### The verdict first

- The overview opens with the publication verdict as its heading ("Do not
  publish yet", "Review needed" or "Publish-ready"), large, in its tone
  with its shape, under a rule in that tone, and one line of why. It was
  small text in a corner under "What matters first", which is gone; the
  topic now sits under "Overview" (AR/EN/FR, both lenses).

### A shorter Connections view

- *Every connection* folds each layer to its name and count, one row each
  under a thin rule. Opened, a layer names each record once, then each of
  its connections under it, instead of repeating the record on every line.
  The sample Biopolitical answer's Connections view is less than half as
  long (4,182px to 1,845px on a desktop, 6,967px to 2,197px on a phone).
- A search opens the layers it finds; cleared, the layers are as they were
  before it.
- A side of the map with no connection says "None" as a plain note.

### Plain words where people read most

- The verdict says why and what to do in plain words: "Parts of the
  analysis are missing" instead of "structurally weak"; "You can review the
  analysis, but it is not ready to publish: some of its evidence or claims need fixing
  first" instead of "targeted epistemic repair". The Biopolitical score
  rule no longer speaks of an "epistemic ceiling".
- "Where your work is" names its three places *Interrupted work*, *Your
  draft* and *Saved revisions*, not "recovery snapshot", "working draft"
  and "immutable revisions". The commit and history dialogs say what a
  revision does ("never changes earlier revisions") instead of
  "immutable" and "append-only".
- A saved workspace reads "Saved data intact" or "damaged", not "Integrity
  verified" beside a raw format version.
- The record inspector's last section is *Technical details*, not "Audit
  details", and gives evidence strength out of 5.

### Figures that do not contradict the verdict

- No score is green any more. Under a "Do not publish yet" gate, a green
  100/100 read as a pass the case had not earned. A low score still warns
  (amber under 56, red under 35); the rest are plain ink bars, and the
  legend has three bands, not four. The same goes for both reports.
- A claim the answer rates "High confidence" on evidence it rates 2/5 or
  less now says "High confidence on weak evidence" (amber), on its record,
  in the overview and in the report.
- The inspection directory counts audit concerns only when there are some:
  a green "0" read as a clean audit beside 0% source traceability.

### One word for one idea

- The outline names each section in its heading's own words: the
  Biopolitical "Protocol" station is now "Pillars" (Piliers, الركائز), and
  "Exports" is "Export" in both lenses.
- French says "Vue d’ensemble" for the overview in both lenses (it was
  "Synthèse" under one name and "Vue d’ensemble" over the other), and
  "Preuves et hypothèses", like "Preuves et explications".
- Arabic names the overview "نظرة عامة": "الخلاصة" now means only the
  analysis's conclusion, which the overview names right under its title.
- The review titles are in sentence case in English, like every other
  heading.

### Small things a screen reader or keyboard met

- On a phone or narrow window, a control reached by keyboard is no longer
  left partly under the floating *Back to the outline* button: it scrolls
  clear of it, in every browser.
- A record's connections read "Supported by: record". The dot that used to
  separate them was left alone at the end of its line, since the record
  always sits on the line below.
- The review's document is no longer given a name it cannot carry (the
  review itself is named by its title), and the design-system check now
  flags any such name.

### A setup that says where you are

- A Biopolitical case, by import or sample, now opens at the top of its
  review. Before, it stopped part-way down the model map, because the page
  scrolled while the review was still a loading note.
- A setup step skipped by jumping ahead is no longer drawn done: the topic
  station stays open until there is a topic.
- With no topic, Copy and Preview prompt show "Edit topic" beside them,
  leading back to the first step.
- One ink button per view: Continue is a plain button on the prompt step,
  where Copy prompt is the action, and the header's next action turns ink
  once there is an analysis to review.

### The review by keyboard

- Six buttons in the review (copy the next-step prompt, open the review
  ledger, export the review plan and the evidence map, copy the gaps
  prompt) now show the same 3px focus ring as every other button, not the
  browser's thin one.
- On a phone, a station of the review's outline reached with Tab now
  scrolls fully into view; before, one partly in view stayed mostly hidden.
- Once a case is open, the skip link says "Skip to the review" and leads
  there, instead of to the setup (AR/EN/FR).

### A record row says it opens

- Each record row ends on a small chevron pointing on (to the left in
  Arabic), drawn like the one on a disclosure, so on a phone, with no
  hover, a row still reads as one to press.

### Records named in rows, not boxes

- A record you can open from a list (a source cluster's evidence, the
  records that cite no evidence, the inspector's linked records and
  occurrences) is now a row under a hairline, its name then its ID in the
  line's colour, instead of a grey box; no more boxes inside records. The
  connections view keeps its boxed records: they are the stations of a
  diagram.

### The claim–evidence table on rules, its first column named

- The claim–evidence traceability table's first column had no header; it
  now says Claim (الادعاء, Énoncé), so screen readers name each row's
  column.
- The table loses its frame, panel fill, shaded header and boxed record
  buttons: the header sits on a rule, rows under hairlines. On a phone it is
  about an eighth shorter (1072px to 932px at 390px wide).

### Lists without bullets still read as lists

- Every list the app draws without bullets (the steps, the records, the
  revisions, the connections, the open items, the report's self-audit) now
  says `role="list"`, so Safari's VoiceOver still announces it as a list
  and counts its items. The design-system check flags any new one that
  does not, in the app and in both exported reports.

### The prompt step's three stops without boxes

- What to do with the prompt (open your assistant, paste and send, come back
  with the full answer) is now three numbered stops under a thin rule, not
  three boxes; on a phone they take about half the height (AR/EN/FR).

### Only warnings and errors in a box

- Status lines that report good news or give guidance (the topic and answer
  steps, the editor's format check, the workspace, history and approval
  status, empty sections) are now plain text; a warning or an error keeps
  its tinted box, so what needs attention stands out.

### Each revision's kind said once

- In the revision history, an imported or restored revision no longer
  carries a chip that repeats its kind; the current version keeps its chip
  (AR/EN/FR).

### The working dialogs follow the line

- The editor's commit, the revision history and the review ledger drop their
  boxes: what each dialog guarantees sits under a thin rule, revisions and
  tasks are rows, the pressed one under an ink rule, and a commit's or a
  revision's facts and changes are rows too, one line per fact on a phone
  (AR/EN/FR, light and dark).

### Focus stays in every dialog

- In the editor, revision history and review ledger, choosing a section, a
  revision or a task from the keyboard keeps focus on it as the list
  redraws. Undo, Redo and Save, when they become unavailable, hand focus to
  the dialog; "Append event" gets it back once saved.

### Focus stays in "Where your work is"

- Opening another workspace, removing a damaged one or resetting from the
  keyboard no longer drops focus behind the dialog: it returns to the
  dialog, where the next Tab carries on.

### Workspaces without boxes

- In "Where your work is", the list of workspaces sits under an ink rule like
  the three places above it, each workspace a row under a thin rule instead
  of a box. The open one no longer shows a greyed-out "Open" button, and the
  two resets come last, apart from the other actions (AR/EN/FR, light and
  dark).

### Connections without panels

- In the Connections view, the map around one record no longer sits in a
  grey panel, and each connection in the full list is a row under a thin
  rule instead of a grey box. A record's name in a link (its chip) keeps
  room between its lines when it wraps (AR/EN/FR, light and dark).

### The model's self-audit without boxes

- In a Biopolitical case file, the AI's checks of its own answer are rows
  under thin rules instead of four stacked boxes; a concern's rule is in the
  warning colour beside its label. The explanation above them and the AI's
  notes below them are plain text (AR/EN/FR, light and dark).

### Room at the edges on a phone

- On a phone the page now keeps 16px from the screen's edges (it was 9px
  under 480px wide), so text that sits on rules rather than in boxes, such
  as the welcome route, no longer runs close to the edge.

### The Strategic report follows the line

- The exported Strategic report drops its boxes too: the header, scores,
  thesis, formula and each layer open under ink rules; contradictions,
  scenarios and assumptions sit under thinner ink rules; the evidence table
  is ruled rows; a warning sits under a rule in its colour. Each layer's
  number is a station ringed in its line's colour, as in the app (AR/EN/FR,
  light, dark and print).

### The Biopolitical report follows the line

- The exported Biopolitical report drops its nested boxes: the header,
  figures and overview open under ink rules, sections are divided by thin
  rules, records sit under ink rules with their facts unboxed, and each
  pillar's number is a station ringed in its layer's colour, as in the app.
  Buttons and source links are pills (AR/EN/FR, light, dark and print).

### The layers ride the line

- The case file's layers are no longer boxes: each is a station on one
  line, its numbered ring in its layer's colour with its name beside it,
  and a stretch of line in that colour down to the next station. An open
  layer's records sit beside its stretch; Arabic mirrors it (both lenses,
  light and dark).

### Each open item said once

- The overview's diagnostics no longer repeat what the gate lists: the
  Biopolitical list of open items under the gate, the Strategic "Import
  health" list and "Next best action" are gone; the brief's recommended next
  action stays. The Strategic gate in the app now lists every structural gap,
  not only the first three; the report is unchanged (both lenses, AR/EN/FR).

### Plain words where the answer is pasted

- The answer step no longer speaks JSON: the field is "The AI’s whole
  answer", it waits for "the AI’s answer", and the prompt buttons say what
  they do: "Copy a prompt to fix it", "to complete it", "to continue it".
  The box for a cut-off answer is "The rest of the AI’s answer"; copy
  messages and the usage guide match (AR/EN/FR).

### The next action, asked of the AI

- The overview's recommended next action has a button, "Copy a prompt to do
  this", when it is a change the analysis can take (not the all-clear). The
  prompt asks the AI to make that change and resend the whole analysis; the
  analysis goes with it, so edits made in the app are kept. The reply goes
  in the reply box, kept across a reload, and the improved answer replaces
  the old one (AR/EN/FR, both lenses).

### Assumptions read in full

- An assumption now says what follows if it is wrong, as the report
  already did, and no longer repeats its risk level under the chip that
  states it. A lone assumption uses the section's width (AR/EN/FR).

### Counts without boxes

- Counts (records, occurrences, sources, connections) are figures under a
  thin rule instead of grey boxes, and the evidence summary in Inspection
  opens under an ink rule like the briefs. On a phone the counts wrap as one
  line instead of a box per count: about 180px less before the record
  search.

### The verdict sooner on a phone

- On a phone the review's outline is one line of stations again, across
  the page and scrolled sideways, instead of seven tiles: about 115px
  instead of 250, so "Do not publish yet" shows without scrolling. The
  station you are reading comes into the line's view by itself.
- The review's subtitle, which listed the outline's sections again, is gone
  (AR/EN/FR).

### A lighter header

- Density and theme moved into one Menu (⋯) at every width, so the header
  holds five controls instead of six. On a phone the header is three short
  rows: the wordmark with the language and the Menu, which also holds
  Commands there; the title; the lens and the save state. At 375px it is
  about 25px shorter (AR/EN/FR). The save state now ends the row, so the
  keyboard follows the rows on a phone.
- The command list still offers density and theme while they sit in the
  closed Menu, and gives focus back to the Menu's button after one runs.

### A place for every AI reply

- The reply to a completion, repair, language or connections prompt has its
  own box under the answer, labelled "The AI’s reply", shown once the prompt
  is copied and kept across a reload. Nothing is pasted into the answer it
  fixes: missing parts and new links are merged in, and a whole answer
  replaces the old one. Text with no JSON in it, or the prompt pasted back,
  is not read, and the answer stays as it is. Copy messages say where the
  reply goes (AR/EN/FR).

### Motion that says what happened

- When a setup step is done, the ink runs along the line to the next station.
- When an analysis arrives, by import or the sample, its outline draws itself
  from the top and the readiness and coverage bars fill from where a line
  starts (right to left in Arabic). Once per arrival: a reopened analysis
  does not replay it. Both are instant under reduced motion.

### Saying what the tool is for

- **One title for both lenses**: "Strategic and Biopolitical Analysis" (AR/EN/FR),
  where it said "Strategic Analysis Workbench" until the lens was switched.
  Under it, what the tool is for and who it is for: "Trace who wants what,
  and how lives are governed, with your own AI assistant. For anyone who
  wants to understand a story in the news, not only researchers and
  journalists." A phone's first screen keeps the topic field
  instead. The page title, description, share preview and app manifest say
  the same.

### Asking the AI for plain, concrete writing

- **Both prompts ask for named specifics** (AR/EN/FR): the actor,
  institution, law, place, date or figure rather than its category, who does
  what to whom, in short sentences, and never an invented name or figure to
  sound specific. In the saved replies, 75% of text values named no actor,
  date or figure (Biopolitical answers 78–99%, e.g. "Regulators, courts,
  data-protection authorities"); stock phrases were rare (8%).

### Saying what each prompt mode asks for

- **The settings step compares the three prompt modes** under the menu, in
  AR/EN/FR: Focused gives the shortest answer, Expert a longer one with
  evidence, assumptions and causes, Research the longest, with sourced
  evidence and counter-evidence. Screen readers read it with the menu.
  User feedback: the modes' differences, and that an answer's
  length could be chosen (it can: the modes set it), were not said.
- The UX-0 prototype's mode descriptions say the same; Expert no longer
  claims to add contradictions and scenarios, which Focused has too.

## 2.1.0-alpha.57 — Design-System Kernel and Real Answers (UIX-3 to UIX-5)

### Closing the editor while it saves

- **Close during a save waits for it**, then closes. It asked to discard
  the unsaved changes while they were being saved; a save that fails keeps
  the editor open with its message.
- **Review & commit opens only once the editor has closed.** Keeping the
  edits at the discard question left the editor open with the review over it.

### A reload on a busy device keeps the analysis being prepared

A reloaded page waited three seconds for the page it replaced to let go of
the tab. A busy browser can take longer, and the tab then started over
without its topic and pasted reply.

- **A reload waits for the page it replaces**, up to 30 seconds, then
  restores what that tab was preparing. A duplicated tab still keeps its
  own, apart from the tab it came from.

### Each record drawn once (UIX-5 slice D3)

Walkthrough D3. In a Biopolitical answer the evidence records were drawn in
full twice: in the Evidence & explanations layer and in the Evidence
section.

- **The evidence layer points to its section** instead of repeating its
  cards: "These records are listed once, in their own section", with a
  button that goes there. The layer keeps its place and its count.
- On a real French answer 14 of 55 records were two cards; now every
  record in both lenses is one card, and every other place links to it.

### The missing parts, listed where the note says (UIX-5 slice C4)

Walkthrough C4, in AR/EN/FR. An answer held back for missing parts said "3
parts are missing or invalid, listed below", but below was a closed panel
whose twelve bullets mixed those parts with review notes and raw JSON paths.

- **The parts are listed right under the note**, each named by its section
  and record, with what is wrong in plain words: "Intervention assessment ·
  Continuous remote activity monitoring: the AI wrote “A field study of…”
  where an evidence ID goes." The review details keep the full record,
  paths included.
- **Copying a prompt says what to do next**: "Send it in the same chat,
  then paste the reply in the answer box."
- **Arabic and French counts agree** with their number ("جزءان ناقصان …
  مدرجان أدناه", "1 partie … listée ci-dessous").

### Fewer walls in a Biopolitical answer (UIX-5 slice H, part 3)

Walkthrough D4, in AR/EN/FR. On real answers an evidence record listed up to
seven fields as "Not applicable", one row each, and the model's self-audit
was eighteen tiles, seventeen of them passes.

- **A record names the fields that do not apply on one line**: "Not
  applicable: Population · Denominator · Sample size". A French record went
  from seven such rows to one.
- **The self-audit shows the checks to look at**; the passes fold under
  "17 checks it says it passed". The conclusion section went from 2,024px
  to 1,644px on a French answer and from 1,055px to 706px on the sample.
- **Every folded part shows a chevron**, down when closed and up when
  open, so it reads as something to open.
- **Coded values read in sentence case** in English and French ("Not
  applicable", "Statut réglementé"), not "Not Applicable".
- **Arabic:** the self-audit note quotes the label it shows, «مستوفى».

### An evidence review that fits on the page (UIX-5 slice H, part 2)

Walkthrough D2, in AR/EN/FR. On four real answers the "Source clusters and
evidence gaps" panel ran to about 25,000px when opened.

- **The review queue names each reason once**, with its count, and shows
  its first five records; the rest fold under "48 more tasks". A phase
  with no task is one line; the others take the full width, their reasons
  side by side. One answer's queue went from 2,212px to 1,324px.
- **The claim–evidence table lists the records that cite evidence.** A
  record that cites none was a row of four dashes; such records are named
  once, folded under "57 records cite no evidence". The exported matrix
  keeps every record.

### Ratings that say what they rate (UIX-5 slice H, part 1)

Walkthrough A7 and D4 (the record inspector), in AR/EN/FR, the app, the
Biopolitical report and the prototype.

- **The inspector names an empty section once.** On real answers almost
  every record said "Not given in the record" five times (provenance,
  evidence balance, evidence trail); it now leaves those sections out and
  says on one line which ones the record does not give.
- **Confidence is named in full and is never red or green.** Biopolitical
  cards and the report said "Low" or "Faible" where the overview said "Low
  confidence"; risk and feasibility read "High risk" and "Low feasibility".
  A confidence is the AI's own claim, so no level reads as verified or
  failed: low is amber, the others neutral, in both lenses and the
  prototype.
- **English inspector values read in sentence case** ("Internal sample",
  "Unreviewed"), not as raw codes.
- **Arabic:** the evidence score is سلامة الأدلة (soundness), not نزاهة
  الأدلة (probity), and semantic warnings are about consistency (الاتساق).

### Readable details and counts (UIX-5 slice E, part 3)

Walkthrough E1, E3, H3 and H4, in AR/EN/FR, the app, the Biopolitical
report and the prototype.

- **The outline's counts name their unit** ("10 items", "14 records"),
  and the evidence entries name what they hold: "Evidence & assumptions",
  "Evidence & explanations". A count like "28" beside "Evidence test" read
  as a test result, not as a number of records.
- **Counts agree with their number** in every language, including all six
  Arabic forms: layer and pillar counts, the evidence clusters ("1
  evidence record", "cited by 2 records"), the report's section counts and
  the prototype's ("1 layer is empty").
- **The editor names each part** ("Legal framework", not
  `legal_framework`); the JSON path stays under the field.
- **Revision history:** rows lose the revision's internal ID; the parent
  reads "Revision 1" or "—"; the fingerprint shows its first 12 characters
  (the bundle keeps all 64). "Current head" is the current version.
- **Review ledger:** the event hash and the task's internal key are gone,
  and a task with no events says so instead of an empty list.
- **Record inspector:** the path moves to Audit details; the permanent link
  reads "Link to this record", not the URL; each occurrence names where the
  record appears ("resists · Workers and residents…", "Capture levels · 4")
  instead of a JSON path. In English, the format status reads Complete,
  not "canonical".

### Plain words for the app's jargon (UIX-5 slice E, part 2)

Walkthrough E2, in AR/EN/FR, the app, both reports and the prototype.

- **"Canonical"** (نظامي, canonique) is gone from what readers see: a
  record, its ID, "the analysis", "Analysis editor", "Export analysis as
  JSON", "Path in the analysis". A complete answer's status reads Complete
  (مكتمل, Complet).
- **"Contract"** (عقد, contrat) is the answer's **format** (الصيغة):
  "Format check failed", "Format version". The import's "contract gaps"
  are its missing parts (الفجوات, lacunes).
- **"Intelligence"** read as espionage in Arabic (استخبارات). The header
  now says "Research workbench" (أداة بحث وتحليل, Atelier de recherche).
  The evidence export is "Export the evidence review (JSON)", and the
  note under it says it is a summary for review, not for re-import.
- **"Hash-chained"** is "tamper-evident" (يكشف أي تلاعب, qui révèle toute
  altération). "Payload" is the content, and "schema fields" are fields.
  In Arabic, "integrity" (نزاهة, probity) is consistency (الاتساق) in the
  import messages.
- The prompts sent to the AI keep their technical terms, and so do the
  JSON keys, codes and file names.

### Arabic terms, French typography, metric names (UIX-5 slice E, part 1)

Walkthrough E4–E6, in the app and the prototype.

- **Arabic:** "prompt" is موجِّه, not the transliteration برومبت
  (58 places), and the Biopolitical lens has one name, السياسة الحيوية,
  where it had three (حيوسياسي, البيوسياسي, حيوية سياسية). "Targeted
  completion prompt" reads موجِّه استكمال محدَّد, so two forms of the same
  word do not meet. A review of all 1,902 Arabic strings fixed nine
  agreement errors: a verb's gender and number, an adjective's
  definiteness, and the draft's "not committed" status (غير معتمدة).
- **French:** a colon and a percent sign stand apart from the word before
  them, with a space that does not break ("Contre-preuve : …", "86 %"),
  where the app joins a label and a value or writes a percentage: the case
  file, both reports and the prototype. A source's full date reads in the
  page's language ("17 juillet 2026"); a partial one ("2026-07") stays as
  written.
- **Layer metrics** read by name, each over the model's own scale:
  "Actor Power Index 14/20", not "Actor Power Index (API)". The scales
  (/20, /15, /100) are the model's (docs/model-alignment-review.md).

### Connect the gaps (UIX-5 slice G3)

The Connections view lists the records no connection reaches (12 of 32 in
the sample) and asks the AI that wrote the answer to connect them.

- **Copy a prompt to connect them** copies a prompt, in the answer's
  language, that names each unconnected record and asks the same chat for
  new links only, never the whole analysis again. A link must join records of
  the answer, use the contract's relations, and be supported by the analysis:
  a record is left unconnected rather than given an invented connection.
- **Go to the answer box** opens it with the answer selected. The AI's reply
  is added after the answer's own links, checked like any answer ("Added 2
  connections to your analysis."), and imported as a new answer; the one it
  started from stays as it is.
- A reply's links can sit under `/links/-` or under `links`; one link alone
  is read as a list of one. Gaps in the reply (an ID that names no record)
  get the usual completion prompt.

### Connections view (UIX-5 slice G2)

The Biopolitical Connections section is one view instead of the relationship
explorer's three modes, two reading levels, overlays and 3D graph. It answers
what a reader asks of a few dozen connections: how connected the answer is,
what is around a record, and which connections there are.

- **Coverage first**: how many records have a connection ("20/32 Records
  connected" in the sample), how many connections there are, and how many
  cite evidence, flagged when none do. An answer with no connections says so.
- **Around one record**: the record in the middle, what points to it on one
  side and what it points to on the other, grouped by relation and read in
  the page's direction; stacked on a narrow screen. A neighbour, pressed,
  moves to the middle and takes the focus; a record list, grouped by layer,
  chooses any record. The record with the most connections starts there.
- **Every connection**: each one as a line, "record · relation · record",
  with the answer's reason, under the layer of the record it starts from. A
  search finds a record, an ID or a relation and says how many lines it shows.
- The inspector's **Show its connections** (Arabic: إظهار روابطه; French:
  Afficher ses connexions) opens the view on the record, in place of "Show in
  map".
- English relation labels read as words: "Supported by", "Countered by",
  "Governed by", "Feeds back", not `supported_by`.
- Removed with the explorer (`src/relationship-explorer.js` and its 28 KB
  stylesheet): the Story, Evidence Trail and Network modes, the Guided and
  Analyst levels, the focus workspace, the walkthroughs, the time and
  comparison overlays, the spatial 3D view, and saved views. Views saved
  under `jarbou3i.relationshipViews.v1.*` in the browser are no longer read;
  the time bands and comparisons stay in the report.
- The view is plain HTML on the kernel (`src/ui/connections.css`, classes
  `.j-conn*`), so it loads with the page instead of on demand, and reads the
  same to a screen reader as on screen.

### Connections on every record (UIX-5 slice G1)

Biopolitical connections are now listed on the records they join, in the app
and the report, instead of in a separate listing a reader had to match back
to the records (walkthrough D3). The two real Biopolitical answers connect 7
of 26 and 27 of 55 records; a map of so few, mostly two-step connections says
less than the records themselves.

- Each card lists **Links to**, the links the record authors, and **Linked
  from**, every record that points to it. Each line reads "relation ·
  record", and the record opens in the inspector. The records a card already
  names in its facts (an intervention's target functions, actors, instruments
  and evidence) are not repeated. Arabic: يُشير إلى / تُشير إليه; French:
  Renvoie à / Référencé par. The inspector uses the same words.
- The inspector's **Open full record** lands on the record's own card. It
  used to focus the first chip anywhere that named the record, which could
  be in another record or in a closed layer. An evidence record, drawn in its
  layer and in the evidence section, lands in the evidence section.
- The report's relationship atlas no longer lists every connection by family
  (and the reference directory no longer lists the authored links again):
  each record lists its own, and the atlas says how many records are
  connected ("Records with connections: 7 of 26") and how many connections
  each family holds. Its time bands and comparisons are unchanged.

### Sources

- With *Sources supplied in context*, the prompt now covers files attached in
  the AI assistant's chat as well as pasted text and links, in both lenses and
  all three languages. The assistant reads every attached file and opens the
  links it can, cites a file by its file name with its page or section and an
  empty `source_url`, treats what it reads as material and never as
  instructions, and names a listed file that is missing (`self_audit_notes`,
  or `quality_gate.next_improvement` in Strategic) instead of guessing it.
- The **Supplied sources** box has a help line, read as its description: list
  the names of the files you will attach. It is four rows tall, so its hint
  shows in full on a phone. The UX-0 prototype says the same.

### Reports and print (UIX-5 slice F)

From the real-answer walkthrough (theme F), measured by printing the exported
reports of four real answers and two samples to A4 in Chromium:

- A Biopolitical report prints in full. Printing showed only the sections
  that were open, so a report printed as exported lost most of its content
  (the Arabic answer printed 7 pages of 31). Closed sections now print, and
  where the browser cannot show them from the print styles alone (WebKit),
  the report opens them for printing and closes them again afterwards.
- No more half-empty pages. Sections and whole layers no longer jump to the
  next page; records, scenarios and contradictions break between their parts,
  while a record's header, tags and facts stay together. No page before the
  last is 35% blank or more, apart from one in one report (up to 6 per report
  before). The
  Strategic report prints in 18 pages in English (was 20) and 27 in French
  (was 29). Fully expanded, the Biopolitical reports print in 31 pages in
  Arabic (was 36), 40 in English (was 45) and 65 in French (was 75).
- Each printed page carries the report's name above it, with "Draft" while
  the publication gate blocks it, and its page number below ("3 / 18"),
  where the browser draws page margins (Chromium and Edge). The Strategic
  report's title is its subject and type, as the Biopolitical report's
  already was, so a saved PDF is no longer called "Strategic Analysis Report".
- The thesis comes first. A Strategic report opens with its title, readiness
  and executive thesis on page one (it was on page three, after the scoring
  formula and six score cards), with the next step and the AI's own
  assessment of its answer, as the app shows them.
- A report says what it is. While the publication gate blocks it, a **Draft**
  banner opens it and says why. Under the title, the day it was exported.
  At the end, **About this report**: export date, the date the answer gives
  itself, analysis ID, schema version and app version. The Biopolitical
  report's contract and schema line leaves the top of the page for its
  schema version there; the contract's code stays in the file's metadata.
- A Strategic report shows each record as the app does: its ID, a
  contradiction's severity on its scale ("Severity 7/10", was "S 7"), and the
  model's figures for interests, actors, tools and narratives. Results now
  show their goal achieved, cost-benefit and effect on the balance of power,
  in the app as in the report; before, neither showed them. An assumption
  that states no consequence has no empty "If wrong: —" row. The UX-0
  prototype reads severity out of 10 and leaves out the empty row too.
- The AI's weakest layer reads as the layer's name when the answer gives a
  layer's key ("results"); it printed the layer's name and description
  joined by a comma.

### Relationship explorer on the kernel (UIX-5 slice B)

From the 2026-10-15 audit (H2) and the real-answer walkthrough (theme G),
measured with the Biopolitical sample in Arabic, English and French:

- The explorer's controls are kernel controls. Reading (Story, Evidence
  trail, Network), Layout, Detail level and Overlay are each a radio group
  under a visible label: one tab stop each, arrows move the choice, and in
  Arabic left and right follow the line. Before, only the reading was a
  radio group, under the explorer's name, and the layout group had no name.
  Buttons, fields, selects and the two folding panels follow the kernel's
  contracts, are 44px tall, and have a visible focus ring.
- No text under 12px: 40–41 labels per view were 8–11.5px. Weights follow the
  kernel (600/700), and text on the accent is the kernel's on-accent colour,
  so step numbers and the walkthrough's Next button stay readable in the dark
  theme.
- The reading comes first. Detail level, overlay and saved views fold into
  **View options**; filters and layers stay in **Filters and map controls**,
  which still opens with Analyst. The connection legend shows only on the
  network map, where lines are drawn. The intro is a section heading in the
  case file (an h3, like its neighbours), not a card. Controls before the
  first relationship: 642–674px on a phone (was 916–1003px) and 566–606px on
  a 1280px desktop (was 662–678px).
- Spatial is offered only where it can be drawn. On a phone it is left out of
  Layout, not shown disabled, and View options says why.
- French saved-view buttons wrap rather than clip, and "Connections list" no
  longer breaks inside a word.
- The network map fits its width: lanes were as wide as their longest label,
  so the map scrolled sideways (782px shown of 2,100–2,312px). Connections
  are drawn over the lanes and under the records; before, the lanes covered
  them and they showed only in the gaps.
- Story paths and the evidence trail lay out by their own width, not the
  window's. Beside the case outline or an open inspection, a wide window is a
  narrow view. A story's steps sit side by side while each stays readable,
  then scroll; a claim sits over its supporting and counter-evidence, then in
  one column.
- An empty view says why and offers the way back. If a search or filter
  matched nothing, it shows "No records match the current filters" with
  Reset filters. If the reading has no connections and no filter is set, it
  says "No connections to show in this reading yet" and offers Show the
  network. Before, it blamed the filters in both cases.

### Phone first screen and density (UIX-5 slice C)

From the 2026-10-15 audit (M1, M2, L3) and the real-answer walkthrough (B2–B4),
measured at 390×844 before and after:

- The topic field is whole on a phone's first screen in Arabic, English and
  French (it ended at 874–904px, past the 844px fold; now 782–812px, and
  805–811px with the wider Verdana standing in for Linux fonts). Three causes:
  - The empty, hidden banner region kept its own display, so its margin and
    the page's gap left 36px of blank space above the guide at every width.
  - On a phone the header's next action duplicated the guided flow's Continue
    during setup: two filled primary buttons. It now waits for an analysis.
  - At 620px and below the flow is one card: the step inside it lost its own
    border, and "Step 1 of 5" is read to screen readers only, since the step
    list above already marks the step.
- One card less on a phone (620px and below): cards take the compact
  padding, and the case document is the review panel's body. Score cards start
  26px from the edge, not 59px, and text that was 201px wide is 267px.
- The case file comes sooner on a phone: with an analysis open, the model map
  keeps each layer's name and records, two to a row, and leaves the
  descriptions to the case file's layers (the case file started at 2,499px; now
  1,937px with the sample).
- Below 1120px the outline scrolls away with the page; once it has, a "Back to
  the outline" button brings the reader back to it and to the current
  section's entry.
- Below 900px density and theme sit in a Display menu under one button, each
  named ("Density: Comfortable", "Theme") instead of the bare "↕" and "◐", and
  the command palette goes icon-only. The French tablet header loses its extra
  row (163px to 111px). The menu stays on screen where the header wraps its
  button to a row's start, and closes once a choice is made. Browsers without
  popovers keep the controls in the header's row. Density's icon is now drawn,
  not a "↕" character.
- The open case's title has its own header row at every width, not only below
  1024px: beside the header's controls a real title showed a few letters.
  With an analysis open the header changes by one short row: 32px taller in
  Arabic and English at 1440px, in Arabic at 1280px, and in French at 1280px;
  17px shorter in English at 1280px and French at 1440px, where the squeezed
  title had pushed the controls to a row of their own.
- The Biopolitical report keeps 16px gutters on a phone (it had 8px).

### Real AI answers (UIX-5 slice D)

From a walk through eight real ChatGPT answers, every section opened and the
report exported and printed (`docs/audits/2026-10-15-real-reply-walkthrough.md`):

- A no-source answer's placeholder evidence no longer counts as a traceable
  source. Its locator names the prompt's instruction, not a source, yet it
  gave "Source traceability 100%", which raised the decision-readiness cap,
  and "1 traceable" in the source groups. It now reads 0% and 0, and is
  listed for review as an untraceable source. The rule that names the
  placeholder is still the Biopolitical one; `assessEvidenceProvenance`
  takes it as `isPlaceholder`.
- After import, the answer box says "Imported: this is the analysis under
  review" instead of "Valid JSON. You can import the analysis now", also
  after a language change, a reload or a sample. The guide says the review
  is ready. The toast says to start with the overview, not "the engine
  layers".
- An answer held back for missing parts is shown as a step to finish, not a
  format error: the status is amber, and the guide says "Nearly there: a few
  parts are missing. Ask the AI for just those." A real format error stays
  red.
- The completion prompt quotes what the AI wrote where an evidence ID was
  expected (ChatGPT wrote a sentence about the study) and lists the
  existing evidence IDs with their titles, so the AI can pick the right one.
- The import details list a message shared by many records once, with all
  their paths ("Evidence is placeholder, untraceable, or not fully verified"
  appeared 13 times), and say how many groups are not shown. The blocker
  line reads "Evidence awaiting independent approval: 13 of 13", without
  the plural errors of "1 of 1 evidence records" and "1 preuves sur 1", and
  no longer says "Draft import is allowed" when the import is held back.
  Its group headings are h3 under the step's h2.
- The Strategic report gives the analysis's own next improvement, as the
  overview does, not the structure check's line. Scenario probabilities in
  the report keep a neutral ring: a 20% scenario is not a failing score.
- The reference inspector is a dialog built from divs: its `aside`, `header`
  and `footer` added a complementary region and a second banner (axe).
- Strategic records have no field to cite evidence, so their links now carry
  the citations: a link between an evidence record and another record cites
  it, and a `contradicts` link cites it as counter-evidence
  (`linkCitation`). The evidence trails, back-references, "uncited" counts
  and review tasks follow. A Strategic answer whose evidence no record cites
  scores at most 50 for evidence grounding, and its explanation says to link
  the evidence to the records it supports or contradicts.
- "Share readiness" is "Structure check" (فحص البنية, Contrôle de structure):
  it drops with each structural warning and does not say the analysis is
  ready to share. Its hint says so. ("Structure complete" was proposed, but
  the overview already shows "Structural completion".)
- The Strategic overview shows the analysis's own weakest layer and
  publication risk as "The AI's own assessment, not verified", the layer
  named in the page language.
- The Biopolitical self-audit shows the model's "pass" as its claim: a
  neutral status, not green, under a line that says a pass is not a
  verification; the report does the same, and its "concern" is amber, not
  red.
- The import details' summary counts blockers and repairs with the plural
  forms of each language ("عائقا نشر", "2 blocages de publication",
  "لا إصلاحات").

### Results

- The overview gives one publication verdict. In Strategic, the brief said
  "Blocked" while the quality gate below it said "Review needed" or "Do not
  publish yet"; in Biopolitical it said "Approved" or "Blocked" where the
  gate said "Publish-ready" or "Do not publish yet". The brief now repeats
  the quality gate's verdict and tone in both lenses and all three
  languages, and the Strategic report's "Quality gate" line does too.

### Reports

- The exported Biopolitical report takes the case file's look, on a theme
  that carries the kernel's tokens (`src/report-theme.js`, kept equal to
  `src/ui/kernel.css` by `tests/ui-kernel-check.mjs`): flat panels, the
  kernel's status shapes, the data font for figures. It is light by default
  and in print, dark on a screen whose system is dark.
- Its header gives the app's verdict: "Publish-ready", "Review needed" or
  "Do not publish yet" with its tone, where it said "Passed" or "Blocked";
  the appendix's publication line does too, in all three languages. The app
  and the report share one rule for "Review needed" (`reviewable()`).
- A section's record count no longer overlaps its open/close sign. Buttons,
  contents links and section headers are at least 44px tall. The toolbar
  holds only its buttons, at the inline end. Cards in a grid are spaced
  evenly.
- The exported Strategic report takes the same look on the same theme, with
  dark mode. Its score rings take the app's score bands and colours; its
  "Quality gate" line takes the gate's tone and status shape. It drops the
  app stylesheet it carried and never used (about 220 lines).
- In the Strategic report, a scenario's probability ring shows again (a
  rule for the layer's item count had blanked it). On a phone, each
  evidence row is a card with its labels instead of a table squeezed to
  one word per line. A source's date keeps its order in Arabic.
- The visual audit adds the Strategic report (top, evidence, top in dark)
  in each language on desktop and phone, and the Biopolitical report's top
  in dark.
- The Biopolitical report's decision readiness has a bar in the app's score
  band colours, as the Strategic report's ring and the app's overview do.
- In Arabic, a figure keeps its percent sign on its right ("75%"), as in the
  app: the Strategic report's rings and coverage line showed "%75". The
  Biopolitical report's contract line and reference types are set in the
  interface font without letter spacing, so their Arabic letters stay joined.

### Interface

- The header's next action follows the guided flow: it names the task of the
  step you are on ("Choose a lens", "Check the settings", "Copy the prompt"),
  then "Continue to import" once the prompt is copied. It said "Start with a
  topic" on every step until the prompt was copied. AR/EN/FR.
- In Arabic, the answer box and the continuation box lay pasted JSON out left
  to right; their hints still read right to left while they are empty.
- The publication gate has one name in each language, in the app, the
  overview and both reports: "Publication gate", "بوابة النشر", "Contrôle de
  publication". The app and the Strategic report said "Quality gate" ("بوابة
  الجودة", "Barrière qualité"); the French overview said "Seuil de
  publication".
- The setup step list and the topic examples are 44px targets (they were 40
  and 36px), and a reference chip on one line has a 44px hit area with no
  change in look.
- The five working dialogs no longer add a second banner landmark: their
  heads are `<div>`s, not `<header>`s. This was the app's only axe finding.
- The visual audit's Connections screenshots show the relationship explorer
  at every viewport; on desktop and tablet they showed the case file's top.
- The header's language options (and every segmented option) are 44px
  targets: the hit area spans the track's padding, with no change in look.
- "The analysis is shown but was not saved on this device" comes as a
  warning, with the toast's warning edge, in all three languages.
- The visual overhaul (UIX-1 to UIX-4) is complete: every screen and both
  exported reports are on the design-system kernel. The execution plan and
  the capability map say so.

### Design-system kernel

- Moves the case file's layout onto the kernel: the outline beside the
  document, and below 1120px one column with the outline in three columns,
  then two. Both are flat kernel panels instead of the legacy gradient frames;
  headings keep their sizes.
- The prompt and answer steps' status lines are kernel notes, their tone a
  `data-tone`, like every other status line.
- Retires the 80 legacy selectors this leaves unused, including dead ones in
  media queries the alpha.56 cleanup did not read.
- Moves references and their inspector onto the kernel (`src/ui/reference.css`).
  A reference is a `.j-ref` button with a DOM contract; the inspector is the
  kernel dialog frame as a side sheet (a bottom sheet on a phone), and its
  scrim closes it. Retires the 74 legacy selectors they used.
- The relationship map's focus mode sits on the kernel's drawer layer, so the
  inspector, a dialog, opens above it.
- Adds the parts the case file's sections share (`src/ui/section.css`): a lede
  under a heading, record cards (`.j-rec`), a 1–5 meter with a DOM contract
  (`.j-meter`, named as its score) and a data table that scrolls in its frame.
- The Strategic evidence section is record cards: each evidence record with its
  basis and confidence as chips, its strength as a meter, its source and its
  counter-evidence; each assumption with its risk as a chip and a leading edge.
  The Biopolitical evidence intro is a kernel lede.
- The evidence summary in the inspection section (`src/ui/evidence.css`) is a
  kernel disclosure: source clusters and evidence gaps as cards, the review
  queue in three phases, the claim–evidence matrix as a kernel table. Its
  records open the inspector as 44px buttons; text that was 8–10.5px is now at
  least 12px. Retires the 129 legacy selectors these views used.
- The Biopolitical records, in every pillar and in the evidence section, are
  record cards: their qualifiers as chips, then the statement, its summary, and
  its facts and lists as one description list at a reading width. The chips
  are no longer coloured: a code such as "Low" does not say whether it is a
  confidence or a relevance, so its colour could mislead. A long code wraps
  inside its chip, so the cards keep to a 320px page (400% zoom). Retires the
  17 legacy selectors they used.
- The inspection directory is on the kernel: its heading beside its counts, a
  kernel search field, and every record as a card that opens the inspector, with
  its ID, type, layer and confidence. The counts are a shared part
  (`.j-stats`); on a page 620px wide or narrower each count is a row, so long
  names such as "Occurrences indexées" no longer spill out of their boxes, in
  the evidence summary too. Retires the 30 legacy selectors the directory used.
- The Strategic contradictions and scenarios are record cards. A contradiction
  shows its type, confidence and severity as chips, then its actions, its
  interpretation, its signal, its impact and the layers it touches. Its
  severity reads "Severity 4/10" instead of "S 4", and from 6/10 it gives the
  card a leading edge. A scenario shows its probability and timeframe as chips,
  then its drivers, early signals and disproving conditions. The "Type" line
  that repeated the type chip is gone. Retires 71 legacy selectors, among them
  the probability ring only scenarios used.
- The model engine is on the kernel (`src/ui/engine.css`). The engine map is an
  ordered list of numbered steps, one per layer: its name, description and
  records, and a bar of their share of the fullest layer's in place of the
  percentage ring, which had no target to measure against. The step whose layer
  is open in the case file is marked `aria-current`. In the case file, each
  layer is a heading whose button opens its records, with a chevron that says
  whether it is open. A Strategic layer's records are record cards: their ID,
  codes and confidence as chips, their rationale, and their model score as a
  fact ("Actor Power Index (API) 18/20"). The buttons no longer hold block
  elements (`div`, `p`, `h4`), which HTML does not allow there. Retires 115
  legacy selectors.
- The engine panel's state no longer reads "No analysis yet" over an imported
  analysis after a redraw of the shell alone, such as going to the map.
- The overview's brief is on the kernel (`src/ui/brief.css`). *What matters
  first* gives the publication gate as a status (shape, colour and word), the
  conclusion, and decision readiness and analytical coverage as figures whose
  bars now fill to their value (they were full whatever the value), coloured
  by the score legend's bands. *How the conclusion is built* is an ordered list
  of five record cards whose chips are the kernel's 12px chips (they were 8px)
  and whose links are 44px buttons. Their headings sit one level under the
  overview's (`h4`, then `h5`), and a step's count is read as "2 items" rather
  than an unnamed figure. Retires 88 legacy selectors.
- The overview's detailed diagnostics are on the kernel too. The six scores are
  figures out of 100 over bars, three to a row, in place of percentage rings
  that drew an empty grey circle; the score rule ends on a legend of the bars'
  colours, its ranges read left to right in Arabic as well. The quality gate is
  a kernel note toned by its verdict, the caps on readiness are kernel counts,
  and the open items are kernel notes. The executive thesis block and the score
  box beside the diagnostics are gone: they repeated the brief's conclusion,
  gate, figures and topic word for word (the Strategic score box also said
  "محظور", banned, where the brief says "غير معتمد", not approved). Import
  health is a heading under the overview, not a second section heading.
  Retires 140 legacy selectors (15 KB of `styles.css`).
- The Biopolitical conclusion is on the kernel. The calibrated judgment's
  groups are record cards; the model self-audit is a list of checks, each
  verdict a kernel status said in words and in shape. A check that does not
  apply is grey and hollow, where it was green like a pass, and a concern is
  washed. The audit's questions are 14px (they were 12px). Retires 18 legacy
  selectors.
- The case file's outline is on the kernel. An entry is the section's name
  over what it holds, its count beside them; the reader's place is tinted and
  barred as before, but no longer bolder, since a bolder name can wrap and move
  the page. The coloured orbs and edges, a different hue per
  section that said nothing, are gone. On a phone a name no longer loses its
  last letters ("Connection" for "Connections"): it breaks between words, and
  a count that does not fit goes under it. Below 940px the entries are
  bordered tiles. Retires 24 legacy selectors.
- The engine and the review are kernel cards, each headed like the setup steps:
  its number and name as a label, its title and the line under it. The
  engine's analysis state is a kernel status, hollow until an analysis is
  imported (the old chip's grey dot said nothing). Both sections are named
  regions. The shell's nav lands them 16px under the top of the view; they
  landed 184px down, an offset kept from a header that no longer sticks.
  Retires 35 legacy selectors.
- The notes that say the relationship map or the biopolitical graph is
  loading, or could not load, are kernel notes: loading is neutral (it wore
  the green of a success), a failure is toned `warn` with a kernel *Try again*
  button under the sentence. The review document's rows start at its top, so
  a lone note there keeps its height instead of filling the frame.
- Retires the legacy stylesheet's last view rules, 125 selectors no element
  carries any more: the welcome card, the old buttons, cards, fields, chips and
  their colour classes, and the score and source notes. `pill()` and the two
  class helpers only it called go with them, as do 13 custom properties
  nothing reads and the engine panel's own padding, which overrode the card's
  and ignored compact density. `src/styles.css` is down from 17.6 KB to
  5.8 KB.
- The toast and the skip link are kernel controls, the toast as in the UX-0
  prototype: a raised panel instead of an inverted block, a failure marked by
  a red leading edge instead of a red fill, as wide as its message up to
  560px (it wrapped at half the view, so a phone showed a narrow column). It
  still waits below the view as a live region, and now fades as it slides,
  leaving faster than it comes. The skip link is 44px high with the kernel's
  focus ring. The save light has a DOM contract (a button that opens the work
  panel, with a known state) and is 44px high like the header's other
  controls; it was 32px.

### Accessibility

- At 400% zoom (320px) the case file no longer clips what does not fit: the
  legacy document frame hid its overflow. Record cards, their chips and the
  relationship filters now wrap to the width instead, in all three languages.
- In Safari, closing the inspector gives focus back to the reference that
  opened it while the relationship map's stylesheet is still loading. WebKit's
  `focus()` did not apply the page's removed `inert` before that stylesheet
  arrived, so focus fell to the page; this was the WebKit test that failed CI
  intermittently.
- An import or a sample scrolls to its review when it opens, not when its save
  ends. A save that finished late moved the page under a click already begun,
  and the click was lost; in WebKit this failed a CI import test now and then.
- The evidence summary's claim–evidence matrix is a table with row headers;
  its balance, cluster basis and gap counts are words, their tone only added.

### Tests

- The relationship-explorer tests wait for a folding panel's toggle event
  after opening it. A control pressed before that event re-rendered the
  explorer with the panel closed, which hid the next control (a CI flake in
  the saved-views test).
- The crash-recovery tests wait for the recovery snapshot to be stored before
  they reload, instead of a fixed 700ms that a loaded machine could outrun.
- A regression test holds the relationship map's stylesheet back and checks
  that closing the inspector still returns focus; it fails in WebKit without
  the fix.
- The axe checks end finite animations before they run: a step panel fading in
  blended its text into the background, and contrast read 3.27:1 mid-fade.
- A test checks the Strategic evidence cards: kernel contracts, the strength
  meter named as its score, and an assumption's risk in words.
- The suite drops what it ran twice. The lens-import spec is gone: its legacy
  refusal was a subset of import validation's, its lens switch is covered by
  the AI-interchange test (which now also checks the review title), and its
  Strategic citation repair and keyboard pillar check moved to import
  validation and the accessibility test. The cross-locale export spec merged
  into the export contract (Arabic and French; English already ran there, now
  with its document language). The inspection spec's ten language tests are
  four, one per lens and language, with the same checks. The 27-variant prompt
  matrix, string logic that is the same in every engine, runs on Chromium
  only. A report test that repeated the report renderer check is gone.
- The Node checks no longer read the specs' source: 156 lines of
  `static-check.mjs` pinned spec text, and one pinned CSS the app no longer
  renders. `qa-check.mjs` and `source-of-truth-check.mjs` are gone; their
  checks that nothing else made (index.html stays a thin shell, the module entry
  point and the order of its side-effect imports) moved to `static-check.mjs`.
- Firefox runs in two CI shards, like WebKit in four: as one leg it was the
  slowest, at about eight minutes.

## 2.1.0-alpha.56 — Case File Interface (UX-0)

### Product decisions

- ADR-0002 selects UX-0 concept B (case file) as the target experience, waives
  the Gate 0 human benchmark and authorizes UIX-1 and UIX-2. The app's screens
  are rebuilt to the prototype's structure, one at a time.
- `docs/model-alignment-review.md` keeps the 2026-10-05 proposal comparing both
  lenses with their reference models. Nothing in it is implemented yet.

### Accessibility

- Loading or importing an analysis moves focus to the review heading.
- A newer toast is no longer hidden by an older toast's timer. Failure toasts
  are shown as failures, and a toast that repeats an on-screen status message
  is not announced twice.
- Every Biopolitical review section, inspection included, has a title and a
  hint in Arabic, English and French.
- A cut-off answer's message points up to the box for the rest of the answer,
  where it now appears.
- Closing a reference inspector gives focus back to the reference that opened
  it before hiding, so WebKit no longer drops it.

### Design-system kernel (UIX-1), modern shell (UIX-2), guided flow, case file, work panel, editor, commit, history, import and export

- Rebuilds the global header and workspace bar on the kernel, in the case-file
  direction:
  - the open case's title as global context;
  - the save state as a status with shape, colour and text;
  - the current phase marked by more than colour;
  - one primary next action whose arrow mirrors itself in Arabic;
  - 44px icon buttons on phones.
  All existing IDs and behaviour are kept. The rest of the app keeps its
  styling for now.
- Rebuilds setup as the prototype's guided flow, one step at a time:
  - topic, lens, settings, prompt, answer, with the mascot guide beside them;
  - the guide explains each step and reacts to the pasted answer;
  - a step list to jump to any step, three example topics, Back and Continue;
  - the welcome card, stage bar and how-to list it replaces are removed.
  Every control keeps its ID and behaviour; a saved import step reopens on
  the answer. Unlike the prototype, the mascot does not bob while idle: that
  endless animation cut WebKit to 2–6 frames a second.
- Rebuilds the review as the prototype's case file (UIX-3):
  - one document in reading order, every section in place, instead of tabs;
  - an outline beside it jumps to a section, focuses it and marks where the
    reader is (the section in focus, else the one at the top of the view);
  - the Model map's cards open the chosen layer or pillar in the document;
  - the relationship map still loads only when its section comes into view,
    or at once when its outline entry is chosen.
  "Show in map" on a biopolitical record works again (it called an undefined
  helper).
- Rebuilds work saving as the prototype's work panel (UIX-4):
  - the header save state is now the save light: a button that also says when
    a saved draft is not committed or a recovery snapshot was found, and opens
    the work panel; the separate Workspaces button is removed;
  - the panel, "Where your work is", shows the open workspace's recovery
    snapshot, working draft and immutable revisions, each with its actions
    (restore, discard, edit, review and commit, revision history), above the
    list of workspaces;
  - banners above the flow and the case file raise a save that another tab
    got to first (with a way to reopen the latest version), a recovery
    snapshot, a damaged workspace and being offline.
  The open workspace's row no longer repeats the actions its cards hold.
  Edits discarded when closing the editor no longer leave a recovery snapshot
  behind, and the hidden file input of "restore a workspace file" is named by
  its button.
- Rebuilds the canonical editor on the kernel:
  - Undo, Redo and the unsaved state beside "Review & commit" and Save;
  - the analysis's content first, its identity and metadata after it, and a
    "to fix" count on each section with problems;
  - the field's check in shape, colour and text, with the field marked
    invalid when it is;
  - its labels and button names in AR, EN and FR (some were English only).
  An edit still open in another tab is no longer offered as a recovery
  snapshot, and discarding edits no longer deletes another tab's snapshot.
- Rebuilds the commit (resolution) and revision history dialogs on the
  kernel:
  - each change shows its operation, named in the page language instead of
    as a code, its path, and its values before and after;
  - revision IDs and checksums read left to right in Arabic too;
  - the selected revision and the current head are marked by more than
    colour;
  - counts use each language's plural forms ("1 change", not "1 changes");
  - the commit dialog's close button is named in AR, EN and FR.
- Rebuilds import and export on the kernel:
  - the workspace list under "Where your work is": its actions, the storage
    health and status as notes, and one row per workspace, the open and the
    damaged one marked by a thicker edge as well as colour;
  - deleting and resetting use a new `danger` button;
  - the case file's exports (HTML report, canonical JSON, the full contract)
    and the import's review details under the answer.
  The editor's and commit dialogs' status lines become one kernel note.
- Rebuilds the dialogs on the kernel:
  - all six share one frame: backdrop, panel, header and a 44px close button;
  - the review ledger: its tasks are a list of pressed buttons, statuses are
    chips, and each task's reason and phase are named in the page language
    instead of as codes;
  - the prompt preview, and the ledger's close button, are named in AR, EN
    and FR;
  - a disclosure joins the kernel.
- On a touch screen, a tapped phase in the header keeps its number and
  caption readable in the dark theme.
- Retires the legacy styles the rebuilt screens no longer use: 191 selectors
  in `src/styles.css`, for classes the app no longer renders and for the
  global `pre` and `textarea` rules and the ledger counts' ID rule, which only
  reached kernel controls. The prompt preview follows the prompt's direction,
  so an Arabic prompt reads right to left.
- Adds a command palette (Ctrl/⌘ K, or Commands in the header):
  - it lists every enabled control of the shell and of the open review by its
    own label, and runs one by clicking it;
  - focus lands on the control used, and Escape gives focus back;
  - it works in AR, EN and FR.
- Gives the whole app the case-file look in both themes before each view is
  rebuilt:
  - the legacy colour and font tokens follow the kernel;
  - text on accent fills stays readable in the dark theme;
  - the old shell's styles, which no longer matched anything, are removed.
- Adds the kernel of the new interface
  (`src/ui/`, see `docs/features/design-system-kernel.md`):
  - j-prefixed tokens, dark and light themes, and two densities;
  - scoped accessibility foundations and base controls;
  - a DOM-contract registry and a component harness checked in AR, EN and FR.
- Guards that the kernel cannot restyle the current app: every token, class
  and selector is namespaced, and the app's computed styles are compared with
  and without it.

### AI answer import

- Imports a pasted answer only when it is a complete, canonical analysis, in
  both lenses. An answer with gaps is held back with a targeted completion
  prompt, and the merged reply is checked again; drafts saved earlier still
  open.
- Refuses the old six-layer Biopolitical format instead of migrating it; the
  user generates a new prompt.
- The Biopolitical prompt now asks for a non-empty `counter_evidence` and for
  `evidence_of_benefit` IDs that exist in the answer's evidence.
- Adds AI Interchange v1, a compact Biopolitical generation contract with a
  deterministic compiler.
- Salvages AI answers to find their gaps, in both lenses: unambiguous format
  slips are normalized, invalid values are quarantined in the import audit,
  and the remaining gaps become exact-path completion work.
- Completes cut-off answers with a continue prompt whose reply is joined to the
  first part automatically.
- Merges the reply to a targeted completion prompt (the missing parts) into the
  open analysis.
- Recognizes a pasted prompt instead of an answer, and a reply written in a
  language other than the analysis language.
- Restores unfinished intake work (topic, context, sources, prompt, and pasted
  answer) after a page reload.
- Asks for a compact answer at Strategic Focused depth so assistants with small
  output limits can finish.
- Shows a clean Biopolitical import as ready; evidence that only needs
  independent review no longer counts as an import problem.
- Adds a **Supplied sources** box for the "sources supplied in context" mode;
  its text is added to the prompt.
- Asks Strategic answers for the evidence `source_type` and `uncertainty` and
  the link `strength` that the Strategic schema requires. Before, every
  Expert or Research answer that followed the prompt imported as a draft with
  gaps.
- Keeps the authored IDs of Biopolitical future feedback loops; their `ref`
  was set aside and replaced with generated IDs.
- Tells the assistant that `evidence_of_benefit` holds evidence IDs, not
  descriptions.
- Asks Focused Strategic answers for one or two evidence items (or the
  no-source placeholder). The schema requires evidence, so every Focused
  answer used to import as a draft with one gap.
- Shows an answer that is exactly the requested JSON code block as clean,
  also when it was completed through the continue prompt. Removing that fence
  was reported as a repair, with a warning status.
- Keeps what the user changes while the last analysis, or the analysis being
  prepared, is still being restored after a reload. On a slow device the late
  restore overwrote the topic, language, or pasted answer.
- Keeps everything after an extra closing brace in an answer. Only the part
  before it was kept: a free-tier answer lost its last 42,000 characters and
  imported with 23 gaps instead of 1. A section the brace pushed to the top
  level is put back in place. If such an answer is also cut off, the continue
  prompt is offered instead of importing the part before the brace.
- Gives the no-source Biopolitical prompt the placeholder evidence record,
  empty evidence reference lists, and limitation statement its rule refers
  to. The template it sends had none of them, so assistants improvised and
  their answers imported with gaps.
- Recognizes the French and Arabic no-source placeholders: they are no longer
  reported as uncited evidence, and they score like the English one.
- Tells the assistant that `power_asymmetries.between` and link ends hold
  record refs, not names.
- Stops counting the compilation of a Biopolitical answer as repairs. Every
  answer in the requested form showed about 28 repairs.
- Gives the 18 Biopolitical self-audit checks and the 13 capture criteria
  English labels in the app and the report ("Statistics and quotations
  verified", not the raw key "Statistics Quotations Verified"); Arabic and
  French already had theirs.
- Shows a Biopolitical link that is missing an end as "— → MEC1" in the app
  and the report, not "undefined → MEC1", and no longer counts a link with
  neither end toward the Mechanisms pillar, in all three languages.
- Offers no repair prompt for a valid answer with nothing to fix. The button
  stayed active, and its prompt told the AI that JSON parsing had failed.
- Offers the continue prompt for an answer cut off after a wrong closing
  bracket earlier on. It got the JSON repair prompt, which cannot finish an
  answer.
- Offers the repair prompt when a reply to the continue prompt adds nothing,
  such as "the answer was already complete". A complete answer with one stray
  quote looks cut off; the continue prompt was offered again and again, and
  each such reply was joined to the answer.
- Puts the answer back, to be continued, when the AI replies to the repair
  prompt that it is cut off (`{"repair_status":"incomplete_input"}`). That
  reply replaced the answer in the box and was rejected as a wrong format.
- Merges a list of missing parts whose paths leave out the leading `/`
  (`"feedback/1/speed"`). Two free models wrote them this way, and the list
  replaced the analysis instead.
- Merges a completion reply that puts the missing parts under their parent
  key; they were dropped, and the status said "Added 0 missing parts". The
  status now also says how many parts matched nothing that was asked for.
- Restores an answer whose first `{` is missing. Its opening keys were read
  as the subject, and the contract, lens, and language were lost.
- Offers the repair prompt, not the continue prompt, for a complete fenced
  answer with one stray quote.
- Gives generated IDs numbers the answer has not already used; an answer
  could end up with two `E12` records.
- Keeps a Biopolitical answer's `evidence: {items: [...]}` shape and the
  keys written beside a wrapped answer when compiling it.
- Keeps the space where a continuation joins the first part
  ("Claim number"), and drops a code fence or lead-in sentence at the start
  of the continuation.
- Lists a Biopolitical capture level, capture criterion, competing
  explanation, or self-audit item that the answer leaves out as a gap to
  complete. The compiler filled in "uncertain" or "concern", and the answer
  imported as complete with judgments it never made.
- Puts a completion reply that lists only the missing records, in order,
  under the list that holds them (`"/list": [B, D]` for records 1 and 3)
  into those records; they landed in the wrong ones. A list too short to
  reach every record asked for, without one entry per missing record, is
  reported as matching nothing asked for, not guessed at.
- Keeps a Biopolitical section's records when the answer writes a note
  beside them (`{"items": [...], "note": "..."}`); every record was lost.
  The note is kept for review.
- Keeps for review a Biopolitical section written in a shape that cannot be
  read, such as a list where named parts are asked for or text where a list
  is. It was emptied without a trace.
- Gives a generated competing-explanation ID a number the answer has not
  already used; two explanations could share `EX2`.
- Joins a continuation that carries on inside the cut-off code block and
  ends with its closing fence, also when a sign-off follows the fence. It
  was joined as empty, or the sign-off was pasted into the answer. A
  continuation that adds no quote or bracket is still not joined, since it
  cannot be told apart from "the answer was already complete"; the message
  now says how to add it by hand if it is the rest of the answer.
- Also restores a missing first `{` when the answer follows lines of prose
  ("Sure!", "Here is the analysis:") or sits in one of several code blocks.
  The contract and subject were dropped, or a format example was taken for
  the whole answer, without a warning.

- Joins a continue reply that repeats the whole record the answer was cut
  in, however long; a repeat over 400 characters was added twice.
- Puts an answer the AI started over in place of the cut-off one, instead of
  appending it and asking for the rest again.
- Keeps a Biopolitical section member the import does not use (`power.actor`
  for `actors`) in the import audit instead of dropping it unseen, and puts
  back `links` and other top-level members written inside a section.
- Reads Strategic links written as `{"items": [...]}` as the list of links,
  not as one link holding them all.

- Says that a complete answer with a JSON error has one, instead of "No
  analysis was found", and gives the AI the parser's error in the repair
  prompt instead of that message.
- Keeps a complete answer complete when the AI replies that it is cut off,
  and says the AI missed its JSON error; the continue prompt was offered.
- Leaves a Biopolitical confidence the answer does not give as a gap to
  complete; it was set to "low" while the status said nothing was invented.
- Lists every gap of a Biopolitical answer at once, broken references
  included, and each only once in the review. A schema gap hid the others,
  so completing it revealed new gaps, which the review then listed twice.
- Says "No analysis was found" for JSON that is not an analysis in the
  Biopolitical lens too, instead of "Unsupported contract: missing / missing".
- Records a draft's gaps in the interface language; a French import showed
  the validator's English ("must NOT have fewer than 1 characters").
- Says "No missing part was added" instead of "Added 0 missing parts".
- Says when a Strategic value the contract does not allow (a confidence of
  "very high", "élevée" or 0.8) was set aside; the status read "Valid JSON"
  while the value was left out.
- Sets aside the analysis on screen when an import brings one of the other
  lens, so switching back brings it back instead of an empty lens.

### Workspaces

- Asks for a second click before **Load sample**, **Open**, or a workspace
  file replaces an answer that is pasted but not imported.
- Imports an answer once when **Import** is clicked twice.
- Returns to the right workspace when the other lens is chosen and then
  chosen again; exports and resets acted on the other lens's workspace.
- Keeps a pasted answer when an edit is saved or a resolution is committed.
- Resets no longer bring back results set aside for the other lens.
- Saves an edit to a Strategic answer imported as a draft. The editor
  accepted only a complete analysis, so a draft could not be saved or
  committed. An edit to a complete analysis must still keep it complete.
  The editor says when a field parses but the draft still has parts missing.
- Records a committed Strategic or Biopolitical draft as a draft in the
  resolution ledger; it was recorded as a valid contract. The ledger shows
  Passed, Draft, or Failed.
- Leaves an answer that is pasted but not imported in the box, still
  guarded, when the lens is switched, also across a reload after the switch
  brings back the other lens's analysis; switching back no longer replaces
  it.
- Keeps an answer that is pasted but not imported across a reload after an
  edit is saved or a resolution is committed; its saved copy was discarded.

- Keeps each tab's analysis being prepared apart: a second tab no longer
  replaces or deletes the first one's pasted reply, and a reload reopens the
  tab's own analysis. A new tab takes over what a closed tab left.
- Keeps the topic, context, and sources for a reload as they are typed, also
  before a prompt is copied; edits made after copying were undone.
- Brings back a topic typed in a lens with no result when the other lens is
  chosen and then this one again; the other lens's title replaced it.
- Stays in a lens with no result across a reload, with its pasted reply,
  instead of reopening the other lens's analysis.
- Says when an imported analysis could not be saved, at once and again in
  Workspaces, which said "storage is ready" instead.
- Says a failed save in the draft editor itself; it was shown only in the
  closed Workspaces dialog.
- Speaks the interface language in Workspaces: lens names, the integrity
  label, a damaged row and storage failures no longer show English text or
  raw codes in Arabic and French.
- A row whose workspace was removed in another tab, or damaged, says so;
  Edit draft opened the analysis on screen instead, or failed silently.
- Keeps an analysis with its workspace when the lens is switched while it
  saves; it came back detached, with Export and Remove disabled.
- Does not save the analysis already open a second time when it is imported
  again (the sample loaded twice made two workspaces).
- Asks a question before closing the editor with unsaved changes, and a
  restored edit that was never applied reads as unsaved and can be saved.
- Keeps and guards a reply left in the box by Reset app data.
- A damaged workspace row can be removed (after a second click); it could
  not be opened or removed before.

### Prompts

- Tells the assistant to copy the no-source placeholder and limitation
  statement word for word, and recognizes a renamed placeholder by its shape
  (the only evidence, no URL, cited nowhere) so it is not scored as evidence.
- Blocks copying the prompt in "sources supplied in context" mode until
  sources are pasted, and forbids figures and quotations the sources do not
  contain.
- Asks Research and Expert Biopolitical answers to fill assumptions and
  causal links, whose template arrays are empty.
- Warns when a relevant Biopolitical explanation states no claim.
- Keeps source titles and quotations exact in the language-fix prompt and
  translates evidence claims; the repair prompt no longer lets the assistant
  mark evidence verified.
- Stops telling the assistant that the tool fills the keyed sets it must
  write, and stops asking for traceable or source-grounded evidence at
  Research depth when no source access is chosen.
- Tells Strategic answers without source access, at every depth, to copy the
  placeholder evidence item word for word as the only evidence. Four answers
  handled the placeholder in four different ways.
- States that Strategic feedback `speed` is `fast` or `slow`, never
  `medium`; five answers wrote `medium`.
- Asks both lenses to keep each `source_title` as the source gives it;
  answers translated titles into the analysis language.
- Tells Biopolitical answers without source access to leave
  `evidence_of_benefit` empty; three answers cited the placeholder there.

- Fills `statistics_quotations_verified` with "concern" in every source
  mode, as the rules ask; the web and provided-source templates offered
  "pass", which flagged answers that followed them.

- Names the capture criterion in each missing-part line of the completion
  prompt; the AI saw only a list position.
- Lets the repair prompt fix the values its diagnostics name, and names
  each path once.
- Names the Biopolitical prompt's depth as the interface does ("Focused"),
  not by its code ("simple").
- No longer calls the template's example records "empty" in the Biopolitical
  field guide, and opens the guide in plain words instead of "keys are
  canonical; ref becomes id locally".
- Gives the Arabic and French Biopolitical rules the details the English ones
  have: the range from protection to expropriation, and dataset IDs and
  archive references as source locators.

### Reports and interface

- States the Strategic report's headline score as decision readiness, with
  analytical coverage, the quality gate, and the cap that applies; it was
  called "Overall index".
- Writes the Strategic report's title and model chain in Arabic and French.
  The cross-locale export test now expects them in each language.
- Keeps source links left-to-right in the Arabic Strategic report.
- Shows no raw stakes code (`existential`) for an interest without a
  rationale.
- Gives each Biopolitical evidence record its own ID and source link when two
  records share a claim or an explanation states the same claim; they shared
  the first record's ID and link.
- Names the relationship atlas's structural and evidence relations
  (`supported_by`, `countered_by`, ...) in Arabic and French.
- Names a Biopolitical export without a title `analysis-...` instead of
  `strategic-analysis-...`, keeps `œ` and `æ` in file names as `oe` and
  `ae`, and adds the analysis name to the evidence intelligence and review
  plan exports.
- Shows the inspection directory's layer, confidence, and evidence balance in
  the interface language.
- Shows the source type codes `internal_sample` and `none` as words.
- Adds French for five Strategic labels that showed English.
- Names every Biopolitical code in Arabic and French; 22, such as resistance
  forms, social dimensions, and replication status, showed in English.
- Names Strategic actor types, tool categories, frames, horizons, stakes,
  and values in Arabic and French, and shows a confidence as one ("High
  confidence") rather than a bare "High".
- Shows the record drawer's coded values (pillar, status, confidence, source
  type and tier, relation) in the interface language.
- Names five more relationship types in the relationship explorer in Arabic
  and French, and corrects an Arabic explanation that called a structural
  link a legal reference.
- Adds the research question and each evidence item's source note,
  uncertainty, and strength to the Strategic report; they were left out.
  Layer confidence chips there read "High confidence", not "High".
- Points relationship arrows from source to target in Arabic, in the
  Biopolitical report and the relationship explorer, on desktop and phone,
  and in causal link titles and the model chain under the Arabic report
  titles; they pointed backwards in the right-to-left layout.
- Names Biopolitical scales, inequality axes, power modes, asymmetry
  resources, resistance forms, and institution roles in Arabic and French,
  in the records and the report's reference directory, and shows "Missing
  from record" as yes or no. They showed as English codes and `false`.
- Names a source cluster's identity basis in the interface language.
- Capitalizes an accented word where the AI's own text stands in a coded
  field: "État", not "éTat".
- Gives two references whose IDs differ only in punctuation (`ACT.1`,
  `ACT-1`) their own anchors in the Biopolitical report; a link to one
  could open the other.

- Heads each conclusion group of the Biopolitical report once, and
  translates "schema" in its Arabic and French header.
- Ends long export file names at a whole word, never on a dash.
- Titles the continue prompt by its own name when it cannot be copied.
- Gives one verdict in both gates of the Biopolitical overview ("Review
  needed", not "Blocked" beside it), and the quality gate lists every open
  item, not the first four.
- No longer says the six scoring dimensions are "below" the rule; they can
  sit beside it or before it.
- Says an unapproved publication gate is "not approved" in Arabic
  (غير معتمد, and غير مستوفاة in the report) instead of "banned" (محظور).

### Tests and tooling

- Bounds every browser-test IndexedDB operation and gives two long persistence
  workflows scoped WebKit budgets.
- Adds the Gate 0 human benchmark kit.
- Adds `.gitattributes` for consistent line endings.
- Checks that an answer doing exactly what a prompt asks matches the schema,
  for both lenses and every language, depth, and source-access mode.
- Tests the startup restore against slow storage, and waits for the reopened
  analysis in the analysis-language test that was flaky on WebKit CI.
- Checks the no-source Biopolitical prompt against the template it sends, in
  every language.
- The French label check now also finds a label call that ends in a comma.
- Splits the workspace reset test in two. Under load on WebKit it reached the
  60-second test timeout.
- Adds `npm run corpus`, which asks models on OpenRouter for analyses and runs
  each reply through the app as a user would: continue a cut-off answer, send
  the follow-up prompt the app offers, import. `npm run corpus:replay`
  re-imports saved replies with the current code and fails when a case gets
  worse than its baseline.
- Adds `npm run corpus:score`, which has a judge model score the content of
  corpus replies with DeepEval: evidence honesty, analytical substance, topic
  fidelity, and instruction following. The eval suite is in `tests/evals/`.
  Only replies the app imported are scored. With a free judge, it first asks
  OpenRouter how many free-model requests are left today and stops when none
  are.
- Runs the WebKit core suite in four CI shards instead of two. With the tests
  added in this release, the second shard needed about 18 minutes and was
  stopped at the 15-minute job limit; no test failed.
- Adds regression tests for removing the open damaged workspace, an older save
  finishing after a newer import, parser positions after prose, and a restart
  shorter than the answer.

### Repository cleanup

- Consolidates phase, alpha, and audit documents into current documentation:
  `docs/architecture.md`, `docs/features/results-and-evidence.md`,
  `docs/features/workspace.md`, `docs/operations/ci.md`, and
  `docs/operations/manual-release-review.md`. Earlier versions remain in Git
  history.
- Removes the one-time release-layout migration (`upgrade:layout`,
  `test:layout:migration`) and the unused full-size mascot image.

## 2.1.0-alpha.55 — Revision History and Safe Restore

- Normalizes package, application, export, evidence, documentation, and test
  identities under one declared product version.
- Makes `package.json` the development authority and verifies every required
  derived surface through a dedicated CI contract.
- Establishes an authoritative capability map and the `REL-AUTH-1` baseline
  for the research-to-report workflow.

- Adds a read-only, trilingual revision browser with lineage, checksum, kind, timestamp, and current-head status.
- Compares any selected historical canonical payload with the current head using the existing exact diff authority.
- Restores only by creating a reviewed immutable child revision; the head never moves backward and history is never rewritten.
- Binds restore proposals and hash-chained resolution records to the selected source revision ID, kind, and payload checksum.
- Blocks restore when the working draft is dirty, the selected revision is the current head, or both payloads are identical.
- Preserves whole-document validation, explicit reviewer approval, rationale, optimistic repository concurrency, and audit provenance.
- Adds deterministic tamper/failure coverage and end-to-end Strategic, Biopolitical, Arabic, English, and French browser contracts.

## Alpha.54 — Capability-Gated Relationship Explorer Styles

- Removes the 33,938-byte relationship explorer stylesheet from the initial document request graph.
- Loads the stylesheet only when the Connections capability is activated, coordinated with the already deferred explorer module.
- Blocks explorer mounting until both JavaScript and CSS are available, preventing an unstyled intermediate explorer.
- Memoizes successful stylesheet loading and removes failed links before retrying with a fresh same-origin URL.
- Adds explicit load diagnostics plus browser coverage for absence, application, failure, recovery, and revisit memoization.
- Preserves the Alpha.51–53 module boundaries, localized recovery surface, and existing browser/evidence inventories.
- Brings the cumulative Alpha.51–54 raw initial-request reduction to 157,758 bytes across JavaScript and CSS.

## Alpha.53 — Capability-Gated Biopolitical Graph Module

- Defers the shared biopolitical graph module until an accepted biopolitical analysis enters review.
- Preserves one coherent graph authority for named references, inspection, connection counts, relationship exploration, and HTML reporting.
- Memoizes successful capability loading and uses a fresh same-origin URL for recovery after a rejected dynamic import.
- Adds localized loading and accessible failure/retry states instead of rendering a degraded graphless review.
- Extends the existing relationship browser case to prove zero boot/lens attempts, one-time loading, visible failure, and successful retry.
- Removes 18,916 raw source bytes from the initial module request graph while preserving Alpha.51 and Alpha.52 boundaries.

## Alpha.52 — Capability-Gated Biopolitical Report Renderer

- Defers the standalone biopolitical report renderer until HTML report export is requested.
- Memoizes successful capability loading and uses a fresh same-origin URL for recovery after a rejected dynamic import.
- Adds localized loading and accessible failure/retry states without changing canonical HTML or JSON export contracts.
- Extends the existing export browser case to prove zero initial requests, one-time loading, repeat-export reuse, visible failure, and successful retry.
- Removes 34,369 raw source bytes from the initial module request graph while preserving Alpha.51 explorer lazy loading.

## Unreleased

### AI interchange completion

- Preserve canonical-shaped AI results with only empty analytical requirements
  as explicit reviewable generated drafts instead of disabling import.
- List exact completion paths and generate a targeted, trilingual completion
  prompt without inventing analytical content or provenance.
- Keep invalid types, contract identity, record IDs, duplicate IDs, and broken
  references fail-closed.
- Cover the observed eight-empty-`counter_evidence` reuse case and preserved
  extension audit in deterministic and browser contracts.

### Repository governance

- Gate the GitHub Pages mirror behind successful no-browser and browser CI.
- Fail CI when Playwright passes only on retry.
- Make browser navigation safe for repository-subpath deployments.
- Build an explicit static deployment artifact instead of publishing the repository root.
- Establish current documentation, deployment, and versioning authorities.
- Move artifact and GitHub Pages actions to their Node.js 24 release lines while preserving the accepted CI topology and deployment authority.
- Keep the global 60-second Playwright timeout, one CI retry, and strict
  retry-only failure policy while assigning measured WebKit budgets only to the
  two compound persistence workflows that reached the global ceiling.
- Enforce an 80-second completed-duration limit beneath each scoped 90-second
  WebKit timeout and emit machine-readable duration evidence.
- Replace raw browser-spec IndexedDB promises with a shared 10-second bounded
  operation authority that settles open, request, transaction failure, abort,
  and completion paths explicitly.

### Performance architecture

- Route density changes and workspace navigation through the named shell render region.
- Preserve full-region rendering for language, lens, analysis, workspace, import, and reset transitions.
- Add deterministic coverage proving a selective shell cycle does not execute or increment workflow, engine, or review regions.
- Extract density, navigation, focus, command activation, and shell rendering from the application entry point into a bounded application-shell feature controller.
- Expose immutable render-region counters through local runtime diagnostics and assert shell-only density and navigation increments in the real browser.
- Commit the live relationship-search draft before full explorer renders so Firefox cannot replace a newer input value with stale mirrored state.
- Preserve explicit reset, saved-view restoration, analysis mounting, and selection-reveal query transitions as intentional state authorities.
- Remove the Relationship Explorer from the initial application module graph and load it only when the Connections capability is activated.
- Memoize the explorer capability after its first successful load, ignore late completion after navigation away, and expose localized loading, failure, and retry states.
- Add browser contracts proving pre-activation absence, one-time successful loading, revisit reuse, and recovery after a deliberately failed dynamic import.

## 2.1.0-alpha.46 — Governed Release Operations

- Protected `main` behind required no-browser and browser CI checks with no bypass actors.
- Required pull-request-based changes and blocked force pushes and branch deletion.
- Gated the GitHub Pages production build behind the accepted CI pipeline.
- Retained automatic Cloudflare production deployment exclusively from protected `main`.
- Documented exact-commit deployment parity checks for GitHub Pages and Cloudflare.
- Aligned contributor and deployment guidance with the enforced governance workflow.
- Preserved runtime behavior and all Alpha.45 recovery, workspace, export, review, resolution, and evidence contracts.

## 2.1.0-alpha.45 — Crash-Safe Editor Recovery

- Added a separate checksummed `jarbou3i-editor-recovery@1` journal for unsaved editor state.
- Anchored every recovery snapshot to workspace ID, repository revision, draft ID, base revision, and saved payload checksum.
- Preserved parsed canonical state together with incomplete or malformed active-field input.
- Added a 500 ms debounced capture path and seven-day expiry.
- Added explicit restore and discard controls in Arabic, English, and French.
- Deleted recovery snapshots after successful draft saves and guarded workspace resets.
- Rejected and removed stale, expired, corrupt, and contract-incompatible recovery records.
- Kept recovery state non-canonical and outside immutable revision, review-ledger, and resolution-ledger history.

## 2.1.0-alpha.44 — Workspace State and Interaction Stability

- Exposed workspace persistence through locale-independent `data-state` values.
- Preserved localized Arabic, English, and French status text as presentation rather than machine state.
- Updated workspace browser tests to assert semantic persistence state.
- Removed positional button hover movement that could destabilize WebKit pointer actionability.
- Preserved guarded current-workspace removal and full application reset behavior.
- Reconciled Strategic evidence-gap assertions with the corrected dated sample.
- Preserved immutable revisions, review and resolution ledgers, import and export contracts, and Biopolitical behavior.

## 2.1.0-alpha.43 — Strategic Sample Recovery and Workspace Reset

- Reconciled all AR/EN/FR runtime Strategic samples with the canonical v1.1 evidence and relationship contract.
- Added a runtime-sample round-trip gate so the product cannot ship samples rejected by its own validator.
- Added fail-visible, copyable operation diagnostics with stable codes, JSON paths, timestamps, version identity, and correlation IDs.
- Added explicit two-step removal for the current workspace and a two-step full reset for all local workspaces and preferences.
- Added repository-level reset primitives for IndexedDB and in-memory test backends.
- Preserved canonical imports, immutable revisions, review ledger, resolution ledger, exports, and Biopolitical semantics.

## 2.1.0-alpha.42 — Pre-stable Integrity and Data-Survivability Hardening

- Generated a browser Strategic validator directly from the published v1.1 schema.
- Enforced nested field, numeric range, semantic ID, and relationship-reference integrity before Strategic draft save or immutable resolution.
- Sanitized non-HTTP(S) Strategic evidence URLs into review warnings.
- Fixed the no-source prompt placeholder to use the canonical 1–5 evidence-strength range.
- Prevented focused textarea edits from bypassing Escape/reload dirty guards.
- Made section navigation, undo, redo, and save apply or reject pending textarea input deterministically.
- Added browser storage persistence and quota-pressure diagnostics with an explicit user-initiated persistence request.
- Added adversarial contract tests for malformed Strategic revisions, prompt drift, editor event ordering, and storage-health states.

## 2.1.0-alpha.41 — Resolution Accessibility Correction

- Darkened the shared light-theme muted-text token from `#65758b` to `#5f6f84`, raising contrast on `#f8fafc` soft surfaces from 4.48:1 to approximately 4.90:1.
- Added a static 4.75:1 token-pair safety-margin check while preserving the runtime Axe accessibility gate unchanged.
- Preserved Alpha.40 resolution transactions, workspace v3 semantics, prompt isolation, integrity checks, security headers, and evidence authority.

## 2.1.0-alpha.40 — Phase 5 Slice 4 Resolution Transactions

- Added deterministic exact canonical diffs, whole-draft validation, explicit local approval, and stale-proposal rejection.
- Added immutable `committed_resolution` child revisions and a cross-verified, hash-chained resolution ledger in workspace format v3.
- Marked review decisions stale when their recorded draft checksum no longer matches the working draft.
- Added trilingual responsive diff/approval UI, an eight-case browser authority, and 156-screenshot/175-artifact visual coverage.
- Isolated Strategic prompt material as untrusted JSON and disclosed prompt character burden/output-capacity risk.
- Integrity-checked workspace listings and disclosed that local data is not app-encrypted.
- Added deployment security headers and exact CI commit attribution inside evidence metadata.

## 2.1.0-alpha.39 — Review Transaction and Focus Stability

- Serialized operational-ledger submissions behind an explicit pending state so consecutive actions cannot race the optimistic repository guard.
- Cleared stale success state before each ledger transaction and exposed success only after persistence and ledger projection complete.
- Replaced the delayed full review rerender after imported-analysis persistence with targeted workspace-control synchronization.
- Preserved focused review tabs, relationship controls, records, and reference triggers while asynchronous workspace checks finish.
- Strengthened the ledger browser journey to wait for a fresh successful transaction and an enabled next action.

## 2.1.0-alpha.38 — Phase 5 Slice 3 Operational Review Ledger

- Added an append-only operational ledger for deterministic evidence-review tasks.
- Added explicit pending, in-review, completed, waived, and reopened task-state semantics.
- Required a stable local reviewer identifier and display-name snapshot for every event while explicitly declaring that identity is locally asserted, not account-verified.
- Required rationale for decisions, text for notes, and scope plus accepted risk for waivers; optional waiver expiry is preserved.
- Hash-chained every event to its predecessor and anchored it to the exact working-draft checksum and repository revision in effect when recorded.
- Added optimistic-concurrency persistence, workspace-bundle portability, v1-to-v2 migration on repository reads, and a separate non-canonical audit-trail export.
- Kept canonical drafts and immutable revisions outside the review mutation boundary and stated that task completion never validates a conclusion.
- Added deterministic integrity/transition/tamper tests and an eight-case cross-browser lifecycle authority.

## 2.1.0-alpha.37 — AI Interchange Reliability Interlock

- Added explicit no-source, supplied-source, and live-research capability modes to prompt generation.
- Added a publication-blocked conceptual-draft fallback that does not fabricate citations or treat a placeholder as proof.
- Added conservative recovery for AI-emitted labeled array entries such as `["CMP1": {...}]`.
- Added audited contract-shape repair for ID-keyed collection maps, unambiguous scalar-to-array drift, and misplaced actor confidence enums.
- Preserved the exact pasted input and disclosed every structural repair by canonical path.
- Renamed import-time evidence blocks as publication blockers so an enabled draft-import action is not semantically contradictory.
- Replaced full-schema generative repair with a diagnostic, minified-JSON-only repair instruction that forbids code, prose, ellipses, and invented content.
- Added focused node and four-browser regression authority for the supplied failure pattern.

## 2.1.0-alpha.36 — Phase 5 Slice 2

- Added a structured, lens-aware editor for checksummed working drafts.
- Added full-draft contract validation, immutable identity enforcement, bounded undo/redo, dirty-state protection, and optimistic local saves.
- Preserved imported and committed revisions as immutable history.
- Added non-browser editor invariants and an eight-case cross-browser authority.
- Prevented WebKit's deferred textarea `change` event from reapplying an already-applied field after Undo and clearing the Redo history.
- Strengthened the browser journey to require an enabled Redo control and verify that Redo restores the edited canonical value.

## 2.1.0-alpha.34 — Phase 5 Workspace Contract and Portability Foundation

- Added the versioned `jarbou3i-local-workspace@1` contract with separate immutable imported revision, working draft, revision pointers, analysis identity, and audit events.
- Added durable IndexedDB storage behind a repository abstraction; substantive analysis data is no longer placed in `localStorage`.
- Added optimistic repository revisions that reject stale replacement and deletion attempts instead of silently overwriting another browser context.
- Added SHA-256 verification for every revision and working draft, plus separate workspace and protected-manifest checksums for portable bundles.
- Added guarded v0-to-v1 migration, explicit unsupported-version rejection, corruption detection, quota/unavailable-storage errors, and a 25 MiB import ceiling.
- Added a trilingual local workspace manager with save state, reopen-after-reload, multi-workspace listing, lossless bundle export, and safe restore.
- Kept canonical JSON export unchanged; workspace bundles declare `canonical_transport: false`, `local_first: true`, and `collaboration_state: false`.
- Added published workspace and bundle JSON Schemas, deterministic no-browser contract tests, and a sixteen-case dual-lens cross-browser persistence/portability matrix.

## 2.1.0-alpha.33 — Phase 4 Evidence Review Queue and Resolution Planning

- Added a deterministic dual-lens review queue derived only from existing relationship, provenance, source-cluster, and traceability diagnostics.
- Ordered tasks into resolve-reference, verify-provenance, and strengthen-coverage phases without introducing truth scores or inferred source judgments.
- Added direct canonical-record navigation and a separate `jarbou3i-evidence-review-plan-v1` derived export.
- Declared that queue completion does not validate conclusions and excluded raw canonical analysis from the review-plan artifact.
- Hardened the retry-recovered WebKit explanation test by replacing helper actionability scrolling with direct standards-based DOM scrolling.
- Preserved schemas, prompts, imports, scoring, publication gates, canonical JSON, reports, and relationship semantics.

## 2.1.0-alpha.32 — Inspection Selector Namespace Correction

- Scoped the legacy `IV1` browser assertion to the canonical Inspection directory surface.
- Added a generic static guard against unscoped record selectors across the complete Inspection workspace.
- Preserved Alpha.31 claim–evidence traceability, derived intelligence export, and all analytical behavior unchanged.

## 2.1.0-alpha.31 — Phase 4 Claim–Evidence Traceability

- Added a dual-lens claim–evidence matrix with authored support, counter-evidence, clusters, unresolved targets, and coverage states.
- Added direct evidence-to-record routes with canonical paths and permanent record links.
- Added a separate `jarbou3i-evidence-intelligence-v1` JSON audit export.
- Marked the new artifact explicitly derived and non-canonical, and excluded raw analysis content.
- Added unit, static, CI-contract, and cross-browser download verification while preserving canonical exports and analytical behavior.

## 2.1.0-alpha.30 — Inspection Selector Namespace Correction

- Scoped the two legacy evidence-card browser assertions to canonical Inspection directory items.
- Preserved the intentional reuse of canonical reference controls inside source clusters and gap groups.
- Added a static regression guard against ambiguous cross-surface record selectors.
- Preserved the complete Alpha.29 Source Cluster and Gap Intelligence implementation without product or analytical changes.

## 2.1.0-alpha.29 — Phase 4 Source Cluster and Gap Intelligence

- Added deterministic dual-lens source clusters using exact authored URL, title-plus-locator, or title identity.
- Kept evidence without source identity in separate record-specific clusters to prevent false equivalence.
- Added citation, traceability, declared-verification, counter-evidence, confidence, and source-date cluster summaries.
- Added localized, navigable coverage signals for missing identity, title-only identity, uncited evidence, missing counter-evidence, missing dates, untraceable sources, and exact-source concentration.
- Added a responsive Source clusters and evidence gaps workspace to the shared Inspection directory.
- Added dedicated unit and cross-browser contracts while preserving every analytical and export contract.

## 2.1.0-alpha.28 — Phase 4 Evidence and Relationship Intelligence Foundation

- Added one immutable, dual-lens registry for canonical records, typed relationships, evidence trails, reverse citations, and objective relationship gaps.
- Added authored supporting/counter-evidence traversal and evidence back-references to the shared inspector.
- Added lens-scoped permanent record links with fragment-driven opening and clean dismissal behavior.
- Added dedicated unit, static, source-of-truth, CI-contract, and cross-browser interaction coverage.
- Preserved Strategic v1.1, Biopolitical schema `2.1.0`, contract `biopolitical-training-map-v2`, prompts, imports, scoring, publication gates, canonical JSON, reports, and existing graph semantics.

## 2.1.0-alpha.27 — Evidence Package Completeness Correction

- Corrected the release archive boundary so hosted-demo and visual-audit test specifications and review checks are included.
- Added package-level verification of all four evidence harness files before delivery.
- Preserved the complete Alpha.26 inspection implementation without product, schema, scoring, prompt, graph, report, or export changes.

## 2.1.0-alpha.26 — Phase 3 Results Inspection Layer

- Added one shared, immutable inspection index for Strategic and Biopolitical canonical records.
- Added a dedicated Inspection tab with human-readable search and secondary canonical identifiers.
- Expanded the accessible inspector with provenance, confidence, canonical paths, supporting and counter-evidence, linked records, audit facts, and occurrence navigation.
- Added Strategic identifier and relationship indexing without fabricating missing IDs or provenance.
- Authored stable IDs, explicit links, source titles, counter-evidence, and uncertainty into the trilingual Strategic demonstration so the public sample exercises the inspection layer honestly.
- Preserved focus across linked-record traversal and returned occurrence activation to the owning detailed record.
- Added unit, static, and cross-browser regression contracts while preserving schemas, scoring, prompts, imports, graphs, reports, and exports.

## 2.1.0-alpha.25 — Results Explanation Runtime-Authority Contract

- Replaced fixture-file evidence-title assertions with runtime-rendered evidence names for both lenses.
- Verified that each promoted evidence name survives keyboard drill-down into the authoritative detailed record.
- Added a static guard that rejects fixture-only evidence phrases in the browser contract.
- Preserved the complete Alpha.24 product implementation unchanged.

## 2.1.0-alpha.24 — Phase 3 Results Explanation Hierarchy

- Added one shared explanation hierarchy for actors, mechanisms, evidence, tensions, and effects across both analytical lenses.
- Added concise authored previews with complete-record counts and keyboard-accessible drill-down into existing detail views.
- Added an immutable lens-neutral explanation view model that never retains canonical analysis objects.
- Added trilingual, RTL, compact-density, forced-colours, print, and 320 px responsive presentation.
- Added cross-lens unit, static, and browser regression contracts.
- Preserved all schemas, scoring, prompts, imports, relationship graphs, standalone reports, and exports.

## 2.1.0-alpha.23 — Results Namespace Browser Contract Correction

- Updated both Results Workspace metadata assertions to the isolated `data-analysis-lens` contract.
- Added a static guard that rejects the obsolete results-region `data-lens` assertion.
- Preserved the complete Alpha.22 product implementation unchanged.
- Added no analytical, schema, scoring, layout, localization, import, report, or export changes.

## 2.1.0-alpha.22 — Results Lens Namespace Isolation

- Reserved `data-lens` for the interactive lens radio controls and moved results metadata to `data-analysis-lens`.
- Scoped lens rendering and event binding to the `#analysisLens` control group.
- Restored import-contract selector determinism across Chromium, Firefox, WebKit, and mobile Chromium.
- Added a static regression gate for control/metadata namespace separation.
- Preserved analytical, schema, scoring, localization, import, report, and export behavior.

## 2.1.0-alpha.21 — Results Orientation Test Authority Correction

- Replaced an over-specific fixture-text assertion with a direct comparison against the runtime health engine’s rendered next action.
- Preserved the complete Alpha.20 product implementation unchanged.
- Added no analytical, schema, scoring, layout, localization, import, report, or export changes.

## 2.1.0-alpha.20 — Phase 3 Results Orientation

- Added one shared orientation hierarchy across Strategic and Biopolitical results.
- Promoted conclusion, publication gate, decision readiness, analytical coverage, principal uncertainty, and recommended next action above detailed diagnostics.
- Added an immutable lens-neutral results-orientation view model without canonical analysis references.
- Added trilingual, RTL, forced-colours, print, compact-density, and 320 px responsive presentation.
- Preserved all schemas, scoring, prompts, imports, evidence, graphs, reports, and exports.

## 2.1.0-alpha.19

- Consolidated Phase 2 Slice 2 with the Alpha.17 GitHub Actions incident correction.
- Removed global smooth scrolling that could prevent WebKit actionability scrolling from settling.
- Hardened saved-view deletion through its keyboard activation contract.
- Bounded GitHub browser execution to two workers while retaining four-worker local defaults.
- Added conditional evidence uploads and failure-only Playwright trace/report artifacts.

## 2.1.0-alpha.18

- Added a responsive, state-aware topic → import → review shell command.
- Added locale-direction-aware roving keyboard navigation for workspace sections.
- Added explicit primary/secondary command hierarchy and 320 px responsive coverage.
- Added live destination announcements and focus continuity for shell commands.
- Preserved all analytical, schema, import, evidence, graph, report, and export contracts.

## 2.1.0-alpha.17 — Responsive Shell Test Contract Correction

- Removed a new browser assertion that incorrectly required the desktop active-step fill at the intentional 320 px transparent mobile treatment.
- Retained the behaviorally relevant shell checks: 44 px theme target, dark-mode activation, visible active step, persisted density, localization, and lens parity.
- Kept the independent cross-browser axe matrix as the authoritative colour-contrast gate; all 28 release-audit cases passed on Alpha.16.
- No product CSS, runtime behavior, schema, prompt, analysis, evidence, relationship, or export logic changed from Alpha.16.

## 2.1.0-alpha.16 — Shell Reflow and Accessibility Closure

- Restored the theme control’s 44 px minimum target across every 200%/400%-equivalent reflow cell.
- Replaced the dark-theme active step number with a WCAG AA contrast-safe treatment.
- Hardened new shell navigation under forced colours using system Canvas, CanvasText, and Highlight values.
- Scoped the legacy workflow-stage assertion so the valid application-shell `aria-current` marker does not create strict-locator ambiguity.
- Added focused browser regression assertions for the 320 px theme target and dark active-step colour.

## 2.1.0-alpha.15 — Premium Application Shell, Slice 1

- Added one shared Set up → Model → Review application frame across both lenses.
- Added localized live lens context and truthful client-side processing status.
- Added persistent comfortable and compact display density without touching canonical analysis state.
- Added skip navigation, reduced-motion-aware section movement, forced-colours styling, and responsive shell reflow.
- Added pure shell-preference contracts plus browser coverage for orientation, persistence, localization, and lens parity.
- Preserved every Strategic v1.1 and Biopolitical v2.1 schema, prompt, import, score, evidence, relationship, and export contract.

## 2.1.0-alpha.14 — Idempotent Explorer Event Lifecycle

- Makes explorer click binding idempotent across non-destructive search-result renders.
- Prevents one keyboard or pointer activation from creating duplicate saved views after search.
- Applies the same event-lifecycle protection to saved-view, map-reset, tour, selection, and spatial controls.
- Adds a no-browser regression gate that rejects accumulating click listeners in the explorer.

## 2.1.0-alpha.13 — Managed Cross-platform Browser Harness

- Runs every official browser suite through a managed launcher with a temporary free local port.
- Starts the static server as a direct Node child and guarantees teardown in a `finally` block.
- Keeps deployed checks external while distinguishing the managed local base URL from a deployed target.
- Adds parent-process and signal shutdown safeguards to prevent orphan servers on Windows.

## 2.1.0-alpha.12 — Non-destructive Explorer Search

- Updates relationship search results without replacing the search field, saved-view controls, or their active keyboard focus.
- Coalesces graph-only search work to one animation frame and discards stale callbacks after any newer full render.
- Exercises release-audit tab activation through the keyboard contract to avoid transient pointer overlays during concurrent cross-browser runs.
- Makes local Playwright server reuse explicitly opt-in through `PLAYWRIGHT_REUSE_SERVER=1`.

## 2.1.0-alpha.10 — Platform Boot Settings Hotfix

- Fixes the single browser-boot exception behind the Alpha.9 cascade: theme initialization now reads the immutable platform boot settings instead of the removed pre-platform `savedSettings` binding.
- Restores persisted interface language, analysis-language overrides, theme selection, initial render-region measurements, export-tab interaction, and every downstream reflow case.
- Adds a no-browser regression guard that requires theme initialization to use `PLATFORM.bootSettings` and rejects reintroduction of the obsolete binding.
- Retains the complete Phase 1 runtime, lens manifests, performance primitives, Strategic v1.1 behavior, Biopolitical v2.1 behavior, canonical data, and presentation baseline.

## 2.1.0-alpha.9 — Phase 1 Platform Foundation

- Replaces ad hoc service assembly in the application entry point with one shared platform runtime that composes state, settings, localization, lens registration, render regions, diagnostics, caching, and scheduling.
- Upgrades both analytical adapters to immutable, discoverable lens manifests with stable contract identity, schema identity, section counts, capabilities, and isolated service boundaries.
- Adds bounded in-memory performance telemetry for boot and named render regions; no analytics, network transmission, persistent profiling, or canonical payload mutation is introduced.
- Adds revision-keyed memoization and deduplicated task scheduling primitives for future graph, report, and lens modules without changing current synchronous interaction behavior.
- Extends the no-browser release gate with runtime-composition and performance-foundation contracts, and carries forward the verified phone score-card visual capture anchor from the Alpha.8 closure.
- Preserves Strategic v1.1 and Biopolitical v2.1 schemas, prompts, scoring, evidence discipline, graph projections, import/export behavior, translations, themes, and responsive presentation.

## 2.1.0-alpha.8 — Shared Score-Card Component Closure

- Corrects the shared overview renderer to use the design-system `scoreMetricCard`, `metricHead`, and `metricHint` contracts.
- Restores card containment and deliberate spacing between localized metric labels and `/100` values in both Strategic and Biopolitical results.
- Adds a static regression contract rejecting the obsolete unstyled metric markup.
- Changes presentation markup only; both analytical schemas, scoring formulas, evidence rules, imports, exports, and graph data remain unchanged.

## 2.1.0-alpha.7 — Arabic Product-Language and CI Runtime Polish

- Replaces the Arabic title term `مِشرَحة` (morgue/dissection room) with the professional product phrase `مساحة عمل` across the shared shell and Biopolitical runtime.
- Adds a language-contract regression gate that rejects the former term and requires both Arabic lens titles.
- Upgrades GitHub artifact publishing to `actions/upload-artifact@v5`, removing the remaining Node 20 action-runtime warning.
- Preserves all Alpha.6 report, import-audit, mobile-density, and visual-evidence contracts without changing either analytical schema.

## 2.1.0-alpha.6 — Human Visual-Audit Closure

- Localizes import-audit warning and schema-failure explanations in Arabic and French while preserving canonical JSON paths as isolated left-to-right technical tokens.
- Removes orphanable middle-dot separators between named report references by rendering multi-reference values as responsive, gap-spaced groups.
- Compacts phone result navigation into a two-column decision index so the active judgment reaches the first screen sooner without removing labels, counts, or keyboard semantics.
- Makes standalone-report evidence wait for an actual top anchor instead of capturing during smooth scrolling.
- Expands report evidence from one viewport per case to five deterministic surfaces: hero, first analytical pillar, relationship atlas, reference directory, and canonical appendix.
- Raises the visual evidence contract from 96 screenshots and 115 artifacts to 120 screenshots and 139 artifacts.

## 2.1.0-alpha.5 — Deterministic Acceptance Hotfix

- Synchronizes each release-matrix cell through the public language, analysis-language, and theme controls after startup, closing the isolated Chromium preload race that left one French-light cell in Arabic.
- Preserves the intended accessible Connections-list screenshot on phones, then opens Map only for the Story-geometry measurement required by the evidence reviewer.
- Keeps the alpha.4 application, analytical contracts, localization, responsive styling, imports, exports, and report presentation unchanged.

## 2.1.0-alpha.4 — Visual Acceptance Repair

- Localizes canonical Relationship Explorer relation, confidence, verification, and edge-family labels in Arabic and French without changing stored enum values.
- Names resistance nodes with the authored actor or population before the canonical resistance form, removing raw values such as `litigation` from localized story views.
- Fits four-step Story paths at desktop widths and exposes an explicit, keyboard-scrollable, snap-aligned horizontal surface at intermediate widths instead of silently clipping nodes.
- Restores readable active navigation badges in light and dark themes and compacts the phone header, guide card, and stage rail so the primary task enters the first viewport sooner.
- Makes hosted and audit screenshots deterministically anchored and distinguishes local public-surface evidence from a true deployed-site gate.
- Expands visual evidence from 36 screenshots to 96 across the shell, both analysis lenses, Biopolitical results, Connections, import audit, and standalone reports.
- Adds graph-label, localization, story-geometry, badge, capture-coverage, and deployed-target regression contracts.

## 2.1.0-alpha.3 — Evidence-Provenance and Decision-Readiness Foundation

- Rebased the shared dual-lens platform work on the verified RC17 source.
- Separates model-declared verification from independent human review and publication approval.
- Caps decision readiness using source traceability and independent review, without hiding analytical coverage.
- Promotes the publication gate above diagnostic scores in both lens overviews and the Biopolitical report.
- Preserves the original pasted payload and normalization audit in presentation state.
- Requires generated Biopolitical evidence to remain unverified until reviewed in the workbench.

## 2.0.0-bio-rc.17 — Firefox Spatial Saved-View Synchronization

- Replaces the remaining pointer-dependent Spatial orbit, save, reset, and restore transitions in the release contract with focus-owned keyboard activation.
- Asserts focus ownership and the persisted saved-view option before continuing, so each state transition has an observable completion boundary under parallel Firefox/Linux rendering.
- Addresses the GitHub Actions failure in which either Reset or Restore was intermittently dropped while the Spatial scene was being replaced; the graph, saved-view implementation, analytical contracts, schemas, localization, and report output are unchanged.

## 2.0.0-bio-rc.16 — Reviewable Verification Repair and WebKit CI Synchronization

- Downgrades evidence labelled `verified` without both a verifier identity and verification date to `partially_verified` when traceable, or `unverified` otherwise, with one field-level warning per repaired record.
- Keeps every downgraded analysis importable for review while preserving the strict publication block; malformed provenance that still claims complete verification remains rejected.
- Strengthens Arabic, English, and French analysis and JSON-repair prompts so `verified` is forbidden unless both audit-provenance fields are non-empty.
- Adds direct regression coverage for the supplied Tunisia analysis failure mode and confirms portable citation sanitation still removes all assistant-interface markers.
- Replaces unstable pointer clicks in the four GitHub WebKit timeout paths with focus-owned keyboard activation and explicit selected/pressed-state assertions.
- Leaves both analytical schemas, canonical fixture meaning, graph projections, and report structure unchanged.

## 2.0.0-bio-rc.15 — Deterministic Playwright Worker Shutdown

- Moves desktop Chromium and mobile Chrome from Chrome Headless Shell to Playwright’s newer real-Chrome headless mode, directly avoiding the process Microsoft identified in the RC 13/14 Windows shutdown failures.
- Pins Playwright Test 1.61.1, retaining the upstream worker-stop watchdog so any future unresponsive browser process is force-terminated and reported as a failed run instead of silently losing a queued test.
- Adds CI contract guards for both Chromium projects’ headless channel and the exact runner version, preventing configuration or semver drift.
- Leaves application behavior, analytical logic, schemas, canonical fixtures, report rendering, localization, and responsive presentation unchanged from RC 14.

## 2.0.0-bio-rc.14 — True 320px Containment and Lens Transition Synchronization

- Constrains the Relationship Explorer’s implicit grid track so localized min-content widths cannot enlarge the whole explorer behind an `overflow: hidden` ancestor.
- Makes all three saved-view columns genuinely shrinkable and allows long localized actions to wrap without clipping at the 320px/400%-equivalent boundary.
- Upgrades visual and reflow assertions to intersect each control with every clipping ancestor as well as the viewport, closing the blind spot that allowed the 390px evidence checker to miss partially hidden controls.
- Synchronizes the sample-language browser contract on the selected lens state before loading a sample, eliminating the isolated Firefox transition race seen only in the full parallel matrix.
- Preserves RC 13’s French punctuation correction; analytical logic, schemas, canonical fixtures, graph projections, and report output remain unchanged.

## 2.0.0-bio-rc.13 — French Localization and Phone Control Containment

- Preserves authored French spacing before colons, semicolons, exclamation marks, and question marks during recursive citation sanitation.
- Fixes the French Strategic sample title across Chromium, Firefox, WebKit, and mobile Chrome while retaining whitespace repair before commas and full stops.
- Reflows every Relationship Explorer control family onto its own content-safe row at phone widths, preventing longer French labels from being visually clipped despite page-level overflow remaining hidden.
- Adds no-browser punctuation coverage plus viewport-bound control assertions to visual and 200%/400%-equivalent reflow gates; schemas, analytical logic, canonical fixtures, graph projections, and report structure are unchanged.

## 2.0.0-bio-rc.12 — Portable Citations and Outcome Report Remediation

- Removes non-portable assistant-interface citation markers and private-use glyphs recursively during both Strategic and Biopolitical import while preserving authored analytical text, canonical evidence IDs, and valid public source URLs.
- Discloses every citation repair as an import warning and hardens all generated and repair prompts in Arabic, English, and French against `cite`, `filecite`, and `turn` artifacts.
- Replaces the monolithic Biopolitical HTML export with a dedicated, dependency-free report renderer featuring a concise executive layer, explicit publication-gate status, separately labelled analytical readiness, evidence-verification metrics, named reference links, and portable source links.
- Adds a report contents landmark, skip link, keyboard-operable expand/collapse/print controls, progressive disclosure for all 13 sections, responsive reading measures, focus visibility, and print-safe section fragmentation.
- Keeps the complete canonical contract losslessly embedded for re-import and archival while lazily rendering the human JSON appendix, avoiding a second always-visible copy of the largest payload.
- Adds trilingual standalone-report, citation-repair, source-link, publication-gate, canonical-payload, reference-resolution, responsive, and print regression guards.
- Remediates the supplied Tunisia report outcome: 1,261 private-use glyphs are eliminated, 30 encoded assistant citation clusters are disclosed and removed, sources become directly accessible, and the blocked publication state is visually unambiguous beside the 99% analytical-readiness score.

## 2.0.0-bio-rc.11 — Language-Linked Sample Loading

- Hotfix: restores reproducible GitHub Actions installs by replacing environment-specific lockfile tarball URLs with the public npm registry and moving the workflow actions/runtime to Node 24.
- Hotfix: separates canonical import validity from publication readiness. Review-required evidence now imports with explicit warnings while malformed contracts, broken references, and falsely verified provenance remain rejected.
- Hotfix: safely clears non-HTTP(S) URLs on non-verified evidence and corrects contradictory verification self-audits to `concern`; neither condition can pass the publication gate.
- Hotfix: strengthens generated and repair prompts in Arabic, English, and French with exact URL, locator, verification, and self-audit rules.
- Makes the selected interface language the default language for both Strategic and Biopolitical sample topics, while preserving a deliberately different Analysis language as an expert override.
- Persists whether Analysis language follows the interface language; selecting the matching language relinks them, and imported analyses remain authoritative for their declared language.
- Adds cross-engine coverage for all three languages and both lenses, plus override persistence and relinking, increasing the browser core from 208 to 216 cases.
- Closes VIS-002 after human review of regenerated RC 10 evidence confirmed all six phone Connections captures were toast-free and exposed the Relationship Explorer.

## 2.0.0-bio-rc.10 — Localized Toast Exit and Evidence Closure

- Corrects the remaining RC 9 phone evidence obstruction: the toast’s former fixed `84px` hidden translation could leave tall Arabic, English, or French messages partly visible after the active class was removed.
- Moves hidden toasts by their complete rendered height plus safe viewport clearance and disables pointer interception while hidden.
- Strengthens visual capture by polling the toast’s actual bounding rectangle until it is physically outside the viewport, rather than treating class removal as proof of disappearance.
- Records VIS-001 and VIS-003 as human-verified closures and prepares VIS-002 for regenerated RC 10 evidence review; analysis, graph, schema, import, export, and interaction contracts remain unchanged.

## 2.0.0-bio-rc.9 — Human Visual-Evidence Fidelity

- Responded to the fully green RC 8 automated gate (208 core, 2 hosted, and 18 visual cases) with a human inspection of all 36 language/theme/viewport screenshots.
- Preloads and synchronously decodes the above-the-fold guide mascot, preventing blank critical illustration frames observed in French light-phone and hosted Arabic mobile evidence.
- Decode-gates critical visual assets, clears transient toasts before screenshots, and targets the Relationship Explorer itself on phone Connections captures so evidence shows reviewable product content rather than temporary notifications or navigation alone.
- Adds machine-reviewed metadata for asset decoding, transient-UI clearance, and the phone capture target; analytical data, graph behavior, schemas, imports, exports, and interaction logic remain unchanged.

## 2.0.0-bio-rc.8 — Interaction Epoch and Full-Matrix Synchronization

- Added a render epoch to the Relationship Explorer focus scheduler so callbacks from superseded renders are cancelled deterministically.
- Distinguished mandatory focus transfers for Focus mode, overlays, walkthroughs, and node navigation from optional field-focus restoration, fixing WebKit’s Focus-mode entry contract without reopening the saved-view race.
- Hardened Connections and migrated-pillar browser flows through native focus-and-Enter activation plus selected/expanded-state assertions, addressing the two Firefox transitions exposed by the parallel 208-case matrix.
- Canonical analysis, persistence payloads, graph projections, schemas, imports, and exports remain unchanged.

## 2.0.0-bio-rc.7 — Cross-Engine Deferred Focus Arbitration

- Consolidated every Relationship Explorer post-render focus restoration behind one guarded scheduler instead of leaving overlay, Focus, walkthrough, and node paths as unconditional animation-frame callbacks.
- Preserves any focus deliberately claimed by a user, assistive technology, or test runner before the deferred callback executes, eliminating the saved-view focus theft reproduced in Firefox and WebKit under the full 208-case matrix.
- Added a static regression guard against reintroducing direct deferred focus paths; canonical analysis, persistence payloads, schemas, imports, and exports remain unchanged.

## 2.0.0-bio-rc.6 — Deferred Focus Ownership Correction

- Corrected a Relationship Explorer focus race where a stale animation-frame callback could return focus to Search after the user or assistive technology had already moved to another control.
- Deferred filter-focus restoration now runs only while document focus remains neutral, preserving deliberate focus ownership across rapid keyboard and programmatic navigation.
- Strengthened the saved-view contract by crossing an animation-frame boundary before asserting Save focus and keyboard activation; canonical analysis, persistence payloads, schemas, imports, and exports remain unchanged.

## 2.0.0-bio-rc.5 — Full-Matrix Saved-View Synchronization

- Added an explicit search-value settlement assertion before saving a Relationship Explorer view after search-driven rerendering.
- Added an explicit focused-button assertion before keyboard activation of Save view, ensuring the full 208-test parallel matrix targets the current rendered control rather than the preceding search field.
- Preserved the saved-view persistence, restore, deletion, keyboard, and analysis-scoping contracts; production runtime behavior and canonical analysis content are unchanged.

## 2.0.0-bio-rc.4 — Firefox Reflow Target Hardening

- Prevented record- and connection-inspector close controls from flex-shrinking below their declared 32px physical width under Firefox at the 320px/400%-equivalent intersection.
- Stabilized the reflow audit’s Connections transition through native focus-and-Enter activation and an explicit selected-tab assertion before inspecting the responsive list.
- Preserved the complete 48-cell reflow contract; no canonical analysis, graph, schema, import, or export content changed.

## 2.0.0-bio-rc.3 — Reflow List-Mode Inspector Correction

- Replaced the reflow audit’s hard-coded `ACT1` Map-node target with the first visible semantic record button in the active Connections list.
- Aligned the inspector contract with the intentional narrow-screen Story/List fallback while preserving keyboard activation, dialog containment, Escape closure, and focus restoration.
- Added a static regression guard for the list-scoped record target; no production analysis, layout, graph, import, export, or schema behavior changed.

## 2.0.0-bio-rc.2 — Reflow Audit Setup Correction

- Added localized, non-empty analysis topics to every 200%/400% equivalent reflow case before activating Preview prompt, satisfying the production validation contract in all 48 language, theme, viewport, and engine intersections.
- Preserved the modal keyboard contract and strengthened it with an explicit open-backdrop assertion before checking initial modal focus, containment, Escape closure, and trigger-focus restoration.
- Added a static regression guard for the topic prerequisite and modal-open assertion; no production analysis, layout, graph, import, export, or schema behavior changed.

## 2.0.0-bio-rc.1 — Reflow and Human Visual-Audit Readiness

- Added 48 reflow cases crossing Arabic, English, and French; light and dark; 200%/400% equivalent 640px/320px viewports; and Chromium, Firefox, WebKit, and mobile Chrome.
- Reflow coverage includes modal containment and focus return, complete mobile Connections fallback, Spatial disablement, reference-inspector containment and focus return, 24px minimum visible button targets, and page-level overflow protection.
- Added deterministic visual evidence capture for 18 language/theme/viewport combinations with shell and Connections screenshots, producing 36 screenshots, 18 measurement records, and one 55-artifact manifest.
- Added a visual-evidence completeness reviewer, dedicated reflow and visual-audit commands, CI artifact retention, and a manual audit ledger for native assistive technology, linguistic nuance, physical touch, native zoom, print/PDF preview, and epistemic integrity.
- Advanced the verified Beta 3 baseline to RC 1 without changing canonical Strategic or Biopolitical analysis content, graph projections, schemas, imports, or exports.

## 2.0.0-bio-beta.3 — Firefox Full-Matrix Explorer Stabilization

- Stabilized saved-view authoring by activating Network, Analyst, Time, Save, and Restore through their native focus-and-Enter semantics and verifying each state before snapshot creation.
- Stabilized Spatial record opening by focusing the freshly rendered “Open record” control before Enter activation.
- Preserved pointer coverage throughout the remaining explorer suite while making the two persistence/accessibility contracts deterministic under the expanded 160-test parallel workload.
- Responded to a fully green 28-case Beta 2 audit and two Firefox-only legacy explorer races in the complete suite; production state, graph geometry, canonical analysis, and export behavior remain unchanged.

## 2.0.0-bio-beta.2 — Forced-Colors Focus and WebKit Print Synchronization

- Extended the forced-colors focus outline from `:focus-visible` to `:focus` and `:focus-visible`, ensuring programmatic and assistive-technology focus remains perceivable in addition to conventional keyboard focus.
- Synchronized the print-palette assertion with WebKit’s asynchronous media transition using `matchMedia("print")` and computed-style polling; the exact readable palette requirement remains unchanged.
- Responded to the Beta 1 matrix result of 26/28 passed while preserving the 24-cell language/theme/runtime coverage, canonical analysis contracts, and all previously verified behavior.

## 2.0.0-bio-beta.1 — Final Intersection Audit and Release Hardening

- Added a 24-cell automated release gate crossing Arabic, English, and French with light and dark themes across desktop Chromium, Firefox, WebKit, and mobile Chrome.
- Each intersection validates persisted locale/theme settings, directionality, localized future-schema rejection, valid sample recovery, responsive Relationship Explorer presentation, duplicate-ID absence, page overflow, serious/critical axe findings, reduced motion, and print readability.
- Added four cross-engine keyboard-focus cases, including forced-colors emulation in Chromium, without manufacturing skipped results on engines that do not emulate that media feature.
- Hardened dark-theme printing with an explicit light print token set and hardened forced-colors focus, selected states, borders, and relationship graphics.
- Added a dedicated `test:browser:audit` command, made the audit part of the complete browser release gate, and documented the remaining native assistive-technology, linguistic, zoom, print-preview, touch-hardware, and epistemic manual sign-offs.
- Preserved the Strategic v1.1 engine, Biopolitical Training Map v2.1 schema and integrity gates, deterministic graph projections, imports, exports, and canonical analysis content unchanged.

## 2.0.0-bio-alpha.3 — WebKit Space-Key Activation Hotfix

- Normalized map-node Space activation across printable-key, legacy-key, and physical-key representations (`key`, `Spacebar`, and `code`) while preserving the distinct contract: Space selects and Enter opens the record inspector.
- Added a static regression guard for the physical Space-key path after the focused Alpha 2 matrix passed 11 of 12 tests and isolated the remaining failure to WebKit.
- Preserved deterministic graph geometry, spatial navigation, canonical analysis, imports, exports, schemas, and all non-keyboard behavior unchanged.

## 2.0.0-bio-alpha.2 — Spatial Access and Cross-Browser Test Stabilization

- Added a localized spatial record picker that reliably selects depth-occluded cards without flattening the visual 3D field or removing direct semantic node buttons.
- Replaced exact zero-duration assertions with a numeric one-millisecond ceiling, accommodating the one-microsecond reduced-motion clamp returned by Chromium, Firefox, and WebKit.
- Scoped Biopolitical export-tab and Network-node keyboard actions to their elements to prevent Firefox from losing focus during freshly rendered test transitions.
- Preserved canonical analysis, deterministic spatial geometry, exports, schemas, and all Strategic and Biopolitical runtime behavior.

## 2.0.0-bio-alpha.1 — Phase 4 Capability-Gated Spatial Exploration

- Added a deterministic Spatial relationship view that projects the existing filtered graph into nine labeled 3D pillar clusters while preserving all 32 fixture records and 28 indexed connections.
- Added localized orbit, tilt, zoom, and reset controls; pointer dragging; arrow-key, plus/minus, and Home equivalents; live orientation feedback; and reduced-motion behavior.
- Kept every spatial node as a semantic inspectable button and retained the complete Connections list as the always-available accessible equivalent.
- Added a strict capability boundary: narrow or unsupported displays disable Spatial, explain why, and remain in the labeled list instead of receiving a degraded or overflowing scene.
- Extended analysis-scoped saved views with spatial mode, orientation, tilt, and zoom without storing canonical analysis content.
- Added pure geometry invariants, capability/fallback assertions, keyboard and axe coverage, and eight cross-browser Phase 4 contracts without adding WebGL, network, or third-party runtime dependencies.

## 1.9.0-bio-alpha.2 — Firefox RTL Export-Tab Test Stabilization

- Stabilized the Arabic Strategic cross-locale export contract in Firefox by activating the already accessible Export tab through focus and Enter instead of a timing-sensitive pointer hit on the freshly rendered RTL navigation.
- Preserved the production runtime and all Phase 3 analysis, graph, overlay, saved-view, schema, import, and export behavior unchanged.

## 1.9.0-bio-alpha.1 — Phase 3 Context Overlays and Durable Views

- Added localized temporal overlays that project five canonical bands from authored history, dated evidence, immediate effects, medium-term adaptations and dependencies, and future or intergenerational signals without inferring chronology.
- Added localized international-comparison cards with basis, similarities, differences, transfer limits, confidence, and direct navigation to named supporting evidence.
- Added analysis-scoped saved explorer views that restore mode, view, detail level, overlay, filters, layers, selection, neighborhood, and zoom from browser-local presentation state without storing or mutating canonical analysis data.
- Expanded standalone HTML reports with a complete named relationship atlas, explicit/evidence/structural connection families, canonical time signals, and international comparison limits while preserving the embedded and downloadable canonical JSON contract unchanged.
- Added pure projection invariants, static Phase 3 guards, lossless export markers, and eight cross-browser overlay/persistence contracts.

## 1.8.0-bio-alpha.1 — Phase 2 Guided Exploration

- Added an escapable Focus mode that expands the relationship workspace, locks background scrolling, preserves theme/RTL behavior, and safely deactivates when leaving Connections.
- Added localized deterministic walkthroughs for Story, Evidence Trail, and Network with progress, named endpoints, relationship explanations, previous/next controls, and visual target highlighting.
- Replaced transient bottom-only details with a persistent inspection dock for both records and connections; selections now survive mode and map/list changes.
- Added explicit hidden-selection messaging and a one-action reveal path that restores the full Network context without mutating the analysis.
- Added record-level inspection actions for opening the full canonical record or isolating its one-hop neighborhood.
- Added 12 cross-browser contracts for Focus behavior, walkthrough progress, inspection continuity, and hidden-context recovery, bringing the relationship explorer matrix to 32 tests.

## 1.7.0-bio-alpha.2 — Mobile Story-Test State Hotfix

- Made the Guided/Analyst browser contract explicitly switch from the intentional mobile list default to Story Map before selecting a causal connector.
- Added an immediate four-connector assertion so future failures identify view-state drift instead of waiting for the global timeout.
- No runtime, schema, graph, import, export, accessibility, or visual behavior changed.

## 1.7.0-bio-alpha.1 — Phase 1 Comprehension Architecture

- Replaced the one-layout-fits-all relationship map with three purpose-built views: numbered causal paths for Story, claim-centered support/counter clusters for Evidence Trail, and a compact nine-pillar topology for Network.
- Added Guided and Analyst detail levels so general readers see names and plain-language explanations first, while analysts retain canonical IDs, confidence, provenance, and source paths.
- Added localized “Why connected?” explanations for authored, supporting, counter, and structural relationships in Arabic, English, and French.
- Moved dense filters and layer controls into a progressive disclosure panel, kept search/reset immediately available, and added an always-visible connection legend.
- Removed the forced nine-column Network canvas in favor of a responsive three-column topology, with single-column mobile behavior and preserved RTL, keyboard, reduced-motion, and accessible list support.
- Added cross-browser contracts for deterministic causal paths, evidence clusters, detail-level disclosure, provenance, and connection explanations.

## 1.6.0-bio-alpha.2 — Story Map Pillar-Taxonomy Hotfix

- Corrected the graph-to-view pillar mapping so every indexed record uses the same nine canonical pillar keys as the review protocol and 2D lane renderer.
- Restored the four previously omitted desktop lane groups—actors/institutions, mechanisms/infrastructure, meaning/classification, and human functions—so all 32 fixture records render in Network mode.
- Restored desktop search, node inspection, and keyboard selection for records such as `ACT1`; mobile list mode was unaffected because it does not group records into lanes.
- Added a pure no-browser invariant that requires the fixture graph to populate exactly the nine rendered Biopolitical pillar keys, preventing taxonomy drift from passing CI again.

## 1.6.0-bio-alpha.1 — 2D Relationship Story Map

- Added a localized Connections review tab with deterministic Story, Evidence Trail, and Network modes over the canonical relationship index.
- Added searchable and filterable HTML node lanes with authored, evidentiary, and structural SVG connector layers; no force simulation, CDN, canvas, or network dependency is used.
- Added pillar, record-type, relation, confidence, and evidence-verification filters; one-hop neighborhood focus; live result counts; zoom, fit, and reset controls.
- Added an equivalent accessible connections list and inspectable edge details with named endpoints, relation, mechanism, provenance, and canonical source path.
- Synchronized map nodes with the existing reference inspector and added “Show in map” navigation from any named reference.
- Added responsive mobile list defaults, RTL lane mirroring, keyboard mode navigation, keyboard node selection, reduced-motion behavior, and map-specific accessibility tests.

## 1.5.0-bio-alpha.1 — Named Relationship Explorer

- Added a pure, lens-aware relationship index over every canonical Biopolitical ID-bearing record, authored link, and validated cross-reference without changing the v2.1 schema.
- Replaced raw reference-only strings in the review experience with compact chips that show the record’s human-readable name and preserve its canonical ID.
- Added an accessible side inspector (mobile bottom sheet) with type, pillar, confidence, incoming references, outgoing references, keyboard focus containment, Escape dismissal, and focus restoration.
- Added human-readable reference expansion and a named reference directory to standalone HTML reports while preserving the lossless canonical JSON payload unchanged.
- Added fixture-level graph integrity tests and cross-browser interaction/export contracts for named references.

## 1.4.0-bio-alpha.4 — Browser Matrix Resource-Stability Hotfix

- Capped the core Playwright matrix at four workers by default so report generation, downloads, WebKit, and axe scans do not saturate a developer workstation.
- Raised the cross-browser per-test budget from 30 to 60 seconds and assertion budget from five to ten seconds without weakening any contract assertion.
- Added `PLAYWRIGHT_WORKERS` as an explicit override for slower or faster hosts and documented the two-worker PowerShell fallback.
- Added a CI contract guard so the bounded-worker and timeout policy cannot silently regress.

## 1.4.0-bio-alpha.3 — Windows Browser Matrix Hotfix

- Preserved the selected language in generated Strategic samples so Arabic and French exports no longer fall back to English metadata.
- Stabilized review-tab interaction across Firefox and WebKit by removing sticky/hover movement from the navigation hit targets.
- Made modal focus restoration explicit for WebKit, which does not consistently focus buttons on pointer activation.
- Delayed object-URL cleanup so Firefox can complete consecutive HTML and JSON downloads reliably.
- Added selected-tab assertions and atomic download waits to browser tests, with a focused timeout budget for the two-file lossless export contract.
- Added a safe cross-platform release-layout migration for upgrades over an older directory; it preserves divergent files and removes only verified duplicates.

## 1.4.0-bio-alpha.2 — Audit Remediation

- Upgraded the canonical Biopolitical schema to `2.1.0`, added legal, international, five-level capture, theoretical-comparison, evidence-design, verification, and outcome-character requirements, and generated a strict browser validator from the schema.
- Added a separate `biopolitical-migrated-draft-v1` identity so legacy six-layer material is preserved without being falsely stamped canonical.
- Enforced exact 13 capture criteria, nine explanation families, five capture levels, global ID uniqueness, typed references, falsifiers, quantitative metadata, evidence traceability, and self-audit consistency at import time.
- Separated structural readiness from source verification; placeholder fixtures and unverified sources cannot pass the publication gate.
- Hardened prompts against embedded instructions, fabricated evidence, profiling, coercive surveillance, repression, manipulation, stigmatization, and group-to-individual inference.
- Made review/export lossless through expanded analytical cards, canonical JSON download, a complete in-app contract inspector, and an embedded machine-readable payload in HTML reports.
- Made report language follow the analysis language independently of the interface language and completed Arabic/French fixture localization and enum/audit labels.
- Added keyboard-complete tabs, semantic accordions, segmented-control radio states, modal focus restoration/trapping, and automated accessibility scanning.
- Standardized CI on npm, expanded Chromium/Firefox/WebKit/mobile coverage, added adversarial import/parser/export tests, archived non-production root prototypes, and replaced the development server with a minimal dependency-free static server.

## 1.4.0-bio-alpha.1 — Biopolitical Training Map v2 Replacement

- Replaced the former six-array Biopolitical semantic remap with the independent `biopolitical-training-map-v2` contract and schema `2.0.0`.
- Added nine analytical pillars spanning question/context, human functions, actors and affected populations, mechanisms and infrastructure, meaning and classification, intervention/capture, distribution, evidence and rival explanations, and agency/alternatives.
- Added the protection-to-expropriation intervention continuum, 13 capture criteria, source hierarchy, calibrated conclusion, and 18-point self-audit.
- Added trilingual v2 prompts, canonical fixtures, readiness diagnostics, review navigation, responsive rendering, and schema/contract-tagged HTML export.
- Preserved the Strategic v1.1 engine and made lens changes/imports contract-safe.
- Added a conservative legacy Biopolitical v1.1 migration adapter that does not invent governing actors or intervention modality and exposes missing v2 fields as warnings.
- Added dedicated v2, schema, fixture, import, export, cross-locale, accessibility, desktop, RTL, and mobile QA coverage.

## v1.3.0-bio — Stable Release Tag + Archive

- Relabeled the locked alpha.7 evidence/stable baseline as `v1.3.0-bio`.
- Added final handoff documentation for source-of-truth, validation, evidence, CI, and commit/push expectations.
- Preserved the Strategic/Biopolitical dual-lens feature set without product expansion.
- Kept the isolated hosted-evidence browser gate and evidence-review check as stable-release requirements.
- Updated app, export, tests, documentation, package, and lockfile metadata to `1.3.0-bio`.

## v1.3.0-bio — Evidence Artifact Review + Release Candidate Freeze

- Added `tests/hosted-demo-evidence-review-check.mjs` to verify hosted-demo evidence artifacts after browser capture.
- Added `npm run test:evidence:hosted` as the manual/local evidence review alias.
- Updated GitHub Actions to review `hosted-demo-evidence/` before uploading the artifact.
- Added `docs/evidence-artifact-review.md` to document required evidence files, metadata, locale snapshots, and stable-release freeze rules.
- Bumped root app identity and lockfile metadata to `1.3.0-bio`.

## v1.3.0-bio — Hosted Demo Evidence + Public UI Lock

- Added `tests/hosted-demo-evidence.spec.js` for browser-captured public UI evidence.
- Added `npm run test:browser:hosted` as a focused hosted-demo evidence gate.
- Captures desktop/mobile screenshots plus Arabic, English, and French visible-text snapshots.
- Added GitHub Actions artifact upload for `hosted-demo-evidence`.
- Hardened workspace hygiene against both local and CI hosted-demo evidence folders.
- Updated release-lock and export docs to cover public UI evidence capture.
- Bumped root app identity and lockfile metadata to `1.3.0-bio`.

## v1.3.0-bio-alpha.5 — Release Lock + CI Hygiene Hardening

- Added stable CI aliases: `test:ci:no-browser`, `test:ci:browser`, and `test:ci`.
- Updated GitHub Actions to run the same no-browser and browser aliases validated locally.
- Added `tests/ci-script-contract-check.mjs` to prevent workflow/package-script drift.
- Hardened workspace hygiene against preview tracks, Playwright output, patch folders, and root patch/package ZIP artifacts.
- Added release lock documentation in `docs/release-lock.md`.
- Bumped root app identity and lockfile metadata to `1.3.0-bio-alpha.5`.

## v1.3.0-bio-alpha.5 — Review Title Lens Contract Hotfix

- Made the review heading explicitly lens-aware for strategic mode as well as biopolitical mode.
- Preserved the stable `#reviewTitle` browser-test anchor added in alpha.4.1.
- Bumped contract checks to `1.3.0-bio-alpha.5`.

## v1.3.0-bio-alpha.5 — Lens Import Contract + Cross-Locale Export QA

- Added browser import-contract coverage proving `analysis_lens` in imported JSON overrides the previous UI lens state.
- Added browser export coverage across Arabic, English, and French for both Strategic and Biopolitical lenses.
- Added a root source-of-truth guard to reject committed `preview/` or `biopreview/` duplicate app tracks.
- Added optional workspace hygiene checks for patch folders and Playwright output artifacts before commit.
- Preserved the explicit HTML export contract markers introduced in alpha.3.

## v1.3.0-bio-alpha.3.3 — Export Scenario Rationale Contract Hotfix

- Includes scenario rationale text in downloaded HTML reports so export evidence preserves why a scenario is plausible.
- Keeps the biopolitical export contract assertion for the English `proof infrastructure` sample token.
- Adds a static guard so the scenario rationale renderer cannot silently disappear.

## v1.3.0-bio-alpha.3.2 — Export Contract Locale Determinism Hotfix

- Fixed export-contract browser coverage so English sample-token assertions first switch the UI locale to English.
- Preserved the lens contract assertions for Strategic and Biopolitical exports.
- No runtime/export behavior change beyond version identity.

## v1.3.0-bio-alpha.3 — Browser Evidence + Export Contract Hardening

- Added exported HTML contract markers for `app-version` and `analysis-lens`.
- Added `data-analysis-lens` and `data-app-version` attributes to the standalone report shell.
- Added browser export contract coverage that downloads Strategic and Biopolitical HTML reports through the real UI and attaches them as Playwright evidence.
- Added positive/negative export assertions so Strategic reports do not leak Biopolitical report identity and Biopolitical reports do not leak the Strategic report chain.
- Added `docs/export-contract.md` and `npm run test:browser:export`.

## v1.3.0-bio-alpha.2.2 — Runtime Metric Renderer Smoke Fix

- Restored the missing `metricCard` runtime renderer used by the overview quality panel.
- Added a static guard so future scoring UI updates cannot pass without the metric renderer.
- Preserved the alpha.2.1 layout and review-panel stability fixes.


## v1.3.0-bio-alpha.2.1 — Browser Smoke Hotfix

- Hardened the Strategic/Biopolitical lens toggle layout so adjacent select fields cannot intercept browser click targets.
- Added defensive review-tab fallback rendering so sample loading cannot leave the review panel empty after viewport-dependent interaction timing.

## 1.3.0-bio-alpha.2 — Lens-Aware Scoring + Preview Track Decision

- Added biopolitical ontology diagnostics for problematization, population construction, governance techniques, normalization/subjectivation, embodied/social outcomes, and resistance/feedback.
- Made the quality score lens-aware: Strategic keeps the original strategic scoring emphasis, while Biopolitical increases weight on governance coherence and protection/control contradictions.
- Added biopolitical-specific score diagnostics, health warnings, formula text, and evidence pressure checks.
- Added `docs/preview-track-decision.md` to prevent root/preview source-of-truth drift.
- Strengthened QA/static gates to require lens-aware scoring and the preview-track decision document.

## 1.3.0-bio-alpha.1 — Biopolitical Lens Toggle Foundation

- Added a visible Strategic/Biopolitical analysis lens toggle.
- Preserved the original strategic model and backward-compatible six-array JSON structure.
- Added `analysis_lens` support to normalization, generated schema prompts, formal schema, and fixtures.
- Added biopolitical prompt ontology: problematization, populations, governance techniques, norms/subjectivation, embodied/social outcomes, and resistance/feedback.
- Added lens-aware UI labels, topic placeholders, engine map copy, report subtitle, health messages, and score hints.
- Added trilingual biopolitical labels for Arabic, English, and French.
- Added strategic and biopolitical sample routing through the existing sample button.
- Added biopolitical fixtures in Arabic, English, and French.
- Strengthened QA gates to detect missing analysis-lens support and missing biopolitical ontology tokens.


## 1.2.0 — Modular QA hardening

- Split the former single-file app into `index.html`, `src/styles.css`, and `src/app.js` while preserving static GitHub Pages deployment.
- Added app version metadata for release verification.
- Added consolidated QA gate at `tests/qa-check.mjs`.
- Added dedicated schema governance check at `tests/schema-check.mjs`.
- Added static accessibility gate at `tests/a11y-static-check.mjs`.
- Added mobile RTL Playwright smoke coverage at `tests/rtl-mobile.spec.js`.
- Added runtime accessibility Playwright smoke coverage at `tests/a11y.spec.js`.
- Strengthened the formal JSON schema with required IDs, minimum section counts, evidence counter-pressure, and scenario falsifier requirements.
- Updated package scripts for QA, schema, fixture, accessibility, browser, and RTL checks.

## 1.1.0 — Analytical rigor upgrade

- Added formal schema contract at `schema/strategic-analysis.schema.json`.
- Added Research prompt mode with source discipline, counter-evidence, uncertainty, IDs, and silent self-audit instructions.
- Added computed model metrics: API, NSI, tool pressure score, and interest weight.
- Added quality gate logic before publication/export.
- Strengthened evidence handling with source metadata and counter-evidence.
- Added fixture validation tests.

## 1.0.0 — Initial public release

- Public semantic versioning starts here.
- Added optimized runtime image assets: 512 px, 192 px, 180 px, and 32 px versions. The original 2048 px mascot remains as the editable/source asset only.
- Added trilingual UI: Arabic, English, and French.
- Fixed RTL welcome layout and mascot integration.
- Simplified export workflow to HTML report only.
- Added static release checks and Playwright smoke test skeleton.
