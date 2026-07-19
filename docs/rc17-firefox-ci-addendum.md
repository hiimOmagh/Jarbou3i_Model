# RC 17 Firefox CI Addendum

Candidate: `2.0.0-bio-rc.17`  
Scope: Spatial saved-view test synchronization on Firefox/Linux

## Finding

GitHub Actions completed every no-browser gate and 235 of 236 browser cases. The sole failing case was the Firefox Spatial saved-view contract. The original run reached the reset orientation but did not restore the saved yaw; its retry retained the saved yaw but did not reset it. This alternating result shows that the graph and snapshot values were valid while one pointer activation was intermittently dropped during concurrent rendering.

## Remediation

RC 17 exercises orbit, save, reset, and restore through the controls' native keyboard path. Each control must own focus before Enter is pressed, and saving must expose the persisted option before the test advances. The yaw assertions remain exact; no timeout, retry, graph-count, accessibility, or behavioral requirement was relaxed.

## Acceptance

- the no-browser release gate remains green;
- the focused Firefox Spatial case passes without retry;
- the complete 236-case browser matrix passes in GitHub Actions;
- hosted and visual evidence review remain green;
- application logic and both analytical contracts remain unchanged from RC 16.
