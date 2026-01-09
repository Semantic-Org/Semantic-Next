# Nuxt UI - Button Usage Patterns

> Last Modified: 2024-11-04

## Component URL
https://ui.nuxt.com/components/button
Status: ✅ Working
Version: Current (Nuxt UI 3.0+)
Last Verified: 2024-11-04

## Documentation Quality
Comprehensive - The documentation provides extensive coverage of all props, variants, states, and integration patterns with clear examples and interactive playground.

## Component Definition
- **Core purpose**: A versatile, polymorphic button component that serves as the primary interactive element for user actions, supporting both button and link semantics with rich state management and visual customization.
- **Mental model**: A unified action trigger that can morph between button/link roles, carries visual state (loading, disabled, active), and composes with icons/avatars. Users think of it as "the thing I click to do something" with built-in feedback mechanisms.
- **Semantic meaning**: Communicates actionability and importance through visual hierarchy (variants/colors), current state (loading/disabled/active), and intent (success/warning/error colors). When used as a link, it signals navigation while maintaining button-like affordance.

## Pattern Support Levels
- **Native**: Dedicated prop/API
- **Composed**: Via composition/children
- **CSS-only**: Requires custom styling

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content | ✅ | Native | Via default slot or `label` prop. Both approaches supported: `<UButton>Text</UButton>` or `<UButton label="Text" />` |
| Icon support | ✅ | Native | Via `icon`, `leadingIcon`, or `trailingIcon` props. Uses string identifiers like `"i-lucide-search"` or object format. Icon-only buttons supported. |
| Icon + Text | ✅ | Native | Automatic positioning via `icon` (leading by default), `leadingIcon`, or `trailingIcon`. Props: `leading` and `trailing` control icon placement. |
| Loading indicator | ✅ | Native | Via `loading` boolean prop or `loadingAuto` for promise-based auto-management. Custom loading icon via `loadingIcon` prop (defaults to `"i-lucide-loader-circle"`). Globally configurable via `ui.icons.loading`. |
| Custom content | ✅ | Composed | Default slot accepts arbitrary Vue content. Can combine text, icons, and custom markup. |
| Avatar support | ✅ | Native | Via `avatar` prop accepting object with `src`, `alt`, `icon`, `text`, `size` properties. Integrated avatar component rendering. |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Solid | ✅ | Native | Default variant. `variant="solid"` - filled background with color. |
| Outline | ✅ | Native | `variant="outline"` - bordered with transparent background. |
| Soft | ✅ | Native | `variant="soft"` - subtle background with matching text color. |
| Ghost | ✅ | Native | `variant="ghost"` - transparent until hover/focus. |
| Link | ✅ | Native | `variant="link"` - text-only appearance, typically underlined. |
| Subtle | ✅ | Native | `variant="subtle"` - minimal styling, lighter than soft. |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Disabled | ✅ | Native | `disabled` boolean prop. Reduces opacity, prevents interaction, shows cursor-not-allowed. |
| Loading | ✅ | Native | `loading` boolean prop shows loading icon. `loadingAuto` automatically manages loading state from click handler promises - unique feature. Loading icon customizable via `loadingIcon` prop. |
| Active | ✅ | Native | `active` boolean prop. Supports separate `activeColor` and `activeVariant` props to customize active appearance. Also supports `activeClass` and `inactiveClass` for custom styling. |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅ | Native | Five sizes: `xs`, `sm`, `md` (default), `lg`, `xl`. Applied via `size` prop. |
| Color options | ✅ | Native | Seven semantic colors: `primary` (default), `secondary`, `success`, `info`, `warning`, `error`, `neutral`. Applied via `color` prop. |
| Square | ✅ | Native | `square` boolean prop creates equal padding on all sides, ideal for icon-only buttons. |
| Block | ✅ | Native | `block` boolean prop makes button full-width (display: block). |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Click handler | ✅ | Native | Standard Vue `@click` event. Supports promise-returning handlers with `loadingAuto` for automatic loading state management. |
| As NuxtLink | ✅ | Native | `to` prop triggers NuxtLink/link behavior. Supports `target` prop. Can customize active state via `activeColor`, `activeVariant`, `activeClass`, `inactiveClass`. Polymorphic via `as` prop. |
| Form integration | ✅ | Native | `type="submit"` works with UForm component. `loadingAuto` integrates with form submission promises. |

