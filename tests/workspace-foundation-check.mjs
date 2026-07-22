import {
  WORKSPACE_BUNDLE_FORMAT,
  WORKSPACE_FORMAT,
  WORKSPACE_FORMAT_VERSION,
  canonicalStringify,
  createWorkspace,
  createWorkspaceBundle,
  migrateWorkspace,
  parseWorkspaceBundle,
  verifyWorkspace,
} from "../src/core/workspace-contract.js";
import {
  createIndexedDbWorkspaceBackend,
  createMemoryWorkspaceBackend,
  createWorkspaceRepository,
} from "../src/core/workspace-storage.js";
import fs from "node:fs";

const fail = (message) => {
  console.error(`Workspace foundation check failed: ${message}`);
  process.exit(1);
};
const assert = (condition, message) => { if (!condition) fail(message); };
const expectCode = async (operation, code) => {
  try { await operation(); } catch (error) {
    assert(error.code === code, `expected ${code}, received ${error.code || error}`);
    return;
  }
  fail(`expected ${code} to be rejected`);
};

let sequence = 0;
const idFactory = (prefix) => `${prefix}_test_${++sequence}`;
const clock = () => "2026-07-21T12:00:00.000Z";
const analysis = {
  schema_version: "1.1.0",
  analysis_id: "workspace-proof",
  language: "en",
  analysis_lens: "strategic",
  subject: { title: "Workspace proof", context: "Local only", question: "Can it round trip?", executive_thesis: "Yes." },
  interests: [{ id: "I1", name: "Integrity" }],
  actors: [], tools: [], narrative: [], results: [], feedback: [],
  contradictions: { items: [] }, scenarios: { items: [] }, evidence: { items: [] }, assumptions: { items: [] },
  links: [], quality_gate: {},
};
const manifest = { id: "strategic", contractId: "strategic-analysis-v1", schemaVersion: "1.1.0" };

const workspace = await createWorkspace({ analysis, manifest, clock, idFactory });
assert(workspace.format === WORKSPACE_FORMAT, "workspace format identity changed");
assert(workspace.format_version === WORKSPACE_FORMAT_VERSION, "workspace format version changed");
assert(workspace.revisions.length === 1, "import must create one immutable revision");
assert(workspace.revisions[0].kind === "imported_canonical", "imported revision kind changed");
assert(workspace.working_draft.dirty === false, "initial working draft must be clean");
assert(canonicalStringify(workspace.revisions[0].canonical_payload) === canonicalStringify(analysis), "canonical analysis changed during workspace creation");
assert(workspace.revisions[0].canonical_payload !== workspace.working_draft.canonical_payload, "draft and revision must not share object identity");
await verifyWorkspace(workspace);

const bundle = await createWorkspaceBundle(workspace, { clock });
assert(bundle.artifact === WORKSPACE_BUNDLE_FORMAT, "portable bundle identity changed");
assert(bundle.semantics.canonical_transport === false, "workspace bundle must not replace canonical transport");
assert(bundle.semantics.collaboration_state === false, "workspace bundle must not claim collaboration state");
const restored = await parseWorkspaceBundle(JSON.stringify(bundle));
assert(canonicalStringify(restored) === canonicalStringify(workspace), "workspace bundle round trip was lossy");

const bioAnalysis = JSON.parse(fs.readFileSync("fixtures/sample-analysis-bio-en.json", "utf8"));
const bioWorkspace = await createWorkspace({
  analysis: bioAnalysis,
  manifest: { id: "biopolitical", contractId: "biopolitical-training-map-v2", schemaVersion: "2.1.0" },
  clock,
  idFactory,
});
await verifyWorkspace(bioWorkspace);
const bioRestored = await parseWorkspaceBundle(JSON.stringify(await createWorkspaceBundle(bioWorkspace, { clock })));
assert(canonicalStringify(bioRestored.working_draft.canonical_payload) === canonicalStringify(bioAnalysis), "biopolitical workspace round trip was lossy");

