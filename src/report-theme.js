/* Jarbou3i Model — the exported reports' theme (UIX-4, ADR-0002). A report is
   a standalone file that loads no stylesheet, so it carries the kernel's
   tokens (src/ui/kernel.css) as text: light by default and in print, dark on
   a screen whose system is dark. tests/ui-kernel-check.mjs keeps the colours
   equal to the kernel's. */
(function attachReportTheme(root) {
  "use strict";

  // Colours, as the kernel has them in each theme.
  const LIGHT = Object.freeze({
    "--j-bg": "#f8f8f6",
    "--j-panel": "#ffffff",
    "--j-panel-2": "#efefeb",
    "--j-raise": "#e8e8e3",
    "--j-line": "#dcdcd6",
    "--j-line-strong": "#7c8088",
    "--j-fg": "#15171b",
    "--j-fg-muted": "#4a4f57",
    "--j-fg-faint": "#5e636b",
    "--j-signal": "#1f5bc4",
    "--j-signal-strong": "#174a9f",
    "--j-on-signal": "#ffffff",
    "--j-signal-wash": "rgba(31, 91, 196, .09)",
    "--j-ink": "#15171b",
    "--j-on-ink": "#f8f8f6",
    "--j-ok": "#17733f",
    "--j-warn": "#8a5300",
    "--j-crit": "#c8262a",
    "--j-ok-wash": "rgba(23, 115, 63, .09)",
    "--j-warn-wash": "rgba(233, 162, 26, .14)",
    "--j-crit-wash": "rgba(200, 38, 42, .08)",
    "--j-shadow": "0 12px 32px rgba(21, 23, 27, .14), 0 2px 6px rgba(21, 23, 27, .08)",
    // The lines of the model, one per layer.
    "--j-l1": "#d62b2b",
    "--j-l2": "#1f5bc4",
    "--j-l3": "#e9a21a",
    "--j-l4": "#1d8a4e",
    "--j-l5": "#7a3f9e",
    "--j-l6": "#15171b",
    "--j-l7": "#d9621c",
    "--j-l8": "#0f8a8f",
    "--j-l9": "#8b5e34",
  });
  const DARK = Object.freeze({
    "--j-bg": "#0f1b30",
    "--j-panel": "#142440",
    "--j-panel-2": "#1a2b48",
    "--j-raise": "#203457",
    "--j-line": "#2a3e62",
    "--j-line-strong": "#6f82a6",
    "--j-fg": "#f2f0ea",
    "--j-fg-muted": "#bbc4d4",
    "--j-fg-faint": "#9ca9bf",
    "--j-signal": "#8db2f5",
    "--j-signal-strong": "#b3ccf8",
    "--j-on-signal": "#0f1b30",
    "--j-signal-wash": "rgba(141, 178, 245, .14)",
    "--j-ink": "#f2f0ea",
    "--j-on-ink": "#0f1b30",
    "--j-ok": "#4cc383",
    "--j-warn": "#f2b33d",
    "--j-crit": "#ff7a70",
    "--j-ok-wash": "rgba(76, 195, 131, .14)",
    "--j-warn-wash": "rgba(242, 179, 61, .14)",
    "--j-crit-wash": "rgba(255, 122, 112, .14)",
    "--j-shadow": "0 16px 40px rgba(3, 8, 18, .5), 0 2px 6px rgba(3, 8, 18, .3)",
    "--j-l1": "#ee5248",
    "--j-l2": "#5e8fea",
    "--j-l3": "#f2b33d",
    "--j-l4": "#3db06e",
    "--j-l5": "#b37fe0",
    "--j-l6": "#f2f0ea",
    "--j-l7": "#f08a4b",
    "--j-l8": "#36b9bf",
    "--j-l9": "#c49561",
  });
  // Type, space and radius: the same in both themes.
  const SHARED = Object.freeze({
    "--j-font-ui": '"Readex Pro", "Segoe UI Variable Text", "Segoe UI", system-ui, -apple-system, "Helvetica Neue", "Noto Sans Arabic", "Geeza Pro", Tahoma, sans-serif',
    "--j-font-display": '"Readex Pro", "Segoe UI Variable Display", "Segoe UI", system-ui, -apple-system, "Helvetica Neue", "Noto Sans Arabic", "Geeza Pro", sans-serif',
    "--j-font-data": "var(--j-font-ui)",
    "--j-font-code": 'ui-monospace, "Cascadia Code", "SF Mono", "JetBrains Mono", Consolas, "Noto Sans Arabic", monospace',
    "--j-t-12": "12px",
    "--j-t-13": "13px",
    "--j-t-14": "14px",
    "--j-t-16": "16px",
    "--j-t-18": "18px",
    "--j-t-22": "22px",
    "--j-t-28": "28px",
    "--j-t-36": "36px",
    "--j-s-1": "4px",
    "--j-s-2": "8px",
    "--j-s-3": "12px",
    "--j-s-4": "16px",
    "--j-s-5": "24px",
    "--j-s-6": "32px",
    "--j-r-1": "4px",
    "--j-r-2": "10px",
    "--j-r-3": "16px",
    "--j-r-pill": "999px",
    "--j-rule": "3px",
    "--j-station": "4px",
  });

  const block = (tokens) => Object.entries(tokens).map(([name, value]) => `${name}:${value}`).join(";");
  // A draft's banner and the provenance footer, the same in both reports.
  const css = `:root{color-scheme:light;${block(SHARED)};${block(LIGHT)}}`
    + `@media screen and (prefers-color-scheme:dark){:root{color-scheme:dark;${block(DARK)}}}`
    + `.draftBanner{display:flex;flex-wrap:wrap;gap:var(--j-s-1) var(--j-s-3);align-items:baseline;margin:0 0 var(--j-s-4);padding:var(--j-s-3) var(--j-s-4);border:1px solid var(--j-warn);border-radius:var(--j-r-2);background:linear-gradient(var(--j-warn-wash),var(--j-warn-wash)),var(--j-panel);color:var(--j-fg)}`
    + `.draftBanner strong{color:var(--j-warn);font-size:var(--j-t-13);}`
    + `.draftBanner[data-tone="crit"]{border-color:var(--j-crit);background:linear-gradient(var(--j-crit-wash),var(--j-crit-wash)),var(--j-panel)}.draftBanner[data-tone="crit"] strong{color:var(--j-crit)}`
    + `.provenance{margin-top:var(--j-s-6);padding:var(--j-s-4) var(--j-s-4) 0;border-top:1px solid var(--j-line);color:var(--j-fg-muted);font-size:var(--j-t-13)}`
    + `.provenance h2{margin:0 0 var(--j-s-3);color:var(--j-fg);font:700 var(--j-t-16)/1.3 var(--j-font-display)}`
    + `.provenance dl{display:grid;grid-template-columns:repeat(auto-fit,minmax(11rem,1fr));gap:var(--j-s-2) var(--j-s-4);margin:0}`
    + `.provenance dl div{min-width:0;padding:0;border:0;background:none}`
    + `.provenance dt{color:var(--j-fg-muted);font:600 var(--j-t-12)/1.4 var(--j-font-ui);letter-spacing:0;text-transform:none}`
    + `.provenance dd{margin:2px 0 0;color:var(--j-fg);overflow-wrap:anywhere}`
    + `@media print{.provenance{break-inside:avoid-page}}`;

  const COPY = Object.freeze({
    en: { draft: "Draft", exportedOn: "Exported {date}", about: "About this report", exported: "Exported", answerDated: "Answer dated", analysisId: "Analysis ID", schema: "Format version", version: "App version" },
    ar: { draft: "مسودة", exportedOn: "صُدِّر في {date}", about: "عن هذا التقرير", exported: "تاريخ التصدير", answerDated: "تاريخ الإجابة", analysisId: "معرّف التحليل", schema: "إصدار الصيغة", version: "إصدار التطبيق" },
    fr: { draft: "Brouillon", exportedOn: "Exporté le {date}", about: "À propos de ce rapport", exported: "Exporté le", answerDated: "Date de la réponse", analysisId: "Identifiant de l’analyse", schema: "Version du format", version: "Version de l’application" },
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
