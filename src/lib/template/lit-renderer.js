import { html } from 'lit';
import { keyed } from 'lit/directives/keyed.js';
import { get, each, last, wrapFunction, isFunction } from '../utils';
import { Reaction } from '../reactive';

class LitRenderer {

  constructor(ast, data) {
    this.ast = ast || '';
    this.data = data || {};
    this.resetHTML();
  }

  resetHTML() {
    this.html = [];
    this.html.raw = [];
    this.expressions = [];
  }

  /*
    Creates an AST representation of a template
    this can be cached on the web component class
  */
  render(ast = this.ast, data = this.data) {

    this.resetHTML();
    this.readAST(ast, data);
    return html.apply(this, [this.html, ...this.expressions]);
  }

  readAST(ast = this.ast, data = this.data) {
    each(ast, node => {
      switch (node.type) {

        case 'html':
          this.addHTML(node.html);
          break;

        case 'expression':
          this.addValue(this.getValue(node.value));
          break;

        case 'if':
          // determine if true
          if(this.getValue(node.condition) == true) {
            this.readAST(node.content);
          }
          else if(node.branches?.length) {
            // evalutate each branch
            let match = false;
            each(node.branches, (branch) => {
              if(!match && (branch.type == 'elseif' && this.getValue(branch.condition) == true) || branch.type == 'else') {
                match = true;
                this.readAST(branch.content);
              }
            });
          }
          break;

        case 'slot':
          if(name) {
            this.addHTML(`<slot name="${name}"></slot>`);
          }
          else {
            this.addHTML(`<slot></slot>`);
          }
          break;

        default:
          break;

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

  getValue(value) {
    if(typeof value === 'string') {
      let result;
      const data = this.data;
      Reaction.create(function(comp) {
        const dataValue = get(data, value);
        result = wrapFunction(dataValue)();
      });
      return result;
    }
    return value;
  }

  addHTML(html) {
    // we want to concat all html added consecutively
    if(this.lastHTML) {
      const lastHTML = this.html.pop();
      html = `${lastHTML}${html}`;
    }
    this.html.push(html);
    this.html.raw.push(String.raw({ raw: html }));
    this.lastHTML = true;
  }

  addValue(expression) {
    this.lastHTML = false;
    this.expressions.push(expression);
  }

}

export { LitRenderer };
