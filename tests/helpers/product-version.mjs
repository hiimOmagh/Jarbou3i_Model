import fs from "node:fs";

const packageUrl = new URL("../../package.json", import.meta.url);
const packageJson = JSON.parse(fs.readFileSync(packageUrl, "utf8"));

export const PRODUCT_VERSION = packageJson.version;

if (!/^\d+\.\d+\.\d+-(?:alpha|beta|rc)\.\d+$|^\d+\.\d+\.\d+$/.test(PRODUCT_VERSION)) {
  throw new Error(`Invalid product version authority: ${PRODUCT_VERSION}`);
}
