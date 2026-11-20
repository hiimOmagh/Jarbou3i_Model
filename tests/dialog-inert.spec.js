import { test, expect } from '@playwright/test';
import { openStep } from './helpers/guided-flow.js';
test('dialog makes shell inert and restores opener', async ({ page }) => {
  await page.goto('./');
  const opener = page.locator('#workspaceSaveState');
  await opener.click();
  await expect(page.locator('#appShell')).toHaveAttribute('inert', '');
  await expect(page.locator('#toast')).not.toHaveAttribute('inert', '');
  const topic = page.locator('#topicInput');
  const before = await topic.inputValue();
  await topic.evaluate(el => el.focus());
  await page.keyboard.type('background typing');
  await expect(topic).toHaveValue(before);
  await expect.poll(() => page.locator('#workspaceDialog').evaluate(el => el.contains(document.activeElement))).toBe(true);
  await page.keyboard.press('Shift+Tab');
  await expect.poll(() => page.locator('#workspaceDialog').evaluate(el => el.contains(document.activeElement))).toBe(true);
  await expect(page.locator('#caseRestore')).toBeFocused();
  await expect(page.locator(':focus')).toBeVisible();
  await page.keyboard.press('Tab');
  await expect(page.locator('#workspaceClose')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.locator('#appShell')).not.toHaveAttribute('inert', '');
  await expect(opener).toBeFocused();
  await topic.focus();
  await expect(topic).toBeFocused();
});

test('native palette owns Tab and Escape when a preview opens behind it', async ({ page }) => {
  await page.goto('./');
  await page.locator('#loadSampleBtn').click();
  await openStep(page, 'prompt');
  await page.keyboard.press('Control+k');
  await expect(page.locator('#commandPaletteInput')).toBeFocused();
  // An action completing while the native dialog is open can show a preview.
  await page.locator('#previewPromptBtn').evaluate(el => el.click());
  await expect(page.locator('#modalBackdrop')).toHaveClass(/show/);
  await page.locator('#commandPaletteInput').focus();
  // Observe cancellation: focus attempts behind a native modal are ignored by
  // the browser, so focus containment alone would miss the custom trap's bug.
  await page.evaluate(() => {
    window.paletteTabs = [];
    window.addEventListener('keydown', event => {
      if (event.key === 'Tab') window.paletteTabs.push(event.defaultPrevented);
    });
  });
  await page.keyboard.press('Tab');
  await page.locator('#commandPaletteInput').focus();
  await page.keyboard.press('Shift+Tab');
  expect(await page.evaluate(() => window.paletteTabs)).toEqual([false, false]);
  await page.keyboard.press('Escape');
  await expect(page.locator('#commandPalette')).not.toHaveAttribute('open', '');
  await expect(page.locator('#modalBackdrop')).toHaveClass(/show/);
  await expect.poll(() => page.locator('#modalDialog').evaluate(el => el.contains(document.activeElement))).toBe(true);
});

test('failed copy preview takes focus after the palette closes', async ({ page }) => {
  await page.goto('./');
  await page.locator('#loadSampleBtn').click();
  await openStep(page, 'prompt');
  await page.evaluate(() => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: {
      writeText: () => new Promise((resolve, reject) => { window.rejectCopy = reject; }),
    } });
    document.execCommand = () => false;
  });
  await page.locator('#copyPromptBtn').click();
  await expect.poll(() => page.evaluate(() => typeof window.rejectCopy)).toBe('function');
  await page.keyboard.press('Control+k');
  await expect(page.locator('#commandPaletteInput')).toBeFocused();
  await page.evaluate(() => window.rejectCopy(new Error('Clipboard denied')));
  await expect(page.locator('#modalBackdrop')).toHaveClass(/show/);
  await page.keyboard.press('Escape');
  await expect(page.locator('#commandPalette')).not.toHaveAttribute('open', '');
  await expect.poll(() => page.locator('#modalDialog').evaluate(el => el.contains(document.activeElement))).toBe(true);
  await page.keyboard.press('Escape');
  await expect(page.locator('#modalBackdrop')).not.toHaveClass(/show/);
  await expect(page.locator('#copyPromptBtn')).toBeFocused();
  await expect(page.locator('#appShell')).not.toHaveAttribute('inert', '');
});
