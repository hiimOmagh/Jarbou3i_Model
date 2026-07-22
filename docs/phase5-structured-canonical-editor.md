# Phase 5 Slice 2 — Structured Canonical Editor

Release: `2.1.0-alpha.36`

The editor operates only on `working_draft.canonical_payload`. Imported and committed revisions remain immutable. Every saved draft receives a new checksum and exactly one optimistic repository-revision increment.

## Delivered contract

- Lens-aware top-level canonical section navigation.
- JSON-typed structured values without string coercion.
- Immediate parse and contract/integrity validation.
- Immutable analysis identity fields.
- Bounded 100-state undo/redo history.
- Dirty-state indication and unload/close protection.
- Explicit local draft save with optimistic conflict rejection.
- Strategic and Biopolitical draft support in Arabic, English and French.
- Keyboard application (`Ctrl/Cmd+Enter`) and save (`Ctrl/Cmd+S`).
- Idempotent field application across keyboard and deferred blur/change events, preserving Undo/Redo history in WebKit.

## Alpha.36 correction

Alpha.35 exposed a WebKit event-ordering defect: after explicit keyboard application, a deferred textarea `change` event could run after Undo, reapply the previous field text, and clear the redo stack. The editor now records the last rendered/applied field text and ignores duplicate change delivery. The browser authority explicitly requires Redo to become enabled after Undo and verifies the restored canonical value before saving.

This slice does not commit a canonical revision. Resolution transactions remain Phase 5 Slice 4.
