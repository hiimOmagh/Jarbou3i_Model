import { test, expect } from "@playwright/test";
import fs from "node:fs/promises";
import { openStep } from "./helpers/guided-flow.js";
import { holdStartupRestore, readFirstWorkspace } from "./helpers/browser-persistence.js";

// RESEARCH-1C S11 (docs/features/research-promotion.md): Make it evidence. A
// matching excerpt becomes a new evidence record, or fills a related one,
// through the resolution dialog; the case keeps a pointer and shows it.

// The case's own store, through its bounded repository, as another tab would
// use it. `change` names what that tab does: "text" and "locator" edit the
// first excerpt and check it again as matching (it still matches, but not as
// the form saw it), "differs" checks it as not matching, "gone" removes it,
// "reason" checks it again with another reason, "link" edits its source's link,
// "title" its source's title, "unlinked" deletes the case. "pointers" saves the given pointers on it.
const inCase = (page, change, pointers = []) => page.evaluate(async ({ change, pointers }) => {
  const dossiers = await import("./src/core/research-dossier.js");
  const repository = dossiers.createDossierRepository({ backend: dossiers.createIndexedDbDossierBackend() });
  try {
    const cases = await repository.list();
    if (change === "read") return cases;
    let current = await repository.get(cases[0].dossier_id);
    const save = async (next) => {
      await repository.save(next, { expectedRevision: current.revision });
      current = next;
    };
    const [excerpt] = current.excerpts;
    const [source] = current.sources;
    if (change === "text" || change === "locator") {
      await save(await dossiers.editExcerpt(current, excerpt, change === "text" ? { text: "The 2020 survey lists another distribution." } : { locator: "p. 99" }));
      await save(await dossiers.checkExcerpt(current, current.excerpts[0], { status: "matches", reason: "Checked again elsewhere." }));
    } else if (change === "differs") await save(await dossiers.checkExcerpt(current, excerpt, { status: "differs", reason: "Not the same." }));
    else if (change === "gone") await save(await dossiers.removeExcerpt(current, excerpt));
    else if (change === "reason") await save(await dossiers.checkExcerpt(current, excerpt, { status: "matches", reason: "Same, another reason." }));
    else if (change === "link") await save(await dossiers.editSource(current, source, { url: "https://example.org/moved" }));
    else if (change === "title") await save(await dossiers.editSource(current, source, { title: "A wholly different report" }));
    else if (change === "unlinked") await repository.delete(current.dossier_id);
    else if (change === "pointers") {
      const basis = { text: excerpt.text, locator: excerpt.locator, source: { title: source.title, url: source.url, source_date: source.source_date } };
      for (const [workspace_id, revision_id, evidence_id, changed] of pointers) {
        await save(await dossiers.addPromotion(current, excerpt.excerpt_id, { workspace_id, revision_id, evidence_id, kind: "fill" }, changed ? { ...basis, locator: "elsewhere" } : basis));
      }
    }
    return current.revision;
  } finally { repository.close(); }
}, { change, pointers });
const readCases = (page) => inCase(page, "read");
// Another tab saves a framing change to the case.
const reframeElsewhere = (page, framing) => page.evaluate(async (changed) => {
  const dossiers = await import("./src/core/research-dossier.js");
  const repository = dossiers.createDossierRepository({ backend: dossiers.createIndexedDbDossierBackend() });
  try {
    const [current] = await repository.list();
    await repository.save(await dossiers.updateDossier(current, { framing: { ...current.framing, ...changed } }), { expectedRevision: current.revision });
  } finally { repository.close(); }
}, framing);
const pointersOf = async (page) => (await readCases(page))[0]?.excerpts.flatMap((excerpt) => excerpt.promotions || []) ?? [];
// Another tab saves an editor draft of the analysis: with a change it leaves
// the working draft dirty; without one it only moves the stored revision on.
const saveDraftElsewhere = (page, { change }) => page.evaluate(async (changed) => {
  const storage = await import("./src/core/workspace-storage.js");
  const { writeEditorDraft } = await import("./src/core/canonical-editor.js");
  const repository = storage.createWorkspaceRepository({ backend: storage.createIndexedDbWorkspaceBackend() });
  try {
    const [{ workspace_id: id }] = await repository.list();
    const workspace = await repository.get(id);
    const payload = structuredClone(workspace.working_draft.canonical_payload);
    if (changed) payload.subject.title = `${payload.subject.title} (edited elsewhere)`;
    await repository.replace(await writeEditorDraft(workspace, payload), { expectedRevision: workspace.repository_revision });
  } finally { repository.close(); }
}, change);
// The case's store refuses writes while `on`, as a full or failing disk would.
const refuseCaseWrites = (page, on) => page.evaluate((refuse) => {
  if (!window.__caseWritesPatched) {
    const put = IDBObjectStore.prototype.put;
    IDBObjectStore.prototype.put = function (...args) {
      if (window.__refuseCaseWrites && this.name === "dossiers") throw new DOMException("Refused by the test.", "UnknownError");
      return put.apply(this, args);
    };
    window.__caseWritesPatched = true;
  }
  window.__refuseCaseWrites = refuse;
}, on);
// The case's store finishes its writes only once released, as a slow disk
// would: what is written is stored, the page hears of it later.
const holdCaseWrites = (page) => page.evaluate(() => {
  const { get, set } = Object.getOwnPropertyDescriptor(IDBTransaction.prototype, "oncomplete");
  window.__caseWritesHeld = new Promise((resolve) => { window.__releaseCaseWrites = resolve; });
  Object.defineProperty(IDBTransaction.prototype, "oncomplete", {
    configurable: true,
    get,
    set(done) {
      const held = typeof done === "function" && this.mode === "readwrite" && [...this.objectStoreNames].includes("dossiers");
      set.call(this, held ? (...args) => window.__caseWritesHeld.then(() => done.apply(this, args)) : done);
    },
  });
});
// E1 renamed to an id of 200 characters, the most a pointer holds.
const LONG_ID = `E${"9".repeat(199)}`;
const withLongId = (answer) => Object.assign(answer, JSON.parse(JSON.stringify(answer).replaceAll('"E1"', JSON.stringify(LONG_ID))));
const pageOverflow = (page) => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
// A save in the topic step's Your sources, made without moving focus, as a
// queued save lands while the analyst works in the case file.
const addSourceQuietly = (page, title) => page.evaluate((value) => {
  const add = document.querySelector('[data-source-form="add"]');
  const input = add.querySelector('[data-source-field="title"]');
  input.value = value;
  input.dispatchEvent(new Event("input", { bubbles: true }));
  add.querySelector('[data-source-action="add-source"]').click();
}, title);
// A language button pressed without moving focus, as a shortcut would.
const switchLanguageQuietly = (page, id) => page.evaluate((button) => document.getElementById(button).click(), id);

const fixture = async (name) => fs.readFile(new URL(`../fixtures/sample-analysis-${name}.json`, import.meta.url), "utf8");
const STRATEGIC_TITLE = "Historical power distribution reference";
const EXCERPT = "The 2019 survey lists the same distribution.";
const REVIEWER = "Rana Analyst";
const NOT_MATCHING = "The excerpt changed or no longer matches its source. Check it again.";
const DRAFT_WORDS = "The working draft has uncommitted changes. Commit or remove that draft first.";
const sourceRows = (page) => page.locator("#sourcesBody > ol > [data-source-row]");
const addForm = (page) => page.locator('[data-source-form="add"]');
const fold = (page) => page.locator("#case-evidence [data-case-sources]");
const foldRows = (page) => fold(page).locator(":scope > ol > [data-case-source-row]");
const form = (page) => fold(page).locator("[data-promote-form]");
const makeIt = (page) => fold(page).getByRole("button", { name: "Make it evidence" });
const reviewButton = (page) => form(page).getByRole("button", { name: "Review the change" });
const refusal = (page) => fold(page).locator("[data-promote-refusal]");
const pointerLines = (page) => fold(page).locator("[data-promote-pointer]");
const record = (page, id) => page.locator(`#case-evidence [data-inspection-id="${id}"]`);
// The kinds the form offers, by their labels.
const choices = (page) => form(page).locator("label:has(> input[type=radio])");
const field = (page, name) => form(page).locator(`[data-promote-field="${name}"]`);
const statusValues = (page) => field(page, "verification_status").locator("option").evaluateAll((options) => options.map((option) => option.value));

