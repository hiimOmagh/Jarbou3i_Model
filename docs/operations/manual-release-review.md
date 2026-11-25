# Manual Release Review

Automation establishes structural safety. It cannot certify linguistic nuance,
screen-reader comprehension, visual hierarchy, touch comfort, or epistemic
honesty. This checklist is the human sign-off for those dimensions before a
public release. It complements, and never replaces, the automated gates in
[Continuous Integration](ci.md) and [Deployment and Release Operations](deployment.md).

## What automation already covers

- **Release matrix** (`tests/release-audit-matrix.spec.js`): every interface
  language (Arabic, English, French) and theme (light, dark) on every browser
  project, with standard and reduced motion. Each case checks Axe
  serious/critical findings, labels, selection semantics, duplicate IDs, page
  overflow, rejection of an unsupported future schema, valid sample recovery,
  relationship presentation, and a theme-neutral print palette. A separate case
  checks keyboard focus on every engine and forced-colors visibility in Chromium.
- **Reflow** (`tests/reflow-audit.spec.js`): 640 px and 320 px viewports as
  200% and 400% zoom equivalents across languages and themes.
- **Visual evidence** (`npm run test:browser:visual-audit`): deterministic
  screenshots of the shell, import audit, Strategic and Biopolitical results,
  Connections, review ledger, resolution transaction, workspace health, and the
  standalone report surfaces, across languages, themes, and desktop/tablet/phone
  viewports, checked by `tests/visual-audit-evidence-review-check.mjs`.
- **Hosted evidence** (`npm run test:browser:hosted`, or
  `npm run test:browser:deployed` against a deployed URL).

## Severity

| Level | Meaning | Release action |
| --- | --- | --- |
| Blocker | Data loss, inaccessible core task, false analytical claim, unusable locale, or broken export | Must fix before release |
| Major | Important task is confusing, materially incomplete, or difficult for a user group | Fix or obtain explicit release exception |
| Moderate | Noticeable friction with a workable alternative | Fix when practical and record disposition |
| Minor | Cosmetic or editorial polish | May defer with rationale |

## Linguistic and directional review

For Arabic, English, and French, review the shell, prompts, validation and
import messages, the nine-pillar protocol, Connections modes, the evidence
inspector, judgment, and exports in both themes. Confirm terminology is accurate,
natural, consistent, non-stigmatizing, and directionally correct. Arabic
mixed-direction IDs, dates, percentages, and citations must remain readable.

## Native assistive technology

| Environment | Required journey |
| --- | --- |
| NVDA + Firefox or Chrome | Change language and lens; import; traverse review; inspect evidence; export |
| JAWS + Chrome or Edge | Same core journey |
| VoiceOver + Safari | Same core journey, including the Spatial fallback |
| TalkBack + Android Chrome | Mobile list, inspector sheet, filters, and export |

Confirm headings and landmarks, radio groups, tabs, accordions, status messages,
modal focus, inspector focus return, relationship names, edge explanations, and
the disabled-Spatial explanation.

## Visual review

Run `npm run test:browser:visual-audit` and inspect the screenshots in
`visual-audit-evidence-local/`:

- clipping, overlap, truncation, contrast, hierarchy, density, and RTL mirroring;
- header controls wrap without overlap at phone width;
- evidence rows, score rings, and review tabs remain usable;
- no meaning is encoded by color alone, and scenario-probability colors do not
  read as quality or error states;
- names stay primary and canonical IDs secondary.

## Reflow and physical interaction

The automated 320 px / 640 px matrix is a proxy. Confirm with native browser
zoom at 200% and 400% in at least Chrome and Firefox. On a physical touch device,
check target comfort, scroll containment, inspector dismissal, focus mode, the
Spatial fallback, and the absence of accidental drag or page lock.

## Print and export

Review Strategic and Biopolitical HTML exports in all languages. Inspect print
or PDF preview from both themes in a Chromium browser and in Safari/WebKit.
Confirm readable light print colors, complete canonical metadata, named
references, the relationship atlas, temporal and comparative limits, and that no
hidden controls or clipped content appear.

For a long real-world report, also confirm that analytical readiness is not
mistaken for publication approval, every supplied HTTP(S) source opens from its
evidence record, collapsed sections remain keyboard-operable, the complete
canonical payload is available on demand, no assistant `cite`/`filecite`/`turn`
marker or private-use glyph is visible, and print expands authored sections
without forcing an oversized section onto one page.

## Epistemic integrity

For every visual mode, confirm that displayed nodes, edges, time bands,
comparisons, confidence, and evidence status trace to authored canonical
records. No layout, proximity, 3D depth, animation, or visual prominence may
imply an unauthored causal or normative claim.

## Release assets

- The header logo uses `assets/jarbou3i-mascot-192.png`; the welcome card uses
  `assets/jarbou3i-mascot-512.png`; the favicon uses `assets/favicon-32.png`.
- The Apple touch icon exists and the manifest icon preview works.

## Finding register

Record each finding as Pass, fixed and reverified, or explicitly accepted with
impact, owner, and rationale. A release is eligible only when every required
row has one of those dispositions.

| ID | Surface / locale / theme / viewport | Severity | Finding | Evidence | Owner | Disposition |
| --- | --- | --- | --- | --- | --- | --- |
| MAN-001 | Native assistive technology | Major | NVDA, JAWS, VoiceOver, and TalkBack journeys are not yet recorded. | Assistive technology table above | Human QA | Pending |
| MAN-002 | Linguistic and epistemic nuance | Major | Native Arabic, French, and English terminology review and the authored-relationship trace review are not yet recorded. | Linguistic and epistemic sections above | Human domain reviewer | Pending |
| MAN-003 | Physical zoom, print, and touch | Major | Native 200%/400% zoom, print/PDF preview, and physical touch-device review are not yet recorded. | Reflow, print, and interaction sections above | Human QA | Pending |
| MAN-004 | Long-form report / all locales | Major | Progressive disclosure, source navigation, portable citations, truthful publication status, and long-report print output need human review in Chromium and Safari/WebKit. | Print and export section above | Human QA + domain reviewer | Pending |

