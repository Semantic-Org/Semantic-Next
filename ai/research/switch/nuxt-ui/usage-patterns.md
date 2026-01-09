# Nuxt UI - Switch Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://ui.nuxt.com/components/switch
Status: ✅ Working
Version: v4.1.0
Last Verified: 2025-11-05

## Documentation Quality
Good - Comprehensive props documentation, multiple code examples, clear API reference with TypeScript types, slots and events well-documented.

## Component Definition
- **Core purpose**: Provides a toggle control that switches between two boolean states (on/off, true/false) with visual feedback and optional labels/descriptions. Built on Reka UI primitives.
- **Mental model**: A digital representation of a physical toggle switch - users click or tap to flip between two states, with the thumb animating to indicate the current position.
- **Semantic meaning**: Communicates binary choice or state (enabled/disabled, on/off, active/inactive) in forms, settings panels, and preference interfaces.

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `checked={true}`)
- **Composed**: Via composition/children (e.g., `<Switch>{content}</Switch>`)
- **CSS-only**: Requires custom styling (e.g., `style={{ ... }}`)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content (labels) | ✅ | Native | `label` prop for primary label text, `description` prop for helper text |
| Icons | ✅ | Native | `checked-icon` and `unchecked-icon` props for state-specific icons, `loading-icon` for loading state |
| Loading indicator | ✅ | Native | `loading` boolean prop with customizable `loading-icon` (defaults to `i-lucide-loader-circle`) |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Checked/Unchecked | ✅ | Native | `v-model` for controlled state, `default-value` for uncontrolled initial state |
| Disabled | ✅ | Native | `disabled` boolean prop prevents interaction |
| Loading | ✅ | Native | `loading` boolean prop displays loading icon and indicates processing state |
| Read-only | ❌ | - | No explicit read-only prop documented |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅ | Native | `size` prop with values: `xs`, `sm`, `md` (default), `lg`, `xl` |
| Color options | ✅ | Native | `color` prop with values: `primary` (default), `secondary`, `success`, `info`, `warning`, `error`, `neutral` - all support light/dark theme modes |
| Label placement | ✅ | Native + Composed | Label and description rendered adjacent to switch via built-in layout; custom placement via slots |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Click to toggle | ✅ | Native | Standard click/tap interaction toggles state |
| Keyboard control | ✅ | Native | Standard toggle keyboard behavior (Space/Enter) via Reka UI foundation - not explicitly documented but expected |
| onChange handler | ✅ | Native | `@update:modelValue` event emits new boolean value, `@change` emits native change event |
| Controlled mode | ✅ | Native | `v-model` binding for reactive state management |
| Uncontrolled mode | ✅ | Native | `default-value` prop for internal state management without v-model |

## Code Examples

