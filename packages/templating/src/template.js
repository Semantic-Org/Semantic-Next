import { $ } from '@semantic-ui/query';
import { capitalize, fatal, each, remove, any, clone, generateID, getKeyFromEvent, isEqual, noop, isServer, inArray, isFunction, extend, wrapFunction } from '@semantic-ui/utils';
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
    keys,
    stateConfig,
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
    this.keys = keys || {};
    this.ast = ast;
    this.css = css;
    this.data = data || {};
    this.reactions = [];
    this.stateConfig = stateConfig;
    this.state = this.createReactiveState(stateConfig) || {};
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
    this.parentTemplate = parentTemplate;
    this.attachStyles = attachStyles;
    this.element = element;
    this.renderingEngine = renderingEngine;
    if (renderRoot) {
      this.attach(renderRoot);
    }
  }

  createReactiveState(stateConfig) {
    let reactiveState = {};
    each(stateConfig, (config, name) => {
      if(config?.value && config?.options) {
        // complex config { counter: { value: 0, options: { equalityFunction }}}
        reactiveState[name] = new ReactiveVar(config.value, config.options);
      }
      else {
        // simple config i.e. { counter: 0 }
        const initialValue = config;
        reactiveState[name] = new ReactiveVar(initialValue);
      }
    });
    return reactiveState;
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
    this.bindKeys();
    if (this.attachStyles) {
      await this.adoptStylesheet();
    }
  }

  getDataContext() {
    return {
      ...this.data,
      ...this.state,
      ...this.tpl,
    };
  }

  async adoptStylesheet() {
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
      stateConfig: this.stateConfig,
      events: this.events,
      keys: this.keys,
      renderingEngine: this.renderingEngine,
      subTemplates: this.subTemplates,
      onCreated: this.onCreatedCallback,
      onThemeChanged: this.onThemeChangedCallback,
      onRendered: this.onRenderedCallback,
      parentTemplate: this.parentTemplate,
      onDestroyed: this.onDestroyedCallback,
      createInstance: this.createInstance,
    };
    return new Template({
      ...defaultSettings,
      ...settings,
    });
  }

  parseEventString(eventString) {
    // we are using event delegation so we will have to bind
    // some events to their corresponding event that bubbles
    const getBubbledEvent = (eventName) => {
      const bubbleMap = {
        blur: 'focusout',
        focus: 'focusin',
        load: 'DOMContentLoaded',
        unload: 'beforeunload',
        mouseenter: 'mouseover',
        mouseleave: 'mouseout',
      };
      if(bubbleMap[eventName]) {
        eventName = bubbleMap[eventName];
      }
      return eventName;
    };

    let events = [];
    let parts = eventString.split(/\s+/);

    let addedEvents = false;
    let addedSelectors = false;
    const eventNames = [];
    const selectors = [];
    each(parts, (part, index) => {
      const value = part.replace(/(\,|\W)+$/, '').trim();
      const hasComma = part.includes(',');
      if(!addedEvents) {
        eventNames.push(getBubbledEvent(value));
        addedEvents = !hasComma;
      }
      else if(!addedSelectors) {
        const selectorParts = parts.slice(index).join(' ').split(',');
        each(selectorParts, (value) => {
          selectors.push(value.trim());
        });
        addedSelectors = true;
      }
    });
    each(eventNames, (eventName) => {
      // this event has no selectors which means it should occur on component
      if(!selectors.length) {
        selectors.push('');
      }
      each(selectors, (selector) => {
        events.push({ eventName, selector });
      });
    });
    if(eventString == 'click') {
      console.log(events);
    }
    return events;
  }

  attachEvents(events = this.events) {
    if (!this.parentNode || !this.renderRoot) {
      fatal('You must set a parent before attaching events');
    }
    this.removeEvents();

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
      const subEvents = this.parseEventString(eventString);
      const template = this;
      each(subEvents, (event) => {
        const { eventName, selector } = event;
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
              return;
            }
            if (inArray(eventName, ['mouseover', 'mouseout'])
              && event.relatedTarget
              && event.target.contains(event.relatedTarget)) {
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
    });
  }

  removeEvents() {
    if (this.eventController) {
      this.eventController.abort();
    }
  }

  bindKeys(keys = this.keys) {
    if(isServer) {
      return;
    }
    if(Object.keys(keys).length == 0) {
      return;
    }
    const sequenceTimeout = 500; // time in ms required between keypress
    const eventSettings = { abortController: this.eventController };
    this.currentSequence = '';
    $(document)
      .on('keydown', (event) => {
        const key = getKeyFromEvent(event);

        // avoid repeated keypress when holding down key
        if(key == this.currentKey) {
          return;
        }
        this.currentKey = key;
        this.currentSequence += key;

        // check for key event
        each(this.keys, (handler, keySequence) => {
          keySequence = keySequence.replace(/\s*\+\s*/g, '+'); // remove space around +
          const keySequences = keySequence.split(',');
          if(any(keySequences, sequence => this.currentSequence.endsWith(sequence))) {
            const eventResult = this.call(handler, { additionalData: { event: event } });
            if(eventResult !== true) {
              event.preventDefault();
            }
          }
        });

        // start next sequence
        this.currentSequence += ' ';

        // end sequence if not occuring in time
        clearTimeout(this.resetSequence);
        this.resetSequence = setTimeout(() => { this.currentSequence = ''; }, sequenceTimeout);

      }, eventSettings)
      .on('keyup', (event) => { this.currentKey = ''; })
    ;
  }

  bindKey(key, callback) {
    if(!key || !callback) {
      return;
    }
    const needsInit = Object.keys(this.keys).length == 0;
    this.keys[key] = callback;
    if(needsInit) {
      this.bindKeys();
    }
  }

  removeKey(key) {
    delete this.keys[key];
  }

  // Find the direct child of the renderRoot that is an ancestor of the event.target
  // then confirm position
  isNodeInTemplate(node) {
    const getRootChild = (node) => {
      while (node && node.parentNode !== this.parentNode) {
        if (node.parentNode === null && node.host) {
          node = node.host;
        } else {
          node = node.parentNode;
        }
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
        return false;
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
    return this.$(selector, { root: this.renderRoot, pierceShadow: true, filterTemplate: true, ...args });
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
        $$: this.$$.bind(this),

        reaction: this.reaction.bind(this),
        reactiveVar: this.reactiveVar.bind(this),

        data: this.tpl.data,
        settings: this.element.settings,
        state: this.state,

        isRendered: this.rendered,
        isServer: Template.isServer,
        isClient: !Template.isServer,

        dispatchEvent: this.dispatchEvent.bind(this),
        attachEvent: this.attachEvent.bind(this),
        bindKey: this.bindKey.bind(this),
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
    $(selector, document, { pierceShadow: true }).on(eventName, eventHandler, {
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
