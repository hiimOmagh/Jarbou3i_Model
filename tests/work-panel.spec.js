import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { clearWorkspaceStorage, countRecoverySnapshots, damageFirstWorkspace } from "./helpers/browser-persistence.js";
import { openStep } from "./helpers/guided-flow.js";
import { expectKernel } from "./helpers/kernel-check.js";

// The work panel (UX-0, ADR-0002): the save light says where the work is and
// opens "Where your work is"; banners raise what needs a decision.
const light = (page) => page.locator("#workspaceSaveState");

async function openEditor(page) {
  await light(page).click();
  await page.locator("#workLife").getByRole("button", { name: "Edit draft" }).click();
}

async function setTitle(page, title) {
  await page.locator('[data-editor-path="/subject"]').click();
  const field = page.locator("#editorField");
  const subject = JSON.parse(await field.inputValue());
  subject.title = title;
  await field.fill(JSON.stringify(subject, null, 2));
  await field.press("Control+Enter");
  await expect(page.locator("#editorDirty")).toContainText("Unsaved");
}

async function editTitle(page, title) {
  await openEditor(page);
  await setTitle(page, title);
}

// Unsaved editor edits, caught by the recovery journal and cut off by a reload.
async function interruptEdit(page, title) {
  await editTitle(page, title);
  await expect.poll(() => countRecoverySnapshots(page)).toBe(1);
  page.once("dialog", (dialog) => dialog.accept());
  await page.reload();
}

