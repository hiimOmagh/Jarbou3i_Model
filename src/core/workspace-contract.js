/* Versioned local-workspace contract. Canonical analysis revisions remain immutable. */

import { createReviewLedger, verifyReviewLedger } from "./review-ledger.js";

export const WORKSPACE_FORMAT = "jarbou3i-local-workspace";
export const WORKSPACE_FORMAT_VERSION = 2;
export const WORKSPACE_BUNDLE_FORMAT = "jarbou3i-workspace-bundle";
export const WORKSPACE_BUNDLE_VERSION = 1;
export const WORKSPACE_CHECKSUM_ALGORITHM = "SHA-256";

const isRecord = (value) =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

export class WorkspaceContractError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = "WorkspaceContractError";
    this.code = code;
    this.details = Object.freeze({ ...details });
  }
}

function fail(code, message, details) {
  throw new WorkspaceContractError(code, message, details);
}

function clone(value) {
  return structuredClone(value);
}

export function canonicalStringify(value) {
  const seen = new WeakSet();
  const normalize = (item) => {
    if (item === null || typeof item !== "object") return item;
    if (seen.has(item)) fail("CYCLIC_VALUE", "Workspace values must be acyclic.");
    seen.add(item);
    if (Array.isArray(item)) {
      const result = item.map(normalize);
      seen.delete(item);
      return result;
    }
    const result = {};
    for (const key of Object.keys(item).sort()) {
      const child = item[key];
      if (child !== undefined) result[key] = normalize(child);
    }
    seen.delete(item);
    return result;
  };
  return JSON.stringify(normalize(value));
}

