import { html } from 'lit';
import { when, } from 'lit/directives/when.js';
import { repeat } from 'lit/directives/repeat.js';
import { guard } from 'lit/directives/guard.js';

import { get, each, last } from '../utils';

class LitRenderer {

  constructor(ast, data) {
    this.ast = ast || '';
    this.data = data || {};
  }

  /*
    Creates an AST representation of a template
    this can be cached on the web component class
  */
  render(ast = this.ast, data = this.data) {
    each(ast, tree => {

      if(ast.type == 'html') { 

      }
      if(ast.type == 'if') { 

      }

    });

  }

  /*
  log`what do you ${'jack'} know ${cat} the end`
  ['what do you ', ' know ', ' the end', raw: Array(3)] 
  (2)['jack', 'boo']


  const strings = [ template ];
  strings.raw = [String.raw({ raw: template })];
  return html(strings, []);

  */

  renderHTML(html) {

  }


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

}

export { LitRenderer };
