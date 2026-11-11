import { test, expect } from "@playwright/test";
import fs from "node:fs/promises";
import { openStep } from "./helpers/guided-flow.js";
import { holdStartupStorage, holdNextSourceSave, readIntakeDraft, readFirstWorkspace, readWorkspaceRecoveryRecords, seedEditorRecovery } from "./helpers/browser-persistence.js";
import { expectKernel } from "./helpers/kernel-check.js";

// Use the dossier's bounded backend/repository, never a raw storage request.
const readCases = (page) => page.evaluate(async () => {
  const { createDossierRepository, createIndexedDbDossierBackend } = await import("./src/core/research-dossier.js");
  const repository = createDossierRepository({ backend: createIndexedDbDossierBackend() });
  try { return await repository.list(); } finally { repository.close(); }
});
const rows = (page) => page.locator("#sourcesBody > ol > [data-source-row]");
const excerpts = (row) => row.locator("[data-excerpt-row]");
const addForm = (page) => page.locator('[data-source-form="add"]');
const sourceAction = (row, action) => row.locator(`:scope > .j-flow-row > [data-source-action="${action}"]`);

async function start(page, lang = "en") {
  await page.goto("./");
  await page.locator(`#lang${lang[0].toUpperCase()}${lang.slice(1)}`).click();
  await page.locator("#sourcesFold > summary").click();
}
async function add(page, title = "Council minutes", url = "") {
  const form = addForm(page);
  await form.locator('[data-source-field="title"]').fill(title);
  if (url) await form.locator('[data-source-field="url"]').fill(url);
  await form.getByRole("button", { name: "Add source", exact: true }).click();
  const row = rows(page).filter({ has: page.getByRole("heading", { name: title, exact: true }) });
  await expect(row).toBeVisible();
  return row;
}
async function addText(row, text = "The pass expires in June.", locator = "p. 4") {
  await sourceAction(row, "new-excerpt").click();
  const form = row.locator("[data-excerpt-form]");
  await form.getByLabel("What it says — quoted or in your words").fill(text);
  await form.getByLabel("Locator", { exact: true }).fill(locator);
  await form.getByRole("button", { name: "Add excerpt", exact: true }).click();
  const excerpt = excerpts(row).filter({ has: row.page().getByText(text, { exact: true }) });
  await expect(excerpt).toBeVisible();
  return excerpt;
}
async function openInOtherPage(context, id) {
  const other = await context.newPage();
  await other.goto("./");
  await other.locator("#langEn").click();
  await other.locator("#workspaceSaveState").click();
  await other.locator(`[data-case-open="${id}"]`).click();
  await other.locator("#workspaceClose").click();
  await openStep(other, "topic");
  await expect(rows(other)).toHaveCount(1);
  return other;
}

// Navigation really travels through the tab order; no focus(), click(), or
// synthetic events may smuggle a keyboard-inaccessible control into the test.
async function tabTo(page, target, backwards = false) {
  for (let n = 0; n < 100; n += 1) {
    if (await target.evaluate((element) => element === document.activeElement)) return;
    await page.keyboard.press(backwards ? "Shift+Tab" : "Tab");
  }
  throw new Error(`Could not reach ${await target.getAttribute("id")} through the tab order`);
}

async function importAnswer(page) {
  const answer = await fs.readFile(new URL("../fixtures/sample-analysis-en.json", import.meta.url), "utf8");
  await openStep(page, "answer");
  await page.locator("#jsonInput").fill(answer);
  await page.locator("#importBtn").click();
  await expect(page.locator("#reviewPanel")).toBeVisible();
  await expect.poll(() => readFirstWorkspace(page)).toBeTruthy();
}

async function downloadText(page, button) {
  const [download] = await Promise.all([page.waitForEvent("download"), button.click()]);
  const path = await download.path();
  expect(path).toBeTruthy();
  return fs.readFile(path, "utf8");
}

