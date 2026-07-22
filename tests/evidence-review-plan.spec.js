import { test, expect } from "@playwright/test";
import fs from "node:fs/promises";

async function openQueue(page, lens) {
  await page.goto("/");
  await page.locator("#langEn").click();
  if (lens === "biopolitical") await page.locator('[data-lens="biopolitical"]').click();
  await page.locator("#loadSampleBtn").click();
  await page.locator(lens === "biopolitical" ? '[data-bio-review="inspection"]' : '[data-review="inspection"]').click();
  const intelligence = page.locator("[data-evidence-intelligence]");
  await intelligence.locator("summary").click();
  const queue = intelligence.locator("[data-evidence-review-queue]");
  await expect(queue).toBeVisible();
  return queue;
}

test("strategic review queue is ordered, navigable, and explicitly non-validating", async ({ page }) => {
  const queue = await openQueue(page, "strategic");
  await expect(queue.locator('[data-review-phase="resolve_references"]')).toBeVisible();
  await expect(queue.locator('[data-review-phase="verify_provenance"] [data-review-task]')).not.toHaveCount(0);
  await expect(queue).toContainText("Completing them does not validate a conclusion");
  await queue.locator('[data-review-phase="verify_provenance"] [data-reference-id="E1"]').first().click();
  await expect(page.locator("#referenceInspectorTitle")).toContainText("Historical power distribution reference");
});

test("biopolitical review plan downloads as a separate derived artifact", async ({ page }) => {
  const queue = await openQueue(page, "biopolitical");
  await expect(queue.locator('[data-review-reason="untraceable_source"]')).toHaveCount(2);
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    queue.locator("#exportReviewPlan").click(),
  ]);
  const manifest = JSON.parse(await fs.readFile(await download.path(), "utf8"));
  expect(manifest.format).toBe("jarbou3i-evidence-review-plan-v1");
  expect(manifest.app_version).toBe("2.1.0-alpha.39");
  expect(manifest.analysis_lens).toBe("biopolitical");
  expect(manifest.derived).toBe(true);
  expect(manifest.canonical_transport).toBe(false);
  expect(manifest.completion_validates_conclusions).toBe(false);
  expect(manifest).not.toHaveProperty("analysis");
  expect(manifest.tasks).toEqual(expect.arrayContaining([
    expect.objectContaining({ phase: "verify_provenance", reasonCode: "untraceable_source", targetId: "E1" }),
  ]));
});
