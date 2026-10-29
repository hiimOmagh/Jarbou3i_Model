// Command palette (Ctrl/⌘ K), from the UX-0 case-file concept (ADR-0002).
// It lists every enabled control of the shell and of the open review by its own
// label, and runs a command by clicking that control: it owns no behaviour, so
// it can never disagree with the buttons it stands for.

const fold = (text) =>
  String(text).normalize("NFKD").replace(/[̀-ًͯ-ٟ]/g, "").toLowerCase();
const clean = (text) => String(text || "").replace(/\s+/g, " ").trim();

export function createCommandPalette({ document, translate }) {
  const byId = (id) => document.getElementById(id);
  let shown = [];
  let active = 0;
  // Where focus goes back after Escape. Some browsers (WebKit) do not focus a
  // clicked button, so the control that opened the palette is kept here.
  let returnTo = null;
  let ran = false;

  // A step's actions and the case file's are run even when a step not open
  // or a closed fold hides them: those are opened first (see prepare). A
  // closed fold leaves its content's display as it is, so only the step is
  // passed over here.
  function reachable(el) {
    for (let node = el; node && node !== document.body; node = node.parentElement) {
      if (node.matches("[data-flow-panel][hidden]")) continue;
      if (node.hidden || document.defaultView.getComputedStyle(node).display === "none") return false;
    }
    return true;
  }
  function prepare(el) {
    for (let node = el.parentElement; node; node = node.parentElement) {
      if (node.matches("details:not([open])")) node.open = true;
    }
    const step = el.closest("[data-flow-panel][hidden]")?.dataset.flowPanel;
    if (step) document.querySelector(`#workflowPanel [data-flow-step="${step}"]`)?.click();
  }
  // Each action under the name of its place: the step, or the case-file
  // section as the outline names it. One that throws work away for good
  // (data-palette-skip) stays a click on its own button.
  function actions() {
    const steps = [...document.querySelectorAll("#workflowPanel :is([data-flow-panel], .j-flow-more) .j-btn[id]:not([data-palette-skip])")].map((el) => {
      const step = el.closest("[data-flow-panel]")?.dataset.flowPanel;
      const name = step && document.querySelector(`#workflowPanel [data-flow-step="${step}"] span:not([aria-hidden])`)?.textContent;
      return [el, name ? `${clean(name)}: ${clean(el.textContent)}` : clean(el.textContent)];
    });
    const review = [...document.querySelectorAll("#reviewContent .j-case-sec .j-btn[id]:not([data-palette-skip])")].map((el) => {
      const key = document.defaultView.CSS.escape(el.closest(".j-case-sec").id.replace(/^case-/, ""));
      const name = document.querySelector(`#reviewNav [data-review="${key}"] strong, #reviewNav [data-bio-review="${key}"] strong`)?.textContent;
      return [el, name ? `${clean(name)}: ${clean(el.textContent)}` : clean(el.textContent)];
    });
    return { steps, review };
  }

  // The commands available now: enabled controls on screen, and actions one
  // step or fold away.
  function collect() {
    const goTo = translate("commandGoTo");
    const open = translate("commandOpen");
    const language = translate("languageLabel");
    const { steps, review } = actions();
    const entries = [
      ...[...document.querySelectorAll("#appShell [data-shell-nav]")].map((el) => [el, `${goTo}: ${clean(el.querySelector("strong")?.textContent)}`]),
      [byId("shellNextAction"), clean(byId("shellNextAction")?.getAttribute("aria-label"))],
      ...steps,
      ...[...document.querySelectorAll("#reviewNav [data-review], #reviewNav [data-bio-review]")].map((el) => [
        el,
        `${open}: ${clean(el.querySelector("strong")?.textContent || el.textContent)}`,
      ]),
      ...review,
      [byId("workspaceSaveState"), clean(byId("workspaceSaveState")?.getAttribute("aria-label"))],
      ...["langAr", "langEn", "langFr"].map((id) => [byId(id), `${language}: ${clean(byId(id)?.textContent)}`]),
      [byId("densityBtn"), clean(byId("densityBtn")?.getAttribute("aria-label"))],
      [byId("themeBtn"), clean(byId("themeBtn")?.getAttribute("aria-label"))],
    ];
    // How to find the control again if running it re-renders it.
    const escape = (value) => document.defaultView.CSS.escape(value);
    const selectorOf = (el) =>
      el.id ? `#${escape(el.id)}`
        : el.dataset.shellNav ? `[data-shell-nav="${escape(el.dataset.shellNav)}"]`
          : el.dataset.bioReview ? `#reviewNav [data-bio-review="${escape(el.dataset.bioReview)}"]`
            : `#reviewNav [data-review="${escape(el.dataset.review || "")}"]`;
    // Density and theme sit in the header's closed menu: listed while its
    // button is on screen.
    const inMenu = (el) => el.closest("#displayMenu") && byId("displayMenuBtn")?.getClientRects().length;
    const anywhere = new Set([...steps, ...review].map(([el]) => el));
    return entries
      .filter(([el, text]) => el && text && !el.disabled && (anywhere.has(el) ? reachable(el) : el.getClientRects().length || inMenu(el)))
      .map(([el, text]) => ({ el, text, selector: selectorOf(el), prepare: anywhere.has(el) }));
  }

  function select(index) {
    const options = byId("commandPaletteList").children;
    active = Math.max(0, Math.min(index, shown.length - 1));
    [...options].forEach((option, i) => option.setAttribute("aria-selected", String(i === active)));
    const current = options[active];
    byId("commandPaletteInput").setAttribute("aria-activedescendant", current ? current.id : "");
    current?.scrollIntoView({ block: "nearest" });
  }

  function filter(commands) {
    const words = fold(byId("commandPaletteInput").value).split(/\s+/).filter(Boolean);
    shown = commands.filter((command) => words.every((word) => fold(command.text).includes(word)));
    const list = byId("commandPaletteList");
    list.replaceChildren(
      ...shown.map((command, index) => {
        const option = document.createElement("li");
        option.className = "j-option";
        option.id = `command-${index}`;
        option.setAttribute("role", "option");
        option.setAttribute("aria-selected", "false");
        option.textContent = command.text;
        option.addEventListener("click", () => run(command));
        return option;
      }),
    );
    byId("commandPaletteEmpty").hidden = shown.length > 0;
    select(0);
  }

  function run(command) {
    ran = true;
    byId("commandPalette").close();
    if (command.prepare) prepare(command.el);
    // Where focus is before the click: opening a step moves it.
    const before = document.activeElement;
    command.el.click();
    // Focus lands on the control just used, found again if the click
    // re-rendered it, unless the control moved focus itself (an outline jump,
    // a dialog of its own). A control in the closed header menu gives it to
    // the menu's button.
    const found = command.el.isConnected ? command.el : document.querySelector(command.selector);
    const target = found && !found.getClientRects().length && found.closest("#displayMenu") ? byId("displayMenuBtn") : found;
    const focused = document.activeElement;
    const moved = focused && focused !== document.body && focused !== before;
    if (target && !target.disabled && !moved) target.focus();
  }

  function open(trigger = null) {
    const dialog = byId("commandPalette");
    // Never over another dialog, and never twice.
    const otherOpen = [...document.querySelectorAll('[aria-modal="true"]')].some((el) => el.getClientRects().length);
    if (dialog.open || otherOpen) return;
    const focused = document.activeElement;
    returnTo = focused && focused !== document.body ? focused : trigger;
    ran = false;
    const commands = collect();
    const input = byId("commandPaletteInput");
    input.value = "";
    input.oninput = () => filter(commands);
    filter(commands);
    dialog.showModal();
    input.focus();
  }

  function bind() {
    byId("commandPaletteBtn").addEventListener("click", (event) => open(event.currentTarget));
    // On a phone the commands are in the header's menu: it closes first, so
    // focus is back on its button when the command list closes.
    byId("menuCommandsBtn")?.addEventListener("click", () => {
      const menu = byId("displayMenu");
      if (menu.matches(":popover-open")) menu.hidePopover();
      open(byId("displayMenuBtn"));
    });
    byId("commandPalette").addEventListener("close", () => {
      if (!ran && returnTo?.isConnected) returnTo.focus();
    });
    byId("commandPaletteInput").addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        if (shown.length) select((active + (event.key === "ArrowDown" ? 1 : -1) + shown.length) % shown.length);
      } else if (event.key === "Enter" && shown[active]) {
        event.preventDefault();
        run(shown[active]);
      }
    });
    document.addEventListener("keydown", (event) => {
      if ((event.ctrlKey || event.metaKey) && !event.altKey && event.key.toLowerCase() === "k") {
        event.preventDefault();
        open();
      }
    });
  }

  return { bind, open };
}
