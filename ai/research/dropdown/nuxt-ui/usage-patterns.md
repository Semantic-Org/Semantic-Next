# Nuxt UI DropdownMenu Component - Usage Patterns

**Component**: DropdownMenu
**Framework**: Nuxt UI v3
**Foundation**: Built on Reka UI (formerly Radix Vue)
**Documentation**: https://ui.nuxt.com/docs/components/dropdown-menu
**Research Date**: 2025-11-04

---

## 1. Component Overview

The DropdownMenu component in Nuxt UI is a composable dropdown menu that displays a list of actions or options when triggered by a button or other interactive element. It provides a fully accessible, keyboard-navigable menu system built on Reka UI primitives with Tailwind CSS styling.

The component is designed for action menus (user account menus, context menus, settings menus) rather than form selection, which is handled by the separate SelectMenu component. It supports nested menus, checkbox items, keyboard shortcuts, icons, avatars, and flexible styling through Tailwind utilities.

DropdownMenu is WAI-ARIA compliant with automatic focus management, keyboard navigation, and screen reader support built in through its Reka UI foundation.

---

## 2. Basic Usage

### Minimal Example

```vue
<template>
  <UDropdownMenu :items="items">
    <UButton label="Open" />
  </UDropdownMenu>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

const items: DropdownMenuItem[][] = [[
  { label: 'Profile', icon: 'i-lucide-user' },
  { label: 'Settings', icon: 'i-lucide-settings' },
  { label: 'Logout', icon: 'i-lucide-log-out' }
]]
</script>
```

### Example with Button Trigger

```vue
<template>
  <UDropdownMenu :items="items">
    <UButton
      color="neutral"
      variant="outline"
      icon="i-lucide-chevron-down"
      trailing
    />
  </UDropdownMenu>
</template>
```

**Key Concepts:**
- Any component can be placed in the default slot to act as the trigger
- The `items` prop defines the menu structure
- Items are grouped in nested arrays for visual separation

---

## 3. Props/API

### Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `DropdownMenuItem[][]` | `[]` | Array of menu item groups. Each group is an array of items. |
| `content` | `object` | `{}` | Props for the content positioning (align, side, etc.) from Reka UI |
| `disabled` | `boolean` | `false` | Whether the dropdown menu is disabled |
| `modal` | `boolean` | `true` | Whether the dropdown blocks interaction with outside content |
| `ui` | `object` | `{}` | Object to customize component slots with Tailwind classes |

### DropdownMenuItem Interface

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `label` | `string` | Yes (except separators) | Display text for the menu item |
| `icon` | `string` | No | Iconify icon name (e.g., 'i-lucide-user') |
| `avatar` | `object` | No | Avatar configuration with `src` and other properties |
| `kbds` | `string[]` | No | Keyboard shortcuts to display (e.g., `['meta', 'n']` or `['Ctrl', 'N']`) |
| `to` | `string \| object` | No | Navigation target (NuxtLink compatible) |
| `target` | `string` | No | Link target attribute (e.g., '_blank') |
| `type` | `'checkbox' \| 'separator' \| 'label'` | No | Special item type |
| `disabled` | `boolean` | No | Whether the item is disabled |
| `color` | `string` | No | Color variant (e.g., 'error', 'primary') |
| `checked` | `boolean` | No | Checked state (for checkbox type items) |
| `onUpdateChecked` | `(checked: boolean) => void` | No | Callback when checkbox state changes |
| `onSelect` | `(e: Event) => void` | No | Callback when item is selected/clicked |
| `children` | `DropdownMenuItem[]` | No | Nested menu items for sub-menus |

### Content Positioning Props

The `content` prop accepts Reka UI positioning options:

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `align` | `'start' \| 'center' \| 'end'` | `'center'` | Alignment relative to trigger |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'` | Side of trigger to appear on |
| `sideOffset` | `number` | `8` | Distance from trigger in pixels |
| `alignOffset` | `number` | `0` | Offset along the alignment axis |

---

## 4. Variants & Patterns

### Items Structure

Items are organized in groups (outer array) containing individual menu items (inner arrays):

