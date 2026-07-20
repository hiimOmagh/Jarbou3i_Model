/* Shared application-shell preferences. Analytical state is deliberately excluded. */

export const SHELL_DENSITIES = Object.freeze(["comfortable", "compact"]);

export function normalizeShellDensity(value) {
  return SHELL_DENSITIES.includes(value) ? value : "comfortable";
}

export function createShellPreferences({
  document,
  settings,
  initialDensity = "comfortable",
} = {}) {
  if (!document?.body || !document?.documentElement) {
    throw new TypeError("Shell preferences require a document.");
  }
  if (!settings || typeof settings.update !== "function") {
    throw new TypeError("Shell preferences require a settings repository.");
  }

  let density = normalizeShellDensity(initialDensity);

  function apply(value, { persist = true } = {}) {
    density = normalizeShellDensity(value);
    document.body.dataset.density = density;
    document.documentElement.style.colorScheme = "light dark";
    if (persist) settings.update({ density });
    return density;
  }

  return Object.freeze({
    apply,
    toggle(options) {
      return apply(density === "compact" ? "comfortable" : "compact", options);
    },
    current() {
      return density;
    },
    snapshot() {
      return Object.freeze({ density });
    },
  });
}
