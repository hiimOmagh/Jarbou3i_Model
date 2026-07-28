import { test, expect } from "@playwright/test";
import {
  beginLongPersistenceWorkflow,
  clearWorkspaceStorage,
  readFirstWorkspace,
} from "./helpers/browser-persistence.js";

async function start(page, lens = "strategic") {
  await page.goto("./");
  await clearWorkspaceStorage(page);
  await page.reload();
  await page.locator("#langEn").click();
  if (lens === "biopolitical") await page.locator('[data-lens="biopolitical"]').click();
  await page.locator("#loadSampleBtn").click();
}

async function openEditor(page) {
  await page.locator("#workspaceBtn").click();
  await page.getByRole("button", { name: "Edit draft" }).click();
  await page.locator('[data-editor-path="/subject"]').click();
}

async function saveTitle(page, title) {
  const field = page.locator("#editorField");
  const subject = JSON.parse(await field.inputValue());
  subject.title = title;
  await field.fill(JSON.stringify(subject, null, 2));
  await field.press("Control+Enter");
  await page.locator("#editorSave").click();
  await expect(page.locator("#editorResolve")).toBeEnabled();
}

async function approveOpenTransaction(page, rationale) {
  await page.locator("#resolutionReviewer").fill("Revision Reviewer");
  await page.locator("#resolutionRationale").fill(rationale);
  await page.locator("#resolutionConfirm").check();
  await expect(page.locator("#resolutionCommit")).toBeEnabled();
  await page.locator("#resolutionCommit").click();
  await expect(page.locator("#resolutionBackdrop")).not.toHaveClass(/show/);
}

async function commitTitle(page, title) {
  await openEditor(page);
  await saveTitle(page, title);
  await page.locator("#editorResolve").click();
  await approveOpenTransaction(page, `Approve ${title} after exact diff review.`);
}

async function storedWorkspace(page) {
  return readFirstWorkspace(page);
}

test.describe("Revision history and safe restore", () => {
  test("compares history and restores a Strategic revision as a reviewed immutable child", async ({ page }) => {
    await start(page);
    const importedTitle = await page.locator("#topicInput").inputValue();
    await commitTitle(page, "Current head before safe restore");

    await page.locator("#workspaceBtn").click();
    await page.getByRole("button", { name: "Revision history" }).click();
    await expect(page.locator("#revisionDialog")).toBeVisible();
    await expect(page.locator("#revisionTrust")).toContainText(/never overwrites|never.*backward/i);
    await expect(page.locator("#revisionCount")).toHaveText("2 revisions");
    await expect(page.locator(".revisionItem")).toHaveCount(2);
    await expect(page.locator(".revisionItem.active")).toContainText("Imported");
    await expect(page.locator("#revisionDiff")).toContainText("/subject/title");
    await expect(page.locator("#revisionRestore")).toBeEnabled();

    await page.locator("#revisionRestore").click();
    await expect(page.locator("#resolutionDialog")).toBeVisible();
    await expect(page.locator("#resolutionTitle")).toHaveText("Safe revision restore");
    await expect(page.locator("#resolutionTrust")).toContainText(/new immutable child/i);
    await expect(page.locator("#resolutionSummary")).toContainText("Historical source");
    await expect(page.locator("#resolutionDiff")).toContainText(importedTitle);
    await approveOpenTransaction(page, "Restore the imported state after reviewing every canonical change.");

    await expect(page.locator("#topicInput")).toHaveValue(importedTitle);
    const stored = await storedWorkspace(page);
    expect(stored.revisions).toHaveLength(3);
    expect(stored.revisions[2].kind).toBe("restored_revision");
    expect(stored.revisions[2].parent_revision_id).toBe(stored.revisions[1].revision_id);
    expect(stored.revisions[2].restored_from_revision_id).toBe(stored.revisions[0].revision_id);
    expect(stored.revisions[2].payload_checksum).toBe(stored.revisions[0].payload_checksum);
    expect(stored.head_revision_id).toBe(stored.revisions[2].revision_id);
    expect(stored.resolution_ledger.records[1].transaction.source_revision_id).toBe(stored.revisions[0].revision_id);
    expect(stored.audit_events.at(-1).type).toBe("revision_restored");
  });

  test("blocks restore when a draft is dirty and localizes the read-only history workflow", async ({ page }, testInfo) => {
    const finishLongWorkflow = beginLongPersistenceWorkflow(
      testInfo,
      "revision-history-dirty-localization",
    );
    await start(page, "biopolitical");
    await commitTitle(page, "Committed biopolitical head");
    await openEditor(page);
    await saveTitle(page, "Uncommitted biopolitical draft");
    await page.locator("#editorClose").click();

    await page.locator("#langAr").click();
    await page.locator("#workspaceBtn").click();
    await page.getByRole("button", { name: "سجل النسخ" }).click();
    await expect(page.locator("#revisionTitle")).toHaveText("سجل النسخ");
    await expect(page.locator("#revisionBlocked")).toContainText("مسودة العمل");
    await expect(page.locator("#revisionRestore")).toBeDisabled();

    await page.locator("#revisionClose").click();
    await page.locator("#langFr").click();
    await page.locator("#workspaceBtn").click();
    await page.getByRole("button", { name: "Historique des révisions" }).click();
    await expect(page.locator("#revisionTitle")).toHaveText("Historique des révisions");
    await expect(page.locator("#revisionRestore")).toBeDisabled();

    const stored = await storedWorkspace(page);
    expect(stored.revisions).toHaveLength(2);
    expect(stored.head_revision_id).toBe(stored.revisions[1].revision_id);
    expect(stored.working_draft.dirty).toBe(true);
    await finishLongWorkflow();
  });
});
