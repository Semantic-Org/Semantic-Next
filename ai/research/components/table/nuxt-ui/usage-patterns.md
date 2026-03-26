# Nuxt UI - Table Usage Patterns

> Last Modified: 2025-11-04

## Component URL
https://ui.nuxt.com/components/table
Status: ✅ Working

## Documentation Quality
**Assessment: Good**

The documentation is well-structured with comprehensive example coverage (11+ use cases) demonstrating progressive complexity from basic to advanced patterns. Strong emphasis on practical implementation with interactive demos and TypeScript integration. However, it lacks depth in certain areas:
- Performance considerations are not discussed
- Sorting/filtering APIs are referenced but not detailed
- Accessibility patterns receive minimal coverage
- Advanced TanStack Table features (column resizing, reordering, pagination) are not demonstrated

Overall: Example-driven documentation effective for implementation but requires consulting TanStack Table docs for advanced features.

## Component Definition
- **Core purpose**: Display structured data in rows and columns with support for interactions like selection, sorting, grouping, and expansion. Built on TanStack Table v8 to provide a type-safe, flexible data table API.
- **Mental model**: A declarative data visualization component where data flows through column definitions to create a reactive table. Think of it as a "spreadsheet-like" interface for displaying and manipulating structured data, with the underlying TanStack Table providing advanced state management and table logic.
- **Semantic meaning**: Represents tabular data with semantic HTML table structure. Communicates structured information where relationships between data points are important, typically used for dashboards, admin interfaces, data grids, and anywhere users need to scan, compare, or manipulate rows of related information.

## Content Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Plain data cells | ✅ | Automatic column generation from object keys when columns prop is not provided. Simple display of primitive values (strings, numbers, booleans). |
| Custom cell rendering | ✅ | Column definitions support `cell` and `header` functions using Vue's `h()` render function. Enables rendering components like Badge, Button, Avatar, or any Vue component within cells. Example: `cell: (props) => h(UBadge, { label: props.row.original.status })` |
| Nested/expandable rows | ✅ | Expandable rows via `#expanded` slot and `v-model:expanded`. Each row can toggle expansion using `row.toggleExpanded()`. The expanded slot receives the full row data for rendering detailed content. |
| Action columns | ✅ | DropdownMenu components can be rendered in cells for row-level operations (edit, delete, etc.). Also supports `@select` event for row clicks and `@contextmenu` for right-click actions. |

## Type Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Basic table | ✅ | Simplest usage: `<UTable :data="data" />` automatically generates columns from data object keys. No column configuration needed. |
| Data table | ✅ | Explicit column definitions with typed accessors, custom formatting, and render functions. Full control over column display, sorting, filtering, and cell rendering. |
| Tree table | ✅ | Hierarchical data via `grouping` prop with column IDs to group by. Supports aggregation functions (count, sum, uniqueCount, max) for grouped rows. Requires `getGroupedRowModel` from TanStack Table. |

## State Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Loading | ✅ | Boolean `loading` prop displays overlay. Customizable with `loadingColor` (color variant) and `loadingAnimation` (e.g., 'carousel'). Visual feedback while data is being fetched. |
| Empty | ⚠️ | Not explicitly documented. No dedicated empty state pattern or slot shown in the docs. Likely handled by conditional rendering around the table. |
| Error | ❌ | No error state pattern documented. Error handling would need to be implemented at the application level with conditional rendering. |
| Selected rows | ✅ | Row selection via `v-model:row-selection` binding to object tracking selected row IDs. Supports checkbox column with select-all functionality. `@select` event fires when rows are clicked. |

