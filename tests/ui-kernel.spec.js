import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { displayControl } from "./helpers/display-menu.js";

// UIX-1 design-system kernel: src/ui/kernel.css, src/ui/contracts.js and
// src/ui/controls.js, shown by the component harness in tests/ui-harness/.
const harness = (query) => `./tests/ui-harness/index.html?${query}`;

async function open(page, query) {
  await page.goto(harness(query));
  await expect(page.locator("html")).toHaveAttribute("data-ready", "true");
}

test.describe("Design-system kernel", () => {
  for (const lang of ["en", "ar", "fr"]) {
    for (const theme of ["dark", "light"]) {
      test(`${lang} ${theme}: contracts, contrast and reflow hold`, async ({ page }, testInfo) => {
        await open(page, `lang=${lang}&theme=${theme}`);
        await expect(page.locator("html")).toHaveAttribute("dir", lang === "ar" ? "rtl" : "ltr");
        expect(await page.evaluate(() => window.kernelHarness.problems())).toEqual([]);
        const { violations } = await new AxeBuilder({ page }).analyze();
        const serious = violations.filter((violation) => ["serious", "critical"].includes(violation.impact));
        expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
        await page.setViewportSize({ width: 375, height: 812 });
        expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
        // Visual evidence for review, not a pixel baseline.
        await testInfo.attach(`kernel-${lang}-${theme}-375`, { body: await page.screenshot({ fullPage: true }), contentType: "image/png" });
      });
    }
  }

  test("compact density tightens cards and keeps 44px controls", async ({ page }) => {
    await open(page, "lang=en&theme=dark&density=compact");
    const card = await page.locator(".j-card").first().evaluate((el) => getComputedStyle(el).paddingTop);
    expect(card).toBe("16px");
    const button = await page.locator(".j-btn").first().evaluate((el) => el.getBoundingClientRect().height);
    expect(button).toBeGreaterThanOrEqual(44);
    // A segmented option is hit over its track's padding too.
    const option = await page.locator(".j-seg > button").first().evaluate((el) => {
      const { left, width, top, bottom } = el.getBoundingClientRect();
      const x = left + width / 2;
      let first = top;
      let last = bottom;
      while (el.contains(document.elementFromPoint(x, first - 1))) first -= 1;
      while (el.contains(document.elementFromPoint(x, last))) last += 1;
      return last - first;
    });
    expect(option).toBeGreaterThanOrEqual(44);
  });

  test("good news is plain text; only a failure note takes a box", async ({ page }) => {
    await open(page, "lang=en&theme=dark");
    const box = (tone) => page.locator(`.j-note[data-tone="${tone}"]`).first().evaluate((el) => {
      const style = getComputedStyle(el);
      return [style.borderTopWidth, style.paddingTop, style.backgroundColor === "rgba(0, 0, 0, 0)"];
    });
    expect(await box("ok")).toEqual(["0px", "0px", true]);
    expect(await box("crit")).toEqual(["1px", "8px", false]);
  });

  test("a segmented control moves with the arrows, mirrored in Arabic", async ({ page }) => {
    await open(page, "lang=en&theme=dark");
    await page.locator('[data-param="language"] [aria-checked="true"]').focus();
    await page.keyboard.press("ArrowRight");
    await expect(page.locator("html")).toHaveAttribute("lang", "fr");

    await open(page, "lang=ar&theme=dark");
    await page.locator('[data-param="language"] [aria-checked="true"]').focus();
    // ar, en, fr laid out right to left: the next option is on the left.
    await page.keyboard.press("ArrowLeft");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });

  test("keyboard focus is visible", async ({ page }) => {
    await open(page, "lang=en&theme=light");
    await page.keyboard.press("Tab");
    const outline = await page.evaluate(() => {
      const style = getComputedStyle(document.activeElement);
      return { tag: document.activeElement.tagName, style: style.outlineStyle, width: style.outlineWidth };
    });
    expect(outline).toEqual({ tag: "BUTTON", style: "solid", width: "3px" });
  });

  test("reduced motion stops transitions", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await open(page, "lang=en&theme=dark");
    const duration = await page.locator(".j-btn").first().evaluate((el) => getComputedStyle(el).transitionDuration);
    expect(duration.split(",").every((value) => parseFloat(value) <= 0.001)).toBe(true);
  });

  test("forced colours keep the primary action outlined", async ({ page, browserName }) => {
    test.skip(browserName !== "chromium", "forced-colors emulation is Chromium-only");
    await page.emulateMedia({ forcedColors: "active" });
    await open(page, "lang=en&theme=dark");
    const width = await page.locator('.j-btn[data-variant="primary"]').first().evaluate((el) => getComputedStyle(el).borderTopWidth);
    expect(width).toBe("2px");
  });

  test("the contract registry names every break", async ({ page }) => {
    await open(page, "lang=en&theme=dark");
    const problems = await page.evaluate(() => {
      const broken = document.createElement("div");
      broken.innerHTML = `
        <button class="j-btn" data-variant="loud">Go</button>
        <button type="button" class="j-btn" data-size="icon"><svg class="j-icon"></svg></button>
        <span class="j-status">Saved</span>
        <span class="j-status" data-tone="ok"></span>
        <div class="j-seg" role="radiogroup" aria-label="Pick">
          <button type="button" role="radio" aria-checked="true">A</button>
          <button type="button" role="radio" aria-checked="true">B</button>
        </div>
        <div class="j-field"><label>Name</label><input class="j-input"></div>
        <div class="j-toast" data-tone="bad">Done</div>
        <a class="j-skip" href="#nowhere">Skip</a>
        <button class="j-status j-save-light" data-tone="ok" data-state="lost">Saved</button>
        <span class="j-banner">New</span>
        <ul style="list-style: none"><li>Unmarked</li></ul>
        <ul style="list-style: none" role="list"><li>Said</li></ul>
        <nav aria-label="Steps"><ol style="list-style: none"><li>In navigation</li></ol></nav>`;
      document.body.append(broken);
      return window.kernelHarness.problems().map((entry) => `${entry.contract}: ${entry.problem}`);
    });
    expect(problems).toEqual([
      "j-btn: a <button> needs a type",
      'j-btn: data-variant="loud" is not one of primary, ghost, danger',
      "j-btn: needs an accessible name",
      "j-btn: an icon-only button needs aria-label",
      "j-status: needs data-tone (ok, warn, crit, idle)",
      "j-status: needs text: colour and shape alone do not say the state",
      'j-seg: exactly one option must be aria-checked="true"',
      "j-field: needs a <label for> naming a .j-input inside the field",
      'j-toast: needs role="status" so it is announced without taking focus',
      'j-toast: data-tone="bad" is not one of crit, warn',
      "j-skip: must be a link to an element on this page",
      'j-save-light: must be a <button type="button">',
      'j-save-light: needs aria-haspopup="dialog" and aria-controls naming the work panel it opens',
      'j-save-light: data-state="lost" is not one of empty, saving, saved, error',
      "j-banner: is not a kernel class",
      'list: a list without markers needs role="list"',
    ]);
  });

  test("the app's colours follow the kernel in both themes", async ({ page }) => {
    await page.goto("./");
    await page.locator("#langEn").click();
    const read = () =>
      page.evaluate(() => {
        const root = getComputedStyle(document.documentElement);
        const body = getComputedStyle(document.body);
        return {
          theme: document.documentElement.dataset.theme,
          dark: document.body.classList.contains("dark"),
          same: ["bg", "text", "muted", "accent", "line"].every((name, index) =>
            body.getPropertyValue("--" + name).trim() ===
              root.getPropertyValue(["--j-bg", "--j-fg", "--j-fg-muted", "--j-signal", "--j-line"][index]).trim()),
          bg: root.getPropertyValue("--j-bg").trim(),
        };
      });
    const first = await read();
    expect(first.same).toBe(true);
    expect(first.theme).toBe(first.dark ? "dark" : "light");
    await (await displayControl(page, "themeBtn")).click();
    const second = await read();
    expect(second.same).toBe(true);
    expect(second.theme).toBe(second.dark ? "dark" : "light");
    expect(second.dark).toBe(!first.dark);
    expect(second.bg).not.toBe(first.bg);
  });
});
