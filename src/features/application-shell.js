/* Application-shell feature controller. Analytical state is deliberately excluded. */

import { createShellPreferences } from "../core/shell-preferences.js";
import {
  nextShellSection,
  resolveShellCommand,
} from "../core/shell-navigation.js";

const SHELL_TARGETS = Object.freeze({
  workflow: "workflowPanel",
  engine: "enginePanel",
  review: "reviewPanel",
});

const SHELL_COMMAND_LABELS = Object.freeze({
  topic: "shellActionTopic",
  lens: "shellActionLens",
  settings: "shellActionSettings",
  prompt: "shellActionPrompt",
  import: "shellActionImport",
  review: "shellActionReview",
});

const SHELL_ANNOUNCEMENTS = Object.freeze({
  workflow: "shellMovedToSetup",
  engine: "shellMovedToModel",
  review: "shellMovedToReview",
});

export function createApplicationShell({
  document,
  state,
  settings,
  translate,
  localize,
  renderRegion,
  // Shows a control that sits in a hidden step before it is focused.
  reveal = () => {},
  // The guided-flow step the user is on (src/features/guided-flow.js).
  flowStep = () => "topic",
  requestFrame = globalThis.requestAnimationFrame?.bind(globalThis),
  reducedMotion = () =>
    globalThis.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true,
} = {}) {
  if (
    !document ||
    !state ||
    !settings ||
    typeof translate !== "function" ||
    typeof localize !== "function" ||
    typeof renderRegion !== "function"
  ) {
    throw new TypeError("Application shell requires document, state, settings, localization, and rendering services.");
  }

  const byId = (id) => document.getElementById(id);
  const scheduleFrame =
    typeof requestFrame === "function"
      ? requestFrame
      : (operation) => queueMicrotask(operation);
  const preferences = createShellPreferences({
    document,
    settings,
    initialDensity: state.density,
  });
  let bound = false;

  function render() {
    const density = preferences.current();
    const compact = density === "compact";
    const densityLabel = compact
      ? translate("densityCompact")
      : translate("densityComfortable");
    const densityButton = byId("densityBtn");
    if (densityButton) {
      densityButton.setAttribute("aria-pressed", compact ? "true" : "false");
      densityButton.setAttribute(
        "aria-label",
        `${translate("densityTitle")}: ${densityLabel}`,
      );
      densityButton.title = `${translate("densityTitle")}: ${densityLabel}`;
    }
    if (byId("densityLabel")) byId("densityLabel").textContent = densityLabel;
    if (byId("lensContextLabel")) {
      byId("lensContextLabel").textContent = translate(
        state.analysisLens === "biopolitical"
          ? "lensContextBiopolitical"
          : "lensContextStrategic",
      );
    }
    for (const id of ["workspaceBar", "workspaceNav"]) {
      byId(id)?.setAttribute("aria-label", translate("workspaceNavigation"));
    }

    const reviewAvailable = Boolean(state.analysis);
    const reviewShortcut = byId("reviewNavShortcut");
    if (reviewShortcut) reviewShortcut.disabled = !reviewAvailable;
    if (state.shellSection === "review" && !reviewAvailable) {
      state.shellSection = "workflow";
    }
    document.querySelectorAll("[data-shell-nav]").forEach((button) => {
      const active = button.dataset.shellNav === state.shellSection;
      button.classList.toggle("active", active);
      button.tabIndex = active && !button.disabled ? 0 : -1;
      if (active) button.setAttribute("aria-current", "step");
      else button.removeAttribute("aria-current");
    });

    const command = resolveShellCommand({
      step: flowStep(),
      stage: state.stage,
      hasAnalysis: reviewAvailable,
    });
    const commandLabel = translate(SHELL_COMMAND_LABELS[command.id]);
    const nextAction = byId("shellNextAction");
    if (nextAction) {
      nextAction.dataset.shellCommand = command.id;
      // In setup the step on screen carries the one ink action; the header's
      // takes it once there is an analysis to review.
      if (command.id === "review") nextAction.dataset.variant = "primary";
      else delete nextAction.dataset.variant;
      nextAction.setAttribute(
        "aria-label",
        `${translate("nextActionLabel")}: ${commandLabel}`,
      );
    }
    if (byId("shellNextActionLabel")) {
      byId("shellNextActionLabel").textContent = commandLabel;
    }
    const saveLabels = {
      idle: localize(
        "No saved workspace",
        "لا توجد مساحة محفوظة",
        "Aucun espace enregistré",
      ),
      saving: localize(
        "Saving locally…",
        "جارٍ الحفظ محليًا…",
        "Enregistrement local…",
      ),
      saved: localize(
        "Saved locally",
        "محفوظ محليًا",
        "Enregistré localement",
      ),
      error: localize(
        "Local save needs attention",
        "الحفظ المحلي يحتاج مراجعة",
        "L’enregistrement local exige une vérification",
      ),
      // A saved workspace can still hold work that is not in a revision.
      uncommitted: localize("Not committed", "غير معتمد", "Non validé"),
      snapshot: localize("Recovery found", "استرداد متاح", "Récupération"),
      // Another tab changed the workspace; a write was refused.
      conflict: localize("Conflict", "تعارض", "Conflit"),
    };
    // The save light: where the work is, and the way to the work panel.
    const workspaceSaveState = byId("workspaceSaveState");
    if (workspaceSaveState) {
      const currentSaveState = state.workspaceSaveState || "idle";
      // Only what was read for the workspace open now.
      const life = (state.workspaceLife?.workspaceId === state.activeWorkspaceId && state.workspaceLife) || {};
      const lifeState = life.conflict ? "conflict" : currentSaveState !== "saved" ? "" : life.snapshot ? "snapshot" : life.uncommitted ? "uncommitted" : "";
      workspaceSaveState.textContent =
        saveLabels[lifeState || currentSaveState] || saveLabels.idle;
      workspaceSaveState.dataset.state =
        currentSaveState === "idle" ? "empty" : currentSaveState;
      if (lifeState) workspaceSaveState.dataset.life = lifeState;
      else delete workspaceSaveState.dataset.life;
      // The kernel status shows the state by shape and colour as well as text.
      workspaceSaveState.dataset.tone = lifeState === "snapshot"
        ? "warn"
        : lifeState === "uncommitted"
          ? "idle"
          : lifeState === "conflict"
            ? "crit"
            : { saved: "ok", error: "crit" }[currentSaveState] || "idle";
      workspaceSaveState.setAttribute(
        "aria-label",
        `${localize("Where your work is", "أين عملك", "Où en est votre travail")}: ${workspaceSaveState.textContent}`,
      );
    }
    // Global context: the case open now.
    const caseTitle = byId("shellCaseTitle");
    if (caseTitle) {
      const title = String(state.analysis?.subject?.title || "").trim();
      caseTitle.textContent = title;
      caseTitle.title = title;
      caseTitle.hidden = !title;
    }
  }

  function setDensity(value, { persist = true } = {}) {
    state.density = preferences.apply(value, { persist });
    renderRegion("shell");
  }

  function navigate(
    section,
    { focusTarget = null, announce = true } = {},
  ) {
    if (
      !SHELL_TARGETS[section] ||
      (section === "review" && !state.analysis)
    ) {
      return;
    }
    state.shellSection = section;
    renderRegion("shell");
    scheduleFrame(() => {
      byId(SHELL_TARGETS[section])?.scrollIntoView({
        behavior: reducedMotion() ? "auto" : "smooth",
        block: "start",
      });
      if (focusTarget) {
        reveal(focusTarget);
        byId(focusTarget)?.focus({ preventScroll: true });
      }
      if (announce && byId("shellAnnouncement")) {
        byId("shellAnnouncement").textContent = translate(
          SHELL_ANNOUNCEMENTS[section],
        );
      }
    });
  }

  function activateNext() {
    const command = resolveShellCommand({
      step: flowStep(),
      stage: state.stage,
      hasAnalysis: Boolean(state.analysis),
    });
    navigate(command.section, { focusTarget: command.focusTarget });
  }

  function bind() {
    if (bound) return;
    bound = true;

    const densityButton = byId("densityBtn");
    if (densityButton) {
      densityButton.onclick = () =>
        setDensity(
          preferences.current() === "compact" ? "comfortable" : "compact",
        );
    }

    // Density and theme sit in the header's menu (shell.css), and on a phone
    // the commands too: it opens under its button and closes once a choice
    // is made, so it never covers the page it changes.
    const displayMenu = byId("displayMenu");
    if (displayMenu?.showPopover) {
      let openWidth = 0;
      displayMenu.addEventListener("beforetoggle", (event) => {
        if (event.newState !== "open") return;
        // Its end under the button's end (its width is fixed in shell.css),
        // kept on screen where the header wrapped the button to a row's start.
        const box = byId("displayMenuBtn").getBoundingClientRect();
        const view = document.documentElement.clientWidth;
        openWidth = view;
        const width = Math.min(240, view - 16);
        const end = document.documentElement.dir === "rtl" ? box.left : box.right - width;
        displayMenu.style.top = `${box.bottom + window.scrollY + 8}px`;
        displayMenu.style.left = `${Math.max(8, Math.min(end, view - width - 8))}px`;
      });
      displayMenu.addEventListener("click", (event) => {
        if (event.target.closest("button") && displayMenu.matches(":popover-open")) displayMenu.hidePopover();
      });
      // A rotation moves its button: it closes rather than float where the
      // button was.
      window.addEventListener("resize", () => {
        if (displayMenu.matches(":popover-open") && document.documentElement.clientWidth !== openWidth) displayMenu.hidePopover();
      });
    }

    document.querySelectorAll("[data-shell-nav]").forEach((button) => {
      button.onclick = () => navigate(button.dataset.shellNav);
      button.addEventListener("keydown", (event) => {
        const section = nextShellSection(button.dataset.shellNav, event.key, {
          reviewAvailable: Boolean(state.analysis),
          direction: document.documentElement.dir,
        });
        if (!section) return;
        event.preventDefault();
        navigate(section);
        document
          .querySelector(`[data-shell-nav="${section}"]`)
          ?.focus();
      });
    });

    const nextAction = byId("shellNextAction");
    if (nextAction) nextAction.onclick = activateNext;
  }

  return Object.freeze({
    render,
    setDensity,
    navigate,
    activateNext,
    bind,
  });
}
