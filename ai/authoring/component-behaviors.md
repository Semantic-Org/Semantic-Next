---
title: Using Behaviors in Components
description: How to use free-standing behaviors (transition, tooltip, escape, attach) from within Semantic UI components — attachment timing, Shadow DOM considerations, cleanup, and integration with component lifecycle.
keywords: [behaviors, transition, tooltip, escape, attach, registerBehavior, component integration, shadow DOM, lifecycle, onRendered]
audience: authoring
skill: component-behaviors
---

# Using Behaviors in Components

> **Skill:** `sui:component-behaviors`
> **Purpose:** How to attach and use shipped behaviors (transition, tooltip, escape, attach) inside components. Covers lifecycle timing, Shadow DOM integration, cleanup, and invocation patterns.
> **Last Updated:** 2026-03-04

---

**Golden rule: Attach behaviors in `onRendered`, never in `createComponent` or `onCreated`.** Behaviors operate on DOM elements. The shadow DOM does not exist until after the first render.

---

## Available Behaviors

Four behaviors ship with Semantic UI. Each is registered via `registerBehavior` and extends `Query.prototype` with a method of the same name.

| Behavior | Method | Purpose | Source |
|----------|--------|---------|--------|
| **Transition** | `$el.transition(...)` | CSS animations via the Web Animations API | `src/behaviors/transition/transition.js` |
| **Tooltip** | `$el.tooltip(...)` | Floating content attached to a trigger with positioning, animation, and top-layer escape | `src/behaviors/tooltip/tooltip.js` |
| **Attach** | `$el.attach(...)` | Anchor-based positioning of one element relative to another using CSS anchor positioning | `src/behaviors/attach/attach.js` |
| **Escape** | `$el.escape(...)` | Promotes an element to the browser's top layer via the Popover API (`popover="manual"`) | `src/behaviors/escape/escape.js` |

### Dependency Graph

Tooltip composes the other three behaviors internally:

```
Tooltip
├── Attach (positioning relative to trigger)
├── Transition (animate in/out)
└── Escape (promote to top layer)
```

You do not need to call attach, transition, or escape manually when using tooltip — it handles them internally.

---

## Importing Behaviors

Behaviors register on `Query.prototype` as a **side effect** of being imported. The import must execute before any `$el.behaviorName()` call.

```javascript
// From the core package (most common for downstream users)
import { Transition } from '@semantic-ui/core';
import { Tooltip } from '@semantic-ui/core';

// From the behaviors barrel (within the SUI monorepo)
import { Transition } from '../../behaviors/index.js';
```

The import causes `registerBehavior` to run, which adds the method to `Query.prototype`. After that, any `$()` result has the method available. The export value itself is typically unused — the import is for its side effect.

```javascript
// ❌ WRONG — calling a behavior that hasn't been imported
$('.el').transition('fade in'); // TypeError: $(...).transition is not a function

// ✅ RIGHT — import first, then use
import { Transition } from '@semantic-ui/core';
$('.el').transition('fade in');
```

---

## Attaching Behaviors in Components

### Lifecycle Timing

Behaviors manipulate DOM elements, so they must be attached after the shadow DOM renders. The correct hook is `onRendered`.

```javascript
// ✅ Correct — DOM exists in onRendered
const onRendered = ({ $, isClient }) => {
  if (isClient) {
    $('.trigger').tooltip({
      position: 'top',
      topLayer: true,
    });
  }
};

// ❌ WRONG — DOM doesn't exist yet in onCreated
const onCreated = ({ $ }) => {
  $('.trigger').tooltip({ position: 'top' }); // fails silently, no elements found
};

// ❌ WRONG — DOM doesn't exist in createComponent
const createComponent = ({ $ }) => ({
  initialize() {
    $('.button').tooltip({ text: 'Click me' }); // no DOM yet
  },
});
```

### SSR Guard

`onRendered` fires on the server too. Guard behavior attachment with `isClient`:

```javascript
const onRendered = ({ $, isClient }) => {
  if (isClient) {
    $('ui-icon[copy]').tooltip({
      onHidden: function() {
        $(this).tooltip('set text', 'Copy Code');
      },
    });
  }
};
```
*Pattern from: `docs/src/components/CodeSample/CodeSample.js`*

### Complete Component Example

```javascript
import { defineComponent } from '@semantic-ui/component';
import { Tooltip } from '@semantic-ui/core';

const onRendered = ({ $, isClient }) => {
  if (isClient) {
    $('.toggle').tooltip({
      topLayer: true,
      position: 'right',
    });
  }
};

export default defineComponent({
  tagName: 'my-component',
  template,
  css,
  onRendered,
});
```
*Pattern from: `src/components/sidebar-toggle/sidebar-toggle.js`*

---

## Invocation Patterns

Once a behavior is attached, you interact with it using string-based method invocation on the same Query selection.

### Settings Object (Initialization)

