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
      passed: "Passed",
      blocked: "Blocked",
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
      passed: "مستوفاة",
      blocked: "محظورة",
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
      passed: "Satisfait",
      blocked: "Bloqué",
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

  function build({ analysis, lang, version, bio, graphApi }) {
    if (!analysis || !bio || !graphApi) {
      throw new Error("Biopolitical report dependencies are unavailable.");
    }
    const locale = ["ar", "en", "fr"].includes(lang) ? lang : "en";
    const c = COPY[locale];
    const dir = locale === "ar" ? "rtl" : "ltr";
    const a = bio.sanitizePortableValue(bio.normalize(analysis));
    const score = bio.scores(a);
    const health = bio.health(a, locale);
    const graph = graphApi.build(a, locale);
    const labels = bio.ui(locale, "pillars");
    const evidence = arr(a.evidence?.items);
    const gate = health.publishable ? "passed" : "blocked";
    const canonicalJson = JSON.stringify(a).replaceAll("<", "\\u003c");

    const renderValue = (value) =>
      graphApi.replaceReferences(
        bio.sanitizePortableText(value),
        graph,
        (chunk, node) =>
          node
            ? `<a class="referenceChip" href="#ref-${safeId(node.id)}" title="${escapeHtml(graph.typeLabel(node.type))}"><span>${escapeHtml(node.label)}</span><small>[${escapeHtml(node.id)}]</small></a>`
            : escapeHtml(chunk),
      );
    const display = (value) => escapeHtml(bio.displayToken(locale, value));
    const sourceLink = (url) =>
      isHttpUrl(url)
        ? `<a class="sourceLink" href="${escapeHtml(text(url).trim())}" target="_blank" rel="noopener noreferrer">${escapeHtml(c.source)} <span aria-hidden="true">↗</span></a>`
        : `<span class="sourceMissing">${escapeHtml(c.sourceUnavailable)}</span>`;
    const renderList = (title, values) => {
      const items = arr(values).filter((value) => text(value).trim());
      return items.length
        ? `<div class="recordList"><h4>${escapeHtml(title)}</h4><ul>${items.map((value) => `<li>${renderValue(value)}</li>`).join("")}</ul></div>`
        : "";
    };
    const renderRecord = (record, index, pillarKey) => {
      const evidenceItem = pillarKey === "evidence_explanations"
        ? evidence.find((item) => item.claim === record.title)
        : null;
      const recordId = evidenceItem?.id || "";
      return `<article class="recordCard${evidenceItem ? " evidenceCard" : ""}"${recordId ? ` id="evidence-${safeId(recordId)}" data-evidence-id="${escapeHtml(recordId)}"` : ""}>
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
      .map((group) => `<section class="conclusionGroup"><h3>${escapeHtml(group.label)}</h3>${renderList(group.label, group.items)}</section>`)
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
      return `<details class="subsection" data-relationship-family="${family}"><summary><strong>${escapeHtml(familyLabels[family])}</strong><span>${edges.length}</span></summary>${edges.length ? `<ol class="edgeList">${edges.map((edge) => `<li>${renderValue(edge.source)} <span aria-hidden="true">→</span> ${renderValue(edge.target)} <span class="relation">${display(edge.relation)}</span>${edge.mechanism ? `<p>${renderValue(edge.mechanism)}</p>` : ""}</li>`).join("")}</ol>` : `<p class="empty">${escapeHtml(c.noRecords)}</p>`}</details>`;
    }).join("");
    const temporal = graphApi.temporalProjection(a);
    const temporalLabels = { historical: c.historical, dated: c.dated, immediate: c.immediate, medium: c.medium, future: c.future };
    const temporalHtml = `<section data-temporal-projection="canonical"><h3>${escapeHtml(c.time)}</h3><p class="caution">${escapeHtml(c.timeCaution)}</p><div class="projectionGrid">${temporal.map((band) => `<article><h4>${escapeHtml(temporalLabels[band.key])} <span>${band.items.length}</span></h4>${band.items.length ? `<ul>${band.items.map((item) => `<li>${renderValue(item.label)}${item.detail ? ` — ${renderValue(item.detail)}` : ""}${item.id ? ` <small>[${escapeHtml(item.id)}]</small>` : ""}</li>`).join("")}</ul>` : `<p class="empty">—</p>`}</article>`).join("")}</div></section>`;
    const comparisons = graphApi.comparativeProjection(a);
    const comparisonHtml = `<section data-comparative-projection="canonical"><h3>${escapeHtml(c.comparisons)}</h3>${comparisons.length ? comparisons.map((item) => `<article class="recordCard" data-comparison-id="${escapeHtml(item.id)}"><h3>${renderValue(item.context || item.id)}</h3><p><strong>${escapeHtml(c.basis)}:</strong> ${renderValue(item.basis)}</p>${renderList(c.similarities, item.similarities)}${renderList(c.differences, item.differences)}${renderList(c.transfer, item.transferLimits)}</article>`).join("") : `<p class="empty">—</p>`}</section>`;
    const atlas = `<details class="reportSection" id="relationships" data-relationship-atlas="complete"><summary><span class="sectionNumber">11</span><span class="sectionHeading"><strong>${escapeHtml(c.atlas)}</strong><small>${escapeHtml(c.atlasHint)}</small></span><span class="recordCount">${graph.edges.length}</span></summary><div class="sectionBody">${relationshipGroups}${temporalHtml}${comparisonHtml}</div></details>`;

    const explicitEdges = graph.edges.filter((edge) => edge.provenance === "explicit");
    const directory = `<details class="reportSection" id="references" data-reference-directory="named"><summary><span class="sectionNumber">12</span><span class="sectionHeading"><strong>${escapeHtml(c.references)}</strong><small>${escapeHtml(c.referencesHint)}</small></span><span class="recordCount">${graph.nodes.length}</span></summary><div class="sectionBody"><div class="referenceIndex">${graph.nodes.map((node) => `<article id="ref-${safeId(node.id)}" tabindex="-1" data-reference-id="${escapeHtml(node.id)}"><span>${escapeHtml(graph.typeLabel(node.type))}</span><h3>${escapeHtml(`${node.label} [${node.id}]`)}</h3>${node.subtitle && node.subtitle !== node.label ? `<p>${escapeHtml(node.subtitle)}</p>` : ""}</article>`).join("")}</div>${explicitEdges.length ? `<section><h3>${escapeHtml(c.namedRelationships)}</h3><ol class="edgeList">${explicitEdges.map((edge) => `<li>${renderValue(edge.source)} <span aria-hidden="true">→</span> ${renderValue(edge.target)} <span class="relation">${display(edge.relation)}</span>${edge.mechanism ? `<p>${renderValue(edge.mechanism)}</p>` : ""}</li>`).join("")}</ol></section>` : ""}</div></details>`;

    const blockerList = renderList(c.blocking, health.missing);
    const migrationList = renderList(c.migration, a.migration?.warnings);
    const auditNotes = renderList(c.auditNotes, a.self_audit_notes);
    const appendix = `<details class="reportSection canonicalAppendix" id="canonical" data-canonical-contract="complete" data-contract-status="${escapeHtml(a.contract_status)}"><summary><span class="sectionNumber">13</span><span class="sectionHeading"><strong>${escapeHtml(c.canonical)}</strong><small>${escapeHtml(c.canonicalHint)}</small></span></summary><div class="sectionBody"><p><strong>${escapeHtml(c.publication)}:</strong> ${escapeHtml(health.publishable ? c.passed : c.blocked)}</p>${blockerList}${migrationList}${auditNotes}<details class="jsonInspector"><summary><strong>${escapeHtml(c.inspectJson)}</strong></summary><pre id="canonical-json-view" tabindex="0" dir="ltr"></pre></details></div></details>`;

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
      :root{color-scheme:light;--ink:#111c2e;--muted:#5d6b82;--line:#d5deec;--surface:#fff;--surface2:#f5f8fc;--bg:#edf2f9;--accent:#335cff;--accent2:#7257ff;--good:#087b5b;--warn:#a14e00;--bad:#b42318;--shadow:0 18px 48px rgba(25,41,72,.09)}
      *{box-sizing:border-box}html{scroll-behavior:smooth;print-color-adjust:exact;-webkit-print-color-adjust:exact}body{margin:0;background:radial-gradient(circle at 12% 0,#e9e9ff 0,transparent 34rem),var(--bg);color:var(--ink);font:15px/1.65 Inter,"Noto Sans Arabic","Segoe UI",Arial,sans-serif}a{color:inherit}.skipLink{position:fixed;inset-inline-start:1rem;top:-5rem;z-index:20;background:#fff;padding:.75rem 1rem;border-radius:.75rem}.skipLink:focus{top:1rem}.shell{width:min(1180px,calc(100% - 2rem));margin:auto;padding:2rem 0 6rem}.hero{overflow:hidden;position:relative;padding:clamp(1.5rem,4vw,3rem);border-radius:2rem;background:linear-gradient(135deg,#0b1427,#273db7 58%,#5b3fd6);color:#fff;box-shadow:var(--shadow)}.hero:after{content:"";position:absolute;inline-size:24rem;block-size:24rem;border:1px solid rgba(255,255,255,.2);border-radius:50%;inset-inline-end:-8rem;top:-11rem}.heroGrid{position:relative;z-index:1;display:grid;grid-template-columns:minmax(0,1fr) minmax(250px,330px);gap:2rem;align-items:center}.hero h1{max-width:24ch;margin:0;font-size:clamp(2rem,4vw,3.4rem);line-height:1.08}.hero .chain{max-width:76ch;color:#dfe7ff}.contractLine{font:700 .76rem/1.4 ui-monospace,Consolas,monospace;color:#cdd7ff}.statusPanel{display:grid;gap:.8rem}.metricCard{padding:1rem;border:1px solid rgba(255,255,255,.22);border-radius:1.2rem;background:rgba(255,255,255,.11);backdrop-filter:blur(12px)}.metricCard strong{display:block;font-size:clamp(1.7rem,4vw,2.7rem);line-height:1}.metricCard span,.metricCard small{display:block;margin-top:.35rem}.gateBadge{display:inline-flex!important;width:max-content;padding:.34rem .7rem;border-radius:999px;font-weight:900;background:#fff;color:var(--bad)}[data-publication-gate="passed"] .gateBadge{color:var(--good)}.overviewGrid{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(270px,.8fr);gap:1rem;margin:1rem 0}.overviewCard,.reportToc{padding:1.35rem;border:1px solid var(--line);border-radius:1.25rem;background:rgba(255,255,255,.92);box-shadow:var(--shadow)}.overviewCard h2,.reportToc h2{margin:0 0 .5rem}.overviewCard p{max-width:78ch}.blockers{border-inline-start:5px solid var(--bad)}.reportToc ol{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.35rem;margin:1rem 0 0;padding:0;list-style:none}.reportToc a{display:flex;gap:.6rem;padding:.52rem .65rem;border-radius:.65rem;text-decoration:none}.reportToc a:hover{background:var(--surface2)}.reportToc span{color:var(--accent);font:800 .75rem ui-monospace,monospace}.toolbar{position:sticky;top:.5rem;z-index:10;display:flex;flex-wrap:wrap;gap:.5rem;justify-content:flex-end;margin:1rem 0;padding:.6rem;border:1px solid var(--line);border-radius:1rem;background:rgba(255,255,255,.9);backdrop-filter:blur(15px)}button{min-height:2.7rem;padding:.55rem .9rem;border:1px solid var(--line);border-radius:.75rem;background:#fff;color:var(--ink);font:inherit;font-weight:800;cursor:pointer}button:hover{border-color:var(--accent);color:var(--accent)}.reportSection{margin-top:1rem;border:1px solid var(--line);border-radius:1.25rem;background:var(--surface);box-shadow:var(--shadow);scroll-margin-top:5rem}.reportSection>summary{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:1rem;align-items:center;padding:1.15rem;cursor:pointer;list-style:none}.reportSection>summary::-webkit-details-marker{display:none}.reportSection>summary:after{content:"+";grid-column:3;font-size:1.5rem;color:var(--accent)}.reportSection[open]>summary:after{content:"−"}.reportSection[open]>summary{border-bottom:1px solid var(--line)}.sectionNumber{display:grid;place-items:center;width:2.75rem;height:2.75rem;border-radius:.85rem;background:#edf1ff;color:var(--accent);font-weight:900}.sectionHeading strong,.sectionHeading small{display:block}.sectionHeading strong{font-size:1.1rem}.sectionHeading small{max-width:75ch;color:var(--muted);font-size:.86rem}.recordCount{grid-column:3;grid-row:1;padding:.25rem .55rem;border-radius:999px;background:var(--surface2);font-size:.78rem;color:var(--muted)}.reportSection>summary:after{grid-row:1}.sectionBody{padding:1rem}.recordCard,.conclusionGroup,.projectionGrid article,.referenceIndex article{margin:.75rem 0;padding:1rem;border:1px solid var(--line);border-radius:1rem;background:var(--surface2);break-inside:avoid-page}.recordCard>header{display:flex;align-items:flex-start;justify-content:space-between;gap:1rem}.recordCard h3{max-width:68ch;margin:0;font-size:1rem;line-height:1.4}.summary{max-width:78ch;color:#334155}.eyebrow{display:block;margin-bottom:.35rem;color:var(--accent);font:900 .72rem/1.4 ui-monospace,monospace;text-transform:uppercase}.tags{display:flex;flex-wrap:wrap;gap:.4rem;margin:.75rem 0}.tags span,.relation{padding:.22rem .55rem;border:1px solid var(--line);border-radius:999px;background:#fff;font-size:.75rem;font-weight:800}.sourceLink{display:inline-flex;gap:.35rem;flex:0 0 auto;padding:.42rem .65rem;border:1px solid #a9baff;border-radius:.7rem;background:#fff;color:#2448d8;font-weight:800;text-decoration:none}.sourceMissing{color:var(--warn);font-size:.82rem}dl{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.55rem}dl div{min-width:0;padding:.7rem;border:1px solid var(--line);border-radius:.75rem;background:#fff}dt{color:var(--muted);font-size:.72rem;font-weight:900;text-transform:uppercase}dd{margin:.2rem 0 0;overflow-wrap:anywhere}.recordList h4{margin:.9rem 0 .25rem}.recordList ul{margin:.25rem 0}.referenceChip{display:inline-flex;flex-wrap:wrap;gap:.25rem;margin:.1rem;padding:.08rem .3rem;border-radius:.35rem;background:#eaf0ff;color:#173fae;text-decoration:none}.referenceChip small{font-family:ui-monospace,monospace}.subsection{margin:.7rem 0;border:1px solid var(--line);border-radius:.85rem}.subsection>summary{display:flex;justify-content:space-between;gap:1rem;padding:.85rem;cursor:pointer}.edgeList{padding-inline-start:2rem}.edgeList li{margin:.5rem 0}.edgeList p{margin:.25rem 0;color:var(--muted)}.projectionGrid,.conclusionGrid,.referenceIndex{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.7rem}.projectionGrid article h4,.referenceIndex h3{margin:0}.referenceIndex article>span{color:var(--muted);font-size:.73rem;font-weight:900;text-transform:uppercase}.referenceIndex p{margin:.35rem 0;color:var(--muted)}.auditList{padding:0;list-style:none}.auditList li{display:flex;justify-content:space-between;gap:1rem;padding:.65rem;border-bottom:1px solid var(--line)}[data-audit-state="pass"],[data-audit-state="not_applicable"]{color:var(--good)}[data-audit-state="concern"]{color:var(--bad)}.caution,.empty{color:var(--muted)}.jsonInspector pre{max-height:40rem;overflow:auto;padding:1rem;border-radius:.8rem;background:#08111f;color:#dbeafe;direction:ltr;text-align:left;white-space:pre-wrap;overflow-wrap:anywhere}.jsonInspector summary{cursor:pointer;padding:.8rem}.canonicalAppendix{border-style:dashed}:focus-visible{outline:3px solid #ffbf47;outline-offset:3px}
      .gateCard{border-color:rgba(255,255,255,.55);background:rgba(9,15,31,.34)}.compactMetrics{display:grid;gap:.55rem}.compactMetrics span{display:flex;justify-content:space-between;gap:1rem;margin:0}.compactMetrics b{font-size:1rem}
      @media(max-width:800px){.shell{width:min(100% - 1rem,1180px);padding-top:.5rem}.hero{border-radius:1.4rem}.heroGrid,.overviewGrid{grid-template-columns:1fr}.reportToc ol,.projectionGrid,.conclusionGrid,.referenceIndex,dl{grid-template-columns:1fr}.recordCard>header{display:block}.sourceLink,.sourceMissing{margin-top:.65rem}.toolbar{position:static;justify-content:stretch}.toolbar button{flex:1 1 auto}.reportSection>summary{grid-template-columns:auto minmax(0,1fr) auto;gap:.65rem}.recordCount{display:none}}
      @media print{@page{margin:13mm}body{background:#fff;font-size:10.5pt}.shell{width:100%;padding:0}.hero{padding:1.2rem;border-radius:0;box-shadow:none}.toolbar,.reportToc,.skipLink{display:none!important}.overviewGrid{grid-template-columns:1fr}.reportSection{box-shadow:none;break-inside:auto}.reportSection>summary{break-after:avoid-page}.reportSection>summary:after{display:none}.reportSection>.sectionBody,.subsection>*:not(summary),.jsonInspector>*:not(summary){display:block!important}.reportSection:not([open])>.sectionBody,.subsection:not([open])>*:not(summary){display:block!important}.recordCard,.projectionGrid article,.referenceIndex article{break-inside:avoid-page}.canonicalAppendix .jsonInspector{display:none}}
    `;
    const script = `(function(){const sections=[...document.querySelectorAll('.reportSection')];document.querySelector('[data-expand-all]').addEventListener('click',()=>sections.forEach(s=>s.open=true));document.querySelector('[data-collapse-all]').addEventListener('click',()=>sections.forEach(s=>s.open=false));document.querySelector('[data-print]').addEventListener('click',()=>window.print());document.addEventListener('click',event=>{const link=event.target.closest('.referenceChip');if(!link)return;const target=document.querySelector(link.getAttribute('href'));if(!target)return;event.preventDefault();let parent=target.closest('details');while(parent){parent.open=true;parent=parent.parentElement.closest('details')}history.replaceState(null,'',link.getAttribute('href'));target.focus({preventScroll:true});target.scrollIntoView({block:'center',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})});const inspector=document.querySelector('.jsonInspector');inspector.addEventListener('toggle',()=>{if(!inspector.open)return;const target=document.getElementById('canonical-json-view');if(target.textContent)return;try{target.textContent=JSON.stringify(JSON.parse(document.getElementById('canonical-analysis').textContent),null,2)}catch(error){target.textContent='Unable to render canonical JSON.'}});})();`;

    return `<!doctype html><html lang="${locale}" dir="${dir}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="app-version" content="${escapeHtml(version)}"><meta name="analysis-lens" content="biopolitical"><meta name="analysis-contract" content="${escapeHtml(bio.APP_CONTRACT)}"><meta name="schema-version" content="${escapeHtml(bio.SCHEMA_VERSION)}"><title>${escapeHtml(a.subject.title || c.title)}</title><style>${css}</style></head><body data-publication-gate="${gate}"><a class="skipLink" href="#report-content">${escapeHtml(c.skip)}</a><main class="shell" id="report-content" data-analysis-lens="biopolitical" data-export-contract-lens="biopolitical" data-analysis-contract="${escapeHtml(bio.APP_CONTRACT)}" data-schema-version="${escapeHtml(bio.SCHEMA_VERSION)}" data-app-version="${escapeHtml(version)}">
      <header class="hero"><div class="heroGrid"><div><p class="contractLine">${escapeHtml(c.officialContract)} · ${escapeHtml(bio.APP_CONTRACT)} · schema ${escapeHtml(bio.SCHEMA_VERSION)}</p><h1>${escapeHtml(a.subject.title || c.title)}</h1><p>${escapeHtml(c.title)}</p><p class="chain">${escapeHtml(c.chain)}</p></div><div class="statusPanel"><section class="metricCard gateCard"><span class="gateBadge">${escapeHtml(health.publishable ? c.passed : c.blocked)}</span><span>${escapeHtml(c.publication)}</span><small>${escapeHtml(health.publishable ? c.passedNote : c.blockedNote)}</small></section><section class="metricCard"><strong>${score.overall}%</strong><span>${escapeHtml(c.analyticalReadiness)}</span><small>${escapeHtml(c.readinessNote)}</small></section><section class="metricCard compactMetrics"><span><b>${score.analyticalCoverage}%</b> ${escapeHtml(c.analyticalCoverage)}</span><span><b>${score.provenance.sourceTraceability}%</b> ${escapeHtml(c.sourceTraceability)}</span><span><b>${score.provenance.humanReview}%</b> ${escapeHtml(c.humanReview)}</span></section></div></div></header>
      <div class="overviewGrid"><section class="overviewCard"><h2>${escapeHtml(c.executive)}</h2><p>${renderValue(a.subject.executive_finding || "—")}</p><p>${renderValue(a.subject.context || "")}</p></section><section class="overviewCard blockers"><h2>${escapeHtml(c.reviewFirst)}</h2>${health.missing.length ? `<ol>${health.missing.slice(0,5).map((item)=>`<li>${renderValue(item)}</li>`).join("")}</ol>` : `<p>${escapeHtml(c.passedNote)}</p>`}</section></div>
      <nav class="reportToc" aria-label="${escapeHtml(c.contents)}"><h2>${escapeHtml(c.contents)}</h2><ol>${toc.map((item)=>`<li><a href="${item.href}"><span>${item.number}</span>${escapeHtml(item.label)}</a></li>`).join("")}</ol></nav>
      <div class="toolbar" aria-label="${escapeHtml(c.contents)}"><button type="button" data-expand-all>${escapeHtml(c.expand)}</button><button type="button" data-collapse-all>${escapeHtml(c.collapse)}</button><button type="button" data-print>${escapeHtml(c.print)}</button></div>
      ${pillarSections}${conclusion}${atlas}${directory}${appendix}
    </main><script type="application/json" id="canonical-analysis">${canonicalJson}</script><script>${script}</script></body></html>`;
  }

  root.Jarbou3iBiopoliticalReport = Object.freeze({ build });
})(window);
