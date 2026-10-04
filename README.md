# Jarbou3i Model — Dual-Lens Analysis Workbench

Version `2.1.0-alpha.55` is a local-first browser workbench for producing,
challenging, revising, and publishing evidence-traceable analysis with an
external AI assistant. It generates the prompt, imports the assistant's JSON
answer, recovers what it safely can, shows what is missing, and keeps
publication blocked until the evidence supports it.

- **Strategic v1.1**: Interests → Actors → Tools → Narrative → Results → Feedback.
- **Biopolitical Training Map v2.1**: an evidence-calibrated protocol for tracing
  how human functions, institutions, infrastructures, classifications, and
  meanings become governed.

The interface is available in Arabic, English, and French, in light and dark
themes, on desktop, tablet, and phone.

## What it does

- **Prompt and import.** Builds a lens-specific prompt for any assistant, with an
  explicit source-access mode (no sources, supplied sources, or live web
  research). Imported answers are salvaged rather than rejected: format slips are
  normalized, invalid values are quarantined in the import audit, cut-off answers
  are completed with a continue prompt, and remaining gaps get an exact-path
  completion prompt. Nothing is invented. See the
  [AI interchange contract](docs/ai-interchange-contract-v1.md).
- **Results and evidence.** Results are presented as orientation, explanation,
  and full record inspection, with relationship and evidence intelligence, a
  Connections explorer, and a deterministic evidence review queue. See
  [Results and evidence](docs/features/results-and-evidence.md).
- **Local workspace.** Analyses are saved in the browser with immutable
  revisions, a structured editor, crash recovery, a review ledger, approved
  resolution transactions, revision history, and portable backup bundles. See
  [Workspace](docs/features/workspace.md).
- **Exports.** A human-readable HTML report and lossless canonical JSON. See the
  [export contract](docs/export-contract.md).

Start with the [usage guide](docs/usage-guide.md) or the
[documentation index](docs/README.md).

## Workflow

1. Choose the interface language and, separately, the analysis language.
2. Choose Strategic or Biopolitical, a prompt depth, and the source-access mode.
3. Enter a topic and optional context (and your sources, if you supply them).
4. Copy the generated prompt to an AI assistant.
5. Paste the answer. If it was cut off, use the continue prompt; if parts are
   missing, use the completion prompt.
6. Import, then resolve every disclosed semantic and evidence warning before
   publication.
7. Review the full analytical record.
8. Export the HTML report and canonical JSON.
9. Use **Local workspaces** to reopen the analysis, browse its history, or back
   it up as an integrity-checked bundle.

Unfinished intake work (topic, context, sources, prompt, and pasted answer) is
restored after a reload. The analysis language stored in imported JSON controls
report language and direction; changing the interface language does not relabel
an imported analysis.

## Biopolitical protocol

| Pillar | Analytical task |
|---|---|
| Question & context | Form a testable question; define contested terms, historical formation, law, international comparison, and uncertainty. |
| Human functions | Identify the biological, cognitive-affective, reproductive, social-relational, symbolic, or environmental function being governed. |
| Actors & populations | Keep governing actors, institutions, beneficiaries, affected populations, and power asymmetries separate. |
| Mechanisms & infrastructure | Trace law, money, ownership, labor, expertise, statistics, data, algorithms, architecture, and dependency. |
| Meaning & classification | Examine norms, regimes of truth, subject positions, classifications, errors, contestability, and looping effects. |
| Intervention & capture test | Classify protection through expropriation and assess all 13 capture criteria exactly once without presuming domination. |
| Distribution & effects | Compare benefits, burdens, consent, exit, accountability, outcome character, inequality, five capture levels, scale, and time. |
| Evidence & explanations | Distinguish epistemic types, record study-design and verification metadata, and assess all nine explanation families exactly once. |
| Agency & alternatives | Include resistance, counter-conduct, institutional adaptation, lower-harm alternatives, and calibrated judgment. |

An 18-point self-audit covers intent attribution, institutional claims, mechanism
quality, history, political economy, inequality, agency, source verification,
uncertainty, benefits and costs, alternatives, stigmatization risk, and
falsifiers.

## Contract identities

