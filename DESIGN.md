---
name: Jarbou3i Model
description: A trilingual analysis workbench drawn as a transit diagram, an analysis you ride station by station.
colors:
  platform-white: "#f8f8f6"
  enamel-white: "#ffffff"
  platform-grey: "#efefeb"
  raised-enamel: "#e8e8e3"
  hairline: "#dcdcd6"
  rail-grey: "#7c8088"
  ink: "#15171b"
  ink-hover: "#33363d"
  ink-muted: "#4a4f57"
  ink-faint: "#5e636b"
  signal-blue: "#1f5bc4"
  signal-blue-deep: "#174a9f"
  signal-wash: "rgba(31, 91, 196, .09)"
  ok-green: "#17733f"
  warn-amber: "#8a5300"
  crit-red: "#c8262a"
  line-1-red: "#d62b2b"
  line-2-blue: "#1f5bc4"
  line-3-yellow: "#e9a21a"
  line-4-green: "#1d8a4e"
  line-5-purple: "#7a3f9e"
  line-6-ink: "#15171b"
  line-7-orange: "#d9621c"
  line-8-teal: "#0f8a8f"
  line-9-brown: "#8b5e34"
  midnight-enamel: "#0f1b30"
  midnight-panel: "#142440"
  midnight-panel-2: "#1a2b48"
  midnight-raise: "#203457"
  midnight-hairline: "#2a3e62"
  midnight-rail: "#6f82a6"
  porcelain: "#f2f0ea"
  porcelain-muted: "#bbc4d4"
  porcelain-faint: "#9ca9bf"
  porcelain-hover: "#d9dce4"
  night-signal: "#8db2f5"
  night-signal-strong: "#b3ccf8"
  night-ok: "#4cc383"
  night-warn: "#f2b33d"
  night-crit: "#ff7a70"
  night-line-1-red: "#ee5248"
  night-line-2-blue: "#5e8fea"
  night-line-3-yellow: "#f2b33d"
  night-line-4-green: "#3db06e"
  night-line-5-purple: "#b37fe0"
  night-line-7-orange: "#f08a4b"
  night-line-8-teal: "#36b9bf"
  night-line-9-brown: "#c49561"
typography:
  display:
    fontFamily: "Readex Pro, Segoe UI Variable Display, Segoe UI, system-ui, -apple-system, Helvetica Neue, Noto Sans Arabic, Geeza Pro, sans-serif"
    fontSize: "36px"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Readex Pro, Segoe UI Variable Display, Segoe UI, system-ui, sans-serif"
    fontSize: "28px"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Readex Pro, Segoe UI Variable Display, Segoe UI, system-ui, sans-serif"
    fontSize: "22px"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  station-name:
    fontFamily: "Readex Pro, Segoe UI Variable Text, Segoe UI, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 700
    lineHeight: 1.35
  body:
    fontFamily: "Readex Pro, Segoe UI Variable Text, Segoe UI, system-ui, -apple-system, Helvetica Neue, Noto Sans Arabic, Geeza Pro, Tahoma, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.55
    fontFeature: "tnum"
  label:
    fontFamily: "Readex Pro, Segoe UI Variable Text, Segoe UI, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 700
    lineHeight: 1.3
  code:
    fontFamily: "ui-monospace, Cascadia Code, SF Mono, JetBrains Mono, Consolas, Noto Sans Arabic, monospace"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.55
rounded:
  r-1: "4px"
  r-2: "10px"
  r-3: "16px"
  pill: "999px"
