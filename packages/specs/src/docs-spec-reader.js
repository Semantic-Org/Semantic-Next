import {
  clone,
  each,
  flatten,
  getArticle,
  inArray,
  isArray,
  isString,
  tokenize,
  toTitleCase,
  values,
} from '@semantic-ui/utils';

import { SpecReader } from './spec-reader.js';

export class DocsSpecReader extends SpecReader {
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

    let code;
    if (customExampleCode) {
      code = customExampleCode;
    }
    else {
      code = this.getCodeFromModifiers(defaultModifiers, { html: defaultContent, plural });
    }
    const componentTitle = plural ? (spec.pluralName || spec.name) : spec.name;
    definition.types.push({
      title: componentTitle,
      description: '',
      examples: [
        {
          showCode: false,
          code,
          components: this.getComponentTree(code),
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

    let code;
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
          each(customExampleCode, (codeString) => {
            examples.push({
              code: codeString,
              components: this.getComponentTree(codeString),
            });
          });
        }
        else {
          // Join all examples into one
          let joinedExamples = [];
          each(customExampleCode, (codeString) => {
            joinedExamples.push({
              code: codeString,
              components: this.getComponentTree(codeString),
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
        examples.push({
          code: customExampleCode,
          components: this.getComponentTree(customExampleCode),
        });
      }
    }
    else if (part.options) {
      let examplesToJoin = [];
      each(part.options, (option, index) => {
        const customExampleCode = this.getExampleCode(option, isPlural);

        if (customExampleCode) {
          // Handle both string and array formats
          if (isArray(customExampleCode)) {
            each(customExampleCode, (codeString) => {
              const example = {
                code: codeString,
                components: this.getComponentTree(codeString),
              };
              if (part.separateExamples) {
                examples.push(example);
              }
              else {
                examplesToJoin.push(example);
              }
            });
            return;
          }
          else {
            code = customExampleCode;
          }
        }
        else {
          // construct an example programatically using the option values
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
        }
        const example = {
          code,
          components: this.getComponentTree(code),
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
      examples.push({
        code,
        components: this.getComponentTree(code),
      });
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

  /*
    Returns the concise attribute form for a value.
    If the value requires a compound form (e.g. "subtle" on "positive" → "subtle-positive"),
    returns the compound. Otherwise returns the bare value.
  */
  getConciseModifier(attribute, value) {
    const componentSpec = this.getWebComponentSpec();
    const compoundForms = [`${value}-${attribute}`, `${attribute}-${value}`];
    const compoundForm = compoundForms.find((form) => componentSpec.optionAttributes[form]);
    // use compound if bare value doesn't point to this attribute
    if (compoundForm && componentSpec.optionAttributes[value] !== attribute) {
      return compoundForm;
    }
    return value;
  }

  /*----------------------------------------------
    Component Tree — recursive HTML → node tree
    for SSR rendering of nested web components
  -----------------------------------------------*/

  static VOID_ELEMENTS = new Set([
    'area',
    'base',
    'br',
    'col',
    'embed',
    'hr',
    'img',
    'input',
    'link',
    'meta',
    'source',
    'track',
    'wbr',
  ]);

  /* Returns true if a tag is a web component (all custom elements require a hyphen) */
  isComponentTag(tag) {
    return tag?.includes('-');
  }

  /* Quick regex check for any custom element tag inside an HTML string */
  containsComponentTag(html) {
    return /<[a-z][\w]*-[\w-]*[\s>\/]/.test(html);
  }

  /*
    Parses an opening tag starting at position `pos` in the HTML string.
    Returns { tag, attributeString, selfClosing, endIndex }
    where endIndex is the index of the closing `>`.
  */
  parseOpeningTag(html, pos) {
    let i = pos + 1; // skip '<'

    // read tag name
    const tagStart = i;
    while (
      i < html.length && html[i] !== ' ' && html[i] !== '>' && html[i] !== '/' && html[i] !== '\n' && html[i] !== '\t'
    ) {
      i++;
    }
    const tag = html.slice(tagStart, i);

    // read attributes until we hit > or />
    const attrStart = i;
    let inQuote = null;
    while (i < html.length) {
      const ch = html[i];
      if (inQuote) {
        if (ch === inQuote) { inQuote = null; }
      }
      else if (ch === '"' || ch === "'") {
        inQuote = ch;
      }
      else if (ch === '>') {
        break;
      }
      i++;
    }

    const selfClosing = html[i - 1] === '/';
    const attributeString = html.slice(attrStart, selfClosing ? i - 1 : i).trim();

    return { tag, attributeString, selfClosing, endIndex: i };
  }

  /*
    Finds the index of the matching closing tag for `tag`,
    starting search at `startPos`. Tracks nesting depth.
    Returns the index of the `<` in `</tag>`.
  */
  findClosingTag(html, tag, startPos) {
    let depth = 1;
    let i = startPos;

    while (i < html.length && depth > 0) {
      if (html[i] === '<') {
        // closing tag?
        if (html[i + 1] === '/') {
          const closeTagStart = i + 2;
          let j = closeTagStart;
          while (j < html.length && html[j] !== '>' && html[j] !== ' ') { j++; }
          const closeTag = html.slice(closeTagStart, j);
          if (closeTag === tag) {
            depth--;
            if (depth === 0) { return i; }
          }
          i = html.indexOf('>', j);
          if (i === -1) { break; }
          i++;
          continue;
        }

        // opening tag — parse to check for self-closing and same-tag nesting
        const nested = this.parseOpeningTag(html, i);
        if (nested.tag === tag && !nested.selfClosing && !DocsSpecReader.VOID_ELEMENTS.has(nested.tag)) {
          depth++;
        }
        i = nested.endIndex + 1;
        continue;
      }
      i++;
    }

    // fallback: end of string
    return html.length;
  }

  /*
    Splits an HTML string into top-level segments.
    Returns array of:
      { type: 'element', tag, attributeString, innerHTML, raw }
      { type: 'text', content }
  */
  segmentHTML(html) {
    const segments = [];
    let i = 0;
    let textStart = 0;

    while (i < html.length) {
      if (html[i] === '<') {
        // skip comments
        if (html.slice(i, i + 4) === '<!--') {
          const commentEnd = html.indexOf('-->', i + 4);
          if (commentEnd !== -1) {
            i = commentEnd + 3;
            continue;
          }
        }

        // skip closing tags (shouldn't appear at top level, but be safe)
        if (html[i + 1] === '/') {
          i++;
          continue;
        }

        // flush accumulated text
        if (i > textStart) {
          const text = html.slice(textStart, i);
          if (text.trim()) {
            segments.push({ type: 'text', content: text });
          }
        }

        // parse the opening tag
        const tagInfo = this.parseOpeningTag(html, i);
        const { tag, attributeString, selfClosing, endIndex } = tagInfo;

        if (selfClosing || DocsSpecReader.VOID_ELEMENTS.has(tag)) {
          const raw = html.slice(i, endIndex + 1);
          segments.push({
            type: 'element',
            tag,
            attributeString,
            innerHTML: '',
            raw,
          });
          i = endIndex + 1;
        }
        else {
          // find matching close tag
          const innerStart = endIndex + 1;
          const closeIndex = this.findClosingTag(html, tag, innerStart);
          const innerHTML = html.slice(innerStart, closeIndex);

          // find end of closing tag
          const closeTagEnd = html.indexOf('>', closeIndex);
          const rawEnd = (closeTagEnd !== -1) ? closeTagEnd + 1 : html.length;
          const raw = html.slice(i, rawEnd);

          segments.push({
            type: 'element',
            tag,
            attributeString,
            innerHTML,
            raw,
          });
          i = rawEnd;
        }
        textStart = i;
      }
      else {
        i++;
      }
    }

    // flush trailing text
    if (textStart < html.length) {
      const text = html.slice(textStart);
      if (text.trim()) {
        segments.push({ type: 'text', content: text });
      }
    }

    return segments;
  }

  /* Converts a segment from segmentHTML into a TreeNode */
  parseSegmentToNode(segment) {
    if (segment.type === 'text') {
      return { type: 'html', html: segment.content };
    }

    const { tag, attributeString, innerHTML, raw } = segment;

    if (this.isComponentTag(tag)) {
      const attributes = this.parseAttributeString(attributeString);
      const children = innerHTML ? this.getComponentTree(innerHTML) : [];
      return {
        type: 'component',
        componentName: tag,
        attributes,
        attributeString: attributeString ? ` ${attributeString}` : '',
        children,
      };
    }

    // non-component element — check if it has component descendants
    if (innerHTML && this.containsComponentTag(innerHTML)) {
      const children = this.getComponentTree(innerHTML);
      return {
        type: 'wrapper',
        tag,
        attributeString: attributeString || '',
        children,
      };
    }

    // plain HTML element, no component descendants
    return { type: 'html', html: raw };
  }

  /*
    Parses an HTML attribute string into an object.
    Handles quoted values, unquoted values, and boolean attributes.
  */
  parseAttributeString(attributeString) {
    const attributes = {};
    if (!attributeString) { return attributes; }
    const regex = /([a-zA-Z_][\w\-.]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|(\S+)))?/g;
    let match;
    while ((match = regex.exec(attributeString))) {
      const key = match[1];
      const value = match[2] ?? match[3] ?? match[4];
      attributes[key] = value !== undefined ? value : true;
    }
    return attributes;
  }

  /*
    Parses an HTML string into a tree of nodes for recursive SSR rendering.
    Returns TreeNode[] where each node is one of:
      { type: 'component', componentName, attributes, attributeString, children }
      { type: 'wrapper', tag, attributeString, children }
      { type: 'html', html }
  */
  getComponentTree(html) {
    if (!html) { return []; }
    html = html.trim();
    if (!html) { return []; }

    // fast path: no component tags at all
    if (!this.containsComponentTag(html)) {
      return [{ type: 'html', html }];
    }

    const segments = this.segmentHTML(html);
    return segments.map(segment => this.parseSegmentToNode(segment));
  }
}
