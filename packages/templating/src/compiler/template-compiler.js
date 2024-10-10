import { each, isString, last } from '@semantic-ui/utils';

import { StringScanner } from './string-scanner.js';

class TemplateCompiler {

  constructor(templateString) {
    this.templateString = templateString || '';
    this.snippets = {};
  }

  static tagRegExp = {
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

  // used to advance scanner to either a parseable expression or svg tag
  static nextTagRegExp = /(\{\{|\<svg|\<\/svg)/;

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

    // quicker to compile regExp once
    const tagRegExp = TemplateCompiler.tagRegExp;
    const htmlRegExp = TemplateCompiler.htmlRegExp;

    const parseTag = (scanner) => {
      for (let type in tagRegExp) {
        if (scanner.matches(tagRegExp[type])) {
          const context = scanner.getContext(); // context is used for better error handling
          scanner.consume(tagRegExp[type]);
          const content = this.getValue(scanner.consumeUntil('}}').trim());
          scanner.consume('}}');
          return { type, content, ...context }; // Include context in the return value
        }
      }
      for (let type in htmlRegExp) {
        if (scanner.matches(htmlRegExp[type])) {
          scanner.consume(htmlRegExp[type]);
          const context = scanner.getContext(); // context is used for better error handling
          const content = this.getValue(scanner.consumeUntil('>').trim());
          scanner.consume('>');
          return { type, content, ...context }; // Include context in the return value
        }
      }
      // Return null if no tag is matched
      return null;
    };

    const ast = [];
    const stack = [];

    let contentBranch = null; // Track the current node to add content
    let conditionStack = []; // Track the current condition stack
    let contentStack = []; // Track the current content target stack

    while (!scanner.isEOF()) {
      const tag = parseTag(scanner);

      const conditionTarget = last(conditionStack);
      const contentTarget = contentBranch?.content || ast;

      if (tag) {
        let newNode = {
          type: tag.type.toLowerCase(),
        };

        switch (tag.type) {
          case 'IF':
            newNode = {
              ...newNode,
              condition: tag.content,
              content: [],
              branches: [],
            };
            contentTarget.push(newNode);
            conditionStack.push(newNode);
            contentStack.push(newNode);
            contentBranch = newNode;
            break;

          case 'ELSEIF':
            newNode = {
              ...newNode,
              condition: tag.content,
              content: [],
            };
            if (!conditionTarget) {
              scanner.returnTo(tagRegExp.ELSEIF);
              scanner.fatal(
                '{{elseif}} encountered without matching if condition'
              );
            }
            contentStack.pop();
            contentStack.push(newNode);
            conditionTarget.branches.push(newNode);
            contentBranch = newNode;
            break;

          case 'ELSE':
            newNode = {
              ...newNode,
              content: [],
            };
            if (!conditionTarget) {
              scanner.returnTo(tagRegExp.ELSE);
              scanner.fatal(
                '{{else}} encountered without matching if condition'
              );
              break;
            }
            contentStack.pop();
            contentStack.push(newNode);
            conditionTarget.branches.push(newNode);
            contentBranch = newNode;
            break;

          case 'CLOSE_IF':
            if (conditionStack.length == 0) {
              scanner.returnTo(tagRegExp.CLOSE_IF);
              scanner.fatal('{{/if}} close tag found without open if tag');
            }
            stack.pop();
            contentStack.pop();
            conditionStack.pop();
            contentBranch = last(contentStack); // Reset current branch
            break;

          case 'SNIPPET':
            newNode = {
              ...newNode,
              type: 'snippet',
              name: tag.content,
              content: [],
            };
            this.snippets[tag.content] = newNode;
            contentTarget.push(newNode);
            conditionStack.push(newNode);
            contentStack.push(newNode);
            contentBranch = newNode;
            break;

          case 'CLOSE_SNIPPET':
            if (conditionStack.length == 0) {
              scanner.returnTo(tagRegExp.CLOSE_IF);
              scanner.fatal('{{/snippet}} close tag found without open if tag');
            }
            stack.pop();
            contentStack.pop();
            contentBranch = last(contentStack); // Reset current branch
            break;

          case 'HTML_EXPRESSION':
            newNode = {
              ...newNode,
              type: 'expression',
              unsafeHTML: true,
              value: tag.content,
            };
            contentTarget.push(newNode);
            scanner.consume('}'); // got an extra }
            break;

          case 'EXPRESSION':
            newNode = {
              ...newNode,
              value: tag.content,
            };
            if (tag.booleanAttribute) {
              newNode.ifDefined = true;
            }
            contentTarget.push(newNode);
            break;

          case 'TEMPLATE':
            const templateInfo = this.parseTemplateString(tag.content);
            newNode = {
              ...newNode,
              ...templateInfo,
            };
            contentTarget.push(newNode);
            break;

          case 'SLOT':
            newNode = {
              ...newNode,
              name: tag.content,
            };
            contentTarget.push(newNode);
            break;

          case 'EACH':
            const contentParts = tag.content.split(' in ');

            let iterateOver;
            let iterateAs;
            if (contentParts.length > 1) {
              iterateAs = contentParts[0].trim();
              iterateOver = contentParts[1].trim();
            }
            else {
              iterateOver = contentParts[0].trim();
            }
            newNode = {
              ...newNode,
              over: iterateOver,
              content: [],
            };
            if (iterateAs) {
              newNode.as = iterateAs;
            }

            contentStack.push(newNode);
            contentTarget.push(newNode);
            contentBranch = newNode;
            break;

          case 'CLOSE_EACH':
            stack.pop();
            contentStack.pop();
            contentBranch = last(contentStack); // Reset current branch
            break;

          case 'SVG_OPEN':
            // AST inside <svg> open tag is not included
            contentTarget.push({ type: 'html', html: '<svg ' });
            contentTarget.push(...this.compile(tag.content));
            contentTarget.push({ type: 'html', html: '>' });
            newNode = {
              type: 'svg',
              content: [],
            };
            contentStack.push(newNode);
            contentTarget.push(newNode);
            contentBranch = newNode;
            break;

          case 'SVG_CLOSE':
            stack.pop();
            contentStack.pop();
            contentBranch = last(contentStack); // Reset current branch
            newNode = {
              type: 'html',
              html: '</svg>',
            };
            (contentBranch || ast).push(newNode);
            break;
        }
      }
      else {
        // advanced to next expression or open svg tag
        // this advances the scanner adding html
        const html = scanner.consumeUntil(TemplateCompiler.nextTagRegExp);
        if (html) {
          const htmlNode = { type: 'html', html };
          contentTarget.push(htmlNode);
        }
      }
    }

    return TemplateCompiler.optimizeAST(ast);
  }

  getValue(expression) {
    if (expression == 'true') {
      return true;
    }
    else if (expression == 'false') {
      return false;
    }
    else if (!Number.isNaN(parseFloat(expression))) {
      return +expression;
    }
    return expression;
  }
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
      templateInfo.data = data;
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
      }
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
        } else {
          currentHtmlNode = { ...node };
          optimizedAST.push(currentHtmlNode);
        }
      } else {
        if (currentHtmlNode) {
          currentHtmlNode = null;
        }
        if (Array.isArray(node.content)) {
          node.content = this.optimizeAST(node.content);
        }
        optimizedAST.push(node);
      }
    };

    ast.forEach(processNode);

    return optimizedAST;
  }
}

export { TemplateCompiler };
