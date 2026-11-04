import fs from "node:fs";
import assertNode from "node:assert/strict";
import { canonicalStringify, sha256 } from "../src/core/workspace-contract.js";
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
let assertionCount = 0;
const assert = (condition, message) => { assertionCount += 1; if (!condition) fail(message); };
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
assert(dossier.format === DOSSIER_FORMAT && dossier.format_version === 1 && DOSSIER_FORMAT_VERSION === 2, "dossier format is not stamped");
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
await expectCode(() => verifyDossier({ ...structuredClone(dossier), format_version: 3 }), "DOSSIER_FORMAT_NEWER");
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



// RESEARCH-1B S5: source changes are replayable record operations.
const sourceContract = await import("../src/core/research-dossier.js");
assert(typeof sourceContract.addSource === "function", "source changes are missing");

const { addSource, editSource, removeSource, addExcerpt, editExcerpt, removeExcerpt, checkExcerpt, reopenExcerpt, DOSSIER_FILE_LIMIT } = sourceContract;
let sourceSequence = 0;
const materialClock = () => new Date(Date.UTC(2026, 10, 2, 12, 0, sourceSequence++)).toISOString();
const materialOptions = { clock: materialClock, idFactory: (prefix) => prefix + "_00000000-0000-4000-8000-" + (++sourceSequence).toString(16).padStart(12, "0") };
const equal = (actual, expected) => { assertionCount += 1; assertNode.deepEqual(actual, expected); };
const sign = async (body) => ({ ...body, checksum: { algorithm: "SHA-256", value: await sha256(canonicalStringify(body)) } });
const resign = async (record) => { const { checksum, ...body } = record; return sign(body); };
for (const fixture of ["research-dossier-origin-main.json"]) {
  const released = JSON.parse(fs.readFileSync(new URL("./fixtures/" + fixture, import.meta.url), "utf8"));
  equal(await verifyDossier(released), released);
  const upgraded = await addSource(released, { title: "Legacy case source" }, materialOptions);
  equal(upgraded.framing, released.framing);
  equal(upgraded.completion, released.completion);
  equal(await verifyDossier(upgraded), upgraded);
  if (fixture === "research-dossier-origin-main.json") equal(await createDossier({ framing: released.framing, clock: () => released.created_at, idFactory: () => released.dossier_id }), released);
}
const colonFraming = framingFromFields({ terms: ":x\n：x: y" });
equal(framingFromFields(fieldsFromFraming(colonFraming)), colonFraming);
await createDossier({ framing: colonFraming });
await expectCode(() => createDossier({ framing: { contested_terms: [{ term: ":x", working_definition: "definition" }] } }), "DOSSIER_SHAPE_INVALID");
// Crafted legacy forms outside the released field contract are refused.
const invalidLegacy = JSON.parse(fs.readFileSync(new URL("./fixtures/research-dossier-origin-main-legacy.json", import.meta.url), "utf8"));
await expectCode(() => verifyDossier(invalidLegacy), "DOSSIER_SHAPE_INVALID");
await expectCode(() => readDossierFile(JSON.stringify(invalidLegacy)), "DOSSIER_SHAPE_INVALID");
const legacyInteger = await resign({ ...dossier, revision: 2 ** 53 });
await expectCode(() => verifyDossier(legacyInteger), "DOSSIER_SHAPE_INVALID");
await expectCode(() => readDossierFile(JSON.stringify(legacyInteger)), "DOSSIER_SHAPE_INVALID");
await expectCode(() => updateDossier(legacyInteger, {}), "DOSSIER_SHAPE_INVALID");
const laterRecord = { format: DOSSIER_FORMAT, format_version: 3, dossier_id: "later", framing: null, checksum: null };
const laterBackend = createMemoryDossierBackend([laterRecord]);
const laterRepo = createDossierRepository({ backend: laterBackend });
equal(await laterRepo.list(), [{ dossier_id: "later", integrity_status: "newer", error_code: "DOSSIER_FORMAT_NEWER", format_version: 3 }]);
await expectCode(() => laterRepo.get("later"), "DOSSIER_FORMAT_NEWER");
await expectCode(() => readDossierFile(JSON.stringify(laterRecord)), "DOSSIER_FORMAT_NEWER");
equal(await laterBackend.get("later"), laterRecord);
await expectCode(() => verifyDossier({ ...laterRecord, format: "other" }), "DOSSIER_FORMAT_UNSUPPORTED");

