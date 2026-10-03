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
| Canonical-shaped AI result with defects | Format slips are normalized; invalid values are quarantined; the rest is reclassified as `reviewable_generated_draft` | Allowed | Blocked |
| Truncated | JSON structure ends before the opened object, array, or string closes | Continue prompt | Blocked |
| Unsupported | Contract/lens identity is unknown | Blocked | Blocked |

Canonical promotion is fail-closed. If the compiled candidate fails a strict
structural or semantic requirement, the same content is reclassified as a
generated draft. The fallback does not weaken the canonical schema.

## Salvage instead of rejection

AI answers from free and paid assistants differ in depth, but a structural slip
must never discard the whole answer. Every remaining schema error is resolved
from the validator's own diagnostics (`src/contract-repair.js`):

1. **Format slips are normalized** when the meaning is unambiguous: enum casing
   and separators (`"Medium"` → `"medium"`), language names or locales
   (`"English"`, `"en-US"` → `"en"`), numbers or booleans written as text, a
   scalar where an array is required, an ID-keyed object map where a record
   list is required (the key becomes the record ID), a list of strings where
   one string is required, a subject given as plain text (kept as the title),
   and an explicit `null` (left empty, so a required field becomes a gap).
   Missing record IDs are generated deterministically, and missing envelope
   metadata (language, mode, timestamp, analysis ID) is set from the request,
   as the interchange compiler does. Each change is listed in the import audit.
2. **Everything else is quarantined**: an out-of-contract value (for example a
   guessed `source_tier`) is removed from the payload, preserved with its JSON
   Pointer in the import audit, and the empty field becomes a completion gap.
   No replacement value is ever chosen. IDs and contract identity are never
   removed.
3. **The remaining diagnostics become the draft's completion work**, including
   broken references and duplicate IDs, which the draft gate reports as
   warnings. The targeted completion prompt asks the assistant to fix exactly
   those paths.

Envelope drift is recognized before compilation, for interchange, canonical,
and Strategic shapes: up to three wrapper levels are removed (a one-item list
such as `[{...}]`, or an object such as `{"response": {"analysis": {...}}}`
whose only result-shaped child is the result; a sibling note is commentary,
like prose around the JSON). Header identity written loosely is normalized
(`"Biopolitical"` → `"biopolitical"`, `"2.1"` → `"2.1.0"`, a missing or null
`contract_status` on the 2.1 contract → `"canonical"`), and an object with the
interchange shape but a missing or misspelled `contract` is compiled as AI
Interchange v1. Legacy v1 and other contract versions are never relabelled.
Fixed sets supplied as canonical-style arrays (`[{"level":"body",...}]`) are
matched by entry name instead of being dropped. A `null` entry in a list is
quarantined rather than turned into an empty record. An ID of the wrong type
(an object, or a list of several IDs) is quarantined and regenerated; several
IDs are never joined into one, and a one-item list keeps its item.

The Strategic lens follows the same policy (`salvageStrategicAnalysis`):
format slips are normalized; a section's records given as a bare list
(`"evidence": [...]`), as a list under another name
(`"evidence": {"records": [...]}`), or as an ID-keyed map become that
section's items before validation, and any other key inside a section is
preserved in the import audit, so no record is hidden; any 1.x
`schema_version` (text or number, any case) is read as the single Strategic
contract 1.1.0; missing record IDs are generated
deterministically, top-level keys outside the contract are preserved in the
import audit, out-of-range or invalid values are quarantined, and the result
imports as a reviewable Strategic draft with its gaps listed.
The Strategic quality gate re-validates the analysis, so a draft can never
show as publish-ready until its contract gaps are completed.

What salvage still refuses, by design: a reply with no JSON object, an
unsupported contract or schema version (for example Biopolitical `"99.0.0"`
or Strategic `"2.0"`), a header identity field holding an object or list (a
version written as a number is read as text), a legacy-shaped Biopolitical
document whose header does not say legacy v1, and a cut-off answer until it
is continued. Known limits: a
fixed-set entry supplied as a keyed map in a canonical-shaped answer keeps its
content, but its key is preserved in the audit and the entry name becomes a
gap; when a value is first reformatted and then quarantined, the audit shows
the reformatted value.

## Targeted completion

When a canonical-shaped result contains only reviewable completion gaps, the
application keeps the import button available, lists the exact JSON Pointer
paths, and offers a targeted completion prompt. The prompt includes the
preserved canonical candidate and permits changes only at those paths. It
requires specific content grounded in the existing record or an explicit
statement of what evidence remains unlocated; it forbids invented sources,
verification states, and unrelated rewrites.

This is an adaptive single-pass completion layer. A future multi-packet merge
protocol would require its own base-revision binding, conflict rules, and
replay protection; those guarantees are not implied here.

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
missing content. Instead, the workbench offers a continue prompt that asks the
same chat for only the remainder, anchored on the last characters received.
The reply is pasted into the continuation field and joined automatically
(`joinContinuation`): code fences are removed, line breaks at the seam are
dropped (a leading space is kept, since it can be string content), a reply
that wraps the remainder in a fenced block contributes only that block (so a
"Here is the rest:" line is ignored), and a
distinctive repeated tail is not duplicated. Repetitive text
at the seam (`0,0,0,`) is never trimmed, because it cannot be told apart from
real content; the prompt asks the assistant not to repeat anything, so this
only matters when it disobeys. If the joined answer is still
cut off, the cycle repeats. This is what lets assistants with small output
limits complete a full analysis: a complete Biopolitical answer is roughly
20,000 or more characters of JSON even at focused depth, because the fixed sets
and key names alone are large.

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
- Empty analytical requirements are preserved as visible completion work.
- Malformed values are normalized only when unambiguous, otherwise
  quarantined; contract identity and record IDs are never removed.
- Generated drafts are explicitly non-canonical.
- Truncated output is never promoted to a reviewable analysis; it is completed
  through the continue prompt first.
- AI output cannot self-approve evidence or publication.
- EN, FR, and AR use the same contract keys, enums, and compiler behavior.

## Ownership

- `schema/ai-interchange-v1.schema.json`: interchange target and identity.
- `src/ai-interchange.js`: prompt template, compiler, audit, and draft fallback.
- `schema/biopolitical-generated-draft.schema.json`: explicit fallback state.
- `src/json-parser.js`: conservative extraction and truncation classification.
- `src/contract-repair.js`: schema-directed format normalization and
  quarantine (salvage) for both lenses.
- `src/strategic-integrity.js`: Strategic salvage and draft classification.
- `src/biopolitics-integrity.js`: canonical versus draft routing and gates.
- `tests/ai-interchange-reliability-check.mjs`: deterministic authority.
- `tests/ai-interchange-reliability.spec.js`: browser workflow coverage.
