# Real-answer walkthrough — 2026-10-15

A follow-up to `2026-10-15-ui-audit.md`. That audit judged the interface from
the fixtures; this one imports real AI answers and reads everything they
produce, opened in full, down to the exported report and its print.

## Method

- **Answers:** the eight ChatGPT Plus replies kept outside the repository,
  both lenses, AR/EN/FR, four modes, with and without source access. Two
  are held back for missing parts; six import.
- **Cases (Chromium, main at 624b0bb):**

  | Case | Lens · language | Viewport | Theme |
  |---|---|---|---|
  | strat-en-desktop | Strategic · EN | 1440 | light, report printed |
  | strat-en-phone | Strategic · EN | 390 | light |
  | strat-fr-desktop | Strategic · FR | 1440 | light |
  | bio-ar-desktop | Biopolitical · AR | 1440 | light, report printed |
  | bio-ar-phone-dark | Biopolitical · AR | 390 | dark |
  | bio-fr-desktop | Biopolitical · FR | 1440 | dark |
  | held-bio-en-desktop | Biopolitical · EN, held back | 1440 | light |
  | held-strat-ar-phone | Strategic · AR, held back | 390 | light |

- **Each case:**
  - paste and read the import details, or copy the completion prompt;
  - import, open every `details`, and open each layer;
  - visit every relationship-explorer mode, the node and reference
    inspectors, the review ledger and the editor;
  - download every export, open the report and expand all, and print it to
    PDF.
- **Checks on every screen:** text issues, raw keys, text under 12px,
  targets under 44px, clipping, empty elements, language leaks, heading
  skips, duplicate IDs, axe.
- **Output:** 389 screenshots, 2 PDFs, text dumps of every screen. Five
  reviewers read them; each claim below was checked in the code.

## What a user meets

Signals contradict each other, and the strongest ones are the least
earned. On one Biopolitical FR answer the diagnostics said 100/100 and
"Share readiness", while the gate said "Review needed" and decision
readiness was 60%. The Strategic answers showed every record as
"unreferenced", which produced 50–103 review tasks. The interface works,
but on real answers it buries the few things that matter under repetition
and jargon.

## Findings

Status: **D1** / **D2** = fixed in UIX-5 slice D, first or second part;
**open** = planned below.

### A. Truthful status

