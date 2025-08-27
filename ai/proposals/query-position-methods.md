# Query Position Methods Implementation

## Overview
Implement `pagePosition()` and `containerPosition()` methods for Query class to provide modern DOM positioning capabilities that replace legacy jQuery `offset()` and `position()` methods with semantic naming and enhanced functionality.

These methods serve different mental models:
- **`pagePosition()`**: Positioning relative to the document/page (modals, tooltips, drag & drop)
- **`containerPosition()`**: Positioning relative to containers (component layouts, relative movements)

## Method Signatures

### pagePosition(coordinates)
Gets or sets element position relative to the document.

**Getter**: `pagePosition()` or `pagePosition(settings)`
**Setter**: `pagePosition({ top, left })` or `pagePosition({ top, left, ...settings })`

### containerPosition(containerOrCoordinates, coordinates) 
Gets or sets element position relative to a containing element.

**Getter**: `containerPosition()`, `containerPosition(container)`, or `containerPosition(settings)`
**Setter**: `containerPosition({ top, left })`, `containerPosition(container, { top, left })`, or `containerPosition({ top, left, container, ...settings })`

## Settings Object

Both methods support these settings:
- `container` (containerPosition only) - Element to position relative to. Defaults to `this.containingParent()` result
- `includeMargin: false` - Include element's margin in calculation
- `includePadding: false` - Include container's padding in calculation  
- `includeScrollOffset: true` - Account for container's scroll position
- `includeBorder: false` - Include container's border in calculation
- `precision: 'pixel'` - Return 'pixel' (rounded) or 'subpixel' (decimal) values

## Parameter Overloading

### pagePosition()
- `pagePosition()` - Get position with defaults
- `pagePosition(settings)` - Get position with settings object
- `pagePosition({ top, left })` - Set position (top/left indicate setter mode)
- `pagePosition({ top, left, ...settings })` - Set position with settings

### containerPosition()  
- `containerPosition()` - Get position relative to containingParent()
- `containerPosition(container)` - Get position relative to specified container (string/element/Query)
- `containerPosition(settings)` - Get position with settings object (must not have top/left properties)
- `containerPosition({ top, left })` - Set position relative to containingParent() 
- `containerPosition(container, { top, left })` - Set position relative to specified container
- `containerPosition({ top, left, container, ...settings })` - Set position with all settings

## Implementation Requirements

### Core Logic
Use `getBoundingClientRect()` as foundation for all calculations to properly handle transforms, scaling, and modern CSS positioning contexts.

### pagePosition() Implementation
**Getter**:
```javascript
const rect = element.getBoundingClientRect();
const top = rect.top + window.scrollY;
const left = rect.left + window.scrollX;
// Apply settings adjustments for margin, precision, etc.
```

**Setter**:
```javascript
const currentPos = element.pagePosition();
const deltaTop = newTop - currentPos.top;
const deltaLeft = newLeft - currentPos.left;
// Apply via top/left CSS properties ONLY - do not use transform: translate()
// as it creates new stacking contexts and causes text antialiasing issues
element.style.top = newTop + 'px';
element.style.left = newLeft + 'px';
```

### containerPosition() Implementation  
**Getter**:
```javascript
const elementRect = element.getBoundingClientRect();
const containerRect = containerElement.getBoundingClientRect();
let top = elementRect.top - containerRect.top;
let left = elementRect.left - containerRect.left;
// Apply settings adjustments
```

**Setter**: Calculate delta and apply via CSS top/left properties (never transform: translate())

### Return Values
- **Single element**: `{ top: number, left: number }`
- **Multiple elements**: `[{ top: number, left: number }, ...]`
- **Empty selection**: `undefined`
- **Setter**: Return Query instance for chaining

### Settings Processing
- Handle margin calculations using `getComputedStyle()`
- Handle padding/border using container's computed style
- Handle scroll offset using container's `scrollTop`/`scrollLeft`
- Handle precision by using `Math.round()` for 'pixel' mode

### Error Handling
- Invalid container selectors should not match anything (return containingParent())
- Invalid coordinates should be ignored
- Cross-origin issues with getBoundingClientRect() should degrade gracefully

### Integration
- Use existing `containingParent()` method for default container detection
- Follow existing Query getter/setter patterns (like `width()`, `height()`, `css()`, `attr()`)
- Parameter overloading should detect setter mode by presence of `top`/`left` properties
- Use existing utility functions from `@semantic-ui/utils` where applicable
- Maintain consistency with existing dimension methods

### Overloading Detection
Both methods detect setter mode when first parameter (or appropriate parameter) contains `top` and/or `left` properties:
```javascript
// Getters
pagePosition()
pagePosition({ precision: 'subpixel' })
containerPosition()
containerPosition('.modal')

// Setters (detected by top/left presence)
pagePosition({ top: 100, left: 50 })
containerPosition({ top: 100, left: 50 })  // relative to containingParent()
containerPosition('.modal', { top: 100, left: 50 })
```

## Testing Requirements
- Test parameter overloading for both methods
- Test with transforms, scaling, rotation
- Test with nested containers and scroll positions  
- Test with Shadow DOM if `pierceShadow` enabled
- Test setter functionality with various positioning modes
- Test all settings combinations
- Test edge cases (empty selections, invalid containers)

## Documentation Requirements
- Add to visibility.mdx documentation page
- Include examples showing parameter overloading
- Explain relationship to containingParent()
- Show comparison with legacy offset()/position() methods
- Document performance characteristics
- Include playground examples demonstrating positioning scenarios

## File Locations
- Implementation: `/packages/query/src/query.js`
- Tests: `/packages/query/test/dom/positioning.test.js` (new file)
- Types: `/packages/query/types/query.d.ts`
- Docs: `/docs/src/pages/api/query/visibility.mdx`
- Examples: `/docs/src/examples/query-positioning-*/*.{html,js,css}` (new directories)