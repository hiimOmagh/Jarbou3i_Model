// RESEARCH-1D D3: what the case's sources carry into a prompt, and how much.
// Pure: no DOM, no storage, nothing is read from the page. The app gives it the
// case's sources and excerpts, the free-text "Supplied sources" box, the lens
// and the language; it gives back the exact text and its size as the prompt
// will carry it.
//
// Sizes are UTF-16 units of the *encoded* material: the Strategic prompt puts
// the context in a JSON string (every quote, backslash and control grows), the
// Biopolitical prompt breaks each closing-tag opener ("</" becomes "&lt;/").
// Whole passages go in or stay out; nothing is cut, ranked or dropped for the
// analyst. Constants are here once.

export const SOURCE_PROMPT_LIMIT = 8000;
export const SUPPLIED_PROMPT_LIMIT = 32000;

const LABELS = {
  en: ["Your sources", "Date of the source", "Opened on", "Excerpt"],
  ar: ["مصادرك", "تاريخ المصدر", "تاريخ الاطلاع", "مقتطف"],
  fr: ["Vos sources", "Date de la source", "Consultée le", "Extrait"],
};
const FREE_HEADING = { en: "Supplied sources", ar: "المصادر المقدمة", fr: "Sources fournies" };
const labelsOf = (lang) => LABELS[lang] || LABELS.en;
export const freeTextHeading = (lang) => FREE_HEADING[lang] || FREE_HEADING.en;

// "{n} passages left out of this prompt", with the plural forms of each language.
const LEFT_OUT = {
  en: { one: "1 passage left out of this prompt", other: "{n} passages left out of this prompt" },
  fr: { one: "{n} passage exclu de ce prompt", other: "{n} passages exclus de ce prompt" },
  ar: {
    one: "استُبعد مقتطف واحد من هذا الموجِّه",
    two: "استُبعد مقتطفان من هذا الموجِّه",
    few: "استُبعدت {n} مقتطفات من هذا الموجِّه",
    many: "استُبعد {n} مقتطفًا من هذا الموجِّه",
    other: "استُبعد {n} مقتطف من هذا الموجِّه",
  },
};
const RULES = new Map();
function category(lang, n) {
  if (!RULES.has(lang)) RULES.set(lang, new Intl.PluralRules(lang));
  return RULES.get(lang).select(n);
}
// `format` turns the number into the digits shown; the prompt keeps plain ones.
export function leftOutWords(lang, n, format = String) {
  const forms = LEFT_OUT[lang] || LEFT_OUT.en;
  const text = forms[category(LEFT_OUT[lang] ? lang : "en", n)] || forms.other;
  return text.replace("{n}", format(n));
}
// The short notice inside a source's block: a selection, nothing more.
const NOTICE = {
  en: {
    some: (left) => `Note: ${left}. Only the passages above are supplied; infer nothing about the rest of the source.`,
    none: (left) => `Note: ${left}. No passage of this source is supplied; infer nothing about its content.`,
  },
  ar: {
    some: (left) => `ملاحظة: ${left}. المقتطفات الواردة أعلاه هي المقدَّمة وحدها؛ لا تستنتج شيئًا عن بقية المصدر.`,
    none: (left) => `ملاحظة: ${left}. لم يُقدَّم أي مقتطف من هذا المصدر؛ لا تستنتج شيئًا عن محتواه.`,
  },
  fr: {
    some: (left) => `Remarque : ${left}. Seuls les passages ci-dessus sont fournis ; n’en déduisez rien sur le reste de la source.`,
    none: (left) => `Remarque : ${left}. Aucun passage de cette source n’est fourni ; n’en déduisez rien sur son contenu.`,
  },
};

// The context as the lens carries it. Both are exact for any text.
export function encodedLength(lens, text) {
  if (lens === "biopolitical") {
    let count = 0;
    for (let at = text.indexOf("</"); at >= 0; at = text.indexOf("</", at + 2)) count += 1;
    return text.length + count * 3;
  }
  return JSON.stringify(text).length - 2;
}

const LINE_ENDS = new RegExp("\r\n|[\n\r" + String.fromCharCode(0x2028, 0x2029) + "]");

// The source's own lines, then its passages, then the notice if some were left out.
// Exactly the text the prompt carried before there was a budget when nothing is left out.
function excerptLines(labels, excerpt) {
  return [
    `${labels[3]}${excerpt.locator ? ` (${excerpt.locator})` : ""}:`,
    ...excerpt.text.split(LINE_ENDS).map((line) => `> ${line}`),
  ];
}
function metadataLines(labels, source, ref) {
  const lines = [`${ref} ${source.title}`];
  if (source.url) lines.push(source.url);
  if (source.source_date) lines.push(`${labels[1]}: ${source.source_date}`);
  if (source.accessed_on) lines.push(`${labels[2]}: ${source.accessed_on}`);
  return lines;
}

