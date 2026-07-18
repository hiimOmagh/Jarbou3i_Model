import { test, expect } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";

const EXPECTED_VERSION = "2.0.0-bio-rc.11";
const EVIDENCE_DIR = process.env.VISUAL_AUDIT_EVIDENCE_DIR || "visual-audit-evidence-local";
const LOCALES = [
  { id: "ar", dir: "rtl" },
  { id: "en", dir: "ltr" },
  { id: "fr", dir: "ltr" },
];
const THEMES = ["light", "dark"];
const VIEWPORTS = [
  { id: "desktop", width: 1440, height: 1000 },
  { id: "tablet", width: 834, height: 1112 },
  { id: "phone", width: 390, height: 844 },
];

function evidencePath(fileName) {
  return path.join(process.cwd(), EVIDENCE_DIR, fileName);
}

async function ensureEvidenceDir() {
  await fs.mkdir(evidencePath(""), { recursive: true });
}

async function saveScreenshot(page, testInfo, fileName) {
  await ensureEvidenceDir();
  const filePath = evidencePath(fileName);
  await page.screenshot({ path: filePath, fullPage: false, animations: "disabled", caret: "hide" });
  await testInfo.attach(fileName, { path: filePath, contentType: "image/png" });
}

async function waitForVisualAssets(page) {
  const mascot = page.locator(".welcomeMascot");
  await expect.poll(() => mascot.evaluate((image) => image.complete && image.naturalWidth > 0)).toBe(true);
  await mascot.evaluate((image) => image.decode?.());
}

async function clearTransientUi(page) {
  const toast = page.locator("#toast");
  await expect(toast).not.toHaveClass(/\bshow\b/, { timeout: 5000 });
  await expect.poll(() => toast.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return rect.top >= window.innerHeight || rect.bottom <= 0;
  })).toBe(true);
}

async function writeJson(testInfo, fileName, value) {
  await ensureEvidenceDir();
  const filePath = evidencePath(fileName);
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  await testInfo.attach(fileName, { path: filePath, contentType: "application/json" });
}

const cases = LOCALES.flatMap((locale) => THEMES.flatMap((theme) =>
  VIEWPORTS.map((viewport) => ({ locale, theme, viewport })),
));

test.describe("Release Candidate visual audit evidence", () => {
  for (const auditCase of cases) {
    const { locale, theme, viewport } = auditCase;
    const key = `${locale.id}-${theme}-${viewport.id}`;
    test(key, async ({ page }, testInfo) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.addInitScript(
        ({ lang, savedTheme }) => localStorage.setItem(
          "jarbou3i-model-settings",
          JSON.stringify({ lang, analysisLang: lang, theme: savedTheme }),
        ),
        { lang: locale.id, savedTheme: theme },
      );
      await page.goto("/");
      await expect(page.locator("html")).toHaveAttribute("lang", locale.id);
      await expect(page.locator("html")).toHaveAttribute("dir", locale.dir);
      await waitForVisualAssets(page);
      await saveScreenshot(page, testInfo, `shell-${key}.png`);

      await page.locator('[data-lens="biopolitical"]').click();
      await page.locator("#loadSampleBtn").click();
      await page.locator('[data-bio-review="connections"]').click();
      await expect(page.locator("#relationshipExplorerMount")).toBeVisible();
      await clearTransientUi(page);
      await page.locator(viewport.id === "phone" ? "#relationshipExplorerMount" : "#reviewPanel").scrollIntoViewIfNeeded();
      await saveScreenshot(page, testInfo, `connections-${key}.png`);

      const measurement = await page.evaluate(() => ({
        app_version: document.querySelector('meta[name="app-version"]')?.content,
        html_lang: document.documentElement.lang,
        html_dir: document.documentElement.dir,
        viewport: { width: innerWidth, height: innerHeight },
        page_scroll_width: document.documentElement.scrollWidth,
        page_client_width: document.documentElement.clientWidth,
        body_text_length: document.body.innerText.length,
        visible_buttons: [...document.querySelectorAll("button")].filter((button) => button.getClientRects().length).length,
      }));
      expect(measurement.page_scroll_width).toBeLessThanOrEqual(measurement.page_client_width + 1);
      expect(measurement.body_text_length).toBeGreaterThan(1000);
      await writeJson(testInfo, `measurement-${key}.json`, measurement);
    });
  }

  test.afterAll(async () => {
    const requiredFiles = cases.flatMap(({ locale, theme, viewport }) => {
      const key = `${locale.id}-${theme}-${viewport.id}`;
      return [`shell-${key}.png`, `connections-${key}.png`, `measurement-${key}.json`];
    });
    await ensureEvidenceDir();
    await fs.writeFile(evidencePath("visual-audit-metadata.json"), `${JSON.stringify({
      app_version: EXPECTED_VERSION,
      evidence_version: EXPECTED_VERSION,
      capture_set: "final-language-theme-viewport-audit",
      visual_assets_decoded: true,
      transient_ui_cleared: true,
      phone_connections_target: "relationshipExplorerMount",
      generated_by: "tests/visual-audit-evidence.spec.js",
      projects: ["chromium"],
      locales: LOCALES.map(({ id, dir }) => ({ id, dir })),
      themes: THEMES,
      viewports: VIEWPORTS,
      case_count: cases.length,
      screenshot_count: cases.length * 2,
      required_files: [...requiredFiles, "visual-audit-metadata.json"],
    }, null, 2)}\n`, "utf8");
  });
});
