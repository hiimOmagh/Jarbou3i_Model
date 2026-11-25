# Deployment and Release Operations

## Deployment authorities

- Only production origin (Cloudflare Pages): `https://jarbou3i-model.pages.dev/`
- Accepted source: the exact commit admitted to `main` by the active repository ruleset after required CI succeeds

The tracked `_headers` file is enforced by Cloudflare Pages. GitHub Pages deployment is retired; it is not a production origin.

## Required repository settings

Integrate feature pull requests into `develop`, then open a release pull request into `main`, following the [release process](release-process.md). The owner only approves or declines merges to `main`; an agent executes an approved merge.

Protect `main` and the `develop` integration branch with no bypass actors:

1. Require a pull request before merging.
2. Require the `No-browser gates` and `Browser gates` status checks.
3. Keep required checks at `strict: false`; branches need not be up to date before merging.
4. Require review conversations to be resolved.
5. Block force pushes and branch deletion.

CI validates commits before admission to `main`; Cloudflare Pages deploys production through its Git integration. CI does not deploy GitHub Pages.

Verify the effective rules rather than relying on the legacy branch-protection endpoint:

```powershell
gh ruleset check main --repo hiimOmagh/Jarbou3i_Model
```

The expected effective rules are `deletion`, `non_fast_forward`, `pull_request`, and `required_status_checks`. The required status-check contexts are exactly `No-browser gates` and `Browser gates`, with `strict: false`, as recorded in the release process. Check `develop` with the same command as `main`.

## Required Cloudflare settings and trust boundary

Cloudflare Pages uses Git integration with automatic production deployments from `main`. This is acceptable only while all of the following remain true:

1. The production branch is exactly `main`.
2. The active GitHub ruleset prevents direct pushes, force pushes, deletion, and bypass actors.
3. A commit can enter `main` only through an owner-approved pull request after `No-browser gates` and `Browser gates` pass; an agent executes the merge. Required checks use `strict: false`.
4. The Cloudflare production deployment identifies the same accepted commit that entered `main`.

Cloudflare must publish the curated artifact built by the retained deployment-artifact script:

- Build command: `node scripts/build-pages-artifact.mjs`
- Build output directory: `build/pages`

The artifact includes `_headers`, so the response-header policy is preserved. Serving the repository root would publish `tests/`, `docs/`, `package.json`, and every other repository file on the production origin. Verify after each settings change that `https://jarbou3i-model.pages.dev/package.json` returns the application HTML fallback rather than the package manifest, and that the `content-security-policy` response header is still present.

Under those controls, Cloudflare is downstream of the CI admission boundary: it deploys automatically only after a commit lawfully reaches protected `main`. If protection, required checks, the production branch, or bypass policy changes, automatic Cloudflare production deployment becomes untrusted and releases must stop until the control chain is restored.

Repository configuration alone cannot prove Cloudflare deployment identity. Confirm the production branch, deployment status, and commit SHA in Cloudflare before tagging.

## Local acceptance

Use Node 24 and npm:

```bash
npm ci
npm run test:ci:no-browser
npx playwright install --with-deps
npm run test:ci:browser
```

A focused or repeated test is diagnostic evidence only. It does not replace either complete acceptance command.

## Exact-commit CI acceptance

After the pull request is merged, record the candidate commit and inspect all runs associated with that exact SHA:

```powershell
$releaseCommit = git rev-parse HEAD

gh run list `
  --commit $releaseCommit `
  --limit 10 `
  --json databaseId,workflowName,status,conclusion,headSha,url
```

Do not rerun a failed workflow merely to obtain a green result. Diagnose and correct the defect in a new pull request. The accepted run must naturally succeed for the exact candidate SHA.

## Deployed acceptance

Validate the Cloudflare production origin against its deployed URL.

Cloudflare canonical production:

```powershell
$env:PLAYWRIGHT_BASE_URL="https://jarbou3i-model.pages.dev/"
npm run test:browser:deployed
Remove-Item Env:PLAYWRIGHT_BASE_URL
```

The evidence metadata must identify `capture_target` as `deployed`. Confirm in Cloudflare that production serves the exact accepted commit before tagging. A responsive URL or passing deployed test proves functionality, not commit identity by itself.

## Release freeze

Only after local acceptance, exact-commit CI, the deployed-site suite, Cloudflare deployment identity, and governance checks pass:

```powershell
$releaseCommit = git rev-parse HEAD
git tag -a v<version> $releaseCommit -m "Jarbou3i Model <version>"
git push origin v<version>
git show --no-patch --decorate v<version>
```

Never amend an already published release commit or move an accepted tag. Governance-only or documentation-only commits do not receive a release tag unless they are intentionally included in a separately accepted product release boundary.
