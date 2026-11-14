import { test, expect } from "@playwright/test";

async function saveThenReturn(page, firstVisit = false) {
  await page.goto("./");
  await page.locator("#loadSampleBtn").click();
  await expect(page.locator("#workspaceSaveState")).toHaveAttribute("data-state", "saved");
  await page.evaluate((first) => {
    localStorage.clear();
    sessionStorage.clear();
    if (!first) localStorage.setItem("jarbou3i-ride", "seen");
  }, firstVisit);
  await page.reload();
}

test("the topic step reopens saved work and returns focus to its button", async ({ page }) => {
  await saveThenReturn(page);
  const resume = page.locator(".j-resume-work");
  await expect(resume).toBeVisible();
  await expect(page.locator("#topicCard .j-resume-work")).toHaveCount(1);
  await expect(page.locator("#firstRide .j-resume-work")).toHaveCount(0);
  await expect(page.locator('label[for="topicInput"] + textarea')).toBeVisible();
  for (const lang of ["En", "Fr", "Ar"]) {
    await page.locator(`#lang${lang}`).click();
    await expect(resume).not.toHaveText("");
  }
  await resume.click();
  await expect(page.locator("#workspaceDialog")).toBeVisible();
  await expect(page.locator("[data-workspace-row]")).toHaveCount(1);
  await page.locator("#workspaceClose").click();
  await expect(resume).toBeFocused();
});

test("leaving the first-visit route map keeps the saved-work button available", async ({ page }) => {
  await saveThenReturn(page, true);
  await expect(page.locator("#firstRide")).toBeVisible();
  await expect(page.locator(".j-resume-work")).toBeVisible();
  await page.locator("#rideStart").click();
  await expect(page.locator("#firstRide")).toBeHidden();
  await expect(page.locator(".j-resume-work")).toBeVisible();
  await page.locator(".j-resume-work").click();
  await expect(page.locator("#workspaceDialog")).toBeVisible();
});

test("the saved-work button stays hidden when nothing is saved", async ({ page }) => {
  await page.goto("./");
  await page.waitForFunction(() => Boolean(window.Jarbou3iPlatformDiagnostics));
  await expect(page.locator(".j-resume-work")).toHaveCount(1);
  await expect(page.locator(".j-resume-work")).toBeHidden();
  await page.locator("#rideOpen").click();
  await page.locator("#rideSkip").click();
  await expect(page.locator("#firstRide")).toBeHidden();
  await expect(page.locator(".j-resume-work")).toBeHidden();
});
