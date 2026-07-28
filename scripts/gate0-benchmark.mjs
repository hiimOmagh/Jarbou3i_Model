import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";

const SCRIPT_PATH = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(SCRIPT_PATH), "..");
const KIT = path.join(ROOT, "docs", "benchmarks", "gate-0");
const MANIFEST_PATH = path.join(KIT, "case-manifest.json");
const SCHEMA_PATH = path.join(KIT, "trial-record.schema.json");
const TASK_IDS = ["T0", "T1", "T2", "T3", "T4", "T5", "T6", "T7"];
const EVENT_TYPES = [
  "navigation_reversal",
  "duplicate_entry",
  "import_rejection",
  "import_correction",
  "unsupported_claim_detected",
  "broken_locator_detected",
  "recovery_attempt",
  "recovery_success",
  "clarification_request",
  "publication_state_error",
];
const COMPREHENSION_KEYS = [
  "confidence_state",
  "verification_state",
  "publication_state",
  "recovery_state",
];

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function manifest() {
  return readJson(MANIFEST_PATH);
}

function caseById(caseId, source = manifest()) {
  return source.cases.find((entry) => entry.case_id === caseId);
}

function targetAt(document, mutation) {
  if (!Array.isArray(mutation.path) || mutation.path.length === 0) {
    throw new Error("Mutation path must be a non-empty array.");
  }
  let target = document;
  for (const segment of mutation.path.slice(0, -1)) {
    if (target?.[segment] === undefined) {
      throw new Error(`Mutation path does not exist: ${mutation.path.join(".")}`);
    }
    target = target[segment];
  }
  return [target, mutation.path.at(-1)];
}

function applyMutation(document, mutation) {
  const [target, key] = targetAt(document, mutation);
  if (mutation.operation === "set") {
    if (!(key in target)) {
      throw new Error(`Set target does not exist: ${mutation.path.join(".")}`);
    }
    target[key] = clone(mutation.value);
    return;
  }
  if (mutation.operation === "append") {
    if (!Array.isArray(target[key])) {
      throw new Error(`Append target is not an array: ${mutation.path.join(".")}`);
    }
    target[key].push(clone(mutation.value));
    return;
  }
  throw new Error(`Unsupported mutation operation: ${mutation.operation}`);
}

export function buildSeededCase(caseDefinition) {
  const fixture = readJson(path.join(ROOT, caseDefinition.fixture_path));
  if (fixture.analysis_lens !== caseDefinition.lens) {
    throw new Error(
      `${caseDefinition.case_id} fixture lens ${fixture.analysis_lens} does not match ${caseDefinition.lens}`,
    );
  }
  const seeded = clone(fixture);
  for (const mutation of caseDefinition.mutations) applyMutation(seeded, mutation);
  return seeded;
}

export function prepareCases(outputDirectory) {
  const source = manifest();
  fs.mkdirSync(outputDirectory, { recursive: true });
  const generated = [];
  for (const caseDefinition of source.cases) {
    const caseFile = path.join(outputDirectory, caseDefinition.generated_filename);
    writeJson(caseFile, buildSeededCase(caseDefinition));
    generated.push({ caseFile });
  }
  return generated;
}

function validator() {
  const schema = readJson(SCHEMA_PATH);
  const ajv = new Ajv2020({
    allErrors: true,
    strict: true,
    validateFormats: false,
    allowUnionTypes: true,
  });
  return ajv.compile(schema);
}

