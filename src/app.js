/* Jarbou3i Model v2.1.0-alpha.28 — shared results inspection layer */
import "./biopolitics-schema-validator.js";
import "./biopolitics-sample-i18n.js";
import "./core/provenance.js";
import "./biopolitics.js";
import "./biopolitics-integrity.js";
import "./biopolitics-graph.js";
import "./biopolitical-report.js";
import "./reference-ui.js";
import "./relationship-explorer.js";
import "./json-parser.js";
import { createPlatformRuntime } from "./core/platform-runtime.js";
import { createShellPreferences, normalizeShellDensity } from "./core/shell-preferences.js";
import { nextShellSection, resolveShellCommand } from "./core/shell-navigation.js";
import { createResultsOrientation } from "./core/results-orientation.js";
import { createResultsExplanation } from "./core/results-explanation.js";
import { createResultsInspectionIndex } from "./core/results-inspection.js";
import { createStrategicLensAdapter } from "./lenses/strategic/adapter.js";
import { createBiopoliticalLensAdapter } from "./lenses/biopolitical/adapter.js";

"use strict";
const I18N = {
  ar: {
    appTitle: "مساحة عمل التحليل الاستراتيجي",
    appSubtitle:
      "مساحة تحليل استراتيجية منظّمة: برومبت ذكي، استيراد واضح، ومراجعة قابلة للتصفح.",
    welcomeEyebrow: "دليل الأداة",
    welcomeTitle: "مرحبًا بك في نموذج جربوعي",
    welcomeBody:
      "رفيق بصري لبدء التحليل المنظّم بوضوح: حدّد الموضوع، انسخ البرومبت، استورد نتيجة JSON، ثم راجع طبقات النموذج خطوة بخطوة.",
    workflowTitle: "مركز قيادة التحليل",
    workflowSubtitle:
      "ابدأ بالموضوع، انسخ البرومبت، ثم استورد نتيجة JSON لمراجعة النموذج كاملًا.",
    stages: ["الموضوع", "البرومبت", "الاستيراد", "المراجعة"],
    topicLabel: "موضوع التحليل",
    topicPlaceholder: "مثال: صعود اليمين المتطرف في أوروبا 2022–2026",
    analysisLang: "لغة التحليل",
    assistantPreset: "المساعد المفضل",
    promptMode: "نمط البرومبت",
    modeSimple: "مركّز",
    modeExpert: "خبير",
    modeResearch: "بحثي",
    optionArabic: "العربية",
    optionEnglish: "الإنجليزية",
    optionFrench: "الفرنسية",
    themeTitle: "تبديل الوضع",
    languageLabel: "اختيار اللغة",
    skipToWorkspace: "انتقل إلى مساحة العمل",
    productEyebrow: "Jarbou3i / استخبارات بحثية",
    lensContextStrategic: "العدسة الاستراتيجية",
    lensContextBiopolitical: "العدسة البيوسياسية",
    densityTitle: "تبديل كثافة العرض",
    densityComfortable: "مريح",
    densityCompact: "مضغوط",
    workspaceNavigation: "التنقل في مساحة العمل",
    workspaceSectionSetup: "الإعداد",
    workspaceSectionSetupHint: "حدّد الموضوع واستورد التحليل",
    workspaceSectionModel: "النموذج",
    workspaceSectionModelHint: "افهم البنية التحليلية",
    workspaceSectionReview: "المراجعة",
    workspaceSectionReviewHint: "افحص النتيجة والأدلة",
    localProcessing: "المعالجة محليًا في المتصفح",
    nextActionLabel: "الإجراء التالي",
    shellActionTopic: "ابدأ بالموضوع",
    shellActionImport: "تابع إلى الاستيراد",
    shellActionReview: "راجع التحليل",
    shellMovedToSetup: "تم الانتقال إلى إعداد التحليل.",
    shellMovedToModel: "تم الانتقال إلى بنية النموذج.",
    shellMovedToReview: "تم الانتقال إلى مراجعة التحليل.",
    workflowEyebrow: "01 / إعداد التحليل",
    engineEyebrow: "02 / بنية النموذج",
    reviewEyebrow: "03 / فحص النتيجة",
    severity: "الشدة",
    severityShort: "شدة",
    timeframeLabel: "السياق الزمني/الجغرافي",
    timeframePlaceholder: "اختياري: 2022–2026، أوروبا",
    copyPrompt: "انسخ البرومبت",
    previewPrompt: "معاينة البرومبت",
    editTopic: "تعديل الموضوع",
    topicStatusStart: "أدخل موضوعًا واضحًا ثم انسخ البرومبت إلى مساعدك المفضل.",
    topicNeeded: "أدخل موضوع التحليل أولًا.",
    promptCopied:
      "تم نسخ البرومبت. افتح مساعدك، الصقه، ثم انسخ JSON الناتج إلى خانة الاستيراد.",
    promptPreview: "معاينة البرومبت",
    copyShownText: "نسخ النص المعروض",
    copied: "تم النسخ.",
    copyFailed: "تعذّر النسخ تلقائيًا. انسخ النص من نافذة المعاينة.",
    pasteTitle: "استيراد نتيجة الذكاء الاصطناعي",
    pasteSubtitle:
      "بعد استخدام البرومبت، الصق JSON هنا. زر الاستيراد يظهر فقط عندما تكون البنية صالحة.",
    jsonLabel: "نتيجة JSON",
    jsonPlaceholder: "الصق JSON هنا...",
    importAnalysis: "استيراد التحليل",
    repairPrompt: "برومبت إصلاح JSON",
    clear: "مسح",
    jsonWaiting: "الصق نتيجة JSON للتحقق.",
    jsonValid: "JSON صالح. يمكنك الآن استيراد التحليل.",
    jsonInvalid: "JSON غير صالح أو غير مكتمل. استخدم برومبت الإصلاح إذا لزم.",
    analysisImported: "تم استيراد التحليل. انتقل الآن إلى مراجعة الطبقات.",
    repairCopied: "تم نسخ برومبت الإصلاح.",
    engineTitle: "خريطة محرك التحليل",
    engineSubtitle:
      "المسار السببي للنموذج: من الحوافز إلى التكيف. بعد الاستيراد تصبح كل طبقة قابلة للفحص.",
    stateNoAnalysis: "لا يوجد تحليل بعد",
    stateImported: "تحليل مستورد",
    reviewTitle: "مراجعة التحليل الاستراتيجي",
    reviewSubtitle:
      "تنقل بين الخلاصة، الطبقات، التناقضات، السيناريوهات، الأدلة، الفحص، والتصدير.",
    overview: "الخلاصة",
    engine: "الطبقات الست",
    contradictions: "التناقضات",
    scenarios: "السيناريوهات",
    evidence: "الأدلة والافتراضات",
    exports: "التصدير",
    quality: "الجودة",
    score: "مؤشر الجودة",
    noItems: "لا توجد عناصر.",
    emptyEngine:
      "لم يتم استيراد تحليل بعد. خريطة النموذج ظاهرة هنا حتى يعرف المستخدم الطبقات التي سيملؤها التحليل.",
    pillars: {
      interests: ["المصالح", "الحوافز والرهانات"],
      actors: ["الفاعلون", "أصحاب القرار والتأثير"],
      tools: ["الأدوات", "وسائل الفعل والضغط"],
      narrative: ["السردية", "إطار الشرعية والتبرير"],
      results: ["النتائج", "آثار قابلة للملاحظة"],
      feedback: ["التغذية الراجعة", "تكيف النظام مع النتائج"],
    },
    nav: {
      overview: "الخلاصة",
      pillars: "الطبقات",
      contradictions: "التناقضات",
      scenarios: "السيناريوهات",
      evidence: "الأدلة",
      inspection: "الفحص",
      exports: "التصدير",
    },
    navHints: {
      overview: "مؤشرات تنفيذية وصحة النموذج",
      pillars: "تفحّص الطبقات السببية الست",
      contradictions: "الخطاب مقابل الأفعال",
      scenarios: "مسارات مستقبلية قابلة للاختبار",
      evidence: "الأدلة والافتراضات والاختبارات",
      inspection: "المعرّفات والمصادر وسجل التدقيق",
      exports: "تقرير قابل للمشاركة",
    },
    warnings: {
      missingPillars: "بعض طبقات النموذج فارغة.",
      noContradictions: "لم يتم استخراج تناقضات واضحة.",
      noScenarios: "لا توجد سيناريوهات قابلة للاختبار.",
      noFalsifiers: "السيناريوهات تحتاج شروط نقض/إبطال.",
      thinEvidence: "طبقة الأدلة أو الافتراضات ضعيفة.",
      good: "البنية الأساسية للتحليل مكتملة.",
    },
    thesis: "الأطروحة التنفيذية",
    topic: "الموضوع",
    context: "السياق",
    actions: "الإجراءات",
    downloadHtml: "تصدير تقرير HTML",
    downloadJson: "تصدير JSON النظامي",
    generatedReport: "تقرير تحليل استراتيجي",
    confidence: "الثقة",
    type: "النوع",
    rationale: "التبرير",
    actionsResults: "الأفعال/النتائج",
    interpretation: "التفسير",
    probability: "الاحتمال",
    timeframe: "الإطار الزمني",
    drivers: "المحركات",
    earlySignals: "إشارات مبكرة",
    disprovenIf: "يُضعف/يُبطل إذا",
    claim: "ادعاء",
    basis: "الأساس",
    sourceNote: "ملاحظة المصدر",
    assumption: "افتراض",
    risk: "المخاطر",
    test: "اختبار النقض",
    loadSample: "تحميل مثال",
    sampleLoaded:
      "تم تحميل مثال تجريبي. يمكنك مراجعة النتائج أو استبدالها بموضوعك.",
    guideTitle: "طريقة الاستخدام",
    guideSteps: [
      "اكتب موضوع التحليل بوضوح.",
      "انسخ البرومبت والصقه في مساعدك المفضل.",
      "انسخ JSON الناتج فقط والصقه في خانة الاستيراد.",
      "راجع جودة التحليل ثم صدّر تقرير HTML.",
    ],
    schemaHealth: "صحة الاستيراد",
    completeness: "الاكتمال",
    missingItems: "النواقص",
    nextBestAction: "الخطوة التالية",
    healthGood: "البنية جيدة. انتقل إلى المراجعة أو التصدير.",
    healthMissingPillars: "أكمل الطبقات الفارغة أولًا.",
    healthMissingContradictions: "اطلب استخراج التناقضات بوضوح.",
    healthMissingScenarios: "اطلب سيناريوهات مع شروط إبطال.",
    healthMissingEvidence: "اطلب أدلة/افتراضات أو استخدم نمط الخبير.",
    healthMissingFeedback: "أضف حلقات تغذية راجعة تربط النتائج بالتكيّف.",
    jsonAutoRecovered: "تم تنظيف النص واستخراج JSON صالح تلقائيًا.",
    jsonParseProblem: "تعذّر فهم JSON. استخدم برومبت الإصلاح.",
    reportSubtitle:
      "تقرير قابل للمشاركة مبني على نموذج المصالح → الفاعلون → الأدوات → السردية → النتائج → التغذية الراجعة.",
    itemsWord: "عناصر",
    scoreSystem: "نظام التقييم",
    scoreGuide:
      "الدرجة المركّبة توازن بين الاكتمال، التماسك، التناقضات، قابلية اختبار السيناريوهات، والارتكاز على الأدلة.",
    overallScore: "المؤشر الكلي",
    scoreCompleteness: "اكتمال الطبقات",
    scoreCompletenessHint: "مدى امتلاء الطبقات الست والبنية الأساسية.",
    scoreCoherence: "التماسك السببي",
    scoreCoherenceHint: "مدى اتصال المصالح والفاعلين والأدوات والنتائج.",
    scoreContradictions: "جودة التناقضات",
    scoreContradictionsHint: "مدى وضوح علاقة الخطاب بالأفعال والنتائج.",
    scoreFalsifiability: "قابلية الاختبار",
    scoreFalsifiabilityHint: "وجود سيناريوهات مع شروط إبطال واضحة.",
    scoreEvidence: "ارتكاز الأدلة",
    scoreEvidenceHint: "وجود أدلة أو افتراضات قابلة للفحص.",
    scoreReadiness: "جاهزية المشاركة",
    scoreReadinessHint: "مدى وضوح التحليل وقابليته للتصدير.",
    qualityGate: "بوابة الجودة",
    publishReady: "جاهز للنشر",
    reviewNeeded: "يحتاج مراجعة",
    doNotPublish: "لا تنشر بعد",
    modelMetrics: "مقاييس النموذج",
    computedMetric: "محسوب تلقائيًا",
    valueBand: "مستوى القيمة",
    outOfHundred: "/100",
    sectionSummary: "خلاصة القسم",
    compactView: "عرض مركز",
    detailedView: "عرض تفصيلي",
    appTitleBiopolitical: "مساحة عمل التحليل الحيوسياسي",
    appSubtitleBiopolitical:
      "مساحة تحليل لفهم كيف تُدار الأجساد والسكان والمعايير والمخاطر والسلوك.",
    workflowSubtitleBiopolitical:
      "اختر موضوعًا وعدسة حيوسياسية، انسخ البرومبت، ثم استورد JSON لمراجعة إدارة الحياة والسكان.",
    topicPlaceholderBiopolitical:
      "مثال: جوازات الصحة الرقمية وتصنيف مخاطر السكان 2020–2022",
    analysisLens: "عدسة التحليل",
    lensStrategic: "استراتيجي",
    lensBiopolitical: "حيوسياسي",
    lensStrategicHint: "مصالح، فاعلون، أدوات، سردية، نتائج، تغذية راجعة.",
    lensBiopoliticalHint:
      "إشكلة، سكان/ذوات، تقنيات حكم، معايير، آثار جسدية/اجتماعية، مقاومة.",
    engineTitleBiopolitical: "خريطة المحرك الحيوسياسي",
    engineSubtitleBiopolitical:
      "مسار الحكم في النموذج: من تحويل الحياة إلى مشكلة عامة، إلى تصنيف السكان، والتطبيع، والآثار الجسدية، والمقاومة.",
    reviewTitleBiopolitical: "مراجعة التحليل الحيوسياسي",
    reviewSubtitleBiopolitical:
      "تنقل بين الخلاصة، طبقات الحكم، التناقضات، السيناريوهات، الأدلة، والتصدير.",
    engineBiopolitical: "طبقات الحكم",
    generatedReportBiopolitical: "تقرير تحليل حيوسياسي",
    reportSubtitleBiopolitical:
      "تقرير قابل للمشاركة مبني على نموذج الإشكلة → السكان → التقنيات → المعايير/تكوين الذات → الآثار → المقاومة/التغذية الراجعة.",
    scoreGuideBiopolitical:
      "الدرجة المركّبة توازن بين اكتمال الطبقات، تماسك الحكم، جودة التناقضات، قابلية الاختبار، الارتكاز على الأدلة، وجاهزية النشر.",
    scoreCoherenceBiopolitical: "تماسك الحكم",
    scoreCoherenceHintBiopolitical:
      "مدى اتصال الإشكلة والسكان والتقنيات والمعايير والآثار الجسدية والتغذية الراجعة.",
    scoreContradictionsHintBiopolitical:
      "مدى وضوح الفصل بين ادعاءات الحماية وآثار التصنيف أو الانضباط أو الإقصاء أو التطبيع.",
    healthMissingPillarsBiopolitical: "أكمل طبقات الحكم الحيوسياسي أولًا.",
    healthMissingFeedbackBiopolitical:
      "أضف حلقات مقاومة أو تكيف أو تطبيع أو سلوك مضاد.",
    warningsBiopolitical: {
      missingPillars: "بعض طبقات الحكم الحيوسياسي فارغة.",
      noContradictions: "لم يتم استخراج تناقض واضح بين الحماية والسيطرة.",
      noScenarios: "لا يوجد سيناريو حكم قابل للاختبار.",
      noFalsifiers: "السيناريوهات تحتاج شروط إضعاف/إبطال واضحة.",
      thinEvidence:
        "الأدلة أو الافتراضات حول السكان أو التقنيات أو الآثار الجسدية ضعيفة.",
      good: "البنية الحيوسياسية الأساسية مكتملة.",
    },
    pillarsBiopolitical: {
      interests: [
        "الإشكلة",
        "عملية حياة تُقدَّم كمشكلة عامة: صحة، خطر، خصوبة، هجرة، إنتاجية، أمن، سلوك.",
      ],
      actors: [
        "السكان / الذوات",
        "مجموعات يتم تصنيفها أو قياسها أو استهدافها أو حمايتها أو تحسينها أو ضبطها أو إقصاؤها.",
      ],
      tools: [
        "تقنيات الحكم",
        "مراقبة، إحصاء، تصنيف، قانون، طب، منصات، هندسة المكان، حوافز، دفع سلوكي، شرطة.",
      ],
      narrative: [
        "المعايير / تكوين الذات",
        "تعريف ما هو طبيعي أو صحي أو خطِر أو مسؤول أو منتج أو منحرف أو خطير.",
      ],
      results: [
        "آثار جسدية / اجتماعية",
        "آثار على الجسد والسلوك والوصول واللامساواة والامتثال والاستقلالية والثقة المؤسسية.",
      ],
      feedback: [
        "مقاومة / تغذية راجعة للتطبيع",
        "سلوك مضاد، رفض، تكيف، تطبيع، تعلم مؤسسي، وتعديل القواعد.",
      ],
    },
    sampleLoadedBiopolitical:
      "تم تحميل مثال حيوسياسي. راجع طبقات الحكم أو استبدله بموضوعك.",
  },
  en: {
    appTitle: "Strategic Analysis Workbench",
    appSubtitle:
      "An intelligence-style workspace for structured prompts, clean import, and navigable analysis review.",
    welcomeEyebrow: "Tool guide",
    welcomeTitle: "Welcome to Jarbou3i Model",
    welcomeBody:
      "A friendly visual guide to start your structured analysis: define the topic, copy the prompt, import the JSON result, and review the full model with clarity.",
    workflowTitle: "Analysis Command Center",
    workflowSubtitle:
      "Start with the topic, copy the prompt, then import JSON to review the full model.",
    stages: ["Topic", "Prompt", "Import", "Review"],
    topicLabel: "Analysis topic",
    topicPlaceholder: "Example: Rise of the far right in Europe, 2022–2026",
    analysisLang: "Analysis language",
    assistantPreset: "Preferred assistant",
    promptMode: "Prompt mode",
    modeSimple: "Focused",
    modeExpert: "Expert",
    modeResearch: "Research",
    optionArabic: "Arabic",
    optionEnglish: "English",
    optionFrench: "French",
    themeTitle: "Toggle theme",
    languageLabel: "Language selector",
    skipToWorkspace: "Skip to workspace",
    productEyebrow: "Jarbou3i / Research Intelligence",
    lensContextStrategic: "Strategic lens",
    lensContextBiopolitical: "Biopolitical lens",
    densityTitle: "Toggle display density",
    densityComfortable: "Comfortable",
    densityCompact: "Compact",
    workspaceNavigation: "Workspace navigation",
    workspaceSectionSetup: "Set up",
    workspaceSectionSetupHint: "Define and import the analysis",
    workspaceSectionModel: "Model",
    workspaceSectionModelHint: "Understand the analytical structure",
    workspaceSectionReview: "Review",
    workspaceSectionReviewHint: "Inspect the result and evidence",
    localProcessing: "Processed locally in your browser",
    nextActionLabel: "Next action",
    shellActionTopic: "Start with a topic",
    shellActionImport: "Continue to import",
    shellActionReview: "Review analysis",
    shellMovedToSetup: "Moved to analysis setup.",
    shellMovedToModel: "Moved to model structure.",
    shellMovedToReview: "Moved to analysis review.",
    workflowEyebrow: "01 / Configure analysis",
    engineEyebrow: "02 / Model structure",
    reviewEyebrow: "03 / Inspect outcome",
    severity: "Severity",
    severityShort: "S",
    timeframeLabel: "Time/geographic context",
    timeframePlaceholder: "Optional: 2022–2026, Europe",
    copyPrompt: "Copy prompt",
    previewPrompt: "Preview prompt",
    editTopic: "Edit topic",
    topicStatusStart:
      "Enter a clear topic, then copy the prompt into your preferred assistant.",
    topicNeeded: "Enter an analysis topic first.",
    promptCopied:
      "Prompt copied. Open your assistant, paste it, then copy the JSON result into the import box.",
    promptPreview: "Prompt preview",
    copyShownText: "Copy shown text",
    copied: "Copied.",
    copyFailed: "Automatic copy failed. Copy the text from the preview window.",
    pasteTitle: "Import AI Result",
    pasteSubtitle:
      "After using the prompt, paste JSON here. The import button becomes usable only when the structure is valid.",
    jsonLabel: "JSON result",
    jsonPlaceholder: "Paste JSON here...",
    importAnalysis: "Import analysis",
    repairPrompt: "JSON repair prompt",
    clear: "Clear",
    jsonWaiting: "Paste JSON to validate.",
    jsonValid: "Valid JSON. You can import the analysis now.",
    jsonInvalid: "Invalid or incomplete JSON. Use the repair prompt if needed.",
    analysisImported:
      "Analysis imported. You can now review the engine layers.",
    repairCopied: "Repair prompt copied.",
    engineTitle: "Analysis Engine Map",
    engineSubtitle:
      "The causal path of the model: from incentives to adaptation. After import, each layer becomes inspectable.",
    stateNoAnalysis: "No analysis yet",
    stateImported: "Analysis imported",
    reviewTitle: "Strategic Analysis Review",
    reviewSubtitle:
      "Navigate the summary, layers, contradictions, scenarios, evidence, inspection, and exports.",
    overview: "Overview",
    engine: "Six layers",
    contradictions: "Contradictions",
    scenarios: "Scenarios",
    evidence: "Evidence & assumptions",
    exports: "Exports",
    quality: "Quality",
    score: "Quality index",
    noItems: "No items.",
    emptyEngine:
      "No analysis has been imported yet. The model map remains visible so users understand which layers the analysis will fill.",
    pillars: {
      interests: ["Interests", "Expected material or symbolic benefits."],
      actors: ["Actors", "Decision-makers and influence holders."],
      tools: ["Tools", "Instruments of action."],
      narrative: ["Narrative", "Legitimacy and public framing."],
      results: ["Results", "Direct, indirect, and unintended effects."],
      feedback: ["Feedback", "System adaptation to its own results."],
    },
    nav: {
      overview: "Overview",
      pillars: "Layers",
      contradictions: "Contradictions",
      scenarios: "Scenarios",
      evidence: "Evidence",
      inspection: "Inspection",
      exports: "Exports",
    },
    navHints: {
      overview: "Executive signals and model health",
      pillars: "Inspect the six causal layers",
      contradictions: "Rhetoric versus actions",
      scenarios: "Future paths and falsifiers",
      evidence: "Claims, assumptions, and tests",
      inspection: "Identifiers, provenance, and audit trail",
      exports: "Download the final report",
    },
    warnings: {
      missingPillars: "Some model layers are empty.",
      noContradictions: "No clear contradictions were extracted.",
      noScenarios: "No testable scenarios were provided.",
      noFalsifiers: "Scenarios need falsification/disproval conditions.",
      thinEvidence: "Evidence or assumptions layer is weak.",
      good: "The core analysis structure is complete.",
    },
    thesis: "Executive thesis",
    topic: "Topic",
    context: "Context",
    actions: "Actions",
    downloadHtml: "Export HTML report",
    downloadJson: "Export canonical JSON",
    generatedReport: "Strategic Analysis Report",
    confidence: "Confidence",
    type: "Type",
    rationale: "Rationale",
    actionsResults: "Actions/results",
    interpretation: "Interpretation",
    probability: "Probability",
    timeframe: "Timeframe",
    drivers: "Drivers",
    earlySignals: "Early signals",
    disprovenIf: "Disproven if",
    claim: "Claim",
    basis: "Basis",
    sourceNote: "Source note",
    assumption: "Assumption",
    risk: "Risk",
    test: "Disproving test",
    loadSample: "Load sample",
    sampleLoaded:
      "Sample analysis loaded. You can review it or replace it with your own topic.",
    guideTitle: "How to use it",
    guideSteps: [
      "Write a clear analysis topic.",
      "Copy the prompt and paste it into your preferred AI assistant.",
      "Copy only the JSON result and paste it into the import box.",
      "Review quality, inspect layers, then export the HTML report.",
    ],
    schemaHealth: "Import health",
    completeness: "Completeness",
    missingItems: "Missing items",
    nextBestAction: "Next best action",
    healthGood: "The structure is healthy. Move to review or export.",
    healthMissingPillars: "Complete the empty model layers first.",
    healthMissingContradictions: "Ask for explicit contradiction extraction.",
    healthMissingScenarios: "Ask for scenarios with disproval conditions.",
    healthMissingEvidence: "Ask for evidence/assumptions or use Expert mode.",
    healthMissingFeedback: "Add feedback loops linking results to adaptation.",
    jsonAutoRecovered:
      "Text was cleaned and valid JSON was extracted automatically.",
    jsonParseProblem: "Could not parse JSON. Use the repair prompt.",
    reportSubtitle:
      "A shareable report built on the Interests → Actors → Tools → Narrative → Results → Feedback model.",
    itemsWord: "items",
    scoreSystem: "Scoring system",
    scoreGuide:
      "The composite score balances completeness, coherence, contradiction quality, scenario testability, and evidence grounding.",
    overallScore: "Overall index",
    scoreCompleteness: "Layer completeness",
    scoreCompletenessHint:
      "How much of the six-layer model and core structure is populated.",
    scoreCoherence: "Causal coherence",
    scoreCoherenceHint:
      "How well interests, actors, tools, and results connect.",
    scoreContradictions: "Contradiction quality",
    scoreContradictionsHint:
      "How clearly rhetoric is matched against actions and results.",
    scoreFalsifiability: "Testability",
    scoreFalsifiabilityHint:
      "Scenarios include explicit falsifiers or disproval conditions.",
    scoreEvidence: "Evidence grounding",
    scoreEvidenceHint: "Evidence or testable assumptions anchor the analysis.",
    scoreReadiness: "Share readiness",
    scoreReadinessHint: "The analysis is clear enough to export and review.",
    qualityGate: "Quality gate",
    publishReady: "Publish-ready",
    reviewNeeded: "Review needed",
    doNotPublish: "Do not publish yet",
    modelMetrics: "Model metrics",
    computedMetric: "Computed automatically",
    valueBand: "Value band",
    outOfHundred: "/100",
    sectionSummary: "Section summary",
    compactView: "Compact view",
    detailedView: "Detailed view",
    appTitleBiopolitical: "Biopolitical Analysis Workbench",
    appSubtitleBiopolitical:
      "A lens-aware workspace for analyzing how power governs bodies, populations, norms, risks, and conduct.",
    workflowSubtitleBiopolitical:
      "Choose a topic, select the biopolitical lens, generate a prompt, then import JSON to inspect governance over life and populations.",
    topicPlaceholderBiopolitical:
      "Example: Digital health passports and population risk classification, 2020–2022",
    analysisLens: "Analysis lens",
    lensStrategic: "Strategic",
    lensBiopolitical: "Biopolitical",
    lensStrategicHint:
      "Interests, actors, tools, narrative, results, feedback.",
    lensBiopoliticalHint:
      "Problematization, populations, governance techniques, norms, embodied outcomes, resistance.",
    engineTitleBiopolitical: "Biopolitical Engine Map",
    engineSubtitleBiopolitical:
      "The governance path of the model: from problematized life processes to population classification, normalization, embodied outcomes, and resistance.",
    reviewTitleBiopolitical: "Biopolitical Analysis Review",
    reviewSubtitleBiopolitical:
      "Navigate the summary, governance layers, contradictions, scenarios, evidence, and exports.",
    engineBiopolitical: "Governance layers",
    generatedReportBiopolitical: "Biopolitical Analysis Report",
    reportSubtitleBiopolitical:
      "Shareable report built on Problematization → Populations → Techniques → Norms/Subjectivation → Outcomes → Resistance/Feedback.",
    scoreGuideBiopolitical:
      "The composite score balances layer completeness, governance coherence, contradiction quality, falsifiability, evidence grounding, and publication readiness.",
    scoreCoherenceBiopolitical: "Governance coherence",
    scoreCoherenceHintBiopolitical:
      "How clearly the analysis connects problematization, populations, techniques, norms, embodied outcomes, and feedback.",
    scoreContradictionsHintBiopolitical:
      "How clearly the analysis separates protective claims from classificatory, disciplinary, exclusionary, or normalizing effects.",
    healthMissingPillarsBiopolitical:
      "Complete the biopolitical governance layers first.",
    healthMissingFeedbackBiopolitical:
      "Add resistance, adaptation, normalization, or counter-conduct feedback loops.",
    warningsBiopolitical: {
      missingPillars: "Some biopolitical governance layers are empty.",
      noContradictions:
        "No protection/control contradiction has been extracted.",
      noScenarios: "No testable governance scenario exists.",
      noFalsifiers: "Scenarios need clear weakening/disproving conditions.",
      thinEvidence:
        "Evidence or assumptions about populations, techniques, or embodied outcomes are thin.",
      good: "The core biopolitical structure is complete.",
    },
    pillarsBiopolitical: {
      interests: [
        "Problematization",
        "Life process framed as a public problem: health, risk, fertility, migration, productivity, security, behavior.",
      ],
      actors: [
        "Populations / Subjects",
        "Groups classified, measured, targeted, protected, optimized, disciplined, or excluded.",
      ],
      tools: [
        "Governance Techniques",
        "Surveillance, statistics, classification, law, medicine, platforms, architecture, incentives, nudges, policing.",
      ],
      narrative: [
        "Norms / Subjectivation",
        "Definitions of normal, healthy, risky, responsible, productive, deviant, or dangerous conduct.",
      ],
      results: [
        "Embodied / Social Outcomes",
        "Effects on bodies, behavior, access, inequality, compliance, autonomy, and institutional trust.",
      ],
      feedback: [
        "Resistance / Normalization Feedback",
        "Counter-conduct, refusal, adaptation, normalization, institutional learning, and rule revision.",
      ],
    },
    sampleLoadedBiopolitical:
      "Biopolitical sample loaded. Review the governance layers or replace it with your topic.",
  },
  fr: {
    appTitle: "Atelier d’analyse stratégique",
    appSubtitle:
      "Un espace d’analyse structuré : prompt clair, import propre et revue navigable.",
    welcomeEyebrow: "Guide de l’outil",
    welcomeTitle: "Bienvenue dans Jarbou3i Model",
    welcomeBody:
      "Un guide visuel convivial pour démarrer votre analyse structurée : définissez le sujet, copiez le prompt, importez le JSON, puis examinez clairement l’ensemble du modèle.",
    workflowTitle: "Centre de commande de l’analyse",
    workflowSubtitle:
      "Commencez par le sujet, copiez le prompt, puis importez le JSON pour examiner le modèle complet.",
    stages: ["Sujet", "Prompt", "Import", "Revue"],
    topicLabel: "Sujet d’analyse",
    topicPlaceholder:
      "Exemple : montée de l’extrême droite en Europe, 2022–2026",
    analysisLang: "Langue de l’analyse",
    assistantPreset: "Assistant préféré",
    promptMode: "Mode du prompt",
    modeSimple: "Ciblé",
    modeExpert: "Expert",
    modeResearch: "Recherche",
    optionArabic: "Arabe",
    optionEnglish: "Anglais",
    optionFrench: "Français",
    themeTitle: "Changer de thème",
    languageLabel: "Sélecteur de langue",
    skipToWorkspace: "Aller à l’espace de travail",
    productEyebrow: "Jarbou3i / Intelligence de recherche",
    lensContextStrategic: "Perspective stratégique",
    lensContextBiopolitical: "Perspective biopolitique",
    densityTitle: "Changer la densité d’affichage",
    densityComfortable: "Confortable",
    densityCompact: "Compacte",
    workspaceNavigation: "Navigation de l’espace de travail",
    workspaceSectionSetup: "Préparer",
    workspaceSectionSetupHint: "Définir et importer l’analyse",
    workspaceSectionModel: "Modèle",
    workspaceSectionModelHint: "Comprendre la structure analytique",
    workspaceSectionReview: "Revue",
    workspaceSectionReviewHint: "Examiner le résultat et les preuves",
    localProcessing: "Traitement local dans votre navigateur",
    nextActionLabel: "Action suivante",
    shellActionTopic: "Commencer par un sujet",
    shellActionImport: "Continuer vers l’import",
    shellActionReview: "Examiner l’analyse",
    shellMovedToSetup: "Navigation vers la préparation de l’analyse.",
    shellMovedToModel: "Navigation vers la structure du modèle.",
    shellMovedToReview: "Navigation vers la revue de l’analyse.",
    workflowEyebrow: "01 / Configurer l’analyse",
    engineEyebrow: "02 / Structure du modèle",
    reviewEyebrow: "03 / Examiner le résultat",
    severity: "Sévérité",
    severityShort: "S",
    timeframeLabel: "Contexte temporel/géographique",
    timeframePlaceholder: "Optionnel : 2022–2026, Europe",
    copyPrompt: "Copier le prompt",
    previewPrompt: "Aperçu du prompt",
    editTopic: "Modifier le sujet",
    topicStatusStart:
      "Saisissez un sujet clair, puis copiez le prompt dans votre assistant préféré.",
    topicNeeded: "Saisissez d’abord un sujet d’analyse.",
    promptCopied:
      "Prompt copié. Ouvrez votre assistant, collez-le, puis copiez le JSON obtenu dans la zone d’import.",
    promptPreview: "Aperçu du prompt",
    copyShownText: "Copier le texte affiché",
    copied: "Copié.",
    copyFailed:
      "La copie automatique a échoué. Copiez le texte depuis la fenêtre d’aperçu.",
    pasteTitle: "Importer le résultat IA",
    pasteSubtitle:
      "Après avoir utilisé le prompt, collez le JSON ici. Le bouton d’import devient actif uniquement lorsque la structure est valide.",
    jsonLabel: "Résultat JSON",
    jsonPlaceholder: "Collez le JSON ici...",
    importAnalysis: "Importer l’analyse",
    repairPrompt: "Prompt de réparation JSON",
    clear: "Effacer",
    jsonWaiting: "Collez un JSON pour le valider.",
    jsonValid: "JSON valide. Vous pouvez maintenant importer l’analyse.",
    jsonInvalid:
      "JSON invalide ou incomplet. Utilisez le prompt de réparation si nécessaire.",
    analysisImported:
      "Analyse importée. Vous pouvez maintenant examiner les couches du moteur.",
    repairCopied: "Prompt de réparation copié.",
    engineTitle: "Carte du moteur d’analyse",
    engineSubtitle:
      "Le chemin causal du modèle : des intérêts à l’adaptation. Après import, chaque couche devient inspectable.",
    stateNoAnalysis: "Aucune analyse",
    stateImported: "Analyse importée",
    reviewTitle: "Revue de l’analyse stratégique",
    reviewSubtitle:
      "Naviguez entre la synthèse, les couches, les contradictions, les scénarios, les preuves, l’inspection et l’export.",
    overview: "Synthèse",
    engine: "Six couches",
    contradictions: "Contradictions",
    scenarios: "Scénarios",
    evidence: "Preuves & hypothèses",
    exports: "Export",
    quality: "Qualité",
    score: "Indice de qualité",
    noItems: "Aucun élément.",
    emptyEngine:
      "Aucune analyse n’a encore été importée. La carte du modèle reste visible pour montrer les couches qui seront remplies.",
    pillars: {
      interests: ["Intérêts", "Bénéfices matériels ou symboliques attendus."],
      actors: ["Acteurs", "Décideurs et détenteurs d’influence."],
      tools: ["Outils", "Instruments d’action."],
      narrative: ["Narratif", "Légitimité et cadrage public."],
      results: ["Résultats", "Effets directs, indirects et non intentionnels."],
      feedback: [
        "Rétroaction",
        "Adaptation du système à ses propres résultats.",
      ],
    },
    nav: {
      overview: "Synthèse",
      pillars: "Couches",
      contradictions: "Contradictions",
      scenarios: "Scénarios",
      evidence: "Preuves",
      inspection: "Inspection",
      exports: "Export",
    },
    navHints: {
      overview: "Signaux exécutifs et santé du modèle",
      pillars: "Inspecter les six couches causales",
      contradictions: "Rhétorique versus actions",
      scenarios: "Trajectoires futures et falsificateurs",
      evidence: "Énoncés, hypothèses et tests",
      inspection: "Identifiants, provenance et piste d’audit",
      exports: "Télécharger le rapport final",
    },
    warnings: {
      missingPillars: "Certaines couches du modèle sont vides.",
      noContradictions: "Aucune contradiction claire n’a été extraite.",
      noScenarios: "Aucun scénario testable n’a été fourni.",
      noFalsifiers: "Les scénarios nécessitent des conditions de réfutation.",
      thinEvidence: "La couche preuves ou hypothèses est faible.",
      good: "La structure centrale de l’analyse est complète.",
    },
    thesis: "Thèse exécutive",
    topic: "Sujet",
    context: "Contexte",
    actions: "Actions",
    downloadHtml: "Exporter le rapport HTML",
    downloadJson: "Exporter le JSON canonique",
    generatedReport: "Rapport d’analyse stratégique",
    confidence: "Confiance",
    type: "Type",
    rationale: "Justification",
    actionsResults: "Actions/résultats",
    interpretation: "Interprétation",
    probability: "Probabilité",
    timeframe: "Horizon temporel",
    drivers: "Moteurs",
    earlySignals: "Signaux précoces",
    disprovenIf: "Réfuté si",
    claim: "Énoncé",
    basis: "Base",
    sourceNote: "Note de source",
    assumption: "Hypothèse",
    risk: "Risque",
    test: "Test de réfutation",
    loadSample: "Charger un exemple",
    sampleLoaded:
      "Exemple chargé. Vous pouvez l’examiner ou le remplacer par votre propre sujet.",
    guideTitle: "Mode d’emploi",
    guideSteps: [
      "Rédigez un sujet d’analyse clair.",
      "Copiez le prompt et collez-le dans votre assistant IA préféré.",
      "Copiez uniquement le résultat JSON et collez-le dans la zone d’import.",
      "Examinez la qualité, inspectez les couches, puis exportez le rapport HTML.",
    ],
    schemaHealth: "Santé de l’import",
    completeness: "Complétude",
    missingItems: "Éléments manquants",
    nextBestAction: "Prochaine action",
    healthGood: "La structure est saine. Passez à la revue ou à l’export.",
    healthMissingPillars: "Complétez d’abord les couches vides du modèle.",
    healthMissingContradictions:
      "Demandez une extraction explicite des contradictions.",
    healthMissingScenarios:
      "Demandez des scénarios avec conditions de réfutation.",
    healthMissingEvidence:
      "Demandez des preuves/hypothèses ou utilisez le mode Expert.",
    healthMissingFeedback:
      "Ajoutez des boucles de rétroaction reliant les résultats à l’adaptation.",
    jsonAutoRecovered:
      "Le texte a été nettoyé et un JSON valide a été extrait automatiquement.",
    jsonParseProblem:
      "Impossible d’analyser le JSON. Utilisez le prompt de réparation.",
    reportSubtitle:
      "Rapport partageable fondé sur le modèle Intérêts → Acteurs → Outils → Narratif → Résultats → Rétroaction.",
    itemsWord: "éléments",
    scoreSystem: "Système de score",
    scoreGuide:
      "Le score composite équilibre la complétude, la cohérence, la qualité des contradictions, la testabilité des scénarios et l’ancrage probatoire.",
    overallScore: "Indice global",
    scoreCompleteness: "Complétude des couches",
    scoreCompletenessHint:
      "Degré de remplissage des six couches et de la structure centrale.",
    scoreCoherence: "Cohérence causale",
    scoreCoherenceHint:
      "Qualité du lien entre intérêts, acteurs, outils et résultats.",
    scoreContradictions: "Qualité des contradictions",
    scoreContradictionsHint:
      "Clarté du lien entre rhétorique, actions et résultats.",
    scoreFalsifiability: "Testabilité",
    scoreFalsifiabilityHint:
      "Les scénarios incluent des conditions explicites de réfutation.",
    scoreEvidence: "Ancrage probatoire",
    scoreEvidenceHint:
      "Des preuves ou hypothèses testables soutiennent l’analyse.",
    scoreReadiness: "Prêt à partager",
    scoreReadinessHint:
      "L’analyse est assez claire pour être exportée et revue.",
    qualityGate: "Barrière qualité",
    publishReady: "Prêt à publier",
    reviewNeeded: "Révision nécessaire",
    doNotPublish: "Ne pas publier",
    modelMetrics: "Métriques du modèle",
    computedMetric: "Calculé automatiquement",
    valueBand: "Niveau de valeur",
    outOfHundred: "/100",
    sectionSummary: "Résumé de section",
    compactView: "Vue compacte",
    detailedView: "Vue détaillée",
    appTitleBiopolitical: "Atelier d’analyse biopolitique",
    appSubtitleBiopolitical:
      "Un espace d’analyse pour étudier comment le pouvoir gouverne les corps, les populations, les normes, les risques et les conduites.",
    workflowSubtitleBiopolitical:
      "Choisissez un sujet et la lentille biopolitique, copiez le prompt, puis importez le JSON pour examiner le gouvernement de la vie et des populations.",
    topicPlaceholderBiopolitical:
      "Exemple : passeports sanitaires numériques et classification des risques, 2020–2022",
    analysisLens: "Lentille d’analyse",
    lensStrategic: "Stratégique",
    lensBiopolitical: "Biopolitique",
    lensStrategicHint:
      "Intérêts, acteurs, outils, narratif, résultats, rétroaction.",
    lensBiopoliticalHint:
      "Problématisation, populations, techniques de gouvernement, normes, effets incarnés, résistance.",
    engineTitleBiopolitical: "Carte du moteur biopolitique",
    engineSubtitleBiopolitical:
      "Le chemin de gouvernement du modèle : de la problématisation des processus vitaux à la classification des populations, la normalisation, les effets incarnés et la résistance.",
    reviewTitleBiopolitical: "Revue de l’analyse biopolitique",
    reviewSubtitleBiopolitical:
      "Naviguez entre synthèse, couches de gouvernement, contradictions, scénarios, preuves et exports.",
    engineBiopolitical: "Couches de gouvernement",
    generatedReportBiopolitical: "Rapport d’analyse biopolitique",
    reportSubtitleBiopolitical:
      "Rapport partageable fondé sur Problématisation → Populations → Techniques → Normes/Subjectivation → Effets → Résistance/Rétroaction.",
    scoreGuideBiopolitical:
      "Le score composite équilibre complétude des couches, cohérence du gouvernement, qualité des contradictions, réfutabilité, ancrage probatoire et préparation à la publication.",
    scoreCoherenceBiopolitical: "Cohérence du gouvernement",
    scoreCoherenceHintBiopolitical:
      "Clarté du lien entre problématisation, populations, techniques, normes, effets incarnés et rétroaction.",
    scoreContradictionsHintBiopolitical:
      "Clarté de la distinction entre promesses de protection et effets de classification, discipline, exclusion ou normalisation.",
    healthMissingPillarsBiopolitical:
      "Complétez d’abord les couches de gouvernement biopolitique.",
    healthMissingFeedbackBiopolitical:
      "Ajoutez des boucles de résistance, adaptation, normalisation ou contre-conduite.",
    warningsBiopolitical: {
      missingPillars:
        "Certaines couches de gouvernement biopolitique sont vides.",
      noContradictions:
        "Aucune contradiction protection/contrôle n’a été extraite.",
      noScenarios: "Aucun scénario de gouvernement testable.",
      noFalsifiers:
        "Les scénarios nécessitent des conditions claires de réfutation.",
      thinEvidence:
        "Les preuves ou hypothèses sur populations, techniques ou effets incarnés sont faibles.",
      good: "La structure biopolitique de base est complète.",
    },
    pillarsBiopolitical: {
      interests: [
        "Problématisation",
        "Processus vital construit comme problème public : santé, risque, fécondité, migration, productivité, sécurité, conduite.",
      ],
      actors: [
        "Populations / Sujets",
        "Groupes classés, mesurés, ciblés, protégés, optimisés, disciplinés ou exclus.",
      ],
      tools: [
        "Techniques de gouvernement",
        "Surveillance, statistiques, classification, droit, médecine, plateformes, architecture, incitations, nudges, police.",
      ],
      narrative: [
        "Normes / Subjectivation",
        "Définitions du normal, sain, risqué, responsable, productif, déviant ou dangereux.",
      ],
      results: [
        "Effets incarnés / sociaux",
        "Effets sur corps, conduites, accès, inégalités, conformité, autonomie et confiance institutionnelle.",
      ],
      feedback: [
        "Résistance / Rétroaction de normalisation",
        "Contre-conduite, refus, adaptation, normalisation, apprentissage institutionnel et révision des règles.",
      ],
    },
    sampleLoadedBiopolitical:
      "Exemple biopolitique chargé. Examinez les couches de gouvernement ou remplacez-le par votre sujet.",
  },
};
const PILLARS = [
  "interests",
  "actors",
  "tools",
  "narrative",
  "results",
  "feedback",
];
const COLORS = {
  interests: "var(--p1)",
  actors: "var(--p2)",
  tools: "var(--p3)",
  narrative: "var(--p4)",
  results: "var(--p5)",
  feedback: "var(--p6)",
};
const BIO = window.Jarbou3iBiopolitics;
if (!BIO) throw new Error("Biopolitical analysis contract failed to load.");
const BIO_INTEGRITY = window.Jarbou3iBiopoliticsIntegrity;
if (!BIO_INTEGRITY)
  throw new Error("Biopolitical integrity gate failed to load.");
