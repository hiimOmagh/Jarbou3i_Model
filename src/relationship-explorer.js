/* Jarbou3i Model — deterministic accessible relationship explorer */
(function attachRelationshipExplorer(root) {
  "use strict";

  const escapeHtml = (value) =>
    String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  const copy = {
    en: {
      title: "Relationship Explorer", subtitle: "Trace authored claims, evidence, and structural dependencies without changing the analysis.",
      story: "Story", evidence: "Evidence trail", network: "Network", map: "Map", list: "Connections list", spatial: "Spatial",
      search: "Search records", searchPlaceholder: "Name, claim, source, or ID…", pillar: "Pillar", type: "Record type",
      confidence: "Confidence", verification: "Evidence status", relation: "Relation", all: "All",
      explicit: "Authored", evidenceEdges: "Evidence", structural: "Structural", neighborhood: "Selected node + one hop",
      fit: "Fit", zoomIn: "Zoom in", zoomOut: "Zoom out", reset: "Reset filters", nodes: "records", edges: "connections",
      mapLabel: "Scrollable relationship map", empty: "No records match the current filters.", edgeDetails: "Connection details",
      from: "From", to: "To", mechanism: "Mechanism", source: "Source", clearSelection: "Clear selection",
      guided: "Guided", analyst: "Analyst", depth: "Detail level", advanced: "Filters and map controls",
      legend: "Connection legend", storyPaths: "causal paths", step: "Step", why: "Why connected?",
      evidenceClaim: "Claim or analytical record", supporting: "Supporting evidence", counter: "Counter-evidence",
      noSupporting: "No supporting evidence in this view", noCounter: "No counter-evidence in this view",
      explicitWhy: "This authored connection states how the first record leads to or shapes the second.",
      supportWhy: "The evidence is cited in support of this analytical record.", counterWhy: "The evidence is cited as a challenge to this analytical record.",
      structuralWhy: "A canonical reference in the analysis connects these records.",
      focus: "Focus mode", exitFocus: "Exit focus mode", startTour: "Guide me", stopTour: "End walkthrough",
      walkthrough: "Guided walkthrough", previous: "Previous", next: "Next", finish: "Finish", of: "of",
      inspection: "Inspection", selectedRecord: "Selected record", connected: "Indexed connections",
      openRecord: "Open full record", reveal: "Reveal in Network", hiddenSelection: "This selection is outside the current view.",
      noSelection: "Select a record or connection to keep its context here.", oneHop: "Focus one hop",
      overlay: "Overlay", none: "None", temporal: "Time", comparative: "Compare", temporalTitle: "Canonical time signals",
      temporalNote: "Only stated dates, effects, adaptations, dependencies, and future horizons are shown; their order is analytical, not an inferred chronology.",
      historical: "Historical continuity", dated: "Dated evidence", immediate: "Immediate effects", medium: "Medium-term and dependencies", future: "Future and intergenerational",
      noTemporal: "No canonical signals in this band.", comparisonTitle: "International comparison", comparisonBasis: "Comparison basis",
      similarities: "Similarities", differences: "Differences", transferLimits: "Transfer limits", noComparison: "No international comparison records.",
      savedViews: "Saved views", saveView: "Save current", restoreView: "Restore", deleteView: "Delete", noSavedView: "Choose a saved view",
      spatialLabel: "Spatial relationship field", spatialInstructions: "Drag empty space to orbit. Use the record picker for cards hidden by depth; every record also remains available in the Connections list.",
      spatialUnavailable: "Spatial view requires a wider screen and 3D transform support.", orbitLeft: "Orbit left", orbitRight: "Orbit right",
      orbitUp: "Tilt up", orbitDown: "Tilt down", closer: "Move closer", farther: "Move farther", resetSpatial: "Reset spatial view", orientation: "Orientation",
      findSpatialRecord: "Find a spatial record", chooseSpatialRecord: "Choose a record",
    },
    ar: {
      title: "مستكشف العلاقات", subtitle: "تتبّع الادعاءات المؤلَّفة والأدلة والتبعيات البنيوية دون تغيير التحليل.",
      story: "القصة", evidence: "مسار الأدلة", network: "الشبكة", map: "الخريطة", list: "قائمة العلاقات", spatial: "مجسّم",
      search: "البحث في السجلات", searchPlaceholder: "اسم أو ادعاء أو مصدر أو معرّف…", pillar: "المحور", type: "نوع السجل",
      confidence: "الثقة", verification: "حالة الدليل", relation: "العلاقة", all: "الكل",
      explicit: "مؤلَّفة", evidenceEdges: "أدلة", structural: "بنيوية", neighborhood: "العقدة المحددة وخطوة واحدة",
      fit: "ملاءمة", zoomIn: "تكبير", zoomOut: "تصغير", reset: "إعادة الضبط", nodes: "سجلات", edges: "علاقات",
      mapLabel: "خريطة علاقات قابلة للتمرير", empty: "لا توجد سجلات تطابق المرشحات الحالية.", edgeDetails: "تفاصيل العلاقة",
      from: "من", to: "إلى", mechanism: "الآلية", source: "المصدر", clearSelection: "إلغاء التحديد",
      guided: "موجّه", analyst: "تحليلي", depth: "مستوى التفاصيل", advanced: "المرشحات وأدوات الخريطة",
      legend: "مفتاح العلاقات", storyPaths: "مسارات سببية", step: "خطوة", why: "لماذا يرتبطان؟",
      evidenceClaim: "ادعاء أو سجل تحليلي", supporting: "أدلة مؤيدة", counter: "أدلة مضادة",
      noSupporting: "لا توجد أدلة مؤيدة في هذا العرض", noCounter: "لا توجد أدلة مضادة في هذا العرض",
      explicitWhy: "توضح هذه العلاقة المؤلَّفة كيف يقود السجل الأول إلى الثاني أو يشكّله.",
      supportWhy: "يُستشهد بهذا الدليل لتأييد السجل التحليلي.", counterWhy: "يُستشهد بهذا الدليل للطعن في السجل التحليلي.",
      structuralWhy: "يربط مرجع قانوني داخل التحليل بين هذين السجلين.",
      focus: "وضع التركيز", exitFocus: "الخروج من وضع التركيز", startTour: "أرشدني", stopTour: "إنهاء الجولة",
      walkthrough: "جولة إرشادية", previous: "السابق", next: "التالي", finish: "إنهاء", of: "من",
      inspection: "المعاينة", selectedRecord: "السجل المحدد", connected: "العلاقات المفهرسة",
      openRecord: "فتح السجل الكامل", reveal: "إظهاره في الشبكة", hiddenSelection: "هذا التحديد خارج العرض الحالي.",
      noSelection: "حدّد سجلًا أو علاقة للاحتفاظ بسياقها هنا.", oneHop: "تركيز خطوة واحدة",
      overlay: "طبقة إضافية", none: "بلا", temporal: "الزمن", comparative: "المقارنة", temporalTitle: "الإشارات الزمنية النظامية",
      temporalNote: "تظهر فقط التواريخ والآثار والتكيفات والتبعيات والآفاق المستقبلية المصرّح بها؛ ترتيبها تحليلي وليس تسلسلًا زمنيًا مستنتجًا.",
      historical: "الاستمرارية التاريخية", dated: "أدلة مؤرخة", immediate: "آثار فورية", medium: "متوسط المدى والتبعيات", future: "المستقبل وبين الأجيال",
      noTemporal: "لا توجد إشارات نظامية في هذا النطاق.", comparisonTitle: "المقارنة الدولية", comparisonBasis: "أساس المقارنة",
      similarities: "أوجه التشابه", differences: "الاختلافات", transferLimits: "حدود النقل", noComparison: "لا توجد سجلات مقارنة دولية.",
      savedViews: "العروض المحفوظة", saveView: "حفظ الحالي", restoreView: "استعادة", deleteView: "حذف", noSavedView: "اختر عرضًا محفوظًا",
      spatialLabel: "حقل العلاقات المجسّم", spatialInstructions: "اسحب المساحة الفارغة لتدوير المشهد. استخدم منتقي السجلات للبطاقات المحجوبة بالعمق؛ وتبقى كل السجلات متاحة أيضًا في قائمة العلاقات.",
      spatialUnavailable: "يتطلب العرض المجسّم شاشة أوسع ودعم التحويلات ثلاثية الأبعاد.", orbitLeft: "تدوير يسارًا", orbitRight: "تدوير يمينًا",
      orbitUp: "إمالة لأعلى", orbitDown: "إمالة لأسفل", closer: "تقريب", farther: "إبعاد", resetSpatial: "إعادة ضبط العرض المجسّم", orientation: "الاتجاه",
      findSpatialRecord: "ابحث عن سجل في المشهد", chooseSpatialRecord: "اختر سجلًا",
    },
    fr: {
      title: "Explorateur de relations", subtitle: "Suivez les énoncés, les preuves et les dépendances structurelles sans modifier l’analyse.",
      story: "Récit", evidence: "Parcours probatoire", network: "Réseau", map: "Carte", list: "Liste des connexions", spatial: "Spatial",
      search: "Rechercher", searchPlaceholder: "Nom, énoncé, source ou ID…", pillar: "Pilier", type: "Type de fiche",
      confidence: "Confiance", verification: "Statut de preuve", relation: "Relation", all: "Tous",
      explicit: "Rédigées", evidenceEdges: "Preuves", structural: "Structurelles", neighborhood: "Nœud sélectionné + un lien",
      fit: "Ajuster", zoomIn: "Zoom avant", zoomOut: "Zoom arrière", reset: "Réinitialiser", nodes: "fiches", edges: "connexions",
      mapLabel: "Carte relationnelle défilable", empty: "Aucune fiche ne correspond aux filtres.", edgeDetails: "Détails de la connexion",
      from: "De", to: "Vers", mechanism: "Mécanisme", source: "Source", clearSelection: "Effacer la sélection",
      guided: "Guidé", analyst: "Analyste", depth: "Niveau de détail", advanced: "Filtres et commandes de carte",
      legend: "Légende des connexions", storyPaths: "parcours causaux", step: "Étape", why: "Pourquoi sont-ils liés ?",
      evidenceClaim: "Énoncé ou fiche analytique", supporting: "Preuves favorables", counter: "Contre-preuves",
      noSupporting: "Aucune preuve favorable dans cette vue", noCounter: "Aucune contre-preuve dans cette vue",
      explicitWhy: "Cette connexion rédigée indique comment la première fiche mène à la seconde ou la façonne.",
      supportWhy: "Cette preuve est citée à l’appui de la fiche analytique.", counterWhy: "Cette preuve est citée pour contester la fiche analytique.",
      structuralWhy: "Une référence canonique de l’analyse relie ces deux fiches.",
      focus: "Mode concentration", exitFocus: "Quitter le mode concentration", startTour: "Guidez-moi", stopTour: "Terminer le parcours",
      walkthrough: "Parcours guidé", previous: "Précédent", next: "Suivant", finish: "Terminer", of: "sur",
      inspection: "Inspection", selectedRecord: "Fiche sélectionnée", connected: "Connexions indexées",
      openRecord: "Ouvrir la fiche complète", reveal: "Révéler dans le réseau", hiddenSelection: "Cette sélection est hors de la vue actuelle.",
      noSelection: "Sélectionnez une fiche ou une connexion pour conserver son contexte ici.", oneHop: "Isoler un lien",
      overlay: "Calque", none: "Aucun", temporal: "Temps", comparative: "Comparer", temporalTitle: "Signaux temporels canoniques",
      temporalNote: "Seuls les dates, effets, adaptations, dépendances et horizons futurs déclarés sont affichés ; leur ordre est analytique, non une chronologie inférée.",
      historical: "Continuité historique", dated: "Preuves datées", immediate: "Effets immédiats", medium: "Moyen terme et dépendances", future: "Futur et intergénérationnel",
      noTemporal: "Aucun signal canonique dans cette bande.", comparisonTitle: "Comparaison internationale", comparisonBasis: "Base de comparaison",
      similarities: "Similarités", differences: "Différences", transferLimits: "Limites de transfert", noComparison: "Aucune comparaison internationale.",
      savedViews: "Vues enregistrées", saveView: "Enregistrer", restoreView: "Restaurer", deleteView: "Supprimer", noSavedView: "Choisir une vue enregistrée",
      spatialLabel: "Champ relationnel spatial", spatialInstructions: "Faites glisser l’espace vide pour orbiter. Utilisez le sélecteur pour les fiches masquées par la profondeur ; chaque fiche reste aussi disponible dans la liste.",
      spatialUnavailable: "La vue spatiale nécessite un écran plus large et la prise en charge des transformations 3D.", orbitLeft: "Orbiter à gauche", orbitRight: "Orbiter à droite",
      orbitUp: "Incliner vers le haut", orbitDown: "Incliner vers le bas", closer: "Rapprocher", farther: "Éloigner", resetSpatial: "Réinitialiser la vue spatiale", orientation: "Orientation",
      findSpatialRecord: "Trouver une fiche spatiale", chooseSpatialRecord: "Choisir une fiche",
    },
  };

  // Canonical enum values remain stable in the analysis contract. This table
  // localizes only their presentation inside the explorer.
  const tokenCopy = {
    en: {
      causes: "Causes", enables: "Enables", constrains: "Constrains", classifies: "Classifies",
      legitimizes: "Legitimizes", commodifies: "Commodifies", distributes: "Distributes",
      exposes: "Exposes", resists: "Resists", feeds_back: "Feeds back", contradicts: "Contradicts",
      supports: "Supports", supported_by: "Supported by", countered_by: "Countered by",
      references: "References", contains: "Contains", targets: "Targets", affects: "Affects",
      applies_to: "Applies to", benefits: "Benefits", burdens: "Burdens", produces: "Produces",
      depends_on: "Depends on", high: "High", medium: "Medium", low: "Low",
      verified: "Verified", unverified: "Unverified", partially_verified: "Partially verified",
      explicit: "Authored", evidence: "Evidence", structural: "Structural",
    },
    ar: {
      causes: "يسبّب", enables: "يمكّن", constrains: "يقيّد", classifies: "يصنّف",
      legitimizes: "يضفي الشرعية", commodifies: "يحوّل إلى سلعة", distributes: "يوزّع",
      exposes: "يعرّض", resists: "يقاوم", feeds_back: "يرتدّ تأثيره", contradicts: "يناقض",
      supports: "يؤيد", supported_by: "مدعوم بـ", countered_by: "تعارضه أدلة",
      references: "يشير إلى", contains: "يتضمن", targets: "يستهدف", affects: "يؤثر في",
      applies_to: "ينطبق على", benefits: "يفيد", burdens: "يحمّل أعباء", produces: "ينتج",
      depends_on: "يعتمد على", high: "عالية", medium: "متوسطة", low: "منخفضة",
      verified: "مُتحقَّق منه", unverified: "غير مُتحقَّق", partially_verified: "مُتحقَّق منه جزئيًا",
      explicit: "مؤلَّفة", evidence: "أدلة", structural: "بنيوية",
    },
    fr: {
      causes: "Cause", enables: "Permet", constrains: "Contraint", classifies: "Classe",
      legitimizes: "Légitime", commodifies: "Marchandise", distributes: "Distribue",
      exposes: "Expose", resists: "Résiste", feeds_back: "Rétroagit", contradicts: "Contredit",
      supports: "Appuie", supported_by: "Appuyé par", countered_by: "Contredit par",
      references: "Référence", contains: "Contient", targets: "Cible", affects: "Affecte",
      applies_to: "S’applique à", benefits: "Bénéficie à", burdens: "Fait peser sur", produces: "Produit",
      depends_on: "Dépend de", high: "Élevée", medium: "Moyenne", low: "Faible",
      verified: "Vérifiée", unverified: "Non vérifiée", partially_verified: "Partiellement vérifiée",
      explicit: "Rédigée", evidence: "Preuve", structural: "Structurelle",
    },
  };

  let container = null;
  let graph = null;
  let analysis = null;
  let lang = "en";
  let onOpenNode = null;
  let resizeObserver = null;
  let renderEpoch = 0;
  let searchRenderFrame = 0;
  function focusAfterRender(resolveTarget, { force = false, epoch = renderEpoch } = {}) {
    requestAnimationFrame(() => {
      if (epoch !== renderEpoch) return;
      const active = document.activeElement;
      if (!force && active && active !== document.body && active !== document.documentElement) return;
      resolveTarget()?.focus();
    });
  }
  const state = {
    mode: "story", view: "map", query: "", pillar: "", type: "", confidence: "",
    verification: "", relation: "", families: new Set(["explicit"]), neighborhood: false,
    selectedId: "", selectedEdgeId: "", zoom: 1, depth: "guided",
    focused: false, tour: false, tourIndex: 0, overlay: "none", savedViewId: "",
    spatialYaw: -18, spatialPitch: 48, spatialZoom: 0.68,
  };
  let savedViews = [];
  let storageKey = "";
  let spatialAvailable = false;

  const c = () => copy[lang] || copy.en;
  const unique = (values) => [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));
  const option = (value, label, selected) => `<option value="${escapeHtml(value)}"${selected === value ? " selected" : ""}>${escapeHtml(label)}</option>`;
  const tokenLabel = (value) => {
    const token = String(value || "");
    return tokenCopy[lang]?.[token] || tokenCopy.en[token] || token.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
  };
  const pillarLabels = () => root.Jarbou3iBiopolitics?.ui(lang, "pillars") || {};
  const finiteNumber = (value, fallback) => Number.isFinite(Number(value)) ? Number(value) : fallback;
  const normalizeYaw = (value) => ((finiteNumber(value, -18) + 180) % 360 + 360) % 360 - 180;

  function detectSpatialCapability() {
    return Boolean(
      root.CSS?.supports?.("transform-style", "preserve-3d") &&
      Number(root.innerWidth || 0) >= 761,
    );
  }

  function scopeHash(value) {
    let hash = 2166136261;
    for (const char of String(value || "analysis")) {
      hash ^= char.codePointAt(0);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(36);
  }

  function loadSavedViews(scope) {
    storageKey = `jarbou3i.relationshipViews.v1.${scopeHash(scope)}`;
    try {
      const parsed = JSON.parse(root.localStorage?.getItem(storageKey) || "[]");
      savedViews = Array.isArray(parsed) ? parsed.filter((item) => item && item.id && item.snapshot) : [];
    } catch { savedViews = []; }
    if (!savedViews.some((item) => item.id === state.savedViewId)) state.savedViewId = "";
  }

  function persistSavedViews() {
    try { root.localStorage?.setItem(storageKey, JSON.stringify(savedViews)); } catch { /* presentation state is best-effort */ }
  }

  function viewSnapshot() {
    return {
      mode: state.mode, view: state.view, depth: state.depth, overlay: state.overlay,
      query: state.query, pillar: state.pillar, type: state.type, confidence: state.confidence,
      verification: state.verification, relation: state.relation, families: [...state.families],
      neighborhood: state.neighborhood, selectedId: state.selectedId, selectedEdgeId: state.selectedEdgeId,
      zoom: state.zoom, spatialYaw: state.spatialYaw, spatialPitch: state.spatialPitch,
      spatialZoom: state.spatialZoom,
    };
  }

  function restoreSnapshot(snapshot) {
    const allowedMode = ["story", "evidence", "network"].includes(snapshot?.mode) ? snapshot.mode : "story";
    const requestedView = ["map", "list", "spatial"].includes(snapshot?.view) ? snapshot.view : "map";
    Object.assign(state, {
      mode: allowedMode, view: requestedView === "spatial" && !spatialAvailable ? "list" : requestedView,
      depth: ["guided", "analyst"].includes(snapshot?.depth) ? snapshot.depth : "guided",
      overlay: ["none", "temporal", "comparative"].includes(snapshot?.overlay) ? snapshot.overlay : "none",
      query: String(snapshot?.query || ""), pillar: String(snapshot?.pillar || ""), type: String(snapshot?.type || ""),
      confidence: String(snapshot?.confidence || ""), verification: String(snapshot?.verification || ""),
      relation: String(snapshot?.relation || ""), neighborhood: Boolean(snapshot?.neighborhood),
      selectedId: graph.resolve(snapshot?.selectedId) ? snapshot.selectedId : "",
      selectedEdgeId: graph.edges.some((edge) => edge.id === snapshot?.selectedEdgeId) ? snapshot.selectedEdgeId : "",
      zoom: Math.max(0.7, Math.min(1.4, Number(snapshot?.zoom) || 1)),
      spatialYaw: normalizeYaw(snapshot?.spatialYaw),
      spatialPitch: Math.max(18, Math.min(72, finiteNumber(snapshot?.spatialPitch, 48))),
      spatialZoom: Math.max(0.58, Math.min(1.08, finiteNumber(snapshot?.spatialZoom, 0.68))),
      focused: false, tour: false, tourIndex: 0,
    });
    const families = Array.isArray(snapshot?.families) ? snapshot.families.filter((value) => ["explicit", "evidence", "structural"].includes(value)) : [];
    state.families = new Set(families.length ? families : allowedMode === "story" ? ["explicit"] : allowedMode === "evidence" ? ["evidence"] : ["explicit", "evidence", "structural"]);
    document.documentElement.classList.remove("relationshipFocusOpen");
  }

  function overlayHtml() {
    const api = root.Jarbou3iBiopoliticsGraph;
    if (state.overlay === "temporal") {
      const bands = api.temporalProjection(analysis || {});
      return `<section class="relationshipOverlay relationshipTemporal" data-relationship-overlay="temporal" aria-labelledby="relationshipOverlayTitle"><header><h3 id="relationshipOverlayTitle">${escapeHtml(c().temporalTitle)}</h3><p>${escapeHtml(c().temporalNote)}</p></header><div class="relationshipTimeline">${bands.map((band) => `<section data-time-band="${escapeHtml(band.key)}"><h4>${escapeHtml(c()[band.key])} <b>${band.items.length}</b></h4>${band.items.length ? band.items.map((item) => item.id && graph.resolve(item.id) ? `<button type="button" data-map-node="${escapeHtml(item.id)}"><strong>${escapeHtml(item.label)}</strong>${item.detail ? `<span>${escapeHtml(item.detail)}</span>` : ""}</button>` : `<article><strong>${escapeHtml(item.label)}</strong>${item.detail ? `<span>${escapeHtml(item.detail)}</span>` : ""}</article>`).join("") : `<p>${escapeHtml(c().noTemporal)}</p>`}</section>`).join("")}</div></section>`;
    }
    if (state.overlay === "comparative") {
      const comparisons = api.comparativeProjection(analysis || {});
      return `<section class="relationshipOverlay relationshipComparative" data-relationship-overlay="comparative" aria-labelledby="relationshipOverlayTitle"><header><h3 id="relationshipOverlayTitle">${escapeHtml(c().comparisonTitle)}</h3></header>${comparisons.length ? `<div class="relationshipComparisonGrid">${comparisons.map((item) => `<article><header><strong>${escapeHtml(item.context || item.id)}</strong>${item.confidence ? `<span>${escapeHtml(tokenLabel(item.confidence))}</span>` : ""}</header><dl><div><dt>${escapeHtml(c().comparisonBasis)}</dt><dd>${escapeHtml(item.basis)}</dd></div><div><dt>${escapeHtml(c().similarities)}</dt><dd>${item.similarities.map((value) => `<p>${escapeHtml(value)}</p>`).join("") || "—"}</dd></div><div><dt>${escapeHtml(c().differences)}</dt><dd>${item.differences.map((value) => `<p>${escapeHtml(value)}</p>`).join("") || "—"}</dd></div><div><dt>${escapeHtml(c().transferLimits)}</dt><dd>${item.transferLimits.map((value) => `<p>${escapeHtml(value)}</p>`).join("") || "—"}</dd></div></dl><footer>${item.evidenceIds.map((id) => graph.resolve(id) ? `<button type="button" data-map-node="${escapeHtml(id)}">${escapeHtml(graph.resolve(id).label)}</button>` : "").join("")}</footer></article>`).join("")}</div>` : `<p>${escapeHtml(c().noComparison)}</p>`}</section>`;
    }
    return "";
  }

  function matchesNode(node) {
    if (state.pillar && node.pillar !== state.pillar) return false;
    if (state.type && node.type !== state.type) return false;
    if (state.confidence && node.confidence !== state.confidence) return false;
    if (state.verification && node.type === "evidence" && node.record?.verification_status !== state.verification) return false;
    if (state.verification && node.type !== "evidence") return false;
    const query = state.query.trim().toLocaleLowerCase(lang);
    if (!query) return true;
    const haystack = [node.id, node.label, node.subtitle, node.record?.source_title, node.record?.claim]
      .filter(Boolean).join(" ").toLocaleLowerCase(lang);
    return haystack.includes(query);
  }

  function visibleData() {
    let nodes = graph.nodes.filter(matchesNode);
    let edges = graph.edges.filter((edge) =>
      state.families.has(edge.family) && (!state.relation || edge.relation === state.relation),
    );
    const allowed = new Set(nodes.map((node) => node.id));
    edges = edges.filter((edge) => allowed.has(edge.source) && allowed.has(edge.target));
    if (state.mode !== "network" && !state.query && !state.pillar && !state.type && !state.confidence && !state.verification) {
      const endpoints = new Set(edges.flatMap((edge) => [edge.source, edge.target]));
      nodes = nodes.filter((node) => endpoints.has(node.id));
    }
    if (state.neighborhood && state.selectedId) {
      const neighborhood = new Set([state.selectedId]);
      graph.edges.forEach((edge) => {
        if (edge.source === state.selectedId) neighborhood.add(edge.target);
        if (edge.target === state.selectedId) neighborhood.add(edge.source);
      });
      nodes = nodes.filter((node) => neighborhood.has(node.id));
      const ids = new Set(nodes.map((node) => node.id));
      edges = edges.filter((edge) => ids.has(edge.source) && ids.has(edge.target));
    }
    return { nodes, edges };
  }

  function setMode(mode) {
    state.mode = mode;
    state.families = mode === "story"
      ? new Set(["explicit"])
      : mode === "evidence"
        ? new Set(["evidence"])
        : new Set(["explicit", "evidence", "structural"]);
    state.relation = "";
    state.tourIndex = 0;
    render(`relationshipMode-${mode}`);
  }

  function edgeExplanation(edge) {
    return edge?.mechanism || (edge?.family === "explicit"
      ? c().explicitWhy
      : edge?.relation === "countered_by"
        ? c().counterWhy
        : edge?.family === "evidence" ? c().supportWhy : c().structuralWhy);
  }

  function walkthroughEdges(data) {
    return state.mode === "story"
      ? storyPaths(data.nodes, data.edges).flatMap((path) => path.edges)
      : data.edges;
  }

  function activeTourEdge(data) {
    if (!state.tour) return null;
    const edges = walkthroughEdges(data);
    if (!edges.length) return null;
    state.tourIndex = Math.max(0, Math.min(state.tourIndex, edges.length - 1));
    state.selectedEdgeId = edges[state.tourIndex].id;
    state.selectedId = "";
    return edges[state.tourIndex];
  }

  function nodeButton(node, options = {}) {
    const selected = state.selectedId === node.id;
    const tourEdge = state.tour ? graph.edges.find((edge) => edge.id === state.selectedEdgeId) : null;
    const tourTarget = tourEdge && [tourEdge.source, tourEdge.target].includes(node.id);
    const step = options.step ? `<span class="relationshipStep" aria-hidden="true">${escapeHtml(options.step)}</span>` : "";
    const metadata = state.depth === "analyst"
      ? `<span class="relationshipNodeMeta"><b dir="ltr">${escapeHtml(node.id)}</b>${node.confidence ? `<small>${escapeHtml(tokenLabel(node.confidence))}</small>` : ""}</span>`
      : "";
    const extraClass = options.className ? ` ${escapeHtml(options.className)}` : "";
    const style = options.style ? ` style="${escapeHtml(options.style)}"` : "";
    return `<button class="relationshipNode relationshipNode--${escapeHtml(node.type)}${options.compact ? " relationshipNode--compact" : ""}${selected ? " is-selected" : ""}${tourTarget ? " is-tour-target" : ""}${extraClass}" type="button" data-map-node="${escapeHtml(node.id)}" aria-pressed="${selected}" aria-label="${escapeHtml(`${node.label}; ${graph.typeLabel(node.type)}; ${node.id}`)}"${style}>${step}<span class="relationshipNodeType">${escapeHtml(graph.typeLabel(node.type))}</span><strong>${escapeHtml(node.label)}</strong>${metadata}</button>`;
  }

  function storyPaths(nodes, edges) {
    const ids = new Set(nodes.map((node) => node.id));
    const outgoing = new Map(nodes.map((node) => [node.id, []]));
    const incoming = new Map(nodes.map((node) => [node.id, 0]));
    edges.forEach((edge) => {
      if (!ids.has(edge.source) || !ids.has(edge.target)) return;
      outgoing.get(edge.source)?.push(edge);
      incoming.set(edge.target, (incoming.get(edge.target) || 0) + 1);
    });
    const used = new Set();
    const paths = [];
    const walk = (start) => {
      const path = { nodes: [start], edges: [] };
      let current = start;
      const seen = new Set([start]);
      while (true) {
        const edge = (outgoing.get(current) || []).find((item) => !used.has(item.id) && !seen.has(item.target));
        if (!edge) break;
        used.add(edge.id); path.edges.push(edge); path.nodes.push(edge.target);
        current = edge.target; seen.add(current);
      }
      paths.push(path);
    };
    nodes.filter((node) => (incoming.get(node.id) || 0) === 0 && (outgoing.get(node.id) || []).length).forEach((node) => walk(node.id));
    edges.filter((edge) => !used.has(edge.id)).forEach((edge) => walk(edge.source));
    return paths;
  }

  function storyHtml(data) {
    const paths = storyPaths(data.nodes, data.edges);
    const content = paths.map((path, pathIndex) => {
      const parts = [];
      path.nodes.forEach((id, index) => {
        const node = graph.resolve(id);
        if (node) parts.push(nodeButton(node, { step: index + 1 }));
        const edge = path.edges[index];
        if (edge) parts.push(`<button type="button" class="relationshipStoryConnector${state.tour && state.selectedEdgeId === edge.id ? " is-tour-target" : ""}" data-map-edge="${escapeHtml(edge.id)}" data-story-edge="${escapeHtml(edge.id)}" aria-label="${escapeHtml(`${c().why} ${tokenLabel(edge.relation)}`)}"><span aria-hidden="true">→</span><b>${escapeHtml(tokenLabel(edge.relation))}</b>${state.depth === "analyst" && edge.mechanism ? `<small>${escapeHtml(edge.mechanism)}</small>` : ""}</button>`);
      });
      return `<section class="relationshipStoryPath" aria-label="${escapeHtml(`${c().story} ${pathIndex + 1}`)}"><header><span>${escapeHtml(c().story)} ${pathIndex + 1}</span><b>${path.nodes.length} ${escapeHtml(c().step)}</b></header><div class="relationshipStoryFlow">${parts.join("")}</div></section>`;
    }).join("");
    return `<div class="relationshipPurposeView relationshipStory" role="region" aria-label="${escapeHtml(c().story)}"><p class="relationshipViewSummary"><b>${paths.length}</b> ${escapeHtml(c().storyPaths)}</p>${content}</div>`;
  }

  function evidenceHtml(data) {
    const grouped = new Map();
    data.edges.forEach((edge) => {
      if (!grouped.has(edge.source)) grouped.set(edge.source, []);
      grouped.get(edge.source).push(edge);
    });
    const clusters = [...grouped.entries()].map(([sourceId, edges]) => {
      const source = graph.resolve(sourceId);
      if (!source) return "";
      const supporting = edges.filter((edge) => edge.relation !== "countered_by");
      const counter = edges.filter((edge) => edge.relation === "countered_by");
      const evidenceColumn = (items, label, empty, tone) => `<section class="relationshipEvidenceColumn relationshipEvidenceColumn--${tone}"><h3>${escapeHtml(label)} <b>${items.length}</b></h3>${items.length ? items.map((edge) => {
        const target = graph.resolve(edge.target);
        return `<div class="relationshipEvidenceItem${state.tour && state.selectedEdgeId === edge.id ? " is-tour-target" : ""}">${target ? nodeButton(target, { compact: true }) : ""}<button type="button" data-map-edge="${escapeHtml(edge.id)}" data-evidence-edge="${escapeHtml(edge.id)}">${escapeHtml(c().why)}</button></div>`;
      }).join("") : `<p>${escapeHtml(empty)}</p>`}</section>`;
      return `<article class="relationshipEvidenceCluster"><section class="relationshipEvidenceClaim"><h3>${escapeHtml(c().evidenceClaim)}</h3>${nodeButton(source)}</section>${evidenceColumn(supporting, c().supporting, c().noSupporting, "support")}${evidenceColumn(counter, c().counter, c().noCounter, "counter")}</article>`;
    }).join("");
    return `<div class="relationshipPurposeView relationshipEvidence" role="region" aria-label="${escapeHtml(c().evidence)}">${clusters}</div>`;
  }

  function networkHtml(data) {
    const labels = pillarLabels();
    const pillars = root.Jarbou3iBiopolitics?.PILLARS || [];
    const lanes = pillars.map((pillar) => {
      const nodes = data.nodes.filter((node) => node.pillar === pillar.key);
      if (!nodes.length) return "";
      const detail = labels[pillar.key] || [tokenLabel(pillar.key), ""];
      return `<section class="relationshipLane" data-map-lane="${escapeHtml(pillar.key)}"><header><span>${escapeHtml(detail[0])}</span><b>${nodes.length}</b></header><div class="relationshipLaneNodes">${nodes.map(nodeButton).join("")}</div></section>`;
    }).join("");
    return `<div class="relationshipMapViewport" role="region" aria-label="${escapeHtml(c().mapLabel)}" tabindex="0"><div class="relationshipCanvas" style="--mapZoom:${state.zoom}"><svg class="relationshipEdges" aria-hidden="true"><defs><marker id="relationshipArrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z"></path></marker></defs>${data.edges.map((edge) => `<path data-map-edge-line="${escapeHtml(edge.id)}" data-source="${escapeHtml(edge.source)}" data-target="${escapeHtml(edge.target)}" class="relationshipEdge relationshipEdge--${escapeHtml(edge.family)}${state.tour && state.selectedEdgeId === edge.id ? " is-tour-target" : ""}"></path>`).join("")}</svg><div class="relationshipLanes relationshipLanes--network">${lanes}</div></div></div>`;
  }

  function spatialSceneStyle() {
    return `--spatial-yaw:${state.spatialYaw}deg;--spatial-yaw-inverse:${-state.spatialYaw}deg;--spatial-pitch:${state.spatialPitch}deg;--spatial-pitch-inverse:${-state.spatialPitch}deg;--spatial-zoom:${state.spatialZoom}`;
  }

  function spatialEdgeHtml(edge) {
    const dx = edge.to.x - edge.from.x;
    const dy = edge.to.y - edge.from.y;
    const dz = edge.to.z - edge.from.z;
    const planar = Math.hypot(dx, dy);
    const length = Math.max(1, Math.hypot(dx, dy, dz));
    const heading = Math.atan2(dy, dx) * 180 / Math.PI;
    const elevation = -Math.atan2(dz, planar || 1) * 180 / Math.PI;
    return `<i class="relationshipSpatialEdge relationshipSpatialEdge--${escapeHtml(edge.family)}" data-spatial-edge="${escapeHtml(edge.id)}" style="--ex:${edge.from.x}px;--ey:${edge.from.y}px;--ez:${edge.from.z}px;--el:${Math.round(length)}px;--er:${heading.toFixed(2)}deg;--ep:${elevation.toFixed(2)}deg" aria-hidden="true"></i>`;
  }

  function spatialHtml(data) {
    const projection = root.Jarbou3iBiopoliticsGraph.spatialProjection(
      graph,
      data.nodes.map((node) => node.id),
    );
    const visibleEdges = new Set(data.edges.map((edge) => edge.id));
    const labels = pillarLabels();
    const clusters = projection.clusters.map((cluster) =>
      `<div class="relationshipSpatialCluster" data-spatial-cluster="${escapeHtml(cluster.pillar)}" style="--sx:${cluster.x}px;--sy:${cluster.y}px;--sz:${cluster.z}px"><span>${escapeHtml(labels[cluster.pillar]?.[0] || tokenLabel(cluster.pillar))}</span><b>${cluster.count}</b></div>`,
    ).join("");
    const nodes = projection.nodes.map((position) => {
      const node = graph.resolve(position.id);
      return node ? nodeButton(node, {
        className: "relationshipSpatialNode",
        style: `--sx:${position.x}px;--sy:${position.y}px;--sz:${position.z}px`,
      }) : "";
    }).join("");
    const edges = projection.edges.filter((edge) => visibleEdges.has(edge.id)).map(spatialEdgeHtml).join("");
    const navigatorOptions = [...data.nodes]
      .sort((a, b) => a.label.localeCompare(b.label, lang))
      .map((node) => option(node.id, node.label, state.selectedId))
      .join("");
    return `<section class="relationshipSpatial" data-relationship-spatial="available" aria-labelledby="relationshipSpatialTitle"><header><div><h3 id="relationshipSpatialTitle">${escapeHtml(c().spatialLabel)}</h3><p>${escapeHtml(c().spatialInstructions)}</p></div><output class="relationshipSpatialOrientation" aria-live="polite">${escapeHtml(c().orientation)}: ${state.spatialYaw}° · ${state.spatialPitch}°</output></header><div class="relationshipSpatialControls" role="group" aria-label="${escapeHtml(c().spatialLabel)}"><button type="button" data-spatial-control="left" aria-label="${escapeHtml(c().orbitLeft)}">←</button><button type="button" data-spatial-control="right" aria-label="${escapeHtml(c().orbitRight)}">→</button><button type="button" data-spatial-control="up" aria-label="${escapeHtml(c().orbitUp)}">↑</button><button type="button" data-spatial-control="down" aria-label="${escapeHtml(c().orbitDown)}">↓</button><button type="button" data-spatial-control="farther" aria-label="${escapeHtml(c().farther)}">−</button><button type="button" data-spatial-control="closer" aria-label="${escapeHtml(c().closer)}">+</button><button type="button" data-spatial-reset>${escapeHtml(c().resetSpatial)}</button></div><label class="relationshipSpatialNavigator"><span>${escapeHtml(c().findSpatialRecord)}</span><select id="spatialRecordSelect">${option("", c().chooseSpatialRecord, state.selectedId)}${navigatorOptions}</select></label><div class="relationshipSpatialViewport" tabindex="0" role="region" aria-label="${escapeHtml(c().spatialLabel)}"><div class="relationshipSpatialScene" style="${spatialSceneStyle()}">${edges}${clusters}${nodes}</div></div></section>`;
  }

  function mapHtml(data) {
    if (state.mode === "story") return storyHtml(data);
    if (state.mode === "evidence") return evidenceHtml(data);
    return networkHtml(data);
  }

  function edgeButton(edge) {
    const source = graph.resolve(edge.source);
    const target = graph.resolve(edge.target);
    return `<button type="button" class="relationshipEdgeItem${state.selectedEdgeId === edge.id ? " is-selected" : ""}${state.tour && state.selectedEdgeId === edge.id ? " is-tour-target" : ""}" data-map-edge="${escapeHtml(edge.id)}"><span><b>${escapeHtml(source?.label || edge.source)}</b><i aria-hidden="true">→</i><b>${escapeHtml(target?.label || edge.target)}</b></span><small>${escapeHtml(tokenLabel(edge.relation))} · ${escapeHtml(tokenLabel(edge.family))}</small></button>`;
  }

  function listHtml(data) {
    return `<div class="relationshipList" role="region" aria-label="${escapeHtml(c().list)}"><section><h3>${escapeHtml(c().nodes)} <b>${data.nodes.length}</b></h3><div class="relationshipNodeList">${data.nodes.map(nodeButton).join("")}</div></section><section><h3>${escapeHtml(c().edges)} <b>${data.edges.length}</b></h3><div class="relationshipEdgeList">${data.edges.map(edgeButton).join("")}</div></section></div>`;
  }

  function edgeDetailsHtml(data) {
    const edge = graph.edges.find((item) => item.id === state.selectedEdgeId);
    if (!edge) return "";
    const source = graph.resolve(edge.source);
    const target = graph.resolve(edge.target);
    const visible = data.edges.some((item) => item.id === edge.id);
    const analystSource = state.depth === "analyst" ? `<div><dt>${escapeHtml(c().source)}</dt><dd>${escapeHtml(edge.provenance)} · <code>${escapeHtml(edge.path)}</code></dd></div>` : "";
    return `<aside class="relationshipEdgeDetails relationshipInspection" aria-live="polite"><header><div><span>${escapeHtml(tokenLabel(edge.family))}</span><h3>${escapeHtml(c().edgeDetails)}</h3></div><button type="button" data-clear-selection aria-label="${escapeHtml(c().clearSelection)}">×</button></header>${visible ? "" : `<div class="relationshipSelectionNotice"><p>${escapeHtml(c().hiddenSelection)}</p><button type="button" data-reveal-selection>${escapeHtml(c().reveal)}</button></div>`}<dl><div><dt>${escapeHtml(c().from)}</dt><dd>${escapeHtml(source?.label || edge.source)}${state.depth === "analyst" ? ` <b dir="ltr">[${escapeHtml(edge.source)}]</b>` : ""}</dd></div><div><dt>${escapeHtml(c().to)}</dt><dd>${escapeHtml(target?.label || edge.target)}${state.depth === "analyst" ? ` <b dir="ltr">[${escapeHtml(edge.target)}]</b>` : ""}</dd></div><div><dt>${escapeHtml(c().relation)}</dt><dd>${escapeHtml(tokenLabel(edge.relation))}</dd></div><div class="relationshipWhy"><dt>${escapeHtml(c().why)}</dt><dd>${escapeHtml(edgeExplanation(edge))}</dd></div>${analystSource}</dl></aside>`;
  }

  function nodeDetailsHtml(data) {
    const node = graph.resolve(state.selectedId);
    if (!node || state.selectedEdgeId) return "";
    const visible = data.nodes.some((item) => item.id === node.id);
    const incoming = graph.incoming(node.id).length;
    const outgoing = graph.outgoing(node.id).length;
    return `<aside class="relationshipNodeDetails relationshipInspection" aria-live="polite"><header><div><span>${escapeHtml(graph.typeLabel(node.type))}</span><h3>${escapeHtml(node.label)}</h3></div><button type="button" data-clear-selection aria-label="${escapeHtml(c().clearSelection)}">×</button></header>${visible ? "" : `<div class="relationshipSelectionNotice"><p>${escapeHtml(c().hiddenSelection)}</p><button type="button" data-reveal-selection>${escapeHtml(c().reveal)}</button></div>`}<dl><div><dt>${escapeHtml(c().pillar)}</dt><dd>${escapeHtml(pillarLabels()[node.pillar]?.[0] || tokenLabel(node.pillar))}</dd></div>${node.confidence ? `<div><dt>${escapeHtml(c().confidence)}</dt><dd>${escapeHtml(tokenLabel(node.confidence))}</dd></div>` : ""}<div><dt>${escapeHtml(c().connected)}</dt><dd>${incoming + outgoing}</dd></div>${state.depth === "analyst" ? `<div><dt>ID</dt><dd><code dir="ltr">${escapeHtml(node.id)}</code></dd></div>` : ""}</dl><div class="relationshipInspectionActions"><button type="button" data-open-selected>${escapeHtml(c().openRecord)}</button><button type="button" data-focus-selected>${escapeHtml(c().oneHop)}</button></div></aside>`;
  }

  function inspectionHtml(data) {
    return state.selectedEdgeId ? edgeDetailsHtml(data) : nodeDetailsHtml(data);
  }

  function walkthroughHtml(data) {
    const edges = walkthroughEdges(data);
    const edge = activeTourEdge(data);
    if (!state.tour || !edge) return "";
    const source = graph.resolve(edge.source);
    const target = graph.resolve(edge.target);
    const last = state.tourIndex === edges.length - 1;
    const progress = Math.round(((state.tourIndex + 1) / edges.length) * 100);
    return `<section class="relationshipWalkthrough" aria-labelledby="relationshipWalkthroughTitle"><header><div><span>${state.tourIndex + 1} ${escapeHtml(c().of)} ${edges.length}</span><h3 id="relationshipWalkthroughTitle">${escapeHtml(c().walkthrough)}</h3></div><button type="button" data-tour-stop aria-label="${escapeHtml(c().stopTour)}">×</button></header><div class="relationshipWalkthroughProgress" role="progressbar" aria-valuemin="1" aria-valuemax="${edges.length}" aria-valuenow="${state.tourIndex + 1}"><i style="width:${progress}%"></i></div><div class="relationshipWalkthroughPath"><strong>${escapeHtml(source?.label || edge.source)}</strong><span><b>${escapeHtml(tokenLabel(edge.relation))}</b><i aria-hidden="true">→</i></span><strong>${escapeHtml(target?.label || edge.target)}</strong></div><p><b>${escapeHtml(c().why)}</b> ${escapeHtml(edgeExplanation(edge))}</p><footer><button type="button" data-tour-step="previous"${state.tourIndex === 0 ? " disabled" : ""}>${escapeHtml(c().previous)}</button><button type="button" data-tour-step="next">${escapeHtml(last ? c().finish : c().next)}</button></footer></section>`;
  }

  function controlsHtml(data) {
    const types = unique(graph.nodes.map((node) => node.type));
    const relations = unique(graph.edges.filter((edge) => state.families.has(edge.family)).map((edge) => edge.relation));
    const labels = pillarLabels();
    const modeToggle = `<div class="relationshipModes" role="radiogroup" aria-label="${escapeHtml(c().title)}">${["story", "evidence", "network"].map((mode) => `<button id="relationshipMode-${mode}" type="button" role="radio" aria-checked="${state.mode === mode}" tabindex="${state.mode === mode ? "0" : "-1"}" data-map-mode="${mode}" class="${state.mode === mode ? "active" : ""}">${escapeHtml(c()[mode])}</button>`).join("")}</div>`;
    const depthToggle = `<div class="relationshipDepth" role="group" aria-label="${escapeHtml(c().depth)}">${["guided", "analyst"].map((depth) => `<button type="button" data-map-depth="${depth}" aria-pressed="${state.depth === depth}" class="${state.depth === depth ? "active" : ""}">${escapeHtml(c()[depth])}</button>`).join("")}</div>`;
    const viewToggle = `<div class="relationshipViewToggle"><button type="button" data-map-view="map" aria-pressed="${state.view === "map"}" class="${state.view === "map" ? "active" : ""}">${escapeHtml(c().map)}</button><button type="button" data-map-view="list" aria-pressed="${state.view === "list"}" class="${state.view === "list" ? "active" : ""}">${escapeHtml(c().list)}</button><button type="button" data-map-view="spatial" aria-pressed="${state.view === "spatial"}" class="${state.view === "spatial" ? "active" : ""}"${spatialAvailable ? "" : ` disabled aria-disabled="true" title="${escapeHtml(c().spatialUnavailable)}"`}>${escapeHtml(c().spatial)}</button></div>`;
    const overlayToggle = `<div class="relationshipOverlayToggle" role="group" aria-label="${escapeHtml(c().overlay)}">${["none", "temporal", "comparative"].map((overlay) => `<button type="button" data-map-overlay="${overlay}" aria-pressed="${state.overlay === overlay}" class="${state.overlay === overlay ? "active" : ""}">${escapeHtml(c()[overlay])}</button>`).join("")}</div>`;
    const filters = `<div class="relationshipToolbar"><label><span>${escapeHtml(c().pillar)}</span><select id="relationshipPillar">${option("", c().all, state.pillar)}${(root.Jarbou3iBiopolitics?.PILLARS || []).map((pillar) => option(pillar.key, labels[pillar.key]?.[0] || tokenLabel(pillar.key), state.pillar)).join("")}</select></label><label><span>${escapeHtml(c().type)}</span><select id="relationshipType">${option("", c().all, state.type)}${types.map((type) => option(type, graph.typeLabel(type), state.type)).join("")}</select></label><label><span>${escapeHtml(c().confidence)}</span><select id="relationshipConfidence">${option("", c().all, state.confidence)}${["high", "medium", "low"].map((value) => option(value, tokenLabel(value), state.confidence)).join("")}</select></label><label><span>${escapeHtml(c().verification)}</span><select id="relationshipVerification">${option("", c().all, state.verification)}${unique(graph.nodes.filter((node) => node.type === "evidence").map((node) => node.record?.verification_status)).map((value) => option(value, tokenLabel(value), state.verification)).join("")}</select></label><label><span>${escapeHtml(c().relation)}</span><select id="relationshipRelation">${option("", c().all, state.relation)}${relations.map((value) => option(value, tokenLabel(value), state.relation)).join("")}</select></label></div>`;
    const layers = `<div class="relationshipLayers"><fieldset><legend class="srOnly">${escapeHtml(c().edges)}</legend>${[["explicit", c().explicit], ["evidence", c().evidenceEdges], ["structural", c().structural]].map(([family, label]) => `<label><input type="checkbox" data-map-family="${family}"${state.families.has(family) ? " checked" : ""}><span>${escapeHtml(label)}</span></label>`).join("")}</fieldset><label class="relationshipNeighborhood"><input id="relationshipNeighborhood" type="checkbox"${state.neighborhood ? " checked" : ""}${state.selectedId ? "" : " disabled"}><span>${escapeHtml(c().neighborhood)}</span></label>${state.mode === "network" && state.view === "map" ? `<div class="relationshipZoom"><button type="button" data-map-zoom="out" aria-label="${escapeHtml(c().zoomOut)}">−</button><button type="button" data-map-zoom="fit">${escapeHtml(c().fit)}</button><button type="button" data-map-zoom="in" aria-label="${escapeHtml(c().zoomIn)}">+</button></div>` : ""}</div>`;
    const actions = `<div class="relationshipPrimaryActions"><button type="button" data-tour-toggle aria-pressed="${state.tour}">${escapeHtml(state.tour ? c().stopTour : c().startTour)}</button><button type="button" data-focus-toggle aria-pressed="${state.focused}">${escapeHtml(state.focused ? c().exitFocus : c().focus)}</button></div>`;
    const saved = `<div class="relationshipSavedViews"><label><span>${escapeHtml(c().savedViews)}</span><select id="relationshipSavedView">${option("", c().noSavedView, state.savedViewId)}${savedViews.map((item) => option(item.id, item.name, state.savedViewId)).join("")}</select></label><button type="button" data-save-view>${escapeHtml(c().saveView)}</button><button type="button" data-restore-view${state.savedViewId ? "" : " disabled"}>${escapeHtml(c().restoreView)}</button><button type="button" data-delete-view${state.savedViewId ? "" : " disabled"}>${escapeHtml(c().deleteView)}</button></div>`;
    const capabilityNote = spatialAvailable ? "" : `<p class="relationshipCapabilityNote">${escapeHtml(c().spatialUnavailable)}</p>`;
    return `<div class="relationshipCommandBar">${modeToggle}${depthToggle}${viewToggle}${overlayToggle}${actions}</div>${capabilityNote}<div class="relationshipSearchRow"><label class="relationshipSearch"><span>${escapeHtml(c().search)}</span><input id="relationshipSearch" type="search" value="${escapeHtml(state.query)}" placeholder="${escapeHtml(c().searchPlaceholder)}"></label><button type="button" data-map-reset>${escapeHtml(c().reset)}</button></div>${saved}<details class="relationshipAdvanced"${state.depth === "analyst" ? " open" : ""}><summary>${escapeHtml(c().advanced)}</summary>${filters}${layers}</details><div class="relationshipLegend" aria-label="${escapeHtml(c().legend)}">${[["explicit", c().explicit], ["evidence", c().evidenceEdges], ["structural", c().structural]].map(([family, label]) => `<span class="relationshipLegend--${family}"><i aria-hidden="true"></i>${escapeHtml(label)}</span>`).join("")}</div><p class="relationshipCount" role="status" aria-live="polite"><b>${data.nodes.length}</b> ${escapeHtml(c().nodes)} · <b>${data.edges.length}</b> ${escapeHtml(c().edges)}</p>`;
  }

  function resultsHtml(data, inspection = inspectionHtml(data)) {
    const walkthrough = walkthroughHtml(data);
    const content = data.nodes.length
      ? state.view === "map" ? mapHtml(data) : state.view === "spatial" ? spatialHtml(data) : listHtml(data)
      : `<div class="relationshipEmpty">${escapeHtml(c().empty)}</div>`;
    return `${overlayHtml()}${walkthrough}<div class="relationshipWorkspace"><div class="relationshipView">${content}</div>${inspection}</div>`;
  }

  function renderSearchResults() {
    if (!container || !graph) return;
    const results = container.querySelector("[data-relationship-results]");
    if (!results) {
      render("relationshipSearch");
      return;
    }
    renderEpoch += 1;
    const data = visibleData();
    const inspection = inspectionHtml(data);
    container.querySelector(".relationshipExplorer")?.classList.toggle("has-inspection", Boolean(inspection));
    results.innerHTML = resultsHtml(data, inspection);
    const count = container.querySelector(".relationshipCount");
    if (count) count.innerHTML = `<b>${data.nodes.length}</b> ${escapeHtml(c().nodes)} · <b>${data.edges.length}</b> ${escapeHtml(c().edges)}`;
    bindEvents();
    if (state.view === "map" && state.mode === "network") observeAndDraw();
    else resizeObserver?.disconnect();
  }

  function render(focusId = "") {
    if (!container || !graph) return;
    if (searchRenderFrame) {
      cancelAnimationFrame(searchRenderFrame);
      searchRenderFrame = 0;
    }
    renderEpoch += 1;
    if (state.view === "spatial" && !spatialAvailable) state.view = "list";
    const data = visibleData();
    const inspection = inspectionHtml(data);
    container.innerHTML = `<section class="relationshipExplorer${state.focused ? " is-focus" : ""}${inspection ? " has-inspection" : ""}" dir="${lang === "ar" ? "rtl" : "ltr"}" role="${state.focused ? "dialog" : "region"}"${state.focused ? ` aria-modal="true" aria-label="${escapeHtml(c().focus)}"` : ` aria-label="${escapeHtml(c().title)}"`}><header class="relationshipIntro"><div><span>2D · ${escapeHtml(c()[state.mode])}</span><h2>${escapeHtml(c().title)}</h2><p>${escapeHtml(c().subtitle)}</p></div>${state.focused ? `<button type="button" data-focus-toggle class="relationshipFocusExit">${escapeHtml(c().exitFocus)}</button>` : ""}</header>${controlsHtml(data)}<div data-relationship-results>${resultsHtml(data, inspection)}</div></section>`;
    bindEvents();
    if (state.view === "map" && state.mode === "network") observeAndDraw();
    else resizeObserver?.disconnect();
    if (focusId) focusAfterRender(() => document.getElementById(focusId));
  }

  function updateFilter(key, value, focusId) {
    state[key] = value;
    state.selectedEdgeId = "";
    render(focusId);
  }

  function applySpatialTransform(announce = true) {
    const scene = container?.querySelector(".relationshipSpatialScene");
    if (scene) scene.setAttribute("style", spatialSceneStyle());
    if (announce) {
      const output = container?.querySelector(".relationshipSpatialOrientation");
      if (output) output.textContent = `${c().orientation}: ${Math.round(state.spatialYaw)}° · ${Math.round(state.spatialPitch)}°`;
    }
  }

  function updateSpatial(action) {
    if (action === "left") state.spatialYaw -= 12;
    if (action === "right") state.spatialYaw += 12;
    if (action === "up") state.spatialPitch = Math.max(18, state.spatialPitch - 6);
    if (action === "down") state.spatialPitch = Math.min(72, state.spatialPitch + 6);
    if (action === "closer") state.spatialZoom = Math.min(1.08, state.spatialZoom + 0.08);
    if (action === "farther") state.spatialZoom = Math.max(0.58, state.spatialZoom - 0.08);
    if (action === "reset") Object.assign(state, { spatialYaw: -18, spatialPitch: 48, spatialZoom: 0.68 });
    state.spatialYaw = normalizeYaw(state.spatialYaw);
    applySpatialTransform();
  }

  function bindEvents() {
    // Search-only renders preserve the command bar. Assigning event-handler
    // properties makes rebinding idempotent for those persistent controls;
    // addEventListener would accumulate another activation on every search.
    const bindClick = (selector, handler) => {
      const element = container.querySelector(selector);
      if (element) element.onclick = handler;
    };
    container.onkeydown = (event) => {
      if (event.key === "Escape" && state.focused) {
        event.preventDefault();
        state.focused = false;
        document.documentElement.classList.remove("relationshipFocusOpen");
        render();
        focusAfterRender(() => container.querySelector("[data-focus-toggle]"), { force: true });
        return;
      }
      if (event.key !== "Tab" || !state.focused) return;
      const focusable = [...container.querySelectorAll('button:not([disabled]),input:not([disabled]),select:not([disabled]),summary,[tabindex]:not([tabindex="-1"])')]
        .filter((element) => element.getClientRects().length && !element.closest("[hidden]"));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    const modeButtons = [...container.querySelectorAll("[data-map-mode]")];
    modeButtons.forEach((button, index) => {
      button.onclick = () => setMode(button.dataset.mapMode);
      button.onkeydown = (event) => {
        let target = null;
        if (["ArrowRight", "ArrowDown"].includes(event.key)) target = modeButtons[(index + 1) % modeButtons.length];
        if (["ArrowLeft", "ArrowUp"].includes(event.key)) target = modeButtons[(index - 1 + modeButtons.length) % modeButtons.length];
        if (event.key === "Home") target = modeButtons[0];
        if (event.key === "End") target = modeButtons[modeButtons.length - 1];
        if (target) {
          event.preventDefault();
          setMode(target.dataset.mapMode);
        }
      };
    });
    const inputs = {
      relationshipPillar: "pillar", relationshipType: "type", relationshipConfidence: "confidence",
      relationshipVerification: "verification", relationshipRelation: "relation",
    };
    Object.entries(inputs).forEach(([id, key]) => {
      const element = container.querySelector(`#${id}`);
      if (element) element.onchange = () => updateFilter(key, element.value, id);
    });
    const search = container.querySelector("#relationshipSearch");
    if (search) search.oninput = () => {
      const value = search.value;
      const epoch = renderEpoch;
      state.query = value;
      cancelAnimationFrame(searchRenderFrame);
      searchRenderFrame = requestAnimationFrame(() => {
        searchRenderFrame = 0;
        if (!container || state.query !== value || renderEpoch !== epoch) return;
        renderSearchResults();
      });
    };
    container.querySelectorAll("[data-map-family]").forEach((input) => input.onchange = () => {
      input.checked ? state.families.add(input.dataset.mapFamily) : state.families.delete(input.dataset.mapFamily);
      state.relation = ""; render();
    });
    const neighborhood = container.querySelector("#relationshipNeighborhood");
    if (neighborhood) neighborhood.onchange = () => updateFilter("neighborhood", neighborhood.checked, "relationshipNeighborhood");
    container.querySelectorAll("[data-map-view]").forEach((button) => button.onclick = () => {
      if (button.dataset.mapView === "spatial" && !spatialAvailable) return;
      state.view = button.dataset.mapView;
      render();
    });
    container.querySelectorAll("[data-map-depth]").forEach((button) => button.onclick = () => {
      state.depth = button.dataset.mapDepth;
      render();
    });
    container.querySelectorAll("[data-map-overlay]").forEach((button) => button.onclick = () => {
      state.overlay = button.dataset.mapOverlay;
      render();
      const overlay = state.overlay;
      focusAfterRender(() => container.querySelector(`[data-map-overlay="${CSS.escape(overlay)}"]`), { force: true });
    });
    container.querySelectorAll("[data-spatial-control]").forEach((button) => {
      button.onclick = () => updateSpatial(button.dataset.spatialControl);
    });
    bindClick("[data-spatial-reset]", () => updateSpatial("reset"));
    const spatialRecordSelect = container.querySelector("#spatialRecordSelect");
    if (spatialRecordSelect) spatialRecordSelect.onchange = () => {
      state.selectedId = graph.resolve(spatialRecordSelect.value) ? spatialRecordSelect.value : "";
      state.selectedEdgeId = "";
      state.tour = false;
      render("spatialRecordSelect");
    };
    const spatialViewport = container.querySelector(".relationshipSpatialViewport");
    if (spatialViewport) {
      spatialViewport.onkeydown = (event) => {
        if (event.target !== spatialViewport) return;
        const actions = {
          ArrowLeft: "left", ArrowRight: "right", ArrowUp: "up", ArrowDown: "down",
          "+": "closer", "=": "closer", "-": "farther", Home: "reset",
        };
        const action = actions[event.key];
        if (!action) return;
        event.preventDefault();
        updateSpatial(action);
      };
      let drag = null;
      spatialViewport.onpointerdown = (event) => {
        if (event.button !== 0 || event.target.closest("button")) return;
        drag = { x: event.clientX, y: event.clientY, yaw: state.spatialYaw, pitch: state.spatialPitch };
        spatialViewport.setPointerCapture?.(event.pointerId);
        spatialViewport.classList.add("is-dragging");
      };
      spatialViewport.onpointermove = (event) => {
        if (!drag) return;
        state.spatialYaw = drag.yaw + (event.clientX - drag.x) * 0.24;
        state.spatialPitch = Math.max(18, Math.min(72, drag.pitch - (event.clientY - drag.y) * 0.16));
        applySpatialTransform(false);
      };
      const stopDrag = (event) => {
        if (!drag) return;
        drag = null;
        state.spatialYaw = normalizeYaw(state.spatialYaw);
        if (spatialViewport.hasPointerCapture?.(event.pointerId)) {
          spatialViewport.releasePointerCapture(event.pointerId);
        }
        spatialViewport.classList.remove("is-dragging");
        applySpatialTransform();
      };
      spatialViewport.onpointerup = stopDrag;
      spatialViewport.onpointercancel = stopDrag;
    }
    const savedSelect = container.querySelector("#relationshipSavedView");
    if (savedSelect) savedSelect.onchange = () => { state.savedViewId = savedSelect.value; render("relationshipSavedView"); };
    bindClick("[data-save-view]", () => {
      const id = `view-${Date.now().toString(36)}-${savedViews.length + 1}`;
      const name = `${c()[state.mode]} · ${c()[state.overlay]} · ${savedViews.length + 1}`;
      savedViews.push({ id, name, snapshot: viewSnapshot() });
      state.savedViewId = id;
      persistSavedViews();
      render();
    });
    bindClick("[data-restore-view]", () => {
      const saved = savedViews.find((item) => item.id === state.savedViewId);
      if (!saved) return;
      restoreSnapshot(saved.snapshot);
      render();
    });
    bindClick("[data-delete-view]", () => {
      savedViews = savedViews.filter((item) => item.id !== state.savedViewId);
      state.savedViewId = "";
      persistSavedViews();
      render();
    });
    container.querySelectorAll("[data-map-node]").forEach((button) => {
      button.onclick = () => {
        state.selectedId = button.dataset.mapNode; state.selectedEdgeId = ""; state.tour = false; render();
        const next = container.querySelector(`[data-map-node="${CSS.escape(state.selectedId)}"]`);
        onOpenNode?.(graph.resolve(state.selectedId), next);
      };
      button.onkeydown = (event) => {
        if (event.key === " " || event.key === "Spacebar" || event.code === "Space") {
          event.preventDefault();
          state.selectedId = button.dataset.mapNode;
          state.selectedEdgeId = "";
          state.tour = false;
          render();
        }
        if (event.key === "Escape") { event.preventDefault(); state.selectedId = ""; state.neighborhood = false; render(); }
      };
    });
    container.querySelectorAll("[data-map-edge]").forEach((button) => button.onclick = () => {
      state.selectedEdgeId = button.dataset.mapEdge; state.selectedId = ""; render();
      container.querySelector(".relationshipEdgeDetails")?.scrollIntoView({ block: "nearest" });
    });
    bindClick("[data-clear-selection]", () => {
      state.selectedEdgeId = ""; state.selectedId = ""; state.neighborhood = false; state.tour = false; render();
    });
    bindClick("[data-reveal-selection]", () => {
      Object.assign(state, { mode: "network", view: "map", query: "", pillar: "", type: "", confidence: "", verification: "", relation: "", neighborhood: false });
      state.families = new Set(["explicit", "evidence", "structural"]);
      render();
      requestAnimationFrame(() => {
        const id = state.selectedId || graph.edges.find((edge) => edge.id === state.selectedEdgeId)?.source;
        if (id) container.querySelector(`[data-map-node="${CSS.escape(id)}"]`)?.scrollIntoView({ block: "center", inline: "center" });
      });
    });
    bindClick("[data-open-selected]", (event) => {
      const node = graph.resolve(state.selectedId);
      if (node) onOpenNode?.(node, event.currentTarget);
    });
    bindClick("[data-focus-selected]", () => {
      if (!state.selectedId) return;
      Object.assign(state, { mode: "network", view: "map", query: "", pillar: "", type: "", confidence: "", verification: "", relation: "", neighborhood: true });
      state.families = new Set(["explicit", "evidence", "structural"]);
      render();
    });
    container.querySelectorAll("[data-focus-toggle]").forEach((button) => button.onclick = () => {
      const entering = !state.focused;
      state.focused = entering;
      document.documentElement.classList.toggle("relationshipFocusOpen", entering);
      render();
      focusAfterRender(() => container.querySelector(entering ? ".relationshipFocusExit" : "[data-focus-toggle]"), { force: true });
    });
    bindClick("[data-tour-toggle]", () => {
      state.tour = !state.tour;
      state.tourIndex = 0;
      if (state.tour) {
        const first = walkthroughEdges(visibleData())[0];
        state.selectedEdgeId = first?.id || "";
        state.selectedId = "";
      }
      render();
      const tourActive = state.tour;
      focusAfterRender(() => container.querySelector(tourActive ? "[data-tour-step=next]" : "[data-tour-toggle]"), { force: true });
    });
    bindClick("[data-tour-stop]", () => { state.tour = false; render(); });
    container.querySelectorAll("[data-tour-step]").forEach((button) => button.onclick = () => {
      const edges = walkthroughEdges(visibleData());
      if (button.dataset.tourStep === "previous") state.tourIndex = Math.max(0, state.tourIndex - 1);
      else if (state.tourIndex >= edges.length - 1) state.tour = false;
      else state.tourIndex += 1;
      render();
      const tourActive = state.tour;
      focusAfterRender(() => container.querySelector(tourActive ? "[data-tour-step=next]" : "[data-tour-toggle]"), { force: true });
    });
    container.querySelectorAll("[data-map-zoom]").forEach((button) => button.onclick = () => {
      const action = button.dataset.mapZoom;
      state.zoom = action === "fit" ? 0.82 : Math.max(0.7, Math.min(1.4, state.zoom + (action === "in" ? 0.1 : -0.1)));
      render();
    });
    bindClick("[data-map-reset]", () => {
      Object.assign(state, { query: "", pillar: "", type: "", confidence: "", verification: "", relation: "", neighborhood: false, selectedId: "", selectedEdgeId: "", zoom: 1, tour: false, tourIndex: 0, overlay: "none", spatialYaw: -18, spatialPitch: 48, spatialZoom: 0.68 });
      setMode("story");
    });
  }

  function drawEdges() {
    const canvas = container?.querySelector(".relationshipCanvas");
    const svg = container?.querySelector(".relationshipEdges");
    if (!canvas || !svg) return;
    const canvasRect = canvas.getBoundingClientRect();
    const zoom = state.zoom || 1;
    svg.setAttribute("viewBox", `0 0 ${canvas.scrollWidth} ${canvas.scrollHeight}`);
    svg.setAttribute("width", canvas.scrollWidth);
    svg.setAttribute("height", canvas.scrollHeight);
    svg.querySelectorAll("[data-map-edge-line]").forEach((path) => {
      const source = container.querySelector(`[data-map-node="${CSS.escape(path.dataset.source)}"]`);
      const target = container.querySelector(`[data-map-node="${CSS.escape(path.dataset.target)}"]`);
      if (!source || !target) return;
      const a = source.getBoundingClientRect();
      const b = target.getBoundingClientRect();
      const x1 = (a.left + a.width / 2 - canvasRect.left) / zoom;
      const y1 = (a.top + a.height / 2 - canvasRect.top) / zoom;
      const x2 = (b.left + b.width / 2 - canvasRect.left) / zoom;
      const y2 = (b.top + b.height / 2 - canvasRect.top) / zoom;
      const bend = Math.max(40, Math.abs(x2 - x1) * 0.42);
      const sign = x2 >= x1 ? 1 : -1;
      path.setAttribute("d", `M ${x1} ${y1} C ${x1 + bend * sign} ${y1}, ${x2 - bend * sign} ${y2}, ${x2} ${y2}`);
    });
  }

  function observeAndDraw() {
    resizeObserver?.disconnect();
    let frame = 0;
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(drawEdges);
    };
    resizeObserver = new ResizeObserver(schedule);
    const canvas = container.querySelector(".relationshipCanvas");
    if (canvas) resizeObserver.observe(canvas);
    schedule();
  }

  function mount(target, nextGraph, options = {}) {
    container = target;
    graph = nextGraph;
    analysis = options.analysis || null;
    spatialAvailable = detectSpatialCapability();
    if (state.selectedId && !graph.resolve(state.selectedId)) state.selectedId = "";
    if (state.selectedEdgeId && !graph.edges.some((edge) => edge.id === state.selectedEdgeId)) state.selectedEdgeId = "";
    lang = copy[options.lang] ? options.lang : "en";
    onOpenNode = options.onOpenNode || null;
    loadSavedViews(options.analysisScope || analysis?.analysis_id || analysis?.subject?.title || "analysis");
    if ((options.mobileDefault || !spatialAvailable && state.view === "spatial") && !state.selectedId) state.view = "list";
    render();
  }

  function focusNode(id) {
    if (!graph?.resolve(id)) return;
    state.selectedId = id;
    state.neighborhood = true;
    state.view = "map";
    state.mode = "network";
    state.families = new Set(["explicit", "evidence", "structural"]);
    render();
    focusAfterRender(() => container?.querySelector(`[data-map-node="${CSS.escape(id)}"]`), { force: true });
  }

  function deactivate() {
    state.focused = false;
    state.tour = false;
    document.documentElement.classList.remove("relationshipFocusOpen");
    resizeObserver?.disconnect();
  }

  root.Jarbou3iRelationshipExplorer = Object.freeze({ mount, focusNode, deactivate });
})(typeof window !== "undefined" ? window : globalThis);
