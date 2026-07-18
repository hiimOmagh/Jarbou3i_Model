import fs from "node:fs";
import path from "node:path";

const EXPECTED_VERSION = "2.0.0-bio-rc.11";
const fail = (message) => {
  console.error(`Visual audit evidence review failed: ${message}`);
  process.exit(1);
};
const root = process.cwd();
const evidenceDir = process.argv[2] || process.env.VISUAL_AUDIT_EVIDENCE_DIR || "visual-audit-evidence-local";
const evidencePath = path.resolve(root, evidenceDir);
if (!fs.existsSync(evidencePath) || !fs.statSync(evidencePath).isDirectory()) fail(`missing evidence directory: ${evidenceDir}`);

const metadataPath = path.join(evidencePath, "visual-audit-metadata.json");
if (!fs.existsSync(metadataPath)) fail("missing visual-audit-metadata.json");
const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf8"));
if (metadata.app_version !== EXPECTED_VERSION || metadata.evidence_version !== EXPECTED_VERSION) fail(`evidence version must be ${EXPECTED_VERSION}`);
if (metadata.capture_set !== "final-language-theme-viewport-audit") fail("unexpected capture_set");
if (metadata.visual_assets_decoded !== true) fail("critical visual assets were not decode-gated");
if (metadata.transient_ui_cleared !== true) fail("transient UI was not cleared before capture");
if (metadata.phone_connections_target !== "relationshipExplorerMount") fail("phone Connections evidence does not target the explorer");
if (metadata.generated_by !== "tests/visual-audit-evidence.spec.js") fail("unexpected evidence generator");
if (metadata.case_count !== 18 || metadata.screenshot_count !== 36) fail("visual evidence counts must be 18 cases and 36 screenshots");
if (!Array.isArray(metadata.required_files) || metadata.required_files.length !== 55) fail("required_files must contain 55 artifacts");

for (const fileName of metadata.required_files) {
  const filePath = path.join(evidencePath, fileName);
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile() || fs.statSync(filePath).size <= 0) fail(`missing or empty artifact: ${fileName}`);
}

for (const locale of ["ar", "en", "fr"]) {
  for (const theme of ["light", "dark"]) {
    for (const viewport of ["desktop", "tablet", "phone"]) {
      const fileName = `measurement-${locale}-${theme}-${viewport}.json`;
      const value = JSON.parse(fs.readFileSync(path.join(evidencePath, fileName), "utf8"));
      if (value.app_version !== EXPECTED_VERSION) fail(`${fileName} version mismatch`);
      if (value.html_lang !== locale) fail(`${fileName} language mismatch`);
      if (value.html_dir !== (locale === "ar" ? "rtl" : "ltr")) fail(`${fileName} direction mismatch`);
      if (value.page_scroll_width > value.page_client_width + 1) fail(`${fileName} records horizontal overflow`);
      if (!Number.isInteger(value.body_text_length) || value.body_text_length < 1000) fail(`${fileName} lacks substantial visible text`);
      if (!Number.isInteger(value.visible_buttons) || value.visible_buttons < 10) fail(`${fileName} lacks visible controls`);
    }
  }
}

console.log(`Visual audit evidence review passed: 18 cases, 36 screenshots, ${metadata.required_files.length} artifacts`);
