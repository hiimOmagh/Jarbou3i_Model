import { test, expect } from '@playwright/test';

test('shared results orientation prioritizes decision context across both lenses', async ({ page }) => {
  await page.goto('/');
  await page.locator('#langEn').click();
  await page.locator('#loadSampleBtn').click();

  const orientation = page.locator('[data-results-orientation]');
  await expect(orientation).toBeVisible();
  await expect(orientation).toHaveAttribute('data-analysis-lens', 'strategic');
  await expect(orientation.locator('#resultsOrientationTitle')).toHaveText('What matters first');
  await expect(orientation.locator('.orientationConclusion')).toContainText('bipolar order');
  await expect(orientation.locator('.orientationGate')).toContainText(/Blocked|Approved/);
  await expect(orientation.locator('.orientationMetrics')).toContainText('Decision readiness');
  await expect(orientation.locator('.orientationSignal.uncertainty')).not.toContainText('—');
  const promotedNextAction = (await orientation.locator('.orientationSignal.action p').textContent())?.trim();
  expect(promotedNextAction).toBeTruthy();
  expect(promotedNextAction).not.toBe('—');
  await expect(page.locator('.intelBrief .nextAction')).toContainText(promotedNextAction);

  await page.locator('[data-lens="biopolitical"]').click();
  await page.locator('#loadSampleBtn').click();
  await expect(orientation).toHaveAttribute('data-analysis-lens', 'biopolitical');
  await expect(orientation.locator('.orientationConclusion')).toContainText('access-control infrastructure');
  await expect(orientation.locator('.orientationSignal.uncertainty')).toContainText('Long-term normalization effects');

  await page.locator('#langFr').click();
  await expect(orientation.locator('#resultsOrientationTitle')).toHaveText('L’essentiel d’abord');
  await expect(orientation.locator('.orientationSignal.action')).toContainText('Prochaine action recommandée');

  await page.setViewportSize({ width: 320, height: 800 });
  await orientation.scrollIntoViewIfNeeded();
  const bounds = await orientation.boundingBox();
  expect(bounds).not.toBeNull();
  expect(bounds.x).toBeGreaterThanOrEqual(0);
  expect(bounds.x + bounds.width).toBeLessThanOrEqual(320);
  await expect(orientation.locator('.orientationConclusion')).toBeVisible();
  await expect(orientation.locator('.orientationGate')).toBeVisible();
  await expect(orientation.locator('.orientationSignal.uncertainty')).toBeVisible();
  await expect(orientation.locator('.orientationSignal.action')).toBeVisible();
});
