# Security and data — phase 0

## State in five lines

- Local workspaces and recovery use IndexedDB; preferences use localStorage (`src/core/workspace-storage.js:5`, `src/core/platform-runtime.js:17`).
- Dossiers have a separate database and export; a workspace bundle alone is not a complete case backup (`docs/decisions/0004-research-dossier-store.md:63`).
- Cloudflare's observed response enforces the restrictive `_headers` policy; the observed GitHub Pages response does not (HEAD commands below; `_headers:2`).
- `npm audit --json`: 0 vulnerabilities; this is a point-in-time dependency result, not a code security audit.
- Focused security, parser, workspace and dossier checks passed (commands and output below); no full browser suite was run.

## Findings

| ID | Severity | Evidence | Impact | Proposed fix |
| --- | --- | --- | --- | --- |
| SD-01 | P1 | `curl.exe -sSI https://hiimomagh.github.io/Jarbou3i_Model/`: HTTP 200, HSTS present, no CSP, X-Frame-Options or Referrer-Policy; Cloudflare HEAD returned CSP, X-Frame-Options DENY and no-referrer. CI deploys GitHub Pages (`.github/workflows/ci.yml:233`); `_headers:2` specifies `connect-src 'none'`. | Inferred: visitors to the GitHub origin lack important defense in depth, including network and framing restrictions; policy parity cannot be assumed. | Decide whether to retire/restrict the alternate origin or provide equivalent enforceable controls; continuously check both deployed responses. |
| SD-02 | P1 | Separate exports (`docs/decisions/0004-research-dossier-store.md:63`, `docs/decisions/0006-promotion-through-resolution.md:60`). | Inferred: restoring only a workspace bundle omits case framing, sources and excerpts. | Provide an explicit paired backup and restore workflow with a completeness check. |
| SD-03 | P2 | `docs/decisions/0006-promotion-through-resolution.md:57`: revision and pointer are separate writes; a pointer lost to reload is not rebuilt. | A committed promotion can survive while its dossier link is missing. | Reconcile recoverable pointers from committed evidence with conflict-safe, idempotent tests. |
| SD-04 | P2 | `src/core/storage-health.js:33` requests persistence but the browser decides; quota/unavailable errors are mapped in `src/core/workspace-storage.js:37`. | Inferred: local-only data remains vulnerable to browser storage removal, device loss or quota failure without an external backup. | Surface backup status and test denied persistence and recovery guidance. |
| SD-05 | P2 | Bundle uses unkeyed SHA-256 (`src/core/workspace-contract.js:10`, `:345`); dossier checksum is described at `docs/decisions/0004-research-dossier-store.md:51`. | Inferred: checksums detect accidental corruption but do not authenticate the author; an editor can recompute them. | State the trust boundary at import and add provenance/authentication only if the owner needs it. |
| SD-06 | P2 | Bundle file cap is 25 MiB (`src/app.js:11542`); case cap is 28 MiB (`src/app.js:11211`); conservative parser scans input (`src/json-parser.js:234`, `:540`). | Inferred: permitted large or adversarial inputs can still cost memory or block the UI; no resource-exhaustion measurement was made here. | Measure bounded worst-case import time/memory and reject or move expensive parsing off the UI thread if needed. |

## What is good (keep)

- The canonical Cloudflare HEAD response returned `content-security-policy: default-src 'self'; ... connect-src 'none'` and `x-content-type-options: nosniff`; `_headers:2` also restricts scripts, objects, frames and forms. This is deployment-specific evidence, not proof for other hosts.
- Import has size limits (`src/app.js:11211`, `:11542`); workspace restore verifies protected content and checksums (`src/core/workspace-contract.js:329`). Source links are restricted and escaped at `src/app.js:2038`.
- `npm run test:qa`: `Security headers, local-data boundaries, prompt isolation, and privacy disclosures passed.` `npm run test:parser`: `JSON parser checks passed.`
- `npm run test:workspace`: workspace contract, storage, editor, recovery, resolution and revision checks passed. `npm run test:dossier`: `568 assertions passed; 0 failed.`
- README explicitly identifies the external AI provider boundary and warns about sensitive material (`README.md:171`). Browser-side local storage is not a guarantee about information the user copies to a provider (`README.md:45`, `:175`).

## Proposed backlog rows

- Security | ASK | Decide supported public origins and enforce comparable restrictions | Done when a deployed-header check for every supported origin exits 0 and verifies the agreed CSP and framing policy.
- Data | ASK | Specify paired workspace/case backup semantics | Done when an automated export/restore test proves both records and links survive a clean profile.
- Data | AUTO | Recover or explicitly surface missing promotion pointers | Done when an automated interrupted-write/reload test exits 0 and verifies reconciliation without duplicates.
- Data | AUTO | Make storage and backup guidance actionable | Done when tests cover denied persistence, quota failure and the backup guidance and exit 0.
- Security | ASK | Decide whether imported files require authenticated provenance | Done when an automated import test verifies the chosen trust policy and tampering behavior.
- Reliability | AUTO | Benchmark large and adversarial imports | Done when a repeatable bounded-input test exits 0 against agreed time and memory budgets.

## Questions for the owner

1. Is GitHub Pages a supported public origin, or should users be directed solely to the canonical Cloudflare site? (`docs/operations/deployment.md:5`, `.github/workflows/ci.yml:233`)
2. Must backups establish who created them, or is corruption detection sufficient? (`src/core/workspace-contract.js:10`)

## Evidence notes

- `npm audit --json` output: `"info": 0, "low": 0, "moderate": 0, "high": 0, "critical": 0, "total": 0` (audit service result at run time).
- `curl.exe -sSI https://jarbou3i-model.pages.dev/`: `HTTP/1.1 200 OK`, CSP includes `connect-src 'none'`, `referrer-policy: no-referrer`, `x-frame-options: DENY`.
- `curl.exe -sSI https://hiimomagh.github.io/Jarbou3i_Model/`: `HTTP/1.1 200 OK`, `Strict-Transport-Security: max-age=31556952`; no CSP, X-Frame-Options or Referrer-Policy in the returned headers.
- Existing decisions and workspace docs above are context; SD-02 and SD-03 propose follow-up on documented tradeoffs, not new discoveries. `backlog.md` was absent (`rg --files ... backlog.md`: `The system cannot find the file specified`).
