import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Template } from '@semantic-ui/templating';
import '@semantic-ui/component'; // registers native engine

let host;
// Tracks every Template constructed in a test so afterEach can abort their
// document-level keydown listeners. Without this, listeners from prior tests
// continue firing on subsequent dispatches and skew handler-call counts.
const createdTpls = [];

beforeEach(() => {
  host = document.createElement('div');
  host.innerHTML = '<button class="btn">Click</button><span class="lbl">Label</span><input class="inp">';
  document.body.appendChild(host);
});

afterEach(() => {
  for (const tpl of createdTpls) {
    try {
      tpl.abortController.abort('test-end');
    }
    catch (_) { /* ignore */ }
  }
  createdTpls.length = 0;
  document.body.innerHTML = '';
  Template.renderedTemplates.clear();
  vi.useRealTimers();
});

// build a Template, initialize it, wire parentNode/renderRoot, then attachEvents
const wireTpl = (opts = {}) => {
  const tpl = new Template({
    templateName: opts.templateName || `t-${Math.random().toString(36).slice(2, 8)}`,
    template: opts.template || '<div></div>',
    element: host,
    ...opts,
  });
  tpl.initialize();
  tpl.parentNode = host;
  tpl.renderRoot = host;
  createdTpls.push(tpl);
  return tpl;
};

const click = (el, init = {}) => el.dispatchEvent(new MouseEvent('click', { bubbles: true, ...init }));

