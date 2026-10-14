# Design-System Kernel (UIX-1)

The kernel is the base of the new interface chosen in
[ADR-0002](../decisions/0002-select-case-file-and-waive-gate0.md): UX-0 concept B,
case file. It holds tokens, themes, accessibility foundations, base controls
and their DOM contracts. It changes no schema, persistence, analysis view or
framework. The modern shell (UIX-2) is the first part of the app built on it.

## Files

| File | Role |
|---|---|
| `src/ui/kernel.css` | Tokens (`--j-*`), dark and light themes, density, foundations, base controls (`.j-*`) |
| `src/ui/contracts.js` | DOM-contract registry: the structure each control needs, and `checkContracts(root)` |
| `src/ui/controls.js` | Behaviour CSS cannot give: `bindSegmented` (arrow keys, mirrored in RTL) |
| `tests/ui-harness/` | Component harness: every control in each state, from `?lang=ar\|en\|fr&theme=system\|dark\|light&density=comfortable\|compact`. Not deployed. |

## Rules

- **Namespace.** Every token, class and keyframe is `j-` prefixed. Foundations
  apply only inside `.j-root`, and so does the colour scheme.
  `tests/ui-kernel-check.mjs` checks this, so the kernel never restyles a view
  by accident.
- **The rest of the app follows the kernel.** The legacy tokens in
  `src/styles.css` (`--bg`, `--text`, `--muted`, `--accent` and the others)
  point at kernel tokens. So every view, before it is rebuilt, takes the
  case-file look in both themes.
  - Text on an accent fill uses `--on-accent`.
  - Categorical colours (`--p1` to `--p6`), shadows and radii stay legacy.
  - `tests/ui-kernel.spec.js` checks that the app's colours follow the kernel
    in both themes.
  - `tests/a11y-static-check.mjs` checks the muted-text margin of 4.75:1 in
    both themes.
- **Contracts.** A `.j-*` class may only be used with the structure in
  `contracts.js`: a status needs a tone and text, a segmented control is a
  radiogroup with exactly one checked option, a field's label names its input,
  and so on. A button is plain, `primary`, `ghost` or `danger` (deletes and
  resets). A note (`.j-note`) is a sentence that says a state: it needs a
  tone, and is hidden while empty. A class the registry does not know is an error. The stylesheet
  and the registry must list the same classes.
- **Themes.** Dark first. Light is designed, not inverted. Without
  `data-theme` the theme follows the system.
- **Accessibility.** Status uses shape, colour and text; colour never stands
  alone. Controls are at least 44px in both densities. Focus is a 2px outline.
  Reduced motion stops animation. Forced colours keep the primary action
  outlined. Arabic labels are not letter-spaced or upper-cased.
- **No remote resources.** System fonts only.

## Evidence

`tests/ui-kernel.spec.js` runs in every Playwright project:

- the contracts hold, with no serious axe violations (contrast included), in
  AR, EN and FR, dark and light;
- there is no horizontal overflow at 375px;
- arrow keys work, mirrored in Arabic;
- focus is visible, reduced motion and forced colours are honoured;
- the registry names each deliberate break;
- the app's colours follow the kernel in both themes.

Each language-and-theme run attaches a full-page screenshot as visual evidence.
These are not pixel baselines.

## Modern shell (UIX-2)

The app's global header and workspace bar (`#appShell` in `index.html`,
styled by `src/ui/shell.css`) are built from kernel controls. They keep every
ID, role and `data-*` hook that `src/features/application-shell.js` and the
tests use.

- The header holds:
  - global context: the product, the lens, and the title of the open case;
  - the save state, as a kernel status with shape, colour and text;
  - workspaces, language, density and theme.
- The bar holds:
  - the three phases, with the current one marked by more than colour;
  - local processing;
  - the single primary next action. Its arrow mirrors itself in Arabic.
- The app's dark theme (`body.dark`) is mirrored on the root as
  `data-theme="dark|light"`, which the kernel reads. Density was already on
  `body` (`data-density`).
- On phones, workspaces and density become 44px icon buttons. Their accessible
  names come from the app.
- The legacy shell rules (`.top`, `.workspaceBar`, `.segBtn` and the rest)
  were removed from `src/styles.css` once the shell passed the full suites.

