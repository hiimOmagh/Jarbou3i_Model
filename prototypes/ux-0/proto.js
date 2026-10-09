// Jarbou3i UX-0 prototype: guided wizard + mission-control workspace.
// No network, no framework. Reads the bundled sample analyses, whatever the user pastes and,
// when served next to the app, the app's saved workspaces (read-only, see "Real app data").
// Nothing is persisted except UI preferences.
import { SAMPLES, BIO_SAMPLES } from "./samples.js";
import { I18N, LANGS } from "./i18n.js";
import { BIO_PILLARS, BIO_LABELS } from "./bio-labels.js";

const app = document.getElementById("app");
const ASSET_BASE = app.dataset.assetBase || "../../assets/";
const MASCOT = `${ASSET_BASE}jarbou3i-mascot-192.png`;
const LAYERS = ["interests", "actors", "tools", "narrative", "results", "feedback"];
const PHASES = ["setup", "map", "evidence", "tensions", "futures", "publish"];
const BIO_PHASES = ["setup", "pillars", "evidence", "explanations", "agency", "publish"];
const STEP_COUNT = 6;
const narrow = () => window.matchMedia("(max-width: 1240px)").matches;

/* ---------- Preferences (per-browser conveniences only) ---------- */
const prefs = {
  get(key, fallback) {
    try {
      const value = localStorage.getItem(`j3-ux0:${key}`);
      return value === null ? fallback : JSON.parse(value);
    } catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(`j3-ux0:${key}`, JSON.stringify(value)); } catch { /* storage unavailable */ }
  },
};

const initialLang = prefs.get("lang", (navigator.language || "en").slice(0, 2));
const state = {
  lang: LANGS.includes(initialLang) ? initialLang : "en",
  theme: prefs.get("theme", null), // null follows the system
  density: prefs.get("density", "comfortable"),
  mode: prefs.get("mode", "guided"),
  concept: prefs.get("concept", "b"), // "a" mission control, "b" case file (the default for real-data testing)
  scrollTo: null, // element id to bring into view after the next render
  step: 0,
  stepDir: "forward",
  draft: { topic: "", context: "", lens: "strategic", depth: "expert", sources: "none", sourceText: "", analysisLang: null },
  answer: "",
  check: { status: "empty" },
  promptOpen: false,
  analysis: null,
  phase: "map",
  selection: null, // { type: "layer", key } | { type: "record", id }
  inspectorOpen: false,
  mapAnimated: false,
  palette: null, // { query, index, invoker }
  sheet: null, // { invoker }
  panel: null, // { kind: "workspace" | "resolve", invoker, from } (from: a revision to restore)
  life: null, // the open analysis's lifecycle, see freshLife()
  damaged: false, // a simulated second workspace that failed its integrity check
  removeArmed: false,
  offline: !navigator.onLine,
  lastMood: "",
};

/* ---------- Small utilities ---------- */
const dig = (dict, key) => key.split(".").reduce((node, part) => (node == null ? node : node[part]), dict);
const lookup = (key) => dig(I18N[state.lang], key) ?? dig(I18N.en, key);
function t(key, vars) {
  const text = lookup(key) ?? key;
  return typeof text === "string" && vars ? text.replace(/\{(\w+)\}/g, (_, name) => (name in vars ? vars[name] : `{${name}}`)) : text;
}
const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const $ = (selector, root = document) => root.querySelector(selector);
const fmtNum = (n) => new Intl.NumberFormat(state.lang === "ar" ? "ar" : state.lang).format(n);
const humanize = (key) => String(key).replace(/_/g, " ");
// Display name for a schema section key (a layer, a phase or a record kind), else the raw key.
const sectionName = (key) => lookup(`layers.${key}`)?.[0] ?? lookup(`phases.${key}`)?.[0] ?? lookup(`kinds.${key}`) ?? humanize(key ?? "—");
const isTyping = (el) => el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT" || el.isContentEditable);
// Biopolitical labels are the app's own: bio-labels.js is generated from src/biopolitics.js.
const bioLabel = (group, key) => BIO_LABELS[state.lang]?.[group]?.[key] ?? BIO_LABELS.en[group]?.[key];
const token = (value) => (value ? bioLabel("tokens", value) ?? humanize(value) : "");
const pillarName = (key) => bioLabel("pillars", key)?.[0] ?? humanize(key);
const joined = (value) => (Array.isArray(value) ? value.join(" · ") : value ?? "");
const auditName = (key) => bioLabel("audit", key) ?? humanize(key);
// Neutral values read as plain chips; only actionable states get a status colour.
const statusTag = (tone, text) => (tone === "idle" ? `<span class="chip">${esc(text)}</span>` : `<span class="status ${tone}">${esc(text)}</span>`);

const ICONS = {
  setup: '<path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="18" r="2"/>',
  map: '<circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="12" cy="18" r="2.5"/><path d="M8.5 6h7M7.2 8.2l3.6 7.6M16.8 8.2l-3.6 7.6"/>',
  evidence: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="m9 14 2 2 4-4"/>',
  tensions: '<path d="M4 8h13M14 5l3 3-3 3"/><path d="M20 16H7M10 13l-3 3 3 3"/>',
  futures: '<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
  publish: '<path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6z"/><path d="m9 12 2 2 4-4"/>',
  pillars: '<circle cx="12" cy="12" r="2"/><circle cx="12" cy="4" r="1.6"/><circle cx="19" cy="9" r="1.6"/><circle cx="17" cy="18" r="1.6"/><circle cx="7" cy="18" r="1.6"/><circle cx="5" cy="9" r="1.6"/>',
  explanations: '<path d="M12 21v-6M12 15 6 9M12 15l6-6"/><circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="6" r="2.5"/>',
  agency: '<circle cx="12" cy="6" r="2.5"/><path d="M12 9v6M8 21l4-6 4 6M7 12l5-2 5 2"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"/>',
  panel: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M15 4v16"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>',
  check: '<path d="m5 12 5 5 9-10"/>',
  alert: '<path d="M12 4 2.5 20h19z"/><path d="M12 10v4M12 17.5v.01"/>',
  square: '<rect x="7" y="7" width="10" height="10" rx="1"/>',
  dots: '<path d="M6 12h.01M12 12h.01M18 12h.01"/>',
  next: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  prev: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
  upload: '<path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"/>',
  rows: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  guide: '<path d="M4 20 14 10M15 4v3M20 9h-3M18 6l-1.5 1.5"/>',
  record: '<circle cx="12" cy="12" r="3"/>',
};
const icon = (name, cls = "") => `<svg class="icon ${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICONS[name] || ""}</svg>`;

