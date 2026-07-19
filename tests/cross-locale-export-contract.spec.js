import { test, expect } from '@playwright/test';
import fs from 'node:fs/promises';

const EXPECTED_VERSION = '2.1.0-alpha.6';

const LOCALES = [
  { id: 'ar', button: '#langAr', dir: 'rtl' },
  { id: 'en', button: '#langEn', dir: 'ltr' },
  { id: 'fr', button: '#langFr', dir: 'ltr' }
];

const LENSES = [
  {
    id: 'strategic',
    title: 'Strategic Analysis Report',
    chain: 'Interests → Actors → Tools → Narrative → Results → Feedback',
    forbidden: 'Biopolitical Analysis Report'
  },
  {
    id: 'biopolitical',
    title: {
      ar: 'تقرير التحليل الحيوسياسي — خريطة التدريب 2',
      en: 'Biopolitical Analysis Report — Training Map v2',
      fr: 'Rapport d’analyse biopolitique — Carte d’entraînement v2'
    },
    chain: {
      ar: 'السؤال ← الوظيفة الإنسانية ← منظومة القوة',
      en: 'Question → Human function → Power system',
      fr: 'Question → Fonction humaine → Système de pouvoir'
    },
    forbidden: 'Strategic Analysis Report'
  }
];

async function exportLocalizedSample(page, testInfo, locale, lens) {
  await page.goto('/');
  await expect(page.locator('#copyPromptBtn')).toBeVisible();

  await page.locator(locale.button).click();
  await expect(page.locator('html')).toHaveAttribute('lang', locale.id);
  await expect(page.locator('html')).toHaveAttribute('dir', locale.dir);
  await page.locator('#analysisLang').selectOption(locale.id);

  await page.locator(`[data-lens="${lens.id}"]`).click();
  await expect(page.locator(`[data-lens="${lens.id}"]`)).toHaveAttribute('aria-checked', 'true');

  await page.locator('#loadSampleBtn').click();
  await expect(page.locator('#reviewPanel')).toBeVisible();
  await expect(page.locator('#reviewContent')).toContainText(/\S/);

  const exportTab = page.locator(lens.id === 'biopolitical' ? '[data-bio-review="exports"]' : '[data-review="exports"]');
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
  const filePath = testInfo.outputPath(`${locale.id}-${lens.id}-export.html`);
  await download.saveAs(filePath);
  await testInfo.attach(`${locale.id}-${lens.id}-export.html`, { path: filePath, contentType: 'text/html' });
  return fs.readFile(filePath, 'utf8');
}

test.describe('Cross-locale HTML export contract', () => {
  for (const locale of LOCALES) {
    for (const lens of LENSES) {
      test(`${locale.id} ${lens.id} export keeps machine-readable lens metadata`, async ({ page }, testInfo) => {
        const html = await exportLocalizedSample(page, testInfo, locale, lens);

        expect(html).toContain(`<html lang="${locale.id}" dir="${locale.dir}"`);
        expect(html).toContain(`name="app-version" content="${EXPECTED_VERSION}"`);
        expect(html).toContain(`name="analysis-lens" content="${lens.id}"`);
        expect(html).toContain(`data-analysis-lens="${lens.id}"`);
        expect(html).toContain(`data-export-contract-lens="${lens.id}"`);
        expect(html).toContain(typeof lens.title === 'string' ? lens.title : lens.title[locale.id]);
        expect(html).toContain(typeof lens.chain === 'string' ? lens.chain : lens.chain[locale.id]);
        if (lens.id === 'biopolitical') {
          expect(html).toContain('name="analysis-contract" content="biopolitical-training-map-v2"');
          expect(html).toContain('name="schema-version" content="2.1.0"');
        }
        expect(html).not.toContain(lens.forbidden);
      });
    }
  }
});
