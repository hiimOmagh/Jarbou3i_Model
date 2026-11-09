import { test, expect } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";
import { openStep } from "./helpers/guided-flow.js";

// Evidence records show a short readable link and keep each source part in its own text direction.
test("evidence source note isolates parts and shortens long links", async ({ page }) => {
  const data = JSON.parse(await fs.readFile(path.join(process.cwd(), "fixtures", "sample-analysis-en.json"), "utf8"));
  const long = "https://example.org/ar/latest-laws/" + encodeURIComponent("قانون أساسي عدد 58 لسنة 2017 المتعلق بالقضاء على العنف ضد المرأة");
  Object.assign(data.evidence.items[0], { source_url: long, source_title: "So What If He Hit You?: Addressing Violence" });

  await page.goto("./");
  await page.locator("#langEn").click();
  await openStep(page, "answer");
  await page.locator("#jsonInput").fill(JSON.stringify(data));
  await page.locator("#importBtn").click();
  await page.locator('[data-review="evidence"]').click();

  const link = page.locator("#reviewContent a.sourceUrl").first();
  await expect(link).toBeVisible();
  const shown = ((await link.textContent()) || "").trim();
  expect(shown.length).toBeLessThanOrEqual(52);
  expect(shown).not.toContain("%D8");
  expect(shown).toContain("example.org");
  expect(await link.getAttribute("href")).toContain("%D9%82");
  await expect(page.locator("#reviewContent .j-rec-facts bdi", { hasText: "So What If He Hit You?" }).first()).toBeVisible();
});

// Data that is in the imported answer and in the exported report is also on the screen:
// a source note next to the source title, the evidence's own uncertainty, a scenario's rationale.
test("review screens show source note, evidence uncertainty and scenario rationale", async ({ page }) => {
  const data = JSON.parse(await fs.readFile(path.join(process.cwd(), "fixtures", "sample-analysis-en.json"), "utf8"));
  Object.assign(data.evidence.items[0], {
    source_title: "Title for display check",
    source_note: "Note kept beside the title",
    uncertainty: "Uncertainty stated by the analyst",
  });
  data.scenarios.items[0].rationale = "Rationale written for this scenario";

  await page.goto("./");
  await page.locator("#langEn").click();
  await openStep(page, "answer");
  await page.locator("#jsonInput").fill(JSON.stringify(data));
  await page.locator("#importBtn").click();

  await page.locator('[data-review="evidence"]').click();
  const evidence = page.locator('#reviewContent [data-records="evidence"] .j-rec').first();
  await expect(evidence).toContainText("Title for display check");
  await expect(evidence).toContainText("Note kept beside the title");
  await expect(evidence).toContainText("Uncertainty stated by the analyst");

  await page.locator('[data-review="scenarios"]').click();
  await expect(page.locator('#reviewContent [data-records="scenarios"] .j-rec').first()).toContainText("Rationale written for this scenario");
});
