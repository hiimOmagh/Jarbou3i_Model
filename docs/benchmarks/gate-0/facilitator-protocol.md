# Gate 0 Facilitator Protocol v1.0.0

## Before the participant arrives

1. Record the exact repository commit and deployed URL.
2. Run `npm run benchmark:gate0 -- prepare`.
3. Assign the participant one lens; do not show `case-manifest.json`.
4. Start from a clean browser profile and empty Jarbou3i workspace.
5. Confirm English language, default density, and the assigned lens.
6. Prepare the correct generated case and a fresh trial-record copy.
7. Confirm recording consent or mark `recording_available` false.
8. Synchronize the observer clock to ISO 8601 with timezone.

Do not coach navigation, name seeded failures, or explain product terminology
unless the participant asks. Record every clarification request verbatim.

## Standard opening

> You are evaluating the tool, not being evaluated. Complete the task as you
> normally would. Think aloud if you are comfortable. If you are unsure, make
> the best decision you can. I may ask what you believe a status means, but I
> will not tell you where to click.

## Timing

- `started_at`: immediately before the participant reads Task T0.
- Task timestamps: when a task is read and when the participant declares it
  complete or abandons it.
- `ended_at`: after the post-task interview.
- `active_seconds`: elapsed time minus participant-requested reading or personal
  breaks; never subtract time spent understanding the product.

## Event coding

| Event | Record when |
|---|---|
| `navigation_reversal` | The participant returns because the current location or next action was unclear |
| `provenance_search_start` | They begin reconstructing where a material claim came from |
| `provenance_search_end` | They find the source/locator or explicitly conclude it is absent |
| `duplicate_entry` | The same source/evidence content is entered again to continue |
| `import_rejection` | The tool rejects or blocks the case import |
| `import_correction` | The participant changes input to resolve an import problem |
| `unsupported_claim_detected` | They identify a material claim without adequate support |
| `broken_locator_detected` | They identify missing, invalid, or non-resolving provenance |
| `recovery_attempt` | They attempt to recover interrupted authored work |
| `recovery_success` | The intended recoverable draft returns without false canonical status |
| `clarification_request` | They ask the facilitator what a control, status, or term means |
| `publication_state_error` | Their stated publication readiness conflicts with visible evidence |
| `observer_note` | A directly observable event not covered above |

Event notes describe visible behavior. Interpretations belong in
`observer_inferences`, not event notes.

## Neutral responses

Allowed:

- “Please continue as you normally would.”
- “What do you believe that status means?”
- “What would you try next?”
- “I cannot explain the interface during this task; I will record the question.”

Not allowed:

- naming a control or destination;
- confirming a seed;
- explaining confidence, verification, or publication state;
- suggesting a repair;
- treating a retry or workaround as task success without recording it.

## Invalidation

Set `status` to `invalidated` and record the reason if:

- the wrong case, lens, script version, or seed set is used;
- the participant saw the seed manifest before the task;
- the facilitator gives task-solving guidance;
- recording/timestamps are too incomplete to reconstruct the run;
- a product or environment failure prevents most of the script from running.

Keep invalidated records. Do not delete inconvenient trials.

## Closing

Ask every post-task question in order. Record the participant’s words before
coding correctness. Do not convert uncertainty into a confident answer.
