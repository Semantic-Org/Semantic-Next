import {
  each,
  unique,
  removeUndefined
} from './utils';

export const getAttributesFromUIDefinition = (definition) => {

  let attributes = [];

  let getAttributes = function(type) {
    // support shorthand
    let options = type.options || [type];
    each(options, (option) => {
      if(option.attribute) {
        attributes.push(option.attribute);
      }
    });
  };

  // add in attributes from all types, variations and states
  each(definition.types, getAttributes);
  each(definition.variations, getAttributes);
  each(definition.states, getAttributes);

  // prevent sillyness
  attributes = unique(attributes);
  attributes = removeUndefined(attributes);

  return attributes;

};


