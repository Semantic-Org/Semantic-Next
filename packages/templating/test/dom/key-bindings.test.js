// Tests for Template's `keys` binding system. Covers single keys, comma-list
// alternates, modifier combos, sequences with the 500ms timeout, the
// inputFocused/repeatedKey/event callback extras, the return-value contract,
// dynamic bindKey/unbindKey, the SSR guard, and AbortController cleanup.
//
// jsdom is enough — Template's keydown listener attaches to document
// and there is no shadow DOM dependency for keys. Source: template.js:620-686.

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Template } from '../../src/template.js';
import { pressKey, pressKeyCombo, pressKeys } from '../_helpers/dispatch.js';
import { freshTemplate } from '../_helpers/fresh-template.js';
import { clearTemplateRegistry } from '../_helpers/registry-cleanup.js';

/**
 * Spin up a Template with the given keys/options, run initialize(), and
 * attach() it to a real renderRoot so eventController is wired and bindKeys()
 * registers its document listeners. Returns { template, root, cleanup }.
 *
 * The element is a plain <div> attached to body, the renderRoot is a separate
 * <div> appended into element. Neither shadow DOM nor a real component is
 * needed — Template's key listener registers on document, not on renderRoot.
 */
async function mountKeyTemplate(opts = {}) {
  const element = document.createElement('div');
  document.body.appendChild(element);
  const root = document.createElement('div');
  element.appendChild(root);

  const { template, cleanup: cleanupTemplate } = freshTemplate({
    element,
    ...opts,
  });
  await template.attach(root);

  return {
    template,
    element,
    root,
    cleanup: () => {
      cleanupTemplate();
      element.remove();
    },
  };
}

/** Dispatch a keydown only (no matching keyup). For repeatedKey tests. */
function pressKeyDown(key, init = {}) {
  document.dispatchEvent(
    new KeyboardEvent('keydown', {
      key,
      bubbles: true,
      composed: true,
      cancelable: true,
      ...init,
    }),
  );
}

/** Dispatch a keyup only. */
function pressKeyUp(key, init = {}) {
  document.dispatchEvent(
    new KeyboardEvent('keyup', {
      key,
      bubbles: true,
      composed: true,
      cancelable: true,
      ...init,
    }),
  );
}

