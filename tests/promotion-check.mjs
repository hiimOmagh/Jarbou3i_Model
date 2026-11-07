/* RESEARCH-1C S10: making evidence from a case excerpt, checked against each
   lens's real schema and integrity checks (docs/features/research-promotion.md,
   acceptance 6-8). Every combination the form allows is built from the
   samples: a new record and Fill, the warnings each adds as exact sets. */
import assert from "node:assert/strict";
import fs from "node:fs";
import { canonicalStringify, createWorkspace } from "../src/core/workspace-contract.js";
import { writeEditorDraft } from "../src/core/canonical-editor.js";
import { commitResolution, createResolutionProposal } from "../src/core/resolution-transaction.js";
import { createMemoryWorkspaceBackend, createWorkspaceRepository } from "../src/core/workspace-storage.js";
import { createResultsInspectionIndex } from "../src/core/results-inspection.js";
import { DOSSIER_POINTER_ID_LIMIT, addExcerpt, addPromotion, addSource, createDossier } from "../src/core/research-dossier.js";
import {
  PROMOTION_VERIFICATION_CHOICES,
  canVerify,
  filledEvidence,
  newEvidenceFrom,
  nextEvidenceId,
  pointerIdOk,
  preparePromotion,
  withEvidence,
} from "../src/core/promotion.js";

// The lens scripts attach themselves to window, as in the page.
globalThis.window = globalThis;
for (const file of [
  "biopolitics-schema-validator.js",
  "strategic-schema-validator.js",
  "biopolitics-sample-i18n.js",
  "core/provenance.js",
  "biopolitics.js",
  "biopolitics-integrity.js",
  "biopolitics-graph.js",
]) await import(`../src/${file}`);
const { validateStrategicAnalysis } = await import("../src/strategic-integrity.js");
const BIO = globalThis.Jarbou3iBiopoliticsIntegrity;

const started = Date.now();
const readJson = (file) => JSON.parse(fs.readFileSync(new URL(`../${file}`, import.meta.url), "utf8"));
const clone = (value) => structuredClone(value);
const blank = (value) => !String(value ?? "").trim();
let cases = 0;
// Each kind of outcome the matrix must reach at least once.
const reached = { newVerified: 0, newContradiction: 0, soleBecameReal: 0, fillVerified: 0, fillClearsContradiction: 0, placeholderBecameReal: 0, becamePlaceholder: 0, nothingToFill: 0 };

// The checks the app runs on a lens payload (validateWorkspacePayload in
// src/app.js): the Biopolitical import check, the Strategic analysis check.
const check = (lens, payload) => (lens === "biopolitical" ? BIO.validateImport(payload) : validateStrategicAnalysis(payload));
const validatorFor = (lens) => (payload) => {
  const result = check(lens, payload);
  return { valid: result.errors.length === 0, errors: result.errors, warnings: result.warnings };
};
const issueKeys = (issues) => issues.map((issue) => `${issue.code} ${issue.path}`).sort();
function delta(before, after) {
  const left = new Map();
  for (const key of issueKeys(before)) left.set(key, (left.get(key) || 0) + 1);
  const added = [];
  for (const key of issueKeys(after)) {
    if (left.get(key)) left.set(key, left.get(key) - 1);
    else added.push(key);
  }
  const removed = [...left].flatMap(([key, count]) => Array(count).fill(key));
  return { added: added.sort(), removed: removed.sort() };
}
const allStrings = (value, into = new Set()) => {
  if (typeof value === "string") into.add(value.trim());
  else if (Array.isArray(value)) value.forEach((entry) => allStrings(entry, into));
  else if (value && typeof value === "object") Object.values(value).forEach((entry) => allStrings(entry, into));
  return into;
};

// The form's choices come from the schemas, not from a copy of them.
const bioSchema = readJson("schema/biopolitical-analysis.schema.json");
const strategicSchema = readJson("schema/strategic-analysis.schema.json");
const enumOf = (schema, property) => property.enum ?? schema.$defs[property.$ref.split("/").pop()].enum;
const bioField = (field) => enumOf(bioSchema, bioSchema.$defs.evidence.properties[field]);
const strategicField = (field) => enumOf(strategicSchema, strategicSchema.$defs.evidence.properties[field]);
const EPISTEMIC = bioField("epistemic_type");
const TIERS = bioField("source_tier");
const FITS = bioField("claim_source_fit");
const BIO_CONFIDENCE = bioField("confidence");
const REPLICATION = [...bioField("replication_status"), undefined]; // undefined: not given
const BASIS = strategicField("basis");
const STRATEGIC_CONFIDENCE = strategicField("confidence");
const score = strategicSchema.$defs.score5;
const STRENGTH = Array.from({ length: score.maximum - score.minimum + 1 }, (_, index) => score.minimum + index);
const BIO_KEYS = [...bioSchema.$defs.evidence.required].sort();
const STRATEGIC_KEYS = [...strategicSchema.$defs.evidence.required].sort();
const FITTING = ["direct", "indirect", "context_only"];
const QUANTITATIVE = ["sample_size", "measurement_validity", "causal_identification", "missing_data", "selection_effects", "relevant_comparison"];
assert.deepEqual([...PROMOTION_VERIFICATION_CHOICES], ["unverified", "partially_verified", "verified"]);
assert.ok(PROMOTION_VERIFICATION_CHOICES.every((choice) => bioField("verification_status").includes(choice)));

// Case material as the case record holds it (src/core/research-dossier.js).
const DECIDED_AT = "2026-03-01T23:30:00.000Z";
const SOURCES = [
  { name: "link and date", title: "Health pass regulation, Region B", url: "https://example.org/region-b/health-pass", source_date: "2021-06-01" },
  { name: "link, no date", title: "Venue access survey", url: "http://example.net/survey", source_date: "" },
  { name: "date, no link", title: "Parliamentary debate record", url: "", source_date: "2021-07-14" },
  { name: "title only", title: "Interview with a venue owner", url: "", source_date: "" },
  { name: "placeholder title", title: "Example source — replace with verified source", url: "https://example.org/placeholder", source_date: "2021-01-01", placeholder: true },
].map((source, index) => ({ source_id: `source_${index}`, accessed_on: "", send: true, ...source }));
const EXCERPTS = [
  { name: "with locator", locator: "Article 4, paragraph 2" },
  { name: "no locator", locator: "" },
].map((excerpt, index) => ({
  excerpt_id: `excerpt_${index}`,
  text: "Entry to venues required a health pass from June 2021.\nExemptions applied to under-12s.",
  check: { status: "matches", reason: "Same words on page 4.", decided_at: DECIDED_AT },
  ...excerpt,
}));
const UTC = "UTC";
const CHECK_DAY = "2026-03-01";

