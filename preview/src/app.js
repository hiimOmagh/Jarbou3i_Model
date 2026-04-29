/* Jarbou3i Model v1.3.0 — stable editorial UI refresh */
'use strict';

const SETTINGS_KEY = 'jarbou3i-model-settings-v1';
const PILLARS = ['interests','actors','tools','narrative','results','feedback'];
const LAYER_IDS = { interests:'L1', actors:'L2', tools:'L3', narrative:'L4', results:'L5', feedback:'L6' };
const LAYER_CLASS = { interests:'l1', actors:'l2', tools:'l3', narrative:'l4', results:'l5', feedback:'l6' };
const COLORS = { interests:'var(--L1)', actors:'var(--L2)', tools:'var(--L3)', narrative:'var(--L4)', results:'var(--L5)', feedback:'var(--L6)' };
const $ = (id) => document.getElementById(id);
const qs = (sel, root=document) => root.querySelector(sel);
const qsa = (sel, root=document) => [...root.querySelectorAll(sel)];

const I18N = {
  en: {
    appTitle:'Jarbou3i Model', untitled:'untitled', waitingPaste:'waiting for paste', emptyHint:'no analysis yet · paste output to begin', themeTitle:'Toggle theme',
    source:'Source', messy:'Messy', input:'input', structure:'Structure', six:'Six', layers2:'layers', brief:'Brief', editorial:'Editorial', preview:'preview', awaitingPaste:'awaiting paste',
    welcomeEyebrow:'Tool guide', welcomeTitle:'Welcome to Jarbou3i Model', welcomeBody:'Define a topic, copy the prompt to your assistant, then paste the JSON result back here. The structure and brief will materialise as you do.',
    stages:['Topic','Prompt','Import','Review'], topicLabel:'Analysis topic', topicPlaceholder:'Example: Rise of the far right in Europe, 2022–2026', analysisLang:'Analysis language', assistantPreset:'Preferred assistant', promptMode:'Prompt mode', modeSimple:'Focused', modeExpert:'Expert', modeResearch:'Research', optionArabic:'Arabic', optionEnglish:'English', optionFrench:'French', timeframeLabel:'Time/geographic context', timeframePlaceholder:'Optional: 2022–2026, Europe',
    copyPrompt:'Copy prompt', previewPrompt:'Preview prompt', loadSample:'Load sample', editTopic:'Edit topic', topicStatusStart:'Enter a clear topic, then copy the prompt into your preferred assistant.', topicNeeded:'Enter an analysis topic first.', promptCopied:'Prompt copied. Open your assistant, paste it, then copy the JSON result into the import box.', promptPreview:'Prompt preview', copyShownText:'Copy shown text', copied:'Copied.', copyFailed:'Automatic copy failed. Copy the text from the preview window.',
    jsonLabel:'JSON result', jsonPlaceholder:'Paste JSON here...', importAnalysis:'Import analysis', repairPrompt:'JSON repair prompt', clear:'Clear', jsonWaiting:'Paste JSON to validate.', jsonValid:'Valid JSON. You can import the analysis now.', jsonInvalid:'Invalid or incomplete JSON. Use the repair prompt if needed.', jsonAutoRecovered:'Cleaned mixed text and extracted valid JSON automatically.', jsonParseProblem:'Could not parse JSON. Use the repair prompt.', analysisImported:'Analysis imported. You can now review the engine layers.', repairCopied:'Repair prompt copied.', sampleLoaded:'Sample loaded. You can review it or replace it with your own topic.',
    pastedText:'Pasted text', sources:'Sources', repaste:'Re-paste', restructure:'Restructure', parsed:'Parsed', schemaReady:'schema ready', items:'items', flagged:'flagged', thin:'Thin', sparse:'Sparse', exportBrief:'Export brief',
    interests:'Interests', actors:'Actors', tools:'Tools', narrative:'Narrative', results:'Results', feedback:'Feedback',
    L1summ:'What is structurally at stake — material, ideological, security pressures behind the cycle.', L2summ:'Parties, coalitions, media owners, regulators — who acts on which interest.', L3summ:'Instruments — economic, narrative, legal, algorithmic — translating interests into outcomes.', L4summ:'Frames — sovereignty, security, civilisational — that make tools palatable to publics.', L5summ:'Observable outcomes — seat shares, policy shifts, judicial reform, intended and unintended.', L6summ:'How outcomes reshape interests for the next cycle. The model\'s open question.',
    overview:'Overview', engine:'Layers', contradictions:'Contradictions', scenarios:'Scenarios', evidence:'Evidence', exports:'Export', quality:'Quality', topFindings:'Top findings', strategicBrief:'Strategic brief', thesis:'Executive thesis', noItems:'No items.', confidence:'Confidence', generatedReport:'Strategic analysis report', reportSubtitle:'Standalone strategic brief generated from the six-layer model.', downloadHtml:'Export HTML report',
    schema:'Schema', coverage:'Coverage', sourcing:'Sourcing', falsifier:'Falsifier', crossrefs:'Cross-refs', pubrisk:'Pub. risk', medium:'medium', autosaved:'autosaved', local:'local · client-side', expand:'expand rail', collapse:'collapse', risks:'risk', score:'Quality index', print:'Print', read:'Read', json:'JSON', briefAwaits:'Your brief will appear here', onceParsed:'once the JSON is parsed and structured',
    claim:'Claim', basis:'Basis', sourceNote:'Source note', assumption:'Assumption', risk:'Risk', test:'Falsifier test', actionsResults:'Actions / results', interpretation:'Interpretation', probability:'Probability', timeframe:'Timeframe', drivers:'Drivers', earlySignals:'Early signals', disprovenIf:'Disproven if', severityShort:'S'
  },
  fr: {
    appTitle:'Jarbou3i Model', untitled:'sans titre', waitingPaste:'en attente du collage', emptyHint:'aucune analyse · collez la sortie pour commencer', themeTitle:'Changer le thème',
    source:'Source', messy:'Brouillon', input:'d’entrée', structure:'Structure', six:'Six', layers2:'couches', brief:'Brief', editorial:'Aperçu', preview:'éditorial', awaitingPaste:'en attente du collage',
    welcomeEyebrow:'Guide de l’outil', welcomeTitle:'Bienvenue dans Jarbou3i Model', welcomeBody:'Définissez un sujet, copiez le prompt vers votre assistant, puis collez le résultat JSON ici. La structure et le brief se construiront au fur et à mesure.',
    stages:['Sujet','Prompt','Import','Revue'], topicLabel:'Sujet d’analyse', topicPlaceholder:'Exemple : montée de l’extrême droite en Europe, 2022–2026', analysisLang:'Langue d’analyse', assistantPreset:'Assistant préféré', promptMode:'Mode du prompt', modeSimple:'Ciblé', modeExpert:'Expert', modeResearch:'Recherche', optionArabic:'Arabe', optionEnglish:'Anglais', optionFrench:'Français', timeframeLabel:'Contexte temporel/géographique', timeframePlaceholder:'Optionnel : 2022–2026, Europe',
    copyPrompt:'Copier le prompt', previewPrompt:'Aperçu du prompt', loadSample:'Charger un exemple', editTopic:'Modifier le sujet', topicStatusStart:'Entrez un sujet clair, puis copiez le prompt dans votre assistant préféré.', topicNeeded:'Entrez d’abord un sujet d’analyse.', promptCopied:'Prompt copié. Ouvrez votre assistant, collez-le, puis copiez le JSON dans la zone d’import.', promptPreview:'Aperçu du prompt', copyShownText:'Copier le texte affiché', copied:'Copié.', copyFailed:'La copie automatique a échoué. Copiez le texte depuis la fenêtre.',
    jsonLabel:'Résultat JSON', jsonPlaceholder:'Collez le JSON ici...', importAnalysis:'Importer l’analyse', repairPrompt:'Prompt de réparation JSON', clear:'Effacer', jsonWaiting:'Collez le JSON pour validation.', jsonValid:'JSON valide. Vous pouvez importer l’analyse.', jsonInvalid:'JSON invalide ou incomplet. Utilisez le prompt de réparation si nécessaire.', jsonAutoRecovered:'Texte nettoyé et JSON valide extrait automatiquement.', jsonParseProblem:'Impossible d’analyser le JSON. Utilisez le prompt de réparation.', analysisImported:'Analyse importée. Vous pouvez maintenant examiner les couches.', repairCopied:'Prompt de réparation copié.', sampleLoaded:'Exemple chargé. Vous pouvez l’examiner ou le remplacer.',
    pastedText:'Texte collé', sources:'Sources', repaste:'Recoller', restructure:'Restructurer', parsed:'Analysé', schemaReady:'schéma prêt', items:'éléments', flagged:'signalés', thin:'Mince', sparse:'Lacunaire', exportBrief:'Exporter le brief',
    interests:'Intérêts', actors:'Acteurs', tools:'Outils', narrative:'Récit', results:'Résultats', feedback:'Rétroaction',
    L1summ:'Ce qui est structurellement en jeu — pressions matérielles, idéologiques, sécuritaires.', L2summ:'Partis, coalitions, propriétaires de médias, régulateurs — qui agit sur quel intérêt.', L3summ:'Instruments économiques, narratifs, juridiques, algorithmiques qui traduisent les intérêts en résultats.', L4summ:'Cadres — souveraineté, sécurité, civilisationnel — qui rendent les outils acceptables.', L5summ:'Résultats observables — sièges, virages politiques, réformes judiciaires, voulus et non voulus.', L6summ:'Comment les résultats remodèlent les intérêts pour le cycle suivant.',
    overview:'Synthèse', engine:'Couches', contradictions:'Contradictions', scenarios:'Scénarios', evidence:'Preuves', exports:'Export', quality:'Qualité', topFindings:'Résultats clés', strategicBrief:'Brief stratégique', thesis:'Thèse exécutive', noItems:'Aucun élément.', confidence:'Confiance', generatedReport:'Rapport d’analyse stratégique', reportSubtitle:'Brief stratégique autonome généré depuis le modèle à six couches.', downloadHtml:'Exporter le rapport HTML',
    schema:'Schéma', coverage:'Couverture', sourcing:'Sources', falsifier:'Falsificateur', crossrefs:'Réf. croisées', pubrisk:'Risque pub.', medium:'moyen', autosaved:'sauvegardé', local:'local · côté client', expand:'déplier', collapse:'replier', risks:'risque', score:'Indice qualité', print:'Imprimer', read:'Lire', json:'JSON', briefAwaits:'Votre brief apparaîtra ici', onceParsed:'une fois le JSON analysé et structuré',
    claim:'Énoncé', basis:'Base', sourceNote:'Note de source', assumption:'Hypothèse', risk:'Risque', test:'Test de réfutation', actionsResults:'Actions / résultats', interpretation:'Interprétation', probability:'Probabilité', timeframe:'Horizon', drivers:'Moteurs', earlySignals:'Signaux précoces', disprovenIf:'Réfuté si', severityShort:'S'
  },
  ar: {
    appTitle:'نموذج جربوعي', untitled:'بلا عنوان', waitingPaste:'بانتظار اللصق', emptyHint:'لا يوجد تحليل · الصق المخرجات للبدء', themeTitle:'تبديل الوضع',
    source:'المصدر', messy:'مُدخل', input:'خام', structure:'البنية', six:'ست', layers2:'طبقات', brief:'المُلخّص', editorial:'معاينة', preview:'تحريرية', awaitingPaste:'بانتظار اللصق',
    welcomeEyebrow:'دليل الأداة', welcomeTitle:'مرحبًا بك في نموذج جربوعي', welcomeBody:'حدِّد موضوعًا، انسخ البرومبت إلى مساعدك، ثم الصق نتيجة JSON هنا. ستتشكَّل البنية والمُلخّص أمامك.',
    stages:['الموضوع','البرومبت','الاستيراد','المراجعة'], topicLabel:'موضوع التحليل', topicPlaceholder:'مثال: صعود اليمين المتطرف في أوروبا 2022–2026', analysisLang:'لغة التحليل', assistantPreset:'المساعد المفضل', promptMode:'نمط البرومبت', modeSimple:'مركّز', modeExpert:'خبير', modeResearch:'بحثي', optionArabic:'العربية', optionEnglish:'الإنجليزية', optionFrench:'الفرنسية', timeframeLabel:'السياق الزمني/الجغرافي', timeframePlaceholder:'اختياري: 2022–2026، أوروبا',
    copyPrompt:'انسخ البرومبت', previewPrompt:'معاينة البرومبت', loadSample:'تحميل مثال', editTopic:'تعديل الموضوع', topicStatusStart:'أدخل موضوعًا واضحًا ثم انسخ البرومبت إلى مساعدك المفضل.', topicNeeded:'أدخل موضوع التحليل أولًا.', promptCopied:'تم نسخ البرومبت. افتح مساعدك، الصقه، ثم انسخ JSON الناتج إلى خانة الاستيراد.', promptPreview:'معاينة البرومبت', copyShownText:'نسخ النص المعروض', copied:'تم النسخ.', copyFailed:'تعذّر النسخ تلقائيًا. انسخ النص من نافذة المعاينة.',
    jsonLabel:'نتيجة JSON', jsonPlaceholder:'الصق JSON هنا...', importAnalysis:'استيراد التحليل', repairPrompt:'برومبت إصلاح JSON', clear:'مسح', jsonWaiting:'الصق نتيجة JSON للتحقق.', jsonValid:'JSON صالح. يمكنك الآن استيراد التحليل.', jsonInvalid:'JSON غير صالح أو غير مكتمل. استخدم برومبت الإصلاح إذا لزم.', jsonAutoRecovered:'تم تنظيف النص واستخراج JSON صالح تلقائيًا.', jsonParseProblem:'تعذّر فهم JSON. استخدم برومبت الإصلاح.', analysisImported:'تم استيراد التحليل. يمكنك الآن مراجعة الطبقات.', repairCopied:'تم نسخ برومبت الإصلاح.', sampleLoaded:'تم تحميل مثال تجريبي. يمكنك مراجعته أو استبداله.',
    pastedText:'نص ملصوق', sources:'مصادر', repaste:'إعادة لصق', restructure:'إعادة هيكلة', parsed:'محلَّل', schemaReady:'المخطط جاهز', items:'عنصر', flagged:'مُعلَّم', thin:'رقيق', sparse:'شحيح', exportBrief:'تصدير المُلخّص',
    interests:'المصالح', actors:'الفاعلون', tools:'الأدوات', narrative:'السرد', results:'النتائج', feedback:'التغذية الراجعة',
    L1summ:'ما هو على المحك بنيوياً — ضغوط مادية وأيديولوجية وأمنية خلف الدورة.', L2summ:'الأحزاب والائتلافات وأصحاب الإعلام والمنظِّمون — من يتحرَّك على أي مصلحة.', L3summ:'الأدوات الاقتصادية والسردية والقانونية والخوارزمية التي تترجم المصالح إلى نتائج.', L4summ:'الأطر — السيادة والأمن والحضاري — التي تجعل الأدوات مقبولة لدى الجمهور.', L5summ:'النتائج الملحوظة — حصص المقاعد وتحوُّلات السياسات وإصلاح القضاء، المقصودة وغير المقصودة.', L6summ:'كيف تعيد النتائج تشكيل المصالح للدورة التالية.',
    overview:'الخلاصة', engine:'الطبقات', contradictions:'التناقضات', scenarios:'السيناريوهات', evidence:'الأدلة', exports:'التصدير', quality:'الجودة', topFindings:'أبرز النتائج', strategicBrief:'مُلخّص استراتيجي', thesis:'الأطروحة التنفيذية', noItems:'لا توجد عناصر.', confidence:'الثقة', generatedReport:'تقرير تحليل استراتيجي', reportSubtitle:'مُلخّص استراتيجي مستقل مولّد من نموذج الطبقات الست.', downloadHtml:'تصدير تقرير HTML',
    schema:'المخطط', coverage:'التغطية', sourcing:'المصادر', falsifier:'المُفنِّد', crossrefs:'الإحالات', pubrisk:'خطر النشر', medium:'متوسط', autosaved:'محفوظ', local:'محلي · جانب العميل', expand:'توسيع', collapse:'طيّ', risks:'خطر', score:'مؤشر الجودة', print:'طباعة', read:'قراءة', json:'JSON', briefAwaits:'سيظهر مُلخّصك هنا', onceParsed:'بمجرد تحليل JSON وهيكلته',
    claim:'ادعاء', basis:'الأساس', sourceNote:'ملاحظة المصدر', assumption:'افتراض', risk:'المخاطر', test:'اختبار النقض', actionsResults:'الأفعال / النتائج', interpretation:'التفسير', probability:'الاحتمال', timeframe:'الإطار الزمني', drivers:'المحركات', earlySignals:'إشارات مبكرة', disprovenIf:'يُبطل إذا', severityShort:'شدة'
  }
};

