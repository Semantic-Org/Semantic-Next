# Query Positioning System - Consolidated Proposal

> **Scope:** Core positioning primitives + advanced positioning plugin  
> **Status:** Consolidated from multiple positioning proposals  
> **Approach:** Simple core methods + general-purpose plugin utilities

---

## Overview

This proposal splits positioning functionality into two tiers:
1. **Core Query class methods** - Essential positioning primitives that belong in core
2. **Positioning plugin** - Advanced utilities for complex relative positioning scenarios

The plugin focuses on general-purpose utilities (similar to Floating UI approach) rather than recreating legacy implementations.

---

## Core Query Class Additions

### `offset()`
Get position relative to document (page 0,0 coordinate system).

**Implementation:** `getBoundingClientRect()` with scroll offset adjustment  
**Returns:** `{top, left, width, height}` relative to document  
**Use case:** Absolute positioning, viewport calculations

### `position()`  
Get position relative to containing parent (uses existing `containingParent()` logic).

**Implementation:** Element bounds minus containing parent bounds  
**Returns:** `{top, left, width, height}` relative to offset parent  
**Use case:** Relative positioning within layouts

### `before(content)`
Insert content before each element. Simple alias for `insertBefore()` with intuitive parameter order.

**Implementation:** `insertBefore()` wrapper with reversed parameters  
**Returns:** Query instance for chaining

### `after(content)`
Insert content after each element. Simple alias for `insertAfter()` with intuitive parameter order.

**Implementation:** `insertAfter()` wrapper with reversed parameters  
**Returns:** Query instance for chaining

---

## Positioning Plugin

**Plugin Pattern:** `Object.assign($.fn, { ... })` to extend Query prototype

### `positionRelativeTo(target, options)`
Position elements relative to any target element with collision detection and placement options.

**Parameters:**
- `target` - Element | Query | selector to position relative to
- `options.placement` - String placement ('top', 'bottom', 'left', 'right', 'top-start', 'bottom-end', etc.)
- `options.strategy` - 'absolute' | 'fixed' positioning strategy
- `options.offset` - Number | {mainAxis, crossAxis} for positioning offset
- `options.flip` - Boolean to enable collision-based position flipping
- `options.shift` - Boolean to enable boundary-constrained shifting
- `options.boundary` - Element | 'viewport' for collision detection

**Returns:** Query instance for chaining  
**Use case:** Dropdown menus, tooltips, popovers, modals

### `getRelativeBounds(relativeToElement, options)`
Get comprehensive bounds data in the coordinate system of another element.

**Parameters:**
- `relativeToElement` - Element | 'viewport' | 'document' for coordinate system
- `options.includeMargin` - Boolean to include margin in calculations
- `options.includeBorder` - Boolean to include border in calculations

**Returns:** Object with `{x, y, width, height, top, left, right, bottom}`  
**Use case:** Custom positioning calculations, collision detection

### `translateCoordinates(fromElement, toElement, point)`
Translate coordinates between different elements' coordinate systems (Shadow DOM aware).

**Parameters:**
- `fromElement` - Element defining source coordinate system
- `toElement` - Element defining target coordinate system  
- `point` - Object with `{x, y}` coordinates to translate

**Returns:** Object with `{x, y}` in target coordinate system  
**Use case:** Cross-shadow positioning, coordinate system conversions

---

## Advanced Plugin Features

### Collision Detection
- **Boundary detection** - Viewport and element boundary checking
- **Automatic flipping** - Smart fallback positioning when space insufficient
- **Shifting** - Adjust position to stay within boundaries
- **Jitter tolerance** - Small positioning adjustments for edge cases

### Shadow DOM Integration  
- **Coordinate translation** - Handle positioning across shadow boundaries
- **Boundary traversal** - Find containing blocks across shadow roots
- **Event compatibility** - Work with composed event paths

### Placement System
- **Basic placements**: 'top', 'bottom', 'left', 'right'
- **Aligned placements**: 'top-start', 'top-center', 'top-end'
- **Complex placements**: Support for 12+ placement variations
- **RTL support** - Automatic position mirroring for right-to-left layouts

---

## Implementation Strategy

### Core Methods (Immediate)
- Add `offset()`, `position()`, `before()`, `after()` to Query class
- Leverage existing `containingParent()` implementation
- ~0.5KB addition to core bundle

### Plugin Development (Phased)
1. **Phase 1**: Basic relative positioning without collision detection (~2KB)
2. **Phase 2**: Collision detection and automatic flipping (~2KB additional)  
3. **Phase 3**: Advanced features (RTL, Shadow DOM enhancements) (~1KB additional)

### Design Principles
- **General-purpose utilities** - Not tied to specific component implementations
- **Composable functions** - Each method solves a specific positioning problem
- **Framework agnostic** - Utilities work for any positioning scenario
- **Shadow DOM first** - Designed for modern web component environments

---

## Usage Examples

### Core Positioning
```javascript
// Get document-relative position
const docPosition = $('.tooltip').offset();

// Get parent-relative position  
const relativePosition = $('.tooltip').position();

// Simple content insertion
$('.container').before('<div>New content</div>');
$('.container').after('<div>More content</div>');
```

### Plugin Positioning
```javascript
// Import positioning plugin
import '@semantic-ui/query/plugins/positioning';

// Position dropdown relative to trigger
$('.dropdown-menu').positionRelativeTo('.dropdown-trigger', {
  placement: 'bottom-start',
  flip: true,
  boundary: 'viewport'
});

// Get bounds in viewport coordinate system
const bounds = $('.element').getRelativeBounds('viewport');

// Translate coordinates between elements
const translated = $('.source').translateCoordinates(sourceEl, targetEl, {x: 10, y: 20});
```

---

## File Size Impact

- **Core additions**: ~0.5KB gzipped (simple positioning primitives)
- **Complete plugin**: ~5KB gzipped (full positioning system)
- **Total when needed**: ~5.5KB gzipped additional
- **Total when not needed**: ~0.5KB gzipped additional

This provides essential positioning in core while keeping advanced features optional through the plugin system.

---

**Design Goal:** Provide the positioning capabilities that modern web components actually need, with a clear separation between essential core functionality and advanced optional features.