```javascript
// Attach with settings
$('.trigger').tooltip({
  text: 'Hello',
  position: 'bottom',
  trigger: 'hover',
  delay: 200,
});

// Transition with settings
$('.box').transition({
  animation: 'fade',
  duration: 500,
  onComplete: () => console.log('done'),
});
```

### String Invocation (Method Calls)

```javascript
// Call a behavior method by name
$('.trigger').tooltip('show');
$('.trigger').tooltip('hide');
$('.trigger').tooltip('toggle');
$('.trigger').tooltip('destroy');

// Transition uses custom invocation — the string IS the animation
$('.el').transition('fade in');
$('.el').transition('fade out');
$('.el').transition('jiggle');
```

### String Invocation with Arguments

```javascript
// Transition: animation name, duration, callback
$('.el').transition('fade in', 300);
$('.el').transition('fade in', 300, () => console.log('visible'));

// Tooltip: method name with arguments
$(target).tooltip('set text', 'Copied!');
$(target).tooltip('set header', 'New Header');
```

### Chaining Behavior Calls

Void methods return the Query instance, enabling chaining:

```javascript
$(target).tooltip('set text', 'Copied!');
const $tooltip = $(target).tooltip('get tooltip');
$tooltip.transition('jiggle');
```
*Pattern from: `docs/src/components/CodeSample/CodeSample.js`*

### Querying Behavior State

Methods that return values give back the value directly instead of the Query chain:

```javascript
const isShown = $('.trigger').tooltip('is shown');    // boolean
const $tooltip = $('.trigger').tooltip('get tooltip'); // Query instance
```

---

## Shadow DOM Considerations

### `$` Scopes to Shadow Root

Inside a component, `$` is scoped to the component's shadow root. Behaviors attached via `$` operate on elements within that shadow root. This is usually what you want.

```javascript
// Inside a component — $ finds elements in shadow DOM
const onRendered = ({ $, isClient }) => {
  if (isClient) {
    // Finds .toggle inside this component's shadow root
    $('.toggle').tooltip({ position: 'right' });
  }
};
```

### Behavior CSS is Auto-Adopted

Each behavior carries its own CSS (imported as `?raw`). When a behavior is initialized on an element inside a shadow root, its stylesheet is automatically adopted to that shadow root via `adoptStylesheet`. This happens per shadow root — the constructed stylesheet is cached and reused across instances.

You do not need to manually import or adopt behavior CSS.

### Page-Level Behavior Attachment

To attach a behavior to an element outside the shadow DOM from within a component, use `{ root: document }`:

```javascript
const onRendered = ({ $, isClient }) => {
  if (isClient) {
    // Attach to an element in the page DOM, not the shadow root
    $('html .page-trigger', { root: document }).tooltip({ text: 'Page tooltip' });
  }
};
```

---

## Cleanup

### Automatic Cleanup

Behaviors manage their own cleanup. When you call `$el.tooltip('destroy')`, the behavior:
1. Disconnects mutation observers
2. Aborts all events (via `AbortController`)
3. Calls the behavior's `onDestroyed` hook
4. Removes the instance from the DOM element

### Component Destruction

When a component is removed from the DOM, its shadow root is discarded, which removes all DOM elements that behaviors were attached to. For most cases, this is sufficient — behaviors attached to shadow DOM elements are garbage collected with them.

If a behavior creates elements **outside** the shadow root (e.g., tooltip with `topLayer: true` creates a popover), the behavior's `onDestroyed` hook handles cleanup. Tooltip, for example, clears timers and removes its tooltip element in `onDestroyed`.

### Manual Destruction

If you need to tear down a behavior during the component's lifetime (not just at destroy), call the `destroy` method:

```javascript
$('.trigger').tooltip('destroy');
```

### When Manual Cleanup IS Needed

If you store behavior references and manage them outside the normal lifecycle, clean up in `onDestroyed`:

```javascript
const createComponent = ({ self, $ }) => ({
  tooltipTarget: null,
  setupTooltip() {
    self.tooltipTarget = $('.dynamic-trigger');
    self.tooltipTarget.tooltip({ text: 'Dynamic' });
  },
});

const onDestroyed = ({ self, isServer }) => {
  if (isServer) return;
  if (self.tooltipTarget) {
    self.tooltipTarget.tooltip('destroy');
  }
};
```

---

## Behavior Settings Reference

### Transition

| Setting | Default | Description |
|---------|---------|-------------|
| `animation` | `''` | CSS animation name (e.g., `'fade'`, `'slide down'`) |
| `duration` | `'auto'` | Duration in ms, or `'auto'` to use CSS value |
| `interval` | `200` | Delay between elements when animating a group |
| `groupOrder` | `'auto'` | Group direction: `'forward'`, `'reverse'`, `'auto'` |
| `queue` | `true` | Queue directional transitions on same element |
| `onComplete` | `noop` | Callback when animation finishes |
| `onStart` | `noop` | Callback when animation begins |
| `onShow` | `noop` | Callback after `in` animation |
| `onHide` | `noop` | Callback after `out` animation |

