import fs from "node:fs";
import Ajv2020 from "ajv/dist/2020.js";
import { createWorkspace, createWorkspaceBundle } from "../src/core/workspace-contract.js";
import { appendReviewEvent } from "../src/core/review-ledger.js";
import { writeEditorDraft } from "../src/core/canonical-editor.js";
import { commitResolution, createResolutionProposal } from "../src/core/resolution-transaction.js";
import { addSource, addExcerpt, checkExcerpt, createDossier, linkAnalysis, updateDossier } from "../src/core/research-dossier.js";

const fail = (message) => {
  console.error(`Schema check failed: ${message}`);
  process.exit(1);
};
const readJson = (file) => JSON.parse(fs.readFileSync(file, "utf8"));

const canonicalSchema = readJson("schema/biopolitical-analysis.schema.json");
const draftSchema = readJson("schema/biopolitical-migrated-draft.schema.json");
const generatedDraftSchema = readJson(
  "schema/biopolitical-generated-draft.schema.json",
);
const interchangeSchema = readJson("schema/ai-interchange-v1.schema.json");
const strategicSchema = readJson("schema/strategic-analysis.schema.json");
const workspaceSchema = readJson("schema/workspace.schema.json");
const workspaceBundleSchema = readJson("schema/workspace-bundle.schema.json");

