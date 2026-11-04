/* From a case excerpt to an evidence record: pure builders and the commit's
   preparation (RESEARCH-1C, docs/features/research-promotion.md). No DOM, no
   storage: the page decides what to offer and saves through the resolution
   dialog, as a revision restore does. */

import { DOSSIER_POINTER_ID_LIMIT } from "./research-dossier.js";
import { createResolutionProposal } from "./resolution-transaction.js";
import { sha256, verifyWorkspace, WorkspaceContractError } from "./workspace-contract.js";

// The choices the form offers; `disputed` is the editor's, not the form's.
export const PROMOTION_VERIFICATION_CHOICES = Object.freeze(["unverified", "partially_verified", "verified"]);
const FILLABLE_STATUSES = ["unverified", "partially_verified"];
const LENSES = ["strategic", "biopolitical"];

const clone = (value) => structuredClone(value);
const blank = (value) => !String(value ?? "").trim();
const isRecord = (value) => Boolean(value) && typeof value === "object" && !Array.isArray(value);
const lensOf = (lens) => {
  if (!LENSES.includes(lens)) throw new TypeError(`Unknown lens: ${lens}`);
  return lens;
};
const locatorKey = (lens) => (lensOf(lens) === "strategic" ? "source_note" : "source_locator");

function fail(code, message) {
  throw new WorkspaceContractError(code, message);
}

function defaultId(prefix) {
  const value = globalThis.crypto?.randomUUID?.();
  if (!value) fail("ID_GENERATOR_UNAVAILABLE", "Secure identifiers are unavailable.");
  return `${prefix}_${value}`;
}

function timestamp(clock) {
  const value = typeof clock === "function" ? clock() : new Date().toISOString();
  if (!Number.isFinite(Date.parse(value))) fail("INVALID_TIMESTAMP", "Times must be ISO-8601 values.");
  return value;
}

/** True when a pointer in the case can hold this id: the reader's rule. */
export function pointerIdOk(id) {
  return typeof id === "string" && id.length > 0 && id.length <= DOSSIER_POINTER_ID_LIMIT && !/[\r\n\u{2028}\u{2029}]/u.test(id);
}

/** "E" + one more than the largest n for which `E<n>` is any string value
    in the payload, ids and references alike (ids compare trimmed). */
export function nextEvidenceId(payload) {
  let largest = 0n;
  const visit = (value) => {
    if (typeof value === "string") {
      const match = /^\s*E(\d+)\s*$/.exec(value);
      if (match && BigInt(match[1]) > largest) largest = BigInt(match[1]);
    } else if (Array.isArray(value)) {
      value.forEach(visit);
    } else if (isRecord(value)) {
      Object.values(value).forEach(visit);
    }
  };
  visit(payload);
  return `E${largest + 1n}`;
}

// The day of the check in the device's time zone (or the given one).
function dayOf(instant, timeZone) {
  const date = new Date(instant ?? NaN);
  if (Number.isNaN(date.getTime())) throw new TypeError("Verified needs the time of the check.");
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(date);
  const part = (type) => parts.find((entry) => entry.type === type).value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}

function verifiedFields(fields, excerpt, timeZone) {
  const verifiedBy = String(fields?.verified_by ?? "").trim();
  if (!verifiedBy) throw new TypeError("Verified needs a name in Verified by.");
  return { verification_status: "verified", verified_by: verifiedBy, verification_date: dayOf(excerpt?.check?.decided_at, timeZone) };
}

const textOf = (value) => String(value ?? "");
// A text judgement the person must give: a missing or blank answer is the
// calling code's mistake, never an empty judgement made by the app.
const askedText = (value, name) => {
  if (typeof value !== "string" || !value.trim()) throw new TypeError(`${name} must be given.`);
  return value;
};
const strengthOf = (value) => (typeof value === "string" && value.trim() !== "" ? Number(value) : value);

/** A complete evidence record for the lens, made from a case source, one of
    its excerpts and the judgements the person gave. Nothing is guessed:
    fields the source or excerpt lack stay empty. */
export function newEvidenceFrom(lens, { payload, source, excerpt, fields = {}, timeZone } = {}) {
  lensOf(lens);
  const derived = {
    id: nextEvidenceId(payload),
    claim: textOf(fields.claim ?? excerpt?.text),
    source_title: textOf(source?.title),
    source_url: textOf(source?.url),
    source_date: textOf(source?.source_date),
  };
  const locator = textOf(excerpt?.locator);
  if (lens === "strategic") {
    return {
      id: derived.id,
      claim: derived.claim,
      basis: fields.basis,
      confidence: fields.confidence,
      source_title: derived.source_title,
      source_url: derived.source_url,
      source_date: derived.source_date,
      source_type: askedText(fields.source_type, "source_type"),
      source_note: locator,
      evidence_strength: strengthOf(fields.evidence_strength),
      uncertainty: askedText(fields.uncertainty, "uncertainty"),
      // The only judgement the form lets the person leave empty.
      counter_evidence: textOf(fields.counter_evidence),
    };
  }
  const verification = fields.verification_status;
  if (!PROMOTION_VERIFICATION_CHOICES.includes(verification)) throw new TypeError(`Unknown verification choice: ${verification}`);
  const check = verification === "verified"
    ? verifiedFields(fields, excerpt, timeZone)
    : { verification_status: verification, verified_by: "", verification_date: "" };
  return {
    id: derived.id,
    claim: derived.claim,
    epistemic_type: fields.epistemic_type,
    source_tier: fields.source_tier,
    source_title: derived.source_title,
    source_url: derived.source_url,
    source_locator: locator,
    source_date: derived.source_date,
    // The twelve context fields stay empty for the editor.
    geography: "",
    population: "",
    measurement_method: "",
    denominator: "",
    sample_size: "",
    measurement_validity: "",
    causal_identification: "",
    replication_status: blank(fields.replication_status) ? "unknown" : fields.replication_status,
    conflicts_of_interest: "",
    missing_data: "",
    selection_effects: "",
    relevant_comparison: "",
    cross_context_applicability: "",
    claim_source_fit: fields.claim_source_fit,
    ...check,
    uncertainty: askedText(fields.uncertainty, "uncertainty"),
    limitations: askedText(fields.limitations, "limitations"),
    counter_evidence: askedText(fields.counter_evidence, "counter_evidence"),
    confidence: fields.confidence,
  };
}

