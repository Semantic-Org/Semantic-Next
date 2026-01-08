# Nuxt UI - Popover Usage Patterns

## Component URL
https://ui.nuxt.com/components/popover
Status: ✅ Working

## Documentation Quality
**Comprehensive** - Excellent documentation with clear prop tables, multiple interactive examples, visual previews with live code editing, and detailed positioning configuration. Strong accessibility guidance and real-world usage patterns.

## Component Definition
- **Core purpose**: Non-modal dialog that floats around a trigger element, providing contextual information or interactive content without blocking the underlying page
- **Mental model**: A lightweight overlay that appears on demand, anchored to a trigger element, allowing users to interact with additional content while maintaining awareness of the main page context
- **Semantic meaning**: Contextual information or actions that enhance but don't interrupt the primary workflow. Differs from modals by being non-blocking and from tooltips by supporting rich interactive content.

## Trigger Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Click trigger | ✅ | Default mode - opens/closes via user clicks on the trigger element |
| Hover trigger | ✅ | `mode="hover"` uses Reka UI's HoverCard with configurable `open-delay` and `close-delay` (e.g., 500ms/300ms) |
| Focus trigger | ✅ | Can be controlled via focus/blur event handlers |
| Keyboard shortcuts | ✅ | Supports keyboard toggle via `defineShortcuts` composable with `v-model:open` |
| Programmatic control | ✅ | `v-model:open` for two-way binding or `default-open` for initial state |
| Custom anchor | ✅ | `anchor` slot positions popover against custom elements (click mode only) |

## Content Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Rich content | ✅ | Default slot supports any component composition including forms, command palettes, custom UI |
| Scoped slots | ✅ | Content slot receives `close()` function prop for manual dismissal |
| Nested components | ✅ | Works with CommandPalette and other complex components |
| Custom trigger | ✅ | Default slot contains the trigger element (typically UButton) |
| Dynamic content | ✅ | Content updates with reactive Vue data |

## Positioning Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Side placement | ✅ | Four sides: `top`, `right`, `bottom` (default), `left` via `content.side` |
| Alignment | ✅ | Three alignments: `start`, `center` (default), `end` via `content.align` |
| Offset control | ✅ | `sideOffset` (default: 8px) and `alignOffset` for precise positioning |
| Collision handling | ✅ | Auto-flips via `sideFlip` and `alignFlip` based on viewport boundaries |
| Collision padding | ✅ | `collisionPadding` (default: 8px) controls boundary detection distance |
| Virtual positioning | ✅ | `reference` prop enables positioning against non-DOM elements (e.g., cursor position) |
| Anchor width matching | ✅ | CSS custom property `--reka-popper-anchor-width` for anchor-aware sizing |
| Arrow pointer | ✅ | `arrow` prop adds visual connection between trigger and content |

## Behavior Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Dismissible | ✅ | Closes on outside click or Escape key (default: true); emits `close:prevent` when disabled |
| Non-dismissible | ✅ | `dismissible="false"` requires explicit close button interaction |
| Modal mode | ✅ | `modal` prop blocks interaction with outside content when enabled |
| Auto-positioning | ✅ | Intelligently avoids viewport edges and adjusts automatically |
| Sticky behavior | ✅ | `content.sticky` keeps content visible during pointer movement |
| Update strategy | ✅ | `updatePositionStrategy: 'always'` for dynamic content repositioning |
| Escape handling | ✅ | Built-in Escape key support for keyboard dismissal |
| Focus management | ✅ | Close callbacks enable proper focus restoration |

## Interactive Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| State binding | ✅ | `v-model:open` for controlled component state |
| Initial state | ✅ | `default-open` prop for uncontrolled initial state |
| Close callback | ✅ | Content slot receives `close()` function for programmatic closing |
| Nested interactions | ✅ | Supports complex nested components like CommandPalette |
| Hover with delays | ✅ | `open-delay` and `close-delay` props for hover mode timing control |
| Cursor following | ✅ | Computed `reference` with pointer events creates cursor-tracking popover |
| Keyboard control | ✅ | Integration with `defineShortcuts` composable for keyboard shortcuts |

## Code Examples