async function start(page) {
  // The reviewer name this device keeps, as a commit or the ledger saves it.
  await page.addInitScript((name) => {
    const key = "jarbou3i-model-settings";
    let settings = {};
    try { settings = JSON.parse(localStorage.getItem(key) || "{}") || {}; } catch {}
    localStorage.setItem(key, JSON.stringify({ ...settings, reviewerName: name }));
  }, REVIEWER);
  await page.goto("./");
  await page.locator("#langEn").click();
  await page.locator("#sourcesFold > summary").click();
}
async function addSource(page, title, url = "", date = "") {
  const add = addForm(page);
  await add.locator('[data-source-field="title"]').fill(title);
  if (url) await add.locator('[data-source-field="url"]').fill(url);
  if (date) await add.locator('[data-source-field="source_date"]').fill(date);
  const before = await sourceRows(page).count();
  await add.locator('[data-source-action="add-source"]').click();
  await expect(sourceRows(page)).toHaveCount(before + 1);
  return sourceRows(page).last();
}
async function addCheckedExcerpt(row, text, locator, reason) {
  await row.locator(':scope > .j-flow-row > [data-source-action="new-excerpt"]').click();
  const excerptForm = row.locator("[data-excerpt-form]");
  await excerptForm.locator('[data-source-field="text"]').fill(text);
  if (locator) await excerptForm.locator('[data-source-field="locator"]').fill(locator);
  await excerptForm.locator('[data-source-action="save-excerpt"]').click();
  const excerpt = row.locator("[data-excerpt-row]").last();
  await excerpt.locator('[data-source-action="matches"]').click();
  await excerpt.locator('[data-source-field="reason"]').fill(reason);
  await excerpt.locator('[data-source-action="check-excerpt"]').click();
  await expect(excerpt.locator('[data-source-action="reopen"]')).toBeVisible();
}
async function importAnswer(page, name, mutate) {
  if (name.startsWith("bio")) {
    await openStep(page, "lens");
    await page.locator('[data-lens="biopolitical"]').click();
  }
  // On one line: WebKit types a textarea line by line, and a pretty-printed
  // Biopolitical sample (about a thousand lines) takes half a minute there.
  const answer = JSON.parse(await fixture(name));
  if (mutate) mutate(answer);
  const text = JSON.stringify(answer);
  await openStep(page, "answer");
  await page.locator("#jsonInput").fill(text);
  await page.locator("#importBtn").click();
  await expect(page.locator("#reviewPanel")).toBeVisible();
  await expect.poll(() => readFirstWorkspace(page)).toBeTruthy();
}
// One source with one checked excerpt, then the answer linked to the case,
// and the case file's fold opened on it. `beforeImport` runs in the topic
// step, before the answer is imported.
async function promotableCase(page, { answer = "en", title = STRATEGIC_TITLE, url = "https://example.org/report", date = "", locator = "p. 12", mutate, beforeImport } = {}) {
  await start(page);
  await addCheckedExcerpt(await addSource(page, title, url, date), EXCERPT, locator, "Compared with the printed table.");
  if (beforeImport) await beforeImport();
  await importAnswer(page, answer, mutate);
  await expect.poll(async () => (await readCases(page))[0]?.analyses.length).toBe(1);
  await fold(page).locator(":scope > summary").click();
  await expect(makeIt(page)).toBeVisible();
}
// After a reload the fold may come back open or folded.
async function openFold(page) {
  await expect(page.locator("#reviewPanel")).toBeVisible();
  if (!(await fold(page).evaluate((node) => node.open))) await fold(page).locator(":scope > summary").click();
}
async function openForm(page) {
  await makeIt(page).click();
  await expect(form(page)).toBeVisible();
  await expect(form(page)).toHaveAttribute("role", "group");
}
async function fillStrategic(page) {
  await field(page, "basis").selectOption("source_based");
  await field(page, "confidence").selectOption("medium");
  await field(page, "evidence_strength").selectOption("4");
  await field(page, "source_type").fill("Survey report");
  await field(page, "uncertainty").fill("One survey year only.");
}
async function reviewChange(page) {
  await reviewButton(page).click();
  await expect(page.locator("#resolutionDialog")).toBeVisible();
}
async function confirmChange(page) {
  await page.locator("#resolutionConfirm").check();
  await expect(page.locator("#resolutionCommit")).toBeEnabled();
  await page.locator("#resolutionCommit").click();
}
// Fill E1 from the source, committed; the pointer saved and shown.
async function fillE1(page) {
  await openForm(page);
  await form(page).getByRole("radio", { name: "Fill E1 from your source" }).check();
  await reviewChange(page);
  await confirmChange(page);
  await expect.poll(async () => (await pointersOf(page)).length).toBe(1);
}
// The topic step's fold, opened if it is folded.
async function openCaseFold(page) {
  if (!(await page.locator("#caseFold").evaluate((node) => node.open))) await page.locator("#caseFold > summary").click();
}
const outOfScope = (page) => page.getByLabel("Out of scope", { exact: true });
const focusedIn = (page, selector) => page.evaluate((target) => document.querySelector(target).contains(document.activeElement), selector);
// What the rationale starts as: the excerpt's source, place, day and reason.
const startedRationale = async (page, title, locator) => {
  const [dossier] = await readCases(page);
  const day = await page.evaluate((at) => new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(at)), dossier.excerpts[0].check.decided_at);
  return `From your source “${title}”, ${locator ? `at ${locator}, ` : ""}checked ${day}: Compared with the printed table.`;
};
// The page and the fold are no wider than the window.
async function expectNoSidewaysScroll(page) {
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
  await expect.poll(() => fold(page).evaluate((node) => node.scrollWidth - node.clientWidth)).toBeLessThanOrEqual(1);
}

