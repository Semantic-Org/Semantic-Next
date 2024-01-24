import { html } from 'lit';
import { guard } from 'lit/directives/guard.js';

import { get, each, last, mapObject, wrapFunction, isFunction } from '@semantic-ui/utils';
import { Reaction } from '@semantic-ui/reactivity';
import { reactiveData } from './directives/reactive-data.js';
import { reactiveConditional } from './directives/reactive-conditional.js';

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
          this.addValue( this.evaluateExpression(node.value, data, { asDirective: true }) );
          break;

        case 'if':
          let result = this.evaluateConditional(node, data);
          console.log(result);
          this.addValue( result );
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

  /*
    The conditional directive takes an if condition and branches
    but does not have access to LitRenderer and evaluateExpression
    so we have to pass through functions that do this
  */
  evaluateConditional(node, data) {
    const mapCondition = (value, key) => {
      if(key == 'branches') {
        return value.map(branch => mapObject(branch, mapCondition));
      }
      if(key == 'condition') {
        return () => this.evaluateExpression(value, data, { asDirective: false });
      }
      if(key == 'content') {
        return () => new LitRenderer({ ast: value, data }).render();
      }
      return value;
    };
    let directiveArguments = mapObject(node, mapCondition);
    return reactiveConditional(directiveArguments);
  }

  evaluateExpression(expression, data = this.data, { asDirective = false} = {}) {
    // i.e foo.baz = { foo: { baz: 'value' } }
    if(typeof expression === 'string') {
      if(asDirective) {
        return reactiveData(() => this.lookupExpressionValue(expression, data));
      }
      else {
        return this.lookupExpressionValue(expression, data);
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
