import { reverseKeys, flatten, isString, each } from '@semantic-ui/utils';

export class SpecReader {

  static spec = {};

  constructor(spec) {
    this.spec = spec || {};
  }

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

    this.addSettingsFromPart(componentSpec, 'content');
    this.addSettingsFromPart(componentSpec, 'types');
    this.addSettingsFromPart(componentSpec, 'states');
    this.addSettingsFromPart(componentSpec, 'variations');
    this.addSettingsFromPart(componentSpec, 'settings');

    // avoid having to reverse array at runtime
    let reverseAttributes = reverseKeys(componentSpec.attributes);
    delete reverseAttributes.true;
    delete reverseAttributes.false;
    componentSpec.reverseAttributes = reverseAttributes;

    // store some details for plurality if present
    componentSpec.inheritedPluralVariations = spec.pluralSharedVariations;
    return componentSpec;
  }

  addSettingsFromPart(componentSpec, specPart) {

    each(this.spec[specPart], (spec) => {

      const attributeName = this.getAttributeName(spec);

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

      // store allowed values for attribute if this part uses attributes
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
        // boolean allowed values can be inferred
        optionValues = [true, false];
      }
      componentSpec.attributes[attributeName] = optionValues;

      // store detail of attributes which could represent content
      if(specPart == 'content' && attributeName) {
        componentSpec.contentAttributes.push(attributeName);
      }

      // settings may or may not have associated attributes
      if(specPart == 'settings' && spec.defaultValue !== undefined) {
        componentSpec.defaultSettings[attributeName] = spec.defaultValue;
      }
    });
  }

  // returns the property name for a given definition part from a spec
  getAttributeName(part) {
    if(part.attribute) {
      return part.attribute;
    }
    if(isString(part.name)) {
      return part.name.toLowerCase();
    }
  }

  getCodeSample(attribute, { language='html', dialect='standard' } = {}) {

  }

}
