import { test, expect } from "@playwright/test";
import fs from "node:fs/promises";

test("named evidence references open an accessible relationship inspector", async ({ page }) => {
  await page.goto("./");
  await page.locator("#langEn").click();
  await page.locator("#analysisLang").selectOption("en");
  await page.locator('[data-lens="biopolitical"]').click();
  await page.locator("#loadSampleBtn").click();
  await page.locator('[data-bio-review="evidence"]').click();

  const reference = page.locator('#reviewContent [data-reference-id="E1"]').first();
  await expect(reference).toBeVisible();
  await expect(reference).toContainText("Rules linked defined health credentials");
  await expect(reference).toContainText("E1");
  await reference.focus();
  await reference.press("Enter");

  const inspector = page.locator(".referenceInspector");
  await expect(inspector).toBeVisible();
  await expect(inspector).toBeFocused();
  await expect(inspector).toHaveAttribute("role", "dialog");
  await expect(inspector).toHaveAttribute("aria-modal", "true");
  await expect(page.locator("#referenceInspectorTitle")).toContainText(
    "Rules linked defined health credentials",
  );
  await expect(page.locator("#referenceInspectorType")).toContainText("E1");

  await page.keyboard.press("Escape");
  await expect(inspector).toBeHidden();
  await expect(reference).toBeFocused();
});

test("biopolitical HTML export includes names and a canonical reference directory", async ({ page }) => {
  await page.goto("./");
  await page.locator("#langEn").click();
  await page.locator("#analysisLang").selectOption("en");
  await page.locator('[data-lens="biopolitical"]').click();
  await page.locator("#loadSampleBtn").click();
  await page.locator('[data-bio-review="exports"]').click();

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.locator("#exportHtml").click(),
  ]);
  const path = await download.path();
  const html = await fs.readFile(path, "utf8");
  expect(html).toContain('data-reference-directory="named"');
  expect(html).toContain("Reference directory");
  expect(html).toContain('data-reference-id="ACT1"');
  expect(html).toContain("Public-health authorities");
  expect(html).toContain("Rules linked defined health credentials to access in specified settings. [E1]");
  expect(html).toContain('id="canonical-analysis"');
});
