import { reverseKeys, flatten, isString, isArray, clone, each, values, toTitleCase } from '@semantic-ui/utils';

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

    // standard example
    const defaultWords = values(spec?.examples?.defaultAttributes || {}).join(' ');
    definition.types.push({
      title: spec.name,
      description: spec.description,
      examples: [
        {
          showCode: false,
          code: this.getCode(defaultWords),
          components: [ this.getComponentParts(defaultWords) ]
        }
      ]
    });

    const parts = ['types', 'content', 'states', 'variations'];
    each(parts, (partName) => {
      each(spec[partName], part => {
        if(!isMinimumUsageLevel(part)) {
          return;
        }
        const examples = this.getCodeExamples(part, { defaultAttributes: spec?.examples?.defaultAttributes });
        definition[partName].push(examples);
      });
    });

    return definition;
  }

  /*
    Returns only top level with all inner content as 'html'
    <ui-button icon="delete"><div>Hello</div></ui-button>
    returns {
      componentName: 'ui-button',
      attributes: { icon: 'delete' }
      attributeString 'icon="delete"'
      html: '<div>Hello</div>'
    }
  */
  getComponentPartsFromHTML(html, { dialect } = {}) {
    // Remove leading and trailing whitespace from the HTML string
    html = html.trim();

    // Find the index of the first space or closing angle bracket
    const spaceIndex = html.indexOf(' ');
    const closingTagIndex = html.indexOf('>');

    // Extract the component name
    const componentName = html.slice(1, spaceIndex !== -1 ? spaceIndex : closingTagIndex);
    // complex examples arent supported
    if(componentName == 'div') {
      return {
        html: html
      };
    }
    // Extract the attribute string
    const attributeString = spaceIndex !== -1 ? html.slice(spaceIndex, closingTagIndex).trim() : '';

    // Parse the attribute string into an object
    const attributes = {};
    if (attributeString) {
      const attributePairs = attributeString.split(' ');
      for (const pair of attributePairs) {
        const [key, value] = pair.split('=');
        if (value) {
          attributes[key] = value.replace(/"/g, '');
        } else {
          attributes[key] = true;
        }
      }
    }
    const dialectAttributeString = this.getAttributeStringFromWords(html, { attributes, dialect });


    // Extract the inner HTML
    const innerHTML = html.slice(closingTagIndex + 1, html.lastIndexOf('<')).trim();

    return {
      componentName: componentName,
      attributes: attributes,
      attributeString: dialectAttributeString,
      html: innerHTML
    };
  }
  
  getCodeExamples(part, { defaultAttributes } = {}) {
    let examples = [];
    let attribute = this.getAttributeName(part);
    let defaultWords;
    if(defaultAttributes) {
      const attributes = clone(defaultAttributes);
      delete attributes[attribute];
      defaultWords = values(attributes).join(' ');
    }
    if(part.options) {
      let examplesToJoin = [];
      each(part.options, (option, index) => {
        let code, componentParts;
        if(option.exampleCode) {
          // an example was provided in the spec for us
          code = option.exampleCode;
          componentParts = this.getComponentPartsFromHTML(code);
        }
        else {
          // construct an example programatically
          // using the option values
          let words;
          if(isString(option.value)) {
            words = option.value;
          }
          else if(isString(option)) {
            words = option;
          }
          if(isArray(option.value)) {
            words = option.value.filter(val => isString(val))[0];
          }
          if(defaultWords) {
            words = `${words} ${defaultWords}`;
          }
          code = this.getCode(words);
          componentParts = this.getComponentParts(words);
        }
        const example = {
          code,
          components: [componentParts]
        };
        if(part.separateExamples) {
          examples.push(example);
        }
        else {
          examplesToJoin.push(example);
        }
      });
      // join all examples
      if(!part.separateExamples) {
        examples.push({
          code: examplesToJoin.map(ex => ex.code).join('\n'),
          components: flatten([...examplesToJoin.map(ex => ex.components)])
        });
      }
    }
    else {
      let code, componentParts;
      let words = this.getAttributeName(part);
      if(defaultWords) {
        words = `${words} ${defaultWords}`;
      }
      if(part.exampleCode) {
        code = part.exampleCode;
        componentParts = this.getComponentPartsFromHTML(code);
      }
      else {
        code = this.getCode(words);
        componentParts = this.getComponentParts(words);
      }
      const example = {
        code,
        components: [componentParts]
      };
      examples.push(example);
    }

    return {
      title: part.name,
      description: part.description,
      examples: examples,
    };
  }

  getComponentParts(words, {
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
    // use the word as text or component name i.e. 'primary', 'emphasis' etc
    if(!text && !html) {
      const baseText = words || componentName.replace(/^ui-/, '');
      text = String(baseText).replace(/\-/mg, ' ');
      html = toTitleCase(text);
    }
    const attributes = this.getAttributesFromWords(words);
    const componentParts = {
      componentName: componentName,
      attributes: attributes,
      attributeString: this.getAttributeStringFromWords(words, { attributes, dialect }),
      html: html
    };
    return componentParts;
  }

  getCode(words, settings) {
    const { componentName, attributeString, html } = this.getComponentParts(words, settings);
    return `<${componentName}${attributeString}>${html}</${componentName}>`;
  }

  /* Returns an object of attributes and their values from a list of words */
  getAttributesFromWords(words = '') {
    const componentSpec = this.getWebComponentSpec();
    const attributes = {};
    const wordArray = String(words).split(' ');
    each(wordArray, (word) => {
      const parentAttribute = componentSpec.reverseAttributes[word];
      if(parentAttribute) {
        attributes[parentAttribute] = word;
      }
      else {
        attributes[word] = true;
      }
    });
    return attributes;
  }

  getSingleAttributeString(attribute, value, {
    joinWith = '=',
    quoteCharacter = ':',
  } = {}) {
    return (value == true || value==attribute)
      ? `${attribute}`
      : `${attribute}${joinWith}${quoteCharacter}${value}${quoteCharacter}`
    ;
  }

  getAttributeString(attributes, {
    dialect = this.dialect,
    joinWith = '=',
    quoteCharacter = `'`
  } = {}) {
    let attributeString;
    let words = [];
    let categoryAttributes = clone(attributes);
    let componentSpec = this.getWebComponentSpec();
    each(attributes, (value, key) => {
      const parentAttribute = componentSpec.reverseAttributes[value];
      if(parentAttribute) {
        words.push(value);
      }
      else {
        categoryAttributes[key] = value;
      }
    });
    if(words.length) {
      const wordString = wordAttributes.join(' ');
      if(dialect == SpecReader.DIALECT_TYPES.standard) {
        // <ui-button large red>
        attributeString += ` ${wordString}`;
      }
      else if(dialect == SpecReader.DIALECT_TYPES.classic) {
        // <ui-button class="large red">
        return ` class="${wordString}"`;
      }
    }
    else if(dialect == SpecReader.DIALECT_TYPES.verbose || keys(categoryAttributes)) {
      let attributeString = ' ';
      each(attributes, (value, attribute) => {
        const singleAttr = this.getSingleAttributeString(attribute, value, { joinWith, quoteCharacter});
        attributeString += ` ${singleAttr}`;
      });
    }
    return attributeString;
  }

  getAttributeStringFromWords(words, {
    dialect = this.dialect,
    attributes,
    joinWith = '=',
    quoteCharacter = `"`
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
        attributes = this.getAttributesFromWords(words);
      }
      let attributeString = ' ';
      each(attributes, (value, attribute) => {
        const singleAttr = this.getSingleAttributeString(attribute, value, {
          joinWith,
          quoteCharacter
        });
        attributeString += ` ${singleAttr}`;
      });
      return ` ${attributeString.trim()}`;
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
