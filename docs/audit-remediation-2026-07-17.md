# Jarbou3i Model — Biopolitics Audit Remediation

Remediation date: 2026-07-17  
Baseline audited: `1.4.0-bio-alpha.1` / Biopolitical schema `2.0.0`  
Remediated candidate: `1.4.0-bio-alpha.4` / Biopolitical schema `2.1.0`

## Outcome

The coordinated contract-hardening release is implemented. It preserves the dual-lens product while making the Biopolitical engine truthful about contract identity, migration state, analytical completeness, source verification, and publication readiness.

The result-page graph, evidence-name chips, mind map, and other new visualization ideas were deliberately not added in this release.

## Finding closure matrix

| Finding | Status | Implemented resolution |
|---|---|---|
| H1 Runtime schema not enforced | Closed | Browser-import validation now routes the raw contract first, validates it with generated Ajv standalone validators, runs semantic checks, and reports JSON paths before normalization. Unknown, versionless, future, and malformed contracts are rejected. |
| H2 Legacy migration falsely claims v2 | Closed | Legacy input now becomes `biopolitical-migrated-draft-v1@1.0.0` with `contract_status: migrated_draft`. A separate schema validates this recovery state, and it can never validate or publish as canonical v2.1. |
| H3 13 criteria / nine explanations not enforced | Closed | Canonical schema requires exactly 13 capture assessments, exactly nine explanation-family records, and exactly five capture levels. Semantic validation requires every allowed value exactly once. Prompt, template, fixtures, scoring, tests, and docs use the same constants. |
| H4 Evidence score can reward placeholders | Closed | Structural coverage, source verification, and evidence integrity are separate signals. Traceability, claim/source fit, source tier, study-design metadata, verification metadata, placeholder detection, quantitative fields, and self-audit consistency are checked. Publication is a separate non-numeric gate. |
| H5 Review and export are lossy | Closed | High-value omitted fields are rendered in review. The export tab exposes the complete canonical inspector and lossless JSON download. Standalone HTML embeds the escaped canonical payload and a complete appendix. Sentinel and deep-equality tests protect preservation. |
| H6 Prompt lacks Training Map safety rules | Closed | Arabic, English, and French prompts prohibit operational repression/manipulation, discriminatory profiling, eugenics, forced intervention, vulnerable-group targeting, covert behavioral control, population punishment, coercive surveillance, weak-proxy sensitive inference, and group-to-individual prediction. User topic/context are marked untrusted. |
| H7 Cross-record integrity not validated | Closed | Semantic validation enforces global ID uniqueness, typed record references, link endpoints, evidence references, exact sets, falsifiers, URL rules, quantitative metadata, and audit/evidence consistency. Negative mutation tests cover the failure modes. |
| H8 Analysis content not truly trilingual | Closed | Canonical Arabic and French fixtures contain localized analytical prose, prompt output language is explicit, and enum/audit display labels are localized while canonical codes remain stable. Language-purity tests cover fixtures and generated samples. |
| M1 Missing Training Map dimensions | Closed | The contract now has legal framework, international comparison, five capture levels, theoretical comparison, richer evidence-design fields, and intended/tolerated/concealed/unforeseen outcome characterization. |
| M2 UI, analysis, and report languages conflict | Closed | UI language and analysis language are separate state. Imported analysis language is authoritative for exported document language and direction; temporary report rendering does not alter the UI setting. |
| M3 Test blind spots | Substantially closed | Schemas compile in strict Ajv mode; canonical/draft fixtures and negative mutations are validated; prompt safety, parser adversarial cases, score gaming, strict import, lossless export, axe, and Chromium/Firefox/WebKit/mobile projects were added. Hosted evidence can target a deployment and discloses its true target. Pixel-diff baselines remain an explicit manual approval step because no approved visual baseline was supplied. |
| M4 Accessibility semantics | Closed | Segmented controls implement radio semantics, roving tab stops, and arrow keys. Tabs implement stable relationships and keyboard navigation. Accordions expose state/relationships. Modal focus is trapped and restored. Runtime axe scans serious/critical findings. |
| M5 CI and artifact hygiene | Closed | CI and package scripts use npm with the committed lockfile. `npm test` represents the full gate. Hosted evidence is reviewed by the browser script, and all generated outputs are ignored consistently. |
| M6 Unreferenced deployed pages | Closed | The two standalone prototypes were moved from the release root to `docs/archive/legacy-pages/` and are documented as historical artifacts. |
| L1 Regex recovery damages URLs | Closed | Recovery uses a string-aware tolerant parser with tests for URLs, comment-like string content, fences, actual comments, trailing commas, and invalid input. |
| L2 Non-functional assistant selector | Closed | The selector was removed instead of implying behavior it did not provide. |
| L3 Maintainability debt | Mitigated | Schema validation, semantic integrity, tolerant parsing, sample localization, fixture generation, validator generation, and static serving now live in dedicated modules/scripts. The large renderer and layered CSS remain candidates for further decomposition before the visualization feature wave. |
| L4 Stale docs and metadata | Closed | Security, contribution, deployment, QA, usage, export, release-lock, handoff, source-test, and schema-test documents were updated; page/version headers were aligned; broken relative Open Graph image declarations and stale export CSS were removed. |

