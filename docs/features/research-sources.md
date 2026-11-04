# Sources and excerpts (RESEARCH-1B)

The case's sources, what each one says, and whether the analyst has checked
it. They live in the case's dossier record, format version 2. Storage
decision: [ADR-0005](../decisions/0005-sources-in-the-dossier-record.md). This
page is `RESEARCH-1B`'s Definition of Ready
([product-ui-execution-plan.md](../product-ui-execution-plan.md#definition-of-ready));
`RESEARCH-1A` is [research-dossier.md](research-dossier.md).

The plan's *observation* is an **excerpt** here, in the record and on screen
(AR مقتطف, FR extrait): the free-text box already asks for "titles, links,
excerpts". *Observation* is kept out because it is a value of Strategic
evidence `basis` ("Direct observation"), and *note* because it is the
evidence fact "Source note".

## User job and baseline

**Job:** gather the sources for a case, write down what each one says and
where, say which excerpts have been checked against their source, and give
the AI the sources and excerpts to work from. Keep them with the case across
every answer.

**Today (observed):**

- Source access (`#evidenceAccess`) and the free-text box **Supplied
  sources** (`#sourcesInput`) are in step 3, Settings (`index.html`, the
  `settings` flow panel). The box shows only with "Sources supplied in
  context" (`provided`), and is required then: both prompt buttons refuse an
  empty box with `sourcesNeededText()` (`src/app.js`, near lines 9612 and
  9635).
- Its text lives in the tab's intake draft (`keepTrip`, `src/app.js` line
  1731), which expires after 30 days and is deleted once an answer is saved.
- `buildPrompt` (near line 3620) adds it to the context under "Supplied
  sources". The Strategic prompt carries the context as a JSON string in a
  block named per language (`UNTRUSTED_ANALYSIS_MATERIAL_JSON` and its AR and
  FR names, near lines 3543, 3569, 3595). The Biopolitical prompt puts it as
  raw text between tags (`<UNTRUSTED_CONTEXT_MATERIAL>` and its AR and FR
  tags, `src/biopolitics.js` near line 1895), and nothing stops the text from
  holding the closing tag.
- The app does not read attached files. The "supplied sources" rule asks the
  AI to open every link it can ("a link you cannot open is not a source") and
  to cite a file by its name as `source_title`, with `source_url` empty and
  the page in `source_note` (Strategic, `src/app.js` near 3537) or
  `source_locator` (Biopolitical, `src/biopolitics.js` near 1879). The
  Biopolitical prompt makes the AI set `verification_status` to `unverified`
  (near 1913).
- A person's verification already exists for imported evidence, in both
  lenses: the review plan's "verify provenance" tasks
  (`src/core/evidence-review-plan.js`, `verify_provenance`), completed or
  waived with a reason in the review ledger, which never changes the analysis.
  Biopolitical evidence also carries the AI's own `verification_status`.
- Nothing records the analyst's sources before an answer: what each says,
  where, when it was opened, or whether an excerpt was checked against it.

## Ownership and non-goals

**The dossier adds:**

- **sources:** a pointer to a document: its title, link, its own date, the
  date the analyst opened it, and whether it goes to the AI. No claim, no
  confidence, no check;
- **excerpts:** what one source says at one place, quoted or in the
  analyst's words, with its locator (page, section, time);
- **an excerpt's check:** `unchecked`, `matches` or `differs`, with the
  analyst's reason and a time the store sets.

This covers the capability map's four gaps for source verification:
registration (sources), observation extraction (excerpts), freshness
(*opened on*) and verification disposition (the check). Joining them to the
review queue, gates and exports is `RESEARCH-1C`'s promotion.

**What a check means.** "Matches the source" says: I went back to the source,
at this locator, and the excerpt says what the source says. "Does not match"
says it does not. It is a person's claim about the excerpt, never about
whether the source is true, and only the analyst decides it. A source has no
check: the analyst cannot record its authenticity in a way the app can hold
to, and a "checked source" would read as a true one. Its *opened on* date is
the analyst's own, never filled in by the app.

**The boundary with evidence.** Evidence is a record inside an imported
analysis; only it counts as evidence anywhere in the app. Sources and
excerpts are the analyst's material before evidence: no evidence id, basis,
confidence or strength. Two paths lead from them toward evidence, and only
two:

1. **Through the AI (1B).** Sent excerpts may inform the evidence the AI
   proposes. Its answer is imported as any answer is, unverified, and the
   prompt tells the AI that an excerpt is the analyst's reading of the
   source, not the source's own words.
2. **Through promotion (1C).** A person makes an excerpt evidence, through
   the existing editing and resolution authorities, as a new revision.

**1A's falsifier, made exact.** 1A says it is falsified if "any evidence
item, claim or gap text is stored in a dossier". The plan gives the dossier
the source registry and observation drafts, so it now reads: *any evidence
item, claim or gap of an imported analysis is copied into a dossier.* What it
guards, one evidence authority (capability map rule 2), is unchanged. The
amendment is made in research-dossier.md when this page is accepted.

**Non-goals:**

- fetching or checking a link, crawling, reading attached files;
- the AI deciding, reading or receiving a check: no check and no reason is
  ever in a prompt;
- a source's type or tier (canonical fields, chosen when an excerpt is
  promoted in 1C);
