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
});
