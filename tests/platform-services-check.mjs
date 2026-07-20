import { createLocalizationService } from "../src/core/localization.js";
import {
  createJsonRepository,
  createScopedListRepository,
  stableScopeHash,
} from "../src/core/persistence.js";
import { createPlatformState } from "../src/core/platform-state.js";
import { createRegionRenderer } from "../src/core/render-regions.js";

const fail = (message) => {
  console.error(`Platform services check failed: ${message}`);
  process.exit(1);
};
const assert = (condition, message) => {
  if (!condition) fail(message);
};

const state = createPlatformState({ lang: "en", lens: "strategic", topic: "" });
const events = [];
const unsubscribe = state.subscribe((event) => events.push(event));
state.patch({ lang: "fr", topic: "Test" }, "locale-change");
assert(state.state.lang === "fr", "state patch did not update the live compatibility facade");
assert(state.revision() === 1, "transactional patch must publish once");
assert(events[0]?.keys.includes("lang") && events[0]?.keys.includes("topic"), "state event lost changed keys");
assert(Object.isFrozen(state.snapshot()), "state snapshots must be immutable");
state.state.lens = "biopolitical";
assert(state.revision() === 2, "direct compatibility updates must remain observable");
unsubscribe();

const values = new Map();
const storage = {
  getItem: (key) => values.get(key) ?? null,
  setItem: (key, value) => values.set(key, value),
  removeItem: (key) => values.delete(key),
};
const settings = createJsonRepository({
  storage,
  key: "settings",
  fallback: () => ({}),
  validate: (value) => Boolean(value) && typeof value === "object" && !Array.isArray(value),
});
settings.update({ lang: "ar" });
settings.update({ theme: "dark" });
assert(settings.read().lang === "ar" && settings.read().theme === "dark", "settings updates were not merged");
values.set("settings", "{broken");
assert(Object.keys(settings.read()).length === 0, "corrupt persistence did not fail closed");

const scope = "analysis-1";
const views = createScopedListRepository({ storage, prefix: "views.v1", scope });
views.replace([{ id: "view-1", snapshot: { mode: "story" } }]);
assert(views.read()[0].id === "view-1", "scoped list persistence failed");
assert(views.key === `views.v1.${stableScopeHash(scope)}`, "scoped storage key changed incompatibly");

const i18n = createLocalizationService({
  catalogs: {
    en: { title: "Title", nested: { label: "English" } },
    ar: { title: "العنوان" },
    fr: { title: "Titre" },
  },
  supportedLanguages: ["ar", "en", "fr"],
  fallbackLanguage: "en",
  resolve: ({ language, key, context }) =>
    context.lens === "biopolitical" && key === "title"
      ? `${language}:bio`
      : undefined,
});
assert(i18n.translate("ar", "title") === "العنوان", "catalog translation failed");
assert(i18n.translate("xx", "nested.label") === "English", "fallback translation failed");
assert(i18n.translate("fr", "title", { lens: "biopolitical" }) === "fr:bio", "lens localization resolver failed");

const order = [];
const renderer = createRegionRenderer({
  shell: () => order.push("shell"),
  review: () => order.push("review"),
});
renderer.render("review");
renderer.renderAll();
assert(order.join(",") === "review,shell,review", "named render regions are not deterministic");
assert(renderer.cycle() === 2, "render cycles are not measurable");
renderer.renderChanged({ shell: "en", review: "analysis-1" });
renderer.renderChanged({ shell: "en", review: "analysis-1" });
assert(
  order.join(",") === "review,shell,review,shell,review",
  "unchanged region signatures must not rerender",
);
assert(
  renderer.stats().find((region) => region.name === "review")?.count === 3,
  "region-level render counts are inaccurate",
);

let failingRenders = 0;
const retryable = createRegionRenderer({
  review: () => {
    failingRenders += 1;
    if (failingRenders === 1) throw new Error("transient render failure");
  },
});
try {
  retryable.renderChanged({ review: "analysis-2" });
} catch {
  // A failed render must not commit the signature and suppress its retry.
}
retryable.renderChanged({ review: "analysis-2" });
assert(failingRenders === 2, "failed region signatures were committed before rendering completed");

console.log("Platform services checks passed.");
