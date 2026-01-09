# Nuxt UI - Tooltip Usage Patterns

## Component URL
https://ui.nuxt.com/components/tooltip
Status: ✅ Working

## Documentation Quality
**Comprehensive** - Excellent documentation with clear prop tables, interactive code examples, visual previews, positioning controls, and accessibility guidance. Strong integration examples with global configuration and keyboard shortcuts.

## Component Definition
- **Core purpose**: Displays contextual information in a small popup when users hover over or interact with an element
- **Mental model**: A floating informational popup anchored to a trigger element that appears on hover or focus, providing supplementary context without cluttering the interface
- **Semantic meaning**: Provides non-critical, supplementary information that enhances user understanding but isn't essential for task completion. Designed for brief, helpful hints rather than essential content.

## Content Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Text content | ✅ | `text` prop accepts plain string content for simple tooltips |
| HTML content | ✅ | `#content` slot allows full HTML and complex layouts |
| Icon support | ⚠️ | No dedicated icon prop; icons can be included via content slot |
| Keyboard shortcuts | ✅ | `kbds` prop renders keyboard shortcuts as styled `Kbd` components |
| Custom content | ✅ | `#content` scoped slot provides full control over tooltip markup |
| Rich content | ✅ | Slot supports any Vue component composition |

## Type Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Informational | ✅ | Default behavior for supplementary information |
| Descriptive | ✅ | Can describe UI elements or provide labels |
| Instructional | ✅ | Keyboard shortcuts display supports teaching interactions |
| Interactive | ❌ | Not designed for interactive content within tooltip |
| Error/warning | ❌ | No semantic color/state variants (single visual style) |

## State Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Open/Closed | ✅ | `v-model:open` for programmatic control, `default-open` for initial state |
| Disabled | ✅ | `disabled` prop prevents tooltip from appearing |
| Loading | ❌ | Not applicable to this component |
| Hover state | ✅ | Default trigger mechanism |
| Focus state | ✅ | Automatically triggers on keyboard focus |
| Controlled state | ✅ | Full reactive control via `v-model:open` |

## Positioning Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Side placement | ✅ | Four sides: `top`, `right`, `bottom`, `left` (via `content.side` prop) |
| Alignment control | ✅ | Three alignments: `start`, `center`, `end` (via `content.align` prop) |
| Offset control | ✅ | `sideOffset` controls distance from trigger (default: 8px) |
| Alignment offset | ✅ | `alignOffset` adjusts position along alignment axis |
| Arrow display | ✅ | `arrow` prop adds directional pointer to trigger |
| Arrow padding | ✅ | `arrowPadding` prevents arrow overflow on rounded corners |
| Collision detection | ✅ | `avoidCollisions` automatically repositions when near viewport edges |
| Collision padding | ✅ | `collisionPadding` defines safe boundaries for collision detection |
| Custom boundaries | ✅ | `collisionBoundary` accepts element(s) defining collision constraints |
| Sticky positioning | ✅ | `updatePositionStrategy` with "partial" or "always" modes |

## Trigger Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Hover | ✅ | Default trigger on mouse enter/leave |
| Focus | ✅ | Automatic keyboard focus support |
| Click | ❌ | Not supported; use Popover for click-triggered content |
| Manual/Programmatic | ✅ | Via `v-model:open` for controlled visibility |
| Keyboard shortcuts | ✅ | Integration with `defineShortcuts` composable |
| Cursor following | ✅ | Custom `reference` prop with computed `getBoundingClientRect()` |
| Touch | ⚠️ | Inherits Reka UI hover behavior (may vary by platform) |

## Timing Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Show delay | ✅ | `delay-duration` prop controls milliseconds before display (default: 200ms) |
| Hide delay | ❌ | No explicit hide delay prop; managed by underlying Reka UI |
| Instant display | ✅ | Set `delay-duration="0"` for immediate tooltips |
| Global delay config | ✅ | `App` component's `tooltip.delayDuration` sets default for all tooltips |
| Transition timing | ⚠️ | Transition styling controlled via UI customization system |

## Variation Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Size options | ❌ | No built-in size variants; controlled via UI customization |
| Color themes | ❌ | Single default appearance; no semantic color variants |
| Visual styles | ❌ | No style variants (solid/outlined/etc.) |
| Max width control | ⚠️ | Can be customized via `ui` prop styling overrides |
| Z-index control | ⚠️ | Managed by portal rendering; customizable via styling |

## Code Examples

### Basic Text Tooltip
```vue
<UTooltip text="Open on GitHub">
  <UButton label="Open" />
</UTooltip>
```

### With Keyboard Shortcuts
```vue
<UTooltip text="Open on GitHub" :kbds="['meta', 'G']">
  <UButton label="Open" />
</UTooltip>
```
Note: `meta` renders as `⌘` on macOS, `Ctrl` elsewhere.

### Custom Positioning
```vue
<UTooltip
  text="Bottom Start"
  :content="{ side: 'bottom', align: 'start', sideOffset: 12 }"
>
  <UButton label="Positioned" />
</UTooltip>
```

