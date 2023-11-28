import { each, inArray, get, firstMatch, unique, filterEmpty } from './utils';

export const convertStringifiedSettings = (value, { emptyStringIsTruthy = false } = {}) => {
  // with attribute tags "" is a set value
  if(emptyStringIsTruthy && value === '') {
    return true;
  }
  if(value === 'true' || value === true) {
    return true;
  }
  if(value === 'false') {
    return false;
  }
  if(value == 'undefined' || value == 'null' || value === null) {
    return undefined;
  }
  return value;
};

export const getSettingValue = (
  element,
  name = 'sizing',
  definition = element?.definition
) => {
  const attrValue = convertStringifiedSettings(element.getAttribute(name), {
    emptyStringIsTruthy: true
  });
  return (attrValue === undefined)
    ? element[name]
    : attrValue
  ;
};

/* Return the searchable parts of a type definition based on element type */
export const getDefinitionParts = (type) => {
  const typeParts = {
    element: ['types', 'variations', 'states'],
  };
  return get(typeParts, type) || [];
};

export const getDefinitionSlice = (
  name,
  definition
) => {

  const definitionParts = getDefinitionParts(definition.uiType);

  let match;
  each(definitionParts, part => {
    const definitionPart = definition[part];
    if(!match) {
      match = firstMatch(definitionPart, element => {
        if(element.attribute === name) {
          return true;
        }
        const options = (element.options || []).map(option => option.value);
        return inArray(name, options);
      });
    }
  });
  return match;
};

export const getUISettings = (
  element,
  definition = element?.definition
) => {
  const settings = {};
  const definitionParts = getDefinitionParts(definition.uiType);
  each(definitionParts, (part) => {

    const definitionPart = definition[part];

    each(definitionPart, (definitionSlice) => {

      let attribute = definitionSlice.attribute || (definitionSlice.name || '').toLowerCase();
      let value = getSettingValue(element, attribute);
      let classNames = [...element.classList];
      let options = definitionSlice.options || [definitionSlice.options].filter(Boolean);

      // the <ui large> case
      if(value == undefined && options.length) {
        const match = firstMatch(options, (option) => getSettingValue(element, option.value));
        value = match?.value;
      }

      // the <ui-button class="large"> case
      if(value == undefined && classNames.length) {
        const optionValues = options.map(option => option.value);
        if(optionValues.length) {
          value = firstMatch(classNames, (className) => inArray(className, optionValues));
        }
      }

      // add value to settings
      if(value) {
        settings[attribute] = value;
      }

    });

  });
  return settings;
};

export const getAllowedAttributes = (definition) => {

  let attributes = [];

  let getAttributes = function(type) {

    if(type.attribute) {
      attributes.push(type.attribute);
    }

    // support array shorthand i.e. [] or ''
    let options = type.options || [type].filter(Boolean);
    each(options, (option) => {
      if(option.value) {
        attributes.push(option.value);
      }
    });
  };

  // add in attributes from all types, variations and states
  each(definition.types, getAttributes);
  each(definition.variations, getAttributes);
  each(definition.states, getAttributes);

  attributes = unique( filterEmpty(attributes) );

  return attributes;

};


import * as helpers from './sui-helpers';
export default helpers;

