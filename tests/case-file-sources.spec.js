import { test, expect } from "@playwright/test";
import fs from "node:fs/promises";
import { openStep } from "./helpers/guided-flow.js";
import { readFirstWorkspace } from "./helpers/browser-persistence.js";
import { expectKernel } from "./helpers/kernel-check.js";

// RESEARCH-1C S8 (docs/features/research-promotion.md): the case's sources
// beside the evidence of an analysis the case holds, on screen only.

// Use the dossier's bounded backend/repository, never a raw storage request.
const readCases = (page) => page.evaluate(async () => {
  const { createDossierRepository, createIndexedDbDossierBackend } = await import("./src/core/research-dossier.js");
  const repository = createDossierRepository({ backend: createIndexedDbDossierBackend() });
  try { return await repository.list(); } finally { repository.close(); }
});
const fixture = async (name) => fs.readFile(new URL(`../fixtures/sample-analysis-${name}.json`, import.meta.url), "utf8");
const STRATEGIC_TITLE = "Historical power distribution reference";
const sourceRows = (page) => page.locator("#sourcesBody > ol > [data-source-row]");
const addForm = (page) => page.locator('[data-source-form="add"]');
const fold = (page) => page.locator("#case-evidence [data-case-sources]");
const foldRows = (page) => fold(page).locator(":scope > ol > [data-case-source-row]");
const record = (page, id) => page.locator(`#case-evidence [data-inspection-id="${id}"]`);
const line = (page, id) => record(page, id).locator(":scope > [data-case-source-line]");

async function start(page, lang = "en") {
  await page.goto("./");
  await page.locator(`#lang${lang[0].toUpperCase()}${lang.slice(1)}`).click();
  await page.locator("#sourcesFold > summary").click();
}
async function openSources(page) {
  await openStep(page, "topic");
  if (!(await page.locator("#sourcesFold").evaluate((element) => element.open))) await page.locator("#sourcesFold > summary").click();
}
async function addSource(page, title, url = "", date = "") {
  const form = addForm(page);
  await form.locator('[data-source-field="title"]').fill(title);
  if (url) await form.locator('[data-source-field="url"]').fill(url);
  if (date) await form.locator('[data-source-field="source_date"]').fill(date);
  const before = await sourceRows(page).count();
  await form.locator('[data-source-action="add-source"]').click();
  await expect(sourceRows(page)).toHaveCount(before + 1);
  return sourceRows(page).last();
}
async function addExcerpt(row, text, locator = "") {
  await row.locator(':scope > .j-flow-row > [data-source-action="new-excerpt"]').click();
  const form = row.locator("[data-excerpt-form]");
  await form.locator('[data-source-field="text"]').fill(text);
  if (locator) await form.locator('[data-source-field="locator"]').fill(locator);
  const excerpts = row.locator("[data-excerpt-row]");
  const before = await excerpts.count();
  await form.locator('[data-source-action="save-excerpt"]').click();
  await expect(excerpts).toHaveCount(before + 1);
  return excerpts.last();
}
async function decide(excerpt, status, reason) {
  await excerpt.locator(`[data-source-action="${status}"]`).click();
  await excerpt.locator('[data-source-field="reason"]').fill(reason);
  await excerpt.locator('[data-source-action="check-excerpt"]').click();
  await expect(excerpt.locator('[data-source-action="reopen"]')).toBeVisible();
}
async function importAnswer(page, name = "en", text = "") {
  if (name.startsWith("bio")) {
    await openStep(page, "lens");
    await page.locator('[data-lens="biopolitical"]').click();
  }
  await openStep(page, "answer");
  // The same JSON on one line: WebKit fills a textarea line by line, and the
  // pretty-printed Biopolitical sample (about 1,000 lines) took 20 to 34 s of the
  // test's 60 there, against under a second on one line.
  await page.locator("#jsonInput").fill(JSON.stringify(JSON.parse(text || await fixture(name))));
  await page.locator("#importBtn").click();
  await expect(page.locator("#reviewPanel")).toBeVisible();
  await expect.poll(() => readFirstWorkspace(page)).toBeTruthy();
}
// A case with two sources, one related to E1 by its title with a checked
// excerpt, one unrelated with a link and an unchecked excerpt; then the answer,
// linked to the case.
async function linkedCase(page, { lang = "en", answer = "en", title = STRATEGIC_TITLE } = {}) {
  await start(page, lang);
  const related = await addSource(page, title);
  await decide(await addExcerpt(related, "The 2019 survey lists the same distribution.", "p. 12"), "matches", "Compared with the printed table.");
  const other = await addSource(page, "Unrelated pamphlet", "https://example.org/pamphlet");
  await addExcerpt(other, "Nothing about this analysis.");
  await importAnswer(page, answer);
  await expect.poll(async () => (await readCases(page))[0]?.analyses.length).toBe(1);
}
async function downloadText(page, button) {
  const [download] = await Promise.all([page.waitForEvent("download"), button.click()]);
  const path = await download.path();
  expect(path).toBeTruthy();
  return fs.readFile(path, "utf8");
}
// The case file as drawn without this slice: its record lines and fold taken out.
const caseFileWithoutSources = (page) => page.locator("#reviewContent").evaluate((root) => {
  const copy = root.cloneNode(true);
  for (const node of copy.querySelectorAll("[data-case-source-line], [data-case-sources]")) node.remove();
  return copy.innerHTML;
});
const caseFileHtml = (page) => page.locator("#reviewContent").evaluate((root) => root.innerHTML);
async function removeCase(page) {
  const [dossier] = await readCases(page);
  await page.locator("#workspaceSaveState").click();
  const remove = page.locator(`[data-case-remove="${dossier.dossier_id}"]`);
  await remove.click();
  await remove.click();
  await expect.poll(async () => (await readCases(page)).length).toBe(0);
  await page.locator("#workspaceClose").click();
  await expect(page.locator("#reviewContent [data-case-source-line], #reviewContent [data-case-sources]")).toHaveCount(0);
}
// The case file as it would print: folds opened by beforeprint, then closed.
const printedHtml = (page) => page.evaluate(() => {
  window.dispatchEvent(new Event("beforeprint"));
  const html = document.getElementById("reviewContent").innerHTML;
  window.dispatchEvent(new Event("afterprint"));
  return html;
});

