# Nuxt UI - Tree Usage Patterns

## Component URL
https://ui.nuxt.com/components/tree
Status: ✅ Working
Version: v4.1.0+
Last Verified: 2025-11-10

## Documentation Quality
Comprehensive - Excellent documentation with detailed props, events, slots, and multiple interactive examples.

## Component Definition
- **Core purpose**: Display and enable interaction with hierarchical tree-structured data through a nested, expandable/collapsible interface
- **Mental model**: A file system explorer or folder structure - items can contain children, be expanded to show nested content, and selected for actions
- **Semantic meaning**: Represents hierarchical relationships in data, communicating parent-child structure and allowing exploration of nested information

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `multiple={true}`, `nested={false}`)
- **Composed**: Via composition/children (e.g., custom slots for item rendering)
- **CSS-only**: Requires custom styling (e.g., custom class overrides via `ui` prop)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content | ✅ | Native | `label` property on TreeItem, or `label-key` prop to specify which property contains text |
| Icon support | ✅ | Native | `icon` (leading), `trailingIcon` (trailing), `expandedIcon`, `collapsedIcon` props with Lucide icon support |
| Custom content | ✅ | Composed | Slot system: `#item-wrapper`, `#item`, `#item-leading`, `#item-label`, `#item-trailing`, plus per-item slots via `slot` property |
| Badges/counts | ✅ | Composed | Via custom slots (e.g., `#item-trailing`) to render badges or counts |

## Interaction Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Expandable/collapsible | ✅ | Native | `defaultExpanded` per item, `v-model:expanded` for controlled state, `@toggle` event with `preventDefault()` support |
| Selectable nodes | ✅ | Native | `v-model` binding for selected items, `@select` event with preventDefault, `getKey` or `labelKey` for unique identification |
| Checkable nodes | ✅ | Composed | Via `#item-leading` slot with UCheckbox integration, includes indeterminate state support (v4.1+) |
| Draggable nodes | ✅ | Composed | Compatible with `@vueuse/integrations/useSortable` for drag-and-drop reordering (v4.1+) |
| Search/filter | ❌ | CSS-only | Not built-in, would require external filtering of items array |
| Multi-select | ✅ | Native | `multiple` prop enables multi-selection mode with array `v-model` binding |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Loading | ❌ | CSS-only | Not built-in, could use slots to show loading states |
| Disabled | ✅ | Native | `disabled` prop (global), `disabled` property per TreeItem |
| Selected | ✅ | Native | `v-model` binding tracks selected item(s), visual feedback automatic |
| Expanded/Collapsed | ✅ | Native | `defaultExpanded` per item (uncontrolled), `v-model:expanded` (controlled state) |
| Indeterminate | ✅ | Native | Checkbox indeterminate state when parent has partial child selection (v4.1+) |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Virtual scrolling | ✅ | Native | `virtualize` prop for large datasets (1000+ items), optional `estimate-size` for dynamic heights (v4.1+) |
| Directory tree | ✅ | Native | Default nested rendering with folder icons, `expandedIcon="i-lucide-folder-open"`, `collapsedIcon="i-lucide-folder"` |
| Connecting lines | ❌ | CSS-only | Not built-in, would require custom CSS styling |
| Block node style | ✅ | Native | Full-width clickable items by default, customizable via `ui` prop and size variants |
| Flat rendering | ✅ | Native | `nested="false"` displays all items at same level with visual indentation (v4.1+) |

## Code Examples

### Basic Directory Tree
```vue
<template>
  <UTree :items="items" />
</template>

<script setup>
const items = ref([
  {
    label: 'app/',
    defaultExpanded: true,
    children: [
      {
        label: 'composables/',
        children: [
          { label: 'useAuth.ts' },
          { label: 'useUser.ts' }
        ]
      },
      {
        label: 'components/',
        children: [
          { label: 'Header.vue' },
          { label: 'Footer.vue' }
        ]
      }
    ]
  },
  {
    label: 'package.json'
  }
])
</script>
```

### Multi-Select with Checkboxes and Propagation (v4.1+)
```vue
<template>
  <UTree
    v-model="selected"
    :items="items"
    multiple
    propagate-select
    bubble-select
  >
    <template #item-leading="{ selected, indeterminate, handleSelect }">
      <UCheckbox
        :model-value="indeterminate ? 'indeterminate' : selected"
        @change="handleSelect"
      />
    </template>
  </UTree>
</template>

<script setup>
const selected = ref([])
const items = ref([...]) // hierarchical data
</script>
```

