---
title: Query DOM with Semantic UI
description: End-user guide for using SUI's Query library — selecting elements, binding events, manipulating the DOM, accessing component instances, and piercing shadow DOM with $$.
keywords: [query, $, $$, DOM, events, shadow DOM, component access, selectors, jQuery-like]
audience: usage
skill: query
type: skill
---

# Query DOM with Semantic UI

> **Skill:** `query`
> **Purpose:** Select elements, bind events, manipulate the DOM, and interact with SUI components using `$` and `$$`
> **Last Updated:** 2026-03-04

---

## What is Query?

Query is SUI's lightweight DOM library — a jQuery-like `$` function for selecting elements, binding events, and manipulating the DOM. It also provides `$$`, which does everything `$` does but pierces through Shadow DOM boundaries.

```js
import { $, $$ } from '@semantic-ui/query';

$('ui-button')              // Select buttons (light DOM only)
$$('ui-dropdown .item')     // Select items inside shadow DOM
```

If you've used jQuery, Query works as you'd expect. This guide focuses on what's different or SUI-specific — everything else follows standard jQuery conventions.

---

## Selection and Collections

```js
$('.sidebar')                // CSS selector
$(document.body)             // Wrap a DOM element
$([el1, el2])                // Wrap an array
$('<div>Content</div>')      // Create element
```

| Method | Description |
|--------|-------------|
| `.length` | Number of matched elements |
| `.count()` | Returns `.length` (useful in expressions) |
| `.exists()` | Returns `true` if collection is non-empty |
| `.get(index)` | Raw DOM element at index (no args = all as array) |
| `.el()` | First raw DOM element (shorthand for `.get(0)`) |
| `.eq(index)` | New Query with element at index |
| `.first()`, `.last()` | First/last element as new Query |
| `[index]` | Array-like index access |
| `.add(selector)` | Combine with another selection (deduplicated) |
| `.each(fn)` | Iterate: `(el, index) => {}` |
| `.map(fn)` | Map over elements, returns array |
| `.filter(selector\|fn)` | Reduce to matching subset |
| `.not(selector\|fn)` | Inverse of `.filter()` — exclude matching elements |
| `.is(selector)` | Test if any element matches selector |
| `.slice(start, end)` | Subset of elements by index range |
| `.clone()` | Deep clone all matched elements |
| `.reverse()` | Reverse element order in collection |
| `.index(selector)` | Index of element among its siblings |
| `.indexOf(filter)` | Index of matching element within collection |

---

## DOM Traversal

| Method | Description |
|--------|-------------|
| `.find(selector)` | Descendants matching selector |
| `.parent(selector)` | Direct parent(s) |
| `.closest(selector)` | Nearest matching ancestor |
| `.closestAll(selector)` | **All** matching ancestors (not just nearest) |
| `.children(selector)` | Direct children |
| `.siblings(selector)` | Sibling elements |
| `.next(selector)`, `.prev(selector)` | Adjacent siblings |
| `.contains(selector)` | Test if selection contains target element (shadow DOM aware with `$$`) |
| `.end()` | Return to previous selection in chain |

---

## Content Manipulation

| Method | Description |
|--------|-------------|
| `.html()`, `.html(content)` | Get/set innerHTML |
| `.outerHTML()`, `.outerHTML(content)` | Get/set outerHTML (includes the element itself) |
| `.text()`, `.text(content)` | Get/set textContent |
| `.textNode()` | Get text from direct text nodes only (not descendant elements) |
| `.append(content)`, `.prepend(content)` | Add content inside element |
| `.appendTo(target)`, `.prependTo(target)` | Insert self into target |
| `.before(content)`, `.after(content)` | Insert content adjacent to element |
| `.insertBefore(target)`, `.insertAfter(target)` | Insert self adjacent to target |
| `.remove()` | Remove elements from DOM |
| `.detach()` | Remove from DOM but keep the Query chain (for reinsertion) |

---

## Attributes and Properties

