import { test, expect } from '@playwright/test';
import { openStep } from './helpers/guided-flow.js';
import { misplacedPercents } from './helpers/bidi.js';

test.describe('RTL and mobile layout smoke', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('Arabic mobile flow remains readable and does not overflow horizontally', async ({ page }) => {
    await page.goto('./');
    await page.locator('#langAr').click();
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await expect(page.locator('.j-flow-guide')).toBeVisible();
    await page.locator('#loadSampleBtn').click();
    await expect(page.locator('#reviewPanel')).toBeVisible();

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(2);

    await page.locator('[data-review="evidence"]').click();
    await expect(page.locator('#reviewContent')).toBeVisible();
    await expect(page.locator('#reviewContent')).toContainText(/الأدلة|Evidence|Preuves/);

    // A scenario's probability keeps its percent sign on the right, as elsewhere.
    await page.locator('[data-review="scenarios"]').click();
    await expect(page.locator('[data-records="scenarios"]')).toBeVisible();
    expect(await misplacedPercents(page)).toEqual([]);
  });

  test('Arabic keeps a pasted JSON answer left to right', async ({ page }) => {
    await page.goto('./');
    await page.locator('#langAr').click();
    await openStep(page, 'answer');
    const answer = page.locator('#jsonInput');
    const direction = () => answer.evaluate((el) => getComputedStyle(el).direction);
    // Empty, its Arabic hint reads right to left; filled, the JSON reads left to right.
    expect(await direction()).toBe('rtl');
    await answer.fill('{ "interests": [], "actors": [] }');
    expect(await direction()).toBe('ltr');
    await expect(page.locator('#continuationInput')).toHaveAttribute('dir', 'ltr');
  });
});
