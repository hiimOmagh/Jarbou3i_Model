# Results, Connections, and Evidence Intelligence

Everything described here is a read-only projection of the imported canonical
analysis. None of it alters schemas, prompts, validation, scoring, readiness,
publication gates, canonical JSON, or standalone reports, and none of it invents
identifiers, provenance, evidence, relationships, or review decisions. Missing
values stay visibly unavailable.

## Application shell

The shared frame has a global header with live lens context, Set up → Model →
Review navigation, a truthful local-processing status, and comfortable or compact
density. Density is the only persisted shell preference; the current section is
session-local. Review is unavailable until an analysis exists. Shell state never
enters or leaves with canonical analysis data.

The shell supports Arabic (RTL), English, and French; light and dark themes; skip
navigation and keyboard activation; reduced motion; forced colors; print; and
320 px reflow.

## Results in three layers

- **Orientation** answers what matters first.
- **Explanation** shows how the conclusion is built.
- **Inspection** reveals each record's canonical identity, provenance, evidence
  balance, relationships, audit facts, and every indexed occurrence.

Lens-specific detail views keep the complete records.

### Inspection

Strategic and Biopolitical results share one inspection directory and one
accessible details drawer. Names stay primary; canonical IDs stay visible. A
record can show:

- type, analytical pillar, canonical ID, JSON Pointer path, and declared confidence;
- source title, valid public URL, locator, date, type, tier, note, declared
  verification, and claim/source fit;
- platform-assessed traceability, claim status, independent-review status, and
  approval eligibility;
- supporting and counter-evidence IDs and authored counter-evidence text;
- incoming and outgoing records with explicit relation labels;
- schema, contract, model, uncertainty, limitation, evidence-strength, and
  unresolved-link audit facts;
- every occurrence of the record in the imported analysis.

| Lens | Inspection source |
|---|---|
| Strategic | IDs authored on the six causal layers, contradictions, scenarios, evidence, and assumptions; explicit `links` only |
| Biopolitical | The canonical relationship graph plus the shared provenance, evidence-balance, audit, and occurrence projection |

A Strategic import without authored IDs shows an honest empty directory. The
inspector is a modal dialog with Escape closure, a focus trap, and focus
restoration. Source links render only for valid HTTP(S) URLs and open with
`noopener noreferrer`.

## Connections

The Biopolitical Connections section shows how much of the answer is
connected: how many records have a connection, how many connections there are,
and how many cite evidence. Below it:

- **Around one record**: the chosen record in the middle, the records that
  point to it on one side and those it points to on the other, grouped by
  relation, read in the page's direction and stacked on a narrow screen. A
  neighbour, chosen, moves to the middle; the record list chooses any record,
  and the inspector's **Show its connections** opens the view on a record. The
  record with the most connections starts in the middle.
- **Records with no connection**: the records nothing connects, and a prompt
  that asks the AI that wrote the answer for new links only. Its reply, pasted
  in the reply box under the answer, is added after the answer's links, checked, and imported
  as a new answer; the original stays as it is.
- **Every connection**: under the layer of the record it starts from, each
  layer folded to its name and count. Opened, a layer names each record once,
  then "relation · record" for each of its connections, with the reason the
  answer gives. A search finds records, IDs and relations, opens the layers
  it finds, and says how many lines it shows; cleared, the layers are as they
  were before it.

Both are plain HTML lists and buttons, so the view reads the same to a screen
reader as on screen. Each Biopolitical record also lists its own connections
("Links to", "Linked from"), a line each: "relation: record". A long name
wraps under its relation, which reads as its label. A record with more than
six facts, connections included, shows its first four and folds the rest
under one line that counts them ("13 more details"); a record the inspector
sends you to inside a fold opens it. The overview folds its detailed diagnostics under one
line that counts the items blocking publication. A fold you open stays open
when the case file is drawn again for the same answer, as on a change of
language.

