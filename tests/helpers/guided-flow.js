// The setup phase shows one step at a time (src/features/guided-flow.js):
// a test opens the step that holds the control it is about to use.
export async function openStep(page, step) {
  const button = page.locator(`[data-flow-step="${step}"]`);
  if ((await button.getAttribute("aria-current")) !== "step") await button.click();
}
