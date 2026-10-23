import { test, expect } from '@playwright/test';
import fs from 'node:fs/promises';
import { openStep } from "./helpers/guided-flow.js";
import { expectKernel } from "./helpers/kernel-check.js";

test('shared results orientation prioritizes decision context across both lenses', async ({ page }) => {
  await page.goto('./');
  await page.locator('#langEn').click();
  await page.locator('#loadSampleBtn').click();

  const orientation = page.locator('[data-results-orientation]');
  await expect(orientation).toBeVisible();
  await expect(orientation).toHaveAttribute('data-analysis-lens', 'strategic');
  // The verdict opens the overview, as its heading, and says why.
  await expect(orientation.locator('#resultsOrientationTitle')).toHaveText('Do not publish yet');
  await expect(orientation.locator('[data-orientation="gate"] p')).toContainText('structurally weak');
  await expect(page.locator('#case-overview .j-brief-topic')).toHaveText('Sample: World War II outcomes');
  await expect(orientation.locator('[data-orientation="conclusion"]')).toContainText('bipolar order');
  // One verdict: the brief says what the quality gate says.
  await expect(page.locator('[data-diagnostic="gate"] h4')).toHaveText('Publication gate: Do not publish yet');
  await expect(orientation.locator('[data-orientation="gate"] strong')).toHaveText('Do not publish yet');
  await expect(orientation.locator('[data-orientation="metrics"]')).toContainText('Decision readiness');
  await expect(orientation.locator('[data-orientation="uncertainty"]')).not.toContainText('—');
  const promotedNextAction = (await orientation.locator('[data-orientation="action"] p').textContent())?.trim();
  expect(promotedNextAction).toBeTruthy();
  expect(promotedNextAction).not.toBe('—');
  await expect(page.locator('[data-diagnostic="next"]')).toContainText(promotedNextAction);
  await expectKernel(page, '[data-results-orientation]');
  await expectKernel(page, '[data-results-explanation]');

  await openStep(page, "lens");
  await page.locator('[data-lens="biopolitical"]').click();
  await page.locator('#loadSampleBtn').click();
  await expect(orientation).toHaveAttribute('data-analysis-lens', 'biopolitical');
  await expect(orientation.locator('[data-orientation="conclusion"]')).toContainText('access-control infrastructure');
  await expect(orientation.locator('[data-orientation="uncertainty"]')).toContainText('Long-term normalization effects');

  await page.locator('#langFr').click();
  await expect(orientation.locator('#resultsOrientationTitle')).toHaveText('Révision nécessaire');
  await expect(orientation.locator('[data-orientation="action"]')).toContainText('Prochaine action recommandée');

  await page.setViewportSize({ width: 320, height: 800 });
  await orientation.scrollIntoViewIfNeeded();
  const bounds = await orientation.boundingBox();
  expect(bounds).not.toBeNull();
  expect(bounds.x).toBeGreaterThanOrEqual(0);
  expect(bounds.x + bounds.width).toBeLessThanOrEqual(320);
  await expect(orientation.locator('[data-orientation="conclusion"]')).toBeVisible();
  await expect(orientation.locator('[data-orientation="gate"]')).toBeVisible();
  await expect(orientation.locator('[data-orientation="uncertainty"]')).toBeVisible();
  await expect(orientation.locator('[data-orientation="action"]')).toBeVisible();
});

test('an Arabic gate that is not approved says so, not banned', async ({ page }) => {
  await page.goto('./');
  await page.locator('#langAr').click();
  await page.locator('#loadSampleBtn').click();
  await expect(page.locator('[data-orientation="gate"] strong')).toHaveText('لا تنشر بعد');
});

test('the Bio overview gives one gate verdict and lists every open item in it', async ({ page }) => {
  await page.goto('./');
  await page.locator('#langEn').click();
  await openStep(page, "lens");
  await page.locator('[data-lens="biopolitical"]').click();
  await page.locator('#loadSampleBtn').click();
  const gate = page.locator('[data-diagnostic="gate"]');
  await expect(gate.locator('h4')).toHaveText('Publication gate: Review needed');
  await expect(page.locator('[data-orientation="gate"] strong')).toHaveText('Review needed');
  const listed = await page.locator('[data-diagnostic="warnings"] li').count();
  expect(listed).toBeGreaterThan(4);
  await expect(gate.locator('li')).toHaveCount(listed);
  await expectKernel(page, '.j-diag');
});

for (const language of ["ar", "fr"]) {
  test(`the ${language} Strategic results name every coded value in that language`, async ({ page }) => {
    await page.goto("./");
    await page.locator(language === "ar" ? "#langAr" : "#langFr").click();
    await openStep(page, "settings");
    await page.locator("#analysisLang").selectOption(language);
    await openStep(page, "lens");
    await page.locator('[data-lens="strategic"]').click();
    await page.locator("#loadSampleBtn").click();
    await expect(page.locator("#reviewPanel")).toBeVisible();
    // The case file holds every section and pillar at once.
    const shown = await page.locator('#reviewContent .chip, #reviewContent .j-chip, #reviewContent [data-records="assumptions"] dd').allTextContents();
    expect(shown.length).toBeGreaterThan(0);
    // Codes shown in English: any Latin word in Arabic; in French, the English
    // words that read differently in French.
    const english = ["State", "High", "Medium", "Low", "Diplomatic", "Legal", "Unintended", "Strategic", "Long", "Existential", "high", "medium", "low"];
    const leaked = shown
      .map((value) => value.trim())
      .filter((value) => (language === "ar" ? /[A-Za-z]{3,}/.test(value) : english.includes(value)));
    expect([...new Set(leaked)]).toEqual([]);
  });
}

test('the analysis’s own assessment is shown as its claim, in the page language', async ({ page }) => {
  const data = JSON.parse(await fs.readFile(`${process.cwd()}/fixtures/sample-analysis-en.json`, 'utf8'));
  await page.goto('./');
  await page.locator('#langEn').click();
  await openStep(page, "answer");
  await page.locator('#jsonInput').fill(JSON.stringify(data));
  await page.locator('#importBtn').click();
  const assessment = page.locator('[data-diagnostic="self-assessment"]');
  await expect(assessment).toHaveAttribute('data-tone', 'idle');
  await expect(assessment.locator('h4')).toHaveText("The AI's own assessment, not verified");
  await expect(assessment.locator('p')).toHaveText('Weakest layer: Evidence & assumptions · Publication risk: medium');
  await page.locator('#langFr').click();
  await expect(assessment.locator('p')).toHaveText('Couche la plus faible : Preuves & hypothèses · Risque de publication : moyen');
});
