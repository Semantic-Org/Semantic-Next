(() => {
  // src/lib/query.js
  var Query = class _Query {
    constructor(selector, root) {
      if (!selector) {
        return;
      }
      const elements = root.querySelectorAll(selector);
      this.length = elements.length;
      Object.assign(this, elements);
    }
    find(selector) {
      const elements = Array.from(this).flatMap((el) => Array.from(el.querySelectorAll(selector)));
      return new _Query(selector, elements);
    }
    parent() {
      const parents = Array.from(this).map((el) => el.parentElement).filter(Boolean);
      return new _Query(null, parents);
    }
    closest(selector) {
      const closest = Array.from(this).map((el) => {
        let parent = el.parentElement;
        while (parent && !parent.matches(selector)) {
          parent = parent.parentElement;
        }
        return parent;
      }).filter(Boolean);
      return new _Query(null, closest);
    }
    on(event, handler) {
      Array.from(this).forEach((el) => el.addEventListener(event, handler));
      return this;
    }
    remove() {
      Array.from(this).forEach((el) => el.remove());
      return this;
    }
    html(newHtml) {
      if (newHtml !== void 0) {
        Array.from(this).forEach((el) => el.innerHTML = newHtml);
        return this;
      } else if (this.length) {
        return this[0].innerHTML;
      }
    }
    text(newText) {
      if (newText !== void 0) {
        Array.from(this).forEach((el) => el.textContent = newText);
        return this;
      } else if (this.length) {
        return this[0].textContent;
      }
    }
    css(property, value) {
      if (value !== void 0) {
        Array.from(this).forEach((el) => el.style[property] = value);
        return this;
      } else if (this.length) {
        return this[0].style[property];
      }
    }
    attr(attribute, value) {
      if (value !== void 0) {
        Array.from(this).forEach((el) => el.setAttribute(attribute, value));
        return this;
      } else if (this.length) {
        return this[0].getAttribute(attribute);
      }
    }
  };
  function $(selector, root = document) {
    return new Query(selector, root);
  }
})();
