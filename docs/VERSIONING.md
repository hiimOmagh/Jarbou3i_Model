# Versioning Policy

## Product releases

`package.json` is the declared product-version authority during development. The matching annotated Git tag is the immutable identity of an accepted release.

Product versions use Semantic Versioning with prerelease identifiers:

```text
MAJOR.MINOR.PATCH-alpha.N
MAJOR.MINOR.PATCH-beta.N
MAJOR.MINOR.PATCH-rc.N
MAJOR.MINOR.PATCH
```

- `alpha`: incomplete or actively changing product boundary.
- `beta`: feature-complete boundary under broader validation.
- `rc`: intended release contents; only release-blocking corrections are allowed.
- no suffix: accepted stable release.

Commits do not each receive a product version. Changes accumulate under `Unreleased` until a release boundary is intentionally cut. A released tag is immutable: corrections require a new commit and version.

## Compatibility namespaces

These identities are independent of the product release:

| Namespace | Current identity | Changes when |
|---|---|---|
| Strategic schema | `1.1.0` | The Strategic canonical JSON contract changes |
| Biopolitical schema | `2.1.0` | The Biopolitical canonical JSON contract changes |
| Local workspace format | `3` | Persisted workspace compatibility changes |
| Workspace bundle | `jarbou3i-workspace-bundle@1` | Portable bundle compatibility changes |
| Review ledger | `jarbou3i-operational-review-ledger@1` | Ledger event or integrity semantics change |
| Resolution ledger | Contract-owned version | Resolution transaction compatibility changes |
| Recovery journal | `jarbou3i-editor-recovery@1` | Recovery-record compatibility changes |

A product release may change without changing any compatibility namespace. A compatibility-breaking contract change requires its own namespace change and migration or explicit rejection behavior.

## Release rules

1. Update the declared product version and generated/derived version surfaces together.
2. Run the complete no-browser and browser authorities.
3. Deploy only the exact accepted commit.
4. Run deployed evidence against the canonical production URL.
5. Create and push an annotated tag only after commit parity is confirmed.
6. Publish release notes from the changelog and link verification evidence.
7. Never move or recreate an accepted tag.

Historical version labels without a proven tag remain documentary records, not retroactively verified releases.
