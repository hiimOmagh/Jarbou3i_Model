import { test, expect } from "@playwright/test";
import { openStep } from "./helpers/guided-flow.js";

const LOCALES = [
  {
    id: "ar",
    button: "#langAr",
    titles: {
      strategic: "مثال: الحرب العالمية الثانية وما بعدها",
      biopolitical: "الجوازات الصحية الرقمية والحركة المشروطة",
    },
  },
  {
    id: "en",
    button: "#langEn",
    titles: {
      strategic: "Sample: World War II outcomes",
      biopolitical: "Digital health passes and conditional mobility",
    },
  },
  {
    id: "fr",
    button: "#langFr",
    titles: {
      strategic: "Exemple : résultats de la Seconde Guerre mondiale",
      biopolitical: "Pass sanitaires numériques et mobilité conditionnelle",
    },
  },
];

const LENSES = ["strategic", "biopolitical"];

async function readLoadedSample(page) {
  return JSON.parse(await page.locator("#jsonInput").inputValue());
}

test("sample topics follow the chosen interface language for both lenses", async ({
  page,
}) => {
  await page.goto("./");

  for (const locale of LOCALES) {
    await page.locator(locale.button).click();
    await expect(page.locator("html")).toHaveAttribute("lang", locale.id);
    await expect(page.locator("#analysisLang")).toHaveValue(locale.id);

    for (const lens of LENSES) {
      await openStep(page, "lens");
      const lensButton = page.locator(`[data-lens="${lens}"]`);
      await lensButton.focus();
      await expect(lensButton).toBeFocused();
      await lensButton.press("Enter");
      await expect(lensButton).toHaveAttribute("aria-checked", "true");
      const loadSample = page.locator("#loadSampleBtn");
      await loadSample.focus();
      await expect(loadSample).toBeFocused();
      await loadSample.press("Enter");
      await expect(page.locator("#reviewPanel")).toBeVisible();

      const sample = await readLoadedSample(page);
      expect(sample.language).toBe(locale.id);
      expect(sample.analysis_lens).toBe(lens);
      expect(sample.subject.title).toBe(locale.titles[lens]);
      await expect(page.locator("#topicInput")).toHaveValue(
        locale.titles[lens],
      );
    }
  }
});

// What a sample says is translated; its records, figures and categories are
// not, so every language reaches the same verdict.
const KINDS = new Set([
  "id", "type", "horizon", "stakes", "confidence", "category", "frame", "power_balance_impact", "adapts",
  "speed", "contradiction_type", "basis", "source_type", "risk", "relation", "from", "to", "affected_layers",
]);
const shape = (value, key = "") =>
  Array.isArray(value) ? value.map((item) => shape(item, key))
    : value && typeof value === "object" ? Object.fromEntries(Object.entries(value).map(([k, v]) => [k, shape(v, k)]))
      : typeof value === "string" && !KINDS.has(key) ? "text" : value;

test("the Strategic sample is the same analysis in every language", async ({ page }) => {
  test.skip(test.info().project.name !== "chromium", "The sample's content is the same in every engine.");
  await page.goto("./");
  const seen = {};
  for (const locale of LOCALES) {
    await page.locator(locale.button).click();
    await page.locator("#loadSampleBtn").click();
    await expect(page.locator("#reviewPanel")).toBeVisible();
    const { language, analysis_id, ...sample } = await readLoadedSample(page);
    expect(language).toBe(locale.id);
    seen[locale.id] = {
      shape: shape(sample),
      gate: await page.locator('[data-orientation="gate"]').getAttribute("data-tone"),
    };
  }
  expect(seen.ar).toEqual(seen.en);
  expect(seen.fr).toEqual(seen.en);
});

test("an explicit analysis-language override persists and can be relinked", async ({
  page,
}) => {
  await page.goto("./");

  await page.locator("#langFr").click();
  await expect(page.locator("#analysisLang")).toHaveValue("fr");

  await openStep(page, "settings");
  await page.locator("#analysisLang").selectOption("en");
  await page.locator("#langAr").click();
  await expect(page.locator("html")).toHaveAttribute("lang", "ar");
  await expect(page.locator("#analysisLang")).toHaveValue("en");

  await openStep(page, "lens");
  await page.locator('[data-lens="biopolitical"]').click();
  await page.locator("#loadSampleBtn").click();
  expect((await readLoadedSample(page)).language).toBe("en");
  // The sample is saved, and reopened after the reload, in the background. Wait
  // for both, so its language cannot land after the choices below.
  await expect(page.locator("#workspaceSaveState")).toHaveAttribute("data-state", "saved");

  await page.reload();
  await expect(page.locator("#reviewPanel")).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("lang", "ar");
  await expect(page.locator("#analysisLang")).toHaveValue("en");

  await openStep(page, "settings");
  await page.locator("#analysisLang").selectOption("ar");
  await page.locator("#langFr").click();
  await expect(page.locator("#analysisLang")).toHaveValue("fr");

  const settings = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("jarbou3i-model-settings") || "{}"),
  );
  expect(settings).toMatchObject({
    lang: "fr",
    analysisLang: "fr",
    analysisLangFollowsUi: true,
  });
});