const savedSettings = (() => { try { return JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}'); } catch { return {}; } })();
let state = {
  lang: ['ar','en','fr'].includes(savedSettings.lang) ? savedSettings.lang : 'ar',
  stage: 'topic', topic: '', context: '', analysisLang: ['ar','en','fr'].includes(savedSettings.lang) ? savedSettings.lang : 'ar',
  assistant: 'chatgpt', promptMode: 'simple', analysis: null, jsonValid: false, activeReview: 'overview', activePillar: 'interests', lastPrompt: '', rawJson: ''
};

function t(key){ return I18N[state.lang]?.[key] ?? I18N.en[key] ?? key; }
function escapeHtml(value){ return String(value ?? '').replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch])); }
function arr(v){ return Array.isArray(v) ? v : (v ? [v] : []); }
function normalizeArray(v){ return Array.isArray(v) ? v : (Array.isArray(v?.items) ? v.items : []); }
function idOf(item, fallback){ return String(item?.id || fallback || '').replace(/[^A-Za-z0-9_-]/g,'-'); }
function sectionLabel(p){ return t(p); }
function layerSummary(p){ return t(`${LAYER_IDS[p]}summ`); }
function confidenceClass(v){ const s=String(v||'').toLowerCase(); return /high|عال|haute/.test(s)?'h':(/low|ضعيف|منخفض|faible/.test(s)?'l':'m'); }
function confidenceLabel(v){ const s=String(v||'').trim(); if(!s) return state.lang==='ar'?'متوسط':state.lang==='fr'?'Moyen':'Med'; return s.length > 8 ? s.slice(0,8) : s; }
function valuePct(v){ return Math.max(0, Math.min(100, Number.isFinite(Number(v)) ? Number(v) : 0)); }
function safeFileSlug(s){ return String(s||'jarbou3i-brief').toLowerCase().replace(/[^a-z0-9\u0600-\u06ff]+/gi,'-').replace(/^-+|-+$/g,'').slice(0,80) || 'jarbou3i-brief'; }
function saveSettings(){ localStorage.setItem(SETTINGS_KEY, JSON.stringify({ lang: state.lang })); }

