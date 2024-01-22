/*
  A minimal toolkit for querying and performing modifications
  across DOM nodes based off a selector
*/

export class Query {

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

  children(selector) {
    // Get all children of each element in the Query object
    const allChildren = Array.from(this).flatMap(el => Array.from(el.children));

    // If a selector is provided, filter the children
    const filteredChildren = selector ? allChildren.filter(child => child.matches(selector)) : allChildren;

    // Return a new Query object with these children
    return new Query(filteredChildren);
  }

  filter(selector) {
    // Filter out elements that match the provided selector
    const filteredElements = Array.from(this).filter(el => el.matches(selector));

    // Return a new Query object with the filtered elements
    return new Query(filteredElements);
  }

  not(selector) {
    // Filter out elements that match the provided selector
    const filteredElements = Array.from(this).filter(el => !el.matches(selector));
    // Return a new Query object with the filtered elements
    return new Query(filteredElements);
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

  addClass(className) {
    Array.from(this).forEach(el => el.classList.add(className));
    return this;
  }

  removeClass(className) {
    Array.from(this).forEach(el => el.classList.remove(className));
    return this;
  }

  html(newHTML) {
    if(newHTML !== undefined) {
      Array.from(this).forEach(el => el.innerHTML = newHTML);
      return this;
    }
    else if(this.length) {
      return this[0].innerHTML;
    }
  }

  outerHTML(newHTML) {
    if(newHTML !== undefined) {
      Array.from(this).forEach(el => el.outerHTML = newHTML);
      return this;
    }
    else if(this.length) {
      return this[0].outerHTML;
    }
  }

  text(newText) {
    if (newText !== undefined) {
      Array.from(this).forEach(el => el.textContent = newText);
      return this;
    } else {
      return Array.from(this).map(el => this.getTextContentRecursive(el.childNodes)).join('');
    }
  }

  // Helper function to recursively get text content
  getTextContentRecursive(nodes) {
    return Array.from(nodes).map(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.nodeValue;
      } else if (node.nodeName === 'SLOT') {
        // If the node is a slot, retrieve its assigned nodes
        const slotNodes = node.assignedNodes({ flatten: true });
        return this.getTextContentRecursive(slotNodes);
      } else {
        return this.getTextContentRecursive(node.childNodes);
      }
    }).join('');
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
  each(callback) {
    Array.from(this).forEach((el, index) => {
      // Call the callback with 'this' context set to the current element
      callback.call(el, new Query(el), index);
    });
    return this;
  }
  get(index) {
    if (index !== undefined) {
      // If an index is provided, return the element at that index (or undefined if it doesn't exist)
      return this[index];
    } else {
      // If no index is provided, return all elements as an array
      return Array.from(this);
    }
  }

  // non jquery variant to return only immediate text node
  textNode() {
    return Array.from(this).map(el => {
      return Array.from(el.childNodes)
        .filter(node => node.nodeType === Node.TEXT_NODE)
        .map(node => node.nodeValue)
        .join('');
    }).join('');
  }

}
