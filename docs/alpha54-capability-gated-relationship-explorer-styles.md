# Alpha.54 — Capability-Gated Relationship Explorer Styles

## Scope

Alpha.54 removes `src/relationship-explorer.css` from the initial HTML request
graph. On a cold workspace it remains absent through boot, lens selection,
prompt work, accepted-analysis review, and every review capability other than
Connections. It is requested only when the relationship explorer is activated;
a persisted workspace that intentionally restores Connections may therefore
request it during restoration.

The stylesheet and the Alpha.51 explorer module form one presentation
capability. Explorer mounting waits for both resources, so the optimization
does not expose a flash of unstyled explorer content or a partially operable
surface.

## Runtime contract

- Initial HTML contains no relationship explorer stylesheet link.
- Boot, lens selection, and accepted-analysis overview do not request the CSS.
- First Connections activation requests the CSS and explorer module together.
- The explorer mounts only after both resources are fulfilled.
- Successful loading is memoized across tab revisits.
- A rejected stylesheet request removes its failed link and uses the existing
  localized relationship-capability failure surface.
- Retry creates a fresh same-origin stylesheet URL so recovery is observable
  and independent of a failed prior request.
- The link URL is resolved from `import.meta.url`, preserving the repository
  subpath used by GitHub Pages rather than assuming a root deployment.
- JavaScript failure recovery from Alpha.51 remains separately testable.

Runtime diagnostics are exposed under:

```text
window.Jarbou3iCapabilityLoads.relationshipExplorerStyles
```

The counters distinguish attempts, fulfilled loads, and failures.

## Measured boundary

The deferred stylesheet is 33,938 raw source bytes in the Alpha.53 production
tree. This is an initial-request reduction, not a gzip, transfer-size,
render-time, or total-payload claim. The stylesheet remains part of the Pages
artifact and is transferred when Connections is first opened. Together with
Alpha.51–53, the measured cumulative raw initial-request reduction is 157,758
bytes across JavaScript and CSS.

## Acceptance

1. Initial HTML and cold boot contain no explorer stylesheet link or request.
2. Lens selection and accepted-analysis overview leave style attempts at zero.
3. First Connections activation produces style counters `1/1/0`.
4. The mounted explorer has its defining `display: grid` rule applied.
5. Review-tab revisits keep style attempts at one.
6. Forced CSS failure produces the localized relationship alert and removes the
   failed link.
7. Retry restores the styled explorer with counters `2/1/1`.
8. Alpha.51 JavaScript, Alpha.52 report, and Alpha.53 graph failure/retry
   contracts remain intact.
9. The 360 core and 26 evidence tests, artifact inventories, and post-merge
   Pages deployment remain unchanged and flake-free.

The performance claim is disproven if the stylesheet is requested before
Connections activation. The presentation claim is disproven if explorer markup
mounts before the stylesheet is applied. The recovery claim is disproven if a
failed link remains authoritative or retry cannot restore the styled explorer.