test.describe("Work panel", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("./");
    await clearWorkspaceStorage(page);
    await page.reload();
    await page.locator("#langEn").click();
  });

  test("the save light opens where the work is", async ({ page }) => {
    await expect(light(page)).toHaveText("No saved workspace");
    await page.locator("#loadSampleBtn").click();
    await expect(light(page)).toHaveText("Saved locally");
    await expect(light(page)).toHaveAttribute("aria-label", "Where your work is: Saved locally");
    await light(page).click();
    await expect(page.locator("#workspaceDialogTitle")).toHaveText("Where your work is");
    const panel = page.locator("#workLife");
    await expect(panel.locator(".j-life-card")).toHaveCount(3);
    await expect(panel).toContainText("None. No unsaved work was interrupted.");
    await expect(panel).toContainText("Matches revision 1, the current version.");
    await expect(panel.locator(".j-life-revs li")).toHaveCount(1);
    await expect(panel.locator(".j-life-revs li")).toContainText("Current version");
    await panel.getByRole("button", { name: "Revision history" }).click();
    await expect(page.locator("#revisionDialog")).toBeVisible();
  });

  test("a saved draft that is not committed says so and leads to the commit", async ({ page }) => {
    await page.locator("#loadSampleBtn").click();
    await editTitle(page, "Work panel proof");
    await page.locator("#editorSave").click();
    await expect(page.locator("#editorDirty")).toContainText("No unsaved");
    await page.locator("#editorClose").click();
    await expect(light(page)).toHaveText("Not committed");
    await expect(light(page)).toHaveAttribute("data-life", "uncommitted");
    await light(page).click();
    await expect(page.locator("#workLife")).toContainText("Draft saved locally, not committed yet. Revision 1 is the current version.");
    await page.locator("#workLife").getByRole("button", { name: "Review and commit" }).click();
    await expect(page.locator("#resolutionDialog")).toBeVisible();
  });

  test("a recovery snapshot cut off by a reload is raised and restored in the editor", async ({ page }) => {
    await page.locator("#loadSampleBtn").click();
    await interruptEdit(page, "Recovered from the banner");
    const banner = page.locator('#lifeBanners [data-tone="warn"]');
    await expect(banner).toContainText("Unsaved recovery snapshot found");
    await expect(light(page)).toHaveText("Recovery found");
    await expect(light(page)).toHaveAttribute("data-life", "snapshot");
    await banner.getByRole("button", { name: "Restore snapshot" }).click();
    await expect(page.locator("#editorField")).toHaveValue(/"title": "Recovered from the banner"/);
    await expect(page.locator("#editorDirty")).toContainText("Unsaved");
  });

  test("discarding the recovery snapshot clears the banner and the light", async ({ page }) => {
    await page.locator("#loadSampleBtn").click();
    await interruptEdit(page, "Left behind");
    await light(page).click();
    await expect(page.locator("#workLife")).toContainText("Recovery found");
    await page.locator("#workLife").getByRole("button", { name: "Discard snapshot" }).click();
    await expect(page.locator("#workLife")).toContainText("None. No unsaved work was interrupted.");
    await expect(page.locator("#workspaceDialog")).toBeFocused();
    await expect(page.locator("#lifeBanners")).toBeHidden();
    await expect(light(page)).toHaveText("Saved locally");
  });

  test("edits discarded in the editor leave no recovery snapshot behind", async ({ page }) => {
    await page.locator("#loadSampleBtn").click();
    await editTitle(page, "Thrown away");
    await expect.poll(() => countRecoverySnapshots(page)).toBe(1);
    page.once("dialog", (dialog) => dialog.accept());
    await page.locator("#editorClose").click();
    await light(page).click();
    await page.locator("#workLife").getByRole("button", { name: "Edit draft" }).click();
    await expect(page.locator("#editorDialog")).toBeFocused();
    await expect(page.locator("#editorRecovery")).toBeHidden();
    await page.locator("#editorClose").click();
    await expect(light(page)).toHaveText("Saved locally");
  });

  test("an edit still open in another tab is not offered as a recovery snapshot", async ({ page, context }) => {
    await page.locator("#loadSampleBtn").click();
    await editTitle(page, "Typed in the first tab");
    await expect.poll(() => countRecoverySnapshots(page)).toBe(1);
    const other = await context.newPage();
    await other.goto("./");
    await openEditor(other);
    await expect(other.locator("#editorRecovery")).toBeHidden();
    await expect(other.locator('[data-editor-path="/subject"]')).toBeEnabled();
    await other.locator("#editorClose").click();
    // Once that tab has closed, what it left is offered.
    await page.close();
    // Its lock goes with it, a moment later: then only this tab's own is held.
    await expect.poll(() => other.evaluate(async () => (await navigator.locks.query()).held
      .filter((lock) => lock.name.startsWith("intake-draft:")).length)).toBe(1);
    await other.reload();
    await expect(light(other)).toHaveAttribute("data-life", "snapshot");
  });

  test("a save another tab got to first is raised until the workspace is reopened", async ({ page, context }) => {
    await page.locator("#loadSampleBtn").click();
    await expect(light(page)).toHaveText("Saved locally");
    // Opened before the other tab saves, edited after: the recovery journal is
    // shared, so earlier edits here would reach the other tab as a snapshot.
    await openEditor(page);
    const other = await context.newPage();
    await other.goto("./");
    await other.locator("#langEn").click();
    await editTitle(other, "Saved in the other tab");
    await other.locator("#editorSave").click();
    await expect(other.locator("#editorDirty")).toContainText("No unsaved");
    await other.close();

    await setTitle(page, "Edited in this tab");
    await page.locator("#editorSave").click();
    await expect(page.locator("#editorFieldStatus")).toContainText("changed in another tab");
    page.once("dialog", (dialog) => dialog.accept());
    await page.locator("#editorClose").click();
    await expect(light(page)).toHaveText("Conflict");
    await expect(light(page)).toHaveAttribute("data-life", "conflict");
    const banner = page.locator('#lifeBanners [data-tone="crit"]');
    await expect(banner).toContainText("This workspace changed in another tab or window.");
    await banner.getByRole("button", { name: "Reopen workspace" }).click();
    await expect(page.locator("#topicInput")).toHaveValue("Saved in the other tab");
    await expect(light(page)).toHaveText("Not committed");
    await expect(page.locator("#lifeBanners")).toBeHidden();
    await expect(light(page)).toBeFocused();
  });

  test("a damaged workspace is raised with a way to review it", async ({ page }) => {
    await page.locator("#loadSampleBtn").click();
    await expect(light(page)).toHaveText("Saved locally");
    await damageFirstWorkspace(page);
    await page.reload();
    const banner = page.locator('#lifeBanners [data-tone="crit"]');
    await expect(banner).toContainText("One saved workspace failed its integrity check.");
    await banner.getByRole("button", { name: "Review workspaces" }).click();
    await expect(page.locator("#workspaceDialog")).toBeFocused();
    await expect(page.locator("[data-workspace-row][data-state=damaged]")).toHaveCount(1);
  });

  test("says when the device is offline", async ({ page, context }) => {
    await context.setOffline(true);
    await expect(page.locator("#lifeBanners")).toContainText("You are offline.");
    await context.setOffline(false);
    await expect(page.locator("#lifeBanners")).toBeHidden();
  });

  test("speaks the page language and keeps its contracts and contrast", async ({ page }) => {
    await page.locator("#langAr").click();
    await page.locator("#loadSampleBtn").click();
    await expect(light(page)).toHaveAttribute("aria-label", "أين عملك: محفوظ محليًا");
    await light(page).click();
    await expect(page.locator("#workspaceDialogTitle")).toHaveText("أين عملك");
    await expect(page.locator("#workLife")).toContainText("تطابق النسخة 1، وهي النسخة الحالية.");
    const problems = await page.evaluate(async () => {
      const { checkContracts } = await import("./src/ui/contracts.js");
      return [document.getElementById("workLife"), document.querySelector(".j-shell-cluster")].flatMap((root) => checkContracts(root));
    });
    expect(problems).toEqual([]);
    // The whole panel, its restore-file input included.
    const { violations } = await new AxeBuilder({ page }).include("#workspaceDialog").include("#workspaceSaveState").analyze();
    const serious = violations.filter((violation) => ["serious", "critical"].includes(violation.impact));
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
  });

  test("the workspace list and its actions keep their contracts and read in both themes", async ({ page }) => {
    await page.locator("#loadSampleBtn").click();
    await openStep(page, "lens");
    await page.locator('[data-lens="biopolitical"]').click();
    await page.locator("#loadSampleBtn").click();
    await light(page).click();
    await expect(page.locator("[data-workspace-row]")).toHaveCount(2);
    await expect(page.locator("[data-workspace-row][aria-current=true]")).toHaveCount(1);
    await expect(page.locator("#workspaceResetAll")).toHaveAttribute("data-variant", "danger");
    // Rows under rules, not boxes; the open one has nothing to do; the resets come last.
    await expect(page.locator("[data-workspace-row][aria-current=true] button")).toHaveCount(0);
    await expect(page.locator("[data-workspace-row]:not([aria-current]) [data-workspace-open]")).toBeEnabled();
    const layout = await page.evaluate(() => {
      const edges = (element) => { const style = getComputedStyle(element); return { top: style.borderTopWidth, side: style.borderLeftWidth, wash: style.backgroundColor }; };
      const list = document.getElementById("workspaceList");
      return {
        section: getComputedStyle(document.querySelector(".j-ws")).borderTopWidth,
        open: edges(list.querySelector("[aria-current=true]")),
        other: edges(list.querySelector("[data-workspace-row]:not([aria-current])")),
        resetsLast: Boolean(list.compareDocumentPosition(document.getElementById("workspaceResetCurrent")) & Node.DOCUMENT_POSITION_FOLLOWING),
      };
    });
    expect(layout).toEqual({
      section: "3px",
      open: { top: "2px", side: "0px", wash: "rgba(0, 0, 0, 0)" },
      other: { top: "1px", side: "0px", wash: "rgba(0, 0, 0, 0)" },
      resetsLast: true,
    });
    await expectKernel(page, "#workspaceBackdrop", "#workspaceDialog");
  });
});