```typescript
const items: DropdownMenuItem[][] = [
  // Group 1
  [
    { label: 'Profile', icon: 'i-lucide-user' },
    { label: 'Billing', icon: 'i-lucide-credit-card' }
  ],
  // Group 2
  [
    { label: 'Settings', icon: 'i-lucide-settings' },
    { label: 'Keyboard shortcuts', icon: 'i-lucide-keyboard', kbds: ['?'] }
  ],
  // Group 3
  [
    { label: 'Logout', icon: 'i-lucide-log-out' }
  ]
]
```

### Icons and Shortcuts

Icons use Iconify notation, and keyboard shortcuts are displayed with badges:

```typescript
const items: DropdownMenuItem[][] = [[
  {
    label: 'New File',
    icon: 'i-lucide-file-plus',
    kbds: ['meta', 'n']
  },
  {
    label: 'New Folder',
    icon: 'i-lucide-folder-plus',
    kbds: ['meta', 'shift', 'n']
  },
  {
    label: 'Save',
    icon: 'i-lucide-save',
    kbds: ['meta', 's']
  }
]]
```

**Keyboard Shortcuts Integration:**

You can extract shortcuts from items and use them with Nuxt UI's `defineShortcuts` composable:

```typescript
import { extractShortcuts } from '@nuxt/ui'

const items = ref([...])

defineShortcuts(extractShortcuts(items.value))
```

### Disabled Items

```typescript
const items: DropdownMenuItem[][] = [[
  { label: 'Edit', icon: 'i-lucide-edit' },
  { label: 'Delete', icon: 'i-lucide-trash', disabled: true },
  { label: 'Archive', icon: 'i-lucide-archive' }
]]
```

### Dividers and Labels

Use type properties to create visual structure:

```typescript
const items: DropdownMenuItem[][] = [[
  { label: 'Interface', icon: 'i-lucide-app-window', type: 'label' },
  { type: 'separator' },
  { label: 'Show Toolbar', icon: 'i-lucide-wrench' },
  { label: 'Show Sidebar', icon: 'i-lucide-sidebar' },
  { type: 'separator' },
  { label: 'Customize', icon: 'i-lucide-palette' }
]]
```

### Checkbox Items

```vue
<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

const showBookmarks = ref(true)
const showHistory = ref(false)
const showDownloads = ref(false)

const items = computed(() => [[
  { label: 'Interface', icon: 'i-lucide-app-window', type: 'label' },
  { type: 'separator' },
  {
    label: 'Show Bookmarks',
    icon: 'i-lucide-bookmark',
    type: 'checkbox',
    checked: showBookmarks.value,
    onUpdateChecked(checked: boolean) {
      showBookmarks.value = checked
    },
    onSelect(e: Event) {
      e.preventDefault() // Keep menu open
    }
  },
  {
    label: 'Show History',
    icon: 'i-lucide-clock',
    type: 'checkbox',
    checked: showHistory.value,
    onUpdateChecked(checked: boolean) {
      showHistory.value = checked
    },
    onSelect(e: Event) {
      e.preventDefault()
    }
  },
  {
    label: 'Show Downloads',
    icon: 'i-lucide-download',
    type: 'checkbox',
    checked: showDownloads.value,
    onUpdateChecked(checked: boolean) {
      showDownloads.value = checked
    },
    onSelect(e: Event) {
      e.preventDefault()
    }
  }
]])
</script>

<template>
  <UDropdownMenu :items="items">
    <UButton label="View" />
  </UDropdownMenu>
</template>
```

**Important Notes:**
- Wrap items in `computed()` for reactive checkbox states
- Use `e.preventDefault()` in `onSelect` to prevent menu from closing
- Use `onUpdateChecked` to handle state changes

### Colors

Apply color variants to individual items:

```typescript
const items: DropdownMenuItem[][] = [[
  { label: 'Edit', icon: 'i-lucide-edit', color: 'primary' },
  { label: 'Duplicate', icon: 'i-lucide-copy', color: 'neutral' },
  { label: 'Archive', icon: 'i-lucide-archive', color: 'warning' },
  { label: 'Delete', icon: 'i-lucide-trash', color: 'error' }
]]
```