spacing:
  s-1: "4px"
  s-2: "8px"
  s-3: "12px"
  s-4: "16px"
  s-5: "24px"
  s-6: "32px"
  s-7: "48px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.platform-white}"
    rounded: "{rounded.pill}"
    padding: "0 16px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.ink-hover}"
  button-secondary:
    backgroundColor: "{colors.enamel-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 16px"
    height: "44px"
  button-secondary-hover:
    backgroundColor: "{colors.raised-enamel}"
  button-ghost:
    textColor: "{colors.ink-muted}"
    rounded: "{rounded.pill}"
    height: "44px"
  input:
    backgroundColor: "{colors.enamel-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.r-2}"
    padding: "12px"
    height: "44px"
  segmented-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.platform-white}"
    rounded: "{rounded.pill}"
    height: "38px"
  phase-current:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.platform-white}"
    rounded: "{rounded.pill}"
    height: "44px"
  chip:
    textColor: "{colors.ink-muted}"
    rounded: "{rounded.pill}"
    padding: "0 8px"
    height: "22px"
  card:
    backgroundColor: "{colors.enamel-white}"
    rounded: "0 0 10px 10px"
    padding: "32px"
  station:
    backgroundColor: "{colors.enamel-white}"
    textColor: "{colors.ink}"
    rounded: "50%"
    size: "34px"
---

# Design System: Jarbou3i Model

## Overview

**Creative North Star: "The Transit Line"**

An analysis is a line you can ride. Each layer of the model is a station, each link an interchange, and the reader's place is always ringed. The system borrows the Beck/Vignelli transit diagram: a platform-white ground, enamel panels, ink text and plates, and one colour per line of the model, each colour always printed beside its name. The dark theme is the same map on midnight enamel, never black with neon.

Density is comfortable by default (a compact setting halves card padding) and every control keeps a 44px target in both. Hierarchy comes from size and weight in one typeface, never from labels stacked over headings. Structure is drawn with thick ink rules and tracks, not with boxes, glows or shadows.

The interface is Arabic-first and equally English and French. Every direction-sensitive value uses logical properties, so right-to-left is the same layout mirrored, not a variant.

**Key Characteristics:**
- One typeface, Readex Pro, for Arabic and Latin; code alone in monospace.
- Ink plates mark the current phase, the selected segment and the one primary action.
- 3px ink rules open cards, briefs, dialogs and the header instead of card borders.
- Stations: rings with a 4px edge; the current one gets a second ring, in its line's colour on the model map and in ink everywhere else.
- The model map is one continuous line whose stretches are as long as the record counts.
- Light "daylight map" and dark "midnight enamel" themes carry the same tokens.

## Colors

A neutral daylight ground with ink as the dominant accent, one interaction blue, and nine line colours that only ever mark a layer of the model.

### Primary
- **Ink** (light `ink`, dark `porcelain`): text, the primary-action pill, the current-phase plate, the selected segment, ink rules, station edges and the ridden track. In dark mode ink inverts to porcelain and its text to midnight enamel.
- **Signal Blue** (`signal-blue`, dark `night-signal`): interaction only: links, focus rings, record IDs, the reader's current outline entry (as `signal-wash`), meter fills, input focus edges.

### Secondary: the lines of the model
- **Line colours** (`line-1-red` to `line-9-brown`, dark `night-line-*`): one per layer. The six Strategic layers use lines 1 to 6 (line 6 is ink); the nine Biopolitical layers add orange, teal and brown. Set per element as `--j-layer` by the app. They never mark anything else: the current setup step, outline entry and chosen option are ringed in ink, since line 1 red sits beside the critical red.

### Tertiary: status
- **Ok Green, Warn Amber, Crit Red** (`ok-green`, `warn-amber`, `crit-red`, dark `night-*`): verdicts and notes, each with a matching wash at 8 to 14% for note backgrounds. Always paired with a shape and words.

### Neutral
- **Platform White** (`platform-white` / `midnight-enamel`): the page ground.
- **Enamel White** (`enamel-white` / `midnight-panel`): panels, fields, station fills.
- **Platform Grey** (`platform-grey` / `midnight-panel-2`): counts, check rows, table heads.
- **Raised Enamel** (`raised-enamel` / `midnight-raise`): hover fills, toasts, menus.
- **Hairline** (`hairline` / `midnight-hairline`): 1px dividers and quiet borders.
- **Rail Grey** (`rail-grey` / `midnight-rail`): secondary button edges, unridden stations, chip edges.
- **Ink Muted / Ink Faint**: secondary text and help text; both hold 4.5:1 on their grounds.