const BIO_GRAPH = window.Jarbou3iBiopoliticsGraph;
if (!BIO_GRAPH) throw new Error("Biopolitical relationship index failed to load.");
const BIO_REPORT = window.Jarbou3iBiopoliticalReport;
if (!BIO_REPORT) throw new Error("Biopolitical report renderer failed to load.");
const REFERENCE_UI = window.Jarbou3iReferenceUi;
if (!REFERENCE_UI) throw new Error("Named-reference interface failed to load.");
const RELATIONSHIP_EXPLORER = window.Jarbou3iRelationshipExplorer;
if (!RELATIONSHIP_EXPLORER)
  throw new Error("Relationship explorer failed to load.");
const JSON_TOOLS = window.Jarbou3iJson;
if (!JSON_TOOLS) throw new Error("Conservative JSON parser failed to load.");
const PROVENANCE = window.Jarbou3iProvenance;
if (!PROVENANCE) throw new Error("Evidence provenance service failed to load.");
const SETTINGS_KEY = "jarbou3i-model-settings";
const SUPPORTED_LANGUAGES = ["ar", "en", "fr"];
const LENS_KEY_ALIASES = {
  appTitle: "appTitleBiopolitical",
  appSubtitle: "appSubtitleBiopolitical",
  workflowSubtitle: "workflowSubtitleBiopolitical",
  topicPlaceholder: "topicPlaceholderBiopolitical",
  engineTitle: "engineTitleBiopolitical",
  engineSubtitle: "engineSubtitleBiopolitical",
  reviewTitle: "reviewTitleBiopolitical",
  reviewSubtitle: "reviewSubtitleBiopolitical",
  engine: "engineBiopolitical",
  generatedReport: "generatedReportBiopolitical",
  reportSubtitle: "reportSubtitleBiopolitical",
  scoreGuide: "scoreGuideBiopolitical",
  scoreCoherence: "scoreCoherenceBiopolitical",
  scoreCoherenceHint: "scoreCoherenceHintBiopolitical",
  scoreContradictionsHint: "scoreContradictionsHintBiopolitical",
  healthMissingPillars: "healthMissingPillarsBiopolitical",
  healthMissingFeedback: "healthMissingFeedbackBiopolitical",
  sampleLoaded: "sampleLoadedBiopolitical",
  pillars: "pillarsBiopolitical",
};
const PLATFORM = createPlatformRuntime({
  storage: window.localStorage,
  settingsKey: SETTINGS_KEY,
  adapters: [
    createStrategicLensAdapter({
      buildPrompt: buildStrategicPrompt,
      createSample: ({ lang, mode }) => sampleStrategicAnalysis(lang, mode),
      renderEngineNav,
      renderReview,
    }),
    createBiopoliticalLensAdapter({
      buildPrompt: (options) => BIO.buildPrompt(options),
      createSample: ({ lang, mode }) => BIO.sample(lang, mode),
      renderEngineNav: renderBiopoliticalEngineNav,
      renderReview: renderBiopoliticalReview,
    }),
  ],
  localization: {
    catalogs: I18N,
    supportedLanguages: SUPPORTED_LANGUAGES,
    fallbackLanguage: "en",
    resolve: ({ language, key, context, raw }) => {
      if (context.lens !== "biopolitical") return undefined;
      const contractValue = BIO.ui(language, key);
      if (contractValue !== undefined) return contractValue;
      const alias = LENS_KEY_ALIASES[key];
      return alias ? raw(alias) : undefined;
    },
  },
  initialState: ({ settings }) => {
    const supported = (language) => SUPPORTED_LANGUAGES.includes(language);
    const interfaceLanguage = supported(settings.lang) ? settings.lang : "ar";
    const analysisLanguage = supported(settings.analysisLang)
      ? settings.analysisLang
      : interfaceLanguage;
    return {
      lang: interfaceLanguage,
      stage: "topic",
      topic: "",
      context: "",
      analysisLang: analysisLanguage,
      analysisLangFollowsUi:
        typeof settings.analysisLangFollowsUi === "boolean"
          ? settings.analysisLangFollowsUi
          : !supported(settings.analysisLang) || analysisLanguage === interfaceLanguage,
      promptMode: "simple",
      analysisLens: ["strategic", "biopolitical"].includes(settings.analysisLens)
        ? settings.analysisLens
        : "strategic",
      density: normalizeShellDensity(settings.density),
      shellSection: "workflow",
      analysis: null,
      jsonValid: false,
      activeReview: "overview",
      activePillar: null,
      lastPrompt: "",
      importValidation: null,
      importAudit: null,
      modalInvoker: null,
    };
  },
  regions: {
    shell() {
      applyI18n();
      renderLensToggle();
      renderApplicationShell();
    },
    workflow() {
      $("analysisLang").value = state.analysisLang;
      $("promptMode").value = state.promptMode;
      $("timeframeInput").value = state.context;
      $("topicInput").value = state.topic;
      renderGuide();
      renderStages();
    },
    engine() {
      activeLensAdapter().renderEngineNav();
    },
    review() {
      activeLensAdapter().renderReview();
    },
  },
  performance: { capacity: 160 },
});
const SETTINGS = PLATFORM.settings;
const LOCALIZATION = PLATFORM.localization;
const PLATFORM_STATE = PLATFORM.state;
const LENS_REGISTRY = PLATFORM.registry;
const PLATFORM_RENDERER = PLATFORM.renderer;
const state = PLATFORM_STATE.state;
const $ = (id) => document.getElementById(id);
const SHELL_PREFERENCES = createShellPreferences({
  document,
  settings: SETTINGS,
  initialDensity: state.density,
});
const isSupportedLanguage = LOCALIZATION.isSupported;
function readSettings() {
  return SETTINGS.read();
}
function writeSettings(patch) {
  SETTINGS.update(patch);
}
Object.defineProperty(window, "Jarbou3iPlatformDiagnostics", {
  value: Object.freeze({
    runtimeVersion: PLATFORM.runtimeVersion,
    inspect: PLATFORM.inspect,
  }),
});
function activeLensAdapter() {
  return LENS_REGISTRY.get(state.analysisLens);
}
function rawTFor(lang, key) {
  return LOCALIZATION.raw(lang, key);
}
function rawT(key) {
  return rawTFor(state.lang, key);
}
function tFor(lang, key, lens = state.analysisLens) {
  return LOCALIZATION.translate(lang, key, { lens });
}
function t(k) {
  return tFor(state.lang, k);
}
function activeWarnings() {
  return state.analysisLens === "biopolitical"
    ? rawT("warningsBiopolitical") || t("warnings")
    : t("warnings");
}
function warningText(key) {
  const w = activeWarnings();
  return w?.[key] || t(`warnings.${key}`);
}
function analysisSignalLabel() {
  return state.analysisLens === "biopolitical"
    ? labelText("Governance signal", "إشارة الحكم", "Signal de gouvernement")
    : labelText(
        "Strategic signal",
        "الإشارة الاستراتيجية",
        "Signal stratégique",
      );
}
function syncLanguageShell() {
  document.documentElement.lang = state.lang;
  document.documentElement.dir = state.lang === "ar" ? "rtl" : "ltr";
  $("langAr")?.classList.toggle("active", state.lang === "ar");
  $("langEn")?.classList.toggle("active", state.lang === "en");
  $("langFr")?.classList.toggle("active", state.lang === "fr");
  for (const lang of ["ar", "en", "fr"]) {
    const button = $(`lang${lang[0].toUpperCase()}${lang.slice(1)}`);
    const active = state.lang === lang;
    button?.setAttribute("aria-checked", active ? "true" : "false");
    if (button) button.tabIndex = active ? 0 : -1;
  }
}
function setLang(lang) {
  if (!isSupportedLanguage(lang)) return;
  state.lang = lang;
  const settingsPatch = { lang };
  if (state.analysisLangFollowsUi) {
    state.analysisLang = lang;
    settingsPatch.analysisLang = lang;
  }
  writeSettings(settingsPatch);
  renderAll();
  refreshDynamicMessages();
}
function setAnalysisLanguage(lang) {
  if (!isSupportedLanguage(lang)) return;
  state.analysisLang = lang;
  state.analysisLangFollowsUi = lang === state.lang;
  writeSettings({
    analysisLang: state.analysisLang,
    analysisLangFollowsUi: state.analysisLangFollowsUi,
  });
}
function applyI18n() {
  syncLanguageShell();
  document.title = `${t("appTitle")} — Jarbou3i Model`;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
  document.querySelectorAll("[data-i18n-option]").forEach((el) => {
    el.textContent = t(el.dataset.i18nOption);
  });
  document.querySelectorAll("[data-i18n-title]").forEach((el) => {
    const txt = t(el.dataset.i18nTitle);
    el.title = txt;
    el.setAttribute("aria-label", txt);
  });
  const seg = $("languageSegment");
  if (seg) seg.setAttribute("aria-label", t("languageLabel"));
  const lens = $("analysisLens");
  if (lens) lens.setAttribute("aria-label", t("analysisLens"));
}

