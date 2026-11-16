/* Reading a file's text on the device (RESEARCH-1D, D1). Pure: bytes in, plain
   text or a refusal code out. Nothing here stores, fetches or mounts anything;
   the original bytes and the full text live only in the caller's temporary
   reader. Extension and type are hints: the bytes are inspected. */

export const SOURCE_FILE_BYTE_LIMIT = 2 * 1024 * 1024;
// UTF-16 units of extracted text, whole or refused: there is no partial result.
export const SOURCE_FILE_TEXT_LIMIT = 1_000_000;
// One passage is one ordinary excerpt (RESEARCH-1A): at most 2,000 units.
export const SOURCE_PASSAGE_LIMIT = 2000;
export const SOURCE_TITLE_LIMIT = 500;
export const SOURCE_FILE_EXTENSIONS = [".txt", ".md", ".csv", ".json", ".html", ".htm"];
// The tokenizer works in slices of this many characters of input, so a caller
// can yield between them (Cancel and the deadline stay responsive).
export const SOURCE_FILE_SLICE = 65_536;

const TEXT_KINDS = { ".txt": "text", ".md": "text", ".csv": "text", ".json": "text", ".html": "html", ".htm": "html" };

// The name is untrusted: only its last segment and extension are looked at.
export function fileKind(name) {
  const base = String(name ?? "").split(/[\\/]/).pop().toLowerCase();
  const dot = base.lastIndexOf(".");
  return dot < 0 ? null : TEXT_KINDS[base.slice(dot)] || null;
}

const refuse = (code) => ({ ok: false, code });

// UTF-8 (a BOM is dropped) or UTF-16 told by its BOM. Anything else that is not
// valid UTF-8 is refused, never repaired with replacement characters.
export function decodeFileBytes(bytes) {
  const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  if (view.length >= 2 && ((view[0] === 0xff && view[1] === 0xfe) || (view[0] === 0xfe && view[1] === 0xff))) {
    const little = view[0] === 0xff;
    if ((view.length - 2) % 2) return refuse("undecodable");
    let text = "";
    const units = [];
    for (let at = 2; at < view.length; at += 2) {
      units.push(little ? view[at] | (view[at + 1] << 8) : (view[at] << 8) | view[at + 1]);
      if (units.length === 8192) { text += String.fromCharCode(...units); units.length = 0; }
    }
    text += String.fromCharCode(...units);
    // A half of a surrogate pair is not text.
    if (/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/.test(text)) return refuse("undecodable");
    return { ok: true, text };
  }
  try {
    const text = new TextDecoder("utf-8", { fatal: true, ignoreBOM: true }).decode(view);
    return { ok: true, text: text.charCodeAt(0) === 0xfeff ? text.slice(1) : text };
  } catch {
    return refuse("undecodable");
  }
}

// Line ends are one kind; a NUL or another binary control means this is not text.
const BINARY = /[\u0000-\u0008\u000B\u000E-\u001F\u007F]/;
const lineEnds = (text) => text.replace(/\r\n?/g, "\n");

/* HTML named character references: the complete HTML 4 set (252 names: 96
   Latin-1, 124 symbols and Greek, 32 special) and &apos;. A name is matched
   exactly (Eacute is not eacute) and only with its semicolon. A name that is
   not in the set stays as written. */
