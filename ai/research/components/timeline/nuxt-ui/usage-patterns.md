# Nuxt UI - Timeline Usage Patterns

## Component URL
https://ui.nuxt.com/components/timeline
Status: ✅ Working
Version: 4.1.0
Last Verified: 2025-11-10

## Documentation Quality
Comprehensive - Well-structured with multiple practical examples, TypeScript types, interactive demos, and realistic use cases (project phases, GitHub events, pull request activity).

## Component Definition
- **Core purpose**: Renders a visual sequence of events with dates, titles, icons or avatars for displaying chronological information flows, project phases, workflow progression, or activity feeds.
- **Mental model**: Sequential event progression where users conceptually "move through" milestones or stages marked by visual indicators along a timeline.
- **Semantic meaning**: Communicates workflow progression, project phases, historical events, or activity feeds through spatial-temporal arrangement with clear visual hierarchy and directional flow.

## Pattern Support Levels
- **Native**: Dedicated props for orientation, color, size, active state, and direction (e.g., `orientation="vertical"`, `color="primary"`, `v-model` for active item)
- **Composed**: Via items array with object structure and slot-based content projection
- **CSS-only**: Per-item and global UI customization via Tailwind classes

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content | ✅ | Native | `title`, `description`, and `date` properties on items |
| Icon support | ✅ | Native | String-based icon names using Lucide icons or custom icon objects |
| Custom content | ✅ | Composed | Dynamic slot naming: `#{{ item.slot }}-indicator`, `#{{ item.slot }}-date`, `#{{ item.slot }}-title`, `#{{ item.slot }}-description` |
| Timestamps | ✅ | Native | `date` property on each timeline item |
| Descriptions | ✅ | Native | `description` property for detailed event information |
| Avatars | ✅ | Native | `avatar` property with AvatarProps integration for alternative indicators |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Vertical layout | ✅ | Native | Default `orientation="vertical"` for stacked chronological display |
| Horizontal layout | ✅ | Native | `orientation="horizontal"` for side-by-side event progression |
| Alternate layout | ✅ | CSS-only | Achieved through Tailwind utilities: `even:flex-row-reverse even:-translate-x-[calc(100%-2rem)] even:text-right` for left-right alternation |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Active state | ✅ | Native | Controlled via `v-model` for reactive active item tracking or `defaultValue` for initial state |
| Index-based tracking | ✅ | Native | Active item identified by array index position |
| Value-based tracking | ✅ | Native | Items can use custom `value` property as identifier instead of array index |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Color options | ✅ | Native | Seven semantic colors via `color` prop: `primary`, `secondary`, `success`, `info`, `warning`, `error`, `neutral` |
| Indicator variants | ✅ | Native | Supports icons (Lucide), avatars (AvatarProps), or custom slot content |
| Connector styles | ✅ | CSS-only | Visual line connecting items; customizable via `ui` prop with Tailwind classes |
| Size options | ✅ | Native | Nine size increments via `size` prop: `3xs`, `2xs`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl` |
| Direction control | ✅ | Native | `reverse` boolean prop to reverse timeline direction |

## Code Examples

### Basic Timeline with Icons
```vue
<template>
  <UTimeline
    :items="items"
    color="primary"
  />
</template>

<script setup>
const items = [
  { date: 'April 2023', title: 'Project Initiation', description: 'Kickoff meeting held' },
  { date: 'May 2023', title: 'Design Phase', description: 'UI/UX designs completed' },
  { date: 'June 2023', title: 'Development', description: 'Backend implementation started' }
]
</script>
```

### Timeline with Custom Icons
```vue
<template>
  <UTimeline
    :items="items"
    color="success"
    size="md"
  />
</template>

<script setup>
const items = [
  {
    date: '2024-01-15',
    title: 'Release v1.0',
    icon: 'i-heroicons-rocket-launch',
    description: 'Initial production release'
  },
  {
    date: '2024-02-10',
    title: 'Bug Fixes',
    icon: 'i-heroicons-bug-ant',
    description: 'Critical patches deployed'
  },
  {
    date: '2024-03-01',
    title: 'Feature Release',
    icon: 'i-heroicons-sparkles',
    description: 'New functionality added'
  }
]
</script>
```

### Horizontal Timeline with Avatars
```vue
<template>
  <UTimeline
    :items="items"
    orientation="horizontal"
    color="info"
    size="sm"
  />
</template>