## Variation Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Size options | ❌ | No size variants documented (no small, medium, large props). |
| Bordered | ❌ | Not explicitly shown, though likely achievable via CSS classes or styling props. |
| Striped rows | ❌ | Not documented. May be achievable through row meta styling. |
| Hoverable rows | ⚠️ | `@hover` event is documented, suggesting hover state tracking is possible, but no visual hover styling pattern is shown. |
| Fixed header | ✅ | `sticky` boolean prop makes headers and footers sticky during scroll. |
| Fixed columns | ❌ | Not documented. TanStack Table supports this but not shown in Nuxt UI docs. |
| Scrollable | ✅ | Implicit - tables are scrollable by nature. Sticky header pattern implies vertical scrolling. |
| Responsive | ⚠️ | Not explicitly documented. No mobile/tablet-specific patterns or responsive table strategies shown. |

## Interactive Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Sorting | ⚠️ | Referenced as supported via TanStack Table APIs but not demonstrated with code examples. No visual sorting UI shown in docs. |
| Filtering | ⚠️ | Referenced as supported via TanStack Table APIs but not detailed. No filtering implementation examples provided. |
| Pagination | ❌ | Not demonstrated in the documentation despite TanStack Table's built-in pagination support. |
| Row selection | ✅ | Full support via `v-model:row-selection` with checkbox column. `@select` event for click handling. Selection state is an object mapping row IDs to boolean values. |
| Column resizing | ❌ | Not documented. TanStack Table supports this feature but it's not shown in Nuxt UI implementation. |
| Column reordering | ❌ | Not documented. Not shown in Nuxt UI examples despite TanStack Table capability. |
| Cell editing | ❌ | No inline editing patterns shown. Would need custom implementation via cell render functions. |

## Code Examples

### Basic Usage
```vue
<template>
  <UTable :data="people" />
</template>

<script setup lang="ts">
const people = [
  { id: 1, name: 'Lindsay Walton', email: 'lindsay.walton@example.com' },
  { id: 2, name: 'Courtney Henry', email: 'courtney.henry@example.com' }
]
</script>
```

### Custom Columns with Render Functions
```typescript
const columns = [
  {
    key: 'id',
    label: 'ID'
  },
  {
    key: 'name',
    label: 'Name'
  },
  {
    key: 'status',
    label: 'Status',
    cell: (props) => h(UBadge, {
      label: props.row.original.status,
      color: props.row.original.status === 'active' ? 'green' : 'red'
    })
  },
  {
    key: 'actions',
    label: 'Actions',
    cell: (props) => h(UButton, {
      onClick: () => handleEdit(props.row.original)
    }, { default: () => 'Edit' })
  }
]
```

### Row Selection
```vue
<template>
  <UTable
    :data="people"
    :columns="columns"
    v-model:row-selection="selected"
    @select="onRowSelect"
  />
</template>

<script setup lang="ts">
const selected = ref({})

function onRowSelect(row) {
  console.log('Selected row:', row)
}
</script>
```

### Expandable Rows
```vue
<template>
  <UTable
    :data="people"
    v-model:expanded="expanded"
  >
    <template #expanded="{ row }">
      <div class="p-4">
        <p>Detailed information for {{ row.original.name }}</p>
        <p>Email: {{ row.original.email }}</p>
      </div>
    </template>
  </UTable>
</template>

<script setup lang="ts">
const expanded = ref({})

// Toggle expansion programmatically
function toggleRow(row) {
  row.toggleExpanded()
}
</script>
```

### Grouped/Tree Table
```typescript
import { getGroupedRowModel } from '@tanstack/vue-table'

const columns = [
  {
    key: 'department',
    label: 'Department',
    aggregationFn: 'count'
  },
  {
    key: 'salary',
    label: 'Salary',
    aggregationFn: 'sum'
  }
]

// In template
<UTable
  :data="employees"
  :columns="columns"
  :grouping="['department']"
  :grouping-options="{ getGroupedRowModel: getGroupedRowModel() }"
/>
```

### Context Menu Actions
```vue
<template>
  <UTable
    :data="people"
    @contextmenu="handleContextMenu"
  />
</template>

<script setup lang="ts">
function handleContextMenu(event) {
  // Show custom context menu based on row
  console.log('Right-clicked row:', event.row)
}
</script>
```

