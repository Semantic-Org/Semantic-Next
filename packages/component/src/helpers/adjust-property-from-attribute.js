import { get, each, unique, firstMatch, inArray, isString, kebabToCamel, camelToKebab } from '@semantic-ui/utils';

/*
  Semantic UI supports 3 dialects to support this we
  check if attribute is a property and reflect the value

  <ui-button size="large"> // verbose
  <ui-button large> // concise
  <ui-button class="large"> // classic

  Semantic also supports fuzzing on attribute values like
  icon="right arrow" icon="arrow-right" icon="right-arrow"

*/
const SPACE_REGEX = /\s+/mg;

const SPECIAL_ATTRIBUTES = ['disabled', 'value'];

// allow 'arrow-down' or 'down-arrow'
const reverseDashes = (string) => {
  if(isString(string)) {
    return string.split('-').reverse().join('-');
  }
  return string;
};

// allow 'down arrow' or 'down-arrow' to be used
const tokenizeSpaces = (string) => {
  if(isString(string)) {
    return string.replaceAll(SPACE_REGEX, '-');
  }
  return string;
};


/* This handles adjusting the underlying properties to match when
  an attribute changes. This handles 3 primary cases

  - The attribute changes emphasis="primary"
  - The option is the attribute "primary" or "primary=true"
  - The option is a class class="primary"
*/
export const adjustPropertyFromAttribute = (el, attribute, attributeValue, componentSpec) => {

  // This is used to search for potential values that should match to the canonical value.
  // This is because we support swapping ordering and spaces for dashes

  // note "optionAttributeValue" is the value of the option attribute i.e. "somevalue" here
  // i.e <ui-button left-attached="somevalue">

  const checkSpecForAllowedValue = ({attribute, optionValue, optionAttributeValue }) => {

    // "arrow down" -> arrow-down
    optionValue = tokenizeSpaces(optionValue);

    let optionsToCheck = [optionValue];

    // <div attached="left" or <div left-attached>
    if(attribute && optionValue) {
      optionsToCheck.push(`${attribute}-${attributeValue}`);
      optionsToCheck.push(`${attributeValue}-${attribute}`);
    }

    //  "arrow-down" or "down-arrow"
    optionsToCheck.push(reverseDashes(optionValue));

    optionsToCheck = unique(optionsToCheck);

    // check each potential value to see if any match a known option
    const matchingValue = firstMatch(optionsToCheck, (currentValue) => get(componentSpec.optionAttributes, currentValue));

    // this attribute value does not seem to match any in spec
    if(!matchingValue) {
      return { matchingAttribute: undefined, matchingValue: undefined };
    }

    // this attribute doesn't seem to match the schema for the attribute
    // perhaps this is an overlap in naming between an option and something else
    if(inArray(attributeValue?.constructor, [Object, Array, Function])) {
      return { matchingAttribute: undefined, matchingValue: undefined };
    }

    // now we know the matching value is the correct name lets grab the attribute name
    const matchingAttribute = get(componentSpec.optionAttributes, matchingValue);
    return { matchingAttribute: matchingAttribute, matchingValue: matchingValue };
  };


  // this assigns the value to the DOM element
  const setProperty = (attribute, value) => {

    // convert <div icon-after> to => el.iconAfter
    const property = kebabToCamel(attribute);
    if(value !== undefined && el[property]) {
      el[property] = value;
    }

    // this appears to be necessary for special attributes like "disabled"
    if(inArray(attribute, SPECIAL_ATTRIBUTES)) {
      el.requestUpdate();
    }
  };

  // this removes the related propery from the element
  const removeProperty = (attribute) => {
    // convert <div icon-after> to => el.iconAfter
    const property = kebabToCamel(attribute);
    el[property] = null;

    // this appears to be necessary for special attributes like "disabled"
    if(inArray(attribute, SPECIAL_ATTRIBUTES)) {
      el.requestUpdate();
    }
  };

  // this checks for boolean values like <ui-button disabled>
  const isBooleanValue = (attribute, attributeValue) => {

    // handles basic booleans of type Boolean in spec
    const isBooleanType = componentSpec.propertyTypes[attribute] == Boolean;

    // handles complex booleans where one value of allowed values is a identity, i.e. disabled, clickable-disabled
    const isIdentityBoolean = componentSpec.optionAttributes[attribute] == attribute;

    // this is a scenario where a grouping has a default styling like `animated`
    const isAttributeClass = inArray(attribute, componentSpec.attributeClasses);

    return (isBooleanType || isAttributeClass || isIdentityBoolean) && inArray(attributeValue, ['', true, attribute]);
  };

  if (componentSpec) {

    // syntax <ui-button class="large primary"></ui-button>
    // we want to check attribute for each class
    if (attribute == 'class' && attributeValue) {
      each(attributeValue.split(' '), (className) => {
        adjustPropertyFromAttribute(el, className, true, componentSpec);
      });
    }

    // syntax <ui-button size="large">
    // we can check if this property is defined
    else if (inArray(attribute, componentSpec.attributes)) {

      // check if this is a boolean value
      if(isBooleanValue(attribute, attributeValue)) {
        attributeValue = true;
        setProperty(attribute, attributeValue);
        return;
      }

      // check if the attribute was removed (null)
      if(attributeValue === null) {
        removeProperty(attribute);
        return;
      }

      if(attributeValue === undefined) {
        return;
      }

      // we still need to transform values from "arrow down" to "arrow-down" or "down-arrow"
      const { matchingValue } = checkSpecForAllowedValue({
        attribute,
        optionValue: attributeValue
      });

      // any other value could be a property
      if(matchingValue) {
        setProperty(attribute, matchingValue);
      }
    }

    // syntax <ui-button primary>
    // we need to lookup the property using the optionAttributes lookup table
    else if(attributeValue !== undefined) {

      // lets check to see if this is a valid property by checking allowed values
      const { matchingAttribute, matchingValue } = checkSpecForAllowedValue({
        optionValue: attribute,
        optionAttributeValue: attributeValue
      });

      // remove the matching attribute if the value is removed
      // but ONLY if the current value is the option value
      // this is because attribute changed handlers can fire in any order
      if(matchingAttribute && attributeValue === null) {
        if(el[matchingAttribute] == attribute) {
          removeProperty(matchingAttribute);
        }
        return;
      }

      if (matchingAttribute && matchingValue) {
        setProperty(matchingAttribute, matchingValue);
      }
    }
  }

};
