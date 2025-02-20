import { isFunction } from './types.js';
import { hashCode } from './crypto.js';

/*-------------------
      Functions
--------------------*/

/*
  Efficient no operation func
*/
export const noop = (v) => v;

/*
  Call function even if its not defined
*/
export const wrapFunction = (x) => {
  return isFunction(x) ? x : () => x;
};

/*
  Memoize
*/
export const memoize = (fn, hashFunction = (args) => hashCode(JSON.stringify(args))) => {
  const cache = new Map();

  return function(...args) {
    const key = hashFunction(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn.apply(this, args);
    cache.set(key, result);

    return result;
  };
};

export const debounce = (fn, options) => {
  // allow just number to be passed in
  if(typeof options == 'number') {
    options = { delay: options };
  }
  const {
    delay = 200,
    immediate = false
  } = options;

  let timeout;
  let callbackCalled = false;

  function debounced(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) fn.apply(this, args);
      callbackCalled = false;
    };

    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, delay);

    if (callNow && !callbackCalled) {
      callbackCalled = true;
      fn.apply(this, args);
    }
  }

  debounced.cancel = () => {
    clearTimeout(timeout);
    timeout = null;
    callbackCalled = false;
  };

  return debounced;
};
