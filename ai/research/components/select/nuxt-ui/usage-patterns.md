# Nuxt UI - Select Usage Patterns

## Component URL
https://ui.nuxt.com/components/select
Status: ✅ Working

## Documentation Quality
**Comprehensive** - Exceptionally well-structured with extensive prop documentation, 20+ code examples covering all major use cases, visual previews, TypeScript integration, and clear accessibility guidance. One of the most complete Select component documentations reviewed.

## Component Definition
- **Core purpose**: A select dropdown component for choosing from a list of options with support for single/multiple selection, grouped items, and rich content
- **Mental model**: An enhanced HTML select element that opens a popover dropdown showing a searchable/navigable list of options with support for icons, avatars, and custom content
- **Semantic meaning**: Form input control for option selection with full keyboard navigation and accessibility support. Built on Reka UI for solid accessibility primitives.

## Content Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Text items | ✅ | Simple string arrays for basic options |
| Object items | ✅ | `SelectItem` objects with `label`, `value`, `disabled`, `class` |
| Icon support | ✅ | Item-level `icon` prop and global `icon` prop for leading icon |
| Avatar support | ✅ | Item-level `avatar` prop and global `avatar` prop for leading avatar |
| Chip/badge support | ✅ | Item-level `chip` prop for colored badges in items |
| Custom slots | ✅ | `#leading`, `#item-label`, `#content` slots for complete customization |
| Grouped items | ✅ | Array-of-arrays syntax or `type: 'label'` for group headers |
| Separators | ✅ | `type: 'separator'` for visual dividers between groups |

## Type Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Single selection | ✅ | Default behavior with `v-model` binding |
| Multiple selection | ✅ | `multiple` prop enables multi-select with array values |
| String items | ✅ | Simple string arrays automatically converted to items |
| Object items | ✅ | Full `SelectItem` objects with label/value separation |
| Custom value key | ✅ | `value-key` prop allows custom property name (e.g., `"id"`) |
| Grouped/categorized | ✅ | Nested arrays or label items create visual groups |

## State Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Loading | ✅ | `loading` prop displays spinner, `loading-icon` customizes icon |
| Disabled | ✅ | `disabled` prop disables entire component |
| Disabled items | ✅ | Item-level `disabled: true` for individual option control |
| Open/closed | ✅ | `v-model:open` controls dropdown visibility programmatically |
| Empty state | ✅ | `placeholder` text shown when no selection |
| Default value | ✅ | `default-value` sets initial selection |
| Default open | ✅ | `default-open` starts dropdown open |

## Variation Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Size options | ✅ | Five sizes: `xs`, `sm`, `md`, `lg`, `xl` |
| Color options | ✅ | Seven semantic colors: `primary`, `secondary`, `success`, `info`, `warning`, `error`, `neutral` |
| Visual variants | ✅ | `variant` prop for different visual styles (e.g., `subtle`) |
| Highlight state | ✅ | `highlight` prop shows focus state styling |
| Arrow indicator | ✅ | `arrow` prop displays decorative arrow in button |
| Trailing icon | ✅ | `trailing-icon` customizes dropdown indicator (default: chevron-down) |
| Selected icon | ✅ | `selected-icon` customizes checkmark in selected items (default: check) |

## Code Examples

### Basic Usage (String Array)
```vue
<script setup lang="ts">
const items = ref(['Backlog', 'Todo', 'In Progress', 'Done'])
const value = ref('Backlog')
</script>

<template>
  <USelect v-model="value" :items="items" />
</template>
```

### With Object Items
```vue
<script setup lang="ts">
import type { SelectItem } from '@nuxt/ui'

const items = ref<SelectItem[]>([
  { label: 'Backlog', value: 'backlog' },
  { label: 'Todo', value: 'todo' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Done', value: 'done' }
])
const value = ref('backlog')
</script>

<template>
  <USelect v-model="value" :items="items" class="w-48" />
</template>
```

### Multiple Selection
```vue
<script setup lang="ts">
const items = ref(['Backlog', 'Todo', 'In Progress', 'Done'])
const value = ref(['Backlog', 'Todo'])
</script>

<template>
  <USelect v-model="value" multiple :items="items" class="w-48" />
</template>
```

### Grouped Items (Array of Arrays)
```vue
<script setup lang="ts">
const items = ref([
  ['Apple', 'Banana', 'Blueberry', 'Grapes', 'Pineapple'],
  ['Aubergine', 'Broccoli', 'Carrot', 'Courgette', 'Leek']
])
const value = ref('Apple')
</script>

<template>
  <USelect v-model="value" :items="items" class="w-48" />
</template>
```

