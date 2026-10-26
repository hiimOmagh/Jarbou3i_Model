import { test, expect } from "@playwright/test";
import { openStep } from "./helpers/guided-flow.js";
import { expectKernel } from "./helpers/kernel-check.js";

// The Connections view (UIX-5 slice G2): how much of a Biopolitical answer is
// connected, the records around one record, and every connection as a line.
async function openConnections(page, lang = "en") {
  await page.goto("./");
  // The graph loads with the Biopolitical lens, not before.
  await expect.poll(() => page.evaluate(() => window.Jarbou3iCapabilityLoads?.biopoliticalGraph?.attempts)).toBe(0);
  await page.locator(`#lang${lang[0].toUpperCase()}${lang.slice(1)}`).click();
  await openStep(page, "settings");
  await page.locator("#analysisLang").selectOption(lang);
  await openStep(page, "lens");
  await page.locator('[data-lens="biopolitical"]').click();
  await page.locator("#loadSampleBtn").click();
  await page.locator('#reviewNav [data-bio-review="connections"]').click();
  await expect(page.locator("#connMap")).toBeVisible();
}

test("counts the connected records and draws one record's neighbours", async ({ page }) => {
  await openConnections(page);
  expect(await page.evaluate(() => ({ ...window.Jarbou3iCapabilityLoads.biopoliticalGraph }))).toEqual({ attempts: 1, fulfilled: 1, failures: 0 });
  await expect(page.locator("#connectionsView .j-stats > span")).toHaveText(["20/32Records connected", "28Connections", "17Citing evidence"]);

  // The record with the most connections is in the middle: E1, which nine
  // records cite. Its neighbours are grouped by relation.
  await expect(page.locator("#connFocus")).toHaveValue("E1");
  await expect(page.locator("#connCentre code")).toHaveText("E1");
  const incoming = page.locator('.j-conn-side[data-side="in"]');
  await expect(incoming.locator(":scope > ul > li > .j-conn-rel")).toHaveText(["Supported by", "Countered by"]);
  await expect(incoming.locator("button.j-conn-node")).toHaveCount(9);
  await expect(incoming.locator('[data-conn-focus="IV1"]')).toHaveAccessibleDescription("Supported by");
  await expect(page.locator('.j-conn-side[data-side="out"]')).toContainText("None");
  // The map and each connection sit under thin rules, not in panels; a
  // record's name in a link wraps with room between its lines.
  const look = await page.evaluate(() => {
    const style = (selector) => getComputedStyle(document.querySelector(selector));
    const label = style("#connectionsView .j-ref-label");
    return {
      map: [style(".j-conn-map").borderInlineStartWidth, style(".j-conn-map").backgroundColor],
      row: [style(".j-conn-list > li").borderInlineStartWidth, style(".j-conn-list > li").backgroundColor],
      leading: parseFloat(label.lineHeight) / parseFloat(label.fontSize),
    };
  });
  expect(look.map).toEqual(["0px", "rgba(0, 0, 0, 0)"]);
  expect(look.row).toEqual(["0px", "rgba(0, 0, 0, 0)"]);
  expect(look.leading).toBeGreaterThanOrEqual(1.3);

  // A neighbour moves to the middle and takes the focus; the list of records follows.
  await incoming.locator('[data-conn-focus="IV1"]').click();
  await expect(page.locator("#connCentre")).toBeFocused();
  await expect(page.locator("#connCentre code")).toHaveText("IV1");
  await expect(page.locator("#connFocus")).toHaveValue("IV1");
  await expect(page.locator('.j-conn-side[data-side="out"] .j-conn-rel')).toHaveText(["Targets", "Governed by", "Uses", "Supported by"]);
  // A record chosen from the list goes to the middle too.
  await page.locator("#connFocus").selectOption("INS1");
  await expect(page.locator("#connCentre code")).toHaveText("INS1");
  await expect(page.locator('.j-conn-side[data-side="in"] .j-conn-rel')).toHaveText(["Enables", "Uses"]);

  // The record in the middle opens in the inspector.
  await page.locator('#connCentre [data-reference-id="INS1"]').click();
  await expect(page.locator("#referenceInspector")).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.locator('#connCentre [data-reference-id="INS1"]')).toBeFocused();
  await expectKernel(page, "#connectionsView");
});

test("finds a connection by record, ID or relation", async ({ page }) => {
  await openConnections(page);
  const shown = page.locator(".j-conn-list > li:not([hidden])");
  await expect(shown).toHaveCount(28);
  await expect(page.locator("#connShown")).toHaveText("Shown: 28 of 28");

  // An ID finds the connections at either end; layers with none fold away.
  await page.locator("#connSearch").fill("ins1");
  await expect(shown).toHaveCount(3);
  await expect(page.locator("#connShown")).toHaveText("Shown: 3 of 28");
  await expect(page.locator("[data-conn-layer]:not([hidden]) > h5")).toHaveText([/^Human functions/, /^Mechanisms/, /^Intervention/]);
  // A relation, in the page's words.
  await page.locator("#connSearch").fill("countered by");
  await expect(shown).toHaveCount(6);
  await expect(shown.locator(".j-conn-rel")).toHaveText(Array(6).fill("Countered by"));

  await page.locator("#connSearch").fill("no such record");
  await expect(shown).toHaveCount(0);
  await expect(page.locator("#connNoMatch")).toBeVisible();
  await expect(page.locator("#connShown")).toHaveText("Shown: 0 of 28");
  await page.locator("#connSearch").fill("");
  await expect(shown).toHaveCount(28);
  await expect(page.locator("#connNoMatch")).toBeHidden();
});