// Analyses with no error before.
const strategicSample = readJson("fixtures/sample-analysis-en.json");
const strategicWithout = clone(strategicSample);
delete strategicWithout.evidence;
const bioSample = readJson("fixtures/sample-analysis-bio-en.json");
// Every record verified and the self-audit says so: an unverified new
// record contradicts it.
const bioAllVerified = clone(bioSample);
bioAllVerified.evidence.items = bioAllVerified.evidence.items.map((item, index) => ({
  ...item,
  source_title: `Health pass regulation ${index + 1}`,
  source_url: `https://example.org/law-${index + 1}`,
  source_date: "2021-05-01",
  claim_source_fit: "direct",
  verification_status: "verified",
  verified_by: "Reviewer",
  verification_date: "2026-01-02",
}));
bioAllVerified.self_audit.statistics_quotations_verified = "pass";
// One record nothing cites and no link: a placeholder until it gets a link.
const withoutEvidenceIds = (value) => {
  if (Array.isArray(value)) return value.filter((entry) => !(typeof entry === "string" && /^E\d+$/.test(entry))).map(withoutEvidenceIds);
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, withoutEvidenceIds(entry)]));
  return value;
};
const bioSole = withoutEvidenceIds(clone(bioSample));
bioSole.evidence.items = [{ ...bioSample.evidence.items[0], source_title: "Health pass regulation, Region A", claim_source_fit: "direct" }];
assert.equal(globalThis.Jarbou3iBiopolitics.isPlaceholderEvidence(bioSole.evidence.items[0], bioSole), true, "the sole record must start as a placeholder");
// The same sole record with a placeholder title: a placeholder by its title.
const bioSoleTitled = clone(bioSole);
bioSoleTitled.evidence.items[0].source_title = SOURCES.find((source) => source.placeholder).title;
assert.equal(globalThis.Jarbou3iBiopolitics.isPlaceholderEvidence(bioSoleTitled.evidence.items[0], bioSoleTitled), true, "the titled sole record must start as a placeholder");

const BASES = {
  strategic: [
    { name: "sample", payload: strategicSample },
    { name: "no evidence section", payload: strategicWithout },
  ],
  biopolitical: [
    { name: "sample", payload: bioSample, auditPass: false },
    { name: "all verified", payload: bioAllVerified, auditPass: true },
  ],
};
// A new record joins a sole record: one uncited and with no link stops being
// a placeholder by shape (a placeholder needs to be the only record) and is
// then warned as uncited; one with a placeholder title stays a placeholder.
const SOLE_BASES = [
  { name: "sole record", payload: bioSole, soleByShape: true },
  { name: "sole record (placeholder title)", payload: bioSoleTitled, soleByShape: false },
];
for (const [lens, bases] of Object.entries(BASES)) {
  for (const base of [...bases, ...(lens === "biopolitical" ? SOLE_BASES : [])]) {
    const result = check(lens, base.payload);
    assert.deepEqual(result.errors, [], `${lens} ${base.name} must start with no error`);
    base.result = result;
  }
}

// ---- pointerIdOk: the case reader's rule for pointer ids --------------------
assert.equal(pointerIdOk("E7"), true);
assert.equal(pointerIdOk("x".repeat(DOSSIER_POINTER_ID_LIMIT)), true);
assert.equal(pointerIdOk("x".repeat(DOSSIER_POINTER_ID_LIMIT + 1)), false);
assert.equal(pointerIdOk(""), false);
for (const breakChar of ["\n", "\r", "\u{2028}", "\u{2029}"]) assert.equal(pointerIdOk(`E7${breakChar}`), false);
for (const value of [undefined, null, 7, ["E7"]]) assert.equal(pointerIdOk(value), false);
// The same answer as the case record itself, for each id a pointer holds:
// if the reader's rule changes, this says so.
{
  const withSource = await addSource(await createDossier(), { title: "Health pass regulation" });
  const record = await addExcerpt(withSource, withSource.sources[0].source_id, { text: "Entry needed a health pass." });
  const [excerpt] = record.excerpts;
  const basis = { text: excerpt.text, locator: excerpt.locator, source: record.sources[0] };
  const pointerFields = { workspace_id: "workspace_a", revision_id: "revision_a", evidence_id: "E7", kind: "new" };
  const samples = [
    "", "E7", "x".repeat(DOSSIER_POINTER_ID_LIMIT), "x".repeat(DOSSIER_POINTER_ID_LIMIT + 1),
    "\u{1F600}".repeat(DOSSIER_POINTER_ID_LIMIT / 2), `${"\u{1F600}".repeat(DOSSIER_POINTER_ID_LIMIT / 2)}x`,
    " ", "E7\t", "E7\v", "E7\f", "E7\u0085", "E7\u{FEFF}",
    ...["\n", "\r", "\r\n", "\u{2028}", "\u{2029}"].flatMap((breakChar) => [`E7${breakChar}`, `${breakChar}E7`]),
    7, null, undefined, ["E7"],
  ];
  for (const key of ["workspace_id", "revision_id", "evidence_id"]) for (const id of samples) {
    const accepted = await addPromotion(record, excerpt.excerpt_id, { ...pointerFields, [key]: id }, basis).then(() => true, (error) => {
      assert.equal(error.code, "DOSSIER_SHAPE_INVALID", `${key} ${JSON.stringify(id)}: ${error.message}`);
      return false;
    });
    assert.equal(pointerIdOk(id), accepted, `pointerIdOk and the case record disagree on ${key} ${JSON.stringify(id)}`);
    cases += 1;
  }
}

