# Nuxt UI - Pagination Usage Patterns

## Component URL
https://ui.nuxt.com/components/pagination
Status: ✅ Working
Version: Current (Nuxt UI 3.0+)
Last Verified: 2025-11-06

## Documentation Quality
Comprehensive - The documentation provides thorough coverage of pagination configuration, control modes, and customization options with clear examples. Demonstrates flexible page range display logic, router integration, and styling variations.

## Component Definition
- **Core purpose**: Enables navigation through paginated content by displaying a list of numbered page buttons with optional directional controls. Solves the UX challenge of navigating large datasets without overwhelming the interface with too many options.
- **Mental model**: Users think of pagination as "a way to navigate sequentially through chunks of content" where they can jump to specific pages, move forward/backward, or skip to the beginning/end. The component intelligently collapses page ranges to keep the interface compact and focused.
- **Semantic meaning**: Represents sequential navigation controls for divided content. Commonly used for data tables, search results, product listings, and any scenario where displaying all content at once would degrade performance or usability.

## Pattern Support Levels
- **Native**: Dedicated prop/API
- **Composed**: Via composition/children
- **CSS-only**: Requires custom styling

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Page numbers | ✅ | Native | Displays current page + sibling pages (controlled via `siblingCount` prop, default 2 on each side). Intelligently collapses with ellipsis when range is large. |
| Previous/Next buttons | ✅ | Native | Via `showControls` prop (default: true). Previous/Next navigation arrows displayed on left/right of page numbers. Icons customizable via `prevIcon` and `nextIcon` props. |
| First/Last buttons | ✅ | Native | Via `showControls` prop (default: true). First/Last page buttons displayed at far left/right when controls enabled. Icons customizable via `firstIcon` and `lastIcon` props. |
| Page size selector | ❌ | Not supported | No built-in items-per-page selector UI. Must implement separately and control via `itemsPerPage` prop. |
| Total count display | ⚠️ | Implicit | Total items passed via `total` prop for calculation but not visually displayed. Component calculates total pages from `total / itemsPerPage`. Must implement separate display component. |
| Quick jumper | ❌ | Not supported | No built-in "jump to page X" input field. Only click-based navigation through visible page buttons. |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅ | Native | Via `size` prop: `xs`, `sm`, `md` (default), `lg`, `xl`. Controls dimensions of all buttons simultaneously. |
| Simplified mode | ✅ | Native | Via `showControls={false}`. Hides first/previous/next/last buttons, showing only page numbers. Useful for compact layouts. |
| Button style | ✅ | Native | Inactive buttons: `color` (default: 'neutral') and `variant` (default: 'outline') props. Active button: `activeColor` (default: 'primary') and `activeVariant` (default: 'solid') props. |
| Disabled state | ✅ | Native | Via `disabled` prop. Disables all buttons and interactions. Applies disabled styling to entire pagination control. |
| Custom rendering | ✅ | Native | Via `to` function prop. Transforms page buttons into router links instead of button elements. Enables URL-based pagination without client-side click handlers. |

## Behavior Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| onChange callback | ⚠️ | Via v-model | No dedicated onChange event. State changes trigger `v-model:page` updates which can be watched/computed. |
| Controlled mode | ✅ | Native | Via `v-model:page` binding. Parent component fully controls current page state. Updates on user interaction trigger v-model sync. |
| Uncontrolled mode | ✅ | Native | Via `defaultPage` prop. Component manages its own page state internally. Useful for standalone pagination without external state management. |
| Keyboard navigation | ❌ | Not documented | No documented keyboard shortcuts for page navigation. Standard button tab navigation applies but no arrow key support or page jump shortcuts. |

## Code Examples

### Basic Usage
```vue
<script setup lang="ts">
const page = ref(5)
</script>

<template>
  <!-- Simplest pagination: total items and current page -->
  <UPagination v-model:page="page" :total="100" />
</template>
```

### With Items Per Page
```vue
<script setup lang="ts">
const page = ref(5)
</script>

<template>
  <!-- Control items per page (affects total pages calculation) -->
  <UPagination v-model:page="page" :items-per-page="20" :total="100" />
</template>
```

### With Sibling Count
```vue
<script setup lang="ts">
const page = ref(5)
</script>

<template>
  <!-- Control how many page buttons shown on each side of current page -->
  <UPagination v-model:page="page" :sibling-count="1" :total="100" />
</template>
```

### Show Edges
```vue
<script setup lang="ts">
const page = ref(5)
</script>

<template>
  <!-- Always show first/last pages with ellipsis when gap exists -->
  <UPagination v-model:page="page" show-edges :sibling-count="1" :total="100" />
</template>
```

### Hide Controls
```vue
<script setup lang="ts">
const page = ref(5)
</script>

<template>
  <!-- Simplified mode: only page numbers, no first/prev/next/last buttons -->
  <UPagination
    v-model:page="page"
    :show-controls="false"
    show-edges
    :total="100"
  />
</template>
```

