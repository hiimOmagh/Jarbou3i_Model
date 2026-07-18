/* Jarbou3i Model — accessible named-reference UI */
(function attachReferenceUi(root) {
  "use strict";

  const escapeHtml = (value) =>
    String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  const labels = {
    en: { close: "Close relationship details", connections: "Connections", incoming: "Referenced by", outgoing: "References", none: "No indexed connections", open: "Open full record", showMap: "Show in map", details: "Relationship details", pillar: "Analysis pillar", confidence: "Confidence" },
    ar: { close: "إغلاق تفاصيل العلاقة", connections: "العلاقات", incoming: "تُشير إليه", outgoing: "يُشير إلى", none: "لا توجد علاقات مفهرسة", open: "فتح السجل الكامل", showMap: "إظهار في الخريطة", details: "تفاصيل العلاقة", pillar: "محور التحليل", confidence: "الثقة" },
    fr: { close: "Fermer les détails", connections: "Connexions", incoming: "Référencé par", outgoing: "Références", none: "Aucune connexion indexée", open: "Ouvrir la fiche complète", showMap: "Afficher sur la carte", details: "Détails de la relation", pillar: "Pilier d’analyse", confidence: "Confiance" },
  };

  let graph = null;
  let lang = "en";
  let onOpenRecord = null;
  let onShowInMap = null;
  let returnFocus = null;
  let wired = false;

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

  function relationHtml(edge, direction) {
    const otherId = direction === "incoming" ? edge.source : edge.target;
    const other = graph.resolve(otherId);
    const relation = String(edge.relation || "related_to").replaceAll("_", " ");
    return `<li><button type="button" data-reference-id="${escapeHtml(otherId)}"><span>${escapeHtml(other?.label || otherId)}</span><small>${escapeHtml(otherId)} · ${escapeHtml(relation)}</small></button></li>`;
  }

  function populate(node) {
    const copy = labels[lang] || labels.en;
    const rootElement = ensureInspector();
    rootElement.dir = lang === "ar" ? "rtl" : "ltr";
    rootElement.querySelector(".referenceInspectorClose").setAttribute("aria-label", copy.close);
    rootElement.querySelector(".referenceInspectorClose").textContent = "×";
    rootElement.querySelector("#referenceInspectorType").textContent = `${graph.typeLabel(node.type)} · ${node.id}`;
    rootElement.querySelector("#referenceInspectorTitle").textContent = node.label;
    const incoming = graph.incoming(node.id);
    const outgoing = graph.outgoing(node.id);
    const connections = incoming.length + outgoing.length
      ? `<section class="referenceConnections"><h3>${escapeHtml(copy.connections)}</h3>${incoming.length ? `<h4>${escapeHtml(copy.incoming)}</h4><ul>${incoming.map((edge) => relationHtml(edge, "incoming")).join("")}</ul>` : ""}${outgoing.length ? `<h4>${escapeHtml(copy.outgoing)}</h4><ul>${outgoing.map((edge) => relationHtml(edge, "outgoing")).join("")}</ul>` : ""}</section>`
      : `<p class="referenceEmpty">${escapeHtml(copy.none)}</p>`;
    rootElement.querySelector("#referenceInspectorBody").innerHTML = `${node.subtitle && node.subtitle !== node.label ? `<p class="referenceInspectorSummary">${escapeHtml(node.subtitle)}</p>` : ""}<dl class="referenceInspectorFacts"><div><dt>${escapeHtml(copy.pillar)}</dt><dd>${escapeHtml(node.pillar.replaceAll("_", " "))}</dd></div>${node.confidence ? `<div><dt>${escapeHtml(copy.confidence)}</dt><dd>${escapeHtml(node.confidence)}</dd></div>` : ""}</dl>${connections}`;
    const openButton = rootElement.querySelector("#referenceOpenRecord");
    openButton.textContent = copy.open;
    openButton.dataset.referenceOpenRecord = node.id;
    openButton.hidden = typeof onOpenRecord !== "function";
    const mapButton = rootElement.querySelector("#referenceShowMap");
    mapButton.textContent = copy.showMap;
    mapButton.dataset.referenceShowMap = node.id;
    mapButton.hidden = typeof onShowInMap !== "function";
  }

  function open(id, trigger) {
    const node = graph?.resolve(id);
    if (!node) return;
    returnFocus = trigger || document.activeElement;
    const rootElement = ensureInspector();
    populate(node);
    rootElement.hidden = false;
    document.documentElement.classList.add("referenceInspectorOpen");
    document.querySelector("main")?.setAttribute("inert", "");
    requestAnimationFrame(() => rootElement.querySelector(".referenceInspector").focus());
  }

  function close() {
    const rootElement = document.getElementById("referenceInspectorRoot");
    if (!rootElement || rootElement.hidden) return;
    rootElement.hidden = true;
    document.documentElement.classList.remove("referenceInspectorOpen");
    document.querySelector("main")?.removeAttribute("inert");
    if (returnFocus?.isConnected) returnFocus.focus();
    returnFocus = null;
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
    const focusable = [...rootElement.querySelectorAll('button:not([hidden]),[href],[tabindex]:not([tabindex="-1"])')].filter((element) => !element.disabled);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first.focus();
    }
  }

  function wire() {
    if (wired) return;
    document.addEventListener("click", (event) => {
      const reference = event.target.closest?.("[data-reference-id]");
      if (reference) {
        event.preventDefault();
        open(reference.dataset.referenceId, reference);
        return;
      }
      if (event.target.closest?.("[data-reference-close]")) close();
      const openButton = event.target.closest?.("[data-reference-open-record]");
      if (openButton && typeof onOpenRecord === "function") {
        const node = graph?.resolve(openButton.dataset.referenceOpenRecord);
        close();
        if (node) onOpenRecord(node);
      }
      const mapButton = event.target.closest?.("[data-reference-show-map]");
      if (mapButton && typeof onShowInMap === "function") {
        const node = graph?.resolve(mapButton.dataset.referenceShowMap);
        close();
        if (node) onShowInMap(node);
      }
    });
    document.addEventListener("keydown", handleKeydown);
    wired = true;
  }

  function bind(nextGraph, options = {}) {
    graph = nextGraph;
    lang = labels[options.lang] ? options.lang : "en";
    onOpenRecord = options.onOpenRecord || null;
    onShowInMap = options.onShowInMap || null;
    wire();
  }

  root.Jarbou3iReferenceUi = Object.freeze({ bind, renderText, open, close });
})(typeof window !== "undefined" ? window : globalThis);
