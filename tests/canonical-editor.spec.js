import { test, expect } from "@playwright/test";

test.describe("Structured canonical editor", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => new Promise((resolve) => {
      const request = indexedDB.deleteDatabase("jarbou3i-model-workspaces");
      request.onsuccess = request.onerror = request.onblocked = () => resolve();
    }));
    await page.reload();
    await page.locator("#langEn").click();
    await page.locator("#loadSampleBtn").click();
  });

  test("edits, validates, undoes, persists and reopens a draft", async ({ page }) => {
    await page.locator("#workspaceBtn").click();
    await page.getByRole("button", { name: "Edit draft" }).click();
    await expect(page.locator("#editorDialog")).toBeVisible();
    await page.locator('[data-editor-path="/subject"]').click();
    const field = page.locator("#editorField");
    const subject = JSON.parse(await field.inputValue());
    subject.title = "Editor persistence proof";
    await field.fill(JSON.stringify(subject, null, 2));
    await field.press("Control+Enter");
    await expect(page.locator("#editorDirty")).toContainText("Unsaved");
    await expect(page.locator("#editorUndo")).toBeEnabled();
    await page.locator("#editorUndo").click();
    await expect(page.locator("#editorRedo")).toBeEnabled();
    await page.locator("#editorRedo").click();
    await expect.poll(async () => JSON.parse(await field.inputValue()).title).toBe("Editor persistence proof");
    await page.locator("#editorSave").click();
    await expect(page.locator("#editorDirty")).toContainText("No unsaved");
    await page.locator("#editorClose").click();
    await page.reload();
    await expect(page.locator("#topicInput")).toHaveValue("Editor persistence proof");
  });

  test("rejects malformed field JSON without mutating the draft", async ({ page }) => {
    await page.locator("#workspaceBtn").click();
    await page.getByRole("button", { name: "Edit draft" }).click();
    await page.locator('[data-editor-path="/subject"]').click();
    await page.locator("#editorField").fill("{");
    await page.locator("#editorField").press("Control+Enter");
    await expect(page.locator("#editorFieldStatus")).toHaveClass(/bad/);
    await expect(page.locator("#editorSave")).toBeDisabled();
  });
});
