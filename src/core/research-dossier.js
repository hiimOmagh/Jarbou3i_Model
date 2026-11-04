/* Research dossier (RESEARCH-1A, ADR-0004): the analyst's case framing and
   completion contract, kept before and across the AI's answers. It refers to
   analyses by id and checksum and never copies evidence. It lives in its own
   database, so the workspace database, its version and its records never
   change because of it. */

import { normalizedText, normalizedUrl } from "./evidence-intelligence.js";
import { canonicalStringify, sha256 } from "./workspace-contract.js";
import {
  WorkspaceStorageError,
  mapStorageFailure,
  requestResult,
  transactionDone,
} from "./workspace-storage.js";

export const DOSSIER_FORMAT = "jarbou3i-research-dossier";
export const DOSSIER_FORMAT_VERSION = 2;
export const DOSSIER_DATABASE_NAME = "jarbou3i-model-dossiers";
export const DOSSIER_DATABASE_VERSION = 1;
export const DOSSIER_STORE_NAME = "dossiers";
export const DOSSIER_TEXT_LIMIT = 4000;
export const DOSSIER_LIST_LIMIT = 50;
// The maximal contract export is 20,469,050 bytes, including pretty printing
// and six-byte escapes (tests/fixtures/research-dossier-maximal.mjs).
export const DOSSIER_FILE_LIMIT = 24 * 1024 * 1024;
export const DOSSIER_SOURCE_LIMIT = 50;
export const DOSSIER_EXCERPT_LIMIT = 200;
export const DOSSIER_EXCERPTS_PER_SOURCE_LIMIT = 50;
export const DOSSIER_SOURCE_TEXT_LIMIT = 500;
export const DOSSIER_EXCERPT_TEXT_LIMIT = 2000;
export const DOSSIER_CHECK_REASON_LIMIT = 1000;

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
// An item a field holds on one line of its own.
function line(value, field) {
  const result = text(value, field);
  if (/[\r\n]/.test(result)) invalid(`${field} must be one line.`);
  return result;
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
    scope_in: list(value.scope_in, "framing.scope_in", line),
    scope_out: list(value.scope_out, "framing.scope_out", line),
    contested_terms: list(value.contested_terms, "framing.contested_terms", (entry, field) => {
      if (!isRecord(entry)) invalid(`${field} must be an object.`);
      const term = line(entry.term, `${field}.term`);
      if (!term) invalid(`${field}.term is empty.`);
      const working_definition = line(entry.working_definition, `${field}.working_definition`);
      // The released parser keeps a colon-led line whole, with no definition.
      if (/[:：]/.test(term) && !(/^[:：]/.test(term) && !working_definition)) invalid(`${field}.term must not hold a colon.`);
      return { term, working_definition };
    }),
    limits: list(value.limits, "framing.limits", line),
  };
}

// The framing as the topic step's fields hold it: one item per line, and a
// term split from its working definition at the first colon.
const fieldLines = (value) => String(value || "").split("\n").map((line) => line.trim()).filter(Boolean);
export function framingFromFields({ question, timeframe, scope_in, scope_out, terms, limits } = {}) {
  return {
    question: String(question || "").trim(),
    timeframe: String(timeframe || "").trim(),
    scope_in: fieldLines(scope_in),
    scope_out: fieldLines(scope_out),
    contested_terms: fieldLines(terms).map((line) => {
      const at = line.search(/[:：]/);
      return at > 0
        ? { term: line.slice(0, at).trim(), working_definition: line.slice(at + 1).trim() }
        : { term: line, working_definition: "" };
    }),
    limits: fieldLines(limits),
  };
}
export function fieldsFromFraming(framing) {
  return {
    question: framing.question,
    timeframe: framing.timeframe,
    scope_in: framing.scope_in.join("\n"),
    scope_out: framing.scope_out.join("\n"),
    terms: framing.contested_terms.map(({ term, working_definition }) => (working_definition ? `${term}: ${working_definition}` : term)).join("\n"),
    limits: framing.limits.join("\n"),
  };
}
// The completion contract as its field holds it: one criterion per line, a
// repeated line once. A line kept keeps its criterion, so its status and
// reason stay; a new or changed line is a new criterion, open.
export function completionFromLines(text, previous = []) {
  let last = previous.reduce((max, { criterion_id }) => Math.max(max, Number(/^C(\d+)$/.exec(criterion_id)?.[1] || 0)), 0);
  return [...new Set(fieldLines(text))].map((line) => {
    const kept = previous.find((criterion) => criterion.text === line);
    return kept ? { ...kept } : { criterion_id: `C${(last += 1)}`, text: line, status: "open" };
  });
}
// More than a topic and a timeframe: what makes a dossier worth keeping.
export const hasFraming = (framing) =>
  ["scope_in", "scope_out", "contested_terms", "limits"].some((key) => framing[key].length > 0);

