import { test, expect } from "@playwright/test";
import { readDatabaseVersions } from "./helpers/browser-persistence.js";

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