### With Labels and Separators
```vue
<script setup lang="ts">
import type { SelectItem } from '@nuxt/ui'

const items = ref<SelectItem[]>([
  { type: 'label', label: 'Fruits' },
  'Apple',
  'Banana',
  'Blueberry',
  'Grapes',
  'Pineapple',
  { type: 'separator' },
  { type: 'label', label: 'Vegetables' },
  'Aubergine',
  'Broccoli',
  'Carrot',
  'Courgette',
  'Leek'
])
const value = ref('Apple')
</script>

<template>
  <USelect v-model="value" :items="items" class="w-48" />
</template>
```

### With Icons in Items
```vue
<script setup lang="ts">
import type { SelectItem } from '@nuxt/ui'

const items = ref([
  { label: 'Backlog', value: 'backlog', icon: 'i-lucide-circle-help' },
  { label: 'Todo', value: 'todo', icon: 'i-lucide-circle-plus' },
  { label: 'In Progress', value: 'in_progress', icon: 'i-lucide-circle-arrow-up' },
  { label: 'Done', value: 'done', icon: 'i-lucide-circle-check' }
] satisfies SelectItem[])
const value = ref(items.value[0]?.value)
const icon = computed(() => items.value.find(item => item.value === value.value)?.icon)
</script>

<template>
  <USelect v-model="value" :items="items" value-key="value" :icon="icon" class="w-48" />
</template>
```

### With Avatars in Items
```vue
<script setup lang="ts">
import type { SelectItem } from '@nuxt/ui'

const items = ref([
  {
    label: 'benjamincanac',
    value: 'benjamincanac',
    avatar: { src: 'https://github.com/benjamincanac.png', alt: 'benjamincanac' }
  },
  {
    label: 'romhml',
    value: 'romhml',
    avatar: { src: 'https://github.com/romhml.png', alt: 'romhml' }
  },
  {
    label: 'noook',
    value: 'noook',
    avatar: { src: 'https://github.com/noook.png', alt: 'noook' }
  },
  {
    label: 'sandros94',
    value: 'sandros94',
    avatar: { src: 'https://github.com/sandros94.png', alt: 'sandros94' }
  }
] satisfies SelectItem[])
const value = ref(items.value[0]?.value)
const avatar = computed(() => items.value.find(item => item.value === value.value)?.avatar)
</script>

<template>
  <USelect v-model="value" :items="items" value-key="value" :avatar="avatar" class="w-48" />
</template>
```

### With Chips/Badges in Items
```vue
<script setup lang="ts">
import type { SelectItem, ChipProps } from '@nuxt/ui'

const items = ref([
  { label: 'bug', value: 'bug', chip: { color: 'error' } },
  { label: 'feature', value: 'feature', chip: { color: 'success' } },
  { label: 'enhancement', value: 'enhancement', chip: { color: 'info' } }
] satisfies SelectItem[])
const value = ref(items.value[0]?.value)

function getChip(value: string) {
  return items.value.find(item => item.value === value)?.chip
}
</script>

<template>
  <USelect v-model="value" :items="items" value-key="value" class="w-48">
    <template #leading="{ modelValue, ui }">
      <UChip
        v-if="modelValue"
        v-bind="getChip(modelValue)"
        inset
        standalone
        :size="(ui.itemLeadingChipSize() as ChipProps['size'])"
        :class="ui.itemLeadingChip()"
      />
    </template>
  </USelect>
</template>
```

### With Custom Value Key
```vue
<script setup lang="ts">
import type { SelectItem } from '@nuxt/ui'

const items = ref<SelectItem[]>([
  { label: 'Backlog', id: 'backlog' },
  { label: 'Todo', id: 'todo' },
  { label: 'In Progress', id: 'in_progress' },
  { label: 'Done', id: 'done' }
])
const value = ref('backlog')
</script>

<template>
  <USelect v-model="value" value-key="id" :items="items" class="w-48" />
</template>
```

### With Loading State
```vue
<script setup lang="ts">
const items = ref(['Backlog', 'Todo', 'In Progress', 'Done'])
const value = ref('Backlog')
</script>

<template>
  <USelect v-model="value" loading :items="items" class="w-48" />
</template>
```

### With Custom Loading Icon
```vue
<script setup lang="ts">
const items = ref(['Backlog', 'Todo', 'In Progress', 'Done'])
const value = ref('Backlog')
</script>

<template>
  <USelect v-model="value" loading loading-icon="i-lucide-loader" :items="items" class="w-48" />
</template>
```

