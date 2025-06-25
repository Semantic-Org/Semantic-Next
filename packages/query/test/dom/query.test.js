import { $, $$, exportGlobals, Query, restoreGlobals, useAlias } from '@semantic-ui/query';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

describe('query', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    $().removeAllEvents();
  });

  describe('Global helpers', () => {
    beforeEach(() => {
      // Clear any existing global variables before each test
      delete window.$;
      delete window.$$;
      delete window.Query;
    });

    describe('exportGlobals', () => {
      it('should attach $, $$, and Query to the global scope', () => {
        exportGlobals();
        expect(window.$).toBe($);
        expect(window.$$).toBe($$);
        expect(window.Query).toBe(Query);
      });

      it('should allow selective global exports', () => {
        exportGlobals({ dollar: true, doubleDollar: false, query: false });
        expect(window.$).toBe($);
        expect(window.$$).toBeUndefined();
        expect(window.Query).toBeUndefined();
      });
    });

    describe('restoreGlobals', () => {
      it('should restore the original values of $ and $$', () => {
        const originalDollar = window.$ = () => {};
        const originalDoubleDollar = window.$$ = () => {};

        exportGlobals();
        restoreGlobals();

        expect(window.$).toBe(originalDollar);
        expect(window.$$).toBe(originalDoubleDollar);
      });

      it('should remove Query from the global scope when specified', () => {
        exportGlobals();
        restoreGlobals({ removeQuery: true });
        expect(window.Query).toBeUndefined();
      });
    });

    describe('useAlias', () => {
      it('should create a new Query instance with the provided arguments', () => {
        const div = document.createElement('div');
        document.body.appendChild(div);

        const $alias = useAlias('div');
        expect($alias).toBeInstanceOf(Query);
        expect($alias[0]).toBe(div);
      });
    });
  });

  describe('selectors', () => {
    it('query should query DOM when given a selector', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);
      const $div = $('div');
      expect($div[0]).toBe(div);
    });

    it('query should allow DOM elements to be passed in', () => {
      const div = document.createElement('div');
      const $div = $(div);
      expect($div[0]).toBe(div);
    });

    it('query should allow an array of elements to be passed in', () => {
      const div = document.createElement('div');
      const div2 = document.createElement('div');
      const $div = $([div, div2]);
      expect($div[0]).toBe(div);
      expect($div[1]).toBe(div2);
    });

    it('query should allow a NodeList to be passed in', () => {
      const div = document.createElement('div');
      const div2 = document.createElement('div');
      document.body.appendChild(div);
      document.body.appendChild(div2);
      const $div = $(document.querySelectorAll('div'));
      expect($div[0]).toBe(div);
      expect($div[1]).toBe(div2);
    });
    it('should accept a NodeList as a selector', () => {
      const div1 = document.createElement('div');
      const div2 = document.createElement('div');
      document.body.appendChild(div1);
      document.body.appendChild(div2);
      const nodeList = document.querySelectorAll('div');
      const $result = $(nodeList);
      expect($result.length).toBe(2);
      expect($result[0]).toBe(div1);
      expect($result[1]).toBe(div2);
    });

    it('should accept a DocumentFragment as a selector', () => {
      const fragment = document.createDocumentFragment();
      const div1 = document.createElement('div');
      const div2 = document.createElement('div');
      fragment.appendChild(div1);
      fragment.appendChild(div2);
      const $result = $(fragment).find('div');
      expect($result.length).toBe(2);
      expect($result[0]).toBe(div1);
      expect($result[1]).toBe(div2);
    });

    it('should accept a custom element as a selector', () => {
      class CustomElement extends HTMLElement {}
      customElements.define('custom-element', CustomElement);
      const customElement = document.createElement('custom-element');
      document.body.appendChild(customElement);
      const $result = $(customElement);
      expect($result.length).toBe(1);
      expect($result[0]).toBe(customElement);
    });

    it('should create an element from an HTML string', () => {
      const $div = $('<div>Hello world</div>');
      expect($div.length).toBe(1);
      expect($div[0].tagName).toBe('DIV');
      expect($div[0].textContent).toBe('Hello world');
    });

    // Additional test case for HTML parsing with attributes
    it('should create an element from an HTML string with attributes', () => {
      const $div = $('<div class="test" id="myDiv">Hello world</div>');
      expect($div.length).toBe(1);
      expect($div[0].tagName).toBe('DIV');
      expect($div[0].textContent).toBe('Hello world');
      expect($div[0].className).toBe('test');
      expect($div[0].id).toBe('myDiv');
    });

    it('should create multiple elements from an HTML string', () => {
      const $elements = $('<p>One</p><p>Two</p>');
      expect($elements.length).toBe(2);
      expect($elements[0].tagName).toBe('P');
      expect($elements[0].textContent).toBe('One');
      expect($elements[1].tagName).toBe('P');
      expect($elements[1].textContent).toBe('Two');
    });

    // Additional test case for mixed content
    it('should handle mixed content in HTML string', () => {
      const $elements = $('<p>Paragraph</p><!-- Comment -->');
      expect($elements.length).toBe(2);
      expect($elements[0].nodeType).toBe(Node.ELEMENT_NODE);
      expect($elements[0].tagName).toBe('P');
      expect($elements[0].textContent).toBe('Paragraph');
      expect($elements[1].nodeType).toBe(Node.COMMENT_NODE);
    });
  });

  describe('find', () => {
    it('find should return all nested elements inside an element', () => {
      const div = document.createElement('div');
      const span = document.createElement('span');
      div.appendChild(span);
      document.body.appendChild(div);
      const $span = $('div').find('span');
      expect($span[0]).toBe(span);
    });

    it('find should return all nested elements inside multiple elements', () => {
      const div = document.createElement('div');
      const div2 = document.createElement('div');
      const span = document.createElement('span');
      const span2 = document.createElement('span');
      div.appendChild(span);
      div2.appendChild(span2);
      document.body.appendChild(div);
      document.body.appendChild(div2);
      const $span = $('div').find('span');
      expect($span[0]).toBe(span);
      expect($span[1]).toBe(span2);
    });
  });

  describe('siblings', () => {
    it('siblings should return all siblings of an element', () => {
      const div = document.createElement('div');
      const span = document.createElement('span');
      const span2 = document.createElement('span');
      document.body.appendChild(div);
      document.body.appendChild(span);
      document.body.appendChild(span2);
      expect($('span').siblings()[0]).toBe(div);
      expect($('span').siblings()[1]).toBe(span2);
    });

    it('siblings should return all siblings matching a selector', () => {
      const div = document.createElement('div');
      const span = document.createElement('span');
      const span2 = document.createElement('span');
      span2.classList.add('test');
      document.body.appendChild(div);
      document.body.appendChild(span);
      document.body.appendChild(span2);
      expect($('span').siblings('.test')[0]).toBe(span2);
    });
  });

  describe('is', () => {
    it('is should return true if all elements match a selector', () => {
      const div = document.createElement('div');
      const div2 = document.createElement('div');
      div.classList.add('test');
      div2.classList.add('test');
      document.body.appendChild(div);
      document.body.appendChild(div2);
      expect($('div').is('.test')).toBe(true);
    });

    it('is should return false if not all elements match a selector', () => {
      const div = document.createElement('div');
      const div2 = document.createElement('div');
      div.classList.add('test');
      document.body.appendChild(div);
      document.body.appendChild(div2);
      expect($('div').is('.test')).toBe(false);
    });
  });

  describe('index', () => {
    it('index should return -1 if no matching element is found among its siblings', () => {
      const div = document.createElement('div');
      const span = document.createElement('span');
      document.body.appendChild(div);
      document.body.appendChild(span);
      expect($('p').index()).toBe(-1);
    });

    it('index should return the first matching index', () => {
      const div = document.createElement('div');
      const span = document.createElement('span');
      document.body.appendChild(div);
      document.body.appendChild(span);
      document.body.appendChild(span);
      document.body.appendChild(span);
      expect($('span').index()).toBe(1);
    });

    it('index should return the indexes of multiple element among its siblings', () => {
      const div = document.createElement('div');
      const span = document.createElement('span');
      const span2 = document.createElement('span');
      document.body.appendChild(div);
      document.body.appendChild(span);
      document.body.appendChild(span2);
      expect($('span').index()).toBe(1);
    });

    it('index should return the index of the first element when no argument is passed', () => {
      const div = document.createElement('div');
      const span1 = document.createElement('span');
      const span2 = document.createElement('span');
      document.body.appendChild(div);
      document.body.appendChild(span1);
      document.body.appendChild(span2);
      expect($('span').index()).toBe(1);
    });

    it('index should return -1 when the element is not found within the collection', () => {
      const div = document.createElement('div');
      const span = document.createElement('span');
      document.body.appendChild(div);
      document.body.appendChild(span);
      expect($('div').index(span)).toBe(-1);
    });

    it('index should return -1 when the selector does not match any elements', () => {
      const div = document.createElement('div');
      const span = document.createElement('span');
      document.body.appendChild(div);
      document.body.appendChild(span);
      expect($('span').index('.non-existent')).toBe(-1);
    });
  });

  describe('indexOf', () => {
    it('index should return the index of an element among its siblings matching a selector', () => {
      const div = document.createElement('div');
      const span = document.createElement('span');
      const span2 = document.createElement('span');
      span2.classList.add('test');
      document.body.appendChild(div);
      document.body.appendChild(span);
      document.body.appendChild(span2);
      expect($('span').indexOf('.test')).toBe(1);
    });

    it('index should return the index of the element within the collection when a DOM element is passed', () => {
      const div = document.createElement('div');
      const span1 = document.createElement('span');
      const span2 = document.createElement('span');
      document.body.appendChild(div);
      document.body.appendChild(span1);
      document.body.appendChild(span2);
      expect($('span').indexOf(span2)).toBe(1);
    });

    it('index should return the index of the element within the collection when a Query object is passed', () => {
      const div = document.createElement('div');
      const span1 = document.createElement('span');
      const span2 = document.createElement('span');
      document.body.appendChild(div);
      document.body.appendChild(span1);
      document.body.appendChild(span2);
      expect($('span').indexOf($('span').eq(1))).toBe(1);
    });
  });

  describe('not', () => {
    it('not should filter out elements that match a selector', () => {
      const div = document.createElement('div');
      const div2 = document.createElement('div');
      div2.classList.add('test');
      document.body.appendChild(div);
      document.body.appendChild(div2);
      const $div = $('div').not('.test');
      expect($div[0]).toBe(div);
    });
  });

  describe('closest', () => {
    it('closest should return the closest parent matching a selector', () => {
      const div = document.createElement('div');
      const span = document.createElement('span');
      div.appendChild(span);
      document.body.appendChild(div);
      const $span = $('span').closest('div');
      expect($span[0]).toBe(div);
    });

    it('closest should not return a parent if it does not match a selector', () => {
      const div = document.createElement('div');
      const span = document.createElement('span');
      span.classList.add('test');
      div.appendChild(span);
      document.body.appendChild(div);
      const $span = $('span').closest('.test2');
      expect($span.length).toBe(0);
    });
  });

  describe('closestDeep', () => {
    it('should return the closest ancestor matching a selector', () => {
      const div = document.createElement('div');
      const span = document.createElement('span');
      div.appendChild(span);
      document.body.appendChild(div);

      const $span = $('span', { pierceShadow: true });
      const $closest = $span.closest('div');
      expect($closest.get(0)).toBe(div);
    });

    it('should return the closest ancestor matching a DOM element', () => {
      const div = document.createElement('div');
      const span = document.createElement('span');
      div.appendChild(span);
      document.body.appendChild(div);

      const $span = $('span', { pierceShadow: true });
      const $closest = $span.closest(div);
      expect($closest.get(0)).toBe(div);
    });

    it('should return an empty Query instance if no matching ancestor is found', () => {
      const div = document.createElement('div');
      const span = document.createElement('span');
      div.appendChild(span);
      document.body.appendChild(div);

      const $span = $('span', { pierceShadow: true });
      const $closest = $span.closest('p');
      expect($closest.length).toBe(0);
    });
  });

  describe('closestAll', () => {
    it('should return all ancestor elements matching a selector', () => {
      const div1 = document.createElement('div');
      const div2 = document.createElement('div');
      const div3 = document.createElement('div');
      const span = document.createElement('span');
      
      div1.classList.add('container');
      div2.classList.add('container');
      div3.classList.add('container');
      
      // Nested structure: div1 > div2 > div3 > span
      div3.appendChild(span);
      div2.appendChild(div3);
      div1.appendChild(div2);
      document.body.appendChild(div1);

      const $span = $('span');
      const $allContainers = $span.closestAll('.container');
      
      expect($allContainers.length).toBe(3);
      expect($allContainers.get()).toContain(div1);
      expect($allContainers.get()).toContain(div2);
      expect($allContainers.get()).toContain(div3);
    });

    it('should return empty Query if no ancestors match', () => {
      const div = document.createElement('div');
      const span = document.createElement('span');
      div.appendChild(span);
      document.body.appendChild(div);

      const $span = $('span');
      const $ancestors = $span.closestAll('.nonexistent');
      
      expect($ancestors.length).toBe(0);
    });

    it('should work with multiple elements', () => {
      const container1 = document.createElement('div');
      const container2 = document.createElement('div');
      const span1 = document.createElement('span');
      const span2 = document.createElement('span');
      
      container1.classList.add('container');
      container2.classList.add('container');
      
      container1.appendChild(span1);
      container2.appendChild(span2);
      document.body.appendChild(container1);
      document.body.appendChild(container2);

      const $spans = $('span');
      const $containers = $spans.closestAll('.container');
      
      expect($containers.length).toBe(2);
      expect($containers.get()).toContain(container1);
      expect($containers.get()).toContain(container2);
    });

    it('should remove duplicates when multiple elements have same ancestor', () => {
      const sharedContainer = document.createElement('div');
      const span1 = document.createElement('span');
      const span2 = document.createElement('span');
      
      sharedContainer.classList.add('container');
      
      sharedContainer.appendChild(span1);
      sharedContainer.appendChild(span2);
      document.body.appendChild(sharedContainer);

      const $spans = $('span');
      const $containers = $spans.closestAll('.container');
      
      expect($containers.length).toBe(1);
      expect($containers.get(0)).toBe(sharedContainer);
    });

    it('should work with pierceShadow option', () => {
      const div1 = document.createElement('div');
      const div2 = document.createElement('div');
      const span = document.createElement('span');
      
      div1.classList.add('container');
      div2.classList.add('container');
      
      div2.appendChild(span);
      div1.appendChild(div2);
      document.body.appendChild(div1);

      const $span = $('span', { pierceShadow: true });
      const $containers = $span.closestAll('.container');
      
      expect($containers.length).toBe(2);
      expect($containers.get()).toContain(div1);
      expect($containers.get()).toContain(div2);
    });
  });

  describe('filter', () => {
    it('filter should return elements that match a selector', () => {
      const div = document.createElement('div');
      const div2 = document.createElement('div');
      div2.classList.add('test');
      document.body.appendChild(div);
      document.body.appendChild(div2);
      const $div = $('div').filter('.test');
      expect($div[0]).toBe(div2);
    });

    it('filter should return elements that match a function', () => {
      const div = document.createElement('div');
      const div2 = document.createElement('div');
      div2.classList.add('test');
      document.body.appendChild(div);
      document.body.appendChild(div2);
      const $div = $('div').filter((el) => el.classList.contains('test'));
      expect($div[0]).toBe(div2);
    });
  });

  describe('children', () => {
    it('children should return all children of an element', () => {
      const div = document.createElement('div');
      const span = document.createElement('span');
      div.appendChild(span);
      document.body.appendChild(div);
      const $div = $('div').children();
      expect($div[0]).toBe(span);
    });

    it('children should return all children matching a selector', () => {
      const div = document.createElement('div');
      const span = document.createElement('span');
      const span2 = document.createElement('span');
      span2.classList.add('test');
      div.appendChild(span);
      div.appendChild(span2);
      document.body.appendChild(div);
      const $div = $('div').children('.test');
      expect($div[0]).toBe(span2);
    });

    it('children return an array of children when iterating over multiple elements', () => {
      const div = document.createElement('div');
      const div2 = document.createElement('div');
      const span = document.createElement('span');
      const span2 = document.createElement('span');
      div.appendChild(span);
      div2.appendChild(span2);
      document.body.appendChild(div);
      document.body.appendChild(div2);
      const $div = $('div').children();
      expect($div[0]).toBe(span);
      expect($div[1]).toBe(span2);
    });
  });

  describe('parent', () => {
    it('parent should return the parent of an element', () => {
      const div = document.createElement('div');
      const span = document.createElement('span');
      div.appendChild(span);
      document.body.appendChild(div);
      const $span = $('span').parent();
      expect($span[0]).toBe(div);
    });

    it('parent should return the parent of an element matching a selector', () => {
      const div = document.createElement('div');
      const span = document.createElement('span');
      div.classList.add('test');
      div.appendChild(span);
      document.body.appendChild(div);
      const $test = $('span').parent('.test');
      expect($test[0]).toBe(div);
    });

    it('parent should not return a parent if it does not match a selector', () => {
      const div = document.createElement('div');
      const span = document.createElement('span');
      span.classList.add('test');
      div.appendChild(span);
      document.body.appendChild(div);
      const $span = $('span').parent('.test2');
      expect($span.length).toBe(0);
    });
  });

  describe('dispatchEvent', () => {
    it('should dispatch custom events with different event options', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);
      const handler = vi.fn();
      div.addEventListener('custom-event', handler);
      $('div').dispatchEvent('custom-event', { foo: 'bar' });
      expect(handler).toHaveBeenCalledWith(expect.any(CustomEvent));
      expect(handler.mock.calls[0][0].type).toBe('custom-event');
      expect(handler.mock.calls[0][0].detail).toEqual({ foo: 'bar' });
      expect(handler.mock.calls[0][0].bubbles).toBe(true);
      expect(handler.mock.calls[0][0].cancelable).toBe(true);
    });

    it('should dispatch events on multiple elements', () => {
      const div1 = document.createElement('div');
      const div2 = document.createElement('div');
      document.body.appendChild(div1);
      document.body.appendChild(div2);
      const handler1 = vi.fn();
      const handler2 = vi.fn();
      div1.addEventListener('custom-event', handler1);
      div2.addEventListener('custom-event', handler2);
      $('div').dispatchEvent('custom-event');
      expect(handler1).toHaveBeenCalled();
      expect(handler2).toHaveBeenCalled();
    });
  });

  describe('on', () => {
    it('should attach an event handler to elements', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);
      const callback = vi.fn();

      $('div').on('click', callback);

      div.click();

      expect(callback).toHaveBeenCalled();
    });

    it('should attach an event handler to multiple elements', () => {
      const div = document.createElement('div');
      const div2 = document.createElement('div');
      document.body.appendChild(div);
      document.body.appendChild(div2);
      const callback = vi.fn();

      $('div').on('click', callback);

      div.click();
      div2.click();

      expect(callback).toHaveBeenCalledTimes(2);
    });

    it('should attach multiple event handlers to elements', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);
      const callback = vi.fn();
      const callback2 = vi.fn();

      $('div').on('click', callback);
      $('div').on('click', callback2);

      div.click();

      expect(callback).toHaveBeenCalled();
      expect(callback2).toHaveBeenCalled();
    });

    it('should return an array of event handlers when multiple attached', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);
      const div2 = document.createElement('div');
      document.body.appendChild(div2);

      const eventHandlers = $('div').on('click', () => {});

      expect(eventHandlers.length).toBe(2);
    });

    it('should return a single event handler when only one attached', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);

      const eventHandler = $('div').on('click', () => {}, { returnHandler: true });
      expect(eventHandler).toBeInstanceOf(Object);
    });

    it('should be able to remove event handlers using custom abortController', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);
      const callback = vi.fn();
      const abortController = new AbortController();
      const eventHandler = $('div').on('click', callback, { abortController });
      div.click();
      abortController.abort();
      div.click();
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should be able to remove event handlers using returned abortController', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);
      const callback = vi.fn();

      const eventHandler = $('div').on('click', callback, { returnHandler: true });
      div.click();
      eventHandler.abort();
      div.click();
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should be able to use event delegation', () => {
      const div = document.createElement('div');
      const span = document.createElement('span');
      div.appendChild(span);
      document.body.appendChild(div);
      const callback = vi.fn();

      $('div').on('click', 'span', callback);
      span.click();

      expect(callback).toHaveBeenCalled();
    });

    it('should be able to pass in custom abortController', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);
      const callback = vi.fn();
      const abortController = new AbortController();

      $('div').on('click', callback, { abortController });
      abortController.abort();
      div.click();
      expect(callback).not.toHaveBeenCalled();
    });

    it('should have delegated set on return object is delegated', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);
      const callback = vi.fn();

      const eventHandler = $('div').on('click', 'span', callback, { returnHandler: true });
      expect(eventHandler.delegated).toBe(true);
    });

    it('should have delegated not set on return object is delegated', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);
      const callback = vi.fn();

      const eventHandler = $('div').on('click', 'span', callback, { returnHandler: true });
      expect(eventHandler.delegated).toBe(true);
    });

    it('should return the native event on return object eventListener', () => {
      const div = document.createElement('div');
      const callback = vi.fn();
      document.body.appendChild(div);
      const eventHandler = $('div').on('click', callback, { returnHandler: true });
      div.removeEventListener('click', eventHandler.eventListener);
      div.click();
      expect(callback).not.toHaveBeenCalled();
    });

    it('should attach multiple event handlers when passing space-separated events', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);
      const callback = vi.fn();

      $('div').on('mouseup touchmove', callback);

      div.dispatchEvent(new Event('mouseup'));
      expect(callback).toHaveBeenCalledTimes(1);

      div.dispatchEvent(new Event('touchmove'));
      expect(callback).toHaveBeenCalledTimes(2);
    });

    it('should handle multiple events with delegation', () => {
      const div = document.createElement('div');
      const span = document.createElement('span');
      div.appendChild(span);
      document.body.appendChild(div);
      const callback = vi.fn();

      $('div').on('mouseup touchmove', 'span', callback);

      span.dispatchEvent(new Event('mouseup', { bubbles: true }));
      expect(callback).toHaveBeenCalledTimes(1);

      span.dispatchEvent(new Event('touchmove', { bubbles: true }));
      expect(callback).toHaveBeenCalledTimes(2);
    });

    it('should handle multiple events with options', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);
      const callback = vi.fn();
      const abortController = new AbortController();

      $('div').on('mouseup touchmove', callback, { abortController });

      div.dispatchEvent(new Event('mouseup'));
      div.dispatchEvent(new Event('touchmove'));
      expect(callback).toHaveBeenCalledTimes(2);

      abortController.abort();
      div.dispatchEvent(new Event('mouseup'));
      div.dispatchEvent(new Event('touchmove'));
      expect(callback).toHaveBeenCalledTimes(2); // Count shouldn't increase
    });

    it('should handle multiple events with delegation and options', () => {
      const div = document.createElement('div');
      const span = document.createElement('span');
      div.appendChild(span);
      document.body.appendChild(div);
      const callback = vi.fn();
      const abortController = new AbortController();

      $('div').on('mouseup touchmove', 'span', callback, { abortController });

      span.dispatchEvent(new Event('mouseup', { bubbles: true }));
      span.dispatchEvent(new Event('touchmove', { bubbles: true }));
      expect(callback).toHaveBeenCalledTimes(2);

      abortController.abort();
      span.dispatchEvent(new Event('mouseup', { bubbles: true }));
      span.dispatchEvent(new Event('touchmove', { bubbles: true }));
      expect(callback).toHaveBeenCalledTimes(2); // Count shouldn't increase
    });

    it('should handle empty spaces in event string', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);
      const callback = vi.fn();

      $('div').on('  mouseup   touchmove  ', callback);

      div.dispatchEvent(new Event('mouseup'));
      div.dispatchEvent(new Event('touchmove'));
      expect(callback).toHaveBeenCalledTimes(2);
    });

    it('should return handlers for all events when returnHandler is true', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);
      const callback = vi.fn();

      const handlers = $('div').on('mouseup touchmove', callback, { returnHandler: true });
      expect(Array.isArray(handlers)).toBe(true);
      expect(handlers.length).toBe(2);
      expect(handlers[0].eventName).toBe('mouseup');
      expect(handlers[1].eventName).toBe('touchmove');
    });

    it('should properly remove specific events using off()', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);
      const callback = vi.fn();

      $('div').on('mouseup touchmove', callback);

      div.dispatchEvent(new Event('mouseup'));
      div.dispatchEvent(new Event('touchmove'));
      expect(callback).toHaveBeenCalledTimes(2);

      $('div').off('mouseup');
      div.dispatchEvent(new Event('mouseup'));
      div.dispatchEvent(new Event('touchmove'));
      expect(callback).toHaveBeenCalledTimes(3); // Only touchmove should trigger
    });
  });

  describe('one', () => {
    it('one should attach a one-time event handler to elements', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);
      const callback = vi.fn();

      $('div').one('click', callback);

      div.click();
      div.click();

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple space-separated events and remove all handlers after any one fires', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);
      const callback = vi.fn();

      $('div').one('mouseup mouseleave', callback);

      // First event should trigger callback
      div.dispatchEvent(new Event('mouseup'));
      expect(callback).toHaveBeenCalledTimes(1);

      // Second event shouldn't trigger since handlers were removed
      div.dispatchEvent(new Event('mouseleave'));
      expect(callback).toHaveBeenCalledTimes(1);

      // Original event also shouldn't trigger again
      div.dispatchEvent(new Event('mouseup'));
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple events with delegation', () => {
      const div = document.createElement('div');
      const span = document.createElement('span');
      div.appendChild(span);
      document.body.appendChild(div);
      const callback = vi.fn();

      $('div').one('mouseup mouseleave', 'span', callback);

      span.dispatchEvent(new Event('mouseup', { bubbles: true }));
      expect(callback).toHaveBeenCalledTimes(1);

      span.dispatchEvent(new Event('mouseleave', { bubbles: true }));
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should handle three or more space-separated events', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);
      const callback = vi.fn();

      $('div').one('mouseup mouseleave click', callback);

      div.dispatchEvent(new Event('mouseup'));
      expect(callback).toHaveBeenCalledTimes(1);

      div.dispatchEvent(new Event('mouseleave'));
      div.dispatchEvent(new Event('click'));
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should group one handlers not calling others in group', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);
      const callback = vi.fn();

      $('div').one('mouseup mouseleave', callback);

      div.dispatchEvent(new Event('mouseup'));
      expect(callback).toHaveBeenCalledTimes(1);

      div.dispatchEvent(new Event('mouseleave'));
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should remove handlers based on grouping', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      $('div')
        .one('mouseup mouseleave', callback1)
        .one('click mouseup', callback2); // mouseup added twice

      div.dispatchEvent(new Event('mouseup'));
      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledTimes(1);

      div.dispatchEvent(new Event('click'));
      div.dispatchEvent(new Event('mouseleave'));
      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledTimes(1);
    });

    it('should handle nested events correctly', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);
      const callback = vi.fn(() => {
        // Trigger another event inside the handler
        div.dispatchEvent(new Event('mouseleave'));
      });

      $('div').one('mouseup mouseleave', callback);

      div.dispatchEvent(new Event('mouseup'));
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should work with dynamically added elements', () => {
      const callback = vi.fn();
      $(document).one('click mouseup', 'div', callback);

      const div = document.createElement('div');
      document.body.appendChild(div);

      div.click();
      expect(callback).toHaveBeenCalledTimes(1);

      div.dispatchEvent(new Event('mouseup'));
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  describe('off', () => {
    it('should remove a given event type', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);
      const callback = vi.fn();

      $('div').on('click', callback);
      $('div').off('click');
      div.click();
      expect(callback).not.toHaveBeenCalled();
    });
    it('should remove an array of event names', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);
      div.tabIndex = 1;
      const callback = vi.fn();

      $('div').on('click', callback);
      $('div').on('focus', callback);
      $('div').off('click focus', callback);
      div.click();
      div.focus();
      expect(callback).not.toHaveBeenCalled();
    });

    it('should remove a specific event handler', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);
      const callback = vi.fn();
      const callback2 = vi.fn();

      $('div').on('click', callback);
      $('div').on('click', callback2);
      $('div').off('click', callback);
      div.click();
      expect(callback).not.toHaveBeenCalled();
      expect(callback2).toHaveBeenCalled();
    });

    it('should allow native removeEventListener use with handler', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);
      const callback = vi.fn();

      const eventHandler = $('div').on('click', callback, { returnHandler: true });

      div.removeEventListener('click', callback);
      div.click();
      expect(callback).not.toHaveBeenCalled();
    });

    it('should remove delegated events', () => {
      const div = document.createElement('div');
      const span = document.createElement('span');
      div.appendChild(span);
      document.body.appendChild(div);
      const callback = vi.fn();

      $('div').on('click', 'span', callback);
      $('div').off('click', callback);
      span.click();
      expect(callback).not.toHaveBeenCalled();
    });

    it('should remove passed event objects', () => {
      const div = document.createElement('div');
      const span = document.createElement('span');
      div.appendChild(span);
      document.body.appendChild(div);
      const callback = vi.fn();

      const event = $('div').on('click', 'span', callback, { returnHandler: true });
      $('div').off('click', event);
      span.click();
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('Namespaced Events', () => {
    describe('on with namespaces', () => {
      it('should bind events with namespaces', () => {
        const div = document.createElement('div');
        document.body.appendChild(div);
        const callback = vi.fn();

        $('div').on('click.test', callback);
        div.click();
        expect(callback).toHaveBeenCalledTimes(1);
      });

      it('should bind multiple namespaced events', () => {
        const div = document.createElement('div');
        document.body.appendChild(div);
        const callback1 = vi.fn();
        const callback2 = vi.fn();

        $('div').on('click.test1', callback1);
        $('div').on('click.test2', callback2);
        div.click();
        expect(callback1).toHaveBeenCalledTimes(1);
        expect(callback2).toHaveBeenCalledTimes(1);
      });

      it('should bind events with same namespace but different event types', () => {
        const div = document.createElement('div');
        document.body.appendChild(div);
        const clickCallback = vi.fn();
        const mouseupCallback = vi.fn();

        $('div').on('click.test', clickCallback);
        $('div').on('mouseup.test', mouseupCallback);
        
        div.click();
        div.dispatchEvent(new Event('mouseup'));
        
        expect(clickCallback).toHaveBeenCalledTimes(1);
        expect(mouseupCallback).toHaveBeenCalledTimes(1);
      });

      it('should support delegation with namespaces', () => {
        const div = document.createElement('div');
        const span = document.createElement('span');
        div.appendChild(span);
        document.body.appendChild(div);
        const callback = vi.fn();

        $('div').on('click.test', 'span', callback);
        span.click();
        expect(callback).toHaveBeenCalledTimes(1);
      });
    });

    describe('off with namespaces', () => {
      it('should remove events by specific event.namespace', () => {
        const div = document.createElement('div');
        document.body.appendChild(div);
        const callback1 = vi.fn();
        const callback2 = vi.fn();

        $('div').on('click.test1', callback1);
        $('div').on('click.test2', callback2);
        
        $('div').off('click.test1');
        div.click();
        
        expect(callback1).not.toHaveBeenCalled();
        expect(callback2).toHaveBeenCalledTimes(1);
      });

      it('should remove all events in a namespace with .namespace', () => {
        const div = document.createElement('div');
        document.body.appendChild(div);
        const clickCallback = vi.fn();
        const mouseupCallback = vi.fn();
        const otherCallback = vi.fn();

        $('div').on('click.test', clickCallback);
        $('div').on('mouseup.test', mouseupCallback);
        $('div').on('click.other', otherCallback);
        
        $('div').off('.test');
        div.click();
        div.dispatchEvent(new Event('mouseup'));
        
        expect(clickCallback).not.toHaveBeenCalled();
        expect(mouseupCallback).not.toHaveBeenCalled();
        expect(otherCallback).toHaveBeenCalledTimes(1);
      });

      it('should remove specific handler with namespace', () => {
        const div = document.createElement('div');
        document.body.appendChild(div);
        const callback1 = vi.fn();
        const callback2 = vi.fn();

        $('div').on('click.test', callback1);
        $('div').on('click.test', callback2);
        
        $('div').off('click.test', callback1);
        div.click();
        
        expect(callback1).not.toHaveBeenCalled();
        expect(callback2).toHaveBeenCalledTimes(1);
      });

      it('should remove delegated events with namespaces', () => {
        const div = document.createElement('div');
        const span = document.createElement('span');
        div.appendChild(span);
        document.body.appendChild(div);
        const callback1 = vi.fn();
        const callback2 = vi.fn();

        $('div').on('click.test', 'span', callback1);
        $('div').on('click.other', 'span', callback2);
        
        $('div').off('click.test');
        span.click();
        
        expect(callback1).not.toHaveBeenCalled();
        expect(callback2).toHaveBeenCalledTimes(1);
      });

      it('should handle multiple namespace removals', () => {
        const div = document.createElement('div');
        document.body.appendChild(div);
        const callback1 = vi.fn();
        const callback2 = vi.fn();
        const callback3 = vi.fn();

        $('div').on('click.test1', callback1);
        $('div').on('click.test2', callback2);
        $('div').on('mouseup.test1', callback3);
        
        $('div').off('.test1');
        div.click();
        div.dispatchEvent(new Event('mouseup'));
        
        expect(callback1).not.toHaveBeenCalled();
        expect(callback2).toHaveBeenCalledTimes(1);
        expect(callback3).not.toHaveBeenCalled();
      });

      it('should not remove events without namespace when removing namespaced events', () => {
        const div = document.createElement('div');
        document.body.appendChild(div);
        const namespacedCallback = vi.fn();
        const normalCallback = vi.fn();

        $('div').on('click.test', namespacedCallback);
        $('div').on('click', normalCallback);
        
        $('div').off('click.test');
        div.click();
        
        expect(namespacedCallback).not.toHaveBeenCalled();
        expect(normalCallback).toHaveBeenCalledTimes(1);
      });

      it('should handle complex namespace scenarios', () => {
        const div = document.createElement('div');
        document.body.appendChild(div);
        const callback1 = vi.fn();
        const callback2 = vi.fn();
        const callback3 = vi.fn();
        const callback4 = vi.fn();

        $('div').on('click.foo.bar', callback1); // This creates namespace 'foo.bar' not nested namespaces
        $('div').on('click.foo', callback2);
        $('div').on('mouseup.foo', callback3);
        $('div').on('click', callback4);
        
        // Remove only .foo namespace
        $('div').off('.foo');
        
        div.click();
        div.dispatchEvent(new Event('mouseup'));
        
        expect(callback1).not.toHaveBeenCalled();   // 'foo.bar' contains 'foo', so should be removed
        expect(callback2).not.toHaveBeenCalled();   // 'foo' matches
        expect(callback3).not.toHaveBeenCalled();   // 'foo' matches
        expect(callback4).toHaveBeenCalledTimes(1); // no namespace
      });
    });

    describe('edge cases', () => {
      it('should handle empty namespaces gracefully', () => {
        const div = document.createElement('div');
        document.body.appendChild(div);
        const callback = vi.fn();

        $('div').on('click.', callback); // Empty namespace
        $('div').off('click.');
        div.click();
        
        expect(callback).not.toHaveBeenCalled();
      });

      it('should handle multiple dots in event names', () => {
        const div = document.createElement('div');
        document.body.appendChild(div);
        const callback = vi.fn();

        $('div').on('click.foo.bar', callback); // Multiple dots - all part of namespace
        div.click();
        expect(callback).toHaveBeenCalledTimes(1);
        
        $('div').off('click.foo.bar');
        div.click();
        expect(callback).toHaveBeenCalledTimes(1); // Should not be called again
      });

      it('should handle whitespace in namespaced event names', () => {
        const div = document.createElement('div');
        document.body.appendChild(div);
        const callback1 = vi.fn();
        const callback2 = vi.fn();

        $('div').on('click.test mouseup.test', callback1);
        $('div').on('click.other', callback2);
        
        $('div').off('.test');
        div.click();
        div.dispatchEvent(new Event('mouseup'));
        
        expect(callback1).not.toHaveBeenCalled();
        expect(callback2).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('trigger', () => {
    it('should trigger a custom event on elements', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);
      const callback = vi.fn();

      $('div').on('customEvent', callback);
      $('div').trigger('customEvent');

      expect(callback).toHaveBeenCalled();
    });

    it('should trigger a custom event with extra parameters', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);
      const callback = vi.fn();

      $('div').on('customEvent', callback);
      $('div').trigger('customEvent', { detail: 'test' });

      expect(callback).toHaveBeenCalledWith(expect.objectContaining({
        detail: 'test',
      }));
    });

    it('should trigger events on multiple elements', () => {
      const div1 = document.createElement('div');
      const div2 = document.createElement('div');
      document.body.appendChild(div1);
      document.body.appendChild(div2);
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      $('div').eq(0).on('customEvent', callback1);
      $('div').eq(1).on('customEvent', callback2);
      $('div').trigger('customEvent');

      expect(callback1).toHaveBeenCalled();
      expect(callback2).toHaveBeenCalled();
    });
  });

  describe('click', () => {
    it('should trigger a click event on elements', () => {
      const button = document.createElement('button');
      document.body.appendChild(button);
      const callback = vi.fn();

      $('button').on('click', callback);
      $('button').click();

      expect(callback).toHaveBeenCalled();
    });

    it('should trigger a click event with extra parameters', () => {
      const button = document.createElement('button');
      document.body.appendChild(button);
      const callback = vi.fn();

      $('button').on('click', callback);
      $('button').click({ detail: 'test' });

      expect(callback).toHaveBeenCalledWith(expect.objectContaining({
        detail: 'test',
      }));
    });

    it('should trigger click events on multiple elements', () => {
      const button1 = document.createElement('button');
      const button2 = document.createElement('button');
      document.body.appendChild(button1);
      document.body.appendChild(button2);
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      $('button').eq(0).on('click', callback1);
      $('button').eq(1).on('click', callback2);
      $('button').click();

      expect(callback1).toHaveBeenCalled();
      expect(callback2).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('remove should remove an element', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);
      $('div').remove();
      expect(document.body.innerHTML).toBe('');
    });

    it('remove should remove multiple elements that match selector', () => {
      const div = document.createElement('div');
      const div2 = document.createElement('div');
      document.body.appendChild(div);
      document.body.appendChild(div2);
      $('div').remove();
      expect(document.body.innerHTML).toBe('');
    });
  });

  describe('add class', () => {
    it('add class should add a class', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);
      const $div = $('div').addClass('test');
      expect($div.hasClass('test')).toBe(true);
    });

    it('add class should allow multiple classes to be added', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);
      const $div = $('div').addClass('test test2');
      expect($div.hasClass('test')).toBe(true);
      expect($div.hasClass('test2')).toBe(true);
    });

    it('add class should add multiple classes to multiple elements', () => {
      const div = document.createElement('div');
      const div2 = document.createElement('div');
      document.body.appendChild(div);
      document.body.appendChild(div2);
      const $div = $('div').addClass('test');
      expect($div.hasClass('test')).toBe(true);
    });
  });

  describe('has class', () => {
    it('has class should return true if an element has a class', () => {
      const div = document.createElement('div');
      div.classList.add('test');
      document.body.appendChild(div);
      expect($('div').hasClass('test')).toBe(true);
    });

    it('has class should not return true if an element does not have a class', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);
      expect($('div').hasClass('test')).toBe(false);
    });
  });

  describe('remove class', () => {
    it('remove class should remove a single class', () => {
      const div = document.createElement('div');
      div.classList.add('test');
      document.body.appendChild(div);
      const $div = $('div').removeClass('test');
      expect($div.hasClass('test')).toBe(false);
    });

    it('remove class should remove multiple classes', () => {
      const div = document.createElement('div');
      div.classList.add('test');
      div.classList.add('test2');
      document.body.appendChild(div);
      const $div = $('div').removeClass('test test2');
      expect($div.hasClass('test')).toBe(false);
      expect($div.hasClass('test2')).toBe(false);
    });
  });

  describe('html', () => {
    it('html should return the innerHTML of an element', () => {
      const div = document.createElement('div');
      div.innerHTML = 'test';
      document.body.appendChild(div);
      expect($('div').html()).toBe('test');
    });

    it('html should set the innerHTML of an element', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);
      $('div').html('test');
      expect(div.innerHTML).toBe('test');
    });
  });

  describe('outerHTML', () => {
    it('outerHTML should return the outerHTML of an element', () => {
      const div = document.createElement('div');
      div.innerHTML = 'test';
      document.body.appendChild(div);
      expect($('div').outerHTML()).toBe('<div>test</div>');
    });

    it('outerHTML should set the outerHTML of an element', () => {
      const div = document.createElement('div');
      const div2 = document.createElement('div');
      document.body.appendChild(div);
      div.appendChild(div2);
      $('div div').outerHTML('<div>test</div>');
      expect(div.outerHTML).toBe('<div><div>test</div></div>');
    });
  });

  // Slotted tests moved to browser tests

  describe('text', () => {
    it('text should return the textContent of an element', () => {
      const div = document.createElement('div');
      div.textContent = 'test';
      document.body.appendChild(div);
      expect($('div').text()).toBe('test');
    });

    it('text should return the text including all children recursively', () => {
      const div = document.createElement('div');
      const span = document.createElement('span');
      const span2 = document.createElement('span');
      const span3 = document.createElement('span');
      div.textContent = 'test 1';
      span.textContent = 'test 2';
      span2.textContent = 'test 3';
      span3.textContent = 'test 4';
      div.appendChild(span);
      span.appendChild(span2);
      span2.appendChild(span3);
      document.body.appendChild(div);
      expect($('div').text()).toBe('test 1test 2test 3test 4');
    });

    // currently whitespace is collapsed between elements
    it('text should remove whitespace for recursive text', () => {
      const div = document.createElement('div');
      const span = document.createElement('span');
      const span2 = document.createElement('span');
      const span3 = document.createElement('span');
      div.textContent = `
      test 1
      test 2`;
      span.textContent = `
      test 3
      test 4`;
      span2.textContent = `
      test 5
      test 6`;
      span3.textContent = `
      test 7
      test 8`;
      div.appendChild(span);
      span.appendChild(span2);
      span2.appendChild(span3);
      document.body.appendChild(div);
      expect($('div').text()).toBe(`test 1
      test 2test 3
      test 4test 5
      test 6test 7
      test 8`);
    });

    it('text should set textcontent for multiple elements', () => {
      const div = document.createElement('div');
      const div2 = document.createElement('div');
      document.body.appendChild(div);
      document.body.appendChild(div2);
      $('div').text('test');
      expect(div.textContent).toBe('test');
      expect(div2.textContent).toBe('test');
    });
  });
  describe('value', () => {
    it('value should return the value of an input', () => {
      const input = document.createElement('input');
      input.value = 'test';
      document.body.appendChild(input);
      expect($('input').value()).toBe('test');
    });

    it('value should set the value of an input', () => {
      const input = document.createElement('input');
      document.body.appendChild(input);
      $('input').value('test');
      expect(input.value).toBe('test');
    });

    it('value should return the value of a select', () => {
      const select = document.createElement('select');
      const option = document.createElement('option');
      option.value = 'test';
      select.appendChild(option);
      document.body.appendChild(select);
      expect($('select').value()).toBe('test');
    });

    it('value should set the value of a select', () => {
      const select = document.createElement('select');
      const option = document.createElement('option');
      select.appendChild(option);
      document.body.appendChild(select);
      option.value = 'test';
      $('select').value('test');
      expect(select.value).toBe('test');
    });

    it('value should set the value of a textarea', () => {
      const textarea = document.createElement('textarea');
      document.body.appendChild(textarea);
      $('textarea').value('test');
      expect(textarea.value).toBe('test');
    });

    it('value should return the value of a textarea', () => {
      const textarea = document.createElement('textarea');
      textarea.value = 'test';
      document.body.appendChild(textarea);
      expect($('textarea').value()).toBe('test');
    });

    it('value should ignore setting value on non form elements', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);
      $('div').value('test');
      expect(div.value).toBe(undefined);
    });

    it('value should ignore getting value on non form elements', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);
      expect($('div').value()).toBe(undefined);
    });

    it('val should be an alias of value', () => {
      const input = document.createElement('input');
      input.value = 'test';
      document.body.appendChild(input);
      expect($('input').val()).toBe('test');
    });
  });

  describe('attr', () => {
    it('should set and get boolean attributes', () => {
      const input = document.createElement('input');
      document.body.appendChild(input);
      $('input').attr('disabled', true);
      expect(input.disabled).toBe(true);
      expect($('input').attr('disabled')).toBe('true');
      $('input').removeAttr('disabled');
      expect(input.disabled).toBe(false);
      expect($('input').attr('disabled')).toBe(null);
    });

    it('should set and get custom data attributes', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);
      $('div').attr('data-custom', 'value');
      expect(div.getAttribute('data-custom')).toBe('value');
      expect($('div').attr('data-custom')).toBe('value');
    });
  });

  describe('prop', () => {
    it('should set and get properties on elements other than form elements', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);
      $('div').prop('customProperty', 'value');
      expect(div.customProperty).toBe('value');
      expect($('div').prop('customProperty')).toBe('value');
    });
  });

  describe('css', () => {
    it('css should set a style property', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);
      $('div').css('color', 'red');
      expect(div.style.color).toBe('red');
    });

    it('css should set multiple style properties', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);
      $('div').css({ color: 'red', backgroundColor: 'blue' });
      expect(div.style.color).toBe('red');
      expect(div.style.backgroundColor).toBe('blue');
    });

    it('css should get a style property', () => {
      const div = document.createElement('div');
      div.style.color = 'red';
      document.body.appendChild(div);
      expect($('div').css('color')).toBe('red');
    });

    it('css should return an array of style properties when multiple elements', () => {
      const div = document.createElement('div');
      const div2 = document.createElement('div');
      div.style.color = 'red';
      div2.style.color = 'blue';
      document.body.appendChild(div);
      document.body.appendChild(div2);
      expect($('div').css('color')).toStrictEqual(['red', 'blue']);
    });

    it('should handle camelCase and kebab-case property names', () => {
      const div = document.createElement('div');
      $(div).css('backgroundColor', 'red');
      expect(div.style.backgroundColor).toBe('red');
      $(div).css('background-color', 'blue');
      expect(div.style.backgroundColor).toBe('blue');
    });

    it('should return computed styles when requested', () => {
      const div = document.createElement('div');
      div.style.fontSize = '16px';
      document.body.appendChild(div);
      expect($(div).css('font-size', null, { includeComputed: true })).toBe('16px');
    });
  });

  describe('attr', () => {
    it('attr should set an attribute', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);
      $('div').attr('test', 'test');
      expect(div.getAttribute('test')).toBe('test');
    });

    it('attr should set multiple attributes', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);
      $('div').attr({ test: 'test', test2: 'test2' });
      expect(div.getAttribute('test')).toBe('test');
      expect(div.getAttribute('test2')).toBe('test2');
    });

    it('attr should get an attribute', () => {
      const div = document.createElement('div');
      div.setAttribute('test', 'test');
      document.body.appendChild(div);
      expect($('div').attr('test')).toBe('test');
    });

    it('attr should get attribute from multiple elements', () => {
      const div = document.createElement('div');
      const div2 = document.createElement('div');
      div.setAttribute('test', 'test');
      div2.setAttribute('test', 'test2');
      document.body.appendChild(div);
      document.body.appendChild(div2);
      expect($('div').attr('test')).toStrictEqual(['test', 'test2']);
    });

    it('should handle properties that are not reflected as attributes', () => {
      const input = document.createElement('input');
      $(input).prop('value', 'test');
      expect(input.value).toBe('test');
      expect(input.getAttribute('value')).toBe(null);
    });
  });

  describe('removeAttr', () => {
    it('removeAttr should remove an attribute', () => {
      const div = document.createElement('div');
      div.setAttribute('test', 'test');
      document.body.appendChild(div);
      $('div').removeAttr('test');
      expect(div.getAttribute('test')).toBe(null);
    });

    it('removeAttr should remove an attribute from multiple elements', () => {
      const div = document.createElement('div');
      const div2 = document.createElement('div');
      div.setAttribute('test', 'test');
      div2.setAttribute('test', 'test');
      document.body.appendChild(div);
      document.body.appendChild(div2);
      $('div').removeAttr('test');
      expect(div.getAttribute('test')).toBe(null);
      expect(div2.getAttribute('test')).toBe(null);
    });
  });

  describe('each', () => {
    it('each should iterate over each element passing index', () => {
      const div = document.createElement('div');
      const div2 = document.createElement('div');
      document.body.appendChild(div);
      document.body.appendChild(div2);
      const callback = vi.fn((index) => {
        if (index == 0) {
          expect(this).toBe(div);
        }
        expect(index).toBeDefined();
      });
      $('div').each(callback);
      expect(callback).toHaveBeenCalledTimes(2);
    });
  });

  describe('get', () => {
    it('get should return an element at an index', () => {
      const div = document.createElement('div');
      const div2 = document.createElement('div');
      document.body.appendChild(div);
      document.body.appendChild(div2);
      expect($('div').get(0)).toBe(div);
      expect($('div').get(1)).toBe(div2);
    });

    it('get should return an array of elements when no index', () => {
      const div = document.createElement('div');
      const div2 = document.createElement('div');
      document.body.appendChild(div);
      document.body.appendChild(div2);
      expect($('div').get()).toStrictEqual([div, div2]);
    });
  });

  describe('eq', () => {
    it('eq should return an element at an index', () => {
      const div = document.createElement('div');
      const div2 = document.createElement('div');
      document.body.appendChild(div);
      document.body.appendChild(div2);
      expect($('div').eq(0)[0]).toBe(div);
      expect($('div').eq(1)[0]).toBe(div2);
    });
  });

  describe('textNode', () => {
    it('textNode should return only immediate text and not child el text', () => {
      const text = document.createTextNode('test');
      const div = document.createElement('div');
      const span = document.createElement('span');
      span.textContent = 'test2';
      div.appendChild(text);
      div.appendChild(span);
      document.body.appendChild(div);
      expect($('div').textNode()).toStrictEqual('test');
    });
  });

  describe('focus', () => {
    it('focus should focus an element', () => {
      const input = document.createElement('input');
      document.body.appendChild(input);
      $('input').focus();
      expect(document.activeElement).toBe(input);
    });
  });

  describe('blur', () => {
    it('blur should blur an element', () => {
      const input = document.createElement('input');
      document.body.appendChild(input);
      input.focus();
      $('input').blur();
      expect(document.activeElement).not.toBe(input);
    });
  });

  describe('clone', () => {
    it('should create a deep clone of the elements in the Query instance', () => {
      const div = document.createElement('div');
      const span = document.createElement('span');
      span.textContent = 'Hello';
      div.appendChild(span);
      document.body.appendChild(div);

      const $cloned = $('div').clone();
      expect($cloned[0]).not.toBe(div);
      expect($cloned[0].tagName).toBe('DIV');
      expect($cloned[0].children[0].tagName).toBe('SPAN');
      expect($cloned[0].children[0].textContent).toBe('Hello');
    });
  });

  describe('Insertion Methods', () => {
    beforeEach(() => {
      document.body.innerHTML = '<div id="target"></div><div id="target2"></div>';
    });

    describe('prepend', () => {
      it('should prepend content to the target', () => {
        $('#target').prepend('<p>Test</p>');
        expect(document.getElementById('target').innerHTML).toBe('<p>Test</p>');
      });

      it('should prepend multiple content items to the target', () => {
        $('#target2').prepend('<span>First</span>', '<div>Second</div>', $('<em>Third</em>'));
        expect(document.getElementById('target2').innerHTML).toBe('<em>Third</em><div>Second</div><span>First</span>');
      });
    });

    describe('append', () => {
      it('should append content to the target', () => {
        $('#target').append('<p>Test</p>');
        expect(document.getElementById('target').innerHTML).toBe('<p>Test</p>');
      });

      it('should append multiple content items to the target', () => {
        $('#target2').append('<span>First</span>', '<div>Second</div>', $('<em>Third</em>'));
        expect(document.getElementById('target2').innerHTML).toBe('<span>First</span><div>Second</div><em>Third</em>');
      });
    });

    describe('insertBefore', () => {
      it('should insert elements before the target', () => {
        $('<p>Test</p>').insertBefore('#target');
        expect(document.body.innerHTML).toBe('<p>Test</p><div id="target"></div><div id="target2"></div>');
      });
    });

    describe('insertAfter', () => {
      it('should insert elements after the target', () => {
        $('<p>Test</p>').insertAfter('#target');
        expect(document.body.innerHTML).toBe('<div id="target"></div><p>Test</p><div id="target2"></div>');
      });

      it('should insert elements after each target element', () => {
        $('<p>Test</p>').insertAfter('div');
        expect(document.body.innerHTML).toBe('<div id="target"></div><p>Test</p><div id="target2"></div><p>Test</p>');
      });
    });
  });

  describe('next', () => {
    it('should return the next sibling element', () => {
      const div1 = document.createElement('div');
      const div2 = document.createElement('div');
      document.body.appendChild(div1);
      document.body.appendChild(div2);

      const $next = $(div1).next();
      expect($next.get(0)).toBe(div2);
    });

    it('should return the next sibling element matching a selector', () => {
      const div1 = document.createElement('div');
      const div2 = document.createElement('div');
      div2.classList.add('target');
      const div3 = document.createElement('div');
      document.body.appendChild(div1);
      document.body.appendChild(div2);
      document.body.appendChild(div3);

      const $next = $(div1).next('.target');
      expect($next.get(0)).toBe(div2);
    });

    it('should return an empty Query instance if no matching next sibling is found', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);

      const $next = $(div).next('.target');
      expect($next.length).toBe(0);
    });
  });

  describe('prev', () => {
    it('should return the previous sibling element', () => {
      const div1 = document.createElement('div');
      const div2 = document.createElement('div');
      document.body.appendChild(div1);
      document.body.appendChild(div2);

      const $prev = $(div2).prev();
      expect($prev.get(0)).toBe(div1);
    });

    it('should return the previous sibling element matching a selector', () => {
      const div1 = document.createElement('div');
      div1.classList.add('target');
      const div2 = document.createElement('div');
      const div3 = document.createElement('div');
      document.body.appendChild(div1);
      document.body.appendChild(div2);
      document.body.appendChild(div3);

      const $prev = $(div3).prev('.target');
      expect($prev.get(0)).toBe(div1);
    });

    it('should return an empty Query instance if no matching previous sibling is found', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);

      const $prev = $(div).prev('.target');
      expect($prev.length).toBe(0);
    });
  });

  describe('Value-returning methods', () => {
    beforeEach(() => {
      document.body.innerHTML = '';
    });

    describe('attr', () => {
      it('should return undefined when getting attribute on non-existent element', () => {
        expect($('.non-existent').attr('id')).toBe(undefined);
      });
    });

    describe('prop', () => {
      it('should return undefined when getting property on non-existent element', () => {
        expect($('.non-existent').prop('id')).toBe(undefined);
      });
    });

    describe('css', () => {
      it('should return undefined when getting style on non-existent element', () => {
        expect($('.non-existent').css('color')).toBe(undefined);
      });
    });

    describe('html', () => {
      it('should return undefined when getting HTML on non-existent element', () => {
        expect($('.non-existent').html()).toBe(undefined);
      });
    });

    describe('text', () => {
      it('should return undefined when getting text on non-existent element', () => {
        expect($('.non-existent').text()).toBe(undefined);
      });
    });

    describe('val', () => {
      it('should return undefined when getting value on non-existent element', () => {
        expect($('.non-existent').val()).toBe(undefined);
      });
    });

    describe('height', () => {
      it('should return undefined when getting height on non-existent element', () => {
        expect($('.non-existent').height()).toBe(undefined);
      });

      it('should set height value and return Query instance', () => {
        const div = document.createElement('div');
        document.body.appendChild(div);

        const $result = $('div').height(150);
        
        expect($result).toBeInstanceOf(Query);
        expect(div.style.height).toBe('150px');
        
        document.body.removeChild(div);
      });

      it('should handle string height values', () => {
        const div = document.createElement('div');
        document.body.appendChild(div);

        $('div').height('200px');
        
        expect(div.style.height).toBe('200px');
        
        document.body.removeChild(div);
      });
    });

    describe('width', () => {
      it('should return undefined when getting width on non-existent element', () => {
        expect($('.non-existent').width()).toBe(undefined);
      });

      it('should set width value and return Query instance', () => {
        const div = document.createElement('div');
        document.body.appendChild(div);

        const $result = $('div').width(300);
        
        expect($result).toBeInstanceOf(Query);
        expect(div.style.width).toBe('300px');
        
        document.body.removeChild(div);
      });

      it('should handle string width values', () => {
        const div = document.createElement('div');
        document.body.appendChild(div);

        $('div').width('250px');
        
        expect(div.style.width).toBe('250px');
        
        document.body.removeChild(div);
      });
    });

    describe('innerWidth', () => {
      it('should return undefined for non-existent element', () => {
        expect($('.non-existent').innerWidth()).toBe(undefined);
      });
    });

    describe('innerHeight', () => {
      it('should return undefined for non-existent element', () => {
        expect($('.non-existent').innerHeight()).toBe(undefined);
      });
    });

    describe('outerWidth', () => {
      it('should return undefined for non-existent element', () => {
        expect($('.non-existent').outerWidth()).toBe(undefined);
      });
    });

    describe('outerHeight', () => {
      it('should return undefined for non-existent element', () => {
        expect($('.non-existent').outerHeight()).toBe(undefined);
      });
    });

    describe('scrollHeight', () => {
      it('should return undefined when getting scrollHeight on non-existent element', () => {
        expect($('.non-existent').scrollHeight()).toBe(undefined);
      });
    });

    describe('scrollWidth', () => {
      it('should return undefined when getting scrollWidth on non-existent element', () => {
        expect($('.non-existent').scrollWidth()).toBe(undefined);
      });
    });

    describe('scrollLeft', () => {
      it('should return undefined when getting scrollLeft on non-existent element', () => {
        expect($('.non-existent').scrollLeft()).toBe(undefined);
      });
    });

    describe('scrollTop', () => {
      it('should return undefined when getting scrollTop on non-existent element', () => {
        expect($('.non-existent').scrollTop()).toBe(undefined);
      });
    });
  });

  describe('data', () => {
    beforeEach(() => {
      document.body.innerHTML = '';
    });

    it('should set and get data attributes', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);
      
      $('div').data('test', 'value');
      expect($('div').data('test')).toBe('value');
      expect(div.dataset.test).toBe('value');
    });

    it('should get all data attributes when no key provided', () => {
      const div = document.createElement('div');
      div.dataset.foo = 'bar';
      div.dataset.baz = 'qux';
      document.body.appendChild(div);
      
      const data = $('div').data();
      expect(data).toEqual({ foo: 'bar', baz: 'qux' });
    });

    it('should return undefined for non-existent data attribute', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);
      
      expect($('div').data('nonexistent')).toBe(undefined);
    });

    it('should return undefined when getting data on empty selection', () => {
      expect($('.nonexistent').data('test')).toBe(undefined);
      expect($('.nonexistent').data()).toBe(undefined);
    });

    it('should set data attributes on multiple elements', () => {
      const div1 = document.createElement('div');
      const div2 = document.createElement('div');
      document.body.appendChild(div1);
      document.body.appendChild(div2);
      
      $('div').data('test', 'value');
      expect(div1.dataset.test).toBe('value');
      expect(div2.dataset.test).toBe('value');
    });

    it('should get data attribute from single element', () => {
      const div = document.createElement('div');
      div.dataset.test = 'value';
      document.body.appendChild(div);
      
      expect($('div').data('test')).toBe('value');
    });

    it('should get data attributes from multiple elements as array', () => {
      const div1 = document.createElement('div');
      const div2 = document.createElement('div');
      div1.dataset.test = 'value1';
      div2.dataset.test = 'value2';
      document.body.appendChild(div1);
      document.body.appendChild(div2);
      
      expect($('div').data('test')).toEqual(['value1', 'value2']);
    });

    it('should get all data attributes from single element as object', () => {
      const div = document.createElement('div');
      div.dataset.foo = 'bar';
      div.dataset.baz = 'qux';
      document.body.appendChild(div);
      
      expect($('div').data()).toEqual({ foo: 'bar', baz: 'qux' });
    });

    it('should get all data attributes from multiple elements as array of objects', () => {
      const div1 = document.createElement('div');
      const div2 = document.createElement('div');
      div1.dataset.foo = 'bar1';
      div1.dataset.baz = 'qux1';
      div2.dataset.foo = 'bar2';
      div2.dataset.test = 'value2';
      document.body.appendChild(div1);
      document.body.appendChild(div2);
      
      const result = $('div').data();
      expect(result).toEqual([
        { foo: 'bar1', baz: 'qux1' },
        { foo: 'bar2', test: 'value2' }
      ]);
    });

    it('should handle elements without dataset', () => {
      const div = document.createElement('div');
      // Remove dataset to simulate older browsers or non-HTML elements
      Object.defineProperty(div, 'dataset', { value: null });
      document.body.appendChild(div);
      
      expect($('div').data()).toEqual({});
      expect($('div').data('test')).toBe(undefined);
      
      // Setting should not throw
      expect(() => $('div').data('test', 'value')).not.toThrow();
    });

    it('should return the Query instance when setting data', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);
      
      const result = $('div').data('test', 'value');
      expect(result).toBeInstanceOf(Query);
      expect(result[0]).toBe(div);
    });
  });

  describe('end', () => {
    beforeEach(() => {
      document.body.innerHTML = '';
    });

    it('should return to the previous selection after a traversal method', () => {
      const div = document.createElement('div');
      const span = document.createElement('span');
      div.appendChild(span);
      document.body.appendChild(div);

      const $div = $('div');
      const $span = $div.find('span');
      const $back = $span.end();
      
      expect($back[0]).toBe(div);
      expect($back.length).toBe(1);
    });

    it('should return the same Query instance if there is no previous selection', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);

      const $div = $('div');
      const $same = $div.end();
      
      expect($same).toBe($div);
    });

    it('should allow chaining back up multiple levels', () => {
      const div = document.createElement('div');
      const ul = document.createElement('ul');
      const li1 = document.createElement('li');
      const li2 = document.createElement('li');
      const span = document.createElement('span');
      
      div.appendChild(ul);
      ul.appendChild(li1);
      ul.appendChild(li2);
      li1.appendChild(span);
      document.body.appendChild(div);

      const result = $('div')
        .find('ul')
        .find('li')
        .find('span')
        .end()     // back to li
        .end()     // back to ul
        .end();    // back to div
      
      expect(result[0]).toBe(div);
    });

    it('should work with multiple chain traversal methods in between', () => {
      const div = document.createElement('div');
      div.classList.add('container');
      
      const p1 = document.createElement('p');
      p1.classList.add('paragraph');
      p1.textContent = 'First paragraph';
      
      const p2 = document.createElement('p');
      p2.classList.add('paragraph');
      p2.textContent = 'Second paragraph';
      
      div.appendChild(p1);
      div.appendChild(p2);
      document.body.appendChild(div);

      const $div = $('.container');
      const $filtered = $div
        .find('p')
        .addClass('highlighted')
        .css('color', 'blue')
        .end();
      
      expect($filtered[0]).toBe(div);
    });

    it('should match the example from documentation', () => {
      // Create elements as in the documentation example
      const card = document.createElement('div');
      card.classList.add('card');
      
      const title = document.createElement('div');
      title.classList.add('title');
      
      const content = document.createElement('div');
      content.classList.add('content');
      
      card.appendChild(title);
      card.appendChild(content);
      document.body.appendChild(card);

      // Create the example chain from the docs
      $('.card')
        .addClass('highlighted')         // Add class to cards
        .find('.title')                  // Switch to titles within cards
        .css('font-weight', 'bold')      // Bold the titles
        .end()                           // Go back to the card selection
        .find('.content')                // Now find content within cards
        .html('<p>New content</p>');     // Change the HTML

      // Verify the operations worked as expected
      expect(card.classList.contains('highlighted')).toBe(true);
      expect(title.style.fontWeight).toBe('bold');
      expect(content.innerHTML).toBe('<p>New content</p>');
    });

    it('should handle complex nested chains with multiple end() calls', () => {
      const outer = document.createElement('div');
      outer.classList.add('outer');
      
      const middle = document.createElement('div');
      middle.classList.add('middle');
      
      const inner = document.createElement('div');
      inner.classList.add('inner');
      
      outer.appendChild(middle);
      middle.appendChild(inner);
      document.body.appendChild(outer);

      const result = $('.outer')
        .find('.middle')
        .addClass('middle-class')
        .find('.inner')
        .addClass('inner-class')
        .end()   // Back to middle
        .end()   // Back to outer
        .addClass('outer-modified');
      
      expect(outer.classList.contains('outer-modified')).toBe(true);
      expect(middle.classList.contains('middle-class')).toBe(true);
      expect(inner.classList.contains('inner-class')).toBe(true);
      expect(result[0]).toBe(outer);
    });
  });

  describe('slice', () => {
    beforeEach(() => {
      document.body.innerHTML = '';
    });

    it('should slice elements from the collection', () => {
      const div1 = document.createElement('div');
      const div2 = document.createElement('div');
      const div3 = document.createElement('div');
      const div4 = document.createElement('div');
      
      div1.className = 'item';
      div2.className = 'item';
      div3.className = 'item';
      div4.className = 'item';
      
      document.body.appendChild(div1);
      document.body.appendChild(div2);
      document.body.appendChild(div3);
      document.body.appendChild(div4);

      const $items = $('.item');
      const $sliced = $items.slice(1, 3);

      expect($sliced.length).toBe(2);
      expect($sliced[0]).toBe(div2);
      expect($sliced[1]).toBe(div3);
    });

    it('should slice with only start parameter', () => {
      const div1 = document.createElement('div');
      const div2 = document.createElement('div');
      const div3 = document.createElement('div');
      
      div1.className = 'item';
      div2.className = 'item';
      div3.className = 'item';
      
      document.body.appendChild(div1);
      document.body.appendChild(div2);
      document.body.appendChild(div3);

      const $items = $('.item');
      const $sliced = $items.slice(1);

      expect($sliced.length).toBe(2);
      expect($sliced[0]).toBe(div2);
      expect($sliced[1]).toBe(div3);
    });

    it('should handle negative indices', () => {
      const div1 = document.createElement('div');
      const div2 = document.createElement('div');
      const div3 = document.createElement('div');
      
      div1.className = 'item';
      div2.className = 'item';
      div3.className = 'item';
      
      document.body.appendChild(div1);
      document.body.appendChild(div2);
      document.body.appendChild(div3);

      const $items = $('.item');
      const $sliced = $items.slice(-2);

      expect($sliced.length).toBe(2);
      expect($sliced[0]).toBe(div2);
      expect($sliced[1]).toBe(div3);
    });

    it('should return empty collection when start is beyond collection length', () => {
      const div1 = document.createElement('div');
      div1.className = 'item';
      document.body.appendChild(div1);

      const $items = $('.item');
      const $sliced = $items.slice(5);

      expect($sliced.length).toBe(0);
      expect($sliced).toBeInstanceOf(Query);
    });

    it('should return same instance when called on empty collection', () => {
      const $empty = $('.nonexistent');
      const $sliced = $empty.slice(0, 2);

      expect($sliced).toBe($empty);
      expect($sliced.length).toBe(0);
    });

    it('should return Query instance for chaining', () => {
      const div1 = document.createElement('div');
      const div2 = document.createElement('div');
      
      div1.className = 'item';
      div2.className = 'item';
      
      document.body.appendChild(div1);
      document.body.appendChild(div2);

      const $result = $('.item').slice(0, 1).addClass('sliced');

      expect($result).toBeInstanceOf(Query);
      expect($result.length).toBe(1);
      expect(div1.classList.contains('sliced')).toBe(true);
      expect(div2.classList.contains('sliced')).toBe(false);
    });

    it('should work with single element', () => {
      const div = document.createElement('div');
      div.className = 'item';
      document.body.appendChild(div);

      const $items = $('.item');
      const $sliced = $items.slice(0, 1);

      expect($sliced.length).toBe(1);
      expect($sliced[0]).toBe(div);
    });

    it('should handle zero slice', () => {
      const div1 = document.createElement('div');
      const div2 = document.createElement('div');
      
      div1.className = 'item';
      div2.className = 'item';
      
      document.body.appendChild(div1);
      document.body.appendChild(div2);

      const $items = $('.item');
      const $sliced = $items.slice(1, 1);

      expect($sliced.length).toBe(0);
      expect($sliced).toBeInstanceOf(Query);
    });
  });

  describe('before', () => {
    it('should work as alias for insertBefore functionality', () => {
      const div = document.createElement('div');
      div.innerHTML = '<p>Original</p>';
      document.body.appendChild(div);

      $('p').before('<span>Before</span>');

      expect(div.innerHTML).toBe('<span>Before</span><p>Original</p>');
    });
  });

  describe('after', () => {
    it('should work as alias for insertAfter functionality', () => {
      const div = document.createElement('div');
      div.innerHTML = '<p>Original</p>';
      document.body.appendChild(div);

      $('p').after('<span>After</span>');

      expect(div.innerHTML).toBe('<p>Original</p><span>After</span>');
    });
  });
});
