import { test, expect } from "@playwright/test";
import fs from "node:fs/promises";
import { PRODUCT_VERSION } from "./helpers/product-version.mjs";
import { openStep } from "./helpers/guided-flow.js";
import { expectKernel } from "./helpers/kernel-check.js";

async function openInspection(page, lens) {
  await page.goto("./");
  await page.locator("#langEn").click();
  if (lens === "biopolitical") {
    await openStep(page, "lens");
    await page.locator('[data-lens="biopolitical"]').click();
  }
  await page.locator("#loadSampleBtn").click();
  await page.locator(lens === "biopolitical" ? '[data-bio-review="inspection"]' : '[data-review="inspection"]').click();
  const intelligence = page.locator("[data-evidence-intelligence]");
  await intelligence.locator("summary").click();
  await expect(intelligence).toHaveAttribute("open", "");
  await expectKernel(page, "[data-evidence-intelligence]");
  return intelligence;
}

async function downloadManifest(page, intelligence) {
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    intelligence.locator("#exportIntelligence").click(),
  ]);
  // The file name says which analysis it audits, not only the lens.
  expect(download.suggestedFilename()).toMatch(/^.+-(strategic|biopolitical)-evidence-intelligence\.json$/);
  const path = await download.path();
  return JSON.parse(await fs.readFile(path, "utf8"));
}

test("strategic evidence reads as record cards with their strength and risk", async ({ page }) => {
  await page.goto("./");
  await page.locator("#langEn").click();
  await page.locator("#loadSampleBtn").click();
  await page.locator('[data-review="evidence"]').click();
  const evidence = page.locator('#case-evidence [data-records="evidence"] > li');
  await expect(evidence.first()).toBeVisible();
  await expectKernel(page, "#case-evidence");
  // The strength is drawn in steps and named as a score.
  await expect(evidence.first().getByRole("img")).toHaveAccessibleName(/^[1-5]\/5$/);
  // An assumption's risk is a chip in words; its tone is only an edge.
  const assumption = page.locator('#case-evidence [data-records="assumptions"] > li').first();
  await expect(assumption.locator(".j-chip").first()).toHaveText(/risk/i);
  await expect(assumption.locator("dt")).toHaveText(["Risk", "Disproving test"]);
});

test("strategic contradictions and scenarios read as record cards", async ({ page }) => {
  await page.goto("./");
  await page.locator("#langEn").click();
  await page.locator("#loadSampleBtn").click();
  await page.locator('[data-review="contradictions"]').click();
  const contradiction = page.locator('#case-contradictions [data-records="contradictions"] > li').first();
  await expect(contradiction).toBeVisible();
  await expectKernel(page, "#case-contradictions");
  // Its severity says its scale; the layers it touches are chips in words.
  await expect(contradiction.locator(".j-rec-head .j-chip")).toHaveText(["Rhetoric vs action", "High confidence", "Severity 4/10"]);
  await expect(contradiction.locator("dt")).toHaveText(["Actions/results", "Interpretation", "Strategic signal", "Impact", "Affected layers"]);
  await expect(contradiction.locator("dd .j-chip")).toHaveText(["Actors", "Tools", "Narrative"]);

  await page.locator('[data-review="scenarios"]').click();
  const scenario = page.locator('#case-scenarios [data-records="scenarios"] > li').first();
  await expectKernel(page, "#case-scenarios");
  await expect(scenario.locator(".j-chip")).toHaveText(["Probability 70%", "Timeframe: 1947–1955"]);
  await expect(scenario.locator("dt")).toHaveText(["Drivers", "Early signals", "Disproven if"]);
  await expect(scenario.locator("dd li").first()).toHaveText("Ideological polarization");
});