test.describe("Your sources", () => {
  test("first source creates a verified format-2 case, survives reload, and the last removal returns format 1", async ({ page }) => {
    await start(page);
    await expect(addForm(page).getByLabel("Opened on", { exact: true })).toHaveValue("");
    await expect(addForm(page).getByLabel("Send to the AI", { exact: true })).toBeChecked();
    await addForm(page).getByRole("button", { name: "Add source", exact: true }).click();
    await expect(addForm(page).getByLabel("Title (required)")).toBeFocused();
    await expect(addForm(page).getByLabel("Title (required)")).toHaveAttribute("aria-invalid", "true");
    await page.locator("#topicInput").fill("Who decides the expiry?");
    const row = await add(page, "Council <minutes>", "https://example.org/minutes");
    await expect(sourceAction(row, "new-excerpt")).toBeFocused();
    await expect(row.getByRole("link")).toHaveAttribute("rel", "noopener noreferrer");
    await expect(row.getByRole("link")).toHaveAttribute("dir", "auto");
    await expect.poll(async () => (await readCases(page))[0]?.format_version).toBe(2);
    const [saved] = await readCases(page);
    expect(saved.integrity_status).toBe("verified");
    expect(saved.framing.question).toBe("Who decides the expiry?");
    expect(saved.sources[0].accessed_on).toBe("");
    await page.reload();
    await expect(rows(page)).toHaveCount(1);
    await expect(page.locator("#sourcesFold")).toHaveAttribute("open", "");
    const restored = rows(page).first();
    await sourceAction(restored, "remove-source").click();
    await expect(sourceAction(restored, "remove-source")).toHaveText("Remove “Council <minutes>”");
    await sourceAction(restored, "remove-source").click();
    await expect(page.locator("#sourceAdd-save")).toBeFocused();
    await expect.poll(async () => (await readCases(page))[0]?.format_version).toBe(1);
    expect((await readCases(page))[0].sources).toBeUndefined();
  });

  test("source edits, send switch, Settings count, case count, and duplicate refusal", async ({ page }) => {
    await start(page);
    const row = await add(page);
    await sourceAction(row, "edit-source").click();
    const edit = row.locator('[data-source-form="edit"]');
    await edit.getByLabel("Date of the source").fill("June 2026");
    await edit.getByLabel("Opened on", { exact: true }).fill("2026-11-01");
    await edit.getByRole("button", { name: "Save", exact: true }).click();
    await expect(sourceAction(row, "edit-source")).toBeFocused();
    await expect(row).toContainText("June 2026");
    await expect(row).toContainText("2026-11-01");
    await openStep(page, "settings");
    await page.locator("#evidenceAccess").selectOption("provided");
    await expect(page.locator("#sourcesSentCount")).toHaveText("Your sources sent to the AI: 1 (step 1)");
    await openStep(page, "topic");
    await row.getByRole("switch").uncheck();
    await expect(row.getByRole("switch")).not.toBeChecked();
    await openStep(page, "settings");
    await expect(page.locator("#sourcesSentCount")).toBeHidden();
    await openStep(page, "topic");
    await expect(row).toContainText("Not sent");
    await expect(row.getByRole("switch", { name: "Send to the AI" })).not.toBeChecked();
    await addForm(page).getByLabel("Title (required)").fill("Council minutes");
    await addForm(page).getByRole("button", { name: "Add source", exact: true }).click();
    await expect(page.locator("#sourcesStatus")).toContainText("A source with this link, or this title without a link, is already here.");
    await expect(page.locator("#sourcesStatus")).toContainText("Not saved on this device");
    await expect(addForm(page).getByLabel("Title (required)")).toHaveValue("Council minutes");
    await page.locator("#workspaceSaveState").click();
    await expect(page.locator("#caseList [data-case-row]")).toContainText("Source notes: 1");
  });

  test("excerpt decisions need a reason, count both decisions, reopen, and edits reopen checks", async ({ page }) => {
    await start(page);
    const row = await add(page);
    const excerpt = await addText(row, "A first line\nA second line <script>text</script>");
    await expect(excerpt.locator(".j-done-text")).toHaveAttribute("dir", "auto");
    await sourceAction(excerpt, "matches").click();
    const reason = excerpt.getByLabel("How you checked");
    await expect(reason).toBeFocused();
    await excerpt.locator('[data-source-action="check-excerpt"]').click();
    await expect(reason).toBeFocused();
    await expect(reason).toHaveAttribute("aria-invalid", "true");
    await reason.fill("Read the signed minutes, page 4.");
    await excerpt.locator('[data-source-action="check-excerpt"]').click();
    await expect(sourceAction(excerpt, "reopen")).toBeFocused();
    await expect(excerpt).toContainText("Matches the source · your claim,");
    await expect(row).toContainText("Excerpts: 1 · Checked: 1");
    await sourceAction(excerpt, "reopen").click();
    await expect(sourceAction(excerpt, "matches")).toBeFocused();
    await sourceAction(excerpt, "differs").click();
    await excerpt.getByLabel("What differs").fill("The original says July.");
    await excerpt.locator('[data-source-action="check-excerpt"]').click();
    await expect(sourceAction(excerpt, "reopen")).toBeFocused();
    await expect(excerpt).toContainText("Not sent to the AI");
    await expect(row).toContainText("Excerpts: 1 · Checked: 1");
    await sourceAction(excerpt, "edit-excerpt").click();
    const edit = excerpt.locator("[data-excerpt-form]");
    await expect(edit).toContainText("Changing the text or Locator reopens its check.");
    await edit.getByLabel("Locator", { exact: true }).fill("p. 5");
    await edit.getByRole("button", { name: "Save", exact: true }).click();
    await expect(sourceAction(excerpt, "edit-excerpt")).toBeFocused();
    await expect(sourceAction(excerpt, "matches")).toBeVisible();
    await expect(row).toContainText("Excerpts: 1");
    await expect(row).not.toContainText("Checked:");
    expect((await readCases(page))[0].excerpts[0].check).toEqual({ status: "unchecked", reason: "", decided_at: null });
  });

  test("removals name their content and focus the next row, else the nearest Add", async ({ page }) => {
    await start(page);
    const first = await add(page, "First source");
    const a = await addText(first, "First excerpt");
    const b = await addText(first, "Second excerpt");
    await sourceAction(a, "remove-excerpt").click();
    await expect(sourceAction(a, "remove-excerpt")).toHaveText("Remove the excerpt “First excerpt”");
    await sourceAction(a, "remove-excerpt").click();
    await expect(sourceAction(b, "edit-excerpt")).toBeFocused();
    await sourceAction(b, "remove-excerpt").click();
    await sourceAction(b, "remove-excerpt").click();
    // After a source's last excerpt, focus lands on that source's Add an excerpt.
    await expect(sourceAction(first, "new-excerpt")).toBeFocused();
    const second = await add(page, "Second source", "https://example.org/second");
    await addText(first, "Removed with source");
    await sourceAction(first, "remove-source").click();
    await expect(sourceAction(first, "remove-source")).toHaveText("Remove “First source” and its excerpts: 1");
    await sourceAction(first, "remove-source").click();
    await expect(second.getByRole("link")).toBeFocused();
    expect((await readCases(page))[0].excerpts).toEqual([]);
  });

  test("a newer case is kept, labelled, refused on file restore, and removed only on the second click", async ({ page }) => {
    await start(page);
    const future = { format: "jarbou3i-research-dossier", format_version: 3, dossier_id: "dossier_future_s6", future: true };
    await page.evaluate(async (record) => {
      const { createIndexedDbDossierBackend } = await import("./src/core/research-dossier.js");
      const backend = createIndexedDbDossierBackend();
      try { await backend.put(record); } finally { backend.close(); }
    }, future);
    await page.locator("#workspaceSaveState").click();
    const row = page.locator('[data-case-row="dossier_future_s6"]');
    await expect(row).toContainText("Made by a newer version of this app");
    await expect(row).not.toContainText(/damaged/i);
    await expect(row.getByRole("button")).toHaveCount(1);
    await page.locator("#caseRestoreFile").setInputFiles({ name: "future-case.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify(future)) });
    await expect(page.locator("#caseListStatus")).toHaveText("Made by a newer version of this app");
    expect((await readCases(page))[0].integrity_status).toBe("newer");
    await row.getByRole("button").click();
    await expect(row).toBeVisible();
    expect((await readCases(page))).toHaveLength(1);
    await row.getByRole("button").click();
    await expect(row).toHaveCount(0);
  });

  test("an excerpt edited in another page refuses the shown edit and keeps its text", async ({ page, context }) => {
    await start(page);
    const row = await add(page);
    const excerpt = await addText(row);
    const [record] = await readCases(page);
    await sourceAction(excerpt, "edit-excerpt").click();
    await excerpt.locator('[data-source-field="text"]').fill("My unsaved reading");
    const other = await openInOtherPage(context, record.dossier_id);
    const elsewhere = excerpts(rows(other).first()).first();
    await sourceAction(elsewhere, "edit-excerpt").click();
    await elsewhere.locator('[data-source-field="text"]').fill("The other page changed this first");
    await elsewhere.getByRole("button", { name: "Save", exact: true }).click();
    await expect(elsewhere).toContainText("The other page changed this first");
    await excerpt.getByRole("button", { name: "Save", exact: true }).click();
    await expect(page.locator("#sourcesStatus")).toContainText("This item changed elsewhere. Open the case again before changing it.");
    await expect(excerpt.locator('[data-source-field="text"]')).toHaveValue("My unsaved reading");
    expect((await readCases(page))[0].excerpts[0].text).toBe("The other page changed this first");
    await other.close();
  });

  test("source removal confirmation protects excerpts added in another page, while an addition replays once", async ({ page, context }) => {
    await start(page);
    const row = await add(page);
    const [record] = await readCases(page);
    await sourceAction(row, "remove-source").click();
    const other = await openInOtherPage(context, record.dossier_id);
    await addText(rows(other).first(), "Newly attached elsewhere");
    await sourceAction(row, "remove-source").click();
    await expect(page.locator("#sourcesStatus")).toContainText("This item changed elsewhere");
    await add(page, "Another source");
    expect((await readCases(page))[0].sources).toHaveLength(2);
    expect((await readCases(page))[0].excerpts[0].text).toBe("Newly attached elsewhere");
    await other.close();
  });

  test("a removed source refuses an excerpt addition with its own words", async ({ page, context }) => {
    await start(page);
    const row = await add(page);
    const [record] = await readCases(page);
    await sourceAction(row, "new-excerpt").click();
    await row.locator('[data-source-field="text"]').fill("Keep this draft");
    const other = await openInOtherPage(context, record.dossier_id);
    await sourceAction(rows(other).first(), "remove-source").click();
    await sourceAction(rows(other).first(), "remove-source").click();
    await expect(rows(other)).toHaveCount(0);
    await row.getByRole("button", { name: "Add excerpt", exact: true }).click();
    await expect(page.locator("#sourcesStatus")).toContainText("This source was removed elsewhere. Open the case again.");
    await expect(row.locator('[data-source-field="text"]')).toHaveValue("Keep this draft");
    await other.close();
  });

  test("full source and excerpt lists and a future format have distinct refusals", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "chromium", "The pure capacity/refusal matrix runs in Chromium.");
    await start(page);
    const row = await add(page);
    await page.evaluate(async () => {
      const c = await import("./src/core/research-dossier.js");
      const repository = c.createDossierRepository({ backend: c.createIndexedDbDossierBackend() });
      try {
        const [before] = await repository.list();
        let next = before;
        for (let n = 1; n < 50; n += 1) next = await c.addSource(next, { title: `Source ${n}` });
        // Each intermediate contract write is a revision. Seed the resulting
        // record through the backend, just as a series of other-tab writes.
        await repository.close();
        const backend = c.createIndexedDbDossierBackend();
        try { await backend.put(next); } finally { backend.close(); }
      } finally { repository.close(); }
    });
    await addForm(page).getByLabel("Title (required)").fill("A draft that must stay");
    await addForm(page).getByRole("button", { name: "Add source", exact: true }).click();
    await expect(page.locator("#sourcesStatus")).toContainText("This case already has 50 sources.");
    await expect(addForm(page).getByLabel("Title (required)")).toHaveValue("A draft that must stay");
    await page.evaluate(async () => {
      const c = await import("./src/core/research-dossier.js");
      const backend = c.createIndexedDbDossierBackend();
      const repository = c.createDossierRepository({ backend });
      try {
        let [next] = await repository.list();
        for (let n = 0; n < 50; n += 1) next = await c.addExcerpt(next, next.sources[0].source_id, { text: `Excerpt ${n}` });
        await backend.put(next);
      } finally { repository.close(); }
    });
    await sourceAction(row, "new-excerpt").click();
    await row.locator('[data-source-field="text"]').fill("Another excerpt draft");
    await row.getByRole("button", { name: "Add excerpt", exact: true }).click();
    await expect(page.locator("#sourcesStatus")).toContainText("The excerpt list is full");
    await expect(row.locator('[data-source-field="text"]')).toHaveValue("Another excerpt draft");
    await page.evaluate(async () => {
      const c = await import("./src/core/research-dossier.js");
      const backend = c.createIndexedDbDossierBackend();
      try {
        const [record] = await backend.list();
        await backend.put({ ...record, format_version: 3, revision: record.revision + 1 });
      } finally { backend.close(); }
    });
    await row.getByRole("button", { name: "Add excerpt", exact: true }).click();
    await expect(page.locator("#sourcesStatus")).toContainText("Made by a newer version of this app");
  });

  test("a pending save locks its submitted fields while another form stays editable and keeps every draft", async ({ page }) => {
    await start(page);
    const row = await add(page);
    const first = await addText(row, "First excerpt");
    const second = await addText(row, "Second excerpt");
    await sourceAction(first, "matches").click();
    await first.getByLabel("How you checked").fill("Read the original");
    await sourceAction(second, "edit-excerpt").click();
    const pending = await holdNextSourceSave(page);
    await first.locator('[data-source-action="check-excerpt"]').click();
    await pending.waitUntilHeld();
    await expect(first.getByLabel("How you checked")).toBeDisabled();
    await expect(first.locator('[data-source-action="check-excerpt"]')).toBeDisabled();
    const text = second.locator('[data-source-field="text"]');
    const locator = second.locator('[data-source-field="locator"]');
    await expect(text).toBeEditable();
    await expect(locator).toBeEditable();
    await locator.fill("p. 99 — still drafting");
    await text.fill("Still writing in the second row");
    await pending.release();
    await expect(sourceAction(first, "reopen")).toBeVisible();
    await expect(text).toBeFocused();
    await expect(text).toHaveValue("Still writing in the second row");
    await expect(locator).toHaveValue("p. 99 — still drafting");
    const secondRow = page.locator(`[data-excerpt-row="${await second.getAttribute("data-excerpt-row")}"]`);
    await second.getByRole("button", { name: "Save", exact: true }).click();
    await expect(sourceAction(secondRow, "edit-excerpt")).toBeFocused();
    expect((await readCases(page))[0].excerpts[1]).toMatchObject({ text: "Still writing in the second row", locator: "p. 99 — still drafting" });
  });

  test("a pending Add source save disables every submitted field and preserves another editable form", async ({ page }) => {
    await start(page);
    const row = await add(page);
    const excerpt = await addText(row);
    await sourceAction(excerpt, "edit-excerpt").click();
    const submitted = addForm(page);
    await submitted.locator('[data-source-field="title"]').fill("A source held pending");
    await submitted.locator('[data-source-field="url"]').fill("https://example.org/pending-save");
    await submitted.locator('[data-source-field="source_date"]').fill("November 2026");
    await submitted.locator('[data-source-field="accessed_on"]').fill("2026-11-01");
    const pending = await holdNextSourceSave(page);
    await submitted.locator('[data-source-action="add-source"]').click();
    await pending.waitUntilHeld();
    for (const name of ["title", "url", "source_date", "accessed_on", "send"]) {
      await expect(submitted.locator(`[data-source-field="${name}"]`)).toBeDisabled();
    }
    const text = excerpt.locator('[data-source-field="text"]');
    const locator = excerpt.locator('[data-source-field="locator"]');
    await expect(text).toBeEditable();
    await expect(locator).toBeEditable();
    await text.fill("Typed while a source save is pending");
    await locator.fill("p. 81 — kept too");
    await pending.release();
    await expect(rows(page)).toHaveCount(2);
    await expect(locator).toBeFocused();
    await expect(text).toHaveValue("Typed while a source save is pending");
    await expect(locator).toHaveValue("p. 81 — kept too");
    for (const name of ["title", "url", "source_date", "accessed_on", "send"]) {
      await expect(submitted.locator(`[data-source-field="${name}"]`)).toBeEnabled();
    }
    await excerpt.getByRole("button", { name: "Save", exact: true }).click();
    const saved = excerpts(row).first();
    await expect(sourceAction(saved, "edit-excerpt")).toBeFocused();
    expect((await readCases(page))[0].excerpts[0]).toMatchObject({ text: "Typed while a source save is pending", locator: "p. 81 — kept too" });
  });

  test("saving a source while startup storage is slow cancels the pending restore", async ({ page }) => {
    await start(page);
    await add(page, "Earlier case");
    await expect.poll(async () => (await readIntakeDraft(page))?.dossier_id).toBeTruthy();
    const answer = await fs.readFile(new URL("../fixtures/sample-analysis-en.json", import.meta.url), "utf8");
    await openStep(page, "answer");
    await page.locator("#jsonInput").fill(answer);
    await page.locator("#importBtn").click();
    await expect.poll(async () => (await readCases(page))[0].analyses.length).toBe(1);
    const storage = await holdStartupStorage(page);
    await page.reload();
    await storage.waitUntilHeld();
    await page.locator("#sourcesFold > summary").click();
    await add(page, "Saved during restore");
    await storage.release();
    await expect(rows(page)).toHaveCount(1);
    await expect(rows(page).first()).toContainText("Saved during restore");
    await expect(page.locator("#reviewPanel")).toBeHidden();
    expect((await readCases(page))).toHaveLength(2);
  });

  test("typing an Add source draft while startup restore is held skips restore and keeps the draft", async ({ page }) => {
    await start(page);
    await add(page, "Earlier case");
    await importAnswer(page);
    await expect.poll(async () => (await readCases(page))[0].analyses.length).toBe(1);
    const storage = await holdStartupStorage(page);
    await page.reload();
    await storage.waitUntilHeld();
    await page.locator("#sourcesFold > summary").click();
    const title = addForm(page).locator('[data-source-field="title"]');
    const link = addForm(page).locator('[data-source-field="url"]');
    await title.fill("A typed, unsaved source");
    await link.fill("https://example.org/pending-draft");
    await storage.release();
    await expect(title).toHaveValue("A typed, unsaved source");
    await expect(link).toHaveValue("https://example.org/pending-draft");
    await expect(rows(page)).toHaveCount(0);
    await expect(page.locator("#reviewPanel")).toBeHidden();
    expect((await readCases(page))).toHaveLength(1);
    await addForm(page).getByRole("button", { name: "Add source", exact: true }).click();
    await expect(rows(page).first().getByRole("heading")).toHaveText("A typed, unsaved source");
    expect((await readCases(page))).toHaveLength(2);
  });

  test("language, lens, answer import, sample and reset respect the case's sources and checks", async ({ page }) => {
    await start(page);
    const row = await add(page);
    const excerpt = await addText(row);
    await sourceAction(excerpt, "matches").click();
    await excerpt.getByLabel("How you checked").fill("Read page four");
    await excerpt.locator('[data-source-action="check-excerpt"]').click();
    await expect(sourceAction(excerpt, "reopen")).toBeVisible();
    const [before] = await readCases(page);
    await page.locator("#langFr").click();
    await expect(page.locator("#sourcesFold > summary")).toHaveText("Vos notes de sources");
    await expect(row).toContainText("Conforme à la source");
    await page.locator("#langEn").click();
    await openStep(page, "lens");
    await page.locator('[data-lens="biopolitical"]').click();
    expect((await readCases(page))[0].sources).toEqual(before.sources);
    expect((await readCases(page))[0].excerpts).toEqual(before.excerpts);
    const answer = await fs.readFile(new URL("../fixtures/sample-analysis-bio-en.json", import.meta.url), "utf8");
    await openStep(page, "answer");
    await page.locator("#jsonInput").fill(answer);
    await page.locator("#importBtn").click();
    await expect.poll(async () => (await readCases(page))[0].analyses.length).toBe(1);
    expect((await readCases(page))[0].excerpts).toEqual(before.excerpts);
    await openStep(page, "topic");
    await page.locator("#loadSampleBtn").click();
    await openStep(page, "topic");
    await expect(rows(page)).toHaveCount(0);
    await page.locator("#workspaceSaveState").click();
    await page.locator(`[data-case-open="${before.dossier_id}"]`).click();
    await page.locator("#workspaceClose").click();
    await openStep(page, "topic");
    await expect(rows(page)).toHaveCount(1);
    await page.locator("#workspaceSaveState").click();
    await page.locator("#workspaceResetAll").click();
    await page.locator("#workspaceResetAll").click();
    await expect.poll(async () => (await readCases(page)).length).toBe(0);
    await page.locator("#workspaceClose").click();
    await expect(rows(page)).toHaveCount(0);
  });

  test("Arabic fold uses RTL labels and auto direction for analyst text", async ({ page }) => {
    await start(page, "ar");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.locator("#sourcesFold > summary")).toHaveText("ملاحظاتك عن المصادر");
    await addForm(page).getByLabel("العنوان (مطلوب)").fill("وثيقة <أصلية>");
    await addForm(page).getByRole("button", { name: "أضف مصدرًا", exact: true }).click();
    const row = rows(page).first();
    await expect(row.getByRole("heading")).toHaveText("وثيقة <أصلية>");
    await expect(row.getByRole("heading").locator("span")).toHaveAttribute("dir", "auto");
    await row.getByRole("button", { name: "أضف مقتطفًا", exact: true }).click();
    await expect(row.getByLabel("موضع المصدر", { exact: true })).toBeVisible();
    await row.getByLabel("ما يقوله — اقتباسًا أو بكلماتك").fill("هذا مقتطف\nEnglish reading");
    await row.getByRole("button", { name: "أضف المقتطف", exact: true }).click();
    await expect(excerpts(row).locator(".j-done-text")).toHaveAttribute("dir", "auto");
    await expectKernel(page, "#sourcesFold");
  });

  for (const [lang, copy] of Object.entries({
    en: { title: "T", only: (title) => `Remove “${title}”`, withExcerpts: (title) => `Remove “${title}” and its excerpts: 1` },
    ar: { title: "ع", only: (title) => `أزل «${title}»`, withExcerpts: (title) => `أزل «${title}» ومقتطفاته: 1` },
    fr: { title: "É", only: (title) => `Supprimer « ${title} »`, withExcerpts: (title) => `Supprimer « ${title} » et ses extraits : 1` },
  })) {
    test(`${lang}: 320px long sources reflow and armed removal names only the title and actual excerpts`, async ({ page }) => {
      await start(page, lang);
      await page.setViewportSize({ width: 320, height: 740 });
      await expect(page.locator("html")).toHaveAttribute("dir", lang === "ar" ? "rtl" : "ltr");
      const title = copy.title.repeat(500);
      const gist = copy.title.repeat(60) + "…";
      await addForm(page).locator('[data-source-field="title"]').fill(title);
      await addForm(page).locator('[data-source-field="url"]').fill(`https://example.org/${"z".repeat(450)}`);
      await addForm(page).locator('[data-source-action="add-source"]').click();
      const row = rows(page).first();
      await expect(row.getByRole("heading")).toHaveText(title);
      const remove = sourceAction(row, "remove-source");
      const reflows = async () => {
        await expect.poll(() => page.locator("#sourcesFold").evaluate((fold) => fold.scrollWidth - fold.clientWidth)).toBeLessThanOrEqual(1);
        await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
      };
      await remove.click();
      await expect(remove).toHaveText(copy.only(gist));
      // Exact text also proves the 500-character title was capped at 60 + ….
      await reflows();
      await sourceAction(row, "new-excerpt").click();
      const form = row.locator("[data-excerpt-form]");
      await form.locator('[data-source-field="text"]').fill("Text".repeat(450));
      await form.locator('[data-source-field="locator"]').fill("p".repeat(500));
      await form.locator('[data-source-action="save-excerpt"]').click();
      await expect(excerpts(row)).toHaveCount(1);
      await remove.click();
      await expect(remove).toHaveText(copy.withExcerpts(gist));
      await reflows();
      await expectKernel(page, "#sourcesFold");
    });
  }

  test("keyboard-only source and excerpt lifecycle follows every focus landing", async ({ page }) => {
    // Start in English; language radios use arrow keys, outside the lifecycle's
    // Tab/Shift+Tab, Enter and Space navigation contract.
    await page.addInitScript(() => localStorage.setItem("jarbou3i-model-settings", JSON.stringify({ lang: "en" })));
    await page.goto("./");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await tabTo(page, page.locator("#sourcesFold > summary"));
    await page.keyboard.press("Enter");
    const title = addForm(page).locator('[data-source-field="title"]');
    await tabTo(page, title);
    await page.keyboard.type("Keyboard source");
    await tabTo(page, page.locator("#sourceAdd-save"));
    await page.keyboard.press("Enter");
    const row = rows(page).first();
    await expect(sourceAction(row, "new-excerpt")).toBeFocused();

    for (const text of ["Keyboard first excerpt", "Keyboard last excerpt"]) {
      await page.keyboard.press("Enter");
      const form = row.locator("[data-excerpt-form]");
      await expect(form.locator('[data-source-field="text"]')).toBeFocused();
      await page.keyboard.type(text);
      await page.keyboard.press("Tab");
      await expect(form.locator('[data-source-field="locator"]')).toBeFocused();
      await page.keyboard.type("p. 7");
      await page.keyboard.press("Tab");
      await page.keyboard.press("Enter");
      await expect(sourceAction(excerpts(row).last(), "edit-excerpt")).toBeFocused();
      if (text === "Keyboard first excerpt") await tabTo(page, sourceAction(row, "new-excerpt"), true);
    }
    const first = excerpts(row).first();
    const last = excerpts(row).last();
    await tabTo(page, sourceAction(first, "matches"), true);
    await page.keyboard.press("Enter");
    await expect(first.getByLabel("How you checked")).toBeFocused();
    await page.keyboard.type("Read the original page seven");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");
    await expect(sourceAction(first, "reopen")).toBeFocused();
    await page.keyboard.press("Space");
    await expect(sourceAction(first, "matches")).toBeFocused();
    await tabTo(page, sourceAction(first, "edit-excerpt"), true);
    await page.keyboard.press("Enter");
    const edit = first.locator("[data-excerpt-form]");
    await expect(edit.locator('[data-source-field="text"]')).toBeFocused();
    await page.keyboard.type("A changed reading. ");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");
    await expect(sourceAction(first, "edit-excerpt")).toBeFocused();

    await tabTo(page, row.getByRole("switch"), true);
    await expect(row.getByRole("switch")).toBeChecked();
    await page.keyboard.press("Space");
    await expect(row.getByRole("switch")).not.toBeChecked();
    await expect(row.getByRole("switch")).toBeFocused();
    await tabTo(page, sourceAction(first, "remove-excerpt"));
    await page.keyboard.press("Enter");
    await expect(excerpts(row)).toHaveCount(2);
    await expect(sourceAction(first, "remove-excerpt")).toBeFocused();
    await page.keyboard.press("Space");
    await expect(excerpts(row)).toHaveCount(1);
    await expect(sourceAction(last, "edit-excerpt")).toBeFocused();
    await page.keyboard.press("Tab");
    await page.keyboard.press("Space");
    await expect(excerpts(row)).toHaveCount(1);
    await page.keyboard.press("Enter");
    await expect(sourceAction(row, "new-excerpt")).toBeFocused();
    await tabTo(page, sourceAction(row, "remove-source"));
    await page.keyboard.press("Space");
    await expect(rows(page)).toHaveCount(1);
    await page.keyboard.press("Enter");
    await expect(rows(page)).toHaveCount(0);
    await expect(page.locator("#sourceAdd-save")).toBeFocused();
  });

  test("same-tab Matches refreshes an open excerpt editor and saving changed text reopens the check", async ({ page }) => {
    await start(page);
    const row = await add(page);
    const excerpt = await addText(row);
    await sourceAction(excerpt, "edit-excerpt").click();
    const text = excerpt.locator('[data-source-field="text"]');
    await text.fill("A revised reading of this page");
    await sourceAction(excerpt, "matches").click();
    await excerpt.getByLabel("How you checked").fill("Read page 4");
    await excerpt.locator('[data-source-action="check-excerpt"]').click();
    await expect(sourceAction(excerpt, "reopen")).toBeFocused();
    await expect(text).toHaveValue("A revised reading of this page");
    const saved = page.locator(`[data-excerpt-row="${await excerpt.getAttribute("data-excerpt-row")}"]`);
    await excerpt.locator("[data-excerpt-form]").getByRole("button", { name: "Save", exact: true }).click();
    await expect(sourceAction(saved, "edit-excerpt")).toBeFocused();
    await expect(saved.locator("[data-excerpt-form]")).toHaveCount(0);
    await expect(page.locator("#sourcesStatus")).toHaveText("Saved on this device.");
    await expect(page.locator("#sourcesStatus")).not.toContainText("changed elsewhere");
    await expect(sourceAction(saved, "matches")).toBeVisible();
    expect((await readCases(page))[0].excerpts[0]).toMatchObject({ text: "A revised reading of this page", check: { status: "unchecked", reason: "", decided_at: null } });
  });

  test("a saved excerpt addition disarms a source removal before two fresh activations remove both", async ({ page }) => {
    await start(page);
    const row = await add(page);
    const remove = sourceAction(row, "remove-source");
    await remove.click();
    await expect(remove).toHaveText("Remove “Council minutes”");
    await addText(row, "Attached after arming");
    await expect(remove).toHaveText("Remove");
    await remove.click();
    await expect(remove).toHaveText("Remove “Council minutes” and its excerpts: 1");
    expect((await readCases(page))[0].excerpts).toHaveLength(1);
    await remove.click();
    await expect(rows(page)).toHaveCount(0);
    const [saved] = await readCases(page);
    expect(saved.format_version).toBe(1);
    expect(saved.sources).toBeUndefined();
    expect(saved.excerpts).toBeUndefined();
  });

  test("zero source, excerpt, checked and sent counts are omitted from their proper fields", async ({ page }) => {
    await start(page);
    await page.locator("#caseFold > summary").click();
    await page.locator("#caseScopeIn").fill("A case with no sources");
    await expect.poll(async () => (await readCases(page)).length).toBe(1);
    await page.locator("#workspaceSaveState").click();
    await expect(page.locator("#caseList [data-case-row]")).toHaveCount(1);
    await expect(page.locator("#caseList [data-case-row]")).not.toContainText("Sources:");
    await page.locator("#workspaceClose").click();
    await openStep(page, "settings");
    await page.locator("#evidenceAccess").selectOption("provided");
    await expect(page.locator("#sourcesField #sourcesSentCount")).toHaveCount(1);
    await expect(page.locator("#sourcesSentCount")).toBeHidden();
    await openStep(page, "topic");
    const row = await add(page);
    await expect(row).not.toContainText("Excerpts:");
    await expect(row).not.toContainText("Checked:");
    await addText(row);
    await expect(row).toContainText("Excerpts: 1");
    await expect(row).not.toContainText("Checked:");
    await openStep(page, "settings");
    await expect(page.locator("#sourcesField #sourcesSentCount")).toBeVisible();
    await expect(page.locator("#sourcesSentCount")).toHaveText("Your sources sent to the AI: 1 (step 1)");
    await openStep(page, "topic");
    await row.getByRole("switch").uncheck();
    await openStep(page, "settings");
    await expect(page.locator("#sourcesField #sourcesSentCount")).toBeHidden();
    await expect(page.locator("#sourcesSentCount")).toHaveText("");
  });

  test("forced colors preserve source controls and decisions", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "chromium", "Forced colors are checked in Chromium.");
    await start(page);
    await page.emulateMedia({ forcedColors: "active" });
    const row = await add(page);
    const excerpt = await addText(row);
    await sourceAction(excerpt, "matches").click();
    await expect(excerpt.getByLabel("How you checked")).toBeFocused();
    await expect(page.locator("#sourceAdd-save")).toBeVisible();
    expect(await page.locator("#sourceAdd-save").evaluate((button) => getComputedStyle(button).borderTopStyle)).not.toBe("none");
    expect(await page.evaluate(() => matchMedia("(forced-colors: active)").matches)).toBe(true);
    // Axe's contrast calculation reads author colours in forced-color mode.
    // Check ordinary themes separately, as the kernel's own suite does.
    await page.emulateMedia({ forcedColors: "none" });
    await expectKernel(page, "#sourcesFold");
  });

  test("source and excerpt writes leave saved workspaces and editor recovery byte-identical and out of all analysis exports", async ({ page }) => {
    await start(page);
    await page.locator("#caseFold > summary").click();
    await page.locator("#caseScopeIn").fill("Isolation of case material from the saved answer");
    await expect.poll(async () => (await readCases(page)).length).toBe(1);
    await importAnswer(page);
    await expect.poll(async () => (await readCases(page))[0].analyses.length).toBe(1);
    await seedEditorRecovery(page);
    const before = await readWorkspaceRecoveryRecords(page);
    expect(before.workspaces).toHaveLength(1);
    expect(before.workspaces[0].revisions.length).toBeGreaterThan(0);
    expect(before.workspaces[0].repository_revision).toBeGreaterThan(0);
    expect(before.recovery).toHaveLength(1);
    expect(before.recovery[0].repository_revision).toBe(before.workspaces[0].repository_revision);
    const bytes = JSON.stringify(before);
    const importedClaim = before.workspaces[0].working_draft.canonical_payload.evidence.items[0].claim;
    expect(importedClaim.length).toBeGreaterThan(20);
    const unchanged = async () => {
      expect(JSON.stringify(await readWorkspaceRecoveryRecords(page))).toBe(bytes);
      // The boundary also runs in the other direction: importing/linking an
      // answer must not copy its evidence into any part of the dossier.
      expect(JSON.stringify(await readCases(page))).not.toContain(importedClaim);
    };
    const sourceMarker = "UNIQUE_SOURCE_RESEARCH_1B_963A";
    const excerptMarker = "UNIQUE_EXCERPT_RESEARCH_1B_54C8";
    const absent = (value) => {
      expect(value).not.toContain(sourceMarker);
      expect(value).not.toContain(excerptMarker);
    };
    await openStep(page, "topic");
    if (!(await page.locator("#sourcesFold").evaluate((fold) => fold.open))) await page.locator("#sourcesFold > summary").click();
    const row = await add(page, sourceMarker, "https://example.org/isolated-source");
    await unchanged();
    await sourceAction(row, "edit-source").click();
    await row.locator('[data-source-form="edit"] [data-source-field="source_date"]').fill("November 2026");
    await row.locator('[data-source-form="edit"]').getByRole("button", { name: "Save", exact: true }).click();
    await expect(sourceAction(row, "edit-source")).toBeFocused();
    await unchanged();
    const excerpt = await addText(row, excerptMarker);
    await unchanged();
    await sourceAction(excerpt, "edit-excerpt").click();
    await excerpt.locator('[data-source-field="locator"]').fill("p. 24");
    await excerpt.getByRole("button", { name: "Save", exact: true }).click();
    await expect(sourceAction(excerpt, "edit-excerpt")).toBeFocused();
    await unchanged();
    await sourceAction(excerpt, "matches").click();
    await excerpt.getByLabel("How you checked").fill("Compared with the signed original.");
    await excerpt.locator('[data-source-action="check-excerpt"]').click();
    await expect(sourceAction(excerpt, "reopen")).toBeVisible();
    await unchanged();
    absent(JSON.stringify((await readWorkspaceRecoveryRecords(page)).workspaces));

    // Exercise each actual analysis export while the markers are still kept
    // in the active case. A dossier backup intentionally includes them.
    await page.locator('[data-review="exports"]').click();
    for (const id of ["exportJson", "exportHtml"]) absent(await downloadText(page, page.locator(`#${id}`)));
    await page.locator("#workspaceSaveState").click();
    absent(await downloadText(page, page.locator("#workspaceExport")));
    await page.locator("#workspaceClose").click();
    await page.locator('[data-review="inspection"]').click();
    await page.locator("[data-evidence-intelligence] > summary").click();
    for (const id of ["exportIntelligence", "exportReviewPlan"]) absent(await downloadText(page, page.locator(`#${id}`)));
    await page.locator("#openReviewLedger").click();
    absent(await downloadText(page, page.locator("#ledgerExport")));
    await page.locator("#ledgerClose").click();
    await unchanged();

    await openStep(page, "topic");
    await sourceAction(excerpt, "remove-excerpt").click();
    await sourceAction(excerpt, "remove-excerpt").click();
    await expect(excerpts(row)).toHaveCount(0);
    await unchanged();
    // Also cover the cascading source removal with a retained excerpt.
    await addText(row, excerptMarker + " cascade");
    await unchanged();
    await sourceAction(row, "remove-source").click();
    await sourceAction(row, "remove-source").click();
    await expect(rows(page)).toHaveCount(0);
    await unchanged();
  });

  test("saving an answer edit and loading the sample preserve the case's source and excerpt bytes", async ({ page }) => {
    await start(page);
    const row = await add(page, "Preserved case source");
    const excerpt = await addText(row, "Preserved excerpt and check");
    await sourceAction(excerpt, "matches").click();
    await excerpt.getByLabel("How you checked").fill("Checked the archived copy");
    await excerpt.locator('[data-source-action="check-excerpt"]').click();
    await expect(sourceAction(excerpt, "reopen")).toBeVisible();
    const [dossier] = await readCases(page);
    const bytes = JSON.stringify({ sources: dossier.sources, excerpts: dossier.excerpts });
    const caseBytes = async () => {
      const kept = (await readCases(page)).find((record) => record.dossier_id === dossier.dossier_id);
      return JSON.stringify({ sources: kept.sources, excerpts: kept.excerpts });
    };
    await importAnswer(page);
    await expect.poll(async () => (await readCases(page))[0].analyses.length).toBe(1);
    expect(await caseBytes()).toBe(bytes);
    await page.locator("#workspaceSaveState").click();
    await page.getByRole("button", { name: "Edit draft", exact: true }).click();
    await page.locator('[data-editor-path="/subject"]').click();
    const field = page.locator("#editorField");
    const subject = JSON.parse(await field.inputValue());
    subject.title = "An answer edit keeps all source material";
    await field.fill(JSON.stringify(subject, null, 2));
    await field.press("Control+Enter");
    await page.locator("#editorSave").click();
    await expect(page.locator("#editorDirty")).toContainText("No unsaved");
    await page.locator("#editorClose").click();
    expect(await caseBytes()).toBe(bytes);
    await openStep(page, "topic");
    await page.locator("#loadSampleBtn").click();
    await expect(page.locator("#reviewPanel")).toBeVisible();
    await expect.poll(async () => (await readWorkspaceRecoveryRecords(page)).workspaces.length).toBe(2);
    expect(await caseBytes()).toBe(bytes);
  });
});

// New AR/EN/FR wording needs native check.
for (const [lang, notes, access] of [['en', 'Your source notes', 'AI source access'], ['ar', 'ملاحظاتك عن المصادر', 'وصول الذكاء الاصطناعي إلى المصادر'], ['fr', 'Vos notes de sources', 'Accès de l’IA aux sources']]) {
  test(`source notes and AI access have distinct labels: ${lang}`, async ({ page }) => {
    await start(page, lang);
    await expect(page.locator('#sourcesFold > summary')).toContainText(notes);
    await openStep(page, 'settings');
    await expect(page.locator('[data-i18n="evidenceAccess"]')).toHaveText(access);
  });
}