Biopolitical review cards show a referenced record's name next to its stable ID;
selecting it opens its type, pillar, confidence, and relationships. Standalone
HTML reports expand the same names, list each record's connections, and
include a reference directory, a relationship atlas (how many records are
connected), the temporal projection, and comparison limits, while their
embedded canonical JSON stays equivalent to the imported analysis.

## Relationship intelligence

A shared, immutable index turns authored records, relationships, and evidence
references into bidirectional, navigable structures for both lenses:

- a record registry with labels, types, pillars, confidence, and JSON Pointer paths;
- typed incoming and outgoing relationships;
- authored supporting and counter-evidence trails, and reverse citations;
- permanent links of the form `#record=<lens>:<canonical-id>`;
- diagnostics for duplicate IDs, unresolved endpoints or evidence targets,
  isolated records, high-confidence records without authored support, and
  untraceable evidence.

| Lens | Relationship authority | Evidence authority |
|---|---|---|
| Strategic | Explicit top-level `links` only | Authored evidence-ID fields |
| Biopolitical | Explicit and schema-derived typed graph | Authored evidence-ID fields resolved against the same graph |

Diagnostics describe contract facts only; they never imply that a claim is true
or false. Opening a permanent link opens the record when the current analysis
contains it; closing the inspector clears the fragment.

## Source clusters and evidence gaps

Evidence is clustered by the strongest authored identity: exact normalized
HTTP(S) URL, then exact title plus locator, then exact title, otherwise a
record-specific missing-identity cluster. There is no external lookup, fuzzy
matching, publisher inference, DOI resolution, or scraping, and records without
identity are never merged.

Coverage signals flag missing or title-only source identity, evidence no record
cites, missing counter-evidence, missing or unknown source dates, untraceable
sources, and several evidence records sharing one source. These are review
prompts, not truth scores.

## Claim–evidence traceability

Every non-evidence record gets one traceability row: its authored supporting and
counter-evidence IDs, resolved source clusters, unresolved evidence IDs,
traceable-evidence count, and a balance state (support and counter, support only,
counter only, or unreferenced). Each direct evidence reference becomes an
evidence-to-record route; routes are never inferred from similarity or proximity.

**Export intelligence JSON** downloads a derived artifact:

```json
{
  "format": "jarbou3i-evidence-intelligence-v1",
  "derived": true,
  "canonical_transport": false
}
```

It holds aggregate counts, source clusters, the matrix, routes, gaps, and
unresolved-relationship diagnostics, and excludes the raw analysis, so it cannot
replace canonical JSON.

## Evidence review queue

The diagnostics above become one deterministic review queue, ordered by
dependency:

1. **Resolve references**: duplicate IDs, unresolved relationship endpoints, and
   unresolved evidence references.
2. **Verify provenance**: missing, untraceable, or title-only source identity.
3. **Strengthen coverage**: uncited evidence, missing counter-evidence or dates,
   source concentration, unsupported high confidence, and isolated records.

Task numbers are presentation metadata, not severity or truth scores. The
separate `jarbou3i-evidence-review-plan-v1` export is derived and non-canonical,
states `completion_validates_conclusions: false`, contains no raw analysis, and
cannot be re-imported.

## Tests

| Area | No-browser check | Browser spec |
|---|---|---|
| Shell | `npm run test:shell`, `npm run test:shell:navigation` | `tests/application-shell.spec.js` |
| Orientation and explanation | `npm run test:results:orientation`, `npm run test:results:explanation` | `tests/results-workspace.spec.js`, `tests/results-explanation.spec.js` |
| Inspection | `npm run test:results:inspection` | `tests/results-inspection.spec.js` |
| Relationship intelligence | `npm run test:relationship:intelligence` | `tests/results-inspection.spec.js` |
| Source clusters and gaps | `npm run test:evidence:intelligence` | `tests/results-inspection.spec.js` |
| Traceability and export | `npm run test:evidence:traceability` | `tests/evidence-intelligence.spec.js` |
| Review queue and export | `npm run test:evidence:review-plan` | `tests/evidence-review-plan.spec.js` |
| Connections | | `tests/connections-view.spec.js`, `tests/reference-resolution.spec.js` |