function renderLensToggle() {
  document.body.classList.toggle(
    "bio-v2",
    state.analysisLens === "biopolitical",
  );
  document.querySelectorAll("#analysisLens [data-lens]").forEach((btn) => {
    const active = btn.dataset.lens === state.analysisLens;
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-checked", active ? "true" : "false");
    btn.tabIndex = active ? 0 : -1;
  });
  const hint = $("analysisLensHint");
  if (hint)
    hint.textContent =
      state.analysisLens === "biopolitical"
        ? t("lensBiopoliticalHint")
        : t("lensStrategicHint");
}
function renderApplicationShell() {
  const density = SHELL_PREFERENCES.current();
  const compact = density === "compact";
  const densityLabel = compact ? t("densityCompact") : t("densityComfortable");
  const densityButton = $("densityBtn");
  if (densityButton) {
    densityButton.setAttribute("aria-pressed", compact ? "true" : "false");
    densityButton.setAttribute("aria-label", `${t("densityTitle")}: ${densityLabel}`);
    densityButton.title = `${t("densityTitle")}: ${densityLabel}`;
  }
  if ($("densityLabel")) $("densityLabel").textContent = densityLabel;
  if ($("lensContextLabel")) {
    $("lensContextLabel").textContent = t(
      state.analysisLens === "biopolitical"
        ? "lensContextBiopolitical"
        : "lensContextStrategic",
    );
  }
  for (const id of ["workspaceBar", "workspaceNav"]) {
    $(id)?.setAttribute("aria-label", t("workspaceNavigation"));
  }

  const reviewAvailable = Boolean(state.analysis);
  const reviewShortcut = $("reviewNavShortcut");
  if (reviewShortcut) reviewShortcut.disabled = !reviewAvailable;
  if (state.shellSection === "review" && !reviewAvailable) {
    state.shellSection = "workflow";
  }
  document.querySelectorAll("[data-shell-nav]").forEach((button) => {
    const active = button.dataset.shellNav === state.shellSection;
    button.classList.toggle("active", active);
    button.tabIndex = active && !button.disabled ? 0 : -1;
    if (active) button.setAttribute("aria-current", "step");
    else button.removeAttribute("aria-current");
  });

  const command = resolveShellCommand({
    stage: state.stage,
    hasAnalysis: reviewAvailable,
  });
  const commandLabel = t(
    {
      topic: "shellActionTopic",
      import: "shellActionImport",
      review: "shellActionReview",
    }[command.id],
  );
  const nextAction = $("shellNextAction");
  if (nextAction) {
    nextAction.dataset.shellCommand = command.id;
    nextAction.setAttribute("aria-label", `${t("nextActionLabel")}: ${commandLabel}`);
  }
  if ($("shellNextActionLabel")) $("shellNextActionLabel").textContent = commandLabel;
  const nextIcon = nextAction?.querySelector(".shellNextActionIcon");
  if (nextIcon) nextIcon.textContent = state.lang === "ar" ? "←" : "→";
}
function setDensity(value, persist = true) {
  state.density = SHELL_PREFERENCES.apply(value, { persist });
  renderApplicationShell();
}
function navigateShell(section, { focusTarget = null, announce = true } = {}) {
  const targets = {
    workflow: "workflowPanel",
    engine: "enginePanel",
    review: "reviewPanel",
  };
  if (!targets[section] || (section === "review" && !state.analysis)) return;
  state.shellSection = section;
  renderApplicationShell();
  requestAnimationFrame(() => {
    $(targets[section])?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start",
    });
    if (focusTarget) $(focusTarget)?.focus({ preventScroll: true });
    if (announce && $("shellAnnouncement")) {
      $("shellAnnouncement").textContent = t(
        {
          workflow: "shellMovedToSetup",
          engine: "shellMovedToModel",
          review: "shellMovedToReview",
        }[section],
      );
    }
  });
}
function bindWorkspaceNavigation() {
  const buttons = [...document.querySelectorAll("[data-shell-nav]")];
  buttons.forEach((button) => {
    button.onclick = () => navigateShell(button.dataset.shellNav);
    button.addEventListener("keydown", (event) => {
      const section = nextShellSection(button.dataset.shellNav, event.key, {
        reviewAvailable: Boolean(state.analysis),
        direction: document.documentElement.dir,
      });
      if (!section) return;
      event.preventDefault();
      navigateShell(section);
      document.querySelector(`[data-shell-nav="${section}"]`)?.focus();
    });
  });
}
function setAnalysisLens(lens) {
  if (!LENS_REGISTRY.has(lens) || state.analysisLens === lens) return;
  const contractChanged =
    state.analysis && state.analysis.analysis_lens !== lens;
  state.analysisLens = lens;
  writeSettings({ analysisLens: lens });
  if (contractChanged) {
    state.analysis = null;
    state.stage = "topic";
    state.activeReview = "overview";
    state.activePillar = null;
    state.jsonValid = false;
    state.shellSection = "workflow";
    const input = $("jsonInput");
    if (input) input.value = "";
  }
  state.lastPrompt = "";
  renderAll();
  refreshDynamicMessages();
}
function bindRadioGroupKeyboard(selector, activate) {
  const buttons = [...document.querySelectorAll(selector)];
  buttons.forEach((button, index) => {
    button.addEventListener("keydown", (event) => {
      if (
        !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(
          event.key,
        )
      )
        return;
      event.preventDefault();
      let nextIndex = index;
      if (event.key === "Home") nextIndex = 0;
      else if (event.key === "End") nextIndex = buttons.length - 1;
      else {
        const offset = ["ArrowRight", "ArrowDown"].includes(event.key) ? 1 : -1;
        nextIndex = (index + offset + buttons.length) % buttons.length;
      }
      const next = buttons[nextIndex];
      activate(next);
      next.focus();
    });
  });
}
function refreshDynamicMessages() {
  validateJsonInput();
  const status = $("topicStatus");
  if (!status) return;
  if (state.stage === "topic") {
    status.className = "status warn";
    status.textContent = t("topicStatusStart");
  } else if (state.stage === "import") {
    status.className = state.lastPrompt ? "status good" : "status warn";
    status.textContent = state.lastPrompt
      ? t("promptCopied")
      : t("topicStatusStart");
  } else if (state.stage === "review") {
    status.className = "status good";
    status.textContent = t("analysisImported");
  }
}
function toast(msg, kind = "") {
  const el = $("toast");
  el.textContent = msg;
  el.className = "toast show";
  setTimeout(() => el.classList.remove("show"), 2600);
}
function setTheme(isDark, persist = true) {
  document.body.classList.toggle("dark", !!isDark);
  const btn = $("themeBtn");
  if (btn) btn.setAttribute("aria-pressed", isDark ? "true" : "false");
  if (persist) writeSettings({ theme: isDark ? "dark" : "light" });
}
function initializeTheme() {
  const pref = PLATFORM.bootSettings.theme;
  const dark = pref
    ? pref === "dark"
    : window.matchMedia?.("(prefers-color-scheme: dark)").matches;
  setTheme(dark, false);
}
async function copyText(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {}
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  } catch {
    return false;
  }
}
function normalizeArray(x) {
  return Array.isArray(x) ? x : [];
}
function normalizeAnalysis(raw) {
  const source = raw && typeof raw === "object" ? raw : {};
  const lens = ["strategic", "biopolitical"].includes(
    source.analysis_lens || source.analysisLens,
  )
    ? source.analysis_lens || source.analysisLens
    : state.analysisLens;
  if (lens === "biopolitical") {
    const validation = BIO_INTEGRITY.validateImport(source);
    state.importValidation = validation;
    if (!validation.ok) {
      const error = new Error(validation.errors[0]?.message || "invalid");
      error.validation = validation;
      throw error;
    }
    return validation.analysis;
  }
  const citationCount = BIO.countNonPortableCitationMarkers(source);
  const a = BIO.sanitizePortableValue(source);
  state.importValidation = citationCount
    ? {
        ok: true,
        state: "strategic",
        warnings: [
          {
            code: "NON_PORTABLE_CITATION_MARKERS_REMOVED",
            path: "/",
            severity: "warning",
            count: citationCount,
            message: `${citationCount} non-portable citation marker${citationCount === 1 ? " was" : "s were"} removed.`,
          },
        ],
      }
    : null;
  const out = {
    schema_version: a.schema_version || a.schemaVersion || "1.0.0",
    analysis_id: a.analysis_id || a.analysisId || "",
    generated_at: a.generated_at || a.generatedAt || "",
    language: a.language || a.lang || "",
    model_mode: a.model_mode || a.modelMode || "",
    analysis_lens: "strategic",
    subject: a.subject || {},
    contradictions: a.contradictions || {},
    scenarios: a.scenarios || {},
    evidence: a.evidence || {},
    assumptions: a.assumptions || {},
    links: normalizeArray(a.links),
    quality_gate: a.quality_gate || a.qualityGate || {},
  };
  PILLARS.forEach((p) => (out[p] = normalizeArray(a[p])));
  out.contradictions.items = normalizeArray(out.contradictions.items);
  out.scenarios.items = normalizeArray(out.scenarios.items);
  out.evidence.items = normalizeArray(out.evidence.items);
  out.assumptions.items = normalizeArray(out.assumptions.items);
  return out;
}
function extractJson(text) {
  return JSON_TOOLS.extractJson(text);
}
function localizedImportIssueMessage(issue = {}) {
  const fallback = issue.message || issue.code || "";
  if (state.lang === "en") return fallback;
  const code = String(issue.code || "");
  const messages = {
    ar: {
      INVALID_SOURCE_URL: "رابط المصدر ليس رابط HTTP(S) مطلقًا؛ يُسمح بالاستيراد للمراجعة، لكن يظل النشر محظورًا.",
      EVIDENCE_NOT_PUBLICATION_READY: "الدليل عنصر نائب أو غير قابل للتتبع أو غير متحقق منه بالكامل.",
      SELF_AUDIT_VERIFICATION_CONTRADICTION: "لا يمكن أن يجتاز تدقيق التحقق ما دامت أدلة غير متحقق منها؛ يُسمح بالاستيراد للمراجعة، لكن يظل النشر محظورًا.",
      VERIFICATION_PROVENANCE_DOWNGRADED: "ادّعى سجل الدليل تحققًا كاملًا دون هوية المراجع وتاريخ التحقق؛ خُفِّضت حالته للمراجعة ولا يمكنه اجتياز بوابة النشر.",
      UNTRACEABLE_VERIFIED_EVIDENCE: "لا يجوز أن يستخدم الدليل المعلَّم كمتحقق منه عنصرًا نائبًا؛ ويلزمه رابط أو محدد مصدر دقيق.",
      UNJUSTIFIED_VERIFIED_EVIDENCE: "يتطلب الدليل المتحقق منه تقييمًا واضحًا لمدى ملاءمة المصدر للادعاء.",
      UNREFERENCED_EVIDENCE: "سجل الدليل غير مستشهد به في ادعاء خضع للتقييم.",
      QUANTITATIVE_METADATA_MISSING: "تتطلب الأدلة الكمية استكمال بيانات التصميم والقياس قبل النشر.",
      MIGRATED_DRAFT_NOT_CANONICAL: "تحافظ هذه المسودة المُرحَّلة على المادة القديمة، لكنها ليست بيانات حيوية سياسية نظامية مكتملة.",
      MISSING_EXPLANATION_FALSIFIER: "يلزم معيار قابل للاختبار يمكنه دحض هذا التفسير قبل النشر.",
      NON_PORTABLE_CITATION_MARKERS_REMOVED: "أزيلت علامات استشهاد خاصة بواجهة المساعد من النسخة المطبّعة.",
      DUPLICATE_GLOBAL_ID: "يجب أن يكون كل معرّف نظامي فريدًا في كامل التحليل.",
      UNSUPPORTED_CONTRACT: "إصدار عقد التحليل غير مدعوم في هذه النسخة من الأداة.",
      VALIDATOR_UNAVAILABLE: "مدقق عقد التحليل غير متاح.",
    },
    fr: {
      INVALID_SOURCE_URL: "L’URL de la source n’est pas une URL HTTP(S) absolue ; l’import est autorisé pour révision, mais la publication reste bloquée.",
      EVIDENCE_NOT_PUBLICATION_READY: "La preuve est un substitut, n’est pas traçable ou n’est pas entièrement vérifiée.",
      SELF_AUDIT_VERIFICATION_CONTRADICTION: "L’audit de vérification ne peut pas être validé tant que des preuves restent non vérifiées ; l’import est autorisé pour révision, mais la publication reste bloquée.",
      VERIFICATION_PROVENANCE_DOWNGRADED: "Une preuve déclarait une vérification complète sans identité du réviseur ni date de vérification ; son statut a été rétrogradé pour révision et ne peut pas franchir le contrôle de publication.",
      UNTRACEABLE_VERIFIED_EVIDENCE: "Une preuve marquée comme vérifiée ne peut pas utiliser un substitut et doit fournir une URL ou un localisateur précis.",
      UNJUSTIFIED_VERIFIED_EVIDENCE: "Une preuve vérifiée exige une évaluation explicite de l’adéquation entre la source et l’affirmation.",
      UNREFERENCED_EVIDENCE: "Cette preuve n’est citée par aucune affirmation évaluée.",
      QUANTITATIVE_METADATA_MISSING: "Les preuves quantitatives exigent des métadonnées complètes de conception et de mesure avant publication.",
      MIGRATED_DRAFT_NOT_CANONICAL: "Ce brouillon migré conserve le contenu historique, mais ne constitue pas encore des données biopolitiques canoniques complètes.",
      MISSING_EXPLANATION_FALSIFIER: "Un critère testable susceptible de réfuter cette explication est requis avant publication.",
      NON_PORTABLE_CITATION_MARKERS_REMOVED: "Les marqueurs de citation propres à l’interface de l’assistant ont été retirés de la copie normalisée.",
      DUPLICATE_GLOBAL_ID: "Chaque identifiant canonique doit être unique dans l’ensemble de l’analyse.",
      UNSUPPORTED_CONTRACT: "Cette version du contrat d’analyse n’est pas prise en charge par cette version de l’outil.",
      VALIDATOR_UNAVAILABLE: "Le validateur du contrat d’analyse n’est pas disponible.",
    },
  };
  if (messages[state.lang]?.[code]) return messages[state.lang][code];
  if (code.startsWith("SCHEMA_")) {
    return state.lang === "ar"
      ? "لا تطابق القيمة بنية عقد التحليل المطلوبة."
      : "La valeur ne respecte pas la structure requise par le contrat d’analyse.";
  }
  return state.lang === "ar"
    ? "تتطلب هذه المسألة مراجعة قبل النشر."
    : "Ce point exige une révision avant publication.";
}
function importErrorText(error) {
  const first = error?.validation?.errors?.[0];
  if (!first) return t("jsonParseProblem");
  const prefix = labelText(
    "Contract validation failed",
    "فشل التحقق من العقد",
    "Échec de validation du contrat",
  );
  return `${prefix}: ${first.path || "/"} — ${localizedImportIssueMessage(first)}`;
}
function renderImportAuditDetails({ warnings = [], parsed, provenance } = {}) {
  const details = $("importAuditDetails");
  const summary = $("importAuditSummary");
  const body = $("importAuditBody");
  if (!details || !summary || !body) return;
  if (!parsed && !provenance && !warnings.length) {
    details.hidden = true;
    details.open = false;
    body.textContent = "";
    return;
  }
  const citationRepair = warnings.find(
    (warning) => warning.code === "NON_PORTABLE_CITATION_MARKERS_REMOVED",
  );
  const blocking = provenance?.total
    ? provenance.total - provenance.approved
    : 0;
  const repairCount = (parsed?.recovered ? 1 : 0) +
    (citationRepair?.count || 0);
  summary.textContent = labelText(
    `Review details · ${blocking} blocking · ${warnings.length} review · ${repairCount} repaired`,
    `تفاصيل المراجعة · ${blocking} عوائق · ${warnings.length} للمراجعة · ${repairCount} إصلاحات`,
    `Détails · ${blocking} blocages · ${warnings.length} à revoir · ${repairCount} réparations`,
  );
  const warningItems = warnings.length
    ? `<ul>${warnings
        .slice(0, 12)
        .map(
          (warning) =>
            `<li><span class="importAuditPath" dir="ltr">${escapeHtml(warning.path || "/")}</span> — ${escapeHtml(localizedImportIssueMessage(warning))}</li>`,
        )
        .join("")}</ul>`
    : `<p>${escapeHtml(labelText("No contract or integrity warnings.", "لا توجد تنبيهات عقد أو نزاهة.", "Aucun avertissement de contrat ou d’intégrité."))}</p>`;
  const repairs = [
    parsed?.recovered
      ? labelText(
          "JSON wrappers, comments, or trailing punctuation were conservatively repaired.",
          "تم إصلاح أغلفة JSON أو التعليقات أو علامات الترقيم اللاحقة بصورة محافظة.",
          "Les enveloppes JSON, commentaires ou ponctuations finales ont été réparés de façon conservative.",
        )
      : "",
    citationRepair
      ? labelText(
          `${citationRepair.count || 1} non-portable citation markers were removed from the normalized copy.`,
          `أزيلت ${citationRepair.count || 1} من علامات الاستشهاد غير القابلة للنقل من النسخة المطبّعة.`,
          `${citationRepair.count || 1} marqueurs de citation non portables ont été retirés de la copie normalisée.`,
        )
      : "",
  ].filter(Boolean);
  body.innerHTML = `${
    provenance?.total
      ? `<section class="importAuditGroup"><h4>${escapeHtml(labelText("Blocking", "العوائق", "Blocage"))}</h4><p>${escapeHtml(labelText(`${blocking} of ${provenance.total} evidence records lack independent approval. Model-declared verification remains untrusted.`, `${blocking} من ${provenance.total} سجلات أدلة بلا اعتماد مستقل. ويظل التحقق الذي يعلنه النموذج غير موثوق.`, `${blocking} preuves sur ${provenance.total} n’ont pas d’approbation indépendante. La vérification déclarée par le modèle reste non fiable.`))}</p></section>`
      : ""
  }<section class="importAuditGroup"><h4>${escapeHtml(labelText("Review required", "تتطلب مراجعة", "Révision requise"))}</h4>${warningItems}</section><section class="importAuditGroup"><h4>${escapeHtml(labelText("Automatic repair", "الإصلاح التلقائي", "Réparation automatique"))}</h4>${repairs.length ? `<ul>${repairs.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : `<p>${escapeHtml(labelText("No automatic content repair was required.", "لم يلزم إصلاح تلقائي للمحتوى.", "Aucune réparation automatique du contenu n’a été nécessaire."))}</p>`}<p>${escapeHtml(labelText("The original pasted text is preserved in the current import audit until the input is cleared.", "يُحفظ النص الأصلي الملصق في تدقيق الاستيراد الحالي حتى مسح الإدخال.", "Le texte collé d’origine reste conservé dans l’audit courant jusqu’à l’effacement de l’entrée."))}</p></section>`;
  details.hidden = false;
}
function validateJsonInput() {
  const text = $("jsonInput").value.trim();
  if (!text) {
    state.jsonValid = false;
    state.importAudit = null;
    $("importBtn").disabled = true;
    $("repairPromptBtn").disabled = true;
    $("jsonStatus").className = "status";
    $("jsonStatus").textContent = t("jsonWaiting");
    $("pasteCard").classList.remove("ready", "invalid");
    renderImportAuditDetails();
    return null;
  }
  try {
    state.importValidation = null;
    const parsed = extractJson(text);
    const raw = parsed.value;
    const analysis = normalizeAnalysis(raw);
    const has =
      analysis.analysis_lens === "biopolitical"
        ? BIO.hasSubstance(analysis)
        : PILLARS.some((p) => analysis[p].length) ||
          analysis.contradictions.items.length ||
          analysis.scenarios.items.length;
    if (!has) throw new Error("incomplete");
    state.jsonValid = true;
    $("importBtn").disabled = false;
    $("repairPromptBtn").disabled = false;
    const warnings = state.importValidation?.warnings || [];
    const provenance = PROVENANCE.assessEvidenceProvenance(analysis, {
      lens: analysis.analysis_lens,
    });
    const citationRepair = warnings.find(
      (warning) => warning.code === "NON_PORTABLE_CITATION_MARKERS_REMOVED",
    );
    const citationNotice = citationRepair
      ? labelText(
          `${citationRepair.count || 1} non-portable assistant citation marker${citationRepair.count === 1 ? " was" : "s were"} removed; canonical evidence IDs and source URLs were preserved.`,
          `تمت إزالة ${citationRepair.count || 1} من علامات استشهاد المساعد غير القابلة للنقل؛ وحُفظت معرّفات الأدلة وروابط المصادر النظامية.`,
          `${citationRepair.count || 1} marqueur${citationRepair.count === 1 ? " interne non portable a été supprimé" : "s internes non portables ont été supprimés"} ; les identifiants de preuve et URL de source canoniques ont été préservés.`,
        )
      : "";
    state.importAudit = Object.freeze({
      originalText: text,
      parsedSource: parsed.source,
      recovered: parsed.recovered,
      warnings: Object.freeze([...warnings]),
      provenance,
    });
    renderImportAuditDetails({ warnings, parsed, provenance });
    const needsIndependentReview =
      analysis.analysis_lens === "biopolitical" &&
      provenance.total > 0 &&
      provenance.humanReview < 100;
    $("jsonStatus").className =
      warnings.length || parsed.recovered || needsIndependentReview
        ? "status warn"
        : "status good";
    const draft = state.importValidation?.state === "migrated_draft";
    const validationMessage = draft
      ? labelText(
          "Legacy material is valid as a migrated draft; publication remains blocked until canonical completion.",
          "المادة القديمة صالحة كمسودة مُرحّلة، ويظل النشر محظورًا حتى استكمال العقد النظامي.",
          "Le contenu historique est valide comme brouillon migré ; la publication reste bloquée jusqu’à sa mise en conformité canonique.",
        )
      : needsIndependentReview
        ? labelText(
            `Reviewable draft. Blocking: ${provenance.total - provenance.approved} of ${provenance.total} evidence records lack independent approval. Review: ${warnings.length} contract or integrity warning${warnings.length === 1 ? "" : "s"}. Import is allowed; publication is blocked.`,
            `مسودة قابلة للمراجعة. العوائق: ${provenance.total - provenance.approved} من ${provenance.total} سجلات أدلة بلا اعتماد مستقل. المراجعة: ${warnings.length} ${warnings.length === 1 ? "تنبيه عقد أو نزاهة" : "تنبيهات عقد أو نزاهة"}. الاستيراد مسموح والنشر محظور.`,
            `Brouillon révisable. Blocage : ${provenance.total - provenance.approved} preuves sur ${provenance.total} sans approbation indépendante. Révision : ${warnings.length} avertissement${warnings.length === 1 ? "" : "s"} de contrat ou d’intégrité. L’import est permis ; la publication est bloquée.`,
          )
        : warnings.length
          ? labelText(
              `Valid analysis with ${warnings.length} review warning${warnings.length === 1 ? "" : "s"}. Import is allowed; publication remains blocked until review is complete.`,
              `التحليل صالح مع ${warnings.length} ${warnings.length === 1 ? "تنبيه للمراجعة" : "تنبيهات للمراجعة"}. الاستيراد مسموح، ويظل النشر محظورًا حتى اكتمال المراجعة.`,
              `Analyse valide avec ${warnings.length} avertissement${warnings.length === 1 ? "" : "s"}. L’import est permis ; la publication reste bloquée jusqu’à la fin de la révision.`,
            )
        : parsed.recovered
        ? t("jsonAutoRecovered")
        : t("jsonValid");
    $("jsonStatus").textContent = [validationMessage, citationNotice]
      .filter(Boolean)
      .join(" ");
    $("pasteCard").classList.add("ready");
    $("pasteCard").classList.remove("invalid");
    return analysis;
  } catch (e) {
    state.importAudit = Object.freeze({
      originalText: text,
      error: importErrorText(e),
    });
    renderImportAuditDetails({
      warnings: e?.validation?.errors || [],
      parsed: null,
      provenance: null,
    });
    state.jsonValid = false;
    $("importBtn").disabled = true;
    $("repairPromptBtn").disabled = false;
    $("jsonStatus").className = "status bad";
    $("jsonStatus").textContent = importErrorText(e);
    $("pasteCard").classList.remove("ready");
    $("pasteCard").classList.add("invalid");
    return null;
  }
}
function buildSchema(
  lang = state.analysisLang,
  mode = state.promptMode,
  lens = state.analysisLens,
) {
  const ar = lang === "ar";
  const fr = lang === "fr";
  const label = ar
    ? "أعد JSON صالحًا فقط بالبنية التالية"
    : fr
      ? "Retourne uniquement un JSON valide avec la structure suivante"
      : "Return valid JSON only using this structure";
  if (lens === "biopolitical")
    return `${label}\n${BIO.buildSchemaTemplate(lang, mode)}`;
  const schema = {
    schema_version: "1.1.0",
    analysis_id: "slug-or-short-id",
    generated_at: "YYYY-MM-DDTHH:mm:ssZ",
    language: "ar|en|fr",
    model_mode: mode,
    analysis_lens: "strategic",
    subject: {
      title: "string",
      context: "string",
      question: "string",
      executive_thesis: "string",
    },
    interests: [
      {
        id: "I1",
        name: "string",
        type: "strategic|economic|political|ideological",
        intensity: 1,
        horizon: "short|medium|long",
        stakes: "marginal|important|existential",
        confidence: "high|medium|low",
        rationale: "string",
      },
    ],
    actors: [
      {
        id: "A1",
        name: "string",
        category: "state|company|movement|institution|external|society|lobby",
        financial: 1,
        decision_access: 1,
        disruption_capacity: 1,
        media_influence: 1,
        confidence: "high|medium|low",
        rationale: "string",
      },
    ],
    tools: [
      {
        id: "T1",
        name: "string",
        type: "military|economic|legal|diplomatic|media|technological|social",
        cost: 1,
        risk: 1,
        speed: 1,
        reversibility: 1,
        deniability: 1,
        confidence: "high|medium|low",
        rationale: "string",
      },
    ],
    narrative: [
      {
        id: "N1",
        name: "string",
        frame:
          "security|democracy|sovereignty|identity|prosperity|rights|other",
        coherence: 1,
        media_alignment: 1,
        public_acceptance: 1,
        confidence: "high|medium|low",
        rationale: "string",
      },
    ],
    results: [
      {
        id: "R1",
        name: "string",
        type: "direct|indirect|unintended",
        goal_achieved_pct: 50,
        cost_benefit: 1,
        power_balance_impact: "strengthened|neutral|weakened",
        confidence: "high|medium|low",
        rationale: "string",
      },
    ],
    feedback: [
      {
        id: "F1",
        description: "string",
        adapts: "interests|actors|tools|narrative",
        speed: "fast|slow",
        confidence: "high|medium|low",
        rationale: "string",
      },
    ],
    contradictions: {
      items: [
        {
          id: "C1",
          rhetoric: "string",
          contradiction_type:
            "rhetoric_vs_action|interest_vs_alliance|tool_vs_goal|result_vs_intention|claim_vs_evidence|internal_inconsistency",
          actions: ["string"],
          affected_layers: [
            "interests|actors|tools|narrative|results|feedback",
          ],
          interpretation: "string",
          severity: 1,
          confidence: "high|medium|low",
        },
      ],
    },
    scenarios: {
      items: [
        {
          id: "S1",
          name: "string",
          probability: 40,
          timeframe: "string",
          drivers: ["string"],
          early_signals: ["string"],
          disproven_if: ["string"],
          rationale: "string",
        },
      ],
    },
    quality_gate: {
      publication_risk: "low|medium|high",
      weakest_layer: "string",
      next_improvement: "string",
    },
  };
  if (mode === "expert" || mode === "research") {
    schema.evidence = {
      items: [
        {
          id: "E1",
          claim: "string",
          basis: "observation|inference|estimate|source_based",
          source_title: "string",
          source_url: "string",
          source_date: "YYYY-MM-DD",
          source_note: "string",
          evidence_strength: 1,
          counter_evidence: "string",
          confidence: "high|medium|low",
        },
      ],
    };
    schema.assumptions = {
      items: [
        {
          id: "AS1",
          assumption: "string",
          risk: "low|medium|high",
          disproving_test: "string",
          confidence: "high|medium|low",
        },
      ],
    };
    schema.links = [
      {
        from: "id",
        to: "id",
        relation: "causes|enables|constrains|contradicts|feeds_back",
        confidence: "high|medium|low",
      },
    ];
  }
  return `${label}\n${JSON.stringify(schema, null, 2)}`;
}
function buildStrategicPrompt({ lang, mode, topic, context }) {
  const ar = lang === "ar";
  const fr = lang === "fr";
  const modeText =
    mode === "research"
      ? ar
        ? "بحثي: أضف أدلة مصدرية، أدلة مضادة، عدم يقين، وروابط سببية مرقمة."
        : fr
          ? "Recherche : ajoute des preuves sourcées, des contre-preuves, de l’incertitude et des liens causaux identifiés."
          : "Research: include source-grounded evidence, counter-evidence, uncertainty, and ID-based causal links."
      : mode === "expert"
        ? ar
          ? "خبير: أضف الأدلة، الافتراضات، والروابط السببية."
          : fr
            ? "Expert : ajoute des preuves, des hypothèses et des liens causaux."
            : "Expert: include evidence, assumptions, and causal links."
        : ar
          ? "مركّز: ركّز على الطبقات الست، التناقضات، والسيناريوهات."
          : fr
            ? "Ciblé : priorise les six couches, les contradictions et les scénarios."
            : "Focused: prioritize the six layers, contradictions, and scenarios.";
  if (ar)
    return `أنت محلل استراتيجي صارم. حلّل الموضوع التالي باستخدام نموذج: مصالح → فاعلون → أدوات → سردية → نتائج → تغذية راجعة.

الموضوع: ${topic}
السياق: ${context || "غير محدد"}
النمط: ${modeText}

قواعد مهمة:
- اكتب كل محتوى التحليل باللغة العربية.
- لا تُرجع أي شرح خارج JSON.
- لا تستخدم علامات استشهاد داخلية للمساعد مثل cite أو filecite أو turn؛ استخدم روابط HTTP(S) عامة وملاحظات مصادر قابلة للنقل فقط.
- فرّق بين الملاحظة والاستنتاج والتقدير عندما يكون ذلك مطلوبًا.
- في التناقضات: إذا كانت نفس السردية/الخطاب ينتج عدة أفعال متناقضة، اجعلها مجموعة واحدة تحتوي actions متعددة.
- في السيناريوهات: أضف شروطًا واضحة تُضعف أو تُبطل السيناريو.
- قبل إخراج JSON النهائي، راجع داخليًا: الفاعلين المفقودين، السببية الأحادية، الافتراضات غير المدعومة، ضعف الأدلة، غياب الأدلة المضادة، وغياب شروط الإبطال.
- لا تكتب مراجعتك الداخلية؛ أخرج JSON المصحح فقط.

${buildSchema(lang, mode, "strategic")}`;
  if (fr)
    return `Tu es un analyste stratégique rigoureux. Analyse le sujet suivant avec le modèle : Intérêts → Acteurs → Outils → Narratif → Résultats → Rétroaction.

Sujet : ${topic}
Contexte : ${context || "non précisé"}
Mode : ${modeText}

Règles :
- Rédige tout le contenu de l’analyse en français.
- Retourne uniquement du JSON. Aucun texte explicatif en dehors du JSON.
- N’utilise aucun marqueur interne d’assistant tel que cite, filecite ou turn ; utilise uniquement des URL HTTP(S) publiques et des notes de source portables.
- Sépare observation, inférence et estimation lorsque c’est pertinent.
- Dans les contradictions : si la même rhétorique/hypothèse produit plusieurs actions contradictoires, conserve une seule entrée avec plusieurs actions.
- Dans les scénarios : inclue des conditions claires qui affaibliraient ou réfuteraient chaque scénario.
- Avant le JSON final, audite silencieusement : acteurs manquants, monocausalité, hypothèses non étayées, preuves faibles, absence de contre-preuves et absence de réfutateurs.
- Ne montre pas cet audit interne ; retourne uniquement le JSON corrigé.

${buildSchema(lang, mode, "strategic")}`;
  return `You are a rigorous strategic analyst. Analyze the following topic using the model: Interests → Actors → Tools → Narrative → Results → Feedback.

Topic: ${topic}
Context: ${context || "not specified"}
Mode: ${modeText}

Rules:
- Write all analysis content in English.
- Return JSON only. No explanation outside JSON.
- Never use assistant-internal citation markers such as cite, filecite, or turn; use public HTTP(S) URLs and portable source notes only.
- Separate observation, inference, and estimate where requested.
- In contradictions: if the same rhetoric/hypothesis has multiple contradictory actions, keep it as one contradiction group with multiple actions.
- In scenarios: include clear conditions that would weaken or disprove each scenario.
- Before final JSON, silently audit for missing actors, monocausal reasoning, unsupported assumptions, weak evidence, absent counter-evidence, and missing falsifiers.
- Do not reveal the audit. Return only the corrected JSON.

${buildSchema(lang, mode, "strategic")}`;
}
function buildPrompt() {
  const lang = $("analysisLang").value;
  setAnalysisLanguage(lang);
  state.promptMode = $("promptMode").value;
  state.topic = $("topicInput").value.trim();
  state.context = $("timeframeInput").value.trim();
  return activeLensAdapter().buildPrompt({
    lang,
    mode: state.promptMode,
    topic: state.topic,
    context: state.context,
  });
}
function sampleStrategicAnalysis(lang = state.lang, mode = state.promptMode) {
  const metadata = {
    schema_version: "1.1.0",
    analysis_id: `sample-strategic-${lang}`,
    generated_at: "2026-07-17T00:00:00Z",
    language: lang,
    model_mode: mode,
    analysis_lens: "strategic",
  };
  const fr = lang === "fr";
  if (fr)
    return normalizeAnalysis({
      ...metadata,
      subject: {
        title: "Exemple : résultats de la Seconde Guerre mondiale",
        context: "1939–1947, ordre international",
        question:
          "Comment les résultats de la Seconde Guerre mondiale ont-ils remodelé l’ordre international ?",
        executive_thesis:
          "La guerre a déplacé le centre de gravité du système international vers les États-Unis et l’Union soviétique, tout en créant une architecture institutionnelle destinée à empêcher une nouvelle guerre totale.",
      },
      interests: [
        {
          id: "I1",
          name: "Empêcher le retour de l’hégémonie allemande",
          type: "strategic",
          intensity: 5,
          horizon: "long",
          stakes: "existential",
          confidence: "high",
          rationale:
            "Deux guerres mondiales ont transformé le contrôle de la puissance allemande en priorité de sécurité.",
        },
        {
          id: "I2",
          name: "Reconstruire l’économie internationale",
          type: "economic",
          intensity: 4,
          horizon: "long",
          stakes: "important",
          confidence: "high",
          rationale:
            "La destruction matérielle imposait des mécanismes de financement, de commerce et de stabilisation.",
        },
      ],
      actors: [
        {
          id: "A1",
          name: "États-Unis",
          category: "state",
          power_index: 5,
          financial: 5,
          decision_access: 5,
          disruption_capacity: 4,
          media_influence: 4,
          confidence: "high",
          rationale:
            "Leur capacité industrielle, financière et militaire leur permettait d’organiser l’ordre d’après-guerre.",
        },
        {
          id: "A2",
          name: "Union soviétique",
          category: "state",
          power_index: 5,
          financial: 3,
          decision_access: 4,
          disruption_capacity: 5,
          media_influence: 3,
          confidence: "high",
          rationale:
            "Sa domination militaire en Europe de l’Est lui donnait un poids structurel.",
        },
      ],
      tools: [
        {
          id: "T1",
          name: "Institutions internationales",
          type: "diplomatic",
          cost: 3,
          risk: 2,
          speed: 3,
          reversibility: 2,
          deniability: 1,
          confidence: "high",
          rationale:
            "L’ONU et Bretton Woods ont fourni des instruments de coordination et de légitimité.",
        },
      ],
      narrative: [
        {
          id: "N1",
          name: "Empêcher une nouvelle guerre totale",
          frame: "security",
          coherence: 5,
          media_alignment: 4,
          public_acceptance: 5,
          confidence: "high",
          rationale:
            "Le traumatisme humain et matériel rendait ce cadrage très puissant.",
        },
      ],
      results: [
        {
          id: "R1",
          name: "Ordre bipolaire",
          type: "direct",
          goal_achieved_pct: 75,
          cost_benefit: 3,
          power_balance_impact: "strengthened",
          confidence: "high",
          rationale:
            "Le pouvoir s’est concentré autour de Washington et Moscou.",
        },
      ],
      feedback: [
        {
          id: "F1",
          description:
            "La rivalité entre alliés a transformé la coopération militaire en compétition idéologique.",
          adapts: "actors",
          speed: "fast",
          confidence: "high",
          rationale:
            "Les intérêts de sécurité ont divergé dès la reconstruction.",
        },
      ],
      contradictions: {
        items: [
          {
            id: "C1",
            rhetoric:
              "La sécurité collective empêcherait une nouvelle guerre mondiale.",
            contradiction_type: "result_vs_intention",
            actions: [
              "Le Conseil de sécurité a donné un veto aux grandes puissances.",
              "La rivalité Est-Ouest a limité l’application collective.",
            ],
            affected_layers: ["narrative", "results", "feedback"],
            interpretation:
              "La sécurité collective dépendait d’une hiérarchie de puissances plutôt que d’une égalité souveraine complète.",
            severity: 8,
            confidence: "high",
          },
        ],
      },
      scenarios: {
        items: [
          {
            id: "S1",
            name: "Normalisation institutionnelle contenue",
            probability: 45,
            timeframe: "1947–1955",
            drivers: [
              "Reconstruction européenne",
              "Dépendance à l’aide américaine",
              "Institutionnalisation multilatérale",
            ],
            early_signals: [
              "Plans de reconstruction",
              "Nouvelles alliances",
              "Coordination économique",
            ],
            disproven_if: [
              "Les grandes puissances acceptent une gouvernance réellement égalitaire.",
            ],
            rationale: "L’ordre devient stable mais hiérarchisé.",
          },
        ],
      },
      evidence: {
        items: [
          {
            id: "E1",
            claim:
              "Les États-Unis sortent de la guerre avec une puissance industrielle et financière exceptionnelle.",
            basis: "source_based",
            source_title: "Référence sur la distribution historique de la puissance",
            source_note:
              "Données historiques générales sur la production et le financement de guerre.",
            counter_evidence:
              "Certains États européens ont conservé une capacité institutionnelle et économique substantielle après 1945.",
            uncertainty:
              "Inférence historique agrégée ; la source doit être précisée avant toute publication.",
            confidence: "high",
          },
        ],
      },
      assumptions: {
        items: [
          {
            id: "AS1",
            assumption:
              "La stabilité d’après-guerre dépend de la capacité américaine à financer la reconstruction.",
            risk: "medium",
            disproving_test:
              "Montrer une reconstruction équivalente sans financement américain.",
            implication_if_wrong:
              "Le poids causal des institutions américaines serait surestimé.",
          },
        ],
      },
      links: [
        { from: "I1", to: "A1", relation: "motivates", confidence: "high" },
        { from: "A1", to: "T1", relation: "uses", confidence: "high" },
        { from: "T1", to: "R1", relation: "produces", confidence: "medium" },
      ],
    });
  const ar = lang === "ar";
  return normalizeAnalysis(
    ar
      ? {
          ...metadata,
          subject: {
            title: "مثال: الحرب العالمية الثانية وما بعدها",
            context: "1939–1947، النظام الدولي",
            question:
              "كيف أعادت مخرجات الحرب العالمية الثانية تشكيل النظام العالمي؟",
            executive_thesis:
              "أنهت الحرب العالمية الثانية توازن القوى الأوروبي التقليدي وفتحت نظامًا ثنائي القطبية تقوده الولايات المتحدة والاتحاد السوفيتي، مع مؤسسات دولية جديدة وشرعية سياسية مبنية على منع حرب شاملة أخرى.",
          },
          interests: [
            {
              id: "I1",
              name: "منع عودة الهيمنة الألمانية",
              type: "strategic",
              intensity: 5,
              horizon: "long",
              stakes: "existential",
              confidence: "high",
              rationale:
                "تكرار الحربين العالميتين جعل احتواء ألمانيا مصلحة أمنية مركزية للحلفاء.",
            },
            {
              id: "I2",
              name: "إعادة بناء الاقتصاد العالمي",
              type: "economic",
              intensity: 4,
              horizon: "long",
              stakes: "important",
              confidence: "high",
              rationale:
                "الدمار الواسع خلق حاجة إلى تمويل وإعادة إعمار وتثبيت التجارة.",
            },
          ],
          actors: [
            {
              id: "A1",
              name: "الولايات المتحدة",
              category: "state",
              power_index: 5,
              financial: 5,
              decision_access: 5,
              disruption_capacity: 4,
              media_influence: 4,
              confidence: "high",
              rationale:
                "امتلكت قدرة مالية وصناعية وعسكرية مكّنتها من قيادة النظام الجديد.",
            },
            {
              id: "A2",
              name: "الاتحاد السوفيتي",
              category: "state",
              power_index: 5,
              financial: 3,
              decision_access: 4,
              disruption_capacity: 5,
              media_influence: 3,
              confidence: "high",
              rationale:
                "سيطرته على شرق أوروبا وقوته العسكرية جعلت تأثيره بنيويًا.",
            },
          ],
          tools: [
            {
              id: "T1",
              name: "مؤسسات دولية جديدة",
              type: "diplomatic",
              cost: 3,
              risk: 2,
              speed: 3,
              reversibility: 2,
              deniability: 1,
              confidence: "high",
              rationale: "الأمم المتحدة وبريتون وودز وفّرت أدوات تنسيق وشرعية.",
            },
            {
              id: "T2",
              name: "الاحتلال وإعادة البناء",
              type: "legal",
              cost: 4,
              risk: 3,
              speed: 2,
              reversibility: 2,
              deniability: 1,
              confidence: "high",
              rationale: "إدارة ألمانيا واليابان تطلبت أدوات حكم وإصلاح مؤسسي.",
            },
          ],
          narrative: [
            {
              id: "N1",
              name: "منع تكرار الحرب الشاملة",
              frame: "security",
              coherence: 5,
              media_alignment: 4,
              public_acceptance: 5,
              confidence: "high",
              rationale:
                "السردية كانت متماسكة بعد خسائر بشرية ومادية غير مسبوقة.",
            },
          ],
          results: [
            {
              id: "R1",
              name: "صعود نظام ثنائي القطبية",
              type: "direct",
              goal_achieved_pct: 70,
              cost_benefit: 3,
              power_balance_impact: "strengthened",
              confidence: "high",
              rationale: "انحسر مركز الثقل الأوروبي وصعدت واشنطن وموسكو.",
            },
            {
              id: "R2",
              name: "بداية الحرب الباردة",
              type: "unintended",
              goal_achieved_pct: 30,
              cost_benefit: 2,
              power_balance_impact: "weakened",
              confidence: "high",
              rationale:
                "ترتيبات ما بعد الحرب أنتجت تنافسًا أيديولوجيًا وأمنيًا جديدًا.",
            },
          ],
          feedback: [
            {
              id: "F1",
              description:
                "خوف متبادل بين القوتين دفع إلى أحلاف عسكرية وتسابق تسلح.",
              adapts: "tools",
              speed: "fast",
              confidence: "high",
              rationale: "النتائج الأمنية أعادت تشكيل الأدوات والتحالفات.",
            },
          ],
          contradictions: {
            items: [
              {
                id: "C1",
                rhetoric: "تحرير الشعوب ومنع الاستبداد",
                contradiction_type: "rhetoric_vs_action",
                actions: [
                  "تقسيم مناطق النفوذ في أوروبا",
                  "قبول أنظمة تابعة داخل المجال السوفيتي",
                  "استخدام الاحتلال العسكري لإعادة تشكيل دول مهزومة",
                ],
                interpretation:
                  "السردية الأخلاقية رافقتها اعتبارات قوة وأمن صلبة.",
                severity: 4,
                confidence: "high",
              },
            ],
          },
          scenarios: {
            items: [
              {
                id: "S1",
                name: "ترسيخ النظام ثنائي القطبية",
                probability: 70,
                timeframe: "1947–1955",
                drivers: [
                  "الاستقطاب الأيديولوجي",
                  "الأحلاف العسكرية",
                  "إعادة الإعمار تحت قيادة الكتلتين",
                ],
                early_signals: ["خطة مارشال", "مبدأ ترومان", "تأسيس الناتو"],
                disproven_if: [
                  "نجاح تسوية أمنية أوروبية جامعة",
                  "تقليل الوجود العسكري للقوتين",
                ],
                rationale: "المؤشرات المبكرة دعمت انقسامًا مؤسسيًا وعسكريًا.",
              },
            ],
          },
          evidence: {
            items: [
              {
                id: "E1",
                claim: "أوروبا فقدت مركزية النظام الدولي بعد الحرب.",
                basis: "inference",
                source_title: "مرجع تاريخي لتوزيع القوة",
                source_note: "مستنتج من توزيع القوة بعد 1945",
                counter_evidence:
                  "احتفظت بعض الدول الأوروبية بقدرات مؤسسية واقتصادية مهمة بعد عام 1945.",
                uncertainty:
                  "استنتاج تاريخي تجميعي؛ يجب تحسين دقة المصدر قبل النشر.",
                confidence: "high",
              },
            ],
          },
          assumptions: {
            items: [
              {
                id: "AS1",
                assumption:
                  "القوى الكبرى ستفضّل الاستقرار المؤسسي على العودة لعزلة ما قبل الحرب.",
                risk: "medium",
                disproving_test:
                  "انسحاب أمريكي سريع من أوروبا وفشل مؤسسات بريتون وودز",
                implication_if_wrong:
                  "سيصبح النظام أكثر سيولة وأقل قابلية للتوقع.",
              },
            ],
          },
          links: [
            { from: "I1", to: "A1", relation: "motivates", confidence: "high" },
            { from: "A1", to: "T1", relation: "uses", confidence: "high" },
            { from: "T1", to: "R1", relation: "produces", confidence: "medium" },
          ],
        }
      : {
          ...metadata,
          subject: {
            title: "Sample: World War II outcomes",
            context: "1939–1947, international order",
            question:
              "How did World War II outcomes reshape the global system?",
            executive_thesis:
              "World War II ended the old European balance of power and opened a bipolar order led by the United States and the Soviet Union, supported by new international institutions and a legitimacy frame centered on preventing another total war.",
          },
          interests: [
            {
              id: "I1",
              name: "Prevent renewed German hegemony",
              type: "strategic",
              intensity: 5,
              horizon: "long",
              stakes: "existential",
              confidence: "high",
              rationale:
                "The repetition of two world wars made German containment a central Allied security interest.",
            },
            {
              id: "I2",
              name: "Rebuild the global economy",
              type: "economic",
              intensity: 4,
              horizon: "long",
              stakes: "important",
              confidence: "high",
              rationale:
                "Mass destruction created a need for finance, reconstruction, and trade stabilization.",
            },
          ],
          actors: [
            {
              id: "A1",
              name: "United States",
              category: "state",
              power_index: 5,
              financial: 5,
              decision_access: 5,
              disruption_capacity: 4,
              media_influence: 4,
              confidence: "high",
              rationale:
                "Its financial, industrial, and military capacity enabled it to lead the new order.",
            },
            {
              id: "A2",
              name: "Soviet Union",
              category: "state",
              power_index: 5,
              financial: 3,
              decision_access: 4,
              disruption_capacity: 5,
              media_influence: 3,
              confidence: "high",
              rationale:
                "Its control over Eastern Europe and military weight made its influence structural.",
            },
          ],
          tools: [
            {
              id: "T1",
              name: "New international institutions",
              type: "diplomatic",
              cost: 3,
              risk: 2,
              speed: 3,
              reversibility: 2,
              deniability: 1,
              confidence: "high",
              rationale:
                "The UN and Bretton Woods institutions provided coordination and legitimacy mechanisms.",
            },
            {
              id: "T2",
              name: "Occupation and reconstruction",
              type: "legal",
              cost: 4,
              risk: 3,
              speed: 2,
              reversibility: 2,
              deniability: 1,
              confidence: "high",
              rationale:
                "Administering Germany and Japan required governance and institutional reform tools.",
            },
          ],
          narrative: [
            {
              id: "N1",
              name: "Prevent another total war",
              frame: "security",
              coherence: 5,
              media_alignment: 4,
              public_acceptance: 5,
              confidence: "high",
              rationale:
                "The narrative was coherent after unprecedented human and material losses.",
            },
          ],
          results: [
            {
              id: "R1",
              name: "Rise of bipolarity",
              type: "direct",
              goal_achieved_pct: 70,
              cost_benefit: 3,
              power_balance_impact: "strengthened",
              confidence: "high",
              rationale:
                "Europe receded as the central power arena while Washington and Moscow rose.",
            },
            {
              id: "R2",
              name: "Beginning of the Cold War",
              type: "unintended",
              goal_achieved_pct: 30,
              cost_benefit: 2,
              power_balance_impact: "weakened",
              confidence: "high",
              rationale:
                "Postwar arrangements produced a new ideological and security rivalry.",
            },
          ],
          feedback: [
            {
              id: "F1",
              description:
                "Mutual fear between the two superpowers drove military alliances and arms competition.",
              adapts: "tools",
              speed: "fast",
              confidence: "high",
              rationale: "Security outcomes reshaped tools and alliances.",
            },
          ],
          contradictions: {
            items: [
              {
                id: "C1",
                rhetoric: "Liberating peoples and preventing tyranny",
                contradiction_type: "rhetoric_vs_action",
                actions: [
                  "Division of spheres of influence in Europe",
                  "Acceptance of dependent regimes inside the Soviet sphere",
                  "Use of military occupation to reshape defeated states",
                ],
                interpretation:
                  "The moral rhetoric operated alongside hard security and power calculations.",
                severity: 4,
                confidence: "high",
              },
            ],
          },
          scenarios: {
            items: [
              {
                id: "S1",
                name: "Consolidation of bipolar order",
                probability: 70,
                timeframe: "1947–1955",
                drivers: [
                  "Ideological polarization",
                  "Military alliances",
                  "Reconstruction under bloc leadership",
                ],
                early_signals: [
                  "Marshall Plan",
                  "Truman Doctrine",
                  "Creation of NATO",
                ],
                disproven_if: [
                  "Successful pan-European security settlement",
                  "Rapid reduction of superpower military presence",
                ],
                rationale:
                  "Early indicators supported institutional and military division.",
              },
            ],
          },
          evidence: {
            items: [
              {
                id: "E1",
                claim:
                  "Europe lost centrality in the international system after the war.",
                basis: "inference",
                source_title: "Historical power distribution reference",
                source_note: "Inferred from post-1945 power distribution",
                counter_evidence:
                  "Some European states retained substantial institutional and economic capacity after 1945.",
                uncertainty:
                  "Aggregated historical inference; source specificity should be improved before publication.",
                confidence: "high",
              },
            ],
          },
          assumptions: {
            items: [
              {
                id: "AS1",
                assumption:
                  "Great powers will prefer institutional stability over a return to prewar isolation.",
                risk: "medium",
                disproving_test:
                  "Rapid U.S. withdrawal from Europe and failure of Bretton Woods institutions",
                implication_if_wrong:
                  "The order would become more fluid and less predictable.",
              },
            ],
          },
          links: [
            { from: "I1", to: "A1", relation: "motivates", confidence: "high" },
            { from: "A1", to: "T1", relation: "uses", confidence: "high" },
            { from: "T1", to: "R1", relation: "produces", confidence: "medium" },
          ],
        },
  );
}
function numericField(obj, key) {
  const n = Number(obj?.[key]);
  return Number.isFinite(n) ? Math.max(0, Math.min(5, n)) : 0;
}
function actorPowerScore(actor) {
  const raw =
    numericField(actor, "financial") +
    numericField(actor, "decision_access") +
    numericField(actor, "disruption_capacity") +
    numericField(actor, "media_influence");
  return Math.round(Math.min(20, raw));
}
function narrativeStrengthScore(n) {
  return Math.round(
    Math.min(
      15,
      numericField(n, "coherence") +
        numericField(n, "media_alignment") +
        numericField(n, "public_acceptance"),
    ),
  );
}
function toolPressureScore(tool) {
  const cost = numericField(tool, "cost"),
    risk = numericField(tool, "risk"),
    speed = numericField(tool, "speed"),
    rev = numericField(tool, "reversibility"),
    den = numericField(tool, "deniability");
  return Math.round(
    Math.min(100, ((cost + risk + speed + (6 - rev) + den) / 25) * 100),
  );
}
function interestWeightScore(x) {
  const intensity = numericField(x, "intensity");
  const stake =
    { marginal: 1, important: 1.3, existential: 1.65 }[
      normalizeToken(x?.stakes)
    ] || 1;
  const horizon =
    { short: 1, medium: 1.15, long: 1.25 }[normalizeToken(x?.horizon)] || 1;
  return Math.round(
    Math.min(100, ((intensity / 5) * 100 * stake * horizon) / 2.06),
  );
}
function modelMetricLabel(kind) {
  return { api: "API", nsi: "NSI", tps: "TPS", iw: "IW" }[kind] || kind;
}
function modelMetricCard(label, value, max, sub, cls = "pct-neutral") {
  const pct = max ? Math.round((value / max) * 100) : value;
  return `<div class="modelMetric ${cls}"><span>${escapeHtml(label)}</span><b>${escapeHtml(value)}${max ? `/${max}` : ""}</b><small>${escapeHtml(sub)}</small></div>`;
}
function modelMetricsFor(p, obj) {
  if (p === "actors") {
    const v = actorPowerScore(obj);
    return modelMetricCard(
      "API",
      v,
      20,
      labelText("Actor Power Index", "مؤشر قوة الفاعل"),
      pctClass((v / 20) * 100),
    );
  }
  if (p === "narrative") {
    const v = narrativeStrengthScore(obj);
    return modelMetricCard(
      "NSI",
      v,
      15,
      labelText("Narrative Strength Index", "مؤشر قوة السردية"),
      pctClass((v / 15) * 100),
    );
  }
  if (p === "tools") {
    const v = toolPressureScore(obj);
    return modelMetricCard(
      "TPS",
      v,
      100,
      labelText("Tool Pressure Score", "مؤشر ضغط الأداة"),
      pctClass(v),
    );
  }
  if (p === "interests") {
    const v = interestWeightScore(obj);
    return modelMetricCard(
      "IW",
      v,
      100,
      labelText("Interest Weight", "وزن المصلحة"),
      pctClass(v),
    );
  }
  return "";
}
function qualityGate(a = state.analysis) {
  const b = scoreBreakdown(a);
  const h = schemaHealth(a);
  const hard = [];
  if (h.missing.length) hard.push(...h.missing.slice(0, 3));
  if (b.provenance.publicationApproved && !hard.length)
    return {
      status: t("publishReady"),
      cls: "pct-excellent",
      tone: "var(--success)",
      summary: labelText(
        "Structural and independent evidence-review gates passed; final editorial verification remains required.",
        "اجتاز التحليل بوابة البنية ومراجعة الأدلة المستقلة؛ وتبقى المراجعة التحريرية النهائية مطلوبة.",
        "Les contrôles structurel et indépendant des preuves sont satisfaits ; la vérification éditoriale finale reste requise.",
      ),
      issues: [],
    };
  if (!hard.length)
    return {
      status: t("reviewNeeded"),
      cls: "pct-mid",
      tone: "var(--warn)",
      summary: labelText(
        "Structurally reviewable, but publication is blocked until every evidence record receives independent human approval.",
        "المسودة قابلة للمراجعة بنيويًا، لكن النشر محظور حتى يعتمد مراجع بشري مستقل كل سجل دليل.",
        "Brouillon structurellement révisable, mais publication bloquée tant que chaque preuve n’a pas reçu une approbation humaine indépendante.",
      ),
      issues: hard,
    };
  return {
    status: t("doNotPublish"),
    cls: "pct-low",
    tone: "var(--danger)",
    summary: labelText(
      "The analysis is structurally weak. Strengthen missing pillars, evidence, scenarios, and contradictions first.",
      "التحليل ضعيف بنيويًا. قوِّ الطبقات الناقصة والأدلة والسيناريوهات والتناقضات أولًا.",
      "L’analyse est structurellement faible. Renforcez d’abord les couches, preuves, scénarios et contradictions manquants.",
    ),
    issues: hard,
  };
}
function qualityGateHtml(a = state.analysis) {
  const g = qualityGate(a);
  const issues = g.issues?.length
    ? `<ul>${g.issues.map((x) => `<li>${escapeHtml(x)}</li>`).join("")}</ul>`
    : "";
  return `<div class="qualityGate ${g.cls}" style="--gateTone:${g.tone}"><h4>${escapeHtml(t("qualityGate"))}: ${escapeHtml(g.status)}</h4><p>${escapeHtml(g.summary)}</p>${issues}</div>`;
}
function schemaHealth(a = state.analysis) {
  if (!a) return { pct: 0, missing: [], next: t("healthMissingPillars") };
  const missing = [];
  const pillarFilled = PILLARS.filter(
    (p) => normalizeArray(a[p]).length > 0,
  ).length;
  if (pillarFilled < 6) missing.push(t("healthMissingPillars"));
  if (!normalizeArray(a.contradictions?.items).length)
    missing.push(t("healthMissingContradictions"));
  const sc = normalizeArray(a.scenarios?.items);
  if (!sc.length) missing.push(t("healthMissingScenarios"));
  if (sc.some((s) => !normalizeArray(s.disproven_if).length))
    missing.push(t("healthMissingScenarios"));
  if (!normalizeArray(a.feedback).length)
    missing.push(t("healthMissingFeedback"));
  const ev = normalizeArray(a.evidence?.items),
    ass = normalizeArray(a.assumptions?.items);
  if (!ev.length && !ass.length) missing.push(t("healthMissingEvidence"));
  if (ev.length && !ev.some((e) => /source/.test(normalizeToken(e.basis))))
    missing.push(
      labelText(
        "Add at least one source-grounded evidence item.",
        "أضف دليلًا واحدًا على الأقل مرتكزًا على مصدر.",
        "Ajoutez au moins un élément probant fondé sur une source.",
      ),
    );
  if (
    ev.length &&
    !ev.some((e) => (e.counter_evidence || e.counterEvidence || "").trim())
  )
    missing.push(
      labelText(
        "Add counter-evidence or uncertainty pressure.",
        "أضف دليلًا مضادًا أو ضغط عدم يقين.",
        "Ajoutez des contre-preuves ou une évaluation de l’incertitude.",
      ),
    );
  let passed = 0;
  passed += pillarFilled;
  passed += normalizeArray(a.contradictions?.items).length ? 1 : 0;
  passed += sc.length ? 1 : 0;
  passed +=
    sc.length && sc.every((s) => normalizeArray(s.disproven_if).length) ? 1 : 0;
  passed += ev.length || ass.length ? 1 : 0;
  passed += ev.some((e) => /source/.test(normalizeToken(e.basis))) ? 1 : 0;
  passed += ev.some((e) =>
    (e.counter_evidence || e.counterEvidence || "").trim(),
  )
    ? 1
    : 0;
  passed += a.schema_version ? 1 : 0;
  const pct = Math.round(Math.min(100, (passed / 13) * 100));
  return {
    pct,
    missing: [...new Set(missing)],
    next: missing[0] || t("healthGood"),
  };
}
function safeFileSlug(s) {
  return (
    String(s || "strategic-analysis")
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\u0600-\u06ff]+/gi, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 70) || "strategic-analysis"
  );
}
function renderGuide() {
  const el = $("guideSteps");
  if (!el) return;
  const steps = t("guideSteps");
  el.innerHTML = (Array.isArray(steps) ? steps : [])
    .map((x) => `<li>${escapeHtml(x)}</li>`)
    .join("");
}
function renderStages() {
  const arr = t("stages");
  const idx = { topic: 0, prompt: 1, import: 2, review: 3 }[state.stage] ?? 0;
  $("stageBar").innerHTML = arr
    .map(
      (s, i) =>
        `<div class="stageItem ${i < idx ? "done" : ""} ${i === idx ? "active" : ""}" ${i === idx ? 'aria-current="step"' : ""}><span class="num">${i + 1}</span><span>${s}</span></div>`,
    )
    .join("");
}

function sampleAnalysis(lang = state.lang) {
  return activeLensAdapter().createSample({
    lang,
    mode: state.promptMode,
  });
}
function countFor(p) {
  return state.analysis ? normalizeArray(state.analysis[p]).length : 0;
}
function renderEngineNav() {
  const dict = t("pillars");
  const arrow = state.lang === "ar" ? "←" : "→";
  $("engineNav").innerHTML = PILLARS.map((p, i) => {
    const d = dict[p];
    const count = countFor(p);
    const filled = count > 0 ? " filled" : "";
    const depth = layerDepthPct(p);
    return `<button class="engineCard ${state.activePillar === p ? "active" : ""}${filled} ${pctClass(depth)}" style="--pc:${COLORS[p]}" data-pillar-card="${p}" type="button"><div class="eyebrow">${String(i + 1).padStart(2, "0")}</div><div class="engineHeading"><span class="engineDot" aria-hidden="true"></span><h4>${d[0]}</h4></div><p>${d[1]}</p><div class="engineFooter"><span class="engineCount"><b>${count}</b><small>${itemsWord()}</small></span>${ringMetric(depth, "sm")}</div><span class="flowArrow" aria-hidden="true">${arrow}</span></button>`;
  }).join("");
  document.querySelectorAll("[data-pillar-card]").forEach(
    (btn) =>
      (btn.onclick = () => {
        state.activePillar = btn.dataset.pillarCard;
        if (state.analysis) {
          state.activeReview = "pillars";
          renderReview();
          document
            .getElementById("reviewPanel")
            .scrollIntoView({ behavior: "auto", block: "nearest" });
        }
        renderEngineNav();
      }),
  );
  $("analysisStateChip").textContent = state.analysis
    ? t("stateImported")
    : t("stateNoAnalysis");
}
function getWarnings() {
  if (!state.analysis) return [t("emptyEngine")];
  const a = state.analysis;
  const w = [];
  const ev = normalizeArray(a.evidence?.items);
  if (PILLARS.some((p) => !a[p].length)) w.push(warningText("missingPillars"));
  if (!a.contradictions.items.length) w.push(warningText("noContradictions"));
  if (!a.scenarios.items.length) w.push(warningText("noScenarios"));
  if (
    a.scenarios.items.length &&
    a.scenarios.items.some((s) => !normalizeArray(s.disproven_if).length)
  )
    w.push(warningText("noFalsifiers"));
  if (
    (!a.evidence || !ev.length) &&
    (!a.assumptions || !normalizeArray(a.assumptions.items).length)
  )
    w.push(warningText("thinEvidence"));
  if (ev.length && !ev.some((e) => /source/.test(normalizeToken(e.basis))))
    w.push(
      labelText(
        "Evidence exists, but no source-grounded item is marked.",
        "توجد أدلة، لكن لا يوجد عنصر مرتكز على مصدر.",
        "Des preuves existent, mais aucun élément fondé sur source n’est marqué.",
      ),
    );
  if (
    ev.length &&
    !ev.some((e) => (e.counter_evidence || e.counterEvidence || "").trim())
  )
    w.push(
      labelText(
        "Counter-evidence is missing. Add pressure against the thesis.",
        "الدليل المضاد غير موجود. أضف ضغطًا ضد الأطروحة.",
        "La contre-preuve manque. Ajoutez une pression contre la thèse.",
      ),
    );
  if (!w.length) w.push(warningText("good"));
  return w;
}
function score() {
  if (!state.analysis) return 0;
  const a = state.analysis;
  let pts = 0;
  pts += PILLARS.filter((p) => a[p].length).length * 10;
  pts += Math.min(10, a.contradictions.items.length * 4);
  pts += Math.min(10, a.scenarios.items.length * 4);
  pts += a.scenarios.items.some((s) => normalizeArray(s.disproven_if).length)
    ? 8
    : 0;
  pts += normalizeArray(a.evidence.items).length ? 6 : 0;
  pts += normalizeArray(a.assumptions.items).length ? 6 : 0;
  return Math.min(100, pts);
}
function escapeHtml(s) {
  return String(s ?? "").replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
  );
}
function safeHttpUrl(value) {
  try {
    const url = new URL(String(value || "").trim());
    return ["http:", "https:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}
function sourceAnchor(url, label = url) {
  const safe = safeHttpUrl(url);
  return safe
    ? `<a class="sourceUrl ltr" href="${escapeHtml(safe)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label || safe)} <span aria-hidden="true">↗</span></a>`
    : "";
}
function arr(v) {
  return Array.isArray(v) ? v.filter(Boolean) : [];
}
function valuePct(v, max = 100) {
  const n = Number(v);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(max, n));
}
function pctClass(v) {
  const n = valuePct(v);
  return n >= 90
    ? "pct-excellent"
    : n >= 76
      ? "pct-good"
      : n >= 56
        ? "pct-mid"
        : n >= 35
          ? "pct-warn"
          : "pct-low";
}
function labelText(en, ar, fr) {
  const frMap = {
    "Source-grounded": "Fondé sur source",
    "Direct observation": "Observation directe",
    "Analytical inference": "Inférence analytique",
    Estimate: "Estimation",
    "Working assumption": "Hypothèse de travail",
    "High confidence": "Confiance élevée",
    "Medium confidence": "Confiance moyenne",
    "Low confidence": "Confiance faible",
    "Risk not specified": "Risque non précisé",
    "Critical risk": "Risque critique",
    "High risk": "Risque élevé",
    "Medium risk": "Risque moyen",
    "Low risk": "Risque faible",
    "Rhetoric vs action": "Rhétorique vs action",
    "Tool vs goal": "Outil vs objectif",
    "Result vs intention": "Résultat vs intention",
    "Interest vs alliance": "Intérêt vs alliance",
    "Claim vs evidence": "Énoncé vs preuve",
    "Internal inconsistency": "Incohérence interne",
    Contradiction: "Contradiction",
    "Narrative credibility risk": "Risque de crédibilité narrative",
    "Instrument-goal mismatch": "Décalage outil-objectif",
    "Outcome divergence": "Divergence de résultat",
    "Alliance or incentive constraint": "Contrainte d’alliance ou d’incitation",
    "Evidence credibility pressure": "Pression sur la crédibilité de la preuve",
    "High strategic inconsistency": "Incohérence stratégique élevée",
    "Strategic consistency risk": "Risque de cohérence stratégique",
    "Systemic impact": "Impact systémique",
    "Strategic impact": "Impact stratégique",
    "Operational impact": "Impact opérationnel",
    "Limited impact": "Impact limité",
    "Some model layers are still thin or empty.":
      "Certaines couches du modèle restent faibles ou vides.",
    "The six-layer structure is substantially populated.":
      "La structure à six couches est largement remplie.",
    "Add missing layer items, especially feedback and results.":
      "Ajoutez les éléments manquants, surtout résultats et rétroaction.",
    "Review quality rather than adding more volume.":
      "Révisez la qualité plutôt que d’ajouter du volume.",
    "Causal links across interests, actors, tools, and results need clearer connection.":
      "Les liens causaux entre intérêts, acteurs, outils et résultats doivent être clarifiés.",
    "The core causal chain is visible.":
      "La chaîne causale principale est visible.",
    "Ask the AI to make the causal chain explicit.":
      "Demandez à l’IA de rendre la chaîne causale explicite.",
    "Check for weak assumptions inside the causal chain.":
      "Vérifiez les hypothèses faibles dans la chaîne causale.",
    "Contradictions need stronger action/result grouping or interpretation.":
      "Les contradictions nécessitent un meilleur regroupement actions/résultats ou une interprétation plus claire.",
    "Contradictions are actionable and interpretable.":
      "Les contradictions sont exploitables et interprétables.",
    "Add actions/results and affected layers for each contradiction.":
      "Ajoutez actions/résultats et couches affectées pour chaque contradiction.",
    "Prioritize the highest-severity contradictions.":
      "Priorisez les contradictions les plus sévères.",
    "Scenarios lack enough disproval conditions or probability discipline.":
      "Les scénarios manquent de conditions de réfutation ou de discipline probabiliste.",
    "Scenarios include testable falsifiers.":
      "Les scénarios incluent des réfutateurs testables.",
    "Add early signals and disproven-if conditions.":
      "Ajoutez des signaux précoces et conditions de réfutation.",
    "Monitor early signals against each scenario.":
      "Surveillez les signaux précoces pour chaque scénario.",
    "Evidence grounding is weak or too inference-heavy.":
      "L’ancrage probatoire est faible ou trop inférentiel.",
    "Evidence and assumptions provide reasonable grounding.":
      "Les preuves et hypothèses offrent un ancrage raisonnable.",
    "Add source-grounded claims and tests for assumptions.":
      "Ajoutez des énoncés fondés sur source et des tests pour les hypothèses.",
    "Verify source notes before publication.":
      "Vérifiez les notes de source avant publication.",
    "The analysis still has gaps that reduce share readiness.":
      "L’analyse contient encore des lacunes qui réduisent sa partageabilité.",
    "The analysis is ready for review/export with minor checks.":
      "L’analyse est prête pour revue/export avec quelques vérifications.",
    "Resolve warnings before exporting the final report.":
      "Résolvez les alertes avant d’exporter le rapport final.",
    "Export the report and perform a final human review.":
      "Exportez le rapport et effectuez une dernière revue humaine.",
    "Overall score = 25% completeness + 20% coherence + 15% contradiction quality + 15% scenario testability + 15% evidence grounding + 10% share readiness.":
      "Score global = 25% complétude + 20% cohérence + 15% qualité des contradictions + 15% testabilité des scénarios + 15% ancrage probatoire + 10% prêt à partager.",
    "Scoring formula": "Formule de score",
    "Score bands": "Niveaux de score",
    "Weighted diagnostic index": "Indice diagnostique pondéré",
    "Strategic signal": "Signal stratégique",
    Type: "Type",
    Impact: "Impact",
    "Affected layers": "Couches affectées",
    "Cross-layer": "Transversal",
    "No explicit risk stated.": "Aucun risque explicite indiqué.",
    "No falsifier provided.": "Aucun test de réfutation fourni.",
    "If wrong": "Si faux",
    "Unique DOM IDs": "IDs DOM uniques",
    "Sample analysis normalizes": "L’exemple se normalise",
    "Weighted scoring works": "Le scoring pondéré fonctionne",
    "Score formula visible": "Formule visible",
    "HTML report generation": "Génération du rapport HTML",
    "Markdown export generation": "Génération Markdown",
    "Messy JSON extraction": "Extraction JSON depuis texte mixte",
    "Modal accessibility attributes": "Attributs d’accessibilité de la modale",
    "RTL/LTR document state": "État RTL/LTR du document",
    "Runtime self-check": "Auto-test runtime",
  };
  return state.lang === "ar"
    ? ar
    : state.lang === "fr"
      ? fr || frMap[en] || en
      : en;
}
function normalizeToken(v) {
  return String(v ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
}
function confidenceScore(v) {
  const s = normalizeToken(v);
  if (/high|strong|عال|قوي/.test(s)) return 92;
  if (/medium|moderate|متوسط/.test(s)) return 64;
  if (/low|weak|منخفض|ضعيف/.test(s)) return 34;
  return 50;
}
function confidenceClass(v) {
  return pctClass(confidenceScore(v));
}
function severityScore(v) {
  const m = String(v ?? "").match(/\d+(?:\.\d+)?/);
  if (!m) return 50;
  return Math.max(0, Math.min(100, Number(m[0]) * 10));
}
function riskScore(v) {
  const s = normalizeToken(v);
  if (/critical|existential|severe|high|major|حاسم|وجود|مرتفع|عال|خطير/.test(s))
    return 88;
  if (/medium|moderate|material|important|متوسط|مهم/.test(s)) return 62;
  if (/low|minor|contained|منخفض|ضعيف|محدود/.test(s)) return 34;
  return 52;
}
function semanticClass(v) {
  const s = normalizeToken(v);
  if (/existential|critical|حاسم|وجود/.test(s)) return "pct-excellent";
  if (
    /important|strategic|source_based|source_grounded|significant|مهم|استراتيجي/.test(
      s,
    )
  )
    return "pct-good";
  if (
    /medium|political|economic|ideological|short|long|observation|inference|متوسط|سياسي|اقتصادي/.test(
      s,
    )
  )
    return "pct-mid";
  if (/low|minor|منخفض/.test(s)) return "pct-warn";
  return "pct-neutral";
}
function basisInfo(v) {
  const s = normalizeToken(v);
  if (/source/.test(s))
    return {
      label: labelText("Source-grounded", "مرتكز على مصدر"),
      cls: "basis-source",
    };
  if (/observation|observed|ملاحظة/.test(s))
    return {
      label: labelText("Direct observation", "ملاحظة مباشرة"),
      cls: "basis-observed",
    };
  if (/inference|inferred|استنتاج/.test(s))
    return {
      label: labelText("Analytical inference", "استنتاج تحليلي"),
      cls: "basis-inferred",
    };
  if (/estimate|estimated|تقدير/.test(s))
    return { label: labelText("Estimate", "تقدير"), cls: "basis-estimate" };
  if (/assumption|assumed|افتراض/.test(s))
    return {
      label: labelText("Working assumption", "افتراض عملي"),
      cls: "basis-assumption",
    };
  return { label: displayEnum(v), cls: "basis-neutral" };
}
function confidenceInfo(v) {
  const score = confidenceScore(v);
  const s = normalizeToken(v);
  let label = displayEnum(v || "");
  if (/high|strong|عال|قوي/.test(s))
    label = labelText("High confidence", "ثقة عالية");
  else if (/medium|moderate|متوسط/.test(s))
    label = labelText("Medium confidence", "ثقة متوسطة");
  else if (/low|weak|منخفض|ضعيف/.test(s))
    label = labelText("Low confidence", "ثقة منخفضة");
  return { label, cls: confidenceClass(v), score };
}
function riskInfo(v) {
  const score = riskScore(v);
  let label = labelText("Risk not specified", "المخاطر غير محددة");
  const s = normalizeToken(v);
  if (/critical|existential|severe|حاسم|وجود|خطير/.test(s))
    label = labelText("Critical risk", "مخاطر حرجة");
  else if (/high|major|مرتفع|عال/.test(s))
    label = labelText("High risk", "مخاطر عالية");
  else if (/medium|moderate|material|important|متوسط|مهم/.test(s))
    label = labelText("Medium risk", "مخاطر متوسطة");
  else if (/low|minor|contained|منخفض|محدود/.test(s))
    label = labelText("Low risk", "مخاطر منخفضة");
  return { label, cls: pctClass(score), score };
}
function displayEnum(v) {
  const raw = String(v ?? "").trim();
  if (!raw) return "";
  if (state.analysisLens === "biopolitical") {
    return BIO.displayToken(state.lang, raw);
  }
  const s = normalizeToken(raw);
  const map = {
    rhetoric_vs_action: [
      labelText("Rhetoric vs action", "الخطاب مقابل الفعل"),
      "type-rhetoric",
    ],
    tool_vs_goal: [
      labelText("Tool vs goal", "الأداة مقابل الهدف"),
      "type-tool",
    ],
    result_vs_intention: [
      labelText("Result vs intention", "النتيجة مقابل النية"),
      "type-result",
    ],
    interest_vs_alliance: [
      labelText("Interest vs alliance", "المصلحة مقابل التحالف"),
      "type-interest",
    ],
    claim_vs_evidence: [
      labelText("Claim vs evidence", "الادعاء مقابل الدليل"),
      "type-evidence",
    ],
    internal_inconsistency: [
      labelText("Internal inconsistency", "تناقض داخلي"),
      "type-internal",
    ],
    source_based: [
      labelText("Source-grounded", "مرتكز على مصدر"),
      "basis-source",
    ],
    source_grounded: [
      labelText("Source-grounded", "مرتكز على مصدر"),
      "basis-source",
    ],
    observation: [
      labelText("Direct observation", "ملاحظة مباشرة"),
      "basis-observed",
    ],
    inference: [
      labelText("Analytical inference", "استنتاج تحليلي"),
      "basis-inferred",
    ],
    estimate: [labelText("Estimate", "تقدير"), "basis-estimate"],
    assumption: [
      labelText("Working assumption", "افتراض عملي"),
      "basis-assumption",
    ],
  };
  return (
    map[s]?.[0] ||
    raw.replace(/_/g, " ").replace(/\b\w/g, (m) => m.toUpperCase())
  );
}
function enumClass(v) {
  const s = normalizeToken(v);
  const map = {
    source_based: "basis-source",
    source_grounded: "basis-source",
    observation: "basis-observed",
    inference: "basis-inferred",
    estimate: "basis-estimate",
    assumption: "basis-assumption",
    rhetoric_vs_action: "type-rhetoric",
    tool_vs_goal: "type-tool",
    result_vs_intention: "type-result",
    interest_vs_alliance: "type-interest",
    claim_vs_evidence: "type-evidence",
    internal_inconsistency: "type-internal",
  };
  return map[s] || "";
}
function pill(v, kind = "") {
  if (v === undefined || v === null || v === "") return "";
  const raw = String(v);
  let cls = "chip pct-neutral",
    label = displayEnum(raw);
  if (kind === "confidence") {
    const info = confidenceInfo(raw);
    cls = "chip confidence-chip " + info.cls;
    label = info.label;
  } else if (kind === "basis") {
    const info = basisInfo(raw);
    cls = "chip basis-chip " + info.cls;
    label = info.label;
  } else if (kind === "risk") {
    const info = riskInfo(raw);
    cls = "chip risk-chip " + info.cls;
    label = info.label;
  } else if (kind === "severity") {
    cls = "chip severity-chip " + pctClass(severityScore(raw));
    label = raw;
  } else if (kind === "percent") {
    cls = "chip " + pctClass(valuePct(Number(raw)));
  } else {
    const ecls = enumClass(raw);
    cls = "chip " + (ecls || semanticClass(raw));
  }
  return `<span class="${cls}">${escapeHtml(label)}</span>`;
}
function itemsWord() {
  return t("itemsWord") || (state.lang === "ar" ? "عناصر" : "items");
}
function layerDepthPct(p) {
  if (!state.analysis) return 0;
  const counts = PILLARS.map((x) => countFor(x));
  const max = Math.max(1, ...counts);
  return Math.round((countFor(p) / max) * 100);
}
function ringMetric(value, size = "sm", suffix = "%", toneClass = "") {
  const pct = valuePct(value);
  const dash = pct.toFixed(1);
  const cls = toneClass || pctClass(pct);
  return `<div class="metricRing ${size} ${cls}" aria-label="${Math.round(pct)}${suffix}"><svg class="metricSvg" viewBox="0 0 64 64" aria-hidden="true"><circle class="metricTrackSvg" cx="32" cy="32" r="24"></circle><circle class="metricBarSvg" cx="32" cy="32" r="24" pathLength="100" stroke-dasharray="${dash} 100"></circle></svg><div class="metricRingInner"><strong>${Math.round(pct)}</strong><span>${suffix}</span></div></div>`;
}
function probabilityClass(v) {
  const n = valuePct(v);
  return n >= 70
    ? "prob-high"
    : n >= 45
      ? "prob-mid"
      : n >= 25
        ? "prob-lowmid"
        : "prob-low";
}
function probabilityMetric(value, size = "md") {
  return ringMetric(value, size, "%", probabilityClass(value));
}
function contradictionTypeLabel(v) {
  return displayEnum(v || "") || labelText("Contradiction", "تناقض");
}
function affectedLayers(c) {
  const allowed = new Set(PILLARS);
  const raw = normalizeArray(
    c.affected_layers ||
      c.affectedLayers ||
      c.layers ||
      c.affected_model_layers,
  );
  const explicit = raw
    .map((x) =>
      normalizeToken(typeof x === "object" ? x.name || x.layer || "" : x),
    )
    .map((x) => PILLARS.find((p) => x === p || x.includes(p) || p.includes(x)))
    .filter(Boolean);
  if (explicit.length)
    return [...new Set(explicit)].filter((x) => allowed.has(x)).slice(0, 6);
  const s = [
    c.contradiction_type,
    c.type,
    c.rhetoric,
    c.interpretation,
    arr(c.actions).join(" "),
  ]
    .join(" ")
    .toLowerCase();
  const hits = [];
  if (/interest|material|economic|alliance|sovereign|مصلحة/.test(s))
    hits.push("interests");
  if (/actor|party|state|union|coalition|فاعل/.test(s)) hits.push("actors");
  if (/tool|sanction|policy|military|instrument|أداة/.test(s))
    hits.push("tools");
  if (/rhetoric|claim|narrative|legitim|خطاب|سرد/.test(s))
    hits.push("narrative");
  if (/result|outcome|effect|نتيجة/.test(s)) hits.push("results");
  if (/feedback|adapt|cycle|تكيف/.test(s)) hits.push("feedback");
  return [...new Set(hits)].slice(0, 3);
}
function contradictionMeaning(c) {
  const s = normalizeToken(c.contradiction_type || c.type || "");
  const sev = severityScore(c.severity);
  if (s.includes("rhetoric"))
    return labelText("Narrative credibility risk", "خطر على مصداقية السردية");
  if (s.includes("tool"))
    return labelText("Instrument-goal mismatch", "اختلال بين الأداة والهدف");
  if (s.includes("result"))
    return labelText("Outcome divergence", "انحراف بين النية والنتيجة");
  if (s.includes("interest"))
    return labelText("Alliance or incentive constraint", "قيد تحالفي أو حافزي");
  if (s.includes("claim"))
    return labelText(
      "Evidence credibility pressure",
      "ضغط على موثوقية الادعاء",
    );
  return sev >= 80
    ? labelText("High strategic inconsistency", "تناقض استراتيجي عالٍ")
    : labelText("Strategic consistency risk", "خطر على الاتساق الاستراتيجي");
}
function impactScope(c) {
  const sev = severityScore(c.severity);
  if (sev >= 85) return labelText("Systemic impact", "أثر منظومي");
  if (sev >= 65) return labelText("Strategic impact", "أثر استراتيجي");
  if (sev >= 45) return labelText("Operational impact", "أثر تشغيلي");
  return labelText("Limited impact", "أثر محدود");
}
function scoreBreakdown(a = state.analysis) {
  if (!a)
    return {
      completeness: 0,
      coherence: 0,
      contradictions: 0,
      falsifiability: 0,
      evidence: 0,
      readiness: 0,
      overall: 0,
    };
  const filled = PILLARS.filter((p) => normalizeArray(a[p]).length).length;
  const completeness = Math.round((filled / 6) * 100);
  const hasCore =
    normalizeArray(a.interests).length &&
    normalizeArray(a.actors).length &&
    normalizeArray(a.tools).length &&
    normalizeArray(a.results).length;
  const feedback = normalizeArray(a.feedback).length;
  const actorDims = normalizeArray(a.actors).length
    ? normalizeArray(a.actors).filter((x) => actorPowerScore(x) > 0).length /
      normalizeArray(a.actors).length
    : 0;
  const nsiDims = normalizeArray(a.narrative).length
    ? normalizeArray(a.narrative).filter((x) => narrativeStrengthScore(x) > 0)
        .length / normalizeArray(a.narrative).length
    : 0;
  const coherence = Math.min(
    100,
    Math.round(
      (filled / 6) * 42 +
        (hasCore ? 24 : 0) +
        (feedback ? 18 : 0) +
        (actorDims + nsiDims) * 8,
    ),
  );
  const con = normalizeArray(a.contradictions?.items);
  const contradictions = Math.min(
    100,
    con.length * 16 +
      con.filter((c) => arr(c.actions).length >= 2).length * 8 +
      con.filter((c) => (c.interpretation || "").trim()).length * 7 +
      con.filter((c) => affectedLayers(c).length).length * 5,
  );
  const sc = normalizeArray(a.scenarios?.items);
  const falsifiability = sc.length
    ? Math.min(
        100,
        sc.length * 14 +
          Math.round(
            (sc.filter((s) => arr(s.disproven_if).length).length / sc.length) *
              50,
          ) +
          sc.filter(
            (s) =>
              s.probability !== undefined &&
              s.probability !== null &&
              s.probability !== "",
          ).length *
            8,
      )
    : 0;
  const ev = normalizeArray(a.evidence?.items),
    ass = normalizeArray(a.assumptions?.items);
  const sourceShare = ev.length
    ? Math.round(
        (ev.filter((e) => /source/.test(normalizeToken(e.basis))).length /
          ev.length) *
          34,
      )
    : 0;
  const counterShare = ev.length
    ? Math.round(
        (ev.filter((e) =>
          (e.counter_evidence || e.counterEvidence || "").trim(),
        ).length /
          ev.length) *
          18,
      )
    : 0;
  const evidence = Math.min(
    100,
    ev.length * 9 + ass.length * 7 + sourceShare + counterShare,
  );
  const warnings = getWarnings(a).filter(
    (w) => w !== warningText("good"),
  ).length;
  const readiness = Math.max(
    0,
    Math.min(
      100,
      70 +
        completeness * 0.16 +
        contradictions * 0.1 +
        evidence * 0.14 -
        warnings * 12,
    ),
  );
  const weights = scoreWeights(a);
  const analyticalCoverage = Math.round(
    completeness * (weights.completeness / 100) +
      coherence * (weights.coherence / 100) +
      contradictions * (weights.contradictions / 100) +
      falsifiability * (weights.falsifiability / 100) +
      evidence * (weights.evidence / 100) +
      readiness * (weights.readiness / 100),
  );
  const provenance = PROVENANCE.assessEvidenceProvenance(a, {
    lens: "strategic",
  });
  const overall = PROVENANCE.capDecisionReadiness(
    analyticalCoverage,
    provenance,
  );
  return {
    completeness,
    coherence,
    contradictions,
    falsifiability,
    evidence,
    readiness,
    overall,
    analyticalCoverage,
    provenance,
  };
}
function scoreDiagnostic(key, val, a = state.analysis) {
  const isBio = (a?.analysis_lens || state.analysisLens) === "biopolitical";
  const data = isBio
    ? {
        completeness: {
          reason:
            val < 70
              ? labelText(
                  "Some biopolitical layers are thin or empty.",
                  "بعض طبقات الحكم الحيوسياسي ضعيفة أو فارغة.",
                  "Certaines couches biopolitiques sont faibles ou vides.",
                )
              : labelText(
                  "The six governance layers are substantially populated.",
                  "طبقات الحكم الست مكتملة بدرجة جيدة.",
                  "Les six couches de gouvernement sont substantiellement remplies.",
                ),
          action:
            val < 70
              ? labelText(
                  "Add missing population, technique, outcome, and resistance items.",
                  "أضف عناصر السكان والتقنيات والآثار والمقاومة الناقصة.",
                  "Ajoutez les éléments manquants sur populations, techniques, effets et résistance.",
                )
              : labelText(
                  "Review ontology quality rather than adding more volume.",
                  "راجع جودة الأنطولوجيا بدل إضافة حجم زائد.",
                  "Vérifiez la qualité ontologique plutôt que d’ajouter du volume.",
                ),
        },
        coherence: {
          reason:
            val < 70
              ? labelText(
                  "The governance chain from problematization to embodied outcomes is weak.",
                  "سلسلة الحكم من الإشكلة إلى الآثار الجسدية ضعيفة.",
                  "La chaîne de gouvernement de la problématisation aux effets incarnés est faible.",
                )
              : labelText(
                  "The biopolitical governance chain is visible.",
                  "سلسلة الحكم الحيوسياسي واضحة.",
                  "La chaîne de gouvernement biopolitique est visible.",
                ),
          action:
            val < 70
              ? labelText(
                  "Connect problem, population, technique, norm, outcome, and feedback explicitly.",
                  "اربط صراحة بين المشكلة والسكان والتقنية والمعيار والأثر والتغذية الراجعة.",
                  "Reliez explicitement problème, population, technique, norme, effet et rétroaction.",
                )
              : labelText(
                  "Check for over-abstract theory without concrete mechanisms.",
                  "افحص التجريد النظري الزائد بدون آليات ملموسة.",
                  "Vérifiez l’excès d’abstraction sans mécanismes concrets.",
                ),
        },
        contradictions: {
          reason:
            val < 70
              ? labelText(
                  "Protection/control contradictions need sharper grouping.",
                  "تناقضات الحماية/السيطرة تحتاج تجميعًا أوضح.",
                  "Les contradictions protection/contrôle doivent être mieux groupées.",
                )
              : labelText(
                  "Protection/control tensions are interpretable.",
                  "توترات الحماية/السيطرة قابلة للتفسير.",
                  "Les tensions protection/contrôle sont interprétables.",
                ),
          action:
            val < 70
              ? labelText(
                  "Add actions/results showing classification, exclusion, discipline, or normalization effects.",
                  "أضف أفعالًا/نتائج تُظهر التصنيف أو الإقصاء أو الانضباط أو التطبيع.",
                  "Ajoutez actions/résultats montrant classification, exclusion, discipline ou normalisation.",
                )
              : labelText(
                  "Prioritize the highest-impact population effects.",
                  "رتّب آثار السكان الأعلى تأثيرًا.",
                  "Priorisez les effets populationnels les plus importants.",
                ),
        },
        falsifiability: {
          reason:
            val < 70
              ? labelText(
                  "Scenarios lack disconfirming conditions for governance effects.",
                  "السيناريوهات تفتقر إلى شروط تُضعف آثار الحكم.",
                  "Les scénarios manquent de conditions qui infirmeraient les effets de gouvernement.",
                )
              : labelText(
                  "Scenarios include testable falsifiers.",
                  "السيناريوهات تتضمن شروط إبطال قابلة للاختبار.",
                  "Les scénarios incluent des falsificateurs testables.",
                ),
          action:
            val < 70
              ? labelText(
                  "Add early signals and disproven-if conditions tied to population behavior or institutional adaptation.",
                  "أضف إشارات مبكرة وشروط إبطال مرتبطة بسلوك السكان أو تكيف المؤسسات.",
                  "Ajoutez signaux précoces et conditions d’infirmation liés aux conduites ou adaptations institutionnelles.",
                )
              : labelText(
                  "Monitor resistance, normalization, and institutional learning.",
                  "راقب المقاومة والتطبيع والتعلم المؤسسي.",
                  "Surveillez résistance, normalisation et apprentissage institutionnel.",
                ),
        },
        evidence: {
          reason:
            val < 70
              ? labelText(
                  "Evidence grounding is weak for population, body, technique, or access claims.",
                  "الأدلة ضعيفة في ادعاءات السكان أو الجسد أو التقنية أو الوصول.",
                  "Les preuves sont faibles pour les affirmations sur populations, corps, techniques ou accès.",
                )
              : labelText(
                  "Evidence and assumptions provide reasonable grounding.",
                  "الأدلة والافتراضات تعطي ارتكازًا معقولًا.",
                  "Les preuves et hypothèses donnent un ancrage raisonnable.",
                ),
          action:
            val < 70
              ? labelText(
                  "Add source-grounded claims, counter-evidence, and tests for embodied/social outcomes.",
                  "أضف ادعاءات بمصادر، أدلة مضادة، واختبارات للآثار الجسدية/الاجتماعية.",
                  "Ajoutez affirmations sourcées, contre-preuves et tests pour les effets incarnés/sociaux.",
                )
              : labelText(
                  "Verify population and technique claims before publication.",
                  "تحقق من ادعاءات السكان والتقنيات قبل النشر.",
                  "Vérifiez les affirmations sur populations et techniques avant publication.",
                ),
        },
        readiness: {
          reason:
            val < 70
              ? labelText(
                  "The report is not yet publishable as biopolitical analysis.",
                  "التقرير ليس جاهزًا للنشر كتحليل حيوسياسي.",
                  "Le rapport n’est pas encore publiable comme analyse biopolitique.",
                )
              : labelText(
                  "The report is structurally ready for review.",
                  "التقرير جاهز بنيويًا للمراجعة.",
                  "Le rapport est structurellement prêt pour révision.",
                ),
          action:
            val < 70
              ? labelText(
                  "Resolve ontology warnings before exporting.",
                  "حلّ تحذيرات الأنطولوجيا قبل التصدير.",
                  "Résolvez les alertes ontologiques avant export.",
                )
              : labelText(
                  "Do a final protection/control and evidence audit.",
                  "أنجز مراجعة أخيرة للحماية/السيطرة والأدلة.",
                  "Faites un dernier audit protection/contrôle et preuves.",
                ),
        },
      }
    : {
        completeness: {
          reason:
            val < 70
              ? labelText(
                  "Some model layers are still thin or empty.",
                  "بعض طبقات النموذج لا تزال ضعيفة أو فارغة.",
                )
              : labelText(
                  "The six-layer structure is substantially populated.",
                  "البنية ذات الطبقات الست مكتملة بدرجة جيدة.",
                ),
          action:
            val < 70
              ? labelText(
                  "Add missing layer items, especially feedback and results.",
                  "أضف عناصر للطبقات الناقصة، خصوصًا النتائج والتغذية الراجعة.",
                )
              : labelText(
                  "Review quality rather than adding more volume.",
                  "راجع الجودة بدل إضافة حجم زائد.",
                ),
        },
        coherence: {
          reason:
            val < 70
              ? labelText(
                  "Causal links across interests, actors, tools, and results need clearer connection.",
                  "الروابط السببية بين المصالح والفاعلين والأدوات والنتائج تحتاج وضوحًا أكبر.",
                )
              : labelText(
                  "The core causal chain is visible.",
                  "السلسلة السببية الأساسية واضحة.",
                ),
          action:
            val < 70
              ? labelText(
                  "Ask the AI to make the causal chain explicit.",
                  "اطلب من المساعد توضيح السلسلة السببية صراحة.",
                )
              : labelText(
                  "Check for weak assumptions inside the causal chain.",
                  "افحص الافتراضات الضعيفة داخل السلسلة السببية.",
                ),
        },
        contradictions: {
          reason:
            val < 70
              ? labelText(
                  "Contradictions need stronger action/result grouping or interpretation.",
                  "التناقضات تحتاج ربطًا أقوى بالأفعال/النتائج أو تفسيرًا أوضح.",
                )
              : labelText(
                  "Contradictions are actionable and interpretable.",
                  "التناقضات قابلة للفحص والتفسير.",
                ),
          action:
            val < 70
              ? labelText(
                  "Add actions/results and affected layers for each contradiction.",
                  "أضف الأفعال/النتائج والطبقات المتأثرة لكل تناقض.",
                )
              : labelText(
                  "Prioritize the highest-severity contradictions.",
                  "رتّب التناقضات الأعلى شدة.",
                ),
        },
        falsifiability: {
          reason:
            val < 70
              ? labelText(
                  "Scenarios lack enough disproval conditions or probability discipline.",
                  "السيناريوهات تفتقر إلى شروط إبطال أو ضبط احتمالي كافٍ.",
                )
              : labelText(
                  "Scenarios include testable falsifiers.",
                  "السيناريوهات تتضمن شروط إبطال قابلة للاختبار.",
                ),
          action:
            val < 70
              ? labelText(
                  "Add early signals and disproven-if conditions.",
                  "أضف إشارات مبكرة وشروط إبطال واضحة.",
                )
              : labelText(
                  "Monitor early signals against each scenario.",
                  "راقب الإشارات المبكرة لكل سيناريو.",
                ),
        },
        evidence: {
          reason:
            val < 70
              ? labelText(
                  "Evidence grounding is weak or too inference-heavy.",
                  "الارتكاز على الأدلة ضعيف أو يعتمد كثيرًا على الاستنتاجات.",
                )
              : labelText(
                  "Evidence and assumptions provide reasonable grounding.",
                  "الأدلة والافتراضات تعطي ارتكازًا معقولًا.",
                ),
          action:
            val < 70
              ? labelText(
                  "Add source-grounded claims and tests for assumptions.",
                  "أضف ادعاءات مرتكزة على مصادر واختبارات للافتراضات.",
                )
              : labelText(
                  "Verify source notes before publication.",
                  "تحقق من ملاحظات المصدر قبل النشر.",
                ),
        },
        readiness: {
          reason:
            val < 70
              ? labelText(
                  "The report is not ready for publication.",
                  "التقرير غير جاهز للنشر.",
                )
              : labelText(
                  "The report is structurally ready for review.",
                  "التقرير جاهز بنيويًا للمراجعة.",
                ),
          action:
            val < 70
              ? labelText(
                  "Resolve warnings before exporting.",
                  "حلّ التحذيرات قبل التصدير.",
                )
              : labelText(
                  "Do a final editorial check.",
                  "أنجز مراجعة تحريرية أخيرة.",
                ),
        },
      };
  return data[key] || { reason: "", action: "" };
}
function scoreWeights() {
  return {
    completeness: 25,
    coherence: 20,
    contradictions: 15,
    falsifiability: 15,
    evidence: 15,
    readiness: 10,
  };
}
function scoreWeightLabel(k) {
  return (
    {
      completeness: t("scoreCompleteness"),
      coherence: t("scoreCoherence"),
      contradictions: t("scoreContradictions"),
      falsifiability: t("scoreFalsifiability"),
      evidence: t("scoreEvidence"),
      readiness: t("scoreReadiness"),
    }[k] || k
  );
}
function scoreFormulaText() {
  return labelText(
    "Analytical coverage uses the six weighted diagnostics. Decision readiness is capped by source traceability and independent human review.",
    "تستخدم التغطية التحليلية المؤشرات الستة الموزونة. وتُقيَّد جاهزية القرار بقابلية تتبع المصادر والمراجعة البشرية المستقلة.",
    "La couverture analytique utilise les six diagnostics pondérés. La préparation à la décision est plafonnée par la traçabilité des sources et la revue humaine indépendante.",
  );
}
function metricCard(kind, label, value, hint) {
  const safeValue = Number.isFinite(Number(value))
    ? Math.max(0, Math.min(100, Math.round(Number(value))))
    : 0;
  const title = label || kind;
  const help = hint || "";
  return `<div class="scoreMetricCard ${pctClass(safeValue)}" data-metric="${escapeHtml(kind)}"><div class="metricHead"><strong>${escapeHtml(title)}</strong><b>${safeValue}${t("outOfHundred")}</b></div>${ringMetric(safeValue, "sm")}<p class="metricHint">${escapeHtml(help)}</p></div>`;
}
function scoreFormulaHtml() {
  const weights = scoreWeights();
  const entries = Object.keys(weights)
    .map(
      (k) =>
        `<div class="formulaWeight"><span>${escapeHtml(scoreWeightLabel(k))}</span><b>${weights[k]}%</b></div>`,
    )
    .join("");
  const bands = [
    ["pct-low", "0–34"],
    ["pct-warn", "35–55"],
    ["pct-mid", "56–75"],
    ["pct-good", "76–89"],
    ["pct-excellent", "90–100"],
  ]
    .map(
      ([cls, label]) =>
        `<span class="bandChip ${cls}"><span class="bandDot"></span>${label}</span>`,
    )
    .join("");
  return `<div class="scoreFormulaCard"><h4>${escapeHtml(labelText("Scoring formula", "معادلة التقييم"))}</h4><p>${escapeHtml(scoreFormulaText())}</p><div class="formulaGrid">${entries}</div><div class="scoreBandLegend" aria-label="${escapeHtml(labelText("Score bands", "مستويات الدرجة"))}">${bands}</div></div>`;
}
function itemCard(obj, extra = "") {
  const inspectionAnchor = obj?.id
    ? ` data-inspection-id="${escapeHtml(obj.id)}" tabindex="-1"`
    : "";
  return `<article class="item"${inspectionAnchor}><div class="itemTitle">${escapeHtml(obj.name || obj.title || obj.description || obj.claim || obj.assumption || obj.rhetoric || "—")}</div><div class="itemMeta">${pill(obj.type || obj.category || obj.frame || obj.basis)}${pill(obj.confidence, "confidence")}${pill(obj.horizon || obj.timeframe)}${pill(obj.stakes)}</div>${obj.rationale ? `<div class="itemText">${escapeHtml(obj.rationale)}</div>` : ""}${extra}</article>`;
}
function resultsOrientationHtml(model, explanation) {
  const gateClass = model.publication.approved ? "approved" : "blocked";
  return `<section class="resultsOrientation" data-results-orientation data-analysis-lens="${escapeHtml(model.lens)}" aria-labelledby="resultsOrientationTitle"><header class="resultsOrientationHeader"><div><div class="sectionKicker">${escapeHtml(labelText("Decision orientation", "اتجاه القرار", "Orientation de décision"))}</div><h3 id="resultsOrientationTitle">${escapeHtml(labelText("What matters first", "ما الذي يهم أولًا", "L’essentiel d’abord"))}</h3><p>${escapeHtml(model.topic)}</p></div><div class="orientationGate ${gateClass}"><span>${escapeHtml(labelText("Publication gate", "بوابة النشر", "Seuil de publication"))}</span><strong>${escapeHtml(model.publication.label)}</strong></div></header><div class="orientationMain"><article class="orientationConclusion"><span>${escapeHtml(labelText("Conclusion", "الخلاصة", "Conclusion"))}</span><p>${escapeHtml(model.conclusion)}</p></article><div class="orientationMetrics" aria-label="${escapeHtml(labelText("Readiness summary", "ملخص الجاهزية", "Résumé de préparation"))}"><div class="orientationMetric ${pctClass(model.readiness)}"><strong>${model.readiness}%</strong><span>${escapeHtml(labelText("Decision readiness", "جاهزية القرار", "Préparation à la décision"))}</span></div><div class="orientationMetric ${pctClass(model.coverage)}"><strong>${model.coverage}%</strong><span>${escapeHtml(labelText("Analytical coverage", "التغطية التحليلية", "Couverture analytique"))}</span></div></div></div><div class="orientationSignals"><article class="orientationSignal uncertainty"><span>${escapeHtml(labelText("Principal uncertainty", "عدم اليقين الرئيسي", "Incertitude principale"))}</span><p>${escapeHtml(model.uncertainty)}</p></article><article class="orientationSignal action"><span>${escapeHtml(labelText("Recommended next action", "الإجراء التالي الموصى به", "Prochaine action recommandée"))}</span><p>${escapeHtml(model.nextAction)}</p></article></div></section>${resultsExplanationHtml(explanation)}<div class="diagnosticsDivider"><span>${escapeHtml(labelText("Detailed diagnostics", "التشخيصات التفصيلية", "Diagnostics détaillés"))}</span></div>`;
}
function authoredText(...values) {
  for (const value of values) {
    const normalized = Array.isArray(value)
      ? value.map((item) => String(item ?? "").trim()).filter(Boolean).join(" · ")
      : String(value ?? "").trim();
    if (normalized) return normalized;
  }
  return "";
}
function explanationCopy(key) {
  const copy = {
    actors: {
      label: labelText("Actors & affected groups", "الفاعلون والفئات المتأثرة", "Acteurs et groupes concernés"),
      description: labelText(
        "Who holds decision power and who bears the consequences.",
        "من يملك سلطة القرار ومن يتحمّل النتائج.",
        "Qui détient le pouvoir de décision et qui en supporte les conséquences.",
      ),
    },
    mechanisms: {
      label: labelText("Mechanisms & instruments", "الآليات والأدوات", "Mécanismes et instruments"),
      description: labelText(
        "Which instruments, infrastructures, and causal pathways produce the outcome.",
        "ما الأدوات والبنى التحتية والمسارات السببية التي تنتج النتيجة.",
        "Quels instruments, infrastructures et chemins causaux produisent le résultat.",
      ),
    },
    evidence: {
      label: labelText("Evidence & counter-evidence", "الأدلة والأدلة المضادة", "Preuves et contre-preuves"),
      description: labelText(
        "Which claims are supported, challenged, or still unverified.",
        "ما الادعاءات المدعومة أو المطعون فيها أو التي لم تُتحقق بعد.",
        "Quels énoncés sont étayés, contestés ou restent à vérifier.",
      ),
    },
    tensions: {
      label: labelText("Tensions & contradictions", "التوترات والتناقضات", "Tensions et contradictions"),
      description: labelText(
        "Where rhetoric, care, control, intentions, and actions diverge.",
        "أين يتباعد الخطاب والرعاية والضبط والنوايا والأفعال.",
        "Où divergent discours, soin, contrôle, intentions et actions.",
      ),
    },
    effects: {
      label: labelText("Effects & distribution", "الآثار والتوزيع", "Effets et distribution"),
      description: labelText(
        "Who benefits, who bears costs, and how power or access changes.",
        "من يستفيد ومن يتحمّل الأعباء وكيف تتغيّر السلطة أو إمكانية الوصول.",
        "Qui bénéficie, qui supporte les coûts et comment évoluent le pouvoir ou l’accès.",
      ),
    },
  };
  return copy[key];
}
function explanationSection(key, items, target) {
  const copy = explanationCopy(key);
  return {
    ...copy,
    items,
    total: items.length,
    target,
    actionLabel: labelText("Inspect details", "افحص التفاصيل", "Examiner les détails"),
    emptyLabel: labelText(
      "No authored signals in this section.",
      "لا توجد إشارات مؤلفة في هذا القسم.",
      "Aucun signal rédigé dans cette section.",
    ),
  };
}
function strategicResultsExplanation(a) {
  const evidenceItems = arr(a.evidence?.items).map((item) => ({
    name: authoredText(item.source_title, item.claim),
    summary: authoredText(
      item.counter_evidence
        ? `${item.claim || ""} · ${labelText("Counter-evidence", "الدليل المضاد", "Contre-preuve")}: ${item.counter_evidence}`
        : item.claim,
      item.source_note,
      item.uncertainty,
    ),
    meta: [item.basis, item.confidence],
  }));
  const sections = {
    actors: explanationSection(
      "actors",
      arr(a.actors).map((item) => ({
        name: authoredText(item.name, item.title),
        summary: authoredText(item.rationale, item.role),
        meta: [item.category, item.confidence],
      })),
      { review: "pillars", pillar: "actors" },
    ),
    mechanisms: explanationSection(
      "mechanisms",
      arr(a.tools).map((item) => ({
        name: authoredText(item.name, item.title),
        summary: authoredText(item.rationale, item.description),
        meta: [item.type, item.confidence],
      })),
      { review: "pillars", pillar: "tools" },
    ),
    evidence: explanationSection("evidence", evidenceItems, { review: "evidence" }),
    tensions: explanationSection(
      "tensions",
      arr(a.contradictions?.items).map((item) => ({
        name: authoredText(item.rhetoric, item.name, item.title),
        summary: authoredText(item.interpretation, item.actions),
        meta: [item.contradiction_type || item.type, item.confidence],
      })),
      { review: "contradictions" },
    ),
    effects: explanationSection(
      "effects",
      arr(a.results).map((item) => ({
        name: authoredText(item.name, item.title),
        summary: authoredText(item.rationale, item.description),
        meta: [item.type, item.confidence],
      })),
      { review: "pillars", pillar: "results" },
    ),
  };
  return createResultsExplanation({ lens: "strategic", sections });
}
function biopoliticalResultsExplanation(a) {
  const actors = [
    ...arr(a.power_map?.actors).map((item) => ({
      name: authoredText(item.name),
      summary: authoredText(item.formal_mandate, item.stated_objectives),
      meta: [item.role, item.confidence],
    })),
    ...arr(a.power_map?.affected_populations).map((item) => ({
      name: authoredText(item.name),
      summary: authoredText(item.burdens, item.benefits, item.agency),
      meta: [labelText("Affected population", "فئة متأثرة", "Population concernée"), item.confidence],
    })),
    ...arr(a.power_map?.institutions).map((item) => ({
      name: authoredText(item.name),
      summary: authoredText(item.mandate, item.accountability),
      meta: [item.role, item.confidence],
    })),
  ];
  const mechanisms = [
    ...arr(a.mechanisms?.instruments).map((item) => ({
      name: authoredText(item.name, item.type),
      summary: authoredText(item.mechanism, item.stated_purpose),
      meta: [item.type, item.confidence],
    })),
    ...arr(a.mechanisms?.infrastructures).map((item) => ({
      name: authoredText(item.name, item.owner),
      summary: authoredText(item.dependency_created, item.actions_enabled_or_blocked),
      meta: [labelText("Infrastructure", "بنية تحتية", "Infrastructure"), item.confidence],
    })),
    ...arr(a.mechanisms?.political_economy).map((item) => ({
      name: authoredText(item.ownership, item.dependency_model),
      summary: authoredText(item.scarcity_mechanism, item.dependency_model),
      meta: [labelText("Political economy", "الاقتصاد السياسي", "Économie politique"), item.confidence],
    })),
    ...arr(a.mechanisms?.power_modes).map((item) => ({
      name: authoredText(displayEnum(item.mode), item.mode),
      summary: authoredText(item.mechanism),
      meta: [item.confidence],
    })),
  ];
  const evidenceItems = arr(a.evidence?.items).map((item) => ({
    name: authoredText(item.source_title, item.claim),
    summary: authoredText(
      item.counter_evidence
        ? `${item.claim || ""} · ${labelText("Counter-evidence", "الدليل المضاد", "Contre-preuve")}: ${item.counter_evidence}`
        : item.claim,
      item.limitations,
      item.uncertainty,
    ),
    meta: [item.verification_status, item.confidence],
  }));
  const populationNames = new Map(
    arr(a.power_map?.affected_populations).map((item) => [item.id, item.name]),
  );
  const sections = {
    actors: explanationSection("actors", actors, { review: "pillars", pillar: "actors_institutions" }),
    mechanisms: explanationSection("mechanisms", mechanisms, { review: "pillars", pillar: "mechanisms_infrastructure" }),
    evidence: explanationSection("evidence", evidenceItems, { review: "evidence" }),
    tensions: explanationSection(
      "tensions",
      arr(a.intervention_assessment?.care_control_tensions).map((item) => ({
        name: authoredText(item.care_claim, item.id),
        summary: authoredText(item.interpretation, item.control_effects),
        meta: [item.confidence],
      })),
      { review: "pillars", pillar: "intervention_capture" },
    ),
    effects: explanationSection(
      "effects",
      arr(a.distribution?.items).map((item) => ({
        name: authoredText(populationNames.get(item.population_id), item.population_id),
        summary: authoredText(item.burdens, item.benefits, item.risk),
        meta: [item.outcome_character, item.confidence],
      })),
      { review: "pillars", pillar: "distribution_effects" },
    ),
  };
  return createResultsExplanation({ lens: "biopolitical", sections });
}
function resultsExplanationHtml(model) {
  if (!model) return "";
  const cards = model.sections
    .map((section, index) => {
      const items = section.items.length
        ? `<ol class="explanationItems">${section.items
            .map(
              (item) =>
                `<li><strong>${escapeHtml(item.name)}</strong>${item.summary ? `<p>${escapeHtml(item.summary)}</p>` : ""}${item.meta.length ? `<div class="explanationMeta">${item.meta.map((value) => pill(value)).join("")}</div>` : ""}</li>`,
            )
            .join("")}</ol>`
        : `<p class="explanationEmpty">${escapeHtml(section.emptyLabel)}</p>`;
      return `<article class="explanationCard" data-explanation-section="${escapeHtml(section.key)}" aria-labelledby="explanation-${escapeHtml(section.key)}"><header><span class="explanationIndex">${String(index + 1).padStart(2, "0")}</span><div><h4 id="explanation-${escapeHtml(section.key)}">${escapeHtml(section.label)}</h4><p>${escapeHtml(section.description)}</p></div><span class="explanationCount" aria-label="${escapeHtml(`${section.total} ${itemsWord()}`)}">${section.total}</span></header>${items}<button class="explanationInspect" data-explanation-open type="button" data-explanation-review="${escapeHtml(section.target.review)}" data-explanation-pillar="${escapeHtml(section.target.pillar)}"><span>${escapeHtml(section.actionLabel)}</span><span aria-hidden="true">${state.lang === "ar" ? "←" : "→"}</span></button></article>`;
    })
    .join("");
  return `<section class="resultsExplanation" data-results-explanation data-analysis-lens="${escapeHtml(model.lens)}" aria-labelledby="resultsExplanationTitle"><header class="resultsExplanationHeader"><div><div class="sectionKicker">${escapeHtml(labelText("Explanation", "الشرح", "Explication"))}</div><h3 id="resultsExplanationTitle">${escapeHtml(labelText("How the conclusion is built", "كيف بُنيت الخلاصة", "Comment la conclusion est construite"))}</h3></div><p>${escapeHtml(labelText("Follow the strongest authored signals, then open the complete analytical record.", "اتبع أقوى الإشارات المؤلفة ثم افتح السجل التحليلي الكامل.", "Suivez les signaux rédigés les plus forts, puis ouvrez le dossier analytique complet."))}</p></header><div class="explanationGrid">${cards}</div></section>`;
}
function wireResultsExplanation(lens) {
  document.querySelectorAll("[data-explanation-open]").forEach((button) => {
    button.onclick = () => {
      const review = button.dataset.explanationReview;
      const pillar = button.dataset.explanationPillar || null;
      if (!review) return;
      state.activeReview = review;
      state.activePillar = pillar;
      const biopolitical = lens === "biopolitical";
      if (biopolitical) renderBiopoliticalReview();
      else renderReview();
      requestAnimationFrame(() => {
        const selector = pillar
          ? biopolitical
            ? `[data-bio-acc="${CSS.escape(pillar)}"]`
            : `[data-acc="${CSS.escape(pillar)}"]`
          : biopolitical
            ? `[data-bio-review="${CSS.escape(review)}"]`
            : `[data-review="${CSS.escape(review)}"]`;
        const target = document.querySelector(selector);
        target?.scrollIntoView({ behavior: "auto", block: "nearest" });
        target?.focus({ preventScroll: true });
      });
    };
  });
}
function renderOverview() {
  const a = state.analysis;
  const warnings = getWarnings(a);
  const h = schemaHealth(a);
  const b = scoreBreakdown(a);
  const missing = h.missing.length
    ? h.missing
        .map((w) => `<div class="warning">${escapeHtml(w)}</div>`)
        .join("")
    : `<div class="warning good">${escapeHtml(t("healthGood"))}</div>`;
  const gate = qualityGate(a);
  const authoredUncertainty = arr(a.evidence?.items).find((item) => String(item.uncertainty || "").trim())?.uncertainty;
  const orientation = createResultsOrientation({
    lens: "strategic",
    topic: a.subject.title || state.topic,
    conclusion: a.subject.executive_thesis || a.subject.question || a.subject.title,
    publicationApproved: b.provenance.publicationApproved,
    publicationLabel: b.provenance.publicationApproved ? labelText("Approved", "معتمد", "Approuvé") : labelText("Blocked", "محظور", "Bloqué"),
    readiness: b.overall,
    coverage: b.analyticalCoverage,
    uncertainty: authoredUncertainty || h.missing[0] || labelText("No principal uncertainty was authored.", "لم يُذكر عدم يقين رئيسي.", "Aucune incertitude principale n’a été formulée."),
    nextAction: a.quality_gate?.next_improvement || h.next,
  });
  return `<h3>${t("overview")}</h3>${resultsOrientationHtml(orientation, strategicResultsExplanation(a))}<div class="summaryGrid"><div class="intelBrief">${qualityGateHtml(a)}<div class="briefHero"><div class="itemTitle">${t("thesis")}</div><div class="itemText">${escapeHtml(a.subject.executive_thesis || a.subject.question || a.subject.title || "—")}</div></div><div class="scoreSystemGrid">${metricCard("completeness", t("scoreCompleteness"), b.completeness, t("scoreCompletenessHint"))}${metricCard("coherence", t("scoreCoherence"), b.coherence, t("scoreCoherenceHint"))}${metricCard("contradictions", t("scoreContradictions"), b.contradictions, t("scoreContradictionsHint"))}${metricCard("falsifiability", t("scoreFalsifiability"), b.falsifiability, t("scoreFalsifiabilityHint"))}${metricCard("evidence", t("scoreEvidence"), b.evidence, t("scoreEvidenceHint"))}${metricCard("readiness", t("scoreReadiness"), b.readiness, t("scoreReadinessHint"))}</div>${scoreFormulaHtml()}<div class="healthGrid"><div class="healthCard ${pctClass(h.pct)}"><div class="healthCardValue">${h.pct}%</div><span>${escapeHtml(labelText("Structural completion", "اكتمال البنية", "Complétude structurelle"))}</span></div><div class="healthCard ${pctClass(b.provenance.sourceTraceability)}"><div class="healthCardValue">${b.provenance.sourceTraceability}%</div><span>${escapeHtml(labelText("Source traceability", "قابلية تتبع المصادر", "Traçabilité des sources"))}</span></div><div class="healthCard ${pctClass(b.provenance.humanReview)}"><div class="healthCardValue">${b.provenance.humanReview}%</div><span>${escapeHtml(labelText("Independent human review", "المراجعة البشرية المستقلة", "Revue humaine indépendante"))}</span></div><div class="healthCard ${h.missing.length ? "pct-warn" : "pct-good"}"><div class="healthCardValue">${h.missing.length}</div><span>${t("missingItems")}</span></div></div><div class="nextAction"><strong>${t("nextBestAction")}:</strong> ${escapeHtml(h.next)}</div><div class="list">${warnings.map((w) => `<div class="warning">${escapeHtml(w)}</div>`).join("") || `<div class="warning good">${t("warnings").good}</div>`}</div></div><aside class="scoreBox ${gate.cls}"><div class="sectionKicker">${t("qualityGate")}</div><div class="publicationState ${b.provenance.publicationApproved ? "approved" : "blocked"}">${escapeHtml(b.provenance.publicationApproved ? labelText("Approved", "معتمد", "Approuvé") : labelText("Blocked", "محظور", "Bloqué"))}</div><div class="decisionMetric"><strong>${b.overall}%</strong><span>${escapeHtml(labelText("Decision readiness", "جاهزية القرار", "Préparation à la décision"))}</span></div><div class="decisionMetric"><strong>${b.analyticalCoverage}%</strong><span>${escapeHtml(labelText("Analytical coverage", "التغطية التحليلية", "Couverture analytique"))}</span></div><div class="scoreHelp">${escapeHtml(labelText("Decision readiness is capped by source traceability and independent review.", "تُقيَّد جاهزية القرار بقابلية تتبع المصادر والمراجعة المستقلة.", "La préparation à la décision est plafonnée par la traçabilité et la revue indépendante."))}</div><div class="scoreTopicBox"><span>${t("topic")}</span><strong>${escapeHtml(a.subject.title || state.topic || "—")}</strong></div></aside></div><div class="card flat schemaCard"><h3>${t("schemaHealth")}</h3><div class="list">${missing}</div></div>`;
}
function renderPillars() {
  const labels = t("pillars");
  return `<h3>${t("engine")}</h3><div class="layerStack">${PILLARS.map(
    (p, i) => {
      const depth = layerDepthPct(p);
      const open = state.activePillar === p;
      return `<section class="accordion ${open ? "open" : ""}" style="--pc:${COLORS[p]}"><button id="acc-head-${p}" class="accHead" data-acc="${p}" type="button" aria-expanded="${open ? "true" : "false"}" aria-controls="acc-panel-${p}"><span class="accLead"><span class="accNumber">${String(i + 1).padStart(2, "0")}</span><span><strong>${labels[p][0]}</strong><small class="muted">${labels[p][1]}</small></span></span><span class="accMeta"><span class="countBadge"><b>${countFor(p)}</b> ${itemsWord()}</span>${ringMetric(depth, "xs")}</span></button><div id="acc-panel-${p}" class="accBody" role="region" aria-labelledby="acc-head-${p}"${open ? "" : " hidden"}>${state.analysis[p].length ? state.analysis[p].map((o) => itemCard(o, modelMetricsFor(p, o))).join("") : `<div class="empty"><strong>${t("noItems")}</strong></div>`}</div></section>`;
    },
  ).join("")}</div>`;
}
function renderContradictions() {
  const items = state.analysis.contradictions.items;
  return `<h3>${t("contradictions")}</h3><div class="conflictGrid">${
    items.length
      ? items
          .map((c) => {
            const layers = affectedLayers(c);
            const inspectionAnchor = c?.id
              ? ` data-inspection-id="${escapeHtml(c.id)}" tabindex="-1"`
              : "";
            return `<article class="conflictCard premiumConflict"${inspectionAnchor}><div class="conflictTop"><div><div class="conflictLabel">${t("contradictions")}</div><div class="conflictTitle">${escapeHtml(c.rhetoric || c.name || c.title || "—")}</div></div><div class="chips conflictMeta">${pill(c.contradiction_type || c.type)}${pill(c.confidence, "confidence")}${c.severity !== undefined && c.severity !== null && c.severity !== "" ? pill(`${t("severityShort")} ${c.severity}`, "severity") : ""}</div></div><div class="conflictBodyGrid"><div class="conflictMain"><div class="miniBlock actionBox"><b>${t("actionsResults")}</b><ul class="actionList">${
              arr(c.actions).length
                ? arr(c.actions)
                    .map((x) => `<li>${escapeHtml(x)}</li>`)
                    .join("")
                : "<li>—</li>"
            }</ul></div><div class="interpretBox"><b>${t("interpretation")}:</b> ${escapeHtml(c.interpretation || "—")}</div></div><aside class="conflictInsight"><div class="insightLabel">${analysisSignalLabel()}</div><div class="insightTitle">${escapeHtml(contradictionMeaning(c))}</div><div class="insightList"><div><span>${labelText("Type", "النوع")}</span><strong>${escapeHtml(contradictionTypeLabel(c.contradiction_type || c.type))}</strong></div><div><span>${labelText("Impact", "الأثر")}</span><strong>${escapeHtml(impactScope(c))}</strong></div><div><span>${labelText("Affected layers", "الطبقات المتأثرة")}</span><div class="layerMiniChips">${
              layers.length
                ? layers
                    .map(
                      (p) =>
                        `<em style="--pc:${COLORS[p]}">${escapeHtml(
                          t("pillars")
                            [p][0].replace(/[🔴🟠🟡🔵🟣⚫]/g, "")
                            .trim(),
                        )}</em>`,
                    )
                    .join("")
                : `<em>${labelText("Cross-layer", "عابر للطبقات")}</em>`
            }</div></div></div></aside></div></article>`;
          })
          .join("")
      : `<div class="empty"><strong>${t("noItems")}</strong></div>`
  }</div>`;
}
function renderScenarios() {
  const items = state.analysis.scenarios.items;
  return `<h3>${t("scenarios")}</h3><div class="scenarioGrid">${
    items.length
      ? items
          .map((s) => {
            const pct = valuePct(Number(s.probability));
            const inspectionAnchor = s?.id
              ? ` data-inspection-id="${escapeHtml(s.id)}" tabindex="-1"`
              : "";
            return `<article class="forecastCard ${pctClass(pct)}"${inspectionAnchor}><div class="forecastHead"><div><div class="sectionKicker">${t("scenarios")}</div><div class="conflictTitle">${escapeHtml(s.name || s.title || "—")}</div><div class="muted">${escapeHtml(s.timeframe || "—")}</div></div><div class="forecastProbWrap">${probabilityMetric(pct, "md")}</div></div><div class="forecastCols"><div class="miniBlock"><b>${t("drivers")}</b>${
              arr(s.drivers)
                .map((x) => "• " + escapeHtml(x))
                .join("<br>") || "—"
            }</div><div class="miniBlock"><b>${t("earlySignals")}</b>${
              arr(s.early_signals)
                .map((x) => "• " + escapeHtml(x))
                .join("<br>") || "—"
            }</div><div class="miniBlock"><b>${t("disprovenIf")}</b>${
              arr(s.disproven_if)
                .map((x) => "• " + escapeHtml(x))
                .join("<br>") || "—"
            }</div></div></article>`;
          })
          .join("")
      : `<div class="empty"><strong>${t("noItems")}</strong></div>`
  }</div>`;
}
function renderEvidence() {
  const ev = normalizeArray(state.analysis.evidence.items),
    as = normalizeArray(state.analysis.assumptions.items);
  const assumptionCard = (a) => {
    const riskText = a.risk || a.risk_level || "";
    const r = riskInfo(riskText);
    const inspectionAnchor = a?.id
      ? ` data-inspection-id="${escapeHtml(a.id)}" tabindex="-1"`
      : "";
    return `<article class="assumptionCard ${r.cls}"${inspectionAnchor}><div class="assumptionTop"><div><div class="sectionKicker">${t("assumption")}</div><div class="itemTitle">${escapeHtml(a.assumption || a.name || a.title || a.description || "—")}</div></div><div class="chips">${pill(riskText, "risk")}${a.confidence ? pill(a.confidence, "confidence") : ""}</div></div><div class="assumptionDetails"><div><span>${t("risk")}</span><p>${escapeHtml(riskText || labelText("No explicit risk stated.", "لا توجد مخاطر مصرح بها."))}</p></div><div><span>${t("test")}</span><p>${escapeHtml(a.disproving_test || a.test || labelText("No falsifier provided.", "لا يوجد اختبار إبطال."))}</p></div></div></article>`;
  };
  return `<h3>${t("evidence")}</h3><div class="evidenceLedger premiumLedger"><div class="ledgerRow header"><div>${t("claim")}</div><div>${t("basis")}</div><div>${t("confidence")}</div><div>${t("sourceNote")}</div></div>${
    ev.length
      ? ev
          .map((e) => {
            const source = [e.source_title, e.source_type, e.source_date]
              .filter(Boolean)
              .join(" · ");
            const counter = e.counter_evidence || e.counterEvidence || "";
            const inspectionAnchor = e?.id
              ? ` data-inspection-id="${escapeHtml(e.id)}" tabindex="-1"`
              : "";
            return `<div class="ledgerRow evidenceRow"${inspectionAnchor}><div class="evidenceClaim"><b>${escapeHtml(e.claim || e.name || "—")}</b>${counter ? `<small class="muted"><br>${escapeHtml(labelText("Counter-evidence", "دليل مضاد"))}: ${escapeHtml(counter)}</small>` : ""}</div><div>${pill(e.basis, "basis")}</div><div>${pill(e.confidence, "confidence")}${e.evidence_strength ? pill(`${escapeHtml(e.evidence_strength)}/5`) : ""}</div><div class="sourceNote">${escapeHtml(source || e.source_note || "—")}${safeHttpUrl(e.source_url) ? `<br>${sourceAnchor(e.source_url)}` : ""}</div></div>`;
          })
          .join("")
      : `<div class="empty"><strong>${t("noItems")}</strong></div>`
  }</div><h3 style="margin-top:22px">${t("assumption")}</h3><div class="assumptionGrid premiumAssumptions">${as.length ? as.map(assumptionCard).join("") : `<div class="empty"><strong>${t("noItems")}</strong></div>`}</div>`;
}
function download(name, text, type = "text/plain") {
  const blob = new Blob([text], { type });
  const a = document.createElement("a");
  const url = URL.createObjectURL(blob);
  a.href = url;
  a.download = name;
  a.hidden = true;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    URL.revokeObjectURL(url);
    a.remove();
  }, 30_000);
}
function htmlReport() {
  const a = state.analysis || normalizeAnalysis({});
  const b = scoreBreakdown(a);
  const h = schemaHealth(a);
  const dir = state.lang === "ar" ? "rtl" : "ltr";
  const reportLens = ["strategic", "biopolitical"].includes(a.analysis_lens)
    ? a.analysis_lens
    : state.analysisLens;
  const reportVersion =
    document.querySelector('meta[name="app-version"]')?.content ||
    "2.1.0-alpha.28";
  const exportContract =
    reportLens === "biopolitical"
      ? {
          title: "Biopolitical Analysis Report",
          chain:
            "Problematization → Populations / Subjects → Governance Techniques → Norms / Subjectivation → Embodied / Social Outcomes → Resistance / Normalization Feedback",
          labels: [
            "Problematization",
            "Populations / Subjects",
            "Governance Techniques",
            "Norms / Subjectivation",
            "Embodied / Social Outcomes",
            "Resistance / Normalization Feedback",
          ],
        }
      : {
          title: "Strategic Analysis Report",
          chain: "Interests → Actors → Tools → Narrative → Results → Feedback",
          labels: [
            "Interests",
            "Actors",
            "Tools",
            "Narrative",
            "Results",
            "Feedback",
          ],
        };
  const exportContractHtml = `<section class="block exportContract" data-export-contract="lens" data-export-contract-lens="${escapeHtml(reportLens)}"><h2>${escapeHtml(exportContract.title)}</h2><p>${escapeHtml(exportContract.chain)}</p><div class="chips">${exportContract.labels.map((label) => `<em>${escapeHtml(label)}</em>`).join("")}</div></section>`;
  const metricKeys = [
    "completeness",
    "coherence",
    "contradictions",
    "falsifiability",
    "evidence",
    "readiness",
  ];
  const metricLabels = {
    completeness: t("scoreCompleteness"),
    coherence: t("scoreCoherence"),
    contradictions: t("scoreContradictions"),
    falsifiability: t("scoreFalsifiability"),
    evidence: t("scoreEvidence"),
    readiness: t("scoreReadiness"),
  };
  const pctTone = (v) =>
    valuePct(v) >= 90
      ? "#2563eb"
      : valuePct(v) >= 76
        ? "#16a34a"
        : valuePct(v) >= 56
          ? "#ca8a04"
          : valuePct(v) >= 35
            ? "#f59e0b"
            : "#dc2626";
  const reportRing = (v) =>
    `<span class="rRing" style="--v:${valuePct(v)};--tone:${pctTone(v)}"><span>${Math.round(valuePct(v))}</span><small>%</small></span>`;
  const metricHtml = metricKeys
    .map((k) => {
      const d = scoreDiagnostic(k, b[k], a);
      return `<article class="metric"><div><h3>${escapeHtml(metricLabels[k])}</h3><p>${escapeHtml(d.reason)}</p><b>${escapeHtml(d.action)}</b></div>${reportRing(b[k])}</article>`;
    })
    .join("");
  const formulaHtml = `<section class="formula"><h2>${escapeHtml(labelText("Scoring formula", "معادلة التقييم"))}</h2><p>${escapeHtml(scoreFormulaText())}</p><div class="weights">${Object.entries(
    scoreWeights(),
  )
    .map(
      ([k, w]) => `<span><b>${w}%</b>${escapeHtml(scoreWeightLabel(k))}</span>`,
    )
    .join("")}</div></section>`;
  const pillarsHtml = PILLARS.map(
    (p) =>
      `<section class="block"><header><h2>${escapeHtml(t("pillars")[p][0])}</h2><span>${normalizeArray(a[p]).length} ${escapeHtml(t("itemsWord"))}</span></header>${
        normalizeArray(a[p])
          .map(
            (x) =>
              `<article class="item"><h3>${escapeHtml(x.name || x.description || "—")}</h3><div class="chips">${[
                x.type,
                x.category,
                x.frame,
                x.confidence,
                x.horizon,
                x.stakes,
              ]
                .filter(Boolean)
                .map((v) => `<em>${escapeHtml(displayEnum(v))}</em>`)
                .join(
                  "",
                )}</div><p>${escapeHtml(x.rationale || x.stakes || "")}</p></article>`,
          )
          .join("") || `<p class="muted">${escapeHtml(t("noItems"))}</p>`
      }</section>`,
  ).join("");
  const contradictions =
    normalizeArray(a.contradictions?.items)
      .map((c) => {
        const layers =
          affectedLayers(c)
            .map((p) => t("pillars")[p][0])
            .join(" · ") || labelText("Cross-layer", "عابر للطبقات");
        return `<article class="conflict"><header><div><small>${escapeHtml(contradictionTypeLabel(c.contradiction_type || c.type))}</small><h3>${escapeHtml(c.rhetoric || "—")}</h3></div><div class="chips"><em>${escapeHtml(confidenceInfo(c.confidence).label)}</em><em>${escapeHtml(t("severityShort"))} ${escapeHtml(c.severity || "—")}</em></div></header><div class="signal"><b>${escapeHtml(analysisSignalLabel())}</b><span>${escapeHtml(contradictionMeaning(c))}</span><small>${escapeHtml(labelText("Affected layers", "الطبقات المتأثرة"))}: ${escapeHtml(layers)}</small></div><ul>${arr(
          c.actions,
        )
          .map((x) => `<li>${escapeHtml(x)}</li>`)
          .join(
            "",
          )}</ul><p><b>${escapeHtml(t("interpretation"))}:</b> ${escapeHtml(c.interpretation || "")}</p></article>`;
      })
      .join("") || `<p class="muted">${escapeHtml(t("noItems"))}</p>`;
  const scenarios =
    normalizeArray(a.scenarios?.items)
      .map(
        (s) =>
          `<article class="scenario"><header><div><small>${escapeHtml(s.timeframe || "—")}</small><h3>${escapeHtml(s.name || "—")}</h3></div>${reportRing(Number(s.probability) || 0)}</header>${s.rationale ? `<p>${escapeHtml(s.rationale)}</p>` : ""}<div class="cols"><div><b>${escapeHtml(t("drivers"))}</b>${
            arr(s.drivers)
              .map((x) => `<p>• ${escapeHtml(x)}</p>`)
              .join("") || "<p>—</p>"
          }</div><div><b>${escapeHtml(t("earlySignals"))}</b>${
            arr(s.early_signals)
              .map((x) => `<p>• ${escapeHtml(x)}</p>`)
              .join("") || "<p>—</p>"
          }</div><div><b>${escapeHtml(t("disprovenIf"))}</b>${
            arr(s.disproven_if)
              .map((x) => `<p>• ${escapeHtml(x)}</p>`)
              .join("") || "<p>—</p>"
          }</div></div></article>`,
      )
      .join("") || `<p class="muted">${escapeHtml(t("noItems"))}</p>`;
  const evidence =
    normalizeArray(a.evidence?.items)
      .map((e) => {
        const source =
          [e.source_title, e.source_type, e.source_date]
            .filter(Boolean)
            .join(" · ") ||
          e.source_note ||
          "—";
        const counter = e.counter_evidence || e.counterEvidence || "";
        return `<tr><td><b>${escapeHtml(e.claim || e.name || "—")}</b>${counter ? `<br><span class="muted">${escapeHtml(labelText("Counter-evidence", "دليل مضاد"))}: ${escapeHtml(counter)}</span>` : ""}</td><td><em>${escapeHtml(basisInfo(e.basis).label)}</em></td><td><em>${escapeHtml(confidenceInfo(e.confidence).label)}</em></td><td>${escapeHtml(source)}${safeHttpUrl(e.source_url) ? `<br>${sourceAnchor(e.source_url)}` : ""}</td></tr>`;
      })
      .join("") || `<tr><td colspan="4">${escapeHtml(t("noItems"))}</td></tr>`;
  const assumptions =
    normalizeArray(a.assumptions?.items)
      .map(
        (x) =>
          `<article class="assumption"><h3>${escapeHtml(x.assumption || x.name || "—")}</h3><div class="chips"><em>${escapeHtml(riskInfo(x.risk || x.risk_level).label)}</em>${x.confidence ? `<em>${escapeHtml(confidenceInfo(x.confidence).label)}</em>` : ""}</div><p><b>${escapeHtml(t("test"))}:</b> ${escapeHtml(x.disproving_test || x.test || "—")}</p><p><b>${escapeHtml(labelText("If wrong", "إذا كان خاطئًا"))}:</b> ${escapeHtml(x.implication_if_wrong || "—")}</p></article>`,
      )
      .join("") || `<p class="muted">${escapeHtml(t("noItems"))}</p>`;
  return `<!doctype html><html lang="${state.lang}" dir="${dir}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(exportContract.title)}</title><meta name="app-version" content="${escapeHtml(reportVersion)}"><meta name="analysis-lens" content="${escapeHtml(reportLens)}"><style>:root{--bg:#f3f6fb;--text:#0f172a;--muted:#64748b;--line:#dbe6f5;--accent:#2563eb;--success:#16a34a;--warn:#d97706;--danger:#dc2626}*{box-sizing:border-box}html{print-color-adjust:exact;-webkit-print-color-adjust:exact}body{margin:0;background:radial-gradient(circle at 10% 0%,#dbeafe,transparent 32%),var(--bg);color:var(--text);font-family:Inter,"Noto Sans Arabic","Segoe UI",Tahoma,Arial,sans-serif;line-height:1.62}.shell{max-width:1120px;margin:0 auto;padding:38px 22px 70px}.hero{background:linear-gradient(135deg,#08111f,#1d4ed8 58%,#0f766e);color:white;border-radius:32px;padding:34px;box-shadow:0 28px 70px rgba(15,23,42,.20)}.hero h1{margin:0;font-size:36px;letter-spacing:-.04em}.hero p{margin:10px 0 0;color:#dbeafe}.heroGrid{display:grid;grid-template-columns:1fr 190px;gap:20px;align-items:center}.overall{display:grid;place-items:center;gap:8px}.rRing{--v:0;--tone:#2563eb;position:relative;width:96px;height:96px;border-radius:50%;display:grid;place-items:center;background:conic-gradient(var(--tone) calc(var(--v)*1%),rgba(15,23,42,.12) 0)}.rRing:before{content:"";position:absolute;inset:9px;border-radius:50%;background:white}.hero .rRing:before{background:#0f172a}.rRing span,.rRing small{position:relative;z-index:1}.rRing span{font-size:28px;font-weight:1000}.rRing small{font-size:11px;color:var(--muted);font-weight:900}.hero .rRing small{color:#bfdbfe}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}.metric,.block,.conflict,.scenario,.assumption,.evidenceTable,.formula{background:rgba(255,255,255,.94);border:1px solid var(--line);border-radius:24px;padding:20px;margin-top:16px;box-shadow:0 16px 36px rgba(15,23,42,.07)}.metric{display:grid;grid-template-columns:minmax(0,1fr) 96px;gap:18px;align-items:center}.metric h3,.block h2,.conflict h3,.scenario h3,.assumption h3,.formula h2{margin:0}.metric p{margin:6px 0;color:var(--muted)}.metric b{font-size:13px}.formula p{margin:8px 0 0;color:var(--muted)}.weights{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:14px}.weights span{border:1px solid var(--line);border-radius:16px;padding:10px;background:#f8fafc;color:#334155}.weights b{display:block;color:var(--text);font-size:18px}.chips{display:flex;gap:7px;flex-wrap:wrap}.chips em,td em,.block header span{font-style:normal;border:1px solid var(--line);border-radius:999px;padding:5px 9px;background:#f8fafc;font-size:12px;font-weight:850}.block header,.conflict header,.scenario header{display:flex;justify-content:space-between;gap:16px;align-items:flex-start;border-bottom:1px solid var(--line);padding-bottom:12px;margin-bottom:12px}.item{border-top:1px solid var(--line);padding:12px 0}.item:first-of-type{border-top:0}.item h3{font-size:16px;margin:0 0 6px}.item p{margin:8px 0 0;color:#334155}.signal{background:#fff7ed;border:1px solid #fed7aa;border-radius:18px;padding:12px;margin:12px 0}.signal b,.signal span,.signal small{display:block}.signal span{font-weight:900}.signal small{color:var(--muted)}ul{margin:8px 0 0;padding-inline-start:22px}.cols{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.cols div{background:#f8fafc;border:1px solid var(--line);border-radius:18px;padding:12px}.evidenceTable{overflow:auto}.evidenceTable table{width:100%;border-collapse:separate;border-spacing:0 10px}.evidenceTable th{text-align:start;color:var(--muted);font-size:12px;text-transform:uppercase;letter-spacing:.04em}.evidenceTable td{background:#f8fafc;border-block:1px solid var(--line);padding:12px;vertical-align:top}.evidenceTable td:first-child{border-inline-start:1px solid var(--line);border-start-start-radius:16px;border-end-start-radius:16px}.evidenceTable td:last-child{border-inline-end:1px solid var(--line);border-start-end-radius:16px;border-end-end-radius:16px}.muted{color:var(--muted)}@media(max-width:820px){.heroGrid,.grid,.cols,.weights{grid-template-columns:1fr}.shell{padding:20px 12px}.hero h1{font-size:28px}}@media print{@page{margin:14mm}body{background:white}.shell{padding:0}.hero,.metric,.block,.conflict,.scenario,.assumption,.evidenceTable,.formula{box-shadow:none;break-inside:avoid;page-break-inside:avoid}.hero{border-radius:18px}.grid{grid-template-columns:repeat(2,1fr)}a{color:inherit}}
.summaryGrid{grid-template-columns:minmax(0,1fr) minmax(300px,344px);align-items:start;max-width:100%;overflow:hidden}
.summaryGrid>*{min-width:0}.scoreBox{width:100%;max-width:100%;min-width:0;overflow:hidden;padding-inline:22px}.scoreBox .metricRing.lg{width:min(160px,52vw);height:min(160px,52vw);max-width:160px;max-height:160px}.scoreBox .sectionKicker,.scoreBox .scoreLbl,.scoreBox .scoreHelp{max-width:100%;overflow-wrap:anywhere}.scoreMiniNote{width:100%;max-width:100%;border:1px solid color-mix(in srgb,var(--ringTone,var(--accent)) 18%,var(--line));border-radius:16px;padding:10px 12px;background:color-mix(in srgb,var(--ringTone,var(--accent)) 6%,var(--surface-solid));color:var(--text);font-size:12.5px;font-weight:900;line-height:1.45;text-align:center;box-shadow:var(--shadow-xs)}.scoreTopicBox{width:100%;max-width:100%;border:1px solid color-mix(in srgb,var(--ringTone,var(--line-strong)) 18%,var(--line));border-radius:18px;padding:10px 12px;background:linear-gradient(180deg,color-mix(in srgb,var(--surface-solid) 98%,transparent),color-mix(in srgb,var(--surface-soft) 94%,transparent));box-shadow:var(--shadow-xs);text-align:start;display:grid;gap:4px}.scoreTopicBox span{font-size:11px;text-transform:uppercase;letter-spacing:.06em;font-weight:1000;color:var(--muted)}.scoreTopicBox strong{font-size:12.8px;line-height:1.35;color:var(--strong);overflow-wrap:anywhere;word-break:normal}.scoreFormulaCard p{overflow-wrap:anywhere}.diagnosticNote{max-width:100%;overflow-wrap:anywhere;white-space:normal}.scoreBox .chip{max-width:100%;min-width:0;white-space:normal;overflow-wrap:anywhere;text-align:center}
@media(max-width:1180px){.summaryGrid{grid-template-columns:1fr}.scoreBox{max-width:520px;margin-inline:auto}.scoreSystemGrid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:720px){.scoreSystemGrid,.healthGrid{grid-template-columns:1fr}.scoreBox{max-width:100%;padding:18px}.scoreBox .metricRing.lg{width:138px;height:138px}.scoreMiniNote,.scoreTopicBox{font-size:12px}}



.metricRing{
  --ringTone:var(--line-strong);
  position:relative!important;
  display:grid!important;
  place-items:center!important;
  border-radius:50%!important;
  background:transparent!important;
  box-shadow:none!important;
  overflow:hidden!important;
  isolation:isolate!important;
  flex:0 0 auto!important;
  contain:layout paint;
}
.metricSvg{
  position:absolute!important;
  inset:0!important;
  width:100%!important;
  height:100%!important;
  display:block!important;
  transform:rotate(-90deg)!important;
  overflow:hidden!important;
  z-index:1!important;
}
.metricTrackSvg,.metricBarSvg{
  fill:none!important;
  stroke-width:5!important;
  vector-effect:non-scaling-stroke!important;
}
.metricTrackSvg{stroke:color-mix(in srgb,var(--ringTone) 12%,var(--surface-soft))!important;}
.metricBarSvg{
  stroke:var(--ringTone)!important;
  stroke-linecap:round!important;
  filter:none!important;
}
.metricRingInner{
  position:relative!important;
  z-index:2!important;
  width:calc(100% - 18px)!important;
  height:calc(100% - 18px)!important;
  border-radius:50%!important;
  display:flex!important;
  flex-direction:column!important;
  align-items:center!important;
  justify-content:center!important;
  gap:1px!important;
  line-height:1!important;
  text-align:center!important;
  background:linear-gradient(180deg,color-mix(in srgb,var(--surface-solid) 99%,transparent),color-mix(in srgb,var(--surface-soft) 96%,transparent))!important;
  box-shadow:inset 0 0 0 1px var(--line)!important;
  overflow:hidden!important;
}
.metricRingInner strong{display:block!important;margin:0!important;line-height:.95!important;letter-spacing:-.045em!important;text-align:center!important;}
.metricRingInner span{display:block!important;margin:0!important;line-height:1!important;text-align:center!important;}
.metricRing.xs{width:42px!important;height:42px!important;}
.metricRing.sm{width:56px!important;height:56px!important;}
.metricRing.md{width:82px!important;height:82px!important;}
.metricRing.lg{width:156px!important;height:156px!important;}
.metricRing.xs .metricRingInner{width:calc(100% - 16px)!important;height:calc(100% - 16px)!important;}
.metricRing.sm .metricRingInner{width:calc(100% - 18px)!important;height:calc(100% - 18px)!important;}
.metricRing.md .metricRingInner{width:calc(100% - 24px)!important;height:calc(100% - 24px)!important;}
.metricRing.lg .metricRingInner{width:calc(100% - 30px)!important;height:calc(100% - 30px)!important;}
.metricRing.xs .metricRingInner strong{font-size:12.5px!important;}
.metricRing.sm .metricRingInner strong{font-size:16px!important;}
.metricRing.md .metricRingInner strong{font-size:26px!important;}
.metricRing.lg .metricRingInner strong{font-size:40px!important;}
.metricRing.xs .metricRingInner span{font-size:8px!important;}
.metricRing.sm .metricRingInner span{font-size:8.5px!important;}
.metricRing.md .metricRingInner span{font-size:10px!important;}
.metricRing.lg .metricRingInner span{font-size:11.5px!important;}
.prob-low{--ringTone:#64748b;}
.prob-lowmid{--ringTone:#38bdf8;}
.prob-mid{--ringTone:#8b5cf6;}
.prob-high{--ringTone:#2563eb;}
.forecastCard.prob-low,.forecastCard.pct-low{border-color:color-mix(in srgb,#64748b 26%,var(--line))!important;background:linear-gradient(135deg,color-mix(in srgb,#64748b 7%,var(--surface-solid)),color-mix(in srgb,var(--surface-soft) 96%,transparent))!important;}
.forecastCard.prob-lowmid{border-color:color-mix(in srgb,#38bdf8 28%,var(--line))!important;background:linear-gradient(135deg,color-mix(in srgb,#38bdf8 8%,var(--surface-solid)),color-mix(in srgb,var(--surface-soft) 96%,transparent))!important;}
.forecastCard.prob-mid{border-color:color-mix(in srgb,#8b5cf6 28%,var(--line))!important;background:linear-gradient(135deg,color-mix(in srgb,#8b5cf6 8%,var(--surface-solid)),color-mix(in srgb,var(--surface-soft) 96%,transparent))!important;}
.forecastCard.prob-high{border-color:color-mix(in srgb,#2563eb 30%,var(--line))!important;background:linear-gradient(135deg,color-mix(in srgb,#2563eb 9%,var(--surface-solid)),color-mix(in srgb,var(--surface-soft) 96%,transparent))!important;}
.forecastProbWrap{min-width:86px!important;width:86px!important;display:flex!important;align-items:flex-start!important;justify-content:center!important;flex:0 0 86px!important;overflow:visible!important;}
.forecastHead{align-items:flex-start!important;}
.engineNav{align-items:stretch!important;overflow:visible!important;}
.engineCard{
  min-width:0!important;
  overflow:hidden!important;
  contain:layout paint!important;
  display:flex!important;
  flex-direction:column!important;
  justify-content:flex-start!important;
  gap:0!important;
}
.engineCard::after{pointer-events:none!important;opacity:.72!important;inset-block-end:12px!important;inset-inline-end:12px!important;width:58px!important;height:58px!important;}
.engineCard p{min-height:48px!important;max-width:100%!important;margin-bottom:0!important;}
.engineFooter{
  width:100%!important;
  min-width:0!important;
  margin-top:auto!important;
  padding-top:14px!important;
  display:grid!important;
  grid-template-columns:minmax(74px,1fr) 56px!important;
  align-items:center!important;
  gap:10px!important;
  direction:ltr!important;
  overflow:visible!important;
  position:relative!important;
  z-index:2!important;
}
html[dir="rtl"] .engineFooter{direction:rtl!important;grid-template-columns:56px minmax(74px,1fr)!important;}
.engineFooter .metricRing.sm{grid-column:2!important;justify-self:end!important;margin:0!important;}
html[dir="rtl"] .engineFooter .metricRing.sm{grid-column:1!important;justify-self:start!important;}
.engineCount{
  grid-column:1!important;
  min-width:0!important;
  max-width:100%!important;
  width:auto!important;
  justify-content:center!important;
  padding:8px 10px!important;
  overflow:hidden!important;
  white-space:nowrap!important;
}
html[dir="rtl"] .engineCount{grid-column:2!important;}
.engineCount b{line-height:1!important;}
.engineCount small{overflow:hidden!important;text-overflow:ellipsis!important;}
.flowArrow{z-index:4!important;}
html[dir="rtl"] .flowArrow{inset-inline-end:auto!important;inset-inline-start:-14px!important;}
@media(max-width:1120px){
  .engineNav{grid-template-columns:repeat(3,minmax(0,1fr))!important;}
  .flowArrow{display:none!important;}
}
@media(max-width:760px){
  .engineNav{grid-template-columns:1fr!important;}
  .forecastHead{display:grid!important;grid-template-columns:1fr auto!important;}
  .forecastProbWrap{width:76px!important;min-width:76px!important;flex-basis:76px!important;}
  .metricRing.md{width:74px!important;height:74px!important;}
  .engineFooter{grid-template-columns:minmax(74px,1fr) 56px!important;}
  html[dir="rtl"] .engineFooter{grid-template-columns:56px minmax(74px,1fr)!important;}
}

/* Mascot welcome card RTL/LTR layout */
.welcomeCard{
  display:grid !important;
  grid-template-columns:128px minmax(0,1fr) !important;
  grid-template-areas:"mascot text" !important;
  gap:22px !important;
  align-items:center !important;
  min-height:176px !important;
  padding:24px 28px !important;
  overflow:hidden !important;
}
.welcomeMascot{
  grid-area:mascot !important;
  width:118px !important;
  height:118px !important;
  border-radius:28px !important;
  object-fit:cover !important;
  justify-self:center !important;
}
.welcomeText{
  grid-area:text !important;
  width:100% !important;
  max-width:780px !important;
  min-width:0 !important;
  justify-self:start !important;
  text-align:start !important;
}
.welcomeEyebrow{
  line-height:1.2 !important;
  margin-bottom:6px !important;
  white-space:normal !important;
}
.welcomeTitle{
  font-size:clamp(22px,2.2vw,30px) !important;
  line-height:1.12 !important;
  max-width:680px !important;
  text-wrap:balance !important;
}
.welcomeBody{
  font-size:15px !important;
  line-height:1.7 !important;
  max-width:720px !important;
  white-space:normal !important;
  overflow-wrap:normal !important;
}
html[dir="rtl"] .welcomeCard{
  grid-template-columns:minmax(0,1fr) 128px !important;
  grid-template-areas:"text mascot" !important;
}
html[dir="rtl"] .welcomeText{
  justify-self:end !important;
  text-align:right !important;
}
html[dir="rtl"] .welcomeBody,
html[dir="rtl"] .welcomeTitle,
html[dir="rtl"] .welcomeEyebrow{
  direction:rtl !important;
  unicode-bidi:plaintext !important;
}
@media (max-width:760px){
  .welcomeCard,
  html[dir="rtl"] .welcomeCard{
    grid-template-columns:1fr !important;
    grid-template-areas:"mascot" "text" !important;
    text-align:center !important;
    padding:22px 18px !important;
  }
  .welcomeText,
  html[dir="rtl"] .welcomeText{
    justify-self:center !important;
    text-align:center !important;
  }
  .welcomeMascot{
    width:112px !important;
    height:112px !important;
  }
}

</style></head><body><main class="shell" data-analysis-lens="${escapeHtml(reportLens)}" data-app-version="${escapeHtml(reportVersion)}"><section class="hero"><div class="heroGrid"><div><h1>${escapeHtml(a.subject.title || exportContract.title)}</h1><p>${escapeHtml(exportContract.title)}</p><p>${escapeHtml(t("reportSubtitle"))}</p><p>${escapeHtml(a.subject.context || a.subject.question || "")}</p></div><div class="overall">${reportRing(b.overall)}<strong>${escapeHtml(t("overallScore"))}</strong></div></div></section>${exportContractHtml}${formulaHtml}<section class="grid">${metricHtml}</section><section class="block"><h2>${escapeHtml(t("thesis"))}</h2><p>${escapeHtml(a.subject.executive_thesis || "—")}</p><p class="muted"><b>${escapeHtml(t("nextBestAction"))}:</b> ${escapeHtml(h.next)}</p></section>${pillarsHtml}<section class="block"><h2>${escapeHtml(t("contradictions"))}</h2>${contradictions}</section><section class="block"><h2>${escapeHtml(t("scenarios"))}</h2>${scenarios}</section><section class="evidenceTable"><h2>${escapeHtml(t("evidence"))}</h2><table><thead><tr><th>${escapeHtml(t("claim"))}</th><th>${escapeHtml(t("basis"))}</th><th>${escapeHtml(t("confidence"))}</th><th>${escapeHtml(t("sourceNote"))}</th></tr></thead><tbody>${evidence}</tbody></table></section><section class="block"><h2>${escapeHtml(t("assumption"))}</h2>${assumptions}</section></main></body></html>`;
}

