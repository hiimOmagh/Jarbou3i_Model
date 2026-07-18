import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const window = {};
window.window = window;
const context = vm.createContext({ window });
vm.runInContext(
  fs.readFileSync(path.join(root, "src", "biopolitics-sample-i18n.js"), "utf8"),
  context,
  { filename: "src/biopolitics-sample-i18n.js" },
);
vm.runInContext(
  fs.readFileSync(path.join(root, "src", "biopolitics.js"), "utf8"),
  context,
  { filename: "src/biopolitics.js" },
);

for (const language of ["en", "fr", "ar"]) {
  const fixture = window.Jarbou3iBiopolitics.sample(language, "research");
  const target = path.join(
    root,
    "fixtures",
    `sample-analysis-bio-${language}.json`,
  );
  fs.writeFileSync(target, `${JSON.stringify(fixture, null, 2)}\n`, "utf8");
  console.log(`Generated ${path.relative(root, target)}`);
}
