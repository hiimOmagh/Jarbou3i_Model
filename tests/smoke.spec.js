import { test, expect } from '@playwright/test';
import { openStep } from "./helpers/guided-flow.js";
import { displayControl } from "./helpers/display-menu.js";

test('runs under the production content security policy without violations', async ({ page }) => {
  await page.addInitScript(() => {
    window.__cspViolations = [];
    document.addEventListener('securitypolicyviolation', (event) => {
      window.__cspViolations.push(`${event.violatedDirective} ${event.blockedURI}`);
    });
  });
  const response = await page.goto('./');
  expect(response?.headers()['content-security-policy']).toContain("script-src 'self'");
  await page.locator('#loadSampleBtn').click();
  await expect(page.locator('#loadSampleBtn')).toBeVisible();
  expect(await page.evaluate(() => window.__cspViolations)).toEqual([]);
});

test('Jarbou3i Model core flow', async ({ page }) => {
  await page.goto('./');
  await expect(page.locator('#loadSampleBtn')).toBeVisible();

  const platform = await page.evaluate(() => window.Jarbou3iPlatformDiagnostics?.inspect());
  expect(platform?.runtimeVersion).toBe('1.0.0');
  expect(platform?.lenses.map((lens) => lens.id)).toEqual(['strategic', 'biopolitical']);
  expect(platform?.performance.measures.map((measure) => measure.name)).toEqual(
    expect.arrayContaining(['render.shell', 'render.workflow', 'render.engine', 'render.review']),
  );
  expect(platform?.performance.entryCount).toBeLessThanOrEqual(160);

  await expect(page.locator('.j-shell-brand img')).toHaveAttribute('src', /jarbou3i-mascot-192\.png$/);
  await expect(page.locator('.j-flow-mascot img')).toHaveAttribute('src', /jarbou3i-mascot-192\.png$/);
  await expect(page.locator('link[rel="manifest"]')).toHaveAttribute('href', 'manifest.webmanifest');

  await page.locator('#langFr').click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
  await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
  await expect(page.locator('#copyPromptBtn')).toContainText('Copier le prompt');

  await page.locator('#langAr').click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');

  await page.locator('#langEn').click();
  await openStep(page, "settings");
  await page.locator('#analysisLang').selectOption('en');
  await (await displayControl(page, "themeBtn")).click();
  await expect(page.locator('body')).toHaveClass(/dark/);
  await expect(page.locator('#themeBtn')).toHaveAttribute('aria-pressed', 'true');

  await openStep(page, "lens");
  await expect(page.locator('#analysisLens')).toBeVisible();
  await expect(page.locator('[data-lens="strategic"]')).toHaveAttribute('aria-checked', 'true');
  await openStep(page, "lens");
  await page.locator('[data-lens="biopolitical"]').click();
  await expect(page.locator('[data-lens="biopolitical"]')).toHaveAttribute('aria-checked', 'true');
  await expect(page.locator('h1')).toContainText('Biopolitical');
  await openStep(page, "topic");
  await page.locator('#topicInput').fill('Digital health passports, 2020-2022');
  await openStep(page, "prompt");
  await page.locator('#previewPromptBtn').click();
  await expect(page.locator('#modalBackdrop')).toHaveClass(/show/);
  await page.keyboard.press('Escape');

  await page.locator('#loadSampleBtn').click();
  await expect(page.locator('#reviewPanel')).toBeVisible();
  await expect(page.locator('#reviewContent')).toContainText(/Digital health passes/i);
  await expect(page.locator('.j-shell-phase[aria-current="step"]')).toContainText('Review');

  for (const tab of ['overview', 'pillars', 'evidence', 'conclusion', 'exports']) {
    const reviewTab = page.locator(`[data-bio-review="${tab}"]`);
    await reviewTab.focus();
    await expect(reviewTab).toBeFocused();
    await reviewTab.press('Enter');
    await expect(reviewTab).toHaveAttribute("aria-current", "location");
    await expect(page.locator('#reviewContent')).toBeVisible();
  }

  await page.locator('[data-bio-review="exports"]').click();
  await expect(page.locator('#exportHtml')).toBeVisible();
  await expect(page.locator('#exportJson')).toBeVisible();
});
