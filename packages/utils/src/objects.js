import { each } from './collections.js';
import { isArray, isObject } from './types.js';

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



/*
  Searches a search object
  returning matches for a query

  Matches are sorted
    - Start of word
    - Start of any word
    - Anywhere in string
*/
export const weightedObjectSearch = (query = '', objectArray = [], {
  returnMatches = false,
  matchAllWords = true,
  propertiesToMatch = []
} = {}) => {
  if(!query) {
    return objectArray;
  }
  query = query.trim();
  query = escapeRegExp(query);
  let
    words       = query.split(' '),
    wordRegexes = [],
    regexes     = {
      startsWith     : new RegExp(`^${query}`, 'i'),
      wordStartsWith : new RegExp(`\\s${query}`, 'i'),
      anywhere       : new RegExp(query, 'i')
    },
    weights = {
      startsWith     : 1,
      wordStartsWith : 2,
      anywhere       : 3,
      anyWord        : 4,
    },
    calculateWeight = (obj) => {
      let
        matchDetails = [],
        weight
      ;
      // do a weighted search across all fields
      each(propertiesToMatch, (field) => {
        let
          value = get(obj, field),
          fieldWeight
        ;
        if(value) {
          each(regexes, (regex, name) => {
            if(fieldWeight) {
              return;
            }
            if(String(value).search(regex) !== -1) {
              fieldWeight = weights[name];
              if(returnMatches) {
                matchDetails.push({
                  field,
                  query,
                  name,
                  value,
                  weight: fieldWeight,
                });
              }
            }
          });
          // match any word higher score for more words
          if(!weight && wordRegexes.length) {
            let wordsMatching = 0;
            each(wordRegexes, regex => {
              if(String(value).search(regex) !== -1) {
                wordsMatching++;
              }
            });
            if(wordsMatching > 0) {
              if(!matchAllWords || (matchAllWords && wordsMatching === wordRegexes.length)) {
                fieldWeight = weights['anyWord'] / wordsMatching;
                if(returnMatches) {
                  matchDetails.push({
                    field,
                    query,
                    name: 'anyWord',
                    value,
                    matchCount: wordsMatching
                  });
                }
              }
            }
          }
          if(fieldWeight && (!weight || fieldWeight < weight)) {
            weight = fieldWeight;
          }
        }
      });
      // flag for removal if not a match
      if(returnMatches) {
        obj.matches = matchDetails;
      }
      obj.remove = !weight;
      return weight;
    }
  ;
  if(objectArray.length == 1) {
    objectArray.push([]);
  }

  if(words.length > 1) {
    each(words, word => {
      wordRegexes.push(new RegExp(`(\W|^)${word}(\W|$)`, 'i'));
    });
  }

  each(objectArray, obj => {
    // clear previous remove flag and weight if present
    delete obj.remove;
    delete obj.weight;

    obj.weight = calculateWeight(obj);
  });

  let result = objectArray
    .filter(obj => !obj.remove)
    .sort((a, b) => {
      return a.weight - b.weight;
    })
  ;
  return result;
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
