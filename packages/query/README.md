# @semantic-ui/query

Query is a tiny (3kb!) library for chaining interactions with DOM elements, similar to jQuery. It is designed to work with the Shadow DOM tree, correctly matching on nested shadow DOMs in pages that use web components.

## Features

- Fast and lightweight, using only modern DOM APIs
- Built to work with the Shadow DOM
- Simplifies imperative DOM mutations
- Provides a familiar API for developers experienced with jQuery

## Installation

You can install Query using npm:

```bash
npm install @semantic-ui/query
```

## Usage

### Standard

```javascript
import { $ } from '@semantic-ui/query';
```

### CommonJS

```javascript
const { $ } = require('@semantic-ui/query');
```

### Browser

In a browser environment you may want to use `exportGlobals` to export $ and $$ for use

```javascript
  import { exportGlobals } from '@semantic-ui/query';

  exportGlobals();


#### Restoring Globals
If you need to restore the previous values before calling export globals.
```javascript
  import { restoreGlobals } from '@semantic-ui/query';
  restoreGlobals();
```

#### Custom Alias
If you prefer to use a custom alias
```javascript
  import { useAlias } from '@semantic-ui/query';

  const myQuery = useAlias();

  // myQuery('div')
```


## API

### Querying DOM

- `filter(selector)` - Filter current node list to match selector.
- `children(selector)` - Return only child nodes matching a selector.
- `parent(selector)` - Find the parent elements matching a selector.
- `find(selector)` - Find child elements matching a selector.
- `not(selector)` - Return only elements not matching a selector.
- `closest(selector)` - Find the closest parent element matching a selector.
- `is(selector)` - Returns true if the current elements all match a selector.
- `siblings(selector)` - Return sibling elements matching a selector.
- `index(indexFilter)` - Return the index of the element among its siblings or within the collection.

### Attributes

- `hasClass(className)` - Returns true if class name is present on some elements.
- `addClass(classNames)` - Add class names to elements.
- `removeClass(classNames)` - Remove class names from elements.
- `toggleClass(classNames)` - Toggles class names on elements.
- `css(property, value, settings)` - Gets or sets CSS properties on an element. Accepts either two parameters or an object of properties to change. Will not return computed styles by default.
- `cssVar(variable, value)` - Get/set a CSS variable.
- `computedStyle(property)` - Gets the computed CSS for an element.
- `attr(attribute, value)` - Get/Set an attribute to a value. Accepts either two parameters or an object of attributes to change.
- `removeAttr(attributeName)` - Remove a specified attribute from each element in the set of matched elements.
- `prop(name, value)` - Get/Set a property on an element.

### Content

- `html(newHTML)` - Get or set HTML for the current node list.
- `outerHTML(newHTML)` - Get or set outer HTML for the current node list. Outer HTML includes the current tag contents in the returned HTML.
- `text(newText)` - Get or set text for the current node list. This is recursive, getting all child text nodes and works with slotted content.
- `textNode()` - Gets the current text node of the matched elements. This is not recursive.

### Sizing

- `width(value)` - Get or set the width of an element.
- `height(value)` - Get or set the height of an element.
- `scrollHeight(value)` - Get or set the scroll height of an element.
- `scrollWidth(value)` - Get or set the scroll width of an element.
- `scrollLeft(value)` - Get or set the scrollLeft position of an element.
- `scrollTop(value)` - Get or set the scrollTop position of an element.
- `offsetParent(options)` - Get the offset parent of an element for positioning.
- `naturalWidth()` - Get the natural width of an element.
- `naturalHeight()` - Get the natural height of an element.

### Events

- `on(event, targetSelectorOrHandler, handlerOrOptions, options)` - Attach an event using either event delegation or regular event binding.
- `one(event, targetSelectorOrHandler, handlerOrOptions, options)` - Attach an event handler that fires only once.
- `off(event, handler)` - Removes an event either by event type or handler.
- `dispatchEvent(eventName, eventData, eventSettings)` - Dispatch an event from an element with data.

### DOM Manipulation

- `remove()` - Remove current elements from the DOM.
- `clone()` - Create a deep clone of the elements in the Query instance.
- `insertAfter(selector)` - Insert elements after each target element.

### Utilities

- `each(callback)` - Run a function across a series of DOM nodes.
- `get(index)` - Returns the real DOM element from the node list at the matching index (no longer chainable).
- `eq(index)` - Filters node list to only include the element at the index (still chainable).
- `initialize(settings)` - Adds the settings to given element after DOM content has loaded.
- `map(callback)` - Apply a function to every element and return the results as an array.
- `count()` - Get the number of elements in the Query instance.
- `exists()` - Check if the Query instance contains any elements.

### Form

- `value(newValue)` - Get the current value of the first element in the set of matched elements or set the value of every matched element. This method is an alias for `val()`.

### Event Handling

- `focus()` - Sets focus on the first element in the set of matched elements.
- `blur()` - Removes focus from the first element in the set of matched elements.

### Internal
- `chain(elements)` - Create a new Query instance with the provided elements.


### Global Export

Query allows you to opt-in to exporting globals in a browser environment. You can use the `exportGlobals` function to attach `$`, `$$`, and `Query` to the global scope.

```html

  import { exportGlobals } from 'https://unpkg.com/@semantic-ui/query';

  exportGlobals({
    $: true,
    $$: true,
    Query: false
  });

  // Use $ and $$ globally
  $('selector');
  $$('selector');

```

You can also use `$.noConflict()` to restore the original values of `$` and `$$` and assign Query to a different variable:

```html

  import { exportGlobals } from 'https://unpkg.com/@semantic-ui/query';

  exportGlobals();

  const myQuery = $.noConflict();

  // Use myQuery instead of $
  myQuery('div').addClass('active');

```

## License

Query is licensed under the MIT License. See [LICENSE](LICENSE) for more information.
