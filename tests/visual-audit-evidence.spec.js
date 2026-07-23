import { test, expect } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";

const EXPECTED_VERSION = "2.1.0-alpha.44";
const EVIDENCE_DIR = process.env.VISUAL_AUDIT_EVIDENCE_DIR || "visual-audit-evidence-local";
const LOCALES = [
  { id: "ar", dir: "rtl", button: "#langAr" },
  { id: "en", dir: "ltr", button: "#langEn" },
  { id: "fr", dir: "ltr", button: "#langFr" },
];
const THEMES = ["light", "dark"];
const VIEWPORTS = [
  { id: "desktop", width: 1440, height: 1000 },
  { id: "tablet", width: 834, height: 1112 },
  { id: "phone", width: 390, height: 844 },
];
const REPORT_VIEWPORTS = VIEWPORTS.filter(({ id }) => id !== "tablet");
const SCREENSHOT_KINDS = ["shell", "strategic-results", "workspace-health", "biopolitical-results", "connections", "review-ledger", "resolution-transaction", "import-audit"];
const REPORT_DETAIL_SURFACES = [
  { id: "pillar", selector: "#pillar-question_context" },
  { id: "relationships", selector: "#relationships" },
  { id: "references", selector: "#references" },
  { id: "canonical", selector: "#canonical" },
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

async function anchorViewport(page, selector, offset = 16) {
  await page.locator(selector).evaluate((element, topOffset) => {
    const top = element.getBoundingClientRect().top + window.scrollY - topOffset;
    window.scrollTo({ top: Math.max(0, top), left: 0, behavior: "instant" });
  }, offset);
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}

async function writeJson(testInfo, fileName, value) {
  await ensureEvidenceDir();
  const filePath = evidencePath(fileName);
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  await testInfo.attach(fileName, { path: filePath, contentType: "application/json" });
}

async function fixture(name) {
  return JSON.parse(await fs.readFile(path.join(process.cwd(), "fixtures", name), "utf8"));
}

const cases = LOCALES.flatMap((locale) => THEMES.flatMap((theme) =>
  VIEWPORTS.map((viewport) => ({ locale, theme, viewport })),
));
const reportCases = LOCALES.flatMap((locale) => REPORT_VIEWPORTS.map((viewport) => ({ locale, viewport })));

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
      await page.addInitScript(() => {
        Object.defineProperty(navigator, "storage", {
          configurable: true,
          value: {
            persisted: async () => false,
            estimate: async () => ({ usage: 25, quota: 100 }),
            persist: async () => false,
          },
        });
      });
      await page.goto("/");
      await expect(page.locator("html")).toHaveAttribute("lang", locale.id);
      await expect(page.locator("html")).toHaveAttribute("dir", locale.dir);
      await waitForVisualAssets(page);
      await page.evaluate(() => window.scrollTo(0, 0));
      await saveScreenshot(page, testInfo, `shell-${key}.png`);

      await page.locator('[data-lens="strategic"]').click();
      await page.locator("#loadSampleBtn").click();
      await expect(page.locator("#reviewPanel")).toBeVisible();
      await clearTransientUi(page);
      await anchorViewport(page, viewport.id === "phone" ? ".scoreSystemGrid" : "#reviewPanel", 12);
      await saveScreenshot(page, testInfo, `strategic-results-${key}.png`);

      await page.locator("#workspaceBtn").click();
      await expect(page.locator("#workspaceDialog")).toBeVisible();
      await expect(page.locator("#storageHealth")).toHaveAttribute("data-state", "best_effort");
      await saveScreenshot(page, testInfo, `workspace-health-${key}.png`);
      await page.locator("#workspaceClose").click();

      await page.locator('[data-lens="biopolitical"]').click();
      await page.locator("#loadSampleBtn").click();
      await expect(page.locator('[data-bio-review="overview"]')).toHaveAttribute("aria-selected", "true");
      await clearTransientUi(page);
      await anchorViewport(page, viewport.id === "phone" ? ".scoreSystemGrid" : "#reviewPanel", 12);
      await saveScreenshot(page, testInfo, `biopolitical-results-${key}.png`);

      await page.locator('[data-bio-review="connections"]').click();
      await expect(page.locator("#relationshipExplorerMount")).toBeVisible();
      await clearTransientUi(page);
      await anchorViewport(page, viewport.id === "phone" ? "#relationshipExplorerMount" : "#reviewPanel", 12);
      await saveScreenshot(page, testInfo, `connections-${key}.png`);

      const clippedRelationshipControls = await page.locator(".relationshipCommandBar button:visible").evaluateAll((buttons) =>
        buttons
          .map((button) => {
            const rect = button.getBoundingClientRect();
            let visibleLeft = 0;
            let visibleRight = innerWidth;
            for (let parent = button.parentElement; parent; parent = parent.parentElement) {
              if (!/(hidden|clip|auto|scroll)/.test(getComputedStyle(parent).overflowX)) continue;
              const parentRect = parent.getBoundingClientRect();
              visibleLeft = Math.max(visibleLeft, parentRect.left);
              visibleRight = Math.min(visibleRight, parentRect.right);
            }
            return { label: button.textContent?.trim(), rect, visibleLeft, visibleRight };
          })
          .filter(({ rect, visibleLeft, visibleRight }) => rect.left < visibleLeft - 1 || rect.right > visibleRight + 1)
          .map(({ label, rect, visibleLeft, visibleRight }) => ({ label, left: rect.left, right: rect.right, visibleLeft, visibleRight })),
      );
      expect(clippedRelationshipControls, JSON.stringify(clippedRelationshipControls, null, 2)).toEqual([]);

      // Phone evidence intentionally captures the accessible list. Open Map
      // only after that screenshot so every measurement still audits Story
      // geometry instead of treating the correct list fallback as missing data.
      if (await page.locator(".relationshipStoryFlow").count() === 0) {
        const mapView = page.locator('[data-map-view="map"]');
        await mapView.focus();
        await expect(mapView).toBeFocused();
        await mapView.press("Enter");
        await expect(mapView).toHaveAttribute("aria-pressed", "true");
        await expect(page.locator(".relationshipStoryFlow").first()).toBeVisible();
      }
      const storyGeometry = await page.locator(".relationshipStoryFlow").evaluateAll((flows) => flows.map((flow) => {
        const rect = flow.getBoundingClientRect();
        const overflowX = getComputedStyle(flow).overflowX;
        const childrenOutside = [...flow.children].filter((child) => {
          const childRect = child.getBoundingClientRect();
          return childRect.left < rect.left - 1 || childRect.right > rect.right + 1;
        }).length;
        return { overflowX, scrollWidth: flow.scrollWidth, clientWidth: flow.clientWidth, childrenOutside };
      }));
      for (const flow of storyGeometry) {
        const exposesScrollSurface = ["auto", "scroll"].includes(flow.overflowX) && flow.scrollWidth > flow.clientWidth;
        expect(flow.childrenOutside === 0 || exposesScrollSurface, JSON.stringify(flow)).toBe(true);
      }

      const activeBadge = page.locator('[data-bio-review="connections"] .badge');
      const activeBadgeContrast = await activeBadge.evaluate((badge) => {
        const parseColor = (value) => {
          const numbers = value.match(/[\d.]+/g)?.map(Number) || [];
          if (value.startsWith("color(srgb") && numbers.length >= 3) return numbers.slice(0, 3).map((number) => number * 255);
          if (value.startsWith("rgb") && numbers.length >= 3) return numbers.slice(0, 3);
          return null;
        };
        const luminance = (rgb) => {
          const channels = rgb.map((channel) => {
            const value = channel / 255;
            return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
          });
          return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
        };
        const style = getComputedStyle(badge);
        const foreground = parseColor(style.color);
        const background = parseColor(style.backgroundColor);
        if (!foreground || !background) return 0;
        const [lighter, darker] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
        return (lighter + 0.05) / (darker + 0.05);
      });
      expect(activeBadgeContrast).toBeGreaterThanOrEqual(4.5);

      const relationshipText = await page.locator("#relationshipExplorerMount").innerText();
      if (locale.id !== "en") {
        expect(relationshipText).not.toMatch(/\b(?:Enables|Classifies|Distributes|Resists)\b/);
        expect(relationshipText).not.toContain("litigation");
      }

      const measurement = await page.evaluate(({ clippedControlCount, story }) => ({
        app_version: document.querySelector('meta[name="app-version"]')?.content,
        html_lang: document.documentElement.lang,
        html_dir: document.documentElement.dir,
        viewport: { width: innerWidth, height: innerHeight },
        page_scroll_width: document.documentElement.scrollWidth,
        page_client_width: document.documentElement.clientWidth,
        body_text_length: document.body.innerText.length,
        visible_buttons: [...document.querySelectorAll("button")].filter((button) => button.getClientRects().length).length,
        clipped_relationship_controls: clippedControlCount,
        story_geometry: story,
      }), { clippedControlCount: clippedRelationshipControls.length, story: storyGeometry });
      expect(measurement.page_scroll_width).toBeLessThanOrEqual(measurement.page_client_width + 1);
      expect(measurement.body_text_length).toBeGreaterThan(1000);
      await writeJson(testInfo, `measurement-${key}.json`, measurement);

      await page.locator('[data-bio-review="inspection"]').click();
      const intelligence = page.locator("[data-evidence-intelligence]");
      await intelligence.locator("summary").click();
      await expect(page.locator("#openReviewLedger")).toBeEnabled();
      await page.locator("#openReviewLedger").click();
      await expect(page.locator("#ledgerDialog")).toBeVisible();
      await saveScreenshot(page, testInfo, `review-ledger-${key}.png`);
      await page.locator("#ledgerClose").click();

      await page.locator("#workspaceBtn").click();
      await page.locator(".workspaceRow.active [data-workspace-edit]").click();
      await page.locator('[data-editor-path="/subject"]').click();
      const editorField = page.locator("#editorField");
      const subject = JSON.parse(await editorField.inputValue());
      subject.title = `${subject.title} · visual resolution`;
      await editorField.fill(JSON.stringify(subject, null, 2));
      await editorField.press("Control+Enter");
      await page.locator("#editorSave").click();
      await expect(page.locator("#editorResolve")).toBeEnabled();
      await page.locator("#editorResolve").click();
      await expect(page.locator("#resolutionDialog")).toBeVisible();
      await saveScreenshot(page, testInfo, `resolution-transaction-${key}.png`);
      await page.locator("#resolutionClose").click();

      const draft = await fixture(`sample-analysis-bio-${locale.id}.json`);
      draft.evidence.items[0].source_url = "not-a-url";
      draft.self_audit.statistics_quotations_verified = "pass";
      await page.locator("#jsonInput").fill(JSON.stringify(draft));
      await expect(page.locator("#importBtn")).toBeEnabled();
      await expect(page.locator("#importAuditDetails")).toBeVisible();
      await page.locator("#importAuditDetails").evaluate((details) => { details.open = true; });
      await anchorViewport(page, "#pasteCard", 12);
      await saveScreenshot(page, testInfo, `import-audit-${key}.png`);
    });
  }

  for (const reportCase of reportCases) {
    const { locale, viewport } = reportCase;
    const key = `${locale.id}-${viewport.id}`;
    test(`standalone-report-${key}`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto("/");
      await page.locator(locale.button).click();
      await page.locator("#analysisLang").selectOption(locale.id);
      await page.locator('[data-lens="biopolitical"]').click();
      await page.locator("#loadSampleBtn").click();
      await page.locator('[data-bio-review="exports"]').click();
      const [download] = await Promise.all([
        page.waitForEvent("download"),
        page.locator("#exportHtml").click(),
      ]);
      const downloadPath = testInfo.outputPath(`report-${key}.html`);
      await download.saveAs(downloadPath);
      const html = await fs.readFile(downloadPath, "utf8");
      await page.setContent(html, { waitUntil: "load" });
      await expect(page.locator("html")).toHaveAttribute("lang", locale.id);
      await expect(page.locator('[data-analysis-lens="biopolitical"]')).toBeVisible();
      const reportText = await page.locator("body").innerText();
      expect(reportText).not.toMatch(/[\uE000-\uF8FF]/);
      const reportOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(reportOverflow).toBeLessThanOrEqual(2);
      await page.evaluate(() => {
        document.documentElement.style.scrollBehavior = "auto";
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      });
      await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
      await expect(page.locator(".hero")).toBeInViewport();
      await saveScreenshot(page, testInfo, `report-${key}.png`);
      for (const surface of REPORT_DETAIL_SURFACES) {
        const section = page.locator(surface.selector);
        await section.evaluate((details) => { details.open = true; });
        await anchorViewport(page, surface.selector, 8);
        await expect(section).toBeInViewport();
        await saveScreenshot(page, testInfo, `report-${surface.id}-${key}.png`);
      }
    });
  }

  test.afterAll(async () => {
    const requiredFiles = cases.flatMap(({ locale, theme, viewport }) => {
      const key = `${locale.id}-${theme}-${viewport.id}`;
      return [...SCREENSHOT_KINDS.map((kind) => `${kind}-${key}.png`), `measurement-${key}.json`];
    });
    const reportFiles = reportCases.flatMap(({ locale, viewport }) => {
      const key = `${locale.id}-${viewport.id}`;
      return [
        `report-${key}.png`,
        ...REPORT_DETAIL_SURFACES.map((surface) => `report-${surface.id}-${key}.png`),
      ];
    });
    await ensureEvidenceDir();
    await fs.writeFile(evidencePath("visual-audit-metadata.json"), `${JSON.stringify({
      app_version: EXPECTED_VERSION,
      evidence_version: EXPECTED_VERSION,
      source_commit: process.env.GITHUB_SHA || process.env.SOURCE_COMMIT || "local-uncommitted",
      capture_set: "final-language-theme-viewport-audit",
      visual_assets_decoded: true,
      transient_ui_cleared: true,
      deterministic_viewport_anchors: true,
      report_top_anchor_verified: true,
      phone_connections_target: "relationshipExplorerMount",
      generated_by: "tests/visual-audit-evidence.spec.js",
      projects: ["chromium"],
      locales: LOCALES.map(({ id, dir }) => ({ id, dir })),
      themes: THEMES,
      viewports: VIEWPORTS,
      case_count: cases.length,
      report_case_count: reportCases.length,
      report_surface_count: 1 + REPORT_DETAIL_SURFACES.length,
      screenshot_count: cases.length * SCREENSHOT_KINDS.length + reportCases.length * (1 + REPORT_DETAIL_SURFACES.length),
      coverage: ["shell", "strategic-results", "workspace-health", "biopolitical-results", "connections", "review-ledger", "resolution-transaction", "import-audit", "standalone-report", "report-pillar", "report-relationships", "report-references", "report-canonical"],
      required_files: [...requiredFiles, ...reportFiles, "visual-audit-metadata.json"],
    }, null, 2)}\n`, "utf8");
  });
});