### Disabled State
```vue
<script setup lang="ts">
const items = ref(['Backlog', 'Todo', 'In Progress', 'Done'])
</script>

<template>
  <USelect disabled placeholder="Select status" :items="items" class="w-48" />
</template>
```

### With Placeholder
```vue
<script setup lang="ts">
const items = ref(['Backlog', 'Todo', 'In Progress', 'Done'])
</script>

<template>
  <USelect placeholder="Select status" :items="items" class="w-48" />
</template>
```

### With Content Positioning
```vue
<script setup lang="ts">
const items = ref(['Backlog', 'Todo', 'In Progress', 'Done'])
const value = ref('Backlog')
</script>

<template>
  <USelect
    v-model="value"
    :content="{ align: 'center', side: 'bottom', sideOffset: 8 }"
    :items="items"
    class="w-48"
  />
</template>
```

### With Arrow Indicator
```vue
<script setup lang="ts">
const items = ref(['Backlog', 'Todo', 'In Progress', 'Done'])
const value = ref('Backlog')
</script>

<template>
  <USelect v-model="value" arrow :items="items" class="w-48" />
</template>
```

### With Color and Highlight
```vue
<script setup lang="ts">
const items = ref(['Backlog', 'Todo', 'In Progress', 'Done'])
const value = ref('Backlog')
</script>

<template>
  <USelect v-model="value" color="neutral" highlight :items="items" class="w-48" />
</template>
```

### With Subtle Variant
```vue
<script setup lang="ts">
const items = ref(['Backlog', 'Todo', 'In Progress', 'Done'])
const value = ref('Backlog')
</script>

<template>
  <USelect v-model="value" color="neutral" variant="subtle" :items="items" class="w-48" />
</template>
```

### With Custom Size
```vue
<script setup lang="ts">
const items = ref(['Backlog', 'Todo', 'In Progress', 'Done'])
const value = ref('Backlog')
</script>

<template>
  <USelect v-model="value" size="xl" :items="items" class="w-48" />
</template>
```

### With Leading Icon
```vue
<script setup lang="ts">
const items = ref(['Backlog', 'Todo', 'In Progress', 'Done'])
const value = ref('Backlog')
</script>

<template>
  <USelect v-model="value" icon="i-lucide-search" size="md" :items="items" class="w-48" />
</template>
```

### With Custom Trailing Icon
```vue
<script setup lang="ts">
const items = ref(['Backlog', 'Todo', 'In Progress', 'Done'])
const value = ref('Backlog')
</script>

<template>
  <USelect
    v-model="value"
    trailing-icon="i-lucide-arrow-down"
    size="md"
    :items="items"
    class="w-48"
  />
</template>
```

### With Custom Selected Icon
```vue
<script setup lang="ts">
const items = ref(['Backlog', 'Todo', 'In Progress', 'Done'])
const value = ref('Backlog')
</script>

<template>
  <USelect v-model="value" selected-icon="i-lucide-flame" size="md" :items="items" class="w-48" />
</template>
```

### Control Open State with Keyboard Shortcuts
```vue
<script setup lang="ts">
const open = ref(false)
const items = ref(['Backlog', 'Todo', 'In Progress', 'Done'])
const value = ref('Backlog')

defineShortcuts({
  o: () => (open.value = !open.value)
})
</script>

<template>
  <USelect v-model="value" v-model:open="open" :items="items" class="w-48" />
</template>
```

### With Rotating Icon Animation
```vue
<script setup lang="ts">
const items = ref(['Backlog', 'Todo', 'In Progress', 'Done'])
const value = ref('Backlog')
</script>

<template>
  <USelect
    v-model="value"
    :items="items"
    :ui="{ trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200' }"
    class="w-48"
  />
</template>
```

### Fetching Items from API
```vue
<script setup lang="ts">
import type { AvatarProps } from '@nuxt/ui'

const { data: users, status } = await useFetch('https://jsonplaceholder.typicode.com/users', {
  key: 'typicode-users',
  transform: (data: { id: number; name: string }[]) => {
    return data?.map(user => ({
      label: user.name,
      value: String(user.id),
      avatar: { src: `https://i.pravatar.cc/120?img=${user.id}` }
    }))
  },
  lazy: true
})

function getUserAvatar(value: string) {
  return users.value?.find(user => user.value === value)?.avatar || {}
}
</script>

