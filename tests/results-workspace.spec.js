import { test, expect } from '@playwright/test';

test('shared results orientation prioritizes decision context across both lenses', async ({ page }) => {
  await page.goto('./');
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

test('an Arabic gate that is not approved says so, not banned', async ({ page }) => {
  await page.goto('./');
  await page.locator('#langAr').click();
  await page.locator('#loadSampleBtn').click();
  await expect(page.locator('.orientationGate strong')).toHaveText('غير معتمد');
});

test('the Bio overview gives one gate verdict and lists every open item in it', async ({ page }) => {
  await page.goto('./');
  await page.locator('#langEn').click();
  await page.locator('[data-lens="biopolitical"]').click();
  await page.locator('#loadSampleBtn').click();
  const gate = page.locator('.intelBrief .qualityGate');
  await expect(gate.locator('h4')).toHaveText('Quality gate: Review needed');
  await expect(page.locator('.orientationGate strong')).toHaveText('Review needed');
  const listed = await page.locator('.intelBrief .list .warning').count();
  expect(listed).toBeGreaterThan(4);
  await expect(gate.locator('li')).toHaveCount(listed);
});

for (const language of ["ar", "fr"]) {
  test(`the ${language} Strategic results name every coded value in that language`, async ({ page }) => {
    await page.goto("./");
    await page.locator(language === "ar" ? "#langAr" : "#langFr").click();
    await page.locator("#analysisLang").selectOption(language);
    await page.locator('[data-lens="strategic"]').click();
    await page.locator("#loadSampleBtn").click();
    await expect(page.locator("#reviewPanel")).toBeVisible();
    const shown = [];
    const collect = async () =>
      shown.push(...(await page.locator("#reviewContent .chip, #reviewContent .assumptionCard p").allTextContents()));
    for (const review of ["overview", "contradictions", "scenarios", "evidence"]) {
      await page.locator(`[data-review="${review}"]`).click();
      await collect();
    }
    await page.locator('[data-review="pillars"]').click();
    for (const pillar of ["interests", "actors", "tools", "narrative", "results", "feedback"]) {
      await page.locator(`[data-pillar-card="${pillar}"]`).click();
      await collect();
    }
    // Codes shown in English: any Latin word in Arabic; in French, the English
    // words that read differently in French.
    const english = ["State", "High", "Medium", "Low", "Diplomatic", "Legal", "Unintended", "Strategic", "Long", "Existential", "high", "medium", "low"];
    const leaked = shown
      .map((value) => value.trim())
      .filter((value) => (language === "ar" ? /[A-Za-z]{3,}/.test(value) : english.includes(value)));
    expect([...new Set(leaked)]).toEqual([]);
  });
}