test.describe("Make it evidence", () => {
  test("Strategic: a new evidence record; Close leaves the workspace as it was, Confirm commits one revision, and the excerpt shows its pointer", async ({ page }) => {
    await promotableCase(page);
    await openForm(page);
    await expect(form(page).getByRole("radio", { name: "New evidence record" })).toBeFocused();
    await expect(form(page).getByRole("radio", { name: "New evidence record" })).toBeChecked();
    await expect(form(page).getByRole("radio")).toHaveCount(2);
    await expect(form(page).getByRole("radio", { name: "Fill E1 from your source" })).toBeVisible();
    // The two kinds are one choice, named by the excerpt it is made from (not
    // "Kind": in French and Arabic that is the word of the type fields).
    await expect(form(page).getByRole("radiogroup", { name: EXCERPT, exact: true }).getByRole("radio")).toHaveCount(2);
    // Nothing is chosen for the person, and the claim starts as the excerpt.
    await expect(field(page, "claim")).toHaveValue(EXCERPT);
    for (const name of ["basis", "confidence", "evidence_strength"]) await expect(field(page, name)).toHaveValue("");
    await expect(field(page, "basis").locator("option")).toHaveText(["Choose", "Source-grounded", "Direct observation", "Analytical inference", "Estimate"]);
    await expect(field(page, "evidence_strength").locator("option").first()).toHaveText("Choose");
    // An empty required field is refused at its field; nothing opens.
    await reviewButton(page).click();
    await expect(field(page, "basis")).toBeFocused();
    await expect(field(page, "basis")).toHaveAttribute("aria-invalid", "true");
    await expect(form(page).locator("#" + (await field(page, "basis").getAttribute("id")) + "-error")).toHaveText("Fill in this field.");
    await expect(page.locator("#resolutionDialog")).toBeHidden();
    await fillStrategic(page);

    const before = await readFirstWorkspace(page);
    await reviewChange(page);
    await expect(page.locator("#resolutionDiff .j-diff-path")).toHaveText(["/evidence/items"]);
    await expect(page.locator("#resolutionDiff")).toContainText('"id": "E2"');
    await expect(page.locator("#resolutionReviewer")).toHaveValue(REVIEWER);
    await expect(page.locator("#resolutionRationale")).toHaveValue(await startedRationale(page, STRATEGIC_TITLE, "p. 12"));
    // Close: the stored workspace, its draft included, byte for byte; the form as it was.
    await page.locator("#resolutionClose").click();
    await expect(page.locator("#resolutionDialog")).toBeHidden();
    await expect(reviewButton(page)).toBeFocused();
    expect(JSON.stringify(await readFirstWorkspace(page))).toBe(JSON.stringify(before));
    await expect(field(page, "source_type")).toHaveValue("Survey report");
    await expect(field(page, "basis")).toHaveValue("source_based");
    expect(await pointersOf(page)).toEqual([]);
    await expect(pointerLines(page)).toHaveCount(0);

    await reviewChange(page);
    await page.locator("#resolutionRationale").fill("Made from my checked excerpt.");
    await confirmChange(page);
    await expect(page.locator("#resolutionBackdrop")).not.toHaveClass(/show/);
    await expect.poll(async () => (await pointersOf(page)).length).toBe(1);
    const after = await readFirstWorkspace(page);
    expect(after.revisions).toHaveLength(before.revisions.length + 1);
    const head = after.revisions.at(-1);
    expect(head.kind).toBe("committed_resolution");
    expect(after.head_revision_id).toBe(head.revision_id);
    expect(after.working_draft.dirty).toBe(false);
    const ledgerRecord = after.resolution_ledger.records.at(-1);
    expect(after.resolution_ledger.records).toHaveLength(before.resolution_ledger.records.length + 1);
    expect(ledgerRecord.reviewer.display_name).toBe(REVIEWER);
    expect(ledgerRecord.rationale).toBe("Made from my checked excerpt.");
    expect(ledgerRecord.committed_revision_id).toBe(head.revision_id);
    const items = head.canonical_payload.evidence.items;
    expect(items).toHaveLength(2);
    expect(items[1]).toEqual({
      id: "E2",
      claim: EXCERPT,
      basis: "source_based",
      confidence: "medium",
      source_title: STRATEGIC_TITLE,
      source_url: "https://example.org/report",
      source_date: "",
      source_type: "Survey report",
      source_note: "p. 12",
      evidence_strength: 4,
      uncertainty: "One survey year only.",
      counter_evidence: "",
    });
    const [pointer] = await pointersOf(page);
    expect(pointer).toMatchObject({ workspace_id: after.workspace_id, revision_id: head.revision_id, evidence_id: "E2", kind: "new", changed_since: false });
    // The form is done; the fold open again, the excerpt says what it became,
    // numbered as the revision history numbers it, and focus is on it.
    await expect(form(page)).toHaveCount(0);
    await expect(fold(page)).toHaveAttribute("open", "");
    await expect(pointerLines(page)).toHaveText([`Evidence E2 (revision ${after.revisions.length})`]);
    const id = pointerLines(page).getByRole("button", { name: "E2", exact: true });
    await expect(id).toBeFocused();
    await expect(makeIt(page)).toBeVisible();
    // The id opens its record, as "In this analysis" does.
    await id.click();
    await expect(record(page, "E2")).toBeFocused();
  });

  test("Strategic: Fill E1 fills only its empty link; editing the source marks Changed since, removing the excerpt removes its pointer and the evidence stays", async ({ page }) => {
    await promotableCase(page);
    await openForm(page);
    await form(page).getByRole("radio", { name: "Fill E1 from your source" }).check();
    await expect(form(page).getByRole("radio", { name: "Fill E1 from your source" })).toBeFocused();
    // Nothing is asked: the judgements stay the record's.
    await expect(form(page).locator("[data-promote-field]:not([type=radio])")).toHaveCount(0);
    const before = await readFirstWorkspace(page);
    await reviewChange(page);
    await expect(page.locator("#resolutionDiff")).toContainText('"source_url": "https://example.org/report"');
    await confirmChange(page);
    await expect.poll(async () => (await pointersOf(page)).length).toBe(1);
    const after = await readFirstWorkspace(page);
    expect(after.revisions).toHaveLength(before.revisions.length + 1);
    const [was] = before.working_draft.canonical_payload.evidence.items;
    const [now] = after.working_draft.canonical_payload.evidence.items;
    expect(now).toEqual({ ...was, source_url: "https://example.org/report" });
    expect((await pointersOf(page))[0]).toMatchObject({ evidence_id: "E1", kind: "fill", revision_id: after.head_revision_id });
    await expect(pointerLines(page)).toHaveText(["Evidence E1 (revision 2)"]);
    await expect(pointerLines(page).getByRole("button", { name: "E1", exact: true })).toBeFocused();
    // E1 now points here, and with a link nothing is left to fill: one choice.
    // Cancel goes back to Make it evidence.
    await openForm(page);
    await expect(choices(page)).toHaveText(["New evidence record"]);
    await form(page).getByRole("button", { name: "Cancel" }).click();
    await expect(form(page)).toHaveCount(0);
    await expect(makeIt(page)).toBeFocused();

    // The source's date edited in the topic step: the case file says so in place.
    await openStep(page, "topic");
    const row = sourceRows(page).first();
    await row.locator(':scope > .j-flow-row > [data-source-action="edit-source"]').click();
    await row.locator('[data-source-form="edit"] [data-source-field="source_date"]').fill("2019-06-01");
    await row.locator('[data-source-form="edit"] [data-source-action="save-source"]').click();
    await expect(pointerLines(page)).toHaveText(["Evidence E1 (revision 2) · Changed since"]);
    expect((await pointersOf(page))[0].changed_since).toBe(true);
    // The excerpt removed: its pointer goes; E1 stays in the analysis.
    const excerpt = row.locator("[data-excerpt-row]").first();
    await excerpt.locator('[data-source-action="remove-excerpt"]').click();
    await excerpt.locator('[data-source-action="remove-excerpt"]').click();
    await expect(foldRows(page).first().locator(".j-done-list")).toHaveCount(0);
    await expect(pointerLines(page)).toHaveCount(0);
    expect((await readCases(page))[0].excerpts).toEqual([]);
    await expect(record(page, "E1")).toHaveCount(1);
    expect((await readFirstWorkspace(page)).working_draft.canonical_payload.evidence.items[0]).toEqual(now);
  });

  test("Biopolitical: a new record is offered verified only when the lens's checks pass, and Verified by starts with this device's name", async ({ page }) => {
    await promotableCase(page, { answer: "bio-en", title: "Health pass statute", url: "https://example.org/statute", date: "2021-05-01", locator: "Art. 4" });
    await openForm(page);
    // The statute relates to no record here: only a new one.
    await expect(choices(page)).toHaveText(["New evidence record"]);
    await expect(field(page, "replication_status")).toHaveValue("unknown");
    expect(await statusValues(page)).toEqual(["", "unverified", "partially_verified"]);
    // A field refused at Review the change stays refused when another choice
    // draws the form again, until it is itself changed.
    const typeError = async () => form(page).locator(`#${await field(page, "epistemic_type").getAttribute("id")}-error`);
    await reviewButton(page).click();
    await expect(field(page, "epistemic_type")).toBeFocused();
    await field(page, "source_tier").selectOption("primary_legal_policy");
    await expect(field(page, "source_tier")).toBeFocused();
    await expect(field(page, "epistemic_type")).toHaveAttribute("aria-invalid", "true");
    await expect(await typeError()).toHaveText("Fill in this field.");
    await expect(await typeError()).toBeVisible();
    await field(page, "epistemic_type").selectOption("institutional_claim");
    await expect(field(page, "epistemic_type")).not.toHaveAttribute("aria-invalid", "true");
    await expect(await typeError()).toBeHidden();
    await field(page, "confidence").selectOption("high");
    await field(page, "claim_source_fit").selectOption("mismatched");
    await expect(field(page, "claim_source_fit")).toBeFocused();
    expect(await statusValues(page)).toEqual(["", "unverified", "partially_verified"]);
    await field(page, "claim_source_fit").selectOption("direct");
    await expect.poll(() => statusValues(page)).toEqual(["", "unverified", "partially_verified", "verified"]);
    await expect(field(page, "verified_by")).toHaveCount(0);
    await field(page, "verification_status").selectOption("verified");
    await expect(field(page, "verified_by")).toHaveValue(REVIEWER);
    await field(page, "uncertainty").fill("Only the national text.");
    await field(page, "limitations").fill("Implementation not observed.");
    await field(page, "counter_evidence").fill("None found in the statute.");
    // A fit that fails the lens's checks takes verified away again.
    await field(page, "claim_source_fit").selectOption("unknown");
    await expect.poll(() => statusValues(page)).toEqual(["", "unverified", "partially_verified"]);
    await expect(field(page, "verified_by")).toHaveCount(0);
    await field(page, "claim_source_fit").selectOption("direct");
    await field(page, "verification_status").selectOption("verified");
    await field(page, "verified_by").fill("Rana A.");

    const before = await readFirstWorkspace(page);
    await reviewChange(page);
    await expect(page.locator("#resolutionRationale")).toHaveValue(await startedRationale(page, "Health pass statute", "Art. 4"));
    await confirmChange(page);
    await expect.poll(async () => (await pointersOf(page)).length).toBe(1);
    const after = await readFirstWorkspace(page);
    expect(after.revisions).toHaveLength(before.revisions.length + 1);
    const items = after.working_draft.canonical_payload.evidence.items;
    const added = items.at(-1);
    const decidedAt = (await readCases(page))[0].excerpts[0].check.decided_at;
    const day = await page.evaluate((at) => new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(at)), decidedAt);
    expect(added).toMatchObject({
      id: `E${items.length}`,
      claim: EXCERPT,
      epistemic_type: "institutional_claim",
      source_tier: "primary_legal_policy",
      source_title: "Health pass statute",
      source_url: "https://example.org/statute",
      source_locator: "Art. 4",
      source_date: "2021-05-01",
      replication_status: "unknown",
      claim_source_fit: "direct",
      verification_status: "verified",
      verified_by: "Rana A.",
      verification_date: day,
      confidence: "high",
    });
    expect((await pointersOf(page))[0]).toMatchObject({ evidence_id: added.id, kind: "new" });
    await expect(pointerLines(page)).toHaveText([`Evidence ${added.id} (revision ${after.revisions.length})`]);
  });

  // The sample's first record has a placeholder title; with a fitting claim
  // only the placeholder rule can keep verified away.
  const fitting = (title) => (answer) => {
    answer.evidence.items[0].claim_source_fit = "direct";
    if (title) answer.evidence.items[0].source_title = title;
  };
  const newBioRecord = async (page) => {
    await form(page).getByRole("radio", { name: "New evidence record" }).check();
    await field(page, "epistemic_type").selectOption("institutional_claim");
    await field(page, "source_tier").selectOption("primary_legal_policy");
    await field(page, "confidence").selectOption("high");
    await field(page, "claim_source_fit").selectOption("direct");
  };

  test("Biopolitical: Fill takes the source's link, date and locator; a placeholder title is never offered verified", async ({ page }) => {
    const sample = JSON.parse(await fixture("bio-en"));
    fitting()(sample);
    const [first] = sample.evidence.items;
    expect(first.source_title).toMatch(/replace with verified source/);
    await promotableCase(page, { answer: "bio-en", title: first.source_title, url: "https://example.org/law", date: "2020-02-02", locator: "s. 3", mutate: fitting() });
    await openForm(page);
    await expect(choices(page)).toHaveText(["New evidence record", `Fill ${first.id} from your source`]);
    // A new record from a placeholder-titled source: no verified, whatever the fit.
    await newBioRecord(page);
    await expect.poll(() => statusValues(page)).toEqual(["", "unverified", "partially_verified"]);
    await form(page).getByRole("radio", { name: `Fill ${first.id} from your source` }).check();
    await expect(form(page).locator("[data-promote-field]:not([type=radio])")).toHaveCount(0);
    await reviewChange(page);
    await confirmChange(page);
    await expect.poll(async () => (await pointersOf(page)).length).toBe(1);
    const filled = (await readFirstWorkspace(page)).working_draft.canonical_payload.evidence.items[0];
    expect(filled).toEqual({ ...first, source_url: "https://example.org/law", source_date: "2020-02-02", source_locator: "s. 3" });
    expect((await pointersOf(page))[0]).toMatchObject({ evidence_id: first.id, kind: "fill" });
  });

  test("Biopolitical: with a real title and a fitting record, Fill and a new record are offered verified", async ({ page }) => {
    const title = "Health pass statute";
    await promotableCase(page, { answer: "bio-en", title, url: "https://example.org/law", date: "2020-02-02", locator: "s. 3", mutate: fitting(title) });
    await openForm(page);
    await expect(choices(page)).toHaveText(["New evidence record", "Fill E1 from your source"]);
    await newBioRecord(page);
    await expect.poll(() => statusValues(page)).toEqual(["", "unverified", "partially_verified", "verified"]);
    await form(page).getByRole("radio", { name: "Fill E1 from your source" }).check();
    // Fill keeps the record's own status unless verified is chosen.
    await expect.poll(() => statusValues(page)).toEqual(["", "verified"]);
    await expect(field(page, "verification_status").locator("option").first()).toHaveText("Unverified");
    await field(page, "verification_status").selectOption("verified");
    await expect(field(page, "verified_by")).toHaveValue(REVIEWER);
    await reviewChange(page);
    await confirmChange(page);
    await expect.poll(async () => (await pointersOf(page)).length).toBe(1);
    const filled = (await readFirstWorkspace(page)).working_draft.canonical_payload.evidence.items[0];
    expect(filled).toMatchObject({ source_title: title, source_url: "https://example.org/law", verification_status: "verified", verified_by: REVIEWER });
  });

  test("Biopolitical: a record with no source field to fill is offered Fill only to be verified, asked as a required choice", async ({ page }) => {
    const title = "Health pass statute";
    const complete = (answer) => {
      fitting(title)(answer);
      Object.assign(answer.evidence.items[0], { source_url: "https://example.org/law", source_date: "2020-02-02", source_locator: "s. 3", verification_status: "unverified" });
    };
    await promotableCase(page, { answer: "bio-en", title, url: "https://example.org/law", date: "2020-02-02", locator: "s. 3", mutate: complete });
    const before = (await readFirstWorkspace(page)).working_draft.canonical_payload.evidence.items[0];
    await openForm(page);
    await expect(choices(page)).toHaveText(["New evidence record", "Fill E1 from your source"]);
    await form(page).getByRole("radio", { name: "Fill E1 from your source" }).check();
    await expect(field(page, "verification_status").locator("option")).toHaveText(["Choose", "Verified"]);
    // Nothing chosen: refused at the field, nothing opens.
    await form(page).getByRole("button", { name: "Review the change" }).click();
    await expect(field(page, "verification_status")).toHaveAttribute("aria-invalid", "true");
    await expect(page.locator("#resolutionBackdrop")).not.toHaveClass(/show/);
    await field(page, "verification_status").selectOption("verified");
    await expect(field(page, "verified_by")).toHaveValue(REVIEWER);
    await reviewChange(page);
    await confirmChange(page);
    await expect.poll(async () => (await pointersOf(page)).length).toBe(1);
    const after = (await readFirstWorkspace(page)).working_draft.canonical_payload.evidence.items[0];
    // Only the verification changed.
    const { verification_status: _s, verified_by: _b, verification_date: _d, ...rest } = after;
    const { verification_status: _s0, verified_by: _b0, verification_date: _d0, ...restBefore } = before;
    expect(after).toMatchObject({ verification_status: "verified", verified_by: REVIEWER });
    expect(rest).toEqual(restBefore);
  });

  // The excerpt's text or locator edited (and checked again), checked as not
  // matching, removed, or the case gone: refused at Confirm in the dialog, and
  // at Review the change under the form.
  for (const [change, words] of [["text", NOT_MATCHING], ["locator", NOT_MATCHING], ["differs", NOT_MATCHING], ["gone", NOT_MATCHING], ["unlinked", "This analysis is not linked to this case."]]) {
    test(`the case is read again at Confirm and at Review the change: ${change} in another tab is refused, nothing committed`, async ({ page }) => {
      await promotableCase(page);
      await openForm(page);
      await fillStrategic(page);
      await reviewChange(page);
      const before = await readFirstWorkspace(page);
      await inCase(page, change);
      await confirmChange(page);
      await expect(page.locator("#resolutionStatus")).toHaveText(words);
      await expect(page.locator("#resolutionDialog")).toBeVisible();
      expect(await focusedIn(page, "#resolutionDialog")).toBe(true);
      expect(JSON.stringify(await readFirstWorkspace(page))).toBe(JSON.stringify(before));
      expect(await pointersOf(page)).toEqual([]);
      await page.locator("#resolutionClose").click();
      await expect(reviewButton(page)).toBeFocused();
      await reviewButton(page).click();
      await expect(refusal(page)).toHaveText(words);
      await expect(page.locator("#resolutionDialog")).toBeHidden();
      await expect(reviewButton(page)).toBeFocused();
      // The button that failed says why.
      await expect(reviewButton(page)).toHaveAccessibleDescription(words);
    });
  }

  // Checked again with another reason, or its source's link edited: the
  // excerpt still matches as the form saw it, so Confirm commits; the pointer
  // says whether what the record was made from changed since. The pointer is
  // written over that other tab's change once, and keeps it.
  for (const [change, changedSince] of [["reason", false], ["link", true]]) {
    test(`Confirm commits over another tab's ${change} change, the pointer says changed since: ${changedSince}, and the other change is kept`, async ({ page }) => {
      await promotableCase(page);
      await openForm(page);
      await fillStrategic(page);
      await reviewChange(page);
      const before = await readFirstWorkspace(page);
      const elsewhere = await inCase(page, change);
      await confirmChange(page);
      await expect.poll(async () => (await pointersOf(page)).length).toBe(1);
      const after = await readFirstWorkspace(page);
      expect(after.revisions).toHaveLength(before.revisions.length + 1);
      expect((await pointersOf(page))[0]).toMatchObject({ evidence_id: "E2", revision_id: after.head_revision_id, changed_since: changedSince });
      // Made again once on the other tab's record: one write after it.
      const [stored] = await readCases(page);
      expect(stored.revision).toBe(elsewhere + 1);
      if (change === "link") expect(stored.sources[0].url).toBe("https://example.org/moved");
      else expect(stored.excerpts[0].check.reason).toBe("Same, another reason.");
      await expect(pointerLines(page)).toHaveText([`Evidence E2 (revision 2)${changedSince ? " · Changed since" : ""}`]);
    });
  }

  test("pointers on screen: one line per pointer to this analysis, none for other analyses; Fill is not offered for a record already pointed to; at 10 pointers the excerpt says so", async ({ page }) => {
    await promotableCase(page);
    await openForm(page);
    await expect(choices(page)).toHaveText(["New evidence record", "Fill E1 from your source"]);
    // Another tab saved pointers from this excerpt: to E1 here (made from what
    // has changed since), to E9 here in a revision this history does not hold
    // and no longer in the analysis, and to E1 of another analysis.
    const workspace = await readFirstWorkspace(page);
    expect(workspace.working_draft.canonical_payload.evidence.items[0].source_url).toBe("");
    const here = workspace.workspace_id;
    await inCase(page, "pointers", [[here, workspace.head_revision_id, "E1", true], [here, "rev_elsewhere", "E9", false], ["another-analysis", "rev_other", "E1", false]]);
    await page.reload();
    await openFold(page);
    await expect(pointerLines(page)).toHaveText(["Evidence E1 (revision 1) · Changed since", "Evidence E9 · No longer in this analysis"]);
    await expect(pointerLines(page).getByRole("button")).toHaveText(["E1"]);
    await openForm(page);
    await expect(choices(page)).toHaveText(["New evidence record"]);
    // Seven more, in other analyses: ten in all; no form, and the reason.
    await inCase(page, "pointers", Array.from({ length: 7 }, (_, index) => ["another-analysis", "rev_other", `E${index + 2}`, false]));
    await page.reload();
    await openFold(page);
    await expect(fold(page).locator("[data-promote-block]")).toHaveText("This excerpt already became evidence 10 times, in any analysis. Add it again as a new excerpt to use it once more.");
    await expect(makeIt(page)).toHaveCount(0);
    await expect(pointerLines(page)).toHaveCount(2);
  });

  test("an id the case cannot point to: no new record when its id would be too long, and with nothing to fill Make it evidence says why; at 320px nothing scrolls sideways", async ({ page }) => {
    // E1 renamed to an id of 200 characters, the most a pointer holds: the
    // next new id would have 201. Its source's title and the excerpt's
    // locator are long unbroken words too.
    const longId = `E${"9".repeat(199)}`;
    const title = `Survey${"T".repeat(120)}`;
    const locator = `p${"0".repeat(120)}`;
    const renamed = (answer) => {
      const text = JSON.stringify(answer).replaceAll('"E1"', JSON.stringify(longId));
      Object.assign(answer, JSON.parse(text));
      answer.evidence.items[0].source_title = title;
    };
    await promotableCase(page, { title, locator, mutate: renamed });
    await page.setViewportSize({ width: 320, height: 720 });
    await openForm(page);
    await expect(choices(page)).toHaveText([`Fill ${longId} from your source`]);
    await expect(form(page).getByRole("radio")).toBeChecked();
    await expectNoSidewaysScroll(page);
    await reviewChange(page);
    await confirmChange(page);
    await expect.poll(async () => (await pointersOf(page)).length).toBe(1);
    await expect(pointerLines(page)).toHaveText([`Evidence ${longId} (revision 2)`]);
    await expectNoSidewaysScroll(page);
    // Filled and pointed to: nothing is left that the case could point to.
    await makeIt(page).click();
    const badId = "The case cannot keep this id: it is empty, too long or on more than one line.";
    await expect(refusal(page)).toHaveText(badId);
    await expect(form(page)).toHaveCount(0);
    await expect(makeIt(page)).toBeFocused();
    await expect(makeIt(page)).toHaveAccessibleDescription(badId);
    await expectNoSidewaysScroll(page);
  });

  test("a pointer this tab saved is no change elsewhere: an excerpt edit left open in Your sources still saves, and the case file says Changed since", async ({ page }) => {
    await promotableCase(page, {
      beforeImport: async () => {
        const excerpt = page.locator("#sourcesBody [data-excerpt-row]").first();
        await excerpt.locator('[data-source-action="edit-excerpt"]').click();
        await page.locator('#sourcesBody [data-excerpt-form] [data-source-field="locator"]').fill("p. 13");
      },
    });
    await fillE1(page);
    await openStep(page, "topic");
    const excerptForm = page.locator("#sourcesBody [data-excerpt-form]");
    await expect(excerptForm.locator('[data-source-field="locator"]')).toHaveValue("p. 13");
    await excerptForm.locator('[data-source-action="save-excerpt"]').click();
    await expect(page.locator("#sourcesStatus")).toHaveText("Saved on this device.");
    const [excerpt] = (await readCases(page))[0].excerpts;
    expect(excerpt.locator).toBe("p. 13");
    // Edited after it became evidence: the pointer says so, here and on screen;
    // the edit reopened the check, so the excerpt cannot be made evidence now.
    expect(excerpt.promotions).toMatchObject([{ evidence_id: "E1", changed_since: true }]);
    await expect(pointerLines(page)).toHaveText(["Evidence E1 (revision 2) · Changed since"]);
    await expect(foldRows(page).first()).toContainText("Not checked yet");
    await expect(makeIt(page)).toHaveCount(0);
  });

  test("a working draft with changes refuses, at Review the change and at Make it evidence", async ({ page }) => {
    await promotableCase(page);
    await openForm(page);
    await fillStrategic(page);
    await saveDraftElsewhere(page, { change: true });
    const before = await readFirstWorkspace(page);
    await reviewButton(page).click();
    await expect(refusal(page)).toHaveText(DRAFT_WORDS);
    await expect(page.locator("#resolutionDialog")).toBeHidden();
    await expect(reviewButton(page)).toBeFocused();
    await form(page).getByRole("button", { name: "Cancel" }).click();
    await expect(makeIt(page)).toBeFocused();
    await makeIt(page).click();
    await expect(refusal(page)).toHaveText(DRAFT_WORDS);
    await expect(form(page)).toHaveCount(0);
    await expect(makeIt(page)).toBeFocused();
    await expect(makeIt(page)).toHaveAccessibleDescription(DRAFT_WORDS);
    expect(JSON.stringify(await readFirstWorkspace(page))).toBe(JSON.stringify(before));
    // Once the page knows the draft has changes, the excerpt says why in place of the button.
    await page.reload();
    await openFold(page);
    await expect(fold(page).locator("[data-promote-block]")).toHaveText(DRAFT_WORDS);
    await expect(makeIt(page)).toHaveCount(0);
  });

  test("a pointer the case could not save: the evidence stays, the excerpt says so, and Save again writes it and shows it", async ({ page }) => {
    await promotableCase(page);
    await openForm(page);
    await fillStrategic(page);
    await reviewChange(page);
    await refuseCaseWrites(page, true);
    const before = await readFirstWorkspace(page);
    await confirmChange(page);
    const unsaved = fold(page).locator("[data-promote-unsaved]");
    await expect(unsaved).toContainText("E2 is in the analysis. This case could not save it.");
    const again = unsaved.getByRole("button", { name: "Save again" });
    await expect(again).toBeFocused();
    await expect(again).toHaveAccessibleDescription(/^E2 is in the analysis\. This case could not save it\. /);
    await expect(makeIt(page)).toHaveCount(0);
    await expect(pointerLines(page)).toHaveCount(0);
    const after = await readFirstWorkspace(page);
    expect(after.revisions).toHaveLength(before.revisions.length + 1);
    expect(after.working_draft.canonical_payload.evidence.items.at(-1).id).toBe("E2");
    expect(await pointersOf(page)).toEqual([]);
    // Still refused: still said, Save again still there.
    await again.click();
    await expect(unsaved.getByRole("button", { name: "Save again" })).toBeFocused();
    expect(await pointersOf(page)).toEqual([]);
    await refuseCaseWrites(page, false);
    await unsaved.getByRole("button", { name: "Save again" }).click();
    await expect(unsaved).toHaveCount(0);
    await expect(makeIt(page)).toBeVisible();
    const pointers = await pointersOf(page);
    expect(pointers).toHaveLength(1);
    expect(pointers[0]).toMatchObject({ workspace_id: after.workspace_id, revision_id: after.head_revision_id, evidence_id: "E2", kind: "new", changed_since: false });
    await expect(pointerLines(page)).toHaveText(["Evidence E2 (revision 2)"]);
    await expect(pointerLines(page).getByRole("button", { name: "E2", exact: true })).toBeFocused();
  });

  test("a pointer not saved for one analysis is said only on that analysis", async ({ page }) => {
    await promotableCase(page);
    await openForm(page);
    await fillStrategic(page);
    await reviewChange(page);
    await refuseCaseWrites(page, true);
    await confirmChange(page);
    await expect(fold(page).locator("[data-promote-unsaved]")).toContainText("E2 is in the analysis. This case could not save it.");
    await refuseCaseWrites(page, false);
    // A second answer for the same case: another analysis, with E1 only. The
    // excerpt is still there, and can be made evidence in this one.
    await importAnswer(page, "en");
    await expect.poll(async () => (await readCases(page))[0].analyses.length).toBe(2);
    await openFold(page);
    await expect(fold(page).locator("[data-promote-unsaved]")).toHaveCount(0);
    await expect(makeIt(page)).toBeVisible();
  });

  test("a pointer not saved whose excerpt is then removed is still said in the fold; Save again then says why and goes, focus on that sentence; and only on its own analysis", async ({ page }) => {
    await promotableCase(page);
    await openForm(page);
    await fillStrategic(page);
    await reviewChange(page);
    await refuseCaseWrites(page, true);
    await confirmChange(page);
    await expect(fold(page).locator("[data-promote-unsaved]")).toContainText("E2 is in the analysis. This case could not save it.");
    await refuseCaseWrites(page, false);
    // The excerpt removed in the topic step: its row goes, what was not saved stays said.
    await openStep(page, "topic");
    const excerpt = sourceRows(page).first().locator("[data-excerpt-row]").first();
    await excerpt.locator('[data-source-action="remove-excerpt"]').click();
    await excerpt.locator('[data-source-action="remove-excerpt"]').click();
    await expect.poll(async () => (await readCases(page))[0].excerpts.length).toBe(0);
    const lost = fold(page).locator("[data-promote-lost]");
    await expect(foldRows(page).first().locator("[data-promote-unsaved]")).toHaveCount(0);
    await expect(lost).toBeVisible();
    await expect(lost.locator(".j-done-text")).toHaveText([EXCERPT]);
    await expect(lost).toContainText("E2 is in the analysis. This case could not save it.");
    // Saving it again, pressed as a person would (WebKit then focuses the
    // section around it), says why it cannot be: the button goes, as it
    // could never succeed, and focus is on the sentence.
    const again = lost.getByRole("button", { name: "Save again" });
    await again.click();
    const note = lost.locator("[data-promote-unsaved] > .j-note");
    await expect(note).toHaveText("E2 is in the analysis. This case could not save it. This excerpt is no longer in the case.");
    await expect(again).toHaveCount(0);
    await expect(note).toBeFocused();
    expect(await pointersOf(page)).toEqual([]);
    // A second answer for the same case: another analysis, with E1 only.
    await importAnswer(page, "en");
    await expect.poll(async () => (await readCases(page))[0].analyses.length).toBe(2);
    await expect(fold(page).locator("[data-promote-unsaved]")).toHaveCount(0);
    await expect(fold(page).locator("[data-promote-lost]")).toHaveCount(0);
  });

  test("a commit over another tab's change is refused by the workspace store, nothing is saved, and reopening the stored version keeps the form", async ({ page }) => {
    await promotableCase(page);
    await openForm(page);
    await fillStrategic(page);
    await reviewChange(page);
    await saveDraftElsewhere(page, { change: false });
    const elsewhere = await readFirstWorkspace(page);
    await confirmChange(page);
    await expect(page.locator("#resolutionStatus")).toContainText("This workspace changed in another tab or window. Nothing was overwritten.");
    await expect(page.locator("#resolutionDialog")).toBeVisible();
    expect(JSON.stringify(await readFirstWorkspace(page))).toBe(JSON.stringify(elsewhere));
    expect(await pointersOf(page)).toEqual([]);
    // The stored version, the same answer, applied again: the fold stays open
    // and the form keeps what was typed.
    await page.locator("#resolutionClose").click();
    await page.locator('#lifeBanners [data-life-action="reopen"]').click();
    await expect(page.locator('#lifeBanners [data-life-action="reopen"]')).toHaveCount(0);
    await expect(fold(page)).toHaveAttribute("open", "");
    await expect(field(page, "source_type")).toHaveValue("Survey report");
    await expect(field(page, "basis")).toHaveValue("source_based");
  });

  test("the form keeps its excerpt, choice, typed values, focus and caret, and its refusal, across redraws; it closes and says why when its excerpt is gone", async ({ page }) => {
    await promotableCase(page);
    await openForm(page);
    await fillStrategic(page);
    const uncertainty = () => field(page, "uncertainty");
    const caretAt = (start, end) => uncertainty().evaluate((node, [from, to]) => { node.focus(); node.setSelectionRange(from, to); }, [start, end]);
    const caret = () => page.evaluate(() => {
      const node = document.activeElement;
      return [node?.dataset.promoteField, node?.selectionStart, node?.selectionEnd];
    });
    const typed = async () => Promise.all(["basis", "confidence", "evidence_strength", "source_type", "uncertainty"].map((name) => field(page, name).inputValue()));
    const values = ["source_based", "medium", "4", "Survey report", "One survey year only."];
    // A save in Your sources draws the fold again in place.
    await caretAt(4, 9);
    await addSourceQuietly(page, "Field notes");
    await expect(foldRows(page)).toHaveCount(2);
    await expect.poll(caret).toEqual(["uncertainty", 4, 9]);
    expect(await typed()).toEqual(values);
    await expect(form(page).getByRole("radio", { name: "New evidence record" })).toBeChecked();
    // A refusal is said under the form; a change of language draws the whole
    // case file again, in its words, and keeps the form and the refusal.
    await inCase(page, "gone");
    await reviewButton(page).click();
    await expect(refusal(page)).toHaveText(NOT_MATCHING);
    await caretAt(2, 6);
    await switchLanguageQuietly(page, "langFr");
    await expect(form(page).getByRole("radio", { name: "Nouvelle fiche de preuve" })).toBeChecked();
    await expect(refusal(page)).toHaveText("L’extrait a changé ou n’est plus conforme à sa source. Vérifiez-le à nouveau.");
    await expect(fold(page)).toHaveAttribute("open", "");
    await expect.poll(caret).toEqual(["uncertainty", 2, 6]);
    expect(await typed()).toEqual(values);
    await switchLanguageQuietly(page, "langEn");
    await expect.poll(caret).toEqual(["uncertainty", 2, 6]);
    // The next save brings the case as another tab left it: the excerpt is
    // gone, so the form closes and the fold says why, under the excerpt's text.
    await addSourceQuietly(page, "More notes");
    await expect(form(page)).toHaveCount(0);
    const lost = fold(page).locator("[data-promote-lost]");
    await expect(lost.locator(".j-done-text")).toHaveText([EXCERPT]);
    await expect(lost.locator("[data-promote-refusal]")).toHaveText("This excerpt is no longer in the case.");
    await expect(lost.locator("[data-promote-refusal]")).toBeFocused();
    await expect(makeIt(page)).toHaveCount(0);
  });

  // What this proves is the outcome: the form survives a restore that lands
  // late. The form needs an analysis on screen, and opening one is itself a
  // change the restore yields to; once the restore has applied an analysis,
  // it compares what the user can change with no wait before its next step,
  // so no form can be used in between. Counting the form's use in that
  // comparison (promotionTouches in restorableInputs) is defensive: this test
  // passes without it and does not prove it.
  test("a slow startup restore does not overwrite a form being typed into", async ({ page }) => {
    await promotableCase(page);
    const restore = await holdStartupRestore(page);
    await page.reload();
    await restore.waitUntilHeld();
    // Opened by hand while the restore still waits to read storage.
    await page.locator("#workspaceSaveState").click();
    await page.locator("[data-workspace-open]").click();
    await page.keyboard.press("Escape");
    await openFold(page);
    await openForm(page);
    await fillStrategic(page);
    await restore.release();
    await expect(form(page)).toBeVisible();
    await expect(fold(page)).toHaveAttribute("open", "");
    await expect(field(page, "source_type")).toHaveValue("Survey report");
    await expect(field(page, "uncertainty")).toHaveValue("One survey year only.");
    await expect(field(page, "basis")).toHaveValue("source_based");
  });

  test("keyboard only: Make it evidence, the form, Review the change, the dialog and Confirm, with focus where the DoR puts it", async ({ page }) => {
    await promotableCase(page);
    await makeIt(page).focus();
    await page.keyboard.press("Enter");
    await expect(form(page).getByRole("radio", { name: "New evidence record" })).toBeFocused();
    const fill = form(page).getByRole("radio", { name: "Fill E1 from your source" });
    await page.keyboard.press("ArrowDown");
    await expect(fill).toBeChecked();
    await expect(fill).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(reviewButton(page)).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(form(page).getByRole("button", { name: "Cancel" })).toBeFocused();
    await page.keyboard.press("Space");
    await expect(form(page)).toHaveCount(0);
    await expect(makeIt(page)).toBeFocused();
    await page.keyboard.press("Space");
    await expect(form(page).getByRole("radio", { name: "New evidence record" })).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await expect(fill).toBeFocused();
    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");
    await expect(page.locator("#resolutionDialog")).toBeVisible();
    // Escape closes as Close does: focus back on Review the change.
    await page.keyboard.press("Escape");
    await expect(page.locator("#resolutionDialog")).toBeHidden();
    await expect(reviewButton(page)).toBeFocused();
    await page.keyboard.press("Space");
    await expect(page.locator("#resolutionDialog")).toBeVisible();
    const tabTo = async (selector) => {
      for (let step = 0; step < 40 && !(await page.locator(selector).evaluate((node) => node === document.activeElement)); step += 1) await page.keyboard.press("Tab");
      await expect(page.locator(selector)).toBeFocused();
    };
    await tabTo("#resolutionConfirm");
    await page.keyboard.press("Space");
    await expect(page.locator("#resolutionConfirm")).toBeChecked();
    await tabTo("#resolutionCommit");
    await page.keyboard.press("Enter");
    await expect.poll(async () => (await pointersOf(page)).length).toBe(1);
    const id = pointerLines(page).getByRole("button", { name: "E1", exact: true });
    await expect(id).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(record(page, "E1")).toBeFocused();
  });

  test("Arabic and French: the fold, the form, the pointer and a refusal in their words, right to left in Arabic", async ({ page }) => {
    await promotableCase(page);
    await fillE1(page);
    await page.locator("#langFr").click();
    await expect(pointerLines(page)).toHaveText(["Preuve E1 (révision 2)"]);
    await fold(page).getByRole("button", { name: "En faire une preuve" }).click();
    await expect(form(page).getByRole("radio", { name: "Nouvelle fiche de preuve" })).toBeFocused();
    await expect(form(page).getByRole("button", { name: "Examiner la modification" })).toBeVisible();
    await expect(form(page).getByRole("button", { name: "Annuler" })).toBeVisible();
    await fillStrategic(page);
    await inCase(page, "differs");
    await form(page).getByRole("button", { name: "Examiner la modification" }).click();
    await expect(refusal(page)).toHaveText("L’extrait a changé ou n’est plus conforme à sa source. Vérifiez-le à nouveau.");
    await page.locator("#langAr").click();
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    // Right to left from the page's own direction: nothing in the fold sets one.
    expect(await fold(page).evaluate((node) => node.closest("[dir]").tagName)).toBe("HTML");
    for (const part of [pointerLines(page), form(page).locator("label").first()]) expect(await part.evaluate((node) => getComputedStyle(node).direction)).toBe("rtl");
    await expect(pointerLines(page)).toHaveText(["الدليل E1 (النسخة 2)"]);
    await expect(form(page)).toHaveAttribute("aria-label", "اجعله دليلًا");
    await expect(form(page).getByRole("radio", { name: "سجل دليل جديد" })).toBeChecked();
    await expect(form(page).getByRole("button", { name: "راجع التغيير" })).toBeVisible();
    await expect(refusal(page)).toHaveText("تغيّر المقتطف أو لم يعد يطابق مصدره. تحقّق منه من جديد.");
    expect(await field(page, "uncertainty").inputValue()).toBe("One survey year only.");
  });

  test("forced colours keep the form, its controls and the pointer visible and focus outlined", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "chromium", "Forced colours are emulated in Chromium only.");
    await promotableCase(page);
    await page.emulateMedia({ forcedColors: "active" });
    expect(await page.evaluate(() => matchMedia("(forced-colors: active)").matches)).toBe(true);
    await openForm(page);
    for (const control of [form(page).getByRole("radio", { name: "Fill E1 from your source" }), reviewButton(page), form(page).getByRole("button", { name: "Cancel" })]) await expect(control).toBeVisible();
    await reviewButton(page).focus();
    expect(await reviewButton(page).evaluate((node) => getComputedStyle(node).outlineStyle)).not.toBe("none");
    await form(page).getByRole("radio", { name: "Fill E1 from your source" }).check();
    await reviewChange(page);
    await confirmChange(page);
    const id = pointerLines(page).getByRole("button", { name: "E1", exact: true });
    await expect(id).toBeFocused();
    expect(await id.evaluate((node) => getComputedStyle(node).outlineStyle)).not.toBe("none");
    // The id is drawn in the link colour, not in the colour it is drawn on:
    // the first background behind it that is not transparent.
    const colours = await id.evaluate((node) => {
      const clear = (value) => value === "transparent" || /^rgba\(.*,\s*0\)$/.test(value);
      let behind = "";
      for (let at = node.parentElement; at && !behind; at = at.parentElement) {
        const value = getComputedStyle(at).backgroundColor;
        if (!clear(value)) behind = value;
      }
      const link = document.createElement("span");
      link.style.color = "LinkText";
      node.parentElement.append(link);
      const linkText = getComputedStyle(link).color;
      link.remove();
      return { own: getComputedStyle(node).color, behind: behind || getComputedStyle(document.documentElement).backgroundColor, linkText };
    });
    expect(colours.own).toBe(colours.linkText);
    expect(colours.own).not.toBe(colours.behind);
  });

  test("Fill is offered only while the source relates to the record: its title and link edited away close the form, which says why", async ({ page }) => {
    await promotableCase(page);
    await openForm(page);
    await form(page).getByRole("radio", { name: "Fill E1 from your source" }).check();
    // In the topic step the source becomes another report: E1 relates to it
    // by neither link nor title.
    await openStep(page, "topic");
    const row = sourceRows(page).first();
    await row.locator(':scope > .j-flow-row > [data-source-action="edit-source"]').click();
    const edit = row.locator('[data-source-form="edit"]');
    await edit.locator('[data-source-field="title"]').fill("A wholly different report");
    await edit.locator('[data-source-field="url"]').fill("https://example.org/other");
    await edit.locator('[data-source-action="save-source"]').click();
    await expect(foldRows(page).first()).toContainText("No evidence here has this link or title");
    const words = "Your source is no longer related to E1.";
    await expect(form(page)).toHaveCount(0);
    await expect(refusal(page)).toHaveText(words);
    await expect(makeIt(page)).toHaveAccessibleDescription(words);
    // Opened again: only a new record.
    await openForm(page);
    await expect(choices(page)).toHaveText(["New evidence record"]);
    expect(await pointersOf(page)).toEqual([]);
  });

  test("Fill is read again at Confirm: the source's title changed in another tab so that it no longer relates to E1 is refused, nothing committed", async ({ page }) => {
    await promotableCase(page);
    await openForm(page);
    await form(page).getByRole("radio", { name: "Fill E1 from your source" }).check();
    await reviewChange(page);
    const before = await readFirstWorkspace(page);
    await inCase(page, "title");
    await confirmChange(page);
    await expect(page.locator("#resolutionStatus")).toHaveText("Your source is no longer related to E1.");
    await expect(page.locator("#resolutionDialog")).toBeVisible();
    expect(await focusedIn(page, "#resolutionDialog")).toBe(true);
    expect(JSON.stringify(await readFirstWorkspace(page))).toBe(JSON.stringify(before));
    expect(await pointersOf(page)).toEqual([]);
  });

  test("after a commit, focus the analyst moved meanwhile, even within the fold, stays there once the pointer is written", async ({ page }) => {
    await promotableCase(page);
    await openForm(page);
    await form(page).getByRole("radio", { name: "Fill E1 from your source" }).check();
    await reviewChange(page);
    await holdCaseWrites(page);
    await confirmChange(page);
    await expect(page.locator("#resolutionBackdrop")).not.toHaveClass(/show/);
    // Stored, but the page has not heard so yet.
    await expect.poll(async () => (await pointersOf(page)).length).toBe(1);
    await expect(pointerLines(page)).toHaveCount(0);
    await openFold(page);
    const title = fold(page).getByRole("link", { name: STRATEGIC_TITLE });
    await title.focus();
    await page.evaluate(() => window.__releaseCaseWrites());
    await expect(pointerLines(page)).toHaveText(["Evidence E1 (revision 2)"]);
    await expect(title).toBeFocused();
  });

  test("while a pointer is being saved its excerpt offers nothing, so a second promotion cannot take its place", async ({ page }) => {
    await promotableCase(page);
    await openForm(page);
    await form(page).getByRole("radio", { name: "Fill E1 from your source" }).check();
    await reviewChange(page);
    await holdCaseWrites(page);
    await confirmChange(page);
    await expect(page.locator("#resolutionBackdrop")).not.toHaveClass(/show/);
    await expect.poll(async () => (await pointersOf(page)).length).toBe(1);
    // The case file drawn again while the page has not heard of the save:
    // the excerpt offers neither the form nor Make it evidence.
    await switchLanguageQuietly(page, "langFr");
    await switchLanguageQuietly(page, "langEn");
    await openFold(page);
    await expect(fold(page).locator("[data-case-source-row]").first()).toBeVisible();
    await expect(makeIt(page)).toHaveCount(0);
    await expect(form(page)).toHaveCount(0);
    await page.evaluate(() => window.__releaseCaseWrites());
    await expect(pointerLines(page)).toHaveText(["Evidence E1 (revision 2)"]);
    await expect(makeIt(page)).toBeVisible();
  });

  test("a framing save writes what the analyst changed: never another tab's newer change, nor what code put in a field", async ({ page }) => {
    const topic = page.locator("#topicInput");
    const stored = async () => (await readCases(page))[0].framing;
    await start(page);
    await topic.fill("Asked here");
    await page.locator("#timeframeInput").fill("2020");
    // The first source makes the case, with the question on screen.
    const row = await addSource(page, STRATEGIC_TITLE, "https://example.org/report");
    await expect.poll(async () => (await readCases(page))[0]?.framing.question).toBe("Asked here");
    // Another tab changes the framing; this tab's next writes are made again on it.
    await reframeElsewhere(page, { question: "Asked in tab B", timeframe: "2021", limits: ["Limits from tab B"] });
    await addCheckedExcerpt(row, EXCERPT, "p. 12", "Compared with the printed table.");
    await openCaseFold(page);
    await outOfScope(page).fill("Only here");
    await expect.poll(async () => (await stored()).scope_out).toEqual(["Only here"]);
    expect(await stored()).toMatchObject({ question: "Asked in tab B", timeframe: "2021", limits: ["Limits from tab B"] });
    // Typed by the analyst, a question is saved, even one this tab last read
    // from the case and another tab has changed since.
    await reframeElsewhere(page, { question: "Asked in tab C" });
    await topic.fill("Asked in tab B");
    await expect.poll(async () => (await stored()).question).toBe("Asked in tab B");

    // A commit puts the case's own question and timeframe in their fields:
    // code wrote them, so a later save does not put them over a newer change.
    await reframeElsewhere(page, { question: "Asked in tab D", timeframe: "2023" });
    await importAnswer(page, "en");
    await expect.poll(async () => (await readCases(page))[0]?.analyses.length).toBe(1);
    await fold(page).locator(":scope > summary").click();
    await fillE1(page);
    await expect(topic).toHaveValue("Asked in tab D");
    await expect(page.locator("#timeframeInput")).toHaveValue("2023");
    await reframeElsewhere(page, { question: "Asked in tab E", timeframe: "2024" });
    await openStep(page, "topic");
    await openCaseFold(page);
    await outOfScope(page).fill("Only here\nAnd here");
    await expect.poll(async () => (await stored()).scope_out).toEqual(["Only here", "And here"]);
    expect(await stored()).toMatchObject({ question: "Asked in tab E", timeframe: "2024", limits: ["Limits from tab B"] });
  });

  test("a question typed while its save is under way stays on screen through a commit, and a later save keeps another tab's newer one", async ({ page }) => {
    const topic = page.locator("#topicInput");
    await promotableCase(page);
    await openStep(page, "topic");
    await holdCaseWrites(page);
    await topic.fill("Typed while saving");
    // Stored, and the page has not heard of it yet.
    await expect.poll(async () => (await readCases(page))[0].framing.question).toBe("Typed while saving");
    await page.locator("#reviewNavShortcut").click();
    await openFold(page);
    await openForm(page);
    await form(page).getByRole("radio", { name: "Fill E1 from your source" }).check();
    await reviewChange(page);
    await confirmChange(page);
    await expect(page.locator("#resolutionBackdrop")).not.toHaveClass(/show/);
    await expect(topic).toHaveValue("Typed while saving");
    await page.evaluate(() => window.__releaseCaseWrites());
    await expect(pointerLines(page)).toHaveText(["Evidence E1 (revision 2)"]);
    await reframeElsewhere(page, { question: "Asked in tab C" });
    await openStep(page, "topic");
    await openCaseFold(page);
    await outOfScope(page).fill("Only here");
    await expect.poll(async () => (await readCases(page))[0].framing.scope_out).toEqual(["Only here"]);
    expect((await readCases(page))[0].framing.question).toBe("Asked in tab C");
  });

  test("an answer imported while a form is open on the analysis before leaves that form as it was", async ({ page }) => {
    await promotableCase(page);
    const first = (await readFirstWorkspace(page)).workspace_id;
    await openForm(page);
    await form(page).getByRole("radio", { name: "Fill E1 from your source" }).check();
    // The next answer for the case, whose E1 comes from another report.
    await importAnswer(page, "en", (answer) => { answer.evidence.items.find((item) => item.id === "E1").source_title = "Another report"; });
    await expect.poll(async () => (await readCases(page))[0].analyses.length).toBe(2);
    await openFold(page);
    await expect(form(page)).toHaveCount(0);
    await expect(refusal(page)).toHaveCount(0);
    // Back on the first answer, its E1 still from the source: the form as left.
    await page.locator("#workspaceSaveState").click();
    await page.locator(`[data-workspace-open="${first}"]`).click();
    await page.locator("#workspaceClose").click();
    await openFold(page);
    await expect(refusal(page)).toHaveCount(0);
    await expect(form(page).getByRole("radio", { name: "Fill E1 from your source" })).toBeChecked();
  });

  test("a case with no question keeps none when a commit shows the analysis title in its field, and after a reload", async ({ page }) => {
    await promotableCase(page);
    await fillE1(page);
    const shown = await page.locator("#topicInput").inputValue();
    expect(shown).not.toBe("");
    await openStep(page, "topic");
    await openCaseFold(page);
    await outOfScope(page).fill("Only here");
    await expect.poll(async () => (await readCases(page))[0].framing.scope_out).toEqual(["Only here"]);
    expect((await readCases(page))[0].framing.question).toBe("");
    await expect(page.locator("#topicInput")).toHaveValue(shown);
    // The tab's draft keeps the title on screen too; brought back, it is no edit.
    await page.reload();
    await expect(page.locator("#reviewPanel")).toBeVisible();
    await openStep(page, "topic");
    await expect(page.locator("#topicInput")).toHaveValue(shown);
    await openCaseFold(page);
    await page.getByLabel("Limits of this research", { exact: true }).fill("One survey year");
    await expect.poll(async () => (await readCases(page))[0].framing.limits).toEqual(["One survey year"]);
    expect((await readCases(page))[0].framing.question).toBe("");
  });

  test("a form whose case loses its last source closes, and the fold says why once it is drawn again", async ({ page }) => {
    await promotableCase(page);
    await openForm(page);
    await fillStrategic(page);
    await openStep(page, "topic");
    const remove = sourceRows(page).first().locator(':scope > .j-flow-row > [data-source-action="remove-source"]');
    await remove.click();
    await remove.click();
    // A case with no source keeps none in its record (its lowest shape).
    await expect.poll(async () => (await readCases(page))[0].sources?.length ?? 0).toBe(0);
    await expect(fold(page)).toHaveCount(0);
    // A new source: the fold is back, and says what became of the form.
    await addSource(page, "Field notes");
    await openFold(page);
    const lost = fold(page).locator("[data-promote-lost]");
    await expect(lost.locator(".j-done-text")).toHaveText([EXCERPT]);
    await expect(lost.locator("[data-promote-refusal]")).toHaveText("This excerpt is no longer in the case.");
    await expect(form(page)).toHaveCount(0);
  });

  test("at 320px a pointer not saved for an id of 200 characters wraps, on its excerpt and once the excerpt is gone", async ({ page }) => {
    await promotableCase(page, { mutate: withLongId });
    await page.setViewportSize({ width: 320, height: 720 });
    await openForm(page);
    await expect(choices(page)).toHaveText([`Fill ${LONG_ID} from your source`]);
    await reviewChange(page);
    await refuseCaseWrites(page, true);
    await confirmChange(page);
    const saying = `${LONG_ID} is in the analysis. This case could not save it.`;
    await expect(foldRows(page).first().locator("[data-promote-unsaved]")).toContainText(saying);
    await expectNoSidewaysScroll(page);
    await refuseCaseWrites(page, false);
    await openStep(page, "topic");
    const excerpt = sourceRows(page).first().locator("[data-excerpt-row]").first();
    await excerpt.locator('[data-source-action="remove-excerpt"]').click();
    await excerpt.locator('[data-source-action="remove-excerpt"]').click();
    await expect(fold(page).locator("[data-promote-lost] [data-promote-unsaved]")).toContainText(saying);
    await expectNoSidewaysScroll(page);
  });

  test("at 320px an evidence id of 200 characters wraps in a Biopolitical case file, its reference chips and its Connections view", async ({ page }) => {
    await start(page);
    await page.setViewportSize({ width: 320, height: 720 });
    await importAnswer(page, "bio-en", withLongId);
    // The id is on screen in a record's heading and in chips that cite it.
    const shown = (selector) => page.locator(selector).evaluateAll((nodes, id) => nodes.filter((node) => node.textContent.includes(id) && node.getClientRects().length).length, LONG_ID);
    expect(await shown(".j-rec-id")).toBeGreaterThan(0);
    expect(await shown(".j-ref .j-ref-id")).toBeGreaterThan(0);
    await expect.poll(() => pageOverflow(page)).toBeLessThanOrEqual(0);
    // In the Connections view the record is in the middle; then a neighbour
    // is, with the record among its connections.
    const connections = page.locator('#reviewNav [data-bio-review="connections"]');
    await connections.focus();
    await connections.press("Enter");
    await expect(page.locator("#connMap")).toBeVisible();
    await page.locator("#connFocus").selectOption(LONG_ID);
    await expect(page.locator("#connCentre code")).toHaveText(LONG_ID);
    await expect.poll(() => pageOverflow(page)).toBeLessThanOrEqual(0);
    await page.locator("#connectionsView .j-conn-node").first().click();
    await expect(page.locator("#connFocus")).not.toHaveValue(LONG_ID);
    await page.locator("#connectionsView").evaluate((view) => { for (const fold of view.querySelectorAll("details")) fold.open = true; });
    expect(await shown("#connectionsView .j-conn-node code")).toBeGreaterThan(0);
    await expect.poll(() => pageOverflow(page)).toBeLessThanOrEqual(0);
  });
});
