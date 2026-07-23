import { test, expect } from "@playwright/test";
import fs from "node:fs/promises";

async function useEnglish(page) {
  await page.goto("/");
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

for (const lens of ["strategic", "biopolitical"]) {
test(`${lens} IndexedDB workspace survives reload and reopens a verified draft`, async ({ page }) => {
  await useEnglish(page);
  await createSavedWorkspace(page, lens);
  const title = await page.locator("#topicInput").inputValue();
  const stored = await page.evaluate(async () => {
    const request = indexedDB.open("jarbou3i-model-workspaces");
    const database = await new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    const tx = database.transaction("workspaces", "readonly");
    const countRequest = tx.objectStore("workspaces").count();
    return new Promise((resolve, reject) => {
      countRequest.onsuccess = () => resolve(countRequest.result);
      countRequest.onerror = () => reject(countRequest.error);
    });
  });
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

  await page.evaluate(async () => {
    localStorage.removeItem("jarbou3i-model-settings");
    const request = indexedDB.open("jarbou3i-model-workspaces");
    const database = await new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    const tx = database.transaction("workspaces", "readwrite");
    tx.objectStore("workspaces").clear();
    await new Promise((resolve, reject) => {
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });
  });
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

test("guarded reset removes the current workspace and full reset clears preferences", async ({ page }) => {
  await useEnglish(page);
  await createSavedWorkspace(page, "strategic");
  await page.locator("#workspaceBtn").click();
  await page.locator("#workspaceResetCurrent").click();
  await expect(page.locator("#workspaceStatus")).toContainText("Click again");
  await page.locator("#workspaceResetCurrent").click();
  await expect(page.locator("#workspaceStatus")).toContainText("was removed");
  await expect(page.locator(".workspaceRow")).toHaveCount(0);

  await page.locator("#workspaceClose").click();
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
