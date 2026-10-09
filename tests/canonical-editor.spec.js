import { test, expect } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";
import { clearWorkspaceStorage } from "./helpers/browser-persistence.js";

test.describe("Structured canonical editor", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("./");
    await clearWorkspaceStorage(page);
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

  test("saves an edit to a Strategic answer imported as a draft", async ({ page }) => {
    const draft = JSON.parse(await fs.readFile(path.join(process.cwd(), "fixtures", "sample-analysis-en.json"), "utf8"));
    delete draft.evidence.items[0].source_type;
    await page.locator("#jsonInput").fill(JSON.stringify(draft));
    await page.locator("#importBtn").click();
    await expect(page.locator("#jsonStatus")).toContainText(/draft/i);

    await page.locator("#workspaceBtn").click();
    await page.locator(".workspaceRow.active").getByRole("button", { name: "Edit draft" }).click();
    await page.locator('[data-editor-path="/subject"]').click();
    const field = page.locator("#editorField");
    const subject = JSON.parse(await field.inputValue());
    subject.title = "Draft edit proof";
    await field.fill(JSON.stringify(subject, null, 2));
    await field.press("Control+Enter");
    await expect(page.locator("#editorSave")).toBeEnabled();
    await page.locator("#editorSave").click();
    await expect(page.locator("#editorDirty")).toContainText("No unsaved");
  });

  test("a save that fails is said inside the editor", async ({ page }) => {
    await page.locator("#workspaceBtn").click();
    await page.getByRole("button", { name: "Edit draft" }).click();
    await page.locator('[data-editor-path="/subject"]').click();
    const field = page.locator("#editorField");
    const subject = JSON.parse(await field.inputValue());
    subject.title = "Edit that cannot be saved";
    await field.fill(JSON.stringify(subject, null, 2));
    await field.press("Control+Enter");
    await page.evaluate(() => {
      const put = IDBObjectStore.prototype.put;
      IDBObjectStore.prototype.put = function (...args) {
        if (this.name === "workspaces") throw new DOMException("Storage is full", "QuotaExceededError");
        return put.apply(this, args);
      };
    });
    await page.locator("#editorSave").click();
    await expect(page.locator("#editorFieldStatus")).toHaveClass(/bad/);
    await expect(page.locator("#editorFieldStatus")).not.toContainText("validation passed");
    await expect(page.locator("#editorDirty")).toContainText("Unsaved");
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
    let asked = "";
    page.once("dialog", async (dialog) => {
      asked = dialog.message();
      await dialog.dismiss();
    });
    await field.press("Escape");
    await expect.poll(() => asked).toMatch(/discard.*\?$/);
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

  test("does not save an edit that turns a complete Strategic analysis into a draft", async ({ page }) => {
    await page.locator("#workspaceBtn").click();
    await page.getByRole("button", { name: "Edit draft" }).click();
    const field = page.locator("#editorField");
    await page.locator('[data-editor-path="/links"]').click();
    const links = JSON.parse(await field.inputValue());
    const target = links[0].to;
    links[0].to = "ZZ9";
    await field.fill(JSON.stringify(links, null, 2));
    await field.press("Control+Enter");
    await expect(page.locator("#editorSave")).toBeDisabled();
    await expect(page.locator("#editorResolve")).toBeDisabled();

    links[0].to = target;
    await field.fill(JSON.stringify(links, null, 2));
    await field.press("Control+Enter");
    await page.locator('[data-editor-path="/evidence"]').click();
    const evidence = JSON.parse(await field.inputValue());
    delete evidence.items[0].source_type;
    await field.fill(JSON.stringify(evidence, null, 2));
    await field.press("Control+Enter");
    await expect(page.locator("#editorSave")).toBeDisabled();
    await expect(page.locator("#editorResolve")).toBeDisabled();
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

  test("a restored edit that was never applied can be saved", async ({ page }) => {
    await page.locator("#workspaceBtn").click();
    await page.getByRole("button", { name: "Edit draft" }).click();
    await page.locator('[data-editor-path="/subject"]').click();
    const field = page.locator("#editorField");
    const subject = JSON.parse(await field.inputValue());
    subject.title = "Typed before the crash";
    await field.fill(JSON.stringify(subject, null, 2));
    await page.waitForTimeout(700);

    page.once("dialog", async (dialog) => dialog.accept());
    await page.reload();
    await page.locator("#workspaceBtn").click();
    await page.getByRole("button", { name: "Edit draft" }).click();
    await page.locator("#editorRecoveryRestore").click();
    await expect.poll(async () => JSON.parse(await field.inputValue()).title).toBe("Typed before the crash");
    await expect(page.locator("#editorDirty")).toContainText("Unsaved");
    await expect(page.locator("#editorSave")).toBeEnabled();
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

  test("does not offer recovery for edits saved before the recovery capture fires", async ({ page }) => {
    await page.locator("#workspaceBtn").click();
    await page.getByRole("button", { name: "Edit draft" }).click();
    await page.locator('[data-editor-path="/subject"]').click();
    const field = page.locator("#editorField");
    const subject = JSON.parse(await field.inputValue());
    subject.title = "Saved before capture";
    await field.fill(JSON.stringify(subject, null, 2));
    await field.press("Control+Enter");
    await page.locator("#editorSave").click();
    await expect(page.locator("#editorDirty")).toContainText("No unsaved");
    await page.waitForTimeout(700);
    await page.locator("#editorClose").click();

    await page.reload();
    await page.locator("#workspaceBtn").click();
    await page.getByRole("button", { name: "Edit draft" }).click();
    await expect(page.locator("#editorDialog")).toBeVisible();
    await expect(page.locator("#editorRecovery")).toBeHidden();
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
