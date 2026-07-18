# Usage Guide

## Choose the lens before generating a prompt

Use Strategic for interests, actors, instruments, narratives, results, feedback, contradictions, and scenarios.

Use Biopolitical v2 when the question concerns how human capacities, bodies, populations, relations, environments, or systems of meaning become governed, measured, optimized, protected, commercialized, disciplined, excluded, or resisted.

Switching lenses clears an imported analysis from the other contract so its fields cannot be reviewed or exported under the wrong method.

## Generate the analysis

1. Select the interface language and the analysis output language separately.
2. Select the lens.
3. Enter a specific topic.
4. Add a time and geographic context where possible.
5. Choose Focused, Expert, or Research.
6. Preview or copy the prompt.
7. Run it in the AI assistant of your choice.
8. Copy the returned JSON.

Research mode asks for the strongest evidence metadata and causal links. Focused mode remains concise but does not omit intervention classification, rival explanations, calibrated judgment, or the self-audit.

## Import JSON

Paste the JSON into the import field. The app accepts plain JSON and commonly encountered code-fence or surrounding-text wrappers.

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

## Review a Biopolitical v2 analysis

### Overview

Read the executive finding, overall readiness, six diagnostic dimensions, missing requirements, and the next best action.

The score combines:

- 15% question and context;
- 20% mechanism trace;
- 20% evidence integrity;
- 15% distribution and consent;
- 15% explanatory pluralism;
- 15% agency and alternatives.

It is a readiness measure, not a truth probability.

### Protocol

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