// ---- nextEvidenceId: never an id or a reference anywhere --------------------
assert.equal(nextEvidenceId(strategicSample), "E2");
assert.equal(nextEvidenceId(strategicWithout), "E1");
assert.equal(nextEvidenceId(bioSample), "E3");
assert.equal(nextEvidenceId({}), "E1");
assert.equal(nextEvidenceId({ a: [" E7 ", "E7x", "XE9", "e9", "E-9", "E 9", { b: "E3" }] }), "E8");
assert.equal(nextEvidenceId({ id: "E99999999999999999999" }), "E100000000000000000000");
// A dangling reference to the next id: the new record must not take it.
const dangling = clone(bioSample);
dangling.competing_explanations[0].supporting_evidence_ids.push("E3");
assert.equal(nextEvidenceId(dangling), "E4");
const strategicDangling = clone(strategicSample);
strategicDangling.links.push({ from: "A1", to: "E2", relation: "supports", strength: 3 });
assert.equal(nextEvidenceId(strategicDangling), "E3");
// Another record holding an E-number id counts as well.
const otherRecord = clone(strategicSample);
otherRecord.assumptions.items[0].id = "E5";
assert.equal(nextEvidenceId(otherRecord), "E6");
cases += 12;

// ---- the day of the check, in the device's time zone -----------------------
const verifiedFields = { epistemic_type: "verified_fact", source_tier: "official_dataset", claim_source_fit: "direct", confidence: "high", uncertainty: "u", limitations: "l", counter_evidence: "c", verification_status: "verified", verified_by: "  Reviewer A  " };
for (const [timeZone, day] of [["UTC", "2026-03-01"], ["Asia/Tokyo", "2026-03-02"], ["America/Los_Angeles", "2026-03-01"], ["Pacific/Kiritimati", "2026-03-02"]]) {
  const item = newEvidenceFrom("biopolitical", { payload: bioSample, source: SOURCES[0], excerpt: EXCERPTS[0], fields: verifiedFields, timeZone });
  assert.equal(item.verification_date, day, `check day in ${timeZone}`);
  assert.equal(item.verified_by, "Reviewer A");
}
assert.match(newEvidenceFrom("biopolitical", { payload: bioSample, source: SOURCES[0], excerpt: EXCERPTS[0], fields: verifiedFields }).verification_date, /^\d{4}-\d\d-\d\d$/);
assert.throws(() => newEvidenceFrom("biopolitical", { payload: bioSample, source: SOURCES[0], excerpt: EXCERPTS[0], fields: { ...verifiedFields, verified_by: " " } }), TypeError);
assert.throws(() => newEvidenceFrom("biopolitical", { payload: bioSample, source: SOURCES[0], excerpt: { ...EXCERPTS[0], check: { status: "unchecked", reason: "", decided_at: null } }, fields: verifiedFields }), TypeError);
assert.throws(() => newEvidenceFrom("biopolitical", { payload: bioSample, source: SOURCES[0], excerpt: EXCERPTS[0], fields: { ...verifiedFields, verification_status: "disputed" } }), TypeError);
assert.throws(() => newEvidenceFrom("other", { payload: bioSample, source: SOURCES[0], excerpt: EXCERPTS[0], fields: verifiedFields }), TypeError);

// ---- the review plan gives a new record its tasks --------------------------
function reviewTasks(lens, analysis, id) {
  const index = createResultsInspectionIndex({
    lens,
    analysis,
    graph: lens === "biopolitical" ? globalThis.Jarbou3iBiopoliticsGraph.build(analysis, "en") : null,
    provenance: globalThis.Jarbou3iProvenance.assessEvidenceProvenance(analysis, { lens }),
    lang: "en",
  });
  return index.reviewPlan.tasks.filter((task) => task.targetId === id).map((task) => task.reasonCode);
}

// ---- Strategic: every new record the form allows ---------------------------
function expectDerived(item, source, excerpt, locatorKey) {
  assert.equal(item.source_title, source.title);
  assert.equal(item.source_url, source.url);
  assert.equal(item.source_date, source.source_date);
  assert.equal(item[locatorKey], excerpt.locator);
}
let index = 0;
for (const base of BASES.strategic) {
  const used = allStrings(base.payload);
  for (const basis of BASIS) for (const confidence of STRATEGIC_CONFIDENCE) for (const strength of STRENGTH)
    for (const counter of ["", "Some states kept institutional weight after 1945."])
      for (const source of SOURCES) for (const excerpt of EXCERPTS) {
        index += 1;
        const edited = index % 4 === 0;
        const fields = {
          basis, confidence,
          evidence_strength: index % 2 ? String(strength) : strength, // the form's select gives text
          source_type: "official record", uncertainty: "Covers one region.", counter_evidence: counter,
          ...(edited ? { claim: "Venue entry needed a health pass." } : {}),
        };
        const item = newEvidenceFrom("strategic", { payload: base.payload, source, excerpt, fields });
        assert.deepEqual(Object.keys(item).sort(), STRATEGIC_KEYS);
        assert.equal(item.id, nextEvidenceId(base.payload));
        assert.ok(!used.has(item.id), `new id ${item.id} is already in the analysis`);
        assert.equal(item.claim, edited ? fields.claim : excerpt.text);
        expectDerived(item, source, excerpt, "source_note");
        assert.equal(item.evidence_strength, strength);
        assert.deepEqual([item.basis, item.confidence, item.source_type, item.uncertainty, item.counter_evidence], [basis, confidence, "official record", "Covers one region.", counter]);
        assert.equal(canVerify("strategic", base.payload, item), false, "Strategic has no verification");
        const payload = withEvidence("strategic", base.payload, item);
        assert.equal(payload.evidence.items.at(-1).id, item.id);
        const result = check("strategic", payload);
        assert.deepEqual(result.errors, [], `Strategic new record ${base.name}/${source.name}/${excerpt.name} has errors`);
        assert.deepEqual(delta(base.result.warnings, result.warnings), { added: [], removed: [] }, "Strategic adds no warning");
        cases += 1;
      }
}
assert.deepEqual(withEvidence("strategic", strategicWithout, { id: "E1" }).evidence, { items: [{ id: "E1" }] }, "the record starts the section");
assert.equal(strategicWithout.evidence, undefined, "withEvidence changed its input");
{
  const fields = { basis: "source_based", confidence: "medium", evidence_strength: 3, source_type: "report", uncertainty: "u", counter_evidence: "" };
  const item = newEvidenceFrom("strategic", { payload: strategicSample, source: SOURCES[0], excerpt: EXCERPTS[0], fields });
  const tasks = reviewTasks("strategic", withEvidence("strategic", strategicSample, item), item.id);
  assert.ok(tasks.includes("uncited_evidence") && tasks.includes("missing_counter_evidence"), `Strategic review tasks: ${tasks}`);
  const filledCounter = newEvidenceFrom("strategic", { payload: strategicSample, source: SOURCES[0], excerpt: EXCERPTS[0], fields: { ...fields, counter_evidence: "c" } });
  const counterTasks = reviewTasks("strategic", withEvidence("strategic", strategicSample, filledCounter), filledCounter.id);
  assert.ok(counterTasks.includes("uncited_evidence") && !counterTasks.includes("missing_counter_evidence"), `Strategic review tasks: ${counterTasks}`);
}

