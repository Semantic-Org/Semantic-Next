import { isPlainObject, isString, isArray, isDOM, isFunction, findIndex, inArray, isClient, isObject, each } from '@semantic-ui/utils';

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

  /*
    We keep an array of event handlers for teardown
  */
  static eventHandlers = [];

  constructor(selector, { root = document, pierceShadow = false } = {}) {
    let elements = [];

    if (!root) {
      return;
    }
    if((selector === window || selector === globalThis) || inArray(selector, ['window', 'globalThis']) || selector == Query.globalThisProxy) {
      // We dont want to store a copy of globalThis in each query instance
      elements = [Query.globalThisProxy];
      this.isBrowser = isClient;
      this.isGlobal = true;
    }
    else if (isArray(selector)) {
      // Directly passed an array of elements
      elements = selector;
    }
    else if (isString(selector)) {
      if (selector.slice(0, 1) == '<') {
        const template = document.createElement('template');
        template.innerHTML = selector.trim();
        elements = Array.from(template.content.childNodes);
      } else {
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
    Object.assign(this, elements);
  }

  chain(elements) {
    return (this.isGlobal)
      ? new Query(globalThis, this.options)
      : new Query(elements, this.options)
    ;
  }

  /* Note this is a naive implementation for performance reasons
     we will add all elements across shadow root boundaries but without
     matching complex selectors that would match ACROSS shadow root boundaries
  */
  querySelectorAllDeep(root, selector, includeRoot = true) {
    let elements = [];
    let domSelector = isDOM(selector);
    let domFound = false;
    let queriedRoot;


    // add root if required
    if (includeRoot) {
      if(domSelector && root == selector) {
        elements.push(root);
      }
      else if(root.matches && root.matches(selector)) {
        elements.push(root);
      }
    }

    // query from root
    if(domSelector) {
      queriedRoot = true;
    }
    else if(root.querySelectorAll) {
      elements.push(...root.querySelectorAll(selector));
      queriedRoot = true;
    }
    else {
      queriedRoot = false;
    }

    const addElements = (node) => {
      if(domSelector && (node === selector || node.contains)) {
        if(node.contains(selector)) {
          elements.push(selector);
          domFound = true;

        }
      }
      else if(node.querySelectorAll) {
        elements.push(...node.querySelectorAll(selector));
      }
    };

    const findElements = (node, query) => {

      // if we are querying for a DOM element we can stop searching once we've found it
      if(domFound) {
        return;
      }

      // if root element did not support querySelectorAll
      // we query each child node then stop
      if(query === true) {
        addElements(node);
        queriedRoot = true;
      }

      // query at each shadow root
      if (node.nodeType === Node.ELEMENT_NODE && node.shadowRoot) {
        addElements(node.shadowRoot);
        findElements(node.shadowRoot, !queriedRoot);
      }

      if(node.assignedNodes) {
        node.assignedNodes().forEach((node) => findElements(node, queriedRoot));
      }
      if (node.childNodes.length) {
        node.childNodes.forEach((node) => findElements(node, queriedRoot));
      }
    };
    findElements(root);
    return [...new Set(elements)];
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

  removeAllEvents() {
    Query.eventHandlers = [];
  }

  find(selector) {
    const elements = Array.from(this).flatMap((el) => {
      if (this.options.pierceShadow) {
        return this.querySelectorAllDeep(el, selector, false);
      } else {
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
    const allChildren = Array.from(this).flatMap((el) =>
      Array.from(el.children)
    );

    // If a selector is provided, filter the children
    const filteredChildren = selector
      ? allChildren.filter((child) => child.matches(selector))
      : allChildren;

    return this.chain(filteredChildren);
  }

  siblings(selector) {
    const siblings = Array.from(this).flatMap((el) => {
      if(!el.parentNode) {
        return;
      }
      return Array.from(el.parentNode.children).filter((child) => child !== el);
    }).filter(Boolean);
    return selector ? this.chain(siblings).filter(selector) : this.chain(siblings);
  }

  index(indexFilter) {
    if(indexFilter) {
      // if we are passed in a filter we are just grabbing el position
      const els = this.get();
      const el = this.filter(indexFilter).get(0);
      return els.indexOf(el);
    }
    else {
      // if we aren't we are grabbing sibling position
      const $siblings = this.parent().children();
      const siblingEls = $siblings.get();
      const els = this.get();
      return findIndex(siblingEls, el => inArray(el, els));
    }
  }

  filter(filter) {
    let filteredElements = [];
    // If a function is provided, use it directly to filter elements
    if (isFunction(filter)) {
      filteredElements = Array.from(this).filter(filter);
    }
    else {
      // If a CSS selector is provided, use it with the matches method
      filteredElements = Array.from(this).filter((el) => {
        if(isString(filter)) {
          return el.matches && el.matches(filter);
        }
        else {
          let els = isFunction(filter.get)
            ? filter.get()
            : isArray(filter)
              ? filter
              : [ filter]
          ;
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
      } else {
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
      } else {
        const elements = selector instanceof Query ? selector.get() : [selector];
        return !elements.includes(el);
      }
    });
    return this.chain(filteredElements);
  }

  closest(selector) {
    const closest = Array.from(this).map((el) => {
      if (this.options.pierceShadow) {
        return this.closestDeep(el, selector);
      }
      else {
        return el.closest(selector);
      }
    }).filter(Boolean);

    return this.chain(closest);
  }

  closestDeep(element, selector) {
    let currentElement = element;
    const domSelector = isDOM(selector);
    const stringSelector = isString(selector);
    while (currentElement) {
      if ((domSelector && currentElement === selector) || (stringSelector && currentElement.matches(selector))) {
        return currentElement;
      }
      if (currentElement.parentElement) {
        currentElement = currentElement.parentElement;
      }
      else if (currentElement.parentNode && currentElement.parentNode.host) {
        currentElement = currentElement.parentNode.host;
      }
      else {
        return;
      }
    }
    return;
  }

  on(event, targetSelectorOrHandler, handlerOrOptions, options) {
    const eventHandlers = [];

    let handler;
    let targetSelector;
    if (isObject(handlerOrOptions)) {
      options = handlerOrOptions;
      handler = targetSelectorOrHandler;
    }
    else if (isString(targetSelectorOrHandler)) {
      targetSelector = targetSelectorOrHandler;
      handler = handlerOrOptions;
    }
    else if (isFunction(targetSelectorOrHandler)) {
      handler = targetSelectorOrHandler;
    }

    const abortController = options?.abortController || new AbortController();
    const eventSettings = options?.eventSettings || {};
    const signal = abortController.signal;

    this.each((el) => {
      let delegateHandler;
      if (targetSelector) {
        delegateHandler = (e) => {
          const target = e.target.closest(targetSelector);
          if (target) {
            handler.call(target, e);
          }
        };
      }
      const eventListener = delegateHandler || handler;

      // will cause illegal invocation if used from proxy object
      const domEL = (this.isGlobal) ? globalThis : el;
      if (domEL.addEventListener) {
        domEL.addEventListener(event, eventListener, { signal, ...eventSettings });
      }

      const eventHandler = {
        el,
        event,
        eventListener,
        abortController,
        delegated: targetSelector !== undefined,
        handler,
        abort: (reason) => abortController.abort(reason),
      };
      eventHandlers.push(eventHandler);
    });

    if (!Query.eventHandlers) {
      Query.eventHandlers = [];
    }
    Query.eventHandlers.push(...eventHandlers);

    if(options?.returnHandler) {
      return eventHandlers.length == 1 ? eventHandlers[0] : eventHandlers;
    }
    return this;
  }

  one(event, targetSelectorOrHandler, handlerOrOptions, options) {
    let handler;
    let targetSelector;
    if (isObject(handlerOrOptions)) {
      options = handlerOrOptions;
      handler = targetSelectorOrHandler;
    }
    else if (isString(targetSelectorOrHandler)) {
      targetSelector = targetSelectorOrHandler;
      handler = handlerOrOptions;
    }
    else if (isFunction(targetSelectorOrHandler)) {
      handler = targetSelectorOrHandler;
    }
    const wrappedHandler = (...args) => {
      handler.apply(this, args);
      // Unbind the event handler after it has been invoked once
      this.off(event, wrappedHandler);
    };
    return (targetSelector)
      ? this.on(event, targetSelector, wrappedHandler, options)
      : this.on(event, wrappedHandler, options)
    ;
  }

  off(event, handler) {
    Query.eventHandlers = Query.eventHandlers.filter((eventHandler) => {
      if (
        eventHandler.event === event &&
        (!handler ||
          handler?.eventListener == eventHandler.eventListener ||
          eventHandler.eventListener === handler ||
          eventHandler.handler === handler)
      ) {
        // global this uses proxy object will cause illegal invocation
        const el = (this.isGlobal) ? globalThis : eventHandler.el;
        if(el.removeEventListener) {
          el.removeEventListener(event, eventHandler.eventListener);
        }
        return false;
      }
      return true;
    });
    return this;
  }

  trigger(eventType, eventParams) {
    return this.each(el => {
      if (typeof el.dispatchEvent !== 'function') {
        return;
      }
      const event = new Event(eventType, { bubbles: true, cancelable: true });
      if(eventParams) {
        Object.assign(event, eventParams);
      }
      el.dispatchEvent(event);
    });
  }

  click(eventParams) {
    return this.trigger('click', eventParams);
  }


  dispatchEvent(eventName, eventData = {}, eventSettings = {}) {
    const eventOptions = {
      bubbles: true,
      cancelable: true,
      composed: true,
      detail: eventData,
      ...eventSettings
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
    const classesToAdd = classNames.split(' ');
    return this.each((el) => el.classList.add(...classesToAdd));
  }

  hasClass(className) {
    return Array.from(this).some((el) => el.classList.contains(className));
  }

  removeClass(classNames) {
    const classesToRemove = classNames.split(' ');
    return this.each((el) => el.classList.remove(...classesToRemove));
  }

  toggleClass(classNames) {
    const classesToToggle = classNames.split(' ');
    return this.each((el) => el.classList.toggle(...classesToToggle));
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
      const values = this.map((el) =>
        this.getTextContentRecursive(childNodes(el))
      );
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
    if (newValue !== undefined) {
      // Set the value for each element
      return this.each((el) => {
        if (
          el instanceof HTMLInputElement ||
          el instanceof HTMLSelectElement ||
          el instanceof HTMLTextAreaElement
        ) {
          el.value = newValue;
        }
      });
    }
    else {
      // Get the value of each element
      const values = this.map((el) => {
        if (
          el instanceof HTMLInputElement ||
          el instanceof HTMLSelectElement ||
          el instanceof HTMLTextAreaElement
        ) {
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
    if(this.length) {
      this[0].focus();
    }
    return this;
  }
  blur() {
    if(this.length) {
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
          elements.forEach((el) => (el.style[prop] = val));
        });
      }
      else {
        elements.forEach((el) => (el.style[property] = value));
      }
      return this; // Return the Query instance for chaining
    }
    else {
      // Attempt to get a style directly
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

  cssVar(variable, value) {
    return this.css(`--${variable}`, value, { includeComputed: true });
  }

  attr(attribute, value) {
    if (isPlainObject(attribute)) {
      // Handle object of attribute-value pairs
      Object.entries(attribute).forEach(([attr, val]) => {
        this.each((el) => el.setAttribute(attr, val));
      });
    }
    else if (value !== undefined) {
      // Handle single attribute-value pair
      this.each((el) => el.setAttribute(attribute, value));
    }
    else if (this.length) {
      const attributes = this.map((el) =>
        el.getAttribute(attribute)
      );
      return attributes.length > 1 ? attributes : attributes[0];
    }
    return;
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
      if(this.length == 0) {
        return undefined;
      }
      else if (this.length === 1) {
        return this[0][name];
      } else {
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

  height(value) {
    const prop = (this.isGlobal) ? 'innerHeight' : 'clientHeight';
    return this.prop(prop, value);
  }

  width(value) {
    const prop = (this.isGlobal) ? 'innerWidth' : 'clientWidth';
    return this.prop(prop, value);
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
    const $content = this.chain(content);
    $content.each(el => {
      target.insertAdjacentElement(position, el);
    });
  }

  prepend(content) {
    return this.each((el) => {
      this.insertContent(el, content, 'afterbegin');
    });
  }

  append(content) {
    return this.each((el) => {
      this.insertContent(el, content, 'beforeend');
    });
  }

  insertBefore(selector) {
    return this.chain(selector).each((el) => {
      this.insertContent(el, this.selector, 'beforebegin');
    });
  }

  insertAfter(selector) {
    return this.chain(selector).each((el) => {
      this.insertContent(el, this.selector, 'afterend');
    });
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
      const $clone = $(el).clone();
      $clone
        .insertAfter(el)
        .css({
          position: 'absolute',
          display: 'block',
          transform: 'translate(-9999px, -9999px)',
          zIndex: '-1',
        })
      ;
      const naturalWidth = $clone.width();
      $clone.remove();
      return naturalWidth;
    });
    return widths.length > 1 ? widths : widths[0];
  }

  naturalHeight() {
    const height = this.map((el) => {
      const $clone = $(el).clone();
      $clone
        .insertAfter(el)
        .css({
          position: 'absolute',
          display: 'block',
          transform: 'translate(-9999px, -9999px)',
          zIndex: '-1',
        })
      ;
      const naturalHeight = $clone.height();
      $clone.remove();
      return naturalHeight;
    });
    return height.length > 1 ? height : height[0];
  }

  // offsetParent does not return the true offset parent
  // in cases where there is a parent node with a transform context
  // so we need to get that manually where finding the true offset parent is essential
  // for instance when calculating position
  offsetParent({ calculate = true } = {}) {
    return Array.from(this)
      .map((el) => {
        if(!calculate) {
          return el.offsetParent;
        }
        let $el, isPositioned, isTransformed, isBody;
        let parentNode = el?.parentNode;
        while(parentNode && !isPositioned && !isTransformed && !isBody) {
          parentNode = parentNode?.parentNode;
          if(parentNode) {
            $el = $(parentNode);
            isPositioned = ($el.computedStyle('position') !== 'static');
            isTransformed = ($el.computedStyle('transform') !== 'none');
            isBody = $el.is('body');
          }
        }
        return parentNode;
      })
    ;
  }

  // alias
  count() {
    return this.length;
  }
  exists() {
    return this.length > 0;
  }

  // adds properties to an element after dom loads
  initialize(settings) {
    document.addEventListener('DOMContentLoaded', () => {
      this.settings(settings);
    });
  }

  settings(settings) {
    this.each((el) => {
      each(settings, (value, setting) => {
        el[setting] = value;
      });
    });
  }

  setting(setting, value) {
    this.each((el) => {
      el[setting] = value;
    });
  }

  // special helper for SUI components
  getComponent() {
    const tpls = this.map(el => el.tpl).filter(Boolean);
    return tpls.length > 1 ? tpls : tpls[0];
  }
}