### Nested Menus (Sub-menus)

```typescript
const items: DropdownMenuItem[][] = [[
  { label: 'Team', icon: 'i-lucide-users' },
  {
    label: 'Invite users',
    icon: 'i-lucide-user-plus',
    children: [
      { label: 'Invite by email', icon: 'i-lucide-send-horizontal' },
      { label: 'Invite by link', icon: 'i-lucide-link' }
    ]
  },
  { label: 'New team', icon: 'i-lucide-plus' }
]]
```

### Avatars

```typescript
const items: DropdownMenuItem[][] = [[
  {
    label: 'John Doe',
    avatar: { src: '/avatars/john.jpg' }
  },
  {
    label: 'Jane Smith',
    avatar: { src: '/avatars/jane.jpg' }
  }
]]
```

---

## 5. Composition Patterns

### User Account Menu Pattern

```vue
<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

const user = {
  name: 'John Doe',
  email: 'john@example.com',
  avatar: '/avatars/john.jpg'
}

const items: DropdownMenuItem[][] = [
  [
    { label: 'Profile', icon: 'i-lucide-user', to: '/profile' },
    { label: 'Billing', icon: 'i-lucide-credit-card', to: '/billing' },
    { label: 'Settings', icon: 'i-lucide-settings', to: '/settings' }
  ],
  [
    { label: 'Documentation', icon: 'i-lucide-book', to: '/docs' },
    { label: 'Keyboard shortcuts', icon: 'i-lucide-keyboard', kbds: ['?'] }
  ],
  [
    {
      label: 'Logout',
      icon: 'i-lucide-log-out',
      onSelect: () => {
        // Handle logout
        console.log('Logging out...')
      }
    }
  ]
]
</script>

<template>
  <UDropdownMenu :items="items">
    <UButton color="neutral" variant="ghost">
      <UAvatar :src="user.avatar" :alt="user.name" size="xs" />
      <span>{{ user.name }}</span>
      <UIcon name="i-lucide-chevron-down" />
    </UButton>
  </UDropdownMenu>
</template>
```

### Context Menu Pattern with Actions

```vue
<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

const selectedItem = ref(null)

function handleEdit() {
  console.log('Edit item:', selectedItem.value)
}

function handleDelete() {
  if (confirm('Are you sure you want to delete this item?')) {
    console.log('Delete item:', selectedItem.value)
  }
}

const items: DropdownMenuItem[][] = [
  [
    { label: 'View', icon: 'i-lucide-eye', kbds: ['enter'] },
    { label: 'Edit', icon: 'i-lucide-edit', kbds: ['e'], onSelect: handleEdit }
  ],
  [
    { label: 'Duplicate', icon: 'i-lucide-copy', kbds: ['meta', 'd'] },
    { label: 'Move to', icon: 'i-lucide-folder' },
    { label: 'Share', icon: 'i-lucide-share' }
  ],
  [
    {
      label: 'Delete',
      icon: 'i-lucide-trash',
      color: 'error',
      kbds: ['backspace'],
      onSelect: handleDelete
    }
  ]
]
</script>
```

### Field Group Pattern

Combine DropdownMenu with other components:

```vue
<template>
  <UFieldGroup>
    <UButton color="neutral" variant="subtle" label="Settings" />
    <UDropdownMenu :items="settingsItems">
      <UButton
        color="neutral"
        variant="outline"
        icon="i-lucide-chevron-down"
      />
    </UDropdownMenu>
  </UFieldGroup>
</template>
```

### Navigation Menu with Routing

```vue
<script setup lang="ts">
const items: DropdownMenuItem[][] = [[
  { label: 'Dashboard', icon: 'i-lucide-layout-dashboard', to: '/' },
  { label: 'Projects', icon: 'i-lucide-folder', to: '/projects' },
  { label: 'Team', icon: 'i-lucide-users', to: '/team' },
  { label: 'Settings', icon: 'i-lucide-settings', to: '/settings' }
]]
</script>
```

Items with `to` property automatically use NuxtLink for navigation.

---

## 6. Styling & Theming

