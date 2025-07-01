# Query Core Methods - Consolidated Proposal

> **Scope:** Essential methods for core Query functionality  
> **Status:** Consolidated from multiple proposals  
> **Size Impact:** Minimal (<2KB total gzipped)

---

## Overview

This document consolidates essential missing methods for the Query library that provide fundamental DOM manipulation capabilities with minimal complexity and file size impact. All methods maintain consistency with existing Query patterns and Shadow DOM awareness.

---

## Enhanced Traversal

### `closestAll(selector)`
Get all ancestor elements that match the selector, traversing up the entire DOM tree.

- `selector` - String CSS selector to match ancestors

**Implementation:** Walk up DOM tree from each element, collecting all ancestors that match selector  
**Returns:** Query instance with matching ancestor elements


---

## DOM Insertion Aliases

### `before(content)`
Insert content before each element. Alias for `insertBefore()` with more intuitive name.

- `content` - String HTML | Element | Query | Array of content

**Implementation:** Simple alias to existing insertBefore logic  
**Returns:** Query instance for chaining

### `after(content)`
Insert content after each element. Alias for `insertAfter()` with more intuitive name.

- `content` - String HTML | Element | Query | Array of content

**Implementation:** Simple alias to existing insertAfter logic  
**Returns:** Query instance for chaining

---

## Enhanced Dimensions

### `innerWidth(value)` / `innerHeight(value)`
Get/set width/height including padding, excluding border.

- `value` - Number to set width/height (optional)

**Implementation:** Use clientWidth/clientHeight for getting, adjust existing width/height logic for setting  
**Returns:** Number when getting, Query instance when setting

### `outerWidth(includeMargin, value)` / `outerHeight(includeMargin, value)`
Get/set width/height including padding and border, optionally margin.

- `includeMargin` - Boolean to include margin in calculation
- `value` - Number to set width/height (optional)

**Implementation:** Use offsetWidth/offsetHeight + computed margin when needed  
**Returns:** Number when getting, Query instance when setting

### Enhanced `width(options)` / `height(options)`
Extend existing methods with inclusion options.

- `options.includeMargin` - Boolean to include margin
- `options.includePadding` - Boolean to include padding  
- `options.includeBorder` - Boolean to include border

**Implementation:** Extend existing width/height with computed style calculations  
**Returns:** Number when getting, Query instance when setting

---

## Shadow DOM Enhancements

### `contains(selector)`
Check if elements contain targets. Automatically Shadow DOM aware based on `this.options.pierceShadow`.

- `selector` - String | Element | Query to check containment

**Implementation:** Use DOM `.contains()` or deep traversal based on `this.options.pierceShadow`  
**Returns:** Boolean true if any element contains the target
