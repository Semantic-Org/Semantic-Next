# Nuxt UI Alert - Usage Patterns

> Research Date: 2025-11-06
> Component URL: https://ui.nuxt.com/components/alert

## Component Overview

The Alert component is described as "a callout to draw user's attention." It provides a flexible and feature-rich way to display notifications, important messages, and contextual information to users within Nuxt applications. The component integrates seamlessly with Nuxt's theming system and supports extensive customization through props, slots, and configuration.

**Core Philosophy**: Flexible content composition with multiple display modes (icon, avatar, title, description, actions) and comprehensive visual customization through color and variant systems.

## Core Patterns

### Basic Structure
```vue
<UAlert
  title="Alert Title"
  description="Alert description content"
/>
```

The component follows a structured content hierarchy:
1. **Visual indicator** (icon or avatar)
2. **Title** (heading)
3. **Description** (body content)
4. **Actions** (interactive buttons)
5. **Close button** (optional dismissal)

### Layout Orientation
Supports two layout modes:
- **Vertical** (default): Icon/avatar above content
- **Horizontal**: Icon/avatar beside content

## Props & Configuration

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `as` | any | `'div'` | Root HTML element type for semantic flexibility |
| `title` | string | — | Alert heading text |
| `description` | string | — | Alert body content, supports longer text |
| `icon` | string | — | Icon identifier using Iconify format (e.g., `i-lucide-terminal`) |
| `avatar` | AvatarProps | — | Avatar configuration object for user/profile imagery instead of icon |
| `color` | string | `'primary'` | Semantic color scheme: primary, secondary, success, info, warning, error, neutral |
| `variant` | string | `'solid'` | Visual style variant: solid, outline, soft, subtle |
| `orientation` | string | `'vertical'` | Layout direction: vertical (stacked), horizontal (inline) |
| `close` | boolean \| ButtonProps | — | Enable closable behavior; pass boolean or Button props object for customization |
| `closeIcon` | string | `i-lucide-x` | Icon for close button, customizable via Iconify identifier |
| `actions` | ButtonProps[] | — | Array of action button configurations, each accepting full Button component props |
| `class` | any | — | Additional CSS classes for custom styling |
| `ui` | object | — | Slot-level style overrides using Nuxt UI's slot customization system |

## Visual Patterns

### Color Schemes
Nuxt UI Alert provides 7 semantic color options:
- **primary** (default) - Main brand color, general purpose
- **secondary** - Alternate brand color
- **success** - Positive outcomes, successful operations
- **info** - Informational messages, neutral context
- **warning** - Caution messages, important notices
- **error** - Error states, critical alerts
- **neutral** - Non-semantic, gray-toned alerts

```vue
<!-- Success notification -->
<UAlert
  color="success"
  title="Success!"
  description="Operation completed successfully"
/>

<!-- Error message -->
<UAlert
  color="error"
  title="Error"
  description="Something went wrong"
/>
```

### Style Variants
Four distinct visual treatments:
- **solid** - Filled background with high contrast
- **outline** - Bordered style with transparent background
- **soft** - Subtle background fill with medium contrast
- **subtle** - Minimal styling with low contrast

```vue
<!-- Different visual weights -->
<UAlert variant="solid" color="primary" title="Solid Alert" />
<UAlert variant="outline" color="primary" title="Outline Alert" />
<UAlert variant="soft" color="primary" title="Soft Alert" />
<UAlert variant="subtle" color="primary" title="Subtle Alert" />
```

### Color Mode Support
The component automatically adapts to light/dark color modes using Nuxt's color mode system with CSS variables:
- `--ui-primary`, `--ui-secondary`, etc.
- Automatic light/dark variant switching
- Uses oklch color space for consistent color management

## Content Patterns

### Icon Display
```vue
<!-- Using Iconify icon identifier -->
<UAlert
  icon="i-lucide-terminal"
  title="Command Line"
  description="Execute terminal commands"
/>

<!-- Custom icon size via ui prop -->
<UAlert
  icon="i-lucide-alert-triangle"
  :ui="{ icon: 'size-11' }"
  title="Warning"
/>
```

### Avatar Integration
```vue
<!-- User-focused alerts with avatars -->
<UAlert
  :avatar="{ src: '/user.jpg', alt: 'User Name' }"
  title="User Notification"
  description="Message from another user"
/>
```

### Title Only
```vue
<UAlert title="Simple notification" />
```

### Description Only
```vue
<UAlert description="Basic message without heading" />
```

### Title + Description
```vue
<UAlert
  title="Configuration Changed"
  description="You can change the primary color in your app config"
/>
```

### Full Content Composition
```vue
<UAlert
  icon="i-lucide-info"
  title="Important Update"
  description="This is a comprehensive alert with all content features"
  color="info"
  variant="soft"
/>
```

## Behavioral Patterns

