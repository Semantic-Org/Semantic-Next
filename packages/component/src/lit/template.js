import { TemplateCompiler } from '@semantic-ui/templating';
import { $ } from '@semantic-ui/query';
import { fatal, each, remove, generateID, isEqual, noop, isFunction, extend } from '@semantic-ui/utils';
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
    prototype = false,
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
    this.templateName = templateName || this.getGenericTemplateName();
    this.subTemplates = subTemplates;
    this.createInstance = createInstance;
    this.onRenderedCallback = onRendered;
    this.onDestroyedCallback = onDestroyed;
    this.onCreatedCallback = onCreated;
    this.id = generateID();
    this.isPrototype = prototype;
    LitTemplate.addTemplate(this);
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
    if(isFunction(tpl.initialize)) {
      this.call(tpl.initialize.bind(this));
    }
    this.tpl.data = this.data;
    this.tpl._childTemplates = [];
    this.tpl.$ = this.$.bind(this);
    this.tpl.$$ = this.$$.bind(this);
    this.tpl.templateName = this.templateName;
    // this is a function to avoid naive cascading reactivity
    this.tpl.findTemplate = LitTemplate.findTemplate;
    this.tpl.parent = (templateName) => LitTemplate.findParentTemplate(this, templateName);
    this.tpl.child = (templateName) => LitTemplate.findChildTemplate(this, templateName);
    this.tpl.children = (templateName) => LitTemplate.findChildTemplates(this, templateName);

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
      LitTemplate.removeTemplate(this);
      this.rendered = false;
      this.clearReactions();
      this.removeEvents();
      this.call(this.onDestroyedCallback.bind(this));
    };

    this.initialized = true;

    this.renderer = new LitRenderer({
      ast: this.ast,
      data: this.getDataContext(),
      subTemplates: this.subTemplates,
    });

    this.onCreated();
  }

  async attach(renderRoot, { parentNode = renderRoot, startNode, endNode } = {}) {
    if(!this.initialized) {
      this.initialize();
    }
    if(this.renderRoot == renderRoot) {
      return;
    }

    // to attach styles & events
    this.renderRoot = renderRoot;
    // to determine if event occurred on template
    this.parentNode = parentNode;
    this.startNode = startNode;
    this.endNode = endNode;
    this.attachEvents();
    await this.attachStyles();
  }

  getDataContext() {
    return {
      ...this.tpl,
      ...this.data
    };
  }

  async attachStyles() {
    if(!this.css) {
      return;
    }
    if(!this.renderRoot || !this.renderRoot.adoptedStyleSheets) {
      return;
    }
    const cssString = this.css;
    if(!this.stylesheet) {
      this.stylesheet = new CSSStyleSheet();
      await this.stylesheet.replace(cssString);
    }
    let styles = Array.from(this.renderRoot.adoptedStyleSheets);

    // check if already adopted
    let hasStyles = styles.some(style => isEqual(style.cssRules, this.stylesheet.cssRules));

    if(!hasStyles) {
      this.renderRoot.adoptedStyleSheets = [ ...this.renderRoot.adoptedStyleSheets, this.stylesheet ];
    }
  }

  clone(settings) {
    const defaultSettings = {
      templateName: this.templateName,
      ast: this.ast,
      css: this.css,
      events: this.events,
      subTemplates: this.subTemplates,
      onCreated: this.onCreatedCallback,
      onRendered: this.onRenderedCallback,
      onDestroyed: this.onDestroyedCallback,
      createInstance: this.createInstance
    };
    return new LitTemplate({
      ...defaultSettings,
      ...settings,
    });
  }

  attachEvents(events = this.events) {
    if(!this.parentNode || !this.renderRoot) {
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
        mouseleave: 'mouseout'
      };
      if(bubbleMap[eventName]) {
        eventName = bubbleMap[eventName];
      }
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
        // this is
        if ((eventName === 'mouseover' || eventName === 'mouseout') && event.relatedTarget && event.target.contains(event.relatedTarget)) {
          return;
        }
        const boundEvent = eventHandler.bind(event.target);
        template.call(boundEvent, { firstArg: event, additionalArgs: [event.target.dataset] });
      }, { abortController: this.eventController });
    });
  }

  removeEvents() {
    if(this.eventController) {
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
    const isNodeInRange = (node, startNode = this.startNode, endNode = this.endNode) => {
      if(!startNode || !endNode) {
        return true;
      }
      if(node === null) {
        return;
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

  render(additionalData = {}) {
    if(!this.initialized) {
      this.initialize();
    }
    const html = this.renderer.render({
      data: {
        ...this.getDataContext(),
        ...additionalData
      }
    });
    if(!this.rendered) {
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
    if(!root) {
      root = document;
    }
    if(root == this.renderRoot) {
      const $results = $(selector, root);
      return (filterTemplate)
        ? $results.filter(node => this.isNodeInTemplate(node))
        : $results
      ;
    }
    else {
      return $(selector, root);
    }
  }

  $$(selector) {
    return this.$(selector, this.renderRoot, { filterTemplate: false });
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

  static renderedTemplates = new Map();

  static addTemplate(template) {
    if(template.isPrototype) {
      return;
    }
    let templates = LitTemplate.renderedTemplates.get(template.templateName) || [];
    templates.push(template);
    LitTemplate.renderedTemplates.set(template.templateName, templates);
  }
  static removeTemplate(template) {
    if(template.isPrototype) {
      return;
    }
    let templates = LitTemplate.renderedTemplates.get(template.templateName) || [];
    remove(templates, template);
    LitTemplate.renderedTemplates.set(templates);
  }
  static getTemplates(templateName) {
    let templates = LitTemplate.renderedTemplates.get(templateName) || [];
    if(templates.length > 1) {
      return templates;
    }
    if(templates.length == 1) {
      return templates[0];
    }
  }
  static findTemplate(templateName) {
    return LitTemplate.getTemplates(templateName)[0];
  }
  static findParentTemplate(template, templateName) {
    let match;
    if(templateName) {
      while(template) {
        template = template.parentTemplate;
        if(template?.templateName == templateName) {
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
        template.tpl._childTemplates.forEach(childTemplate => {
          search(childTemplate, templateName);
        });
      }
    }
    search(template, templateName);
    return result;
  }
  static findChildTemplate(template, templateName) {
    return LitTemplate.findChildTemplates(template, templateName)[0];
  }

};
