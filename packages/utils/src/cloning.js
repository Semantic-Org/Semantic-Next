import { isClassInstance } from './types.js';

/*-------------------
        Cloning
--------------------*/

/*
  Clone an object or array
*/
// adapted from nanoclone <https://github.com/Kelin2025/nanoclone>
export const clone = (src, options = {}) => {
  const { preserveDOM = false, preserveNonCloneable = false, seen = new Map() } = options;

  if (!src || typeof src !== 'object') { return src; }

  if (seen.has(src)) { return seen.get(src); }

  let copy;
  if (src.nodeType && 'cloneNode' in src && !preserveDOM) {
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
    for (let i = 0; i < src.length; i++) {
      copy[i] = clone(src[i], { ...options, seen });
    }
  }
  else if (src instanceof Map) {
    // Map
    copy = new Map();
    seen.set(src, copy);
    for (const [k, v] of src.entries()) {
      copy.set(k, clone(v, { ...options, seen }));
    }
  }
  else if (src instanceof Set) {
    // Set
    copy = new Set();
    seen.set(src, copy);
    for (const v of src) {
      copy.add(clone(v, { ...options, seen }));
    }
  }
  else if (src instanceof Object) {
    // Check if it's a custom class instance and preserve if requested
    if (preserveNonCloneable && isClassInstance(src)) {
      return src; // Return reference to original custom class instance
    }
    // Plain object
    copy = {};
    seen.set(src, copy);
    for (const [k, v] of Object.entries(src)) {
      copy[k] = clone(v, { ...options, seen });
    }
  }

  return copy;
};
