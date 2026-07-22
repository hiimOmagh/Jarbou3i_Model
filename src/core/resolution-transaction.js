/* Commit-grade resolution transactions for immutable canonical revisions. */

import {
  canonicalStringify,
  sha256,
  verifyWorkspace,
  WorkspaceContractError,
} from "./workspace-contract.js";

export const RESOLUTION_PROPOSAL_FORMAT = "jarbou3i-resolution-proposal";
export const RESOLUTION_PROPOSAL_VERSION = 1;
export const RESOLUTION_LEDGER_FORMAT = "jarbou3i-resolution-ledger";
export const RESOLUTION_LEDGER_VERSION = 1;
export const CANONICAL_DIFF_FORMAT = "jarbou3i-canonical-diff";
export const CANONICAL_DIFF_VERSION = 1;

const clone = (value) => structuredClone(value);
const clean = (value) => String(value ?? "").trim();
const isRecord = (value) => Boolean(value) && typeof value === "object" && !Array.isArray(value);
const validDate = (value) => Number.isFinite(Date.parse(value));

function fail(code, message, details = {}) {
  throw new WorkspaceContractError(code, message, details);
}

function pointerToken(value) {
  return String(value).replaceAll("~", "~0").replaceAll("/", "~1");
}

function idFactoryDefault(prefix) {
  const id = globalThis.crypto?.randomUUID?.();
  if (!id) fail("ID_GENERATOR_UNAVAILABLE", "Secure resolution identifiers are unavailable.");
  return `${prefix}_${id}`;
}

function timestamp(clock) {
  const value = typeof clock === "function" ? clock() : new Date().toISOString();
  if (!validDate(value)) fail("INVALID_RESOLUTION_TIMESTAMP", "Resolution timestamps must be ISO-8601 values.");
  return value;
}

function reviewerSnapshot(reviewer) {
  const reviewerId = clean(reviewer?.reviewer_id);
  const displayName = clean(reviewer?.display_name);
  if (!reviewerId || !displayName) {
    fail("RESOLUTION_REVIEWER_REQUIRED", "A stable local reviewer ID and display name are required.");
  }
  return { reviewer_id: reviewerId, display_name: displayName, identity_assurance: "local_assertion" };
}

function diffValues(before, after, path, changes) {
  if (canonicalStringify(before) === canonicalStringify(after)) return;
  if (Array.isArray(before) || Array.isArray(after)) {
    changes.push({ operation: before === undefined ? "add" : after === undefined ? "remove" : "replace", path: path || "/", before: clone(before), after: clone(after) });
    return;
  }
  if (isRecord(before) && isRecord(after)) {
    const keys = [...new Set([...Object.keys(before), ...Object.keys(after)])].sort();
    for (const key of keys) diffValues(before[key], after[key], `${path}/${pointerToken(key)}`, changes);
    return;
  }
  changes.push({ operation: before === undefined ? "add" : after === undefined ? "remove" : "replace", path: path || "/", before: clone(before), after: clone(after) });
}

export function canonicalDiff(before, after) {
  const changes = [];
  diffValues(before, after, "", changes);
  return Object.freeze({
    format: CANONICAL_DIFF_FORMAT,
    format_version: CANONICAL_DIFF_VERSION,
    change_count: changes.length,
    changes: clone(changes),
  });
}

export function createResolutionLedger({ clock } = {}) {
  return {
    format: RESOLUTION_LEDGER_FORMAT,
    format_version: RESOLUTION_LEDGER_VERSION,
    created_at: timestamp(clock),
    head_record_hash: null,
    records: [],
  };
}

function recordBody(record) {
  const { record_hash: ignored, ...body } = record;
  return body;
}

function normalizeValidation(result) {
  return {
    valid: Boolean(result?.valid),
    error_count: Array.isArray(result?.errors) ? result.errors.length : 0,
    warning_count: Array.isArray(result?.warnings) ? result.warnings.length : 0,
    errors: (result?.errors || []).map((issue) => ({
      path: clean(issue?.path || "/"),
      code: clean(issue?.code || "VALIDATION_ERROR"),
      message: clean(issue?.message),
    })),
  };
}

export async function createResolutionProposal(workspace, {
  validate,
  deriveDiagnostics = () => ({}),
  clock,
  idFactory = idFactoryDefault,
  cryptoImpl,
} = {}) {
  if (typeof validate !== "function") fail("RESOLUTION_VALIDATOR_REQUIRED", "A whole-document validator is required.");
  const verified = await verifyWorkspace(workspace, { cryptoImpl });
  const head = verified.revisions.find((revision) => revision.revision_id === verified.head_revision_id);
  const diff = canonicalDiff(head.canonical_payload, verified.working_draft.canonical_payload);
  if (!diff.change_count) fail("NO_RESOLUTION_CHANGES", "The working draft contains no changes to commit.");
  const validation = normalizeValidation(validate(clone(verified.working_draft.canonical_payload)));
  const proposalBody = {
    format: RESOLUTION_PROPOSAL_FORMAT,
    format_version: RESOLUTION_PROPOSAL_VERSION,
    proposal_id: idFactory("proposal"),
    created_at: timestamp(clock),
    workspace_id: verified.workspace_id,
    repository_revision: verified.repository_revision,
    base_revision_id: verified.head_revision_id,
    base_payload_checksum: head.payload_checksum,
    draft_id: verified.working_draft.draft_id,
    draft_checksum: verified.working_draft.payload_checksum,
    diff,
    validation,
    diagnostics_before: clone(deriveDiagnostics(clone(head.canonical_payload))),
    diagnostics_after: clone(deriveDiagnostics(clone(verified.working_draft.canonical_payload))),
    canonical_transport: false,
    approval_required: true,
  };
  return Object.freeze({ ...proposalBody, proposal_checksum: await sha256(proposalBody, cryptoImpl) });
}

