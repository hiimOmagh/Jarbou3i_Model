import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// A first visit: no settings kept and the route map never seen.
test.use({ storageState: { cookies: [], origins: [] } });

async function expectNoSeriousViolations(page, selector = "#firstRide") {
  // The line draws itself: end that first, so axe reads the colours that stay.
  await page.evaluate(() => {
    for (const animation of document.getAnimations()) {
      if (animation.effect?.getComputedTiming().iterations !== Infinity) animation.finish();
    }
  });
  const { violations } = await new AxeBuilder({ page }).include(selector).analyze();
  const serious = violations.filter((violation) => ["serious", "critical"].includes(violation.impact));
  expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
}

// The page's markup starts with the map hidden, so a check that it stays
// hidden waits for the app to have run first.
async function booted(page) {
  await page.waitForFunction(() => Boolean(window.Jarbou3iPlatformDiagnostics));
}

test("a first visit shows the trip as a route map, readable in each language and theme", async ({ page }) => {
  await page.goto("./");
  const ride = page.locator("#firstRide");
  await expect(ride).toBeVisible();
  await expect(page.locator("#firstRide [aria-current='step']")).toHaveCount(1);
  await expect(page.locator("#rideOpen")).toBeHidden();
  await expectNoSeriousViolations(page);
  for (const id of ["#langEn", "#langFr"]) {
    await page.locator(id).click();
    await expect(page.locator("#rideTitle")).not.toHaveText("");
    await expectNoSeriousViolations(page);
  }
  // The theme follows the system until one is chosen.
  await page.emulateMedia({ colorScheme: "dark" });
  await expectNoSeriousViolations(page);
});

test("on a phone the line runs down, and in Arabic it reads from the right", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("./");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  const stops = await page.locator("#firstRide .j-ride-stop").evaluateAll((items) =>
    items.map((item) => item.getBoundingClientRect()).map(({ right, top }) => ({ right: Math.round(right), top })),
  );
  for (let i = 1; i < stops.length; i++) {
    expect(stops[i].right).toBe(stops[0].right);
    expect(stops[i].top).toBeGreaterThan(stops[i - 1].top);
  }
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  expect(overflow).toBe(false);
});

test("starting leaves the map for good and puts you in the topic", async ({ page }) => {
  await page.goto("./");
  await page.locator("#langEn").click();
  await page.locator("#rideStart").click();
  await expect(page.locator("#firstRide")).toBeHidden();
  await expect(page.locator("#topicInput")).toBeFocused();
  await expect(page.locator("#rideOpen")).toBeVisible();
  await page.reload();
  await booted(page);
  await expect(page.locator("#firstRide")).toBeHidden();
});

test("skip leaves it at once with reduced motion, and how it works brings it back", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("./");
  await page.locator("#langEn").click();
  await page.locator("#rideSkip").focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#firstRide")).toBeHidden();
  await expect(page.locator("#topicInput")).toBeFocused();
  await page.locator("#rideOpen").click();
  await expect(page.locator("#firstRide")).toBeVisible();
  await expect(page.locator("#rideTitle")).toBeFocused();
});

test("trying the example opens its review and the map does not come back", async ({ page }) => {
  await page.goto("./");
  await page.locator("#rideExample").click();
  await expect(page.locator("#reviewPanel")).toBeVisible();
  await expect(page.locator("#firstRide")).toBeHidden();
  await page.reload();
  await booted(page);
  await expect(page.locator("#firstRide")).toBeHidden();
});

test("the example ride stops at four places, ringing each, and ends at the export", async ({ page }) => {
  await page.goto("./");
  await page.locator("#langEn").click();
  await page.locator("#rideExample").click();
  const card = page.locator("#rideTrip");
  await expect(card).toBeVisible();
  await expect(page.locator("#tripTitle")).toBeFocused();
  await expectNoSeriousViolations(page, "#rideTrip");
  const places = {
    verdict: "#case-overview .j-brief:first-of-type",
    map: "#engineNav",
    claim: "#case-evidence .j-recs:first-of-type > li:first-child > .j-rec",
    exports: "#case-exports",
  };
  const keys = Object.keys(places);
  for (const [index, key] of keys.entries()) {
    await expect(page.locator("html")).toHaveAttribute("data-ride-at", key);
    await expect(page.locator("#tripCount")).toHaveText(`${index + 1} of 4`);
    const place = page.locator(places[key]);
    await expect(place).toHaveCSS("outline-style", "solid");
    await expect(place).toBeInViewport();
    if (index < keys.length - 1) await page.locator("#tripNext").click();
  }
  await expect(page.locator("#tripNext")).toHaveText("End the ride");
  await page.locator("#tripNext").click();
  await expect(card).toBeHidden();
  await expect(page.locator("html")).not.toHaveAttribute("data-ride-at", /./);
  await expect(page.locator("#case-exports")).toBeFocused();
});

test("on a phone the ride's card fits the foot, follows the language, and Esc leaves it", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
  await page.goto("./");
  await page.locator("#rideExample").click();
  const card = page.locator("#rideTrip");
  await expect(card).toBeVisible();
  const box = await card.boundingBox();
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(390);
  expect(box.y + box.height).toBeLessThanOrEqual(844);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  expect(overflow).toBe(false);
  await expectNoSeriousViolations(page, "#rideTrip");
  await page.locator("#langFr").click();
  await expect(page.locator("#tripTitle")).toHaveText("Le verdict");
  await expect(page.locator("#tripCount")).toHaveText("1 sur 4");
  await page.locator("#tripNext").focus();
  await page.keyboard.press("Escape");
  await expect(card).toBeHidden();
  await expect(page.locator("#case-overview")).toBeFocused();
});

test("a visitor whose settings are already kept does not see it", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("jarbou3i-model-settings", JSON.stringify({ lang: "en" }));
  });
  await page.goto("./");
  await booted(page);
  await expect(page.locator("#firstRide")).toBeHidden();
  await expect(page.locator("#rideOpen")).toBeVisible();
});
