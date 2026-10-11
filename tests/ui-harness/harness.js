// Deterministic component harness for the design-system kernel (UIX-1).
// Every control in every state, in the language, theme and density named in the
// URL (?lang=ar&theme=light&density=compact). tests/ui-kernel.spec.js checks it.
import { checkContracts } from "../../src/ui/contracts.js";
import { bindSegmented } from "../../src/ui/controls.js";

const STRINGS = {
  en: {
    title: "Kernel controls", lead: "Every base control of the design system, in each state.",
    buttons: "Buttons", open: "Open the analysis", continue: "Continue", cancel: "Cancel", next: "Next step", disabled: "Not available", menu: "Menu", remove: "Delete",
    choices: "Choices", language: "Language", theme: "Theme", system: "System", dark: "Dark", light: "Light", density: "Density", comfortable: "Comfortable", compact: "Compact",
    statuses: "Status", saved: "Saved", unsaved: "Unsaved changes", failed: "Not saved", idle: "Not started",
    chips: "Confidence", high: "High", medium: "Medium", low: "Low", unrated: "Unrated",
    fields: "Fields", question: "Your question", questionHelp: "One clear sentence. Add a place and a period.", questionHint: "e.g. Why did border health checks expand in 2024?",
    source: "Source address", sourceError: "This address is not a web link.", key: "Command palette",
    toast: "Report saved",
  },
  ar: {
    title: "عناصر النواة", lead: "كل عنصر أساسي في نظام التصميم، في كل حالة.",
    buttons: "الأزرار", open: "افتح التحليل", continue: "متابعة", cancel: "إلغاء", next: "الخطوة التالية", disabled: "غير متاح", menu: "القائمة", remove: "حذف",
    choices: "الاختيارات", language: "اللغة", theme: "المظهر", system: "النظام", dark: "داكن", light: "فاتح", density: "الكثافة", comfortable: "مريحة", compact: "مضغوطة",
    statuses: "الحالة", saved: "محفوظ", unsaved: "تغييرات غير محفوظة", failed: "لم يُحفظ", idle: "لم يبدأ",
    chips: "الثقة", high: "عالية", medium: "متوسطة", low: "منخفضة", unrated: "غير مقيّمة",
    fields: "الحقول", question: "سؤالك", questionHelp: "جملة واحدة واضحة. أضف مكانًا وفترة.", questionHint: "مثال: لماذا توسّعت الفحوص الصحية على الحدود في 2024؟",
    source: "عنوان المصدر", sourceError: "هذا العنوان ليس رابط ويب.", key: "لوحة الأوامر",
    toast: "حُفظ التقرير",
  },
  fr: {
    title: "Contrôles du noyau", lead: "Chaque contrôle de base du système de design, dans chaque état.",
    buttons: "Boutons", open: "Ouvrir l’analyse", continue: "Continuer", cancel: "Annuler", next: "Étape suivante", disabled: "Indisponible", menu: "Menu", remove: "Supprimer",
    choices: "Choix", language: "Langue", theme: "Thème", system: "Système", dark: "Sombre", light: "Clair", density: "Densité", comfortable: "Confortable", compact: "Compacte",
    statuses: "État", saved: "Enregistré", unsaved: "Modifications non enregistrées", failed: "Non enregistré", idle: "Pas commencé",
    chips: "Confiance", high: "Élevée", medium: "Moyenne", low: "Faible", unrated: "Non évaluée",
    fields: "Champs", question: "Votre question", questionHelp: "Une phrase claire. Ajoutez un lieu et une période.", questionHint: "ex. Pourquoi les contrôles sanitaires aux frontières se sont-ils étendus en 2024 ?",
    source: "Adresse de la source", sourceError: "Cette adresse n’est pas un lien web.", key: "Palette de commandes",
    toast: "Rapport enregistré",
  },
};

const params = new URLSearchParams(location.search);
const pick = (name, values, fallback) => (values.includes(params.get(name)) ? params.get(name) : fallback);
const lang = pick("lang", ["en", "ar", "fr"], "en");
const theme = pick("theme", ["system", "dark", "light"], "system");
const density = pick("density", ["comfortable", "compact"], "comfortable");
const root = document.documentElement;
root.lang = lang;
root.dir = lang === "ar" ? "rtl" : "ltr";
if (theme === "system") delete root.dataset.theme;
else root.dataset.theme = theme;
root.dataset.density = density;
const s = STRINGS[lang];

