/* Append-only operational review ledger. Review state never mutates canonical analysis. */

import { canonicalStringify, sha256, WorkspaceContractError } from "./workspace-contract.js";

export const REVIEW_LEDGER_FORMAT = "jarbou3i-operational-review-ledger";
export const REVIEW_LEDGER_VERSION = 1;
export const REVIEW_EVENT_TYPES = Object.freeze([
  "task_started",
  "task_completed",
  "task_waived",
  "task_reopened",
  "note_added",
]);

const clone = (value) => structuredClone(value);
const clean = (value) => String(value ?? "").trim();
const validDate = (value) => Number.isFinite(Date.parse(value));

function fail(code, message, details = {}) {
  throw new WorkspaceContractError(code, message, details);
}

function timestamp(clock) {
  const value = typeof clock === "function" ? clock() : new Date().toISOString();
  if (!validDate(value)) fail("INVALID_REVIEW_TIMESTAMP", "Review events require an ISO-8601 timestamp.");
  return value;
}

function normalizeReviewer(reviewer) {
  const reviewerId = clean(reviewer?.reviewer_id);
  const displayName = clean(reviewer?.display_name);
  if (!reviewerId || !displayName) {
    fail("REVIEWER_IDENTITY_REQUIRED", "A stable local reviewer ID and display name are required.");
  }
  return { reviewer_id: reviewerId, display_name: displayName, identity_assurance: "local_assertion" };
}

function taskSnapshot(task) {
  const snapshot = {
    plan_task_id: clean(task?.id ?? task?.plan_task_id),
    phase: clean(task?.phase),
    reason_code: clean(task?.reasonCode ?? task?.reason_code),
    target_type: clean(task?.targetType ?? task?.target_type),
    target_id: clean(task?.targetId ?? task?.target_id),
    owner_id: clean(task?.ownerId ?? task?.owner_id),
    canonical_path: clean(task?.canonicalPath ?? task?.canonical_path),
  };
  if (!snapshot.phase || !snapshot.reason_code || !snapshot.target_type || !snapshot.target_id) {
    fail("INVALID_REVIEW_TASK", "Review tasks require phase, reason, target type, and target identity.");
  }
  return snapshot;
}

export function createReviewLedger({ clock } = {}) {
  return {
    format: REVIEW_LEDGER_FORMAT,
    format_version: REVIEW_LEDGER_VERSION,
    created_at: timestamp(clock),
    head_event_hash: null,
    events: [],
  };
}

export async function reviewTaskKey(task, { cryptoImpl } = {}) {
  const { plan_task_id: displaySequence, ...semanticIdentity } = taskSnapshot(task);
  return `rt_${await sha256(semanticIdentity, cryptoImpl)}`;
}

function eventBody(event) {
  const { event_hash: ignored, ...body } = event;
  return body;
}

