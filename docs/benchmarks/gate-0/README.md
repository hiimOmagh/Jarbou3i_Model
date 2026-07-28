# Gate 0 — Human Benchmark Kit

## Purpose

This kit measures the accepted Alpha.55 workflow before Alpha.56 or runtime UI
overhaul scope is frozen. It is a behavioral benchmark, not a product test and
not a usability-opinion survey.

The benchmark answers:

- Can analysts complete a defensible research-to-report task?
- Where do they lose orientation or reverse navigation?
- How long does provenance reconstruction take?
- Which seeded epistemic failures are detected and corrected?
- Do users understand confidence, verification, and publication state?
- Does interrupted work recover without misrepresenting canonical state?

## Acceptance boundary

Gate 0 is complete only when:

- three complete comparable trials exist for the Strategic lens;
- three complete comparable trials exist for the Biopolitical lens;
- every comparable trial uses script version `1.0.0`;
- every comparable trial uses the generated case and seed set from
  `case-manifest.json`;
- raw timestamps, observer notes, participant explanations, and deviations are
  preserved;
- results separate observation, participant explanation, analyst inference,
  and proposed response;
- the dominant bottleneck and uncertainty are documented.

At least one first-time analyst per lens is strongly preferred. If recruitment
makes that infeasible, the limitation must remain explicit.

## Controlled baseline

The first six comparable trials run in English. AR and FR trials are valuable,
but they are separate strata and must not be pooled into the English baseline.
This controls language as a variable while preserving later trilingual review.

Automated checks prove that the kit is complete and deterministic. They are not
evidence of human productivity or comprehension.

## Roles

- **Participant:** completes the task without seeing the seed manifest.
- **Facilitator:** reads only the standardized prompts and records timestamps.
- **Observer/analyst:** codes events and later separates observations from
  interpretations.
- **Decision owner:** accepts, rejects, or reorders the proposed product/UI
  sequence using the completed baseline report.

One person may facilitate and observe, but participant explanations must remain
verbatim and separate from observer inference.

## Files

| File | Purpose |
|---|---|
| `case-manifest.json` | Fixed cases, transparent mutations, seed truth, and case versions |
| `facilitator-protocol.md` | Standard run conditions, prompts, and invalidation rules |
| `strategic-task-script.md` | Strategic participant tasks |
| `biopolitical-task-script.md` | Biopolitical participant tasks |
| `observation-sheet.md` | Printable/raw observer instrument |
| `post-task-interview.md` | Comprehension and explanation questions |
| `trial-record.schema.json` | Machine-readable raw-trial contract |
| `strategic-trial-record.template.json` | Copy for each Strategic trial |
| `biopolitical-trial-record.template.json` | Copy for each Biopolitical trial |
| `baseline-report-template.md` | Required observation/explanation/inference separation |
| `bottleneck-register-template.csv` | Prioritization register; never an automatic decision |

Generated cases, recordings, trial records, and reports belong under
`gate0-benchmark-local/`, which must stay outside commits.

## Commands

Prepare the fixed seeded cases:

```powershell
npm run benchmark:gate0 -- prepare `
  --output .\gate0-benchmark-local\cases
```

Create six raw trial records by copying the template:

```powershell
New-Item -ItemType Directory `
  -Path .\gate0-benchmark-local\trials `
  -Force | Out-Null

1..3 | ForEach-Object {
  Copy-Item `
    .\docs\benchmarks\gate-0\strategic-trial-record.template.json `
    (".\gate0-benchmark-local\trials\strategic-{0:D2}.json" -f $_)
  Copy-Item `
    .\docs\benchmarks\gate-0\biopolitical-trial-record.template.json `
    (".\gate0-benchmark-local\trials\biopolitical-{0:D2}.json" -f $_)
}
```

Validate records during collection:

```powershell
npm run benchmark:gate0 -- validate `
  --input .\gate0-benchmark-local\trials
```

Generate the final baseline after three completed trials per lens:

```powershell
npm run benchmark:gate0 -- report `
  --input .\gate0-benchmark-local\trials `
  --output .\gate0-benchmark-local\reports
```

For pilot-only output before the sample is complete:

```powershell
npm run benchmark:gate0 -- report `
  --input .\gate0-benchmark-local\trials `
  --output .\gate0-benchmark-local\pilot-report `
  --allow-incomplete
```

Pilot output cannot close Gate 0.

## Data handling

- Use anonymous participant IDs.
- Do not record names in trial JSON.
- Obtain consent before screen/audio recording.
- Store recordings according to the participant agreement.
- Do not commit recordings, raw trial records, or reports.
- Preserve raw records; corrections create a new file or documented amendment.
- Do not infer competence, intent, or identity from one benchmark run.

## Decision rule

If source registration, provenance reconstruction, or evidence-to-claim
connection is the dominant measured bottleneck, proceed to the proposed
research-lifecycle sequence.

If orientation or comprehension dominates, strengthen UX-0/UIX-1/UIX-2 targets.

If neither is material, reduce the redesign or dossier scope and solve the
measured constraint. The roadmap is not protected from disconfirming evidence.
