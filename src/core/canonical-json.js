/* Shared canonical JSON and workspace integrity primitives. */

export class WorkspaceContractError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = "WorkspaceContractError";
    this.code = code;
    this.details = Object.freeze({ ...details });
  }
}

function fail(code, message, details) {
  throw new WorkspaceContractError(code, message, details);
}

export function canonicalStringify(value) {
  const seen = new WeakSet();
  const normalize = (item) => {
    if (item === null || typeof item !== "object") return item;
    if (seen.has(item)) fail("CYCLIC_VALUE", "Workspace values must be acyclic.");
    seen.add(item);
    if (Array.isArray(item)) {
      const result = item.map(normalize);
      seen.delete(item);
      return result;
    }
    // Null prototype so an own "__proto__" key is kept as data, not dropped.
    const result = Object.create(null);
    for (const key of Object.keys(item).sort()) {
      const child = item[key];
      if (child !== undefined) result[key] = normalize(child);
    }
    seen.delete(item);
    return result;
  };
  return JSON.stringify(normalize(value));
}

export async function sha256(value, cryptoImpl = globalThis.crypto) {
  if (!cryptoImpl?.subtle?.digest) {
    fail("CRYPTO_UNAVAILABLE", "SHA-256 support is required for workspace integrity.");
  }
  const bytes = new TextEncoder().encode(
    typeof value === "string" ? value : canonicalStringify(value),
  );
  const digest = await cryptoImpl.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}
