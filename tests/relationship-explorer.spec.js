import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

async function openExplorer(page, lang = "en") {
  await page.goto("/");
  await page.locator(`#lang${lang[0].toUpperCase()}${lang.slice(1)}`).click();
  await page.locator("#analysisLang").selectOption(lang);
  await page.locator('[data-lens="biopolitical"]').click();
  await page.locator("#loadSampleBtn").click();
  await expect(page.locator('[data-bio-review="overview"]')).toHaveAttribute("aria-selected", "true");
  const connections = page.locator('[data-bio-review="connections"]');
  await connections.focus();
  await expect(connections).toBeFocused();
  await connections.press("Enter");
  await expect(page.locator('[data-bio-review="connections"]')).toHaveAttribute("aria-selected", "true");
  await expect(page.locator("#relationshipExplorerMount")).toBeVisible();
}

test("Story, Evidence trail, and Network modes expose deterministic graph layers", async ({ page }) => {
  await openExplorer(page);
  await page.locator('[data-map-view="map"]').click();

  await expect(page.locator('[data-map-mode="story"]')).toHaveAttribute("aria-checked", "true");
  await expect(page.locator(".relationshipCount")).toContainText("6 records");
  await expect(page.locator(".relationshipCount")).toContainText("4 connections");
  await expect(page.locator(".relationshipStoryPath")).toHaveCount(2);
  await expect(page.locator("[data-story-edge]")).toHaveCount(4);

  await page.locator('[data-map-mode="evidence"]').click();
  await expect(page.locator('[data-map-mode="evidence"]')).toHaveAttribute("aria-checked", "true");
  await expect(page.locator("[data-evidence-edge]")).toHaveCount(17);
  await expect(page.locator(".relationshipEvidenceCluster").first()).toBeVisible();

  await page.locator('[data-map-mode="network"]').click();
  await expect(page.locator(".relationshipCount")).toContainText("32 records");
  await expect(page.locator(".relationshipCount")).toContainText("28 connections");
  await expect(page.locator('[data-map-lane]')).toHaveCount(9);
  await expect(page.locator(".relationshipEdge--explicit")).toHaveCount(4);
});

test("localized relationship views never leak English relation enums or raw resistance forms", async ({ page }) => {
  const expectations = {
    ar: ["يمكّن", "يصنّف", "يوزّع", "يقاوم", "عمال وسكان خاضعون لفحوص الوصول"],
    fr: ["Permet", "Classe", "Distribue", "Résiste", "Travailleurs et résidents soumis aux contrôles d’accès"],
  };
  for (const [locale, labels] of Object.entries(expectations)) {
    await openExplorer(page, locale);
    await page.locator('[data-map-view="map"]').click();
    const explorer = page.locator("#relationshipExplorerMount");
    for (const label of labels) await expect(explorer).toContainText(label);
    await expect(explorer).not.toContainText(/\b(?:Enables|Classifies|Distributes|Resists|litigation)\b/);
  }
});

test("search, filters, node inspection, and edge details stay synchronized", async ({ page }) => {
  await openExplorer(page);
  const networkMode = page.locator('[data-map-mode="network"]');
  await networkMode.focus();
  await expect(networkMode).toBeFocused();
  await networkMode.press("Enter");
  await expect(networkMode).toHaveAttribute("aria-checked", "true");

  await page.locator("#relationshipSearch").fill("Public-health authorities");
  await expect(page.locator(".relationshipCount")).toContainText("1 records");
  await expect(page.locator('[data-map-node="ACT1"]')).toBeVisible();
  await page.locator('[data-map-node="ACT1"]').click();
  await expect(page.locator("#referenceInspectorTitle")).toHaveText("Public-health authorities");
  await expect(page.locator("#referenceShowMap")).toBeVisible();
  await page.keyboard.press("Escape");

  await page.locator("[data-map-reset]").click();
  await networkMode.focus();
  await networkMode.press("Enter");
  await expect(networkMode).toHaveAttribute("aria-checked", "true");
  const listView = page.locator('[data-map-view="list"]');
  await listView.focus();
  await expect(listView).toBeFocused();
  await listView.press("Enter");
  await expect(listView).toHaveAttribute("aria-pressed", "true");
  const edge = page.locator("[data-map-edge]").first();
  await edge.focus();
  await expect(edge).toBeFocused();
  await edge.press("Enter");
  await expect(page.locator(".relationshipEdgeDetails")).toBeVisible();
  await expect(page.locator(".relationshipEdgeDetails")).toContainText("Why connected?");
});

