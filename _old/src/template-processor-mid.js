import { ReactiveVar, CreateReaction } from './reactive.js';
import { _ } from './utils.js'

class TemplateProcessor {

  constructor(templateString, dataContext) {
    this.templateString = templateString;
    this.dataContext = dataContext;
    this.tokens = this.tokenize(templateString);
    console.log(this.tokens);
    this.ast = this.parse(this.tokens);
  }

  tokenize(templateString) {
    const regex = /({{\/?#?(if|else|each|\/)?\s*[\w.]*\s*}}|<\w+[^]*?(?:\/\s*)?>|<\/\w+>)/g;
    return templateString.match(regex);
  }

  parse(tokens, startIndex = 0, stopToken = null) {
    const ast = [];
    let current = startIndex;

    while (current < tokens.length) {
      const token = tokens[current];

      if (token === stopToken) {
        break;
      }

      if (token.startsWith('{{')) {
        const isEnd = token.startsWith('{{/');
        const isStart = token.startsWith('{{#');

        if (isEnd) {
          current++;
          break;
        } else if (isStart) {
          const parts = token.match(/{{#(\w+)\s*([\w.]+)?}}/);
          const type = parts[1];
          const value = parts[2];

          if (type === 'if') {
            const node = {
              type: 'IfStatement',
              condition: value,
              consequent: [],
              alternate: [],
            };

            current++;
            node.consequent = this.parse(tokens, current, '{{else}}');

            if (tokens[current] && tokens[current].startsWith('{{else}}')) {
              current++;
              node.alternate = this.parse(tokens, current, '{{/if}}');
            }

            ast.push(node);
            current--;
          }
        } else {
          ast.push({
            type: 'OutputExpression',
            value: token.slice(2, -2).trim(),
          });
        }
      } else if (token.startsWith('<') && !token.startsWith('</')) {
        const node = {
          type: 'Element',
          tag: token.match(/<(\w+)/)[1],
          attributes: TemplateProcessor.parseAttributes(token),
          children: [],
        };

        const isSelfClosing = /\/\s*>$/.test(token);
        if (!isSelfClosing) {
          current++;
          node.children = this.parse(tokens, current, `</${node.tag}>`);
        }

        ast.push(node);
      }

      current++;
    }

    return ast;
  }

  evaluate(expression) {
    const properties = expression.split('.');
    let value = this.dataContext;

    properties.forEach((property) => {
      value = typeof value[property] === 'function' ? value[property]() : value[property];
    });

    return value;
  }

  compile(ast = this.ast) {
    let html = '';

    for (const node of ast) {
      if (node.type === 'Element') {
        html += `<${node.tag}>${this.compile(node.children)}</${node.tag}>`;
      } else if (node.type === 'Text') {
        html += node.value;
      } else if (node.type === 'OutputExpression') {
        html += this.evaluate(node.value);
      } else if (node.type === 'IfStatement') {
        if (this.evaluate(node.condition)) {
          html += this.compile(node.consequent);
        } else {
          html += this.compile(node.alternate);
        }
      } else if (node.type === 'EachStatement') {
        const items = this.evaluate(node.iterator);

        for (const item of items) {
          html += this.compile(node.body);
        }
      }
    }

    return html;
  }

  static parseAttributes(tag) {
    const regex = /(\w+)(?:\s*=\s*"([^"]*)")?/g;
    const attributes = {};
    let match;

    while ((match = regex.exec(tag)) !== null) {
      attributes[match[1]] = match[2] || true;
    }

    return attributes;
  }
}

export { TemplateProcessor };