### Named Rules
**The Name Beside the Colour Rule.** A line colour never stands alone: its layer's number and name are always printed beside it. Status uses colour plus shape plus words, never colour alone.

**The One Blue Rule.** Signal blue means "you can act here" or "you are here". It is never decoration and never a fill for a primary action; the primary action is ink.

**The Same Map Rule.** The dark theme is the daylight map re-enamelled: same roles, midnight surfaces, porcelain ink. Never pure black, never neon.

## Typography

**Display Font:** Readex Pro (fallback Segoe UI Variable Display, system-ui, Noto Sans Arabic, Geeza Pro)
**Body Font:** Readex Pro (fallback Segoe UI Variable Text, system-ui, Noto Sans Arabic, Tahoma)
**Code Font:** ui-monospace stack (Cascadia Code, SF Mono, JetBrains Mono, Consolas)

**Character:** One variable family (weight 160 to 700, OFL-1.1) drawn for Arabic and Latin together, self-hosted as three woff2 subsets in `assets/fonts/` that load by `unicode-range` with `font-display: swap` (ADR-0003). No remote fonts. Exported HTML reports do not embed it and fall back to the system stack.

### Hierarchy
- **Display** (700, 36px, 1.1, -0.02em): the setup step's heading; 28px under 720px.
- **Headline** (700, 28px, 1.15, -0.015em): card and section-of-page headings; 22px under 720px.
- **Title** (700, 22px, 1.25, -0.01em): case-file section headings, brief headings, dialog and inspector titles.
- **Station name** (700, 16px, 1.35): map stations, layer heads, record titles.
- **Body** (400, 14px, 1.55, tabular figures): all running text; ledes and heads cap at 60 to 72ch. Step leads run at 18px.
- **Label** (700, 13px, 1.3, sentence case): names for values and groups, status text, chips at 12px/600.
- **Code** (13px or 12px): JSON answers, prompts, paths, IDs only. JSON stays left to right in every language.

The eight sizes are 12, 13, 14, 16, 18, 22, 28 and 36px; do not add others.

### Named Rules
**The 700 Ceiling Rule.** Weights run 400 to 700. Nothing heavier exists in the font, and nothing heavier is asked for.

**The One Family Rule.** Display, labels, data and body are all Readex Pro; monospace is reserved for what is literally code. Data uses the UI face with tabular figures.

**The Sentence Case Rule.** Labels are sentence case at normal tracking. No uppercase spaced labels, and no small label above a heading.

## Layout

A single page column with a sticky side rail where the content earns it. Spacing follows a 4px-based scale (`s-1` to `s-7`); cards pad 32px with 24px gaps (16px and 12px when compact or under 620px).

- **Setup flow:** a 260px guide rail (mascot, speech, the five step stations as a vertical line) beside the step. Under 900px the rail stacks above and the stations run across in five columns.
- **Model map:** one line. Below 901px, and for the nine Biopolitical layers at any width, it runs down: a station per row with its name beside it and a stretch below it of 8px plus 6px per record (capped at 96px). Above 900px the six Strategic layers ride across, columns sized by record count from a 128px floor. From 621px the layer description sits in a third column. The phone treatment (one column of stations rather than "one station per screen") awaits user confirmation.
- **Case file:** a 292px sticky outline beside the document. At 1120px and below it stacks; at 940px the outline becomes three tile columns, at 760px two, and a floating return button brings it back.
- **Breakpoints in use:** 420, 620, 720, 760, 900, 940, 1120px.
- **Direction:** logical properties throughout (`inset-inline-*`, `border-block-start`, `margin-inline-*`). Only drawn icons marked to flip are mirrored in RTL.
- Reflow holds at 320px.

## Elevation & Depth

Flat at rest. Depth comes from tone (platform, enamel, raised enamel) and from ink rules, not from shadow. One shadow exists, used only for things that float over the page: toasts, dialogs, the display menu, the skip link once focused and the case-file return button. Modals sit over a scrim with a 6px backdrop blur.

