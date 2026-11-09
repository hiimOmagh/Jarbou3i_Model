import { test, expect } from "@playwright/test";

test.describe("A toast keeps clear of the return button", () => {
  for (const lang of ["En", "Ar", "Fr"]) {
    test(`on a phone in ${lang}, the toast stands above 'back to the outline'`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto("./");
      await page.locator(`#lang${lang}`).click();
      await page.locator("#loadSampleBtn").click();
      await expect(page.locator("#exportHtml")).toBeAttached({ timeout: 15000 });
      await page.locator("#exportHtml").evaluate((el) => el.scrollIntoView({ block: "center" }));
      const pill = page.locator("#caseOutlineReturn");
      await expect(pill).toBeVisible();
      await page.locator("#exportHtml").click();
      await expect(page.locator("#toast")).toHaveAttribute("data-open", "true");
      await page.waitForTimeout(450); // past the slide-in
      const rects = await page.evaluate(() => {
        const r = (id) => document.getElementById(id).getBoundingClientRect();
        const t = r("toast"), p = r("caseOutlineReturn");
        return { toastBottom: t.bottom, pillTop: p.top, apart: t.right <= p.left || p.right <= t.left || t.bottom <= p.top || p.bottom <= t.top };
      });
      expect(rects.apart).toBe(true);
    });
  }
});
