import {
  clone,
  each,
  filterObject,
  firstMatch,
  flatten,
  get,
  getArticle,
  inArray,
  isArray,
  isEmpty,
  isString,
  mapObject,
  noop,
  reverseKeys,
  tokenize,
  toTitleCase,
  unique,
  values,
} from '@semantic-ui/utils';

export class SpecReader {
  static DEFAULT_DIALECT = 'standard';

  static DIALECT_TYPES = {
    standard: 'standard', // <ui-button large red>
    classic: 'classic', // <ui-button class="large red">
    verbose: 'verbose', // <ui-button size="large" color="red">
  };

  constructor(spec, {
    plural = false,
    dialect = SpecReader.DEFAULT_DIALECT,
  } = {}) {
    this.spec = spec || {};
    this.plural = plural;
    this.dialect = dialect;
    this.componentSpec = null;
  }

  /*
    Formats a description with the proper article and component name
    For singular: "A button can {description}." or "An icon can {description}."
    For plural: "Button group can {description}."
    If description already ends with period, don't add another
  */
  formatDescription(description, { plural = this.plural } = {}) {
    if (!description) {
      return '';
    }

    const spec = this.spec;
    const componentName = plural
      ? (spec.pluralName || 'Components')
      : (spec.name || 'Component');

    // Determine if we need an article
    const prefix = plural
      ? componentName
      : `${getArticle(componentName, { capitalize: true })} ${componentName.toLowerCase()}`;

    // Check if description already ends with period
    const needsPeriod = !description.endsWith('.');

    return `${prefix} can ${description}${needsPeriod ? '.' : ''}`;
  }

  /*
    Get the name of the components export
  */
  getComponentName({ plural = this.plural, lang = 'html' } = {}) {
    const spec = this.spec;
    const name = (plural)
      ? spec.pluralExportName
      : spec.exportName;
    return name;
  }

  /*
    Returns the tag name used for plural or singular format of a component
  */
  getTagName({ plural = this.plural, lang = 'html' } = {}) {
    const spec = this.spec;
    const name = (plural)
      ? spec.pluralTagName
      : spec.tagName;
    return name;
  }

