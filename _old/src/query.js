class Query {

  /*
    This is a very lightweight wrapper for
    native DOM APIs to allow for chaining
    and basic el manipulation in a jQ style
  */

  constructor(selectorOrElements) {
    if (typeof selectorOrElements === 'string') {
      this.elements = Array.from(document.querySelectorAll(selectorOrElements));
    }
    else {
      this.elements = Array.from(selectorOrElements);
    }
  }

  text(value) {
    if (value === undefined) {
      return this.elements.map(el => el.textContent).join('');
    }
    else {
      this.elements.forEach(el => el.textContent = value);
      return this;
    }
  }

  html(value) {
    if (value === undefined) {
      return this.elements.map(el => el.innerHTML).join('');
    }
    else {
      this.elements.forEach(el => el.innerHTML = value);
      return this;
    }
  }

  remove() {
    this.elements.forEach(el => el.remove());
    return this;
  }

  find(selector) {
    const foundElements = [];
    this.elements.forEach(el => foundElements.push(...el.querySelectorAll(selector)));
    return new Query(foundElements);
  }

  parent() {
    const parents = this.elements.map(el => el.parentElement);
    return new Query(parents);
  }

  closest(selector) {
    const closestElements = this.elements.map(el => el.closest(selector));
    return new Query(closestElements);
  }

  on(eventType, listener) {
    this.elements.forEach(el => el.addEventListener(eventType, listener));
    return this;
  }

  get(index) {
    return this.elements[index];
  }
}

export { Query };
