# RC 16 Import and CI Addendum

Candidate: `2.0.0-bio-rc.16`  
Scope: evidence-verification repair and WebKit interaction determinism

## Import finding

The supplied Tunisia analysis contained sixteen evidence records. Seven claimed `verification_status: "verified"` while both `verified_by` and `verification_date` were empty. Rejecting full verification was correct, but forcing manual edits across the payload prevented legitimate review work.

RC 16 performs a narrow pre-schema repair. A fully verified claim missing either audit-provenance field becomes `partially_verified` when its source is traceable and `unverified` otherwise. Each change emits `VERIFICATION_PROVENANCE_DOWNGRADED`; the analysis remains blocked from publication. A record that supplies full audit provenance but uses malformed source provenance is still rejected.

The exact supplied payload now produces zero import errors, seven downgrade warnings, sixteen `partially_verified` evidence records, zero private-use citation glyphs, and a blocked publication gate.

## CI finding

The RC 15 Windows matrix passed 232/232 cases. GitHub Actions separately exposed four WebKit actionability timeouts while controls were present but continuously considered unstable under parallel rendering. RC 16 exercises those transitions through their native keyboard contract—focus, Enter, then selected/pressed-state assertion—covering Connections list, edge inspection, sample loading, and review tabs without relaxing timeouts.

## Acceptance

- the supplied missing-verifier payload imports with warnings and cannot publish;
- valid fully verified evidence remains unchanged;
- malformed fully verified source provenance remains rejected;
- no-browser integrity, prompt-language, schema, and report gates pass;
- browser core executes all 236 cases with zero failures, retries, skipped tests, or runner errors;
- hosted and visual evidence reviews pass after the browser core.
