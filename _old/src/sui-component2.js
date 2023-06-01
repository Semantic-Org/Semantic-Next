import { Query } from './query.js';
import {
  ReactiveVar,
  CreateReaction,
  AvoidReaction
} from './reactive.js'

class SUIComponent extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.expressionNodes = new Map();
    this.reactions = [];
    this.attributeBindings = new Map();
  }

  setAttributeBindings(bindings) {
    for (const [attr, propName] of Object.entries(bindings)) {
      const reactiveVar = new ReactiveVar(this.getAttribute(attr));
      this.attributeBindings.set(propName, reactiveVar);

      Object.defineProperty(this, propName, {
        get() {
          return reactiveVar.get();
        },
        set(value) {
          reactiveVar.set(value);
        },
      });

      const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
          if (mutation.type === 'attributes' && mutation.attributeName === attr) {
            this[propName] = this.getAttribute(attr);
          }
        }
      });
      observer.observe(this, { attributes: true });
    }
  }

  createScopedStyle(cssString) {
    const style = document.createElement('style');
    style.textContent = cssString;
    this.shadowRoot.appendChild(style);
  }

  dispatchCustomEvent(eventName, detail) {
    const event = new CustomEvent(eventName, { bubbles: true, composed: true, detail });
    this.dispatchEvent(event);
  }

  queryScoped(selector) {
    return this.shadowRoot.querySelector(selector);
  }

  queryAllScoped(selector) {
    return this.shadowRoot.querySelectorAll(selector);
  }

  $(selector) {
    return this.queryAllScoped(selector);
  }

  setTemplate(templateString) {
    this.templateString = templateString;
    this.templateString = this.preprocessTemplate(this.templateString);
    this.shadowRoot.innerHTML = this.templateString;

    this.reactions = [];
    for (const [uid, { expression, nodes }] of this.expressionNodes.entries()) {
      this.reactions.push(
        CreateReaction(
          () => {
            const computedValue = this[expression]();
            for (const node of nodes) {
              node.textContent = computedValue;
            }
          },
          { firstRun: true }
        )
      );
    }
  }

  preprocessTemplate(templateString) {
    const exprRegex = /{{\s*([a-zA-Z_$][0-9a-zA-Z_$]*)\s*}}/mg;
    const processedTemplate = templateString.replace(
      exprRegex,
      (_, expression) => {
        const uid = `expr_${expression.replace(/\s+/g, '')}`;
        if (!this.expressionNodes.has(uid)) {
          this.expressionNodes.set(uid, { expression, nodes: [] });
        }
        return `<span data-uid="${uid}"></span>`;
      }
    );

    return processedTemplate;
  }

  connectedCallback() {
    if (this.templateString) {
      const uidElements = this.shadowRoot.querySelectorAll('[data-uid]');
      for (const el of uidElements) {
        const uid = el.getAttribute('data-uid');
        if (this.expressionNodes.has(uid)) {
          this.expressionNodes.get(uid).nodes.push(el);
        }
      }
    }

    if (this.reactions) {
      this.reactions.forEach(reaction => reaction());
    }
  }

  disconnectedCallback() {
    if (this.reactions) {
      //this.reactions.forEach(reaction => reaction.stop());
    }
  }
}

export { SUIComponent };
