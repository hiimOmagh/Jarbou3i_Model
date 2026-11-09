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
    + `.provenance .reportNote{margin:0 0 var(--j-s-3);color:var(--j-fg)}`
    + `.provenance dl{display:grid;grid-template-columns:repeat(auto-fit,minmax(11rem,1fr));gap:var(--j-s-2) var(--j-s-4);margin:0}`
    + `.provenance dl div{min-width:0;padding:0;border:0;background:none}`
    + `.provenance dt{color:var(--j-fg-muted);font:600 var(--j-t-12)/1.4 var(--j-font-ui);letter-spacing:0;text-transform:none}`
    + `.provenance dd{margin:2px 0 0;color:var(--j-fg);overflow-wrap:anywhere}`
    + `@media print{.provenance{break-inside:avoid-page}}`;

  const COPY = Object.freeze({
    en: { draft: "Draft", exportedOn: "Exported {date}", about: "About this report", exported: "Exported", answerDated: "Answer dated", analysisId: "Analysis ID", schema: "Format version", version: "App version", note: "This report is a structured analysis prepared by the author with an AI assistant and processed locally by the app. It is not an independent verification or a measure of truth, and it does not by itself decide whether to publish; the author who reviews it is accountable for it." },
    ar: { draft: "مسودة", exportedOn: "صُدِّر في {date}", about: "عن هذا التقرير", exported: "تاريخ التصدير", answerDated: "تاريخ الإجابة", analysisId: "معرّف التحليل", schema: "إصدار الصيغة", version: "إصدار التطبيق", note: "هذا التقرير تحليل منظّم أعدّه المؤلف بمساعدة أداة ذكاء اصطناعي، وعالجه التطبيق محليًا. ليس تحققًا مستقلًا ولا مقياسًا للحقيقة، ولا يمثّل وحده قرارًا بالنشر؛ والمؤلف الذي يراجعه مسؤول عنه." },
    fr: { draft: "Brouillon", exportedOn: "Exporté le {date}", about: "À propos de ce rapport", exported: "Exporté le", answerDated: "Date de la réponse", analysisId: "Identifiant de l’analyse", schema: "Version du format", version: "Version de l’application", note: "Ce rapport présente une analyse structurée préparée par l’auteur avec un assistant d’IA et traitée localement par l’application. Il ne constitue ni une vérification indépendante ni une mesure de la vérité, et ne décide pas à lui seul de la publication ; l’auteur qui le relit en est responsable." },
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
    return `<footer class="provenance" data-report-provenance><h2>${escapeHtml(c.about)}</h2><p class="reportNote" data-report-note>${escapeHtml(c.note)}</p><dl>${rows.map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd><bdi>${escapeHtml(value)}</bdi></dd></div>`).join("")}</dl></footer>`;
  }

  // Content-Security-Policy meta for an exported report. Reports run no network, so
  // everything is closed except inline styles (and, when given, one inline script by hash).
  const K256 = [0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
  function sha256Base64(text) {
    const data = [];
    for (const ch of String(text)) {
      const cp = ch.codePointAt(0);
      if (cp < 0x80) data.push(cp);
      else if (cp < 0x800) data.push(0xc0 | (cp >> 6), 0x80 | (cp & 63));
      else if (cp < 0x10000) data.push(0xe0 | (cp >> 12), 0x80 | ((cp >> 6) & 63), 0x80 | (cp & 63));
      else data.push(0xf0 | (cp >> 18), 0x80 | ((cp >> 12) & 63), 0x80 | ((cp >> 6) & 63), 0x80 | (cp & 63));
    }
    const bits = data.length * 8;
    const padded = new Uint8Array(((data.length + 9 + 63) >> 6) << 6);
    padded.set(data);
    padded[data.length] = 0x80;
    const view = new DataView(padded.buffer);
    view.setUint32(padded.length - 8, Math.floor(bits / 4294967296));
    view.setUint32(padded.length - 4, bits >>> 0);
    const h = [0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];
    const w = new Uint32Array(64);
    const rotr = (x, n) => (x >>> n) | (x << (32 - n));
    for (let off = 0; off < padded.length; off += 64) {
      for (let i = 0; i < 16; i++) w[i] = view.getUint32(off + i * 4);
      for (let i = 16; i < 64; i++) {
        const s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3);
        const s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10);
        w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0;
      }
      let [a, b, c, d, e, f, g, hh] = h;
      for (let i = 0; i < 64; i++) {
        const t1 = (hh + (rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25)) + ((e & f) ^ (~e & g)) + K256[i] + w[i]) >>> 0;
        const t2 = ((rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22)) + ((a & b) ^ (a & c) ^ (b & c))) >>> 0;
        hh = g; g = f; f = e; e = (d + t1) >>> 0; d = c; c = b; b = a; a = (t1 + t2) >>> 0;
      }
      [a, b, c, d, e, f, g, hh].forEach((v, i) => { h[i] = (h[i] + v) >>> 0; });
    }
    const out = new Uint8Array(32);
    const ov = new DataView(out.buffer);
    h.forEach((v, i) => ov.setUint32(i * 4, v));
    const B64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    let b64 = "";
    for (let i = 0; i < 30; i += 3) {
      const n = (out[i] << 16) | (out[i + 1] << 8) | out[i + 2];
      b64 += B64[(n >> 18) & 63] + B64[(n >> 12) & 63] + B64[(n >> 6) & 63] + B64[n & 63];
    }
    const n = (out[30] << 16) | (out[31] << 8);
    return b64 + B64[(n >> 18) & 63] + B64[(n >> 12) & 63] + B64[(n >> 6) & 63] + "=";
  }
  function cspMeta(inlineScript) {
    const script = inlineScript ? `; script-src 'sha256-${sha256Base64(inlineScript)}'` : "";
    return `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src data:; font-src data:; base-uri 'none'; form-action 'none'${script}">`;
  }

  root.Jarbou3iReportTheme = Object.freeze({ cspMeta, sha256Base64, css, dateText, printCss, exportedHtml, draftHtml, provenanceHtml, tokens: Object.freeze({ light: LIGHT, dark: DARK, shared: SHARED }) });
})(window);
