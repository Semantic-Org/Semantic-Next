# Nuxt UI - Tabs Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://ui.nuxt.com/docs/components/tabs
Status: ✅ Working
Version: Current (Nuxt UI 3.0+)
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - The documentation provides thorough coverage of all props, variants, states, and customization options with clear examples and interactive demonstrations. Built on Reka UI primitives for accessibility and keyboard navigation.

## Component Definition
- **Core purpose**: A tab navigation component that displays a set of tab panels, allowing users to switch between different content sections with only one visible at a time. Supports controlled and uncontrolled modes with rich customization options.
- **Mental model**: Users think of tabs as "organized content sections where I can switch views without losing context." Each tab acts as a labeled button to reveal its associated content panel.
- **Semantic meaning**: Represents logical grouping of related content. Tab orientation, size, and color variants communicate visual hierarchy and importance. Used for organization, navigation, and content filtering.

## Pattern Support Levels
- **Native**: Dedicated prop/API
- **Composed**: Via composition/slots
- **CSS-only**: Requires custom styling

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Tab label text | ✅ | Native | Via `label` property in items array. Required field for each tab item. Displays as clickable tab trigger. |
| Icon on tab | ✅ | Native | Via `icon` property in items array. Accepts string identifier (e.g., `"i-lucide-arrow-right"`) or icon component object. Displays before label. |
| Avatar on tab | ✅ | Native | Via `avatar` property in items array. Accepts `AvatarProps` object. Displays visual avatar indicator on tab trigger. |
| Badge on tab | ✅ | Native | Via `badge` property in items array. Accepts string/number value or `BadgeProps` object. Displays count/notification indicator on tab. |
| Custom tab slot | ✅ | Composed | Via `slot` property in items referencing named slot. Allows complete control over tab trigger rendering. |
| Custom content | ✅ | Composed | Via `#content` named slot receiving item data. Enables dynamic content rendering with full control. |
| Tab content via prop | ✅ | Native | Via `content` property in items array or controlled via `content` prop (boolean). Enables/disables content panel rendering. |
| Disabled tab | ✅ | Native | Via `disabled` property in items array. Tab becomes non-interactive but visually present. |
| Tab class customization | ✅ | Composed | Via `class` property in items array. Applies custom CSS classes to individual tabs. |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Pill variant (default) | ✅ | Native | `variant="pill"` - Rounded, pill-shaped tab buttons. Most common modern tab style. Default and recommended. |
| Link variant | ✅ | Native | `variant="link"` - Minimal, underline-based tab style. Clean appearance, suitable for documentation/reading-focused layouts. |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Active tab | ✅ | Native | Set via `v-model` or `default-value` binding. Currently selected tab indicated visually and via `aria-selected="true"`. |
| Inactive tab | ✅ | Native | Non-selected tabs. Visually de-emphasized. Selectable by clicking or keyboard navigation. |
| Disabled tab | ✅ | Native | Via `disabled` property on item. Non-interactive, skipped in keyboard navigation, visually grayed out. |
| Content mounted | ✅ | Native | Default behavior. Tab content remains in DOM even when hidden. |
| Content unmounted | ✅ | Native | Via `unmount-on-hide="true"` prop. Tab content removed from DOM when inactive, preserving resources for heavy content. |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅ | Native | Five sizes: `xs`, `sm`, `md` (default), `lg`, `xl`. Applied via `size` prop to all tabs. |
| Color options | ✅ | Native | Seven semantic colors: `primary` (default), `secondary`, `success`, `info`, `warning`, `error`, `neutral`. Applied via `color` prop. Controls active tab indicator color. |
| Orientation | ✅ | Native | Two layouts via `orientation` prop: `horizontal` (default, tabs in row), `vertical` (tabs in column). Useful for complex layouts. |
| Content toggle | ✅ | Native | Via `content` boolean prop. Shows/hides all content panels while keeping tab navigation visible. |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Controlled mode | ✅ | Native | Via `v-model` binding. Parent component controls active tab. Updates when tab clicked. Works with string/number identifiers via `value` property. |
| Uncontrolled mode | ✅ | Native | Via `default-value` prop. Component manages active tab internally. Useful for simple, standalone tab layouts without complex state. |
| Tab switching | ✅ | Native | Click on tab trigger to activate. Change event emitted. Content panel shows/hides automatically. Smooth transitions applied. |
| Tab value tracking | ✅ | Native | Via `value` property on each item (defaults to label). Allows tracking tab identity independent of label text. |
| Label key override | ✅ | Native | Via `label-key` prop. Specifies which property contains tab label text. Useful for custom data structures. |