test.describe("Your sources in the case file", () => {
  test("Strategic: the related record says its source under its title and the fold lists every source", async ({ page }) => {
    await linkedCase(page);
    await expect(line(page, "E1")).toHaveText(`From your source: ${STRATEGIC_TITLE} · matched by title`);
    expect(await line(page, "E1").evaluate((node) => node.previousElementSibling.matches(".j-rec-title"))).toBe(true);
    await expect(record(page, "E1").locator(".j-rec-facts [data-case-source-line]")).toHaveCount(0);
    await expect(page.locator("#case-evidence [data-case-source-line]")).toHaveCount(1);
    // After the evidence records, before Assumptions, folded.
    await expect(fold(page)).not.toHaveAttribute("open");
    expect(await fold(page).evaluate((node) => [node.previousElementSibling.dataset.records, node.nextElementSibling.tagName, node.nextElementSibling.textContent])).toEqual(["evidence", "H3", "Assumption"]);
    await expect(fold(page).locator(":scope > summary")).toHaveText("Your source notes");
    await fold(page).locator(":scope > summary").click();
    await expect(foldRows(page)).toHaveCount(2);
    const [related, other] = [foldRows(page).nth(0), foldRows(page).nth(1)];
    await expect(related.getByRole("heading")).toHaveText(STRATEGIC_TITLE);
    await expect(related).toContainText("In this analysis: E1");
    await expect(related).toContainText("Locator: p. 12");
    await expect(related.locator(".j-done-state strong")).toHaveText("Matches the source");
    await expect(related).toContainText("· your claim,");
    await expect(related.locator(".j-done-reason")).toHaveText("Compared with the printed table.");
    await expect(other.getByRole("link", { name: "Unrelated pamphlet" })).toHaveAttribute("href", "https://example.org/pamphlet");
    await expect(other.getByRole("link")).toHaveAttribute("rel", "noopener noreferrer");
    await expect(other).toContainText("No evidence here has this link or title");
    await expect(other).toContainText("Not checked yet");
    // The fold's buttons: the evidence ids, and its one control, Make it
    // evidence on the matching excerpt (S11a); none on the unchecked one.
    await expect(fold(page).locator("button")).toHaveText(["E1", "Make it evidence"]);
    await expect(fold(page).locator("ol")).toHaveCount(3);
    for (const list of await fold(page).locator("ol").all()) await expect(list).toHaveAttribute("role", "list");
  });

  test("a title two linked sources share: said once, on the source no evidence relates to, never beside an \"In this analysis\"", async ({ page }) => {
    // E1 has the first source's link; E2 has no link and the title both sources share.
    const sample = JSON.parse(await fixture("en"));
    const [first] = sample.evidence.items;
    sample.evidence.items = [{ ...first, source_url: "https://a.example/one" }, { ...first, id: "E2", source_url: "" }];
    await start(page);
    await addSource(page, STRATEGIC_TITLE, "https://a.example/one");
    await addSource(page, STRATEGIC_TITLE, "https://b.example/two");
    await importAnswer(page, "en", JSON.stringify(sample));
    await expect.poll(async () => (await readCases(page))[0]?.analyses.length).toBe(1);
    await expect(line(page, "E1")).toHaveText(`From your source: ${STRATEGIC_TITLE}`);
    await expect(line(page, "E2")).toHaveCount(0);
    await fold(page).locator(":scope > summary").click();
    await expect(foldRows(page)).toHaveCount(2);
    const shared = "Several of your sources have this title; none is related.";
    await expect(foldRows(page).nth(0).locator(":scope > .j-done-state")).toHaveText(["In this analysis: E1"]);
    await expect(foldRows(page).nth(1).locator(":scope > .j-done-state")).toHaveText([shared]);
    await expect(fold(page).getByText(shared)).toHaveCount(1);
  });

  test("keyboard: the record line opens the fold on its source, and an id opens its record", async ({ page }) => {
    await linkedCase(page);
    const button = line(page, "E1").getByRole("button");
    await button.focus();
    await page.keyboard.press("Enter");
    await expect(fold(page)).toHaveAttribute("open", "");
    await expect(foldRows(page).first()).toBeFocused();
    await page.keyboard.press("Tab");
    const id = foldRows(page).first().getByRole("button", { name: "E1", exact: true });
    await expect(id).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(record(page, "E1")).toBeFocused();
    await expect(record(page, "E1")).toBeInViewport();
    // Space works as Enter does on the line.
    await page.locator("#case-evidence [data-case-sources] > summary").click();
    await expect(fold(page)).not.toHaveAttribute("open");
    await button.focus();
    await page.keyboard.press("Space");
    await expect(foldRows(page).first()).toBeFocused();
    await expect(fold(page)).toHaveAttribute("open", "");
  });

  test("Biopolitical: one line under the title, never among the card's facts, and the fold after the evidence records", async ({ page }) => {
    const sample = JSON.parse(await fixture("bio-en"));
    const evidence = sample.evidence.items[0];
    await linkedCase(page, { answer: "bio-en", title: evidence.source_title });
    await expect(line(page, evidence.id)).toHaveText(`From your source: ${evidence.source_title} · matched by title`);
    expect(await line(page, evidence.id).evaluate((node) => node.previousElementSibling.matches(".j-rec-title"))).toBe(true);
    await expect(record(page, evidence.id).locator(":is(.j-rec-facts, .j-rec-more) [data-case-source-line]")).toHaveCount(0);
    expect(await fold(page).evaluate((node) => node === node.parentElement.lastElementChild && node.previousElementSibling.dataset.records)).toBe("bio");
    await expect(foldRows(page).first()).toContainText(`In this analysis: ${evidence.id}`);
    await expect(foldRows(page).nth(1)).toContainText("No evidence here has this link or title");
    // The same line in the evidence section only, and once.
    await expect(page.locator("#reviewContent [data-case-source-line]")).toHaveCount(sample.evidence.items.filter((item) => item.source_title === evidence.source_title).length);
    await line(page, evidence.id).getByRole("button").click();
    await expect(foldRows(page).first()).toBeFocused();
    await foldRows(page).first().getByRole("button", { name: evidence.id, exact: true }).click();
    await expect(record(page, evidence.id)).toBeFocused();
    await expectKernel(page, "#case-evidence");
  });

  for (const answer of ["en", "bio-en"]) {
    test(`${answer}: no case, or a case that does not hold the analysis, leaves the case file byte-identical on screen and in print`, async ({ page }) => {
      await page.goto("./");
      await page.locator("#langEn").click();
      await importAnswer(page, answer);
      expect(await readCases(page)).toHaveLength(0);
      const screen = await caseFileHtml(page);
      const printed = await printedHtml(page);
      const evidence = JSON.parse(await fixture(answer)).evidence.items[0];
      // A case made after the import holds no analysis, even with a related title.
      await openSources(page);
      const row = await addSource(page, evidence.source_title);
      await decide(await addExcerpt(row, "Unlinked case excerpt."), "matches", "Read it.");
      await expect.poll(async () => (await readCases(page))[0]?.sources?.length).toBe(1);
      expect((await readCases(page))[0].analyses).toEqual([]);
      expect(await caseFileHtml(page)).toBe(screen);
      expect(await printedHtml(page)).toBe(printed);
      await page.locator("#langFr").click();
      await page.locator("#langEn").click();
      expect(await caseFileHtml(page)).toBe(screen);
    });
  }

  for (const answer of ["en", "bio-en"]) {
    test(`${answer}: the report, bundle, canonical JSON, ledger and evidence-intelligence exports are byte-identical with and without the linked case`, async ({ page }) => {
      const evidence = JSON.parse(await fixture(answer)).evidence.items[0];
      await linkedCase(page, { answer, title: evidence.source_title });
      await expect(line(page, evidence.id)).toBeVisible();
      const exportsNow = async () => {
        const files = {};
        await page.locator('[data-review="exports"], [data-bio-review="exports"]').click();
        files.exportJson = await downloadText(page, page.locator("#exportJson"));
        // The report and the bundle say when they were made; nothing else may differ.
        files.exportHtml = (await downloadText(page, page.locator("#exportHtml"))).replace(/<p class="reportDate"><time datetime="[^"]+">/, '<p class="reportDate"><time datetime="">');
        await page.locator("#workspaceSaveState").click();
        files.workspaceExport = (await downloadText(page, page.locator("#workspaceExport"))).replace(/"exported_at": "[^"]+"/, '"exported_at": ""');
        await page.locator("#workspaceClose").click();
        await page.locator('[data-review="inspection"], [data-bio-review="inspection"]').click();
        if (!(await page.locator("[data-evidence-intelligence]").evaluate((node) => node.open))) await page.locator("[data-evidence-intelligence] > summary").click();
        for (const id of ["exportIntelligence", "exportReviewPlan"]) files[id] = await downloadText(page, page.locator(`#${id}`));
        await page.locator("#openReviewLedger").click();
        files.ledgerExport = await downloadText(page, page.locator("#ledgerExport"));
        await page.locator("#ledgerClose").click();
        return files;
      };
      const withCase = await exportsNow();
      const shown = await caseFileWithoutSources(page);
      for (const text of Object.values(withCase)) {
        expect(text).not.toContain("Unrelated pamphlet");
        expect(text).not.toContain("Compared with the printed table.");
      }
      // Remove the case: the line and the fold go, in place.
      const [dossier] = await readCases(page);
      await page.locator("#workspaceSaveState").click();
      const remove = page.locator(`[data-case-remove="${dossier.dossier_id}"]`);
      await remove.click();
      await remove.click();
      await expect.poll(async () => (await readCases(page)).length).toBe(0);
      await page.locator("#workspaceClose").click();
      await expect(page.locator("#reviewContent [data-case-source-line], #reviewContent [data-case-sources]")).toHaveCount(0);
      expect(await caseFileHtml(page)).toBe(shown);
      const withoutCase = await exportsNow();
      expect(Object.keys(withoutCase)).toEqual(Object.keys(withCase));
      for (const [name, text] of Object.entries(withCase)) expect(withoutCase[name], name).toBe(text);
    });
  }

  test("a saved change in the topic step redraws the line and the fold in place, keeping the fold open and focus where it is", async ({ page }) => {
    await linkedCase(page);
    await fold(page).locator(":scope > summary").click();
    await expect(fold(page)).toHaveAttribute("open", "");
    await page.evaluate(() => {
      document.getElementById("case-evidence").dataset.kept = "yes";
      document.querySelector('#case-evidence [data-inspection-id="E1"]').dataset.kept = "yes";
    });
    await openSources(page);
    // A third source: the fold gains its row; focus stays where 1B puts it.
    const third = await addSource(page, "Field notes");
    await expect(third.locator(':scope > .j-flow-row > [data-source-action="new-excerpt"]')).toBeFocused();
    await expect(foldRows(page)).toHaveCount(3);
    await expect(fold(page)).toHaveAttribute("open", "");
    // The related source renamed: E1 has no line, its row says so.
    const related = sourceRows(page).first();
    await related.locator(':scope > .j-flow-row > [data-source-action="edit-source"]').click();
    await related.locator('[data-source-form="edit"] [data-source-field="title"]').fill("Another reference");
    await related.locator('[data-source-form="edit"] [data-source-action="save-source"]').click();
    await expect(related.locator(':scope > .j-flow-row > [data-source-action="edit-source"]')).toBeFocused();
    await expect(page.locator("#case-evidence [data-case-source-line]")).toHaveCount(0);
    await expect(foldRows(page).first()).toContainText("No evidence here has this link or title");
    // Renamed back, and its excerpt reopened: the line returns, the check reads "Not checked yet".
    await related.locator(':scope > .j-flow-row > [data-source-action="edit-source"]').click();
    await related.locator('[data-source-form="edit"] [data-source-field="title"]').fill(STRATEGIC_TITLE);
    await related.locator('[data-source-form="edit"] [data-source-action="save-source"]').click();
    await expect(line(page, "E1")).toBeVisible();
    await related.locator('[data-excerpt-row] [data-source-action="reopen"]').click();
    await expect(foldRows(page).first()).toContainText("Not checked yet");
    await expect(fold(page)).toHaveAttribute("open", "");
    expect(await page.evaluate(() => [document.getElementById("case-evidence").dataset.kept, document.querySelector('#case-evidence [data-inspection-id="E1"]').dataset.kept])).toEqual(["yes", "yes"]);
  });

  for (const [lang, copy] of Object.entries({
    ar: { dir: "rtl", line: `من مصدرك: «${STRATEGIC_TITLE}» · مطابقة بالعنوان`, summary: "ملاحظاتك عن المصادر", related: "في هذا التحليل: E1", none: "لا دليل هنا بهذا الرابط أو العنوان", unchecked: "لم يُتحقَّق منه بعد", matches: "يطابق المصدر" },
    fr: { dir: "ltr", line: `De votre source : « ${STRATEGIC_TITLE} » · rapproché par le titre`, summary: "Vos notes de sources", related: "Dans cette analyse : E1", none: "Aucune preuve ici n’a ce lien ou ce titre", unchecked: "Pas encore vérifié", matches: "Conforme à la source" },
  })) {
    test(`${lang}: the line and the fold in its words, kept open across a language change`, async ({ page }) => {
      await linkedCase(page);
      await fold(page).locator(":scope > summary").click();
      await page.locator(`#lang${lang[0].toUpperCase()}${lang[1]}`).click();
      await expect(page.locator("html")).toHaveAttribute("dir", copy.dir);
      await expect(fold(page)).toHaveAttribute("open", "");
      await expect(line(page, "E1")).toHaveText(copy.line);
      await expect(line(page, "E1").locator("bdi")).toHaveAttribute("dir", "auto");
      await expect(fold(page).locator(":scope > summary")).toHaveText(copy.summary);
      await expect(foldRows(page).first()).toContainText(copy.related);
      await expect(foldRows(page).first().locator(".j-done-state strong")).toHaveText(copy.matches);
      await expect(foldRows(page).nth(1)).toContainText(copy.none);
      await expect(foldRows(page).nth(1)).toContainText(copy.unchecked);
      await expect(foldRows(page).first().locator(".j-done-text").last()).toHaveAttribute("dir", "auto");
      await expectKernel(page, "#case-evidence");
    });
  }

  test("320px: long titles, links, dates and locators reflow in the line and the fold; line breaks show as written", async ({ page }) => {
    const title = `${STRATEGIC_TITLE}${"x".repeat(300)}`;
    await start(page);
    await page.setViewportSize({ width: 320, height: 740 });
    await addSource(page, `${"Long".repeat(120)}`, `https://example.org/${"z".repeat(400)}`, "d".repeat(165));
    const second = await addSource(page, title);
    const excerpt = await addExcerpt(second, "First line of the excerpt.\nSecond line of the excerpt.", `https://example.org/${"q".repeat(300)}`);
    await decide(excerpt, "matches", "Checked page one.\nChecked page two.");
    await importAnswer(page);
    await expect.poll(async () => (await readCases(page))[0]?.analyses.length).toBe(1);
    // Neither title is E1's: both stay in the fold, unrelated.
    await fold(page).locator(":scope > summary").click();
    await expect(foldRows(page)).toHaveCount(2);
    await expect(line(page, "E1")).toHaveCount(0);
    const shown = foldRows(page).nth(1);
    expect(await shown.locator("p.j-done-text").evaluate((node) => node.innerText)).toBe("First line of the excerpt.\nSecond line of the excerpt.");
    expect(await shown.locator(".j-done-reason").evaluate((node) => node.innerText)).toBe("Checked page one.\nChecked page two.");
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
    await expect.poll(() => fold(page).evaluate((node) => node.scrollWidth - node.clientWidth)).toBeLessThanOrEqual(1);
  });

  test("320px: the record line reflows", async ({ page }) => {
    await linkedCase(page);
    await page.setViewportSize({ width: 320, height: 740 });
    await expect(line(page, "E1")).toBeVisible();
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
    await expect.poll(() => line(page, "E1").evaluate((node) => node.scrollWidth - node.clientWidth)).toBeLessThanOrEqual(1);
  });

  test("forced colours keep the line and the fold's links visible and focusable", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "chromium", "Forced colours are checked in Chromium.");
    await linkedCase(page);
    await page.emulateMedia({ forcedColors: "active" });
    expect(await page.evaluate(() => matchMedia("(forced-colors: active)").matches)).toBe(true);
    const button = line(page, "E1").getByRole("button");
    await expect(button).toBeVisible();
    await button.focus();
    await page.keyboard.press("Enter");
    await page.keyboard.press("Tab");
    const id = foldRows(page).first().getByRole("button", { name: "E1", exact: true });
    await expect(id).toBeFocused();
    expect(await id.evaluate((node) => getComputedStyle(node).outlineStyle)).not.toBe("none");
    expect(await fold(page).evaluate((node) => getComputedStyle(node).borderTopStyle)).not.toBe("none");
    await page.emulateMedia({ forcedColors: "none" });
    await expectKernel(page, "#case-evidence");
  });

  test("print: the line and the fold do not print, and opening folds for print skips the fold", async ({ page }) => {
    await linkedCase(page);
    await expect(line(page, "E1")).toBeVisible();
    await page.emulateMedia({ media: "print" });
    await expect(line(page, "E1")).toBeHidden();
    await expect(fold(page)).toBeHidden();
    await page.evaluate(() => window.dispatchEvent(new Event("beforeprint")));
    await expect(fold(page)).not.toHaveAttribute("open");
    await expect(page.locator("#reviewContent details:not([open]):not([data-case-sources])")).toHaveCount(0);
    await page.evaluate(() => window.dispatchEvent(new Event("afterprint")));
    await page.emulateMedia({ media: "screen" });
    await expect(line(page, "E1")).toBeVisible();
    await expect(fold(page)).not.toHaveAttribute("open");
    // An open fold is hidden from print too.
    await fold(page).locator(":scope > summary").click();
    await page.emulateMedia({ media: "print" });
    await expect(fold(page)).toBeHidden();
  });

  test("the heading after the fold keeps its space on screen and in print, as without the case", async ({ page }) => {
    await linkedCase(page);
    const assumption = page.locator("#case-evidence > h3").nth(1);
    await expect(assumption).toHaveText("Assumption");
    const spacing = async () => {
      const read = () => assumption.evaluate((node) => getComputedStyle(node).marginTop);
      await page.emulateMedia({ media: "print" });
      const printed = await read();
      await page.emulateMedia({ media: "screen" });
      return { screen: await read(), printed };
    };
    const withCase = await spacing();
    await removeCase(page);
    const withoutCase = await spacing();
    expect(withoutCase.screen).not.toBe("0px");
    expect(withCase).toEqual(withoutCase);
  });
});