| Method | Description |
|--------|-------------|
| `.attr(name)`, `.attr(name, value)` | Get/set attribute |
| `.removeAttr(name)` | Remove attribute |
| `.addAttr(name\|array)` | Set boolean attributes (empty string value) |
| `.data(key)`, `.data(key, value)` | Get/set data-* attributes |
| `.removeData(keys)` | Remove data attrs (space-separated or array) |
| `.prop(name)`, `.prop(name, value)` | Get/set JS properties |

`.addAttr()` is useful for web component boolean attributes:

```js
$('ui-button').addAttr('disabled')
$('ui-input').addAttr(['required', 'readonly'])
```

---

## CSS Classes and Styling

| Method | Description |
|--------|-------------|
| `.addClass(classes)`, `.removeClass(classes)` | Add/remove CSS classes (space-separated) |
| `.toggleClass(classes)` | Toggle CSS classes |
| `.hasClass(name)` | Check for CSS class |
| `.css(prop)`, `.css(prop, value)`, `.css({...})` | Get/set inline styles |
| `.computedStyle(prop)` | Get fully resolved computed value (read-only) |
| `.cssVar(name)`, `.cssVar(name, value)` | Get/set CSS custom properties |

---

## Events

| Method | Description |
|--------|-------------|
| `.on(event, [selector], handler, [options])` | Bind event, optional delegation |
| `.off(event, handler)` | Remove event listener |
| `.one(event, handler)` | One-time event listener |
| `.onNext(event, options)` | Promise-based — await next occurrence |
| `.trigger(event, settings)` | Trigger event — calls native handler (e.g., `el.click()`) if available, else dispatches CustomEvent |
| `.dispatchEvent(event, data, settings)` | Dispatch CustomEvent with `event.detail` data payload (bubbles + composed by default) |
| `.intercept(event, [selector], handler)` | Capture-phase listener (parent-first) |
| `.click()`, `.submit()` | Shorthands for `.trigger('click')` and `.trigger('requestSubmit')` |
| `.focus()`, `.blur()` | Focus management |
| `.ready(handler)` | Execute handler when DOM is ready (use on `$(document)`) |

Supports event delegation, multiple event types (space-separated), and `{ capture, passive, abortController }` options. `scroll` and `resize` are passive by default. All events default to `composed: true` (cross shadow DOM).

### Non-obvious patterns

**`.trigger()` vs `.dispatchEvent()`** — `.trigger()` is for triggering native behavior (clicks, submits). `.dispatchEvent()` is for custom events with data payloads via `event.detail`. Note that `.submit()` calls `requestSubmit` under the hood, which triggers form validation (unlike native `form.submit()`).

**Handler `this` context** — delegated handlers: `this` is the matched delegate target. Direct handlers: `this` is the element the listener is attached to. Same as jQuery.

**Handler return values** — unlike jQuery where `return false` does both:

```js
$('.link').on('click', () => false);       // stopPropagation() only
$('form').on('submit', () => 'cancel');    // preventDefault() only
```

**Promise-based event waiting** with `.onNext()`:

```js
await $('ui-modal').onNext('hide');                    // Await next occurrence
await $('ui-modal').onNext('hide', { timeout: 5000 }); // With timeout
await $('.el').onNext('animationend');                  // Coordinate animations
```

**Capture-phase interception** with `.intercept()` — parent handles events before children see them:

```js
$('.modal').intercept('keydown', (e) => {
  if (e.key === 'Escape') { closeModal(); return false; }  // Children never see it
});

// With delegation
$('.form').intercept('click', '[type="submit"]', (e) => {
  if (!isValid()) return false;
});
```

---

## Form Values

`.val()`, `.val(value)` — works with SUI form components (`ui-input`, `ui-dropdown`, `ui-checkbox`, etc.) and native `<input>`, `<select>`, `<textarea>`. `.val()` is an alias for `.value()` — both are identical.

---

## Visibility

| Method | Description |
|--------|-------------|
| `.show(options)` | Show elements (restores natural display value) |
| `.hide()` | Hide elements (display: none) |
| `.toggle(options)` | Toggle visibility |
| `.isVisible(options)` | Check if visible (display + dimensions) |
| `.isInView(options)` | Check if within viewport bounds |
| `.naturalDisplay(options)` | Get element's natural display value |

