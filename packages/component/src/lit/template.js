import { TemplateCompiler } from '@semantic-ui/templating';
import { $ } from '@semantic-ui/query';
import { isFunction } from '@semantic-ui/utils';

import { LitRenderer } from './renderer.js';

export const LitTemplate = class UITemplate {

  constructor({
    ast,
    template,
    data,
    css,
    subTemplates,
    createInstance,
    renderRoot
  }) {

    // if we are rendering many of same template we want to pass in AST for performance
    if(!ast) {
      const compiler = new TemplateCompiler(template);
      ast = compiler.compile();
    }

    this.css = css;
    this.data = data || {};
    this.tpl = {};

    if(isFunction(createInstance)) {
      this.tpl = this.call(createInstance);
    }

    this.renderer = new LitRenderer({
      ast,
      data: this.getDataContext(),
      subTemplates: subTemplates
    });
  }

  getDataContext() {
    return {
      ...this.tpl,
      ...this.data
    };
  }

  render(additionalData = {}) {
    const html = this.renderer.render({
      data: {
        ...this.getDataContext(),
        ...additionalData
      }
    });
    return html;
  }

  renderWithData(templateData = {}) {
    const html = this.renderer.render({
      data: templateData
    });
    return html;
  }

  /*******************************
           DOM Helpers
  *******************************/


  // Rendered DOM (either shadow or regular)
  $(selector) {
    if(!this.renderRoot) {
      console.error('Cannot query DOM unless render root specified.');
    }
    return $(selector, this.renderRoot);
  }

  // calls callback if defined with consistent params and this context
  call(func, { firstArg, additionalArgs, args = [this.tpl, this.$.bind(this)] } = {}) {
    if(firstArg) {
      args.unshift(firstArg);
    }
    if(additionalArgs) {
      args.push(...additionalArgs);
    }
    if(isFunction(func)) {
      return func.apply(this, args);
    }
  }

};
