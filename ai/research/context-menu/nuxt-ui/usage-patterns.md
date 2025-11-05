# Nuxt UI - Context Menu Usage Patterns

## Component URL
https://ui.nuxt.com/docs/components/context-menu
Status: ✅ Working
Version: Nuxt UI v4.1.0
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - Well-structured documentation with clear examples, complete API reference, multiple usage patterns, and integration examples.

## Component Definition
- **Core purpose**: Provides a right-click activated menu overlay that displays contextual actions and options for UI elements
- **Mental model**: A floating menu that appears at cursor position on right-click, presenting relevant actions for the clicked element
- **Semantic meaning**: Represents contextual operations available for an element, similar to OS-level right-click menus

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `items`, `size`, `modal`)
- **Composed**: Via composition/children (e.g., content wrapping, custom slots)
- **CSS-only**: Requires custom styling (e.g., theme customization)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content | ✅ | Native | `label` property on items |
| Icon support | ✅ | Native | `icon` property accepts string or object |
| Custom content | ✅ | Composed | Custom slots via `slot` property with `-label` and `-trailing` variants |
| Keyboard shortcuts | ✅ | Native | `kbds` property displays keyboard shortcuts |
| Separators | ✅ | Native | `type: 'separator'` for visual grouping |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Basic items | ✅ | Native | Default clickable menu items |
| Links | ✅ | Native | `type: 'link'` with Link component props |
| Labels | ✅ | Native | `type: 'label'` for non-interactive headers |
| Separators | ✅ | Native | `type: 'separator'` for dividers |
| Checkboxes | ✅ | Native | `type: 'checkbox'` with checked state |
| Nested submenus | ✅ | Native | `children` array for recursive submenus |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Disabled menu | ✅ | Native | `disabled` prop on component prevents activation |
| Disabled items | ✅ | Native | `disabled` on individual items |
| Checked state | ✅ | Native | `checked` boolean for checkbox items |
| Modal/non-modal | ✅ | Native | `modal` boolean controls background interaction |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅ | Native | `xs`, `sm`, `md` (default), `lg`, `xl` |
| Color options | ✅ | Native | `color` property with semantic colors like `primary`, `error` |
| Grouped items | ✅ | Native | Array of arrays for separated groups |
| Nested menus | ✅ | Native | Recursive `children` support for multi-level navigation |
| Custom rendering | ✅ | Composed | Slot-based customization with `-label` and `-trailing` variants |

## Props/API Documentation

### Component Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Controls menu dimensions |
| `items` | `ContextMenuItem[] \| ContextMenuItem[][]` | Required | Menu items or grouped items |
| `modal` | `boolean` | `true` | Whether menu blocks background interaction |
| `disabled` | `boolean` | `false` | Disables context menu activation |

### Item Configuration
| Property | Type | Description |
|----------|------|-------------|
| `label` | `string` | Display text for menu item |
| `icon` | `string \| object` | Icon identifier or configuration |
| `type` | `'link' \| 'label' \| 'separator' \| 'checkbox'` | Item behavior type |
| `color` | `string` | Semantic color for highlighting |
| `checked` | `boolean` | Checkbox state |
| `disabled` | `boolean` | Disables item interaction |
| `kbds` | `string[] \| KbdProps[]` | Keyboard shortcut display |
| `children` | `ContextMenuItem[]` | Nested submenu items |
| `onSelect` | `(e: Event) => void` | Selection callback |
| `onUpdateChecked` | `(checked: boolean) => void` | Checkbox change handler |
| `slot` | `string` | Custom slot identifier |
| Link props | Various | `to`, `target`, `trailingSlash` for links |

## Code Examples

### Basic Context Menu
```vue
<template>
  <UContextMenu :items="items">
    <div>Right-click me</div>
  </UContextMenu>
</template>

<script setup lang="ts">
const items = [
  { label: 'Cut', icon: 'i-heroicons-scissors' },
  { label: 'Copy', icon: 'i-heroicons-clipboard-document' },
  { label: 'Paste', icon: 'i-heroicons-clipboard' }
]
</script>
```

### Grouped Items with Separators
```vue
<script setup lang="ts">
const items = [
  [
    { label: 'New File', icon: 'i-heroicons-document-plus' },
    { label: 'New Folder', icon: 'i-heroicons-folder-plus' }
  ],
  [
    { label: 'Cut', icon: 'i-heroicons-scissors' },
    { label: 'Copy', icon: 'i-heroicons-clipboard-document' }
  ]
]
</script>
```

### Nested Submenus
```vue
<script setup lang="ts">
const items = [
  {
    label: 'Share',
    icon: 'i-heroicons-share',
    children: [
      { label: 'Email', icon: 'i-heroicons-envelope' },
      { label: 'Message', icon: 'i-heroicons-chat-bubble-left' }
    ]
  }
]
</script>
```

### Checkbox Items
```vue
<script setup lang="ts">
const items = computed(() => [
  {
    label: 'Show Toolbar',
    type: 'checkbox',
    checked: showToolbar.value,
    onUpdateChecked: (checked) => { showToolbar.value = checked }
  }
])
</script>
```

