# Alpha.43 — Strategic Sample Recovery and Workspace Controls

## Decision

Alpha.42 remains rejected. Alpha.43 is a new immutable candidate because the runtime-generated Strategic samples violated the schema that Alpha.42 newly enforced.

## Confirmed root cause

All Arabic, English, and French Strategic samples omitted `source_url`, `source_date`, `source_type`, and `evidence_strength` from their evidence record. Their three authored links also supplied the obsolete `confidence` field instead of required numeric `strength`. The canonical validator correctly rejected each sample before the UI could enter Review.

The old sample click handler had no failure boundary. A synchronous validator exception therefore appeared to users as a button that did nothing and provided no diagnostic evidence.

## Corrections

- All three runtime samples now validate against Strategic v1.1 before release.
- A dedicated AR/EN/FR runtime-sample gate checks the actual factory, not only fixture files.
- Sample failures stop safely and expose a copyable diagnostic record with operation, code, JSON path, message, version, timestamp, and correlation ID.
- Successful pasted-result imports are redisplayed as deterministic two-space canonical JSON.
- The workspace manager offers separate guarded controls to remove the current workspace or reset all app data.
- Destructive controls require a second activation within eight seconds.
- Current-workspace deletion uses optimistic revision protection.
- Full reset clears both IndexedDB workspaces and persisted application preferences.

## Security and data boundaries

Diagnostics contain contract paths and error messages but no automatic network submission. Reset remains local. The application does not claim encryption, external identity, remote backup, or rollback guarantees.

## Residual risks intentionally not hidden

1. Crash recovery for text that has never reached a workspace write is still absent.
2. Revision browsing and explicit restore transactions remain absent.
3. Corrupt records are isolated but cannot yet be exported to quarantine or selectively removed from the UI.
4. Cross-tab changes are still discovered at write time rather than announced immediately.
5. IndexedDB upgrade blocking has no bounded recovery UI.
6. Backup freshness is not tracked.
7. `src/app.js` remains an oversized composition root; splitting it safely requires characterization tests before relocation.
8. Provider output truncation remains possible even with prompt-size warnings.
9. Human AR/FR linguistic review, screen-reader review, and epistemic review remain release responsibilities.

These are candidates for the next recovery slice. They are not silently presented as closed by Alpha.43.

## Release falsifiers

Alpha.43 is disproven if any of the following occurs:

- A runtime Strategic sample fails in any supported language.
- Load sample does not reach Review and produce a verified local workspace.
- A reset action occurs after only one activation.
- Reset leaves a workspace record behind.
- A malformed or corrupted import is presented as healthy.
- Successful imported JSON is not rendered deterministically.
- Any previously closed editor, ledger, resolution, export, localization, accessibility, or security contract regresses.
