# ADR-0003 — One Self-Hosted Typeface: Readex Pro

- **Status:** Proposed
- **Date:** 2026-10-21
- **Decision owners:** Product owner
- **Amends:** the kernel's "system fonts only" rule (`src/ui/kernel.css`, ADR-0002)
- **Related work:** user feedback point 1 (visual identity), the Transit Line restyle

## Context

User feedback said the app looked like many AI products. The chosen direction,
the Transit Line, sets every role (display, labels, data) in one type family
and builds hierarchy from size and weight. The system stack draws a different
face on each platform (Segoe UI, San Francisco, Roboto, and an unrelated Arabic
fallback), so the look cannot be held. The app is Arabic-first and trilingual,
so the face must cover Arabic and Latin as one design.

## Decision

- Use **Readex Pro**, a variable font (weight 160–700). Its Arabic and Latin
  are drawn as one family, it was designed for reading, and its licence is
  SIL OFL 1.1.
- Serve it from the site: `assets/fonts/`, three WOFF2 files (Arabic 22.9 KB,
  Latin 31.4 KB, Latin Extended 27.7 KB), from `@fontsource-variable/readex-pro`
  5.3.0. Each file loads only when its script is on the page (`unicode-range`),
  with `font-display: swap`. The licence ships beside the files
  (`assets/fonts/OFL.txt`).
- No remote font hosts: the CSP stays `default-src 'self'`. The system stack
  stays behind it as the fallback.
- Code (JSON, prompts, paths, ids) keeps a monospace stack.

## Consequences

- A first visit downloads at most about 82 KB of font, usually one or two
  files. Text shows at once in the fallback face, then swaps.
- Weights above 700 do not exist; the kernel uses 400–700.
- Exported HTML reports do not embed the font. They use the fallback stack,
  which keeps each report a single small file.
