import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

export const LEGACY_ROOT_PAGES = [
  "Editorial_Intelligence_v2.html",
  "TM_BrainMap.html",
];

async function exists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

export async function migrateReleaseLayout(root = process.cwd()) {
  const archive = path.join(root, "docs", "archive", "legacy-pages");
  await fs.mkdir(archive, { recursive: true });
  const result = { moved: [], removedDuplicates: [], unchanged: [] };

  for (const name of LEGACY_ROOT_PAGES) {
    const source = path.join(root, name);
    const target = path.join(archive, name);
    if (!(await exists(source))) {
      result.unchanged.push(name);
      continue;
    }
    if (!(await exists(target))) {
      await fs.rename(source, target);
      result.moved.push(name);
      continue;
    }

    const [sourceBytes, targetBytes] = await Promise.all([
      fs.readFile(source),
      fs.readFile(target),
    ]);
    if (!sourceBytes.equals(targetBytes)) {
      throw new Error(
        `${name} differs from its archived copy; review both files manually before removing either one.`,
      );
    }
    await fs.unlink(source);
    result.removedDuplicates.push(name);
  }
  return result;
}

const invokedPath = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : "";
if (import.meta.url === invokedPath) {
  try {
    const result = await migrateReleaseLayout();
    const changed = result.moved.length + result.removedDuplicates.length;
    console.log(
      changed
        ? `Release layout migrated: ${result.moved.length} page(s) archived, ${result.removedDuplicates.length} verified duplicate(s) removed from the release root.`
        : "Release layout already clean.",
    );
  } catch (error) {
    console.error(`Release layout migration failed: ${error.message}`);
    process.exitCode = 1;
  }
}
