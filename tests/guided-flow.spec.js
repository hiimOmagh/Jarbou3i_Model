import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs/promises";
import path from "node:path";
import { hitHeight } from "./helpers/kernel-check.js";

// The setup phase as the UX-0 prototype's guided flow (src/features/guided-flow.js):
// one step at a time, the guide beside it, the app's own controls inside.
const step = (page, name) => page.locator(`[data-flow-step="${name}"]`);
const answer = async (name) => fs.readFile(path.join(process.cwd(), "fixtures", name), "utf8");

test.describe("Guided flow", () => {
  test("walks the steps with Continue and Back, and jumps from the step list", async ({ page }) => {
    await page.goto("./");
    await page.locator("#langEn").click();
    await expect(step(page, "topic")).toHaveAttribute("aria-current", "step");
    await expect(page.locator("#flowStepOf")).toHaveText("Step 1 of 5");
    await expect(page.locator("#flowBack")).toBeHidden();
    // The first guidance stays plain after the language switch, not a warning.
    await expect(page.locator("#topicStatus")).toHaveAttribute("data-tone", "idle");
    // The step list and the examples are 44px targets.
    expect(await hitHeight(step(page, "lens"))).toBeGreaterThanOrEqual(44);
    expect(await hitHeight(page.locator(".j-flow-example").first())).toBeGreaterThanOrEqual(44);
    // A topic is needed to continue; an example gives one, with its context.
    await expect(page.locator("#flowNext")).toBeDisabled();
    await page.locator(".j-flow-example").first().click();
    await expect(page.locator("#topicInput")).toHaveValue("Semiconductor export controls");
    await expect(page.locator("#timeframeInput")).toHaveValue("2022–2026, United States, EU, China");
    await expect(page.locator("#flowNext")).toBeEnabled();

    await page.locator("#flowNext").click();
    await expect(page.locator("#flowStepTitle")).toBeFocused();
    await expect(page.locator("#flowStepTitle")).toHaveText("Which lens fits your question?");
    await expect(page.locator('[data-lens="biopolitical"]')).toBeVisible();
    await expect(page.locator("#topicInput")).toBeHidden();
    await page.locator("#flowBack").click();
    await expect(step(page, "topic")).toHaveAttribute("aria-current", "step");

    // The prompt step's stops sit under a rule: no side edge, corners or panel.
    await step(page, "prompt").click();
    const stop = await page.locator(".j-flow-howto li").first().evaluate((el) => {
      const style = getComputedStyle(el);
      return [style.borderTopWidth, style.borderLeftWidth, style.borderTopLeftRadius, style.backgroundColor === "rgba(0, 0, 0, 0)"];
    });
    expect(stop).toEqual(["1px", "0px", "0px", true]);

    await step(page, "answer").click();
    await expect(page.locator("#flowStepOf")).toHaveText("Step 5 of 5");
    await expect(page.locator("#jsonInput")).toBeVisible();
    // The last step's own action is Import; there is no Continue.
    await expect(page.locator("#flowNext")).toBeHidden();
    await expect(step(page, "topic")).toHaveAttribute("data-state", "done");
  });

  test("the guide reacts to the pasted answer", async ({ page }) => {
    await page.goto("./");
    await page.locator("#langEn").click();
    await step(page, "answer").click();
    await expect(page.locator("#flowGuide")).toHaveAttribute("data-mood", "idle");
    await page.locator("#jsonInput").fill("not json at all");
    await expect(page.locator("#flowGuide")).toHaveAttribute("data-mood", "crit");
    await expect(page.locator("#flowSay")).toHaveText("Something is off in the format. Let's fix it.");
    await page.locator("#jsonInput").fill(await answer("sample-analysis-en.json"));
    await expect(page.locator("#importBtn")).toBeEnabled();
    await expect(page.locator("#flowGuide")).toHaveAttribute("data-mood", "ok");
    await page.locator("#importBtn").click();
    await expect(page.locator("#reviewPanel")).toBeVisible();
    // Once imported, the answer step says so instead of offering the import again,
    // and keeps saying so in another language.
    await step(page, "answer").click();
    await expect(page.locator("#flowGuide")).toHaveAttribute("data-mood", "done");
    await expect(page.locator("#flowSay")).toHaveText("Imported. Your review is ready.");
    await expect(page.locator("#jsonStatus")).toHaveText(/^Imported: this is the analysis under review/);
    await page.locator("#langFr").click();
    await expect(page.locator("#jsonStatus")).toHaveText(/^Importée : c’est l’analyse en cours d’examen/);
  });

  test("says what each prompt mode asks for, beside the choice", async ({ page }) => {
    await page.goto("./");
    await page.locator("#langEn").click();
    await step(page, "settings").click();
    await expect(page.locator("#promptMode")).toHaveAccessibleDescription(/^Focused Shortest answer.*Expert Longer answer.*Research Longest answer/);
    // Named as the menu names them, in each language.
    const names = (selector) => page.locator(selector).allTextContents();
    expect(await names("#promptModeHelp dt")).toEqual(await names("#promptMode option"));
    await page.locator("#langAr").click();
    expect(await names("#promptModeHelp dt")).toEqual(await names("#promptMode option"));
  });

  test("speaks the page language and keeps its contracts and contrast", async ({ page }) => {
    await page.goto("./");
    await page.locator("#langAr").click();
    await expect(page.locator("#flowStepOf")).toHaveText("الخطوة 1 من 5");
    await expect(page.locator("#flowStepTitle")).toHaveText("ما الذي تريد فهمه؟");
    await page.locator("#langFr").click();
    await expect(step(page, "lens")).toHaveText(/Lentille/);
    await expect(page.locator(".j-flow-example").first()).toHaveText("Contrôle des exportations de semi-conducteurs");
    const problems = await page.evaluate(async () => {
      const { checkContracts } = await import("./src/ui/contracts.js");
      return checkContracts(document.getElementById("workflowPanel"));
    });
    expect(problems).toEqual([]);
    for (const name of ["topic", "lens", "settings", "prompt", "answer"]) {
      await step(page, name).click();
      await page.evaluate(() => Promise.all(document.getElementById("workflowPanel").getAnimations({ subtree: true }).filter((animation) => animation.effect?.getComputedTiming().iterations !== Infinity).map((animation) => animation.finished)));
      const { violations } = await new AxeBuilder({ page }).include("#workflowPanel").analyze();
      const serious = violations.filter((violation) => ["serious", "critical"].includes(violation.impact));
      expect(serious, `${name}: ${JSON.stringify(serious, null, 2)}`).toEqual([]);
    }
  });
});
