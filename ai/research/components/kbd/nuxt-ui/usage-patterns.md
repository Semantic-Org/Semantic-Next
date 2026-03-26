# Nuxt UI - Kbd Usage Patterns

## Component URL
https://ui.nuxt.com/components/kbd
Status: ✅ Working
Version: v4.1.0
Last Verified: 2025-11-05

## Documentation Quality
Good - Clear documentation with multiple examples, comprehensive prop table, variant showcase, and platform-aware features explained.

## Component Definition
- **Core purpose**: Display keyboard keys and shortcuts in a semantic, visually consistent way across the interface
- **Mental model**: A styled `<kbd>` HTML element representing physical keyboard input, with platform-aware special key rendering
- **Semantic meaning**: Communicates "this is a keyboard key or shortcut" to both users and assistive technologies

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `value="K"`, `size="lg"`, `color="primary"`)
- **Composed**: Via composition/children (e.g., `<UKbd>K</UKbd>`)
- **CSS-only**: Requires custom styling (e.g., `class="font-bold rounded-full"`)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content | ✅ | Composed & Native | Default slot accepts any content; `value` prop for string keys |
| Single character | ✅ | Composed & Native | Primary use case - single letter/number keys |
| Special key names | ✅ | Native | `value="meta"` maps to ⌘ (macOS) or Ctrl (other platforms) |
| Multi-character text | ✅ | Composed & Native | Supports words like "Shift", "Enter", "Esc" |
| Custom content | ✅ | Composed | Slot accepts any content including HTML |
| Icon support | ❌ | - | Not mentioned in documentation |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Single key | ✅ | Native | Default usage pattern |
| Platform-aware keys | ✅ | Native | `meta` key adapts to platform (⌘ on macOS, Ctrl elsewhere) |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Loading | ❌ | - | Not documented |
| Disabled | ❌ | - | Not documented |
| Active/pressed | ❌ | - | Not documented |
| Focused | ❌ | - | Not documented |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅ | Native | `sm`, `md`, `lg` with height 4/5/6, min-width 16/20/24px, text 10/11/12px |
| Color options | ✅ | Native | `primary`, `secondary`, `success`, `info`, `warning`, `error`, `neutral` |
| Visual styles | ✅ | Native | `outline`, `soft`, `subtle`, `solid` variants |
| Spacing control | ✅ | CSS-only | Horizontal padding via custom classes |
| Border radius | ✅ | CSS-only | Default 4px, customizable via class |
| Font customization | ✅ | CSS-only | Default medium weight sans-serif, uppercase transform |
| Custom styling | ✅ | CSS-only | Supports arbitrary Tailwind classes |

## Code Examples

### Basic Usage (Slot-based)
```vue
<template>
  <UKbd>K</UKbd>
</template>
```

### Value Prop
```vue
<template>
  <UKbd value="K" />
</template>
```

### Platform-Aware Special Key
```vue
<template>
  <UKbd value="meta" />
</template>
```
**Result**: Displays ⌘ on macOS, Ctrl on Windows/Linux

### Styled Variant
```vue
<template>
  <UKbd color="neutral" variant="solid">K</UKbd>
</template>
```

### Size Variant
```vue
<template>
  <UKbd size="lg">K</UKbd>
</template>
```

### Custom Styling
```vue
<template>
  <UKbd class="font-bold rounded-full" variant="subtle">K</UKbd>
</template>
```

### Keyboard Shortcut Pattern (Implied)
```vue
<template>
  <!-- Common pattern for displaying shortcuts -->
  <div class="flex items-center gap-1">
    <UKbd value="meta" />
    <span>+</span>
    <UKbd>K</UKbd>
  </div>
</template>
```

