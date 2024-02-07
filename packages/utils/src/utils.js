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
  } else {
    setTimeout(throwError, 0);
  }
};

/*-------------------
        Types
--------------------*/

export const isObject = (x) => {
  return typeof x == 'object';
};

export const isPlainObject = (x) => {
  return isObject(x) && x.constructor === Object;
};

export const isString = (x) => {
  return typeof x == 'string';
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

export const isFunction = (x) =>{
  return typeof x == 'function' || false;
};

export const isPromise = (x) => {
  return x && isFunction(x.then);
};

export const isArguments = function(obj) {
  return !!(obj && get(obj, 'callee'));
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
    'a': date.getHours() >= 12 ? 'pm' : 'am'
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
    'llll': 'ddd, MMM D, YYYY h:mm a'
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
export const noop = function(){};

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

export const capitalizeWords = (str = '') => {
  return str.replace(/\b(\w)/g, (match, capture) => capture.toUpperCase())
    .replace(/\b(\w+)\b/g, (match) => match.toLowerCase())
    .replace(/\b(\w)/g, (match) => match.toUpperCase())
  ;
};

export const toTitleCase = (str = '') => {
  const stopWords = ['the', 'a', 'an', 'and', 'but', 'for', 'at', 'by', 'from', 'to', 'in', 'on', 'of', 'or', 'nor', 'with', 'as'];
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
  return arr.filter(val => val);
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
  } else {
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
    : (val) => isEqual(val, callbackOrValue)
  ;
  const index = findIndex(array, callback);
  if(index > -1) {
    array.splice(index, 1);
    return true;
  }
  return false;
};


export const inArray = (value, array = []) => {
  return array.indexOf(value) > -1;
};

export const range = (start, stop, step = 1) => {
  if(!stop) {
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
  let index = objKeys.length;
  let newObj = {};
  while(index--) {
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
    if(source) {
      for (prop in source) {
        descriptor = Object.getOwnPropertyDescriptor(source, prop);
        if(descriptor === undefined) {
          obj[prop] = source[prop];
        } else {
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
    .replace(/\[(\w+)\]/g, '.$1')
  ;
  const stringParts = string.split('.');
  for(let index = 0, length = stringParts.length; index < length; ++index) {
    const part = stringParts[index];
    if(!!obj && part in obj) {
      obj = obj[part];
    }
    else {
      return;
    }
  }
  return obj;
};

/*
  Return true if non-inherited property
*/
export const hasProperty = (obj, prop) => {
  return Object.hasOwn.call(obj, prop);
};

/*
  Reverses a lookup object
  start { a: 1, b: [1, 2] }
  end { 1: ['a', 'b'], 2: 'b' }
*/
export const reverseKeys = (obj) => {
  const newObj = {};
  const pushValue = (key, value) => {
    if(isArray(newObj[key])) {
      newObj[key].push(value);
    }
    else if(newObj[key]) {
      newObj[key] = [ newObj[key], value ];
    }
    else {
      newObj[key] = value;
    }
  };
  Object.keys(obj).forEach(key => {
    if(isArray(obj[key])) {
      each(obj[key], subKey => {
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
export const clone = obj => {
  let ret;
  if (!isObject(obj)) {
    return obj;
  }

  if (obj === null) {
    return null; // null has typeof "object"
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // RegExps are not really EJSON elements (eg we don't define a serialization
  // for them), but they're immutable anyway, so we can support them in clone.
  if (obj instanceof RegExp) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(clone);
  }

  if (isArguments(obj)) {
    return Array.from(obj).map(clone);
  }

  // handle general user-defined typed Objects if they haobje a clone method
  if (isFunction(obj.clone)) {
    return obj.clone();
  }

  // handle other objects
  ret = {};
  keys(obj).forEach((key) => {
    ret[key] = clone(obj[key]);
  });
  return ret;
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
  } else {
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
  if (input && input.toString === Object.prototype.toString && typeof input === 'object') {
    try {
      str = JSON.stringify(input);
    } catch (error) {
      console.error('Error serializing input', error);
      return 0;
    }
  } else {
    str = input.toString();
  }

  const seed = 0x12345678;

  const murmurhash = (key, seed) => {
    let remainder, bytes, h1, h1b, c1, c1b, c2, c2b, k1, i;

    remainder = key.length & 3;
    bytes = key.length - remainder;
    h1 = seed;
    c1 = 0xcc9e2d51;
    c2 = 0x1b873593;
    i = 0;

    while (i < bytes) {
      k1 =
        ((key.charCodeAt(i) & 0xff)) |
        ((key.charCodeAt(++i) & 0xff) << 8) |
        ((key.charCodeAt(++i) & 0xff) << 16) |
        ((key.charCodeAt(++i) & 0xff) << 24);
      ++i;

      k1 = ((((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16))) & 0xffffffff;
      k1 = (k1 << 15) | (k1 >>> 17);
      k1 = ((((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16))) & 0xffffffff;

      h1 ^= k1;
      h1 = (h1 << 13) | (h1 >>> 19);
      h1b = ((((h1 & 0xffff) * 5) + ((((h1 >>> 16) * 5) & 0xffff) << 16))) & 0xffffffff;
      h1 = (((h1b & 0xffff) + 0x6b64) + ((((h1b >>> 16) + 0xe654) & 0xffff) << 16));
    }

    k1 = 0;

    switch (remainder) {
      case 3: k1 ^= (key.charCodeAt(i + 2) & 0xff) << 16;
      case 2: k1 ^= (key.charCodeAt(i + 1) & 0xff) << 8;
      case 1: k1 ^= (key.charCodeAt(i) & 0xff);

        k1 = (((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16)) & 0xffffffff;
        k1 = (k1 << 15) | (k1 >>> 17);
        k1 = (((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16)) & 0xffffffff;
        h1 ^= k1;
    }

    h1 ^= key.length;

    h1 ^= h1 >>> 16;
    h1 = (((h1 & 0xffff) * 0x85ebca6b) + ((((h1 >>> 16) * 0x85ebca6b) & 0xffff) << 16)) & 0xffffffff;
    h1 ^= h1 >>> 13;
    h1 = ((((h1 & 0xffff) * 0xc2b2ae35) + ((((h1 >>> 16) * 0xc2b2ae35) & 0xffff) << 16))) & 0xffffffff;
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
export const isEqual = (a, b, options = {}) => {
  let i;
  if (a === b) {
    return true;
  }

  if (Number.isNaN(a) && Number.isNaN(b)) {
    return true;
  }

  if (!a || !b) {
    return false;
  }

  if (!(isObject(a) && isObject(b))) {
    return false;
  }

  if (a instanceof Date && b instanceof Date) {
    return a.valueOf() === b.valueOf();
  }

  if (isBinary(a) && isBinary(b)) {
    if (a.length !== b.length) {
      return false;
    }
    for (i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) {
        return false;
      }
    }
    return true;
  }

  if (isFunction(a.equals)) {
    return a.equals(b, options);
  }

  if (isFunction(b.equals)) {
    return b.equals(a, options);
  }

  if (a instanceof Array) {
    if (!(b instanceof Array)) {
      return false;
    }
    if (a.length !== b.length) {
      return false;
    }
    for (i = 0; i < a.length; i++) {
      if (!isEqual(a[i], b[i], options)) {
        return false;
      }
    }
    return true;
  }


  // check obj equality
  let ret;
  const aKeys = keys(a);
  const bKeys = keys(b);
  if (options.keyOrderSensitive) {
    i = 0;
    ret = aKeys.every(key => {
      if (i >= bKeys.length) {
        return false;
      }
      if (key !== bKeys[i]) {
        return false;
      }
      if (!isEqual(a[key], b[bKeys[i]], options)) {
        return false;
      }
      i++;
      return true;
    });
  } else {
    i = 0;
    ret = aKeys.every(key => {
      if (!b[key]) {
        return false;
      }
      if (!isEqual(a[key], b[key], options)) {
        return false;
      }
      i++;
      return true;
    });
  }
  return ret && i === bKeys.length;
};


import * as _ from './utils';
export default _;
