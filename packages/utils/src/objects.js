import { clone } from './cloning.js';
import { isEqual } from './equality.js';
import { configured } from './functions.js';
import { each } from './loops.js';
import { escapeRegExp } from './regexp.js';
import { isArray, isMap, isObject, isPlainObject, isSet, isString } from './types.js';

/*-------------------
       Objects
--------------------*/

/*
  Return keys from object
*/
export const keys = (obj) => {
  if (isObject(obj)) {
    return Object.keys(obj);
  }
};

export const values = (obj) => {
  if (isObject(obj)) {
    return Object.values(obj);
  }
};

export const filterObject = (obj, callback) => {
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([key, value]) => callback(value, key)),
  );
};

export const mapObject = (obj, callback) => {
  return Object.fromEntries(
    Object.entries(obj)
      .map(([key, value]) => [key, callback(value, key)]),
  );
};

const isTrackable = (value) => isArray(value) || isPlainObject(value);

// counting stops at the budget, so a cycle just burns it down and lands on
// the proxy strategy, which handles cycles anyway
const spendBudget = (value, remaining) => {
  if (remaining < 0 || value === null || typeof value !== 'object') {
    return remaining;
  }
  // arrays count by length so a large list never allocates its key strings
  // just to overrun the budget
  if (isArray(value)) {
    remaining -= value.length;
    for (let i = 0; remaining >= 0 && i < value.length; i++) {
      remaining = spendBudget(value[i], remaining);
    }
  }
  else if (isPlainObject(value)) {
    const valueKeys = Object.keys(value);
    remaining -= valueKeys.length;
    for (let i = 0; remaining >= 0 && i < valueKeys.length; i++) {
      remaining = spendBudget(value[valueKeys[i]], remaining);
    }
  }
  else if (isMap(value) || isSet(value)) {
    // entry contents stay unwalked, size alone signals the snapshot cost
    remaining -= value.size;
  }
  return remaining;
};

// snapshots stay imperceptible well past this, but mutate can run in loops so
// the ceiling is conservative
const autoBudget = 512;
const overBudget = (value) => spendBudget(value, autoBudget) < 0;

/*
  Structural diff from before to after. Reports dot paths grouped as added
  (in after only), removed (in before only), and changed. Arrays diff by index,
  values that can't be walked (Map/Set/Date/class instances) compare by deep
  equality and report their own path. A wholesale change to a non-container
  root reports path '' (the RFC 6902 root convention).
*/
// the identity fields a keyed array element is matched on, first present wins —
// identity of an array element, shared by every keyed helper, vocabulary adjustable at boot
export const elementKey = /* @__PURE__ */ configured(
  (item, keys = elementKey.config.keys) => {
    if (!isObject(item)) {
      return undefined;
    }
    // fast track the default vocabulary, a static chain instead of the field loop
    if (keys.length === 4 && keys[0] === 'id' && keys[1] === '_id' && keys[2] === 'hash' && keys[3] === 'key') {
      return item.id ?? item._id ?? item.hash ?? item.key;
    }
    for (const field of keys) {
      if (item[field] != null) {
        return item[field];
      }
    }
    return undefined;
  },
  { keys: ['id', '_id', 'hash', 'key'] },
);

// resolve a keyed array segment to a live index, -1 if absent. identity compares
// String-coerced because the path carries a string and ids may be number or string
const findKeyed = (array, keyValue, keys = elementKey.config.keys) => {
  if (!isArray(array)) {
    return -1;
  }
  for (let i = 0; i < array.length; i++) {
    const id = elementKey(array[i], keys);
    if (id != null && String(id) === keyValue) {
      return i;
    }
  }
  return -1;
};

// a key value can ride the dot-bracket path grammar only when it carries no
// . [ ] and no leading # (which marks a keyed selector). shared by the keyed
// diff and the keyed read paths so an emitted path always parses back through get
const HAS_PATH_SYNTAX = /[.[\]]/;
const isKeyedPathSafe = (keyValue) => !HAS_PATH_SYNTAX.test(keyValue) && keyValue.charCodeAt(0) !== 35;

// an element's identity spelled for a path, null when the element is unkeyed
// or its key can't ride the grammar
const keyValueFrom = (element, keys) => {
  const id = elementKey(element, keys);
  if (id == null) {
    return null;
  }
  const keyValue = String(id);
  return isKeyedPathSafe(keyValue) ? keyValue : null;
};

// index a keyed array by stringified identity for set-wise diffing. returns null
// (caller falls back to the positional walk) when an element is unkeyed, two share
// a key, or a key value can't ride the dot-bracket path grammar — so detectChanges
// never emits a keyed path get/set/unset can't parse
const keyedMap = (array, keys) => {
  const map = new Map();
  for (const item of array) {
    const keyValue = keyValueFrom(item, keys);
    if (keyValue === null || map.has(keyValue)) {
      return null;
    }
    map.set(keyValue, item);
  }
  return map;
};