/** The item with its empty or blank source title, link, date and locator
    filled from the case; in Biopolitical, `verified` when the person chose
    it. Nothing else changes. Null when nothing would change. */
export function filledEvidence(lens, { item, source, excerpt, fields = {}, timeZone } = {}) {
  const key = locatorKey(lens);
  if (!isRecord(item)) throw new TypeError("Fill needs an evidence record.");
  const next = clone(item);
  let changed = false;
  for (const [field, value] of [["source_title", source?.title], ["source_url", source?.url], ["source_date", source?.source_date], [key, excerpt?.locator]]) {
    if (blank(next[field]) && !blank(value)) {
      next[field] = textOf(value);
      changed = true;
    }
  }
  if (fields.verification_status !== undefined) {
    if (lens !== "biopolitical" || fields.verification_status !== "verified" || !FILLABLE_STATUSES.includes(item.verification_status)) {
      throw new TypeError("Fill sets only verified, only on an unverified or partially verified Biopolitical record.");
    }
    Object.assign(next, verifiedFields(fields, excerpt, timeZone));
    changed = true;
  }
  return changed ? next : null;
}

/** A new payload with the item added at the end of the evidence, or put in
    place of the record whose id is `replaceId`. A Strategic analysis without
    evidence gets the section. */
export function withEvidence(lens, payload, item, { replaceId } = {}) {
  lensOf(lens);
  const next = clone(payload);
  if (next.evidence === undefined) next.evidence = { items: [] };
  if (!Array.isArray(next.evidence.items)) next.evidence.items = [];
  if (replaceId === undefined) {
    next.evidence.items.push(clone(item));
    return next;
  }
  const index = next.evidence.items.findIndex((entry) => entry?.id === replaceId);
  if (index < 0) throw new TypeError(`No evidence record ${replaceId} to replace.`);
  next.evidence.items[index] = clone(item);
  return next;
}

/** Whether the item, set to verified, passes the lens's own checks: the
    whole analysis with it has no error and is not downgraded. `validate`
    defaults to the Biopolitical import check; Strategic has no verification. */
export function canVerify(lens, payload, item, { validate = globalThis.Jarbou3iBiopoliticsIntegrity?.validateImport } = {}) {
  if (lensOf(lens) !== "biopolitical" || typeof validate !== "function" || !isRecord(item)) return false;
  // The schema takes a title or date of spaces; the form asks for a real one.
  if (blank(item.source_title) || blank(item.source_date)) return false;
  // The form fills Verified by and the date; only the rest is in question.
  const candidate = {
    ...item,
    verification_status: "verified",
    verified_by: blank(item.verified_by) ? "check" : item.verified_by,
    verification_date: blank(item.verification_date) ? "1970-01-01" : item.verification_date,
  };
  const present = (payload?.evidence?.items || []).some((entry) => entry?.id === item.id);
  const result = validate(withEvidence(lens, payload, candidate, present ? { replaceId: item.id } : {}));
  return (result?.errors || []).length === 0
    && !(result?.warnings || []).some((warning) => warning.code === "VERIFICATION_PROVENANCE_DOWNGRADED");
}

/** As prepareRevisionRestore: the payload goes into a copy of the workspace
    (same repository_revision, a new working draft on the head) with its
    proposal. No transaction, so the commit is a committed_resolution. The
    stored workspace is not touched; dropping the copy drops the change. */
export async function preparePromotion(workspace, payload, {
  validate,
  deriveDiagnostics = () => ({}),
  clock,
  idFactory = defaultId,
  cryptoImpl,
} = {}) {
  const verified = await verifyWorkspace(workspace, { cryptoImpl });
  if (verified.working_draft.dirty) {
    fail("DRAFT_NOT_CLEAN", "The working draft has uncommitted changes. Commit or remove that draft first.");
  }
  const occurredAt = timestamp(clock);
  const preparedWorkspace = clone(verified);
  preparedWorkspace.working_draft = {
    draft_id: idFactory("draft"),
    base_revision_id: verified.head_revision_id,
    updated_at: occurredAt,
    payload_checksum: await sha256(payload, cryptoImpl),
    canonical_payload: clone(payload),
    dirty: true,
  };
  const proposal = await createResolutionProposal(preparedWorkspace, {
    validate,
    deriveDiagnostics,
    clock: () => occurredAt,
    idFactory,
    cryptoImpl,
  });
  return Object.freeze({ workspace: preparedWorkspace, proposal });
}
