# Alpha.40 Product Audit and Blind-Spot Register

Audit date: 2026-07-22  
Baseline: production-verified `2.1.0-alpha.39`  
Candidate: `2.1.0-alpha.40`

## Executive verdict

The correct next unit was Phase 5 Slice 4: Alpha.39 could record review work but could not turn an edited draft into an approved immutable revision. Alpha.40 closes that authority gap and corrects adjacent prompt, workspace-listing, evidence-provenance, and deployment-header defects.

The candidate is not stable-release qualified. Browser execution, human visual/linguistic review, rollback/crash recovery, performance decomposition, and manual sign-off remain unresolved gates.

## Closed in Alpha.40

| Area | Prior failure mode | Correction | Falsification gate |
|---|---|---|---|
| Revision authority | Saved draft confused with approved work | Diff, validation, approval, immutable child revision | Commit without approval or valid current draft fails |
| Diff integrity | Approval could refer to a changed draft | Head/draft/repository/diff checksums rechecked | Edit after proposal returns `STALE_RESOLUTION_PROPOSAL` |
| Historical integrity | Resolution detached from revision | Chain cross-verifies parent, revision, payload, diff | Mutation fails verification |
| Review freshness | Old completion looked current after edits | Draft-checksum drift becomes stale state | Different checksum sets `is_stale` |
| Prompt boundary | Strategic prompt interpolated raw topic/context | Explicit untrusted JSON data in AR/EN/FR | Injection-like text remains serialized data |
| Output feasibility | Large prompt burden invisible | Character count and truncation-capacity warning | Preview/copy discloses burden |
| Workspace listing | Corrupt payload metadata rendered before open | Verify listings and isolate corruption | Bad checksum does not expose stored title |
| Local privacy | “Local” misread as secret | No-encryption/profile/backup disclosure | Trilingual boundary remains visible |
| Deployment security | No header-policy artifact | CSP, framing, referrer, MIME, permissions policy | Security gate requires policy tokens |
| Evidence provenance | Archive lacked internal commit identity | Full CI SHA in evidence metadata | CI metadata carries 40-hex SHA |

## Remaining blind spots

| Severity | Blind spot | Impact | Planned boundary |
|---|---|---|---|
| High until tested | Alpha.40 browser behavior is not executed here | Unit correctness does not prove focus, IndexedDB timing, WebKit, or mobile reflow | 8/8 focused and 336/336 core |
| High for recovery | No revision browser, rollback, or crash-recovery UI | Valid commits and interrupted work lack user-facing recovery | Slice 5 |
| Medium | Storage eviction, persistence, and quota state are not surfaced | “Durable” remains probabilistic under device pressure | Slice 5 storage health |
| Medium | Identity and hash chains are local/recomputable | No organizational non-repudiation | Post-local authentication/notarization |
| Medium | One-shot generation combines research, synthesis, serialization | Output remains probabilistic despite validation/repair | Provider-capability workflow after local core; native structured output where available |
| Medium | `src/app.js` and global styles remain oversized | Regression radius and startup/review cost grow | Slice 6 decomposition and budgets |
| Medium | CSP permits inline styles | XSS impact is not minimized as far as possible | Slice 6 style-token extraction |
| Medium | No retention, archive, secure-delete, or data inventory UI | Sensitive analyses can persist in shared profiles | Slice 5/6 privacy utilities |
| Low/Medium | Cross-tab conflict appears only on write | Users receive no early live warning | Slice 5 lock/channel evaluation |
| Release blocker | Human AR/FR, screen-reader, touch, zoom, print, epistemic sign-off incomplete | Automation is not human comprehension or approval | Slice 6 sign-off ledger |
| Excluded | Collaboration, accounts, remote DB, analytics, runtime CDN, 3D expansion | Premature scope multiplies authority/privacy risk | Prohibited until local recovery semantics stabilize |

## Standards alignment

- [WCAG 2.2 target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum) and [focus guidance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html) inform ≥42 px primary controls, visible focus, containment, and responsive dialogs.
- [OWASP browser-storage guidance](https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html) informs the rule that local browser storage is neither authentication nor secrecy and remains untrusted on read.
- Current structured-output guidance supports native schema constraints for capable APIs; copy/paste therefore retains deterministic validation and fail-closed repair as its authority boundary.

## Stable-release decision rule

Alpha.40 is disproven if a commit alters earlier history, a stale/invalid proposal commits, record mutation is undetected, review drift stays current, a corrupt workspace appears healthy, browser behavior diverges, or evidence cannot be tied to the exact CI commit.

Even if Alpha.40 passes, stable `2.1.0` remains blocked until Slices 5 and 6 and human sign-off are complete.
