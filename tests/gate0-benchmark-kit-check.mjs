import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import Ajv2020 from "ajv/dist/2020.js";
import {
  buildBaseline,
  prepareCases,
  renderBaselineMarkdown,
  validateTrials,
} from "../scripts/gate0-benchmark.mjs";

const KIT = "docs/benchmarks/gate-0";
const requiredFiles = [
  "README.md",
  "facilitator-protocol.md",
  "strategic-task-script.md",
  "biopolitical-task-script.md",
  "observation-sheet.md",
  "post-task-interview.md",
  "baseline-report-template.md",
  "bottleneck-register-template.csv",
  "case-manifest.json",
  "trial-record.schema.json",
  "strategic-trial-record.template.json",
  "biopolitical-trial-record.template.json",
];
for (const file of requiredFiles) {
  assert.equal(fs.existsSync(path.join(KIT, file)), true, `missing Gate 0 asset: ${file}`);
}

const manifest = JSON.parse(fs.readFileSync(path.join(KIT, "case-manifest.json"), "utf8"));
assert.equal(manifest.format, "jarbou3i-gate0-case-manifest-v1");
assert.equal(manifest.script_version, "1.0.0");
assert.equal(manifest.baseline_locale, "en");
assert.equal(manifest.comparable_trials_required_per_lens, 3);
assert.deepEqual(manifest.task_ids, ["T0", "T1", "T2", "T3", "T4", "T5", "T6", "T7"]);
assert.deepEqual(
  manifest.cases.map((entry) => entry.lens).sort(),
  ["biopolitical", "strategic"],
);

const allSeedIds = [];
for (const caseDefinition of manifest.cases) {
  assert.equal(fs.existsSync(caseDefinition.fixture_path), true);
  assert.equal(fs.existsSync(caseDefinition.participant_script), true);
  assert.equal(caseDefinition.case_version, "1.0.0");
  assert.ok(caseDefinition.seeds.length >= 5, `${caseDefinition.case_id} needs at least five seeds`);
  assert.ok(caseDefinition.mutations.length >= caseDefinition.seeds.length);
  allSeedIds.push(...caseDefinition.seeds.map((seed) => seed.seed_id));

  const script = fs.readFileSync(caseDefinition.participant_script, "utf8");
  for (const taskId of manifest.task_ids) {
    assert.match(script, new RegExp(`## ${taskId} —`), `${caseDefinition.case_id} missing ${taskId}`);
  }
  for (const phrase of [
    "Do not invent sources",
    "publication-ready",
    "recovered draft",
    "canonical JSON and standalone HTML",
  ]) {
    assert.ok(script.includes(phrase), `${caseDefinition.case_id} missing task invariant: ${phrase}`);
  }
}
assert.equal(new Set(allSeedIds).size, allSeedIds.length, "seed IDs must be globally unique");

const schema = JSON.parse(fs.readFileSync(path.join(KIT, "trial-record.schema.json"), "utf8"));
const ajv = new Ajv2020({
  allErrors: true,
  strict: true,
  validateFormats: false,
  allowUnionTypes: true,
});
const validateSchema = ajv.compile(schema);
for (const templateName of [
  "strategic-trial-record.template.json",
  "biopolitical-trial-record.template.json",
]) {
  const template = JSON.parse(fs.readFileSync(path.join(KIT, templateName), "utf8"));
  assert.equal(
    validateSchema(template),
    true,
    `${templateName} violates trial schema: ${JSON.stringify(validateSchema.errors)}`,
  );
}

const plan = fs.readFileSync("docs/product-ui-execution-plan.md", "utf8");
for (const phrase of [
  "No big-bang rewrite is authorized.",
  "At least three complete trials per lens",
  "Only `BR-0 + GATE-0-SETUP` is authorized",
  "→ DECIDE-1",
]) {
  assert.ok(plan.includes(phrase), `execution plan missing: ${phrase}`);
}
assert.ok(fs.readFileSync(".gitignore", "utf8").includes("/gate0-benchmark-local/"));

const temporaryRoot = fs.mkdtempSync(path.join(os.tmpdir(), "jarbou3i-gate0-"));
try {
  const casesDirectory = path.join(temporaryRoot, "cases");
  const generated = prepareCases(casesDirectory);
  assert.equal(generated.length, 2);

  const strategic = JSON.parse(
    fs.readFileSync(path.join(casesDirectory, "gate0-strategic-seeded-v1.json"), "utf8"),
  );
  assert.match(strategic.subject.executive_thesis, /deliberately engineered/u);
  assert.equal(strategic.links.some((link) => link.to === "R404"), true);
  assert.equal(strategic.quality_gate.publication_risk, "low");

  const biopolitical = JSON.parse(
    fs.readFileSync(path.join(casesDirectory, "gate0-biopolitical-seeded-v1.json"), "utf8"),
  );
  assert.match(biopolitical.subject.executive_finding, /permanent social control/u);
  assert.equal(biopolitical.evidence.items[0].verification_status, "verified");
  assert.equal(biopolitical.evidence.items[0].source_locator, "");
  assert.equal(
    biopolitical.intervention_assessment.interventions[0].evidence_of_benefit.includes("E404"),
    true,
  );

  const trialsDirectory = path.join(temporaryRoot, "trials");
  fs.mkdirSync(trialsDirectory);
  const commit = "df41acca4dbf09e753104f22db18702c5e52da7e";
  for (const [lens, templateName] of [
    ["strategic", "strategic-trial-record.template.json"],
    ["biopolitical", "biopolitical-trial-record.template.json"],
  ]) {
    const template = JSON.parse(fs.readFileSync(path.join(KIT, templateName), "utf8"));
    for (let index = 1; index <= 3; index += 1) {
      const trial = JSON.parse(JSON.stringify(template));
      trial.trial_id = `${lens === "strategic" ? "STR" : "BIO"}-${String(index).padStart(3, "0")}`;
      trial.repository_commit = commit;
      trial.participant.anonymous_id = `${lens}-P${index}`;
      trial.participant.experience_level = index === 1 ? "first_time" : "intermediate";
      trial.participant_explanations = [
        {
          note_id: `${trial.trial_id}-PX1`,
          text: "The verification and publication states required separate inspection.",
        },
      ];
      for (const result of Object.values(trial.comprehension)) {
        result.rating = "correct";
        result.answer = "Recorded benchmark answer.";
      }
      for (const seed of trial.seed_findings) {
        seed.disposition = "Not detected during this synthetic contract trial.";
      }
      fs.writeFileSync(
        path.join(trialsDirectory, `${trial.trial_id}.json`),
        `${JSON.stringify(trial, null, 2)}\n`,
      );
    }
  }

  const validation = validateTrials(trialsDirectory);
  assert.equal(validation.length, 6);
  assert.deepEqual(
    validation.flatMap((entry) => entry.errors),
    [],
  );
  const baseline = buildBaseline(validation, "2026-07-28T20:00:00.000Z");
  assert.equal(baseline.acceptance.met, true);
  assert.equal(baseline.lenses.strategic.completed_trials, 3);
  assert.equal(baseline.lenses.biopolitical.completed_trials, 3);
  assert.equal(baseline.lenses.strategic.first_time_trials, 1);
  assert.equal(baseline.lenses.biopolitical.first_time_trials, 1);
  assert.match(renderBaselineMarkdown(baseline), /Gate acceptance: MET/u);
} finally {
  fs.rmSync(temporaryRoot, { recursive: true, force: true });
}

console.log("Gate 0 benchmark kit checks passed.");
