import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Reaction, Signal } from '@semantic-ui/reactivity';
import { Template } from '@semantic-ui/templating';
import '@semantic-ui/component'; // registers the native rendering engine

let host;
beforeEach(() => {
  host = document.createElement('div');
  host.innerHTML = '<span class="a">A</span><span class="b">B</span><span class="b nested">B2</span>';
  document.body.appendChild(host);
});

afterEach(() => {
  document.body.innerHTML = '';
  Template.renderedTemplates.clear();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

const makeTpl = (opts = {}) => {
  const tpl = new Template({
    templateName: opts.templateName || `t-${Math.random().toString(36).slice(2, 8)}`,
    template: opts.template || '<div></div>',
    element: host,
    ...opts,
  });
  tpl.initialize();
  tpl.renderRoot = host;
  tpl.parentNode = host;
  return tpl;
};

describe('Template — DOM helpers, timers, reactivity, callParams', () => {
  /*******************************
      (A) $(selector) — root selection

      Docs: docs/guides/components/dom.mdx, docs/guides/query/components.mdx
      "$ allows you to retrieve elements without crossing shadow boundaries"
      "$ queries within this component's shadow DOM" — i.e. scoped to renderRoot.
  *******************************/

  describe('$(selector) — root selection', () => {
    it('scopes selection to renderRoot — single .a match', () => {
      const tpl = makeTpl();
      const $results = tpl.$('span.a');
      expect($results.length).toBe(1);
    });

    it('scopes selection to renderRoot — two .b matches', () => {
      const tpl = makeTpl();
      const $results = tpl.$('span.b');
      expect($results.length).toBe(2);
    });

    // Regression guard: documented examples in the dom guide use $('body') and
    // $('html') as global selectors (e.g. dom.mdx line 28 and the themechange
    // handler in template.js line 514). For these to work they must escape the
    // renderRoot scope, otherwise scoping would never find them.
    it('finds the body element via $("body")', () => {
      const tpl = makeTpl();
      const $results = tpl.$('body');
      expect($results.length).toBeGreaterThanOrEqual(1);
    });

    it('finds the html element via $("html")', () => {
      const tpl = makeTpl();
      const $results = tpl.$('html');
      expect($results.length).toBeGreaterThanOrEqual(1);
    });

    it('honors caller-supplied root', () => {
      const tpl = makeTpl();
      const otherRoot = document.createElement('div');
      otherRoot.innerHTML = '<span class="a">other</span>';
      document.body.appendChild(otherRoot);

      const $results = tpl.$('span.a', { root: otherRoot });
      expect($results.length).toBe(1);
      expect(otherRoot.contains($results.get(0))).toBe(true);
    });
  });

  /*******************************
      (B) $ — filterTemplate (subtemplate range filtering)
  *******************************/

  describe('$ — filterTemplate', () => {
    const setupRange = () => {
      host.innerHTML = '<span id="s1"></span><span id="mid"></span><span id="e1"></span><span id="after"></span>';
      const tpl = new Template({
        templateName: 'range-tpl',
        template: '<div></div>',
        element: host,
      });
      tpl.initialize();
      tpl.renderRoot = host;
      tpl.parentNode = host;
      tpl.startNode = host.querySelector('#s1');
      tpl.endNode = host.querySelector('#e1');
      return tpl;
    };

    it('filters out spans outside [startNode, endNode] by default', () => {
      const tpl = setupRange();
      const $results = tpl.$('span');
      const ids = [];
      $results.each((el) => ids.push(el.id));
      expect(ids).not.toContain('after');
    });

    it('returns all spans when filterTemplate: false', () => {
      const tpl = setupRange();
      const $results = tpl.$('span', { filterTemplate: false });
      expect($results.length).toBe(4);
    });
  });

  /*******************************
      (C) $$ — pierces shadow

      Docs: docs/guides/query/shadow-dom.mdx
      "$$ recursively pierces shadow DOM and slot roots"
      docs/guides/components/dom.mdx
      "$$ allows you to access any part of the DOM, both the visible DOM and
       the hidden parts of the DOM accessible from shadow DOM trees"
  *******************************/

  describe('$$ — pierces shadow', () => {
    it('forwards selector to $() with pierceShadow: true', () => {
      const tpl = makeTpl();
      const dollarSpy = vi.spyOn(tpl, '$');
      tpl.$$('span.a');
      expect(dollarSpy).toHaveBeenCalledTimes(1);
      const [selector, opts] = dollarSpy.mock.calls[0];
      expect(selector).toBe('span.a');
      expect(opts.pierceShadow).toBe(true);
      expect(opts.root).toBe(tpl.renderRoot);
    });

    it('caller args override defaults (filterTemplate)', () => {
      const tpl = makeTpl();
      const dollarSpy = vi.spyOn(tpl, '$');
      tpl.$$('span.a', { filterTemplate: false });
      const [, opts] = dollarSpy.mock.calls[0];
      expect(opts.pierceShadow).toBe(true);
      expect(opts.filterTemplate).toBe(false);
    });

    it('returns a Query result', () => {
      const tpl = makeTpl();
      const $results = tpl.$$('span.a');
      expect($results).toBeDefined();
      expect($results.length).toBe(1);
    });
  });

  /*******************************
      (D) createInterval — auto-clears on component destroy

      Docs: docs/guides/components/lifecycle.mdx
      "interval — setInterval that auto-clears on component destroy"
  *******************************/

  describe('createInterval — auto-clears on destroy', () => {
    it('returns an interval id', () => {
      const tpl = makeTpl();
      const id = tpl.createInterval(() => {}, 100);
      expect(id).toBeDefined();
      clearInterval(id);
    });

    it('callback fires repeatedly until destroy', () => {
      vi.useFakeTimers();
      const tpl = makeTpl();
      const spy = vi.fn();
      tpl.createInterval(spy, 10);

      vi.advanceTimersByTime(35);
      expect(spy.mock.calls.length).toBeGreaterThanOrEqual(3);
    });

    it('callback stops firing after the component is destroyed', () => {
      vi.useFakeTimers();
      const tpl = makeTpl();
      const spy = vi.fn();
      tpl.createInterval(spy, 10);

      vi.advanceTimersByTime(25);
      const callsBeforeDestroy = spy.mock.calls.length;
      expect(callsBeforeDestroy).toBeGreaterThanOrEqual(2);

      tpl.onDestroyed();
      vi.advanceTimersByTime(100);
      expect(spy.mock.calls.length).toBe(callsBeforeDestroy);
    });
  });

  /*******************************
      (E) createTimeout — auto-clears on component destroy

      Docs: docs/guides/components/lifecycle.mdx
      "timeout — setTimeout that auto-clears on component destroy"
  *******************************/

  describe('createTimeout — auto-clears on destroy', () => {
    it('returns a timeout id', () => {
      const tpl = makeTpl();
      const id = tpl.createTimeout(() => {}, 100);
      expect(id).toBeDefined();
      clearTimeout(id);
    });

    it('callback fires after timeout when not destroyed', () => {
      vi.useFakeTimers();
      const tpl = makeTpl();
      const spy = vi.fn();
      tpl.createTimeout(spy, 100);

      vi.advanceTimersByTime(150);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('callback does NOT fire when destroyed before the timeout elapses', () => {
      vi.useFakeTimers();
      const tpl = makeTpl();
      const spy = vi.fn();
      tpl.createTimeout(spy, 100);

      tpl.onDestroyed();
      vi.advanceTimersByTime(150);
      expect(spy).not.toHaveBeenCalled();
    });
  });

  /*******************************
      (F) reaction(fn) — template-scoped

      Docs: docs/guides/components/lifecycle.mdx
      "reaction — a reactive context for computations"
      Reactions created via the template-scoped helper run on signal changes
      and stop when the template is destroyed (clearReactions).
  *******************************/

  describe('reaction(fn) — template-scoped', () => {
    it('runs once initially', () => {
      const tpl = makeTpl();
      let count = 0;
      tpl.reaction(() => {
        count++;
      });
      Reaction.flush();
      expect(count).toBe(1);
    });

    it('re-runs when a tracked signal changes', () => {
      const tpl = makeTpl();
      const sig = new Signal(0);
      let count = 0;
      tpl.reaction(() => {
        sig.get();
        count++;
      });
      Reaction.flush();
      expect(count).toBe(1);
      sig.set(1);
      Reaction.flush();
      expect(count).toBe(2);
    });

    it('clearReactions stops all template-scoped reactions', () => {
      const tpl = makeTpl();
      const sig = new Signal(0);
      let count = 0;
      tpl.reaction(() => {
        sig.get();
        count++;
      });
      Reaction.flush();
      sig.set(1);
      Reaction.flush();
      expect(count).toBe(2);

      tpl.clearReactions();
      sig.set(2);
      Reaction.flush();
      expect(count).toBe(2);
    });

    it('multiple reactions all stop after clearReactions', () => {
      const tpl = makeTpl();
      const sig = new Signal(0);
      let aCount = 0;
      let bCount = 0;
      tpl.reaction(() => {
        sig.get();
        aCount++;
      });
      tpl.reaction(() => {
        sig.get();
        bCount++;
      });
      Reaction.flush();
      expect(aCount).toBe(1);
      expect(bCount).toBe(1);

      tpl.clearReactions();
      sig.set(1);
      Reaction.flush();
      expect(aCount).toBe(1);
      expect(bCount).toBe(1);
    });

    it('reactions are torn down when the template is destroyed', () => {
      const tpl = makeTpl();
      const sig = new Signal(0);
      let count = 0;
      tpl.reaction(() => {
        sig.get();
        count++;
      });
      Reaction.flush();
      expect(count).toBe(1);

      tpl.onDestroyed();
      sig.set(1);
      Reaction.flush();
      expect(count).toBe(1);
    });
  });

  /*******************************
      (G) signal(value, options)

      Docs: docs/guides/components/lifecycle.mdx
      "signal — a function to define a reactive variable"
      Backed by Signal — see docs/guides/reactivity/signals.mdx.
  *******************************/

  describe('signal(value, options)', () => {
    it('returns a Signal with the initial value', () => {
      const tpl = makeTpl();
      const sig = tpl.signal(42);
      expect(sig).toBeInstanceOf(Signal);
      expect(sig.get()).toBe(42);
    });

    it('passes options through to Signal (custom equalityFunction)', () => {
      const tpl = makeTpl();
      const alwaysUnequal = () => false;
      const sig = tpl.signal(0, { equalityFunction: alwaysUnequal });
      let runs = 0;
      const r = Reaction.create(() => {
        sig.get();
        runs++;
      });
      Reaction.flush();
      expect(runs).toBe(1);
      // Same value would normally be a no-op; a custom equality returning false
      // forces the signal to treat every set as a change.
      sig.set(0);
      Reaction.flush();
      expect(runs).toBe(2);
      r.stop();
    });

    it('signals returned are independent (different instances)', () => {
      const tpl = makeTpl();
      const a = tpl.signal('a');
      const b = tpl.signal('b');
      expect(a).not.toBe(b);
      expect(a.get()).toBe('a');
      expect(b.get()).toBe('b');
    });
  });

  /*******************************
      (H) clearReactions — handles empty
  *******************************/

  describe('clearReactions — empty/edge', () => {
    it('does not throw when reactions array is empty', () => {
      const tpl = makeTpl();
      tpl.reactions = [];
      expect(() => tpl.clearReactions()).not.toThrow();
    });

    it('does not throw when reactions is undefined', () => {
      const tpl = makeTpl();
      tpl.reactions = undefined;
      expect(() => tpl.clearReactions()).not.toThrow();
    });
  });

  /*******************************
      (I) callParams — documented shape

      Docs: docs/guides/components/lifecycle.mdx → "Standard Arguments" table.
      Each test below pins a key from that documented contract.
  *******************************/

  describe('callParams — documented shape', () => {
    it('exposes element as `el`', () => {
      const tpl = makeTpl();
      expect(tpl.callParams.el).toBe(host);
    });

    it('exposes the instance as `self`, `tpl`, and `component` (self aliases)', () => {
      const tpl = makeTpl();
      expect(tpl.callParams.self).toBe(tpl.instance);
      expect(tpl.callParams.tpl).toBe(tpl.instance);
      expect(tpl.callParams.component).toBe(tpl.instance);
    });

    it('exposes `data`, `state`, and `settings`', () => {
      const tpl = makeTpl({ defaultState: { count: 0 } });
      expect(tpl.callParams.data).toBe(tpl.data);
      expect(tpl.callParams.state).toBe(tpl.state);
      // settings may be undefined when none are configured, but the key must exist.
      expect('settings' in tpl.callParams).toBe(true);
    });

    it('exposes `template` (this) and `templateName`', () => {
      const tpl = makeTpl({ templateName: 'shape-tpl' });
      expect(tpl.callParams.template).toBe(tpl);
      expect(tpl.callParams.templateName).toBe('shape-tpl');
    });

    it('exposes `templates` as Template.renderedTemplates', () => {
      const tpl = makeTpl();
      expect(tpl.callParams.templates).toBe(Template.renderedTemplates);
    });

    it('exposes `helpers`', () => {
      const tpl = makeTpl();
      expect(tpl.callParams.helpers).toBeDefined();
      expect(typeof tpl.callParams.helpers).toBe('object');
    });

    it('exposes `isServer` (false under jsdom) and `isClient` (true)', () => {
      const tpl = makeTpl();
      expect(tpl.callParams.isServer).toBe(false);
      expect(tpl.callParams.isClient).toBe(true);
    });

    it('exposes findTemplate / findParent / findChild / findChildren as functions', () => {
      const tpl = makeTpl();
      expect(typeof tpl.callParams.findTemplate).toBe('function');
      expect(typeof tpl.callParams.findParent).toBe('function');
      expect(typeof tpl.callParams.findChild).toBe('function');
      expect(typeof tpl.callParams.findChildren).toBe('function');
    });

    it('bound `$` produces the same result as tpl.$', () => {
      const tpl = makeTpl();
      const a = tpl.callParams.$('span.a');
      const b = tpl.$('span.a');
      expect(a.length).toBe(b.length);
      expect(a.length).toBe(1);
    });

    it('bound `$$` calls tpl.$ with pierceShadow', () => {
      const tpl = makeTpl();
      const spy = vi.spyOn(tpl, '$');
      tpl.callParams.$$('span.a');
      const [, opts] = spy.mock.calls[0];
      expect(opts.pierceShadow).toBe(true);
    });

    it('bound `dispatchEvent` triggers a DOM event on the element', () => {
      const tpl = makeTpl();
      const spy = vi.fn();
      host.addEventListener('foo', spy);
      tpl.callParams.dispatchEvent('foo', { x: 1 });
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('exposes `attachEvent` as a function', () => {
      const tpl = makeTpl();
      expect(typeof tpl.callParams.attachEvent).toBe('function');
    });

    it('exposes `bindKey` as a function', () => {
      const tpl = makeTpl();
      expect(typeof tpl.callParams.bindKey).toBe('function');
    });

    it('exposes `rerender` as a function', () => {
      const tpl = makeTpl();
      expect(typeof tpl.callParams.rerender).toBe('function');
    });

    it('bound `signal` returns a new Signal instance', () => {
      const tpl = makeTpl();
      const sig = tpl.callParams.signal(123);
      expect(sig).toBeInstanceOf(Signal);
      expect(sig.get()).toBe(123);
    });

    it('bound `interval` creates a tracked interval', () => {
      vi.useFakeTimers();
      const tpl = makeTpl();
      const spy = vi.fn();
      tpl.callParams.interval(spy, 10);
      vi.advanceTimersByTime(15);
      expect(spy).toHaveBeenCalled();
      tpl.onDestroyed();
    });

    it('bound `timeout` creates a tracked timeout', () => {
      vi.useFakeTimers();
      const tpl = makeTpl();
      const spy = vi.fn();
      tpl.callParams.timeout(spy, 50);
      vi.advanceTimersByTime(75);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('exposes `flush`, `afterFlush`, and `nonreactive` as Reaction statics', () => {
      const tpl = makeTpl();
      expect(tpl.callParams.flush).toBe(Reaction.flush);
      expect(tpl.callParams.afterFlush).toBe(Reaction.afterFlush);
      expect(tpl.callParams.nonreactive).toBe(Reaction.nonreactive);
    });

    it('exposes `abortSignal` tied to the template lifecycle', () => {
      const tpl = makeTpl();
      expect(tpl.callParams.abortSignal).toBe(tpl.abortSignal);
    });

    it('darkMode reflects element.isDarkMode() — undefined when missing', () => {
      const tpl = makeTpl();
      expect(tpl.callParams.darkMode).toBeUndefined();
    });

    it('darkMode reflects element.isDarkMode() — true when present', () => {
      host.isDarkMode = () => true;
      const tpl = makeTpl();
      expect(tpl.callParams.darkMode).toBe(true);
      delete host.isDarkMode;
    });

    it('isRendered() reflects tpl.rendered', () => {
      const tpl = makeTpl();
      expect(tpl.callParams.isRendered()).toBe(tpl.rendered);
      tpl.markRendered();
      expect(tpl.callParams.isRendered()).toBe(true);
    });
  });

  /*******************************
      (J) call(func, opts) — invokes a function with callParams
  *******************************/

  describe('call(func, opts)', () => {
    it('invokes func with callParams as the first arg', () => {
      const tpl = makeTpl();
      const fn = vi.fn();
      tpl.call(fn);
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn.mock.calls[0][0]).toBe(tpl.callParams);
    });

    it('uses element as `this` by default', () => {
      const tpl = makeTpl();
      let captured;
      tpl.call(function() {
        captured = this;
      });
      expect(captured).toBe(host);
    });

    it('respects thisContext override', () => {
      const tpl = makeTpl();
      const ctx = { custom: true };
      let captured;
      tpl.call(function() {
        captured = this;
      }, { thisContext: ctx });
      expect(captured).toBe(ctx);
    });

    it('merges additionalData into params', () => {
      const tpl = makeTpl();
      const fn = vi.fn((params) => params);
      tpl.call(fn, { additionalData: { extra: 1 } });
      const params = fn.mock.calls[0][0];
      expect(params.extra).toBe(1);
      expect(params.el).toBe(host);
    });

    it('returns undefined when func is not a function', () => {
      const tpl = makeTpl();
      expect(tpl.call(undefined)).toBeUndefined();
      expect(tpl.call(null)).toBeUndefined();
      expect(tpl.call(42)).toBeUndefined();
    });

    it('is a no-op when isPrototype is true', () => {
      const tpl = new Template({
        templateName: 'proto-call-tpl',
        template: '<div></div>',
        element: host,
        isPrototype: true,
      });
      tpl.initialize();
      const fn = vi.fn();
      const result = tpl.call(fn);
      expect(fn).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
    });

    it('passes additionalArgs after the params object', () => {
      const tpl = makeTpl();
      const fn = vi.fn();
      tpl.call(fn, { additionalArgs: ['a', 'b'] });
      expect(fn.mock.calls[0][1]).toBe('a');
      expect(fn.mock.calls[0][2]).toBe('b');
    });

    it('returns the function result', () => {
      const tpl = makeTpl();
      const result = tpl.call(() => 'hello');
      expect(result).toBe('hello');
    });
  });
});
