import { test, expect } from "@playwright/test";

test("premium shell preserves orientation, density, and lens parity", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator("#appHeader")).toBeVisible();
  await expect(page.locator("#workspaceBar")).toBeVisible();
  await expect(page.locator('[data-shell-nav="workflow"]')).toHaveAttribute("aria-current", "step");
  await expect(page.locator("#reviewNavShortcut")).toBeDisabled();
  await expect(page.locator("#lensContextLabel")).toContainText(/Strategic|استرات|stratég/i);

  await page.setViewportSize({ width: 320, height: 800 });
  const themeBounds = await page.locator("#themeBtn").boundingBox();
  expect(themeBounds).not.toBeNull();
  expect(themeBounds.width).toBeGreaterThanOrEqual(44);
  await page.locator("#themeBtn").click();
  await expect(page.locator("body")).toHaveClass(/dark/);
  await expect(page.locator('.workspaceNavItem.active .workspaceNavIndex')).toBeVisible();

  const density = page.locator("#densityBtn");
  await density.focus();
  await density.press("Enter");
  await expect(page.locator("body")).toHaveAttribute("data-density", "compact");
  await expect(density).toHaveAttribute("aria-pressed", "true");
  await page.reload();
  await expect(page.locator("body")).toHaveAttribute("data-density", "compact");

  await page.locator('[data-shell-nav="engine"]').click();
  await expect(page.locator('[data-shell-nav="engine"]')).toHaveAttribute("aria-current", "step");

  await page.locator('[data-lens="biopolitical"]').click();
  await expect(page.locator("#lensContextLabel")).toContainText(/Biopolitical|بيوسياس|biopolitique/i);
  await page.locator("#loadSampleBtn").click();
  await expect(page.locator("#reviewNavShortcut")).toBeEnabled();
  await expect(page.locator('[data-shell-nav="review"]')).toHaveAttribute("aria-current", "step");
  await expect(page.locator("#reviewPanel")).toBeVisible();

  await page.locator("#langFr").click();
  await expect(page.locator("#workspaceNav")).toHaveAttribute("aria-label", "Navigation de l’espace de travail");
  await expect(page.locator("#densityLabel")).toContainText("Compacte");
});
