# Nuxt UI - Number Input Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://ui.nuxt.com/docs/components/input-number
Status: ✅ Working
Version: v4.1.0 (official release v4.0.0)
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - Well-documented with extensive props, examples, and integration patterns

## Component Definition
- **Core purpose**: Provide a user-friendly input field for numerical values with stepper controls and range validation
- **Mental model**: A specialized text input that only accepts numbers, with built-in increment/decrement buttons and value constraints
- **Semantic meaning**: An interactive numeric data entry control that enforces value bounds and formatting rules

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `min={10}`)
- **Composed**: Via composition/children (e.g., `<InputNumber><template #increment>...</template></InputNumber>`)
- **CSS-only**: Requires custom styling (e.g., `class="custom-style"`)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Numeric value display | ✅ | Native | `v-model` binding, `default-value` prop |
| Formatting (currency, percent) | ✅ | Native | `format-options` prop using `@internationalized/number` - supports currency, percentage, decimal precision, sign display |
| Prefix/suffix support | ❌ | - | Not natively supported |
| Custom formatting | ✅ | Native | Via `format-options` with full Intl.NumberFormat API support including locale-specific formatting |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Integer input | ✅ | Native | Default behavior with `step={1}` |
| Decimal/float input | ✅ | Native | `format-options="{ minimumFractionDigits: 2, maximumFractionDigits: 2 }"` |
| Currency input | ✅ | Native | `format-options="{ style: 'currency', currency: 'EUR', currencyDisplay: 'code' }"` |
| Percentage input | ✅ | Native | `format-options="{ style: 'percent' }"` - values treated as decimals (0.05 = 5%) |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Disabled | ✅ | Native | `disabled` prop - disables both input and stepper buttons |
| Read-only | ⚠️ | Partial | Not explicitly documented, likely input-level only |
| Loading | ❌ | - | Not documented |
| Error state | ✅ | Composed | Via `UFormField` component integration for validation display |
| Focus state | ✅ | Native | `color` prop controls ring color on focus, `highlight` prop emphasizes it |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅ | Native | `size` prop: 'xs', 'sm', 'md' (default), 'lg', 'xl' |
| Min/max values | ✅ | Native | `min` and `max` props for value constraints |
| Step increment | ✅ | Native | `step` prop (default: 1) controls increment/decrement amount |
| Precision control | ✅ | Native | `format-options="{ minimumFractionDigits: n, maximumFractionDigits: n }"` |
| Stepper controls | ✅ | Native + Composed | `increment` and `decrement` props (boolean or Button config), customizable via slots |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Keyboard input | ✅ | Native | Arrow Up/Down keys increment/decrement value |
| Mouse wheel | ⚠️ | Unknown | Not explicitly documented |
| Stepper buttons | ✅ | Native + Composed | `increment-icon` and `decrement-icon` props, customizable via `#increment` and `#decrement` slots |
| Keyboard shortcuts | ✅ | Native | Arrow Up/Down for incrementing/decrementing |

## Code Examples
```vue
<!-- Basic usage -->
<template>
  <UInputNumber v-model="value" />
</template>

<script setup lang="ts">
const value = ref(10)
</script>

<!-- With min/max/step -->
<template>
  <UInputNumber
    v-model="value"
    :min="0"
    :max="100"
    :step="5"
  />
</template>

<!-- Currency formatting -->
<template>
  <UInputNumber
    v-model="price"
    :format-options="{
      style: 'currency',
      currency: 'EUR',
      currencyDisplay: 'code'
    }"
  />
</template>

<!-- Percentage formatting -->
<template>
  <UInputNumber
    v-model="rate"
    :format-options="{ style: 'percent' }"
  />
</template>

<!-- Decimal precision -->
<template>
  <UInputNumber
    v-model="value"
    :format-options="{
      minimumFractionDigits: 2,
      maximumFractionDigits: 4
    }"
  />
</template>

<!-- Custom stepper buttons -->
<template>
  <UInputNumber v-model="value">
    <template #increment>
      <UButton icon="i-lucide-chevron-up" />
    </template>
    <template #decrement>
      <UButton icon="i-lucide-chevron-down" />
    </template>
  </UInputNumber>
</template>

<!-- Vertical orientation -->
<template>
  <UInputNumber
    v-model="value"
    orientation="vertical"
  />
</template>

<!-- Within FormField for validation -->
<template>
  <UFormField
    label="Age"
    description="Your age in years"
    :error="error"
  >
    <UInputNumber
      v-model="age"
      :min="0"
      :max="120"
    />
  </UFormField>
</template>

<!-- Custom button styling -->
<template>
  <UInputNumber
    v-model="value"
    :increment="{ color: 'neutral', variant: 'solid', size: 'xs' }"
    :decrement="{ color: 'neutral', variant: 'solid', size: 'xs' }"
  />
</template>

<!-- Disabled state -->
<template>
  <UInputNumber
    v-model="value"
    disabled
  />
</template>

<!-- Size variations -->
<template>
  <UInputNumber v-model="value" size="xs" />
  <UInputNumber v-model="value" size="sm" />
  <UInputNumber v-model="value" size="md" />
  <UInputNumber v-model="value" size="lg" />
  <UInputNumber v-model="value" size="xl" />
</template>

<!-- Visual variants -->
<template>
  <UInputNumber v-model="value" variant="outline" />
  <UInputNumber v-model="value" variant="soft" />
  <UInputNumber v-model="value" variant="subtle" />
  <UInputNumber v-model="value" variant="ghost" />
  <UInputNumber v-model="value" variant="none" />
</template>
```
[View Live](https://ui.nuxt.com/docs/components/input-number)

## Notable Features
- **Built on Reka UI NumberField**: Uses a well-tested accessibility-focused primitive component
- **Internationalization support**: Leverages `@internationalized/number` for locale-aware formatting and parsing
- **Hybrid button configuration**: Stepper buttons can be controlled via boolean props OR detailed Button config objects
- **Slot-based customization**: Full control over increment/decrement button rendering via template slots
- **FormField integration**: Seamlessly integrates with Nuxt UI's form system for labels, help text, and validation
- **Dual orientation**: Supports both horizontal (default) and vertical button layouts
- **Color inheritance**: Button color inherits from the input's color prop for consistent theming
- **Visual variants**: Five different visual styles (outline, soft, subtle, ghost, none) for different UI contexts
- **Comprehensive size system**: Five size options covering compact to large use cases

## Research Notes
- The component is part of Nuxt UI v4, which represents a major update to the framework
- Documentation is thorough with clear prop tables, multiple examples, and integration guidance
- Built on solid foundation (Reka UI) ensuring accessibility compliance
- No explicit support for mouse wheel interaction documented
- No native prefix/suffix support (would need to be implemented via custom composition or wrapper)
- Read-only mode not explicitly documented, though likely possible at the input level
- Loading state not built-in, would need custom implementation
- Currency and percentage formatting are first-class features, not afterthoughts
- The use of `@internationalized/number` is a sophisticated choice that handles locale-specific number formats, making it suitable for international applications
- Stepper control customization is particularly flexible, supporting both simple enable/disable and full Button component configuration
