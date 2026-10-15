/* Responsive application-shell navigation. Analytical state is deliberately excluded. */

export const SHELL_SECTIONS = Object.freeze(["workflow", "engine", "review"]);

export function availableShellSections({ reviewAvailable = false } = {}) {
  return Object.freeze(
    SHELL_SECTIONS.filter((section) => section !== "review" || reviewAvailable),
  );
}

export function nextShellSection(
  current,
  key,
  { reviewAvailable = false, direction = "ltr" } = {},
) {
  const sections = availableShellSections({ reviewAvailable });
  if (key === "Home") return sections[0];
  if (key === "End") return sections.at(-1);

  const rtl = direction === "rtl";
  const delta = {
    ArrowRight: rtl ? -1 : 1,
    ArrowLeft: rtl ? 1 : -1,
    ArrowDown: 1,
    ArrowUp: -1,
  }[key];
  if (!delta) return null;

  const currentIndex = Math.max(0, sections.indexOf(current));
  return sections[(currentIndex + delta + sections.length) % sections.length];
}

// The next action is the task of the guided-flow step the user is on, or the
// review once there is an analysis.
const SETUP_COMMANDS = Object.freeze({
  topic: Object.freeze({ id: "topic", section: "workflow", focusTarget: "topicInput" }),
  lens: Object.freeze({ id: "lens", section: "workflow", focusTarget: "flowStepTitle" }),
  settings: Object.freeze({ id: "settings", section: "workflow", focusTarget: "promptMode" }),
  prompt: Object.freeze({ id: "prompt", section: "workflow", focusTarget: "copyPromptBtn" }),
  answer: Object.freeze({ id: "import", section: "workflow", focusTarget: "jsonInput" }),
});
const REVIEW_COMMAND = Object.freeze({ id: "review", section: "review", focusTarget: "reviewTitle" });

export function resolveShellCommand({ step, stage, hasAnalysis = false } = {}) {
  if (hasAnalysis) return REVIEW_COMMAND;
  // Once the prompt is copied, the task is pasting the answer.
  if (step === "prompt" && stage === "import") return SETUP_COMMANDS.answer;
  return SETUP_COMMANDS[step] || SETUP_COMMANDS.topic;
}