function buildLosslessStrategicReport() {
  const analysis = state.analysis;
  const reportLang = ["ar", "en", "fr"].includes(analysis?.language)
    ? analysis.language
    : "en";
  const previousLang = state.lang;
  state.lang = reportLang;
  try {
    const report = htmlReport();
    const scriptJson = JSON.stringify(analysis).replaceAll("<", "\\u003c");
    return report.replace(
      "</main></body></html>",
      `</main><script type="application/json" id="canonical-analysis">${scriptJson}</script></body></html>`,
    );
  } finally {
    state.lang = previousLang;
  }
}

let inspectionIndexCache = { analysis: null, lang: "", indexes: new Map() };
function currentResultsInspectionIndex(lens = state.analysis?.analysis_lens || "strategic") {
  if (
    inspectionIndexCache.analysis !== state.analysis
    || inspectionIndexCache.lang !== state.lang
  ) {
    inspectionIndexCache = { analysis: state.analysis, lang: state.lang, indexes: new Map() };
  }
  if (inspectionIndexCache.indexes.has(lens)) {
    return inspectionIndexCache.indexes.get(lens);
  }
  const provenance = PROVENANCE.assessEvidenceProvenance(state.analysis, { lens });
  const index = createResultsInspectionIndex({
    lens,
    analysis: state.analysis,
    graph: lens === "biopolitical" ? currentBiopoliticalGraph() : null,
    provenance,
    lang: state.lang,
  });
  inspectionIndexCache.indexes.set(lens, index);
  return index;
}
function inspectionCopy() {
  return {
    title: labelText("Inspection directory", "دليل الفحص", "Répertoire d’inspection"),
    intro: labelText(
      "Open a canonical record to inspect provenance, confidence, evidence balance, linked records, audit details, and every indexed occurrence.",
      "افتح سجلًا نظاميًا لفحص المصدر والثقة وتوازن الأدلة والسجلات المرتبطة وتفاصيل التدقيق وكل موضع ظهور مفهرس.",
      "Ouvrez une fiche canonique pour examiner la provenance, la confiance, l’équilibre des preuves, les fiches liées, l’audit et chaque occurrence indexée.",
    ),
    records: labelText("Canonical records", "السجلات النظامية", "Fiches canoniques"),
    occurrences: labelText("Indexed occurrences", "مواضع الظهور المفهرسة", "Occurrences indexées"),
    concerns: labelText("Audit concerns", "ملاحظات التدقيق", "Points d’audit"),
    search: labelText("Search records", "ابحث في السجلات", "Rechercher des fiches"),
    searchHint: labelText(
      "Search by human name, canonical ID, type, or pillar",
      "ابحث بالاسم أو المعرّف النظامي أو النوع أو المحور",
      "Rechercher par nom, identifiant canonique, type ou pilier",
    ),
    empty: labelText(
      "No canonical identifiers were authored for this analysis. Inspection never invents identifiers.",
      "لم تُؤلف معرّفات نظامية لهذا التحليل. لا ينشئ الفحص معرّفات من تلقاء نفسه.",
      "Aucun identifiant canonique n’a été rédigé pour cette analyse. L’inspection n’en invente jamais.",
    ),
    noMatch: labelText("No records match this search.", "لا توجد سجلات تطابق البحث.", "Aucune fiche ne correspond à cette recherche."),
    open: labelText("Inspect record", "افحص السجل", "Inspecter la fiche"),
  };
}
function renderInspectionDirectory(index) {
  const copy = inspectionCopy();
  const concerns = index.nodes.filter((node) => {
    const inspection = index.inspect(node.id);
    return inspection?.provenance?.sourceStatus === "missing"
      || inspection?.provenance?.claimStatus === "mismatched";
  }).length + (index.diagnostics?.unresolved?.length || 0);
  const cards = index.nodes.length
    ? index.nodes.map((node) => {
        const inspection = index.inspect(node.id);
        const search = [node.label, node.id, index.typeLabel(node.type), node.pillar]
          .join(" ")
          .toLocaleLowerCase(state.lang);
        return `<li class="inspectionDirectoryItem" data-inspection-directory-item data-inspection-search="${escapeHtml(search)}"><button type="button" data-reference-id="${escapeHtml(node.id)}" aria-label="${escapeHtml(`${copy.open}: ${node.label}`)}"><span class="inspectionDirectoryType">${escapeHtml(index.typeLabel(node.type))}</span><strong>${escapeHtml(node.label)}</strong><span class="inspectionDirectoryMeta"><code>${escapeHtml(node.id)}</code><span>${escapeHtml(String(node.pillar || "").replaceAll("_", " "))}</span>${inspection?.confidence ? `<span>${escapeHtml(inspection.confidence)}</span>` : ""}</span></button></li>`;
      }).join("")
    : `<li class="inspectionDirectoryEmpty">${escapeHtml(copy.empty)}</li>`;
  return `<section class="inspectionDirectory" data-results-inspection data-analysis-lens="${escapeHtml(index.lens)}" aria-labelledby="inspectionDirectoryTitle"><header class="inspectionDirectoryHeader"><div><div class="sectionKicker">${escapeHtml(t("nav").inspection)}</div><h3 id="inspectionDirectoryTitle">${escapeHtml(copy.title)}</h3><p>${escapeHtml(copy.intro)}</p></div><div class="inspectionDirectoryMetrics"><div><strong>${index.nodes.length}</strong><span>${escapeHtml(copy.records)}</span></div><div><strong>${index.occurrenceCount}</strong><span>${escapeHtml(copy.occurrences)}</span></div><div class="${concerns ? "concern" : "clear"}"><strong>${concerns}</strong><span>${escapeHtml(copy.concerns)}</span></div></div></header><div class="inspectionSearch"><label for="inspectionSearch">${escapeHtml(copy.search)}</label><input id="inspectionSearch" type="search" autocomplete="off" placeholder="${escapeHtml(copy.searchHint)}" aria-controls="inspectionDirectoryList"><span id="inspectionSearchStatus" class="srOnly" role="status" aria-live="polite"></span></div><ul class="inspectionDirectoryList" id="inspectionDirectoryList">${cards}</ul><p class="inspectionDirectoryNoMatch" id="inspectionDirectoryNoMatch" hidden>${escapeHtml(copy.noMatch)}</p></section>`;
}
function wireInspectionDirectory() {
  const input = $("inspectionSearch");
  if (!input) return;
  const items = [...document.querySelectorAll("[data-inspection-directory-item]")];
  const noMatch = $("inspectionDirectoryNoMatch");
  const status = $("inspectionSearchStatus");
  input.oninput = () => {
    const query = input.value.trim().toLocaleLowerCase(state.lang);
    let visible = 0;
    items.forEach((item) => {
      const match = !query || item.dataset.inspectionSearch.includes(query);
      item.hidden = !match;
      if (match) visible += 1;
    });
    if (noMatch) noMatch.hidden = visible > 0 || !items.length;
    if (status) status.textContent = `${visible} / ${items.length}`;
  };
}
function focusInspectionRecord(node, fallbackSelector) {
  requestAnimationFrame(() => {
    const target = document.querySelector(
      `[data-inspection-id="${CSS.escape(node.id)}"]`,
    ) || document.querySelector(fallbackSelector) || $("reviewContent");
    target?.scrollIntoView({ behavior: "auto", block: "center" });
    target?.focus?.({ preventScroll: true });
  });
}
function openStrategicInspectionRecord(node) {
  const reviewByType = {
    contradiction: "contradictions",
    scenario: "scenarios",
    evidence: "evidence",
    assumption: "evidence",
  };
  state.activeReview = reviewByType[node.type] || "pillars";
  state.activePillar = PILLARS.includes(node.pillar) ? node.pillar : null;
  renderReview();
  focusInspectionRecord(node, `[data-review="${CSS.escape(state.activeReview)}"]`);
}
function openInspectionOccurrence(lens, node, occurrence) {
  const index = currentResultsInspectionIndex(lens);
  const owner = index.resolve(occurrence.ownerId) || node;
  if (lens === "biopolitical") openBiopoliticalRecord(owner);
  else openStrategicInspectionRecord(owner);
}
function bindResultsInspection(lens) {
  const index = currentResultsInspectionIndex(lens);
  REFERENCE_UI.bind(index, {
    lang: state.lang,
    onOpenRecord: lens === "biopolitical" ? openBiopoliticalRecord : openStrategicInspectionRecord,
    onShowInMap: lens === "biopolitical" ? showBiopoliticalNodeInMap : null,
    onOpenOccurrence: (node, occurrence) => openInspectionOccurrence(lens, node, occurrence),
  });
  wireInspectionDirectory();
  return index;
}

