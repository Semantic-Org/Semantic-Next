import { get, each, inArray, isString } from '@semantic-ui/utils';

/*
  Semantic UI supports 3 dialects to support this we
  check if attribute is a setting and reflect the value

  <ui-button size="large"> // verbose
  <ui-button large> // concise
  <ui-button class="large"> // classic

  Semantic also supports fuzzing on attribute values like
  icon="right arrow" icon="arrow-right" icon="right-arrow"

*/
const SPACE_REGEX = /\W+/mg;

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

export const adjustSettingFromAttribute = (el, attribute, attributeValue, spec) => {

  const getSettingValue = (setting, attributeValue) => {
    const value = tokenizeSpaces(attributeValue);
    const reverseValue = reverseDashes(value);
    const settings = get(spec.settings, setting);
    // regular match
    if(inArray(value, settings)) {
      return value;
    }
    if(inArray(reverseValue, settings)) {
      return reverseValue;
    }
  };

  const lookupSettingFromValue = (attributeValue) => {
    const value = tokenizeSpaces(attributeValue);
    const reverseValue = reverseDashes(value);
    const setting = get(spec.reverseSettings, value);
    return setting || get(spec.reverseSettings, reverseValue);
  };

  const setSetting = (setting, attributeValue) => {
    const value = getSettingValue(setting, attributeValue);
    if(value !== undefined) {
      el[setting] = value;
    }
  };

  const removeSetting = (setting) => {
    el[setting] = undefined;
  };

  const getSettingsFromClass = (classNames) => {
    each(classNames.split(' '), (className) => {
      adjustSettingFromAttribute(className, true);
    });
  };

  if (spec) {

    // syntax <ui-button class="large primary"></ui-button>
    // we want to check attribute for each class
    if (attribute == 'class' && attributeValue) {
      getSettingsFromClass(attributeValue);
    }

    // syntax <ui-button size="large">
    // we can check if this setting is defined
    else if (get(spec.settings, attribute)) {
      if(attributeValue === '') {
        // boolean attribute
        attributeValue = true;
      }

      if(attributeValue !== undefined) {
        setSetting(attribute, attributeValue);
      }
    }

    // syntax <ui-button primary large>
    // we need to lookup the setting using the reverseSetting lookup table
    else if(attributeValue !== undefined) {
      const setting = lookupSettingFromValue(attribute);

      // when a value is unset it is passed null in this case a boolean attribute was removed
      if(attributeValue === null) {
        removeSetting(setting);
      }
      else if (setting !== undefined) {
        setSetting(setting, attribute);
      }

    }
  }
};