### Using the `ui` Prop

The `ui` prop accepts an object where keys are slot names and values are Tailwind CSS classes:

```vue
<UDropdownMenu
  :items="items"
  :ui="{
    content: 'w-56',
    item: 'text-sm',
    itemLabel: 'font-medium'
  }"
>
  <UButton label="Open" />
</UDropdownMenu>
```

### Available UI Slots

| Slot | Description | Default Classes |
|------|-------------|-----------------|
| `content` | The dropdown content container | Various positioning and styling |
| `viewport` | The scrollable viewport | - |
| `arrow` | The arrow pointing to trigger | - |
| `group` | Item group wrapper | `p-1 isolate` |
| `label` | Label item styling | `w-full flex items-center font-semibold text-highlighted` |
| `separator` | Separator line styling | `-mx-1 my-1 h-px bg-border` |
| `item` | Individual menu item | Various interactive states |
| `itemLeadingIcon` | Leading icon slot | Icon sizing and spacing |
| `itemLeadingAvatar` | Leading avatar slot | Avatar sizing |
| `itemLabel` | Item text label | Truncation and spacing |
| `itemTrailing` | Trailing content wrapper | - |
| `itemTrailingIcon` | Trailing icon (e.g., for sub-menus) | Icon sizing |
| `itemTrailingKbds` | Keyboard shortcut badges | - |

### Width Customization

Match dropdown width to trigger button:

```vue
<UDropdownMenu
  :items="items"
  :ui="{ content: 'w-(--reka-dropdown-menu-trigger-width)' }"
>
  <UButton label="Open" class="w-46" />
</UDropdownMenu>
```

This uses a CSS variable set by Reka UI that tracks the trigger width.

### Global Theme Configuration

Configure default styles in `app.config.ts`:

```typescript
export default defineAppConfig({
  ui: {
    dropdownMenu: {
      slots: {
        content: 'w-(--reka-dropdown-menu-trigger-width)',
        item: 'text-sm',
        label: 'text-xs uppercase tracking-wide'
      }
    }
  }
})
```

### Tailwind Integration

Nuxt UI uses Tailwind Variants API and tailwind-merge for styling:
- Classes are automatically merged without conflicts
- You can override any default class by providing your own
- Supports all Tailwind utilities including arbitrary values

### Custom Styling Example

```vue
<UDropdownMenu
  :items="items"
  :ui="{
    content: 'bg-gray-900 dark:bg-gray-800 border border-gray-700',
    item: 'hover:bg-gray-800 text-gray-100',
    itemLabel: 'text-sm font-medium',
    separator: 'bg-gray-700'
  }"
>
  <UButton label="Dark Menu" />
</UDropdownMenu>
```

---

## 7. Accessibility

### ARIA Compliance

DropdownMenu is built on Reka UI (formerly Radix Vue) which provides WAI-ARIA compliant implementations:

- **Automatic ARIA attributes**: Proper roles, states, and properties
- **WAI-ARIA authoring practices**: Follows official accessibility guidelines
- **Screen reader support**: Full semantic structure for assistive technologies

### Keyboard Navigation

Built-in keyboard support includes:

| Key | Action |
|-----|--------|
| `Space` / `Enter` | Open dropdown (when trigger focused) |
| `↓` (Down Arrow) | Navigate to next item |
| `↑` (Up Arrow) | Navigate to previous item |
| `Home` | Jump to first item |
| `End` | Jump to last item |
| `→` (Right Arrow) | Open sub-menu |
| `←` (Left Arrow) | Close sub-menu |
| `Esc` | Close dropdown |
| `Tab` | Close dropdown and move to next focusable element |
| `Enter` / `Space` | Activate focused item |

### Focus Management

- Focus automatically moves to first item when menu opens
- Focus is trapped within the menu while open
- Focus returns to trigger when menu closes
- Disabled items are skipped during keyboard navigation

### Screen Reader Support

- Menu items announce their label, state, and keyboard shortcuts
- Checkbox items announce checked/unchecked state
- Sub-menus announce expandable state
- Disabled items announce disabled state
- Label items are non-interactive but readable

### Testing & Reliability

