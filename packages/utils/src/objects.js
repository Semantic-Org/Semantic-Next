import { clone } from './cloning.js';
import { isEqual } from './equality.js';
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
export const detectChanges = (before, after) => {
  const added = [];
  const removed = [];
  const changed = [];
  const seen = new WeakSet(); // cycle guard, each before-node diffs once

  const walk = (a, b, prefix) => {
    if (seen.has(a)) {
      return;
    }
    seen.add(a);
    for (const key of Object.keys(a)) {
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
      if (isTrackable(valueA) && isTrackable(valueB) && isArray(valueA) === isArray(valueB)) {
        walk(valueA, valueB, path);
      }
      else if (!isEqual(valueA, valueB)) {
        changed.push(path);
      }
    }
    for (const key of Object.keys(b)) {
      if (!Object.hasOwn(a, key)) {
        added.push(prefix === '' ? key : `${prefix}.${key}`);
      }
    }
  };

  if (isTrackable(before) && isTrackable(after) && isArray(before) === isArray(after)) {
    walk(before, after, '');
  }
  else if (!isEqual(before, after)) {
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

/*
  Run callback against value, report whether it changed it. 'auto' snapshots
  small values (clone + deep-compare, callback sees the real object) and
  write-tracks large ones through a proxy so cost scales with writes, not size.
*/
export const trackWrites = (value, callback, {
  strategy = 'auto',
  onWrite,
  returnPaths = true,
  clone: cloneFunction = clone,
  equality = isEqual,
} = {}) => {
  const useProxy = (strategy === 'proxy'
    || (strategy === 'auto' && (onWrite !== undefined || overBudget(value))))
    && isTrackable(value)
    && !Object.isFrozen(value);

  if (!useProxy) {
    const before = cloneFunction(value);
    const result = callback(value);
    if (!returnPaths) {
      return { changed: !equality(before, value), result };
    }
    const diff = detectChanges(before, value);
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

  // swap any tracked wrapper for its raw object, scanning fresh containers
  // (a spread, a filter result) for wrappers smuggled inside, so the raw
  // graph never stores one
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
    // safe after expiry: unwrapping reads raw lookups and fresh containers,
    // never a tracked wrapper's properties
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

/*
  Access a nested object field from a string, like 'a.b.c'
*/
const extractBracketAccess = (part) => {
  const bracketIndex = part.indexOf('[');
  const key = part.substring(0, bracketIndex);
  const index = parseInt(part.substring(bracketIndex + 1, part.indexOf(']')), 10);
  return { key, index };
};

export const get = function(obj, path = '') {
  if (typeof path !== 'string') {
    return undefined;
  }

  // Simple property access — no dots, no brackets
  if (path.indexOf('.') === -1 && path.indexOf('[') === -1) {
    return (obj !== null && isObject(obj)) ? obj[path] : undefined;
  }

  if (obj === null || !isObject(obj)) {
    return undefined;
  }

  const parts = path.split('.');
  let currentObject = obj;
  let pathOffset = 0;

  for (let i = 0; i < parts.length; i++) {
    if (currentObject === null || !isObject(currentObject)) {
      return undefined;
    }

    let part = parts[i];

    if (part.includes('[')) {
      const { key, index } = extractBracketAccess(part);

      if (key in currentObject && isArray(currentObject[key]) && index < currentObject[key].length) {
        currentObject = currentObject[key][index];
      }
      else {
        return undefined;
      }
    }
    else {
      if (part in currentObject) {
        currentObject = currentObject[part];
      }
      else {
        // Try remaining path as a single dotted key (e.g., obj['a.b.c'])
        const remainingPath = path.substring(pathOffset);
        if (remainingPath in currentObject) {
          currentObject = currentObject[remainingPath];
          break;
        }

        // Try combining current + next part as a dotted key (e.g., obj['a.b'])
        const combinedKey = `${part}.${parts[i + 1]}`;
        if (combinedKey in currentObject) {
          currentObject = currentObject[combinedKey];
          i++;
        }
        else {
          return undefined;
        }
      }
    }

    pathOffset += part.length + 1;
  }

  return currentObject;
};

const isIndexSegment = (part) => /^\d+$/.test(part);

/*
  Set a nested object field from a string path, the write twin of get, so
  paths from trackWrites and detectChanges apply back. Creates missing
  intermediates — arrays when the next segment is an index, objects otherwise.
*/
export const set = function(obj, path, value) {
  if (typeof path !== 'string' || path === '' || obj === null || !isObject(obj)) {
    return obj;
  }
  // a path setter is the classic prototype pollution vector, refuse segments
  // that climb the prototype chain
  if (/(^|\.|\[)(__proto__|constructor|prototype)(\.|\[|\]|$)/.test(path)) {
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
      const { key, index } = extractBracketAccess(part);
      if (!isArray(currentObject[key])) {
        currentObject[key] = [];
      }
      if (isLast) {
        currentObject[key][index] = value;
        return obj;
      }
      if (currentObject[key][index] === null || !isObject(currentObject[key][index])) {
        currentObject[key][index] = isIndexSegment(parts[i + 1]) ? [] : {};
      }
      currentObject = currentObject[key][index];
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
