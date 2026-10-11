/* Guided flow (ADR-0002): the setup phase as the UX-0 prototype's steps, one
   at a time, with the guide beside them. It shows and hides the app's own
   controls and owns no analytical state; the app tells it when to move. */

export const FLOW_STEPS = Object.freeze(["topic", "lens", "settings", "prompt", "answer"]);

export function createGuidedFlow({
  document,
  translate,
  canContinue = () => true,
  mood = () => "idle",
} = {}) {
  const byId = (id) => document.getElementById(id);
  let current = FLOW_STEPS[0];

  function render({ focus = false } = {}) {
    const root = byId("workflowPanel");
    if (!root) return;
    const index = FLOW_STEPS.indexOf(current);
    root.querySelectorAll("[data-flow-panel]").forEach((panel) => {
      panel.hidden = panel.dataset.flowPanel !== current;
    });
    root.querySelectorAll("[data-flow-step]").forEach((button) => {
      const at = FLOW_STEPS.indexOf(button.dataset.flowStep);
      button.dataset.state = at < index ? "done" : at === index ? "current" : "next";
      if (at === index) button.setAttribute("aria-current", "step");
      else button.removeAttribute("aria-current");
    });
    const pick = (key) => translate(key)?.[index] ?? "";
    byId("flowStepOf").textContent = translate("flowStepOf")
      .replace("{n}", index + 1)
      .replace("{total}", FLOW_STEPS.length);
    byId("flowStepTitle").textContent = pick("flowTitles");
    byId("flowStepHint").textContent = pick("flowHints");
    // The guide reacts to the answer being checked; otherwise it explains the step.
    const feeling = mood(current);
    byId("flowGuide").dataset.mood = feeling;
    byId("flowSay").textContent = feeling === "idle" ? pick("flowSay") : translate(`flowSay_${feeling}`);
    renderExamples();
    byId("flowBack").hidden = index === 0;
    byId("flowNext").hidden = index === FLOW_STEPS.length - 1;
    byId("flowNext").disabled = !canContinue(current);
    if (focus) byId("flowStepTitle").focus();
  }

  // Built again only when the language changes, so a clicked example keeps focus.
  function renderExamples() {
    const list = byId("flowExamples");
    const examples = translate("flowExamples");
    const key = JSON.stringify(examples);
    if (!list || !Array.isArray(examples) || list.dataset.key === key) return;
    list.dataset.key = key;
    list.replaceChildren(...examples.map(([topic, context]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "j-flow-example";
      button.textContent = topic;
      button.title = context;
      button.dataset.context = context;
      return button;
    }));
  }

  // An example fills the topic and its context the way typing would.
  function useExample(button) {
    for (const [id, value] of [["topicInput", button.textContent], ["timeframeInput", button.dataset.context]]) {
      byId(id).value = value;
      byId(id).dispatchEvent(new Event("input", { bubbles: true }));
    }
  }

  function go(step, options) {
    if (!FLOW_STEPS.includes(step)) return;
    current = step;
    render(options);
  }

  // Opens the step that holds a control, so it can be reached or focused.
  function reveal(id) {
    const step = byId(id)?.closest("[data-flow-panel]")?.dataset.flowPanel;
    if (step && step !== current) go(step);
  }

  const move = (by) => go(FLOW_STEPS[FLOW_STEPS.indexOf(current) + by], { focus: true });

  function bind() {
    const root = byId("workflowPanel");
    root.addEventListener("click", (event) => {
      const step = event.target.closest("[data-flow-step]");
      if (step) go(step.dataset.flowStep, { focus: true });
      const example = event.target.closest(".j-flow-example");
      if (example) useExample(example);
    });
    byId("flowBack").addEventListener("click", () => move(-1));
    byId("flowNext").addEventListener("click", () => move(1));
    // The app's own listeners have run by now; the guide and Continue follow them.
    root.addEventListener("input", () => render());
    render();
  }

  return { bind, render, go, reveal, get step() { return current; } };
}