## Command palette

`src/features/command-palette.js`: Ctrl/⌘ K, or the Commands button in the
header, opens a native modal `<dialog>` (`.j-dialog`). Its combobox filters a
`.j-listbox` of `.j-option`s.

- **What it lists:** every enabled, rendered control of the shell and of the
  open review: phases, the next action, review sections, workspaces, language,
  density and theme. Each appears under its own on-screen label.
- **What a command does:** it clicks that control. The palette owns no
  behaviour, so it cannot disagree with the buttons it stands for.
- **Focus:** it lands on the control just used. If the click re-rendered the
  control, the palette finds it again; if the control opened a dialog of its
  own, focus stays in that dialog.
- **Limits:** it never opens over another dialog. Accents and Arabic
  diacritics are ignored when filtering.
- **Tests:** `tests/command-palette.spec.js` covers opening, filtering, running,
  Escape and focus return, review sections, Arabic labels, contracts and axe.

## Guided flow

`src/features/guided-flow.js` and `src/ui/flow.css` (`.j-flow-*`): the setup
phase as the UX-0 prototype's steps (topic, lens, settings, prompt, answer),
one at a time, with the mascot guide and a step list beside them.

- **What it owns:** which step is open. The steps hold the app's own controls,
  with their IDs, so the flow cannot disagree with them.
- **Moving:** Continue and Back, or any step in the list. Continue needs a
  topic on the first step; the answer step's action is Import.
- **The guide:** it explains each step and reacts to the pasted answer
  (complete, notes, cut off, broken), with more than colour.
- **Reaching a control:** the shell's next action and the app open the step
  that holds it (a saved import step reopens on the answer).
- **Tests:** `tests/guided-flow.spec.js`; other specs open a step with
  `tests/helpers/guided-flow.js` before using its controls.

## Page sections

The engine (`#enginePanel`) and the review (`#reviewPanel`) are kernel cards,
`section.j-card` named by their heading. A card's heading is `.j-card-head`: a
label (`.j-label`, the section's number and name), the `h2` and the line under
it, and a status beside them, under them when they need the width. The
engine's status is the analysis state (`.j-status`, `idle` until an analysis
is imported, then `ok`). The shell's nav lands a section card 16px under the
top of the view.

## Case file

`src/ui/case.css` (`.j-case-*`) and `caseSection` / `wireCaseOutline` /
`markCaseLocation` in `src/app.js`: the review as the UX-0 case file, one
document in reading order instead of tabs.

- **The document:** every review section is rendered in order, each a
  focusable `section#case-<key>` named by its outline entry. The sections keep
  their own views.
- **The outline:** the review nav (`#reviewNav`, entries keep `data-review` /
  `data-bio-review`) jumps to a section and focuses it. It marks the reader's
  location with `aria-current="location"`: the section that last took focus
  while the view stays put, else the one at the top of the view (tinted and
  barred; its weight stays, so marking a place never reflows the outline). It stays pinned beside the document on wide screens. An
  entry is a `button.j-case-link`: the section's name (`strong`) over what it
  holds (`small`), its count beside them (`.j-case-count`), at least 44px
  high. A name breaks between words, never inside one; two to a row, the
  hints are hidden and a count that does not fit goes under its name.
