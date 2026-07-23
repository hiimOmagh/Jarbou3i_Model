# Deployment and Release Operations

## Deployment authorities

- Canonical production: `https://jarbou3i-model.pages.dev/`
- GitHub Pages: compatibility mirror under the repository subpath
- Accepted source: the exact commit that passed required CI

The tracked `_headers` file is enforced by Cloudflare Pages. GitHub Pages ignores it and must not be cited as proof of the declared response-header policy.

## Required repository settings

Protect `main` in GitHub:

1. Require a pull request before merging.
2. Require the `No-browser gates` and `Browser gates` status checks.
3. Require branches to be up to date before merging.
4. Block force pushes and branch deletion.
5. Keep GitHub Pages configured for **GitHub Actions**, not **Deploy from a branch**.

The CI workflow deploys the GitHub Pages mirror only after both required jobs succeed. A failed or flaky browser test blocks that deployment.

## Required Cloudflare setting

Cloudflare’s Git integration can deploy a push independently of GitHub Actions. Disable automatic production deployment from unaccepted `main` pushes, or change the production branch to a dedicated release branch that is advanced only after CI acceptance. This external setting is a release gate and cannot be enforced by repository code alone.

Until that setting is confirmed, a green GitHub workflow proves code acceptance but does not prove that Cloudflare was prevented from deploying an earlier unaccepted push.

## Local acceptance

Use Node 24 and npm:

```bash
npm ci
npm run test:ci:no-browser
npx playwright install --with-deps
npm run test:ci:browser
```

## Deployed acceptance

PowerShell:

```powershell
$env:PLAYWRIGHT_BASE_URL="https://jarbou3i-model.pages.dev/"
npm run test:browser:deployed
Remove-Item Env:PLAYWRIGHT_BASE_URL
```

The evidence metadata must identify `capture_target` as `deployed`. Confirm the deployed commit in Cloudflare before tagging.

## Release freeze

```powershell
$releaseCommit = git rev-parse HEAD
git tag -a v<version> $releaseCommit -m "Jarbou3i Model <version>"
git push origin v<version>
git show --no-patch --decorate v<version>
```

Never amend an already published release commit or move an accepted tag.
