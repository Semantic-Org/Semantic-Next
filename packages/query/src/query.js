import { isPlainObject, isString, isArray, isDOM, isFunction, isObject } from '@semantic-ui/utils';

/*
A minimal toolkit for querying and performing modifications
across DOM nodes based off a selector
*/

export class Query {
  static eventHandlers = [];

  constructor(selector, root = document) {
    let elements = [];

    if (!selector || !root) {
      return;
    }

    if (isArray(selector)) {
      // Directly passed an array of elements
      elements = selector;
    }
    else if (isString(selector)) {
      // String selector provided, find elements using querySelectorAll
      elements = root.querySelectorAll(selector);
    }
    else if (isDOM(selector)) {
      // A single Element, Document, or DocumentFragment is provided
      elements = [selector];
    }
    else if (selector instanceof NodeList) {
      // A NodeList is provided
      elements = selector;
    }

    this.length = elements.length;
    Object.assign(this, elements);
  }

  each(callback) {
    Array.from(this).forEach((el, index) => {
      const $el = new Query(el);
      callback.call($el, el, index);
    });
    return this;
  }

  removeAllEvents() {
    Query._eventHandlers = [];
  }

  find(selector) {
    const elements = Array.from(this).flatMap((el) =>
      Array.from(el.querySelectorAll(selector))
    );
    return new Query(elements); // Directly pass the array of elements
  }

  parent(selector) {
    const parents = Array.from(this)
      .map((el) => el.parentElement)
      .filter(Boolean);
    return selector ? new Query(parents).filter(selector) : new Query(parents);
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

    return new Query(filteredChildren);
  }

  filter(selectorOrFunction) {
    let filteredElements = [];
    if (isString(selectorOrFunction)) {
      // If a CSS selector is provided, use it with the matches method
      filteredElements = Array.from(this).filter((el) =>
        el.matches(selectorOrFunction)
      );
    }
    else if (isFunction(selectorOrFunction)) {
      // If a function is provided, use it directly to filter elements
      filteredElements = Array.from(this).filter(selectorOrFunction);
    }
    return new Query(filteredElements);
  }

  not(selector) {
    // Filter out elements that match the provided selector
    const filteredElements = Array.from(this).filter(
      (el) => !el.matches(selector)
    );
    return new Query(filteredElements);
  }

  closest(selector) {
    const closest = Array.from(this)
      .map((el) => el.closest(selector))
      .filter(Boolean);
    return new Query(closest);
  }

  on(event, targetSelectorOrHandler, handlerOrOptions, options) {
    const eventHandlers = [];

    let handler;
    let targetSelector;
    if (isObject(handlerOrOptions)) {
      options = handlerOrOptions;
      handler = targetSelectorOrHandler;
    } else if (isString(targetSelectorOrHandler)) {
      targetSelector = targetSelectorOrHandler;
      handler = handlerOrOptions;
    } else if (isFunction(targetSelectorOrHandler)) {
      handler = targetSelectorOrHandler;
    }

    const abortController = options?.abortController || new AbortController();
    const signal = abortController.signal;

    this.each((el) => {
      let delegateHandler;
      if (targetSelector) {
        delegateHandler = (e) => {
          const target = e.target.closest(targetSelector);
          if (target && el.contains(target)) {
            handler.call(target, e);
          }
        };
      }
      if (el.addEventListener) {
        el.addEventListener(event, delegateHandler || handler, { signal });
      }

      const eventHandler = {
        el,
        event,
        eventListener: delegateHandler || handler,
        abortController,
        delegated: targetSelector !== undefined,
        handler,
        abort: () => abortController.abort(),
      };
      eventHandlers.push(eventHandler);
    });

    if (!Query._eventHandlers) {
      Query._eventHandlers = [];
    }
    Query._eventHandlers.push(...eventHandlers);

    return eventHandlers.length == 1 ? eventHandlers[0] : eventHandlers;
  }

  one(event, targetSelectorOrHandler, handlerOrOptions, options) {
    const wrappedHandler = (...args) => {
      // Call the original event handler
      if (isFunction(handlerOrOptions)) {
        handlerOrOptions.apply(this, args);
      } else if (isString(targetSelectorOrHandler) && isFunction(targetSelectorOrHandler)) {
        targetSelectorOrHandler.apply(this, args);
      }

      // Unbind the event handler after it has been invoked once
      this.off(event, wrappedHandler);
    };

    // Use the existing `on` method to bind the wrapped handler
    return this.on(event, targetSelectorOrHandler, wrappedHandler, options);
  }

  off(event, handler) {
    Query._eventHandlers = Query._eventHandlers.filter((eventHandler) => {
      if (
        eventHandler.event === event &&
        (!handler ||
          handler?.eventListener == eventHandler.eventListener ||
          eventHandler.eventListener === handler ||
          eventHandler.handler === handler)
      ) {
        eventHandler.el.removeEventListener(event, eventHandler.eventListener);
        return false;
      }
      return true;
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
    else if (this.length) {
      return this[0].innerHTML;
    }
    return this;
  }

  outerHTML(newHTML) {
    if (newHTML !== undefined) {
      return this.each((el) => (el.outerHTML = newHTML));
    }
    else if (this.length) {
      return this[0].outerHTML;
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
      const values = Array.from(this).map((el) =>
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
      const values = Array.from(this).map((el) => {
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

  css(property, value, settings = { includeComputed: false }) {
    const elements = Array.from(this);
    // Setting a value or multiple values
    if (isPlainObject(property) || isString(value)) {
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
          if (inlineStyle !== '') return inlineStyle; // Return inline style if present
          if (settings.includeComputed) {
            return window.getComputedStyle(el).getPropertyValue(property); // Return computed style if allowed
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
      const attributes = Array.from(this).map((el) =>
        el.getAttribute(attribute)
      );
      return attributes.length > 1 ? attributes : attributes[0];
    }
    return this;
  }

  removeAttr(attributeName) {
    return this.each((el) => el.removeAttribute(attributeName));
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
    return new Query(this[index]);
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

  focus() {
    return this[0].focus();
  }
  blur() {
    return this[0].blur();
  }

  initialize(settings) {
    return this.each((el) => {
      Object.entries(settings).forEach(([prop, val]) => {
        el[prop] = val;
      });
    });
  }
}
