import { test, expect } from '@playwright/test';
for (const [lang, strategic, bio] of [
  ['En', 'Example: a company deciding whether to enter a new market.', 'Example: how a health policy shapes people’s daily lives.'],
  ['Ar', 'مثال: شركة تقرر دخول سوق جديدة.', 'مثال: كيف تؤثر سياسة صحية في حياة الناس اليومية.'],
  ['Fr', 'Exemple : une entreprise décide d’entrer sur un nouveau marché.', 'Exemple : comment une politique sanitaire influence la vie quotidienne.'],
]) {
  test(`everyday lens examples in ${lang}`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 740 });
    await page.goto('./');
    await page.locator(`#lang${lang}`).click();
    await page.locator('#topicInput').fill('Health policy');
    await page.locator('[data-flow-step="lens"]').click();
    for (const [lens, example] of [['strategic', strategic], ['biopolitical', bio]]) {
      const choice = page.locator(`#analysisLens [data-lens="${lens}"]`);
      await expect(choice).toContainText(example);
      await expect(choice).toBeVisible();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}
