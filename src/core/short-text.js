/* "Short text": a shorter wording for a few on-screen help and message texts.
   The app screens ask for it through t(); exports and prompts never do, and
   a key without a short form falls back to the standard wording. */

export const TEXT_STYLES = Object.freeze(["standard", "short"]);

export function normalizeTextStyle(value) {
  return value === "short" ? "short" : "standard";
}

const SHORT_TEXT = Object.freeze({
  ar: Object.freeze({
    appSubtitle: "تتبّع من يريد ماذا، وكيف تُحكم حياة الناس، بمساعدك الذكي. لكل من يريد فهم ما وراء خبر، لا للباحثين والصحفيين وحدهم.",
    sourcesHelp: "الصق نصوصًا أو روابط، واذكر أسماء الملفات التي سترفقها في محادثة مساعد الذكاء الاصطناعي. يطلب الموجِّه من المساعد قراءتها والاستشهاد بكل ملف باسمه.",
    fileHelp: "نص أو Markdown أو CSV أو JSON أو HTML، حتى 2 ميغابايت. يُقرأ على هذا الجهاز. تختار المقتطفات التي تحفظها وترسلها. لا يُحتفظ بالملف الأصلي ولا يُرفق بمحادثة الذكاء الاصطناعي.",
    reviewIntro: "مصادرك أطول مما يتسع له موجِّه واحد هنا. ألغِ تحديد مقتطفات كاملة لاستبعادها من هذا الموجِّه فقط. لا يُقتطع شيء ولا يُرتَّب. قضيتك لا تتغير.",
    repairCopied: "تم نسخ موجِّه الإصلاح. أرسله في المحادثة نفسها، ثم الصق الإجابة المصحّحة في المربع تحت إجابتك.",
    completionCopied: "تم نسخ موجِّه الاستكمال. أرسله في المحادثة نفسها، ثم الصق الرد في المربع تحت إجابتك. ستُضاف الأجزاء الناقصة إلى إجابتك.",
    replyNotRead: "لا يحتوي هذا النص على ردّ يمكن قراءته. بقيت إجابتك كما هي. أرسل الموجِّه إلى الذكاء الاصطناعي، ثم الصق هنا جزء JSON من ردّه، الذي يبدأ بـ {.",
    jsonParseProblem: "لم نجد تحليلًا في هذا النص. انسخ إجابة الذكاء الاصطناعي كاملة (كتلة كود JSON) والصقها هنا. إذا أجاب بنص عادي، فاستخدم موجِّه الإصلاح لطلب JSON.",
  }),
  en: Object.freeze({
    appSubtitle: "Trace who wants what and how lives are governed, with your own AI assistant. For anyone seeking to understand a news story, not just researchers and journalists.",
    sourcesHelp: "Paste text or links. List the names of files you will attach in your AI chat. The prompt asks the assistant to read them and cite each file by name.",
    fileHelp: "Text, Markdown, CSV, JSON or HTML, up to 2 MB. Read on this device. You choose the passages to save and send. The original file is not kept or attached to the AI chat.",
    reviewIntro: "Your sources are too long for one prompt here. Untick whole passages to exclude them from this prompt only. Nothing is cut or ranked. Your case stays unchanged.",
    repairCopied: "Repair prompt copied. Send it in the same chat. Paste the corrected answer in the box under your answer.",
    completionCopied: "Completion prompt copied. Send it in the same chat. Paste the AI’s reply in the box under your answer. The missing parts are added to your answer.",
    replyNotRead: "No readable reply found in this text. Your answer is unchanged. Send the prompt to the AI, then paste the JSON part of its reply here, starting with {.",
    jsonParseProblem: "No analysis found in this text. Copy the AI’s whole answer (the JSON code block) and paste it here. If it answered in plain text, use the repair prompt to request JSON.",
  }),
  fr: Object.freeze({
    appSubtitle: "Avec votre propre assistant IA, explorez qui veut quoi et comment la vie des gens est gouvernée. Pour toute personne souhaitant comprendre l’actualité, pas seulement les chercheurs et les journalistes.",
    sourcesHelp: "Collez des textes ou des liens. Indiquez les noms des fichiers que vous joindrez dans la conversation avec votre assistant IA. Le prompt lui demande de les lire et de citer chaque fichier par son nom.",
    fileHelp: "Texte, Markdown, CSV, JSON ou HTML, jusqu’à 2 Mo. Le fichier est lu sur cet appareil. Vous choisissez les passages à enregistrer et à envoyer. Le fichier original n’est ni conservé ni joint à la conversation avec l’IA.",
    reviewIntro: "Vos sources sont trop longues pour un seul prompt ici. Décochez des passages entiers pour les exclure de ce prompt seulement. Rien n’est coupé ni classé. Votre dossier reste inchangé.",
    repairCopied: "Prompt de réparation copié. Envoyez-le dans la même conversation, puis collez la réponse corrigée dans la zone sous votre réponse.",
    completionCopied: "Prompt de complétion copié. Envoyez-le dans la même conversation. Collez la réponse de l’IA dans la zone sous votre réponse. Les parties manquantes sont ajoutées à votre réponse.",
    replyNotRead: "Aucune réponse lisible dans ce texte. Votre réponse reste inchangée. Envoyez le prompt à l’IA, puis collez ici la partie JSON de sa réponse, qui commence par {.",
    jsonParseProblem: "Aucune analyse trouvée dans ce texte. Copiez toute la réponse de l’IA (le bloc de code JSON) et collez-la ici. Si l’IA a répondu en texte simple, utilisez le prompt de réparation pour lui demander du JSON.",
  }),
});

export function shortText(lang, key) {
  return SHORT_TEXT[lang]?.[key];
}

export function shortTextKeys() {
  return Object.freeze({ ar: Object.keys(SHORT_TEXT.ar), en: Object.keys(SHORT_TEXT.en), fr: Object.keys(SHORT_TEXT.fr) });
}
