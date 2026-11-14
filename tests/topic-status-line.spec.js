import { test, expect } from "@playwright/test";

// The first guidance line asks for a topic; once one is typed it stops asking, and asks again if it is cleared.
test("the first guidance line stops asking for a topic once one is typed", async ({ page }) => {
  await page.goto("./");
  await page.locator("#langEn").click();
  const status = page.locator("#topicStatus");
  await expect(status).toContainText("Enter a clear topic");
  await page.locator("#topicInput").fill("Rise of remote work, 2020-2025");
  await expect(status).not.toContainText("Enter a clear topic");
  await page.locator("#langFr").click();
  await expect(status).toHaveText("");
  await page.locator("#topicInput").fill("");
  await expect(status).not.toHaveText("");
});
