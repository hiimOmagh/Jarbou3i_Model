import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";
import standaloneCode from "ajv/dist/standalone/index.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const readJson = (relativePath) =>
  JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));

const ajv = new Ajv2020({
  allErrors: true,
  strict: true,
  validateFormats: false,
  code: { source: true, lines: true },
});

ajv.addSchema(
  readJson("schema/biopolitical-analysis.schema.json"),
  "canonical",
);
ajv.addSchema(
  readJson("schema/biopolitical-migrated-draft.schema.json"),
  "migratedDraft",
);
const standalone = standaloneCode(ajv, {
  canonical: "canonical",
  migratedDraft: "migratedDraft",
});
const generated = standalone.replace(
  /const (func\d+) = require\("ajv\/dist\/runtime\/ucs2length"\)\.default;/g,
  "const $1 = (value) => Array.from(value).length;",
);
if (/\brequire\s*\(/.test(generated)) {
  throw new Error("Generated browser validator still contains CommonJS imports.");
}

const browserModule = `/* Generated from the canonical schemas. Do not edit by hand. */
(function attachBiopoliticalSchemaValidators(root) {
  "use strict";
  const module = { exports: {} };
  const exports = module.exports;
${generated}
  root.Jarbou3iBiopoliticsSchemaValidators = Object.freeze(module.exports);
})(typeof window !== "undefined" ? window : globalThis);
`;

fs.writeFileSync(
  path.join(root, "src", "biopolitics-schema-validator.js"),
  browserModule,
  "utf8",
);

console.log("Generated src/biopolitics-schema-validator.js");
