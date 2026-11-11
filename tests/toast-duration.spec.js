import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
const source = readFileSync(new URL('../src/app.js', import.meta.url), 'utf8');
const toastCode = source.slice(source.indexOf('let toastTimer = 0;'), source.indexOf('function setTheme('));
for (const interaction of ['hover', 'focus']) {
  test(`critical toast pauses during ${interaction} and resumes afterward`, async ({ page }) => {
    await page.setContent('<div id="toast" class="j-toast"></div><button>Outside</button>');
    await page.clock.install();
    await page.addScriptTag({ content: 'const $ = id => document.getElementById(id);\n' + toastCode + '\nwindow.showToast = toast;' });
    await page.evaluate(() => window.showToast('Critical', 'crit'));
    const toast = page.locator('#toast');
    await page.clock.runFor(3000);
    await expect(toast).toHaveAttribute('data-open', 'true');
    if (interaction === 'hover') await toast.hover();
    else await toast.focus();
    await page.clock.runFor(12000);
    await expect(toast).toHaveAttribute('data-open', 'true');
    if (interaction === 'hover') await page.locator('button').hover();
    else await page.locator('button').focus();
    await page.clock.runFor(5100);
    await expect(toast).toHaveAttribute('data-open', 'false');
    await expect(toast).not.toHaveAttribute('tabindex');
  });
}
