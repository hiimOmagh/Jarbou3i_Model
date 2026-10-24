import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs/promises";
import path from "node:path";
import { openStep } from "./helpers/guided-flow.js";
import { displayControl } from "./helpers/display-menu.js";

const LOCALES = [
  { id: "ar", dir: "rtl", validationPrefix: "فشل فحص الصيغة" },
  { id: "en", dir: "ltr", validationPrefix: "Format check failed" },
  { id: "fr", dir: "ltr", validationPrefix: "Échec du contrôle de format" },
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
  // A panel fading in blends its text into the background: end finite
  // animations first, so axe reads the colours that stay on screen.
  await page.evaluate(() => {
    for (const animation of document.getAnimations()) {
      if (animation.effect?.getComputedTiming().iterations !== Infinity) animation.finish();
    }
  });
  // Work queued for the next frames (a scroll into view) runs first: axe maps
  // the page once, then reads colours, so a later scroll mixes two states.
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
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
    await openStep(page, "settings");
    await page.locator("#analysisLang").selectOption(locale.id);
  }
  const wantsDark = theme === "dark";
  const isDark = await page.locator("body").evaluate((body) => body.classList.contains("dark"));
  if (isDark !== wantsDark) {
    const themeButton = await displayControl(page, "themeBtn");
    await themeButton.focus();
    await expect(themeButton).toBeFocused();
    await themeButton.press("Enter");
  }
}

test.describe("Final release language, theme, viewport, and resilience audit", () => {
  for (const locale of LOCALES) {
    for (const theme of THEMES) {
      test(`${locale.id} ${theme} remains accessible, responsive, and failure-safe`, async ({ page }) => {
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
        await page.goto("./");
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

        await openStep(page, "lens");
        await page.locator('[data-lens="biopolitical"]').click();
        await openStep(page, "answer");
        await page.locator("#jsonInput").fill(await malformedAnalysis());
        await expect(page.locator("#importBtn")).toBeDisabled();
        await expect(page.locator("#jsonStatus")).toContainText(locale.validationPrefix);
        await expect(page.locator("#jsonStatus")).toHaveAttribute("data-tone", "crit");

        // The pasted reply is not imported, so it is replaced on a second click.
        await page.locator("#loadSampleBtn").click();
        await page.locator("#loadSampleBtn").click();
        await expect(page.locator("#reviewPanel")).toBeVisible();
        const connectionsTab = page.locator('[data-bio-review="connections"]');
        await connectionsTab.focus();
        await expect(connectionsTab).toBeFocused();
        await connectionsTab.press("Enter");
        await expect(connectionsTab).toHaveAttribute("aria-current", "location");
        await expect(page.locator("#connMap")).toBeVisible();
        // The shell names the review as the current phase once it is open.
        await expect(page.locator('[data-shell-nav="review"]')).toHaveAttribute("aria-current", "step");

        const duplicateIds = await page.locator("[id]").evaluateAll((elements) => {
          const counts = new Map();
          for (const element of elements) counts.set(element.id, (counts.get(element.id) || 0) + 1);
          return [...counts.entries()].filter(([, count]) => count > 1).map(([id]) => id);
        });
        expect(duplicateIds).toEqual([]);

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
  await page.goto("./");
  await page.locator("#langEn").click();
  await openStep(page, "lens");
  await page.locator('[data-lens="biopolitical"]').focus();
  await expect(page.locator('[data-lens="biopolitical"]')).toBeFocused();
  if (forcedColors) {
    await expect(page.locator('[data-lens="biopolitical"]')).toHaveCSS("outline-style", "solid");
  }
  await openStep(page, "lens");
  await page.locator('[data-lens="biopolitical"]').press("Enter");
  await expect(page.locator('[data-lens="biopolitical"]')).toHaveAttribute("aria-checked", "true");
  await expectNoSeriousViolations(page);
});