function setLang(lang){
  state.lang = lang; saveSettings();
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.body.dataset.lang = lang;
  qsa('[data-i18n]').forEach(el => { const key=el.dataset.i18n; if(I18N[lang]?.[key] !== undefined) el.innerHTML = I18N[lang][key]; });
  qsa('[data-i18n-placeholder]').forEach(el => { const key=el.dataset.i18nPlaceholder; if(I18N[lang]?.[key] !== undefined) el.placeholder = I18N[lang][key]; });
  qsa('[data-i18n-title]').forEach(el => { const key=el.dataset.i18nTitle; if(I18N[lang]?.[key] !== undefined){ el.title = I18N[lang][key]; el.setAttribute('aria-label', I18N[lang][key]); } });
  qsa('[data-i18n-option]').forEach(el => { const key=el.dataset.i18nOption; if(I18N[lang]?.[key] !== undefined) el.textContent = I18N[lang][key]; });
  qsa('.lang button').forEach(btn => { const on=btn.dataset.lang===lang; btn.classList.toggle('on',on); btn.setAttribute('aria-selected', on ? 'true':'false'); });
  $('analysisLang').value = state.analysisLang || lang;
  renderAll();
}
function setTheme(isLight){ document.body.classList.toggle('themeLight', isLight); document.body.classList.toggle('dark', !isLight); $('themeBtn').setAttribute('aria-pressed', String(!isLight)); }

