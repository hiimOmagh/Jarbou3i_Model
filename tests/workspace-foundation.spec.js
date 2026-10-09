import { test, expect } from "@playwright/test";
import fs from "node:fs/promises";
import {
  clearWorkspaceRecords,
  countWorkspaceRecords,
  damageFirstWorkspace,
  readIntakeDraft,
  slowStorageOpens,
  storageTransactionsDone,
} from "./helpers/browser-persistence.js";

async function useEnglish(page) {
  await page.goto("./");
  await page.locator("#langEn").click();
}

async function createSavedWorkspace(page, lens) {
  if (lens === "biopolitical") {
    await page.locator('[data-lens="biopolitical"]').click();
  }

  await page.locator("#loadSampleBtn").click();

  await expect(page.locator("#reviewPanel")).toBeVisible();

  await expect(page.locator("#workspaceSaveState"))
    .toHaveAttribute("data-state", "saved");
}

async function fixture(name) {
  return JSON.parse(await fs.readFile(`fixtures/${name}`, "utf8"));
}

test("switching lens and back makes that lens's saved analysis current again", async ({ page }) => {
  await useEnglish(page);
  await createSavedWorkspace(page, "strategic");
  const strategicTitle = await page.locator("#topicInput").inputValue();
  await createSavedWorkspace(page, "biopolitical");

  await page.locator('[data-lens="strategic"]').click();

  await expect(page.locator("#topicInput")).toHaveValue(strategicTitle);
  await page.locator("#workspaceBtn").click();
  await expect(page.locator(".workspaceRow.active .workspaceRowTitle")).toHaveText(strategicTitle);
});

test("an analysis whose save failed leaves no other analysis marked current", async ({ page }) => {
  await useEnglish(page);
  await createSavedWorkspace(page, "strategic");
  await page.evaluate(() => {
    const put = IDBObjectStore.prototype.put;
    IDBObjectStore.prototype.put = function (...args) {
      if (this.name === "workspaces") throw new DOMException("Storage is full", "QuotaExceededError");
      return put.apply(this, args);
    };
  });
  await page.locator('[data-lens="biopolitical"]').click();
  await page.locator("#jsonInput").fill(JSON.stringify(await fixture("sample-analysis-bio-en.json")));
  await page.locator("#importBtn").click();
  await expect(page.locator("#workspaceSaveState")).toHaveAttribute("data-state", "error");

  await page.locator("#workspaceBtn").click();
  await expect(page.locator(".workspaceRow")).toHaveCount(1);
  await expect(page.locator(".workspaceRow.active")).toHaveCount(0);
  await expect(page.locator("#workspaceExport")).toBeDisabled();
});

test("a failed save is said when it happens and stays shown in Workspaces", async ({ page }) => {
  await useEnglish(page);
  await page.evaluate(() => {
    const put = IDBObjectStore.prototype.put;
    IDBObjectStore.prototype.put = function (...args) {
      if (this.name === "workspaces") throw new DOMException("Storage is full", "QuotaExceededError");
      return put.apply(this, args);
    };
  });
  await page.locator("#jsonInput").fill(JSON.stringify(await fixture("sample-analysis-en.json")));
  await page.locator("#importBtn").click();
  await expect(page.locator("#workspaceSaveState")).toHaveAttribute("data-state", "error");
  await expect(page.locator("#toast")).toContainText("was not saved on this device");

  await page.locator("#workspaceBtn").click();
  await expect(page.locator(".workspaceRow")).toHaveCount(0);
  await expect(page.locator("#workspaceStatus")).not.toContainText("storage is ready");
  await expect(page.locator("#workspaceSaveState")).toHaveAttribute("data-state", "error");
});

test("Arabic Workspaces name rows and damage in Arabic", async ({ page }) => {
  await page.goto("./");
  await page.locator("#langAr").click();
  await createSavedWorkspace(page, "strategic");
  await page.locator("#workspaceBtn").click();
  await expect(page.locator(".workspaceRow .workspaceRowMeta").first()).not.toContainText(/strategic|verified/);
  await damageFirstWorkspace(page);
  await page.reload();
  await page.locator("#workspaceBtn").click();
  await expect(page.locator(".workspaceRow.corrupt")).toBeVisible();
  await expect(page.locator(".workspaceRow.corrupt")).not.toContainText(/[A-Z_]{6,}/);
});

