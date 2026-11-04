import {
  DOSSIER_DATABASE_NAME,
  DOSSIER_FORMAT,
  DOSSIER_FORMAT_VERSION,
  createDossier,
  createDossierRepository,
  createIndexedDbDossierBackend,
  completionFromLines,
  createMemoryDossierBackend,
  fieldsFromFraming,
  framingFromFields,
  hasFraming,
  linkAnalysis,
  readDossierFile,
  updateDossier,
  verifyDossier,
} from "../src/core/research-dossier.js";
import { WORKSPACE_DATABASE_NAME } from "../src/core/workspace-storage.js";

const fail = (message) => {
  console.error(`Research dossier check failed: ${message}`);
  process.exit(1);
};
const assert = (condition, message) => { if (!condition) fail(message); };
const expectCode = async (operation, code) => {
  try { await operation(); } catch (error) {
    assert(error.code === code, `expected ${code}, received ${error.code || error}`);
    return;
  }
  fail(`expected ${code} to be rejected`);
};
let tick = 0;
const clock = () => `2026-10-30T10:00:${String(tick++).padStart(2, "0")}.000Z`;
const idFactory = (prefix) => `${prefix}_check`;

// A dossier exists before any analysis: the framing is the analyst's own.
const dossier = await createDossier({
  framing: {
    question: "  Who decides what the pass protects?  ",
    timeframe: "2020–2022, Europe",
    scope_in: ["Digital health passes"],
    scope_out: ["Vaccine efficacy"],
    contested_terms: [{ term: "Proportionality", working_definition: "Least restrictive means that work." }],
    limits: ["No access to non-public procurement files"],
  },
  completion: [{ criterion_id: "C1", text: "Each jurisdiction has a sourced exit route", status: "open" }],
  clock,
  idFactory,
});
assert(dossier.format === DOSSIER_FORMAT && dossier.format_version === DOSSIER_FORMAT_VERSION, "dossier format is not stamped");
assert(dossier.dossier_id === "dossier_check" && dossier.revision === 1, "a new dossier did not start at revision 1");
assert(dossier.framing.question === "Who decides what the pass protects?", "framing text was not trimmed");
assert(dossier.analyses.length === 0, "a new dossier invented a linked analysis");
assert(dossier.completion[0].decided_at === null, "an open criterion carries a decision time");
assert((await verifyDossier(dossier)).checksum.value === dossier.checksum.value, "a fresh dossier did not verify");
assert(DOSSIER_DATABASE_NAME !== WORKSPACE_DATABASE_NAME, "dossiers share the workspace database");

// The topic step's fields: one item per line, a term split from its meaning
// at the first colon, blank lines dropped; read back as the same text.
const fields = {
  question: " Who decides? ",
  timeframe: "2020–2022",
  scope_in: "Digital passes\n\n  Exit routes ",
  scope_out: "",
  terms: "Proportionality : least restrictive means\nTriage\nالتناسب: أقل الوسائل تقييدًا",
  limits: "No procurement files",
};
const framed = framingFromFields(fields);
assert(framed.question === "Who decides?" && framed.scope_in.join("|") === "Digital passes|Exit routes", "field lines were not read one per line");
assert(JSON.stringify(framed.contested_terms) === JSON.stringify([
  { term: "Proportionality", working_definition: "least restrictive means" },
  { term: "Triage", working_definition: "" },
  { term: "التناسب", working_definition: "أقل الوسائل تقييدًا" },
]), "a term was not split from its meaning at the first colon");
assert(hasFraming(framed) && !hasFraming(framingFromFields({ question: "Only a topic", timeframe: "2024" })), "the topic alone counted as framing");
const back = fieldsFromFraming(framed);
assert(back.terms === "Proportionality: least restrictive means\nTriage\nالتناسب: أقل الوسائل تقييدًا" && back.scope_in === "Digital passes\nExit routes", "framing did not read back as field text");
assert(JSON.stringify(framingFromFields(back)) === JSON.stringify(framed), "field text did not round-trip");