## Contract and publication policy

Canonical Biopolitical analyses use:

```text
analysis_contract = biopolitical-training-map-v2
schema_version    = 2.1.0
contract_status   = canonical
```

Recovered legacy material uses:

```text
analysis_contract = biopolitical-migrated-draft-v1
schema_version    = 1.0.0
contract_status   = migrated_draft
```

A canonical shape alone is not publication permission. Publication also requires semantic integrity, fully verified and traceable sources, no placeholders, all relevant rival explanations assessed, and no self-audit concern.

## Verification evidence

Completed in this workspace:

- `npm run test:ci:no-browser` — passed all contract, schema, integrity, fixture, parser, localization, static accessibility, CI, and hygiene gates;
- all three canonical Biopolitical fixtures — passed strict Ajv 2020-12 validation and semantic integrity;
- migrated legacy fixture — passed only the migrated-draft schema and was rejected by the canonical schema;
- canonical runtime round-trip — strict deep equality passed, confirming validation/normalization does not drop valid data;
- placeholder sample — remained canonical but non-publishable, with evidence verification `0` and explicit blockers;
- `npm audit --package-lock-only` — zero known vulnerabilities;
- Playwright discovery — the updated matrix was successfully discovered across Chromium, Firefox, WebKit, and mobile Chrome.

The Windows alpha.2 run completed 65 of 76 core browser cases and exposed 11
failures. Those failures reduced to four shared causes rather than 11 separate
defects: missing language metadata in generated Strategic samples, moving review
navigation hit targets, implicit pointer-focus assumptions in modal restoration,
and premature object-URL cleanup during consecutive Firefox downloads. Alpha.3
fixed those causes and added focused assertions.

The subsequent Windows alpha.3 run completed 53 of 76 cases. Its 23 failures
were all operations canceled at the common 30-second test ceiling while 16
workers simultaneously rendered reports, performed downloads, or ran axe. No
content or contract assertion failed. All 19 mobile cases passed after the heavy
desktop queue cleared, and the only test already carrying a 60-second budget
passed in all four projects in 36–43 seconds. Alpha.4 therefore bounds the core
matrix to four workers, raises the realistic cross-browser test budget to 60
seconds, and retains every behavioral and contract assertion.

The revised browser assertions could not be executed in this Linux workspace because the required Playwright browser binaries were unavailable and the sandbox download endpoint returned invalid archives. This is an environment limitation, not a recorded passing browser result. Run the following on the Windows machine that successfully executed the baseline suite:

```powershell
npm ci
npm run upgrade:layout
npm run test:ci:no-browser
npx playwright install --with-deps
npm run test:browser
```

`upgrade:layout` is required when the release was copied over an older project
folder. It removes a root prototype only when it is byte-identical to the
archived copy, moves it when no archive exists, and refuses to delete divergent
content.

The release script executes 76 core browser cases across four projects plus two hosted-evidence cases. Do not promote the alpha until that updated browser matrix is green.

## Deliberate next-phase boundary

The validated IDs, typed references, evidence links, and complete export payload now provide the correct foundation for the proposed dynamic result page. Before implementing it:

1. approve the visual direction and initial screenshot baselines;
2. decide whether the default relation view is a readable 2D graph, a mind map, or a progressive 2D-to-3D mode;
3. further isolate result rendering and graph-view code from `src/app.js`;
4. keep text review and lossless exports as accessible fallbacks for every interactive visualization.
