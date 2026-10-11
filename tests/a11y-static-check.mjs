import fs from 'node:fs';

const fail = (message) => {
  console.error(`Accessibility static check failed: ${message}`);
  process.exit(1);
};

const index = fs.readFileSync('index.html', 'utf8');
const app = fs.readFileSync('src/app.js', 'utf8');
const styles = fs.readFileSync('src/styles.css', 'utf8');
const html = index + '\n' + app;

const relativeLuminance = (hex) => {
  const channels = hex.match(/[a-f\d]{2}/gi)?.map((channel) => Number.parseInt(channel, 16) / 255);
  if (!channels || channels.length !== 3) fail(`invalid color token: ${hex}`);
  const linear = channels.map((channel) => (
    channel <= 0.04045
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4
  ));
  return (0.2126 * linear[0]) + (0.7152 * linear[1]) + (0.0722 * linear[2]);
};

const contrastRatio = (foreground, background) => {
  const foregroundLuminance = relativeLuminance(foreground);
  const backgroundLuminance = relativeLuminance(background);
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);
  return (lighter + 0.05) / (darker + 0.05);
};

// The app's muted text and soft surfaces are the kernel's (ADR-0002); both
// themes keep the 4.75:1 safety margin.
const legacyTokens = styles.match(/:root\s*\{([\s\S]*?)\}/)?.[1] || '';
if (!/--muted:\s*var\(--j-fg-muted\)/.test(legacyTokens) || !/--surface-soft:\s*var\(--j-panel-2\)/.test(legacyTokens)) {
  fail('muted text and soft surfaces must follow the kernel tokens --j-fg-muted and --j-panel-2');
}
const kernel = fs.readFileSync('src/ui/kernel.css', 'utf8');
const themes = {
  dark: kernel.match(/:root\s*\{([\s\S]*?)\}/)?.[1] || '',
  light: kernel.match(/:root\[data-theme="light"\]\s*\{([\s\S]*?)\}/)?.[1] || '',
};
for (const [theme, block] of Object.entries(themes)) {
  const muted = block.match(/--j-fg-muted:\s*(#[a-f\d]{6})/i)?.[1];
  const softSurface = block.match(/--j-panel-2:\s*(#[a-f\d]{6})/i)?.[1];
  if (!muted || !softSurface) fail(`${theme}-theme muted and soft-surface kernel tokens must use explicit hex colors`);
  const mutedOnSoftContrast = contrastRatio(muted, softSurface);
  if (mutedOnSoftContrast < 4.75) {
    fail(`${theme}-theme muted text needs a 4.75:1 safety margin on soft surfaces; found ${mutedOnSoftContrast.toFixed(2)}:1`);
  }
}

if (!/<html[^>]+lang="ar"[^>]+dir="rtl"/.test(index)) fail('root html must define initial lang and dir');
if (!index.includes('name="viewport"')) fail('viewport meta tag missing');
if (!index.includes('aria-live="polite"')) fail('aria-live region missing');
if (!index.includes('role="dialog"')) fail('modal dialog role missing');
if (!index.includes('aria-modal="true"')) fail('modal aria-modal missing');
if (!index.includes('aria-labelledby="modalTitle"')) fail('modal labelling missing');
// The review is a case file: one document and an outline that marks where the reader is.
if (!index.includes('j-case-outline')) fail('case-file outline missing');
if (!app.includes('"aria-current", "location"')) fail('the outline must mark the current location');
if (!app.includes('aria-controls')) fail('runtime tabs and accordions need aria-controls');
if (!app.includes('aria-expanded')) fail('runtime accordions need aria-expanded');
if (!app.includes('aria-labelledby')) fail('runtime panels need stable labels');
if (!index.includes('role="radiogroup"') || !index.includes('role="radio"')) fail('segmented controls need radio semantics');
if (!index.includes('aria-checked="true"')) fail('segmented controls need checked state');
if (!index.includes('tabindex="-1"')) fail('segmented controls need roving tabindex');
// The current setup step is marked by the guided flow (src/features/guided-flow.js).
const flow = fs.readFileSync('src/features/guided-flow.js', 'utf8');
if (!flow.includes('setAttribute("aria-current", "step")')) fail('current stage marker missing');
if (!app.includes('function trapModalFocus(')) fail('modal focus trap missing');
if (!app.includes('function bindRadioGroupKeyboard(')) fail('radio groups need arrow-key behavior');

const imgTags = [...html.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
for (const tag of imgTags) {
  if (!/\balt="[^"]*"/.test(tag)) fail(`image without alt attribute: ${tag}`);
}

const buttonTags = [...html.matchAll(/<button\b[^>]*>/g)].map((m) => m[0]);
for (const tag of buttonTags) {
  if (!/\btype="button"/.test(tag)) fail(`button without explicit type=button: ${tag}`);
}

if (!/\.srOnly/.test(styles)) fail('screen-reader utility class missing');
if (!/:focus-visible/.test(styles)) fail('focus-visible styling missing');

console.log('Accessibility static checks passed.');
process.exit(0);