| State | Schema | Contract | Publication status |
|---|---|---|---|
| Canonical analysis | `2.1.0` | `biopolitical-training-map-v2` | Eligible only after semantic and evidence-verification gates pass |
| Migrated legacy draft | `1.0.0` | `biopolitical-migrated-draft-v1` | Always blocked until completed as a canonical analysis |
| Reviewable generated draft | `1.0.0` | `biopolitical-generated-draft-v1` | Always blocked until canonical completion and review |
| Strategic analysis | `1.1.0` | Strategic schema | Blocked while contract gaps remain |

Imported `analysis_lens`, contract, schema version, and status are
authoritative. Unknown or future versions are rejected. Canonical Biopolitical
input is validated against the generated browser validator, then checked for
global ID uniqueness, typed references, exact 13/9/5 coverage, evidence
traceability, placeholder misuse, and self-audit contradictions. Analyses with
unresolved evidence or audit concerns can be imported for review with visible
warnings, and those warnings keep publication blocked. Non-verified malformed
source URLs are cleared and contradictory verification self-audits are
corrected to `concern`; verified evidence with malformed provenance remains a
hard error.

Legacy six-array Biopolitical JSON is kept as a disclosed migrated draft. The
adapter preserves recoverable records, does not invent governing actors or
intervention modalities, and never stamps partial data as canonical v2.1.

## Evidence and publication discipline

Evidence records separate structural completeness from verification. A source
carries a title, locator or URL, date, population, measurement and design
limitations, claim/source fit, conflicts, missing-data and selection effects,
uncertainty, counter-evidence, and verification state as applicable.

The readiness score is diagnostic and cannot make a report publishable.
Publication also requires:

- the canonical `2.1.0` contract;
- successful schema and semantic-integrity validation;
- every source verified, traceable, and free of placeholders;
- every relevant explanation assessed;
- no unresolved self-audit concern.

The bundled samples use deliberately unverified placeholder sources, so they
correctly show "not publication-ready".

## Safety boundary

Generated prompts treat the topic and context as untrusted analytical material.
They prohibit fabricated sources and operational guidance for repression, mass
manipulation, discriminatory profiling, eugenics, forced medical intervention,
vulnerable-group targeting, covert behavioral control, population punishment,
and coercive surveillance. They also prohibit weak-proxy inference of sensitive
traits, group-to-individual prediction, dehumanization, harassment, and
collective punishment.

The tool structures analysis; it does not establish truth. Verify sources, law,
statistics, causal claims, and ethical judgments independently.

## Local use and testing

```bash
npm ci
npm run dev
```

Open `http://127.0.0.1:4173`.

```bash
npm run test:ci:no-browser
npx playwright install --with-deps
npm run test:browser
```

`npm test` runs the complete CI contract. Browser coverage spans Chromium,
Firefox, WebKit, and mobile Chrome, with accessibility scanning, both lenses,
Arabic/English/French exports, RTL and mobile layout, strict imports, and
lossless HTML/JSON export. The local matrix uses four Playwright workers; on a
constrained machine set `PLAYWRIGHT_WORKERS=2`. See
[Continuous integration](docs/operations/ci.md) for the CI topology and test
budgets.

## Repository layout

```text
index.html, manifest.webmanifest, _headers   Static entry point and hosting headers
src/                  Application modules (see docs/architecture.md)
schema/               JSON Schemas for analyses, drafts, workspaces, interchange
fixtures/             Sample analyses in Arabic, English, and French
assets/               Icons and images
tests/                Node checks (*.mjs) and Playwright specs (*.spec.js)
scripts/              Dev server, Playwright runner, Pages build, generators, Gate 0 tools
docs/                 Product, contract, and operations documentation
```

## Deployment and privacy

The app is static: no backend, account, or tracking. Analyses and workspaces stay
in the browser (IndexedDB) and are not encrypted. Material you send to an
external AI assistant is governed by that provider's terms; do not submit
sensitive material without authorization. Release and hosting requirements are
in [Deployment and release operations](docs/operations/deployment.md).

Contributions: see [CONTRIBUTING.md](CONTRIBUTING.md). Security reports: see
[SECURITY.md](SECURITY.md). Release history: see [CHANGELOG.md](CHANGELOG.md).
