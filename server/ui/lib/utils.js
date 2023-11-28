(() => {
  // src/lib/utils.js
  var hashCode = function(str) {
    let hash = 0;
    if (str.length === 0) {
      return hash;
    }
    for (let i = 0; i < str.length; i++) {
      let char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return hash;
  };
  var keys = function(obj) {
    return Object.keys(obj);
  };
  var unique = function(arr) {
    return Array.from(new Set(arr));
  };
  var removeUndefined = function(arr) {
    return arr.filter((val) => val);
  };
  var each = function(obj, func, context) {
    if (obj === null) {
      return obj;
    }
    let createCallback = function(context2, func2) {
      if (context2 === void 0) {
        return func2;
      } else {
        return function(value, index, collection) {
          return func2.call(context2, value, index, collection);
        };
      }
    };
    let iteratee = createCallback(context, func);
    let i;
    if (obj.length === +obj.length) {
      for (i = 0; i < obj.length; ++i) {
        iteratee(obj[i], i, obj);
      }
    } else {
      let objKeys = keys(obj);
      for (i = 0; i < objKeys.length; ++i) {
        iteratee(obj[objKeys[i]], objKeys[i], obj);
      }
    }
    return obj;
  };
  var isObject = function(obj) {
    let type = typeof obj;
    if (type === "function" || type === "object" && !!obj) {
      return true;
    }
    return false;
  };
  var isString = function(str) {
    return typeof str == "string";
  };
  var isFunction = function(obj) {
    return typeof obj == "function" || false;
  };
  var isPlainObject = function(x) {
    return isObject(x) && x.constructor === Object;
  };
  var isPromise = function(p) {
    return p && isFunction(p.then);
  };
  var wrapFunction = function(x) {
    return isFunction(x) ? x : () => x;
  };
  var extend = function(obj, ...sources) {
    sources.forEach(function(source) {
      let descriptor, prop;
      if (source) {
        for (prop in source) {
          descriptor = Object.getOwnPropertyDescriptor(source, prop);
          if (descriptor === void 0) {
            obj[prop] = source[prop];
          } else {
            Object.defineProperty(obj, prop, descriptor);
          }
        }
      }
    });
    return obj;
  };
  function kebabToCamel(str) {
    return str.replace(/-([a-z])/g, (g) => {
      return g[1].toUpperCase();
    });
  }
  var _ = {
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
    kebabToCamel
  };
})();
