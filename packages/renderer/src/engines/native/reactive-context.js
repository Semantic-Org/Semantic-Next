import { Dependency, Scheduler, Signal } from '@semantic-ui/reactivity';

/*

  ReactiveDataContext — a per-key reactive bag that reads like a plain
  object. Composes raw Dependencies + a key-set Dependency to deliver
  fine-grained invalidation at the three data-context push sites that
  today collapse to coarse whole-context invalidation: {#each} per-item
  data, subtemplate reactiveData, and snippet args.

  The Proxy fronts a parent data object. Property reads first consult
  per-key values (registering a per-key Dependency on the active
  Reaction); on miss they fall through to the parent. The keySetVersion
  Dependency catches the late-declared-key hazard: a reader that fell
  through to the parent for a key that did not yet exist must wake when
  the key arrives so it can subscribe to the new per-key Dependency on
  its next run. Without this, a key authored later in an item's lifetime
  would silently never propagate to its readers.

  Per-key state is inlined as `values` (Map<key, value>) plus a lazily
  allocated `deps` (Map<key, Dependency>). Each per-key Dependency is
  what readers actually subscribe to. We deliberately do not allocate a
  full Signal per key: Signal wraps a Dependency with allowClone /
  equalityFunction / clone / currentValue field assignments per
  instance. At 1000+ records × 5 keys the wrapper allocation dominates.
  Equality dedup is preserved: `Signal.equalityFunction` is snapshotted
  at construction, matching Signal's per-instance snapshot semantics so
  the inlined dedup behaves identically to a Signal.set call on the same
  static. Late overrides of `Signal.equalityFunction` after the RDC is
  constructed will not retroactively retarget — same blind spot Signal
  itself has.

  Closure-only readers (functions reading no per-key data) intentionally
  do not register any record-level "anything changed" Dependency. Today's
  whole-record proxy registers itemSignal on every property access — that
  is the coarseness this primitive exists to remove. Tests that assert
  closure bindings re-fire on item changes encode that coarseness as
  feature; surface them as findings, do not reintroduce a sibling
  Dependency to keep them passing.

  `writeToParent` mirrors per-key values back into the underlying parent
  object on every setKey. The subtemplate adoption site needs this
  because user code captures the parent object by reference at
  createComponent time (e.g. `{ data }` destructured into a closure that
  reads `data.todo.completed` later) — those reads bypass the proxy and
  must see the current value. The each-block adoption site leaves it off:
  the parent there is the each-block's outer data context, shared across
  all sibling records, so writing per-record wrapper keys back into it
  would cross-contaminate siblings.

  Proxy handler is module-scoped and stable across all instances. The
  Proxy's target IS the ReactiveDataContext (`this`); handler functions
  read instance state via `target.values` / `target.parent` /
  `target.keySetVersion` / `target.deps`. This keeps V8's hidden-class
  shape stable across the 1000+ records that mount benches construct, so
  the get-trap path can establish a monomorphic inline cache. With
  per-instance closure-captured handlers, V8 sees a fresh shape per
  record and falls back to polymorphic dispatch.

*/

const itemContextProxies = new WeakSet();

export function isItemContext(data) {
  return data != null && itemContextProxies.has(data);
}

function trapGet(target, prop) {
  if (typeof prop === 'symbol') { return target.parent[prop]; }
  if (target.values.has(prop)) {
    if (Scheduler.current) {
      let deps = target.deps;
      if (deps === null) {
        deps = new Map();
        target.deps = deps;
      }
      let dep = deps.get(prop);
      if (dep === undefined) {
        dep = new Dependency();
        deps.set(prop, dep);
      }
      dep.depend();
    }
    return target.values.get(prop);
  }
  target.keySetVersion.depend();
  return target.parent[prop];
}

function trapHas(target, prop) {
  return target.values.has(prop) || (prop in target.parent);
}

function trapOwnKeys(target) {
  const ownKeys = Reflect.ownKeys(target.parent);
  const merged = [...target.values.keys()];
  for (const key of ownKeys) {
    if (!target.values.has(key)) { merged.push(key); }
  }
  return merged;
}

function trapGetOwnPropertyDescriptor(target, prop) {
  if (target.values.has(prop)) {
    return {
      configurable: true,
      enumerable: true,
      value: target.values.get(prop),
    };
  }
  return Object.getOwnPropertyDescriptor(target.parent, prop);
}

function trapSet(target, prop, value) {
  if (target.values.has(prop)) {
    target.setKey(prop, value);
    return true;
  }
  target.parent[prop] = value;
  return true;
}

const HANDLER_RO = {
  get: trapGet,
  has: trapHas,
  ownKeys: trapOwnKeys,
  getOwnPropertyDescriptor: trapGetOwnPropertyDescriptor,
};

const HANDLER_RW = {
  get: trapGet,
  has: trapHas,
  ownKeys: trapOwnKeys,
  getOwnPropertyDescriptor: trapGetOwnPropertyDescriptor,
  set: trapSet,
};

export class ReactiveDataContext {
  constructor(parent, { registerItemContext = false, writeToParent = false } = {}) {
    this.parent = parent;
    this.writeToParent = writeToParent;
    this.values = new Map();
    this.deps = null;
    // Snapshot Signal.equalityFunction at construction. Mirrors Signal's
    // own per-instance snapshot semantics — late overrides of the static
    // do not retroactively retarget already-constructed instances. If
    // userland breaks Signal.equalityFunction after this RDC is live,
    // both Signal and RDC fail the same way; no divergence.
    this.equalityFunction = Signal.equalityFunction;
    this.keySetVersion = new Dependency();
    this.proxy = new Proxy(this, writeToParent ? HANDLER_RW : HANDLER_RO);

    if (registerItemContext) {
      itemContextProxies.add(this.proxy);
    }
  }

  setKey(key, value) {
    if (!this.values.has(key)) {
      this.values.set(key, value);
      if (this.writeToParent) { this.parent[key] = value; }
      this.keySetVersion.changed();
      return;
    }
    if (this.writeToParent) { this.parent[key] = value; }
    const old = this.values.get(key);
    if (this.equalityFunction(old, value)) { return; }
    this.values.set(key, value);
    if (this.deps !== null) {
      const dep = this.deps.get(key);
      if (dep !== undefined) { dep.changed(); }
    }
  }

  notifyKey(key) {
    if (this.deps === null) { return; }
    const dep = this.deps.get(key);
    if (dep !== undefined) { dep.changed(); }
  }

  replace(nextValues, { clearMissing = false } = {}) {
    for (const key in nextValues) {
      this.setKey(key, nextValues[key]);
    }
    if (clearMissing) {
      for (const key of this.values.keys()) {
        if (!(key in nextValues)) { this.setKey(key, undefined); }
      }
    }
  }

  has(key) {
    return this.values.has(key);
  }

  keys() {
    return [...this.values.keys()];
  }

  dispose() {
    this.values.clear();
    if (this.deps !== null) { this.deps.clear(); }
  }
}
