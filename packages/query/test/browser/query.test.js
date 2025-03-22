import { $, $$ } from '@semantic-ui/query';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

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

  describe('$$', () => {
    // Clean up after each test
    afterEach(() => {
      document.body.innerHTML = '';
    });

    // Set up test components once for all tests
    beforeAll(() => {
      // Basic shadow component
      if (!customElements.get('test-shadow-component')) {
        class TestShadowComponent extends HTMLElement {
          constructor() {
            super();
            const shadow = this.attachShadow({ mode: 'open' });
            const div = document.createElement('div');
            div.className = 'shadow-div';
            div.innerHTML = '<p class="shadow-p">Shadow content</p>';
            shadow.appendChild(div);
          }
        }
        customElements.define('test-shadow-component', TestShadowComponent);
      }

      // Slotted content component
      if (!customElements.get('test-slot-component')) {
        class TestSlotComponent extends HTMLElement {
          constructor() {
            super();
            const shadow = this.attachShadow({ mode: 'open' });
            shadow.innerHTML = `
              <div class="container">
                <slot name="header"></slot>
                <slot></slot>
              </div>
            `;
          }
        }
        customElements.define('test-slot-component', TestSlotComponent);
      }

      // Nested component with both shadow and slots
      if (!customElements.get('test-nested-component')) {
        class TestNestedComponent extends HTMLElement {
          constructor() {
            super();
            const shadow = this.attachShadow({ mode: 'open' });
            const innerComponent = document.createElement('test-shadow-component');
            const slotComponent = document.createElement('test-slot-component');
            const titleDiv = document.createElement('div');
            titleDiv.className = 'title';
            titleDiv.textContent = 'Nested component title';
            shadow.appendChild(titleDiv);
            shadow.appendChild(innerComponent);
            shadow.appendChild(slotComponent);
          }
        }
        customElements.define('test-nested-component', TestNestedComponent);
      }
    });

    // Core functionality tests
    describe('Regular DOM traversal', () => {
      it('should find elements in regular DOM', () => {
        document.body.innerHTML = '<div class="test-div">Test div</div>';
        const elements = $$('.test-div');
        expect(elements.length).toBe(1);
      });

      it('should find all matching elements', () => {
        document.body.innerHTML = `
          <div class="multi-test">Item 1</div>
          <div class="multi-test">Item 2</div>
          <div class="multi-test">Item 3</div>
        `;

        const elements = $$('.multi-test');
        expect(elements.length).toBe(3);
      });

      it('should handle DOM element as selector', () => {
        document.body.innerHTML = '<div id="target">Target div</div>';
        const targetEl = document.getElementById('target');

        const elements = $$(targetEl);
        expect(elements.length).toBe(1);
        expect(elements[0]).toBe(targetEl);
      });

      it('should handle empty results', () => {
        const elements = $$('.non-existent-class');
        expect(elements.length).toBe(0);
      });
    });

    // Shadow DOM specific tests
    describe('Shadow DOM traversal', () => {
      it('should find elements inside shadow DOM', () => {
        const component = document.createElement('test-shadow-component');
        document.body.appendChild(component);

        const shadowElements = $$('.shadow-p');
        expect(shadowElements.length).toBe(1);
        expect(shadowElements[0].textContent).toBe('Shadow content');
      });

      it('should find elements in both light and shadow DOM', () => {
        document.body.innerHTML = '<div class="shared-class">Light DOM</div>';

        const shadowEl = document.createElement('div');
        shadowEl.attachShadow({ mode: 'open' });
        shadowEl.shadowRoot.innerHTML = '<div class="shared-class">Shadow DOM</div>';
        document.body.appendChild(shadowEl);

        const elements = $$('.shared-class');
        expect(elements.length).toBe(2);
      });

      it('should match selectors across shadow boundaries', () => {
        const el = document.createElement('div');
        el.id = 'host-element';
        el.attachShadow({ mode: 'open' });
        el.shadowRoot.innerHTML = '<div class="inner">Inner content</div>';
        document.body.appendChild(el);

        const elements = $$('#host-element .inner');
        expect(elements.length).toBe(1);
      });

      it('should find elements at multiple shadow DOM levels', () => {
        const testComponent = document.createElement('test-nested-component');
        document.body.appendChild(testComponent);

        // Should find across multiple shadow boundaries
        const elements = $$('test-nested-component test-shadow-component .shadow-p');
        expect(elements.length).toBe(1);
      });
    });

    // Slotted content tests
    describe('Slotted content traversal', () => {
      it('should get text content of slotted nodes', () => {
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
        }
        customElements.define('test-text-component', TestComponent);

        const customElement = document.createElement('test-text-component');
        const span = document.createElement('span');
        span.slot = 'test';
        span.textContent = 'slotted text';
        customElement.appendChild(span);
        document.body.appendChild(customElement);

        // Find the slotted element directly
        const slottedElement = $$('span[slot="test"]');
        expect(slottedElement.length).toBe(1);
        expect(slottedElement[0].textContent).toBe('slotted text');
      });

      it('should find elements in slotted content', () => {
        document.body.innerHTML = `
          <test-slot-component>
            <div slot="header" class="slotted-header">Header Content</div>
            <p class="slotted-content">Default slot content</p>
          </test-slot-component>
        `;

        const headerElements = $$('.slotted-header');
        expect(headerElements.length).toBe(1);

        const contentElements = $$('.slotted-content');
        expect(contentElements.length).toBe(1);
      });

      it('should track complex selectors across slot boundaries', () => {
        document.body.innerHTML = `
          <test-slot-component>
            <div slot="header" class="parent">
              <span class="child">Child in slot</span>
            </div>
          </test-slot-component>
        `;

        const elements = $$('test-slot-component .parent .child');
        expect(elements.length).toBe(1);
      });
    });

    // Complex boundary crossing tests
    describe('Complex boundary crossing', () => {
      beforeAll(() => {
        if (!customElements.get('test-complex-component')) {
          class TestComplexComponent extends HTMLElement {
            constructor() {
              super();
              const shadow = this.attachShadow({ mode: 'open' });
              shadow.innerHTML = `
                <div class="wrapper">
                  <div class="internal">Internal content</div>
                  <slot name="content"></slot>
                </div>
              `;
            }
          }
          customElements.define('test-complex-component', TestComplexComponent);
        }
      });

      it('should traverse multiple boundary types in the same query', () => {
        document.body.innerHTML = `
          <test-complex-component>
            <test-slot-component slot="content">
              <div slot="header" class="target">Target Element</div>
            </test-slot-component>
          </test-complex-component>
        `;

        const elements = $$('.target');
        expect(elements.length).toBe(1);

        // Complex selector across boundaries
        const complexElements = $$('test-complex-component test-slot-component .target');
        expect(complexElements.length).toBe(1);
      });
    });

    // Deduplication and edge cases
    describe('Deduplication and edge cases', () => {
      it('should deduplicate elements in results', () => {
        document.body.innerHTML = `
          <div class="duplicate-test">Item</div>
          <test-shadow-component></test-shadow-component>
        `;

        // Find all divs (should not have duplicates)
        const elements = $$('div');

        // Convert to array then check uniqueness
        const elementsArray = elements.get();
        const uniqueCount = new Set(elementsArray).size;

        expect(elementsArray.length).toBe(uniqueCount);
      });

      it('should handle getRemainingSelector for partial matches', () => {
        const host = document.createElement('div');
        host.id = 'special-host';
        host.attachShadow({ mode: 'open' });
        host.shadowRoot.innerHTML = '<div class="inner"><span class="deep">Deep content</span></div>';
        document.body.appendChild(host);

        const elements = $$('#special-host .inner .deep');
        expect(elements.length).toBe(1);
      });

      it('should handle dynamically added content', () => {
        const component = document.createElement('test-slot-component');
        document.body.appendChild(component);

        // Initially, no elements with the target class
        let elements = $$('.dynamic-target');
        expect(elements.length).toBe(0);

        // Dynamically add content
        const dynamicEl = document.createElement('div');
        dynamicEl.className = 'dynamic-target';
        dynamicEl.textContent = 'Dynamic content';
        component.appendChild(dynamicEl);

        // Now the element should be found
        elements = $$('.dynamic-target');
        expect(elements.length).toBe(1);
      });
    });
  });
});
