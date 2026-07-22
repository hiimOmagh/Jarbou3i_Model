import assert from "node:assert/strict";
import fs from "node:fs";
import { canonicalStringify, createWorkspace, migrateWorkspace, verifyWorkspace } from "../src/core/workspace-contract.js";
import { writeEditorDraft } from "../src/core/canonical-editor.js";
import { canonicalDiff, commitResolution, createResolutionProposal, verifyResolutionLedger } from "../src/core/resolution-transaction.js";

const analysis = JSON.parse(fs.readFileSync(new URL("../fixtures/sample-analysis-en.json", import.meta.url), "utf8"));
let sequence = 0;
const idFactory = (prefix) => `${prefix}_resolution_${++sequence}`;
let minute = 0;
const clock = () => `2026-07-22T14:${String(minute++).padStart(2, "0")}:00.000Z`;
const validate = (payload) => ({
  valid: Boolean(payload?.subject?.title),
  errors: payload?.subject?.title ? [] : [{ path: "/subject/title", code: "REQUIRED", message: "Title required" }],
  warnings: [],
});
const diagnostics = (payload) => ({ title_present: Boolean(payload?.subject?.title), evidence_count: payload?.evidence?.items?.length || 0 });
const manifest = { id: "strategic", contractId: "strategic-analysis-v1", schemaVersion: "1.1.0" };

const workspace = await createWorkspace({ analysis, manifest, clock, idFactory });
assert.equal(workspace.format_version, 3);
assert.equal(workspace.resolution_ledger.records.length, 0);
const edited = structuredClone(analysis);
edited.subject.title = "Approved resolution title";
edited.quality_gate.next_improvement = "Verify the remaining source locator.";
const savedDraft = await writeEditorDraft(workspace, edited, { clock });
const proposal = await createResolutionProposal(savedDraft, { validate, deriveDiagnostics: diagnostics, clock, idFactory });
assert.equal(proposal.validation.valid, true);
assert.equal(proposal.diff.change_count, 2);
assert.deepEqual(proposal.diff.changes.map((change) => change.path), ["/quality_gate/next_improvement", "/subject/title"]);
assert.equal(proposal.approval_required, true);
assert.equal(proposal.canonical_transport, false);

await assert.rejects(() => commitResolution(savedDraft, proposal, {
  validate, reviewer: { reviewer_id: "reviewer-local", display_name: "Review Lead" }, rationale: "Approved after source review.", clock, idFactory,
}), (error) => error.code === "RESOLUTION_APPROVAL_REQUIRED");
await assert.rejects(() => commitResolution(savedDraft, proposal, {
  validate,
  deriveDiagnostics: () => ({ changed_after_review: true }),
  reviewer: { reviewer_id: "reviewer-local", display_name: "Review Lead" },
  rationale: "Diagnostics changed.", approved: true, clock, idFactory,
}), (error) => error.code === "STALE_RESOLUTION_DIAGNOSTICS");

const committed = await commitResolution(savedDraft, proposal, {
  validate,
  deriveDiagnostics: diagnostics,
  reviewer: { reviewer_id: "reviewer-local", display_name: "Review Lead" },
  rationale: "Approved after checking the exact two-field diff.",
  approved: true,
  clock,
  idFactory,
});
assert.equal(committed.repository_revision, savedDraft.repository_revision + 1);
assert.equal(committed.revisions.length, 2);
assert.equal(committed.revisions[0].kind, "imported_canonical");
assert.equal(committed.revisions[1].kind, "committed_resolution");
assert.equal(committed.revisions[1].parent_revision_id, committed.revisions[0].revision_id);
assert.equal(committed.head_revision_id, committed.revisions[1].revision_id);
assert.equal(committed.working_draft.base_revision_id, committed.head_revision_id);
assert.equal(committed.working_draft.dirty, false);
assert.equal(committed.resolution_ledger.records.length, 1);
assert.equal(committed.resolution_ledger.records[0].change_count, 2);
assert.equal(canonicalStringify(committed.revisions[0].canonical_payload), canonicalStringify(analysis), "commit mutated imported revision");
await verifyWorkspace(committed);

const tampered = structuredClone(committed);
tampered.resolution_ledger.records[0].rationale = "Rewritten history";
await assert.rejects(() => verifyResolutionLedger(tampered.resolution_ledger, { workspace: tampered }), (error) => error.code === "RESOLUTION_RECORD_HASH_MISMATCH");
const staleDraft = await writeEditorDraft(savedDraft, { ...edited, subject: { ...edited.subject, title: "Changed after proposal" } }, { clock });
await assert.rejects(() => commitResolution(staleDraft, proposal, {
  validate, reviewer: { reviewer_id: "reviewer-local", display_name: "Review Lead" }, rationale: "Stale", approved: true, clock, idFactory,
}), (error) => error.code === "STALE_RESOLUTION_PROPOSAL");
await assert.rejects(() => createResolutionProposal(workspace, { validate, clock, idFactory }), (error) => error.code === "NO_RESOLUTION_CHANGES");
assert.equal(canonicalDiff({ a: 1 }, { a: 2, b: true }).change_count, 2);

const versionTwo = structuredClone(workspace);
versionTwo.format_version = 2;
delete versionTwo.resolution_ledger;
const migrated = await migrateWorkspace(versionTwo);
assert.equal(migrated.format_version, 3);
assert.equal(migrated.resolution_ledger.records.length, 0, "migration invented resolution history");

console.log("Resolution proposal, exact diff, approval, commit, regeneration, and tamper checks passed.");
