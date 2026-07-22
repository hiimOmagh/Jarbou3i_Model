import assert from "node:assert/strict";
import fs from "node:fs";
import { createWorkspace, canonicalStringify, verifyWorkspace } from "../src/core/workspace-contract.js";
import {
  appendReviewEvent,
  projectReviewLedger,
  reviewLedgerManifest,
  reviewTaskKey,
  verifyReviewLedger,
} from "../src/core/review-ledger.js";

const analysis = JSON.parse(fs.readFileSync(new URL("../fixtures/sample-analysis-en.json", import.meta.url), "utf8"));
let id = 0;
const idFactory = (prefix) => `${prefix}_ledger_${++id}`;
let minute = 0;
const clock = () => `2026-07-22T12:${String(minute++).padStart(2, "0")}:00.000Z`;
const task = {
  id: "RQ001", phase: "verify_provenance", reasonCode: "untraceable_source",
  targetType: "evidence", targetId: "E1", ownerId: "", canonicalPath: "/evidence/items/0",
};
const reviewer = { reviewer_id: "local-reviewer-1", display_name: "Review Lead" };
const workspace = await createWorkspace({
  analysis,
  manifest: { id: "strategic", contractId: "strategic-analysis-v1", schemaVersion: "1.1.0" },
  clock,
  idFactory,
});
const canonicalBefore = canonicalStringify(workspace.working_draft.canonical_payload);
const taskKey = await reviewTaskKey(task);
assert.equal(await reviewTaskKey({ ...task, id: "RQ099" }), taskKey, "display sequence changed semantic task identity");

let next = await appendReviewEvent(workspace, {
  type: "task_started", task, reviewer, rationale: "Verify the source before publication.", clock, idFactory,
});
assert.equal(next.repository_revision, 2, "review transaction must increment repository revision once");
assert.equal(canonicalStringify(next.working_draft.canonical_payload), canonicalBefore, "review event changed canonical draft");
assert.equal(projectReviewLedger(next.review_ledger).tasks.get(taskKey).status, "in_review");

next = await appendReviewEvent(next, {
  type: "note_added", task, reviewer, note: "Publisher record located; page reference pending.", clock, idFactory,
});
next = await appendReviewEvent(next, {
  type: "task_waived", task, reviewer,
  rationale: "Proceed only for internal review while the archive is unavailable.",
  waiver: { scope: "Internal review export only", accepted_risk: "Citation cannot yet be independently opened", expires_at: "2026-08-22T00:00:00.000Z" },
  clock, idFactory,
});
let projected = projectReviewLedger(next.review_ledger).tasks.get(taskKey);
assert.equal(projected.status, "waived");
assert.equal(projected.notes.length, 1);
assert.equal(projected.waiver.scope, "Internal review export only");

next = await appendReviewEvent(next, {
  type: "task_reopened", task, reviewer, rationale: "Archive access was restored; verification resumes.", clock, idFactory,
});
next = await appendReviewEvent(next, {
  type: "task_completed", task, reviewer, rationale: "Source identity, locator, and claim fit were verified.", clock, idFactory,
});
projected = projectReviewLedger(next.review_ledger).tasks.get(taskKey);
assert.equal(projected.status, "completed");
assert.equal(next.review_ledger.events.length, 5);
assert.equal(next.review_ledger.head_event_hash, next.review_ledger.events.at(-1).event_hash);
assert.equal((await reviewLedgerManifest(next, { tasks: [task] })).completion_validates_conclusions, false);
assert.equal((await reviewLedgerManifest(next, { tasks: [task] })).identity_assurance, "local_assertion");
await verifyWorkspace(next);

const tampered = structuredClone(next.review_ledger);
tampered.events[1].note = "History rewritten";
await assert.rejects(() => verifyReviewLedger(tampered), (error) => error.code === "REVIEW_EVENT_HASH_MISMATCH");
await assert.rejects(() => appendReviewEvent(next, {
  type: "task_completed", task, reviewer, rationale: "Invalid duplicate completion", clock, idFactory,
}), (error) => error.code === "INVALID_REVIEW_TRANSITION");
await assert.rejects(() => appendReviewEvent(workspace, {
  type: "task_waived", task, reviewer, rationale: "Missing risk record", waiver: { scope: "all" }, clock, idFactory,
}), (error) => error.code === "INVALID_REVIEW_WAIVER");

console.log("Operational review ledger integrity, transition, waiver, reopening, and canonical-boundary checks passed.");
