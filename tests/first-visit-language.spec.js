import { test, expect } from "@playwright/test";

// A first visit follows the browser's language list; Arabic when it names none we speak.
// The suite itself pins locale "ar" (playwright.config.js), so each case sets its own.
for (const [locale, lang, dir] of [["en-US", "en", "ltr"], ["fr-FR", "fr", "ltr"], ["ar-SA", "ar", "rtl"], ["de-DE", "ar", "rtl"]]) {
  test.describe(`browser language ${locale}`, () => {
    test.use({ locale });
    test(`first visit opens in ${lang}`, async ({ page }) => {
      await page.goto("./");
      await expect(page.locator("html")).toHaveAttribute("lang", lang);
      await expect(page.locator("html")).toHaveAttribute("dir", dir);
    });
  });
}

test.describe("a saved language wins over the browser language", () => {
  test.use({ locale: "en-US" });
  test("choosing Arabic once keeps Arabic on the next visit", async ({ page }) => {
    await page.goto("./");
    await page.locator("#langAr").click();
    await expect(page.locator("html")).toHaveAttribute("lang", "ar");
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("lang", "ar");
  });
});