const LATIN1_NAMES = "nbsp iexcl cent pound curren yen brvbar sect uml copy ordf laquo not shy reg macr deg plusmn sup2 sup3 acute micro para middot cedil sup1 ordm raquo frac14 frac12 frac34 iquest Agrave Aacute Acirc Atilde Auml Aring AElig Ccedil Egrave Eacute Ecirc Euml Igrave Iacute Icirc Iuml ETH Ntilde Ograve Oacute Ocirc Otilde Ouml times Oslash Ugrave Uacute Ucirc Uuml Yacute THORN szlig agrave aacute acirc atilde auml aring aelig ccedil egrave eacute ecirc euml igrave iacute icirc iuml eth ntilde ograve oacute ocirc otilde ouml divide oslash ugrave uacute ucirc uuml yacute thorn yuml".split(" ");
const OTHER_NAMES = "fnof=402 Alpha=913 Beta=914 Gamma=915 Delta=916 Epsilon=917 Zeta=918 Eta=919 Theta=920 Iota=921 Kappa=922 Lambda=923 Mu=924 Nu=925 Xi=926 Omicron=927 Pi=928 Rho=929 Sigma=931 Tau=932 Upsilon=933 Phi=934 Chi=935 Psi=936 Omega=937 alpha=945 beta=946 gamma=947 delta=948 epsilon=949 zeta=950 eta=951 theta=952 iota=953 kappa=954 lambda=955 mu=956 nu=957 xi=958 omicron=959 pi=960 rho=961 sigmaf=962 sigma=963 tau=964 upsilon=965 phi=966 chi=967 psi=968 omega=969 thetasym=977 upsih=978 piv=982 bull=8226 hellip=8230 prime=8242 Prime=8243 oline=8254 frasl=8260 weierp=8472 image=8465 real=8476 trade=8482 alefsym=8501 larr=8592 uarr=8593 rarr=8594 darr=8595 harr=8596 crarr=8629 lArr=8656 uArr=8657 rArr=8658 dArr=8659 hArr=8660 forall=8704 part=8706 exist=8707 empty=8709 nabla=8711 isin=8712 notin=8713 ni=8715 prod=8719 sum=8721 minus=8722 lowast=8727 radic=8730 prop=8733 infin=8734 ang=8736 and=8743 or=8744 cap=8745 cup=8746 int=8747 there4=8756 sim=8764 cong=8773 asymp=8776 ne=8800 equiv=8801 le=8804 ge=8805 sub=8834 sup=8835 nsub=8836 sube=8838 supe=8839 oplus=8853 otimes=8855 perp=8869 sdot=8901 lceil=8968 rceil=8969 lfloor=8970 rfloor=8971 lang=9001 rang=9002 loz=9674 spades=9824 clubs=9827 hearts=9829 diams=9830 quot=34 amp=38 lt=60 gt=62 OElig=338 oelig=339 Scaron=352 scaron=353 Yuml=376 circ=710 tilde=732 ensp=8194 emsp=8195 thinsp=8201 zwnj=8204 zwj=8205 lrm=8206 rlm=8207 ndash=8211 mdash=8212 lsquo=8216 rsquo=8217 sbquo=8218 ldquo=8220 rdquo=8221 bdquo=8222 dagger=8224 Dagger=8225 permil=8240 lsaquo=8249 rsaquo=8250 euro=8364 apos=39".split(" ");
export const HTML_ENTITIES = new Map([
  ...LATIN1_NAMES.map((name, index) => [name, String.fromCharCode(160 + index)]),
  ...OTHER_NAMES.map((pair) => { const [name, code] = pair.split("="); return [name, String.fromCharCode(Number(code))]; }),
]);

const isDigit = (c, hex) => (c >= 48 && c <= 57 ? c - 48 : hex && (c | 32) >= 97 && (c | 32) <= 102 ? (c | 32) - 87 : -1);
const isAlnum = (c) => (c >= 48 && c <= 57) || ((c | 32) >= 97 && (c | 32) <= 122);
// What is not a character (a surrogate, NUL, past U+10FFFF) or only a control
// stays as written: it is not repaired.
function numericChar(code) {
  const control = code < 0x20 ? code !== 9 && code !== 10 : code >= 0x7f && code <= 0x9f;
  if (!code || code > 0x10ffff || (code >= 0xd800 && code <= 0xdfff) || control) return null;
  return String.fromCodePoint(code);
}
// Linear: each "&" looks ahead a fixed few characters.
function decodeEntities(text) {
  let at = text.indexOf("&");
  if (at < 0) return text;
  const out = [];
  let last = 0;
  const length = text.length;
  while (at >= 0) {
    let value = null;
    let end = at;
    if (text.charCodeAt(at + 1) === 35) {
      let from = at + 2;
      const hex = (text.charCodeAt(from) | 32) === 120;
      if (hex) from += 1;
      let j = from;
      let code = 0;
      while (j < length && j - from < 8) {
        const digit = isDigit(text.charCodeAt(j), hex);
        if (digit < 0) break;
        code = code * (hex ? 16 : 10) + digit;
        j += 1;
      }
      if (j > from && text.charCodeAt(j) === 59) { value = numericChar(code); end = j + 1; }
    } else {
      let j = at + 1;
      while (j < length && j - at <= 9 && isAlnum(text.charCodeAt(j))) j += 1;
      if (j > at + 1 && text.charCodeAt(j) === 59) { value = HTML_ENTITIES.get(text.slice(at + 1, j)) ?? null; end = j + 1; }
    }
    if (value !== null) {
      out.push(text.slice(last, at), value);
      last = end;
      at = text.indexOf("&", end);
    } else {
      at = text.indexOf("&", at + 1);
    }
  }
  out.push(text.slice(last));
  return out.join("");
}

