/* Jarbou3i Model — auditable, content-preserving contract-shape repair */
(function attachContractRepair(root) {
  "use strict";

  const CONFIDENCE = new Set(["high", "medium", "low"]);
  const isObject = (value) =>
    Boolean(value) && typeof value === "object" && !Array.isArray(value);
  const clone = (value) => JSON.parse(JSON.stringify(value));
  const pointerParts = (pointer) =>
    String(pointer || "")
      .split("/")
      .slice(1)
      .map((part) => part.replaceAll("~1", "/").replaceAll("~0", "~"));

  function ownerAtPointer(value, pointer) {
    return pointerParts(pointer).reduce(
      (current, key) => current?.[key],
      value,
    );
  }

  function quarantineUnknownProperties(value, repairs, quarantine) {
    const validate =
      root.Jarbou3iBiopoliticsSchemaValidators?.canonical;
    if (typeof validate !== "function") return;
    for (let pass = 0; pass < 64; pass += 1) {
      validate(value);
      const extras = (validate.errors || []).filter(
        (error) => error.keyword === "additionalProperties",
      );
      if (!extras.length) return;
      let changed = false;
      for (const error of extras) {
        const property = error.params?.additionalProperty;
        const owner = ownerAtPointer(value, error.instancePath);
        if (
          !property ||
          !isObject(owner) ||
          !Object.prototype.hasOwnProperty.call(owner, property)
        ) {
          continue;
        }
        const path = `${error.instancePath || ""}/${String(property)
          .replaceAll("~", "~0")
          .replaceAll("/", "~1")}`;
        const originalValue = clone(owner[property]);
        delete owner[property];
        quarantine.push(
          Object.freeze({
            code: "UNKNOWN_PROPERTY_QUARANTINED",
            path: path || "/",
            value: originalValue,
            action: "preserved_in_import_audit",
            severity: "information",
          }),
        );
        repairs.push({
          code: "UNKNOWN_PROPERTY_QUARANTINED",
          path: path || "/",
          count: 1,
        });
        changed = true;
      }
      if (!changed) return;
    }
  }

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
    if (!isObject(raw))
      return {
        value: raw,
        repairs: Object.freeze([]),
        quarantine: Object.freeze([]),
      };
    if (
      raw.analysis_lens !== "biopolitical" ||
      raw.analysis_contract !== "biopolitical-training-map-v2" ||
      raw.schema_version !== "2.1.0"
    ) {
      return {
        value: raw,
        repairs: Object.freeze([]),
        quarantine: Object.freeze([]),
      };
    }
    const value = clone(raw);
    const repairs = [];
    const quarantine = [];

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

    quarantineUnknownProperties(value, repairs, quarantine);
    return {
      value,
      repairs: Object.freeze(repairs.map(Object.freeze)),
      quarantine: Object.freeze(quarantine),
    };
  }

  root.Jarbou3iContractRepair = Object.freeze({ repairBiopolitical });
})(typeof window !== "undefined" ? window : globalThis);
