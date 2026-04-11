import { $, $$, Query, registerBehavior } from '@semantic-ui/query';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

/*
  Tests for public API methods that have zero coverage in the existing test suite.
  Organized by frequency of real-world usage, highest first.
*/

describe('Query - Untested API Methods', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  /*******************************
          exists() / count()
  *******************************/

  describe('exists', () => {
    it('should return true when elements are found', () => {
      document.body.innerHTML = '<div></div>';
      expect($('div').exists()).toBe(true);
    });

    it('should return false when no elements are found', () => {
      expect($('.nothing').exists()).toBe(false);
    });

    it('should return true for a single wrapped element', () => {
      const div = document.createElement('div');
      expect($(div).exists()).toBe(true);
    });
  });

  describe('count', () => {
    it('should return the number of matched elements', () => {
      document.body.innerHTML = '<div></div><div></div><div></div>';
      expect($('div').count()).toBe(3);
    });

    it('should return 0 for an empty query', () => {
      expect($('.nothing').count()).toBe(0);
    });

    it('should equal this.length', () => {
      document.body.innerHTML = '<span></span><span></span>';
      const $spans = $('span');
      expect($spans.count()).toBe($spans.length);
    });
  });

  /*******************************
          first() / last()
  *******************************/

  describe('first', () => {
    it('should return a Query wrapping only the first element', () => {
      document.body.innerHTML = '<p>A</p><p>B</p><p>C</p>';
      const $first = $('p').first();
      expect($first.length).toBe(1);
      expect($first[0].textContent).toBe('A');
    });

    it('should be chainable', () => {
      document.body.innerHTML = '<p class="x">A</p><p>B</p>';
      const cls = $('p').first().hasClass('x');
      expect(cls).toBe(true);
    });
  });

  describe('last', () => {
    it('should return a Query wrapping only the last element', () => {
      document.body.innerHTML = '<p>A</p><p>B</p><p>C</p>';
      const $last = $('p').last();
      expect($last.length).toBe(1);
      expect($last[0].textContent).toBe('C');
    });
  });

  /*******************************
          reverse()
  *******************************/

  describe('reverse', () => {
    it('should reverse the order of elements in the collection', () => {
      document.body.innerHTML = '<p>A</p><p>B</p><p>C</p>';
      const $reversed = $('p').reverse();
      expect($reversed[0].textContent).toBe('C');
      expect($reversed[1].textContent).toBe('B');
      expect($reversed[2].textContent).toBe('A');
    });

    it('should return a new Query (chain), not mutate the original', () => {
      document.body.innerHTML = '<p>A</p><p>B</p>';
      const $original = $('p');
      const $reversed = $original.reverse();
      expect($original[0].textContent).toBe('A');
      expect($reversed[0].textContent).toBe('B');
    });
  });

  /*******************************
          detach()
  *******************************/

  describe('detach', () => {
    it('should remove elements from the DOM but keep them in the Query', () => {
      document.body.innerHTML = '<div id="keep"></div>';
      const $el = $('#keep');
      $el.detach();
      expect(document.querySelector('#keep')).toBeNull();
      // The Query still holds a reference to the element
      expect($el[0]).toBeDefined();
      expect($el[0].id).toBe('keep');
    });

    it('should allow re-insertion after detach', () => {
      document.body.innerHTML = '<div id="movable">content</div>';
      const $el = $('#movable');
      $el.detach();
      expect(document.querySelector('#movable')).toBeNull();

      // Re-insert
      $(document.body).append($el);
      expect(document.querySelector('#movable')).not.toBeNull();
      expect(document.querySelector('#movable').textContent).toBe('content');
    });

    it('should handle elements that are already detached', () => {
      const div = document.createElement('div');
      // Not attached to DOM at all — parentNode is null
      const $el = $(div);
      expect(() => $el.detach()).not.toThrow();
    });
  });

  /*******************************
           map()
  *******************************/

  describe('map', () => {
    it('should map over elements and return a plain array', () => {
      document.body.innerHTML = '<p>A</p><p>B</p><p>C</p>';
      const texts = $('p').map(el => el.textContent);
      expect(texts).toEqual(['A', 'B', 'C']);
    });

    it('should pass element and index to callback', () => {
      document.body.innerHTML = '<div></div><div></div>';
      const indices = $('div').map((el, i) => i);
      expect(indices).toEqual([0, 1]);
    });
  });

  /*******************************
      Symbol.iterator (for...of)
  *******************************/

  describe('Symbol.iterator', () => {
    it('should allow iteration with for...of', () => {
      document.body.innerHTML = '<li>1</li><li>2</li><li>3</li>';
      const $items = $('li');
      const texts = [];
      for (const el of $items) {
        texts.push(el.textContent);
      }
      expect(texts).toEqual(['1', '2', '3']);
    });

    it('should allow spread into an array', () => {
      document.body.innerHTML = '<span>a</span><span>b</span>';
      const elements = [...$('span')];
      expect(elements).toHaveLength(2);
      expect(elements[0].textContent).toBe('a');
    });
  });

  /*******************************
      Symbol.hasInstance (instanceof)
  *******************************/

  describe('instanceof Query', () => {
    it('should return true for Query instances', () => {
      document.body.innerHTML = '<div></div>';
      expect($('div') instanceof Query).toBe(true);
    });

    it('should return true for chained results', () => {
      document.body.innerHTML = '<div><span></span></div>';
      expect($('div').find('span') instanceof Query).toBe(true);
    });

    it('should return false for non-Query objects', () => {
      expect({} instanceof Query).toBe(false);
      expect(null instanceof Query).toBe(false);
    });

    it('should return true for objects created via Object.create(Query.prototype)', () => {
      const fake = Object.create(Query.prototype);
      expect(fake instanceof Query).toBe(true);
    });

    it('should return true for Query.wrap() instances', () => {
      document.body.innerHTML = '<div></div>';
      const wrapped = Query.wrap(document.querySelector('div'));
      expect(wrapped instanceof Query).toBe(true);
    });

    it('should detect wrap instances passed back into Query constructor', () => {
      document.body.innerHTML = '<span></span>';
      const wrapped = Query.wrap(document.querySelector('span'));
      const $el = new Query(wrapped);
      expect($el instanceof Query).toBe(true);
      expect($el.length).toBe(1);
    });
  });

  /*******************************
          onNext()
  *******************************/

  describe('onNext', () => {
    it('should return a promise that resolves on the next event', async () => {
      document.body.innerHTML = '<button id="btn"></button>';
      const $btn = $('#btn');

      const promise = $btn.onNext('click');
      $btn.trigger('click');

      const event = await promise;
      expect(event).toBeInstanceOf(Event);
    });

    it('should only resolve once even if event fires multiple times', async () => {
      document.body.innerHTML = '<div id="target"></div>';
      const $el = $('#target');
      let resolveCount = 0;

      const promise = $el.onNext('custom-event');
      promise.then(() => resolveCount++);

      $el.trigger('custom-event');
      $el.trigger('custom-event');
      $el.trigger('custom-event');

      await promise;
      // Allow microtasks to settle
      await new Promise(r => setTimeout(r, 0));
      expect(resolveCount).toBe(1);
    });

    it('should reject with timeout when event does not fire', async () => {
      document.body.innerHTML = '<div id="target"></div>';
      const $el = $('#target');

      await expect(
        $el.onNext('never-fires', { timeout: 50 })
      ).rejects.toThrow(/timeout/i);
    });
  });

  /*******************************
        computedStyle()
  *******************************/

  describe('computedStyle', () => {
    it('should be a shorthand for css with includeComputed: true', () => {
      document.body.innerHTML = '<div id="test" style="color: red;"></div>';
      const result = $('#test').computedStyle('color');
      // jsdom returns computed values, color may be normalized
      expect(typeof result).toBe('string');
    });
  });

  /*******************************
          cssVar()
  *******************************/

  describe('cssVar', () => {
    it('should set a CSS custom property with -- prefix', () => {
      document.body.innerHTML = '<div id="test"></div>';
      const $el = $('#test');
      $el.cssVar('color', 'blue');
      expect($el[0].style.getPropertyValue('--color')).toBe('blue');
    });

    it('should get a CSS custom property', () => {
      document.body.innerHTML = '<div id="test" style="--size: 16px;"></div>';
      const result = $('#test').cssVar('size');
      // cssVar calls css with includeComputed: true
      expect(typeof result).toBe('string');
    });
  });

  /*******************************
         ready()
  *******************************/

  describe('ready', () => {
    it('should call handler immediately when document is already loaded', () => {
      const handler = vi.fn();
      $(document).ready(handler);
      expect(handler).toHaveBeenCalledOnce();
    });

    it('should pass an event to the handler', () => {
      let receivedEvent;
      $(document).ready((event) => {
        receivedEvent = event;
      });
      expect(receivedEvent).toBeInstanceOf(Event);
    });

    it('should return the Query for chaining', () => {
      const $doc = $(document);
      const result = $doc.ready(() => {});
      expect(result).toBe($doc);
    });
  });

  /*******************************
       Plugin System ($.fn)
  *******************************/

  describe('$.fn / $.plugin', () => {
    it('should expose the Query prototype for extension', () => {
      expect($.fn).toBe(Query.prototype);
      expect($.plugin).toBe(Query.prototype);
    });

    it('should share prototype between $ and $$', () => {
      expect($.fn).toBe($$.fn);
      expect($.plugin).toBe($$.plugin);
    });

    it('should allow adding custom methods via $.fn', () => {
      $.fn.customTestMethod = function() {
        return 'custom';
      };

      document.body.innerHTML = '<div></div>';
      expect($('div').customTestMethod()).toBe('custom');

      // Clean up
      delete $.fn.customTestMethod;
    });
  });

  /*******************************
     logLevel / logPerformance
  *******************************/

  describe('logLevel and logPerformance', () => {
    const originalLogLevel = $.logLevel;
    const originalLogPerf = $.logPerformance;

    afterEach(() => {
      $.logLevel = originalLogLevel;
      $.logPerformance = originalLogPerf;
    });

    it('should expose logLevel as a getter/setter on $', () => {
      $.logLevel = 'warn';
      expect($.logLevel).toBe('warn');
      expect(Query.logLevel).toBe('warn');
    });

    it('should expose logPerformance as a getter/setter on $', () => {
      $.logPerformance = true;
      expect($.logPerformance).toBe(true);
      expect(Query.logPerformance).toBe(true);
    });

    it('should share logLevel between $ and $$', () => {
      $.logLevel = 'error';
      expect($$.logLevel).toBe('error');
    });
  });

  /*******************************
      registerBehavior()
  *******************************/

  describe('registerBehavior', () => {
    it('should throw when behavior has no name', () => {
      expect(() => registerBehavior({})).toThrow('Behavior must have a name');
    });

    it('should register a behavior as a method on Query.prototype', () => {
      registerBehavior({
        name: 'testBehaviorOne',
        createBehavior: () => ({
          greet() { return 'hello'; },
        }),
      });

      expect(typeof Query.prototype.testBehaviorOne).toBe('function');
    });

    it('should silently skip re-registration of the same behavior name', () => {
      // First registration
      registerBehavior({
        name: 'testBehaviorDup',
        createBehavior: () => ({}),
      });

      // Second registration should not throw
      expect(() => {
        registerBehavior({
          name: 'testBehaviorDup',
          createBehavior: () => ({}),
        });
      }).not.toThrow();
    });

    it('should track registered behaviors in Query.behaviors map', () => {
      registerBehavior({
        name: 'testBehaviorTracked',
        createBehavior: () => ({}),
      });

      expect(Query.behaviors.has('testBehaviorTracked')).toBe(true);
    });

    it('should create a behavior instance on the element when invoked', () => {
      registerBehavior({
        name: 'testBehaviorInstance',
        createBehavior: () => ({
          getValue() { return 42; },
        }),
      });

      document.body.innerHTML = '<div id="target"></div>';
      const el = document.querySelector('#target');
      $(el).testBehaviorInstance();

      // Behavior is stored on the element under its namespace
      expect(el.testBehaviorInstance).toBeDefined();
    });

    it('should allow calling methods via string invocation', () => {
      registerBehavior({
        name: 'testBehaviorCall',
        createBehavior: () => ({
          multiply(x) { return x * 2; },
        }),
      });

      document.body.innerHTML = '<div id="target"></div>';
      const $el = $('#target');
      $el.testBehaviorCall(); // Initialize
      const result = $el.testBehaviorCall('multiply', 5);
      expect(result).toBe(10);
    });

    it('should merge defaultSettings with user settings', () => {
      registerBehavior({
        name: 'testBehaviorSettings',
        defaultSettings: {
          color: 'red',
          size: 10,
        },
        createBehavior: ({ settings }) => ({
          getSettings() { return settings; },
        }),
      });

      document.body.innerHTML = '<div id="target"></div>';
      const $el = $('#target');
      $el.testBehaviorSettings({ color: 'blue' });

      const el = document.querySelector('#target');
      const settings = el.testBehaviorSettings.settings;
      expect(settings.color).toBe('blue');
      expect(settings.size).toBe(10);
    });

    it('should destroy and recreate on reinitialize', () => {
      let destroyCount = 0;
      let createCount = 0;

      registerBehavior({
        name: 'testBehaviorReinit',
        createBehavior: () => {
          createCount++;
          return {};
        },
        onDestroyed: () => {
          destroyCount++;
        },
      });

      document.body.innerHTML = '<div id="target"></div>';
      const $el = $('#target');

      // First init
      $el.testBehaviorReinit();
      expect(createCount).toBe(1);

      // Reinitialize by calling with no method and no string — existing instance triggers reinitialize
      $el.testBehaviorReinit();
      expect(destroyCount).toBe(1);
      expect(createCount).toBe(2);
    });
  });

  /*******************************
     Constructor Edge Cases
  *******************************/

  describe('constructor edge cases', () => {
    it('should handle null root gracefully without throwing', () => {
      // When root is null, constructor returns early — length is undefined
      const $q = new Query('div', { root: null });
      expect($q.length).toBeUndefined();
    });

    it('should handle window/globalThis selectors', () => {
      const $win = $('window');
      expect($win.isGlobal).toBe(true);
      expect($win.length).toBe(1);
    });

    it('should handle globalThis string selector', () => {
      const $g = $('globalThis');
      expect($g.isGlobal).toBe(true);
    });
  });

  /*******************************
      setting() / settings()
  *******************************/

  describe('setting and settings on Query prototype', () => {
    it('setting() should get a property from the element', () => {
      document.body.innerHTML = '<div id="test"></div>';
      const el = document.querySelector('#test');
      el.myProp = 'hello';

      const result = $('#test').setting('myProp');
      expect(result).toBe('hello');
    });

    it('setting() should set a property on the element', () => {
      document.body.innerHTML = '<div id="test"></div>';
      const el = document.querySelector('#test');
      $('#test').setting('myProp', 42);
      expect(el.myProp).toBe(42);
    });

    it('settings() should set multiple properties on the element', () => {
      document.body.innerHTML = '<div id="test"></div>';
      const el = document.querySelector('#test');
      $('#test').settings({ a: 1, b: 2 });
      expect(el.a).toBe(1);
      expect(el.b).toBe(2);
    });
  });

  /*******************************
        chain() / end()
  *******************************/

  describe('chain and end', () => {
    it('end() should return the previous Query in a chained operation', () => {
      document.body.innerHTML = '<div><span></span></div>';
      const $div = $('div');
      const $span = $div.find('span');
      const $back = $span.end();
      expect($back[0]).toBe($div[0]);
    });

    it('end() should return itself if there is no previous object', () => {
      document.body.innerHTML = '<div></div>';
      const $div = $('div');
      expect($div.end()).toBe($div);
    });
  });

  /*******************************
        Event getEventArray
  *******************************/

  describe('getEventArray', () => {
    it('should parse space-separated events', () => {
      document.body.innerHTML = '<div></div>';
      const $el = $('div');
      const events = $el.getEventArray('click mousedown');
      expect(events).toHaveLength(2);
      expect(events[0].eventName).toBe('click');
      expect(events[1].eventName).toBe('mousedown');
    });

    it('should parse namespaced events', () => {
      document.body.innerHTML = '<div></div>';
      const $el = $('div');
      const events = $el.getEventArray('click.myNamespace');
      expect(events).toHaveLength(1);
      expect(events[0].eventName).toBe('click');
      expect(events[0].namespaces).toEqual(['myNamespace']);
    });

    it('should parse pure namespace strings', () => {
      document.body.innerHTML = '<div></div>';
      const $el = $('div');
      const events = $el.getEventArray('.myNamespace');
      expect(events).toHaveLength(1);
      expect(events[0].eventName).toBeNull();
      expect(events[0].namespaces).toEqual(['myNamespace']);
    });

    it('should resolve event aliases like ready -> DOMContentLoaded', () => {
      document.body.innerHTML = '<div></div>';
      const $el = $('div');
      const events = $el.getEventArray('ready');
      expect(events[0].eventName).toBe('DOMContentLoaded');
    });
  });

  /*******************************
        submit()
  *******************************/

  describe('submit', () => {
    it('should trigger requestSubmit on form elements', () => {
      document.body.innerHTML = '<form id="test"></form>';
      const form = document.getElementById('test');
      const spy = vi.fn();
      // jsdom supports requestSubmit, mock it for testing
      form.requestSubmit = spy;

      $('#test').submit();
      expect(spy).toHaveBeenCalled();
    });
  });

  /*******************************
     component() / dataContext()
  *******************************/

  describe('component', () => {
    it('should return component property from element', () => {
      document.body.innerHTML = '<div id="test"></div>';
      const el = document.getElementById('test');
      el.component = { name: 'button' };

      expect($(el).component()).toEqual({ name: 'button' });
    });

    it('should return undefined when no component attached', () => {
      document.body.innerHTML = '<div id="test"></div>';
      expect($('#test').component()).toBeUndefined();
    });

    it('should return array for multiple elements with components', () => {
      document.body.innerHTML = '<div class="c"></div><div class="c"></div>';
      const els = document.querySelectorAll('.c');
      els[0].component = { name: 'a' };
      els[1].component = { name: 'b' };

      const result = $('.c').component();
      expect(result).toEqual([{ name: 'a' }, { name: 'b' }]);
    });

    it('should filter out elements without component', () => {
      document.body.innerHTML = '<div class="c"></div><div class="c"></div>';
      const els = document.querySelectorAll('.c');
      els[0].component = { name: 'only' };
      // els[1] has no component

      const result = $('.c').component();
      expect(result).toEqual({ name: 'only' });
    });
  });

  describe('dataContext', () => {
    it('should return dataContext property from element', () => {
      document.body.innerHTML = '<div id="test"></div>';
      const el = document.getElementById('test');
      el.dataContext = { items: [1, 2, 3] };

      expect($(el).dataContext()).toEqual({ items: [1, 2, 3] });
    });

    it('should return undefined when no context attached', () => {
      document.body.innerHTML = '<div id="test"></div>';
      expect($('#test').dataContext()).toBeUndefined();
    });
  });

  /*******************************
       Query.wrap() static
  *******************************/

  describe('Query.wrap', () => {
    it('should create a minimal Query wrapper around a single element', () => {
      document.body.innerHTML = '<div id="test"></div>';
      const el = document.getElementById('test');
      const $el = Query.wrap(el, { root: document });

      expect($el.length).toBe(1);
      expect($el[0]).toBe(el);
      expect($el.el()).toBe(el);
    });

    it('should preserve options', () => {
      const el = document.createElement('div');
      const options = { root: document, pierceShadow: true };
      const $el = Query.wrap(el, options);
      expect($el.options).toBe(options);
    });

    it('should be usable with Query prototype methods', () => {
      document.body.innerHTML = '<div id="test" class="active"></div>';
      const el = document.getElementById('test');
      const $el = Query.wrap(el, { root: document });
      expect($el.hasClass('active')).toBe(true);
    });
  });

  /*******************************
       Query.isWindow() static
  *******************************/

  describe('Query.isWindow', () => {
    it('should return true for globalThis', () => {
      expect(Query.isWindow(globalThis)).toBe(true);
    });

    it('should return true for globalThisProxy', () => {
      expect(Query.isWindow(Query.globalThisProxy)).toBe(true);
    });

    it('should return false for regular DOM elements', () => {
      document.body.innerHTML = '<div></div>';
      expect(Query.isWindow(document.querySelector('div'))).toBe(false);
    });

    it('should return false for null/undefined', () => {
      expect(Query.isWindow(null)).toBe(false);
      expect(Query.isWindow(undefined)).toBe(false);
    });
  });

  /*******************************
     filter / is / not edge cases
  *******************************/

  describe('filter with Query/element/array', () => {
    it('should filter by Query object', () => {
      document.body.innerHTML = '<div><span class="a"></span><span class="b"></span><span class="c"></span></div>';
      const $subset = $('.a, .c');
      const $filtered = $('span').filter($subset);
      expect($filtered.count()).toBe(2);
    });

    it('should filter by single DOM element', () => {
      document.body.innerHTML = '<div><span id="x"></span><span id="y"></span></div>';
      const target = document.getElementById('x');
      const $filtered = $('span').filter(target);
      expect($filtered.count()).toBe(1);
      expect($filtered.el()).toBe(target);
    });

    it('should filter by array of elements', () => {
      document.body.innerHTML = '<div><span id="a"></span><span id="b"></span><span id="c"></span></div>';
      const targets = [document.getElementById('a'), document.getElementById('c')];
      const $filtered = $('span').filter(targets);
      expect($filtered.count()).toBe(2);
    });

    it('should return self for null/undefined filter', () => {
      document.body.innerHTML = '<div></div>';
      const $el = $('div');
      expect($el.filter(null)).toBe($el);
      expect($el.filter(undefined)).toBe($el);
    });
  });

  describe('is with element/Query', () => {
    it('should match against a DOM element', () => {
      document.body.innerHTML = '<div id="test"></div>';
      const el = document.getElementById('test');
      expect($('#test').is(el)).toBe(true);
    });

    it('should match against a Query object', () => {
      document.body.innerHTML = '<div id="test"></div>';
      const $match = $('#test');
      expect($('#test').is($match)).toBe(true);
    });

    it('should return false on empty collection', () => {
      expect($('.nope').is('div')).toBe(false);
    });
  });

  describe('not with element/Query', () => {
    it('should exclude by Query object', () => {
      document.body.innerHTML = '<span class="a"></span><span class="b"></span>';
      const $exclude = $('.a');
      const $result = $('span').not($exclude);
      expect($result.count()).toBe(1);
      expect($result.hasClass('b')).toBe(true);
    });

    it('should exclude by DOM element', () => {
      document.body.innerHTML = '<span id="x"></span><span id="y"></span>';
      const el = document.getElementById('x');
      const $result = $('span').not(el);
      expect($result.count()).toBe(1);
      expect($result.el().id).toBe('y');
    });
  });

  /*******************************
     onNext timeout edge case
  *******************************/

  describe('onNext timeout behavior', () => {
    it('should clear timeout when event fires before deadline', async () => {
      document.body.innerHTML = '<div id="test"></div>';
      const $el = $('#test');

      const promise = $el.onNext('click', { timeout: 5000 });
      $el.trigger('click');

      const event = await promise;
      expect(event).toBeInstanceOf(Event);
      // No rejection should happen — timeout was cleared
    });
  });

  /*******************************
     outerHTML edge cases
  *******************************/

  describe('outerHTML', () => {
    it('should return undefined for empty collection', () => {
      expect($('.nope').outerHTML()).toBeUndefined();
    });

    it('should concatenate outerHTML from multiple elements', () => {
      document.body.innerHTML = '<span class="t">a</span><span class="t">b</span>';
      const result = $('.t').outerHTML();
      expect(result).toBe('<span class="t">a</span><span class="t">b</span>');
    });
  });

  /*******************************
   prop for empty/multiple elements
  *******************************/

  describe('prop edge cases', () => {
    it('should return undefined for empty collection', () => {
      expect($('.nope').prop('value')).toBeUndefined();
    });

    it('should return array for multiple elements', () => {
      document.body.innerHTML = '<div class="t"></div><div class="t"></div>';
      document.querySelectorAll('.t')[0].myProp = 'a';
      document.querySelectorAll('.t')[1].myProp = 'b';
      const result = $('.t').prop('myProp');
      expect(result).toEqual(['a', 'b']);
    });
  });
});
