import { test, expect } from '@playwright/test';
import fs from 'node:fs/promises';
import { openStep } from './helpers/guided-flow.js';

// The mode is not stored with an answer: a follow-up states the setting in force
// when it is opened, not the one the answer was made under.
test('the next-action prompt states the source access set now, not the one at answer time', async ({ page }) => {
  const data = JSON.parse(await fs.readFile(`${process.cwd()}/fixtures/sample-analysis-en.json`, 'utf8'));
  await page.goto('./');
  await page.locator('#langEn').click();
  await openStep(page, 'settings');
  await page.locator('#evidenceAccess').selectOption('web');
  await openStep(page, 'answer');
  await page.locator('#jsonInput').fill(JSON.stringify(data));
  await page.locator('#importBtn').click();
  await page.evaluate(() => {
    window.__copied = [];
    Object.defineProperty(navigator.clipboard, 'writeText', { configurable: true, value: async (text) => { window.__copied.push(text); } });
  });
  await openStep(page, 'settings');
  await page.locator('#evidenceAccess').selectOption('none');
  await expect(page.locator('#evidenceAccess')).toHaveValue('none');
  await page.locator('#improveCopy').click();
  await expect(page.locator('#improveStatus')).toHaveText(/^Prompt copied/);
  const prompt = await page.evaluate(() => window.__copied.at(-1));
  expect(prompt).toContain('Source access for this task is set to: none.');
  expect(prompt).not.toContain('set to: web');
  expect(prompt).not.toContain('unchanged from your original answer');
});
