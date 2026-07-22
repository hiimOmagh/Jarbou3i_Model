# Phase 5 AI Interchange Reliability Interlock

Release: `2.1.0-alpha.37`

## Decision

External assistants are probabilistic and have different output limits, browsing capabilities, citation interfaces, and structured-output reliability. A single prompt cannot guarantee a complete, sourced, schema-perfect analysis from every provider or subscription tier. The workbench therefore owns recovery, provenance boundaries, and publication gating instead of delegating those controls to the model.

## Observed failure chain

The supplied case exposed four distinct states:

1. A non-browsing assistant correctly refused to claim verified, traceable research it could not perform.
2. Another assistant produced a nearly complete analysis with invalid labeled-array syntax and five deterministic contract-shape errors.
3. The former repair prompt encouraged a complete regeneration; the assistant returned Python plus a truncated JSON rendering instead of a single repaired object.
4. A later response became structurally importable but relied on one unverified, untraceable evidence record for many high-confidence claims. Import was correctly allowed as a reviewable draft while publication remained blocked.

The first state is a capability mismatch, the second and third are interchange defects, and the fourth is an epistemic-quality defect. They must not be collapsed into one generic “invalid JSON” problem.

## Implemented controls

### Source-access declaration

Prompt generation now requires one of three explicit conditions:

- `none`: produce an unsourced conceptual draft, never fabricate a source, keep evidence references empty, and preserve a low-confidence publication block;
- `provided`: use only sources actually identified in the supplied context and never guess missing metadata;
- `web`: record only sources actually opened or verified to exist, and fall back honestly if browsing is unavailable.

The no-source template contains one conspicuous publication-blocking placeholder only because the canonical v2.1 contract requires an evidence record. It is not referenced as proof.

### Conservative parser repair

The parser can recover an AI-labeled array entry such as:

```text
["CMP1": { ... }]
```

as an array containing an object with `id: "CMP1"`. The transformation runs only outside strings, only directly inside an array, and only for bounded canonical-style IDs.

### Contract-shape repair

The repair layer is restricted to the canonical Biopolitical v2.1 identity and can:

- convert ID-keyed maps for `international_comparison`, `theoretical_comparison`, and `human_functions` into arrays while preserving IDs;
- wrap scalar `transfer_limits` and `excluded_knowledge` values in their contract-required arrays;
- recover a missing actor `confidence` when a valid confidence enum was unambiguously appended to `accountability`.

Every repair has a code, canonical path, and count. The original pasted text remains preserved in the import audit. Analytical claims, evidence records, URLs, confidence judgments, and verification states are never invented or editorially rewritten.

### Repair-prompt containment

The fallback repair prompt now supplies the actual validation diagnostics and original text without repeating the full schema. It requires one complete minified JSON object and forbids Python, JavaScript, JSON Patch, Markdown, fences, prose, ellipses, and content invention. Truncated input must be reported as incomplete rather than reconstructed speculatively.

### UX truthfulness

An evidence-verification deficit is labeled a **publication blocker**, not an import blocker. This matches the actual transaction: a reviewable draft may enter the local workspace, but it cannot be represented as publication-ready.

## Non-goals and residual boundary

This release does not verify factual claims, browse sources, resolve DOI metadata, approve evidence, or guarantee output from an external model. It also does not yet implement section-by-section generation or JSON-fragment merging. Those are candidates for a later generation workflow only if measured failures remain high after this interlock.

The interlock is disproven if any repair changes analytical content, accepts ambiguous malformed syntax, allows a no-source placeholder to support substantive claims, or presents model-declared verification as independent approval.

## Release authority

- Node reliability gate: parser plus content-preserving contract repair.
- Prompt gate: Arabic, English, and French capability-mode semantics.
- Browser gate: the supplied serialization and shape-drift pattern across Chromium, Firefox, WebKit, and mobile Chrome.
- Expected focused browser matrix: 4 cases.
- Expected browser core after the new case: 320 cases.
