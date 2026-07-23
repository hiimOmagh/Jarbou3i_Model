import { test, expect } from "@playwright/test";
async function loadStrategicSample(page) {
  await page.goto("/");
  await page.locator("#langEn").click();
  await page.locator("#loadSampleBtn").click();
}

test("strategic inspection exposes canonical provenance and navigable occurrences", async ({ page }) => {
  await loadStrategicSample(page);
  await page.locator('[data-review="inspection"]').click();

  const directory = page.locator("[data-results-inspection]");
  await expect(directory).toBeVisible();
  await expect(directory).toHaveAttribute("data-analysis-lens", "strategic");
  await expect(directory.locator("[data-inspection-directory-item]")).toHaveCount(14);

  const evidenceRecord = directory.locator(
    '[data-inspection-directory-item] [data-reference-id="E1"]',
  );
  await expect(evidenceRecord).toContainText("Historical power distribution reference");
  await expect(evidenceRecord).toContainText("E1");

  const search = directory.locator("#inspectionSearch");
  await evidenceRecord.evaluate((element) => { element.dataset.identityProbe = "preserved"; });
  await search.fill("historical power");
  await expect(directory.locator("[data-inspection-directory-item]:visible")).toHaveCount(1);
  await expect(evidenceRecord).toHaveAttribute("data-identity-probe", "preserved");

  await evidenceRecord.focus();
  await evidenceRecord.press("Enter");
  const inspector = page.locator(".referenceInspector");
  await expect(inspector).toBeVisible();
  await expect(inspector).toBeFocused();
  await expect(page.locator("#referenceInspectorTitle")).toHaveText(
    "Historical power distribution reference",
  );
  await expect(inspector.locator('[data-inspection-section="identity"]')).toContainText("Canonical ID");
  await expect(inspector.locator('[data-inspection-section="identity"]')).toContainText("/evidence/items/0");
  await expect(inspector.locator('[data-inspection-section="provenance"]')).toContainText("Historical power distribution reference");
  await expect(inspector.locator('[data-inspection-section="provenance"]')).toContainText("unreviewed");
  await expect(inspector.locator('[data-inspection-section="evidence"]')).toContainText(
    "Some European states retained substantial institutional and economic capacity",
  );
  await expect(inspector.locator('[data-inspection-section="audit"]')).toContainText("1.1.0");
  await expect(inspector.locator('[data-inspection-section="occurrences"]')).toContainText(
    "/evidence/items/0/id",
  );

  await inspector.locator("[data-reference-occurrence]").first().click();
  await expect(inspector).toBeHidden();
  await expect(page.locator('[data-review="evidence"]')).toHaveAttribute("aria-selected", "true");
  await expect(page.locator('[data-inspection-id="E1"]')).toBeFocused();
});

test("biopolitical inspection traverses linked records without losing return focus", async ({ page }) => {
  await page.goto("/");
  await page.locator("#langEn").click();
  await page.locator('[data-lens="biopolitical"]').click();
  await page.locator("#loadSampleBtn").click();
  await page.locator('[data-bio-review="inspection"]').click();

  const directory = page.locator("[data-results-inspection]");
  await expect(directory).toHaveAttribute("data-analysis-lens", "biopolitical");
  const evidenceRecord = directory.locator(
    '[data-inspection-directory-item] [data-reference-id="E1"]',
  );
  await expect(evidenceRecord).toContainText("Rules linked defined health credentials");
  await evidenceRecord.focus();
  await evidenceRecord.press("Enter");

  const inspector = page.locator(".referenceInspector");
  await expect(inspector.locator('[data-inspection-section="provenance"]')).toContainText("primary legal policy");
  await expect(inspector.locator('[data-inspection-section="provenance"]')).toContainText("unverified");
  await expect(inspector.locator('[data-inspection-section="evidence"]')).toContainText("sunset clauses");
  await expect(inspector.locator('[data-inspection-section="audit"]')).toContainText("canonical");
  await expect(inspector.locator('[data-inspection-section="occurrences"] [data-reference-occurrence]')).not.toHaveCount(0);

  const originalTitle = await page.locator("#referenceInspectorTitle").textContent();
  const linkedRecord = inspector.locator('[data-inspection-section="linked"] [data-reference-id]').first();
  await expect(linkedRecord).toBeVisible();
  await linkedRecord.click();
  await expect(page.locator("#referenceInspectorTitle")).not.toHaveText(originalTitle || "");

  await page.keyboard.press("Escape");
  await expect(inspector).toBeHidden();
  await expect(evidenceRecord).toBeFocused();
});

test("evidence trails expose back-references and stable cross-lens deep links", async ({ page }) => {
  await page.goto("/");
  await page.locator("#langEn").click();
  await page.locator('[data-lens="biopolitical"]').click();
  await page.locator("#loadSampleBtn").click();
  await page.locator('[data-bio-review="inspection"]').click();

  const intervention = page.locator(
    '[data-inspection-directory-item] [data-reference-id="IV1"]',
  );
  await intervention.click();
  const inspector = page.locator(".referenceInspector");
  const trail = inspector.locator('[data-inspection-section="evidence-trail"]');
  await expect(trail).toContainText("Rules linked defined health credentials");
  await expect(trail).toContainText("E1");

  const permanent = inspector.locator('.referencePermanentLink[href="#record=biopolitical:IV1"]');
  await expect(permanent).toBeVisible();
  await permanent.click();
  await expect(page).toHaveURL(/#record=biopolitical:IV1$/);
  await inspector.locator(".referenceInspectorClose").click();
  await expect(page).not.toHaveURL(/#record=/);

  await page.evaluate(() => { window.location.hash = "record=biopolitical:E1"; });
  await expect(inspector).toBeVisible();
  await expect(page.locator("#referenceInspectorTitle")).toContainText("Rules linked defined health credentials");
  await expect(inspector.locator('[data-inspection-section="evidence-trail"]')).toContainText("IV1");
});

test("source clusters and evidence gaps remain authored, navigable, and lens-specific", async ({ page }) => {
  await loadStrategicSample(page);
  await page.locator('[data-review="inspection"]').click();

  const strategic = page.locator('[data-evidence-intelligence]');
  await strategic.locator("summary").click();
  await expect(strategic).toHaveAttribute("open", "");
  await expect(strategic.locator('[data-source-cluster="SC1"]')).toContainText(
    "Historical power distribution reference",
  );
  await expect(strategic.locator('[data-evidence-gap="uncitedEvidence"]')).toContainText("E1");
  await expect(strategic.locator('[data-evidence-gap="missingSourceDate"]')).toHaveCount(0);
  await strategic.locator('[data-source-cluster="SC1"] [data-reference-id="E1"]').click();
  await expect(page.locator("#referenceInspectorTitle")).toHaveText(
    "Historical power distribution reference",
  );
  await page.keyboard.press("Escape");

  await page.locator('[data-lens="biopolitical"]').click();
  await page.locator("#loadSampleBtn").click();
  await page.locator('[data-bio-review="inspection"]').click();
  const biopolitical = page.locator('[data-evidence-intelligence]');
  await biopolitical.locator("summary").click();
  await expect(biopolitical.locator("[data-source-cluster]")).toHaveCount(2);
  await expect(biopolitical.locator('[data-evidence-gap="untraceableEvidence"] [data-reference-id]')).toHaveCount(2);
  await expect(biopolitical.locator(".evidenceIntelligenceMetrics")).toContainText("2/2");
});
