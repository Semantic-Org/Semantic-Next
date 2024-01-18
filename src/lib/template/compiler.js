import { Scanner } from './scanner';
import { get, last } from '../utils';

class TemplateCompiler {

  constructor(template) {
    this.template = template || '';
  }

  /*
    Creates an AST representation of a template
    this can be cached on the web component class
  */
  compile(template = this.template) {

    template = template.trim();

    const scanner = new Scanner(template);

    const parseTag = (scanner) => {
      const starts = {
        IF: /^{{\s*#if\s+/,
        ELSEIF: /^{{\s*else\s*if\s+/,
        ELSE: /^{{\s*else\s*/,
        EACH: /^{{\s*#each\s+/,
        CLOSE_IF: /^{{\s*\/(if)\s*/,
        CLOSE_EACH: /^{{\s*\/(each)\s*/,
        SLOT: /^{{\s*slot\s*/,
        EXPRESSION: /^{{\s*/,
      };
      for (let type in starts) {
        if (scanner.matches(starts[type])) {
          const consumed = scanner.consume(starts[type]);
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
            contentBranch = newNode;
            break;

          case 'ELSEIF':
            newNode = {
              ...newNode,
              condition: tag.content,
              content: [],
            };
            conditionTarget.branches.push(newNode);
            contentBranch = newNode;
            break;

          case 'ELSE':
            newNode = {
              ...newNode,
              content: [],
            };
            if(!conditionTarget) {
              scanner.fatal('No open if tag when else found');
              break;
            }
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

          case 'SLOT':
            newNode = {
              ...newNode,
              name: tag.content
            };
            contentTarget.push(newNode);
            break;

          case 'CLOSE_IF':
            stack.pop();
            conditionStack.pop();
            contentBranch = last(conditionStack); // Reset current branch
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
              iterateOver = contentParts[1].trim();
            }
            newNode = {
              ...newNode,
              as: iterateOver,
              over: iterateAs,
              content: [],
            };
            contentTarget.push(newNode);
            contentBranch = newNode;
            break;

          case 'CLOSE_EACH':
            stack.pop();
            contentBranch = null; // Reset current branch
            conditionStack.pop();
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
    else if(!Number.isNaN( parseInt(expression, 10) )) {
      return +(expression);
    }
    return expression;
  }
}

export { TemplateCompiler };