### Basic Usage (Controlled)
```vue
<script setup lang="ts">
const value = ref(true)
</script>

<template>
  <USwitch v-model="value" />
</template>
```
[View Live](https://ui.nuxt.com/components/switch) *(basic example)*

### Uncontrolled Mode
```vue
<template>
  <USwitch default-value />
</template>
```

### With Label
```vue
<template>
  <USwitch label="Check me" />
  <USwitch required label="Check me" />
</template>
```

### With Label and Description
```vue
<template>
  <USwitch
    label="Check me"
    description="This is a checkbox."
  />
</template>
```

### With Custom Icons
```vue
<template>
  <USwitch
    unchecked-icon="i-lucide-x"
    checked-icon="i-lucide-check"
    default-value
    label="Check me"
  />
</template>
```

### Loading State
```vue
<template>
  <USwitch loading default-value label="Check me" />
  <USwitch loading loading-icon="i-lucide-loader" default-value label="Check me" />
</template>
```

### Size Variations
```vue
<template>
  <USwitch size="xl" default-value label="Check me" />
</template>
```

### Color Variations
```vue
<template>
  <USwitch color="neutral" default-value label="Check me" />
</template>
```

### Disabled State
```vue
<template>
  <USwitch disabled label="Check me" />
</template>
```

### Form Integration
```vue
<template>
  <USwitch
    v-model="acceptTerms"
    name="terms"
    value="accepted"
    required
    label="Accept Terms and Conditions"
  />
</template>
```

## Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `boolean \| undefined` | `undefined` | Controlled value for reactive state management |
| `defaultValue` | `boolean` | - | Initial value for uncontrolled mode |
| `label` | `string` | - | Primary label text displayed next to switch |
| `description` | `string` | - | Helper/description text displayed below label |
| `color` | `'primary' \| 'secondary' \| 'success' \| 'info' \| 'warning' \| 'error' \| 'neutral'` | `'primary'` | Color scheme for the switch |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Visual size of the switch component |
| `disabled` | `boolean` | `false` | Prevents user interaction when true |
| `loading` | `boolean` | `false` | Displays loading icon and indicates processing state |
| `loadingIcon` | `string \| object` | `appConfig.ui.icons.loading` | Custom loading indicator icon |
| `checkedIcon` | `string \| object` | - | Icon displayed when switch is in checked state |
| `uncheckedIcon` | `string \| object` | - | Icon displayed when switch is in unchecked state |
| `required` | `boolean` | `false` | Adds asterisk to label, marks field as required |
| `name` | `string` | - | Form field name for submission |
| `value` | `string` | - | Form field value when checked |
| `id` | `string` | - | HTML element ID |
| `autofocus` | `boolean \| string` | - | Auto-focus on mount |
| `as` | `string` | `'div'` | Root element type |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `[value: boolean]` | Emitted when switch state changes, provides new boolean value |
| `change` | `[event: Event]` | Native change event from underlying input |

## Slots

| Slot | Props | Description |
|------|-------|-------------|
| `label` | `{ label?: string }` | Custom rendering for label content |
| `description` | `{ description?: string }` | Custom rendering for description content |

## Notable Features

### Built on Reka UI Foundation
- Component leverages Reka UI's accessible toggle primitives for keyboard navigation and ARIA attributes
- Ensures baseline accessibility compliance without additional configuration

### Icon Flexibility
- Supports three separate icon configurations (checked, unchecked, loading)
- Icons use Iconify syntax (`i-{collection}-{icon}`)
- Loading icon shows animated spinner by default

### Theme-Aware Styling
- All color variants support both light and dark mode automatically
- Theme configuration includes separate light/dark styles
- Smooth transitions between states via CSS animations

### Form Integration
- Standard HTML form attributes (`name`, `value`, `required`, `disabled`)
- Works with native form submission and validation
- Compatible with Vue form libraries

### Layout Structure
- Rendered HTML includes:
  - Root wrapper (flex container for layout)
  - Toggle base element (rounded border-based switch)
  - Animated thumb (knob that slides)
  - Optional icon wrapper
  - Label wrapper with margin spacing
  - Description text (when provided)

### Size System
- Five size options (xs, sm, md, lg, xl) affect:
  - Switch track dimensions
  - Thumb size
  - Icon size
  - Font size for labels
  - Overall spacing

### Color Semantics
- Seven color options provide semantic meaning:
  - `primary`/`secondary`: General purpose toggles
  - `success`: Positive confirmation actions
  - `info`: Informational settings
  - `warning`: Caution-required toggles
  - `error`: Destructive or dangerous options
  - `neutral`: Minimal emphasis toggles

### Accessibility Features (Inherited from Reka UI)
- Proper ARIA attributes for screen readers
- Keyboard navigation support (Space/Enter to toggle)
- Focus management and visible focus indicators
- RTL (right-to-left) layout support

## Research Notes

### Documentation Strengths
- Comprehensive props table with TypeScript types
- Multiple practical code examples covering common use cases
- Clear separation of controlled vs uncontrolled patterns
- Good coverage of visual variants (size, color, icons)
- Documented slots for customization

### Documentation Gaps
- Keyboard interaction not explicitly documented (relies on Reka UI foundation)
- No explicit read-only state support mentioned
- Limited examples of complex form integration patterns
- No examples of programmatic state management beyond basic v-model
- Accessibility features inherited from Reka UI but not detailed in Switch docs

### Implementation Observations
- Clean API design with sensible defaults
- Good separation of concerns (state, styling, content)
- Consistent naming conventions with other Nuxt UI components
- Loading state is a thoughtful addition for async operations
- Icon system integrates well with Iconify ecosystem

### Comparison Notes
- More opinionated than headless alternatives (Radix, Ark UI)
- Less compositional than some frameworks (Chakra UI's compound components)
- Strong integration with Nuxt/Vue ecosystem
- Good balance of flexibility and ease-of-use
- Theme system provides good defaults while allowing customization

---

**Research completed:** 2025-11-05
**Component:** Switch
**Framework:** Nuxt UI
**Documentation:** https://ui.nuxt.com/components/switch
**Version:** v4.1.0

**Key Takeaways:**
- Well-designed component with strong defaults and good API ergonomics
- Built on accessible Reka UI primitives ensuring baseline accessibility
- Comprehensive prop set covering most common use cases natively
- Good balance between simplicity (basic usage) and flexibility (slots, icons, loading states)
- Strong theme integration with light/dark mode support across all variants
- Form-ready with standard HTML attributes for seamless integration
