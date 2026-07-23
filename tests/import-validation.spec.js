import { test, expect } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";

async function fixture(name) {
  return JSON.parse(
    await fs.readFile(path.join(process.cwd(), "fixtures", name), "utf8"),
  );
}

async function openBiopoliticalImport(page) {
  await page.goto("./");
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
    await expect(page.locator("#jsonStatus")).toContainText(
      /reviewable draft|publication is blocked/i,
    );
    const audit = page.locator("#importAuditDetails");
    await expect(audit).toBeVisible();
    await audit.locator("summary").click();
    await expect(audit).toContainText(/Publication blockers/i);
    await expect(audit).toContainText(/Draft import is allowed/i);
    await expect(audit).toContainText(/publication remains blocked/i);
    await expect(page.locator("#importBtn")).toBeEnabled();
    await expect(audit).toContainText(/Review required/i);
    await expect(audit).toContainText(/original pasted text is preserved/i);
    await page.locator("#importBtn").click();
    const review = page.locator("#reviewContent");
    await expect(review).toContainText(/Quality gate:\s*Review needed/i);
    await expect(review).toContainText(/before publication/i);
  });

  test("localizes import warnings and schema failures while isolating canonical paths", async ({
    page,
  }) => {
    const cases = [
      {
        button: "#langAr",
        fixture: "sample-analysis-bio-ar.json",
        warning: "رابط المصدر ليس رابط HTTP(S) مطلقًا",
        schema: "لا تطابق القيمة بنية عقد التحليل المطلوبة",
      },
      {
        button: "#langFr",
        fixture: "sample-analysis-bio-fr.json",
        warning: "L’URL de la source n’est pas une URL HTTP(S) absolue",
        schema: "La valeur ne respecte pas la structure requise",
      },
    ];
    for (const current of cases) {
      await page.goto("./");
      await page.locator(current.button).click();
      await page.locator('[data-lens="biopolitical"]').click();
      const reviewable = await fixture(current.fixture);
      reviewable.evidence.items[0].source_url = "not-a-url";
      await page.locator("#jsonInput").fill(JSON.stringify(reviewable));
      await expect(page.locator("#importBtn")).toBeEnabled();
      const audit = page.locator("#importAuditDetails");
      await audit.locator("summary").click();
      await expect(audit).toContainText(current.warning);
      await expect(audit).not.toContainText("Source URL is not an absolute HTTP(S) URL");
      await expect(audit.locator(".importAuditPath").first()).toHaveAttribute("dir", "ltr");

      const malformed = await fixture(current.fixture);
      malformed.evidence.items[0].sample_size = 100;
      await page.locator("#jsonInput").fill(JSON.stringify(malformed));
      await expect(page.locator("#importBtn")).toBeDisabled();
      await expect(page.locator("#jsonStatus")).toContainText(current.schema);
    }
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

  test("downgrades missing verification provenance into a reviewable draft", async ({
    page,
  }) => {
    await openBiopoliticalImport(page);
    const data = await fixture("sample-analysis-bio-en.json");
    Object.assign(data.evidence.items[0], {
      source_title: "Reviewed source",
      source_url: "https://example.org/reviewed-source",
      source_locator: "section 1",
      source_date: "2026-01-01",
      verification_status: "verified",
      verified_by: "",
      verification_date: "",
      claim_source_fit: "direct",
    });
    data.self_audit.statistics_quotations_verified = "pass";
    await page.locator("#jsonInput").fill(JSON.stringify(data));
    await expect(page.locator("#importBtn")).toBeEnabled();
    await expect(page.locator("#jsonStatus")).toContainText(
      /reviewable draft|publication is blocked/i,
    );
    await page.locator("#importBtn").click();
    await expect(page.locator("#reviewContent")).toContainText(
      /Quality gate:\s*Review needed/i,
    );
    const evidenceTab = page.locator('[data-bio-review="evidence"]');
    await evidenceTab.focus();
    await expect(evidenceTab).toBeFocused();
    await evidenceTab.press("Enter");
    await expect(evidenceTab).toHaveAttribute("aria-selected", "true");
    await expect(page.locator("#reviewContent")).toContainText(/Partially verified/i);
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