test("an Arabic save failure is said in Arabic", async ({ page }) => {
  await page.goto("./");
  await page.locator("#langAr").click();
  await page.evaluate(() => {
    const put = IDBObjectStore.prototype.put;
    IDBObjectStore.prototype.put = function (...args) {
      if (this.name === "workspaces") throw new DOMException("Storage is full", "QuotaExceededError");
      return put.apply(this, args);
    };
  });
  await page.locator("#loadSampleBtn").click();
  await expect(page.locator("#workspaceSaveState")).toHaveAttribute("data-state", "error");
  await page.locator("#workspaceBtn").click();
  await expect(page.locator("#workspaceStatus")).not.toBeEmpty();
  await expect(page.locator("#workspaceStatus")).not.toContainText(/[A-Za-z]{3,}/);
});

// Changes the stored workspace behind the open list, as another tab would.
function changeStoredWorkspace(page, change) {
  return change === "damage" ? damageFirstWorkspace(page) : clearWorkspaceRecords(page);
}

for (const [change, said] of [["remove", "no longer saved"], ["damage", "integrity"]]) {
  test(`a row whose workspace was ${change}d says so instead of opening another`, async ({ page }) => {
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await useEnglish(page);
    await createSavedWorkspace(page, "strategic");
    await page.locator("#workspaceBtn").click();
    await changeStoredWorkspace(page, change);
    await page.locator("[data-workspace-edit]").first().click();
    await expect(page.locator("#workspaceStatus")).toContainText(said);
    await expect(page.locator("#editorBackdrop")).not.toHaveClass(/show/);
    expect(errors).toEqual([]);
  });
}

test("switching lens while the analysis saves keeps it with its workspace", async ({ page }) => {
  await useEnglish(page);
  // Saves finish late, as on a slow device.
  await page.evaluate(() => {
    const transaction = IDBDatabase.prototype.transaction;
    IDBDatabase.prototype.transaction = function (...args) {
      const created = transaction.apply(this, args);
      if (args[1] === "readwrite") {
        Object.defineProperty(created, "oncomplete", {
          set(handler) {
            created.addEventListener("complete", (event) => setTimeout(() => handler.call(created, event), 1500));
          },
        });
      }
      return created;
    };
  });
  await page.locator("#loadSampleBtn").click();
  await expect(page.locator("#reviewPanel")).toBeVisible();
  await page.locator('[data-lens="biopolitical"]').click();
  await expect(page.locator("#workspaceSaveState")).not.toHaveAttribute("data-state", "saving", { timeout: 10_000 });
  await page.locator('[data-lens="strategic"]').click();
  await expect(page.locator("#reviewPanel")).toBeVisible();
  await expect(page.locator("#workspaceSaveState")).toHaveAttribute("data-state", "saved");
  await page.locator("#workspaceBtn").click();
  await expect(page.locator(".workspaceRow.active")).toHaveCount(1);
  await expect(page.locator("#workspaceExport")).toBeEnabled();
});

test("importing the analysis already open does not save it twice", async ({ page }) => {
  await useEnglish(page);
  await createSavedWorkspace(page, "strategic");
  await page.locator("#loadSampleBtn").click();
  await expect(page.locator("#workspaceSaveState")).toHaveAttribute("data-state", "saved");
  await page.locator("#workspaceBtn").click();
  await expect(page.locator(".workspaceRow")).toHaveCount(1);
  await expect(page.locator(".workspaceRow.active")).toHaveCount(1);
});

test("a reply left in the box by Reset app data is still kept and guarded", async ({ page }) => {
  await useEnglish(page);
  const reply = JSON.stringify(await fixture("sample-analysis-fr.json"));
  await page.locator("#jsonInput").fill(reply);
  await expect.poll(async () => (await readIntakeDraft(page))?.reply).toBe(reply);
  await page.locator("#workspaceBtn").click();
  await page.locator("#workspaceResetAll").click();
  await page.locator("#workspaceResetAll").click();
  await expect(page.locator("#workspaceStatus")).toContainText(/reset|cleared|removed/i);
  await expect.poll(async () => (await readIntakeDraft(page))?.reply).toBe(reply);
  await page.keyboard.press("Escape");
  await page.locator("#loadSampleBtn").click();
  await expect(page.locator("#toast")).toContainText("Click again");
  await expect(page.locator("#jsonInput")).toHaveValue(reply);
});