/* HTML to plain text. A small tokenizer, not a parser: tags, attributes,
   comments and scripts are read to be dropped; nothing is mounted, fetched or
   evaluated. It follows the HTML tokenizer where hidden text depends on it:
   - script, style, title, textarea, iframe, noscript, noembed and noframes hold
     raw text up to their own end tag; a slash before ">" never closes them;
   - script data follows the "<!--" / "<script" escape states exactly, so text a
     browser keeps inside a script stays hidden;
   - head, object, canvas, audio, video, select, svg and math content is dropped
     with the element (svg and math may self-close, nothing else);
   - a quote opens an attribute value only after "=", and a comment ends at
     "-->", "--!>", or at once for "<!-->" and "<!--->".
   It does not chase the rest of the browser's tree building. Where that decides
   what is hidden, the file is refused instead: any tag named template, xmp or
   plaintext, anywhere, in any case, closing or opening, makes the whole file
   unsafe and no text is returned. Every step moves forward, so the work is
   linear in the input. Only the text emitted is cut into slices; one scan for
   a raw-text end, a script end or a comment end runs in a single step (about
   9 ms for 2 MiB), and the output stops at the limit. */
const RAW_TEXT = new Set(["style", "title", "textarea", "iframe", "noscript", "noembed", "noframes"]);
const DROPPED = new Set(["object", "canvas", "audio", "video", "select", "head", "svg", "math"]);
const UNSAFE = new Set(["template", "xmp", "plaintext"]);
const FOREIGN = new Set(["svg", "math"]);
// A block ends a line (1) or sets a paragraph apart (2); a break is said once,
// before the next text, however many tags ask for it.
const BREAKS = new Map([
  ...["div", "li", "tr", "dt", "dd", "caption", "summary", "figcaption", "address"].map((name) => [name, 1]),
  ...["p", "ul", "ol", "dl", "table", "thead", "tbody", "tfoot", "h1", "h2", "h3", "h4", "h5", "h6", "section", "article", "header", "footer", "nav", "aside", "main", "blockquote", "pre", "hr", "form", "fieldset", "figure", "details"].map((name) => [name, 2]),
]);
const CELLS = new Set(["td", "th"]);
const isSpace = (c) => c === 32 || c === 9 || c === 10 || c === 13 || c === 12;
const isLetter = (c) => (c | 32) >= 97 && (c | 32) <= 122;
const isNameChar = (c) => isAlnum(c) || c === 58 || c === 45;
// A tag name ends at white space, "/" or ">".
const isDelimiter = (c) => isSpace(c) || c === 47 || c === 62;

