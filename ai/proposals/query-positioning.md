# Query Positioning Extension

> **Scope:** Modern positioning system for Shadow DOM components  
> **Status:** High complexity, significant file size impact  
> **Size Impact:** Large - complex positioning algorithms

---

## Core Positioning Method

### `position(target, options)`
Position elements relative to target with Shadow DOM and viewport awareness.

- `target` - Element | Query | selector to position relative to
- `options.placement` - String placement ('top', 'bottom', 'left', 'right', 'top-start', 'bottom-end')
- `options.boundary` - Element | 'viewport' | 'clippingAncestors' for collision detection
- `options.offset` - Number | {mainAxis, crossAxis} for positioning offset
- `options.strategy` - 'absolute' | 'fixed' positioning strategy

### `getBounds(options)`
Get comprehensive position/size data.

- `options.relative` - Element | 'viewport' | 'document' for coordinate system
- `options.includeBorder` - Boolean to include border in calculations  
- `options.includeMargin` - Boolean to include margin in calculations

**Returns:** Object with {x, y, width, height, top, left, right, bottom, viewport: {...}}

---

## Complexity Analysis

### Shadow DOM Challenges
- **Coordinate system translation** - Converting positions across shadow boundaries
- **Clipping context calculation** - Finding actual clipping ancestors across shadow roots
- **Event handling** - Positioning updates on scroll/resize across shadow contexts

### Positioning Algorithm Complexity
- **Collision detection** - Viewport and boundary collision calculations
- **Flip/shift logic** - Automatic repositioning when space is insufficient
- **Multi-axis positioning** - Handling both main and cross axis positioning
- **Scroll container handling** - Positioning within scrollable ancestors

### File Size Impact
**Conservative estimate:** 8-12KB gzipped for full implementation

**Why so large:**
- Comprehensive coordinate system math
- Shadow DOM traversal algorithms  
- Viewport intersection calculations
- Collision detection and automatic repositioning
- Cross-browser coordinate system handling

---

## Middleware vs Built-in Approach

### Option 1: Built-in Algorithms
```javascript
$('.tooltip').position(target, {
  placement: 'top',
  autoFlip: true,     // Built-in flip on collision
  autoShift: true,    // Built-in shift on collision  
  offset: 8
});
```

**Pros:** Simpler API, smaller total size for common cases  
**Cons:** Less flexible, still substantial core size

### Option 2: Middleware System (Floating UI style)
```javascript
$('.tooltip').position(target, {
  placement: 'top',
  middleware: [
    offset(8),
    flip(),
    shift(),
    arrow({ element: '.arrow' })
  ]
});
```

**Pros:** Highly flexible, tree-shakeable middleware  
**Cons:** Larger total size, more complex API

---

## Baseline 2025 Optimizations

### Available APIs
- **CSS Typed OM** - More efficient style calculations
- **Intersection Observer v2** - Better viewport detection
- **CSS Container Queries** - Size-based positioning logic
- **CSS Anchor Positioning** - Native browser positioning (limited support)

### Potential Shortcuts
```javascript
// Use modern APIs for efficient calculations
const bounds = element.getBoundingClientRect();
const computed = element.computedStyleMap();
const viewport = new IntersectionObserver(...);
```

---

## Recommendation: Plugin Architecture

Given the file size and complexity, positioning should be the flagship plugin demonstrating the plugin system:

### Benefits
1. **Optional inclusion** - Only import if needed
2. **Tree-shakeable** - Import only required positioning features
3. **Iterative development** - Easier to refine complex APIs
4. **Baseline 2025 focus** - Can use cutting-edge APIs without core compatibility concerns

### Plugin Structure
```javascript
// Core import
import { $ } from '@semantic-ui/query';

// Positioning plugin with tree-shakeable middleware
import { positioning, flip, shift, offset } from '@semantic-ui/query/plugins/positioning';

$.use(positioning);

// Usage
$('.dropdown-menu').position('.dropdown-trigger', {
  placement: 'bottom-start',
  middleware: [offset(4), flip(), shift()]
});
```

### Size Comparison
- **Core Query:** ~3KB gzipped  
- **+ Positioning Plugin:** +8-12KB gzipped
- **Total when needed:** ~11-15KB gzipped
- **Total when not needed:** ~3KB gzipped

---

## Implementation Phases

### Phase 1: Basic positioning
- Simple placement without collision detection
- Shadow DOM coordinate translation
- Viewport-relative positioning

### Phase 2: Collision handling  
- Flip and shift algorithms
- Boundary detection
- Automatic repositioning

### Phase 3: Advanced features
- Middleware system
- Animation integration
- Performance optimizations

This keeps the core lean while providing powerful positioning for complex component scenarios.