<template>
  <USelect
    :items="users"
    :loading="status === 'pending'"
    icon="i-lucide-user"
    placeholder="Select user"
    value-key="value"
    class="w-48"
  >
    <template #leading="{ modelValue, ui }">
      <UAvatar
        v-if="modelValue"
        v-bind="getUserAvatar(modelValue)"
        :size="(ui.leadingAvatarSize() as AvatarProps['size'])"
        :class="ui.leadingAvatar()"
      />
    </template>
  </USelect>
</template>
```

### Custom Item Label with Full Width
```vue
<script setup lang="ts">
const value = ref<string>()

const { data: users } = await useFetch('https://jsonplaceholder.typicode.com/users', {
  key: 'typicode-users-email',
  transform: (data: { id: number; name: string; email: string }[]) => {
    return data?.map(user => ({
      label: user.name,
      email: user.email,
      value: String(user.id),
      avatar: { src: `https://i.pravatar.cc/120?img=${user.id}` }
    }))
  },
  lazy: true
})
</script>

<template>
  <USelect
    v-model="value"
    :items="users"
    placeholder="Select user"
    value-key="value"
    :ui="{ content: 'min-w-fit' }"
    class="w-48"
  >
    <template #item-label="{ item }">
      {{ item.label }}
      <span class="text-muted">
        {{ item.email }}
      </span>
    </template>
  </USelect>
</template>
```

## Notable Features

### Rich Content Support
The Select component excels at displaying rich content beyond simple text:
- **Icons**: Both leading icons on the trigger and per-item icons
- **Avatars**: User avatars on trigger and in dropdown items
- **Chips/Badges**: Colored badges for categorization (e.g., issue types, priorities)
- **Custom slots**: Complete control over item rendering via `#item-label` slot

This makes it ideal for user selectors, status pickers, and categorized options.

### Flexible Item Structure
Items can be provided in multiple formats:
- **String arrays**: `['Option 1', 'Option 2']` - automatic label/value
- **Object arrays**: `[{ label: 'Display', value: 'internal' }]` - explicit separation
- **Grouped arrays**: `[['Group 1'], ['Group 2']]` - automatic separators
- **Mixed types**: Combine strings and objects with labels/separators

The `value-key` prop allows using custom property names (e.g., `id` instead of `value`).

### State Management Excellence
Comprehensive state control through props and v-model:
- **v-model**: Two-way binding for selected value(s)
- **v-model:open**: Control dropdown visibility programmatically
- **default-value**: Initial selection without reactivity
- **default-open**: Start with dropdown open
- **disabled**: Global and per-item disable states
- **loading**: Built-in loading state with customizable icon

The `v-model:open` feature enables advanced patterns like keyboard shortcuts to toggle the dropdown.

### TypeScript Integration
Strong TypeScript support with exported types:
- `SelectItem` interface for item definitions
- Type-safe props with union types for colors, sizes, variants
- `satisfies` operator for compile-time type checking
- Proper typing for slots and their props

### Positioning Control
The `content` prop provides granular popover positioning:
- `align`: 'start' | 'center' | 'end'
- `side`: 'top' | 'right' | 'bottom' | 'left'
- `sideOffset`: Numeric pixel offset from trigger

### Styling Architecture
Comprehensive UI customization via the `ui` prop:
- Component-level class overrides
- Per-item class application via `class` property
- Access to `ui` object in slots for consistent sizing
- Tailwind-first approach with design tokens
- Global theming via `app.config.ts`

### Built on Reka UI
Component leverages Reka UI (headless component library) providing:
- Solid accessibility primitives (ARIA attributes, keyboard navigation)
- Consistent component patterns across Nuxt UI ecosystem
- Focus management and screen reader support

## Research Notes

### Documentation Experience
- **Exceptional coverage**: 20+ code examples covering every major use case
- **Live previews**: Interactive examples with real-time editing
- **TypeScript examples**: All examples use TypeScript with proper typing
- **Progressive complexity**: Basic to advanced patterns in logical order
- **API integration**: Real-world examples with API data fetching
- **Visual clarity**: Clear prop tables with types and defaults

### Framework Approach Observations

1. **Vue-centric API**: Full Vue 3 Composition API integration
   - `v-model` for two-way binding
   - `v-model:open` for open state control
   - Computed properties for dynamic icon/avatar updates
   - Scoped slots for custom rendering

2. **Tailwind-first styling**: Deep Tailwind CSS integration
   - Utility classes for layout (`class="w-48"`)
   - Custom UI classes via `ui` prop
   - Design tokens for consistent theming
   - Responsive sizing classes