  /*
    Returns a definition for a component including code samples for documentation
    as a structured object literal
  */
  getDefinition({
    plural = this.plural,
    minUsageLevel,
    dialect = this.dialect,
  } = {}) {
    let definition = {
      content: [],
      types: [],
      states: [],
      variations: [],
      settings: [],
    };

    // allow user to filter definition by only parts with a specific min usage level
    const isMinimumUsageLevel = (part) => {
      if (!minUsageLevel) {
        return true;
      }
      return (usageLevel > (part.usageLevel || 1));
    };
    const spec = this.spec;

    const customExampleCode = this.getExampleCode(spec, plural);

    const defaultContent = (plural && spec?.examples?.defaultPluralContent)
      ? spec?.examples?.defaultPluralContent
      : spec?.examples?.defaultContent;
    const defaultModifiers = values(spec?.examples?.defaultAttributes || {}).join(' ');

    let code, componentParts;
    if (customExampleCode) {
      // default custom example code provided
      code = customExampleCode;
      componentParts = this.getComponentPartsFromHTML(code);
    }
    else {
      code = this.getCodeFromModifiers(defaultModifiers, { html: defaultContent, plural });
      componentParts = this.getComponentPartsFromHTML(code);
    }
    const componentTitle = plural ? (spec.pluralName || spec.name) : spec.name;
    definition.types.push({
      title: componentTitle,
      description: '',
      examples: [
        {
          showCode: false,
          code,
          components: Array.isArray(componentParts) ? componentParts : [componentParts],
        },
      ],
    });

    if (plural) {
      // Process pluralContent (instead of regular content)
      if (spec.pluralContent) {
        each(spec.pluralContent, part => {
          if (!isMinimumUsageLevel(part)) {
            return;
          }
          const examples = this.getCodeExamples(part, {
            defaultAttributes: spec?.examples?.defaultAttributes,
            defaultContent: defaultContent,
            isPlural: true,
          });
          definition.content.push(examples);
        });
      }

      // Process pluralOnlyTypes FIRST
      if (spec.pluralOnlyTypes) {
        each(spec.pluralOnlyTypes, part => {
          if (!isMinimumUsageLevel(part)) {
            return;
          }
          const examples = this.getCodeExamples(part, {
            defaultAttributes: spec?.examples?.defaultAttributes,
            defaultContent: defaultContent,
            isPlural: true,
          });
          definition.types.push(examples);
        });
      }

      // Then process shared types (filtered by pluralSharedTypes)
      const sharedTypes = spec.pluralSharedTypes || [];
      if (spec.types && sharedTypes.length > 0) {
        const filteredTypes = spec.types.filter(type => {
          const attributeName = this.getAttributeName(type);
          return inArray(attributeName, sharedTypes);
        });
        each(filteredTypes, part => {
          if (!isMinimumUsageLevel(part)) {
            return;
          }
          const examples = this.getCodeExamples(part, {
            defaultAttributes: spec?.examples?.defaultAttributes,
            defaultContent: defaultContent,
            isPlural: true,
          });
          definition.types.push(examples);
        });
      }

      // Process pluralOnlyVariations FIRST
      if (spec.pluralOnlyVariations) {
        each(spec.pluralOnlyVariations, part => {
          if (!isMinimumUsageLevel(part)) {
            return;
          }
          const examples = this.getCodeExamples(part, {
            defaultAttributes: spec?.examples?.defaultAttributes,
            defaultContent: defaultContent,
            isPlural: true,
          });
          definition.variations.push(examples);
        });
      }

      // Then process shared variations (filtered by pluralSharedVariations)
      const sharedVariations = spec.pluralSharedVariations || [];
      if (spec.variations && sharedVariations.length > 0) {
        const filteredVariations = spec.variations.filter(variation => {
          const attributeName = this.getAttributeName(variation);
          return inArray(attributeName, sharedVariations);
        });
        each(filteredVariations, part => {
          if (!isMinimumUsageLevel(part)) {
            return;
          }
          const examples = this.getCodeExamples(part, {
            defaultAttributes: spec?.examples?.defaultAttributes,
            defaultContent: defaultContent,
            isPlural: true,
          });
          definition.variations.push(examples);
        });
      }
    }
    else {
      // Regular (singular) processing
      const parts = this.getOrderedParts({ plural });
      each(parts, (partName) => {
        each(spec[partName], part => {
          if (!isMinimumUsageLevel(part)) {
            return;
          }
          const examples = this.getCodeExamples(part, {
            defaultAttributes: spec?.examples?.defaultAttributes,
            defaultContent: defaultContent,
          });
          definition[partName].push(examples);
        });
      });
    }

    return definition;
  }

  /*
    Returns the sequencing for a spec when displaying in a structured way
  */
  getOrderedParts({ plural } = {}) {
    if (plural) {
      return ['types', 'content', 'variations'];
    }
    return ['types', 'content', 'states', 'variations', 'settings'];
  }

  /*
    Returns an array of examples in the order specified in get ordered parts
  */
  getOrderedExamples({ plural = false, minUsageLevel, dialect = this.dialect } = {}) {
    const definition = this.getDefinition({ plural, minUsageLevel, dialect });
    return this.getOrderedParts().map((partName) => ({
      title: toTitleCase(partName),
      examples: definition[partName],
    }));
  }

  /*
    Gets the definition menu for a component for use with an inpage menu
  */
  getDefinitionMenu({ IDSuffix = '-example', plural = false, minUsageLevel } = {}) {
    // Use getDefinition to ensure we get the correctly filtered content for plural
    const definition = this.getDefinition({ plural, minUsageLevel });

    // Build menu from the definition structure
    const menu = [];

    // Add sections in the order they appear
    const orderedParts = this.getOrderedParts({ plural });

    orderedParts.forEach(partName => {
      const items = definition[partName];
      if (items && items.length > 0) {
        menu.push({
          title: toTitleCase(partName),
          items: items.map((example) => ({
            id: tokenize(`${example.title}${IDSuffix}`),
            title: example.title,
          })),
        });
      }
    });

    return menu;
  }