test("Guided and Analyst detail levels preserve clarity and provenance", async ({ page }) => {
  await openExplorer(page);
  await page.locator('[data-map-view="map"]').click();
  await expect(page.locator('[data-map-depth="guided"]')).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".relationshipNodeMeta")).toHaveCount(0);
  await expect(page.locator("[data-story-edge]")).toHaveCount(4);

  await page.locator("[data-story-edge]").first().click();
  await expect(page.locator(".relationshipWhy")).toBeVisible();
  await expect(page.locator(".relationshipEdgeDetails code")).toHaveCount(0);

  await page.locator('[data-map-depth="analyst"]').click();
  await expect(page.locator('[data-map-depth="analyst"]')).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".relationshipNodeMeta").first()).toBeVisible();
  await expect(page.locator(".relationshipEdgeDetails code")).toBeVisible();
  await expect(page.locator(".relationshipAdvanced")).toHaveAttribute("open", "");
});

test("temporal and comparative overlays expose canonical context without changing the graph", async ({ page }) => {
  await openExplorer(page);
  const originalCount = await page.locator(".relationshipCount").textContent();

  await page.locator('[data-map-overlay="temporal"]').click();
  const timeline = page.locator('[data-relationship-overlay="temporal"]');
  await expect(timeline).toBeVisible();
  await expect(timeline.locator("[data-time-band]")).toHaveCount(5);
  await expect(timeline.locator('[data-time-band="immediate"] h4')).toContainText("2");
  await expect(timeline).toContainText("not an inferred chronology");
  await expect(page.locator(".relationshipCount")).toHaveText(originalCount || "");

  await page.locator('[data-map-overlay="comparative"]').click();
  const comparison = page.locator('[data-relationship-overlay="comparative"]');
  await expect(comparison).toContainText("2020–2022, selected European jurisdictions");
  await expect(comparison).toContainText("Transfer limits");
  await expect(comparison.locator('[data-map-node="E1"]')).toContainText("Rules linked defined health credentials");
  await expect(page.locator(".relationshipCount")).toHaveText(originalCount || "");
});

test("analysis-scoped saved views restore and delete presentation state", async ({ page }) => {
  await openExplorer(page);
  const networkMode = page.locator('[data-map-mode="network"]');
  await networkMode.focus();
  await networkMode.press("Enter");
  await expect(networkMode).toHaveAttribute("aria-checked", "true");
  const analystDepth = page.locator('[data-map-depth="analyst"]');
  await analystDepth.focus();
  await analystDepth.press("Enter");
  await expect(analystDepth).toHaveAttribute("aria-pressed", "true");
  const temporalOverlay = page.locator('[data-map-overlay="temporal"]');
  await temporalOverlay.focus();
  await temporalOverlay.press("Enter");
  await expect(temporalOverlay).toHaveAttribute("aria-pressed", "true");
  const search = page.locator("#relationshipSearch");
  const saveView = page.locator("[data-save-view]");
  const searchNode = await search.elementHandle();
  const saveNode = await saveView.elementHandle();
  await search.fill("Public-health authorities");
  await expect(search).toHaveValue("Public-health authorities");
  await page.evaluate(() => new Promise((resolve) =>
    requestAnimationFrame(() => requestAnimationFrame(resolve)),
  ));
  expect(await searchNode.evaluate((node) => node === document.querySelector("#relationshipSearch"))).toBe(true);
  expect(await saveNode.evaluate((node) => node === document.querySelector("[data-save-view]"))).toBe(true);
  await saveView.focus();
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(resolve)));
  await expect(saveView).toBeFocused();
  await saveView.press("Enter");

  const select = page.locator("#relationshipSavedView");
  await expect(select.locator("option")).toHaveCount(2);
  const savedId = await select.inputValue();
  expect(savedId).not.toBe("");

  await page.locator("[data-map-reset]").click();
  await expect(page.locator('[data-map-mode="story"]')).toHaveAttribute("aria-checked", "true");
  await expect(page.locator('[data-map-overlay="none"]')).toHaveAttribute("aria-pressed", "true");
  const restoreView = page.locator("[data-restore-view]");
  await restoreView.focus();
  await restoreView.press("Enter");
  await expect(page.locator('[data-map-mode="network"]')).toHaveAttribute("aria-checked", "true");
  await expect(page.locator('[data-map-depth="analyst"]')).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator('[data-map-overlay="temporal"]')).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("#relationshipSearch")).toHaveValue("Public-health authorities");

  await openExplorer(page);
  await expect(page.locator(`#relationshipSavedView option[value="${savedId}"]`)).toHaveCount(1);
  await page.locator("#relationshipSavedView").selectOption(savedId);
  const deleteView = page.locator("[data-delete-view]");
  await deleteView.evaluate((button) => button.focus({ preventScroll: true }));
  await expect(deleteView).toBeFocused();
  await deleteView.press("Enter");
  await expect(page.locator("#relationshipSavedView option")).toHaveCount(1);
  await expect(page.locator("[data-restore-view]")).toBeDisabled();
});

