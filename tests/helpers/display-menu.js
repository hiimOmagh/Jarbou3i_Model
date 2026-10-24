import { expect } from "@playwright/test";

// Density and theme sit in the header's menu (src/ui/shell.css): a test
// opens it when the control it is about to use is in there.
export async function displayControl(page, id) {
  const control = page.locator(`#${id}`);
  if (!(await control.isVisible())) await page.locator("#displayMenuBtn").click();
  await expect(control).toBeVisible();
  return control;
}
