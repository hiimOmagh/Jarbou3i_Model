import { test, expect } from "@playwright/test";
import { shortTextKeys } from "../src/core/short-text.js";

async function pressTextStyle(page) {
  const button = page.locator("#textStyleBtn");
  if (!(await button.isVisible())) await page.locator("#displayMenuBtn").click();
  await button.click();
}

test.describe("Short text", () => {
  test("has the same keys in Arabic, English and French", () => {
    const keys = shortTextKeys();
    expect(keys.en.length).toBeGreaterThan(0);
    expect(keys.ar).toEqual(keys.en);
    expect(keys.fr).toEqual(keys.en);
  });

  test("shortens the wording on screen, stays after reload, and goes back", async ({ page }) => {
    await page.goto("./");
    await page.locator("#langEn").click();
    const subtitle = page.locator('[data-i18n="appSubtitle"]');
    const full = (await subtitle.first().textContent()) || "";
    await pressTextStyle(page);
    await expect(page.locator("#textStyleBtn")).toHaveAttribute("aria-pressed", "true");
    const short = (await subtitle.first().textContent()) || "";
    expect(short).not.toBe(full);
    await page.reload();
    await page.locator("#langEn").click();
    await expect(page.locator("#textStyleBtn")).toHaveAttribute("aria-pressed", "true");
    await pressTextStyle(page);
    await expect(subtitle.first()).toHaveText(full);
  });
});