function isoMillis(value) {
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function duplicateValues(values) {
  const seen = new Set();
  const duplicates = new Set();
  for (const value of values) {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }
  return [...duplicates];
}

export function validateTrial(trial, validateSchema = validator(), source = manifest()) {
  const errors = [];
  if (!validateSchema(trial)) {
    errors.push(
      ...validateSchema.errors.map(
        (error) => `${error.instancePath || "/"} ${error.message || "is invalid"}`,
      ),
    );
    return errors;
  }

  const caseDefinition = caseById(trial.case_id, source);
  if (!caseDefinition) errors.push(`unknown case_id ${trial.case_id}`);
  if (caseDefinition && trial.lens !== caseDefinition.lens) {
    errors.push(`lens ${trial.lens} does not match case ${caseDefinition.lens}`);
  }
  if (/^0{40}$/u.test(trial.repository_commit)) {
    errors.push("repository_commit is still the template placeholder");
  }

  const started = isoMillis(trial.started_at);
  const ended = isoMillis(trial.ended_at);
  if (started === null || ended === null || ended < started) {
    errors.push("trial timestamps are invalid or reversed");
  }
  if (trial.active_seconds > (ended - started) / 1000) {
    errors.push("active_seconds exceeds elapsed trial time");
  }

  const taskIds = trial.task_results.map((task) => task.task_id);
  if (taskIds.join(",") !== TASK_IDS.join(",")) {
    errors.push(`task_results must appear exactly once in order: ${TASK_IDS.join(", ")}`);
  }
  let previousTaskEnd = started;
  for (const task of trial.task_results) {
    const taskStart = isoMillis(task.started_at);
    const taskEnd = isoMillis(task.ended_at);
    if (taskStart === null || taskEnd === null || taskEnd < taskStart) {
      errors.push(`${task.task_id} timestamps are invalid or reversed`);
    } else {
      if (taskStart < started || taskEnd > ended) {
        errors.push(`${task.task_id} timestamps fall outside the trial window`);
      }
      if (taskStart < previousTaskEnd) {
        errors.push(`${task.task_id} starts before the previous task ended`);
      }
      previousTaskEnd = taskEnd;
    }
  }
  if (trial.status === "complete" && trial.task_results.some((task) => task.status !== "complete")) {
    errors.push("complete trial contains an incomplete task");
  }
  if (trial.status === "complete") {
    if (!trial.participant_explanations.length) {
      errors.push("complete trial requires at least one participant explanation");
    }
    for (const key of COMPREHENSION_KEYS) {
      if (trial.comprehension[key].rating === "not_answered") {
        errors.push(`complete trial requires a comprehension rating for ${key}`);
      }
    }
  }
  if (trial.status === "invalidated" && !trial.data_quality.invalidation_reason.trim()) {
    errors.push("invalidated trial requires an invalidation_reason");
  }

  const eventIds = trial.events.map((event) => event.event_id);
  for (const duplicate of duplicateValues(eventIds)) errors.push(`duplicate event_id ${duplicate}`);
  for (const event of trial.events) {
    const eventTime = isoMillis(event.timestamp);
    if (eventTime === null) {
      errors.push(`${event.event_id} has an invalid timestamp`);
    } else if (eventTime < started || eventTime > ended) {
      errors.push(`${event.event_id} falls outside the trial window`);
    }
  }

  if (caseDefinition) {
    const expectedSeeds = caseDefinition.seeds.map((seed) => seed.seed_id).sort();
    const actualSeeds = trial.seed_findings.map((seed) => seed.seed_id).sort();
    if (actualSeeds.join(",") !== expectedSeeds.join(",")) {
      errors.push(`seed_findings must contain exactly: ${expectedSeeds.join(", ")}`);
    }
  }
  for (const seed of trial.seed_findings) {
    const detectedAt = isoMillis(seed.first_detected_at);
    if (seed.detected && detectedAt === null) {
      errors.push(`${seed.seed_id} detected=true requires first_detected_at`);
    }
    if (seed.detected && (detectedAt < started || detectedAt > ended)) {
      errors.push(`${seed.seed_id} detection falls outside the trial window`);
    }
    if (!seed.detected && seed.first_detected_at !== null) {
      errors.push(`${seed.seed_id} detected=false requires first_detected_at=null`);
    }
    if (seed.corrected && !seed.detected) {
      errors.push(`${seed.seed_id} cannot be corrected before detection`);
    }
    if (trial.status === "complete" && !seed.disposition.trim()) {
      errors.push(`complete trial requires a disposition for ${seed.seed_id}`);
    }
  }

  const inferenceIds = new Set(trial.observer_inferences.map((entry) => entry.inference_id));
  for (const inference of trial.observer_inferences) {
    for (const observationId of inference.observation_ids) {
      if (!eventIds.includes(observationId)) {
        errors.push(`${inference.inference_id} references unknown observation ${observationId}`);
      }
    }
  }
  for (const response of trial.proposed_responses) {
    for (const inferenceId of response.inference_ids) {
      if (!inferenceIds.has(inferenceId)) {
        errors.push(`${response.response_id} references unknown inference ${inferenceId}`);
      }
    }
  }
  return errors;
}

export function loadTrials(inputDirectory) {
  if (!fs.existsSync(inputDirectory)) throw new Error(`Input directory does not exist: ${inputDirectory}`);
  const files = fs
    .readdirSync(inputDirectory)
    .filter((name) => name.endsWith(".json"))
    .sort();
  if (!files.length) throw new Error(`No JSON trial records found in ${inputDirectory}`);
  return files.map((name) => ({
    file: path.join(inputDirectory, name),
    trial: readJson(path.join(inputDirectory, name)),
  }));
}

export function validateTrials(inputDirectory) {
  const validateSchema = validator();
  const source = manifest();
  const records = loadTrials(inputDirectory);
  const results = records.map(({ file, trial }) => ({
    file,
    trial,
    errors: validateTrial(trial, validateSchema, source),
  }));
  const duplicateTrialIds = duplicateValues(results.map((entry) => entry.trial.trial_id));
  for (const duplicate of duplicateTrialIds) {
    for (const result of results.filter((entry) => entry.trial.trial_id === duplicate)) {
      result.errors.push(`duplicate trial_id ${duplicate}`);
    }
  }
  return results;
}

function median(values) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2
    ? sorted[middle]
    : (sorted[middle - 1] + sorted[middle]) / 2;
}

