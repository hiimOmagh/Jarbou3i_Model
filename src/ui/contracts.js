// DOM contracts for the design-system kernel (src/ui/kernel.css, UIX-1).
// Each control's styles assume a structure; the contract states it, and
// checkContracts() lists every place a page breaks it. The component harness
// (tests/ui-harness/) and later the app's own views are checked with it.

const text = (element) => element.textContent.replace(/\s+/g, " ").trim();
const named = (element) =>
  Boolean(text(element) || element.getAttribute("aria-label")?.trim() || element.getAttribute("aria-labelledby"));
const oneOf = (attribute, values, { required = false } = {}) => (element) => {
  const value = element.getAttribute(attribute);
  if (value === null) return required ? `needs ${attribute} (${values.join(", ")})` : null;
  return values.includes(value) ? null : `${attribute}="${value}" is not one of ${values.join(", ")}`;
};

export const CONTRACTS = Object.freeze({
  "j-btn": [
    (el) => (el.tagName === "BUTTON" || (el.tagName === "A" && el.hasAttribute("href")) ? null : "must be a <button> or a link"),
    (el) => (el.tagName !== "BUTTON" || el.hasAttribute("type") ? null : "a <button> needs a type"),
    (el) => (named(el) ? null : "needs an accessible name"),
    oneOf("data-variant", ["primary", "ghost", "danger"]),
    oneOf("data-size", ["lg", "icon"]),
    (el) => (el.dataset.size !== "icon" || el.getAttribute("aria-label") ? null : "an icon-only button needs aria-label"),
  ],
  "j-seg": [
    (el) => (el.getAttribute("role") === "radiogroup" ? null : 'needs role="radiogroup"'),
    (el) => (named(el) ? null : "needs aria-label or aria-labelledby"),
    (el) => {
      const options = [...el.children];
      if (!options.length || options.some((option) => option.tagName !== "BUTTON" || option.getAttribute("role") !== "radio")) {
        return 'every option must be a <button role="radio">';
      }
      return options.filter((option) => option.getAttribute("aria-checked") === "true").length === 1
        ? null
        : 'exactly one option must be aria-checked="true"';
    },
  ],
  "j-status": [
    oneOf("data-tone", ["ok", "warn", "crit", "idle"], { required: true }),
    (el) => (text(el) ? null : "needs text: colour and shape alone do not say the state"),
  ],
  "j-disclosure": [(el) => (el.tagName === "DETAILS" && el.querySelector(":scope > summary") ? null : "must be a <details> with a <summary>")],
  "j-modal": [
    (el) => (el.getAttribute("role") === "dialog" && el.getAttribute("aria-modal") === "true" ? null : 'needs role="dialog" and aria-modal="true"'),
    (el) => (named(el) ? null : "needs aria-labelledby or aria-label"),
  ],
  "j-pick": [
    (el) => (el.tagName === "BUTTON" && el.hasAttribute("type") ? null : "must be a <button> with a type"),
    oneOf("aria-pressed", ["true", "false"], { required: true }),
  ],
  "j-note": [oneOf("data-tone", ["ok", "warn", "crit", "idle"], { required: true })],
  "j-chip": [oneOf("data-tone", ["ok", "warn", "crit"]), (el) => (text(el) ? null : "needs text")],
  "j-field": [
    (el) => {
      const label = el.querySelector(":scope > label[for]");
      const input = label && el.ownerDocument.getElementById(label.htmlFor);
      return input && el.contains(input) && input.classList.contains("j-input")
        ? null
        : "needs a <label for> naming a .j-input inside the field";
    },
    (el) => {
      const help = el.querySelector(":scope > .j-help");
      if (!help) return null;
      const input = el.querySelector(".j-input");
      return help.id && input?.getAttribute("aria-describedby")?.split(/\s+/).includes(help.id)
        ? null
        : "its .j-help must be referenced by the input's aria-describedby";
    },
  ],
  "j-input": [
    (el) => (["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName) ? null : "must be an <input>, <textarea> or <select>"),
    oneOf("aria-invalid", ["true", "false"]),
  ],
  "j-toast": [
    (el) => (el.getAttribute("role") === "status" ? null : 'needs role="status" so it is announced without taking focus'),
    oneOf("data-open", ["true", "false"]),
    oneOf("data-tone", ["crit", "warn"]),
  ],
  "j-skip": [
    (el) => {
      const target = el.tagName === "A" && el.getAttribute("href")?.match(/^#(.+)/)?.[1];
      return target && el.ownerDocument.getElementById(target) ? null : "must be a link to an element on this page";
    },
    (el) => (text(el) ? null : "needs text"),
  ],
  "j-save-light": [
    (el) => (el.tagName === "BUTTON" && el.getAttribute("type") === "button" ? null : 'must be a <button type="button">'),
    (el) => (el.getAttribute("aria-haspopup") === "dialog" && el.ownerDocument.getElementById(el.getAttribute("aria-controls") || "")
      ? null
      : 'needs aria-haspopup="dialog" and aria-controls naming the work panel it opens'),
    oneOf("data-state", ["empty", "saving", "saved", "error"], { required: true }),
    oneOf("data-life", ["snapshot", "uncommitted", "conflict"]),
  ],
  "j-kbd": [(el) => (el.tagName === "KBD" ? null : "must be a <kbd>")],
  "j-help": [(el) => (el.closest(".j-field") ? null : "must be inside a .j-field")],
  "j-ref": [
    (el) => (el.tagName === "BUTTON" && el.getAttribute("type") === "button" ? null : 'must be a <button type="button">'),
    (el) => (el.dataset.referenceId ? null : "needs data-reference-id: the record it opens"),
    (el) => (named(el) ? null : "needs an accessible name"),
  ],
  "j-meter": [
    (el) => (el.getAttribute("role") === "img" ? null : 'needs role="img": its steps are drawn'),
    (el) => (named(el) ? null : "needs an accessible name: the score"),
  ],
  "j-dialog": [
    (el) => (el.tagName === "DIALOG" ? null : "must be a <dialog>, opened with showModal()"),
    (el) => (named(el) ? null : "needs aria-labelledby or aria-label"),
  ],
  "j-listbox": [
    (el) => (el.getAttribute("role") === "listbox" ? null : 'needs role="listbox"'),
    (el) => (named(el) ? null : "needs aria-labelledby or aria-label"),
  ],
  "j-option": [
    (el) => (el.getAttribute("role") === "option" ? null : 'needs role="option"'),
    (el) => (el.closest(".j-listbox") ? null : "must be inside a .j-listbox"),
    oneOf("aria-selected", ["true", "false"], { required: true }),
  ],
});

// Classes that carry no structural rule: kernel helpers, and the modern
// shell's layout (src/ui/shell.css), whose controls are kernel controls.
const FREE_CLASSES = [
  "j-root", "j-card", "j-card-head", "j-label", "j-mono", "j-sr-only", "j-icon",
  "j-shell", "j-shell-top", "j-shell-brand", "j-shell-mark", "j-shell-brand-text", "j-shell-lead", "j-shell-case", "j-shell-cluster",
  "j-shell-bar", "j-shell-nav", "j-shell-phase", "j-shell-phase-index", "j-shell-phase-copy",
  "j-shell-trust", "j-shell-next", "j-shell-next-copy", "j-shell-display", "j-shell-tools", "j-shell-tool-name",
  "j-ride", "j-ride-skip", "j-ride-head", "j-ride-doors", "j-ride-line", "j-ride-stop", "j-ride-ring", "j-ride-name", "j-ride-here", "j-ride-time", "j-ride-text", "j-ride-end",
  "j-trip", "j-trip-say", "j-trip-title", "j-trip-text", "j-trip-foot", "j-trip-where", "j-trip-line", "j-trip-count",
  "j-flow", "j-flow-guide", "j-flow-mascot", "j-flow-more", "j-flow-say", "j-flow-steps", "j-flow-step", "j-flow-step-n",
  "j-flow-card", "j-flow-head", "j-flow-panel", "j-flow-topic", "j-flow-answer", "j-flow-examples",
  "j-flow-example-list", "j-flow-example", "j-flow-choices", "j-flow-choice", "j-flow-note", "j-flow-grid",
  "j-flow-howto", "j-flow-row", "j-flow-actions", "j-mode-field", "j-mode-help",
  "j-case", "j-case-outline", "j-case-link", "j-case-count", "j-case-doc", "j-case-sec", "j-case-return",
  "j-life-banners", "j-life-banner", "j-life-acts", "j-life", "j-life-grid", "j-life-card", "j-life-help", "j-life-revs",
  "j-editor", "j-editor-note", "j-editor-bar", "j-editor-grid", "j-editor-nav", "j-editor-sec", "j-editor-main",
  "j-editor-json", "j-editor-errors",
  "j-commit", "j-commit-facts", "j-commit-approve", "j-commit-confirm",
  "j-diff", "j-diff-item", "j-diff-path", "j-diff-vals", "j-diff-val",
  "j-rev-grid", "j-rev-list", "j-rev-compare",
  "j-modal-back", "j-modal-head", "j-modal-hint", "j-modal-trust", "j-modal-sechead", "j-modal-acts", "j-modal-pre",
  "j-pick-list", "j-pick-top", "j-pick-meta",
  "j-ledger", "j-ledger-grid", "j-ledger-counts", "j-ledger-selected", "j-ledger-waiver", "j-ledger-history",
  "j-ws", "j-ws-title", "j-ws-acts", "j-ws-list", "j-ws-row", "j-ws-name", "j-ws-meta", "j-ws-row-acts", "j-ws-empty",
  "j-export", "j-export-raw", "j-audit-body", "j-audit-group", "j-audit-path", "j-audit-gaps",
  "j-ref-label", "j-ref-id",
  "j-insp-head", "j-insp-body", "j-insp-summary", "j-insp-sec", "j-insp-facts", "j-insp-pair", "j-insp-sub",
  "j-insp-list", "j-insp-rec", "j-insp-occ", "j-insp-foot",
  "j-lede", "j-recs", "j-rec", "j-rec-head", "j-rec-id", "j-rec-title", "j-rec-text", "j-rec-facts", "j-rec-more", "j-checks", "j-stats", "j-table-wrap", "j-table",
  "j-idir", "j-idir-head",
  "j-engine-map", "j-engine-step", "j-engine-n", "j-engine-name", "j-engine-text", "j-engine-count",
  "j-layers", "j-layer", "j-layer-h", "j-layer-head", "j-layer-n", "j-layer-name", "j-layer-text", "j-layer-count", "j-layer-chev", "j-layer-body",
  "j-brief", "j-brief-head", "j-brief-topic", "j-brief-gate", "j-brief-main", "j-brief-claim", "j-brief-figures", "j-brief-bar", "j-brief-signals", "j-brief-signal", "j-brief-acts",
  "j-brief-steps", "j-brief-desc", "j-brief-items", "j-brief-tags", "j-brief-open", "j-brief-divider", "j-brief-alert", "j-brief-bands",
  "j-diag", "j-diag-notes",
  "j-evi", "j-evi-title", "j-evi-body", "j-evi-sec", "j-evi-head", "j-evi-acts", "j-evi-counts",
  "j-evi-phases", "j-evi-reason", "j-evi-tasks", "j-evi-seq", "j-evi-target",
  "j-conn", "j-conn-hop", "j-conn-all", "j-conn-map", "j-conn-side", "j-conn-arrow", "j-conn-centre", "j-conn-node",
  "j-conn-rel", "j-conn-layers", "j-conn-list", "j-conn-from", "j-conn-to", "j-conn-line", "j-conn-why", "j-conn-gaps", "j-conn-loose", "j-conn-act",
];
export const KERNEL_CLASSES = Object.freeze([...Object.keys(CONTRACTS), ...FREE_CLASSES].sort());

const describe = (element) =>
  `<${element.tagName.toLowerCase()}${element.id ? `#${element.id}` : ""}${element.hasAttribute("class") ? ` class="${element.getAttribute("class")}"` : ""}>`;

// Every contract break under root, and every .j-* class the kernel does not define.
export function checkContracts(root) {
  const problems = [];
  for (const element of root.querySelectorAll('[class*="j-"]')) {
    for (const name of element.classList) {
      if (!name.startsWith("j-")) continue;
      if (!KERNEL_CLASSES.includes(name)) {
        problems.push({ element: describe(element), contract: name, problem: "is not a kernel class" });
        continue;
      }
      for (const rule of CONTRACTS[name] || []) {
        const problem = rule(element);
        if (problem) problems.push({ element: describe(element), contract: name, problem });
      }
    }
  }
  // Safari stops announcing a list as a list once its markers are hidden,
  // unless it sits in navigation or says role="list".
  for (const list of root.querySelectorAll("ul, ol")) {
    if (getComputedStyle(list).listStyleType !== "none" || list.hasAttribute("role") || list.closest("nav, [aria-hidden='true']")) continue;
    problems.push({ element: describe(list), contract: "list", problem: 'a list without markers needs role="list"' });
  }
  // ARIA gives a plain div, span or paragraph no name: screen readers drop
  // one set on it, or read it inconsistently.
  for (const named of root.querySelectorAll(":is(div, span, p):is([aria-label], [aria-labelledby]):not([role])")) {
    problems.push({ element: describe(named), contract: "name", problem: "a name needs a role that can be named" });
  }
  return problems;
}
