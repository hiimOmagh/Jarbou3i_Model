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
        const emptyDatabaseResult = operationName === "workspace-recovery-records" ? { workspaces: [], recovery: [] }
          : ["count-workspaces", "count-recovery-snapshots"].includes(operationName)
          ? 0
          : ["first-workspace", "intake-draft"].includes(operationName)
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
          const stores = ["intake-draft", "count-recovery-snapshots", "workspace-recovery-records"].includes(operationName)
            || (clearAll && database.objectStoreNames.contains(recoveryStore))
            ? [workspaceStore, recoveryStore]
            : [workspaceStore];
          const mode = operationName.startsWith("clear-") || operationName === "damage-first-workspace" ? "readwrite" : "readonly";
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
          } else if (operationName === "intake-draft") {
            // Each tab keeps its own, under the ID it holds for the session.
            const tab = sessionStorage.getItem("jarbou3i-tab");
            const request = transaction.objectStore(recoveryStore).get(tab ? `intake-draft:${tab}` : "intake-draft");
            request.onsuccess = () => { result = request.result ?? null; };
            request.onerror = () =>
              fail(`IndexedDB ${operationName} request failed`, request.error);
          } else if (operationName === "count-recovery-snapshots") {
            // Editor snapshots are keyed by workspace; intake drafts share the store.
            const request = transaction.objectStore(recoveryStore).getAllKeys();
            request.onsuccess = () => {
              result = request.result.filter((key) => !String(key).startsWith("intake-draft")).length;
            };
            request.onerror = () =>
              fail(`IndexedDB ${operationName} request failed`, request.error);
          } else if (operationName === "damage-first-workspace") {
            // The stored draft no longer matches its checksum, as after damage.
            const request = store.getAll();
            request.onsuccess = () => {
              const record = request.result[0];
              if (!record) return;
              record.working_draft.payload_checksum = "damaged";
              store.put(record);
              result = true;
            };
            request.onerror = () =>
              fail(`IndexedDB ${operationName} request failed`, request.error);
          } else if (operationName === "workspace-recovery-records") {
            result = { workspaces: [], recovery: [] };
            const request = store.getAll();
            request.onsuccess = () => { result.workspaces = request.result; };
            request.onerror = () => fail(`IndexedDB ${operationName} request failed`, request.error);
            const recoveryRequest = transaction.objectStore(recoveryStore).getAll();
            // Intake drafts share this store, but are the tab's navigation
            // state, not revision-anchored editor recovery records.
            recoveryRequest.onsuccess = () => {
              result.recovery = recoveryRequest.result.filter((record) => !String(record.workspace_id).startsWith("intake-draft"));
            };
            recoveryRequest.onerror = () => fail(`IndexedDB ${operationName} request failed`, recoveryRequest.error);
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

// Editor recovery snapshots in the journal, whichever tab captured them.
export function countRecoverySnapshots(page) {
  return workspaceDatabaseOperation(page, "count-recovery-snapshots");
}

// The analysis being prepared, as kept for a reload (null when there is none).
export function readIntakeDraft(page) {
  return workspaceDatabaseOperation(page, "intake-draft");
}

export function damageFirstWorkspace(page) {
  return workspaceDatabaseOperation(page, "damage-first-workspace");
}

export function readFirstWorkspace(page) {
  return workspaceDatabaseOperation(page, "first-workspace");
}

// Complete saved records, including revisions, checksums and pending proposals.
export function readWorkspaceRecoveryRecords(page) {
  return workspaceDatabaseOperation(page, "workspace-recovery-records");
}

export async function seedEditorRecovery(page) {
  const workspace = await readFirstWorkspace(page);
  if (!workspace) throw new Error("Seed a saved workspace before editor recovery");
  return page.evaluate(async (saved) => {
    const { createRecoveryJournal, createIndexedDbRecoveryBackend } = await import("./src/core/recovery-journal.js");
    const journal = createRecoveryJournal({ backend: createIndexedDbRecoveryBackend() });
    const payload = structuredClone(saved.working_draft.canonical_payload);
    payload.subject.title = "An interrupted editor's draft";
    try {
      return await journal.capture({ workspace: saved, payload, activePath: "/subject", rawValue: JSON.stringify(payload.subject), owner: "interrupted-test-tab" });
    } finally { journal.close(); }
  }, workspace);
}

// Hold workspace-storage open callbacks on the next load. Dossier storage
// stays usable, so a source can be saved before the startup restore resumes.
export async function holdStartupStorage(page) {
  // Observe completion of the real startup promise, without changing its body
  // or scheduling. This prevents an early negative assertion from passing
  // before restoreAfterLoad has actually checked whether it may restore.
  await page.route("**/src/app.js", async (route) => {
    const response = await route.fetch();
    const source = await response.text();
    const call = "\nrestoreAfterLoad();";
    if (source.split(call).length !== 2) throw new Error("Cannot observe startup restore completion");
    await route.fulfill({ response, body: source.replace(call, "\nrestoreAfterLoad().finally(() => { window.__startupRestoreDone = true; });") });
  });
  await page.addInitScript((databaseName) => {
    const open = IDBFactory.prototype.open;
    const callbacks = [];
    window.__storageHeld = 0;
    let released = false;
    window.__releaseStartupStorage = () => {
      released = true;
      for (const callback of callbacks.splice(0)) callback();
    };
    IDBFactory.prototype.open = function (...args) {
      const request = open.apply(this, args);
      if (args[0] !== databaseName) return request;
      const listen = request.addEventListener.bind(request);
      const held = (handler) => function (event) {
        const deliver = () => typeof handler === "function" ? handler.call(request, event) : handler.handleEvent(event);
        if (released) deliver();
        else { callbacks.push(deliver); window.__storageHeld += 1; }
      };
      Object.defineProperty(request, "onsuccess", { set: (handler) => listen("success", held(handler)) });
      request.addEventListener = (type, handler, options) => listen(type, type === "success" ? held(handler) : handler, options);
      return request;
    };
  }, DATABASE_NAME);
  return {
    async waitUntilHeld() {
      await expect.poll(() => page.evaluate(() => window.__storageHeld)).toBeGreaterThan(0);
      expect(await page.evaluate(() => Boolean(window.__startupRestoreDone))).toBe(false);
    },
    async release() {
      await page.evaluate(() => window.__releaseStartupStorage());
      await expect.poll(() => page.evaluate(() => Boolean(window.__startupRestoreDone))).toBe(true);
    },
  };
}

// Pause one real checksum operation; no wall-clock timing window.
export async function holdNextSourceSave(page) {
  await page.evaluate(() => {
    const original = crypto.subtle.digest.bind(crypto.subtle);
    let first = true;
    window.__sourceSaveHeld = false;
    crypto.subtle.digest = async (...args) => {
      if (first) {
        first = false;
        window.__sourceSaveHeld = true;
        await new Promise((resolve) => { window.__releaseSourceSave = resolve; });
      }
      return original(...args);
    };
  });
  return {
    async waitUntilHeld() { await expect.poll(() => page.evaluate(() => window.__sourceSaveHeld)).toBe(true); },
    async release() { await page.evaluate(() => window.__releaseSourceSave()); },
  };
}

// Each IndexedDB database of the page's origin, by name, with its version.
export function readDatabaseVersions(page) {
  return page.evaluate((timeoutMs) => Promise.race([
    indexedDB.databases().then((databases) => Object.fromEntries(databases.map(({ name, version }) => [name, version]))),
    new Promise((_, reject) => setTimeout(() => reject(new Error(`IndexedDB database listing exceeded ${timeoutMs} ms`)), timeoutMs)),
  ]), INDEXED_DB_OPERATION_TIMEOUT_MS);
}

// Restores a workspace bundle whose analysis is a draft, as saved before pasted
// drafts were held back: the app no longer imports a draft, but a saved one
// still opens. The bundle is made by the app's own workspace contract.
export async function restoreSavedDraft(page, analysis) {
  const bundle = await page.evaluate(async (value) => {
    const contract = await import(new URL("src/core/workspace-contract.js", document.baseURI).href);
    return contract.createWorkspaceBundle(await contract.createWorkspace({ analysis: value }));
  }, analysis);
  await page.locator("#workspaceSaveState").click();
  await page.locator("#workspaceImportFile").setInputFiles({
    name: "saved-draft.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(bundle)),
  });
  await expect(page.locator("#workspaceStatus")).toContainText("restored locally");
}

// From the next page load on, storage opens report success late, as on a slow
// phone, so a test can act while the startup restore is still reading. Finished
// storage transactions are counted, so the test can then wait until it is done.
export function slowStorageOpens(page, delayMs) {
  return page.addInitScript((delay) => {
    window.__storageTransactionsDone = 0;
    const open = IDBFactory.prototype.open;
    IDBFactory.prototype.open = function (...args) {
      const request = open.apply(this, args);
      const listen = request.addEventListener.bind(request);
      const late = (handler) => (event) => setTimeout(() => handler.call(request, event), delay);
      Object.defineProperty(request, "onsuccess", {
        set: (handler) => listen("success", late(handler)),
      });
      request.addEventListener = (type, handler, options) =>
        listen(type, type === "success" ? late(handler) : handler, options);
      return request;
    };
    const transaction = IDBDatabase.prototype.transaction;
    IDBDatabase.prototype.transaction = function (...args) {
      const created = transaction.apply(this, args);
      created.addEventListener("complete", () => {
        window.__storageTransactionsDone += 1;
      });
      return created;
    };
  }, delayMs);
}

export function storageTransactionsDone(page) {
  return page.evaluate(() => window.__storageTransactionsDone);
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

// Hold the startup restore on the next load right after it takes its snapshot
// of what the user can change, before it reads anything from storage. Storage
// stays usable, so the user can open, type and save meanwhile; release lets the
// restore decide as it would on a slow device.
export async function holdStartupRestore(page) {
  await page.route("**/src/app.js", async (route) => {
    const response = await route.fetch();
    const source = await response.text();
    const call = "\nrestoreAfterLoad();";
    const read = "const trip = await tripWrites.then(findTrip)";
    if (source.split(call).length !== 2 || source.split(read).length !== 2) throw new Error("Cannot hold the startup restore");
    const body = source
      .replace(call, "\nrestoreAfterLoad().finally(() => { window.__startupRestoreDone = true; });")
      .replace(read, `await new Promise((resolve) => { window.__releaseStartupRestore = resolve; });\n  ${read}`);
    await route.fulfill({ response, body });
  });
  return {
    async waitUntilHeld() {
      await expect.poll(() => page.evaluate(() => typeof window.__releaseStartupRestore)).toBe("function");
    },
    async release() {
      await page.evaluate(() => window.__releaseStartupRestore());
      await expect.poll(() => page.evaluate(() => Boolean(window.__startupRestoreDone))).toBe(true);
    },
  };
}