const seg = (name, values, current) => `
  <div class="j-seg" role="radiogroup" aria-label="${s[name]}" data-param="${name}">
    ${values.map((value) => `<button type="button" role="radio" aria-checked="${value === current}" data-value="${value}">${s[value] || value.toUpperCase()}</button>`).join("")}
  </div>`;
const menuIcon = `<svg class="j-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>`;
const nextIcon = `<svg class="j-icon" data-flip viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`;

document.getElementById("harness").innerHTML = `
  <header class="j-card">
    <p class="j-label">UIX-1 · ${lang.toUpperCase()} · ${s[theme]} · ${s[density]}</p>
    <h1>${s.title}</h1>
    <p>${s.lead}</p>
  </header>
  <section class="j-card" aria-labelledby="h-buttons">
    <h2 id="h-buttons">${s.buttons}</h2>
    <div class="row">
      <button type="button" class="j-btn" data-variant="primary">${s.open}</button>
      <button type="button" class="j-btn">${s.continue}</button>
      <button type="button" class="j-btn" data-variant="ghost">${s.cancel}</button>
      <button type="button" class="j-btn" data-variant="primary" data-size="lg">${s.next} ${nextIcon}</button>
      <button type="button" class="j-btn" data-size="icon" aria-label="${s.menu}">${menuIcon}</button>
      <button type="button" class="j-btn" disabled>${s.disabled}</button>
      <button type="button" class="j-btn" data-variant="danger">${s.remove}</button>
      <span>${s.key} <kbd class="j-kbd">Ctrl K</kbd></span>
    </div>
  </section>
  <section class="j-card" aria-labelledby="h-choices">
    <h2 id="h-choices">${s.choices}</h2>
    <div class="row">
      ${seg("language", ["ar", "en", "fr"], lang)}
      ${seg("theme", ["system", "dark", "light"], theme)}
      ${seg("density", ["comfortable", "compact"], density)}
    </div>
  </section>
  <section class="j-card" aria-labelledby="h-status">
    <h2 id="h-status">${s.statuses}</h2>
    <div class="row">
      <span class="j-status" data-tone="ok">${s.saved}</span>
      <span class="j-status" data-tone="warn">${s.unsaved}</span>
      <span class="j-status" data-tone="crit">${s.failed}</span>
      <span class="j-status" data-tone="idle">${s.idle}</span>
    </div>
    <p class="j-note" data-tone="ok">${s.saved}</p>
    <p class="j-note" data-tone="crit">${s.failed}</p>
    <p class="j-label">${s.chips}</p>
    <div class="row">
      <span class="j-chip" data-tone="ok">${s.high}</span>
      <span class="j-chip" data-tone="warn">${s.medium}</span>
      <span class="j-chip" data-tone="crit">${s.low}</span>
      <span class="j-chip">${s.unrated}</span>
    </div>
  </section>
  <section class="j-card" aria-labelledby="h-fields">
    <h2 id="h-fields">${s.fields}</h2>
    <div class="j-field">
      <label for="question">${s.question}</label>
      <textarea id="question" class="j-input" rows="3" placeholder="${s.questionHint}" aria-describedby="question-help"></textarea>
      <p class="j-help" id="question-help">${s.questionHelp}</p>
    </div>
    <div class="j-field">
      <label for="source">${s.source}</label>
      <input id="source" class="j-input" type="text" dir="ltr" value="javascript:alert(1)" aria-invalid="true" aria-describedby="source-error" />
      <p class="j-help" id="source-error">${s.sourceError}</p>
    </div>
  </section>
  <div class="j-toast" role="status">${s.toast}</div>
`;

// Changing a choice reloads the harness with that choice in the URL.
for (const group of document.querySelectorAll(".j-seg")) {
  bindSegmented(group, (value) => {
    const next = new URLSearchParams(location.search);
    next.set(group.dataset.param === "language" ? "lang" : group.dataset.param, value);
    location.search = `?${next}`;
  });
}

window.kernelHarness = { problems: () => checkContracts(document) };
document.documentElement.dataset.ready = "true";
