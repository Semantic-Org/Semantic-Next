import { reverseKeys, flatten, each } from '@semantic-ui/utils';

/*
  This takes quite a large spec file and reduces it to
  just the portions needed for the web component to function

  This is because the spec includes a lot of additional metadata
  and descriptive text which is useful for dev tools
*/

export const extractComponentSpec = (spec) => {

  const componentSpec = {
    content: [],
    variations: [],
    types: [],
    states: [],
    settings: {},
    reverseSettings: {},
    attributeClasses: [],
  };

  const getAttributeFromPart = (part) => {
    return part.attribute || part.name.toLowerCase();
  };

  const getSettingsFromSpecPart = (specPart) => {
    each(spec[specPart], (spec) => {
      const settingName = getAttributeFromPart(spec);
      if(!settingName) {
        return;
      }
      componentSpec[specPart].push(settingName);

      if(spec.includeAttributeClass) {
        componentSpec.attributeClasses.push(settingName);
      }

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
      componentSpec.settings[settingName] = optionValues;
    });
  };

  getSettingsFromSpecPart('content');
  getSettingsFromSpecPart('types');
  getSettingsFromSpecPart('states');
  getSettingsFromSpecPart('variations');


  // avoid having to reverse array at runtime
  let reverseSettings = reverseKeys(componentSpec.settings);
  delete reverseSettings.true;
  delete reverseSettings.false;
  componentSpec.reverseSettings = reverseSettings;
  console.log(componentSpec);
  console.log(spec);
  return componentSpec;
};
