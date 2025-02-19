import { isArray, isObject, isFunction } from './types.js';

/*-------------------
     Collections
--------------------*/

/*
  Clone an object or array
*/
// adapted from nanoclone <https://github.com/Kelin2025/nanoclone>
export const clone = (src, seen = new Map()) => {
  if (!src || typeof src !== 'object') return src;

  if (seen.has(src)) return seen.get(src);

  let copy;
  if (src.nodeType && 'cloneNode' in src) {
    copy = src.cloneNode(true);
    seen.set(src, copy);
  }
  else if (src instanceof Date) {
    // Date
    copy = new Date(src.getTime());
    seen.set(src, copy);
  }
  else if (src instanceof RegExp) {
    // RegExp
    copy = new RegExp(src);
    seen.set(src, copy);
  }
  else if (Array.isArray(src)) {
    // Array
    copy = new Array(src.length);
    seen.set(src, copy);
    for (let i = 0; i < src.length; i++) copy[i] = clone(src[i], seen);
  }
  else if (src instanceof Map) {
    // Map
    copy = new Map();
    seen.set(src, copy);
    for (const [k, v] of src.entries()) copy.set(k, clone(v, seen));
  }
  else if (src instanceof Set) {
    // Set
    copy = new Set();
    seen.set(src, copy);
    for (const v of src) copy.add(clone(v, seen));
  }
  else if (src instanceof Object) {
    // Object
    copy = {};
    seen.set(src, copy);
    for (const [k, v] of Object.entries(src)) copy[k] = clone(v, seen);
  }

  return copy;
};


/*
  Simplify iterating over objects and arrays
*/
export const each = (obj, func, context) => {
  if (obj === null || obj === undefined) {
    return obj;
  }
  const iteratee = context ? func.bind(context) : func;
  if (isObject(obj) || isFunction(obj)) {
    if (obj.length !== undefined && typeof obj.length === 'number') {
      obj = Array.from(obj);
    }
  }
  if (isArray(obj)) {
    for (let i = 0; i < obj.length; ++i) {
      if (iteratee(obj[i], i, obj) === false) {
        break;
      }
    }
  }
  else {
    const keys = Object.keys(obj);
    for (let key of keys) {
      if (iteratee(obj[key], key, obj) === false) {
        break;
      }
    }
  }
  return obj;
};

export const asyncEach = async (obj, func, context) => {
  if (obj === null || obj === undefined) {
    return obj;
  }
  const iteratee = context ? func.bind(context) : func;
  if (isObject(obj) || isFunction(obj)) {
    if (obj.length !== undefined && typeof obj.length === 'number') {
      obj = Array.from(obj);
    }
  }
  if (isArray(obj)) {
    for (let i = 0; i < obj.length; ++i) {
      if (await iteratee(obj[i], i, obj) === false) {
        break;
      }
    }
  }
  else {
    const keys = Object.keys(obj);
    for (let key of keys) {
      if (await iteratee(obj[key], key, obj) === false) {
        break;
      }
    }
  }
  return obj;
};

/*
  Asynchronous mapping over objects and arrays
*/
export const asyncMap = async (obj, func, context) => {
  if (obj === null || obj === undefined) {
    return obj;
  }
  const iteratee = context ? func.bind(context) : func;
  const result = isArray(obj) ? [] : {};
  if (isObject(obj) || isFunction(obj)) {
    if (obj.length !== undefined && typeof obj.length === 'number') {
      obj = Array.from(obj);
    }
  }
  if (isArray(obj)) {
    for (let i = 0; i < obj.length; ++i) {
      result[i] = await iteratee(obj[i], i, obj);
    }
  }
  else {
    const keys = Object.keys(obj);
    for (let key of keys) {
      result[key] = await iteratee(obj[key], key, obj);
    }
  }
  return result;
};



/*
  Determine if two objects are equal
*/

// adapted from <https://github.com/epoberezkin/fast-deep-equal/>
export const isEqual = (a, b, options = {}) => {
  if (a === b) return true;

  if (a && b && typeof a == 'object' && typeof b == 'object') {
    if (a.constructor !== b.constructor) return false;

    let length, i, keys;
    if (Array.isArray(a)) {
      length = a.length;
      if (length != b.length) return false;
      for (i = length; i-- !== 0; ) {
        if (!isEqual(a[i], b[i])) {
          return false;
        }
      }
      return true;
    }

    if (a instanceof Map && b instanceof Map) {
      if (a.size !== b.size) return false;
      for (i of a.entries()) {
        if (!b.has(i[0])) {
          return false;
        }
      }
      for (i of a.entries()) {
        if (!isEqual(i[1], b.get(i[0]))) {
          return false;
        }
      }
      return true;
    }

    if (a instanceof Set && b instanceof Set) {
      if (a.size !== b.size) return false;
      for (i of a.entries()) {
        if (!b.has(i[0])) {
          return false;
        }
      }
      return true;
    }

    if (ArrayBuffer.isView(a) && ArrayBuffer.isView(b)) {
      length = a.length;
      if (length != b.length) return false;
      for (i = length; i-- !== 0; ) {
        if (a[i] !== b[i]) {
          return false;
        }
      }
      return true;
    }

    if (a.constructor === RegExp) {
      return a.source === b.source && a.flags === b.flags;
    }
    if (a.valueOf !== Object.prototype.valueOf) {
      return a.valueOf() === b.valueOf();
    }
    if (a.toString !== Object.prototype.toString) {
      return a.toString() === b.toString();
    }

    keys = Object.keys(a);
    length = keys.length;
    if (length !== Object.keys(b).length) return false;

    for (i = length; i-- !== 0; ) {
      if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;
    }

    for (i = length; i-- !== 0; ) {
      let key = keys[i];
      if (!isEqual(a[key], b[key])) return false;
    }

    return true;
  }

  // true if both NaN, false otherwise
  return a !== a && b !== b;
};
