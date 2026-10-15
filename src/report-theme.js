/* Jarbou3i Model — the exported reports' theme (UIX-4, ADR-0002). A report is
   a standalone file that loads no stylesheet, so it carries the kernel's
   tokens (src/ui/kernel.css) as text: light by default and in print, dark on
   a screen whose system is dark. tests/ui-kernel-check.mjs keeps the colours
   equal to the kernel's. */
(function attachReportTheme(root) {
  "use strict";

  // Colours, as the kernel has them in each theme.
  const LIGHT = Object.freeze({
    "--j-bg": "#edf1f6", "--j-panel": "#ffffff", "--j-panel-2": "#f6f8fb", "--j-raise": "#eef2f7",
    "--j-line": "#dbe2ec", "--j-line-strong": "#c3cede",
    "--j-fg": "#0b1220", "--j-fg-muted": "#44546b", "--j-fg-faint": "#5b6b82",
    "--j-signal": "#0a6f94", "--j-signal-strong": "#075a79", "--j-on-signal": "#ffffff", "--j-signal-wash": "rgba(10, 111, 148, .09)",
    "--j-ok": "#0f7a52", "--j-warn": "#8f5a00", "--j-crit": "#c42737",
    "--j-ok-wash": "rgba(15, 122, 82, .1)", "--j-warn-wash": "rgba(143, 90, 0, .1)", "--j-crit-wash": "rgba(196, 39, 55, .09)",
    "--j-shadow": "0 18px 50px rgba(15, 30, 55, .16)",
  });
  const DARK = Object.freeze({
    "--j-bg": "#070b12", "--j-panel": "#0c131e", "--j-panel-2": "#111a28", "--j-raise": "#172235",
    "--j-line": "#1d2939", "--j-line-strong": "#2c3b52",
    "--j-fg": "#e6edf7", "--j-fg-muted": "#9aaac0", "--j-fg-faint": "#7385a0",
    "--j-signal": "#4cc9f0", "--j-signal-strong": "#7dd9f5", "--j-on-signal": "#04121b", "--j-signal-wash": "rgba(76, 201, 240, .12)",
    "--j-ok": "#3ddc97", "--j-warn": "#f5b83d", "--j-crit": "#ff6b78",
    "--j-ok-wash": "rgba(61, 220, 151, .12)", "--j-warn-wash": "rgba(245, 184, 61, .12)", "--j-crit-wash": "rgba(255, 107, 120, .12)",
    "--j-shadow": "0 18px 50px rgba(0, 0, 0, .45)",
  });
  // Type, space and radius: the same in both themes.
  const SHARED = Object.freeze({
    "--j-font-ui": '"Segoe UI Variable Text", "Segoe UI", system-ui, -apple-system, "Helvetica Neue", "Noto Sans Arabic", "Geeza Pro", Tahoma, sans-serif',
    "--j-font-display": '"Segoe UI Variable Display", "Segoe UI", system-ui, -apple-system, "Helvetica Neue", "Noto Sans Arabic", "Geeza Pro", sans-serif',
    "--j-font-data": 'ui-monospace, "Cascadia Code", "SF Mono", "JetBrains Mono", Consolas, "Noto Sans Arabic", monospace',
    "--j-t-12": "12px", "--j-t-13": "13px", "--j-t-14": "14px", "--j-t-16": "16px",
    "--j-t-18": "18px", "--j-t-22": "22px", "--j-t-28": "28px", "--j-t-36": "36px",
    "--j-s-1": "4px", "--j-s-2": "8px", "--j-s-3": "12px", "--j-s-4": "16px", "--j-s-5": "24px", "--j-s-6": "32px",
    "--j-r-1": "4px", "--j-r-2": "8px", "--j-r-3": "14px",
  });

  const block = (tokens) => Object.entries(tokens).map(([name, value]) => `${name}:${value}`).join(";");
  const css = `:root{color-scheme:light;${block(SHARED)};${block(LIGHT)}}`
    + `@media screen and (prefers-color-scheme:dark){:root{color-scheme:dark;${block(DARK)}}}`;

  root.Jarbou3iReportTheme = Object.freeze({ css, tokens: Object.freeze({ light: LIGHT, dark: DARK, shared: SHARED }) });
})(window);
