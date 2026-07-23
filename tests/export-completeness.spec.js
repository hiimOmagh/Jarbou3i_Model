import { test, expect } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";

test.setTimeout(60_000);

const SENTINELS = [
  "SENTINEL_ACTOR_FUNDING",
  "SENTINEL_INFORMATION_ADVANTAGE",
  "SENTINEL_STATED_OBJECTIVE",
  "SENTINEL_UNSTATED_INCENTIVE",
  "SENTINEL_CAPTURE_REASON",
  "SENTINEL_ACCOUNTABILITY",
  "SENTINEL_PROTECTION",
  "SENTINEL_OPPORTUNITY",
  "SENTINEL_RECOGNITION",
  "SENTINEL_PROFIT",
  "SENTINEL_VOICE",
  "SENTINEL_DISPLACEMENT",
  "SENTINEL_FUTURE_DRIVER",
  "SENTINEL_EARLY_SIGNAL",
  "SENTINEL_FUTURE_FALSIFIER",
  "SENTINEL_SOURCE_LOCATOR",
  "SENTINEL_MEASUREMENT_VALIDITY",
  "SENTINEL_CAUSAL_IDENTIFICATION",
  "SENTINEL_CONFLICTS",
  "SENTINEL_MISSING_DATA",
  "SENTINEL_SELECTION_EFFECT",
  "SENTINEL_RELEVANT_COMPARISON",
  "SENTINEL_CROSS_CONTEXT",
  "SENTINEL_LINK_MECHANISM",
  "SENTINEL_LEGAL_AUTHORITY",
  "SENTINEL_TRANSFER_LIMIT",
  "SENTINEL_THEORY_LIMIT",
  "SENTINEL_AUDIT_NOTE",
];

async function readFixture() {
  return JSON.parse(
    await fs.readFile(
      path.join(process.cwd(), "fixtures", "sample-analysis-bio-en.json"),
      "utf8",
    ),
  );
}

function addSentinels(data) {
  const actor = data.power_map.actors[0];
  actor.funding = [SENTINELS[0]];
  actor.information_advantages = [SENTINELS[1]];
  actor.stated_objectives = [SENTINELS[2]];
  actor.plausible_unstated_incentives = [SENTINELS[3]];
  data.intervention_assessment.capture_assessment.criteria[0].reason =
    SENTINELS[4];
  data.consent_exit.accountability = [SENTINELS[5]];
  const distribution = data.distribution.items[0];
  distribution.protection = [SENTINELS[6]];
  distribution.opportunity = [SENTINELS[7]];
  distribution.recognition = [SENTINELS[8]];
  distribution.profit = [SENTINELS[9]];
  distribution.voice = [SENTINELS[10]];
  distribution.displacement = [SENTINELS[11]];
  distribution.outcome_character = "concealed";
  const future = data.scale_time.future_feedback_loops[0];
  future.drivers = [SENTINELS[12]];
  future.early_signals = [SENTINELS[13]];
  future.falsified_if = [SENTINELS[14]];
  const evidence = data.evidence.items[0];
  evidence.source_locator = SENTINELS[15];
  evidence.measurement_validity = SENTINELS[16];
  evidence.causal_identification = SENTINELS[17];
  evidence.conflicts_of_interest = SENTINELS[18];
  evidence.missing_data = SENTINELS[19];
  evidence.selection_effects = SENTINELS[20];
  evidence.relevant_comparison = SENTINELS[21];
  evidence.cross_context_applicability = SENTINELS[22];
  data.links[0].mechanism = SENTINELS[23];
  data.legal_framework.applicable_authorities = [SENTINELS[24]];
  data.international_comparison[0].transfer_limits = [SENTINELS[25]];
  data.theoretical_comparison[0].limitations = [SENTINELS[26]];
  data.self_audit_notes = [SENTINELS[27]];
  return data;
}

async function downloadFrom(page, selector, target) {
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.locator(selector).click(),
  ]);
  await download.saveAs(target);
  return fs.readFile(target, "utf8");
}

test("biopolitical HTML and JSON exports preserve the complete canonical contract", async ({
  page,
}, testInfo) => {
  const fixture = addSentinels(await readFixture());
  await page.goto("./");
  await page.locator("#langFr").click();
  await page.locator('[data-lens="biopolitical"]').click();
  await page.locator("#jsonInput").fill(JSON.stringify(fixture));
  await expect(page.locator("#importBtn")).toBeEnabled();
  await page.locator("#importBtn").click();
  const exportTab = page.locator('[data-bio-review="exports"]');
  await exportTab.click();
  await expect(exportTab).toHaveAttribute("aria-selected", "true");
  await expect(page.locator("#exportHtml")).toBeVisible();
  await expect(page.locator("#exportJson")).toBeVisible();

  const htmlPath = testInfo.outputPath("complete-biopolitical-report.html");
  const html = await downloadFrom(page, "#exportHtml", htmlPath);
  const jsonPath = testInfo.outputPath("complete-biopolitical-analysis.json");
  const jsonText = await downloadFrom(page, "#exportJson", jsonPath);

  for (const sentinel of SENTINELS) {
    expect(html, `HTML omitted ${sentinel}`).toContain(sentinel);
    expect(jsonText, `JSON omitted ${sentinel}`).toContain(sentinel);
  }
  expect(html).toContain('id="canonical-analysis"');
  expect(html).toContain('data-canonical-contract="complete"');
  expect(html).toContain('data-relationship-atlas="complete"');
  expect(html).toContain('data-relationship-family="explicit"');
  expect(html).toContain('data-relationship-family="evidence"');
  expect(html).toContain('data-relationship-family="structural"');
  expect(html).toContain('data-temporal-projection="canonical"');
  expect(html).toContain('data-comparative-projection="canonical"');
  expect(html).toContain('<html lang="en" dir="ltr"');

  const exported = JSON.parse(jsonText);
  expect(exported).toEqual(fixture);

  await testInfo.attach("complete-biopolitical-report.html", {
    path: htmlPath,
    contentType: "text/html",
  });
  await testInfo.attach("complete-biopolitical-analysis.json", {
    path: jsonPath,
    contentType: "application/json",
  });
});
