/* Deterministic named render regions with opt-in scheduling and measurements. */

export function createRegionRenderer(definitions, { performance, scheduler } = {}) {
  const regions = new Map(Object.entries(definitions || {}));
  if (!regions.size || [...regions.values()].some((render) => typeof render !== "function")) {
    throw new TypeError("Region renderer requires named render functions.");
  }

  const metrics = new Map(
    [...regions.keys()].map((name) => [name, { name, count: 0, lastCycle: 0 }]),
  );
  const signatures = new Map();
  const scheduledNames = new Set();
  let cycle = 0;

  function normalize(names) {
    const requested = [...new Set(Array.isArray(names) ? names : [names])];
    for (const name of requested) {
      if (!regions.has(name)) throw new TypeError(`Unknown render region: ${name}.`);
    }
    return requested;
  }

  function render(names = [...regions.keys()]) {
    const requested = normalize(names);
    const nextCycle = cycle + 1;
    for (const name of requested) {
      const operation = regions.get(name);
      if (performance?.measure) {
        performance.measure(`render.${name}`, operation, { cycle: nextCycle });
      } else {
        operation();
      }
      const metric = metrics.get(name);
      metric.count += 1;
      metric.lastCycle = nextCycle;
    }
    cycle = nextCycle;
    return cycle;
  }

  function schedule(names = [...regions.keys()]) {
    for (const name of normalize(names)) scheduledNames.add(name);
    if (!scheduler?.enqueue) {
      const batch = [...scheduledNames];
      scheduledNames.clear();
      return render(batch);
    }
    scheduler.enqueue("platform-render", () => {
      const batch = [...scheduledNames];
      scheduledNames.clear();
      render(batch);
    });
    return cycle;
  }

  function renderChanged(nextSignatures) {
    if (!nextSignatures || typeof nextSignatures !== "object") {
      throw new TypeError("Changed-region rendering requires a signature map.");
    }
    const changed = [];
    for (const [name, signature] of Object.entries(nextSignatures)) {
      normalize(name);
      if (signatures.has(name) && Object.is(signatures.get(name), signature)) continue;
      changed.push([name, signature]);
    }
    if (!changed.length) return cycle;
    const completedCycle = render(changed.map(([name]) => name));
    for (const [name, signature] of changed) signatures.set(name, signature);
    return completedCycle;
  }

  return Object.freeze({
    names: Object.freeze([...regions.keys()]),
    render,
    renderAll() {
      return render();
    },
    renderChanged,
    schedule,
    cycle() {
      return cycle;
    },
    stats() {
      return Object.freeze(
        [...metrics.values()].map((value) => Object.freeze({ ...value })),
      );
    },
  });
}
