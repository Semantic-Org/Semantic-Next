import { $ } from '@semantic-ui/query';
import { capitalize, fatal, each, remove, generateID, isEqual, noop, isServer, inArray, isFunction, extend, wrapFunction } from '@semantic-ui/utils';
import { ReactiveVar, Reaction } from '@semantic-ui/reactivity';

import { LitRenderer } from '@semantic-ui/component';
import { TemplateCompiler } from './compiler/template-compiler.js';
import { TemplateHelpers } from './template-helpers.js';

export const Template = class Template {
  static templateCount = 0;

  static isServer = isServer;

  constructor({
    templateName,
    ast,
    template,
    data,
    element,
    renderRoot,
    css,
    events,
    state,
    subTemplates,
    createInstance,
    parentTemplate, // the parent template when nested
    renderingEngine = 'lit',
    isPrototype = false,
    attachStyles = false, // whether to construct css stylesheet and attach to renderRoot
    onCreated = noop,
    onRendered = noop,
    onDestroyed = noop,
    onThemeChanged = noop,
  }) {
    // if we are rendering many of same template we want to pass in AST for performance
    if (!ast) {
      const compiler = new TemplateCompiler(template);
      ast = compiler.compile();
    }
    this.events = events;
    this.ast = ast;
    this.css = css;
    this.data = data || {};
    this.reactions = [];
    this.state = state || {};
    this.templateName = templateName || this.getGenericTemplateName();
    this.subTemplates = subTemplates;
    this.createInstance = createInstance;
    this.onCreated = noop;
    this.onDestroyed = noop;
    this.onRendered = noop;
    this.onRenderedCallback = onRendered;
    this.onDestroyedCallback = onDestroyed;
    this.onCreatedCallback = onCreated;
    this.onThemeChangedCallback = onThemeChanged;
    this.id = generateID();
    this.isPrototype = isPrototype;
    this.attachStyles = attachStyles;
    this.element = element;
    this.renderingEngine = renderingEngine;
    if (renderRoot) {
      this.attach(renderRoot);
    }
  }

  setDataContext(data, { rerender = true } = {}) {
    this.data = data;
    this.tpl.data = data;
    if(rerender) {
      this.rendered = false;
    }
  }

  // when rendered as a partial/subtemplate
  setParent(parentTemplate) {
    parentTemplate._childTemplates.push(this);
    this.parentTemplate = parentTemplate;
  }

  setElement(element) {
    this.element = element;
  }

  getGenericTemplateName() {
    Template.templateCount++;
    return `Anonymous #${Template.templateCount}`;
  }

  initialize() {
    let tpl = this;
    if (isFunction(this.createInstance)) {
      this.tpl = { data: this.data };
      tpl = this.call(this.createInstance) || {};
      extend(this.tpl, tpl);
    }
    // reactions bound with tpl.reaction will be scoped to template
    // and be removed when the template is destroyed
    this.tpl.reaction = this.reaction.bind(this);
    if (isFunction(tpl.initialize)) {
      this.call(tpl.initialize.bind(this));
    }
    this.tpl.data = this.data;
    this.tpl._childTemplates = [];

    /* This will be removed before release
      will need to refactor some examples
    */
    this.tpl.$ = this.$.bind(this);
    this.tpl.$$ = this.$$.bind(this);
    this.tpl.attachEvent = this.attachEvent.bind(this);
    this.tpl.templateName = this.templateName;

    this.tpl.findTemplate = this.findTemplate;
    this.tpl.dispatchEvent = this.dispatchEvent.bind(this);
    this.tpl.findParent = this.findParent.bind(this);
    this.tpl.findChild = this.findChild.bind(this);
    this.tpl.findChildren = this.findChildren.bind(this);
    /* end of removed section */

    this.onCreated = () => {
      this.call(this.onCreatedCallback);
      Template.addTemplate(this);
      this.dispatchEvent('created', { tpl: this.tpl }, {}, { triggerCallback: false });
    };
    this.onRendered = () => {
      this.call(this.onRenderedCallback);
      this.dispatchEvent('rendered', { tpl: this.tpl }, {}, { triggerCallback: false });
    };
    this.onThemeChanged = (...args) => {
      this.call(this.onThemeChangedCallback, ...args);
    };
    this.onDestroyed = () => {
      Template.removeTemplate(this);
      this.rendered = false;
      this.clearReactions();
      this.removeEvents();
      this.call(this.onDestroyedCallback);
      this.dispatchEvent('destroyed', { tpl: this.tpl }, {}, { triggerCallback: false });
    };

    this.initialized = true;

    if(this.renderingEngine == 'lit') {
      this.renderer = new LitRenderer({
        ast: this.ast,
        data: this.getDataContext(),
        subTemplates: this.subTemplates,
        helpers: TemplateHelpers,
      });
    }
    else {
      fatal('Unknown renderer specified', this.renderingEngine);
    }

    this.onCreated();
  }

  async attach(
    renderRoot,
    { parentNode = renderRoot, startNode, endNode } = {}
  ) {
    if (!this.initialized) {
      this.initialize();
    }
    if (this.renderRoot == renderRoot) {
      return;
    }

    // to attach styles & events
    this.renderRoot = renderRoot;
    // to determine if event occurred on template
    this.parentNode = parentNode;
    this.startNode = startNode;
    this.endNode = endNode;
    this.attachEvents();
    if (this.attachStyles) {
      await this.addAdoptedStylesheet();
    }
  }

  getDataContext() {
    return {
      ...this.data,
      ...this.tpl,
    };
  }

  async addAdoptedStylesheet() {
    if (!this.css) {
      return;
    }
    if (!this.renderRoot || !this.renderRoot.adoptedStyleSheets) {
      return;
    }
    const cssString = this.css;
    if (!this.stylesheet) {
      this.stylesheet = new CSSStyleSheet();
      await this.stylesheet.replace(cssString);
    }
    let styles = Array.from(this.renderRoot.adoptedStyleSheets);

    // check if already adopted
    let hasStyles = styles.some((style) =>
      isEqual(style.cssRules, this.stylesheet.cssRules)
    );

    if (!hasStyles) {
      this.renderRoot.adoptedStyleSheets = [
        ...this.renderRoot.adoptedStyleSheets,
        this.stylesheet,
      ];
    }
  }

  clone(settings) {
    const defaultSettings = {
      templateName: this.templateName,
      element: this.element,
      ast: this.ast,
      css: this.css,
      events: this.events,
      renderingEngine: this.renderingEngine,
      subTemplates: this.subTemplates,
      onCreated: this.onCreatedCallback,
      onThemeChanged: this.onThemeChangedCallback,
      onRendered: this.onRenderedCallback,
      onDestroyed: this.onDestroyedCallback,
      createInstance: this.createInstance,
    };
    return new Template({
      ...defaultSettings,
      ...settings,
    });
  }

  attachEvents(events = this.events) {
    if (!this.parentNode || !this.renderRoot) {
      fatal('You must set a parent before attaching events');
    }
    this.removeEvents();
    // format like 'click .foo baz'
    const parseEventString = (eventString) => {
      const parts = eventString.split(' ');
      let eventName = parts[0];
      parts.shift();
      const selector = parts.join(' ');
      const bubbleMap = {
        blur: 'focusout',
        focus: 'focusin',
        //change: 'input',
        load: 'DOMContentLoaded',
        unload: 'beforeunload',
        mouseenter: 'mouseover',
        mouseleave: 'mouseout',
      };
      if (bubbleMap[eventName]) {
        eventName = bubbleMap[eventName];
      }
      return { eventName, selector };
    };

    // this is to cancel event bindings when template tears down
    // <https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal>
    this.eventController = new AbortController();

    // This makes an assumption that a custom event will be emitted when a theme change occurs
    if(!Template.isServer && this.onThemeChangedCallback !== noop) {
      $('html').on('themechange', (event) => {
        this.onThemeChanged({
          additionalData: {
            event: event,
            ...event.detail
          },
        });
      }, { abortController: this.eventController });
    }

    each(events, (eventHandler, eventString) => {
      const { eventName, selector } = parseEventString(eventString);
      const template = this;

      // BUG: iOS Safari will not bubble the touchstart / touchend events
      // if theres no handler on the actual element
      if(selector) {
        $(selector, { root: this.renderRoot }).on(eventName, noop);
      }
      $(this.renderRoot).on(
        eventName,
        selector,
        (event) => {
          if (!this.isNodeInTemplate(event.target)) {
            console.log('ignored event because it is not in template', eventName, selector);
            return;
          }
          if (
            (eventName === 'mouseover' || eventName === 'mouseout') &&
            event.relatedTarget &&
            event.target.contains(event.relatedTarget)
          ) {
            return;
          }
          const targetElement = (selector)
            ? $(event.target).closest(selector).get(0) // delegation
            : event.target
          ;
          const boundEvent = eventHandler.bind(targetElement);
          const eventData = event?.detail || {};
          const elData = targetElement.dataset;
          template.call(boundEvent, {
            additionalData: { event: event, data: { ...elData, ...eventData } },
          });
        },
        { abortController: this.eventController }
      );
    });
  }

  removeEvents() {
    if (this.eventController) {
      this.eventController.abort();
    }
  }

  // Find the direct child of the renderRoot that is an ancestor of the event.target
  // then confirm position
  isNodeInTemplate(node) {
    const getRootChild = (node) => {
      while (node && node.parentNode !== this.parentNode) {
        node = node.parentNode;
      }
      return node;
    };
    const isNodeInRange = (
      node,
      startNode = this.startNode,
      endNode = this.endNode
    ) => {
      if (!startNode || !endNode) {
        return true;
      }
      if (node === null) {
        return;
      }
      const startComparison = startNode.compareDocumentPosition(node);
      const endComparison = endNode.compareDocumentPosition(node);

      /* "&" here comes some gnarly bitwise
        DOCUMENT_POSITION_FOLLOWING = 0x04, DOCUMENT_POSITION_PRECEDING = 0x02
        <https://developer.mozilla.org/en-US/docs/Web/API/Node/compareDocumentPosition>
      */
      const isAfterStart =
        (startComparison & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;
      const isBeforeEnd =
        (endComparison & Node.DOCUMENT_POSITION_PRECEDING) !== 0;
      return isAfterStart && isBeforeEnd;
    };
    return isNodeInRange(getRootChild(node));
  }

  render(additionalData = {}) {
    if (!this.initialized) {
      this.initialize();
    }
    const dataContext = {
      ...this.getDataContext(),
      ...additionalData,
    };
    this.setDataContext(dataContext, { rerender: false });
    const html = this.renderer.render({
      data: dataContext,
    });
    if (!this.rendered) {
      setTimeout(this.onRendered, 0); // actual render occurs after html is parsed
    }
    this.rendered = true;
    return html;
  }

  /*******************************
             DOM Helpers
  *******************************/

  // Rendered DOM (either shadow or regular)
  $(selector, { root = this.renderRoot, filterTemplate = true, ...otherArgs } = {}) {
    if(!Template.isServer && inArray(selector, ['body', 'document', 'html'])) {
      root = document;
    }
    if (!root) {
      root = globalThis;
    }
    if (root == this.renderRoot) {
      const $results = $(selector, { root, ...otherArgs });
      return filterTemplate
        ? $results.filter((node) => this.isNodeInTemplate(node))
        : $results;
    }
    else {
      return $(selector, { root, ...otherArgs});
    }
  }

  $$(selector, args) {
    return this.$(selector, { root: this.renderRoot, filterTemplate: false, ...args });
  }

  // calls callback if defined with consistent params and this context
  call(func, { params, additionalData = {}, firstArg, additionalArgs } = {}) {
    const args = [];
    if (this.isPrototype) {
      return;
    }
    if (!params) {
      const element = this.element;
      params = {

        el: this.element,
        tpl: this.tpl,
        $: this.$.bind(this),

        reaction: this.reaction.bind(this),
        reactiveVar: this.reactiveVar.bind(this),

        data: this.tpl.data,
        settings: this.element.settings,
        state: this.element.state,

        isRendered: this.rendered,
        isServer: Template.isServer,
        isClient: !Template.isServer, // convenience

        dispatchEvent: this.dispatchEvent.bind(this),
        attachEvent: this.attachEvent.bind(this),
        abortController: this.eventController,

        template: this,
        templateName: this.templateName,
        templates: Template.renderedTemplates,

        findTemplate: this.findTemplate,
        findParent: this.findParent.bind(this),
        findChild: this.findChild.bind(this),
        findChildren: this.findChildren.bind(this),

        // not yet implemented
        content: this.tpl.content,

        // on demand since requires  computing styles
        get darkMode() { return element.isDarkMode(); },

        ...additionalData,
      };
      args.push(params);
    }
    if (additionalArgs) {
      args.push(...additionalArgs);
    }
    if (isFunction(func)) {
      return func.apply(this.element, args);
    }
  }

  // attaches an external event handler making sure to remove the event when the component is destroyed
  attachEvent(selector, eventName, eventHandler, eventSettings) {
    $(selector, document).on(eventName, eventHandler, {
      abortController: this.eventController,
      ...eventSettings
    });
  }

  // dispatches an event from this template
  dispatchEvent(eventName, eventData, eventSettings, { triggerCallback = true } = {}) {
    if(Template.isServer) {
      return;
    }
    // call callback on DOM element if defined
    if(triggerCallback) {
      const callbackName = `on${capitalize(eventName)}`;
      const callback = this.element[callbackName];
      wrapFunction(callback).call(this, eventData);
    }

    // trigger DOM event
    return $(this.element).dispatchEvent(eventName, eventData, eventSettings);
  }

  /*******************************
           Reactive Helpers
  *******************************/

  reaction(reaction) {
    this.reactions.push(Reaction.create(reaction));
  }

  reactiveVar(value, options) {
    return new ReactiveVar(value, options);
  }

  clearReactions() {
    each(this.reactions || [], (comp) => comp.stop());
  }

  /*******************************
          Template Helpers
  *******************************/


  findTemplate = (templateName) => Template.findTemplate(templateName);
  findParent = (templateName) => Template.findParentTemplate(this, templateName);
  findChild = (templateName) => Template.findChildTemplate(this, templateName);
  findChildren = (templateName) => Template.findChildTemplates(this, templateName);

  static renderedTemplates = new Map();

  static addTemplate(template) {
    if (template.isPrototype) {
      return;
    }
    let templates = Template.renderedTemplates.get(template.templateName) || [];
    templates.push(template);
    Template.renderedTemplates.set(template.templateName, templates);
  }
  static removeTemplate(template) {
    if (template.isPrototype) {
      return;
    }
    let templates = Template.renderedTemplates.get(template.templateName) || [];
    remove(templates, template);
    Template.renderedTemplates.set(templates);
  }
  static getTemplates(templateName) {
    return Template.renderedTemplates.get(templateName) || [];
  }
  static findTemplate(templateName) {
    return Template.getTemplates(templateName)[0];
  }
  static findParentTemplate(template, templateName) {
    let match;
    if (templateName) {
      // this matches on DOM (common)
      if(!match) {
        let parentNode = template.element?.parentNode;
        while(parentNode) {
          if(parentNode.template?.templateName == templateName) {
            match = parentNode.template.tpl;
            break;
          }
          parentNode = parentNode.parentNode;
        }
      }
      // this matches on nested partials (less common)
      while (template) {
        template = template.parentTemplate;
        if (!match && template?.templateName == templateName) {
          match = template;
          break;
        }
      }
      return match;
    }
    return template.parentTemplate;
  }

  static findChildTemplates(template, templateName) {
    let result = [];
    // recursive lookup
    function search(template, templateName) {
      if (template.templateName === templateName) {
        result.push(template.tpl);
      }
      if (template.tpl._childTemplates) {
        template.tpl._childTemplates.forEach((childTemplate) => {
          search(childTemplate, templateName);
        });
      }
    }
    search(template, templateName);
    return result;
  }
  static findChildTemplate(template, templateName) {
    return Template.findChildTemplates(template, templateName)[0];
  }
};
