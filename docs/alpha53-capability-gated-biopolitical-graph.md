# Alpha.53 — Capability-Gated Biopolitical Graph Module

## Scope

Alpha.53 removes the biopolitical graph module from the application entry-point
graph. The module remains absent through initial boot, lens selection, and
prompt work. It is requested only when an accepted biopolitical analysis enters
the review capability.

This boundary is intentionally earlier than the Connections tab. The graph is
the shared authority for canonical reference labels, inspection indexes,
connection counts, the relationship explorer, and lossless HTML reporting.
Rendering any of those surfaces without it would create a degraded parallel
path rather than a valid lazy-loading boundary.

## Runtime contract

- Initial application boot does not request `src/biopolitics-graph.js`.
- Selecting the Biopolitical lens without an analysis does not request it.
- The first accepted biopolitical analysis loads and registers the graph once.
- Later review renders and capability visits reuse the fulfilled promise.
- A rejected dynamic import blocks graph-dependent review with a localized,
  accessible failure state instead of rendering unresolved canonical data.
- Retry uses a same-origin query suffix so browser module-map rejection caching
  cannot make recovery cosmetic.
- Late completion cannot replace a review belonging to a different analysis or
  lens.

Runtime diagnostics are exposed under:

```text
window.Jarbou3iCapabilityLoads.biopoliticalGraph
```

The counters distinguish attempts, fulfilled loads, and failures.

## Measured boundary

The deferred source module is 18,916 bytes in the release tree. This is a raw
initial-request reduction, not a gzip, transfer-size, parse-time, or total
application-payload claim.

## Acceptance

The existing browser inventory must prove:

1. The graph global is absent and the attempt count is zero at initial boot.
2. Selecting the Biopolitical lens alone leaves the attempt count at zero.
3. Loading an accepted sample produces counters `1/1/0`.
4. Connections, inspection, and export consumers preserve canonical behavior.
5. Forced graph import failure produces the localized alert.
6. Retry restores the complete review and produces counters `2/1/1`.
7. Alpha.51 explorer and Alpha.52 report-renderer boundaries remain independent.
8. The 360 core and 26 evidence tests, artifact inventories, and post-merge
   Pages deployment remain unchanged and flake-free.

The performance claim is disproven if the module is requested before a
biopolitical analysis enters review. The resilience claim is disproven if retry
cannot recover. The correctness claim is disproven by any graph, inspection,
reference, explorer, export, evidence, or localization regression.
