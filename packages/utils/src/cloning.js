import {
  isArray,
  isBinary,
  isClassInstance,
  isDate,
  isMap,
  isObject,
  isPlainObject,
  isRegExp,
  isSet,
} from './types.js';

/*-------------------
        Cloning
--------------------*/

/*
  Deep-freeze a value in place. Returns the same reference.
  Only arrays and plain objects are frozen recursively; Dates, Maps, Sets,
  RegExps, DOM nodes, Signals, reactive proxies, and any other non-plain
  object is skipped so their internal slots and custom behavior keep working.
*/
const deepFreezeValue = (value, seen) => {
  if (!value || typeof value !== 'object') { return value; }
  if (Object.isFrozen(value)) { return value; }
  if (seen.has(value)) { return value; }

  if (isArray(value)) {
    seen.add(value);
    for (let i = 0; i < value.length; i++) {
      deepFreezeValue(value[i], seen);
    }
    Object.freeze(value);
    return value;
  }

  // Only walk plain objects — anything with a custom prototype (Date, Map,
  // DOM node, Signal, etc.) is left alone. isClassInstance would miss
  // Date/Map/Set/RegExp because they're tagged as built-ins; isPlainObject
  // is the correct gate.
  if (isPlainObject(value)) {
    seen.add(value);
    const keys = Object.keys(value);
    for (let i = 0; i < keys.length; i++) {
      deepFreezeValue(value[keys[i]], seen);
    }
    Object.freeze(value);
  }

  return value;
};

export const deepFreeze = (value) => {
  return deepFreezeValue(value, new WeakSet());
};

/*
  Clone an object or array
*/
// adapted from nanoclone <https://github.com/Kelin2025/nanoclone>
const cloneValue = (src, preserveDOM, preserveNonCloneable, seen) => {
  if (!src || typeof src !== 'object') { return src; }

  if (seen.has(src)) { return seen.get(src); }

  let copy;
  if (src.nodeType && 'cloneNode' in src) {
    if (preserveDOM) { return src; }
    copy = src.cloneNode(true);
    seen.set(src, copy);
  }
  else if (isDate(src)) {
    copy = new Date(src.getTime());
    seen.set(src, copy);
  }
  else if (isRegExp(src)) {
    copy = new RegExp(src);
    seen.set(src, copy);
  }
  else if (isArray(src)) {
    copy = new Array(src.length);
    seen.set(src, copy);
    for (let i = 0; i < src.length; i++) {
      copy[i] = cloneValue(src[i], preserveDOM, preserveNonCloneable, seen);
    }
  }
  else if (isMap(src)) {
    copy = new Map();
    seen.set(src, copy);
    for (const [k, v] of src.entries()) {
      copy.set(k, cloneValue(v, preserveDOM, preserveNonCloneable, seen));
    }
  }
  else if (isSet(src)) {
    copy = new Set();
    seen.set(src, copy);
    for (const v of src) {
      copy.add(cloneValue(v, preserveDOM, preserveNonCloneable, seen));
    }
  }
  // the one case where the native clone wins: ~6x faster on binary data
  // where the recursive walk only loses, see cloning.bench.js
  else if (isBinary(src)) {
    copy = structuredClone(src);
    seen.set(src, copy);
  }
  else if (isObject(src)) {
    if (preserveNonCloneable && isClassInstance(src)) {
      return src;
    }
    copy = isPlainObject(src) && Object.getPrototypeOf(src) === null
      ? Object.create(null)
      : {};
    seen.set(src, copy);
    const keys = Object.keys(src);
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      copy[k] = cloneValue(src[k], preserveDOM, preserveNonCloneable, seen);
    }
  }

  return copy;
};

export const clone = (src, { preserveDOM = false, preserveNonCloneable = false } = {}) => {
  return cloneValue(src, preserveDOM, preserveNonCloneable, new WeakMap());
};
