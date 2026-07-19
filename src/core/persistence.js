/* Storage adapters with conservative parsing and analysis-scoped namespaces. */

const isRecord = (value) =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

export function stableScopeHash(value) {
  let hash = 2166136261;
  for (const char of String(value || "analysis")) {
    hash ^= char.codePointAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

export function createJsonRepository({
  storage,
  key,
  fallback,
  validate = () => true,
}) {
  if (!key || typeof key !== "string") {
    throw new TypeError("Persistence repository requires a stable key.");
  }
  const fallbackValue = () =>
    typeof fallback === "function" ? fallback() : structuredClone(fallback);

  function read() {
    try {
      const raw = storage?.getItem?.(key);
      if (!raw) return fallbackValue();
      const parsed = JSON.parse(raw);
      return validate(parsed) ? parsed : fallbackValue();
    } catch {
      return fallbackValue();
    }
  }

  function replace(value) {
    if (!validate(value)) throw new TypeError(`Invalid persisted value for ${key}.`);
    try {
      storage?.setItem?.(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  }

  return Object.freeze({
    key,
    read,
    replace,
    update(patch) {
      if (!isRecord(patch)) throw new TypeError("Persistence patch must be an object.");
      const current = read();
      if (!isRecord(current)) {
        throw new TypeError(`Persisted value for ${key} is not patchable.`);
      }
      const next = { ...current, ...patch };
      replace(next);
      return next;
    },
    remove() {
      try {
        storage?.removeItem?.(key);
        return true;
      } catch {
        return false;
      }
    },
  });
}

export function createSettingsRepository(storage, key = "jarbou3i-model-settings") {
  return createJsonRepository({
    storage,
    key,
    fallback: () => ({}),
    validate: isRecord,
  });
}

export function createScopedListRepository({ storage, prefix, scope }) {
  const key = `${prefix}.${stableScopeHash(scope)}`;
  return createJsonRepository({
    storage,
    key,
    fallback: () => [],
    validate: Array.isArray,
  });
}

