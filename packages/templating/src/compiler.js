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
    EXPRESSION: /^{{\s*/,
  };

  static templateRegExp = {
    verbose: {
      keyword: /^template\W/,
      name: /name\s*=\s*\'(.*)\'\W/,
      data: /data\s*=\s*((?:.|\n)*?)(?=\s*\w+\s*=)/m, // positive lookahead on next equals
    },
    standard: /(\w.*?)($|\s)/gm,
    dataObject: /(\w+)\s*:\s*['"]([^'"]+)['"]/g // parses { one: 'two' }
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
          scanner.consume(tagRegExp[type]);
          const content = this.getValue(scanner.consumeUntil('}}').trim());
          scanner.consume('}}');
          return { type, content };
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
          type: tag.type.toLowerCase()
        };

        switch (tag.type) {

          case 'IF':
            newNode = {
              ...newNode,
              condition: tag.content,
              content: [],
              branches: []
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
            if(!conditionTarget) {
              scanner.returnTo(starts.ELSEIF);
              scanner.fatal('{{elseif}} encountered without matching if condition');
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
            if(!conditionTarget) {
              scanner.returnTo(starts.ELSE);
              scanner.fatal('{{else}} encountered without matching if condition');
              break;
            }
            contentStack.pop();
            contentStack.push(newNode);
            conditionTarget.branches.push(newNode);
            contentBranch = newNode;
            break;

          case 'EXPRESSION':
            newNode = {
              ...newNode,
              value: tag.content
            };
            contentTarget.push(newNode);
            break;

          case 'TEMPLATE':
            const templateInfo = this.parseTemplateString(tag.content);
            newNode = {
              ...newNode,
              ...templateInfo
            };
            contentTarget.push(newNode);
            break;

          case 'SLOT':
            newNode = {
              ...newNode,
              name: tag.content
            };
            contentTarget.push(newNode);
            break;

          case 'CLOSE_IF':
            if(conditionStack.length == 0) {
              scanner.returnTo(starts.CLOSE_IF);
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
            if(contentParts.length > 1) {
              iterateAs = contentParts[0].trim();
              iterateOver = contentParts[1].trim();
            }
            else {
              iterateOver = contentParts[0].trim();
            }
            newNode = {
              ...newNode,
              as: iterateAs,
              over: iterateOver,
              content: [],
            };
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
    if(expression == 'true') {
      return true;
    }
    else if(expression == 'false') {
      return false;
    }
    else if(!Number.isNaN( parseFloat(expression, 10) )) {
      return +(expression);
    }
    return expression;
  }

  parseTemplateString(expression = '') {
    // quicker to compile regexp once
    const regExp = TemplateCompiler.templateRegExp;
    let templateInfo = {};
    if(regExp.verbose.keyword.exec(expression)) {
      // shorthand notation {{> template= data1=value data2=value}}
      templateInfo.templateName = expression.match(regExp.verbose.name)?.[1];
      let dataString = expression.match(regExp.verbose.data)?.[1];
      templateInfo.data = this.getObjectFromString(dataString);
    }
    else {
      // standard notation {{> templateName data1=value data2=value}}
      let data = {};
      const matches = [ ...expression.matchAll(regExp.standard) ];
      each(matches, (match, index) => {
        if(index == 0) {
          templateInfo.templateName = match[0];
        }
        else {
          const parts = match[0].split('=');
          if(parts.length) {
            let name = parts[0].trim();
            let value = parts[1].trim();
            data[name] = value;
          }
        }
      });
      templateInfo.data = data;
    }
    console.log(templateInfo);
    return templateInfo;
  }

  getObjectFromString(objectString) {
    const regex = TemplateCompiler.templateRegExp.dataObject;
    const obj = {};
    let match;
    while ((match = regex.exec(objectString)) !== null) {
      obj[match[1]] = match[2];
    }
    return obj;
  }

  parseTemplateDataString(data) {

  }

}

export { TemplateCompiler };
