/* Read-only revision history and append-only safe-restore preparation. */

import { canonicalDiff, createResolutionProposal } from "./resolution-transaction.js";
import { canonicalStringify, verifyWorkspace, WorkspaceContractError } from "./workspace-contract.js";

const clone = (value) => structuredClone(value);

function fail(code, message, details = {}) {
  throw new WorkspaceContractError(code, message, details);
}

function defaultId(prefix) {
  const value = globalThis.crypto?.randomUUID?.();
  if (!value) fail("ID_GENERATOR_UNAVAILABLE", "Secure restore identifiers are unavailable.");
  return `${prefix}_${value}`;
}

function timestamp(clock) {
  const value = typeof clock === "function" ? clock() : new Date().toISOString();
  if (!Number.isFinite(Date.parse(value))) {
    fail("INVALID_RESTORE_TIMESTAMP", "Restore timestamps must be ISO-8601 values.");
  }
  return value;
}

function revisionById(workspace, revisionId) {
  const revision = workspace.revisions.find((item) => item.revision_id === revisionId);
  if (!revision) fail("REVISION_NOT_FOUND", "The selected revision does not exist in this workspace.", { revision_id: revisionId });
  return revision;
}

export async function projectRevisionHistory(workspace, { cryptoImpl } = {}) {
  const verified = await verifyWorkspace(workspace, { cryptoImpl });
  const children = new Map();
  for (const revision of verified.revisions) {
    if (!revision.parent_revision_id) continue;
    children.set(revision.parent_revision_id, (children.get(revision.parent_revision_id) || 0) + 1);
  }
  return Object.freeze({
    workspace_id: verified.workspace_id,
    repository_revision: verified.repository_revision,
    head_revision_id: verified.head_revision_id,
    draft_dirty: Boolean(verified.working_draft.dirty),
    revision_count: verified.revisions.length,
    revisions: verified.revisions.map((revision, index) => Object.freeze({
      revision_id: revision.revision_id,
      parent_revision_id: revision.parent_revision_id,
      kind: revision.kind,
      created_at: revision.created_at,
      payload_checksum: revision.payload_checksum,
      resolution_record_id: revision.resolution_record_id || null,
      restored_from_revision_id: revision.restored_from_revision_id || null,
      is_imported: revision.revision_id === verified.imported_revision_id,
      is_head: revision.revision_id === verified.head_revision_id,
      child_count: children.get(revision.revision_id) || 0,
      sequence: index + 1,
    })),
  });
}

export async function compareRevisions(workspace, {
  baseRevisionId,
  targetRevisionId,
  cryptoImpl,
} = {}) {
  const verified = await verifyWorkspace(workspace, { cryptoImpl });
  const base = revisionById(verified, baseRevisionId);
  const target = revisionById(verified, targetRevisionId);
  return Object.freeze({
    workspace_id: verified.workspace_id,
    repository_revision: verified.repository_revision,
    base_revision_id: base.revision_id,
    target_revision_id: target.revision_id,
    base_payload_checksum: base.payload_checksum,
    target_payload_checksum: target.payload_checksum,
    identical: canonicalStringify(base.canonical_payload) === canonicalStringify(target.canonical_payload),
    diff: canonicalDiff(base.canonical_payload, target.canonical_payload),
  });
}

export async function prepareRevisionRestore(workspace, {
  sourceRevisionId,
  validate,
  deriveDiagnostics = () => ({}),
  clock,
  idFactory = defaultId,
  cryptoImpl,
} = {}) {
  const verified = await verifyWorkspace(workspace, { cryptoImpl });
  if (verified.working_draft.dirty) {
    fail("DIRTY_DRAFT_BLOCKS_RESTORE", "Save and commit or discard the current draft before restoring history.");
  }
  const source = revisionById(verified, sourceRevisionId);
  const head = revisionById(verified, verified.head_revision_id);
  if (source.revision_id === head.revision_id) {
    fail("HEAD_REVISION_CANNOT_BE_RESTORED", "The selected revision is already the current head.");
  }
  const diff = canonicalDiff(head.canonical_payload, source.canonical_payload);
  if (!diff.change_count) {
    fail("RESTORE_HAS_NO_CHANGES", "The selected revision has the same canonical payload as the current head.");
  }
  const occurredAt = timestamp(clock);
  const preparedWorkspace = clone(verified);
  preparedWorkspace.working_draft = {
    draft_id: idFactory("draft"),
    base_revision_id: head.revision_id,
    updated_at: occurredAt,
    payload_checksum: source.payload_checksum,
    canonical_payload: clone(source.canonical_payload),
    dirty: true,
  };
  const transaction = {
    type: "revision_restore",
    source_revision_id: source.revision_id,
    source_payload_checksum: source.payload_checksum,
    source_revision_kind: source.kind,
  };
  const proposal = await createResolutionProposal(preparedWorkspace, {
    validate,
    deriveDiagnostics,
    transaction,
    clock: () => occurredAt,
    idFactory,
    cryptoImpl,
  });
  return Object.freeze({
    workspace: preparedWorkspace,
    proposal,
    source_revision: clone(source),
    current_head_revision: clone(head),
  });
}
