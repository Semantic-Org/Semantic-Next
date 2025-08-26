import {
  adoptStylesheet,
  capitalize,
  clone,
  each,
  extend,
  isClassInstance,
  isFunction,
  isPlainObject,
  isString,
  keys,
  last,
  mapObject,
  noop,
  toTitleCase,
} from '@semantic-ui/utils';

export class Behavior {
  // Captures word characters inside curly braces: {title} -> "title"
  static TEMPLATING_REGEX = /\{(\w+)\}/g;

  constructor({
    name,

    namespace = name,

    // returns behavior instance
    createBehavior = noop,

    // event object
    events = {},

    // mutation observer object
    mutations = {},

    // setup() can pass through part of instance
    sharedBehavior = {},

    // $element to initialize
    $element,

    // $elements in group
    $elements,

    // css to be added to page
    css = '',

    // query instance attaching to (used to access namespace)
    Query,

    // allow el data to be specified in data attributes
    allowDataOverride = true,

    // callbacks
    onCreated = noop,
    onDestroyed = noop,

    // custom invocation fallback
    customInvocation = noop,

    // element index information
    elementIndex = 0,
    totalElements = 1,

    // logging
    logPerformance = false,
    logLevel = 'debug',

    // standard aliases
    selectors = {},
    classNames = {},
    errors = {},
    settings = {},
    templates = {},
  } = {}) {
    // we can recreate query from the constructor if not passed
    this.$ = (selector, options) => new $element.constructor(selector, options);
    this.Query = Query;

    this.$element = $element;
    this.$elements = $elements;
    this.element = $element.el();

    // handle run-time settings
    this.settings = settings;
    this.namespace = namespace;
    this.customInvocation = customInvocation;

    this.onCreated = onCreated;
    this.onDestroyed = onDestroyed;

    // store element index information
    this.elementIndex = elementIndex;
    this.totalElements = totalElements;

    this.classNames = classNames;
    this.selectors = selectors;
    this.errors = errors;
    this.templates = templates;
    this.mutations = mutations;

    this.logLevel = logLevel;
    this.logPerformance = logPerformance;

    // handle shared state across behaviors
    this.sharedBehavior = sharedBehavior;
    extend(this, sharedBehavior);

    if (css) {
      this.adoptStylesheet(css);
    }

    // allow html metadata to override settings like <div data-setting="new-setting">
    if (allowDataOverride) {
      this.addDataOverrides();
    }

    // use abort controllers for lifecycle teardown
    // <https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal>
    this.controller = new AbortController();

    // extend with methods from createBehavior
    const instance = this.call(createBehavior) || {};
    this.instance = instance;
    extend(this, instance);

    // destroy existing instance if exists
    if (this.element[namespace]?.destroy) {
      this.element[namespace]?.destroy();
    }

    // attach to dom
    this.element[namespace] = this;

    // attach events
    this.attachEvents(events);

    // attach mutation observers
    this.attachMutations(mutations);

    // allow initialize function as shorthand
    if (isFunction(instance.initialize)) {
      this.call(instance.initialize.bind(this));
    }
    this.call(this.onCreated);
  }

  adoptStylesheet(css) {
    // uses same constructed stylesheet across instances but needs to be in this elements root
    adoptStylesheet(css, this.element);
  }

  addDataOverrides(element = this.element) {
    const elementData = this.getElementData();
    each(this.settings, (value, name) => {
      if (elementData[name]) {
        this.settings[name] = elementData[name];
      }
    });
  }

  reinitialize(settings) {
    this.destroy();
    // css does not need to be added on reinit
    delete settings.css;
    const behavior = new Behavior(settings);
    this.element[this.namespace] = behavior;
  }

  // simple template parsing ({foo}, { foo: 'baz" }) => baz
  parseTemplate(templateString, data) {
    return templateString.replaceAll(Behavior.TEMPLATING_REGEX, (match, key) => {
      return data[key] || '';
    });
  }