export const detectChanges = (before, after, {
  keyed = true,
  keys = elementKey.config.keys,
  equality = isEqual,
  ignoreKeys = null,
  collapseKeys = null,
} = {}) => {
  const added = [];
  const removed = [];
  const changed = [];
  const seen = new WeakSet(); // cycle guard, each before-node diffs once
  const ignoreSet = ignoreKeys ? new Set(ignoreKeys) : null;
  const collapseSet = collapseKeys ? new Set(collapseKeys) : null;

  const walk = (a, b, prefix) => {
    if (seen.has(a)) {
      return;
    }
    seen.add(a);
    // keyed arrays diff as sets on element identity, so an insert or reorder is an
    // add/remove of one element by key, not a positional cascade of id rewrites.
    // emits the field[#key] form get/set/unset apply; falls back to the positional
    // walk below when an array isn't cleanly keyed (keyedMap returns null)
    if (keyed && isArray(a) && isArray(b)) {
      const mapA = keyedMap(a, keys);
      const mapB = keyedMap(b, keys);
      if (mapA && mapB) {
        for (const [keyValue, itemA] of mapA) {
          const path = `${prefix}[#${keyValue}]`;
          if (!mapB.has(keyValue)) {
            removed.push(path);
            continue;
          }
          const itemB = mapB.get(keyValue);
          if (Object.is(itemA, itemB)) {
            continue;
          }
          if (isTrackable(itemA) && isTrackable(itemB) && isArray(itemA) === isArray(itemB)) {
            walk(itemA, itemB, path);
          }
          else if (!equality(itemA, itemB)) {
            changed.push(path);
          }
        }
        for (const [keyValue] of mapB) {
          if (!mapA.has(keyValue)) {
            added.push(`${prefix}[#${keyValue}]`);
          }
        }
        return;
      }
    }
    for (const key of Object.keys(a)) {
      if (ignoreSet?.has(key)) {
        continue;
      }
      const path = prefix === '' ? key : `${prefix}.${key}`;
      if (!Object.hasOwn(b, key)) {
        removed.push(path);
        continue;
      }
      const valueA = a[key];
      const valueB = b[key];
      if (Object.is(valueA, valueB)) {
        continue;
      }
      // a collapsed key is diffed as one whole value, never descended into, the
      // same leaf treatment a Map/Date already gets. lets a subtree whose own keys
      // aren't path-addressable report the key itself instead of nested paths
      if (
        !collapseSet?.has(key)
        && isTrackable(valueA) && isTrackable(valueB) && isArray(valueA) === isArray(valueB)
      ) {
        walk(valueA, valueB, path);
      }
      else if (!equality(valueA, valueB)) {
        changed.push(path);
      }
    }
    for (const key of Object.keys(b)) {
      if (ignoreSet?.has(key)) {
        continue;
      }
      if (!Object.hasOwn(a, key)) {
        added.push(prefix === '' ? key : `${prefix}.${key}`);
      }
    }
  };

  if (isTrackable(before) && isTrackable(after) && isArray(before) === isArray(after)) {
    walk(before, after, '');
  }
  else if (!equality(before, after)) {
    changed.push('');
  }
  return { added, removed, changed };
};

// a recorded parent subsumes its children regardless of write order — syncing
// 'a' covers 'a.b', and path-conflict stores (mongo) reject both in one update
const pruneChildPaths = (pathLog) => {
  const pruned = [];
  for (const path of pathLog) {
    let parent = path;
    let covered = false;
    let dotIndex;
    while ((dotIndex = parent.lastIndexOf('.')) !== -1) {
      parent = parent.slice(0, dotIndex);
      if (pathLog.has(parent)) {
        covered = true;
        break;
      }
    }
    if (!covered) {
      pruned.push(path);
    }
  }
  return pruned;
};

// the read mirror of pruneChildPaths: a deeper read subsumes its ancestors.
// reading todos[#a].complete makes a bare todos[#a] or todos read redundant,
// since a write to an ancestor already covers the descendant by prefix
const pruneAncestorPaths = (pathLog) => {
  const hasDescendant = new Set();
  for (const path of pathLog) {
    // walk up each segment boundary — '.' for keys, '[' for keyed elements
    let cut = path.length;
    while (cut > 0) {
      cut = Math.max(path.lastIndexOf('.', cut - 1), path.lastIndexOf('[', cut - 1));
      if (cut <= 0) {
        break;
      }
      hasDescendant.add(path.slice(0, cut));
    }
  }
  const pruned = [];
  for (const path of pathLog) {
    if (!hasDescendant.has(path)) {
      pruned.push(path);
    }
  }
  return pruned;
};

// both trackers swap any tracked wrapper for its raw object, scanning fresh
// containers (a spread, a filter result) for wrappers smuggled inside, so the
// raw graph never stores one. safe after expiry: it reads raw lookups and
// fresh containers, never a wrapper's properties
const createUnwrap = (wrapped, rawOf) => {
  const unwrapDeep = (value, seen) => {
    const raw = rawOf.get(value);
    if (raw !== undefined) {
      return raw;
    }
    // objects already in the graph are kept clean by this very scan
    if (!isTrackable(value) || wrapped.has(value) || seen?.has(value)) {
      return value;
    }
    (seen ??= new Set()).add(value);
    for (const key of Object.keys(value)) {
      const child = value[key];
      if (child !== null && typeof child === 'object') {
        const unwrapped = unwrapDeep(child, seen);
        if (unwrapped !== child) {
          value[key] = unwrapped;
        }
      }
    }
    return value;
  };
  return unwrapDeep;
};

