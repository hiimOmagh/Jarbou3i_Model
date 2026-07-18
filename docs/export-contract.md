# Export Contract — 1.4.0-bio-alpha.4

## Shared guarantees

Every HTML report carries app and lens metadata, and every analysis can also be downloaded as lossless JSON. The imported analysis language—not the current interface language—sets the report root language and direction.

```html
<meta name="app-version" content="1.4.0-bio-alpha.4">
<meta name="analysis-lens" content="strategic|biopolitical">
<main data-analysis-lens="strategic|biopolitical"
      data-app-version="1.4.0-bio-alpha.4">
<section data-export-contract-lens="strategic|biopolitical">
<script type="application/json" id="canonical-analysis">…</script>
```

Arabic analyses use `lang="ar" dir="rtl"`; English and French analyses use `dir="ltr"`. Machine contract values remain locale-independent.

## Biopolitical report

```html
<meta name="analysis-contract" content="biopolitical-training-map-v2">
<meta name="schema-version" content="2.1.0">
<main data-analysis-contract="biopolitical-training-map-v2"
      data-schema-version="2.1.0">
```

The human report includes all nine pillars, calibrated conclusion, localized 18-item audit, migration and publication blockers, and a complete canonical-contract appendix. The embedded JSON payload is semantically identical to the imported normalized analysis; `<` characters are JSON-escaped to prevent script termination.

The JSON download is the authoritative lossless transport for verification, re-import, and archival. The HTML view is a readable projection plus the same machine payload.

## Strategic report

Strategic export preserves its own report title and six-layer chain. It must not be emitted through the Biopolitical renderer. Its HTML also embeds the normalized Strategic analysis payload and offers a JSON download.

## Browser proof

- `tests/export-contract.spec.js`: lens identities.
- `tests/export-completeness.spec.js`: sentinel coverage across previously omitted high-value fields and JSON equivalence.
- `tests/cross-locale-export-contract.spec.js`: three analysis languages and both lenses.
- `tests/lens-import-contract.spec.js`: imported-lens authority and legacy disclosure.
