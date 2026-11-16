import { readIntakeDraft } from './helpers/browser-persistence.js';
import { test, expect } from '@playwright/test';
import fs from 'node:fs';
for (const [name, reply] of [['short', 'A short pending reply'], ['fixture', fs.readFileSync('fixtures/sample-analysis-en.json', 'utf8').replace(/\r\n/g, '\n')]]) {
 test(`pending reply restoration ${name}`, async ({ page }) => {
 await page.goto('./'); await page.locator('#langEn').click();
 await page.locator('#topicInput').fill('QA topic');
 await page.locator('[data-flow-step="answer"]').click();
 await page.locator('#jsonInput').fill(reply);
 // Allow the asynchronous recovery write to settle before reloading.
 await expect.poll(async () => (await readIntakeDraft(page))?.reply, { timeout: 5000 }).toBe(reply);
 await page.waitForTimeout(1000); await page.reload();
 await expect(page.locator('#jsonInput')).toHaveValue(reply, {timeout: 5000});
 await expect(page.locator('[data-flow-step=answer]')).toHaveAttribute('aria-current', 'step');
 });
}
for (const width of [1280, 390]) {
 test(`inspection visible at ${width}`, async ({page}) => {
 await page.setViewportSize({width, height:800}); await page.goto('./');
 await page.locator('#langEn').click(); await page.locator('#loadSampleBtn').click();
 await page.locator('[data-explanation-section="actors"] [data-explanation-open]').click();
 await expect(page.locator('#acc-head-actors')).toBeFocused();
 await expect.poll(() => page.locator('#acc-panel-actors').evaluate(el => el.getBoundingClientRect().top)).toBeLessThan(800);
 await expect.poll(() => page.locator('#acc-head-actors').evaluate(el => el.getBoundingClientRect().top)).toBeLessThan(100);
 });
}