// RESEARCH-1C S9 (research-promotion.md, acceptance 4): in the review ledger, a
// provenance task on evidence related to one of the case's sources names that
// source, and Complete may start from its last matching check. The review plan
// never reads the case; nothing reaches the ledger until the person appends.
async function openLedgerHere(page) {
  await page.locator('[data-review="inspection"], [data-bio-review="inspection"]').click();
  if (!(await page.locator("[data-evidence-intelligence]").evaluate((node) => node.open))) await page.locator("[data-evidence-intelligence] > summary").click();
  await page.locator("#openReviewLedger").click();
  await expect(page.locator("#ledgerDialog")).toBeVisible();
  // The dialog shows before its task list is drawn (seen in WebKit): every
  // sample has tasks, so wait for them before anything reads the list.
  await expect(page.locator("#ledgerTaskList [data-ledger-task]").first()).toBeVisible();
}
// Each task as the list shows it: id, reason, target and phase, in order.
const ledgerRows = (page) => page.locator("#ledgerTaskList [data-ledger-task]").evaluateAll((rows) => rows.map((row) => [row.dataset.ledgerTask, row.querySelector("strong").textContent, row.querySelector(".j-pick-meta").textContent]));
const ledgerTask = (page, id, phase = "Verify provenance") => page.locator("#ledgerTaskList [data-ledger-task]")
  .filter({ has: page.locator('.j-pick-meta span[dir="ltr"]', { hasText: new RegExp(`^${id}$`) }) })
  .filter({ hasText: phase })
  .first();
