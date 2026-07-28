import { expect, test } from "@playwright/test";

const DATABASE_NAME = "jarbou3i-model-workspaces";
const WORKSPACE_STORE = "workspaces";
const RECOVERY_STORE = "recovery-journal";

export const INDEXED_DB_OPERATION_TIMEOUT_MS = 10_000;

const LONG_WORKFLOW_BUDGETS = Object.freeze({
  "review-ledger-persistence-staleness": Object.freeze({
    defaultTimeoutMs: 60_000,
    defaultDurationBudgetMs: 55_000,
    webkitTimeoutMs: 90_000,
    webkitDurationBudgetMs: 80_000,
  }),
  "revision-history-dirty-localization": Object.freeze({
    defaultTimeoutMs: 60_000,
    defaultDurationBudgetMs: 55_000,
    webkitTimeoutMs: 90_000,
    webkitDurationBudgetMs: 80_000,
  }),
});

async function workspaceDatabaseOperation(page, operation) {
  return page.evaluate(
    ({ databaseName, workspaceStore, recoveryStore, operationName, timeoutMs }) =>
      new Promise((resolve, reject) => {
        let database;
        let result;
        let settled = false;

        const finish = (error, value) => {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          database?.close();
          if (error) reject(error);
          else resolve(value);
        };
        const fail = (message, cause) => {
          const suffix = cause?.message ? `: ${cause.message}` : "";
          finish(new Error(`${message}${suffix}`));
        };
        const timer = setTimeout(
          () => fail(`IndexedDB ${operationName} exceeded ${timeoutMs} ms`),
          timeoutMs,
        );
        const openRequest = indexedDB.open(databaseName);
        const emptyDatabaseResult = operationName === "count-workspaces"
          ? 0
          : operationName === "first-workspace"
            ? null
            : true;

        openRequest.onerror = () =>
          fail(`IndexedDB ${operationName} could not open ${databaseName}`, openRequest.error);
        openRequest.onupgradeneeded = () => {
          const upgradeTransaction = openRequest.transaction;
          if (!upgradeTransaction) {
            fail(`IndexedDB ${operationName} could not inspect empty database creation`);
            return;
          }
          openRequest.onerror = () => finish(null, emptyDatabaseResult);
          try {
            upgradeTransaction.abort();
          } catch (error) {
            fail(`IndexedDB ${operationName} could not abort empty database creation`, error);
          }
        };
        openRequest.onsuccess = () => {
          database = openRequest.result;
          if (!database.objectStoreNames.contains(workspaceStore)) {
            fail(`IndexedDB ${operationName} could not find ${workspaceStore}`);
            return;
          }

          const clearAll = operationName === "clear-all";
          const stores = clearAll && database.objectStoreNames.contains(recoveryStore)
            ? [workspaceStore, recoveryStore]
            : [workspaceStore];
          const mode = operationName.startsWith("clear-") ? "readwrite" : "readonly";
          let transaction;
          try {
            transaction = database.transaction(stores, mode);
          } catch (error) {
            fail(`IndexedDB ${operationName} could not start a transaction`, error);
            return;
          }

          transaction.onerror = () =>
            fail(`IndexedDB ${operationName} transaction failed`, transaction.error);
          transaction.onabort = () =>
            fail(`IndexedDB ${operationName} transaction aborted`, transaction.error);
          transaction.oncomplete = () => finish(null, result);

          const store = transaction.objectStore(workspaceStore);
          if (operationName === "clear-all") {
            store.clear();
            if (stores.includes(recoveryStore)) {
              transaction.objectStore(recoveryStore).clear();
            }
            result = true;
          } else if (operationName === "clear-workspaces") {
            store.clear();
            result = true;
          } else if (operationName === "count-workspaces") {
            const request = store.count();
            request.onsuccess = () => { result = request.result; };
            request.onerror = () =>
              fail(`IndexedDB ${operationName} request failed`, request.error);
          } else if (operationName === "first-workspace") {
            const request = store.getAll();
            request.onsuccess = () => { result = request.result[0] ?? null; };
            request.onerror = () =>
              fail(`IndexedDB ${operationName} request failed`, request.error);
          } else {
            transaction.abort();
            fail(`Unsupported IndexedDB test operation: ${operationName}`);
          }
        };
      }),
    {
      databaseName: DATABASE_NAME,
      workspaceStore: WORKSPACE_STORE,
      recoveryStore: RECOVERY_STORE,
      operationName: operation,
      timeoutMs: INDEXED_DB_OPERATION_TIMEOUT_MS,
    },
  );
}

export function clearWorkspaceStorage(page) {
  return workspaceDatabaseOperation(page, "clear-all");
}

export function clearWorkspaceRecords(page) {
  return workspaceDatabaseOperation(page, "clear-workspaces");
}

export function countWorkspaceRecords(page) {
  return workspaceDatabaseOperation(page, "count-workspaces");
}

export function readFirstWorkspace(page) {
  return workspaceDatabaseOperation(page, "first-workspace");
}

export function beginLongPersistenceWorkflow(testInfo, workflowName) {
  const policy = LONG_WORKFLOW_BUDGETS[workflowName];
  if (!policy) {
    throw new Error(`Unregistered long persistence workflow: ${workflowName}`);
  }

  const isWebKit = testInfo.project.name === "webkit";
  const timeoutMs = isWebKit ? policy.webkitTimeoutMs : policy.defaultTimeoutMs;
  const durationBudgetMs = isWebKit
    ? policy.webkitDurationBudgetMs
    : policy.defaultDurationBudgetMs;
  const startedAt = performance.now();
  test.setTimeout(timeoutMs);
  testInfo.annotations.push({
    type: "duration-budget",
    description: `${workflowName}:${durationBudgetMs}/${timeoutMs}ms`,
  });

  return async function finishLongPersistenceWorkflow() {
    const durationMs = Math.round(performance.now() - startedAt);
    const record = {
      workflow: workflowName,
      project: testInfo.project.name,
      duration_ms: durationMs,
      duration_budget_ms: durationBudgetMs,
      timeout_ms: timeoutMs,
    };
    console.log(`[long-workflow-budget] ${JSON.stringify(record)}`);
    await testInfo.attach("long-workflow-duration.json", {
      body: Buffer.from(`${JSON.stringify(record, null, 2)}\n`),
      contentType: "application/json",
    });
    expect(
      durationMs,
      `${workflowName} exceeded its ${durationBudgetMs} ms duration budget`,
    ).toBeLessThanOrEqual(durationBudgetMs);
  };
}
