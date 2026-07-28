# Product + UI Execution Plan v1.0

**Prepared:** 2026-07-28

**Strategic source:** Strategic Product Roadmap v3.0

**Product authority:** `2.1.0-alpha.55`

**Plan state:** proposed execution authority; no product-version change

## Decision

Jarbou3i Model will evolve as one coordinated product program:

1. improve the analytical lifecycle from research through calibration;
2. replace the current experience with an Analytical Command Center;
3. preserve the existing analytical, persistence, review, revision, and export
   authorities while complete workflows migrate.

The plan is evidence-driven. Gate 0 must establish the human baseline before
Alpha.56 or the first runtime redesign milestone is frozen.

No big-bang rewrite is authorized.

## Falsifiable objective

The program succeeds only if the new experience improves task completion,
orientation, comprehension, provenance reconstruction, and review speed while
remaining visibly modern and coherent.

The direction is disproven if it:

- improves aesthetic preference while reducing task success;
- hides uncertainty, verification state, or publication blockers;
- increases navigation reversals, duplicate entry, or provenance recovery time;
- creates a second UI-owned copy of canonical analytical state;
- weakens Arabic, keyboard, screen-reader, forced-colors, reduced-motion,
  print, or narrow-screen workflows;
- adds material runtime cost without measured user benefit.

## Non-negotiable boundaries

- Strategic schema `1.1.0` remains authoritative.
- Biopolitical schema `2.1.0` and
  `biopolitical-training-map-v2` remain authoritative.
- Strategic and Biopolitical lenses remain equal consumers of shared platform
  services.
- Evidence, provenance, traceability, review, resolution, revision, recovery,
  import, and export authorities are reused rather than duplicated.
- Local-first operation remains the default.
- AI output remains a proposal until a human disposition is recorded.
- Native browser modules and static hosting remain the implementation default.
- A framework, remote font, runtime CSS library, analytics service, backend, or
  new network dependency requires measured need and a separate ADR.

Until a contract-specific migration is accepted, preserve:

- `#topicInput`
- `#analysisLang`
- `#analysisLens`
- `#promptMode`
- `#jsonInput`
- `#importBtn`
- `#exportHtml`

## Experience target

The product should feel like a professional analytical instrument:

- clear separation of source, observation, inference, proposal, disposition,
  judgment, and derived projection;
- strong location, system status, and next-action cues;
- high information density without ornamental clutter;
- progressive disclosure from orientation to exact canonical state;
- restrained motion, explicit recovery, and precise feedback;
- equal-quality light and dark themes;
- designed—not mechanically mirrored—Arabic and RTL behavior.

The desktop shell consists of a global context header, a phase navigation rail,
a primary task canvas, and a contextual inspector. Tablet collapses the
inspector to a drawer. Mobile and 400% reflow use a one-column task canvas and
full-screen sheets for complex inspectors.

## Migration architecture

The overhaul uses a strangler migration:

1. establish tokens, foundations, components, and DOM contracts;
2. replace shell and navigation;
3. build the research dossier natively in the new system;
4. migrate results, adjudication, workspace, and export workflows;
5. retire legacy styling only after parity evidence passes.

Mixed legacy/new UI may exist for no more than two accepted milestones. Every
slice must migrate a complete user task. New feature behavior must not expand
the composition root with a new multi-hundred-line rendering subsystem.

## Execution order

```text
BR-0 Authority reconciliation
→ GATE-0 Human benchmark
→ UX-0 Target-experience proof
→ UIX-1 Design-system kernel
→ UIX-2 Modern shell
→ RESEARCH-1A Case workspace
→ RESEARCH-1B Intake lifecycle
→ RESEARCH-1C Promotion continuity
→ UIX-3 Results cockpit
→ UIX-4 Operations and exports
→ COMPARE-1
→ CHALLENGE-1
→ DECIDE-1
→ CALIBRATE-1
→ PRODUCT-MODEL-1
```

Gate 0 may falsify this order. A production, security, privacy, integrity,
accessibility, or measured reliability defect may interrupt it.

## Milestone contracts

### BR-0 — Authority reconciliation

Purpose: remove stale planning authority without changing runtime behavior.

Deliverables:

- corrected capability authority map;
- this repository execution plan;
- ADR index and program-boundary decision;
- no runtime or product-version change.

Acceptance:

- version and authority checks pass;
- roadmap order is not contradicted by current-authority documents;
- the operational runtime baseline is explicit;
- `git diff --check` passes.

### GATE-0 — Human benchmark and bottleneck proof

Purpose: measure the current workflow before choosing Alpha.56 and runtime UI
scope.

Required assets:

- one fixed Strategic case and one fixed Biopolitical case;
- identical versioned task phases;
- transparent seeded failures;
- a facilitator protocol and observation taxonomy;
- a structured trial record and raw-note sheet;
- a post-task comprehension interview;
- deterministic aggregation and a bottleneck register.

