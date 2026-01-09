# Nuxt UI - Accordion Component

> Last Modified: 2024-11-05

## Component URL
https://ui.nuxt.com/docs/components/accordion
Status: ✅ Working
Version: Current (Nuxt UI 3.0+)
Last Verified: 2024-11-05

## Documentation Quality
Comprehensive - The documentation provides thorough coverage of accordion configuration, control modes, and customization options with clear examples. Built on Reka UI primitives for accessibility and providing flexible multi-item support.

## Component Definition
- **Core purpose**: A stacked set of collapsible panels that display one or more expandable sections containing labeled headers and content. Supports single or multiple active items with flexible configuration for collapse behavior and content rendering strategy.
- **Mental model**: Users think of an accordion as "organized information I can expand/collapse to focus on what I need" with clear visual hierarchy between headers and content. Panels hide complexity by default and reveal details on demand.
- **Semantic meaning**: Represents grouped, hierarchical content organization with expandable details. Commonly used for FAQs, documentation sections, settings groups, and progressive disclosure patterns to manage information density.

## Pattern Support Levels
- **Native**: Dedicated prop/API
- **Composed**: Via composition/slots
- **CSS-only**: Requires custom styling

## Content Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Item labels | ✅ | Native | Via `label` property in item objects. Text displayed in accordion header/trigger. |
| Item content | ✅ | Native | Via `content` property in item objects. Simple string content rendered in panel body. |
| Custom content slots | ✅ | Composed | Via named slots `#body` and `#content` and item-specific slots `#[item.slot]`. Allows rich HTML/components. |
| Leading icons | ✅ | Native | Via `icon` property in item objects. Icon displayed before label in header. Accepts string identifier or icon object. |
| Trailing icons | ✅ | Native | Via `trailingIcon` property in item or global `trailing-icon` prop. Chevron icon by default, customizable per item. |
| Required indicators | ❌ | Not supported | No built-in required state indicator like checkbox component. |

## Type Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Single open mode | ✅ | Native | `type="single"` (default) - only one accordion item can be expanded at a time. Previously expanded item collapses when new one opens. |
| Multiple open mode | ✅ | Native | `type="multiple"` - multiple accordion items can be expanded simultaneously. Allows exploring multiple sections without collapsing others. |

## State Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Collapsed (default) | ✅ | Native | Default state when accordion loads. Items are closed, showing only headers. Set via `defaultValue` or no `v-model`. |
| Expanded/Active | ✅ | Native | When `v-model` or `defaultValue` references an item's value/index. Content is visible, header receives focus/styling. |
| Collapsible in single mode | ✅ | Native | Via `collapsible` prop (default: true). When true, clicking active item in single mode closes it. When false, at least one item remains open. |
| Disabled items | ✅ | Native | Via `disabled` boolean property on individual items. Prevents expansion, shows disabled styling, prevents keyboard interaction. |
| Unmount behavior | ✅ | Native | Via `unmount-on-hide` prop (default: true). When true, closes panels unmount content from DOM. When false, content remains mounted but hidden. |

## Variation Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Custom trailing icon | ✅ | Native | Via `trailing-icon` prop (global) or per-item `trailingIcon` property. Defaults to `chevronDown`. Accepts string identifier or icon object. Typically shows open/close indicator. |
| Per-item UI customization | ✅ | Native | Via `ui` property on individual items. Allows class overrides for specific items without affecting others. |
| Custom styling via ui prop | ✅ | Native | Global `ui` prop with keys for accordion root, item, trigger, content parts. Tailwind utility classes. |

## Interactive Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Controlled mode (single) | ✅ | Native | Via `v-model` binding to single value (string or number). Component value is fully controlled by parent. Updates on user interaction. |
| Controlled mode (multiple) | ✅ | Native | Via `v-model` binding to array of values. Multiple items can be active simultaneously. Parent controls which items are expanded. |
| Uncontrolled mode | ✅ | Native | Via `default-value` prop. Component manages its own active state. Useful for standalone accordions without external state management. |
| Item identification | ✅ | Native | Via `value` property on items (optional). Defaults to item index (0, 1, 2...). Custom values enable meaningful item references in controlled mode. |
| Content mounting strategy | ✅ | Native | Via `unmount-on-hide` prop. When true, hidden content removed from DOM (reduces DOM size). When false, hidden with CSS (better for animations). |

