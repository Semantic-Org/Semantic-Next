import { $, $$, Query } from '@semantic-ui/query';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('query — documented contract', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  /***************************************************************
                 Selection — $ and $$ entry points
  ***************************************************************/

  describe('selection', () => {
    it('$$() pierces shadow DOM where $() does not', () => {
      const host = document.createElement('div');
      document.body.appendChild(host);
      const shadow = host.attachShadow({ mode: 'open' });
      shadow.innerHTML = '<span class="needle">in-shadow</span>';

      expect($('.needle').length).toBe(0);
      expect($$('.needle').length).toBe(1);
    });

    it('creates elements from leading-whitespace HTML strings', () => {
      const $el = $('   <div class="created">hi</div>');
      expect($el.length).toBe(1);
      expect($el[0].tagName).toBe('DIV');
      expect($el[0].className).toBe('created');
    });

    it('creates a Query when passed an array of elements', () => {
      const a = document.createElement('span');
      const b = document.createElement('span');
      const $els = $([a, b]);
      expect($els.length).toBe(2);
      expect($els[0]).toBe(a);
      expect($els[1]).toBe(b);
    });

    it('wraps a single DOM element', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);
      const $div = $(div);
      expect($div.length).toBe(1);
      expect($div[0]).toBe(div);
    });
  });

  /***************************************************************
                            .end() chain
  ***************************************************************/

  describe('.end()', () => {
    it('returns the previous selection after a traversal', () => {
      document.body.innerHTML = `
        <ul class="items">
          <li><button class="button">a</button></li>
          <li><button class="button">b</button></li>
        </ul>
      `;
      const $items = $('.items');
      const $back = $items.find('.button').end();
      expect($back[0]).toBe($items[0]);
    });

    it('threads through multiple .end() calls', () => {
      document.body.innerHTML = `
        <div class="root">
          <div class="mid"><span class="leaf"></span></div>
        </div>
      `;
      const $root = $('.root');
      const $leaf = $root.find('.mid').find('.leaf');
      expect($leaf.end()[0]).toBe($root.find('.mid')[0]);
      expect($leaf.end().end()[0]).toBe($root[0]);
    });

    it('returns the same Query when there is no previous selection', () => {
      const $div = $('div');
      expect($div.end()).toBe($div);
    });
  });

  /***************************************************************
              .find() vs .children() — depth distinction
  ***************************************************************/

  describe('.find() / .children()', () => {
    it('.find() returns ALL descendants (not just direct children)', () => {
      document.body.innerHTML = `
        <div class="container">
          <div class="row">
            <span class="item">a</span>
            <span class="item">b</span>
          </div>
          <span class="item">c</span>
        </div>
      `;
      expect($('.container').find('.item').length).toBe(3);
    });

    it('.children() returns only direct children', () => {
      document.body.innerHTML = `
        <div class="parent">
          <div class="child">direct</div>
          <div class="wrap"><div class="child">nested</div></div>
        </div>
      `;
      expect($('.parent').children('.child').length).toBe(1);
      expect($('.parent').find('.child').length).toBe(2);
    });

    it('.children() with no selector returns all direct children', () => {
      document.body.innerHTML = `
        <div class="parent">
          <div>a</div>
          <span>b</span>
          <p>c</p>
        </div>
      `;
      expect($('.parent').children().length).toBe(3);
    });
  });

  /***************************************************************
                  .next() / .prev() — siblings
  ***************************************************************/

  describe('.next() / .prev()', () => {
    it('.next() returns the immediately following element sibling', () => {
      document.body.innerHTML = `
        <div class="a"></div>
        <div class="b"></div>
        <div class="c"></div>
      `;
      const $next = $('.a').next();
      expect($next.length).toBe(1);
      expect($next.hasClass('b')).toBe(true);
    });

    it('.prev() returns the immediately preceding element sibling', () => {
      document.body.innerHTML = `
        <div class="a"></div>
        <div class="b"></div>
        <div class="c"></div>
      `;
      const $prev = $('.c').prev();
      expect($prev.length).toBe(1);
      expect($prev.hasClass('b')).toBe(true);
    });

    it('.next(selector) walks past siblings until one matches', () => {
      // jQuery-vs-SUI divergence: in jQuery, .next(selector) only matches
      // the IMMEDIATE next sibling against the selector (returns empty
      // otherwise). SUI walks until match. Documenting the SUI contract.
      document.body.innerHTML = `
        <div class="a"></div>
        <div class="skip"></div>
        <div class="skip"></div>
        <div class="target"></div>
      `;
      const $next = $('.a').next('.target');
      expect($next.length).toBe(1);
      expect($next.hasClass('target')).toBe(true);
    });

    it('.next() returns empty Query when no next sibling exists', () => {
      document.body.innerHTML = '<div class="only"></div>';
      expect($('.only').next().length).toBe(0);
    });
  });

  /***************************************************************
                  .closest() / .closestAll()
  ***************************************************************/

  describe('.closest() / .closestAll()', () => {
    it('.closest() returns the NEAREST matching ancestor', () => {
      document.body.innerHTML = `
        <div class="box">
          <div class="box">
            <div class="box">
              <div class="inner"></div>
            </div>
          </div>
        </div>
      `;
      const $closest = $('.inner').closest('.box');
      expect($closest.length).toBe(1);
    });

    it('.closestAll() returns ALL matching ancestors', () => {
      document.body.innerHTML = `
        <div class="box">
          <div class="box">
            <div class="box">
              <div class="inner"></div>
            </div>
          </div>
        </div>
      `;
      expect($('.inner').closestAll('.box').length).toBe(3);
    });
  });

  /***************************************************************
                   .filter() / .not() / .is()
  ***************************************************************/

  describe('.filter() / .not() / .is()', () => {
    it('.filter(selector) keeps only matching elements', () => {
      document.body.innerHTML = `
        <div class="item done">a</div>
        <div class="item">b</div>
        <div class="item done">c</div>
      `;
      const $done = $('.item').filter('.done');
      expect($done.length).toBe(2);
    });

    it('.filter(fn) keeps elements where predicate returns truthy', () => {
      document.body.innerHTML = `
        <span>a</span>
        <span>bb</span>
        <span>ccc</span>
      `;
      const $long = $('span').filter((el) => el.textContent.length > 1);
      expect($long.length).toBe(2);
    });

    it('.not(selector) excludes matching elements', () => {
      document.body.innerHTML = `
        <div class="item">a</div>
        <div class="item special">b</div>
        <div class="item">c</div>
      `;
      const $kept = $('.item').not('.special');
      expect($kept.length).toBe(2);
    });

    it('.is(selector) returns true when every element matches', () => {
      // ALL must match, not ANY. This is a SUI departure from jQuery.
      document.body.innerHTML = `
        <div class="a active"></div>
        <div class="a active"></div>
      `;
      expect($('.a').is('.active')).toBe(true);
    });

    it('.is(selector) returns false when ANY element does not match', () => {
      document.body.innerHTML = `
        <div class="a active"></div>
        <div class="a"></div>
      `;
      expect($('.a').is('.active')).toBe(false);
    });

    it('.is() returns false for an empty collection', () => {
      expect($('.nope').is('div')).toBe(false);
    });
  });

  /***************************************************************
                          .contains()
  ***************************************************************/

  describe('.contains()', () => {
    it('returns true when the selection contains a descendant matching the selector', () => {
      document.body.innerHTML = `
        <div class="container"><div class="target">x</div></div>
      `;
      expect($('.container').contains('.target')).toBe(true);
    });

    it('returns false when the selection does not contain a descendant matching the selector', () => {
      document.body.innerHTML = `
        <div class="container"></div>
        <div class="target"></div>
      `;
      expect($('.container').contains('.target')).toBe(false);
    });

    it('returns true when passed a DOM element that is a descendant', () => {
      document.body.innerHTML = `
        <div class="container"><div class="target"></div></div>
      `;
      const target = document.querySelector('.target');
      expect($('.container').contains(target)).toBe(true);
    });

    it('returns false when called with empty selector or empty collection', () => {
      expect($('.nope').contains('div')).toBe(false);
      expect($('div').contains(null)).toBe(false);
    });
  });

  /***************************************************************
                      .index() / .indexOf()
  ***************************************************************/

  describe('.index() / .indexOf()', () => {
    it('.index() returns position among siblings', () => {
      document.body.innerHTML = `
        <div class="list">
          <div class="item"></div>
          <div class="item active"></div>
          <div class="item"></div>
        </div>
      `;
      expect($('.active').index()).toBe(1);
    });

    it('.indexOf(filter) returns index within the current collection', () => {
      document.body.innerHTML = `
        <div class="item">a</div>
        <div class="item target">b</div>
        <div class="item">c</div>
      `;
      expect($('.item').indexOf('.target')).toBe(1);
    });

    it('.index() returns -1 when no parent', () => {
      const div = document.createElement('div');
      expect($(div).index()).toBe(-1);
    });
  });

  /***************************************************************
                            .add()
  ***************************************************************/

  describe('.add()', () => {
    it('combines selections from different selectors', () => {
      document.body.innerHTML = `
        <div class="red"></div>
        <div class="red"></div>
        <div class="blue"></div>
        <div class="green"></div>
      `;
      const $combined = $('.red').add('.blue');
      expect($combined.length).toBe(3);
    });

    it('deduplicates when added selector overlaps existing collection', () => {
      document.body.innerHTML = `
        <div class="a b"></div>
        <div class="a"></div>
        <div class="b"></div>
      `;
      const $combined = $('.a').add('.b');
      // .a matches 2 (a-b and a). .b matches 2 (a-b and b). Union is 3.
      expect($combined.length).toBe(3);
    });

    it('returns same Query when adding an empty selector', () => {
      document.body.innerHTML = '<div class="x"></div>';
      const $x = $('.x');
      const $added = $x.add('.nope');
      expect($added.length).toBe(1);
    });
  });

  /***************************************************************
            .first() / .last() / .eq() / .slice() / .reverse()
  ***************************************************************/

  describe('collection slicing', () => {
    it('.first() returns Query wrapping only the first element', () => {
      document.body.innerHTML = '<span class="s">a</span><span class="s">b</span>';
      const $first = $('.s').first();
      expect($first.length).toBe(1);
      expect($first.text()).toBe('a');
    });

    it('.last() returns Query wrapping only the last element', () => {
      document.body.innerHTML = '<span class="s">a</span><span class="s">b</span>';
      const $last = $('.s').last();
      expect($last.length).toBe(1);
      expect($last.text()).toBe('b');
    });

    it('.eq(index) returns Query wrapping the element at that index', () => {
      document.body.innerHTML = `
        <span class="s">a</span><span class="s">b</span><span class="s">c</span>
      `;
      expect($('.s').eq(1).text()).toBe('b');
    });

    it('.slice(start, end) returns the indexed range', () => {
      document.body.innerHTML = `
        <span class="s">0</span><span class="s">1</span>
        <span class="s">2</span><span class="s">3</span>
        <span class="s">4</span><span class="s">5</span>
      `;
      const $middle = $('.s').slice(1, 4);
      expect($middle.length).toBe(3);
      expect($middle.first().text()).toBe('1');
      expect($middle.last().text()).toBe('3');
    });

    it('.slice(-n) returns the last n elements', () => {
      document.body.innerHTML = `
        <span class="s">a</span><span class="s">b</span><span class="s">c</span>
      `;
      const $last2 = $('.s').slice(-2);
      expect($last2.length).toBe(2);
      expect($last2.first().text()).toBe('b');
    });

    it('.reverse() returns a new collection in reverse order without mutating the original', () => {
      document.body.innerHTML = `
        <div class="i" data-i="0"></div>
        <div class="i" data-i="1"></div>
        <div class="i" data-i="2"></div>
      `;
      const $original = $('.i');
      const $reversed = $original.reverse();
      expect($reversed[0].dataset.i).toBe('2');
      expect($reversed[2].dataset.i).toBe('0');
      expect($original[0].dataset.i).toBe('0');
    });
  });

  /***************************************************************
                   .each() / .map() iterators
  ***************************************************************/

  describe('iterators', () => {
    it('.each((el, index) => {}) iterates with element and index', () => {
      document.body.innerHTML = `
        <span class="s">a</span><span class="s">b</span><span class="s">c</span>
      `;
      const seen = [];
      $('.s').each((el, i) => seen.push([i, el.textContent]));
      expect(seen).toEqual([[0, 'a'], [1, 'b'], [2, 'c']]);
    });

    it('.each() inside, `this` is the Query-wrapped element', () => {
      document.body.innerHTML = '<span class="s">hi</span>';
      let received;
      $('.s').each(function() {
        received = this;
      });
      expect(received).toBeInstanceOf(Query);
      expect(received.length).toBe(1);
    });

    it('.map(fn) returns a plain JavaScript array', () => {
      document.body.innerHTML = `
        <span class="n">5</span><span class="n">10</span><span class="n">15</span>
      `;
      const result = $('.n').map((el) => el.textContent);
      expect(Array.isArray(result)).toBe(true);
      expect(result).toEqual(['5', '10', '15']);
    });
  });

  /***************************************************************
                  .get() / .el() / array index access
  ***************************************************************/

  describe('DOM element access', () => {
    it('.get(index) returns the raw DOM element at that index', () => {
      document.body.innerHTML = '<input class="a"><input class="b">';
      const a = document.querySelector('.a');
      expect($('input').get(0)).toBe(a);
    });

    it('.get() with no argument returns an array of all elements', () => {
      document.body.innerHTML = '<input><input><input>';
      const all = $('input').get();
      expect(Array.isArray(all)).toBe(true);
      expect(all.length).toBe(3);
    });

    it('.el() returns the first DOM element (alias for .get(0))', () => {
      document.body.innerHTML = '<span class="s" id="first"></span><span class="s"></span>';
      expect($('.s').el().id).toBe('first');
    });

    it('array-like index access returns raw DOM elements', () => {
      document.body.innerHTML = '<span class="s">a</span><span class="s">b</span>';
      const $s = $('.s');
      expect($s[0]).toBe(document.querySelectorAll('.s')[0]);
      expect($s[1]).toBe(document.querySelectorAll('.s')[1]);
    });
  });

  /***************************************************************
                .exists() / .count() / .length
  ***************************************************************/

  describe('collection size', () => {
    it('.exists() returns true when collection has elements', () => {
      document.body.innerHTML = '<div class="i"></div>';
      expect($('.i').exists()).toBe(true);
    });

    it('.exists() returns false when collection is empty', () => {
      expect($('.nope').exists()).toBe(false);
    });

    it('.count() returns the number of matched elements', () => {
      document.body.innerHTML = '<div class="i"></div><div class="i"></div>';
      expect($('.i').count()).toBe(2);
    });

    it('.count() equals .length', () => {
      document.body.innerHTML = '<div class="i"></div><div class="i"></div><div class="i"></div>';
      const $i = $('.i');
      expect($i.count()).toBe($i.length);
    });
  });

  /***************************************************************
                Content — .text() / .html() / .val()
  ***************************************************************/

  describe('content getters and setters', () => {
    it('.text() returns the textContent for a single element', () => {
      document.body.innerHTML = '<p class="p">Hello <b>world</b></p>';
      expect($('.p').text()).toBe('Hello world');
    });

    it('.text(value) sets textContent and escapes HTML', () => {
      document.body.innerHTML = '<p class="p"></p>';
      $('.p').text('<b>raw</b>');
      expect(document.querySelector('.p b')).toBeNull();
      expect(document.querySelector('.p').textContent).toBe('<b>raw</b>');
    });

    it('.html() returns innerHTML for a single element', () => {
      document.body.innerHTML = '<div class="d"><b>x</b></div>';
      expect($('.d').html()).toBe('<b>x</b>');
    });

    it('.html(value) sets innerHTML', () => {
      document.body.innerHTML = '<div class="d"></div>';
      $('.d').html('<i>i</i>');
      expect(document.querySelector('.d i')).not.toBeNull();
    });

    it('.val() and .value() are aliases', () => {
      document.body.innerHTML = '<input class="i" value="hello">';
      expect($('.i').val()).toBe('hello');
      expect($('.i').value()).toBe('hello');
    });

    it('.val(newValue) sets input value', () => {
      document.body.innerHTML = '<input class="i" value="old">';
      $('.i').val('new');
      expect(document.querySelector('.i').value).toBe('new');
    });

    it('.val() reads textarea value', () => {
      document.body.innerHTML = '<textarea class="t">body</textarea>';
      expect($('.t').val()).toBe('body');
    });

    it('.val() reads select value', () => {
      document.body.innerHTML = `
        <select class="s">
          <option value="a">A</option>
          <option value="b" selected>B</option>
        </select>
      `;
      expect($('.s').val()).toBe('b');
    });
  });

  /***************************************************************
                  Attributes — .attr() / .addAttr()
  ***************************************************************/

  describe('attributes', () => {
    it('.attr(name, value) sets an attribute', () => {
      document.body.innerHTML = '<div class="d"></div>';
      $('.d').attr('role', 'button');
      expect(document.querySelector('.d').getAttribute('role')).toBe('button');
    });

    it('.attr({ name: value }) sets multiple attributes', () => {
      document.body.innerHTML = '<div class="d"></div>';
      $('.d').attr({ role: 'button', 'aria-label': 'hello' });
      const el = document.querySelector('.d');
      expect(el.getAttribute('role')).toBe('button');
      expect(el.getAttribute('aria-label')).toBe('hello');
    });

    it('.attr(name) reads an attribute on a single element', () => {
      document.body.innerHTML = '<div class="d" role="button"></div>';
      expect($('.d').attr('role')).toBe('button');
    });

    it('.attr(name) returns an array when multiple elements match', () => {
      document.body.innerHTML = '<div class="d" role="a"></div><div class="d" role="b"></div>';
      const result = $('.d').attr('role');
      expect(Array.isArray(result)).toBe(true);
      expect(result).toEqual(['a', 'b']);
    });

    it('.removeAttr(name) removes an attribute', () => {
      document.body.innerHTML = '<div class="d" role="button"></div>';
      $('.d').removeAttr('role');
      expect(document.querySelector('.d').hasAttribute('role')).toBe(false);
    });

    it('.addAttr(name) sets a boolean attribute to empty string', () => {
      document.body.innerHTML = '<button class="b"></button>';
      $('.b').addAttr('disabled');
      expect(document.querySelector('.b').getAttribute('disabled')).toBe('');
      expect(document.querySelector('.b').hasAttribute('disabled')).toBe(true);
    });

    it('.addAttr([a, b]) sets multiple boolean attributes', () => {
      document.body.innerHTML = '<input class="i">';
      $('.i').addAttr(['required', 'readonly']);
      const el = document.querySelector('.i');
      expect(el.hasAttribute('required')).toBe(true);
      expect(el.hasAttribute('readonly')).toBe(true);
    });
  });

  /***************************************************************
                  Classes — addClass / removeClass / toggleClass
  ***************************************************************/

  describe('classes', () => {
    it('.addClass(names) adds space-separated classes', () => {
      document.body.innerHTML = '<div class="d"></div>';
      $('.d').addClass('one two');
      const el = document.querySelector('.d');
      expect(el.classList.contains('one')).toBe(true);
      expect(el.classList.contains('two')).toBe(true);
    });

    it('.removeClass(names) removes classes', () => {
      document.body.innerHTML = '<div class="d one two three"></div>';
      $('.d').removeClass('one three');
      const el = document.querySelector('.d');
      expect(el.classList.contains('one')).toBe(false);
      expect(el.classList.contains('two')).toBe(true);
      expect(el.classList.contains('three')).toBe(false);
    });

    it('.toggleClass(name) toggles a single class on and off', () => {
      document.body.innerHTML = '<div class="d"></div>';
      const $d = $('.d');
      $d.toggleClass('on');
      expect(document.querySelector('.d').classList.contains('on')).toBe(true);
      $d.toggleClass('on');
      expect(document.querySelector('.d').classList.contains('on')).toBe(false);
    });

    it('.hasClass(name) returns true when any element has the class', () => {
      document.body.innerHTML = '<div class="d active"></div><div class="d"></div>';
      expect($('.d').hasClass('active')).toBe(true);
    });

    it('.hasClass(name) returns false when no element has the class', () => {
      document.body.innerHTML = '<div class="d"></div><div class="d"></div>';
      expect($('.d').hasClass('active')).toBe(false);
    });
  });

  /***************************************************************
                  Events — .on() / .one() / .off()
  ***************************************************************/

  describe('events — .on() / .one() / .off()', () => {
    it('.on() binds an event handler', () => {
      document.body.innerHTML = '<button class="b"></button>';
      const handler = vi.fn();
      $('.b').on('click', handler);
      document.querySelector('.b').click();
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('.on() supports space-separated event names', () => {
      document.body.innerHTML = '<div class="d"></div>';
      const handler = vi.fn();
      $('.d').on('mousedown mouseup', handler);
      const el = document.querySelector('.d');
      el.dispatchEvent(new MouseEvent('mousedown'));
      el.dispatchEvent(new MouseEvent('mouseup'));
      expect(handler).toHaveBeenCalledTimes(2);
    });

    it('.on(event, selector, handler) supports event delegation', () => {
      document.body.innerHTML = `
        <div class="list">
          <div class="item">a</div>
          <div class="item">b</div>
        </div>
      `;
      const handler = vi.fn();
      $('.list').on('click', '.item', handler);
      document.querySelector('.item').click();
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('delegated handler fires on dynamically-added children too', () => {
      document.body.innerHTML = '<div class="list"></div>';
      const handler = vi.fn();
      $('.list').on('click', '.item', handler);
      $('.list').append('<div class="item">new</div>');
      document.querySelector('.item').click();
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('.one() fires only once and is removed afterwards', () => {
      document.body.innerHTML = '<button class="b"></button>';
      const handler = vi.fn();
      $('.b').one('click', handler);
      const el = document.querySelector('.b');
      el.click();
      el.click();
      el.click();
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('.off(eventName) removes handlers for that event', () => {
      document.body.innerHTML = '<button class="b"></button>';
      const handler = vi.fn();
      $('.b').on('click', handler);
      $('.b').off('click');
      document.querySelector('.b').click();
      expect(handler).not.toHaveBeenCalled();
    });

    it('.on(event, handler, { abortController }) removes via abort()', () => {
      document.body.innerHTML = '<button class="b"></button>';
      const handler = vi.fn();
      const controller = new AbortController();
      $('.b').on('click', handler, { abortController: controller });
      controller.abort();
      document.querySelector('.b').click();
      expect(handler).not.toHaveBeenCalled();
    });

    it('handler returning false calls stopPropagation but NOT preventDefault', () => {
      // SUI departure from jQuery (which does both on `return false`).
      document.body.innerHTML = '<form class="f"><button class="b" type="submit"></button></form>';
      let stopCalled = false;
      let preventCalled = false;
      const formHandler = vi.fn();
      $('.f').on('click', formHandler);
      $('.b').on('click', (e) => {
        const origStop = e.stopPropagation.bind(e);
        const origPrevent = e.preventDefault.bind(e);
        e.stopPropagation = () => {
          stopCalled = true;
          origStop();
        };
        e.preventDefault = () => {
          preventCalled = true;
          origPrevent();
        };
        return false;
      });
      document.querySelector('.b').click();
      expect(stopCalled).toBe(true);
      expect(preventCalled).toBe(false);
      expect(formHandler).not.toHaveBeenCalled();
    });

    // arrow-implicit-return is the common idiom for inline event handlers
    it('arrow-implicit-return false on .on() stops propagation', () => {
      document.body.innerHTML = '<div class="outer"><div class="inner"></div></div>';
      const outerHandler = vi.fn();
      $('.outer').on('click', outerHandler);
      $('.inner').on('click', () => false);
      document.querySelector('.inner').click();
      expect(outerHandler).not.toHaveBeenCalled();
    });

    it("handler returning 'cancel' calls preventDefault but not stopPropagation", () => {
      document.body.innerHTML = '<form class="f"></form>';
      const $form = $('.f');
      let preventCalled = false;
      $form.on('submit', (e) => {
        const orig = e.preventDefault.bind(e);
        e.preventDefault = () => {
          preventCalled = true;
          orig();
        };
        return 'cancel';
      });
      const evt = new Event('submit', { bubbles: true, cancelable: true });
      document.querySelector('.f').dispatchEvent(evt);
      expect(preventCalled).toBe(true);
    });
  });

  /***************************************************************
            Events — .trigger() / .dispatchEvent() / .click()
  ***************************************************************/

  describe('events — .trigger() and .dispatchEvent()', () => {
    it('.trigger(eventName) invokes native handler when available', () => {
      document.body.innerHTML = '<button class="b"></button>';
      const handler = vi.fn();
      $('.b').on('click', handler);
      $('.b').trigger('click');
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('.trigger(eventName) dispatches a CustomEvent when no native handler exists', () => {
      document.body.innerHTML = '<div class="d"></div>';
      const handler = vi.fn();
      $('.d').on('my-event', handler);
      $('.d').trigger('my-event');
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('.dispatchEvent(name, data) sets event.detail to the data payload', () => {
      document.body.innerHTML = '<div class="d"></div>';
      let received;
      $('.d').on('ping', (e) => {
        received = e.detail;
      });
      $('.d').dispatchEvent('ping', { value: 42 });
      expect(received).toEqual({ value: 42 });
    });

    it('.dispatchEvent() bubbles by default', () => {
      document.body.innerHTML = '<div class="parent"><div class="child"></div></div>';
      const parentHandler = vi.fn();
      $('.parent').on('ping', parentHandler);
      $('.child').dispatchEvent('ping');
      expect(parentHandler).toHaveBeenCalledTimes(1);
    });

    it('.click() is a shorthand for trigger("click")', () => {
      document.body.innerHTML = '<button class="b"></button>';
      const handler = vi.fn();
      $('.b').on('click', handler);
      $('.b').click();
      expect(handler).toHaveBeenCalledTimes(1);
    });
  });

  /***************************************************************
                          .intercept() (capture)
  ***************************************************************/

  describe('.intercept() — capture-phase event delegation', () => {
    it('fires BEFORE child .on() handlers (capture order)', () => {
      document.body.innerHTML = `
        <div class="outer">
          <div class="middle">
            <div class="inner"></div>
          </div>
        </div>
      `;
      const order = [];
      $('.outer').intercept('click', () => order.push('outer-intercept'));
      $('.middle').intercept('click', () => order.push('middle-intercept'));
      $('.inner').on('click', () => order.push('inner-bubble'));
      document.querySelector('.inner').click();
      expect(order[0]).toBe('outer-intercept');
      expect(order[1]).toBe('middle-intercept');
      expect(order[2]).toBe('inner-bubble');
    });

    it('returning false from an intercept handler stops propagation to descendants', () => {
      document.body.innerHTML = `
        <div class="parent">
          <div class="child"></div>
        </div>
      `;
      const childHandler = vi.fn();
      $('.parent').intercept('click', () => false);
      $('.child').on('click', childHandler);
      document.querySelector('.child').click();
      expect(childHandler).not.toHaveBeenCalled();
    });

    it('supports delegation: intercept("click", ".selector", handler)', () => {
      document.body.innerHTML = `
        <div class="root">
          <div class="match"></div>
          <div class="other"></div>
        </div>
      `;
      const handler = vi.fn();
      $('.root').intercept('click', '.match', handler);
      document.querySelector('.match').click();
      document.querySelector('.other').click();
      expect(handler).toHaveBeenCalledTimes(1);
    });
  });

  /***************************************************************
                          .onNext()
  ***************************************************************/

  describe('.onNext() — promise-based event waiting', () => {
    it('resolves with the event when it fires', async () => {
      document.body.innerHTML = '<button class="b"></button>';
      const promise = $('.b').onNext('click');
      document.querySelector('.b').click();
      const event = await promise;
      expect(event.type).toBe('click');
    });

    it('resolves only once even if event fires multiple times', async () => {
      // onNext resolves to ONE event not many — extra clicks should not re-fire the handler
      document.body.innerHTML = '<button class="b"></button>';
      const handler = vi.fn();
      $('.b').onNext('click').then(handler);
      const el = document.querySelector('.b');
      el.click();
      el.click();
      el.click();
      await Promise.resolve();
      await Promise.resolve();
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('rejects after the timeout when the event does not fire', async () => {
      document.body.innerHTML = '<div class="d"></div>';
      let error;
      try {
        await $('.d').onNext('click', { timeout: 20 });
      }
      catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toContain('timeout');
    });
  });

  /***************************************************************
              DOM manipulation — append/prepend/before/after
  ***************************************************************/

  describe('insertion methods', () => {
    it('.append(html) inserts at the end of the element', () => {
      document.body.innerHTML = '<div class="d"><span class="orig"></span></div>';
      $('.d').append('<span class="added"></span>');
      const children = document.querySelectorAll('.d > span');
      expect(children[0].className).toBe('orig');
      expect(children[1].className).toBe('added');
    });

    it('.prepend(html) inserts at the beginning of the element', () => {
      document.body.innerHTML = '<div class="d"><span class="orig"></span></div>';
      $('.d').prepend('<span class="added"></span>');
      const children = document.querySelectorAll('.d > span');
      expect(children[0].className).toBe('added');
      expect(children[1].className).toBe('orig');
    });

    it('.appendTo(target) moves the selection into target', () => {
      document.body.innerHTML = `
        <div class="src"><span class="moveme"></span></div>
        <div class="dest"></div>
      `;
      $('.moveme').appendTo('.dest');
      expect(document.querySelector('.src .moveme')).toBeNull();
      expect(document.querySelector('.dest .moveme')).not.toBeNull();
    });

    it('.before(content) inserts content before the element', () => {
      document.body.innerHTML = '<div class="d"></div>';
      $('.d').before('<span class="b"></span>');
      const children = Array.from(document.body.children);
      expect(children[0].className).toBe('b');
      expect(children[1].className).toBe('d');
    });

    it('.after(content) inserts content after the element', () => {
      document.body.innerHTML = '<div class="d"></div>';
      $('.d').after('<span class="a"></span>');
      const children = Array.from(document.body.children);
      expect(children[0].className).toBe('d');
      expect(children[1].className).toBe('a');
    });
  });

  /***************************************************************
                .remove() / .detach() / .clone()
  ***************************************************************/

  describe('removal and copying', () => {
    it('.remove() removes elements from the DOM', () => {
      document.body.innerHTML = '<div class="d"></div><div class="d"></div>';
      $('.d').remove();
      expect(document.querySelectorAll('.d').length).toBe(0);
    });

    it('.detach() removes elements but keeps them in the Query for reinsertion', () => {
      document.body.innerHTML = '<div class="parent"><div class="child"></div></div>';
      const $detached = $('.child').detach();
      expect(document.querySelectorAll('.child').length).toBe(0);
      expect($detached.length).toBe(1);
      $('.parent').append($detached);
      expect(document.querySelectorAll('.parent .child').length).toBe(1);
    });

    it('.clone() returns a deep copy of the elements', () => {
      document.body.innerHTML = '<div class="orig"><b>nested</b></div>';
      const $clone = $('.orig').clone();
      expect($clone.find('b').length).toBe(1);
      expect(document.querySelector('.orig')).not.toBeNull();
    });
  });

  /***************************************************************
                Visibility — .show() / .hide() / .toggle()
  ***************************************************************/

  describe('visibility', () => {
    it('.hide() sets display: none', () => {
      document.body.innerHTML = '<div class="d"></div>';
      $('.d').hide();
      expect(document.querySelector('.d').style.display).toBe('none');
    });

    // show() restores natural display, not always 'block'
    it('.show() restores display after .hide()', () => {
      document.body.innerHTML = '<div class="d"></div>';
      const $d = $('.d');
      $d.hide();
      expect(document.querySelector('.d').style.display).toBe('none');
      $d.show();
      expect(document.querySelector('.d').style.display).not.toBe('none');
    });

    it('.toggle() flips visibility', () => {
      document.body.innerHTML = '<div class="d"></div>';
      const $d = $('.d');
      $d.hide();
      expect(document.querySelector('.d').style.display).toBe('none');
      $d.toggle();
      expect(document.querySelector('.d').style.display).not.toBe('none');
      $d.toggle();
      expect(document.querySelector('.d').style.display).toBe('none');
    });
  });

  /***************************************************************
                  .data() / .removeData()
  ***************************************************************/

  describe('data attributes', () => {
    it('.data(key, value) sets a data-* attribute via dataset', () => {
      document.body.innerHTML = '<div class="d"></div>';
      $('.d').data('userId', '42');
      expect(document.querySelector('.d').dataset.userId).toBe('42');
    });

    it('.data(key) returns the dataset value for a single element', () => {
      document.body.innerHTML = '<div class="d" data-user-id="42"></div>';
      // dataset auto-camelCases data-user-id to userId
      expect($('.d').data('userId')).toBe('42');
    });

    it('.data() (no args) returns the full dataset object', () => {
      document.body.innerHTML = '<div class="d" data-a="1" data-b="2"></div>';
      const data = $('.d').data();
      expect(data).toEqual({ a: '1', b: '2' });
    });

    it('.removeData(key) removes a data attribute', () => {
      document.body.innerHTML = '<div class="d" data-a="1" data-b="2"></div>';
      $('.d').removeData('a');
      expect(document.querySelector('.d').dataset.a).toBeUndefined();
      expect(document.querySelector('.d').dataset.b).toBe('2');
    });

    it('.removeData("a b") removes multiple data attributes from space-separated string', () => {
      document.body.innerHTML = '<div class="d" data-a="1" data-b="2" data-c="3"></div>';
      $('.d').removeData('a b');
      const el = document.querySelector('.d');
      expect(el.dataset.a).toBeUndefined();
      expect(el.dataset.b).toBeUndefined();
      expect(el.dataset.c).toBe('3');
    });
  });

  /***************************************************************
                  CSS — .css() / .cssVar() / .computedStyle()
  ***************************************************************/

  describe('CSS', () => {
    it('.css(prop, value) sets inline style', () => {
      document.body.innerHTML = '<div class="d"></div>';
      $('.d').css('color', 'red');
      expect(document.querySelector('.d').style.color).toBe('red');
    });

    it('.css({ prop1: v1, prop2: v2 }) sets multiple styles at once', () => {
      document.body.innerHTML = '<div class="d"></div>';
      $('.d').css({ color: 'red', padding: '5px' });
      const el = document.querySelector('.d');
      expect(el.style.color).toBe('red');
      expect(el.style.padding).toBe('5px');
    });

    it('.css(prop) reads inline style value', () => {
      document.body.innerHTML = '<div class="d" style="color: blue;"></div>';
      expect($('.d').css('color')).toBe('blue');
    });

    it('.cssVar(name, value) sets a CSS custom property with -- prefix', () => {
      document.body.innerHTML = '<div class="d"></div>';
      $('.d').cssVar('my-var', '12px');
      expect(document.querySelector('.d').style.getPropertyValue('--my-var')).toBe('12px');
    });
  });

  /***************************************************************
                Chaining preserves the API
  ***************************************************************/

  describe('chaining', () => {
    it('mutating methods return the Query for chaining', () => {
      document.body.innerHTML = '<div class="d"></div>';
      const $d = $('.d');
      const result = $d.addClass('a').addClass('b').text('hi');
      expect(result).toBe($d);
      const el = document.querySelector('.d');
      expect(el.classList.contains('a')).toBe(true);
      expect(el.classList.contains('b')).toBe(true);
      expect(el.textContent).toBe('hi');
    });

    it('traversal methods return a NEW Query, not the original', () => {
      document.body.innerHTML = '<div class="p"><span class="c"></span></div>';
      const $p = $('.p');
      const $c = $p.find('.c');
      expect($c).not.toBe($p);
      expect($c[0]).not.toBe($p[0]);
    });
  });

  /***************************************************************
                  .prop()
  ***************************************************************/

  describe('.prop()', () => {
    it('.prop(name, value) sets a JS property on the element', () => {
      document.body.innerHTML = '<input class="i" type="checkbox">';
      $('.i').prop('checked', true);
      expect(document.querySelector('.i').checked).toBe(true);
    });

    it('.prop(name) reads a JS property from a single element', () => {
      document.body.innerHTML = '<input class="i" type="checkbox">';
      const el = document.querySelector('.i');
      el.checked = true;
      expect($('.i').prop('checked')).toBe(true);
    });

    it('.prop(name) returns array for multiple elements', () => {
      document.body.innerHTML = '<input class="i" type="checkbox"><input class="i" type="checkbox">';
      const els = document.querySelectorAll('.i');
      els[0].checked = true;
      els[1].checked = false;
      const result = $('.i').prop('checked');
      expect(Array.isArray(result)).toBe(true);
      expect(result).toEqual([true, false]);
    });
  });

  /***************************************************************
                Empty collection invariants
  ***************************************************************/

  describe('empty collection behavior', () => {
    it('iterators no-op on empty selection', () => {
      const fn = vi.fn();
      $('.nope').each(fn);
      expect(fn).not.toHaveBeenCalled();
    });

    it('.text() on empty collection returns undefined', () => {
      expect($('.nope').text()).toBeUndefined();
    });

    it('.html() on empty collection returns undefined', () => {
      expect($('.nope').html()).toBeUndefined();
    });

    it('.attr(name) on empty collection returns undefined', () => {
      expect($('.nope').attr('role')).toBeUndefined();
    });

    it('mutating methods on empty collection return the Query (chain preserved)', () => {
      // setters must not throw on empty selection, $('.nothing').addClass(...) is a common safe no-op pattern
      const $empty = $('.nope');
      expect($empty.addClass('x')).toBe($empty);
      expect($empty.removeClass('x')).toBe($empty);
      expect($empty.attr('role', 'button')).toBe($empty);
      expect($empty.text('hi')).toBe($empty);
      expect($empty.css('color', 'red')).toBe($empty);
    });
  });

  /***************************************************************
                Shadow piercing: $$ chained traversal
  ***************************************************************/

  describe('$$ shadow piercing', () => {
    it('$$ propagates pierceShadow to traversal results', () => {
      const host = document.createElement('div');
      document.body.appendChild(host);
      const shadow = host.attachShadow({ mode: 'open' });
      shadow.innerHTML = '<span class="inner"></span>';

      const $$body = $$('body');
      expect($$body.options.pierceShadow).toBe(true);
      expect($$body.find('.inner').length).toBe(1);
    });
  });
});
