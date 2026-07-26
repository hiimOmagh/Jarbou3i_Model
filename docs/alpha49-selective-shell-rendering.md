# Alpha.49 — Selective Shell Rendering

## Decision

Alpha.49 activates the existing named-region renderer for two shell-only
interactions:

- information-density changes;
- workspace-section navigation.

Each interaction now renders only the `shell` region. The `workflow`, `engine`,
and `review` regions are not executed.

## Frozen boundaries

This slice does not change:

- Strategic or Biopolitical schemas, validation, prompts, scoring, or analytical
  outcomes;
- import, workspace, recovery, review-ledger, resolution, evidence, graph,
  report, or export behavior;
- localization catalogs or visible Arabic, English, and French copy;
- browser inventory, Playwright sharding, worker count, required-check names,
  artifact inventories, or GitHub Pages authority;
- language, lens, analysis, workspace, import, sample, and reset transitions,
  which retain full-region rendering.

## Verification contract

The performance authority must prove that a selective shell render:

1. executes the `shell` renderer exactly once;
2. executes no `workflow`, `engine`, or `review` renderer;
3. increments no non-shell render counter;
4. leaves a later full render capable of executing every registered region.

The shell-navigation authority also fixes this slice to exactly two
`renderRegions("shell")` call sites, preventing accidental expansion without a
new bounded decision.

## Acceptance

Alpha.49 is accepted only when:

- the complete no-browser authority passes;
- all 360 core browser tests pass without retry-only success;
- evidence remains 26/26 with 8 hosted files and 193 visual artifacts;
- Arabic, English, and French shell navigation and density behavior remain
  equivalent on desktop and mobile;
- runtime diagnostics show that density and workspace navigation increment
  `render.shell` without incrementing `render.workflow`, `render.engine`, or
  `render.review`;
- the post-merge GitHub Pages deployment succeeds for the exact accepted
  commit.

The selective-render claim is disproven if either shell-only interaction
executes a non-shell region, or if focus, ARIA state, navigation, localization,
analysis state, or deployment evidence regresses.
