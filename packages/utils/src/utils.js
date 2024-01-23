/*
  An simple utility belt
  to save time on common boilerplate
*/


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
  return isFunction(x) ? x : noop;
};

/*-------------------
       Strings
--------------------*/

/*
  HTML Attributes -> JS Properties
*/
export const kebabToCamel = (str) => {
  return str.replace(/-([a-z])/g, (g) => {
    return g[1].toUpperCase();
  });
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
export const last = function(array, n, guard) {
  if(!Array.isArray(array)) {
    return;
  }
  if ((!n) || guard) {
    return array[array.length - 1];
  } else {
    return slice.call(array, Math.max(array.length - n, 0));
  }
};

/*
  Iterate through returning first value
*/
export const firstMatch = (array = [], evaluator) => {
  let result;
  each(array, (value, name) => {
    const shouldReturn = evaluator(value, name);
    if(!result && shouldReturn == true) {
      result = value;
    }
  });
  return result;
};


export const inArray = (value, array = []) => {
  return array.indexOf(value) > -1;
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
  return Object.prototype.hasOwn.call(obj, prop);
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
  if(obj === null) {
    return obj;
  }

  let createCallback = (context, func) => {
    if(context === void 0) {
      return func;
    }
    else {
      return (value, index, collection) => {
        return func.call(context, value, index, collection);
      };
    }
  };

  let iteratee = createCallback(context, func);

  let i;
  if(obj.length === +obj.length) {
    for (i=0; i < obj.length; ++i){
      iteratee(obj[i], i, obj);
    }
  }
  else {
    let objKeys = keys(obj);
    for (i = 0; i < objKeys.length; ++i){
      iteratee(obj[objKeys[i]], objKeys[i], obj);
    }
  }
  return obj;
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

/*
  Create a hash from a string
*/
export const hashCode = (input) => {
  let str;

  // Check if input has a custom toString method, otherwise use JSON stringify for objects
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

  let hash = 0;
  if (str.length === 0) {
    return hash;
  }

  for (let i = 0; i < str.length; i++) {
    let char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  return hash;
};

/*
  Determine if two objects are equal
*/
export const isEqual = (a, b, options) => {
  let i;
  const keyOrderSensitive = !!(options && options.keyOrderSensitive);
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
  if (keyOrderSensitive) {
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
      if (!hasProperty(b, key)) {
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
