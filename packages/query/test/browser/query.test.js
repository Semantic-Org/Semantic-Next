import { describe, vi, beforeAll, beforeEach, afterEach, afterAll, it, expect } from 'vitest';
import { $, $$ } from '@semantic-ui/query';

describe('query', () => {

  
  describe('text', () => {

    it('text should get text content of slotted nodes from shadow DOM', () => {

      // initialize a web component then add slotted content
      // that slotted content should have the specified text content when using text
      class TestComponent extends HTMLElement {
        constructor() {
          super();
          const shadow = this.attachShadow({ mode: 'open' });
          const div = document.createElement('div');
          const slot = document.createElement('slot');
          slot.name = 'test';
          div.appendChild(slot);
          shadow.appendChild(div);
        }
        $(selector) {
          return $(selector, { root: this.shadowRoot });
        }
        getSlotText() {
          return this.$('slot').text();
        }
        getDivText() {
          return this.$('div').text();
        }

      }
      customElements.define('test-component', TestComponent);
      const customElement = document.createElement('test-component');
      const span = document.createElement('span');
      span.slot = 'test';

      span.textContent = 'passed in text';  
      customElement.appendChild(span);

      document.body.appendChild(customElement);
      expect(customElement.getSlotText()).toBe('passed in text');
      expect(customElement.getDivText()).toBe('passed in text');

    });
  });

  describe('window and globalThisProxy', () => {
    beforeEach(() => {
      // Clear any existing global variables before each test
      delete window.$;
      delete window.$$;
      delete window.Query;
    });

    it('should attach event listeners to the window object using "window" selector', () => {
      const callback = vi.fn();

      $('window').on('resize', callback);
      window.dispatchEvent(new Event('resize'));

      expect(callback).toHaveBeenCalled();
    });

    it('should attach event listeners to the window object using "globalThis" selector', () => {
      const callback = vi.fn();

      $('globalThis').on('resize', callback);
      window.dispatchEvent(new Event('resize'));

      expect(callback).toHaveBeenCalled();
    });

    it('should attach event listeners to the window object directly', () => {
      const callback = vi.fn();

      $(window).on('resize', callback);
      window.dispatchEvent(new Event('resize'));

      expect(callback).toHaveBeenCalled();
    });

    it('should remove event listeners from the window object using "window" selector', () => {
      const callback = vi.fn();

      $('window').on('resize', callback);
      $('window').off('resize', callback);
      window.dispatchEvent(new Event('resize'));

      expect(callback).not.toHaveBeenCalled();
    });

    it('should remove event listeners from the window object using "globalThis" selector', () => {
      const callback = vi.fn();

      $('globalThis').on('resize', callback);
      $('globalThis').off('resize', callback);
      window.dispatchEvent(new Event('resize'));

      expect(callback).not.toHaveBeenCalled();
    });

    it('should remove event listeners from the window object directly', () => {
      const callback = vi.fn();

      $(window).on('resize', callback);
      $(window).off('resize', callback);
      window.dispatchEvent(new Event('resize'));

      expect(callback).not.toHaveBeenCalled();
    });

    it('should handle properties access on the globalThisProxy object', () => {
      const $window = $('window');
      expect($window.prop('innerWidth')).toBe(window.innerWidth);
      expect($window.prop('innerHeight')).toBe(window.innerHeight);
    });

    it('should handle method invocation on the globalThisProxy object', () => {
      const $window = $('window');
      expect($window.prop('alert')).toBeInstanceOf(Function);
      expect($window.prop('confirm')).toBeInstanceOf(Function);
    });

    it('should handle setting properties on the globalThisProxy object', () => {
      const $window = $('window');
      const customProp = 'customValue';

      $window.prop('customProp', customProp);
      expect(window.customProp).toBe(customProp);
    });

    it('should handle dimension properties correctly for the window object', () => {
      const $window = $('window');
      expect($window.height()).toBe(window.innerHeight);
      expect($window.width()).toBe(window.innerWidth);
      expect($window.scrollHeight()).toBe(document.documentElement.scrollHeight);
      expect($window.scrollWidth()).toBe(document.documentElement.scrollWidth);
      expect($window.scrollLeft()).toBe(window.scrollX);
      expect($window.scrollTop()).toBe(window.scrollY);
    });

    it('should proxy method calls to the global object', () => {
      const alertMock = vi.fn();
      globalThis.alert = alertMock;
      $('window').prop('alert')('test');
      expect(alertMock).toHaveBeenCalledWith('test');
    });

    it('should allow setting global properties', () => {
      $('window').prop('testProp', 'testValue');
      expect(globalThis.testProp).toBe('testValue');
    });
  });

  describe('Shadow DOM Traversal', () => {
    beforeAll(() => {
      // Register custom elements once in this suite

      // Open Shadow DOM component
      class TestDOMInnerComponent extends HTMLElement {
        constructor() {
          super();
          const shadow = this.attachShadow({ mode: 'open' });
          const titleDiv = document.createElement('div');
          titleDiv.className = 'title';
          titleDiv.textContent = 'Inside Nested Component';
          shadow.appendChild(titleDiv);
        }
        connectedCallback() {
          this.dispatchEvent(new CustomEvent('initialized', { bubbles: true }));
        }
      }
      customElements.define('test-dom-inner', TestDOMInnerComponent);

      // Nested component
      class TestDOMComponent extends HTMLElement {
        constructor() {
          super();
          const shadow = this.attachShadow({ mode: 'open' });
          const myComponent = document.createElement('test-dom-inner');
          const titleDiv = document.createElement('div');
          titleDiv.className = 'title';
          titleDiv.textContent = 'Inside Web Component';
          shadow.appendChild(myComponent);
          shadow.appendChild(titleDiv);
        }
        async connectedCallback() {
          const el = this.shadowRoot.querySelector('test-dom-inner');
          if(el) {
            el.addEventListener('initialized', () => {
              this.dispatchEvent(new CustomEvent('initialized', { bubbles: true }));
            });
          }
        }
      }
      customElements.define('test-dom', TestDOMComponent);

    });

    afterEach(() => {
      // Clean up after each test
      document.body.innerHTML = '';
    });

    it('should return outer elements and nested shadow elements', async () => {
      // Create an element with class 'title' outside
      const outsideDiv = document.createElement('div');
      outsideDiv.className = 'title';
      outsideDiv.textContent = 'Outside Shadow DOM';
      document.body.appendChild(outsideDiv);

      const testComponent = document.createElement('test-dom');

      // Create a Promise that resolves when the 'initialized' event is dispatched
      const componentInit = new Promise((resolve) => {
        testComponent.addEventListener('initialized', resolve);
      });

      document.body.appendChild(testComponent);

      // Wait for the component to initialize
      await componentInit;

      // selects outer title, nested component title and inner component title
      const $allElements = $$('.title');
      expect($allElements.length).toBe(3);

    });


    it('should select nested items', async () => {
      // Create an element with class 'title' outside
      const outsideDiv = document.createElement('div');
      outsideDiv.className = 'title';
      outsideDiv.textContent = 'Outside Shadow DOM';
      document.body.appendChild(outsideDiv);

      const testComponent = document.createElement('test-dom');

      // Create a Promise that resolves when the 'initialized' event is dispatched
      const componentInit = new Promise((resolve) => {
        testComponent.addEventListener('initialized', resolve);
      });

      document.body.appendChild(testComponent);

      // Wait for the component to initialize
      await componentInit;

      // selects nested component title and inner component title
      const $elements = $$('test-dom .title');
      expect($elements.length).toBe(2);

    });

    it('should not match items not at shadow root', async () => {
      // Create an element with class 'title' outside
      const outsideDiv = document.createElement('div');
      outsideDiv.className = 'title';
      outsideDiv.textContent = 'Outside Shadow DOM';
      document.body.appendChild(outsideDiv);

      const testComponent = document.createElement('test-dom');

      // Create a Promise that resolves when the 'initialized' event is dispatched
      const componentInit = new Promise((resolve) => {
        testComponent.addEventListener('initialized', resolve);
      });

      document.body.appendChild(testComponent);

      // Wait for the component to initialize
      await componentInit;

      // selects nested component title
      const $elements = $$('not-component .title');
      expect($elements.length).toBe(0);

    });

    it('should select deeply nested items', async () => {
      // Create an element with class 'title' outside
      const outsideDiv = document.createElement('div');
      outsideDiv.className = 'title';
      outsideDiv.textContent = 'Outside Shadow DOM';
      document.body.appendChild(outsideDiv);

      const testComponent = document.createElement('test-dom');

      // Create a Promise that resolves when the 'initialized' event is dispatched
      const componentInit = new Promise((resolve) => {
        testComponent.addEventListener('initialized', resolve);
      });

      document.body.appendChild(testComponent);

      // Wait for the component to initialize
      await componentInit;

      // selects nested component title
      const $innerElements = $$('test-dom test-dom-inner .title');
      expect($innerElements.length).toBe(1);

    });

  });

});
