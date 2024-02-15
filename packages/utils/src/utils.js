/*
  An simple utility belt
  to save time on common boilerplate
*/

/*-------------------
       Errors
--------------------*/

export const fatal = (message, {
  errorType = Error,
  metadata = {},
  onError = null,
  removeStackLines = 1,
} = {}) => {
  const error = new errorType(message);
  Object.assign(error, metadata);

  if (error.stack) {
    const stackLines = error.stack.split('\n');
    stackLines.splice(1, removeStackLines);
    error.stack = stackLines.join('\n');
  }

  const throwError = () => {
    if (typeof onError === 'function') {
      onError(error);
    }
    throw error;
  };

  if (typeof queueMicrotask === 'function') {
    queueMicrotask(throwError);
  }
  else {
    setTimeout(throwError, 0);
  }
};

/*-------------------
        Types
--------------------*/

export const isObject = (x) => {
  return x !== null && typeof x == 'object';
};

export const isPlainObject = (x) => {
  return isObject(x) && x.constructor === Object;
};

export const isString = (x) => {
  return typeof x == 'string';
};

export const isDOM = (element) => {
  return element instanceof Element || element instanceof Document || element === window
    || element instanceof DocumentFragment;
};

export const isNode = (el) => {
  return !!(el && el.nodeType);
};

export const isNumber = (x) => {
  return typeof x == 'number';
};

export const isArray = (x) => {
  return Array.isArray(x);
};

export const isBinary = (x) => {
  return !!(typeof Uint8Array !== 'undefined' && x instanceof Uint8Array);
};

export const isFunction = (x) => {
  return typeof x == 'function' || false;
};

export const isPromise = (x) => {
  return x && isFunction(x.then);
};

export const isArguments = function(obj) {
  return Object.prototype.toString.call(obj) === '[object Arguments]';
};

/*-------------------
        Date
--------------------*/

export const formatDate = function(date, format) {
  const pad = (n) => (n < 10 ? '0' + n : n);
  const dateMap = {
    'YYYY': date.getFullYear(),
    'YY': date.getFullYear().toString().slice(-2),
    'MMMM': date.toLocaleString('default', { month: 'long' }),
    'MMM': date.toLocaleString('default', { month: 'short' }),
    'MM': pad(date.getMonth() + 1),
    'M': date.getMonth() + 1,
    'DD': pad(date.getDate()),
    'D': date.getDate(),
    'Do': date.getDate() + ['th', 'st', 'nd', 'rd'][((date.getDate() + 90) % 100 - 10) % 10 - 1] || 'th',
    'dddd': date.toLocaleString('default', { weekday: 'long' }),
    'ddd': date.toLocaleString('default', { weekday: 'short' }),
    'HH': pad(date.getHours()),
    'h': date.getHours() % 12 || 12,
    'mm': pad(date.getMinutes()),
    'ss': pad(date.getSeconds()),
    'a': date.getHours() >= 12 ? 'pm' : 'am',
  };

  const formatMap = {
    'LT': 'h:mm a',
    'LTS': 'h:mm:ss a',
    'L': 'MM/DD/YYYY',
    'l': 'M/D/YYYY',
    'LL': 'MMMM D, YYYY',
    'll': 'MMM D, YYYY',
    'LLL': 'MMMM D, YYYY h:mm a',
    'lll': 'MMM D, YYYY h:mm a',
    'LLLL': 'dddd, MMMM D, YYYY h:mm a',
    'llll': 'ddd, MMM D, YYYY h:mm a',
  };

  const expandedFormat = formatMap[format] || format;

  return expandedFormat.replace(/\b(?:YYYY|YY|MMMM|MMM|MM|M|DD|D|Do|dddd|ddd|HH|h|mm|ss|a)\b/g, (match) => {
    return dateMap[match];
  }).replace(/\[(.*?)\]/g, (match, p1) => p1);
};

/*-------------------
      Functions
--------------------*/

/*
  Efficient no operation func
*/
export const noop = function() {};

/*
  Call function even if its not defined
*/
export const wrapFunction = (x) => {
  return isFunction(x) ? x : () => x;
};

/*-------------------
       Strings
--------------------*/

/*
  HTML Attributes -> JS Properties
*/

// attr-name to varName
export const kebabToCamel = (str = '') => {
  return str.replace(/-./g, (m) => m[1].toUpperCase());
};

export const camelToKebab = (str = '') => {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
};

export const capitalize = (str = '') => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const capitalizeWords = (str = '') => {
  return str.replace(/\b(\w)/g, (match, capture) => capture.toUpperCase())
    .replace(/\b(\w+)\b/g, (match) => match.toLowerCase())
    .replace(/\b(\w)/g, (match) => match.toUpperCase());
};

