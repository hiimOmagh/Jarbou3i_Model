# Phase 2 — Premium Application Shell

Release: `2.1.0-alpha.17`

## Scope decision

Phase 2 begins with the shared application frame. It does not redesign analytical results, alter either lens contract, or move the later results-workspace program forward prematurely.

The first slice establishes:

- a coherent global header with live lens context;
- explicit Set up → Model → Review workspace navigation;
- a truthful local-processing status;
- comfortable and compact density modes with conservative persistence;
- section hierarchy shared by Strategic and Biopolitical analysis;
- skip navigation, keyboard activation, reduced-motion handling, RTL composition, forced-colours support, and narrow-screen reflow.

## Shell state boundary

Display density and current shell section are presentation state only. They cannot enter, mutate, or be exported with canonical analysis payloads. Density is the only new persisted preference. Current section remains session-local.

The Review destination is unavailable until an analysis exists. This prevents the shell from advertising an empty result surface as a functional destination.

## Visual system

The application frame now distinguishes three layers:

1. Product identity and global controls.
2. Workspace position and privacy posture.
3. Analytical panels and lens-specific content.

The shell uses restrained surfaces and orientation accents. Existing result components remain unchanged so visual changes cannot conceal analytical regressions.

## Preserved invariants

- Strategic v1.1 and Biopolitical v2.1 schemas are unchanged.
- Prompt, sample, import, scoring, evidence, graph, judgment, and export behavior is unchanged.
- Arabic, English, and French remain first-class shell languages.
- Light, dark, comfortable, compact, keyboard, reduced-motion, forced-colours, print, and 320 px reflow remain supported.
- No framework, network service, tracking, font download, or runtime dependency is added.

## Acceptance gates

```powershell
npm ci
npm run test:ci:no-browser
npm run test:browser:core
npm run test:browser:hosted
npm run test:browser:visual-audit
```

Phase 2 may proceed to deeper responsive-navigation and command-surface refinement only after this shell slice passes the complete browser and visual matrix.
