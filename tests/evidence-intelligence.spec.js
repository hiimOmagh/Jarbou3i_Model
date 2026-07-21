import { test, expect } from "@playwright/test";
import fs from "node:fs/promises";

async function openInspection(page, lens) {
  await page.goto("/");
  await page.locator("#langEn").click();
  if (lens === "biopolitical") await page.locator('[data-lens="biopolitical"]').click();
  await page.locator("#loadSampleBtn").click();
  await page.locator(lens === "biopolitical" ? '[data-bio-review="inspection"]' : '[data-review="inspection"]').click();
  const intelligence = page.locator("[data-evidence-intelligence]");
  await intelligence.locator("summary").click();
  await expect(intelligence).toHaveAttribute("open", "");
  return intelligence;
}

async function downloadManifest(page, intelligence) {
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    intelligence.locator("#exportIntelligence").click(),
  ]);
  const path = await download.path();
  return JSON.parse(await fs.readFile(path, "utf8"));
}

test("strategic claim–evidence matrix exports an explicitly derived audit artifact", async ({ page }) => {
  const intelligence = await openInspection(page, "strategic");
  const matrix = intelligence.locator(".evidenceTraceability");
  await expect(matrix).toBeVisible();
  await expect(matrix.locator("[data-traceability-record]")).toHaveCount(13);
  await expect(matrix.locator('[data-traceability-record="I1"]')).toContainText("unreferenced");

  const manifest = await downloadManifest(page, intelligence);
  expect(manifest.format).toBe("jarbou3i-evidence-intelligence-v1");
  expect(manifest.app_version).toBe("2.1.0-alpha.33");
  expect(manifest.analysis_lens).toBe("strategic");
  expect(manifest.derived).toBe(true);
  expect(manifest.canonical_transport).toBe(false);
  expect(manifest).not.toHaveProperty("analysis");
  expect(manifest.claim_evidence_matrix).toHaveLength(13);
});

test("biopolitical manifest preserves authored support routes and source clusters", async ({ page }) => {
  const intelligence = await openInspection(page, "biopolitical");
  const intervention = intelligence.locator('[data-traceability-record="IV1"]');
  await expect(intervention).toContainText("E1");
  await expect(intervention).toContainText("support only");

  const manifest = await downloadManifest(page, intelligence);
  expect(manifest.analysis_lens).toBe("biopolitical");
  expect(manifest.source_clusters).toHaveLength(2);
  expect(manifest.authored_routes).toEqual(expect.arrayContaining([
    expect.objectContaining({ evidenceId: "E1", recordId: "IV1", role: "supporting" }),
  ]));
  expect(manifest.claim_evidence_matrix).toEqual(expect.arrayContaining([
    expect.objectContaining({ recordId: "IV1", supportingIds: ["E1"] }),
  ]));
});