Nuxt UI includes 1000+ Vitest tests covering:
- Core functionality
- Accessibility features
- Keyboard interactions
- ARIA attributes
- Focus management

---

## 8. Best Practices

### When to Use DropdownMenu

**Use DropdownMenu for:**
- User account menus
- Context menus (right-click actions)
- Action menus (edit, delete, share, etc.)
- Settings and preferences menus
- Navigation menus with grouped items

**Don't use DropdownMenu for:**
- Form input selection (use SelectMenu instead)
- Large lists of data (use SelectMenu or Table)
- Primary navigation (use NavigationMenu instead)

### Items Structure Best Practices

1. **Use computed() for reactive items**: When items depend on reactive state (especially checkbox items), wrap in `computed()`

```typescript
// Good
const items = computed(() => [[
  { label: 'Item', checked: someRef.value }
]])

// Avoid
const items = [[
  { label: 'Item', checked: someRef.value }
]]
```

2. **Group related items**: Use nested arrays to visually group related actions

```typescript
const items = [
  // View actions
  [
    { label: 'View', icon: 'i-lucide-eye' },
    { label: 'Preview', icon: 'i-lucide-search' }
  ],
  // Edit actions
  [
    { label: 'Edit', icon: 'i-lucide-edit' },
    { label: 'Duplicate', icon: 'i-lucide-copy' }
  ],
  // Destructive actions
  [
    { label: 'Delete', icon: 'i-lucide-trash', color: 'error' }
  ]
]
```

3. **Use type annotations**: Import and use the `DropdownMenuItem` type for better DX

```typescript
import type { DropdownMenuItem } from '@nuxt/ui'

const items: DropdownMenuItem[][] = [...]
```

### Event Handling Best Practices

1. **Use onSelect for actions**: Prefer `onSelect` callback over wrapping items in links for custom actions

```typescript
// Good - for actions
{
  label: 'Delete',
  onSelect: () => deleteItem()
}

// Good - for navigation
{
  label: 'Settings',
  to: '/settings'
}
```

2. **Prevent default for checkbox items**: Use `e.preventDefault()` to keep menu open

```typescript
{
  type: 'checkbox',
  checked: value.value,
  onUpdateChecked: (checked) => { value.value = checked },
  onSelect: (e) => { e.preventDefault() }
}
```

3. **Async actions**: Handle loading states appropriately

```typescript
const isDeleting = ref(false)

const items = computed(() => [[
  {
    label: isDeleting.value ? 'Deleting...' : 'Delete',
    disabled: isDeleting.value,
    onSelect: async () => {
      isDeleting.value = true
      await deleteItem()
      isDeleting.value = false
    }
  }
]])
```

### Styling Best Practices

1. **Use ui prop for component-specific styles**: Don't create wrapper components just to style

```vue
<!-- Good -->
<UDropdownMenu :ui="{ content: 'w-56' }" />

<!-- Avoid -->
<CustomDropdownMenu />
```

2. **Configure globals in app.config.ts**: For consistent styles across all dropdowns

3. **Use semantic color names**: Use 'error', 'warning', 'primary' instead of specific colors

### Accessibility Best Practices

1. **Provide keyboard shortcuts for common actions**: Enhance UX for power users

```typescript
{ label: 'Save', icon: 'i-lucide-save', kbds: ['meta', 's'] }
```

2. **Use icons with labels**: Don't use icons alone without text labels

```typescript
// Good
{ label: 'Settings', icon: 'i-lucide-settings' }

// Avoid
{ icon: 'i-lucide-settings' } // No label
```

3. **Disable items appropriately**: Use `disabled` instead of removing items

```typescript
{
  label: 'Delete',
  disabled: !canDelete.value,
  onSelect: handleDelete
}
```

### Performance Best Practices

1. **Avoid heavy computations in items**: Pre-compute data before creating items array

2. **Use modal: false for better performance**: When blocking interactions isn't needed

```vue
<UDropdownMenu :items="items" :modal="false" />
```

3. **Lazy load sub-menu data**: Only fetch data when sub-menu is opened

