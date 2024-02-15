import { each, last } from '@semantic-ui/utils';

import { Scanner } from './scanner';

class TemplateCompiler {
  constructor(template) {
    this.template = template || '';
  }

  static tagRegExp = {
    IF: /^{{\s*#if\s+/,
    ELSEIF: /^{{\s*else\s*if\s+/,
    ELSE: /^{{\s*else\s*/,
    EACH: /^{{\s*#each\s+/,
    CLOSE_IF: /^{{\s*\/(if)\s*/,
    CLOSE_EACH: /^{{\s*\/(each)\s*/,
    SLOT: /^{{\s*slot\s*/,
    TEMPLATE: /^{{>\s*/,
    HTML_EXPRESSION: /^{{{\s*/,
    EXPRESSION: /^{{\s*/,
  };

  static templateRegExp = {
    verbose: {
      keyword: /^template\W/g,
      properties: /(\w+)\s*=\s*(((?!\w+\s*=).)+)/gms,
    },
    standard: /(\w.*?)($|\s)/gm,
    dataObject: /(\w+)\s*:\s*([^,}]+)/g, // parses { one: 'two' }
  };

  /*
    Creates an AST representation of a template
    this can be cached on the web component class
  */
  compile(template = this.template) {
    template = template.trim();

    const scanner = new Scanner(template);

    // quicker to compile regexp once
    const tagRegExp = TemplateCompiler.tagRegExp;

    const parseTag = (scanner) => {
      for (let type in tagRegExp) {
        if (scanner.matches(tagRegExp[type])) {
          const context = scanner.getContext(); // Get context before consuming
          scanner.consume(tagRegExp[type]);
          const content = this.getValue(scanner.consumeUntil('}}').trim());
          scanner.consume('}}');
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

      const lastNode = last(stack);
      const conditionTarget = last(conditionStack);
      const contentTarget = contentBranch?.content || lastNode || ast;

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

          case 'EACH':
            const contentParts = tag.content.split(' in ');

            let iterateOver;
            let iterateAs;
            if (contentParts.length > 1) {
              iterateAs = contentParts[0].trim();
              iterateOver = contentParts[1].trim();
            } else {
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

            contentTarget.push(newNode);
            contentBranch = newNode;
            break;

          case 'CLOSE_EACH':
            stack.pop();
            contentBranch = last(contentStack); // Reset current branch
            break;
        }
      } else {
        const OPEN_TAG = /\{\{/;
        const html = scanner.consumeUntil(OPEN_TAG);
        if (html) {
          const htmlNode = { type: 'html', html };
          contentTarget.push(htmlNode);
        }
      }
    }

    return ast;
  }

  getValue(expression) {
    if (expression == 'true') {
      return true;
    } else if (expression == 'false') {
      return false;
    } else if (!Number.isNaN(parseFloat(expression, 10))) {
      return +expression;
    }
    return expression;
  }

  parseTemplateString(expression = '') {
    // quicker to compile regexp once
    const regExp = TemplateCompiler.templateRegExp;
    let templateInfo = {};
    if (regExp.verbose.keyword.exec(expression)) {
      // verbose notation {{> template name=templateName reactiveData={one: 'one', two: 'two'} }}
      const matches = [...expression.matchAll(regExp.verbose.properties)];
      each(matches, (match, index) => {
        const property = match[1];
        const value = this.getObjectFromString(match[2]);
        templateInfo[property] = value;
      });
    } else {
      // standard notation {{> templateName data1=value data2=value}}
      let data = {};
      const matches = [...expression.matchAll(regExp.standard)];
      each(matches, (match, index) => {
        if (index == 0) {
          templateInfo.name = `'${match[0].trim()}'`;
        } else {
          const parts = match[0].split('=');
          if (parts.length) {
            let name = parts[0].trim();
            let value = parts[1].trim();
            data[name] = value;
          }
        }
      });
      templateInfo.data = data;
    }
    return templateInfo;
  }

  getObjectFromString(objectString = '') {
    const regex = TemplateCompiler.templateRegExp.dataObject;
    const obj = {};
    let match;
    let isObject = false;
    while ((match = regex.exec(objectString)) !== null) {
      isObject = true;
      obj[match[1]] = match[2].trim();
    }
    // if this isnt an object we want to return the string value which may be an expression
    return isObject ? obj : objectString.trim();
  }
}

export { TemplateCompiler };