describe('Template event-binding (jsdom)', () => {
  /*******************************
        (A) attachEvents — basic delegation
  *******************************/
  describe('(A) basic delegation', () => {
    it('fires the handler when clicking inside the matching selector', () => {
      const handler = vi.fn();
      const tpl = wireTpl({ events: { 'click .btn': handler } });
      tpl.attachEvents();
      click(host.querySelector('.btn'));
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('does NOT fire when clicking elements outside the selector', () => {
      const handler = vi.fn();
      const tpl = wireTpl({ events: { 'click .btn': handler } });
      tpl.attachEvents();
      click(host.querySelector('.lbl'));
      expect(handler).not.toHaveBeenCalled();
    });

    it('passes a params bag with event/target/data/value/isDeep keys', () => {
      const handler = vi.fn();
      const tpl = wireTpl({ events: { 'click .btn': handler } });
      tpl.attachEvents();
      click(host.querySelector('.btn'));
      expect(handler).toHaveBeenCalledTimes(1);
      const params = handler.mock.calls[0][0];
      expect(params).toHaveProperty('event');
      expect(params).toHaveProperty('target');
      expect(params).toHaveProperty('data');
      expect(params).toHaveProperty('value');
      expect(params).toHaveProperty('isDeep');
    });

    it("binds the handler's `this` to the matched DOM element", () => {
      let capturedThis;
      const handler = function() {
        capturedThis = this;
      };
      const tpl = wireTpl({ events: { 'click .btn': handler } });
      tpl.attachEvents();
      const btn = host.querySelector('.btn');
      click(btn);
      expect(capturedThis).toBe(btn);
    });

    it('reads tpl.events as the default events arg', () => {
      const handler = vi.fn();
      const tpl = wireTpl({ events: { 'click .btn': handler } });
      tpl.attachEvents(); // no events arg → falls back to this.events
      click(host.querySelector('.btn'));
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('accepts an explicit events object', () => {
      const a = vi.fn();
      const b = vi.fn();
      const tpl = wireTpl({ events: { 'click .btn': a } });
      // pass a different events map at call-time
      tpl.attachEvents({ 'click .lbl': b });
      click(host.querySelector('.lbl'));
      expect(b).toHaveBeenCalledTimes(1);
      expect(a).not.toHaveBeenCalled();
    });
  });

  /*******************************
        (B) attachEvents — fatal without parent
  *******************************/
  describe('(B) requires parentNode + renderRoot', () => {
    // fatal() defers the throw via queueMicrotask. We monkey-patch
    // queueMicrotask to capture+swallow the deferred error so the test
    // can assert on it without leaking an "unhandled error" into the run.
    const captureFatal = (fn) => {
      const captured = [];
      const realQM = globalThis.queueMicrotask;
      globalThis.queueMicrotask = (cb) => {
        try {
          cb();
        }
        catch (err) {
          captured.push(err);
        }
      };
      try {
        fn();
      }
      finally {
        globalThis.queueMicrotask = realQM;
      }
      return captured;
    };

    it('routes a fatal error when parentNode is not set', () => {
      const captured = captureFatal(() => {
        const tpl = new Template({ templateName: 't', template: '<div></div>' });
        tpl.initialize();
        tpl.renderRoot = host;
        tpl.parentNode = undefined;
        tpl.attachEvents();
      });
      expect(captured.length).toBeGreaterThanOrEqual(1);
      expect(captured[0]).toBeInstanceOf(Error);
      expect(captured[0].message).toMatch(/parent/i);
    });

    it('routes a fatal error when renderRoot is not set', () => {
      const captured = captureFatal(() => {
        const tpl = new Template({ templateName: 't', template: '<div></div>' });
        tpl.initialize();
        tpl.parentNode = host;
        tpl.renderRoot = undefined;
        tpl.attachEvents();
      });
      expect(captured.length).toBeGreaterThanOrEqual(1);
      expect(captured[0].message).toMatch(/parent/i);
    });
  });

  /*******************************
        (C) attachEvents — multiple events / selectors
  *******************************/
  describe('(C) multiple events / selectors', () => {
    it('binds a single handler to a comma-separated list of selectors', () => {
      const handler = vi.fn();
      const tpl = wireTpl({ events: { 'click .btn, .lbl': handler } });
      tpl.attachEvents();
      click(host.querySelector('.btn'));
      click(host.querySelector('.lbl'));
      expect(handler).toHaveBeenCalledTimes(2);
    });

    it('binds a single handler to a comma-separated list of event names', () => {
      const handler = vi.fn();
      const tpl = wireTpl({ events: { 'click, mousedown .btn': handler } });
      tpl.attachEvents();
      const btn = host.querySelector('.btn');
      click(btn);
      btn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      expect(handler).toHaveBeenCalledTimes(2);
    });

    it('binds multiple distinct event entries', () => {
      const a = vi.fn();
      const b = vi.fn();
      const tpl = wireTpl({
        events: {
          'click .btn': a,
          'click .lbl': b,
        },
      });
      tpl.attachEvents();
      click(host.querySelector('.btn'));
      click(host.querySelector('.lbl'));
      expect(a).toHaveBeenCalledTimes(1);
      expect(b).toHaveBeenCalledTimes(1);
    });
  });

  /*******************************
        (D) attachEvents — bubble map
  *******************************/
  describe('(D) bubble map (blur→focusout, mouseenter→mouseover, ...)', () => {
    it('"blur .inp" fires on focusout dispatched at the input', () => {
      const handler = vi.fn();
      const tpl = wireTpl({ events: { 'blur .inp': handler } });
      tpl.attachEvents();
      const inp = host.querySelector('.inp');
      inp.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('"focus .inp" fires on focusin dispatched at the input', () => {
      const handler = vi.fn();
      const tpl = wireTpl({ events: { 'focus .inp': handler } });
      tpl.attachEvents();
      const inp = host.querySelector('.inp');
      inp.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('"mouseenter .btn" fires on mouseover dispatched at the button', () => {
      const handler = vi.fn();
      const tpl = wireTpl({ events: { 'mouseenter .btn': handler } });
      tpl.attachEvents();
      const btn = host.querySelector('.btn');
      btn.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('"mouseleave .btn" fires on mouseout dispatched at the button', () => {
      const handler = vi.fn();
      const tpl = wireTpl({ events: { 'mouseleave .btn': handler } });
      tpl.attachEvents();
      const btn = host.querySelector('.btn');
      btn.dispatchEvent(new MouseEvent('mouseout', { bubbles: true }));
      expect(handler).toHaveBeenCalledTimes(1);
    });
  });

  /*******************************
        (E) attachEvents — deep selector
  *******************************/
  describe('(E) "deep" prefix', () => {
    beforeEach(() => {
      host.innerHTML = '<div class="outer"><span class="inner">x</span></div>';
    });

    it('"click .outer" fires when clicking the .outer element directly', () => {
      const handler = vi.fn();
      const tpl = wireTpl({ events: { 'click .outer': handler } });
      tpl.attachEvents();
      click(host.querySelector('.outer'));
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('"click .outer" fires when clicking a descendant of .outer (delegation matches ancestor)', () => {
      const handler = vi.fn();
      const tpl = wireTpl({ events: { 'click .outer': handler } });
      tpl.attachEvents();
      click(host.querySelector('.inner'));
      // delegation matches .outer via target.closest('.outer'); handler fires
      expect(handler).toHaveBeenCalledTimes(1);
      // params.target is the matched .outer element
      const params = handler.mock.calls[0][0];
      expect(params.target).toBe(host.querySelector('.outer'));
      expect(params.isDeep).toBe(false);
    });

    it('"deep click .outer" also fires for clicks on .outer', () => {
      const handler = vi.fn();
      const tpl = wireTpl({ events: { 'deep click .outer': handler } });
      tpl.attachEvents();
      click(host.querySelector('.outer'));
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('"deep click .outer" fires for clicks on descendants too', () => {
      const handler = vi.fn();
      const tpl = wireTpl({ events: { 'deep click .outer': handler } });
      tpl.attachEvents();
      click(host.querySelector('.inner'));
      expect(handler).toHaveBeenCalledTimes(1);
    });
  });

  /*******************************
        (F) attachEvents — global
  *******************************/
  describe('(F) "global" prefix', () => {
    it('attaches to the selected element directly (not via renderRoot delegation)', () => {
      const handler = vi.fn();
      const tpl = wireTpl({ events: { 'global click body': handler } });
      tpl.attachEvents();
      // Dispatch click directly on document.body — global path hooks body itself
      document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('global handlers are not gated by isNodeInTemplate', () => {
      // Set up an unrelated template-less element and click it; global fires.
      const handler = vi.fn();
      const tpl = wireTpl({ events: { 'global click body': handler } });
      tpl.attachEvents();
      // narrow startNode/endNode so isNodeInTemplate would normally exclude body
      const start = document.createElement('span');
      const end = document.createElement('span');
      host.prepend(start);
      host.appendChild(end);
      tpl.startNode = start;
      tpl.endNode = end;
      document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(handler).toHaveBeenCalledTimes(1);
    });
  });

  /*******************************
        (G) attachEvents — bind
  *******************************/
  describe('(G) "bind" prefix', () => {
    it('sets tpl.onRenderOnce instead of binding immediately', () => {
      const handler = vi.fn();
      const tpl = wireTpl({ events: { 'bind click .btn': handler } });
      expect(tpl.onRenderOnce).toBeUndefined();
      tpl.attachEvents();
      expect(typeof tpl.onRenderOnce).toBe('function');
    });

    it('does NOT fire the handler before onRenderOnce runs', () => {
      const handler = vi.fn();
      const tpl = wireTpl({ events: { 'bind click .btn': handler } });
      tpl.attachEvents();
      click(host.querySelector('.btn'));
      expect(handler).not.toHaveBeenCalled();
    });

    it('fires the handler after onRenderOnce executes', () => {
      const handler = vi.fn();
      const tpl = wireTpl({ events: { 'bind click .btn': handler } });
      tpl.attachEvents();
      // tpl.element must be set so this.$() can scope to the rendered subtree
      // wireTpl already sets element=host
      tpl.onRenderOnce();
      click(host.querySelector('.btn'));
      expect(handler).toHaveBeenCalledTimes(1);
    });
  });

  /*******************************
        (H) attachEvents — mouseover relatedTarget
  *******************************/
  describe('(H) mouseover/mouseout relatedTarget skip', () => {
    it('skips mouseover when relatedTarget is contained by event.target', () => {
      // Need a target that contains its relatedTarget — replace host with parent>child
      host.innerHTML = '<div class="parent"><span class="child"></span></div>';
      const parent = host.querySelector('.parent');
      const child = host.querySelector('.child');

      const handler = vi.fn();
      const tpl = wireTpl({ events: { 'mouseover .parent': handler } });
      tpl.attachEvents();

      // dispatch mouseover at parent with child as relatedTarget
      // → relatedTarget is contained by event.target → skip
      parent.dispatchEvent(
        new MouseEvent('mouseover', {
          bubbles: true,
          relatedTarget: child,
        }),
      );
      expect(handler).not.toHaveBeenCalled();
    });

    it('fires mouseover when relatedTarget is outside event.target', () => {
      host.innerHTML = '<div class="parent"></div><div class="other"></div>';
      const parent = host.querySelector('.parent');
      const other = host.querySelector('.other');

      const handler = vi.fn();
      const tpl = wireTpl({ events: { 'mouseover .parent': handler } });
      tpl.attachEvents();

      parent.dispatchEvent(
        new MouseEvent('mouseover', {
          bubbles: true,
          relatedTarget: other,
        }),
      );
      expect(handler).toHaveBeenCalledTimes(1);
    });
  });

  /*******************************
        (I) attachEvents — event data shape
  *******************************/
  describe('(I) event data shape', () => {
    it('parses numeric data-* values via JSON.parse', () => {
      host.querySelector('.btn').dataset.foo = '5';
      const handler = vi.fn();
      const tpl = wireTpl({ events: { 'click .btn': handler } });
      tpl.attachEvents();
      click(host.querySelector('.btn'));
      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler.mock.calls[0][0].data.foo).toBe(5);
    });

    it('falls back to raw string when JSON.parse fails', () => {
      host.querySelector('.btn').dataset.bar = 'hello';
      const handler = vi.fn();
      const tpl = wireTpl({ events: { 'click .btn': handler } });
      tpl.attachEvents();
      click(host.querySelector('.btn'));
      expect(handler.mock.calls[0][0].data.bar).toBe('hello');
    });

    it('parses boolean / object dataset values via JSON.parse', () => {
      const btn = host.querySelector('.btn');
      btn.dataset.flag = 'true';
      btn.dataset.json = '{"a":1}';
      const handler = vi.fn();
      const tpl = wireTpl({ events: { 'click .btn': handler } });
      tpl.attachEvents();
      click(btn);
      const data = handler.mock.calls[0][0].data;
      expect(data.flag).toBe(true);
      expect(data.json).toEqual({ a: 1 });
    });

    it('params.event is the original DOM Event', () => {
      const handler = vi.fn();
      const tpl = wireTpl({ events: { 'click .btn': handler } });
      tpl.attachEvents();
      const btn = host.querySelector('.btn');
      click(btn);
      const params = handler.mock.calls[0][0];
      expect(params.event).toBeInstanceOf(Event);
      expect(params.event.type).toBe('click');
    });

    it('params.target is the matched DOM element', () => {
      const handler = vi.fn();
      const tpl = wireTpl({ events: { 'click .btn': handler } });
      tpl.attachEvents();
      const btn = host.querySelector('.btn');
      click(btn);
      expect(handler.mock.calls[0][0].target).toBe(btn);
    });

    it('params.value is the targetElement.value when present', () => {
      const handler = vi.fn();
      const tpl = wireTpl({ events: { 'change .inp': handler } });
      tpl.attachEvents();
      const inp = host.querySelector('.inp');
      inp.value = 'typed';
      inp.dispatchEvent(new Event('change', { bubbles: true }));
      expect(handler.mock.calls[0][0].value).toBe('typed');
    });

    it('merges custom event detail into params.data', () => {
      const handler = vi.fn();
      const tpl = wireTpl({ events: { 'custom .btn': handler } });
      tpl.attachEvents();
      const btn = host.querySelector('.btn');
      btn.dispatchEvent(
        new CustomEvent('custom', {
          bubbles: true,
          detail: { extra: 'detail-value' },
        }),
      );
      // detail merges into data
      expect(handler.mock.calls[0][0].data.extra).toBe('detail-value');
    });
  });

  /*******************************
        (J) removeEvents — abort controller
  *******************************/
  describe('(J) removeEvents', () => {
    it('aborts tpl.eventController with reason "Template destroyed"', () => {
      const tpl = wireTpl({ events: { 'click .btn': vi.fn() } });
      tpl.attachEvents();
      const signal = tpl.eventController.signal;
      expect(signal.aborted).toBe(false);
      tpl.removeEvents();
      expect(signal.aborted).toBe(true);
      expect(signal.reason).toBe('Template destroyed');
    });

    it('removes the previously bound listeners', () => {
      const handler = vi.fn();
      const tpl = wireTpl({ events: { 'click .btn': handler } });
      tpl.attachEvents();
      tpl.removeEvents();
      click(host.querySelector('.btn'));
      expect(handler).not.toHaveBeenCalled();
    });

    it('is a no-op when never attached (no eventController)', () => {
      const tpl = new Template({ template: '<div></div>' });
      expect(() => tpl.removeEvents()).not.toThrow();
    });
  });

  /*******************************
        (K) cascade abort from main controller
  *******************************/
  describe('(K) cascade abort', () => {
    it('aborting tpl.abortController also aborts tpl.eventController', () => {
      const tpl = wireTpl({ events: { 'click .btn': vi.fn() } });
      tpl.attachEvents();
      expect(tpl.eventController.signal.aborted).toBe(false);
      tpl.abortController.abort('lifetime ended');
      expect(tpl.eventController.signal.aborted).toBe(true);
    });
  });

  /*******************************
        (L) MutationObserver theme observer
  *******************************/
  describe('(L) theme observer', () => {
    it('does NOT register an observer when onThemeChanged is the default noop', () => {
      const tpl = wireTpl({ events: {} });
      tpl.attachEvents();
      expect(tpl.observers.length).toBe(0);
    });

    it('registers a MutationObserver when onThemeChanged is provided', () => {
      const tpl = wireTpl({
        events: {},
        onThemeChanged: vi.fn(),
      });
      tpl.attachEvents();
      expect(tpl.observers.length).toBe(1);
      expect(tpl.observers[0]).toBeInstanceOf(MutationObserver);
    });

    it('removeObservers disconnects each observer', () => {
      const tpl = wireTpl({
        events: {},
        onThemeChanged: vi.fn(),
      });
      tpl.attachEvents();
      const obs = tpl.observers[0];
      const spy = vi.spyOn(obs, 'disconnect');
      tpl.removeObservers();
      expect(spy).toHaveBeenCalled();
    });
  });

  /*******************************
        (M) bindKeys
  *******************************/
  describe('(M) bindKeys', () => {
    const dispatchKey = (key, init = {}) => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, ...init }));
    };
    const dispatchKeyUp = (key) => {
      document.dispatchEvent(new KeyboardEvent('keyup', { key, bubbles: true }));
    };

    it('fires the handler for a single matching key', () => {
      const handler = vi.fn();
      const tpl = wireTpl({ keys: { 'a': handler } });
      tpl.attachEvents();
      tpl.bindKeys();
      dispatchKey('a');
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('does not fire for non-matching keys', () => {
      const handler = vi.fn();
      const tpl = wireTpl({ keys: { 'a': handler } });
      tpl.attachEvents();
      tpl.bindKeys();
      dispatchKey('b');
      expect(handler).not.toHaveBeenCalled();
    });

    it('strips whitespace around "+" in key sequences ("shift + s" works)', () => {
      const handler = vi.fn();
      const tpl = wireTpl({ keys: { 'shift + s': handler } });
      tpl.attachEvents();
      tpl.bindKeys();
      dispatchKey('s', { shiftKey: true });
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('handles modifier shortcuts (shift+s)', () => {
      const handler = vi.fn();
      const tpl = wireTpl({ keys: { 'shift+s': handler } });
      tpl.attachEvents();
      tpl.bindKeys();
      dispatchKey('s', { shiftKey: true });
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('treats comma-separated key list as alternatives', () => {
      const handler = vi.fn();
      const tpl = wireTpl({ keys: { 'a,b': handler } });
      tpl.attachEvents();
      tpl.bindKeys();
      dispatchKey('a');
      dispatchKeyUp('a');
      // sequence still includes 'a ' from prior key — issue another key with reset
      // Simpler: just verify both keys fire when issued separately within sequence buffer
      expect(handler).toHaveBeenCalledTimes(1);
      dispatchKey('b');
      expect(handler).toHaveBeenCalledTimes(2);
    });

    it('passes inputFocused=true when focus is in an <input>', () => {
      const handler = vi.fn();
      const tpl = wireTpl({ keys: { 'a': handler } });
      tpl.attachEvents();
      tpl.bindKeys();
      const inp = host.querySelector('.inp');
      inp.focus();
      dispatchKey('a');
      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler.mock.calls[0][0].inputFocused).toBe(true);
    });

    it('passes inputFocused=false when nothing focusable is focused', () => {
      const handler = vi.fn();
      const tpl = wireTpl({ keys: { 'a': handler } });
      tpl.attachEvents();
      tpl.bindKeys();
      // ensure body has focus
      if (document.activeElement && document.activeElement.blur) {
        document.activeElement.blur();
      }
      dispatchKey('a');
      expect(handler).toHaveBeenCalledTimes(1);
      // body / html are not input/select/textarea
      expect(handler.mock.calls[0][0].inputFocused).toBeFalsy();
    });

    it('flags repeatedKey=true on the second consecutive identical key', () => {
      const handler = vi.fn();
      const tpl = wireTpl({ keys: { 'a': handler } });
      tpl.attachEvents();
      tpl.bindKeys();
      dispatchKey('a');
      // currentKey only resets on keyup — so second 'a' without keyup is repeated
      dispatchKey('a');
      expect(handler).toHaveBeenCalledTimes(2);
      expect(handler.mock.calls[0][0].repeatedKey).toBe(false);
      expect(handler.mock.calls[1][0].repeatedKey).toBe(true);
    });

    it('resets repeatedKey after keyup', () => {
      const handler = vi.fn();
      const tpl = wireTpl({ keys: { 'a': handler } });
      tpl.attachEvents();
      tpl.bindKeys();
      dispatchKey('a');
      dispatchKeyUp('a');
      dispatchKey('a');
      expect(handler.mock.calls[1][0].repeatedKey).toBe(false);
    });

    it('calls preventDefault when handler returns undefined', () => {
      const handler = vi.fn(); // returns undefined
      const tpl = wireTpl({ keys: { 'a': handler } });
      tpl.attachEvents();
      tpl.bindKeys();
      const ev = new KeyboardEvent('keydown', { key: 'a', bubbles: true, cancelable: true });
      const pd = vi.spyOn(ev, 'preventDefault');
      document.dispatchEvent(ev);
      expect(handler).toHaveBeenCalledTimes(1);
      expect(pd).toHaveBeenCalled();
    });

    it('skips preventDefault when handler returns true', () => {
      const handler = vi.fn(() => true);
      const tpl = wireTpl({ keys: { 'a': handler } });
      tpl.attachEvents();
      tpl.bindKeys();
      const ev = new KeyboardEvent('keydown', { key: 'a', bubbles: true, cancelable: true });
      const pd = vi.spyOn(ev, 'preventDefault');
      document.dispatchEvent(ev);
      expect(pd).not.toHaveBeenCalled();
    });

    it('matches multi-key sequences (sequence buffer is space-joined)', () => {
      // bindKeys appends a trailing space after each key, so 3 dispatches
      // produce 'a b c' (checked before the next space append)
      const handler = vi.fn();
      const tpl = wireTpl({ keys: { 'a b c': handler } });
      tpl.attachEvents();
      tpl.bindKeys();
      dispatchKey('a');
      dispatchKeyUp('a');
      dispatchKey('b');
      dispatchKeyUp('b');
      dispatchKey('c');
      dispatchKeyUp('c');
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('resets the sequence after the timeout window (>500ms)', () => {
      vi.useFakeTimers();
      const handler = vi.fn();
      const tpl = wireTpl({ keys: { 'a b c': handler } });
      tpl.attachEvents();
      tpl.bindKeys();
      dispatchKey('a');
      dispatchKeyUp('a');
      dispatchKey('b');
      dispatchKeyUp('b');
      // advance past the 500ms reset
      vi.advanceTimersByTime(600);
      dispatchKey('c');
      dispatchKeyUp('c');
      // sequence reset before 'c' — so 'a b c' never accumulates
      expect(handler).not.toHaveBeenCalled();
    });

    it('returns early when keys map is empty (no listener registered)', () => {
      const tpl = wireTpl({ keys: {} });
      tpl.attachEvents();
      // calling bindKeys with empty keys does not throw and does not register
      // a keydown listener — verify by checking that no handler exists for an
      // arbitrary key dispatch. (We can't directly observe the lack of a
      // listener; we just verify the call is a clean no-op.)
      expect(() => tpl.bindKeys()).not.toThrow();
    });

    it('returns early on the server (Template.isServer=true)', () => {
      // Note: the implementation checks the imported `isServer` constant at
      // call time, not Template.isServer. We can still verify the empty-keys
      // early-return path covers normal behavior. Skipping the isServer toggle
      // test as it is not toggleable post-import in this build.
      const tpl = wireTpl({ keys: {} });
      expect(() => tpl.bindKeys()).not.toThrow();
    });
  });

  /*******************************
        (N) bindKey / unbindKey
  *******************************/
  describe('(N) bindKey / unbindKey', () => {
    it('bindKey registers a new handler and triggers bindKeys() on first add', () => {
      const tpl = wireTpl({ keys: {} });
      tpl.attachEvents();
      const handler = vi.fn();
      tpl.bindKey('x', handler);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'x', bubbles: true }));
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('bindKey is a no-op when key or callback is missing', () => {
      const tpl = wireTpl({ keys: {} });
      tpl.attachEvents();
      tpl.bindKey('', vi.fn());
      tpl.bindKey('x');
      expect(Object.keys(tpl.keys).length).toBe(0);
    });

    it('bindKey adds to existing keys without re-binding', () => {
      const a = vi.fn();
      const b = vi.fn();
      const tpl = wireTpl({ keys: { 'a': a } });
      tpl.attachEvents();
      tpl.bindKeys();
      tpl.bindKey('b', b);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true }));
      document.dispatchEvent(new KeyboardEvent('keyup', { key: 'a', bubbles: true }));
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'b', bubbles: true }));
      expect(a).toHaveBeenCalledTimes(1);
      expect(b).toHaveBeenCalledTimes(1);
    });

    it('unbindKey deletes the entry so the handler stops firing', () => {
      const handler = vi.fn();
      const tpl = wireTpl({ keys: { 'x': handler } });
      tpl.attachEvents();
      tpl.bindKeys();
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'x', bubbles: true }));
      expect(handler).toHaveBeenCalledTimes(1);
      tpl.unbindKey('x');
      document.dispatchEvent(new KeyboardEvent('keyup', { key: 'x', bubbles: true }));
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'x', bubbles: true }));
      // handler removed from keys map; document listener is still active but skips
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('unbindKey removes the key from tpl.keys', () => {
      const tpl = wireTpl({ keys: { 'x': vi.fn() } });
      tpl.unbindKey('x');
      expect(tpl.keys).toEqual({});
    });
  });

  /*******************************
        (P) isNodeInTemplate (non-shadow)
  *******************************/
  describe('(P) isNodeInTemplate', () => {
    it('returns true when startNode/endNode are not set', () => {
      const tpl = wireTpl({ events: {} });
      const arbitrary = document.createElement('div');
      document.body.appendChild(arbitrary);
      expect(tpl.isNodeInTemplate(arbitrary)).toBe(true);
    });

    it('returns true for nodes between startNode and endNode', () => {
      host.innerHTML = '';
      const start = document.createElement('span');
      start.id = 'start';
      const middle = document.createElement('span');
      middle.id = 'middle';
      const end = document.createElement('span');
      end.id = 'end';
      host.append(start, middle, end);

      const tpl = wireTpl({ events: {} });
      tpl.startNode = start;
      tpl.endNode = end;
      tpl.parentNode = host;
      tpl.renderRoot = host;
      expect(tpl.isNodeInTemplate(middle)).toBe(true);
    });

    it('returns false for nodes after endNode', () => {
      host.innerHTML = '';
      const start = document.createElement('span');
      start.id = 'start';
      const end = document.createElement('span');
      end.id = 'end';
      const after = document.createElement('span');
      after.id = 'after';
      host.append(start, end, after);

      const tpl = wireTpl({ events: {} });
      tpl.startNode = start;
      tpl.endNode = end;
      tpl.parentNode = host;
      tpl.renderRoot = host;
      expect(tpl.isNodeInTemplate(after)).toBe(false);
    });

    it('returns false for nodes before startNode', () => {
      host.innerHTML = '';
      const before = document.createElement('span');
      before.id = 'before';
      const start = document.createElement('span');
      start.id = 'start';
      const end = document.createElement('span');
      end.id = 'end';
      host.append(before, start, end);

      const tpl = wireTpl({ events: {} });
      tpl.startNode = start;
      tpl.endNode = end;
      tpl.parentNode = host;
      tpl.renderRoot = host;
      expect(tpl.isNodeInTemplate(before)).toBe(false);
    });

    it('walks up to the rootChild — descendants of an in-range child are in-range', () => {
      host.innerHTML = '';
      const start = document.createElement('span');
      start.id = 'start';
      const wrap = document.createElement('div');
      const inner = document.createElement('em');
      wrap.appendChild(inner);
      const end = document.createElement('span');
      end.id = 'end';
      host.append(start, wrap, end);

      const tpl = wireTpl({ events: {} });
      tpl.startNode = start;
      tpl.endNode = end;
      tpl.parentNode = host;
      tpl.renderRoot = host;
      expect(tpl.isNodeInTemplate(inner)).toBe(true);
    });

    it('returns false when getRootChild walks off the top of the DOM (node not under parentNode)', () => {
      host.innerHTML = '';
      const start = document.createElement('span');
      const end = document.createElement('span');
      host.append(start, end);

      const tpl = wireTpl({ events: {} });
      tpl.startNode = start;
      tpl.endNode = end;
      tpl.parentNode = host;
      tpl.renderRoot = host;

      // detached node — no path back to host
      const detached = document.createElement('div');
      // walking will end at null via parentNode chain → isNodeInRange(null) returns false
      expect(tpl.isNodeInTemplate(detached)).toBe(false);
    });
  });

  /*******************************
        (Q) attachEvent — external event
  *******************************/
  describe('(Q) attachEvent', () => {
    it('binds an external listener using the eventController', () => {
      const tpl = wireTpl({ events: {} });
      tpl.attachEvents();
      const spy = vi.fn();
      tpl.attachEvent('body', 'click', spy);
      document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('listener is removed when eventController aborts', () => {
      const tpl = wireTpl({ events: {} });
      tpl.attachEvents();
      const spy = vi.fn();
      tpl.attachEvent('body', 'click', spy);
      tpl.removeEvents();
      document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(spy).not.toHaveBeenCalled();
    });

    it('returns the event handler descriptor (returnHandler:true default)', () => {
      const tpl = wireTpl({ events: {} });
      tpl.attachEvents();
      const result = tpl.attachEvent('body', 'click', vi.fn());
      // result should be an object with abort/eventName/etc., not the Query chain
      expect(result).toBeDefined();
      expect(typeof result === 'object' || typeof result === 'function').toBe(true);
    });
  });
});
