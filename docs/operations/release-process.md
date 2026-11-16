# Release process

Take each intake row through implementation, integration and owner-approved release.

## Integrate a change

Create `feature/<row>-<slug>` from `ux0-preview` for the intake row. Implement its acceptance criteria, update documentation and open a pull request into `ux0-preview`. Do not push directly to `main` or `ux0-preview`. Require green `No-browser gates` and `Browser gates`, plus a different-model review covering bugs, specification compliance, security and money risks. Resolve findings, merge and verify integration push CI.

## Publish a release

Cut `release/<version>` from accepted `ux0-preview`. Check `package.json`, update the changelog and record compatibility risks. Version `2.1.0-alpha.57` needs no bump. Run `npm ci`, `npm run test:ci:no-browser` and `npm run test:ci:browser`, then complete the [manual release review](manual-release-review.md). Open a pull request into `main` with the evidence and different-model review. The owner merges after both checks pass. Tag the accepted commit with the matching version, verify the main push and Pages deployment, then back-merge main into `ux0-preview` through a gated pull request.

## Verified branch protection

Verified on 2026-11-16 using these commands:

```bash
gh api repos/hiimOmagh/Jarbou3i_Model/branches/main/protection
gh api repos/hiimOmagh/Jarbou3i_Model/branches/ux0-preview/protection
```

Both branches require `No-browser gates` and `Browser gates`, enforce rules for administrators, and disable force pushes and deletion. Both require zero approving reviews. Different-model review is project policy, not an enforced GitHub approval. Required checks have `strict: false`.

Sources: [main protection](https://api.github.com/repos/hiimOmagh/Jarbou3i_Model/branches/main/protection) and [ux0-preview protection](https://api.github.com/repos/hiimOmagh/Jarbou3i_Model/branches/ux0-preview/protection).

## CI coverage

The [workflow](../../.github/workflows/ci.yml) runs on `pull_request` and pushes to `main` and `ux0-preview`. No-browser gates generate validators and run the static, schema, contract, security, persistence, language and architecture checks selected by `test:ci:no-browser` in package.json. Fifteen core browser shards cover Chromium, Firefox, WebKit and mobile Chromium after that job succeeds. Browser evidence captures hosted and visual-audit evidence. Browser gates requires the whole core matrix and evidence job to succeed. Pages deploys only on a successful main push. See [CI operations](ci.md) for commands and artifacts.

## Hotfix and rollback

Create `hotfix/<slug>` from main. Submit a pull request into main with the same gates and review, obtain owner merge, tag the accepted fix and back-merge it into `ux0-preview` through a pull request.

For rollback, identify the last accepted release and offending changes. Preserve exported workspace data before testing an older build. Revert the changes on a hotfix branch through a reviewed pull request, run complete gates, obtain owner merge and verify deployment. Back-merge the correction and record affected versions in the changelog. Do not reset or force-push protected branches.

Read the [format-2 rollback warning](../release-notes-draft-format2-rollback.md) before reverting dossier support: format-1-only builds cannot read format-2 cases. Preserve those cases and restore a compatible build if needed. The cap revert in a67f2f8 did not change storage compatibility.
