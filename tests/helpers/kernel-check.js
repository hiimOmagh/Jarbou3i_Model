import { expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// How tall a control is to a pointer through its centre, its extended hit area included.
export function hitHeight(locator) {
  return locator.evaluate((el) => {
    const { left, width, top, bottom } = el.getBoundingClientRect();
    const x = left + width / 2;
    let first = Math.round(top);
    let last = Math.round(bottom);
    while (el.contains(document.elementFromPoint(x, first - 1))) first -= 1;
    while (el.contains(document.elementFromPoint(x, last))) last += 1;
    return last - first;
  });
}

// The kernel controls under `root` keep their contracts, and axe finds nothing
// serious or critical inside `scope` in the dark or the light theme.
export async function expectKernel(page, root, scope = root) {
  const problems = await page.evaluate(async (selector) => {
    const { checkContracts } = await import("./src/ui/contracts.js");
    return checkContracts(document.querySelector(selector));
  }, root);
  expect(problems).toEqual([]);
  for (const theme of ["light", "dark"]) {
    await page.evaluate((value) => {
      document.documentElement.dataset.theme = value;
      // Colours change through transitions: end them now, so axe never reads a
      // control with one theme's text on the other's background. Waiting would
      // hang where a headless page's animation clock does not advance.
      for (const animation of document.getAnimations()) {
        if (animation instanceof CSSTransition) animation.finish();
      }
    }, theme);
    const { violations } = await new AxeBuilder({ page }).include(scope).analyze();
    const serious = violations.filter((violation) => ["serious", "critical"].includes(violation.impact));
    expect(serious, `${scope} ${theme}: ${JSON.stringify(serious, null, 2)}`).toEqual([]);
  }
}