// ---- Biopolitical: every new record the form allows ------------------------
// The DoR rule for offering verified: a title that is not a placeholder, a
// date, a link or a locator, and a fitting claim/source fit.
const offerVerified = (source, excerpt, fit) => !source.placeholder && !blank(source.source_date)
  && (!blank(source.url) || !blank(excerpt.locator)) && FITTING.includes(fit);
function expectedNewWarnings(base, n, { source, epistemic, verification }) {
  const path = `/evidence/items/${n}`;
  const added = [];
  // A record from a placeholder-titled source is a placeholder: not warned as uncited.
  if (!source.placeholder) added.push(`UNREFERENCED_EVIDENCE ${path}/id`);
  if (verification !== "verified") added.push(`EVIDENCE_NOT_PUBLICATION_READY ${path}`);
  if (epistemic === "quantitative_estimate") added.push(...QUANTITATIVE.map((field) => `QUANTITATIVE_METADATA_MISSING ${path}/${field}`));
  // The sole record was a placeholder only because it was alone.
  if (base.soleByShape) {
    added.push("UNREFERENCED_EVIDENCE /evidence/items/0/id");
    reached.soleBecameReal += 1;
  }
  if (base.auditPass && verification !== "verified") {
    added.push("SELF_AUDIT_VERIFICATION_CONTRADICTION /self_audit/statistics_quotations_verified");
    reached.newContradiction += 1;
  }
  if (verification === "verified") reached.newVerified += 1;
  return { added: added.sort(), removed: [] };
}
const bioText = { uncertainty: "Rules changed over time.", limitations: "One region only.", counter_evidence: "Free testing was offered." };
function checkBioNew(base, fields, source, excerpt, label) {
  const item = newEvidenceFrom("biopolitical", { payload: base.payload, source, excerpt, fields, timeZone: UTC });
  assert.deepEqual(Object.keys(item).sort(), BIO_KEYS);
  assert.equal(item.id, nextEvidenceId(base.payload));
  assert.ok(!allStrings(base.payload).has(item.id), `new id ${item.id} is already in the analysis`);
  assert.equal(item.claim, fields.claim ?? excerpt.text);
  expectDerived(item, source, excerpt, "source_locator");
  for (const field of ["geography", "population", "measurement_method", "denominator", "sample_size", "measurement_validity", "causal_identification", "conflicts_of_interest", "missing_data", "selection_effects", "relevant_comparison", "cross_context_applicability"]) {
    assert.equal(item[field], "", `${field} must stay empty for the editor`);
  }
  assert.equal(item.replication_status, fields.replication_status ?? "unknown");
  for (const field of ["epistemic_type", "source_tier", "claim_source_fit", "confidence", "uncertainty", "limitations", "counter_evidence", "verification_status"]) {
    assert.equal(item[field], fields[field], `${field} is the person's choice`);
  }
  if (fields.verification_status === "verified") {
    assert.deepEqual([item.verified_by, item.verification_date], ["Reviewer A", CHECK_DAY]);
  } else {
    assert.deepEqual([item.verified_by, item.verification_date], ["", ""]);
  }
  const payload = withEvidence("biopolitical", base.payload, item);
  const result = check("biopolitical", payload);
  assert.deepEqual(result.errors, [], `${label} has errors: ${issueKeys(result.errors)}`);
  assert.deepEqual(delta(base.result.warnings, result.warnings), expectedNewWarnings(base, base.payload.evidence.items.length, { source, epistemic: fields.epistemic_type, verification: fields.verification_status }), label);
  if (fields.verification_status === "verified") {
    // prepareReviewableVerification leaves it as it is: nothing downgraded.
    assert.ok(!result.warnings.some((warning) => warning.code === "VERIFICATION_PROVENANCE_DOWNGRADED"), `${label} was downgraded`);
    assert.equal(canonicalStringify(result.analysis), canonicalStringify(payload), `${label} changed on import`);
  }
  cases += 1;
  return item;
}
index = 0;
for (const base of [...BASES.biopolitical, ...SOLE_BASES]) {
  for (const epistemic of EPISTEMIC) for (const fit of FITS) for (const source of SOURCES) for (const excerpt of EXCERPTS) {
    index += 1;
    // The judgements the validators do not read together are rotated.
    const common = {
      epistemic_type: epistemic, claim_source_fit: fit,
      source_tier: TIERS[index % TIERS.length],
      confidence: BIO_CONFIDENCE[Math.floor(index / 7) % BIO_CONFIDENCE.length],
      replication_status: REPLICATION[Math.floor(index / 3) % REPLICATION.length],
      ...bioText,
      ...(index % 5 === 0 ? { claim: "Venue entry needed a health pass." } : {}),
    };
    const label = `Biopolitical new record ${base.name}/${epistemic}/${fit}/${source.name}/${excerpt.name}`;
    const plain = newEvidenceFrom("biopolitical", { payload: base.payload, source, excerpt, fields: { ...common, verification_status: "unverified" } });
    const offered = canVerify("biopolitical", base.payload, plain);
    assert.equal(offered, offerVerified(source, excerpt, fit), `${label}: verified offered=${offered}`);
    for (const verification of PROMOTION_VERIFICATION_CHOICES) {
      const fields = { ...common, verification_status: verification, ...(verification === "verified" ? { verified_by: "Reviewer A" } : {}) };
      if (verification === "verified" && !offered) {
        // Not offered because the lens would refuse it.
        const refused = newEvidenceFrom("biopolitical", { payload: base.payload, source, excerpt, fields, timeZone: UTC });
        assert.ok(check("biopolitical", withEvidence("biopolitical", base.payload, refused)).errors.length > 0, `${label}: verified passed though not offered`);
        continue;
      }
      checkBioNew(base, fields, source, excerpt, `${label}/${verification}`);
    }
  }
}
// The judgements no check reads together: every value of each, all combined.
for (const tier of TIERS) for (const confidence of BIO_CONFIDENCE) for (const replication of REPLICATION) {
  checkBioNew(BASES.biopolitical[0], {
    epistemic_type: "institutional_claim", claim_source_fit: "indirect", source_tier: tier, confidence,
    ...(replication === undefined ? {} : { replication_status: replication }),
    ...bioText, verification_status: "partially_verified",
  }, SOURCES[0], EXCERPTS[0], `Biopolitical new record ${tier}/${confidence}/${replication}`);
}
{
  const item = newEvidenceFrom("biopolitical", { payload: bioSample, source: SOURCES[0], excerpt: EXCERPTS[0], fields: { ...verifiedFields, verification_status: "unverified" } });
  const tasks = reviewTasks("biopolitical", withEvidence("biopolitical", bioSample, item), item.id);
  assert.ok(tasks.includes("uncited_evidence"), `Biopolitical review tasks: ${tasks}`);
}
// A dangling reference to an id stays dangling: the new record takes the next one.
{
  const fields = { basis: "source_based", confidence: "medium", evidence_strength: 3, source_type: "report", uncertainty: "u", counter_evidence: "c" };
  const before = check("strategic", strategicDangling);
  assert.ok(before.errors.some((error) => error.code === "BROKEN_REFERENCE"));
  const item = newEvidenceFrom("strategic", { payload: strategicDangling, source: SOURCES[0], excerpt: EXCERPTS[0], fields });
  assert.equal(item.id, "E3");
  assert.deepEqual(issueKeys(check("strategic", withEvidence("strategic", strategicDangling, item)).errors), issueKeys(before.errors), "the new record resolved or added an error");
  const bioItem = newEvidenceFrom("biopolitical", { payload: dangling, source: SOURCES[0], excerpt: EXCERPTS[0], fields: { ...verifiedFields, verification_status: "unverified" } });
  assert.equal(bioItem.id, "E4");
  const bioBefore = check("biopolitical", dangling);
  assert.ok(bioBefore.errors.some((error) => error.code === "BROKEN_REFERENCE"));
  assert.deepEqual(issueKeys(check("biopolitical", withEvidence("biopolitical", dangling, bioItem)).errors), issueKeys(bioBefore.errors));
  cases += 2;
}