## Content Structure

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Simple string content | ✅ | Native | Via `content` property in item objects. For plain text or simple content. |
| Rich content via body slot | ✅ | Composed | Via `#body` slot. Pre-styled wrapper around content. Enables HTML and Vue components. Scope provides item context. |
| Full control content slot | ✅ | Composed | Via `#content` slot. Complete control without pre-styling. Useful for highly custom layouts. |
| Item-specific slots | ✅ | Composed | Via `#[item.slot]` where item.slot is custom slot name from item object. Enables different content structures per item. |
| Markdown support | ✅ | Composed | Via MDC component from `@nuxtjs/mdc` in body or content slots. Render markdown within accordion items. |
| Nested accordions | ⚠️ | Composed | Not explicitly documented but possible via content/body slots. Allows accordion within accordion for deep hierarchies. |

## Interactive Features

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Click to expand/collapse | ✅ | Native | Clicking accordion header toggles item expansion. Standard interaction pattern. |
| Keyboard navigation | ✅ | Native | Via Reka UI integration: Arrow keys navigate items, Enter/Space to expand/collapse. Supports standard accessibility patterns. |
| Focus management | ✅ | Native | Keyboard focus visible on headers. Follows WAI-ARIA accordion patterns for focus behavior. |
| Auto-scroll behavior | ⚠️ | Not documented | Scrolling to expanded content not explicitly documented but expected in most implementations. |
| Drag and drop reordering | ✅ | Composed | Via `useSortable` from `@vueuse/integrations`. Enable item reordering while maintaining accordion functionality. |

## Animation & Transitions

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Expand/collapse animation | ✅ | Native | Built-in animation when toggling panel visibility. Smooth height transitions on open/close. Powered by Reka UI. |
| Content fade transitions | ✅ | Native | Default animation includes fade effects on content visibility changes. |
| Custom animation timing | ⚠️ | CSS-only | Can customize via CSS classes in `ui` prop for item or content elements. Default animations provided by component. |
| Disable animations | ⚠️ | CSS-only | Can disable via CSS utilities in `ui` prop (e.g., `animate-none`). No explicit prop to disable. |
| `unmount-on-hide` impact | ✅ | Native | When true, unmounts DOM so Tailwind transitions don't apply. When false, hidden with CSS enabling transitions. |

## Integration Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Form integration | ⚠️ | Not standard | Accordion contains form fields but not itself a form control. Works within forms as content container. |
| Responsive behavior | ✅ | CSS-only | Customize via `ui` prop with responsive Tailwind classes. Component itself responsive via item width/styling. |
| with Navigation | ⚠️ | Composed | Can include navigation links in accordion content via slots. Not a navigation component itself. |
| FAQ/Help section | ✅ | Native | Ideal use case. Array of label/content pairs maps naturally to FAQ structure. |
| Settings groups | ✅ | Native | Group related settings under collapsible headers. Each setting group in separate item. |
| Progressive disclosure | ✅ | Native | Show basic info in header, details in expandable content. Reduces initial cognitive load. |

## Accessibility Features

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| ARIA attributes | ✅ | Native | Built on Reka UI which provides `role="region"`, `aria-expanded`, `aria-controls` attributes automatically. |
| Keyboard navigation | ✅ | Native | Arrow Up/Down to move between items, Home/End to jump to first/last. Enter/Space to expand/collapse. Tab navigates out of accordion. Standard WAI-ARIA accordion pattern. |
| Focus management | ✅ | Native | Focus visible on headers. Focus moves within accordion on keyboard navigation. Returns to trigger on collapse (standard pattern). |
| Semantic HTML | ✅ | Native | Uses button elements for triggers, proper heading hierarchy for labels. Semantic structure maintained through Reka UI primitives. |
| Screen reader support | ✅ | Native | ARIA labels and descriptions announced. Expanded/collapsed state announced. Item count and position may be announced depending on SR. |
| Label association | ✅ | Native | Each accordion header properly associated with its content via ARIA controls. Implicit via Reka UI. |
| Disabled state | ✅ | Native | Disabled items have `aria-disabled="true"`. Not focusable via keyboard. Keyboard shortcuts skip disabled items. |

