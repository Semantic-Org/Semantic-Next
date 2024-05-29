import { reverseKeys, get, flatten, isString, isArray, clone, each, inArray, unique, mapObject, noop, values, tokenize, toTitleCase, capitalize } from '@semantic-ui/utils';

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

  /*
    Get the name of the components export
  */
  getComponentName({ plural = this.plural, lang = 'html' } = {}) {
    const spec = this.spec;
    const name = (plural)
      ? spec.pluralExportName
      : spec.exportName
    ;
    return name;
  }

  /*
    Returns the tag name used for plural or singular format of a component
  */
  getTagName({ plural = this.plural, lang = 'html' } = {}) {
    const spec = this.spec;
    const name = (plural)
      ? spec.pluralTagName
      : spec.tagName
    ;
    return name;
  }

  /*
    Returns a definition for a component including code samples for documentation
    as a structured object literal
  */
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
    const defaultContent = spec?.examples?.defaultContent;
    const defaultModifiers = values(spec?.examples?.defaultAttributes || {}).join(' ');
    definition.types.push({
      title: spec.name,
      description: '',
      examples: [
        {
          showCode: false,
          code: this.getCode(defaultModifiers, { html: defaultContent }),
          components: [ this.getComponentParts(defaultModifiers, { html: defaultContent }) ]
        }
      ]
    });

    const parts = this.getOrderedParts();
    each(parts, (partName) => {
      each(spec[partName], part => {
        if(!isMinimumUsageLevel(part)) {
          return;
        }
        const examples = this.getCodeExamples(part, {
          defaultAttributes: spec?.examples?.defaultAttributes,
          defaultContent: defaultContent
        });
        definition[partName].push(examples);
      });
    });

    return definition;
  }

  /*
    Returns the sequencing for a spec when displaying in a structured way
  */
  getOrderedParts() {
    return ['types', 'content', 'states', 'variations'];
  }

  /*
    Returns an array of examples in the order specified in get ordered parts
  */
  getOrderedExamples({plural = false, minUsageLevel, dialect = this.dialect } = {}) {
    const definition = this.getDefinition({plural, minUsageLevel, dialect});
    return this.getOrderedParts().map((partName) => ({
      title: toTitleCase(partName),
      examples: definition[partName]
    }));
  }

  /*
    Gets the definition menu for a component for use with an inpage menu
  */
  getDefinitionMenu({ IDSuffix = '-example', plural = false, minUsageLevel } = {}) {
    const orderedDefinition = this.getOrderedExamples({plural, minUsageLevel});
    let menu = orderedDefinition.map(part => ({
      title: part.title,
      items: part.examples.map((example) => ({
        id: tokenize(`${example.title}${IDSuffix}`),
        title: example.title
      }))
    }));
    return menu;
  }

  /*
    Returns only top level for component with all inner content as 'html'
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
    const attributeString = spaceIndex !== -1
      ? html.slice(spaceIndex, closingTagIndex).trim()
      : ''
    ;

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
    const dialectAttributeString = this.getAttributeStringFromModifiers(html, { attributes, dialect });


    // Extract the inner HTML
    const innerHTML = html.slice(closingTagIndex + 1, html.lastIndexOf('<')).trim();

    return {
      componentName: componentName,
      attributes: attributes,
      attributeString: dialectAttributeString,
      html: innerHTML
    };
  }
  
  getCodeExamples(part, { defaultAttributes, defaultContent } = {}) {
    let examples = [];
    let attribute = this.getAttributeName(part);

    // avoid duplicating the attribute present in this example
    if(defaultAttributes) {
      const attributes = clone(defaultAttributes);
      delete attributes[attribute];
      defaultAttributes = values(attributes).join(' ');
    }
    /*
      Create an example for each option present
      in the options array, i.e. colors => "red", "blue"
    */
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
          let modifiers;
          if(isString(option.value)) {
            modifiers = option.value;
          }
          else if(isString(option)) {
            modifiers = option;
          }
          if(isArray(option.value)) {
            modifiers = option.value.filter(val => isString(val))[0];
          }
          if(defaultAttributes) {
            modifiers = `${modifiers} ${defaultAttributes}`;
          }
          code = this.getCode(modifiers, { html: defaultContent });
          componentParts = this.getComponentParts(modifiers, { html: defaultContent });
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
      // unless the spec specifically asks for separate examples, join them into one example
      if(!part.separateExamples) {
        examples.push({
          code: examplesToJoin.map(ex => ex.code).join('\n'),
          components: flatten([...examplesToJoin.map(ex => ex.components)])
        });
      }
    }
    else {
      let code, componentParts;
      let modifiers = this.getAttributeName(part);
      if(defaultAttributes) {
        modifiers = `${modifiers} ${defaultAttributes}`;
      }
      if(part.exampleCode) {
        code = part.exampleCode;
        componentParts = this.getComponentPartsFromHTML(code);
      }
      else {
        code = this.getCode(modifiers, { html: defaultContent });
        componentParts = this.getComponentParts(modifiers, { html: defaultContent });
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

  getComponentParts(modifiers, {
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
    // use the modifier as text or component name i.e. 'primary', 'emphasis' etc
    if(!text && !html) {
      const baseText = modifiers || componentName.replace(/^ui-/, '');
      text = String(baseText).replace(/\-/mg, ' ');
      html = toTitleCase(text);
    }
    const attributes = this.getAttributesFromModifiers(modifiers);
    const componentParts = {
      componentName: componentName,
      attributes: attributes,
      attributeString: this.getAttributeStringFromModifiers(modifiers, { attributes, dialect }),
      html: html
    };
    return componentParts;
  }

  getCode(modifiers, settings) {
    const { componentName, attributeString, html } = this.getComponentParts(modifiers, settings);
    return `<${componentName}${attributeString}>${html}</${componentName}>`;
  }

  /* Returns an object of attributes and their values from a list of modifiers */
  getAttributesFromModifiers(modifiers = '') {
    const componentSpec = this.getWebComponentSpec();
    const attributes = {};
    const modifierArray = String(modifiers).split(' ');
    each(modifierArray, (modifier) => {
      const parentAttribute = componentSpec.optionAttributes[modifier];
      if(parentAttribute) {
        attributes[parentAttribute] = modifier;
      }
      else {
        attributes[modifier] = true;
      }
    });
    return attributes;
  }

  /* Returns an attribute string for an attribute */
  getSingleAttributeString(attribute, value, {
    joinWith = '=',
    quoteCharacter = ':',
  } = {}) {
    return (value == true || value==attribute)
      ? `${attribute}`
      : `${attribute}${joinWith}${quoteCharacter}${value}${quoteCharacter}`
    ;
  }

  /*
    Returns an attribute string from a given set of attributes
    passed in as an object literal like { emphasis: 'primary '}
  */
  getAttributeString(attributes, {
    dialect = this.dialect,
    joinWith = '=',
    quoteCharacter = `'`
  } = {}) {
    let attributeString;
    let modifiers = [];
    let categoryAttributes = clone(attributes);
    let componentSpec = this.getWebComponentSpec();
    each(attributes, (value, key) => {
      const parentAttribute = componentSpec.optionAttributes[value];
      if(parentAttribute) {
        modifiers.push(value);
      }
      else {
        categoryAttributes[key] = value;
      }
    });
    if(modifiers.length) {
      const modifierString = modifierAttributes.join(' ');
      if(dialect == SpecReader.DIALECT_TYPES.standard) {
        // <ui-button large red>
        attributeString += ` ${modifierString}`;
      }
      else if(dialect == SpecReader.DIALECT_TYPES.classic) {
        // <ui-button class="large red">
        return ` class="${modifierString}"`;
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

  /* Returns a stringified version of attributes for a given set of modifiers
     based off the dialect specified
  */
  getAttributeStringFromModifiers(modifiers, {
    dialect = this.dialect,
    attributes,
    joinWith = '=',
    quoteCharacter = `"`
  } = {}) {
    if(!modifiers) {
      return '';
    }
    if(dialect == SpecReader.DIALECT_TYPES.standard) {
      // <ui-button large red>
      return ` ${modifiers}`;
    }
    else if(dialect == SpecReader.DIALECT_TYPES.classic) {
      // <ui-button class="large red">
      return ` class="${modifiers}"`;
    }
    else if(dialect == SpecReader.DIALECT_TYPES.verbose) {
      if(!attributes) {
        attributes = this.getAttributesFromModifiers(modifiers);
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

    if(spec == this.spec && this.componentSpec) {
      return this.componentSpec;
    }

    let componentSpec = {
      tagName: spec.tagName,
      content: [],
      contentAttributes: [],

      types: [],
      variations: [],
      states: [],
      events: [],
      settings: [],

      properties: [],
      attributes: [],
      optionAttributes: {},
      propertyTypes: {},
      allowedValues: {},
      attributeClasses: [],
      defaultValues: {},
      inheritedPluralVariations: [],
    };

    const addSettingsFromPart = (section) => {
      const specPart = spec[section] || [];
      each(specPart, (spec) => {

        const propertyName = this.getPropertyName(spec);

        // it is a requirement to have a property name defined
        if(!propertyName) {
          return;
        }

        // add to list of this grouping, i.e types: ['emphasis']
        componentSpec[section].push(propertyName);

        // find allowed option values for this attribute i.e. emphasis: ['primary', 'secondary']
        const allowedValues = this.getAllowedValues(spec);
        if(allowedValues) {
          componentSpec.allowedValues[propertyName] = allowedValues;
        }

        // find native type of this property i.e. String
        const propertyType = this.getPropertyType(spec, section, allowedValues);
        if (propertyType) {
          componentSpec.propertyTypes[propertyName] = propertyType;
        }

        // find attribute name if it its not a function
        const attributeName = this.getAttributeName(spec, propertyType);
        if(attributeName) {
          componentSpec.attributes.push(attributeName);
        }
        else {
          componentSpec.properties.push(propertyName);
        }

        // get default value
        const defaultValue = this.getDefaultValue(spec, propertyType, section);
        if (defaultValue) {
          componentSpec.defaultValues[propertyName] = defaultValue;
        }

        /* Special Cases */

        // content can option to either using slots or attributes
        if (section === 'content') {
          if(spec.attribute) {
            componentSpec.contentAttributes.push(spec.attribute);
          }
          else if(spec.slot) {
            componentSpec.slots.push(spec.slot);
          }
        }

        // components can opt in to having its attribute as a class name
        // i.e. .attached + .left-attached
        if (attributeName && spec.includeAttributeClass) {
          componentSpec.attributeClasses.push(propertyName);
        }

      });
    };

    // Only process necessary parts of the spec
    addSettingsFromPart('content');
    addSettingsFromPart('types');
    addSettingsFromPart('states');
    addSettingsFromPart('variations');
    addSettingsFromPart('settings');
    addSettingsFromPart('events');


    // avoid having to reverse array at runtime
    let options = mapObject(componentSpec.allowedValues, (values, key) => {
      return values = values.filter(value => isString(value));
    });
    componentSpec.optionAttributes = reverseKeys(options);

    // store some details for plurality if present
    componentSpec.inheritedPluralVariations = spec.pluralSharedVariations || [];

    this.componentSpec = componentSpec;

    return componentSpec;
  }

  /* Returns the attribute name for a given spec part */
  getAttributeName(specPart, type) {
    if(!this.canUseAttribute(type)) {
      return;
    }
    return this.getPropertyName(specPart);
  }
  getPropertyName(specPart) {
    if (specPart.attribute) {
      return specPart.attribute;
    }
    if (isString(specPart.name)) {
      return specPart.name.toLowerCase();
    }
  }

  getPropertyType(spec, section, allowedValues = []) {
    let types = {
      string: String,
      boolean: Boolean,
      object: Object,
      array: Array,
      function: Function
    };
    let type;
    let stringType;
    if(section == 'events') {
      // events are always functions
      type = Function;
    }
    else if(inArray(section, ['types', 'states', 'variations'])) {
      // visual modifications (types, states, variations) default to boolean attrs
      // unless they have allowed values
      type = Boolean;
    }
    else if(inArray(section, ['content'])) {
      // content defaults to string type
      type = String;
    }

    if(spec.type && types[spec.type]) {
      // if they specify a type then lets use that as long as its a known type
      stringType = spec.type;
    }
    else if(allowedValues.length) {
      // if they specify allowed values we can infer type from a sample
      stringType = typeof allowedValues[0];
    }
    if(stringType) {
      type = get(types, stringType);
    }

    return type;
  }

  getAllowedValues(spec) {
    let allowedValues;
    if (spec.options) {
      allowedValues = spec.options
        .map((option) => option?.value !== undefined ? option.value : option)
        .filter(Boolean);
      allowedValues = unique(flatten(allowedValues));
    }
    return allowedValues;
  }

  getDefaultValue(spec, type, section) {
    if(spec.defaultValue) {
      return spec.defaultValue;
    }
    if(section !== 'settings') {
      return;
    }
    const defaultValues = {
      string: '',
      array: [],
      boolean: false,
      function: noop,
      number: 0,
      object: {}
    };
    return get(defaultValues, type);
  }

  canUseAttribute(type) {
    if(type == Function) {
      return false;
    }
    return true;
  }

}
