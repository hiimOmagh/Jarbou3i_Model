import { canonicalStringify, sha256, WorkspaceContractError } from "./workspace-contract.js";

export const EDITOR_HISTORY_LIMIT = 100;

function clone(value) { return structuredClone(value); }
function pathParts(path) {
  if (path === "" || path === "/") return [];
  if (typeof path !== "string" || !path.startsWith("/")) throw new TypeError("Editor paths must be JSON Pointers.");
  return path.slice(1).split("/").map((part) => part.replaceAll("~1", "/").replaceAll("~0", "~"));
}
function containerAt(root, parts) {
  let current = root;
  for (const part of parts) {
    if (current === null || typeof current !== "object" || !(part in current)) {
      throw new WorkspaceContractError("EDITOR_PATH_NOT_FOUND", `Editor path does not exist: /${parts.join("/")}`);
    }
    current = current[part];
  }
  return current;
}

export function readEditorValue(document, path) { return clone(containerAt(document, pathParts(path))); }

export function replaceEditorValue(document, path, value) {
  const next = clone(document);
  const parts = pathParts(path);
  if (!parts.length) return clone(value);
  const key = parts.pop();
  const parent = containerAt(next, parts);
  if (parent === null || typeof parent !== "object" || !(key in parent)) {
    throw new WorkspaceContractError("EDITOR_PATH_NOT_FOUND", `Editor path does not exist: ${path}`);
  }
  parent[key] = clone(value);
  return next;
}

export function createCanonicalEditorSession({ payload, validate, historyLimit = EDITOR_HISTORY_LIMIT } = {}) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) throw new TypeError("A canonical payload is required.");
  if (typeof validate !== "function") throw new TypeError("A lens validator is required.");
  const original = clone(payload);
  let present = clone(payload);
  let past = [];
  let future = [];
  let validation = validate(clone(present));
  const refresh = () => { validation = validate(clone(present)); return snapshot(); };
  const snapshot = () => Object.freeze({
    payload: clone(present),
    dirty: canonicalStringify(present) !== canonicalStringify(original),
    canUndo: past.length > 0,
    canRedo: future.length > 0,
    validation: clone(validation),
  });
  return Object.freeze({
    inspect: snapshot,
    replace(path, value) {
      const next = replaceEditorValue(present, path, value);
      if (canonicalStringify(next) === canonicalStringify(present)) return snapshot();
      past = [...past, present].slice(-historyLimit);
      present = next;
      future = [];
      return refresh();
    },
    undo() {
      if (!past.length) return snapshot();
      future = [present, ...future].slice(0, historyLimit);
      present = past.at(-1);
      past = past.slice(0, -1);
      return refresh();
    },
    redo() {
      if (!future.length) return snapshot();
      past = [...past, present].slice(-historyLimit);
      present = future[0];
      future = future.slice(1);
      return refresh();
    },
  });
}

export async function writeEditorDraft(workspace, payload, { clock = () => new Date().toISOString(), cryptoImpl } = {}) {
  if (!workspace?.working_draft) throw new TypeError("A workspace working draft is required.");
  const next = clone(workspace);
  const timestamp = clock();
  if (!Number.isFinite(Date.parse(timestamp))) throw new WorkspaceContractError("INVALID_TIMESTAMP", "Editor timestamps must be ISO-8601 values.");
  next.repository_revision += 1;
  next.metadata.updated_at = timestamp;
  next.working_draft.updated_at = timestamp;
  next.working_draft.canonical_payload = clone(payload);
  next.working_draft.payload_checksum = await sha256(payload, cryptoImpl);
  const base = next.revisions.find((revision) => revision.revision_id === next.working_draft.base_revision_id);
  next.working_draft.dirty = canonicalStringify(payload) !== canonicalStringify(base.canonical_payload);
  return next;
}
