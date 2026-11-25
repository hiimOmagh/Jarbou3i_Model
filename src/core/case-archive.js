/* ADR-0010 transport only: no repositories, persistence or restore policy.
   validatePayload(payload, identity) must use the existing lens validator and
   return { valid: boolean }. It is required for every nonempty archive so
   unavailable validation fails closed, without loading browser globals here. */
import { canonicalStringify, sha256, WorkspaceContractError } from "./canonical-json.js";
import { parseWorkspaceBundle } from "./workspace-contract.js";
import { verifyDossier } from "./research-dossier.js";

export const CASE_ARCHIVE_FORMAT = "Jarbou3iCaseArchive";
export const CASE_ARCHIVE_VERSION = 1;
const fail = (code) => { throw new WorkspaceContractError(code, code); };
const record = (value) => value && typeof value === "object" && !Array.isArray(value);
const same = (a, b) => canonicalStringify(a) === canonicalStringify(b);
const compare = (a, b) => a < b ? -1 : a > b ? 1 : 0;
const byWorkspace = (a, b) => compare(a.workspace_id, b.workspace_id);
const byReference = (a, b) => byWorkspace(a, b) || compare(a.revision_id, b.revision_id);
const hex = (value) => typeof value === "string" && /^[0-9a-f]{64}$/.test(value);
function keys(value, expected) {
  if (!record(value) || !same(Object.keys(value).sort(), [...expected].sort())) fail("INVALID_CASE_ARCHIVE_SHAPE");
}
function timestamp(value) {
  if (typeof value !== "string" || !/^\d{4}-\d\d-\d\dT/.test(value) || !Number.isFinite(Date.parse(value))) fail("INVALID_ARCHIVE_TIMESTAMP");
  return value;
}

async function manifestFor(dossier, bundles, options) {
  await verifyDossier(dossier, options);
  const workspaces = new Map();
  const entries = [];
  for (const bundle of bundles) {
    // Existing parser checks original hashes before migration and verifies
    // the migrated workspace. Preserve the original bundle in the envelope.
    const workspace = await parseWorkspaceBundle(bundle, options);
    const id = workspace.workspace_id;
    if (typeof id !== "string" || !id || workspaces.has(id)) fail("ARCHIVE_DUPLICATE_WORKSPACE");
    const identity = workspace.analysis_identity;
    const supported = { strategic: ["strategic-analysis-v1", "1.1.0"], biopolitical: ["biopolitical-training-map-v2", "2.1.0"] }[identity.lens_id];
    if (!supported || identity.contract_id !== supported[0] || identity.schema_version !== supported[1]) fail("ARCHIVE_UNSUPPORTED_LENS");
    if (typeof options.validatePayload !== "function") fail("ARCHIVE_VALIDATOR_REQUIRED");
    for (const payload of [...workspace.revisions.map((revision) => revision.canonical_payload), workspace.working_draft.canonical_payload]) {
      if (payload.analysis_lens !== identity.lens_id || payload.schema_version !== identity.schema_version ||
          String(payload.analysis_contract || supported[0]) !== identity.contract_id ||
          String(payload.language || "") !== identity.language ||
          String(payload.analysis_id || payload.analysisId || "") !== identity.analysis_id) fail("ARCHIVE_ANALYSIS_IDENTITY_MISMATCH");
      const result = await options.validatePayload(structuredClone(payload), structuredClone(identity));
      if (result?.valid !== true) fail("ARCHIVE_ANALYSIS_INVALID");
    }
    workspaces.set(id, workspace);
    entries.push({ workspace_id: id, repository_revision: bundle.workspace.repository_revision, sha256: await sha256(bundle, options.cryptoImpl) });
  }
  const references = new Map();
  const required = new Set();
  function resolve(pointer) {
    required.add(pointer.workspace_id);
    const workspace = workspaces.get(pointer.workspace_id);
    const revision = workspace?.revisions.find((item) => item.revision_id === pointer.revision_id);
    if (!revision) fail("ARCHIVE_REFERENCE_TARGET_MISSING");
    if (!hex(revision.payload_checksum) || (pointer.payload_checksum !== undefined && pointer.payload_checksum !== revision.payload_checksum)) fail("ARCHIVE_REFERENCE_CHECKSUM_MISMATCH");
    const reference = { workspace_id: pointer.workspace_id, revision_id: pointer.revision_id, payload_checksum: revision.payload_checksum };
    references.set(JSON.stringify([pointer.workspace_id, pointer.revision_id]), reference);
    return revision;
  }
  for (const analysis of dossier.analyses) resolve(analysis);
  for (const excerpt of dossier.excerpts || []) {
    for (const pointer of excerpt.promotions || []) {
      const revision = resolve(pointer);
      // Both supported lens contracts own evidence at evidence.items; full
      // payload validation above establishes its shape and unique identities.
      const evidence = revision.canonical_payload.evidence?.items || [];
      if (evidence.filter((item) => item.id === pointer.evidence_id).length !== 1) fail("ARCHIVE_PROMOTION_TARGET_MISSING");
    }
  }
  if (required.size !== workspaces.size) fail("ARCHIVE_UNRELATED_WORKSPACE");
  return {
    dossier: { dossier_id: dossier.dossier_id, revision: dossier.revision, sha256: await sha256(dossier, options.cryptoImpl) },
    workspaces: entries.sort(byWorkspace),
    references: [...references.values()].sort(byReference),
  };
}

