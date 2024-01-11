import { html } from 'lit';
import { Scanner } from './scanner';
import { get } from '../utils';

class TemplateCompiler {

  constructor(template, context) {
    this.template = template || '';
    this.context = context || {};
  }

  compile(template = this.template) {

    template = template.trim();

    const scanner = new Scanner(template);

    const parseTag = function(scanner) {
      const starts = {
        IF: /^{{\s*#if\s+/,
        ELSEIF: /^{{\s*elseif\s+/,
        ELSE: /^{{\s*else\s*/,
        EACH: /^{{\s*#each\s+/,
        CLOSE_IF: /^{{\s*\/(if)\s*/,
        CLOSE_EACH: /^{{\s*\/(each)\s*/,
        EXPRESSION: /^{{\s*/
      };
      for (let type in starts) {
        if (scanner.matches(starts[type])) {
          const consumed = scanner.consume(starts[type]);
          const content = scanner.consumeUntil('}}').trim();
          scanner.consume('}}');
          //console.log('content', content);
          return { type, content };
        }
      }
      // Return null if no tag is matched
      return null;
    };

    const ast = [];
    const stack = [];

    let contentBranch = null; // Track the current node to add content
    let conditionBranch = null; // Track the current node to add conditions

    while (!scanner.isEOF()) {
      const tag = parseTag(scanner);

      const lastNode = stack[stack.length - 1];
      const conditionTarget = conditionBranch;
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
            contentBranch = newNode;
            conditionBranch = newNode;
            break;

          case 'ELSEIF':
            newNode = {
              ...newNode,
              condition: tag.content,
              content: [],
            };
            if(!conditionTarget) {
              scanner.fatal('No open if tag when elseif found');
              break;
            }
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

          case 'CLOSE_IF':
            stack.pop();
            conditionBranch = null; // Reset current branch
            contentBranch = null; // Reset current branch
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
              iterateOver,
              iterateAs,
              content: [],
            };
            if (stack.length > 0) {
              target.push(newNode);
            } else {
              ast.push(newNode);
            }
            stack.push(newNode);
            contentBranch = null; // Reset current branch as we're in a new 'if' context
            break;

          case 'CLOSE_EACH':
            stack.pop();
            contentBranch = null; // Reset current branch
            conditionBranch = null; // Reset open
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
  }/*
  compile() {
    const ast = [];
    const parts = this.template.split(/({{#if.*?}}|{{elseif.*?}}|{{else}}|{{\/if}})/).filter(Boolean);
    const stack = []; // Stack to manage nested 'if' contexts
    let currentBranch = null; // Track the current active branch within an 'if'

    parts.forEach(part => {
      if (part.startsWith('{{#if')) {
        const condition = part.match(/{{#if (.*?)}}/)[1];
        const newCondition = { type: 'if', condition, branches: [], content: [] };
        if (stack.length > 0) {
          (currentBranch ? currentBranch.content : stack[stack.length - 1].content).push(newCondition);
        } else {
          ast.push(newCondition);
        }
        stack.push(newCondition);
        currentBranch = null; // Reset current branch as we're in a new 'if' context
      }
      else if (part.startsWith('{{elseif')) {
        const condition = part.match(/{{elseif (.*?)}}/)[1];
        const newBranch = { type: 'elseif', condition, content: [] };
        stack[stack.length - 1].branches.push(newBranch);
        currentBranch = newBranch; // Update current active branch
      }
      if (part === '{{else}}') {
        const newBranch = { type: 'else', content: [] };
        stack[stack.length - 1].branches.push(newBranch);
        currentBranch = newBranch; // Update current active branch
      }
      else if (part === '{{/if}}') {
        if (stack.length > 0) {
          stack.pop(); // Exit the current 'if' context
          currentBranch = null; // Reset current branch as the 'if' block is closed
        } else {
          console.error('Mismatched closing tag for if condition');
        }
      }
      else {
        const trimmedPart = part.trim();
        if (trimmedPart) {
          const node = { type: 'html', string: this.transformInterpolations(trimmedPart) };
          if (stack.length > 0) {
            const target = currentBranch ? currentBranch : stack[stack.length - 1];
            target.content.push(node);
          } else {
            ast.push(node);
          }
        }
      }
    });

    return ast;
  }*/


  transformInterpolations(htmlString) {
    return htmlString;
    // Implementation for transforming interpolations
    return htmlString.replace(/{{(.*?)}}/g, (_, expr) => {
      const expressionValue = this.accessContextProperty(expr.trim());
      return expressionValue; // Return the actual value of the expression
    });
  }

  evaluateCondition(condition) {
    // Implement logic to evaluate condition based on context
  }

  accessContextProperty(expression) {
    // Implement logic to access property from context based on expression
    return get(this.context, expression);
  }

  // Additional methods (like generateLitTemplate) can be implemented as needed
}

export { TemplateCompiler };