3. **Type-safe by design**: Full TypeScript support
   - Exported `SelectItem` type
   - Union types for prop validation
   - Proper generic typing for complex patterns
   - `satisfies` operator for type checking without widening

4. **Composition over configuration**:
   - Multiple component types (Avatar, Chip) integrate seamlessly
   - Slot-based customization for ultimate flexibility
   - Composable integration (e.g., `defineShortcuts`)
   - API data patterns with `useFetch`

5. **Accessibility-first**: Built on Reka UI primitives
   - Proper ARIA attributes
   - Full keyboard navigation
   - Focus management
   - Screen reader support

### Implementation Patterns

1. **Item flexibility**: String, object, and mixed arrays all supported
2. **Value separation**: `value-key` prop enables custom value properties
3. **Dynamic content**: Computed properties sync trigger content with selection
4. **Loading states**: Built-in loading prop with customizable icon
5. **Disabled granularity**: Global and per-item disable states
6. **Grouped items**: Multiple approaches (nested arrays, label items, separators)
7. **Open state control**: Programmatic toggle via `v-model:open`
8. **Content positioning**: Flexible popover placement with `content` prop
9. **Custom icons**: Three icon props (leading, trailing, selected) for full control
10. **Slot architecture**: Multiple slots with typed props for customization

### Comparison to Other Frameworks

**Strengths**:
- Most comprehensive content type support (icons, avatars, chips)
- Excellent TypeScript integration with exported types
- Superior documentation with 20+ examples
- Built-in loading states
- Programmatic open/close control
- Flexible item structures (strings, objects, grouped)
- Strong Nuxt/Vue ecosystem integration
- Real-world API integration examples

**Unique Features**:
- `v-model:open` for programmatic dropdown control
- Chip/badge integration in items
- Multiple grouping strategies
- `value-key` for custom value properties
- Rotating icon animation patterns
- `satisfies` operator examples for type safety

**Limitations**:
- Vue/Nuxt specific (not framework agnostic)
- No searchable/filterable built-in (requires separate Combobox component)
- No virtualization for large lists mentioned
- Limited accessibility customization beyond Reka UI defaults
- Tailwind dependency for full styling capabilities

**vs React frameworks** (Material-UI, Chakra):
- More flexible item structures
- Better TypeScript integration
- Cleaner API with less prop sprawl
- Superior documentation quality

**vs Headless UI/Radix**:
- Less unopinionated (styled by default)
- More batteries-included (loading, icons, avatars)
- Tighter framework integration
- Less customization depth at primitive level

**vs Ant Design/Semantic UI Classic**:
- More modern API design
- Better TypeScript support
- Cleaner Vue 3 patterns
- Less opinionated visual design

### Migration Considerations for Semantic UI

If porting this pattern to Semantic UI:

1. **Content type support**: Evaluate whether to support icons, avatars, chips natively or via slots
2. **Item structure flexibility**: Consider supporting string arrays, object arrays, and grouped arrays
3. **State management**: Implement `loading`, `disabled`, and `open` state controls
4. **Value separation**: Add `value-key` concept for custom value properties
5. **TypeScript**: Export item type definitions and ensure proper typing
6. **Slots vs props**: Balance between prop-based configuration and slot-based customization
7. **Grouping**: Determine best approach (nested arrays, special types, compound components)
8. **Multiple selection**: Implement with array value support
9. **Positioning**: Add popover positioning controls
10. **Framework agnostic**: Adapt Vue-specific patterns to web component APIs
11. **Accessibility**: Ensure ARIA attributes and keyboard navigation match or exceed Reka UI
12. **Visual customization**: Map Tailwind-based styling to Semantic UI's CSS token system

### Key Takeaways for Component Design

1. **Progressive API**: Start simple (string arrays) and scale to complex (typed objects)
2. **Rich content patterns**: Modern selects need icon, avatar, and badge support
3. **State control**: Loading, disabled, and open states should be first-class features
4. **TypeScript-first**: Export types and provide compile-time safety
5. **Flexible grouping**: Support multiple grouping strategies for different use cases
6. **Customization balance**: Props for common cases, slots for edge cases
7. **Real-world examples**: API integration examples show practical patterns
8. **Accessibility built-in**: Don't treat accessibility as an afterthought
9. **Documentation depth**: Comprehensive examples are critical for adoption
10. **Framework patterns**: Embrace framework idioms (v-model, computed, composables)