export const toTitleCase = (str = '') => {
  const stopWords = [
    'the',
    'a',
    'an',
    'and',
    'but',
    'for',
    'at',
    'by',
    'from',
    'to',
    'in',
    'on',
    'of',
    'or',
    'nor',
    'with',
    'as',
  ];
  return str
    .toLowerCase()
    .split(' ')
    .map((word, index) => {
      // Always capitalize the first word and any word not in stopWords
      if (index === 0 || !stopWords.includes(word)) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      return word;
    })
    .join(' ');
};

/*-------------------
        Arrays
--------------------*/

/*
  Remove duplicates from an array
*/
export const unique = (arr) => {
  return Array.from(new Set(arr));
};

/*
  Remove undefined values from an array
*/
export const filterEmpty = (arr) => {
  return arr.filter((val) => val);
};

/*
  Get last element from array
*/
export const last = (array, number = 1) => {
  const { length } = array;
  if (!length) { return; }

  if (number === 1) {
    // Return the last element
    return array[length - 1];
  }
  else {
    // Return the last number elements as a new array
    return array.slice(Math.max(length - number, 0));
  }
};

/*
  Iterate through returning first value
*/
export const firstMatch = (array, callback) => {
  let result;
  each(array, (value, index) => {
    if (callback(value, index, array)) {
      result = value;
      return false;
    }
  });
  return result;
};

export const findIndex = (array, callback) => {
  let matchedIndex = -1;
  each(array, (value, index) => {
    if (callback(value, index, array)) {
      matchedIndex = index;
      return false;
    }
  });
  return matchedIndex;
};

export const remove = (array, callbackOrValue) => {
  const callback = isFunction(callbackOrValue)
    ? callbackOrValue
    : (val) => isEqual(val, callbackOrValue);
  const index = findIndex(array, callback);
  if (index > -1) {
    array.splice(index, 1);
    return true;
  }
  return false;
};

export const inArray = (value, array = []) => {
  return array.indexOf(value) > -1;
};

export const range = (start, stop, step = 1) => {
  if (!stop) {
    stop = start;
    start = 0;
  }
  const length = stop - start;
  return Array(length).fill().map((x, index) => {
    return (index * step) + start;
  });
};

/*-------------------
       Objects
--------------------*/

/*
  Return keys from object
*/
export const keys = (obj) => {
  return Object.keys(obj);
};

export const values = (obj) => {
  return Object.values(obj);
};

export const mapObject = function(obj, callback) {
  const objKeys = keys(obj).reverse();
  const length = objKeys.length;
  let index = length;
  let newObj = {};
  while (index--) {
    const thisKey = objKeys[index];
    newObj[thisKey] = callback(obj[thisKey], thisKey);
  }
  return newObj;
};

/*
  Handles properly copying getter/setters
*/
export const extend = (obj, ...sources) => {
  sources.forEach((source) => {
    let descriptor, prop;
    if (source) {
      for (prop in source) {
        descriptor = Object.getOwnPropertyDescriptor(source, prop);
        if (descriptor === undefined) {
          obj[prop] = source[prop];
        }
        else {
          Object.defineProperty(obj, prop, descriptor);
        }
      }
    }
  });
  return obj;
};

export const pick = function(obj, ...keys) {
  let copy = {};
  each(keys, function(key) {
    if (key in obj) {
      copy[key] = obj[key];
    }
  });
  return copy;
};

/*
  Access a nested object field from a string, like 'a.b.c'
*/
export const get = function(obj, string = '') {
  string = string
    .replace(/^\./, '')
    .replace(/\[(\w+)\]/g, '.$1');
  const stringParts = string.split('.');

  for (let index = 0, length = stringParts.length; index < length; ++index) {
    const part = stringParts[index];
    // Check if obj is an object and part exists in obj
    if (obj !== null && typeof obj === 'object' && part in obj) {
      obj = obj[part];
    }
    else {
      // If not, return undefined to safely indicate missing value
      return undefined;
    }
  }
  return obj;
};

/*
  Return true if non-inherited property
*/
export const hasProperty = (obj, prop) => {
  return Object.prototype.hasOwnProperty.call(obj, prop);
};

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

/*-------------------
    Array / Object
--------------------*/

/*
  Clone an object or array
*/
// adapted from nanoclone <https://github.com/Kelin2025/nanoclone>
export const clone = (src, seen = new Map()) => {
  if (!src || typeof src !== 'object') { return src; }

  if (seen.has(src)) { return seen.get(src); }

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
    for (let i = 0; i < src.length; i++) { copy[i] = clone(src[i], seen); }
  }
  else if (src instanceof Map) {
    // Map
    copy = new Map();
    seen.set(src, copy);
    for (const [k, v] of src.entries()) { copy.set(k, clone(v, seen)); }
  }
  else if (src instanceof Set) {
    // Set
    copy = new Set();
    seen.set(src, copy);
    for (const v of src) { copy.add(clone(v, seen)); }
  }
  else if (src instanceof Object) {
    // Object
    copy = {};
    seen.set(src, copy);
    for (const [k, v] of Object.entries(src)) { copy[k] = clone(v, seen); }
  }

  return copy;
};

