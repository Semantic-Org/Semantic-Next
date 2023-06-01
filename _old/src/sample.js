class TemplateParser {
  constructor(template) {
    this.template = template;
  }

  parse() {
    const markedTemplate = this.applyMarkers(this.template);
    const parser = new DOMParser();
    const document = parser.parseFromString(`<root>${markedTemplate}</root>`, 'application/xml');
    const ast = [];
    this.walk(document.documentElement, ast);
    return { ast };
  }

  walk(node, ast) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent.trim();
      if (text) {
        ast.push({
          type: 'Text',
          value: text,
        });
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const element = {
        type: 'Element',
        tag: node.tagName.toLowerCase(),
        attributes: {},
        children: [],
      };

      for (const attr of node.attributes) {
        element.attributes[attr.name] = attr.value;
      }

      ast.push(element);
      for (const child of Array.from(node.childNodes)) {
        this.walk(child, element.children);
      }
    } else if (node.nodeType === Node.COMMENT_NODE) {
      const [type, value] = node.textContent.split(':');
      if (type === 'marker') {
        const astNode = {
          type: value,
          children: [],
        };
        if (value === 'IfStatement' || value === 'OutputExpression') {
          astNode.value = node.textContent.split(':')[2];
        }

        const parentNode = ast[ast.length - 1];
        if (parentNode && (parentNode.type === 'IfStatement' || parentNode.type === 'ElseStatement')) {
          parentNode.children.push(astNode);
        } else {
          ast.push(astNode);
        }

        if (value === 'IfStatement' || value === 'ElseStatement') {
          const nextNode = node.nextSibling;
          node.parentNode.removeChild(node);
          for (const child of Array.from(nextNode.childNodes)) {
            this.walk(child, astNode.children);
          }
          nextNode.remove();
          const endIfNode = nextNode.nextSibling;
          if (endIfNode && endIfNode.nodeType === Node.COMMENT_NODE && endIfNode.textContent === 'marker:EndIfStatement') {
            endIfNode.parentNode.removeChild(endIfNode);
          }
        } else {
          node.parentNode.removeChild(node);
        }
      }
    }
  }

  applyMarkers(template) {
    const ifRegex = /{{#if ([^}]+)}}/g;
    const elseRegex = /{{else}}/g;
    const endIfRegex = /{{\/if}}/g;
    const outputRegex = /{{([^}]+)}}/g;

    let result = template;

    result = result.replace(ifRegex, (_, condition) => `<!--marker:IfStatement:${condition.trim()}-->`);
    result = result.replace(elseRegex, '<!--marker:ElseStatement-->');
    result = result.replace(endIfRegex, '<!--marker:EndIfStatement-->');
    result = result.replace(outputRegex, (_, value) => `<!--marker:OutputExpression:${value.trim()}-->`);

    return result;
  }
}

const input = `<div class="counter">
  <button id="decrement">-</button>
  {{#if isZero}}
    <span>Your current value is zero</span>
  {{else}}
    <span>Your current value is {{getCounter}}</span>
  {{/if}}
  <button id="increment">+</button>
</div>`;

const parser = new TemplateParser(input);
const output = parser.parse();
console.log(output);
