import { test, expect } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";

async function fixture(name) {
  return JSON.parse(
    await fs.readFile(path.join(process.cwd(), "fixtures", name), "utf8"),
  );
}

async function openBiopoliticalImport(page) {
  await page.goto("/");
  await page.locator("#langEn").click();
  await page.locator('[data-lens="biopolitical"]').click();
}

test.describe("Runtime import validation", () => {
  test("rejects unsupported future contracts with a field-level error", async ({
    page,
  }) => {
    await openBiopoliticalImport(page);
    const data = await fixture("sample-analysis-bio-en.json");
    data.schema_version = "99.0.0";
    await page.locator("#jsonInput").fill(JSON.stringify(data));
    await expect(page.locator("#importBtn")).toBeDisabled();
    await expect(page.locator("#jsonStatus")).toContainText(
      /schema_version|unsupported/i,
    );
  });

  test("rejects malformed canonical field types before normalization", async ({
    page,
  }) => {
    await openBiopoliticalImport(page);
    const data = await fixture("sample-analysis-bio-en.json");
    data.evidence.items[0].sample_size = 100;
    await page.locator("#jsonInput").fill(JSON.stringify(data));
    await expect(page.locator("#importBtn")).toBeDisabled();
    await expect(page.locator("#jsonStatus")).toContainText(
      /evidence\/items\/0\/sample_size|must be string/i,
    );
  });

  test("rejects semantic duplicate IDs after schema validation", async ({
    page,
  }) => {
    await openBiopoliticalImport(page);
    const data = await fixture("sample-analysis-bio-en.json");
    data.power_map.actors[0].id = data.evidence.items[0].id;
    await page.locator("#jsonInput").fill(JSON.stringify(data));
    await expect(page.locator("#importBtn")).toBeDisabled();
    await expect(page.locator("#jsonStatus")).toContainText(/already used|ID/i);
  });

  test("accepts legacy content only as a disclosed migrated draft", async ({
    page,
  }) => {
    await openBiopoliticalImport(page);
    const data = await fixture("sample-analysis-bio-en.legacy-v1.json");
    await page.locator("#jsonInput").fill(JSON.stringify(data));
    await expect(page.locator("#importBtn")).toBeEnabled();
    await expect(page.locator("#jsonStatus")).toContainText(/migrated draft/i);
    await page.locator("#importBtn").click();
    await expect(page.locator("#reviewContent")).toContainText(
      /cannot be published|not publication-ready/i,
    );
  });

  test("imports review-required evidence while keeping publication blocked", async ({
    page,
  }) => {
    await openBiopoliticalImport(page);
    const data = await fixture("sample-analysis-bio-en.json");
    data.evidence.items[0].source_url = "not-a-url";
    data.self_audit.statistics_quotations_verified = "pass";
    await page.locator("#jsonInput").fill(JSON.stringify(data));
    await expect(page.locator("#importBtn")).toBeEnabled();
    await expect(page.locator("#jsonStatus")).toContainText(/review warning/i);
    await page.locator("#importBtn").click();
    const review = page.locator("#reviewContent");
    await expect(review).toContainText(/Quality gate:\s*Review needed/i);
    await expect(review).toContainText(/before publication/i);
  });

  test("rejects malformed provenance when evidence claims full verification", async ({
    page,
  }) => {
    await openBiopoliticalImport(page);
    const data = await fixture("sample-analysis-bio-en.json");
    Object.assign(data.evidence.items[0], {
      source_url: "not-a-url",
      source_locator: "section 1",
      source_title: "Reviewed source",
      source_date: "2026-01-01",
      verification_status: "verified",
      verified_by: "QA reviewer",
      verification_date: "2026-07-17",
      claim_source_fit: "direct",
    });
    await page.locator("#jsonInput").fill(JSON.stringify(data));
    await expect(page.locator("#importBtn")).toBeDisabled();
    await expect(page.locator("#jsonStatus")).toContainText(/absolute HTTP\(S\)/i);
  });

  test("repairs assistant-interface citation markers before review and export", async ({
    page,
  }, testInfo) => {
    await openBiopoliticalImport(page);
    const data = await fixture("sample-analysis-bio-en.json");
    data.subject.executive_finding =
      "Portable finding. \uE200cite\uE202turn7search2\uE201";
    data.evidence.items[0].limitations =
      "Traceable limit \uE200filecite\uE202turn0file0\uE202L5-L10\uE201.";
    await page.locator("#jsonInput").fill(JSON.stringify(data));
    await expect(page.locator("#importBtn")).toBeEnabled();
    await expect(page.locator("#jsonStatus")).toContainText(
      /2 non-portable assistant citation markers were removed/i,
    );
    await page.locator("#importBtn").click();
    await page.locator('[data-bio-review="exports"]').click();
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.locator("#exportJson").click(),
    ]);
    const exportedPath = testInfo.outputPath("citation-repaired-analysis.json");
    await download.saveAs(exportedPath);
    const exported = await fs.readFile(exportedPath, "utf8");
    expect(exported).toContain("Portable finding.");
    expect(exported).toContain("Traceable limit.");
    expect(exported).not.toMatch(/[\uE000-\uF8FF]/);
    expect(exported).not.toMatch(/turn7search2|turn0file0|filecite/);
  });
});
