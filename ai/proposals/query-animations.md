# Query Animations Plugin - Consolidated Proposal

> **Scope:** CSS animation integration as plugin architecture demonstration  
> **Status:** Consolidated from animation proposals  
> **Approach:** Plugin-first design with progressive complexity phases

---

## Overview

This proposal consolidates CSS animation functionality into a comprehensive plugin that demonstrates the Query plugin architecture. The plugin provides intuitive animation methods while solving complex challenges around display state management, style injection, and animation completion detection.

**Plugin Pattern:** `Object.assign($.fn, { ... })` to extend Query prototype

---

## Core Animation Methods

### `show(options)`
Show elements with optional CSS animation support.

**Parameters:**
- `options.animation` - String CSS animation class or transition property
- `options.duration` - String CSS duration ('300ms', '0.3s')  
- `options.timing` - String CSS timing function ('ease', 'cubic-bezier(...)')
- `options.display` - String target display value ('block', 'flex', 'inline-block')

**Returns:** Query instance for chaining  
**Use case:** Animated reveals, modal openings, dropdown expansions

### `hide(options)`
Hide elements with optional CSS animation support.

**Parameters:**
- `options.animation` - String CSS animation class or transition property
- `options.duration` - String CSS duration  
- `options.timing` - String CSS timing function

**Returns:** Query instance for chaining  
**Use case:** Animated dismissals, modal closings, fade-outs

### `toggle(force, options)`
Toggle element visibility with animation support.

**Parameters:**
- `force` - Boolean to force show (true) or hide (false), undefined for toggle
- `options` - Same as show/hide options

**Returns:** Query instance for chaining  
**Use case:** Interactive toggles, accordion panels, dropdown menus

### `visible()`
Check if elements are currently visible (accounts for display, visibility, opacity).

**Returns:** Boolean true if any element is visible  
**Use case:** Conditional logic, state checking before animations

---

## Advanced Animation Features

### `animate(keyframes, options)`
Apply custom CSS animations with full control.

**Parameters:**
- `keyframes` - String CSS keyframes or Object with keyframe definitions
- `options.duration` - String CSS duration
- `options.timing` - String CSS timing function  
- `options.iterations` - Number | 'infinite' for repeat count
- `options.direction` - 'normal' | 'reverse' | 'alternate' | 'alternate-reverse'
- `options.fill` - 'none' | 'forwards' | 'backwards' | 'both'

**Returns:** Promise that resolves when animation completes  
**Use case:** Custom animations, complex transitions, programmatic control

### `transition(properties, options)`
Apply CSS transitions to specific properties.

**Parameters:**
- `properties` - Object with CSS properties to transition  
- `options.duration` - String CSS duration
- `options.timing` - String CSS timing function
- `options.delay` - String CSS delay

**Returns:** Promise that resolves when transition completes  
**Use case:** Property animations, smooth state changes

---

## Design Challenges & Solutions

### Display State Resolution
**Problem:** When showing `display: none` elements, what should the final display value be?

**Solution Strategy:**
1. **Store original display** - Remember pre-hide display value in data attribute
2. **Element-based heuristics** - div=block, span=inline, flex containers=flex, etc.
3. **Explicit override** - Allow `options.display` to specify target display value
4. **Computed fallback** - Use computed style analysis as last resort

### Style Injection Strategy  
**Problem:** How to inject temporary animation styles efficiently?

**Recommended Approach:**
1. **CSS class toggle** - Predefined animation classes for common animations
2. **Dynamic style injection** - Create `<style>` elements for custom animations  
3. **CSS custom properties** - Inject CSS variables for parameterized animations
4. **Cleanup management** - Automatic removal of injected styles after completion

### Animation Completion Detection
**Problem:** Reliably detecting when CSS animations finish.

**Solution Implementation:**
1. **Event listeners** - `animationend`/`transitionend` events as primary detection
2. **Timeout fallback** - `setTimeout` based on duration for event failure cases
3. **Promise-based API** - Return promises for modern async/await usage  
4. **AbortController integration** - Allow animation cancellation

---

## Implementation Phases

### Phase 1: Basic Visibility (1-2KB)
```javascript
Object.assign($.fn, {
  show(options = {}) {
    // Simple display property manipulation
    // Class-based animations only
    // Basic state storage
  },
  
  hide(options = {}) {
    // Set display: none with optional animation
    // Clean up animation classes
  },
  
  toggle(force, options = {}) {
    // Conditional show/hide logic
  },
  
  visible() {
    // Check computed display, visibility, opacity
  }
});
```

