// Synthetic event/key dispatch helpers for Template tests.
//
// Used by Surfaces 1 (events), 3 (callback params event-extras), 4 (keys).
// The DOM standard `dispatchEvent` requires a real Event constructor; these
// helpers wrap that with a friendlier API for the kinds of dispatches our
// tests do (click, custom event with detail, key sequence, etc.).
//
// Note: for testing through Template's event delegation, dispatch on the
// SHADOW DOM target (e.g., `shadow.querySelector('.btn').dispatchEvent(...)`),
// not on the host. Template's `attachEvents` listens on renderRoot.

if (typeof document === 'undefined') {
  // module is allowed to load in node — only the dispatch functions
  // require DOM. Tests that import these in node context should not call
  // them.
}

/**
 * Dispatch a click event on an element. Bubbles + composed by default so
 * it crosses shadow boundaries (matches real user clicks).
 */
export function clickOn(element, init = {}) {
  element.dispatchEvent(
    new MouseEvent('click', {
      bubbles: true,
      composed: true,
      cancelable: true,
      ...init,
    }),
  );
}

/**
 * Dispatch a generic event by name on an element.
 */
export function fireEvent(element, eventName, init = {}) {
  element.dispatchEvent(
    new Event(eventName, {
      bubbles: true,
      composed: true,
      cancelable: true,
      ...init,
    }),
  );
}

/**
 * Dispatch a custom event with detail.
 */
export function fireCustomEvent(element, eventName, detail = {}, init = {}) {
  element.dispatchEvent(
    new CustomEvent(eventName, {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail,
      ...init,
    }),
  );
}

/**
 * Dispatch a single keydown (and matching keyup) on document. Mirrors how
 * real keyboard events flow. Use for testing Template's `keys` bindings,
 * which listen on `document`.
 *
 * @param {string} key - The key, e.g., 'Enter', 'a', 'ArrowDown'
 * @param {object} [init] - Additional KeyboardEvent properties (ctrlKey, etc.)
 */
export function pressKey(key, init = {}) {
  document.dispatchEvent(
    new KeyboardEvent('keydown', {
      key,
      bubbles: true,
      composed: true,
      cancelable: true,
      ...init,
    }),
  );
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

/**
 * Dispatch a sequence of keys with optional delay between them.
 * For testing `keys: { 'g i': handler }` sequence semantics.
 *
 * @param {string[]} keys - Array of key names
 * @param {object} [opts]
 * @param {number} [opts.delayMs] - Delay between keys (real time, not fake-timer-aware)
 */
export async function pressKeys(keys, { delayMs = 0 } = {}) {
  for (const key of keys) {
    pressKey(key);
    if (delayMs > 0) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
}

/**
 * Build a KeyboardEvent for a modifier combination. Useful for testing
 * `keys: { 'ctrl + f': handler }`.
 */
export function pressKeyCombo(key, modifiers = {}) {
  const init = {
    key,
    ctrlKey: modifiers.ctrl || modifiers.ctrlKey || false,
    shiftKey: modifiers.shift || modifiers.shiftKey || false,
    altKey: modifiers.alt || modifiers.altKey || false,
    metaKey: modifiers.meta || modifiers.metaKey || false,
  };
  document.dispatchEvent(new KeyboardEvent('keydown', { ...init, bubbles: true, composed: true, cancelable: true }));
  document.dispatchEvent(new KeyboardEvent('keyup', { ...init, bubbles: true, composed: true, cancelable: true }));
}