### Controlled Expanded State
```vue
<template>
  <UTree
    v-model="selectedItems"
    v-model:expanded="expandedKeys"
    :items="items"
    :get-key="item => item.id"
  />
</template>

<script setup>
const selectedItems = ref([])
const expandedKeys = ref(['folder-1', 'folder-2']) // Array of unique keys

const items = ref([
  {
    id: 'folder-1',
    label: 'Documents',
    children: [...]
  }
])
</script>
```

### Custom Icons and Event Handling
```vue
<template>
  <UTree
    :items="items"
    expanded-icon="i-lucide-folder-open"
    collapsed-icon="i-lucide-folder"
    trailing-icon="i-lucide-chevron-down"
    @select="onSelect"
    @toggle="onToggle"
  />
</template>

<script setup>
const items = ref([
  {
    icon: 'i-lucide-file-text',
    label: 'README.md',
    onSelect: (e) => {
      // Per-item select handler
      console.log('Item selected', e.detail)
    },
    onToggle: (e) => {
      // Per-item toggle handler
      e.preventDefault() // Prevent default toggle
    }
  }
])

const onSelect = (event) => {
  // Global select handler
  console.log('Selected:', event.detail)
}

const onToggle = (event) => {
  // Global toggle handler
  console.log('Toggled:', event.detail)
}
</script>
```

### Virtualized Large Dataset (v4.1+)
```vue
<template>
  <UTree
    :items="largeDataset"
    virtualize
    :estimate-size="40"
  />
</template>

<script setup>
// For datasets with 1000+ items
const largeDataset = ref([...]) // Large hierarchical array
</script>
```

### Flat Rendering with Indentation (v4.1+)
```vue
<template>
  <UTree
    :items="items"
    :nested="false"
  />
</template>

<script setup>
// Items displayed at same level but visually indented based on depth
const items = ref([...])
</script>
```

### Custom Styling and Size Variants
```vue
<template>
  <UTree
    :items="items"
    color="success"
    size="lg"
    :ui="{
      item: {
        wrapper: 'custom-wrapper-class',
        label: 'custom-label-class'
      }
    }"
  />
</template>
```

[View Live Examples](https://ui.nuxt.com/components/tree)

## Notable Features

### Parent-Child Selection Propagation (v4.1+)
- **`propagate-select`**: When parent selected, automatically selects all children
- **`bubble-select`**: When all children selected, automatically selects parent
- **Indeterminate State**: Visual indication when parent has partial child selection
- These work seamlessly with checkbox integration via slots

### Flexible State Management
- **Uncontrolled**: Use `defaultExpanded` per item for initial state
- **Controlled**: Use `v-model:expanded` with array of keys for full control
- **Hybrid**: Combine both approaches as needed

### Event Prevention
- Both `@select` and `@toggle` events support `preventDefault()` at:
  - Global level (event handlers on component)
  - Item level (`onSelect`, `onToggle` in TreeItem object)
- Enables conditional interaction blocking and custom behaviors

### Performance Optimization
- **Virtualization** (v4.1+): Renders only visible items for large datasets
- **Dynamic Heights**: `estimate-size` prop for variable-height items
- Recommended threshold: Enable for 1000+ items

### Drag-and-Drop Integration (v4.1+)
- Compatible with VueUse's `useSortable` composable
- Enables reorderable tree structures
- Works with both nested and flat rendering modes

### Rich Customization
- **7 Color Variants**: primary, secondary, success, info, warning, error, neutral
- **5 Size Options**: xs, sm, md, lg, xl
- **Comprehensive Slots**: 6 built-in slots + custom per-item slots
- **UI Prop**: Deep styling customization for all component parts

### Unique Key Management
- **`get-key`**: Function to extract unique identifier from item
- **`label-key`**: String property name to use as identifier
- Fallback: Uses item reference if neither provided
- Essential for controlled `v-model:expanded` state

## Research Notes

### Documentation Strengths
- Clear, comprehensive API documentation with TypeScript interfaces
- Multiple practical examples covering common use cases
- Version-specific feature annotations (v4.1+)
- Interactive playground for live testing

### Framework Integration
- Built for Vue 3 with Composition API
- Leverages Vue's reactivity system (`v-model`, `ref`)
- Integrates with Nuxt UI ecosystem (UCheckbox, color system)
- Uses Lucide icons by default (customizable)

### Observations
- Recent version (v4.1) added significant features: virtualization, flat rendering, checkbox integration
- Emphasis on performance for large datasets
- Strong parent-child relationship management
- No built-in search/filter - expected to be handled externally
- Connecting lines not supported natively (common in some tree UIs)
- Documentation clearly distinguishes between different version capabilities
