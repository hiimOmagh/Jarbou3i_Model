import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { openStep } from "./helpers/guided-flow.js";
import { expectKernel } from "./helpers/kernel-check.js";

async function expectNoSeriousViolations(page) {
  // A panel fading in blends its text into the background: end finite
  // animations first, so axe reads the colours that stay on screen.
  await page.evaluate(() => {
    for (const animation of document.getAnimations()) {
      if (animation.effect?.getComputedTiming().iterations !== Infinity) animation.finish();
    }
  });
  const results = await new AxeBuilder({ page }).analyze();
  const serious = results.violations.filter((violation) =>
    ["serious", "critical"].includes(violation.impact),
  );
  expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
}

test("runtime accessibility and keyboard contract", async ({ page }) => {
  await page.goto("./");
  await expect(page.locator("html")).toHaveAttribute("lang", /^(ar|en|fr)$/);
  await expect(page.locator("#toast")).toHaveAttribute("role", "status");
  await expect(page.locator("#modalBackdrop")).toHaveAttribute(
    "aria-hidden",
    "true",
  );
  await expectNoSeriousViolations(page);

  await page.locator("#langAr").focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.locator("#langEn")).toBeFocused();
  await expect(page.locator("#langEn")).toHaveAttribute("aria-checked", "true");

  await openStep(page, "lens");
  await page.locator('[data-lens="strategic"]').focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.locator('[data-lens="biopolitical"]')).toBeFocused();
  await expect(page.locator('[data-lens="biopolitical"]')).toHaveAttribute(
    "aria-checked",
    "true",
  );

  await page.locator("#loadSampleBtn").click();
  // The review is one document, the case file: its outline marks where the
  // reader is and jumps to a section from the keyboard.
  await expect(page.locator("nav#reviewNav")).toBeVisible();
  await expect(page.locator('#reviewNav [aria-current="location"]')).toHaveCount(1);

  const pillarsEntry = page.locator('[data-bio-review="pillars"]');
  await pillarsEntry.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#case-pillars")).toBeFocused();
  await expect(pillarsEntry).toHaveAttribute("aria-current", "location");
  await expect(page.locator("#case-pillars")).toHaveAttribute("aria-label", /\S/);

  const accordion = page.locator('[data-bio-acc="question_context"]');
  await expect(accordion).toHaveAttribute("aria-expanded", "false");
  await accordion.click();
  await expect(accordion).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#bio-acc-panel-question_context")).toBeVisible();
  // A layer on the engine map opens its pillar in the case file.
  const actorsStep = page.locator('[data-bio-pillar="actors_institutions"]');
  await actorsStep.focus();
  await actorsStep.press("Enter");
  await expect(page.locator('[data-bio-acc="actors_institutions"]')).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator('[data-bio-acc="actors_institutions"]')).toBeFocused();

  await openStep(page, "prompt");
  const previewButton = page.locator("#previewPromptBtn");
  await previewButton.click();
  await expect(page.locator("#modalDialog")).toBeFocused();
  await expect(page.locator("#modalClose")).toHaveAttribute("aria-label", "Close preview");
  await expectKernel(page, "#modalBackdrop", "#modalDialog");
  await page.keyboard.press("Escape");
  await expect(previewButton).toBeFocused();

  await page.locator("#workspaceSaveState").click();
  await page.locator("#workLife [data-life-action=\"edit\"]").click();
  await page.locator('[data-editor-path="/subject"]').click();
  const field = page.locator("#editorField");
  const subject = JSON.parse(await field.inputValue());
  subject.title = `${subject.title} accessibility resolution`;
  await field.fill(JSON.stringify(subject));
  await field.press("Control+Enter");
  await page.locator("#editorSave").click();
  const resolutionButton = page.locator("#editorResolve");
  await resolutionButton.click();
  await expect(page.locator("#resolutionDialog")).toBeFocused();
  await expectNoSeriousViolations(page);
  await page.keyboard.press("Escape");
  await expect(page.locator("#workspaceSaveState")).toBeFocused();

  await expectNoSeriousViolations(page);
});