export async function verifyReviewLedger(ledger, { cryptoImpl } = {}) {
  if (!ledger || ledger.format !== REVIEW_LEDGER_FORMAT || ledger.format_version !== REVIEW_LEDGER_VERSION) {
    fail("INVALID_REVIEW_LEDGER", "Operational review ledger format is unsupported.");
  }
  if (!validDate(ledger.created_at) || !Array.isArray(ledger.events)) {
    fail("INVALID_REVIEW_LEDGER", "Operational review ledger metadata is malformed.");
  }
  let previousHash = null;
  const eventIds = new Set();
  for (let index = 0; index < ledger.events.length; index += 1) {
    const event = ledger.events[index];
    if (event.sequence !== index + 1 || event.previous_event_hash !== previousHash) {
      fail("REVIEW_LEDGER_CHAIN_BROKEN", "Review event sequence or hash linkage is invalid.", { sequence: index + 1 });
    }
    if (!REVIEW_EVENT_TYPES.includes(event.type) || eventIds.has(event.event_id)) {
      fail("INVALID_REVIEW_EVENT", "Review event type or identity is invalid.", { sequence: index + 1 });
    }
    eventIds.add(event.event_id);
    if (!validDate(event.occurred_at) || !event.task_key || !event.draft_checksum) {
      fail("INVALID_REVIEW_EVENT", "Review event provenance is incomplete.", { sequence: index + 1 });
    }
    if (!Number.isInteger(event.repository_revision_before) || event.repository_revision_before < 1
      || !/^[a-f0-9]{64}$/.test(event.draft_checksum)
      || !/^[a-f0-9]{64}$/.test(event.event_hash)) {
      fail("INVALID_REVIEW_EVENT", "Review event revision or checksum provenance is malformed.", { sequence: index + 1 });
    }
    normalizeReviewer(event.reviewer);
    taskSnapshot(event.task);
    if (await reviewTaskKey(event.task, { cryptoImpl }) !== event.task_key) {
      fail("REVIEW_TASK_KEY_MISMATCH", "A review event no longer matches its semantic task identity.", { sequence: index + 1 });
    }
    if (event.type === "note_added" ? !clean(event.note) : !clean(event.rationale)) {
      fail("INVALID_REVIEW_EVENT", "Review event rationale or note is missing.", { sequence: index + 1 });
    }
    if (event.type === "task_waived") {
      if (!clean(event.waiver?.scope) || !clean(event.waiver?.accepted_risk)
        || (event.waiver?.expires_at && !validDate(event.waiver.expires_at))) {
        fail("INVALID_REVIEW_WAIVER", "Stored waiver record is incomplete.", { sequence: index + 1 });
      }
    } else if (event.waiver !== null) {
      fail("INVALID_REVIEW_EVENT", "Only waiver events may carry waiver data.", { sequence: index + 1 });
    }
    const expected = await sha256(eventBody(event), cryptoImpl);
    if (expected !== event.event_hash) {
      fail("REVIEW_EVENT_HASH_MISMATCH", "An immutable review event failed integrity verification.", { sequence: index + 1 });
    }
    previousHash = event.event_hash;
  }
  if (ledger.head_event_hash !== previousHash) {
    fail("REVIEW_LEDGER_HEAD_MISMATCH", "Review ledger head does not match its event chain.");
  }
  return clone(ledger);
}

export function projectReviewLedger(ledger) {
  const tasks = new Map();
  for (const event of ledger?.events || []) {
    const current = tasks.get(event.task_key) || {
      task_key: event.task_key,
      task: clone(event.task),
      status: "pending",
      reviewer: null,
      rationale: "",
      waiver: null,
      notes: [],
      event_count: 0,
      last_event_at: "",
      draft_checksum: event.draft_checksum,
    };
    current.task = current.task || clone(event.task);
    current.event_count += 1;
    current.last_event_at = event.occurred_at;
    current.draft_checksum = event.draft_checksum;
    if (event.type === "task_started") {
      current.status = "in_review";
      current.reviewer = clone(event.reviewer);
      current.rationale = event.rationale;
      current.waiver = null;
    } else if (event.type === "task_completed") {
      current.status = "completed";
      current.reviewer = clone(event.reviewer);
      current.rationale = event.rationale;
      current.waiver = null;
    } else if (event.type === "task_waived") {
      current.status = "waived";
      current.reviewer = clone(event.reviewer);
      current.rationale = event.rationale;
      current.waiver = clone(event.waiver);
    } else if (event.type === "task_reopened") {
      current.status = "in_review";
      current.reviewer = clone(event.reviewer);
      current.rationale = event.rationale;
      current.waiver = null;
    } else if (event.type === "note_added") {
      current.notes.push({ note: event.note, reviewer: clone(event.reviewer), occurred_at: event.occurred_at });
    }
    tasks.set(event.task_key, current);
  }
  return Object.freeze({
    tasks,
    counts: Object.freeze([...tasks.values()].reduce((result, task) => {
      result[task.status] = (result[task.status] || 0) + 1;
      return result;
    }, { pending: 0, in_review: 0, completed: 0, waived: 0 })),
  });
}

function requireTransition(type, current) {
  const status = current?.status || "pending";
  const allowed = {
    task_started: ["pending", "in_review"],
    task_completed: ["in_review"],
    task_waived: ["pending", "in_review"],
    task_reopened: ["completed", "waived"],
    note_added: ["pending", "in_review", "completed", "waived"],
  };
  if (!allowed[type]?.includes(status)) {
    fail("INVALID_REVIEW_TRANSITION", `Cannot apply ${type} while task status is ${status}.`, { type, status });
  }
}

