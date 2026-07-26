# Alpha.50.1 — Firefox saved-view race

## Scope

Alpha.50.1 closes the single nondeterministic Firefox failure observed after
Alpha.50. The affected saved-view journey filled `#relationshipSearch`, but a
full explorer render could replace that control from the older `state.query`
value before the browser assertion observed the draft.

This correction does not change analytical schemas, graph semantics, saved-view
storage, evidence, scoring, imports, exports, localization, the Alpha.50
application-shell extraction, or the accepted CI topology.

## State authority

The live relationship-search control is authoritative immediately before a
full explorer render. The render boundary commits its value into `state.query`
before replacing the command surface.

Intentional query transitions remain authoritative and bypass live-draft
capture:

- mounting an analysis;
- restoring a saved view;
- resetting the relationship map;
- revealing or focusing a selected hidden record.

Search-only result updates still preserve the existing command-bar DOM and do
not invoke a full render.

## Regression authority

The existing saved-view browser case now deterministically models the failed
ordering by placing a newer value in the live input and immediately triggering
a full depth render. It verifies that:

- the live draft survives both full renders;
- the normal input path still saves and restores the query;
- reset still clears the query;
- the test inventory remains unchanged.

Targeted Firefox stress command:

```powershell
node scripts/run-playwright.mjs tests/relationship-explorer.spec.js `
  --project=firefox `
  --workers=2 `
  --repeat-each=20 `
  --retries=0 `
  --grep "analysis-scoped saved views restore and delete presentation state"
```

Alpha.50.1 is disproven if any repetition loses the live draft, an explicit
reset or restore is overridden by stale DOM state, the full browser/evidence
inventory changes unexpectedly, or any retry-only pass occurs.