## Keyboard Interaction Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Tab key focus | ✅ | Native | `Tab` moves focus to next tab. `Shift+Tab` moves to previous tab. Tab triggers are focusable with visible focus ring. |
| Arrow key navigation | ✅ | Native | `ArrowRight` / `ArrowLeft` (horizontal) or `ArrowDown` / `ArrowUp` (vertical) navigate between tabs. Automatically activates focused tab. |
| Home/End keys | ✅ | Native | `Home` moves focus to first tab. `End` moves focus to last tab. Helpful for quick navigation in long tab lists. |
| Enter/Space keys | ✅ | Native | `Enter` or `Space` activates focused tab. Standard activation pattern for interactive elements. |
| Disabled tab navigation | ✅ | Native | Disabled tabs skipped in keyboard navigation. Focus jumps over disabled items to next active tab. |

## Styling Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Color themes | ✅ | Native | Via `color` prop. Seven semantic colors control active tab background and text color. |
| Size scaling | ✅ | Native | Via `size` prop. Scales padding, text size, and overall tab dimensions. Five standard sizes. |
| CSS custom properties | ✅ | CSS-only | Component uses CSS variables for theming. Customizable via CSS for advanced styling. |
| Dark mode support | ✅ | Native | Respects `prefers-color-scheme` and Nuxt dark mode plugin. Color variants adapt automatically. |
| Tailwind classes | ✅ | CSS-only | Underlying Tailwind classes can be overridden for custom styling beyond built-in variants. |

## Accessibility Features
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| ARIA roles | ✅ | Native | `role="tablist"` on container, `role="tab"` on triggers, `role="tabpanel"` on content. Built on Reka UI ARIA implementation. |
| Tab panel association | ✅ | Native | Proper `aria-controls` linking tabs to panels. Automatic `id` generation for association. |
| Selected state | ✅ | Native | `aria-selected="true|false"` indicates active tab. Screen readers announce selection state. |
| Disabled indication | ✅ | Native | `aria-disabled="true"` on disabled tabs. Prevents activation in keyboard navigation. |
| Focus management | ✅ | Native | Focus moves to next activatable tab when current tab disabled. Maintains logical tab order. |
| Label accessibility | ✅ | Native | Tab text serves as accessible label. Icon labels announced separately if present. |

## Icon Customization
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Built-in icons | ✅ | Native | Via `icon` property string (e.g., `"i-lucide-settings"`). Icons from Nuxt Icon integration. |
| Icon components | ✅ | Composed | Via `icon` as component object. Allows custom SVG or icon components. |
| Icon positioning | ✅ | Native | Icons display before label text. Order cannot be changed (icon always left). |
| Multiple visual indicators | ✅ | Composed | Combine `icon`, `avatar`, and `badge` properties for rich tab indicators. |
| Avatar images | ✅ | Native | Via `avatar` property with image URL. Creates visual indicator for user/category tabs. |
| Badge notifications | ✅ | Native | Via `badge` property. Displays count, status, or notification indicator. Customizable via `BadgeProps`. |

## Form Integration Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Form submission | ⚠️ | Manual | No built-in form submission. Tabs control content display, not form values. Must manually capture active tab value. |
| Value submission | ✅ | Composed | Track active tab via `v-model` and include in form submission. Parent component manages form binding. |
| Default selection | ✅ | Native | Via `default-value` prop. Pre-selects specific tab on mount. |
| Value identity | ✅ | Native | Via `value` property on items. Independent tab identity from label. Useful for i18n and dynamic labels. |

