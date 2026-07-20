# Phase 3, Slice 2 — Results explanation hierarchy

Release: `2.1.0-alpha.25`

## Scope

This slice adds the explanation level between decision orientation and detailed diagnostics. It does not alter canonical analysis, scoring, readiness, evidence validation, relationships, reports, or exports.

## Shared explanation contract

Both Strategic and Biopolitical overviews now answer five follow-up questions in the same order:

1. Who acts, decides, or bears the consequences?
2. Which mechanisms, instruments, and infrastructures produce the result?
3. Which claims are supported, challenged, or still unverified?
4. Where do rhetoric, care, control, intentions, and actions diverge?
5. Who benefits, who bears burdens, and how do power or access change?

Each section shows no more than two authored previews while retaining the complete record count. Missing analysis remains visibly empty; the interface never fabricates a substitute explanation.

## Lens mapping

| Shared explanation | Strategic detail | Biopolitical detail |
|---|---|---|
| Actors and affected groups | Actors layer | Actors and institutions pillar |
| Mechanisms and instruments | Tools layer | Mechanisms and infrastructure pillar |
| Evidence and counter-evidence | Evidence view | Evidence and explanations view |
| Tensions and contradictions | Contradictions view | Intervention and capture pillar |
| Effects and distribution | Results layer | Distribution and effects pillar |

Every “Inspect details” command uses the existing review navigation, opens the correct accordion where applicable, and transfers keyboard focus to the detailed destination.

## Presentation and accessibility

- Human-readable names and authored meaning are primary; canonical IDs remain in the detailed inspection surfaces.
- Arabic, English, and French labels are first-class.
- The five-section hierarchy reflows to one column at 320 CSS pixels.
- Actions retain a 44 CSS-pixel minimum target.
- RTL, dark mode, compact density, forced colours, reduced motion, and print remain supported.

## Frozen contracts

Strategic v1.1 and Biopolitical v2.1 schemas, prompt generation, migration, import validation, score formulas, provenance ceilings, relationship projections, standalone reports, and JSON/HTML exports are unchanged.
