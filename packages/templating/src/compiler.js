import { get, last } from '@semantic-ui/utils';

import { Scanner } from './scanner';

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
    const parseTag = (scanner) => {
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
}

export { TemplateCompiler };
