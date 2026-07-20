# Phase 3, Slice 3 — Results inspection layer

Release: `2.1.0-alpha.26`

## Scope

This slice adds the inspection level beneath decision orientation and explanation. It is a read-only projection of the imported canonical analysis. It does not alter schemas, prompts, validation, scoring, readiness, graph semantics, reports, or exports.

## Shared inspection contract

Strategic and Biopolitical results now share one inspection directory and one accessible details drawer. Human-readable names remain primary; canonical identifiers remain visible and auditable.

Each canonical record can expose:

- record type, analytical pillar, canonical ID, canonical JSON Pointer path, and declared confidence;
- source title, valid public URL, locator, date, type, tier, note, declared verification, and claim/source fit;
- platform-assessed traceability, claim status, independent-review status, and approval eligibility;
- supporting evidence IDs, counter-evidence IDs, and authored counter-evidence text;
- indexed incoming and outgoing records with explicit relation labels;
- schema, contract, model, analysis, uncertainty, limitation, evidence-strength, and unresolved-link audit facts;
- every canonical, relationship, or authored-reference occurrence found in the imported analysis.

Missing values remain visibly unavailable. The inspection index never invents identifiers, provenance, evidence, relationships, or review decisions.

## Lens indexing

| Lens | Inspection source |
|---|---|
| Strategic | IDs authored on the six causal layers, contradictions, scenarios, evidence, and assumptions; explicit `links` only |
| Biopolitical | Existing canonical relationship graph plus the shared provenance, evidence-balance, audit, and occurrence projection |

Strategic imports without authored IDs display an honest empty directory. Biopolitical relationship exploration remains unchanged and continues to use its complete graph.

The bundled trilingual Strategic demonstration now authors its own stable record IDs, three explicit causal links, and source/counter-evidence metadata so users can exercise the feature without the inspection runtime manufacturing data.

## Interaction and accessibility

- The Inspection tab is available in both review navigations and reports the canonical record count.
- Search filters the existing directory nodes without rebuilding controls or losing focus.
- The inspector is a modal dialog with Escape closure, a focus trap, and focus restoration.
- Following linked records inside the drawer preserves the original external return target.
- Occurrence activation closes the drawer, opens the owning detailed review surface, scrolls it into view, and transfers keyboard focus.
- Source links are rendered only for valid HTTP or HTTPS URLs and open with `noopener noreferrer`.
- Arabic, English, and French, RTL, dark mode, compact density, forced colours, reduced motion, and 320 px reflow remain supported.

## Verification contract

- `npm run test:results:inspection` validates immutability, both lens indexes, provenance joins, evidence balance, occurrences, relationships, and the no-fabricated-ID rule.
- `tests/results-inspection.spec.js` validates the Strategic and Biopolitical directories, modal semantics, provenance and audit sections, linked-record traversal, focus preservation, and occurrence navigation across every browser project.
- Static and CI-contract gates require the inspection module, styles, integration, unit test, and browser specification.

The complete browser core is expected to contain 268 cases after this slice: the previous 260 cases plus two inspection scenarios across four projects.