## Data Structure Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Inline items | ✅ | Native | Via `items` prop with array of objects. Each object defines label, content, and metadata. |
| Item properties | ✅ | Native | Each item supports: `label`, `content`, `value`, `disabled`, `icon`, `avatar`, `badge`, `slot`, `class`. |
| Dynamic items | ✅ | Composed | Iterate `items` array with `v-for`. Tabs update reactively when items array changes. |
| Custom data mapping | ✅ | Composed | Use `label-key` prop to map custom data structure. Transform data before passing to items prop. |
| Empty tabs | ✅ | Native | Render component with empty `items` array. No tabs display, only empty container. |

## Code Examples

### Basic Tab Layout
```vue
<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref('overview')

const items = [
  { label: 'Overview', value: 'overview' },
  { label: 'Documentation', value: 'docs' },
  { label: 'Settings', value: 'settings' }
]
</script>

<template>
  <!-- Controlled tabs -->
  <UTabs v-model="activeTab" :items="items">
    <template #overview>
      <p>Overview content here</p>
    </template>

    <template #docs>
      <p>Documentation content here</p>
    </template>

    <template #settings>
      <p>Settings content here</p>
    </template>
  </UTabs>

  <!-- Uncontrolled tabs -->
  <UTabs default-value="overview" :items="items">
    <template #overview>Overview default view</template>
  </UTabs>
</template>
```

### Tabs with Icons and Badges
```vue
<script setup lang="ts">
const items = [
  {
    label: 'Notifications',
    value: 'notifications',
    icon: 'i-lucide-bell',
    badge: 5
  },
  {
    label: 'Settings',
    value: 'settings',
    icon: 'i-lucide-settings'
  },
  {
    label: 'User',
    value: 'user',
    avatar: { src: 'https://avatars.githubusercontent.com/u/1234' }
  }
]
</script>

<template>
  <UTabs :items="items" color="primary">
    <template #notifications>
      <div class="p-4">5 new notifications</div>
    </template>
    <template #settings>
      <div class="p-4">Configure your settings</div>
    </template>
    <template #user>
      <div class="p-4">User profile information</div>
    </template>
  </UTabs>
</template>
```

### Size and Variant Variations
```vue
<template>
  <!-- Extra small tabs -->
  <UTabs :items="items" size="xs" variant="pill" />

  <!-- Large link-style tabs -->
  <UTabs :items="items" size="lg" variant="link" />

  <!-- Medium pill tabs (default) -->
  <UTabs :items="items" size="md" variant="pill" />

  <!-- Color variants -->
  <UTabs :items="items" color="primary" />
  <UTabs :items="items" color="success" />
  <UTabs :items="items" color="error" />
</template>
```

### Disabled Tabs and Content Control
```vue
<script setup lang="ts">
const items = [
  { label: 'Active', value: 'active' },
  { label: 'Disabled', value: 'disabled', disabled: true },
  { label: 'Available', value: 'available' }
]

const showContent = ref(true)
</script>

<template>
  <!-- Disabled tab is present but non-interactive -->
  <UTabs :items="items" />

  <!-- Show/hide content while keeping tabs visible -->
  <div class="flex gap-4">
    <UTabs :items="items" :content="showContent" />
    <button @click="showContent = !showContent">
      Toggle Content
    </button>
  </div>

  <!-- Unmount content when hidden for memory efficiency -->
  <UTabs :items="items" unmount-on-hide />
</template>
```

### Vertical Tab Layout
```vue
<script setup lang="ts">
const items = [
  { label: 'Profile', value: 'profile' },
  { label: 'Account', value: 'account' },
  { label: 'Privacy', value: 'privacy' },
  { label: 'Notifications', value: 'notifications' }
]
</script>

<template>
  <!-- Vertical tabs (sidebar style) -->
  <div class="flex gap-4">
    <UTabs :items="items" orientation="vertical">
      <template #profile>
        <div>Profile settings</div>
      </template>
      <template #account>
        <div>Account information</div>
      </template>
      <template #privacy>
        <div>Privacy controls</div>
      </template>
      <template #notifications>
        <div>Notification preferences</div>
      </template>
    </UTabs>
  </div>
</template>
```