## Release evidence records (PM104-I)

The finding register above remains authoritative for MAN-001–004. The block
below attaches metadata to those same findings; it does not close any finding.
Null fields mean no review has been recorded. Do not infer a reviewer, date,
reviewed SHA, native completion, or waiver from machine checks or release tags.

For an actual review, record the full reviewed commit SHA, reviewer identity,
reviewer type (`machine`, `native`, or `waiver`), ISO date, evidence location,
and disposition. Each locale/surface entry also needs its reviewed SHA and
evidence location. Native evidence must include a traceable human attestation
in `authorization`; a scoped waiver must cite the explicit approved release
exception there and use `Accepted` with `impact` and `rationale`. A waiver
accepts outstanding risk; it does not certify native review. Machine evidence
belongs in automated gate reports and cannot close these human obligations.
The checker validates recorded claims, not the authenticity of a person's
identity: the release reviewer must inspect the linked attestation and scope.

Run `node tests/release-evidence-check.mjs --self-test` for structural and
negative-fixture checks. Run `node tests/release-evidence-check.mjs --strict`
at the release candidate SHA. The record commit itself is expected: a reviewed
SHA stays current only while this file is the sole change since that commit.
Pending, missing dispositions, stale coverage,
and machine-only closure block release. Any relevant copy or surface change
requires review at the new SHA; never carry an old pass forward automatically.

```release-evidence
[
  {
    "id": "MAN-001", "reviewedSha": null, "reviewerType": null,
    "reviewer": null, "date": null, "disposition": "Pending",
    "evidence": null, "authorization": null,
    "coverage": [
      { "locale": "ar", "surface": "Native assistive technology" },
      { "locale": "en", "surface": "Native assistive technology" },
      { "locale": "fr", "surface": "Native assistive technology" }
    ]
  },
  {
    "id": "MAN-002", "reviewedSha": null, "reviewerType": null,
    "reviewer": null, "date": null, "disposition": "Pending",
    "evidence": null, "authorization": null,
    "coverage": [
      { "locale": "ar", "surface": "Linguistic and epistemic nuance" },
      { "locale": "en", "surface": "Linguistic and epistemic nuance" },
      { "locale": "fr", "surface": "Linguistic and epistemic nuance" }
    ]
  },
  {
    "id": "MAN-003", "reviewedSha": null, "reviewerType": null,
    "reviewer": null, "date": null, "disposition": "Pending",
    "evidence": null, "authorization": null,
    "coverage": [
      { "locale": "ar", "surface": "Physical zoom, print, and touch" },
      { "locale": "en", "surface": "Physical zoom, print, and touch" },
      { "locale": "fr", "surface": "Physical zoom, print, and touch" }
    ]
  },
  {
    "id": "MAN-004", "reviewedSha": null, "reviewerType": null,
    "reviewer": null, "date": null, "disposition": "Pending",
    "evidence": null, "authorization": null,
    "coverage": [
      { "locale": "ar", "surface": "Long-form report" },
      { "locale": "en", "surface": "Long-form report" },
      { "locale": "fr", "surface": "Long-form report" }
    ]
  }
]
```

### Owed copy review stays under MAN-002

Reuse the row 60/100 owed-copy record and its existing inventory in
`.claude/harness/STATUS.md` (the “i18n owed” section), referenced by
[the language audit](../phase0/language.md). The 2026-11-16 delegated check
(row 100 / 0797c5a) is machine evidence, explicitly not a native-speaker check.
The inventory includes rows 100, 97, 92, 87, 81, 82, 43, 79, 66, 75, 59,
62, 33, 7, 19f, 19e, 19b, 19a, 17b, 49, 19c1, 71, 15, 35, 37, 19,
and 19d, plus the dated Arabic agreement/JUDGEMENT note. These references
identify owed work, not additional completed reviews. Row 93's reverted
brevity caps create no new obligation; review current shipped wording in context.
Attach real locale/surface evidence to MAN-002, including the owed-copy scope,
when it exists. Until then its disposition remains Pending.

## Data handling evidence required before release

- **Separate backups:** Workspace history/drafts and dossier cases/sources use
  separate stores and backup formats. Preserve both backups together, including
  their canonical links; a workspace backup or HTML report alone is not a dossier
  backup. Promotion writes across stores are not atomic. Verify both artifacts
  and links after restore, and record any partial failure without claiming a
  complete recovery. See [workspace](../features/workspace.md) and
  [research dossier](../features/research-dossier.md).
- **Import trust:** Schema validation and SHA-256 checksums detect malformed
  data or corruption; they do not authenticate authorship, provenance, or truth.
  Treat imported text, source URLs and AI output as untrusted data. Inspect
  source access, canonical identity, and review status before relying on a claim;
  importing is not publication approval.
- **Format-2 rollback limits:** A format-1-only build cannot read or show
  format-2 dossier cases containing sources/excerpts. It may label them corrupt
  without deleting them. Preserve the original cases and backups and restore a
  compatible build; do not promise automatic downgrade or recovery by rollback.
  Cases without sources may remain format 1. The cap revert did not remove
  this compatibility limit. See the [rollback warning](../release-notes-draft-format2-rollback.md).
