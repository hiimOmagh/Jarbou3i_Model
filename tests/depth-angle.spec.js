import { test, expect } from "@playwright/test";

// Expert and Research ask what the topic takes for granted; Focused stays compact.
async function copiedPrompt(page, lens, mode) {
  await page.addInitScript(() => {
    window.__copied = "";
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: async (text) => { window.__copied = text; } },
    });
  });
  await page.goto("./");
  await page.locator("#langEn").click();
  await page.locator("#topicInput").fill("A topic to test");
  await page.locator('[data-flow-step="lens"]').click();
  await page.locator(`#analysisLens [data-lens="${lens}"]`).click();
  await page.locator('[data-flow-step="settings"]').click();
  await page.locator("#promptMode").selectOption(mode);
  await page.locator('[data-flow-step="prompt"]').click();
  await page.locator("#copyPromptBtn").click();
  await expect.poll(() => page.evaluate(() => window.__copied)).not.toBe("");
  return page.evaluate(() => window.__copied);
}

for (const lens of ["strategic", "biopolitical"]) {
  test.describe(`${lens} depth angle`, () => {
    for (const mode of ["expert", "research"]) {
      test(`${mode} asks what the topic takes for granted`, async ({ page }) => {
        expect(await copiedPrompt(page, lens, mode)).toContain("what the topic takes for granted");
      });
    }
    test("focused stays compact", async ({ page }) => {
      expect(await copiedPrompt(page, lens, "simple")).not.toContain("what the topic takes for granted");
    });
  });
}
