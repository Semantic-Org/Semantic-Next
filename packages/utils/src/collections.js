import { isArray, isObject } from './types.js';

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
