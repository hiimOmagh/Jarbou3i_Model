import { test, expect } from "@playwright/test";

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
  await page.goto("/");

  for (const locale of LOCALES) {
    await page.locator(locale.button).click();
    await expect(page.locator("html")).toHaveAttribute("lang", locale.id);
    await expect(page.locator("#analysisLang")).toHaveValue(locale.id);

    for (const lens of LENSES) {
      const lensButton = page.locator(`[data-lens="${lens}"]`);
      await lensButton.click();
      await expect(lensButton).toHaveAttribute("aria-checked", "true");
      await page.locator("#loadSampleBtn").click();

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

test("an explicit analysis-language override persists and can be relinked", async ({
  page,
}) => {
  await page.goto("/");

  await page.locator("#langFr").click();
  await expect(page.locator("#analysisLang")).toHaveValue("fr");

  await page.locator("#analysisLang").selectOption("en");
  await page.locator("#langAr").click();
  await expect(page.locator("html")).toHaveAttribute("lang", "ar");
  await expect(page.locator("#analysisLang")).toHaveValue("en");

  await page.locator('[data-lens="biopolitical"]').click();
  await page.locator("#loadSampleBtn").click();
  expect((await readLoadedSample(page)).language).toBe("en");

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "ar");
  await expect(page.locator("#analysisLang")).toHaveValue("en");

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
