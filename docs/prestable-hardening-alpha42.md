# Alpha.42 Pre-stable Hardening and Blind-Spot Register

Audit date: 2026-07-23
Baseline: production-verified `2.1.0-alpha.41` at commit `0148dfa`
Candidate: `2.1.0-alpha.42`

## Verdict

Alpha.41 had strong release evidence but still contained three contract contradictions and one durability overclaim. Alpha.42 corrects those defects without adding collaboration, accounts, remote storage, providers, OAuth, analytics, or a new analytical lens.

This candidate is not stable-release qualified until its browser authority is executed on Windows/CI and the remaining recovery work below is closed.

## Confirmed defects closed

| Severity | Defect | Evidence | Correction | Disproved if |
| --- | --- | --- | --- | --- |
| High | Strategic Resolution Transactions used a shallow container check while claiming whole-document validation | Scores outside 1–5 and missing nested required fields passed the Alpha.41 UI validator | Browser validator generated from the published Strategic schema; semantic duplicate-ID and broken-reference checks | Any schema-invalid Strategic payload can be saved or committed |
| High | Focused textarea text could bypass the dirty guard | Escape/reload inspected only the applied editor session, not raw textarea input | Pending raw input is included in close/reload guards and applied before navigation, undo, redo, or save | Focused text disappears without confirmation or remains unrepresented after section change |
| Medium | Strategic no-source prompt generated an invalid example | Template emitted `evidence_strength: 0`; schema requires 1–5 | Placeholder now uses `1`; regression test binds prompt example to the schema range | No-source prompt contains a canonical-invalid example |
| Medium | “Saved locally” obscured browser eviction and quota state | Alpha.41 never queried `persisted()`, `persist()`, or `estimate()` | Workspace dialog distinguishes persistent, best-effort, unknown, pressure, and critical storage states | Best-effort or high-pressure storage is shown as durable/healthy |

## Probable future failure sources

Probabilities are engineering ranges, not measured incident rates. They indicate likelihood during continued feature growth if the cause remains untreated.

| Priority | Failure source | Probability | Impact | Required next control |
| --- | --- | ---: | --- | --- |
| P0 | No crash-recovery journal for an in-progress editor field | 30–60% over long editing sessions | Lost work after tab/browser/OS failure | IndexedDB recovery journal with revision/draft anchoring, expiry, restore/discard UI, and interruption tests |
| P0 | No user-facing revision browser or restore transaction | 40–70% once multiple revisions accumulate | History exists but cannot practically recover a good state | Read-only revision browser; restore only by creating a new reviewed child revision, never moving history backward |
| P0 | Corrupt workspace rows cannot be exported, quarantined, or removed through the UI | 15–35% after migrations/device problems | Permanent unusable rows and user lockout | Raw quarantine export plus explicit revision-independent removal confirmation |
| P1 | Cross-tab change is discovered only during a write | 20–45% for multi-tab use | Surprise conflict and repeated work | BroadcastChannel advisory invalidation; optimistic concurrency remains authoritative |
| P1 | IndexedDB open/upgrade has no bounded `blocked` handling | 10–30% during a future database-version migration | Workspace dialog can wait indefinitely while another tab holds the old connection | `onblocked` state, timeout, close-other-tabs guidance, upgrade tests |
| P1 | Backup freshness is not recorded | 35–65% | Users believe an old export protects recent work | Per-workspace last-export timestamp and visible stale-backup policy without claiming cloud backup |
| P1 | `src/app.js` is ~6.6k lines and global styles exceed 1k lines | 60–85% of future slices causing unrelated regressions | Wide regression radius, focus/render races, costly review | Decompose by workspace, editor, ledger, resolution, and import controllers with behavior-preserving tests |
| P1 | No global `error`/`unhandledrejection` recovery boundary | 20–40% as asynchronous paths grow | Silent stuck saving states and weak diagnostics | Local error boundary that clears pending UI states and exports redacted diagnostics; no telemetry by default |
| P2 | Client timestamps are accepted without monotonic ordering | 10–25% with clock changes | Misordered audit presentation | Sequence remains authority; add monotonic display warnings and clock-skew metadata |
| P2 | Workspace `audit_events` are not hash-chained | 15–30% if more authority is attached to them | Ambiguous distinction between operational log and immutable ledgers | Either hash-chain them in a versioned migration or explicitly keep them non-authoritative |
| P2 | Local SHA-256 chains are recomputable by a local actor | Certain by design | No non-repudiation or organizational identity | Keep `local_assertion` disclosure; defer signatures/notarization until authenticated collaboration is authorized |
| P2 | CSP still allows inline styles | 20–40% impact amplifier if injection occurs | Larger XSS consequence surface | Extract inline report/style dependencies or use nonces/hashes in a later architecture slice |
| P2 | Automated AR/FR checks cannot prove human linguistic or screen-reader quality | Certain limitation | Misleading wording, RTL comprehension, AT friction | Native-speaker and assistive-technology sign-off ledger before stable `2.1.0` |
| P2 | One-shot large prompts can exceed provider output limits | 25–55% for research mode | Truncated JSON and repair loops | Capability-aware multi-stage generation after the local core stabilizes; do not add provider coupling now |

## Stable-release boundary

Stable `2.1.0` remains blocked by P0 recovery controls, full browser/visual/production validation, and human AR/FR/accessibility/epistemic sign-off. Collaboration remains deferred until local recovery semantics are reliable.

## Candidate authority

- Non-browser release chain must pass.
- Strategic integrity gate must reject malformed nested content, invalid scores, duplicate IDs, and broken links.
- Canonical editor suite grows from 2 to 5 cases per browser.
- Full browser core grows from 336 to 348 cases.
- Existing focused Resolution gate remains 8 cases.
- Hosted evidence remains 2 cases.
- Visual evidence expands to 174 screenshots and 193 artifacts so the storage-health dialog is reviewed in all 18 locale/theme/viewport intersections.

Alpha.42 is disproven if any malformed Strategic draft can be committed, focused editor text can disappear without a guard, storage is presented as persistent when the browser reports best effort, the prompt emits schema-invalid placeholder values, or any Alpha.41 authority regresses.