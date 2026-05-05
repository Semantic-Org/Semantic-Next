import { Dependency, Signal } from '@semantic-ui/reactivity';

/*

  ReactiveDataContext — a per-key reactive bag that reads like a plain
  object. Composes Signal + Proxy + a key-set Dependency to deliver
  fine-grained invalidation at the three data-context push sites that
  today collapse to coarse whole-context invalidation: {#each} per-item
  data, subtemplate reactiveData, and snippet args.

  The Proxy fronts a parent data object. Property reads first consult
  per-key Signals (registered deps); on miss they fall through to the
  parent. The keySetVersion Dependency catches the late-declared-key
  hazard: a reader that fell through to the parent for a key that did
  not yet exist as a per-key Signal must wake when the key arrives so
  it can subscribe to the new per-key Signal on its next run. Without
  this, a key authored later in an item's lifetime would silently never
  propagate to its readers.

  Per-key Signals are framework-internal — `allowClone: false` skips
  the clone-on-read path. Equality dedup stays at the default isEqual
  inherited from `Signal.equalityFunction`, so identical-value sets
  short-circuit through Signal.set's own gate without notifying.

  Closure-only readers (functions reading no per-key data) intentionally
  do not register any record-level "anything changed" Dependency. Today's
  whole-record proxy registers itemSignal on every property access — that
  is the coarseness this primitive exists to remove. Tests that assert
  closure bindings re-fire on item changes encode that coarseness as
  feature; surface them as findings, do not reintroduce a sibling
  Dependency to keep them passing.

  `writeToParent` mirrors per-key Signal values back into the underlying
  parent object on every setKey. The subtemplate adoption site needs this
  because user code captures the parent object by reference at
  createComponent time (e.g. `{ data }` destructured into a closure that
  reads `data.todo.completed` later) — those reads bypass the proxy and
  must see the current value. The each-block adoption site leaves it off:
  the parent there is the each-block's outer data context, shared across
  all sibling records, so writing per-record wrapper keys back into it
  would cross-contaminate siblings.

*/

const itemContextProxies = new WeakSet();

export function isItemContext(data) {
  return data != null && itemContextProxies.has(data);
}

export class ReactiveDataContext {
  constructor(parent, { registerItemContext = false, writeToParent = false } = {}) {
    this.parent = parent;
    this.writeToParent = writeToParent;
    this.signals = new Map();
    this.keySetVersion = new Dependency();

    const signals = this.signals;
    const keySetVersion = this.keySetVersion;

    this.proxy = new Proxy(parent, {
      get(target, prop) {
        if (typeof prop === 'symbol') { return target[prop]; }
        const signal = signals.get(prop);
        if (signal !== undefined) { return signal.value; }
        keySetVersion.depend();
        return target[prop];
      },
      set(target, prop, value) {
        // Route writes through the per-key Signal when one exists so blob
        // assignment paths (renderer.setData → assignInPlace → proxy[key] = v)
        // notify subscribers instead of silently bypassing the per-key layer.
        // Unknown keys default to writing the target — preserves the proxy
        // as a transparent overlay.
        const signal = signals.get(prop);
        if (signal !== undefined) {
          signal.set(value);
          return true;
        }
        target[prop] = value;
        return true;
      },
      has(target, prop) {
        return signals.has(prop) || (prop in target);
      },
      ownKeys(target) {
        const ownKeys = Reflect.ownKeys(target);
        const merged = [...signals.keys()];
        for (const key of ownKeys) {
          if (!signals.has(key)) { merged.push(key); }
        }
        return merged;
      },
      getOwnPropertyDescriptor(target, prop) {
        if (signals.has(prop)) {
          return {
            configurable: true,
            enumerable: true,
            value: signals.get(prop).peek(),
          };
        }
        return Object.getOwnPropertyDescriptor(target, prop);
      },
    });

    if (registerItemContext) {
      itemContextProxies.add(this.proxy);
    }
  }

  setKey(key, value) {
    let signal = this.signals.get(key);
    if (signal === undefined) {
      signal = new Signal(value, { allowClone: false });
      this.signals.set(key, signal);
      this.keySetVersion.changed();
    }
    else {
      signal.set(value);
    }
    if (this.writeToParent) {
      this.parent[key] = value;
    }
  }

  notifyKey(key) {
    const signal = this.signals.get(key);
    if (signal !== undefined) {
      signal.notify();
    }
  }

  replace(nextValues, { clearMissing = false } = {}) {
    for (const key in nextValues) {
      this.setKey(key, nextValues[key]);
    }
    if (clearMissing) {
      for (const key of this.signals.keys()) {
        if (!(key in nextValues)) { this.signals.get(key).set(undefined); }
      }
    }
  }

  has(key) {
    return this.signals.has(key);
  }

  keys() {
    return [...this.signals.keys()];
  }

  dispose() {
    this.signals.clear();
  }
}