test("asks the AI to connect the records no connection reaches", async ({ page }) => {
  await openConnections(page);
  // What the page copies, so the test reads the prompt it would paste.
  await page.evaluate(() => {
    window.__copied = [];
    Object.defineProperty(navigator.clipboard, "writeText", { configurable: true, value: async (text) => { window.__copied.push(text); } });
  });
  const gaps = page.locator(".j-conn-gaps");
  await expect(gaps.locator("h4 .j-chip")).toHaveText("12");
  await gaps.locator("summary").click();
  const loose = await gaps.locator(".j-conn-loose .j-ref").evaluateAll((chips) => chips.map((chip) => chip.dataset.referenceId));
  expect(loose).toHaveLength(12);

  await expect(page.locator("#connGapsAnswer")).toBeHidden();
  await page.locator("#connGapsCopy").click();
  await expect(page.locator("#connGapsStatus")).toHaveText(/^Prompt copied/);
  const prompt = await page.evaluate(() => window.__copied.at(-1));
  expect(prompt).toContain('{"fill":{"/links/-":');
  for (const id of loose) expect(prompt).toContain(`\n${id} — `);

  // The reply has its own box under the answer: its links join the answer,
  // which is checked and imported as a new one.
  await page.locator("#connGapsAnswer").click();
  await expect(page.locator("#continuationInput")).toBeFocused();
  await expect(page.locator("#continuationField label")).toHaveText("The AI’s reply");
  const link = (from, to) => ({ from, to, relation: "enables", mechanism: `${from} makes ${to} possible.`, confidence: "medium" });
  await page.locator("#continuationInput").fill(`\`\`\`json\n${JSON.stringify({ fill: { "/links/-": [link(loose[0], "E1"), link(loose[1], loose[2])] } })}\n\`\`\``);
  await expect(page.locator("#jsonStatus")).toContainText("Added 2 connections to your analysis.");
  await expect(page.locator("#continuationField")).toBeHidden();
  await page.locator("#importBtn").click();
  await page.locator('#reviewNav [data-bio-review="connections"]').click();
  await expect(page.locator("#connectionsView .j-stats > span")).toHaveText(["23/32Records connected", "30Connections", "17Citing evidence"]);
  await expect(page.locator(".j-conn-gaps h4 .j-chip")).toHaveText("9");
});

test("the inspector puts a record in the middle of the view", async ({ page }) => {
  await openConnections(page);
  await page.locator('#reviewNav [data-bio-review="evidence"]').click();
  await page.locator('#case-evidence .j-ref[data-reference-id="E2"]').first().click();
  await page.locator("#referenceShowConnections").click();
  await expect(page.locator("#connCentre")).toBeFocused();
  await expect(page.locator("#connCentre code")).toHaveText("E2");
  await expect(page.locator("#connFocus")).toHaveValue("E2");
  await expect(page.locator('#reviewNav [data-bio-review="connections"]')).toHaveAttribute("aria-current", "location");
});

test("reads in Arabic, right to left, and stacks on a phone", async ({ page }, testInfo) => {
  await openConnections(page, "ar");
  const view = page.locator("#connectionsView");
  for (const label of ["يُمكّن", "يصنّف", "مدعوم بـ", "معارَض بـ"]) await expect(view).toContainText(label);
  await expect(view).not.toContainText(/\b(?:Enables|Classifies|Distributes|Resists|Supported|Countered)\b/i);

  // What points to the record comes first in reading order: on its right
  // beside it, or above it on a phone; the arrows point at the next part.
  const box = (selector) => page.locator(selector).evaluate((element) => element.getBoundingClientRect().toJSON());
  const [before, centre, after] = [await box('.j-conn-side[data-side="in"]'), await box("#connCentre"), await box('.j-conn-side[data-side="out"]')];
  const arrows = await page.locator(".j-conn-arrow").evaluateAll((items) => items.map((item) => getComputedStyle(item).transform));
  if (testInfo.project.name === "mobile-chrome") {
    expect(before.bottom).toBeLessThanOrEqual(centre.top);
    expect(after.top).toBeGreaterThanOrEqual(centre.bottom);
    expect(arrows).toEqual(["matrix(0, 1, -1, 0, 0, 0)", "matrix(0, 1, -1, 0, 0, 0)"]);
  } else {
    expect(before.left).toBeGreaterThanOrEqual(centre.right);
    expect(after.right).toBeLessThanOrEqual(centre.left);
    expect(arrows).toEqual(["matrix(-1, 0, 0, 1, 0, 0)", "matrix(-1, 0, 0, 1, 0, 0)"]);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
