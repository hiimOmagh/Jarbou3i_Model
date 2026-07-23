import { test, expect } from "@playwright/test";

test.describe("Structured canonical editor", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("./");
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

  test("treats focused textarea input as unsaved and never loses it on Escape", async ({ page }) => {
    await page.locator("#workspaceBtn").click();
    await page.getByRole("button", { name: "Edit draft" }).click();
    await page.locator('[data-editor-path="/subject"]').click();
    const field = page.locator("#editorField");
    const subject = JSON.parse(await field.inputValue());
    subject.title = "Pending input must survive";
    await field.fill(JSON.stringify(subject, null, 2));
    page.once("dialog", async (dialog) => dialog.dismiss());
    await field.press("Escape");
    await expect(page.locator("#editorDialog")).toBeVisible();
    await expect.poll(async () => JSON.parse(await field.inputValue()).title).toBe("Pending input must survive");
  });

  test("applies the current field before switching canonical sections", async ({ page }) => {
    await page.locator("#workspaceBtn").click();
    await page.getByRole("button", { name: "Edit draft" }).click();
    await page.locator('[data-editor-path="/subject"]').click();
    const field = page.locator("#editorField");
    const subject = JSON.parse(await field.inputValue());
    subject.title = "Section transition proof";
    await field.fill(JSON.stringify(subject, null, 2));
    await page.locator('[data-editor-path="/actors"]').click();
    await expect(page.locator("#editorPath")).toHaveText("/actors");
    await expect(page.locator("#editorDirty")).toContainText("Unsaved");
    await page.locator('[data-editor-path="/subject"]').click();
    await expect.poll(async () => JSON.parse(await field.inputValue()).title).toBe("Section transition proof");
  });

  test("blocks malformed strategic values from immutable resolution", async ({ page }) => {
    await page.locator("#workspaceBtn").click();
    await page.getByRole("button", { name: "Edit draft" }).click();
    await page.locator('[data-editor-path="/actors"]').click();
    const field = page.locator("#editorField");
    const actors = JSON.parse(await field.inputValue());
    const originalFinancial = actors[0].financial;
    actors[0].financial = 99;
    await field.fill(JSON.stringify(actors, null, 2));
    await field.press("Control+Enter");
    await expect(page.locator("#editorFieldStatus")).toHaveClass(/bad/);
    await expect(page.locator("#editorSave")).toBeDisabled();
    await expect(page.locator("#editorResolve")).toBeDisabled();

    actors[0].financial = originalFinancial;
    await field.fill(JSON.stringify(actors, null, 2));
    await field.press("Control+Enter");
    await page.locator('[data-editor-path="/evidence"]').click();
    const evidence = JSON.parse(await field.inputValue());
    evidence.items[0].source_url = "javascript:alert(1)";
    await field.fill(JSON.stringify(evidence, null, 2));
    await field.press("Control+Enter");
    await expect(page.locator("#editorFieldStatus")).toHaveClass(/bad/);
    await expect(page.locator("#editorSave")).toBeDisabled();
    await expect(page.locator("#editorResolve")).toBeDisabled();
  });

  test("restores a revision-anchored snapshot after an interrupted editor session", async ({ page }) => {
    await page.locator("#workspaceBtn").click();
    await page.getByRole("button", { name: "Edit draft" }).click();
    await page.locator('[data-editor-path="/subject"]').click();
    const field = page.locator("#editorField");
    const subject = JSON.parse(await field.inputValue());
    subject.title = "Crash recovery proof";
    await field.fill(JSON.stringify(subject, null, 2));
    await field.press("Control+Enter");
    await expect(page.locator("#editorDirty")).toContainText("Unsaved");
    await page.waitForTimeout(700);

    page.once("dialog", async (dialog) => dialog.accept());
    await page.reload();
    await page.locator("#workspaceBtn").click();
    await page.getByRole("button", { name: "Edit draft" }).click();
    await expect(page.locator("#editorRecovery")).toBeVisible();
    await page.locator("#editorRecoveryRestore").click();
    await expect.poll(async () => JSON.parse(await field.inputValue()).title).toBe("Crash recovery proof");
    await expect(page.locator("#editorDirty")).toContainText("Unsaved");
    await page.locator("#editorSave").click();
    await expect(page.locator("#editorDirty")).toContainText("No unsaved");
    await page.locator("#editorClose").click();
    await page.reload();
    await expect(page.locator("#topicInput")).toHaveValue("Crash recovery proof");
  });

  test("preserves incomplete field JSON without mutating canonical history", async ({ page }) => {
    await page.locator("#workspaceBtn").click();
    await page.getByRole("button", { name: "Edit draft" }).click();
    await page.locator('[data-editor-path="/subject"]').click();
    const field = page.locator("#editorField");
    await field.fill('{"title":"Interrupted');
    await page.waitForTimeout(700);

    page.once("dialog", async (dialog) => dialog.accept());
    await page.reload();
    await page.locator("#workspaceBtn").click();
    await page.getByRole("button", { name: "Edit draft" }).click();
    await page.locator("#editorRecoveryRestore").click();
    await expect(field).toHaveValue('{"title":"Interrupted');
    await field.press("Control+Enter");
    await expect(page.locator("#editorFieldStatus")).toHaveClass(/bad/);
    await expect(page.locator("#editorSave")).toBeDisabled();
  });
});
