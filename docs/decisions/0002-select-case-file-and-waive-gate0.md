# ADR-0002 — Select the Case File Concept and Waive the Gate 0 Benchmark

- **Status:** Proposed
- **Date:** 2026-10-10
- **Decision owners:** Product owner
- **Amends:** [ADR-0001](0001-benchmark-before-runtime-ui-migration.md) (benchmark
  precondition only; its migration order and canonical-authority boundaries stand)
- **Related work:** `GATE-0`, `UX-0`, `UIX-1`, `UIX-2`

## Context

ADR-0001 makes a fixed human benchmark (Gate 0) the precondition for runtime UI
migration, and UX-0 asks for two concepts tested against that benchmark.

The UX-0 prototype (`prototypes/ux-0/`, branch previews only) built both
concepts: A, mission control, and B, case file. It runs the app's own import
chain, publication gate, saved workspaces and report renderer. The product
owner tested it with real prompts and real AI answers in both lenses. Pasted
AI answers now import only when canonical, so the new UI starts with no legacy
import paths.

## Decision

- Concept **B, case file**, is the target experience: one document in the
  reader's order, with the location and the single next step first.
- The Gate 0 human benchmark and the UX-0 A-versus-B trial are **waived** by the
  product owner. They are not run before migration.
- **UIX-1, the design-system kernel, and UIX-2, the modern shell, are
  authorized**, under ADR-0001's boundaries:
  - strangler migration;
  - no framework or remote fonts without an ADR;
  - UI projects canonical state and never owns copies of it.
- **The app is rebuilt to the UX-0 prototype's structure** (product owner,
  2026-10-10), one screen at a time, each replacing the old view and its tests:
  1. the guided flow, as the setup phase;
  2. the case file, UIX-3, brought ahead of RESEARCH-1;
  3. the work panel: save light, where the work is, lifecycle banners.

## Consequences

- UX-0's acceptance target (90% of first-time users find their location and
  next action within five seconds) is **unmeasured**. No release note or
  document may claim it.
- The Gate 0 kit (`docs/benchmarks/gate-0/`) stays and can still be run. A run that
  shows B reducing task success reopens this decision.
- Every later milestone keeps its definition of done (AR/EN/FR, accessibility,
  reliability and CI evidence). Only the human-benchmark evidence is waived.
