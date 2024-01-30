import { TemplateCompiler } from '@semantic-ui/templating';
import { $ } from '@semantic-ui/query';
import { each, noop, isFunction, extend } from '@semantic-ui/utils';
import { Reaction } from '@semantic-ui/reactivity';

import { LitRenderer } from './renderer.js';

export const LitTemplate = class UITemplate {

  constructor({
    ast,
    template,
    data,
    css,
    events,
    subTemplates,
    createInstance,
    onRendered = noop,
    onDestroyed = noop
  }) {

    // if we are rendering many of same template we want to pass in AST for performance
    if(!ast) {
      const compiler = new TemplateCompiler(template);
      ast = compiler.compile();
    }

    this.events = events;
    this.ast = ast;
    this.css = css;
    this.data = data || {};
    this.subTemplates = subTemplates;
    this.createInstance = createInstance;
    this.onRenderedCallback = onRendered;
    this.onDestroyedCallback = onDestroyed;
  }

  initialize() {
    let tpl = this;
    if(isFunction(this.createInstance)) {
      this.tpl = {};
      tpl = this.call(this.createInstance);
      extend(this.tpl, tpl);
    }
    this.tpl.reaction = this.reaction;

    this.onRendered = () => {
      this.call(this.onRenderedCallback.bind(this));
    };
    this.onDestroyed = () => {
      this.clearComputations();
      this.call(this.onDestroyedCallback.bind(this));
    };

    this.renderer = new LitRenderer({
      ast: this.ast,
      data: this.getDataContext(),
      subTemplates: this.subTemplates,
      renderRoot: this.renderRoot
    });
  }

  setRoot(element) {
    return this.renderRoot = element;
  }

  getDataContext() {
    return {
      ...this.tpl,
      ...this.data
    };
  }

  attachEvents(events = this.events) {
    if(!this.renderRoot) {
      this.fatal('You must set a render root before attaching events');
    }
    // format like 'click .foo baz'
    const parseEventString = (eventString) => {
      const parts = eventString.split(' ');
      const eventName = parts[0];
      parts.shift();
      const selector = parts.join(' ');
      return { eventName, selector };
    };

    each(events, (eventHandler, eventString) => {
      const { eventName, selector } = parseEventString(eventString);
      const template = this;
      $(this.renderRoot).on(eventName, selector, function(event) {
        const boundEvent = eventHandler.bind(event.target);
        template.call(boundEvent, {firstArg: event, additionalArgs: [this.dataset]});
      });
    });
  }

  render(additionalData = {}) {
    if(!this.renderer) {
      this.initialize();
    }
    const html = this.renderer.render({
      data: {
        ...this.getDataContext(),
        ...additionalData
      }
    });
    this.rendered = true;
    return html;
  }

  /*******************************
           DOM Helpers
  *******************************/


  // Rendered DOM (either shadow or regular)
  $(selector) {
    if(!this.renderRoot) {
      this.fatal('Cannot query DOM unless render root specified.');
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

  /*******************************
           Reactive Helpers
  *******************************/

  reaction(reaction) {
    if(!this.computations) {
      this.computations = [];
    }
    this.computations.push(Reaction.create(reaction));
  }

  clearComputations() {
    each(this.computations || [], comp => comp.stop());
  }

  fatal(message) {
    throw new Error(message);
  }

};
