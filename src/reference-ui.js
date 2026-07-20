/* Jarbou3i Model — accessible, cross-lens inspection UI */
(function attachReferenceUi(root) {
  "use strict";

  const escapeHtml = (value) =>
    String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  const copyByLanguage = {
    en: {
      close: "Close inspection details", details: "Inspection details",
      connections: "Linked records", incoming: "Referenced by", outgoing: "References",
      none: "No indexed connections", open: "Open full record", showMap: "Show in map",
      identity: "Canonical identity", type: "Record type", pillar: "Analysis pillar",
      canonicalId: "Canonical ID", path: "Canonical path", confidence: "Confidence",
      provenance: "Provenance", sourceTitle: "Source", sourceLocator: "Locator",
      sourceDate: "Source date", sourceType: "Source type", sourceTier: "Source tier",
      sourceNote: "Source note", verificationStatus: "Declared verification",
      verifiedBy: "Verified by", verificationDate: "Verification date",
      claimSourceFit: "Claim–source fit", sourceStatus: "Traceability",
      claimStatus: "Claim status", reviewStatus: "Independent review",
      approvalEligible: "Approval eligible", unavailable: "Not provided in the canonical record",
      evidence: "Evidence balance", supporting: "Supporting evidence",
      counter: "Counter-evidence records", counterText: "Authored counter-evidence",
      audit: "Audit details", schemaVersion: "Schema version", contractStatus: "Contract status",
      modelStatus: "Model status", analysisId: "Analysis ID", uncertainty: "Uncertainty",
      limitations: "Limitations", evidenceStrength: "Evidence strength",
      unresolvedLinks: "Unresolved links", occurrences: "Occurrences",
      occurrenceCanonical: "Canonical record", occurrenceRelationship: "Relationship reference",
      occurrenceReference: "Authored reference", occurrenceOpen: "Open occurrence",
      evidenceTrail: "Evidence trail", trailSupporting: "Authored support",
      trailCounter: "Authored counter-records", backReferences: "Evidence back-references",
      citedAsSupport: "Cited as support", citedAsCounter: "Cited as counter-evidence",
      permanentLink: "Permanent record link",
      yes: "Yes", no: "No",
    },
    ar: {
      close: "إغلاق تفاصيل الفحص", details: "تفاصيل الفحص",
      connections: "السجلات المرتبطة", incoming: "تُشير إليه", outgoing: "يُشير إلى",
      none: "لا توجد علاقات مفهرسة", open: "فتح السجل الكامل", showMap: "إظهار في الخريطة",
      identity: "الهوية النظامية", type: "نوع السجل", pillar: "محور التحليل",
      canonicalId: "المعرّف النظامي", path: "المسار النظامي", confidence: "الثقة",
      provenance: "المصدر والتتبّع", sourceTitle: "المصدر", sourceLocator: "موضع المصدر",
      sourceDate: "تاريخ المصدر", sourceType: "نوع المصدر", sourceTier: "رتبة المصدر",
      sourceNote: "ملاحظة المصدر", verificationStatus: "التحقق المعلن",
      verifiedBy: "تحقق بواسطة", verificationDate: "تاريخ التحقق",
      claimSourceFit: "ملاءمة الادعاء للمصدر", sourceStatus: "قابلية التتبع",
      claimStatus: "حالة الادعاء", reviewStatus: "المراجعة المستقلة",
      approvalEligible: "مؤهل للاعتماد", unavailable: "غير وارد في السجل النظامي",
      evidence: "توازن الأدلة", supporting: "الأدلة الداعمة",
      counter: "سجلات الأدلة المضادة", counterText: "الدليل المضاد المؤلف",
      audit: "تفاصيل التدقيق", schemaVersion: "إصدار المخطط", contractStatus: "حالة العقد",
      modelStatus: "حالة النموذج", analysisId: "معرّف التحليل", uncertainty: "عدم اليقين",
      limitations: "القيود", evidenceStrength: "قوة الدليل",
      unresolvedLinks: "الروابط غير المحلولة", occurrences: "مواضع الظهور",
      occurrenceCanonical: "السجل النظامي", occurrenceRelationship: "مرجع علاقة",
      occurrenceReference: "مرجع مؤلف", occurrenceOpen: "فتح موضع الظهور",
      evidenceTrail: "مسار الأدلة", trailSupporting: "الدعم المؤلف",
      trailCounter: "سجلات الأدلة المضادة المؤلفة", backReferences: "الإحالات العكسية للأدلة",
      citedAsSupport: "مذكور كدليل داعم", citedAsCounter: "مذكور كدليل مضاد",
      permanentLink: "رابط السجل الدائم",
      yes: "نعم", no: "لا",
    },
    fr: {
      close: "Fermer les détails d’inspection", details: "Détails d’inspection",
      connections: "Fiches liées", incoming: "Référencé par", outgoing: "Références",
      none: "Aucune connexion indexée", open: "Ouvrir la fiche complète", showMap: "Afficher sur la carte",
      identity: "Identité canonique", type: "Type de fiche", pillar: "Pilier d’analyse",
      canonicalId: "Identifiant canonique", path: "Chemin canonique", confidence: "Confiance",
      provenance: "Provenance", sourceTitle: "Source", sourceLocator: "Localisation",
      sourceDate: "Date de la source", sourceType: "Type de source", sourceTier: "Niveau de source",
      sourceNote: "Note de source", verificationStatus: "Vérification déclarée",
      verifiedBy: "Vérifié par", verificationDate: "Date de vérification",
      claimSourceFit: "Adéquation énoncé–source", sourceStatus: "Traçabilité",
      claimStatus: "Statut de l’énoncé", reviewStatus: "Revue indépendante",
      approvalEligible: "Éligible à l’approbation", unavailable: "Non fourni dans la fiche canonique",
      evidence: "Équilibre des preuves", supporting: "Preuves à l’appui",
      counter: "Fiches de contre-preuve", counterText: "Contre-preuve rédigée",
      audit: "Détails d’audit", schemaVersion: "Version du schéma", contractStatus: "Statut du contrat",
      modelStatus: "Statut du modèle", analysisId: "Identifiant de l’analyse", uncertainty: "Incertitude",
      limitations: "Limites", evidenceStrength: "Force de la preuve",
      unresolvedLinks: "Liens non résolus", occurrences: "Occurrences",
      occurrenceCanonical: "Fiche canonique", occurrenceRelationship: "Référence relationnelle",
      occurrenceReference: "Référence rédigée", occurrenceOpen: "Ouvrir l’occurrence",
      evidenceTrail: "Parcours probatoire", trailSupporting: "Appuis rédigés",
      trailCounter: "Fiches de contre-preuve rédigées", backReferences: "Rétro-références probatoires",
      citedAsSupport: "Cité comme appui", citedAsCounter: "Cité comme contre-preuve",
      permanentLink: "Lien permanent de la fiche",
      yes: "Oui", no: "Non",
    },
  };

  let graph = null;
  let lang = "en";
  let onOpenRecord = null;
  let onShowInMap = null;
  let onOpenOccurrence = null;
  let returnFocus = null;
  let activeNode = null;
  let activeInspection = null;
  let wired = false;

  const humanize = (value) => String(value || "—").replaceAll("_", " ");
  const validHttpUrl = (value) => {
    try { return ["http:", "https:"].includes(new URL(String(value || "")).protocol); }
    catch { return false; }
  };
  const valueHtml = (value) => `<span>${escapeHtml(humanize(value))}</span>`;

  function renderText(value, currentGraph) {
    const activeGraph = currentGraph || graph;
    const graphApi = root.Jarbou3iBiopoliticsGraph;
    if (!graphApi?.replaceReferences) return escapeHtml(value);
    return graphApi.replaceReferences(value, activeGraph, (chunk, node) => {
      if (!node) return escapeHtml(chunk);
      const type = activeGraph.typeLabel(node.type);
      const accessible = `${node.label}; ${type}; ${node.id}`;
      return `<button class="referenceChip" type="button" data-reference-id="${escapeHtml(node.id)}" data-reference-type="${escapeHtml(node.type)}" aria-label="${escapeHtml(accessible)}"><span class="referenceChipLabel">${escapeHtml(node.label)}</span><span class="referenceChipId" aria-hidden="true">${escapeHtml(node.id)}</span></button>`;
    });
  }

  function ensureInspector() {
    let rootElement = document.getElementById("referenceInspectorRoot");
    if (rootElement) return rootElement;
    rootElement = document.createElement("div");
    rootElement.id = "referenceInspectorRoot";
    rootElement.className = "referenceInspectorRoot";
    rootElement.hidden = true;
    rootElement.innerHTML = `<div class="referenceInspectorBackdrop" data-reference-close></div><aside class="referenceInspector" role="dialog" aria-modal="true" aria-labelledby="referenceInspectorTitle" tabindex="-1"><header class="referenceInspectorHead"><div><span class="referenceInspectorType" id="referenceInspectorType"></span><h2 id="referenceInspectorTitle"></h2></div><button class="referenceInspectorClose" type="button" data-reference-close></button></header><div class="referenceInspectorBody" id="referenceInspectorBody"></div><footer class="referenceInspectorFooter"><button class="btn" id="referenceShowMap" type="button"></button><button class="btn primary" id="referenceOpenRecord" type="button"></button></footer></aside>`;
    document.body.append(rootElement);
    return rootElement;
  }

  function fact(label, value, options = {}) {
    if (value === "" || value === null || value === undefined || (Array.isArray(value) && !value.length)) return "";
    const content = options.link && validHttpUrl(value)
      ? `<a href="${escapeHtml(value)}" target="_blank" rel="noopener noreferrer">${escapeHtml(options.linkLabel || value)}</a>`
      : escapeHtml(Array.isArray(value) ? value.join(" · ") : options.raw ? value : humanize(value));
    return `<div><dt>${escapeHtml(label)}</dt><dd>${content}</dd></div>`;
  }

  function relationHtml(edge, direction) {
    const otherId = direction === "incoming" ? edge.source : edge.target;
    const other = graph.resolve(otherId);
    const relation = humanize(edge.relation || "related_to");
    return `<li><button type="button" data-reference-id="${escapeHtml(otherId)}"><span>${escapeHtml(other?.label || otherId)}</span><small>${escapeHtml(otherId)} · ${escapeHtml(relation)}</small></button></li>`;
  }

  function referenceList(ids, emptyCopy) {
    if (!ids?.length) return `<p class="referenceEmpty compact">${escapeHtml(emptyCopy)}</p>`;
    return `<ul class="referenceRecordList">${ids.map((id) => {
      const node = graph.resolve(id);
      return `<li>${node ? `<button type="button" data-reference-id="${escapeHtml(id)}"><span>${escapeHtml(node.label)}</span><small>${escapeHtml(id)}</small></button>` : `<span>${escapeHtml(id)}</span>`}</li>`;
    }).join("")}</ul>`;
  }

  function provenanceHtml(inspection, copy) {
    const provenance = inspection?.provenance || {};
    const facts = [
      fact(copy.sourceTitle, provenance.sourceUrl || provenance.sourceTitle, provenance.sourceUrl ? { link: true, linkLabel: provenance.sourceTitle || provenance.sourceUrl } : {}),
      fact(copy.sourceLocator, provenance.sourceLocator), fact(copy.sourceDate, provenance.sourceDate),
      fact(copy.sourceType, provenance.sourceType), fact(copy.sourceTier, provenance.sourceTier),
      fact(copy.sourceNote, provenance.sourceNote), fact(copy.verificationStatus, provenance.verificationStatus),
      fact(copy.verifiedBy, provenance.verifiedBy), fact(copy.verificationDate, provenance.verificationDate),
      fact(copy.claimSourceFit, provenance.claimSourceFit), fact(copy.sourceStatus, provenance.sourceStatus),
      fact(copy.claimStatus, provenance.claimStatus), fact(copy.reviewStatus, provenance.reviewStatus),
      provenance.sourceStatus ? fact(copy.approvalEligible, provenance.approvalEligible ? copy.yes : copy.no) : "",
    ].filter(Boolean).join("");
    return `<section class="referenceInspectorSection" data-inspection-section="provenance"><h3>${escapeHtml(copy.provenance)}</h3>${facts ? `<dl class="referenceInspectorFacts">${facts}</dl>` : `<p class="referenceEmpty compact">${escapeHtml(copy.unavailable)}</p>`}</section>`;
  }

  function evidenceHtml(inspection, copy) {
    const evidence = inspection?.evidence || {};
    const counterText = evidence.counterEvidence?.length
      ? `<div class="referenceEvidenceText"><h4>${escapeHtml(copy.counterText)}</h4><ul>${evidence.counterEvidence.map((value) => `<li>${escapeHtml(value)}</li>`).join("")}</ul></div>`
      : "";
    return `<section class="referenceInspectorSection" data-inspection-section="evidence"><h3>${escapeHtml(copy.evidence)}</h3><div class="referenceEvidenceGrid"><div><h4>${escapeHtml(copy.supporting)}</h4>${referenceList(evidence.supportingIds, copy.unavailable)}</div><div><h4>${escapeHtml(copy.counter)}</h4>${referenceList(evidence.counterIds, copy.unavailable)}</div></div>${counterText}</section>`;
  }

  function relationshipEvidenceHtml(inspection, copy) {
    const relationship = inspection?.relationship || {};
    const trail = relationship.evidenceTrail || {};
    const backlinks = relationship.backReferences?.evidence || [];
    const supporting = (trail.supporting || []).map((item) => item.targetId);
    const counter = (trail.counter || []).map((item) => item.targetId);
    const supportBacklinks = backlinks
      .filter((item) => item.role === "supporting")
      .map((item) => item.ownerId);
    const counterBacklinks = backlinks
      .filter((item) => item.role === "counter")
      .map((item) => item.ownerId);
    return `<section class="referenceInspectorSection" data-inspection-section="evidence-trail"><h3>${escapeHtml(copy.evidenceTrail)}</h3><div class="referenceEvidenceGrid"><div><h4>${escapeHtml(copy.trailSupporting)}</h4>${referenceList(supporting, copy.unavailable)}</div><div><h4>${escapeHtml(copy.trailCounter)}</h4>${referenceList(counter, copy.unavailable)}</div></div>${backlinks.length ? `<div class="referenceEvidenceBacklinks"><h4>${escapeHtml(copy.backReferences)}</h4><div class="referenceEvidenceGrid"><div><h5>${escapeHtml(copy.citedAsSupport)}</h5>${referenceList(supportBacklinks, copy.unavailable)}</div><div><h5>${escapeHtml(copy.citedAsCounter)}</h5>${referenceList(counterBacklinks, copy.unavailable)}</div></div></div>` : ""}</section>`;
  }

  function auditHtml(inspection, copy) {
    const audit = inspection?.audit || {};
    const facts = [
      fact(copy.schemaVersion, audit.schemaVersion), fact(copy.contractStatus, audit.contractStatus),
      fact(copy.modelStatus, audit.modelStatus), fact(copy.analysisId, audit.analysisId),
      fact(copy.uncertainty, audit.uncertainty), fact(copy.limitations, audit.limitations),
      fact(copy.evidenceStrength, audit.evidenceStrength), fact(copy.unresolvedLinks, audit.unresolvedLinks),
    ].filter(Boolean).join("");
    return `<section class="referenceInspectorSection" data-inspection-section="audit"><h3>${escapeHtml(copy.audit)}</h3>${facts ? `<dl class="referenceInspectorFacts auditFacts">${facts}</dl>` : `<p class="referenceEmpty compact">${escapeHtml(copy.unavailable)}</p>`}</section>`;
  }

  function occurrencesHtml(inspection, copy) {
    const kindLabel = {
      canonical: copy.occurrenceCanonical,
      relationship: copy.occurrenceRelationship,
      reference: copy.occurrenceReference,
    };
    const occurrences = inspection?.occurrences || [];
    const content = occurrences.length
      ? `<ol class="referenceOccurrences">${occurrences.map((occurrence, index) => `<li><button type="button" data-reference-occurrence="${index}" aria-label="${escapeHtml(`${copy.occurrenceOpen}: ${occurrence.path}`)}"><span>${escapeHtml(kindLabel[occurrence.kind] || copy.occurrenceReference)}</span><code>${escapeHtml(occurrence.path)}</code></button></li>`).join("")}</ol>`
      : `<p class="referenceEmpty compact">${escapeHtml(copy.unavailable)}</p>`;
    return `<section class="referenceInspectorSection" data-inspection-section="occurrences"><h3>${escapeHtml(copy.occurrences)} <span class="referenceSectionCount">${occurrences.length}</span></h3>${content}</section>`;
  }

  function populate(node) {
    const copy = copyByLanguage[lang] || copyByLanguage.en;
    const rootElement = ensureInspector();
    const inspection = graph.inspect?.(node.id) || {
      canonicalId: node.id, label: node.label, type: node.type, pillar: node.pillar,
      path: node.path, confidence: node.confidence, summary: node.subtitle,
      provenance: {}, evidence: {}, audit: {}, occurrences: [],
    };
    activeNode = node;
    activeInspection = inspection;
    rootElement.dir = lang === "ar" ? "rtl" : "ltr";
    rootElement.querySelector(".referenceInspectorClose").setAttribute("aria-label", copy.close);
    rootElement.querySelector(".referenceInspectorClose").textContent = "×";
    rootElement.querySelector("#referenceInspectorType").textContent = `${graph.typeLabel(node.type)} · ${node.id}`;
    rootElement.querySelector("#referenceInspectorTitle").textContent = node.label;
    const incoming = graph.incoming(node.id);
    const outgoing = graph.outgoing(node.id);
    const connections = incoming.length + outgoing.length
      ? `<section class="referenceConnections" data-inspection-section="linked"><h3>${escapeHtml(copy.connections)}</h3>${incoming.length ? `<h4>${escapeHtml(copy.incoming)}</h4><ul>${incoming.map((edge) => relationHtml(edge, "incoming")).join("")}</ul>` : ""}${outgoing.length ? `<h4>${escapeHtml(copy.outgoing)}</h4><ul>${outgoing.map((edge) => relationHtml(edge, "outgoing")).join("")}</ul>` : ""}</section>`
      : `<section class="referenceConnections" data-inspection-section="linked"><h3>${escapeHtml(copy.connections)}</h3><p class="referenceEmpty compact">${escapeHtml(copy.none)}</p></section>`;
    const permanentLink = inspection.relationship?.deepLink
      ? `<div><dt>${escapeHtml(copy.permanentLink)}</dt><dd><a class="referencePermanentLink" href="${escapeHtml(inspection.relationship.deepLink)}"><code>${escapeHtml(inspection.relationship.deepLink)}</code></a></dd></div>`
      : "";
    const identity = `<section class="referenceInspectorSection" data-inspection-section="identity"><h3>${escapeHtml(copy.identity)}</h3><dl class="referenceInspectorFacts">${fact(copy.type, graph.typeLabel(node.type))}${fact(copy.pillar, inspection.pillar)}${fact(copy.canonicalId, inspection.canonicalId, { raw: true })}${fact(copy.path, inspection.path, { raw: true })}${fact(copy.confidence, inspection.confidence)}${permanentLink}</dl></section>`;
    rootElement.querySelector("#referenceInspectorBody").innerHTML = `${inspection.summary && inspection.summary !== inspection.label ? `<p class="referenceInspectorSummary">${escapeHtml(inspection.summary)}</p>` : ""}${identity}${provenanceHtml(inspection, copy)}${evidenceHtml(inspection, copy)}${relationshipEvidenceHtml(inspection, copy)}${connections}${auditHtml(inspection, copy)}${occurrencesHtml(inspection, copy)}`;
    const openButton = rootElement.querySelector("#referenceOpenRecord");
    openButton.textContent = copy.open;
    openButton.dataset.referenceOpenRecord = node.id;
    openButton.hidden = typeof onOpenRecord !== "function";
    const mapButton = rootElement.querySelector("#referenceShowMap");
    mapButton.textContent = copy.showMap;
    mapButton.dataset.referenceShowMap = node.id;
    mapButton.hidden = typeof onShowInMap !== "function";
    rootElement.querySelector(".referenceInspectorFooter").classList.toggle("single", openButton.hidden || mapButton.hidden);
  }

  function open(id, trigger) {
    const node = graph?.resolve(id);
    if (!node) return;
    const rootElement = ensureInspector();
    if (rootElement.hidden) returnFocus = trigger || document.activeElement;
    populate(node);
    rootElement.hidden = false;
    document.documentElement.classList.add("referenceInspectorOpen");
    document.querySelector("main")?.setAttribute("inert", "");
    requestAnimationFrame(() => rootElement.querySelector(".referenceInspector").focus());
  }

  function close({ restoreFocus = true } = {}) {
    const rootElement = document.getElementById("referenceInspectorRoot");
    if (!rootElement || rootElement.hidden) return;
    const closingId = activeNode?.id;
    rootElement.hidden = true;
    document.documentElement.classList.remove("referenceInspectorOpen");
    document.querySelector("main")?.removeAttribute("inert");
    if (restoreFocus && returnFocus?.isConnected) returnFocus.focus();
    returnFocus = null;
    activeNode = null;
    activeInspection = null;
    const linkedNode = graph?.resolveDeepLink?.(window.location.hash);
    if (closingId && linkedNode?.id === closingId) {
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    }
  }

  function handleKeydown(event) {
    const rootElement = document.getElementById("referenceInspectorRoot");
    if (!rootElement || rootElement.hidden) return;
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }
    if (event.key !== "Tab") return;
    const focusable = [...rootElement.querySelectorAll('button:not([hidden]),a[href],[tabindex]:not([tabindex="-1"])')].filter((element) => !element.disabled);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault(); first.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); last.focus();
    }
  }

  function wire() {
    if (wired) return;
    document.addEventListener("click", (event) => {
      const occurrenceButton = event.target.closest?.("[data-reference-occurrence]");
      if (occurrenceButton) {
        event.preventDefault();
        const occurrence = activeInspection?.occurrences?.[Number(occurrenceButton.dataset.referenceOccurrence)];
        const node = activeNode;
        close({ restoreFocus: false });
        if (node && occurrence && typeof onOpenOccurrence === "function") onOpenOccurrence(node, occurrence);
        return;
      }
      const reference = event.target.closest?.("[data-reference-id]");
      if (reference) {
        event.preventDefault();
        open(reference.dataset.referenceId, reference);
        return;
      }
      if (event.target.closest?.("[data-reference-close]")) {
        close();
        return;
      }
      const openButton = event.target.closest?.("[data-reference-open-record]");
      if (openButton && typeof onOpenRecord === "function") {
        const node = graph?.resolve(openButton.dataset.referenceOpenRecord);
        close({ restoreFocus: false });
        if (node) onOpenRecord(node);
        return;
      }
      const mapButton = event.target.closest?.("[data-reference-show-map]");
      if (mapButton && typeof onShowInMap === "function") {
        const node = graph?.resolve(mapButton.dataset.referenceShowMap);
        close({ restoreFocus: false });
        if (node) onShowInMap(node);
      }
    });
    document.addEventListener("keydown", handleKeydown);
    window.addEventListener("hashchange", () => {
      const node = graph?.resolveDeepLink?.(window.location.hash);
      if (node) open(node.id, document.activeElement);
    });
    wired = true;
  }

  function bind(nextGraph, options = {}) {
    graph = nextGraph;
    lang = copyByLanguage[options.lang] ? options.lang : "en";
    onOpenRecord = options.onOpenRecord || null;
    onShowInMap = options.onShowInMap || null;
    onOpenOccurrence = options.onOpenOccurrence || null;
    wire();
    requestAnimationFrame(() => {
      const node = graph?.resolveDeepLink?.(window.location.hash);
      if (node) open(node.id, null);
    });
  }

  root.Jarbou3iReferenceUi = Object.freeze({ bind, renderText, open, close });
})(typeof window !== "undefined" ? window : globalThis);