// ---- Fill: only empty or blank fields, never the claim or a judgement -----
const FILLABLE = ["source_title", "source_url", "source_date"];
function expectFilled(lens, before, after, source, excerpt, verifiedChosen, label) {
  const locator = lens === "strategic" ? "source_note" : "source_locator";
  const fromCase = { source_title: source.title, source_url: source.url, source_date: source.source_date, [locator]: excerpt.locator };
  assert.deepEqual(Object.keys(after).sort(), Object.keys(before).sort(), `${label}: keys changed`);
  for (const key of Object.keys(before)) {
    if (key in fromCase) {
      const expected = blank(before[key]) && !blank(fromCase[key]) ? fromCase[key] : before[key];
      assert.equal(after[key], expected, `${label}: ${key}`);
    } else if (verifiedChosen && ["verification_status", "verified_by", "verification_date"].includes(key)) {
      assert.equal(after[key], { verification_status: "verified", verified_by: "Reviewer A", verification_date: CHECK_DAY }[key], `${label}: ${key}`);
    } else {
      assert.deepEqual(after[key], before[key], `${label}: ${key} is not Fill's to change`);
    }
  }
}
const wouldFill = (lens, item, source, excerpt) => {
  const locator = lens === "strategic" ? "source_note" : "source_locator";
  return [["source_title", source.title], ["source_url", source.url], ["source_date", source.source_date], [locator, excerpt.locator]]
    .some(([key, value]) => blank(item[key]) && !blank(value));
};

// Strategic targets: the sample's E1 (no link), a record from a bare source,
// and one whose source fields hold only spaces.
const strategicFields = { basis: "inference", confidence: "low", evidence_strength: 2, source_type: "interview", uncertainty: "u", counter_evidence: "" };
const strategicTargets = [];
strategicTargets.push({ name: "sample E1", payload: strategicSample, id: "E1" });
{
  const bare = newEvidenceFrom("strategic", { payload: strategicSample, source: SOURCES[3], excerpt: EXCERPTS[1], fields: strategicFields });
  strategicTargets.push({ name: "bare record", payload: withEvidence("strategic", strategicSample, bare), id: bare.id });
  const spaces = { ...bare, source_title: "  ", source_url: " ", source_date: "\t", source_note: " " };
  strategicTargets.push({ name: "blank record", payload: withEvidence("strategic", strategicWithout, { ...spaces, id: "E1" }), id: "E1" });
}
for (const target of strategicTargets) {
  const baseResult = check("strategic", target.payload);
  assert.deepEqual(baseResult.errors, [], `Strategic Fill target ${target.name} must start with no error`);
  const item = target.payload.evidence.items.find((entry) => entry.id === target.id);
  for (const source of SOURCES) for (const excerpt of EXCERPTS) {
    const label = `Strategic Fill ${target.name}/${source.name}/${excerpt.name}`;
    const filled = filledEvidence("strategic", { item, source, excerpt });
    if (!wouldFill("strategic", item, source, excerpt)) {
      assert.equal(filled, null, `${label}: offered with nothing to change`);
      continue;
    }
    expectFilled("strategic", item, filled, source, excerpt, false, label);
    const payload = withEvidence("strategic", target.payload, filled, { replaceId: item.id });
    assert.equal(payload.evidence.items.length, target.payload.evidence.items.length);
    const result = check("strategic", payload);
    assert.deepEqual(result.errors, [], `${label} has errors`);
    assert.deepEqual(delta(baseResult.warnings, result.warnings), { added: [], removed: [] }, label);
    cases += 1;
  }
  assert.throws(() => filledEvidence("strategic", { item, source: SOURCES[0], excerpt: EXCERPTS[0], fields: { verification_status: "verified", verified_by: "Reviewer A" } }), TypeError);
}

