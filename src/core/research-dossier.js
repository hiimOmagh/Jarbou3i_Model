/* Research dossier (RESEARCH-1A, ADR-0004): the analyst's case framing and
   completion contract, kept before and across the AI's answers. It refers to
   analyses by id and checksum and never copies evidence. It lives in its own
   database, so the workspace database, its version and its records never
   change because of it. */

import { canonicalStringify, sha256 } from "./workspace-contract.js";
import {
  WorkspaceStorageError,
  mapStorageFailure,
  requestResult,
  transactionDone,
} from "./workspace-storage.js";

export const DOSSIER_FORMAT = "jarbou3i-research-dossier";
export const DOSSIER_FORMAT_VERSION = 1;
export const DOSSIER_DATABASE_NAME = "jarbou3i-model-dossiers";
export const DOSSIER_DATABASE_VERSION = 1;
export const DOSSIER_STORE_NAME = "dossiers";
export const DOSSIER_TEXT_LIMIT = 4000;
export const DOSSIER_LIST_LIMIT = 50;

export class DossierError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "DossierError";
    this.code = code;
  }
}

const fail = (code, message) => { throw new DossierError(code, message); };
const invalid = (message) => fail("DOSSIER_SHAPE_INVALID", message);
const isRecord = (value) => Boolean(value) && typeof value === "object" && !Array.isArray(value);
const defaultClock = () => new Date().toISOString();
function defaultId(prefix) {
  const value = globalThis.crypto?.randomUUID?.();
  if (!value) fail("ID_GENERATOR_UNAVAILABLE", "Secure dossier identifiers are unavailable.");
  return `${prefix}_${value}`;
}

function text(value, field) {
  if (value === undefined || value === null) return "";
  if (typeof value !== "string") invalid(`${field} must be text.`);
  const trimmed = value.trim();
  if (trimmed.length > DOSSIER_TEXT_LIMIT) invalid(`${field} is longer than ${DOSSIER_TEXT_LIMIT} characters.`);
  return trimmed;
}
function list(value, field, item) {
  if (value === undefined) return [];
  if (!Array.isArray(value)) invalid(`${field} must be a list.`);
  if (value.length > DOSSIER_LIST_LIMIT) invalid(`${field} holds more than ${DOSSIER_LIST_LIMIT} items.`);
  return value.map((entry, index) => item(entry, `${field}[${index}]`));
}
const unique = (items, key, field) => {
  if (new Set(items.map((entry) => entry[key])).size !== items.length) invalid(`${field} repeats a ${key}.`);
  return items;
};

function framingOf(value = {}) {
  if (!isRecord(value)) invalid("framing must be an object.");
  return {
    question: text(value.question, "framing.question"),
    timeframe: text(value.timeframe, "framing.timeframe"),
    scope_in: list(value.scope_in, "framing.scope_in", text),
    scope_out: list(value.scope_out, "framing.scope_out", text),
    contested_terms: list(value.contested_terms, "framing.contested_terms", (entry, field) => {
      if (!isRecord(entry)) invalid(`${field} must be an object.`);
      const term = text(entry.term, `${field}.term`);
      if (!term) invalid(`${field}.term is empty.`);
      return { term, working_definition: text(entry.working_definition, `${field}.working_definition`) };
    }),
    limits: list(value.limits, "framing.limits", text),
  };
}

// A criterion is open, or met by the analyst's decision: met needs a reason
// and keeps the time it was decided until the reason changes; reopened, it
// loses both. The time comes from the record before, never from the caller.
function completionOf(value, clock, previous = []) {
  return unique(list(value, "completion", (entry, field) => {
    if (!isRecord(entry)) invalid(`${field} must be an object.`);
    const criterion_id = text(entry.criterion_id, `${field}.criterion_id`);
    const criterionText = text(entry.text, `${field}.text`);
    if (!criterion_id || !criterionText) invalid(`${field} needs an id and a text.`);
    const status = entry.status ?? "open";
    if (status !== "open" && status !== "met") invalid(`${field}.status must be open or met.`);
    if (status === "open") return { criterion_id, text: criterionText, status, rationale: "", decided_at: null };
    const rationale = text(entry.rationale, `${field}.rationale`);
    if (!rationale) invalid(`${field} is met without a rationale.`);
    const before = previous.find((criterion) => criterion.criterion_id === criterion_id);
    const decided_at = before?.status === "met" && before.rationale === rationale ? before.decided_at : clock();
    if (typeof decided_at !== "string" || !decided_at) invalid(`${field} is met without a decision time.`);
    return { criterion_id, text: criterionText, status, rationale, decided_at };
  }), "criterion_id", "completion");
}

