import { test, expect } from "@playwright/test";
import { openStep } from "./helpers/guided-flow.js";
import { expectKernel } from "./helpers/kernel-check.js";

// RESEARCH-1D D1-D2: a text file is read on the device, passages are chosen and
// saved as ordinary sources and excerpts. Nothing else of the file is kept.
// The dossier's own repository is read, never a raw storage request.
const readCases = (page) => page.evaluate(async () => {
  const { createDossierRepository, createIndexedDbDossierBackend } = await import("./src/core/research-dossier.js");
  const repository = createDossierRepository({ backend: createIndexedDbDossierBackend() });
  try { return await repository.list(); } finally { repository.close(); }
});
const rows = (page) => page.locator("#sourcesBody > ol > [data-source-row]");
const status = (page) => page.locator("#sourcesFileStatus");
const input = (page) => page.locator("#srcFileInput");
const preview = (page) => page.locator("#srcFilePreview");
const file = (name, text) => ({ name, mimeType: "text/plain", buffer: Buffer.from(text, "utf8") });
const NOTES = "First line of the notes.\nThe pass expires in June, says the second line.\nThird line.";

async function start(page, lang = "en") {
  await page.goto("./");
  await page.locator(`#lang${lang[0].toUpperCase()}${lang.slice(1)}`).click();
  await page.locator("#sourcesFold > summary").click();
}
async function choose(page, upload) {
  await input(page).setInputFiles(upload);
  await expect(preview(page)).toBeVisible();
}
const select = (page, needle) => preview(page).evaluate((box, text) => {
  const at = box.value.indexOf(text);
  box.focus();
  box.setSelectionRange(at, at + text.length);
}, needle);
async function pick(page, needle) {
  await select(page, needle);
  await page.locator("#srcFilePick").click();
  await expect(page.locator("#srcFilePassage")).toHaveValue(needle);
}

// Navigation really travels through the tab order; no focus() smuggles a
// keyboard-inaccessible control into the test.
async function tabTo(page, target, backwards = false) {
  for (let n = 0; n < 100; n += 1) {
    if (await target.evaluate((element) => element === document.activeElement)) return;
    await page.keyboard.press(backwards ? "Shift+Tab" : "Tab");
  }
  throw new Error("Could not reach " + (await target.getAttribute("id")) + " through the tab order");
}
async function openInOtherPage(context, id) {
  const other = await context.newPage();
  await other.goto("./");
  await other.locator("#langEn").click();
  await other.locator("#workspaceSaveState").click();
  await other.locator('[data-case-open="' + id + '"]').click();
  await other.locator("#workspaceClose").click();
  await openStep(other, "topic");
  await expect(rows(other)).toHaveCount(1);
  return other;
}

