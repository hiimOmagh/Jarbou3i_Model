import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { openStep } from "./helpers/guided-flow.js";

async function expectNoSeriousViolations(page) {
  const results = await new AxeBuilder({ page }).analyze();
  const serious = results.violations.filter((violation) =>
    ["serious", "critical"].includes(violation.impact),
  );
  expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
}

test("runtime accessibility and keyboard contract", async ({ page }) => {
  await page.goto("./");
  await expect(page.locator("html")).toHaveAttribute("lang", /^(ar|en|fr)$/);
  await expect(page.locator("#toast")).toHaveAttribute("role", "status");
  await expect(page.locator("#modalBackdrop")).toHaveAttribute(
    "aria-hidden",
    "true",
  );
  await expectNoSeriousViolations(page);

  await page.locator("#langAr").focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.locator("#langEn")).toBeFocused();
  await expect(page.locator("#langEn")).toHaveAttribute("aria-checked", "true");

  await openStep(page, "lens");
  await page.locator('[data-lens="strategic"]').focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.locator('[data-lens="biopolitical"]')).toBeFocused();
  await expect(page.locator('[data-lens="biopolitical"]')).toHaveAttribute(
    "aria-checked",
    "true",
  );

  await page.locator("#loadSampleBtn").click();
  // The review is one document, the case file: its outline marks where the
  // reader is and jumps to a section from the keyboard.
  await expect(page.locator("nav#reviewNav")).toBeVisible();
  await expect(page.locator('#reviewNav [aria-current="location"]')).toHaveCount(1);

  const pillarsEntry = page.locator('[data-bio-review="pillars"]');
  await pillarsEntry.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#case-pillars")).toBeFocused();
  await expect(pillarsEntry).toHaveAttribute("aria-current", "location");
  await expect(page.locator("#case-pillars")).toHaveAttribute("aria-label", /\S/);

  const accordion = page.locator('[data-bio-acc="question_context"]');
  await expect(accordion).toHaveAttribute("aria-expanded", "false");
  await accordion.click();
  await expect(accordion).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#bio-acc-panel-question_context")).toBeVisible();

  await openStep(page, "prompt");
  const previewButton = page.locator("#previewPromptBtn");
  await previewButton.click();
  await expect(page.locator(".modal")).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(previewButton).toBeFocused();

  await page.locator("#workspaceSaveState").click();
  await page.locator("#workLife [data-life-action=\"edit\"]").click();
  await page.locator('[data-editor-path="/subject"]').click();
  const field = page.locator("#editorField");
  const subject = JSON.parse(await field.inputValue());
  subject.title = `${subject.title} accessibility resolution`;
  await field.fill(JSON.stringify(subject));
  await field.press("Control+Enter");
  await page.locator("#editorSave").click();
  const resolutionButton = page.locator("#editorResolve");
  await resolutionButton.click();
  await expect(page.locator("#resolutionDialog")).toBeFocused();
  await expectNoSeriousViolations(page);
  await page.keyboard.press("Escape");
  await expect(page.locator("#workspaceSaveState")).toBeFocused();

  await expectNoSeriousViolations(page);
});
