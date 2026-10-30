import { test, expect } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";
import { clearWorkspaceStorage, countRecoverySnapshots, restoreSavedDraft } from "./helpers/browser-persistence.js";
import { expectKernel } from "./helpers/kernel-check.js";

test.describe("Structured canonical editor", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("./");
    await clearWorkspaceStorage(page);
    await page.reload();
    await page.locator("#langEn").click();
    await page.locator("#loadSampleBtn").click();
  });

  test("edits, validates, undoes, persists and reopens a draft", async ({ page }) => {
    await page.locator("#workspaceSaveState").click();
    await page.getByRole("button", { name: "Edit draft" }).click();
    await expect(page.locator("#editorDialog")).toBeVisible();
    // From the keyboard: a section keeps focus as the list redraws, and a
    // button disabled by its own action hands focus to the dialog.
    const section = page.locator('[data-editor-path="/subject"]');
    await section.focus();
    await page.keyboard.press("Enter");
    await expect(section).toHaveAttribute("aria-current", "true");
    await expect(section).toBeFocused();
    const field = page.locator("#editorField");
    const subject = JSON.parse(await field.inputValue());
    subject.title = "Editor persistence proof";
    await field.fill(JSON.stringify(subject, null, 2));
    await field.press("Control+Enter");
    await expect(page.locator("#editorDirty")).toContainText("Unsaved");
    await expect(page.locator("#editorUndo")).toBeEnabled();
    await page.locator("#editorUndo").focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("#editorRedo")).toBeEnabled();
    await expect(page.locator("#editorDialog")).toBeFocused();
    await page.locator("#editorRedo").focus();
    await page.keyboard.press("Enter");
    await expect.poll(async () => JSON.parse(await field.inputValue()).title).toBe("Editor persistence proof");
    await expect(page.locator("#editorDialog")).toBeFocused();
    await page.locator("#editorSave").focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("#editorDirty")).toContainText("No unsaved");
    await expect(page.locator("#editorDialog")).toBeFocused();
    await page.locator("#editorClose").click();
    await page.reload();
    await expect(page.locator("#topicInput")).toHaveValue("Editor persistence proof");
  });

  test("saves an edit to a saved Strategic draft", async ({ page }) => {
    const draft = JSON.parse(await fs.readFile(path.join(process.cwd(), "fixtures", "sample-analysis-en.json"), "utf8"));
    delete draft.evidence.items[0].source_type;
    await restoreSavedDraft(page, draft);

    await page.locator("#workLife").getByRole("button", { name: "Edit draft" }).click();
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
    await page.locator("#workspaceSaveState").click();
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
    // Closed while the save is under way: the editor stays open with its message.
    await page.evaluate(() => { document.getElementById("editorSave").click(); document.getElementById("editorClose").click(); });
    await expect(page.locator("#editorFieldStatus")).toHaveAttribute("data-tone", "crit");
    await expect(page.locator("#editorFieldStatus")).not.toContainText("validation passed");
    await expect(page.locator("#editorDirty")).toContainText("Unsaved");
    await expect(page.locator("#editorDialog")).toBeVisible();
  });

  test("closed while a save is under way, the editor saves, then closes, without asking to discard", async ({ page }) => {
    const dialogs = [];
    page.on("dialog", (dialog) => { dialogs.push(dialog.message()); dialog.dismiss(); });
    await page.locator("#workspaceSaveState").click();
    await page.getByRole("button", { name: "Edit draft" }).click();
    await page.locator('[data-editor-path="/subject"]').click();
    const field = page.locator("#editorField");
    const subject = JSON.parse(await field.inputValue());
    subject.title = "Saved while closing";
    await field.fill(JSON.stringify(subject, null, 2));
    await field.press("Control+Enter");
    // Save and Close in one go: Close comes while the save is still writing.
    await page.evaluate(() => { document.getElementById("editorSave").click(); document.getElementById("editorClose").click(); });
    await expect(page.locator("#editorDialog")).toBeHidden();
    expect(dialogs).toEqual([]);
    await page.reload();
    await expect(page.locator("#topicInput")).toHaveValue("Saved while closing");
  });

  test("rejects malformed field JSON without mutating the draft", async ({ page }) => {
    await page.locator("#workspaceSaveState").click();
    await page.getByRole("button", { name: "Edit draft" }).click();
    await page.locator('[data-editor-path="/subject"]').click();
    await page.locator("#editorField").fill("{");
    await page.locator("#editorField").press("Control+Enter");
    await expect(page.locator("#editorFieldStatus")).toHaveAttribute("data-tone", "crit");
    await expect(page.locator("#editorSave")).toBeDisabled();
  });

  test("treats focused textarea input as unsaved and never loses it on Escape", async ({ page }) => {
    await page.locator("#workspaceSaveState").click();
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
    await page.locator("#workspaceSaveState").click();
    await page.getByRole("button", { name: "Edit draft" }).click();
    await page.locator('[data-editor-path="/subject"]').click();
    const field = page.locator("#editorField");
    const subject = JSON.parse(await field.inputValue());
    subject.title = "Section transition proof";
    await field.fill(JSON.stringify(subject, null, 2));
    // From the keyboard: applying the edit redraws the sections first, and
    // focus still lands on the section picked.
    const actors = page.locator('[data-editor-path="/actors"]');
    await actors.focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("#editorPath")).toHaveText("/actors");
    await expect(actors).toBeFocused();
    await expect(page.locator("#editorDirty")).toContainText("Unsaved");
    await page.locator('[data-editor-path="/subject"]').click();
    await expect.poll(async () => JSON.parse(await field.inputValue()).title).toBe("Section transition proof");
  });

  test("does not save an edit that turns a complete Strategic analysis into a draft", async ({ page }) => {
    await page.locator("#workspaceSaveState").click();
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
    await page.locator("#workspaceSaveState").click();
    await page.getByRole("button", { name: "Edit draft" }).click();
    await page.locator('[data-editor-path="/actors"]').click();
    const field = page.locator("#editorField");
    const actors = JSON.parse(await field.inputValue());
    const originalFinancial = actors[0].financial;
    actors[0].financial = 99;
    await field.fill(JSON.stringify(actors, null, 2));
    await field.press("Control+Enter");
    await expect(page.locator("#editorFieldStatus")).toHaveAttribute("data-tone", "crit");
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
    await expect(page.locator("#editorFieldStatus")).toHaveAttribute("data-tone", "crit");
    await expect(page.locator("#editorSave")).toBeDisabled();
    await expect(page.locator("#editorResolve")).toBeDisabled();
  });

  test("a restored edit that was never applied can be saved", async ({ page }) => {
    await page.locator("#workspaceSaveState").click();
    await page.getByRole("button", { name: "Edit draft" }).click();
    await page.locator('[data-editor-path="/subject"]').click();
    const field = page.locator("#editorField");
    const subject = JSON.parse(await field.inputValue());
    subject.title = "Typed before the crash";
    await field.fill(JSON.stringify(subject, null, 2));
    await expect.poll(() => countRecoverySnapshots(page)).toBe(1);

    page.once("dialog", async (dialog) => dialog.accept());
    await page.reload();
    await page.locator("#workspaceSaveState").click();
    await page.getByRole("button", { name: "Edit draft" }).click();
    await page.locator("#editorRecoveryRestore").click();
    await expect.poll(async () => JSON.parse(await field.inputValue()).title).toBe("Typed before the crash");
    await expect(page.locator("#editorDirty")).toContainText("Unsaved");
    await expect(page.locator("#editorSave")).toBeEnabled();
  });

  test("restores a revision-anchored snapshot after an interrupted editor session", async ({ page }) => {
    await page.locator("#workspaceSaveState").click();
    await page.getByRole("button", { name: "Edit draft" }).click();
    await page.locator('[data-editor-path="/subject"]').click();
    const field = page.locator("#editorField");
    const subject = JSON.parse(await field.inputValue());
    subject.title = "Crash recovery proof";
    await field.fill(JSON.stringify(subject, null, 2));
    await field.press("Control+Enter");
    await expect(page.locator("#editorDirty")).toContainText("Unsaved");
    await expect.poll(() => countRecoverySnapshots(page)).toBe(1);

    page.once("dialog", async (dialog) => dialog.accept());
    await page.reload();
    await page.locator("#workspaceSaveState").click();
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
    await page.locator("#workspaceSaveState").click();
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
    await page.locator("#workspaceSaveState").click();
    await page.getByRole("button", { name: "Edit draft" }).click();
    await expect(page.locator("#editorDialog")).toBeVisible();
    await expect(page.locator("#editorRecovery")).toBeHidden();
  });

  test("preserves incomplete field JSON without mutating canonical history", async ({ page }) => {
    await page.locator("#workspaceSaveState").click();
    await page.getByRole("button", { name: "Edit draft" }).click();
    await page.locator('[data-editor-path="/subject"]').click();
    const field = page.locator("#editorField");
    await field.fill('{"title":"Interrupted');
    await expect.poll(() => countRecoverySnapshots(page)).toBe(1);

    page.once("dialog", async (dialog) => dialog.accept());
    await page.reload();
    await page.locator("#workspaceSaveState").click();
    await page.getByRole("button", { name: "Edit draft" }).click();
    await page.locator("#editorRecoveryRestore").click();
    await expect(field).toHaveValue('{"title":"Interrupted');
    await field.press("Control+Enter");
    await expect(page.locator("#editorFieldStatus")).toHaveAttribute("data-tone", "crit");
    await expect(page.locator("#editorSave")).toBeDisabled();
  });

  test("speaks the page language, opens on the content and marks what needs fixing", async ({ page }) => {
    await page.locator("#langAr").click();
    await page.locator("#workspaceSaveState").click();
    await page.locator("#workLife").getByRole("button", { name: "تعديل المسودة" }).click();
    await expect(page.locator("#editorTitle")).toHaveText("محرر التحليل");
    await expect(page.locator("#editorResolve")).toHaveText("مراجعة واعتماد");
    await expect(page.locator("#editorSections")).toHaveAttribute("aria-label", "أقسام التحليل");
    await expect(page.locator("#editorClose")).toHaveAttribute("aria-label", "إغلاق المحرر");
    // Content first; identity and metadata after it.
    await expect(page.locator("#editorPath")).toHaveText("/subject");
    await expect(page.locator("#editorSections").getByRole("group", { name: "الهوية والبيانات الوصفية" })).toBeVisible();
    const field = page.locator("#editorField");
    await field.fill("{}");
    await field.press("Control+Enter");
    await expect(page.locator("#editorFieldStatus")).toHaveAttribute("data-tone", "crit");
    await expect(field).toHaveAttribute("aria-invalid", "true");
    await expect(page.locator('[data-editor-path="/subject"] .j-chip')).toContainText("للإصلاح");
    await expectKernel(page, "#editorBackdrop", "#editorDialog");
  });

  test("puts each Biopolitical section under the pillar the case file shows it in", async ({ page }) => {
    await page.locator('[data-flow-step="lens"]').click();
    await page.locator('[data-lens="biopolitical"]').click();
    await page.locator("#loadSampleBtn").click();
    await page.locator("#workspaceSaveState").click();
    await page.locator("#workLife").getByRole("button", { name: "Edit draft" }).click();
    const groups = page.locator("#editorSections [role=group]");
    await expect(groups.locator(":scope > .j-label")).toHaveText([
      "Question & context", "Human functions", "Actors & populations", "Mechanisms & infrastructure",
      "Meaning & classification", "Intervention & capture test", "Distribution & effects",
      "Evidence & explanations", "Agency & alternatives", "Connections", "Judgment", "Identity and metadata",
    ]);
    const sections = (name) => page.locator("#editorSections").getByRole("group", { name, exact: true }).locator("[data-editor-path]");
    await expect(sections("Question & context")).toHaveText(["Subject", "Framing", "Legal framework", "International comparison", "Capture levels", "Theoretical comparison", "Migration"]);
    await expect(sections("Intervention & capture test")).toHaveText(["Intervention assessment", "Consent and exit"]);
    await expect(sections("Judgment")).toHaveText(["Calibrated conclusion", "Self-audit", "Self-audit notes"]);
    // Every section sits in one group, and the editor still opens on the first.
    await expect(groups.locator("[data-editor-path]")).toHaveCount(await page.locator("#editorSections [data-editor-path]").count());
    await expect(page.locator("#editorPath")).toHaveText("/subject");
    await expectKernel(page, "#editorBackdrop", "#editorDialog");
  });
});
