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
    await expect(page.locator("#case-evidence")).toHaveAttribute("aria-label", "Evidence & assumptions");

    await openStep(page, "lens");
    await page.locator('[data-lens="biopolitical"]').click();
    await page.locator("#loadSampleBtn").click();
    await expect(page.locator("#case-conclusion")).toBeAttached();
    expect(await sectionIds(page)).toEqual(["overview", "pillars", "connections", "evidence", "conclusion", "inspection", "exports"].map((key) => `case-${key}`));
  });

  test("the model's own checks read as its claims, not as verification", async ({ page }) => {
    await page.goto("./");
    await page.locator("#langEn").click();
    await openStep(page, "lens");
    await page.locator('[data-lens="biopolitical"]').click();
    await page.locator("#loadSampleBtn").click();
    const conclusion = page.locator("#case-conclusion");
    await expect(conclusion).toContainText("a pass is its claim, not a verification");
    const audit = conclusion.locator('[data-records="self-audit"]');
    await expect(audit.locator(".j-status").first()).toBeVisible();
    await expect(audit.locator('.j-status[data-tone="ok"]')).toHaveCount(0);
    // The concern stays in view; the passes are folded under their count.
    await expect(audit.locator(".j-status")).toHaveCount(1);
    const passed = conclusion.locator("[data-self-audit-passed]");
    await expect(passed.locator(":scope > summary")).toHaveText("17 checks it says it passed");
    await passed.locator(":scope > summary").click();
    await expect(passed.locator(".j-status")).toHaveCount(17);

    // A record names the fields that do not apply on one line.
    const facts = page.locator("#case-evidence .j-rec-facts");
    await expect(facts.locator("dd", { hasText: /^Not applicable$/ })).toHaveCount(0);
    await expect(facts.locator("dt", { hasText: /^Not applicable$/ }).first().locator("xpath=following-sibling::dd")).toContainText("Denominator");
  });

  test("an evidence record is drawn once, in its own section", async ({ page }) => {
    await page.goto("./");
    await page.locator("#langEn").click();
    await openStep(page, "lens");
    await page.locator('[data-lens="biopolitical"]').click();
    await page.locator("#loadSampleBtn").click();
    await expect(page.locator('#case-evidence [data-inspection-id="E1"]')).toHaveCount(1);
    await expect(page.locator('#case-pillars [data-inspection-id="E1"]')).toHaveCount(0);
    // Its layer says where the records are and goes there.
    await page.locator('[data-bio-acc="evidence_explanations"]').click();
    await page.locator("#bio-acc-panel-evidence_explanations [data-bio-jump]").click();
    await expect(page.locator("#case-evidence")).toBeFocused();
    await expect(page.locator('#reviewNav [data-bio-review="evidence"]')).toHaveAttribute("aria-current", "location");
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

  test("the layers ride one line, a station each, with no box", async ({ page }) => {
    await page.goto("./");
    await page.locator("#langAr").click();
    await page.locator("#loadSampleBtn").click();
    const layers = page.locator("#case-pillars .j-layer");
    await expect(layers).toHaveCount(6);
    // In Arabic the line runs down the right, through each ring's centre.
    const lines = () => layers.evaluateAll((all) => all.map((layer) => {
      const box = layer.getBoundingClientRect();
      const ring = layer.querySelector(".j-layer-n").getBoundingClientRect();
      const line = getComputedStyle(layer, "::before");
      const lineLeft = box.right - parseFloat(line.right) - parseFloat(line.width);
      const body = layer.querySelector(".j-layer-body");
      return {
        border: getComputedStyle(layer).borderTopWidth,
        offCentre: Math.abs(ring.left + ring.width / 2 - (lineLeft + parseFloat(line.width) / 2)),
        shown: line.display !== "none",
        clear: body.hidden || body.getBoundingClientRect().right - parseFloat(getComputedStyle(body).paddingRight) <= lineLeft,
      };
    }));
    const closed = await lines();
    for (const layer of closed) {
      expect(layer.border).toBe("0px");
      expect(layer.offCentre).toBeLessThan(1);
    }
    // The line ends at the last station while that layer is closed.
    expect(closed.map((layer) => layer.shown)).toEqual([true, true, true, true, true, false]);
    // Open, the last layer's stretch runs beside its records, clear of them.
    await page.locator("#case-pillars .j-layer-head").last().click();
    const open = (await lines()).at(-1);
    expect(open.shown).toBe(true);
    expect(open.clear).toBe(true);
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

  test("on a phone the case file holds one card less, comes sooner, and leads back to its outline", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("./");
    await page.locator("#langEn").click();
    // Before an analysis the model map explains each layer.
    await expect(page.locator(".j-engine-text").first()).toBeVisible();
    await page.locator("#loadSampleBtn").click();
    // With one, the case file holds the descriptions: the map keeps names
    // and records, each stop one short row.
    await expect(page.locator(".j-engine-text").first()).toBeHidden();
    const heights = await page.locator(".j-engine-step").evaluateAll((steps) => steps.map((step) => step.getBoundingClientRect().height));
    for (const height of heights) expect(height).toBeLessThanOrEqual(48);
    // A section uses the width: one card around it, not three.
    const section = await page.locator("#case-overview").boundingBox();
    expect(section.width).toBeGreaterThanOrEqual(330);
    // The outline is one line of stations scrolled sideways, so the verdict
    // comes soon; the page itself never scrolls sideways.
    const nav = page.locator("#reviewNav");
    const tops = await nav.locator(".j-case-link").evaluateAll((links) => links.map((link) => Math.round(link.getBoundingClientRect().top)));
    expect(new Set(tops).size).toBe(1);
    expect((await nav.boundingBox()).height).toBeLessThanOrEqual(130);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
    // Reading a section whose station is past the line's edge brings that
    // station into the line's view.
    await page.evaluate(() => document.getElementById("case-evidence").scrollIntoView({ block: "start" }));
    const evidenceStop = page.locator('#reviewNav [data-review="evidence"]');
    await expect(evidenceStop).toHaveAttribute("aria-current", "location");
    await expect.poll(async () => {
      const [stop, line] = await Promise.all([evidenceStop.boundingBox(), nav.boundingBox()]);
      return stop.x >= line.x - 1 && stop.x + stop.width <= line.x + line.width + 1;
    }).toBe(true);
    await page.evaluate(() => window.scrollTo(0, 0));
    // Counts wrap as one line of figures, not a column of boxes.
    const counts = await page.locator(".j-idir-head > .j-stats").boundingBox();
    expect(counts.height).toBeLessThanOrEqual(64);
    expect(await page.locator(".j-idir-head > .j-stats > span").first().evaluate((count) => getComputedStyle(count).backgroundColor)).toBe("rgba(0, 0, 0, 0)");

    const back = page.locator("#caseOutlineReturn");
    await expect(back).toBeHidden();
    await page.locator('#reviewNav [data-review="evidence"]').click();
    await expect(back).toBeInViewport();
    await expect(back).toHaveText("Back to the outline");
    await back.click();
    await expect(page.locator("#reviewNav")).toBeInViewport();
    await expect(page.locator('#reviewNav [data-review="evidence"]')).toBeFocused();
    await expect(back).toBeHidden();

    // Beside the document, the outline stays in reach on its own.
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.locator('#reviewNav [data-review="evidence"]').click();
    await expect(back).toBeHidden();
  });
});
