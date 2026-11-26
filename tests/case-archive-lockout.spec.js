import { execFileSync } from "node:child_process";
import { test, expect } from "@playwright/test";
import {
  deleteDatabase, installObservedIndexedDb, startUpgrade, upgradeDatabase as upgrade,
} from "./helpers/browser-persistence.js";

// Characterization, not a restore implementation. A fail-closed UI would
// deliberately invalidate the fallback counterexample below.
const paths = ["workspace-storage", "recovery-journal", "research-dossier"];
const factories = ["createIndexedDbWorkspaceBackend", "createIndexedDbRecoveryBackend", "createIndexedDbDossierBackend"];
const git = (...args) => execFileSync("git", args, { encoding: "utf8", maxBuffer: 8 * 1024 * 1024 }).trim();
// Enumerate every changed module on the base's ancestry, not unrelated branches.
// Dependencies stay at the base: this tests historical storage open paths, not
// historical whole applications. See the ADR's explicit UI coverage boundary.
const history = paths.flatMap((name, index) => {
  const file = `src/core/${name}.js`;
  return git("log", "--format=%H", "HEAD", "--", file).split("\n").map((sha) => ({
    sha, name, index, source: git("show", `${sha}:${file}`),
  }));
});

async function shell(page) {
  // No app connections: the real modules are imported explicitly by the test.
  await page.route("**/__lockout", (route) => route.fulfill({ contentType: "text/html", body: "<!doctype html><title>Lockout research</title>" }));
  await page.goto("/__lockout");
}

async function install(page, { name, index, source, sha = "current" }, ignore = false) {
  const url = `/src/core/__lockout-${sha}-${name}.js`;
  await installObservedIndexedDb(page);
  if (source) await page.route(`**${url}`, (route) => route.fulfill({ contentType: "text/javascript", body: source }));
  return page.evaluate(async ({ url, name, index, historical, factories, ignore }) => {
    const module = await import(historical ? url : `/src/core/${name}.js`);
    const databaseName = index === 2 ? "jarbou3i-model-dossiers" : "jarbou3i-model-workspaces";
    window.events = [];
    window.connections = [];
    window.backend = module[factories[index]]({ indexedDB: window.observedIndexedDb() });
    await backend.get("probe");
    if (ignore) for (const db of connections) db.onversionchange = null;
    return { databaseName, version: connections[0].version };
  }, { url, name, index, historical: Boolean(source), factories, ignore });
}

async function refused(page, index) {
  return page.evaluate(async (index) => {
    const result = [];
    for (const action of [() => backend.get("probe"),
      () => backend.put(index === 2 ? { dossier_id: "probe" } : { workspace_id: "probe" }),
      () => backend.delete("probe"), () => backend.clear ? backend.clear() : "ABSENT"]) {
      try { result.push(await action() === "ABSENT" ? "ABSENT" : "ALLOWED"); }
      catch (error) { result.push(error.cause?.name || error.name); }
    }
    return result;
  }, index);
}

for (const [index, name] of paths.entries()) {
  test(`${name}: existing and later old tabs refuse read/write/delete/clear after native upgrade`, async ({ page, context }) => {
    await shell(page);
    const opened = await install(page, { name, index });
    const newer = await context.newPage();
    await shell(newer);
    await upgrade(newer, opened.databaseName, opened.version);
    await expect.poll(() => page.evaluate(() => events)).toEqual([[opened.version, opened.version + 1]]);
    expect(await refused(page, index)).toEqual(Array(4).fill("VersionError"));
    const later = await context.newPage();
    await shell(later);
    // Install without opening first: the first old open itself must refuse.
    const error = await later.evaluate(async ({ name, index, factories }) => {
      window.backend = (await import(`/src/core/${name}.js`))[factories[index]]();
      try { await (index === 1 ? backend.keys() : backend.list()); return "ALLOWED"; }
      catch (error) { return error.cause?.name || error.name; }
    }, { name, index, factories });
    expect(error).toBe("VersionError");
    expect(await refused(later, index)).toEqual(Array(4).fill("VersionError"));
  });

  test(`${name}: ignoring versionchange blocks upgrade and leaves the old writer usable`, async ({ page, context }) => {
    await shell(page);
    const opened = await install(page, { name, index }, true);
    const newer = await context.newPage();
    await shell(newer);
    await startUpgrade(newer, opened.databaseName, opened.version);
    await expect.poll(() => newer.evaluate(() => window.state)).toBe("blocked");
    await expect.poll(() => page.evaluate(() => events)).toEqual([[opened.version, opened.version + 1]]);
    expect(await page.evaluate(async (index) => {
      const record = index === 2 ? { dossier_id: "still-writing" } : { workspace_id: "still-writing" };
      await backend.put(record);
      return backend.get("still-writing");
    }, index)).toEqual(index === 2 ? { dossier_id: "still-writing" } : { workspace_id: "still-writing" });
    await page.evaluate(() => connections.forEach((db) => db.close()));
    await expect.poll(() => newer.evaluate(() => window.state)).toBe("upgraded");
  });

  test(`${name}: deleteDatabase erases the version fence and old code recreates writable storage`, async ({ page }) => {
    await shell(page);
    const opened = await install(page, { name, index });
    await upgrade(page, opened.databaseName, opened.version);
    expect(await refused(page, index)).toEqual(Array(4).fill("VersionError"));
    await deleteDatabase(page, opened.databaseName);
    expect(await page.evaluate(async (index) => {
      await backend.put(index === 2 ? { dossier_id: "recreated" } : { workspace_id: "recreated" });
      await backend.clear();
      return index === 1 ? backend.keys() : backend.list();
    }, index)).toEqual([]);
  });
}

test("all historical storage-module revisions refuse a higher-version live database", async ({ page }) => {
  await shell(page);
  for (const snapshot of history) {
    await test.step(`${snapshot.sha} ${snapshot.name}`, async () => {
      const opened = await install(page, snapshot);
      await upgrade(page, opened.databaseName, opened.version);
      const results = await refused(page, snapshot.index);
      expect(results.slice(0, 3)).toEqual(Array(3).fill("VersionError"));
      expect(["VersionError", "ABSENT"]).toContain(results[3]);
      await deleteDatabase(page, opened.databaseName);
    });
  }
});

test("the old UI remains usable in memory after refusal; reset reports failure", async ({ page }) => {
  await shell(page);
  for (const [index, name] of paths.entries()) {
    if (index === 1) continue; // Recovery shares the workspace database.
    const opened = await install(page, { name, index });
    await upgrade(page, opened.databaseName, opened.version);
  }
  await page.goto("./");
  await page.locator("#langEn").click();
  await page.locator("#loadSampleBtn").click();
  await expect(page.locator("#reviewPanel")).toBeVisible();
  await expect(page.locator("#workspaceSaveState")).toHaveAttribute("data-state", "error");
  await page.locator("#workspaceSaveState").click();
  await page.locator("#workspaceResetAll").click();
  await page.locator("#workspaceResetAll").click();
  await expect(page.locator("#workspaceStatus")).toHaveAttribute("data-tone", "crit");
});
