/**
 * Prototype tests for Vitest 4 browser APIs with Shadow DOM components
 * Testing: page locators, expect.element() retry, userEvent
 */

/*
  This is an example file to show patterns for Vitest 4
  This test is not actually run

import { page, userEvent } from 'vitest/browser';
import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { defineComponent } from '../../src/index.js';
import { Reaction } from '@semantic-ui/reactivity';


describe('Vitest 4 Browser APIs', () => {

  beforeEach(() => {
    document.body.innerHTML = '';
  });

  describe('page.elementLocator with Shadow DOM', () => {

    it('should wrap shadow DOM element for retriable assertions', async () => {
      // Define a simple component
      defineComponent({
        tagName: 'test-locator-component',
        template: '<div class="content">Hello World</div>',
      });

      // Create and mount
      const el = document.createElement('test-locator-component');
      document.body.appendChild(el);
      await el.updateComplete;

      // Get element from shadow DOM
      const content = el.shadowRoot.querySelector('.content');

      // Wrap in Vitest locator for retriable assertions
      await expect.element(page.elementLocator(content)).toHaveTextContent('Hello World');
    });

    it('should retry until reactive update completes', async () => {
      // Define a component with state
      defineComponent({
        tagName: 'test-reactive-locator',
        template: '<div class="count">{count}</div>',
        defaultState: { count: 0 },
        createComponent: ({ state }) => ({
          increment() {
            state.count.set(state.count.get() + 1);
          }
        }),
      });

      // Create and mount
      const el = document.createElement('test-reactive-locator');
      document.body.appendChild(el);
      await el.updateComplete;

      // Verify initial state
      expect(el.shadowRoot.querySelector('.count').textContent).toContain('0');

      // Trigger state change and flush reactivity
      el.component.increment();
      Reaction.flush();

      // Now DOM is updated synchronously
      const countEl = el.shadowRoot.querySelector('.count');
      await expect.element(page.elementLocator(countEl)).toHaveTextContent('1');
    });
  });

  describe('userEvent with components', () => {

    it('should handle click events on shadow DOM elements', async () => {
      defineComponent({
        tagName: 'test-click-component',
        template: '<button class="btn">Click me</button><div class="result">{clicked}</div>',
        defaultState: { clicked: 'not clicked' },
        events: {
          'click .btn': ({ state }) => {
            state.clicked.set('clicked!');
          }
        },
      });

      const el = document.createElement('test-click-component');
      document.body.appendChild(el);
      await el.updateComplete;

      const button = el.shadowRoot.querySelector('.btn');
      const result = el.shadowRoot.querySelector('.result');

      // Verify initial state
      await expect.element(page.elementLocator(result)).toHaveTextContent('not clicked');

      // Use userEvent to click
      await userEvent.click(button);

      // Should auto-retry until updated
      await expect.element(page.elementLocator(result)).toHaveTextContent('clicked!');
    });

    it('should handle typing in inputs', async () => {
      defineComponent({
        tagName: 'test-input-component',
        template: '<input class="input" type="text" /><div class="mirror">{inputValue}</div>',
        defaultState: { inputValue: '' },
        events: {
          'input .input': ({ state, target }) => {
            state.inputValue.set(target.value);
          }
        },
      });

      const el = document.createElement('test-input-component');
      document.body.appendChild(el);
      await el.updateComplete;

      const input = el.shadowRoot.querySelector('.input');
      const mirror = el.shadowRoot.querySelector('.mirror');

      // Type using userEvent
      await userEvent.type(input, 'Hello');

      // Should reflect in state
      await expect.element(page.elementLocator(mirror)).toHaveTextContent('Hello');
    });
  });

  describe('expect.element matchers', () => {

    it('should use toBeVisible for visibility checks', async () => {
      defineComponent({
        tagName: 'test-visibility-component',
        template: '{#if visible}<div class="shown">I am visible</div>{/if}',
        defaultState: { visible: false },
        createComponent: ({ state }) => ({
          show() { state.visible.set(true); },
          hide() { state.visible.set(false); }
        }),
      });

      const el = document.createElement('test-visibility-component');
      document.body.appendChild(el);
      await el.updateComplete;

      // Initially hidden - element doesn't exist
      expect(el.shadowRoot.querySelector('.shown')).toBeNull();

      // Show it
      el.component.show();

      // Wait for element to appear and be visible
      // Note: need to re-query after state change since element is created
      await el.updateComplete;
      const shown = el.shadowRoot.querySelector('.shown');
      await expect.element(page.elementLocator(shown)).toBeVisible();
    });

    it('should use toBeDisabled for form elements', async () => {
      defineComponent({
        tagName: 'test-disabled-component',
        template: '<button class="btn" disabled={isDisabled}>Submit</button>',
        defaultState: { isDisabled: true },
        createComponent: ({ state }) => ({
          enable() { state.isDisabled.set(false); }
        }),
      });

      const el = document.createElement('test-disabled-component');
      document.body.appendChild(el);
      await el.updateComplete;

      const button = el.shadowRoot.querySelector('.btn');

      // Initially disabled
      await expect.element(page.elementLocator(button)).toBeDisabled();

      // Enable it
      el.component.enable();

      // Should auto-retry until enabled
      await expect.element(page.elementLocator(button)).toBeEnabled();
    });
  });
});

*/