### With Arrow
```vue
<UTooltip text="Has arrow" :arrow="true">
  <UButton label="Hover me" />
</UTooltip>
```

### Instant Display (No Delay)
```vue
<UTooltip :delay-duration="0" text="Appears immediately">
  <UButton label="Instant" />
</UTooltip>
```

### Controlled Tooltip State
```vue
<script setup>
const isOpen = ref(false)
</script>

<template>
  <UTooltip v-model:open="isOpen" text="Controlled tooltip">
    <UButton label="Click to toggle" @click="isOpen = !isOpen" />
  </UTooltip>
</template>
```

### Custom Content via Slot
```vue
<UTooltip>
  <UButton label="Rich content" />

  <template #content>
    <div class="flex flex-col gap-2">
      <h3 class="font-semibold">Title</h3>
      <p>Complex HTML content with multiple elements</p>
    </div>
  </template>
</UTooltip>
```

### Cursor Following Tooltip
```vue
<script setup>
const position = ref({ x: 0, y: 0 })
const updatePosition = (event: MouseEvent) => {
  position.value = { x: event.clientX, y: event.clientY }
}

const virtualReference = computed(() => ({
  getBoundingClientRect: () => ({
    x: position.value.x,
    y: position.value.y,
    top: position.value.y,
    left: position.value.x,
    right: position.value.x,
    bottom: position.value.y,
    width: 0,
    height: 0
  })
}))
</script>

<template>
  <div @pointermove="updatePosition">
    <UTooltip
      :reference="virtualReference"
      :content="{ updatePositionStrategy: 'always' }"
      text="Follows cursor"
    >
      <div>Hover area</div>
    </UTooltip>
  </div>
</template>
```

### Global Configuration
```vue
<!-- app.vue -->
<template>
  <UApp :tooltip="{ delayDuration: 500 }">
    <!-- All tooltips in app inherit 500ms delay -->
    <NuxtPage />
  </UApp>
</template>
```

### With Keyboard Shortcut Integration
```vue
<script setup>
const open = ref(false)

defineShortcuts({
  meta_g: () => {
    open.value = true
    // Trigger action
  }
})
</script>

<template>
  <UTooltip
    v-model:open="open"
    text="Open on GitHub"
    :kbds="['meta', 'G']"
  >
    <UButton label="Open" />
  </UTooltip>
</template>
```

### Disabled Tooltip
```vue
<UTooltip text="Won't appear" :disabled="true">
  <UButton label="No tooltip" />
</UTooltip>
```

## Notable Features

### Keyboard Shortcut Display
Unlike most tooltip implementations, Nuxt UI provides first-class support for displaying keyboard shortcuts:
- `kbds` prop accepts array of key names
- Automatic platform-specific rendering (`meta` → `⌘` on macOS, `Ctrl` elsewhere)
- Integrates with Nuxt UI's `Kbd` component styling
- Natural pairing with `defineShortcuts` composable for functional keyboard shortcuts

### Cursor Following Capability
Advanced pattern for tooltips that track pointer position:
- Custom `reference` prop accepts computed refs with `getBoundingClientRect()` method
- `updatePositionStrategy: 'always'` ensures continuous position updates
- Enables coordinated cursor tooltips and custom positioning logic

### Global Configuration System
Centralized tooltip behavior via `App` component:
- Set default `delayDuration` for entire application
- Consistent tooltip behavior across all instances
- Override per-instance as needed
- Reduces prop repetition for common configurations

### Collision-Aware Positioning
Intelligent viewport collision handling:
- `avoidCollisions` automatically flips tooltip to remain visible
- `collisionPadding` defines safe margins from viewport edges
- `collisionBoundary` constrains positioning to specific containers
- Prevents tooltips from being cut off or hidden

### Arrow Positioning Intelligence
When `arrow` prop is enabled:
- Arrow automatically adjusts to point at trigger center
- `arrowPadding` prevents arrow from overlapping rounded corners
- Arrow styling integrated with tooltip design system

### Built on Reka UI
Component leverages Reka UI (headless component library) providing:
- Robust accessibility primitives
- Cross-browser hover/focus behavior
- Collision detection algorithms
- Consistent API patterns across Nuxt UI ecosystem

## Research Notes

### Documentation Experience
- **Excellent interactive examples**: Live code editor with real-time preview
- **Comprehensive prop tables**: Clear type information, defaults, and descriptions
- **Visual positioning controls**: Interactive demo showing all placement combinations
- **Practical use cases**: Real-world examples (keyboard shortcuts, cursor following)
- **Strong accessibility guidance**: Clear explanation of appropriate tooltip usage
- **Integration examples**: Shows composition with other Nuxt UI components

### Framework Approach Observations