## Code Examples

### Basic Button Variants
```vue
<!-- Text button -->
<UButton>Button</UButton>
<UButton label="Button" />

<!-- Variants -->
<UButton variant="solid">Solid</UButton>
<UButton variant="outline">Outline</UButton>
<UButton variant="soft">Soft</UButton>
<UButton variant="subtle">Subtle</UButton>
<UButton variant="ghost">Ghost</UButton>
<UButton variant="link">Link</UButton>

<!-- Colors -->
<UButton color="primary">Primary</UButton>
<UButton color="secondary">Secondary</UButton>
<UButton color="success">Success</UButton>
<UButton color="info">Info</UButton>
<UButton color="warning">Warning</UButton>
<UButton color="error">Error</UButton>
<UButton color="neutral">Neutral</UButton>

<!-- Sizes -->
<UButton size="xs">Extra Small</UButton>
<UButton size="sm">Small</UButton>
<UButton size="md">Medium</UButton>
<UButton size="lg">Large</UButton>
<UButton size="xl">Extra Large</UButton>
```

### Icon Patterns
```vue
<!-- Icon only -->
<UButton icon="i-lucide-search" size="md" color="primary" variant="solid" />

<!-- Icon with text (leading) -->
<UButton icon="i-lucide-rocket" size="md">Button</UButton>
<UButton leading-icon="i-lucide-rocket">Button</UButton>

<!-- Icon with text (trailing) -->
<UButton trailing-icon="i-lucide-arrow-right">Button</UButton>

<!-- Custom icon positioning -->
<UButton icon="i-lucide-star" :leading="false" :trailing="true">
  Button
</UButton>
```

### State Patterns
```vue
<!-- Loading state -->
<UButton loading>Loading</UButton>
<UButton loading loading-icon="i-lucide-loader">Custom Loader</UButton>

<!-- Auto-loading from promises -->
<script setup>
async function onClick() {
  return new Promise<void>(res => setTimeout(res, 1000))
}
</script>
<template>
  <UButton loading-auto @click="onClick">Click Me</UButton>
</template>

<!-- Disabled -->
<UButton disabled>Disabled</UButton>

<!-- Active state with customization -->
<UButton
  active
  color="neutral"
  variant="outline"
  active-color="primary"
  active-variant="solid"
>
  Active Button
</UButton>
```

### Link Patterns
```vue
<!-- External link -->
<UButton to="https://github.com/nuxt/ui" target="_blank">
  External Link
</UButton>

<!-- Internal navigation -->
<UButton to="/about">About Page</UButton>

<!-- Custom active styling -->
<UButton
  to="/dashboard"
  active-class="font-bold"
  inactive-class="opacity-75"
>
  Dashboard
</UButton>
```

### Layout Patterns
```vue
<!-- Square button (equal padding) -->
<UButton square icon="i-lucide-settings" />

<!-- Block button (full-width) -->
<UButton block>Full Width Button</UButton>
```

### Avatar Integration
```vue
<!-- Avatar with image -->
<UButton :avatar="{ src: 'https://github.com/nuxt.png' }">
  Button
</UButton>

<!-- Avatar with icon -->
<UButton :avatar="{ icon: 'i-lucide-user' }">
  Button
</UButton>

<!-- Avatar with text -->
<UButton :avatar="{ text: 'AB' }">
  Button
</UButton>
```

### Form Integration
```vue
<script setup>
const state = reactive({
  fullName: ''
})

const validate = (state) => {
  const errors = []
  if (!state.fullName) errors.push({ path: 'fullName', message: 'Required' })
  return errors
}

async function onSubmit() {
  // API call
  await new Promise(res => setTimeout(res, 1000))
}
</script>

<template>
  <UForm :state="state" :validate="validate" @submit="onSubmit">
    <UFormField name="fullName" label="Full name">
      <UInput v-model="state.fullName" />
    </UFormField>

    <!-- Loading auto-managed during submit -->
    <UButton type="submit" loading-auto>Submit</UButton>
  </UForm>
</template>
```

