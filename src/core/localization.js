/* Cross-lens localization service with explicit fallback semantics. */

function pathValue(source, path) {
  return String(path)
    .split(".")
    .reduce((value, part) => value?.[part], source);
}

export function createLocalizationService({
  catalogs,
  supportedLanguages,
  fallbackLanguage = "en",
  resolve,
}) {
  const languages = Object.freeze([...new Set(supportedLanguages || [])]);
  if (!languages.length || !languages.includes(fallbackLanguage)) {
    throw new TypeError("Localization service requires its fallback language.");
  }

  const isSupported = (language) => languages.includes(language);
  const safeLanguage = (language) =>
    isSupported(language) ? language : fallbackLanguage;
  const raw = (language, key) =>
    pathValue(catalogs?.[safeLanguage(language)], key);

  function translate(language, key, context = {}) {
    const lang = safeLanguage(language);
    const resolved = resolve?.({
      language: lang,
      key,
      context,
      raw: (candidateKey) => raw(lang, candidateKey),
    });
    if (resolved !== undefined) return resolved;
    return raw(lang, key) ?? raw(fallbackLanguage, key) ?? key;
  }

  return Object.freeze({
    languages,
    fallbackLanguage,
    isSupported,
    safeLanguage,
    raw,
    translate,
  });
}

