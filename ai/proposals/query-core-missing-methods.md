# Query Core - Missing Methods Proposal

> **Scope:** Essential missing methods with minimal complexity  
> **Status:** Draft for implementation  
> **Size Impact:** Minimal - mostly aliases and simple logic reuse

---

## Array-like Operations

### `slice(start, end)`
Get subset of elements as new Query instance.

- `start` - Number starting index
- `end` - Number ending index (optional)

**Implementation:** Simple Array.slice() wrapper

### `splice(start, deleteCount, ...items)`
Modify the element collection in place.

- `start` - Number starting index  
- `deleteCount` - Number of elements to remove
- `items` - Elements to insert at start position

**Implementation:** Array.splice() with Query wrapping

---

## Enhanced Traversal

### `parents(selector)`
Get all ancestor elements, optionally filtered. Respects `this.options.pierceShadow`.

- `selector` - String CSS selector to filter ancestors (optional)

**Implementation:** Follow `parent()` pattern but collect all ancestors, not just immediate parent

---

## DOM Insertion Aliases

### `before(content)`
Alias for `insertBefore()` with more intuitive name.

- `content` - String HTML | Element | Query | Array of content

**Implementation:** Simple alias to existing insertBefore logic

### `after(content)`  
Alias for `insertAfter()` with more intuitive name.

- `content` - String HTML | Element | Query | Array of content

**Implementation:** Simple alias to existing insertAfter logic

---

## Enhanced Dimensions

### `width(options)` / `height(options)`
Extend existing methods with inclusion options.

- `options.includeMargin` - Boolean to include margin
- `options.includePadding` - Boolean to include padding  
- `options.includeBorder` - Boolean to include border

**Implementation:** Extend existing width/height with computed style calculations

---

## Data Attribute Helpers

### `data(key, value)`
Get/set data-* attributes with type conversion.

- `key` - String attribute name or Object of key-value pairs
- `value` - Any value to set, undefined to get

**Implementation:** Wrapper around attr() with 'data-' prefix and JSON parsing

### `data()`
Get all data-* attributes as object.

**Implementation:** Filter attributes starting with 'data-', parse values

---

## Shadow DOM Enhancements

### `contains(selector)`
Check if elements contain targets. Automatically shadow DOM aware based on `this.options.pierceShadow`.

- `selector` - String | Element | Query to check containment

**Implementation:** Use DOM `.contains()` or deep traversal based on `this.options.pierceShadow`

---

## Implementation Notes

- **File size impact:** < 2KB gzipped
- **Complexity:** Low - mostly aliases and logical extensions
- **Dependencies:** None - uses existing Query infrastructure
- **Breaking changes:** None - all additions