const withSource = await addSource(dossier, { title: "Document", source_id: "caller", added_at: "caller" }, materialOptions);
assert(withSource.format_version === 2 && withSource.sources.length === 1 && withSource.excerpts.length === 0, "first source did not choose format 2");
// Both formats reject shapes that cannot survive a field edit, even when sealed.
for (const record of [dossier, withSource]) {
  const badFramings = [
    ...["scope_in", "scope_out", "limits"].map((key) => ({ ...record.framing, [key]: ["two\nlines"] })),
    { ...record.framing, contested_terms: [{ term: "two\rlines", working_definition: "" }] },
    { ...record.framing, contested_terms: [{ term: "term", working_definition: "two\nlines" }] },
    { ...record.framing, contested_terms: [{ term: ":term", working_definition: "definition" }] },
  ];
  const badRecords = [
    ...badFramings.map((framing) => ({ ...record, framing })),
    { ...record, completion: [{ criterion_id: "C1", text: "two\nlines", status: "open", rationale: "", decided_at: null }] },
    { ...record, completion: ["C1", "C2"].map((criterion_id) => ({ criterion_id, text: "same", status: "open", rationale: "", decided_at: null })) },
    { ...record, created_at: "yesterday" }, { ...record, updated_at: "yesterday" },
    { ...record, revision: 2 ** 53 },
  ];
  for (const bad of badRecords) {
    const sealed = await resign(bad);
    await expectCode(() => verifyDossier(sealed), "DOSSIER_SHAPE_INVALID");
    await expectCode(() => readDossierFile(JSON.stringify(sealed)), "DOSSIER_SHAPE_INVALID");
  }
}
const source = withSource.sources[0];
assert(source.source_id.startsWith("source_00000000-") && source.added_at !== "caller" && source.send && source.accessed_on === "", "source identity, time or defaults came from caller");
equal(Object.keys(withSource).filter((key) => !["sources", "excerpts"].includes(key)), Object.keys(dossier));
const removedSource = await removeSource(withSource, source, [], materialOptions);
assert(removedSource.format_version === 1 && !("sources" in removedSource) && !("excerpts" in removedSource), "last source did not return to format 1");
equal(Object.keys(removedSource), Object.keys(dossier));
const independent = await updateDossier(withSource, { framing: { question: "Another tab's framing" } });
const replaySourceEdit = await editSource(independent, source, { send: false, source_id: "forged", added_at: "forged" }, materialOptions);
assert(!replaySourceEdit.sources[0].send && replaySourceEdit.sources[0].source_id === source.source_id && replaySourceEdit.sources[0].added_at === source.added_at, "source edit changed identity or time");
assert(replaySourceEdit.framing.question === independent.framing.question, "source replay lost an unrelated framing write");
await expectCode(() => editSource(replaySourceEdit, source, { title: "stale" }, materialOptions), "CHANGED_ELSEWHERE");
await expectCode(() => removeSource(replaySourceEdit, source, [], materialOptions), "CHANGED_ELSEWHERE");
await expectCode(() => editSource(removedSource, source, { title: "gone" }, materialOptions), "CHANGED_ELSEWHERE");
await expectCode(() => removeSource(removedSource, source, [], materialOptions), "CHANGED_ELSEWHERE");
await expectCode(() => addSource(withSource, { title: "  DOCUMENT  " }, materialOptions), "SOURCE_EXISTS");
const linkedSource = await addSource(withSource, { title: "Document", url: "https://EXAMPLE.com:443/" }, materialOptions);
await expectCode(() => addSource(linkedSource, { title: "Other", url: "https://example.com" }, materialOptions), "SOURCE_EXISTS");
await expectCode(() => editSource(linkedSource, linkedSource.sources[1], { url: "", title: "Ｄｏｃｕｍｅｎｔ" }, materialOptions), "SOURCE_EXISTS");
for (const fields of [ { title: "" }, { title: "two\nlines" }, { title: "x".repeat(501) }, { title: "x", url: "javascript:alert(1)" }, { title: "x", url: "https://a/\nx" }, { title: "x", url: "https://a/" + "x".repeat(500) }, { title: "x", source_date: "two\rlines" }, { title: "x", source_date: "x".repeat(501) }, { title: "x", accessed_on: "2026-02-29" }, { title: "x", accessed_on: "2026-04-31" }, { title: "x", accessed_on: "2026-2-01" }, { title: "x", send: "true" } ]) {
  await expectCode(() => addSource(dossier, fields, materialOptions), "DOSSIER_SHAPE_INVALID");
}
const dated = await addSource(dossier, { title: "x".repeat(500), url: "https://a/" + "x".repeat(490), source_date: "d".repeat(500), accessed_on: "2024-02-29", send: false }, materialOptions);
assert(dated.sources[0].accessed_on === "2024-02-29", "a real leap date was refused");
await expectCode(() => addSource(dossier, { title: "x" }, { ...materialOptions, idFactory: () => "source_bad" }), "DOSSIER_SHAPE_INVALID");
await expectCode(() => addSource(dossier, { title: "x" }, { ...materialOptions, clock: () => "yesterday" }), "DOSSIER_SHAPE_INVALID");
const withExcerpt = await addExcerpt(withSource, source.source_id, { text: "The source\nsays this.", check: { status: "matches", reason: "forged", decided_at: "forged" }, added_at: "forged", excerpt_id: "forged" }, materialOptions);
const excerpt = withExcerpt.excerpts[0];
equal(excerpt.check, { status: "unchecked", reason: "", decided_at: null });
assert(excerpt.added_at !== "forged" && excerpt.excerpt_id.startsWith("excerpt_"), "excerpt identity or time came from the caller");
await expectCode(() => addExcerpt(removedSource, source.source_id, { text: "stale addition" }, materialOptions), "SOURCE_GONE");
for (const fields of [{ text: "" }, { text: "x".repeat(2001) }, { text: "ok", locator: "two\nlines" }, { text: "ok", locator: "x".repeat(501) }]) {
  await expectCode(() => addExcerpt(withSource, source.source_id, fields, materialOptions), "DOSSIER_SHAPE_INVALID");
}
await addExcerpt(withSource, source.source_id, { text: "x".repeat(2000), locator: "x".repeat(500) }, materialOptions);
for (const decision of [{ status: "matches", reason: " " }, { status: "differs", reason: "" }, { status: "matches", reason: "x".repeat(1001) }, { status: "unchecked", reason: "x" }]) {
  await expectCode(() => checkExcerpt(withExcerpt, excerpt, decision, materialOptions), "DOSSIER_SHAPE_INVALID");
}
const checked = await checkExcerpt(withExcerpt, excerpt, { status: "matches", reason: "Checked page 2", decided_at: "caller" }, materialOptions);
const checkedExcerpt = checked.excerpts[0];
assert(checkedExcerpt.check.decided_at !== "caller" && checkedExcerpt.check.decided_at !== null, "check time came from the caller");
const sameCheck = await checkExcerpt(checked, checkedExcerpt, { status: "matches", reason: " Checked page 2 " }, materialOptions);
equal(sameCheck.excerpts[0].check, checkedExcerpt.check);
const changedReason = await checkExcerpt(checked, checkedExcerpt, { status: "matches", reason: "x".repeat(1000) }, materialOptions);
assert(changedReason.excerpts[0].check.decided_at !== checkedExcerpt.check.decided_at, "changed reason kept decision time");
const differs = await checkExcerpt(checked, checkedExcerpt, { status: "differs", reason: checkedExcerpt.check.reason }, materialOptions);
assert(differs.excerpts[0].check.decided_at !== checkedExcerpt.check.decided_at, "changed status kept decision time");
for (const fields of [{ text: "Edited" }, { locator: "page 3" }]) {
  const editedExcerpt = await editExcerpt(checked, checkedExcerpt, fields, materialOptions);
  equal(editedExcerpt.excerpts[0].check, { status: "unchecked", reason: "", decided_at: null });
}
equal((await editExcerpt(checked, checkedExcerpt, { text: checkedExcerpt.text, check: { status: "differs" }, added_at: "forged", source_id: "forged" }, materialOptions)).excerpts[0], checkedExcerpt);
equal((await editSource(checked, source, { title: "New title", url: "https://a/", send: false }, materialOptions)).excerpts[0], checkedExcerpt);
equal((await updateDossier(checked, { framing: { question: "Changed framing" }, completion: [] })).excerpts, checked.excerpts);
equal((await linkAnalysis(checked, reference)).excerpts, checked.excerpts);
equal((await reopenExcerpt(checked, checkedExcerpt, materialOptions)).excerpts[0].check, { status: "unchecked", reason: "", decided_at: null });
assert((await removeExcerpt(checked, checkedExcerpt, materialOptions)).excerpts.length === 0, "excerpt removal failed");
const removedAll = await removeSource(checked, source, checked.excerpts, materialOptions);
assert(removedAll.format_version === 1 && !("excerpts" in removedAll), "source removal left excerpts behind");
for (const operation of [
  () => editExcerpt(checked, excerpt, { text: "stale" }, materialOptions),
  () => removeExcerpt(checked, excerpt, materialOptions),
  () => checkExcerpt(checked, excerpt, { status: "differs", reason: "stale" }, materialOptions),
  () => reopenExcerpt(checked, excerpt, materialOptions),
  () => removeSource(checked, source, withExcerpt.excerpts, materialOptions),
  () => removeSource(withExcerpt, source, [], materialOptions),
  () => removeExcerpt(removedAll, checkedExcerpt, materialOptions),
]) await expectCode(operation, "CHANGED_ELSEWHERE");
// Replay additions against a newer record, while refusing only changed targets.
const newerFraming = await updateDossier(checked, { framing: { question: "Concurrent write" } });
const addOnNewer = await addExcerpt(newerFraming, source.source_id, { text: "another" }, materialOptions);
assert(addOnNewer.excerpts.length === 2 && addOnNewer.framing.question === "Concurrent write", "replayed addition lost newer work");
await expectCode(() => removeSource(addOnNewer, source, checked.excerpts, materialOptions), "CHANGED_ELSEWHERE");
const store = createDossierRepository({ backend: createMemoryDossierBackend([checked]) });
await store.save(newerFraming, { expectedRevision: checked.revision });
const staleEdit = await editExcerpt(checked, checkedExcerpt, { locator: "page 5" }, materialOptions);
await expectCode(() => store.save(staleEdit, { expectedRevision: checked.revision }), "WRITE_CONFLICT");
const currentForReplay = await store.get(checked.dossier_id);
await store.save(await editExcerpt(currentForReplay, checkedExcerpt, { locator: "page 5" }, materialOptions), { expectedRevision: currentForReplay.revision });
await expectCode(async () => editExcerpt(await store.get(checked.dossier_id), checkedExcerpt, { text: "stale" }), "CHANGED_ELSEWHERE");

