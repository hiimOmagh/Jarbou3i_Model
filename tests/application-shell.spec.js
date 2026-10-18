import { test, expect } from "@playwright/test";
import fs from "node:fs/promises";
import { openStep } from "./helpers/guided-flow.js";
import { displayControl } from "./helpers/display-menu.js";

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
  const theme = await displayControl(page, "themeBtn");
  const themeBounds = await theme.boundingBox();
  expect(themeBounds).not.toBeNull();
  // 44px target; the 0.01px allows float noise in the measured box (Firefox: 43.999996).
  expect(themeBounds.height).toBeGreaterThanOrEqual(44 - 0.01);
  await theme.click();
  // A choice closes the menu, so it never covers the page it changed.
  await expect(page.locator("#displayMenu")).toBeHidden();
  await expect(page.locator("body")).toHaveClass(/dark/);
  await expect(page.locator('.j-shell-phase[aria-current="step"] .j-shell-phase-index')).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

  const density = await displayControl(page, "densityBtn");
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
  await expect(page.locator("#lensContextLabel")).toContainText(/Biopolitical|السياسة الحيوية|biopolitique/i);
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
  // On a phone the guided flow carries the setup steps' primary action, so
  // the header's next action waits for an analysis.
  const phone = page.viewportSize().width <= 720;
  const runNext = async (focused, step) => {
    if (phone) {
      await expect(nextAction).toBeHidden();
      // The guided flow takes the same step there.
      if (step) await openStep(page, step);
      return;
    }
    await nextAction.click();
    await expect(page.locator(focused)).toBeFocused();
  };
  await expect(nextAction).toHaveAttribute("data-shell-command", "topic");
  await expect(page.locator("#shellNextActionLabel")).toHaveText("Start with a topic");
  await runNext("#topicInput");

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
  await runNext("#copyPromptBtn");
  await page.locator("#copyPromptBtn").click();
  if (await page.locator("#modalBackdrop.show").isVisible()) {
    await page.locator("#modalClose").click();
  }
  await expect(nextAction).toHaveAttribute("data-shell-command", "import");
  await expect(page.locator("#shellNextActionLabel")).toHaveText("Continue to import");
  await runNext("#jsonInput", "answer");

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

test("one title names both lenses, with what the tool is for under it", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("./");
  await page.locator("#langEn").click();
  const title = page.locator("#appHeader h1");
  const name = await title.textContent();
  await expect(page.locator(".j-shell-lead")).toBeVisible();
  await openStep(page, "lens");
  await page.locator('[data-lens="biopolitical"]').click();
  await expect(title).toHaveText(name);
  await expect(page).toHaveTitle(`${name} — Jarbou3i Model`);
});

test("a phone's first screen holds the topic field and one primary action", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("./");
  for (const language of ["#langAr", "#langEn", "#langFr"]) {
    await page.locator(language).click();
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(page.locator("#topicInput")).toBeInViewport({ ratio: 1 });
    await expect(page.locator("#shellNextAction")).toBeHidden();
    await expect(page.locator("#flowNext")).toBeVisible();
    await expect(page.locator(".j-shell-lead")).toBeHidden();
  }
});

test("below 900px density and theme are named in a Display menu that stays on screen", async ({ page }) => {
  for (const { width, language, names } of [
    { width: 768, language: "#langFr", names: ["Densité", "Thème"] },
    { width: 390, language: "#langAr", names: ["الكثافة", "الوضع"] },
  ]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("./");
    await page.locator(language).click();
    await expect(page.locator("#densityBtn")).toBeHidden();
    const button = page.locator("#displayMenuBtn");
    await button.focus();
    await button.press("Enter");
    const menu = page.locator("#displayMenu");
    await expect(menu).toBeVisible();
    await expect(page.locator("#densityBtn")).toContainText(names[0]);
    await expect(page.locator("#themeBtn")).toContainText(names[1]);
    const box = await menu.boundingBox();
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(width);
    // Escape closes it and gives focus back; a choice closes it too.
    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
    await expect(button).toBeFocused();
    await button.press("Enter");
    const density = await page.locator("body").getAttribute("data-density");
    await page.locator("#densityBtn").click();
    await expect(menu).toBeHidden();
    await expect(page.locator("body")).not.toHaveAttribute("data-density", density);
  }
  // A rotation closes it; above 900px the controls are back in the header's row.
  await page.locator("#displayMenuBtn").click();
  await expect(page.locator("#displayMenu")).toBeVisible();
  await page.setViewportSize({ width: 1280, height: 800 });
  await expect.poll(() => page.locator("#displayMenu").evaluate((menu) => menu.matches(":popover-open"))).toBe(false);
  await expect(page.locator("#displayMenuBtn")).toBeHidden();
  await expect(page.locator("#themeBtn")).toBeVisible();
});

test("the open case's title has its own header row, not a few letters", async ({ page }) => {
  const data = JSON.parse(await fs.readFile(`${process.cwd()}/fixtures/sample-analysis-en.json`, "utf8"));
  data.subject.title = "How regional water governance reshapes cross-border alliances between 2024 and 2026";
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("./");
  await page.locator("#langEn").click();
  await openStep(page, "answer");
  await page.locator("#jsonInput").fill(JSON.stringify(data));
  await page.locator("#importBtn").click();
  const title = page.locator("#shellCaseTitle");
  await expect(title).toHaveText(data.subject.title);
  expect(await title.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
});
