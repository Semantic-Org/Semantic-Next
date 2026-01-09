# Nuxt UI - PageGrid Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://ui.nuxt.com/components/page-grid
Status: ✅ Working
Version: Current
Last Verified: 2025-11-05

## Documentation Quality
Good - Documentation provides clear examples, API reference, theme configuration details, and visual demonstrations. Includes both basic and advanced bento-style layout examples.

## Component Definition
- **Core purpose**: Provides a responsive container for displaying content in a flexible grid layout that automatically adapts from mobile (1 column) to desktop (3 columns)
- **Mental model**: A responsive grid system for organizing content cards or other components with automatic column adjustment based on viewport size
- **Semantic meaning**: Communicates structured content organization with responsive behavior, typically used for feature grids, card layouts, or dashboard-style interfaces

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `as` prop for custom element)
- **Composed**: Via composition/children (e.g., column/row spans via child utilities)
- **CSS-only**: Requires custom styling (e.g., gap customization via Tailwind config)

## Layout Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Auto-responsive columns | ✅ | Native | 1 column (mobile) → 2 columns (sm) → 3 columns (lg) via `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` |
| Bento-style layout | ✅ | Composed | Achieved via Tailwind utilities on children: `lg:col-span-2`, `lg:row-span-2` for asymmetric layouts |
| CSS Grid based | ✅ | Native | Uses CSS Grid with `display: grid` and responsive column definitions |

## Responsive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Breakpoints | ✅ | Native | Tailwind breakpoints: default (mobile), `sm:` (640px+), `lg:` (1024px+) |
| Auto column adjustment | ✅ | Native | Automatically adjusts columns: 1 col → 2 col → 3 col based on viewport |

## Spacing Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Gap control | ✅ | Native | Fixed default gap of 8 units (32px via `gap-8`) |
| Custom spacing | ✅ | CSS-only | Customizable via Tailwind theme configuration in `app.config.ts` or theme override |

## Sizing Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Column spans | ✅ | Composed | Applied to children via `class="lg:col-span-2"` for double-width items |
| Row spans | ✅ | Composed | Applied to children via `class="lg:row-span-2"` for double-height items |

## Code Examples

### Basic Usage
```vue
<template>
  <UPageGrid>
    <UPageCard
      v-for="(card, index) in cards"
      :key="index"
      v-bind="card"
    />
  </UPageGrid>
</template>

<script setup>
const cards = [
  {
    title: 'Feature 1',
    description: 'Description of feature 1',
    icon: 'i-heroicons-rocket-launch'
  },
  {
    title: 'Feature 2',
    description: 'Description of feature 2',
    icon: 'i-heroicons-sparkles'
  },
  // More cards...
]
</script>
```

### Bento-Style Layout with Spans
```vue
<template>
  <UPageGrid>
    <!-- Wide card spanning 2 columns with horizontal orientation -->
    <UPageCard
      class="lg:col-span-2"
      orientation="horizontal"
      title="Featured Item"
      description="This card spans two columns on large screens"
    >
      <UColorModeImage
        :light="lightImagePath"
        :dark="darkImagePath"
      />
    </UPageCard>

    <!-- Standard cards filling remaining space -->
    <UPageCard
      title="Standard Card 1"
      icon="i-heroicons-star"
    />

    <UPageCard
      title="Standard Card 2"
      icon="i-heroicons-heart"
    />

    <UPageCard
      title="Standard Card 3"
      icon="i-heroicons-bolt"
    />
  </UPageGrid>
</template>
```

### Custom Element Type
```vue
<template>
  <UPageGrid as="section">
    <UPageCard
      v-for="item in items"
      :key="item.id"
      v-bind="item"
    />
  </UPageGrid>
</template>
```

## Notable Features
- **Minimal API surface**: Only one prop (`as`) keeps the component simple and focused
- **Tailwind-first approach**: Leverages Tailwind's responsive utilities for grid behavior rather than custom props
- **Theme configurable**: Grid structure can be customized via `app.config.ts` or Nuxt UI theme configuration
- **Composition-friendly**: Designed to work seamlessly with `UPageCard`, `UColorModeImage`, and other Nuxt UI components
- **Bento-style flexibility**: Supports complex asymmetric layouts through child component utilities without requiring complex grid template definitions
- **Semantic HTML**: Supports custom element types via `as` prop for proper semantic structure
- **No JavaScript required**: Pure CSS-based responsive behavior via Tailwind classes

## Research Notes
- Documentation is well-structured with clear examples of both basic and advanced usage patterns
- The component philosophy emphasizes simplicity: minimal props, maximum composability
- Responsive behavior is entirely handled through Tailwind CSS classes rather than JavaScript breakpoint detection
- Primary use case is pairing with `UPageCard` components, though the grid accepts any child content
- Gap spacing is fixed at `gap-8` (32px) - customization requires theme-level changes rather than component-level props
- No built-in props for controlling column counts or responsive breakpoints; relies entirely on Tailwind theme configuration
- The bento-style pattern demonstrated in docs shows sophisticated layouts can be achieved with simple utility classes on children
- Integration with Nuxt's icon system (`i-heroicons-*`) and color mode (`UColorModeImage`) demonstrates tight ecosystem integration
