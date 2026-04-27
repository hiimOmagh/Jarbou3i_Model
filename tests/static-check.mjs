import fs from 'node:fs';
import vm from 'node:vm';

const fail = (message) => {
  console.error(`Static check failed: ${message}`);
  process.exit(1);
};

const index = fs.readFileSync('index.html', 'utf8');
const manifest = JSON.parse(fs.readFileSync('manifest.webmanifest', 'utf8'));
const scriptMatch = index.match(/<script>([\s\S]*)<\/script>/);
if (!scriptMatch) fail('index.html has no script block');

try {
  new vm.Script(scriptMatch[1]);
} catch (error) {
  fail(`JavaScript syntax error: ${error.message}`);
}

const ids = [...index.matchAll(/id="([^"]+)"/g)].map((m) => m[1]);
if (new Set(ids).size !== ids.length) fail('duplicate DOM ids found');

const forbidden = [
  'id="exportJson"',
  'id="exportMd"',
  'id="printBtn"',
  'id="selfCheckBtn"',
  'function markdown(',
  'function selfCheckResults(',
  'function runSelfCheck(',
  'function playwrightSnippet(',
  'window.StrategicWorkbenchSelfCheck',
  'assets/jarbou3i-mascot.png"',
  'v1.1.2',
  'v1.1.1'
];
for (const token of forbidden) {
  if (index.includes(token)) fail(`forbidden legacy token remains: ${token}`);
}

const requiredAssets = [
  'assets/favicon-32.png',
  'assets/apple-touch-icon.png',
  'assets/jarbou3i-mascot-192.png',
  'assets/jarbou3i-mascot-512.png'
];
for (const asset of requiredAssets) {
  if (!fs.existsSync(asset)) fail(`missing optimized asset: ${asset}`);
}

const runtimeAssetLimit = 600 * 1024;
for (const asset of ['assets/jarbou3i-mascot-192.png', 'assets/jarbou3i-mascot-512.png']) {
  const size = fs.statSync(asset).size;
  if (size > runtimeAssetLimit) fail(`${asset} is too large for runtime use: ${size} bytes`);
}

if (!manifest.icons?.some((icon) => icon.sizes === '192x192')) fail('manifest lacks 192x192 icon');
if (!manifest.icons?.some((icon) => icon.sizes === '512x512')) fail('manifest lacks 512x512 icon');
if (!index.includes('manifest.webmanifest')) fail('manifest link missing from index.html');
if (!index.includes('aria-current="step"')) fail('stage accessibility marker missing');
if (!index.includes('SETTINGS_KEY')) fail('settings persistence is missing');
if (!index.includes('schema_version')) fail('schema_version support is missing');
if (!index.includes('modeResearch')) fail('research prompt mode is missing');
if (!index.includes('qualityGateHtml')) fail('quality gate UI is missing');
if (!index.includes('actorPowerScore')) fail('computed API scoring is missing');
if (!fs.existsSync('schema/strategic-analysis.schema.json')) fail('formal strategic analysis schema is missing');

console.log('Static checks passed.');

process.exit(0);
