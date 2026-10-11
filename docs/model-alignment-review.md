# Model alignment review — Strategic and Biopolitical lenses

Status: proposal, nothing implemented. Reviewed 2026-10-05.

References compared:

- **Strategic**: "Strategic Analysis Engine (Reference Model)" (`message (5).txt`).
- **Biopolitical**: "Jarboui Biopolitics AI Training Map" (`.docx`, 17 parts + core system instruction).

Code read: `src/app.js` (`buildSchema`, `buildStrategicPrompt`, model metrics), `schema/strategic-analysis.schema.json`,
`src/strategic-integrity.js`, `schema/biopolitical-analysis.schema.json`, `src/biopolitics.js` (prompt),
`src/biopolitics-integrity.js`, `docs/biopolitical-v2-contract.md`, the bundled fixtures.

## Verdict

| Lens | Structure (fields, taxonomies) | Method (rules, inference checks) |
|---|---|---|
| Biopolitical | Near 1:1 with the training map | Four gaps: the central "capture" judgment and intent attribution can be asserted without the evidence the map requires |
| Strategic | Close match | Most of the reference's *rules* never reach the AI or the validator; two invented scores; narrative can only be linked as a cause; the bundled sample breaks the "multi-layered interests" rule |

## 1. Core of each reference

**Strategic.** A six-layer adaptive loop:
Interests (WHY) → Actors (WHO) → Tools (HOW) → Narrative (JUSTIFICATION) → Outcomes (REALITY) → Feedback (ADAPTATION).
Each layer has strict definitions, a taxonomy, metrics and one governing rule. Actor Power Index (API) is
4 × 1–5 = /20. The tool selection matrix has cost, risk, speed, reversibility and deniability. The Narrative
Strength Index (NSI) combines coherence, media alignment and public acceptance.

Causal structure comes from the interaction matrix:

- Interests ↔ Actors
- Actors ↔ Tools
- Tools ↔ Outcomes
- Narrative ↔ Society
- Feedback ↔ whole system

The reference's own rule is that **narrative is a legitimacy layer, not a causal layer**. Its elite rules are:

- no monocausality
- contradictions are functional
- hidden drivers > discourse
- tools > speeches
- outcomes > intentions

It also defines a predictive engine (typed signals → prediction logic) and a contradiction taxonomy (speech/action,
economy/policy, alliance/interest).

**Biopolitical.** An evidence-disciplined protocol, not a verdict generator. Its core moves are:

1. Turn loaded claims into testable questions.
2. Identify the governed human function.
3. Separate governing actors from affected populations.
4. Classify interventions on a spectrum from protection to expropriation.
5. Call something "capture" only when *several* of 13 criteria are evidenced **and** counter-evidence was sought.
6. Test 9 rival explanation families.
7. Assess distribution, consent and exit, resistance, and alternatives.
8. End with a calibrated conclusion and an 18-point self-audit.

It also requires that harm is never read as intent: deliberate violence, reckless indifference, structural exposure,
administrative failure and unintended harm must be kept apart.

## 2. What already matches (no action)

**Biopolitical schema.** Every enumerated list in the map is encoded with the same members:

| Item | Count |
|---|---|
| Capture criteria | 13 |
| Capture levels | 5 |
| Explanation families | 9 |
| Self-audit checks | 18 |
| Actor documentation fields (§15) | 11 |
| Intervention modalities | 11 |
| Epistemic types | 10 |
| Source tiers | 10 |
| Power modes | 12 |
| Consent qualities | 5 |
| Resistance forms | 10 |
| Time dimensions | 6 |
| Outcome characters | 5 |
| Necropolitical causal characters | 5 |
| Inequality axes | 6 |

It also encodes:

- the looping-effect chain;
- regimes of truth;
- populations "missing from the record";
- explanation falsifiers, enforced in `biopolitics-integrity.js:240`;
- the publication gate;
- safety limits.

**Strategic schema.** These match the reference:

