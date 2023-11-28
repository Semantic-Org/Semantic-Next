(() => {
  // src/lib/utils.js
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

  // src/lib/sui-helpers.js
  var getAttributesFromUIDefinition = (definition) => {
    let attributes = [];
    let getAttributes = function(type) {
      let options = type.options || [type];
      each(options, (option) => {
        if (option.attribute) {
          attributes.push(option.attribute);
        }
      });
    };
    each(definition.types, getAttributes);
    each(definition.variations, getAttributes);
    each(definition.states, getAttributes);
    attributes = unique(attributes);
    attributes = removeUndefined(attributes);
    return attributes;
  };
})();
