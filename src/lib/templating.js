import { html, render } from 'lit-html';

class TemplateCompiler {
  constructor(template, context) {
    this.template = template || '';
    this.context = context || {};
  }

  compile() {
    const ast = [];
    const parts = this.template.split(/({{#if.*?}}|{{elseif.*?}}|{{else}}|{{\/if}})/).filter(Boolean);

    let currentCondition = null;
    let currentBranch = null;
    for (const part of parts) {
      if (part.startsWith('{{#if')) {
        currentCondition = {
          type: 'if',
          branches: [{
            condition: part.match(/{{#if (.*?)}}/)[1],
            content: []
          }]
        };
        currentBranch = currentCondition.branches[0];
        ast.push(currentCondition);
      }
      else if (part.startsWith('{{elseif')) {
        currentBranch = {
          condition: part.match(/{{elseif (.*?)}}/)[1],
          content: []
        };
        currentCondition.branches.push(currentBranch);
      }
      else if (part === '{{else}}') {
        currentBranch = { condition: null, content: [] }; // Else branch
        currentCondition.branches.push(currentBranch);
      }
      else if (part === '{{/if}}') {
        currentCondition = null;
      }
      else {
        const node = {
          type: 'html',
          string: this.transformInterpolations(part)
        };
        if (currentBranch) {
          currentBranch.content.push(node);
        }
        else {
          ast.push(node);
        }
      }
    }
    return ast;
  }

  render(element) {
    const ast = this.compile();
    const result = this.generateLitTemplate(ast);
    console.log('res', result);
    render(element, result);
  }

  transformInterpolations(htmlString) {
    return htmlString.replace(/{{(.*?)}}/g, (_, expr) => `\${this.context.${expr.trim()}}`);
  }

  generateLitTemplate(ast) {
    // Process each node and filter out empty strings
    const templateParts = ast.flatMap(node => {
      if (node.type === 'if') {
        return this.processConditionalNode(node);
      } else if (node.type === 'html') {
        return this.processHtmlNode(node.string);
      }
      return '';
    }).filter(part => part);

    // Combine the parts into a single Lit template
    console.log(templateParts);
    return html`${templateParts}`;
  }

  processConditionalNode(node) {
    for (const branch of node.branches) {
      if (branch.condition === null || this.evaluateCondition(branch.condition)) {
        return this.generateLitTemplate(branch.content);
      }
    }
    return null; // No condition met
  }

  processHtmlNode(htmlString) {
    // Process and replace interpolations
    const processedString = htmlString.replace(/{{(.*?)}}/g, (_, expr) => {
      const expressionValue = this.accessContextProperty(expr.trim());
      return expressionValue; // Return the actual value of the expression
    });

    // Use Lit's html function for the processed HTML string
    return html([processedString]);
  }

  evaluateCondition(condition) {
    try {
      // Directly access the properties of the context
      const result = this.accessContextProperty(condition);
      return Boolean(result);
    } catch (error) {
      return false;
    }
  }

  accessContextProperty(expression) {
    return expression.split('.').reduce((context, prop) => {
      return context[prop];
    }, this.context);
  }
}

export { TemplateCompiler };
