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

  Per-key state is inlined as `values` (a null-prototype object) plus
  `deps` (Map<key, Dependency>). Both are eager — the per-key Dependency
  is allocated at setKey time, not lazily on first reactive read. Eager
  allocation keeps the RDC's hidden class stable from construction
  (deps is always Map, never null), so V8's IC at the trap dispatch
  site sees one shape across all records.

  We deliberately do not allocate a full Signal per key: Signal wraps
  a Dependency with allowClone / equalityFunction / clone / currentValue
  field assignments per instance. The wrapper allocation dominates at
  scale where many records each carry several keys. Equality dedup is
  preserved: `Signal.equalityFunction` is snapshotted at construction,
  matching Signal's per-instance snapshot semantics so the inlined
  dedup behaves identically to a Signal.set call on the same static.
  Late overrides of `Signal.equalityFunction` after the RDC is
  constructed will not retroactively retarget — same blind spot Signal
  itself has.

  `values` uses Object.create(null) (not Map) because every record in a
  bench-todo / bench-krausest mount adds the same keys in the same
  order, letting V8 establish a stable hidden-class chain across all
  records. Plain-object property access (target.values[prop]) inline-
  caches at the call site once the shape is stable; Map.get always
  pays a virtual call into the Map's get method. The existence check
  uses (prop in target.values) — fast on null-prototype objects since
  no prototype-chain walk is needed.

  `sealKeysAfterReplace` declares that the value-key set is fixed
  after the seed replace() call. as-mode {#each todo in items} uses it
  because getEachData returns a fixed shape ({[as], [indexAs]}) — no
  key is ever added mid-life. When sealed, both keySetVersion.depend()
  (in trapGet's fallthrough branch) and keySetVersion.changed() (in
  setKey's new-key branch) are skipped. Avoids a per-fallthrough-read
  subscribe/cleanup on a Dep that can never fire — measurable wins on
  workloads where bindings read parent-context identifiers (helpers,
  parent state) through the each-record proxy. Spread-mode keeps the
  unsealed default because spread item shapes can gain keys.

  Closure-only readers (functions reading no per-key data) intentionally
  do not register any record-level "anything changed" Dependency. The
  whole-record-proxy alternative registers an item-level signal on every
  property access — that is the coarseness this primitive exists to
  remove.

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
  shape stable across all records, so the get-trap path can establish
  a monomorphic inline cache. Per-instance closure-captured handlers
  would split the shape per record and force polymorphic dispatch.

*/

const itemContextProxies = new WeakSet();

export function isItemContext(data) {
  return data != null && itemContextProxies.has(data);
}

function trapGet(target, prop) {
  if (typeof prop === 'symbol') { return target.parent[prop]; }
  const values = target.values;
  if (prop in values) {
    if (Scheduler.current) {
      target.deps.get(prop).depend();
    }
    return values[prop];
  }
  if (!target.keysSealed) { target.keySetVersion.depend(); }
  return target.parent[prop];
}

function trapHas(target, prop) {
  return (prop in target.values) || (prop in target.parent);
}

function trapOwnKeys(target) {
  const ownKeys = Reflect.ownKeys(target.parent);
  const merged = Object.keys(target.values);
  const values = target.values;
  for (const key of ownKeys) {
    if (!(key in values)) { merged.push(key); }
  }
  return merged;
}

function trapGetOwnPropertyDescriptor(target, prop) {
  if (prop in target.values) {
    return {
      configurable: true,
      enumerable: true,
      value: target.values[prop],
    };
  }
  return Object.getOwnPropertyDescriptor(target.parent, prop);
}

function trapSet(target, prop, value) {
  if (prop in target.values) {
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
  constructor(parent, {
    registerItemContext = false,
    writeToParent = false,
    sealKeysAfterReplace = false,
  } = {}) {
    this.parent = parent;
    this.writeToParent = writeToParent;
    this.sealKeysAfterReplace = sealKeysAfterReplace;
    this.keysSealed = false;
    this.values = Object.create(null);
    this.deps = new Map();
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
    if (!(key in this.values)) {
      this.values[key] = value;
      this.deps.set(key, new Dependency());
      if (this.writeToParent) { this.parent[key] = value; }
      if (!this.keysSealed) { this.keySetVersion.changed(); }
      return;
    }
    if (this.writeToParent) { this.parent[key] = value; }
    const old = this.values[key];
    if (this.equalityFunction(old, value)) { return; }
    this.values[key] = value;
    const dep = this.deps.get(key);
    if (dep !== undefined) { dep.changed(); }
  }

  notifyKey(key) {
    const dep = this.deps.get(key);
    if (dep !== undefined) { dep.changed(); }
  }

  replace(nextValues, { clearMissing = false } = {}) {
    for (const key in nextValues) {
      this.setKey(key, nextValues[key]);
    }
    if (clearMissing) {
      for (const key in this.values) {
        if (!(key in nextValues)) { this.setKey(key, undefined); }
      }
    }
    if (this.sealKeysAfterReplace) { this.keysSealed = true; }
  }

  has(key) {
    return key in this.values;
  }

  keys() {
    return Object.keys(this.values);
  }

  dispose() {
    this.values = Object.create(null);
    if (this.deps !== null) { this.deps.clear(); }
    this.keysSealed = false;
  }
}
