import { test, expect } from '@playwright/test';

for (const key of ['Tab', 'Shift+Tab']) {
  test(`${key} stays inside the editor dialog`, async ({ page }) => {
    await page.goto('./');
    await page.locator('#langEn').click();
    await page.locator('#loadSampleBtn').click();
    await page.locator('#workspaceSaveState').click();
    await page.getByRole('button', { name: 'Edit draft' }).click();
    const dialog = page.locator('#editorDialog');
    await expect(dialog).toBeVisible();
    const controls = dialog.locator('button:visible:enabled, input:visible:enabled, select:visible:enabled, textarea:visible:enabled, [tabindex="0"]:visible');
    await (key === 'Tab' ? controls.last() : controls.first()).focus();
    await page.keyboard.press(key);
    await expect.poll(() => dialog.evaluate(el => el.contains(document.activeElement))).toBe(true);
    await expect(key === 'Tab' ? controls.first() : controls.last()).toBeFocused();
  });
}