```typescript
const items = ref([[
  {
    label: 'Load more',
    children: [] // Start empty
  }
]])

// Load on first open
function loadSubItems() {
  // Fetch and populate children
}
```

### Common Gotchas

1. **Checkbox reactivity**: Must use `computed()` for items array when using checkboxes

2. **Menu closes on select**: Default behavior closes menu; use `e.preventDefault()` to prevent

3. **TypeScript types**: Import `DropdownMenuItem` from `@nuxt/ui`, not from component

4. **Icon names**: Must use Iconify format: `i-{collection}-{icon}` (e.g., `i-lucide-user`)

5. **Width behavior**: Default width is auto-sized to content; use `ui.content` to customize

---

## 9. Comparison Notes

### Unique Features vs Typical Dropdown Components

1. **Built on Reka UI primitives**: Leverages a robust, accessible foundation rather than custom implementation

2. **TypeScript-first design**: Full type definitions with `DropdownMenuItem` interface

3. **Flexible styling via ui prop**: More granular control than typical class/className props

4. **Checkbox items built-in**: Native support for checkbox menu items without additional components

5. **Keyboard shortcut display**: First-class support for showing keyboard shortcuts with `kbds` property

6. **Multiple trigger types**: Can use any component as trigger (not just buttons)

7. **Automatic width matching**: CSS variable-based width matching to trigger element

8. **Nested menu support**: Native sub-menu support through `children` property

9. **Group-based organization**: Items structure uses nested arrays for natural grouping

10. **Integration with Nuxt ecosystem**: Works seamlessly with NuxtLink, defineShortcuts, and other Nuxt features

### Compared to Headless UI Dropdown

- **More opinionated styling**: Nuxt UI provides default Tailwind styles vs fully headless
- **Better TypeScript experience**: More comprehensive type definitions
- **Tighter Nuxt integration**: Built specifically for Nuxt apps
- **Keyboard shortcuts display**: Built-in vs manual implementation

### Compared to Radix UI Dropdown Menu

- **Vue-specific**: Built for Vue 3 / Nuxt (Radix is React-focused)
- **Tailwind-first**: Designed for Tailwind CSS workflows
- **Simpler API**: More opinionated with sensible defaults
- **Items-based**: Declarative array structure vs component composition

### Compared to Bootstrap/Material Dropdowns

- **Fully typed**: Complete TypeScript support
- **More accessible**: WAI-ARIA compliant by default
- **Better keyboard navigation**: More comprehensive keyboard support
- **Modern styling approach**: Tailwind utilities vs pre-built themes
- **Compositional triggers**: Any component can trigger vs specific button types

---

## Key Findings Summary

### Strengths

1. **Accessibility-first**: WAI-ARIA compliant with full keyboard and screen reader support
2. **Developer experience**: Excellent TypeScript support and intuitive API
3. **Flexible styling**: Granular control through ui prop while maintaining defaults
4. **Feature-rich**: Checkboxes, nested menus, shortcuts, icons, avatars all built-in
5. **Framework integration**: Seamless integration with Nuxt ecosystem (routing, shortcuts, etc.)
6. **Solid foundation**: Built on battle-tested Reka UI primitives
7. **Customizable**: Can override any slot styling without fighting the framework

### Considerations

1. **Nuxt-specific**: Tightly coupled to Nuxt framework (not standalone Vue component)
2. **Items structure learning curve**: Nested array structure takes getting used to
3. **Computed requirement for reactivity**: Checkbox items require `computed()` wrapper for proper reactivity
4. **Icon dependency**: Requires Iconify icons (can't easily use custom SVGs)
5. **Documentation access**: Official docs may be blocked in some environments
6. **Bundle size**: Brings in Reka UI primitives (though tree-shakeable)

### Best Use Cases

- User account menus in Nuxt applications
- Context menus with multiple action groups
- Settings menus with checkbox options
- Navigation menus with keyboard shortcuts
- Any action menu requiring accessibility compliance

---

**Research Sources:**
- Official Nuxt UI Documentation (ui.nuxt.com)
- Nuxt UI GitHub Repository
- Community discussions and issue threads
- Web search aggregation of documentation and examples
