/*
  A minimal DOM toolkit for querying and chaining
  across DOM nodes
*/

class Query {

  constructor(selector, root = document) {
    let elements = [];

    if (!selector) {
      return;
    }

    if (Array.isArray(selector)) {
      // Directly passed an array of elements
      elements = selector;
    } else if (typeof selector === 'string') {
      // String selector provided, find elements using querySelectorAll
      elements = root.querySelectorAll(selector);
    } else if (selector instanceof Element || selector instanceof Document || selector instanceof DocumentFragment) {
      // A single Element, Document, or DocumentFragment is provided
      elements = [selector];
    } else if (selector instanceof NodeList) {
      // A NodeList is provided
      elements = selector;
    }

    this.length = elements.length;
    Object.assign(this, elements);
  }

  find(selector) {
    const elements = Array.from(this).flatMap(el => Array.from(el.querySelectorAll(selector)));
    return new Query(elements); // Directly pass the array of elements
  }

  parent(selector) {
    const parents = Array.from(this).map(el => el.parentElement).filter(Boolean);
    return selector ? new Query(parents).filter(selector) : new Query(parents);
  }

  closest(selector) {
    const closest = Array.from(this).map(el => el.closest(selector)).filter(Boolean);
    return new Query(closest);
  }

  on(event, targetSelectorOrHandler, handler) {

    // Check if targetSelectorOrHandler is a function (direct event binding)
    if (typeof targetSelectorOrHandler === 'function') {
      // Direct event binding
      Array.from(this).forEach(el => el.addEventListener(event, targetSelectorOrHandler));
    } else {
      // Event delegation
      Array.from(this).forEach(el => {
        el.addEventListener(event, function(e) {
          // Check if any of the parent elements of the event target match the targetSelector
          for (let target = e.target; target && target !== this; target = target.parentNode) {
            if (target.matches(targetSelectorOrHandler)) {
              handler.call(target, e);
              break;
            }
          }
        });
      });
    }

    this._eventHandlers = this._eventHandlers || [];
    Array.from(this).forEach(el => {
      const eventHandler = {
        el: el,
        event: event,
        handler: typeof targetSelectorOrHandler === 'function' ? targetSelectorOrHandler : handler,
        delegated: typeof targetSelectorOrHandler === 'string',
        originalHandler: handler // Store original handler for delegated events
      };
      this._eventHandlers.push(eventHandler);
    });

    return this;
  }

  off(event, handler) {
    // Remove the event listeners
    if(this._eventHandlers) {
      this._eventHandlers = this._eventHandlers.filter(eventHandler => {
        if(eventHandler.event === event && (!handler || eventHandler.handler === handler || eventHandler.originalHandler === handler)) {
          eventHandler.el.removeEventListener(event, eventHandler.handler);
          return false; // Remove from the array
        }
        return true; // Keep handler in the array
      });
    }
    return this;
  }

  remove() {
    Array.from(this).forEach(el => el.remove());
    return this;
  }

  html(newHtml) {
    if(newHtml !== undefined) {
      Array.from(this).forEach(el => el.innerHTML = newHtml);
      return this;
    }
    else if(this.length) {
      return this[0].innerHTML;
    }
  }

  text(newText) {
    if(newText !== undefined) {
      Array.from(this).forEach(el => el.textContent = newText);
      return this;
    }
    else if(this.length) {
      return this[0].textContent;
    }
  }

  css(property, value) {
    if (typeof property === 'object') {
      Object.entries(property).forEach(([prop, val]) => {
        Array.from(this).forEach(el => el.style[prop] = val);
      });
    } else if (value !== undefined) {
      Array.from(this).forEach(el => el.style[property] = value);
    } else if (this.length) {
      return this[0].style[property];
    }
    return this;
  }

  attr(attribute, value) {
    if(value !== undefined) {
      Array.from(this).forEach(el => el.setAttribute(attribute, value));
      return this;
    }
    else if(this.length) {
      return this[0].getAttribute(attribute);
    }
  }
}

export function $(selector, root = document) {
  return new Query(selector, root);
}