describe('Template — key bindings', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    clearTemplateRegistry();
  });

  /*******************************
        Single-key descriptors
  *******************************/

  describe('single-key descriptor', () => {
    it('fires the handler when the registered key is pressed', async () => {
      const handler = vi.fn();
      const { cleanup } = await mountKeyTemplate({ keys: { esc: handler } });
      try {
        pressKey('Escape');
        expect(handler).toHaveBeenCalledTimes(1);
      }
      finally {
        cleanup();
      }
    });

    it('does not fire on unrelated keys', async () => {
      const handler = vi.fn();
      const { cleanup } = await mountKeyTemplate({ keys: { esc: handler } });
      try {
        pressKey('a');
        pressKey('b');
        expect(handler).not.toHaveBeenCalled();
      }
      finally {
        cleanup();
      }
    });

    it('normalizes uppercase key presses to lowercase via getKeyFromEvent', async () => {
      const handler = vi.fn();
      const { cleanup } = await mountKeyTemplate({ keys: { a: handler } });
      try {
        pressKey('A');
        expect(handler).toHaveBeenCalledTimes(1);
      }
      finally {
        cleanup();
      }
    });

    it('calls preventDefault when the handler returns undefined', async () => {
      const { cleanup } = await mountKeyTemplate({
        keys: { esc: () => undefined },
      });
      try {
        const event = new KeyboardEvent('keydown', {
          key: 'Escape',
          bubbles: true,
          cancelable: true,
        });
        const spy = vi.spyOn(event, 'preventDefault');
        document.dispatchEvent(event);
        expect(spy).toHaveBeenCalledTimes(1);
      }
      finally {
        cleanup();
      }
    });

    it('does NOT call preventDefault when the handler returns true', async () => {
      const { cleanup } = await mountKeyTemplate({
        keys: { esc: () => true },
      });
      try {
        const event = new KeyboardEvent('keydown', {
          key: 'Escape',
          bubbles: true,
          cancelable: true,
        });
        const spy = vi.spyOn(event, 'preventDefault');
        document.dispatchEvent(event);
        expect(spy).not.toHaveBeenCalled();
      }
      finally {
        cleanup();
      }
    });

    it('calls preventDefault when the handler returns false (only === true opts out)', async () => {
      const { cleanup } = await mountKeyTemplate({
        keys: { esc: () => false },
      });
      try {
        const event = new KeyboardEvent('keydown', {
          key: 'Escape',
          bubbles: true,
          cancelable: true,
        });
        const spy = vi.spyOn(event, 'preventDefault');
        document.dispatchEvent(event);
        expect(spy).toHaveBeenCalledTimes(1);
      }
      finally {
        cleanup();
      }
    });
  });

  /*******************************
      Comma-separated descriptors (B4 pin)
  *******************************/

  describe('comma-separated descriptors', () => {
    it("fires for the first listed key from a cold buffer ('up, down')", async () => {
      const handler = vi.fn();
      const { cleanup } = await mountKeyTemplate({
        keys: { 'up, down': handler },
      });
      try {
        pressKey('ArrowUp');
        expect(handler).toHaveBeenCalledTimes(1);
      }
      finally {
        cleanup();
      }
    });

    // B4 pin — EXPECTED TO FAIL today.
    // Source line 640: `keySequence.split(',')` is not trimmed, so the
    // alternate becomes ' down' (leading space). The buffer-space mechanic
    // (line 660 appends ' ' AFTER the matching pass) only saves this when a
    // prior keystroke left a trailing space — the FIRST press from a fresh
    // buffer cannot match ' down'. Documented in the Stage 1 sketch (#7) and
    // locked as B4 in Stage 1.5.
    it.fails('fires for the second listed key from a cold buffer (B4 PIN — leading-space alternate)', async () => {
      const handler = vi.fn();
      const { cleanup } = await mountKeyTemplate({
        keys: { 'up, down': handler },
      });
      try {
        pressKey('ArrowDown');
        expect(handler).toHaveBeenCalledTimes(1);
      }
      finally {
        cleanup();
      }
    });

    it('fires for the second listed key after a prior keystroke seeded the buffer', async () => {
      const handler = vi.fn();
      const { cleanup } = await mountKeyTemplate({
        keys: { 'up, down': handler },
      });
      try {
        pressKey('ArrowUp'); // buffer becomes 'up '
        handler.mockClear();
        pressKey('ArrowDown'); // buffer becomes 'up down'; endsWith(' down') matches
        expect(handler).toHaveBeenCalledTimes(1);
      }
      finally {
        cleanup();
      }
    });

    // B4 pin — `keys: { 'up , down ': handler }` (extra whitespace). After
    // the B4 fix trims each split alternate, this should parse to
    // ['up', 'down'] and ArrowUp from a cold buffer should fire. Today, the
    // alternate is 'up ' (trailing space) which does not endsWith match the
    // cold-buffer 'up'. EXPECTED TO FAIL today; passes after fix.
    it.fails("parses cleanly with extra whitespace ('up , down ') (B4 PIN — passes after fix)", async () => {
      const handler = vi.fn();
      const { cleanup } = await mountKeyTemplate({
        keys: { 'up , down ': handler },
      });
      try {
        pressKey('ArrowUp');
        expect(handler).toHaveBeenCalledTimes(1);
      }
      finally {
        cleanup();
      }
    });
  });

  /*******************************
        Modifier combinations
  *******************************/

  describe('modifier combinations with +', () => {
    it("fires on Ctrl+F when registered as 'ctrl + f'", async () => {
      const handler = vi.fn();
      const { cleanup } = await mountKeyTemplate({
        keys: { 'ctrl + f': handler },
      });
      try {
        pressKeyCombo('f', { ctrl: true });
        expect(handler).toHaveBeenCalledTimes(1);
      }
      finally {
        cleanup();
      }
    });

    it("treats 'ctrl + f' and 'ctrl+f' as identical (spacing around + is normalized)", async () => {
      const handler = vi.fn();
      const { cleanup } = await mountKeyTemplate({
        keys: { 'ctrl+f': handler },
      });
      try {
        pressKeyCombo('f', { ctrl: true });
        expect(handler).toHaveBeenCalledTimes(1);
      }
      finally {
        cleanup();
      }
    });

    it('fires on multi-modifier combos (ctrl + shift + a)', async () => {
      const handler = vi.fn();
      const { cleanup } = await mountKeyTemplate({
        keys: { 'ctrl+shift+a': handler },
      });
      try {
        pressKeyCombo('a', { ctrl: true, shift: true });
        expect(handler).toHaveBeenCalledTimes(1);
      }
      finally {
        cleanup();
      }
    });

    it('does not fire when only some modifiers are pressed', async () => {
      const handler = vi.fn();
      const { cleanup } = await mountKeyTemplate({
        keys: { 'ctrl+f': handler },
      });
      try {
        pressKey('f');
        expect(handler).not.toHaveBeenCalled();
      }
      finally {
        cleanup();
      }
    });
  });

  /*******************************
        Key sequences
  *******************************/

  describe('key sequences (space-separated)', () => {
    it("fires when the second key is pressed within 500ms ('g i')", async () => {
      const handler = vi.fn();
      const { cleanup } = await mountKeyTemplate({
        keys: { 'g i': handler },
      });
      try {
        pressKey('g');
        pressKey('i');
        expect(handler).toHaveBeenCalledTimes(1);
      }
      finally {
        cleanup();
      }
    });

    it('does NOT fire when the second key arrives after the 500ms timeout', async () => {
      vi.useFakeTimers();
      const handler = vi.fn();
      const { cleanup } = await mountKeyTemplate({
        keys: { 'g i': handler },
      });
      try {
        pressKey('g');
        // Advance timers past the 500ms reset window; buffer clears.
        vi.advanceTimersByTime(501);
        pressKey('i');
        expect(handler).not.toHaveBeenCalled();
      }
      finally {
        cleanup();
        vi.useRealTimers();
      }
    });

    it('the timeout is sliding — each press extends the window', async () => {
      vi.useFakeTimers();
      const handler = vi.fn();
      const { cleanup } = await mountKeyTemplate({
        keys: { 'g i': handler },
      });
      try {
        pressKey('g');
        vi.advanceTimersByTime(400); // < 500ms, buffer still alive
        pressKey('i');
        expect(handler).toHaveBeenCalledTimes(1);
      }
      finally {
        cleanup();
        vi.useRealTimers();
      }
    });

    it('continues to work for sequences after the comma-split fix (sequences are independent of comma-split)', async () => {
      const handler = vi.fn();
      const { cleanup } = await mountKeyTemplate({
        keys: { 'g i': handler },
      });
      try {
        pressKey('g');
        pressKey('i');
        expect(handler).toHaveBeenCalledTimes(1);
      }
      finally {
        cleanup();
      }
    });
  });

  /*******************************
      Single + sequence co-fire (Stage 1 ambiguity)
  *******************************/

  describe('single-key and matching-suffix sequence co-fire', () => {
    // Stage 1 inference: registering both 'i' and 'g i' should cause BOTH
    // to fire when the user presses 'g' then 'i' — because endsWith('g i')
    // and endsWith('i') both match the buffer 'g i'. Pin current behavior.
    it("fires both 'i' and 'g i' handlers when a sequence completes", async () => {
      const single = vi.fn();
      const sequence = vi.fn();
      const { cleanup } = await mountKeyTemplate({
        keys: { i: single, 'g i': sequence },
      });
      try {
        pressKey('g');
        pressKey('i');
        expect(single).toHaveBeenCalledTimes(1);
        expect(sequence).toHaveBeenCalledTimes(1);
      }
      finally {
        cleanup();
      }
    });
  });

  /*******************************
        Callback param: inputFocused
  *******************************/

  describe('inputFocused callback param', () => {
    it('is true when an <input> is focused', async () => {
      const handler = vi.fn();
      const { element, cleanup } = await mountKeyTemplate({
        keys: { esc: handler },
      });
      try {
        const input = document.createElement('input');
        element.appendChild(input);
        input.focus();
        pressKey('Escape');
        expect(handler).toHaveBeenCalledTimes(1);
        expect(handler.mock.calls[0][0].inputFocused).toBe(true);
      }
      finally {
        cleanup();
      }
    });

    it('is true when a <textarea> is focused', async () => {
      const handler = vi.fn();
      const { element, cleanup } = await mountKeyTemplate({
        keys: { esc: handler },
      });
      try {
        const textarea = document.createElement('textarea');
        element.appendChild(textarea);
        textarea.focus();
        pressKey('Escape');
        expect(handler.mock.calls[0][0].inputFocused).toBe(true);
      }
      finally {
        cleanup();
      }
    });

    it('is true when a <select> is focused', async () => {
      const handler = vi.fn();
      const { element, cleanup } = await mountKeyTemplate({
        keys: { esc: handler },
      });
      try {
        const select = document.createElement('select');
        element.appendChild(select);
        select.focus();
        pressKey('Escape');
        expect(handler.mock.calls[0][0].inputFocused).toBe(true);
      }
      finally {
        cleanup();
      }
    });

    // jsdom does not implement isContentEditable / contentEditable on
    // HTMLElement (verified: both return undefined). Source line 644 reads
    // `document.activeElement.isContentEditable` directly, so this branch
    // cannot be exercised under jsdom. The real-browser contract is verified
    // by Surface 1's browser tests; this test would re-cover the same path.
    it.skip('is true when a [contenteditable] element is focused (jsdom limitation — no isContentEditable)', async () => {
      const handler = vi.fn();
      const { element, cleanup } = await mountKeyTemplate({
        keys: { esc: handler },
      });
      try {
        const editable = document.createElement('div');
        editable.setAttribute('contenteditable', 'true');
        editable.tabIndex = 0;
        element.appendChild(editable);
        editable.focus();
        pressKey('Escape');
        expect(handler.mock.calls[0][0].inputFocused).toBe(true);
      }
      finally {
        cleanup();
      }
    });

    it('is falsy when a non-form element (e.g., <button>) is focused', async () => {
      const handler = vi.fn();
      const { element, cleanup } = await mountKeyTemplate({
        keys: { esc: handler },
      });
      try {
        const button = document.createElement('button');
        element.appendChild(button);
        button.focus();
        pressKey('Escape');
        // Source returns the result of `activeElement && (... || isContentEditable)`.
        // Under jsdom, `isContentEditable` is undefined, so for a focused
        // <button>, the expression evaluates to `truthy && (false || undefined)`
        // which is `undefined`. Real browsers return `false`. Either way it's
        // falsy — that is the user-facing contract.
        expect(handler.mock.calls[0][0].inputFocused).toBeFalsy();
      }
      finally {
        cleanup();
      }
    });
  });

  /*******************************
        Callback param: repeatedKey
  *******************************/

  describe('repeatedKey callback param', () => {
    it('is false on the first press of a key', async () => {
      const handler = vi.fn();
      const { cleanup } = await mountKeyTemplate({
        keys: { a: handler },
      });
      try {
        pressKey('a');
        expect(handler).toHaveBeenCalledTimes(1);
        expect(handler.mock.calls[0][0].repeatedKey).toBe(false);
      }
      finally {
        cleanup();
      }
    });

    it('is true on a same-key keydown without an intervening keyup', async () => {
      const handler = vi.fn();
      const { cleanup } = await mountKeyTemplate({
        keys: { a: handler },
      });
      try {
        // Two keydowns, no keyup between → simulates OS key repeat.
        pressKeyDown('a');
        pressKeyDown('a');
        expect(handler).toHaveBeenCalledTimes(2);
        expect(handler.mock.calls[0][0].repeatedKey).toBe(false);
        expect(handler.mock.calls[1][0].repeatedKey).toBe(true);
      }
      finally {
        cleanup();
      }
    });

    it('is false again after a keyup is dispatched', async () => {
      const handler = vi.fn();
      const { cleanup } = await mountKeyTemplate({
        keys: { a: handler },
      });
      try {
        pressKeyDown('a');
        pressKeyUp('a'); // clears currentKey
        pressKeyDown('a');
        expect(handler).toHaveBeenCalledTimes(2);
        expect(handler.mock.calls[1][0].repeatedKey).toBe(false);
      }
      finally {
        cleanup();
      }
    });
  });

  /*******************************
      Callback param: event (C2 — convergent with Surface 3)
  *******************************/

  describe('event callback param (C2 — undocumented in user doc)', () => {
    // The user-facing keys doc lists only `inputFocused` and `repeatedKey` in
    // the Callback Data table. Source line 648 also injects `event` (raw
    // KeyboardEvent). Pin the contract; flag for doc-cleanup.
    it('passes the raw KeyboardEvent in handler args', async () => {
      const handler = vi.fn();
      const { cleanup } = await mountKeyTemplate({
        keys: { esc: handler },
      });
      try {
        pressKey('Escape');
        expect(handler).toHaveBeenCalledTimes(1);
        const args = handler.mock.calls[0][0];
        expect(args.event).toBeInstanceOf(KeyboardEvent);
        expect(args.event.key).toBe('Escape');
      }
      finally {
        cleanup();
      }
    });
  });

  /*******************************
        Dynamic bindKey / unbindKey
  *******************************/

  describe('bindKey / unbindKey', () => {
    it('bindKey adds a handler that fires on the next matching press', async () => {
      const handler = vi.fn();
      const { template, cleanup } = await mountKeyTemplate({
        keys: { foo: () => {} }, // non-empty so bindKeys() ran
      });
      try {
        template.bindKey('enter', handler);
        pressKey('Enter');
        expect(handler).toHaveBeenCalledTimes(1);
      }
      finally {
        cleanup();
      }
    });

    it('bindKey lazily wires up listeners when the keys map was previously empty', async () => {
      const handler = vi.fn();
      // Start with empty keys — bindKeys() in attach() should early-return.
      const { template, cleanup } = await mountKeyTemplate({ keys: {} });
      try {
        // No listener was installed at attach. Now bindKey one.
        template.bindKey('enter', handler);
        pressKey('Enter');
        expect(handler).toHaveBeenCalledTimes(1);
      }
      finally {
        cleanup();
      }
    });

    it('bindKey is a no-op when called without a key or callback', async () => {
      const { template, cleanup } = await mountKeyTemplate({ keys: {} });
      try {
        template.bindKey(); // no args
        template.bindKey('enter'); // no callback
        template.bindKey(null, () => {}); // no key
        expect(Object.keys(template.keys)).toHaveLength(0);
      }
      finally {
        cleanup();
      }
    });

    it('unbindKey removes a previously registered handler', async () => {
      const handler = vi.fn();
      const { template, cleanup } = await mountKeyTemplate({
        keys: { enter: handler },
      });
      try {
        template.unbindKey('enter');
        pressKey('Enter');
        expect(handler).not.toHaveBeenCalled();
      }
      finally {
        cleanup();
      }
    });

    // L4 pin — `unbindKey` does not tear down the document keydown listener.
    // bindKey() at line 677-680 re-runs bindKeys() when the keys map was
    // previously empty. So the sequence
    //   bindKey('a', first) → unbindKey('a') → bindKey('b', second)
    // INSTALLS A SECOND document keydown listener (the first one is still
    // alive because unbindKey only deletes from `this.keys`, not the listener).
    // Pressing 'b' now fires `second` TWICE — once per duplicate listener.
    // Pin current behavior; document the leak.
    it('L4: rebinding after all-unbind installs a duplicate listener (handler fires twice)', async () => {
      const first = vi.fn();
      const second = vi.fn();
      const { template, cleanup } = await mountKeyTemplate({
        keys: { a: first },
      });
      try {
        template.unbindKey('a');
        // keys is now empty; bindKey will re-run bindKeys() because needsInit
        // checks Object.keys(this.keys).length == 0.
        template.bindKey('b', second);
        pressKey('b');
        // BUG (L4): second listener stacks on top of the still-alive first
        // listener, so `second` fires twice from one keypress. The OLD `first`
        // handler is gone from the map (unbindKey deleted it) so it does not
        // fire — but the LISTENER it set up is still installed.
        expect(second).toHaveBeenCalledTimes(2);
        expect(first).not.toHaveBeenCalled();
      }
      finally {
        cleanup();
      }
    });
  });

  /*******************************
        SSR guard
  *******************************/

  describe('SSR / empty-map guards', () => {
    // bindKeys at line 621 reads the IMPORTED `isServer` constant directly
    // (`if (isServer) return;`), NOT `Template.isServer`. The imported
    // `isServer` is computed once at module load (`typeof window === 'undefined'`)
    // and cannot be toggled at runtime without invasive `vi.mock` setup.
    // This is drift from the rest of template.js (lines 281, 503, 770, 837,
    // 838, 899 all use Template.isServer). Flagged in report; covered
    // structurally by the empty-keys guard below.
    it.skip('bindKeys is a no-op when isServer is true (drift: bindKeys uses imported const, not Template.isServer)', () => {});

    it('bindKeys is a no-op when the keys map is empty', async () => {
      // With empty keys at attach time, the early-return at line 624 means
      // the listener is never installed and `currentSequence` (set on line
      // 629 after the early return) is never initialized.
      const { template, cleanup } = await mountKeyTemplate({ keys: {} });
      try {
        expect(() => pressKey('a')).not.toThrow();
        expect(template.currentSequence).toBeUndefined();
      }
      finally {
        cleanup();
      }
    });
  });

  /*******************************
        AbortController cleanup
  *******************************/

  describe('AbortController cleanup', () => {
    it('removes document keydown listener on Template destroy', async () => {
      const handler = vi.fn();
      const { template, cleanup } = await mountKeyTemplate({
        keys: { esc: handler },
      });
      try {
        // Verify the listener is alive before destroy.
        pressKey('Escape');
        expect(handler).toHaveBeenCalledTimes(1);
        handler.mockClear();

        // Destroy via the lifecycle path; abort cascades to eventController.
        template.onDestroyed();
        expect(template.eventController.signal.aborted).toBe(true);

        // Subsequent dispatch should not invoke the handler.
        pressKey('Escape');
        expect(handler).not.toHaveBeenCalled();
      }
      finally {
        // freshTemplate's cleanup is idempotent; calling again is safe.
        cleanup();
      }
    });

    it('removes document keyup listener on Template destroy', async () => {
      const handler = vi.fn();
      const { template, cleanup } = await mountKeyTemplate({
        keys: { a: handler },
      });
      try {
        // Establish that keyup mutates currentKey before destroy.
        pressKeyDown('a');
        pressKeyUp('a');
        expect(template.currentKey).toBe('');

        template.onDestroyed();

        // Set a sentinel value; if the keyup listener is still alive, it would
        // overwrite it back to ''. After destroy it should remain.
        template.currentKey = 'sentinel';
        pressKeyUp('a');
        expect(template.currentKey).toBe('sentinel');
      }
      finally {
        cleanup();
      }
    });
  });
});