  /*
    Splits HTML string into individual top-level components
    Returns array of HTML strings, one for each root component
  */
  splitTopLevelComponents(html) {
    html = html.trim();
    const components = [];
    let depth = 0;
    let currentComponent = '';
    let i = 0;

    while (i < html.length) {
      const char = html[i];

      if (char === '<') {
        // Check if it's a closing tag
        if (html[i + 1] === '/') {
          depth--;
          currentComponent += char;
        }
        else if (html[i + 1] !== '!') {
          // Opening tag (but not comment)
          depth++;
          currentComponent += char;
        }
        else {
          currentComponent += char;
        }
      }
      else if (char === '>' && html[i - 1] === '/') {
        // Self-closing tag: <img /> or <ui-icon />
        depth--;
        currentComponent += char;
      }
      else {
        currentComponent += char;
      }

      // When we close a root component, save it
      if (depth === 0 && currentComponent.trim() && char === '>') {
        components.push(currentComponent.trim());
        currentComponent = '';
      }

      i++;
    }

    // Handle any remaining content
    if (currentComponent.trim()) {
      components.push(currentComponent.trim());
    }

    return components.filter(c => c.length > 0);
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

    If multiple root components are present, returns array of component parts
  */
  getComponentPartsFromHTML(html, { dialect, multiple = false } = {}) {
    // Remove leading and trailing whitespace from the HTML string
    html = html.trim();

    // Check if HTML starts with a tag - if not, it's not a component
    if (!html.startsWith('<')) {
      return { html: html };
    }

    // Check if there are multiple root components by counting root-level tags
    // A simple heuristic: if we have multiple opening tags at depth 0, split
    const topLevelComponents = this.splitTopLevelComponents(html);

    // Only split if we actually have multiple distinct root components
    // AND the first component is a complete valid tag (not broken HTML)
    if (topLevelComponents.length > 1) {
      const firstComponent = topLevelComponents[0];
      const lastComponent = topLevelComponents[topLevelComponents.length - 1];

      // Check if first component has a proper closing or is self-closing
      const hasProperClose = firstComponent.includes('</') || firstComponent.endsWith('/>');
      // Check if last component starts with a tag (not loose text)
      const lastStartsWithTag = lastComponent.trim().startsWith('<');

      // Only split if both components look valid
      if (hasProperClose && lastStartsWithTag) {
        return topLevelComponents.map(componentHtml => this.parseSingleComponent(componentHtml, { dialect }));
      }
    }

    // Single component or malformed multi-component - parse whole thing as single
    return this.parseSingleComponent(html, { dialect });
  }

  /*
    Parses a single component HTML string
  */
  parseSingleComponent(html, { dialect } = {}) {
    html = html.trim();

    // Find the closing bracket of the first tag
    const closingTagIndex = html.indexOf('>');

    // Find the first space, but only if it's BEFORE the closing bracket
    const spaceIndex = html.indexOf(' ');
    const spaceBeforeClose = (spaceIndex !== -1 && spaceIndex < closingTagIndex) ? spaceIndex : -1;

    // Extract the component name (from after < to first space or >)
    const componentName = html.slice(1, spaceBeforeClose !== -1 ? spaceBeforeClose : closingTagIndex);

    // complex examples arent supported
    if (componentName == 'div') {
      return {
        html: html,
      };
    }

    // Extract the attribute string (from after component name to >)
    const attributeString = spaceBeforeClose !== -1
      ? html.slice(spaceBeforeClose, closingTagIndex).trim()
      : '';

    // Parse the attribute string into an object
    const attributes = {};
    if (attributeString) {
      const attributePairs = attributeString.split(' ');
      for (const pair of attributePairs) {
        const [key, value] = pair.split('=');
        if (value) {
          attributes[key] = value.replace(/"/g, '');
        }
        else {
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
      html: innerHTML,
    };
  }

  /*
    Gets the appropriate example code for a part based on plurality
    Checks plural-specific, singular-specific, then falls back to general exampleCode
  */
  getExampleCode(part, isPlural = false) {
    return isPlural
      ? part.pluralExampleCode || part.exampleCode
      : part.singularExampleCode || part.exampleCode;
  }

  getCodeExamples(part, { defaultAttributes, defaultContent, isPlural = false } = {}) {
    let examples = [];
    let attribute = this.getAttributeName(part);

    // avoid duplicating the attribute present in this example
    if (defaultAttributes) {
      const attributes = clone(defaultAttributes);
      delete attributes[attribute];
      defaultAttributes = values(attributes).join(' ');
    }

    let code, componentParts;
    let modifiers = this.getAttributeName(part);
    if (defaultAttributes) {
      modifiers = `${modifiers} ${defaultAttributes}`;
    }

    /*
      Create an example for each option present
      in the options array, i.e. colors => "red", "blue"
    */
    const customExampleCode = this.getExampleCode(part, isPlural);

    if (customExampleCode) {
      // Handle both string and array formats
      if (isArray(customExampleCode)) {
        // Array of example codes - respect separateExamples flag
        if (part.separateExamples) {
          // Create separate examples for each code
          each(customExampleCode, (codeString) => {
            code = codeString;
            componentParts = this.getComponentPartsFromHTML(code);
            const example = {
              code,
              components: Array.isArray(componentParts) ? componentParts : [componentParts],
            };
            examples.push(example);
          });
        }
        else {
          // Join all examples into one
          let joinedExamples = [];
          each(customExampleCode, (codeString) => {
            code = codeString;
            componentParts = this.getComponentPartsFromHTML(code);
            joinedExamples.push({
              code,
              components: Array.isArray(componentParts) ? componentParts : [componentParts],
            });
          });
          examples.push({
            code: joinedExamples.map(ex => ex.code).join('\n'),
            components: flatten([...joinedExamples.map(ex => ex.components)]),
          });
        }
      }
      else {
        // Single string example code
        code = customExampleCode;
        componentParts = this.getComponentPartsFromHTML(code);
        const example = {
          code,
          components: Array.isArray(componentParts) ? componentParts : [componentParts],
        };
        examples.push(example);
      }
    }
    else if (part.options) {
      let examplesToJoin = [];
      each(part.options, (option, index) => {
        const customExampleCode = this.getExampleCode(option, isPlural);

        if (customExampleCode) {
          // an example was provided in the spec for us
          // Handle both string and array formats
          if (isArray(customExampleCode)) {
            // Array of example codes - create separate examples for each
            each(customExampleCode, (codeString) => {
              code = codeString;
              componentParts = this.getComponentPartsFromHTML(code);
              const example = {
                code,
                components: Array.isArray(componentParts) ? componentParts : [componentParts],
              };
              if (part.separateExamples) {
                examples.push(example);
              }
              else {
                examplesToJoin.push(example);
              }
            });
            // Skip the rest of the iteration since we handled all codes
            return;
          }
          else {
            // Single string example code
            code = customExampleCode;
            componentParts = this.getComponentPartsFromHTML(code);
          }
        }
        else {
          // construct an example programatically
          // using the option values
          if (isString(option.value)) {
            modifiers = this.getConciseModifier(attribute, option.value);
          }
          else if (isString(option)) {
            modifiers = this.getConciseModifier(attribute, option);
          }
          if (isArray(option.value)) {
            const firstValue = option.value.filter(val => isString(val))[0];
            modifiers = this.getConciseModifier(attribute, firstValue);
          }
          if (defaultAttributes) {
            modifiers = `${modifiers} ${defaultAttributes}`;
          }
          code = this.getCodeFromModifiers(modifiers, { html: defaultContent, plural: isPlural });
          componentParts = this.getComponentParts(modifiers, { html: defaultContent, plural: isPlural });
        }
        const example = {
          code,
          components: Array.isArray(componentParts) ? componentParts : [componentParts],
        };
        if (part.separateExamples) {
          examples.push(example);
        }
        else {
          examplesToJoin.push(example);
        }
      });
      // unless the spec specifically asks for separate examples, join them into one example
      if (!part.separateExamples) {
        examples.push({
          code: examplesToJoin.map(ex => ex.code).join('\n'),
          components: flatten([...examplesToJoin.map(ex => ex.components)]),
        });
      }
    }
    else {
      code = this.getCodeFromModifiers(modifiers, { html: defaultContent, plural: isPlural });
      componentParts = this.getComponentParts(modifiers, { html: defaultContent, plural: isPlural });
      const example = {
        code,
        components: [componentParts],
      };
      examples.push(example);
    }

    return {
      title: part.name,
      description: this.formatDescription(part.description, { plural: isPlural }),
      examples: examples,
    };
  }

  getComponentParts(modifiers, {
    lang = 'html',
    plural = this.plural,
    text,
    html,
    dialect = this.dialect,
  } = {}) {
    let componentName = (lang == 'html')
      ? this.getTagName({ plural })
      : this.getComponentName({ plural, lang });
    // use the modifier as text or component name i.e. 'primary', 'emphasis' etc
    if (text === undefined && html === undefined) {
      const baseText = modifiers || String(componentName).replace(/^ui-/, '');
      text = String(baseText).replace(/\-/mg, ' ');
      html = toTitleCase(text);
    }
    const attributes = this.getAttributesFromModifiers(modifiers);
    const componentParts = {
      componentName: componentName,
      attributes: attributes,
      attributeString: this.getAttributeStringFromModifiers(modifiers, { attributes, dialect }),
      html: html,
    };
    return componentParts;
  }

  /* Returns the html for a component with a given set of modifiers */
  getCodeFromModifiers(modifiers, settings) {
    const { componentName, attributeString, html } = this.getComponentParts(modifiers, settings);
    return `<${componentName}${attributeString}>${html}</${componentName}>`;
  }

  /* Returns an object of attributes and their values from a list of modifiers */
  getAttributesFromModifiers(modifiers = '') {
    const componentSpec = this.getWebComponentSpec();
    const attributes = {};
    const modifierArray = String(modifiers).split(' ');
    each(modifierArray, (modifier) => {
      const parentAttribute = componentSpec.optionAttributes?.[modifier];
      if (parentAttribute) {
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
    return (value == true || value == attribute)
      ? `${attribute}`
      : `${attribute}${joinWith}${quoteCharacter}${value}${quoteCharacter}`;
  }

  /*
    Returns an attribute string from a given set of attributes
    passed in as an object literal like { emphasis: 'primary '}
  */
  getAttributeString(attributes, {
    dialect = this.dialect,
    joinWith = '=',
    quoteCharacter = `'`,
  } = {}) {
    let attributeString;
    let modifiers = [];
    let categoryAttributes = clone(attributes);
    let componentSpec = this.getWebComponentSpec();
    each(attributes, (value, key) => {
      const parentAttribute = componentSpec.optionAttributes[value];
      if (parentAttribute) {
        modifiers.push(value);
      }
      else {
        categoryAttributes[key] = value;
      }
    });
    if (modifiers.length) {
      const modifierString = modifierAttributes.join(' ');
      if (dialect == SpecReader.DIALECT_TYPES.standard) {
        // <ui-button large red>
        attributeString += ` ${modifierString}`;
      }
      else if (dialect == SpecReader.DIALECT_TYPES.classic) {
        // <ui-button class="large red">
        return ` class="${modifierString}"`;
      }
    }
    else if (dialect == SpecReader.DIALECT_TYPES.verbose || keys(categoryAttributes)) {
      let attributeString = ' ';
      each(attributes, (value, attribute) => {
        const singleAttr = this.getSingleAttributeString(attribute, value, { joinWith, quoteCharacter });
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
    quoteCharacter = `"`,
  } = {}) {
    if (!modifiers) {
      return '';
    }
    if (dialect == SpecReader.DIALECT_TYPES.standard) {
      // <ui-button large red>
      return ` ${modifiers}`;
    }
    else if (dialect == SpecReader.DIALECT_TYPES.classic) {
      // <ui-button class="large red">
      return ` class="${modifiers}"`;
    }
    else if (dialect == SpecReader.DIALECT_TYPES.verbose) {
      if (!attributes) {
        attributes = this.getAttributesFromModifiers(modifiers);
      }
      let attributeString = ' ';
      each(attributes, (value, attribute) => {
        const singleAttr = this.getSingleAttributeString(attribute, value, {
          joinWith,
          quoteCharacter,
        });
        attributeString += ` ${singleAttr}`;
      });
      return ` ${attributeString.trim()}`;
    }
  }

  /* This is a format that is consumed by defineComponent to determine valid attributes
     for the web component. It is a subset of the component spec that can be searched quickly
     and has a reduced filesize.
  */
  getWebComponentSpec(spec = this.spec, { plural = this.plural } = {}) {
    if (spec == this.spec && this.componentSpec) {
      return this.componentSpec;
    }

    let componentSpec = {
      tagName: this.getTagName(),
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
      let specPart = spec[section] || [];

      // plural spec uses a separate array to list which values are permitted to be shared
      if (plural) {
        const permittedListNames = {
          types: 'pluralSharedTypes',
          variations: 'pluralSharedVariations',
          states: 'pluralSharedStates',
          content: 'pluralSharedContent',
          settings: 'pluralSharedSettings',
          events: 'pluralSharedEvents',
        };
        const permittedListName = get(permittedListNames, section);
        const permittedValues = get(spec, permittedListName) || [];
        if (permittedListName) {
          specPart = specPart.filter((spec) => {
            const propertyName = this.getPropertyName(spec);
            return inArray(propertyName, permittedValues);
          });
        }

        // the section name will not corresponse to the section name passed in
        section = section.replace('pluralOnly', '').toLowerCase();
      }
      each(specPart, (spec) => {
        const propertyName = this.getPropertyName(spec);

        // it is a requirement to have a property name defined
        if (!propertyName) {
          return;
        }

        // add to list of this grouping, i.e types: ['emphasis']
        if (componentSpec[section]) {
          componentSpec[section].push(propertyName);
        }

        // find allowed option values for this attribute i.e. emphasis: ['primary', 'secondary']
        const allowedValues = this.getAllowedValues(spec);
        if (allowedValues) {
          componentSpec.allowedValues[propertyName] = allowedValues;
        }

        // find native type of this property i.e. String
        const propertyType = this.getPropertyType({ spec, section, allowedValues });
        if (propertyType) {
          componentSpec.propertyTypes[propertyName] = propertyType;
        }

        // find attribute name if it its not a function
        const attributeName = this.getAttributeName(spec, propertyType);
        if (attributeName) {
          componentSpec.attributes.push(attributeName);
        }
        else {
          componentSpec.properties.push(propertyName);
        }

        // find default values
        const defaultValue = this.getDefaultValue(spec, propertyType, section);
        if (defaultValue !== undefined) {
          componentSpec.defaultValues[propertyName] = defaultValue;
        }

        /* Special Cases */

        // "content" can be attribute or slot
        if (section === 'content') {
          if (spec.attribute) {
            componentSpec.contentAttributes.push(spec.attribute);
          }
          else if (spec.slot) {
            componentSpec.slots.push(spec.slot);
          }
        }

        // attributes can opt in to having its attribute as a ui class name
        // i.e. ['attached', 'left-attached'] includes 'attached' the attribute as a class
        if (attributeName && spec.includeAttributeClass) {
          componentSpec.attributeClasses.push(propertyName);
        }
      });
    };

    // Only process necessary parts of the spec
    const singularParts = [
      'content',
      'types',
      'states',
      'variations',
      'settings',
      'events',
    ];
    each(singularParts, addSettingsFromPart);

    if (plural) {
      const pluralOnlyParts = [
        'pluralOnlyContent',
        'pluralOnlyTypes',
        'pluralOnlyStates',
        'pluralOnlySettings',
        'pluralOnlyVariations',
        'pluralOnlyEvents',
      ];
      each(pluralOnlyParts, addSettingsFromPart);
    }

    // build optionAttributes: reverse lookup from value → attribute name
    this.buildOptionAttributes({ componentSpec, spec });

    // store some details for plurality if present
    componentSpec.inheritedPluralVariations = spec.pluralSharedVariations || [];

    // filter out empty arrays and objects to reduce filesize further
    componentSpec = filterObject(componentSpec, (value) => !isEmpty(value));

    this.componentSpec = componentSpec;

    return componentSpec;
  }

  /* This is a format that is consumed by defineComponent to determine valid attributes
     for the web component. It is a subset of the component spec that can be searched quickly
     and has a reduced filesize.
  */
  getPluralWebComponentSpec(spec = this.spec) {
    if (spec == this.spec && this.componentSpec) {
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
        if (!propertyName) {
          return;
        }

        // add to list of this grouping, i.e types: ['emphasis']
        componentSpec[section].push(propertyName);

        // find allowed option values for this attribute i.e. emphasis: ['primary', 'secondary']
        const allowedValues = this.getAllowedValues(spec);
        if (allowedValues) {
          componentSpec.allowedValues[propertyName] = allowedValues;
        }

        // find native type of this property i.e. String
        const propertyType = this.getPropertyType({ spec, section, allowedValues });
        if (propertyType) {
          componentSpec.propertyTypes[propertyName] = propertyType;
        }

        // find attribute name if it its not a function
        const attributeName = this.getAttributeName(spec, propertyType);
        if (attributeName) {
          componentSpec.attributes.push(attributeName);
        }
        else {
          componentSpec.properties.push(propertyName);
        }

        // find default values
        const defaultValue = this.getDefaultValue(spec, propertyType, section);
        if (defaultValue !== undefined) {
          componentSpec.defaultValues[propertyName] = defaultValue;
        }

        /* Special Cases */

        // "content" can be attribute or slot
        if (section === 'content') {
          if (spec.attribute) {
            componentSpec.contentAttributes.push(spec.attribute);
          }
          else if (spec.slot) {
            componentSpec.slots.push(spec.slot);
          }
        }

        // attributes can opt in to having its attribute as a ui class name
        // i.e. ['attached', 'left-attached'] includes 'attached' the attribute as a class
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
    addSettingsFromPart('pluralVariations');
    addSettingsFromPart('settings');
    addSettingsFromPart('events');

    // build optionAttributes with collision detection
    this.buildOptionAttributes({ componentSpec });

    // store some details for plurality if present
    componentSpec.inheritedPluralVariations = spec.pluralSharedVariations || [];

    this.componentSpec = componentSpec;

    return componentSpec;
  }

  /* Returns the attribute name for a given spec part */
  getAttributeName(specPart, type) {
    if (!this.canUseAttribute(type)) {
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

  getPropertyType({ spec, section, allowedValues = [], withPrototype = false } = {}) {
    let types = {
      string: 'string',
      boolean: 'boolean',
      object: 'object',
      array: 'array',
      function: 'function',
    };
    /*
      If we want to allow component spec to be JSON we cant store prototypes
    */
    if (withPrototype) {
      types = {
        string: String,
        number: Number,
        boolean: Boolean,
        object: Object,
        array: Array,
        function: Function,
      };
    }

    let type;
    let stringType;
    if (section == 'events') {
      // events are always functions
      type = types.function;
    }
    else if (inArray(section, ['types', 'states', 'variations'])) {
      // visual modifications (types, states, variations) default to boolean attrs
      // unless they have allowed values
      type = types.boolean;
    }
    else if (inArray(section, ['content'])) {
      // content defaults to string type
      type = types.string;
    }

    if (spec.type && types[spec.type]) {
      // if they specify a type then lets use that as long as its a known type
      stringType = spec.type;
    }
    else if (allowedValues.length) {
      // if they specify allowed values we can infer type from a sample
      const valueTypes = unique(allowedValues.map(value => typeof value));
      stringType = (valueTypes.length > 1)
        ? types.string
        : valueTypes[0];
    }
    if (stringType) {
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
    if (spec.defaultValue !== undefined) {
      return spec.defaultValue;
    }
    if (section !== 'settings') {
      return;
    }
    const defaultValues = {
      string: '',
      array: [],
      boolean: false,
      function: noop,
      number: 0,
      object: {},
    };
    return get(defaultValues, type);
  }

  canUseAttribute(type) {
    if (type == Function) {
      return false;
    }
    return true;
  }

  /*
    Returns the concise attribute form for a value.
    If the value requires a compound form (e.g. "subtle" on "positive" → "subtle-positive"),
    returns the compound. Otherwise returns the bare value.
  */
  getConciseModifier(attribute, value) {
    const componentSpec = this.getWebComponentSpec();
    const compoundForms = [`${value}-${attribute}`, `${attribute}-${value}`];
    const compoundForm = firstMatch(compoundForms, (form) => componentSpec.optionAttributes[form]);
    // use compound if bare value doesn't point to this attribute
    if (compoundForm && componentSpec.optionAttributes[value] !== attribute) {
      return compoundForm;
    }
    return value;
  }

  /*
    Builds the optionAttributes lookup from allowedValues.
    Handles three cases:
    - Bare values: unique values get direct lookup (e.g. "primary" → "emphasis")
    - Auto-detected collisions: values appearing in multiple attributes get compound forms
      (e.g. "subtle" in styled + positive → "subtle-styled", "subtle-positive")
    - Manual compoundAliases: parts opt-in to compound forms for readability
      (e.g. animated → "vertical-animated", "fade-animated")
  */
  buildOptionAttributes({ componentSpec, spec }) {
    // step 1: base lookup via reverseKeys
    let options = mapObject(componentSpec.allowedValues, (values, key) => {
      return values = values.filter(value => isString(value));
    });
    componentSpec.optionAttributes = reverseKeys(options);

    // step 2: detect which specific values collide across attributes
    // skip identity values (value === attr) as they are boolean-style attributes
    // track first attribute to register each value — it "owns" the bare form
    const valueCounts = {};
    const firstOwner = {};
    each(componentSpec.allowedValues, (allowedValues, attr) => {
      each(allowedValues, (value) => {
        if (isString(value) && value !== attr) {
          if (!valueCounts[value]) {
            valueCounts[value] = [];
            firstOwner[value] = attr;
          }
          valueCounts[value].push(attr);
        }
      });
    });
    const collidingValues = new Set();
    const collidingAttributes = new Set();
    each(valueCounts, (attrs, value) => {
      if (attrs.length > 1) {
        collidingValues.add(value);
        each(attrs, (attr) => collidingAttributes.add(attr));
      }
    });

    // step 3: generate compound entries
    // when any value in an attribute collides, ALL sibling values get compound forms
    // e.g. "left" and "right" collide between floated/attached
    // → attached also generates "top-attached", "bottom-attached" for consistency
    // colliding values lose their bare entry, non-colliding siblings keep theirs
    each(componentSpec.allowedValues, (allowedValues, attr) => {
      if (!collidingAttributes.has(attr)) {
        return;
      }
      each(allowedValues, (value) => {
        if (!isString(value) || value === attr) {
          return;
        }
        // generate compound form for all values in a colliding attribute
        componentSpec.optionAttributes[`${value}-${attr}`] = attr;
        // only remove bare entry for actually colliding values
        if (collidingValues.has(value) && attr !== firstOwner[value]) {
          delete componentSpec.optionAttributes[value];
        }
      });
    });

    // step 4: add compound aliases for parts that manually opt-in (e.g. animated)
    // compounds all non-identity, non-colliding values on the part
    if (spec) {
      const partsWithOptions = [...(spec.types || []), ...(spec.states || []), ...(spec.variations || [])];
      each(partsWithOptions, (part) => {
        if (!part.compoundAliases) {
          return;
        }
        const attr = part.attribute || part.name?.toLowerCase();
        const allowedValues = componentSpec.allowedValues[attr];
        if (!allowedValues) {
          return;
        }
        each(allowedValues, (value) => {
          if (!isString(value) || value === attr || collidingValues.has(value)) {
            return;
          }
          if (part.prefixCompound) {
            componentSpec.optionAttributes[`${attr}-${value}`] = attr;
          }
          else {
            componentSpec.optionAttributes[`${value}-${attr}`] = attr;
          }
          delete componentSpec.optionAttributes[value];
        });
      });
    }
  }
}
