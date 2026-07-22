import { test, expect } from "@playwright/test";

async function start(page, lens = "strategic") {
  await page.goto("/");
  await page.evaluate(() => new Promise((resolve) => {
    const request = indexedDB.deleteDatabase("jarbou3i-model-workspaces");
    request.onsuccess = request.onerror = request.onblocked = () => resolve();
  }));
  await page.reload();
  await page.locator("#langEn").click();
  if (lens === "biopolitical") await page.locator('[data-lens="biopolitical"]').click();
  await page.locator("#loadSampleBtn").click();
  await page.locator("#workspaceBtn").click();
  await page.getByRole("button", { name: "Edit draft" }).click();
  await page.locator('[data-editor-path="/subject"]').click();
}

async function saveTitle(page, title) {
  const field = page.locator("#editorField");
  const subject = JSON.parse(await field.inputValue());
  subject.title = title;
  await field.fill(JSON.stringify(subject, null, 2));
  await field.press("Control+Enter");
  await expect(page.locator("#editorSave")).toBeEnabled();
  await page.locator("#editorSave").click();
  await expect(page.locator("#editorResolve")).toBeEnabled();
}

async function approve(page, rationale) {
  await expect(page.locator("#resolutionDialog")).toBeVisible();
  await expect(page.locator("#resolutionTrust")).toContainText(/never rewrites/i);
  await expect(page.locator("#resolutionDiff")).toContainText("/subject/title");
  await expect(page.locator("#resolutionCommit")).toBeDisabled();
  await page.locator("#resolutionReviewer").fill("Resolution Reviewer");
  await page.locator("#resolutionRationale").fill(rationale);
  await expect(page.locator("#resolutionCommit")).toBeDisabled();
  await page.locator("#resolutionConfirm").check();
  await expect(page.locator("#resolutionCommit")).toBeEnabled();
  await page.locator("#resolutionCommit").click();
  await expect(page.locator("#resolutionBackdrop")).not.toHaveClass(/show/);
  await expect(page.locator("#workspaceSaveState")).toHaveText("Saved locally");
}

test.describe("Resolution transactions", () => {
  test("reviews an exact Strategic diff and commits an immutable child revision", async ({ page }) => {
    await start(page, "strategic");
    await saveTitle(page, "Committed strategic resolution");
    await page.locator("#editorResolve").click();
    await approve(page, "Approved after reviewing the exact Strategic subject diff.");
    await expect(page.locator("#topicInput")).toHaveValue("Committed strategic resolution");
    const stored = await page.evaluate(async () => {
      const request = indexedDB.open("jarbou3i-model-workspaces", 1);
      const database = await new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
      const tx = database.transaction("workspaces", "readonly");
      const get = tx.objectStore("workspaces").getAll();
      return new Promise((resolve, reject) => {
        get.onsuccess = () => resolve(get.result[0]);
        get.onerror = () => reject(get.error);
      });
    });
    expect(stored.revisions).toHaveLength(2);
    expect(stored.revisions[0].kind).toBe("imported_canonical");
    expect(stored.revisions[1].kind).toBe("committed_resolution");
    expect(stored.revisions[1].parent_revision_id).toBe(stored.revisions[0].revision_id);
    expect(stored.resolution_ledger.records).toHaveLength(1);
    expect(stored.working_draft.dirty).toBe(false);
    await page.reload();
    await expect(page.locator("#topicInput")).toHaveValue("Committed strategic resolution");
  });

  test("commits a Biopolitical draft from the verified workspace manager", async ({ page }) => {
    await start(page, "biopolitical");
    await saveTitle(page, "Committed biopolitical resolution");
    await page.locator("#editorClose").click();
    await page.locator("#workspaceBtn").click();
    await expect(page.locator(".workspaceRow.active")).toContainText("verified");
    await page.getByRole("button", { name: "Commit immutable revision" }).click();
    await approve(page, "Approved after full Biopolitical contract validation and exact diff review.");
    await expect(page.locator("#topicInput")).toHaveValue("Committed biopolitical resolution");
    await page.locator("#workspaceBtn").click();
    await expect(page.getByRole("button", { name: "Commit immutable revision" })).toHaveCount(0);
  });
});