function buildSchema(lang=state.analysisLang, mode=state.promptMode){
  const labels = lang === 'ar' ? 'اكتب كل الحقول النصية باللغة العربية.' : lang === 'fr' ? 'Écris les champs textuels en français.' : 'Write all textual fields in English.';
  return `${labels}\nReturn JSON only with: schema_version, subject{title,context,question,executive_thesis}, interests[], actors[], tools[], narrative[], results[], feedback[], contradictions{items[]}, scenarios{items[]}, evidence{items[]}, assumptions{items[]}, links[]. Each item should include id and confidence when possible.`;
}
function buildPrompt(){
  const lang=$('analysisLang').value; state.analysisLang=lang; state.assistant=$('assistantPreset').value; state.promptMode=$('promptMode').value; state.topic=$('topicInput').value.trim(); state.context=$('timeframeInput').value.trim();
  const ar=lang==='ar', fr=lang==='fr';
  const modeText = state.promptMode === 'research'
    ? (ar?'بحثي: أضف أدلة مصدرية، أدلة مضادة، عدم يقين، وروابط سببية مرقمة.':fr?'Recherche : ajoute des preuves sourcées, des contre-preuves, de l’incertitude et des liens causaux identifiés.':'Research: include source-grounded evidence, counter-evidence, uncertainty, and ID-based causal links.')
    : state.promptMode === 'expert'
      ? (ar?'خبير: أضف الأدلة، الافتراضات، والروابط السببية.':fr?'Expert : ajoute des preuves, des hypothèses et des liens causaux.':'Expert: include evidence, assumptions, and causal links.')
      : (ar?'مركّز: ركّز على الطبقات الست، التناقضات، والسيناريوهات.':fr?'Ciblé : priorise les six couches, les contradictions et les scénarios.':'Focused: prioritize the six layers, contradictions, and scenarios.');
  if(ar) return `أنت محلل استراتيجي صارم. حلّل الموضوع التالي باستخدام نموذج: مصالح → فاعلون → أدوات → سردية → نتائج → تغذية راجعة.\n\nالموضوع: ${state.topic}\nالسياق: ${state.context || 'غير محدد'}\nالنمط: ${modeText}\n\nقواعد مهمة:\n- اكتب كل محتوى التحليل باللغة العربية.\n- لا تُرجع أي شرح خارج JSON.\n- فرّق بين الملاحظة والاستنتاج والتقدير عندما يكون ذلك مطلوبًا.\n- في السيناريوهات: أضف شروطًا واضحة تُضعف أو تُبطل السيناريو.\n\nالمخطط المطلوب:\n${buildSchema(lang,state.promptMode)}`;
  if(fr) return `Vous êtes un analyste stratégique rigoureux. Analysez le sujet suivant avec le modèle : Intérêts → Acteurs → Outils → Récit → Résultats → Rétroaction.\n\nSujet : ${state.topic}\nContexte : ${state.context || 'non spécifié'}\nMode : ${modeText}\n\nRègles :\n- Écrivez toute l’analyse en français.\n- Retournez uniquement du JSON valide.\n- Séparez observation, inférence et estimation lorsque nécessaire.\n- Dans les scénarios, ajoutez des conditions qui affaiblissent ou réfutent chaque scénario.\n\nSchéma requis :\n${buildSchema(lang,state.promptMode)}`;
  return `You are a rigorous strategic analyst. Analyze the following topic using the model: Interests → Actors → Tools → Narrative → Results → Feedback.\n\nTopic: ${state.topic}\nContext: ${state.context || 'not specified'}\nMode: ${modeText}\n\nRules:\n- Write all analysis content in English.\n- Return valid JSON only. No explanation outside JSON.\n- Separate observation, inference, and estimate where relevant.\n- In scenarios, include clear conditions that would weaken or disprove each scenario.\n\nRequired schema:\n${buildSchema(lang,state.promptMode)}`;
}
function cleanJsonCandidate(text){
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i); if(fenced) return fenced[1].trim();
  const firstObj = trimmed.indexOf('{'), firstArr = trimmed.indexOf('[');
  const start = firstObj === -1 ? firstArr : firstArr === -1 ? firstObj : Math.min(firstObj, firstArr);
  const last = Math.max(trimmed.lastIndexOf('}'), trimmed.lastIndexOf(']'));
  return start >= 0 && last > start ? trimmed.slice(start,last+1) : trimmed;
}
function extractJson(text){ return JSON.parse(cleanJsonCandidate(text)); }
function normalizeAnalysis(raw){
  const data = Array.isArray(raw) ? { subject:{ title: state.topic || 'Untitled analysis' }, interests: raw } : (raw || {});
  const subject = { title:data.subject?.title || data.title || state.topic || 'Untitled analysis', context:data.subject?.context || data.context || state.context || '', question:data.subject?.question || data.question || '', executive_thesis:data.subject?.executive_thesis || data.executive_thesis || data.thesis || '' };
  const analysis = { ...data, schema_version: data.schema_version || 'strategic-analysis@2', subject };
  PILLARS.forEach(p => { analysis[p] = normalizeArray(data[p]).map((x,i)=>({ id:x.id || `${p[0].toUpperCase()}${i+1}`, ...x })); });
  analysis.contradictions = { items: normalizeArray(data.contradictions?.items || data.contradictions).map((x,i)=>({ id:x.id || `C${i+1}`, ...x })) };
  analysis.scenarios = { items: normalizeArray(data.scenarios?.items || data.scenarios).map((x,i)=>({ id:x.id || `S${i+1}`, ...x })) };
  analysis.evidence = { items: normalizeArray(data.evidence?.items || data.evidence).map((x,i)=>({ id:x.id || `E${i+1}`, ...x })) };
  analysis.assumptions = { items: normalizeArray(data.assumptions?.items || data.assumptions).map((x,i)=>({ id:x.id || `AS${i+1}`, ...x })) };
  analysis.links = normalizeArray(data.links);
  return analysis;
}
function validateJsonInput(){
  const text=$('jsonInput').value.trim();
  if(!text){ state.jsonValid=false; $('importBtn').disabled=true; $('repairPromptBtn').disabled=true; $('jsonStatus').className='status'; $('jsonStatus').textContent=t('jsonWaiting'); return null; }
  try{
    const raw=extractJson(text); const analysis=normalizeAnalysis(raw);
    const has = PILLARS.some(p=>analysis[p].length) || analysis.contradictions.items.length || analysis.scenarios.items.length;
    if(!has) throw new Error('incomplete');
    state.jsonValid=true; $('importBtn').disabled=false; $('repairPromptBtn').disabled=false; $('jsonStatus').className='status good'; $('jsonStatus').textContent=/^[\s\n]*[\[{]/.test(text)?t('jsonValid'):t('jsonAutoRecovered'); return analysis;
  }catch(err){ state.jsonValid=false; $('importBtn').disabled=true; $('repairPromptBtn').disabled=false; $('jsonStatus').className='status bad'; $('jsonStatus').textContent=t('jsonParseProblem'); return null; }
}
function repairPrompt(){ return `${state.analysisLang==='ar'?'أصلح النص التالي ليصبح JSON صالحًا فقط ومتوافقًا مع المخطط. لا تكتب أي شرح خارج JSON.':state.analysisLang==='fr'?'Répare le texte suivant pour produire uniquement un JSON valide compatible avec le schéma. N’écris aucune explication hors JSON.':'Repair the following text into valid JSON only, matching the required schema. Do not write any explanation outside JSON.'}\n\n${$('jsonInput').value.trim()}\n\n${buildSchema(state.analysisLang,state.promptMode)}`; }
async function copyText(text){ try{ await navigator.clipboard.writeText(text); return true; }catch{ return false; } }
function toast(message){ const el=$('toast'); el.textContent=message; el.classList.add('show'); setTimeout(()=>el.classList.remove('show'),2600); }
function showModal(title,content){ $('modalTitle').textContent=title; $('modalContent').textContent=content; const b=$('modalBackdrop'); b.classList.add('show'); b.setAttribute('aria-hidden','false'); setTimeout(()=>qs('.modal')?.focus(),0); }
function closeModal(){ const b=$('modalBackdrop'); b.classList.remove('show'); b.setAttribute('aria-hidden','true'); }
function download(name,text,type='text/plain'){ const blob=new Blob([text],{type}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=name; document.body.appendChild(a); a.click(); setTimeout(()=>{URL.revokeObjectURL(a.href); a.remove();},200); }

function countFor(p){ return state.analysis ? state.analysis[p].length : 0; }
function totalItems(){ return state.analysis ? PILLARS.reduce((n,p)=>n+countFor(p),0) : 0; }
function evidenceCount(){ return state.analysis ? state.analysis.evidence.items.length : 0; }
function contradictionCount(){ return state.analysis ? state.analysis.contradictions.items.length : 0; }
function scenarioCount(){ return state.analysis ? state.analysis.scenarios.items.length : 0; }
function falsifierMissing(){ return state.analysis ? state.analysis.scenarios.items.filter(s=>!arr(s.disproven_if).length).length + (countFor('feedback') ? 0 : 1) : 1; }
function schemaHealth(a=state.analysis){ if(!a) return { pct:0, missing:PILLARS, next:t('jsonWaiting') }; const missing=PILLARS.filter(p=>!a[p].length); const pct=Math.round(((PILLARS.length-missing.length)/PILLARS.length)*100); return { pct, missing, next: missing.length ? `${t('schemaReady')}: ${missing.map(sectionLabel).join(', ')}` : t('analysisImported') }; }
function actorPowerScore(actor){ const vals=['financial','decision_access','disruption_capacity','media_influence'].map(k=>Number(actor?.[k])).filter(Number.isFinite); return vals.length ? Math.round(vals.reduce((a,b)=>a+b,0)/vals.length*20) : confidenceScore(actor?.confidence); }
function confidenceScore(v){ const s=String(v||'').toLowerCase(); if(/high|عال|haute/.test(s)) return 90; if(/low|ضعيف|منخفض|faible/.test(s)) return 35; return 62; }
function scoreBreakdown(a=state.analysis){ if(!a) return { overall:0, completeness:0, sourcing:0, contradictions:0, falsifiability:0, crossrefs:0, readiness:0 };
  const completeness=schemaHealth(a).pct;
  const sourcing=Math.min(100, Math.round((evidenceCount()/Math.max(1,totalItems()/4))*70 + (a.evidence.items.some(e=>e.basis==='source_based')?30:0)));
  const contradictions=Math.min(100, contradictionCount()*34);
  const falsifiability=Math.max(0, 100 - falsifierMissing()*35);
  const crossrefs=a.links?.length ? 100 : 60;
  const readiness=Math.round((completeness*.35)+(sourcing*.2)+(contradictions*.15)+(falsifiability*.2)+(crossrefs*.1));
  return { overall:readiness, completeness, sourcing, contradictions, falsifiability, crossrefs, readiness };
}
function qualityGateHtml(a=state.analysis){ const s=scoreBreakdown(a); const risk=s.readiness>=80?'ok':s.readiness>=55?'warn':'bad'; return `<div class="qualityCard ${risk}"><strong>${t('pubrisk')}</strong><span>${risk==='ok'?'low':risk==='warn'?t('medium'):'high'}</span></div>`; }
function scoreFormulaText(){ return 'Overall = 35% coverage + 20% sourcing + 15% contradiction quality + 20% falsifiability + 10% cross-reference integrity.'; }
function scoreWeights(){ return { coverage:35, sourcing:20, contradictions:15, falsifiability:20, crossrefs:10 }; }

function renderStages(){ const steps=t('stages'); const index={topic:0,prompt:1,import:2,review:3}[state.stage] ?? 0; $('stageBar').innerHTML=steps.map((s,i)=>`<div class="stageItem ${i<index?'done':''} ${i===index?'active':''}" ${i===index?'aria-current="step"':''}><span class="num">${i+1}</span><span>${escapeHtml(s)}</span></div>`).join(''); }
function renderLegend(){ $('sourceLegend').innerHTML=PILLARS.map((p,i)=>`<span class="lg" style="--c:${COLORS[p]}"><span class="ord">L${String(i+1).padStart(2,'0')}</span><span class="sw"></span>${escapeHtml(sectionLabel(p))}</span>`).join(''); }
function itemTitle(item){ return item.name || item.title || item.description || item.claim || item.assumption || item.rationale || '—'; }
function renderConf(v){ const cls=confidenceClass(v); return `<span class="conf ${cls}">${escapeHtml(confidenceLabel(v))}<span class="bars"><i></i><i></i><i></i></span></span>`; }
function renderEngineNav(){
  const analysis=state.analysis;
  const emptyText = PILLARS.map((p,i)=>`<article class="layer ${LAYER_CLASS[p]} collapsed"><div class="layerRow"><div class="ord">L<b>${String(i+1).padStart(2,'0')}</b></div><div class="name">${escapeHtml(sectionLabel(p))}</div><span class="ct">0 ${escapeHtml(t('items'))}</span><span class="stat empty"><span class="g">○</span>${escapeHtml(t('awaitingPaste'))}</span></div><p class="layerSumm">${escapeHtml(layerSummary(p))}</p></article>`).join('');
  if(!analysis){ $('engineNav').innerHTML=emptyText; $('structureMeter').innerHTML=`${escapeHtml(t('schemaReady'))}<br>strategic-analysis@2`; $('parseBar').style.width='0%'; $('parsePct').textContent='0%'; return; }
  $('structureMeter').innerHTML=`<b>${totalItems()}</b> ${escapeHtml(t('items'))} · <b>${flaggedItems()}</b> ${escapeHtml(t('flagged'))}<br>schema <b>${escapeHtml(analysis.schema_version || 'strategic-analysis@2')}</b>`;
  $('parseBar').style.width='100%'; $('parsePct').textContent='100%';
  $('engineNav').innerHTML=PILLARS.map((p,i)=>{
    const items=analysis[p]; const status=items.length?'<span class="stat"><span class="g">✓</span>'+escapeHtml(t('parsed'))+'</span>':'<span class="stat empty"><span class="g">○</span>'+escapeHtml(t('sparse'))+'</span>';
    const open=state.activePillar===p;
    return `<article class="layer ${LAYER_CLASS[p]} ${open?'active':'collapsed'}" data-layer="${p}" tabindex="0" role="button" aria-expanded="${open}"><div class="layerRow"><div class="ord">L<b>${String(i+1).padStart(2,'0')}</b></div><div class="name">${escapeHtml(sectionLabel(p))}</div><span class="ct"><b>${items.length}</b> ${escapeHtml(t('items'))}</span>${status}</div><p class="layerSumm">${escapeHtml(layerSummary(p))}</p><div class="items">${items.map((item,idx)=>`<div class="item ${isFlagged(item)?'flagged':''}" data-bind="${escapeHtml(idOf(item,p+idx))}"><span class="iid">${escapeHtml(item.id || `${p[0].toUpperCase()}${idx+1}`)}</span><span class="label">${escapeHtml(itemTitle(item))}</span><span class="ev">${evidenceRefsFor(item).length || ''} ev</span>${renderConf(item.confidence)}</div>`).join('') || `<div class="item"><span></span><span class="label muted">${escapeHtml(t('noItems'))}</span></div>`}</div></article>`;
  }).join('');
  qsa('.layer').forEach(layer=>{ layer.onclick=(e)=>{ if(e.target.closest('.item')) return; state.activePillar=layer.dataset.layer; renderEngineNav(); }; layer.onkeydown=e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); layer.click(); } }; });
  qsa('.item[data-bind]').forEach(el=>{ el.onclick=(e)=>{ e.stopPropagation(); pulseAndScroll(el.dataset.bind); }; });
}
function isFlagged(item){ return confidenceClass(item.confidence)==='l' || /unsourced|weak|missing|disputed|غير|ضعيف|faible/i.test(JSON.stringify(item)); }
function flaggedItems(){ return state.analysis ? PILLARS.reduce((n,p)=>n+state.analysis[p].filter(isFlagged).length,0) : 0; }
function evidenceRefsFor(item){ return arr(item.evidence_ids || item.evidence || item.sources || item.source_ids); }
function renderRawSource(){
  if(!state.analysis){ $('rawSource').innerHTML=''; return; }
  const a=state.analysis;
  const parts=[];
  parts.push(`<span class="secmark">— ${escapeHtml(t('topic'))}</span><p>${escapeHtml(a.subject.title)} ${a.subject.context?`<span class="num">${escapeHtml(a.subject.context)}</span>`:''}</p>`);
  parts.push(`<span class="secmark">— ${escapeHtml(t('thesis'))}</span><p>${highlightText(a.subject.executive_thesis || a.subject.question || a.subject.title)}</p>`);
  PILLARS.forEach(p=>{
    parts.push(`<span class="secmark">— ${escapeHtml(sectionLabel(p))}</span>`);
    const text=a[p].slice(0,4).map(x=>`<p><span class="h-${p}" data-bind="${escapeHtml(idOf(x))}">${escapeHtml(itemTitle(x))}</span>${x.rationale?`: ${escapeHtml(x.rationale)}`:''}</p>`).join('') || `<p class="muted">${escapeHtml(t('noItems'))}</p>`;
    parts.push(text);
  });
  if(a.contradictions.items.length) parts.push(`<span class="secmark">— ${escapeHtml(t('contradictions'))}</span>${a.contradictions.items.slice(0,3).map(c=>`<p><span class="flag">${escapeHtml(c.rhetoric || c.title || itemTitle(c))}</span></p>`).join('')}`);
  $('rawSource').innerHTML=parts.join('\n');
  qsa('#rawSource [data-bind]').forEach(el=>{ el.onclick=()=>pulseAndScroll(el.dataset.bind); });
}
function highlightText(text){
  let out=escapeHtml(text || '—');
  if(state.analysis){ PILLARS.forEach(p=>state.analysis[p].slice(0,3).forEach(item=>{ const label=itemTitle(item); if(label && label.length>6){ const safe=escapeHtml(label); out=out.replace(safe,`<span class="h-${p}" data-bind="${escapeHtml(idOf(item))}">${safe}</span>`); } })); }
  return out;
}
function renderReviewNav(){ const tabs=['overview','pillars','contradictions','scenarios','evidence','exports']; $('reviewNav').innerHTML=tabs.map(tab=>`<button type="button" role="tab" aria-selected="${state.activeReview===tab?'true':'false'}" class="${state.activeReview===tab?'active':''}" data-review="${tab}">${escapeHtml(t(tab==='pillars'?'engine':tab))}</button>`).join(''); qsa('[data-review]').forEach(b=>b.onclick=()=>{ state.activeReview=b.dataset.review; renderReview(); }); }
function renderReview(){
  renderReviewNav();
  if(!state.analysis){ $('reviewContent').classList.add('hide'); $('emptyBrief').classList.remove('hide'); return; }
  $('reviewContent').classList.remove('hide'); $('emptyBrief').classList.add('hide');
  let html='';
  if(state.activeReview==='overview') html=renderOverview();
  if(state.activeReview==='pillars') html=renderPillars();
  if(state.activeReview==='contradictions') html=renderContradictions();
  if(state.activeReview==='scenarios') html=renderScenarios();
  if(state.activeReview==='evidence') html=renderEvidence();
  if(state.activeReview==='exports') html=renderExports();
  $('reviewContent').innerHTML=html;
  qsa('#reviewContent [data-bind]').forEach(el=>{ el.onclick=()=>pulseAndScroll(el.dataset.bind); });
  const exportBtn=$('exportHtml'); if(exportBtn) exportBtn.onclick=()=>download(`${safeFileSlug(state.analysis.subject.title)}-brief.html`, htmlReport(), 'text/html');
}
function renderOverview(){ const a=state.analysis, s=scoreBreakdown(a); const findings=[a.subject.executive_thesis, ...PILLARS.flatMap(p=>a[p].slice(0,1).map(itemTitle))].filter(Boolean).slice(0,4);
  return `<div class="eyebrow">${escapeHtml(t('strategicBrief'))}</div><h1 class="headline">${escapeHtml(a.subject.title || t('generatedReport'))}</h1><div class="byline"><span><b>Jarbou3i</b> · v1.3</span><span><b>${evidenceCount()}</b> ${escapeHtml(t('sources'))}</span><span>${escapeHtml(t('score'))} · <b>${s.overall}/100</b></span></div><p class="lede">${escapeHtml(a.subject.executive_thesis || a.subject.question || a.subject.title || '—')}</p><h3 class="sectionH"><em>${escapeHtml(t('topFindings'))}</em><span class="meta">${findings.length} · ${escapeHtml(t('confidence'))}</span></h3><div class="findings">${findings.map((f,i)=>`<div class="finding"><div class="num">F·${String(i+1).padStart(2,'0')}</div><div><h3>${escapeHtml(f)}</h3><p>${escapeHtml(summaryForFinding(f))}${i===0&&a.evidence.items[0]?`<button type="button" class="evChip">${escapeHtml(a.evidence.items[0].id)}</button>`:''}</p></div>${renderConf(i===0?'high':'medium')}</div>`).join('')}</div>${a.contradictions.items[0]?renderPull(a.contradictions.items[0]):''}${renderLayerNodes('interests')}`; }