export function createHtmlTextJob(html, limit = SOURCE_FILE_TEXT_LIMIT) {
  const length = html.length;
  const chunks = [];
  let size = 0;
  let over = false;
  let unsafe = false;
  let at = 0;
  let pre = 0;
  let skip = "";
  let depth = 0;
  let started = false;
  let pendingBreak = 0;
  let gap = "";

  const push = (value) => { chunks.push(value); size += value.length; if (size > limit) over = true; };
  const flush = () => {
    if (!started) { started = true; pendingBreak = 0; gap = ""; return; }
    if (pendingBreak) { push("\n".repeat(pendingBreak)); pendingBreak = 0; gap = ""; } else if (gap) { push(gap); gap = ""; }
  };
  // Text between tags: entities decoded once, after the tags are gone; white
  // space outside <pre> collapses to one space; spaces at line ends and starts go.
  const emit = (raw) => {
    if (skip || !raw) return;
    const text = decodeEntities(raw);
    const n = text.length;
    let i = 0;
    while (i < n && !over) {
      const c = text.charCodeAt(i);
      if (pre ? c === 10 || c === 13 : isSpace(c)) {
        if (pre) { pendingBreak = Math.min(2, pendingBreak + 1); gap = ""; } else if (!gap) gap = " ";
        i += 1;
        continue;
      }
      if (pre && (c === 32 || c === 9 || c === 12)) {
        let j = i + 1;
        while (j < n) { const d = text.charCodeAt(j); if (d !== 32 && d !== 9 && d !== 12) break; j += 1; }
        gap += text.slice(i, j);
        i = j;
        continue;
      }
      let j = i + 1;
      while (j < n) { const d = text.charCodeAt(j); if (pre ? d === 10 || d === 13 || d === 32 || d === 9 || d === 12 : isSpace(d)) break; j += 1; }
      flush();
      push(text.slice(i, j));
      i = j;
    }
  };
  const named = (position, name) => {
    for (let k = 0; k < name.length; k += 1) if ((html.charCodeAt(position + k) | 32) !== name.charCodeAt(k)) return false;
    return true;
  };
  // The ">" that ends a tag starting at `from`: a quote opens a value only after "=".
  const tagEnd = (from) => {
    let quote = 0;
    let last = 0;
    for (let i = from; i < length; i += 1) {
      const c = html.charCodeAt(i);
      if (quote) { if (c === quote) { quote = 0; last = c; } continue; }
      if ((c === 34 || c === 39) && last === 61) { quote = c; continue; }
      if (c === 62) return i;
      if (!isSpace(c)) last = c;
    }
    return -1;
  };
  const after = (close) => (close < 0 ? length : close + 1);
  // Raw text runs to the first end tag of its own name.
  const rawEnd = (name, from) => {
    let position = from;
    for (;;) {
      const found = html.indexOf("</", position);
      if (found < 0) return length;
      if (named(found + 2, name) && isDelimiter(html.charCodeAt(found + 2 + name.length))) return after(tagEnd(found + 2 + name.length));
      position = found + 2;
    }
  };
  // Script data, with its escape states: "<!--" escapes, "<script" inside an
  // escape double-escapes (its end tag only leaves that), "-->" leaves both.
  const scriptEnd = (from) => {
    let state = 0;
    let dashes = 0;
    let i = from;
    while (i < length) {
      const c = html.charCodeAt(i);
      if (c === 60) {
        dashes = 0;
        if (html.charCodeAt(i + 1) === 47) {
          if (named(i + 2, "script") && isDelimiter(html.charCodeAt(i + 8))) {
            if (state !== 2) return after(tagEnd(i + 8));
            state = 1;
            i += 8;
            continue;
          }
        } else if (state === 0 && html.startsWith("<!--", i)) {
          state = 1;
          dashes = 2;
          i += 4;
          continue;
        } else if (state === 1 && named(i + 1, "script") && isDelimiter(html.charCodeAt(i + 7))) {
          state = 2;
          i += 7;
          continue;
        }
        i += 1;
        continue;
      }
      if (c === 45) { if (state) dashes += 1; i += 1; continue; }
      if (c === 62 && state && dashes >= 2) state = 0;
      dashes = 0;
      i += 1;
    }
    return length;
  };

  // A comment starting at `from` (after "<!--") ends at "-->" or "--!>"; "<!-->"
  // and "<!--->" end at once. The "--!>" search is kept, so a file of many
  // comments never rescans to its end for each.
  let bang = -1;
  const commentEnd = (from) => {
    if (html.charCodeAt(from) === 62) return from + 1;
    if (html.charCodeAt(from) === 45 && html.charCodeAt(from + 1) === 62) return from + 2;
    const plain = html.indexOf("-->", from);
    if (bang < from) { const found = html.indexOf("--!>", from); bang = found < 0 ? Infinity : found; }
    if (plain < 0 && bang === Infinity) return length;
    return plain < 0 || bang < plain ? bang + 4 : plain + 3;
  };

  // The next "<", looked for once however many slices the text before it takes.
  let nextOpen = -1;
  function step() {
    if (nextOpen < at) { const found = html.indexOf("<", at); nextOpen = found < 0 ? length : found; }
    if (nextOpen > at) {
      // A long text is read a slice at a time, never cutting through a reference.
      let cut = Math.min(nextOpen, at + SOURCE_FILE_SLICE);
      if (cut < nextOpen) for (let back = cut - 1; back > cut - 12 && back > at; back -= 1) {
        const c = html.charCodeAt(back);
        if (c === 59) break;
        if (c === 38) { cut = back; break; }
      }
      emit(html.slice(at, cut));
      at = cut;
      if (cut < nextOpen || nextOpen >= length) return;
    }
    const open = nextOpen;
    at = open;
    const next = html.charCodeAt(at + 1);
    if (html.startsWith("<!--", at)) { at = commentEnd(at + 4); return; }
    if (next === 33 || next === 63) {
      if (FOREIGN.has(skip) && html.startsWith("<![CDATA[", at)) { const close = html.indexOf("]]>", at + 9); at = close < 0 ? length : close + 3; return; }
      at = after(html.indexOf(">", at + 2));
      return;
    }
    const closing = next === 47;
    const start = at + (closing ? 2 : 1);
    if (!isLetter(html.charCodeAt(start))) {
      if (closing) { at = html.charCodeAt(start) === 62 ? start + 1 : after(html.indexOf(">", start)); return; }
      emit("<");
      at += 1;
      return;
    }
    let nameEnd = start + 1;
    while (nameEnd < length && isNameChar(html.charCodeAt(nameEnd))) nameEnd += 1;
    const name = html.slice(start, nameEnd).toLowerCase();
    // Whatever the tree builder would do with these is not followed: refuse.
    if (UNSAFE.has(name)) { unsafe = true; over = true; return; }
    const end = tagEnd(nameEnd);
    if (end < 0) { at = length; return; }
    const selfClosing = html.charCodeAt(end - 1) === 47 && FOREIGN.has(name);
    at = end + 1;
    if (!closing && name === "script") { at = scriptEnd(at); return; }
    if (!closing && RAW_TEXT.has(name)) { at = rawEnd(name, at); return; }
    if (skip) {
      if (skip === "head" && name === "body" && !closing) { skip = ""; depth = 0; } else if (name === skip) {
        if (closing) { depth -= 1; if (depth <= 0) { skip = ""; depth = 0; } } else if (!selfClosing) depth += 1;
      }
      return;
    }
    if (!closing && DROPPED.has(name)) {
      if (!selfClosing) { skip = name; depth = 1; }
      return;
    }
    if (name === "pre") pre = closing ? Math.max(0, pre - 1) : pre + 1;
    if (name === "br") pendingBreak = Math.min(2, pendingBreak + 1);
    else if (BREAKS.has(name)) { pendingBreak = Math.max(pendingBreak, BREAKS.get(name)); gap = ""; } else if (CELLS.has(name) && !closing) gap = "\t";
  }

  return {
    // Reads about `budget` more characters of input; true when the end is reached.
    run(budget = SOURCE_FILE_SLICE) {
      const stop = at + budget;
      while (at < length && at < stop && !over) step();
      return at >= length || over;
    },
    // True when the file holds a tag that is not followed (template, xmp,
    // plaintext): there is then no text, never part of it.
    unsafe: () => unsafe,
    text: () => (unsafe ? "" : chunks.join("")),
  };
}