## Key Properties/Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `AccordionItem[]` | required | Array of accordion items with label, content, and optional customization properties. |
| `type` | `"single" \| "multiple"` | `"single"` | Controls whether one or multiple items can be active simultaneously. |
| `collapsible` | `boolean` | `true` | In single mode, whether clicking active item closes it. If false, at least one item remains open. |
| `unmount-on-hide` | `boolean` | `true` | Whether to unmount hidden content from DOM or hide with CSS. Affects animations and DOM size. |
| `disabled` | `boolean` | `false` | Disables all items, preventing expansion and keyboard interaction. |
| `trailing-icon` | `string \| object` | `chevronDown` | Icon displayed on right of each header. Shows expand/collapse indicator. |
| `label-key` | `string` | `'label'` | Key used to access label from item objects. Enables custom item object structures. |
| `v-model` | `string \| number \| array` | undefined | Controlled mode binding. Single value for single mode, array for multiple mode. |
| `default-value` | `string \| number \| array` | undefined | Initial active item(s) for uncontrolled mode. |
| `ui` | `object` | `{}` | Custom CSS classes for component parts (root, item, trigger, content). |

## AccordionItem Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `label` | `string` | required | Header text displayed in accordion trigger. |
| `content` | `string` | optional | Simple text content in panel body. Not used if custom slot provided. |
| `value` | `string \| number` | item index | Unique identifier for item. Used in v-model and identifying active items. |
| `disabled` | `boolean` | `false` | Disable individual item. Prevents expansion and keyboard interaction. |
| `icon` | `string \| object` | undefined | Icon displayed before label in header. |
| `trailingIcon` | `string \| object` | from `trailing-icon` prop | Custom trailing icon for this specific item. Overrides global setting. |
| `slot` | `string` | undefined | Custom slot name for item-specific rendering. Used with `#[item.slot]` slot. |
| `class` | `string \| object` | undefined | Custom classes applied to item element. |
| `ui` | `object` | `{}` | Per-item UI customization. Overrides global ui prop for this item. |

## Slots API

| Slot | Scope | Description |
|------|-------|-------------|
| `#body` | `{ item: AccordionItem }` | Pre-styled content wrapper. Useful for standard content with HTML/components. Receives active item in scope. |
| `#content` | `{ item: AccordionItem }` | Full control over content rendering. No pre-styling. Complete layout control. |
| `#[item.slot]` | `{ item: AccordionItem }` | Custom named slot per item. Specify `slot` property on item to route to this slot. Enables per-item content structures. |

## Code Examples

### Basic Accordion
```vue
<script setup lang="ts">
import { ref } from 'vue'

const items = ref([
  {
    label: 'Is Nuxt UI free to use?',
    content: 'Yes! Nuxt UI is completely free and open source under the MIT license.'
  },
  {
    label: 'Can I use Nuxt UI with Vue without Nuxt?',
    content: 'Yes! While optimized for Nuxt, Nuxt UI works with standalone Vue projects.'
  },
  {
    label: 'What components are available?',
    content: 'Nuxt UI provides a comprehensive set of UI components for building modern web applications.'
  }
])
</script>

<template>
  <UAccordion :items="items" />
</template>
```

### Controlled Single Mode
```vue
<script setup lang="ts">
import { ref } from 'vue'

const activeItem = ref('0')
const items = ref([
  {
    label: 'Getting Started',
    content: 'Learn the basics of Nuxt UI and get your first component running.'
  },
  {
    label: 'Components',
    content: 'Explore the full component library with examples and documentation.'
  },
  {
    label: 'Customization',
    content: 'Customize components with the ui prop and Tailwind CSS classes.'
  }
])
</script>

<template>
  <!-- Open item by index -->
  <UAccordion v-model="activeItem" :items="items" />

  <!-- Control which item is active -->
  <button @click="activeItem = '1'">Open Components</button>
</template>
```

### Controlled Multiple Mode
```vue
<script setup lang="ts">
import { ref } from 'vue'

const activeItems = ref(['0', '2'])
const items = ref([
  {
    label: 'Installation',
    value: '0',
    content: 'npm install @nuxt/ui'
  },
  {
    label: 'Configuration',
    value: '1',
    content: 'Add components and customize settings in app.config.ts'
  },
  {
    label: 'Components',
    value: '2',
    content: 'Start using components in your project'
  }
])
</script>

<template>
  <!-- Multiple items can be open simultaneously -->
  <UAccordion
    v-model="activeItems"
    :items="items"
    type="multiple"
  />

  <!-- Control which items are active -->
  <button @click="activeItems = ['0', '1', '2']">Expand All</button>
  <button @click="activeItems = []">Collapse All</button>
</template>
```

