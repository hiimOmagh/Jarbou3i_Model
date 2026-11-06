import { test, expect } from "@playwright/test";

test.describe("Run the other lens", () => {
  test("keeps the topic and the first result, and opens the other lens's prompt", async ({ page }) => {
    await page.goto("./");
    await page.locator("#langEn").click();
    await page.locator("#topicInput").fill("Who holds the pass in 2020?");
    await page.locator("#loadSampleBtn").click();
    const action = page.locator("[data-other-lens]");
    await expect(action).toBeVisible({ timeout: 15000 });
    await expect(action).toHaveText("Run the Biopolitical lens on this topic");
    await action.click();
    await expect(page.locator('#analysisLens [data-lens="biopolitical"]')).toHaveAttribute("aria-checked", "true");
    await expect(page.locator('[data-flow-panel="prompt"]')).toBeVisible();
    await expect(page.locator("#topicInput")).toHaveValue(/./);
    // The first result is kept: switching back brings it back with the other action.
    await page.locator('[data-flow-step="lens"]').click();
    await page.locator('#analysisLens [data-lens="strategic"]').click();
    await expect(page.locator("[data-other-lens]")).toHaveText("Run the Biopolitical lens on this topic");
  });
});
