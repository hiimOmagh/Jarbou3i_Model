import fs from "node:fs";
import { test, expect } from "@playwright/test";
import { readDatabaseVersions } from "./helpers/browser-persistence.js";

const releasedDossier = JSON.parse(fs.readFileSync(new URL("./fixtures/research-dossier-origin-main.json", import.meta.url), "utf8"));

// The research dossier in each engine's real IndexedDB, in a database of its
// own beside the workspaces (ADR-0004).
test.describe("Research dossier storage", () => {
  test("keeps a dossier across a reload and refuses a stale write, leaving the workspace database alone", async ({ page }) => {
    await page.goto("./");
    const written = await page.evaluate(async () => {
      const { createDossier, createDossierRepository, createIndexedDbDossierBackend, updateDossier } = await import("./src/core/research-dossier.js");
      const repository = createDossierRepository({ backend: createIndexedDbDossierBackend() });
      const dossier = await createDossier({ framing: { question: "من يقرر ما يحميه الجواز؟", scope_out: ["Vaccine efficacy"] } });
      await repository.create(dossier);
      const next = await updateDossier(dossier, { completion: [{ criterion_id: "C1", text: "Each exit route is sourced" }] });
      await repository.save(next, { expectedRevision: 1 });
      let stale = "";
      try {
        await repository.save(next, { expectedRevision: 1 });
      } catch (error) {
        stale = error.code;
      }
      repository.close();
      return { id: dossier.dossier_id, stale };
    });
    expect(written.stale).toBe("WRITE_CONFLICT");

    await page.reload();
    const read = await page.evaluate(async (id) => {
      const { createDossierRepository, createIndexedDbDossierBackend } = await import("./src/core/research-dossier.js");
      const repository = createDossierRepository({ backend: createIndexedDbDossierBackend() });
      const dossier = await repository.get(id);
      repository.close();
      return {
        question: dossier.framing.question,
        revision: dossier.revision,
        criteria: dossier.completion.map((criterion) => criterion.status),
      };
    }, written.id);
    expect(read).toEqual({ question: "من يقرر ما يحميه الجواز؟", revision: 2, criteria: ["open"] });
    const versions = await readDatabaseVersions(page);
    expect([versions["jarbou3i-model-workspaces"], versions["jarbou3i-model-dossiers"]]).toEqual([2, 1]);
  });
});


test("a record sealed by origin/main, including colon-led terms, lists as verified after reload", async ({ page }) => {
  await page.goto("./");
  await page.evaluate(async (fixture) => {
    const { createIndexedDbDossierBackend } = await import("./src/core/research-dossier.js");
    // Seed the actual released bytes through the production backend, so the
    // upgraded writer never reseals the compatibility fixture.
    const backend = createIndexedDbDossierBackend();
    try { await backend.put(fixture, { createOnly: true }); } finally { backend.close(); }
  }, releasedDossier);
  await page.reload();
  const read = await page.evaluate(async (id) => {
    const { createDossierRepository, createIndexedDbDossierBackend } = await import("./src/core/research-dossier.js");
    const repository = createDossierRepository({ backend: createIndexedDbDossierBackend() });
    try { return { listed: (await repository.list()).find((entry) => entry.dossier_id === id), record: await repository.get(id) }; }
    finally { repository.close(); }
  }, releasedDossier.dossier_id);
  expect(read.record).toEqual(releasedDossier);
  expect(read.listed).toEqual({ ...releasedDossier, integrity_status: "verified" });
  expect((await readDatabaseVersions(page))["jarbou3i-model-dossiers"]).toBe(1);
});

test("format 2 sources, excerpts and analyst checks round-trip in real storage", async ({ page }) => {
  await page.goto("./");
  const written = await page.evaluate(async () => {
    const { createDossier, addSource, addExcerpt, checkExcerpt, createDossierRepository, createIndexedDbDossierBackend } = await import("./src/core/research-dossier.js");
    const idFactory = (prefix) => `${prefix}_ABCDEFAB-CDEF-4ABC-8DEF-ABCDEFABCDEF`;
    const separators = String.fromCharCode(0x2028, 0x2029);
    let record = await addSource(await createDossier(), { title: "وثيقة — document", url: "https://example.com/", accessed_on: "2024-02-29" }, { idFactory });
    record = await addExcerpt(record, record.sources[0].source_id, { text: `Première ligne\nالسطر الثاني${separators}Third line`, locator: "p. 2" }, { idFactory });
    record = await checkExcerpt(record, record.excerpts[0], { status: "matches", reason: `Read${separators}the original page.` });
    const repository = createDossierRepository({ backend: createIndexedDbDossierBackend() });
    try { await repository.create(record); return record; } finally { repository.close(); }
  });
  await page.reload();
  const read = await page.evaluate(async (id) => {
    const { createDossierRepository, createIndexedDbDossierBackend } = await import("./src/core/research-dossier.js");
    const repository = createDossierRepository({ backend: createIndexedDbDossierBackend() });
    try { return { record: await repository.get(id), list: await repository.list() }; } finally { repository.close(); }
  }, written.dossier_id);
  expect(written.format_version).toBe(2);
  expect(read.record).toEqual(written);
  expect(read.list.find((entry) => entry.dossier_id === written.dossier_id)?.integrity_status).toBe("verified");
});

test("a later-format envelope lists as newer and stays stored without shaping its unknown fields", async ({ page }) => {
  await page.goto("./");
  const envelope = { format: "jarbou3i-research-dossier", format_version: 3, dossier_id: "dossier_future", framing: null, checksum: null, future_field: { unknown: true } };
  await page.evaluate(async (record) => {
    const { createIndexedDbDossierBackend } = await import("./src/core/research-dossier.js");
    const backend = createIndexedDbDossierBackend();
    try { await backend.put(record); } finally { backend.close(); }
  }, envelope);
  await page.reload();
  const read = await page.evaluate(async (id) => {
    const { createDossierRepository, createIndexedDbDossierBackend } = await import("./src/core/research-dossier.js");
    const backend = createIndexedDbDossierBackend();
    const repository = createDossierRepository({ backend });
    try {
      let errorCode;
      try { await repository.get(id); } catch (error) { errorCode = error.code; }
      return { listed: (await repository.list()).find((entry) => entry.dossier_id === id), raw: await backend.get(id), errorCode };
    } finally { repository.close(); }
  }, envelope.dossier_id);
  expect(read.listed).toEqual({ dossier_id: envelope.dossier_id, integrity_status: "newer", error_code: "DOSSIER_FORMAT_NEWER", format_version: 3 });
  expect(read.errorCode).toBe("DOSSIER_FORMAT_NEWER");
  expect(read.raw).toEqual(envelope);
});
