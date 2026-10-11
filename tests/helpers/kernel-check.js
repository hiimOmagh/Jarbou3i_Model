import { expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// The kernel controls under `root` keep their contracts, and axe finds nothing
// serious or critical inside `scope` in the dark or the light theme.
export async function expectKernel(page, root, scope = root) {
  const problems = await page.evaluate(async (selector) => {
    const { checkContracts } = await import("./src/ui/contracts.js");
    return checkContracts(document.querySelector(selector));
  }, root);
  expect(problems).toEqual([]);
  for (const theme of ["light", "dark"]) {
    await page.evaluate((value) => { document.documentElement.dataset.theme = value; }, theme);
    const { violations } = await new AxeBuilder({ page }).include(scope).analyze();
    const serious = violations.filter((violation) => ["serious", "critical"].includes(violation.impact));
    expect(serious, `${scope} ${theme}: ${JSON.stringify(serious, null, 2)}`).toEqual([]);
  }
}
