import { ReactiveVar, CreateReaction } from './reactive.js';
import { _ } from './utils.js'

class TemplateProcessor {

  constructor(templateString, dataContext) {
    this.templateString = templateString;
    this.dataContext = dataContext;
    this.tokens = this.tokenize(templateString);

    const ast  = this.parse(this.tokens);
    this.ast = ast;
  }

  tokenize(templateString) {
    const regex = /({{\/?#?(if|else|each|\/)?\s*[\w.]*\s*}}|<\w+(?:\s+\w+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[\w-.]+))?)*\s*\/?>|<\/\w+>)|([^<{]+)/g;
    return templateString.match(regex);
  }

  parse(tokens = this.tokens, startIndex = 0, stopToken = null, depth = 0) {
    const ast = [];
    let current = startIndex;

    if (depth > 50) {
      console.warn('Maximum depth exceeded, possible infinite recursion');
      return [current, []];
    }

    while (current < tokens.length) {
      const token = tokens[current];

      if (token === stopToken) {
        break;
      }

      if (token.startsWith('<')) {
        const [newIndex, node] = this.parseElement(tokens, current, depth + 1);
        ast.push(node);
        current = newIndex;
      } else if (token.startsWith('{{')) {
        const isStart = token.startsWith('{{#');
        const isEnd = token.startsWith('{{/');

        if (isStart) {
          const ifStartRegex = /{{#(if)\s+(.*?)}}/i;
          const parts = token.match(ifStartRegex);
          const type = parts[1];
          const value = parts[2];

          if (type === 'if') {
            const node = {
              type: 'IfStatement',
              condition: value,
              consequent: [],
              alternate: [],
            };

            const [newIndex, children] = this.parse(tokens, current + 1, '{{/if}}', depth + 1);
            node.consequent = children;
            current = newIndex;

            if (tokens[current] === '{{else}}') {
              const [newIndex2, children2] = this.parse(tokens, current + 1, '{{/if}}', depth + 1);
              node.alternate = children2;
              current = newIndex2;
            } else {
              current++;
            }
            ast.push(node);
          }
        } else if (isEnd) {
          current++;
        } else {
          const expressionRegex = /{{\s*(\w*)\s*}}/;
          const parts = token.match(expressionRegex);
          ast.push({
            type: 'OutputExpression',
            value: parts[1],
          });
          current++;
        }
      } else if (token.trim() !== '') {
        ast.push({
          type: 'Text',
          value: token,
        });
        current++;
      } else {
        current++;
      }
    }
    return [current, ast];
  }

  parseElement(tokens, index, depth) {
    const startTag = tokens[index];
    const tagName = startTag.match(/<\/*(\w+)/)[1];
    const attributes = TemplateProcessor.parseAttributes(startTag);
    const children = [];
    let newIndex = index + 1;
    let token = tokens[newIndex];

    while (token !== `</${tagName}>`) {
      if (!token) {
        break;
      }

      if (token.startsWith('<')) {
        const [childNode, childIndex] = this.parseElement(tokens, newIndex, depth + 1);
        children.push(childNode);
        newIndex = childIndex;
      } else if (token.startsWith('{{') && !token.startsWith('{{/')) {
        const [childIndex, childNodes] = this.parse(tokens, newIndex, null, depth + 1);
        children.push(...childNodes);
        newIndex = childIndex;
      } else if (token.trim() !== '') {
        children.push({
          type: 'Text',
          value: token,
        });
        newIndex++;
      } else {
        newIndex++;
      }

      token = tokens[newIndex];
    }

    newIndex++;

    return [
      {
        type: 'Element',
        tag: tagName,
        attributes,
        children,
      },
      newIndex,
    ];
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
