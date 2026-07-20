import fs from 'node:fs';
import path from 'node:path';

const fail = (message) => {
  console.error(`Source-of-truth check failed: ${message}`);
  process.exit(1);
};

const root = process.cwd();
const forbiddenTracks = ['preview', 'biopreview'];

for (const dir of forbiddenTracks) {
  if (fs.existsSync(path.join(root, dir))) {
    fail(`${dir}/ must not exist in the release root. Promote or remove it before locking.`);
  }
}

for (const required of ['index.html', 'src/app.js', 'src/core/lens-registry.js', 'src/core/platform-state.js', 'src/core/persistence.js', 'src/core/localization.js', 'src/core/render-regions.js', 'src/core/performance.js', 'src/core/platform-runtime.js', 'src/core/provenance.js', 'src/core/results-inspection.js', 'src/core/relationship-intelligence.js', 'src/lenses/strategic/adapter.js', 'src/lenses/biopolitical/adapter.js', 'src/biopolitics.js', 'src/styles.css', 'schema/strategic-analysis.schema.json', 'schema/biopolitical-analysis.schema.json', 'tests/platform-architecture-check.mjs', 'tests/platform-services-check.mjs', 'tests/platform-runtime-check.mjs', 'tests/performance-foundations-check.mjs', 'tests/provenance-check.mjs', 'tests/results-inspection-check.mjs', 'tests/relationship-intelligence-check.mjs', 'tests/results-inspection.spec.js', 'tests/smoke.spec.js']) {
  if (!fs.existsSync(path.join(root, required))) {
    fail(`missing root source file: ${required}`);
  }
}

const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
if (packageJson.version !== '2.1.0-alpha.28') {
  fail('root package version must be 2.1.0-alpha.28');
}

for (const script of ['test:platform', 'test:platform:services', 'test:platform:runtime', 'test:results:inspection', 'test:relationship:intelligence', 'test:performance', 'test:provenance', 'test:bio:v2', 'test:ci:no-browser', 'test:ci:browser', 'test:ci', 'test:hygiene']) {
  if (!packageJson.scripts?.[script]) fail(`missing package script: ${script}`);
}

console.log('Source-of-truth check passed.');