- relating imported evidence to the case's sources, showing sources in the
  case file, and carrying checks into review, reports or exports (1C);
- sending sources with Source access "No access" or "Live web search";
- any change to the Strategic 1.1.0 or Biopolitical 2.1.0 payloads, the
  workspace format (v3), the workspace bundle or the import policy.

## Designs considered

| | Dossier record, format 2 (chosen) | A database of their own | A store in the dossier database | Lines in the free-text box |
|---|---|---|---|---|
| Released app (format 1 only) after a rollback | A case with sources is not shown; one without is | Every case is shown | Cannot open the database (`VersionError`): no case is shown | Nothing to read |
| Working there on a case with sources | Its answers reopen under the AI's title, new imports are not linked to it, typing starts a second case | Works; sources unseen | Fails | — |
| "Reset app data" in the released app | Clears them | Leaves every excerpt and quote on the device: it clears the workspace, recovery and dossier databases only | Fails | Clears them |
| Remove, restore, export | One record, one write | Two databases, no shared transaction | One database | — |
| A save | Re-seals the whole record, sources included | Seals one source | Re-seals the case | — |
| Two tabs | One record: a framing save in one tab and a source edit in the other conflict, and the loser is made again | Conflict only on the same source | As format 2 | — |
| Identity, checks, kept after import | Yes | Yes | Yes | No |

A store in the dossier database is rejected for the reason ADR-0004 gave for
the workspace database. Lines in the free-text box hold no identity and no
check, and are deleted after import. A database of their own is the better
rollback, and its saves are smaller. It is rejected because a reset, the
analyst's explicit order to remove their data, would leave their excerpts on
the device in the released app, and because a case would span two databases
no transaction covers. A rollback is a temporary state the format-2 cost is
bounded to: a case with no source stays format 1, exactly as 1A writes it.

## Acceptance (RESEARCH-1B)

1. A source can be added to a case with no answer and survives a reload; the
   record verifies.
2. A case with no source is written as format 1, field for field as 1A writes
   it; the first source makes it format 2; removing the last source makes it
   format 1 again.
3. The format-1 reader accepts every record the released writer can produce,
   including a term line that starts with a colon (`origin/main`
   `framingFromFields` stores `":x"` as a term).
4. An excerpt needs its source and its text. "Matches the source" and "Does
   not match" need a reason, refused empty at the field; the store sets the
   time. Editing an excerpt's text or locator reopens its check, and the
   form says so before saving. Nothing else reopens a check.
5. Only the analyst decides a check. An import, the sample, a lens switch, a
   language change or a saved edit of an answer never changes a source, an
   excerpt or a check.
