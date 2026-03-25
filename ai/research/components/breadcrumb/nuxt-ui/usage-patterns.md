# Nuxt UI - Breadcrumb Usage Patterns

> Last Modified: 2025-11-04

## Component URL
https://ui.nuxt.com/components/breadcrumb
Status: ✅ Working
Version: v4.1.0
Last Verified: 2025-11-04

## Documentation Quality
Comprehensive - The documentation includes detailed prop tables with type information, slot descriptions with scope details, code examples, and a complete theme configuration showing all customizable elements. TypeScript type inference is well-documented.

## Component Definition
- **Core purpose**: Provides hierarchical navigation showing the user's current location within the site structure and allowing easy navigation to parent pages
- **Mental model**: A horizontal trail of links representing the path from the home page to the current page, with visual separators between each level
- **Semantic meaning**: Communicates page hierarchy and navigation context, helping users understand where they are in the site structure and providing quick navigation to parent pages

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `separator-icon="i-lucide-chevron-right"`)
- **Composed**: Via composition/children (e.g., `<BreadcrumbItem>` with slots)
- **CSS-only**: Requires custom styling (e.g., `class="..."`)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text links | ✅ | Native | `items` array with `label` property for text content |
| Icon support | ✅ | Native | `icon` property on breadcrumb items for leading icons |
| Dropdown menus | ✅ | Composed | Custom slot pattern allows embedding dropdown components as breadcrumb items |
| Custom separators | ✅ | Native + Composed | `separator-icon` prop for icon-based separators, or `#separator` slot for custom content |
| Avatar support | ✅ | Native | `avatar` property on items for avatar-based breadcrumbs |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Simple breadcrumb | ✅ | Native | Basic text links with separator icons using `items` prop |
| With dropdown | ✅ | Composed | Demonstrated in docs with dropdown menu integration via custom slots |
| Icon breadcrumb | ✅ | Native | Icon property on items for icon-prefixed breadcrumbs |
| Avatar breadcrumb | ✅ | Native | Avatar property for user-based hierarchical navigation |
| Mixed content | ✅ | Composed | Combination of icons, avatars, and custom content via slots |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Current page | ✅ | Native | Last item typically represents current page; `active` prop available on items |
| Disabled items | ✅ | Native | Inherited from Link component via `disabled` prop |
| Clickable/non-clickable | ✅ | Native | Items with `to` property render as links; items without `to` render as spans |
| Focus states | ✅ | CSS-only | `focus-visible:outline-primary` styling applied automatically |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Separator styles | ✅ | Native + Composed | `separator-icon` prop accepts icon identifiers, default is `i-lucide-chevron-right`; `#separator` slot for custom separators including text (e.g., `/`) |
| Size options | ✅ | CSS-only | Text size controlled via Tailwind classes (default: `text-sm`), customizable through theme configuration |
| Responsive behavior | ✅ | CSS-only | Utilizes Tailwind classes for layout control; flexbox-based layout adapts to container |
| Color variants | ✅ | CSS-only | Inherits from primary/neutral palette; customizable via theme configuration |
| Global config | ✅ | Native | `appConfig.ui.icons.chevronRight` for global separator icon customization |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Click navigation | ✅ | Native | Automatic href handling for items with `to` property |
| Router integration | ✅ | Native | Native support via `to` property using Link component (NuxtLink/Vue Router) |
| Programmatic nav | ✅ | Native | Link component properties supported: `to`, `target`, `download`, etc. |
| Type behavior | ✅ | Native | Renders as button when not routed, link when `to` provided |

## Accessibility Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| aria-label | ✅ | Native | Supported via standard HTML attributes |
| aria-current | ⚠️ | CSS-only | Not explicitly documented but can be added via item properties |
| Keyboard navigation | ✅ | Native | Standard focus management with Tab/Shift+Tab; Space/Enter for activation |
| Semantic markup | ✅ | Native | Renders as `<nav>` element by default (customizable via `as` prop) |
| Screen reader support | ✅ | Native | Proper hierarchy with list-based structure |

