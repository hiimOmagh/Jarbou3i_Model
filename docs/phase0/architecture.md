# Architecture — Phase 0 discovery

## 1) State (5 lines)
- The codebase comprises 71 source files (48,232 lines of JS/CSS) dominated by a 12,245-line monolithic composition root (`src/app.js`) and two generated schema validators totaling 17,202 lines. Evidence: src/app.js:1-12245; src/biopolitics-schema-validator.js:1-14032.
- An architectural paradigm split exists between modern ES modules in `src/core/` and 11 root `src/*.js` modules that attach to `window` via IIFEs and load through side-effect imports. Evidence: src/ai-interchange.js:2; src/app.js:2-13,1528-1602.
- Direct circular dependencies couple core domain modules (`workspace-contract.js` <-> `review-ledger.js` and `resolution-transaction.js`), while import order is enforced via string index checks. Evidence: src/core/workspace-contract.js:3-4; tests/static-check.mjs:96-110.
- All 6 Architecture Decision Records remain in "Proposed" status despite months of production implementation, and critical platform decisions lack ADRs. Evidence: docs/decisions/README.md:8-13; docs/decisions/0001-benchmark-before-runtime-ui-migration.md:3.
- Application startup demands a 1.90 MB unminified JavaScript payload across 48 modulepreloads and 16 separate CSS stylesheets in the document head. Evidence: index.html:19-83; tests/static-check.mjs:575-582.

## 2) Findings

| id | severity | evidence (file:line or command) | impact | proposed fix |
|---|---|---|---|---|
| A1 | P1 | src/app.js:1-12245; command: `(Get-Content src/app.js \| Measure-Object -Line).Lines` -> 12245 | Monolithic composition root conflates DI, routing, state, DOM rendering for both lenses, and 1,441 lines of inline I18N; high churn hotspot. | Decompose `src/app.js` into modular presenters (`prompt/`, `workflow/`, `engine/`, `workspace/`) and reduce root entry point to <500 lines. |
| A2 | P1 | src/core/workspace-contract.js:3-4, src/core/review-ledger.js:3, src/core/resolution-transaction.js:3 | Mutual circular import between workspace storage contracts and review/resolution ledgers risks initialization order bugs and blocks code reuse. | Extract canonical serialization, hashing (`sha256`), and contract errors to a shared leaf module (`src/core/canonical-json.js`). |
| A3 | P2 | src/ai-interchange.js:2,1615, src/biopolitics.js:4811, src/app.js:1528-1602 | 11 root `src/*.js` modules attach to `window` via IIFEs rather than ES exports; contradicts documented zero-build native ES module claims. | Refactor root IIFE modules into standard ES modules with explicit named `export` declarations and explicit consumer imports. |
| A4 | P2 | tests/static-check.mjs:96-110 enforcing string index order of `import "./..."` in `src/app.js` | Implicit dependency order on global window variables is brittle; reorganizing imports breaks static check or causes silent runtime initialization crashes. | Replace side-effect window pollution with explicit ES module imports so the runtime module loader handles topological order natively. |
| A5 | P2 | docs/decisions/README.md:8-13; command: `Select-String -Path docs/decisions/00*.md -Pattern "^Status:\s*Proposed"` -> 6 matches | All 6 ADRs remain marked "Proposed" despite being fully shipped; architectural history appears provisional and undocumented. | Transition implemented ADRs (0001–0006) from `Proposed` to `Accepted` in `docs/decisions/README.md` and ADR headers. |
| A6 | P2 | docs/decisions/README.md:1-17; only 6 ADRs exist across the entire repository | Foundational platform decisions have no ADRs: zero-build ES constraint, modulepreload contract, Ajv validator code-gen, synchronous rendering. | Author ADR-0007 (Native ES Modules & Modulepreload), ADR-0008 (Static Ajv Standalone Schema CodeGen), ADR-0009 (Synchronous Region Rendering). |
| A7 | P2 | src/lenses/strategic/adapter.js:1-13, src/lenses/biopolitical/adapter.js:1-13, src/app.js:1632-1643 | Hollow lens adapters delegate back to implementations in `src/app.js`; fails to encapsulate analytical lenses and couples `app.js` to internal lens UI. | Move lens view rendering, navigation, and prompt generation into `src/lenses/strategic/` and `src/lenses/biopolitical/`. |
| A8 | P2 | index.html:36-83; 48 modulepreloads + app.js = 1,990,361 bytes (1.90 MB) across 49 requests | High cold-start network payload and JS parsing overhead on mobile/constrained devices; validator schemas alone consume 562 KB unminified. | Lazy-load schema validators on import/validate actions; evaluate production asset bundling/minification while preserving dev ergonomics. |
| A9 | P3 | docs/architecture.md:66-78; 14 modules in `src/` are missing from the Module Map | Documentation drift obscures system boundaries (e.g. `research-dossier.js`, `promotion.js`, `source-relations.js`, `command-palette.js` unlisted). | Update `docs/architecture.md` Module Map to accurately catalog all 55 active modules and reflect current feature ownership. |
| A10 | P3 | src/app.js:80-1520; `const I18N` spans 1,441 lines directly inside application entry point | Hardcodes UI copy into the composition root; inflates initial script size by 80+ KB and prevents per-locale bundle optimization. | Extract translation catalogs into dedicated locale modules (`src/locales/{ar,en,fr}.js`) and integrate with `src/core/localization.js`. |
| A11 | P3 | index.html:19-34; 16 distinct `.css` stylesheets linked in `<head>` (133.5 KB, 2,104 lines) | 16 separate render-blocking CSS network requests block First Contentful Paint and increase header overhead on HTTP/1 connections. | Consolidate component stylesheets into a single CSS bundle or entry stylesheet (`src/index.css`) with clean design token imports. |
| A12 | P2 | src/core/workspace-storage.js:5, src/core/research-dossier.js:15, docs/decisions/0004-research-dossier-store.md:63 | Dual database architecture stores workspaces and dossiers separately; independent export files risk orphaned evidence links if restored singly. | Provide a unified case archive export/import format (`Jarbou3iCaseArchive`) containing workspace, dossier, and excerpts with mutual checksums. |

