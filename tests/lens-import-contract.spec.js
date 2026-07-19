import { test, expect } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';

const EXPECTED_VERSION = '2.1.0-alpha.6';

async function readFixture(name) {
  const raw = await fs.readFile(path.join(process.cwd(), 'fixtures', name), 'utf8');
  return JSON.parse(raw);
}

async function importFixture(page, fixtureName, wrongInitialLens) {
  const data = await readFixture(fixtureName);

  await page.goto('/');
  await expect(page.locator('#copyPromptBtn')).toBeVisible();
  await page.locator('#langEn').click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');

  // Prove import, not the previous UI toggle state, controls the final lens.
  await page.locator(`[data-lens="${wrongInitialLens}"]`).click();
  await expect(page.locator(`[data-lens="${wrongInitialLens}"]`)).toHaveAttribute('aria-checked', 'true');

  await page.locator('#jsonInput').fill(JSON.stringify(data, null, 2));
  await expect(page.locator('#importBtn')).toBeEnabled();
  await page.locator('#importBtn').click();

  return data;
}

async function exportCurrentReport(page, testInfo, label) {
  const exportTab = page.locator(label === 'biopolitical' ? '[data-bio-review="exports"]' : '[data-review="exports"]');
  await expect(exportTab).toBeVisible();
  await exportTab.focus();
  await expect(exportTab).toBeFocused();
  await exportTab.press('Enter');
  await expect(exportTab).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#exportHtml')).toBeVisible();

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.locator('#exportHtml').click()
  ]);
  const filePath = testInfo.outputPath(`${label}-import-export.html`);
  await download.saveAs(filePath);
  await testInfo.attach(`${label}-import-export.html`, { path: filePath, contentType: 'text/html' });
  return fs.readFile(filePath, 'utf8');
}

test.describe('Imported analysis lens contract', () => {
  test('strategic JSON import overrides a biopolitical UI state', async ({ page }, testInfo) => {
    await importFixture(page, 'sample-analysis-en.json', 'biopolitical');

    await expect(page.locator('[data-lens="strategic"]')).toHaveAttribute('aria-checked', 'true');
    await expect(page.locator('[data-lens="biopolitical"]')).toHaveAttribute('aria-checked', 'false');
    await expect(page.locator('h1')).toContainText('Strategic');
    await expect(page.locator('#reviewTitle')).toContainText('Strategic');
    await expect(page.locator('#reviewContent')).toContainText('World War II');

    const html = await exportCurrentReport(page, testInfo, 'strategic');
    expect(html).toContain(`name="app-version" content="${EXPECTED_VERSION}"`);
    expect(html).toContain('name="analysis-lens" content="strategic"');
    expect(html).toContain('data-analysis-lens="strategic"');
    expect(html).toContain('data-export-contract-lens="strategic"');
    expect(html).toContain('Strategic Analysis Report');
    expect(html).toContain('Interests → Actors → Tools → Narrative → Results → Feedback');
    expect(html).not.toContain('Biopolitical Analysis Report');
  });

  test('biopolitical JSON import overrides a strategic UI state', async ({ page }, testInfo) => {
    await importFixture(page, 'sample-analysis-bio-en.json', 'strategic');

    await expect(page.locator('[data-lens="biopolitical"]')).toHaveAttribute('aria-checked', 'true');
    await expect(page.locator('[data-lens="strategic"]')).toHaveAttribute('aria-checked', 'false');
    await expect(page.locator('h1')).toContainText('Biopolitical');
    await expect(page.locator('#reviewTitle')).toContainText('Biopolitical');
    await expect(page.locator('#reviewContent')).toContainText(/Digital health passes/i);

    const html = await exportCurrentReport(page, testInfo, 'biopolitical');
    expect(html).toContain(`name="app-version" content="${EXPECTED_VERSION}"`);
    expect(html).toContain('name="analysis-lens" content="biopolitical"');
    expect(html).toContain('data-analysis-lens="biopolitical"');
    expect(html).toContain('data-export-contract-lens="biopolitical"');
    expect(html).toContain('Biopolitical Analysis Report');
    expect(html).toContain('name="analysis-contract" content="biopolitical-training-map-v2"');
    expect(html).toContain('name="schema-version" content="2.1.0"');
    expect(html).toContain('Actors &amp; populations');
    expect(html).not.toContain('Strategic Analysis Report');
  });

  test('strategic imports remove non-portable assistant citations before export', async ({ page }, testInfo) => {
    const data = await readFixture('sample-analysis-en.json');
    data.subject.executive_thesis = 'Portable strategic thesis. \uE200cite\uE202turn8search1\uE201';
    data.evidence.items[0].source_note = 'Portable source note. \uE200filecite\uE202turn0file0\uE202L2-L4\uE201';
    await page.goto('/');
    await page.locator('#langEn').click();
    await page.locator('#jsonInput').fill(JSON.stringify(data));
    await expect(page.locator('#importBtn')).toBeEnabled();
    await expect(page.locator('#jsonStatus')).toContainText(/2 non-portable assistant citation markers were removed/i);
    await page.locator('#importBtn').click();
    const html = await exportCurrentReport(page, testInfo, 'strategic');
    expect(html).toContain('Portable strategic thesis.');
    expect(html).toContain('Portable source note.');
    expect(html).not.toMatch(/[\uE000-\uF8FF]/);
    expect(html).not.toMatch(/turn8search1|turn0file0|filecite/);
  });

  test('legacy six-layer biopolitical JSON is migrated without hiding its gaps', async ({ page }) => {
    await importFixture(page, 'sample-analysis-bio-en.legacy-v1.json', 'strategic');

    await expect(page.locator('[data-lens="biopolitical"]')).toHaveAttribute('aria-checked', 'true');
    await expect(page.locator('#reviewContent')).toContainText('Legacy Biopolitical import migrated to v2');
    await expect(page.locator('#reviewContent')).toContainText('Separate governing actors from affected populations');

    const actors = page.locator('[data-bio-pillar="actors_institutions"]');
    await actors.focus();
    await expect(actors).toBeFocused();
    await actors.press('Enter');
    await expect(page.locator('[data-bio-review="pillars"]')).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('[data-bio-acc="actors_institutions"]')).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#reviewContent')).toContainText('Vaccinated, tested, and uncertified persons');
  });
});
