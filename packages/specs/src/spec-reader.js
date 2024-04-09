import { reverseKeys, flatten, isString, isArray, each, toTitleCase } from '@semantic-ui/utils';

export class SpecReader {

  static DEFAULT_DIALECT = 'standard';

  static DIALECT_TYPES = {
    standard: 'standard', // <ui-button large red>
    classic: 'classic', // <ui-button class="large red">
    verbose: 'verbose', // <ui-button size="large" color="red">
  };

  constructor(spec, {
    plural = false,
    dialect = SpecReader.DEFAULT_DIALECT
  } = {}) {
    this.spec = spec || {};
    this.plural = plural;
    this.dialect = dialect;
    this.componentSpec = null;
  }

  getComponentName({ plural = this.plural, lang = 'html' } = {}) {
    const spec = this.spec;
    const name = (plural)
      ? spec.pluralExportName
      : spec.exportName
    ;
    return name;
  }

  getTagName({ plural = this.plural, lang = 'html' } = {}) {
    const spec = this.spec;
    const name = (plural)
      ? spec.pluralTagName
      : spec.tagName
    ;
    return name;
  }

  /* Returns a definition for a component including code samples for documentation */
  getDefinition({
    plural = this.plural,
    minUsageLevel,
    dialect = this.dialect
  } = {}) {
    let definition = {
      content: [],
      types: [],
      states: [],
      variations: [],
    };

    // user can specify only portions of definition appears of a certain usage level
    const isMinimumUsageLevel = (part) => {
      if(!minUsageLevel) {
        return true;
      }
      return (usageLevel > (part.usageLevel || 1));
    };
    const spec = this.spec;

    // standard type
    definition.types.push({
      title: spec.name,
      description: spec.description,
      examples: [
        { code: this.getCode(''), codeParts: this.getCodeParts('') }        
      ]
    });

    const parts = ['types', 'content', 'states', 'variations'];
    each(parts, (partName) => {
      each(spec[partName], part => {
        if(!isMinimumUsageLevel(part)) {
          return;
        }
        const examples = this.getCodeExamples(part);
        definition[partName].push(examples);
      });
    });
    console.log(definition);
    return definition;
  }

  // returns an object of code parts from an HTML string
  // html = '<ui-button icon="delete">Delete</ui-button>'
  getCodePartsFromHTML(html) {
    const words = html.replace(/<[^>]*>/mg, '');
    const componentName = html.match(/<([^ ]*)/)[1];
    const attributes = this.getAttributes(words);
    const innerHTML = html.replace(/<[^>]*>/mg, '');
    return {
      componentName: componentName,
      attributes: attributes,
      attributeString: this.getAttributeString(words, { attributes }),
      html: innerHTML
    };
  }
  
  getCodeExamples(part) {
    let examples = [];
    if(part.options) {
      each(part.options, (option, index) => {
        let code, codeParts;
        if(option.exampleCode) {
          code = options.exampleCode;
          codeParts = this.getCodePartsFromHTML(code);
        }
        else {
          // get first string option value
          const words = (isArray(option.value))
            ? option.value.filter(val => isString(val))[0]
            : option.value
          ;
          code = this.getCode(words);
          codeParts = this.getCodeParts(words);
        }
        const example = {
          code,
          codeParts
        };
        examples.push(example);
      });
    }
    else {
      let code, codeParts;
      const words = this.getAttributeName(part);
      if(part.exampleCode) {
        code = part.exampleCode;
        codeParts = this.getCodePartsFromHTML(code);
      }
      else {
        code = this.getCode(words);
        codeParts = this.getCodeParts(words);
      }
      const example = {
        code,
        codeParts
      };
      examples.push(example);
    }

    return {
      title: part.name,
      description: part.description,
      examples: examples,
    };
  }

  getCodeParts(words, {
    lang='html',
    plural=this.plural,
    text,
    html,
    dialect = this.dialect
  } = {}) {
    let componentName = (lang == 'html')
      ? this.getTagName({ plural })
      : this.getComponentName({ plural, lang })
    ;
    if(!text && !html) {
      const baseText = words || componentName.replace(/^ui-/, '');
      text = String(baseText).replace(/\-/mg, ' ');
      html = toTitleCase(text);
    }
    const attributes = this.getAttributes(words);
    return {
      componentName: componentName,
      attributes: attributes,
      attributeString: this.getAttributeString(words, { attributes, dialect }),
      html: html
    };
  }

  getCode(words, settings) {
    const { componentName, attributeString, html } = this.getCodeParts(words, settings);
    return `<${componentName}${attributeString}>${html}</${componentName}>`;
  }

  /* Returns an object of attributes and their values from a list of words */
  getAttributes(words = '') {
    const componentSpec = this.getWebComponentSpec();
    const attributes = {};
    const wordArray = String(words).split(' ');
    each(wordArray, (word) => {
      const parentAttribute = componentSpec.reverseAttributes[word];
      if(parentAttribute) {
        attributes[parentAttribute] = word;
      }
    });
    return attributes;
  }

  getAttributeString(words, {
    dialect = this.dialect,
    joinWith = '=',
    attributes,
    quoteCharacter = `'`
  } = {}) {
    if(!words) {
      return '';
    }
    if(dialect == SpecReader.DIALECT_TYPES.standard) {
      // <ui-button large red>
      return ` ${words}`;
    }
    else if(dialect == SpecReader.DIALECT_TYPES.classic) {
      // <ui-button class="large red">
      return ` class="${words}"`;
    }
    else if(dialect == SpecReader.DIALECT_TYPES.verbose) {
      if(!attributes) {
        attributes = this.getAttributes(words, { dialect });
      }
      let attributeString = ' ';
      each(attributes, (value, attribute) => {
        attributeString += `${attribute}${joinWith}${quoteCharacter}${value}${quoteCharacter}`;
      });
      return attributeString;
    }
  }

  /* This is a format that is consumed by createComponent to determine valid attributes
     for the web component. It is a subset of the component spec that can be searched quickly
     and has a reduced filesize.
  */
  getWebComponentSpec(spec = this.spec) {

    if(this.componentSpec) {
      return this.componentSpec;
    }

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

    const addSettingsFromPart = (partName) => {
      const specPart = spec[partName] || [];

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
    addSettingsFromPart('content');
    addSettingsFromPart('types');
    addSettingsFromPart('states');
    addSettingsFromPart('variations');
    addSettingsFromPart('settings');


    // avoid having to reverse array at runtime
    let reverseAttributes = reverseKeys(componentSpec.attributes);
    delete reverseAttributes.true;
    delete reverseAttributes.false;
    componentSpec.reverseAttributes = reverseAttributes;

    // store some details for plurality if present
    componentSpec.inheritedPluralVariations = this.spec.pluralSharedVariations || [];

    this.componentSpec = componentSpec;

    return componentSpec;
  }

  getAttributeName(specPart) {
    if (specPart.attribute) {
      return specPart.attribute;
    }
    if (isString(specPart.name)) {
      return specPart.name.toLowerCase();
    }
  }

}
