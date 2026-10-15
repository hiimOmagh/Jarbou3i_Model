import { test, expect } from "@playwright/test";
import { openStep } from "./helpers/guided-flow.js";
import { expectKernel, hitHeight } from "./helpers/kernel-check.js";

// The Biopolitical sample's evidence section, and its first reference to a record.
async function evidenceReference(page, { lang = "en", id = "E1" } = {}) {
  await page.goto("./");
  await page.locator(`#lang${lang[0].toUpperCase()}${lang[1]}`).click();
  await openStep(page, "settings");
  await page.locator("#analysisLang").selectOption(lang);
  await openStep(page, "lens");
  await page.locator('[data-lens="biopolitical"]').click();
  await page.locator("#loadSampleBtn").click();
  await page.locator('[data-bio-review="evidence"]').click();
  return page.locator(`#case-evidence [data-reference-id="${id}"]`).first();
}

test("named evidence references open an accessible relationship inspector", async ({ page }) => {
  const reference = await evidenceReference(page);
  await expect(reference).toBeVisible();
  await expect(reference).toContainText("Rules linked defined health credentials");
  await expect(reference).toContainText("E1");
  await expectKernel(page, "#case-evidence", '#case-evidence [data-reference-id="E1"]');
  await reference.focus();
  await reference.press("Enter");

  const inspector = page.locator("#referenceInspector");
  await expect(inspector).toBeVisible();
  await expect(inspector).toBeFocused();
  await expect(inspector).toHaveAttribute("role", "dialog");
  await expect(inspector).toHaveAttribute("aria-modal", "true");
  await expect(page.locator("#referenceInspectorTitle")).toContainText(
    "Rules linked defined health credentials",
  );
  await expect(page.locator("#referenceInspectorType")).toContainText("E1");
  await expectKernel(page, "#referenceInspector");

  await page.keyboard.press("Escape");
  await expect(inspector).toBeHidden();
  await expect(reference).toBeFocused();
});

test("a one-line reference chip is still a 44px target", async ({ page }) => {
  // In Arabic, E2's chip fits on one line, about 32px tall.
  const reference = await evidenceReference(page, { lang: "ar", id: "E2" });
  await expect(reference).toBeVisible();
  expect(await hitHeight(reference)).toBeGreaterThanOrEqual(44);
});

// WebKit's focus() does not apply a removed inert while a stylesheet is still
// loading, so focus fell to the page: the relationship map's stylesheet, held
// back here, as it arrives late on a slow CI runner.
test("closing the inspector gives focus back while a stylesheet is still loading", async ({ page }) => {
  let release;
  const held = new Promise((resolve) => { release = resolve; });
  await page.route("**/relationship-explorer.css*", async (route) => {
    await held;
    await route.continue();
  });
  const reference = await evidenceReference(page);
  await page.locator('[data-bio-review="connections"]').click();
  await page.locator('[data-bio-review="evidence"]').click();
  await expect.poll(() => page.evaluate(() =>
    [...document.querySelectorAll('link[rel="stylesheet"]')].some((link) => !link.sheet),
  )).toBe(true);
  await reference.focus();
  await reference.press("Enter");
  await expect(page.locator("#referenceInspector")).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.locator("#referenceInspector")).toBeHidden();
  await expect(reference).toBeFocused();
  release();
});
