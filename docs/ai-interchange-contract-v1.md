# AI Interchange Contract v1 + Recoverable Draft Compiler

Contract: `jarbou3i-ai-interchange/1`
Initial lens: `biopolitical`
Canonical target: `biopolitical-training-map-v2@2.1.0`
Reviewable fallback: `biopolitical-generated-draft-v1@1.0.0`

## Boundary

The AI interchange contract is a generation interface, not the application’s
database contract and not a publication certificate. External assistants
produce analytical judgments and traceable source data in a smaller keyed
structure. The browser generates deterministic metadata and IDs, expands the
fixed 5/13/9/18 assessment sets, compiles the result, and applies the existing
canonical and semantic gates locally.

The compiler never researches, invents missing prose, manufactures evidence,
or promotes model-declared verification.

## Import states

| State | Meaning | Import | Publication |
|---|---|---:|---:|
| Canonical | Compilation passes strict schema and semantic integrity | Allowed | Existing evidence/review gates decide |
| `reviewable_generated_draft` | Recoverable analytical content remains incomplete or inconsistent | Allowed | Blocked |
| Truncated | JSON structure ends before the opened object, array, or string closes | Blocked | Blocked |
| Unsupported | Contract/lens identity is unknown | Blocked | Blocked |

Canonical promotion is fail-closed. If the compiled candidate fails a strict
structural or semantic requirement, the same content is reclassified as a
generated draft. The fallback does not weaken the canonical schema.

## Deterministic compilation

The compiler performs only disclosed structural work:

1. locks the canonical contract, schema, lens, language, and mode;
2. generates `generated_at` and a stable analysis ID when absent;
3. converts keyed capture levels, capture criteria, and explanation families
   into their exact canonical arrays;
4. generates predictable record IDs only where no ID was supplied;
5. maps interchange wrappers such as `power`, `meaning`, and `conclusion` to
   canonical application sections;
6. retains source verification as model-untrusted until independent review;
7. records every transformation in the import audit.

## Unknown properties

Unknown properties are never silently discarded. A property forbidden by the
canonical schema is removed from the canonical payload and preserved with its
original JSON value and JSON Pointer in the import audit:

```json
{
  "code": "UNKNOWN_PROPERTY_QUARANTINED",
  "path": "/theoretical_comparison/0/confidence",
  "value": "medium",
  "action": "preserved_in_import_audit"
}
```

This makes harmless provider drift recoverable without pretending that unknown
data is part of the canonical contract.

## Truncation

The parser distinguishes an invalid complete candidate from an input that ends
with an unclosed object, array, escape, or string. Truncated material is not
auto-closed because doing so would create structurally valid but analytically
missing content. The repair workflow must resume the response or request the
missing packet.

## Prompt effect

The English research template decreases from approximately 17,406 characters
for the canonical output skeleton to 11,095 characters for AI Interchange v1.
The complete English research prompt decreases from approximately 21,500 to
17,956 characters after adding a compact record guide for fields intentionally
omitted from the JSON skeleton. This is a smaller reduction than the template
alone, but it preserves the analytical protocol, evidence rules, five capture
levels, thirteen capture tests, nine competing explanations, eighteen
self-audit checks, and the record shapes needed for accurate compilation.

This is a first generation-interface reduction, not a claim that every free
provider can complete every full investigation in one response. Adaptive
packet completion remains the next layer for providers with small output
budgets.

## Safety and publication invariants

- The original pasted text remains available in the current import audit until
  the input is cleared.
- Quarantined values remain review data and never enter canonical exports.
- Missing analytical content is never synthesized by deterministic repair.
- Generated drafts are explicitly non-canonical.
- Truncated output is never promoted to a reviewable analysis.
- AI output cannot self-approve evidence or publication.
- EN, FR, and AR use the same contract keys, enums, and compiler behavior.

## Ownership

- `schema/ai-interchange-v1.schema.json`: interchange target and identity.
- `src/ai-interchange.js`: prompt template, compiler, audit, and draft fallback.
- `schema/biopolitical-generated-draft.schema.json`: explicit fallback state.
- `src/json-parser.js`: conservative extraction and truncation classification.
- `src/contract-repair.js`: schema-directed additional-property quarantine.
- `src/biopolitics-integrity.js`: canonical versus draft routing and gates.
- `tests/ai-interchange-reliability-check.mjs`: deterministic authority.
- `tests/ai-interchange-reliability.spec.js`: browser workflow coverage.
