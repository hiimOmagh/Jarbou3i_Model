/* Composition root for shared platform services and independent lenses. */

import { createLensRegistry } from "./lens-registry.js";
import { createLocalizationService } from "./localization.js";
import { createSettingsRepository } from "./persistence.js";
import { createPerformanceMonitor, createRevisionCache, createTaskScheduler } from "./performance.js";
import { createPlatformState } from "./platform-state.js";
import { createRegionRenderer } from "./render-regions.js";

export const PLATFORM_RUNTIME_VERSION = "1.0.0";

export function createPlatformRuntime({
  adapters,
  initialState,
  localization,
  regions,
  storage = globalThis.localStorage,
  settingsKey = "jarbou3i-model-settings",
  performance,
  schedule,
} = {}) {
  const monitor = createPerformanceMonitor(performance);
  const registry = createLensRegistry(adapters);
  const settings = createSettingsRepository(storage, settingsKey);
  const bootSettings = settings.read();
  const localizationService = createLocalizationService(localization);
  const stateValue =
    typeof initialState === "function"
      ? initialState({ settings: bootSettings, registry, localization: localizationService })
      : initialState;
  const state = createPlatformState(stateValue || {});
  const scheduler = createTaskScheduler({ schedule });
  const renderer = createRegionRenderer(regions, { performance: monitor, scheduler });
  const cache = createRevisionCache();

  function inspect() {
    return Object.freeze({
      runtimeVersion: PLATFORM_RUNTIME_VERSION,
      stateRevision: state.revision(),
      renderCycle: renderer.cycle(),
      lenses: registry.manifests(),
      performance: monitor.snapshot(),
      pendingTasks: scheduler.pending(),
    });
  }

  return Object.freeze({
    runtimeVersion: PLATFORM_RUNTIME_VERSION,
    registry,
    localization: localizationService,
    settings,
    bootSettings: Object.freeze({ ...bootSettings }),
    state,
    renderer,
    performance: monitor,
    cache,
    scheduler,
    inspect,
  });
}
