import { html } from 'lit';
import { guard } from 'lit/directives/guard.js';

import { get, each, last, wrapFunction, isFunction } from '@semantic-ui/utils';
import { Reaction } from '@semantic-ui/reactivity';
import { reactiveDirective } from './reactive-directive';

export class LitRenderer {

  constructor({
    ast,
    data,
    litElement
  }) {
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
  render({
    ast = this.ast,
    data = this.data
  } = {}) {
    this.resetHTML();
    this.readAST({ast, data});
    this.clearTemp();
    this.litTemplate = html.apply(this, [this.html, ...this.expressions]);
    return this.litTemplate;
  }

  readAST({
    ast = this.ast,
    data = this.data
  } = {}) {
    each(ast, node => {
      switch (node.type) {

        case 'html':
          this.addHTML(node.html);
          break;

        case 'expression':
          const value = this.evaluateExpression(node.value, data, { asDirective: true });
          this.addValue(value);
          break;

        case 'if':
          // determine if true
          if(this.evaluateExpression(node.condition, data, { asDirective: false }) == true) {
            this.readAST({ ast: node.content, data });
          }
          else if(node.branches?.length) {
            // evalutate each branch
            let match = false;
            each(node.branches, (branch) => {
              if(!match && (branch.type == 'elseif' && this.getValue(branch.condition, data, { asDirective: false }) == true) || branch.type == 'else') {
                match = true;
                this.readAST({ ast: branch.content, data });
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

  evaluateExpression(expression, data = this.data, { asDirective = false} = {}) {
    // i.e foo.baz = { foo: { baz: 'value' } }
    if(typeof expression === 'string') {
      if(asDirective) {
        return reactiveDirective(() => this.lookupExpressionValue(expression, data));
      }
      else {
        // we can only use directives for reactivity passed down to Lit
        // for reactivity inside this renderer we need to create a novel computation
        // for example for branching conditions like if/else which parse diff parts of AST
        // depending on reactive computation
        let result;
        Reaction.create((comp) => {
          result = this.lookupExpressionValue(expression, data);
          if(!comp.firstRun) {
            this.rerender();
          }
        });
        return result;
      }
    }
    return expression;
  }

  // this evaluates an expression from right determining if something is an argument or a function
  // then looking up the value
  // i.e. {{format sayWord 'balloon' 'dog'}} => format(sayWord('balloon', 'dog'))
  lookupExpressionValue(expressionString = '', data = {}) {

    const expressions = expressionString.split(' ').reverse();
    const stringRegExp = /\'(.*)\'/;

    let funcArguments = [];
    let result;

    each(expressions, (expression, index) => {
      // the 'this' context' is the path up to expression
      // i.e. 'deep.path.reactive.get()' -> 'deep.path.reactive'
      const getContext = () => {
        const path = expression.split('.').slice(0, index - 1).join('.');
        const context = get(data, path);
        return context;
      };
      const dataValue = get(data, expression);
      let stringMatches;
      let parsedNumber;
      if(isFunction(dataValue)) {
        // Binding the function to a dynamic context and invoking it with accumulated arguments RTL
        const boundFunc = dataValue.bind( getContext() );
        result = boundFunc(...funcArguments);
        // Reset arguments after function execution
        funcArguments = [];
      }
      else if(dataValue) {
        result = dataValue;
      }
      else if((stringMatches = stringRegExp.exec(expression)) !== null && stringMatches.length > 1) {
        result = stringMatches[1];
      }
      else if(parsedNumber = parseFloat(expression) && !Number.isNaN(parsedNumber)) {
        // Numbers should be passed as their numerical values to functions
        result = parsedNumber;
      }
      else if(expression == 'true') {
        result = true;
      }
      else if(expression == 'false') {
        result = false;
      }
      else {
        result = undefined;
      }

      // Prepending current result for the next function invocation
      funcArguments.unshift(result);
    });
    return result;
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
    delete this.lastHTML; // used to concat concurrent html
  }

  rerender() {
    this.litElement.requestUpdate();
  }

}
