import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {
  LEGACY_ROOT_PAGES,
  migrateReleaseLayout,
} from "../scripts/migrate-release-layout.mjs";

const fail = (message) => {
  console.error(`Release-layout migration check failed: ${message}`);
  process.exit(1);
};
const exists = async (file) =>
  fs.access(file).then(
    () => true,
    () => false,
  );
const root = await fs.mkdtemp(path.join(os.tmpdir(), "jarbou3i-layout-"));
const archive = path.join(root, "docs", "archive", "legacy-pages");

try {
  await fs.mkdir(archive, { recursive: true });
  const [duplicate, moveOnly] = LEGACY_ROOT_PAGES;
  await fs.writeFile(path.join(root, duplicate), "same bytes");
  await fs.writeFile(path.join(archive, duplicate), "same bytes");
  await fs.writeFile(path.join(root, moveOnly), "archive me");

  const result = await migrateReleaseLayout(root);
  if (await exists(path.join(root, duplicate))) fail("verified duplicate remained in root");
  if (!(await exists(path.join(archive, duplicate)))) fail("archived duplicate was lost");
  if (await exists(path.join(root, moveOnly))) fail("unarchived root page was not moved");
  if (!(await exists(path.join(archive, moveOnly)))) fail("moved page is missing from archive");
  if (result.removedDuplicates.length !== 1 || result.moved.length !== 1) {
    fail("migration result did not disclose its actions");
  }

  await fs.writeFile(path.join(root, duplicate), "new root revision");
  let refused = false;
  try {
    await migrateReleaseLayout(root);
  } catch (error) {
    refused = /differs from its archived copy/.test(error.message);
  }
  if (!refused) fail("migration did not protect divergent content");
  if (!(await exists(path.join(root, duplicate)))) fail("divergent root content was deleted");

  console.log("Release-layout migration checks passed.");
} finally {
  await fs.rm(root, { recursive: true, force: true });
}
