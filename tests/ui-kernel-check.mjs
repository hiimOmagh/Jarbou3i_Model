// UIX-1 kernel guard: the kernel sits next to src/styles.css during the
// migration, so nothing in it may reach the current app. Every token, class
// and keyframe is j-prefixed, every selector is scoped to kernel classes or to
// the root token blocks, no remote resource is loaded, and the classes the
// stylesheet defines are exactly the ones the DOM-contract registry knows.
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { KERNEL_CLASSES } from "../src/ui/contracts.js";

// The kernel and the views built on it (shell, guided flow, case file).
const css = ["src/ui/kernel.css", "src/ui/shell.css", "src/ui/flow.css", "src/ui/case.css", "src/ui/work.css", "src/ui/editor.css", "src/ui/commit.css", "src/ui/exchange.css", "src/ui/dialog.css", "src/ui/reference.css", "src/ui/section.css", "src/ui/evidence.css", "src/ui/engine.css", "src/ui/brief.css"]
  .map((file) => fs.readFileSync(file, "utf8"))
  .join("\n")
  .replace(/\/\*[\s\S]*?\*\//g, "");

for (const [, name] of css.matchAll(/(?:^|[;{\s])(--[\w-]+)\s*:/g)) {
  assert.ok(name.startsWith("--j-"), `kernel token ${name} is not --j- prefixed`);
}
for (const [, name] of css.matchAll(/@keyframes\s+([\w-]+)/g)) {
  assert.ok(name.startsWith("j-"), `kernel keyframes ${name} is not j- prefixed`);
}
assert.doesNotMatch(css, /@import|url\(\s*["']?(?:https?:)?\/\//i, "the kernel loads no remote resource");

// Selectors of every style rule (keyframe steps and at-rule preludes excluded).
const selectors = [];
const keyframes = /@keyframes[^{]*\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}/g;
for (const [, prelude] of css.replace(keyframes, "").matchAll(/([^{};]+)\{/g)) {
  const text = prelude.trim();
  // Split on top-level commas only: :is(a, b) is one selector.
  if (!text.startsWith("@")) selectors.push(...text.split(/,(?![^(]*\))/).map((part) => part.trim()));
}
const rootBlock = /^:root(?:\[[\w-]+(?:="[\w-]+")?\])*(?::not\(\[[\w-]+="[\w-]+"\]\))?$/;
for (const selector of selectors) {
  assert.ok(
    selector.includes(".j-") || rootBlock.test(selector) || selector === '[data-density="compact"]',
    `kernel selector "${selector}" can reach the current app`,
  );
}

const defined = [...new Set([...css.matchAll(/\.(j-[\w-]+)/g)].map(([, name]) => name))].sort();
assert.deepEqual(defined, [...KERNEL_CLASSES], "the src/ui stylesheets and the DOM-contract registry differ");

// The exported reports carry the kernel's tokens as text (src/report-theme.js):
// every value is the kernel's, in each theme.
const kernelCss = fs.readFileSync("src/ui/kernel.css", "utf8");
const tokensOf = (block) => Object.fromEntries(
  [...block.matchAll(/(--j-[\w-]+)\s*:\s*([^;]+);/g)].map(([, name, value]) => [name, value.replace(/\s+/g, " ").trim()]),
);
const kernelTokens = {
  dark: tokensOf(kernelCss.match(/^:root\s*\{([\s\S]*?)\n\}/m)[1]),
  light: tokensOf(kernelCss.match(/^:root\[data-theme="light"\]\s*\{([\s\S]*?)\n\}/m)[1]),
};
const reportWindow = {};
vm.runInNewContext(fs.readFileSync("src/report-theme.js", "utf8"), { window: reportWindow });
const reportTokens = reportWindow.Jarbou3iReportTheme.tokens;
for (const theme of ["light", "dark"]) {
  for (const [name, value] of Object.entries(reportTokens[theme])) {
    assert.equal(value, kernelTokens[theme][name], `the report's ${theme} ${name} is not the kernel's`);
  }
}
for (const [name, value] of Object.entries(reportTokens.shared)) {
  assert.equal(value, kernelTokens.dark[name], `the report's ${name} is not the kernel's`);
}
// A report's dates and printed page title: an answer's stated day stays that
// day whatever its offset, and a title cannot end the CSS string it sits in.
const reportTheme = reportWindow.Jarbou3iReportTheme;
assert.equal(reportTheme.dateText("en", "2026-04-27T00:00:00+03:00", { utc: true }), "April 27, 2026");
assert.equal(reportTheme.dateText("en", "YYYY-MM-DDTHH:mm:ssZ", { utc: true }), "", "a placeholder date is printed");
const running = reportTheme.printCss("en", 'a\f"b</style>', true).match(/@top-center\{content:"((?:[^"\\]|\\.)*)";/);
assert.ok(running && !/[\f<]/.test(running[1]), "a report title breaks out of its page header");

console.log(`UI kernel: ${selectors.length} selectors scoped, ${defined.length} classes registered.`);
