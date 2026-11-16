import { test, expect } from '@playwright/test';

for (const language of ['Ar', 'En', 'Fr']) {
  for (const review of [false, true]) {
    test(`skip navigation enters ${review ? 'review' : 'setup'} in ${language}`, async ({ page }) => {
      await page.goto('./');
      await page.locator(`#lang${language}`).click();
      if (review) await page.locator('#loadSampleBtn').click();
      const id = review ? 'reviewPanel' : 'workflowPanel';
      const panel = page.locator(`#${id}`);
      await expect(panel).toBeVisible();
      const skip = page.locator('.j-skip');
      await expect(skip).toHaveAttribute('href', `#${id}`);
      await skip.focus();
      await page.keyboard.press('Enter');
      await expect(panel).toBeFocused();
      await expect(panel).toHaveAttribute('tabindex', '-1');
      await page.keyboard.press('Tab');
      expect(await panel.evaluate(el => el.contains(document.activeElement) && document.activeElement !== el)).toBe(true);
      await expect(page.locator(':focus')).toBeVisible();
    });
  }
}
