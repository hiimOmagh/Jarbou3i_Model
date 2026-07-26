# Alpha.52 — Capability-Gated Biopolitical Report Renderer

## Scope

Alpha.52 removes the standalone biopolitical report renderer from the
application entry-point graph. The renderer is requested only when a user
activates the biopolitical HTML report download. Strategic reporting, canonical
JSON export, the review workspace, the relationship graph, and the Alpha.51
explorer boundary remain unchanged.

## Runtime contract

- Opening the application or the biopolitical Exports tab does not request
  `src/biopolitical-report.js`.
- The first HTML report request loads and registers the renderer exactly once.
- Later report downloads reuse the fulfilled capability promise.
- A rejected dynamic import resets the promise and presents a localized,
  accessible failure state.
- Retry uses a same-origin query suffix so a browser-cached rejected module-map
  entry cannot make recovery cosmetic.
- The HTML download begins only after the renderer is available.

Runtime diagnostics are exposed under:

```text
window.Jarbou3iCapabilityLoads.biopoliticalReportRenderer
```

The counters distinguish attempts, fulfilled loads, and failures.

## Measured boundary

The deferred source module is 34,369 bytes in the release tree. This is a raw
initial-request reduction, not a gzip, transfer-size, parse-time, or full
capability-payload claim.

## Acceptance

The existing browser inventory must prove:

1. The renderer global is absent and the attempt count is zero before export.
2. Opening Exports alone leaves the attempt count at zero.
3. First HTML export loads and fulfills exactly once.
4. Returning to Exports and downloading again does not reload the module.
5. Forced import failure produces the localized alert.
6. Retry produces a valid download with counters `2/1/1`.
7. Complete canonical HTML and JSON contracts remain lossless.
8. The 360 core and 26 evidence tests, artifact inventories, and post-merge
   Pages deployment remain unchanged and flake-free.

The performance claim is disproven if the module is requested before HTML
export. The resilience claim is disproven if retry cannot recover. The
correctness claim is disproven by any canonical export or evidence regression.