// The completion contract's field: one criterion per line, a repeated line
// once. A line kept keeps its criterion, status and reason; a new or changed
// line is a new criterion, open, under an id no criterion before has used.
const contract = completionFromLines("Each route is sourced\nTwo rival accounts\n\nEach route is sourced", []);
assert(JSON.stringify(contract) === JSON.stringify([
  { criterion_id: "C1", text: "Each route is sourced", status: "open" },
  { criterion_id: "C2", text: "Two rival accounts", status: "open" },
]), "criteria were not read one per line, once each");
const decidedContract = [contract[0], { ...contract[1], status: "met", rationale: "Both in the evidence.", decided_at: "2026-10-31T09:00:00.000Z" }];
const edited = completionFromLines("Two rival accounts\nA third criterion", decidedContract);
assert(edited[0].criterion_id === "C2" && edited[0].status === "met" && edited[0].rationale === "Both in the evidence.", "a kept line lost its decision");
assert(edited[1].criterion_id === "C3" && edited[1].status === "open", "a new line did not get a new id, open");

// Tampering, an unknown format and broken shapes are refused.
const tampered = structuredClone(dossier);
tampered.framing.question = "Another question";
await expectCode(() => verifyDossier(tampered), "DOSSIER_CHECKSUM_MISMATCH");
await expectCode(() => verifyDossier({ ...structuredClone(dossier), format_version: 2 }), "DOSSIER_FORMAT_UNSUPPORTED");
await expectCode(() => createDossier({ framing: { scope_in: "not a list" }, clock, idFactory }), "DOSSIER_SHAPE_INVALID");
await expectCode(() => createDossier({ framing: { question: "x".repeat(4001) }, clock, idFactory }), "DOSSIER_SHAPE_INVALID");
await expectCode(() => createDossier({ framing: { limits: Array(51).fill("limit") }, clock, idFactory }), "DOSSIER_SHAPE_INVALID");
await expectCode(() => createDossier({
  completion: [{ criterion_id: "C1", text: "One" }, { criterion_id: "C1", text: "Two" }], clock, idFactory,
}), "DOSSIER_SHAPE_INVALID");
// Only what the topic step's fields can hold again: one line per item, a term
// without the colon that ends it, each criterion once, real times, a revision
// that can still rise.
await expectCode(() => createDossier({ framing: { scope_in: ["Two\nlines"] }, clock, idFactory }), "DOSSIER_SHAPE_INVALID");
await expectCode(() => createDossier({ framing: { contested_terms: [{ term: "Term: with a colon" }] }, clock, idFactory }), "DOSSIER_SHAPE_INVALID");
await expectCode(() => createDossier({ completion: [{ criterion_id: "C1", text: "Two\nlines" }], clock, idFactory }), "DOSSIER_SHAPE_INVALID");
await expectCode(() => createDossier({
  completion: [{ criterion_id: "C1", text: "Same" }, { criterion_id: "C2", text: "Same" }], clock, idFactory,
}), "DOSSIER_SHAPE_INVALID");
await expectCode(() => verifyDossier({ ...structuredClone(dossier), updated_at: "yesterday" }), "DOSSIER_SHAPE_INVALID");
await expectCode(() => verifyDossier({ ...structuredClone(dossier), revision: 2 ** 53 }), "DOSSIER_SHAPE_INVALID");

// "Met" is the analyst's claim: it needs a rationale, and gets a time.
await expectCode(() => updateDossier(dossier, {
  completion: [{ criterion_id: "C1", text: "Each jurisdiction has a sourced exit route", status: "met" }],
}, { clock }), "DOSSIER_SHAPE_INVALID");
const decided = await updateDossier(dossier, {
  completion: [{ criterion_id: "C1", text: "Each jurisdiction has a sourced exit route", status: "met", rationale: "Checked all five." }],
}, { clock });
assert(decided.revision === 2, "an update did not raise the revision by one");
assert(decided.completion[0].decided_at && decided.completion[0].rationale === "Checked all five.", "a met criterion lost its rationale or time");
assert(decided.framing.question === dossier.framing.question, "an update of the contract changed the framing");
assert(dossier.revision === 1 && dossier.completion[0].status === "open", "an update mutated the earlier record");
// A changed reason is a new decision, even when the caller sends the old time back.
const redecided = await updateDossier(decided, { completion: [{ ...decided.completion[0], rationale: "Checked all six." }] }, { clock });
assert(redecided.completion[0].decided_at !== decided.completion[0].decided_at, "a changed rationale kept the old decision time");
const kept = await updateDossier(decided, { completion: decided.completion }, { clock });
assert(kept.completion[0].decided_at === decided.completion[0].decided_at, "an unchanged decision lost its time");

