# @semantic-ui/query

Query is a **tiny (3kb!) library** for chaining interactions with DOM elements similar to jQuery.

It's designed to be fast, using only modern DOM APIs and built to work with the shadow DOM and help simplify imperative DOM mutations.

There's many reasons why you might use this over vanilla just DOM APIs, consider removing event handlers which requires you to track a reference to the original event handler to unbind, or setting up basic interaction patterns like [event delegation](https://learn.jquery.com/events/event-delegation/).

Query supports the following methods

### Querying DOM
* `find(selector)` - Find a child element matching a selector
* `parent(selector)` - Find a parent element matching a selector
* `children(selector)` - Return only child nodes matching a selector
* `filter(selector)` - Filter current node list to match selector
* `not(selector)` - Return only elements not matching a selector
* `closest(selector)` Find the closest parent element matching a selector

### Attributes
* `addClass(classNames)` - Add class names to element
* `removeClass(classNames)` - Remove class names from element
* `css(property, value)` - Set css property to value. Accepts either two parameters or an object of * properties to change.
* `attr(attribute, value)` - Set css property to value. Accepts either two parameters or an object of attributes to change.

### Content
* `html(newHTML)` - Get or set html for for current node list.
* `outerHTML(newHTML)` - Get or set outer HTML for for current node list. Outer html includes the current tag contents in the returned html.
* `text(newText)` - Get or set text for new text list. This is recursive getting all child text nodes and works with slotted content.
* `textNode()` - Gets the current text node of the matched elements. This is not recursive.

### Events
* `on(event, targetSelectorOrHandler, handler)` - Attach an event using either [event delegation](https://learn.jquery.com/events/event-delegation/) (i.e.)  `.on(childNode', 'click', func)` and regular event binding `.on('click', func)`.
* `off(event, handler)` - Removes an event either by event type or handler.

### DOM Manipulation
* `remove()` - Remove current elements from DOM

### Utilities
* `each(function(el, index) => {})` - Run a function across a series of DOM nodes
* `get(index)` - Returns the real DOM element from the node list at the matching index (no longer chainable)
* `eq(index)` - Filters node list to only include the element at the index (still chainable)

