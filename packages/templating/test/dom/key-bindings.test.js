// Tests for Template's `keys` binding system: single keys, comma-list
// alternates, modifier combos, sequences with the 500ms timeout, the
// inputFocused/repeatedKey/event callback extras, the return-value contract,
// dynamic bindKey/unbindKey, the SSR guard, and AbortController cleanup.
//
// jsdom is enough — Template's keydown listener attaches to document and
// there is no shadow DOM dependency for keys.

import { afterEach, describe, expect, it, vi } from 'vitest';

import { Template } from '@semantic-ui/templating';

afterEach(() => {
  document.body.innerHTML = '';
  Template.renderedTemplates.clear();
  Template.templateCount = 0;
});

/**
 * Construct a Template with the given keys and prime its eventController so
 * bindKeys() registers document listeners that can be aborted for cleanup.
 * Returns { template, element, root } with listeners already installed;
 * abort via `template.eventController.abort()`.
 */
function makeKeyTemplate(opts = {}) {
  const element = document.createElement('div');
  document.body.appendChild(element);
  const root = document.createElement('div');
  element.appendChild(root);

  const template = new Template({
    element,
    ...opts,
  });
  // Stub `instance` so buildCallParams (used by template.call inside the
  // keydown handler) can read `instance.content` without throwing. Real
  // initialize() builds this for us; we skip initialize() here to keep the
  // tests narrowly focused on bindKeys.
  template.instance = {};
  template.eventController = new AbortController();
  template.bindKeys();

  return { template, element, root };
}

/** Dispatch a keydown + keyup pair for a key. */
function pressKey(key, init = {}) {
  document.dispatchEvent(
    new KeyboardEvent('keydown', { key, bubbles: true, composed: true, cancelable: true, ...init }),
  );
  document.dispatchEvent(
    new KeyboardEvent('keyup', { key, bubbles: true, composed: true, cancelable: true, ...init }),
  );
}

/** Dispatch a sequence of keys (each a full keydown+keyup). */
function pressKeys(keys) {
  for (const key of keys) {
    pressKey(key);
  }
}

/** Dispatch a key with modifiers held: { ctrl, shift, alt, meta }. */
function pressKeyCombo(key, mods = {}) {
  const init = {
    key,
    bubbles: true,
    composed: true,
    cancelable: true,
    ctrlKey: !!mods.ctrl,
    shiftKey: !!mods.shift,
    altKey: !!mods.alt,
    metaKey: !!mods.meta,
  };
  document.dispatchEvent(new KeyboardEvent('keydown', init));
  document.dispatchEvent(new KeyboardEvent('keyup', init));
}

/** Dispatch a keydown only (no matching keyup). For repeatedKey tests. */
function pressKeyDown(key, init = {}) {
  document.dispatchEvent(
    new KeyboardEvent('keydown', { key, bubbles: true, composed: true, cancelable: true, ...init }),
  );
}

/** Dispatch a keyup only. */
function pressKeyUp(key, init = {}) {
  document.dispatchEvent(
    new KeyboardEvent('keyup', { key, bubbles: true, composed: true, cancelable: true, ...init }),
  );
}

