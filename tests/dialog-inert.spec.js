import { test, expect } from '@playwright/test';
test('dialog makes shell inert and restores opener', async ({ page }) => {
  await page.goto('./');
  const opener = page.locator('#workspaceSaveState');
  await opener.click();
  await expect(page.locator('#appShell')).toHaveAttribute('inert', '');
  await page.keyboard.press('Shift+Tab');
  await expect.poll(() => page.locator('#workspaceDialog').evaluate(el => el.contains(document.activeElement))).toBe(true);
  await page.keyboard.press('Escape');
  await expect(page.locator('#appShell')).not.toHaveAttribute('inert', '');
  await expect(opener).toBeFocused();
});
