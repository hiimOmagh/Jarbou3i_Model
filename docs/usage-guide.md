# Usage Guide

## Choose the lens before generating a prompt

Use Strategic for interests, actors, instruments, narratives, results, feedback, contradictions, and scenarios.

Use Biopolitical v2 when the question concerns how human capacities, bodies, populations, relations, environments, or systems of meaning become governed, measured, optimized, protected, commercialized, disciplined, excluded, or resisted.

Switching lenses hides an imported analysis from the other contract, so its fields cannot be reviewed or exported under the wrong method. The result is kept for the session: switch back to the original lens to see it again.

## Generate the analysis

1. Select the interface language and the analysis output language separately.
2. Select the lens.
3. Enter a specific topic.
4. Add a time and geographic context where possible. Optionally, open **What the analysis covers** and write, one item per line, what is in scope, what is out of scope, the terms in dispute (the term, a colon, then what you mean by it), the limits of the research, and when the analysis is done (one criterion per line; you mark each one met, with your reason, at the end of the case file overview). These go into the prompt with your context, and are kept on this device with the case: an answer you import for it is linked to it, keeps your question as you wrote it, and brings the case back when you reopen that analysis. Every case is listed under **Cases** in the Local workspaces dialog, where you can open it again (before any answer too), export it as its own file, restore one from a file, or remove it (its answers stay).
5. Optionally, open **Your sources**, also in the topic step, and add the sources the case rests on: a title, a link, the source's own date and the date you opened it. Under each, add the excerpts you took from it, quoted or in your words, with where each is in the source. Mark an excerpt **Matches the source** or **Does not match** once you have checked it against the source, saying how you checked or what differs; this is your claim, never the app's. They are kept on this device with the case, and with **Sources supplied in context** the sources you send go into the prompt with their excerpts (not one that does not match, and never your checks).
6. Choose Focused, Expert, or Research.
7. Choose the source access: no access (a conceptual draft), sources supplied in context, or live web research. With supplied sources, paste text or links into the **Supplied sources** box, and list there the names of any files you will attach in your AI assistant's chat; the box is added to the prompt, which tells the assistant to read the attached files and cite each by its file name. Evidence from a file has no web link. In the Biopolitical lens its page or section (`source_locator`) makes it traceable, and like every source it is verified by a reviewer before publication; in the Strategic lens the evidence summary lists it as a source that is not traceable, for review.
8. Preview or copy the prompt.
9. Run it in the AI assistant of your choice.
10. Copy the returned JSON.

Research mode asks for the strongest evidence metadata and causal links. Focused mode remains concise but does not omit intervention classification, rival explanations, calibrated judgment, or the self-audit. For Strategic, Focused asks for a compact answer (two or three items per section, one or two evidence items, short text values) so assistants with small output limits can finish.

## Import JSON

Paste the JSON into the import field. The app accepts plain JSON and commonly encountered code-fence or surrounding-text wrappers. Structural slips are repaired or quarantined and listed in the import audit; nothing is invented. A clean answer shows "Valid analysis, ready to import". The exact rules are in the [AI interchange contract](ai-interchange-contract-v1.md).

When the answer needs help, the prompt button under the import field changes to match the problem:

- **Cut off.** Click **Copy a prompt to continue it**, send the prompt in the same chat, and paste the reply into the **The rest of the AI’s answer** box. It is joined to the first part automatically; repeat if the answer is still cut off.
- **Missing parts.** If the analysis has listed gaps, click **Copy a prompt to complete it** and send the prompt in the same chat. Paste the reply into the **The AI’s reply** box under your answer: the missing parts are merged into the open analysis. The prompt only allows changes at the listed paths.
- **Broken JSON.** Click **Copy a prompt to fix it**. The prompt sends the diagnostics and asks for one complete JSON object without new content.
- **Wrong language.** If the reply is written in a language other than your analysis language, you can still import it, or ask the assistant to answer in the requested language.

Your topic, context, sources, prompt, and pasted answer are kept in this browser and restored if the page reloads before you finish.

The imported `analysis_lens` controls the final lens:

```json
{"analysis_lens": "strategic"}
```

or:

```json
{
  "analysis_lens": "biopolitical",
  "schema_version": "2.1.0",
  "analysis_contract": "biopolitical-training-map-v2",
  "contract_status": "canonical"
}
```