let canonical;
let migratedDraft;
let generatedDraft;
let interchange;
try {
  const ajv = new Ajv2020({
    allErrors: true,
    strict: true,
    validateFormats: false,
  });
  canonical = ajv.compile(canonicalSchema);
  migratedDraft = ajv.compile(draftSchema);
  generatedDraft = ajv.compile(generatedDraftSchema);
  interchange = ajv.compile(interchangeSchema);
} catch (error) {
  fail(`biopolitical schemas must compile in strict Ajv mode: ${error.message}`);
}
if (
  generatedDraftSchema.properties?.contract_status?.const !==
    "reviewable_generated_draft" ||
  generatedDraftSchema.properties?.analysis_contract?.const !==
    "biopolitical-generated-draft-v1"
) {
  fail("generated drafts need a distinct non-canonical identity and status");
}
for (const origin of [
  "jarbou3i-ai-interchange/1",
  "biopolitical-training-map-v2@2.1.0",
]) {
  if (
    !generatedDraftSchema.properties?.migration?.properties?.from_schema?.enum?.includes(
      origin,
    )
  ) {
    fail(`generated drafts do not preserve the ${origin} origin`);
  }
}
if (
  !generatedDraftSchema.properties?.migration?.properties?.adapter?.enum?.includes(
    "canonical-ai-result-to-reviewable-draft-v1",
  )
) {
  fail("canonical-shaped AI results lack a governed draft adapter");
}
if (
  interchangeSchema.properties?.contract?.const !==
    "jarbou3i-ai-interchange/1" ||
  interchangeSchema.properties?.lens?.const !== "biopolitical"
) {
  fail("AI Interchange v1 identity is not locked");
}
if (!generatedDraft || !interchange) {
  fail("generated-draft and interchange validators were not compiled");
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

// The old six-layer format is refused, so it passes as neither contract.
const legacy = readJson("fixtures/sample-analysis-bio-en.legacy-v1.json");
if (canonical(legacy) || migratedDraft(legacy)) {
  fail("a legacy six-layer answer must validate as neither a canonical analysis nor a migrated draft");
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
  const editedPayload = structuredClone(reviewedWorkspace.working_draft.canonical_payload);
  editedPayload.subject.title = "Schema-approved resolution";
  const savedDraft = await writeEditorDraft(reviewedWorkspace, editedPayload, { clock: () => "2026-07-21T12:02:00.000Z" });
  const validator = (payload) => ({ valid: Boolean(payload.subject?.title), errors: [], warnings: [] });
  const proposal = await createResolutionProposal(savedDraft, {
    validate: validator,
    clock: () => "2026-07-21T12:03:00.000Z",
    idFactory: (prefix) => `${prefix}_schema_resolution`,
  });
  const resolvedWorkspace = await commitResolution(savedDraft, proposal, {
    validate: validator,
    reviewer: { reviewer_id: "schema-reviewer", display_name: "Schema Reviewer" },
    rationale: "Exercise the published resolution-ledger schema.",
    approved: true,
    clock: () => "2026-07-21T12:04:00.000Z",
    idFactory: (prefix) => `${prefix}_schema_commit`,
  });
  const bundle = await createWorkspaceBundle(resolvedWorkspace, { clock: () => "2026-07-21T12:05:00.000Z" });
  if (!validateWorkspace(resolvedWorkspace)) fail(`workspace failed published schema: ${JSON.stringify(validateWorkspace.errors)}`);
  if (!validateBundle(bundle)) fail(`workspace bundle failed published schema: ${JSON.stringify(validateBundle.errors)}`);
} catch (error) {
  fail(`workspace schemas could not compile or validate: ${error.message}`);
}

// The published research dossier matches the records the contract writes.
try {
  const dossierAjv = new Ajv2020({ allErrors: true, strict: true });
  const validateDossier = dossierAjv.compile(readJson("schema/research-dossier.schema.json"));
  const clock = () => "2026-10-30T12:00:00.000Z";
  const dossier = await createDossier({
    framing: { question: "Schema question", contested_terms: [{ term: "Scope", working_definition: "What is in." }] },
    completion: [{ criterion_id: "C1", text: "Open criterion" }, { criterion_id: "C2", text: "Met criterion", status: "met", rationale: "Checked." }],
    clock,
    idFactory: (prefix) => `${prefix}_schema`,
  });
  const linked = await linkAnalysis(await updateDossier(dossier, { framing: { question: "Edited" } }, { clock }), {
    workspace_id: "workspace_schema", revision_id: "revision_schema", payload_checksum: "a".repeat(64),
  }, { clock });
  const sourced = await addSource(linked, { title: "A source", url: "https://example.com/", accessed_on: "2024-02-29" }, { clock });
  const excerpted = await addExcerpt(sourced, sourced.sources[0].source_id, { text: "Several\nlines", locator: "page 2" }, { clock });
  const checked = await checkExcerpt(excerpted, excerpted.excerpts[0], { status: "matches", reason: "Checked page 2" }, { clock });
  const differs = await checkExcerpt(checked, checked.excerpts[0], { status: "differs", reason: "Different" }, { clock });
  // These fields must survive one-line browser inputs after restore. Use
  // runtime characters so no raw Unicode separators occur in JS source.
  for (const codePoint of [0x2028, 0x2029]) {
    const separator = String.fromCharCode(codePoint);
    for (const key of ["title", "url", "source_date", "accessed_on"]) {
      const value = key === "url" ? `https://example.org/a${separator}b`
        : key === "accessed_on" ? `2024-${separator}02-29` : `before${separator}after`;
      if (validateDossier({ ...sourced, sources: [{ ...sourced.sources[0], [key]: value }] })) fail(`research dossier schema accepted U+${codePoint.toString(16)} in ${key}`);
    }
    if (validateDossier({ ...excerpted, excerpts: [{ ...excerpted.excerpts[0], locator: `p${separator}2` }] })) fail("research dossier schema accepted a Unicode separator in locator");
    const multiline = { ...checked, excerpts: [{ ...checked.excerpts[0], text: `first${separator}second`, check: { ...checked.excerpts[0].check, reason: `read${separator}original` } }] };
    if (!validateDossier(multiline)) fail(`research dossier schema refused multiline text/reason: ${JSON.stringify(validateDossier.errors)}`);
  }
  const uppercaseUuid = "ABCDEFAB-CDEF-4ABC-8DEF-ABCDEFABCDEF";
  for (const prefix of ["source", "excerpt"]) {
    const id = `${prefix.toUpperCase()}_${uppercaseUuid}`;
    const malformed = prefix === "source"
      ? { ...excerpted, sources: [{ ...sourced.sources[0], source_id: id }], excerpts: [{ ...excerpted.excerpts[0], source_id: id }] }
      : { ...excerpted, excerpts: [{ ...excerpted.excerpts[0], excerpt_id: id }] };
    if (validateDossier(malformed)) fail(`research dossier schema accepted uppercase ${prefix} prefix`);
  }
  // Check the reference independently of the source's own id.
  if (validateDossier({ ...excerpted, excerpts: [{ ...excerpted.excerpts[0], source_id: `SOURCE_${uppercaseUuid}` }] })) fail("research dossier schema accepted an uppercase reference prefix");
  const upperSource = await addSource(dossier, { title: "Upper UUID" }, { clock, idFactory: (prefix) => `${prefix}_${uppercaseUuid}` });
  const upperExcerpt = await addExcerpt(upperSource, upperSource.sources[0].source_id, { text: "Upper UUID" }, { clock, idFactory: (prefix) => `${prefix}_${uppercaseUuid}` });
  if (!validateDossier(upperExcerpt)) fail(`research dossier schema refused uppercase-hex UUIDs: ${JSON.stringify(validateDossier.errors)}`);
  const { maximalDossierBody } = await import("./fixtures/research-dossier-maximal.mjs");
  const maximal = { ...maximalDossierBody(), checksum: checked.checksum };
  for (const record of [maximal, dossier, linked, sourced, excerpted, checked, differs, readJson("tests/fixtures/research-dossier-origin-main.json")]) {
    if (!validateDossier(record)) fail(`research dossier failed published schema: ${JSON.stringify(validateDossier.errors)}`);
  }
  if (validateDossier({ ...linked, analyses: [{ ...linked.analyses[0], claim: "copied evidence" }] })) {
    fail("research dossier schema accepted evidence copied into an analysis link");
  }
  for (const record of [
    readJson("tests/fixtures/research-dossier-origin-main-legacy.json"),
    { ...linked, revision: 2 ** 53 },
    ...["scope_in", "scope_out", "limits"].map((key) => ({ ...linked, framing: { ...linked.framing, [key]: ["two\nlines"] } })),
    ...[
      { term: "two\nlines", working_definition: "" },
      { term: "term: tail", working_definition: "" },
      { term: ":term", working_definition: "definition" },
      { term: "term", working_definition: "two\rlines" },
    ].map((term) => ({ ...linked, framing: { ...linked.framing, contested_terms: [term] } })),
    { ...linked, completion: [{ ...dossier.completion[0], text: "two\nlines" }] },
    { ...linked, sources: [] }, { ...sourced, format_version: 1 }, { ...sourced, sources: [] },
    { ...sourced, excerpts: undefined }, { ...sourced, sources: [{ ...sourced.sources[0], title: "Two\nlines" }] },
    { ...sourced, sources: [{ ...sourced.sources[0], source_id: "source_bad" }] },
    { ...excerpted, excerpts: [{ ...excerpted.excerpts[0], locator: "Two\nlines" }] },
    { ...checked, excerpts: [{ ...checked.excerpts[0], check: { status: "matches", reason: "", decided_at: clock() } }] },
  ]) if (validateDossier(record)) fail("research dossier schema accepted an invalid format or material shape");
} catch (error) {
  fail(`research dossier schema could not compile or validate: ${error.message}`);
}

console.log("Schema checks passed.");