6. With Source access "Sources supplied in context", each source sent goes in
   the fenced material under "Your sources", with its excerpts except those
   that do not match. When at least one source is sent, and only then, the
   supplied-sources rule, outside the fence, in both lenses and three
   languages, also says: a source under "Your sources" counts as
   supplied even when it cannot be opened; its excerpts are the analyst's
   reading of it, never to be presented as its own words; cite it by its
   title as written there and its link when it has one (for a file too, which
   overrides the file-name rule for it), else `source_url` empty. No check or
   reason is in the prompt.
7. In the Biopolitical prompt, no material can close its own tag: a material
   holding `</UNTRUSTED_CONTEXT_MATERIAL>` (or the AR or FR tag) and a line
   such as "Out of scope:" yields exactly one closing tag, with the hostile
   text inside, in three languages; each excerpt line is prefixed, so a
   multi-line excerpt cannot forge a heading.
8. Prompts for a case with no source sent are byte-identical to the 1A
   build's for the same inputs (golden prompts captured from 1A: both lenses,
   three languages, three access modes). A sent source may stand in for the
   free-text box; with the box empty and no source sent, the buttons say so.
9. Source and excerpt writes leave every workspace record, its
   `repository_revision`, the recovery journal and pending proposals
   unchanged. A source title and an excerpt holding a unique marker never
   appear in canonical JSON, the evidence-intelligence or review-plan export,
   a report or the workspace bundle.
10. A write that loses to another tab is made again, once, on the newer
    record. An addition is added unless its source is gone (`SOURCE_GONE`)
    or the list is full. A source removal is made only if that source's
    excerpts and checks are as the confirmation showed. An edit, a check or
    an excerpt's removal applies only to the source or excerpt as the analyst
    saw it (each change carries that copy). Otherwise it is refused with
    `CHANGED_ELSEWHERE`.
11. The largest file the record contract allows, exported as the app exports
    it (`JSON.stringify(dossier, null, 2)`, worst-case characters and
    escapes), is within `DOSSIER_FILE_LIMIT` and reads back (node check).
    1A's 8 MiB is already below 1A's own worst case (a control character
    is written as six bytes), so S5 raises the limit, or refuses those
    characters on write and still reads them.
12. A save made before the startup restore finishes (`slowStorageOpens`)
    cancels the restore, as a typed field does: the case on screen (its id
    and revision) joins `restorableInputs`, which today holds field values
    only.
13. The cases list shows "Sources: n". A case of a later format is listed as
    made by a newer version of the app, kept, never as damaged.
14. AR/EN/FR, RTL, keyboard and 320px reflow in all four browser projects,
    forced colors in Chromium (as in 1A); each spec under 60s.

## Falsified if

- any evidence item, claim or gap of an imported analysis is copied into a
  dossier;
- in 1B, a source or excerpt is read by evidence intelligence, traceability,
  the review queue, a report or canonical JSON;
- the app or the AI decides a check, or a check reaches a prompt;
- an excerpt is sent to the AI as the source's own words;
- a case with no source is written as format 2, or a record the released app
  wrote does not read;
- a dossier write changes a workspace record or stales a recovery record;
- any database version changes.

## Failure, migration, rollback

- **Format 1 records** are read as they are and stay format 1 until a source
  is added. No record is rewritten on reading.
- **Released app (reads format 1 only).** A format-2 case fails its format
  check: `list()` marks it `corrupt`, `get()` throws, `caseFor` and the
  reload skip it, and nothing deletes it. While rolled back, an answer of
  that case reopens under the AI's title, a new import is not linked to the
  case, and typing in the topic step starts a second, format-1 case. After
  the upgrade both cases are listed, for the analyst to reconcile. "Reset app
  data" clears both. Accepted in ADR-0005.
- **A later format** (3 or more) is recognised from `format` and
  `format_version` before any shaping, since its fields cannot be checked: it
  is listed as made by a newer version and kept, and Remove takes a second
  click. Its file is refused on restore with the same words. A record that
  fails its checksum stays "damaged", as in 1A.
