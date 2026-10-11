import { expect } from "@playwright/test";

// The setup phase shows one step at a time (src/features/guided-flow.js):
// a test opens the step that holds the control it is about to use.
export async function openStep(page, step) {
  const button = page.locator(`[data-flow-step="${step}"]`);
  // A click that lands while the page still scrolls smoothly can miss the
  // button, so click until the step is the current one.
  await expect(async () => {
    if ((await button.getAttribute("aria-current")) !== "step") await button.click({ timeout: 5000 });
    await expect(button).toHaveAttribute("aria-current", "step", { timeout: 1000 });
  }).toPass({ timeout: 20000 });
}