### With Color
```vue
<script setup lang="ts">
const page = ref(5)
</script>

<template>
  <!-- Customize inactive button color -->
  <UPagination v-model:page="page" color="primary" :total="100" />
</template>
```

### With Variant
```vue
<script setup lang="ts">
const page = ref(5)
</script>

<template>
  <!-- Customize inactive button variant -->
  <UPagination
    v-model:page="page"
    color="neutral"
    variant="subtle"
    :total="100"
  />
</template>
```

### Active Color
```vue
<script setup lang="ts">
const page = ref(5)
</script>

<template>
  <!-- Customize active/current page button color -->
  <UPagination
    v-model:page="page"
    active-color="neutral"
    :total="100"
  />
</template>
```

### Active Variant
```vue
<script setup lang="ts">
const page = ref(5)
</script>

<template>
  <!-- Customize active/current page button variant -->
  <UPagination
    v-model:page="page"
    active-color="primary"
    active-variant="subtle"
    :total="100"
  />
</template>
```

### Size Variation
```vue
<script setup lang="ts">
const page = ref(5)
</script>

<template>
  <!-- Control size of all pagination buttons -->
  <UPagination v-model:page="page" size="xl" :total="100" />
</template>
```

### Disabled State
```vue
<script setup lang="ts">
const page = ref(5)
</script>

<template>
  <!-- Disable all pagination interactions -->
  <UPagination v-model:page="page" :total="100" disabled />
</template>
```

### With Links (Router Integration)
```vue
<script setup lang="ts">
const page = ref(5)

// Transform page buttons into router links
function to(page: number) {
  return {
    query: {
      page
    },
    hash: '#with-links'
  }
}
</script>

<template>
  <!-- Page buttons become navigable links instead of buttons -->
  <UPagination
    v-model:page="page"
    :total="100"
    :to="to"
    :sibling-count="1"
    show-edges
  />
</template>
```

### Uncontrolled Mode
```vue
<script setup lang="ts">
// Component manages its own state
</script>

<template>
  <!-- Set initial page but let component control its own state -->
  <UPagination :default-page="3" :total="100" />
</template>
```

### Complete Configuration Example
```vue
<script setup lang="ts">
const page = ref(1)
const itemsPerPage = ref(25)
const totalItems = ref(250)

// Router integration
function toPaginationPage(pageNum: number) {
  return {
    query: { page: pageNum },
    hash: '#results'
  }
}
</script>

<template>
  <!-- Fully configured pagination -->
  <UPagination
    v-model:page="page"
    :total="totalItems"
    :items-per-page="itemsPerPage"
    :sibling-count="2"
    show-edges
    show-controls
    size="md"
    color="neutral"
    variant="outline"
    active-color="primary"
    active-variant="solid"
    :to="toPaginationPage"
    :first-icon="'i-lucide-chevrons-left'"
    :prev-icon="'i-lucide-chevron-left'"
    :next-icon="'i-lucide-chevron-right'"
    :last-icon="'i-lucide-chevrons-right'"
    :ellipsis-icon="'i-lucide-more-horizontal'"
  />
</template>
```

## Notable Features
- **Intelligent page range algorithm**: Automatically collapses page numbers with ellipsis based on `siblingCount` and `showEdges` props. Keeps UI compact while maintaining navigation options.
- **Dual state management**: Supports both controlled (`v-model:page`) and uncontrolled (`defaultPage`) modes for flexibility in different architectural patterns.
- **Native router integration**: `to` prop function transforms buttons into Vue Router links, enabling URL-based pagination without custom click handlers. Supports query params, hashes, and full route objects.
- **Comprehensive styling control**: Separate props for active/inactive button colors and variants. Integrates with Nuxt UI theme system (primary, neutral, secondary, etc.).
- **Customizable icons**: All navigation icons (first, prev, next, last, ellipsis) replaceable via props. Accepts string identifiers or icon objects.
- **No external dependencies**: Built on Nuxt UI's Button component with no additional libraries required.
- **Calculated total pages**: Automatically computes total pages from `total / itemsPerPage`, eliminating manual calculation burden.

## Research Notes
- Documentation is thorough with clear visual examples and interactive demos.
- Component focuses on core pagination UI without including auxiliary features like page size selectors or total count displays - these must be implemented separately.
- No explicit accessibility features (ARIA attributes, keyboard shortcuts) documented beyond standard button semantics.
- The `showEdges` + `siblingCount` combination provides sophisticated control over page range display density.
- Router integration via `to` prop is particularly elegant for SEO-friendly pagination.
- The component follows Nuxt UI's composition API patterns and theme system conventions.

---

Research completed: 2025-11-06
Component: Pagination
Framework: Nuxt UI
Documentation: https://ui.nuxt.com/components/pagination
