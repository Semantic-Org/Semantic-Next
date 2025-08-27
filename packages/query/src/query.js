import {
  camelToKebab,
  each,
  findIndex,
  firstMatch,
  get,
  hashCode,
  inArray,
  isArray,
  isClient,
  isDevelopment,
  isDOM,
  isFunction,
  isNumber,
  isObject,
  isPlainObject,
  isString,
  keys,
} from '@semantic-ui/utils';

/*
A minimal toolkit for querying and performing modifications
across DOM nodes based off a selector
*/

export class Query {
  /*
    This avoids keeping a copy of window/globalThis in
    memory when an element references the global object
    reducing memory footprint
  */
  static globalThisProxy = new Proxy({}, {
    get(target, prop) {
      return globalThis[prop];
    },
    set(target, prop, value) {
      globalThis[prop] = value;
      return true;
    },
  });

  static isDevelopment = isDevelopment;

  static logLevel = isDevelopment ? 'debug' : 'silent';

  static logPerformance = false;

  /*
    We clean up event handlers in two cases
    1) element is removed from dom
    2) reference to handler is removed from dom
  */
  static eventRegistry = new WeakMap(); // Key: Element, Value: Set<HandlerObject>
  static handlerRegistry = new WeakMap(); // Key: HandlerObject, Value: Element

  /*
    We keep a map to store registered behaviors
    This allows an end user to see available extensions
  */
  static behaviors = new Map();

  /*
    Cache for naturalDisplay() results per element
    Key: element, Value: { rulesHash, displayValue }
  */
  static elementDisplayCache = new WeakMap();

  constructor(selector, { root = document, pierceShadow = false, prevObject = null } = {}) {
    let elements = [];

    if (!root) {
      return;
    }

    // this is an existing query object
    if (selector instanceof Query) {
      elements = selector;
    }

    if (
      (selector === window || selector === globalThis) || inArray(selector, ['window', 'globalThis'])
      || selector == Query.globalThisProxy
    ) {
      // We dont want to store a copy of globalThis in each query instance
      elements = [Query.globalThisProxy];
      this.isBrowser = isClient;
      this.isGlobal = true;
    }
    else if (isArray(selector) || selector instanceof NodeList || selector instanceof HTMLCollection) {
      // Directly passed an array of elements
      selector = Array.from(selector);
      elements = selector;
    }
    else if (isString(selector)) {
      // this is html like $('<div/>')
      if (selector.trim().slice(0, 1) == '<') {
        const template = document.createElement('template');
        template.innerHTML = selector.trim();
        elements = Array.from(template.content.childNodes);
      }
      else {
        // Use querySelectorAll for normal selectors
        elements = (pierceShadow)
          ? this.querySelectorAllDeep(root, selector)
          : root.querySelectorAll(selector);
      }
    }
    else if (isDOM(selector)) {
      // A single Element, Document, or DocumentFragment is provided
      elements = [selector];
    }
    else if (selector instanceof NodeList) {
      // A NodeList is provided
      elements = selector;
    }
    this.selector = selector;
    this.length = elements.length;
    this.options = { root, pierceShadow };
    this.prevObject = prevObject;
    Object.assign(this, elements);
  }

  /* Returns a copy of current DOM Object */
  chain(elements) {
    return (this.isGlobal && !elements)
      ? new Query(globalThis, this.options)
      : new Query(elements, { ...this.options, prevObject: this });
  }

  end() {
    return this.prevObject || this;
  }

  /* we will add all elements across shadow root boundaries while matching
     intermediate selectors at shadow boundaries
  */
  querySelectorAllDeep(root, selector, includeRoot = true) {
    // Use a Set for automatic deduplication
    const elements = new Set();
    const domSelector = isDOM(selector);
    let domFound = false;
    let queriedRoot = false;

    // Add root if required
    if (includeRoot) {
      if (
        (domSelector && root == selector)
        || (!domSelector && root.matches && root.matches(selector))
      ) {
        elements.add(root);
      }
    }

    // Query from root
    if (domSelector) {
      queriedRoot = true;
    }
    else if (root.querySelectorAll) {
      root.querySelectorAll(selector).forEach(el => elements.add(el));
      queriedRoot = true;
    }

    const getRemainingSelector = (el, selector) => {
      const parts = selector.split(' ');
      let partialSelector;
      let remainingSelector;
      each(parts, (part, index) => {
        partialSelector = parts.slice(0, index + 1).join(' ');
        if (el.matches(partialSelector)) {
          remainingSelector = parts.slice(index + 1).join(' ');
          return;
        }
      });
      return remainingSelector || selector;
    };

    const addElements = (node, selector) => {
      if (domSelector && (node === selector || node.contains)) {
        if (node.contains(selector)) {
          elements.add(selector);
          domFound = true;
        }
      }
      else if (node.querySelectorAll) {
        // Directly add to Set without intermediate array
        node.querySelectorAll(selector).forEach(el => elements.add(el));
      }
    };

    const findElements = (node, selector, query) => {
      // Early termination condition for DOM selector search
      if (domSelector && domFound) { return; }

      // If root element didn't support querySelectorAll, query each child node
      if (query === true) {
        addElements(node, selector);
        queriedRoot = true;
      }

      // Process shadow roots
      if (node.nodeType === Node.ELEMENT_NODE && node.shadowRoot) {
        const newSelector = getRemainingSelector(node, selector);
        addElements(node.shadowRoot, newSelector);
        findElements(node.shadowRoot, newSelector, !queriedRoot);
      }

      // Process assigned nodes with direct for loop
      if (node.assignedNodes) {
        const newSelector = getRemainingSelector(node, selector);
        const nodes = node.assignedNodes();
        for (let i = 0; i < nodes.length; i++) {
          findElements(nodes[i], newSelector, queriedRoot);
        }
      }

      // Process child nodes with direct for loop
      if (node.childNodes && node.childNodes.length) {
        const childCount = node.childNodes.length;
        for (let i = 0; i < childCount; i++) {
          findElements(node.childNodes[i], selector, queriedRoot);
        }
      }
    };

    findElements(root, selector);

    // Convert Set to Array for return
    return Array.from(elements);
  }

  each(callback) {
    // "for" perf
    for (let index = 0; index < this.length; index++) {
      const el = this[index];
      const $el = this.chain(el);
      callback.call($el, el, index);
    }
    return this;
  }

  find(selector) {
    const elements = Array.from(this).flatMap((el) => {
      if (this.options.pierceShadow) {
        return this.querySelectorAllDeep(el, selector, false);
      }
      else {
        return Array.from(el.querySelectorAll(selector));
      }
    });
    return this.chain(elements);
  }

  parent(selector) {
    const parents = Array.from(this)
      .map((el) => el.parentElement)
      .filter(Boolean);
    return selector ? this.chain(parents).filter(selector) : this.chain(parents);
  }

  children(selector) {
    // Get all children of each element in the Query object
    const allChildren = Array.from(this).flatMap((el) => Array.from(el.children));

    // If a selector is provided, filter the children
    const filteredChildren = selector
      ? allChildren.filter((child) => child.matches(selector))
      : allChildren;

    return this.chain(filteredChildren);
  }

  siblings(selector) {
    const siblings = Array.from(this).flatMap((el) => {
      if (!el.parentNode) {
        return;
      }
      return Array.from(el.parentNode.children).filter((child) => child !== el);
    }).filter(Boolean);
    return selector ? this.chain(siblings).filter(selector) : this.chain(siblings);
  }