- the six layers;
- API dimensions, summed to /20 (`app.js` `actorPowerScore`);
- the tool selection matrix, all five criteria;
- NSI dimensions;
- outcome types and metrics;
- feedback effects (exactly the reference's four) and speed;
- interest stakes and horizon.

The app's own copy already calls narrative "Legitimacy and public framing" (`app.js:457`).

## 3. Findings

Severity: **High** = the tool can output or accept analysis that contradicts the reference's method.
**Medium** = a reference element is missing or replaced. **Low** = naming or precision.

### Strategic lens

| # | Sev. | Finding | Evidence |
|---|---|---|---|
| S1 | High | The reference's definitions and rules never reach the AI. The prompt names the chain, then silently audits only six points: missing actors, monocausality, unsupported assumptions, weak evidence, missing counter-evidence and missing falsifiers. It omits the 6 strict definitions and these rules: influence ≠ visibility; tool choice reveals constraints and intent; narrative is legitimacy, not cause; outcomes diverge from declared goals; feedback accuracy; hidden drivers > discourse; tools > speeches; outcomes > intentions; contradictions carry the most information. | `app.js:2645-2668` |
| S2 | High | Narrative's role is unmodelled, and the link vocabulary contradicts itself. The prompt asks for `causes \| enables \| constrains \| contradicts \| feeds_back`. The bundled samples use `motivates \| uses \| produces`. The schema accepts any string. Neither vocabulary has **legitimizes**, so a narrative can only be linked as a *cause*, which the reference forbids. | `app.js:2542`, `app.js:3345-3347`, fixtures, schema `$defs.link.relation: string` |
| S3 | High | "No decision without multi-layered interests" and "no monocausality" are not enforced. Interests have `minItems: 1`, and the integrity layer has no diversity check. The EN/AR/FR samples, which teach users what a good analysis looks like, contain **one interest** and one item per layer. | schema `interests.minItems 1`; `fixtures/sample-analysis-en.json` (1 × `I1`) |
| S4 | Medium | Two scores are invented and the reference's own score is missing. **TPS** = (cost+risk+speed+(6−reversibility)+deniability)/25. It sums the selection matrix into one "pressure" magnitude, but the matrix is a *profile* for reading constraints and intent, not a magnitude, and adding the cost to the user to deniability is not meaningful. **IW** multiplies intensity by undocumented constants (1.3, 1.65, 1.15, 1.25, ÷2.06). Both are shown as model metrics. Meanwhile the reference's **Tool Severity (1–5)** does not exist. | `app.js` `toolPressureScore`, `interestWeightScore`, cards at `app.js:3425-3437` |
| S5 | Medium | The contradiction taxonomy lacks the reference's **economy vs policy** type. | `app.js:2459` |
| S6 | Medium | Narrative **construction mechanisms** are missing: simplification, emotional framing, selective facts, repetition. | `app.js:2418-2430` |
| S7 | Medium | The predictive engine is untyped. Scenario `early_signals` are free text, and the reference's 4 key signals, 4 early-warning indicators and 3 prediction-logic rules are absent. | `app.js:2470-2483` |
| S8 | Low | Interests are not **ranked** (algorithm step 2). "political" is ambiguous; the reference means *domestic* political (elections, voter blocs). The schema also still accepts legacy bio interest types (`health`, `fertility`, `migration`…). | schema `$defs.interest.type` |
| S9 | Low | `media_influence` is narrower than the reference's "narrative influence". The fix is a label change only; the field name stays for compatibility. | `app.js:2399` |
| S10 | Low | Salvage deliberately rewrites any loose `1.x` version to `1.1.0` and records `SCHEMA_VERSION_NORMALIZED`. That is right today, but after a 1.2.0 bump it would relabel genuine 1.2.0 analyses as 1.1.0. It must change together with the bump. | `strategic-integrity.js:182-187` |

### Biopolitical lens

| # | Sev. | Finding | Evidence |
|---|---|---|---|
| B1 | High | The capture verdict is not tied to its criteria. §9–10 say capture applies only when *several* criteria are present on evidence and counter-evidence was sought. In the schema, a criterion's `evidence_ids` is a plain array (no `minItems`, no conditional), and integrity only checks that the IDs exist and that all 13 criteria appear. So `substantial_capture` with zero `present` criteria passes, and so does `present` with `evidence_ids: []`. | `biopolitics-integrity.js:187-194, 273-280`; schema `captureCriterion` |
| B2 | High | Intent can be attributed without evidence. `necropoliticalDimension` has **no `evidence_ids`**, so `causal_character: "deliberate"` can be asserted bare. This leaves the contract's own principle 5, "distributional harm does not establish intent", and map §24 unenforced. The prompt never asks for the five-way distinction. | schema `necropoliticalDimension`; `biopolitics.js` prompt rule 8 |
| B3 | Medium | Strong modalities can be asserted without harm evidence. Interventions link `evidence_of_benefit` IDs, but `documented_harms` is free text, so `manipulation`, `exploitation`, `coercion`, `capture` and `expropriation` need no evidence IDs. | schema `intervention` |
| B4 | Medium | Three map sections have nowhere to go:<br>• §19 *Security and risk*: risk calculation, included/excluded data, false positives/negatives, who is treated as a threat, auditability, proportionality.<br>• §25 *States of exception*: the 8 questions.<br>• §22–23 *Data and algorithmic systems*: necessity, access, retention, correction, repurposing; training data, objective function, proxies, error distribution, automation bias, disparate impact, contestability.<br>These are recommended case topics (pandemics, predictive policing, borders, AI eligibility), and their answers are currently lost. | no matching `$defs` |
| B5 | Low | The scale ladder is free text. Step 7 fixes 7 levels (individual → planetary). `scale_time.scales` is any string, and `alternative.level` has only 5 (no household, no planetary). | schema `scaleTime`, `alternative` |
| B6 | Low | Norms don't distinguish **statistical average**, **moral standard** and **eligibility rule**, which is §20's central distinction. | schema `norm` |
| B7 | Low | The prompt omits the map's four closing principles. Power is not only repressive; technology is not autonomous; human nature is not a neutral baseline; governance of life is not inherently illegitimate, and should be judged on whether it is evidence-based, necessary, proportionate, equitable, transparent, accountable and contestable. | `biopolitics.js` prompt rules 1-15 |

## 4. Gaps inside the references (your decision needed)

These need a ruling, not a code fix. Implementing them by guessing would bake in a method you never chose.

| # | Question | Recommendation |
|---|---|---|
| D1 | Is "Interests → … → Feedback" a **causal chain** or an **order of analysis**? The equation contains Narrative → Outcomes, but the narrative rule and the interaction matrix say narrative is not causal. | Order of analysis. Causal links follow the interaction matrix, and narrative links are `legitimizes`. |
| D2 | Interest intensity: "Low/Medium/High" (§1) or "1–5" (scoring model)? | Keep 1–5; display bands 1–2 low, 3 medium, 4–5 high. |
| D3 | Narrative strength: NSI from 3 dimensions or "1–5" (scoring model)? | NSI /15 for display; NSI ÷ 3 when a 1–5 value is needed. |
| D4 | The Composite Influence Score is a "weighted sum" with **no weights given**. | Don't implement until you define the weights. |
| D5 | "Several" capture criteria: how many? (B1) | "substantial" needs ≥ 3 evidenced criteria; "no capture" needs 0. Other levels are free but must cite their criteria. |
| D6 | Keep or drop TPS and IW (S4)? | Drop both. Add Tool Severity (1–5) and show the matrix as a 5-bar profile. |

## 5. Fix specification

All changes are **additive and backward-compatible**: old analyses still import, and new fields are optional on
import but requested by the prompt. Each change lists its verification.

### Strategic → contract 1.2.0

1. **Prompt "Method rules" block (S1, S2, S3)**, inserted after the evidence rule in EN, AR and FR. Canonical EN:
   > Definitions: an interest is an expected material or symbolic gain; an actor has decision or influence capacity;
   > a tool is a mechanism of execution; a narrative is a legitimization framework; a result is an observable outcome;
   > feedback is system adaptation.
   > Rules: map at least two ranked interests of different types; no single-cause explanation. Influence is not
   > visibility. Read tool choices as evidence of real constraints and intent. Narrative legitimizes; it does not
   > cause — link narratives with `legitimizes`, never `causes`. Measure results against declared goals; expect
   > divergence. Prefer hidden drivers over visible discourse, tools over speeches, results over intentions.
   > Treat contradictions as the densest information.

   *Verify*: prompt-conformance tests assert each rule in all three languages (`tests/ai-interchange-reliability-check.mjs`).

2. **One link vocabulary (S2)**, following the interaction matrix:

   | Relation | Typical pair |
   |---|---|
   | `motivates` | interest → actor |
   | `uses` | actor → tool |
   | `produces` | tool → result |
   | `legitimizes` | narrative → actor / tool / result |
   | `triggers` | result → feedback |
   | `adapts` | feedback → any layer |
   | `enables`, `constrains`, `contradicts` | any pair |

   - Accept the old strings on import.
   - Integrity raises a warning `NARRATIVE_AS_CAUSE` when a narrative item is the `from` of `causes` or `produces`.

   *Verify*: integrity unit test; the samples use only the new vocabulary.

3. **Interest diversity (S3)**: integrity warning `MONOCAUSAL_INTERESTS` when there are fewer than 2 interests or all
   share one type. It shows in the quality gate as a review item, not an import error.

   *Verify*: unit test. The samples are rewritten to carry ≥ 2 ranked interests of different types; the WWII case
   naturally has strategic, economic and ideological interests.

4. **Fields added**, all optional on import:
   - `tools[].severity` 1–5 (S4);
   - `narrative[].mechanisms[]` ∈ simplification | emotional_framing | selective_facts | repetition (S6);
   - `contradiction_type` gains `economy_vs_policy` (S5);
   - `scenarios.items[].signal_types[]` ∈ tool_escalation | narrative_shift | actor_realignment | economic_anomaly |
     media_synchronization | sudden_legal_change | rapid_alliance_shift | crisis_framing (S7);
   - `interests[].rank` (S8).

   *Verify*: regenerate the validator (`scripts/generate-strategic-validator.mjs`); the schema accepts both 1.1.0 and
   1.2.0 samples.

5. **Scores (S4, after D6)**:
   - Remove TPS and IW.
   - Show Tool Severity, and show the matrix as a profile.
   - API and NSI stay, with the formula shown in the inspector.

6. **Versioning (S10)**:
   - `schema_version` pattern accepts `1.1.0 | 1.2.0`.
   - Salvage keeps `1.1.0` and `1.2.0` as written and normalizes only other loose `1.x` strings.
   - Reject versions later than 1.2.0, as the bio router already does.

   *Verify*: routing tests with a 1.3.0 payload.

7. **Compact interchange**: add the new fields to the strategic interchange template in `ai-interchange.js` so
   that compiled analyses keep them.

### Biopolitical → contract 2.2.0

1. **Capture consistency (B1, after D5)**: these are integrity **errors** for canonical analyses and warnings for
   drafts.
   - A `present` criterion must have non-empty `evidence_ids`.
   - `substantial_capture` requires ≥ 3 evidenced present criteria.
   - `no_capture` requires 0 present criteria.
   - Any capture status other than `undetermined` must name its present criteria in `conclusion`.

   Prompt rule: "Use 'capture' only when several criteria are evidenced and counter-evidence was weighed."
2. **Intent evidence (B2)**:
   - Add `necropoliticalDimension.evidence_ids`.
   - `deliberate` and `reckless_indifference` require non-empty evidence IDs; otherwise use `uncertain`.
   - Prompt rule naming the five-way distinction.
3. **Harm evidence (B3)**:
   - Add `intervention.evidence_of_harm` (IDs).
   - It is required non-empty when `modality` is manipulation, exploitation, coercion, capture or expropriation.
4. **Conditional modules (B4)**: optional arrays requested by the prompt "when relevant". Their fields mirror the
   map's questions one-to-one.
   - `risk_systems[]` (§19)
   - `exceptions[]` (§25)
   - `data_systems[]` (§22–23)
5. **Enums (B5, B6)**:
   - A single 7-level `scale` enum, used by `scale_time.scales` and `alternative.level`.
   - `norm.basis` ∈ statistical_average | moral_standard | eligibility_rule | legal_requirement | professional_standard.
6. **Prompt (B7)**: add the four closing principles as one rule. Keep it short; the prompt is already long.
7. **Plumbing**:
   - Regenerate the validator (`scripts/generate-biopolitical-validator.mjs`) and the fixtures
     (`scripts/generate-biopolitical-fixtures.mjs`).
   - Route `2.1.0` and `2.2.0` and reject anything later.
   - Update `docs/biopolitical-v2-contract.md`.

   *Verify*: `tests/biopolitical-integrity-check.mjs` and `tests/biopolitical-v2-contract-check.mjs` get one failing
   case per new rule, and the bundled fixtures still pass. The publication gate stays blocked for the placeholder
   fixtures.

### Order of work

1. You decide D1–D6.
2. Make the strategic changes 1–3: prompt rules, link vocabulary, interest diversity. These are the highest value,
   with no schema change except the relation list.
3. Make the bio changes 1–3: capture consistency, intent evidence, harm evidence.
4. Make the schema additions (strategic 4, bio 4–5), version routing, and the interchange template.
5. Do the score cleanup (strategic 5) and the sample rewrites in EN/AR/FR.
6. Run the full CI: non-browser checks plus the core browser suite on all four projects.

## 6. Consequences for the UI/UX work

The redesign should be built on the corrected model, so these feed straight into the UX-0 prototype:

- **Prototype error, mine.** The causal map in `prototypes/ux-0` draws "model flow" edges around the six layers,
  including Narrative → Results. That presents narrative as a cause. Fix: draw the interaction matrix instead, with
  narrative attached by dashed `legitimizes` edges and the six-step order shown as an analysis sequence, not as
  arrows.
- **Strategic workspace.** Add an interest-diversity light to the readout; replace the TPS and IW cards; label
  `media_influence` as "Narrative influence"; show a severity chip and matrix profile on tools.
- **Biopolitical workspace (next prototype iteration).**
  - The capture verdict sits beside its evidence tally ("4 of 13 criteria evidenced · counter-evidence: 2").
  - Intent claims show their evidence or an "uncertain" badge.
  - The nine explanations render as a comparison board with falsifiers.
  - The 18-point self-audit becomes the pre-publish checklist.

A full UI/UX plan should follow the D1–D6 decisions, because several screens depend on which fields exist.
