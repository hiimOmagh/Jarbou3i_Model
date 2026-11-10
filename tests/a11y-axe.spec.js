import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// WCAG 2.0/2.1/2.2 A and AA across all rule impacts (a11y.spec.js only gates
// serious and critical). One run per language on the loaded sample, for the
// whole page and for the results overview.
const TAGS = ["wcag2a", "wcag2aa", "wcag22aa"];

async function settle(page) {
  // End finite animations so axe reads the colours that stay on screen.
  await page.evaluate(() => {
    for (const animation of document.getAnimations()) {
      if (animation.effect?.getComputedTiming().iterations !== Infinity) animation.finish();
    }
  });
}

for (const [lang, button] of [["en", "#langEn"], ["ar", "#langAr"], ["fr", "#langFr"]]) {
  test(`axe finds no WCAG A/AA/2.2 violations on the sample in ${lang}`, async ({ page }) => {
    await page.goto("./");
    await page.locator(button).click();
    await page.locator("#loadSampleBtn").click();
    await expect(page.locator("[data-results-orientation]")).toBeVisible();
    await settle(page);

    const brief = (v) => v.map((x) => ({ rule: x.id, impact: x.impact, targets: x.nodes.map((n) => n.target.join(" ")) }));

    const overview = await new AxeBuilder({ page }).include("#case-overview").withTags(TAGS).analyze();
    expect(brief(overview.violations), `overview ${lang}`).toEqual([]);

    const whole = await new AxeBuilder({ page }).withTags(TAGS).analyze();
    expect(brief(whole.violations), `page ${lang}`).toEqual([]);
  });
}
