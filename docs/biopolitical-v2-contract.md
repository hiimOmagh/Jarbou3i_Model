# Biopolitical Training Map v2.1 Contract

Canonical contract: `biopolitical-training-map-v2`  
Canonical schema: `2.1.0`  
Migrated-draft contract: `biopolitical-migrated-draft-v1@1.0.0`  
Application: `1.4.0-bio-alpha.4`

## Method boundary

The method asks how a human function becomes a target of knowledge, administration, optimization, protection, discipline, commercialization, exclusion, or resistance. It requires mechanisms, distribution, evidence, uncertainty, and rival explanations before a critical judgment is supported.

Non-negotiable distinctions:

1. Governing actors are not affected populations.
2. Institutional claims are not verified effects.
3. Public benefit and control can coexist.
4. Governance is not automatically domination; control is not automatically capture.
5. Distributional harm does not establish intent.
6. Interpretation, judgment, inference, and speculation are not verified facts.
7. Analysis language is independent of interface language.
8. Structural completeness is independent of source verification.

## Mandatory coverage

The contract retains nine review pillars and requires these exact cardinalities:

- 13 capture criteria, each exactly once, with `present`, `absent`, `uncertain`, or `not_applicable`, a reason, and evidence IDs;
- nine explanation families, each exactly once, with relevance, evidentiary status, falsifier, supporting evidence, and counter-evidence;
- five capture levels—body, mind, relationship, population, and environment—each exactly once;
- 18 self-audit checks.

It also requires legal framework, international comparison, theoretical comparison, consent quality, accountability, outcome character, political economy, future feedback, calibrated conclusion, and lower-harm alternatives.

## Evidence record

Each evidence item carries epistemic type, source tier, title, URL and/or precise locator, date, geography, population, measurement, denominator, sample size where applicable, measurement validity, causal identification, replication, conflicts of interest, missing data, selection effects, relevant comparison, cross-context applicability, claim/source fit, verification state, verifier/date, uncertainty, limitations, counter-evidence, and confidence.

An item marked `verified` must have a real title, date, verifier, verification date, and traceable URL or locator. Placeholder titles cannot be promoted by toggling the verification field. Quantitative estimates require the design metadata needed to interpret them.

## Runtime validation order

1. Route by exact lens, contract, schema version, and status.
2. Reject unknown, versionless, or future contracts.
3. Validate the raw canonical or migrated-draft payload against its JSON Schema.
4. Normalize only after successful schema validation.
5. Check global ID uniqueness and typed references.
6. Enforce exact 13/9/5 sets and explanation falsifiers.
7. Check evidence URLs, placeholders, traceability, verification consistency, quantitative metadata, and self-audit contradictions.
8. Compute diagnostic readiness and a separate publication gate.

## Publication gate

A report is publishable only when it is canonical, structurally complete, semantically valid, fully source-verified and traceable, contains no relevant explanation marked `not_assessed`, and has no self-audit concern. The numeric readiness score never overrides these blockers.

The bundled fixtures intentionally contain unverified placeholder sources. They demonstrate structure and must remain blocked from publication.

## Legacy migration

Legacy Biopolitical `1.1.0` records are mapped conservatively into `biopolitical-migrated-draft-v1@1.0.0`:

| Legacy field | Draft destination |
|---|---|
| `interests` | preliminary human functions and problem definition |
| `actors` | affected populations only |
| `tools` | instruments with undetermined intervention modality |
| `narrative` | preliminary norms |
| `results` | distribution/effect records |
| `feedback` | resistance/agency |
| `contradictions` | care/control tensions |
| `evidence` | evidence with disclosed legacy provenance |

The adapter does not infer governing actors, ownership, consent, exit, capture status, legal analysis, comparisons, or rival explanations. A migrated draft remains non-canonical until a user supplies and validates the missing analysis.

## Safety boundary

The prompt delimits topic/context as untrusted material, requires output-language discipline, forbids fabricated sources, and refuses operational assistance for repression, mass manipulation, discriminatory profiling, eugenics, forced medical intervention, vulnerable targeting, covert behavior control, population punishment, and coercive surveillance. It also prohibits weak-proxy sensitive inference, automatic group-to-individual prediction, dehumanization, harassment, and collective punishment.

## Ownership

- `schema/biopolitical-analysis.schema.json`: canonical external contract.
- `schema/biopolitical-migrated-draft.schema.json`: explicit partial legacy state.
- `scripts/generate-biopolitical-validator.mjs`: strict Ajv browser-validator build.
- `src/biopolitics-integrity.js`: runtime routing and semantic checks.
- `src/biopolitics.js`: method, prompt, migration, scoring, samples, and review projections.
- `src/app.js`: browser workflow, accessible review, and lossless export.