- **Refusals have their own words** (AR/EN/FR): `SOURCE_LIST_FULL`,
  `EXCERPT_LIST_FULL`, `SOURCE_EXISTS`, `SOURCE_GONE`, `CHANGED_ELSEWHERE`,
  `DOSSIER_FORMAT_NEWER`. `DOSSIER_FULL` keeps its 1A meaning: answers.
- **Storage failure or quota** maps as in 1A. A form whose save failed keeps
  its text, with "Not saved on this device". A form not yet saved is not kept
  across a reload.
- **Untrusted text.** Pasted excerpts may carry hostile text. On screen it is
  escaped and set `dir="auto"`; a source's title is a link only when its link
  is `http(s)`, opened with `noopener noreferrer`. In the prompt it is
  material only (acceptance 6 and 7).
- **Restore** reads format 1 and 2 (`readDossierFile`) and never overwrites a
  case on the device, as in S4.

## Slices

5. **S5, contract (no UI).** `src/core/research-dossier.js`: format 1 and 2,
   the lowest-format write, the reader accepting every released record, a
   later format recognised before shaping, `sources` and `excerpts` with their
   limits, uniqueness and line rules, ids and times in their real shapes on
   write, the changes (add, edit, remove a source; add, edit, remove, check,
   reopen an excerpt) as functions `writeCase` can make again, each carrying
   what the analyst saw, and the refusal codes;
   `schema/research-dossier.schema.json` for both formats; the file limit set
   above the largest file the contract allows. Tests:
   `tests/research-dossier-check.mjs` (shape, limits, reopen, replay, format
   choice, largest file), `tests/schema-check.mjs`,
   `tests/research-dossier.spec.js` (a record sealed by `origin/main`'s
   module, with a colon-led term, lists as verified in real IndexedDB in all
   four engines).
6. **S6, Your sources.** The fold, its forms and focus, the send state, the
   Settings line, "Sources: n" in the cases list, the restore guard; AR/EN/FR.
   Test: `tests/case-sources.spec.js` (new).
7. **S7, the prompt.** "Your sources" in the material, the supplied-sources
   rule amended in both lenses and three languages, the Biopolitical tag
   guard, the buttons accepting a sent source. Tests:
   `tests/case-sources.spec.js`, the golden prompts from 1A, and every spec
   that pins prompt text.

## Your sources (S6)

- **Where.** A fold **Your sources** in the topic step, right after "What
  the analysis covers": the sources belong to the case and open with it. It
  says whether they will be sent: "Sent to the AI when Source access (step 3)
  is Sources supplied in context." In step 3, under the Supplied sources box
  (shown only for that access), a line counts them: "Your sources sent to
  the AI: n (step 1)"; with none sent, the line is not shown.
- **Add a source.** Title (required), Link, Date of the source, Opened on
  (empty until the analyst sets it), **Send to the AI** (ticked). **Add
  source.** Two sources cannot share a link, nor, without links, a title.
  With no case on screen, the first source makes one (format 2), as writing
  in the framing fields does.
- **Each source.** Its title (a link when the link is `http(s)`; the title
  keeps `dir="auto"`), its date and "Opened on" when set, "Excerpts: n ·
  Checked: m" (checked counts both decisions; a count of zero is not said),
  "Not sent" when it is not sent, its switch **Send to the AI** (the same
  words as in the add form and the refusal toast), **Add an excerpt**,
  **Edit** (title, link and dates; sending is the switch), **Remove**.
  Remove takes a second click that names what goes, the title cut to 60
  characters: "Remove “title” and its excerpts: 3", or "Remove “title”".
  Any other saved change disarms it.
