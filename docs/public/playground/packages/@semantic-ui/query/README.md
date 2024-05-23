# @semantic-ui/query

Query is a **tiny (3kb!) library** for chaining interactions with DOM elements similar to jQuery.

It is designed to work with the Shadow DOM tree, correctly matching on nested shadow DOMs in pages that use web components.

It's designed to be fast, using only modern DOM APIs and built to work with the shadow DOM and help simplify imperative DOM mutations.

There's many reasons why you might use this over vanilla just DOM APIs, consider removing event handlers which requires you to track a reference to the original event handler to unbind, or setting up basic interaction patterns like [event delegation](https://learn.jquery.com/events/event-delegation/).

Query supports the following methods:

### Querying DOM
* `filter(selector)` - Filter current node list to match selector.
* `children(selector)` - Return only child nodes matching a selector.
* `parent(selector)` - Find the parent elements matching a selector.
* `find(selector)` - Find child elements matching a selector.
* `not(selector)` - Return only elements not matching a selector.
* `closest(selector)` - Find the closest parent element matching a selector.
* `is(selector)` - returns true if the current elements all match a selector.
- `not(seletor)` - returns true if the current elements all do not match a selector.

### Attributes
` `hasClass(className)` - Returns true if class name is present on some elements
* `addClass(classNames)` - Add class names to elements.
* `removeClass(classNames)` - Remove class names from elements.
# `toggleClass(classNames)` - Toggles class names on elements.
* `css(property, value)` - Gets or sets CSS properties on an element. Accepts either two parameters or an object of properties to change. Will not return computed styles by default.
* `cssVar(varName, newValue)` - Get/set a css var
# `computedStyle(property)` - Gets the computed CSS for an element
* `attr(attribute, value)` - Get/Set an attribute to a value. Accepts either two parameters or an object of attributes to change.
* `removeAttr(attributeName)` - Remove a specified attribute from each element in the set of matched elements.

### Content
* `html(newHTML)` - Get or set HTML for the current node list.
* `outerHTML(newHTML)` - Get or set outer HTML for the current node list. Outer HTML includes the current tag contents in the returned HTML.
* `text(newText)` - Get or set text for the current node list. This is recursive, getting all child text nodes and works with slotted content.
* `textNode()` - Gets the current text node of the matched elements. This is not recursive.

## Sizing
- `width()` - get the width of an element
- `height()` get the height of an element
- `scrollHeight()` - get the scroll height of an element
- `scrollWidth()`- get the scroll width of an element
- `offsetParent()` - get the offset parent of an element for positioning.

### Events
* `on(event, targetSelectorOrHandler, handler)` - Attach an event using either event delegation (i.e., `.on('childNode', 'click', func)`) or regular event binding (i.e., `.on('click', func)`).
* `one(event, targetSelectorOrHandler, handler, options)` - Attach an event handler that fires only once
* `off(event, handler)` - Removes an event either by event type or handler.
* `dispatchEvent(eventName, data, eventSettings)` - Dispatch an event from an element with data

### DOM Manipulation
* `remove()` - Remove current elements from the DOM.

### Utilities
* `each(function(el, index) => {})` - Run a function across a series of DOM nodes.
* `get(index)` - Returns the real DOM element from the node list at the matching index (no longer chainable).
* `eq(index)` - Filters node list to only include the element at the index (still chainable).
* `initialize(settings)` - Adds the settings to given element after DOM content has loaded.

### Form
* `value(newValue)` - Get the current value of the first element in the set of matched elements or set the value of every matched element. This method is an alias for `value(newValue)`.

### Event Handling
* `focus()` - Sets focus on the first element in the set of matched elements.
* `blur()` - Removes focus from the first element in the set of matched elements.