// Build saturated valid records directly to exercise both limits independently.
const uuidAt = (prefix, index) => prefix + "_00000000-0000-4000-8000-" + index.toString(16).padStart(12, "0");
const fiftySources = Array.from({ length: 50 }, (_, index) => ({ ...source, source_id: uuidAt("source", index), title: "Source " + index }));
const fullSources = await resign({ ...withSource, sources: fiftySources });
await expectCode(() => addSource(fullSources, { title: "51" }, materialOptions), "SOURCE_LIST_FULL");
const fiftyExcerpts = Array.from({ length: 50 }, (_, index) => ({ ...excerpt, excerpt_id: uuidAt("excerpt", index) }));
const fullSourceExcerpts = await resign({ ...withExcerpt, excerpts: fiftyExcerpts });
await expectCode(() => addExcerpt(fullSourceExcerpts, source.source_id, { text: "51" }, materialOptions), "EXCERPT_LIST_FULL");
const twoHundred = Array.from({ length: 200 }, (_, index) => ({ ...excerpt, excerpt_id: uuidAt("excerpt", index), source_id: fiftySources[Math.floor(index / 50)].source_id }));
const fullCaseExcerpts = await resign({ ...withExcerpt, sources: fiftySources, excerpts: twoHundred });
await expectCode(() => addExcerpt(fullCaseExcerpts, fiftySources[4].source_id, { text: "201" }, materialOptions), "EXCERPT_LIST_FULL");
for (const malformed of [
  { sources: [...fiftySources, fiftySources[0]] }, { excerpts: [...twoHundred, twoHundred[0]], sources: fiftySources },
  { excerpts: [...fiftyExcerpts, { ...excerpt, excerpt_id: uuidAt("excerpt", 999) }] },
  { sources: [source, source] }, { sources: [] }, { sources: undefined }, { excerpts: undefined },
  { excerpts: [{ ...excerpt, source_id: uuidAt("source", 999) }] },
  { excerpts: [{ ...excerpt, check: { status: "unchecked", reason: "bad", decided_at: null } }] },
  { excerpts: [{ ...excerpt, check: { status: "matches", reason: "x", decided_at: null } }] },
  { excerpts: [{ ...excerpt, check: { status: "unchecked", reason: "", decided_at: source.added_at } }] },
  { excerpts: [{ ...excerpt, excerpt_id: "excerpt_bad" }] },
]) await expectCode(() => verifyDossier({ ...withExcerpt, ...malformed }), "DOSSIER_SHAPE_INVALID");
// Changing any material, including a check, is covered by the record checksum.
await expectCode(() => verifyDossier({ ...checked, excerpts: [{ ...checkedExcerpt, check: { ...checkedExcerpt.check, reason: "Tampered" } }] }), "DOSSIER_CHECKSUM_MISMATCH");
equal(await readDossierFile(JSON.stringify(checked, null, 2)), checked);

