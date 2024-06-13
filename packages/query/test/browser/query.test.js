import { describe, vi, beforeAll, beforeEach, afterEach, afterAll, it, expect } from 'vitest';
import { $ } from '@semantic-ui/query';

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

    it('should handle invoking methods on the globalThisProxy object', () => {
      const $window = $('window');
      const alertSpy = vi.spyOn(window, 'alert');

      $window.prop('alert')('Test alert');
      expect(alertSpy).toHaveBeenCalledWith('Test alert');
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
  });
});
