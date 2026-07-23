import assert from "node:assert/strict";
import fs from "node:fs";
import { createWorkspace } from "../src/core/workspace-contract.js";
import {
  createMemoryRecoveryBackend,
  createRecoveryJournal,
  createRecoveryRecord,
  verifyRecoveryRecord,
} from "../src/core/recovery-journal.js";

const analysis = JSON.parse(fs.readFileSync(new URL("../fixtures/sample-analysis-en.json", import.meta.url), "utf8"));
const ids = ["ws_recovery", "rev_recovery", "draft_recovery", "evt_recovery"];
const workspace = await createWorkspace({
  analysis,
  manifest: { id: "strategic", contractId: "strategic-analysis-v1", schemaVersion: "1.1.0" },
  clock: () => "2026-07-23T10:00:00.000Z",
  idFactory: () => ids.shift(),
});
const clock = () => "2026-07-23T10:05:00.000Z";
const journal = createRecoveryJournal({ backend: createMemoryRecoveryBackend(), clock });
const payload = structuredClone(workspace.working_draft.canonical_payload);
payload.subject.title = "Interrupted recovery proof";

const captured = await journal.capture({
  workspace,
  payload,
  activePath: "/subject",
  rawValue: '{"title":"Interrupted',
});
assert.equal(captured.repository_revision, workspace.repository_revision);
assert.equal(captured.saved_payload_checksum, workspace.working_draft.payload_checksum);
assert.equal((await journal.inspect(workspace)).status, "recoverable");
assert.equal((await journal.inspect(workspace)).record.raw_value, '{"title":"Interrupted');

const tampered = structuredClone(captured);
tampered.raw_value = "tampered";
await assert.rejects(() => verifyRecoveryRecord(tampered, { workspace, now: clock }), (error) => error.code === "RECOVERY_INTEGRITY_FAILED");

const staleWorkspace = structuredClone(workspace);
staleWorkspace.repository_revision += 1;
const staleJournal = createRecoveryJournal({ backend: createMemoryRecoveryBackend([captured]), clock });
assert.equal((await staleJournal.inspect(staleWorkspace)).status, "stale");
assert.equal((await staleJournal.inspect(workspace)).status, "empty", "stale recovery was not removed");

const expired = await createRecoveryRecord({
  workspace,
  payload,
  activePath: "/subject",
  rawValue: "{}",
  clock: () => "2026-07-01T00:00:00.000Z",
  ttlMs: 1000,
});
await assert.rejects(
  () => verifyRecoveryRecord(expired, { workspace, now: () => "2026-07-01T00:00:02.000Z" }),
  (error) => error.code === "RECOVERY_EXPIRED",
);

await journal.discard(workspace.workspace_id);
assert.equal((await journal.inspect(workspace)).status, "empty");
console.log("Crash-safe editor recovery contract checks passed.");