At least three complete trials per lens are required. Comparable runs must use
the same script version, case version, and seed set. Raw timestamps and notes
must be preserved. Automated test results are not human productivity evidence.

### UX-0 — Target-experience proof

Produce two materially different information-architecture concepts. Test the
fixed benchmark tasks against both. The selected direction must improve
coherence without reducing task success. Prototype empty, invalid, partial,
stale, corrupt, offline, recovery, review, resolution, restore, and blocked
publication states across desktop, tablet, mobile, dark theme, and RTL.

Acceptance target: in at least 90% of benchmark tasks, first-time users identify
their location and next action within five seconds.

### UIX-1 — Design-system kernel

Create semantic tokens, themes, accessibility foundations, base controls, a
DOM-contract registry, a deterministic component harness, and AR/EN/FR visual
evidence. No analytical view, schema, persistence, or framework change is
included.

### UIX-2 — Modern shell

Deliver the first visible overhaul: global context header, responsive phase
navigation, truthful save/recovery state, strong next action, inspector
boundary, and comfortable/compact density. Do not advertise inactive future
capabilities.

### RESEARCH-1A/B/C — Research lifecycle

The dossier is a versioned workspace-level authority. It owns case framing,
scope, contested terms, research limits, source registry, observation drafts,
and completion contract. It references—not duplicates—canonical evidence and
analysis records.

The three slices deliver:

1. case workspace and completion contract;
2. source registration, observation capture, and verification lifecycle;
3. explicit promotion into current evidence/review/export authorities.

Autonomous crawling, a new backend, collaboration accounts, AI-controlled
verification, and bulk document intelligence are excluded.

### UIX-3/UIX-4 — Complete the overhaul

UIX-3 migrates results orientation, explanation, inspection, connections, and
history into the new cockpit. UIX-4 migrates review, resolution, recovery,
import/export, and publication surfaces. The visual overhaul closes before
`COMPARE-1`.

### COMPARE-1

Compare analyses semantically across evidence, scope, interpretation,
confidence, and judgment. Comparison remains distinct from revision history.

### CHALLENGE-1

Create systematic, evidence-linked challenges with explicit human dispositions.
Reject generic objection volume as a success metric.

### DECIDE-1

Bind options, the no-action baseline, lower-harm alternatives, objectives,
constraints, affected populations, trade-offs, assumptions, reversibility,
tripwires, and monitoring plans to exact analytical revisions. No option is
presented as objectively optimal without declared values.

### CALIBRATE-1

Connect forecasts and judgments to later observable outcomes. Preserve original
forecasts, provenance, small-sample warnings, and inspectable scoring.

### PRODUCT-MODEL-1

Choose—rather than presume—the future product model. Accounts, shared
workspaces, provider execution, OAuth, multi-tenant storage, and institutional
administration remain deferred until demand and a credible trust model exist.

## Continuous assurance rails

Every runtime milestone must preserve:

- observation/inference/proposal/disposition separation;
- source-to-claim traceability and uncertainty;
- recoverable authored material under storage and migration failures;
- exact-commit CI, evidence, and deployment parity;
- security, privacy, untrusted-content, and supply-chain review;
- keyboard, screen-reader, reflow, forced-colors, reduced-motion, print, and
  AR/EN/FR human review;
- measured initial bytes, interaction latency, large-case behavior, storage
  growth, and memory;
- explicit compatibility, migration, rollback, and falsification conditions.

`CI-REL-1` remains the browser reliability baseline:

- 60-second global Playwright timeout;
- one diagnostic retry, with retry-recovered tests failing CI;
- scoped 90-second timeouts for only the measured compound WebKit workflows;
- an 80-second completion ceiling;
- bounded IndexedDB operations.

Reopen reliability work if a governed workflow exceeds 80 seconds, needs a
retry, fails a bounded storage operation, or its three-run p95 exceeds 70% of
the ceiling.

## Definition of ready

Implementation does not begin until:

- the user job and current baseline are observable;
- canonical ownership and non-goals are explicit;
- at least two materially different designs are considered;
- acceptance and falsification conditions are written;
- failure, migration, and rollback paths are plausible.

## Definition of done

A milestone does not close until:

- the exact workflow and negative paths succeed;
- required human evidence meets the threshold;
- performance and reliability budgets pass;
- AR/EN/FR and accessibility evidence pass;
- exact-commit CI and deployment pass;
- limitations remain truthful;
- no duplicate authority was introduced.

## Immediate authorization

Only `BR-0 + GATE-0-SETUP` is authorized by this document. It prepares
measurement and authority assets. It does not authorize Alpha.56, runtime UI
changes, dossier schema implementation, or design-system implementation.
