# Alpha.50 — Application Entry-Point Feature Extraction

## Decision

Alpha.50 extracts the application shell from the temporary `src/app.js`
composition root into `src/features/application-shell.js`.

The feature owns:

- comfortable/compact density application and persistence;
- shell navigation rendering and availability;
- keyboard section routing;
- reduced-motion-aware scrolling and focus transfer;
- next-command resolution and activation;
- localized workspace and save-state shell presentation.

The entry point retains composition: platform creation, feature dependency
injection, lens registration, analytical workflows, and boot order.

## Frozen boundaries

This phase does not change Strategic or Biopolitical schemas, prompts,
validation, scoring, evidence, graphs, reports, exports, canonical workspace
state, visible copy, styles, browser inventory, CI sharding, worker count,
required-check names, artifact inventories, or deployment authority.

No dynamic import is introduced. Capability-gated lazy loading remains the next
separate phase after this extraction is accepted.

## Runtime observation

`Jarbou3iPlatformDiagnostics.inspect()` now exposes immutable
`renderRegions` counters. The existing application-shell browser case records
the counters before and after:

1. a density change;
2. a workspace-navigation action.

Each action must produce:

```text
shell +1
workflow +0
engine +0
review +0
```

This closes Alpha.49's remaining observational gap without adding a browser
case or changing the accepted test inventory.

## Acceptance

Alpha.50 is accepted only when:

- the entry point imports and composes `createApplicationShell`;
- shell implementation behavior is absent from `src/app.js`;
- the feature has exactly two selective `renderRegion("shell")` paths;
- the complete no-browser authority passes;
- all 360 core browser tests pass without retry-only success;
- evidence remains 26/26 with 8 hosted files and 193 visual artifacts;
- Arabic, English, and French shell behavior remains equivalent on desktop and
  mobile;
- the post-merge Pages deployment succeeds for the accepted commit.

The extraction is disproven if any analytical contract moves into the shell
feature, any shell interaction changes visible behavior, density/navigation
increments a non-shell region, focus or ARIA continuity regresses, or the
accepted CI/deployment topology changes.
