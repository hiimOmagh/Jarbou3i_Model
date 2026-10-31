import { test, expect } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";
import { openStep } from "./helpers/guided-flow.js";

// What the analysis covers (RESEARCH-1A, slice 2): the analyst's framing,
// kept in a dossier of its own with every answer imported for it (ADR-0004).
const readDossiers = (page) => page.evaluate(async () => {
  const { createDossierRepository, createIndexedDbDossierBackend } = await import("./src/core/research-dossier.js");
  const repository = createDossierRepository({ backend: createIndexedDbDossierBackend() });
  const dossiers = await repository.list();
  repository.close();
  return dossiers;
});
const question = "Who decides what the pass protects?";

async function frameCase(page) {
  await page.goto("./");
  await page.locator("#langEn").click();
  await page.locator("#topicInput").fill(question);
  await page.locator("#caseFold > summary").click();
  await page.getByLabel("In scope", { exact: true }).fill("Digital health passes\n\nExit routes");
  await page.getByLabel("Out of scope", { exact: true }).fill("Vaccine efficacy");
  await page.getByLabel("Terms in dispute", { exact: true }).fill("Proportionality: least restrictive means that work");
  await page.getByLabel("Limits of this research", { exact: true }).fill("No procurement files");
  // Kept on the device as its own record, before any answer.
  await expect.poll(async () => (await readDossiers(page)).map((dossier) => dossier.framing.scope_out)).toEqual([["Vaccine efficacy"]]);
}

test.describe("What the analysis covers", () => {
  test("goes into the prompt, keeps the analyst's question through the answer, and comes back after a reload", async ({ page }) => {
    await frameCase(page);
    await page.evaluate(() => {
      window.__copied = [];
      Object.defineProperty(navigator.clipboard, "writeText", { configurable: true, value: async (text) => { window.__copied.push(text); } });
    });
    await openStep(page, "prompt");
    await page.locator("#copyPromptBtn").click();
    const prompt = await page.evaluate(() => window.__copied.at(-1));
    // Inside the context, which the prompt fences as JSON-encoded material.
    const framing = "In scope:\n- Digital health passes\n- Exit routes\nOut of scope:\n- Vaccine efficacy\nTerms in dispute:\n- Proportionality: least restrictive means that work\nLimits of this research:\n- No procurement files";
    expect(prompt).toContain(`"context":${JSON.stringify(framing)}`);

    const answer = JSON.parse(await fs.readFile(path.join(process.cwd(), "fixtures", "sample-analysis-en.json"), "utf8"));
    await openStep(page, "answer");
    await page.locator("#jsonInput").fill(JSON.stringify(answer));
    await page.locator("#importBtn").click();
    await expect(page.locator("#reviewTitle")).toBeFocused();
    await expect(page.locator("#topicInput")).toHaveValue(question);
    await expect.poll(async () => (await readDossiers(page))[0]?.analyses.length).toBe(1);
    const [dossier] = await readDossiers(page);
    expect(dossier.framing.question).toBe(question);
    expect(Object.keys(dossier.analyses[0]).sort()).toEqual(["linked_at", "payload_checksum", "revision_id", "workspace_id"]);

    await page.reload();
    await expect(page.locator("#caseScopeOut")).toHaveValue("Vaccine efficacy");
    await expect(page.locator("#caseScopeIn")).toHaveValue("Digital health passes\nExit routes");
    await expect(page.locator("#topicInput")).toHaveValue(question);
    await expect(page.locator("#caseFold")).toHaveAttribute("open", "");
  });

  test("the sample is not the analyst's case: their dossier stays on the device, unchanged", async ({ page }) => {
    await frameCase(page);
    const [before] = await readDossiers(page);
    await page.locator("#loadSampleBtn").click();
    await expect(page.locator("#reviewTitle")).toBeFocused();
    await expect(page.locator("#caseScopeOut")).toHaveValue("");
    await openStep(page, "topic");
    await page.locator("#caseFold > summary").click();
    await page.getByLabel("Out of scope", { exact: true }).fill("Something else");
    await expect.poll(async () => (await readDossiers(page)).length).toBe(2);
    expect((await readDossiers(page)).find((dossier) => dossier.dossier_id === before.dossier_id)).toEqual(before);
  });

  test("Reset app data removes every dossier and empties the fields", async ({ page }) => {
    await frameCase(page);
    await page.locator("#workspaceSaveState").click();
    await page.locator("#workspaceResetAll").click();
    await page.locator("#workspaceResetAll").click();
    await expect(page.locator("#workspaceStatus")).toContainText(/reset|cleared|removed/i);
    await expect.poll(async () => (await readDossiers(page)).length).toBe(0);
    await expect(page.locator("#caseScopeOut")).toHaveValue("");
  });
});