### Custom Slots
```vue
<template>
  <UContextMenu :items="items">
    <template #custom-label>
      <div class="flex items-center gap-2">
        <UIcon name="i-heroicons-star" />
        <span>Custom Content</span>
      </div>
    </template>
  </UContextMenu>
</template>

<script setup lang="ts">
const items = [
  { slot: 'custom', label: 'Fallback Text' }
]
</script>
```

### Keyboard Shortcuts Integration
```vue
<script setup lang="ts">
const { metaSymbol } = useShortcuts()

defineShortcuts({
  meta_k: {
    handler: () => console.log('Keyboard shortcut triggered')
  }
})

const items = computed(() => [
  {
    label: 'Command',
    kbds: [metaSymbol.value, 'K'],
    onSelect: () => console.log('Menu item selected')
  }
])
</script>
```

### Non-Modal Menu
```vue
<template>
  <UContextMenu :items="items" :modal="false">
    <div>Right-click (allows background interaction)</div>
  </UContextMenu>
</template>
```

### Size Variants
```vue
<template>
  <UContextMenu :items="items" size="sm">
    <div>Small context menu</div>
  </UContextMenu>
</template>
```

### Disabled States
```vue
<script setup lang="ts">
const items = [
  { label: 'Enabled Action' },
  { label: 'Disabled Action', disabled: true }
]
</script>

<template>
  <!-- Disabled menu (won't open) -->
  <UContextMenu :items="items" disabled>
    <div>Context menu disabled</div>
  </UContextMenu>
</template>
```

### Colored Items
```vue
<script setup lang="ts">
const items = [
  { label: 'Normal Action' },
  { label: 'Delete', icon: 'i-heroicons-trash', color: 'error' }
]
</script>
```

## Composition Patterns

### Wrapping Pattern
The component wraps content that should receive the context menu. Right-click on wrapped content triggers the menu.

### Grouped Navigation
Array of arrays creates visually separated groups with automatic separators between groups.

### Recursive Submenus
Items with `children` arrays create nested menus with unlimited depth support.

### Slot-Based Customization
Items can reference custom slots for full rendering control:
- `#{{ item.slot }}` - Full item replacement
- `#{{ item.slot }}-label` - Label area only
- `#{{ item.slot }}-trailing` - Trailing area only

## Styling Approaches

### Theme Customization Classes
```typescript
{
  content: string,          // Menu container
  item: string,             // Individual items
  itemLabel: string,        // Item text
  itemTrailing: string,     // Trailing content area
  itemLeadingIcon: string,  // Leading icon positioning
  itemTrailingIcon: string, // Trailing icon positioning
  itemTrailingKbds: string  // Keyboard shortcut styling
}
```

### Size Variants
Predefined size options (`xs`, `sm`, `md`, `lg`, `xl`) control menu dimensions through the `size` prop.

### Color System
Semantic color values (`primary`, `error`, etc.) provide visual hierarchy and meaning to menu items.

## Accessibility Patterns

### Keyboard Support
- `kbds` property displays keyboard shortcuts visually
- Integration with `defineShortcuts()` composable for functional keyboard handling
- `extractShortcuts()` utility for mapping menu items to keyboard actions

### Semantic Structure
Built on Reka UI foundation providing standard context menu semantics and ARIA attributes.

### Visual Indicators
- Disabled state visually distinguishes unavailable actions
- Color coding provides semantic meaning (e.g., destructive actions in error color)
- Checkbox state clearly indicates toggle options

## Notable Features

### Activation Pattern
Right-click on wrapped content triggers menu at cursor position, following standard OS context menu behavior.

### Automatic Closure
Menu closes automatically on item selection, maintaining expected interaction patterns.

### Flexible Grouping
Supports both manual separators and automatic grouping through nested arrays.

### State Management Integration
Checkbox items work with Vue's reactivity system through `computed()` for proper state tracking.

### Link Integration
Seamlessly accepts Vue Router and Nuxt Link properties for navigation items.

### Modal Control
`modal` prop controls whether background interaction is blocked, useful for different UI contexts.

### Icon Flexibility
Icon property accepts both string identifiers and configuration objects for advanced icon customization.

### Event Handling
Provides both `onSelect` callbacks and standard event emission for flexible integration patterns.

## Research Notes

### Framework Architecture
Built on Nuxt UI v4 architecture with Reka UI primitives foundation, providing solid accessibility and behavior patterns.

### Documentation Strength
Excellent documentation with clear examples for all major patterns, good API reference, and practical integration examples (keyboard shortcuts, state management).

### Vue-Specific Patterns
Strong integration with Vue ecosystem features like computed properties for reactive items and defineShortcuts composable for keyboard handling.

### Composition Philosophy
Follows modern component composition patterns with slot-based customization while providing sensible defaults for common use cases.

### Performance Considerations
Documentation recommends wrapping checkbox items in `computed()` for proper reactivity, indicating attention to performance patterns.