// A criterion is open, or met by the analyst's decision: met needs a reason
// and keeps the time it was decided until the reason changes; reopened, it
// loses both. The time comes from the record before, never from the caller.
function completionOf(value, clock, previous = []) {
  const result = unique(list(value, "completion", (entry, field) => {
    if (!isRecord(entry)) invalid(`${field} must be an object.`);
    const criterion_id = text(entry.criterion_id, `${field}.criterion_id`);
    const criterionText = line(entry.text, `${field}.text`);
    if (!criterion_id || !criterionText) invalid(`${field} needs an id and a text.`);
    const status = entry.status ?? "open";
    if (status !== "open" && status !== "met") invalid(`${field}.status must be open or met.`);
    if (status === "open") return { criterion_id, text: criterionText, status, rationale: "", decided_at: null };
    const rationale = text(entry.rationale, `${field}.rationale`);
    if (!rationale) invalid(`${field} is met without a rationale.`);
    const before = previous.find((criterion) => criterion.criterion_id === criterion_id);
    const decided_at = before?.status === "met" && before.rationale === rationale ? before.decided_at : clock();
    if (typeof decided_at !== "string" || decided_at.length > DOSSIER_TEXT_LIMIT) invalid(`${field}.decided_at is too long.`);
    if (typeof decided_at !== "string" || !decided_at) invalid(`${field} is met without a decision time.`);
    return { criterion_id, text: criterionText, status, rationale, decided_at };
  }), "criterion_id", "completion");
  return unique(result, "text", "completion");
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

// New material uses real UUIDs and ISO instants; injected generators follow
// the same contract as the defaults. Historical 1A fields remain readable.
const uuid = "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}";
function materialId(value, prefix) {
  // The prefix is exact; the UUID may use either case, as the schema allows.
  if (typeof value !== "string" || !new RegExp("^" + prefix + "_" + uuid.replaceAll("a-f", "a-fA-F") + "$").test(value)) invalid(prefix + " id must contain a UUID.");
  return value;
}
function instant(value, field) {
  if (typeof value !== "string" || !/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/.test(value) || Number.isNaN(Date.parse(value)) || new Date(value).toISOString() !== value) {
    invalid(field + " must be an ISO timestamp.");
  }
  return value;
}
function writeTime(clock) {
  const now = text(clock(), "store time");
  if (!now || Number.isNaN(Date.parse(now))) invalid("The store needs a real time.");
  return now;
}
function materialText(value, field, limit, oneLine = true, required = false) {
  if (typeof value !== "string") invalid(field + " must be text.");
  const result = value.trim();
  if (result.length > limit || (oneLine && /[\r\n\u2028\u2029]/.test(result)) || (required && !result)) invalid(field + " is empty, too long or holds multiple lines.");
  return result;
}
function sourceOf(entry) {
  if (!isRecord(entry)) invalid("A source must be an object.");
  const title = materialText(entry.title, "source.title", DOSSIER_SOURCE_TEXT_LIMIT, true, true);
  const url = materialText(entry.url, "source.url", DOSSIER_SOURCE_TEXT_LIMIT);
  if (url && (!/^https?:\/\//i.test(url) || !normalizedUrl(url))) invalid("A source link must use http(s).");
  const accessed_on = materialText(entry.accessed_on, "source.accessed_on", 10);
  if (accessed_on && (!/^\d{4}-\d\d-\d\d$/.test(accessed_on) || Number.isNaN(Date.parse(accessed_on)) || new Date(accessed_on).toISOString().slice(0, 10) !== accessed_on)) invalid("Opened on must be a real YYYY-MM-DD date.");
  if (typeof entry.send !== "boolean") invalid("source.send must be boolean.");
  return {
    source_id: materialId(entry.source_id, "source"), title, url,
    source_date: materialText(entry.source_date, "source.source_date", DOSSIER_SOURCE_TEXT_LIMIT),
    accessed_on, send: entry.send, added_at: instant(entry.added_at, "source.added_at"),
  };
}
const unchecked = () => ({ status: "unchecked", reason: "", decided_at: null });
function checkOf(value) {
  if (!isRecord(value) || !["unchecked", "matches", "differs"].includes(value.status)) invalid("An excerpt needs a check status.");
  const reason = materialText(value.reason, "check.reason", DOSSIER_CHECK_REASON_LIMIT, false, value.status !== "unchecked");
  if (value.status === "unchecked") {
    if (reason !== "" || value.decided_at !== null) invalid("An unchecked excerpt has no reason or decision time.");
    return unchecked();
  }
  return { status: value.status, reason, decided_at: instant(value.decided_at, "check.decided_at") };
}
function excerptOf(entry) {
  if (!isRecord(entry)) invalid("An excerpt must be an object.");
  return {
    excerpt_id: materialId(entry.excerpt_id, "excerpt"), source_id: materialId(entry.source_id, "source"),
    text: materialText(entry.text, "excerpt.text", DOSSIER_EXCERPT_TEXT_LIMIT, false, true),
    locator: materialText(entry.locator, "excerpt.locator", DOSSIER_SOURCE_TEXT_LIMIT),
    check: checkOf(entry.check), added_at: instant(entry.added_at, "excerpt.added_at"),
  };
}
function sourceUniqueness(sources, code = "DOSSIER_SHAPE_INVALID") {
  const keys = sources.map((entry) => entry.url ? "url:" + normalizedUrl(entry.url) : "title:" + normalizedText(entry.title));
  if (new Set(keys).size !== keys.length) fail(code, "A source with this link or unlinked title already exists.");
}
function materialOf(value) {
  if (!Array.isArray(value.sources) || !value.sources.length || value.sources.length > DOSSIER_SOURCE_LIMIT || !Array.isArray(value.excerpts) || value.excerpts.length > DOSSIER_EXCERPT_LIMIT) invalid("Invalid sources or excerpts list.");
  const sources = unique(value.sources.map(sourceOf), "source_id", "sources");
  sourceUniqueness(sources);
  const excerpts = unique(value.excerpts.map(excerptOf), "excerpt_id", "excerpts");
  const counts = new Map(sources.map((source) => [source.source_id, 0]));
  for (const excerpt of excerpts) {
    if (!counts.has(excerpt.source_id)) invalid("An excerpt names a missing source.");
    const count = counts.get(excerpt.source_id) + 1;
    if (count > DOSSIER_EXCERPTS_PER_SOURCE_LIMIT) invalid("Too many excerpts for one source.");
    counts.set(excerpt.source_id, count);
  }
  return { sources, excerpts };
}

// Callers capture the item they showed and close over it in change(current).
// Only the given record is read; replay against a newer record cannot replace
// another analyst's edits, check decisions or newly added excerpts.
const same = (a, b) => canonicalStringify(a) === canonicalStringify(b);
function seenItem(items, seen, key) {
  const found = items.find((item) => item[key] === seen?.[key]);
  if (!found || !same(found, seen)) fail("CHANGED_ELSEWHERE", "This item changed elsewhere. Open it again.");
  return found;
}
async function changeMaterial(dossier, operation, { clock = defaultClock, idFactory = defaultId, cryptoImpl = globalThis.crypto } = {}) {
  const current = await verifyDossier(dossier, { cryptoImpl });
  const now = instant(clock(), "store time");
  const material = operation({ sources: current.sources || [], excerpts: current.excerpts || [] }, now, idFactory);
  return seal({ ...current, ...material, revision: current.revision + 1, updated_at: now }, cryptoImpl);
}
export function addSource(dossier, fields, options) {
  return changeMaterial(dossier, ({ sources, excerpts }, now, idFactory) => {
    if (sources.length >= DOSSIER_SOURCE_LIMIT) fail("SOURCE_LIST_FULL", "A case holds at most 50 sources.");
    const source = sourceOf({ url: "", source_date: "", accessed_on: "", send: true, ...fields, source_id: idFactory("source"), added_at: now });
    const next = [...sources, source];
    sourceUniqueness(next, "SOURCE_EXISTS");
    return { sources: next, excerpts };
  }, options);
}
export function editSource(dossier, seen, fields, options) {
  return changeMaterial(dossier, ({ sources, excerpts }) => {
    const before = seenItem(sources, seen, "source_id");
    const source = sourceOf({ ...before, ...fields, source_id: before.source_id, added_at: before.added_at });
    const next = sources.map((item) => item === before ? source : item);
    sourceUniqueness(next, "SOURCE_EXISTS");
    return { sources: next, excerpts };
  }, options);
}
export function removeSource(dossier, seen, seenExcerpts, options) {
  return changeMaterial(dossier, ({ sources, excerpts }) => {
    const before = seenItem(sources, seen, "source_id");
    const attached = excerpts.filter((item) => item.source_id === before.source_id);
    if (!Array.isArray(seenExcerpts) || !same(attached, seenExcerpts)) fail("CHANGED_ELSEWHERE", "This source's excerpts changed elsewhere.");
    return { sources: sources.filter((item) => item !== before), excerpts: excerpts.filter((item) => item.source_id !== before.source_id) };
  }, options);
}
export function addExcerpt(dossier, sourceId, fields, options) {
  return changeMaterial(dossier, ({ sources, excerpts }, now, idFactory) => {
    if (!sources.some((item) => item.source_id === sourceId)) fail("SOURCE_GONE", "The excerpt's source was removed.");
    if (excerpts.length >= DOSSIER_EXCERPT_LIMIT || excerpts.filter((item) => item.source_id === sourceId).length >= DOSSIER_EXCERPTS_PER_SOURCE_LIMIT) fail("EXCERPT_LIST_FULL", "The excerpt list is full.");
    const excerpt = excerptOf({ locator: "", ...fields, excerpt_id: idFactory("excerpt"), source_id: sourceId, check: unchecked(), added_at: now });
    return { sources, excerpts: [...excerpts, excerpt] };
  }, options);
}
export function editExcerpt(dossier, seen, fields, options) {
  return changeMaterial(dossier, ({ sources, excerpts }) => {
    const before = seenItem(excerpts, seen, "excerpt_id");
    const next = excerptOf({ ...before, text: fields.text ?? before.text, locator: fields.locator ?? before.locator });
    if (next.text !== before.text || next.locator !== before.locator) next.check = unchecked();
    return { sources, excerpts: excerpts.map((item) => item === before ? next : item) };
  }, options);
}
export function removeExcerpt(dossier, seen, options) {
  return changeMaterial(dossier, ({ sources, excerpts }) => {
    const before = seenItem(excerpts, seen, "excerpt_id");
    return { sources, excerpts: excerpts.filter((item) => item !== before) };
  }, options);
}
export function checkExcerpt(dossier, seen, decision, options) {
  return changeMaterial(dossier, ({ sources, excerpts }, now) => {
    const before = seenItem(excerpts, seen, "excerpt_id");
    if (!["matches", "differs"].includes(decision?.status)) invalid("Choose matches or differs.");
    const reason = materialText(decision.reason, "check.reason", DOSSIER_CHECK_REASON_LIMIT, false, true);
    const decided_at = before.check.status === decision.status && before.check.reason === reason ? before.check.decided_at : now;
    const check = checkOf({ status: decision.status, reason, decided_at });
    return { sources, excerpts: excerpts.map((item) => item === before ? { ...before, check } : item) };
  }, options);
}
export function reopenExcerpt(dossier, seen, options) {
  return changeMaterial(dossier, ({ sources, excerpts }) => {
    const before = seenItem(excerpts, seen, "excerpt_id");
    return { sources, excerpts: excerpts.map((item) => item === before ? { ...before, check: unchecked() } : item) };
  }, options);
}

// Every write is read back through the same shape a reader checks, so no
// write can leave a record its reader would refuse.
async function seal(body, cryptoImpl) {
  const { sources = [], excerpts = [], ...rest } = body;
  const shaped = shapeOf({ ...rest, format_version: sources.length ? 2 : 1, ...(sources.length ? { sources, excerpts } : {}) });
  return { ...shaped, checksum: { algorithm: "SHA-256", value: await sha256(canonicalStringify(shaped), cryptoImpl) } };
}

// Reading keeps the field rules, with the released colon-led term exception.
function shapeOf(value) {
  if (!isRecord(value)) invalid("A dossier must be an object.");
  if (value.format === DOSSIER_FORMAT && Number.isInteger(value.format_version) && value.format_version > DOSSIER_FORMAT_VERSION) {
    fail("DOSSIER_FORMAT_NEWER", "This dossier was made by a newer version of the app.");
  }
  if (value.format !== DOSSIER_FORMAT || ![1, 2].includes(value.format_version)) {
    fail("DOSSIER_FORMAT_UNSUPPORTED", "This dossier format is not supported.");
  }
  const dossier_id = text(value.dossier_id, "dossier_id");
  if (!dossier_id) invalid("dossier_id is empty.");
  if (!Number.isSafeInteger(value.revision) || value.revision < 1) invalid("revision must be a safe whole number from 1.");
  const created_at = text(value.created_at, "created_at");
  const updated_at = text(value.updated_at, "updated_at");
  if (!created_at || !updated_at || Number.isNaN(Date.parse(created_at)) || Number.isNaN(Date.parse(updated_at))) invalid("A dossier needs its creation and update times.");
  const completion = list(value.completion, "completion", (entry, field) => {
    const [criterion] = completionOf([entry], () => invalid(`${field} is met without a decision time.`), [entry]);
    return criterion;
  });
  return {
    format: DOSSIER_FORMAT,
    format_version: value.format_version,
    dossier_id,
    revision: value.revision,
    created_at,
    updated_at,
    framing: framingOf(value.framing),
    completion: unique(unique(completion, "criterion_id", "completion"), "text", "completion"),
    analyses: unique(list(value.analyses, "analyses", analysisOf), "revision_id", "analyses"),
    ...(value.format_version === 2 ? materialOf(value) : {}),
  };
}

export async function verifyDossier(value, { cryptoImpl = globalThis.crypto } = {}) {
  const shaped = shapeOf(value);
  const sealed = { ...shaped, checksum: { algorithm: "SHA-256", value: await sha256(canonicalStringify(shaped), cryptoImpl) } };
  if (!isRecord(value.checksum) || value.checksum.algorithm !== "SHA-256") invalid("A dossier needs a SHA-256 checksum.");
  if (sealed.checksum.value !== value.checksum.value) {
    fail("DOSSIER_CHECKSUM_MISMATCH", "The dossier does not match its checksum.");
  }
  return sealed;
}

// A case file is the sealed record as written, read back only if it verifies.
export async function readDossierFile(text, options) {
  let value;
  try {
    value = JSON.parse(text);
  } catch {
    fail("DOSSIER_FILE_INVALID", "This file is not JSON.");
  }
  return verifyDossier(value, options);
}

export async function createDossier({
  framing = {},
  completion = [],
  clock = defaultClock,
  idFactory = defaultId,
  cryptoImpl = globalThis.crypto,
} = {}) {
  const now = writeTime(clock);
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
  const now = writeTime(clock);
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
  const now = writeTime(clock);
  const link = analysisOf({ ...reference, linked_at: now }, "analysis");
  if (current.analyses.some((entry) => entry.revision_id === link.revision_id)) return dossier;
  if (current.analyses.length >= DOSSIER_LIST_LIMIT) fail("DOSSIER_FULL", `A dossier links at most ${DOSSIER_LIST_LIMIT} analyses.`);
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
          if (error?.code === "DOSSIER_FORMAT_NEWER") return {
            dossier_id: String(value?.dossier_id || ""), integrity_status: "newer",
            error_code: error.code, format_version: value.format_version,
          };
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