### Phase 2: CSS Animation Integration (2-3KB additional)
```javascript
Object.assign($.fn, {
  animate(keyframes, options = {}) {
    // Dynamic keyframe injection
    // Animation event handling
    // Promise-based completion
  },
  
  transition(properties, options = {}) {
    // CSS transition application
    // Property change detection
    // Transition event handling
  }
});
```

### Phase 3: Advanced Features (1-2KB additional)
- Cross-browser animation event handling
- Animation queuing and chaining  
- Performance optimizations
- Shadow DOM style injection
- Advanced display state heuristics

---

## Style Management Strategy

### Predefined Animation Classes
```css
/* Plugin provides common animation classes */
.query-fade-in { animation: queryFadeIn 300ms ease; }
.query-fade-out { animation: queryFadeOut 300ms ease; }
.query-slide-down { animation: querySlideDown 300ms ease; }
.query-slide-up { animation: querySlideUp 300ms ease; }

@keyframes queryFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes queryFadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}
```

### Dynamic Style Injection
```javascript
// For custom animations, inject styles dynamically
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes ${animationName} {
    ${keyframes}
  }
`;
document.head.appendChild(styleSheet);
```

---

## Cross-Browser Considerations

### Animation Event Names
```javascript
const animationEvents = {
  'animation': 'animationend',
  'transition': 'transitionend'
};

// Handle vendor prefixes for older browsers
const prefixes = ['webkit', 'moz', 'ms'];
```

### Fallback Strategy
- **CSS support detection** - Feature detection for animation support
- **Graceful degradation** - Immediate show/hide when animations unsupported  
- **Performance boundaries** - Disable animations on low-end devices
- **Reduced motion respect** - Honor `prefers-reduced-motion` media query

---

## Usage Examples

### Basic Animation
```javascript
// Import animations plugin
import '@semantic-ui/query/plugins/animations';

// Simple animated show/hide
$('.modal').show({ animation: 'fade-in', duration: '300ms' });
$('.modal').hide({ animation: 'fade-out', duration: '200ms' });

// Toggle with animation
$('.dropdown').toggle(undefined, { animation: 'slide-down' });
```

### Advanced Animation
```javascript
// Custom keyframe animation
$('.element').animate({
  '0%': { transform: 'scale(0.8)', opacity: 0 },
  '100%': { transform: 'scale(1)', opacity: 1 }
}, { duration: '400ms', timing: 'ease-out' });

// Property transitions
$('.button').transition(
  { backgroundColor: '#ff0000', transform: 'scale(1.1)' },
  { duration: '200ms', timing: 'ease' }
);
```

### Promise-Based Control
```javascript
// Async animation chains
async function slideShow() {
  await $('.panel-1').show({ animation: 'slide-in-left' });
  await $('.panel-2').show({ animation: 'slide-in-right' });
  await $('.panel-3').show({ animation: 'fade-in' });
}

// Animation with cleanup
$('.tooltip')
  .show({ animation: 'scale-in', duration: '150ms' })
  .then(() => console.log('Tooltip shown'))
  .catch(() => console.log('Animation cancelled'));
```

---

## Plugin Architecture Benefits

### Demonstrates Plugin System
- **Prototype extension** - Clean method addition to Query
- **Optional inclusion** - Only import when animations needed
- **Progressive enhancement** - Works without animations as fallback
- **Tree-shakeable** - Import only needed animation features

### Framework Integration
- **Modern async patterns** - Promise-based API fits modern workflows
- **Event integration** - Works with existing Query event system
- **Style isolation** - Proper cleanup prevents style conflicts
- **Performance conscious** - Efficient style injection and cleanup

---

## File Size Impact

- **Phase 1 (Basic)**: ~2KB gzipped
- **Phase 2 (CSS Integration)**: +2-3KB gzipped  
- **Phase 3 (Advanced)**: +1-2KB gzipped
- **Total full plugin**: ~5-7KB gzipped
- **Core impact**: 0KB (plugin only)

**Comparison:**
- **With plugin**: Core + 5-7KB when animations needed
- **Without plugin**: Core + 0KB when animations not needed

This provides sophisticated animation capabilities while keeping the core Query library lean and focused on essential DOM manipulation.

---

**Design Goal:** Create a comprehensive animation system that showcases the plugin architecture while solving real-world animation challenges in modern web applications.