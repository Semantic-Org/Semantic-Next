import { Dependency, Scheduler, Signal } from '@semantic-ui/reactivity';
import { UNWRAP } from '../../helpers.js';

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

  Per-key state is inlined as `values` and `deps`, both null-prototype
  objects. The per-key Dependency is allocated at setKey time, not
  lazily on first reactive read. Eager allocation keeps the RDC's hidden
  class stable from construction so V8's IC at the trap dispatch site
  sees one shape across all records. Null-prototype-object storage for
  `deps` (over Map) lets `target.deps[prop]` inline-cache like a plain
  property access; Map.get always pays a virtual call into the Map's
  get method.

  We deliberately do not allocate a full Signal per key: Signal wraps
  a Dependency. The wrapper allocation dominates at
  scale where many records each carry several keys. Equality dedup is
  preserved: `Signal.equality` is snapshotted at construction,
  matching Signal's per-instance snapshot semantics so the inlined
  dedup behaves identically to a Signal.set call on the same static.
  Late overrides of `Signal.equality` after the RDC is
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

  Proxy handler is module-scoped and stable across all instances. The
  Proxy's target IS the ReactiveDataContext (`this`); handler functions
  read instance state via `target.values` / `target.parent` /
  `target.keySetVersion` / `target.deps`. This keeps V8's hidden-class
  shape stable across all records, so the get-trap path can establish
  a monomorphic inline cache. Per-instance closure-captured handlers
  would split the shape per record and force polymorphic dispatch.

  As-mode per-FIELD isolation. {#each todo in todos} puts the whole item
  under one as-key. Without isolation, a binding reading proxy.todo.X
  would subscribe only to the per-key dep on 'todo' (because trapGet
  returns the raw item and the .X access is a plain property read), so
  in-place mutation of any field would re-fire every binding on the
  record. The fix routes the as-key read through an item-tracking proxy
  (ITEM_HANDLER + trapItemGet) whose .X access registers a per-FIELD
  Dependency keyed by field name in target.fieldDeps. Reconcile's
  as-mode object-item path fires notifyField per changed key after a
  snapshot diff, so only bindings that read the mutated field re-fire.

  For object items, trapGet skips the per-key dep registration on the
  as-key entirely. Reconcile never fires that dep on the as-mode object-
  item path (the refChanged branch writes values[asKey] directly and
  the same-ref branch routes through notifyField), so subscribing would
  attach a Reaction-side dep that cleans up and re-attaches per cycle
  without ever invalidating. Primitive items keep the per-key path
  because reconcile's catch-all `else if (refChanged)` branch fires
  setKey(asKey, primitive) when the value differs.

*/

const itemContextProxies = new WeakSet();

export function isItemContext(data) {
  return data != null && itemContextProxies.has(data);
}

// Bare-access subscribers register against this key in fieldDeps. Per
// access through the UNWRAP symbol — the consumer is taking the item
// out of the framework's tracking surface, so we have no per-FIELD
// information to subscribe to. notifyField also fires this dep so the
// binding wakes on any field mutation.
const BARE_ITEM_DEP = Symbol('sui:bare-item-dep');

function trapGet(target, prop) {
  if (typeof prop === 'symbol') { return target.parent[prop]; }
  const values = target.values;
  if (prop in values) {
    if (prop === target.asKey) {
      const item = values[prop];
      // Primitive / null items can't be proxied. The per-FIELD path is
      // a no-op for them (no fields to dispatch on); return raw and
      // register the per-key dep — it is the only wakeup channel for
      // primitive items (reconcile's `else if (refChanged)` branch
      // fires it via setKey when the value differs). The dep is lazy
      // here because setKey skips allocating it when the as-key value
      // is an object; a later object → primitive transition would
      // otherwise read through an undefined dep.
      if (item === null || typeof item !== 'object') {
        if (Scheduler.current) {
          let dep = target.deps[prop];
          if (dep === undefined) {
            dep = target.deps[prop] = new Dependency();
          }
          dep.depend();
        }
        return item;
      }
      // Object items go through the itemProxy. Per-FIELD deps registered
      // by the item-handler carry every wakeup; the per-key dep on the
      // as-key never fires for object items in this path, so subscribing
      // here would attach a Reaction-side dep that cleans up and
      // re-attaches per cycle without ever invalidating.
      if (target.itemProxy === null) {
        target.itemProxy = new Proxy({ rdc: target }, ITEM_HANDLER);
      }
      return target.itemProxy;
    }
    if (Scheduler.current) {
      target.deps[prop].depend();
    }
    return values[prop];
  }
  if (!target.keysSealed) { (target.keySetVersion ??= new Dependency()).depend(); }
  return target.parent[prop];
}

// Module-level handler shared across every RDC's item proxy. The proxy's
// target carries the RDC reference (`{ rdc }`) so traps reach the current
// values[asKey] without per-instance closures. Per-RDC factories allocated
// five closures (one per trap) at every record creation — measurable on
// large each-block mounts.
const ITEM_HANDLER = {
  get(target, prop) {
    const rdc = target.rdc;
    const item = rdc.values[rdc.asKey];
    if (prop === UNWRAP) {
      if (Scheduler.current) {
        let dep = rdc.fieldDeps[BARE_ITEM_DEP];
        if (dep === undefined) {
          dep = rdc.fieldDeps[BARE_ITEM_DEP] = new Dependency();
        }
        dep.depend();
      }
      return item;
    }
    if (typeof prop === 'symbol') {
      return item == null ? undefined : item[prop];
    }
    if (Scheduler.current) {
      let dep = rdc.fieldDeps[prop];
      if (dep === undefined) {
        dep = rdc.fieldDeps[prop] = new Dependency();
      }
      dep.depend();
    }
    return item == null ? undefined : item[prop];
  },
  has(target, prop) {
    const rdc = target.rdc;
    const item = rdc.values[rdc.asKey];
    return item != null && (prop in item);
  },
  ownKeys(target) {
    const rdc = target.rdc;
    const item = rdc.values[rdc.asKey];
    return item == null ? [] : Reflect.ownKeys(item);
  },
  getOwnPropertyDescriptor(target, prop) {
    const rdc = target.rdc;
    const item = rdc.values[rdc.asKey];
    if (item == null) { return undefined; }
    const desc = Object.getOwnPropertyDescriptor(item, prop);
    if (desc !== undefined) { desc.configurable = true; }
    return desc;
  },
  getPrototypeOf(target) {
    const rdc = target.rdc;
    const item = rdc.values[rdc.asKey];
    return item == null ? null : Object.getPrototypeOf(item);
  },
};

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

const HANDLER = {
  get: trapGet,
  has: trapHas,
  ownKeys: trapOwnKeys,
  getOwnPropertyDescriptor: trapGetOwnPropertyDescriptor,
};

export class ReactiveDataContext {
  constructor(parent, {
    registerItemContext = false,
    sealKeysAfterReplace = false,
    asKey = null,
  } = {}) {
    this.parent = parent;
    this.sealKeysAfterReplace = sealKeysAfterReplace;
    this.keysSealed = false;
    this.asKey = asKey;
    this.values = Object.create(null);
    this.deps = Object.create(null);
    // The per-FIELD machinery is only consumed when the as-key path
    // returns the item proxy. Spread mode and non-as-mode each blocks
    // never reach trapItemGet, so the fieldDeps map and item handler
    // are dead weight there. Inner Dependency instances on fieldDeps
    // are lazy — allocated on first reactive field read. The item
    // proxy wraps a per-RDC `{}` placeholder; traps delegate to the
    // current values[asKey] so the proxy ref is stable across item-
    // ref changes. The proxy itself is lazy — allocated on first
    // access of the as-key.
    this.fieldDeps = null;
    this.itemProxy = null;
    if (asKey !== null) {
      this.fieldDeps = Object.create(null);
    }
    // Snapshot Signal.equality at construction. Mirrors Signal's
    // own per-instance snapshot semantics — late overrides of the static
    // do not retroactively retarget already-constructed instances. If
    // userland breaks Signal.equality after this RDC is live,
    // both Signal and RDC fail the same way; no divergence.
    this.equality = Signal.equality;
    // Lazy: only a reader falling through on the unsealed path allocates it
    // (spread-mode late keys). as-mode reads run post-seal, so it stays null —
    // the per-row saving. A writer fires it only if a reader already created it
    // (a changed() on a never-subscribed dep was always a no-op).
    this.keySetVersion = null;
    this.proxy = new Proxy(this, HANDLER);

    if (registerItemContext) {
      itemContextProxies.add(this.proxy);
    }
  }

  setKey(key, value) {
    if (!(key in this.values)) {
      this.values[key] = value;
      // For object items under the as-key, trapGet returns the itemProxy
      // without subscribing to the per-key dep, so the Dependency would
      // never fire. Skip the allocation. Primitive as-key values and all
      // other keys keep the eager allocation — they're read through trapGet
      // directly and depend on this dep being present at first read.
      if (key !== this.asKey || value === null || typeof value !== 'object') {
        this.deps[key] = new Dependency();
      }
      if (!this.keysSealed && this.keySetVersion !== null) { this.keySetVersion.changed(); }
      return;
    }
    const old = this.values[key];
    if (this.equality(old, value)) { return; }
    this.values[key] = value;
    const dep = this.deps[key];
    if (dep !== undefined) { dep.changed(); }
  }

  notifyKey(key) {
    const dep = this.deps[key];
    if (dep !== undefined) { dep.changed(); }
  }

  // Restores fresh-record semantics for a key the item no longer carries:
  // reads fall through to the parent again instead of shadowing with a
  // stale value. Woken subscribers re-read via the fallthrough branch and
  // pick up keySetVersion, so a later re-add wakes them again.
  removeKey(key) {
    if (!(key in this.values)) { return; }
    delete this.values[key];
    const dep = this.deps[key];
    if (dep !== undefined) {
      delete this.deps[key];
      dep.changed();
    }
    if (!this.keysSealed && this.keySetVersion !== null) { this.keySetVersion.changed(); }
  }

  notifyField(fieldName) {
    if (this.fieldDeps === null) { return; }
    const dep = this.fieldDeps[fieldName];
    if (dep !== undefined) { dep.changed(); }
    const bareDep = this.fieldDeps[BARE_ITEM_DEP];
    if (bareDep !== undefined) { bareDep.changed(); }
  }

  // Full replacement: keys absent from nextValues are removed, not left
  // shadowing. Seed calls run against empty values so the sweep is free.
  replace(nextValues) {
    for (const key in this.values) {
      if (!(key in nextValues)) { this.removeKey(key); }
    }
    for (const key in nextValues) {
      this.setKey(key, nextValues[key]);
    }
    if (this.sealKeysAfterReplace) { this.keysSealed = true; }
  }

  dispose() {
    this.values = Object.create(null);
    this.deps = Object.create(null);
    if (this.fieldDeps !== null) { this.fieldDeps = Object.create(null); }
    this.itemProxy = null;
    this.keysSealed = false;
  }
}
