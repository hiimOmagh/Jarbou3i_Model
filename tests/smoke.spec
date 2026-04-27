import { test, expect } from '@playwright/test';

test('core public workflow works in English', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Strategic Analysis Workbench/);

  await page.locator('#langEn').click();
  await expect(page.locator('#topicInput')).toBeVisible();

  const ids = await page.locator('[id]').evaluateAll(nodes => nodes.map(n => n.id));
  expect(new Set(ids).size).toBe(ids.length);

  await page.locator('#themeBtn').click();
  await expect(page.locator('body')).toHaveClass(/dark/);
  await page.locator('#themeBtn').click();

  await page.locator('#loadSampleBtn').click();
  await expect(page.locator('#reviewPanel')).toBeVisible();
  await expect(page.locator('#analysisStateChip')).toContainText(/Analysis imported/i);

  for (const tab of ['overview', 'pillars', 'contradictions', 'scenarios', 'evidence', 'exports']) {
    await page.locator(`[data-review="${tab}"]`).click();
    await expect(page.locator('#reviewContent')).toBeVisible();
  }

  await page.locator('[data-review="exports"]').click();
  await page.locator('#selfCheckBtn').click();
  await expect(page.locator('#runtimeCheckResult')).toContainText(/Runtime self-check/i);

  await page.locator('#clearJsonBtn').click();
  await page.locator('#jsonInput').fill('This is not valid JSON');
  await expect(page.locator('#jsonStatus')).toBeVisible();
});

test('Arabic direction and review flow remain stable', async ({ page }) => {
  await page.goto('/');
  await page.locator('#langAr').click();
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await page.locator('#loadSampleBtn').click();

  for (const tab of ['overview', 'pillars', 'contradictions', 'scenarios', 'evidence', 'exports']) {
    await page.locator(`[data-review="${tab}"]`).click();
    await expect(page.locator('#reviewContent')).toBeVisible();
  }

  await page.locator('[data-review="exports"]').click();
  await page.locator('#selfCheckBtn').click();
  await expect(page.locator('#runtimeCheckResult')).toContainText(/فحص|self-check/i);
});

test('exports trigger downloads after sample import', async ({ page }) => {
  await page.goto('/');
  await page.locator('#langEn').click();
  await page.locator('#loadSampleBtn').click();
  await page.locator('[data-review="exports"]').click();

  const [jsonDownload] = await Promise.all([
    page.waitForEvent('download'),
    page.locator('#exportJson').click()
  ]);
  expect(jsonDownload.suggestedFilename()).toMatch(/\.json$/);

  const [mdDownload] = await Promise.all([
    page.waitForEvent('download'),
    page.locator('#exportMd').click()
  ]);
  expect(mdDownload.suggestedFilename()).toMatch(/\.md$/);
});
