import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs/promises";
import path from "node:path";
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

  // One idea, one word: a station names its section in the words of the
  // section's own heading, in each language and lens (Arabic's article and
  // French elision aside), and an English title is in sentence case.
  test("each outline station uses its section's own words", async ({ page }) => {
    test.skip(test.info().project.name !== "chromium", "the words are the same in every engine");
    const words = (text) => text.toLocaleLowerCase().split(/[\s,&’']+/u).filter(Boolean).map((word) => word.replace(/^ال/u, ""));
    await page.goto("./");
    for (const lens of ["strategic", "biopolitical"]) {
      await openStep(page, "lens");
      await page.locator(`[data-lens="${lens}"]`).click();
      await page.locator("#loadSampleBtn").click();
      await expect(page.locator(lens === "biopolitical" ? "#case-conclusion" : "#case-scenarios")).toBeAttached();
      for (const lang of ["En", "Fr", "Ar"]) {
        await page.locator(`#lang${lang}`).click();
        await expect(page.locator("html")).toHaveAttribute("lang", lang.toLowerCase());
        const pairs = await page.locator("#reviewNav .j-case-link").evaluateAll((links) => links.map((link) => {
          const key = link.dataset.review || link.dataset.bioReview;
          return [link.querySelector("strong").textContent, document.querySelector(`#case-${key} h3`).textContent];
        }));
        const drift = pairs.filter(([station, heading]) => !words(station).every((word) => words(heading).includes(word)));
        expect.soft(drift, `${lens} ${lang}`).toEqual([]);
        if (lang === "En") await expect.soft(page.locator("#reviewTitle")).toHaveText(/^[A-Z][a-z]+ analysis review$/);
        // The verdict and the score rule say it in plain words.
        if (lang === "En") await expect.soft(page.locator("#case-overview")).not.toContainText(/epistemic|structurally/i);
      }
    }
  });

  // A Bio case fills in after the scroll; the page still lands on its top.
  for (const way of ["sample", "import"]) {
    test(`a Bio case opened by ${way} lands on the top of the review`, async ({ page }) => {
      await page.goto("./");
      await page.locator("#langEn").click();
      if (way === "sample") {
        await openStep(page, "lens");
        await page.locator('[data-lens="biopolitical"]').click();
        await page.locator("#loadSampleBtn").click();
      } else {
        await openStep(page, "answer");
        await page.locator("#jsonInput").fill(await fs.readFile(path.join(process.cwd(), "fixtures", "sample-analysis-bio-en.json"), "utf8"));
        await page.locator("#importBtn").click();
      }
      await expect(page.locator("#case-conclusion")).toBeAttached();
      const top = await page.locator("#reviewPanel").evaluate((el) => el.getBoundingClientRect().top);
      expect(top).toBeGreaterThanOrEqual(0);
      expect(top).toBeLessThanOrEqual(24);
    });
  }

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
    // Rows under rules, not boxes: the concern's rule is in its tone, beside its label.
    const concern = await audit.locator(':scope > [data-tone="warn"]').evaluate((row) => {
      const style = getComputedStyle(row);
      return { side: style.borderInlineStartWidth, rule: style.borderBlockStartWidth, wash: style.backgroundColor };
    });
    expect(concern).toEqual({ side: "0px", rule: "2px", wash: "rgba(0, 0, 0, 0)" });
    await expect(conclusion.locator("[data-self-audit-notes] > li").first()).toBeVisible();
    await expect(conclusion.locator(".j-note", { hasText: "a pass is its claim" })).toHaveCount(0);
    const passed = conclusion.locator("[data-self-audit-passed]");
    await expect(passed.locator(":scope > summary")).toHaveText("17 checks it says it passed");
    await passed.locator(":scope > summary").click();
    await expect(passed.locator(".j-status")).toHaveCount(17);

    // A record names the fields that do not apply on one line.
    const facts = page.locator("#case-evidence .j-rec-facts");
    await expect(facts.locator("dd", { hasText: /^Not applicable$/ })).toHaveCount(0);
    await expect(facts.locator("dt", { hasText: /^Not applicable$/ }).first().locator("xpath=following-sibling::dd")).toContainText("Denominator");
  });

  // A figure reads as what it measures, never as a pass the case has not
  // earned: no score is green under a closed gate, finding no audit concern
  // is not shown as a clean audit, and high confidence on weak evidence says so.
  test("no figure reads as a pass the case has not earned", async ({ page }) => {
    await page.goto("./");
    await page.locator("#langEn").click();
    for (const lens of ["strategic", "biopolitical"]) {
      await openStep(page, "lens");
      await page.locator(`[data-lens="${lens}"]`).click();
      await page.locator("#loadSampleBtn").click();
      await expect(page.locator(lens === "biopolitical" ? "#case-conclusion" : "#case-scenarios")).toBeAttached();
      await expect(page.locator('#reviewContent [data-metric] .j-brief-bar:not([data-tone])').first()).toBeAttached();
      await expect(page.locator('#reviewContent :is(.j-brief-bar, .j-stats > span)[data-tone="ok"]')).toHaveCount(0);
      await expect(page.locator(".j-idir-head .j-stats")).not.toContainText("Audit concerns");
      if (lens === "strategic") {
        await expect(page.locator('#case-evidence [data-inspection-id="E1"] .j-chip[data-tone="warn"]')).toHaveText("High confidence on weak evidence");
        await expect(page.locator('[data-explanation-section] .j-chip[data-tone="warn"]')).toHaveText(["High confidence on weak evidence"]);
      }
    }
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

  // A long record shows its first four facts and folds the rest under one
  // line that counts them; a short one shows every fact.
  test("a long record folds its facts after the first four", async ({ page }) => {
    test.skip(test.info().project.name !== "chromium", "Rendering rule, engine-independent.");
    const counts = { en: "13 more details", ar: "13 تفصيلًا آخر", fr: "13 autres détails" };
    await page.goto("./");
    await openStep(page, "lens");
    await page.locator('[data-lens="biopolitical"]').click();
    for (const lang of ["en", "ar", "fr"]) {
      await page.locator(`#lang${lang[0].toUpperCase()}${lang[1]}`).click();
      await page.locator("#loadSampleBtn").click();
      const record = page.locator('#case-evidence [data-inspection-id="E1"]');
      await expect(record.locator(":scope > .j-rec-facts > div")).toHaveCount(4);
      const more = record.locator(":scope > .j-rec-more");
      await expect(more.locator(":scope > summary")).toHaveText(counts[lang]);
      await expect(more).not.toHaveAttribute("open");
      await expect(more.locator(".j-rec-facts > div")).toHaveCount(13);
    }
    // Opened, the rest read like the first four, connections and all.
    await page.locator("#langEn").click();
    const record = page.locator('#case-evidence [data-inspection-id="E1"]');
    await record.locator(".j-rec-more > summary").click();
    await expect(record.locator(".j-rec-more dt", { hasText: /^Linked from$/ })).toBeVisible();
    // No card shows more than six facts at once; a card of six or fewer has no fold.
    const cards = await page.locator('[data-records="bio"] > li > .j-rec').evaluateAll((items) => items.map((item) => ({
      shown: item.querySelectorAll(":scope > .j-rec-facts > div").length,
      folded: item.querySelectorAll(":scope > .j-rec-more .j-rec-facts > div").length,
    })));
    expect(cards.filter((card) => card.shown > 6 || (card.folded && (card.shown !== 4 || card.folded < 3)))).toEqual([]);
    expect(cards.filter((card) => card.folded).length).toBeGreaterThan(0);
    // Printed, the case file is whole: every fold opens, and closes after.
    const closed = page.locator("#reviewContent details:not([open])");
    const before = await closed.count();
    expect(before).toBeGreaterThan(0);
    await page.evaluate(() => window.dispatchEvent(new Event("beforeprint")));
    await expect(closed).toHaveCount(0);
    await page.evaluate(() => window.dispatchEvent(new Event("afterprint")));
    await expect(closed).toHaveCount(before);
    await expect(record.locator(".j-rec-more")).toHaveAttribute("open", "");
  });

  // The overview ends on one line for its detailed diagnostics: its name and
  // how many items block publishing, each listed once in the gate inside.
  test("the detailed diagnostics fold under one line that counts what blocks publishing", async ({ page }) => {
    test.skip(test.info().project.name !== "chromium", "Rendering rule, engine-independent.");
    const counts = {
      strategic: { en: "1 item to fix before publishing", ar: "بند واحد يجب إصلاحه قبل النشر", fr: "1 point à corriger avant publication" },
      biopolitical: { en: "5 items to fix before publishing", ar: "5 بنود يجب إصلاحها قبل النشر", fr: "5 points à corriger avant publication" },
    };
    await page.goto("./");
    for (const lens of ["strategic", "biopolitical"]) {
      await openStep(page, "lens");
      await page.locator(`[data-lens="${lens}"]`).click();
      for (const lang of ["en", "ar", "fr"]) {
        await page.locator(`#lang${lang[0].toUpperCase()}${lang[1]}`).click();
        await page.locator("#loadSampleBtn").click();
        const fold = page.locator("#case-overview [data-diagnostics]");
        await expect(fold).not.toHaveAttribute("open");
        const count = fold.locator(":scope > summary small");
        const items = await fold.locator('[data-diagnostic="gate"] li').count();
        await expect(count).toHaveText(counts[lens][lang]);
        expect(counts[lens][lang]).toContain(String(items === 1 && lang === "ar" ? "واحد" : items));
      }
      await page.locator("#langEn").click();
      const fold = page.locator("#case-overview [data-diagnostics]");
      await expect(fold.locator(":scope > summary")).toHaveText(/^Detailed diagnostics/);
      await expect(page.locator('[data-diagnostic="scores"]')).toBeHidden();
      // The case file prints whole.
      await page.evaluate(() => window.dispatchEvent(new Event("beforeprint")));
      await expect(fold).toHaveAttribute("open", "");
      await page.evaluate(() => window.dispatchEvent(new Event("afterprint")));
      await expect(fold).not.toHaveAttribute("open");
      await fold.locator(":scope > summary").click();
      await expect(page.locator('[data-diagnostic="scores"]')).toBeVisible();
    }
  });

  // Changing the language draws the case file again: the folds the reader
  // opened stay open; another answer starts with them closed.
  test("opened folds stay open when the case file is drawn again", async ({ page }) => {
    test.skip(test.info().project.name !== "chromium", "Rendering rule, engine-independent.");
    await page.goto("./");
    await page.locator("#langEn").click();
    await openStep(page, "lens");
    await page.locator('[data-lens="biopolitical"]').click();
    await page.locator("#loadSampleBtn").click();
    const diagnostics = page.locator("#case-overview [data-diagnostics]");
    const more = page.locator("#case-evidence .j-rec-more");
    await diagnostics.locator(":scope > summary").click();
    await more.nth(1).locator(":scope > summary").click();
    const openFolds = () => page.locator("#reviewContent details[open]").evaluateAll((folds) => folds.length);
    expect(await openFolds()).toBe(2);
    for (const lang of ["ar", "fr"]) {
      await page.locator(`#lang${lang[0].toUpperCase()}${lang[1]}`).click();
      await expect(diagnostics).toHaveAttribute("open", "");
      await expect(more.nth(0)).not.toHaveAttribute("open");
      await expect(more.nth(1)).toHaveAttribute("open", "");
      expect(await openFolds()).toBe(2);
    }
    await page.locator("#loadSampleBtn").click();
    await expect(diagnostics).not.toHaveAttribute("open");
    expect(await openFolds()).toBe(0);
  });

  // Every record is already drawn in its section: the directory folds them
  // under one line, layer by layer, and its search opens the fold.
  test("the inspection directory folds every record, each layer named once", async ({ page }) => {
    test.skip(test.info().project.name !== "chromium", "Rendering rule, engine-independent.");
    await page.goto("./");
    await page.locator("#langEn").click();
    for (const [lens, query] of [["strategic", "historical power"], ["biopolitical", "competing"]]) {
      await openStep(page, "lens");
      await page.locator(`[data-lens="${lens}"]`).click();
      await page.locator("#loadSampleBtn").click();
      const fold = page.locator("#case-inspection [data-inspection-records]");
      const items = page.locator("[data-inspection-directory-item]");
      await expect(fold).not.toHaveAttribute("open");
      await expect(fold.locator(":scope > summary")).toHaveText("Every record");
      await expect(items.first()).toBeHidden();
      const layers = await fold.locator("[data-inspection-layer]").evaluateAll((groups) => groups.map((group) => [
        group.querySelector("h4").firstChild.textContent.trim(),
        Number(group.querySelector("h4 .j-chip").textContent),
        group.querySelectorAll("[data-inspection-directory-item]").length,
        [...group.querySelectorAll("[data-inspection-directory-item] .j-chip")].map((chip) => chip.textContent),
      ]));
      const names = layers.map(([name]) => name);
      expect(new Set(names).size).toBe(names.length);
      expect(layers.every(([, count, records]) => count === records)).toBe(true);
      expect(layers.reduce((sum, [, count]) => sum + count, 0)).toBe(await items.count());
      expect(layers.flatMap(([, , , chips]) => chips).filter((chip) => names.includes(chip))).toEqual([]);

      const search = page.locator("#inspectionSearch");
      await search.fill(query);
      await expect(fold).toHaveAttribute("open", "");
      const shown = await items.evaluateAll((rows) => rows.filter((row) => row.checkVisibility()).map((row) => row.dataset.inspectionSearch));
      expect(shown.length).toBeGreaterThan(0);
      expect(shown.every((text) => text.includes(query))).toBe(true);
      expect(await fold.locator("[data-inspection-layer]").evaluateAll((groups) => groups.filter((group) => group.checkVisibility()).length)).toBeLessThan(layers.length);
      await search.fill("");
      await expect(fold).not.toHaveAttribute("open");
      expect(await fold.locator("[data-inspection-layer][hidden]").count()).toBe(0);
    }
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

  test("on a phone, a station reached by keyboard comes fully into the outline's view", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("./");
    await page.locator("#langEn").click();
    await page.locator("#loadSampleBtn").click();
    const nav = page.locator("#reviewNav");
    const stops = nav.locator(".j-case-link");
    await stops.first().focus();
    for (let index = 1; index < (await stops.count()); index += 1) {
      await page.keyboard.press("Tab");
      await expect(stops.nth(index)).toBeFocused();
      await expect.poll(async () => {
        const [stop, line] = await Promise.all([stops.nth(index).boundingBox(), nav.boundingBox()]);
        return stop.x >= line.x - 1 && stop.x + stop.width <= line.x + line.width + 1;
      }).toBe(true);
    }
  });

  test("the skip link leads to the review once a case is open, in the page language", async ({ page }) => {
    await page.goto("./");
    await page.locator("#langEn").click();
    const skip = page.locator(".j-skip");
    await expect(skip).toHaveAttribute("href", "#workflowPanel");
    await page.locator("#loadSampleBtn").click();
    await expect(skip).toHaveAttribute("href", "#reviewPanel");
    await expect(skip).toHaveText("Skip to the review");
    await skip.focus();
    await page.keyboard.press("Enter");
    await page.keyboard.press("Tab");
    expect(await page.evaluate(() => document.getElementById("reviewPanel").contains(document.activeElement))).toBe(true);
    await page.locator("#langAr").click();
    await expect(skip).toHaveText("انتقل إلى المراجعة");
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
    // A section uses the page column's width: one card around it, not three.
    const [section, column] = await Promise.all([page.locator("#case-overview").boundingBox(), page.locator("main").boundingBox()]);
    expect(column.width - section.width).toBeLessThanOrEqual(32);
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

    // Tabbing down the document, no control is left under that button.
    await page.locator("#reviewTitle").focus();
    const covered = [];
    for (let step = 0; step < 80; step += 1) {
      await page.keyboard.press("Tab");
      const at = await page.evaluate(() => new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(() => requestAnimationFrame(() => {
        const control = document.activeElement;
        if (!control?.closest("#reviewPanel")) return done(null);
        const pill = document.getElementById("caseOutlineReturn");
        const [box, over] = [control.getBoundingClientRect(), pill.getBoundingClientRect()];
        const under = control !== pill && !pill.hidden && box.bottom > over.top && box.top < over.bottom && box.right > over.left && box.left < over.right;
        done(under ? control.textContent.trim().slice(0, 40) : "");
      })))));
      if (at === null) break;
      if (at) covered.push(at);
    }
    expect(covered).toEqual([]);

    // Beside the document, the outline stays in reach on its own.
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.locator('#reviewNav [data-review="evidence"]').click();
    await expect(back).toBeHidden();
  });
});
