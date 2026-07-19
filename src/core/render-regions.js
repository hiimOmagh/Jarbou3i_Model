/* Named synchronous render regions. Later phases may schedule them independently. */

export function createRegionRenderer(definitions) {
  const regions = new Map(Object.entries(definitions || {}));
  if (!regions.size || [...regions.values()].some((render) => typeof render !== "function")) {
    throw new TypeError("Region renderer requires named render functions.");
  }
  let cycle = 0;

  function render(names = [...regions.keys()]) {
    const requested = [...new Set(Array.isArray(names) ? names : [names])];
    for (const name of requested) {
      const renderRegion = regions.get(name);
      if (!renderRegion) throw new TypeError(`Unknown render region: ${name}.`);
      renderRegion();
    }
    cycle += 1;
    return cycle;
  }

  return Object.freeze({
    names: Object.freeze([...regions.keys()]),
    render,
    renderAll() {
      return render();
    },
    cycle() {
      return cycle;
    },
  });
}

