class TemplateProcessor {
  constructor(template) {
    this.template = template;
  }

  parse() {
    const parser = new DOMParser();
    const document = parser.parseFromString(this.template, 'text/html');
    const ast = this.walk(document.body);
    return { ast };
  }

  walk(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const ifRegex = /{{#if ([^}]+)}}/g;
      const elseRegex = /{{else}}/g;
      const endIfRegex = /{{\/if}}/g;
      const outputRegex = /{{([^}]+)}}/g;

      let text = node.textContent;
      let ifMatch, elseMatch, endIfMatch, outputMatch;

      while ((ifMatch = ifRegex.exec(text)) !== null) {
        text = text.replace(ifMatch[0], '');
        node.parentNode.insertBefore(
          this.createMarkerNode('IfStatement', ifMatch[1].trim()),
          node
        );
      }

      while ((elseMatch = elseRegex.exec(text)) !== null) {
        text = text.replace(elseMatch[0], '');
        node.parentNode.insertBefore(this.createMarkerNode('ElseStatement'), node);
      }

      while ((endIfMatch = endIfRegex.exec(text)) !== null) {
        text = text.replace(endIfMatch[0], '');
        node.parentNode.insertBefore(this.createMarkerNode('EndIfStatement'), node);
      }

      while ((outputMatch = outputRegex.exec(text)) !== null) {
        text = text.replace(outputMatch[0], '');
        node.parentNode.insertBefore(
          this.createMarkerNode('OutputExpression', outputMatch[1].trim()),
          node
        );
      }

      return {
        type: 'Text',
        value: text
      };
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = {
        type: 'Element',
        tag: node.tagName.toLowerCase(),
        attributes: {},
        children: []
      };

      for (const attr of node.attributes) {
        element.attributes[attr.name] = attr.value;
      }

      for (const child of node.childNodes) {
        const childAst = this.walk(child);
        if (childAst) {
          element.children.push(childAst);
        }
      }

      return element;
    }

    if (node.nodeType === Node.COMMENT_NODE && node.textContent.startsWith('marker:')) {
      const [_, type, value] = node.textContent.split(':');
      return {
        type,
        value: value || undefined
      };
    }

    return null;
  }

  createMarkerNode(type, value) {
    return document.createComment(`marker:\${type}:\${value || ''}`);
  }
}

export { TemplateProcessor }