/*
  Simplify iterating over objects and arrays
*/
export const each = (obj, func, context) => {
  if (obj === null) {
    return obj;
  }

  const iteratee = context ? func.bind(context) : func;

  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; ++i) {
      if (iteratee(obj[i], i, obj) === false) {
        break; // Exit early if callback explicitly returns false
      }
    }
  }
  else if (isObject(obj)) {
    const objKeys = Object.keys(obj);
    for (const key of objKeys) {
      if (iteratee(obj[key], key, obj) === false) {
        break; // Exit early if callback explicitly returns false
      }
    }
  }

  return obj; // Return the original object
};

/*-------------------
       RegExp
--------------------*/

/*
  Escape Special Chars for RegExp
*/
export const escapeRegExp = function(string) {
  return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
};

/*-------------------
      Identity
--------------------*/

export const prettifyID = (num) => {
  num = parseInt(num, 10);
  if (num === 0) { return '0'; }
  let result = '';
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  while (num > 0) {
    result = chars[num % chars.length] + result;
    num = Math.floor(num / chars.length);
  }
  return result;
};

/*
  Create a uniqueID from a string
*/
export function hashCode(input) {
  let str;

  // Convert input to a string
  if (input && input.toString === Object.prototype.toString && typeof input === 'object') {
    try {
      str = JSON.stringify(input);
    }
    catch (error) {
      console.error('Error serializing input', error);
      return 0;
    }
  }
  else {
    str = input.toString();
  }

  const seed = 0x12345678;

  const murmurhash = (key, seed) => {
    let h1 = seed;
    const c1 = 0xcc9e2d51;
    const c2 = 0x1b873593;

    const round = (k) => {
      k = k * c1 & 0xffffffff;
      k = (k << 15) | (k >>> 17);
      k = k * c2 & 0xffffffff;
      h1 ^= k;
      h1 = (h1 << 13) | (h1 >>> 19);
      h1 = h1 * 5 + 0xe6546b64 & 0xffffffff;
    };

    for (let i = 0; i < key.length; i += 4) {
      let k = (key.charCodeAt(i) & 0xff)
        | ((key.charCodeAt(i + 1) & 0xff) << 8)
        | ((key.charCodeAt(i + 2) & 0xff) << 16)
        | ((key.charCodeAt(i + 3) & 0xff) << 24);
      round(k);
    }

    let k1 = 0;
    switch (key.length & 3) {
      case 3:
        k1 ^= (key.charCodeAt(key.length - 1) & 0xff) << 16;
      case 2:
        k1 ^= (key.charCodeAt(key.length - 2) & 0xff) << 8;
      case 1:
        k1 ^= key.charCodeAt(key.length - 3) & 0xff;
        round(k1);
    }

    h1 ^= key.length;
    h1 ^= h1 >>> 16;
    h1 = h1 * 0x85ebca6b & 0xffffffff;
    h1 ^= h1 >>> 13;
    h1 = h1 * 0xc2b2ae35 & 0xffffffff;
    h1 ^= h1 >>> 16;

    return h1 >>> 0;
  };

  let hash;
  hash = murmurhash(str, seed); // fast and pretty good collisions
  hash = prettifyID(hash); // pretty and easier to recognize

  return hash;
}

export const generateID = () => {
  const num = Math.random() * 1000000000000000;
  return prettifyID(num);
};

/*
  Determine if two objects are equal
*/

// adapted from <https://github.com/epoberezkin/fast-deep-equal/>
export const isEqual = (a, b, options = {}) => {
  if (a === b) { return true; }

  if (a && b && typeof a == 'object' && typeof b == 'object') {
    if (a.constructor !== b.constructor) { return false; }

    let length, i, keys;
    if (Array.isArray(a)) {
      length = a.length;
      if (length != b.length) { return false; }
      for (i = length; i-- !== 0;) {
        if (!isEqual(a[i], b[i])) {
          return false;
        }
      }
      return true;
    }

    if ((a instanceof Map) && (b instanceof Map)) {
      if (a.size !== b.size) { return false; }
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

    if ((a instanceof Set) && (b instanceof Set)) {
      if (a.size !== b.size) { return false; }
      for (i of a.entries()) {
        if (!b.has(i[0])) {
          return false;
        }
      }
      return true;
    }

    if (ArrayBuffer.isView(a) && ArrayBuffer.isView(b)) {
      length = a.length;
      if (length != b.length) { return false; }
      for (i = length; i-- !== 0;) {
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
    if (length !== Object.keys(b).length) { return false; }

    for (i = length; i-- !== 0;) {
      if (!Object.prototype.hasOwnProperty.call(b, keys[i])) { return false; }
    }

    for (i = length; i-- !== 0;) {
      let key = keys[i];
      if (!isEqual(a[key], b[key])) { return false; }
    }

    return true;
  }

  // true if both NaN, false otherwise
  return a !== a && b !== b;
};

import * as _ from './utils';
export default _;