/*
  planSourcePrompt({ lens, lang, sources, excerpts, enabled, excluded, freeText, precededByContext })
  - sources, excerpts: the case's lists, in the case's order (a source's reference
    [S3] is its place in the whole list, sent or not);
  - enabled: only "Sources supplied in context" sends case sources or the box;
  - excluded: a Set of excerpt ids left out of *this prompt*;
  - freeText: the box, trimmed; precededByContext: whether other context comes
    before (its separator belongs to the material that follows).
*/
export function planSourcePrompt({
  lens = "strategic",
  lang = "en",
  sources = [],
  excerpts = [],
  enabled = true,
  excluded = new Set(),
  freeText = "",
  precededByContext = false,
}) {
  const labels = labelsOf(lang);
  const measure = (text) => encodedLength(lens, text);
  const line = measure("\n");
  const separator = measure("\n\n");

  const build = (left) => {
    const entries = [];
    for (const source of enabled ? sources : []) {
      if (source.send !== true) continue;
      const ref = `[S${sources.indexOf(source) + 1}]`;
      const eligible = excerpts.filter((excerpt) => excerpt.source_id === source.source_id && excerpt.check?.status !== "differs");
      const kept = eligible.filter((excerpt) => !left.has(excerpt.excerpt_id));
      const omitted = eligible.length - kept.length;
      const head = metadataLines(labels, source, ref);
      const lines = [...head];
      for (const excerpt of kept) lines.push(...excerptLines(labels, excerpt));
      let notice = "";
      if (omitted) {
        const words = (NOTICE[lang] || NOTICE.en)[kept.length ? "some" : "none"];
        notice = words(leftOutWords(lang, omitted));
        lines.push(notice);
      }
      const text = lines.join("\n");
      const passages = eligible.map((excerpt) => {
        // What the passage adds to the block: its lines and the break before them.
        const own = excerptLines(labels, excerpt).join("\n");
        return {
          excerpt_id: excerpt.excerpt_id,
          locator: excerpt.locator || "",
          text: excerpt.text,
          size: measure(own) + line,
          selected: !left.has(excerpt.excerpt_id),
        };
      });
      entries.push({
        source_id: source.source_id,
        ref,
        title: source.title,
        text,
        size: measure(text),
        base: measure(head.join("\n")),
        passages,
        selectedCount: kept.length,
        omitted,
        notice,
      });
    }
    const section = entries.length ? `${labels[0]}:\n${entries.map((entry) => entry.text).join("\n\n")}` : "";
    const free = enabled && freeText ? `${freeTextHeading(lang)}:\n${freeText}` : "";
    const sectionSize = section ? measure(section) : 0;
    const freeSize = free ? measure(free) : 0;
    const joins = (section && free ? 1 : 0) + (precededByContext && (section || free) ? 1 : 0);
    return { entries, section, free, sectionSize, freeSize, total: sectionSize + freeSize + joins * separator };
  };

  const chosen = build(excluded);
  const overSources = chosen.entries.filter((entry) => entry.size > SOURCE_PROMPT_LIMIT).map((entry) => entry.source_id);
  const overTotal = chosen.total > SUPPLIED_PROMPT_LIMIT;

  // The verdict is about the current choice alone. Only when it fails is the
  // hypothetical "every passage left out" built, to say why choosing cannot help:
  // metadata, notices and the box over a cap. It never blocks a choice that fits
  // (its omission notices are longer than the passages it replaces may be).
  const blocked = [];
  if (overSources.length || overTotal) {
    const least = build(new Set(excerpts.map((excerpt) => excerpt.excerpt_id)));
    if (least.free && least.freeSize > SUPPLIED_PROMPT_LIMIT) blocked.push({ kind: "free-text", size: least.freeSize });
    for (const entry of least.entries) {
      if (entry.size > SOURCE_PROMPT_LIMIT) blocked.push({ kind: "source-metadata", source_id: entry.source_id, size: entry.size });
    }
    if (!blocked.length && least.total > SUPPLIED_PROMPT_LIMIT) blocked.push({ kind: "supplied-minimum", size: least.total });
  }
  return {
    lens,
    lang,
    entries: chosen.entries,
    sectionText: chosen.section,
    freeText: chosen.free,
    freeSize: chosen.freeSize,
    total: chosen.total,
    sourceLimit: SOURCE_PROMPT_LIMIT,
    totalLimit: SUPPLIED_PROMPT_LIMIT,
    overSources,
    overTotal,
    blocked,
    leftOut: chosen.entries.reduce((sum, entry) => sum + entry.omitted, 0),
    ok: !overSources.length && !overTotal && !blocked.length,
  };
}