### Uncontrolled Mode
```vue
<script setup lang="ts">
import { ref } from 'vue'

const items = ref([
  {
    label: 'Section 1',
    content: 'Content for section 1'
  },
  {
    label: 'Section 2',
    content: 'Content for section 2'
  }
])
</script>

<template>
  <!-- Component manages its own state -->
  <UAccordion :items="items" default-value="0" />
</template>
```

### Single Mode with Non-Collapsible Items
```vue
<script setup lang="ts">
import { ref } from 'vue'

const items = ref([
  {
    label: 'Always one open',
    content: 'At least one item must remain open'
  },
  {
    label: 'Cannot collapse',
    content: 'Click active item does not close it'
  }
])
</script>

<template>
  <!-- Prevent collapsing - always one item open -->
  <UAccordion :items="items" collapsible={false} />
</template>
```

### Items with Custom Values
```vue
<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref('faq')
const items = ref([
  {
    label: 'FAQ',
    value: 'faq',
    content: 'Frequently asked questions about our service'
  },
  {
    label: 'Pricing',
    value: 'pricing',
    content: 'View our pricing plans and options'
  },
  {
    label: 'Contact',
    value: 'contact',
    content: 'Get in touch with our team'
  }
])
</script>

<template>
  <UAccordion v-model="activeTab" :items="items" />

  <!-- Access current active section by meaningful identifier -->
  <p v-if="activeTab === 'faq'">Showing FAQ section</p>
</template>
```

### Disabled Items
```vue
<script setup lang="ts">
import { ref } from 'vue'

const items = ref([
  {
    label: 'Enabled',
    content: 'This item can be expanded'
  },
  {
    label: 'Disabled',
    disabled: true,
    content: 'This item cannot be expanded'
  },
  {
    label: 'Also Enabled',
    content: 'Another expandable item'
  }
])
</script>

<template>
  <UAccordion :items="items" />

  <!-- Can also disable all items -->
  <UAccordion :items="items" disabled />
</template>
```

### Custom Icons
```vue
<script setup lang="ts">
import { ref } from 'vue'

const items = ref([
  {
    label: 'Installation',
    icon: 'i-lucide-download',
    content: 'Install the package and get started'
  },
  {
    label: 'Documentation',
    icon: 'i-lucide-book',
    content: 'Read the full documentation'
  },
  {
    label: 'Examples',
    icon: 'i-lucide-code',
    trailingIcon: 'i-lucide-arrow-right',
    content: 'View code examples'
  }
])
</script>

<template>
  <!-- Custom trailing icon -->
  <UAccordion :items="items" trailing-icon="i-lucide-plus" />
</template>
```

### Rich Content with Body Slot
```vue
<script setup lang="ts">
import { ref } from 'vue'

const items = ref([
  {
    label: 'What is Nuxt UI?',
    content: 'undefined'
  },
  {
    label: 'How to install?',
    content: 'undefined'
  }
])
</script>

<template>
  <UAccordion :items="items">
    <template #body="{ item }">
      <!-- Pre-styled content wrapper -->
      <div v-if="item.label.includes('What')">
        <p>Nuxt UI is a comprehensive UI component library built on:</p>
        <ul>
          <li>Reka UI for accessibility</li>
          <li>Tailwind CSS for styling</li>
          <li>Vue 3 for reactivity</li>
        </ul>
      </div>

      <div v-else-if="item.label.includes('install')">
        <ol>
          <li>Run: npm install @nuxt/ui</li>
          <li>Add to nuxt.config.ts</li>
          <li>Start using components</li>
        </ol>
      </div>
    </template>
  </UAccordion>
</template>
```

### Full Control with Content Slot
```vue
<script setup lang="ts">
import { ref } from 'vue'

const items = ref([
  { label: 'Item 1', value: '1' },
  { label: 'Item 2', value: '2' },
  { label: 'Item 3', value: '3' }
])
</script>

<template>
  <UAccordion :items="items">
    <template #content="{ item }">
      <!-- Complete control over content rendering -->
      <div class="custom-content">
        <p>Content for {{ item.label }}</p>
        <p v-if="item.value === '1'">Item 1 specific content</p>
        <p v-if="item.value === '2'">Item 2 specific content</p>
        <p v-if="item.value === '3'">Item 3 specific content</p>
      </div>
    </template>
  </UAccordion>
</template>
```