/*
  Run callback against value, report whether it changed it. 'auto' snapshots
  small values (clone + deep-compare, callback sees the real object) and
  write-tracks large ones through a proxy so cost scales with writes, not size.

  Paths are id-addressed for keyed arrays by default (todos[#id].complete), the
  same convention as detectChanges — so `each(items, item => item.x = 1)` reads
  back as per-record writes, not array indices. Keyed paths come from the
  snapshot diff, so requesting them forces the snapshot strategy; the proxy
  strategy (explicit, or implied by onWrite) only ever sees the index a write went
  through, so its paths stay positional. Opt out with `keyed: false` where the
  proxy's no-clone behaviour on a large value matters more than id-addressing.
*/
export const trackWrites = (value, callback, {
  strategy = 'auto',
  onWrite,
  returnPaths = true,
  keyed = true,
  keys = elementKey.config.keys,
  clone: cloneFunction = clone,
  equality = isEqual,
} = {}) => {
  // keyed paths are produced by the snapshot diff, so when they are actually
  // wanted the auto size-heuristic yields to snapshot. an explicit proxy strategy
  // or an onWrite stream still wins, and its paths are positional by construction
  const useProxy = (strategy === 'proxy'
    || (strategy === 'auto' && (onWrite !== undefined || (overBudget(value) && !(keyed && returnPaths)))))
    && isTrackable(value)
    && !Object.isFrozen(value);

  if (!useProxy) {
    const before = cloneFunction(value);
    const result = callback(value);
    if (!returnPaths) {
      return { changed: !equality(before, value), result };
    }
    const diff = detectChanges(before, value, { keyed, keys, equality });
    const paths = [...diff.added, ...diff.changed, ...diff.removed];
    return { changed: paths.length > 0, result, paths };
  }

  let written = false;
  let expired = false;
  let snapshots = null; // exotic -> before clone, for objects the proxy can't observe
  const wrapped = new WeakMap(); // raw -> proxy, for identity and cycles
  const rawOf = new WeakMap(); // proxy -> raw, to unwrap on write-back
  const paths = (onWrite || returnPaths) ? new WeakMap() : null; // raw -> key path from root
  const pathLog = returnPaths ? new Set() : null; // dot-joined, insertion order

  const expiredError = () =>
    new Error(
      'trackWrites: tracked value used after its callback returned. Reads and writes are only valid inside the callback.',
    );

  // snapshot each exotic at most once, and not at all once a write has already
  // answered the change question. functions are excluded by the typeof check,
  // so reading an array method off the proxy doesn't trigger a snapshot
  const reportExotic = (exotic) => {
    if (written || exotic === null || typeof exotic !== 'object') {
      return;
    }
    snapshots ??= new Map();
    if (!snapshots.has(exotic)) {
      snapshots.set(exotic, cloneFunction(exotic));
    }
  };

  const markWrite = (object, key) => {
    written = true;
    if (paths === null) {
      return;
    }
    const path = [...paths.get(object), key];
    // a symbol segment has no dot-path form, it still counts as a write above
    if (pathLog && !path.some((segment) => typeof segment === 'symbol')) {
      pathLog.add(path.join('.'));
    }
    onWrite?.(path, object, key);
  };

  const unwrapDeep = createUnwrap(wrapped, rawOf);

  const handler = {
    get(object, key) {
      if (expired) {
        throw expiredError();
      }
      const value = object[key];
      if (!isTrackable(value)) {
        reportExotic(value);
        return value;
      }
      return wrap(value, object, key);
    },
    set(object, key, value) {
      if (expired) {
        throw expiredError();
      }
      if (value !== null && typeof value === 'object') {
        value = unwrapDeep(value);
      }
      // a brand-new own key is a write even when its value is undefined
      const changed = !Object.hasOwn(object, key) || !Object.is(object[key], value);
      object[key] = value;
      if (changed) {
        markWrite(object, key);
      }
      return true;
    },
    deleteProperty(object, key) {
      if (expired) {
        throw expiredError();
      }
      // hasOwn, not `in`: delete only removes own keys, so deleting an inherited
      // key is a no-op, not a write
      const existed = Object.hasOwn(object, key);
      delete object[key];
      if (existed) {
        markWrite(object, key);
      }
      return true;
    },
    defineProperty(object, key, descriptor) {
      if (expired) {
        throw expiredError();
      }
      if (descriptor.value !== null && typeof descriptor.value === 'object') {
        descriptor.value = unwrapDeep(descriptor.value);
      }
      // mirror set/delete: redefining a property to its current value isn't a write
      const changed = !Object.hasOwn(object, key)
        || !('value' in descriptor)
        || !Object.is(object[key], descriptor.value);
      Object.defineProperty(object, key, descriptor);
      if (changed) {
        markWrite(object, key);
      }
      return true;
    },
  };

  const wrap = (object, parent, key) => {
    let proxy = wrapped.get(object);
    if (proxy === undefined) {
      // a frozen object can't be wrapped without tripping the proxy invariant
      // on its non-configurable properties, so it passes through raw like an
      // exotic and changes inside it are caught by snapshot. a lone
      // non-writable+non-configurable object property on an unfrozen parent
      // is unsupported and would throw on read
      if (Object.isFrozen(object)) {
        reportExotic(object);
        wrapped.set(object, object);
        return object;
      }
      proxy = new Proxy(object, handler);
      wrapped.set(object, proxy);
      rawOf.set(proxy, object);
      if (paths) {
        paths.set(object, parent === undefined ? [] : [...paths.get(parent), key]);
      }
    }
    return proxy;
  };

  let result;
  try {
    result = callback(wrap(value));
  }
  finally {
    expired = true;
  }
  if (result !== null && typeof result === 'object') {
    result = unwrapDeep(result);
  }

  let changed = written;
  if (!changed && snapshots) {
    for (const [exotic, before] of snapshots) {
      if (!equality(before, exotic)) {
        changed = true;
        break;
      }
    }
  }
  if (pathLog) {
    return { changed, result, paths: pruneChildPaths(pathLog) };
  }
  return { changed, result };
};