## Code Examples
```vue
<!-- Basic Usage with Navigation -->
<template>
  <UBreadcrumb
    :items="[
      { label: 'Home', to: '/' },
      { label: 'Products', to: '/products' },
      { label: 'Product Details' }
    ]"
  />
</template>

<!-- Custom Separator Icon -->
<template>
  <UBreadcrumb
    separator-icon="i-lucide-arrow-right"
    :items="items"
  />
</template>

<!-- Custom Separator Slot (Text) -->
<template>
  <UBreadcrumb :items="items">
    <template #separator>
      /
    </template>
  </UBreadcrumb>
</template>

<!-- With Dropdown Menu Integration -->
<template>
  <UBreadcrumb :items="items">
    <template #item="{ item }">
      <UDropdown v-if="item.slot === 'dropdown'" :items="dropdownItems">
        <template #default>
          <UButton variant="ghost">{{ item.label }}</UButton>
        </template>
      </UDropdown>
      <span v-else>{{ item.label }}</span>
    </template>
  </UBreadcrumb>
</template>

<!-- With Icons and Avatars -->
<template>
  <UBreadcrumb
    :items="[
      { label: 'Home', icon: 'i-lucide-home', to: '/' },
      { label: 'User', avatar: { src: '/avatar.jpg' }, to: '/user' },
      { label: 'Profile' }
    ]"
  />
</template>
```

## Props API

**Core Props:**
- `items` (BreadcrumbItem[]): Array of breadcrumb navigation items
- `separator-icon` (string): Icon between items, defaults to `i-lucide-chevron-right`
- `label-key` (string): Property key for item labels, defaults to `'label'`
- `as` (string): Element to render as, defaults to `'nav'`
- `ui` (object): Object for customizing component styling

**BreadcrumbItem Interface:**
- `label` (string): Display text
- `icon` (string): Leading icon identifier
- `avatar` (object): Avatar properties
- `slot` (string): Custom slot reference
- `class` (string): Item-specific styling
- `to` (string | object): Navigation route (Link component properties)
- `target` (string): Window target attribute
- `disabled` (boolean): Disable item interaction
- Additional Link component props: `download`, `hreflang`, `media`, `ping`, `referrerpolicy`

## Slots API

| Slot | Scope | Description |
|------|-------|-------------|
| `#item` | `{ item }` | Complete item customization |
| `#item-leading` | `{ item }` | Icon/avatar area customization |
| `#item-label` | `{ item }` | Text content area customization |
| `#item-trailing` | `{ item }` | Right-side content customization |
| `#separator` | - | Divider between items customization |
| `#[item.slot]` | `{ item }` | Named slot for specific items (dynamic) |

## Theme Configuration

**Default Slot Classes:**
```javascript
{
  root: 'relative min-w-0',
  list: 'flex items-center gap-1.5',
  link: 'text-sm gap-1.5 focus-visible:outline-primary',
  separator: {
    icon: {
      base: 'text-muted-foreground size-5'
    }
  }
}
```

**Customization Scope:**
- Root container positioning and sizing
- List wrapper flexbox layout and spacing
- Individual item styling (links, text)
- Icon and avatar sizing and colors
- Label typography and colors
- Separator icon appearance
- Focus states and active states

## Notable Features
- **Global Icon Customization**: `appConfig.ui.icons.chevronRight` allows app-wide separator icon override
- **TypeScript Type Inference**: `BreadcrumbItem` type provides full IDE support and type safety
- **Compound Variants**: Supports interactive states (hover, focus, active, disabled) with proper styling
- **Avatar Support**: Unique feature allowing user-based breadcrumbs with avatar images
- **Multi-Level Customization**: Three levels of customization (global app config, component theme, item-specific)
- **Flexible Link Component**: Full integration with Nuxt/Vue Router with all standard link attributes
- **Semantic HTML**: Uses `<nav>` element by default for proper accessibility
- **Dynamic Slot System**: Named slots via `item.slot` property for targeted customization
- **CSS Variables**: Utilizes Tailwind for responsive, themeable design
- **Focus Management**: Keyboard-only focus indicators with `:focus-visible` support

## Research Notes
- Documentation is well-structured with clear examples for common use cases
- The dropdown integration example demonstrates advanced composition patterns
- TypeScript support is first-class with exported types for all interfaces
- Component is part of a larger UI framework with consistent design patterns
- Vue 3 composition API patterns are evident throughout
- Strong integration with Nuxt ecosystem (NuxtLink, app config)
- Theme customization system is comprehensive and follows Tailwind conventions
- No significant difficulties accessing documentation; all examples were clear and functional
- Framework approach emphasizes flexibility through composition while providing sensible defaults