### Basic Closable Alert
```vue
<!-- Simple dismissible alert -->
<UAlert
  title="Dismissible"
  description="Click the X to close"
  close
/>
```

The `close` prop enables a close button that:
- Displays in the top-right corner (or appropriate position based on orientation)
- Uses the `closeIcon` prop for its icon (default: `i-lucide-x`)
- Emits `update:open` event when clicked for reactive state management

### Customized Close Button
```vue
<!-- Styled close button -->
<UAlert
  title="Custom Close"
  :close="{
    color: 'primary',
    variant: 'outline',
    class: 'rounded-full'
  }"
/>
```

The `close` prop accepts a ButtonProps object for full customization.

### Event Handling
```vue
<script setup>
const isOpen = ref(true)
</script>

<template>
  <UAlert
    v-if="isOpen"
    title="Controlled Alert"
    close
    @update:open="isOpen = $event"
  />
</template>
```

### Action Buttons
```vue
<!-- Single action -->
<UAlert
  title="Confirm Action"
  description="Do you want to proceed?"
  :actions="[
    { label: 'Confirm', color: 'primary' }
  ]"
/>

<!-- Multiple actions -->
<UAlert
  title="Choose an Option"
  description="Select how you'd like to proceed"
  :actions="[
    { label: 'Accept', color: 'primary', variant: 'solid' },
    { label: 'Decline', color: 'neutral', variant: 'outline' },
    { label: 'Learn More', variant: 'ghost' }
  ]"
/>
```

Each action button accepts any property from the Button component, providing full control over appearance and behavior.

## Slot System

Nuxt UI uses a slot-based customization system via the `ui` prop. The Alert component supports these style customization slots:

### Available Slots
- **root** - Container wrapper, controls overall layout and spacing
- **icon** - Icon display area, controls size and positioning
- **avatar** - Avatar display area (when avatar is used instead of icon)
- **header** - Title section styling
- **body** - Description/content area styling
- **actions** - Button group area layout and spacing

### Slot Customization Examples
```vue
<!-- Custom icon sizing -->
<UAlert
  icon="i-lucide-bell"
  title="Notification"
  :ui="{ icon: 'size-11' }"
/>

<!-- Custom layout spacing -->
<UAlert
  title="Custom Spacing"
  :ui="{
    root: 'gap-4 p-6',
    header: 'text-2xl',
    body: 'text-base'
  }"
/>

<!-- Custom action button layout -->
<UAlert
  title="Action Alert"
  :actions="[{ label: 'Click' }]"
  :ui="{ actions: 'gap-3 mt-4' }"
/>
```

## Accessibility

### ARIA Support
While specific ARIA attributes weren't explicitly documented, standard practices would include:
- Semantic role for alert announcements
- Proper heading hierarchy via title prop
- Keyboard-accessible close button
- Focus management for interactive elements

### Keyboard Support
- **Close Button**: Standard button keyboard interaction (Enter/Space to activate)
- **Action Buttons**: Full keyboard navigation and activation
- **Focus Management**: Proper tab order through interactive elements

### Screen Reader Considerations
- Alert content should be properly announced
- Icon/avatar should have appropriate alternative text
- Close button should have accessible label

## Framework-Specific Features

### Vue 3 Integration
```vue
<script setup>
import { ref } from 'vue'

// Reactive state management
const alertVisible = ref(true)
const alertColor = ref('primary')

// Dynamic actions
const actions = ref([
  {
    label: 'Action 1',
    click: () => console.log('Action 1 clicked')
  }
])
</script>

<template>
  <UAlert
    v-if="alertVisible"
    :color="alertColor"
    title="Dynamic Alert"
    :actions="actions"
    close
    @update:open="alertVisible = $event"
  />
</template>
```

### Event System
- **update:open**: Emitted when close button is clicked, passes boolean value for two-way binding

### Iconify Integration
Nuxt UI uses Iconify for icon management:
- Format: `i-{collection}-{icon-name}`
- Example: `i-lucide-terminal`, `i-heroicons-exclamation-triangle`
- Extensive icon library support
- Auto-loading icon collections

### Reka UI Foundation
No explicit mention of Reka UI foundation was found in the documentation. Nuxt UI appears to be built directly on Vue 3 primitives with Tailwind CSS for styling.

### UApp Config Customization

Global configuration via `app.config.ts`:

```typescript
export default defineAppConfig({
  ui: {
    // Global icon overrides
    icons: {
      close: 'i-custom-close-icon'
    },

    // Primary color customization
    primary: 'blue', // or any Tailwind color

    // Global Alert defaults (example structure)
    alert: {
      default: {
        color: 'primary',
        variant: 'solid'
      }
    }
  }
})
```

Configuration capabilities:
- **Icon overrides**: Change default close icon globally
- **Color palette**: Configure primary/secondary colors
- **Component defaults**: Set global default props
- **Theme variables**: CSS variable customization

