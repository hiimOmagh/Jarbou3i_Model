import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { openStep } from "./helpers/guided-flow.js";

// The review as the UX-0 case file (ADR-0002): one document in reading order,
// with an outline that jumps to a section and marks where the reader is.
const sectionIds = (page) => page.$$eval("#reviewContent > .j-case-sec", (sections) => sections.map((section) => section.id));

test.describe("Case file", () => {
  test("reads as one document in both lenses, in reading order", async ({ page }) => {
    await page.goto("./");
    await page.locator("#langEn").click();
    await page.locator("#loadSampleBtn").click();
    await expect(page.locator("#case-exports")).toBeAttached();
    expect(await sectionIds(page)).toEqual(["overview", "pillars", "contradictions", "scenarios", "evidence", "inspection", "exports"].map((key) => `case-${key}`));
    await expect(page.locator("#case-evidence")).toHaveAttribute("aria-label", "Evidence");

    await openStep(page, "lens");
    await page.locator('[data-lens="biopolitical"]').click();
    await page.locator("#loadSampleBtn").click();
    await expect(page.locator("#case-conclusion")).toBeAttached();
    expect(await sectionIds(page)).toEqual(["overview", "pillars", "connections", "evidence", "conclusion", "inspection", "exports"].map((key) => `case-${key}`));
  });

  test("the outline jumps to a section and follows the reader", async ({ page }) => {
    await page.goto("./");
    await page.locator("#langEn").click();
    await page.locator("#loadSampleBtn").click();
    const entry = (key) => page.locator(`#reviewNav [data-review="${key}"]`);
    await expect(entry("overview")).toHaveAttribute("aria-current", "location");

    await entry("scenarios").click();
    await expect(page.locator("#case-scenarios")).toBeFocused();
    await expect(page.locator("#case-scenarios")).toBeInViewport();
    await expect(entry("scenarios")).toHaveAttribute("aria-current", "location");
    await expect(page.locator('#reviewNav [aria-current="location"]')).toHaveCount(1);

    // Scrolling by hand moves the mark to the section at the top of the view.
    await page.evaluate(() => window.scrollTo(0, document.getElementById("case-pillars").getBoundingClientRect().top + window.scrollY));
    await expect(entry("pillars")).toHaveAttribute("aria-current", "location");
  });

  test("the relationship map loads only once its section is in view", async ({ page }) => {
    await page.goto("./");
    await page.locator("#langEn").click();
    await openStep(page, "lens");
    await page.locator('[data-lens="biopolitical"]').click();
    await page.locator("#loadSampleBtn").click();
    await expect(page.locator("#case-connections")).toBeAttached();
    expect(await page.locator('link[data-relationship-explorer-styles="true"]').count()).toBe(0);
    await page.locator('#reviewNav [data-bio-review="connections"]').click();
    await expect(page.locator(".relationshipExplorer")).toBeVisible();
  });

  test("Show in map opens the record in the relationship map", async ({ page }) => {
    await page.goto("./");
    await page.locator("#langEn").click();
    await openStep(page, "lens");
    await page.locator('[data-lens="biopolitical"]').click();
    await page.locator("#loadSampleBtn").click();
    await page.locator('#reviewNav [data-bio-review="evidence"]').click();
    await page.locator('#case-evidence [data-reference-id="E1"]').first().click();
    await page.locator("#referenceShowMap").click();
    await expect(page.locator('#case-connections [data-map-node="E1"]')).toBeFocused();
    await expect(page.locator('#reviewNav [data-bio-review="connections"]')).toHaveAttribute("aria-current", "location");
  });

  test("speaks the page language and keeps its contracts and contrast", async ({ page }) => {
    await page.goto("./");
    await page.locator("#langAr").click();
    await page.locator("#loadSampleBtn").click();
    await expect(page.locator("#reviewNav")).toHaveAttribute("aria-label", "المخطط");
    const problems = await page.evaluate(async () => {
      const { checkContracts } = await import("./src/ui/contracts.js");
      return checkContracts(document.getElementById("reviewPanel"));
    });
    expect(problems).toEqual([]);
    const { violations } = await new AxeBuilder({ page }).include("#reviewNav").analyze();
    const serious = violations.filter((violation) => ["serious", "critical"].includes(violation.impact));
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
  });
});