function analysisOf(entry, field) {
  if (!isRecord(entry)) invalid(`${field} must be an object.`);
  const reference = {};
  for (const key of ["workspace_id", "revision_id", "payload_checksum", "linked_at"]) {
    reference[key] = text(entry[key], `${field}.${key}`);
    if (!reference[key]) invalid(`${field}.${key} is empty.`);
  }
  return reference;
}

// Every write is read back through the same shape a reader checks, so no
// write can leave a record its reader would refuse.
async function seal(body, cryptoImpl) {
  const shaped = shapeOf(body);
  return { ...shaped, checksum: { algorithm: "SHA-256", value: await sha256(canonicalStringify(shaped), cryptoImpl) } };
}

// The record as stored: every field read again, so nothing outside the
// contract is kept.
function shapeOf(value) {
  if (!isRecord(value)) invalid("A dossier must be an object.");
  if (value.format !== DOSSIER_FORMAT || value.format_version !== DOSSIER_FORMAT_VERSION) {
    fail("DOSSIER_FORMAT_UNSUPPORTED", "This dossier format is not supported.");
  }
  const dossier_id = text(value.dossier_id, "dossier_id");
  if (!dossier_id) invalid("dossier_id is empty.");
  if (!Number.isInteger(value.revision) || value.revision < 1) invalid("revision must be a whole number from 1.");
  const created_at = text(value.created_at, "created_at");
  const updated_at = text(value.updated_at, "updated_at");
  if (!created_at || !updated_at) invalid("A dossier needs its creation and update times.");
  const completion = list(value.completion, "completion", (entry, field) => {
    const [criterion] = completionOf([entry], () => invalid(`${field} is met without a decision time.`), [entry]);
    return criterion;
  });
  return {
    format: DOSSIER_FORMAT,
    format_version: DOSSIER_FORMAT_VERSION,
    dossier_id,
    revision: value.revision,
    created_at,
    updated_at,
    framing: framingOf(value.framing),
    completion: unique(completion, "criterion_id", "completion"),
    analyses: unique(list(value.analyses, "analyses", analysisOf), "revision_id", "analyses"),
  };
}

export async function verifyDossier(value, { cryptoImpl = globalThis.crypto } = {}) {
  const sealed = await seal(value, cryptoImpl);
  if (!isRecord(value.checksum) || value.checksum.algorithm !== "SHA-256") invalid("A dossier needs a SHA-256 checksum.");
  if (sealed.checksum.value !== value.checksum.value) {
    fail("DOSSIER_CHECKSUM_MISMATCH", "The dossier does not match its checksum.");
  }
  return sealed;
}

export async function createDossier({
  framing = {},
  completion = [],
  clock = defaultClock,
  idFactory = defaultId,
  cryptoImpl = globalThis.crypto,
} = {}) {
  const now = clock();
  return seal({
    format: DOSSIER_FORMAT,
    format_version: DOSSIER_FORMAT_VERSION,
    dossier_id: idFactory("dossier"),
    revision: 1,
    created_at: now,
    updated_at: now,
    framing: framingOf(framing),
    completion: completionOf(completion, () => now),
    analyses: [],
  }, cryptoImpl);
}

// A write never changes the record it was given: it returns the next one.
export async function updateDossier(dossier, changes = {}, { clock = defaultClock, cryptoImpl = globalThis.crypto } = {}) {
  const current = await verifyDossier(dossier, { cryptoImpl });
  const now = clock();
  return seal({
    ...current,
    revision: current.revision + 1,
    updated_at: now,
    framing: changes.framing === undefined ? current.framing : framingOf(changes.framing),
    completion: changes.completion === undefined ? current.completion : completionOf(changes.completion, () => now, current.completion),
  }, cryptoImpl);
}

// An analysis is linked by reference, once per revision.
export async function linkAnalysis(dossier, reference, { clock = defaultClock, cryptoImpl = globalThis.crypto } = {}) {
  const current = await verifyDossier(dossier, { cryptoImpl });
  const now = clock();
  const link = analysisOf({ ...reference, linked_at: now }, "analysis");
  if (current.analyses.some((entry) => entry.revision_id === link.revision_id)) return dossier;
  return seal({ ...current, revision: current.revision + 1, updated_at: now, analyses: [...current.analyses, link] }, cryptoImpl);
}

const conflict = () => new WorkspaceStorageError("WRITE_CONFLICT", "Dossier changed in another browser context.");
const exists = () => new DossierError("DOSSIER_EXISTS", "Dossier already exists.");