function currentBiopoliticalGraph(lang = state.lang) {
  return BIO_GRAPH.build(state.analysis, lang);
}
function namedBioText(value, graph = currentBiopoliticalGraph()) {
  return REFERENCE_UI.renderText(value, graph);
}
function openBiopoliticalRecord(node) {
  state.activePillar = node.pillar;
  state.activeReview =
    node.pillar === "evidence_explanations" ? "evidence" : "pillars";
  renderBiopoliticalReview();
  focusInspectionRecord(node, `[data-reference-id="${CSS.escape(node.id)}"]`);
}
function showBiopoliticalNodeInMap(node) {
  state.activeReview = "connections";
  renderBiopoliticalReview();
  RELATIONSHIP_EXPLORER.focusNode(node.id);
}
function bioRecordHtml(item) {
  const graph = currentBiopoliticalGraph();
  const meta = arr(item.meta)
    .map((value) => pill(value))
    .join("");
  const details = arr(item.details)
    .map(
      (detail) =>
        `<div class="bioDetail"><span>${escapeHtml(detail.label)}</span><p>${namedBioText(detail.value, graph)}</p></div>`,
    )
    .join("");
  const lists = arr(item.lists)
    .map(
      (group) =>
        `<div class="bioList"><b>${escapeHtml(group.label)}</b><ul>${arr(
          group.items,
        )
          .map((value) => `<li>${namedBioText(value, graph)}</li>`)
          .join("")}</ul></div>`,
    )
    .join("");
  return `<article class="item bioRecord"><div class="bioRecordHead"><div class="itemTitle">${namedBioText(item.title || "—", graph)}</div><div class="itemMeta">${meta}</div></div>${item.summary ? `<div class="itemText">${namedBioText(item.summary, graph)}</div>` : ""}${details ? `<div class="bioDetailGrid">${details}</div>` : ""}${lists ? `<div class="bioListGrid">${lists}</div>` : ""}</article>`;
}
function bioRecordsHtml(records) {
  return records.length
    ? records.map(bioRecordHtml).join("")
    : `<div class="empty"><strong>${escapeHtml(BIO.ui(state.lang, "noRecords"))}</strong></div>`;
}
function bioGateHtml(a) {
  const scores = BIO.scores(a);
  const health = BIO.health(a, state.lang);
  const ready = health.publishable;
  const review =
    a.contract_status === "canonical" && scores.structural >= 70;
  const status = ready
    ? t("publishReady")
    : review
      ? t("reviewNeeded")
      : t("doNotPublish");
  const cls = ready ? "pct-excellent" : review ? "pct-mid" : "pct-low";
  const tone = ready
    ? "var(--success)"
    : review
      ? "var(--warn)"
      : "var(--danger)";
  const summary = ready
    ? labelText(
        "The analysis satisfies the canonical, semantic, and evidence-verification gates.",
        "يستوفي التحليل بوابات العقد النظامي والنزاهة الدلالية والتحقق من الأدلة.",
        "L’analyse satisfait les contrôles canonique, sémantique et de vérification des preuves.",
      )
    : review
      ? labelText(
          "The analysis is usable for review but is not publication-ready; it requires targeted epistemic repair.",
          "التحليل قابل للاستخدام في المراجعة لكنه غير جاهز للنشر؛ ويحتاج إلى إصلاح إبستيمي موجّه.",
          "L’analyse est utilisable pour la révision mais n’est pas prête à être publiée ; elle exige une correction épistémique ciblée.",
        )
      : labelText(
          "This analysis is not publication-ready; resolve the contract and evidence blockers first.",
          "هذا التحليل غير جاهز للنشر؛ عالج عوائق العقد والأدلة أولًا.",
          "Cette analyse n’est pas publiable ; corrigez d’abord les blocages contractuels et probatoires.",
        );
  return `<div class="qualityGate ${cls}" style="--gateTone:${tone}"><h4>${escapeHtml(t("qualityGate"))}: ${escapeHtml(status)}</h4><p>${escapeHtml(summary)}</p>${
    health.missing.length
      ? `<ul>${health.missing
          .slice(0, 4)
          .map((value) => `<li>${escapeHtml(value)}</li>`)
          .join("")}</ul>`
      : ""
  }</div>`;
}
function renderBiopoliticalEngineNav() {
  const labels = t("pillars");
  const counts = state.analysis
    ? BIO.PILLARS.map((pillar) => BIO.pillarCount(state.analysis, pillar.key))
    : BIO.PILLARS.map(() => 0);
  const max = Math.max(1, ...counts);
  const arrow = state.lang === "ar" ? "←" : "→";
  $("engineNav").innerHTML = BIO.PILLARS.map((pillar, index) => {
    const detail = labels[pillar.key];
    const count = counts[index];
    const depth = Math.round((count / max) * 100);
    return `<button class="engineCard ${state.activePillar === pillar.key ? "active" : ""}${count ? " filled" : ""} ${pctClass(depth)}" style="--pc:${pillar.color}" data-bio-pillar="${pillar.key}" type="button"><div class="eyebrow">${String(index + 1).padStart(2, "0")}</div><div class="engineHeading"><span class="engineDot" aria-hidden="true"></span><h4>${escapeHtml(detail[0])}</h4></div><p>${escapeHtml(detail[1])}</p><div class="engineFooter"><span class="engineCount"><b>${count}</b><small>${itemsWord()}</small></span>${ringMetric(depth, "sm")}</div><span class="flowArrow" aria-hidden="true">${arrow}</span></button>`;
  }).join("");
  document.querySelectorAll("[data-bio-pillar]").forEach(
    (button) =>
      (button.onclick = () => {
        state.activePillar = button.dataset.bioPillar;
        if (state.analysis) {
          state.activeReview = "pillars";
          renderBiopoliticalReview();
          document
            .getElementById("reviewPanel")
            .scrollIntoView({ behavior: "auto", block: "nearest" });
        }
        renderBiopoliticalEngineNav();
      }),
  );
  $("analysisStateChip").textContent = state.analysis
    ? t("stateImported")
    : t("stateNoAnalysis");
}
function renderBiopoliticalOverview() {
  const a = state.analysis;
  const scores = BIO.scores(a);
  const health = BIO.health(a, state.lang);
  const labels = BIO.ui(state.lang, "scoreLabels");
  const hints = BIO.ui(state.lang, "scoreHints");
  const metrics = [
    "scope",
    "mechanism",
    "evidence",
    "distribution",
    "pluralism",
    "agency",
  ]
    .map((key) => metricCard(key, labels[key], scores[key], hints[key]))
    .join("");
  const migration = a.migration
    ? `<div class="bioMigration"><strong>${escapeHtml(BIO.ui(state.lang, "migration"))}</strong><p>${escapeHtml(arr(a.migration.warnings).join(" · "))}</p></div>`
    : "";
  const missing = health.missing.length
    ? health.missing
        .map((value) => `<div class="warning">${escapeHtml(value)}</div>`)
        .join("")
    : `<div class="warning good">${escapeHtml(health.next)}</div>`;
  const gateLabel = health.publishable
    ? labelText("Approved", "معتمد", "Approuvé")
    : labelText("Blocked", "محظور", "Bloqué");
  const authoredUncertainty = arr(a.calibrated_conclusion?.unknown)[0]
    || arr(a.evidence?.items).find((item) => String(item.uncertainty || "").trim())?.uncertainty;
  const orientation = createResultsOrientation({
    lens: "biopolitical",
    topic: a.subject.title || state.topic,
    conclusion: a.subject.executive_finding || a.subject.research_question || a.subject.title,
    publicationApproved: health.publishable,
    publicationLabel: gateLabel,
    readiness: scores.overall,
    coverage: scores.analyticalCoverage,
    uncertainty: authoredUncertainty || health.missing[0] || labelText("No principal uncertainty was authored.", "لم يُذكر عدم يقين رئيسي.", "Aucune incertitude principale n’a été formulée."),
    nextAction: health.next,
  });
  return `<h3>${escapeHtml(t("overview"))}</h3>${migration}${resultsOrientationHtml(orientation, biopoliticalResultsExplanation(a))}<div class="summaryGrid"><div class="intelBrief">${bioGateHtml(a)}<div class="briefHero"><div class="itemTitle">${escapeHtml(BIO.ui(state.lang, "conclusion"))}</div><div class="itemText">${escapeHtml(a.subject.executive_finding || a.subject.research_question || a.subject.title || "—")}</div></div><div class="scoreSystemGrid">${metrics}</div><div class="scoreFormulaCard"><h4>${escapeHtml(labelText("Decision-readiness rule", "قاعدة جاهزية القرار", "Règle de préparation à la décision"))}</h4><p>${escapeHtml(BIO.ui(state.lang, "formula"))}</p></div><div class="healthGrid"><div class="healthCard ${pctClass(health.pct)}"><div class="healthCardValue">${health.pct}%</div><span>${escapeHtml(labelText("Structural completion", "اكتمال البنية", "Complétude structurelle"))}</span></div><div class="healthCard ${pctClass(scores.provenance.sourceTraceability)}"><div class="healthCardValue">${scores.provenance.sourceTraceability}%</div><span>${escapeHtml(labelText("Source traceability", "قابلية تتبع المصادر", "Traçabilité des sources"))}</span></div><div class="healthCard ${pctClass(scores.provenance.humanReview)}"><div class="healthCardValue">${scores.provenance.humanReview}%</div><span>${escapeHtml(labelText("Independent human review", "المراجعة البشرية المستقلة", "Revue humaine indépendante"))}</span></div><div class="healthCard ${health.missing.length ? "pct-warn" : "pct-good"}"><div class="healthCardValue">${health.missing.length}</div><span>${escapeHtml(t("missingItems"))}</span></div></div><div class="nextAction"><strong>${escapeHtml(t("nextBestAction"))}:</strong> ${escapeHtml(health.next)}</div><div class="list">${missing}</div></div><aside class="scoreBox ${health.publishable ? "pct-excellent" : "pct-low"}"><div class="sectionKicker">${escapeHtml(t("qualityGate"))}</div><div class="publicationState ${health.publishable ? "approved" : "blocked"}">${escapeHtml(gateLabel)}</div><div class="decisionMetric"><strong>${scores.overall}%</strong><span>${escapeHtml(t("scoreSystem"))}</span></div><div class="decisionMetric"><strong>${scores.analyticalCoverage}%</strong><span>${escapeHtml(labelText("Analytical coverage", "التغطية التحليلية", "Couverture analytique"))}</span></div><div class="scoreHelp">${escapeHtml(t("scoreGuide"))}</div><div class="scoreTopicBox"><span>${escapeHtml(t("topic"))}</span><strong>${escapeHtml(a.subject.title || state.topic || "—")}</strong></div></aside></div>`;
}
function renderBiopoliticalPillars() {
  const labels = t("pillars");
  return `<h3>${escapeHtml(t("engine"))}</h3><div class="layerStack bioLayerStack">${BIO.PILLARS.map(
    (pillar, index) => {
      const records = BIO.recordsFor(pillar.key, state.analysis, state.lang);
      const open = state.activePillar === pillar.key;
      return `<section class="accordion ${open ? "open" : ""}" style="--pc:${pillar.color}"><button id="bio-acc-head-${pillar.key}" class="accHead" data-bio-acc="${pillar.key}" type="button" aria-expanded="${open ? "true" : "false"}" aria-controls="bio-acc-panel-${pillar.key}"><span class="accLead"><span class="accNumber">${String(index + 1).padStart(2, "0")}</span><span><strong>${escapeHtml(labels[pillar.key][0])}</strong><small class="muted">${escapeHtml(labels[pillar.key][1])}</small></span></span><span class="accMeta"><span class="countBadge"><b>${records.length}</b> ${itemsWord()}</span>${ringMetric(Math.min(100, records.length * 24), "xs")}</span></button><div id="bio-acc-panel-${pillar.key}" class="accBody" role="region" aria-labelledby="bio-acc-head-${pillar.key}"${open ? "" : " hidden"}>${bioRecordsHtml(records)}</div></section>`;
    },
  ).join("")}</div>`;
}
function renderBiopoliticalEvidence() {
  const records = BIO.recordsFor(
    "evidence_explanations",
    state.analysis,
    state.lang,
  );
  return `<h3>${escapeHtml(BIO.ui(state.lang, "pillars.evidence_explanations.0"))}</h3><div class="bioEvidenceIntro">${escapeHtml(BIO.ui(state.lang, "pillars.evidence_explanations.1"))}</div><div class="bioRecordStack">${bioRecordsHtml(records)}</div>`;
}
function renderBiopoliticalConnections() {
  return `<div id="relationshipExplorerMount"></div>`;
}
function renderBiopoliticalConclusion() {
  const a = state.analysis;
  const groups = BIO.conclusionRecords(a, state.lang);
  const conclusion = groups
    .map(
      (group) =>
        `<section class="bioConclusionGroup"><h4>${escapeHtml(group.label)}</h4>${
          arr(group.items).length
            ? `<ul>${arr(group.items)
                .map((value) => `<li>${escapeHtml(value)}</li>`)
                .join("")}</ul>`
            : `<p class="muted">${escapeHtml(t("noItems"))}</p>`
        }</section>`,
    )
    .join("");
  const audit = BIO.SELF_AUDIT_KEYS.map((key) => {
    const status = a.self_audit[key] || "concern";
    return `<div class="bioAuditItem ${status === "concern" ? "concern" : "pass"}"><span>${escapeHtml(BIO.auditLabel(state.lang, key))}</span><b>${escapeHtml(BIO.displayToken(state.lang, status))}</b></div>`;
  }).join("");
  return `<h3>${escapeHtml(BIO.ui(state.lang, "conclusion"))}</h3><div class="bioConclusionGrid">${conclusion}</div><h3 class="bioSubheading">${escapeHtml(BIO.ui(state.lang, "selfAudit"))}</h3><div class="bioAuditGrid">${audit}</div>${a.self_audit_notes.length ? `<div class="bioAuditNotes">${a.self_audit_notes.map((value) => `<p>${escapeHtml(value)}</p>`).join("")}</div>` : ""}`;
}
function renderBiopoliticalReviewNav() {
  const connectionLabel = labelText("Connections", "العلاقات", "Connexions");
  const connectionHint = labelText(
    "Trace claims, evidence, and structural links",
    "تتبّع الادعاءات والأدلة والروابط البنيوية",
    "Tracer les énoncés, les preuves et les liens structurels",
  );
  const counts = {
    overview: "",
    pillars: BIO.PILLARS.reduce(
      (sum, pillar) => sum + BIO.pillarCount(state.analysis, pillar.key),
      0,
    ),
    connections: currentBiopoliticalGraph().edges.length,
    evidence:
      state.analysis.evidence.items.length +
      state.analysis.competing_explanations.length,
    conclusion: BIO.conclusionRecords(state.analysis, state.lang).reduce(
      (sum, group) => sum + group.items.length,
      0,
    ),
    inspection: currentResultsInspectionIndex("biopolitical").nodes.length,
    exports: "",
  };
  const items = [
    "overview",
    "pillars",
    "connections",
    "evidence",
    "conclusion",
    "inspection",
    "exports",
  ];
  const tones = {
    overview: "var(--accent)",
    pillars: "var(--p4)",
    connections: "var(--accent-3)",
    evidence: "var(--success)",
    conclusion: "var(--warn)",
    inspection: "var(--accent-2)",
    exports: "var(--p5)",
  };
  const labels = t("nav");
  const hints = t("navHints");
  $("reviewNav").innerHTML = items
    .map(
      (key) =>
        `<button id="bio-review-tab-${key}" class="navBtn ${state.activeReview === key ? "active" : ""}" data-bio-review="${key}" style="--navTone:${tones[key]}" type="button" role="tab" aria-controls="reviewContent" aria-selected="${state.activeReview === key ? "true" : "false"}" tabindex="${state.activeReview === key ? "0" : "-1"}"><span class="navGlyph" aria-hidden="true"></span><span class="navText"><span class="navTitle">${escapeHtml(key === "connections" ? connectionLabel : labels[key])}</span><span class="navHint">${escapeHtml(key === "connections" ? connectionHint : hints[key] || "")}</span></span>${counts[key] !== "" ? `<span class="badge">${counts[key]}</span>` : ""}</button>`,
    )
    .join("");
  wireReviewTabs(
    "[data-bio-review]",
    "bioReview",
    renderBiopoliticalReview,
  );
}