export async function appendReviewEvent(workspace, {
  type,
  task,
  reviewer,
  rationale = "",
  note = "",
  waiver = null,
  clock,
  idFactory = (prefix) => `${prefix}_${globalThis.crypto.randomUUID()}`,
  cryptoImpl,
} = {}) {
  if (!REVIEW_EVENT_TYPES.includes(type)) fail("INVALID_REVIEW_EVENT_TYPE", "Unsupported review event type.");
  const next = clone(workspace);
  await verifyReviewLedger(next.review_ledger, { cryptoImpl });
  const normalizedTask = taskSnapshot(task);
  const taskKey = await reviewTaskKey(normalizedTask, { cryptoImpl });
  const projection = projectReviewLedger(next.review_ledger);
  requireTransition(type, projection.tasks.get(taskKey));
  const reviewerIdentity = normalizeReviewer(reviewer);
  const cleanRationale = clean(rationale);
  const cleanNote = clean(note);
  if (["task_started", "task_completed", "task_waived", "task_reopened"].includes(type) && !cleanRationale) {
    fail("REVIEW_RATIONALE_REQUIRED", "This review decision requires a rationale.");
  }
  if (type === "note_added" && !cleanNote) fail("REVIEW_NOTE_REQUIRED", "Review notes cannot be empty.");
  let waiverRecord = null;
  if (type === "task_waived") {
    const scope = clean(waiver?.scope);
    const risk = clean(waiver?.accepted_risk);
    const expiresAt = clean(waiver?.expires_at);
    if (!scope || !risk || (expiresAt && !validDate(expiresAt))) {
      fail("INVALID_REVIEW_WAIVER", "A waiver requires scope, accepted risk, and a valid optional expiry.");
    }
    waiverRecord = { scope, accepted_risk: risk, expires_at: expiresAt || null };
  }
  const occurredAt = timestamp(clock);
  const body = {
    event_id: idFactory("review_evt"),
    sequence: next.review_ledger.events.length + 1,
    type,
    occurred_at: occurredAt,
    previous_event_hash: next.review_ledger.head_event_hash,
    workspace_id: next.workspace_id,
    repository_revision_before: next.repository_revision,
    draft_checksum: next.working_draft.payload_checksum,
    task_key: taskKey,
    task: normalizedTask,
    reviewer: reviewerIdentity,
    rationale: cleanRationale,
    note: cleanNote,
    waiver: waiverRecord,
  };
  const event = { ...body, event_hash: await sha256(body, cryptoImpl) };
  next.review_ledger.events.push(event);
  next.review_ledger.head_event_hash = event.event_hash;
  next.repository_revision += 1;
  next.metadata.updated_at = occurredAt;
  await verifyReviewLedger(next.review_ledger, { cryptoImpl });
  return next;
}

export async function reviewLedgerManifest(workspace, { tasks = [], cryptoImpl } = {}) {
  const projection = projectReviewLedger(workspace.review_ledger);
  const taskStates = await Promise.all(tasks.map(async (task) => {
    const normalizedTask = taskSnapshot(task);
    const taskKey = await reviewTaskKey(normalizedTask, { cryptoImpl });
    const current = projection.tasks.get(taskKey);
    return {
      task_key: taskKey,
      task: normalizedTask,
      status: current?.status || "pending",
      reviewer: current?.reviewer ? clone(current.reviewer) : null,
      event_count: current?.event_count || 0,
      last_event_at: current?.last_event_at || null,
      waiver: current?.waiver ? clone(current.waiver) : null,
    };
  }));
  const statuses = taskStates.length ? taskStates : [...projection.tasks.values()];
  const statusCounts = statuses.reduce((result, task) => {
    result[task.status] = (result[task.status] || 0) + 1;
    return result;
  }, { pending: 0, in_review: 0, completed: 0, waived: 0 });
  return Object.freeze({
    format: REVIEW_LEDGER_FORMAT,
    format_version: REVIEW_LEDGER_VERSION,
    workspace_id: workspace.workspace_id,
    analysis_identity: clone(workspace.analysis_identity),
    canonical_transport: false,
    identity_assurance: "local_assertion",
    completion_validates_conclusions: false,
    includes_current_plan_snapshot: taskStates.length > 0,
    head_event_hash: workspace.review_ledger.head_event_hash,
    event_count: workspace.review_ledger.events.length,
    status_counts: statusCounts,
    task_states: taskStates,
    events: clone(workspace.review_ledger.events),
  });
}
