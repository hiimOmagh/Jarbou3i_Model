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
  "j-toast": [(el) => (el.getAttribute("role") === "status" ? null : 'needs role="status" so it is announced without taking focus')],
  "j-kbd": [(el) => (el.tagName === "KBD" ? null : "must be a <kbd>")],
  "j-help": [(el) => (el.closest(".j-field") ? null : "must be inside a .j-field")],
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
  "j-root", "j-card", "j-label", "j-mono", "j-sr-only", "j-icon",
  "j-shell", "j-shell-top", "j-shell-brand", "j-shell-brand-text", "j-shell-case", "j-shell-cluster",
  "j-shell-bar", "j-shell-nav", "j-shell-phase", "j-shell-phase-index", "j-shell-phase-copy",
  "j-shell-trust", "j-shell-next", "j-shell-next-copy",
  "j-flow", "j-flow-guide", "j-flow-mascot", "j-flow-say", "j-flow-steps", "j-flow-step", "j-flow-step-n",
  "j-flow-card", "j-flow-head", "j-flow-panel", "j-flow-topic", "j-flow-answer", "j-flow-examples",
  "j-flow-example-list", "j-flow-example", "j-flow-choices", "j-flow-choice", "j-flow-note", "j-flow-grid",
  "j-flow-howto", "j-flow-row", "j-flow-actions",
  "j-case-panel", "j-case", "j-case-outline", "j-case-doc", "j-case-sec",
  "j-save-light", "j-life-banners", "j-life-banner", "j-life-acts", "j-life", "j-life-grid", "j-life-card", "j-life-help", "j-life-revs",
  "j-editor", "j-editor-note", "j-editor-bar", "j-editor-grid", "j-editor-nav", "j-editor-sec", "j-editor-main",
  "j-editor-json", "j-editor-errors",
  "j-commit", "j-commit-trust", "j-commit-facts", "j-commit-head", "j-commit-tag", "j-commit-approve", "j-commit-confirm",
  "j-commit-acts", "j-diff", "j-diff-item", "j-diff-path", "j-diff-vals", "j-diff-val",
  "j-rev-grid", "j-rev-list", "j-rev-compare", "j-rev-items", "j-rev-item", "j-rev-top", "j-rev-meta",
  "j-ws", "j-ws-title", "j-ws-acts", "j-ws-list", "j-ws-row", "j-ws-name", "j-ws-meta", "j-ws-row-acts", "j-ws-empty",
  "j-export", "j-export-raw", "j-audit", "j-audit-body", "j-audit-group", "j-audit-path",
];
export const KERNEL_CLASSES = Object.freeze([...Object.keys(CONTRACTS), ...FREE_CLASSES].sort());

const describe = (element) =>
  `<${element.tagName.toLowerCase()}${element.id ? `#${element.id}` : ""} class="${element.getAttribute("class")}">`;

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
  return problems;
}
