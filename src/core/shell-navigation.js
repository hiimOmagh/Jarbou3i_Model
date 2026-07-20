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

export function resolveShellCommand({ stage, hasAnalysis = false } = {}) {
  if (hasAnalysis || stage === "review") {
    return Object.freeze({ id: "review", section: "review", focusTarget: "reviewTitle" });
  }
  if (stage === "import" || stage === "prompt") {
    return Object.freeze({ id: "import", section: "workflow", focusTarget: "jsonInput" });
  }
  return Object.freeze({ id: "topic", section: "workflow", focusTarget: "topicInput" });
}
