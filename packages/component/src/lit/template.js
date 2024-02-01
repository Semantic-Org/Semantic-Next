import { TemplateCompiler } from '@semantic-ui/templating';
import { $ } from '@semantic-ui/query';
import { each, noop, isFunction, extend } from '@semantic-ui/utils';
import { Reaction } from '@semantic-ui/reactivity';

import { LitRenderer } from './renderer.js';

export const LitTemplate = class UITemplate {

  static templateCount = 0;

  constructor({
    templateName,
    ast,
    template,
    data,
    css,
    events,
    subTemplates,
    createInstance,
    parentTemplate, // the parent template when nested
    onCreated = noop,
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
    this.templateName = templateName || getGenericTemplateName();
    this.subTemplates = subTemplates;
    this.createInstance = createInstance;
    this.onRenderedCallback = onRendered;
    this.onDestroyedCallback = onDestroyed;
    this.onCreatedCallback = onCreated;
  }

  // when rendered as a partial/subtemplate
  setParent(parentTemplate) {
    return this.parentTemplate = parentTemplate;
  }

  getGenericTemplateName() {
    LitTemplate.templateCount++;
    return `Anonymous #${LitTemplate.templateCount}`;
  }

  initialize() {
    let tpl = this;
    if(isFunction(this.createInstance)) {
      this.tpl = {};
      tpl = this.call(this.createInstance);
      extend(this.tpl, tpl);
    }
    // reactions bound with tpl.reaction will be scoped to template
    // and be removed when the template is destroyed
    this.tpl.reaction = this.reaction;
    this.tpl.templateName = this.templateName;
    // this is a function to avoid naive cascading reactivity
    this.tpl.parent = () => this.parentTemplate;

    this.onCreated = () => {
      this.call(this.onCreatedCallback.bind(this));
    };
    this.onFirstRender = () => {
      this.call(this.onFirstRenderCallback.bind(this));
    };
    this.onRendered = () => {
      this.call(this.onRenderedCallback.bind(this));
    };
    this.onDestroyed = () => {
      this.rendered = false;
      this.clearReactions();
      this.removeEvents();
      this.call(this.onDestroyedCallback.bind(this));
    };

    this.renderer = new LitRenderer({
      ast: this.ast,
      data: this.getDataContext(),
      subTemplates: this.subTemplates,
      renderRoot: this.renderRoot
    });
  }

  attach(rootElement, { startNode, endNode } = {}) {
    this.renderRoot = rootElement;
    this.startNode = startNode;
    this.endNode = endNode;
    this.attachEvents();
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

    // the magic of aborts <https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal>
    this.eventController = new AbortController();
    each(events, (eventHandler, eventString) => {
      const { eventName, selector } = parseEventString(eventString);
      const template = this;
      $(this.renderRoot).on(eventName, selector, (event) => {
        if(!this.isNodeInTemplate(event.target)) {
          return;
        }
        const boundEvent = eventHandler.bind(event.target);
        template.call(boundEvent, { firstArg: event, additionalArgs: [event.target.dataset] });
      }, this.eventController);
    });
  }

  // Find the direct child of the renderRoot that is an ancestor of the event.target
  // then confirm position
  isNodeInTemplate(node) {
    const getRootChild = (node) => {
      while (node && node.parentNode !== this.renderRoot) {
        node = node.parentNode;
      }
      return node;
    };
    const isNodeInRange = (node, startNode = this.startNode, endNode = this.endNode) => {
      if(!startNode || !endNode) {
        return true;
      }
      const startComparison = startNode.compareDocumentPosition(node);
      const endComparison = endNode.compareDocumentPosition(node);

      /* "&" here comes some gnarly bitwise
        DOCUMENT_POSITION_FOLLOWING = 0x04, DOCUMENT_POSITION_PRECEDING = 0x02
        <https://developer.mozilla.org/en-US/docs/Web/API/Node/compareDocumentPosition>
      */
      const isAfterStart = (startComparison & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;
      const isBeforeEnd = (endComparison & Node.DOCUMENT_POSITION_PRECEDING) !== 0;
      return isAfterStart && isBeforeEnd;
    };
    return isNodeInRange(getRootChild(node));
  }

  attachEvent(eventHandler, eventString) {

  }

  removeEvents() {
    this.eventController.abort();
  }

  render(additionalData = {}) {
    if(!this.renderer) {
      this.initialize();
      this.onCreated();
    }
    const html = this.renderer.render({
      data: {
        ...this.getDataContext(),
        ...additionalData
      }
    });
    if(!this.rendered) {
      this.onRendered();
    }
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
    if(!this.reactions) {
      this.reactions = [];
    }
    this.reactions.push(Reaction.create(reaction));
  }

  clearReactions() {
    each(this.reactions || [], comp => comp.stop());
  }

  fatal(message) {
    throw new Error(message);
  }

};
