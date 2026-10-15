import { test, expect } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";
import { openStep } from "./helpers/guided-flow.js";
import { expectKernel } from "./helpers/kernel-check.js";

async function fixture(name) {
  return JSON.parse(
    await fs.readFile(path.join(process.cwd(), "fixtures", name), "utf8"),
  );
}

async function openBiopoliticalImport(page) {
  await page.goto("./");
  await page.locator("#langEn").click();
  await openStep(page, "lens");
  await page.locator('[data-lens="biopolitical"]').click();
}

test.describe("Runtime import validation", () => {
  test("rejects unsupported future contracts with a field-level error", async ({
    page,
  }) => {
    await openBiopoliticalImport(page);
    const data = await fixture("sample-analysis-bio-en.json");
    data.schema_version = "99.0.0";
    await openStep(page, "answer");
    await page.locator("#jsonInput").fill(JSON.stringify(data));
    await expect(page.locator("#importBtn")).toBeDisabled();
    await expect(page.locator("#jsonStatus")).toContainText(
      /schema_version|unsupported/i,
    );
  });

  test("reformats field-type drift and discloses it instead of rejecting", async ({
    page,
  }) => {
    await openBiopoliticalImport(page);
    const data = await fixture("sample-analysis-bio-en.json");
    data.evidence.items[0].sample_size = 100;
    await openStep(page, "answer");
    await page.locator("#jsonInput").fill(JSON.stringify(data));
    await expect(page.locator("#importBtn")).toBeEnabled();
    const audit = page.locator("#importAuditDetails");
    await audit.locator("summary").click();
    await expect(audit).toContainText(
      "/evidence/items/0/sample_size was reformatted to the contract type",
    );
  });

  test("holds back semantic duplicate IDs as a completion gap", async ({
    page,
  }) => {
    await openBiopoliticalImport(page);
    const data = await fixture("sample-analysis-bio-en.json");
    data.power_map.actors[0].id = data.evidence.items[0].id;
    await openStep(page, "answer");
    await page.locator("#jsonInput").fill(JSON.stringify(data));
    await expect(page.locator("#importBtn")).toBeDisabled();
    await expect(page.locator("#jsonStatus")).toContainText(/not imported yet/i);
    const audit = page.locator("#importAuditDetails");
    await audit.locator("summary").click();
    await expect(audit).toContainText("/power_map/actors/0/id");
  });

  test("refuses legacy six-layer content and asks for a new prompt", async ({
    page,
  }) => {
    await openBiopoliticalImport(page);
    const data = await fixture("sample-analysis-bio-en.legacy-v1.json");
    await openStep(page, "answer");
    await page.locator("#jsonInput").fill(JSON.stringify(data));
    await expect(page.locator("#importBtn")).toBeDisabled();
    await expect(page.locator("#jsonStatus")).toContainText(/old analysis format[\s\S]*Generate a new prompt/);
    await expect(page.locator("#repairPromptBtn")).toBeDisabled();
  });

  test("imports review-required evidence while keeping publication blocked", async ({
    page,
  }) => {
    await openBiopoliticalImport(page);
    const data = await fixture("sample-analysis-bio-en.json");
    data.evidence.items[0].source_url = "not-a-url";
    data.self_audit.statistics_quotations_verified = "pass";
    await openStep(page, "answer");
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
    await openStep(page, "answer");
    await page.locator("#importBtn").click();
    const review = page.locator("#reviewContent");
    await expect(review).toContainText(/Publication gate:\s*Review needed/i);
    await expect(review).toContainText(/before publication/i);
  });

  test("the import review details and the exports keep their contracts and read in both themes", async ({
    page,
  }) => {
    await openBiopoliticalImport(page);
    const data = await fixture("sample-analysis-bio-en.json");
    data.evidence.items[0].source_url = "not-a-url";
    await openStep(page, "answer");
    await page.locator("#jsonInput").fill(JSON.stringify(data));
    const audit = page.locator("#importAuditDetails");
    await audit.locator("summary").click();
    await expect(audit.locator(".j-audit-group").first()).toBeVisible();
    await expectKernel(page, "#importAuditDetails");
    await page.locator("#importBtn").click();
    const exports = page.locator(".j-export");
    await exports.scrollIntoViewIfNeeded();
    await expect(exports.locator("#exportHtml")).toHaveAttribute("data-variant", "primary");
    await page.locator(".j-export-raw > summary").click();
    await expectKernel(page, ".j-export", "#reviewContent .j-export-raw");
    await expectKernel(page, ".j-export");
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
      await openStep(page, "lens");
      await page.locator('[data-lens="biopolitical"]').click();
      const reviewable = await fixture(current.fixture);
      reviewable.evidence.items[0].source_url = "not-a-url";
      await openStep(page, "answer");
      await page.locator("#jsonInput").fill(JSON.stringify(reviewable));
      await expect(page.locator("#importBtn")).toBeEnabled();
      const audit = page.locator("#importAuditDetails");
      await audit.locator("summary").click();
      await expect(audit).toContainText(current.warning);
      await expect(audit).not.toContainText("Source URL is not an absolute HTTP(S) URL");
      await expect(audit.locator(".j-audit-path").first()).toHaveAttribute("dir", "ltr");

      const malformed = await fixture(current.fixture);
      malformed.evidence.items[0].source_tier = "academic";
      await openStep(page, "answer");
      await page.locator("#jsonInput").fill(JSON.stringify(malformed));
      await expect(page.locator("#importBtn")).toBeDisabled();
      await expect(audit).toContainText(current.schema);
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
    await openStep(page, "answer");
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
    await openStep(page, "answer");
    await page.locator("#jsonInput").fill(JSON.stringify(data));
    await expect(page.locator("#importBtn")).toBeEnabled();
    await expect(page.locator("#jsonStatus")).toContainText(
      /reviewable draft|publication is blocked/i,
    );
    await openStep(page, "answer");
    await page.locator("#importBtn").click();
    await expect(page.locator("#reviewContent")).toContainText(
      /Publication gate:\s*Review needed/i,
    );
    const evidenceTab = page.locator('[data-bio-review="evidence"]');
    await evidenceTab.focus();
    await expect(evidenceTab).toBeFocused();
    await evidenceTab.press("Enter");
    await expect(evidenceTab).toHaveAttribute("aria-current", "location");
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
    await openStep(page, "answer");
    await page.locator("#jsonInput").fill(JSON.stringify(data));
    await expect(page.locator("#importBtn")).toBeEnabled();
    await expect(page.locator("#jsonStatus")).toContainText(
      /2 non-portable assistant citation markers were removed/i,
    );
    await openStep(page, "answer");
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

  test("repairs assistant-interface citation markers in a Strategic import before export", async ({
    page,
  }, testInfo) => {
    const data = await fixture("sample-analysis-en.json");
    data.subject.executive_thesis = "Portable strategic thesis. \uE200cite\uE202turn8search1\uE201";
    data.evidence.items[0].source_note = "Portable source note. \uE200filecite\uE202turn0file0\uE202L2-L4\uE201";
    await page.goto("./");
    await page.locator("#langEn").click();
    await openStep(page, "answer");
    await page.locator("#jsonInput").fill(JSON.stringify(data));
    await expect(page.locator("#importBtn")).toBeEnabled();
    await expect(page.locator("#jsonStatus")).toContainText(
      /2 non-portable assistant citation markers were removed/i,
    );
    await openStep(page, "answer");
    await page.locator("#importBtn").click();
    await page.locator('[data-review="exports"]').click();
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.locator("#exportHtml").click(),
    ]);
    const exportedPath = testInfo.outputPath("citation-repaired-report.html");
    await download.saveAs(exportedPath);
    const html = await fs.readFile(exportedPath, "utf8");
    expect(html).toContain("Portable strategic thesis.");
    expect(html).toContain("Portable source note.");
    expect(html).not.toMatch(/[\uE000-\uF8FF]/);
    expect(html).not.toMatch(/turn8search1|turn0file0|filecite/);
  });
});