function range(values) {
  return values.length ? [Math.min(...values), Math.max(...values)] : [null, null];
}

function metric(values) {
  return {
    median: median(values),
    range: range(values),
    values,
  };
}

function eventCount(trial, type) {
  return trial.events.filter((event) => event.type === type).length;
}

function provenanceSeconds(trial) {
  const pending = [];
  let total = 0;
  for (const event of [...trial.events].sort((a, b) => isoMillis(a.timestamp) - isoMillis(b.timestamp))) {
    if (event.type === "provenance_search_start") pending.push(isoMillis(event.timestamp));
    if (event.type === "provenance_search_end" && pending.length) {
      total += Math.max(0, isoMillis(event.timestamp) - pending.shift());
    }
  }
  return total / 1000;
}

function comprehensionScore(trial) {
  const weights = { correct: 1, partial: 0.5, incorrect: 0, not_answered: 0 };
  return (
    COMPREHENSION_KEYS.reduce(
      (sum, key) => sum + weights[trial.comprehension[key].rating],
      0,
    ) / COMPREHENSION_KEYS.length
  );
}

function lensMetrics(trials, expectedSeeds) {
  const elapsed = trials.map(
    (trial) => (isoMillis(trial.ended_at) - isoMillis(trial.started_at)) / 1000,
  );
  const seedTotal = trials.length * expectedSeeds.length;
  const detected = trials.reduce(
    (sum, trial) => sum + trial.seed_findings.filter((seed) => seed.detected).length,
    0,
  );
  const corrected = trials.reduce(
    (sum, trial) => sum + trial.seed_findings.filter((seed) => seed.corrected).length,
    0,
  );
  return {
    completed_trials: trials.length,
    first_time_trials: trials.filter(
      (trial) => trial.participant.experience_level === "first_time",
    ).length,
    elapsed_seconds: metric(elapsed),
    active_seconds: metric(trials.map((trial) => trial.active_seconds)),
    provenance_reconstruction_seconds: metric(trials.map(provenanceSeconds)),
    navigation_reversals: metric(
      trials.map((trial) => eventCount(trial, "navigation_reversal")),
    ),
    duplicate_entries: metric(trials.map((trial) => eventCount(trial, "duplicate_entry"))),
    import_rejections: metric(trials.map((trial) => eventCount(trial, "import_rejection"))),
    import_corrections: metric(trials.map((trial) => eventCount(trial, "import_correction"))),
    unsupported_claim_detections: metric(
      trials.map((trial) => eventCount(trial, "unsupported_claim_detected")),
    ),
    broken_locator_detections: metric(
      trials.map((trial) => eventCount(trial, "broken_locator_detected")),
    ),
    clarification_requests: metric(
      trials.map((trial) => eventCount(trial, "clarification_request")),
    ),
    publication_state_errors: metric(
      trials.map((trial) => eventCount(trial, "publication_state_error")),
    ),
    recovery_success_rate:
      trials.length === 0
        ? null
        : trials.filter((trial) => eventCount(trial, "recovery_success") > 0).length /
          trials.length,
    seed_detection_rate: seedTotal ? detected / seedTotal : null,
    seed_correction_rate: seedTotal ? corrected / seedTotal : null,
    comprehension_score: metric(trials.map(comprehensionScore)),
  };
}