test("importing an analysis of the other lens sets aside the one on screen", async ({ page }) => {
  await useEnglish(page);
  await createSavedWorkspace(page, "strategic");
  await page.locator("#jsonInput").fill(JSON.stringify(await fixture("sample-analysis-bio-en.json")));
  await page.locator("#importBtn").click();
  await expect(page.locator("[data-results-orientation]")).toHaveAttribute("data-analysis-lens", "biopolitical");
  await page.locator('[data-lens="strategic"]').click();
  await expect(page.locator("#reviewPanel")).toBeVisible();
  await expect(page.locator("[data-results-orientation]")).toHaveAttribute("data-analysis-lens", "strategic");
  await expect(page.locator(".orientationConclusion")).toContainText("bipolar order");
});

test("a damaged workspace can be removed after a second click", async ({ page }) => {
  await useEnglish(page);
  await createSavedWorkspace(page, "strategic");
  await damageFirstWorkspace(page);
  await page.reload();
  await page.locator("#workspaceBtn").click();
  const remove = page.locator(".workspaceRow.corrupt [data-workspace-remove-damaged]");
  await remove.click();
  expect(await countWorkspaceRecords(page)).toBe(1);
  await remove.click();
  await expect(page.locator(".workspaceRow")).toHaveCount(0);
  expect(await countWorkspaceRecords(page)).toBe(0);
});

test("loading the sample asks before replacing a reply that is not imported", async ({ page }) => {
  await useEnglish(page);
  const reply = JSON.stringify(await fixture("sample-analysis-fr.json"));
  await page.locator("#jsonInput").fill(reply);
  // A reply brought back after a reload counts too.
  await expect.poll(async () => (await readIntakeDraft(page))?.reply).toBe(reply);
  await page.reload();
  await expect(page.locator("#jsonInput")).toHaveValue(reply);

  await page.locator("#loadSampleBtn").click();
  await expect(page.locator("#toast")).toContainText("Click again");
  await expect(page.locator("#jsonInput")).toHaveValue(reply);
  await expect(page.locator("#reviewPanel")).toBeHidden();

  await page.locator("#loadSampleBtn").click();
  await expect(page.locator("#reviewPanel")).toBeVisible();
  await expect(page.locator("#workspaceSaveState")).toHaveAttribute("data-state", "saved");
  await expect(page.locator("#importBtn")).toBeDisabled();
  // Once replaced on purpose, the reply does not come back after a reload.
  await page.reload();
  await expect(page.locator("#reviewPanel")).toBeVisible();
  await expect(page.locator("#jsonInput")).not.toHaveValue(reply);
});

test("opening a saved analysis asks before replacing a reply that is not imported", async ({ page }) => {
  await useEnglish(page);
  await createSavedWorkspace(page, "strategic");
  const strategicTitle = await page.locator("#topicInput").inputValue();
  await createSavedWorkspace(page, "biopolitical");
  await page.locator('[data-shell-nav="workflow"]').click();
  const reply = JSON.stringify(await fixture("sample-analysis-bio-fr.json"));
  await page.locator("#jsonInput").fill(reply);

  await page.locator("#workspaceBtn").click();
  const open = page.locator(".workspaceRow", { hasText: strategicTitle }).locator("[data-workspace-open]");
  await open.click();
  await expect(page.locator("#workspaceStatus")).toContainText("Click again");
  await expect(page.locator("#jsonInput")).toHaveValue(reply);

  await open.click();
  await expect(page.locator("#topicInput")).toHaveValue(strategicTitle);
  await expect(page.locator("#importBtn")).toBeDisabled();
});

test("restoring a workspace file asks before replacing a reply that is not imported", async ({ page }) => {
  await useEnglish(page);
  await page.locator("#jsonInput").fill(JSON.stringify(await fixture("sample-analysis-en.json")));
  await page.locator("#workspaceBtn").click();

  await page.locator("#workspaceImport").click();
  await expect(page.locator("#workspaceStatus")).toContainText("Click again");

  const [chooser] = await Promise.all([
    page.waitForEvent("filechooser"),
    page.locator("#workspaceImport").click(),
  ]);
  expect(chooser.isMultiple()).toBe(false);
});