  // returns the index of element only including siblings that match a filter
  index(siblingFilter) {
    const el = this.el();
    if (!el?.parentNode) {
      return -1;
    }
    const $siblings = this.chain(el.parentNode.children).filter(siblingFilter);
    const siblingEls = $siblings.get();
    const els = this.get();
    return findIndex(siblingEls, el => inArray(el, els));
  }

  // returns the index of current collection that match filter
  indexOf(filter) {
    const els = this.get();
    const el = this.filter(filter).get(0);
    return els.indexOf(el);
  }

  filter(filter) {
    if (!filter) {
      return this;
    }
    let filteredElements = [];
    // If a function is provided, use it directly to filter elements
    if (isFunction(filter)) {
      filteredElements = Array.from(this).filter(filter);
    }
    else {
      // If a CSS selector is provided, use it with the matches method
      filteredElements = Array.from(this).filter((el) => {
        if (isString(filter)) {
          return el.matches && el.matches(filter);
        }
        else if (filter instanceof Query) {
          // If filter is a Query object, check if the element is in the Query's collection
          return filter.get().includes(el);
        }
        else {
          let els = isArray(filter)
            ? filter
            : [filter];
          return inArray(el, els);
        }
      });
    }
    return this.chain(filteredElements);
  }

  is(selector) {
    const filteredElements = Array.from(this).filter((el) => {
      if (typeof selector === 'string') {
        return el.matches && el.matches(selector);
      }
      else if (this.isGlobal) {
        return inArray(selector, ['window', 'globalThis']);
      }
      else {
        const elements = selector instanceof Query ? selector.get() : [selector];
        return elements.includes(el);
      }
    });
    return filteredElements.length === this.length;
  }

  not(selector) {
    // Filter out elements that match the provided selector
    const filteredElements = Array.from(this).filter((el) => {
      if (typeof selector === 'string') {
        return !el.matches || (el.matches && !el.matches(selector));
      }
      else if (this.isGlobal) {
        return !inArray(selector, ['window', 'globalThis']);
      }
      else {
        const elements = selector instanceof Query ? selector.get() : [selector];
        return !elements.includes(el);
      }
    });
    return this.chain(filteredElements);
  }

  contains(selector) {
    if (!selector || this.length === 0) {
      return false;
    }

    // Get the target element(s) to check containment for
    let targets = [];
    if (isString(selector)) {
      if (this.options.pierceShadow) {
        // Use deep query to find targets across shadow boundaries
        targets = Array.from(this).flatMap(el => this.querySelectorAllDeep(el, selector, false));
      }
      else {
        // Use standard query within each element
        targets = Array.from(this).flatMap(el => Array.from(el.querySelectorAll(selector)));
      }
    }
    else if (selector instanceof Query) {
      targets = selector.get();
    }
    else if (isDOM(selector)) {
      targets = [selector];
    }
    else {
      return false;
    }

    if (targets.length === 0) {
      return false;
    }

    // Check if any element in the Query collection contains any of the targets
    return Array.from(this).some(el => {
      return targets.some(target => {
        if (this.options.pierceShadow) {
          // Use deep containment check for Shadow DOM
          return this.containsDeep(el, target);
        }
        else {
          // Use native contains method
          return el.contains && el.contains(target);
        }
      });
    });
  }

  containsDeep(container, target) {
    if (!container || !target) {
      return false;
    }

    // Check direct containment first
    if (container.contains && container.contains(target)) {
      return true;
    }

    // Check within shadow roots
    if (container.shadowRoot) {
      if (this.containsDeep(container.shadowRoot, target)) {
        return true;
      }
    }

    // Check children recursively
    if (container.children) {
      for (let child of container.children) {
        if (this.containsDeep(child, target)) {
          return true;
        }
      }
    }

    return false;
  }

  closest(selector, { returnAll = false } = {}) {
    const allResults = [];

    Array.from(this).forEach((el) => {
      if (this.options.pierceShadow) {
        const matches = this.closestDeep(el, selector, { returnAll });
        if (returnAll) {
          allResults.push(...matches);
        }
        else if (matches) {
          allResults.push(matches);
        }
      }
      else if (selector && el?.closest) {
        if (returnAll) {
          // Walk up DOM tree using native closest() efficiently
          let current = el.parentElement;
          while (current) {
            const match = current.closest(selector);
            if (match) {
              allResults.push(match);
              // Continue from the parent of the match to find more ancestors
              current = match.parentElement;
            }
            else {
              break;
            }
          }
        }
        else {
          const match = el.closest(selector);
          if (match) {
            allResults.push(match);
          }
        }
      }
      else if (this.isGlobal && inArray(selector, ['window', 'globalThis'])) {
        allResults.push(Query.globalThisProxy);
      }
    });

    // Remove duplicates if returnAll is true
    const results = returnAll ? Array.from(new Set(allResults)) : allResults;
    return this.chain(results);
  }

  closestAll(selector) {
    return this.closest(selector, { returnAll: true });
  }

  closestDeep(element, selector, { returnAll = false } = {}) {
    let currentElement = element;
    const domSelector = isDOM(selector);
    const stringSelector = isString(selector);
    const matches = [];

    while (currentElement) {
      if ((domSelector && currentElement === selector) || (stringSelector && currentElement.matches(selector))) {
        if (returnAll) {
          matches.push(currentElement);
        }
        else {
          return currentElement;
        }
      }
      if (currentElement.parentElement) {
        currentElement = currentElement.parentElement;
      }
      else if (currentElement.parentNode && currentElement.parentNode.host) {
        currentElement = currentElement.parentNode.host;
      }
      else {
        break;
      }
    }

    return returnAll ? matches : undefined;
  }

  ready(handler) {
    if (this.is(document) && document.readyState == 'loading') {
      this.on('ready', handler);
    }
    else {
      handler.call(document, new Event('DOMContentLoaded'));
    }
    return this;
  }

  getEventAlias(eventName) {
    // support some more friendly names
    const aliases = {
      ready: 'DOMContentLoaded',
    };
    return aliases[eventName] || eventName;
  }

  getEventArray(eventNames) {
    return eventNames.split(' ')
      .map(name => {
        const alias = this.getEventAlias(name);
        if (alias.startsWith('.')) {
          // Pure namespaces like '.foo' or '.foo.bar'
          const namespaces = alias.slice(1).split('.');
          return { eventName: null, namespaces };
        }
        const parts = alias.split('.');
        const eventName = parts[0];
        const namespaces = parts.slice(1);
        return { eventName, namespaces: namespaces.length ? namespaces : null };
      })
      .filter(Boolean);
  }