  parseEventString(eventString) {
    // allow simple templating
    eventString = this.parseTemplate(eventString, {
      ...this.selectors,
      ...this.classNames,
      ...this.settings,
    });

    // allow keywords
    // 'delegate eventType selector' - bind to an element using event delegation
    // 'global eventType selector' - attach event to an element on the page
    // 'bind selector' - bind to an element directly
    let eventType = 'delegate';
    const keywords = ['global', 'bind'];
    each(keywords, (keyword) => {
      if (eventString.startsWith(keyword)) {
        eventString = eventString.replace(keyword, '');
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

  getElementData(element = this.element) {
    return mapObject({ ...element?.dataset }, (stringValue) => {
      let value;
      try {
        value = JSON.parse(stringValue);
      }
      catch (e) {
        value = stringValue;
      }
      return value;
    });
  }

  attachEvents(events = this.events) {
    each(events, (userHandler, eventString) => {
      const subEvents = this.parseEventString(eventString);
      const self = this;
      each(subEvents, (event) => {
        const { eventName, selector, eventType } = event;
        const eventHandler = function(event) {
          // prepare data for users event handler
          const targetElement = this;
          const boundEvent = userHandler.bind(targetElement);
          const eventData = event?.detail || {};
          // dataset is always stringified for atts, we want this as native values
          const elData = self.getElementData(targetElement);
          const elValue = targetElement?.value || event.target?.value || event?.detail?.value;
          self.call(boundEvent, {
            additionalData: {
              event: event,
              target: targetElement,
              value: elValue,
              data: {
                ...elData,
                ...eventData,
              },
            },
          });
        };

        const eventSettings = { abortController: this.controller };

        // allow user to bind to global selectors if they opt in using the 'global' keyword
        // also allow events to be directly bound when opted in
        if (!selector) {
          this.$element.on(eventName, eventHandler, eventSettings);
        }
        else if (eventType == 'global') {
          this.$(selector).on(eventName, eventHandler, eventSettings);
        }
        else if (eventType == 'delegate' && selector) {
          this.$(this.element).find(selector).on(eventName, eventHandler, eventSettings);
        }
        else {
          // default to event delegation
          this.$(this.element).on(eventName, selector, eventHandler, eventSettings);
        }
      });
    });
  }

  attachMutations(mutations = this.mutations) {
    if (!keys(this.mutations)) {
      return;
    }

    const $ = this.$; // shorthand

    // parse each mutation config for its observer config
    const mutationConfigs = [];
    each(mutations, (handler, mutationString) => {
      const mutationConfig = this.parseMutationString(mutationString);
      mutationConfigs.push({
        handler,
        ...mutationConfig,
      });
    });

    this.mutationObservers = [];
    each(mutationConfigs, ({ observedElement, observerOptions, keyword, selector, handler }) => {
      const observer = new MutationObserver((mutations) => {
        // determine if it matches
        let $added = $();
        let $removed = $();

        each(mutations, (mutation) => {
          const $matchingAdded = $(mutation.addedNodes).filter(selector);
          const $matchingRemoved = $(mutation.removedNodes).filter(selector);
          if ($matchingAdded.exists()) {
            $added = $added.add($matchingAdded);
          }
          if ($matchingRemoved.exists()) {
            $removed = $removed.add($matchingRemoved);
          }
        });

        // Check if we should trigger based on keyword
        const hasAdded = $added.exists();
        const hasRemoved = $removed.exists();
        const shouldTrigger = (keyword === 'add' && hasAdded)
          || (keyword === 'remove' && hasRemoved)
          || (keyword === 'standard' && (hasAdded || hasRemoved));

        if (shouldTrigger) {
          // call handler
          const callbackArgs = this.getMutationCallbackArgs(mutations, { $added, $removed });
          this.call(handler, { additionalParams: callbackArgs });
        }
      });

      observer.observe(observedElement, observerOptions);
      this.mutationObservers.push(observer);
    });
  }

  removeMutations() {
    each(this.mutationObservers, (observer) => {
      observer.disconnect();
    });
    this.mutationObservers = [];
  }

  parseMutationString(mutationString) {
    const keywords = ['observe', 'add', 'remove', 'attributes', 'text'];
    const observerOptions = {
      childList: true,
      subtree: true,
    };
    // handle templating
    const rawSelector = this.parseTemplate(mutationString, {
      ...this.selectors,
      ...this.classNames,
      ...this.settings,
    });

    let keyword = 'standard';
    let selector = rawSelector;
    let observedElement = this.element;

    each(keywords, (thisKeyword) => {
      if (mutationString.startsWith(thisKeyword)) {
        keyword = thisKeyword;
        selector = rawSelector.replace(keyword, '').trim();
      }
    });
    // handle different observers for diff types
    switch (keyword) {
      case 'observe':
        // Handle fat arrow syntax: "observe .container => .item"
        if (selector.includes('=>')) {
          const [observeSelector, filterSelector] = selector.split('=>').map(s => s.trim());
          observedElement = this.$element.find(observeSelector).el();
          selector = filterSelector;
        }
        else {
          observedElement = this.$element.find(selector).el();
        }
        break;
      case 'attributes':
        observerOptions.attributes = true;
        observerOptions.attributeOldValue = true;
        break;
      case 'text':
        observerOptions.characterData = true;
        observerOptions.characterDataOldValue = true;
        break;
    }
    return { observedElement, keyword, observerOptions, selector };
  }

  getMutationCallbackArgs(mutations, additionalData = {}) {
    const args = {
      ...additionalData,
      mutations,
      $target: this.$(mutations[0].target),
      target: mutations[0].target,
    };

    // if multiple updates in same microtask we only need last one
    const mutation = last(mutations);
    switch (mutation.type) {
      case 'attributes':
        args.attributeName = mutation.attributeName;
        args.newValue = mutation.target.getAttribute(mutation.attributeName);
        args.oldValue = mutation.oldValue;
        break;
      case 'characterData':
        args.newValue = mutation.target.textContent;
        args.oldValue = mutation.oldValue;
        break;
    }
    return args;
  }

  removeEvents() {
    if (this.controller) {
      this.controller.abort('behavior destroyed');
    }
  }

  dispatchEvent(
    eventName,
    detail = {},
    eventSettings = {},
    { element = this.element, namespace = this.namespace } = {},
  ) {
    // Auto-namespace if not already namespaced
    const namespacedEvent = eventName.includes(':')
      ? eventName
      : `${namespace}:${eventName}`;

    element.dispatchEvent(
      new CustomEvent(namespacedEvent, {
        detail,
        bubbles: true,
        cancelable: true,
        ...eventSettings,
      }),
    );
  }

  // dispatch an event across entire group
  dispatchGroupEvent(
    eventName,
    detail = {},
    eventSettings = {},
    { $elements = this.$elements, namespace = this.namespace } = {},
  ) {
    return $elements.get().forEach(element => {
      this.dispatchEvent(eventName, detail, eventSettings, { element, namespace });
    });
  }

  // Lookup method or property using natural language patterns (internal helper)
  lookup(query) {
    if (!query || !isString(query)) {
      return undefined;
    }

    const queryParts = query.split(/[\. ]/);
    const maxDepth = queryParts.length - 1;
    let currentObject = this;
    let found;

    each(queryParts, (value, depth) => {
      // Try camelCase conversion first (for multi-part names)
      const camelCaseValue = (depth !== maxDepth)
        ? value + capitalize(queryParts[depth + 1])
        : queryParts;

      if (isPlainObject(currentObject?.[camelCaseValue]) && (depth !== maxDepth)) {
        currentObject = currentObject[camelCaseValue];
      }
      else if (currentObject?.[camelCaseValue] !== undefined) {
        found = currentObject[camelCaseValue];
        return false; // Break out of each
      }
      else if (isPlainObject(currentObject?.[value]) && (depth !== maxDepth)) {
        currentObject = currentObject[value];
      }
      else if (currentObject?.[value] !== undefined) {
        found = currentObject[value];
        return false; // Break out of each
      }
      else {
        return false; // Break out of each - not found
      }
    });

    return found;
  }

  // invoke an internal method returned from createBehavior
  callMethod(query, ...methodArgs) {
    let found = this.lookup(query);
    let self = this.getSelf();
    if (isFunction(found)) {
      // Call method with instance as context
      return found.apply(self, methodArgs);
    }
    else if (found === undefined && this.customInvocation) {
      // Fallback when method not found
      found = this.call(this.customInvocation, {
        additionalParams: {
          methodName: query,
          methodArgs,
        },
      });
    }
    return found ?? undefined;
  }

  // Helper method for log level checking
  canLog(requiredLevel) {
    const levels = ['silent', 'error', 'warn', 'info', 'debug'];
    const currentLevel = levels.indexOf(this.logLevel || 'silent');
    const required = levels.indexOf(requiredLevel);
    return currentLevel >= required;
  }

  outputLog(level, consoleMethod, color, message, data) {
    if (!this.canLog(level)) { return; }
    const args = [
      `%c${toTitleCase(this.namespace)}%c ${message}`,
      `color: ${color}; font-weight: bold;`,
      'color: inherit;',
    ];
    if (data !== undefined) {
      args.push(data);
    }
    // args.push(this.element);
    console[consoleMethod](...args);
  }

  log(message, data) {
    this.outputLog('info', 'log', '#0066cc', message, data);
  }

  debug(message, data) {
    this.outputLog('debug', 'debug', '#666', message, data);
  }

  warn(message, data) {
    this.outputLog('warn', 'warn', '#ff9800', message, data);
  }

  error(message, data) {
    this.outputLog('error', 'error', '#f44336', message, data);

    // Optional: dispatch error event for handling
    this.dispatchEvent('behavior:error', {
      message,
      namespace: this.namespace,
      data,
    });
  }

  // Get or set individual setting
  setting(name, value) {
    if (value === undefined) {
      // Getter - return current value
      return this.settings[name];
    }
    // Setter - update value
    this.settings[name] = value;
    return this;
  }

  // Update multiple settings at once
  settings(newSettings) {
    if (newSettings === undefined) {
      // Getter - return all settings
      return this.settings;
    }
    // Setter - merge new settings
    extend(this.settings, newSettings);
    return this;
  }

  getSelf() {
    // always show for now for testing
    if (!this.logPerformance) {
      return this;
    }
    return new Proxy(this, {
      get(target, prop) {
        // dont proxy internals
        const skipProxy = ['constructor'];
        if (skipProxy.includes(prop) || prop.startsWith('_')) {
          return target[prop];
        }
        // dont proxy class instances
        if (isClassInstance(target[prop])) {
          return target[prop];
        }
        // dont proxy non-functions
        if (!isFunction(target[prop])) {
          return target[prop];
        }
        // wrap regular methods in performance tracking
        return (...args) => {
          const markName = `${target.namespace}:${prop}-start`;
          performance.mark(markName);
          const result = target[prop].apply(target, args);
          const measureName = `${target.namespace}:${prop}`;
          const endMarkName = `${target.namespace}:${prop}-end`;
          performance.mark(endMarkName);
          performance.measure(measureName, markName, endMarkName);
          return result;
        };
      },
    });
  }

  // calls callback if defined with consistent params and this context
  call(func, { params, additionalParams = {} } = {}) {
    const selfProxy = this.getSelf();
    const self = this;
    const args = [];
    if (!params) {
      params = {
        $: self.$,
        el: self.element,
        $el: self.$(self.element),
        self: selfProxy,
        abortSignal: this.controller,
        behavior: selfProxy,
        namespace: self.namespace,
        dispatchEvent: self.dispatchEvent.bind(this),
        dispatchGroupEvent: self.dispatchGroupEvent.bind(this),

        // Add logging functions
        log: self.log.bind(self),
        debug: self.debug.bind(self),
        warn: self.warn.bind(self),
        error: self.error.bind(self),

        // element index information
        index: self.elementIndex,
        total: self.totalElements,
        isFirst: self.elementIndex === 0,
        isLast: self.elementIndex === self.totalElements - 1,

        get cache() {
          let cache = self.Query.prototype[self.namespace].cache;
          if (!cache) {
            cache = self.Query.prototype[self.namespace].cache = {};
          }
          return cache;
        },
        get data() {
          return self.getElementData(self.element);
        },
        get selectors() {
          return self.selectors;
        },
        get templates() {
          return self.templates;
        },
        get errors() {
          return self.errors;
        },
        get classNames() {
          return self.classNames;
        },
        get settings() {
          return self.settings;
        },
        ...additionalParams,
      };
      args.push(params);
    }
    if (isFunction(func)) {
      return func.apply(self.element, args);
    }
  }

  destroy() {
    this.removeMutations();
    this.removeEvents();
    this.call(this.onDestroyed);
    delete this.element[this.namespace];
  }

  static getInstance(element, namespace) {
    return element[namespace];
  }

  // this allows for a setup() function to return values shared across behaviors
  static runSetup(setup = function(args) {}, { $elements, settings, templates } = {}) {
    const $ = (selector, options) => new $elements.constructor(selector, options);
    return setup({ $, settings, $elements, templates });
  }
}
