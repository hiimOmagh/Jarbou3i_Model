import { test, expect } from "@playwright/test";

const LOCALES = [
  { id: "ar", dir: "rtl", topic: "الوصول إلى الخدمات العامة والأدلة الصحية" },
  { id: "en", dir: "ltr", topic: "Access to public services and health evidence" },
  { id: "fr", dir: "ltr", topic: "Accès aux services publics et preuves sanitaires" },
];
const THEMES = ["light", "dark"];
const REFLOW_WIDTHS = [
  { width: 640, height: 900, equivalentZoom: 200 },
  { width: 320, height: 800, equivalentZoom: 400 },
];

async function expectNoPageOverflow(page) {
  await expect.poll(() => page.evaluate(() => ({
    scroll: document.documentElement.scrollWidth,
    client: document.documentElement.clientWidth,
  }))).toEqual(expect.objectContaining({ client: expect.any(Number) }));
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
  );
  expect(overflow).toBe(false);
}

test.describe("Release Candidate 200% and 400% equivalent reflow audit", () => {
  for (const locale of LOCALES) {
    for (const theme of THEMES) {
      for (const viewport of REFLOW_WIDTHS) {
        test(`${locale.id} ${theme} at ${viewport.equivalentZoom}% equivalent reflows without loss`, async ({ page }) => {
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
          await expectNoPageOverflow(page);

          await page.locator('[data-lens="biopolitical"]').click();
          await page.locator("#topicInput").fill(locale.topic);
          const preview = page.locator("#previewPromptBtn");
          await preview.focus();
          await preview.press("Enter");
          await expect(page.locator("#modalBackdrop")).toHaveClass(/show/);
          await expect(page.locator(".modal")).toBeFocused();
          const modalBounds = await page.locator(".modal").boundingBox();
          expect(modalBounds).not.toBeNull();
          expect(modalBounds.width).toBeLessThanOrEqual(viewport.width);
          expect(modalBounds.height).toBeLessThanOrEqual(viewport.height);
          await page.keyboard.press("Escape");
          await expect(preview).toBeFocused();

          await page.locator("#loadSampleBtn").click();
          const connectionsTab = page.locator('[data-bio-review="connections"]');
          await connectionsTab.focus();
          await connectionsTab.press("Enter");
          await expect(page.locator('[data-bio-review="connections"]')).toHaveAttribute("aria-selected", "true");
          await expect(page.locator('[data-map-view="list"]')).toHaveAttribute("aria-pressed", "true");
          await expect(page.locator('[data-map-view="spatial"]')).toBeDisabled();
          await expectNoPageOverflow(page);

          const visibleRecord = page.locator('.relationshipList [data-map-node]').first();
          await expect(visibleRecord).toBeVisible();
          await visibleRecord.focus();
          await visibleRecord.press("Enter");
          await expect(page.locator("#referenceInspectorTitle")).toBeVisible();
          const inspectorBounds = await page.locator(".referenceInspector").boundingBox();
          expect(inspectorBounds).not.toBeNull();
          expect(inspectorBounds.x).toBeGreaterThanOrEqual(0);
          expect(inspectorBounds.width).toBeLessThanOrEqual(viewport.width + 1);
          await page.keyboard.press("Escape");
          await expect(visibleRecord).toBeFocused();

          const undersizedTargets = await page.locator("button:visible:not([disabled])").evaluateAll((buttons) =>
            buttons
              .map((button) => ({ label: button.getAttribute("aria-label") || button.textContent?.trim(), rect: button.getBoundingClientRect() }))
              .filter(({ rect }) => rect.width > 0 && rect.height > 0 && (rect.width < 24 || rect.height < 24))
              .map(({ label, rect }) => ({ label, width: rect.width, height: rect.height })),
          );
          expect(undersizedTargets, JSON.stringify(undersizedTargets, null, 2)).toEqual([]);
          await expectNoPageOverflow(page);
        });
      }
    }
  }
});
