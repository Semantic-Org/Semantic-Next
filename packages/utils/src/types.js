
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

export const isClassInstance = (obj) => {
  if (obj === null || typeof obj !== 'object') {
    return false;
  }

  const proto = Object.getPrototypeOf(obj);
  const constructorName = proto.constructor.name;

  const builtInTypes = [
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
  ];

  return !builtInTypes.includes(constructorName);
};