// Biopolitical targets.
const bioTargets = [];
// The sample's E1: its title is a placeholder, so it stays one.
bioTargets.push({ name: "sample E1 (placeholder title)", base: BASES.biopolitical[0], payload: bioSample, id: "E1", placeholderTitle: true });
// The sole record nothing cites: a link makes it a real, uncited record.
for (const fit of ["direct", "unknown"]) {
  const payload = clone(bioSole);
  payload.evidence.items[0].claim_source_fit = fit;
  bioTargets.push({ name: `sole record (${fit})`, base: { payload }, payload, id: "E1", sole: true });
}
// Records the form made from a bare source, on both bases.
for (const base of BASES.biopolitical) {
  for (const status of ["unverified", "partially_verified"]) for (const fit of ["direct", "context_only", "mismatched"]) for (const epistemic of ["verified_fact", "quantitative_estimate"]) {
    const bare = newEvidenceFrom("biopolitical", { payload: base.payload, source: SOURCES[3], excerpt: EXCERPTS[1], fields: { ...verifiedFields, epistemic_type: epistemic, claim_source_fit: fit, verification_status: status } });
    bioTargets.push({ name: `bare ${status} ${fit} ${epistemic} on ${base.name}`, base, payload: withEvidence("biopolitical", base.payload, bare), id: bare.id, auditPass: base.auditPass });
  }
}
{
  // Source fields holding only spaces count as empty.
  const bare = newEvidenceFrom("biopolitical", { payload: bioSample, source: SOURCES[3], excerpt: EXCERPTS[1], fields: { ...verifiedFields, verification_status: "unverified" } });
  const spaces = { ...bare, source_title: " ", source_url: "  ", source_date: "\t", source_locator: " " };
  bioTargets.push({ name: "blank record", base: BASES.biopolitical[0], payload: withEvidence("biopolitical", bioSample, spaces), id: spaces.id, blankTitle: true });
}
for (const target of bioTargets) {
  const baseResult = check("biopolitical", target.payload);
  assert.deepEqual(baseResult.errors, [], `Biopolitical Fill target ${target.name} must start with no error`);
  const position = target.payload.evidence.items.findIndex((entry) => entry.id === target.id);
  const item = target.payload.evidence.items[position];
  const path = `/evidence/items/${position}`;
  for (const source of SOURCES) for (const excerpt of EXCERPTS) {
    const label = `Biopolitical Fill ${target.name}/${source.name}/${excerpt.name}`;
    const filled = filledEvidence("biopolitical", { item, source, excerpt, timeZone: UTC });
    const changes = wouldFill("biopolitical", item, source, excerpt);
    if (!changes) {
      assert.equal(filled, null, `${label}: offered with nothing to change`);
      reached.nothingToFill += 1;
    }
    else expectFilled("biopolitical", item, filled, source, excerpt, false, label);
    const after = filled ?? item;
    // Offered verified: the DoR rule on the filled record; a sole record
    // with no link stays a placeholder even with a locator.
    const title = after.source_title;
    const placeholderTitle = target.placeholderTitle || (target.blankTitle && source.placeholder);
    const expectOffer = !placeholderTitle && !blank(title) && !blank(after.source_date)
      && (!blank(after.source_url) || (!blank(after.source_locator) && !target.sole))
      && FITTING.includes(after.claim_source_fit);
    const offered = canVerify("biopolitical", target.payload, after);
    assert.equal(offered, expectOffer, `${label}: verified offered=${offered}`);
    const choices = [...(changes ? [false] : []), ...(offered ? [true] : [])];
    for (const verifiedChosen of choices) {
      const result_item = verifiedChosen
        ? filledEvidence("biopolitical", { item, source, excerpt, fields: { verification_status: "verified", verified_by: "Reviewer A" }, timeZone: UTC })
        : filled;
      expectFilled("biopolitical", item, result_item, source, excerpt, verifiedChosen, `${label}/${verifiedChosen ? "verified" : "as is"}`);
      const payload = withEvidence("biopolitical", target.payload, result_item, { replaceId: item.id });
      const result = check("biopolitical", payload);
      assert.deepEqual(result.errors, [], `${label} has errors: ${issueKeys(result.errors)}`);
      const nowPlaceholder = globalThis.Jarbou3iBiopolitics.isPlaceholderEvidence(result_item, payload);
      const added = [];
      const removed = [];
      // A placeholder that gets a link becomes a real record nothing cites.
      if (target.sole && !blank(result_item.source_url)) {
        assert.equal(nowPlaceholder, false, `${label}: still a placeholder`);
        added.push(`UNREFERENCED_EVIDENCE ${path}/id`);
        reached.placeholderBecameReal += 1;
      }
      // A blank title filled from a placeholder-titled source makes the
      // record a placeholder: it is no longer warned as uncited.
      if (placeholderTitle && target.blankTitle) {
        assert.equal(nowPlaceholder, true, `${label}: not a placeholder`);
        removed.push(`UNREFERENCED_EVIDENCE ${path}/id`);
        reached.becamePlaceholder += 1;
      }
      if (verifiedChosen) {
        removed.push(`EVIDENCE_NOT_PUBLICATION_READY ${path}`);
        reached.fillVerified += 1;
        if (target.auditPass) {
          removed.push("SELF_AUDIT_VERIFICATION_CONTRADICTION /self_audit/statistics_quotations_verified");
          reached.fillClearsContradiction += 1;
        }
        // prepareReviewableVerification leaves it as it is (the import may
        // still trim a source field that holds only spaces).
        assert.ok(!result.warnings.some((warning) => warning.code === "VERIFICATION_PROVENANCE_DOWNGRADED"), `${label} was downgraded`);
        const imported = result.analysis.evidence.items[position];
        assert.deepEqual(
          [imported.verification_status, imported.verified_by, imported.verification_date],
          ["verified", "Reviewer A", CHECK_DAY],
          `${label} changed on import`,
        );
        if (!target.blankTitle) assert.equal(canonicalStringify(result.analysis), canonicalStringify(payload), `${label} changed on import`);
      }
      assert.deepEqual(delta(baseResult.warnings, result.warnings), { added: added.sort(), removed: removed.sort() }, `${label}/${verifiedChosen ? "verified" : "as is"}`);
      cases += 1;
    }
  }
}
// Fill sets only verified, only on an unverified or partially verified record.
{
  const verifiedItem = bioAllVerified.evidence.items[0];
  for (const status of ["verified", "disputed"]) {
    assert.throws(() => filledEvidence("biopolitical", { item: { ...verifiedItem, verification_status: status }, source: SOURCES[0], excerpt: EXCERPTS[0], fields: { verification_status: "verified", verified_by: "Reviewer A" } }), TypeError);
  }
  assert.throws(() => filledEvidence("biopolitical", { item: bioSample.evidence.items[0], source: SOURCES[0], excerpt: EXCERPTS[0], fields: { verification_status: "partially_verified" } }), TypeError);
  assert.throws(() => withEvidence("biopolitical", bioSample, bioSample.evidence.items[0], { replaceId: "E99" }), TypeError);
}