export async function createCaseArchive({ dossier, workspaces } = {}, options = {}) {
  // Snapshot inputs before awaiting: later caller mutations cannot mix reads.
  const members = structuredClone({ dossier, workspaces });
  if (!Array.isArray(members.workspaces)) fail("INVALID_CASE_ARCHIVE_SHAPE");
  const manifest = await manifestFor(members.dossier, members.workspaces, options);
  members.workspaces.sort((a, b) => compare(a.workspace.workspace_id, b.workspace.workspace_id));
  const body = {
    artifact: CASE_ARCHIVE_FORMAT,
    artifact_version: CASE_ARCHIVE_VERSION,
    exported_at: timestamp(options.clock ? options.clock() : new Date().toISOString()),
    ...members,
    manifest,
  };
  return { ...body, checksum: { algorithm: "SHA-256", protected_content: await sha256(body, options.cryptoImpl) } };
}

export async function parseCaseArchive(value, options = {}) {
  let archive;
  if (typeof value === "string") {
    try { archive = JSON.parse(value); } catch { fail("INVALID_CASE_ARCHIVE_JSON"); }
  } else archive = structuredClone(value);
  if (!record(archive) || archive.artifact !== CASE_ARCHIVE_FORMAT || archive.artifact_version !== CASE_ARCHIVE_VERSION) fail("UNSUPPORTED_CASE_ARCHIVE");
  keys(archive, ["artifact", "artifact_version", "exported_at", "dossier", "workspaces", "manifest", "checksum"]);
  keys(archive.checksum, ["algorithm", "protected_content"]);
  if (archive.checksum.algorithm !== "SHA-256" || !hex(archive.checksum.protected_content)) fail("INVALID_ARCHIVE_CHECKSUM");
  timestamp(archive.exported_at);
  if (!Array.isArray(archive.workspaces)) fail("INVALID_CASE_ARCHIVE_SHAPE");
  const { checksum, ...body } = archive;
  if (await sha256(body, options.cryptoImpl) !== checksum.protected_content) fail("ARCHIVE_CHECKSUM_MISMATCH");
  const expected = await manifestFor(archive.dossier, archive.workspaces, options);
  if (!same(archive.manifest, expected) || !same(archive.workspaces.map((bundle) => bundle.workspace.workspace_id), expected.workspaces.map((entry) => entry.workspace_id))) fail("ARCHIVE_MANIFEST_MISMATCH");
  return archive;
}