### Shadow Vocabulary
- **Float** (light `0 12px 32px rgba(21,23,27,.14), 0 2px 6px rgba(21,23,27,.08)`; dark `0 16px 40px rgba(3,8,18,.5), 0 2px 6px rgba(3,8,18,.3)`): floating layers only.
- **Station halo** (`0 0 0 3px <ground>, 0 0 0 7px <line colour or ink>`): not depth; the second ring of the current station, drawn as a solid ring with a gap.

### Named Rules
**The Rule Not Box Rule.** A section, brief, record or dialog opens with a thick ink rule across its top (3px for cards, briefs and dialogs, 2px for records) and has no side or bottom border. If something needs grouping, give it a rule, not a box.

**The No Glow Rule.** No glows, no gradients, no coloured side stripes. Focus thickens an edge; it is never a halo.

## Shapes

Rounds and rules. Pills (999px) for every button, segment, chip and phase; 10px for fields, notes, options and small tiles; 16px for map steps, layer panels, choices and the bottom of dialogs; 4px for keys and code chips. Cards and dialogs square their top corners under the ink rule and round only the bottom. Stations are true circles with a 4px edge (`--j-station`); tracks are 6px (`--j-track`) and the map's line 8px. Chevrons are drawn from two 2px borders; icons are 18px stroked SVG (1.75 stroke, round caps), never glyphs.

## Components

### Buttons
- **Shape:** pill (999px), 44px min height, 16px inline padding; 52px tall at 16px text for the large size; square 44px for icon-only.
- **Primary:** an ink plate with platform-white text, the line's own name plate. One per view.
- **Secondary:** enamel fill, 2px rail-grey edge, 700 weight; hover turns the edge ink and the fill raised.
- **Ghost:** transparent, muted text; hover fills raised enamel.
- **Danger:** crit-red text and a 55% crit edge; filled with the crit wash only on hover.
- **Press:** scale to .98 over 120ms. Disabled at 45% opacity.

### Segmented control and phases
- **Segmented:** a pill track with a 1px rail-grey edge; the chosen segment is an ink plate. Used for language and density.
- **Phase nav:** three phases as pills with a 14px station ring; the current phase is an ink plate with a filled station. Forced colours map it to Highlight/HighlightText.

### Chips and status
- **Chip:** 22px pill, 1px rail edge, 12px/600 muted text; a tone recolours text and edge, never fills.
- **Status:** 13px/700 text after a shape: ok is a dot, warn a triangle, crit a square, idle a ring.

### Cards / Containers
- **Corner Style:** square top, 10px bottom.
- **Background:** enamel white.
- **Border:** none, except the 3px ink rule across the top.
- **Shadow Strategy:** none (see Elevation & Depth).
- **Internal Padding:** 32px comfortable, 16px compact.
- The setup step has no card at all; it sits on the platform.

### Inputs / Fields
- **Style:** 2px ink edge, 10px radius, enamel fill, 12px padding, 44px min height. Answers set in code at 13px.
- **Focus:** edge turns signal blue plus a 1px signal ring (`--j-glow`, an edge, not a halo).
- **Error:** crit-red edge with `aria-invalid`.

### Navigation
- **Header:** an enamel bar closed by a 3px ink rule: mascot, Jarbou3i wordmark (18px/700 with a 2px rail divider), title and lead. Controls collapse to icons under 900px and density/theme move into a Display popover. The lead hides on phones so the topic field shows first.
- **Case outline:** a vertical line of 16px stations; entries before the current one are ridden in ink, the current one is washed in signal and double-ringed in ink.

### Stations (signature)
The shared device of the system. A ring with a 4px edge on enamel, a two-digit number inside when it is a code. Unridden stations and track are rail grey at 45%; done stations are filled ink; the current station keeps an ink edge and wears a second ring (3px gap, then 4px of colour). Used by the setup steps, the outline, the model map, layer heads, the how-to list, the chosen option and the first ride. The line moves only to say what happened: when a setup step is done its ink runs on to the next station (0.32s); when an analysis arrives (import or sample, not a reopen) the outline draws itself from the top and the brief's bars fill from where a line starts (about 0.9s). Instant under reduced motion.