export function htmlToText(html, limit = SOURCE_FILE_TEXT_LIMIT) {
  const job = createHtmlTextJob(html, limit);
  job.run(Infinity);
  return job.text();
}

// The bytes become text to be read: decoded, free of binary controls, with one
// kind of line end. The page of a "html" file is still markup at this point.
function readable({ name, bytes }) {
  const kind = fileKind(name);
  if (!kind) return refuse("unsupported");
  if (!bytes || bytes.byteLength > SOURCE_FILE_BYTE_LIMIT) return refuse("too-large");
  if (!bytes.byteLength) return refuse("empty");
  const decoded = decodeFileBytes(bytes);
  if (!decoded.ok) return decoded;
  if (BINARY.test(decoded.text)) return refuse("binary");
  return { ok: true, kind, text: lineEnds(decoded.text) };
}
function finished(kind, text) {
  if (text.length > SOURCE_FILE_TEXT_LIMIT) return refuse("too-long");
  if (!text.trim()) return refuse("empty");
  return { ok: true, kind, text };
}

// The whole step: refuse what is not readable plain text; otherwise return it.
export function extractFileText(file) {
  const read = readable(file);
  if (!read.ok) return read;
  if (read.kind !== "html") return finished(read.kind, read.text);
  const job = createHtmlTextJob(read.text);
  job.run(Infinity);
  return job.unsafe() ? refuse("unsafe-html") : finished(read.kind, lineEnds(job.text()));
}