/* ---------- Analysis model (derived, read-only) ---------- */
const isBio = (a) => a?.analysis_lens === "biopolitical";
const phasesOf = (a) => (isBio(a) ? BIO_PHASES : PHASES);
// The records behind each pillar, grouped as recordsFor() in src/biopolitics.js groups them, so the
// counts match the app's pillarCount(). A path to an object (not a list) is one section record.
const PILLAR_LISTS = {
  question_context: ["subject", "legal_framework", "international_comparison", "capture_levels", "theoretical_comparison"],
  human_functions: ["human_functions"],
  actors_institutions: ["power_map/actors", "power_map/affected_populations", "power_map/institutions", "power_map/power_asymmetries"],
  mechanisms_infrastructure: ["mechanisms/instruments", "mechanisms/infrastructures", "mechanisms/political_economy", "mechanisms/power_modes", "links"],
  meaning_classification: ["meaning_systems/norms", "meaning_systems/regimes_of_truth", "meaning_systems/classifications", "meaning_systems/looping_effects"],
  intervention_capture: ["intervention_assessment/interventions", "intervention_assessment/capture_assessment", "consent_exit", "intervention_assessment/care_control_tensions"],
  distribution_effects: ["distribution/items", "distribution/inequality_dimensions", "distribution/necropolitical_dimensions", "scale_time", "scale_time/future_feedback_loops"],
  evidence_explanations: ["evidence/items", "competing_explanations", "assumptions/items"],
  agency_alternatives: ["resistance_agency/items", "alternatives/items"],
};
const TITLE_FIELDS = ["name", "claim", "proposal", "assumption", "care_claim", "category", "term", "tradition", "jurisdiction_or_context", "actor_or_population", "between", "axis"];
const TOKEN_TITLES = ["level", "mode", "criterion"];
const SECTIONS = ["subject", "legal_framework", "intervention_assessment/capture_assessment", "consent_exit", "scale_time"];
// Like the app, an entry with no text besides its id (an empty template entry) is not counted.
const hasText = (v) => (typeof v === "string" ? v.trim() !== "" : v && typeof v === "object" ? Object.values(v).some(hasText) : false);
function bioRecords(a) {
  const out = [];
  for (const pillar of BIO_PILLARS) {
    for (const list of PILLAR_LISTS[pillar]) {
      const value = dig(a, list.replaceAll("/", "."));
      if (!Array.isArray(value)) {
        // As in the app: a section with a fixed title always counts; the subject counts when it has text.
        if (SECTIONS.includes(list) && (list !== "subject" || hasText(value))) out.push({ kind: "pillar", pillar, list, id: list, title: list === "subject" ? value.research_question || value.title : t(`sections.${list}`), path: `/${list}`, data: value || {} });
        continue;
      }
      value.forEach((item, i) => {
        if (!item || typeof item !== "object" || !Object.entries(item).some(([key, v]) => key !== "id" && hasText(v))) return;
        const field = TITLE_FIELDS.find((key) => item[key]);
        const tokenField = TOKEN_TITLES.find((key) => item[key]);
        const title = item.from && item.to ? `${item.from} → ${item.to}` : field ? item[field] : tokenField ? token(item[tokenField]) : Object.values(item).find((v) => typeof v === "string" && v.includes(" ")) || item.id;
        out.push({ kind: "pillar", pillar, list, id: item.id || `${list}/${i}`, title, path: `/${list}/${i}`, data: item });
      });
    }
  }
  return out;
}
function layerOf(analysis, id) {
  return LAYERS.find((key) => (analysis[key] || []).some((item) => item.id === id));
}
function recordsOf(analysis) {
  if (!analysis) return [];
  if (isBio(analysis)) return bioRecords(analysis);
  const out = [];
  for (const key of LAYERS) {
    (analysis[key] || []).forEach((item, i) => out.push({ kind: "layer", layer: key, id: item.id || `${key}-${i}`, title: item.name || item.description || item.id, path: `/${key}/${i}`, data: item }));
  }
  const groups = [
    ["evidence", "evidence", (x) => x.claim],
    ["assumptions", "assumption", (x) => x.assumption],
    ["contradictions", "contradiction", (x) => x.rhetoric],
    ["scenarios", "scenario", (x) => x.name],
  ];
  for (const [key, kind, title] of groups) {
    (analysis[key]?.items || []).forEach((item, i) => out.push({ kind, id: item.id || `${key}-${i}`, title: title(item), path: `/${key}/items/${i}`, data: item }));
  }
  return out;
}
function metrics(analysis) {
  if (isBio(analysis)) return bioMetrics(analysis);
  const counts = Object.fromEntries(LAYERS.map((key) => [key, (analysis[key] || []).length]));
  const populated = LAYERS.filter((key) => counts[key] > 0).length;
  const evidence = analysis.evidence?.items || [];
  const sourced = evidence.filter((e) => typeof e.source_url === "string" && /^https?:\/\//.test(e.source_url.trim())).length;
  const rated = recordsOf(analysis).filter((r) => r.data.confidence);
  const high = rated.filter((r) => r.data.confidence === "high").length;
  const contradictions = analysis.contradictions?.items || [];
  const scenarios = analysis.scenarios?.items || [];
  const checks = {
    layers: populated === LAYERS.length,
    contradictions: contradictions.length > 0,
    scenarios: scenarios.length > 0 && scenarios.every((s) => (s.disproven_if || []).length > 0),
    sources: sourced > 0,
  };
  // Prototype gate: the production gate lives in the app; this mirrors its two hard blockers.
  const blocked = !checks.layers || !checks.sources;
  return { counts, populated, evidence: evidence.length, sourced, rated: rated.length, high, links: (analysis.links || []).length, checks, blocked };
}
function bioMetrics(a) {
  const records = bioRecords(a);
  const counts = Object.fromEntries(BIO_PILLARS.map((key) => [key, records.filter((r) => r.pillar === key).length]));
  const populated = BIO_PILLARS.filter((key) => counts[key] > 0).length;
  const evidence = a.evidence?.items || [];
  const sourced = evidence.filter((e) => typeof e.source_url === "string" && /^https?:\/\//.test(e.source_url.trim())).length;
  const rated = records.filter((r) => r.data.confidence);
  const explanations = a.competing_explanations || [];
  const assessed = explanations.filter((e) => e.evidentiary_status && e.evidentiary_status !== "not_assessed").length;
  const audit = Object.entries(a.self_audit || {});
  const concerns = audit.filter(([, value]) => value !== "pass" && value !== "not_applicable").map(([key]) => key);
  const checks = {
    pillars: populated === BIO_PILLARS.length,
    sources: sourced > 0,
    explanations: explanations.length > 0 && assessed === explanations.length,
    audit: audit.length > 0 && !concerns.length,
    agency: (a.resistance_agency?.items || []).length > 0 && (a.alternatives?.items || []).length > 0,
  };
  // The app's own publication gate when its engine is served alongside; otherwise a stand-in:
  // pillars, a checkable source, a clean self-audit.
  const gate = realGate(a);
  const blocked = gate ? !gate.publishable : !checks.pillars || !checks.sources || !checks.audit;
  return { bio: true, gate, counts, populated, total: BIO_PILLARS.length, evidence: evidence.length, sourced, rated: rated.length, high: rated.filter((r) => r.data.confidence === "high").length, links: (a.links || []).length, explanations: explanations.length, assessed, concerns, checks, blocked };
}

/* ---------- Workspace lifecycle (simulated; the app's model in miniature) ---------- */
// As in the app, three places stay apart: the working draft (state.analysis), its last local save,
// and immutable revisions. A recovery snapshot holds unsaved edits that a reload interrupted.
const CONF = ["high", "medium", "low"];
const LIFE_BINDS = ["reviewer", "note", "approver", "rationale", "confirm"];
const freshLife = (data) => ({ revisions: [{ seq: 1, kind: "imported", data: structuredClone(data) }], saved: structuredClone(data), snapshot: null, conflict: false, tasks: {}, reviewer: "", note: "", approver: "", rationale: "", confirm: false });
const headRev = () => state.life.revisions.at(-1);
const same = (x, y) => JSON.stringify(x) === JSON.stringify(y);
// Leaf-level differences between two payloads, keyed by canonical JSON path.
function diffPaths(before, after, path = "") {
  if (same(before, after)) return [];
  const branch = (v) => v !== null && typeof v === "object";
  if (!branch(before) || !branch(after)) return [{ path: path || "/", before, after }];
  return [...new Set([...Object.keys(before), ...Object.keys(after)])].flatMap((key) => diffPaths(before[key], after[key], `${path}/${key}`));
}
function lifeOf() {
  const L = state.life;
  return { unsaved: diffPaths(L.saved, state.analysis), uncommitted: diffPaths(headRev().data, L.saved), locked: L.conflict || !!L.snapshot };
}
function setAt(obj, path, value) {
  const keys = path.split("/").filter(Boolean);
  const last = keys.pop();
  const parent = keys.reduce((node, key) => node?.[key], obj);
  if (parent) parent[last] = value;
}
const actionBtn = (action, label, { cls = "", value = "", disabled = false } = {}) => `<button type="button" class="btn ${cls}" data-action="${action}"${value !== "" ? ` data-value="${esc(value)}"` : ""}${disabled ? " disabled" : ""}>${esc(label)}</button>`;
function lifeState() {
  const L = state.life;
  const { unsaved, uncommitted } = lifeOf();
  return L.conflict ? ["crit", "conflict"] : L.snapshot ? ["warn", "snapshot"] : unsaved.length ? ["warn", "dirty"] : uncommitted.length ? ["idle", "uncommitted"] : ["ok", "saved"];
}
function saveLight() {
  const [tone, key] = lifeState();
  const short = t(`life.short.${key}`), long = t(`life.long.${key}`, { n: fmtNum(headRev().seq) });
  return `<button type="button" class="status ${tone} saveLight" data-action="workspace" aria-haspopup="dialog" aria-label="${esc(`${short} · ${long}`)}" title="${esc(long)}">${esc(short)}</button>`;
}
const banner = (tone, title, text, actions = "") => `<div class="note ${tone} banner"><p>${title ? `<b>${esc(title)}</b> ` : ""}${esc(text)}</p>${actions ? `<div class="acts">${actions}</div>` : ""}</div>`;
function lifeBanners() {
  const L = state.life, out = [];
  if (L?.conflict) out.push(banner("crit", "", t("life.conflict"), actionBtn("copyUnsaved", t("life.copyUnsaved")) + actionBtn("reopen", t("life.reopen"), { cls: "primary" })));
  if (L?.snapshot) out.push(banner("warn", t("life.recoveryTitle"), t("life.recoveryHint"), actionBtn("restoreSnapshot", t("life.restore"), { cls: "primary" }) + actionBtn("discardSnapshot", t("life.discard")) + actionBtn("workspace", t("life.compare"), { cls: "ghost" })));
  if (state.damaged) out.push(banner("crit", "", t("life.damagedBanner"), actionBtn("workspace", t("life.reviewWorkspaces"))));
  if (L?.source) out.push(banner("", t("real.bannerTitle"), t("real.bannerBody", { x: L.source.title || t("real.untitled") })));
  if (state.offline) out.push(banner("", "", t("life.offline")));
  return out.length ? `<div class="banners">${out.join("")}</div>` : "";
}
function panelShell(title, body) {
  return `<div class="scrim" data-action="closeOverlay">
    <div class="sheet wide" role="dialog" aria-modal="true" aria-labelledby="panelTitle">
      <div class="sheetHead"><h2 id="panelTitle" tabindex="-1">${esc(title)}</h2><button type="button" class="btn ghost icon-only" data-action="closeSheet" aria-label="${esc(t("close"))}">${icon("close")}</button></div>
      ${body}
    </div>
  </div>`;
}
function workspacePanel() {
  const L = state.life, a = state.analysis;
  let cards = "";
  if (L) {
    const { unsaved, uncommitted, locked } = lifeOf();
    const head = headRev();
    cards = `<div class="lifeGrid">
      <section class="lifeCard"><span class="label">${esc(t("life.snapTitle"))}</span>
        ${L.snapshot ? `${statusTag("warn", t("life.short.snapshot"))}<p>${esc(t("life.snapFound", { n: fmtNum(diffPaths(L.saved, L.snapshot).length) }))}</p>
          <div class="acts">${actionBtn("restoreSnapshot", t("life.restore"), { cls: "primary" })}${actionBtn("discardSnapshot", t("life.discard"))}</div>` : `<p class="help">${esc(t("life.snapNone"))}</p>`}
      </section>
      <section class="lifeCard"><span class="label">${esc(t("life.draftTitle"))}</span>
        ${unsaved.length ? `${statusTag("warn", t("life.dirty"))}<p>${esc(t("life.changes", { n: fmtNum(unsaved.length) }))}</p>` : statusTag("ok", t("life.clean"))}
        <p class="help">${esc(uncommitted.length ? t("life.uncommitted", { n: fmtNum(uncommitted.length) }) : t("life.matchesHead", { n: fmtNum(head.seq) }))}</p>
        <div class="acts">${unsaved.length ? actionBtn("saveDraft", t("life.save"), { cls: "primary", disabled: locked }) : ""}${uncommitted.length ? actionBtn("resolve", t("life.reviewCommit"), { cls: unsaved.length ? "" : "primary", disabled: locked }) : ""}</div>
      </section>
      <section class="lifeCard"><span class="label">${esc(t("life.historyTitle"))}</span>
        <p class="trust">${esc(t("life.historyTrust"))}</p>
        <ol class="revList">${[...L.revisions].reverse().map((r) => `<li><span><b>${esc(t("life.revision", { n: fmtNum(r.seq) }))}</b> <span class="chip">${esc(t(`life.kind.${r.kind}`))}</span>${r === head ? ` ${statusTag("ok", t("life.head"))}` : ""}</span>${r === head ? "" : actionBtn("prepRestore", t("life.prepRestore"), { value: r.seq })}</li>`).join("")}</ol>
      </section>
    </div>`;
  }
  return panelShell(t("life.where"), `<p class="help">${esc(t("life.whereHint"))}</p>
    ${state.offline ? `<p class="note">${esc(t("life.offline"))}</p>` : ""}
    ${cards}
    <section class="lifeCard"><span class="label">${esc(t("life.workspacesTitle"))}</span>
      <ul class="wsList">
        ${a ? `<li><span ${contentLang(a)}>${esc(a.subject?.title || "—")}</span><span class="tags"><span class="chip">${esc(t("life.current"))}</span>${statusTag("ok", t("life.verified"))}</span></li>` : ""}
        ${state.damaged ? `<li><span>${esc(t("life.damagedName"))}<small>${esc(t("life.damaged"))}</small></span>${actionBtn("removeDamaged", t(state.removeArmed ? "life.removeConfirm" : "life.remove"), { cls: state.removeArmed ? "danger" : "" })}</li>` : ""}
      </ul>
      <p class="help">${esc(t("life.storage"))}</p>
      <div class="acts"><button type="button" class="btn" disabled title="${esc(t("inApp"))}">${esc(t("life.exportBundle"))}</button></div>
    </section>
    ${realList()}`);
}
const resolveSource = () => (state.panel?.from ? state.life.revisions.find((r) => r.seq === state.panel.from) : null);
const resolveChanges = () => diffPaths(headRev().data, resolveSource()?.data ?? state.life.saved);
function commitReady() {
  const L = state.life;
  return !!(L.approver.trim() && L.rationale.trim() && L.confirm && resolveChanges().length);
}
// Canonical values as stored; a confidence token also shows its label in the interface language.
const showValue = (path, v) => (typeof v !== "string" ? (v === undefined ? "—" : JSON.stringify(v)) : path.endsWith("/confidence") && CONF.includes(v) ? `${t(`confidence.${v}`)} · ${v}` : v);
function resolvePanel() {
  const L = state.life, source = resolveSource(), changes = resolveChanges();
  const m = metrics(source ? source.data : L.saved);
  const k = source ? "restore" : "resolve";
  return panelShell(t(`life.${k}Title`), `<p class="help">${esc(t(`life.${k}Hint`))}</p>
    <p class="trust">${esc(t(`life.${k}Trust`))}</p>
    <dl class="kv">
      <dt>${esc(t("life.base"))}</dt><dd>${esc(t("life.revision", { n: fmtNum(headRev().seq) }))}</dd>
      ${source ? `<dt>${esc(t("life.source"))}</dt><dd>${esc(t("life.revision", { n: fmtNum(source.seq) }))}</dd>` : ""}
      <dt>${esc(t("life.validation"))}</dt><dd>${statusTag(m.blocked ? "warn" : "ok", t(m.blocked ? "life.validDraft" : "life.validPassed"))}</dd>
    </dl>
    <span class="label">${esc(t("life.diff"))} · ${esc(t("life.changes", { n: fmtNum(changes.length) }))}</span>
    ${changes.length ? `<div class="diffWrap"><table class="diff"><thead><tr><th scope="col">${esc(t("life.path"))}</th><th scope="col">${esc(t("life.before"))}</th><th scope="col">${esc(t("life.after"))}</th></tr></thead>
      <tbody>${changes.map((c) => `<tr><td class="mono" dir="ltr">${esc(c.path)}</td><td ${contentLang(state.analysis)}>${esc(showValue(c.path, c.before))}</td><td ${contentLang(state.analysis)}>${esc(showValue(c.path, c.after))}</td></tr>`).join("")}</tbody></table></div>`
      : `<p class="note">${esc(t(source ? "life.identicalBlocked" : "life.noChanges"))}</p>`}
    <div class="field"><label for="approver">${esc(t("life.approver"))}</label><input id="approver" type="text" data-bind="approver" value="${esc(L.approver)}" autocomplete="name" dir="auto"></div>
    <div class="field"><label for="rationale">${esc(t("life.commitRationale"))}</label><textarea id="rationale" data-bind="rationale" rows="2" dir="auto">${esc(L.rationale)}</textarea></div>
    <label class="confirm"><input type="checkbox" data-bind="confirm" ${L.confirm ? "checked" : ""}><span>${esc(t("life.confirm"))}</span></label>
    <div class="stepActions"><button type="button" class="btn ghost" data-action="closeSheet">${esc(t("close"))}</button>
      <div class="end"><button type="button" class="btn primary" id="commitBtn" data-action="commit" ${commitReady() ? "" : "disabled"}>${esc(t(source ? "life.restoreCommit" : "life.commit"))}</button></div></div>`);
}
const renderPanel = () => (state.panel?.kind === "workspace" ? workspacePanel() : state.panel?.kind === "resolve" ? resolvePanel() : "");
function openPanel(kind, invoker, from = null) {
  state.palette = null;
  state.panel = { kind, from, invoker: state.panel?.invoker || invoker?.dataset?.action || null };
  render({ focus: "#panelTitle" });
}
// Review tasks follow the stand-in gate's checks; the ledger's actions and states are the app's.
const TASK_TONE = { pending: "idle", in_review: "warn", completed: "ok", waived: "ok", stale: "crit" };
const TASK_ACTIONS = { pending: ["task_started", "task_waived"], in_review: ["task_completed", "task_waived"] };
const TASK_RESULT = { task_started: "in_review", task_completed: "completed", task_waived: "waived", task_reopened: "pending" };
const reviewTasks = (m) => (m.bio ? ["pillars", "sources", "explanations", "audit"] : ["layers", "contradictions", "scenarios", "sources"]).map((id) => ({ id, label: t(m.bio && id !== "sources" ? `ckBio.${id}` : `ck.${id}`), status: state.life.tasks[id] || "pending" }));
function reviewRow(m) {
  const tasks = reviewTasks(m);
  const done = tasks.filter((task) => task.status === "completed" || task.status === "waived").length;
  return row(done === tasks.length, t("ck.review"), t("life.reviewCount", { n: fmtNum(done), total: fmtNum(tasks.length) }), done === tasks.length ? "ok" : "warn");
}
function ledgerPanel(m) {
  const L = state.life;
  return `<div class="panelBox ledger"><span class="label">${esc(t("life.ledgerTitle"))}</span>
    <p class="help">${esc(t("life.ledgerHint"))}</p><p class="trust">${esc(t("life.ledgerTrust"))}</p>
    <div class="ledgerFields">
      <div class="field"><label for="reviewer">${esc(t("life.reviewer"))}</label><input id="reviewer" type="text" data-bind="reviewer" value="${esc(L.reviewer)}" autocomplete="name" dir="auto" aria-describedby="reviewerHint"><small class="help" id="reviewerHint">${esc(t("life.identityHint"))}</small></div>
      <div class="field"><label for="note">${esc(t("life.note"))}</label><input id="note" type="text" data-bind="note" value="${esc(L.note)}" dir="auto"></div>
    </div>
    <span class="label">${esc(t("life.tasks"))}</span>
    <ul class="checklist tasks">${reviewTasks(m).map((task) => `<li><span class="status ${TASK_TONE[task.status]}" aria-hidden="true"></span><span>${esc(task.label)}<small>${esc(t(`life.task.${task.status}`))}</small></span>
      <span class="acts">${(TASK_ACTIONS[task.status] || ["task_reopened"]).map((act) => actionBtn("task", t(`life.act.${act}`), { value: `${task.id}|${act}` })).join("")}</span></li>`).join("")}</ul>
  </div>`;
}
function confEdit(rec) {
  const { unsaved, locked } = lifeOf();
  const options = [...new Set([...CONF, rec.data.confidence])];
  return `<div class="field confEdit"><label for="confSel">${esc(t("conf"))}</label>
    <div class="confRow"><select id="confSel" data-bind="confidence" data-path="${esc(rec.path)}" ${locked ? "disabled" : ""}>${options.map((c) => `<option value="${esc(c)}" ${rec.data.confidence === c ? "selected" : ""}>${esc(lookup(`confidence.${c}`) ?? c)}</option>`).join("")}</select>
    ${unsaved.length && !locked ? actionBtn("saveDraft", t("life.save"), { cls: "primary" }) : ""}</div>
    <small class="help">${esc(t("life.editHint"))}</small></div>`;
}
function editConfidence(el) {
  setAt(state.analysis, `${el.dataset.path}/confidence`, el.value);
  render({ focus: "#confSel" });
  announce(t("life.dirty"));
}
// Prototype-only shortcuts that put the workspace into each lifecycle state (command palette).
function simEdit() {
  const rec = recordsOf(state.analysis).find((r) => CONF.includes(r.data.confidence));
  if (rec) setAt(state.analysis, `${rec.path}/confidence`, CONF[(CONF.indexOf(rec.data.confidence) + 1) % CONF.length]);
  return rec;
}
function simReload() {
  const L = state.life;
  if (!lifeOf().unsaved.length) simEdit();
  L.snapshot = structuredClone(state.analysis);
  state.analysis = structuredClone(L.saved);
  state.selection = null; state.inspectorOpen = false;
  render({ focus: "#main" });
  toast(t("sim.reloaded"));
}
const refocus = () => render({ focus: state.panel ? "#panelTitle" : "#main" });

/* ---------- Concept B: case file ---------- */
// Concept A arranges the work by analysis structure (phases, map, inspector). Concept B is UX-0's
// second information architecture: one document that answers, in reading order, where am I, what
// next, what the case says, what is in it, what needs work, and whether it can be published.
const caseMode = () => state.concept === "b" && !!state.analysis;
const layoutSeg = () => `<div class="seg" role="group" aria-label="${esc(t("cb.layout"))}">${["a", "b"].map((v) => `<button type="button" aria-pressed="${state.concept === v}" data-action="concept" data-value="${v}">${esc(t(`cb.concept.${v}`))}</button>`).join("")}</div>`;
function caseGroups(a) {
  const recs = recordsOf(a);
  if (isBio(a)) return BIO_PILLARS.map((key) => ({ id: key, title: pillarName(key), desc: bioLabel("pillars", key)?.[1] || "", required: true, records: recs.filter((r) => r.pillar === key) }));
  return [
    ...LAYERS.map((key) => ({ id: key, title: t(`layers.${key}`)[0], desc: t(`layers.${key}`)[1], required: true, records: recs.filter((r) => r.layer === key) })),
    ...[["evidence", t("phases.evidence")[0]], ["assumption", t("cb.assumptions")], ["contradiction", t("phases.tensions")[0]], ["scenario", t("phases.futures")[0]]]
      .map(([kind, title]) => ({ id: kind, title, desc: "", required: false, records: recs.filter((r) => r.kind === kind) })),
  ];
}
// What the stand-in gate would flag, each with the place to fix it.
function caseIssues(a, m) {
  // With the app's gate, its own list is what needs work; Publish shows it in full.
  if (m.gate) return m.gate.missing.map((text) => ({ tone: "crit", text, jump: "publish" }));
  const out = caseGroups(a).filter((g) => g.required && !g.records.length).map((g) => ({ tone: "crit", text: t("cb.emptyGroup", { x: g.title }), jump: g.id }));
  if (!m.checks.sources) out.push({ tone: "crit", text: t("ck.sources"), note: a.quality_gate?.next_improvement || "", content: true, jump: m.bio ? "evidence_explanations" : "evidence" });
  if (m.bio) {
    if (!m.checks.audit) out.push({ tone: "crit", text: t("ckBio.audit"), note: m.concerns.map(auditName).join(" · "), jump: "publish" });
    if (!m.checks.explanations) out.push({ tone: "warn", text: t("ckBio.explanations"), jump: "evidence_explanations" });
  } else {
    if (!m.checks.contradictions) out.push({ tone: "warn", text: t("ck.contradictions"), jump: "contradiction" });
    if (!m.checks.scenarios) out.push({ tone: "warn", text: t("ck.scenarios"), jump: "scenario" });
  }
  return out;
}
// One next step, in the order the work has to happen.
function nextAction(a, m) {
  const L = state.life, { unsaved, uncommitted } = lifeOf();
  if (L.conflict) return { tone: "crit", text: t("life.long.conflict"), action: "reopen", label: t("life.reopen") };
  if (L.snapshot) return { tone: "warn", text: t("life.long.snapshot"), action: "restoreSnapshot", label: t("life.restore") };
  if (unsaved.length) return { tone: "warn", text: t("life.long.dirty"), action: "saveDraft", label: t("life.save") };
  const issue = caseIssues(a, m).find((x) => x.tone === "crit");
  if (issue) return { tone: "crit", text: t("cb.nextFix", { x: issue.text }), action: "jump", value: issue.jump, label: t("cb.show") };
  if (uncommitted.length) return { tone: "warn", text: t("life.long.uncommitted", { n: fmtNum(headRev().seq) }), action: "resolve", label: t("life.reviewCommit") };
  if (reviewTasks(m).some((x) => x.status !== "completed" && x.status !== "waived")) return { tone: "warn", text: t("cb.nextReview"), action: "jump", value: "publish", label: t("cb.show") };
  return { tone: "ok", text: t(m.gate ? "real.nextExport" : "cb.nextExport"), action: "copyJson", label: t("copyJson") };
}
function caseItemRow(a, r) {
  const open = state.selection?.type === "record" && state.selection.id === r.id;
  return `<li class="item${open ? " open" : ""}" id="item-${esc(r.id)}">
    <button type="button" class="itemHead" data-action="caseItem" data-value="${esc(r.id)}" aria-expanded="${open}"><span ${contentLang(a)}>${esc(r.title)}</span>${confChip(r.data.confidence)}<small class="mono">${esc(r.data.id || "")}</small></button>
    ${open ? `<div class="itemBody"><button type="button" class="pathBtn" data-action="copyPath" data-value="${esc(r.path)}" aria-label="${esc(`${t("copyPath")} ${r.path}`)}">${esc(r.path)}</button>${recordBody(a, r)}</div>` : ""}
  </li>`;
}
function caseFile(a, m) {
  const next = nextAction(a, m), issues = caseIssues(a, m), [, key] = lifeState(), s = a.subject || {};
  const sec = (id, title, body) => `<section class="docSec" id="sec-${id}" aria-labelledby="h-${id}"><h2 id="h-${id}" tabindex="-1">${esc(title)}</h2>${body}</section>`;
  return `<article class="doc">
    <section class="docSec nowCard" id="sec-now" aria-labelledby="h-now"><h1 id="h-now" tabindex="-1">${esc(t("cb.now"))}</h1>
      <dl class="kv">
        <dt>${esc(t("cb.caseLabel"))}</dt><dd ${contentLang(a)}>${esc(s.title)}</dd>
        <dt>${esc(t("cb.lens"))}</dt><dd>${esc(t(isBio(a) ? "lensBio" : "lensStrategic"))}</dd>
        <dt>${esc(t("cb.work"))}</dt><dd>${esc(t(`life.long.${key}`, { n: fmtNum(headRev().seq) }))}</dd>
      </dl>
      <div class="note ${next.tone === "ok" ? "" : next.tone} nextStep"><span class="label">${esc(t("cb.next"))}</span><p>${esc(next.text)}</p>${actionBtn(next.action, next.label, { cls: "primary", value: next.value ?? "" })}</div>
    </section>
    ${sec("case", t("cb.case"), `<dl class="kv">
      <dt>${esc(t("question"))}</dt><dd ${contentLang(a)}>${esc(s.question || s.research_question)}</dd>
      <dt>${esc(t("thesis"))}</dt><dd ${contentLang(a)}>${esc(s.executive_thesis || s.executive_finding)}</dd>
      <dt>${esc(t("context"))}</dt><dd ${contentLang(a)}>${esc(s.context)}</dd></dl>`)}
    ${sec("findings", t("cb.findings"), caseGroups(a).map((g) => `<section class="grp" id="grp-${esc(g.id)}" aria-labelledby="h-grp-${esc(g.id)}">
      <h3 id="h-grp-${esc(g.id)}" tabindex="-1">${esc(g.title)} <small>${esc(t("items", { n: fmtNum(g.records.length) }))}</small></h3>
      ${g.desc ? `<p class="help">${esc(g.desc)}</p>` : ""}
      ${g.records.length ? `<ul class="items">${g.records.map((r) => caseItemRow(a, r)).join("")}</ul>` : `<p class="note${g.required ? " warn" : ""}">${esc(t("cb.emptyGroup", { x: g.title }))}</p>`}</section>`).join(""))}
    ${sec("work", t("cb.needsWork"), issues.length ? `<ul class="checklist tasks">${issues.map((x) => `<li><span class="status ${x.tone}" aria-hidden="true"></span><span>${esc(x.text)}<span class="srOnly"> — ${esc(t(x.tone === "crit" ? "blocked" : "attention"))}</span>${x.note ? `<small ${x.content ? contentLang(a) : ""}>${esc(x.note)}</small>` : ""}</span><span class="acts">${actionBtn("jump", t("cb.show"), { value: x.jump })}</span></li>`).join("")}</ul>` : `<p class="note">${esc(t(m.gate ? "real.noWork" : "cb.noWork"))}</p>`)}
    <section class="docSec" id="sec-publish">${publishView(a, m)}</section>
  </article>`;
}
function caseOutline(a, m) {
  const next = nextAction(a, m), issues = caseIssues(a, m);
  const entry = (id, num, title, hint, tone, sub = false) => `<button type="button" class="phase${sub ? " sub" : ""}" data-action="jump" data-value="${esc(id)}"><span class="num">${num}</span><span class="txt"><b>${esc(title)}</b>${hint ? `<small>${esc(hint)}</small>` : ""}</span><span class="status ${tone}" aria-hidden="true"></span></button>`;
  const groups = caseGroups(a);
  return `<nav class="rail outline" aria-label="${esc(t("cb.outline"))}"><span class="label">${esc(t("cb.outline"))}</span>
    ${entry("now", "01", t("cb.now"), next.text, next.tone)}
    ${entry("case", "02", t("cb.case"), "", "idle")}
    ${entry("findings", "03", t("cb.findings"), "", groups.some((g) => g.required && !g.records.length) ? "crit" : "ok")}
    ${groups.map((g) => entry(g.id, "", g.title, "", g.records.length ? "ok" : g.required ? "crit" : "idle", true)).join("")}
    ${entry("work", "04", t("cb.needsWork"), issues.length ? t("cb.issueCount", { n: fmtNum(issues.length) }) : "", issues.some((x) => x.tone === "crit") ? "crit" : issues.length ? "warn" : "ok")}
    ${entry("publish", "05", t("pTitle"), t(m.blocked ? "blocked" : "readyShort"), m.blocked ? "crit" : "ok")}
    <div class="railFoot">${layoutSeg()}</div>
  </nav>`;
}

/* ---------- Answer checking ---------- */
function unclosedDepth(text) {
  let depth = 0, inString = false, escaped = false;
  for (const ch of text) {
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === '"') inString = false;
    } else if (ch === '"') inString = true;
    else if (ch === "{" || ch === "[") depth++;
    else if (ch === "}" || ch === "]") depth--;
  }
  return inString ? Math.max(depth, 1) : depth;
}
function checkAnswer(raw, lens = null) {
  const text = raw.trim();
  if (!text) return { status: "empty" };
  const start = text.indexOf("{");
  if (start < 0) return { status: "invalid", message: t("vNoJson") };
  const body = text.slice(start).replace(/```\s*$/, "");
  if (unclosedDepth(body) > 0) return { status: "truncated" };
  let data;
  try {
    data = JSON.parse(body.slice(0, body.lastIndexOf("}") + 1));
  } catch (error) {
    return { status: "invalid", message: t("vInvalid", { error: String(error.message).replace(/^JSON\.parse: /, "").slice(0, 80) }) };
  }
  const lensName = (key) => t(key === "biopolitical" ? "lensBio" : "lensStrategic");
  const found = isBio(data) ? "biopolitical" : "strategic";
  if (lens && lens !== found) return { status: "invalid", message: t("vWrongLens", { x: lensName(found), y: lensName(lens) }) };
  if (found === "biopolitical") {
    const { counts } = bioMetrics(data);
    const missing = BIO_PILLARS.filter((key) => !counts[key]);
    if (missing.length === BIO_PILLARS.length) return { status: "invalid", message: t("vNotBio") };
    return { status: missing.length ? "partial" : "valid", data, missing };
  }
  const present = LAYERS.filter((key) => Array.isArray(data?.[key]) && data[key].length);
  if (!present.length) return { status: "invalid", message: t("vNotStrategic") };
  const missing = LAYERS.filter((key) => !present.includes(key));
  return { status: missing.length ? "partial" : "valid", data, missing };
}
function checkView(check) {
  const m = check.data ? metrics(check.data) : null;
  switch (check.status) {
    case "valid": return { tone: "ok", text: t(m.bio ? "vValidBio" : "vValid", { n: m.populated, layers: m.populated, links: m.links, evidence: m.evidence }), mood: "ok", say: t("mValid") };
    case "partial": return { tone: "warn", text: t(m.bio ? "vPartialBio" : "vPartial", { n: check.missing.length, list: check.missing.map((k) => (m.bio ? pillarName(k) : t(`layers.${k}`)[0])).join(", ") }), mood: "warn", say: t("mPartial") };
    case "truncated": return { tone: "warn", text: t("vTruncated"), mood: "warn", say: t("mTrunc") };
    case "invalid": return { tone: "crit", text: check.message, mood: "crit", say: t("mInvalid") };
    default: return { tone: "idle", text: t("vEmpty"), mood: "idle", say: t("mWait") };
  }
}

/* ---------- Prompt (prototype stand-in for the app's prompt builder) ---------- */
function buildPrompt() {
  const d = state.draft;
  const lang = I18N[d.analysisLang || state.lang].langName;
  const lens = d.lens === "biopolitical" ? "Biopolitical Training Map v2.1" : "Strategic v1.1 (interests → actors → tools → narrative → results → feedback)";
  const sources = { none: "No source access: produce a conceptual draft and mark every claim as unverified.", provided: `Use only these supplied sources:\n${d.sourceText || "(none pasted yet)"}`, web: "Live web research is allowed: cite a URL and date for every source-based claim." }[d.sources];
  return [
    `You are a rigorous analyst. Produce a ${lens} analysis.`,
    `Topic: ${d.topic || "(topic)"}`,
    d.context ? `Context: ${d.context}` : "",
    `Depth: ${d.depth}. Write the analysis in ${lang}.`,
    sources,
    d.lens === "biopolitical"
      ? 'Return ONLY one JSON object (no prose) with "analysis_lens": "biopolitical" and: subject, framing, capture_levels, human_functions, power_map, mechanisms, meaning_systems, intervention_assessment, distribution, consent_exit, competing_explanations, evidence, assumptions, resistance_agency, alternatives, calibrated_conclusion, self_audit, links.'
      : "Return ONLY one JSON object (no prose) with: subject, interests, actors, tools, narrative, results, feedback, contradictions, scenarios, evidence, assumptions, links, quality_gate.",
    "Give every record an id, a confidence (high | medium | low) and a rationale. Never invent sources.",
  ].filter(Boolean).join("\n\n");
}
const continuePrompt = () => "Your previous JSON answer was cut off. Continue exactly where it stopped. Output only the remaining characters, with no repetition and no commentary.";

/* ---------- Theme / language / density ---------- */
function resolvedTheme() {
  return state.theme || (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
}
function applyRootAttributes() {
  const root = document.documentElement;
  root.lang = state.lang;
  root.dir = I18N[state.lang].dir;
  if (state.theme) root.dataset.theme = state.theme; else delete root.dataset.theme;
  app.dataset.density = state.density;
  document.title = state.mode === "pro" && state.analysis ? `${state.analysis.subject?.title || "Analysis"} · Jarbou3i` : "Jarbou3i Command Center";
}

/* ---------- Live region + toast ---------- */
let toastTimer = 0;
function announce(message) {
  const live = $("#live");
  if (live) { live.textContent = ""; requestAnimationFrame(() => { live.textContent = message; }); }
}
function toast(message, tone = "ok") {
  $(".toast")?.remove();
  const el = document.createElement("div");
  el.className = "toast";
  el.innerHTML = `${icon(tone === "ok" ? "check" : "alert", "sm")}<span>${esc(message)}</span>`;
  document.body.append(el);
  announce(message);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.remove(), 2800);
}
async function copy(text, okMessage) {
  try {
    await navigator.clipboard.writeText(text);
    toast(okMessage);
    return true;
  } catch {
    toast(t("copyFailed"), "warn");
    return false;
  }
}

/* ---------- Shared pieces ---------- */
function mascot(mood, message, { react = false } = {}) {
  const badge = { ok: "check", warn: "alert", crit: "square", thinking: "dots" }[mood];
  return `<div class="mascot ${mood} ${react ? "react" : ""} ${mood === "idle" ? "idle" : ""}" role="status" aria-live="polite">
    <div class="mascotFace"><img src="${esc(MASCOT)}" alt="" width="64" height="64">${badge ? `<span class="badge">${icon(badge)}</span>` : ""}</div>
    <p class="bubble">${esc(message)}</p>
  </div>`;
}
function topControls() {
  const dark = resolvedTheme() === "dark";
  return `<div class="seg" role="radiogroup" aria-label="${esc(t("langLabel"))}">
      ${LANGS.map((code) => `<button type="button" role="radio" aria-checked="${code === state.lang}" tabindex="${code === state.lang ? 0 : -1}" data-action="lang" data-value="${code}" lang="${code}">${esc(I18N[code].langShort)}</button>`).join("")}
    </div>
    <button type="button" class="btn ghost icon-only" data-action="theme" aria-label="${esc(dark ? t("themeToLight") : t("themeToDark"))}" title="${esc(dark ? t("themeToLight") : t("themeToDark"))}">${icon(dark ? "sun" : "moon")}</button>`;
}
function brand() {
  return `<div class="brand"><img src="${esc(MASCOT)}" alt="" width="30" height="30"><b>JARBOU3I</b><span>// ${esc(t("brandSub"))}</span></div>`;
}

/* ---------- Guided wizard ---------- */
function wizardStep() {
  const d = state.draft;
  switch (state.step) {
    case 0: return {
      mood: "idle", say: t("m1"),
      body: `<div class="field">
          <label for="topic">${esc(t("topicLabel"))}</label>
          <textarea id="topic" class="topicInput" data-bind="topic" placeholder="${esc(t("topicPlaceholder"))}" aria-describedby="topicHelp">${esc(d.topic)}</textarea>
        </div>
        <div class="examples" id="topicHelp"><span class="help">${esc(t("examplesLabel"))}</span>
          ${t("examples").map(([topic, ctx], i) => `<button type="button" class="chipBtn" data-action="example" data-value="${i}" title="${esc(ctx)}">${esc(topic)}</button>`).join("")}
        </div>
        <div class="field">
          <label for="context">${esc(t("contextLabel"))} <span class="help">(${esc(t("optional"))})</span></label>
          <input id="context" type="text" data-bind="context" value="${esc(d.context)}" placeholder="${esc(t("contextPlaceholder"))}">
        </div>
        ${real.list.length ? realList() : ""}`,
      canContinue: d.topic.trim().length >= 4,
    };
    case 1: return {
      mood: "idle", say: t("m2"),
      body: `<div class="choiceGrid" role="radiogroup" aria-label="${esc(t("s2Title"))}">
          ${lensChoice("strategic", t("lensStrategic"), t("lensStrategicDesc"), miniLoop())}
          ${lensChoice("biopolitical", t("lensBio"), t("lensBioDesc"), miniPillars())}
        </div>`,
      canContinue: true,
    };
    case 2: return {
      mood: "idle", say: t("m3"),
      body: `${choiceGroup("depth", t("depthLabel"), ["simple", "expert", "research"], (k) => t(`depth.${k}`))}
        ${choiceGroup("sources", t("sourcesLabel"), ["none", "provided", "web"], (k) => t(`sources.${k}`))}
        ${d.sources === "provided" ? `<div class="field"><label for="sourceText">${esc(t("sourcesBoxLabel"))}</label><textarea id="sourceText" data-bind="sourceText" rows="4" placeholder="${esc(t("sourcesPlaceholder"))}">${esc(d.sourceText)}</textarea></div>` : ""}
        <div class="field"><label for="analysisLang">${esc(t("analysisLangLabel"))}</label>
          <select id="analysisLang" data-bind="analysisLang">${LANGS.map((code) => `<option value="${code}" ${(d.analysisLang || state.lang) === code ? "selected" : ""}>${esc(I18N[code].langName)}</option>`).join("")}</select>
        </div>`,
      canContinue: true,
    };
    case 3: {
      const prompt = buildPrompt();
      return {
        mood: "thinking", say: t("m4"),
        body: `${state.offline ? `<p class="note">${esc(t("life.offline"))}</p>` : ""}<ol class="howTo">${t("howTo").map((line) => `<li>${esc(line)}</li>`).join("")}</ol>
          <div class="copyRow">
            <button type="button" class="btn primary lg" data-action="copyPrompt">${icon("copy")}${esc(t("copyPrompt"))}</button>
            <button type="button" class="btn ghost" data-action="togglePrompt" aria-expanded="${state.promptOpen}" aria-controls="promptText">${esc(state.promptOpen ? t("hidePrompt") : t("showPrompt"))}</button>
            <span class="help mono">${esc(t("chars", { n: fmtNum(prompt.length) }))}</span>
          </div>
          <div class="promptBox" ${state.promptOpen ? "" : "hidden"}>
            <pre id="promptText" tabindex="0" dir="ltr">${esc(prompt)}</pre>
            <p class="help">${esc(t("promptNote"))}</p>
          </div>`,
        canContinue: true,
      };
    }
    case 4: {
      const view = checkView(state.check);
      return {
        mood: view.mood, say: view.say,
        body: `<div class="field dropZone" data-drop>
            <label for="answer">${esc(t("answerLabel"))}</label>
            <textarea id="answer" data-bind="answer" spellcheck="false" dir="auto" placeholder="${esc(t("answerPlaceholder"))}" aria-describedby="checkLine">${esc(state.answer)}</textarea>
          </div>
          ${validationLine(view)}
          <div class="copyRow">
            <button type="button" class="btn ghost" data-action="useSample">${icon("upload")}${esc(t("useSample"))}</button>
            <button type="button" class="btn" data-action="copyContinue" ${state.check.status === "truncated" ? "" : "hidden"}>${icon("copy")}${esc(t("copyContinue"))}</button>
          </div>`,
        canContinue: state.check.status === "valid" || state.check.status === "partial",
        continueLabel: t("openAnalysis"),
      };
    }
    default: {
      const a = state.analysis;
      const m = metrics(a);
      return {
        mood: m.blocked ? "warn" : "ok", say: m.blocked ? t(m.bio ? "m6BlockedBio" : "m6Blocked") : t("m6Ready"),
        body: `<div class="field">
            <span class="label">${esc(t("mainFinding"))}</span>
            <p class="finding" ${contentLang(a)}>${esc(a.subject?.executive_thesis || a.subject?.executive_finding || a.subject?.title)}</p>
          </div>
          <div class="summaryGrid">
            <div class="summaryTile"><span class="label">${esc(t("howSure"))}</span>
              <div class="dots" aria-hidden="true">${Array.from({ length: 5 }, (_, i) => `<i class="${i < Math.round((m.high / Math.max(m.rated, 1)) * 5) ? "on" : ""}"></i>`).join("")}</div>
              <p>${esc(t("sureText", { high: fmtNum(m.high), total: fmtNum(m.rated) }))}</p></div>
            <div class="summaryTile"><span class="label">${esc(t("whatsMissing"))}</span>
              <strong class="mono">${fmtNum(m.sourced)}/${fmtNum(m.evidence)}</strong>
              <p>${esc(t("sourcedText", { n: fmtNum(m.sourced), total: fmtNum(m.evidence) }))}</p>
              ${a.quality_gate?.next_improvement ? `<p ${contentLang(a)}>${esc(a.quality_gate.next_improvement)}</p>` : ""}</div>
            <div class="summaryTile"><span class="label">${esc(t("canPublish"))}</span>
              <span class="status ${m.blocked ? "crit" : "ok"}">${esc(m.blocked ? t("notYet") : t("ready"))}</span>
              <p>${esc(t(`${m.blocked ? "blockedWhy" : "readyWhy"}${m.bio ? "Bio" : ""}`))}</p></div>
          </div>`,
        canContinue: true,
        continueLabel: t("openWorkspace"),
        final: true,
      };
    }
  }
}
function lensChoice(value, title, desc, art) {
  const on = state.draft.lens === value;
  return `<button type="button" class="choice lens" role="radio" aria-checked="${on}" tabindex="${on ? 0 : -1}" data-action="choose" data-field="lens" data-value="${value}">
    ${art}<b>${esc(title)}</b><span>${esc(desc)}</span></button>`;
}
function choiceGroup(field, label, values, copyOf) {
  return `<div class="field"><span class="fieldLabel" id="lbl-${field}">${esc(label)}</span>
    <div class="choiceGrid" role="radiogroup" aria-labelledby="lbl-${field}">
      ${values.map((value) => {
        const on = state.draft[field] === value;
        const [title, desc] = copyOf(value);
        return `<button type="button" class="choice" role="radio" aria-checked="${on}" tabindex="${on ? 0 : -1}" data-action="choose" data-field="${field}" data-value="${value}"><b>${esc(title)}</b><span>${esc(desc)}</span></button>`;
      }).join("")}
    </div></div>`;
}
function miniLoop() {
  const pts = LAYERS.map((_, i) => { const a = (-90 + i * 60) * Math.PI / 180; return [110 + Math.cos(a) * 80, 32 + Math.sin(a) * 24]; });
  return `<svg class="mini" viewBox="0 0 220 64" aria-hidden="true">
    <path d="${pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ")}Z" fill="none" stroke="currentColor" stroke-opacity=".35"/>
    ${pts.map((p) => `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="6" fill="var(--signal)"/>`).join("")}</svg>`;
}
function miniPillars() {
  return `<svg class="mini" viewBox="0 0 220 64" aria-hidden="true">
    ${Array.from({ length: 9 }, (_, i) => `<rect x="${10 + i * 23}" y="${40 - (i % 3) * 10}" width="14" height="${16 + (i % 3) * 10}" rx="3" fill="var(--signal)" fill-opacity="${0.45 + (i % 3) * 0.2}"/>`).join("")}</svg>`;
}
function validationLine(view) {
  return `<div id="checkLine" class="validation ${view.tone}" role="status" aria-live="polite"><span class="status ${view.tone}" aria-hidden="true"></span><p>${esc(view.text)}</p></div>`;
}

function renderWizard() {
  const step = wizardStep();
  const moodChanged = state.lastMood !== `${state.step}:${step.mood}`;
  state.lastMood = `${state.step}:${step.mood}`;
  const titles = [t("s1Title"), t("s2Title"), t("s3Title"), t("s4Title"), t("s5Title"), t("s6Title")];
  const hints = [t("s1Hint"), t("s2Hint"), t("s3Hint"), t("s4Hint"), t("s5Hint"), t("s6Hint")];
  return `<div class="wizard">
    <header class="topbar">
      ${brand()}
      <div class="progress" role="progressbar" aria-label="${esc(t("stepOf", { n: state.step + 1, total: STEP_COUNT }))}" aria-valuemin="1" aria-valuemax="${STEP_COUNT}" aria-valuenow="${state.step + 1}">
        ${Array.from({ length: STEP_COUNT }, (_, i) => `<span class="${i < state.step ? "done" : i === state.step ? "current" : ""}"></span>`).join("")}
      </div>
      <div class="spacer"></div>
      <div class="cluster">${topControls()}
        <button type="button" class="btn ghost" data-action="toPro" aria-label="${esc(t("skipToWorkspace"))}"><span class="hideSm">${esc(t("skipToWorkspace"))}</span>${icon("next", "sm flip")}</button>
      </div>
    </header>
    <main class="wizardBody" id="main">
      <aside class="guide">
        ${mascot(step.mood, step.say, { react: moodChanged && step.mood !== "idle" })}
        <ol class="stepList">${t("steps").map((name, i) => `<li class="${i < state.step ? "done" : i === state.step ? "current" : ""}" ${i === state.step ? 'aria-current="step"' : ""}><span class="n">${i < state.step ? icon("check", "sm") : i + 1}</span>${esc(name)}</li>`).join("")}</ol>
      </aside>
      <section class="card stepEnter-${state.stepDir}" aria-labelledby="stepTitle">
        <div class="stepHead">
          <span class="label">${esc(t("stepOf", { n: state.step + 1, total: STEP_COUNT }))}</span>
          <h1 id="stepTitle" tabindex="-1">${esc(titles[state.step])}</h1>
          <p>${esc(hints[state.step])}</p>
        </div>
        ${step.body}
        <div class="stepActions">
          ${state.step > 0 ? `<button type="button" class="btn ghost" data-action="prev">${icon("prev", "sm flip")}${esc(t("back"))}</button>` : "<span></span>"}
          <div class="end">
            ${step.final ? `<button type="button" class="btn" data-action="restart">${esc(t("startOver"))}</button>` : ""}
            <button type="button" class="btn primary lg" data-action="${step.final ? "toPro" : "next"}" id="nextBtn" ${step.canContinue ? "" : "disabled"}>${esc(step.continueLabel || t("continue"))}${icon("next", "sm flip")}</button>
          </div>
        </div>
      </section>
    </main>
  </div>`;
}

/* ---------- Workspace ---------- */
const contentLang = (a) => (a?.language ? `lang="${esc(a.language)}" dir="${a.language === "ar" ? "rtl" : "ltr"}"` : 'dir="auto"');
function confChip(level) {
  return level ? `<span class="chip ${esc(level)}">${esc(t(`confidence.${level}`) || level)}</span>` : "";
}

function renderPro() {
  const a = state.analysis;
  const m = a ? metrics(a) : null;
  const b = caseMode();
  return `<div class="pro${b ? " caseMode" : ""}">
    <header class="topbar">
      ${brand()}
      ${a ? `<span class="caseTitle" title="${esc(a.subject?.title)}" ${contentLang(a)}>${esc(a.subject?.title)}</span>` : ""}
      <div class="spacer"></div>
      <div class="cluster">
        <span class="status ok hideSm" title="${esc(t("localHint"))}">${esc(t("local"))}</span>
        ${a ? saveLight() : ""}${state.offline ? `<span class="status idle hideSm">${esc(t("life.short.offline"))}</span>` : ""}
        ${m ? `<span class="status ${m.blocked ? "crit" : "ok"}">${esc(m.blocked ? t("blocked") : t("readyShort"))}</span>` : ""}
        <button type="button" class="btn" data-action="palette" aria-haspopup="dialog" aria-keyshortcuts="Control+K Meta+K" aria-label="${esc(t("search"))}">${icon("search")}<span class="hideSm">${esc(t("search"))}</span><kbd class="hideSm">Ctrl K</kbd></button>
        ${topControls()}
        <button type="button" class="btn ghost hideSm" data-action="toGuided">${icon("guide")}${esc(t("guided"))}</button>
        ${a && !b ? `<button type="button" class="btn ghost icon-only inspToggle" data-action="inspector" aria-expanded="${state.inspectorOpen}" aria-controls="inspector" aria-label="${esc(t("openInspector"))}">${icon("panel")}</button>` : ""}
      </div>
    </header>
    ${b ? caseOutline(a, m) : `<nav class="rail" aria-label="${esc(t("phasesLabel"))}">
      <span class="label">${esc(t("phasesLabel"))}</span>
      ${phasesOf(a).map((key, i) => phaseButton(key, i, m)).join("")}
      <div class="railFoot">
        <div class="seg" role="group" aria-label="${esc(t("density"))}">
          <button type="button" aria-pressed="${state.density === "comfortable"}" data-action="density" data-value="comfortable">${esc(t("comfortable"))}</button>
          <button type="button" aria-pressed="${state.density === "compact"}" data-action="density" data-value="compact">${esc(t("compact"))}</button>
        </div>
        ${layoutSeg()}
        <span><kbd>1</kbd>–<kbd>6</kbd> · <kbd>Ctrl K</kbd></span>
      </div>
    </nav>`}
    <main class="canvas" id="main" tabindex="-1">
      <div class="canvasInner">${lifeBanners()}${a ? (b ? caseFile(a, m) : phaseView(a, m)) : emptyWorkspace()}</div>
    </main>
    ${a && !b ? `<aside class="inspector ${state.inspectorOpen ? "open" : ""}" id="inspector" aria-label="${esc(t("inspector"))}">${inspector(a, m)}</aside>` : ""}
  </div>`;
}
function phaseButton(key, i, m) {
  const [name, hint] = t(`phases.${key}`);
  let tone = "idle";
  if (m) {
    tone = { setup: "ok", map: m.checks.layers ? "ok" : "warn", pillars: m.checks.pillars ? "ok" : "warn", evidence: m.checks.sources ? "ok" : "crit", tensions: m.checks.contradictions ? "ok" : "warn", futures: m.checks.scenarios ? "ok" : "warn", explanations: m.checks.explanations ? "ok" : "warn", agency: m.checks.agency ? "ok" : "warn", publish: m.blocked ? "crit" : "ok" }[key];
  }
  return `<button type="button" class="phase" data-action="phase" data-value="${key}" ${state.phase === key ? 'aria-current="page"' : ""} ${state.analysis ? "" : "disabled"} title="${esc(name)}">
    <span class="num">${String(i + 1).padStart(2, "0")}</span>
    <span class="txt"><b>${esc(name)}</b><small>${esc(hint)}</small></span>
    <span class="status ${tone}" aria-hidden="true"></span>
  </button>`;
}
function emptyWorkspace() {
  return `<div class="empty">
    ${mascot("idle", t("m0"))}
    <h1 tabindex="-1">${esc(t("emptyTitle"))}</h1>
    <p class="help">${esc(t("emptyBody"))}</p>
    <div class="actions">
      <button type="button" class="btn primary lg" data-action="toGuided">${icon("guide")}${esc(t("startGuided"))}</button>
      <button type="button" class="btn lg" data-action="paste">${icon("upload")}${esc(t("pasteNew"))}</button>
      <button type="button" class="btn ghost lg" data-action="loadSample" data-value="strategic">${esc(t("loadSample"))}</button>
      <button type="button" class="btn ghost lg" data-action="loadSample" data-value="biopolitical">${esc(t("loadBioSample"))}</button>
    </div>
    ${realList()}
  </div>`;
}
function head(title, hint, extra = "") {
  // In the case file a phase view is one section of the document, so its title is an h2.
  const h = caseMode() ? "h2" : "h1";
  return `<div class="canvasHead"><div><${h} tabindex="-1" id="phaseTitle">${esc(title)}</${h}><p>${esc(hint)}</p></div>${extra}</div>`;
}
function phaseView(a, m) {
  switch (state.phase) {
    case "setup": return setupView(a);
    case "evidence": return evidenceView(a);
    case "tensions": return tensionsView(a);
    case "futures": return futuresView(a);
    case "explanations": return explanationsView(a, m);
    case "agency": return agencyView(a);
    case "publish": return publishView(a, m);
    default: return isBio(a) ? pillarsView(a, m) : mapView(a, m);
  }
}

function mapView(a, m) {
  return `${head(t("mapTitle"), t("mapHint"))}
    <div class="panelBox mapWrap">${causalMap(a, m)}
      <div class="mapLegend">
        <span><i></i>${esc(t("legendFlow"))}</span>
        <span><i class="authored"></i>${esc(t("legendAuthored"))}</span>
        <span><i class="feedback"></i>${esc(t("legendFeedback"))}</span>
        <span><i class="ring"></i>${esc(t("legendRing"))}</span>
      </div>
    </div>
    <div class="readout">
      ${tile(m.checks.layers ? "ok" : "warn", t("rLayers"), `${fmtNum(m.populated)}<small>/6</small>`)}
      ${tile(m.links ? "ok" : "warn", t("rLinks"), fmtNum(m.links))}
      ${tile(m.sourced ? "ok" : "crit", t("rSources"), `${fmtNum(m.sourced)}<small>/${fmtNum(m.evidence)}</small>`)}
      ${tile(m.blocked ? "crit" : "ok", t("rGate"), `<span class="status ${m.blocked ? "crit" : "ok"}">${esc(m.blocked ? t("blocked") : t("readyShort"))}</span>`)}
    </div>`;
}
function tile(tone, label, value) {
  return `<div class="tile ${tone}"><span class="label">${esc(label)}</span><span class="val">${value}</span></div>`;
}

// Curved edge between two node centres, trimmed to the node rims; shared by both maps.
function mapEdge([x1, y1], [x2, y2], { R, bend, rtl, cls = "", label = "", arrow = true }) {
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
  const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy);
  const qx = mx + (-dy / len) * bend * (rtl ? -1 : 1), qy = my + (dx / len) * bend * (rtl ? -1 : 1);
  const trim = (px, py, ox, oy, by) => { const vx = ox - px, vy = oy - py, l = Math.hypot(vx, vy); return [px + (vx / l) * by, py + (vy / l) * by]; };
  const [sx, sy] = trim(x1, y1, qx, qy, R + 14), [ex, ey] = trim(x2, y2, qx, qy, R + 18);
  const marker = cls.includes("authored") ? "arrowA" : cls.includes("feedback") ? "arrowF" : "arrow";
  return `<path class="edge ${cls}" d="M${sx.toFixed(1)} ${sy.toFixed(1)} Q${qx.toFixed(1)} ${qy.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}"${arrow ? ` marker-end="url(#${marker})"` : ""}/>
      ${label ? `<text class="edgeLabel" x="${(0.25 * sx + 0.5 * qx + 0.25 * ex).toFixed(1)}" y="${(0.25 * sy + 0.5 * qy + 0.25 * ey - 6).toFixed(1)}" text-anchor="middle">${esc(label)}</text>` : ""}`;
}
const mapMarkers = () => [["arrow", "var(--line-strong)"], ["arrowA", "var(--signal)"], ["arrowF", "var(--warn)"]].map(([id, color]) => `<marker id="${id}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 10 5 0 10z" fill="${color}"/></marker>`).join("");
function causalMap(a, m) {
  const W = 760, H = 520, cx = W / 2, cy = H / 2 - 6, rx = 250, ry = 176, R = 46;
  const rtl = I18N[state.lang].dir === "rtl";
  const pos = Object.fromEntries(LAYERS.map((key, i) => {
    const angle = (-90 + i * 60) * Math.PI / 180;
    const x = cx + Math.cos(angle) * rx * (rtl ? -1 : 1);
    return [key, [x, cy + Math.sin(angle) * ry]];
  }));
  // Aggregate authored item links into layer pairs.
  const authored = new Map();
  for (const link of a.links || []) {
    const from = layerOf(a, link.from), to = layerOf(a, link.to);
    if (!from || !to || from === to) continue;
    const key = `${from}>${to}`;
    authored.set(key, [...(authored.get(key) || []), link.relation]);
  }
  const edge = (from, to, cls, label, bend) => mapEdge(pos[from], pos[to], { R, bend, rtl, cls, label });
  let edges = "";
  LAYERS.forEach((key, i) => {
    const next = LAYERS[(i + 1) % LAYERS.length];
    const rel = authored.get(`${key}>${next}`);
    edges += edge(key, next, rel ? "authored" : "", rel ? rel.join(", ") : "", -26);
    authored.delete(`${key}>${next}`);
  });
  for (const [pair, relations] of authored) {
    const [from, to] = pair.split(">");
    edges += edge(from, to, "authored", relations.join(", "), 40);
  }
  for (const item of a.feedback || []) {
    if (LAYERS.includes(item.adapts) && item.adapts !== "interests") edges += edge("feedback", item.adapts, "feedback", t("adapts"), 60);
  }
  const nameLabel = (x, y, name) => {
    const ux = (x - cx) / rx, uy = (y - cy) / ry;
    if (Math.abs(ux) < 0.3) return `<text class="name" x="${x.toFixed(1)}" y="${(y + (uy < 0 ? -(R + 16) : R + 26)).toFixed(1)}" text-anchor="middle">${esc(name)}</text>`;
    return `<text class="name" x="${(x + Math.sign(ux) * (R + 14)).toFixed(1)}" y="${(y + 5).toFixed(1)}" text-anchor="${ux > 0 ? "start" : "end"}">${esc(name)}</text>`;
  };
  const selectedLayer = state.selection?.type === "layer" ? state.selection.key : state.selection?.type === "record" ? layerOf(a, state.selection.id) : null;
  const nodes = LAYERS.map((key, i) => {
    const [x, y] = pos[key];
    const items = a[key] || [];
    const share = items.length ? items.filter((it) => it.confidence === "high").length / items.length : 0;
    const C = 2 * Math.PI * (R + 6);
    const [name] = t(`layers.${key}`);
    const label = `${name}: ${t("items", { n: fmtNum(items.length) })}`;
    return `<g class="node ${items.length ? "" : "empty"} ${selectedLayer === key ? "selected" : ""}" style="--i:${i}" role="button" tabindex="0" aria-label="${esc(label)}" aria-pressed="${selectedLayer === key}" data-action="selectLayer" data-value="${key}">
      <circle class="ring-bg" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${R + 6}"/>
      <circle class="ring" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${R + 6}" stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${(C * (1 - share)).toFixed(1)}" transform="rotate(-90 ${x.toFixed(1)} ${y.toFixed(1)})"/>
      <circle class="disc" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${R}"/>
      <text class="idx" x="${x.toFixed(1)}" y="${(y - 16).toFixed(1)}" text-anchor="middle">${String(i + 1).padStart(2, "0")}</text>
      <text class="count" x="${x.toFixed(1)}" y="${(y + 14).toFixed(1)}" text-anchor="middle">${fmtNum(items.length)}</text>
      ${nameLabel(x, y, name)}
    </g>`;
  }).join("");
  const animate = !state.mapAnimated;
  state.mapAnimated = true;
  return `<svg class="map ${animate ? "animate" : ""}" viewBox="0 0 ${W} ${H}" role="group" aria-label="${esc(t("mapTitle"))}">
    <defs>
      ${mapMarkers()}
    </defs>
    <ellipse class="hub" cx="${cx}" cy="${cy}" rx="${rx - 92}" ry="${ry - 70}"/>
    <text class="hubText" x="${cx}" y="${cy + 4}" text-anchor="middle">${esc(t("loop"))}</text>
    ${edges}${nodes}
  </svg>`;
}