### Model map (signature)
One line through all layers: an 8px stretch in the layer's colour from each station to the next, ending at a 26px terminus ring. Stretch length is set by the layer's record count so the lengths compare. The layer open in the case file gets an ink edge on its 16px-radius step and a doubled ring in its line colour.

### First ride (signature)
A first visit's route map above the setup: the trip's three stops (ask, your AI writes, check) on one 8px ink line with 38px stations, the first double-ringed with a "You are here" ink tag, ending at a 30px terminus for the report. Each stop gives its time and one line of what happens. Two doors (the ink pill starts the topic, the outline pill opens the example) and an underlined Skip at the top end, first in focus order. The line runs across beside the heading on wide screens, under it below 900px, and down below 620px. Its one motion: the line draws itself from the first stop, each station ringing as the ink reaches it (about 0.7s); leaving folds it away in 240ms. Under reduced motion both are instant. It shows once, for a visitor with no settings kept; "How it works" beside "Load sample" brings it back.

The example door rides the sample: a card floats at the foot of the view at the inline end (spanning the foot on phones), on raised enamel under a 3px ink rule with the float shadow. It holds the 40px mascot beside the stop's name and one line of what it is for, then "Next stop" (ink pill), "Leave the ride" (ghost) and, at the inline end, four 12px stations ridden in ink with "1 of 4". The place it stops at (the verdict brief, the model map, the first evidence record, the export) wears a 3px ink outline 10px out, which closes in from 24px as the ride arrives. Nothing behind is dimmed; Esc in the card leaves; the last stop ends on the export.

### Records and briefs
A record sits under a 2px ink rule with no box: ID in signal (12px), title (16px/700), text (14px/1.6), then a facts grid. Briefs, claims, figures and the publication verdict sit under 3px ink rules; an uncertainty's rule turns warn amber. A record that opens the inspector turns its rule signal blue on hover.

### Dialogs and inspector
Every modal opens under the 3px ink rule with a 16px bottom radius and the float shadow. The inspector is a 560px side sheet at the inline end (a bottom sheet on phones) with head, scrolling body and a two-button footer. In-text references are 10px-radius chips washed in signal (evidence washed in ok) with a 44px hit area.

## Do's and Don'ts

### Do:
- **Do** use `j-` classes and `--j-*` tokens, and register any new control in `src/ui/contracts.js`.
- **Do** open a new section or panel with a 3px ink rule (`--j-rule`) instead of a border box.
- **Do** make the one primary action an ink pill, and the current state (phase, segment, station) an ink plate or a double ring.
- **Do** print a layer's number and name next to its line colour, and pair every status colour with a shape and words.
- **Do** give every focusable element a 3px signal outline at 2px offset, and every target 44px.
- **Do** write directional styles with logical properties, and check every label in AR, EN and FR.
- **Do** map ink plates to system colours (ButtonText/ButtonFace or Highlight/HighlightText) under `forced-colors: active`.
- **Do** mirror any colour change in `src/report-theme.js`; exported reports carry the tokens as text.

### Don't:
- **Don't** add glows, gradients, text shadows or coloured side stripes.
- **Don't** put a small or uppercase label above a heading.
- **Don't** use weights above 700, a second typeface, or monospace for anything that is not code.
- **Don't** make the dark theme black with neon accents; it is midnight enamel.
- **Don't** use a line colour as decoration, or signal blue as a fill for the primary action.
- **Don't** use typed characters (×, ☾, ▸) as icons; draw them as SVG or from borders.
- **Don't** add shadows to resting surfaces; the float shadow is for layers over the page.
- **Don't** add new raster imagery without recording its provenance. The only shipping rasters are the jerboa mascot PNGs (`assets/jarbou3i-mascot-192.png`, `-512.png`, plus favicon and touch icon), which predate the Transit Line build and were not changed by it.