function validateProposal(proposal) {
  if (!proposal || proposal.format !== RESOLUTION_PROPOSAL_FORMAT || proposal.format_version !== RESOLUTION_PROPOSAL_VERSION) {
    fail("INVALID_RESOLUTION_PROPOSAL", "Resolution proposal format is unsupported.");
  }
  if (!proposal.approval_required || proposal.canonical_transport !== false || !proposal.diff?.change_count) {
    fail("INVALID_RESOLUTION_PROPOSAL", "Resolution proposal boundaries are malformed.");
  }
}

export async function verifyResolutionLedger(ledger, { workspace, cryptoImpl } = {}) {
  if (!ledger || ledger.format !== RESOLUTION_LEDGER_FORMAT || ledger.format_version !== RESOLUTION_LEDGER_VERSION
      || !validDate(ledger.created_at) || !Array.isArray(ledger.records)) {
    fail("INVALID_RESOLUTION_LEDGER", "Resolution ledger format or metadata is invalid.");
  }
  let previousHash = null;
  const recordIds = new Set();
  for (let index = 0; index < ledger.records.length; index += 1) {
    const record = ledger.records[index];
    if (record.sequence !== index + 1 || record.previous_record_hash !== previousHash || recordIds.has(record.record_id)) {
      fail("RESOLUTION_LEDGER_CHAIN_BROKEN", "Resolution record sequence, identity, or linkage is invalid.", { sequence: index + 1 });
    }
    recordIds.add(record.record_id);
    if (!validDate(record.occurred_at) || !/^[a-f0-9]{64}$/.test(record.record_hash)
        || !/^[a-f0-9]{64}$/.test(record.diff_checksum)
        || !/^[a-f0-9]{64}$/.test(record.proposal_checksum)) {
      fail("INVALID_RESOLUTION_RECORD", "Resolution record provenance is malformed.", { sequence: index + 1 });
    }
    reviewerSnapshot(record.reviewer);
    if (!clean(record.rationale) || record.validation?.valid !== true || record.validation?.error_count !== 0) {
      fail("INVALID_RESOLUTION_RECORD", "Committed resolutions require rationale and a clean validation snapshot.", { sequence: index + 1 });
    }
    if (workspace) {
      if (record.workspace_id !== workspace.workspace_id) fail("RESOLUTION_WORKSPACE_MISMATCH", "Resolution record belongs to another workspace.");
      const committed = workspace.revisions.find((revision) => revision.revision_id === record.committed_revision_id);
      const base = workspace.revisions.find((revision) => revision.revision_id === record.base_revision_id);
      if (!committed || !base || committed.parent_revision_id !== base.revision_id
          || committed.resolution_record_id !== record.record_id
          || committed.payload_checksum !== record.committed_payload_checksum) {
        fail("RESOLUTION_REVISION_MISMATCH", "Resolution record no longer matches immutable revision history.", { sequence: index + 1 });
      }
      const diff = canonicalDiff(base.canonical_payload, committed.canonical_payload);
      if (diff.change_count !== record.change_count || await sha256(diff, cryptoImpl) !== record.diff_checksum) {
        fail("RESOLUTION_DIFF_MISMATCH", "Resolution diff no longer matches its committed revision.", { sequence: index + 1 });
      }
    }
    const expected = await sha256(recordBody(record), cryptoImpl);
    if (expected !== record.record_hash) fail("RESOLUTION_RECORD_HASH_MISMATCH", "A resolution record failed integrity verification.", { sequence: index + 1 });
    previousHash = record.record_hash;
  }
  if (ledger.head_record_hash !== previousHash) fail("RESOLUTION_LEDGER_HEAD_MISMATCH", "Resolution ledger head does not match its record chain.");
  return clone(ledger);
}