### Custom Named Slots Per Item
```vue
<script setup lang="ts">
import { ref } from 'vue'

const items = ref([
  {
    label: 'Text Content',
    slot: 'text'
  },
  {
    label: 'Form Content',
    slot: 'form'
  },
  {
    label: 'Media Content',
    slot: 'media'
  }
])
</script>

<template>
  <UAccordion :items="items">
    <!-- Slot for text item -->
    <template #text="{ item }">
      <p>This is text content for {{ item.label }}</p>
    </template>

    <!-- Slot for form item -->
    <template #form="{ item }">
      <form>
        <input type="text" placeholder="Name" />
        <textarea placeholder="Message"></textarea>
        <button type="submit">Send</button>
      </form>
    </template>

    <!-- Slot for media item -->
    <template #media="{ item }">
      <img src="/example.png" alt="Example" />
    </template>
  </UAccordion>
</template>
```

### Markdown Content with MDC
```vue
<script setup lang="ts">
import { ref } from 'vue'

const items = ref([
  {
    label: 'Getting Started',
    content: `
# Getting Started

Learn how to **get started** with Nuxt UI.

- Step 1: Install
- Step 2: Configure
- Step 3: Build
    `
  },
  {
    label: 'Features',
    content: `
## Key Features

1. **Accessible** - Built on Reka UI
2. **Customizable** - Tailwind CSS
3. **Type-safe** - Full TypeScript support
    `
  }
])
</script>

<template>
  <UAccordion :items="items">
    <template #body="{ item }">
      <!-- Render markdown content -->
      <ContentMarkdown :value="item.content" />
    </template>
  </UAccordion>
</template>
```

### FAQ Pattern
```vue
<script setup lang="ts">
import { ref } from 'vue'

const faqs = ref([
  {
    label: 'Is Nuxt UI free?',
    content: 'Yes, Nuxt UI is completely free and open source under the MIT license.',
    value: 'free'
  },
  {
    label: 'Can I use with Vue only?',
    content: 'Yes, Nuxt UI works with standalone Vue projects, though it is optimized for Nuxt.',
    value: 'vue-only'
  },
  {
    label: 'What about accessibility?',
    content: 'Nuxt UI is built on Reka UI and provides full ARIA support and keyboard navigation out of the box.',
    value: 'accessibility'
  },
  {
    label: 'How do I customize colors?',
    content: 'Use the ui prop for component-level customization or configure defaults in app.config.ts.',
    value: 'customization'
  }
])
</script>

<template>
  <section>
    <h2>Frequently Asked Questions</h2>
    <UAccordion :items="faqs" />
  </section>
</template>
```

### Settings/Preferences Accordion
```vue
<script setup lang="ts">
import { ref } from 'vue'

const settings = ref({
  notifications: true,
  theme: 'light',
  language: 'en'
})

const settingsItems = ref([
  {
    label: 'Notification Settings',
    value: 'notifications',
    slot: 'notifications'
  },
  {
    label: 'Appearance',
    value: 'appearance',
    slot: 'appearance'
  },
  {
    label: 'Language & Region',
    value: 'language',
    slot: 'language'
  }
])
</script>

<template>
  <UAccordion :items="settingsItems" type="multiple">
    <template #notifications>
      <div class="space-y-4">
        <UCheckbox
          v-model="settings.notifications"
          label="Enable notifications"
          description="Receive updates about your account"
        />
      </div>
    </template>

    <template #appearance>
      <div class="space-y-4">
        <URadioGroup
          v-model="settings.theme"
          :options="[
            { value: 'light', label: 'Light' },
            { value: 'dark', label: 'Dark' }
          ]"
          legend="Theme"
        />
      </div>
    </template>

    <template #language>
      <div class="space-y-4">
        <USelectMenu
          v-model="settings.language"
          :options="[
            { value: 'en', label: 'English' },
            { value: 'es', label: 'Spanish' }
          ]"
          placeholder="Select language"
        />
      </div>
    </template>
  </UAccordion>
</template>
```

### Draggable Accordion Items
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useSortable } from '@vueuse/integrations'

const items = ref([
  { label: 'Task 1', content: 'First task' },
  { label: 'Task 2', content: 'Second task' },
  { label: 'Task 3', content: 'Third task' }
])

const el = ref()
const { data } = useSortable(el, items, {
  animation: 200,
  group: 'tasks',
  ghostClass: 'sortable-ghost'
})
</script>

<template>
  <div ref="el">
    <!-- Items are reorderable via drag and drop -->
    <UAccordion :items="data" />
  </div>
</template>
```

### Accordion with Responsive Styling
```vue
<script setup lang="ts">
import { ref } from 'vue'