  on(eventNames, targetSelectorOrHandler, handlerOrOptions, options) {
    const eventHandlers = [];

    let handler;
    let targetSelector;
    if (isObject(handlerOrOptions)) {
      // event with options  $('foo').one('click', fn, options);
      options = handlerOrOptions;
      handler = targetSelectorOrHandler;
    }
    else if (isString(targetSelectorOrHandler)) {
      // event delegation $('foo').one('click', '.baz', fn);
      targetSelector = targetSelectorOrHandler;
      handler = handlerOrOptions;
    }
    else if (isFunction(targetSelectorOrHandler)) {
      // event handler $('foo').one('click', fn);
      handler = targetSelectorOrHandler;
    }

    const events = this.getEventArray(eventNames);

    // we store a reference using a set of weakmaps
    // this allows us to properly gc handlers but still remove them properly
    const registerEvent = ({ el, eventHandler }) => {
      const elementHandlers = Query.eventRegistry.get(el) || new Set();
      elementHandlers.add(eventHandler);
      Query.eventRegistry.set(el, elementHandlers); // for $('div').off();
      Query.handlerRegistry.set(eventHandler, el); // for $('div').off(handler);
    };

    events.forEach(({ eventName, namespaces }) => {
      const abortController = options?.abortController || new AbortController();
      const eventSettings = options?.eventSettings || {};
      const signal = abortController.signal;
      this.each((el) => {
        let delegateHandler;
        if (targetSelector) {
          delegateHandler = (event) => {
            let target;
            // if this event is composed from a web component
            // this is required to get the original path
            if (event.composed && event.composedPath) {
              // look through composed path bubbling into the attached element to see if any match target
              let path = event.composedPath();
              const elIndex = findIndex(path, thisEl => thisEl == el);
              path = path.slice(0, elIndex);
              target = path.find(el => el instanceof Element && el.matches && el.matches(targetSelector));
            }
            else {
              // target selector is target
              target = event.target.closest(targetSelector);
            }

            if (target) {
              // If a matching target is found, call the handler with the correct context
              handler.call(target, event);
            }
          };
        }
        const eventListener = delegateHandler || handler;

        // will cause illegal invocation if used from proxy object
        const domEL = (el == Query.globalThisProxy) ? globalThis : el;
        if (domEL.addEventListener) {
          domEL.addEventListener(eventName, eventListener, { signal, ...eventSettings });
        }

        const eventHandler = {
          el,
          eventName,
          namespaces,
          eventListener,
          abortController,
          delegated: targetSelector !== undefined,
          handler,
          abort: (reason) => abortController.abort(reason),
        };
        eventHandlers.push(eventHandler);
        registerEvent({ el, eventHandler });
      });
    });

    if (options?.returnHandler) {
      return eventHandlers.length == 1 ? eventHandlers[0] : eventHandlers;
    }
    return this;
  }

  one(eventName, targetSelectorOrHandler, handlerOrOptions, options) {
    let handler;
    let targetSelector;
    if (isObject(handlerOrOptions)) {
      // event with options  $('foo').one('click', fn, options);
      options = handlerOrOptions;
      handler = targetSelectorOrHandler;
    }
    else if (isString(targetSelectorOrHandler)) {
      // event delegation $('foo').one('click', '.baz', fn);
      targetSelector = targetSelectorOrHandler;
      handler = handlerOrOptions;
    }
    else if (isFunction(targetSelectorOrHandler)) {
      // event handler $('foo').one('click', fn);
      handler = targetSelectorOrHandler;
    }

    // We add a custom abort controller so that we can remove all events at once
    options = options || {};
    const abortController = new AbortController();
    options.abortController = abortController;
    const wrappedHandler = (...args) => {
      abortController.abort();
      handler.apply(this, args);
    };
    return (targetSelector)
      ? this.on(eventName, targetSelector, wrappedHandler, options)
      : this.on(eventName, wrappedHandler, options);
  }

