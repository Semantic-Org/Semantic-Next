import { reverseKeys, each } from '@semantic-ui/utils';

export const extractComponentSpec = (spec) => {

  const componentSpec = {
    variations: [],
    types: [],
    states: [],
    settings: {},
    reverseSettings: {}
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

      let optionValues;
      if(spec.options) {
        optionValues = spec.options.map(option => {
          if(option?.value !== undefined) {
            return option.value;
          }
          return option;
        }).filter(Boolean);
      }
      else {
        // boolean
        optionValues = [true, false];
      }
      componentSpec.settings[settingName] = optionValues;
    });
  };

  getSettingsFromSpecPart('types');
  getSettingsFromSpecPart('states');
  getSettingsFromSpecPart('variations');


  // avoid having to reverse array at runtime
  componentSpec.reverseSettings = reverseKeys(componentSpec.settings);
  return componentSpec;
};
