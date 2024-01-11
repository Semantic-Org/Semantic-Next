import { html } from 'lit';

class TemplateCompiler {
  constructor(template, context) {
    this.template = template || '';
    this.context = context || {};
  }

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
  }


  transformInterpolations(htmlString) {
    // Implementation for transforming interpolations
    return htmlString.replace(/{{(.*?)}}/g, (_, expr) => {
      console.log(expr);
      const expressionValue = this.accessContextProperty(expr.trim());
      return expressionValue; // Return the actual value of the expression
    });
  }

  evaluateCondition(condition) {
    // Implement logic to evaluate condition based on context
  }

  accessContextProperty(expression) {
    // Implement logic to access property from context based on expression
  }

  // Additional methods (like generateLitTemplate) can be implemented as needed
}

export { TemplateCompiler };
