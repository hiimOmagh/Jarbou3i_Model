/* Catches omitted members, unbound relationships and integrity bypasses. */
import assert from "node:assert/strict";
import fs from "node:fs";
import { createHash } from "node:crypto";
import { canonicalStringify, createWorkspace, createWorkspaceBundle, sha256 } from "../src/core/workspace-contract.js";
import { createDossier, linkAnalysis, addSource, addExcerpt, checkExcerpt, addPromotion } from "../src/core/research-dossier.js";

const moduleUrl = new URL("../src/core/case-archive.js", import.meta.url);
assert.ok(fs.existsSync(moduleUrl), "case archive API is absent (ADR-0010 slices 1-3)");
const { createCaseArchive, parseCaseArchive } = await import(moduleUrl);
globalThis.window = globalThis;
for (const file of ["biopolitics-schema-validator.js", "strategic-schema-validator.js", "biopolitics-sample-i18n.js", "core/provenance.js", "biopolitics.js", "biopolitics-integrity.js"]) await import(`../src/${file}`);
const { validateStrategicAnalysis } = await import("../src/strategic-integrity.js");
const clock = () => "2026-11-25T12:00:00.000Z";
let sequence = 0;
const idFactory = (prefix) => `${prefix}_00000000-0000-4000-8000-${String(++sequence).padStart(12, "0")}`;
const options = { clock, idFactory, validatePayload: (payload, identity) => {
  const result = identity.lens_id === "strategic" ? validateStrategicAnalysis(payload) : globalThis.Jarbou3iBiopoliticsIntegrity.validateImport(payload);
  return { valid: result.errors.length === 0 };
} };
const clone = structuredClone;
const hash = (value) => createHash("sha256").update(canonicalStringify(value), "utf8").digest("hex");
const reseal = (value) => { const { checksum, ...body } = value; value.checksum.protected_content = hash(body); return value; };
const sealDossier = (value) => { const { checksum, ...body } = value; value.checksum.value = hash(body); return value; };
let dossier = await createDossier({ framing: { question: "Full case" }, completion: [{ criterion_id: "review", text: "Review sources", status: "open", rationale: "" }], ...options });
const bundles = [];
for (const lens of ["strategic", "biopolitical"]) {
  const file = lens === "strategic" ? "sample-analysis-en.json" : "sample-analysis-bio-en.json";
  const analysis = JSON.parse(fs.readFileSync(new URL(`../fixtures/${file}`, import.meta.url)));
  const workspace = await createWorkspace({ analysis, manifest: { id: lens, contractId: lens === "strategic" ? "strategic-analysis-v1" : "biopolitical-training-map-v2", schemaVersion: analysis.schema_version }, ...options });
  // Two immutable revisions and a different draft exercise preservation.
  const revision = clone(workspace.revisions[0]);
  revision.revision_id = idFactory("rev");
  revision.parent_revision_id = workspace.head_revision_id;
  revision.kind = "resolution";
  workspace.revisions.push(revision);
  workspace.head_revision_id = revision.revision_id;
  workspace.working_draft.dirty = true;
  workspace.working_draft.canonical_payload.subject.title += " draft";
  workspace.working_draft.payload_checksum = await sha256(workspace.working_draft.canonical_payload);
  if (lens === "strategic") dossier = await linkAnalysis(dossier, { workspace_id: workspace.workspace_id, revision_id: workspace.imported_revision_id, payload_checksum: revision.payload_checksum }, options);
  dossier = await addSource(dossier, { title: `${lens} source`, url: "", source_date: "", accessed_on: "", send: true }, options);
  dossier = await addExcerpt(dossier, dossier.sources.at(-1).source_id, { text: "Quoted material", locator: "Page 1" }, options);
  dossier = await checkExcerpt(dossier, dossier.excerpts.at(-1), { status: "matches", reason: "Compared original" }, options);
  const excerpt = dossier.excerpts.at(-1);
  dossier = await addPromotion(dossier, excerpt.excerpt_id, { workspace_id: workspace.workspace_id, revision_id: revision.revision_id, evidence_id: analysis.evidence.items[0].id, kind: "new" }, { ...excerpt, source: dossier.sources.at(-1) }, options);
  bundles.push(await createWorkspaceBundle(workspace, options));
}
const before = canonicalStringify({ dossier, bundles });
const archive = await createCaseArchive({ dossier, workspaces: [...bundles].reverse() }, options);
const parsed = await parseCaseArchive(JSON.stringify(archive), options);
assert.deepEqual(parsed, archive);
assert.deepEqual(await createCaseArchive(parsed, options), archive);
assert.equal(canonicalStringify({ dossier, bundles }), before, "inputs must stay unchanged");
assert.deepEqual(archive.workspaces, bundles);
assert.equal(archive.manifest.references.length, 3);
assert.equal(archive.checksum.protected_content, hash(Object.fromEntries(Object.entries(archive).filter(([key]) => key !== "checksum"))));
assert.equal(archive.manifest.dossier.sha256, hash(dossier));
const framing = await createDossier(options);
assert.deepEqual((await parseCaseArchive(await createCaseArchive({ dossier: framing, workspaces: [] }, options), options)).workspaces, []);
let negatives = 0;
async function reject(change, { outer = true, code } = {}) {
  const damaged = clone(archive);
  await change(damaged);
  if (outer) reseal(damaged);
  await assert.rejects(() => parseCaseArchive(damaged, options), code ? { code } : undefined);
  negatives++;
}
await reject((a) => { a.exported_at = "2026-11-26T12:00:00.000Z"; }, { outer: false, code: "ARCHIVE_CHECKSUM_MISMATCH" });
await reject((a) => { a.artifact_version = 2; }, { code: "UNSUPPORTED_CASE_ARCHIVE" });
await reject((a) => { a.manifest.dossier.revision++; }, { code: "ARCHIVE_MANIFEST_MISMATCH" });
await reject((a) => { a.manifest.references.pop(); }, { code: "ARCHIVE_MANIFEST_MISMATCH" });
await reject((a) => { a.manifest.references.reverse(); });
await reject((a) => { a.manifest.workspaces[0].extra = true; });
await reject((a) => { a.workspaces.pop(); });
await reject((a) => { a.workspaces.push(clone(a.workspaces[0])); });
await reject((a) => { a.workspaces.reverse(); });
await reject((a) => { a.extra = true; });
for (const field of ["text", "source_id"]) await reject((a) => { a.dossier.excerpts[0][field] = "tampered"; a.manifest.dossier.sha256 = hash(a.dossier); });
await reject((a) => { a.dossier.sources[0].title = "tampered"; a.manifest.dossier.sha256 = hash(a.dossier); });
for (const field of ["revision_id", "payload_checksum", "workspace_id"]) await reject((a) => {
  a.dossier.analyses[0][field] = "missing"; sealDossier(a.dossier); a.manifest.dossier.sha256 = hash(a.dossier);
});
await reject((a) => { a.dossier.excerpts[0].promotions[0].evidence_id = "E999999"; sealDossier(a.dossier); a.manifest.dossier.sha256 = hash(a.dossier); }, { code: "ARCHIVE_PROMOTION_TARGET_MISSING" });
await reject((a) => { a.dossier = framing; a.manifest.dossier = { dossier_id: framing.dossier_id, revision: framing.revision, sha256: hash(framing) }; });
for (const mutate of [
  (w) => { w.revisions[0].canonical_payload.subject.title = "tampered"; },
  (w) => { w.review_ledger.events.push({}); },
  (w) => { w.format_version = 999; },
]) await reject(async (a) => {
  const b = a.workspaces[0]; mutate(b.workspace);
  b.checksum.workspace = hash(b.workspace);
  const { exported_at, checksum, ...protectedBody } = b;
  b.checksum.protected_content = hash(protectedBody);
  a.manifest.workspaces[0].sha256 = hash(b);
});
await assert.rejects(() => parseCaseArchive("{", options), { code: "INVALID_CASE_ARCHIVE_JSON" });
await assert.rejects(() => createCaseArchive({ dossier, workspaces: [] }, options));
await assert.rejects(() => parseCaseArchive(archive), { code: "ARCHIVE_VALIDATOR_REQUIRED" });
console.log(`Case archive check passed: deterministic two-lens roundtrip, framing-only case, ${negatives} negative integrity cases.`);