// An analysis is linked by reference only, once per revision.
const reference = { workspace_id: "workspace_a", revision_id: "revision_a", payload_checksum: "a".repeat(64) };
const linked = await linkAnalysis(decided, reference, { clock });
assert(linked.revision === 3 && linked.analyses.length === 1, "an analysis was not linked");
assert(Object.keys(linked.analyses[0]).sort().join() === "linked_at,payload_checksum,revision_id,workspace_id", "a link carries more than a reference");
assert((await linkAnalysis(linked, reference, { clock })) === linked, "linking the same revision twice wrote again");
await expectCode(() => linkAnalysis(linked, { workspace_id: "workspace_a" }, { clock }), "DOSSIER_SHAPE_INVALID");
// No write makes a record its reader would refuse: the 51st link is refused.
let full = linked;
for (let index = 1; index < 50; index += 1) {
  full = await linkAnalysis(full, { ...reference, revision_id: `revision_${index}` }, { clock: () => "2026-10-30T11:00:00.000Z" });
}
assert(full.analyses.length === 50, "fifty analyses could not be linked");
await expectCode(() => linkAnalysis(full, { ...reference, revision_id: "revision_51" }, { clock }), "DOSSIER_FULL");

// The repository verifies, refuses a stale write and lists damage, never deletes it.
const repository = createDossierRepository({ backend: createMemoryDossierBackend() });
await repository.create(dossier);
await expectCode(() => repository.create(dossier), "DOSSIER_EXISTS");
await repository.save(decided, { expectedRevision: 1 });
await expectCode(() => repository.save(linked, { expectedRevision: 1 }), "WRITE_CONFLICT");
await repository.save(linked, { expectedRevision: 2 });
assert((await repository.get(dossier.dossier_id)).revision === 3, "the repository did not keep the latest revision");
const damagedRepository = createDossierRepository({ backend: createMemoryDossierBackend([tampered]) });
const [listed] = await damagedRepository.list();
assert(listed.integrity_status === "corrupt" && listed.dossier_id === dossier.dossier_id, "a damaged dossier was not listed as damaged");
assert(!listed.framing, "a damaged dossier leaked unverified framing");
assert((await damagedRepository.list()).length === 1, "listing a damaged dossier removed it");
await repository.clear();
assert((await repository.list()).length === 0, "clearing left dossiers behind");

// A case file is the sealed record as written, read back only if it verifies.
const fileDossier = await createDossier({ framing: { question: "Who decides?" }, completion: completionFromLines("Each claim is sourced") });
const fromFile = await readDossierFile(`${JSON.stringify({ ...fileDossier, integrity_status: "verified" }, null, 2)}
`);
assert(JSON.stringify(fromFile) === JSON.stringify(fileDossier), "a case file did not read back as the record it holds");
await expectCode(() => readDossierFile("{ not json"), "DOSSIER_FILE_INVALID");
await expectCode(() => readDossierFile("null"), "DOSSIER_SHAPE_INVALID");
await expectCode(() => readDossierFile(JSON.stringify({ format: "jarbou3i-workspace-bundle" })), "DOSSIER_FORMAT_UNSUPPORTED");
await expectCode(() => readDossierFile(JSON.stringify({ ...fileDossier, framing: { ...fileDossier.framing, question: "Changed" } })), "DOSSIER_CHECKSUM_MISMATCH");

const unavailable = createIndexedDbDossierBackend({ indexedDB: { open() { throw new DOMException("blocked", "SecurityError"); } } });
await expectCode(() => unavailable.list(), "STORAGE_UNAVAILABLE");

// Calls that arrive together share one connection: a second one would stay
// open unseen and block the next version of the database.
let opens = 0;
const later = (request, result, after) => setTimeout(() => { request.result = result; request.onsuccess(); if (after) setTimeout(after); });
const fakeDatabase = {
  close() {},
  transaction() {
    const tx = {};
    const answer = (result) => { const request = {}; later(request, result, () => tx.oncomplete()); return request; };
    tx.objectStore = () => ({ getAll: () => answer([]), get: () => answer(undefined) });
    return tx;
  },
};
const shared = createIndexedDbDossierBackend({
  indexedDB: { open() { opens += 1; const request = {}; later(request, fakeDatabase); return request; } },
});
await Promise.all([shared.list(), shared.get("dossier_check")]);
assert(opens === 1, `calls arriving together opened ${opens} connections`);

console.log("Research dossier contract, integrity and repository checks passed.");
