import { test, expect } from '@playwright/test';

test('Jarbou3i Model core flow', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#copyPromptBtn')).toBeVisible();

  await page.locator('#langFr').click();
  await expect(page.locator('#copyPromptBtn')).toContainText('Copier le prompt');

  await page.locator('#langEn').click();
  await page.locator('#topicInput').fill('World War II outcomes, 1939-1947');
  await page.locator('#previewPromptBtn').click();
  await expect(page.locator('#modalBackdrop')).toHaveClass(/show/);
  await page.keyboard.press('Escape');

  await page.locator('#loadSampleBtn').click();
  await expect(page.locator('#reviewPanel')).toBeVisible();

  for (const tab of ['overview','pillars','contradictions','scenarios','evidence','exports']) {
    await page.locator('[data-review="' + tab + '"]').click();
    await expect(page.locator('#reviewContent')).toBeVisible();
  }

  await page.locator('[data-review="exports"]').click();
  await expect(page.locator('#exportHtml')).toBeVisible();
  await expect(page.locator('#exportJson')).toHaveCount(0);
  await expect(page.locator('#exportMd')).toHaveCount(0);
  await expect(page.locator('#printBtn')).toHaveCount(0);
  await expect(page.locator('#selfCheckBtn')).toHaveCount(0);
});
