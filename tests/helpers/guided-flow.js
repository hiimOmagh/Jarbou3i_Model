import { expect } from "@playwright/test";

// The setup phase shows one step at a time (src/features/guided-flow.js):
// a test opens the step that holds the control it is about to use.
export async function openStep(page, step) {
  await openSetup(page);
  const button = page.locator(`[data-flow-step="${step}"]`);
  // A click that lands while the page still scrolls smoothly can miss the
  // button, so click until the step is the current one.
  await expect(async () => {
    if ((await button.getAttribute("aria-current")) !== "step") await button.click({ timeout: 5000 });
    await expect(button).toHaveAttribute("aria-current", "step", { timeout: 1000 });
  }).toPass({ timeout: 20000 });
}

// After an import the setup collapses behind its disclosure; a test that
// needs a setup control again opens it first.
export async function openSetup(page) {
  const toggle = page.locator("#workflowDisclosure");
  // The button leaves the page as the setup opens, so click only while it shows,
  // and wait for the panel either way.
  if (await toggle.isVisible()) await toggle.click({ timeout: 3000 }).catch(() => {});
  await expect(page.locator("#workflowPanel")).toBeVisible();
}
