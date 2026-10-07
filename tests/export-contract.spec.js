import { test, expect } from '@playwright/test';
import fs from 'node:fs/promises';
import { PRODUCT_VERSION as EXPECTED_VERSION } from './helpers/product-version.mjs';

async function exportSampleReport(page, testInfo, lens) {
  await page.goto('./');
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

async function exportImportedStrategic(page, testInfo, data, name) {
  await page.goto('./');
  await expect(page.locator('#copyPromptBtn')).toBeVisible();
  await page.locator('#langEn').click();
  await page.locator('#jsonInput').fill(JSON.stringify(data));
  await expect(page.locator('#importBtn')).toBeEnabled();
  await page.locator('#importBtn').click();
  const exportTab = page.locator('[data-review="exports"]');
  await exportTab.click();
  await expect(page.locator('#exportHtml')).toBeVisible();
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.locator('#exportHtml').click()
  ]);
  const filePath = testInfo.outputPath(`${name}.html`);
  await download.saveAs(filePath);
  return fs.readFile(filePath, 'utf8');
}

const strategicFixture = async (name) =>
  JSON.parse(await fs.readFile(`${process.cwd()}/fixtures/${name}`, 'utf8'));

test.describe('Strategic HTML report content', () => {
  test('the hero states capped decision readiness, coverage and the quality gate', async ({ page }, testInfo) => {
    const html = await exportSampleReport(page, testInfo, 'strategic');
    const hero = html.match(/<section class="hero">[\s\S]*?<\/section>/)[0];

    expect(hero).toContain('Decision readiness');
    expect(hero).toContain('Analytical coverage');
    expect(hero).toContain('Quality gate');
    expect(hero).toMatch(/Approved|Blocked/);
    expect(hero).toContain('Decision readiness is capped by source traceability and independent review.');
    expect(hero).not.toContain('Overall index');
  });

  test('an Arabic report keeps source URLs left-to-right', async ({ page }, testInfo) => {
    const data = await strategicFixture('sample-analysis-ar.json');
    data.evidence.items[0].source_url = 'https://www.un.org/en/about-us/history-of-the-un';
    const html = await exportImportedStrategic(page, testInfo, data, 'ar-source-url');
    expect(html).toContain('dir="rtl"');

    await page.setContent(html);
    const link = page.locator('a.sourceUrl').first();
    await expect(link).toBeVisible();
    expect(await link.evaluate((el) => getComputedStyle(el).direction)).toBe('ltr');
  });

  test('report file names follow the lens and keep French ligatures', async ({ page }) => {
    const exportedName = async (data, tab) => {
      await page.goto('./');
      await expect(page.locator('#copyPromptBtn')).toBeVisible();
      await page.locator('#langEn').click();
      await page.locator('#jsonInput').fill(JSON.stringify(data));
      await expect(page.locator('#importBtn')).toBeEnabled();
      await page.locator('#importBtn').click();
      await page.locator(tab).click();
      await expect(page.locator('#exportHtml')).toBeVisible();
      const [download] = await Promise.all([
        page.waitForEvent('download'),
        page.locator('#exportHtml').click()
      ]);
      return download.suggestedFilename();
    };

    const untitled = await strategicFixture('sample-analysis-bio-en.json');
    untitled.subject.title = '';
    expect(await exportedName(untitled, '[data-bio-review="exports"]')).toBe('analysis-biopolitical-v2-report.html');

    const french = await strategicFixture('sample-analysis-fr.json');
    french.subject.title = 'Main-d’œuvre et cœur de l’Europe';
    expect(await exportedName(french, '[data-review="exports"]')).toBe('main-d-oeuvre-et-coeur-de-l-europe-report.html');
  });

  test('source type codes read as words in the evidence view and the report', async ({ page }, testInfo) => {
    const data = await strategicFixture('sample-analysis-ar.json');
    const [first] = data.evidence.items;
    first.source_type = 'internal_sample';
    data.evidence.items.push({ ...structuredClone(first), id: 'E2', source_type: 'none' });
    const html = await exportImportedStrategic(page, testInfo, data, 'ar-source-type');
    const body = html.replace(/<script type="application\/json" id="canonical-analysis">[\s\S]*?<\/script>/, '');
    expect(body).not.toContain('internal_sample');
    expect(body).not.toMatch(/ · none\b/);

    await page.locator('[data-review="evidence"]').click();
    const ledger = page.locator('.evidenceLedger');
    await expect(ledger).toBeVisible();
    await expect(ledger).not.toContainText('internal_sample');
    await expect(ledger).not.toContainText(/ · none\b/);
  });

  test('an interest without a rationale does not print its raw stakes code', async ({ page }, testInfo) => {
    const data = await strategicFixture('sample-analysis-ar.json');
    delete data.interests[0].rationale;
    const html = await exportImportedStrategic(page, testInfo, data, 'ar-no-rationale');

    expect(html).toContain('dir="rtl"');
    expect(html).not.toContain('<p>existential</p>');
  });
});
