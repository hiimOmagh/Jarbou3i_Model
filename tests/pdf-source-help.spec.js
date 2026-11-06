import { test, expect } from "@playwright/test";

// A PDF is attached in the AI chat, not read here: the sources box says so in each language.
for (const [lang, button] of [["en", "#langEn"], ["fr", "#langFr"], ["ar", "#langAr"]]) {
  test(`the sources box tells how to use a PDF (${lang})`, async ({ page }) => {
    await page.goto("./");
    await page.locator(button).click();
    await page.locator("#topicInput").fill("A topic to test");
    await page.locator('[data-flow-step="settings"]').click();
    await page.locator("#evidenceAccess").selectOption("provided");
    await expect(page.locator("#sourcesHelp")).toContainText("PDF");
  });
}
