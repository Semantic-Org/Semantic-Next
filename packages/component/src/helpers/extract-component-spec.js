import { reverseKeys, flatten, isString, each } from '@semantic-ui/utils';

/*
  This takes quite a large spec file and reduces it to
  just the portions needed for the web component to function

  This is because the spec includes a lot of additional metadata
  and descriptive text which is useful for dev tools
*/

export const extractComponentSpec = (spec) => {

  let componentSpec = {
    contentAttributes: [],
    content: [],
    variations: [],
    types: [],
    states: [],
    settings: [],
    attributes: {},
    reverseAttributes: {},
    attributeClasses: [],
    defaultSettings: {},
    inheritedPluralVariations: [],
  };

  const getAttributeName = (part) => {
    if(part.attribute) {
      return part.attribute;
    }
    if(isString(part.name)) {
      return part.name.toLowerCase();
    }
  };

  const getSettingsFromSpecPart = (specPart) => {
    each(spec[specPart], (spec) => {

      const attributeName = getAttributeName(spec);

      if(!attributeName) {
        return;
      }

      // add to list of this spec part attributes
      componentSpec[specPart].push(attributeName);

      // allow spec to specify that the group class name should be included
      // i.e if enabled for 'attached' will output <class="attached left-attached">
      if(spec.includeAttributeClass) {
        componentSpec.attributeClasses.push(attributeName);
      }

      // record allowed values for attribute if this part uses attributes
      // functions and non-serializable content cannot use attributes
      let optionValues;
      if(spec.options) {
        optionValues = spec.options.map(option => {
          if(option?.value !== undefined) {
            return option.value;
          }
          return option;
        }).filter(Boolean);
        optionValues = flatten(optionValues);
      }
      else {
        // boolean
        optionValues = [true, false];
      }
      componentSpec.attributes[attributeName] = optionValues;

      // we handle slots in a special way
      if(specPart == 'content' && attributeName) {
        componentSpec.contentAttributes.push(attributeName);
      }

      // we handle settings in a special way
      if(specPart == 'settings' && spec.defaultValue !== undefined) {
        componentSpec.defaultSettings[attributeName] = spec.defaultValue;
      }
    });
  };

  getSettingsFromSpecPart('content');
  getSettingsFromSpecPart('types');
  getSettingsFromSpecPart('states');
  getSettingsFromSpecPart('variations');
  getSettingsFromSpecPart('settings');

  // avoid having to reverse array at runtime
  let reverseAttributes = reverseKeys(componentSpec.attributes);
  delete reverseAttributes.true;
  delete reverseAttributes.false;
  componentSpec.reverseAttributes = reverseAttributes;

  componentSpec.inheritedPluralVariations = spec.pluralSharedVariations;

  return componentSpec;
};