function summaryForFinding(f){ return String(f||'').length>140 ? String(f).slice(0,140)+'…' : String(f||''); }
function renderPull(c){ return `<div class="pull"><div class="k">${escapeHtml(t('contradictions'))} · <b>${escapeHtml(c.id||'C·01')}</b></div><p>${escapeHtml(c.interpretation || c.rhetoric || c.title || '—')}</p></div>`; }
function renderLayerNodes(p){ const items=state.analysis[p]||[]; return `<h3 class="sectionH"><em>Layer ${LAYER_IDS[p].replace('L','')} · ${escapeHtml(sectionLabel(p))}</em><span class="meta">${escapeHtml(layerSummary(p))}</span></h3><div class="nodes">${items.slice(0,4).map(item=>`<div class="node" data-bind="${escapeHtml(idOf(item))}"><div class="nid">${escapeHtml(item.id)}</div><div><h4>${escapeHtml(itemTitle(item))}</h4><p>${escapeHtml(item.rationale || item.description || item.stakes || '')}</p><div class="links">${linkTagsFor(item.id)}</div></div></div>`).join('') || `<div class="node"><div></div><div>${escapeHtml(t('noItems'))}</div></div>`}</div>`; }
function linkTagsFor(id){ const links=state.analysis.links.filter(l=>l.from===id || l.to===id).slice(0,4); return links.map(l=>`<span class="tag"><span class="sw"></span>${escapeHtml(l.from)} → ${escapeHtml(l.to)}</span>`).join('') || `<span class="tag"><span class="sw"></span>${escapeHtml(t('crossrefs'))}</span>`; }
function renderPillars(){ return `<h3 class="sectionH"><em>${escapeHtml(t('engine'))}</em><span class="meta">${totalItems()} ${escapeHtml(t('items'))}</span></h3>${PILLARS.map(renderLayerNodes).join('')}`; }
function renderContradictions(){ const items=state.analysis.contradictions.items; return `<h3 class="sectionH"><em>${escapeHtml(t('contradictions'))}</em><span class="meta">${items.length}</span></h3>${items.length?items.map(c=>`<article class="conflictCard"><h3>${escapeHtml(c.rhetoric||c.title||c.name||'—')}</h3><p><b>${escapeHtml(t('actionsResults'))}:</b> ${arr(c.actions).map(escapeHtml).join(' · ') || '—'}</p><p><b>${escapeHtml(t('interpretation'))}:</b> ${escapeHtml(c.interpretation||'—')}</p>${renderConf(c.confidence)}</article>`).join(''):`<p class="muted">${escapeHtml(t('noItems'))}</p>`}`; }
function renderScenarios(){ const items=state.analysis.scenarios.items; return `<h3 class="sectionH"><em>${escapeHtml(t('scenarios'))}</em><span class="meta">${items.length}</span></h3>${items.length?items.map(s=>`<article class="scenarioCard"><h3>${escapeHtml(s.name||s.title||'—')}</h3><p><b>${escapeHtml(t('probability'))}:</b> ${escapeHtml(s.probability ?? '—')}%</p><p><b>${escapeHtml(t('drivers'))}:</b> ${arr(s.drivers).map(escapeHtml).join(' · ') || '—'}</p><p><b>${escapeHtml(t('disprovenIf'))}:</b> ${arr(s.disproven_if).map(escapeHtml).join(' · ') || '—'}</p></article>`).join(''):`<p class="muted">${escapeHtml(t('noItems'))}</p>`}`; }
function renderEvidence(){ const ev=state.analysis.evidence.items, as=state.analysis.assumptions.items; return `<h3 class="sectionH"><em>${escapeHtml(t('evidence'))}</em><span class="meta">${ev.length}</span></h3><div class="premiumLedger"><div class="ledgerRow header"><div>${escapeHtml(t('claim'))}</div><div>${escapeHtml(t('basis'))}</div><div>${escapeHtml(t('confidence'))}</div><div>${escapeHtml(t('sourceNote'))}</div></div>${ev.length?ev.map(e=>`<div class="ledgerRow"><div>${escapeHtml(e.claim||e.name||'—')}</div><div>${escapeHtml(e.basis||'—')}</div><div>${renderConf(e.confidence)}</div><div>${escapeHtml(e.source_title||e.source_note||'—')}</div></div>`).join(''):`<div class="ledgerRow"><div>${escapeHtml(t('noItems'))}</div></div>`}</div><h3 class="sectionH"><em>${escapeHtml(t('assumption'))}</em><span class="meta">${as.length}</span></h3>${as.map(a=>`<article class="evidenceCard"><h3>${escapeHtml(a.assumption||a.name||'—')}</h3><p><b>${escapeHtml(t('risk'))}:</b> ${escapeHtml(a.risk||'—')}</p><p><b>${escapeHtml(t('test'))}:</b> ${escapeHtml(a.disproving_test||a.test||'—')}</p></article>`).join('') || `<p class="muted">${escapeHtml(t('noItems'))}</p>`}`; }
function renderExports(){ return `<h3 class="sectionH"><em>${escapeHtml(t('exports'))}</em><span class="meta">HTML</span></h3><div class="exportGrid"><div class="exportCard"><h3>${escapeHtml(t('downloadHtml'))}</h3><p class="muted">${escapeHtml(t('reportSubtitle'))}</p><button class="btn primary" id="exportHtml" type="button">${escapeHtml(t('downloadHtml'))}</button></div></div>`; }
function renderQualityRail(){ const s=scoreBreakdown(); const risk=s.readiness>=80?'low':s.readiness>=55?t('medium'):'high'; const cells=`<div class="qrail" role="region" aria-label="Quality rail"><div class="qcell"><span class="g">✓</span><span class="lbl">${escapeHtml(t('schema'))}</span><span class="val">v2 · ${state.analysis?'valid':'empty'}</span></div><div class="qcell"><span class="lbl">${escapeHtml(t('coverage'))}</span><span class="meter"><i style="width:${s.completeness}%"></i></span><span class="val">${s.completeness}%</span></div><div class="qcell"><span class="lbl">${escapeHtml(t('sourcing'))}</span><span class="meter"><i style="width:${s.sourcing}%"></i></span><span class="val">${s.sourcing}%</span></div><div class="qcell alert"><span class="g">◐</span><span class="lbl">${escapeHtml(t('contradictions'))}</span><span class="val">${contradictionCount()}</span></div><div class="qcell alert"><span class="g">⚠</span><span class="lbl">${escapeHtml(t('falsifier'))}</span><span class="val">${falsifierMissing()}</span></div><div class="qcell"><span class="lbl">${escapeHtml(t('pubrisk'))}</span><span class="meter warn"><i style="width:${100-s.readiness}%"></i></span><span class="val">${escapeHtml(risk)}</span></div></div>`;
  $('qrailExpanded').innerHTML=`${cells}<div class="railRight"><span>${escapeHtml(t('autosaved'))} <b>now</b></span><span>${escapeHtml(t('local'))}</span><button class="qrailToggle" type="button" data-toggle-rail aria-expanded="true">${escapeHtml(t('collapse'))} ↓</button></div>`;
  $('qrailCollapsed').innerHTML=`<span class="pip"><span class="d"></span>${escapeHtml(risk)} ${escapeHtml(t('risks'))}</span><span>${escapeHtml(t('schema'))} <b>${state.analysis?'v2 · valid':'empty'}</b></span><span class="dotsep">·</span><span>${escapeHtml(t('coverage'))} <b>${s.completeness}%</b></span><span class="dotsep">·</span><span>${escapeHtml(t('contradictions'))} <b>${contradictionCount()}</b></span><div class="railRight"><span>${escapeHtml(t('autosaved'))} <b>now</b></span><button class="qrailToggle" type="button" data-toggle-rail aria-expanded="false">${escapeHtml(t('expand'))} ↑</button></div>`;
  qsa('[data-toggle-rail]').forEach(btn=>btn.onclick=()=>{ document.body.dataset.rail=document.body.dataset.rail==='open'?'closed':'open'; });
}
function renderTop(){ const a=state.analysis; $('currentDocTitle').innerHTML = a ? `<span class="topic">${escapeHtml(a.subject.title)}</span> · v2 · draft` : `<em>${escapeHtml(t('untitled'))}</em> · ${escapeHtml(t('waitingPaste'))}`; $('topCrumbs').innerHTML = a ? `<span class="pulse"></span><span><b>schema</b> valid</span><span class="dotsep">·</span><span class="k">${escapeHtml(t('layers2'))}</span> <b>6/6</b><span class="dotsep">·</span><span class="k">${escapeHtml(t('contradictions'))}</span> <b>${contradictionCount()}</b><span class="dotsep">·</span><span class="k">${escapeHtml(t('sources'))}</span> <b>${evidenceCount()}</b>` : `<span class="pulse muted"></span><span>${escapeHtml(t('emptyHint'))}</span>`; $('topExportBtn').disabled=!a; }
function renderMode(){ const has=!!state.analysis; document.body.dataset.mode=has?'ready':'empty'; $('emptyState').classList.toggle('hide',has); $('sourceReady').classList.toggle('hide',!has); $('reviewContent').classList.toggle('hide',!has); $('emptyBrief').classList.toggle('hide',has); if(has){ $('sourceMeter').innerHTML=`<b>${escapeHtml(state.analysis.language||state.analysisLang)}</b><br>${totalItems()} ${escapeHtml(t('items'))}`; $('sourceCountTab').textContent=String(evidenceCount()); } else { $('sourceMeter').textContent=t('awaitingPaste'); } }
function renderAll(){ renderMode(); renderTop(); renderStages(); renderLegend(); renderRawSource(); renderEngineNav(); renderReview(); renderQualityRail(); }
function pulseAndScroll(refId){ if(!refId) return; qsa(`[data-bind="${CSS.escape(refId)}"]`).forEach(el=>{ el.classList.remove('pulseBind'); void el.offsetWidth; el.classList.add('pulseBind'); const layer=el.closest('.layer'); if(layer){ state.activePillar=layer.dataset.layer; renderEngineNav(); } el.scrollIntoView({block:'nearest', inline:'nearest', behavior:'smooth'}); }); }
function importAnalysis(a, rawText=''){ state.analysis=a; state.rawJson=rawText || JSON.stringify(a,null,2); state.stage='review'; state.activeReview='overview'; state.activePillar='interests'; state.topic=a.subject.title || state.topic; state.context=a.subject.context || state.context; $('topicInput').value=state.topic; $('timeframeInput').value=state.context; toast(t('analysisImported')); renderAll(); }
async function loadSample(){ const lang=state.lang; try{ const res=await fetch(`fixtures/sample-analysis-${lang}.json`); const data=await res.json(); const a=normalizeAnalysis(data); $('jsonInput').value=JSON.stringify(data,null,2); importAnalysis(a, $('jsonInput').value); toast(t('sampleLoaded')); }catch{ const res=await fetch('fixtures/sample-analysis-en.json'); const data=await res.json(); const a=normalizeAnalysis(data); $('jsonInput').value=JSON.stringify(data,null,2); importAnalysis(a, $('jsonInput').value); } }
function htmlReport(){ const a=state.analysis || normalizeAnalysis({}); const dir=state.lang==='ar'?'rtl':'ltr'; return `<!doctype html><html lang="${state.lang}" dir="${dir}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(a.subject.title||t('generatedReport'))}</title><style>body{font-family:Inter,system-ui,sans-serif;line-height:1.65;max-width:900px;margin:40px auto;padding:0 24px;color:#171717}h1{font-size:42px;line-height:1.05}h2{border-bottom:1px solid #ddd;padding-bottom:8px;margin-top:36px}.card{border:1px solid #ddd;border-radius:10px;padding:14px;margin:10px 0}.muted{color:#666}</style></head><body><h1>${escapeHtml(a.subject.title||t('generatedReport'))}</h1><p class="muted">${escapeHtml(t('reportSubtitle'))}</p><h2>${escapeHtml(t('thesis'))}</h2><p>${escapeHtml(a.subject.executive_thesis||'—')}</p>${PILLARS.map(p=>`<h2>${escapeHtml(sectionLabel(p))}</h2>${a[p].map(x=>`<div class="card"><h3>${escapeHtml(itemTitle(x))}</h3><p>${escapeHtml(x.rationale||x.description||'')}</p></div>`).join('')}`).join('')}<h2>${escapeHtml(t('contradictions'))}</h2>${a.contradictions.items.map(c=>`<div class="card"><h3>${escapeHtml(c.rhetoric||c.title||'—')}</h3><p>${escapeHtml(c.interpretation||'')}</p></div>`).join('')}<h2>${escapeHtml(t('scenarios'))}</h2>${a.scenarios.items.map(s=>`<div class="card"><h3>${escapeHtml(s.name||s.title||'—')}</h3><p>${escapeHtml(arr(s.disproven_if).join(' · '))}</p></div>`).join('')}</body></html>`; }