### Tooltip

| Setting | Default | Description |
|---------|---------|-------------|
| `html` | `''` | Raw HTML content |
| `text` | `''` | Text content (wrapped in `<div class="text">`) |
| `header` | `''` | Header text (wrapped in `<div class="header">`) |
| `position` | `'top'` | Position: `'top'`, `'bottom'`, `'left'`, `'right'`, compounds like `'top left'` |
| `trigger` | `'hover'` | Trigger event: `'hover'`, `'focus'`, `'click'`, `'manual'` |
| `animation` | `'auto'` | Transition animation (`'auto'` = based on position) |
| `duration` | `'auto'` | Animation duration |
| `delay` | `200` | Show delay in ms |
| `hideDelay` | `70` | Hide delay in ms |
| `warmWindow` | `1200` | Skip delay if tooltip shown recently (ms) |
| `arrow` | `true` | Show pointing arrow |
| `topLayer` | `true` | Render in top layer (escapes clipping) |
| `distance` | `0` | Distance from trigger |
| `offset` | `0` | Offset along edge |
| `preserve` | `true` | Keep tooltip in DOM after hiding |
| `hoverable` | `false` | Allow hovering over tooltip without closing |
| `containToScroll` | `true` | Contain to scroll container |
| `onShow` | `noop` | Callback before showing (return `false` to cancel) |
| `onHide` | `noop` | Callback before hiding (return `false` to cancel) |
| `onVisible` | `noop` | Callback after show animation completes |
| `onHidden` | `noop` | Callback after hide animation completes |

### Attach

| Setting | Default | Description |
|---------|---------|-------------|
| `to` | `''` | Element or selector to attach to |
| `position` | `''` | Position relative to anchor (12 positions + `'center'`) |
| `fallbackStrategy` | `'adjacent'` | `'adjacent'`, `'opposite'`, or array of positions |
| `lastResort` | `''` | Fallback position if none fit viewport |
| `arrow` | `true` | Add pointing arrow |
| `offset` | `0` | Offset along edge |
| `distance` | `0` | Distance from anchor |
| `containToScroll` | `false` | Contain to scroll container |
| `observeChanges` | `true` | Reposition on attribute changes |

### Escape

Escape has no configurable settings. It uses a string-based API:

```javascript
$el.escape('show');  // Promote to top layer (popover="manual" + showPopover)
$el.escape('hide');  // Remove from top layer (hidePopover)
```

---

## When to Use Behaviors vs Alternatives

| Scenario | Use | Why |
|----------|-----|-----|
| Animate show/hide of a component part | `transition` | Handles direction detection, queueing, group animations |
| Add hover tooltip to an icon | `tooltip` | Full positioning, animation, top-layer escape in one call |
| Position a dropdown relative to trigger | `attach` | CSS anchor positioning with fallback algorithm |
| Promote a modal/popup above clipping ancestors | `escape` | Clean Popover API abstraction |
| Simple opacity fade | CSS `transition` property | No behavior needed for single-property CSS transitions |
| State-driven visibility | `{#if visible}` template conditional | Let reactivity handle it if no animation is needed |
| Complex multi-step animation sequence | Web Animations API directly | Behaviors handle single animations, not choreography |

---

## Quick Reference

```javascript
// Import (side effect registers on Query.prototype)
import { Transition, Tooltip, Attach, Escape } from '@semantic-ui/core';

// Attach in onRendered with isClient guard
const onRendered = ({ $, isClient }) => {
  if (isClient) {
    $('.el').tooltip({ text: 'Hello', position: 'top' });
  }
};

// Transition invocation patterns
$('.el').transition('fade in');               // animate in
$('.el').transition('fade out');              // animate out
$('.el').transition('fade in', 500);          // with duration
$('.el').transition({ animation: 'scale', duration: 300 }); // settings object

// Tooltip invocation patterns
$('.el').tooltip({ text: 'Hi' });             // initialize
$('.el').tooltip('show');                     // show programmatically
$('.el').tooltip('hide');                     // hide
$('.el').tooltip('set text', 'New text');     // update content
$('.el').tooltip('destroy');                  // tear down

// Attach invocation
$('.popup').attach({ to: '.trigger', position: 'bottom' });

// Escape invocation
$('.overlay').escape('show');                 // promote to top layer
$('.overlay').escape('hide');                 // remove from top layer
```

---

## Related Skills

| Skill | Command | Use when... |
|-------|---------|-------------|
| **Query Behaviors** | `sui:query-behaviors` | Building/registering custom behaviors (the authoring side) |
| **Component Lifecycle** | `sui:component-lifecycle` | Understanding when hooks fire and what's available in each |
| **Component Patterns** | `sui:component-patterns` | Communication, cleanup, and DOM querying patterns |
| **Component CSS** | `sui:component-css` | CSS animations and transitions without behaviors |
| **Query** | `sui:query` | Basic `$` / `$$` usage, selectors, DOM manipulation |