function wireReviewTabs(selector, datasetKey, render) {
  const buttons = [...document.querySelectorAll(selector)];
  const activate = (button, moveFocus = false) => {
    const key = button?.dataset?.[datasetKey];
    if (!key) return;
    state.activeReview = key;
    render();
    if (moveFocus) {
      document
        .querySelector(`${selector}[data-${datasetKey.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}="${key}"]`)
        ?.focus();
    }
  };
  buttons.forEach((button, index) => {
    button.onclick = () => activate(button);
    button.onkeydown = (event) => {
      let target = null;
      if (["ArrowDown", "ArrowRight"].includes(event.key)) {
        target = buttons[(index + 1) % buttons.length];
      } else if (["ArrowUp", "ArrowLeft"].includes(event.key)) {
        target = buttons[(index - 1 + buttons.length) % buttons.length];
      } else if (event.key === "Home") {
        target = buttons[0];
      } else if (event.key === "End") {
        target = buttons[buttons.length - 1];
      }
      if (target) {
        event.preventDefault();
        activate(target, true);
      }
    };
  });
}
function renderBiopoliticalReview() {
  if (!state.analysis || state.analysis.analysis_lens !== "biopolitical") {
    $("reviewPanel").classList.add("hide");
    return;
  }
  const valid = [
    "overview",
    "pillars",
    "connections",
    "evidence",
    "conclusion",
    "inspection",
    "exports",
  ];
  if (!valid.includes(state.activeReview)) state.activeReview = "overview";
  $("reviewPanel").classList.remove("hide");
  renderBiopoliticalReviewNav();
  let html = "";
  if (state.activeReview === "overview") html = renderBiopoliticalOverview();
  if (state.activeReview === "pillars") html = renderBiopoliticalPillars();
  if (state.activeReview === "connections")
    html = renderBiopoliticalConnections();
  if (state.activeReview === "evidence") html = renderBiopoliticalEvidence();
  if (state.activeReview === "conclusion")
    html = renderBiopoliticalConclusion();
  if (state.activeReview === "inspection")
    html = renderInspectionDirectory(currentResultsInspectionIndex("biopolitical"));
  if (state.activeReview === "exports") html = renderExports();
  if (state.activeReview !== "connections") RELATIONSHIP_EXPLORER.deactivate?.();
  $("reviewContent").innerHTML = html;
  $("reviewContent").setAttribute(
    "aria-labelledby",
    `bio-review-tab-${state.activeReview}`,
  );
  wireResultsExplanation("biopolitical");
  bindResultsInspection("biopolitical");
  if (state.activeReview === "connections") {
    RELATIONSHIP_EXPLORER.mount(
      $("relationshipExplorerMount"),
      currentBiopoliticalGraph(),
      {
        lang: state.lang,
        analysis: state.analysis,
        analysisScope: state.analysis?.analysis_id || state.analysis?.subject?.title,
        mobileDefault: window.matchMedia("(max-width: 760px)").matches,
        onOpenNode: (node, trigger) => REFERENCE_UI.open(node.id, trigger),
      },
    );
  }
  document.querySelectorAll("[data-bio-acc]").forEach(
    (button) =>
      (button.onclick = () => {
        const box = button.closest(".accordion");
        box.classList.toggle("open");
        const open = box.classList.contains("open");
        button.setAttribute("aria-expanded", open ? "true" : "false");
        const panel = document.getElementById(
          `bio-acc-panel-${button.dataset.bioAcc}`,
        );
        if (panel) panel.hidden = !open;
        state.activePillar = open ? button.dataset.bioAcc : null;
        renderBiopoliticalEngineNav();
      }),
  );
  const exportButton = $("exportHtml");
  if (exportButton)
    exportButton.onclick = () =>
      download(
        `${safeFileSlug(state.analysis?.subject?.title || state.topic)}-biopolitical-v2-report.html`,
        buildLosslessBiopoliticalReport(),
        "text/html",
      );
  const jsonButton = $("exportJson");
  if (jsonButton)
    jsonButton.onclick = () =>
      download(
        `${safeFileSlug(state.analysis?.subject?.title || state.topic)}-biopolitical-v2-canonical.json`,
        `${JSON.stringify(state.analysis, null, 2)}\n`,
        "application/json",
      );
}
function buildLosslessBiopoliticalReport() {
  const analysis = state.analysis;
  const reportLang = ["ar", "en", "fr"].includes(analysis?.language)
    ? analysis.language
    : "en";
  const version =
    document.querySelector('meta[name="app-version"]')?.content ||
    "2.1.0-alpha.28";
  return BIO_REPORT.build({
    analysis,
    lang: reportLang,
    version,
    bio: BIO,
    graphApi: BIO_GRAPH,
  });
}
function renderExports() {
  const d = {
    ar: "تقرير HTML مستقل للمراجعة البشرية، وملف JSON نظامي يحفظ العقد كاملًا دون فقد أي حقل.",
    en: "A standalone HTML report for human review plus canonical JSON that preserves the complete contract without field loss.",
    fr: "Un rapport HTML autonome pour la revue humaine et un JSON canonique qui préserve l’intégralité du contrat sans perte de champ.",
  };
  const canonicalInspector = state.analysis
    ? `<details class="canonicalInspector"><summary>${escapeHtml(labelText("Inspect the complete canonical contract", "افحص العقد النظامي الكامل", "Inspecter le contrat canonique complet"))}</summary><pre tabindex="0" dir="ltr">${escapeHtml(JSON.stringify(state.analysis, null, 2))}</pre></details>`
    : "";
  return `<h3>${t("exports")}</h3><div class="exportGrid"><div class="exportCard exportWide"><h4>${t("downloadHtml")}</h4><p>${d[state.lang] || d.en}</p><button class="btn primary" id="exportHtml" type="button">${t("downloadHtml")}</button></div><div class="exportCard"><h4>${t("downloadJson")}</h4><p>${escapeHtml(labelText("Lossless machine-readable analysis for verification, re-import, and archival.", "تحليل آلي كامل للتحقق وإعادة الاستيراد والأرشفة.", "Analyse lisible par machine, sans perte, pour vérification, réimport et archivage."))}</p><button class="btn" id="exportJson" type="button">${t("downloadJson")}</button></div></div>${canonicalInspector}`;
}
function renderReviewNav() {
  const counts = {
    overview: "",
    pillars: PILLARS.reduce((n, p) => n + countFor(p), 0),
    contradictions: state.analysis.contradictions.items.length,
    scenarios: state.analysis.scenarios.items.length,
    evidence:
      normalizeArray(state.analysis.evidence.items).length +
      normalizeArray(state.analysis.assumptions.items).length,
    inspection: currentResultsInspectionIndex("strategic").nodes.length,
    exports: "",
  };
  const items = [
    "overview",
    "pillars",
    "contradictions",
    "scenarios",
    "evidence",
    "inspection",
    "exports",
  ];
  const tones = {
    overview: "var(--accent)",
    pillars: "var(--p4)",
    contradictions: "var(--warn)",
    scenarios: "var(--accent-3)",
    evidence: "var(--success)",
    inspection: "var(--accent-2)",
    exports: "var(--p5)",
  };
  $("reviewNav").innerHTML = items
    .map(
      (k) =>
        `<button id="review-tab-${k}" class="navBtn ${state.activeReview === k ? "active" : ""}" data-review="${k}" style="--navTone:${tones[k]}" type="button" role="tab" aria-controls="reviewContent" aria-selected="${state.activeReview === k ? "true" : "false"}" tabindex="${state.activeReview === k ? "0" : "-1"}"><span class="navGlyph" aria-hidden="true"></span><span class="navText"><span class="navTitle">${t("nav")[k]}</span><span class="navHint">${t("navHints")?.[k] || ""}</span></span>${counts[k] !== "" ? `<span class="badge">${counts[k]}</span>` : ""}</button>`,
    )
    .join("");
  wireReviewTabs("[data-review]", "review", renderReview);
}
function renderReview() {
  if (!state.analysis) {
    $("reviewPanel").classList.add("hide");
    return;
  }
  const validTabs = [
    "overview",
    "pillars",
    "contradictions",
    "scenarios",
    "evidence",
    "inspection",
    "exports",
  ];
  if (!validTabs.includes(state.activeReview)) state.activeReview = "overview";
  $("reviewPanel").classList.remove("hide");
  renderReviewNav();
  let html = "";
  if (state.activeReview === "overview") html = renderOverview();
  if (state.activeReview === "pillars") html = renderPillars();
  if (state.activeReview === "contradictions") html = renderContradictions();
  if (state.activeReview === "scenarios") html = renderScenarios();
  if (state.activeReview === "evidence") html = renderEvidence();
  if (state.activeReview === "inspection")
    html = renderInspectionDirectory(currentResultsInspectionIndex("strategic"));
  if (state.activeReview === "exports") html = renderExports();
  if (!html) {
    state.activeReview = "overview";
    html = renderOverview();
  }
  const reviewContent = $("reviewContent");
  if (reviewContent) {
    reviewContent.innerHTML = html;
    reviewContent.setAttribute(
      "aria-labelledby",
      `review-tab-${state.activeReview}`,
    );
  }
  wireResultsExplanation("strategic");
  bindResultsInspection("strategic");
  document.querySelectorAll("[data-acc]").forEach(
    (b) =>
      (b.onclick = () => {
        const box = b.closest(".accordion");
        box.classList.toggle("open");
        const open = box.classList.contains("open");
        b.setAttribute("aria-expanded", open ? "true" : "false");
        const panel = document.getElementById(`acc-panel-${b.dataset.acc}`);
        if (panel) panel.hidden = !open;
        state.activePillar = open ? b.dataset.acc : null;
        renderEngineNav();
      }),
  );
  const eh = $("exportHtml");
  if (eh) {
    eh.onclick = () =>
      download(
        `${safeFileSlug(state.analysis?.subject?.title || state.topic)}-report.html`,
        buildLosslessStrategicReport(),
        "text/html",
      );
  }
  const ej = $("exportJson");
  if (ej) {
    ej.onclick = () =>
      download(
        `${safeFileSlug(state.analysis?.subject?.title || state.topic)}-analysis.json`,
        `${JSON.stringify(state.analysis, null, 2)}\n`,
        "application/json",
      );
  }
}
function renderAll() {
  PLATFORM_RENDERER.renderAll();
}
function showModal(title, content, invoker = document.activeElement) {
  state.modalInvoker = invoker;
  $("modalTitle").textContent = title;
  $("modalContent").textContent = content;
  const back = $("modalBackdrop");
  back.classList.add("show");
  back.setAttribute("aria-hidden", "false");
  setTimeout(() => document.querySelector(".modal")?.focus(), 0);
}
function closeModal() {
  const back = $("modalBackdrop");
  if (!back.classList.contains("show")) return;
  back.classList.remove("show");
  back.setAttribute("aria-hidden", "true");
  const invoker = state.modalInvoker;
  state.modalInvoker = null;
  if (invoker && typeof invoker.focus === "function" && invoker.isConnected) {
    invoker.focus();
  }
}
function trapModalFocus(e) {
  const back = $("modalBackdrop");
  if (!back.classList.contains("show") || e.key !== "Tab") return;
  const focusables = [
    ...back.querySelectorAll(
      'button,[href],textarea,input,select,[tabindex]:not([tabindex="-1"])',
    ),
  ].filter((el) => !el.disabled);
  if (!focusables.length) return;
  const first = focusables[0],
    last = focusables[focusables.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    last.focus();
    e.preventDefault();
  } else if (!e.shiftKey && document.activeElement === last) {
    first.focus();
    e.preventDefault();
  }
}
function repairPrompt() {
  const ar = state.analysisLang === "ar";
  const fr = state.analysisLang === "fr";
  const bad = $("jsonInput").value.trim();
  if (ar)
    return `أصلح النص التالي ليصبح JSON صالحًا فقط ومتوافقًا مع مخطط أداة التحليل. لا تكتب أي شرح خارج JSON. لا تدرج علامات استشهاد داخلية للمساعد مثل cite أو filecite أو turn؛ استخدم معرّفات الأدلة النظامية وروابط HTTP(S) فقط. لا تضع في source_url إلا رابط HTTP(S) مطلقًا؛ استخدم "" عند غيابه. لا تستخدم verified ما لم يكن verified_by وverification_date غير فارغين؛ وإلا استخدم partially_verified أو unverified واتركهما فارغين. لا تعيّن statistics_quotations_verified إلى pass إذا بقي أي دليل unverified أو partially_verified أو disputed.

النص:
${bad}

المخطط المطلوب:
${buildSchema(state.analysisLang, state.promptMode)}`;
  if (fr)
    return `Répare le texte suivant pour produire uniquement un JSON valide compatible avec le schéma de l’outil. N’écris aucune explication hors JSON. N’inclus aucun marqueur interne d’assistant tel que cite, filecite ou turn ; utilise uniquement les identifiants de preuve canoniques et des URL HTTP(S). source_url doit être une URL HTTP(S) absolue ou "". N’utilise verified que si verified_by et verification_date sont tous deux non vides ; sinon utilise partially_verified ou unverified et laisse-les vides. N’utilise pas pass pour statistics_quotations_verified si une preuve reste unverified, partially_verified ou disputed.

Texte :
${bad}

Schéma requis :
${buildSchema(state.analysisLang, state.promptMode)}`;
  return `Repair the following text into valid JSON only, matching the analysis workbench schema. Do not write any explanation outside JSON. Do not include assistant-internal citation markers such as cite, filecite, or turn; use canonical evidence IDs and HTTP(S) URLs only. source_url must be an absolute HTTP(S) URL or "". Use verified only when verified_by and verification_date are both non-empty; otherwise use partially_verified or unverified and leave them empty. Do not set statistics_quotations_verified to pass while any evidence is unverified, partially_verified, or disputed.

Text:
${bad}

Required schema:
${buildSchema(state.analysisLang, state.promptMode)}`;
}
$("langAr").onclick = () => setLang("ar");
$("langEn").onclick = () => setLang("en");
$("langFr").onclick = () => setLang("fr");
document
  .querySelectorAll("#analysisLens [data-lens]")
  .forEach((btn) => (btn.onclick = () => setAnalysisLens(btn.dataset.lens)));
