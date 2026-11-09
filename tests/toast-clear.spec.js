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
      // Click and measure in the page itself, so a slow browser cannot let the
      // 2.6 s toast close before it is looked at.
      const rects = await page.evaluate(async () => {
        document.getElementById("exportHtml").click();
        await new Promise((done) => setTimeout(done, 450)); // past the slide-in
        const toast = document.getElementById("toast");
        const r = (el) => el.getBoundingClientRect();
        const t = r(toast), p = r(document.getElementById("caseOutlineReturn"));
        return { open: toast.dataset.open, apart: t.right <= p.left || p.right <= t.left || t.bottom <= p.top || p.bottom <= t.top };
      });
      expect(rects.open).toBe("true");
      expect(rects.apart).toBe(true);
    });
  }
});