export async function commitResolution(workspace, proposal, {
  validate,
  deriveDiagnostics = () => ({}),
  reviewer,
  rationale,
  approved = false,
  clock,
  idFactory = idFactoryDefault,
  cryptoImpl,
} = {}) {
  if (!approved) fail("RESOLUTION_APPROVAL_REQUIRED", "Explicit approval is required before committing a resolution.");
  if (typeof validate !== "function") fail("RESOLUTION_VALIDATOR_REQUIRED", "A whole-document validator is required.");
  const next = await verifyWorkspace(workspace, { cryptoImpl });
  validateProposal(proposal);
  const { proposal_checksum: ignoredProposalChecksum, ...proposalBody } = proposal;
  const expectedProposalChecksum = await sha256(proposalBody, cryptoImpl);
  if (expectedProposalChecksum !== proposal.proposal_checksum) fail("RESOLUTION_PROPOSAL_TAMPERED", "Resolution proposal integrity check failed.");
  if (proposal.workspace_id !== next.workspace_id || proposal.repository_revision !== next.repository_revision
      || proposal.base_revision_id !== next.head_revision_id || proposal.draft_id !== next.working_draft.draft_id
      || proposal.draft_checksum !== next.working_draft.payload_checksum) {
    fail("STALE_RESOLUTION_PROPOSAL", "The workspace changed after this proposal was generated.");
  }
  const validation = normalizeValidation(validate(clone(next.working_draft.canonical_payload)));
  if (!validation.valid || validation.error_count) fail("RESOLUTION_VALIDATION_FAILED", "The full working draft must validate before commit.", { errors: validation.errors });
  const head = next.revisions.find((revision) => revision.revision_id === next.head_revision_id);
  const diff = canonicalDiff(head.canonical_payload, next.working_draft.canonical_payload);
  if (!diff.change_count) fail("NO_RESOLUTION_CHANGES", "The working draft contains no changes to commit.");
  if (await sha256(diff, cryptoImpl) !== await sha256(proposal.diff, cryptoImpl)) fail("STALE_RESOLUTION_DIFF", "The proposed diff no longer matches the working draft.");
  if (await sha256(validation, cryptoImpl) !== await sha256(proposal.validation, cryptoImpl)) fail("STALE_RESOLUTION_VALIDATION", "Validation changed after the proposal was generated.");
  const diagnosticsBefore = clone(deriveDiagnostics(clone(head.canonical_payload)));
  const diagnosticsAfter = clone(deriveDiagnostics(clone(next.working_draft.canonical_payload)));
  if (await sha256(diagnosticsBefore, cryptoImpl) !== await sha256(proposal.diagnostics_before, cryptoImpl)
      || await sha256(diagnosticsAfter, cryptoImpl) !== await sha256(proposal.diagnostics_after, cryptoImpl)) {
    fail("STALE_RESOLUTION_DIAGNOSTICS", "Diagnostics changed after the proposal was generated.");
  }
  const occurredAt = timestamp(clock);
  const reviewerRecord = reviewerSnapshot(reviewer);
  const rationaleText = clean(rationale);
  if (!rationaleText) fail("RESOLUTION_RATIONALE_REQUIRED", "A resolution commit requires a rationale.");
  const revisionId = idFactory("rev");
  const recordId = idFactory("resolution");
  const payload = clone(next.working_draft.canonical_payload);
  const payloadChecksum = await sha256(payload, cryptoImpl);
  const recordBodyValue = {
    record_id: recordId,
    sequence: next.resolution_ledger.records.length + 1,
    occurred_at: occurredAt,
    previous_record_hash: next.resolution_ledger.head_record_hash,
    workspace_id: next.workspace_id,
    repository_revision_before: next.repository_revision,
    proposal_id: proposal.proposal_id,
    proposal_checksum: proposal.proposal_checksum,
    base_revision_id: head.revision_id,
    committed_revision_id: revisionId,
    committed_payload_checksum: payloadChecksum,
    source_draft_id: next.working_draft.draft_id,
    source_draft_checksum: next.working_draft.payload_checksum,
    diff_format: CANONICAL_DIFF_FORMAT,
    diff_version: CANONICAL_DIFF_VERSION,
    change_count: diff.change_count,
    diff_checksum: await sha256(diff, cryptoImpl),
    reviewer: reviewerRecord,
    rationale: rationaleText,
    validation,
    diagnostics_before: diagnosticsBefore,
    diagnostics_after: diagnosticsAfter,
    identity_assurance: "local_assertion",
    approval_mode: "explicit_local_confirmation",
  };
  const record = { ...recordBodyValue, record_hash: await sha256(recordBodyValue, cryptoImpl) };
  next.revisions.push({
    revision_id: revisionId,
    parent_revision_id: head.revision_id,
    kind: "committed_resolution",
    created_at: occurredAt,
    payload_checksum: payloadChecksum,
    canonical_payload: payload,
    resolution_record_id: recordId,
  });
  next.resolution_ledger.records.push(record);
  next.resolution_ledger.head_record_hash = record.record_hash;
  next.head_revision_id = revisionId;
  next.working_draft = {
    draft_id: idFactory("draft"),
    base_revision_id: revisionId,
    updated_at: occurredAt,
    payload_checksum: payloadChecksum,
    canonical_payload: clone(payload),
    dirty: false,
  };
  next.audit_events.push({ event_id: idFactory("evt"), type: "resolution_committed", occurred_at: occurredAt, revision_id: revisionId });
  next.repository_revision += 1;
  next.metadata.updated_at = occurredAt;
  await verifyResolutionLedger(next.resolution_ledger, { workspace: next, cryptoImpl });
  return next;
}
