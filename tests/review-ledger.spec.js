import { test, expect } from "@playwright/test";
import fs from "node:fs/promises";

async function openLedger(page) {
  await page.goto("/");
  await page.evaluate(() => new Promise((resolve) => {
    const request = indexedDB.deleteDatabase("jarbou3i-model-workspaces");
    request.onsuccess = request.onerror = request.onblocked = () => resolve();
  }));
  await page.reload();
  await page.locator("#langEn").click();
  await page.locator("#loadSampleBtn").click();
  await page.locator('[data-review="inspection"]').click();
  const intelligence = page.locator("[data-evidence-intelligence]");
  await intelligence.locator("summary").click();
  await expect(page.locator("#openReviewLedger")).toBeEnabled();
  await page.locator("#openReviewLedger").click();
  await expect(page.locator("#ledgerDialog")).toBeVisible();
  await page.locator("#ledgerReviewer").fill("Release Reviewer");
}

async function append(page, action, rationale) {
  await page.locator("#ledgerAction").selectOption(action);
  await page.locator("#ledgerRationale").fill(rationale);
  await page.locator("#ledgerApply").click();
  await expect(page.locator("#ledgerStatus")).toContainText(/integrity verified/i);
  await expect(page.locator("#ledgerApply")).toBeEnabled();
}

test.describe("Operational review ledger", () => {
  test("records start, note, completion, identity, and persistence", async ({ page }) => {
    await openLedger(page);
    await expect(page.locator("#ledgerSelectedTask")).toContainText("Pending");
    await append(page, "task_started", "Review ownership accepted for provenance verification.");
    await expect(page.locator("#ledgerSelectedTask")).toContainText("In review");
    await append(page, "note_added", "Archive catalogue located; stable locator checked.");
    await append(page, "task_completed", "Source identity, locator, and claim fit verified.");
    await expect(page.locator("#ledgerSelectedTask")).toContainText("Completed");
    await page.locator("#ledgerHistorySummary").click();
    await expect(page.locator("#ledgerHistory")).toContainText("Release Reviewer");
    await expect(page.locator("#ledgerHistory")).toContainText("Add note");
    await page.locator("#ledgerClose").click();
    await page.reload();
    await page.locator("#langEn").click();
    await page.locator('[data-review="inspection"]').click();
    await page.locator("[data-evidence-intelligence] summary").click();
    await page.locator("#openReviewLedger").click();
    await expect(page.locator("#ledgerSelectedTask")).toContainText("Completed");
    await expect(page.locator("#ledgerTrust")).toContainText(/does not validate conclusions/i);
    await page.locator("#ledgerClose").click();
    await page.locator("#workspaceBtn").click();
    await page.locator(".workspaceRow.active [data-workspace-edit]").click();
    await page.locator('[data-editor-path="/subject"]').click();
    const field = page.locator("#editorField");
    const subject = JSON.parse(await field.inputValue());
    subject.title = `${subject.title} revised after review`;
    await field.fill(JSON.stringify(subject));
    await field.press("Control+Enter");
    await page.locator("#editorSave").click();
    await page.locator("#editorClose").click();
    await page.locator('[data-review="inspection"]').click();
    await page.locator("[data-evidence-intelligence] summary").click();
    await page.locator("#openReviewLedger").click();
    await expect(page.locator("#ledgerSelectedTask")).toContainText("Completed");
    await expect(page.locator("#ledgerTaskList .ledgerStatus.stale").first()).toContainText(/Stale after draft change/i);
  });

  test("records a bounded waiver, reopens it, and exports the hash chain", async ({ page }) => {
    await openLedger(page);
    await page.locator("#ledgerAction").selectOption("task_waived");
    await page.locator("#ledgerRationale").fill("Internal review may proceed while archive access is unavailable.");
    await page.locator("#ledgerWaiverScope").fill("Internal review export only");
    await page.locator("#ledgerWaiverRisk").fill("Citation cannot yet be independently opened");
    await page.locator("#ledgerWaiverExpiry").fill("2026-08-22T12:00");
    await page.locator("#ledgerApply").click();
    await expect(page.locator("#ledgerSelectedTask")).toContainText("Waived");
    await append(page, "task_reopened", "Archive access restored; verification resumes.");
    await expect(page.locator("#ledgerSelectedTask")).toContainText("In review");
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.locator("#ledgerExport").click(),
    ]);
    const manifest = JSON.parse(await fs.readFile(await download.path(), "utf8"));
    expect(manifest.format).toBe("jarbou3i-operational-review-ledger");
    expect(manifest.identity_assurance).toBe("local_assertion");
    expect(manifest.completion_validates_conclusions).toBe(false);
    expect(manifest.event_count).toBe(2);
    expect(manifest.events[0].type).toBe("task_waived");
    expect(manifest.events[0].waiver).toEqual(expect.objectContaining({
      scope: "Internal review export only",
      accepted_risk: "Citation cannot yet be independently opened",
    }));
    expect(manifest.events[1].previous_event_hash).toBe(manifest.events[0].event_hash);
    expect(manifest.head_event_hash).toBe(manifest.events[1].event_hash);
  });
});
