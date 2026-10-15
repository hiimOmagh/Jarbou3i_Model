/* Jarbou3i Model — accessible, lossless Biopolitical v2 report */
(function attachBiopoliticalReport(root) {
  "use strict";

  const arr = (value) => (Array.isArray(value) ? value : []);
  const text = (value) =>
    value === null || value === undefined ? "" : String(value);
  const escapeHtml = (value) =>
    text(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  const safeId = (value) => text(value).replace(/[^A-Za-z0-9_-]/g, "-");
  // A record ID as an anchor: every character other than a letter, digit, or
  // "-" is spelled out, so IDs that differ only in punctuation keep their own.
  const anchorId = (value) => text(value).replace(/[^A-Za-z0-9-]/g, (char) => `_${char.codePointAt(0).toString(16)}_`);
  const isHttpUrl = (value) => /^https?:\/\/[^\s]+$/i.test(text(value).trim());

  const COPY = {
    en: {
      skip: "Skip to report content",
      title: "Biopolitical Analysis Report — Training Map v2",
      chain: "Question → Human function → Power system → Mechanism → Meaning/classification → Intervention test → Distribution → Evidence → Agency/alternatives.",
      analyticalReadiness: "Decision readiness",
      readinessNote: "Capped by source traceability and independent human review.",
      analyticalCoverage: "Analytical coverage",
      sourceTraceability: "Source traceability",
      humanReview: "Independent human review",
      publication: "Publication gate",
      publishReady: "Publish-ready",
      reviewNeeded: "Review needed",
      doNotPublish: "Do not publish yet",
      blockedNote: "Not publication-ready",
      passedNote: "Automated gates passed; final editorial verification remains required.",
      evidenceVerification: "Evidence verification",
      verifiedEvidence: "verified evidence records",
      executive: "Executive judgment",
      reviewFirst: "Review first",
      contents: "Report contents",
      expand: "Expand all",
      collapse: "Collapse all",
      print: "Print / Save PDF",
      records: "records",
      noRecords: "No authored records.",
      conclusion: "Calibrated conclusion and self-audit",
      conclusionHint: "What is supported, disputed, unknown, or capable of changing the judgment.",
      atlas: "Relationship and context atlas",
      atlasHint: "Authored, evidentiary, and structural connections; analytical groupings never invent chronology.",
      references: "Reference directory",
      referencesHint: "Human-readable names preserve every canonical identifier.",
      canonical: "Complete canonical contract",
      canonicalHint: "Lossless machine-readable payload for verification, re-import, and archival.",
      inspectJson: "Inspect canonical JSON",
      blocking: "Blocking findings",
      migration: "Migration warnings",
      auditNotes: "Self-audit notes",
      namedRelationships: "Named relationships",
      source: "Open source",
      evidenceRecord: "Evidence record",
      sourceUnavailable: "No portable source link supplied",
      officialContract: "Canonical analysis contract",
      schema: "schema",
      authored: "Authored causal connections",
      evidence: "Evidence connections",
      structural: "Structural references",
      time: "Canonical time signals",
      timeCaution: "Analytical grouping only; no chronology is inferred.",
      comparisons: "International comparisons",
      basis: "Basis",
      similarities: "Similarities",
      differences: "Differences",
      transfer: "Transfer limits",
      historical: "Historical continuity",
      dated: "Dated evidence",
      immediate: "Immediate effects",
      medium: "Medium-term adaptations and dependencies",
      future: "Future and intergenerational signals",
    },
    ar: {
      skip: "انتقل إلى محتوى التقرير",
      title: "تقرير التحليل الحيوسياسي — خريطة التدريب 2",
      chain: "السؤال ← الوظيفة الإنسانية ← منظومة القوة ← الآلية ← المعنى/التصنيف ← اختبار التدخل ← التوزيع ← الأدلة ← الفاعلية/البدائل.",
      analyticalReadiness: "جاهزية القرار",
      readinessNote: "مقيّدة بقابلية تتبع المصادر والمراجعة البشرية المستقلة.",
      analyticalCoverage: "التغطية التحليلية",
      sourceTraceability: "قابلية تتبع المصادر",
      humanReview: "المراجعة البشرية المستقلة",
      publication: "بوابة النشر",
      publishReady: "جاهز للنشر",
      reviewNeeded: "يحتاج مراجعة",
      doNotPublish: "لا تنشر بعد",
      blockedNote: "غير جاهز للنشر",
      passedNote: "اجتاز البوابات الآلية؛ ويبقى التحقق التحريري النهائي مطلوبًا.",
      evidenceVerification: "التحقق من الأدلة",
      verifiedEvidence: "سجلات أدلة متحقق منها",
      executive: "الحكم التنفيذي",
      reviewFirst: "راجع أولًا",
      contents: "محتويات التقرير",
      expand: "توسيع الكل",
      collapse: "طي الكل",
      print: "طباعة / حفظ PDF",
      records: "سجلات",
      noRecords: "لا توجد سجلات مؤلفة.",
      conclusion: "الخلاصة المُعايرة والمراجعة الذاتية",
      conclusionHint: "ما هو مدعوم أو متنازع عليه أو مجهول أو قادر على تغيير الحكم.",
      atlas: "أطلس العلاقات والسياق",
      atlasHint: "روابط مؤلفة ودليلية وبنيوية؛ ولا يستنتج التجميع التحليلي تسلسلًا زمنيًا.",
      references: "دليل المراجع",
      referencesHint: "تحافظ الأسماء المقروءة على كل معرّف نظامي.",
      canonical: "العقد النظامي الكامل",
      canonicalHint: "حمولة كاملة قابلة للقراءة آليًا للتحقق وإعادة الاستيراد والأرشفة.",
      inspectJson: "افحص JSON النظامي",
      blocking: "العوائق",
      migration: "تحذيرات الترحيل",
      auditNotes: "ملاحظات التدقيق الذاتي",
      namedRelationships: "العلاقات المسماة",
      source: "فتح المصدر",
      evidenceRecord: "سجل دليل",
      sourceUnavailable: "لم يُقدَّم رابط مصدر قابل للنقل",
      officialContract: "عقد التحليل النظامي",
      schema: "المخطط",
      authored: "العلاقات السببية المؤلَّفة",
      evidence: "علاقات الأدلة",
      structural: "المراجع البنيوية",
      time: "الإشارات الزمنية النظامية",
      timeCaution: "تجميع تحليلي فقط؛ لا يُستنتج تسلسل زمني.",
      comparisons: "المقارنات الدولية",
      basis: "الأساس",
      similarities: "أوجه التشابه",
      differences: "الاختلافات",
      transfer: "حدود النقل",
      historical: "الاستمرارية التاريخية",
      dated: "الأدلة المؤرخة",
      immediate: "الآثار الفورية",
      medium: "التكيفات والتبعيات متوسطة المدى",
      future: "إشارات المستقبل وبين الأجيال",
    },
    fr: {
      skip: "Aller au contenu du rapport",
      title: "Rapport d’analyse biopolitique — Carte d’entraînement v2",
      chain: "Question → Fonction humaine → Système de pouvoir → Mécanisme → Sens/classification → Test d’intervention → Distribution → Preuves → Agentivité/alternatives.",
      analyticalReadiness: "Préparation à la décision",
      readinessNote: "Plafonnée par la traçabilité des sources et la revue humaine indépendante.",
      analyticalCoverage: "Couverture analytique",
      sourceTraceability: "Traçabilité des sources",
      humanReview: "Revue humaine indépendante",
      publication: "Contrôle de publication",
      publishReady: "Prêt à publier",
      reviewNeeded: "Révision nécessaire",
      doNotPublish: "Ne pas publier",
      blockedNote: "Non prêt pour publication",
      passedNote: "Les contrôles automatisés sont satisfaits ; la vérification éditoriale finale reste requise.",
      evidenceVerification: "Vérification des preuves",
      verifiedEvidence: "preuves vérifiées",
      executive: "Jugement exécutif",
      reviewFirst: "À vérifier en priorité",
      contents: "Contenu du rapport",
      expand: "Tout développer",
      collapse: "Tout réduire",
      print: "Imprimer / Enregistrer en PDF",
      records: "éléments",
      noRecords: "Aucun élément rédigé.",
      conclusion: "Conclusion calibrée et auto-audit",
      conclusionHint: "Ce qui est étayé, contesté, inconnu ou susceptible de modifier le jugement.",
      atlas: "Atlas des relations et du contexte",
      atlasHint: "Connexions rédigées, probatoires et structurelles ; les regroupements analytiques n’inventent jamais une chronologie.",
      references: "Répertoire des références",
      referencesHint: "Les noms lisibles préservent chaque identifiant canonique.",
      canonical: "Contrat canonique complet",
      canonicalHint: "Contenu intégral lisible par machine pour vérification, réimport et archivage.",
      inspectJson: "Inspecter le JSON canonique",
      blocking: "Blocages",
      migration: "Alertes de migration",
      auditNotes: "Notes d’auto-audit",
      namedRelationships: "Relations nommées",
      source: "Ouvrir la source",
      evidenceRecord: "Élément de preuve",
      sourceUnavailable: "Aucun lien de source portable fourni",
      officialContract: "Contrat d’analyse canonique",
      schema: "schéma",
      authored: "Connexions causales rédigées",
      evidence: "Connexions probatoires",
      structural: "Références structurelles",
      time: "Signaux temporels canoniques",
      timeCaution: "Regroupement analytique uniquement ; aucune chronologie n’est inférée.",
      comparisons: "Comparaisons internationales",
      basis: "Base",
      similarities: "Similarités",
      differences: "Différences",
      transfer: "Limites de transfert",
      historical: "Continuité historique",
      dated: "Preuves datées",
      immediate: "Effets immédiats",
      medium: "Adaptations et dépendances à moyen terme",
      future: "Signaux futurs et intergénérationnels",
    },
  };

  // scoreTone: the app's score bands (ok, warn, crit or none) for a figure.
  function build({ analysis, lang, version, bio, graphApi, scoreTone = () => "" }) {
    const theme = root.Jarbou3iReportTheme;
    if (!analysis || !bio || !graphApi || !theme) {
      throw new Error("Biopolitical report dependencies are unavailable.");
    }
    const locale = ["ar", "en", "fr"].includes(lang) ? lang : "en";
    const c = COPY[locale];
    const dir = locale === "ar" ? "rtl" : "ltr";
    // A relationship reads right to left in Arabic, so its arrow points left.
    const arrow = dir === "rtl" ? "←" : "→";
    const a = bio.sanitizePortableValue(bio.normalize(analysis));
    const score = bio.scores(a);
    const health = bio.health(a, locale);
    const graph = graphApi.build(a, locale);
    const labels = bio.ui(locale, "pillars");
    const evidence = arr(a.evidence?.items);
    const gate = health.publishable ? "passed" : "blocked";
    // The gate's verdict and tone, as the app's overview gives them.
    const [verdictKey, verdictTone] = health.publishable
      ? ["publishReady", "ok"]
      : bio.reviewable(a, score)
        ? ["reviewNeeded", "warn"]
        : ["doNotPublish", "crit"];
    const verdict = c[verdictKey];
    const readinessTone = scoreTone(score.overall);
    const canonicalJson = JSON.stringify(a).replaceAll("<", "\\u003c");

    const renderReference = (node) =>
      `<a class="referenceChip" href="#ref-${anchorId(node.id)}" title="${escapeHtml(graph.typeLabel(node.type))}"><span>${escapeHtml(node.label)}</span><small>[${escapeHtml(node.id)}]</small></a>`;
    const renderValue = (value) => {
      const portable = bio.sanitizePortableText(value);
      const referenceIds = text(portable)
        .split(/\s*[·,]\s*/u)
        .map((item) => item.trim())
        .filter(Boolean);
      const referenceNodes = referenceIds.map((id) =>
        graph.nodes.find((node) => node.id === id),
      );
      if (
        referenceIds.length > 1 &&
        referenceNodes.every(Boolean)
      ) {
        return `<span class="referenceGroup">${referenceNodes.map(renderReference).join("")}</span>`;
      }
      return graphApi.replaceReferences(
        portable,
        graph,
        (chunk, node) => node ? renderReference(node) : escapeHtml(chunk),
      );
    };
    const display = (value) => escapeHtml(bio.displayToken(locale, value));
    const sourceLink = (url) =>
      isHttpUrl(url)
        ? `<a class="sourceLink" href="${escapeHtml(text(url).trim())}" target="_blank" rel="noopener noreferrer">${escapeHtml(c.source)} <span aria-hidden="true">↗</span></a>`
        : `<span class="sourceMissing">${escapeHtml(c.sourceUnavailable)}</span>`;
    const renderList = (title, values) => {
      const items = arr(values).filter((value) => text(value).trim());
      return items.length
        ? `<div class="recordList">${title ? `<h4>${escapeHtml(title)}</h4>` : ""}<ul>${items.map((value) => `<li>${renderValue(value)}</li>`).join("")}</ul></div>`
        : "";
    };
    const renderRecord = (record, index, pillarKey) => {
      // Explanation records come first, then one record per evidence item in order.
      const evidenceItem = pillarKey === "evidence_explanations"
        ? evidence[index - arr(a.competing_explanations).length] || null
        : null;
      const recordId = evidenceItem?.id || "";
      return `<article class="recordCard${evidenceItem ? " evidenceCard" : ""}"${recordId ? ` id="evidence-${anchorId(recordId)}" data-evidence-id="${escapeHtml(recordId)}"` : ""}>
        <header><div>${evidenceItem ? `<span class="eyebrow">${escapeHtml(c.evidenceRecord)} · ${escapeHtml(recordId)}</span>` : ""}<h3>${renderValue(record.title || "—")}</h3></div>${evidenceItem ? sourceLink(evidenceItem.source_url) : ""}</header>
        ${record.summary ? `<p class="summary">${renderValue(record.summary)}</p>` : ""}
        ${record.meta.length ? `<div class="tags">${record.meta.map((item) => `<span>${display(item)}</span>`).join("")}</div>` : ""}
        ${record.details.length ? `<dl>${record.details.map((item) => {
          const isUrl = /url|رابط|URL/i.test(item.label);
          return `<div><dt>${escapeHtml(item.label)}</dt><dd>${isUrl ? sourceLink(item.value) : renderValue(item.value)}</dd></div>`;
        }).join("")}</dl>` : ""}
        ${record.lists.map((group) => renderList(group.label, group.items)).join("")}
      </article>`;
    };

    const pillarSections = bio.PILLARS.map((pillar, index) => {
      const records = bio.recordsFor(pillar.key, a, locale);
      const sectionId = `pillar-${safeId(pillar.key)}`;
      return `<details class="reportSection" id="${sectionId}" data-biopolitical-pillar="${escapeHtml(pillar.key)}"${index === 0 ? " open" : ""}>
        <summary><span class="sectionNumber">${String(index + 1).padStart(2, "0")}</span><span class="sectionHeading"><strong>${escapeHtml(labels[pillar.key][0])}</strong><small>${escapeHtml(labels[pillar.key][1])}</small></span><span class="recordCount">${records.length} ${escapeHtml(c.records)}</span></summary>
        <div class="sectionBody">${records.length ? records.map((record, recordIndex) => renderRecord(record, recordIndex, pillar.key)).join("") : `<p class="empty">${escapeHtml(c.noRecords)}</p>`}</div>
      </details>`;
    }).join("");

    const conclusionGroups = bio.conclusionRecords(a, locale)
      .map((group) => `<section class="conclusionGroup"><h3>${escapeHtml(group.label)}</h3>${renderList("", group.items)}</section>`)
      .join("");
    const audit = bio.SELF_AUDIT_KEYS.map((key) => {
      const value = a.self_audit[key] || "concern";
      return `<li><span>${escapeHtml(bio.auditLabel(locale, key))}</span><strong data-audit-state="${escapeHtml(value)}">${display(value)}</strong></li>`;
    }).join("");
    const conclusion = `<details class="reportSection" id="conclusion">
      <summary><span class="sectionNumber">10</span><span class="sectionHeading"><strong>${escapeHtml(c.conclusion)}</strong><small>${escapeHtml(c.conclusionHint)}</small></span></summary>
      <div class="sectionBody"><div class="conclusionGrid">${conclusionGroups}</div><ul class="auditList">${audit}</ul></div>
    </details>`;

    const familyLabels = { explicit: c.authored, evidence: c.evidence, structural: c.structural };
    const relationshipGroups = ["explicit", "evidence", "structural"].map((family) => {
      const edges = graph.edges.filter((edge) => edge.family === family);
      return `<details class="subsection" data-relationship-family="${family}"><summary><strong>${escapeHtml(familyLabels[family])}</strong><span>${edges.length}</span></summary>${edges.length ? `<ol class="edgeList">${edges.map((edge) => `<li>${renderValue(edge.source)} <span aria-hidden="true">${arrow}</span> ${renderValue(edge.target)} <span class="relation">${display(edge.relation)}</span>${edge.mechanism ? `<p>${renderValue(edge.mechanism)}</p>` : ""}</li>`).join("")}</ol>` : `<p class="empty">${escapeHtml(c.noRecords)}</p>`}</details>`;
    }).join("");
    const temporal = graphApi.temporalProjection(a);
    const temporalLabels = { historical: c.historical, dated: c.dated, immediate: c.immediate, medium: c.medium, future: c.future };
    const temporalHtml = `<section data-temporal-projection="canonical"><h3>${escapeHtml(c.time)}</h3><p class="caution">${escapeHtml(c.timeCaution)}</p><div class="projectionGrid">${temporal.map((band) => `<article><h4>${escapeHtml(temporalLabels[band.key])} <span>${band.items.length}</span></h4>${band.items.length ? `<ul>${band.items.map((item) => `<li>${renderValue(item.label)}${item.detail ? ` — ${renderValue(item.detail)}` : ""}${item.id ? ` <small>[${escapeHtml(item.id)}]</small>` : ""}</li>`).join("")}</ul>` : `<p class="empty">—</p>`}</article>`).join("")}</div></section>`;
    const comparisons = graphApi.comparativeProjection(a);
    const comparisonHtml = `<section data-comparative-projection="canonical"><h3>${escapeHtml(c.comparisons)}</h3>${comparisons.length ? comparisons.map((item) => `<article class="recordCard" data-comparison-id="${escapeHtml(item.id)}"><h3>${renderValue(item.context || item.id)}</h3><p><strong>${escapeHtml(c.basis)}:</strong> ${renderValue(item.basis)}</p>${renderList(c.similarities, item.similarities)}${renderList(c.differences, item.differences)}${renderList(c.transfer, item.transferLimits)}</article>`).join("") : `<p class="empty">—</p>`}</section>`;
    const atlas = `<details class="reportSection" id="relationships" data-relationship-atlas="complete"><summary><span class="sectionNumber">11</span><span class="sectionHeading"><strong>${escapeHtml(c.atlas)}</strong><small>${escapeHtml(c.atlasHint)}</small></span><span class="recordCount">${graph.edges.length}</span></summary><div class="sectionBody">${relationshipGroups}${temporalHtml}${comparisonHtml}</div></details>`;

    const explicitEdges = graph.edges.filter((edge) => edge.provenance === "explicit");
    const directory = `<details class="reportSection" id="references" data-reference-directory="named"><summary><span class="sectionNumber">12</span><span class="sectionHeading"><strong>${escapeHtml(c.references)}</strong><small>${escapeHtml(c.referencesHint)}</small></span><span class="recordCount">${graph.nodes.length}</span></summary><div class="sectionBody"><div class="referenceIndex">${graph.nodes.map((node) => `<article id="ref-${anchorId(node.id)}" tabindex="-1" data-reference-id="${escapeHtml(node.id)}"><span>${escapeHtml(graph.typeLabel(node.type))}</span><h3>${escapeHtml(`${node.label} [${node.id}]`)}</h3>${node.subtitle && node.subtitle !== node.label ? `<p>${escapeHtml(bio.displayCode(locale, node.subtitle))}</p>` : ""}</article>`).join("")}</div>${explicitEdges.length ? `<section><h3>${escapeHtml(c.namedRelationships)}</h3><ol class="edgeList">${explicitEdges.map((edge) => `<li>${renderValue(edge.source)} <span aria-hidden="true">${arrow}</span> ${renderValue(edge.target)} <span class="relation">${display(edge.relation)}</span>${edge.mechanism ? `<p>${renderValue(edge.mechanism)}</p>` : ""}</li>`).join("")}</ol></section>` : ""}</div></details>`;

    const blockerList = renderList(c.blocking, health.missing);
    const migrationList = renderList(c.migration, a.migration?.warnings);
    const auditNotes = renderList(c.auditNotes, a.self_audit_notes);
    const appendix = `<details class="reportSection canonicalAppendix" id="canonical" data-canonical-contract="complete" data-contract-status="${escapeHtml(a.contract_status)}"><summary><span class="sectionNumber">13</span><span class="sectionHeading"><strong>${escapeHtml(c.canonical)}</strong><small>${escapeHtml(c.canonicalHint)}</small></span></summary><div class="sectionBody"><p><strong>${escapeHtml(c.publication)}:</strong> ${escapeHtml(verdict)}</p>${blockerList}${migrationList}${auditNotes}<details class="jsonInspector"><summary><strong>${escapeHtml(c.inspectJson)}</strong></summary><pre id="canonical-json-view" tabindex="0" dir="ltr"></pre></details></div></details>`;

    const toc = [...bio.PILLARS.map((pillar, index) => ({
      href: `#pillar-${safeId(pillar.key)}`,
      number: String(index + 1).padStart(2, "0"),
      label: labels[pillar.key][0],
    })),
    { href: "#conclusion", number: "10", label: c.conclusion },
    { href: "#relationships", number: "11", label: c.atlas },
    { href: "#references", number: "12", label: c.references },
    { href: "#canonical", number: "13", label: c.canonical }];

    const css = `
      *{box-sizing:border-box}html{scroll-behavior:smooth;print-color-adjust:exact;-webkit-print-color-adjust:exact}body{margin:0;background:var(--j-bg);color:var(--j-fg);font:15px/1.65 var(--j-font-ui);-webkit-font-smoothing:antialiased}a{color:inherit}
      .skipLink{position:fixed;inset-inline-start:var(--j-s-3);top:-5rem;z-index:20;padding:.7rem 1rem;border:1px solid var(--j-line-strong);border-radius:var(--j-r-2);background:var(--j-panel);color:var(--j-fg);font-weight:700;box-shadow:var(--j-shadow)}.skipLink:focus{top:var(--j-s-2)}
      .shell{width:min(1180px,calc(100% - 2rem));margin:auto;padding:2rem 0 6rem}
      .hero{padding:clamp(1.25rem,4vw,2.5rem);border:1px solid var(--j-line);border-radius:var(--j-r-3);background:var(--j-panel)}
      .heroGrid{display:grid;grid-template-columns:minmax(0,1fr) minmax(250px,330px);gap:2rem;align-items:start}
      .hero h1{max-width:24ch;margin:.5rem 0;color:var(--j-fg);font:700 clamp(1.9rem,4vw,var(--j-t-36))/1.15 var(--j-font-display);letter-spacing:-.01em}
      .hero p{margin:.5rem 0;color:var(--j-fg-muted)}.hero .chain{max-width:76ch;font-size:var(--j-t-14)}
      .hero .contractLine{margin:0;color:var(--j-signal);font:600 var(--j-t-12)/1.4 var(--j-font-data)}
      .statusPanel{display:grid;gap:var(--j-s-3)}
      .metricCard{padding:var(--j-s-4);border:1px solid var(--j-line);border-radius:var(--j-r-2);background:var(--j-panel-2)}
      .metricCard strong{display:block;color:var(--j-fg);font:700 clamp(1.7rem,4vw,2.4rem)/1 var(--j-font-data);font-variant-numeric:tabular-nums}
      .metricCard span,.metricCard small{display:block;margin-top:.35rem}.metricCard small{color:var(--j-fg-muted)}
      .metricBar{height:6px;margin-top:.6rem!important;overflow:hidden;border-radius:3px;background:var(--j-line)}.metricBar::before{content:"";display:block;width:var(--pct);height:100%;border-radius:inherit;background:var(--j-signal)}
      .metricBar[data-tone="ok"]::before{background:var(--j-ok)}.metricBar[data-tone="warn"]::before{background:var(--j-warn)}.metricBar[data-tone="crit"]::before{background:var(--j-crit)}
      .gateBadge{display:inline-flex!important;align-items:center;gap:6px;width:max-content;max-width:100%;padding:.3rem .65rem;border:1px solid currentColor;border-radius:999px;font:600 var(--j-t-12)/1.2 var(--j-font-data);letter-spacing:.06em;text-transform:uppercase}
      .gateBadge::before{content:"";flex:none;width:8px;height:8px}
      .gateBadge[data-tone="ok"]{color:var(--j-ok);background:var(--j-ok-wash)}.gateBadge[data-tone="ok"]::before{border-radius:50%;background:var(--j-ok)}
      .gateBadge[data-tone="warn"]{color:var(--j-warn);background:var(--j-warn-wash)}.gateBadge[data-tone="warn"]::before{width:0;height:0;border-inline:5px solid transparent;border-bottom:9px solid var(--j-warn)}
      .gateBadge[data-tone="crit"]{color:var(--j-crit);background:var(--j-crit-wash)}.gateBadge[data-tone="crit"]::before{background:var(--j-crit)}
      .compactMetrics{display:grid;gap:.55rem}.compactMetrics span{display:flex;justify-content:space-between;gap:1rem;margin:0}.compactMetrics b{font:700 var(--j-t-16)/1.3 var(--j-font-data);font-variant-numeric:tabular-nums}
      .referenceGroup{display:inline-flex;max-width:100%;flex-wrap:wrap;align-items:center;gap:.35rem}
      .overviewGrid{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(270px,.8fr);gap:var(--j-s-4);margin:var(--j-s-4) 0}
      .overviewCard,.reportToc{padding:var(--j-s-5);border:1px solid var(--j-line);border-radius:var(--j-r-3);background:var(--j-panel)}
      .overviewCard h2,.reportToc h2{margin:0 0 .5rem;color:var(--j-fg);font:700 var(--j-t-22)/1.3 var(--j-font-display)}
      .overviewCard p{max-width:72ch}
      .blockers{border-inline-start-width:4px}.blockers[data-tone="ok"]{border-inline-start-color:var(--j-ok)}.blockers[data-tone="warn"]{border-inline-start-color:var(--j-warn)}.blockers[data-tone="crit"]{border-inline-start-color:var(--j-crit)}
      .blockers ol{margin:0;padding-inline-start:1.25rem}.blockers li+li{margin-top:.35rem}
      .reportToc ol{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:2px var(--j-s-3);margin:var(--j-s-3) 0 0;padding:0;list-style:none}
      .reportToc a{display:flex;align-items:center;gap:.65rem;min-height:44px;padding:.35rem .65rem;border-radius:var(--j-r-2);text-decoration:none}.reportToc a:hover{background:var(--j-panel-2)}
      .reportToc span{color:var(--j-signal);font:600 var(--j-t-12)/1 var(--j-font-data);font-variant-numeric:tabular-nums}
      .toolbar{position:sticky;top:.5rem;z-index:10;display:flex;flex-wrap:wrap;gap:.5rem;justify-content:flex-end;width:fit-content;margin-block:var(--j-s-4);margin-inline:auto 0;padding:.5rem;border:1px solid var(--j-line);border-radius:var(--j-r-3);background:var(--j-panel);box-shadow:var(--j-shadow)}
      button{min-height:44px;padding:0 var(--j-s-4);border:1px solid var(--j-line-strong);border-radius:var(--j-r-2);background:var(--j-panel-2);color:var(--j-fg);font:inherit;font-weight:600;cursor:pointer}button:hover{border-color:var(--j-signal);background:var(--j-raise)}
      .reportSection{margin-top:var(--j-s-4);border:1px solid var(--j-line);border-radius:var(--j-r-3);background:var(--j-panel);scroll-margin-top:5rem}
      .reportSection>summary{display:grid;grid-template-columns:auto minmax(0,1fr) auto auto;gap:1rem;align-items:center;min-height:44px;padding:var(--j-s-4);cursor:pointer;list-style:none}
      .reportSection>summary::-webkit-details-marker{display:none}
      .reportSection>summary:after{content:"+";grid-column:4;grid-row:1;color:var(--j-signal);font:400 1.5rem/1 var(--j-font-data)}.reportSection[open]>summary:after{content:"−"}
      .reportSection[open]>summary{border-bottom:1px solid var(--j-line)}
      .sectionNumber{display:grid;place-items:center;width:2.75rem;height:2.75rem;border:1px solid var(--j-line);border-radius:var(--j-r-2);background:var(--j-panel-2);color:var(--j-signal);font:600 var(--j-t-14)/1 var(--j-font-data)}
      .sectionHeading strong,.sectionHeading small{display:block}.sectionHeading strong{color:var(--j-fg);font:700 var(--j-t-18)/1.35 var(--j-font-display)}
      .sectionHeading small{max-width:75ch;color:var(--j-fg-muted);font-size:var(--j-t-13)}
      .recordCount{grid-column:3;grid-row:1;min-width:2rem;padding:.15rem .55rem;border:1px solid var(--j-line);border-radius:999px;background:var(--j-panel-2);color:var(--j-fg);font:600 var(--j-t-12)/1.4 var(--j-font-data);font-variant-numeric:tabular-nums;text-align:center}
      .sectionBody{padding:var(--j-s-4)}
      .recordCard{margin:.75rem 0}.recordCard,.conclusionGroup,.projectionGrid article,.referenceIndex article{padding:var(--j-s-4);border:1px solid var(--j-line);border-radius:var(--j-r-2);background:var(--j-panel-2);break-inside:avoid-page}
      .recordCard>header{display:flex;align-items:flex-start;justify-content:space-between;gap:1rem}
      .recordCard h3{max-width:68ch;margin:0;color:var(--j-fg);font-size:var(--j-t-16);line-height:1.45}
      .summary{max-width:72ch;color:var(--j-fg)}
      .eyebrow{display:block;margin-bottom:.35rem;color:var(--j-signal);font:600 var(--j-t-12)/1.4 var(--j-font-data);text-transform:uppercase}
      .tags{display:flex;flex-wrap:wrap;gap:.4rem;margin:.75rem 0}
      .tags span,.relation{padding:.15rem .55rem;border:1px solid var(--j-line-strong);border-radius:999px;background:var(--j-panel);font-size:var(--j-t-12);font-weight:600}
      .sourceLink{display:inline-flex;align-items:center;gap:.35rem;flex:0 0 auto;min-height:44px;padding:0 .8rem;border:1px solid var(--j-line-strong);border-radius:var(--j-r-2);background:var(--j-panel);color:var(--j-signal);font-weight:600;text-decoration:none}.sourceLink:hover{border-color:var(--j-signal)}
      .sourceMissing{color:var(--j-warn);font-size:var(--j-t-13)}
      dl{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.55rem}
      dl div{min-width:0;padding:.7rem;border:1px solid var(--j-line);border-radius:var(--j-r-2);background:var(--j-panel)}
      dt{color:var(--j-fg-muted);font:600 var(--j-t-12)/1.4 var(--j-font-data);letter-spacing:.04em;text-transform:uppercase}
      dd{margin:.2rem 0 0;overflow-wrap:anywhere}
      [dir="rtl"] :is(dt,.eyebrow,.gateBadge,.contractLine,.referenceIndex article>span){font-family:var(--j-font-ui);letter-spacing:0}
      .recordList h4{margin:.9rem 0 .25rem}.recordList ul{margin:.25rem 0}
      .referenceChip{display:inline-flex;flex-wrap:wrap;gap:.25rem;margin:.1rem;padding:.08rem .35rem;border-radius:var(--j-r-1);background:var(--j-signal-wash);color:var(--j-signal-strong);text-decoration:none}
      .referenceChip small{font-family:var(--j-font-data)}
      .subsection{margin:.7rem 0;border:1px solid var(--j-line);border-radius:var(--j-r-2);background:var(--j-panel)}
      .subsection>summary{display:flex;align-items:center;justify-content:space-between;gap:1rem;min-height:44px;padding:.5rem .85rem;cursor:pointer}
      .subsection>summary>span,.projectionGrid h4>span{flex:none;min-width:2rem;padding:.1rem .5rem;border:1px solid var(--j-line);border-radius:999px;background:var(--j-panel-2);color:var(--j-fg);font:600 var(--j-t-12)/1.4 var(--j-font-data);font-variant-numeric:tabular-nums;text-align:center}
      .projectionGrid h4{display:flex;align-items:center;justify-content:space-between;gap:.75rem}
      .edgeList{padding-inline-start:2rem}.edgeList li{margin:.5rem 0}.edgeList p{margin:.25rem 0;color:var(--j-fg-muted)}
      .projectionGrid,.conclusionGrid,.referenceIndex{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.7rem}
      .projectionGrid article h4,.referenceIndex h3{margin:0}
      .referenceIndex article>span{color:var(--j-fg-muted);font:600 var(--j-t-12)/1.4 var(--j-font-data);text-transform:uppercase}
      .referenceIndex p{margin:.35rem 0;color:var(--j-fg-muted)}
      .auditList{padding:0;list-style:none}.auditList li{display:flex;justify-content:space-between;gap:1rem;padding:.65rem;border-bottom:1px solid var(--j-line)}
      [data-audit-state="pass"],[data-audit-state="not_applicable"]{color:var(--j-ok)}[data-audit-state="concern"]{color:var(--j-crit)}
      .caution,.empty{color:var(--j-fg-muted)}
      .jsonInspector pre{max-height:40rem;overflow:auto;padding:1rem;border:1px solid var(--j-line);border-radius:var(--j-r-2);background:var(--j-panel-2);color:var(--j-fg);font:var(--j-t-13)/1.55 var(--j-font-data);direction:ltr;text-align:left;white-space:pre-wrap;overflow-wrap:anywhere}
      .jsonInspector summary{cursor:pointer;padding:.8rem}
      .canonicalAppendix{border-style:dashed}
      :focus-visible{outline:2px solid var(--j-signal);outline-offset:2px}
      @media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
      @media (forced-colors:active){.gateBadge::before{forced-color-adjust:none;background:CanvasText;border-color:CanvasText}}

      @media(max-width:800px){.shell{width:min(100% - 1rem,1180px);padding-top:.5rem}.heroGrid,.overviewGrid{grid-template-columns:1fr}.reportToc ol,.projectionGrid,.conclusionGrid,.referenceIndex,dl{grid-template-columns:1fr}.recordCard>header{display:block}.sourceLink,.sourceMissing{margin-top:.65rem}.toolbar{position:static;justify-content:stretch;width:auto;margin-inline:0}.toolbar button{flex:1 1 auto}.reportSection>summary{gap:.65rem}.recordCount{display:none}}

      @media print{@page{margin:13mm}body{background:#fff;font-size:10.5pt}.shell{width:100%;padding:0}.hero{padding:1.2rem;border-radius:0;box-shadow:none}.toolbar,.reportToc,.skipLink{display:none!important}.overviewGrid{grid-template-columns:1fr}.reportSection{box-shadow:none;break-inside:auto}.reportSection>summary{break-after:avoid-page}.reportSection>summary:after{display:none}.reportSection>.sectionBody,.subsection>*:not(summary),.jsonInspector>*:not(summary){display:block!important}.reportSection:not([open])>.sectionBody,.subsection:not([open])>*:not(summary){display:block!important}.recordCard,.projectionGrid article,.referenceIndex article{break-inside:avoid-page}.canonicalAppendix .jsonInspector{display:none}}
    `;
    const script = `(function(){const sections=[...document.querySelectorAll('.reportSection')];document.querySelector('[data-expand-all]').addEventListener('click',()=>sections.forEach(s=>s.open=true));document.querySelector('[data-collapse-all]').addEventListener('click',()=>sections.forEach(s=>s.open=false));document.querySelector('[data-print]').addEventListener('click',()=>window.print());document.addEventListener('click',event=>{const link=event.target.closest('.referenceChip');if(!link)return;const target=document.querySelector(link.getAttribute('href'));if(!target)return;event.preventDefault();let parent=target.closest('details');while(parent){parent.open=true;parent=parent.parentElement.closest('details')}history.replaceState(null,'',link.getAttribute('href'));target.focus({preventScroll:true});target.scrollIntoView({block:'center',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})});const inspector=document.querySelector('.jsonInspector');inspector.addEventListener('toggle',()=>{if(!inspector.open)return;const target=document.getElementById('canonical-json-view');if(target.textContent)return;try{target.textContent=JSON.stringify(JSON.parse(document.getElementById('canonical-analysis').textContent),null,2)}catch(error){target.textContent='Unable to render canonical JSON.'}});})();`;

    return `<!doctype html><html lang="${locale}" dir="${dir}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="app-version" content="${escapeHtml(version)}"><meta name="analysis-lens" content="biopolitical"><meta name="analysis-contract" content="${escapeHtml(bio.APP_CONTRACT)}"><meta name="schema-version" content="${escapeHtml(bio.SCHEMA_VERSION)}"><title>${escapeHtml(a.subject.title || c.title)}</title><style>${theme.css}${css}</style></head><body data-publication-gate="${gate}"><a class="skipLink" href="#report-content">${escapeHtml(c.skip)}</a><main class="shell" id="report-content" data-analysis-lens="biopolitical" data-export-contract-lens="biopolitical" data-analysis-contract="${escapeHtml(bio.APP_CONTRACT)}" data-schema-version="${escapeHtml(bio.SCHEMA_VERSION)}" data-app-version="${escapeHtml(version)}">
      <header class="hero"><div class="heroGrid"><div><p class="contractLine">${escapeHtml(c.officialContract)} · ${escapeHtml(bio.APP_CONTRACT)} · ${escapeHtml(c.schema)} ${escapeHtml(bio.SCHEMA_VERSION)}</p><h1>${escapeHtml(a.subject.title || c.title)}</h1><p>${escapeHtml(c.title)}</p><p class="chain">${escapeHtml(c.chain)}</p></div><div class="statusPanel"><section class="metricCard gateCard"><span class="gateBadge" data-tone="${verdictTone}">${escapeHtml(verdict)}</span><span>${escapeHtml(c.publication)}</span><small>${escapeHtml(health.publishable ? c.passedNote : c.blockedNote)}</small></section><section class="metricCard"><strong>${score.overall}%</strong><span class="metricBar"${readinessTone ? ` data-tone="${readinessTone}"` : ""} style="--pct:${score.overall}%" aria-hidden="true"></span><span>${escapeHtml(c.analyticalReadiness)}</span><small>${escapeHtml(c.readinessNote)}</small></section><section class="metricCard compactMetrics"><span><b>${score.analyticalCoverage}%</b> ${escapeHtml(c.analyticalCoverage)}</span><span><b>${score.provenance.sourceTraceability}%</b> ${escapeHtml(c.sourceTraceability)}</span><span><b>${score.provenance.humanReview}%</b> ${escapeHtml(c.humanReview)}</span></section></div></div></header>
      <div class="overviewGrid"><section class="overviewCard"><h2>${escapeHtml(c.executive)}</h2><p>${renderValue(a.subject.executive_finding || "—")}</p><p>${renderValue(a.subject.context || "")}</p></section><section class="overviewCard blockers" data-tone="${verdictTone}"><h2>${escapeHtml(c.reviewFirst)}</h2>${health.missing.length ? `<ol>${health.missing.slice(0,5).map((item)=>`<li>${renderValue(item)}</li>`).join("")}</ol>` : `<p>${escapeHtml(c.passedNote)}</p>`}</section></div>
      <nav class="reportToc" aria-label="${escapeHtml(c.contents)}"><h2>${escapeHtml(c.contents)}</h2><ol>${toc.map((item)=>`<li><a href="${item.href}"><span>${item.number}</span>${escapeHtml(item.label)}</a></li>`).join("")}</ol></nav>
      <div class="toolbar" aria-label="${escapeHtml(c.contents)}"><button type="button" data-expand-all>${escapeHtml(c.expand)}</button><button type="button" data-collapse-all>${escapeHtml(c.collapse)}</button><button type="button" data-print>${escapeHtml(c.print)}</button></div>
      ${pillarSections}${conclusion}${atlas}${directory}${appendix}
    </main><script type="application/json" id="canonical-analysis">${canonicalJson}</script><script>${script}</script></body></html>`;
  }

  root.Jarbou3iBiopoliticalReport = Object.freeze({ build });
})(window);
