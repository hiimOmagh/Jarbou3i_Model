/* Browser-storage durability and capacity diagnostics. */

const finiteNonNegative = (value) => Number.isFinite(value) && value >= 0;

export async function inspectStorageHealth(storageManager = globalThis.navigator?.storage) {
  if (!storageManager) {
    return Object.freeze({ supported: false, canPersist: false, persisted: null, usage: null, quota: null, usageRatio: null, state: "unsupported" });
  }
  let persisted = null;
  let usage = null;
  let quota = null;
  try {
    if (typeof storageManager.persisted === "function") persisted = Boolean(await storageManager.persisted());
  } catch { /* Unsupported or privacy-restricted browsers remain best effort. */ }
  try {
    if (typeof storageManager.estimate === "function") {
      const estimate = await storageManager.estimate();
      usage = finiteNonNegative(estimate?.usage) ? estimate.usage : null;
      quota = finiteNonNegative(estimate?.quota) && estimate.quota > 0 ? estimate.quota : null;
    }
  } catch { /* Capacity remains unknown rather than falsely healthy. */ }
  const usageRatio = usage !== null && quota !== null ? usage / quota : null;
  const state = usageRatio !== null && usageRatio >= 0.9
    ? "critical"
    : usageRatio !== null && usageRatio >= 0.75
      ? "pressure"
      : persisted === true
        ? "persistent"
        : "best_effort";
  return Object.freeze({ supported: true, canPersist: typeof storageManager.persist === "function", persisted, usage, quota, usageRatio, state });
}

export async function requestStoragePersistence(storageManager = globalThis.navigator?.storage) {
  if (!storageManager || typeof storageManager.persist !== "function") {
    return inspectStorageHealth(storageManager);
  }
  try { await storageManager.persist(); } catch { /* The browser owns this permission decision. */ }
  return inspectStorageHealth(storageManager);
}