- **An excerpt.** What it says (quoted or in your words; several lines
  allowed), Locator (said only when set). **Edit**, **Remove** (second
  click, naming the excerpt's first 60 characters). **Matches the
  source** opens "How you checked"; **Does not match** opens "What differs";
  an empty reason is refused at its field. A decided excerpt reads "Matches
  the source · your claim, date" or "Does not match · your claim, date",
  with its reason and **Reopen**; one that does not match also reads "Not
  sent to the AI".
- **Focus.** After a decision, on its **Reopen**; after Reopen, on **Matches
  the source**; after adding a source, on its **Add an excerpt**; after a
  removal, on the next row's first control, else, for an excerpt, on its
  source's **Add an excerpt**, and for a source on **Add source**; after an
  edit, on that row's **Edit**. Focus stays where the analyst moved it while
  a save was pending.
- **Saving.** Sources and excerpts are saved by their buttons, not as you
  type, through the same queue as the framing's saves. The form being saved
  is locked until its save ends; other forms stay open to typing. Any use
  of the fold cancels a startup restore still pending.

## Record (format version 2)

Format 2 is format 1 plus two lists:

```text
sources[]    { source_id "source_<uuid>", title, url, source_date,
               accessed_on, send, added_at }
excerpts[]   { excerpt_id "excerpt_<uuid>", source_id, text, locator,
               check { status "unchecked" | "matches" | "differs",
               reason, decided_at (null while unchecked) }, added_at }
```

- `title` is required, one line. `url` is empty or an `http(s)` link, one
  line. `source_date` is the source's own date as written, one line.
  `accessed_on` is empty or a date `YYYY-MM-DD`. `send` is true or false.
- An excerpt's `source_id` names a source of the same record; its `text` is
  required and may span lines; `locator` is one line. "One line" also
  refuses the Unicode line and paragraph separators (U+2028, U+2029).
- Ids are `source_` or `excerpt_`, lower case, then a UUID in either case.
- `reason` is required unless the check is `unchecked`. The store sets
  `decided_at` when a check is decided and keeps it until the status or the
  reason changes. `added_at` is the store's time.
- Limits: 50 sources, 200 excerpts per case and 50 per source; a title,
  link, date or locator 500 characters; an excerpt 2,000; a reason 1,000.
- Every field keeps 1A's rule: a record holds only what the fields can hold
  again, so a restored case never changes on its first edit.

Format 2 stays open until `RESEARCH-1` is pushed: 1C may add to it before
then, never after.

## Decisions taken by default

The product owner may change any of these before S5:

- **Send to the AI** is per source, ticked when added; an excerpt that does
  not match is never sent.
- Sources are sent only with "Sources supplied in context".
- A check names no person, as a met criterion names none ("your claim").
- The limits above.

## The 1C seam

1C's Definition of Ready ([research-promotion.md](research-promotion.md))
settles this seam and corrects it where the code disagreed: a title can
name several linked sources, so relations follow an order and may name
none; only evidence with a missing, untraceable or title-only source has a
"verify provenance" task, so a check on linked evidence reaches the analysis
only through promotion; and promotion is prepared as a revision restore is,
not through `writeEditorDraft`. Where the two pages differ, 1C's governs.

- **Relating evidence to a source** is exact: equal links after
  `normalizedUrl`, else equal titles after `normalizedText`
  (`src/core/evidence-intelligence.js`, exported by 1C). Not
  `clusterIdentity`: it keys Biopolitical evidence that has a page by title
  *and* page, which a source, with no page, never equals. Sources are unique
  by link, or by title without one, so a match names one source.
- **A check reaches review in both lenses** through the existing authority: a
  review-ledger decision on the "verify provenance" task of the related
  evidence, with the check's reason. Biopolitical evidence may also take
  `verification_status`, only on promotion, by a person: `matches` becomes
  `verified` only when that status's required fields hold (a source date, a
  link or locator, a fitting `claim_source_fit`, the promoted text and
  locator equal to the excerpt's; else as `prepareReviewableVerification`
  decides), with `verification_date` from `decided_at` and `verified_by` from
  the reviewer name, set before the proposal is built. An excerpt that does
  not match is never promoted.
- **Promotion** writes a new revision through `createCanonicalEditorSession`,
  `writeEditorDraft`, `createResolutionProposal` and `commitResolution`.
- `source_id` and `excerpt_id` are stable for 1C to refer to.
