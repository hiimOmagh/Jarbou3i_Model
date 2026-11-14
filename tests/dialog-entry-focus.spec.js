import { test, expect } from "@playwright/test";
import { openStep } from "./helpers/guided-flow.js";

async function expectEntryWrap(page, id) {
  const dialog = page.locator(`#${id}[role="dialog"]`);
  await expect(dialog).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect.poll(() => dialog.evaluate(el => el.contains(document.activeElement))).toBe(true);
  // Forward Tab wraps back to the first control after the entry wraps to last.
  await page.keyboard.press("Tab");
  await expect.poll(() => dialog.evaluate(el => el.contains(document.activeElement))).toBe(true);
}

test.beforeEach(async ({ page }) => {
  await page.goto("./");
  await page.locator("#langEn").click();
});

test("Workspaces traps Shift+Tab from its initial container focus", async ({ page }) => {
  await page.locator("#workspaceSaveState").click();
  await expectEntryWrap(page, "workspaceDialog");
});

test("prompt preview traps Shift+Tab from its initial container focus", async ({ page }) => {
  await page.locator("#loadSampleBtn").click();
  await openStep(page, "prompt");
  await page.locator("#previewPromptBtn").click();
  await expectEntryWrap(page, "modalDialog");
});

test("Ledger traps Shift+Tab from its initial container focus", async ({ page }) => {
  await page.locator("#loadSampleBtn").click();
  await page.locator('[data-review="inspection"]').click();
  await page.locator("[data-evidence-intelligence] > summary").click();
  await page.locator("#openReviewLedger").click();
  await expectEntryWrap(page, "ledgerDialog");
});

test("Revision traps Shift+Tab from its initial container focus", async ({ page }) => {
  await page.locator("#loadSampleBtn").click();
  await page.locator("#workspaceSaveState").click();
  await page.getByRole("button", { name: "Revision history" }).click();
  await expectEntryWrap(page, "revisionDialog");
});

test("Resolution traps Shift+Tab from its initial container focus", async ({ page }) => {
  await page.locator("#loadSampleBtn").click();
  await page.locator("#workspaceSaveState").click();
  await page.getByRole("button", { name: "Edit draft" }).click();
  await page.locator('[data-editor-path="/subject"]').click();
  const field = page.locator("#editorField");
  const subject = JSON.parse(await field.inputValue());
  subject.title = "Focus trap regression";
  await field.fill(JSON.stringify(subject));
  await field.press("Control+Enter");
  await page.locator("#editorSave").click();
  await page.locator("#editorResolve").click();
  await expectEntryWrap(page, "resolutionDialog");
});
