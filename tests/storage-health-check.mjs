import assert from "node:assert/strict";
import { inspectStorageHealth, requestStoragePersistence } from "../src/core/storage-health.js";

assert.equal((await inspectStorageHealth(undefined)).state, "unsupported");
assert.equal((await inspectStorageHealth({
  persisted: async () => true,
  estimate: async () => ({ usage: 10, quota: 100 }),
})).state, "persistent");
assert.equal((await inspectStorageHealth({
  persisted: async () => false,
  estimate: async () => ({ usage: 80, quota: 100 }),
})).state, "pressure");
assert.equal((await inspectStorageHealth({
  persisted: async () => false,
  estimate: async () => ({ usage: 95, quota: 100 }),
})).state, "critical");

let requested = false;
const granted = await requestStoragePersistence({
  persist: async () => { requested = true; return true; },
  persisted: async () => requested,
  estimate: async () => ({ usage: 1, quota: 100 }),
});
assert.equal(requested, true, "persistence request was not delegated to the browser");
assert.equal(granted.persisted, true, "granted persistence was not re-inspected");

const restricted = await inspectStorageHealth({
  persisted: async () => { throw new Error("restricted"); },
  estimate: async () => { throw new Error("restricted"); },
});
assert.equal(restricted.state, "best_effort", "restricted APIs were presented as durable storage");

console.log("Storage persistence, quota pressure, unsupported, and restricted-browser checks passed.");
