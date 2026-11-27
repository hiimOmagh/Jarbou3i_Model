import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
// Reuse the parser shipped with the pinned Playwright dependency; no new package.
const { babelParse, traverse } = require(path.join(path.dirname(require.resolve('playwright/package.json')), 'lib/transform/babelBundle.js'));
const root = path.resolve(import.meta.dirname, '..');
const unique = values => [...new Set(values)].sort();
const browserNames = new Set(['window', 'globalThis', 'self', 'document', 'navigator', 'localStorage', 'sessionStorage', 'indexedDB', 'crypto', 'location', 'performance']);
function inventory(sources) {
  const edges = [], globals = [], loaders = [];
  for (const [file, source] of Object.entries(sources)) {
    const ast = babelParse(source, file, true);
    function edge(specifier, kind) {
      if (typeof specifier !== 'string' || !specifier.startsWith('.')) throw Error(`unknown module loader: ${file} ${kind}`);
      const target = path.posix.normalize(path.posix.join(path.posix.dirname(file), specifier));
      if (!Object.hasOwn(sources, target)) throw Error(`unresolved module: ${file} -> ${target}`);
      edges.push(`${file} -> ${target}`);
      if (kind === 'dynamic') loaders.push(`${file} -> ${target}`);
    }
    function dynamic(argument, scope) {
      if (argument?.type === 'StringLiteral') return argument.value;
      if (file !== 'src/app.js' || argument?.type !== 'Identifier') return null;
      const binding = scope.getBinding(argument.name);
      const init = binding?.constant && binding.path.node.init;
      if (init?.type !== 'ConditionalExpression' || init.test.type !== 'BinaryExpression' || init.test.operator !== '===' || init.test.left.name !== 'attempt' || init.test.right.value !== 1) return null;
      const base = init.consequent.value;
      const retry = init.alternate;
      if (!['./biopolitics-graph.js', './biopolitical-report.js'].includes(base) || retry.type !== 'TemplateLiteral' || retry.expressions.length !== 1 || retry.expressions[0].name !== 'attempt' || retry.quasis[0].value.raw !== base + '?retry=' || retry.quasis[1].value.raw !== '') return null;
      return base;
    }
    const globalAliases = new Set();
    traverse(ast, { CallExpression(p) {
      const fn = p.node.callee;
      if (!['FunctionExpression', 'ArrowFunctionExpression'].includes(fn.type)) return;
      fn.params.forEach((param, i) => {
        const arg = p.node.arguments[i];
        const isGlobal = n => n?.type === 'Identifier' && ['window', 'globalThis', 'self'].includes(n.name);
        if (param.type === 'Identifier' && (isGlobal(arg) || (arg?.type === 'ConditionalExpression' && isGlobal(arg.consequent) && isGlobal(arg.alternate)))) {
          globalAliases.add(p.get('callee').scope.getBinding(param.name));
        }
      });
    }});
    traverse(ast, {
      ImportDeclaration(p) { edge(p.node.source.value, 'static'); },
      ExportNamedDeclaration(p) { if (p.node.source) edge(p.node.source.value, 'static'); },
      ExportAllDeclaration(p) { edge(p.node.source.value, 'static'); },
      ImportExpression(p) { edge(dynamic(p.node.source, p.scope), 'dynamic'); },
      'CallExpression|NewExpression'(p) {
        const c = p.node.callee;
        if (c.type === 'Import') edge(dynamic(p.node.arguments[0], p.scope), 'dynamic');
        if ((c.type === 'Identifier' && ['require', 'eval', 'Function', 'importScripts', 'Worker', 'SharedWorker'].includes(c.name)) ||
            (['MemberExpression', 'OptionalMemberExpression'].includes(c.type) && ['require', 'eval', 'Function', 'importScripts', 'Worker', 'SharedWorker'].includes(c.property.name ?? c.property.value))) {
          throw Error(`unknown dynamic loader: ${file}`);
        }
      },
      ReferencedIdentifier(p) {
        const binding = p.scope.getBinding(p.node.name);
        const alias = binding && globalAliases.has(binding);
        if (!alias && (!browserNames.has(p.node.name) || binding)) return;
        let use = p.node.name;
        const parent = p.parent;
        if (['MemberExpression', 'OptionalMemberExpression'].includes(parent.type) && parent.object === p.node) {
          if (parent.computed && parent.property.type !== 'StringLiteral') throw Error(`unknown global access: ${file}`);
          use += '.' + (parent.computed ? parent.property.value : parent.property.name);
        }
        globals.push(`${file}: ${use}`);
      },
    });
  }
  return { edges: unique(edges), globals: unique(globals), loaders: unique(loaders) };
}
function layer(file) {
  if (file === 'src/app.js') return 'app';
  const directory = file.split('/')[1];
  return ['features', 'lenses', 'ui', 'core', 'domain', 'shared', 'platform', 'generated', 'locales'].includes(directory) ? directory : 'legacy';
}
const allowed = {
  app: ['features', 'lenses', 'ui', 'core', 'domain', 'shared', 'platform', 'generated', 'locales', 'legacy'],
  features: ['features', 'core', 'domain', 'shared', 'lenses', 'ui'],
  core: ['core', 'shared'], domain: ['domain', 'shared'], shared: ['shared'],
  lenses: ['lenses', 'core', 'domain', 'shared'], ui: ['ui', 'shared'],
  platform: ['platform', 'core', 'domain', 'shared', 'locales'], generated: ['generated'], locales: ['locales'], legacy: ['legacy', 'shared'],
};
function cycles(edges) {
  const graph = new Map();
  for (const edge of edges) { const [a,b] = edge.split(' -> '); if (!graph.has(a)) graph.set(a, []); if (!graph.has(b)) graph.set(b, []); graph.get(a).push(b); }
  const reachable = (start, target, seen = new Set()) => { if (seen.has(start)) return false; seen.add(start); return graph.get(start).some(n => n === target || reachable(n, target, seen)); };
  const groups = [];
  const visited = new Set();
  for (const node of graph.keys()) {
    if (visited.has(node)) continue;
    const group = [...graph.keys()].filter(other => reachable(node, other) && reachable(other, node)).sort();
    if (group.length) { group.forEach(n => visited.add(n)); groups.push(group.join(' | ')); }
  }
  return groups.sort();
}
// Recorded at cfce6b77df629f47783bdd96077e4320f93088ff; never regenerate in a gate run.
const baseline = {
  "edges": [
    "src/app.js -> src/ai-interchange.js",
    "src/app.js -> src/biopolitical-report.js",
    "src/app.js -> src/biopolitics-graph.js",
    "src/app.js -> src/biopolitics-integrity.js",
    "src/app.js -> src/biopolitics-sample-i18n.js",
    "src/app.js -> src/biopolitics-schema-validator.js",
    "src/app.js -> src/biopolitics.js",
    "src/app.js -> src/contract-repair.js",
    "src/app.js -> src/core/canonical-editor.js",
    "src/app.js -> src/core/evidence-intelligence.js",
    "src/app.js -> src/core/platform-runtime.js",
    "src/app.js -> src/core/promotion.js",
    "src/app.js -> src/core/provenance.js",
    "src/app.js -> src/core/recovery-journal.js",
    "src/app.js -> src/core/relationship-intelligence.js",
    "src/app.js -> src/core/research-dossier.js",
    "src/app.js -> src/core/resolution-transaction.js",
    "src/app.js -> src/core/results-explanation.js",
    "src/app.js -> src/core/results-inspection.js",
    "src/app.js -> src/core/results-orientation.js",
    "src/app.js -> src/core/review-ledger.js",
    "src/app.js -> src/core/revision-history.js",
    "src/app.js -> src/core/shell-preferences.js",
    "src/app.js -> src/core/short-text.js",
    "src/app.js -> src/core/source-file-text.js",
    "src/app.js -> src/core/source-prompt-budget.js",
    "src/app.js -> src/core/source-relations.js",
    "src/app.js -> src/core/storage-health.js",
    "src/app.js -> src/core/workspace-contract.js",
    "src/app.js -> src/core/workspace-storage.js",
    "src/app.js -> src/features/application-shell.js",
    "src/app.js -> src/features/command-palette.js",
    "src/app.js -> src/features/example-ride.js",
    "src/app.js -> src/features/first-ride.js",
    "src/app.js -> src/features/guided-flow.js",
    "src/app.js -> src/features/source-file-reader.js",
    "src/app.js -> src/json-parser.js",
    "src/app.js -> src/lenses/biopolitical/adapter.js",
    "src/app.js -> src/lenses/strategic/adapter.js",
    "src/app.js -> src/locales/ar.js",
    "src/app.js -> src/locales/en.js",
    "src/app.js -> src/locales/fr.js",
    "src/app.js -> src/reference-ui.js",
    "src/app.js -> src/report-theme.js",
    "src/app.js -> src/strategic-integrity.js",
    "src/app.js -> src/strategic-schema-validator.js",
    "src/core/canonical-editor.js -> src/core/workspace-contract.js",
    "src/core/case-archive.js -> src/core/canonical-json.js",
    "src/core/case-archive.js -> src/core/research-dossier.js",
    "src/core/case-archive.js -> src/core/workspace-contract.js",
    "src/core/platform-runtime.js -> src/core/lens-registry.js",
    "src/core/platform-runtime.js -> src/core/localization.js",
    "src/core/platform-runtime.js -> src/core/performance.js",
    "src/core/platform-runtime.js -> src/core/persistence.js",
    "src/core/platform-runtime.js -> src/core/platform-state.js",
    "src/core/platform-runtime.js -> src/core/render-regions.js",
    "src/core/promotion.js -> src/core/research-dossier.js",
    "src/core/promotion.js -> src/core/resolution-transaction.js",
    "src/core/promotion.js -> src/core/workspace-contract.js",
    "src/core/recovery-journal.js -> src/core/workspace-contract.js",
    "src/core/recovery-journal.js -> src/core/workspace-storage.js",
    "src/core/research-dossier.js -> src/core/evidence-intelligence.js",
    "src/core/research-dossier.js -> src/core/workspace-contract.js",
    "src/core/research-dossier.js -> src/core/workspace-storage.js",
    "src/core/resolution-transaction.js -> src/core/canonical-json.js",
    "src/core/resolution-transaction.js -> src/core/workspace-contract.js",
    "src/core/results-inspection.js -> src/core/evidence-intelligence.js",
    "src/core/results-inspection.js -> src/core/evidence-review-plan.js",
    "src/core/results-inspection.js -> src/core/evidence-traceability.js",
    "src/core/results-inspection.js -> src/core/relationship-intelligence.js",
    "src/core/review-ledger.js -> src/core/canonical-json.js",
    "src/core/revision-history.js -> src/core/resolution-transaction.js",
    "src/core/revision-history.js -> src/core/workspace-contract.js",
    "src/core/source-relations.js -> src/core/evidence-intelligence.js",
    "src/core/workspace-contract.js -> src/core/canonical-json.js",
    "src/core/workspace-contract.js -> src/core/resolution-transaction.js",
    "src/core/workspace-contract.js -> src/core/review-ledger.js",
    "src/core/workspace-storage.js -> src/core/workspace-contract.js",
    "src/features/application-shell.js -> src/core/shell-navigation.js",
    "src/features/application-shell.js -> src/core/shell-preferences.js",
    "src/features/source-file-reader.js -> src/core/source-file-text.js",
    "src/lenses/biopolitical/adapter.js -> src/core/lens-registry.js",
    "src/lenses/strategic/adapter.js -> src/core/lens-registry.js"
  ],
  "globals": [
    "src/ai-interchange.js: globalThis",
    "src/ai-interchange.js: root.Jarbou3iAiInterchange",
    "src/ai-interchange.js: root.Jarbou3iBiopolitics",
    "src/ai-interchange.js: window",
    "src/app.js: document",
    "src/app.js: document.activeElement",
    "src/app.js: document.addEventListener",
    "src/app.js: document.body",
    "src/app.js: document.createElement",
    "src/app.js: document.documentElement",
    "src/app.js: document.execCommand",
    "src/app.js: document.getElementById",
    "src/app.js: document.querySelector",
    "src/app.js: document.querySelectorAll",
    "src/app.js: document.title",
    "src/app.js: globalThis.crypto",
    "src/app.js: globalThis.navigator",
    "src/app.js: navigator.clipboard",
    "src/app.js: navigator.locks",
    "src/app.js: navigator.onLine",
    "src/app.js: performance.now",
    "src/app.js: sessionStorage.getItem",
    "src/app.js: sessionStorage.setItem",
    "src/app.js: window",
    "src/app.js: window.Jarbou3iAiInterchange",
    "src/app.js: window.Jarbou3iBiopoliticalReport",
    "src/app.js: window.Jarbou3iBiopolitics",
    "src/app.js: window.Jarbou3iBiopoliticsGraph",
    "src/app.js: window.Jarbou3iBiopoliticsIntegrity",
    "src/app.js: window.Jarbou3iCapabilityLoads",
    "src/app.js: window.Jarbou3iContractRepair",
    "src/app.js: window.Jarbou3iJson",
    "src/app.js: window.Jarbou3iProvenance",
    "src/app.js: window.Jarbou3iReferenceUi",
    "src/app.js: window.Jarbou3iReportTheme",
    "src/app.js: window.addEventListener",
    "src/app.js: window.confirm",
    "src/app.js: window.innerHeight",
    "src/app.js: window.isSecureContext",
    "src/app.js: window.localStorage",
    "src/app.js: window.matchMedia",
    "src/app.js: window.scrollBy",
    "src/app.js: window.scrollTo",
    "src/app.js: window.scrollY",
    "src/biopolitical-report.js: root.Jarbou3iBiopoliticalReport",
    "src/biopolitical-report.js: root.Jarbou3iReportTheme",
    "src/biopolitical-report.js: window",
    "src/biopolitics-graph.js: globalThis",
    "src/biopolitics-graph.js: root.Jarbou3iBiopoliticsGraph",
    "src/biopolitics-graph.js: window",
    "src/biopolitics-integrity.js: globalThis",
    "src/biopolitics-integrity.js: root.Jarbou3iBiopolitics",
    "src/biopolitics-integrity.js: root.Jarbou3iBiopoliticsIntegrity",
    "src/biopolitics-integrity.js: root.Jarbou3iBiopoliticsSchemaValidators",
    "src/biopolitics-integrity.js: window",
    "src/biopolitics-sample-i18n.js: globalThis",
    "src/biopolitics-sample-i18n.js: root.Jarbou3iBiopoliticsSampleI18n",
    "src/biopolitics-sample-i18n.js: window",
    "src/biopolitics-schema-validator.js: globalThis",
    "src/biopolitics-schema-validator.js: root.Jarbou3iBiopoliticsSchemaValidators",
    "src/biopolitics-schema-validator.js: window",
    "src/biopolitics.js: root.Jarbou3iAiInterchange",
    "src/biopolitics.js: root.Jarbou3iBiopolitics",
    "src/biopolitics.js: root.Jarbou3iBiopoliticsIntegrity",
    "src/biopolitics.js: root.Jarbou3iBiopoliticsSampleI18n",
    "src/biopolitics.js: root.Jarbou3iProvenance",
    "src/biopolitics.js: root.Jarbou3iReportTheme",
    "src/biopolitics.js: window",
    "src/contract-repair.js: globalThis",
    "src/contract-repair.js: root.Jarbou3iAiInterchange",
    "src/contract-repair.js: root.Jarbou3iBiopolitics",
    "src/contract-repair.js: root.Jarbou3iBiopoliticsIntegrity",
    "src/contract-repair.js: root.Jarbou3iBiopoliticsSchemaValidators",
    "src/contract-repair.js: root.Jarbou3iContractRepair",
    "src/contract-repair.js: window",
    "src/core/canonical-json.js: globalThis.crypto",
    "src/core/performance.js: globalThis.performance",
    "src/core/platform-runtime.js: globalThis.localStorage",
    "src/core/promotion.js: globalThis.Jarbou3iBiopoliticsIntegrity",
    "src/core/promotion.js: globalThis.crypto",
    "src/core/provenance.js: window",
    "src/core/provenance.js: window.Jarbou3iProvenance",
    "src/core/recovery-journal.js: globalThis.indexedDB",
    "src/core/research-dossier.js: globalThis.crypto",
    "src/core/research-dossier.js: globalThis.indexedDB",
    "src/core/resolution-transaction.js: globalThis.crypto",
    "src/core/review-ledger.js: globalThis.crypto",
    "src/core/revision-history.js: globalThis.crypto",
    "src/core/storage-health.js: globalThis.navigator",
    "src/core/workspace-contract.js: globalThis.crypto",
    "src/core/workspace-storage.js: globalThis.indexedDB",
    "src/features/application-shell.js: globalThis",
    "src/features/application-shell.js: globalThis.matchMedia",
    "src/features/application-shell.js: globalThis.requestAnimationFrame",
    "src/features/application-shell.js: window.addEventListener",
    "src/features/application-shell.js: window.scrollY",
    "src/features/source-file-reader.js: globalThis.FileReader",
    "src/json-parser.js: globalThis",
    "src/json-parser.js: root.Jarbou3iJson",
    "src/json-parser.js: window",
    "src/reference-ui.js: document.activeElement",
    "src/reference-ui.js: document.addEventListener",
    "src/reference-ui.js: document.body",
    "src/reference-ui.js: document.createElement",
    "src/reference-ui.js: document.getElementById",
    "src/reference-ui.js: document.querySelector",
    "src/reference-ui.js: globalThis",
    "src/reference-ui.js: root.Jarbou3iBiopolitics",
    "src/reference-ui.js: root.Jarbou3iBiopoliticsGraph",
    "src/reference-ui.js: root.Jarbou3iReferenceUi",
    "src/reference-ui.js: window",
    "src/reference-ui.js: window.addEventListener",
    "src/reference-ui.js: window.history",
    "src/reference-ui.js: window.location",
    "src/report-theme.js: root.Jarbou3iReportTheme",
    "src/report-theme.js: window",
    "src/strategic-integrity.js: globalThis.Jarbou3iContractRepair",
    "src/strategic-integrity.js: globalThis.Jarbou3iStrategicSchemaValidators",
    "src/strategic-schema-validator.js: globalThis",
    "src/strategic-schema-validator.js: root.Jarbou3iStrategicSchemaValidators",
    "src/strategic-schema-validator.js: window",
    "src/ui/controls.js: document.activeElement"
  ],
  "loaders": [
    "src/app.js -> src/biopolitical-report.js",
    "src/app.js -> src/biopolitics-graph.js",
    "src/app.js -> src/core/source-file-text.js",
    "src/app.js -> src/features/source-file-reader.js",
    "src/core/workspace-contract.js -> src/core/resolution-transaction.js",
    "src/core/workspace-contract.js -> src/core/review-ledger.js"
  ]
};
function check(actual) {
  const errors = [];
  for (const edge of actual.edges) {
    const [a,b] = edge.split(' -> ');
    if (!allowed[layer(a)]?.includes(layer(b)) && !baseline.edges.includes(edge)) errors.push(`layer: ${edge}`);
  }
  for (const key of ['globals', 'loaders']) for (const item of actual[key]) if (!baseline[key].includes(item)) errors.push(`unknown ${key}: ${item}`);
  const actualCycles = cycles(actual.edges);
  if (JSON.stringify(actualCycles) !== JSON.stringify(cycles(baseline.edges))) errors.push(`cycle baseline changed: ${actualCycles}`);
  // A new edge inside the existing SCC must not silently expand its exception.
  const cycleNodes = new Set(actualCycles.flatMap(c => c.split(' | ')));
  for (const edge of actual.edges) {
    const [a,b] = edge.split(' -> ');
    if (cycleNodes.has(a) && cycleNodes.has(b) && !baseline.edges.includes(edge)) errors.push(`cycle edge: ${edge}`);
  }
  return errors;
}
function sources() { return Object.fromEntries(fs.readdirSync(path.join(root, 'src'), { recursive: true }).filter(f => f.endsWith('.js')).sort().map(f => ['src/' + f.replaceAll('\\', '/'), fs.readFileSync(path.join(root, 'src', f), 'utf8')])); }
if (process.argv.includes('--self-test')) {
  assert.deepEqual(check(baseline), []);
  const inject = (key, item) => check({ ...baseline, [key]: [...baseline[key], item] });
  assert(inject('edges', 'src/core/a.js -> src/features/a.js').some(e => e.startsWith('layer:')));
  assert(check({ ...baseline, edges: [...baseline.edges, 'src/core/a.js -> src/core/b.js', 'src/core/b.js -> src/core/a.js'] }).some(e => e.includes('cycle')));
  assert(inject('edges', 'src/core/review-ledger.js -> src/core/workspace-contract.js').some(e => e.includes('cycle')));
  assert(inject('globals', 'src/core/a.js: window.NewLegacy').length);
  assert(inject('loaders', 'src/app.js -> src/locales/en.js').length);
  for (const code of ['import(target)', 'require("./b.js")', 'window.eval("x")', 'new Function("x")', 'importScripts("x")', 'new Worker("x")', 'window[key]']) assert.throws(() => inventory({'src/a.js': code}), /unknown/);
  assert.deepEqual(inventory({'src/a.js': '// import("bad")\nconst text = `window.Bad`; export {};'}), {edges: [], globals: [], loaders: []});
  assert.deepEqual(inventory({'src/a.js': 'export * from "./b.js"', 'src/b.js': 'export {}'}).edges, ['src/a.js -> src/b.js']);
  console.log('Dependency boundary self-test passed: baseline, layers, cycles, globals, dynamic loaders, parser decoys.');
} else {
  const actual = inventory(sources());
  const errors = check(actual);
  for (const key of ['edges', 'globals', 'loaders']) { console.log(`${key} (${actual[key].length}):`); actual[key].forEach(x => console.log(`  ${x}`)); }
  if (errors.length) throw Error(errors.join('\n'));
  console.log('Dependency boundaries passed.');
}