| # | Finding | Status |
|---|---|---|
| A1 | A no-source answer's placeholder evidence counted as a traceable source (its locator names the prompt's instruction): "Source traceability 100%", a higher readiness cap, "1 traceable" | D1 |
| A2 | Strategic answers have no field to cite evidence, so every record reads "unreferenced" and every evidence item "uncited"; only `links` connect them, and real answers link evidence rarely (3, 1, 0 and 0 links in four answers) | D2: links cite; an `evidence_ids` field later |
| A3 | Diagnostics that cannot fail on a well-formed answer (100/100, "Share readiness") sit beside a gate that says "Review needed" | D2: "Structure check", grounding capped at 50 when nothing is cited |
| A4 | The report's next action came from the structure check, not the analysis's own `next_improvement` the overview shows | D1 |
| A5 | The Strategic `quality_gate.weakest_layer` is never shown | D2 (with `publication_risk`, as the AI's own assessment) |
| A6 | The report colours scenario probabilities with quality tones: a 20% scenario looks failed | D1 |
| A7 | The model's self-audit reads green, as if verified; red is used for low confidence; rating pills carry no labels; confidence wording varies | D2 for the self-audit; the rest open |

### B. After import, and moving around

| # | Finding | Status |
|---|---|---|
| B1 | After import the answer box still said "Valid JSON. You can import the analysis now" beside a disabled button; the toast pointed at "the engine layers" | D1 |
| B2 | The case file starts far down the page (about 3,400px on a phone) | open (UIX-5 C) |
| B3 | Below 1120px the outline is not sticky and nothing leads back to the top | open (UIX-5 C) |
| B4 | Nested cards leave 180–240px for text on a phone; the desktop header title truncates | open (UIX-5 C) |

### C. An answer held back for missing parts

| # | Finding | Status |
|---|---|---|
| C1 | The guide said "Something is off in the format" in red for an answer with three missing parts | D1 |
| C2 | "Draft import is allowed" beside a disabled Import button | D1 |
| C3 | The completion prompt asked for "the ID of an existing record" without listing the IDs or quoting what the AI wrote (ChatGPT wrote a sentence about the study) | D1 |
| C4 | "3 parts" sits above twelve mixed bullets with raw paths; after copying, nothing says what to do next | open |

### D. Repetition

| # | Finding | Status |
|---|---|---|
| D1 | The import details repeated one message 13 times and silently stopped at 12 lines | D1 |
| D2 | The review queue is not grouped; empty columns span screens; traceability tables can be all dashes | open |
| D3 | A record appears 4–9 times across views; the report lists relations two or three times | open |
| D4 | Walls of "not applicable"; the inspector repeats "not provided" five times | open |

### E. Language

| # | Finding | Status |
|---|---|---|
| E1 | Plural errors: "1 of 1 evidence records", "1 preuves sur 1", Arabic counts | D1/D2 for the import status and summary; open elsewhere |
| E2 | Jargon: canonical/canonique/نظامي, contract/عقد, intelligence/استخبارات, hash-chained | open |
| E3 | Raw editor keys, paths, hashes and permalinks; the report prints the contract slug | open |
| E4 | French typography: no space before ":" and "%", ISO dates | open |
| E5 | Arabic: "برومبت", three names for the lens, gender agreement | open |
| E6 | Layer metrics as acronyms (IW, API, TPS, NSI) on mixed scales | open |

### F. Report and print

| # | Finding | Status |
|---|---|---|
| F1 | The thesis comes late; there is no draft banner, date or provenance footer | open |
| F2 | Print: 20 pages (EN) and 36 (AR), many 35–65% blank, no page numbers, a generic PDF title | open |
| F3 | "S 5", empty "If wrong: —", IDs dropped; the app and the report show different fields (`goal_achieved_pct`, `cost_benefit`, `power_balance_impact`, `weakest_layer`, `publication_risk`) | open |

### G. Relationship explorer (audit H2)

Text at 9.5–11.5px and controls at 32–34px. Groups are unlabeled. Network
lanes are clipped and edges invisible. The empty state wrongly says "no
records match filters" when no filter is set. On a phone the controls take
about 900px. **Open (UIX-5 B).**

### H. Technical

| # | Finding | Status |
|---|---|---|
| H1 | The reference inspector used `aside`/`header`/`footer` inside a dialog (axe: aria-allowed-role, duplicate banner) | D1 |
| H2 | The import details skipped from the step's h2 to h4 | D1 |
| H3 | The ledger shows a raw hash and an empty history without an empty state | open |
| H4 | Counts in the outline differ from the sections they name | open |

## Decisions (2026-10-15)

1. **Strategic evidence citations (A2):** links first (done in D2), an
   `evidence_ids` field in the Strategic prompt and contract later, with a
   corpus run.
2. **Diagnostics that cannot fail (A3):** rename and cap (done in D2). The
   name is "Structure check", not the proposed "Structure complete": the
   overview already shows "Structural completion".
3. **Next slices, in order:**
   - C, the phone first screen (B2–B4);
   - B, the explorer (G);
   - a report-and-print slice (F);
   - a language slice (E2–E6, AR/EN/FR and the prototype).

## Evidence

- **Before:**
  - "Source traceability 100%" and "1 Traçable" (bio-fr-desktop);
  - "Valid JSON. You can import the analysis now" after import (all three
    Strategic cases);
  - a red guide and 13 repeated lines (held-bio-en-desktop).
- **After (same answers, same walk):**
  - 0% and "0 Traçable", plus one "Verify a traceable source locator" task;
  - "Imported: this is the analysis under review";
  - an amber "Nearly there" with one grouped line;
  - a completion prompt that quotes the AI's sentence and lists the 13 evidence IDs.
