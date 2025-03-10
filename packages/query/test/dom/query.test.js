import { describe, beforeEach, afterEach, beforeAll, expect, it, vi } from 'vitest';
import { $, $$, Query, exportGlobals, restoreGlobals, useAlias } from '@semantic-ui/query';

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
      const abortController = new AbortController();;
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
        .one('click mouseup', callback2);  // mouseup added twice

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
        detail: 'test'
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
        detail: 'test'
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
      expect($('div').attr('data-custom')).toBe('value'); });
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
      expect($('div').css('color')).toStrictEqual(['red','blue']);
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
        if(index == 0) {
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
    });

    describe('append', () => {
      it('should append content to the target', () => {
        $('#target').append('<p>Test</p>');
        expect(document.getElementById('target').innerHTML).toBe('<p>Test</p>');
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
    });

    describe('width', () => {
      it('should return undefined when getting width on non-existent element', () => {
        expect($('.non-existent').width()).toBe(undefined);
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

});