// Record-v2 one-line fields reject Unicode line/paragraph separators on
// every entry path. Re-seal malformed restores so checksum failure cannot
// accidentally stand in for shape validation.
for (const codePoint of [0x2028, 0x2029]) {
  const separator = String.fromCharCode(codePoint);
  for (const key of ["title", "url", "source_date", "accessed_on"]) {
    const value = key === "url" ? `https://example.org/a${separator}b`
      : key === "accessed_on" ? `2024-${separator}02-29` : `before${separator}after`;
    await expectCode(() => addSource(dossier, { title: "Unicode boundary", [key]: value }, materialOptions), "DOSSIER_SHAPE_INVALID");
    await expectCode(() => editSource(withSource, source, { [key]: value }, materialOptions), "DOSSIER_SHAPE_INVALID");
    const restored = await resign({ ...withExcerpt, sources: [{ ...source, [key]: value }] });
    await expectCode(() => verifyDossier(restored), "DOSSIER_SHAPE_INVALID");
    await expectCode(() => readDossierFile(JSON.stringify(restored)), "DOSSIER_SHAPE_INVALID");
  }
  const locator = `page${separator}two`;
  await expectCode(() => addExcerpt(withSource, source.source_id, { text: "Reading", locator }, materialOptions), "DOSSIER_SHAPE_INVALID");
  await expectCode(() => editExcerpt(withExcerpt, excerpt, { locator }, materialOptions), "DOSSIER_SHAPE_INVALID");
  const badLocator = await resign({ ...withExcerpt, excerpts: [{ ...excerpt, locator }] });
  await expectCode(() => verifyDossier(badLocator), "DOSSIER_SHAPE_INVALID");
  await expectCode(() => readDossierFile(JSON.stringify(badLocator)), "DOSSIER_SHAPE_INVALID");

  const text = `first${separator}second`;
  const added = await addExcerpt(withSource, source.source_id, { text }, materialOptions);
  equal(added.excerpts[0].text, text);
  const edited = await editExcerpt(withExcerpt, excerpt, { text }, materialOptions);
  equal(edited.excerpts[0].text, text);
  const decided = await checkExcerpt(edited, edited.excerpts[0], { status: "matches", reason: text }, materialOptions);
  equal(decided.excerpts[0].check.reason, text);
  const revisedReason = await checkExcerpt(decided, decided.excerpts[0], { status: "differs", reason: `updated${separator}reason` }, materialOptions);
  equal(revisedReason.excerpts[0].check.reason, `updated${separator}reason`);
  equal(await verifyDossier(revisedReason), revisedReason);
  equal(await readDossierFile(JSON.stringify(revisedReason)), revisedReason);
}