/*
  Run callback against value, report which paths it READ. The read companion to
  trackWrites: where trackWrites answers "what did this change", trackReads
  answers "what did this depend on". A reactive system collects a computed's
  dependencies as it runs, a memoizer derives a cache key from the values it
  touched, an auditor checks least-privilege access, a prefetcher learns what to
  warm.

  Reads are observable only through a proxy — there is no before/after to diff,
  so unlike trackWrites there is no snapshot strategy. The value is wrapped
  read-only: the callback may read any depth, but a write through the wrapper
  throws, so the input is never mutated (and a computed stays honest). Reads are
  only valid inside the callback; a wrapper used after it returns throws.

  Two kinds of dependency come back, kept apart because they invalidate on
  different writes:
    reads     — value paths (todos[#id].complete). Re-run when that value
                changes. Pairs with detectChanges `changed`.
    structure — container paths whose shape was read: an array's `.length`,
                iteration, spread, or Object.keys. Re-run when the container
                grows, shrinks, or re-keys. Pairs with detectChanges
                `added`/`removed`. A value-only tracker misses array growth
                because reading `.length` leaves no value path behind, which is
                why structure is a first-class result, not folded into reads.

  Reading a method (`.reduce`) is not itself a dependency — the property reads it
  then performs are. An exotic (Date/Map/Set/RegExp) is a single read with no
  recursion into its internals. Keyed arrays id-address by default
  (todos[#id].complete), the same convention as trackWrites and detectChanges, so
  a read dependency matches a write to the same record and survives a reorder.
  trackWrites gets keyed paths from its snapshot and leaves its proxy positional;
  trackReads has no snapshot, so it resolves identity in the proxy itself.
*/
export const trackReads = (value, callback, {
  onRead,
  returnPaths = true,
  keyed = true,
  keys = elementKey.config.keys,
} = {}) => {
  // a non-container has no paths to read, and a frozen tree is immutable so it
  // has no dependencies worth tracking (a proxy also can't stand in for its
  // non-writable, non-configurable properties). either way, just run it.
  if (!isTrackable(value) || Object.isFrozen(value)) {
    const result = callback(value);
    return returnPaths ? { reads: [], structure: [], result } : { result };
  }

  let expired = false;
  const wrapped = new WeakMap(); // raw -> proxy, for identity and cycles
  const rawOf = new WeakMap(); // proxy -> raw, to unwrap the result
  const paths = (onRead || returnPaths) ? new WeakMap() : null; // raw -> path string from root
  const readLog = returnPaths ? new Set() : null; // value paths
  const structureLog = returnPaths ? new Set() : null; // container shape paths

  const expiredError = () =>
    new Error(
      'trackReads: tracked value used after its callback returned. Reads are only valid inside the callback.',
    );
  const readonlyError = () => new Error('trackReads: tracked value is read-only, the callback must not mutate it.');

  // path of object[key], id-addressed when object is a keyed array so a read
  // dependency matches the write side and survives a reorder
  const childPath = (parentPath, parent, key, childValue) => {
    if (keyed && isArray(parent)) {
      const keyValue = keyValueFrom(childValue, keys);
      if (keyValue !== null) {
        return `${parentPath}[#${keyValue}]`;
      }
    }
    return parentPath === '' ? String(key) : `${parentPath}.${String(key)}`;
  };

  const recordRead = (object, key, childValue, type) => {
    if (paths === null) {
      return;
    }
    const parentPath = paths.get(object);
    // `in` checks a literal key, never an identity, so it stays positional
    const path = type === 'has'
      ? (parentPath === '' ? String(key) : `${parentPath}.${String(key)}`)
      : childPath(parentPath, object, key, childValue);
    readLog?.add(path);
    onRead?.(path, type, object, key);
  };

  const recordStructure = (object) => {
    if (paths === null) {
      return;
    }
    const path = paths.get(object);
    structureLog?.add(path);
    onRead?.(path, 'structure', object, undefined);
  };

  const unwrapDeep = createUnwrap(wrapped, rawOf);

  const handler = {
    get(object, key) {
      if (expired) {
        throw expiredError();
      }
      const value = object[key];
      // an array's length is a structural read: it answers "how long" not
      // "what's at N", and iteration/spread/most array methods route through it
      if (isArray(object) && key === 'length') {
        recordStructure(object);
        return value;
      }
      // a symbol key has no dot-path form (Symbol.iterator etc.); pass it
      // through untracked — the length and index reads it drives are tracked
      if (typeof key === 'symbol') {
        return value;
      }
      // reading a method is not a dependency; the reads it performs (via `this`
      // being the wrapper) are tracked as they happen
      if (typeof value === 'function') {
        return value;
      }
      recordRead(object, key, value, 'value');
      // descend into containers; an exotic or primitive is a single read with no
      // recursion. a frozen child is immutable, so it has no further
      // dependencies and a proxy can't stand in for it
      if (isTrackable(value) && !Object.isFrozen(value)) {
        return wrap(value, object, key);
      }
      return value;
    },
    has(object, key) {
      if (expired) {
        throw expiredError();
      }
      // `'x' in obj` depends on whether obj.x exists, which a value path on
      // obj.x captures already (undefined <-> defined is a value change). skip
      // arrays: their built-in methods probe each index with HasProperty for
      // sparse-hole handling, which is machinery, not a user dependency
      if (!isArray(object)) {
        recordRead(object, key, undefined, 'has');
      }
      return Reflect.has(object, key);
    },
    ownKeys(object) {
      if (expired) {
        throw expiredError();
      }
      // Object.keys / spread / for...in read the key set: a structural dependency
      recordStructure(object);
      return Reflect.ownKeys(object);
    },
    set() {
      throw expired ? expiredError() : readonlyError();
    },
    deleteProperty() {
      throw expired ? expiredError() : readonlyError();
    },
    defineProperty() {
      throw expired ? expiredError() : readonlyError();
    },
  };

  const wrap = (object, parent, key) => {
    let proxy = wrapped.get(object);
    if (proxy === undefined) {
      proxy = new Proxy(object, handler);
      wrapped.set(object, proxy);
      rawOf.set(proxy, object);
      if (paths) {
        paths.set(
          object,
          parent === undefined ? '' : childPath(paths.get(parent), parent, key, object),
        );
      }
    }
    return proxy;
  };

  let result;
  try {
    result = callback(wrap(value));
  }
  finally {
    expired = true;
  }
  if (result !== null && typeof result === 'object') {
    result = unwrapDeep(result);
  }

  if (!returnPaths) {
    return { result };
  }
  return { reads: pruneAncestorPaths(readLog), structure: [...structureLog], result };
};

