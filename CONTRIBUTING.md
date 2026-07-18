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

## Quality bar

Before opening a pull request:

```bash
npm ci
npx playwright install --with-deps
npm test
```

Use npm and the committed `package-lock.json` consistently. Do not add a second package-manager workflow. For a faster local pass while editing schema or logic, run `npm run test:ci:no-browser`; run the complete browser matrix before merging.

Biopolitical contract changes must update the canonical schema, generated validator, prompt template, fixtures, integrity checks, import/export tests, and documentation together. A migrated draft must never be promoted by silently filling missing fields.

Also complete `docs/visual-qa.md` manually for major UI changes.
