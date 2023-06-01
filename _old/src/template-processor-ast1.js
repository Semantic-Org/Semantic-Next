import { ReactiveVar, CreateReaction } from './reactive.js';
import { _ } from './utils.js'

class TemplateProcessor {

  constructor() {
    this.tagRegex = /{{|#|\/|if|else|each|in|[\w\d@]+|\(|\)|\s+|,|\.|}}/g;
  }

  compile(templateString, context) {
    const tokens = templateProcessor.tokenize(this.templateString);
    const ast = templateProcessor.parse(tokens);
    const compiled = templateProcessor.parseAST(ast, context);
    return compiled;
  }

  tokenize(input) {
    const tokens = [];
    let cursor = 0;

    while (cursor < input.length) {
      // Handle '{{' and '}}'
      if (input[cursor] === '{' && input[cursor + 1] === '{') {
        tokens.push('{{');
        cursor += 2;
      } else if (input[cursor] === '}' && input[cursor + 1] === '}') {
        tokens.push('}}');
        cursor += 2;
      } else {
        // Handle text
        let text = input[cursor];
        cursor++;

        while (
          cursor < input.length &&
          !(
            (input[cursor] === '{' && input[cursor + 1] === '{') ||
            (input[cursor] === '}' && input[cursor + 1] === '}')
          )
        ) {
          text += input[cursor];
          cursor++;
        }

        // Split the text by whitespace and non-word characters
        const textTokens = text.split(/(\s+|\W)/).filter(t => t.length > 0);

        tokens.push(...textTokens);
      }
    }

    return tokens;
  }

  parse(tokens) {
    const stack = [{ type: 'root', children: [] }];

    while (tokens.length > 0) {
      const token = tokens.shift();

      if (token === '{{') {
        const tagContent = tokens.shift();
        const tagParts = tagContent.split(/\s+/);

        if (tagParts[0] === '#' || tagParts[0] === '/') {
          const tagName = tagParts[1];
          if (tagName === 'if') {
            const node = { type: 'if', children: [], condition: tagParts.slice(2).join(' ') };
            stack[0].children.push(node);
            stack.unshift(node);
          } else if (tagName === 'else') {
            const ifNode = stack.find(node => node.type === 'if');
            if (!ifNode) {
              throw new Error("Unexpected 'else' tag without preceding 'if' tag");
            }
            if (!ifNode.processingElse) {
              ifNode.processingElse = true;
              if (stack.length > 1) {
                stack.shift(); // Remove the 'if' node from the stack
              }
            }
            const elseNode = { type: 'else', children: [] };
            ifNode.elseChildren = elseNode.children;
            stack.unshift(elseNode);
          } else {
            if (stack.length > 1) {
              stack.shift();
            }
          }
        } else {
          const node = { type: 'variable', name: tagParts[0] };
          stack[0].children.push(node);
        }

        tokens.shift(); // Discard closing '}}'
      } else if (token === '}}') {
        // Just skip this token since it's a closing brace for if/else branches
      } else {
        const node = { type: 'text', content: token };

        // Only push the text node if it's not a part of the if/else structure
        if (stack[0].type !== 'if' && stack[0].type !== 'else') {
          stack[0].children.push(node);
        }
      }
    }
    return stack[0];
  }


  parseAST(ast, context) {
    console.log('Context:', context);
    switch (ast.type) {
      case 'root':
        return ast.children.map(child => this.compile(child, context)).join('');
      case 'text':
        return ast.content;
      case 'variable':
        const variableValue = context[ast.name];
        const uid = _.hashCode(`variable:${ast.name}`);
        const span = document.createElement('span');
        span.setAttribute('data-uid', uid);

        if (typeof variableValue === 'function') {
          const value = variableValue.call(context);
          span.textContent = value;
        } else {
          span.textContent = variableValue;
        }

        return span.outerHTML;
      case 'if':
        const conditionValue = this.getValueFromCondition(ast.condition, context);
        console.log('Condition value:', conditionValue);
        if (conditionValue) {
          return ast.children.map(child => this.compile(child, context)).join('');
        } else if (ast.elseChildren) {
          return ast.elseChildren.map(child => this.compile(child, context)).join('');
        }
        return '';
      default:
        throw new Error(`Unknown AST node type: ${ast.type}`);
    }
  }

  getValueFromCondition(condition, dataContext) {
    const parts = condition.split('.');
    let value = dataContext;

    for (const part of parts) {
      value = value[part];

      if (value === undefined) {
        break;
      }
    }

    return value;
  }

  process(templateString, dataContext = {}) {
    const tokens = this.tokenize(templateString);
    const ast = this.parse(tokens);
    const result = this.compile(ast, dataContext);
    return result;
  }

  processBindings(rootNode, componentInstance) {
    const exprRegex = /{{\s*([a-zA-Z_$][0-9a-zA-Z_$]*)\s*}}/g;
    const expressions = Array.from(componentInstance.templateString.matchAll(exprRegex));

    for (const expr of expressions) {
      const expression = expr[1];
      const reactiveVar = new ReactiveVar(componentInstance[expression]);
      const uid = _.hashCode(`variable:${expression}`);
      const span = rootNode.querySelector(`[data-uid="${uid}"]`);
      if (span) {
        CreateReaction(() => {
          const value = componentInstance[expression]();
          reactiveVar.set(value);
          span.textContent = reactiveVar.get();
        });
      }
    }
  }
}

export { TemplateProcessor };