## 3) What is good (keep)

- Explicit lens invariants preserved: Strategic 1.1.0 (6 sections) and Biopolitical 2.1.0 (9 pillars) maintain immutable schema authorities and read-only analytical envelopes (src/core/lens-registry.js:30-76; docs/architecture.md:83-94).
- Enforced modulepreload parity: tests/static-check.mjs:575-582 deterministically guarantees that every startup module imported by `src/app.js` is preloaded in `index.html`.
- Accessible design system kernel: src/ui/contracts.js:15-50 specifies strict programmatic validation for buttons, segment controls, modals, and status tokens.
- Transactional integrity and crash resilience: src/core/resolution-transaction.js:3-70 and src/core/recovery-journal.js:1-50 ensure atomic state transitions and journaled rollback recovery.
- Fast, comprehensive test harness: 50 Node.js contract checks (`*-check.mjs`) and 58 Playwright browser specs (`*.spec.js`) enforce zero regressions across Arabic RTL, English, and French LTR.

## 4) Proposed backlog

- architecture, AUTO, Break circular dependency between workspace-contract and review/resolution ledgers, “Done when” `workspace-contract.js` imports neither ledger and cycle detection exits 0.
- architecture, AUTO, Extract inline I18N dictionary from `src/app.js` into modular locale catalogs, “Done when” `src/app.js` imports `I18N` from `src/locales/` and `npm run test:static` exits 0.
- architecture, AUTO, Migrate root IIFE modules into standard ES module exports, “Done when” root `src/*.js` files export named bindings and window attachments are eliminated.
- architecture, ASK, Transition ADR-0001 through ADR-0006 from Proposed to Accepted, “Done when” `docs/decisions/README.md` and ADR files record Accepted status and match shipped code.
- architecture, ASK, Author foundational ADRs for zero-build ES runtime and validator code generation, “Done when” ADR-0007 and ADR-0008 are approved and committed.
- architecture, AUTO, Decompose `src/app.js` by extracting lens navigation and view presenters, “Done when” `src/app.js` is under 3,000 lines and all lens view tests exit 0.

## Target structure and safe migration proposal (inferred)

**Inferred proposal, not the current layout or an approved migration.** This refines the earlier finding/backlog suggestions: migrate by ownership seams, without a bulk rename, framework change, schema migration, or automatic ADR acceptance. Keep native ESM and offline behavior. The existing adapters accept injected services (src/lenses/strategic/adapter.js:3; src/lenses/biopolitical/adapter.js:3), the runtime already composes services (src/core/platform-runtime.js:12), and ADR-0001 describes strangler migration and canonical-state ownership (docs/decisions/0001-benchmark-before-runtime-ui-migration.md:25; docs/decisions/0001-benchmark-before-runtime-ui-migration.md:34).

Target `src/` layout (all paths below are inferred destinations, not evidence of existing directories):

