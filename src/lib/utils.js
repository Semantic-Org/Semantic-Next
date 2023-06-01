/*
  An underscore like simple utility belt
  to save time on common boilerplate
*/


/*
  Create a hash from a string
*/
export const hashCode = function(str) {
  let hash = 0;
  if (str.length === 0) {
    return hash;
  }

  for (let i = 0; i < str.length; i++) {
    let char = str.charCodeAt(i);
    hash = ((hash<<5)-hash)+char;
    hash = hash & hash; // Convert to 32bit integer
  }

  return hash;
};

/*
  Shorthand for Keys
*/
export const keys = function(obj) {
  return Object.keys(obj);
};


/*
  Simple Iterator
*/
export const each = function(obj, func, context) {
  if (obj === null) {
    return obj;
  }

  let createCallback = function(context, func){
    if (context === void 0) {
      return func;
    }
    else {
      return function(value, index, collection){
        return func.call(context, value, index, collection);
      };
    }
  };

  let iteratee = createCallback(context, func);

  let i;
  if (obj.length === +obj.length) {
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


/*
  Simple Type Checking
*/
export const isObject = function(obj) {
  let type = typeof obj;
  if (type === 'function' || ((type === 'object') && !!obj)){
    return true;
  }
  return false;
};

export const isString = function(str) {
  return typeof str == 'string';
};

export const isFunction = function(obj) {
  return typeof obj == 'function' || false;
};

export const isPlainObject = function(x) {
  return isObject(x) && x.constructor === Object;
};

export const isPromise = function(p) {
  return p && isFunction(p.then);
};


/*
  Call function even if its not defined
*/
export const wrapFunction = function(x) {
  return isFunction(x) ? x : () => x;
};

/*
  Handles properly copying getter/setters
*/
export const extend = function(obj, ...sources) {
  sources.forEach(function(source) {
    let descriptor, prop;
    if (source) {
      for (prop in source) {
        descriptor = Object.getOwnPropertyDescriptor(source, prop);
        if (descriptor === undefined) {
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
  HTML Attributes -> JS Properties
*/
export function kebabToCamel(str) {
  return str.replace(/-([a-z])/g, (g) => {
    return g[1].toUpperCase();
  });
}

export const _ = {
  hashCode,
  each,
  isObject,
  isFunction,
  isString,
  isPlainObject,
  isPromise,
  extend,
  wrapFunction,
  keys,
  kebabToCamel,
};