/*
  Shallow-merge sources into target. Preserves source accessors (unlike
  Object.assign, which snapshots getter values) and preserves target
  extensibility (a frozen/sealed source does not lock down target props).
*/
export const extend = (obj, ...sources) => {
  sources.forEach((source) => {
    if (source) {
      for (const prop in source) {
        const desc = Object.getOwnPropertyDescriptor(source, prop);
        if (desc?.get || desc?.set) {
          Object.defineProperty(obj, prop, desc);
        }
        else if (prop in obj) {
          // Existing target prop may be accessor from a prior source
          Object.defineProperty(obj, prop, {
            value: source[prop],
            writable: true,
            enumerable: true,
            configurable: true,
          });
        }
        else {
          obj[prop] = source[prop];
        }
      }
    }
  });
  return obj;
};

const deepExtendDefaults = { preserveNonCloneable: true, preserveDOM: true };

export const deepExtend = (target, ...args) => {
  if (!isObject(target)) {
    return target;
  }

  // Detect options in the last argument once at the entry point
  const lastArg = args[args.length - 1];
  const hasOptions = lastArg?.preserveNonCloneable !== undefined || lastArg?.preserveDOM !== undefined;
  const options = hasOptions ? { ...deepExtendDefaults, ...lastArg } : deepExtendDefaults;
  const sources = hasOptions ? args.slice(0, -1) : args;

  for (let i = 0; i < sources.length; i++) {
    deepMerge(target, sources[i], options);
  }
  return target;
};

const deepMerge = (target, source, options) => {
  if (!isPlainObject(source)) {
    return;
  }

  const sourceKeys = Object.keys(source);
  for (let i = 0; i < sourceKeys.length; i++) {
    const key = sourceKeys[i];

    // Skip __proto__ for security
    if (key === '__proto__') {
      continue;
    }

    const val = source[key];
    const src = target[key];

    // Recursion prevention
    if (val === target) {
      continue;
    }

    // If new value isn't a plain object, clone and assign
    if (!isPlainObject(val)) {
      target[key] = clone(val, options);
      continue;
    }

    // If target property doesn't exist or isn't a plain object,
    // create new object and deep extend
    if (!isPlainObject(src)) {
      const newObj = {};
      deepMerge(newObj, val, options);
      target[key] = newObj;
      continue;
    }

    // Both are plain objects, extend recursively
    deepMerge(src, val, options);
  }
};

// Cached own-getter keys per target — `getOwnPropertyDescriptor`
// allocates a descriptor object per key just to read `.get`.
const getterKeysCache = new WeakMap();

function getOwnGetterKeys(target) {
  let keys = getterKeysCache.get(target);
  if (keys !== undefined) { return keys; }
  keys = null;
  const ownKeys = Object.keys(target);
  for (let i = 0; i < ownKeys.length; i++) {
    const key = ownKeys[i];
    const desc = Object.getOwnPropertyDescriptor(target, key);
    if (desc && desc.get) {
      if (keys === null) { keys = new Set(); }
      keys.add(key);
    }
  }
  getterKeysCache.set(target, keys);
  return keys;
}

export const assignInPlace = (target, source, {
  preserveExistingKeys = false,
  preserveGetters = false,
  returnChanged = false,
} = {}) => {
  let changed = false;
  const ownGetters = preserveGetters ? getOwnGetterKeys(target) : null;
  if (!preserveExistingKeys) {
    if (preserveGetters) {
      // Own keys only — a `for...in` walk on a prototype-chained target
      // would attempt `delete` on inherited keys (no-op), and that delete
      // attempt deopts V8's hidden class for the target. The own-only
      // path also matches the descriptor check's contract: getter
      // descriptors are an own-property concept.
      const ownKeys = Object.keys(target);
      for (let i = 0; i < ownKeys.length; i++) {
        const key = ownKeys[i];
        if (!(key in source)) {
          if (ownGetters !== null && ownGetters.has(key)) { continue; }
          delete target[key];
          changed = true;
        }
      }
    }
    else {
      for (const key in target) {
        if (!(key in source)) {
          delete target[key];
          changed = true;
        }
      }
    }
  }
  if (preserveGetters) {
    for (const key in source) {
      // Skip declared getter keys: their `set` is absorb-only by contract
      // (any write would be a no-op), so the inequality compare burns two
      // getter invocations to decide nothing. On hot reactive paths the
      // target-side and source-side getters often run the expression
      // evaluator, so skipping pays back per key.
      if (ownGetters !== null && ownGetters.has(key)) { continue; }
      if (target[key] !== source[key]) {
        target[key] = source[key];
        changed = true;
      }
    }
  }
  else {
    for (const key in source) {
      if (target[key] !== source[key]) {
        target[key] = source[key];
        changed = true;
      }
    }
  }
  return returnChanged ? changed : target;
};

