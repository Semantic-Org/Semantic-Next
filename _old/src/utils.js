/*
  An underscore like simple utility belt
  to save time on common boilerplate
*/

// Taken from http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
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

export const keys = function(obj) {
  let keys = Object.keys(obj);
  let key;
  if (keys) {
    // modern
    return keys;
  }
  else {
    // old
    keys = [];
    for (key in obj){
      if (Object.hasOwnProperty.call(obj, key)){
        keys.push[key];
      }
    }
    return keys;
  }
};

export const each = function(obj, func, context) {
  if (obj === null) {
    return obj;
  }

  let createCallback = function(context, func){
    // if undefined simply return func.
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


export const isObject = function(obj) {
  let type = typeof obj;
  if (type === 'function' || ((type === 'object') && !!obj)){
    return true;
  }
  return false;
};

export const isFunction = function(obj) {
  return typeof obj == 'function' || false;
};

export const wrapFunction = function(x) {
  return isFunction(x) ? x : () => x;
};

export const isPlainObject = function(x) {
  return isObject(x) && x.constructor === Object;
};

export const isPromise = function(p) {
  return p && isFunction(p.then);
};

// Change extend so that it copies getters/setters properly
// See http://rinat.io/blog/mixing-in-and-extending-javascript-getters-and-setters
export const extend = function(obj) {

  let args = new Array(arguments.length);
  let i = 0;

  for(i; i < args.length; ++i) {
    args[i] = arguments[i];
  }

  args.slice(1).forEach(function(source) {
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

export const _ = {
  hashCode,
  each,
  isObject,
  isFunction,
  isPlainObject,
  isPromise,
  extend,
  wrapFunction,
  keys,
};