function comparable(trial, source) {
  return (
    trial.status === "complete" &&
    trial.participant.locale === source.baseline_locale &&
    trial.script_version === source.script_version &&
    trial.data_quality.timestamps_complete &&
    !trial.data_quality.script_deviation.trim()
  );
}

export function buildBaseline(results, generatedAt = new Date().toISOString()) {
  const source = manifest();
  const invalid = results.filter((entry) => entry.errors.length);
  if (invalid.length) {
    throw new Error(
      `Cannot build baseline with invalid records: ${invalid
        .map((entry) => path.basename(entry.file))
        .join(", ")}`,
    );
  }
  const validTrials = results.map((entry) => entry.trial);
  const comparableTrials = validTrials.filter((trial) => comparable(trial, source));
  const reasons = [];
  const warnings = [];
  const lenses = {};

  for (const caseDefinition of source.cases) {
    const trials = comparableTrials.filter((trial) => trial.lens === caseDefinition.lens);
    lenses[caseDefinition.lens] = lensMetrics(
      trials,
      caseDefinition.seeds.map((seed) => seed.seed_id),
    );
    if (trials.length < source.comparable_trials_required_per_lens) {
      reasons.push(
        `${caseDefinition.lens} has ${trials.length}/${source.comparable_trials_required_per_lens} comparable completed trials`,
      );
    }
    if (!trials.some((trial) => trial.participant.experience_level === "first_time")) {
      warnings.push(`${caseDefinition.lens} has no first-time analyst trial`);
    }
  }

  const nonComparable = validTrials.filter((trial) => !comparable(trial, source));
  if (nonComparable.length) {
    warnings.push(`${nonComparable.length} valid trial(s) excluded from the comparable English baseline`);
  }
  const comparableCommits = new Set(comparableTrials.map((trial) => trial.repository_commit));
  if (comparableCommits.size > 1) {
    reasons.push("comparable trials span more than one repository commit");
  }
  const participantCounts = new Map();
  for (const trial of comparableTrials) {
    const id = trial.participant.anonymous_id;
    participantCounts.set(id, (participantCounts.get(id) || 0) + 1);
  }
  const repeatedParticipants = [...participantCounts]
    .filter(([, count]) => count > 1)
    .map(([id]) => id);
  if (repeatedParticipants.length) {
    warnings.push(
      `participant carryover is present for: ${repeatedParticipants.join(", ")}`,
    );
  }

  return {
    format: "jarbou3i-gate0-baseline-v1",
    generated_at: generatedAt,
    script_version: source.script_version,
    baseline_locale: source.baseline_locale,
    acceptance: {
      met: reasons.length === 0,
      reasons,
      warnings,
    },
    sample: {
      total_records: validTrials.length,
      comparable_trial_ids: comparableTrials.map((trial) => trial.trial_id),
      excluded_trial_ids: nonComparable.map((trial) => trial.trial_id),
      invalidated_trial_ids: validTrials
        .filter((trial) => trial.status === "invalidated")
        .map((trial) => trial.trial_id),
      locale_extension_trial_ids: validTrials
        .filter((trial) => trial.participant.locale !== source.baseline_locale)
        .map((trial) => trial.trial_id),
    },
    lenses,
    interpretation_boundary: {
      automated_output:
        "Descriptive observations and acceptance checks only; not a roadmap decision.",
      required_human_sections: [
        "participant explanations",
        "analyst inference",
        "competing explanations",
        "proposed response",
        "dominant bottleneck",
        "roadmap decision",
      ],
    },
  };
}

function number(value, digits = 2) {
  return value === null ? "n/a" : Number(value).toFixed(digits);
}

function metricText(value) {
  return `${number(value.median)} [${number(value.range[0])}, ${number(value.range[1])}]`;
}