### Customization Patterns
```vue
<!-- Via class prop -->
<UButton class="font-bold rounded-full">Custom Styled</UButton>

<!-- Via ui prop (component slots) -->
<UButton
  icon="i-lucide-rocket"
  :ui="{ leadingIcon: 'text-primary' }"
>
  Custom Icon Color
</UButton>

<!-- Global configuration (app.config.ts) -->
export default defineAppConfig({
  ui: {
    button: {
      variants: {
        active: {
          true: { base: 'font-bold' }
        }
      }
    },
    icons: {
      loading: 'i-custom-spinner'
    }
  }
})
```

### Polymorphic Rendering
```vue
<!-- Render as custom component -->
<UButton as="RouterLink" to="/home">Custom Component</UButton>

<!-- Defaults to span when not a link -->
<UButton as="span">Span Element</UButton>
```

## Notable Features

- **loadingAuto prop**: Innovative pattern that automatically manages loading state based on promise resolution from click handlers. Eliminates boilerplate for async operations. Works seamlessly with form submissions.

- **Separate active state customization**: Unlike most button components, active state can have completely different color and variant from the default state via `activeColor` and `activeVariant` props.

- **Integrated avatar support**: Built-in avatar component integration with full customization (src, icon, text, size) eliminates need for manual composition.

- **Polymorphic rendering**: The `as` prop allows rendering as any component or element while maintaining button functionality and styling.

- **Icon flexibility**: Three-tier icon system (icon, leadingIcon, trailingIcon) with position control (leading/trailing booleans) provides maximum flexibility without verbosity.

- **Global icon customization**: Loading and other icons can be customized globally via app config, ensuring brand consistency.

- **Nuxt-native link integration**: Seamless NuxtLink integration with active route detection and custom active state styling.

- **Class-based customization**: Multiple customization layers (class, ui prop, global config) provide escape hatches for any styling need.

## Research Notes

**Framework Approach Observations:**

1. **Vue-centric reactivity**: Props are reactive by default, state management is implicit through Vue's reactivity system. No explicit signal/state management needed.

2. **Composition over configuration**: While props are extensive, the component favors composition through slots and nested components (avatar) over complex configuration objects.

3. **Promise-aware patterns**: The `loadingAuto` feature shows deep integration with JavaScript promises and async patterns, reflecting modern Vue/Nuxt conventions.

4. **Utility-first styling**: Based on Tailwind CSS, customization happens through utility classes (class prop) and slot-based utility injection (ui prop).

5. **Config-driven theming**: Global theming through `app.config.ts` follows Nuxt conventions for application-wide configuration.

6. **Polymorphic component pattern**: The `as` prop enables the button to morph into different elements/components while maintaining behavior - a sophisticated pattern for component flexibility.

7. **Icon system**: String-based icon identifiers ("i-lucide-*") suggest a custom icon resolution system, likely integrated with Nuxt's auto-import capabilities.

8. **Active state sophistication**: The ability to specify different colors and variants for active state shows attention to complex UI states, particularly for navigation contexts.

9. **Type safety**: TypeScript-first design with strong prop typing and object shapes (avatar props, ui customization).

10. **Form ecosystem integration**: Deep integration with Nuxt UI's form components (UForm, UFormField) shows component ecosystem cohesion.

**Distinctive Patterns vs Other Frameworks:**

- **loadingAuto** is unique compared to most button implementations - most frameworks require manual loading state management
- **Avatar integration** is uncommon in base button components - typically requires composition
- **Separate active state styling** goes beyond simple "active" class - allows complete visual transformation
- **Polymorphic rendering** is more sophisticated than typical "as" prop implementations
- **Promise-aware loading** reflects modern async UI patterns better than boolean-only loading props

**Potential Learning Points for Semantic UI:**

- The `loadingAuto` pattern could inspire similar promise-aware state management
- Separate active state customization (activeColor, activeVariant) provides more flexibility than single active class
- Icon positioning flexibility through dedicated props (leadingIcon, trailingIcon) plus position booleans (leading, trailing) offers good DX
- Global icon customization through config reduces per-component verbosity
- Polymorphic rendering enables advanced use cases without component duplication
