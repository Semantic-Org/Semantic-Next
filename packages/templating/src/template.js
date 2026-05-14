import { $ } from '@semantic-ui/query';
import { Reaction, Signal } from '@semantic-ui/reactivity';
import {
  any,
  assignInPlace,
  capitalize,
  debounce,
  each,
  extend,
  fatal,
  generateID,
  get,
  getKeyFromEvent,
  inArray,
  isClient,
  isEqual,
  isFunction,
  isServer,
  kebabToCamel,
  mapObject,
  noop,
  remove,
  wrapFunction,
} from '@semantic-ui/utils';

import { TemplateCompiler } from '@semantic-ui/compiler';
import { getEngine } from '@semantic-ui/renderer';
import { TemplateHelpers } from './template-helpers.js';

const IS_TEMPLATE = Symbol.for('semantic-ui/Template');

export const Template = class Template {
  get [IS_TEMPLATE]() {
    return true;
  }
  // fixes instanceof when multiple copies loaded
  static [Symbol.hasInstance](instance) {
    return !!instance?.[IS_TEMPLATE];
  }

  static templateCount = 0;

  static isServer = isServer;

  rendered = false;
  destroyed = false;
  lifecycleResolvers = {};
  lifecyclePromises = {};

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
    defaultState,
    defaultSettings,
    subTemplates,
    createComponent,
    parentTemplate, // the parent template when nested
    renderingEngine = 'native',
    isPrototype = false,
    attachStyles = false, // whether to construct css stylesheet and attach to renderRoot
    onCreated = noop,
    onRendered = noop,
    onUpdated = noop,
    onDestroyed = noop,
    onThemeChanged = noop,
  } = {}) {
    // if we are rendering many of same template we want to pass in AST for performance
    if (!ast) {
      const compiler = new TemplateCompiler(template);
      ast = compiler.compile();
    }
    this.events = events;
    this.observers = [];
    this.keys = keys || {};
    this.ast = ast;
    this.css = css;
    this.data = data || {};
    this.reactions = [];
    this.abortController = new AbortController();
    this.abortSignal = this.abortController.signal;
    this.defaultState = defaultState;
    this.defaultSettings = defaultSettings;
    this.state = this.createReactiveState(defaultState, data) || {};
    this.templateName = templateName || this.getGenericTemplateName();
    this.subTemplates = subTemplates;
    this.createComponent = createComponent;
    this.onCreated = noop;
    this.onDestroyed = noop;
    this.onRendered = noop;
    this.onRenderedCallback = onRendered;
    this.onDestroyedCallback = onDestroyed;
    this.onCreatedCallback = onCreated;
    this.onUpdatedCallback = onUpdated;
    this.onThemeChangedCallback = onThemeChanged;
    this.id = generateID();
    this.isPrototype = isPrototype;
    if (isPrototype) {
      this.template = template;
    }
    this.attachStyles = attachStyles;
    this.element = element;
    this.renderingEngine = renderingEngine;
    if (renderRoot) {
      this.attach(renderRoot);
    }
  }

  toDefinition() {
    return {
      template: this.template,
      css: this.css,
      createComponent: this.createComponent,
      onCreated: this.onCreatedCallback,
      onRendered: this.onRenderedCallback,
      onDestroyed: this.onDestroyedCallback,
      onThemeChanged: this.onThemeChangedCallback,
      onUpdated: this.onUpdatedCallback,
      events: this.events,
      keys: this.keys,
      subTemplates: this.subTemplates,
      defaultState: this.defaultState,
      defaultSettings: this.defaultSettings,
      renderingEngine: this.renderingEngine,
      templateName: this.templateName,
    };
  }

  createReactiveState(defaultState, data) {
    let reactiveState = {};

    // we want to allow data context to override default state
    // this is most useful in subtemplates as state can be used
    // as a substitute for settings because settings only works with tag attributes
    let getInitialValue = (config, name) => {
      const dataValue = get(data, name);
      if (dataValue !== undefined) {
        return dataValue;
      }
      return config?.value ?? config;
    };

    each(defaultState, (config, name) => {
      const initialValue = getInitialValue(config, name);
      if (config?.options) {
        // complex config { counter: { value: 0, options: { equalityFunction }}}
        reactiveState[name] = new Signal(initialValue, config.options);
      }
      else {
        // simple config i.e. { counter: 0 }
        reactiveState[name] = new Signal(initialValue);
      }
    });
    return reactiveState;
  }

  setDataContext(data, { rerender = true } = {}) {
    // preserveGetters keeps computed properties on this.data intact —
    // both component-level getters (e.g. darkMode) and the lazy-getter
    // record installed by buildArgsRecord for reactiveData subtemplates.
    const changed = assignInPlace(this.data, data, { preserveGetters: true, returnChanged: true });
    if (changed) {
      this.dataReplaced = true;
    }
    if (rerender) {
      this.rendered = false;
    }
  }

  isSubtemplate() {
    return this.parentTemplate !== undefined;
  }

  setParent(parentTemplate) {
    if (this.parentTemplate === parentTemplate) {
      return;
    }
    if (this.parentTemplate) {
      this.removeParent();
    }
    if (!parentTemplate._childTemplates) {
      parentTemplate._childTemplates = [];
    }
    parentTemplate._childTemplates.push(this);
    this.parentTemplate = parentTemplate;
  }

  removeParent() {
    if (!this.parentTemplate) {
      return;
    }
    if (this.parentTemplate._childTemplates) {
      this.parentTemplate._childTemplates = this.parentTemplate._childTemplates.filter(template => {
        return template.id !== this.id;
      });
    }
    this.parentTemplate = undefined;
  }

  setElement(element) {
    this.element = element;
  }

  getGenericTemplateName() {
    Template.templateCount++;
    return `Anonymous #${Template.templateCount}`;
  }

  initialize() {
    let template = this;
    let instance;
    this.instance = {};

    // create settings proxy for subtemplates that declare defaultSettings
    if (this.isSubtemplate() && this.defaultSettings && Object.keys(this.defaultSettings).length > 0) {
      this.createSubtemplateSettings();
    }

    if (isFunction(this.createComponent)) {
      instance = this.call(this.createComponent, { thisContext: this.instance }) || {};
      extend(template.instance, instance);
    }
    if (isFunction(template.instance.initialize)) {
      this.call(template.instance.initialize.bind(template));
    }
    // this is necessary for tree traversal with findParent/getChild
    template.instance.templateName = this.templateName;

    const eventSettings = { composed: false };

    this.onCreated = () => {
      this.call(this.onCreatedCallback);
      Template.addTemplate(this);
      this.resolveLifecyclePromise('created');
      if (!this.isHydrating) {
        this.dispatchEvent('created', { component: this.instance }, eventSettings, { triggerCallback: false });
      }
    };
    this.onRendered = () => {
      this.call(this.onRenderedCallback);
      // allow a single hook for after render
      // this is used for binding events that cant use event delegation
      if (isFunction(this.onRenderOnce)) {
        this.onRenderOnce();
        delete this.onRenderOnce;
      }
      this.resolveLifecyclePromise('rendered');
      if (!this.isHydrating) {
        this.dispatchEvent('rendered', { component: this.instance }, eventSettings, { triggerCallback: false });
      }
    };
    this.onUpdated = () => {
      if (this.updateScheduled) { return; }
      this.updateScheduled = true;
      queueMicrotask(() => {
        this.updateScheduled = false;
        if (this.element) {
          this.element.updateScheduled = false;
        }
        this.call(this.onUpdatedCallback);
        this.resolveLifecyclePromise('updated');
        this.dispatchEvent('updated', { component: this.instance }, eventSettings, { triggerCallback: false });
      });
    };

    // onThemeChange can call both from mutation observers and dispatched events
    // this handles if both occur at same time
    this.onThemeChanged = debounce((...args) => {
      this.call(this.onThemeChangedCallback, ...args);
    }, 10);

    this.onDestroyed = () => {
      Template.removeTemplate(this);
      this.markDestroyed();
      this.renderer?.destroy?.();
      this.abortController.abort('Template destroyed');
      this.clearReactions();
      this.removeEvents();
      this.removeObservers();
      this.removeParent();
      this.call(this.onDestroyedCallback);
      this.resolveLifecyclePromise('destroyed');
      this.dispatchEvent('destroyed', { component: this.instance }, eventSettings, { triggerCallback: false });
    };

    this.initialized = true;

    if (this.element) {
      const el = this.element;
      const stateReaction = Reaction.create(() => {
        // bind to any signal changing
        each(this.state, (signal) => signal.dependency.depend());
        // run onUpdated callback
        if (this.rendered && !this.destroyed) {
          el.updateScheduled = true;
          Reaction.afterFlush(this.onUpdated);
        }
      });
      this.reactions.push(stateReaction);
    }

    // Resolve renderer class from engine object or registry
    const engine = typeof this.renderingEngine === 'object'
      ? this.renderingEngine
      : getEngine(this.renderingEngine);
    if (!engine) {
      fatal(
        `Renderer "${this.renderingEngine}" not registered.`
          + ` Import from '@semantic-ui/component' (registers native) or add the engine manually.`,
      );
    }

    const RendererClass = (Template.isServer && engine.serverRenderer)
      ? engine.serverRenderer
      : engine.renderer;
    this.renderer = new RendererClass({
      ast: this.ast,
      data: this.overlaySettingsSignals(this.getDataContext()),
      template: this,
      subTemplates: this.subTemplates,
      helpers: TemplateHelpers,
      receivesData: this.isSubtemplate(),
    });

    this.callParams = this.buildCallParams();

    this.onCreated();
  }

  async attach(
    renderRoot,
    { parentNode = renderRoot, startNode, endNode } = {},
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
    return extend({}, this.data, this.state, this.instance);
  }

  // Overlay settings shadow signals so the renderer tracks settings reactively.
  // Applied after all spreads so Signals always win over plain duplicates.
  overlaySettingsSignals(context) {
    // subtemplates — overlay own settingsVars if declared, otherwise skip
    if (this.isSubtemplate()) {
      if (this.settingsVars && this.defaultSettings) {
        each(this.defaultSettings, (_, name) => {
          this.settings[name]; // ensure shadow signal exists
        });
        this.settingsVars.forEach((signal, name) => {
          context[name] = signal;
        });
      }
      return context;
    }
    // web component — overlay all settingsVars as Signals.
    // Signals are created when settings are accessed or mutated (including
    // by initialize()), so settingsVars is the authoritative set.
    const settingsVars = this.element?.settingsVars;
    const defaultSettings = this.element?.defaultSettings;
    const componentSpec = this.element?.componentSpec;
    if (settingsVars) {
      if (defaultSettings) {
        each(defaultSettings, (_, name) => {
          this.element.settings[name]; // ensure shadow signal exists
        });
      }
      // Also read spec attributes through the proxy so their Signals
      // are updated with current property values (e.g. active, size)
      if (componentSpec?.attributes) {
        each(componentSpec.attributes, (attribute) => {
          this.element.settings[attribute];
        });
      }
      settingsVars.forEach((signal, name) => {
        context[name] = signal;
      });
    }
    return context;
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
    let hasStyles = styles.some((style) => isEqual(style.cssRules, this.stylesheet.cssRules));

    if (!hasStyles) {
      this.renderRoot.adoptedStyleSheets = [
        ...this.renderRoot.adoptedStyleSheets,
        this.stylesheet,
      ];
    }
  }

  clone(settings) {
    const cloneDefaults = {
      templateName: this.templateName,
      element: this.element,
      ast: this.ast,
      css: this.css,
      defaultState: this.defaultState,
      defaultSettings: this.defaultSettings,
      events: this.events,
      keys: this.keys,
      renderingEngine: this.renderingEngine,
      subTemplates: this.subTemplates,
      onCreated: this.onCreatedCallback,
      onThemeChanged: this.onThemeChangedCallback,
      onRendered: this.onRenderedCallback,
      parentTemplate: this.parentTemplate,
      onDestroyed: this.onDestroyedCallback,
      createComponent: this.createComponent,
    };
    const templateSettings = {
      ...cloneDefaults,
      ...settings,
    };
    return new Template(templateSettings);
  }

  parseEventString(eventString) {
    // we want to allow 3 types of event syntax
    // 'deep eventType selector' - attach event to an
    // 'global eventType selector' - attach event to an element on the page
    // 'eventType selector' - bind to an element inside the web component
    let eventType = 'delegate';
    let keywords = ['deep', 'global', 'bind'];
    each(keywords, (keyword) => {
      // Require a word boundary so 'deepclick' isn't parsed as deep + 'click'.
      if (eventString.startsWith(keyword + ' ')) {
        eventString = eventString.slice(keyword.length);
        eventType = keyword;
      }
    });

    eventString = eventString.trim();

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
      if (bubbleMap[eventName]) {
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
    // parse out various syntax like `click, mousedown foo`, `click .foo, .bar`
    each(parts, (part, index) => {
      const value = part.replace(/(\,|\W)+$/, '').trim();
      const hasComma = part.includes(',');
      if (!addedEvents) {
        eventNames.push(getBubbledEvent(value));
        addedEvents = !hasComma;
      }
      else if (!addedSelectors) {
        const selectorParts = parts.slice(index).join(' ').split(',');
        each(selectorParts, (value) => {
          selectors.push(value.trim());
        });
        addedSelectors = true;
      }
    });
    each(eventNames, (eventName) => {
      // this event has no selectors which means it should occur on component
      if (!selectors.length) {
        selectors.push('');
      }
      each(selectors, (selector) => {
        events.push({ eventName, eventType, selector });
      });
    });
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

    // Cascade: if the template lifetime ends, abort events too.
    // The { signal } option auto-removes this listener when the event
    // controller is aborted (during removeEvents/reattach), preventing
    // listener accumulation across reattach cycles.
    this.abortSignal.addEventListener('abort', () => {
      this.eventController.abort();
    }, { signal: this.eventController.signal });

    if (!Template.isServer && this.onThemeChangedCallback !== noop) {
      // when the dark class is added or removed from <html>
      // we will fire theme changed
      const observer = new MutationObserver(this.onThemeChanged);
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class'],
      });
      this.observers.push(observer);

      // we will also fire the handler if onThemeChanged occurs on html
      $('html').on('themechange', (event) => {
        this.onThemeChanged({
          additionalData: {
            event: event,
            ...event.detail,
          },
        });
      }, { abortController: this.eventController });
    }

    each(events, (userHandler, eventString) => {
      const subEvents = this.parseEventString(eventString);
      const template = this;
      each(subEvents, (event) => {
        const { eventName, selector, eventType } = event;

        // BUG: iOS Safari will not bubble the touchstart / touchend events
        // if theres no handler on the actual element
        if (selector) {
          $(selector, { root: this.renderRoot }).on(eventName, noop, { abortController: this.eventController });
        }

        const eventHandler = function(event) {
          if (!inArray(eventType, ['deep', 'global']) && !template.isNodeInTemplate(event.target)) {
            return;
          }

          // check if event occured on a deep event handler and the handler type isnt 'deep'
          const isDeep = selector && $(event.target).closest(selector).length == 0;
          if (!inArray(eventType, ['deep', 'global']) && isDeep) {
            return;
          }

          // handle related target use case for special events
          if (
            inArray(eventName, ['mouseover', 'mouseout'])
            && event.relatedTarget
            && event.target.contains(event.relatedTarget)
          ) {
            return;
          }

          // prepare data for users event handler
          const targetElement = this;
          const boundEvent = userHandler.bind(targetElement);
          const eventData = event?.detail || {};
          // dataset is always stringified for atts, we want this as native values
          const elData = mapObject({ ...targetElement?.dataset }, (stringValue) => {
            let value;
            try {
              value = JSON.parse(stringValue);
            }
            catch (e) {
              value = stringValue;
            }
            return value;
          });
          const elValue = targetElement?.value ?? event.target?.value ?? event?.detail?.value;
          return template.call(boundEvent, {
            additionalData: {
              event: event,
              isDeep,
              target: targetElement,
              value: elValue,
              data: {
                ...elData,
                ...eventData,
              },
            },
          });
        };
        const domEventSettings = {};
        const eventSettings = { abortController: this.eventController, eventSettings: domEventSettings };

        // allow user to bind to global selectors if they opt in using the 'global' keyword
        // also allow events to be directly bound when opted in
        if (eventType == 'global') {
          $(selector || window).on(eventName, eventHandler, eventSettings);
        }
        else if (eventType == 'bind') {
          this.onRenderOnce = () => {
            this.$(selector).on(eventName, eventHandler, eventSettings);
            wrapFunction(this.onRenderOnce);
          };
        }
        else {
          if (selector) {
            $(this.renderRoot).on(eventName, selector, eventHandler, eventSettings);
          }
          else {
            // naked: bind on host so events on the host's own surface fire
            $(this.element).on(eventName, eventHandler, eventSettings);
          }
        }
      });
    });
  }

  removeEvents() {
    if (this.eventController) {
      this.eventController.abort('Template destroyed');
    }
  }

  removeObservers() {
    each(this.observers, (observer) => {
      observer.disconnect();
    });
  }

  bindKeys(keys = this.keys) {
    if (isServer) {
      return;
    }
    if (Object.keys(keys).length == 0) {
      return;
    }
    // gate prevents unbind/rebind cycles from stacking document listeners
    if (this.hasKeybindings) {
      return;
    }
    this.hasKeybindings = true;
    const sequenceTimeout = 500; // time in ms required between keypress
    const eventSettings = { abortController: this.eventController };
    this.currentSequence = '';
    $(document)
      .on('keydown', (event) => {
        const key = getKeyFromEvent(event);
        let repeatedKey = key == this.currentKey;
        this.currentKey = key;
        this.currentSequence += key;

        // check for key event
        each(this.keys, (handler, keySequence) => {
          keySequence = keySequence.replace(/\s*\+\s*/g, '+'); // remove space around +
          const keySequences = keySequence.split(',').map(s => s.trim()).filter(s => s.length > 0);
          if (any(keySequences, sequence => this.currentSequence.endsWith(sequence))) {
            const inputFocused = document.activeElement
              && (['input', 'select', 'textarea'].includes(document.activeElement.tagName.toLowerCase())
                || document.activeElement.isContentEditable);

            const eventResult = this.call(handler, {
              additionalData: {
                event: event,
                inputFocused,
                repeatedKey,
              },
            });
            if (eventResult !== true) {
              event.preventDefault();
            }
          }
        });

        // start next sequence
        this.currentSequence += ' ';

        // end sequence if not occuring in time
        clearTimeout(this.resetSequence);
        this.resetSequence = setTimeout(() => {
          this.currentSequence = '';
        }, sequenceTimeout);
      }, eventSettings)
      .on('keyup', (event) => {
        this.currentKey = '';
      }, eventSettings);
  }

  bindKey(key, callback) {
    if (!key || !callback) {
      return;
    }
    const needsInit = Object.keys(this.keys).length == 0;
    this.keys[key] = callback;
    if (needsInit) {
      this.bindKeys();
    }
  }

  unbindKey(key) {
    delete this.keys[key];
  }

  // Find the direct child of the renderRoot that is an ancestor of the event.target
  // then confirm position
  isNodeInTemplate(node) {
    const getRootChild = (node) => {
      while (node && node.parentNode !== this.parentNode) {
        if (node.parentNode === null && node.host) {
          node = node.host;
        }
        else {
          node = node.parentNode;
        }
      }
      return node;
    };
    const isNodeInRange = (
      node,
      startNode = this.startNode,
      endNode = this.endNode,
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
      const isAfterStart = (startComparison & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;
      const isBeforeEnd = (endComparison & Node.DOCUMENT_POSITION_PRECEDING) !== 0;
      return isAfterStart && isBeforeEnd;
    };
    return isNodeInRange(getRootChild(node));
  }

  render(additionalData = {}) {
    if (!this.initialized) {
      this.initialize();
    }
    const dataContext = extend({}, this.getDataContext(), additionalData);
    this.setDataContext(dataContext, { rerender: false });
    this.updateSubtemplateSettings(dataContext);

    this.overlaySettingsSignals(dataContext);
    this.renderer.setData(dataContext);

    // render will rerender the AST creating new html
    if (!this.rendered) {
      this.html = this.renderer.render();
      if (!isServer) {
        setTimeout(this.onRendered, 0);
      }
    }
    else if (this.dataReplaced) {
      // Data context was replaced — bump version to propagate changes.
      // Skip when only Signals changed (they notify Reactions directly).
      this.dataReplaced = false;
      this.renderer.bumpDataVersion();
    }
    this.markRendered();
    return this.html;
  }

  // Engine-facing: report that this template instance has been rendered to
  // its backing representation (DOM, string, etc.). Hydration paths and
  // future engines call this when they've taken render() into their own
  // hands rather than going through Template.render().
  markRendered() {
    this.rendered = true;
    this.destroyed = false;
  }

  markDestroyed() {
    this.rendered = false;
    this.destroyed = true;
    this.hasKeybindings = false;
    this._childTemplates = [];
  }

  /*******************************
             DOM Helpers
  *******************************/

  // Rendered DOM (either shadow or regular)
  $(selector, { root = this.renderRoot, filterTemplate = true, ...otherArgs } = {}) {
    if (!Template.isServer && inArray(selector, ['body', 'document', 'html'])) {
      root = document;
    }
    if (!root) {
      root = isClient ? document : globalThis;
    }
    if (root == this.renderRoot) {
      const $results = $(selector, { root, ...otherArgs });
      return filterTemplate
        ? $results.filter((node) => this.isNodeInTemplate(node))
        : $results;
    }
    else {
      return $(selector, { root, ...otherArgs });
    }
  }

  $$(selector, args) {
    return this.$(selector, { root: this.renderRoot, pierceShadow: true, filterTemplate: true, ...args });
  }

  // calls callback if defined with consistent params and this context
  call(func, { params, additionalData, firstArg, additionalArgs, thisContext } = {}) {
    if (this.isPrototype || !isFunction(func)) {
      return;
    }
    if (!params) {
      if (this.callParams) {
        params = additionalData
          ? { ...this.callParams, ...additionalData }
          : this.callParams;
      }
      else {
        // During initialize(), before _callParams is built
        params = this.buildCallParams(additionalData);
      }
    }
    const args = [params];
    if (additionalArgs) {
      args.push(...additionalArgs);
    }
    const context = thisContext !== undefined ? thisContext : this.element;
    return func.apply(context, args);
  }

  buildCallParams(additionalData = {}) {
    const element = this.element;
    const template = this;
    return {
      el: element,
      tpl: this.instance,
      self: this.instance,
      component: this.instance,
      $: this.$.bind(this),
      $$: this.$$.bind(this),
      reaction: this.reaction.bind(this),
      signal: this.signal.bind(this),
      interval: this.createInterval.bind(this),
      timeout: this.createTimeout.bind(this),
      abortSignal: this.abortSignal,
      afterFlush: Reaction.afterFlush,
      nonreactive: Reaction.nonreactive,
      flush: Reaction.flush,
      data: this.data,
      settings: this.settings || element?.settings,
      state: this.state,
      isRendered: () => this.rendered,
      isServer: Template.isServer,
      isClient: !Template.isServer,
      get isHydrating() {
        return template.isHydrating || false;
      },
      rerender: () => element?.requestUpdate(),
      dispatchEvent: this.dispatchEvent.bind(this),
      attachEvent: this.attachEvent.bind(this),
      bindKey: this.bindKey.bind(this),
      unbindKey: this.unbindKey.bind(this),
      abortController: this.abortController,
      helpers: TemplateHelpers,
      template: this,
      templateName: this.templateName,
      templates: Template.renderedTemplates,
      findTemplate: this.findTemplate,
      findParent: this.findParent.bind(this),
      findChild: this.findChild.bind(this),
      findChildren: this.findChildren.bind(this),
      content: this.instance.content,
      get darkMode() {
        return element?.isDarkMode?.();
      },
      ...additionalData,
    };
  }

  // 4th arg matches the native addEventListener shape (passive/capture/once/...);
  // querySettings is the only namespaced key.
  attachEvent(selector, eventName, eventHandler, { querySettings = { pierceShadow: true }, ...eventSettings } = {}) {
    return $(selector, document, querySettings).on(eventName, eventHandler, {
      abortController: this.abortController,
      returnHandler: true,
      eventSettings,
    });
  }

  // Returns a promise that resolves after the named lifecycle event fires.
  // One-shot events (created, rendered, destroyed) cache the resolved promise.
  // Recurring events (updated) return a fresh promise each call.
  lifecyclePromise(name) {
    if (!this.lifecyclePromises[name]) {
      this.lifecyclePromises[name] = new Promise(resolve => {
        this.lifecycleResolvers[name] = resolve;
      });
    }
    return this.lifecyclePromises[name];
  }

  resolveLifecyclePromise(eventName) {
    const resolve = this.lifecycleResolvers[eventName];
    if (resolve) {
      resolve();
      delete this.lifecycleResolvers[eventName];
    }
    if (eventName === 'updated') {
      // recurring — clear cache so next access creates a fresh promise
      delete this.lifecyclePromises[eventName];
    }
    else if (!this.lifecyclePromises[eventName]) {
      // one-shot fired without prior awaiter — cache an immediately-resolved
      // promise so late awaiters don't hang
      this.lifecyclePromises[eventName] = Promise.resolve();
    }
  }

  // dispatches an event from this template
  dispatchEvent(eventName, eventData, eventSettings, { triggerCallback = true } = {}) {
    if (Template.isServer) {
      return;
    }
    // call callback on DOM element if defined
    if (triggerCallback) {
      const callbackName = `on${capitalize(eventName)}`;
      const callback = this.element[callbackName];
      wrapFunction(callback).call(this.element, eventData);
    }

    return $(this.element).dispatchEvent(eventName, eventData, eventSettings);
  }

  /*******************************
        Subtemplate Settings
  *******************************/

  createSubtemplateSettings() {
    const template = this;
    const parentSettings = this.element?.settings;
    const ownSettings = {};
    template.settingsVars = new Map();

    // initialize from defaults
    each(this.defaultSettings, (value, name) => {
      ownSettings[name] = value;
    });

    // populate from passed data (reactiveData from parent)
    each(this.defaultSettings, (_, name) => {
      if (this.data[name] !== undefined) {
        ownSettings[name] = this.data[name];
      }
    });

    this.settings = new Proxy(ownSettings, {
      get: (target, property) => {
        if (typeof property === 'symbol') {
          return target[property];
        }
        // own settings first
        if (property in target) {
          let signal = template.settingsVars.get(property);
          if (!signal) {
            signal = new Signal(target[property], { allowClone: false });
            template.settingsVars.set(property, signal);
          }
          signal.get(); // track dependency
          return target[property];
        }
        // fall back to parent web component settings
        if (parentSettings) {
          return parentSettings[property];
        }
      },
      set: (target, property, value) => {
        target[property] = value;
        let signal = template.settingsVars.get(property);
        if (signal) {
          signal.set(value);
        }
        else {
          signal = new Signal(value, { allowClone: false });
          template.settingsVars.set(property, signal);
        }
        return true;
      },
    });
  }

  updateSubtemplateSettings(dataContext) {
    if (!this.settings || !this.defaultSettings) {
      return;
    }
    each(this.defaultSettings, (_, name) => {
      if (name in dataContext) {
        this.settings[name] = dataContext[name];
      }
    });
  }

  /*******************************
            Timers
  *******************************/

  createInterval(callback, ms) {
    const id = setInterval(callback, ms);
    this.abortSignal.addEventListener('abort', () => clearInterval(id));
    return id;
  }

  createTimeout(callback, ms) {
    const id = setTimeout(callback, ms);
    this.abortSignal.addEventListener('abort', () => clearTimeout(id));
    return id;
  }

  /*******************************
          Reactive Helpers
  *******************************/

  // reactions bound with this.reaction will be scoped to template
  // and be removed when the template is destroyed
  reaction(reaction) {
    this.reactions.push(Reaction.create(reaction));
  }

  signal(value, options) {
    return new Signal(value, options);
  }

  clearReactions() {
    each(this.reactions || [], (comp) => comp.stop());
  }

  /*******************************
          Template Helpers
  *******************************/

  findTemplate = (name) => Template.findTemplate(name);
  findParent = (name) => Template.findParentTemplate(this, name);
  findChild = (name) => Template.findChildTemplate(this, name);
  findChildren = (name) => Template.findChildTemplates(this, name);

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
    remove(templates, (thisTemplate) => thisTemplate.id == template.id);
    if (templates.length === 0) {
      Template.renderedTemplates.delete(template.templateName);
    }
    else {
      Template.renderedTemplates.set(template.templateName, templates);
    }
  }
  static getTemplates(templateName) {
    return Template.renderedTemplates.get(templateName) || [];
  }
  static findTemplate(templateName) {
    if (templateName == null) { return undefined; }
    templateName = kebabToCamel(templateName);
    const template = Template.getTemplates(templateName)[0];
    if (!template) {
      return undefined;
    }
    return {
      ...template.instance,
      ...template.data,
    };
  }
  static findParentTemplate(template, templateName) {
    templateName = kebabToCamel(templateName);
    // this matches on DOM (common)
    let match;
    const isMatch = (component) => {
      if (match || !component?.templateName) {
        return false;
      }
      if (templateName && component?.templateName !== templateName) {
        return false;
      }
      return true;
    };
    const getParent = (el) => {
      return el?.parentNode || el?.host;
    };

    if (!match) {
      let parentNode = getParent(template.element);
      while (parentNode) {
        if (isMatch(parentNode.component)) {
          match = {
            ...parentNode.component,
            ...parentNode.dataContext,
          };
          break;
        }
        parentNode = getParent(parentNode);
      }
    }
    // this matches on nested partials (less common)
    const seen = new Set();
    while (template && !seen.has(template)) {
      seen.add(template);
      template = template.parentTemplate;
      if (isMatch(template)) {
        match = {
          ...template.instance,
          ...template.data,
        };
        break;
      }
    }
    return match;
  }

  static findChildTemplates(template, templateName) {
    templateName = kebabToCamel(templateName);
    let result = [];

    const isMatch = (component) => {
      if (!component?.templateName) {
        return false;
      }
      if (templateName && component?.templateName !== templateName) {
        return false;
      }
      return true;
    };

    // First check DOM children (web components) - cascade downward
    if (template.element?.shadowRoot) {
      const traverseChildren = (node) => {
        if (node?.children) {
          for (const child of node.children) {
            if (child.component && isMatch(child.component)) {
              result.push({
                ...child.component,
                ...child.dataContext,
              });
            }
            // Recursively check nested children including their shadow roots
            traverseChildren(child);
            if (child.shadowRoot) {
              traverseChildren(child.shadowRoot);
            }
          }
        }
      };
      traverseChildren(template.element.shadowRoot);
    }

    // Then check subtemplate children (recursive lookup for nested partials)
    const visited = new Set();
    function search(childTemplates, templateName) {
      if (childTemplates) {
        childTemplates.forEach((childTemplate) => {
          if (visited.has(childTemplate)) { return; }
          visited.add(childTemplate);
          if (!templateName || (childTemplate.templateName === templateName)) {
            result.push({
              ...childTemplate.instance,
              ...childTemplate.data,
            });
          }
          search(childTemplate._childTemplates, templateName);
        });
      }
    }
    // Only search child templates, not the template itself
    search(template._childTemplates, templateName);
    return result;
  }
  static findChildTemplate(template, templateName) {
    return Template.findChildTemplates(template, templateName)[0];
  }
};