test("capability-gated Spatial view preserves the complete graph and accessible fallback", async ({ page }) => {
  await openExplorer(page);
  const spatialToggle = page.locator('[data-map-view="spatial"]');
  const mobile = await page.evaluate(() => innerWidth < 761);
  if (mobile) {
    await expect(spatialToggle).toBeDisabled();
    await expect(page.locator('[data-map-view="list"]')).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("[data-relationship-spatial]")).toHaveCount(0);
    return;
  }

  await expect(spatialToggle).toBeEnabled();
  await page.locator('[data-map-mode="network"]').click();
  await spatialToggle.click();
  await expect(spatialToggle).toHaveAttribute("aria-pressed", "true");
  const spatial = page.locator('[data-relationship-spatial="available"]');
  await expect(spatial).toBeVisible();
  await expect(spatial.locator(".relationshipSpatialNode")).toHaveCount(32);
  await expect(spatial.locator("[data-spatial-edge]")).toHaveCount(28);
  await expect(spatial.locator("[data-spatial-cluster]")).toHaveCount(9);

  const scene = spatial.locator(".relationshipSpatialScene");
  await expect(scene).toHaveAttribute("style", /--spatial-yaw:-18deg/);
  const orbitRight = spatial.locator('[data-spatial-control="right"]');
  await orbitRight.focus();
  await expect(orbitRight).toBeFocused();
  await orbitRight.press("Enter");
  await expect(scene).toHaveAttribute("style", /--spatial-yaw:-6deg/);
  const saveView = page.locator("[data-save-view]");
  await saveView.focus();
  await expect(saveView).toBeFocused();
  await saveView.press("Enter");
  await expect(page.locator("#relationshipSavedView option")).toHaveCount(2);
  const resetSpatial = page.locator("[data-spatial-reset]");
  await resetSpatial.focus();
  await expect(resetSpatial).toBeFocused();
  await resetSpatial.press("Enter");
  await expect(scene).toHaveAttribute("style", /--spatial-yaw:-18deg/);
  const restoreView = page.locator("[data-restore-view]");
  await restoreView.focus();
  await expect(restoreView).toBeFocused();
  await restoreView.press("Enter");
  await expect(page.locator('[data-map-view="spatial"]')).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".relationshipSpatialScene")).toHaveAttribute("style", /--spatial-yaw:-6deg/);
  await page.locator("#spatialRecordSelect").selectOption("ACT1");
  await expect(page.locator(".relationshipNodeDetails h3")).toHaveText("Public-health authorities");
  const openSelected = page.locator("[data-open-selected]");
  await openSelected.focus();
  await expect(openSelected).toBeFocused();
  await openSelected.press("Enter");
  await expect(page.locator("#referenceInspectorTitle")).toHaveText("Public-health authorities");
  await page.keyboard.press("Escape");

  const listView = page.locator('[data-map-view="list"]');
  await listView.focus();
  await expect(listView).toBeFocused();
  await listView.press("Enter");
  await expect(listView).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".relationshipList")).toBeVisible();
  await expect(page.locator("[data-relationship-spatial]")).toHaveCount(0);
});

test("Spatial view orbit controls are keyboard complete and reduced-motion safe", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openExplorer(page);
  const spatialToggle = page.locator('[data-map-view="spatial"]');
  if (await spatialToggle.isDisabled()) return;

  await page.locator('[data-map-mode="network"]').click();
  await spatialToggle.click();
  const viewport = page.locator(".relationshipSpatialViewport");
  const scene = page.locator(".relationshipSpatialScene");
  await viewport.focus();
  await expect(viewport).toBeFocused();
  await page.keyboard.press("ArrowLeft");
  await expect(scene).toHaveAttribute("style", /--spatial-yaw:-30deg/);
  await page.keyboard.press("=");
  await expect(scene).toHaveAttribute("style", /--spatial-zoom:0\.76/);
  await page.keyboard.press("Home");
  await expect(scene).toHaveAttribute("style", /--spatial-yaw:-18deg/);
  await expect(scene).toHaveAttribute("style", /--spatial-zoom:0\.68/);
  const transitionSeconds = await scene.evaluate((element) =>
    Number.parseFloat(getComputedStyle(element).transitionDuration) || 0,
  );
  expect(transitionSeconds).toBeLessThanOrEqual(0.001);

  const results = await new AxeBuilder({ page }).include(".relationshipSpatial").analyze();
  expect(results.violations.filter((item) => ["serious", "critical"].includes(item.impact))).toEqual([]);
});