test.describe("Read text from a file", () => {
  test("a passage and its new source are saved together, kept after reload, and nothing else of the file is", async ({ page }) => {
    await start(page);
    await expect(page.locator("#srcFileHead")).toHaveText("Read text from a file");
    await expect(page.getByLabel("Choose a file")).toHaveAttribute("accept", /\.txt/);
    await expect(page.locator("#srcFileHelp")).toContainText("up to 2 MB");
    await expect(page.locator("#srcFileHelp")).toContainText("The original file is not kept or attached to the AI chat.");
    await choose(page, file("notes.txt", NOTES));
    await expect(preview(page)).toBeFocused();
    await expect(preview(page)).toHaveAttribute("aria-readonly", "true");
    // Typing, deleting and pasting change nothing in it.
    await page.keyboard.press("End");
    await page.keyboard.type("zzz");
    await page.keyboard.press("Backspace");
    await page.keyboard.press("Delete");
    await expect(preview(page)).toHaveValue(NOTES);
    await expect(preview(page)).toHaveValue(NOTES);
    await expect(status(page)).toHaveText(`Read ${NOTES.length} characters from notes.txt. Select a passage in the text, then choose it.`);
    // Nothing is saved until a passage is: reading made no case.
    expect(await readCases(page)).toEqual([]);
    await expect(page.locator("#srcFileTitle-hint")).toContainText("Suggested from the file name");
    await pick(page, "The pass expires in June");
    await page.locator("#srcFileLocator").fill("line 2");
    await page.getByRole("button", { name: "Save passage", exact: true }).click();
    const row = rows(page).filter({ has: page.getByRole("heading", { name: "notes.txt", exact: true }) });
    await expect(row).toBeVisible();
    await expect(row).toContainText("Not sent");
    await expect(row.locator("[data-excerpt-row]")).toContainText("The pass expires in June");
    await expect(row.locator("[data-excerpt-row]")).toContainText("line 2");
    await expect(preview(page)).toBeFocused();
    await expect(page.locator("#sourcesStatus")).toHaveText("Saved on this device.");
    await expect(page.locator("#srcFilePassage")).toHaveValue("");
    await expect(page.locator("#srcFileTarget")).toHaveValue(/^source_/);
    await expect(page.locator("#srcFileTitleField")).toBeHidden();
    const [saved] = await readCases(page);
    expect(saved.format_version).toBe(2);
    expect(saved.integrity_status).toBe("verified");
    expect(saved.sources).toHaveLength(1);
    expect(Object.keys(saved.sources[0]).sort()).toEqual(["accessed_on", "added_at", "send", "source_date", "source_id", "title", "url"]);
    expect(saved.sources[0]).toMatchObject({ title: "notes.txt", url: "", send: false });
    expect(saved.excerpts).toHaveLength(1);
    expect(Object.keys(saved.excerpts[0]).sort()).toEqual(["added_at", "check", "excerpt_id", "locator", "source_id", "text"]);
    expect(saved.excerpts[0]).toMatchObject({ text: "The pass expires in June", locator: "line 2", check: { status: "unchecked", reason: "", decided_at: null } });
    // The rest of the file is neither in the record nor in the page's other storage.
    expect(JSON.stringify(saved)).not.toContain("Third line");
    expect(await page.evaluate(() => JSON.stringify([{ ...localStorage }, { ...sessionStorage }]))).not.toContain("Third line");
    await page.reload();
    await expect(rows(page)).toHaveCount(1);
    await expect(rows(page).first().locator("[data-excerpt-row]")).toContainText("The pass expires in June");
    await expect(input(page)).toBeVisible();
    await expect(preview(page)).toHaveCount(0);
  });

  test("more passages go to the same source or another, and a title already used is refused", async ({ page }) => {
    await start(page);
    await page.locator("#sourceAdd-title").fill("Council minutes.txt");
    await page.getByRole("button", { name: "Add source", exact: true }).click();
    await expect(rows(page)).toHaveCount(1);
    await choose(page, file("Council minutes.txt", NOTES));
    // A title already in the list is refused, with a way out; nothing is written.
    await page.locator("#srcFilePassage").fill("Anything");
    await page.getByRole("button", { name: "Save passage", exact: true }).click();
    await expect(page.locator("#srcFileTitle-error")).toHaveText(/already here\. Choose it under Add to, or change the title\./);
    await expect(page.locator("#srcFileTitle")).toBeFocused();
    await expect(page.locator("#srcFileTitle")).toHaveAttribute("aria-invalid", "true");
    expect((await readCases(page))[0].sources).toHaveLength(1);
    expect((await readCases(page))[0].excerpts).toEqual([]);
    // …by adding to it instead.
    await page.locator("#srcFileTarget").selectOption({ label: "Council minutes.txt" });
    await expect(page.locator("#srcFileTitleField")).toBeHidden();
    await page.getByRole("button", { name: "Save passage", exact: true }).click();
    await expect(rows(page).first().locator("[data-excerpt-row]")).toHaveCount(1);
    // The existing source keeps its own send choice (on, as made).
    await expect(rows(page).first()).not.toContainText("Not sent");
    await pick(page, "Third line.");
    await page.getByRole("button", { name: "Save passage", exact: true }).click();
    await expect(rows(page).first().locator("[data-excerpt-row]")).toHaveCount(2);
    // …or by changing the title, which makes a second source.
    await page.locator("#srcFileTarget").selectOption("");
    await page.locator("#srcFileTitle").fill("Council minutes (file)");
    await pick(page, "First line of the notes.");
    await page.getByRole("button", { name: "Save passage", exact: true }).click();
    await expect(rows(page)).toHaveCount(2);
    const [saved] = await readCases(page);
    expect(saved.sources.map((source) => [source.title, source.send])).toEqual([["Council minutes.txt", true], ["Council minutes (file)", false]]);
    expect(saved.excerpts.map((excerpt) => excerpt.text)).toEqual(["Anything", "Third line.", "First line of the notes."]);
    // Closing the file forgets it.
    await page.locator("#srcFileClose").click();
    await expect(input(page)).toBeFocused();
    await expect(preview(page)).toHaveCount(0);
  });

  test("files that cannot be read are refused in plain words and save nothing", async ({ page }) => {
    await start(page);
    const refused = [
      [{ name: "scan.pdf", mimeType: "application/pdf", buffer: Buffer.from("%PDF-1.4") }, "This file type is not supported. Use a text file or paste a passage."],
      [{ name: "big.txt", mimeType: "text/plain", buffer: Buffer.alloc(2 * 1024 * 1024 + 1, 97) }, "This file is too large. Use a smaller file or paste a passage."],
      [{ name: "blank.txt", mimeType: "text/plain", buffer: Buffer.from(" \n\t ") }, "No readable text found"],
      [{ name: "empty.txt", mimeType: "text/plain", buffer: Buffer.alloc(0) }, "No readable text found"],
      [{ name: "latin1.txt", mimeType: "text/plain", buffer: Buffer.from([0x63, 0x61, 0x66, 0xe9]) }, "This file is not text in UTF-8 or UTF-16. Save it as UTF-8 and choose it again."],
      [{ name: "data.txt", mimeType: "text/plain", buffer: Buffer.from("ab\u0000cd") }, "This looks like a binary file, not text. Use a text file or paste a passage."],
      [{ name: "page.html", mimeType: "text/html", buffer: Buffer.from("<script>alert(1)</script><style>p{}</style>") }, "No readable text found"],
    ];
    for (const [upload, message] of refused) {
      await input(page).setInputFiles(upload);
      await expect(status(page)).toHaveText(message);
      await expect(input(page)).toBeFocused();
      await expect(preview(page)).toHaveCount(0);
    }
    expect(await readCases(page)).toEqual([]);
  });

  test("UTF-16, Arabic, HTML and a passage near its limit", async ({ page }) => {
    await start(page);
    const arabic = "نص عربي: التناسب 😀";
    const utf16 = Buffer.concat([Buffer.from([0xff, 0xfe]), Buffer.from(arabic, "utf16le")]);
    await choose(page, { name: "ملف.txt", mimeType: "text/plain", buffer: utf16 });
    await expect(preview(page)).toHaveValue(arabic);
    await expect(preview(page)).toHaveAttribute("dir", "auto");
    await expect(page.locator("#srcFileTitle")).toHaveValue("ملف.txt");
    await page.locator("#srcFileClose").click();
    await choose(page, { name: "page.html", mimeType: "text/html", buffer: Buffer.from('<head><title>T</title></head><p>One &amp; <a href="https://example.org/x">two</a></p><script>alert(1)</script><img src="https://example.org/i.png"><p>Three</p>') });
    await expect(preview(page)).toHaveValue("One & two\n\nThree");
    await page.locator("#srcFileClose").click();
    const long = `${"a".repeat(1999)}😀${"b".repeat(100)}`;
    await choose(page, file("long.txt", long));
    // A selection ending inside the pair takes the whole character, so is 2,001 long.
    await preview(page).evaluate((box) => { box.focus(); box.setSelectionRange(0, 2000); });
    await page.locator("#srcFilePick").click();
    await expect(page.locator("#srcFilePreview-error")).toHaveText("That passage is 2001 characters; the most is 2,000. Select a shorter one, or save it in parts.");
    await expect(preview(page)).toBeFocused();
    await expect(page.locator("#srcFilePassage")).toHaveValue("");
    await preview(page).evaluate((box) => { box.focus(); box.setSelectionRange(0, 1999); });
    await page.locator("#srcFilePick").click();
    await expect(page.locator("#srcFilePassage")).toHaveValue("a".repeat(1999));
    await preview(page).evaluate((box) => { box.focus(); box.setSelectionRange(5, 5); });
    await page.locator("#srcFilePick").click();
    await expect(page.locator("#srcFilePreview-error")).toHaveText("Select a passage in the text first.");
    expect(await readCases(page)).toEqual([]);
  });

  test("a failed save keeps the passage and says it was not saved", async ({ page }) => {
    await start(page);
    await choose(page, file("notes.txt", NOTES));
    await pick(page, "Third line.");
    await page.locator("#srcFileLocator").fill("line 3");
    // The seal fails once: the write is refused whole, source and passage alike.
    await page.evaluate(() => {
      const original = crypto.subtle.digest.bind(crypto.subtle);
      let armed = true;
      crypto.subtle.digest = async (...args) => {
        if (armed) { armed = false; throw new Error("storage refused"); }
        return original(...args);
      };
    });
    await page.getByRole("button", { name: "Save passage", exact: true }).click();
    await expect(page.locator("#sourcesStatus")).toContainText("Not saved on this device");
    await expect(page.locator("#srcFilePassage")).toHaveValue("Third line.");
    await expect(page.locator("#srcFileLocator")).toHaveValue("line 3");
    await expect(page.locator("#srcFileSave")).toBeEnabled();
    await expect(page.locator("#srcFileSave")).toBeFocused();
    expect(await readCases(page)).toEqual([]);
    await expect(rows(page)).toHaveCount(0);
    // Saving again, with the passage still there, writes it once.
    await page.getByRole("button", { name: "Save passage", exact: true }).click();
    await expect(rows(page)).toHaveCount(1);
    const [saved] = await readCases(page);
    expect(saved.sources.map((source) => source.title)).toEqual(["notes.txt"]);
    expect(saved.excerpts.map((excerpt) => [excerpt.text, excerpt.locator])).toEqual([["Third line.", "line 3"]]);
  });

  test("Cancel stops a read and a late result never appears", async ({ page }) => {
    await page.addInitScript(() => {
      const original = FileReader.prototype.readAsArrayBuffer;
      FileReader.prototype.readAsArrayBuffer = function held(file) {
        window.__heldRead = { reader: this, file, release: () => original.call(this, file) };
      };
    });
    await start(page);
    await input(page).setInputFiles(file("slow.txt", NOTES));
    await expect(page.locator("#srcFileCancel")).toBeFocused();
    await expect(status(page)).toHaveText("Reading on this device…");
    await page.locator("#srcFileCancel").click();
    await expect(status(page)).toHaveText("Reading stopped.");
    await expect(input(page)).toBeFocused();
    // The browser finishes the read after Cancel: nothing of it shows.
    await page.evaluate(() => new Promise((resolve) => {
      window.__heldRead.reader.addEventListener("loadend", resolve);
      window.__heldRead.release();
    }));
    await expect(preview(page)).toHaveCount(0);
    await expect(input(page)).toBeVisible();
    expect(await readCases(page)).toEqual([]);
  });

  test("changing the case closes the reader, and its late result goes nowhere", async ({ page }) => {
    await page.addInitScript(() => {
      const original = FileReader.prototype.readAsArrayBuffer;
      FileReader.prototype.readAsArrayBuffer = function held(file) {
        window.__heldRead = { reader: this, file, release: () => original.call(this, file) };
      };
    });
    await start(page);
    await input(page).setInputFiles(file("slow.txt", NOTES));
    await expect(page.locator("#srcFileCancel")).toBeVisible();
    // Loading the sample leaves the case: the reader is closed with it.
    await page.locator("#loadSampleBtn").click();
    await openStep(page, "topic");
    await page.locator("#sourcesFold > summary").click();
    await expect(input(page)).toBeVisible();
    await expect(page.locator("#srcFileCancel")).toHaveCount(0);
    await page.evaluate(() => new Promise((resolve) => {
      window.__heldRead.reader.addEventListener("loadend", resolve);
      window.__heldRead.release();
    }));
    await expect(preview(page)).toHaveCount(0);
    expect(await readCases(page)).toEqual([]);
  });

  test("removing the source a file was for closes the reader", async ({ page }) => {
    await start(page);
    await page.locator("#sourceAdd-title").fill("Target source");
    await page.getByRole("button", { name: "Add source", exact: true }).click();
    await choose(page, file("notes.txt", NOTES));
    await page.locator("#srcFileTarget").selectOption({ label: "Target source" });
    const row = rows(page).first();
    await row.locator('[data-source-action="remove-source"]').click();
    await row.locator('[data-source-action="remove-source"]').click();
    await expect(status(page)).toHaveText("The source this file was for was removed, so the file was closed.");
    await expect(preview(page)).toHaveCount(0);
    await expect(input(page)).toBeVisible();
  });

  test("HTML keeps hidden text hidden, decodes its references, and a long run of spaces is read at once", async ({ page }) => {
    await start(page);
    const html = (body) => ({ name: "page.html", mimeType: "text/html", buffer: Buffer.from(body, "utf8") });
    // Everything a browser keeps inside the element stays out.
    await input(page).setInputFiles(html("<script><!--<script></script>SECRET</script><p>visible</p>"));
    await expect(preview(page)).toHaveValue("visible");
    await page.locator("#srcFileClose").click();
    await choose(page, html("<p>caf&eacute; &agrave; l&apos;&eacute;t&eacute; &laquo;&nbsp;oui&nbsp;&raquo;</p><p dir=rtl>&#1575;&#1604;&#1593;&#1585;&#1576;&#1610;&#1577; &mdash; &oelig;uvre</p>"));
    await expect(preview(page)).toHaveValue("café à l'été « oui »\n\nالعربية — œuvre");
    await page.locator("#srcFileClose").click();
    // A run of spaces in <pre> was once read in quadratic time.
    await choose(page, html(`<pre>x${" ".repeat(600_000)}x</pre>`));
    expect(await preview(page).evaluate((box) => [box.value.length, box.value[0], box.value.at(-1)])).toEqual([600_002, "x", "x"]);
    expect(await readCases(page)).toEqual([]);
  });

  test("HTML with a template, xmp or plaintext tag is refused whole, in plain words, and nothing is saved", async ({ page }) => {
    await start(page);
    const html = (body) => ({ name: "page.html", mimeType: "text/html", buffer: Buffer.from(body, "utf8") });
    const reproducers = [
      "<template/>SECRET<p>visible</p>",
      "<template><xmp></template>SECRET</xmp>VISIBLE",
      "<template><plaintext></template>SECRET",
      "<head><template></head>SECRET</template><body>VISIBLE",
      "<select><template></select>SECRET</template>VISIBLE",
      "<p>visible</p><XMP>SECRET",
    ];
    const words = {
      en: "This HTML cannot be read safely. Use a text version or paste a passage.",
      fr: "Ce HTML ne peut pas être lu en toute sécurité. Utilisez une version texte ou collez un passage.",
      ar: "تعذّرت قراءة هذا الـ HTML بأمان. استخدم نسخة نصية أو الصق مقتطفًا.",
    };
    for (const body of reproducers) {
      await input(page).setInputFiles(html(body));
      await expect(status(page)).toHaveText(words.en);
      await expect(preview(page)).toHaveCount(0);
      await expect(page.locator("#srcFilePassage")).toHaveCount(0);
    }
    for (const lang of ["fr", "ar"]) {
      await page.locator(`#lang${lang[0].toUpperCase()}${lang.slice(1)}`).click();
      await input(page).setInputFiles(html(reproducers[1]));
      await expect(status(page)).toHaveText(words[lang]);
      await expect(preview(page)).toHaveCount(0);
    }
    // A page without those tags is still read.
    await page.locator("#langEn").click();
    await choose(page, html("<p>visible</p>"));
    await expect(preview(page)).toHaveValue("visible");
    await expect(rows(page)).toHaveCount(0);
    expect(await readCases(page)).toEqual([]);
  });

  test("a save refused by storage keeps the passage, writes nothing, and can be repeated", async ({ page }) => {
    await start(page);
    await choose(page, file("notes.txt", NOTES));
    await pick(page, "Third line.");
    await page.evaluate(() => {
      const original = IDBObjectStore.prototype.put;
      let armed = true;
      IDBObjectStore.prototype.put = function refuse(...args) {
        if (armed) { armed = false; throw new DOMException("The quota has been exceeded.", "QuotaExceededError"); }
        return original.apply(this, args);
      };
    });
    await page.getByRole("button", { name: "Save passage", exact: true }).click();
    await expect(page.locator("#sourcesStatus")).toContainText("Not saved on this device");
    await expect(page.locator("#srcFilePassage")).toHaveValue("Third line.");
    await expect(page.locator("#srcFileSave")).toBeFocused();
    expect(await readCases(page)).toEqual([]);
    await expect(rows(page)).toHaveCount(0);
    await page.getByRole("button", { name: "Save passage", exact: true }).click();
    await expect(rows(page)).toHaveCount(1);
    const [saved] = await readCases(page);
    expect(saved.sources.map((source) => source.title)).toEqual(["notes.txt"]);
    expect(saved.excerpts.map((excerpt) => excerpt.text)).toEqual(["Third line."]);
  });

  test("a passage for a source renamed in another page is not saved, and says so", async ({ page, context }) => {
    await start(page);
    await page.locator("#sourceAdd-title").fill("Council minutes.txt");
    await page.getByRole("button", { name: "Add source", exact: true }).click();
    await expect(rows(page)).toHaveCount(1);
    const [record] = await readCases(page);
    await choose(page, file("notes.txt", NOTES));
    await page.locator("#srcFileTarget").selectOption({ label: "Council minutes.txt" });
    await pick(page, "Third line.");
    await page.locator("#srcFileLocator").fill("line 3");
    const other = await openInOtherPage(context, record.dossier_id);
    const elsewhere = rows(other).first();
    await elsewhere.locator(':scope > .j-flow-row > [data-source-action="edit-source"]').click();
    await elsewhere.locator('[data-source-form="edit"]').getByLabel("Title (required)").fill("Renamed minutes.txt");
    await elsewhere.locator('[data-source-form="edit"]').getByRole("button", { name: "Save", exact: true }).click();
    await expect(elsewhere).toContainText("Renamed minutes.txt");
    await page.getByRole("button", { name: "Save passage", exact: true }).click();
    await expect(page.locator("#sourcesStatus")).toContainText("Not saved on this device. Your text is still here. This source was changed elsewhere (its title or link), so the passage was not added to it.");
    await expect(page.locator("#srcFilePassage")).toHaveValue("Third line.");
    await expect(page.locator("#srcFileLocator")).toHaveValue("line 3");
    await expect(page.locator("#srcFileSave")).toBeEnabled();
    const [after] = await readCases(page);
    expect(after.sources.map((source) => source.title)).toEqual(["Renamed minutes.txt"]);
    expect(after.excerpts).toEqual([]);
    await other.close();
  });

  test("a passage still goes to a source whose send switch, not its identity, changed in another page", async ({ page, context }) => {
    await start(page);
    await page.locator("#sourceAdd-title").fill("Council minutes.txt");
    await page.getByRole("button", { name: "Add source", exact: true }).click();
    const [record] = await readCases(page);
    await choose(page, file("notes.txt", NOTES));
    await page.locator("#srcFileTarget").selectOption({ label: "Council minutes.txt" });
    await pick(page, "Third line.");
    const other = await openInOtherPage(context, record.dossier_id);
    await rows(other).first().getByRole("switch").uncheck();
    await expect(rows(other).first()).toContainText("Not sent");
    await page.getByRole("button", { name: "Save passage", exact: true }).click();
    await expect(rows(page).first().locator("[data-excerpt-row]")).toHaveCount(1);
    const [after] = await readCases(page);
    expect(after.excerpts.map((excerpt) => excerpt.text)).toEqual(["Third line."]);
    expect(after.sources[0].send).toBe(false);
    await other.close();
  });

  test("Tab reaches every reader control in order, and a passage is chosen and saved from the keyboard alone", async ({ page }) => {
    await start(page);
    // The one pointer-free start: the fold's own summary. Everything after is a real Tab.
    await page.locator("#sourcesFold > summary").focus();
    await tabTo(page, input(page));
    // A native file chooser cannot be driven by keys in a test: the file is handed to the input.
    await input(page).setInputFiles(file("notes.txt", NOTES));
    await expect(preview(page)).toBeFocused();
    await page.keyboard.press("ControlOrMeta+Home");
    for (let n = 0; n < 5; n += 1) await page.keyboard.press("Shift+ArrowRight");
    await tabTo(page, page.locator("#srcFilePick"));
    await page.keyboard.press("Enter");
    await expect(page.locator("#srcFilePassage")).toHaveValue("First");
    // Choosing moved focus to the passage, the next thing to review; the controls before it are one Shift+Tab apart.
    await expect(page.locator("#srcFilePassage")).toBeFocused();
    await tabTo(page, page.locator("#srcFileTitle"), true);
    await tabTo(page, page.locator("#srcFileTarget"), true);
    await tabTo(page, page.locator("#srcFilePick"), true);
    await tabTo(page, page.locator("#srcFileLocator"));
    await page.keyboard.type("line 1");
    await tabTo(page, page.locator("#srcFileSave"));
    await page.keyboard.press("Enter");
    await expect(rows(page)).toHaveCount(1);
    await expect(rows(page).first().locator("[data-excerpt-row]")).toContainText("First");
    await expect(preview(page)).toBeFocused();
    await tabTo(page, page.locator("#srcFileClose"));
    await page.keyboard.press("Enter");
    await expect(input(page)).toBeFocused();
    expect((await readCases(page))[0].excerpts[0]).toMatchObject({ text: "First", locator: "line 1" });
  });

  test("the reader is labelled and worded in Arabic and French, and works by keyboard", async ({ page }) => {
    await start(page, "ar");
    await expect(page.locator("#srcFileHead")).toHaveText("اقرأ نصًا من ملف");
    await expect(page.getByLabel("اختر ملفًا")).toBeVisible();
    await input(page).setInputFiles({ name: "x.pdf", mimeType: "application/pdf", buffer: Buffer.from("%PDF") });
    await expect(status(page)).toHaveText("هذا النوع من الملفات غير مدعوم. استخدم ملفًا نصيًا أو الصق مقتطفًا.");
    await page.locator("#langFr").click();
    await expect(page.locator("#srcFileHead")).toHaveText("Lire le texte d’un fichier");
    await choose(page, file("notes.txt", NOTES));
    await expect(page.getByLabel("Texte de notes.txt")).toBeVisible();
    await expect(page.locator("#srcFileSave")).toHaveText("Enregistrer le passage");
    // Kernel controls, axe-clean in both themes, and no sideways scroll at 320 px.
    await expectKernel(page, "#sourcesFile");
    await page.setViewportSize({ width: 320, height: 700 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
    await page.setViewportSize({ width: 1280, height: 800 });
    await expect(page.locator("#srcFilePick")).toHaveText("Choisir un passage");
    await select(page, "Third line.");
    // Choosing a passage and saving it need no pointer: Tab reaches each control.
    await page.locator("#srcFilePick").focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("#srcFilePassage")).toHaveValue("Third line.");
    await page.locator("#srcFileSave").focus();
    await page.keyboard.press("Enter");
    await expect(rows(page)).toHaveCount(1);
    await page.locator("#langAr").click();
    await expect(page.locator("#srcFileSave")).toHaveText("احفظ المقتطف");
    await expect(page.locator("#srcFilePreview")).toHaveValue(NOTES);
  });
});
