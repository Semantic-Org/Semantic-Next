import { isArray, isDate, isFunction, isMap, isRegExp, isSet } from './types.js';

/*-------------------
      Equality
--------------------*/

const getProto = Object.getPrototypeOf;
const hasOwn = Object.prototype.hasOwnProperty;
const objectValueOf = Object.prototype.valueOf;
const objectToString = Object.prototype.toString;

/*
  Deep structural equality comparison
*/
export const isEqual = (a, b, options) => {
  if (a === b) { return true; }
  if (a !== a && b !== b) { return true; }
  if (a == null || b == null) { return false; }
  if (typeof a !== 'object' && typeof b !== 'object') {
    return options?.loose ? a == b : false;
  }
  if (typeof a !== 'object' || typeof b !== 'object') { return false; }

  // Destructure only when we need deep comparison
  const { loose = false, ignoreKeys, deepIgnore = false, partial = false } = options || {};
  const ignored = ignoreKeys?.length > 0 ? new Set(ignoreKeys) : null;
  return deepEqual(a, b, loose, ignored, deepIgnore, partial);
};

const deepEqual = (a, b, loose, ignored, deepIgnore, partial) => {
  if (a === b) { return true; }
  if (a !== a && b !== b) { return true; }
  if (a == null || b == null) { return false; }

  if (typeof a !== 'object' && typeof b !== 'object') {
    return loose ? a == b : false;
  }
  if (typeof a !== 'object' || typeof b !== 'object') { return false; }

  // Prototype comparison — safer than constructor for Object.create(null)
  if (getProto(a) !== getProto(b)) { return false; }

  // Only propagate ignored keys into children when deepIgnore is on
  const childIgnored = deepIgnore ? ignored : null;

  // Arrays — direct loop, no closure allocation
  if (isArray(a)) {
    if (partial ? a.length > b.length : a.length !== b.length) { return false; }
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i], loose, childIgnored, deepIgnore, partial)) { return false; }
    }
    return true;
  }

  // Maps
  if (isMap(a)) {
    if (partial ? a.size > b.size : a.size !== b.size) { return false; }
    for (const [key, val] of a) {
      if (!b.has(key) || !deepEqual(val, b.get(key), loose, childIgnored, deepIgnore, partial)) { return false; }
    }
    return true;
  }

  // Sets — reference equality for members
  if (isSet(a)) {
    if (partial ? a.size > b.size : a.size !== b.size) { return false; }
    for (const val of a) {
      if (!b.has(val)) { return false; }
    }
    return true;
  }

  // Dates
  if (isDate(a)) { return a.getTime() === b.getTime(); }

  // RegExps
  if (isRegExp(a)) { return a.source === b.source && a.flags === b.flags; }

  // TypedArrays
  if (ArrayBuffer.isView(a)) {
    if (a.length !== b.length) { return false; }
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) { return false; }
    }
    return true;
  }

  // Custom valueOf / toString
  if (isFunction(a.valueOf) && a.valueOf !== objectValueOf) {
    return a.valueOf() === b.valueOf();
  }
  if (isFunction(a.toString) && a.toString !== objectToString) {
    return a.toString() === b.toString();
  }

  // Plain objects — inline iteration, no closure allocation
  const aKeys = Object.keys(a);
  let aCount = 0;
  for (let i = 0; i < aKeys.length; i++) {
    const key = aKeys[i];
    if (ignored?.has(key)) { continue; }
    aCount++;
    if (!hasOwn.call(b, key) || !deepEqual(a[key], b[key], loose, childIgnored, deepIgnore, partial)) {
      return false;
    }
  }
  if (partial) { return true; }

  // Fast path: no ignored keys — just compare key counts
  if (!ignored) {
    return aCount === Object.keys(b).length;
  }

  // Slow path: count b's non-ignored keys
  const bKeys = Object.keys(b);
  let bCount = 0;
  for (let i = 0; i < bKeys.length; i++) {
    if (!ignored.has(bKeys[i])) { bCount++; }
  }
  return aCount === bCount;
};