// ---- preparePromotion: as a revision restore, without a transaction --------
let sequence = 0;
let minute = 0;
const idFactory = (prefix) => `${prefix}_promotion_${++sequence}`;
const clock = () => `2026-11-03T10:${String(minute++ % 60).padStart(2, "0")}:00.000Z`;
const manifests = {
  strategic: { id: "strategic", contractId: "strategic-analysis-v1", schemaVersion: "1.1.0" },
  biopolitical: { id: "biopolitical", contractId: "biopolitical-training-map-v2", schemaVersion: "2.1.0" },
};
const diagnostics = (payload) => ({ evidence_record_count: payload?.evidence?.items?.length || 0 });
const reviewer = { reviewer_id: "reviewer-promotion", display_name: "Reviewer A" };
const strategicNew = newEvidenceFrom("strategic", { payload: strategicWithout, source: SOURCES[0], excerpt: EXCERPTS[0], fields: { ...strategicFields, counter_evidence: "c" } });
const soleFilled = filledEvidence("biopolitical", { item: bioSole.evidence.items[0], source: SOURCES[0], excerpt: EXCERPTS[0], fields: { verification_status: "verified", verified_by: "Reviewer A" }, timeZone: UTC });
const bioNew = newEvidenceFrom("biopolitical", { payload: bioSample, source: SOURCES[0], excerpt: EXCERPTS[0], fields: { ...verifiedFields, verification_status: "unverified" } });
// Each on a new workspace (its head is its first revision) and on one with a
// committed revision after it, so the draft must be on the head.
for (const [lens, start, promote, name] of [
  ["strategic", strategicWithout, (analysis) => withEvidence("strategic", analysis, strategicNew), "Strategic new record"],
  ["biopolitical", bioSample, (analysis) => withEvidence("biopolitical", analysis, bioNew), "Biopolitical new record"],
  ["biopolitical", bioSole, (analysis) => withEvidence("biopolitical", analysis, soleFilled, { replaceId: "E1" }), "Biopolitical Fill, verified"],
]) for (const history of [false, true]) {
  const label = `${name}${history ? ", after a commit" : ""}`;
  const validate = validatorFor(lens);
  const backend = createMemoryWorkspaceBackend();
  const repository = createWorkspaceRepository({ backend });
  let stored = await createWorkspace({ analysis: start, manifest: manifests[lens], clock, idFactory });
  await repository.create(stored);
  let analysis = start;
  if (history) {
    analysis = clone(start);
    analysis.subject.title = `${analysis.subject.title} (revised)`;
    const drafted = await writeEditorDraft(stored, analysis, { clock });
    await repository.replace(drafted, { expectedRevision: stored.repository_revision });
    const proposal = await createResolutionProposal(drafted, { validate, deriveDiagnostics: diagnostics, clock, idFactory });
    const revised = await commitResolution(drafted, proposal, {
      validate, deriveDiagnostics: diagnostics, reviewer, rationale: "An earlier edit.", approved: true, clock, idFactory,
    });
    await repository.replace(revised, { expectedRevision: drafted.repository_revision });
    stored = await repository.get(stored.workspace_id);
    assert.equal(stored.revisions.length, 2, `${label}: the workspace needs history`);
    assert.notEqual(stored.head_revision_id, stored.revisions[0].revision_id, `${label}: the head must not be the first revision`);
    assert.equal(stored.working_draft.dirty, false, `${label}: the commit left a dirty draft`);
  }
  const payload = promote(analysis);
  const storedBytes = JSON.stringify(await backend.get(stored.workspace_id));
  const inputBytes = JSON.stringify(stored);

  const prepared = await preparePromotion(stored, payload, { validate, deriveDiagnostics: diagnostics, clock, idFactory });
  assert.ok(Object.isFrozen(prepared), label);
  assert.equal(prepared.workspace.repository_revision, stored.repository_revision, `${label}: preparing wrote a revision`);
  assert.equal(prepared.workspace.head_revision_id, stored.head_revision_id, `${label}: preparing moved the head`);
  assert.equal(prepared.workspace.working_draft.base_revision_id, stored.head_revision_id);
  assert.equal(prepared.workspace.working_draft.dirty, true);
  assert.notEqual(prepared.workspace.working_draft.draft_id, stored.working_draft.draft_id, `${label}: the copy needs a new draft`);
  assert.equal(canonicalStringify(prepared.workspace.working_draft.canonical_payload), canonicalStringify(payload));
  assert.equal("transaction" in prepared.proposal, false, `${label}: a promotion has no transaction`);
  assert.equal(prepared.proposal.validation.valid, true, `${label}: ${JSON.stringify(prepared.proposal.validation.errors)}`);
  assert.equal(prepared.proposal.repository_revision, stored.repository_revision);
  assert.ok(prepared.proposal.diff.change_count > 0);
  // Close: the copy is dropped and the stored workspace is untouched.
  assert.equal(JSON.stringify(stored), inputBytes, `${label}: preparing changed its input`);
  assert.equal(JSON.stringify(await backend.get(stored.workspace_id)), storedBytes, `${label}: preparing changed the stored workspace`);

  // Confirm: one committed_resolution, the store's revision exactly +1.
  const second = await preparePromotion(stored, payload, { validate, deriveDiagnostics: diagnostics, clock, idFactory });
  const committed = await commitResolution(prepared.workspace, prepared.proposal, {
    validate, deriveDiagnostics: diagnostics, reviewer, rationale: "From the case source, checked.", approved: true, clock, idFactory,
  });
  assert.equal(committed.repository_revision, stored.repository_revision + 1, `${label}: commit must raise the revision once`);
  assert.equal(committed.revisions.length, stored.revisions.length + 1);
  const revision = committed.revisions.at(-1);
  assert.equal(revision.kind, "committed_resolution", label);
  assert.equal(revision.parent_revision_id, stored.head_revision_id);
  assert.equal("restored_from_revision_id" in revision, false);
  assert.equal("transaction" in committed.resolution_ledger.records.at(-1), false);
  assert.equal(committed.audit_events.at(-1).type, "resolution_committed");
  assert.equal(canonicalStringify(revision.canonical_payload), canonicalStringify(payload));
  assert.equal(committed.resolution_ledger.records.at(-1).reviewer.display_name, "Reviewer A");
  await repository.replace(committed, { expectedRevision: stored.repository_revision });
  assert.equal((await repository.get(stored.workspace_id)).head_revision_id, revision.revision_id);
  // A second promotion prepared on the same read is refused by the store.
  const late = await commitResolution(second.workspace, second.proposal, {
    validate, deriveDiagnostics: diagnostics, reviewer, rationale: "Second tab.", approved: true, clock, idFactory,
  });
  await assert.rejects(() => repository.replace(late, { expectedRevision: stored.repository_revision }), (error) => error.code === "WRITE_CONFLICT", label);

  // Refusals: a dirty draft, and nothing to change.
  const draftPayload = clone(analysis);
  draftPayload.subject.title = `${draftPayload.subject.title} (draft)`;
  const dirty = await writeEditorDraft(stored, draftPayload, { clock });
  await assert.rejects(() => preparePromotion(dirty, payload, { validate, clock, idFactory }), (error) => error.code === "DRAFT_NOT_CLEAN"
    && error.message === "The working draft has uncommitted changes. Commit or remove that draft first.", label);
  await assert.rejects(() => preparePromotion(stored, analysis, { validate, clock, idFactory }), (error) => error.code === "NO_RESOLUTION_CHANGES", label);
  cases += 1;
}
// An error already in the analysis still refuses the commit.
{
  const validate = validatorFor("strategic");
  const stored = await createWorkspace({ analysis: strategicDangling, manifest: manifests.strategic, clock, idFactory });
  const item = newEvidenceFrom("strategic", { payload: strategicDangling, source: SOURCES[0], excerpt: EXCERPTS[0], fields: { ...strategicFields, counter_evidence: "c" } });
  const prepared = await preparePromotion(stored, withEvidence("strategic", strategicDangling, item), { validate, clock, idFactory });
  assert.equal(prepared.proposal.validation.valid, false);
  await assert.rejects(() => commitResolution(prepared.workspace, prepared.proposal, {
    validate, reviewer, rationale: "Should not commit.", approved: true, clock, idFactory,
  }), (error) => error.code === "RESOLUTION_VALIDATION_FAILED");
  cases += 1;
}