A Biopolitical v1.1 six-array file becomes `biopolitical-migrated-draft-v1@1.0.0` and is visibly marked as non-canonical. The adapter does not fill unsupported conclusions. Unknown and future contract versions are rejected.

## From your sources to the evidence

When the analysis on screen belongs to your case, its case file shows your sources (step 5) beside the evidence, in both lenses. Nothing in the analysis changes until you confirm a change.

- An evidence record that comes from one of your sources says so under its title: "From your source: <title>". A record and a source belong together by their link; a record with no link, by its source title ("matched by title"). A title that several linked sources share joins nothing.
- **Your sources**, folded after the evidence records, lists each source with the records that come from it, and its excerpts with your checks. It is not printed.
- **Make it evidence**, on an excerpt you marked **Matches the source**, opens a short form under it: a **New evidence record** made from the source and the excerpt, or **Fill E3 from your source** for a record from that source that lacks its link, date or place (only empty fields are filled). The form asks for every judgement the lens needs; the app makes none for you, except that a Biopolitical record starts its replication at "unknown". In the Biopolitical lens, **verified** is offered only when the lens's checks would pass, and Fill can set a record from that source to verified even when nothing is left to fill.
- **Review the change** opens the change as a revision, with a rationale you can start from; **Confirm** commits one revision under your name. **Close** leaves the analysis as it was. The case is read again at both steps: an excerpt changed in the meantime is refused. A working draft with changes must be saved or discarded first.
- After the commit, the excerpt shows "Evidence E7 (revision 4)", and "Changed since" if you later edit the excerpt or its source. The new record is not yet cited by any claim: cite it in the editor (in the Biopolitical lens, an uncited record holds publication). If the case could not save the link to the record, the excerpt says so and **Save again** retries it. An excerpt can become evidence up to 10 times; after that, add it again as a new excerpt.
- In the review ledger, a provenance task on such a record names your source, and **Complete** starts its rationale from your check. What you save there is yours: removing the source later does not remove it.

## Review a Biopolitical v2 analysis

### Overview

Read the executive finding, overall readiness and the recommended next action, then the six diagnostic dimensions and the quality gate, which lists every open item once.

The score combines:

- 15% question and context;
- 20% mechanism trace;
- 20% evidence integrity;
- 15% distribution and consent;
- 15% explanatory pluralism;
- 15% agency and alternatives.

It is a readiness measure, not a truth probability.

### Pillars

Inspect all nine pillars:

1. Question and context
2. Human functions
3. Actors and populations
4. Mechanisms and infrastructure
5. Meaning and classification
6. Intervention and capture test
7. Distribution and effects
8. Evidence and explanations
9. Agency and alternatives

Key reading rule: an affected population is not automatically a governing actor. Likewise, a public benefit does not disprove control, and control does not by itself prove capture.

### Evidence test

Review each claim’s epistemic type, source tier, locator, measurement and causal design, replication, conflicts, missing data, selection, applicability, claim/source fit, verification state, limitations, uncertainty, confidence, and counter-evidence. Compare all nine rival explanation families and their falsifiers.

Empty URLs or placeholder source titles in the bundled sample demonstrate structure only. Replace them with verified, case-specific evidence before publication.

### Judgment

The conclusion separates:

- strongly supported;
- plausible but unconfirmed;
- disputed;
- unknown;
- evidence that would change the conclusion.

Resolve every `concern` in the 18-point self-audit before treating the report as publication-ready.

### Export

Download the standalone HTML report for human review and canonical JSON for lossless verification, re-import, or archival. The HTML report also embeds the complete JSON payload. A Biopolitical v2.1 report carries:

```html
<meta name="analysis-lens" content="biopolitical">
<meta name="analysis-contract" content="biopolitical-training-map-v2">
<meta name="schema-version" content="2.1.0">
```

Report language and direction follow the imported analysis `language`, even if the interface is currently displayed in another language.

Strategic reports retain their independent Strategic identity.

## Verification

Run the no-browser contract suite:

```bash
npm run test:ci:no-browser
```

Run browser coverage:

```bash
npm run test:browser
```

The suite checks both lenses, v2 and migrated imports, Arabic RTL, English/French LTR, mobile layout, accessibility, and cross-locale exports.

## Analytical caution

Do not infer malicious intent from system effects alone. Distinguish deliberate violence, reckless indifference, structural exposure, administrative failure, and unintended harm. Test public-interest and less critical explanations against political-economy and critical-biopolitical accounts. Verify all facts and sources independently.
