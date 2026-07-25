# Deployment and Release Operations

## Deployment authorities

- Canonical production: `https://jarbou3i-model.pages.dev/`
- GitHub Pages: compatibility mirror under the repository subpath
- Accepted source: the exact commit admitted to `main` by the active repository ruleset after required CI succeeds

The tracked `_headers` file is enforced by Cloudflare Pages. GitHub Pages ignores it and must not be cited as proof of the declared response-header policy.

## Required repository settings

Protect `main` with an active branch ruleset that has no bypass actors:

1. Require a pull request before merging.
2. Require the `No-browser gates` and `Browser gates` status checks.
3. Require branches to be up to date before merging.
4. Require review conversations to be resolved.
5. Block force pushes and branch deletion.
6. Keep GitHub Pages configured for **GitHub Actions**, not **Deploy from a branch**.

The CI workflow deploys the GitHub Pages mirror only after both required jobs succeed. A failed or flaky browser test blocks that deployment.

Verify the effective rules rather than relying on the legacy branch-protection endpoint:

```powershell
gh ruleset check main --repo hiimOmagh/Jarbou3i_Model
```

The expected effective rules are `deletion`, `non_fast_forward`, `pull_request`, and `required_status_checks`. The required status-check contexts are exactly `No-browser gates` and `Browser gates`, with strict/up-to-date enforcement enabled.

## Required Cloudflare settings and trust boundary

Cloudflare Pages uses Git integration with automatic production deployments from `main`. This is acceptable only while all of the following remain true:

1. The production branch is exactly `main`.
2. The active GitHub ruleset prevents direct pushes, force pushes, deletion, and bypass actors.
3. A commit can enter `main` only through a pull request after `No-browser gates` and `Browser gates` pass on a branch that is current with `main`.
4. The Cloudflare production deployment identifies the same accepted commit that entered `main`.

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

Validate both production surfaces against their deployed URLs.

Cloudflare canonical production:

```powershell
$env:PLAYWRIGHT_BASE_URL="https://jarbou3i-model.pages.dev/"
npm run test:browser:deployed
Remove-Item Env:PLAYWRIGHT_BASE_URL
```

GitHub Pages compatibility mirror:

```powershell
$env:PLAYWRIGHT_BASE_URL="https://hiimomagh.github.io/Jarbou3i_Model/"
npm run test:browser:deployed
Remove-Item Env:PLAYWRIGHT_BASE_URL
```

The evidence metadata must identify `capture_target` as `deployed`. Confirm that GitHub Pages and Cloudflare both serve the exact accepted commit before tagging. A responsive URL or passing deployed test proves functionality, not commit identity by itself.

For GitHub Pages, inspect the deployment and its terminal status:

```powershell
gh api `
  "repos/hiimOmagh/Jarbou3i_Model/deployments?environment=github-pages&per_page=5" `
  --jq '.[] | {id, sha, ref, environment, created_at}'
```

Then query the newest matching deployment ID:

```powershell
gh api `
  "repos/hiimOmagh/Jarbou3i_Model/deployments/<DEPLOYMENT_ID>/statuses" `
  --jq '.[] | {state, environment_url, created_at, description}'
```

Replace `<DEPLOYMENT_ID>` with the numeric ID returned by the first command; do not include angle brackets in a PowerShell variable assignment.

## Release freeze

Only after local acceptance, exact-commit CI, both deployed-site suites, deployment parity, and governance checks pass:

```powershell
$releaseCommit = git rev-parse HEAD
git tag -a v<version> $releaseCommit -m "Jarbou3i Model <version>"
git push origin v<version>
git show --no-patch --decorate v<version>
```

Never amend an already published release commit or move an accepted tag. Governance-only or documentation-only commits do not receive a release tag unless they are intentionally included in a separately accepted product release boundary.
