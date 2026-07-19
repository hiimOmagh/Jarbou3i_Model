/* Shared observable presentation state. Canonical analysis payloads stay untouched. */

const isObject = (value) => Boolean(value) && typeof value === "object";

export function createPlatformState(initialState = {}) {
  if (!isObject(initialState) || Array.isArray(initialState)) {
    throw new TypeError("Platform state must be initialized with an object.");
  }

  const target = { ...initialState };
  const subscribers = new Set();
  let revision = 0;
  let transactionDepth = 0;
  let pendingChange = null;

  const snapshot = () => Object.freeze({ ...target });

  function publish(change) {
    revision += 1;
    const event = Object.freeze({
      revision,
      reason: change.reason || "state-change",
      keys: Object.freeze([...change.keys]),
      state: snapshot(),
    });
    for (const subscriber of subscribers) subscriber(event);
  }

  function record(key, reason) {
    if (transactionDepth) {
      pendingChange ||= { keys: new Set(), reason };
      pendingChange.keys.add(key);
      pendingChange.reason ||= reason;
      return;
    }
    publish({ keys: new Set([key]), reason });
  }

  const state = new Proxy(target, {
    set(object, key, value) {
      if (Object.is(object[key], value)) return true;
      object[key] = value;
      record(String(key), "direct-update");
      return true;
    },
    deleteProperty() {
      throw new TypeError("Platform state keys cannot be deleted.");
    },
  });

  function patch(values, reason = "state-patch") {
    if (!isObject(values) || Array.isArray(values)) {
      throw new TypeError("Platform state patch must be an object.");
    }
    return transaction(() => {
      for (const [key, value] of Object.entries(values)) {
        if (Object.is(target[key], value)) continue;
        target[key] = value;
        record(key, reason);
      }
      return state;
    }, reason);
  }

  function transaction(operation, reason = "state-transaction") {
    if (typeof operation !== "function") {
      throw new TypeError("Platform state transaction requires a function.");
    }
    transactionDepth += 1;
    try {
      return operation(state);
    } finally {
      transactionDepth -= 1;
      if (!transactionDepth && pendingChange) {
        const change = pendingChange;
        pendingChange = null;
        change.reason ||= reason;
        publish(change);
      }
    }
  }

  return Object.freeze({
    state,
    patch,
    transaction,
    snapshot,
    revision() {
      return revision;
    },
    subscribe(subscriber) {
      if (typeof subscriber !== "function") {
        throw new TypeError("Platform state subscriber must be a function.");
      }
      subscribers.add(subscriber);
      return () => subscribers.delete(subscriber);
    },
  });
}

