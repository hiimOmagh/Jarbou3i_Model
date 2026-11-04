# From your sources to the evidence (RESEARCH-1C)

The case's sources and checked excerpts (`RESEARCH-1B`) meet the analysis:
the evidence that cites one of your sources says so, the case file shows
your sources beside the evidence, a provenance task on evidence related to
your source shows your check, and a person can make a checked excerpt
evidence, as a new revision.
Decision: [ADR-0006](../decisions/0006-promotion-through-resolution.md). This
page is `RESEARCH-1C`'s Definition of Ready
([product-ui-execution-plan.md](../product-ui-execution-plan.md#definition-of-ready));
`RESEARCH-1B` is [research-sources.md](research-sources.md).

*Promote* is the plan's word. On screen it is **Make it evidence** (AR اجعله
دليلًا, FR En faire une preuve): "promote" is not a word the analyst uses.

## User job and baseline

The analyst has registered a case's sources, taken excerpts and checked each
against its source. The AI's answer cites sources too. Today nothing joins
them: the analyst cannot see which evidence rests on a source they hold,
cannot bring a check to the review, and can make an excerpt evidence only by
typing it into the canonical editor field by field.

- **Evidence lives only in the canonical payload**: Strategic 1.1.0 (12
  required fields, `schema/strategic-analysis.schema.json`) and
  Biopolitical 2.1.0 (29 required fields, `additionalProperties: false`,
  `schema/biopolitical-analysis.schema.json`). Ids are free strings with no
  pattern, unique across the document (`DUPLICATE_GLOBAL_ID`, 10 Strategic
  and 24 Biopolitical collections); the samples use `E1`, `E2`. A draft may
  keep a reference to an id that does not exist (a warning). Strategic
  `evidence` is optional at the top level; when present it holds at least
  one item.
- **A canonical change** is a working draft committed by a person through
  `createResolutionProposal` and `commitResolution`
  (`src/core/resolution-transaction.js`), in the resolution dialog
  (`openResolutionTransaction`, `src/app.js`): the change shown as a diff,
  the reviewer's name, a rationale and a confirmation. Any validation error
  refuses the commit. The editor saves its draft first (`writeEditorDraft`,
  `src/core/canonical-editor.js`, raises `repository_revision`). A revision
  restore does not: `prepareRevisionRestore` (`src/core/revision-history.js`)
  refuses a dirty draft, puts the change in a copy of the workspace (same
  `repository_revision`, a new working draft on the head) and hands the copy
  and its proposal to the dialog; Confirm saves with
  `WORKSPACE_REPOSITORY.replace` (`expectedRevision`), Close drops the copy.
  Promotion follows the restore, not the editor.
- **Review tasks** are derived from the payload alone
  (`src/core/evidence-review-plan.js`). `verify_provenance` tasks exist only
  for evidence whose source identity is missing, untraceable or title only;
  evidence with a link has none, except a Biopolitical placeholder
  (`isPlaceholderEvidence`). Only a link, or a Biopolitical `source_locator`,
  makes an item traceable (`src/core/provenance.js`); a Strategic
  `source_note` does not. Evidence no record cites gets an uncited-evidence
  task. A person starts, completes (with a rationale), waives or reopens a
  task in the review ledger (`src/core/review-ledger.js`,
  `appendReviewEvent`); events are hash-chained, never rewritten, and
  travel in the ledger export and the bundle.
- **Biopolitical verification**: `verified` needs `source_title`,
  `source_date`, `verified_by`, `verification_date` and a link or a locator
  (schema), a fitting `claim_source_fit` (`UNJUSTIFIED_VERIFIED_EVIDENCE`),
  an http(s) link if there is a link (`INVALID_SOURCE_URL`, an error only
  when verified) and a title that is not a placeholder
  (`UNTRACEABLE_VERIFIED_EVIDENCE`); without a verifier and date it is
  downgraded on import (`prepareReviewableVerification`,
  `src/biopolitics-integrity.js`). Strategic evidence has no verification
  field. Any Biopolitical semantic warning blocks publication
  (`src/biopolitics.js`); evidence no claim cites is warned
  (`UNREFERENCED_EVIDENCE`).
- **Reports** are built by their own renderers
  (`buildLosslessStrategicReport`, the Biopolitical report renderer), not by
  the case file's sections. The **case file prints whole**: before printing,
  every closed fold in `#reviewContent` opens (`beforeprint`, `src/app.js`).
- **1B leaves**: sources and excerpts in the case record (format 2, open
  until `RESEARCH-1` is pushed), `normalizedUrl` and `normalizedText`
  exported, and the analysis linked to its case (`analyses`, checked by
  `caseHolds` in `src/app.js`).

## Ownership and non-goals

- The **payload stays the only evidence authority** (capability map rule 2).
  A source, excerpt or check reaches it only when a person makes an excerpt
  evidence and commits that revision.
- The **review plan stays the payload's**: the same workspace gives the same
  tasks on any device, with or without its case. The case adds context to a
  task on screen, never a task. A rationale the person saves is theirs: it
  stays in the ledger whatever happens to the case.
- The **case keeps a pointer**: which evidence an excerpt became (workspace,
  revision, evidence id). The pointer is the case's memory, not proof: the
  committed revision and its resolution record are.

**Non-goals:** a source appendix in reports or bundles; relating evidence to
a source by anything but its link or title; the app or the AI choosing a
judgement field (basis, confidence, strength, type, tier, fit, verification);
editing an evidence item's claim through promotion; citing the new item from
a claim (the editor does that); promoting into an analysis that is not
linked to the case; any change to the Strategic 1.1.0 or Biopolitical 2.1.0
payloads, workspace format v3, bundle v1, or a database version.

## Designs considered

**Relate.** (a) Store the source id in the evidence: changes the payloads;
rejected. (b) Store relations in the case: a copy that goes stale when the
analysis changes; rejected. (c) **Derive them when shown**, from the
evidence's link and title: chosen.

**Show.** (a) A new case-file section: lengthens the case file the 2026-10-29
critique shortened; rejected. (b) **A fold in the Evidence section**, plus
one line on each related evidence record: chosen. (c) A report appendix:
makes a shared report depend on one device's case; rejected (non-goal). For
the same reason the fold and the line do not print.

**Review.** (a) A task reason fed by the case: tasks would differ between
devices and between a workspace and its bundle; rejected. (b) The app
completing a task from a check: a decision no person made; rejected. (c)
**Context on the task, and a rationale the person may start from**: chosen.
The canonical fix for a title-only or untraceable source is **Fill it from
your source** (below), which ends the task when it adds a link (both
lenses) or a locator (Biopolitical); a Strategic `source_note` does not end
it, so the task stays for the ledger.

**Promote.** (a) A template with empty required fields opened in the editor:
the editor refuses invalid values, and Biopolitical has 29 fields; rejected.
(b) Defaults for judgement fields: fills the record with judgements nobody
made; rejected. (c) **A short form asking only for what a person must
judge**, everything else derived or left empty where the schema allows it,
then the resolution dialog: chosen. Two kinds: **a new evidence item**, and
**fill an existing related item from your source**. The change is prepared
as a revision restore is (a copy of the workspace, nothing saved until
Confirm), not saved as an editor draft first, so Close leaves no draft.

## Relating evidence to your sources

A link is what `normalizedUrl` keeps (http or https); any other value counts
as no link. A title is compared by `normalizedText`; an empty title relates
to nothing. An evidence item of the analysis on screen relates to at most
one of the case's sources:

1. **An item with a link** relates to the source with that link; if no
   source has it, to the source without a link that has its title. It
   never relates to a source with a different link.
2. **An item without a link** relates to the source without a link that has
   its title; if there is none, to the source with a link that has its
   title, when only one does. When several do, it relates to none and the
   fold says so.

1B keeps one source per link and one unlinked source per title, so no other
case is ambiguous. Only when the case on screen is linked to the analysis on
screen (`analyses` holds its workspace); otherwise nothing is related and
the case file is unchanged. A pure function, `relateEvidence({ evidence,
sources })` in `src/core/source-relations.js`, returns
`evidence_id → { source_id, by: "link" | "title" }` and
`source_id → [evidence_id]`.

## Screens

- **Evidence record.** A related record gets one line under its title, not
  among its facts: "From your source: <title>", with " · same title" when
  related by title. It opens the fold and moves focus to the source's row,
  as the record links do. Nothing else changes.
- **Your sources fold** in the Evidence section, both lenses, after the
  evidence records (Strategic: before Assumptions), folded. It shows the
  case as the topic step's Your sources saves it, drawn again in place after
  each saved change there, as the completion block is. Its only control is
  Make it evidence. It stays open across redraws of the same analysis, as
  other folds do, and opens again after a commit made from it. Each source:
  title (a link when `http(s)`), dates when set; "In this analysis: E3, E7"
  (each opens its record, as the record links do) or "No evidence here has
  this link or title"; its excerpts with their check ("Matches the source ·
  your claim, date" and reason, "Does not match", "Not checked yet"). A
  title several linked sources share is said once: "Several of your sources
  have this title; none is related."
- **Print.** The fold and the record line do not print, and opening folds
  for print skips the fold; a printed case file shows the analysis as today.
- **A matching excerpt** has **Make it evidence**. If it already became
  evidence here: "Evidence E7 (revision 4)", and "Changed since" when its
  text or locator, or its source's title, link or date, was edited after.
  At 10 pointers it says "This excerpt already became evidence 10 times, in
  any analysis. Add it again as a new excerpt to use it once more." and
  opens no form.
- **The form** (a group under the excerpt): **New evidence record** or, when
  the source relates to items, **Fill E3 from your source** for each item
  this excerpt does not already point to. Then the fields the kind needs
  (below), **Review the change**, **Cancel**. An empty required field is
  refused at its field. The form keeps the excerpt it was opened on, its
  choice and what was typed across redraws of the case file, and focus stays
  on the same field, as in Your sources (1B). Using the form counts as a use
  of the fold for the startup restore.
- **Review the change** reads the case again; if the excerpt is gone, no
  longer "Matches the source", or its text or locator changed since the form
  opened, it refuses (`EXCERPT_NOT_MATCHING`) and nothing opens. Otherwise
  it opens the resolution dialog with the change as its diff and a
  rationale the person may start from ("From your source “title”, at
  <locator>, checked <date>: <reason>"). **Confirm** reads the case again
  the same way before it commits. **Close** leaves the analysis exactly as
  it was, and the form as it was.
- **Review ledger.** A `verify_provenance` task whose evidence relates to one
  of your sources shows "Your source: <title> · matching excerpts: n" (the
  count left out when no excerpt matches). When Complete is the chosen
  action (for a task in review it is the first, so it is chosen when the
  task opens) and the rationale field is empty, it starts with the same
  sentence for the matching excerpt checked last (`decided_at`); it never
  replaces text the person typed, and a start nobody edited goes when the
  action changes or the ledger closes. Nothing is written until the person
  appends the event. Once saved, the
  rationale is the person's: the ledger, its export and the bundle keep it,
  and removing the source or excerpt does not remove it.
- **Focus.** After Make it evidence, on the form's first choice; after the
  form's Cancel, on Make it evidence; after Close, on Review the change
  (passed to the dialog as its invoker); after a commit, once the pointer is
  written, on the excerpt's "Evidence E7" line (the fold opened again), or
  on Save again if the pointer could not be written, unless the analyst
  has moved focus meanwhile, as in 1B; after a refusal, on its field or the
  button that failed, with the reason said under the form and kept across
  redraws. A refusal in the dialog is said in the dialog, with focus kept
  there.

## What the form asks

**New evidence item.** Derived: `id` (the next `E<n>` that is not an id or
a reference anywhere in the document), `source_title`, `source_url`,
`source_date` (from the source; the date of the source, not "opened on"),
the locator (Strategic `source_note`, Biopolitical `source_locator`), each
empty when the source or the excerpt has none; `claim` starting as the
excerpt's text (editable). If a Strategic analysis has no `evidence`
section, the item starts one.

- **Strategic**, asked: `basis`, `confidence`, `evidence_strength` (1–5),
  `source_type` (text), `uncertainty`, `counter_evidence` (text, may be
  empty). No defaults.
- **Biopolitical**, asked: `epistemic_type`, `source_tier`,
  `claim_source_fit`, `confidence`, `uncertainty`, `limitations`,
  `counter_evidence` (each non-empty), `replication_status` (starts at
  "unknown"), and verification: `unverified`, `partially_verified`, or
  `verified`. `verified` is offered only when the item the form makes would
  pass the lens's own checks as verified: a title that is not a
  placeholder, a date, an http(s) link or a locator that is not blank, no
  other kind of link, and fit direct, indirect or context only. A title or
  date of spaces only counts as none. The lens decides what a placeholder
  is (`isPlaceholderEvidence`): a placeholder title, or the only record, with
  no link and cited by nothing; a placeholder is never offered `verified`.
  It then asks
  **Verified by** (starting with the reviewer name of this device) and sets
  `verification_date` to the day of the check in the device's time zone
  (`YYYY-MM-DD`). Otherwise `verified_by` and `verification_date` are empty.
  The twelve context fields stay empty, as the schema allows, for the
  editor: `geography`, `population`, `measurement_method`, `denominator`,
  `sample_size`, `measurement_validity`, `causal_identification`,
  `conflicts_of_interest`, `missing_data`, `selection_effects`,
  `relevant_comparison`, `cross_context_applicability`.

**Nothing cites the new item yet.** The review plan gives it an
uncited-evidence task (and a missing-counter-evidence task for a Strategic
item with empty `counter_evidence`). In Biopolitical the check warns
`UNREFERENCED_EVIDENCE`, `EVIDENCE_NOT_PUBLICATION_READY` unless verified,
`QUANTITATIVE_METADATA_MISSING` for a `quantitative_estimate` (until
`sample_size`, `measurement_validity`, `causal_identification`,
`missing_data`, `selection_effects` and `relevant_comparison` are filled),
and `SELF_AUDIT_VERIFICATION_CONTRADICTION` when the self-audit says the
evidence is verified; publication waits until the editor resolves them. The
resolution dialog shows these warnings before Confirm. Strategic adds no
warning. Two Biopolitical edges, both tested: a new record made from a
source whose title reads as a placeholder is itself a placeholder (it is
warned `EVIDENCE_NOT_PUBLICATION_READY`, not `UNREFERENCED_EVIDENCE`); and
when the analysis's only record is a placeholder because it is alone, the
new record makes it a real record nothing cites, warned
`UNREFERENCED_EVIDENCE` too. Fill adds no warning, except
`UNREFERENCED_EVIDENCE` when a lone placeholder record gets a link, and a
record whose blank title is filled from a placeholder-titled source becomes
a placeholder; Fill with `verified` removes `EVIDENCE_NOT_PUBLICATION_READY`.

**Fill an existing item from your source.** Only empty or blank fields are
filled: `source_title`, `source_url`, `source_date`, the locator. In
Biopolitical the person may also set an `unverified` or
`partially_verified` item to `verified` when the filled item passes as
above; `verified_by` and `verification_date` are then set. The claim and
every other judgement stay as they are. If nothing would change, the choice
is not offered.

## Words (AR/EN/FR)

One word per idea, the app's words first. On screen an evidence item is an
**evidence record**, as the case file calls it ("record" is never a verb
here: the pointer is *saved*). The form's Cancel is `sourceCancel`; the
dialog's Close is its own. "Case" is القضية / dossier, as in 1A.

| EN | AR | FR |
|---|---|---|
| Make it evidence | اجعله دليلًا | En faire une preuve |
| New evidence record | سجل دليل جديد | Nouvelle fiche de preuve |
| Fill {id} from your source | املأ {id} من مصدرك | Compléter {id} depuis votre source |
| Review the change | راجع التغيير | Examiner la modification |
| Verified by (`biopolitics.js`) | تحقق بواسطة | Vérifié par |
| Evidence {id} (revision {n}) | الدليل {id} (النسخة {n}) | Preuve {id} (révision {n}) |
| Changed since | تغيّر منذ ذلك | Modifié depuis |
| Not checked yet | لم يُتحقَّق منه بعد | Pas encore vérifié |
| No longer in this analysis | لم يعد في هذا التحليل | N’est plus dans cette analyse |
| In this analysis: {ids} | في هذا التحليل: {ids} | Dans cette analyse : {ids} |
| No evidence here has this link or title | لا دليل هنا بهذا الرابط أو العنوان | Aucune preuve ici n’a ce lien ou ce titre |
| From your source: {title} | من مصدرك: «{title}» | De votre source : « {title} » |
| · same title | · العنوان نفسه | · même titre |
| Several of your sources have this title; none is related. | يحمل عدد من مصادرك هذا العنوان؛ لا يرتبط به أيّ منها. | Plusieurs de vos sources portent ce titre ; aucune n’est reliée. |
| Your source: {title} · matching excerpts: {n} | مصدرك: «{title}» · المقتطفات المطابقة: {n} | Votre source : « {title} » · extraits conformes : {n} |
| From your source “{title}”, at {locator}, checked {date}: {reason} | من مصدرك «{title}»، في {locator}، تُحقّق منه في {date}: {reason} | De votre source « {title} », à {locator}, vérifié le {date} : {reason} |
| {id} is in the analysis. This case could not save it. | {id} في التحليل. تعذّر على هذه القضية حفظ ذلك. | {id} est dans l’analyse. Ce dossier n’a pas pu l’enregistrer. |
| Save again | أعد الحفظ | Enregistrer à nouveau |
| This excerpt already became evidence 10 times, in any analysis. Add it again as a new excerpt to use it once more. | صار هذا المقتطف دليلًا 10 مرات في أي تحليل. أضفه من جديد كمقتطف جديد لتستعمله مرة أخرى. | Cet extrait est déjà devenu une preuve 10 fois, toutes analyses confondues. Ajoutez-le comme nouvel extrait pour l’utiliser encore. |
| `EXCERPT_NOT_MATCHING`: The excerpt changed or no longer matches its source. Check it again. | تغيّر المقتطف أو لم يعد يطابق مصدره. تحقّق منه من جديد. | L’extrait a changé ou n’est plus conforme à sa source. Vérifiez-le à nouveau. |
| `ANALYSIS_NOT_LINKED`: This analysis is not linked to this case. | هذا التحليل غير مرتبط بهذه القضية. | Cette analyse n’est pas liée à ce dossier. |
| `DRAFT_NOT_CLEAN` (as `dirtyBlocked`): The working draft has uncommitted changes. Commit or remove that draft first. | تحتوي مسودة العمل تغييرات غير معتمدة. اعتمد المسودة أو أزل تغييراتها أولًا. | Le brouillon contient des modifications non validées. Validez-les ou supprimez-les d’abord. |
| An id the case cannot keep: The case cannot keep this id: it is empty, too long or on more than one line. | لا تستطيع القضية حفظ هذا المعرّف: فارغ أو طويل جدًا أو على أكثر من سطر. | Le dossier ne peut pas garder cet identifiant : vide, trop long ou sur plusieurs lignes. |

The build checks each string against the app's existing keys before adding
one, and fixes AR/EN/FR together.

## Record change (format 2, still open)

An excerpt may hold `promotions`, a list of at most 10 pointers:

```text
promotions[] { workspace_id, revision_id, evidence_id, promoted_at,
               kind "new" | "fill", changed_since (true | false) }
```

- An excerpt without pointers has no `promotions` (the lowest shape, as in
  ADR-0005), so a record 1B wrote still verifies. Format 1 is unchanged.
- Each id is one line of at most 200 characters. Before the form opens,
  Make it evidence refuses a workspace or evidence id that is empty, holds a
  line break or is longer, saying it cannot point to it; before the dialog
  opens, the revision id the commit will make is checked the same way.
- Written after the commit, on the newest record, through the case's write
  queue, by the store's clock. The excerpt is found by its id and the
  pointer added; nothing else on the excerpt is compared, so another tab's
  check or pointer is kept, and a conflict is made again once. If the
  excerpt's text or locator, or its source's title, link or date, differ
  from what the form used, the pointer is written with
  `changed_since: true`. If the excerpt is gone, nothing is
  written and the fold says so.
- One entry per workspace and evidence id; a new one replaces the old one.
- `changed_since` turns true when the excerpt's text or locator, or its
  source's title, link or date, is edited (an excerpt edit also reopens its
  check, as in 1B).
- Removing an excerpt or its source removes its pointers; the evidence
  stays in the analysis.

## Acceptance (RESEARCH-1C)

1. `relateEvidence` follows the two rules and never relates across
   different links (node check: both lenses' samples, and made-up items for
   equal links, different links, title only, one title on several linked
   sources, an empty title, and a value that is not a link).
2. With a case linked to the analysis on screen, related records show their
   line and the fold lists every source with its excerpts, checks and
   related ids, in both lenses; with no case, or a case not linked to it,
   the case file is byte-identical to today's, on screen and in print.
3. Canonical JSON, both reports, the workspace bundle, the review-ledger and
   evidence-intelligence exports are byte-identical with and without a case
   until a person commits a promotion or saves a review event.
4. The review plan of a workspace is identical with and without its case;
   the ledger shows the context line and starts an empty rationale; no event
   is written without the person's action.
5. Make it evidence exists only on a matching excerpt of a case linked to
   the analysis on screen, with a clean working draft, fewer than 10
   pointers, and ids a pointer can hold; otherwise it says why (no analysis
   linked, a draft to save or discard first, the list full, an id it cannot
   point to). The check is read again at Review the change and at Confirm.
6. For an analysis with no error before, every combination the form allows,
   for a new item and for Fill, adds no schema or integrity error; the
   warnings each adds are asserted separately (a new item: those listed
   above; Fill: including a placeholder that becomes a real, uncited item).
   An error already in the analysis still refuses the commit. A new item's
   id is not an id or a reference anywhere in the document.
7. Fill changes only empty or blank fields and never the claim or a
   judgement, except verification when the person chooses it.
8. Biopolitical `verified` is offered only when the lens's checks pass and
   is set only by the person's choice; the result passes
   `prepareReviewableVerification` unchanged.
9. Review the change shows the diff; Close leaves the workspace record and
   its working draft as they were; Confirm commits one revision with the
   person's name and rationale.
10. After the commit the excerpt holds its pointer and shows it; if the case
    write fails while the page is open, the evidence stays, the excerpt says
    it could not save it, and **Save again** writes the pointer.
11. Editing the excerpt or its source marks its pointers `changed_since`;
    removing it or its source removes them; the evidence stays.
12. A second tab: a pointer written over another tab's change is made again
    once and keeps that change (as in 1A/1B); a commit over another tab's
    change is refused by the workspace store's revision check
    (`WRITE_CONFLICT`, as the resolution dialog says it today) and nothing is
    saved.
13. AR/EN/FR, RTL, keyboard only, 320px reflow, forced colours; chromium,
    firefox, webkit, mobile-chrome.
14. The largest case file the contract allows, with 10 pointers on each of
    200 excerpts and ids at their limit, is within `DOSSIER_FILE_LIMIT`
    (28 MiB since 1C; 24 MiB could not hold it) and reads back (node
    check).

## Falsified if

- any evidence item, claim or gap of an imported analysis is copied into a
  case (a pointer holds ids only);
- a source, excerpt or check reaches a payload, report, print, bundle or
  export other than through a revision a person committed or a review
  rationale a person saved;
- a workspace's review tasks differ with and without its case;
- a review event, a canonical change or a verification happens without a
  person's action, or a judgement field is filled by the app or the AI
  (other than `replication_status` starting at "unknown", the schema's
  value for no judgement, which the person may change);
- an excerpt that does not match, or is not checked, at Confirm becomes
  evidence;
- a payload schema, the workspace format, the bundle schema or a database
  version changes.

## Failure, migration, rollback

- **Migration:** none for workspaces. Format 2 is unreleased (ADR-0005), so
  no released record changes; an excerpt gains `promotions` only when it
  gets a pointer.
- **Two databases, no shared transaction.** The commit comes first; the
  pointer after. A pointer not written (`WRITE_CONFLICT` after its one
  replay, `DOSSIER_FORMAT_NEWER`, `DOSSIER_SHAPE_INVALID`, the list full, a
  storage failure) is said on the excerpt: "E7 is in the analysis. This case
  could not save it." with the reason and Save again. It never uses the
  case's "Not saved… your text is still here" or "Open the case again".
  Save again lasts while the page is open and replaces Make it evidence on
  that excerpt. After a reload or crash the pointer is not rebuilt: the
  revision stays, and the source's "In this analysis: E7" line still shows
  the evidence. The revision and its resolution record remain the proof.
- **The analysis moves on.** A later revision that removes or changes the
  evidence leaves the pointer naming its revision; the fold says "No longer
  in this analysis" when the id is gone from the head.
- **Rollback to the released app:** format-2 cases are unread
  (`DOSSIER_FORMAT_NEWER`), as in 1B; committed evidence stays in the
  workspaces. 1B and 1C reach users in one push; a 1B reader would drop
  `promotions` and refuse such a case as damaged. Reset app data clears all.
- **Refusals** (AR/EN/FR): `EXCERPT_NOT_MATCHING`, `ANALYSIS_NOT_LINKED`,
  `DRAFT_NOT_CLEAN`, `PROMOTION_LIST_FULL`, an id too long to point to, and
  the resolution authority's own codes as it says them today.

## Slices

8. **S8, relate and show.** `src/core/source-relations.js` and its node
   check; the evidence line and the fold in both lenses, drawn again after
   a save in the topic step, not printed; acceptance 1–3, and 13 for the
   fold and the evidence line. Tests: `tests/source-relations-check.mjs`,
   `tests/case-file-sources.spec.js` (new), the export goldens unchanged.
9. **S9, review context.** The ledger's context line and starting rationale;
   acceptance 4. Tests in `tests/case-file-sources.spec.js` (the same tasks
   with and without a case) and the review plan's node check (its module
   reaches no case module).
