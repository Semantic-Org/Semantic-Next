/*-------------------
        Types
--------------------*/

export const isObject = (x) => {
  return x !== null && typeof x == 'object';
};

export const isPlainObject = (x) => {
  if (!isObject(x)) { return false; }
  const proto = Object.getPrototypeOf(x);
  return proto === null || proto === Object.prototype;
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
  return ArrayBuffer.isView(x) || x instanceof ArrayBuffer;
};

export const isFunction = (x) => {
  return typeof x == 'function';
};

export const isPromise = (x) => {
  return x && isFunction(x.then);
};

export const isDate = (x) => {
  return toString.call(x) === '[object Date]';
};

export const isRegExp = (x) => {
  return toString.call(x) === '[object RegExp]';
};

const toString = Object.prototype.toString;

export const isArguments = (obj) => {
  return toString.call(obj) === '[object Arguments]';
};

export const isDOM = (element) => {
  if (typeof window === 'undefined') {
    return true; // ssr or not a browser
  }
  return (
    element instanceof Element
    || element instanceof Document
    || element === window
    || element instanceof DocumentFragment
  );
};

export const isNode = (el) => {
  return !!(el && el.nodeType);
};

export const isEmpty = (x) => {
  // we are using 'nullish' as empty
  if (x == null) {
    return true;
  }
  if (isArray(x) || isString(x)) {
    return x.length === 0;
  }
  for (const key in x) {
    if (Object.hasOwn(x, key) && x[key] != null) {
      return false;
    }
  }
  return true;
};

export const isIterable = x => {
  return isFunction(x?.[Symbol.iterator]);
};

export const isMap = (x) => {
  return toString.call(x) === '[object Map]';
};

export const isSet = (x) => {
  return toString.call(x) === '[object Set]';
};

const builtInTypes = new Set([
  'Object',
  'Array',
  'Date',
  'RegExp',
  'Map',
  'Set',
  'Error',
  'Uint8Array',
  'Int8Array',
  'Uint16Array',
  'Int16Array',
  'Uint32Array',
  'Int32Array',
  'Float32Array',
  'Float64Array',
  'BigInt64Array',
  'BigUint64Array',
  'NodeList',
]);

export const isClassInstance = (obj) => {
  if (obj === null || typeof obj !== 'object') {
    return false;
  }

  const constructorName = Object.getPrototypeOf(obj)?.constructor?.name;
  if (!constructorName) { return false; }

  return !builtInTypes.has(constructorName);
};
