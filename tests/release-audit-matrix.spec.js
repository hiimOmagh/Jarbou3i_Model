import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs/promises";
import path from "node:path";

const LOCALES = [
  { id: "ar", dir: "rtl", validationPrefix: "فشل التحقق من العقد" },
  { id: "en", dir: "ltr", validationPrefix: "Contract validation failed" },
  { id: "fr", dir: "ltr", validationPrefix: "Échec de validation du contrat" },
];
const THEMES = ["light", "dark"];

async function malformedAnalysis() {
  const source = await fs.readFile(
    path.join(process.cwd(), "fixtures", "sample-analysis-bio-en.json"),
    "utf8",
  );
  const analysis = JSON.parse(source);
  analysis.schema_version = "99.0.0";
  return JSON.stringify(analysis);
}

async function expectNoSeriousViolations(page) {
  const results = await new AxeBuilder({ page }).analyze();
  const blocking = results.violations.filter((violation) =>
    ["serious", "critical"].includes(violation.impact),
  );
  expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([]);
}

async function expectNoPageOverflow(page) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
  );
  expect(overflow).toBe(false);
}

async function synchronizeAuditState(page, locale, theme) {
  const html = page.locator("html");
  const languageButton = page.locator(`#lang${locale.id[0].toUpperCase()}${locale.id.slice(1)}`);
  if (await html.getAttribute("lang") !== locale.id) {
    await languageButton.focus();
    await expect(languageButton).toBeFocused();
    await languageButton.press("Enter");
  }
  await expect(html).toHaveAttribute("lang", locale.id);
  if (await page.locator("#analysisLang").inputValue() !== locale.id) {
    await page.locator("#analysisLang").selectOption(locale.id);
  }
  const wantsDark = theme === "dark";
  const isDark = await page.locator("body").evaluate((body) => body.classList.contains("dark"));
  if (isDark !== wantsDark) {
    const themeButton = page.locator("#themeBtn");
    await themeButton.focus();
    await expect(themeButton).toBeFocused();
    await themeButton.press("Enter");
  }
}

test.describe("Final release language, theme, viewport, and resilience audit", () => {
  for (const locale of LOCALES) {
    for (const theme of THEMES) {
      test(`${locale.id} ${theme} remains accessible, responsive, and failure-safe`, async ({ page }, testInfo) => {
        await page.emulateMedia({
          colorScheme: theme,
          reducedMotion: theme === "dark" ? "reduce" : "no-preference",
        });
        await page.addInitScript(
          ({ lang, savedTheme }) => {
            localStorage.setItem(
              "jarbou3i-model-settings",
              JSON.stringify({ lang, analysisLang: lang, theme: savedTheme }),
            );
          },
          { lang: locale.id, savedTheme: theme },
        );
        await page.goto("/");
        await synchronizeAuditState(page, locale, theme);

        await expect(page.locator("html")).toHaveAttribute("lang", locale.id);
        await expect(page.locator("html")).toHaveAttribute("dir", locale.dir);
        await expect(page.locator(`#lang${locale.id[0].toUpperCase()}${locale.id.slice(1)}`))
          .toHaveAttribute("aria-checked", "true");
        await expect(page.locator("#analysisLang")).toHaveValue(locale.id);
        await expect(page.locator("#themeBtn")).toHaveAttribute(
          "aria-pressed",
          theme === "dark" ? "true" : "false",
        );
        if (theme === "dark") await expect(page.locator("body")).toHaveClass(/dark/);
        else await expect(page.locator("body")).not.toHaveClass(/dark/);
        await expect(page.locator("#themeBtn")).toHaveAttribute("aria-label", /\S/);
        await expectNoPageOverflow(page);

        await page.locator('[data-lens="biopolitical"]').click();
        await page.locator("#jsonInput").fill(await malformedAnalysis());
        await expect(page.locator("#importBtn")).toBeDisabled();
        await expect(page.locator("#jsonStatus")).toContainText(locale.validationPrefix);
        await expect(page.locator("#jsonStatus")).toHaveClass(/bad/);

        await page.locator("#loadSampleBtn").click();
        await expect(page.locator("#reviewPanel")).toBeVisible();
        await page.locator('[data-bio-review="connections"]').click();
        await expect(page.locator("#relationshipExplorerMount")).toBeVisible();
        await expect(page.locator('[data-bio-review="connections"]')).toHaveAttribute(
          "aria-selected",
          "true",
        );

        const duplicateIds = await page.locator("[id]").evaluateAll((elements) => {
          const counts = new Map();
          for (const element of elements) counts.set(element.id, (counts.get(element.id) || 0) + 1);
          return [...counts.entries()].filter(([, count]) => count > 1).map(([id]) => id);
        });
        expect(duplicateIds).toEqual([]);

        const mobile = testInfo.project.name === "mobile-chrome";
        if (mobile) {
          await expect(page.locator('[data-map-view="list"]')).toHaveAttribute("aria-pressed", "true");
          await expect(page.locator('[data-map-view="spatial"]')).toBeDisabled();
          await expect(page.locator(".relationshipCapabilityNote")).toBeVisible();
        } else {
          await expect(page.locator('[data-map-view="map"]')).toHaveAttribute("aria-pressed", "true");
          await expect(page.locator('[data-map-view="spatial"]')).toBeEnabled();
        }

        await expectNoPageOverflow(page);
        await expectNoSeriousViolations(page);

        await page.emulateMedia({
          media: "print",
          colorScheme: theme,
          reducedMotion: theme === "dark" ? "reduce" : "no-preference",
        });
        await expect.poll(() => page.evaluate(() => matchMedia("print").matches)).toBe(true);
        await expect.poll(() => page.locator("body").evaluate((body) => {
          const style = getComputedStyle(body);
          return { color: style.color, backgroundColor: style.backgroundColor };
        })).toEqual({
          color: "rgb(17, 17, 17)",
          backgroundColor: "rgb(255, 255, 255)",
        });
        await expect(page.locator("#reviewPanel")).toBeVisible();
        await expectNoPageOverflow(page);
      });
    }
  }
});

test("system-color resilience and keyboard focus remain perceivable", async ({ page }, testInfo) => {
  const forcedColors = testInfo.project.name === "chromium";
  await page.emulateMedia({
    forcedColors: forcedColors ? "active" : "none",
    reducedMotion: "reduce",
  });
  await page.goto("/");
  await page.locator("#langEn").click();
  await page.locator('[data-lens="biopolitical"]').focus();
  await expect(page.locator('[data-lens="biopolitical"]')).toBeFocused();
  if (forcedColors) {
    await expect(page.locator('[data-lens="biopolitical"]')).toHaveCSS("outline-style", "solid");
  }
  await page.locator('[data-lens="biopolitical"]').press("Enter");
  await expect(page.locator('[data-lens="biopolitical"]')).toHaveAttribute("aria-checked", "true");
  await expectNoSeriousViolations(page);
});
