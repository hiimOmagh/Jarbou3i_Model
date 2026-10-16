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
  // A draft's banner and the provenance footer, the same in both reports.
  const css = `:root{color-scheme:light;${block(SHARED)};${block(LIGHT)}}`
    + `@media screen and (prefers-color-scheme:dark){:root{color-scheme:dark;${block(DARK)}}}`
    + `.draftBanner{display:flex;flex-wrap:wrap;gap:var(--j-s-1) var(--j-s-3);align-items:baseline;margin:0 0 var(--j-s-4);padding:var(--j-s-3) var(--j-s-4);border:1px solid var(--j-warn);border-inline-start-width:4px;border-radius:var(--j-r-2);background:linear-gradient(var(--j-warn-wash),var(--j-warn-wash)),var(--j-panel);color:var(--j-fg)}`
    + `.draftBanner strong{color:var(--j-warn);font-size:var(--j-t-13);letter-spacing:.06em;text-transform:uppercase}[dir="rtl"] .draftBanner strong{letter-spacing:0}`
    + `.draftBanner[data-tone="crit"]{border-color:var(--j-crit);background:linear-gradient(var(--j-crit-wash),var(--j-crit-wash)),var(--j-panel)}.draftBanner[data-tone="crit"] strong{color:var(--j-crit)}`
    + `.provenance{margin-top:var(--j-s-6);padding:var(--j-s-4) var(--j-s-4) 0;border-top:1px solid var(--j-line);color:var(--j-fg-muted);font-size:var(--j-t-13)}`
    + `.provenance h2{margin:0 0 var(--j-s-3);color:var(--j-fg);font:700 var(--j-t-16)/1.3 var(--j-font-display)}`
    + `.provenance dl{display:grid;grid-template-columns:repeat(auto-fit,minmax(11rem,1fr));gap:var(--j-s-2) var(--j-s-4);margin:0}`
    + `.provenance dl div{min-width:0;padding:0;border:0;background:none}`
    + `.provenance dt{color:var(--j-fg-muted);font:600 var(--j-t-12)/1.4 var(--j-font-ui);letter-spacing:0;text-transform:none}`
    + `.provenance dd{margin:2px 0 0;color:var(--j-fg);overflow-wrap:anywhere}`
    + `@media print{.provenance{break-inside:avoid-page}}`;

  const COPY = Object.freeze({
    en: { draft: "Draft", exportedOn: "Exported {date}", about: "About this report", exported: "Exported", answerDated: "Answer dated", analysisId: "Analysis ID", schema: "Schema version", version: "App version" },
    ar: { draft: "مسودة", exportedOn: "صُدِّر في {date}", about: "عن هذا التقرير", exported: "تاريخ التصدير", answerDated: "تاريخ الإجابة", analysisId: "معرّف التحليل", schema: "إصدار المخطط", version: "إصدار التطبيق" },
    fr: { draft: "Brouillon", exportedOn: "Exporté le {date}", about: "À propos de ce rapport", exported: "Exporté le", answerDated: "Date de la réponse", analysisId: "Identifiant de l’analyse", schema: "Version du schéma", version: "Version de l’application" },
  });
  const copy = (lang) => COPY[lang] || COPY.en;
  const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (ch) => `&#${ch.charCodeAt(0)};`);
  // A CSS string that cannot end the string or the style element.
  const cssString = (value) => `"${String(value).replace(/[\\"<>\n\r\f]/g, (ch) => `\\${ch.charCodeAt(0).toString(16)} `)}"`;

  // A date in the report's language, with the digits the report uses. A
  // stated day (an answer's generated_at) keeps the day it names, whatever
  // its time and offset.
  function dateText(lang, value, { utc = false } = {}) {
    const day = utc && /^\d{4}-\d{2}-\d{2}/.exec(String(value ?? ""));
    const date = value instanceof Date ? value : new Date(day ? `${day[0]}T00:00:00Z` : String(value ?? ""));
    if (!value || Number.isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat(`${COPY[lang] ? lang : "en"}-u-nu-latn`, { dateStyle: "long", ...(utc ? { timeZone: "UTC" } : {}) }).format(date);
  }
  // On paper: the margins, the report's name (and "Draft") above each page, and
  // the page number below it, where the browser draws page margin boxes.
  function printCss(lang, title, draft) {
    const chars = Array.from(String(title || ""));
    const name = chars.length > 90 ? `${chars.slice(0, 89).join("")}…` : chars.join("");
    const running = draft ? `${copy(lang).draft} · ${name}` : name;
    const box = `font:9pt/1.3 ${SHARED["--j-font-ui"]};color:${LIGHT["--j-fg-muted"]}`;
    return `@page{margin:16mm 14mm;@top-center{content:${cssString(running)};${box}}@bottom-center{content:counter(page) " / " counter(pages);${box}}}`;
  }
  // The day the report was made, under its title.
  function exportedHtml(lang, exportedAt) {
    const date = dateText(lang, exportedAt);
    return date ? `<p class="reportDate"><time datetime="${escapeHtml(new Date(exportedAt).toISOString())}">${escapeHtml(copy(lang).exportedOn.replace("{date}", date))}</time></p>` : "";
  }
  function draftHtml(lang, tone, note) {
    return `<p class="draftBanner" data-tone="${tone === "crit" ? "crit" : "warn"}"><strong>${escapeHtml(copy(lang).draft)}</strong><span>${escapeHtml(note)}</span></p>`;
  }
  // Where the report came from: the rows that have a value.
  function provenanceHtml(lang, { exportedAt, generatedAt, analysisId, schemaVersion, version }) {
    const c = copy(lang);
    const rows = [
      [c.exported, dateText(lang, exportedAt)],
      [c.answerDated, dateText(lang, generatedAt, { utc: true })],
      [c.analysisId, analysisId],
      [c.schema, schemaVersion],
      [c.version, version],
    ].filter(([, value]) => String(value ?? "").trim());
    return `<footer class="provenance" data-report-provenance><h2>${escapeHtml(c.about)}</h2><dl>${rows.map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd><bdi>${escapeHtml(value)}</bdi></dd></div>`).join("")}</dl></footer>`;
  }

  root.Jarbou3iReportTheme = Object.freeze({ css, dateText, printCss, exportedHtml, draftHtml, provenanceHtml, tokens: Object.freeze({ light: LIGHT, dark: DARK, shared: SHARED }) });
})(window);
