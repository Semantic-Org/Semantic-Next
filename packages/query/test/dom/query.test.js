import { beforeEach, describe, expect, it, vi } from 'vitest';
import { $ } from '@semantic-ui/query';

describe('query', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    $().removeAllEvents();
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

      const eventHandler = $('div').on('click', callback);

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

      const event = $('div').on('click', 'span', callback);
      $('div').off('click', event);
      span.click();
      expect(callback).not.toHaveBeenCalled();
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
});