### Basic Click Popover
```vue
<UPopover>
  <UButton label="Open" />
  <template #content>
    <Placeholder class="size-48 m-4" />
  </template>
</UPopover>
```

### Hover Mode with Delays
```vue
<UPopover mode="hover" :open-delay="500" :close-delay="300">
  <UButton label="Hover me" />
  <template #content>
    <Placeholder class="size-48" />
  </template>
</UPopover>
```

### Controlled State with Keyboard Shortcut
```vue
<script setup>
const open = ref(false);

defineShortcuts({
  meta_k: () => {
    open.value = !open.value;
  }
});
</script>

<template>
  <UPopover v-model:open="open">
    <UButton label="Toggle" />
    <template #content>
      <Placeholder class="size-48 m-4" />
    </template>
  </UPopover>
</template>
```

### Positioned Popover with Arrow
```vue
<UPopover
  :arrow="true"
  :content="{
    side: 'top',
    align: 'start',
    sideOffset: 12,
    collisionPadding: 16
  }"
>
  <UButton label="Open" />
  <template #content>
    <div class="p-4">
      <p>Content positioned on top-start with arrow</p>
    </div>
  </template>
</UPopover>
```

### Non-Dismissible Popover with Manual Close
```vue
<UPopover :dismissible="false">
  <UButton label="Open" />
  <template #content="{ close }">
    <div class="p-4">
      <p>Click outside won't close this</p>
      <UButton label="Close" @click="close" />
    </template>
  </template>
</UPopover>
```

### CommandPalette Integration
```vue
<UPopover>
  <UButton label="Select labels" />
  <template #content="{ close }">
    <UCommandPalette
      :groups="[{ key: 'labels', items: labelItems }]"
      @update:model-value="(item) => {
        handleSelection(item);
        close();
      }"
    />
  </template>
</UPopover>
```

### Cursor-Following Popover
```vue
<script setup>
const reference = ref(null);
const position = ref({ x: 0, y: 0 });

function handlePointerMove(event) {
  position.value = { x: event.clientX, y: event.clientY };
  reference.value = {
    getBoundingClientRect() {
      return {
        width: 0,
        height: 0,
        x: position.value.x,
        y: position.value.y,
        top: position.value.y,
        left: position.value.x,
        right: position.value.x,
        bottom: position.value.y,
      };
    }
  };
}
</script>

<template>
  <div @pointermove="handlePointerMove">
    <UPopover :reference="reference">
      <!-- Content follows cursor -->
      <template #content>
        <div class="p-2">Following cursor</div>
      </template>
    </UPopover>
  </div>
</template>
```

### Anchor Width Matching
```vue
<UPopover>
  <UButton label="Full width content" />
  <template #content>
    <div :style="{ width: 'var(--reka-popper-anchor-width)' }">
      <p>Content matches trigger width</p>
    </div>
  </template>
</UPopover>
```

### Modal Popover
```vue
<UPopover :modal="true">
  <UButton label="Open modal popover" />
  <template #content>
    <div class="p-4">
      <!-- Blocks interaction with page content -->
      <p>Other page elements are blocked</p>
    </div>
  </template>
</UPopover>
```

## Notable Features

### Dual Mode Architecture
Unlike many popover implementations that focus solely on click interactions, Nuxt UI provides two distinct modes:
- **Click mode**: Traditional popover with click/focus triggers
- **Hover mode**: Automatically uses Reka UI's HoverCard component with sophisticated delay timing

This dual approach elegantly handles both use cases without forcing developers to switch components.

### Advanced Positioning System
The component leverages a comprehensive positioning configuration via the `content` prop:
- **Smart collision detection**: Automatically avoids viewport edges
- **Flexible alignment**: Side and align properties with offset controls
- **Virtual positioning**: Supports non-DOM reference elements for creative implementations (cursor-following, etc.)
- **CSS integration**: Exposes anchor width as CSS custom property for responsive sizing

### Rich Interaction Model
The content slot's scoped `close()` function enables:
- Programmatic dismissal from within content
- Integration with nested interactive components
- Custom close button implementations
- Event-driven closing logic

