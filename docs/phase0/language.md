# Language — Phase 0 discovery

## 1) State (5 lines)
- Three locales are shipped: Arabic, English, and French; Arabic is RTL and English/French are LTR. Evidence: `docs/architecture.md` (invariants); `tests/ui-kernel.spec.js:15-20`.
- Localization is shared via a runtime resolver with English fallback; application copy is substantially inline in `src/app.js`. Evidence: `src/core/localization.js:9-36`; `src/app.js:5990`.
- Machine checks cover selected localization contracts and Biopolitical sample prose/codes; they cannot establish naturalness or domain terminology quality. Evidence: `tests/static-check.mjs:553-560`; `tests/biopolitical-language-check.mjs:1-3,40-59`.
- Native Arabic/French review is explicitly still owed for a broad set of shipped copy; machine review on 2026-11-16 is explicitly not native-speaker review. Evidence: `.claude/harness/STATUS.md:15-31`.
- Release review requires native linguistic review and records it as pending. Evidence: `docs/operations/manual-release-review.md:39-42,111-114`.

## 2) Findings

| id | severity | evidence (file:line or command) | impact | proposed fix |
|---|---|---|---|---|
| L1 | P1 | `.claude/harness/STATUS.md:15-31` lists numerous AR/FR items still owed; `docs/operations/manual-release-review.md:114` MAN-002 says native review pending. | Shipped wording and epistemic nuances have no recorded human native-speaker sign-off; machine checks cannot detect all awkward, ambiguous, or culturally inappropriate copy. | Batch the outstanding changed strings by surface and release; have native Arabic and French reviewers review in context, record reviewer/date/disposition, and close the release gate only after sign-off. |
| L2 | P2 | `src/app.js:5990` `labelText(en, ar, fr)`; `tests/static-check.mjs:553-560` specifically checks missing French forms for calls matching a constrained pattern. | Inline copy is hard to inventory and review consistently; the static completeness check only guards one source pattern, so other construction paths may escape it. | Build a generated inventory of user-visible strings by locale/surface and extend machine checks to all supported copy sources; keep linguistic approval separate. |
| L3 | P2 | `src/core/localization.js:9-36` explicit language catalog lookup, fallback to English and then key; `src/app.js:1647-1648` configures `SUPPORTED_LANGUAGES` and English fallback. | Missing translations can silently show English or a key in non-English UI unless a particular gate covers that path. | Add a key-level catalog completeness report for required UI surfaces and fail on unexpected fallback/key display; document intentional fallback exceptions. |
| L4 | P2 | `tests/biopolitical-language-check.mjs:40-59` checks untranslated prose heuristically; `:81-85` checks Arabic-to-Latin letter ratio; `:117-133` checks coded-token naming. | These useful structural checks are proxies; they do not assess translation accuracy, register, grammar, or terminology consistency. | Preserve checks as machine gates, label them as mechanical, and pair them with a compact native-speaker review checklist covering both lenses, prompts, errors, reports, and exports. |
| L5 | P3 | `src/core/localization.js:22-35` unknown language uses English; absent catalog values fall back to English, then the key. | Fallback behavior is deliberate and robust, but there is no evidence here that fallback occurrence is surfaced for audit. | Add a development-only diagnostic/counter for fallback use and a command that reports exercised missing keys without persisting user content. |

## 3) What is good (keep)

- One shared resolver has explicit supported-language normalization, fallback-language validation, and predictable fallback order (`src/core/localization.js:9-36`).
- The static check protects French arguments in matched `labelText` calls (`tests/static-check.mjs:553-560`).
- The Biopolitical language check examines sample translation coverage, locale identity, Arabic-script dominance, and localized coded values (`tests/biopolitical-language-check.mjs:40-69,90-106`).
- Release guidance explicitly requires natural, consistent, non-stigmatizing, directionally correct review for all three languages and records native review as pending (`docs/operations/manual-release-review.md:39-42,111-114`).
- STATUS keeps machine review distinct from native-speaker review and tracks outstanding copy, including handoff and score/meter wording (`.claude/harness/STATUS.md:13-31`).

## 4) Proposed backlog

- language, AUTO, generate a locale/surface inventory and missing-key/fallback report for UI copy, “Done when” `node <inventory-script>` emits deterministic per-locale output and exits nonzero for an unapproved missing required key.
- language, AUTO, document a native-speaker review checklist and evidence record template, “Done when” a static check confirms checklist fields for locale, surface, reviewer, date, disposition, and follow-up.
- language, ASK, schedule native Arabic and French review of STATUS outstanding strings plus both-lens prompts and exports, “Done when” release evidence records both reviewers, reviewed commit, findings, and dispositions.

## 5) Questions for the owner

1. Which native Arabic and French reviewers can sign off on the outstanding strings, and should domain terminology review be a separate pass?
2. Should new UI strings remain inline in `src/app.js`, or should a future phase move them into locale catalogs?
