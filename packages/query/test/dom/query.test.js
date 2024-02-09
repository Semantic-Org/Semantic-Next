import { describe, beforeEach, expect, it, vi } from 'vitest';
import { $ } from '@semantic-ui/query';

describe('query', () => {

  beforeEach(() => {
    document.body.innerHTML = '';
  });

  describe('selectors', () => {
    
    it('query should query DOM when given a selector', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);
      const $div = $('div');
      expect($div[0]).toBe(div);
    });

    it('query should allow dom elements to be passed in', () => {
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

      if('filter should return elements that match a function', () => {
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
      
      const eventHandler = $('div').on('click', () => {});
      expect(eventHandler).toBeInstanceOf(Object);
    });

    it('should be able to remove event handlers using returned abortController', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);
      const callback = vi.fn();
      
      const eventHandler = $('div').on('click', callback);
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
      
      const eventHandler = $('div').on('click', 'span', callback);
      expect(eventHandler.delegated).toBe(true);
    });

    it('should have delegated not set on return object is delegated', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);
      const callback = vi.fn();
      
      const eventHandler = $('div').on('click', 'span', callback);
      expect(eventHandler.delegated).toBe(true);
    });

    it('should return the native event on return object eventListener', () => {
      const div = document.createElement('div');
      const callback = vi.fn();
      document.body.appendChild(div);
      const eventHandler = $('div').on('click', callback);
      div.removeEventListener('click', eventHandler.eventListener);
      div.click();
      expect(callback).not.toHaveBeenCalled();
    });

  });
  
});