test("Focus mode expands the workspace and exits with Escape", async ({ page }) => {
  await openExplorer(page);
  await page.locator("[data-focus-toggle]").click();
  await expect(page.locator(".relationshipExplorer")).toHaveClass(/is-focus/);
  await expect(page.locator("html")).toHaveClass(/relationshipFocusOpen/);
  await expect(page.locator(".relationshipFocusExit")).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(page.locator(".relationshipExplorer")).not.toHaveClass(/is-focus/);
  await expect(page.locator("html")).not.toHaveClass(/relationshipFocusOpen/);
  await expect(page.locator("[data-focus-toggle]")).toBeFocused();
});

test("guided walkthrough advances deterministic relationships and retains the final inspection", async ({ page }) => {
  await openExplorer(page);
  await page.locator('[data-map-view="map"]').click();
  await page.locator("[data-tour-toggle]").click();

  const walkthrough = page.locator(".relationshipWalkthrough");
  await expect(walkthrough).toBeVisible();
  await expect(walkthrough.locator('[role="progressbar"]')).toHaveAttribute("aria-valuenow", "1");
  await expect(page.locator("[data-story-edge].is-tour-target")).toHaveCount(1);

  await page.locator('[data-tour-step="next"]').click();
  await expect(walkthrough.locator('[role="progressbar"]')).toHaveAttribute("aria-valuenow", "2");
  await expect(page.locator(".relationshipInspection")).toContainText("Why connected?");

  await page.locator("[data-tour-stop]").click();
  await expect(walkthrough).toHaveCount(0);
  await expect(page.locator(".relationshipInspection")).toBeVisible();
});

test("edge inspection survives mode and view changes and can reveal hidden context", async ({ page }) => {
  await openExplorer(page);
  await page.locator('[data-map-view="map"]').click();
  await page.locator("[data-story-edge]").first().click();
  await expect(page.locator(".relationshipInspection")).toBeVisible();

  await page.locator('[data-map-mode="evidence"]').click();
  await expect(page.locator(".relationshipSelectionNotice")).toBeVisible();
  await page.locator('[data-map-view="list"]').click();
  await expect(page.locator(".relationshipInspection")).toContainText("Why connected?");

  await page.locator("[data-reveal-selection]").click();
  await expect(page.locator('[data-map-mode="network"]')).toHaveAttribute("aria-checked", "true");
  await expect(page.locator('[data-map-view="map"]')).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".relationshipSelectionNotice")).toHaveCount(0);
});

test("map controls and nodes support keyboard-only use", async ({ page }) => {
  await openExplorer(page);
  const story = page.locator('[data-map-mode="story"]');
  await story.focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.locator('[data-map-mode="evidence"]')).toBeFocused();
  await expect(page.locator('[data-map-mode="evidence"]')).toHaveAttribute("aria-checked", "true");

  await page.locator('[data-map-mode="network"]').click();
  const node = page.locator('[data-map-node="ACT1"]');
  await node.press("Space");
  await expect(page.locator('[data-map-node="ACT1"]')).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".referenceInspector")).toHaveCount(0);
  await page.locator('[data-map-node="ACT1"]').press("Enter");
  await expect(page.locator(".referenceInspector")).toBeVisible();
  await page.keyboard.press("Escape");
});

test("Arabic mobile explorer defaults to a labelled list without page overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openExplorer(page, "ar");
  await expect(page.locator(".relationshipExplorer")).toHaveAttribute("dir", "rtl");
  await expect(page.locator('[data-map-view="list"]')).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator('[data-map-view="spatial"]')).toBeDisabled();
  await expect(page.locator(".relationshipCapabilityNote")).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  expect(overflow).toBe(false);
  const results = await new AxeBuilder({ page }).include(".relationshipExplorer").analyze();
  expect(results.violations.filter((item) => ["serious", "critical"].includes(item.impact))).toEqual([]);
});