$('langAr').onclick=()=>setLang('ar'); $('langEn').onclick=()=>setLang('en'); $('langFr').onclick=()=>setLang('fr');
$('themeBtn').onclick=()=>setTheme(!document.body.classList.contains('themeLight'));
$('copyPromptBtn').onclick=async()=>{ state.topic=$('topicInput').value.trim(); state.context=$('timeframeInput').value.trim(); if(!state.topic){ toast(t('topicNeeded')); $('topicStatus').className='status bad'; $('topicStatus').textContent=t('topicNeeded'); return; } const prompt=buildPrompt(); state.lastPrompt=prompt; const ok=await copyText(prompt); state.stage='import'; $('editTopicBtn').classList.remove('hide'); $('topicStatus').className=ok?'status good':'status warn'; $('topicStatus').textContent=ok?t('promptCopied'):t('copyFailed'); if(!ok) showModal(t('promptPreview'),prompt); renderAll(); };
$('previewPromptBtn').onclick=()=>{ state.topic=$('topicInput').value.trim(); state.context=$('timeframeInput').value.trim(); if(!state.topic){ toast(t('topicNeeded')); return; } state.lastPrompt=buildPrompt(); showModal(t('promptPreview'),state.lastPrompt); };
$('editTopicBtn').onclick=()=>{ state.stage='topic'; renderAll(); };
$('jsonInput').addEventListener('input',validateJsonInput); $('clearJsonBtn').onclick=()=>{ $('jsonInput').value=''; validateJsonInput(); };
$('importBtn').onclick=()=>{ const a=validateJsonInput(); if(a) importAnalysis(a,$('jsonInput').value.trim()); };
$('repairPromptBtn').onclick=async()=>{ const prompt=repairPrompt(); const ok=await copyText(prompt); toast(ok?t('repairCopied'):t('copyFailed')); if(!ok) showModal(t('repairPrompt'),prompt); };
$('repairPromptBtnReady').onclick=async()=>{ const prompt=repairPrompt(); const ok=await copyText(prompt); toast(ok?t('repairCopied'):t('copyFailed')); };
$('loadSampleBtn').onclick=loadSample; $('repasteBtn').onclick=()=>{ state.analysis=null; state.stage='import'; renderAll(); $('jsonInput').focus(); };
$('restructureBtn').onclick=()=>{ const a=validateJsonInput(); if(a) importAnalysis(a,$('jsonInput').value.trim()); };
$('topExportBtn').onclick=()=>{ if(state.analysis) download(`${safeFileSlug(state.analysis.subject.title)}-brief.html`, htmlReport(), 'text/html'); };
$('modalClose').onclick=closeModal; $('modalBackdrop').onclick=(e)=>{ if(e.target.id==='modalBackdrop') closeModal(); }; $('modalCopy').onclick=async()=>{ const ok=await copyText($('modalContent').textContent); toast(ok?t('copied'):t('copyFailed')); };
document.addEventListener('keydown',e=>{ if(e.key==='Escape') closeModal(); const meta=e.metaKey||e.ctrlKey; if(meta && e.key.toLowerCase()==='e'){ e.preventDefault(); if(state.analysis) download(`${safeFileSlug(state.analysis.subject.title)}-brief.html`, htmlReport(), 'text/html'); } if(meta && e.key==='Enter'){ e.preventDefault(); const a=validateJsonInput(); if(a) importAnalysis(a,$('jsonInput').value.trim()); } if(meta && e.key.toLowerCase()==='l'){ e.preventDefault(); const order=['ar','en','fr']; setLang(order[(order.indexOf(state.lang)+1)%order.length]); } });

setLang(state.lang);
setTheme(false);