function evidenceView(a) {
  const ev = a.evidence?.items || [];
  const as = a.assumptions?.items || [];
  const bio = isBio(a);
  const selectedId = state.selection?.type === "record" ? state.selection.id : null;
  return `${head(t("evTitle"), t("evHint"))}
    <div class="panelBox"><div class="tableWrap"><table class="table">
      <thead><tr><th class="label">ID</th><th class="label">${esc(t("claim"))}</th><th class="label">${esc(t(bio ? "epistemic" : "basis"))}</th><th class="label">${esc(t(bio ? "tier" : "strength"))}</th><th class="label">${esc(t("conf"))}</th><th class="label">${esc(t("source"))}</th></tr></thead>
      <tbody>${ev.map((e) => `<tr class="row" tabindex="0" data-action="selectRecord" data-value="${esc(e.id)}" aria-selected="${selectedId === e.id}">
        <td class="mono">${esc(e.id)}</td>
        <td ${contentLang(a)}>${esc(e.claim)}</td>
        <td><span class="chip">${esc(bio ? token(e.epistemic_type) : humanize(e.basis))}</span></td>
        <td>${bio ? `<span class="chip">${esc(token(e.source_tier))}</span>` : `<span class="meter" role="img" aria-label="${esc(`${t("strength")} ${e.evidence_strength ?? 0}/5`)}">${Array.from({ length: 5 }, (_, i) => `<i class="${i < (e.evidence_strength || 0) ? "on" : ""}"></i>`).join("")}</span>`}</td>
        <td>${confChip(e.confidence)}</td>
        <td>${/^https?:\/\//.test(e.source_url || "") ? `<span class="status ok">${esc(e.source_title || e.source_url)}</span>` : `<span class="status crit">${esc(t("noSource"))}</span>`}</td>
      </tr>`).join("")}</tbody>
    </table></div></div>
    <div class="panelBox"><span class="label">${esc(t("asTitle"))}</span>
      <div class="cards">${as.map((x) => `<button type="button" class="recCard" data-action="selectRecord" data-value="${esc(x.id)}" aria-pressed="${selectedId === x.id}">
        <div class="recHead"><span class="mono help">${esc(x.id)}</span><span class="chip ${x.risk === "high" ? "low" : x.risk === "low" ? "high" : "medium"}">${esc(t("risk"))}: ${esc(x.risk)}</span></div>
        <h3 ${contentLang(a)}>${esc(x.assumption)}</h3>
        <dl class="kv"><dt>${esc(t("disprovenBy"))}</dt><dd ${contentLang(a)}>${esc(x.disproving_test)}</dd><dt>${esc(t("ifWrong"))}</dt><dd ${contentLang(a)}>${esc(x.implication_if_wrong)}</dd></dl>
      </button>`).join("")}</div>
    </div>`;
}
function tensionsView(a) {
  const items = a.contradictions?.items || [];
  const selectedId = state.selection?.type === "record" ? state.selection.id : null;
  return `${head(t("tTitle"), t("tHint"))}
    <div class="cards">${items.map((c) => `<button type="button" class="recCard" data-action="selectRecord" data-value="${esc(c.id)}" aria-pressed="${selectedId === c.id}">
      <div class="recHead"><span class="mono help">${esc(c.id)} · ${esc(humanize(c.contradiction_type))}</span>
        <span class="meter" role="img" aria-label="${esc(`${t("severity")} ${c.severity}/5`)}">${Array.from({ length: 5 }, (_, i) => `<i class="${i < c.severity ? "on" : ""}"></i>`).join("")}</span></div>
      <div class="vs">
        <div><span class="label">${esc(t("says"))}</span><p ${contentLang(a)}>${esc(c.rhetoric)}</p></div>
        <div><span class="label">${esc(t("does"))}</span><ul ${contentLang(a)}>${(c.actions || []).map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>
      </div>
      <dl class="kv"><dt>${esc(t("reading"))}</dt><dd ${contentLang(a)}>${esc(c.interpretation)}</dd>
        <dt>${esc(t("affects"))}</dt><dd>${(c.affected_layers || []).map((k) => `<span class="chip">${esc(sectionName(k))}</span>`).join(" ")}</dd></dl>
    </button>`).join("")}</div>`;
}
function futuresView(a) {
  const items = a.scenarios?.items || [];
  const selectedId = state.selection?.type === "record" ? state.selection.id : null;
  return `${head(t("fTitle"), t("fHint"))}
    <div class="cards">${items.map((s) => `<button type="button" class="recCard" data-action="selectRecord" data-value="${esc(s.id)}" aria-pressed="${selectedId === s.id}">
      <div class="recHead"><span class="mono help">${esc(s.id)} · ${esc(s.timeframe)}</span></div>
      <h3 ${contentLang(a)}>${esc(s.name)}</h3>
      <div class="prob"><span class="label">${esc(t("probability"))} <span class="mono">${fmtNum(s.probability)}%</span></span>
        <div class="probBar" role="img" aria-label="${esc(`${t("probability")} ${s.probability}%`)}"><i style="width:${Math.max(0, Math.min(100, s.probability))}%"></i></div>
        <div class="probScale" aria-hidden="true"><span>0</span><span>50</span><span>100</span></div></div>
      <dl class="kv">
        <dt>${esc(t("drivers"))}</dt><dd ${contentLang(a)}>${esc((s.drivers || []).join(" · "))}</dd>
        <dt>${esc(t("signals"))}</dt><dd ${contentLang(a)}>${esc((s.early_signals || []).join(" · "))}</dd>
        <dt>${esc(t("disprovenIf"))}</dt><dd ${contentLang(a)}>${esc((s.disproven_if || []).join(" · "))}</dd>
      </dl>
    </button>`).join("")}</div>`;
}
// The spoken state follows the tone: only a "crit" row blocks publication.
const row = (ok, text, note = "", tone = ok ? "ok" : "crit") => `<li><span class="status ${tone}" aria-hidden="true"></span><span>${esc(text)}${tone === "idle" ? "" : `<span class="srOnly"> — ${esc(t({ ok: "readyShort", warn: "attention", crit: "blocked" }[tone]))}</span>`}${note ? `<small>${esc(note)}</small>` : ""}</span></li>`;
const exportsPanel = () => `<div class="panelBox"><span class="label">${esc(t("exports"))}</span>
        <div style="display:grid;gap:var(--s-3)">
          <button type="button" class="btn primary" data-action="copyJson">${icon("copy")}${esc(t("copyJson"))}</button>
          <button type="button" class="btn" disabled title="${esc(t("inApp"))}">${esc(t("htmlReport"))}</button>
          <p class="help">${esc(t("inApp"))}</p>
        </div>
      </div>`;
function publishView(a, m) {
  if (m.bio) return bioPublishView(a, m);
  return `${head(t("pTitle"), t("pHint"))}
    <div class="split2">
      <div class="panelBox"><span class="label">${esc(t("checklist"))}</span>
        <ul class="checklist">
          ${row(m.checks.layers, t("ck.layers"))}
          ${row(m.checks.contradictions, t("ck.contradictions"), "", m.checks.contradictions ? "ok" : "warn")}
          ${row(m.checks.scenarios, t("ck.scenarios"), "", m.checks.scenarios ? "ok" : "warn")}
          ${row(m.checks.sources, t("ck.sources"), a.quality_gate?.next_improvement || "")}
          ${reviewRow(m)}
        </ul>
        <p class="help">${esc(t("gateStandIn"))}</p>
      </div>
      ${exportsPanel()}
    </div>
    ${ledgerPanel(m)}`;
}
function setupView(a) {
  const d = state.draft;
  return `${head(t("suTitle"), t("suHint"))}
    <div class="split2">
      <div class="panelBox"><dl class="kv">
        <dt>${esc(t("topic"))}</dt><dd ${contentLang(a)}>${esc(a.subject?.title)}</dd>
        <dt>${esc(t("context"))}</dt><dd ${contentLang(a)}>${esc(a.subject?.context)}</dd>
        <dt>${esc(t("lens"))}</dt><dd>${esc(t(isBio(a) ? "lensBio" : "lensStrategic"))}</dd>
        <dt>${esc(t("depthShort"))}</dt><dd>${esc(lookup(`depth.${a.model_mode}`)?.[0] ?? humanize(a.model_mode))}</dd>
        <dt>${esc(t("sourcesShort"))}</dt><dd>${esc(t(`sources.${d.sources}`)[0])}</dd>
        <dt>${esc(t("analysisLang"))}</dt><dd>${esc(I18N[a.language]?.langName || a.language)}</dd>
        <dt>${esc(t("generated"))}</dt><dd class="mono">${esc(a.generated_at)}</dd>
        <dt>ID</dt><dd class="mono">${esc(a.analysis_id)} · v${esc(a.schema_version)}</dd>
      </dl></div>
      <div class="panelBox" style="display:grid;gap:var(--s-3);align-content:start">
        ${mascot("idle", t("m1"))}
        <button type="button" class="btn" data-action="toGuided">${icon("guide")}${esc(t("runGuided"))}</button>
        <button type="button" class="btn" data-action="paste">${icon("upload")}${esc(t("pasteNew"))}</button>
      </div>
    </div>`;
}

/* ---------- Biopolitical workspace ---------- */
const selectedRecordId = () => (state.selection?.type === "record" ? state.selection.id : null);
function pillarsView(a, m) {
  return `${head(t("pmTitle"), t("pmHint"))}
    <div class="panelBox mapWrap">${pillarMap(a)}
      <div class="mapLegend">
        <span><i></i>${esc(t("legendOrder"))}</span>
        <span><i class="authored"></i>${esc(t("legendAuthored"))}</span>
        <span><i class="ring"></i>${esc(t("legendRing"))}</span>
      </div>
    </div>
    <div class="readout">
      ${tile(m.checks.pillars ? "ok" : "warn", t("rPillars"), `${fmtNum(m.populated)}<small>/${fmtNum(m.total)}</small>`)}
      ${tile(m.links ? "ok" : "warn", t("rLinks"), fmtNum(m.links))}
      ${tile(m.sourced ? "ok" : "crit", t("rSources"), `${fmtNum(m.sourced)}<small>/${fmtNum(m.evidence)}</small>`)}
      ${tile(m.blocked ? "crit" : "ok", t("rGate"), `<span class="status ${m.blocked ? "crit" : "ok"}">${esc(m.blocked ? t("blocked") : t("readyShort"))}</span>`)}
    </div>
    <div class="split2">${captureLadder(a)}${linkList(a)}</div>`;
}
const wrapWords = (text, max) => String(text).split(/\s+/).reduce((lines, word) => {
  const last = lines.length - 1;
  if (last >= 0 && `${lines[last]} ${word}`.length <= max) lines[last] += ` ${word}`; else lines.push(word);
  return lines;
}, []);
function pillarMap(a) {
  const W = 760, H = 560, cx = W / 2, cy = 268, rx = 276, ry = 196, R = 38;
  const rtl = I18N[state.lang].dir === "rtl";
  const pos = Object.fromEntries(BIO_PILLARS.map((key, i) => {
    const angle = (-90 + (i * 360) / BIO_PILLARS.length) * Math.PI / 180;
    return [key, [cx + Math.cos(angle) * rx * (rtl ? -1 : 1), cy + Math.sin(angle) * ry]];
  }));
  const records = bioRecords(a);
  const pillarOf = (id) => records.find((r) => r.id === id)?.pillar;
  // Reading order, from the question round to agency; authored links are drawn over it.
  let edges = BIO_PILLARS.slice(1).map((key, i) => mapEdge(pos[BIO_PILLARS[i]], pos[key], { R, bend: -14, rtl, arrow: false })).join("");
  const authored = new Map();
  for (const link of a.links || []) {
    const from = pillarOf(link.from), to = pillarOf(link.to);
    if (!from || !to || from === to) continue;
    authored.set(`${from}>${to}`, [...(authored.get(`${from}>${to}`) || []), token(link.relation)]);
  }
  for (const [pair, relations] of authored) {
    const [from, to] = pair.split(">");
    edges += mapEdge(pos[from], pos[to], { R, bend: 36, rtl, cls: "authored", label: [...new Set(relations)].join(", ") });
  }
  const selected = state.selection?.type === "pillar" ? state.selection.key : state.selection?.type === "record" ? pillarOf(state.selection.id) : null;
  const nodes = BIO_PILLARS.map((key, i) => {
    const [x, y] = pos[key];
    const X = x.toFixed(1), Y = y.toFixed(1);
    const items = records.filter((r) => r.pillar === key);
    const rated = items.filter((r) => r.data.confidence);
    const share = rated.length ? rated.filter((r) => r.data.confidence === "high").length / rated.length : 0;
    const C = 2 * Math.PI * (R + 5);
    const name = pillarName(key);
    return `<g class="node ${items.length ? "" : "empty"} ${selected === key ? "selected" : ""}" style="--i:${i}" role="button" tabindex="0" aria-label="${esc(`${name}: ${t("items", { n: fmtNum(items.length) })}`)}" aria-pressed="${selected === key}" data-action="selectPillar" data-value="${key}">
      <circle class="ring-bg" cx="${X}" cy="${Y}" r="${R + 5}"/>
      <circle class="ring" cx="${X}" cy="${Y}" r="${R + 5}" stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${(C * (1 - share)).toFixed(1)}" transform="rotate(-90 ${X} ${Y})"/>
      <circle class="disc" cx="${X}" cy="${Y}" r="${R}"/>
      <text class="idx" x="${X}" y="${(y - 13).toFixed(1)}" text-anchor="middle">${String(i + 1).padStart(2, "0")}</text>
      <text class="count" x="${X}" y="${(y + 13).toFixed(1)}" text-anchor="middle">${fmtNum(items.length)}</text>
      <text class="name" x="${X}" y="${(y + R + 22).toFixed(1)}" text-anchor="middle">${wrapWords(name, 18).map((line, j) => `<tspan x="${X}" dy="${j ? 16 : 0}">${esc(line)}</tspan>`).join("")}</text>
    </g>`;
  }).join("");
  const animate = !state.mapAnimated;
  state.mapAnimated = true;
  return `<svg class="map bio ${animate ? "animate" : ""}" viewBox="0 0 ${W} ${H}" role="group" aria-label="${esc(t("pmTitle"))}">
    <defs>${mapMarkers()}</defs>
    <ellipse class="hub" cx="${cx}" cy="${cy}" rx="${rx - 110}" ry="${ry - 84}"/>
    <text class="hubText" x="${cx}" y="${cy + 4}" text-anchor="middle">${esc(t("bioHub"))}</text>
    ${edges}${nodes}
  </svg>`;
}
// Capture found at a level is flagged for attention; an unassessed level is a gap.
const CAPTURE_TONE = { present: "warn", absent: "ok", not_assessed: "crit" };
function captureLadder(a) {
  const selectedId = selectedRecordId();
  return `<div class="panelBox"><span class="label">${esc(t("ladderTitle"))}</span>
    <p class="help">${esc(t("ladderHint"))}</p>
    <ol class="ladder">${(a.capture_levels || []).map((level, i) => {
      const id = level.id || `capture_levels/${i}`;
      return `<li style="--i:${i}"><button type="button" class="recCard rung" data-action="selectRecord" data-value="${esc(id)}" aria-pressed="${selectedId === id}">
        <span class="recHead"><b><span class="mono help">${fmtNum(i + 1)}</span> ${esc(token(level.level))}</b>${statusTag(CAPTURE_TONE[level.status] || "idle", token(level.status))}</span>
        <span class="help" ${contentLang(a)}>${esc(level.finding)}</span>
      </button></li>`;
    }).join("") || `<li class="help">${esc(t("noneYet"))}</li>`}</ol>
  </div>`;
}
function linkList(a) {
  const records = bioRecords(a);
  const title = (id) => records.find((r) => r.id === id)?.title || id;
  const arrow = a.language === "ar" ? "←" : "→";
  const links = a.links || [];
  return `<div class="panelBox"><span class="label">${esc(t("rLinks"))} · ${fmtNum(links.length)}</span>
    <div class="linkList">${links.map((link) => `<button type="button" class="itemBtn" data-action="selectRecord" data-value="${esc(link.from)}">
      <small>${esc(link.from)} · ${esc(token(link.relation))} · ${esc(link.to)}</small>
      <span ${contentLang(a)}>${esc(title(link.from))} ${arrow} ${esc(title(link.to))}</span></button>`).join("") || `<p class="help">${esc(t("noneYet"))}</p>`}</div>
  </div>`;
}
const evidenceIds = (ids) => ((ids || []).length ? ids.map((id) => `<span class="chip mono">${esc(id)}</span>`).join(" ") : "—");
function explanationsView(a, m) {
  const selectedId = selectedRecordId();
  const tensions = a.intervention_assessment?.care_control_tensions || [];
  return `${head(t("xTitle"), t("xHint"), `<span class="status ${m.checks.explanations ? "ok" : "warn"}">${esc(t("rExplained"))} ${fmtNum(m.assessed)}/${fmtNum(m.explanations)}</span>`)}
    <div class="cards">${(a.competing_explanations || []).map((x) => `<button type="button" class="recCard" data-action="selectRecord" data-value="${esc(x.id)}" aria-pressed="${selectedId === x.id}">
      <div class="recHead"><span class="mono help">${esc(x.id)} · ${esc(token(x.type))}</span>${confChip(x.confidence)}</div>
      <h3 ${contentLang(a)}>${esc(x.claim)}</h3>
      <div class="tags"><span class="chip">${esc(t("relevance"))}: ${esc(token(x.relevance))}</span>${statusTag(x.evidentiary_status === "not_assessed" ? "warn" : "idle", token(x.evidentiary_status))}</div>
      <dl class="kv">
        <dt>${esc(t("mechanism"))}</dt><dd ${contentLang(a)}>${esc(x.mechanism)}</dd>
        <dt>${esc(t("falsifiedIf"))}</dt><dd ${contentLang(a)}>${esc(joined(x.falsified_if))}</dd>
        <dt>${esc(t("supports"))}</dt><dd>${evidenceIds(x.supporting_evidence_ids)}</dd>
        <dt>${esc(t("counters"))}</dt><dd>${evidenceIds(x.counter_evidence_ids)}</dd>
      </dl>
    </button>`).join("")}</div>
    ${tensions.length ? `<div class="panelBox"><span class="label">${esc(t("ccTitle"))}</span>
      <div class="cards">${tensions.map((c) => `<button type="button" class="recCard" data-action="selectRecord" data-value="${esc(c.id)}" aria-pressed="${selectedId === c.id}">
        <div class="recHead"><span class="mono help">${esc(c.id)}</span>${typeof c.severity === "number" ? `<span class="meter" role="img" aria-label="${esc(`${t("severity")} ${c.severity}/5`)}">${Array.from({ length: 5 }, (_, i) => `<i class="${i < c.severity ? "on" : ""}"></i>`).join("")}</span>` : ""}</div>
        <div class="vs">
          <div><span class="label">${esc(t("careClaim"))}</span><p ${contentLang(a)}>${esc(c.care_claim)}</p></div>
          <div><span class="label">${esc(t("controlEffects"))}</span><p ${contentLang(a)}>${esc(joined(c.control_effects))}</p></div>
        </div>
        <dl class="kv"><dt>${esc(t("reading"))}</dt><dd ${contentLang(a)}>${esc(c.interpretation)}</dd></dl>
      </button>`).join("")}</div></div>` : ""}`;
}
const CONSENT_TONE = { yes: "ok", partial: "warn", no: "crit" };
function agencyView(a) {
  const selectedId = selectedRecordId();
  const ce = a.consent_exit || {};
  const none = `<p class="help">${esc(t("noneYet"))}</p>`;
  const list = (items) => ((items || []).length ? `<ul ${contentLang(a)}>${items.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : none);
  const card = (x, title, rows, tag = "") => `<button type="button" class="recCard" data-action="selectRecord" data-value="${esc(x.id)}" aria-pressed="${selectedId === x.id}">
      <div class="recHead"><span class="mono help">${esc(x.id)}${tag ? ` · ${esc(tag)}` : ""}</span>${confChip(x.confidence)}</div>
      <h3 ${contentLang(a)}>${esc(title)}</h3>
      <dl class="kv">${rows.filter(([, value]) => value && value.length).map(([key, value]) => `<dt>${esc(t(key))}</dt><dd ${contentLang(a)}>${esc(joined(value))}</dd>`).join("")}</dl>
    </button>`;
  return `${head(t("agTitle"), t("agHint"))}
    <div class="panelBox"><span class="label">${esc(t("ceTitle"))}</span>
      <dl class="consent">${Object.keys(I18N.en.ce).map((key) => `<div><dt>${esc(t(`ce.${key}`))}</dt><dd>${statusTag(CONSENT_TONE[ce[key]] || "idle", token(ce[key]) || "—")}</dd></div>`).join("")}</dl>
      <div class="split3">
        <div><span class="label">${esc(t("exitConditions"))}</span>${list(ce.exit_conditions)}</div>
        <div><span class="label">${esc(t("contestability"))}</span>${list(ce.contestability)}</div>
        <div><span class="label">${esc(t("accountability"))}</span>${list(ce.accountability)}</div>
      </div>
    </div>
    <div class="panelBox"><span class="label">${esc(t("resTitle"))}</span>
      <div class="cards">${(a.resistance_agency?.items || []).map((x) => card(x, x.actor_or_population, [["form", token(x.form)], ["mechanism", x.mechanism], ["effect", x.effect_on_system], ["constraints", x.constraints]])).join("") || none}</div></div>
    <div class="panelBox"><span class="label">${esc(t("altTitle"))}</span>
      <div class="cards">${(a.alternatives?.items || []).map((x) => card(x, x.proposal, [["mechanism", x.mechanism], ["feasibility", token(x.feasibility)], ["tradeoffs", x.tradeoffs], ["safeguards", x.rights_safeguards]], token(x.level))).join("") || none}</div></div>`;
}
const AUDIT_TONE = { pass: "ok", not_applicable: "idle" };
const CONCLUSION_GROUPS = [["strongly_supported", "stronglySupported"], ["plausible_unconfirmed", "plausible"], ["disputed", "disputed"], ["unknown", "unknown"], ["evidence_that_would_change", "changeEvidence"]];
function bioPublishView(a, m) {
  const cc = a.calibrated_conclusion || {};
  return `${head(t("pTitle"), t("pHint"))}
    <div class="split2">
      <div class="panelBox"><span class="label">${esc(t("checklist"))}</span>
        <ul class="checklist">
          ${row(m.checks.pillars, t("ckBio.pillars"))}
          ${row(m.checks.sources, t("ck.sources"), t("sourcedText", { n: fmtNum(m.sourced), total: fmtNum(m.evidence) }))}
          ${row(m.checks.explanations, t("ckBio.explanations"), "", m.checks.explanations ? "ok" : "warn")}
          ${row(m.checks.audit, t("ckBio.audit"), m.concerns.map(auditName).join(" · "))}
          ${reviewRow(m)}
        </ul>
        ${m.gate ? gateBox(m.gate) : `<p class="help">${esc(t("gateStandIn"))}</p>`}
      </div>
      ${exportsPanel()}
    </div>
    <div class="split2">
      <div class="panelBox"><span class="label">${esc(bioLabel("ui", "conclusion"))}</span>
        ${CONCLUSION_GROUPS.filter(([field]) => (cc[field] || []).length).map(([field, label]) => `<div class="inspSection"><span class="label">${esc(bioLabel("ui", label))}</span><ul class="plain" ${contentLang(a)}>${cc[field].map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>`).join("")}
        ${cc.overall_confidence ? `<p>${esc(t("overall"))} ${confChip(cc.overall_confidence)}</p>` : ""}
      </div>
      <div class="panelBox"><span class="label">${esc(bioLabel("ui", "selfAudit"))}</span>
        <ul class="auditList">${Object.entries(a.self_audit || {}).map(([key, value]) => `<li><span>${esc(auditName(key))}</span>${statusTag(AUDIT_TONE[value] || "warn", token(value))}</li>`).join("")}</ul>
      </div>
    </div>
    ${ledgerPanel(m)}`;
}

/* ---------- Inspector ---------- */
function inspector(a, m) {
  const sel = state.selection;
  let body = "";
  if (!sel) {
    const s = a.subject || {};
    body = `<h2>${esc(t("caseBrief"))}</h2>
      <dl class="kv">
        <dt>${esc(t("question"))}</dt><dd ${contentLang(a)}>${esc(s.question || s.research_question)}</dd>
        <dt>${esc(t("thesis"))}</dt><dd ${contentLang(a)}>${esc(s.executive_thesis || s.executive_finding)}</dd>
        <dt>${esc(t("context"))}</dt><dd ${contentLang(a)}>${esc(s.context)}</dd>
        ${a.quality_gate ? `<dt>${esc(t("weakest"))}</dt><dd>${esc(sectionName(a.quality_gate.weakest_layer))}</dd>
        <dt>${esc(t("nextImprovement"))}</dt><dd ${contentLang(a)}>${esc(a.quality_gate.next_improvement)}</dd>` : ""}
        ${a.calibrated_conclusion?.overall_confidence ? `<dt>${esc(t("overall"))}</dt><dd>${confChip(a.calibrated_conclusion.overall_confidence)}</dd>` : ""}
      </dl>
      <p class="note">${esc(t("selectHint"))}</p>`;
  } else if (sel.type === "pillar") {
    const [name, desc] = bioLabel("pillars", sel.key) || [humanize(sel.key), ""];
    const records = bioRecords(a).filter((r) => r.pillar === sel.key);
    const groups = PILLAR_LISTS[sel.key].map((list) => [list, records.filter((r) => r.list === list)]).filter(([, recs]) => recs.length);
    body = `<div class="idLine"><span>${esc(t("kinds.pillar"))}</span><span class="mono">${esc(t("items", { n: fmtNum(records.length) }))}</span></div>
      <h2>${esc(name)}</h2><p class="help">${esc(desc)}</p>
      ${groups.map(([list, recs]) => `<div class="inspSection"><button type="button" class="pathBtn" data-action="copyPath" data-value="/${esc(list)}">/${esc(list)}</button>
        ${recs.map((r) => `<button type="button" class="itemBtn" data-action="selectRecord" data-value="${esc(r.id)}"><small>${esc(r.data.id || r.path)}</small><span ${contentLang(a)}>${esc(r.title)}</span></button>`).join("")}</div>`).join("") || `<p class="help">${esc(t("noneYet"))}</p>`}`;
  } else if (sel.type === "layer") {
    const items = a[sel.key] || [];
    const [name, desc] = t(`layers.${sel.key}`);
    body = `<div class="idLine"><span>${esc(t("kinds.layer"))}</span><button type="button" class="pathBtn" data-action="copyPath" data-value="/${esc(sel.key)}">/${esc(sel.key)}</button></div>
      <h2>${esc(name)}</h2><p class="help">${esc(desc)}</p>
      <div class="inspSection"><span class="label">${esc(t("items", { n: fmtNum(items.length) }))}</span>
        ${items.length ? items.map((it) => `<button type="button" class="itemBtn" data-action="selectRecord" data-value="${esc(it.id)}"><small>${esc(it.id)}</small><span ${contentLang(a)}>${esc(it.name || it.description)}</span></button>`).join("") : `<p class="help">${esc(t("noItems"))}</p>`}
      </div>`;
  } else {
    const rec = recordsOf(a).find((r) => r.id === sel.id);
    if (rec) {
      body = `<div class="idLine"><span>${esc(rec.pillar ? pillarName(rec.pillar) : t(`kinds.${rec.kind}`))}${rec.layer ? ` · ${esc(t(`layers.${rec.layer}`)[0])}` : ""}</span>${rec.data.id ? `<span class="mono">${esc(rec.data.id)}</span>` : ""}
          <button type="button" class="pathBtn" data-action="copyPath" data-value="${esc(rec.path)}" aria-label="${esc(`${t("copyPath")} ${rec.path}`)}">${esc(rec.path)}</button></div>
        <h2 ${contentLang(a)}>${esc(rec.title)}</h2>
        ${recordBody(a, rec)}`;
    }
  }
  return `<div class="inspHead"><span class="label">${esc(t("inspector"))}</span>
      <button type="button" class="btn ghost icon-only inspToggle" data-action="inspector" aria-label="${esc(t("closeInspector"))}">${icon("close")}</button></div>
    <div class="inspBody inspEnter" aria-live="polite">${body}</div>`;
}

// A record's editable confidence, rationale, schema fields and links (inspector and case file).
function recordBody(a, rec) {
  const data = rec.data;
  const skip = new Set(["id", "name", "rationale", "confidence", "claim", "rhetoric", "assumption", "description"]);
  const fields = Object.entries(data).filter(([k, v]) => !skip.has(k) && v !== "" && v != null);
  const out = (a.links || []).filter((l) => l.from === rec.id);
  const inn = (a.links || []).filter((l) => l.to === rec.id);
  const linkBtn = (id, relation) => { const r = recordsOf(a).find((x) => x.id === id); return `<button type="button" class="itemBtn" data-action="selectRecord" data-value="${esc(id)}"><small>${esc(relation)} · ${esc(id)}</small><span ${contentLang(a)}>${esc(r?.title || id)}</span></button>`; };
  return `${data.confidence ? confEdit(rec) : ""}
        ${data.rationale ? `<div class="inspSection"><span class="label">${esc(t("rationale"))}</span><p ${contentLang(a)}>${esc(data.rationale)}</p></div>` : ""}
        <div class="inspSection"><span class="label">${esc(t("schemaFields"))}</span>
          <dl class="kv">${fields.map(([k, v]) => `<dt class="mono">${esc(k)}</dt><dd ${contentLang(a)}>${esc(Array.isArray(v) ? v.map((x) => (typeof x === "object" ? JSON.stringify(x) : x)).join(" · ") : typeof v === "object" ? JSON.stringify(v) : v)}</dd>`).join("")}</dl></div>
        ${out.length ? `<div class="inspSection"><span class="label">${esc(t("linksOut"))}</span>${out.map((l) => linkBtn(l.to, l.relation)).join("")}</div>` : ""}
        ${inn.length ? `<div class="inspSection"><span class="label">${esc(t("linksIn"))}</span>${inn.map((l) => linkBtn(l.from, l.relation)).join("")}</div>` : ""}`;
}

/* ---------- Command palette ---------- */
function paletteItems() {
  const q = (state.palette?.query || "").trim().toLocaleLowerCase();
  const commands = [
    ...phasesOf(state.analysis).map((key, i) => ({ group: "c", icon: key, label: t("goTo", { x: t(`phases.${key}`)[0] }), hint: String(i + 1), run: () => setPhase(key), needs: true, phase: true })),
    { group: "c", icon: resolvedTheme() === "dark" ? "sun" : "moon", label: resolvedTheme() === "dark" ? t("themeToLight") : t("themeToDark"), keywords: t("cmdTheme"), run: toggleTheme },
    { group: "c", icon: "panel", label: t("cb.switchTo", { x: t(`cb.concept.${state.concept === "b" ? "a" : "b"}`) }), run: () => setConcept(state.concept === "b" ? "a" : "b") },
    { group: "c", icon: "rows", label: t("cmdDensity"), run: () => setDensity(state.density === "compact" ? "comfortable" : "compact") },
    { group: "c", icon: "guide", label: t("cmdGuided"), run: () => setMode("guided") },
    { group: "c", icon: "upload", label: t("cmdPaste"), run: () => openSheet(null) },
    { group: "c", icon: "upload", label: t("cmdSample"), run: () => loadSample("strategic") },
    { group: "c", icon: "upload", label: t("cmdBioSample"), run: () => loadSample("biopolitical") },
    ...LANGS.filter((code) => code !== state.lang).map((code) => ({ group: "c", icon: "record", label: t("cmdLang", { x: I18N[code].langName }), run: () => setLang(code) })),
  ].filter((c) => (!c.needs || state.analysis) && !(c.phase && caseMode()));
  const locked = state.life && lifeOf().locked;
  const sims = [
    { label: t("sim.edit"), needs: true, open: true, run: () => { const rec = simEdit(); if (rec) { selectRecord(rec.id, true); toast(t("sim.edited")); } else render(); } },
    { label: t("sim.reload"), needs: true, open: true, run: simReload },
    { label: t("sim.conflict"), needs: true, run: () => { state.life.conflict = true; render({ focus: "#main" }); announce(t("life.conflict")); } },
    { label: t("sim.damaged"), run: () => { state.damaged = true; render({ focus: "#main" }); announce(t("life.damagedBanner")); } },
    { label: t(state.offline ? "sim.online" : "sim.offline"), run: () => { state.offline = !state.offline; render({ focus: "#main" }); if (state.offline) announce(t("life.offline")); } },
  ].filter((c) => (!c.needs || state.analysis) && !(c.open && locked)).map((c) => ({ ...c, group: "s", icon: "record" }));
  const records = recordsOf(state.analysis).map((r) => ({ group: "r", icon: r.kind === "layer" ? "map" : r.kind === "evidence" ? "evidence" : r.kind === "scenario" ? "futures" : r.kind === "contradiction" ? "tensions" : "record", label: r.title, hint: r.data.id || r.path, keywords: `${t(`kinds.${r.kind}`)} ${r.layer ? t(`layers.${r.layer}`)[0] : r.pillar ? pillarName(r.pillar) : ""} ${r.id}`, run: () => selectRecord(r.id, true) }));
  const match = (item) => !q || `${item.label} ${item.hint || ""} ${item.keywords || ""}`.toLocaleLowerCase().includes(q);
  return [...commands.filter(match), ...sims.filter(match), ...records.filter(match)].slice(0, 40);
}
function paletteList() {
  const items = paletteItems();
  const index = Math.min(state.palette.index, Math.max(items.length - 1, 0));
  state.palette.index = index;
  let lastGroup = "";
  const options = items.map((item, i) => {
    const header = item.group !== lastGroup ? `<li class="grp label" role="presentation">${esc(t({ c: "grpCommands", s: "grpSimulate", r: "grpRecords" }[item.group]))}</li>` : "";
    lastGroup = item.group;
    return `${header}<li role="option" id="pal-${i}" aria-selected="${i === index}" data-action="palPick" data-value="${i}">${icon(item.icon)}<span ${item.group === "r" ? contentLang(state.analysis) : ""}>${esc(item.label)}</span>${item.hint ? `<small>${esc(item.hint)}</small>` : ""}</li>`;
  }).join("");
  return { options, active: items.length ? `pal-${index}` : "", empty: !items.length };
}
function renderPalette() {
  if (!state.palette) return "";
  const list = paletteList();
  return `<div class="scrim" data-action="closeOverlay">
    <div class="palette" role="dialog" aria-modal="true" aria-label="${esc(t("palTitle"))}">
      <input id="palInput" type="text" role="combobox" aria-expanded="${!list.empty}" aria-controls="palList" aria-autocomplete="list" ${list.active ? `aria-activedescendant="${list.active}"` : ""} placeholder="${esc(t("palPlaceholder"))}" value="${esc(state.palette.query)}" autocomplete="off" spellcheck="false">
      <ul class="palList" id="palList" role="listbox" aria-label="${esc(t("palTitle"))}" ${list.empty ? "hidden" : ""}>${list.options}</ul>
      <p class="palEmpty help" role="status" ${list.empty ? "" : "hidden"}>${esc(t("palEmpty"))}</p>
      <div class="palFoot">${esc(t("palFoot"))}</div>
    </div>
  </div>`;
}
function refreshPalette() {
  const list = paletteList();
  const input = $("#palInput"), ul = $("#palList"), empty = $(".palEmpty");
  ul.innerHTML = list.options;
  ul.hidden = list.empty;
  empty.hidden = !list.empty;
  input.setAttribute("aria-expanded", String(!list.empty));
  if (list.active) input.setAttribute("aria-activedescendant", list.active); else input.removeAttribute("aria-activedescendant");
  $("#palList [aria-selected='true']")?.scrollIntoView({ block: "nearest" });
}
function renderSheet() {
  if (!state.sheet) return "";
  const view = checkView(state.check);
  const ok = state.check.status === "valid" || state.check.status === "partial";
  return `<div class="scrim" data-action="closeOverlay">
    <div class="sheet" role="dialog" aria-modal="true" aria-labelledby="sheetTitle">
      <div class="sheetHead"><h2 id="sheetTitle">${esc(t("pasteNew"))}</h2><button type="button" class="btn ghost icon-only" data-action="closeSheet" aria-label="${esc(t("close"))}">${icon("close")}</button></div>
      <div class="field dropZone" data-drop><label for="answer">${esc(t("answerLabel"))}</label>
        <textarea id="answer" data-bind="answer" spellcheck="false" dir="auto" placeholder="${esc(t("answerPlaceholder"))}" aria-describedby="checkLine">${esc(state.answer)}</textarea></div>
      ${validationLine(view)}
      <div class="stepActions"><button type="button" class="btn ghost" data-action="useSample">${esc(t("useSample"))}</button>
        <div class="end"><button type="button" class="btn primary" data-action="openAnswer" id="nextBtn" ${ok ? "" : "disabled"}>${esc(t("openAnalysis"))}</button></div></div>
    </div>
  </div>`;
}

/* ---------- Render ---------- */
function render({ focus } = {}) {
  applyRootAttributes();
  const active = document.activeElement;
  const activeId = active?.id;
  const activeKey = active?.dataset?.action ? `${active.dataset.action}|${active.dataset.value || ""}` : "";
  app.innerHTML = `${state.mode === "pro" ? renderPro() : renderWizard()}${renderPalette()}${renderSheet()}${renderPanel()}<div id="live" class="srOnly" aria-live="polite"></div>`;
  postRender();
  if (focus) { $(focus)?.focus({ preventScroll: false }); return; }
  if (state.palette) { $("#palInput")?.focus(); return; }
  if (activeId && $(`#${CSS.escape(activeId)}`)) $(`#${CSS.escape(activeId)}`).focus({ preventScroll: true });
  else if (activeKey) {
    const [action, value] = activeKey.split("|");
    app.querySelector(`[data-action="${CSS.escape(action)}"]${value ? `[data-value="${CSS.escape(value)}"]` : ""}`)?.focus({ preventScroll: true });
  }
}
function postRender() {
  if (state.scrollTo) { document.getElementById(state.scrollTo)?.scrollIntoView({ block: "center" }); state.scrollTo = null; }
  for (const path of app.querySelectorAll(".map.animate .edge")) path.style.setProperty("--len", path.getTotalLength().toFixed(0));
  $("#palList [aria-selected='true']")?.scrollIntoView({ block: "nearest" });
}

/* ---------- Actions ---------- */
function setLang(code) { state.lang = code; prefs.set("lang", code); render(); announce(I18N[code].langName); }
function toggleTheme() { state.theme = resolvedTheme() === "dark" ? "light" : "dark"; prefs.set("theme", state.theme); render(); }
function setConcept(value) { state.concept = value; prefs.set("concept", value); state.selection = null; render({ focus: "#main" }); }
function setDensity(value) { state.density = value; prefs.set("density", value); render(); }
function setMode(mode) {
  state.mode = mode; prefs.set("mode", mode);
  state.palette = null; state.sheet = null;
  if (mode === "guided") { state.step = state.analysis && state.step === 5 ? 5 : 0; state.stepDir = "forward"; }
  render({ focus: mode === "pro" ? (state.analysis ? "#main" : ".empty h1") : "#stepTitle" });
}
function setPhase(key) {
  if (!state.analysis || !phasesOf(state.analysis).includes(key)) return;
  state.phase = key;
  render();
  announce(`${t(`phases.${key}`)[0]}. ${t(`phases.${key}`)[1]}`);
}
function goStep(next) {
  state.stepDir = next > state.step ? "forward" : "back";
  state.step = Math.max(0, Math.min(STEP_COUNT - 1, next));
  render({ focus: "#stepTitle" });
}
function openAnalysis(data, message) {
  state.analysis = structuredClone(data);
  state.life = freshLife(state.analysis);
  state.selection = null;
  state.mapAnimated = false;
  state.phase = phasesOf(state.analysis)[1];
  toast(message);
}
function loadSample(lens = "strategic") {
  const pool = lens === "biopolitical" ? BIO_SAMPLES : SAMPLES;
  openAnalysis(pool[state.lang] || pool.en, t("sampleLoaded"));
  state.palette = null;
  if (state.mode === "pro") render({ focus: "#main" }); else render();
}
const BIO_LIST_PHASES = { "evidence/items": "evidence", "assumptions/items": "evidence", competing_explanations: "explanations", "intervention_assessment/care_control_tensions": "explanations", "resistance_agency/items": "agency", "alternatives/items": "agency", consent_exit: "agency" };
function phaseOfRecord(rec) {
  if (rec.pillar) return BIO_LIST_PHASES[rec.list] || "pillars";
  return rec.kind === "layer" ? "map" : rec.kind === "evidence" || rec.kind === "assumption" ? "evidence" : rec.kind === "contradiction" ? "tensions" : "futures";
}
function selectRecord(id, fromPalette = false) {
  if (!state.analysis) return;
  state.selection = { type: "record", id };
  const rec = recordsOf(state.analysis).find((r) => r.id === id);
  if (fromPalette && rec) state.phase = phaseOfRecord(rec);
  state.palette = null;
  state.inspectorOpen = narrow();
  if (caseMode()) state.scrollTo = `item-${id}`;
  render({ focus: state.inspectorOpen ? ".inspector .inspToggle" : undefined });
}
function openSheet(invoker) {
  state.palette = null;
  state.sheet = { invoker: invoker?.dataset?.action || null };
  render({ focus: "#answer" });
}
function closeOverlay() {
  const invoker = state.sheet?.invoker || state.panel?.invoker;
  state.palette = null; state.sheet = null; state.panel = null; state.removeArmed = false;
  render({ focus: invoker ? `[data-action="${invoker}"]` : undefined });
}
function updateAnswer(value) {
  state.answer = value;
  state.check = checkAnswer(value, state.mode === "guided" ? state.draft.lens : null);
  const view = checkView(state.check);
  const line = $("#checkLine");
  if (line) line.outerHTML = validationLine(view);
  const ok = state.check.status === "valid" || state.check.status === "partial";
  const next = $("#nextBtn");
  if (next) next.disabled = !ok;
  const cont = app.querySelector('[data-action="copyContinue"]');
  if (cont) cont.hidden = state.check.status !== "truncated";
  const guide = app.querySelector(".guide .mascot");
  if (guide && state.mode === "guided") {
    const moodKey = `${state.step}:${view.mood}`;
    guide.outerHTML = mascot(view.mood, view.say, { react: state.lastMood !== moodKey && view.mood !== "idle" });
    state.lastMood = moodKey;
  }
}

/* ---------- Real app data (read-only, same origin as the app) ---------- */
// Served next to the app (the dev server or a branch preview), the prototype lists the workspaces the
// app saved in this browser, opens a copy of one and runs the app's own Bio publication gate. It never
// writes to the app's storage. Elsewhere (the standalone artifact) it keeps the samples and stand-ins.
const ENGINE = ["biopolitics-schema-validator.js", "core/provenance.js", "biopolitics.js", "ai-interchange.js", "biopolitics-integrity.js"];
const REVISION_KINDS = { imported_canonical: "imported", committed_resolution: "committed", restored_revision: "restored" };
const real = { status: "loading", list: [], repo: null, bio: null, memo: { key: "", gate: null } };
function realGate(a) {
  if (!real.bio) return null;
  const key = `${state.lang}|${JSON.stringify(a)}`;
  if (real.memo.key !== key) {
    let gate = null;
    try { gate = real.bio.health(a, state.lang); } catch { /* keep the stand-in */ }
    real.memo = { key, gate };
  }
  return real.memo.gate;
}
const gateBox = (g) => `<div class="gateBox"><p><b>${esc(t("real.gateTitle"))}</b> ${statusTag(g.publishable ? "ok" : "crit", g.publishable ? t("real.gateOk") : t("real.gateBlocked", { n: fmtNum(g.missing.length) }))}</p>
  ${g.missing.length ? `<ul class="gateList">${g.missing.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}
  <p class="help">${esc(t("real.gateNote"))}</p></div>`;
function realList() {
  const date = new Intl.DateTimeFormat(state.lang, { dateStyle: "medium", timeStyle: "short" });
  const rows = real.list.map((w) => (w.integrity_status === "verified"
    ? `<li><span dir="auto">${esc(w.metadata?.title || t("real.untitled"))}<small class="meta">${esc(t("real.updated", { x: date.format(new Date(w.metadata?.updated_at)) }))}</small></span>${state.life?.source?.id === w.workspace_id ? `<span class="chip">${esc(t("life.current"))}</span>` : actionBtn("openReal", t("real.open"), { value: w.workspace_id })}</li>`
    : `<li><span class="mono">${esc(w.workspace_id)}<small>${esc(t("real.corrupt"))}</small></span></li>`)).join("");
  const note = real.status === "loading" ? "real.loading" : real.status === "unavailable" ? "real.unavailable" : rows ? "real.listHint" : "real.none";
  return `<section class="lifeCard realList"><span class="label">${esc(t("real.listTitle"))}</span>
    ${rows ? `<ul class="wsList">${rows}</ul>` : ""}
    <p class="help">${esc(t(note))}</p>
    ${real.status === "ready" && !rows ? `<div class="acts"><a class="btn" href="../../">${esc(t("real.openApp"))}</a></div>` : ""}
  </section>`;
}
async function loadReal() {
  try {
    for (const file of ENGINE) await import(`../../src/${file}`);
    real.bio = window.Jarbou3iBiopolitics?.health ? window.Jarbou3iBiopolitics : null;
  } catch { /* the engine is not served here */ }
  try {
    const { createIndexedDbWorkspaceBackend, createWorkspaceRepository } = await import("../../src/core/workspace-storage.js");
    real.repo = createWorkspaceRepository({ backend: createIndexedDbWorkspaceBackend() });
    real.list = await real.repo.list();
    real.status = "ready";
  } catch { real.status = "unavailable"; }
  render();
}
// Picks up what the app saved in another tab when this one comes back into view.
async function refreshReal() {
  if (!real.repo) return;
  try {
    const list = await real.repo.list();
    if (same(list, real.list)) return;
    real.list = list;
    render();
  } catch { /* keep the last list */ }
}
async function openReal(id) {
  let ws = null;
  try { ws = await real.repo.get(id); } catch { /* reported below */ }
  if (!ws) { toast(t("real.openFailed"), "warn"); return; }
  openAnalysis(ws.working_draft.canonical_payload, t("real.opened"));
  // The app's revisions, oldest first as the app appends them, so the history and head match the app's.
  state.life.revisions = ws.revisions.map((r, i) => ({ seq: i + 1, kind: REVISION_KINDS[r.kind] || "committed", data: structuredClone(r.canonical_payload) }));
  state.life.source = { id, title: ws.metadata?.title || "" };
  state.panel = null;
  if (state.mode === "pro") render({ focus: "#main" }); else setMode("pro");
}

const handlers = {
  lang: (el) => setLang(el.dataset.value),
  theme: toggleTheme,
  density: (el) => setDensity(el.dataset.value),
  toPro: () => {
    if (state.step === 4 && state.check.data && !state.analysis) openAnalysis(state.check.data, t("analysisOpened"));
    setMode("pro");
  },
  toGuided: () => setMode("guided"),
  next: () => {
    if (state.step === 4 && state.check.data) { openAnalysis(state.check.data, t("analysisOpened")); }
    goStep(state.step + 1);
  },
  prev: () => goStep(state.step - 1),
  restart: () => { state.draft = { ...state.draft, topic: "", context: "" }; state.answer = ""; state.check = { status: "empty" }; goStep(0); },
  example: (el) => {
    const [topic, context] = t("examples")[Number(el.dataset.value)];
    state.draft.topic = topic; state.draft.context = context;
    render({ focus: "#topic" });
  },
  choose: (el) => {
    state.draft[el.dataset.field] = el.dataset.value;
    // A pasted answer is checked against the lens chosen in step 2.
    if (el.dataset.field === "lens" && state.answer) state.check = checkAnswer(state.answer, state.draft.lens);
    render();
  },
  copyPrompt: () => copy(buildPrompt(), t("promptCopied")),
  togglePrompt: () => { state.promptOpen = !state.promptOpen; render(); },
  copyContinue: () => copy(continuePrompt(), t("continueCopied")),
  useSample: () => {
    const pool = state.mode === "guided" && state.draft.lens === "biopolitical" ? BIO_SAMPLES : SAMPLES;
    const text = JSON.stringify(pool[state.draft.analysisLang || state.lang] || pool.en, null, 2);
    $("#answer").value = text;
    updateAnswer(text);
  },
  openAnswer: () => { if (state.check.data) { openAnalysis(state.check.data, t("analysisOpened")); state.sheet = null; state.mode = "pro"; prefs.set("mode", "pro"); render({ focus: "#main" }); } },
  loadSample: (el) => loadSample(el.dataset.value),
  paste: (el) => openSheet(el),
  closeSheet: closeOverlay,
  phase: (el) => setPhase(el.dataset.value),
  selectLayer: (el) => {
    const key = el.dataset.value;
    state.selection = state.selection?.type === "layer" && state.selection.key === key ? null : { type: "layer", key };
    state.inspectorOpen = narrow() && !!state.selection;
    render();
  },
  selectPillar: (el) => {
    const key = el.dataset.value;
    state.selection = state.selection?.type === "pillar" && state.selection.key === key ? null : { type: "pillar", key };
    state.inspectorOpen = narrow() && !!state.selection;
    render();
  },
  selectRecord: (el) => selectRecord(el.dataset.value),
  inspector: () => { state.inspectorOpen = !state.inspectorOpen; render({ focus: state.inspectorOpen ? ".inspector .inspToggle" : '.topbar [data-action="inspector"]' }); },
  copyPath: (el) => copy(el.dataset.value, t("pathCopied")),
  copyJson: () => copy(JSON.stringify(state.analysis, null, 2), t("jsonCopied")),
  palette: (el) => { state.palette = { query: "", index: 0, invoker: el?.dataset?.action }; render(); },
  palPick: (el) => runPaletteItem(Number(el.dataset.value)),
  closeOverlay: (el, event) => { if (event.target === el) closeOverlay(); },
  workspace: (el) => openPanel("workspace", el),
  openReal: (el) => openReal(el.dataset.value),
  concept: (el) => setConcept(el.dataset.value),
  caseItem: (el) => {
    const id = el.dataset.value;
    state.selection = state.selection?.type === "record" && state.selection.id === id ? null : { type: "record", id };
    render({ focus: `[data-action="caseItem"][data-value="${CSS.escape(id)}"]` });
  },
  jump: (el) => {
    const target = document.getElementById(`sec-${el.dataset.value}`) || document.getElementById(`grp-${el.dataset.value}`);
    if (!target) return;
    target.scrollIntoView({ block: "start", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    target.querySelector("h1, h2, h3")?.focus({ preventScroll: true });
  },
  resolve: (el) => openPanel("resolve", el),
  prepRestore: (el) => {
    const { unsaved, uncommitted } = lifeOf();
    if (unsaved.length || uncommitted.length) { toast(t("life.dirtyBlocked"), "warn"); return; }
    openPanel("resolve", el, Number(el.dataset.value));
  },
  saveDraft: () => {
    const L = state.life;
    L.saved = structuredClone(state.analysis);
    // As in the app's ledger: a recorded decision goes stale once the draft it judged changes.
    for (const [id, status] of Object.entries(L.tasks)) if (status === "completed" || status === "waived") L.tasks[id] = "stale";
    toast(t("life.saved"));
    refocus();
  },
  commit: () => {
    if (!commitReady()) return;
    const L = state.life, source = resolveSource();
    const data = structuredClone(source ? source.data : L.saved);
    L.revisions.push({ seq: headRev().seq + 1, kind: source ? "restored" : "committed", data });
    if (source) { state.analysis = structuredClone(data); L.saved = structuredClone(data); }
    L.rationale = ""; L.confirm = false;
    closeOverlay();
    toast(t(source ? "life.restored" : "life.committed"));
  },
  restoreSnapshot: () => { const L = state.life; state.analysis = L.snapshot; L.snapshot = null; refocus(); toast(t("life.recovered")); },
  discardSnapshot: () => { state.life.snapshot = null; refocus(); toast(t("life.discarded")); },
  copyUnsaved: () => copy(JSON.stringify(lifeOf().unsaved, null, 2), t("life.copied")),
  reopen: () => {
    const L = state.life;
    state.analysis = structuredClone(L.saved); L.conflict = false; state.selection = null;
    render({ focus: "#main" });
    toast(t("life.opened"));
  },
  removeDamaged: () => {
    if (!state.removeArmed) { state.removeArmed = true; render({ focus: '[data-action="removeDamaged"]' }); return; }
    state.damaged = false; state.removeArmed = false;
    render({ focus: "#panelTitle" });
    toast(t("life.removed"));
  },
  task: (el) => {
    const [id, act] = el.dataset.value.split("|");
    const L = state.life;
    if (!L.reviewer.trim()) { toast(t("life.identityRequired"), "warn"); $("#reviewer")?.focus(); return; }
    if ((act === "task_completed" || act === "task_waived") && !L.note.trim()) { toast(t("life.rationaleRequired"), "warn"); $("#note")?.focus(); return; }
    L.tasks[id] = TASK_RESULT[act];
    L.note = "";
    render({ focus: `[data-action="task"][data-value^="${id}|"]` });
    toast(t("life.eventSaved"));
  },
};
function runPaletteItem(i) {
  const item = paletteItems()[i];
  state.palette = null;
  if (item) item.run(); else render();
}

/* ---------- Events ---------- */
app.addEventListener("click", (event) => {
  const el = event.target.closest("[data-action]");
  if (!el || el.disabled) return;
  const fn = handlers[el.dataset.action];
  if (fn) fn(el, event);
});
app.addEventListener("input", (event) => {
  const el = event.target;
  if (el.id === "palInput") { state.palette.query = el.value; state.palette.index = 0; refreshPalette(); return; }
  const bind = el.dataset.bind;
  if (!bind) return;
  if (bind === "answer") { updateAnswer(el.value); return; }
  if (bind === "confidence") { editConfidence(el); return; }
  if (LIFE_BINDS.includes(bind)) {
    state.life[bind] = el.type === "checkbox" ? el.checked : el.value;
    const commit = $("#commitBtn");
    if (commit) commit.disabled = !commitReady();
    return;
  }
  state.draft[bind] = el.value;
  if (bind === "topic") { const next = $("#nextBtn"); if (next) next.disabled = el.value.trim().length < 4; }
  if (bind === "analysisLang") render();
});
app.addEventListener("change", (event) => {
  if (event.target.dataset.bind === "analysisLang") { state.draft.analysisLang = event.target.value; render(); }
});
app.addEventListener("keydown", (event) => {
  const el = event.target;
  // Radio groups: arrow keys move the selection (mirrored in RTL).
  if (el.getAttribute?.("role") === "radio" && ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) {
    const group = [...el.closest('[role="radiogroup"]').querySelectorAll('[role="radio"]')];
    const rtl = document.documentElement.dir === "rtl";
    const forward = event.key === "ArrowDown" || event.key === (rtl ? "ArrowLeft" : "ArrowRight");
    const step = forward ? 1 : -1;
    const target = group[(group.indexOf(el) + step + group.length) % group.length];
    event.preventDefault();
    target.click();
    app.querySelector(`[data-action="${target.dataset.action}"][data-value="${CSS.escape(target.dataset.value)}"]${target.dataset.field ? `[data-field="${target.dataset.field}"]` : ""}`)?.focus();
    return;
  }
  // Map nodes and table rows behave like buttons.
  if ((event.key === "Enter" || event.key === " ") && (el.classList?.contains("node") || el.classList?.contains("row"))) {
    event.preventDefault();
    el.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  }
  if (el.id === "palInput") {
    const count = paletteItems().length;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      state.palette.index = (state.palette.index + (event.key === "ArrowDown" ? 1 : -1) + count) % Math.max(count, 1);
      refreshPalette();
    } else if (event.key === "Enter") { event.preventDefault(); runPaletteItem(state.palette.index); }
    else if (event.key === "Tab") event.preventDefault(); // focus stays in the dialog
  }
});
document.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    if (state.palette) closeOverlay(); else if (state.mode === "pro") handlers.palette();
    return;
  }
  if (event.key === "Escape") {
    if (state.palette || state.sheet || state.panel) { closeOverlay(); return; }
    if (state.inspectorOpen) { state.inspectorOpen = false; render({ focus: '.topbar [data-action="inspector"]' }); return; }
    if (state.selection) { state.selection = null; render(); }
    return;
  }
  if (state.mode !== "pro" || isTyping(document.activeElement) || state.palette || state.sheet || state.panel || event.ctrlKey || event.metaKey || event.altKey) return;
  const n = Number(event.key);
  if (n >= 1 && n <= PHASES.length && state.analysis && !caseMode()) { event.preventDefault(); setPhase(phasesOf(state.analysis)[n - 1]); }
  if (event.key === "/") { event.preventDefault(); handlers.palette(); }
});
// Drop a .json file onto the answer box.
app.addEventListener("dragover", (event) => {
  const zone = event.target.closest?.("[data-drop]");
  if (!zone) return;
  event.preventDefault();
  zone.classList.add("dragging");
});
app.addEventListener("dragleave", (event) => event.target.closest?.("[data-drop]")?.classList.remove("dragging"));
app.addEventListener("drop", async (event) => {
  const zone = event.target.closest?.("[data-drop]");
  if (!zone) return;
  event.preventDefault();
  zone.classList.remove("dragging");
  const file = event.dataTransfer?.files?.[0];
  if (!file) return;
  const text = await file.text();
  $("#answer").value = text;
  updateAnswer(text);
});
window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", () => { if (!state.theme) render(); });
for (const type of ["online", "offline"]) window.addEventListener(type, () => { state.offline = !navigator.onLine; render(); });
document.addEventListener("visibilitychange", () => { if (!document.hidden) refreshReal(); });

render();
loadReal();
