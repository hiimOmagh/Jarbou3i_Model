import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

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

  await page.locator('[data-lens="strategic"]').focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.locator('[data-lens="biopolitical"]')).toBeFocused();
  await expect(page.locator('[data-lens="biopolitical"]')).toHaveAttribute(
    "aria-checked",
    "true",
  );

  await page.locator("#loadSampleBtn").click();
  await expect(page.locator('[role="tablist"]')).toBeVisible();
  await expect(page.locator('[role="tab"][aria-selected="true"]')).toHaveCount(
    1,
  );

  const firstTab = page.locator('[data-bio-review="overview"]');
  await firstTab.focus();
  await page.keyboard.press("ArrowDown");
  await expect(page.locator('[data-bio-review="pillars"]')).toBeFocused();
  await expect(page.locator('[data-bio-review="pillars"]')).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(page.locator("#reviewContent")).toHaveAttribute(
    "aria-labelledby",
    "bio-review-tab-pillars",
  );

  const accordion = page.locator('[data-bio-acc="question_context"]');
  await expect(accordion).toHaveAttribute("aria-expanded", "false");
  await accordion.click();
  await expect(accordion).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#bio-acc-panel-question_context")).toBeVisible();

  const previewButton = page.locator("#previewPromptBtn");
  await previewButton.click();
  await expect(page.locator(".modal")).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(previewButton).toBeFocused();

  await page.locator("#workspaceBtn").click();
  await page.locator(".workspaceRow.active [data-workspace-edit]").click();
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
  await expect(page.locator("#workspaceBtn")).toBeFocused();

  await expectNoSeriousViolations(page);
});
