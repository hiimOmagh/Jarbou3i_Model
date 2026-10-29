import { test, expect } from '@playwright/test';
import fs from 'node:fs/promises';
import { openStep } from "./helpers/guided-flow.js";
import { expectKernel } from "./helpers/kernel-check.js";
import { readIntakeDraft } from "./helpers/browser-persistence.js";

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
  const promotedNextAction = (await orientation.locator('[data-next-action]').textContent())?.trim();
  expect(promotedNextAction).toBeTruthy();
  expect(promotedNextAction).not.toBe('—');
  // Said once in the overview: the diagnostics list it in the gate, not again.
  await expect(page.locator('[data-diagnostic="next"]')).toHaveCount(0);
  await expect(page.locator('#case-overview .j-diag').getByText(promotedNextAction, { exact: true })).toHaveCount(1);
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
  // Each open item is said once, in the gate; the diagnostics do not repeat it.
  const items = await gate.locator('li').allTextContents();
  expect(items.length).toBeGreaterThan(4);
  await expect(page.locator('[data-diagnostic="warnings"], [data-diagnostic="next"]')).toHaveCount(0);
  for (const item of items) await expect(page.locator('#case-overview .j-diag').getByText(item, { exact: true })).toHaveCount(1);
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
  await expect(assessment.locator('p')).toHaveText('Couche la plus faible : Preuves et hypothèses · Risque de publication : moyen');
});

test('the recommended next action is asked of the AI, whose whole answer comes back in the reply box', async ({ page }) => {
  const data = JSON.parse(await fs.readFile(`${process.cwd()}/fixtures/sample-analysis-en.json`, 'utf8'));
  await page.goto('./');
  await page.locator('#langEn').click();
  await openStep(page, "answer");
  await page.locator('#jsonInput').fill(JSON.stringify(data));
  await page.locator('#importBtn').click();
  // What the page copies, so the test reads the prompt it would paste.
  await page.evaluate(() => {
    window.__copied = [];
    Object.defineProperty(navigator.clipboard, "writeText", { configurable: true, value: async (text) => { window.__copied.push(text); } });
  });
  const next = (await page.locator('[data-next-action]').textContent()).trim();
  await expect(page.locator('#improveAnswer')).toBeHidden();
  // Reached by keyboard, the button wears the kernel's 3px ring, here in the review too.
  await page.locator('#improveCopy').focus();
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Tab');
  await expect(page.locator('#improveCopy')).toBeFocused();
  expect(await page.locator('#improveCopy').evaluate((button) => [getComputedStyle(button).outlineWidth, getComputedStyle(button).outlineStyle])).toEqual(['3px', 'solid']);
  await page.locator('#improveCopy').click();
  await expect(page.locator('#improveStatus')).toHaveText(/^Prompt copied/);
  const prompt = await page.evaluate(() => window.__copied.at(-1));
  expect(prompt).toContain(`Improve your analysis by doing this: ${next}\n`);
  // The analysis goes with it as data, so edits made in the app are kept.
  expect(JSON.parse(prompt.split('UNTRUSTED_ANALYSIS_MATERIAL_JSON:\n')[1]).subject.title).toBe(data.subject.title);

  // The reply is awaited across a reload, once the page has kept that it is.
  await expect.poll(async () => (await readIntakeDraft(page))?.reply_for).toBe('improve');
  await page.reload();
  await page.locator('#improveAnswer').click();
  const reply = page.locator('#continuationInput');
  await expect(reply).toBeFocused();
  await expect(page.locator('#continuationField label')).toHaveText('The AI’s reply');
  await expect(reply).toHaveAttribute('placeholder', 'Paste the AI’s reply here. The improved answer replaces the one above.');
  // The prompt pasted back is not read as the improved answer.
  await reply.fill(prompt);
  await expect(page.locator('#jsonStatus')).toHaveText(/^This text holds no reply to read/);
  await expect(page.locator('#continuationField')).toBeVisible();

  const improved = { ...data, subject: { ...data.subject, executive_thesis: 'An improved thesis.' } };
  await reply.fill(`\`\`\`json\n${JSON.stringify(improved)}\n\`\`\``);
  await expect(page.locator('#continuationField')).toBeHidden();
  await page.locator('#importBtn').click();
  await expect(page.locator('[data-orientation="conclusion"] > p')).toHaveText('An improved thesis.');
});