for (const reset of ["workspaceResetCurrent", "workspaceResetAll"]) {
  test(`an analysis removed by ${reset} does not come back with its lens`, async ({ page }) => {
    await useEnglish(page);
    await createSavedWorkspace(page, "strategic");
    await page.locator('[data-lens="biopolitical"]').click();
    await page.locator("#workspaceBtn").click();
    await page.locator(`#${reset}`).click();
    await page.locator(`#${reset}`).click();
    await expect(page.locator(".workspaceRow")).toHaveCount(0);
    await page.locator("#workspaceClose").click();

    await page.locator('[data-lens="strategic"]').click();
    await expect(page.locator("#reviewPanel")).toBeHidden();
  });
}

test("a reply typed over a saved analysis can still be imported after a lens round trip", async ({ page }) => {
  await useEnglish(page);
  await createSavedWorkspace(page, "strategic");
  await page.locator('[data-shell-nav="workflow"]').click();
  const reply = JSON.stringify(await fixture("sample-analysis-en.json"));
  await page.locator("#jsonInput").fill(reply);

  await page.locator('[data-lens="biopolitical"]').click();
  await page.locator('[data-lens="strategic"]').click();

  await expect(page.locator("#jsonInput")).toHaveValue(reply);
  await expect(page.locator("#importBtn")).toBeEnabled();
});

test("nothing is asked when the reply box holds an analysis already saved", async ({ page }) => {
  await useEnglish(page);
  await createSavedWorkspace(page, "strategic");
  await page.locator('[data-shell-nav="workflow"]').click();
  await page.locator("#topicInput").fill("A new topic for the next analysis");
  await page.locator("#copyPromptBtn").click();

  await page.locator("#loadSampleBtn").click();
  await expect(page.locator("#toast")).toContainText("Sample analysis loaded");
});

test("after a reset, the reply left in the box can be imported again", async ({ page }) => {
  await useEnglish(page);
  await page.locator("#jsonInput").fill(JSON.stringify(await fixture("sample-analysis-en.json")));
  await page.locator("#importBtn").click();
  await expect(page.locator("#workspaceSaveState")).toHaveAttribute("data-state", "saved");
  await page.locator("#workspaceBtn").click();
  await page.locator("#workspaceResetCurrent").click();
  await page.locator("#workspaceResetCurrent").click();
  await expect(page.locator(".workspaceRow")).toHaveCount(0);

  await expect(page.locator("#importBtn")).toBeEnabled();
});

test("a reply pasted before switching lens is not replaced by that lens's kept result", async ({ page }) => {
  await useEnglish(page);
  await createSavedWorkspace(page, "strategic");
  await page.locator('[data-lens="biopolitical"]').click();
  const reply = JSON.stringify(await fixture("sample-analysis-fr.json"));
  await page.locator("#jsonInput").fill(reply);

  await page.locator('[data-lens="strategic"]').click();
  await expect(page.locator("#jsonInput")).toHaveValue(reply);
});

test("saving an edit keeps a reply that is pasted but not imported", async ({ page }) => {
  await useEnglish(page);
  await createSavedWorkspace(page, "strategic");
  await page.locator('[data-shell-nav="workflow"]').click();
  const reply = JSON.stringify(await fixture("sample-analysis-fr.json"));
  await page.locator("#jsonInput").fill(reply);

  await page.locator("#workspaceBtn").click();
  await page.getByRole("button", { name: "Edit draft" }).click();
  await page.locator('[data-editor-path="/subject"]').click();
  const field = page.locator("#editorField");
  const subject = JSON.parse(await field.inputValue());
  subject.title = "Edited while a reply waits";
  await field.fill(JSON.stringify(subject, null, 2));
  await field.press("Control+Enter");
  await page.locator("#editorSave").click();
  await expect(page.locator("#editorDirty")).toContainText("No unsaved");
  await expect(page.locator("#topicInput")).toHaveValue("Edited while a reply waits");
  await expect(page.locator("#jsonInput")).toHaveValue(reply);
});

test("a reply pasted but not imported stays guarded and kept when the lens changes", async ({ page }) => {
  await useEnglish(page);
  await createSavedWorkspace(page, "strategic");
  await page.locator('[data-shell-nav="workflow"]').click();
  const reply = JSON.stringify(await fixture("sample-analysis-fr.json"));
  await page.locator("#jsonInput").fill(reply);
  await expect.poll(async () => (await readIntakeDraft(page))?.reply).toBe(reply);

  await page.locator('[data-lens="biopolitical"]').click();
  await expect(page.locator("#jsonInput")).toHaveValue(reply);
  await page.locator("#loadSampleBtn").click();
  await expect(page.locator("#toast")).toContainText("Click again");
  await expect(page.locator("#jsonInput")).toHaveValue(reply);

  // The analysis set aside comes back without taking the reply's place.
  await page.locator('[data-lens="strategic"]').click();
  await expect(page.locator("#reviewPanel")).toBeVisible();
  await expect(page.locator("#jsonInput")).toHaveValue(reply);
  await page.reload();
  await expect(page.locator("#jsonInput")).toHaveValue(reply);
});