### Custom Tab Content with Named Slots
```vue
<script setup lang="ts">
const items = [
  {
    label: 'Code',
    value: 'code',
    slot: 'code-content'
  },
  {
    label: 'Preview',
    value: 'preview',
    slot: 'preview-content'
  }
]
</script>

<template>
  <UTabs :items="items">
    <!-- Named slot referenced in item.slot -->
    <template #code-content>
      <div class="bg-gray-900 text-white p-4 font-mono">
        <code>const result = fn()</code>
      </div>
    </template>

    <template #preview-content>
      <div class="bg-white p-4">
        <p>Visual preview of result</p>
      </div>
    </template>
  </UTabs>
</template>
```

### Dynamic Tabs with v-for
```vue
<script setup lang="ts">
import { ref, computed } from 'vue'

const categories = ref(['JavaScript', 'Python', 'Go', 'Rust'])

const items = computed(() =>
  categories.value.map((lang) => ({
    label: lang,
    value: lang.toLowerCase(),
    content: `Learn ${lang}`
  }))
)
</script>

<template>
  <!-- Tabs update when categories array changes -->
  <UTabs :items="items">
    <template #content="{ item }">
      <p>{{ item.content }}</p>
    </template>
  </UTabs>
</template>
```

### Controlled Tabs with Event Handling
```vue
<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref('details')
const tabs = ['details', 'comments', 'history']

const items = computed(() =>
  tabs.map(tab => ({ label: tab, value: tab }))
)

function handleTabChange(value) {
  console.log(`Switched to ${value}`)
  activeTab.value = value
  // Trigger data loading, analytics, etc.
}
</script>

<template>
  <UTabs v-model="activeTab" :items="items">
    <template #details>
      <div>Item details loaded when tab becomes active</div>
    </template>
    <template #comments>
      <div>Comments section</div>
    </template>
    <template #history>
      <div>Change history</div>
    </template>
  </UTabs>
</template>
```

### Semantic Color Variants
```vue
<script setup lang="ts">
const items = [
  { label: 'Status', value: 'status' },
  { label: 'Actions', value: 'actions' }
]
</script>

<template>
  <!-- Color communicates semantic meaning -->
  <UTabs :items="items" color="primary" />
  <UTabs :items="items" color="success" />
  <UTabs :items="items" color="warning" />
  <UTabs :items="items" color="error" />
  <UTabs :items="items" color="info" />
  <UTabs :items="items" color="neutral" />
</template>
```

### Tab Switching with Content Lazy Loading
```vue
<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref('overview')
const loadedTabs = ref(new Set(['overview']))
const tabContents = ref({
  overview: 'Overview content',
  advanced: null,
  settings: null
})

async function onTabChange(tab) {
  if (!loadedTabs.value.has(tab)) {
    // Lazy load tab content
    tabContents.value[tab] = await fetchTabContent(tab)
    loadedTabs.value.add(tab)
  }
}

async function fetchTabContent(tab) {
  // Simulate API call
  return new Promise(resolve => {
    setTimeout(() => resolve(`Content for ${tab}`), 500)
  })
}
</script>

<template>
  <UTabs v-model="activeTab" :items="items" @update:model-value="onTabChange">
    <template #overview>{{ tabContents.overview }}</template>
    <template #advanced>
      <p v-if="tabContents.advanced">{{ tabContents.advanced }}</p>
      <p v-else>Loading...</p>
    </template>
    <template #settings>
      <p v-if="tabContents.settings">{{ tabContents.settings }}</p>
      <p v-else>Loading...</p>
    </template>
  </UTabs>
</template>
```

## Props API Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `v-model` | `string \| number` | — | Controlled active tab value |
| `default-value` | `string \| number` | — | Uncontrolled initial active tab |
| `items` | `TabsItem[]` | `[]` | Array of tab item configurations |
| `color` | `string` | `'primary'` | Semantic color (primary, secondary, success, info, warning, error, neutral) |
| `variant` | `'pill' \| 'link'` | `'pill'` | Visual style variant |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Tab size scaling |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Tab layout direction |
| `content` | `boolean` | `true` | Enable/disable content panel rendering |
| `unmount-on-hide` | `boolean` | `true` | Remove inactive tab content from DOM |
| `label-key` | `string` | `'label'` | Property key for tab label text |

## Events API Reference

| Event | Payload Type | Description |
|-------|--------------|-------------|
| `update:modelValue` | `string \| number` | Emitted when active tab changes. Used with v-model. |

