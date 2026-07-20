# Phase 3, Slice 1 — Results orientation

Release: `2.1.0-alpha.23`

## Scope

This slice introduces the orientation level of the Results Workspace. It does not alter canonical analysis, scoring, readiness calculations, evidence, relationships, reports, or exports.

## Orientation contract

Both Strategic and Biopolitical overviews now begin with the same six decision questions:

1. What is the authored conclusion?
2. Is publication approved or blocked?
3. What is the capped decision-readiness score?
4. What is the analytical-coverage score?
5. What is the principal authored uncertainty or review constraint?
6. What action should happen next?

The underlying view model contains normalized display values only. It never retains or mutates a canonical analysis object.

## Presentation contract

- Human-readable orientation precedes detailed diagnostics.
- Publication status remains textual and is never communicated by colour alone.
- Arabic, English, and French labels are first-class.
- The layout reflows at 320 CSS pixels without removing conclusion, gate, uncertainty, or next action.
- Compact density, dark mode, forced colours, print, and reduced motion remain supported.
- Results use `data-analysis-lens` for metadata; `data-lens` remains reserved for the interactive shell controls.

## Frozen contracts

Strategic v1.1 and Biopolitical v2.1 schemas, prompt generation, migration, import validation, score formulas, provenance ceilings, relationship projections, standalone reports, and JSON/HTML exports are unchanged.
