import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";
import standaloneCode from "ajv/dist/standalone/index.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const schema = JSON.parse(
  fs.readFileSync(path.join(root, "schema", "strategic-analysis.schema.json"), "utf8"),
);
const ajv = new Ajv2020({
  allErrors: true,
  strict: true,
  strictRequired: false,
  validateFormats: false,
  code: { source: true, lines: true },
});
ajv.addSchema(schema, "canonical");
const standalone = standaloneCode(ajv, { canonical: "canonical" });
const generated = standalone.replace(
  /const (func\d+) = require\("ajv\/dist\/runtime\/ucs2length"\)\.default;/g,
  "const $1 = (value) => Array.from(value).length;",
);
if (/\brequire\s*\(/.test(generated)) {
  throw new Error("Generated Strategic browser validator still contains CommonJS imports.");
}

const browserModule = `/* Generated from schema/strategic-analysis.schema.json. Do not edit by hand. */
(function attachStrategicSchemaValidators(root) {
  "use strict";
  const module = { exports: {} };
  const exports = module.exports;
${generated}
  root.Jarbou3iStrategicSchemaValidators = Object.freeze(module.exports);
})(typeof window !== "undefined" ? window : globalThis);
`;

fs.writeFileSync(
  path.join(root, "src", "strategic-schema-validator.js"),
  browserModule,
  "utf8",
);
console.log("Generated src/strategic-schema-validator.js");