### Non-obvious patterns

**`.show()` restores natural display** — not just `block`. Query analyzes CSS rules to find the element's correct display value:

```js
$('.hidden-flex-container').show()    // Restores to 'flex', not 'block'
$('.hidden-table-row').show()         // Restores to 'table-row'
```

`.naturalDisplay()` returns this value directly. Pass `{ calculate: false }` for faster tag-based lookup.

**`.isVisible()` options** — `includeVisibility` is on by default, `includeOpacity` is opt-in:

```js
$('.el').isVisible()                              // Checks display + dimensions + visibility
$('.el').isVisible({ includeOpacity: true })      // Also checks opacity > 0
$('.el').isVisible({ includeVisibility: false })  // Only check display + dimensions
```

**`.isInView()` options** (forwarded to `.intersects()`):

```js
$('.el').isInView({ threshold: 0.5 })   // At least 50% visible
$('.el').isInView({ fully: true })      // Fully visible
$('.el').isInView({ all: true })        // All elements in selection visible
```

---

## Dimensions and Position

| Method | Description |
|--------|-------------|
| `.width()`, `.height()` | Get/set dimensions |
| `.innerWidth()`, `.innerHeight()` | Width/height including padding |
| `.outerWidth(options)`, `.outerHeight(options)` | Width/height including padding + border (pass `{ includeMargin: true }` for margin) |
| `.naturalWidth()`, `.naturalHeight()` | Natural dimensions (ignoring display: none) |
| `.scrollWidth()`, `.scrollHeight()` | Total scrollable dimensions |
| `.scrollTop(value)`, `.scrollLeft(value)` | Get/set scroll position |
| `.bounds()` | DOMRect bounding box |
| `.position(options)` | Get/set position (global, local, relative coordinates) |
| `.pagePosition()` | Document-relative position (viewport + scroll) |
| `.dimensions()` | Comprehensive layout info (all sizes, positions, box model) |
| `.intersects(target, options)` | Check if elements overlap target |
| `.scrollParent(options)` | Nearest scrollable container |
| `.clippingParent(options)` | Element that clips visual bounds |
| `.positioningParent(options)` | Positioning context parent |
| `.offsetParent()` | Offset parent |

### Non-obvious patterns

**`.position()` returns multiple coordinate systems** and can also set position:

```js
const pos = $('#el').position();
pos.global     // Viewport-relative
pos.local      // Offset-parent-relative

$('#popup').position({ relativeTo: $('#trigger'), top: 10, left: 0 });
```

**`.dimensions()` returns comprehensive layout info** — content/inner/outer/margin sizes, viewport + document positions, box model details (padding/border/margin), and scroll state, all in one call.

**`.scrollParent({ all: true })`** returns all scrollable ancestors, not just the nearest.

---

## Component Integration

These methods are SUI-specific for interacting with web components.

### .settings() and .setting()

Configure a live component instance:

```js
$('ui-dropdown').settings({
  onChange: (value) => handleChange(value),
  items: [{ text: 'One', value: 1 }, { text: 'Two', value: 2 }],
  searchable: true,
});

$('ui-dropdown').setting('searchable')          // Get individual setting
$('ui-dropdown').setting('searchable', false)   // Set individual setting
```

### .initialize()

Set complex properties on components, deferred until DOM ready — use when setting non-serializable values (functions, objects) around DOM insertion time:

```js
$('ui-data-table').initialize({
  dataProvider: () => fetchData(),
  columns: columnDefinitions,
});
```

`.initialize()` wraps `.settings()` in a `.ready()` callback. Use `.initialize()` when you're setting properties at page load and need to ensure the DOM is ready. Use `.settings()` when you know the component is already in the DOM.

### .component()

Access the component instance (the object returned by `createComponent`) to call public methods:

```js
$('ui-modal').component().show();
$('ui-modal').component().hide();
```

> **Note:** Returns `undefined` if the element hasn't upgraded yet. There is no built-in waiting mechanism — if you need to ensure the component is ready, use `customElements.whenDefined()` or listen for the component's initialization event first.

