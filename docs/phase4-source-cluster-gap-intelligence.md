# Phase 4, Slice 2 — Source Cluster and Gap Intelligence

Release: `2.1.0-alpha.32`

## Outcome

This slice turns authored evidence metadata into transparent source clusters and review-oriented coverage signals across Strategic and Biopolitical analyses. It is a read-only projection layered on the Alpha.28 canonical relationship registry.

## Deterministic source identity

Evidence records are clustered by the strongest authored identity available:

1. exact normalized HTTP or HTTPS URL;
2. exact normalized source title plus locator;
3. exact normalized source title only;
4. a record-specific missing-identity cluster.

The runtime never performs external lookup, fuzzy matching, publisher inference, DOI resolution, scraping, or source enrichment. Records without source identity are intentionally kept separate so absence cannot create a false cluster.

Each cluster reports its evidence members, citing records, identity basis, traceable count, declared-verification count, source dates, counter-evidence coverage, and confidence distribution.

## Coverage signals

The shared engine exposes objective authored-data signals for:

- missing source identity;
- title-only source identity;
- evidence not cited by another canonical record;
- missing authored counter-evidence;
- missing or explicitly unknown source date;
- sources that are not traceable under the existing provenance assessment;
- multiple evidence records sharing one exact source identity.

These are review prompts, not truth scores. Concentration does not prove dependence, a missing citation does not make evidence false, and counter-evidence coverage does not decide the underlying claim.

## Interface

The Inspection directory now includes a collapsible Source clusters and evidence gaps workspace. It provides compact cluster, citation, and coverage metrics; complete source-cluster membership; and localized gap groups. Every evidence item remains keyboard-navigable into the existing accessible inspector.

The surface supports English, Arabic RTL, French, light/dark themes, comfortable/compact density, forced colours, reduced motion, and 320 px reflow.

## Compatibility boundary

No schemas, prompts, imports, migrations, scoring, readiness, publication gates, canonical JSON, standalone reports, relationship semantics, or stored analysis data are modified. Biopolitical schema `2.1.0` and `biopolitical-training-map-v2` remain authoritative. No live provider, backend, OAuth, or source connector is added.

## Verification

- `npm run test:evidence:intelligence` validates exact clustering, missing-identity separation, citation counts, traceability, concentration, counter-evidence, dates, and immutability.
- `tests/results-inspection.spec.js` validates the complete localized cluster/gap surface and record navigation across all browser projects.
- Static, QA, source-of-truth, CI-contract, accessibility, and hygiene gates include the new module.

The browser core contains 276 cases after this slice: the previous 272 plus one Source Cluster and Gap Intelligence scenario across four browser projects.
