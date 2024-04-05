import { reverseKeys, flatten, onlyKeys, isString, each } from '@semantic-ui/utils';

export class SpecReader {
  constructor(spec) {
    this.spec = spec || {};
  }

  // we allow this to pass in spec so we can tree shake (this.spec would cause a ref to whole spec)
  getComponentSpec(spec = this.spec) {

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

    const addSettingsFromPart = (partName, usedKeys) => {
      let specPart = spec[partName] || [];

      if(usedKeys) {
        specPart = specPart.map(obj => onlyKeys(obj, usedKeys));
      }

      each(specPart, (spec) => {
        const attributeName = this.getAttributeName(spec);

        if (!attributeName) {
          return;
        }

        // add to list of this spec part attributes
        componentSpec[partName].push(attributeName);

        // allow spec to specify that the group class name should be included
        // i.e if enabled for 'attached' will output <class="attached left-attached">
        if (spec.includeAttributeClass) {
          componentSpec.attributeClasses.push(attributeName);
        }

        // store allowed values for attribute if this part uses attributes
        // functions and non-serializable content cannot use attributes
        let optionValues;
        if (spec.options) {
          optionValues = spec.options
            .map((option) => option?.value !== undefined ? option.value : option)
            .filter(Boolean);
          optionValues = flatten(optionValues);
        }
        else {
          // boolean allowed values can be inferred
          optionValues = [true, false];
        }
        componentSpec.attributes[attributeName] = optionValues;

        // store detail of attributes which could represent content
        if (partName === 'content' && attributeName) {
          componentSpec.contentAttributes.push(attributeName);
        }

        // settings may or may not have associated attributes
        if (partName === 'settings' && spec.defaultValue !== undefined) {
          componentSpec.defaultSettings[attributeName] = spec.defaultValue;
        }
      });
    };

    // Only process necessary parts of the spec
    addSettingsFromPart('content', ['name', 'attribute', 'slot', 'options']);
    addSettingsFromPart('types', ['name', 'attribute', 'options']);
    addSettingsFromPart('states', ['name', 'attribute', 'options']);
    addSettingsFromPart('variations', ['name', 'attribute', 'options']);
    addSettingsFromPart('settings', ['name', 'attribute', 'defaultValue']);


    // avoid having to reverse array at runtime
    let reverseAttributes = reverseKeys(componentSpec.attributes);
    delete reverseAttributes.true;
    delete reverseAttributes.false;
    componentSpec.reverseAttributes = reverseAttributes;

    // store some details for plurality if present
    componentSpec.inheritedPluralVariations = this.spec.pluralSharedVariations || [];
    return componentSpec;
  }
  getAttributeName(part) {
    if (part.attribute) {
      return part.attribute;
    }
    if (isString(part.name)) {
      return part.name.toLowerCase();
    }
  }

  getCodeSample(attribute, { language = 'html', dialect = 'standard' } = {}) {
    // Implementation for code samples
  }
}
