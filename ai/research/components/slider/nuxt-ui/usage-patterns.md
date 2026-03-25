# Nuxt UI - Slider Usage Patterns

## Component URL
https://ui.nuxt.com/components/slider
Status: ✅ Working
Version: Current (Nuxt UI 3.0)
Last Verified: 2025-11-10

## Documentation Quality
Comprehensive - Includes clear prop documentation, multiple code examples, and interactive playground.

## Component Definition
- **Core purpose**: Form input component for selecting numeric values within a range, supporting both single values and multi-handle range selection.
- **Mental model**: A draggable slider control that maps visual position to numeric values, with optional visual feedback via tooltips.
- **Semantic meaning**: Represents a bounded numeric input where users can visually adjust values by dragging handles along a track.

## Pattern Support Levels
- **Native**: Dedicated prop/API
- **Composed**: Via composition/children
- **CSS-only**: Requires custom styling

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Numeric value | ✅ | Native | `v-model` binding with number or `default-value` prop |
| Range (min-max) | ✅ | Native | `v-model` with array `[start, end]`, supports multiple thumbs |
| Labels/marks | ❌ | - | Not supported |
| Tooltips on handle | ✅ | Native | `tooltip` prop (boolean or TooltipProps object) |
| Custom handle content | ❌ | - | Not documented |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Single value | ✅ | Native | `v-model="singleNumber"` or `default-value` |
| Range (dual handles) | ✅ | Native | `v-model="[25, 75]"` for two-handle range |
| Vertical orientation | ✅ | Native | `orientation="vertical"` prop |
| Reverse direction | ✅ | Native | `inverted` prop reverses visual fill direction |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Disabled | ✅ | Native | `disabled` prop prevents interaction |
| Read-only | ❌ | - | Not supported |
| Error state | ❌ | - | No dedicated error state (color variants exist) |
| Loading | ❌ | - | Not supported |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Step increments | ✅ | Native | `step` prop (default: 1) |
| Track marks | ❌ | - | Not supported |
| Color customization | ✅ | Native | 7 color variants: primary, secondary, success, info, warning, error, neutral |
| Size variants | ✅ | Native | 5 sizes: xs, sm, md (default), lg, xl |
| Track styling | ✅ | Native | Via color and size props, CSS variables for theming |

## Code Examples

### Basic Single Value
```vue
<script setup>
const value = ref(50)
</script>

<template>
  <USlider v-model="value" />
</template>
```

### Range Selection (Dual Handles)
```vue
<script setup>
const value = ref([25, 75])
</script>

<template>
  <USlider v-model="value" />
</template>
```

### Multiple Thumbs with Minimum Spacing
```vue
<script setup>
const value = ref([25, 50, 75])
</script>

<template>
  <USlider
    v-model="value"
    :min-steps-between-thumbs="10"
  />
</template>
```

### Min/Max Range Configuration
```vue
<template>
  <USlider
    :min="0"
    :max="50"
    :default-value="50"
  />
</template>
```

### Step Control
```vue
<template>
  <USlider
    :step="10"
    :default-value="50"
  />
</template>
```

### Vertical Orientation
```vue
<template>
  <USlider
    orientation="vertical"
    :default-value="50"
    class="h-48"
  />
</template>
```

### Color Variants
```vue
<template>
  <USlider color="neutral" :default-value="50" />
  <USlider color="success" :default-value="50" />
  <USlider color="error" :default-value="50" />
</template>
```

### Size Variants
```vue
<template>
  <USlider size="xs" :default-value="50" />
  <USlider size="sm" :default-value="50" />
  <USlider size="md" :default-value="50" />
  <USlider size="lg" :default-value="50" />
  <USlider size="xl" :default-value="50" />
</template>
```

### With Tooltip
```vue
<template>
  <!-- Simple boolean -->
  <USlider :default-value="50" tooltip />

  <!-- Custom tooltip configuration -->
  <USlider
    :default-value="50"
    :tooltip="{ text: 'Custom tooltip content' }"
  />
</template>
```

### Disabled State
```vue
<template>
  <USlider disabled :default-value="50" />
</template>
```

### Inverted Direction
```vue
<template>
  <USlider inverted :default-value="50" />
</template>
```

### Uncontrolled Mode
```vue
<template>
  <!-- No v-model, uses default-value -->
  <USlider :default-value="50" />
</template>
```

## Notable Features
- **Built on Reka UI Primitive**: Ensures full accessibility and keyboard support out of the box
- **Flexible Handle Count**: Supports single handle, dual handles (range), or multiple handles with configurable minimum spacing via `minStepsBetweenThumbs`
- **Tooltip Integration**: Native tooltip support with both simple boolean activation and advanced customization via TooltipProps
- **Controlled & Uncontrolled**: Supports both v-model (controlled) and default-value (uncontrolled) patterns
- **Dark Mode Support**: Color variants automatically adapt to dark mode
- **Semantic Color System**: 7 color variants align with semantic meaning (success, error, warning, etc.)
- **Comprehensive Size System**: 5 size variants from xs to xl
- **Orientation Flexibility**: Both horizontal and vertical layouts with proper CSS handling
- **Inverted Direction**: Allows reversing visual fill direction for RTL or design needs

## Research Notes
- Documentation is well-structured with interactive examples
- Component uses Reka UI as primitive foundation (similar to Radix UI pattern)
- No support for track marks/ticks (would require custom implementation)
- No built-in labels along the track (common in some slider implementations)
- Error state would need to be composed with validation logic and color prop
- Read-only state not explicitly supported (could potentially use disabled as workaround)
- Follows Vue 3 composition API patterns with `v-model` binding
- CSS customization available through theme system and CSS variables
