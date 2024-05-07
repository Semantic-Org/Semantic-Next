/*
  An simple utility belt
  to save time on common boilerplate
*/

/*-------------------
       Errors
--------------------*/

export const fatal = (
  message,
  {
    errorType = Error,
    metadata = {},
    onError = null,
    removeStackLines = 1,
  } = {}
) => {
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
        DOM
--------------------*/

export const copyText = (text) => {
  navigator.clipboard.writeText(text);
};

/*-------------------
         XHR
--------------------*/

export const getText = async (src) => {
  const response = await fetch(src);
  return await response.text();
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

export const isBoolean = (x) => {
  return typeof x == 'boolean';
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

export const isArguments = function (obj) {
  return Object.prototype.toString.call(obj) === '[object Arguments]';
};

export const isDOM = (element) => {
  if (typeof window === 'undefined') {
    return true; // ssr or not a browser
  }
  return (
    element instanceof Element ||
    element instanceof Document ||
    element === window ||
    element instanceof DocumentFragment
  );
};

export const isNode = (el) => {
  return !!(el && el.nodeType);
};

export const isEmpty = (x) => {
  // we want nullish here
  if (x == null) {
    return true;
  }
  if (isArray(x) || isString(x)) {
    return x.length === 0;
  }
  for (let key in x) {
    if (x[key]) {
      return false;
    }
  }
  return true;
};

/*-------------------
        Date
--------------------*/

export const formatDate = function (date, format) {
  const pad = (n) => (n < 10 ? '0' + n : n);
  const dateMap = {
    YYYY: date.getFullYear(),
    YY: date.getFullYear().toString().slice(-2),
    MMMM: date.toLocaleString('default', { month: 'long' }),
    MMM: date.toLocaleString('default', { month: 'short' }),
    MM: pad(date.getMonth() + 1),
    M: date.getMonth() + 1,
    DD: pad(date.getDate()),
    D: date.getDate(),
    Do:
      date.getDate() +
        ['th', 'st', 'nd', 'rd'][
          ((((date.getDate() + 90) % 100) - 10) % 10) - 1
        ] || 'th',
    dddd: date.toLocaleString('default', { weekday: 'long' }),
    ddd: date.toLocaleString('default', { weekday: 'short' }),
    HH: pad(date.getHours()),
    h: date.getHours() % 12 || 12,
    mm: pad(date.getMinutes()),
    ss: pad(date.getSeconds()),
    a: date.getHours() >= 12 ? 'pm' : 'am',
  };

  const formatMap = {
    LT: 'h:mm a',
    LTS: 'h:mm:ss a',
    L: 'MM/DD/YYYY',
    l: 'M/D/YYYY',
    LL: 'MMMM D, YYYY',
    ll: 'MMM D, YYYY',
    LLL: 'MMMM D, YYYY h:mm a',
    lll: 'MMM D, YYYY h:mm a',
    LLLL: 'dddd, MMMM D, YYYY h:mm a',
    llll: 'ddd, MMM D, YYYY h:mm a',
  };

  const expandedFormat = formatMap[format] || format;

  return expandedFormat
    .replace(
      /\b(?:YYYY|YY|MMMM|MMM|MM|M|DD|D|Do|dddd|ddd|HH|h|mm|ss|a)\b/g,
      (match) => {
        return dateMap[match];
      }
    )
    .replace(/\[(.*?)\]/g, (match, p1) => p1);
};

/*-------------------
      Functions
--------------------*/

/*
  Efficient no operation func
*/
export const noop = function () {};

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
  return str
    .replace(/\b(\w)/g, (match, capture) => capture.toUpperCase())
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
  if(!isString(str)) {
    return;
  }
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
  if (!length) return;

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
  Get first element(s) from array
*/
export const first = (array, number = 1) => {
  const { length } = array;
  if (!length) return;

  if (number === 1) {
    // Return the first element
    return array[0];
  }
  else {
    // Return the first number elements as a new array
    return array.slice(0, number);
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
  return Array(length)
    .fill()
    .map((x, index) => {
      return index * step + start;
    });
};

export const sum = (values) => {
  return values.reduce((acc, num) => acc + num, 0);
};

export const where = (array, properties) => {
  return array.filter((obj) =>
    Object.keys(properties).every((key) => obj[key] === properties[key])
  );
};

export const flatten = (arr) => {
  return arr.reduce((acc, val) => {
    return Array.isArray(val) ? acc.concat(flatten(val)) : acc.concat(val);
  }, []);
};

export const some = (collection, predicate) => {
  return (collection?.some)
    ? collection.some(predicate)
    : false
  ;
};
export const any = some;

export const sortBy = function (arr, key, comparator) {
  const compare = (a, b) => {
    const valA = get(a, key);
    const valB = get(b, key);

    if (valA === undefined && valB === undefined) return 0;
    if (valA === undefined) return 1; // Place undefined values at the end
    if (valB === undefined) return -1; // Place undefined values at the end

    if (comparator) {
      return comparator(valA, valB, a, b);
    }

    if (valA < valB) return -1;
    if (valA > valB) return 1;
    return 0;
  };

  return arr.slice().sort(compare);
};

export const groupBy = function(array, property) {
  return array.reduce((result, obj) => {
    const key = get(obj, property);
    if (key !== undefined) {
      if (!result[key]) {
        result[key] = [];
      }
      result[key].push(obj);
    }
    return result;
  }, {});
}

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
      .filter(([key, value]) => callback(value, key))
  );
};

export const mapObject = (obj, callback) => {
  return Object.fromEntries(
    Object.entries(obj)
      .map(([key, value]) => [key, callback(value, key)])
  );
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

export const pick = (obj, ...keys) => {
  let copy = {};
  each(keys, function (key) {
    if (key in obj) {
      copy[key] = obj[key];
    }
  });
  return copy;
};

export const arrayFromObject = (obj) => {
  if(isArray(obj)) {
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
export const get = function (obj, path = '') {
  if (typeof path !== 'string') {
    return undefined;
  }

  function extractArrayLikeAccess(part) {
    const key = part.substring(0, part.indexOf('['));
    const index = parseInt(part.substring(part.indexOf('[') + 1, part.indexOf(']')), 10);
    return { key, index };
  }

  function getCombinedKey(path) {
    const dotIndex = path.indexOf('.');
    if (dotIndex !== -1) {
      const nextDotIndex = path.indexOf('.', dotIndex + 1);
      if (nextDotIndex !== -1) {
        return path.slice(0, nextDotIndex);
      }
    }
    return path;
  }

  if (obj === null || !isObject(obj)) {
    return undefined;
  }

  const parts = path.split('.');
  let currentObject = obj;

  for (let i = 0; i < parts.length; i++) {
    if (currentObject === null || !isObject(currentObject)) {
      return undefined;
    }

    let part = parts[i];

    if (part.includes('[')) {
      const { key, index } = extractArrayLikeAccess(part);

      if (key in currentObject && isArray(currentObject[key]) && index < currentObject[key].length) {
        currentObject = currentObject[key][index];
      } else {
        return undefined;
      }
    } else {
      if (part in currentObject) {
        currentObject = currentObject[part];
      } else {
        const remainingPath = parts.slice(i).join('.');
        if (remainingPath in currentObject) {
          currentObject = currentObject[remainingPath];
          break;
        } else {
          const combinedKey = getCombinedKey(`${part}.${parts[i + 1]}`);
          if (combinedKey in currentObject) {
            currentObject = currentObject[combinedKey];
            i++;
          } else {
            return undefined;
          }
        }
      }
    }
  }

  return currentObject;
};

/* This is useful for callbacks or other scenarios where you want to avoid the
   values of a reference object becoming stale when a source object changes
*/
export const proxyObject = (sourceObj = noop, referenceObj = {}) => {
  return new Proxy(referenceObj, {
    get: (target, property) => {
      return get(referenceObj, property) || get(sourceObj(), property);
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
  if (!src || typeof src !== 'object') return src;

  if (seen.has(src)) return seen.get(src);

  let copy;
  /*if (src.nodeType && 'cloneNode' in src) {
    copy = src.cloneNode(true);
    seen.set(src, copy);
  }
  else */if (src instanceof Date) {
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

/*-------------------
       RegExp
--------------------*/

/*
  Escape Special Chars for RegExp
*/
export const escapeRegExp = (string) => {
  return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
};

export const escapeHTML = (string) => {
  const htmlEscapes = {
    '&': '&amp',
    '<': '&lt',
    '>': '&gt',
    '"': '&quot',
    "\'": '&#39'
  };
  const htmlRegExp = /[&<>"']/g;
  const hasHTML = RegExp(htmlRegExp.source);
  return (string && hasHTML.test(string))
    ? string.replace(htmlRegExp, (chr) => htmlEscapes[chr])
    : string
  ;
};

/*-------------------
      Identity
--------------------*/

export const tokenize = (str = '') => {
  return (str || '').replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/_/g, '-')
    .toLowerCase()
  ;
};

export const prettifyID = (num) => {
  num = parseInt(num, 10);
  if (num === 0) return '0';
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
  if (
    input &&
    input.toString === Object.prototype.toString &&
    typeof input === 'object'
  ) {
    try {
      str = JSON.stringify(input);
    } catch (error) {
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
      k = (k * c1) & 0xffffffff;
      k = (k << 15) | (k >>> 17);
      k = (k * c2) & 0xffffffff;
      h1 ^= k;
      h1 = (h1 << 13) | (h1 >>> 19);
      h1 = (h1 * 5 + 0xe6546b64) & 0xffffffff;
    };

    for (let i = 0; i < key.length; i += 4) {
      let k =
        (key.charCodeAt(i) & 0xff) |
        ((key.charCodeAt(i + 1) & 0xff) << 8) |
        ((key.charCodeAt(i + 2) & 0xff) << 16) |
        ((key.charCodeAt(i + 3) & 0xff) << 24);
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
    h1 = (h1 * 0x85ebca6b) & 0xffffffff;
    h1 ^= h1 >>> 13;
    h1 = (h1 * 0xc2b2ae35) & 0xffffffff;
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


/*-------------------
      Constants
--------------------*/

export const isServer = (() => {
  return typeof window === 'undefined';
})();

export const isClient = (() => {
  return typeof window !== 'undefined';
})();


import * as _ from './utils.js';
export default _;
