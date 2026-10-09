// Regenerates samples.js from the canonical fixtures, and bio-labels.js from the app's Bio module
// so the prototype shows the app's own AR/EN/FR labels.
import fs from "node:fs";
import vm from "node:vm";

const LANGS = ["en", "ar", "fr"];
const read = (name) => JSON.parse(fs.readFileSync(`fixtures/${name}.json`, "utf8"));
const samples = Object.fromEntries(LANGS.map((lang) => [lang, read(`sample-analysis-${lang}`)]));
const bioSamples = Object.fromEntries(LANGS.map((lang) => [lang, read(`sample-analysis-bio-${lang}`)]));
const header = (from) =>
  `// Generated from ${from} — do not edit by hand.\n` +
  "// Regenerate: node prototypes/ux-0/build-samples.mjs\n";
fs.writeFileSync(
  "prototypes/ux-0/samples.js",
  header("fixtures/sample-analysis-{,bio-}{en,ar,fr}.json") +
    "// (Inlined because the production CSP sets connect-src none, which blocks fetch().)\n" +
    `export const SAMPLES = ${JSON.stringify(samples, null, 1)};\n` +
    `export const BIO_SAMPLES = ${JSON.stringify(bioSamples, null, 1)};\n`,
);

const context = {};
context.window = context.globalThis = context;
vm.createContext(context);
vm.runInContext(fs.readFileSync("src/biopolitics.js", "utf8"), context);
const BIO = context.Jarbou3iBiopolitics;
// Every token the samples use, plus the schema enums the views list in full.
const tokens = new Set([...BIO.CAPTURE_LEVELS, ...BIO.EXPLANATION_TYPES]);
const walk = (value) => {
  if (typeof value === "string" && /^[a-z][a-z_]*$/.test(value)) tokens.add(value);
  else if (value && typeof value === "object") Object.values(value).forEach(walk);
};
Object.values(bioSamples).forEach(walk);
const pick = (keys, label) => Object.fromEntries(keys.map((key) => [key, label(key)]));
const labels = Object.fromEntries(LANGS.map((lang) => [lang, {
  pillars: pick(BIO.PILLARS.map((p) => p.key), (key) => BIO.ui(lang, `pillars.${key}`)),
  tokens: pick([...tokens].sort(), (key) => BIO.displayToken(lang, key)),
  audit: pick(BIO.SELF_AUDIT_KEYS, (key) => BIO.auditLabel(lang, key)),
  ui: pick(["conclusion", "selfAudit", "stronglySupported", "plausible", "disputed", "unknown", "changeEvidence"], (key) => BIO.ui(lang, key)),
}]));
fs.writeFileSync(
  "prototypes/ux-0/bio-labels.js",
  header("src/biopolitics.js (ui, displayToken, auditLabel)") +
    `export const BIO_PILLARS = ${JSON.stringify(BIO.PILLARS.map((p) => p.key))};\n` +
    `export const BIO_LABELS = ${JSON.stringify(labels, null, 1)};\n`,
);
console.log("samples.js and bio-labels.js regenerated");
