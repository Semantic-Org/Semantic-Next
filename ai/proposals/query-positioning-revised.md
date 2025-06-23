# Query Positioning System - Revised Proposal

> **Scope:** Essential positioning with Semantic UI-level collision detection  
> **Status:** Based on original SUI popup collision logic analysis  
> **Size Impact:** 4-6KB gzipped for comprehensive positioning

---

## Core Positioning API

### `position(target, options)`
Position elements relative to target with collision detection.

- `target` - Element | Query | selector to position relative to
- `options.placement` - String placement ('top', 'bottom', 'left', 'right', 'top-start', 'bottom-end', etc.)
- `options.strategy` - 'absolute' | 'fixed' positioning strategy  
- `options.offset` - Number pixel offset from target
- `options.flip` - Boolean enable collision-based position flipping
- `options.shift` - Boolean enable boundary-constrained shifting
- `options.boundary` - Element | 'viewport' for collision detection

**Returns:** Query instance for chaining

### `getBounds(options)`
Get comprehensive position/size data with coordinate system awareness.

- `options.relative` - Element | 'viewport' | 'document' for coordinate system
- `options.includeMargin` - Boolean to include margin in calculations

**Returns:** Object with {x, y, width, height, top, left, right, bottom}

---

## Three Coordinate Systems

### 1. Relative to Offset Parent (Default)
Uses Query's enhanced `offsetParent()` that accounts for CSS transforms.

```javascript
$('.tooltip').position('.trigger', {
  placement: 'top',
  // Positioned relative to true offset parent (accounts for transforms)
});
```

### 2. Relative to Specific Element  
Position relative to any element, crossing shadow DOM boundaries when using `$$`.

```javascript
$$('.dropdown-menu').position('.dropdown-trigger', {
  placement: 'bottom-start',
  flip: true  // Auto-flip if no space below
});
```

### 3. Absolute to Viewport
Position relative to viewport top-left, accounting for scroll.

```javascript
$('.modal').position('viewport', {
  placement: 'center',
  strategy: 'fixed'  // Fixed positioning for overlays
});
```

---

## Collision Detection (Based on Original SUI Logic)

### Systematic Position Trying
```javascript
// Try preferred position → check fit → try next logical position → repeat
const positionStrategies = {
  'opposite': ['top' → 'bottom', 'left' → 'right'],
  'adjacent': ['top-start' → 'top-center' → 'top-end'] 
};
```

### Boundary Collision Check
```javascript
// Calculate distance from viewport/boundary edges
const distanceFromBoundary = {
  top: offset.top - boundary.top,
  bottom: boundary.bottom - (offset.top + popup.height),
  left: offset.left - boundary.left,  
  right: boundary.right - (offset.left + popup.width)
};

// Check if offstage (with jitter tolerance)
const isOffstage = Object.values(distanceFromBoundary).some(distance => distance < -jitter);
```

### Fallback Position Chain
```javascript
const fallbackChain = {
  'top-start': ['top-center', 'top-end', 'bottom-start', 'left-center', 'right-center'],
  'bottom-start': ['bottom-center', 'bottom-end', 'top-start', 'left-center'],
  // ... systematic fallback for all positions
};
```

---

## Essential Features

### RTL Layout Support
```javascript
// Automatic position flipping for right-to-left layouts
if (isRTL) {
  placement = placement.replace(/left|right/g, match => 
    match === 'left' ? 'right' : 'left'
  );
}
```

### Smart Arrow Positioning  
```javascript
// Adjust offset for small targets to center arrows
if (target.width <= arrowSize * 2) {
  offset += target.width / 2 - arrowOffset;
}
```

### Multiple Placement Options
- **Basic:** 'top', 'bottom', 'left', 'right'
- **Aligned:** 'top-start', 'top-center', 'top-end'  
- **Centered:** 'center' (for modals)

---

## Implementation Strategy

### Phase 1: Core Positioning (2-3KB)
- Three coordinate systems
- Basic placement without collision detection
- Shadow DOM coordinate translation

### Phase 2: Collision Detection (2-3KB additional)  
- Boundary checking and `isOffstage()` logic
- Position flipping strategies ('opposite', 'adjacent')
- Systematic fallback chain

### Phase 3: Advanced Features (1KB additional)
- RTL layout support  
- Arrow positioning adjustments
- Performance optimizations

---

## Based on Proven SUI Logic

The collision detection is based on the original Semantic UI popup positioning system, which has been battle-tested across thousands of implementations. Key advantages:

1. **Proven approach** - Logic from production SUI popup component
2. **Right complexity level** - Essential collision handling without over-engineering  
3. **Systematic fallbacks** - Predictable position trying with clear fallback chains
4. **Boundary awareness** - Proper viewport and container boundary detection
5. **Performance focused** - Efficient collision detection with jitter tolerance

This provides the positioning capabilities that Semantic UI components actually need, without the complexity of full-featured positioning libraries.

---

## Usage Examples

### Dropdown with Collision Detection
```javascript
$$('.dropdown-menu').position('.trigger', {
  placement: 'bottom-start',
  flip: true,        // Flip to top if no space below
  shift: true,       // Shift horizontally to stay in bounds
  boundary: 'viewport'
});
```

### Tooltip with Multiple Fallbacks
```javascript
$('.tooltip').position('.target', {
  placement: 'top',
  flip: true,
  offset: 8,
  // Will try: top → bottom → left → right → center
});
```

### Modal Centering
```javascript  
$('.modal').position('viewport', {
  placement: 'center',
  strategy: 'fixed',
  boundary: 'viewport'
});
```

This strikes the right balance between functionality and complexity, providing essential positioning with proven collision detection logic.