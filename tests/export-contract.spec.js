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

async function exportImportedStrategic(page, testInfo, data, name, ui = 'En') {
  await page.goto('./');
  await expect(page.locator('#copyPromptBtn')).toBeVisible();
  await page.locator(`#lang${ui}`).click();
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

  test('the report keeps the research question and every authored evidence field', async ({ page }, testInfo) => {
    const data = await strategicFixture('sample-analysis-en.json');
    const [item] = data.evidence.items;
    // What a reader sees: the embedded canonical JSON is left out.
    const html = (await exportImportedStrategic(page, testInfo, data, 'authored-fields')).replace(/<script[\s\S]*?<\/script>/g, '');
    const escape = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
    expect(html).toContain(escape(data.subject.question));
    expect(html).toContain(escape(item.source_note));
    expect(html).toContain(escape(item.uncertainty));
    expect(html).toContain(`${item.evidence_strength}/5`);
    // A confidence reads as one, not as a bare level.
    expect(html).not.toMatch(/<em>(High|Medium|Low)<\/em>/);
  });

  test('a French report names confidence levels as written in French', async ({ page }, testInfo) => {
    const data = await strategicFixture('sample-analysis-fr.json');
    data.actors[0].category = 'société civile';
    const html = await exportImportedStrategic(page, testInfo, data, 'fr-confidence', 'Fr');
    expect(html).toContain('<em>Confiance élevée</em>');
    // No capital after an accented letter ("éLevéE", "SociéTé").
    expect(html).not.toMatch(/<em>[^<]*\p{Ll}\p{Lu}[^<]*<\/em>/u);
  });

  test('an Arabic report states its model in reading order', async ({ page }, testInfo) => {
    const data = await strategicFixture('sample-analysis-ar.json');
    const html = await exportImportedStrategic(page, testInfo, data, 'ar-subtitle', 'Ar');
    expect(html).toContain('المصالح ← الفاعلون ← الأدوات');
    expect(html).not.toContain('→');
  });

  test('Arabic Biopolitical links point from source to target, also between English names', async ({ page }, testInfo) => {
    // Every row that names two records with an arrow between them, and
    // whether its arrow points from the first to the second as laid out: on
    // one line the second lies the way the arrow points; a long row wraps
    // the second onto a later line.
    const linkDirections = (selector) => page.evaluate((rowSelector) => {
      const found = [];
      for (const row of document.querySelectorAll(rowSelector)) {
        const chips = [...row.children].filter((child) => child.matches('.referenceChip'));
        const glyph = row.textContent.includes('←') ? -1 : row.textContent.includes('→') ? 1 : 0;
        if (chips.length !== 2 || !glyph) continue;
        const [from, to] = chips.map((chip) => chip.getBoundingClientRect());
        const oneLine = from.top < to.bottom && to.top < from.bottom;
        const forward = oneLine ? (to.left + to.width / 2 - from.left - from.width / 2) * glyph > 0 : to.top > from.top;
        found.push([row.textContent.trim().slice(0, 60), forward]);
      }
      return found;
    }, selector);

    await page.goto('./');
    await page.locator('#langAr').click();
    await page.locator('#analysisLang').selectOption('en');
    await page.locator('[data-lens="biopolitical"]').click();
    await page.locator('#loadSampleBtn').click();
    await expect(page.locator('#reviewPanel')).toBeVisible();

    await page.locator('[data-bio-review="pillars"]').click();
    const mechanisms = page.locator('[data-bio-acc="mechanisms_infrastructure"]');
    if ((await mechanisms.getAttribute('aria-expanded')) !== 'true') await mechanisms.click();
    const listed = await linkDirections('.bioRecord .itemTitle');
    expect(listed.length).toBeGreaterThan(0);
    expect(listed.filter(([, forward]) => !forward)).toEqual([]);

    // The report follows the analysis language: an Arabic analysis whose
    // records keep English names ("WHO", "EU").
    await page.locator('[data-bio-review="exports"]').click();
    await Promise.all([page.waitForEvent('download'), page.locator('#exportHtml').click()]);
    const html = await page.evaluate(() => {
      const bio = window.Jarbou3iBiopolitics;
      const analysis = bio.sample('en');
      analysis.language = 'ar';
      return window.Jarbou3iBiopoliticalReport.build({ analysis, lang: 'ar', version: 'test', bio, graphApi: window.Jarbou3iBiopoliticsGraph });
    });
    expect(html).toContain('dir="rtl"');
    await page.setContent(html);
    await page.evaluate(() => document.querySelectorAll('details').forEach((details) => { details.open = true; }));
    const reported = await linkDirections('.edgeList li, .recordCard h3');
    expect(reported.length).toBeGreaterThan(0);
    expect(reported.filter(([, forward]) => !forward)).toEqual([]);

    // A link whose ends name no record keeps its IDs as plain text.
    await page.goto('./');
    await page.locator('#loadSampleBtn').waitFor();
    const unresolved = await page.evaluate(async () => {
      const bio = window.Jarbou3iBiopolitics;
      const analysis = bio.sample('ar');
      analysis.links.push({ ...analysis.links[0], id: 'L99', from: 'ZZ1', to: 'ZZ2' });
      const lines = bio.recordsFor('mechanisms_infrastructure', analysis, 'ar').map((record) => record.title);
      return lines.find((title) => title.includes('ZZ1'));
    });
    await page.setContent(`<!doctype html><html lang="ar" dir="rtl"><body><h3 id="link">${unresolved}</h3></body></html>`);
    const forward = await page.evaluate(() => {
      const node = document.getElementById('link').firstChild;
      const rect = (word) => {
        const range = document.createRange();
        const start = node.textContent.indexOf(word);
        range.setStart(node, start);
        range.setEnd(node, start + word.length);
        return range.getBoundingClientRect();
      };
      const glyph = node.textContent.includes('←') ? -1 : 1;
      return (rect('ZZ2').left - rect('ZZ1').left) * glyph > 0;
    });
    expect(forward).toBe(true);
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

    // A long title ends at a whole word, never on a dash.
    const long = await strategicFixture('sample-analysis-en.json');
    long.subject.title = 'Digital health passes, conditional mobility and the long afterlife of emergency public health powers in Europe';
    expect(await exportedName(long, '[data-review="exports"]')).toBe(
      'digital-health-passes-conditional-mobility-and-the-long-afterlife-of-report.html',
    );
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
