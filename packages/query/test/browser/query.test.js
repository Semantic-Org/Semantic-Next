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

  describe('slot methods', () => {
    afterEach(() => {
      document.body.innerHTML = '';
    });

    beforeAll(() => {
      // Component with basic slots
      if (!customElements.get('test-slot-basic')) {
        class TestSlotBasic extends HTMLElement {
          constructor() {
            super();
            const shadow = this.attachShadow({ mode: 'open' });
            shadow.innerHTML = `
              <div class="wrapper">
                <slot name="header">Default header</slot>
                <slot>Default content</slot>
                <slot name="footer">Default footer</slot>
              </div>
            `;
          }
        }
        customElements.define('test-slot-basic', TestSlotBasic);
      }

      // Component with nested slots
      if (!customElements.get('test-slot-nested')) {
        class TestSlotNested extends HTMLElement {
          constructor() {
            super();
            const shadow = this.attachShadow({ mode: 'open' });
            shadow.innerHTML = `
              <div class="outer">
                <slot name="outer">
                  <div class="inner-container">
                    <slot name="inner">Inner default</slot>
                  </div>
                </slot>
              </div>
            `;
          }
        }
        customElements.define('test-slot-nested', TestSlotNested);
      }
    });

    describe('getSlot', () => {
      it('should get content from a named slot', () => {
        // Create and setup test component
        const component = document.createElement('test-slot-basic');
        const headerContent = document.createElement('h1');
        headerContent.slot = 'header';
        headerContent.textContent = 'Test Header';
        component.appendChild(headerContent);
        document.body.appendChild(component);

        // Get the content of the 'header' slot
        const slotContent = $(component).getSlot('header');
        expect(slotContent).toBe('Test Header');
      });

      it('should get content from the default slot', () => {
        // Create and setup test component
        const component = document.createElement('test-slot-basic');
        const defaultContent = document.createElement('p');
        defaultContent.textContent = 'Default Content';
        component.appendChild(defaultContent);
        document.body.appendChild(component);

        // Get the content of the default slot
        const slotContent = $(component).getSlot();
        expect(slotContent).toBe('Default Content');
      });

      it('should get content directly from a slot element', () => {
        // Create and setup component
        const component = document.createElement('test-slot-basic');
        const headerContent = document.createElement('h1');
        headerContent.slot = 'header';
        headerContent.textContent = 'Direct Slot Test';
        component.appendChild(headerContent);
        document.body.appendChild(component);

        // Get the slot element and then its content
        const slot = component.shadowRoot.querySelector('slot[name="header"]');
        const slotContent = $(slot).getSlot();
        expect(slotContent).toBe('Direct Slot Test');
      });

      it('should handle multiple slotted elements', () => {
        // Create and setup test component with multiple slotted elements
        const component = document.createElement('test-slot-basic');
        
        const item1 = document.createElement('p');
        item1.textContent = 'Item 1';
        
        const item2 = document.createElement('p');
        item2.textContent = 'Item 2';
        
        component.appendChild(item1);
        component.appendChild(item2);
        document.body.appendChild(component);

        // Get all default slotted content
        const slotContent = $(component).getSlot();
        expect(slotContent).toContain('Item 1');
        expect(slotContent).toContain('Item 2');
      });
    });

    describe('setSlot', () => {
      it('should set content in a named slot', () => {
        // Create test component
        const component = document.createElement('test-slot-basic');
        document.body.appendChild(component);

        // Set content in the 'header' slot
        $(component).setSlot('header', '<span>New Header</span>');

        // Verify the content was set correctly
        const headerSlot = component.querySelector('[slot="header"]');
        expect(headerSlot).not.toBeNull();
        expect(headerSlot.innerHTML).toBe('<span>New Header</span>');
      });

      it('should set content in the default slot', () => {
        // Create test component
        const component = document.createElement('test-slot-basic');
        document.body.appendChild(component);

        // Set content in the default slot
        $(component).setSlot('<div>New Default Content</div>');

        // Verify the content was set correctly (should not have a slot attribute)
        const defaultContent = component.querySelector(':not([slot])');
        expect(defaultContent).not.toBeNull();
        expect(defaultContent.textContent).toBe('New Default Content');
      });

      it('should update existing slotted content', () => {
        // Create component with existing slot content
        const component = document.createElement('test-slot-basic');
        const existingHeader = document.createElement('h2');
        existingHeader.slot = 'header';
        existingHeader.textContent = 'Existing Header';
        component.appendChild(existingHeader);
        document.body.appendChild(component);

        // Update the existing header slot
        $(component).setSlot('header', '<h3>Updated Header</h3>');

        // Verify the content was updated
        const updatedHeader = component.querySelector('[slot="header"]');
        expect(updatedHeader.innerHTML).toBe('<h3>Updated Header</h3>');
      });

      it('should set content via parent when working with a slot element', () => {
        // Create and setup component
        const component = document.createElement('test-slot-basic');
        document.body.appendChild(component);

        // Get the slot element directly
        const headerSlot = component.shadowRoot.querySelector('slot[name="header"]');
        expect(headerSlot).not.toBeNull();
        
        // Set content for the header slot via the component
        $(component).setSlot('header', '<strong>Set Via Component</strong>');

        // Verify the content was set correctly
        const slottedContent = component.querySelector('[slot="header"]');
        expect(slottedContent).not.toBeNull();
        expect(slottedContent.innerHTML).toBe('<strong>Set Via Component</strong>');
      });
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
