# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary:** curious everyday readers who want to understand a topic that seems complicated (a policy, a conflict, a technology, a public-health measure) and widen their point of view beyond one narrative.
- **Also:** researchers and academics, journalists and fact-checkers, policy and NGO analysts, and students. They use the same flow and care most about sources, evidence and exportable reports.
- The interface opens in Arabic by default and is fully available in English and French; the analysis language is chosen separately.

## Product Purpose

Turns a question about a complicated topic into a structured, checkable analysis made with the user's own AI assistant. The workbench writes the prompt, the user pastes it into any assistant, pastes the answer back, and the workbench imports it, repairs what it safely can, says what is missing, and lets the reader explore the result as a case file, a model map and a report.

Success: a reader who started confused can say who wants what, how they pursue it, what evidence supports each claim, and what would change the conclusion.

## Positioning

- Works with any AI assistant the user already has; no account, no API key, no server. Everything is processed locally in the browser.
- Two analytical lenses: **Strategic** (interests → actors → tools → narrative → results → feedback) and **Biopolitical** (how bodies, institutions, data and classifications become governed, and who bears the costs; Jarbou3i Training Map 2.1).
- Evidence-traceable by design: every claim links to evidence records, the AI's own self-assessment is shown as its claim, not as verification, and publication readiness stays blocked until the evidence supports it.
- Arabic-first and trilingual (AR/EN/FR), right-to-left as a first-class layout.

## Operating Context

- A five-step guided setup (topic, lens, settings, prompt, answer), then a review phase: case file with an outline, model map, connections view, evidence and inspection, exports (HTML report, JSON, print).
- Users switch between this tab and an AI assistant's chat tab; prompts are copied out and long answers are pasted in, sometimes in several continue rounds.
- Workspaces, revisions, a canonical editor, a review ledger and resolution commits live in the browser's IndexedDB.
- Used on desktop and on phones; density (comfortable/compact) and light/dark themes are user choices.

## Capabilities and Constraints

- Static site (index.html + src/*.js + src/ui/*.css), deployed on Cloudflare Pages; no network calls at runtime, no remote fonts, no framework without an ADR (docs/decisions/).
- UI is built on a CSS design-system kernel: `j-` classes registered in src/ui/contracts.js, kernel selectors scoped with `.j-`.
- Every label exists in AR/EN/FR; wording changes apply to all three.
- Quality gates: Playwright suite on Chromium, Firefox, WebKit and mobile Chrome (CI fails on flaky tests), axe checks, a visual-audit evidence suite, and node contract checks.
- Open decision: how the product will be commercialized (planned later; no pricing, tiers or service defined).

## Brand Commitments

- Name: **Jarbou3i** (Jarbou3i Model). Fixed.
- Mascot: the jerboa character (assets/jarbou3i-mascot-192.png, -512.png; favicon and touch icon), also the guide beside the setup steps. Fixed; a new identity builds around it.
- Voice: plain, concrete, calm; says what the AI claimed versus what is verified; no hype.

## Evidence on Hand

- Built-in sample analyses in both lenses and three languages (fixtures/), real AI replies used for testing (outside the repo), visual-audit screenshots (visual-audit-evidence-local/), and a Remotion tutorial video draft (separate project, unpublished).
- None of: testimonials, user counts, press, partnerships, pricing. Do not invent them.

## Product Principles

1. Clarity for a newcomer first; depth on demand for experts.
2. Show the evidence and its limits; never present the AI's claims as verified facts.
3. The user's own assistant, the user's own device: privacy and independence by default.
4. Arabic, English and French are equal citizens, including right-to-left.
5. One primary action at a time; nothing on screen without a job.

## Accessibility & Inclusion

WCAG 2.2 AA: 4.5:1 text contrast in both themes, 44px touch targets, full keyboard use with visible focus, screen-reader names and live regions, reduced-motion support, reflow at 320px, and RTL parity.
