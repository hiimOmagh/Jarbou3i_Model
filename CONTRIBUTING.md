# Contributing

Keep contributions disciplined. This is a focused analytical tool, not a general dashboard framework.

## Good contributions

- UI/RTL bug fixes
- accessibility improvements
- browser compatibility fixes
- report/export polish
- better tests
- clearer translations
- schema normalization improvements

## Avoid

- adding backend dependencies without strong justification
- adding account/login flows
- adding API-key workflows by default
- adding unrelated analysis models
- adding visual clutter

## Protected contribution workflow

`ux0-preview` is the integration branch: start contribution branches from it and target it with pull requests. Never target `main` for contributions; it is the owner-only production branch. Do not bypass required checks.

1. Start from an up-to-date `ux0-preview`.
2. Create a focused branch.
3. Make and validate one bounded change.
4. Push the branch and open a pull request targeting `ux0-preview`.
5. Resolve review conversations.
6. Keep the branch current with `ux0-preview`.
7. Merge only after `No-browser gates` and `Browser gates` pass naturally.

Example:

```bash
git switch ux0-preview
git pull --ff-only origin ux0-preview
git switch -c <type>/<short-scope>
```

Use names such as `fix/rtl-export-overflow`, `test/workspace-recovery-race`, or `docs/release-operations`. Replace placeholders with literal values; do not type angle brackets as part of a PowerShell variable or command argument.

Do not rerun a failed required check merely to obtain a green result. Capture the failure, identify whether it is deterministic, environmental, or flaky, and correct the cause in a new commit. Retry-only success is not acceptance evidence.

## Quality bar

Before opening a pull request:

```bash
npm ci
npm run test:ci:no-browser
npx playwright install --with-deps
npm run test:ci:browser
```

Use npm and the committed `package-lock.json` consistently. Do not add a second package-manager workflow. Focused tests may shorten the debugging loop, but they do not replace the complete no-browser and browser authorities before merge.

Biopolitical contract changes must update the canonical schema, generated validator, prompt template, fixtures, integrity checks, import/export tests, and documentation together. A migrated draft must never be promoted by silently filling missing fields.

For major UI changes, also complete the [manual release review](docs/operations/manual-release-review.md).

## Release boundary

Ordinary commits do not receive product versions or tags. Changes accumulate under `Unreleased` until a release boundary is intentionally accepted. Follow [Deployment and Release Operations](docs/operations/deployment.md) and the [Versioning Policy](docs/VERSIONING.md) before creating any release tag.

## Git flow

Start work from an intake row on `feature/<row>-<slug>` and open a pull request into `ux0-preview`. Do not push directly to `main` or `ux0-preview`. Keep changes within the row’s scope, update the relevant documentation and wait for both required CI checks before merging. Obtain a different-model review covering bugs, specification compliance, security and money risks; this is project policy, not a GitHub approval requirement.

Cut `release/<version>` from `ux0-preview` for a release pull request into `main`. The owner approves the release after the gates and review pass; an agent executes the merge. Use `hotfix/<slug>` from `main` for urgent fixes and back-merge released changes into `ux0-preview`. Follow the [release process](docs/operations/release-process.md) for validation, tagging and rollback.
