---
title: Component Keyboard Shortcuts
description: Guide to the keys system in defineComponent — static key bindings, key combinations, key sequences, multiple keys, callback data, and dynamic binding/unbinding with bindKey/unbindKey.
keywords: [keys, keyboard, shortcuts, keybinding, bindKey, unbindKey, key combination, key sequence, ctrl, meta, inputFocused, repeatedKey]
audience: authoring
skill: component-keybindings
type: skill
---

# Component Keyboard Shortcuts

> **Skill:** `component-keybindings`
> **Purpose:** How to bind, unbind, and respond to keyboard shortcuts in Semantic UI components

---

## Golden Rule

**Key handlers call `preventDefault` by default.** If a handler needs the browser's default behavior (e.g., allowing typing in an input), `return true` from the handler. Every other return value (including `undefined`) prevents the default.

---

## Static Key Bindings

Pass a `keys` object to `defineComponent`. Each key is a key descriptor string, each value is a callback receiving the standard destructured parameters plus keyboard-specific data.

```javascript
const keys = {
  'up'({ state }) { state.selectedIndex.decrement(1, 0); },
  'down'({ state }) { state.selectedIndex.increment(1, state.maxIndex.get()); },
  'esc'({ self }) { self.clearSearch(); },
};

defineComponent({
  tagName: 'my-component',
  template, css, keys,
  createComponent,
});
```

Key bindings are registered on `document` when the component renders and cleaned up when it destroys. They are **not** scoped to the component's shadow root — they listen globally.

---

## Key Descriptor Syntax

### Single Keys

Use the lowercase key name. Arrow keys drop the `Arrow` prefix. Special keys use short aliases.

```javascript
const keys = {
  'a'() {},          // letter key
  'up'() {},         // ArrowUp
  'esc'() {},        // Escape
  'space'() {},      // spacebar
  'enter'() {},      // Enter
  'tab'() {},        // Tab
};
```

**Resolved key names** (from `getKeyFromEvent` in `@semantic-ui/utils`):

| Browser `event.key` | Descriptor name |
|---------------------|-----------------|
| `ArrowUp` | `up` |
| `ArrowDown` | `down` |
| `ArrowLeft` | `left` |
| `ArrowRight` | `right` |
| `Escape` | `esc` |
| `Control` | `ctrl` |
| ` ` (space) | `space` |
| Everything else | `event.key.toLowerCase()` |

### Key Combinations

Join modifier and key with `+`. Spacing around `+` is optional and ignored.

```javascript
const keys = {
  'ctrl + k'() {},     // Ctrl+K
  'ctrl+s'() {},       // same syntax, no spaces
  'alt + shift + n'() {},
  'meta + enter'() {}, // Cmd on Mac, Win key on Windows
};
```

Modifier order in the resolved string is always `ctrl+alt+shift+meta+key`. Author them in that order.

### Key Sequences

Separate keys with spaces. Each key must be pressed within **500ms** of the previous one, or the sequence resets.

```javascript
const keys = {
  'up up down down'() {
    // Konami fragment - 4 keys in sequence
  },
  'g i'() {
    // press g, then i within 500ms
  },
};
```

### Multiple Keys

Bind multiple keys to one handler with `,` separation.

```javascript
const keys = {
  'up, down, left, right'({ event }) {
    // single handler for all arrow keys
    // use event.key to distinguish
  },
};
```

---

## Callback Parameters

Key handlers receive all standard callback params (`self`, `$`, `$$`, `state`, `settings`, `reaction`, `signal`, etc.) plus two keyboard-specific values:

| Parameter | Type | Description |
|-----------|------|-------------|
| `inputFocused` | `boolean` | `true` when an `<input>`, `<select>`, `<textarea>`, or `contentEditable` element has focus |
| `repeatedKey` | `boolean` | `true` when the key is held down (OS key repeat) |
| `event` | `KeyboardEvent` | The raw DOM keyboard event |

### Guarding Against Input Focus

A common pattern: skip shortcut handling when the user is typing in a form field.

```javascript
// ✅ RIGHT - guard on inputFocused
const keys = {
  '/'({ self, inputFocused }) {
    if (inputFocused) return true; // allow typing '/' in inputs
    self.focusSearch();
  },
};

// ❌ WRONG - shortcut fires while user types in a text field
const keys = {
  '/'({ self }) {
    self.focusSearch(); // hijacks '/' from every input on the page
  },
};
```

### Preventing Default Behavior

```javascript
// Handler returns true — browser default allowed
'tab'({ self }) { self.moveToNextField(); return true; },

// Handler returns nothing — preventDefault called automatically
'ctrl + s'({ self }) { self.save(); },
```

---

## Dynamic Key Bindings

`bindKey` and `unbindKey` are available in `createComponent`, all lifecycle callbacks, and event handlers. Use them to add or remove bindings at runtime.

```javascript
const createComponent = ({ self, reaction, state, bindKey, unbindKey }) => ({
  initialize() {
    reaction(() => {
      const hasSelection = state.selectedIndex.get() > -1;
      unbindKey('enter');
      if (hasSelection) {
        bindKey('enter', () => self.confirmSelection());
      }
    });
  },
});
```

### Dynamic Binding from Settings

Use `bindKey` when the key itself comes from a setting:

```javascript
// ✅ RIGHT - key is configurable
const createComponent = ({ self, settings, bindKey }) => ({
  initialize() {
    bindKey(settings.openKey, self.openModal);
  },
});

const defaultSettings = {
  openKey: 'ctrl + k',
};
```

This pattern is used by `global-search` in the Semantic UI docs site, where the open shortcut is configurable via `openKey`.

### Conditional Static Keys

For keys that always exist but should only act in certain states, use a guard inside the static `keys` object instead of dynamic binding:

```javascript
// ✅ SIMPLER - guard inside static handler
const keys = {
  'enter'({ self, state }) {
    if (!state.modalOpen.get()) return;
    self.visitResult();
  },
};

// ✅ ALSO VALID - dynamic bind/unbind via reaction
// Use when the key truly should not exist at certain times
```

---

## Internals

Key bindings attach a single `keydown` listener on `document` via Query. Each keydown is normalized by `getKeyFromEvent` and appended to a running sequence buffer. Matching uses `endsWith` on the buffer, so sequences build up naturally. The buffer resets after 500ms of inactivity. Comma-separated descriptors are split and each variant is checked. The listener is cleaned up via `AbortController` when the template is destroyed.

---

## Quick Reference

```javascript
// --- Static keys in defineComponent ---
const keys = {
  'a'() {},                        // single key
  'ctrl + k'() {},                 // combination
  'up up down down'() {},          // sequence (500ms window)
  'up, down'() {},                 // multiple keys, one handler
};
defineComponent({ tagName: 'x-thing', template, css, keys });

// --- Callback extras ---
keys = {
  'esc'({ inputFocused, repeatedKey, event, self }) {
    if (inputFocused) return true;  // allow default
    self.close();                   // preventDefault automatic
  },
};

// --- Dynamic binding ---
const createComponent = ({ bindKey, unbindKey, self, reaction, state }) => ({
  initialize() {
    bindKey('enter', self.submit);
    reaction(() => {
      if (!state.active.get()) unbindKey('enter');
    });
  },
});
```

---

## Related Skills

| Skill | Use when... |
|-------|-------------|
| **Mental Model** (`mental-model`) | Understanding destructured callback params and component lifecycle |
| **Reactive State** (`reactive-state`) | Using signals and reactions with dynamic keybindings |
| **Component HTML** (`component-html`) | Template syntax for the UI that key handlers manipulate |
