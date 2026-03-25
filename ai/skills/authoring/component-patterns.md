---
title: Advanced Component Patterns and Recipes
description: Decision trees and production patterns for component communication, DOM querying, race condition prevention, resource cleanup, async reactions, lazy loading, scroll handling, and key anti-patterns.
keywords: [findParent, findChild, dispatchEvent, attachEvent, $, $$, race conditions, intersection observer, cleanup, async, lazy loading, scroll, form handling, anti-patterns]
audience: authoring
skill: component-patterns
type: skill
---

# Advanced Component Patterns and Recipes

> **Skill:** `component-patterns`
> **Purpose:** Decision trees and production patterns for component communication, DOM querying, race condition prevention, resource cleanup, async reactions, lazy loading, scroll handling, and key anti-patterns.
> **Last Updated:** 2026-03-04

---

**Golden rule: Let reactivity do the work.** Reach for imperative DOM manipulation, manual coordination, and non-reactive flags only when the reactive system cannot express the constraint.

---

## Component Communication

### Decision Tree

```
How should component A talk to component B?

├── B is a direct child (subtemplate or nested web component)
│   ├── A owns B's data? → Pass data via settings or template data context
│   └── A needs to call B's methods? → $('child-tag').component().method()
│
├── B is a known parent
│   └── findParent('parentName') → access parent's component instance
│
├── B is a sibling or unrelated
│   ├── Loosely coupled? → dispatchEvent (child fires, ancestor listens)
│   └── Tightly coupled? → Shared signal or common ancestor coordinates
│
└── B is anywhere on the page (external code)
    └── $('tag-name').settings() or $('tag-name').component()
```

### Pattern 1: Child calls parent via `findParent`

Use when a child needs to read or mutate parent state. The child knows about the parent by name.

```javascript
// todo-item.js — child component
const createComponent = ({ self, data, findParent }) => ({
  getTodos() {
    return findParent('todoList').todos;
  },
  toggleCompleted() {
    const todos = self.getTodos();
    todos.setProperty(data.task._id, 'completed', !data.task.completed);
  },
});
```
*Source: `docs/src/examples/framework/todo-list/todo-item.js`*

The argument to `findParent` is the **camelCase component name**, not the tag name. `findParent('uiPanels')` finds `<ui-panels>`, not `findParent('ui-panels')`.

```javascript
// panel.js — child accesses parent coordinator
getPanels() {
  const panels = findParent('uiPanels');
  return panels;
},
```
*Source: `src/components/panels/panel.js`*

### Pattern 2: Parent listens to child via event delegation

Use when the parent needs to react to child lifecycle or user actions without the child needing a reference to the parent.

```javascript
// panels.js — parent listens for child events using event delegation
const events = {
  'rendered ui-panel'({ self, event, data }) {
    const panel = event.target;
    if (inArray(panel, self.panels)) {
      self.setPanelRendered(panel, data);
    }
  },
  'resizeStart ui-panel'({ self, event, data }) {
    const panel = event.target;
    if (inArray(panel, self.panels)) {
      self.setGroupCalculations();
      self.setDragStartCalculations(panel, data);
    }
  },
};
```
*Source: `src/components/panels/panels.js`*

The child fires events using `dispatchEvent` (which sets `bubbles: true, composed: true` automatically):

```javascript
// panel.js — child dispatches events
dispatchEvent('resizeStart', {
  initialSize: self.initialSize,
  direction: settings.direction,
  startPosition: self.getPointerPosition(event),
});
```
*Source: `src/components/panels/panel.js`*

### Pattern 3: External code configures components via Query

Use when page-level scripts need to pass functions or complex data to components.

```javascript
// page.js — external configuration
$('context-menu.box').settings({
  items: [
    { label: 'Edit', icon: 'edit', action: () => showAction('Editing') },
    { divider: true },
    { label: 'Delete', icon: 'trash', action: () => showAction('Deleted') },
  ],
});
```
*Source: `docs/src/examples/context-menu/page.js`*

Use `initialize` instead of `settings` when the script may run before the component is in the DOM.

### When to use which

