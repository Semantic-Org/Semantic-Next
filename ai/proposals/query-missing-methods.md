# Query Package - Missing Methods Proposal

> **For:** Framework review and implementation planning  
> **Status:** Draft for discussion  
> **Context:** Based on analysis of existing Query implementation vs jQuery-like expectations

---

## High Priority - Modern Positioning

### `position(target, options)`
Modern positioning with Shadow DOM and viewport awareness, inspired by floating-ui.

- `target` - Element | Query | selector to position relative to
- `options.placement` - 'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'bottom-end' etc.
- `options.middleware` - Array of positioning adjustments ['flip', 'shift', 'offset', 'arrow']
- `options.boundary` - Element | 'viewport' | 'clippingAncestors' for collision detection
- `options.offset` - Number | {mainAxis, crossAxis} for positioning offset
- `options.crossShadow` - Boolean to handle shadow DOM boundary calculations

**Returns:** Query instance for chaining

### `getBounds(options)`
Get comprehensive position/size data with Shadow DOM awareness.

- `options.relative` - Element | 'viewport' | 'offset-parent' for coordinate system
- `options.includeBorder` - Boolean to include border in calculations
- `options.includeMargin` - Boolean to include margin in calculations

**Returns:** Object with {x, y, width, height, top, left, right, bottom, viewport: {...}}

---

## High Priority - Enhanced Traversal

### `parents(selector)`
Get all ancestor elements, optionally filtered by selector.

- `selector` - String CSS selector to filter ancestors (optional)

**Returns:** Query instance with ancestor elements

### `end()`
Return to the previous set of elements in the chain.

**Returns:** Query instance from prevObject or current instance

---

## High Priority - Data Attribute Helpers

### `data(key, value)`
Get/set data-* attributes with automatic type conversion.

- `key` - String attribute name (without 'data-' prefix) or Object of key-value pairs
- `value` - Any value to set (auto-stringified), undefined to get

**Returns:** Value when getting, Query instance when setting

### `data()`
Get all data-* attributes as an object.

**Returns:** Object with all data attributes (keys without 'data-' prefix)

---

## High Priority - Intuitive DOM Insertion

### `before(content)`
Insert content before each element.

- `content` - String HTML | Element | Query | Array of content to insert

**Returns:** Query instance for chaining

### `after(content)` 
Insert content after each element.

- `content` - String HTML | Element | Query | Array of content to insert

**Returns:** Query instance for chaining

---

## Medium Priority - Enhanced Dimensions

### `innerWidth(value)`
Get/set width including padding, excluding border.

- `value` - Number to set width (optional)

**Returns:** Number when getting, Query instance when setting

### `innerHeight(value)`
Get/set height including padding, excluding border.

- `value` - Number to set height (optional)

**Returns:** Number when getting, Query instance when setting

### `outerWidth(includeMargin, value)`
Get/set width including padding and border, optionally margin.

- `includeMargin` - Boolean to include margin in calculation
- `value` - Number to set width (optional)

**Returns:** Number when getting, Query instance when setting

### `outerHeight(includeMargin, value)`
Get/set height including padding and border, optionally margin.

- `includeMargin` - Boolean to include margin in calculation  
- `value` - Number to set height (optional)

**Returns:** Number when getting, Query instance when setting

---

## Medium Priority - Modern Visibility

### `show(options)`
Show elements with optional CSS animation integration.

- `options.animation` - String CSS animation name or transition
- `options.duration` - String CSS duration value  
- `options.timing` - String CSS timing function

**Returns:** Query instance for chaining

### `hide(options)`
Hide elements with optional CSS animation integration.

- `options.animation` - String CSS animation name or transition
- `options.duration` - String CSS duration value
- `options.timing` - String CSS timing function  

**Returns:** Query instance for chaining

### `toggle(force)`
Toggle element visibility.

- `force` - Boolean to force show (true) or hide (false), undefined for toggle

**Returns:** Query instance for chaining

### `visible()`
Check if elements are visible (not display:none, visibility:hidden, or 0 opacity).

**Returns:** Boolean true if any element is visible

---

## Shadow DOM Specific Enhancements

### `positionRelativeTo(target, options)`
Position elements relative to target across Shadow DOM boundaries.

- `target` - Element | Query | selector within any shadow context
- `options.placement` - String placement relative to target
- `options.boundary` - Element | 'shadow-root' | 'viewport' for boundary detection
- `options.middleware` - Array of adjustments for shadow DOM contexts

**Returns:** Query instance for chaining

### `contains(selector)`
Check if elements contain other elements, crossing shadow boundaries when using $$.

- `selector` - String | Element | Query to check containment

**Returns:** Boolean true if any element contains the target

---

## Low Priority - Array-like Operations

### `slice(start, end)`
Get subset of elements as new Query instance.

- `start` - Number starting index
- `end` - Number ending index (optional)

**Returns:** Query instance with sliced elements

### `splice(start, deleteCount, ...items)`
Modify the element collection in place.

- `start` - Number starting index
- `deleteCount` - Number of elements to remove
- `items` - Elements to insert at start position

**Returns:** Query instance with removed elements

---

## Implementation Notes

### Positioning Priority
The positioning methods (`position`, `getBounds`, `positionRelativeTo`) address the most complex challenges in modern web component environments and would provide significant value for dropdown, modal, tooltip, and overlay positioning.

### Shadow DOM Considerations
All traversal and positioning methods should be shadow DOM aware when used with `$$` prefix, maintaining the dual-mode philosophy of the Query system.

### Performance Impact
Data attribute methods and enhanced dimensions have minimal performance impact. Positioning methods require more computation but solve complex problems that would otherwise need external libraries.

### API Consistency
All methods follow existing Query patterns:
- Chainable when setting/modifying
- Return values when getting
- Accept same input types as existing methods
- Use options objects for complex configuration