## Slots API Reference

| Slot Name | Scope | Description |
|-----------|-------|-------------|
| `#content` | `{ item: TabsItem }` | Custom content renderer. Receives active item data. |
| `#[item.slot]` | `{ item: TabsItem }` | Named slots referenced by `item.slot` property. |

## Tab Item Structure

```typescript
interface TabsItem {
  label: string;                    // Required: tab label text
  value?: string | number;          // Optional: unique identifier (defaults to label)
  content?: string;                 // Optional: text content to display
  disabled?: boolean;               // Optional: disable tab interaction
  icon?: string | object;           // Optional: icon identifier or component
  avatar?: AvatarProps;             // Optional: avatar configuration
  badge?: string | number | object; // Optional: badge indicator
  slot?: string;                    // Optional: named slot reference
  class?: any;                      // Optional: custom CSS classes
}
```

## Common Patterns

### Pattern: Tab as Navigation Container
**Use Case**: Switch between major content sections
**Implementation**:
- Use controlled mode with `v-model`
- Track active tab in parent component
- Load different data based on active tab
- Maintain scroll position per tab

### Pattern: Settings/Configuration Tabs
**Use Case**: Organize settings into logical categories
**Implementation**:
- Use vertical orientation for sidebar
- Large font size with `size="lg"`
- Group related settings per tab
- Validate settings on tab change

### Pattern: Wizard/Multi-Step Flow
**Use Case**: Guide users through steps
**Implementation**:
- Disable next/previous steps conditionally
- Prevent going back to completed steps
- Show progress indicator outside tabs
- Validate current step before allowing next

### Pattern: Content Filtering/Display
**Use Case**: Toggle between different data views
**Implementation**:
- Lightweight content switching
- Use `unmount-on-hide` for memory efficiency
- Lazy load tab content on demand
- Maintain user scroll position

### Pattern: Tabbed Documentation
**Use Case**: Show code examples in different languages
**Implementation**:
- Use link variant for clean look
- Display code blocks in tab content
- Persist tab selection across page navigation
- Highlight active language syntax

## Related Components
- **Disclosure/Accordion**: Similar content hiding but hierarchical
- **Menu/Navigation**: Tab bar with dropdown menus
- **Pagination**: Sequential navigation without grouping
- **Segmented Control**: Smaller variant of tabs for binary/ternary choices

## Browser Support
- All modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile-friendly keyboard and touch navigation
- Built on Reka UI which supports accessibility standards
- CSS Grid/Flexbox for layout (no IE11 support)

## Performance Considerations
- Use `unmount-on-hide` for large/heavy content
- Lazy load tab content on activation if needed
- Debounce rapid tab changes if triggering expensive operations
- Consider virtualization for very large tab lists (100+ tabs)

## Accessibility Checklist
- ✅ Proper ARIA roles (tablist, tab, tabpanel)
- ✅ aria-selected for active indication
- ✅ aria-disabled for disabled tabs
- ✅ Keyboard navigation (Tab, Arrows, Home/End)
- ✅ Focus management and visible focus ring
- ✅ Screen reader support built-in
- ✅ Color contrast requirements met
- ✅ Works without CSS for basic functionality

## Theme Customization
The Tabs component uses Nuxt UI's theming system. Customize via `app.config.ts`:

```typescript
export default defineAppConfig({
  ui: {
    tabs: {
      base: 'w-full',
      list: {
        base: 'flex',
        background: '',
        rounded: 'rounded-lg',
        shadow: '',
        padding: 'p-1',
        height: 'h-10'
      },
      trigger: {
        base: 'relative inline-flex items-center justify-center',
        padding: 'px-3 py-1.5',
        size: {
          xs: 'text-xs',
          sm: 'text-sm',
          md: 'text-base',
          lg: 'text-lg',
          xl: 'text-xl'
        }
      },
      content: {
        base: 'w-full',
        padding: 'pt-4'
      }
    }
  }
})
```

## Related Documentation
- [Nuxt UI Components](https://ui.nuxt.com/components)
- [Reka UI Tabs](https://reka-ui.com/)
- [WAI-ARIA Tabs Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)
- [Vue 3 Docs](https://vuejs.org/)
