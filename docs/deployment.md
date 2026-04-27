# Deployment Notes

## GitHub Pages

1. Push this folder to a GitHub repository.
2. Go to **Settings → Pages**.
3. Use **Deploy from branch**.
4. Select branch `main` and folder `/root`.
5. Save and wait for the Pages URL.

## CI

The repository includes a Playwright smoke-test workflow at:

```text
.github/workflows/ci.yml
```

It runs on pushes and pull requests.

## Public release checklist

- [ ] README reviewed
- [ ] License selected deliberately
- [ ] Security notice reviewed
- [ ] GitHub Pages deployment works
- [ ] CI passes
- [ ] Visual QA checklist completed
- [ ] Arabic/English exports inspected
