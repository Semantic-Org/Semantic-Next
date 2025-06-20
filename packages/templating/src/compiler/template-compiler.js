import { each, isPlainObject, isString, last } from '@semantic-ui/utils';

import { StringScanner } from './string-scanner.js';

class TemplateCompiler {
  constructor(templateString) {
    this.templateString = templateString || '';
    this.snippets = {};
  }

  static singleBracketRegExp = {
    IF: /^{\s*#if\s+/,
    ELSEIF: /^{\s*else\s*if\s+/,
    ELSE: /^{\s*else\s*/,
    EACH: /^{\s*#each\s+/,
    SNIPPET: /^{\s*#snippet\s+/,
    ASYNC: /^{\s*#(async)\s+/,
    ASYNC_BEFORE: /^{\s*(before|loading)(\s+|(?=}}))/,
    ASYNC_ERROR: /^{\s*(error|catch)(\s+|(?=}}))/,
    CLOSE_IF: /^{\s*\/(if)\s*/,
    CLOSE_EACH: /^{\s*\/(each)\s*/,
    CLOSE_SNIPPET: /^{\s*\/(snippet)\s*/,
    CLOSE_ASYNC: /^{\s*\/(async)\s*/,
    SLOT: /^{>\s*slot\s*/,
    TEMPLATE: /^{>\s*/,
    HTML_EXPRESSION: /^{\s*#html\s*/,
    EXPRESSION: /^{\s*/,
  };

  static singleBracketParserRegExp = {
    NEXT_TAG: /(\{|\<svg|\<\/svg)/, // used to advance scanner to either a parseable expression or svg tag
    EXPRESSION_START: /\{/,
    EXPRESSION_END: /\}/,
    TAG_CLOSE: /\>/,
  };

  static doubleBracketRegExp = {
    IF: /^{{\s*#if\s+/,
    ELSEIF: /^{{\s*else\s*if\s+/,
    ELSE: /^{{\s*else\s*/,
    EACH: /^{{\s*#each\s+/,
    SNIPPET: /^{{\s*#snippet\s+/,
    CLOSE_IF: /^{{\s*\/(if)\s*/,
    CLOSE_EACH: /^{{\s*\/(each)\s*/,
    CLOSE_SNIPPET: /^{{\s*\/(snippet)\s*/,
    SLOT: /^{{>\s*slot\s*/,
    TEMPLATE: /^{{>\s*/,
    HTML_EXPRESSION: /^{{\s*#html\s*/,
    EXPRESSION: /^{{\s*/,
  };

  static doubleBracketParserRegExp = {
    NEXT_TAG: /(\{\{|\<svg|\<\/svg)/, // used to advance scanner to either a parseable expression or svg tag
    EXPRESSION_START: /\{\{/,
    EXPRESSION_END: /\}\}/,
    TAG_CLOSE: /\>/,
  };

  static htmlRegExp = {
    SVG_OPEN: /^\<svg\s*/i,
    SVG_CLOSE: /^\<\/svg\s*/i,
  };

  static preprocessRegExp = {
    WEB_COMPONENT_SELF_CLOSING: /<(\w+-\w+)([^>]*)\/>/g,
  };

  static templateRegExp = {
    VERBOSE_KEYWORD: /^(template|snippet)\W/g,
    VERBOSE_PROPERTIES: /(\w+)\s*=\s*(((?!\w+\s*=).)+)/gms,
    STANDARD: /(\w+)\s*=\s*((?:(?!\n|$|\w+\s*=).)+)/g,
    DATA_OBJECT: /(\w+)\s*:\s*([^,}]+)/g, // parses { one: 'two' }
    SINGLE_QUOTES: /\'/g,
  };

  /*
    Creates an AST representation of a template
    from a template string
  */
  compile(templateString = this.templateString) {
    templateString = TemplateCompiler.preprocessTemplate(templateString);
    const scanner = new StringScanner(templateString);

    if (!isString(templateString)) {
      scanner.fatal('Template is not a string', templateString);
    }

    // compile regexp globally once
    const { htmlRegExp } = TemplateCompiler;

    // support either {{}} or {} syntax but only one across a file
    const syntax = TemplateCompiler.detectSyntax(templateString);
    const tagRegExp = (syntax == 'doubleBracket')
      ? TemplateCompiler.doubleBracketRegExp
      : TemplateCompiler.singleBracketRegExp;
    const parserRegExp = (syntax == 'doubleBracket')
      ? TemplateCompiler.doubleBracketParserRegExp
      : TemplateCompiler.singleBracketParserRegExp;

    const parseTag = (scanner) => {
      // if this expression contains nested expressions like { one { two } }
      // we want tag content to include all nested expressions
      let getTagContent = () => {
        // break if we are already at the end of the expr
        if (scanner.peek() == '}') {
          scanner.consumeUntil(parserRegExp.EXPRESSION_END);
          return;
        }

        // step through expression evaluating sub expressions
        // stopping when the final sub expression completes
        let openTags = 1;
        let content = scanner.peek();
        while (openTags > 0 && !scanner.isEOF()) {
          scanner.step();
          if (scanner.peek() == '{') {
            openTags++;
          }
          if (scanner.peek() == '}') {
            openTags--;
          }
          if (openTags == 0) {
            // we need to rewind as it is at '}'
            scanner.rewind();
            break;
          }
          content += scanner.peek();
        }

        // move pointer to the end of the expression
        scanner.consumeUntil(parserRegExp.EXPRESSION_END);
        scanner.consume(parserRegExp.EXPRESSION_END);

        // remove whitespace
        content = content.trim();
        return content;
      };

      // look for each special expression like if/each/else
      for (let type in tagRegExp) {
        if (scanner.matches(tagRegExp[type])) {
          const context = scanner.getContext(); // context is used for better error handling
          scanner.consume(tagRegExp[type]);
          const rawContent = getTagContent();
          scanner.consume(parserRegExp.EXPRESSION_END);
          const content = this.getValue(rawContent);
          return { type, content, ...context }; // Include context in the return value
        }
      }

      // look for each primitive like <svg>
      for (let type in htmlRegExp) {
        if (scanner.matches(htmlRegExp[type])) {
          scanner.consume(htmlRegExp[type]);
          const context = scanner.getContext(); // context is used for better error handling
          const content = this.getValue(scanner.consumeUntil(parserRegExp.TAG_CLOSE).trim());
          scanner.consume(parserRegExp.TAG_CLOSE);
          return { type, content, ...context }; // Include context in the return value
        }
      }

      // Return null if no tag is matched
      return null;
    };

    // the entire AST being generaetd
    const ast = [];

    // a stack containing nodes that can receive nodes in their subtree
    let contentStack = [];

    // a stack containing nodes that support elseif/else. this includes if but also each and async
    let conditionStack = [];

    while (!scanner.isEOF()) {
      // extract details from inside {tag}
      const tag = parseTag(scanner);

      // the node which receive this content in its subtree
      const currentContent = last(contentStack);

      // the current open conditional node
      const currentCondition = last(conditionStack);

      // the actual array which will receive the subtree
      // this can be stored like { property, node }
      let contentTarget = isPlainObject(currentContent)
        ? currentContent.node[currentContent?.property]
        : ast;

      if(currentContent && currentContent?.property !== 'content') {
        console.log('target is', currentContent);
      }

      const currentContentNode = currentContent?.node;


      /*
        These simple functions make it less confusing to read AST blocks
      */

      /*
        This changes the node receiving content in AST.
        We store both the node and the receiving property on the node
        as some nodes might have multiple AST targets like 'elseContent', 'content' etc.
      */
      const setCurrentContent = (node, property = 'content') => {
        // initialize empty AST if not present
        if(!node[property]) {
          node[property] = [];
        }
        contentStack.push({
          node,
          property
        });
      };

      /* this removes content target from stack.
         this occurs if a content block is closed or a same-level condition like {async} -> {error} or {if} -> {else}
      */
      const returnToLastContent = () => {
        contentStack.pop();
      };

      // this allows us to swap what property on an active content node
      // is receiving the AST, i.e. from 'content' -> 'elseContent'
      const setContentTarget = (newProperty) => {
        setCurrentContent(currentContentNode, newProperty);
      };

      /* This changes the node receiving conditions in AST */
      const setCurrentCondition = (conditionNode) => {
        conditionStack.push(conditionNode);
      };
      const returnToLastCondition = () => {
        conditionStack.pop();
      };

      /* This adds the current node to the AST */
      const addToAST = (...nodes) => {
        if(contentTarget == undefined) {
          contentTarget = [];
        }
        contentTarget.push(...nodes);
      };

      if (tag) {
        let newNode = {
          type: tag.type.toLowerCase(),
        };

        switch (tag.type) {

          case 'IF': {
            newNode = {
              ...newNode,
              condition: tag.content,
              content: [],
              branches: [],
            };
            setCurrentContent(newNode);
            setCurrentCondition(newNode);
            addToAST(newNode);
            break;
          }

          case 'ELSEIF': {
            newNode = {
              ...newNode,
              condition: tag.content,
              content: [],
            };
            if (!currentCondition) {
              scanner.returnTo(tagRegExp.ELSEIF);
              scanner.fatal(
                '{elseif} encountered without matching if condition',
              );
            }
            returnToLastContent();
            setCurrentContent(newNode);
            currentCondition.branches.push(newNode);
            break;
          }

          case 'ELSE': {
            newNode = {
              ...newNode,
              content: [],
            };
            if (!currentCondition) {
              scanner.returnTo(tagRegExp.ELSE);
              scanner.fatal(
                '{else} encountered without matching if or each condition',
              );
              break;
            }

            if (currentCondition.type === 'if') {
              // Handling for if/else pushes to branches: []
              returnToLastContent();
              setCurrentContent(newNode);
              currentCondition.branches.push(newNode);
            }
            else if (currentCondition?.type == 'each') {
              // some conditions might have elseContent like #each instead of branches array
              returnToLastContent();
              setContentTarget('elseContent');
            }
            else {
              scanner.returnTo(tagRegExp.ELSE);
              scanner.fatal(
                '{else} encountered with unknown condition type: ' + currentCondition.type,
              );
            }
            break;
          }

          case 'CLOSE_IF': {
            if (conditionStack.length == 0) {
              scanner.returnTo(tagRegExp.CLOSE_IF);
              scanner.fatal('{/if} close tag found without open if tag');
            }
            returnToLastContent();
            returnToLastCondition();
            break;
          }

          case 'SNIPPET': {
            newNode = {
              ...newNode,
              type: 'snippet',
              name: tag.content,
              content: [],
            };
            this.snippets[tag.content] = newNode;
            setCurrentContent(newNode);
            addToAST(newNode);
            break;
          }

          case 'CLOSE_SNIPPET': {
            returnToLastContent();
            break;
          }

          case 'HTML_EXPRESSION': {
            newNode = {
              ...newNode,
              type: 'expression',
              unsafeHTML: true,
              value: tag.content,
            };
            addToAST(newNode);
            scanner.consume('}'); // got an extra }
            break;
          }

          case 'EXPRESSION': {
            newNode = {
              ...newNode,
              value: tag.content,
            };
            if (tag.booleanAttribute) {
              newNode.ifDefined = true;
            }
            addToAST(newNode);
            break;
          }

          case 'TEMPLATE': {
            const templateInfo = this.parseTemplateString(tag.content);
            newNode = {
              ...newNode,
              ...templateInfo,
            };
            addToAST(newNode);
            break;
          }

          case 'SLOT': {
            newNode = {
              ...newNode,
              name: tag.content,
            };
            addToAST(newNode);
            break;
          }

          case 'EACH': {
            // support each..in and each..as with aliases
            const { indexAs, as, over } = TemplateCompiler.parseIteratorString(tag.content);

            newNode = {
              ...newNode,
              over,
              content: [],
            };

            if (as) {
              newNode.as = as;
            }

            if (indexAs) {
              newNode.indexAs = indexAs;
            }

            setCurrentContent(newNode); // node can receive child nodes
            setCurrentCondition(newNode); // any node that supports {else} is a condition
            addToAST(newNode);
            break;
          }

          case 'CLOSE_EACH': {
            returnToLastContent();
            returnToLastCondition(); // Pop from condition stack
            break;
          }

          case 'ASYNC': {
            // support each..in and each..as with aliases or destructuring
            const { as, parts, rest } = TemplateCompiler.parseAsyncString(tag.content);

            newNode = {
              ...newNode,
              content: [],
              loadingContent: [],
              errorContent: [],
            };

            if (as) {
              newNode.as = as;
            }
            if (parts) {
              newNode.parts = parts;
            }
            if (rest) {
              newNode.rest = rest;
            }

            setCurrentContent(newNode);
            addToAST(newNode);
            break;
          }

          case 'ASYNC_BEFORE': {
            if (currentContentNode.type !== 'async') {
              scanner.returnTo(tagRegExp.ASYNC_BEFORE);
              scanner.fatal(
                '{before} encountered without matching {async} condition',
              );
            }
            returnToLastContent();
            setContentTarget('loadingContent');
            break;
          }

          case 'ASYNC_ERROR': {
            if (currentContentNode.type !== 'async') {
              scanner.returnTo(tagRegExp.ASYNC_ERROR);
              scanner.fatal(
                `{error} encountered without matching {async} condition in "${currentContent}"`,
              );
            }
            const { as } = TemplateCompiler.parseAsyncString(tag.content);
            currentContentNode.errorAs = as;
            returnToLastContent();
            setContentTarget('errorContent');
            break;
          }

          case 'CLOSE_ASYNC': {
            returnToLastContent();
            break;
          }

          case 'SVG_OPEN': {
            // AST inside <svg> open tag is not included
            addToAST({ type: 'html', html: '<svg ' });
            addToAST(...this.compile(tag.content));
            addToAST({ type: 'html', html: '>' });
            newNode = {
              type: 'svg',
              content: [],
            };
            setCurrentContent(newNode);
            addToAST(newNode);
            break;
          }

          case 'SVG_CLOSE': {
            returnToLastContent();
            newNode = {
              type: 'html',
              html: '</svg>',
            };
            (contentTarget || ast).push(newNode);
            break;
          }
        }
      }
      else {
        // advances to next expression
        const html = scanner.consumeUntil(parserRegExp.NEXT_TAG);

        // if we consumed any html add it as an html node
        if (html) {
          const htmlNode = { type: 'html', html };
          addToAST(htmlNode);
        }
      }
    }
    const optimizedAST = TemplateCompiler.optimizeAST(ast);
    return optimizedAST;
  }

  getValue(expression) {
    if (expression == 'true') {
      return true;
    }
    else if (expression == 'false') {
      return false;
    }
    else if (isString(expression) && expression.trim() !== '' && Number.isFinite(+expression)) {
      return Number(expression);
    }
    return expression;
  }

  /* Parses the various syntax for embedding subtemplates */
  parseTemplateString(expression = '') {
    // quicker to compile regexp once
    const regExp = TemplateCompiler.templateRegExp;
    let templateInfo = {};

    regExp.VERBOSE_KEYWORD.lastIndex = 0;
    if (regExp.VERBOSE_KEYWORD.test(expression)) {
      // verbose notation {{> template name=templateName reactiveData={one: 'one', two: 'two'} }}
      const matches = [...expression.matchAll(regExp.VERBOSE_PROPERTIES)];
      each(matches, (match, index) => {
        const property = match[1];
        const value = TemplateCompiler.getObjectFromString(match[2]);
        templateInfo[property] = value;
      });
    }
    else {
      // standard notation {{> templateName data1=value data2=value}}
      let data = {};
      const name = expression.split(/\b/)[0];
      templateInfo.name = `'${name}'`;
      const dataMatches = [...expression.matchAll(regExp.STANDARD)];
      each(dataMatches, (match, index) => {
        let name = match[1].trim();
        let value = match[2].trim();
        data[name] = value;
      });
      // standard notation defaults to reactive data
      templateInfo.reactiveData = data;
    }
    return templateInfo;
  }

  static getObjectFromString(objectString = '') {
    const regExp = TemplateCompiler.templateRegExp.DATA_OBJECT;
    const obj = {};
    let match;
    let isObject = false;
    while ((match = regExp.exec(objectString)) !== null) {
      isObject = true;
      obj[match[1]] = match[2].trim();
    }
    // if this isnt an object we want to return the string value which may be an expression
    return isObject ? obj : objectString.trim();
  }

  static detectSyntax(templateString = '') {
    // look for first expression
    const doubleIndex = templateString.search(/{{\s*/);
    const singleIndex = templateString.search(/{[^{]\s*/);
    if (doubleIndex !== -1 && doubleIndex < singleIndex) {
      return 'doubleBracket';
    }
    return 'singleBracket';
  }

  static parseAsyncString(asyncString = '') {
    // Check for 'each...as' syntax if present
    const asParts = asyncString.split('as ');
    if (asParts.length > 1) {
      const asString = asParts[1].trim();
      return TemplateCompiler.parseDestructuring(asString);
    }
    return { as: null, parts: null, rest: null };
  }

  /* Allows for templates to include destructuring (used by async) */
  static parseDestructuring(destructuringString = '') {
    destructuringString = destructuringString.trim();

    // no destructuring
    if (destructuringString[0] != '{') {
      return {
        as: destructuringString,
        properties: null,
        rest: null,
      };
    }

    // Remove "{}"
    const content = destructuringString.slice(1, -1).trim();

    const properties = [];
    let rest = null;

    // Simple parsing - split by comma and handle ...rest
    const tokens = content
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    // grab properties
    each(tokens, token => {
      if (token.startsWith('...')) {
        rest = token.slice(3).trim();
      }
      else {
        properties.push(token);
      }
    });

    return {
      as: null,
      properties,
      rest,
    };
  }

  /* Extracts parts of an iterator like each..as each..in */
  static parseIteratorString(iteratorString = '') {
    let as, over, indexAs;

    // Check for 'each...in' syntax first
    const inParts = iteratorString.split(' in ');

    // Check for 'each...as' syntax
    const asParts = iteratorString.split(' as ');

    if (inParts.length > 1) {
      // We have 'each...in' syntax
      // Get the iterator variables (item and possibly index)
      let iteratorPart = inParts[0].trim();
      over = inParts[1].trim();

      // Look for comma separator in the iterator part
      const commaIndex = iteratorPart.indexOf(',');
      if (commaIndex !== -1) {
        // We have both item and index specified
        as = iteratorPart.substring(0, commaIndex).trim();
        indexAs = iteratorPart.substring(commaIndex + 1).trim();
      }
      else {
        // Only item is specified
        as = iteratorPart;
      }
    }
    else if (asParts.length > 1) {
      // We have 'each...as' syntax
      over = asParts[0].trim();

      // Check for comma in the second part (for index)
      const iteratorPart = asParts[1].trim();
      const commaIndex = iteratorPart.indexOf(',');
      if (commaIndex !== -1) {
        // We have both item and index specified
        as = iteratorPart.substring(0, commaIndex).trim();
        indexAs = iteratorPart.substring(commaIndex + 1).trim();
      }
      else {
        // Only item is specified
        as = iteratorPart;
      }
    }
    else {
      // Simple each without 'in' or 'as'
      over = iteratorString.trim();
    }

    return { as, over, indexAs };
  }

  static preprocessTemplate(templateString = '') {
    templateString = templateString.trim();

    /*
      support self closing web component tags
      this allows you to do <ui-icon icon="foo" />
      instead of <ui-icon icon="foo"></ui-icon>
    */
    templateString = templateString.replace(
      TemplateCompiler.preprocessRegExp.WEB_COMPONENT_SELF_CLOSING,
      (match, tagName, attributes) => {
        return `<${tagName}${attributes}></${tagName}>`;
      },
    );
    return templateString;
  }

  // joins neighboring html nodes into a single node
  static optimizeAST(ast) {
    const optimizedAST = [];
    let currentHtmlNode = null;

    const processNode = (node) => {
      if (node.type === 'html') {
        if (currentHtmlNode) {
          currentHtmlNode.html += node.html;
        }
        else {
          currentHtmlNode = { ...node };
          optimizedAST.push(currentHtmlNode);
        }
      }
      else {
        if (currentHtmlNode) {
          currentHtmlNode = null;
        }
        if (Array.isArray(node.content)) {
          node.content = this.optimizeAST(node.content);
        }
        // Process else block if it exists
        if (node.else && node.else.content) {
          node.else.content = this.optimizeAST(node.else.content);
        }
        optimizedAST.push(node);
      }
    };

    ast.forEach(processNode);

    return optimizedAST;
  }
}

export { TemplateCompiler };