1. **Vue 3 Composition API**: Heavy use of `ref`, `computed`, and composables pattern
2. **Slot-based customization**: Scoped slots for full content control
3. **Prop object nesting**: Complex configuration via nested `content` prop object
4. **Design system integration**: Tight coupling with Nuxt UI's styling system
5. **Global configuration**: App-wide defaults reduce per-component configuration
6. **Composable integration**: Natural pairing with `defineShortcuts` for keyboard UX
7. **TypeScript-first**: Strong typing for props, slots, and configuration objects

### Implementation Patterns

1. **Wrapper component architecture**: Child elements wrapped, not replaced
2. **Controlled/uncontrolled modes**: Supports both `default-open` and `v-model:open`
3. **Configuration object pattern**: `content` prop aggregates positioning/behavior config
4. **Platform-aware rendering**: Keyboard display adapts to OS (macOS vs others)
5. **Portal rendering**: Uses Reka UI's portal for proper z-index layering
6. **Virtual element support**: `reference` prop enables non-DOM positioning anchors
7. **Single content model**: One content area (no header/footer composition)

### Comparison to Other Frameworks

**Strengths**:
- Best-in-class keyboard shortcut display (unique feature)
- Sophisticated positioning with collision detection
- Excellent cursor-following pattern for advanced use cases
- Strong global configuration story
- Very comprehensive documentation with practical examples
- Clean integration with Nuxt/Vue ecosystem

**Limitations**:
- No semantic variants (info/warning/error styling)
- No built-in size variants
- Single visual style (no outlined/filled variations)
- No interactive content support (by design - use Popover instead)
- No compound component pattern (monolithic single component)
- No built-in max-width controls (requires UI customization)
- Vue-specific API (not framework-agnostic)

### Accessibility Observations

1. **Proper ARIA semantics**: Reka UI foundation ensures correct role/attributes
2. **Keyboard navigation**: Full support for focus-triggered tooltips
3. **Disabled state**: Properly prevents interaction when disabled
4. **Supplementary content philosophy**: Documentation emphasizes tooltips for non-essential info
5. **No hover-only requirement**: Works with keyboard navigation
6. **Screen reader compatible**: Content properly associated with trigger

### Performance Considerations

1. **Delay optimization**: Default 200ms delay prevents tooltip spam during rapid pointer movement
2. **Collision detection overhead**: Advanced positioning requires calculations on hover
3. **Portal rendering**: Slight overhead from portal teleportation
4. **Cursor following**: "always" update strategy can be performance-intensive
5. **Global provider**: Requires `App` component wrapper for shared context

### Migration Considerations for Semantic UI

If porting this pattern to Semantic UI:

1. **Keyboard shortcut pattern**: Highly valuable unique feature worth considering
2. **Configuration architecture**: Evaluate nested object vs flat props approach
3. **Global vs local config**: Assess value of app-wide tooltip configuration
4. **Cursor following**: Advanced feature - determine if priority for Semantic UI
5. **Collision detection**: Core feature - ensure robust viewport awareness
6. **Semantic variants**: Consider adding info/warning/error color options
7. **Framework agnostic**: Adapt Vue-specific patterns to web standards
8. **Compound components**: Evaluate if `<ui-tooltip-content>` pattern adds value
9. **Interactive tooltips**: Define boundary between tooltip and popover/dropdown
10. **Arrow customization**: Determine level of arrow styling control needed
11. **Transition control**: Consider exposing transition timing configuration
12. **Touch behavior**: Define clear mobile/touch interaction patterns

### API Design Insights

**What works well**:
- `text` prop for simple case (80% use case)
- `#content` slot for complex case (20% use case)
- `kbds` array prop (intuitive and flexible)
- `content` object aggregating positioning config (reduces prop proliferation)
- `v-model:open` for controlled state (Vue idiomatic)
- `delay-duration` as milliseconds (clear units)

**Potential improvements**:
- Consider separate show/hide delay controls
- Add max-width prop for common constraint
- Semantic color variants for consistency with other components
- Size variants for hierarchical emphasis
- Left/right content slots for complex layouts
- Built-in transition customization props

### Use Case Coverage

**Well-supported**:
- Button/icon label tooltips
- Keyboard shortcut hints
- Brief explanatory text
- Programmatic control
- Advanced positioning needs
- Custom content layouts

**Not supported**:
- Interactive content (intentional - use Popover)
- Multiple trigger types beyond hover/focus
- Semantic state indication (error/warning)
- Rich media content (technically possible but not optimized)
- Tooltip chains or sequences
- Persistent tooltips (no "pinning" mechanism)

### Design Philosophy

Nuxt UI's Tooltip embodies several clear design principles:

1. **Focused purpose**: Strictly for supplementary information, not interactive content
2. **Keyboard-first UX**: Strong emphasis on keyboard shortcuts and accessibility
3. **Smart defaults**: 200ms delay, collision detection on, center aligned
4. **Progressive enhancement**: Simple `text` prop, advanced `#content` slot
5. **Platform awareness**: Keyboard rendering adapts to user's OS
6. **Global consistency**: App-wide configuration reduces decision fatigue
7. **Composition over configuration**: Slot-based for ultimate flexibility when needed