const uppercaseUuid = "ABCDEFAB-CDEF-4ABC-8DEF-ABCDEFABCDEF";
for (const prefix of ["source", "excerpt"]) {
  const id = `${prefix.toUpperCase()}_${uppercaseUuid}`;
  const options = { ...materialOptions, idFactory: () => id };
  await expectCode(() => prefix === "source"
    ? addSource(dossier, { title: "Wrong prefix" }, options)
    : addExcerpt(withSource, source.source_id, { text: "Wrong prefix" }, options), "DOSSIER_SHAPE_INVALID");
  const malformed = await resign(prefix === "source"
    ? { ...withExcerpt, sources: [{ ...source, source_id: id }], excerpts: [{ ...excerpt, source_id: id }] }
    : { ...withExcerpt, excerpts: [{ ...excerpt, excerpt_id: id }] });
  await expectCode(() => verifyDossier(malformed), "DOSSIER_SHAPE_INVALID");
  await expectCode(() => readDossierFile(JSON.stringify(malformed)), "DOSSIER_SHAPE_INVALID");
}
const upperSource = await addSource(dossier, { title: "Uppercase UUID" }, { ...materialOptions, idFactory: (prefix) => `${prefix}_${uppercaseUuid}` });
const upperExcerpt = await addExcerpt(upperSource, upperSource.sources[0].source_id, { text: "Uppercase UUID reading" }, { ...materialOptions, idFactory: (prefix) => `${prefix}_${uppercaseUuid}` });
equal(upperExcerpt.sources[0].source_id, `source_${uppercaseUuid}`);
equal(upperExcerpt.excerpts[0].excerpt_id, `excerpt_${uppercaseUuid}`);
equal(await verifyDossier(upperExcerpt), upperExcerpt);
equal(await readDossierFile(JSON.stringify(upperExcerpt)), upperExcerpt);
console.log("Research dossier contract, released compatibility, formats, changes, limits and replay checks passed.");

// Byte count is for the exact pretty-printed export used by src/app.js.
const { maximalDossierBody } = await import("./fixtures/research-dossier-maximal.mjs");
const maximal = await sign(maximalDossierBody());
const maximalFile = JSON.stringify(maximal, null, 2);
const maximalBytes = Buffer.byteLength(maximalFile, "utf8");
assert(maximalBytes < DOSSIER_FILE_LIMIT, "largest contract file exceeds DOSSIER_FILE_LIMIT");
equal(await readDossierFile(maximalFile), maximal);
console.log("Largest dossier export: " + maximalBytes + " bytes; limit: " + DOSSIER_FILE_LIMIT + " bytes.");
console.log(assertionCount + " assertions passed; 0 failed.");