test("a reply pasted but not imported survives a reload after another saved analysis is edited", async ({ page }) => {
  await useEnglish(page);
  await createSavedWorkspace(page, "strategic");
  await createSavedWorkspace(page, "biopolitical");
  await page.locator('[data-shell-nav="workflow"]').click();
  const reply = JSON.stringify(await fixture("sample-analysis-fr.json"));
  await page.locator("#jsonInput").fill(reply);
  await expect.poll(async () => (await readIntakeDraft(page))?.reply).toBe(reply);

  await page.locator("#workspaceBtn").click();
  await page.locator(".workspaceRow:not(.active)").getByRole("button", { name: "Edit draft" }).click();
  await page.locator('[data-editor-path="/subject"]').click();
  const field = page.locator("#editorField");
  const subject = JSON.parse(await field.inputValue());
  subject.title = "Edited in another analysis";
  await field.fill(JSON.stringify(subject, null, 2));
  await field.press("Control+Enter");
  await page.locator("#editorSave").click();
  await expect(page.locator("#editorDirty")).toContainText("No unsaved");
  await expect(page.locator("#jsonInput")).toHaveValue(reply);
  await page.locator("#editorClose").click();

  await page.reload();
  await expect(page.locator("#topicInput")).toHaveValue("Edited in another analysis");
  await expect(page.locator("#jsonInput")).toHaveValue(reply);
});

test("a reply pasted but not imported survives a reload after the lens brings back another analysis", async ({ page }) => {
  await useEnglish(page);
  await createSavedWorkspace(page, "strategic");
  await createSavedWorkspace(page, "biopolitical");
  await page.locator('[data-shell-nav="workflow"]').click();
  const reply = JSON.stringify(await fixture("sample-analysis-fr.json"));
  await page.locator("#jsonInput").fill(reply);
  await expect.poll(async () => (await readIntakeDraft(page))?.reply).toBe(reply);

  // The Strategic analysis set aside comes back as the current one.
  await page.locator('[data-lens="strategic"]').click();
  await expect(page.locator("#reviewPanel")).toBeVisible();
  await expect(page.locator("#jsonInput")).toHaveValue(reply);
  await page.reload();
  await expect(page.locator("#jsonInput")).toHaveValue(reply);
});

test("clicking Import twice saves the analysis once", async ({ page }) => {
  await useEnglish(page);
  await page.locator("#jsonInput").fill(JSON.stringify(await fixture("sample-analysis-en.json")));

  await page.locator("#importBtn").dblclick();
  await expect(page.locator("#workspaceSaveState")).toHaveAttribute("data-state", "saved");
  await expect(page.locator("#importBtn")).toBeDisabled();
  await page.locator("#workspaceBtn").click();
  await expect(page.locator(".workspaceRow")).toHaveCount(1);
  expect(await countWorkspaceRecords(page)).toBe(1);
});

// On a slow device the last analysis reopens well after the page is usable.
test("a new topic and analysis language chosen while the last analysis reopens are kept", async ({ page }) => {
  await useEnglish(page);
  await createSavedWorkspace(page, "strategic");
  await slowStorageOpens(page, 1_500);
  await page.reload();

  await page.locator("#topicInput").fill("A new topic typed during the reopen");
  await page.locator("#analysisLang").selectOption("fr");
  // Both startup reads (the last analysis, then the unfinished intake) are done.
  await expect.poll(() => storageTransactionsDone(page)).toBeGreaterThanOrEqual(2);

  await expect(page.locator("#topicInput")).toHaveValue("A new topic typed during the reopen");
  await expect(page.locator("#analysisLang")).toHaveValue("fr");
  await expect(page.locator("#reviewPanel")).toBeHidden();
  expect(await countWorkspaceRecords(page)).toBe(1);
});

test("switching the interface language while the last analysis reopens still reopens it", async ({ page }) => {
  await useEnglish(page);
  await createSavedWorkspace(page, "strategic");
  await slowStorageOpens(page, 1_500);
  await page.reload();

  await page.locator("#langFr").click();

  await expect(page.locator("#reviewPanel")).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");
});