```text
src/
  app.js                         # composition/wiring only
  features/
    intake/                      # input/import/prompt controllers and views
    results/                     # results navigation and presentation
    review/                      # operational review/editor UI controllers
    saved-work/                  # save/open/recovery controller and view
  lenses/
    strategic/                   # adapter, lens-owned prompt/report/validation seams
    biopolitical/                # adapter, lens-owned prompt/report/validation seams
  domain/
    workspace/                   # contracts, revisions, immutable canonical state
    review/                      # ledger shapes/verification; resolution orchestration
    dossier/                     # dossier contracts and source metadata
    evidence/                    # relations, traceability and promotion rules
  shared/                        # pure serialization, errors, value helpers; no browser I/O
  platform/                      # injected repositories, crypto, clocks/IDs, browser services
    localization/                # native-ESM catalog resources and localization service
  ui/                            # keep existing controls, contracts and styles
  generated/                     # generator-owned validators; never hand-edit
```

**Inferred dependency rules:** `app.js` wires features, lens adapters and platform implementations; features consume domain/lens APIs and `ui/`. Domain/lens code consumes pure `shared/` and injected service interfaces, never feature controllers or browser globals. Platform implements those interfaces; `shared/` imports no upper layer. Keep one canonical state/repository owner; temporary old-path re-exports delegate to that owner. Existing seams motivating these destinations: app feature imports (src/app.js:17), result services (src/app.js:22), repositories (src/app.js:1800; src/app.js:1811), dossier/evidence coupling (src/core/research-dossier.js:7), UI contracts (src/ui/contracts.js:15), and catalog injection (src/app.js:1646). SHA-256 remains an injected crypto service, not browser I/O hidden in pure shared code (src/core/workspace-contract.js:52).

**Inferred ordered slices:** acceptance checks below are future gates, not results from this documentation edit. `NEW` explicitly denotes a check to implement, not an existing file. Each row is one independently reversible PR; if a row needs smaller steps, each step must retain compatibility and its own one-PR revert. Do not begin a dependent slice until its predecessor is accepted.

