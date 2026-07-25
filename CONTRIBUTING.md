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

`main` is governed by an active repository ruleset. Do not work directly on `main` and do not attempt to bypass required checks.

1. Start from an up-to-date `main`.
2. Create a focused branch.
3. Make and validate one bounded change.
4. Push the branch and open a pull request.
5. Resolve review conversations.
6. Keep the branch current with `main`.
7. Merge only after `No-browser gates` and `Browser gates` pass naturally.

Example:

```bash
git switch main
git pull --ff-only origin main
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

Also complete `docs/visual-qa.md` manually for major UI changes.

## Release boundary

Ordinary commits do not receive product versions or tags. Changes accumulate under `Unreleased` until a release boundary is intentionally accepted. Follow [Deployment and Release Operations](docs/operations/deployment.md) and the [Versioning Policy](docs/VERSIONING.md) before creating any release tag.
