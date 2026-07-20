/* Bounded, dependency-free performance primitives for the shared platform. */

const defaultClock = () =>
  globalThis.performance?.now?.() ?? Date.now();

function freezeDetail(detail) {
  if (!detail || typeof detail !== "object" || Array.isArray(detail)) {
    return Object.freeze({});
  }
  return Object.freeze({ ...detail });
}

export function createPerformanceMonitor({
  clock = defaultClock,
  capacity = 200,
  onEntry,
} = {}) {
  if (typeof clock !== "function") {
    throw new TypeError("Performance monitor requires a clock function.");
  }
  if (!Number.isInteger(capacity) || capacity < 1) {
    throw new TypeError("Performance monitor capacity must be a positive integer.");
  }

  const entries = [];
  let sequence = 0;

  function record(name, startedAt, detail = {}) {
    const endedAt = clock();
    const entry = Object.freeze({
      id: ++sequence,
      name: String(name),
      startedAt,
      endedAt,
      duration: Math.max(0, endedAt - startedAt),
      detail: freezeDetail(detail),
    });
    entries.push(entry);
    if (entries.length > capacity) entries.splice(0, entries.length - capacity);
    onEntry?.(entry);
    return entry;
  }

  function start(name) {
    if (!name) throw new TypeError("Performance measure requires a name.");
    return Object.freeze({ name: String(name), startedAt: clock() });
  }

  function end(token, detail) {
    if (!token || typeof token.name !== "string" || !Number.isFinite(token.startedAt)) {
      throw new TypeError("Performance measure token is invalid.");
    }
    return record(token.name, token.startedAt, detail);
  }

  function measure(name, operation, detail) {
    if (typeof operation !== "function") {
      throw new TypeError("Measured operation must be a function.");
    }
    const token = start(name);
    try {
      return operation();
    } finally {
      end(token, detail);
    }
  }

  async function measureAsync(name, operation, detail) {
    if (typeof operation !== "function") {
      throw new TypeError("Measured operation must be a function.");
    }
    const token = start(name);
    try {
      return await operation();
    } finally {
      end(token, detail);
    }
  }

  function snapshot() {
    const aggregates = new Map();
    for (const entry of entries) {
      const current = aggregates.get(entry.name) || {
        name: entry.name,
        count: 0,
        total: 0,
        max: 0,
        latest: 0,
      };
      current.count += 1;
      current.total += entry.duration;
      current.max = Math.max(current.max, entry.duration);
      current.latest = entry.duration;
      aggregates.set(entry.name, current);
    }
    return Object.freeze({
      capacity,
      entryCount: entries.length,
      entries: Object.freeze([...entries]),
      measures: Object.freeze(
        [...aggregates.values()].map((value) =>
          Object.freeze({
            ...value,
            average: value.count ? value.total / value.count : 0,
          }),
        ),
      ),
    });
  }

  return Object.freeze({
    start,
    end,
    measure,
    measureAsync,
    snapshot,
    clear() {
      entries.length = 0;
    },
  });
}

export function createRevisionCache({ capacity = 50 } = {}) {
  if (!Number.isInteger(capacity) || capacity < 1) {
    throw new TypeError("Revision cache capacity must be a positive integer.");
  }
  const entries = new Map();

  function readEntry(key, revision) {
    const entry = entries.get(key);
    if (!entry || !Object.is(entry.revision, revision)) {
      return { hit: false, value: undefined };
    }
    entries.delete(key);
    entries.set(key, entry);
    return { hit: true, value: entry.value };
  }

  function write(key, revision, value) {
    entries.delete(key);
    entries.set(key, { revision, value });
    while (entries.size > capacity) entries.delete(entries.keys().next().value);
    return value;
  }

  return Object.freeze({
    get(key, revision) {
      return readEntry(key, revision).value;
    },
    set: write,
    getOrCompute(key, revision, compute) {
      if (typeof compute !== "function") {
        throw new TypeError("Revision cache compute value must be a function.");
      }
      const cached = readEntry(key, revision);
      return cached.hit ? cached.value : write(key, revision, compute());
    },
    invalidate(key) {
      return key === undefined ? (entries.clear(), true) : entries.delete(key);
    },
    size() {
      return entries.size;
    },
  });
}

export function createTaskScheduler({
  schedule = (task) => queueMicrotask(task),
} = {}) {
  if (typeof schedule !== "function") {
    throw new TypeError("Task scheduler requires a scheduling function.");
  }
  const pending = new Map();
  let scheduled = false;

  function enqueue(name, task) {
    if (!name || typeof task !== "function") {
      throw new TypeError("Scheduled tasks require a name and function.");
    }
    pending.set(String(name), task);
    if (scheduled) return;
    scheduled = true;
    schedule(() => {
      const batch = [...pending.entries()];
      pending.clear();
      scheduled = false;
      for (const [, operation] of batch) operation();
    });
  }

  return Object.freeze({
    enqueue,
    pending() {
      return Object.freeze([...pending.keys()]);
    },
    cancel(name) {
      return pending.delete(String(name));
    },
  });
}
