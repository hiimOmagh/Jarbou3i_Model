import { canonicalStringify, sha256, WorkspaceContractError } from "./workspace-contract.js";
import {
  RECOVERY_JOURNAL_STORE_NAME,
  WORKSPACE_DATABASE_NAME,
  WORKSPACE_DATABASE_VERSION,
} from "./workspace-storage.js";

export const RECOVERY_JOURNAL_CONTRACT = "jarbou3i-editor-recovery@1";
export const RECOVERY_JOURNAL_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function clone(value) { return structuredClone(value); }
function failure(code, message) { return new WorkspaceContractError(code, message); }
function validTimestamp(value) { return typeof value === "string" && Number.isFinite(Date.parse(value)); }

function requestResult(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || failure("RECOVERY_STORAGE_FAILED", "Recovery storage request failed."));
  });
}

function transactionDone(transaction) {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error || failure("RECOVERY_STORAGE_FAILED", "Recovery storage transaction failed."));
    transaction.onabort = () => reject(transaction.error || failure("RECOVERY_STORAGE_INTERRUPTED", "Recovery storage transaction was interrupted."));
  });
}

function integrityPayload(record) {
  const copy = clone(record);
  delete copy.integrity_checksum;
  return copy;
}

export async function createRecoveryRecord({
  workspace,
  payload,
  activePath,
  rawValue,
  clock = () => new Date().toISOString(),
  ttlMs = RECOVERY_JOURNAL_TTL_MS,
  cryptoImpl,
} = {}) {
  if (!workspace?.working_draft || !payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw failure("INVALID_RECOVERY_INPUT", "Recovery requires an anchored workspace and canonical payload.");
  }
  const capturedAt = clock();
  if (!validTimestamp(capturedAt) || !Number.isFinite(ttlMs) || ttlMs <= 0) {
    throw failure("INVALID_RECOVERY_TIMESTAMP", "Recovery timestamps and expiry must be valid.");
  }
  const record = {
    recovery_contract: RECOVERY_JOURNAL_CONTRACT,
    workspace_id: workspace.workspace_id,
    repository_revision: workspace.repository_revision,
    draft_id: workspace.working_draft.draft_id,
    base_revision_id: workspace.working_draft.base_revision_id,
    saved_payload_checksum: workspace.working_draft.payload_checksum,
    captured_at: capturedAt,
    expires_at: new Date(Date.parse(capturedAt) + ttlMs).toISOString(),
    active_path: typeof activePath === "string" && activePath.startsWith("/") ? activePath : "/",
    raw_value: String(rawValue ?? ""),
    canonical_payload: clone(payload),
  };
  record.integrity_checksum = await sha256(integrityPayload(record), cryptoImpl);
  return record;
}

export async function verifyRecoveryRecord(record, {
  workspace,
  now = () => new Date().toISOString(),
  cryptoImpl,
} = {}) {
  if (!record || record.recovery_contract !== RECOVERY_JOURNAL_CONTRACT) {
    throw failure("RECOVERY_CONTRACT_INVALID", "Recovery record contract is unsupported.");
  }
  if (!validTimestamp(record.captured_at) || !validTimestamp(record.expires_at)) {
    throw failure("RECOVERY_TIMESTAMP_INVALID", "Recovery record timestamps are invalid.");
  }
  if (Date.parse(record.expires_at) <= Date.parse(now())) {
    throw failure("RECOVERY_EXPIRED", "Recovery record has expired.");
  }
  const expected = await sha256(integrityPayload(record), cryptoImpl);
  if (expected !== record.integrity_checksum) {
    throw failure("RECOVERY_INTEGRITY_FAILED", "Recovery record checksum does not match.");
  }
  if (workspace) {
    const draft = workspace.working_draft;
    const anchorsMatch = record.workspace_id === workspace.workspace_id
      && record.repository_revision === workspace.repository_revision
      && record.draft_id === draft?.draft_id
      && record.base_revision_id === draft?.base_revision_id
      && record.saved_payload_checksum === draft?.payload_checksum;
    if (!anchorsMatch) throw failure("RECOVERY_STALE", "Recovery record no longer matches the saved workspace draft.");
  }
  return clone(record);
}

export function createIndexedDbRecoveryBackend({
  indexedDB = globalThis.indexedDB,
  databaseName = WORKSPACE_DATABASE_NAME,
} = {}) {
  let connection;
  async function open() {
    if (connection) return connection;
    if (!indexedDB?.open) throw failure("RECOVERY_STORAGE_UNAVAILABLE", "IndexedDB recovery storage is unavailable.");
    const request = indexedDB.open(databaseName, WORKSPACE_DATABASE_VERSION);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(RECOVERY_JOURNAL_STORE_NAME)) {
        const store = database.createObjectStore(RECOVERY_JOURNAL_STORE_NAME, { keyPath: "workspace_id" });
        store.createIndex("expires_at", "expires_at", { unique: false });
      }
    };
    connection = await requestResult(request);
    connection.onversionchange = () => { connection.close(); connection = undefined; };
    return connection;
  }
  async function transaction(mode, operation) {
    const database = await open();
    const tx = database.transaction(RECOVERY_JOURNAL_STORE_NAME, mode);
    const result = await operation(tx.objectStore(RECOVERY_JOURNAL_STORE_NAME));
    await transactionDone(tx);
    return result;
  }
  return Object.freeze({
    kind: "indexeddb",
    async get(workspaceId) { return transaction("readonly", (store) => requestResult(store.get(workspaceId))); },
    async put(record) { return transaction("readwrite", async (store) => { await requestResult(store.put(clone(record))); return clone(record); }); },
    async delete(workspaceId) { return transaction("readwrite", async (store) => { await requestResult(store.delete(workspaceId)); return true; }); },
    async clear() { return transaction("readwrite", async (store) => { await requestResult(store.clear()); return true; }); },
    close() { connection?.close(); connection = undefined; },
  });
}

export function createMemoryRecoveryBackend(initial = []) {
  const records = new Map(initial.map((record) => [record.workspace_id, clone(record)]));
  return Object.freeze({
    kind: "memory",
    async get(workspaceId) { return records.has(workspaceId) ? clone(records.get(workspaceId)) : undefined; },
    async put(record) { records.set(record.workspace_id, clone(record)); return clone(record); },
    async delete(workspaceId) { return records.delete(workspaceId); },
    async clear() { records.clear(); return true; },
    close() {},
  });
}

export function createRecoveryJournal({ backend, cryptoImpl, clock } = {}) {
  if (!backend) throw new TypeError("Recovery journal requires a storage backend.");
  return Object.freeze({
    async capture(input) {
      const record = await createRecoveryRecord({ ...input, cryptoImpl, clock: input.clock || clock });
      return backend.put(record);
    },
    async inspect(workspace) {
      const record = await backend.get(workspace.workspace_id);
      if (!record) return { status: "empty", record: null };
      try {
        return { status: "recoverable", record: await verifyRecoveryRecord(record, { workspace, cryptoImpl, now: clock }) };
      } catch (error) {
        await backend.delete(workspace.workspace_id);
        return { status: error.code === "RECOVERY_EXPIRED" ? "expired" : error.code === "RECOVERY_STALE" ? "stale" : "corrupt", record: null, error_code: error.code };
      }
    },
    async discard(workspaceId) { return backend.delete(workspaceId); },
    async clear() { return backend.clear(); },
    close() { backend.close?.(); },
  });
}

export function recoveryRecordFingerprint(record) {
  return canonicalStringify(integrityPayload(record));
}
