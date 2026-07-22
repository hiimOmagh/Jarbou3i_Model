/* Jarbou3i Model — auditable, content-preserving contract-shape repair */
(function attachContractRepair(root) {
  "use strict";

  const CONFIDENCE = new Set(["high", "medium", "low"]);
  const isObject = (value) =>
    Boolean(value) && typeof value === "object" && !Array.isArray(value);
  const clone = (value) => JSON.parse(JSON.stringify(value));

  function mappedCollection(value, path, repairs) {
    if (!isObject(value)) return value;
    const entries = Object.entries(value);
    if (!entries.length || entries.some(([, item]) => !isObject(item))) return value;
    repairs.push({
      code: "OBJECT_MAP_TO_ARRAY",
      path,
      count: entries.length,
    });
    return entries.map(([id, item]) => ({ id: item.id || id, ...item }));
  }

  function wrapStringArray(owner, key, path, repairs) {
    if (!owner || typeof owner[key] !== "string") return;
    owner[key] = [owner[key]];
    repairs.push({ code: "SCALAR_TO_ARRAY", path, count: 1 });
  }

  function repairBiopolitical(raw) {
    if (!isObject(raw)) return { value: raw, repairs: Object.freeze([]) };
    if (
      raw.analysis_lens !== "biopolitical" ||
      raw.analysis_contract !== "biopolitical-training-map-v2" ||
      raw.schema_version !== "2.1.0"
    ) {
      return { value: raw, repairs: Object.freeze([]) };
    }
    const value = clone(raw);
    const repairs = [];

    for (const key of [
      "international_comparison",
      "theoretical_comparison",
      "human_functions",
    ]) {
      value[key] = mappedCollection(value[key], `/${key}`, repairs);
    }

    (Array.isArray(value.international_comparison)
      ? value.international_comparison
      : []
    ).forEach((item, index) =>
      wrapStringArray(
        item,
        "transfer_limits",
        `/international_comparison/${index}/transfer_limits`,
        repairs,
      ),
    );

    const regimes = value.meaning_systems?.regimes_of_truth;
    (Array.isArray(regimes) ? regimes : []).forEach((item, index) =>
      wrapStringArray(
        item,
        "excluded_knowledge",
        `/meaning_systems/regimes_of_truth/${index}/excluded_knowledge`,
        repairs,
      ),
    );

    const actors = value.power_map?.actors;
    (Array.isArray(actors) ? actors : []).forEach((actor, index) => {
      if (
        actor.confidence !== undefined ||
        !Array.isArray(actor.accountability) ||
        !CONFIDENCE.has(actor.accountability.at(-1))
      ) {
        return;
      }
      actor.confidence = actor.accountability.pop();
      repairs.push({
        code: "MISPLACED_CONFIDENCE_RECOVERED",
        path: `/power_map/actors/${index}/confidence`,
        count: 1,
      });
    });

    return { value, repairs: Object.freeze(repairs.map(Object.freeze)) };
  }

  root.Jarbou3iContractRepair = Object.freeze({ repairBiopolitical });
})(typeof window !== "undefined" ? window : globalThis);