export const pick = (obj, ...keys) => {
  let copy = {};
  each(keys, function(key) {
    if (obj?.[key] !== undefined) {
      copy[key] = obj[key];
    }
  });
  return copy;
};

export const arrayFromObject = (obj) => {
  if (isArray(obj)) {
    return obj;
  }
  let arr = [];
  each(obj, (value, key) => {
    arr.push({
      value,
      key,
    });
  });
  return arr;
};

const extractBracketAccess = (part) => {
  const bracketIndex = part.indexOf('[');
  const key = part.substring(0, bracketIndex);
  const body = part.substring(bracketIndex + 1, part.indexOf(']'));
  // a leading # marks a keyed element selector (field[#identity]) vs a numeric
  // positional index (field[2]); the identity rides as a raw string value
  if (body.charCodeAt(0) === 35) {
    return { key, keyValue: body.slice(1) };
  }
  return { key, index: parseInt(body, 10) };
};

// the one walk under get and has. resolves the dot-bracket grammar to the
// stored value, MISSING when the path never lands on one. a stored undefined
// resolves as undefined, so has can tell it apart from a missing path
const MISSING = Symbol('missing');

const resolvePath = (obj, path, keys) => {
  if (obj === null || !isObject(obj)) {
    return MISSING;
  }

  const parts = path.split('.');
  let currentObject = obj;
  let pathOffset = 0;

  for (let i = 0; i < parts.length; i++) {
    if (currentObject === null || !isObject(currentObject)) {
      return MISSING;
    }

    const part = parts[i];

    if (part.includes('[')) {
      const access = extractBracketAccess(part);
      // an empty key ([0].x against an array root) addresses the current value as the array
      const array = access.key === '' ? currentObject : currentObject[access.key];
      if (!isArray(array)) {
        return MISSING;
      }
      const index = 'keyValue' in access ? findKeyed(array, access.keyValue, keys) : access.index;
      if (index < 0 || index >= array.length) {
        return MISSING;
      }
      currentObject = array[index];
    }
    else if (part in currentObject) {
      currentObject = currentObject[part];
    }
    else {
      // an existing literal dotted key wins, the whole remainder first (obj['a.b.c'])
      const remainingPath = path.substring(pathOffset);
      if (remainingPath in currentObject) {
        currentObject = currentObject[remainingPath];
        break;
      }
      // then this and the next part combined (obj['a.b'])
      const combinedKey = `${part}.${parts[i + 1]}`;
      if (combinedKey in currentObject) {
        currentObject = currentObject[combinedKey];
        i++;
      }
      else {
        return MISSING;
      }
    }

    pathOffset += part.length + 1;
  }

  return currentObject;
};

/*
  Access a nested object field from a string, like 'a.b.c'
*/
export const get = function(obj, path = '', keys = elementKey.config.keys) {
  if (typeof path !== 'string') {
    return undefined;
  }
  // simple property access — no dots, no brackets
  if (path.indexOf('.') === -1 && path.indexOf('[') === -1) {
    return (obj !== null && isObject(obj)) ? obj[path] : undefined;
  }
  const value = resolvePath(obj, path, keys);
  return value === MISSING ? undefined : value;
};

/*
  Existence twin of get — true when the path resolves to a real location,
  even one holding undefined. get() conflates a missing path with a stored
  undefined, has() is how callers tell them apart.
*/
export const has = function(obj, path = '', keys = elementKey.config.keys) {
  if (typeof path !== 'string') {
    return false;
  }
  // simple property access — no dots, no brackets
  if (path.indexOf('.') === -1 && path.indexOf('[') === -1) {
    return obj !== null && isObject(obj) && path in obj;
  }
  return resolvePath(obj, path, keys) !== MISSING;
};

const INDEX_SEGMENT = /^\d+$/;
const isIndexSegment = (part) => INDEX_SEGMENT.test(part);

