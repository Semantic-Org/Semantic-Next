import {
  isString,
  isArray,
  isDOM,
  isFunction,
  isObject,
} from '@semantic-ui/utils';

/*
  A minimal toolkit for querying and performing modifications
  across DOM nodes based off a selector
*/

export class Query {
  static eventHandlers = [];

  constructor(selector, root = document) {
    let elements = [];

    if (!selector) {
      return;
    }

    if (isArray(selector)) {
      // Directly passed an array of elements
      elements = selector;
    } else if (isString(selector)) {
      // String selector provided, find elements using querySelectorAll
      elements = root.querySelectorAll(selector);
    } else if (isDOM(selector)) {
      // A single Element, Document, or DocumentFragment is provided
      elements = [selector];
    } else if (selector instanceof NodeList) {
      // A NodeList is provided
      elements = selector;
    }

    this.length = elements.length;
    Object.assign(this, elements);
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
    if (typeof selectorOrFunction === 'string') {
      // If a CSS selector is provided, use it with the matches method
      filteredElements = Array.from(this).filter((el) =>
        el.matches(selectorOrFunction)
      );
    } else if (typeof selectorOrFunction === 'function') {
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

    // <https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal>
    const abortController = options?.abortController || new AbortController();
    const signal = abortController.signal;

    Array.from(this).forEach((el) => {
      let delegateHandler;
      if (targetSelector) {
        delegateHandler = (e) => {
          for (
            let target = e.target;
            target && target !== el;
            target = target.parentNode
          ) {
            if (target.matches(targetSelector)) {
              handler.call(target, e);
              break;
            }
          }
        };
      }
      el.addEventListener(event, delegateHandler || handler, { signal });

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

    Query._eventHandlers.push(...eventHandlers);

    return eventHandlers.length == 1 ? eventHandlers[0] : eventHandlers;
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
    Array.from(this).forEach((el) => el.remove());
    return this;
  }

  addClass(classNames) {
    const classesToAdd = classNames.split(' ');
    Array.from(this).forEach((el) => el.classList.add(...classesToAdd));
    return this;
  }

  hasClass(className) {
    return Array.from(this).some((el) => el.classList.contains(className));
  }

  removeClass(classNames) {
    const classesToRemove = classNames.split(' ');
    Array.from(this).forEach((el) => el.classList.remove(...classesToRemove));
    return this;
  }

  html(newHTML) {
    if (newHTML !== undefined) {
      Array.from(this).forEach((el) => (el.innerHTML = newHTML));
      return this;
    } else if (this.length) {
      return this[0].innerHTML;
    }
  }

  outerHTML(newHTML) {
    if (newHTML !== undefined) {
      Array.from(this).forEach((el) => (el.outerHTML = newHTML));
      return this;
    } else if (this.length) {
      return this[0].outerHTML;
    }
  }

  text(newText) {
    if (newText !== undefined) {
      Array.from(this).forEach((el) => (el.textContent = newText));
      return this;
    } else {
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
        } else if (node.nodeName === 'SLOT') {
          // If the node is a slot, retrieve its assigned nodes
          const slotNodes = node.assignedNodes({ flatten: true });
          return this.getTextContentRecursive(slotNodes);
        } else {
          return this.getTextContentRecursive(node.childNodes);
        }
      })
      .join('')
      .trim();
  }

  value(newValue) {
    if (newValue !== undefined) {
      // Set the value for each element
      Array.from(this).forEach((el) => {
        if (
          el instanceof HTMLInputElement ||
          el instanceof HTMLSelectElement ||
          el instanceof HTMLTextAreaElement
        ) {
          el.value = newValue;
        }
      });
      return this;
    } else {
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

  css(property, value) {
    if (typeof property === 'object') {
      Object.entries(property).forEach(([prop, val]) => {
        Array.from(this).forEach((el) => (el.style[prop] = val));
      });
    } else if (value !== undefined) {
      Array.from(this).forEach((el) => (el.style[property] = value));
    } else if (this.length) {
      const properties = Array.from(this).map((el) => el.style[property]);
      return properties.length > 1 ? properties : properties[0];
    }
    return this;
  }

  attr(attribute, value) {
    if (typeof attribute === 'object') {
      // Handle object of attribute-value pairs
      Object.entries(attribute).forEach(([attr, val]) => {
        Array.from(this).forEach((el) => el.setAttribute(attr, val));
      });
    } else if (value !== undefined) {
      // Handle single attribute-value pair
      Array.from(this).forEach((el) => el.setAttribute(attribute, value));
    } else if (this.length) {
      const attributes = Array.from(this).map((el) =>
        el.getAttribute(attribute)
      );
      return attributes.length > 1 ? attributes : attributes[0];
    }
    return this;
  }

  removeAttr(attributeName) {
    Array.from(this).forEach((el) => el.removeAttribute(attributeName));
    return this;
  }

  each(callback) {
    Array.from(this).forEach((el, index) => {
      // Call the callback with 'this' context set to the current element
      callback.call(el, new Query(el), index);
    });
    return this;
  }

  get(index) {
    if (index !== undefined) {
      return this[index];
    } else {
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
}
