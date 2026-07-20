# Phase 2, Slice 2 — Responsive command and navigation shell

Release: `2.1.0-alpha.19`

## Scope

This slice refines the shared application shell only. Strategic and Biopolitical schemas, prompts, scoring, imports, evidence, relationship graphs, reports, and export contracts remain unchanged.

## Delivered contracts

- A state-aware primary shell command advances from topic entry to JSON import and then to analysis review.
- Primary and secondary card commands have explicit visual and responsive hierarchy.
- Workspace navigation uses a roving tab stop and supports Arrow, Home, and End keys.
- Disabled review is removed from the keyboard route until analysis exists.
- Horizontal key behavior follows the interface direction in Arabic RTL and English/French LTR.
- Programmatic shell commands move focus to the relevant working control or review heading.
- Shell destination changes are announced through a polite live region.
- The command hierarchy remains reachable without horizontal overflow at 320 CSS pixels.

## Frozen analytical contracts

No canonical JSON field, validation rule, migration, score, readiness gate, prompt, evidence record, relationship edge, standalone report, or export format was modified.

## Verification

The no-browser release gate includes a pure shell-navigation contract. The application-shell browser suite covers command progression, focus movement, disabled-destination skipping, keyboard wrapping, review activation, and 320 px command reachability across all configured browser projects.
