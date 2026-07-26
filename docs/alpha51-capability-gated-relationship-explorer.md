# Alpha.51 — Capability-Gated Relationship Explorer

## Scope

Alpha.51 removes only the Relationship Explorer from the initial application
module graph. The graph index, report renderer, schemas, scoring, evidence,
exports, workspace persistence, and CI topology remain unchanged.

The explorer module is requested when a user activates the Biopolitical
Connections review capability. A successful request is memoized for the
session, so returning to the capability does not request or evaluate the module
again.

## Runtime contract

- Before Connections activation, `window.Jarbou3iRelationshipExplorer` is
  absent and the capability attempt counter is zero.
- First activation renders a localized live loading status and performs one
  dynamic import.
- A successful import registers and mounts the existing explorer against the
  current validated graph.
- If the user navigates away before resolution, the late import is retained but
  does not mount into a stale review surface.
- A failed import renders a localized alert and explicit retry action.
- Failure clears only the pending loader promise. Retry performs one new
  attempt; successful sessions remain memoized.
- Deactivation remains safe before, during, and after capability loading.

`window.Jarbou3iCapabilityLoads` is bounded local diagnostic state. It reports
attempts, fulfilled loads, and failures for the relationship explorer; it does
not contain analysis data.

## Falsification and acceptance

The slice is disproven if the explorer registers before capability activation,
if a revisit increments the successful-load attempt count, if late completion
mounts after navigation away, if failure is silent, or if retry cannot recover.

Acceptance also requires the existing Alpha.50.1 saved-view race stress, the
360 core browser cases, 26 evidence cases, eight hosted files, 193 visual
artifacts, no retry-only passes, and a successful post-merge Pages deployment.

This phase claims a request-level initial-load reduction equal to the
`src/relationship-explorer.js` response. It does not claim bundler chunk
minification or lazy loading of the graph and report modules.
