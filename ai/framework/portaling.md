---
title: Component Portaling Guide
description: Guide for implementing overlay components (modals, popovers, dropdowns) with optional portaling using behaviors to escape clipping and stacking contexts.
keywords: [portaling, overlay, modal, popover, attach behavior, transition, stacking context]
audience: framework
type: doc
---

# AI Guide: Implementing Optional Portaling with Behaviors

> **For:** AI agents implementing overlay components (modals, popovers, dropdowns)
> **Purpose:** To understand the correct, SSR-friendly pattern for moving overlay DOM elements to escape clipping and stacking contexts.
> **Prerequisites:** [Mental Model](ai/framework/mental-model.md), [Plugins and Behaviors](ai/guides/query/plugins-and-behaviors.md), [attach.js](src/behaviors/attach/attach.js), [transition.js](src/behaviors/transition/transition.js)

---

## 1. The Core Problem: Stacking and Clipping

Many UI components (modals, dropdowns, tooltips) must render "on top" of other content. However, if they are rendered inline, they are constrained by their parent's CSS:

1.  **Clipping:** A parent with `overflow: hidden` will cut off the component.
2.  **Stacking:** A parent with a `z-index` (or other properties like `transform` or `opacity`) creates a new stacking context. The component can *never* appear above its parent's sibling, even with `z-index: 9999`.

The *only* solution is to move the component's overlay element in the DOM, typically to `document.body`.

## 2. The Anti-Pattern: A `<ui-portal>` Component

It is tempting to create a declarative `<ui-portal>` web component. **DO NOT DO THIS.**

This pattern is fundamentally incompatible with the framework's "Progressive Enhancement" philosophy and breaks SSR.

* **Server-Side (SSR):** The server renders the component's content *inline*, inside the `<ui-portal>`.
* **Client-Side (Hydration):** The `<ui-portal>` JavaScript loads, moves its content to `document.body`.
* **Result:** **Hydration Mismatch.** The client DOM no longer matches the server DOM, forcing a full-page re-render and defeating the purpose of SSR.

## 3. The SUI Solution: Abstracted Behaviors

The correct pattern is to abstract the portal mechanic into **behaviors**. The component itself does not know *how* to portal; it only coordinates the behaviors.

* **`attach` Behavior:** This behavior handles all positioning and DOM-moving logic.
* **`transition` Behavior:** This behavior handles all `show` and `hide` animations.

The component (`ui-popover`, `ui-modal`) is just a "coordinator" that initializes these behaviors and passes them its settings.

### The Portal Mechanic: `attach.js`

The "portal" mechanic is controlled by the `moveElement` setting in the `attach` behavior.

* **`$(el).attach({ moveElement: true, context: 'body' })`**
    This is the "Portal Mode". On initialization, the `attach` behavior will `detach()` the element and `appendTo()` the specified `context` (usually `body`). This escapes all parent stacking contexts.

* **`$(el).attach({ moveElement: false })`**
    This is the "Inline Mode". The element is not moved. It will be positioned relative to its trigger but will be clipped by parent `overflow` or `z-index` contexts.

### Making it Optional

This portaling mechanic **must** be optional. Some users *want* the popover to be clipped by a scroll container.

We achieve this by adding a component setting (e.g., `detachable: true`) and passing its value to the behavior.

* Component `defaultSettings`: `{ detachable: true }`
* Behavior Initialization: `$(el).attach({ moveElement: settings.detachable, ... })`

This gives the user full control while providing a robust default.

## 4. Practical Example: `ui-popover`

This example shows the complete, correct implementation of a popover component that coordinates the `attach` and `transition` behaviors.

### `popover.html`

The template is simple and includes the trigger and the (initially hidden) content.

```html
<div class="trigger" part="trigger">
  <!-- Default slot for the trigger element -->
  {>slot}
</div>
<div class="content {ui}" part="content" {hidden}>
  <!-- Named slot for the popover's content -->
  {>slot name="content"}
</div>
```

```javascript
import { defineComponent } from '@semantic-ui/component';

export const UIPopover = defineComponent({
  tagName: 'ui-popover',

  // Default settings that will be passed to the behaviors
  defaultSettings: {
    detachable: true,       // This controls the "portal" mechanic
    context: 'body',        // The destination for the portal [cite: attach.js]
    position: 'bottom left',
    offset: 8,
    distance: 0,
    transition: 'fade',     // [cite: transition.js]
    duration: 200,
    observeChanges: true,   // [cite: attach.js]
  },

  // --- 2. State ---
  defaultState: {
    isOpen: false,
  },

  // --- 3. Lifecycle ---
  // Behaviors are initialized once the shadow DOM is rendered
  onRendered({ self, settings, $ }) {

    const $trigger = $('.trigger');
    const $content = $('.content');

    // Initialize the attach behavior, passing the portal setting
    $content
      .attach({
        to: $trigger,
        context: settings.context,
        moveElement: settings.detachable, // This is the optional portal switch
        position: settings.position,
        offset: settings.offset,
        distance: settings.distance,
        observeChanges: settings.observeChanges,
      })
      // set hidden state
      .transition('set hidden');
  },

  events: {
    'click .trigger'({ self }) {
      self.toggle();
    }
  },

  // --- 5. Instance Factory ---
  // Returns the component's public/private API
  createComponent: ({ settings, state, $, self }) => ({
    
    toggle() {
      if (state.isOpen.get()) {
        self.hide();
      } else {
        self.show();
      }
    },

    show() {
      if (state.isOpen.get()) return;
      
      const $content = $('.content');

      $content
        .attach('reposition') // query supports chaining
        .transition({
          animation: settings.transition + ' in',
          duration: settings.duration,
          onComplete: () => state.isOpen.set(true)
        });
    },

    hide() {
      if (!state.isOpen.get()) return;

      $('.content').transition({
        animation: settings.transition + ' out',
        duration: settings.duration,
        onComplete: () => state.isOpen.set(false)
      });
    },
  }),
});
```
