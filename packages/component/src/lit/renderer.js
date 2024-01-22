import { html } from 'lit';
import { guard } from 'lit/directives/guard.js';

import { get, each, last, wrapFunction, isFunction } from '@semantic-ui/utils';
import { Reaction } from '@semantic-ui/reactivity';

export class LitRenderer {

  constructor({ast, data, litElement}) {
    this.ast = ast || '';
    this.data = data || {};
    this.litElement = litElement;
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
    this.clearTemp();
    this.litTemplate = html.apply(this, [this.html, ...this.expressions]);
    return this.litTemplate;
  }

  readAST(ast = this.ast, data = this.data) {
    each(ast, node => {
      switch (node.type) {

        case 'html':
          this.addHTML(node.html);
          break;

        case 'expression':
          const value = this.getValue(node.value, this.litElement);
          this.addValue(value);
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
          if(node.name) {
            this.addHTML(`<slot name="${node.name}"></slot>`);
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

  getValue(value, litElement) {
    // lookup this value in data context
    // i.e foo.baz = { foo: { baz: 'value' } }
    if(typeof value === 'string') {
      let result;
      const data = this.data;
      Reaction.create((comp) => {
        const dataValue = get(data, value);
        result = wrapFunction(dataValue)();
        if(!comp.firstRun) {
          this.rerender();
        }
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

  clearTemp() {
    delete this.lastHTML;
  }

  rerender() {
    this.litElement.requestUpdate();
  }

}
