import { test, expect } from "@playwright/test";

test("blocked setup Continue looks unavailable and does not react to hover", async ({ page }) => {
  await page.goto("./");
  await page.locator("#langEn").click();
  const next = page.locator("#flowNext");
  await expect(next).toHaveAttribute("aria-disabled", "true");
  await expect(next).toHaveCSS("cursor", "not-allowed");
  const appearance = () => next.evaluate(el => {
    const s = getComputedStyle(el);
    return { opacity: Number(s.opacity), background: s.backgroundColor, border: s.borderColor, color: s.color, transform: s.transform };
  });
  let last = "";
  await expect.poll(async () => {
    const now = JSON.stringify(await appearance());
    const settled = now === last;
    last = now;
    return settled;
  }).toBe(true);
  const before = await appearance();
  expect(before.opacity).toBeLessThan(1);
  await next.hover({ force: true });
  await expect.poll(appearance).toEqual(before);
});