<script setup>
const items = [
  {
    date: 'Week 1',
    title: 'Alice',
    avatar: { src: 'https://i.pravatar.cc/150?img=1' },
    description: 'Initial code review'
  },
  {
    date: 'Week 2',
    title: 'Bob',
    avatar: { src: 'https://i.pravatar.cc/150?img=2' },
    description: 'Feature implementation'
  }
]
</script>
```

### Controlled Active State
```vue
<template>
  <div>
    <UTimeline
      v-model="activeIndex"
      :items="items"
      color="warning"
    />
    <p class="mt-4">Current Step: {{ activeIndex + 1 }} of {{ items.length }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const activeIndex = ref(0)
const items = [
  { date: 'Step 1', title: 'Registration', description: 'Create account' },
  { date: 'Step 2', title: 'Verification', description: 'Confirm email' },
  { date: 'Step 3', title: 'Profile Setup', description: 'Complete profile' },
  { date: 'Step 4', title: 'Ready', description: 'Start using app' }
]
</script>
```

### Custom Slots for Advanced Layouts
```vue
<template>
  <UTimeline
    :items="items"
  >
    <template #custom-indicator>
      <div class="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
        <UIcon name="i-heroicons-check" class="w-4 h-4 text-white" />
      </div>
    </template>

    <template #custom-title="{ item }">
      <div class="font-bold text-lg text-blue-600">{{ item.title }}</div>
    </template>

    <template #custom-description="{ item }">
      <p class="text-gray-600 italic">{{ item.description }}</p>
    </template>
  </UTimeline>
</template>

<script setup>
const items = [
  { slot: 'custom', date: '2024-01-01', title: 'Completed Task 1', description: 'Successfully finished' },
  { slot: 'custom', date: '2024-01-02', title: 'Completed Task 2', description: 'On schedule' },
  { slot: 'custom', date: '2024-01-03', title: 'Completed Task 3', description: 'Ahead of time' }
]
</script>
```

### Alternating Timeline (Left-Right)
```vue
<template>
  <div class="space-y-4">
    <div v-for="(item, index) in items" :key="index" class="flex" :class="{ 'flex-row-reverse': index % 2 === 0 }">
      <div class="w-1/2" :class="{ 'text-right': index % 2 === 0 }">
        <h3 class="font-bold">{{ item.title }}</h3>
        <p class="text-gray-600">{{ item.date }}</p>
      </div>
      <div class="w-1/2">
        <UTimeline :items="[item]" />
      </div>
    </div>
  </div>
</template>

<script setup>
const items = [
  { date: '2024-01-01', title: 'Event A', description: 'First milestone' },
  { date: '2024-02-01', title: 'Event B', description: 'Second milestone' },
  { date: '2024-03-01', title: 'Event C', description: 'Third milestone' }
]
</script>
```

### Reversed Timeline
```vue
<template>
  <UTimeline
    :items="items"
    reverse
    color="error"
  />
</template>

<script setup>
const items = [
  { date: '2024-03-01', title: 'Latest: v1.2', description: 'Most recent release' },
  { date: '2024-02-01', title: 'v1.1', description: 'Previous release' },
  { date: '2024-01-01', title: 'v1.0', description: 'Initial release' }
]
</script>
```

## Notable Features

- **Flexible Indicator System**: Supports three indicator types—icons (Lucide icon strings), avatars (AvatarProps), or custom slot content—providing visual variety for different use cases.

- **Bi-directional Layout Support**: Combines `orientation` prop (vertical/horizontal) with `reverse` boolean for four directional possibilities, enabling diverse narrative flows.

- **Semantic Color Palette**: Seven color options (`primary`, `secondary`, `success`, `info`, `warning`, `error`, `neutral`) provide semantic clarity and visual hierarchy for different timeline purposes (progress steps, milestones, alerts, etc.).

- **Granular Size Control**: Nine size increments from `3xs` to `3xl` enable size-appropriate indicator and text scaling for different density requirements.

- **Dynamic Slot Architecture**: Slot names generated from item's `slot` property enable per-item content customization without creating separate component instances (`#{{ item.slot }}-indicator`, `#{{ item.slot }}-date`, etc.).

- **Value-Based Activation**: Items can define custom `value` property for non-index-based active state tracking, useful for data-driven applications where array order differs from logical identifiers.

- **Per-Item UI Customization**: Each item can override global styles via its `ui` property with Tailwind class overrides, enabling fine-grained design control without component duplication.

## Research Notes

- **Accessibility**: The component uses semantic HTML structure with proper ARIA attributes in its internal template, though custom slots should maintain accessibility considerations.
- **Vue 3 Composables**: Built on Composition API with TypeScript support, enabling tree-shaking and optimal bundle sizes when using TypeScript.
- **Tailwind Dependency**: All styling built on Tailwind CSS utilities; alternate slot content must also use Tailwind for consistent theming.
- **Active State Pattern**: The `v-model`/`defaultValue` pattern is reactive—changes propagate immediately, useful for multi-step forms, guided tours, or step-by-step processes.
- **No Built-in Animations**: Animations must be implemented via CSS transitions or Vue transitions; the component provides hooks (slots) for animation content.
- **Items Array Reactivity**: Changes to the items array are reactive—adding/removing/modifying items updates the timeline immediately without component remounting.
