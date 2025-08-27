import { $, $$, Query } from '@semantic-ui/query';
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

  describe('clippingParent', () => {
    beforeEach(() => {
      document.body.innerHTML = '';
    });

    it('should find the clipping parent with overflow hidden', () => {
      document.body.innerHTML = `
        <div id="container" style="overflow: hidden; width: 200px; height: 200px;">
          <div id="child">Child element</div>
        </div>
      `;

      const $child = $('#child');
      const $clippingParent = $child.clippingParent();

      expect($clippingParent.length).toBe(1);
      expect($clippingParent[0]).toBe(document.getElementById('container'));
    });

    it('should find the clipping parent with overflow scroll', () => {
      document.body.innerHTML = `
        <div id="outer">
          <div id="scroller" style="overflow-y: scroll; height: 100px;">
            <div id="inner">Inner content</div>
          </div>
        </div>
      `;

      const $inner = $('#inner');
      const $clippingParent = $inner.clippingParent();

      expect($clippingParent.length).toBe(1);
      expect($clippingParent[0]).toBe(document.getElementById('scroller'));
    });

    it('should find the clipping parent with overflow auto', () => {
      document.body.innerHTML = `
        <div id="container" style="overflow: auto; width: 150px; height: 150px;">
          <div id="content">Content</div>
        </div>
      `;

      const $content = $('#content');
      const $clippingParent = $content.clippingParent();

      expect($clippingParent.length).toBe(1);
      expect($clippingParent[0]).toBe(document.getElementById('container'));
    });

    it('should return document.documentElement when no clipping parent found', () => {
      document.body.innerHTML = `
        <div id="outer" style="overflow: visible;">
          <div id="inner" style="overflow: visible;">
            <div id="target">Target</div>
          </div>
        </div>
      `;

      const $target = $('#target');
      const $clippingParent = $target.clippingParent();

      expect($clippingParent.length).toBe(1);
      expect($clippingParent[0]).toBe(document.documentElement);
    });

    it('should handle multiple elements', () => {
      document.body.innerHTML = `
        <div id="container1" style="overflow: hidden;">
          <div class="item" id="item1">Item 1</div>
        </div>
        <div id="container2" style="overflow: scroll;">
          <div class="item" id="item2">Item 2</div>
        </div>
      `;

      const $items = $('.item');
      const $clippingParents = $items.clippingParent();

      expect($clippingParents.length).toBe(2);
      expect($clippingParents[0]).toBe(document.getElementById('container1'));
      expect($clippingParents[1]).toBe(document.getElementById('container2'));
    });

    it('should handle empty selection', () => {
      const $empty = $('.nonexistent');
      const $clippingParent = $empty.clippingParent();

      expect($clippingParent.length).toBe(0);
    });

    it('should find nested clipping parents correctly', () => {
      document.body.innerHTML = `
        <div id="outer" style="overflow: hidden;">
          <div id="middle" style="overflow: visible;">
            <div id="inner" style="overflow: scroll;">
              <div id="target">Target</div>
            </div>
          </div>
        </div>
      `;

      const $target = $('#target');
      const $clippingParent = $target.clippingParent();

      // Should find the immediate clipping parent (inner), not the outer one
      expect($clippingParent.length).toBe(1);
      expect($clippingParent[0]).toBe(document.getElementById('inner'));
    });

    it('should find clipping parent with contain: paint', () => {
      document.body.innerHTML = `
        <div id="container" style="contain: paint;">
          <div id="child">Child element</div>
        </div>
      `;

      const $child = $('#child');
      const $clippingParent = $child.clippingParent();

      expect($clippingParent.length).toBe(1);
      expect($clippingParent[0]).toBe(document.getElementById('container'));
    });

    it('should find clipping parent with contain: layout', () => {
      document.body.innerHTML = `
        <div id="container" style="contain: layout;">
          <div id="child">Child element</div>
        </div>
      `;

      const $child = $('#child');
      const $clippingParent = $child.clippingParent();

      expect($clippingParent.length).toBe(1);
      expect($clippingParent[0]).toBe(document.getElementById('container'));
    });

    it('should find clipping parent with contain: size', () => {
      document.body.innerHTML = `
        <div id="container" style="contain: size;">
          <div id="child">Child element</div>
        </div>
      `;

      const $child = $('#child');
      const $clippingParent = $child.clippingParent();

      expect($clippingParent.length).toBe(1);
      expect($clippingParent[0]).toBe(document.getElementById('container'));
    });

    it('should find clipping parent with contain: strict', () => {
      document.body.innerHTML = `
        <div id="container" style="contain: strict;">
          <div id="child">Child element</div>
        </div>
      `;

      const $child = $('#child');
      const $clippingParent = $child.clippingParent();

      expect($clippingParent.length).toBe(1);
      expect($clippingParent[0]).toBe(document.getElementById('container'));
    });

    it('should find clipping parent with clip-path', () => {
      document.body.innerHTML = `
        <div id="container" style="clip-path: circle(50%);">
          <div id="child">Child element</div>
        </div>
      `;

      const $child = $('#child');
      const $clippingParent = $child.clippingParent();

      expect($clippingParent.length).toBe(1);
      expect($clippingParent[0]).toBe(document.getElementById('container'));
    });

    it('should find clipping parent with mask', () => {
      document.body.innerHTML = `
        <div id="container" style="mask: url(#mask);">
          <div id="child">Child element</div>
        </div>
      `;

      const $child = $('#child');
      const $clippingParent = $child.clippingParent();

      expect($clippingParent.length).toBe(1);
      expect($clippingParent[0]).toBe(document.getElementById('container'));
    });

    it('should find clipping parent with mask-image', () => {
      document.body.innerHTML = `
        <div id="container" style="mask-image: linear-gradient(black, transparent);">
          <div id="child">Child element</div>
        </div>
      `;

      const $child = $('#child');
      const $clippingParent = $child.clippingParent();

      expect($clippingParent.length).toBe(1);
      expect($clippingParent[0]).toBe(document.getElementById('container'));
    });

    it('should not consider contain: style as clipping', () => {
      document.body.innerHTML = `
        <div id="container" style="contain: style;">
          <div id="child">Child element</div>
        </div>
      `;

      const $child = $('#child');
      const $clippingParent = $child.clippingParent();

      expect($clippingParent.length).toBe(1);
      expect($clippingParent[0]).toBe(document.documentElement);
    });
  });

  describe('containingParent', () => {
    beforeEach(() => {
      document.body.innerHTML = '';
    });

    it('should find containing parent with position relative', () => {
      document.body.innerHTML = `
        <div id="container" style="position: relative;">
          <div id="child" style="position: absolute;">Child</div>
        </div>
      `;

      const $child = $('#child');
      const $containingParent = $child.containingParent();

      expect($containingParent.length).toBe(1);
      expect($containingParent[0]).toBe(document.getElementById('container'));
    });

    it('should find containing parent with transform', () => {
      document.body.innerHTML = `
        <div id="transformed" style="transform: translateX(10px);">
          <div id="child">Child</div>
        </div>
      `;

      const $child = $('#child');
      const $containingParent = $child.containingParent();

      expect($containingParent.length).toBe(1);
      expect($containingParent[0]).toBe(document.getElementById('transformed'));
    });

    it('should find containing parent with filter', () => {
      document.body.innerHTML = `
        <div id="filtered" style="filter: blur(1px);">
          <div id="child">Child</div>
        </div>
      `;

      const $child = $('#child');
      const $containingParent = $child.containingParent();

      expect($containingParent.length).toBe(1);
      expect($containingParent[0]).toBe(document.getElementById('filtered'));
    });

    it('should find containing parent with contain property', () => {
      document.body.innerHTML = `
        <div id="contained" style="contain: layout;">
          <div id="child">Child</div>
        </div>
      `;

      const $child = $('#child');
      const $containingParent = $child.containingParent();

      expect($containingParent.length).toBe(1);
      expect($containingParent[0]).toBe(document.getElementById('contained'));
    });

    it('should find containing parent with will-change', () => {
      document.body.innerHTML = `
        <div id="willchange" style="will-change: transform;">
          <div id="child">Child</div>
        </div>
      `;

      const $child = $('#child');
      const $containingParent = $child.containingParent();

      expect($containingParent.length).toBe(1);
      expect($containingParent[0]).toBe(document.getElementById('willchange'));
    });

    it('should return containing parent for fixed', () => {
      document.body.innerHTML = `
        <div id="container" style="position: relative;">
          <div id="fixed" style="position: fixed;">Fixed element</div>
        </div>
      `;

      const $fixed = $('#fixed');
      const $containingParent = $fixed.containingParent();

      expect($containingParent.length).toBe(1);
      expect($containingParent[0]).toBe(document.body);
    });

    it('should return document.body when no containing parent found', () => {
      document.body.innerHTML = `
        <div id="outer" style="position: static;">
          <div id="inner" style="position: static;">
            <div id="target">Target</div>
          </div>
        </div>
      `;

      const $target = $('#target');
      const $containingParent = $target.containingParent();

      expect($containingParent.length).toBe(1);
      expect($containingParent[0]).toBe(document.body);
    });

    it('should use browser offsetParent when calculate is false', () => {
      document.body.innerHTML = `
        <div id="container" style="position: relative;">
          <div id="child">Child</div>
        </div>
      `;

      const $child = $('#child');
      const $containingParent = $child.containingParent({ calculate: false });

      expect($containingParent.length).toBe(1);
      expect($containingParent[0]).toBe(document.getElementById('child').offsetParent);
    });

    it('should handle multiple elements', () => {
      document.body.innerHTML = `
        <div id="container1" style="position: relative;">
          <div class="item" id="item1">Item 1</div>
        </div>
        <div id="container2" style="transform: scale(1);">
          <div class="item" id="item2">Item 2</div>
        </div>
      `;

      const $items = $('.item');
      const $containingParents = $items.containingParent();

      expect($containingParents.length).toBe(2);
      expect($containingParents[0]).toBe(document.getElementById('container1'));
      expect($containingParents[1]).toBe(document.getElementById('container2'));
    });

    it('should handle empty selection', () => {
      const $empty = $('.nonexistent');
      const $containingParent = $empty.containingParent();

      expect($containingParent.length).toBe(0);
    });

    it('should find nearest containing parent in nested contexts', () => {
      document.body.innerHTML = `
        <div id="outer" style="position: relative;">
          <div id="middle" style="position: static;">
            <div id="inner" style="transform: translateY(5px);">
              <div id="target">Target</div>
            </div>
          </div>
        </div>
      `;

      const $target = $('#target');
      const $containingParent = $target.containingParent();

      // Should find the immediate containing parent (inner), not the outer one
      expect($containingParent.length).toBe(1);
      expect($containingParent[0]).toBe(document.getElementById('inner'));
    });
  });

  describe('Dimensional Methods (Browser-dependent)', () => {
    beforeEach(() => {
      document.body.innerHTML = '';
    });

    describe('width and height with options', () => {
      it('should get content-only dimensions by default', () => {
        const div = document.createElement('div');
        div.style.cssText =
          'width: 200px; height: 100px; padding: 10px; border: 5px solid black; margin: 20px; box-sizing: content-box;';
        document.body.appendChild(div);

        const width = $('div').width();
        const height = $('div').height();

        expect(width).toBe(200);
        expect(height).toBe(100);
      });

      it('should get dimensions including padding with includePadding option', () => {
        const div = document.createElement('div');
        div.style.cssText =
          'width: 200px; height: 100px; padding: 10px; border: 5px solid black; box-sizing: content-box;';
        document.body.appendChild(div);

        const width = $('div').width({ includePadding: true });
        const height = $('div').height({ includePadding: true });

        expect(width).toBe(220); // 200 + 20 padding
        expect(height).toBe(120); // 100 + 20 padding
      });

      it('should get dimensions including border with includeBorder option', () => {
        const div = document.createElement('div');
        div.style.cssText =
          'width: 200px; height: 100px; padding: 10px; border: 5px solid black; box-sizing: content-box;';
        document.body.appendChild(div);

        const width = $('div').width({ includePadding: true, includeBorder: true });
        const height = $('div').height({ includePadding: true, includeBorder: true });

        expect(width).toBe(230); // 200 + 20 padding + 10 border
        expect(height).toBe(130); // 100 + 20 padding + 10 border
      });

      it('should get dimensions including margin with includeMargin option', () => {
        const div = document.createElement('div');
        div.style.cssText =
          'width: 200px; height: 100px; padding: 10px; border: 5px solid black; margin: 20px; box-sizing: content-box;';
        document.body.appendChild(div);

        const width = $('div').width({ includePadding: true, includeBorder: true, includeMargin: true });
        const height = $('div').height({ includePadding: true, includeBorder: true, includeMargin: true });

        expect(width).toBe(270); // 200 + 20 padding + 10 border + 40 margin
        expect(height).toBe(170); // 100 + 20 padding + 10 border + 40 margin
      });

      it('should work with border-box sizing', () => {
        const div = document.createElement('div');
        div.style.cssText =
          'width: 200px; height: 100px; padding: 10px; border: 5px solid black; margin: 20px; box-sizing: border-box;';
        document.body.appendChild(div);

        // With border-box, width: 200px means total width including padding and border
        // So content width should be 200 - 20 padding - 10 border = 170px
        const contentWidth = $('div').width();
        const contentHeight = $('div').height();

        expect(contentWidth).toBe(170); // 200 - 20 padding - 10 border
        expect(contentHeight).toBe(70); // 100 - 20 padding - 10 border

        const totalWidth = $('div').width({ includePadding: true, includeBorder: true });
        const totalHeight = $('div').height({ includePadding: true, includeBorder: true });

        expect(totalWidth).toBe(200); // Total including padding and border
        expect(totalHeight).toBe(100); // Total including padding and border
      });

      it('should work with multiple elements', () => {
        const div1 = document.createElement('div');
        const div2 = document.createElement('div');
        div1.style.cssText = 'width: 200px; height: 100px; padding: 10px; box-sizing: content-box;';
        div2.style.cssText = 'width: 300px; height: 150px; padding: 15px; box-sizing: content-box;';
        div1.className = 'test';
        div2.className = 'test';
        document.body.appendChild(div1);
        document.body.appendChild(div2);

        const widths = $('.test').width();
        const heights = $('.test').height();

        expect(widths).toEqual([200, 300]);
        expect(heights).toEqual([100, 150]);
      });
    });

    describe('innerWidth and innerHeight', () => {
      it('should return content + padding dimensions', () => {
        const div = document.createElement('div');
        div.style.cssText =
          'width: 200px; height: 100px; padding: 10px; border: 5px solid black; box-sizing: content-box;';
        document.body.appendChild(div);

        const width = $('div').innerWidth();
        const height = $('div').innerHeight();

        expect(width).toBe(220); // 200 content + 20 padding
        expect(height).toBe(120); // 100 content + 20 padding
      });
    });

    describe('outerWidth and outerHeight', () => {
      it('should return content + padding + border dimensions by default', () => {
        const div = document.createElement('div');
        div.style.cssText =
          'width: 200px; height: 100px; padding: 10px; border: 5px solid black; margin: 20px; box-sizing: content-box;';
        document.body.appendChild(div);

        const width = $('div').outerWidth();
        const height = $('div').outerHeight();

        expect(width).toBe(230); // 200 content + 20 padding + 10 border
        expect(height).toBe(130); // 100 content + 20 padding + 10 border
      });

      it('should include margin when specified', () => {
        const div = document.createElement('div');
        div.style.cssText =
          'width: 200px; height: 100px; padding: 10px; border: 5px solid black; margin: 20px; box-sizing: content-box;';
        document.body.appendChild(div);

        const width = $('div').outerWidth({ includeMargin: true });
        const height = $('div').outerHeight({ includeMargin: true });

        expect(width).toBe(270); // 200 content + 20 padding + 10 border + 40 margin
        expect(height).toBe(170); // 100 content + 20 padding + 10 border + 40 margin
      });
    });
  });

  describe('naturalDisplay', () => {
    beforeEach(() => {
      document.body.innerHTML = '';
    });

    it('should return block as default for elements without CSS rules', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);

      const result = $('div').naturalDisplay();
      expect(result).toBe('block');
    });

    it('should return array for multiple elements', () => {
      const div1 = document.createElement('div');
      const div2 = document.createElement('div');
      div1.style.display = 'inline';
      div2.style.display = 'none';
      document.body.appendChild(div1);
      document.body.appendChild(div2);

      const results = $('div').naturalDisplay();
      expect(Array.isArray(results)).toBe(true);
      expect(results).toHaveLength(2);
      expect(results[0]).toBe('inline');
      expect(results[1]).toBe('block'); // Should ignore 'none' and find natural display
    });

    it('should return single value for one element', () => {
      const span = document.createElement('span');
      document.body.appendChild(span);

      const result = $('span').naturalDisplay();
      expect(typeof result).toBe('string');
      expect(result).toBe('inline'); // Default for span when no CSS rules found
    });

    it('should ignore display: none rules and find highest specificity non-none rule', () => {
      // Create a style element with CSS rules
      const style = document.createElement('style');
      style.textContent = `
        .test-element { display: none; }
        .visible-element { display: inline-block; }
      `;
      document.head.appendChild(style);

      const div = document.createElement('div');
      div.className = 'test-element visible-element';
      div.style.display = 'none';
      document.body.appendChild(div);

      const result = $('div').naturalDisplay();
      expect(result).toBe('inline-block');

      // Cleanup
      document.head.removeChild(style);
    });

    it('should handle elements with higher specificity rules', () => {
      // Create a style element with different specificity rules
      const style = document.createElement('style');
      style.textContent = `
        div { display: inline; }
        .specific { display: flex; }
        #very-specific { display: grid; }
      `;
      document.head.appendChild(style);

      const div = document.createElement('div');
      div.id = 'very-specific';
      div.className = 'specific';
      div.style.display = 'none';
      document.body.appendChild(div);

      const result = $('div').naturalDisplay();
      expect(result).toBe('grid'); // Highest specificity wins

      // Cleanup
      document.head.removeChild(style);
    });

    it('should handle nested CSS rules', () => {
      // Create a style element with nested CSS rules
      const style = document.createElement('style');
      style.textContent = `
        .container {
          display: block;
          
          .element {
            display: flex;
            
            &.hidden {
              display: none;
            }
            
            &.inline {
              display: inline-block;
            }
          }
        }
      `;
      document.head.appendChild(style);

      const div = document.createElement('div');
      div.className = 'container';
      document.body.appendChild(div);

      const element = document.createElement('div');
      element.className = 'element hidden inline';
      div.appendChild(element);

      const result = $('.element').naturalDisplay();
      // Should find 'inline-block' as it has higher specificity than 'flex'
      // and ignore 'none'
      expect(result).toBe('inline-block');

      // Cleanup
      document.head.removeChild(style);
    });

    it('should handle cross-origin stylesheet errors gracefully', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);

      // This should not throw an error even if there are cross-origin issues
      expect(() => {
        const result = $('div').naturalDisplay();
        expect(typeof result).toBe('string');
      }).not.toThrow();
    });

    it('should work with chaining', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);

      const $div = $('div').addClass('test');
      const result = $div.naturalDisplay();

      expect($div).toBeInstanceOf(Query);
      expect(typeof result).toBe('string');
      expect(div.classList.contains('test')).toBe(true);
    });
  });
});
