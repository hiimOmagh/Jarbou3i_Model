# ADR-0001 — Benchmark Before Runtime UI Migration

- **Status:** Proposed
- **Date:** 2026-07-28
- **Decision owners:** Product and engineering
- **Related work:** `BR-0`, `GATE-0`, `UX-0`, `UIX-1` through `UIX-4`

## Context

Jarbou3i Model has strong analytical, evidence, review, recovery, revision, and
export authorities. Its current experience is visually and structurally
inconsistent, while the composition root and primary stylesheet concentrate
significant migration risk.

A visually ambitious rewrite could conceal uncertainty, duplicate canonical
state, or improve preference while reducing task success. Automated tests can
prove contracts and regressions, but they cannot establish analyst productivity
or comprehension.

## Decision

Run a fixed, versioned human benchmark before freezing Alpha.56 or beginning
runtime UI migration.

Use a strangler migration after benchmark and prototype acceptance:

1. design-system kernel;
2. application shell;
3. research lifecycle;
4. results cockpit;
5. operations and exports;
6. legacy-style retirement after parity.

UI components project existing canonical state. They do not own independent
copies of analyses, evidence, review events, resolutions, revisions, or
exports.

## Alternatives considered

### Big-bang rewrite

Rejected. It couples visual, behavioral, state, persistence, localization,
accessibility, and export risks and lacks a safe rollback boundary.

### Restyle the current monolith

Rejected as the target architecture. It can change appearance quickly but
would deepen composition-root and selector coupling, making roadmap work slower.

### Framework migration first

Rejected. No measured problem currently proves that a framework is required,
and migration would add runtime and compatibility scope before user value is
measured.

### Benchmark and incremental migration

Selected. It creates falsifiable priorities and lets each accepted slice retain
a working product and rollback path.

## Consequences

- Gate 0 setup changes no runtime code or product version.
- The first six comparable trials use the same English task script, case
  versions, and seed sets.
- AR/FR extension trials are reported as separate strata, not mixed into the
  English baseline.
- The benchmark may reduce or reorder the planned redesign.
- Runtime UI work requires two competing prototypes and explicit authority
  ownership.
- Mixed legacy/new UI is limited to two accepted milestones.

## Falsification

Reconsider this decision if the benchmark instruments cannot produce reliable
comparable observations, or if measured workflow friction is immaterial and a
smaller correction dominates the expected benefit of the overhaul.
