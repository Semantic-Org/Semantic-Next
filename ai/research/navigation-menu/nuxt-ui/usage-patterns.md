# Nuxt UI - Navigation Menu Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://ui.nuxt.com/components/navigation-menu

Status: ✅ Working
Version: 4.1.0
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - Well-structured with multiple examples, clear prop documentation, TypeScript interfaces, and usage patterns.

## Component Definition
- **Core purpose**: Displays a hierarchical list of navigation links with support for submenus, icons, badges, and flexible layouts (horizontal or vertical)
- **Mental model**: A semantic navigation container that supports both simple flat lists and complex nested menu structures with visual indicators for active states
- **Semantic meaning**: Communicates primary navigation hierarchy in applications, supporting both main navigation and secondary menu systems

## Pattern Support Levels
- **Native**: Dedicated prop/API
- **Composed**: Via composition/children
- **CSS-only**: Requires custom styling

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Logo/Brand | ❌ | Composed | Not a native feature; can be added via custom header content outside component |
| Navigation links | ✅ | Native | `label` prop, `to` prop for routing, children array for submenus |
| Search integration | ❌ | Composed | Not native; must be implemented via custom content above/beside component |
| User menu/avatar | ✅ | Native | `avatar` prop supports AvatarProps, can display user avatar in items |
| Action buttons | ✅ | Native | `badge` prop, custom slots via `slot` property, `trailing-icon` customization |

## Layout Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Horizontal navigation | ✅ | Native | Default orientation; items display in row, submenus as dropdowns |
| Vertical navigation | ✅ | Native | `orientation="vertical"` prop; accordion-style expand/collapse for sections |
| Nested menus | ✅ | Native | `children` array property for any item; unlimited nesting levels supported |
| Mega menu | ✅ | Composed | Achievable via `contentOrientation="horizontal"` with complex child structures |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Active/Current link | ✅ | Native | `active` boolean prop on items, `highlight` prop displays border indicator, `highlightColor` customizes color |
| Hover states | ✅ | Native | Built-in interactive feedback on items via component styling |
| Disabled links | ✅ | Native | `disabled` boolean prop on items, prevents interaction |
| Mobile menu toggle | ✅ | Composed | `collapsed` prop for vertical mode collapses to icon-only, responsive behavior via CSS |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Position options | ✅ | Composed | Uses CSS utilities for positioning; component accepts `class` prop for layout control |
| Width options | ✅ | Composed | Full-width, constrained, or custom widths via CSS classes |
| Background styles | ✅ | Native | `color` prop (neutral, primary, etc.), `variant` prop for visual styling |
| Border options | ✅ | Native | `highlight` prop provides border indicator for active items; visual separation via grouping |

## Code Examples

### Basic Horizontal Navigation
```vue
<script setup lang="ts">
import { ref } from 'vue'

const items = ref([
  {
    label: 'Guide',
    icon: 'i-lucide-book-open',
    to: '/docs/getting-started',
    children: [
      {
        label: 'Introduction',
        description: 'Fully styled and customizable components for Nuxt.',
        icon: 'i-lucide-house'
      },
      {
        label: 'Installation',
        description: 'Learn how to install and configure Nuxt UI in your application.',
        icon: 'i-lucide-cloud-download'
      }
    ]
  },
  {
    label: 'Components',
    icon: 'i-lucide-box',
    to: '/docs/components',
    active: true
  }
])
</script>

<template>
  <UNavigationMenu :items="items" />
</template>
```

### Vertical Navigation with Groups
```vue
<script setup lang="ts">
import { ref } from 'vue'

const items = ref([
  [
    { label: 'Links', type: 'label' },
    {
      label: 'Guide',
      icon: 'i-lucide-book-open',
      children: [
        { label: 'Introduction', icon: 'i-lucide-house' },
        { label: 'Installation', icon: 'i-lucide-cloud-download' }
      ]
    },
    {
      label: 'Components',
      icon: 'i-lucide-box',
      to: '/docs/components',
      defaultOpen: true
    }
  ],
  [
    { label: 'Resources', type: 'label' },
    {
      label: 'GitHub',
      icon: 'i-simple-icons-github',
      badge: '3.8k',
      target: '_blank',
      to: 'https://github.com/nuxt/ui'
    }
  ]
])
</script>

<template>
  <UNavigationMenu :items="items" orientation="vertical" />
</template>
```