// set and unset act only on a real path into a real object, and refuse
// prototype pollution (__proto__ and friends)
const CLIMBS_PROTOTYPE = /(^|\.|\[)(__proto__|constructor|prototype)(\.|\[|\]|$)/;
const isWritablePath = (obj, path) =>
  typeof path === 'string' && path !== '' && obj !== null && isObject(obj)
  && !CLIMBS_PROTOTYPE.test(path);

/*
  Set a nested object field from a string path, the write twin of get, so
  paths from trackWrites and detectChanges apply back. Creates missing
  intermediates — arrays when the next segment is an index, objects otherwise.
*/
export const set = function(obj, path, value, keys = elementKey.config.keys) {
  if (!isWritablePath(obj, path)) {
    return obj;
  }

  // simple property access — no dots, no brackets
  if (path.indexOf('.') === -1 && path.indexOf('[') === -1) {
    obj[path] = value;
    return obj;
  }

  const parts = path.split('.');
  let currentObject = obj;
  let pathOffset = 0;

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    const isLast = i === parts.length - 1;

    if (part.includes('[')) {
      const access = extractBracketAccess(part);
      let array;
      if (access.key === '') {
        // an empty key addresses the current value as the array; it can't be vivified in place
        if (!isArray(currentObject)) {
          return obj;
        }
        array = currentObject;
      }
      else {
        if (!isArray(currentObject[access.key])) {
          currentObject[access.key] = [];
        }
        array = currentObject[access.key];
      }
      if ('keyValue' in access) {
        const index = findKeyed(array, access.keyValue, keys);
        if (isLast) {
          if (index === -1) {
            array.push(value); // keyed add: an absent key appends a new element
          }
          else {
            array[index] = value; // keyed replace: a present key overwrites in place
          }
          return obj;
        }
        if (index === -1) {
          return obj; // a field write to a vanished element is a no-op
        }
        currentObject = array[index];
      }
      else {
        const { index } = access;
        if (isLast) {
          array[index] = value;
          return obj;
        }
        if (array[index] === null || !isObject(array[index])) {
          array[index] = isIndexSegment(parts[i + 1]) ? [] : {};
        }
        currentObject = array[index];
      }
    }
    else if (isLast) {
      currentObject[part] = value;
      return obj;
    }
    else {
      if (!(part in currentObject)) {
        // an existing literal dotted key wins over creating intermediates,
        // mirroring get()'s resolution
        const remainingPath = path.substring(pathOffset);
        if (remainingPath in currentObject) {
          currentObject[remainingPath] = value;
          return obj;
        }
        const combinedKey = `${part}.${parts[i + 1]}`;
        if (combinedKey in currentObject) {
          if (currentObject[combinedKey] === null || !isObject(currentObject[combinedKey])) {
            currentObject[combinedKey] = isIndexSegment(parts[i + 2]) ? [] : {};
          }
          currentObject = currentObject[combinedKey];
          pathOffset += combinedKey.length + 1;
          i++;
          continue;
        }
      }
      if (currentObject[part] === null || !isObject(currentObject[part])) {
        currentObject[part] = isIndexSegment(parts[i + 1]) ? [] : {};
      }
      currentObject = currentObject[part];
    }

    pathOffset += part.length + 1;
  }

  return obj;
};

/*
  Remove a nested object field from a string path, the delete twin of get/set.
  A missing path is a no-op, and a removed array index leaves a hole rather
  than splicing, so sibling index paths stay valid when applying several
  removals at once.
*/
export const unset = function(obj, path, keys = elementKey.config.keys) {
  if (!isWritablePath(obj, path)) {
    return obj;
  }

  // simple property access — no dots, no brackets
  if (path.indexOf('.') === -1 && path.indexOf('[') === -1) {
    delete obj[path];
    return obj;
  }

  const parts = path.split('.');
  let currentObject = obj;
  let pathOffset = 0;

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    const isLast = i === parts.length - 1;

    if (part.includes('[')) {
      const access = extractBracketAccess(part);
      const array = access.key === '' ? currentObject : currentObject[access.key];
      if (!isArray(array)) {
        return obj;
      }
      if ('keyValue' in access) {
        const index = findKeyed(array, access.keyValue, keys);
        if (index === -1) {
          return obj;
        }
        if (isLast) {
          array.splice(index, 1); // keyed removal splices: no positional siblings to keep valid
          return obj;
        }
        currentObject = array[index];
      }
      else {
        const { index } = access;
        if (isLast) {
          delete array[index];
          return obj;
        }
        currentObject = array[index];
      }
    }
    else if (isLast) {
      delete currentObject[part];
      return obj;
    }
    else if (part in currentObject) {
      currentObject = currentObject[part];
    }
    else {
      // an existing literal dotted key wins, mirroring get()'s resolution
      const remainingPath = path.substring(pathOffset);
      if (remainingPath in currentObject) {
        delete currentObject[remainingPath];
        return obj;
      }
      const combinedKey = `${part}.${parts[i + 1]}`;
      if (combinedKey in currentObject) {
        currentObject = currentObject[combinedKey];
        if (currentObject === null || !isObject(currentObject)) {
          return obj;
        }
        pathOffset += combinedKey.length + 1;
        i++;
        continue;
      }
      return obj;
    }

    if (currentObject === null || !isObject(currentObject)) {
      return obj;
    }
    pathOffset += part.length + 1;
  }

  return obj;
};

// a path can address an identity-bearing array element two ways: by position (items.0.qty) or by
// key (items[#a].qty). the positional spelling is only stable while the array doesn't move;
// keyedPath resolves it to the keyed spelling against a live object, rewriting each positional
// segment whose element carries a path-safe identity. returns the input string itself when
// nothing rewrites, so callers compare by reference
const HAS_POSITIONAL_SEGMENT = /(^|\.|\[)\d/;

export const keyedPath = (obj, path, keys = elementKey.config.keys) => {
  if (typeof path !== 'string' || !HAS_POSITIONAL_SEGMENT.test(path) || obj === null || !isObject(obj)) {
    return path;
  }
  const parts = path.split('.');
  // a leading index means the root itself is an array; get/set cannot parse a leading bracket, so
  // that spelling stays positional
  if (isIndexSegment(parts[0])) {
    return path;
  }
  const out = [];
  let currentObject = obj;
  let changed = false;
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (currentObject === null || !isObject(currentObject)) {
      return path;
    }
    if (part.includes('[')) {
      const access = extractBracketAccess(part);
      const array = currentObject[access.key];
      if (!isArray(array)) {
        return path;
      }
      const index = 'keyValue' in access ? findKeyed(array, access.keyValue, keys) : access.index;
      const element = array[index];
      if ('keyValue' in access) {
        out.push(part);
      }
      else {
        const keyValue = keyValueFrom(element, keys);
        if (keyValue !== null) {
          out.push(`${access.key}[#${keyValue}]`);
          changed = true;
        }
        else {
          out.push(part);
        }
      }
      currentObject = element;
    }
    else if (isIndexSegment(part) && isArray(currentObject)) {
      const element = currentObject[Number(part)];
      const keyValue = keyValueFrom(element, keys);
      if (keyValue !== null) {
        out[out.length - 1] += `[#${keyValue}]`;
        changed = true;
      }
      else {
        out.push(part);
      }
      currentObject = element;
    }
    else if (part in currentObject) {
      out.push(part);
      currentObject = currentObject[part];
    }
    else {
      // an unresolvable segment (including get()'s literal dotted-key forms) holds no positional
      // rewrite; leave the spelling alone
      return path;
    }
  }
  return changed ? out.join('.') : path;
};