bindRadioGroupKeyboard("#languageSegment [role=radio]", (button) => {
  const lang = { langAr: "ar", langEn: "en", langFr: "fr" }[button.id];
  setLang(lang);
});
bindRadioGroupKeyboard("#analysisLens [role=radio]", (button) =>
  setAnalysisLens(button.dataset.lens),
);
$("themeBtn").onclick = () =>
  setTheme(!document.body.classList.contains("dark"));
$("densityBtn").onclick = () =>
  setDensity(SHELL_PREFERENCES.current() === "compact" ? "comfortable" : "compact");
bindWorkspaceNavigation();
$("shellNextAction").onclick = () => {
  const command = resolveShellCommand({
    stage: state.stage,
    hasAnalysis: Boolean(state.analysis),
  });
  navigateShell(command.section, { focusTarget: command.focusTarget });
};
$("copyPromptBtn").onclick = async (event) => {
  const invoker = event.currentTarget;
  state.topic = $("topicInput").value.trim();
  state.context = $("timeframeInput").value.trim();
  if (!state.topic) {
    toast(t("topicNeeded"));
    $("topicStatus").className = "status bad";
    $("topicStatus").textContent = t("topicNeeded");
    return;
  }
  const p = buildPrompt();
  state.lastPrompt = p;
  const ok = await copyText(p);
  state.stage = "import";
  $("editTopicBtn").classList.remove("hide");
  $("topicStatus").className = ok ? "status good" : "status warn";
  $("topicStatus").textContent = ok ? t("promptCopied") : t("copyFailed");
  if (!ok) showModal(t("promptPreview"), p, invoker);
  renderAll();
};
$("previewPromptBtn").onclick = (event) => {
  state.topic = $("topicInput").value.trim();
  state.context = $("timeframeInput").value.trim();
  if (!state.topic) {
    toast(t("topicNeeded"));
    return;
  }
  state.lastPrompt = buildPrompt();
  showModal(t("promptPreview"), state.lastPrompt, event.currentTarget);
};
$("editTopicBtn").onclick = () => {
  state.stage = "topic";
  state.shellSection = "workflow";
  renderAll();
};
$("jsonInput").addEventListener("input", validateJsonInput);
$("clearJsonBtn").onclick = () => {
  $("jsonInput").value = "";
  validateJsonInput();
};
$("importBtn").onclick = () => {
  const a = validateJsonInput();
  if (!a) return;
  state.analysis = a;
  if (isSupportedLanguage(a.language)) setAnalysisLanguage(a.language);
  if (["strategic", "biopolitical"].includes(a.analysis_lens)) {
    state.analysisLens = a.analysis_lens;
    writeSettings({ analysisLens: state.analysisLens });
  }
  state.stage = "review";
  state.shellSection = "review";
  state.activeReview = "overview";
  state.activePillar = null;
  $("topicInput").value = a.subject.title || state.topic;
  $("timeframeInput").value = a.subject.context || state.context;
  state.topic = $("topicInput").value;
  state.context = $("timeframeInput").value;
  $("topicStatus").className = "status good";
  $("topicStatus").textContent = t("analysisImported");
  toast(t("analysisImported"));
  renderAll();
  document
    .getElementById("reviewPanel")
    .scrollIntoView({ behavior: "auto", block: "nearest" });
};
$("repairPromptBtn").onclick = async (event) => {
  const invoker = event.currentTarget;
  const p = repairPrompt();
  const ok = await copyText(p);
  toast(ok ? t("repairCopied") : t("copyFailed"));
  if (!ok) showModal(t("repairPrompt"), p, invoker);
};
$("loadSampleBtn").onclick = () => {
  const a = sampleAnalysis(state.analysisLang);
  if (a.analysis_lens === "biopolitical") {
    const validation = BIO_INTEGRITY.validateImport(a);
    if (!validation.ok) {
      toast(importErrorText({ validation }));
      return;
    }
    state.importValidation = validation;
  } else {
    state.importValidation = null;
  }
  state.analysis = a;
  state.analysisLens = a.analysis_lens || state.analysisLens;
  writeSettings({ analysisLens: state.analysisLens });
  state.stage = "review";
  state.shellSection = "review";
  state.activeReview = "overview";
  state.activePillar = null;
  state.topic = a.subject.title;
  state.context = a.subject.context;
  $("topicInput").value = state.topic;
  $("timeframeInput").value = state.context;
  $("jsonInput").value = JSON.stringify(a, null, 2);
  toast(t("sampleLoaded"));
  renderAll();
  document
    .getElementById("reviewPanel")
    .scrollIntoView({ behavior: "auto", block: "nearest" });
};
$("modalClose").onclick = closeModal;
$("modalBackdrop").addEventListener("click", (e) => {
  if (e.target === $("modalBackdrop")) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
  trapModalFocus(e);
});
$("modalCopy").onclick = async () => {
  const ok = await copyText($("modalContent").textContent);
  toast(ok ? t("copied") : t("copyFailed"));
};
[
  "analysisLang",
  "promptMode",
  "timeframeInput",
  "topicInput",
].forEach((id) =>
  $(id).addEventListener("change", () => {
    if (id === "analysisLang") {
      setAnalysisLanguage($("analysisLang").value);
    }
    state.promptMode = $("promptMode").value;
    state.context = $("timeframeInput").value;
    state.topic = $("topicInput").value;
  }),
);
$("topicInput").addEventListener("input", () => {
  state.topic = $("topicInput").value;
});
$("timeframeInput").addEventListener("input", () => {
  state.context = $("timeframeInput").value;
});
PLATFORM.performance.measure(
  "boot.initialize",
  () => {
    initializeTheme();
    setDensity(state.density, false);
    renderAll();
    validateJsonInput();
  },
  { lens: state.analysisLens, language: state.lang },
);