### Accessibility Foundation
Built on Reka UI (headless component library), providing:
- Proper ARIA attributes and roles
- Keyboard navigation support (Escape key)
- Focus management and restoration
- Screen reader compatibility

### Flexible State Management
Three approaches to state control:
1. **Uncontrolled**: `default-open` prop for initial state
2. **Controlled**: `v-model:open` for full external control
3. **Hybrid**: Combine with composables like `defineShortcuts` for keyboard control

### Virtual Element Support
The `reference` prop accepts custom positioning elements, enabling:
- Cursor-following popovers
- Position-to-coordinate implementations
- Dynamic anchor point switching
- Creative spatial relationships

## Research Notes

### Documentation Experience
- **Exceptional visual examples**: Live, interactive code previews with immediate feedback
- **Comprehensive prop documentation**: Clear tables with types, defaults, and descriptions
- **Real-world scenarios**: CommandPalette integration, cursor-following, non-dismissible patterns
- **Logical organization**: Progressive complexity from basic to advanced usage
- **Strong accessibility guidance**: Explicit focus on keyboard and screen reader support

### Framework Approach Observations

1. **Vue-centric patterns**: Deep integration with Vue's reactivity (`v-model`, `ref`, computed properties)
2. **Headless UI foundation**: Reka UI provides accessible primitives, Nuxt UI adds styling and DX
3. **Tailwind-first**: All styling via utility classes, no component-specific CSS
4. **Composable integration**: Natural fit with Vue 3's Composition API and Nuxt composables
5. **Configuration over convention**: Extensive prop-based customization vs opinionated defaults

### Implementation Patterns

1. **Mode switching**: Single component handles multiple interaction patterns via `mode` prop
2. **Scoped slot API**: Content slot receives utility functions (like `close()`) for rich interactions
3. **Nested object props**: `content` prop groups related positioning configuration
4. **CSS custom properties**: Exposes internal measurements for advanced styling
5. **Reference abstraction**: Virtual element support enables creative positioning scenarios
6. **Event composition**: `close:prevent` event allows preventing default dismissal behavior

### Comparison to Other Frameworks

**Strengths**:
- Dual mode (click/hover) in single component vs separate Tooltip/Popover components
- Virtual positioning support for creative use cases
- Excellent documentation with real-world examples
- Strong accessibility baseline from Reka UI
- Sophisticated collision detection and auto-positioning
- CSS custom property exposure for advanced customization

**Limitations**:
- Vue-specific patterns limit cross-framework usage
- Nested `content` prop may feel verbose for simple cases
- Tailwind dependency for styling
- No built-in animation configuration (relies on Tailwind transitions)
- Limited content slot variants (single slot vs named slots for header/footer/etc.)

### Migration Considerations for Semantic UI

If porting this pattern to Semantic UI:

1. **Mode separation**: Consider whether click and hover should be separate components or unified like Nuxt UI
2. **Positioning API**: Evaluate prop-based vs method-based positioning configuration
3. **Virtual elements**: Assess if cursor-following and virtual anchors add sufficient value
4. **State management**: Determine if two-way binding should be primary pattern or optional
5. **Slot architecture**: Consider scoped slots vs imperative API for close callbacks
6. **Accessibility primitives**: Ensure equivalent keyboard handling and ARIA support
7. **Animation strategy**: Define how transitions/animations are configured (CSS, JS, or hybrid)
8. **Modal mode**: Evaluate necessity of blocking behavior vs always non-blocking
9. **Arrow display**: Consider if visual arrow should be built-in or separate component/feature
10. **Collision handling**: Implement similar smart positioning to avoid viewport edges

### Web Component Translation Patterns

For Semantic UI's web component approach:

1. **Props mapping**: Convert Vue props to web component attributes/properties
2. **Slots**: Standard `<slot>` for trigger, named `<slot name="content">` for body
3. **Events**: `open-change` custom event instead of `v-model:open`
4. **Close callback**: Expose via component method or event detail
5. **Positioning**: Consider data attributes vs JSON property for `content` configuration
6. **Mode switching**: Attribute-based mode switching (`mode="hover"`)
7. **Reference element**: Property-based reference with HTMLElement or virtual object support
8. **CSS integration**: Similar CSS custom property exposure for anchor measurements