/* This is useful for callbacks or other scenarios where you want to avoid the
   values of a reference object becoming stale when a source object changes
*/
export const proxyObject = (sourceObj = () => ({}), referenceObj = {}) => {
  return new Proxy(referenceObj, {
    get: (target, property) => {
      const propKey = typeof property === 'symbol' ? property.toString() : property;
      return get(referenceObj, propKey) ?? get(sourceObj(), propKey);
    },
  });
};

export const onlyKeys = (obj, keysToKeep) => {
  return keysToKeep.reduce((accumulator, key) => {
    if (obj.hasOwnProperty(key)) {
      accumulator[key] = obj[key];
    }
    return accumulator;
  }, {});
};

/*
  Return true if non-inherited property. Thin re-export of Object.hasOwn
  (ES2022) — safe on Object.create(null) and objects that shadow hasOwnProperty.
*/
export const hasProperty = Object.hasOwn;

/*
  Reverses a lookup object
  start { a: 1, b: [1, 2] }
  end { 1: ['a', 'b'], 2: 'b' }
*/
export const reverseKeys = (obj) => {
  const newObj = {};
  const pushValue = (key, value) => {
    if (isArray(newObj[key])) {
      newObj[key].push(value);
    }
    else if (newObj[key]) {
      newObj[key] = [newObj[key], value];
    }
    else {
      newObj[key] = value;
    }
  };
  Object.keys(obj).forEach((key) => {
    if (isArray(obj[key])) {
      each(obj[key], (subKey) => {
        pushValue(subKey, key);
      });
    }
    else {
      pushValue(obj[key], key);
    }
  });
  return newObj;
};

/*
  Search and rank objects by query relevance
  Weight hierarchy: startsWith > wordStartsWith > anywhere > anyWord
*/
export const weightedObjectSearch = (query, objectArray = [], {
  returnMatches = false,
  matchAllWords = true,
  propertiesToMatch = [],
} = {}) => {
  if (!isArray(objectArray)) { return []; }
  if (!isString(query) || !query.trim()) { return objectArray; }
  if (!objectArray.length || !propertiesToMatch.length) { return []; }

  const queryLower = query.trim().toLowerCase();
  const queryWords = queryLower.split(/\s+/);
  const wordCount = queryWords.length;
  const isMultiWord = wordCount > 1;

  // Regex only for wordStartsWith — startsWith and anywhere use string methods
  const wordStartsWithRe = new RegExp('(?:^|\\s)' + escapeRegExp(queryLower));

  const results = [];

  each(objectArray, (obj, index) => {
    let bestScore = Infinity;
    const matchDetails = returnMatches ? [] : null;

    for (let f = 0; f < propertiesToMatch.length; f++) {
      const field = propertiesToMatch[f];
      let rawValue = get(obj, field);
      if (rawValue == null) { continue; }

      // Normalize field value to searchable string
      let value;
      if (isString(rawValue)) {
        value = rawValue;
      }
      else if (isArray(rawValue)) {
        value = rawValue.join(' ');
      }
      else {
        value = String(rawValue);
      }
      if (!value) { continue; }

      const valueLower = value.toLowerCase();
      let fieldScore = Infinity;
      let matchType;

      // Cascade from best to worst — exit on first match per field
      if (valueLower.startsWith(queryLower)) {
        fieldScore = 1;
        matchType = 'startsWith';
      }
      else if (wordStartsWithRe.test(valueLower)) {
        fieldScore = 2;
        matchType = 'wordStartsWith';
      }
      else if (valueLower.indexOf(queryLower) !== -1) {
        fieldScore = 3;
        matchType = 'anywhere';
      }
      else if (isMultiWord) {
        let wordsMatched = 0;
        for (let w = 0; w < wordCount; w++) {
          if (valueLower.indexOf(queryWords[w]) !== -1) {
            wordsMatched++;
          }
        }

        const meetsThreshold = matchAllWords
          ? wordsMatched === wordCount
          : wordsMatched > 0;

        if (meetsThreshold) {
          fieldScore = 4 + (1 - wordsMatched / wordCount);
          matchType = 'anyWord';
        }
      }

      if (fieldScore === Infinity) { continue; }

      if (fieldScore < bestScore) {
        bestScore = fieldScore;
      }

      if (returnMatches) {
        matchDetails.push({ field, type: matchType, score: fieldScore, value: rawValue });
      }

      // Weight 1 is the ceiling — skip remaining fields unless collecting matches
      if (bestScore === 1 && !returnMatches) { break; }
    }

    if (bestScore < Infinity) {
      results.push({ obj, score: bestScore, index, matches: matchDetails });
    }
  });

  // Stable sort: by score ascending, then original position
  results.sort((a, b) => a.score - b.score || a.index - b.index);

  // Return without mutating originals
  if (returnMatches) {
    const output = new Array(results.length);
    for (let i = 0; i < results.length; i++) {
      const r = results[i];
      output[i] = { ...r.obj, matches: r.matches };
    }
    return output;
  }

  const output = new Array(results.length);
  for (let i = 0; i < results.length; i++) {
    output[i] = results[i].obj;
  }
  return output;
};