// Lowest WCAG contrast between each visible text element and every opaque stop of its own fill.
function auditFilledText(selector) {
  const channels = (value) => value.match(/[\d.]+/g).slice(0, 4).map(Number);
  const luminance = ([r, g, b]) => {
    const linear = (c) => ((c /= 255) <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
    return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
  };
  const contrast = (a, b) => {
    const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (hi + 0.05) / (lo + 0.05);
  };
  return [...document.querySelectorAll(selector)].flatMap((element) => {
    const style = getComputedStyle(element);
    if (!element.getClientRects().length || !(element.innerText || "").trim()) return [];
    if (!style.color.startsWith("rgb") || (!style.backgroundImage.includes("gradient") && !style.backgroundColor.startsWith("rgb"))) return [];
    const fills = style.backgroundImage.includes("gradient")
      ? [...style.backgroundImage.matchAll(/rgba?\([^)]+\)/g)].map((match) => channels(match[0]))
      : [channels(style.backgroundColor)];
    if (fills.some((fill) => fill.length === 4 && fill[3] < 1)) return [];
    const text = channels(style.color);
    const ratio = Math.min(...fills.map((fill) => contrast(text, fill)));
    return [{ id: element.id || element.className, ratio: Number(ratio.toFixed(2)) }];
  });
}

// Measure settled colors, not values midway through a CSS transition.
const settleTransitions = (page) =>
  page.evaluate(() => Promise.all(document.getAnimations().map((animation) => animation.finished.catch(() => {}))));

for (const colorScheme of ["light", "dark"]) {
  test(`an error toast keeps readable text in ${colorScheme} theme`, async ({ page }) => {
    await page.emulateMedia({ colorScheme });
    await page.goto("./");
    await page.locator("#langEn").click();
    await openStep(page, "prompt");
    await page.locator("#copyPromptBtn").click();
    await expect(page.locator("#toast")).toHaveClass(/\bbad\b/);
    await settleTransitions(page);
    const audited = await page.evaluate(auditFilledText, "#toast.show");
    expect(audited.map((entry) => entry.id)).toEqual(["toast"]);
    expect(audited.filter((entry) => entry.ratio < 4.5)).toEqual([]);
  });
}

test("every review section is titled and described in every language and lens", async ({ page }) => {
  await page.goto("./");
  for (const lens of ["strategic", "biopolitical"]) {
    for (const lang of ["Ar", "En", "Fr"]) {
      await page.locator(`#lang${lang}`).click();
      await openStep(page, "lens");
      await page.locator(`[data-lens="${lens}"]`).click();
      await page.locator("#loadSampleBtn").click();
      await expect(page.locator("#reviewNav button").first()).toBeVisible();
      const untitled = await page.locator("#reviewNav button").evaluateAll((entries) =>
        entries
          .filter((entry) => !entry.querySelector("strong")?.textContent.trim() || !entry.querySelector("small")?.textContent.trim())
          .map((entry) => entry.dataset.review || entry.dataset.bioReview),
      );
      expect(untitled, `${lens}/${lang}`).toEqual([]);
    }
  }
});

test("loading or importing an analysis moves focus to the review heading", async ({ page }) => {
  await page.goto("./");
  await page.locator("#loadSampleBtn").click();
  await expect(page.locator("#reviewTitle")).toBeFocused();

  await openStep(page, "answer");
  const analysis = JSON.parse(await page.locator("#jsonInput").inputValue());
  analysis.subject.title = `${analysis.subject.title} (again)`;
  await page.locator("#jsonInput").fill(JSON.stringify(analysis));
  await expect(page.locator("#importBtn")).toBeEnabled();
  await page.locator("#importBtn").click();
  await expect(page.locator("#reviewTitle")).toBeFocused();
});

test("a newer toast is not dismissed by an older toast's timer, and duplicated status toasts stay silent", async ({ page }) => {
  await page.goto("./");
  await openStep(page, "prompt");
  await page.locator("#copyPromptBtn").click();
  await expect(page.locator("#toast")).toHaveAttribute("aria-live", "off");
  await page.waitForTimeout(2000);
  await page.locator("#previewPromptBtn").click();
  await expect(page.locator("#toast")).toHaveAttribute("aria-live", "polite");
  await page.waitForTimeout(900);
  await expect(page.locator("#toast")).toHaveClass(/\bshow\b/);
});