- **Layout:** the outline (292px) beside the document, both kernel panels; at
  1120px and below one column, the outline above the document, its entries
  bordered tiles in three columns at 940px, then two at 760px. Headings in the document keep their size unless
  a view styles its own (`:where(.j-case-doc) h3`, so any view's rule wins).
- **Heavy parts stay lazy:** the relationship map loads when its section
  comes near the view, or at once when its outline entry is chosen (the
  observer's turn comes late in Firefox and WebKit). While it, or the
  biopolitical graph, loads, a `.j-note` (`idle`, `role="status"`) holds its
  place; if it cannot load, a `warn` note (`role="alert"`) says so, with a
  *Try again* `.j-btn` under the sentence. The document's rows start at its
  top, so a lone note keeps its height.
- **Tests:** `tests/case-file.spec.js`.

## Work panel

`src/ui/work.css` (`.j-life-*`, `.j-save-light`) and `refreshWorkspaceLife` /
`renderWorkLife` / `renderLifeBanners` / `runLifeAction` in `src/app.js`: the
UX-0 work panel, built on the app's own workspace model.

- **The save light:** the header status `#workspaceSaveState` is a button that
  opens the panel. `data-state` keeps the save state (`empty`, `saving`,
  `saved`, `error`); `data-life` adds `uncommitted` (the saved draft is not in
  a revision) or `snapshot` (a recovery snapshot was found). Its name is
  "Where your work is: <state>".
- **Where your work is:** the Workspaces dialog shows three cards for the open
  workspace: the recovery snapshot, the working draft and the revisions. Their
  actions open the existing editor, commit and history dialogs. Other
  workspaces keep their own actions in the list.
- **Banners:** `#lifeBanners`, above the flow and the case file, raises a
  save that another tab got to first, a recovery snapshot, a damaged workspace
  and being offline.
- **Conflict:** a write refused because another tab changed the workspace
  first sets the save light to "Conflict" (`data-life="conflict"`). The
  banner and the draft card offer "Reopen workspace", which loads the stored
  version and keeps a reply pasted but not imported.
- **Discarding:** closing the editor and discarding its edits also discards
  their recovery snapshot, unless another tab has captured its own edit since.
- **Whose snapshot:** each snapshot names the tab that captured it. A snapshot
  whose tab is still open (its tab lock is held) is that tab's live edit, so
  other tabs neither count nor offer it until that tab closes.
- **What it reads:** one read of the repository and the recovery journal
  after each save, open, commit, reset and editor close. Edits in an open
  editor are not counted as a snapshot.
- **The workspaces:** under the cards, in `.j-ws` (in `work.css`): the
  actions (export, restore a file, protect storage, and the two resets as
  `danger` buttons), the storage health and the status as notes, then one row
  per workspace. The open one has `aria-current="true"`, a damaged one
  `data-state="damaged"`; both have a thicker edge. Tests find rows by
  `[data-workspace-row]`.
- **Tests:** `tests/work-panel.spec.js`.

## Canonical editor

`src/ui/editor.css` (`.j-editor-*`) and `renderCanonicalEditor` in
`src/app.js`: the editor dialog on kernel controls, one canonical field at a
time.

- **The bar:** Undo, Redo and the unsaved state (`#editorDirty`, a `j-status`
  that turns `warn`) on one side; "Review & commit" and Save on the other.
- **Sections:** the content first, then "Identity and metadata"
  (`EDITOR_META_KEYS`). The open section has `aria-current="true"`; a section
  with problems carries a "{n} to fix" chip. The dialog opens on the first
  content section.
- **The field:** a kernel field whose help is the JSON path. Its check
  (`#editorFieldStatus`, a kernel note) sets `data-tone` `ok`, `warn` (valid only as a
  draft) or `crit`, and the field gets `aria-invalid`.
- **Recovery:** the snapshot banner is the work panel's `j-life-banner`.
- Labels, the sections' and the close button's names are in AR, EN and FR.
- **Tests:** `tests/canonical-editor.spec.js` (contracts and axe in both
  themes), and the cross-tab snapshot case in `tests/work-panel.spec.js`.

## Commit and revision history

`src/ui/commit.css` (`.j-commit-*`, `.j-diff-*`, `.j-rev-*`) and
`renderResolutionProposal` / `renderRevisionHistory` / `diffItem` in
`src/app.js`: the commit (resolution) dialog and the revision history on
kernel controls.

- **The diff:** both dialogs show a change the same way (`diffItem`): its
  operation as a chip named in the page language (added `ok`, changed `warn`,
  removed `crit`), its path, and the values before and after.
- **Facts:** the base, source, validation and integrity of a commit, and a
  revision's metadata, are a `dl`; revision IDs and checksums read left to
  right in monospace.
- **Approval:** the approver and rationale are kernel fields; the
  confirmation is a 44px label.
- **Revisions:** a pick list (see Dialogs); the current head carries an `ok`
  chip, imported and restored a plain chip.
- **Status:** `#resolutionStatus`, `#revisionStatus` and `#revisionBlocked`
  are kernel notes.
- **Counts:** `pluralText` uses the language's plural forms (Arabic has six).
- No part scrolls on its own except the revision list, whose buttons take
  focus; the dialog scrolls instead.
- **Tests:** `tests/revision-history.spec.js` (contracts and axe in both
  themes, Arabic labels, plurals) and `tests/resolution-transaction.spec.js`.

## Import and export

The setup flow's status lines (`#topicStatus` under the prompt, `#jsonStatus`
under the answer) are kernel notes; their tone is `data-tone`.


`src/ui/exchange.css` (`.j-export*`, `.j-audit-*`): the case file's exports
and the import's review details under the answer.

- **Exports:** the HTML report and the canonical JSON are kernel cards with
  kernel buttons; the report's failure is a `warn` note with a retry. "Inspect
  the complete canonical contract" is a kernel disclosure whose code block
  takes focus, so it can be scrolled from the keyboard.
- **Import review details:** `#importAuditDetails`, a kernel disclosure, keeps its groups
  (publication blockers, review required, repairs, preserved extensions);
  paths are monospace.
- **Tests:** `tests/import-validation.spec.js` (contracts and axe in both
  themes for both), with `expectKernel` from `tests/helpers/kernel-check.js`,
  which the history and work-panel tests use too.

## Dialogs

`src/ui/dialog.css` (`.j-modal-*`, `.j-pick*`, `.j-ledger-*`): the frame all
six dialogs share (prompt preview, workspaces, editor, review ledger,
revision history, commit), the parts their bodies share, and the review
ledger.

- **Frame:** `.j-modal-back` shows when the app sets `aria-hidden="false"` on
  it; `.j-modal` (`data-size="wide"` for the four working dialogs) has the
  contract `role="dialog"`, `aria-modal="true"` and a name. IDs, the `show`
  class and the focus traps are unchanged. The close button is a ghost icon
  `j-btn` named in the page language.
- **Shared parts:** the trust line (`.j-modal-trust`), section heads, actions,
  and the prompt's code block, which takes focus so the keyboard can scroll it.
- **Pick list:** `.j-pick-list` of `.j-pick` buttons, contract `aria-pressed`;
  the pressed one is marked by a thicker leading edge as well as colour. The
  revisions and the ledger's tasks use it.
- **Review ledger:** statuses are chips (`data-ledger-status`; in review and
  waived `warn`, completed `ok`, stale `crit`); a task's reason and phase use
  the review queue's names; the reviewer, decision and waiver are kernel
  fields; the status line is a kernel note; the history is a disclosure.
- **Disclosure:** `.j-disclosure`, a `<details>` with a 44px `<summary>`.
- **Tests:** contracts are checked from each backdrop, so the frame is
  included; `tests/review-ledger.spec.js` (Arabic names, contracts and axe in
  both themes) and `tests/a11y.spec.js` (the prompt preview).
- **Side sheet:** `.j-modal-back[data-variant="sheet"]` with
  `.j-modal[data-size="sheet"]` is the same frame at the inline end, full
  height, its header and footer fixed and its body scrolling; on a phone it is
  a bottom sheet. The page behind it does not scroll.

## References

`src/ui/reference.css` (`.j-ref*`, `.j-insp-*`): a record named inside a text,
and the sheet that inspects it (`src/reference-ui.js`).

- **Reference:** `.j-ref`, contract `<button type="button">` with
  `data-reference-id` and a name; its label, then its ID (`.j-ref-id`, hidden
  from screen readers, which hear the name). Evidence also takes the `ok` tone.
- **Inspector:** the side sheet above. Its sections are `.j-insp-sec`; facts a
  two-column `.j-insp-facts` list; support beside counter-evidence
  `.j-insp-pair`; linked records and occurrences 44px `.j-insp-rec` buttons,
  occurrences numbered. Escape, the close button or the scrim closes it, and
  focus goes back to the reference that opened it.
- **Focus:** closing reads the reference's box before focusing it. WebKit's
  `focus()` does not apply the page's removed `inert` while a stylesheet is
  still loading, and would drop the focus.
- **Not here:** the exported HTML report keeps its own `.referenceChip`
  styles, because it is a standalone file.
- **Tests:** `tests/reference-resolution.spec.js` (contracts, focus return, and
  focus return while the relationship map's stylesheet is held back),
  `tests/results-inspection.spec.js`.

## Case sections

`src/ui/section.css` (`.j-lede`, `.j-recs`, `.j-rec*`, `.j-checks`, `.j-meter`,
`.j-table*`):
the parts the case file's sections share, so each section rebuilt on the
kernel reuses them.

- **Lede:** `.j-lede`, the line under a section heading.
- **Records:** `.j-recs` is a list of `.j-rec` cards, one per row, or two with
  `data-cols="2"` (one column at 760px and below). A card is its ID
  (`.j-rec-id`) and chips, its statement (`.j-rec-title`), then its facts
  (`.j-rec-facts`, a `<dl>`). `data-tone` adds a leading edge; the chips say the
  same in words. A card that the inspector's "Open full record" lands on takes
  `data-inspection-id` and `tabindex="-1"`. A summary under the statement is
  `.j-rec-text` (a `ul.j-rec-text` when it is a list of points); facts written
  as prose take `data-prose` for a wider column, and a fact may hold a list. A card that opens the inspector is a
  `button.j-rec`; a record a search filters out is a `hidden` list item.
- **Checks:** `dl.j-checks`, each row a question (`dt`) beside its verdict, a
  `.j-status` (`dd`); two to a row, one at 760px and below. `data-tone="warn"`
  on a row washes a concern so it stands out among the passes.
- **Counts:** `.j-stats`, figures over their names in three columns (four with
  `data-cols="4"`), or one count per row at 620px and below; `data-tone` (`ok`,
  `warn`, `crit`) on a count colours its figure.
- **Meter:** `.j-meter`, contract `role="img"` and a name: a 1–5 score drawn in
  five steps, with the score in figures beside them (`scoreMeter()` in
  `src/app.js`).
- **Table:** `.j-table` in a `.j-table-wrap` that scrolls when the table is
  wider than the page; row headers are `<th scope="row">`.
- **Evidence (Strategic):** evidence records and assumptions as cards
  (`data-records="evidence"`, `data-records="assumptions"`); basis, confidence
  and risk are kernel chips (`kernelChip()`), confidence and risk toned.
- **Contradictions and scenarios (Strategic):** cards in
  `data-records="contradictions"` and `data-records="scenarios"`. A
  contradiction's severity (1–10) is a chip, toned from 6 and echoed by the
  card's edge; the layers it touches are chips in a fact. A scenario's
  probability and timeframe are chips; its drivers, early signals and
  disproving conditions are lists in `data-prose` facts.
- **Records (Biopolitical):** `bioRecordHtml()` draws every pillar's records
  and the evidence section's as cards (`data-records="bio"`): the record's
  codes as chips in words, untoned, since a code alone does not say whether it
  is a confidence or a relevance; then its statement and summary; its details
  and lists as one `data-prose` description list.
- **Conclusion (Biopolitical):** the calibrated judgment's groups are cards
  (`data-records="conclusion"`), each a heading over its points, or an idle
  note when it has none. The model self-audit is checks
  (`data-records="self-audit"`): a pass is `ok`, a concern `warn` and a check
  that does not apply `idle`. Its notes are one idle note.

## Inspection directory

`src/ui/evidence.css` (`.j-idir`, `.j-idir-head`): the inspection section's
record directory (`data-results-inspection`). Its heading and lede sit beside
its counts (`.j-stats`); below them come the evidence summary, a `.j-field`
search over the records, and the records as `button.j-rec` cards in a
two-column `.j-recs` list (`data-inspection-directory-item`), each with its ID,
type, layer and confidence. Tests: `tests/results-inspection.spec.js`.

## Model engine

`src/ui/engine.css` (`.j-engine-*`, `.j-layer*`): the engine map and the case
file's layers. A layer's colour (`--j-layer`, set by the app) only marks it;
its number and name say which it is.

- **Engine map:** `#engineNav` is an `ol.j-engine-map` of `button.j-engine-step`
  steps (`data-pillar-card` or `data-bio-pillar`): number, name, description,
  records, and a bar (`--j-depth`) of their share of the fullest layer's. Six
  Strategic steps to a row, nine Biopolitical ones three to a row
  (`data-layers`); three to a row at 1160px and below, one at 620px and below.
  The step whose layer is open is `aria-current="true"`.
- **Layers:** `.j-layers` holds one `.j-layer` per layer: an `h4` whose
  `button.j-layer-head` (`data-acc` or `data-bio-acc`) has `aria-expanded` and
  `aria-controls`, and a `.j-layer-body` region that is `hidden` when closed
  and open in print. A Strategic layer's records are `.j-rec` cards
  (`data-records="layer"`, `itemCard()`), their model score a fact
  (`modelMetricFact()`); a Biopolitical layer's are `bioRecordHtml()` cards.

Tests: `tests/evidence-intelligence.spec.js` (contracts of the map and the
layers, a record card, opening and closing a layer).

## Overview

`src/ui/brief.css` (`.j-brief*`, `.j-diag*`): the overview's brief, two parts,
each a `section.j-brief` with a `.j-brief-head` (label, `h4`, a line under it),
then its detailed diagnostics.

- **What matters first** (`data-results-orientation`): the publication gate, a
  `.j-status` in `.j-brief-gate`; the conclusion (`.j-brief-claim`); readiness
  and coverage in a `dl.j-brief-figures`, each figure with a `.j-brief-bar`
  (`--j-pct`, its tone from `pctTone()`, the score legend's bands; hidden from
  assistive technology, which reads the figure); the principal uncertainty and
  the next action as `.j-brief-signal` blocks. Its parts carry
  `data-orientation` (`gate`, `conclusion`, `metrics`, `uncertainty`, `action`).
- **How the conclusion is built** (`data-results-explanation`): an
  `ol.j-brief-steps` of five `.j-rec` cards (`data-explanation-section`), each
  with an `h5` title, a count chip, its strongest records (`.j-brief-items`,
  chips in `.j-brief-tags`) and a `.j-btn.j-brief-open` to the full record.
- `.j-brief-divider` starts the detailed diagnostics; print hides it and the
  links.
- **Diagnostics** (`.j-diag`): the quality gate, a `.j-note` toned by its
  verdict (`data-diagnostic="gate"`: an `h4`, why, what blocks it); the six
  scores, a `dl.j-brief-figures[data-layout="grid"]` (`data-diagnostic="scores"`) of figures out of 100 with
  their bars and what they measure (`metricCard()`), three to a row; the score
  rule, a `.j-rec` with the weights as `.j-stats` (Strategic) and the legend of
  the bars' colours (`.j-brief-bands`, `scoreBandsHtml()`); the caps on
  readiness and the missing count, `.j-stats[data-cols="4"]`; the next action, a
  `.j-brief-signal` (`data-diagnostic="next"`); the open items, `.j-note` rows in
  a `.j-diag-notes` list (`data-diagnostic="warnings"`), and in Strategic the
  import health under its own `h4`. A Biopolitical import migrated from v1 says
  so in a `.j-note.j-brief-alert` above the brief.

Tests: `tests/results-workspace.spec.js` (contracts and axe of the brief and the
diagnostics, the gate verdict and its open items), `tests/results-explanation.spec.js`
(the links and their focus).

## Evidence summary

`src/ui/evidence.css` (`.j-evi-*`): the inspection section's evidence summary,
one `.j-disclosure`. Its summary names it and counts clusters, cited evidence
and gaps; its body holds source clusters and evidence gaps (`.j-rec` cards
whose records are `.j-insp-rec` buttons), the review queue in three phases
(`data-evidence-review-queue`) and the claim–evidence matrix
(`data-evidence-traceability`, a `.j-table`). The balance of a matrix row is a
chip (`data-balance`), the identity basis of a cluster a label
(`data-cluster-basis`). Tests: `tests/evidence-intelligence.spec.js` (contracts
of the open summary, and the Strategic evidence cards).

## Not in the kernel yet

The save light is the header status as a button; it has no kernel contract of
its own yet.

`src/styles.css` keeps only what is not a view: the legacy tokens (now the
kernel's), resets and form-control defaults, the app frame (`.app`, `.shell`,
density), the toast, the skip link, `.hide`, `.srOnly`, `.ltr`, the print and
forced-colours fallbacks, and the relationship map's forced-colours borders.
