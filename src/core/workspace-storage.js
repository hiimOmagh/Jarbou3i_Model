/* Durable workspace storage abstraction with optimistic concurrency. */

import { migrateWorkspace, verifyWorkspace, WorkspaceContractError } from "./workspace-contract.js";

export const WORKSPACE_DATABASE_NAME = "jarbou3i-model-workspaces";
export const WORKSPACE_DATABASE_VERSION = 1;
export const WORKSPACE_STORE_NAME = "workspaces";

export class WorkspaceStorageError extends Error {
  constructor(code, message, cause) {
    super(message, cause ? { cause } : undefined);
    this.name = "WorkspaceStorageError";
    this.code = code;
  }
}

function storageError(code, message, cause) {
  return new WorkspaceStorageError(code, message, cause);
}

function requestResult(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || storageError("REQUEST_FAILED", "Storage request failed."));
  });
}

function transactionDone(transaction) {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error || storageError("TRANSACTION_FAILED", "Storage transaction failed."));
    transaction.onabort = () => reject(transaction.error || storageError("TRANSACTION_ABORTED", "Storage transaction was interrupted."));
  });
}

function mapStorageFailure(error) {
  if (error instanceof WorkspaceStorageError || error instanceof WorkspaceContractError) return error;
  if (error?.name === "QuotaExceededError") {
    return storageError("STORAGE_QUOTA_EXCEEDED", "Local workspace storage quota is exhausted.", error);
  }
  if (error?.name === "SecurityError" || error?.name === "InvalidStateError") {
    return storageError("STORAGE_UNAVAILABLE", "Durable local storage is unavailable.", error);
  }
  return storageError("STORAGE_FAILURE", "Durable local storage failed.", error);
}

export function createIndexedDbWorkspaceBackend({
  indexedDB = globalThis.indexedDB,
  databaseName = WORKSPACE_DATABASE_NAME,
} = {}) {
  let connection;

  async function open() {
    if (connection) return connection;
    if (!indexedDB?.open) throw storageError("STORAGE_UNAVAILABLE", "IndexedDB is unavailable.");
    try {
      const request = indexedDB.open(databaseName, WORKSPACE_DATABASE_VERSION);
      request.onupgradeneeded = () => {
        const database = request.result;
        if (!database.objectStoreNames.contains(WORKSPACE_STORE_NAME)) {
          const store = database.createObjectStore(WORKSPACE_STORE_NAME, { keyPath: "workspace_id" });
          store.createIndex("updated_at", "metadata.updated_at", { unique: false });
          store.createIndex("archived_at", "metadata.archived_at", { unique: false });
        }
      };
      connection = await requestResult(request);
      connection.onversionchange = () => {
        connection.close();
        connection = undefined;
      };
      return connection;
    } catch (error) {
      throw mapStorageFailure(error);
    }
  }

  async function transaction(mode, operation) {
    try {
      const database = await open();
      const tx = database.transaction(WORKSPACE_STORE_NAME, mode);
      const store = tx.objectStore(WORKSPACE_STORE_NAME);
      const result = await operation(store, tx);
      await transactionDone(tx);
      return result;
    } catch (error) {
      throw mapStorageFailure(error);
    }
  }

  return Object.freeze({
    kind: "indexeddb",
    async list() {
      return transaction("readonly", (store) => requestResult(store.getAll()));
    },
    async get(id) {
      return transaction("readonly", (store) => requestResult(store.get(id)));
    },
    async put(value, { expectedRevision = null, createOnly = false } = {}) {
      return transaction("readwrite", async (store, tx) => {
        const current = await requestResult(store.get(value.workspace_id));
        if (createOnly && current) {
          tx.abort();
          throw storageError("WORKSPACE_EXISTS", "Workspace already exists.");
        }
        if (expectedRevision !== null && current?.repository_revision !== expectedRevision) {
          tx.abort();
          throw storageError("WRITE_CONFLICT", "Workspace changed in another browser context.");
        }
        await requestResult(store.put(structuredClone(value)));
        return structuredClone(value);
      });
    },
    async delete(id, { expectedRevision = null } = {}) {
      return transaction("readwrite", async (store, tx) => {
        const current = await requestResult(store.get(id));
        if (!current) return false;
        if (expectedRevision !== null && current.repository_revision !== expectedRevision) {
          tx.abort();
          throw storageError("WRITE_CONFLICT", "Workspace changed in another browser context.");
        }
        await requestResult(store.delete(id));
        return true;
      });
    },
    close() {
      connection?.close();
      connection = undefined;
    },
  });
}

export function createMemoryWorkspaceBackend(initial = []) {
  const values = new Map(initial.map((value) => [value.workspace_id, structuredClone(value)]));
  return Object.freeze({
    kind: "memory",
    async list() { return [...values.values()].map((value) => structuredClone(value)); },
    async get(id) { return values.has(id) ? structuredClone(values.get(id)) : undefined; },
    async put(value, { expectedRevision = null, createOnly = false } = {}) {
      const current = values.get(value.workspace_id);
      if (createOnly && current) throw storageError("WORKSPACE_EXISTS", "Workspace already exists.");
      if (expectedRevision !== null && current?.repository_revision !== expectedRevision) {
        throw storageError("WRITE_CONFLICT", "Workspace changed in another browser context.");
      }
      values.set(value.workspace_id, structuredClone(value));
      return structuredClone(value);
    },
    async delete(id, { expectedRevision = null } = {}) {
      const current = values.get(id);
      if (!current) return false;
      if (expectedRevision !== null && current.repository_revision !== expectedRevision) {
        throw storageError("WRITE_CONFLICT", "Workspace changed in another browser context.");
      }
      return values.delete(id);
    },
    close() {},
  });
}

export function createWorkspaceRepository({ backend, cryptoImpl } = {}) {
  if (!backend) throw new TypeError("Workspace repository requires a storage backend.");
  return Object.freeze({
    backendKind: backend.kind || "custom",
    async list({ includeArchived = false } = {}) {
      const values = await backend.list();
      return values
        .filter((item) => includeArchived || !item.metadata?.archived_at)
        .sort((a, b) => String(b.metadata?.updated_at).localeCompare(String(a.metadata?.updated_at)))
        .map((item) => ({
          workspace_id: item.workspace_id,
          repository_revision: item.repository_revision,
          metadata: structuredClone(item.metadata),
          analysis_identity: structuredClone(item.analysis_identity),
          head_revision_id: item.head_revision_id,
          dirty: Boolean(item.working_draft?.dirty),
        }));
    },
    async get(id) {
      const value = await backend.get(id);
      return value ? migrateWorkspace(value, { cryptoImpl }) : undefined;
    },
    async create(workspace) {
      const verified = await verifyWorkspace(workspace, { cryptoImpl });
      return backend.put(verified, { createOnly: true });
    },
    async replace(workspace, { expectedRevision } = {}) {
      if (!Number.isInteger(expectedRevision) || expectedRevision < 1) {
        throw storageError("EXPECTED_REVISION_REQUIRED", "Safe replacement requires the previously read repository revision.");
      }
      const verified = await verifyWorkspace(workspace, { cryptoImpl });
      if (verified.repository_revision !== expectedRevision + 1) {
        throw storageError("INVALID_REVISION_INCREMENT", "Workspace replacement must increment repository revision exactly once.");
      }
      return backend.put(verified, { expectedRevision });
    },
    async remove(id, { expectedRevision } = {}) {
      return backend.delete(id, { expectedRevision });
    },
    close() { backend.close?.(); },
  });
}
