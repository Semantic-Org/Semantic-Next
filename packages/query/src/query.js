import { isPlainObject, isString, isArray, isDOM, isFunction, findIndex, inArray, isObject, each } from '@semantic-ui/utils';

/*
A minimal toolkit for querying and performing modifications
across DOM nodes based off a selector
*/

const tagRegExp = /^<(\w+)(\s*\/)?>$/;

export class Query {
  static eventHandlers = [];

  constructor(selector, { root = document, pierceShadow = true } = {}) {
    let elements = [];

    if (!root) {
      return;
    }
    // window is outside of document root
    if(selector == 'window') {
      elements = [globalThis];
    }
    else if (isArray(selector)) {
      // Directly passed an array of elements
      elements = selector;
    }
    else if (isString(selector)) {
      if (selector.slice(0, 1) == '<') {
        const tagName = selector.match(tagRegExp)[1];
        elements = [document.createElement(tagName)];
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
    return new Query(elements, this.options);
  }

  querySelectorAllDeep(root, selector, { includeRoot = true } = {}) {
    const elements = new Set();
    const domSelector = isDOM(selector);
    const stringSelector = isString(selector);
    const addElement = (node) => {
      if(node == root && !includeRoot) {
        return;
      }
      elements.add(node);
    };
    const findElements = (node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        if (domSelector) {
          if(node == selector) {
            addElement(node);
          }
        }
        else if (stringSelector && node.matches(selector)) {
          addElement(node);
        }
        else if (node.shadowRoot) {
          findElements(node.shadowRoot);
        }
      }
      if(node.assignedNodes) {
        each(node.assignedNodes(), node => {
          findElements(node);
        });
      }
      if (node.childNodes) {
        node.childNodes.forEach((childNode) => {
          findElements(childNode);
        });
      }
    };
    findElements(root);
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

  removeAllEvents() {
    Query._eventHandlers = [];
  }

  find(selector) {
    const elements = Array.from(this).flatMap((el) => {
      if (this.options.pierceShadow) {
        return this.querySelectorAllDeep(el, selector, {includeRoot: false });
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
      } else {
        return el.closest(selector);
      }
    }).filter(Boolean);

    return this.chain(closest);
  }

  closestDeep(element, selector) {
    let currentElement = element;
    while (currentElement) {
      if (currentElement.matches(selector)) {
        return currentElement;
      }
      if (currentElement.parentElement) {
        currentElement = currentElement.parentElement;
      } else if (currentElement.parentNode && currentElement.parentNode.host) {
        currentElement = currentElement.parentNode.host;
      } else {
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
          if (target && this.chain(el).find(target).length) {
            handler.call(target, e);
          }
        };
      }
      const eventListener = delegateHandler || handler;
      if (el.addEventListener) {
        el.addEventListener(event, eventListener, { signal, ...eventSettings });
      }

      const eventHandler = {
        el,
        event,
        eventListener,
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

  dispatchEvent(eventName, eventData = {}, eventSettings) {
    const eventOptions = {
      bubbles: true,
      cancelable: true,
      detail: eventData,
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
    else if (this.length) {
      return this.map(el => el.innerHTML || el.nodeValue).join('');;
    }
    return this;
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
    return this[0].focus();
  }
  blur() {
    return this[0].blur();
  }

  css(property, value, settings = { includeComputed: false }) {
    const elements = Array.from(this);
    // Setting a value or multiple values
    if (isPlainObject(property) || value !== undefined) {
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
          if (inlineStyle) {
            return inlineStyle; // Return inline style if present
          }
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
    return this.chain(this[index]);
  }

  first() {
    return this.eq(0);
  }

  prop(name, value) {
    if (value !== undefined) {
      // Set the property value for each element
      return this.each(el => {
        el[name] = value;
      });
    } else {
      // Get the property value from elements
      if (this.length === 1) {
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
    return this.prop('clientHeight', value);
  }

  width(value) {
    return this.prop('clientWidth', value);
  }

  scrollHeight(value) {
    return this.prop('scrollHeight', value);
  }

  scrollWidth(value) {
    return this.prop('scrollWidth', value);
  }

  scrollLeft(value) {
    return this.prop('scrollLeft', value);
  }

  scrollTop(value) {
    return this.prop('scrollTop', value);
  }

  clone() {
    const fragment = document.createDocumentFragment();
    this.each((el) => {
      fragment.appendChild(el.cloneNode(true));
    });
    return this.chain(fragment.childNodes);
  }

  insertAfter(selector) {
    const targets = this.chain(selector);
    const elements = this.get();
    targets.each((target, index) => {
      const element = elements[index] || elements[elements.length - 1];
      if (target.parentNode) {
        target.parentNode.insertBefore(element, target.nextSibling);
      }
    });
    return this;
  }

  naturalWidth() {
    const widths = this.map((el) => {
      const $clone = $(el).clone().insertAfter(el);
      $clone.css({
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
    const widths = this.map((el) => {
      const $clone = $(el).clone().insertAfter(el);
      $clone.css({
        position: 'absolute',
        display: 'block',
        transform: 'translate(-9999px, -9999px)',
        zIndex: '-1',
      });
      const naturalHeight = $clone.height();
      $clone.remove();
      return naturalHeight;
    });
    return widths.length > 1 ? widths : widths[0];
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
    $(document).on('DOMContentLoaded', () => {
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

}
