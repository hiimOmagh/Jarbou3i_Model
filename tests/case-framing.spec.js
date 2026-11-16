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

  test("the analyst marks a criterion met with a reason, as their own claim, and can reopen it", async ({ page }) => {
    await frameCase(page);
    await page.getByLabel("The analysis is done when", { exact: true }).fill("Each exit route is sourced\nTwo rival accounts are tested");
    await expect.poll(async () => (await readDossiers(page))[0].completion.map((criterion) => criterion.status)).toEqual(["open", "open"]);
    await page.evaluate(() => {
      window.__copied = [];
      Object.defineProperty(navigator.clipboard, "writeText", { configurable: true, value: async (text) => { window.__copied.push(text); } });
    });
    await openStep(page, "prompt");
    await page.locator("#copyPromptBtn").click();
    expect(await page.evaluate(() => window.__copied.at(-1))).toContain(JSON.stringify("The analysis is done when:\n- Each exit route is sourced\n- Two rival accounts are tested").slice(1, -1));

    const answer = JSON.parse(await fs.readFile(path.join(process.cwd(), "fixtures", "sample-analysis-en.json"), "utf8"));
    await openStep(page, "answer");
    await page.locator("#jsonInput").fill(JSON.stringify(answer));
    await page.locator("#importBtn").click();
    const contract = page.locator("[data-case-completion]");
    await expect(contract).toContainText("Met: 0 of 2");
    await contract.getByRole("button", { name: "Mark as met" }).first().click();
    const form = contract.locator("[data-done-form]:not([hidden])");
    const reason = form.getByLabel("Why it is met");
    await expect(reason).toBeFocused();
    // An empty reason is refused, at the field.
    await form.getByRole("button", { name: "Mark as met" }).click();
    await expect(reason).toHaveAttribute("aria-invalid", "true");
    await expect(reason).toBeFocused();
    // Changed in another tab meanwhile: the decision is made on the newer record.
    await page.evaluate(async () => {
      const { createDossierRepository, createIndexedDbDossierBackend, updateDossier } = await import("./src/core/research-dossier.js");
      const repository = createDossierRepository({ backend: createIndexedDbDossierBackend() });
      const [dossier] = await repository.list();
      await repository.save(await updateDossier(dossier, { framing: { ...dossier.framing, limits: ["Changed elsewhere"] } }), { expectedRevision: dossier.revision });
      repository.close();
    });
    await reason.fill("All five jurisdictions cite a statute.");
    await form.getByRole("button", { name: "Mark as met" }).click();
    await expect(contract).toContainText("Met: 1 of 2");
    await expect(contract).toContainText("your claim");
    await expect(contract.getByRole("button", { name: "Reopen" })).toBeFocused();
    await expect.poll(async () => (await readDossiers(page))[0].completion[0].rationale).toBe("All five jurisdictions cite a statute.");
    expect((await readDossiers(page))[0].framing.limits).toEqual(["Changed elsewhere"]);

    // A line added keeps the decisions made on the others.
    await openStep(page, "topic");
    await page.locator("#caseDone").fill("Each exit route is sourced\nTwo rival accounts are tested\nA third check");
    await expect.poll(async () => (await readDossiers(page))[0].completion.map((criterion) => criterion.status)).toEqual(["met", "open", "open"]);
    // Only what this screen changed is saved: the limits the other tab wrote,
    // which this screen never showed, are kept.
    expect((await readDossiers(page))[0].framing.limits).toEqual(["Changed elsewhere"]);

    await page.reload();
    await page.locator("#reviewNavShortcut").click();
    await expect(contract).toContainText("Met: 1 of 3");
    await contract.getByRole("button", { name: "Reopen" }).click();
    await expect(contract).toContainText("Met: 0 of 3");
    await expect(contract.getByRole("button", { name: "Mark as met" }).first()).toBeFocused();
    await expect.poll(async () => (await readDossiers(page))[0].completion[0].status).toBe("open");
  });

  test("a reason being written stays with its criterion, not with a later one that takes its id (Biopolitical)", async ({ page }) => {
    await frameCase(page);
    const done = page.locator("#caseDone");
    await done.fill("Each exit route is sourced\nTwo rival accounts are tested");
    await expect.poll(async () => (await readDossiers(page))[0].completion.length).toBe(2);
    const answer = JSON.parse(await fs.readFile(path.join(process.cwd(), "fixtures", "sample-analysis-bio-en.json"), "utf8"));
    await openStep(page, "answer");
    await page.locator("#jsonInput").fill(JSON.stringify(answer));
    await page.locator("#importBtn").click();
    const contract = page.locator("[data-case-completion]");
    await expect(contract).toContainText("Met: 0 of 2");
    await contract.getByRole("button", { name: "Mark as met" }).nth(1).click();
    await contract.locator("[data-done-form]:not([hidden]) textarea").fill("Half written");

    await openStep(page, "topic");
    await done.fill("Each exit route is sourced");
    await expect.poll(async () => (await readDossiers(page))[0].completion.length).toBe(1);
    await done.fill("Each exit route is sourced\nA new criterion");
    await expect.poll(async () => (await readDossiers(page))[0].completion.map((criterion) => criterion.criterion_id)).toEqual(["C1", "C2"]);
    await page.locator("#reviewNavShortcut").click();
    await expect(contract).toContainText("A new criterion");
    await expect(contract.locator("[data-done-form]:not([hidden])")).toHaveCount(0);
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

  test("a case is exported, restored once after Reset app data, and opens in the topic step before any answer", async ({ page }, testInfo) => {
    await frameCase(page);
    await page.locator("#workspaceSaveState").click();
    const row = page.locator("#caseList [data-case-row]");
    await expect(row).toContainText(question);
    await expect(row).toContainText("No answer imported yet");
    const download = page.waitForEvent("download");
    await row.getByRole("button", { name: "Export" }).click();
    const file = await download;
    expect(file.suggestedFilename()).toBe("who-decides-what-the-pass-protects-case.json");
    const saved = testInfo.outputPath(file.suggestedFilename());
    await file.saveAs(saved);
    const status = page.locator("#caseListStatus");
    await expect(status).toContainText("Case exported");

    // Edited since: the older file never replaces it.
    await page.locator("#workspaceClose").click();
    await page.locator("#caseScopeOut").fill("Vaccine efficacy and safety");
    await expect.poll(async () => (await readDossiers(page))[0].framing.scope_out).toEqual(["Vaccine efficacy and safety"]);
    await page.locator("#workspaceSaveState").click();
    await page.locator("#caseRestoreFile").setInputFiles(saved);
    await expect(status).toContainText("already on this device");
    expect((await readDossiers(page))[0].framing.scope_out).toEqual(["Vaccine efficacy and safety"]);

    await page.locator("#workspaceResetAll").click();
    await page.locator("#workspaceResetAll").click();
    await expect(row).toHaveCount(0);
    await page.locator("#caseRestoreFile").setInputFiles(saved);
    await expect(status).toContainText("Case restored");
    await expect(row).toContainText(question);

    await page.locator("#workspaceClose").click();
    await page.locator("#topicInput").fill("Another question");
    await page.locator("#workspaceSaveState").click();
    await row.getByRole("button", { name: "Open" }).click();
    await expect(status).toContainText("Case opened");
    await expect(row).toHaveAttribute("aria-current", "true");
    await expect(page.locator("#topicInput")).toHaveValue(question);
    await expect(page.locator("#caseScopeOut")).toHaveValue("Vaccine efficacy");
    await page.reload();
    await expect(page.locator("#caseScopeOut")).toHaveValue("Vaccine efficacy");
    await expect(page.locator("#topicInput")).toHaveValue(question);
  });

  test("a case opens the answer it holds on this device, and Remove takes the case, not its answers", async ({ page }) => {
    await frameCase(page);
    const answer = JSON.parse(await fs.readFile(path.join(process.cwd(), "fixtures", "sample-analysis-en.json"), "utf8"));
    await openStep(page, "answer");
    await page.locator("#jsonInput").fill(JSON.stringify(answer));
    await page.locator("#importBtn").click();
    await expect.poll(async () => (await readDossiers(page))[0]?.analyses.length).toBe(1);
    const [{ analyses: [link] }] = await readDossiers(page);
    await openStep(page, "topic");
    await page.locator("#loadSampleBtn").click();
    await expect(page.locator("#caseScopeOut")).toHaveValue("");

    await page.locator("#workspaceSaveState").click();
    const row = page.locator("#caseList [data-case-row]");
    await expect(row).toContainText("Answers linked: 1");
    await row.getByRole("button", { name: "Open" }).click();
    const answerRow = page.locator(`#workspaceList [data-workspace-row="${link.workspace_id}"]`);
    await expect(answerRow).toHaveAttribute("aria-current", "true");
    await expect(page.locator("#caseScopeOut")).toHaveValue("Vaccine efficacy");
    // The case's question, not the sample's title left in the field.
    await expect(page.locator("#topicInput")).toHaveValue(question);

    await row.getByRole("button", { name: "Remove" }).click();
    await row.getByRole("button", { name: /^Click again/ }).click();
    await expect(page.locator("#caseListStatus")).toContainText("Case removed");
    await expect(row).toHaveCount(0);
    await expect.poll(async () => (await readDossiers(page)).length).toBe(0);
    await expect(answerRow).toBeVisible();
    await expect(page.locator("#caseScopeOut")).toHaveValue("");
  });

  test("a case holding what its fields cannot show is opened, and a save writes only what the analyst changed", async ({ page }) => {
    const changeElsewhere = (framing) => page.evaluate(async (changed) => {
      const { createDossierRepository, createIndexedDbDossierBackend, updateDossier } = await import("./src/core/research-dossier.js");
      const repository = createDossierRepository({ backend: createIndexedDbDossierBackend() });
      const [dossier] = await repository.list();
      await repository.save(await updateDossier(dossier, { framing: { ...dossier.framing, ...changed } }), { expectedRevision: dossier.revision });
      repository.close();
    }, framing);
    await frameCase(page);
    // A stored case may hold an empty item or a timeframe on two lines (a
    // restored file can); the fields show an empty line, and one line.
    await changeElsewhere({ scope_in: ["", "Exit routes"], timeframe: "2020\n2021" });
    // Opened from Cases, once the sample has taken the screen.
    await page.locator("#loadSampleBtn").click();
    await expect(page.locator("#caseScopeOut")).toHaveValue("");
    await page.locator("#workspaceSaveState").click();
    await page.locator("#caseList [data-case-row]").getByRole("button", { name: "Open" }).click();
    await expect(page.locator("#caseListStatus")).toContainText("Case opened");
    await page.locator("#workspaceClose").click();
    await openStep(page, "topic");
    await expect(page.getByLabel("In scope", { exact: true })).toHaveValue("\nExit routes");
    await expect(page.locator("#timeframeInput")).toHaveValue("20202021");
    // Another tab changes them; this screen changes another field only.
    await changeElsewhere({ scope_in: ["Exit routes", "Appeals"], timeframe: "2022" });
    await page.getByLabel("Out of scope", { exact: true }).fill("Vaccine efficacy and safety");
    await expect.poll(async () => (await readDossiers(page))[0].framing.scope_out).toEqual(["Vaccine efficacy and safety"]);
    expect((await readDossiers(page))[0].framing).toMatchObject({ scope_in: ["Exit routes", "Appeals"], timeframe: "2022" });
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