10. **S10, the contract.** `promotions` in format 2: `excerptOf`,
    `materialOf` (at most 10, one per workspace and evidence id), the
    schema's excerpt, the pointer write (`addPromotion`, found by id),
    `changed_since` on excerpt and source edits, removal, the maximal
    fixture. Pure builders `newEvidenceFrom(lens, source, excerpt, fields)`
    and `filledEvidence(lens, item, source, excerpt, fields)` validated
    against each lens, and `preparePromotion(workspace, payload, {
    validate, deriveDiagnostics })` (as `prepareRevisionRestore`:
    `DRAFT_NOT_CLEAN` on a dirty draft, a copy with a new draft on the head,
    no `transaction`, so the commit is a `committed_resolution`); acceptance
    6–8, 11, 14. Tests: `tests/research-dossier-check.mjs`,
    `tests/schema-check.mjs`, a promotion matrix against both validators.
11. **S11, make it evidence.** The form, the case read again at Review the
    change and at Confirm (the dialog gains a check before commit and a
    starting rationale), the resolution dialog with its diff, the pointer
    and Save again, refusals, focus; acceptance 5, 9, 10, 12, 13. Test:
    `tests/case-promotion.spec.js` (new).

## Decisions taken by default

The product owner may change any of these before S8:

- No source appendix in reports; the case export carries the case. The fold
  and the record line do not print.
- The fold is in the Evidence section, after the evidence records
  (Strategic: before Assumptions), folded.
- Strategic promotion asks for every judgement with no default; Biopolitical
  starts `replication_status` at "unknown" and leaves the twelve context
  fields empty for the editor.
- Citing the new item from a claim is left to the editor; until then the
  item is uncited (a review task, and in Biopolitical a warning that holds
  publication). Asking for the citing claims in the form is the alternative.
- An excerpt can become evidence once per evidence item and analysis; up to
  10 pointers; past that, the excerpt is added again.
- Fill offers only empty or blank fields.