export function renderBaselineMarkdown(baseline) {
  const lines = [
    "# Gate 0 Generated Baseline",
    "",
    `- Generated: ${baseline.generated_at}`,
    `- Script version: ${baseline.script_version}`,
    `- Comparable locale: ${baseline.baseline_locale}`,
    `- Gate acceptance: ${baseline.acceptance.met ? "MET" : "NOT MET"}`,
    "",
  ];
  if (baseline.acceptance.reasons.length) {
    lines.push("## Acceptance blockers", "");
    for (const reason of baseline.acceptance.reasons) lines.push(`- ${reason}`);
    lines.push("");
  }
  if (baseline.acceptance.warnings.length) {
    lines.push("## Warnings", "");
    for (const warning of baseline.acceptance.warnings) lines.push(`- ${warning}`);
    lines.push("");
  }
  lines.push(
    "## Descriptive observations",
    "",
    "| Lens | Trials | Elapsed s median [range] | Active s median [range] | Provenance s median [range] | Seed detected | Seed corrected | Comprehension |",
    "|---|---:|---:|---:|---:|---:|---:|---:|",
  );
  for (const [lens, metrics] of Object.entries(baseline.lenses)) {
    lines.push(
      `| ${lens} | ${metrics.completed_trials} | ${metricText(metrics.elapsed_seconds)} | ${metricText(metrics.active_seconds)} | ${metricText(metrics.provenance_reconstruction_seconds)} | ${number(metrics.seed_detection_rate)} | ${number(metrics.seed_correction_rate)} | ${metricText(metrics.comprehension_score)} |`,
    );
  }
  lines.push(
    "",
    "## Interpretation boundary",
    "",
    "This generated report contains descriptive observations and sample checks. It does not infer causes, rank product work, or authorize Alpha.56.",
    "",
    "Complete the repository baseline-report template with:",
    "",
    "1. participant explanations;",
    "2. analyst inferences tied to observation IDs;",
    "3. competing explanations and falsifiers;",
    "4. proposed responses;",
    "5. dominant bottleneck and uncertainty;",
    "6. human roadmap decision.",
    "",
  );
  return `${lines.join("\n")}\n`;
}

function resolveCliPath(value) {
  if (!value) throw new Error("Missing required path argument.");
  return path.resolve(process.cwd(), value);
}

function option(args, name) {
  const index = args.indexOf(name);
  return index === -1 ? null : args[index + 1];
}

function printHelp() {
  console.log(`Gate 0 benchmark CLI

Usage:
  node scripts/gate0-benchmark.mjs prepare --output <directory>
  node scripts/gate0-benchmark.mjs validate --input <directory>
  node scripts/gate0-benchmark.mjs report --input <directory> --output <directory> [--allow-incomplete]
`);
}

export function runCli(args) {
  const [command] = args;
  if (!command || command === "help" || command === "--help") {
    printHelp();
    return 0;
  }
  if (command === "prepare") {
    const output = resolveCliPath(option(args, "--output"));
    const generated = prepareCases(output);
    for (const entry of generated) {
      console.log(`Prepared ${path.relative(process.cwd(), entry.caseFile)}`);
    }
    return 0;
  }

  const input = resolveCliPath(option(args, "--input"));
  const results = validateTrials(input);
  const invalid = results.filter((entry) => entry.errors.length);
  if (invalid.length) {
    for (const entry of invalid) {
      console.error(`${path.basename(entry.file)}:`);
      for (const error of entry.errors) console.error(`  - ${error}`);
    }
    return 1;
  }
  console.log(`Validated ${results.length} Gate 0 trial record(s).`);
  if (command === "validate") return 0;
  if (command !== "report") throw new Error(`Unknown command: ${command}`);

  const output = resolveCliPath(option(args, "--output"));
  const baseline = buildBaseline(results);
  fs.mkdirSync(output, { recursive: true });
  writeJson(path.join(output, "gate0-baseline.json"), baseline);
  fs.writeFileSync(
    path.join(output, "gate0-baseline.md"),
    renderBaselineMarkdown(baseline),
  );
  fs.copyFileSync(
    path.join(KIT, "baseline-report-template.md"),
    path.join(output, "gate0-human-analysis.md"),
  );
  fs.copyFileSync(
    path.join(KIT, "bottleneck-register-template.csv"),
    path.join(output, "gate0-bottleneck-register.csv"),
  );
  console.log(`Wrote Gate 0 report set to ${output}`);
  if (!baseline.acceptance.met && !args.includes("--allow-incomplete")) {
    for (const reason of baseline.acceptance.reasons) console.error(`Gate 0 incomplete: ${reason}`);
    return 2;
  }
  if (!baseline.acceptance.met) {
    console.warn("Pilot report only: Gate 0 acceptance is not met.");
  }
  return 0;
}

if (path.resolve(process.argv[1] || "") === SCRIPT_PATH) {
  try {
    process.exitCode = runCli(process.argv.slice(2));
  } catch (error) {
    console.error(`Gate 0 benchmark failed: ${error.message}`);
    process.exitCode = 1;
  }
}