export function createIndexedDbDossierBackend({
  indexedDB = globalThis.indexedDB,
  databaseName = DOSSIER_DATABASE_NAME,
} = {}) {
  let connection;

  // One connection, shared by calls that arrive together: a second one would
  // stay open unseen and block the next version of the database.
  function open() {
    if (!indexedDB?.open) return Promise.reject(new WorkspaceStorageError("STORAGE_UNAVAILABLE", "IndexedDB is unavailable."));
    connection ||= (async () => {
      const request = indexedDB.open(databaseName, DOSSIER_DATABASE_VERSION);
      request.onupgradeneeded = () => {
        if (!request.result.objectStoreNames.contains(DOSSIER_STORE_NAME)) {
          request.result.createObjectStore(DOSSIER_STORE_NAME, { keyPath: "dossier_id" });
        }
      };
      const database = await requestResult(request);
      database.onversionchange = () => {
        database.close();
        connection = undefined;
      };
      return database;
    })().catch((error) => {
      connection = undefined;
      throw mapStorageFailure(error);
    });
    return connection;
  }

  async function transaction(mode, operation) {
    try {
      const database = await open();
      const tx = database.transaction(DOSSIER_STORE_NAME, mode);
      const result = await operation(tx.objectStore(DOSSIER_STORE_NAME), tx);
      await transactionDone(tx);
      return result;
    } catch (error) {
      throw error instanceof DossierError ? error : mapStorageFailure(error);
    }
  }

  return Object.freeze({
    kind: "indexeddb",
    list: () => transaction("readonly", (store) => requestResult(store.getAll())),
    get: (id) => transaction("readonly", (store) => requestResult(store.get(id))),
    put: (value, { expectedRevision = null, createOnly = false } = {}) =>
      transaction("readwrite", async (store, tx) => {
        const current = await requestResult(store.get(value.dossier_id));
        if (createOnly && current) {
          tx.abort();
          throw exists();
        }
        if (expectedRevision !== null && current?.revision !== expectedRevision) {
          tx.abort();
          throw conflict();
        }
        await requestResult(store.put(structuredClone(value)));
        return structuredClone(value);
      }),
    delete: (id) => transaction("readwrite", async (store) => {
      await requestResult(store.delete(id));
      return true;
    }),
    clear: () => transaction("readwrite", async (store) => {
      await requestResult(store.clear());
      return true;
    }),
    close() {
      const pending = connection;
      connection = undefined;
      pending?.then((database) => database.close(), () => {});
    },
  });
}

export function createMemoryDossierBackend(initial = []) {
  const values = new Map(initial.map((value) => [value.dossier_id, structuredClone(value)]));
  return Object.freeze({
    kind: "memory",
    async list() { return [...values.values()].map((value) => structuredClone(value)); },
    async get(id) { return values.has(id) ? structuredClone(values.get(id)) : undefined; },
    async put(value, { expectedRevision = null, createOnly = false } = {}) {
      const current = values.get(value.dossier_id);
      if (createOnly && current) throw exists();
      if (expectedRevision !== null && current?.revision !== expectedRevision) throw conflict();
      values.set(value.dossier_id, structuredClone(value));
      return structuredClone(value);
    },
    async delete(id) { return values.delete(id); },
    async clear() { values.clear(); return true; },
    close() {},
  });
}

// Every record is verified on the way in and out. A damaged one is listed as
// damaged, without its unverified text, and is never removed here.
export function createDossierRepository({ backend, cryptoImpl = globalThis.crypto } = {}) {
  if (!backend) throw new TypeError("Dossier repository requires a storage backend.");
  return Object.freeze({
    backendKind: backend.kind || "custom",
    async list() {
      const values = await backend.list();
      const entries = await Promise.all(values.map(async (value) => {
        try {
          return { ...(await verifyDossier(value, { cryptoImpl })), integrity_status: "verified" };
        } catch (error) {
          return { dossier_id: String(value?.dossier_id || ""), integrity_status: "corrupt", error_code: String(error?.code || "DOSSIER_INTEGRITY_FAILED") };
        }
      }));
      return entries.sort((a, b) => String(b.updated_at || "").localeCompare(String(a.updated_at || "")));
    },
    async get(id) {
      const value = await backend.get(id);
      return value ? verifyDossier(value, { cryptoImpl }) : undefined;
    },
    async create(dossier) {
      return backend.put(await verifyDossier(dossier, { cryptoImpl }), { createOnly: true });
    },
    async save(dossier, { expectedRevision } = {}) {
      if (!Number.isInteger(expectedRevision)) throw new TypeError("Saving a dossier requires the revision it replaces.");
      const verified = await verifyDossier(dossier, { cryptoImpl });
      if (verified.revision !== expectedRevision + 1) throw conflict();
      return backend.put(verified, { expectedRevision });
    },
    delete: (id) => backend.delete(id),
    clear: () => backend.clear(),
    close: () => backend.close(),
  });
}