// The app never makes an empty judgement: a missing or blank answer to an asked
// text field is refused; only Strategic counter_evidence may be empty.
{
  const strategic = (fields) => newEvidenceFrom("strategic", { payload: strategicDangling, source: SOURCES[0], excerpt: EXCERPTS[0], fields });
  for (const name of ["source_type", "uncertainty"]) {
    for (const value of [undefined, "", "  "]) {
      assert.throws(() => strategic({ ...strategicFields, [name]: value }), TypeError, `Strategic ${name} ${JSON.stringify(value)} is refused`);
      cases += 1;
    }
  }
  assert.equal(strategic({ ...strategicFields, counter_evidence: "" }).counter_evidence, "");
  const bio = (fields) => newEvidenceFrom("biopolitical", { payload: bioSample, source: SOURCES[0], excerpt: EXCERPTS[0], fields });
  for (const name of ["uncertainty", "limitations", "counter_evidence"]) {
    for (const value of [undefined, "", "  "]) {
      assert.throws(() => bio({ ...verifiedFields, [name]: value }), TypeError, `Biopolitical ${name} ${JSON.stringify(value)} is refused`);
      cases += 1;
    }
  }
}

for (const [outcome, count] of Object.entries(reached)) assert.ok(count > 0, `the matrix never reached ${outcome}`);
const seconds = (Date.now() - started) / 1000;
assert.ok(seconds < 60, `the matrix took ${seconds}s`);
console.log(`Promotion checks passed: ${cases} cases in ${seconds.toFixed(1)}s (${Object.entries(reached).map(([outcome, count]) => `${outcome} ${count}`).join(", ")}).`);