const ledgerEvents = async (page) => (await readFirstWorkspace(page)).review_ledger.events;
const ledgerSource = (page) => page.locator("#ledgerSelectedTask [data-ledger-source]");
// Each task pressed in turn, in one page call (one Playwright click per row
// took 16 to 23 s in WebKit): once the list is drawn again with that row pressed,
// its id, aria-pressed, target and how many source lines the selection shows.
const eachLedgerSelection = (page) => page.locator("#ledgerTaskList").evaluate(async (list) => {
  const pickFor = (id) => list.querySelector(`[data-ledger-task="${CSS.escape(id)}"]`);
  const seen = [];
  for (const id of [...list.querySelectorAll("[data-ledger-task]")].map((row) => row.dataset.ledgerTask)) {
    const clicked = pickFor(id);
    clicked.click();
    // A new drawing of the list (the clicked row replaced) with this row pressed.
    for (const started = performance.now(); !(pickFor(id) !== clicked && pickFor(id)?.getAttribute("aria-pressed") === "true");) {
      if (performance.now() - started > 10_000) throw new Error(`Task ${id} was never shown pressed.`);
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
    const pick = pickFor(id);
    seen.push([id, pick.getAttribute("aria-pressed"), pick.querySelector('.j-pick-meta span[dir="ltr"]').textContent, document.querySelectorAll("#ledgerSelectedTask [data-ledger-source]").length]);
  }
  return seen;
});
const rationale = (page) => page.locator("#ledgerRationale");
async function appendLedger(page, action, text = "") {
  const before = (await ledgerEvents(page)).length;
  await page.locator("#ledgerAction").selectOption(action);
  if (text) await rationale(page).fill(text);
  await page.locator("#ledgerApply").click();
  await expect.poll(async () => (await ledgerEvents(page)).length).toBe(before + 1);
  await expect(page.locator("#ledgerStatus")).toHaveAttribute("data-tone", "ok");
}
// The invisible direction marks Intl puts in an Arabic date (U+200E, U+200F,
// U+061C) never reach a rationale the person may save.
const DIRECTION_MARKS = new RegExp(`[${String.fromCharCode(0x200e, 0x200f, 0x61c)}]`, "g");
const checkedOn = async (page, iso, lang = "en") => (await page.evaluate(([value, locale]) => new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(value)), [iso, lang])).replace(DIRECTION_MARKS, "");

