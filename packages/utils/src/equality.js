import { each } from './loops.js';
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
export const isEqual = (a, b, { loose = false, ignoreKeys, partial = false } = {}) => {
  if (a === b) { return true; }
  if (a !== a && b !== b) { return true; }
  if (a == null || b == null) { return false; }
  if (typeof a !== 'object' && typeof b !== 'object') {
    return loose ? a == b : false;
  }
  if (typeof a !== 'object' || typeof b !== 'object') { return false; }

  // Normalize ignoreKeys to Set once, pass primitives through recursion
  const ignored = ignoreKeys?.length > 0 ? new Set(ignoreKeys) : null;
  return deepEqual(a, b, loose, ignored, partial);
};

const deepEqual = (a, b, loose, ignored, partial) => {
  if (a === b) { return true; }
  if (a !== a && b !== b) { return true; }
  if (a == null || b == null) { return false; }

  if (typeof a !== 'object' && typeof b !== 'object') {
    return loose ? a == b : false;
  }
  if (typeof a !== 'object' || typeof b !== 'object') { return false; }

  // Prototype comparison — safer than constructor for Object.create(null)
  if (getProto(a) !== getProto(b)) { return false; }

  // Arrays — most common compound type in frontend code
  if (isArray(a)) {
    if (partial ? a.length > b.length : a.length !== b.length) { return false; }
    let equal = true;
    each(a, (val, i) => {
      if (!deepEqual(val, b[i], loose, ignored, partial)) {
        equal = false;
        return false;
      }
    });
    return equal;
  }

  // Maps
  if (isMap(a)) {
    if (partial ? a.size > b.size : a.size !== b.size) { return false; }
    let equal = true;
    each(a, (val, key) => {
      if (!b.has(key) || !deepEqual(val, b.get(key), loose, ignored, partial)) {
        equal = false;
        return false;
      }
    });
    return equal;
  }

  // Sets — reference equality for members
  if (isSet(a)) {
    if (partial ? a.size > b.size : a.size !== b.size) { return false; }
    let equal = true;
    each(a, (val) => {
      if (!b.has(val)) {
        equal = false;
        return false;
      }
    });
    return equal;
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

  // Plain objects — count keys during iteration, no Object.keys allocation for b
  let aCount = 0;
  let equal = true;

  each(a, (val, key) => {
    if (ignored?.has(key)) { return; }
    aCount++;
    if (!hasOwn.call(b, key) || !deepEqual(val, b[key], loose, ignored, partial)) {
      equal = false;
      return false;
    }
  });
  if (!equal) { return false; }
  if (partial) { return true; }

  // Only count b's keys if we need to verify same size
  let bCount = 0;
  each(b, (_, key) => {
    if (ignored?.has(key)) { return; }
    bCount++;
  });

  return aCount === bCount;
};