export async function sha256(value, cryptoImpl = globalThis.crypto) {
  if (!cryptoImpl?.subtle?.digest) {
    fail("CRYPTO_UNAVAILABLE", "SHA-256 support is required for workspace integrity.");
  }
  const bytes = new TextEncoder().encode(
    typeof value === "string" ? value : canonicalStringify(value),
  );
  const digest = await cryptoImpl.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function defaultId(prefix) {
  const value = globalThis.crypto?.randomUUID?.();
  if (!value) fail("ID_GENERATOR_UNAVAILABLE", "Secure workspace identifiers are unavailable.");
  return `${prefix}_${value}`;
}

function isoNow(clock) {
  const value = typeof clock === "function" ? clock() : new Date().toISOString();
  if (!Number.isFinite(Date.parse(value))) {
    fail("INVALID_TIMESTAMP", "Workspace timestamps must be ISO-8601 values.");
  }
  return value;
}

function resolveIdentity(analysis, manifest = {}) {
  const lensId = String(analysis?.analysis_lens || manifest.id || "");
  const schemaVersion = String(
    analysis?.schema_version || analysis?.schemaVersion || manifest.schemaVersion || "",
  );
  const contractId = String(
    analysis?.analysis_contract || manifest.contractId ||
      (lensId === "strategic" ? "strategic-analysis-v1" : ""),
  );
  if (!isRecord(analysis)) fail("INVALID_ANALYSIS", "A canonical analysis object is required.");
  if (!lensId || !schemaVersion || !contractId) {
    fail("INCOMPLETE_ANALYSIS_IDENTITY", "Lens, contract, and schema identities are required.");
  }
  if (manifest.id && manifest.id !== lensId) {
    fail("LENS_IDENTITY_MISMATCH", "Analysis and lens manifest identities differ.");
  }
  return Object.freeze({
    lens_id: lensId,
    contract_id: contractId,
    schema_version: schemaVersion,
    language: String(analysis.language || ""),
    analysis_id: String(analysis.analysis_id || analysis.analysisId || ""),
  });
}

export async function createWorkspace({
  analysis,
  manifest,
  title,
  clock,
  idFactory = defaultId,
  cryptoImpl,
} = {}) {
  const identity = resolveIdentity(analysis, manifest);
  const createdAt = isoNow(clock);
  const workspaceId = idFactory("ws");
  const revisionId = idFactory("rev");
  const draftId = idFactory("draft");
  const payload = clone(analysis);
  const checksum = await sha256(payload, cryptoImpl);
  return {
    format: WORKSPACE_FORMAT,
    format_version: WORKSPACE_FORMAT_VERSION,
    workspace_id: workspaceId,
    repository_revision: 1,
    metadata: {
      title: String(title || analysis?.subject?.title || "Untitled analysis").trim(),
      created_at: createdAt,
      updated_at: createdAt,
      archived_at: null,
    },
    analysis_identity: identity,
    imported_revision_id: revisionId,
    head_revision_id: revisionId,
    revisions: [
      {
        revision_id: revisionId,
        parent_revision_id: null,
        kind: "imported_canonical",
        created_at: createdAt,
        payload_checksum: checksum,
        canonical_payload: payload,
      },
    ],
    working_draft: {
      draft_id: draftId,
      base_revision_id: revisionId,
      updated_at: createdAt,
      payload_checksum: checksum,
      canonical_payload: clone(payload),
      dirty: false,
    },
    audit_events: [
      {
        event_id: idFactory("evt"),
        type: "workspace_created_from_import",
        occurred_at: createdAt,
        revision_id: revisionId,
      },
    ],
    review_ledger: createReviewLedger({ clock: () => createdAt }),
  };
}

function validateShape(workspace) {
  if (!isRecord(workspace)) fail("INVALID_WORKSPACE", "Workspace must be an object.");
  if (workspace.format !== WORKSPACE_FORMAT) {
    fail("UNSUPPORTED_WORKSPACE_FORMAT", "This is not a Jarbou3i local workspace.");
  }
  if (workspace.format_version !== WORKSPACE_FORMAT_VERSION) {
    fail("UNSUPPORTED_WORKSPACE_VERSION", "Workspace version is not supported.", {
      found: workspace.format_version,
      supported: WORKSPACE_FORMAT_VERSION,
    });
  }
  if (!String(workspace.workspace_id || "")) fail("MISSING_WORKSPACE_ID", "Workspace ID is required.");
  if (!Number.isInteger(workspace.repository_revision) || workspace.repository_revision < 1) {
    fail("INVALID_REPOSITORY_REVISION", "Repository revision must be a positive integer.");
  }
  if (!isRecord(workspace.metadata) || !String(workspace.metadata.title || "").trim()) {
    fail("INVALID_WORKSPACE_METADATA", "Workspace title and metadata are required.");
  }
  if (!isRecord(workspace.analysis_identity)) {
    fail("MISSING_ANALYSIS_IDENTITY", "Analysis identity is required.");
  }
  if (!Array.isArray(workspace.revisions) || !workspace.revisions.length) {
    fail("MISSING_REVISIONS", "At least one immutable revision is required.");
  }
  const ids = new Set();
  for (const revision of workspace.revisions) {
    if (!isRecord(revision) || !String(revision.revision_id || "")) {
      fail("INVALID_REVISION", "Every revision requires an identity.");
    }
    if (ids.has(revision.revision_id)) fail("DUPLICATE_REVISION_ID", "Revision IDs must be unique.");
    ids.add(revision.revision_id);
    if (!isRecord(revision.canonical_payload) || !String(revision.payload_checksum || "")) {
      fail("INVALID_REVISION_PAYLOAD", "Every revision requires a checksummed canonical payload.");
    }
  }
  if (!ids.has(workspace.imported_revision_id) || !ids.has(workspace.head_revision_id)) {
    fail("BROKEN_REVISION_POINTER", "Imported and head revision pointers must resolve.");
  }
  if (!isRecord(workspace.working_draft) ||
      !ids.has(workspace.working_draft.base_revision_id) ||
      !isRecord(workspace.working_draft.canonical_payload)) {
    fail("INVALID_WORKING_DRAFT", "Working draft must reference a stored revision.");
  }
  if (!Array.isArray(workspace.audit_events)) {
    fail("INVALID_AUDIT_LOG", "Workspace audit events must be an array.");
  }
  if (!isRecord(workspace.review_ledger)) {
    fail("INVALID_REVIEW_LEDGER", "Workspace operational review ledger is required.");
  }
}

export async function verifyWorkspace(workspace, { cryptoImpl } = {}) {
  validateShape(workspace);
  await verifyReviewLedger(workspace.review_ledger, { cryptoImpl });
  for (const event of workspace.review_ledger.events) {
    if (event.workspace_id !== workspace.workspace_id) {
      fail("REVIEW_EVENT_WORKSPACE_MISMATCH", "Review event belongs to a different workspace.", {
        event_id: event.event_id,
      });
    }
    if (event.repository_revision_before >= workspace.repository_revision) {
      fail("REVIEW_EVENT_REVISION_MISMATCH", "Review event revision is not earlier than the stored workspace revision.", {
        event_id: event.event_id,
      });
    }
  }
  for (const revision of workspace.revisions) {
    const actual = await sha256(revision.canonical_payload, cryptoImpl);
    if (actual !== revision.payload_checksum) {
      fail("REVISION_CHECKSUM_MISMATCH", "An immutable revision failed integrity verification.", {
        revision_id: revision.revision_id,
      });
    }
  }
  const draftChecksum = await sha256(workspace.working_draft.canonical_payload, cryptoImpl);
  if (draftChecksum !== workspace.working_draft.payload_checksum) {
    fail("DRAFT_CHECKSUM_MISMATCH", "The working draft failed integrity verification.");
  }
  const identity = resolveIdentity(workspace.working_draft.canonical_payload, {
    id: workspace.analysis_identity.lens_id,
    contractId: workspace.analysis_identity.contract_id,
    schemaVersion: workspace.analysis_identity.schema_version,
  });
  for (const key of ["lens_id", "contract_id", "schema_version", "language", "analysis_id"]) {
    if (String(identity[key]) !== String(workspace.analysis_identity[key] || "")) {
      fail("ANALYSIS_IDENTITY_MISMATCH", `Workspace analysis identity changed at ${key}.`, { key });
    }
  }
  return clone(workspace);
}

export async function migrateWorkspace(input, options = {}) {
  if (!isRecord(input)) fail("INVALID_WORKSPACE", "Workspace must be an object.");
  if (input.format === WORKSPACE_FORMAT && input.format_version === WORKSPACE_FORMAT_VERSION) {
    return verifyWorkspace(input, options);
  }
  if (input.format === WORKSPACE_FORMAT && input.format_version === 1) {
    const migrated = clone(input);
    migrated.format_version = WORKSPACE_FORMAT_VERSION;
    migrated.review_ledger = createReviewLedger({
      clock: () => input.metadata?.updated_at || input.metadata?.created_at || new Date().toISOString(),
    });
    return verifyWorkspace(migrated, options);
  }
  if (input.format === WORKSPACE_FORMAT && input.format_version === 0 && isRecord(input.analysis)) {
    return createWorkspace({
      analysis: input.analysis,
      manifest: input.analysis_identity,
      title: input.title,
      clock: () => input.updated_at || input.created_at || new Date().toISOString(),
      idFactory: options.idFactory,
      cryptoImpl: options.cryptoImpl,
    });
  }
  fail("NO_WORKSPACE_MIGRATION", "No safe migration path exists for this workspace version.", {
    format: input.format,
    version: input.format_version,
  });
}

export async function createWorkspaceBundle(workspace, { clock, cryptoImpl } = {}) {
  const verified = await verifyWorkspace(workspace, { cryptoImpl });
  const workspaceChecksum = await sha256(verified, cryptoImpl);
  const protectedContent = {
    artifact: WORKSPACE_BUNDLE_FORMAT,
    artifact_version: WORKSPACE_BUNDLE_VERSION,
    semantics: {
      local_first: true,
      canonical_transport: false,
      contains_canonical_revisions: true,
      collaboration_state: false,
    },
    workspace: verified,
  };
  return {
    ...protectedContent,
    exported_at: isoNow(clock),
    checksum: {
      algorithm: WORKSPACE_CHECKSUM_ALGORITHM,
      workspace: workspaceChecksum,
      protected_content: await sha256(protectedContent, cryptoImpl),
    },
  };
}

export async function parseWorkspaceBundle(value, options = {}) {
  let bundle = value;
  if (typeof value === "string") {
    try {
      bundle = JSON.parse(value);
    } catch {
      fail("INVALID_BUNDLE_JSON", "Workspace bundle is not valid JSON.");
    }
  }
  if (!isRecord(bundle) || bundle.artifact !== WORKSPACE_BUNDLE_FORMAT ||
      bundle.artifact_version !== WORKSPACE_BUNDLE_VERSION) {
    fail("UNSUPPORTED_BUNDLE", "Workspace bundle format or version is unsupported.");
  }
  if (bundle.checksum?.algorithm !== WORKSPACE_CHECKSUM_ALGORITHM) {
    fail("UNSUPPORTED_CHECKSUM", "Workspace bundle requires SHA-256 integrity.");
  }
  const workspaceChecksum = await sha256(bundle.workspace, options.cryptoImpl);
  if (workspaceChecksum !== bundle.checksum.workspace) {
    fail("BUNDLE_CHECKSUM_MISMATCH", "Workspace bundle failed integrity verification.");
  }
  const protectedContent = {
    artifact: bundle.artifact,
    artifact_version: bundle.artifact_version,
    semantics: bundle.semantics,
    workspace: bundle.workspace,
  };
  const protectedChecksum = await sha256(protectedContent, options.cryptoImpl);
  if (protectedChecksum !== bundle.checksum.protected_content) {
    fail("BUNDLE_MANIFEST_MISMATCH", "Workspace bundle boundaries failed integrity verification.");
  }
  return migrateWorkspace(bundle.workspace, options);
}