### Loading State
```vue
<template>
  <UTable
    :data="people"
    :loading="isLoading"
    loading-color="primary"
    loading-animation="carousel"
  />
</template>

<script setup lang="ts">
const isLoading = ref(true)

onMounted(async () => {
  // Fetch data
  await fetchPeople()
  isLoading.value = false
})
</script>
```

### Row Meta Styling
```typescript
const meta: TableMeta = {
  rows: {
    1: { class: 'bg-red-50' },  // Highlight specific row
    2: { style: 'font-weight: bold' }
  }
}

// In template
<UTable :data="people" :meta="meta" />
```

## Notable Features

### TanStack Table Integration
The component is built directly on TanStack Table v8, providing access to the full underlying API. This means developers can leverage TanStack's extensive feature set (sorting, filtering, pagination, column visibility, etc.) even if not explicitly documented in Nuxt UI's examples.

### Vue Render Function Cell Rendering
Unlike many table libraries that use slots for cell customization, Nuxt UI uses Vue's `h()` render function in column definitions. This provides more flexibility and type safety but requires familiarity with Vue's render function API.

### Compound Row Interactions
The component supports multiple interaction patterns simultaneously:
- Selection via checkboxes
- Expansion for detail views
- Click events for navigation
- Context menu for actions
- Hover events for previews

### Aggregation Functions
Built-in support for data aggregation when grouping rows:
- `count`: Count rows in group
- `sum`: Sum numeric values
- `uniqueCount`: Count unique values
- `max`: Maximum value in group

### Type Safety
Full TypeScript support with typed column definitions, data models, and event handlers. The integration with TanStack Table provides comprehensive type inference for row data, column accessors, and cell properties.

### Flexible Styling Architecture
Multiple styling entry points:
- Column-level classes and styles
- Row-level meta configuration
- Global table classes
- Sticky positioning controls

## Research Notes

### Accessing Documentation
The documentation was accessible without issues. The page structure is well-organized with a sidebar navigation for different table patterns and interactive examples embedded directly in the page.

### Framework Approach Observations

**Strengths:**
1. **TanStack Table Foundation**: By building on a mature, well-tested table library, Nuxt UI inherits battle-tested table logic and state management
2. **Progressive Complexity**: Examples start simple and build up to advanced patterns, making learning gradual
3. **Type Safety**: Strong TypeScript integration makes the API discoverable and reduces runtime errors
4. **Render Function Pattern**: Using `h()` for cells provides more flexibility than traditional slot-based approaches

**Interesting Decisions:**
1. **No Built-in Pagination Component**: Despite TanStack Table's pagination support, Nuxt UI doesn't provide a ready-made pagination UI component in the docs
2. **Minimal Styling Variants**: Unlike other Nuxt UI components which often have size/variant props, the Table is relatively unopinionated about visual styling
3. **Event-Driven Interactions**: Heavy use of events (`@select`, `@hover`, `@contextmenu`) rather than callback props

**Potential Gaps:**
1. **Accessibility**: Limited discussion of keyboard navigation, screen reader support, or ARIA attributes
2. **Performance**: No guidance on virtualization for large datasets despite TanStack Table's support
3. **Mobile Patterns**: No responsive table strategies or mobile-specific patterns documented
4. **Advanced Features**: Sorting, filtering, and pagination are referenced but not demonstrated with complete examples

### Implementation Considerations for Semantic UI

If implementing a similar table component for Semantic UI:

1. **Consider Shadow DOM implications**: TanStack Table assumes standard DOM; integration with Shadow DOM would require careful consideration
2. **Signals vs TanStack State**: Could use Semantic UI's signal system instead of TanStack's internal state management
3. **Template-based cell rendering**: Could use Semantic UI's template syntax instead of render functions for more declarative approach
4. **Built-in interaction patterns**: Semantic UI could provide ready-made sorting, filtering, pagination UIs rather than requiring users to build from TanStack primitives
5. **Accessibility-first**: Could emphasize keyboard navigation and screen reader support from the start
6. **Web component encapsulation**: Could provide better style isolation than TanStack Table's class-based approach
