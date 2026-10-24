import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { openStep } from "./helpers/guided-flow.js";

// The command palette (src/features/command-palette.js) runs the app's own
// controls by their own labels; it lists only what is enabled now.
const options = (page) => page.locator("#commandPaletteList [role=option]");

test.describe("Command palette", () => {
  test("opens with Ctrl+K, filters, runs a control and gives focus back", async ({ page }) => {
    await page.goto("./");
    await page.locator("#langEn").click();
    await openStep(page, "topic");
    await page.locator("#topicInput").focus();
    await page.keyboard.press("Control+k");
    await expect(page.locator("#commandPalette")).toBeVisible();
    await expect(page.locator("#commandPaletteInput")).toBeFocused();
    // Review is disabled until an analysis is open, so it is not offered.
    await expect(options(page).filter({ hasText: "Go to: Set up" })).toHaveCount(1);
    await expect(options(page).filter({ hasText: "Go to: Review" })).toHaveCount(0);

    await page.keyboard.type("langu fr");
    await expect(options(page)).toHaveCount(1);
    await expect(options(page).first()).toHaveAttribute("aria-selected", "true");
    await page.keyboard.press("Enter");
    await expect(page.locator("#commandPalette")).toBeHidden();
    await expect(page.locator("html")).toHaveAttribute("lang", "fr");

    // On a phone the commands are in the header's menu, which closes first.
    const header = page.locator("#commandPaletteBtn");
    const opener = (await header.isVisible()) ? header : page.locator("#displayMenuBtn");
    await opener.click();
    if (opener !== header) await page.locator("#menuCommandsBtn").click();
    await expect(page.locator("#displayMenu")).toBeHidden();
    await page.keyboard.type("zzzz");
    await expect(options(page)).toHaveCount(0);
    await expect(page.locator("#commandPaletteEmpty")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator("#commandPalette")).toBeHidden();
    await expect(opener).toBeFocused();
  });

  test("runs the theme from the header's closed menu and gives focus to its button", async ({ page }) => {
    await page.goto("./");
    await page.locator("#langEn").click();
    const dark = await page.locator("body").evaluate((body) => body.classList.contains("dark"));
    await page.keyboard.press("Control+k");
    await page.keyboard.type("toggle theme");
    await expect(options(page)).toHaveCount(1);
    await page.keyboard.press("Enter");
    await expect(page.locator("#commandPalette")).toBeHidden();
    await expect.poll(() => page.locator("body").evaluate((body) => body.classList.contains("dark"))).toBe(!dark);
    await expect(page.locator("#displayMenuBtn")).toBeFocused();
  });

  test("jumps to a case-file section of the open analysis", async ({ page }) => {
    await page.goto("./");
    await page.locator("#langEn").click();
    await page.locator("#loadSampleBtn").click();
    await page.keyboard.press("Control+k");
    await page.keyboard.type("open evidence");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowUp");
    await expect(page.locator("#commandPaletteInput")).toHaveAttribute("aria-activedescendant", "command-0");
    await page.keyboard.press("Enter");
    await expect(page.locator('[data-review="evidence"]')).toHaveAttribute("aria-current", "location");
    // The outline jump moved focus to the section; the palette leaves it there.
    await expect(page.locator("#case-evidence")).toBeFocused();
  });

  test("speaks the page language and keeps its contracts and contrast", async ({ page }) => {
    await page.goto("./");
    await page.locator("#langAr").click();
    await page.keyboard.press("Control+k");
    await expect(page.locator("#commandPaletteInput")).toHaveAttribute("placeholder", "اكتب أمرًا أو اسم قسم");
    await expect(options(page).filter({ hasText: "انتقل إلى: الإعداد" })).toHaveCount(1);
    const problems = await page.evaluate(async () => {
      const { checkContracts } = await import("./src/ui/contracts.js");
      return checkContracts(document.getElementById("appShell"));
    });
    expect(problems).toEqual([]);
    // Contrast is measured once the dialog has finished fading in.
    await page.evaluate(() => Promise.all(document.getElementById("commandPalette").getAnimations({ subtree: true }).map((animation) => animation.finished)));
    const { violations } = await new AxeBuilder({ page }).include("#commandPalette").analyze();
    const serious = violations.filter((violation) => ["serious", "critical"].includes(violation.impact));
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
  });
});
