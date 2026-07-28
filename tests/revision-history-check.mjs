import assert from "node:assert/strict";
import fs from "node:fs";
import { createWorkspace, verifyWorkspace } from "../src/core/workspace-contract.js";
import { writeEditorDraft } from "../src/core/canonical-editor.js";
import { commitResolution, createResolutionProposal, verifyResolutionLedger } from "../src/core/resolution-transaction.js";
import { compareRevisions, prepareRevisionRestore, projectRevisionHistory } from "../src/core/revision-history.js";

const analysis = JSON.parse(fs.readFileSync(new URL("../fixtures/sample-analysis-en.json", import.meta.url), "utf8"));
const manifest = { id: "strategic", contractId: "strategic-analysis-v1", schemaVersion: "1.1.0" };
let sequence = 0;
let minute = 0;
const idFactory = (prefix) => `${prefix}_history_${++sequence}`;
const clock = () => `2026-07-28T09:${String(minute++).padStart(2, "0")}:00.000Z`;
const validate = (payload) => ({
  valid: Boolean(payload?.subject?.title),
  errors: payload?.subject?.title ? [] : [{ path: "/subject/title", code: "REQUIRED", message: "Title required" }],
  warnings: [],
});
const diagnostics = (payload) => ({ title: payload?.subject?.title, evidence_count: payload?.evidence?.items?.length || 0 });
const reviewer = { reviewer_id: "reviewer-history", display_name: "History Reviewer" };

async function commitTitle(workspace, title) {
  const payload = structuredClone(workspace.working_draft.canonical_payload);
  payload.subject.title = title;
  const draft = await writeEditorDraft(workspace, payload, { clock });
  const proposal = await createResolutionProposal(draft, { validate, deriveDiagnostics: diagnostics, clock, idFactory });
  return commitResolution(draft, proposal, {
    validate,
    deriveDiagnostics: diagnostics,
    reviewer,
    rationale: `Approve ${title}.`,
    approved: true,
    clock,
    idFactory,
  });
}

const imported = await createWorkspace({ analysis, manifest, clock, idFactory });
const second = await commitTitle(imported, "Second immutable revision");
const third = await commitTitle(second, "Third immutable revision");
const importedRevisionId = third.imported_revision_id;
const thirdRevisionId = third.head_revision_id;

const history = await projectRevisionHistory(third);
assert.equal(history.revision_count, 3);
assert.equal(history.revisions[0].is_imported, true);
assert.equal(history.revisions[2].is_head, true);
assert.equal(history.revisions[0].child_count, 1);
assert.equal(history.draft_dirty, false);

const comparison = await compareRevisions(third, {
  baseRevisionId: thirdRevisionId,
  targetRevisionId: importedRevisionId,
});
assert.equal(comparison.identical, false);
assert.ok(comparison.diff.changes.some((change) => change.path === "/subject/title"));

const prepared = await prepareRevisionRestore(third, {
  sourceRevisionId: importedRevisionId,
  validate,
  deriveDiagnostics: diagnostics,
  clock,
  idFactory,
});
assert.equal(prepared.workspace.repository_revision, third.repository_revision, "restore preparation persisted a write");
assert.equal(prepared.workspace.head_revision_id, thirdRevisionId, "restore preparation moved the head backward");
assert.equal(prepared.proposal.transaction.type, "revision_restore");
assert.equal(prepared.proposal.transaction.source_revision_id, importedRevisionId);
assert.equal(prepared.proposal.base_revision_id, thirdRevisionId);

await assert.rejects(() => commitResolution(prepared.workspace, prepared.proposal, {
  validate,
  deriveDiagnostics: diagnostics,
  reviewer,
  rationale: "Missing explicit approval.",
  clock,
  idFactory,
}), (error) => error.code === "RESOLUTION_APPROVAL_REQUIRED");

const restored = await commitResolution(prepared.workspace, prepared.proposal, {
  validate,
  deriveDiagnostics: diagnostics,
  reviewer,
  rationale: "Restore the imported analysis after exact comparison.",
  approved: true,
  clock,
  idFactory,
});
assert.equal(restored.revisions.length, 4);
assert.equal(restored.revisions[3].kind, "restored_revision");
assert.equal(restored.revisions[3].parent_revision_id, thirdRevisionId);
assert.equal(restored.revisions[3].restored_from_revision_id, importedRevisionId);
assert.equal(restored.revisions[3].payload_checksum, restored.revisions[0].payload_checksum);
assert.equal(restored.head_revision_id, restored.revisions[3].revision_id);
assert.equal(restored.working_draft.base_revision_id, restored.head_revision_id);
assert.equal(restored.resolution_ledger.records[2].transaction.source_revision_id, importedRevisionId);
assert.equal(restored.audit_events.at(-1).type, "revision_restored");
assert.equal(restored.audit_events.at(-1).source_revision_id, importedRevisionId);
await verifyWorkspace(restored);

const sourceTamper = structuredClone(restored);
sourceTamper.resolution_ledger.records[2].transaction.source_revision_id = second.head_revision_id;
await assert.rejects(
  () => verifyResolutionLedger(sourceTamper.resolution_ledger, { workspace: sourceTamper }),
  (error) => ["RESTORE_PROVENANCE_MISMATCH", "RESOLUTION_RECORD_HASH_MISMATCH"].includes(error.code),
);

const dirty = await writeEditorDraft(third, {
  ...third.working_draft.canonical_payload,
  subject: { ...third.working_draft.canonical_payload.subject, title: "Uncommitted work" },
}, { clock });
await assert.rejects(
  () => prepareRevisionRestore(dirty, { sourceRevisionId: importedRevisionId, validate }),
  (error) => error.code === "DIRTY_DRAFT_BLOCKS_RESTORE",
);
await assert.rejects(
  () => prepareRevisionRestore(third, { sourceRevisionId: thirdRevisionId, validate }),
  (error) => error.code === "HEAD_REVISION_CANNOT_BE_RESTORED",
);
await assert.rejects(
  () => compareRevisions(third, { baseRevisionId: "missing", targetRevisionId: importedRevisionId }),
  (error) => error.code === "REVISION_NOT_FOUND",
);

console.log("Revision history, exact comparison, append-only restore, and tamper checks passed.");
