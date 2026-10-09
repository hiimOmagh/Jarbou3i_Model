# UX-0 concept prototype — "Mission control"

Clickable concept for the UX-0 gate in `docs/product-ui-execution-plan.md`. It is **not** the app:
nothing here is imported by `src/`. `scripts/build-pages-artifact.mjs` copies this folder only into Cloudflare
branch previews (`CF_PAGES_BRANCH` set and not `main`), never into production or GitHub Pages.

Open it with the dev server running: <http://127.0.0.1:4173/prototypes/ux-0/index.html>
(the static server only maps `/` to an index, so name the file).

## What it demonstrates
- **Guided mode** (6 steps: topic → lens → settings → prompt → answer → result) with a mascot guide
  whose mood follows the answer check (empty / invalid / truncated / partial / valid).
- **Pro workspace**: phase rail, animated SVG causal map, evidence/tensions/futures/publish views,
  record inspector with canonical JSON paths, command palette (Ctrl/⌘ K or `/`), keys `1`–`6`.
- **Biopolitical workspace** (same shell, its own phases): 9-pillar map with authored links and a
  plain list of the same links, capture ladder (body → environment), evidence with epistemic type
  and source tier, competing explanations with falsifiers, care/control tensions, consent and exit,
  resistance and alternatives, and a publish view with the self-audit and calibrated conclusion.
  The guided flow checks a pasted answer against the lens chosen in step 2.
- **Workspace lifecycle** (Gate 0 tasks T0, T4–T6): a save light in the top bar (saved / unsaved /
  not committed / recovery found / conflict) opens "Where your work is", which keeps the recovery
  snapshot, the working draft and the immutable revisions apart. A record's confidence can be
  edited, saved, then committed through a resolution step (exact diff, whole-draft validation,
  approver, rationale, confirmation); any older revision can be restored as a new one. Publish has
  the review ledger (pending → in review → completed / waived, stale after a draft change). Conflict,
  damaged-workspace and offline states show as banners. The wording is the app's own (`src/app.js`).
- **Two layouts to compare** (UX-0 asks for two materially different information architectures), switched
  from the rail foot or the palette:
  - **A · Mission control**: organised by the analysis's structure (phase rail, map, inspector).
  - **B · Case file**: one document in the reader's order: where you are and the single next step,
    the case, what the analysis says (records open in place), what needs work (each with a link to
    the place to fix it), then review and publish. An outline replaces the phase rail and no
    inspector is used.
- **Simulate commands** in the palette (group "Simulate (prototype)"): a draft edit, a reload with
  unsaved edits, a change in another tab, a damaged saved workspace, going offline and back.
- EN / AR / FR with full RTL mirroring, dark-first theme with light, compact density,
  reduced motion, forced colours, 375 px phones through desktop.

## Deliberate simplifications
- The prompt and publication gates are simplified stand-ins, labelled as such; the app's real
  prompt builder and gates are unchanged. The Bio stand-in blocks on an empty pillar, no checkable
  source, or any self-audit check other than pass / not applicable.
- Bio pillar records follow `recordsFor` in `src/biopolitics.js` (`PILLAR_LISTS`), so counts match
  the app's `pillarCount`. All Bio labels (pillars, tokens, self-audit) come from the app in all three
  languages; the English self-audit and capture-criteria labels are new in this branch's `src/biopolitics.js`.
- No persistence beyond UI preferences (`localStorage`, prefix `j3-ux0:`). The lifecycle lives in
  memory: a real reload starts over, which is why reloads, conflicts and damage are simulated. The
  app's integrity checks are named in its wording but not computed here, and confidence is the only
  editable field.
- Review tasks follow the stand-in gate's checks; the app derives its own tasks.

## Testing with real data
Served next to the app (the dev server, or a branch preview at `<preview-url>/prototypes/ux-0/index.html`),
the prototype reads the app's own saved workspaces in that browser and runs the app's own Bio
publication gate (`BIO.health` from `src/biopolitics.js`). The flow:
1. In the app (`/`), generate the real prompt, run it in your AI, and import the answer. The app saves it.
2. Open the prototype: "Saved in the app" lists those workspaces (also in the workspace panel). Open one.
3. It opens as a copy, in the Case file layout unless you picked A (B is now the default), with
   the app's revisions; a banner says edits stay in the preview. The prototype only calls the repository's `list()` and `get()`: it never writes.

Bio analyses show the app's gate verdict and its list of what blocks publication, in the page's
language. The Strategic gate stays a labelled stand-in (the app's is inside `app.js`). In the
standalone artifact, the app's files are not there, so it keeps the samples and the stand-ins.

## Files
`proto.js` (behaviour), `proto.css` (tokens + layout), `i18n.js` (prototype copy), `samples.js`
and `bio-labels.js` (both generated by `node prototypes/ux-0/build-samples.mjs`, from
`fixtures/sample-analysis-*.json` and from the app's own Bio labels in `src/biopolitics.js`),
`index.html` (local), `artifact.html` (published copy; assets resolve from `assets/`).
