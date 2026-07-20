import { test, expect } from '@playwright/test';
import fs from 'node:fs/promises';

const EXPECTED_VERSION = '2.1.0-alpha.17';

async function exportSampleReport(page, testInfo, lens) {
  await page.goto('/');
  await expect(page.locator('#copyPromptBtn')).toBeVisible();

  // Sample content is localized; pin English before asserting English sample tokens.
  await page.locator('#langEn').click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await page.locator('#analysisLang').selectOption('en');

  if (lens === 'biopolitical') {
    await page.locator('[data-lens="biopolitical"]').click();
    await expect(page.locator('[data-lens="biopolitical"]')).toHaveAttribute('aria-checked', 'true');
  } else {
    await page.locator('[data-lens="strategic"]').click();
    await expect(page.locator('[data-lens="strategic"]')).toHaveAttribute('aria-checked', 'true');
  }

  await page.locator('#loadSampleBtn').click();
  await expect(page.locator('#reviewPanel')).toBeVisible();
  await expect(page.locator('#reviewContent')).toContainText(/\S/);
  const exportTab = page.locator(lens === 'biopolitical' ? '[data-bio-review="exports"]' : '[data-review="exports"]');
  await exportTab.click();
  await expect(exportTab).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#exportHtml')).toBeVisible();

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.locator('#exportHtml').click()
  ]);
  const filePath = testInfo.outputPath(`${lens}-export.html`);
  await download.saveAs(filePath);
  await testInfo.attach(`${lens}-export.html`, { path: filePath, contentType: 'text/html' });
  return fs.readFile(filePath, 'utf8');
}

function expectAll(html, tokens) {
  for (const token of tokens) expect(html).toContain(token);
}

function expectNone(html, tokens) {
  for (const token of tokens) expect(html).not.toContain(token);
}

test.describe('HTML export lens contract', () => {
  test('strategic export keeps the strategic report contract', async ({ page }, testInfo) => {
    const html = await exportSampleReport(page, testInfo, 'strategic');

    expectAll(html, [
      `name="app-version" content="${EXPECTED_VERSION}"`,
      'name="analysis-lens" content="strategic"',
      'data-analysis-lens="strategic"',
      'data-export-contract-lens="strategic"',
      'Strategic Analysis Report',
      'Interests',
      'Actors',
      'Tools',
      'Narrative',
      'Results',
      'Feedback',
      'Interests → Actors → Tools → Narrative → Results → Feedback'
    ]);

    expectNone(html, [
      'Biopolitical Analysis Report',
      'Problematization → Populations / Subjects → Governance Techniques',
      'Populations / Subjects',
      'Governance Techniques',
      'Norms / Subjectivation',
      'Embodied / Social Outcomes',
      'Resistance / Normalization Feedback'
    ]);
  });

  test('biopolitical export keeps the biopolitical report contract', async ({ page }, testInfo) => {
    const html = await exportSampleReport(page, testInfo, 'biopolitical');

    expectAll(html, [
      `name="app-version" content="${EXPECTED_VERSION}"`,
      'name="analysis-lens" content="biopolitical"',
      'data-analysis-lens="biopolitical"',
      'data-export-contract-lens="biopolitical"',
      'name="analysis-contract" content="biopolitical-training-map-v2"',
      'name="schema-version" content="2.1.0"',
      'data-analysis-contract="biopolitical-training-map-v2"',
      'data-schema-version="2.1.0"',
      'Biopolitical Analysis Report',
      'Question &amp; context',
      'Human functions',
      'Actors &amp; populations',
      'Mechanisms &amp; infrastructure',
      'Meaning &amp; classification',
      'Intervention &amp; capture test',
      'Distribution &amp; effects',
      'Evidence &amp; explanations',
      'Agency &amp; alternatives',
      'Digital health passes',
      'Public-health authorities'
    ]);

    expectAll(html, [
      'data-publication-gate="blocked"',
      'class="reportToc"',
      'Not publication-ready',
      'Decision readiness',
      'Capped by source traceability and independent human review.',
      'Analytical coverage',
      'data-canonical-contract="complete"'
    ]);
    expect(html).not.toMatch(/[\uE000-\uF8FF]/);

    expectNone(html, [
      'Strategic Analysis Report',
      'Interests → Actors → Tools → Narrative → Results → Feedback'
    ]);
  });
});
