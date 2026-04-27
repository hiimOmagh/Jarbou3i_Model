# Deployment Notes

## GitHub Pages

1. Push this folder to a GitHub repository.
2. Go to **Settings → Pages**.
3. Use **Deploy from branch**.
4. Select branch `main` and folder `/root`.
5. Save and wait for the Pages URL.

## Required release checks

Run before pushing a release:

```bash
npm install
npm run test:static
npx playwright install --with-deps
npm test
```

`npm run test:static` is the fast gate. It checks JavaScript syntax, duplicate DOM IDs, manifest integrity, optimized image references, and absence of removed legacy export/self-check paths.

`npm test` runs the static gate first, then the Playwright browser flow.

## CI

The repository includes a GitHub Actions workflow at:

```text
.github/workflows/ci.yml
```

It runs on pushes and pull requests.

## Public release checklist

- [ ] README reviewed
- [ ] Changelog includes `1.1.0` analytical rigor upgrade
- [ ] License selected deliberately
- [ ] Security notice reviewed
- [ ] GitHub Pages deployment works
- [ ] `npm run test:static` passes
- [ ] Full CI passes
- [ ] Visual QA checklist completed
- [ ] Arabic, English, and French UI inspected
- [ ] Arabic RTL exported HTML report inspected
- [ ] Mobile width around 390 px inspected
- [ ] Runtime images load from optimized assets, not the 2048 px source file

- [ ] Formal schema exists at `schema/strategic-analysis.schema.json`
- [ ] Fixture validation passes with `npm run test:fixtures`
- [ ] Research mode prompt is manually tested with one fresh topic
