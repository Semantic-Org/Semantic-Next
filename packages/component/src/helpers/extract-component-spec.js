import { reverseKeys, each } from '@semantic-ui/utils';

export const extractComponentSpec = (spec) => {

  const componentSpec = {
    variations: [],
    types: [],
    states: [],
    settings: {},
    reverseSettings: {}
  };

  const getSettingsFromSpecPart = (specPart) => {
    each(spec[specPart], (spec) => {
      const settingName = spec.attribute || spec.name.toLowerCase();
      componentSpec[specPart].push(settingName);
      if(spec.options) {
        const optionValues = spec.options.map(option => {
          if(option?.value !== undefined) {
            return option.value;
          }
          return option;
        });
        componentSpec.settings[settingName] = optionValues;
      }
    });
  };

  getSettingsFromSpecPart('types');
  getSettingsFromSpecPart('states');
  getSettingsFromSpecPart('variations');

  // avoid having to reverse array at runtime
  componentSpec.reverseSettings = reverseKeys(componentSpec.settings);
  return componentSpec;
};
