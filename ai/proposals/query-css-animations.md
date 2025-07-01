# Query CSS Animations Extension

> **Scope:** CSS-based animations and transitions integration  
> **Status:** Complex scope requiring design decisions  
> **Size Impact:** Moderate - style injection and state management logic

---

## Core Animation Methods

### `show(options)`
Show elements with CSS animation support.

- `options.animation` - String CSS animation class or transition property
- `options.duration` - String CSS duration ('300ms', '0.3s')
- `options.timing` - String CSS timing function ('ease', 'cubic-bezier(...)')
- `options.display` - String target display value ('block', 'flex', 'inline-block')

### `hide(options)`
Hide elements with CSS animation support.

- `options.animation` - String CSS animation class or transition property  
- `options.duration` - String CSS duration
- `options.timing` - String CSS timing function

### `toggle(force, options)`
Toggle visibility with animation support.

- `force` - Boolean to force show/hide, undefined for toggle
- `options` - Same as show/hide options

### `visible()`
Check if elements are visible.

**Returns:** Boolean true if any element is visible

---

## Design Challenges

### Display State Resolution
**Problem:** When showing `display: none` elements, what should the final display value be?

**Options:**
1. **Store original display** - Remember pre-hide display value
2. **Compute from CSS** - Analyze stylesheets for intended display  
3. **Default + override** - Default to 'block', allow explicit override
4. **Element-based heuristics** - div=block, span=inline, etc.

### Style Injection Strategy
**Problem:** How to inject temporary animation styles?

**Options:**
1. **Inline styles** - Direct element.style modification
2. **Style sheet injection** - Dynamic `<style>` elements  
3. **CSS class toggle** - Predefined animation classes
4. **CSS custom properties** - Inject CSS variables

### Animation Completion Detection
**Problem:** How to detect when animations finish?

**Options:**
1. **Event listeners** - animationend/transitionend events
2. **Timeout fallback** - setTimeout based on duration
3. **Promise-based** - Return promises for animation completion
4. **Callback support** - Traditional callback patterns

---

## Recommended Approach

### Phase 1: Basic Implementation
```javascript
// Simple class-based animations
$('.modal').show({ animation: 'fadeIn', duration: '300ms' });

// Implementation:
// 1. Store current display value  
// 2. Add animation class
// 3. Set display to target value
// 4. Listen for animationend
// 5. Clean up animation class
```

### Phase 2: Advanced Features  
```javascript
// Custom animations with style injection
$('.panel').show({
  animation: {
    keyframes: '0% { opacity: 0; } 100% { opacity: 1; }',
    duration: '400ms',
    timing: 'ease-out'
  },
  display: 'flex'
});
```

---

## Implementation Complexity

### High Complexity Areas
- **Cross-browser animation events** - Different event names and behaviors
- **Style cascade handling** - Ensuring animations don't conflict with existing styles  
- **Memory management** - Cleaning up injected styles and event listeners
- **Shadow DOM integration** - Style injection across shadow boundaries

### Medium Complexity Areas
- **Display state management** - Storing and restoring display values
- **Animation queuing** - Handling multiple animations on same element
- **Error handling** - Graceful degradation when animations fail

### File Size Impact
- **Estimated:** 3-5KB gzipped for full implementation
- **Core features only:** 1-2KB gzipped

---

## Alternative: Plugin Architecture First

Given the complexity, this might be better suited as the first major plugin rather than core functionality. This would:

1. **Validate plugin system** - Real-world test of plugin architecture
2. **Keep core lean** - Animations are not essential for DOM manipulation
3. **Allow experimentation** - Easier to iterate on API design
4. **Optional inclusion** - Developers import only if needed

```javascript
// As plugin
import { $ } from '@semantic-ui/query';
import { animations } from '@semantic-ui/query/plugins/animations';

$.use(animations);
$('.modal').show({ animation: 'fadeIn' });
```