[View Live](https://ui.nuxt.com/components/kbd)

## Props/API Documentation

### Core Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `as` | `any` | `'kbd'` | Render element or component type |
| `value` | `string` | `undefined` | Key to display (supports special key names) |

### Styling Props

| Prop | Type | Default | Options | Description |
|------|------|---------|---------|-------------|
| `color` | `string` | `'neutral'` | `primary`, `secondary`, `success`, `info`, `warning`, `error`, `neutral` | Color theme |
| `variant` | `string` | `'outline'` | `outline`, `soft`, `subtle`, `solid` | Visual style treatment |
| `size` | `string` | `'md'` | `sm`, `md`, `lg` | Component dimensions |

### Slots

| Slot | Description |
|------|-------------|
| default | Content to display inside the kbd element (alternative to `value` prop) |

## Composition Patterns

### Content Model
- **Dual content API**: Supports both `value` prop and default slot
- **Slot precedence**: When both provided, slot content takes precedence over `value` prop
- **Inline-flex layout**: Centered content with horizontal padding
- **Text transformation**: Uppercase by default

### Layout Integration
- **Inline display**: Works naturally in text flows
- **Flex-friendly**: Can be composed with other flex items for shortcut combinations
- **Gap control**: No built-in gap between multiple kbd elements (requires parent flex container)

## Styling Approaches

### Variant System
Component uses a compound variant system combining `color` and `variant`:

- **outline**: Border with transparent background
- **soft**: Light colored background with colored text
- **subtle**: Very light background
- **solid**: Solid colored background with contrasting text

### Size System
Three distinct size tiers with coordinated properties:
- **sm**: Compact (h-4, min-w-16px, text-10px)
- **md**: Default (h-5, min-w-20px, text-11px)
- **lg**: Large (h-6, min-w-24px, text-12px)

### Customization Approach
- Built on Tailwind CSS
- Accepts arbitrary utility classes via `class` prop
- Default styles can be overridden with custom classes
- Rounded corners default to 4px

## Accessibility Patterns

### Semantic HTML
- Uses semantic `<kbd>` element by default
- Provides proper semantic meaning to screen readers
- Can be customized via `as` prop if different element needed

### Platform Awareness
- `meta` key automatically adapts to user's platform
- Displays ⌘ on macOS for native feel
- Displays Ctrl on Windows/Linux for consistency
- Improves user comprehension without manual detection

### Visual Clarity
- Multiple variant combinations ensure sufficient contrast
- Text uppercase transformation improves readability
- Consistent sizing maintains visual rhythm

## Notable Features

### Intelligent Platform Detection
The component's standout feature is platform-aware key rendering. The `value="meta"` prop automatically displays the correct modifier key symbol based on the user's operating system, eliminating the need for manual platform detection in application code.

### Flexible Content Model
Supports two content patterns:
1. **Value prop**: For simple string keys (`value="K"`)
2. **Slot-based**: For complex content or custom rendering

This dual API provides flexibility while keeping common cases simple.

### Tailwind Integration
Seamlessly integrates with Tailwind CSS utility classes, allowing developers to apply custom styling without fighting the component's base styles.

### Minimal State Management
No built-in interactive states (active, pressed, disabled), keeping the component focused purely on display semantics. Interaction states would be handled at a higher level (e.g., by a parent shortcut component).

## Research Notes

### Documentation Quality
- Clear prop descriptions with type information
- Multiple practical examples showing common patterns
- Visual variant showcase helps developers choose appropriate styling
- Platform-specific behavior well documented

### Framework Approach
Nuxt UI takes a presentational approach to the Kbd component - it's purely display-focused without built-in interactive states. This aligns with the semantic nature of the `<kbd>` element (representing input, not interactive controls).

### Implementation Philosophy
- Composition-friendly (works well in larger shortcut displays)
- Platform-aware (intelligent meta key mapping)
- Style-flexible (variant system + custom classes)
- Semantically correct (uses proper HTML element)

### Potential Use Cases Implied by Design
1. **Documentation**: Showing keyboard shortcuts in help text
2. **Tooltips**: Displaying shortcuts in hover states
3. **Command palettes**: Showing available key bindings
4. **Onboarding**: Teaching users keyboard navigation
5. **Accessibility info**: Communicating keyboard alternatives