const items = ref([
  { label: 'Section 1', content: 'Content 1' },
  { label: 'Section 2', content: 'Content 2' }
])
</script>

<template>
  <!-- Custom responsive styling via ui prop -->
  <UAccordion
    :items="items"
    :ui="{
      root: 'w-full md:max-w-2xl lg:max-w-4xl',
      item: 'border border-gray-200 dark:border-gray-700 mb-2',
      trigger: 'px-4 py-3 md:px-6 md:py-4 hover:bg-gray-50 dark:hover:bg-gray-800',
      content: 'px-4 py-4 md:px-6 md:py-6 bg-gray-50 dark:bg-gray-900'
    }"
  />
</template>
```

### Nested Accordions
```vue
<script setup lang="ts">
import { ref } from 'vue'

const parentItems = ref([
  { label: 'Parent 1', value: 'p1' },
  { label: 'Parent 2', value: 'p2' }
])

const childItems1 = ref([
  { label: 'Child 1.1', content: 'Content 1.1' },
  { label: 'Child 1.2', content: 'Content 1.2' }
])

const childItems2 = ref([
  { label: 'Child 2.1', content: 'Content 2.1' },
  { label: 'Child 2.2', content: 'Content 2.2' }
])
</script>

<template>
  <UAccordion :items="parentItems">
    <template #content="{ item }">
      <!-- Nested accordion -->
      <UAccordion
        :items="item.value === 'p1' ? childItems1 : childItems2"
        class="ml-4"
      />
    </template>
  </UAccordion>
</template>
```

### Global UI Configuration
```typescript
// app.config.ts (Nuxt)
export default defineAppConfig({
  ui: {
    icons: {
      chevronDown: 'i-lucide-chevron-down'
    },
    accordion: {
      default: {
        type: 'single',
        collapsible: true,
        unmountOnHide: true,
        trailingIcon: 'i-lucide-chevron-down'
      }
    }
  }
})
```

## Accessibility Notes

### Keyboard Navigation
- **Tab**: Move focus to next accordion header or out of accordion
- **Shift+Tab**: Move focus to previous accordion header
- **Arrow Down**: Move focus to next header (circular, wraps to first)
- **Arrow Up**: Move focus to previous header (circular, wraps to last)
- **Home**: Move focus to first header
- **End**: Move focus to last header
- **Enter/Space**: Expand/collapse focused item (in single mode, closes other items)

### ARIA Implementation
- Headers have `role="button"` and `aria-expanded` attribute
- Content regions have `role="region"` and `aria-labelledby` pointing to header
- Disabled items have `aria-disabled="true"`
- Proper heading hierarchy maintained through semantic HTML

### Screen Reader Considerations
- Item label clearly announced as button with expanded/collapsed state
- Content region labeled by associated header
- Item position and count may be announced depending on screen reader
- Disabled items announced as unavailable
- Custom icons should have appropriate ARIA labels if critical to understanding

### Focus Management
- Initial focus remains outside accordion
- Tab enters accordion at first item
- After leaving accordion with Tab, focus does not return to last item (standard pattern)
- Shift+Tab from first item moves to element before accordion

## Common Patterns

1. **FAQ Sections**: Array of questions and answers maps naturally to accordion items
2. **Documentation**: Group related documentation sections that users can expand on demand
3. **Settings/Preferences**: Group related settings under collapsible headers with form controls inside
4. **Product Features**: Showcase features with expanding details to manage information density
5. **Pricing Plans**: Feature comparison with expandable feature details per plan
6. **Progressive Disclosure**: Reveal complexity gradually as users expand sections
7. **Navigation Categories**: Group navigation items under collapsible categories (especially mobile)
8. **Step-by-step Guides**: Collapsible steps users can expand/collapse for reference
9. **Error/Information Lists**: Group related messages or status items
10. **Dashboard Widgets**: Collapsible widget content to customize dashboard density

## Related Components

- **Tabs**: For mutually exclusive content sections with always-visible tab bar
- **Dialog/Modal**: For focused interaction requiring full attention
- **Disclosure**: Single expandable/collapsible element (simpler than accordion)
- **Tabs + Accordion**: Combine tabs for primary navigation, accordion for secondary grouping
- **Form Fields**: Place form controls inside accordion content for grouped configuration
- **Markdown Renderer**: Display markdown content within accordion items

---

Research completed: 2024-11-05
Component: Accordion
Framework: Nuxt UI
Documentation: https://ui.nuxt.com/docs/components/accordion