test.describe("Your sources in the review ledger", () => {
  for (const answer of ["en", "bio-en"]) {
    test(`${answer}: the related provenance task names your source, Complete starts from your check, and the tasks are the same without the case`, async ({ page }) => {
      const evidence = JSON.parse(await fixture(answer)).evidence.items[0];
      await linkedCase(page, { answer, title: evidence.source_title });
      await openLedgerHere(page);
      const withCase = await ledgerRows(page);
      await page.locator("#ledgerReviewer").fill("Case Reviewer");
      // Only the related provenance task says anything of the case.
      const selections = await eachLedgerSelection(page);
      expect(selections.map(([id, pressed, , lines]) => [id, pressed, lines])).toEqual(withCase.map(([id, , meta], index) => [id, "true", selections[index]?.[2] === evidence.id && meta.endsWith("Verify provenance") ? 1 : 0]));
      // One row pressed as a person would (visible, enabled, stable): the
      // first task, which then shows what the pass above saw for it.
      const first = page.locator("#ledgerTaskList [data-ledger-task]").first();
      const firstId = await first.getAttribute("data-ledger-task");
      await first.click();
      await expect(page.locator(`#ledgerTaskList [data-ledger-task="${firstId}"]`)).toHaveAttribute("aria-pressed", "true");
      await expect(ledgerSource(page)).toHaveCount(selections[0][3]);
      await ledgerTask(page, evidence.id).click();
      await expect(ledgerSource(page)).toHaveText(`Your source: ${evidence.source_title} · matching excerpts: 1`);
      await expect(ledgerSource(page).locator("bdi")).toHaveAttribute("dir", "auto");
      // Pending: Start, Waive and Note start empty.
      for (const action of ["task_started", "task_waived", "note_added"]) {
        await page.locator("#ledgerAction").selectOption(action);
        await expect(rationale(page)).toHaveValue("");
      }
      expect(await ledgerEvents(page)).toEqual([]);
      await appendLedger(page, "task_started", "Taking this one.");
      // In review, Complete is the action: an empty field starts from the check.
      const [dossier] = await readCases(page);
      const excerpt = dossier.excerpts.find((item) => item.check.status === "matches");
      const started = `From your source “${evidence.source_title}”, at p. 12, checked ${await checkedOn(page, excerpt.check.decided_at)}: Compared with the printed table.`;
      await expect(page.locator("#ledgerAction")).toHaveValue("task_completed");
      await expect(rationale(page)).toHaveValue(started);
      // Another action takes the started text away; Complete brings it back.
      await page.locator("#ledgerAction").selectOption("note_added");
      await expect(rationale(page)).toHaveValue("");
      await page.locator("#ledgerAction").selectOption("task_completed");
      await expect(rationale(page)).toHaveValue(started);
      // Typed text is never replaced, nor the started text once edited.
      await rationale(page).fill("My own words.");
      await page.locator("#ledgerAction").selectOption("note_added");
      await page.locator("#ledgerAction").selectOption("task_completed");
      await expect(rationale(page)).toHaveValue("My own words.");
      await rationale(page).fill(`${started} Seen.`);
      await page.locator("#ledgerAction").selectOption("task_waived");
      await page.locator("#ledgerAction").selectOption("task_completed");
      await expect(rationale(page)).toHaveValue(`${started} Seen.`);
      await rationale(page).fill("");
      await page.locator("#ledgerAction").selectOption("note_added");
      await page.locator("#ledgerAction").selectOption("task_completed");
      await expect(rationale(page)).toHaveValue(started);
      // None of that wrote anything: one event, the person's Start.
      expect((await ledgerEvents(page)).map((event) => event.type)).toEqual(["task_started"]);
      await appendLedger(page, "task_completed");
      const events = await ledgerEvents(page);
      expect(events.map((event) => [event.type, event.rationale])).toEqual([["task_started", "Taking this one."], ["task_completed", started]]);
      await page.locator("#ledgerClose").click();
      // Without the case: the same tasks in the same order, no line, the saved rationale kept.
      await removeCase(page);
      await openLedgerHere(page);
      expect(await ledgerRows(page)).toEqual(withCase);
      await ledgerTask(page, evidence.id).click();
      await expect(ledgerSource(page)).toHaveCount(0);
      await page.locator("#ledgerHistorySummary").click();
      await expect(page.locator("#ledgerHistory")).toContainText(started);
      await page.locator("#ledgerAction").selectOption("note_added");
      await expect(rationale(page)).toHaveValue("");
      expect(await ledgerEvents(page)).toEqual(events);
    });
  }

  test("the count is of matching excerpts, the start is the one checked last, and \"at\" goes with no locator", async ({ page }) => {
    await start(page);
    const related = await addSource(page, STRATEGIC_TITLE);
    await decide(await addExcerpt(related, "First reading."), "matches", "First check.");
    await decide(await addExcerpt(related, "Second reading.", "p. 3"), "matches", "Second check.");
    await decide(await addExcerpt(related, "Third reading.", "p. 9"), "differs", "Not what it says.");
    // Checked again last while still first in the list: the start follows the
    // check's time, not the list's order.
    const first = related.locator("[data-excerpt-row]").first();
    await first.locator('[data-source-action="reopen"]').click();
    await expect(first.locator('[data-source-action="reopen"]')).toHaveCount(0);
    await decide(first, "matches", "First check again.");
    await addSource(page, "Unrelated pamphlet", "https://example.org/pamphlet");
    await importAnswer(page);
    await expect.poll(async () => (await readCases(page))[0]?.analyses.length).toBe(1);
    await openLedgerHere(page);
    await page.locator("#ledgerReviewer").fill("Case Reviewer");
    await ledgerTask(page, "E1").click();
    await expect(ledgerSource(page)).toHaveText(`Your source: ${STRATEGIC_TITLE} · matching excerpts: 2`);
    await appendLedger(page, "task_started", "Taking this one.");
    const excerpts = (await readCases(page))[0].excerpts;
    expect(excerpts.map((item) => item.text)).toEqual(["First reading.", "Second reading.", "Third reading."]);
    const [checkedLast, second] = excerpts;
    expect(Date.parse(checkedLast.check.decided_at)).toBeGreaterThan(Date.parse(second.check.decided_at));
    await expect(rationale(page)).toHaveValue(`From your source “${STRATEGIC_TITLE}”, checked ${await checkedOn(page, checkedLast.check.decided_at)}: First check again.`);
    // Closed as it was started: the started text goes with the dialog.
    await page.locator("#ledgerClose").click();
    await expect(rationale(page)).toHaveValue("");
    // No matching excerpt: the line has no count and Complete starts empty.
    await openSources(page);
    for (const index of [0, 1]) {
      const excerpt = sourceRows(page).first().locator("[data-excerpt-row]").nth(index);
      await excerpt.locator('[data-source-action="reopen"]').click();
      await expect(excerpt.locator('[data-source-action="reopen"]')).toHaveCount(0);
    }
    await expect.poll(async () => (await readCases(page))[0].excerpts.filter((item) => item.check.status === "matches").length).toBe(0);
    await openLedgerHere(page);
    await ledgerTask(page, "E1").click();
    await expect(ledgerSource(page)).toHaveText(`Your source: ${STRATEGIC_TITLE}`);
    await expect(page.locator("#ledgerAction")).toHaveValue("task_completed");
    await expect(rationale(page)).toHaveValue("");
    expect((await ledgerEvents(page)).map((event) => event.type)).toEqual(["task_started"]);
  });

  for (const [lang, copy] of Object.entries({
    ar: { phase: "التحقق من المصدر", line: `مصدرك: «${STRATEGIC_TITLE}» · المقتطفات المطابقة: 1`, start: (date) => `من مصدرك «${STRATEGIC_TITLE}»، في p. 12، تُحقّق منه في ${date}: Compared with the printed table.` },
    fr: { phase: "Vérifier la provenance", line: `Votre source : « ${STRATEGIC_TITLE} » · extraits conformes : 1`, start: (date) => `De votre source « ${STRATEGIC_TITLE} », à p. 12, vérifié le ${date} : Compared with the printed table.` },
  })) {
    test(`${lang}: the line and the started rationale in its words`, async ({ page }) => {
      await linkedCase(page);
      await page.locator(`#lang${lang[0].toUpperCase()}${lang[1]}`).click();
      await openLedgerHere(page);
      await page.locator("#ledgerReviewer").fill("Case Reviewer");
      await ledgerTask(page, "E1", copy.phase).click();
      await expect(ledgerSource(page)).toHaveText(copy.line);
      await appendLedger(page, "task_started", "Taking this one.");
      const excerpt = (await readCases(page))[0].excerpts.find((item) => item.check.status === "matches");
      await expect(rationale(page)).toHaveValue(copy.start(await checkedOn(page, excerpt.check.decided_at, lang)));
      expect(await rationale(page).inputValue()).not.toMatch(DIRECTION_MARKS);
      await expectKernel(page, "#ledgerBackdrop", "#ledgerDialog");
    });
  }
});