  onNext(eventName, targetSelectorOrOptions, options) {
    return new Promise((resolve, reject) => {
      let targetSelector;

      // Handle parameter overloading
      if (isString(targetSelectorOrOptions)) {
        targetSelector = targetSelectorOrOptions;
      }
      else if (isObject(targetSelectorOrOptions)) {
        options = targetSelectorOrOptions;
      }

      // Extract timeout if specified
      const timeout = options?.timeout;
      let timeoutId;

      // Set up timeout if specified
      if (timeout) {
        timeoutId = setTimeout(() => {
          // Clean up event listener
          this.off(eventName, handler);
          reject(new Error(`Event '${eventName}' timeout after ${timeout}ms`));
        }, timeout);
      }

      // Event handler that resolves the promise
      const handler = (event) => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        resolve(event);
      };

      // Use one() to automatically remove after first trigger
      if (targetSelector) {
        this.one(eventName, targetSelector, handler, options);
      }
      else {
        this.one(eventName, handler, options);
      }
    });
  }

  off(eventNames, handler) {
    if (isFunction(eventNames)) {
      handler = eventNames;
    }

    // actually handle removing an event handler
    const removeHandler = (handler, el = handler?.el) => {
      const elementHandlers = Query.eventRegistry.get(el);

      // this is an exact handler to match
      if (isFunction(handler) && el) {
        const handlerFunc = handler;
        handler = firstMatch(elementHandlers, thisHandler => thisHandler.handler === handlerFunc);
      }

      // use abort signal to remove from element
      handler.abort();

      // remove from handler registry
      Query.handlerRegistry.delete(handler);

      // remove from el registry
      if (elementHandlers) {
        elementHandlers?.delete(handler);
        if (elementHandlers.size === 0) {
          Query.eventRegistry.delete(el);
        }
      }
    };

    // Scenario 1: Remove handler by passing handler object
    // i.e. { handler, abort } // etc
    if (isPlainObject(handler)) {
      removeHandler(handler);
      return this;
    }

    // Scenario 2: Remove by name or namespace or initial handler function
    const events = eventNames
      ? this.getEventArray(eventNames)
      : [{ eventName: null, namespaces: null }];

    this.each(el => {
      const elementHandlers = Query.eventRegistry.get(el);

      // nothing to remove
      if (!elementHandlers) {
        return;
      }

      elementHandlers.forEach(eventHandler => {
        // Check if this handler should be removed based on event/namespace match.
        const shouldRemove = events.some(({ eventName, namespaces }) => {
          const eventMatches = !eventName || eventHandler.eventName === eventName;
          const sameNamespace = !namespaces
            || (eventHandler.namespaces && namespaces.every(ns => eventHandler.namespaces.includes(ns)));
          const handlerMatches = !handler
            || eventHandler.handler === handler
            || eventHandler === handler;
          return eventMatches && sameNamespace && handlerMatches;
        });

        if (shouldRemove) {
          removeHandler(eventHandler, el);
        }
      });
    });

    return this;
  }

  trigger(eventName, eventSettings) {
    return this.each(el => {
      if (typeof el.dispatchEvent !== 'function') {
        return;
      }
      // trigger native handler
      if (isFunction(el[eventName])) {
        el[eventName]();
        return;
      }
      const event = new CustomEvent(eventName, { bubbles: true, cancelable: true, composed: true, ...eventSettings });
      el.dispatchEvent(event);
    });
  }

  // shorthand for most common trigger() uses
  click(eventSettings) {
    return this.trigger('click', eventSettings);
  }
  submit(eventSettings) {
    return this.trigger('requestSubmit', eventSettings);
  }

  dispatchEvent(eventName, eventData = {}, eventSettings = {}) {
    const eventOptions = {
      bubbles: true,
      cancelable: true,
      composed: true,
      detail: eventData,
      ...eventSettings,
    };
    this.each(el => {
      const event = new CustomEvent(eventName, eventOptions);
      el.dispatchEvent(event);
    });
    return this;
  }

  remove() {
    return this.each((el) => el.remove());
  }

  addClass(classNames) {
    if (!classNames) {
      return this;
    }
    const classesToAdd = classNames.trim().split(' ');
    return this.each((el) => el.classList.add(...classesToAdd));
  }

  removeClass(classNames) {
    if (!classNames) {
      return this;
    }
    const classesToRemove = classNames.trim().split(' ');
    return this.each((el) => el.classList.remove(...classesToRemove));
  }

  toggleClass(classNames) {
    if (!classNames) {
      return this;
    }
    const classesToToggle = classNames.trim().split(' ');
    return this.each((el) => el.classList.toggle(...classesToToggle));
  }

  hasClass(className) {
    return Array.from(this).some((el) => el.classList.contains(className));
  }

  html(newHTML) {
    if (newHTML !== undefined) {
      return this.each((el) => (el.innerHTML = newHTML));
    }
    else if (this.length > 0) {
      return this.map(el => el.innerHTML || el.nodeValue).join('');
    }
  }

  outerHTML(newHTML) {
    if (newHTML !== undefined) {
      return this.each((el) => (el.outerHTML = newHTML));
    }
    else if (this.length) {
      return this.map(el => el.outerHTML).join('');
    }
  }

  getSlot(name) {
    return this.map((el) => {
      if (el.tagName.toLowerCase() == 'slot' && (!name || el.name == name)) {
        // called directly on a matching slot
        const nodes = el.assignedNodes({ flatten: true });
        if (nodes) {
          return this.chain(nodes).html();
        }
      }
      else if (el.shadowRoot) {
        // Component has shadow DOM, query assigned slot nodes
        const slotSelector = name ? `slot[name="${name}"]` : 'slot:not([name])';
        const slot = el.shadowRoot.querySelector(slotSelector);
        if (slot) {
          const nodes = slot.assignedNodes({ flatten: true });
          if (nodes) {
            return this.chain(nodes).html();
          }
        }
      }
      else {
        // No shadow DOM, fallback to direct DOM querying
        const slotSelector = name ? `[slot="${name}"]` : ':not([slot])';
        return this.chain(el).find(slotSelector).html();
      }
    }).join('');
  }

  setSlot(nameOrHTML, newHTML) {
    // Determine if we're dealing with a named slot or default slot based on arguments
    let name;
    if (newHTML) {
      name = nameOrHTML;
    }
    else {
      newHTML = nameOrHTML;
    }

    return this.each((el) => {
      // find host web component
      if (el.tagName.toLowerCase() == 'slot') {
        el = el.getRootNode().getRootNode()?.host;
      }
      const $el = this.chain(el);
      if (name) {
        const slotSelector = `[slot="${name}"]`;
        let $slottedElement = this.chain(el).find(slotSelector);
        if (!$slottedElement.exists()) {
          // Slot element does not exist, create a new one
          $el.append(`<span slot="${name}"></span>`);
          $slottedElement = this.chain(el).find(slotSelector);
        }
        $slottedElement.html(newHTML);
      }
      else {
        // Default slot updates the entire element content
        $el.html(newHTML);
      }
    });
  }

  text(newText) {
    if (newText !== undefined) {
      return this.each((el) => (el.textContent = newText));
    }
    else {
      const childNodes = (el) => {
        return el.nodeName === 'SLOT'
          ? el.assignedNodes({ flatten: true })
          : el.childNodes;
      };
      const values = this.map((el) => this.getTextContentRecursive(childNodes(el)));
      return values.length > 1 ? values : values[0];
    }
  }

  // Helper function to recursively get text content
  getTextContentRecursive(nodes) {
    return Array.from(nodes)
      .map((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          return node.nodeValue;
        }
        else if (node.nodeName === 'SLOT') {
          // If the node is a slot, retrieve its assigned nodes
          const slotNodes = node.assignedNodes({ flatten: true });
          return this.getTextContentRecursive(slotNodes);
        }
        else {
          return this.getTextContentRecursive(node.childNodes);
        }
      })
      .join('')
      .trim();
  }

  // non jquery variant to return only immediate text node
  textNode() {
    return Array.from(this)
      .map((el) => {
        return Array.from(el.childNodes)
          .filter((node) => node.nodeType === Node.TEXT_NODE)
          .map((node) => node.nodeValue)
          .join('');
      })
      .join('');
  }

  map(...args) {
    return Array.from(this).map(...args);
  }

  value(newValue) {
    const usesValue = (el) => {
      return el instanceof HTMLInputElement
        || el instanceof HTMLSelectElement
        || el instanceof HTMLTextAreaElement
        // web components may store value
        || customElements.get(el.tagName.toLowerCase());
    };
    if (newValue !== undefined) {
      // Set the value for each element
      return this.each((el) => {
        if (usesValue(el)) {
          el.value = newValue;
        }
      });
    }
    else {
      // Get the value of each element
      const values = this.map((el) => {
        if (usesValue(el)) {
          return el.value;
        }
        return undefined;
      });
      return values.length > 1 ? values : values[0];
    }
  }
  // alias
  val(...args) {
    return this.value(...args);
  }

  focus() {
    if (this.length) {
      this[0].focus();
    }
    return this;
  }
  blur() {
    if (this.length) {
      this[0].blur();
    }
    return this;
  }

  css(property, value = null, settings = { includeComputed: false }) {
    const elements = Array.from(this);
    // Setting a value or multiple values
    if (isPlainObject(property) || value !== null) {
      if (isPlainObject(property)) {
        Object.entries(property).forEach(([prop, val]) => {
          elements.forEach((el) => el.style.setProperty(camelToKebab(prop), val));
        });
      }
      else {
        elements.forEach((el) => el.style.setProperty(camelToKebab(property), value));
      }
      return this; // Return the Query instance for chaining
    }
    else {
      // Getting a value
      if (elements?.length) {
        const styles = elements.map((el) => {
          const inlineStyle = el.style[property];
          if (settings.includeComputed) {
            // return computed style if requested
            return window.getComputedStyle(el).getPropertyValue(property); // Return computed style if allowed
          }
          if (inlineStyle) {
            // Return inline style if present
            return inlineStyle;
          }
          return undefined; // If includeComputed is false, return undefined
        });
        return elements.length === 1 ? styles[0] : styles;
      }
    }
  }

  computedStyle(property) {
    return this.css(property, null, { includeComputed: true });
  }

  cssVar(variable, value = null) {
    return this.css(`--${variable}`, value, { includeComputed: true });
  }

  attr(attribute, value) {
    if (isPlainObject(attribute)) {
      // Handle object of attribute-value pairs
      Object.entries(attribute).forEach(([attr, val]) => {
        this.each((el) => el.setAttribute(attr, val));
      });
      return this;
    }
    else if (value !== undefined) {
      // Handle single attribute-value pair
      return this.each((el) => el.setAttribute(attribute, value));
    }
    else if (this.length) {
      const attributes = this.map((el) => el.getAttribute(attribute));
      return attributes.length > 1 ? attributes : attributes[0];
    }
  }

  removeAttr(attributeName) {
    return this.each((el) => el.removeAttribute(attributeName));
  }

  el() {
    return this.get(0);
  }

  get(index) {
    if (index !== undefined) {
      return this[index];
    }
    else {
      return Array.from(this);
    }
  }

  eq(index) {
    return this.chain(this[index]);
  }

  first() {
    return this.eq(0);
  }

  last() {
    return this.eq(this.length - 1);
  }

  prop(name, value) {
    if (value !== undefined) {
      // Set the property value for each element
      return this.each(el => {
        el[name] = value;
      });
    }
    else {
      // Get the property value from elements
      if (this.length == 0) {
        return undefined;
      }
      else if (this.length === 1) {
        return this[0][name];
      }
      else {
        return this.map(el => el[name]);
      }
    }
  }

  next(selector) {
    const nextSiblings = this.map((el) => {
      let nextSibling = el.nextElementSibling;
      while (nextSibling) {
        if (!selector || nextSibling.matches(selector)) {
          return nextSibling;
        }
        nextSibling = nextSibling.nextElementSibling;
      }
      return null;
    }).filter(Boolean);

    return this.chain(nextSiblings);
  }

  prev(selector) {
    const prevSiblings = this.map((el) => {
      let prevSibling = el.previousElementSibling;
      while (prevSibling) {
        if (!selector || prevSibling.matches(selector)) {
          return prevSibling;
        }
        prevSibling = prevSibling.previousElementSibling;
      }
      return null;
    }).filter(Boolean);

    return this.chain(prevSiblings);
  }

  height(value, options = {}) {
    const defaultOptions = {
      includeMargin: false,
      includePadding: false,
      includeBorder: false,
    };

    // If first argument is an object (settings), treat it as options for getter
    if (isPlainObject(value)) {
      options = value;
      value = undefined; // No value to set
    }

    // Merge with defaults
    const { includeMargin, includePadding, includeBorder } = {
      ...defaultOptions,
      ...options,
    };

    // Setter: ignore options, just set height
    if (value !== undefined) {
      return this.each(el => {
        el.style.height = typeof value === 'number' ? `${value}px` : value;
      });
    }

    // Getter: calculate height based on options
    if (this.length === 0) {
      return undefined;
    }

    const heights = this.map(el => {
      // Handle window/global object special case
      if (el === Query.globalThisProxy) {
        return window.innerHeight;
      }

      // box-sizing agnostic: measure actual rendered dimensions, not CSS interpretations
      let height = el.offsetHeight; // content + padding + border (total height)

      // Get computed style for all calculations
      const computedStyle = window.getComputedStyle(el);
      const paddingTop = parseFloat(computedStyle.paddingTop) || 0;
      const paddingBottom = parseFloat(computedStyle.paddingBottom) || 0;
      const borderTop = parseFloat(computedStyle.borderTopWidth) || 0;
      const borderBottom = parseFloat(computedStyle.borderBottomWidth) || 0;
      const marginTop = parseFloat(computedStyle.marginTop) || 0;
      const marginBottom = parseFloat(computedStyle.marginBottom) || 0;

      // Start with total height and subtract what we don't want
      height -= borderTop + borderBottom; // Remove border to get content + padding

      if (!includePadding) {
        height -= paddingTop + paddingBottom; // Remove padding to get content only
      }

      if (includeBorder) {
        height += borderTop + borderBottom; // Add border back
      }

      if (includeMargin) {
        height += marginTop + marginBottom; // Add margin
      }

      return height;
    });

    return this.length === 1 ? heights[0] : heights;
  }

  width(value, options) {
    const defaultOptions = {
      includeMargin: false,
      includePadding: false,
      includeBorder: false,
    };

    // If first argument is an object (settings), treat it as options for getter
    if (isPlainObject(value)) {
      options = value;
      value = undefined; // No value to set
    }

    // Get settings
    const { includeMargin, includePadding, includeBorder } = {
      ...defaultOptions,
      ...options,
    };

    // Setter: ignore options, just set width
    if (value !== undefined) {
      return this.each(el => {
        el.style.width = typeof value === 'number' ? `${value}px` : value;
      });
    }

    // Getter: calculate width based on options
    if (this.length === 0) {
      return undefined;
    }

    const widths = this.map(el => {
      // Handle window/global object special case
      if (el === Query.globalThisProxy) {
        return window.innerWidth;
      }

      // box-sizing agnostic: measure actual rendered dimensions, not CSS interpretations
      let width = el.offsetWidth; // content + padding + border (total width)

      // Get computed style for all calculations
      const computedStyle = window.getComputedStyle(el);
      const paddingLeft = parseFloat(computedStyle.paddingLeft) || 0;
      const paddingRight = parseFloat(computedStyle.paddingRight) || 0;
      const borderLeft = parseFloat(computedStyle.borderLeftWidth) || 0;
      const borderRight = parseFloat(computedStyle.borderRightWidth) || 0;
      const marginLeft = parseFloat(computedStyle.marginLeft) || 0;
      const marginRight = parseFloat(computedStyle.marginRight) || 0;

      // Start with total width and subtract what we don't want
      width -= borderLeft + borderRight; // Remove border to get content + padding

      if (!includePadding) {
        width -= paddingLeft + paddingRight; // Remove padding to get content only
      }

      if (includeBorder) {
        width += borderLeft + borderRight; // Add border back
      }

      if (includeMargin) {
        width += marginLeft + marginRight; // Add margin
      }

      return width;
    });

    return this.length === 1 ? widths[0] : widths;
  }

  innerWidth() {
    return this.width({ includePadding: true });
  }

  innerHeight() {
    return this.height({ includePadding: true });
  }

  outerWidth({ includeMargin = false } = {}) {
    return this.width({ includePadding: true, includeBorder: true, includeMargin });
  }

  outerHeight({ includeMargin = false } = {}) {
    return this.height({ includePadding: true, includeBorder: true, includeMargin });
  }

  scrollHeight(value) {
    const el = (this.isGlobal && this.isBrowser) ? this.chain(document.documentElement) : this;
    return el.prop('scrollHeight', value);
  }

  scrollWidth(value) {
    const el = (this.isGlobal && this.isBrowser) ? this.chain(document.documentElement) : this;
    return el.prop('scrollWidth', value);
  }

  scrollLeft(value) {
    const el = (this.isGlobal && this.isBrowser) ? this.chain(document.documentElement) : this;
    return el.prop('scrollLeft', value);
  }

  scrollTop(value) {
    const el = (this.isGlobal && this.isBrowser) ? this.chain(document.documentElement) : this;
    return el.prop('scrollTop', value);
  }

  clone() {
    const fragment = document.createDocumentFragment();
    this.each((el) => {
      fragment.appendChild(el.cloneNode(true));
    });
    return this.chain(fragment.childNodes);
  }

  reverse() {
    const els = this.get().reverse();
    return this.chain(els);
  }

  insertContent(target, content, position) {
    // Handle string content (text or HTML)
    if (isString(content)) {
      target.insertAdjacentHTML(position, content);
      return;
    }

    const $content = this.chain(content);
    const insertElement = (el) => {
      if (target.insertAdjacentElement) {
        return target.insertAdjacentElement(position, el);
      }
      else {
        switch (position) {
          case 'beforebegin':
            target.parentNode?.insertBefore(el, target);
            return el;
          case 'afterbegin':
            target.insertBefore(el, target.firstChild);
            return el;
          case 'beforeend':
            target.appendChild(el);
            return el;
          case 'afterend':
            target.parentNode?.insertBefore(el, target.nextSibling);
            return el;
        }
      }
      return el;
    };

    const insertedElements = $content.map(el => {
      if (el instanceof DocumentFragment) {
        return Array.from(el.childNodes).map(insertElement);
      }
      else {
        return insertElement(el);
      }
    }).flat();

    return this.chain(insertedElements);
  }

  before(...allContent) {
    return this.each((el) => {
      each(allContent, content => {
        this.insertContent(el, content, 'beforebegin');
      });
    });
  }
  insertBefore(selector) {
    this.chain(selector).each((el) => {
      this.insertContent(el, this, 'beforebegin');
    });
    return this;
  }

  append(...allContent) {
    return this.each((el) => {
      each(allContent, content => {
        this.insertContent(el, content, 'beforeend');
      });
    });
  }
  appendTo(selector) {
    const $targets = this.chain(selector);
    const numTargets = $targets.length;
    $targets.each((el, index) => {
      const isLast = index === numTargets - 1;
      const content = isLast ? this : this.clone();
      this.insertContent(el, content, 'beforeend');
    });
    return this;
  }

  prepend(...allContent) {
    return this.each((el) => {
      each(allContent, content => {
        this.insertContent(el, content, 'afterbegin');
      });
    });
  }
  prependTo(selector) {
    const $targets = this.chain(selector);
    const numTargets = $targets.length;
    $targets.each((el, index) => {
      const isLast = index === numTargets - 1;
      const content = isLast ? this : this.clone();
      this.insertContent(el, content, 'afterbegin');
    });
    return this;
  }

  after(...allContent) {
    return this.each((el) => {
      each(allContent, content => {
        this.insertContent(el, content, 'afterend');
      });
    });
  }
  insertAfter(selector) {
    const $targets = this.chain(selector);
    const numTargets = $targets.length;
    $targets.each((el, index) => {
      const isLast = index === numTargets - 1;
      const content = isLast ? this : this.clone();
      this.insertContent(el, content, 'afterend');
    });
    return this;
  }

  detach() {
    return this.each((el) => {
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      }
    });
  }

  naturalWidth() {
    const widths = this.map((el) => {
      const $clone = this.chain(el.cloneNode(true));
      $clone
        .insertAfter(el)
        .css({
          position: 'absolute',
          display: 'block',
          transform: 'translate(-9999px, -9999px)',
          zIndex: '-1',
        });
      const naturalWidth = $clone.width();
      $clone.remove();
      return naturalWidth;
    });
    return widths.length > 1 ? widths : widths[0];
  }

  naturalHeight() {
    const height = this.map((el) => {
      const $clone = this.chain(el).clone();
      $clone
        .insertAfter(el)
        .css({
          position: 'absolute',
          display: 'block',
          transform: 'translate(-9999px, -9999px)',
          zIndex: '-1',
        });
      const naturalHeight = $clone.height();
      $clone.remove();
      return naturalHeight;
    });
    return height.length > 1 ? height : height[0];
  }

  naturalDisplay({ calculate = true } = {}) {
    // store style hash across map
    let styleHash;
    if (calculate) {
      styleHash = Array.from(document.styleSheets).map(sheet => {
        try {
          return { href: sheet.href, title: sheet.title, disabled: sheet.disabled };
        }
        catch (e) {
          // Cross-origin stylesheet - can't access properties safely
          return { crossOrigin: true, index: Array.from(document.styleSheets).indexOf(sheet) };
        }
      });
    }

    const displays = this.map((el, index) => {
      // FAST PATH: if an inline style is applied return this
      let inlineDisplay = el.style.display;
      if (inlineDisplay && inlineDisplay !== 'none') {
        return inlineDisplay;
      }

      let cacheKey;
      let rulesHash;

      // CALCULATED PATH: check stylesheets for highest specificity display state
      if (calculate) {
        // Include inline display style in cache key since it overrides everything
        cacheKey = { styleHash, inlineDisplay };
        rulesHash = hashCode(cacheKey);

        // FAST PATH: Skip stylesheet check, if rules are same
        const cached = Query.elementDisplayCache.get(el);
        if (cached && cached.rulesHash === rulesHash) {
          return cached.displayValue;
        }

        // MEDIUM PATH: If already visible, return current display
        const computedDisplay = getComputedStyle(el).display;
        if (computedDisplay !== 'none') {
          Query.elementDisplayCache.set(el, { rulesHash, displayValue: computedDisplay });
          return computedDisplay;
        }

        // SLOW PATH: Start parsing rules to determine display type
        const matchingRules = [];

        // Calculate CSS specificity (simplified)
        const calculateSpecificity = (selector) => {
          // Remove quoted strings to avoid counting selectors inside quotes
          const cleaned = selector.replace(/"[^"]*"/g, '').replace(/'[^']*'/g, '');
          const ids = (cleaned.match(/#[\w-]+/g) || []).length * 100;
          const classes = (cleaned.match(/\.[\w-]+/g) || []).length * 10;
          const attrs = (cleaned.match(/\[[^\]]+\]/g) || []).length * 10;
          const pseudoClasses = (cleaned.match(/:[\w-]+/g) || []).length * 10;
          const elements = (cleaned.match(/\b[a-z][\w-]*/gi) || []).length * 1;
          return ids + classes + attrs + pseudoClasses + elements;
        };

        // Helper to recursively parse CSS rules (handles nesting)
        const parseRules = (rules, parentSelector = '') => {
          for (const rule of rules) {
            // Handle regular style rules
            if (
              rule.style?.display
              && rule.style.display !== 'none' // IGNORE ALL none rules
              && rule.selectorText
            ) {
              // Resolve nested selector by replacing & with parent
              let resolvedSelector = rule.selectorText;
              if (parentSelector && resolvedSelector.includes('&')) {
                resolvedSelector = resolvedSelector.replace(/&/g, parentSelector);
              }

              if (el.matches(resolvedSelector)) {
                matchingRules.push({
                  display: rule.style.display,
                  specificity: calculateSpecificity(resolvedSelector),
                  sourceOrder: matchingRules.length,
                });
              }
            }
            // Recursively handle nested rules (CSS nesting)
            if (rule.cssRules && rule.cssRules.length > 0) {
              const nestedParent = parentSelector || rule.selectorText;
              parseRules(rule.cssRules, nestedParent);
            }
          }
        };

        // Parse all stylesheets for matching rules
        for (const sheet of document.styleSheets) {
          try {
            parseRules(sheet.cssRules);
          }
          catch (e) {
            // Cross-origin stylesheets - ignore
          }
        }

        // Sort by specificity, then source order
        matchingRules.sort((a, b) => b.specificity - a.specificity || b.sourceOrder - a.sourceOrder);

        // If we have matching rules, return the highest precedence value
        if (matchingRules.length > 0) {
          const displayValue = matchingRules[0].display;
          Query.elementDisplayCache.set(el, { rulesHash, displayValue });
          return displayValue;
        }
      }

      // BACKUP Path: Use natural display type for browsers based off a lookup table
      const naturalDisplay = {
        inline: [
          'a',
          'abbr',
          'b',
          'bdi',
          'bdo',
          'br',
          'cite',
          'code',
          'dfn',
          'em',
          'i',
          'kbd',
          'mark',
          'q',
          'ruby',
          'samp',
          'small',
          'span',
          'strong',
          'sub',
          'sup',
          'time',
          'u',
          'var',
          'wbr',
        ],
        'inline-block': ['button', 'img', 'input', 'meter', 'object', 'progress', 'select', 'textarea'],
        'table': ['table'],
        'table-row': ['tr'],
        'table-cell': ['td', 'th'],
        'table-header-group': ['thead'],
        'table-row-group': ['tbody'],
        'table-footer-group': ['tfoot'],
        'table-caption': ['caption'],
        'table-column': ['col'],
        'table-column-group': ['colgroup'],
        'list-item': ['li'],
      };

      const tagName = el.tagName.toLowerCase();
      let displayValue;
      for (const [display, tags] of Object.entries(naturalDisplay)) {
        if (tags.includes(tagName)) {
          displayValue = display;
          break;
        }
      }
      displayValue = displayValue || 'block'; // Default for most elements

      // Cache the result if we are calculating
      if (calculate) {
        Query.elementDisplayCache.set(el, { rulesHash, displayValue });
      }

      return displayValue;
    });
    return displays.length > 1 ? displays : displays[0];
  }

  // this is the element that clips current element
  clippingParent() {
    const parents = this.map((el) => {
      let current = el.parentNode;
      while (current) {
        if (current instanceof Element) {
          const style = window.getComputedStyle(current);

          // Check overflow
          if (style.overflowX !== 'visible' || style.overflowY !== 'visible') {
            return current;
          }

          // Check contain property (layout, paint, size, strict)
          const contain = style.contain;
          if (
            contain
            && (contain.includes('paint') || contain.includes('layout') || contain.includes('size')
              || contain.includes('strict'))
          ) {
            return current;
          }

          // Check clip-path
          if (style.clipPath && style.clipPath !== 'none') {
            return current;
          }

          // Check mask/mask-image
          if ((style.mask && style.mask !== 'none') || (style.maskImage && style.maskImage !== 'none')) {
            return current;
          }
        }
        current = current.parentNode;
      }
      return document.documentElement;
    });
    return this.chain(parents);
  }

  // this is the parent element where top/left and offsetTop/left will be relative
  containingParent({ calculate = true } = {}) {
    const parents = this.map((el) => {
      // return offset parent as reported by browser
      if (!calculate) {
        return el.offsetParent;
      }

      let current = el.parentNode;
      while (current) {
        if (current instanceof Element) {
          const style = window.getComputedStyle(current);
          // transformed elements create new positioning context
          if (style.position !== 'static') {
            return current;
          }
          // filter creates new positioning context
          if (style.filter !== 'none') {
            return current;
          }
          // transformed elements create new positioning context
          if (style.transform !== 'none') {
            return current;
          }
          // also creates positioning context
          if (['layout', 'paint', 'strict', 'content'].includes(style.contain)) {
            return current;
          }
          // will change will trigger same context
          // <https://issues.chromium.org/issues/41131675>
          if (['filter', 'contain', 'transform'].includes(style.willChange)) {
            return current;
          }
        }
        current = current.parentNode;
      }
      return document.body;
    });
    return this.chain(parents);
  }

  // alias
  count() {
    return this.length;
  }
  exists() {
    return this.length > 0;
  }

  isVisible({ includeOpacity = false, includeVisibility = true } = {}) {
    if (this.length === 0) {
      return undefined;
    }
    // Return true only if ALL elements are visible
    return this.map(el => {
      const rect = el.getBoundingClientRect();
      const hasDimensions = rect.width > 0 && rect.height > 0;

      if (!hasDimensions) { return false; }

      const style = window.getComputedStyle(el);

      // Check intentional hiding methods
      if (includeVisibility) {
        if (style.visibility === 'hidden') { return false; }
        if (style.contentVisibility === 'hidden') { return false; }
      }

      // Check optional hiding mechanisms
      if (includeOpacity) {
        return parseFloat(style.opacity) > 0;
      }

      return true;
    }).every(result => result === true);
  }

  // adds properties to an element after dom loads
  initialize(settings) {
    document.addEventListener('DOMContentLoaded', () => {
      this.settings(settings);
    });
    return this;
  }

  settings(settings) {
    return this.each((el) => {
      each(settings, (value, setting) => {
        el[setting] = value;
      });
    });
  }

  setting(setting, value) {
    if (value === undefined) {
      const settings = this.map(el => el[setting]);
      return (settings.length == 1)
        ? settings[0]
        : settings;
    }
    return this.each((el) => {
      el[setting] = value;
    });
  }

  data(key, value) {
    // Set data attribute
    if (value !== undefined) {
      return this.each(el => {
        if (el.dataset) {
          el.dataset[key] = value;
        }
      });
    }

    // Get single data attribute
    if (key !== undefined) {
      if (this.length === 0) {
        return undefined;
      }
      const values = this.map(el => get(el, `dataset.${key}`));
      return this.length === 1
        ? values[0]
        : values;
    }

    // Get all data attributes
    if (this.length === 0) {
      return undefined;
    }
    const allData = this.map(el => {
      const data = {};
      if (el.dataset) {
        each(keys(el.dataset), k => {
          data[k] = el.dataset[k];
        });
      }
      return data;
    });

    // return array only if more than one el
    return (this.length === 1)
      ? allData[0]
      : allData;
  }

  slice(start, end) {
    if (this.length === 0) {
      return this;
    }
    const slicedElements = Array.from(this).slice(start, end);
    return this.chain(slicedElements);
  }

  add(selector) {
    if (!selector) {
      return this;
    }

    // Get current elements
    const currentElements = this.get();

    // Create new Query object with the selector using same options
    const $newElements = new Query(selector, this.options);

    // If no new elements found, return current instance
    if ($newElements.length === 0) {
      return this;
    }

    // Combine arrays and remove duplicates using Set
    const combinedElements = Array.from(new Set([...currentElements, ...$newElements.get()]));
    return this.chain(combinedElements);
  }

  show({ calculate = true } = {}) {
    return this.each(function(el) {
      const naturalDisplayValue = this.naturalDisplay({ calculate });
      el.style.display = naturalDisplayValue || '';
    });
  }

  hide() {
    return this.css('display', 'none');
  }

  toggle({ calculate = true } = {}) {
    return this.each(function(el) {
      const isHidden = getComputedStyle(el).display === 'none';
      if (isHidden) {
        const naturalDisplayValue = this.naturalDisplay({ calculate });
        el.style.display = naturalDisplayValue || '';
      }
      else {
        el.style.display = 'none';
      }
    });
  }

  bounds() {
    if (this.length === 0) {
      return undefined;
    }
    const rects = this.map(el => el.getBoundingClientRect());
    return this.length === 1 ? rects[0] : rects;
  }

  dimensions() {
    if (this.length === 0) {
      return undefined;
    }
    const results = this.map(el => {
      // Handle window/global object special case
      if (el === Query.globalThisProxy) {
        const boxValues = { top: 0, right: 0, bottom: 0, left: 0 };
        return {
          top: 0,
          left: 0,
          right: window.innerWidth,
          bottom: window.innerHeight,
          pageTop: window.scrollY,
          pageLeft: window.scrollX,
          width: window.innerWidth,
          innerWidth: window.innerWidth,
          outerWidth: window.innerWidth,
          marginWidth: window.innerWidth,
          height: window.innerHeight,
          innerHeight: window.innerHeight,
          outerHeight: window.innerHeight,
          marginHeight: window.innerHeight,
          scrollTop: window.scrollY,
          scrollLeft: window.scrollX,
          scrollHeight: document.documentElement.scrollHeight,
          scrollWidth: document.documentElement.scrollWidth,
          box: { padding: boxValues, border: boxValues, margin: boxValues },
        };
      }

      const rect = el.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(el);

      // --- Position Properties ---
      const top = rect.top;
      const left = rect.left;
      const pageTop = top + window.scrollY;
      const pageLeft = left + window.scrollX;

      // --- Box Model Values ---
      const paddingTop = parseFloat(computedStyle.paddingTop) || 0;
      const paddingBottom = parseFloat(computedStyle.paddingBottom) || 0;
      const paddingLeft = parseFloat(computedStyle.paddingLeft) || 0;
      const paddingRight = parseFloat(computedStyle.paddingRight) || 0;

      const borderTop = parseFloat(computedStyle.borderTopWidth) || 0;
      const borderBottom = parseFloat(computedStyle.borderBottomWidth) || 0;
      const borderLeft = parseFloat(computedStyle.borderLeftWidth) || 0;
      const borderRight = parseFloat(computedStyle.borderRightWidth) || 0;

      const marginTop = parseFloat(computedStyle.marginTop) || 0;
      const marginBottom = parseFloat(computedStyle.marginBottom) || 0;
      const marginLeft = parseFloat(computedStyle.marginLeft) || 0;
      const marginRight = parseFloat(computedStyle.marginRight) || 0;

      // --- Width Properties ---
      const outerWidth = el.offsetWidth;
      const innerWidth = outerWidth - borderLeft - borderRight;
      const width = innerWidth - paddingLeft - paddingRight;
      const marginWidth = outerWidth + marginLeft + marginRight;

      // --- Height Properties ---
      const outerHeight = el.offsetHeight;
      const innerHeight = outerHeight - borderTop - borderBottom;
      const height = innerHeight - paddingTop - paddingBottom;
      const marginHeight = outerHeight + marginTop + marginBottom;

      return {
        // Position
        top,
        left,
        right: rect.right,
        bottom: rect.bottom,
        pageTop,
        pageLeft,
        // Width
        width,
        innerWidth,
        outerWidth,
        marginWidth,
        // Height
        height,
        innerHeight,
        outerHeight,
        marginHeight,
        // Scroll
        scrollTop: el.scrollTop,
        scrollLeft: el.scrollLeft,
        scrollHeight: el.scrollHeight,
        scrollWidth: el.scrollWidth,
        // Box Model Details
        box: {
          padding: { top: paddingTop, right: paddingRight, bottom: paddingBottom, left: paddingLeft },
          border: { top: borderTop, right: borderRight, bottom: borderBottom, left: borderLeft },
          margin: { top: marginTop, right: marginRight, bottom: marginBottom, left: marginLeft },
        },
      };
    });

    return this.length === 1 ? results[0] : results;
  }

  collidesWith(selector) {
    if (this.length === 0 || !selector) {
      return false;
    }

    const $targets = this.chain(selector);
    if ($targets.length === 0) {
      return false;
    }

    const sourceRects = this.map(el => el.getBoundingClientRect());
    const targetRects = $targets.map(el => el.getBoundingClientRect());

    // Check if any source rectangle collides with any target rectangle
    return sourceRects.some(sourceRect => {
      return targetRects.some(targetRect => {
        // Standard AABB (Axis-Aligned Bounding Box) collision detection
        return (
          sourceRect.left < targetRect.right
          && sourceRect.right > targetRect.left
          && sourceRect.top < targetRect.bottom
          && sourceRect.bottom > targetRect.top
        );
      });
    });
  }

  pagePosition({ precision = 'pixel' } = {}) {
    if (this.length === 0) {
      return undefined;
    }
    const results = this.map(el => {
      const rect = el.getBoundingClientRect();
      const round = val => (precision === 'pixel' ? Math.round(val) : val);

      // Page position is simply the viewport position plus the current scroll offset
      const top = rect.top + window.scrollY;
      const left = rect.left + window.scrollX;

      return {
        top: round(top),
        left: round(left),
      };
    });
    return this.length === 1 ? results[0] : results;
  }

  position({
    relativeTo,
    top,
    left,
    precision = 'pixel',
    type,
  } = {}) {
    // Determine if the function is being used as a setter.
    const isSetter = (isNumber(top) || isNumber(left));

    // avoid querySelector inside map
    let relativeEl = (relativeTo)
      ? this.chain(relativeTo).el()
      : undefined;

    // fail clearly if relative el does not exist
    if (relativeTo && !relativeEl) {
      return (isSetter)
        ? this
        : undefined;
    }

    if (!isSetter) {
      // getter
      const results = this.map(el => {
        const $el = this.chain(el);
        const elRect = el.getBoundingClientRect();
        const round = val => (precision === 'pixel' ? Math.round(val) : val);

        // 1. Global (Viewport) Coordinates
        const globalCoords = {
          top: round(elRect.top),
          left: round(elRect.left),
        };
        if (type === 'global') {
          return globalCoords;
        }

        // 2. Local (containingParent) Coordinates
        const containingParent = $el.containingParent().el();
        let localCoords = { ...globalCoords }; // Fallback if no parent
        if (containingParent) {
          const parentRect = containingParent.getBoundingClientRect();
          localCoords = {
            top: round(elRect.top - parentRect.top),
            left: round(elRect.left - parentRect.left),
          };
        }
        if (type === 'local') {
          return localCoords;
        }

        // 3. Relative Coordinates
        let relativeCoords = null;
        if (relativeEl) {
          const relativeRect = relativeEl.getBoundingClientRect();
          relativeCoords = {
            top: round(elRect.top - relativeRect.top),
            left: round(elRect.left - relativeRect.left),
          };
          if (type === 'relative') {
            return relativeCoords;
          }
        }

        // Return all coordinates if no specific type was requested
        const result = {
          global: globalCoords,
          local: localCoords,
        };
        if (relativeCoords) {
          result.relative = relativeCoords;
        }
        return result;
      });

      // Return a single object if the collection has only one element.
      return this.length === 1 ? results[0] : results;
    }
    else {
      // setter
      this.each(function(el) {
        const $el = this;
        const referenceEl = relativeEl
          ? relativeEl
          : $el.containingParent().el();
        if (!referenceEl) {
          return;
        }
        const referenceRect = referenceEl.getBoundingClientRect();
        const offsetParent = el.offsetParent; // Native offsetParent is still needed for style calculation
        if (!offsetParent) {
          return;
        }
        const offsetParentRect = offsetParent.getBoundingClientRect();
        const parentStyle = window.getComputedStyle(offsetParent);

        const targetTop = referenceRect.top + (top || 0);
        const targetLeft = referenceRect.left + (left || 0);

        const parentBorderTop = parseFloat(parentStyle.borderTopWidth) || 0;
        const parentBorderLeft = parseFloat(parentStyle.borderLeftWidth) || 0;

        const newStyleTop = targetTop - offsetParentRect.top - parentBorderTop;
        const newStyleLeft = targetLeft - offsetParentRect.left - parentBorderLeft;

        if (isNumber(top)) {
          el.style.top = `${newStyleTop}px`;
        }
        if (isNumber(left)) {
          el.style.left = `${newStyleLeft}px`;
        }
      });
      return this;
    }
  }

  isInViewport({ threshold = 0, fully = false } = {}) {
    if (this.length === 0) {
      return false;
    }

    // Check if ALL elements in the collection meet the viewport criteria
    return this.map(el => {
      const rect = el.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const viewportWidth = window.innerWidth || document.documentElement.clientWidth;

      // If fully is true, it overrides the threshold
      if (fully) {
        return (
          rect.top >= 0
          && rect.left >= 0
          && rect.bottom <= viewportHeight
          && rect.right <= viewportWidth
        );
      }

      if (threshold > 0) {
        // Calculate the area of intersection
        const intersectionLeft = Math.max(0, rect.left);
        const intersectionTop = Math.max(0, rect.top);
        const intersectionRight = Math.min(viewportWidth, rect.right);
        const intersectionBottom = Math.min(viewportHeight, rect.bottom);

        const intersectionWidth = intersectionRight - intersectionLeft;
        const intersectionHeight = intersectionBottom - intersectionTop;

        if (intersectionWidth <= 0 || intersectionHeight <= 0) {
          return false;
        }

        const intersectionArea = intersectionWidth * intersectionHeight;
        const elementArea = rect.width * rect.height;

        return (intersectionArea / elementArea) >= threshold;
      }

      // Default behavior: check if any part of the element is visible
      return (
        rect.top < viewportHeight
        && rect.bottom > 0
        && rect.left < viewportWidth
        && rect.right > 0
      );
    }).every(result => result === true);
  }

  // special helper for SUI components
  component() {
    const components = this.map(el => el.component).filter(Boolean);
    return components.length > 1 ? components : components[0];
  }
  dataContext() {
    const contexts = this.map(el => el.dataContext).filter(Boolean);
    return contexts.length > 1 ? contexts : contexts[0];
  }
}