const tamperedRevision = structuredClone(workspace);
tamperedRevision.revisions[0].canonical_payload.subject.title = "Tampered";
await expectCode(() => verifyWorkspace(tamperedRevision), "REVISION_CHECKSUM_MISMATCH");
const tamperedBundle = structuredClone(bundle);
tamperedBundle.workspace.metadata.title = "Tampered bundle";
await expectCode(() => parseWorkspaceBundle(tamperedBundle), "BUNDLE_CHECKSUM_MISMATCH");
const boundaryTamper = structuredClone(bundle);
boundaryTamper.semantics.canonical_transport = true;
await expectCode(() => parseWorkspaceBundle(boundaryTamper), "BUNDLE_MANIFEST_MISMATCH");
await expectCode(() => migrateWorkspace({ format: WORKSPACE_FORMAT, format_version: 99 }), "NO_WORKSPACE_MIGRATION");

sequence = 100;
const migrated = await migrateWorkspace({
  format: WORKSPACE_FORMAT,
  format_version: 0,
  title: "Legacy local workspace",
  created_at: clock(),
  analysis,
}, { idFactory });
assert(migrated.format_version === 3, "legacy workspace did not migrate to v3");
assert(migrated.review_ledger?.format === "jarbou3i-operational-review-ledger", "migration omitted review ledger");
assert(migrated.resolution_ledger?.format === "jarbou3i-resolution-ledger", "migration omitted resolution ledger");
assert(canonicalStringify(migrated.working_draft.canonical_payload) === canonicalStringify(analysis), "migration changed analysis semantics");

const backend = createMemoryWorkspaceBackend();
const repository = createWorkspaceRepository({ backend });
await repository.create(workspace);
assert((await repository.list()).length === 1, "repository list did not expose created workspace");
const read = await repository.get(workspace.workspace_id);
read.metadata.title = "Renamed safely";
read.metadata.updated_at = "2026-07-21T12:01:00.000Z";
read.repository_revision = 2;
await repository.replace(read, { expectedRevision: 1 });
assert((await repository.get(workspace.workspace_id)).metadata.title === "Renamed safely", "safe replacement failed");
const stale = structuredClone(read);
stale.metadata.title = "Stale overwrite";
await expectCode(() => repository.replace(stale, { expectedRevision: 1 }), "WRITE_CONFLICT");
await expectCode(() => repository.create(workspace), "WORKSPACE_EXISTS");
assert(await repository.remove(workspace.workspace_id, { expectedRevision: 2 }), "revision-guarded delete failed");
assert((await repository.list()).length === 0, "deleted workspace remained in repository");

const versionOne = structuredClone(workspace);
versionOne.format_version = 1;
delete versionOne.review_ledger;
const legacyRepository = createWorkspaceRepository({ backend: createMemoryWorkspaceBackend([versionOne]) });
const migratedOnRead = await legacyRepository.get(versionOne.workspace_id);
assert(migratedOnRead.format_version === 3, "repository read did not migrate a v1 workspace");
assert(migratedOnRead.review_ledger.events.length === 0, "v1 migration invented review history");
assert(migratedOnRead.resolution_ledger.records.length === 0, "v1 migration invented resolution history");

const unavailableBackend = createIndexedDbWorkspaceBackend({
  indexedDB: {
    open() { throw new DOMException("blocked", "SecurityError"); },
  },
});
await expectCode(() => unavailableBackend.list(), "STORAGE_UNAVAILABLE");

const corruptStored = structuredClone(workspace);
corruptStored.revisions[0].canonical_payload.subject.title = "Tampered listing title";
const diagnosticRepository = createWorkspaceRepository({ backend: createMemoryWorkspaceBackend([corruptStored]) });
const [diagnosticEntry] = await diagnosticRepository.list();
assert(diagnosticEntry.integrity_status === "corrupt", "unverified workspace metadata was presented as healthy");
assert(!diagnosticEntry.metadata, "corrupt workspace leaked unverified display metadata");

console.log("Workspace contract, migration, portability, integrity, and repository checks passed.");
