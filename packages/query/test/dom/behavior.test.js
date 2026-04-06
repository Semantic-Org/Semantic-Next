import { $, Query, registerBehavior } from '@semantic-ui/query';
import { Behavior } from '../../src/behavior.js';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

/*
  Tests for the Behavior class and registerBehavior integration.
  These are jsdom tests covering the core Behavior API surface
  that has zero coverage in the existing suite.
*/

describe('Behavior', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  describe('parseTemplate', () => {
    it('should replace {key} placeholders with data values', () => {
      document.body.innerHTML = '<div id="test"></div>';
      const el = document.getElementById('test');
      const behavior = createMinimalBehavior(el);

      const result = behavior.parseTemplate('Hello {name}, you are {age}', {
        name: 'World',
        age: '30',
      });
      expect(result).toBe('Hello World, you are 30');
    });

    it('should replace missing keys with empty string', () => {
      document.body.innerHTML = '<div id="test"></div>';
      const el = document.getElementById('test');
      const behavior = createMinimalBehavior(el);

      const result = behavior.parseTemplate('{greeting} {missing}!', {
        greeting: 'Hi',
      });
      expect(result).toBe('Hi !');
    });

    it('should replace all occurrences of the same key', () => {
      document.body.innerHTML = '<div id="test"></div>';
      const el = document.getElementById('test');
      const behavior = createMinimalBehavior(el);

      const result = behavior.parseTemplate('{x} and {x}', { x: 'yes' });
      expect(result).toBe('yes and yes');
    });

    it('should return original string when no placeholders match', () => {
      document.body.innerHTML = '<div id="test"></div>';
      const el = document.getElementById('test');
      const behavior = createMinimalBehavior(el);

      const result = behavior.parseTemplate('no placeholders here', { key: 'val' });
      expect(result).toBe('no placeholders here');
    });
  });

  describe('parseEventString', () => {
    it('should parse a simple event with selector', () => {
      document.body.innerHTML = '<div id="test"></div>';
      const el = document.getElementById('test');
      const behavior = createMinimalBehavior(el);

      const events = behavior.parseEventString('click .button');
      expect(events).toHaveLength(1);
      expect(events[0].eventName).toBe('click');
      expect(events[0].selector).toBe('.button');
      expect(events[0].eventType).toBe('delegate');
    });

    it('should parse global keyword', () => {
      document.body.innerHTML = '<div id="test"></div>';
      const el = document.getElementById('test');
      const behavior = createMinimalBehavior(el);

      const events = behavior.parseEventString('global click .button');
      expect(events).toHaveLength(1);
      expect(events[0].eventType).toBe('global');
      expect(events[0].eventName).toBe('click');
    });

    it('should parse bind keyword', () => {
      document.body.innerHTML = '<div id="test"></div>';
      const el = document.getElementById('test');
      const behavior = createMinimalBehavior(el);

      const events = behavior.parseEventString('bind click .target');
      expect(events).toHaveLength(1);
      expect(events[0].eventType).toBe('bind');
    });

    it('should handle event without selector (binds to component)', () => {
      document.body.innerHTML = '<div id="test"></div>';
      const el = document.getElementById('test');
      const behavior = createMinimalBehavior(el);

      const events = behavior.parseEventString('click');
      expect(events).toHaveLength(1);
      expect(events[0].eventName).toBe('click');
      expect(events[0].selector).toBe('');
    });

    it('should map non-bubbling events to bubbling equivalents', () => {
      document.body.innerHTML = '<div id="test"></div>';
      const el = document.getElementById('test');
      const behavior = createMinimalBehavior(el);

      const events = behavior.parseEventString('focus .input');
      expect(events[0].eventName).toBe('focusin');

      const blurEvents = behavior.parseEventString('blur .input');
      expect(blurEvents[0].eventName).toBe('focusout');

      const enterEvents = behavior.parseEventString('mouseenter .item');
      expect(enterEvents[0].eventName).toBe('mouseover');

      const leaveEvents = behavior.parseEventString('mouseleave .item');
      expect(leaveEvents[0].eventName).toBe('mouseout');
    });

    it('should parse comma-separated selectors', () => {
      document.body.innerHTML = '<div id="test"></div>';
      const el = document.getElementById('test');
      const behavior = createMinimalBehavior(el);

      const events = behavior.parseEventString('click .foo, .bar');
      expect(events).toHaveLength(2);
      expect(events[0].selector).toBe('.foo');
      expect(events[1].selector).toBe('.bar');
    });

    it('should apply template substitution using selectors', () => {
      document.body.innerHTML = '<div id="test"></div>';
      const el = document.getElementById('test');
      const behavior = createMinimalBehavior(el, {
        selectors: { trigger: '.my-trigger' },
      });

      const events = behavior.parseEventString('click {trigger}');
      expect(events[0].selector).toBe('.my-trigger');
    });
  });

  describe('getElementData', () => {
    it('should return parsed data attributes from element', () => {
      document.body.innerHTML = '<div id="test" data-count="42" data-active="true" data-label="hello"></div>';
      const el = document.getElementById('test');
      const behavior = createMinimalBehavior(el);

      const data = behavior.getElementData();
      expect(data.count).toBe(42);
      expect(data.active).toBe(true);
      expect(data.label).toBe('hello');
    });

    it('should return raw string for non-JSON values', () => {
      document.body.innerHTML = '<div id="test" data-name="some text"></div>';
      const el = document.getElementById('test');
      const behavior = createMinimalBehavior(el);

      const data = behavior.getElementData();
      expect(data.name).toBe('some text');
    });
  });

  describe('lookup', () => {
    it('should find top-level properties', () => {
      document.body.innerHTML = '<div id="test"></div>';
      const el = document.getElementById('test');
      const behavior = createMinimalBehavior(el);
      behavior.myValue = 'found';

      expect(behavior.lookup('myValue')).toBe('found');
    });

    it('should find nested properties using dot notation', () => {
      document.body.innerHTML = '<div id="test"></div>';
      const el = document.getElementById('test');
      const behavior = createMinimalBehavior(el);
      behavior.nested = { deep: 'value' };

      expect(behavior.lookup('nested.deep')).toBe('value');
    });

    it('should find properties using space-separated path', () => {
      document.body.innerHTML = '<div id="test"></div>';
      const el = document.getElementById('test');
      const behavior = createMinimalBehavior(el);
      behavior.nested = { deep: 'value' };

      expect(behavior.lookup('nested deep')).toBe('value');
    });

    it('should return undefined for missing properties', () => {
      document.body.innerHTML = '<div id="test"></div>';
      const el = document.getElementById('test');
      const behavior = createMinimalBehavior(el);

      expect(behavior.lookup('nonexistent')).toBeUndefined();
    });

    it('should return undefined for null/empty input', () => {
      document.body.innerHTML = '<div id="test"></div>';
      const el = document.getElementById('test');
      const behavior = createMinimalBehavior(el);

      expect(behavior.lookup(null)).toBeUndefined();
      expect(behavior.lookup('')).toBeUndefined();
      expect(behavior.lookup(undefined)).toBeUndefined();
    });

    it('should try camelCase conversion for multi-part names', () => {
      document.body.innerHTML = '<div id="test"></div>';
      const el = document.getElementById('test');
      const behavior = createMinimalBehavior(el);
      behavior.isActive = true;

      // 'is active' should try 'isActive' via camelCase
      expect(behavior.lookup('is active')).toBe(true);
    });
  });

  describe('callMethod', () => {
    it('should invoke a method on the behavior', () => {
      document.body.innerHTML = '<div id="test"></div>';
      const el = document.getElementById('test');
      const behavior = createMinimalBehavior(el);
      behavior.greet = function(name) { return `Hello ${name}`; };

      expect(behavior.callMethod('greet', 'World')).toBe('Hello World');
    });

    it('should return property value for non-function lookups', () => {
      document.body.innerHTML = '<div id="test"></div>';
      const el = document.getElementById('test');
      const behavior = createMinimalBehavior(el);
      behavior.status = 'active';

      expect(behavior.callMethod('status')).toBe('active');
    });

    it('should fall back to customInvocation when method not found', () => {
      document.body.innerHTML = '<div id="test"></div>';
      const el = document.getElementById('test');
      const behavior = createMinimalBehavior(el, {
        customInvocation: function({ methodName, methodArgs }) {
          return `custom: ${methodName}(${methodArgs.join(',')})`;
        },
      });

      const result = behavior.callMethod('unknown', 'a', 'b');
      expect(result).toBe('custom: unknown(a,b)');
    });
  });

  describe('canLog', () => {
    it('should respect log level hierarchy', () => {
      document.body.innerHTML = '<div id="test"></div>';
      const el = document.getElementById('test');
      const behavior = createMinimalBehavior(el);

      behavior.logLevel = 'debug';
      expect(behavior.canLog('error')).toBe(true);
      expect(behavior.canLog('warn')).toBe(true);
      expect(behavior.canLog('info')).toBe(true);
      expect(behavior.canLog('debug')).toBe(true);

      behavior.logLevel = 'error';
      expect(behavior.canLog('error')).toBe(true);
      expect(behavior.canLog('warn')).toBe(false);
      expect(behavior.canLog('info')).toBe(false);
      expect(behavior.canLog('debug')).toBe(false);

      behavior.logLevel = 'silent';
      expect(behavior.canLog('error')).toBe(false);
    });
  });

  describe('setting (on Behavior)', () => {
    it('should get a setting value', () => {
      document.body.innerHTML = '<div id="test"></div>';
      const el = document.getElementById('test');
      const behavior = createMinimalBehavior(el, {
        settings: { color: 'red', size: 10 },
      });

      expect(behavior.setting('color')).toBe('red');
      expect(behavior.setting('size')).toBe(10);
    });

    it('should set a setting value', () => {
      document.body.innerHTML = '<div id="test"></div>';
      const el = document.getElementById('test');
      const behavior = createMinimalBehavior(el, {
        settings: { color: 'red' },
      });

      behavior.setting('color', 'blue');
      expect(behavior.settings.color).toBe('blue');
    });
  });

  describe('dispatchEvent', () => {
    it('should dispatch a namespaced custom event', () => {
      document.body.innerHTML = '<div id="test"></div>';
      const el = document.getElementById('test');
      const behavior = createMinimalBehavior(el, { namespace: 'myBehavior' });

      const spy = vi.fn();
      el.addEventListener('myBehavior:show', spy);
      behavior.dispatchEvent('show', { value: 42 });

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][0].detail.value).toBe(42);
    });

    it('should not double-namespace already namespaced events', () => {
      document.body.innerHTML = '<div id="test"></div>';
      const el = document.getElementById('test');
      const behavior = createMinimalBehavior(el, { namespace: 'myBehavior' });

      const spy = vi.fn();
      el.addEventListener('myBehavior:show', spy);
      behavior.dispatchEvent('myBehavior:show');

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('destroy', () => {
    it('should remove events, mutations, call onDestroyed, and clean up element reference', () => {
      const onDestroyed = vi.fn();
      document.body.innerHTML = '<div id="test"></div>';
      const el = document.getElementById('test');
      const behavior = createMinimalBehavior(el, {
        namespace: 'destroyTest',
        onDestroyed,
      });

      // Verify it exists
      expect(el.destroyTest).toBe(behavior);

      behavior.destroy();

      expect(onDestroyed).toHaveBeenCalledTimes(1);
      expect(el.destroyTest).toBeUndefined();
    });
  });

  describe('getInstance', () => {
    it('should return the behavior instance from an element', () => {
      document.body.innerHTML = '<div id="test"></div>';
      const el = document.getElementById('test');
      const behavior = createMinimalBehavior(el, { namespace: 'testInstance' });

      const instance = Behavior.getInstance(el, 'testInstance');
      expect(instance).toBe(behavior);
    });

    it('should return undefined when no instance exists', () => {
      document.body.innerHTML = '<div id="test"></div>';
      const el = document.getElementById('test');
      expect(Behavior.getInstance(el, 'nope')).toBeUndefined();
    });
  });

  describe('runSetup', () => {
    it('should execute setup function and return its result', () => {
      document.body.innerHTML = '<div id="test"></div>';
      const $elements = $('div');

      const result = Behavior.runSetup(
        ({ settings }) => ({ sharedValue: settings.x * 2 }),
        { $elements, settings: { x: 5 }, templates: {} }
      );

      expect(result).toEqual({ sharedValue: 10 });
    });

    it('should provide $ helper in setup args', () => {
      document.body.innerHTML = '<div id="test"></div>';
      const $elements = $('div');

      const result = Behavior.runSetup(
        ({ $ }) => {
          // $ should be a function that creates Query instances
          return { hasHelper: typeof $ === 'function' };
        },
        { $elements, settings: {}, templates: {} }
      );

      expect(result.hasHelper).toBe(true);
    });
  });

  describe('addDataOverrides', () => {
    it('should override settings from data attributes', () => {
      document.body.innerHTML = '<div id="test" data-color="green"></div>';
      const el = document.getElementById('test');
      const behavior = createMinimalBehavior(el, {
        settings: { color: 'red', size: 10 },
      });

      // addDataOverrides is called in constructor, so settings should already be overridden
      expect(behavior.settings.color).toBe('green');
      expect(behavior.settings.size).toBe(10); // unchanged, no data attribute
    });
  });

  describe('call', () => {
    it('should invoke callback with standard params', () => {
      document.body.innerHTML = '<div id="test"></div>';
      const el = document.getElementById('test');
      const behavior = createMinimalBehavior(el, { namespace: 'callTest' });

      let receivedParams;
      behavior.call(function(params) {
        receivedParams = params;
      });

      expect(receivedParams).toBeDefined();
      expect(typeof receivedParams.$).toBe('function');
      expect(receivedParams.el).toBe(el);
      expect(receivedParams.namespace).toBe('callTest');
      expect(typeof receivedParams.attachEvent).toBe('function');
      expect(typeof receivedParams.dispatchEvent).toBe('function');
      expect(typeof receivedParams.log).toBe('function');
      expect(typeof receivedParams.debug).toBe('function');
      expect(typeof receivedParams.warn).toBe('function');
      expect(typeof receivedParams.error).toBe('function');
    });

    it('should pass additionalParams into the params object', () => {
      document.body.innerHTML = '<div id="test"></div>';
      const el = document.getElementById('test');
      const behavior = createMinimalBehavior(el);

      let receivedParams;
      behavior.call(
        function(params) { receivedParams = params; },
        { additionalParams: { extra: 'data' } }
      );

      expect(receivedParams.extra).toBe('data');
    });

    it('should not throw when func is not a function', () => {
      document.body.innerHTML = '<div id="test"></div>';
      const el = document.getElementById('test');
      const behavior = createMinimalBehavior(el);

      expect(() => behavior.call(null)).not.toThrow();
      expect(() => behavior.call(undefined)).not.toThrow();
      expect(() => behavior.call('string')).not.toThrow();
    });
  });

  describe('integration: registerBehavior with events', () => {
    it('should attach events defined in the events object', () => {
      // Need a unique name each time since behaviors can't be re-registered
      const name = 'testBehaviorEvents_' + Date.now();
      const clickSpy = vi.fn();

      registerBehavior({
        name,
        events: {
          'click': function({ event }) {
            clickSpy();
          },
        },
        createBehavior: () => ({}),
      });

      document.body.innerHTML = '<div id="target"></div>';
      const $el = $('#target');
      $el[name]();

      // Trigger click on the element
      $el.trigger('click');
      expect(clickSpy).toHaveBeenCalled();
    });

    it('should clean up events on destroy', () => {
      const name = 'testBehaviorCleanup_' + Date.now();
      const clickSpy = vi.fn();

      registerBehavior({
        name,
        events: {
          'click': function({ event }) {
            clickSpy();
          },
        },
        createBehavior: () => ({}),
      });

      document.body.innerHTML = '<div id="target"></div>';
      const el = document.getElementById('target');
      const $el = $(el);
      $el[name]();

      // Verify event works
      $el.trigger('click');
      expect(clickSpy).toHaveBeenCalledTimes(1);

      // Destroy and verify event removed
      el[name].destroy();
      $el.trigger('click');
      expect(clickSpy).toHaveBeenCalledTimes(1); // should not increase
    });
  });

  describe('integration: method return value aggregation', () => {
    it('should return single value when all elements return the same value', () => {
      const name = 'testBehaviorSameReturn_' + Date.now();
      registerBehavior({
        name,
        createBehavior: () => ({
          getValue() { return 'same'; },
        }),
      });

      document.body.innerHTML = '<div class="t"></div><div class="t"></div>';
      const $els = $('.t');
      $els[name](); // Initialize
      const result = $els[name]('getValue');
      expect(result).toBe('same');
    });

    it('should return array when elements return different values', () => {
      const name = 'testBehaviorDiffReturn_' + Date.now();
      let callIndex = 0;
      registerBehavior({
        name,
        createBehavior: ({ index }) => ({
          getIndex() { return index; },
        }),
      });

      document.body.innerHTML = '<div class="t"></div><div class="t"></div>';
      const $els = $('.t');
      $els[name]();
      const result = $els[name]('getIndex');
      expect(result).toEqual([0, 1]);
    });
  });
});

/*
  Helper to create a minimal Behavior instance for unit testing
  without going through the full registerBehavior pipeline.
*/
function createMinimalBehavior(el, overrides = {}) {
  const $el = $(el);
  return new Behavior({
    name: overrides.namespace || 'test',
    namespace: overrides.namespace || 'test',
    $element: $el,
    $elements: $el,
    Query,
    createBehavior: overrides.createBehavior || function() {},
    settings: overrides.settings || {},
    selectors: overrides.selectors || {},
    classNames: overrides.classNames || {},
    errors: overrides.errors || {},
    templates: overrides.templates || {},
    onCreated: overrides.onCreated || function() {},
    onDestroyed: overrides.onDestroyed || function() {},
    customInvocation: overrides.customInvocation || function() {},
    allowDataOverride: overrides.allowDataOverride !== false,
    ...overrides,
  });
}
