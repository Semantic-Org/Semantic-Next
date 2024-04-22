import { TemplateCompiler } from '@semantic-ui/templating';
import { $ } from '@semantic-ui/query';
import { fatal, each, remove, generateID, isEqual, noop, isServer, inArray, isFunction, extend, clone } from '@semantic-ui/utils';
import { Reaction } from '@semantic-ui/reactivity';

import { LitRenderer } from './renderer.js';

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

  setDataContext(data) {
    this.data = data;
    this.tpl.data = data;
    this.rendered = false;
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
    this.tpl.reaction = this.reaction;
    if (isFunction(tpl.initialize)) {
      this.call(tpl.initialize.bind(this));
    }
    this.tpl.data = this.data;
    this.tpl._childTemplates = [];
    this.tpl.$ = this.$.bind(this);
    this.tpl.$$ = this.$$.bind(this);
    this.tpl.templateName = this.templateName;
    // this is a function to avoid naive cascading reactivity
    this.tpl.findTemplate = Template.findTemplate;
    this.tpl.parent = (templateName) =>
      Template.findParentTemplate(this, templateName);
    this.tpl.child = (templateName) =>
      Template.findChildTemplate(this, templateName);
    this.tpl.children = (templateName) =>
      Template.findChildTemplates(this, templateName);

    this.onCreated = () => {
      this.call(this.onCreatedCallback);
    };
    this.onRendered = () => {
      this.call(this.onRenderedCallback);
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
    };

    this.initialized = true;

    if(this.renderingEngine == 'lit') {
      this.renderer = new LitRenderer({
        ast: this.ast,
        data: this.getDataContext(),
        subTemplates: this.subTemplates,
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

    each(events, (eventHandler, eventString) => {
      const { eventName, selector } = parseEventString(eventString);
      const template = this;

      // BUG: iOS Safari will not bubble the touchstart / touchend events
      // if theres no handler on the actual element
      $(selector, this.renderRoot).on(eventName, noop);

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

      $(this.renderRoot).on(
        eventName,
        selector,
        (event) => {
          if (!this.isNodeInTemplate(event.target)) {
            return;
          }
          if (
            (eventName === 'mouseover' || eventName === 'mouseout') &&
            event.relatedTarget &&
            event.target.contains(event.relatedTarget)
          ) {
            return;
          }
          const matchingElement = $(event.target).closest(selector).get(0);
          const boundEvent = eventHandler.bind(matchingElement);
          template.call(boundEvent, {
            additionalData: { event: event, data: matchingElement.dataset },
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
    const html = this.renderer.render({
      data: {
        ...this.getDataContext(),
        ...additionalData,
      },
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
  $(selector, root = this.renderRoot, { filterTemplate = true } = {}) {
    if(!Template.isServer && inArray(selector, ['body', 'document', 'html'])) {
      root = document;
    }
    if (!root) {
      root = globalThis;
    }
    if (root == this.renderRoot) {
      const $results = $(selector, root);
      return filterTemplate
        ? $results.filter((node) => this.isNodeInTemplate(node))
        : $results;
    }
    else {
      return $(selector, root);
    }
  }

  $$(selector) {
    return this.$(selector, this.renderRoot, { filterTemplate: false });
  }

  // calls callback if defined with consistent params and this context
  call(func, { params, additionalData = {}, firstArg, additionalArgs } = {}) {
    const args = [];
    if (this.isPrototype) {
      return;
    }
    if (!params) {
      const data = clone(this.tpl.data);
      params = {
        el: this.element,
        tpl: this.tpl,
        data: data,
        settings: data, // Todo: extract only settings from data
        template: this,
        content: this.tpl.content,
        templates: Template.renderedTemplates,
        isServer: Template.isServer,
        isClient: !Template.isServer, // convenience
        darkMode: this.element.isDarkMode(),
        $: this.$.bind(this),
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

  /*******************************
           Reactive Helpers
  *******************************/

  reaction(reaction) {
    if (!this.reactions) {
      this.reactions = [];
    }
    this.reactions.push(Reaction.create(reaction));
  }

  clearReactions() {
    each(this.reactions || [], (comp) => comp.stop());
  }

  static renderedTemplates = new Map();

  static addTemplate(template) {
    if (template.isPrototype) {
      return;
    }
    let templates =
      Template.renderedTemplates.get(template.templateName) || [];
    templates.push(template);
    Template.renderedTemplates.set(template.templateName, templates);
  }
  static removeTemplate(template) {
    if (template.isPrototype) {
      return;
    }
    let templates =
      Template.renderedTemplates.get(template.templateName) || [];
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
      while (template) {
        template = template.parentTemplate;
        if (template?.templateName == templateName) {
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