for (const lens of ["strategic", "biopolitical"]) {
test(`${lens} IndexedDB workspace survives reload and reopens a verified draft`, async ({ page }) => {
  await useEnglish(page);
  await createSavedWorkspace(page, lens);
  const title = await page.locator("#topicInput").inputValue();
  const stored = await countWorkspaceRecords(page);
  expect(stored).toBe(1);
  await page.reload();

  await expect(page.locator("#workspaceSaveState"))
  .toHaveAttribute("data-state", "saved");

  await expect(page.locator("#topicInput")).toHaveValue(title);
  await expect(page.locator("#reviewPanel")).toBeVisible();
  await page.locator("#workspaceBtn").click();
  await expect(page.locator("#workspaceDialog")).toBeVisible();
  await expect(page.locator(".workspaceRow.active")).toContainText(title);
});

test(`${lens} portable bundle restores losslessly and corrupted bundles fail closed`, async ({ page }, testInfo) => {
  await useEnglish(page);
  await createSavedWorkspace(page, lens);
  await page.locator("#workspaceBtn").click();
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.locator("#workspaceExport").click(),
  ]);
  const bundlePath = testInfo.outputPath("workspace-bundle.json");
  await download.saveAs(bundlePath);
  const bundle = JSON.parse(await fs.readFile(bundlePath, "utf8"));
  expect(bundle.artifact).toBe("jarbou3i-workspace-bundle");
  expect(bundle.artifact_version).toBe(1);
  expect(bundle.semantics).toEqual(expect.objectContaining({ local_first: true, canonical_transport: false, collaboration_state: false }));
  const originalPayload = bundle.workspace.working_draft.canonical_payload;

  await page.evaluate(() => localStorage.removeItem("jarbou3i-model-settings"));
  await clearWorkspaceRecords(page);
  await page.reload();
  await page.locator("#langEn").click();
  await page.locator("#workspaceBtn").click();
  await page.locator("#workspaceImportFile").setInputFiles(bundlePath);
  await expect(page.locator("#workspaceStatus")).toContainText("restored locally");
  await expect(page.locator("#reviewPanel")).toBeVisible();
  const restoredPayload = JSON.parse(await page.locator("#jsonInput").inputValue());
  expect(restoredPayload).toEqual(originalPayload);

  const corruptPath = testInfo.outputPath("workspace-bundle-corrupt.json");
  bundle.workspace.working_draft.canonical_payload.subject.title = "Undetected mutation";
  await fs.writeFile(corruptPath, JSON.stringify(bundle), "utf8");
  await page.locator("#workspaceImportFile").setInputFiles(corruptPath);
  await expect(page.locator("#workspaceStatus")).toHaveClass(/bad/);
  await expect(page.locator("#workspaceStatus")).toContainText(/integrity|checksum/i);
  await expect(page.locator(".workspaceRow")).toHaveCount(1);
});
}

test("guarded reset removes the current workspace", async ({ page }) => {
  await useEnglish(page);
  await createSavedWorkspace(page, "strategic");
  await page.locator("#workspaceBtn").click();
  await page.locator("#workspaceResetCurrent").click();
  await expect(page.locator("#workspaceStatus")).toContainText("Click again");
  await page.locator("#workspaceResetCurrent").click();
  await expect(page.locator("#workspaceStatus")).toContainText("was removed");
  await expect(page.locator(".workspaceRow")).toHaveCount(0);
});

// Separate from the guarded reset above: together they ran close to the test
// timeout on WebKit.
test("full reset clears workspaces and preferences", async ({ page }) => {
  await useEnglish(page);
  await page.locator("#themeBtn").click();
  await createSavedWorkspace(page, "biopolitical");
  await page.locator("#workspaceBtn").click();
  await page.locator("#workspaceResetAll").click();
  await expect(page.locator("#workspaceStatus")).toContainText("Click again");
  await page.locator("#workspaceResetAll").click();
  await expect(page.locator("#workspaceStatus")).toContainText("preferences were removed");
  await expect(page.locator(".workspaceRow")).toHaveCount(0);
  await page.reload();
  await expect(page.locator("#workspaceSaveState"))
  .toHaveAttribute("data-state", "empty");
  await expect(page.locator("#reviewPanel")).toBeHidden();
});
