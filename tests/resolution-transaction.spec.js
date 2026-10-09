import { test, expect } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";
import {
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
  await expect(page.locator("#editorSave")).toBeEnabled();
  await page.locator("#editorSave").click();
  await expect(page.locator("#editorResolve")).toBeEnabled();
}

async function approve(page, rationale) {
  await expect(page.locator("#resolutionDialog")).toBeVisible();
  await expect(page.locator("#resolutionTrust")).toContainText(/never rewrites/i);
  await expect(page.locator("#resolutionDiff")).toContainText("/subject/title");
  await expect(page.locator("#resolutionCommit")).toBeDisabled();
  await page.locator("#resolutionReviewer").fill("Resolution Reviewer");
  await page.locator("#resolutionRationale").fill(rationale);
  await expect(page.locator("#resolutionCommit")).toBeDisabled();
  await page.locator("#resolutionConfirm").check();
  await expect(page.locator("#resolutionCommit")).toBeEnabled();
  await page.locator("#resolutionCommit").click();
  await expect(page.locator("#resolutionBackdrop")).not.toHaveClass(/show/);
  await expect(page.locator("#workspaceSaveState")).toHaveText("Saved locally");
}

test.describe("Resolution transactions", () => {
  test("reviews an exact Strategic diff and commits an immutable child revision", async ({ page }) => {
    await start(page, "strategic");
    await saveTitle(page, "Committed strategic resolution");
    await page.locator("#editorResolve").click();
    await expect(page.locator("#resolutionSummary")).toContainText("Passed");
    await approve(page, "Approved after reviewing the exact Strategic subject diff.");
    await expect(page.locator("#topicInput")).toHaveValue("Committed strategic resolution");
    const stored = await readFirstWorkspace(page);
    expect(stored.revisions).toHaveLength(2);
    expect(stored.revisions[0].kind).toBe("imported_canonical");
    expect(stored.revisions[1].kind).toBe("committed_resolution");
    expect(stored.revisions[1].parent_revision_id).toBe(stored.revisions[0].revision_id);
    expect(stored.resolution_ledger.records).toHaveLength(1);
    expect(stored.resolution_ledger.records[0].diagnostics_after.contract_valid).toBe(true);
    expect(stored.working_draft.dirty).toBe(false);
    await page.reload();
    await expect(page.locator("#topicInput")).toHaveValue("Committed strategic resolution");
  });

  test("records a committed Strategic draft as a draft, never as a valid contract", async ({ page }) => {
    const draft = JSON.parse(await fs.readFile(path.join(process.cwd(), "fixtures", "sample-analysis-en.json"), "utf8"));
    delete draft.evidence.items[0].source_type;
    await page.goto("./");
    await clearWorkspaceStorage(page);
    await page.reload();
    await page.locator("#langEn").click();
    await page.locator("#jsonInput").fill(JSON.stringify(draft));
    await page.locator("#importBtn").click();
    await expect(page.locator("#jsonStatus")).toContainText(/draft/i);
    await page.locator("#workspaceBtn").click();
    await page.locator(".workspaceRow.active").getByRole("button", { name: "Edit draft" }).click();
    await page.locator('[data-editor-path="/subject"]').click();
    await saveTitle(page, "Committed strategic draft");
    await expect(page.locator("#editorFieldStatus")).toContainText(/draft/i);
    await expect(page.locator("#editorFieldStatus")).not.toContainText("Contract validation passed");
    await page.locator("#editorResolve").click();
    await expect(page.locator("#resolutionSummary")).toContainText("Draft");
    await expect(page.locator("#resolutionSummary")).not.toContainText("Passed");
    await approve(page, "Approved as a draft after reviewing the exact subject diff.");
    const stored = await readFirstWorkspace(page);
    expect(stored.resolution_ledger.records[0].diagnostics_after.contract_valid).toBe(false);
  });

  test("commits a Biopolitical draft from the verified workspace manager", async ({ page }) => {
    await start(page, "biopolitical");
    await saveTitle(page, "Committed biopolitical resolution");
    await page.locator("#editorClose").click();
    await page.locator("#workspaceBtn").click();
    await expect(page.locator(".workspaceRow.active")).toContainText("verified");
    await page.getByRole("button", { name: "Commit immutable revision" }).click();
    await approve(page, "Approved after full Biopolitical contract validation and exact diff review.");
    await expect(page.locator("#topicInput")).toHaveValue("Committed biopolitical resolution");
    await page.locator("#workspaceBtn").click();
    await expect(page.getByRole("button", { name: "Commit immutable revision" })).toHaveCount(0);
  });
});