### .dataContext()

Debug a component's internal state:

```js
const ctx = $('ui-form').dataContext();
console.log(ctx);  // { state, settings, self, el, ... }
```

---

## Shadow DOM Slots

| Method | Description |
|--------|-------------|
| `.getSlot(name)` | Get content projected into a named slot (or default slot) |
| `.setSlot(name, html)` | Set content of a named slot (or default slot if one arg) |

---

## Shadow DOM Piercing with `$$`

`$` respects Shadow DOM boundaries. `$$` crosses them — it recursively walks shadow roots and slot projections:

```js
$('ui-dropdown .item').length;          // 0 — can't see inside shadow DOM
$$('ui-dropdown .item').length;         // 5 — finds items inside shadow DOM
$$('ui-form input[type="text"]');       // Finds inputs inside form's shadow DOM
```

**Use `$$` when:** querying inside components you authored, debugging internals, accessing nested shadow content.

**Don't use `$$` when:** interacting with third-party components (internals may change). Prefer `.component()` and `.settings()` instead.

---

## Chaining

Most methods return the Query instance for chaining. Methods that return values (`.text()`, `.val()`, `.attr()` with one arg, `.component()`) break the chain.

`.end()` returns to the previous selection:

```js
$('.items')
  .addClass('processed')
  .find('.button')
  .on('click', handleClick)
  .end()                     // Back to .items
  .css('opacity', '1');
```

---

## Global Scope

```js
import { exportGlobals, restoreGlobals } from '@semantic-ui/query';

exportGlobals();      // Make $ and $$ available on window
restoreGlobals();     // Restore original $ and $$ values
```

---

## Quick Reference

```js
// Selection
$('.selector')  $$('.selector')  $('<div>html</div>')

// Collection
.length  .count()  .exists()  .get(i)  .el()  .eq(i)  .first()  .last()
.add()  .each(fn)  .map(fn)  .filter(fn)  .not()  .is()
.slice()  .clone()  .reverse()  .index()  .indexOf()

// Traversal
.find()  .parent()  .closest()  .closestAll()  .children()
.siblings()  .next()  .prev()  .contains()  .end()

// Content
.html()  .outerHTML()  .text()  .textNode()
.append()  .prepend()  .appendTo()  .prependTo()
.before()  .after()  .insertBefore()  .insertAfter()
.remove()  .detach()

// Attributes
.attr()  .removeAttr()  .addAttr()  .data()  .removeData()  .prop()

// CSS
.addClass()  .removeClass()  .toggleClass()  .hasClass()
.css()  .cssVar()  .computedStyle()

// Events
.on()  .off()  .one()  .onNext()  .trigger()  .dispatchEvent()  .intercept()
.click()  .submit()  .focus()  .blur()  .ready()

// Forms
.val()  .value()

// Visibility
.show()  .hide()  .toggle()  .isVisible()  .isInView()  .naturalDisplay()

// Dimensions
.width()  .height()  .innerWidth()  .innerHeight()
.outerWidth()  .outerHeight()  .naturalWidth()  .naturalHeight()
.scrollWidth()  .scrollHeight()  .scrollTop()  .scrollLeft()
.position()  .pagePosition()  .dimensions()  .bounds()
.intersects()  .scrollParent()  .clippingParent()  .positioningParent()  .offsetParent()

// Shadow DOM Slots
.getSlot()  .setSlot()

// Components
.settings()  .setting()  .initialize()  .component()  .dataContext()
```

---

## Extending Query

Query is extensible via plugins and behaviors. Simple plugins add methods to `$.plugin` (prototype extension). Behaviors are full-lifecycle stateful plugins with settings, events, mutations, and CSS injection. See the **Query Behaviors** skill for details.

---

## Related Skills

| Skill | Command | Use when... |
|-------|---------|-------------|
| **Use Components** | `use-components` | Component usage, specs, attributes, events |
| **Query & Behaviors** | `query-behaviors` | Extending Query with plugins and behaviors |
| **Style Components** | `style-components` | Customizing component appearance from outside |
