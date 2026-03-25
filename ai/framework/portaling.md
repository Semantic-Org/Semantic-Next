---
title: Overflow Escape Guide
description: Guide for implementing overlay components (modals, popovers, tooltips) that escape clipping and stacking contexts using the escape behavior and Popover API.
keywords: [escape, top layer, overlay, modal, popover, attach behavior, transition, stacking context, popover api]
audience: framework
type: doc
---

# AI Guide: Escaping Overflow with the Top Layer

> **For:** AI agents implementing overlay components (modals, popovers, tooltips)
> **Purpose:** To understand the correct pattern for rendering elements above clipping and stacking contexts without DOM mutation.
> **Prerequisites:** [Mental Model](ai/framework/mental-model.md), [Plugins and Behaviors](ai/guides/query/plugins-and-behaviors.md), [attach.js](src/behaviors/attach/attach.js), [escape.js](src/behaviors/escape/escape.js)

---

## 1. The Core Problem: Stacking and Clipping

Many UI components (modals, dropdowns, tooltips) must render "on top" of other content. However, if they are rendered inline, they are constrained by their parent's CSS:

1.  **Clipping:** A parent with `overflow: hidden` will cut off the component.
2.  **Stacking:** A parent with a `z-index` (or other properties like `transform` or `opacity`) creates a new stacking context. The component can *never* appear above its parent's sibling, even with `z-index: 9999`.

## 2. The Solution: Browser Top Layer via Popover API

The browser's [Popover API](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API) promotes elements to the **top layer** — a rendering layer that sits above all other content. This escapes `overflow: hidden`, z-index stacking contexts, and `clip-path` **without moving the element in the DOM**.

This means:
- The element stays in its original tree scope — CSS `anchor-name` resolves correctly across shadow DOM
- No DOM mutation — scroll listeners remain valid, no positioning context changes
- Custom properties inherit from the original ancestor chain
- Event bubbling follows the original DOM path

### Why Not Portal (DOM Relocation)?

DOM relocation was the previous approach but has fundamental problems:
- CSS `anchor-name` is tree-scoped — moving elements across shadow DOM boundaries breaks anchor positioning silently
- Scroll listeners become stale after the element moves
- Positioning context changes unexpectedly
- Style inheritance breaks

The `escape` behavior replaces portaling for all overflow escape use cases.

## 3. The `escape` Behavior

The `escape` behavior wraps the Popover API (`popover="manual"` + `showPopover()`/`hidePopover()`) with state tracking to prevent double-call errors.

```javascript
// Promote to top layer
$content.escape('show');

// Remove from top layer
$content.escape('hide');
```

The behavior is lazy-created on first string invocation. It:
- Sets `popover="manual"` on the element in `onCreated`
- Guards against `InvalidStateError` from double `showPopover()`/`hidePopover()` calls
- Auto-releases from top layer on destroy

### Why Always-On (No Setting)

Top layer promotion via `popover="manual"` has zero cost:
- No DOM mutation
- No added event listeners (unlike `popover="auto"`)
- No change to containing block or positioning context
- No interference with CSS `position: absolute` or anchor positioning

Every overlay benefits from it. Making this a setting creates a footgun where users discover clipping and have to hunt for a flag.

## 4. The SUI Pattern: Coordinated Behaviors

Overlay components coordinate three behaviors:

* **`escape` Behavior:** Promotes the element to the top layer (above all clipping).
* **`attach` Behavior:** Handles CSS anchor positioning relative to a trigger element.
* **`transition` Behavior:** Handles show/hide animations.

The component is a "coordinator" that initializes these behaviors.

## 5. Practical Example: `ui-popover`

```javascript
import { defineComponent } from '@semantic-ui/component';

export const UIPopover = defineComponent({
  tagName: 'ui-popover',

  defaultSettings: {
    position: 'bottom left',
    offset: 8,
    distance: 0,
    transition: 'fade',
    duration: 200,
    observeChanges: true,
  },

  defaultState: {
    isOpen: false,
  },

  onRendered({ self, settings, $ }) {
    const $content = $('.content');

    // Set up positioning
    $content
      .attach({
        to: $('.trigger'),
        position: settings.position,
        offset: settings.offset,
        distance: settings.distance,
        observeChanges: settings.observeChanges,
      })
      .transition('set hidden');
  },

  events: {
    'click .trigger'({ self }) {
      self.toggle();
    }
  },

  createComponent: ({ settings, state, $, self }) => ({
    toggle() {
      if (state.isOpen.get()) {
        self.hide();
      }
      else {
        self.show();
      }
    },

    show() {
      if (state.isOpen.get()) return;

      const $content = $('.content');

      // Promote to top layer, then position and animate
      $content.escape('show');
      $content
        .attach('reposition')
        .transition({
          animation: settings.transition + ' in',
          duration: settings.duration,
          onComplete: () => state.isOpen.set(true)
        });
    },

    hide() {
      if (!state.isOpen.get()) return;

      const $content = $('.content');

      $content.transition({
        animation: settings.transition + ' out',
        duration: settings.duration,
        onComplete: () => {
          $content.escape('hide');
          state.isOpen.set(false);
        }
      });
    },
  }),
});
```