const yieldToEvents = () => new Promise((resolve) => setTimeout(resolve, 0));
// The same, giving other work (Cancel, the deadline) a turn between slices of
// HTML. `alive()` false stops it at the next slice with "cancelled".
export async function extractFileTextAsync(file, { yieldNow = yieldToEvents, alive = () => true, slice = SOURCE_FILE_SLICE } = {}) {
  const read = readable(file);
  if (!read.ok || read.kind !== "html") return read.ok ? finished(read.kind, read.text) : read;
  const job = createHtmlTextJob(read.text);
  await yieldNow();
  while (alive() && !job.run(slice)) await yieldNow();
  if (!alive()) return refuse("cancelled");
  return job.unsafe() ? refuse("unsafe-html") : finished(read.kind, lineEnds(job.text()));
}

// A passage as the excerpt keeps it (trimmed), from the reader's selection.
// A cut through a surrogate pair is moved out to take the whole character.
export function selectPassage(text, start, end) {
  let from = Math.max(0, Math.min(start, end));
  let to = Math.min(text.length, Math.max(start, end));
  if (from > 0 && /[\uDC00-\uDFFF]/.test(text[from]) && /[\uD800-\uDBFF]/.test(text[from - 1])) from -= 1;
  if (to < text.length && /[\uDC00-\uDFFF]/.test(text[to]) && /[\uD800-\uDBFF]/.test(text[to - 1])) to += 1;
  const passage = text.slice(from, to).trim();
  if (!passage) return { ok: false, code: "no-selection", length: 0 };
  if (passage.length > SOURCE_PASSAGE_LIMIT) return { ok: false, code: "passage-too-long", length: passage.length };
  return { ok: true, text: passage, length: passage.length };
}

// A title to start from, never a path: the file name without folders, controls
// or bidirectional marks and overrides. It is the analyst's to edit; never cut for them.
const HIDDEN_CODES = [0x200e, 0x200f, 0x61c, 0x202a, 0x202b, 0x202c, 0x202d, 0x202e, 0x2066, 0x2067, 0x2068, 0x2069, 0x2028, 0x2029];
const HIDDEN_CHARS = new RegExp(`[${String.raw`\p{Cc}`}${HIDDEN_CODES.map((code) => String.fromCodePoint(code)).join("")}]`, "gu");
export function suggestedTitle(fileName) {
  const base = String(fileName ?? "").split(/[\\/]/).pop();
  return base.replace(HIDDEN_CHARS, " ").replace(/\s+/g, " ").trim();
}
