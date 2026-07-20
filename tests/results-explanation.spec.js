import { test, expect } from "@playwright/test";

test("shared explanation hierarchy drills into authored details across both lenses", async ({ page }) => {
  await page.goto("/");
  await page.locator("#langEn").click();
  await page.locator("#loadSampleBtn").click();

  const explanation = page.locator("[data-results-explanation]");
  await expect(explanation).toBeVisible();
  await expect(explanation).toHaveAttribute("data-analysis-lens", "strategic");
  await expect(explanation.locator("[data-explanation-section]")).toHaveCount(5);
  await expect(explanation.locator('[data-explanation-section="actors"]')).toContainText("United States");
  await expect(explanation.locator('[data-explanation-section="mechanisms"]')).toContainText("New international institutions");
  await expect(explanation.locator('[data-explanation-section="tensions"]')).toContainText("Liberating peoples");
  await expect(explanation.locator('[data-explanation-section="effects"]')).toContainText("Rise of bipolarity");

  const strategicEvidenceCard = explanation.locator('[data-explanation-section="evidence"]');
  const strategicEvidenceName = (await strategicEvidenceCard.locator(".explanationItems strong").first().textContent())?.trim();
  expect(strategicEvidenceName).toBeTruthy();
  expect(strategicEvidenceName).not.toBe("—");
  const strategicEvidence = strategicEvidenceCard.locator("[data-explanation-open]");
  await strategicEvidence.focus();
  await strategicEvidence.press("Enter");
  await expect(page.locator('[data-review="evidence"]')).toHaveAttribute("aria-selected", "true");
  await expect(page.locator("#reviewContent")).toContainText(strategicEvidenceName);

  await page.locator('[data-review="overview"]').click();

  const strategicMechanisms = explanation
    .locator('[data-explanation-section="mechanisms"] [data-explanation-open]');
  await strategicMechanisms.focus();
  await expect(strategicMechanisms).toBeFocused();
  await strategicMechanisms.press("Enter");
  await expect(page.locator('[data-review="pillars"]')).toHaveAttribute("aria-selected", "true");
  await expect(page.locator('[data-acc="tools"]')).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator('[data-acc="tools"]')).toBeFocused();

  await page.locator('[data-review="overview"]').click();
  await page.locator('[data-lens="biopolitical"]').click();
  await page.locator("#loadSampleBtn").click();
  await expect(explanation).toHaveAttribute("data-analysis-lens", "biopolitical");
  await expect(explanation.locator("[data-explanation-section]")).toHaveCount(5);
  await expect(explanation.locator('[data-explanation-section="actors"]')).toContainText("Public-health authorities");
  await expect(explanation.locator('[data-explanation-section="mechanisms"]')).toContainText("QR credential and verification rule");
  await expect(explanation.locator('[data-explanation-section="tensions"]')).toContainText("Collective protection");
  await expect(explanation.locator('[data-explanation-section="effects"]')).toContainText("Workers and residents");

  const biopoliticalEvidenceCard = explanation.locator('[data-explanation-section="evidence"]');
  const biopoliticalEvidenceName = (await biopoliticalEvidenceCard.locator(".explanationItems strong").first().textContent())?.trim();
  expect(biopoliticalEvidenceName).toBeTruthy();
  expect(biopoliticalEvidenceName).not.toBe("—");
  const biopoliticalEvidence = biopoliticalEvidenceCard.locator("[data-explanation-open]");
  await biopoliticalEvidence.focus();
  await biopoliticalEvidence.press("Enter");
  await expect(page.locator('[data-bio-review="evidence"]')).toHaveAttribute("aria-selected", "true");
  await expect(page.locator("#reviewContent")).toContainText(biopoliticalEvidenceName);

  await page.locator('[data-bio-review="overview"]').click();

  const biopoliticalEffects = explanation
    .locator('[data-explanation-section="effects"] [data-explanation-open]');
  await biopoliticalEffects.focus();
  await biopoliticalEffects.press("Enter");
  await expect(page.locator('[data-bio-review="pillars"]')).toHaveAttribute("aria-selected", "true");
  await expect(page.locator('[data-bio-acc="distribution_effects"]')).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator('[data-bio-acc="distribution_effects"]')).toBeFocused();

  await page.locator('[data-bio-review="overview"]').click();
  await page.locator("#langFr").click();
  await expect(explanation.locator("#resultsExplanationTitle")).toHaveText("Comment la conclusion est construite");
  await expect(explanation.locator('[data-explanation-section="evidence"] h4')).toHaveText("Preuves et contre-preuves");

  await page.setViewportSize({ width: 320, height: 800 });
  await explanation.scrollIntoViewIfNeeded();
  const bounds = await explanation.boundingBox();
  expect(bounds).not.toBeNull();
  expect(bounds.x).toBeGreaterThanOrEqual(0);
  expect(bounds.x + bounds.width).toBeLessThanOrEqual(320);
  await expect(explanation.locator("[data-explanation-section]")).toHaveCount(5);
  await expect(explanation.locator('[data-explanation-section="effects"] [data-explanation-open]')).toBeVisible();
});