| Order / slice | Evidence motivating the seam | Check that proves the slice | Rollback through one checked PR |
|---|---|---|---|
| 1. Dependency baseline + migration ADR | Legacy import-order contract: tests/static-check.mjs:96; current SCC edges: src/core/workspace-contract.js:3; src/core/workspace-contract.js:4; src/core/review-ledger.js:3; src/core/resolution-transaction.js:3. | NEW `node tests/dependency-boundaries-check.mjs --self-test`: record the exact workspace/review/resolution SCC and explicit global consumers; reject injected new cycles, forbidden edges and unknown dynamic loaders. ADR records layer rules, compatibility and acceptance evidence; existing ADR statuses require decision evidence. | Revert only the baseline/ADR PR; runtime and stored data were unchanged. |
| 2. Break workspace/review/resolution cycle | Serialization/error/hash are currently workspace exports (src/core/workspace-contract.js:15; src/core/workspace-contract.js:32; src/core/workspace-contract.js:52); resolution mixes ledger creation and workspace verification (src/core/resolution-transaction.js:76; src/core/resolution-transaction.js:113). | Extract pure serialization/error leaves, inject hashing, then separate resolution-ledger shapes/verification from transaction orchestration so workspace never imports a transaction that imports workspace. NEW `node tests/dependency-boundaries-check.mjs --no-cycles`; `npm run test:workspace`, `npm run test:review-ledger`, `npm run test:resolution`; add pre/post checksum fixtures and error-class identity assertions. Canonical immutability/tamper precedents: tests/resolution-transaction-check.mjs:63; tests/resolution-transaction-check.mjs:68. | Revert this extraction PR, restoring old imports and the exact SCC allowlist together; preserve formats, checksum bytes and error identity so no data downgrade is needed. |
| 3. Extract I18N catalog unchanged | Inline catalog: src/app.js:80; injected catalog/resolver: src/app.js:1646; fallback semantics: src/core/localization.js:35. | Move the same catalog to native-ESM `platform/localization/`, deleting the old block in the same PR. NEW catalog-parity check compares every AR/EN/FR key/value, placeholder and resolved fallback before/after; `npm run test:static`, `npm run test:platform:services`, `npm run test:platform:runtime`; run `tests/golden-prompts.spec.js` through `node scripts/run-playwright.mjs` for both lenses/languages (tests/golden-prompts.spec.js:51). | Revert this catalog PR to restore the inline object/import/preloads together; settings and translation behavior remain compatible. |
| 4. Saved-work controller/view | Repository wiring: src/app.js:1800; src/app.js:1811; open/list orchestration: src/app.js:10941; saved-work refresh: src/app.js:11308; recovery/draft/revision distinction: src/app.js:11272. | Inject canonical state and workspace/dossier/recovery repositories into `features/saved-work/`; remove the old handlers in the same PR. `npm run test:workspace`, `npm run test:dossier`, `npm run test:platform:runtime`; `node scripts/run-playwright.mjs tests/work-panel.spec.js tests/research-dossier.spec.js tests/resume-saved-work.spec.js` plus both-lens AR/EN/FR open/save/reload/export/recovery parity. | Revert this controller PR, restoring old wiring/handlers without store/key/format changes; no duplicate state owner survives. |
| 5. Service facades replacing globals | Global consumers: src/app.js:1528; src/app.js:1594; src/app.js:1602. Generators own validator output paths: scripts/generate-biopolitical-validator.mjs:53; scripts/generate-strategic-validator.mjs:38. | Migrate one consumer/service per PR behind injected facades; move prompt/report seams into their lens. Relocate validators only by updating generators/output/imports to `generated/`. `npm run test:platform:runtime`, `npm run test:strategic:integrity`, `npm run test:promotion`, `npm run test:bio:integrity`; NEW facade parity check covers both validators' success/error cases and rejects new globals. `npm run build:validator` must reproduce checked-in output. Preserve eager loading initially; any later lazy loading needs measured benefit and readiness/retry/first-use parity. | Revert that consumer/facade or generator-relocation PR, restoring its legacy binding/output path and preloads together; retain bridges until all consumers migrate. |
| 6. Modal lifecycle, one modal per PR | Workspace focus/open/close: src/app.js:11220; src/app.js:11263; preview lifecycle: src/app.js:11626; src/app.js:11639. | Consolidate open/close, initial focus, Tab/Shift+Tab containment, Escape, listener cleanup and invoker restoration in `ui/`; `node scripts/run-playwright.mjs tests/a11y-editor-dialog-trap.spec.js tests/dialog-entry-focus.spec.js tests/a11y.spec.js` plus affected both-lens AR/EN/FR journeys and human keyboard/AT parity. Native dialog is a separate optional trial, conditional on that parity. | Revert only the affected modal PR to its prior lifecycle and handlers; keep DOM IDs and data contracts stable. |

**Inferred gates for every slice:** preserve lens/schema authorities, canonical formats, approved prompt/export bytes, separate stores and recovery behavior. Update imports, static source-contract assertions and `index.html` preloads together; preload membership is checked recursively (tests/static-check.mjs:568; tests/static-check.mjs:578). Run focused parity checks and all required CI before accepting each PR; checks are acceptance evidence, not permission to relax behavior. Expand intake/results extraction only after these seams prove parity. This plan does not require bulk directory moves or performance claims from byte counts.

## 5) Questions for the owner

1. Should `src/app.js` decomposition proceed feature-by-feature (workflow, prompt, engine, review, workspace) across multiple rows, or in a single architectural refactor?
2. Are external tools or evaluation harnesses relying on global `window.Jarbou3i*` attachments, or can root modules be converted strictly to standard ES module exports?
3. Should ADR-0001 through ADR-0006 status be updated to `Accepted` in a single documentation housekeeping pass?

## PROVE IT

Child-reported (not rerun by the CEO yet): `npm run test:platform` printed "Platform architecture checks passed."

NOT VERIFIED: Full end-to-end browser execution across all browser engines was omitted to keep this pass read-only.
BASE SHA: 3b0af3fd3bcea0551f5dad1ec530b19e9826b193

SKILL EVIDENCE: deep-research: Conducted systematic multi-source structural analysis across 55 JS modules, 16 CSS stylesheets, dependency import graphs, circular references, and ADR documentation.
SKILL EVIDENCE: search-first: Investigated existing architectural patterns, standard ES module practices, and decoupled schema validation architectures across the codebase.
SKILL EVIDENCE: product-lens: Evaluated user experience and startup performance implications of a 1.90 MB unminified JavaScript payload and cold-start execution delays.
SKILLS USED: deep-research, search-first, product-lens | NOT USED: none

CEO check 2026-11-16: `wc -l src/app.js` = 12357 (child reported 12245, Measure-Object); ADR "Proposed" claim confirmed (docs/decisions/README.md:8-13); `npm run test:platform` rerun by CEO: passed.