test("the engine map and the strategic layers read as steps and record cards", async ({ page }) => {
  await page.goto("./");
  await page.locator("#langEn").click();
  await page.locator("#loadSampleBtn").click();
  // Going to the map redraws only the shell; its state still says imported.
  await page.locator('[data-shell-nav="engine"]').click();
  await expect(page.locator("#analysisStateChip")).toHaveText("Analysis imported");
  // Each layer is a numbered step; one opens its layer in the case file.
  await expect(page.locator("#engineNav > li")).toHaveCount(6);
  const step = page.locator('[data-pillar-card="actors"]');
  await step.click();
  await expect(step).toHaveAttribute("aria-current", "true");
  const head = page.locator('h4 > [data-acc="actors"]');
  await expect(head).toHaveAttribute("aria-expanded", "true");
  await expect(head).toBeFocused();
  await expectKernel(page, "#enginePanel");
  await expectKernel(page, "#case-pillars");
  // A record's codes are chips in words; its model score is a fact.
  const record = page.locator('#acc-panel-actors [data-records="layer"] > li').first();
  await expect(record.locator(".j-chip")).toHaveText(["State", "High confidence"]);
  await expect(record.locator(".j-rec-title")).toHaveText("United States");
  await expect(record.locator("dt")).toHaveText("Actor Power Index (API)");
  await expect(record.locator("dd")).toHaveText("18/20");
  // A result states its goal, cost-benefit and effect on the balance of power.
  await page.locator('[data-pillar-card="results"]').click();
  const result = page.locator('#acc-panel-results [data-records="layer"] > li').first();
  await expect(result.locator("dt")).toHaveText(["Goal achieved", "Cost-benefit", "Power balance"]);
  await expect(result.locator("dd")).toHaveText(["70%", "3/5", "Strengthened"]);
  await page.locator('[data-pillar-card="actors"]').click();
  // Its head closes it, and the map no longer marks it.
  await head.click();
  await expect(head).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator("#acc-panel-actors")).toBeHidden();
  await expect(step).not.toHaveAttribute("aria-current");
});

test("biopolitical records read as record cards in each pillar and the evidence section", async ({ page }) => {
  await page.goto("./");
  await page.locator("#langEn").click();
  await openStep(page, "lens");
  await page.locator('[data-lens="biopolitical"]').click();
  await page.locator("#loadSampleBtn").click();
  await page.locator('[data-bio-review="pillars"]').click();
  await page.locator('[data-bio-acc="mechanisms_infrastructure"]').click();
  const panel = "#bio-acc-panel-mechanisms_infrastructure";
  const record = page.locator(`${panel} [data-records="bio"] > li`).first();
  await expect(record).toBeVisible();
  await expectKernel(page, panel);
  // Its codes are chips in words, then its statement; its facts and lists
  // are one description list.
  await expect(record.locator(".j-chip")).toHaveText(["Infrastructure", "High"]);
  await expect(record.locator(".j-rec-title")).toHaveText("QR credential and verification rule");
  await expect(record.locator("dt")).toHaveText(["Stated purpose", "Ownership", "Oversight", "Scale", "Links to", "Linked from"]);
  // Then its connections: the link it authors, and the records that point to
  // it, each "relation · record".
  await expect(record.locator("dd li")).toHaveText([
    "Individual", "Institutional", "National",
    /^Classifies · Eligible/, /^Enables · Mobility/, /^Uses · Conditional access/,
  ]);
  await expect(record.locator("dd li .j-ref")).toHaveText([/CLASS1$/, /HF1$/, /IV1$/]);
  // A record it names opens in the inspector, whose "Open full record" lands
  // on that record's own card.
  await record.locator('dd li .j-ref[data-reference-id="IV1"]').click();
  await page.locator("#referenceOpenRecord").click();
  await expect(page.locator('[data-records="bio"] [data-inspection-id="IV1"]')).toBeFocused();
  // The evidence section draws the same cards, their references live.
  await page.locator('[data-bio-review="evidence"]').click();
  const explanation = page.locator('#case-evidence [data-records="bio"] > li').first();
  await expect(explanation.locator(".j-ref").first()).toBeVisible();
  await expectKernel(page, "#case-evidence");
  // An evidence record is drawn in its pillar and here; opened from the
  // inspector, it lands here.
  const cited = explanation.locator('.j-ref[data-reference-type="evidence"]').first();
  const evidenceId = await cited.getAttribute("data-reference-id");
  await cited.click();
  await page.locator("#referenceOpenRecord").click();
  await expect(page.locator(`#case-evidence [data-inspection-id="${evidenceId}"]`)).toBeFocused();
});

test("strategic claim–evidence matrix exports an explicitly derived audit artifact", async ({ page }) => {
  const intelligence = await openInspection(page, "strategic");
  const matrix = intelligence.locator("[data-evidence-traceability]");
  await expect(matrix).toBeVisible();
  await expect(matrix.locator("[data-traceability-record]")).toHaveCount(13);
  await expect(matrix.locator('[data-traceability-record="I1"]')).toContainText("unreferenced");

  const manifest = await downloadManifest(page, intelligence);
  expect(manifest.format).toBe("jarbou3i-evidence-intelligence-v1");
  expect(manifest.app_version).toBe(PRODUCT_VERSION);
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