### With Active Highlight and Custom Colors
```vue
<template>
  <UNavigationMenu
    :items="items"
    highlight
    highlight-color="primary"
    color="primary"
    variant="link"
  />
</template>
```

### Collapsed Sidebar Navigation
```vue
<template>
  <UNavigationMenu
    :items="items"
    orientation="vertical"
    collapsed
    highlight
  />
</template>
```

### With Avatar and Badges
```vue
<script setup lang="ts">
const items = ref([
  {
    label: 'Profile',
    avatar: {
      src: 'https://avatars.githubusercontent.com/u/144025?v=4',
      alt: 'Avatar'
    },
    to: '/profile'
  },
  {
    label: 'Notifications',
    icon: 'i-lucide-bell',
    badge: '5',
    to: '/notifications'
  },
  {
    label: 'Settings',
    icon: 'i-lucide-settings',
    to: '/settings'
  }
])
</script>
```

## NavigationMenuItem Type Definition
```typescript
type NavigationMenuItem = {
  label?: string
  icon?: string
  avatar?: AvatarProps
  badge?: string | number | BadgeProps
  tooltip?: TooltipProps
  trailingIcon?: string
  type?: 'label' | 'trigger' | 'link'
  defaultOpen?: boolean
  open?: boolean
  value?: string
  disabled?: boolean
  slot?: string
  onSelect?: (e: Event) => void
  children?: NavigationMenuChildItem[]
  class?: any
}
```

## NavigationMenuChildItem Type Definition
```typescript
type NavigationMenuChildItem = {
  label: string
  description?: string
  icon?: string
  onSelect?: (e: Event) => void
  class?: any
}
```

## Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `NavigationMenuItem[]` | `[]` | Array of navigation items to display |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Layout direction of the menu |
| `collapsed` | `boolean` | `false` | Collapses vertical menu to icon-only (sidebar mode) |
| `highlight` | `boolean` | `false` | Shows border indicator for active items |
| `highlightColor` | `string` | `"primary"` | Color variant for active state border |
| `color` | `string` | `"neutral"` | Theme color for menu styling |
| `variant` | `string` | Depends on color | Visual style variant of the menu |
| `arrow` | `boolean` | `false` | Displays animated arrow following active item |
| `contentOrientation` | `"vertical" \| "horizontal"` | `"vertical"` | Submenu layout direction (horizontal mode only) |
| `trailingIcon` | `string` | `"i-lucide-chevron-down"` | Chevron icon class for submenus |
| `unmountOnHide` | `boolean` | `true` | Unmounts content DOM when hidden |
| `class` | `any` | - | CSS classes for styling wrapper |

## Notable Features

- **Animated Arrow Tracking**: Optional `arrow` prop displays a visual indicator that follows the active submenu
- **Grouped Navigation**: Support for grouped items by providing a 2D array structure instead of flat array
- **Avatar Integration**: Native support for user avatars via AvatarProps, enabling user menu patterns
- **Badge Support**: Native badge display with customizable BadgeProps for notifications or metadata
- **Tooltip Support**: Built-in tooltip support via TooltipProps for additional context
- **Flexible Content**: Custom icon system, description text for child items, and customizable trailing icons
- **Responsive Collapse**: Vertical mode with `collapsed` prop perfect for responsive sidebar patterns
- **Routing Integration**: Native `to` prop for router-link integration (likely works with Nuxt routing)
- **Type Safety**: Comprehensive TypeScript interfaces for all item structures

## Research Notes

- The component is part of Nuxt UI v4.1.0 and follows modern Vue 3 Composition API patterns
- No direct search integration support, but structure allows composition with search components
- Logo/branding typically handled outside this component in application header
- The component handles both simple flat navigation and complex hierarchical menu systems
- Excellent TypeScript support with detailed prop interfaces
- Mobile responsiveness relies on integration with parent layout and CSS utilities rather than native mobile-specific props
- The `contentOrientation` prop only applies in horizontal mode, enabling sophisticated mega-menu layouts with horizontal submenu grouping