### Tailwind CSS Integration
- Built on Tailwind CSS utility classes
- Supports custom classes via `class` prop
- Slot-level customization with Tailwind utilities via `ui` prop
- Uses oklch color space for color consistency

## Implementation Notes

### Architecture
- **Component Base**: Vue 3 Single File Components
- **Styling**: Tailwind CSS utility-first approach
- **Icons**: Iconify ecosystem for icon management
- **Theming**: CSS custom properties with color mode awareness
- **Type Safety**: TypeScript support with typed props

### Design System Integration
- Part of Nuxt UI's comprehensive component library
- Consistent API patterns across components
- Shared theming system via app config
- Unified color and variant naming conventions

### Color System Details
- Uses oklch color space for perceptual color consistency
- Automatic light/dark mode adaptation
- CSS variables: `--ui-{color}` pattern
- Semantic color naming: success, warning, error, info

### Button Props Pass-Through
The `actions` array and `close` prop accept full Button component props:
- `label`, `icon`, `color`, `variant`, `size`
- Event handlers: `click`, `mouseenter`, etc.
- Styling: `class`, `ui` slot customization
- All standard HTML button attributes

### Layout System
- **Vertical orientation**: Stack icon/avatar above content (default)
- **Horizontal orientation**: Place icon/avatar beside content
- Responsive: Can be controlled dynamically
- Proper spacing and alignment in both modes

### Performance Considerations
- Icon auto-loading may add small bundle overhead
- Avatar images should be optimized
- Actions array should be kept reasonably sized
- Consider v-if for conditional rendering rather than CSS display toggles

### Best Practices
1. **Use semantic colors**: Match color to message intent (success, error, warning)
2. **Keep actions focused**: 1-3 action buttons maximum for clarity
3. **Provide clear titles**: Use title for scannable alert identification
4. **Close button for non-critical**: Make dismissible alerts that aren't urgent
5. **Icon clarity**: Choose icons that reinforce the alert's purpose
6. **Responsive considerations**: Test both orientations on different viewports

## Code Examples

### Basic Alert
```vue
<UAlert
  title="Heads up!"
  description="Configuration message"
/>
```

### Styled Alert with Icon
```vue
<UAlert
  icon="i-lucide-terminal"
  title="Command Required"
  description="You need to run a terminal command"
  color="neutral"
  variant="outline"
/>
```

### Closable Alert with Actions
```vue
<UAlert
  title="Confirm Deletion"
  description="This action cannot be undone"
  color="error"
  variant="soft"
  close
  :actions="[
    { label: 'Delete', color: 'error' },
    { label: 'Cancel', variant: 'ghost' }
  ]"
/>
```

### Horizontal Layout with Avatar
```vue
<UAlert
  orientation="horizontal"
  :avatar="{ src: '/user-avatar.jpg', alt: 'User' }"
  title="Team Member Joined"
  description="John Doe joined your workspace"
  color="success"
  variant="soft"
/>
```

### Custom Styled Alert
```vue
<UAlert
  icon="i-lucide-alert-triangle"
  title="Custom Warning"
  description="This alert uses custom styling"
  color="warning"
  class="border-2 shadow-lg"
  :ui="{
    icon: 'size-12',
    header: 'text-xl font-bold',
    body: 'text-base leading-relaxed',
    actions: 'gap-4 mt-4'
  }"
  :actions="[{ label: 'Acknowledge', variant: 'solid' }]"
  :close="{ variant: 'ghost', class: 'rounded-full' }"
/>
```

### Reactive Alert with State Management
```vue
<script setup>
const isVisible = ref(true)
const alertType = ref<'info' | 'success' | 'error'>('info')

function handleAction() {
  alertType.value = 'success'
  setTimeout(() => {
    isVisible.value = false
  }, 2000)
}
</script>

<template>
  <UAlert
    v-if="isVisible"
    :color="alertType"
    title="Processing..."
    description="Your request is being handled"
    :actions="[
      { label: 'Process', click: handleAction }
    ]"
    close
    @update:open="isVisible = $event"
  />
</template>
```

## Summary

Nuxt UI's Alert component provides a comprehensive, production-ready solution for displaying notifications and important messages. Key strengths include:

- **Flexible Content Composition**: Icons, avatars, titles, descriptions, and action buttons
- **Rich Visual Customization**: 7 semantic colors × 4 variants = 28 visual combinations
- **Layout Flexibility**: Vertical and horizontal orientations
- **Interactive Features**: Closable alerts with customizable dismiss buttons, action button arrays
- **Deep Customization**: Slot-based styling system via `ui` prop
- **Framework Integration**: Native Vue 3 patterns, Iconify icons, Tailwind CSS utilities
- **Theming Support**: Global configuration via app.config.ts with color mode awareness
- **Type Safety**: TypeScript support throughout

The component follows modern Vue 3 conventions, integrates seamlessly with Nuxt's ecosystem, and provides extensive customization options while maintaining sensible defaults for rapid development.