| Mechanism | Direction | Coupling | When |
|-----------|-----------|----------|------|
| `findParent` | child -> parent | Tight (child knows parent name) | Child mutates parent state |
| `dispatchEvent` | child -> ancestor | Loose (child doesn't know who listens) | Lifecycle events, user actions |
| `settings` / data context | parent -> child | Standard | Configuration, data flow down |
| `$().component()` | any -> any | Tight (caller knows tag) | External scripts, sibling coordination |
| Shared signal | any <-> any | Tight (both share reference) | Real-time sync between specific peers |

---

## DOM Querying: `$` vs `$$`

### Decision Tree

```
Which query function?

├── Querying inside own shadow root?
│   └── $ (fast, uses native querySelectorAll)
│
├── Querying nested web component internals?
│   └── $$ (pierces shadow boundaries recursively)
│
├── Querying page-level DOM from within a component?
│   └── $('selector', { root: document })
│
├── Querying iframes across the page?
│   └── $$('iframe') — pierces all shadow roots to find them
│
└── Unsure?
    └── Start with $. Switch to $$ only if elements aren't found.
```

### Production examples

**`$` for internal DOM** — most component operations:
```javascript
// panels.js — querying own shadow root children
getGroupSize() {
  return (settings.direction == 'horizontal')
    ? $('.panels', { pierceShadow: false }).width()
    : $('.panels', { pierceShadow: false }).height();
},
```
*Source: `src/components/panels/panels.js`*

**`$$` for cross-boundary access** — reaching into or across web components:
```javascript
// panel.js — reaching all iframes on page during resize
$$('iframe').one('pointerenter', (event) => {
  self.endResize(event);
});
```
*Source: `src/components/panels/panel.js`*

**`$` with `{ root: document }` for page-level queries from inside a component:**
```javascript
// sidebar-toggle.js — toggling classes on <html>
getTarget() {
  return $(settings.classTarget, { root: document });
},
```
*Source: `src/components/sidebar-toggle/sidebar-toggle.js`*

### Performance rule

`$` uses native `querySelectorAll` — fast. `$$` recurses through every shadow root — use only when needed. Cache results when querying the same elements repeatedly:

```javascript
// Good — cache the query result
const $mainMenu = $$('ui-menu.main');
$mainMenu.find('.item').addClass('styled');
$mainMenu.find('.item.active').addClass('highlighted');
```

---

## Race Condition Prevention

### Non-reactive flags

Some state must **not** trigger re-renders. Use plain properties on `self` instead of signals for coordination flags that prevent re-entrant behavior.

```javascript
// inpage-menu.js — three non-reactive coordination flags
const createComponent = ({ self, state, ... }) => ({
  observer: null,
  lastScrollPosition: 0,
  isScrolling: false,    // prevents intersection observer during scroll-to
  isActivating: false,   // prevents scroll handler during programmatic activation
  scrollingDown: false,  // tracks direction without causing re-render
  ...
});
```
*Source: `src/components/inpage-menu/inpage-menu.js`*

These flags coordinate between the intersection observer and scroll-to behavior. If `isScrolling` were a signal, setting it would trigger reactions, potentially causing the exact re-entrant loop it's meant to prevent.

**The pattern**: Guard observer/event callbacks with a plain boolean flag:

```javascript
// inpage-menu.js — guard intersection callback
onIntersection(entries) {
  // ...update visible items...
  if (!self.isScrolling && newVisibleItems.length) {
    self.setActiveItem(visibleItems[0]);
  }
},

scrollToPosition(position) {
  self.isScrolling = true;
  $(scrollContext).one('scrollend', () => {
    requestIdleCallback(() => {
      self.isScrolling = false;
    });
  });
  scrollContext.scrollTo({ top: position, behavior: 'smooth' });
},
```
*Source: `src/components/inpage-menu/inpage-menu.js`*

### `Reaction.afterFlush` for post-update coordination

When you need code to run after reactive updates have flushed to the DOM:

```javascript
// inpage-menu.js — reset flag after DOM update completes
setActiveItem(itemID) {
  self.isActivating = true;
  state.openIndex.set(menuIndex);
  state.currentItem.set(itemID);
  Reaction.afterFlush(() => {
    self.isActivating = false;
  });
},
```
*Source: `src/components/inpage-menu/inpage-menu.js`*

### `isRendered()` guard

Prevent DOM operations on components that haven't rendered yet:

```javascript
// global-search.js — guard DOM access
scrollIntoView(index) {
  if (!isRendered()) {
    return;
  }
  const element = $('.results .result').get(index);
  // ...safe to access DOM...
},
```
*Source: `src/components/global-search/global-search.js`*

---

## External Resource Cleanup

### `attachEvent` for auto-cleanup

Use `attachEvent` instead of manual `addEventListener`. Listeners are automatically removed on component destroy.

```javascript
// inpage-menu.js — auto-cleaned global listeners
bindScroll() {
  attachEvent(self.getScrollContext(), 'scroll', function() {
    self.scrollingDown = Boolean(this.scrollTop > self.lastScrollPosition);
    self.lastScrollPosition = this.scrollTop;
  }, { passive: true });
},

// topbar-menu.js — framework event
attachEvent(document, 'astro:after-swap', self.onPageChange);
```
*Sources: `src/components/inpage-menu/inpage-menu.js`, `src/components/topbar-menu/topbar-menu.js`*

### Manual cleanup in `onDestroyed`

For resources `attachEvent` cannot manage (IntersectionObserver, ResizeObserver):

```javascript
// inpage-menu.js
const onDestroyed = function({ self, isServer }) {
  if (isServer) return;
  self.unbindPageEvents();
};
// in createComponent:
unbindPageEvents() {
  if (self.observer) self.observer.disconnect();
},
```
*Source: `src/components/inpage-menu/inpage-menu.js`*

### Cleanup checklist

| Resource | Cleanup mechanism |
|----------|-------------------|
| Window/document event listeners | `attachEvent` (auto-cleanup) |
| IntersectionObserver | `observer.disconnect()` in `onDestroyed` |
| ResizeObserver | `observer.disconnect()` in `onDestroyed` |
| Timers | `interval()` / `timeout()` (auto-cleanup) |
| Body event listeners from drag | Remove in the end handler |
| SSR-unsafe code | Guard with `if (isServer) return;` at top of `onRendered`/`initialize` |

---

## Async Reactions

### One-time async loading: `reaction.stop()`

```javascript
// global-search.js — lazy-load a library, then stop
async calculateLoadSearch() {
  reaction(async (reaction) => {
    const { Instance } = await import('@pagefind/modular-ui');
    this.search = new Instance({ bundlePath: settings.bundlePath });
    reaction.stop(); // never re-run
  });
},
```
*Source: `src/components/global-search/global-search.js`*

### Skip first run: `reaction.firstRun`

When initial state is empty or invalid:

```javascript
// global-search.js — don't process empty initial results
reaction(async (reaction) => {
  const rawResults = state.rawResults.get();
  if (reaction.firstRun) return;
  const results = await Promise.all(rawResults.results.map(r => r.data()));
  state.results.set(results);
});
```
*Source: `src/components/global-search/global-search.js`*

### Read without subscribing: `peek()`

```javascript
// global-search.js — read length without creating a reactive dependency
selectNext() {
  if (state.selectedIndex.get() < state.displayResults.peek().length - 1) {
    state.selectedIndex.increment();
  }
},
```
*Source: `src/components/global-search/global-search.js`*

---

## Scroll, Intersection, and Drag Patterns

### Smooth scroll with `scrollend` coordination

Pair a non-reactive `isScrolling` flag with the `scrollend` event to prevent observer callbacks during programmatic scrolls. See the `inpage-menu.js` pattern in [Race Condition Prevention](#race-condition-prevention) above.

### IntersectionObserver feeding reactive state

The observer writes to a signal; downstream reactions handle UI updates. Guard the callback with non-reactive flags:

```javascript
// inpage-menu.js — observer callback writes to signal, checks coordination flag
onIntersection(entries) {
  let newVisibleItems = [...state.visibleItems.get()];
  entries.forEach(entry => {
    const itemID = settings.getActiveElementID(entry.target);
    if (entry.isIntersecting) newVisibleItems.push(itemID);
    else newVisibleItems = newVisibleItems.filter(id => id !== itemID);
  });
  state.visibleItems.set(newVisibleItems);
  if (!self.isScrolling && newVisibleItems.length) {
    self.setActiveItem(visibleItems[0]);
  }
},
```
*Source: `src/components/inpage-menu/inpage-menu.js`*

### Body-level event capture during drag

Capture pointer events on `<body>` during drag. Always clean up symmetrically in the end handler:

```javascript
// panel.js — startResize adds listeners, endResize removes them all
startResize(event) {
  self.resizing.set(true);
  dispatchEvent('resizeStart', { ... });
  $('body').addClass('resizing').css('cursor', self.getResizeCursor())
    .on('mousemove', (e) => self.resizeDrag(e)).on('touchmove', self.resizeDrag);
  $$('iframe').one('pointerenter', (e) => self.endResize(e));
  $('body').one('pointerup mouseleave', (e) => self.endResize(e));
},
endResize() {
  $('body').off('pointerup mouseleave mousemove touchmove')
    .removeClass('resizing').css('cursor', '');
  $$('iframe').off('pointerenter');
  self.resizing.set(false);
  dispatchEvent('resizeEnd', { ... });
},
```
*Source: `src/components/panels/panel.js`*

### Caching layout during drag

Cache dimensions at drag start, clear at drag end to avoid reflow per frame:

```javascript
// panels.js — cache at start, delete at end
setGroupCalculations() {
  self.cache.groupSize = self.getGroupSize();
  self.cache.naturalSizes = self.panels.map((p, i) => self.getNaturalPanelSize(i));
},
removeGroupCalculations() {
  delete self.cache.groupSize;
  delete self.cache.naturalSizes;
},
```
*Source: `src/components/panels/panels.js`*

---

## Anti-Patterns

### `this` instead of `self`

```javascript
// ❌ `this` breaks when called from event handlers or other contexts
increment() { this.count.increment(); }

// ✅ `self` is always the component instance proxy
increment() { self.count.increment(); }
```

### Imperative DOM instead of reactive state

```javascript
// ❌ Bypasses reactivity, state and DOM diverge
showResults() { $('.results').css('display', 'block'); }

// ✅ Template reacts to state: {#if resultsVisible}...{/if}
showResults() { state.resultsVisible.set(true); }
```

### Raw `CustomEvent` without `composed: true`

```javascript
// ❌ Event won't cross shadow DOM boundaries
el.dispatchEvent(new CustomEvent('change', { bubbles: true }));

// ✅ Framework helper sets bubbles + composed automatically
dispatchEvent('change', { value });
```

### Chaining `findParent` calls

```javascript
// ❌ Grandchild reaching up two levels — fragile, hard to refactor
findParent('appShell').findParent('appRoot').globalState;

// ✅ Use events to bubble up, or pass data down through settings
dispatchEvent('stateChangeRequested', change);
```

### Signals for coordination flags

```javascript
// ❌ Signal triggers reaction, causing the re-entrant loop it was meant to prevent
isScrolling: signal(false),
onIntersection() { if (!self.isScrolling.get()) { ... } }

// ✅ Plain property — no reactive side effects
isScrolling: false,
onIntersection() { if (!self.isScrolling) { ... } }
```

### Missing SSR guard

```javascript
// ❌ Crashes during server-side render
const onRendered = ({ self }) => {
  window.addEventListener('scroll', self.handleScroll);
};

// ✅ Guard + attachEvent for auto-cleanup
const onRendered = ({ self, isServer, attachEvent }) => {
  if (isServer) return;
  attachEvent(window, 'scroll', self.handleScroll, { passive: true });
};
```

---

## Quick Reference

### Communication
| Pattern | API | Direction |
|---------|-----|-----------|
| Data down | `settings`, template data context | parent -> child |
| Actions up | `dispatchEvent` | child -> ancestor |
| Direct access | `findParent('camelCaseName')` | child -> parent |
| External config | `$('tag').settings({})` | page -> component |
| Method call | `$('tag').component().method()` | any -> specific |

### Query
| Function | Scope | Performance |
|----------|-------|-------------|
| `$('sel')` | Own shadow root | Fast (native) |
| `$$('sel')` | All shadow roots | Slower (recursive) |
| `$('sel', { root: document })` | Page DOM from component | Fast (native) |
| `$('sel', { pierceShadow: false })` | Explicit no-pierce | Fast (native) |

### Cleanup
| Resource | Method |
|----------|--------|
| Window/document events | `attachEvent` (auto) |
| Observers | `disconnect()` in `onDestroyed` |
| Intervals | `clearInterval()` in `onDestroyed` |
| Body drag listeners | `.off()` in end handler |

### Async reactions
| Need | API |
|------|-----|
| Run once | `reaction.stop()` |
| Skip first | `reaction.firstRun` |
| Read without subscribing | `signal.peek()` |
| Run after DOM update | `Reaction.afterFlush(fn)` |

---

## Related Skills

| Skill | Use when... |
|-------|-------------|
| **Reactive State** (`reactive-state`) | Working with signals, reactions, and the reactivity system |
| **Component CSS** (`component-css`) | Styling patterns inside shadow DOM |
| **Component HTML** (`component-html`) | Template syntax and conditional rendering |
| **Mental Model** (`mental-model`) | Understanding core architecture and callback parameters |