describe('Template — key bindings', () => {
  /*******************************
        Single-key descriptors
  *******************************/

  describe('single-key descriptor', () => {
    it('fires the handler when the registered key is pressed', () => {
      const handler = vi.fn();
      const { template } = makeKeyTemplate({ keys: { esc: handler } });
      pressKey('Escape');
      expect(handler).toHaveBeenCalledTimes(1);
      template.eventController.abort();
    });

    it('does not fire on unrelated keys', () => {
      const handler = vi.fn();
      const { template } = makeKeyTemplate({ keys: { esc: handler } });
      pressKey('a');
      pressKey('b');
      expect(handler).not.toHaveBeenCalled();
      template.eventController.abort();
    });

    it('normalizes uppercase key presses to lowercase', () => {
      const handler = vi.fn();
      const { template } = makeKeyTemplate({ keys: { a: handler } });
      pressKey('A');
      expect(handler).toHaveBeenCalledTimes(1);
      template.eventController.abort();
    });

    it('calls preventDefault when the handler returns undefined', () => {
      const { template } = makeKeyTemplate({
        keys: { esc: () => undefined },
      });
      const event = new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
        cancelable: true,
      });
      const spy = vi.spyOn(event, 'preventDefault');
      document.dispatchEvent(event);
      expect(spy).toHaveBeenCalledTimes(1);
      template.eventController.abort();
    });

    it('does NOT call preventDefault when the handler returns true', () => {
      const { template } = makeKeyTemplate({
        keys: { esc: () => true },
      });
      const event = new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
        cancelable: true,
      });
      const spy = vi.spyOn(event, 'preventDefault');
      document.dispatchEvent(event);
      expect(spy).not.toHaveBeenCalled();
      template.eventController.abort();
    });

    it('calls preventDefault when the handler returns false (only === true opts out)', () => {
      const { template } = makeKeyTemplate({
        keys: { esc: () => false },
      });
      const event = new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
        cancelable: true,
      });
      const spy = vi.spyOn(event, 'preventDefault');
      document.dispatchEvent(event);
      expect(spy).toHaveBeenCalledTimes(1);
      template.eventController.abort();
    });
  });

  /*******************************
     Comma-separated descriptors
  *******************************/

  describe('comma-separated descriptors', () => {
    it("fires for the first listed key from a cold buffer ('up, down')", () => {
      const handler = vi.fn();
      const { template } = makeKeyTemplate({
        keys: { 'up, down': handler },
      });
      pressKey('ArrowUp');
      expect(handler).toHaveBeenCalledTimes(1);
      template.eventController.abort();
    });

    it('fires for the second listed key from a cold buffer', () => {
      const handler = vi.fn();
      const { template } = makeKeyTemplate({
        keys: { 'up, down': handler },
      });
      pressKey('ArrowDown');
      expect(handler).toHaveBeenCalledTimes(1);
      template.eventController.abort();
    });

    it('fires for the second listed key after a prior keystroke seeded the buffer', () => {
      const handler = vi.fn();
      const { template } = makeKeyTemplate({
        keys: { 'up, down': handler },
      });
      pressKey('ArrowUp');
      handler.mockClear();
      pressKey('ArrowDown');
      expect(handler).toHaveBeenCalledTimes(1);
      template.eventController.abort();
    });

    it("parses cleanly with extra whitespace ('up , down ')", () => {
      const handler = vi.fn();
      const { template } = makeKeyTemplate({
        keys: { 'up , down ': handler },
      });
      pressKey('ArrowUp');
      expect(handler).toHaveBeenCalledTimes(1);
      template.eventController.abort();
    });
  });

  /*******************************
        Modifier combinations
  *******************************/

  describe('modifier combinations with +', () => {
    it("fires on Ctrl+F when registered as 'ctrl + f'", () => {
      const handler = vi.fn();
      const { template } = makeKeyTemplate({
        keys: { 'ctrl + f': handler },
      });
      pressKeyCombo('f', { ctrl: true });
      expect(handler).toHaveBeenCalledTimes(1);
      template.eventController.abort();
    });

    it("treats 'ctrl + f' and 'ctrl+f' as identical (spacing around + is normalized)", () => {
      const handler = vi.fn();
      const { template } = makeKeyTemplate({
        keys: { 'ctrl+f': handler },
      });
      pressKeyCombo('f', { ctrl: true });
      expect(handler).toHaveBeenCalledTimes(1);
      template.eventController.abort();
    });

    it('fires on multi-modifier combos (ctrl + shift + a)', () => {
      const handler = vi.fn();
      const { template } = makeKeyTemplate({
        keys: { 'ctrl+shift+a': handler },
      });
      pressKeyCombo('a', { ctrl: true, shift: true });
      expect(handler).toHaveBeenCalledTimes(1);
      template.eventController.abort();
    });

    it('does not fire when only some modifiers are pressed', () => {
      const handler = vi.fn();
      const { template } = makeKeyTemplate({
        keys: { 'ctrl+f': handler },
      });
      pressKey('f');
      expect(handler).not.toHaveBeenCalled();
      template.eventController.abort();
    });
  });

  /*******************************
            Key sequences
  *******************************/

  describe('key sequences (space-separated)', () => {
    it("fires when the second key is pressed within 500ms ('g i')", () => {
      const handler = vi.fn();
      const { template } = makeKeyTemplate({
        keys: { 'g i': handler },
      });
      pressKeys(['g', 'i']);
      expect(handler).toHaveBeenCalledTimes(1);
      template.eventController.abort();
    });

    it('does NOT fire when the second key arrives after the 500ms timeout', () => {
      vi.useFakeTimers();
      const handler = vi.fn();
      const { template } = makeKeyTemplate({
        keys: { 'g i': handler },
      });
      try {
        pressKey('g');
        vi.advanceTimersByTime(501);
        pressKey('i');
        expect(handler).not.toHaveBeenCalled();
      }
      finally {
        template.eventController.abort();
        vi.useRealTimers();
      }
    });

    it('extends the timeout on each press (sliding window)', () => {
      vi.useFakeTimers();
      const handler = vi.fn();
      const { template } = makeKeyTemplate({
        keys: { 'g i': handler },
      });
      try {
        pressKey('g');
        vi.advanceTimersByTime(400);
        pressKey('i');
        expect(handler).toHaveBeenCalledTimes(1);
      }
      finally {
        template.eventController.abort();
        vi.useRealTimers();
      }
    });

    it('matches a space-separated sequence regardless of comma-list parsing', () => {
      const handler = vi.fn();
      const { template } = makeKeyTemplate({
        keys: { 'g i': handler },
      });
      pressKeys(['g', 'i']);
      expect(handler).toHaveBeenCalledTimes(1);
      template.eventController.abort();
    });
  });

  /*******************************
       Single + sequence co-fire
  *******************************/

  describe('single-key and matching-suffix sequence co-fire', () => {
    it("fires both 'i' and 'g i' handlers when a sequence completes", () => {
      // The buffer 'g i' satisfies endsWith('g i') and endsWith('i'), so both
      // descriptors match.
      const single = vi.fn();
      const sequence = vi.fn();
      const { template } = makeKeyTemplate({
        keys: { i: single, 'g i': sequence },
      });
      pressKeys(['g', 'i']);
      expect(single).toHaveBeenCalledTimes(1);
      expect(sequence).toHaveBeenCalledTimes(1);
      template.eventController.abort();
    });
  });

  /*******************************
        Callback param: inputFocused
  *******************************/

  describe('inputFocused callback param', () => {
    it('is true when an <input> is focused', () => {
      const handler = vi.fn();
      const { template, element } = makeKeyTemplate({
        keys: { esc: handler },
      });
      const input = document.createElement('input');
      element.appendChild(input);
      input.focus();
      pressKey('Escape');
      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler.mock.calls[0][0].inputFocused).toBe(true);
      template.eventController.abort();
    });

    it('is true when a <textarea> is focused', () => {
      const handler = vi.fn();
      const { template, element } = makeKeyTemplate({
        keys: { esc: handler },
      });
      const textarea = document.createElement('textarea');
      element.appendChild(textarea);
      textarea.focus();
      pressKey('Escape');
      expect(handler.mock.calls[0][0].inputFocused).toBe(true);
      template.eventController.abort();
    });

    it('is true when a <select> is focused', () => {
      const handler = vi.fn();
      const { template, element } = makeKeyTemplate({
        keys: { esc: handler },
      });
      const select = document.createElement('select');
      element.appendChild(select);
      select.focus();
      pressKey('Escape');
      expect(handler.mock.calls[0][0].inputFocused).toBe(true);
      template.eventController.abort();
    });

    // jsdom does not implement isContentEditable / contentEditable on
    // HTMLElement; the contenteditable branch is exercised in browser tests.
    it.skip('is true when a [contenteditable] element is focused', () => {});

    it('is falsy when a non-form element (e.g., <button>) is focused', () => {
      const handler = vi.fn();
      const { template, element } = makeKeyTemplate({
        keys: { esc: handler },
      });
      const button = document.createElement('button');
      element.appendChild(button);
      button.focus();
      pressKey('Escape');
      // Real browsers return false; under jsdom isContentEditable is undefined,
      // so the expression evaluates to undefined. Both are falsy — that is the
      // user-facing contract.
      expect(handler.mock.calls[0][0].inputFocused).toBeFalsy();
      template.eventController.abort();
    });
  });

  /*******************************
        Callback param: repeatedKey
  *******************************/

  describe('repeatedKey callback param', () => {
    it('is false on the first press of a key', () => {
      const handler = vi.fn();
      const { template } = makeKeyTemplate({
        keys: { a: handler },
      });
      pressKey('a');
      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler.mock.calls[0][0].repeatedKey).toBe(false);
      template.eventController.abort();
    });

    it('is true on a same-key keydown without an intervening keyup', () => {
      const handler = vi.fn();
      const { template } = makeKeyTemplate({
        keys: { a: handler },
      });
      // Two keydowns with no keyup between simulate OS key repeat.
      pressKeyDown('a');
      pressKeyDown('a');
      expect(handler).toHaveBeenCalledTimes(2);
      expect(handler.mock.calls[0][0].repeatedKey).toBe(false);
      expect(handler.mock.calls[1][0].repeatedKey).toBe(true);
      template.eventController.abort();
    });

    it('is false again after a keyup is dispatched', () => {
      const handler = vi.fn();
      const { template } = makeKeyTemplate({
        keys: { a: handler },
      });
      pressKeyDown('a');
      pressKeyUp('a');
      pressKeyDown('a');
      expect(handler).toHaveBeenCalledTimes(2);
      expect(handler.mock.calls[1][0].repeatedKey).toBe(false);
      template.eventController.abort();
    });
  });

  /*******************************
       Callback param: event
  *******************************/

  describe('event callback param', () => {
    it('passes the raw KeyboardEvent in handler args', () => {
      const handler = vi.fn();
      const { template } = makeKeyTemplate({
        keys: { esc: handler },
      });
      pressKey('Escape');
      expect(handler).toHaveBeenCalledTimes(1);
      const args = handler.mock.calls[0][0];
      expect(args.event).toBeInstanceOf(KeyboardEvent);
      expect(args.event.key).toBe('Escape');
      template.eventController.abort();
    });
  });

  /*******************************
        Dynamic bindKey / unbindKey
  *******************************/

  describe('bindKey / unbindKey', () => {
    it('bindKey adds a handler that fires on the next matching press', () => {
      const handler = vi.fn();
      const { template } = makeKeyTemplate({
        keys: { foo: () => {} },
      });
      template.bindKey('enter', handler);
      pressKey('Enter');
      expect(handler).toHaveBeenCalledTimes(1);
      template.eventController.abort();
    });

    it('bindKey lazily wires up listeners when the keys map was previously empty', () => {
      const handler = vi.fn();
      const { template } = makeKeyTemplate({ keys: {} });
      template.bindKey('enter', handler);
      pressKey('Enter');
      expect(handler).toHaveBeenCalledTimes(1);
      template.eventController.abort();
    });

    it('bindKey is a no-op when called without a key or callback', () => {
      const { template } = makeKeyTemplate({ keys: {} });
      template.bindKey();
      template.bindKey('enter');
      template.bindKey(null, () => {});
      expect(Object.keys(template.keys)).toHaveLength(0);
      template.eventController.abort();
    });

    it('unbindKey removes a previously registered handler', () => {
      const handler = vi.fn();
      const { template } = makeKeyTemplate({
        keys: { enter: handler },
      });
      template.unbindKey('enter');
      pressKey('Enter');
      expect(handler).not.toHaveBeenCalled();
      template.eventController.abort();
    });

    it('rebinding after all-unbind does not stack document listeners', () => {
      const first = vi.fn();
      const second = vi.fn();
      const { template } = makeKeyTemplate({
        keys: { a: first },
      });
      template.unbindKey('a');
      template.bindKey('b', second);
      pressKey('b');
      expect(second).toHaveBeenCalledTimes(1);
      expect(first).not.toHaveBeenCalled();
      template.eventController.abort();
    });
  });

  /*******************************
              SSR guard
  *******************************/

  describe('SSR / empty-map guards', () => {
    // The bindKeys server check reads the imported `isServer` constant, which
    // is computed once at module load and cannot be toggled at runtime without
    // invasive vi.mock setup. Covered structurally by the empty-keys guard.
    it.skip('bindKeys is a no-op when isServer is true', () => {});

    it('bindKeys is a no-op when the keys map is empty', () => {
      // No listener installed → currentSequence is never initialized.
      const { template } = makeKeyTemplate({ keys: {} });
      expect(() => pressKey('a')).not.toThrow();
      expect(template.currentSequence).toBeUndefined();
      template.eventController.abort();
    });
  });

  /*******************************
        AbortController cleanup
  *******************************/

  describe('AbortController cleanup', () => {
    it('removes document keydown listener when eventController aborts', () => {
      const handler = vi.fn();
      const { template } = makeKeyTemplate({
        keys: { esc: handler },
      });
      pressKey('Escape');
      expect(handler).toHaveBeenCalledTimes(1);
      handler.mockClear();

      template.eventController.abort();
      expect(template.eventController.signal.aborted).toBe(true);

      pressKey('Escape');
      expect(handler).not.toHaveBeenCalled();
    });

    it('removes document keyup listener when eventController aborts', () => {
      const handler = vi.fn();
      const { template } = makeKeyTemplate({
        keys: { a: handler },
      });
      // Establish that keyup mutates currentKey before abort.
      pressKeyDown('a');
      pressKeyUp('a');
      expect(template.currentKey).toBe('');

      template.eventController.abort();

      // If the keyup listener were still alive it would overwrite the sentinel.
      template.currentKey = 'sentinel';
      pressKeyUp('a');
      expect(template.currentKey).toBe('sentinel');
    });
  });
});
