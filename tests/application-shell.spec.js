import { test, expect } from "@playwright/test";
import { openStep } from "./helpers/guided-flow.js";

async function renderRegionCounts(page) {
  return page.evaluate(() =>
    Object.fromEntries(
      window.Jarbou3iPlatformDiagnostics
        .inspect()
        .renderRegions
        .map(({ name, count }) => [name, count]),
    ),
  );
}

function expectShellOnlyIncrement(before, after) {
  expect(after.shell - before.shell).toBe(1);
  for (const region of ["workflow", "engine", "review"]) {
    expect(after[region] - before[region]).toBe(0);
  }
}

test("premium shell preserves orientation, density, and lens parity", async ({ page }) => {
  await page.goto("./");

  await expect(page.locator("#appHeader")).toBeVisible();
  await expect(page.locator("#workspaceBar")).toBeVisible();
  await expect(page.locator('[data-shell-nav="workflow"]')).toHaveAttribute("aria-current", "step");
  await expect(page.locator("#reviewNavShortcut")).toBeDisabled();
  await expect(page.locator("#lensContextLabel")).toContainText(/Strategic|استرات|stratég/i);

  await page.setViewportSize({ width: 320, height: 800 });
  const themeBounds = await page.locator("#themeBtn").boundingBox();
  expect(themeBounds).not.toBeNull();
  // 44px target; the 0.01px allows float noise in the measured box (Firefox: 43.999996).
  expect(themeBounds.width).toBeGreaterThanOrEqual(44 - 0.01);
  await page.locator("#themeBtn").click();
  await expect(page.locator("body")).toHaveClass(/dark/);
  await expect(page.locator('.j-shell-phase[aria-current="step"] .j-shell-phase-index')).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

  const density = page.locator("#densityBtn");
  const beforeDensity = await renderRegionCounts(page);
  await density.focus();
  await density.press("Enter");
  const afterDensity = await renderRegionCounts(page);
  expectShellOnlyIncrement(beforeDensity, afterDensity);
  await expect(page.locator("body")).toHaveAttribute("data-density", "compact");
  await expect(density).toHaveAttribute("aria-pressed", "true");
  await page.reload();
  await expect(page.locator("body")).toHaveAttribute("data-density", "compact");

  const beforeNavigation = await renderRegionCounts(page);
  await page.locator('[data-shell-nav="engine"]').click();
  const afterNavigation = await renderRegionCounts(page);
  expectShellOnlyIncrement(beforeNavigation, afterNavigation);
  await expect(page.locator('[data-shell-nav="engine"]')).toHaveAttribute("aria-current", "step");
  await page.locator("#enginePanel").scrollIntoViewIfNeeded();

  await openStep(page, "lens");
  const biopoliticalLens = page.locator('[data-lens="biopolitical"]');
  await biopoliticalLens.click();
  await expect(biopoliticalLens).toHaveAttribute("aria-checked", "true");
  await expect(page.locator("body")).toHaveClass(/bio-v2/);
  await expect(page.locator("#lensContextLabel")).toContainText(/Biopolitical|بيوسياس|biopolitique/i);
  await page.locator("#loadSampleBtn").click();
  await expect(page.locator("#reviewNavShortcut")).toBeEnabled();
  await expect(page.locator('[data-shell-nav="review"]')).toHaveAttribute("aria-current", "step");
  await expect(page.locator("#reviewPanel")).toBeVisible();

  await page.locator("#langFr").click();
  await expect(page.locator("#workspaceNav")).toHaveAttribute("aria-label", "Navigation de l’espace de travail");
  await expect(page.locator("#densityLabel")).toContainText("Compacte");
});

test("responsive commands and workspace navigation preserve keyboard continuity", async ({ page }) => {
  await page.goto("./");
  await page.locator("#langEn").click();

  const nextAction = page.locator("#shellNextAction");
  await expect(nextAction).toHaveAttribute("data-shell-command", "topic");
  await expect(page.locator("#shellNextActionLabel")).toHaveText("Start with a topic");
  await nextAction.click();
  await expect(page.locator("#topicInput")).toBeFocused();

  const workflowNav = page.locator('[data-shell-nav="workflow"]');
  const engineNav = page.locator('[data-shell-nav="engine"]');
  await workflowNav.focus();
  await workflowNav.press("ArrowRight");
  await expect(engineNav).toBeFocused();
  await expect(engineNav).toHaveAttribute("aria-current", "step");
  await engineNav.press("ArrowRight");
  await expect(workflowNav).toBeFocused();
  await expect(page.locator("#reviewNavShortcut")).toHaveAttribute("tabindex", "-1");

  await openStep(page, "topic");
  await page.locator("#topicInput").fill("Regional water governance, 2024–2026");
  // The next action names the task of the step the user is on.
  await openStep(page, "lens");
  await expect(nextAction).toHaveAttribute("data-shell-command", "lens");
  await expect(page.locator("#shellNextActionLabel")).toHaveText("Choose a lens");
  await openStep(page, "prompt");
  await expect(page.locator("#shellNextActionLabel")).toHaveText("Copy the prompt");
  await nextAction.click();
  await expect(page.locator("#copyPromptBtn")).toBeFocused();
  await page.locator("#copyPromptBtn").click();
  if (await page.locator("#modalBackdrop.show").isVisible()) {
    await page.locator("#modalClose").click();
  }
  await expect(nextAction).toHaveAttribute("data-shell-command", "import");
  await expect(page.locator("#shellNextActionLabel")).toHaveText("Continue to import");
  await nextAction.click();
  await expect(page.locator("#jsonInput")).toBeFocused();

  await page.locator("#loadSampleBtn").click();
  await expect(nextAction).toHaveAttribute("data-shell-command", "review");
  await expect(page.locator("#shellNextActionLabel")).toHaveText("Review analysis");
  await nextAction.click();
  await expect(page.locator("#reviewTitle")).toBeFocused();

  await workflowNav.focus();
  await workflowNav.press("End");
  await expect(page.locator("#reviewNavShortcut")).toBeFocused();
  await expect(page.locator("#reviewNavShortcut")).toHaveAttribute("aria-current", "step");

  await page.setViewportSize({ width: 320, height: 800 });
  await page.locator("#workspaceBar").scrollIntoViewIfNeeded();
  const shellBounds = await nextAction.boundingBox();
  expect(shellBounds).not.toBeNull();
  expect(shellBounds.x).toBeGreaterThanOrEqual(0);
  expect(shellBounds.x + shellBounds.width).toBeLessThanOrEqual(320);
  // The guided flow fits a phone: its steps and the open step's actions stay in reach.
  await expect(page.locator('[data-flow-step="answer"][aria-current="step"]')).toBeVisible();
  await expect(page.locator("#importBtn")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
});
