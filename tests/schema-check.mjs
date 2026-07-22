import fs from "node:fs";
import vm from "node:vm";
import Ajv2020 from "ajv/dist/2020.js";
import { createWorkspace, createWorkspaceBundle } from "../src/core/workspace-contract.js";
import { appendReviewEvent } from "../src/core/review-ledger.js";

const fail = (message) => {
  console.error(`Schema check failed: ${message}`);
  process.exit(1);
};
const readJson = (file) => JSON.parse(fs.readFileSync(file, "utf8"));

const canonicalSchema = readJson("schema/biopolitical-analysis.schema.json");
const draftSchema = readJson("schema/biopolitical-migrated-draft.schema.json");
const strategicSchema = readJson("schema/strategic-analysis.schema.json");
const workspaceSchema = readJson("schema/workspace.schema.json");
const workspaceBundleSchema = readJson("schema/workspace-bundle.schema.json");

let canonical;
let migratedDraft;
try {
  const ajv = new Ajv2020({
    allErrors: true,
    strict: true,
    validateFormats: false,
  });
  canonical = ajv.compile(canonicalSchema);
  migratedDraft = ajv.compile(draftSchema);
} catch (error) {
  fail(`biopolitical schemas must compile in strict Ajv mode: ${error.message}`);
}

if (canonicalSchema.properties?.schema_version?.const !== "2.1.0") {
  fail("canonical schema version must be 2.1.0");
}
if (canonicalSchema.properties?.contract_status?.const !== "canonical") {
  fail("canonical schema must require an explicit canonical status");
}
if (
  draftSchema.properties?.analysis_contract?.const !==
    "biopolitical-migrated-draft-v1" ||
  draftSchema.properties?.contract_status?.const !== "migrated_draft"
) {
  fail("migrated drafts need a distinct contract identity and status");
}

for (const key of [
  "legal_framework",
  "international_comparison",
  "capture_levels",
  "theoretical_comparison",
  "migration",
]) {
  if (!canonicalSchema.required?.includes(key)) {
    fail(`canonical top-level contract is missing ${key}`);
  }
}

if (canonicalSchema.$defs?.captureCriterion?.properties?.criterion?.enum?.length !== 13) {
  fail("capture schema must enumerate exactly 13 criteria");
}
if (canonicalSchema.$defs?.explanation?.properties?.type?.enum?.length !== 9) {
  fail("explanation schema must enumerate exactly nine families");
}
if (canonicalSchema.$defs?.captureLevel?.properties?.level?.enum?.length !== 5) {
  fail("capture-level schema must enumerate exactly five levels");
}
if (canonicalSchema.$defs?.selfAudit?.required?.length !== 18) {
  fail("self-audit schema must require all 18 checks");
}

for (const lang of ["ar", "en", "fr"]) {
  const fixture = readJson(`fixtures/sample-analysis-bio-${lang}.json`);
  if (!canonical(fixture)) {
    fail(`${lang} canonical fixture failed schema validation: ${JSON.stringify(canonical.errors)}`);
  }
}

const invalid = structuredClone(readJson("fixtures/sample-analysis-bio-en.json"));
invalid.evidence.items[0].verification_status = 7;
if (canonical(invalid)) {
  fail("canonical validator accepted an invalid evidence verification type");
}

const context = { window: {} };
context.window.window = context.window;
vm.createContext(context);
new vm.Script(fs.readFileSync("src/biopolitics.js", "utf8"), {
  filename: "src/biopolitics.js",
}).runInContext(context);
const legacy = readJson("fixtures/sample-analysis-bio-en.legacy-v1.json");
const draft = context.window.Jarbou3iBiopolitics.migrateLegacy(legacy);
if (!migratedDraft(draft)) {
  fail(`legacy adapter output failed the migrated-draft schema: ${JSON.stringify(migratedDraft.errors)}`);
}
if (canonical(draft)) {
  fail("a migrated draft must never validate as a canonical analysis");
}

try {
  const strategicAjv = new Ajv2020({
    allErrors: true,
    strict: false,
    validateFormats: false,
  });
  const validateStrategic = strategicAjv.compile(strategicSchema);
  for (const lang of ["ar", "en", "fr"]) {
    const fixture = readJson(`fixtures/sample-analysis-${lang}.json`);
    if (!validateStrategic(fixture)) {
      fail(`${lang} strategic fixture failed its schema`);
    }
  }
} catch (error) {
  fail(`strategic schema could not compile: ${error.message}`);
}

try {
  const workspaceAjv = new Ajv2020({ allErrors: true, strict: true, validateFormats: false });
  workspaceAjv.addSchema(workspaceSchema);
  const validateWorkspace = workspaceAjv.getSchema(workspaceSchema.$id);
  const validateBundle = workspaceAjv.compile(workspaceBundleSchema);
  let sequence = 0;
  const analysis = readJson("fixtures/sample-analysis-en.json");
  const workspace = await createWorkspace({
    analysis,
    manifest: { id: "strategic", contractId: "strategic-analysis-v1", schemaVersion: "1.1.0" },
    clock: () => "2026-07-21T12:00:00.000Z",
    idFactory: (prefix) => `${prefix}_schema_${++sequence}`,
  });
  const reviewedWorkspace = await appendReviewEvent(workspace, {
    type: "task_waived",
    task: { id: "RQ001", phase: "verify_provenance", reasonCode: "untraceable_source", targetType: "evidence", targetId: "E1" },
    reviewer: { reviewer_id: "schema-reviewer", display_name: "Schema Reviewer" },
    rationale: "Schema exercise waiver.",
    waiver: { scope: "Schema test", accepted_risk: "Fixture-only source", expires_at: null },
    clock: () => "2026-07-21T12:01:00.000Z",
    idFactory: (prefix) => `${prefix}_schema_event`,
  });
  const bundle = await createWorkspaceBundle(reviewedWorkspace, { clock: () => "2026-07-21T12:02:00.000Z" });
  if (!validateWorkspace(reviewedWorkspace)) fail(`workspace failed published schema: ${JSON.stringify(validateWorkspace.errors)}`);
  if (!validateBundle(bundle)) fail(`workspace bundle failed published schema: ${JSON.stringify(validateBundle.errors)}`);
} catch (error) {
  fail(`workspace schemas could not compile or validate: ${error.message}`);
}

console.log("Schema checks passed.");
