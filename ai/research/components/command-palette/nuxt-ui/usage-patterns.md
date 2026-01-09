# Nuxt UI - CommandPalette Usage Patterns

## Component URL
https://ui.nuxt.com/docs/components/command-palette
Status: ✅ Working
Version: v4.1.0 release cycle
Last Verified: 2025-11-05

## Documentation Quality
The documentation is comprehensive and well-structured. It provides:
- Clear component description with emphasis on fuzzy search capability via Fuse.js
- Complete prop reference with types and defaults
- Detailed group and item structure documentation
- Multiple code examples demonstrating different usage patterns
- Clear accessibility and keyboard support documentation
- Good coverage of customization options

The documentation excels at explaining the hierarchical data structure (groups → items → children) and the fuzzy search implementation. Examples are practical and demonstrate real-world usage patterns.

## Component Definition
- **Core purpose**: Provides a searchable command menu interface that allows users to quickly find and execute actions through keyboard-driven navigation and fuzzy search.
- **Mental model**: A command launcher similar to VS Code's Command Palette or macOS Spotlight - users type to filter a list of available commands/actions, with results ranked by relevance. Supports hierarchical navigation through nested submenus.
- **Semantic meaning**: Communicates "searchable action menu" - a power-user interface for discovering and executing commands efficiently. The fuzzy search and keyboard shortcuts emphasize speed and productivity.

## Pattern Support Levels
- **Native**: Built-in component features provided directly by the CommandPalette component (fuzzy search, item selection, nested navigation, keyboard shortcuts display, loading states, close/back buttons)
- **Composed**: Features achieved by combining CommandPalette with other patterns (custom rendering via slots, item callbacks via onSelect, external state management via v-model)
- **CSS-only**: Visual customization through the `ui` configuration object and CSS classes applied to items/groups without changing component behavior

## Core Patterns

### Search and Filtering
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Fuzzy search | ✅ | Native | Powered by Fuse.js for efficient fuzzy matching with dynamic ranking |
| Full-text search | ✅ | Native | Searches across all item properties |
| Custom filtering | ✅ | Native | `postFilter` function on groups for custom result processing |
| Ignore filtering | ✅ | Native | `ignoreFilter` property on groups to skip filtering |
| Dynamic placeholder | ✅ | Native | `placeholder` prop for search input |
| Search icon | ✅ | Native | Configurable via `icon` prop, defaults to `i-lucide-search` |

### Selection Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Single selection | ✅ | Native | Default mode, controlled via `v-model` or `default-value` |
| Multiple selection | ✅ | Native | Enabled via `multiple` prop with checkbox-style UI |
| Selection callback | ✅ | Native | `@update:model-value` event when selection changes |
| Item-level callback | ✅ | Composed | `onSelect` function property on individual items |
| Selected indicator | ✅ | Native | `selected-icon` prop, defaults to `i-lucide-check` |
| Pre-selection | ✅ | Native | Set initial selection via `default-value` prop |

### Navigation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Nested submenus | ✅ | Native | Items with `children` array create navigable submenus |
| Hierarchical navigation | ✅ | Native | Multi-level menu structure support |
| Back navigation | ✅ | Native | `back` prop/button for returning from submenus |
| Back icon | ✅ | Native | Configurable via `back-icon`, defaults to `i-lucide-arrow-left` |
| Trailing indicator | ✅ | Native | `trailing-icon` for items with submenus, defaults to `i-lucide-chevron-right` |
| Keyboard navigation | ✅ | Native | Arrow keys, Enter, Escape for navigation |

### State Management
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Loading state | ✅ | Native | `loading` prop with customizable loading icon |
| Disabled state | ✅ | Native | Component-level and item-level `disabled` property |
| Active items | ✅ | Native | `active` property on items for visual emphasis |
| Item loading | ✅ | Native | Per-item `loading` property for async operations |
| External state control | ✅ | Native | Two-way binding via `v-model` |

### Visual Presentation
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Icons | ✅ | Native | Leading icons on items via `icon` property |
| Avatars | ✅ | Native | `avatar` property on items for user representations |
| Chips/badges | ✅ | Native | `chip` property for status indicators |
| Prefix/suffix text | ✅ | Native | `prefix` and `suffix` properties on items |
| Keyboard shortcuts display | ✅ | Native | `kbds` property shows keyboard shortcuts with size variants |
| Group labels | ✅ | Native | `label` property on groups for categorization |
| Highlighted items | ✅ | Native | `highlightedIcon` on groups for emphasized items |

### Interaction Controls
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Close button | ✅ | Native | `close` prop (boolean or Button props object) |
| Close icon | ✅ | Native | Configurable via `close-icon`, defaults to `i-lucide-x` |
| Close event | ✅ | Native | `@update:open` event when close button clicked |
| Disabled interaction | ✅ | Native | `disabled` prop prevents all interactions |
| Link items | ✅ | Composed | Items support `to` and `target` properties from Link component |

### Customization
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Custom rendering | ✅ | Composed | `slot` property on groups/items for template override |
| Icon customization | ✅ | Native | All icons configurable via props |
| Button customization | ✅ | Native | Pass Button component props to `close` and `back` |
| CSS customization | ✅ | CSS-only | `ui` object and `class` property on items |
| Global config | ✅ | CSS-only | Framework-level icon and style configuration |

## Code Examples

### Basic Single Selection
```vue
<script setup>
const groups = ref([
  {
    id: 'actions',
    label: 'Actions',
    items: [
      { label: 'New File', icon: 'i-lucide-file-plus' },
      { label: 'Open File', icon: 'i-lucide-folder-open' },
      { label: 'Save', icon: 'i-lucide-save' }
    ]
  }
])

const selected = ref(null)

function handleSelection(item) {
  console.log('Selected:', item)
}
</script>

<template>
  <UCommandPalette
    v-model="selected"
    :groups="groups"
    placeholder="Search commands..."
    @update:model-value="handleSelection"
  />
</template>
```

### Multiple Selection Mode
```vue
<script setup>
const selected = ref([])

const groups = ref([
  {
    id: 'files',
    label: 'Recent Files',
    items: [
      { id: 1, label: 'index.vue', icon: 'i-lucide-file' },
      { id: 2, label: 'app.vue', icon: 'i-lucide-file' },
      { id: 3, label: 'config.ts', icon: 'i-lucide-file' }
    ]
  }
])
</script>

<template>
  <UCommandPalette
    v-model="selected"
    :groups="groups"
    multiple
    placeholder="Select files..."
  />
</template>
```

### Nested Navigation with Submenus
```vue
<script setup>
const groups = ref([
  {
    id: 'settings',
    label: 'Settings',
    items: [
      {
        label: 'Preferences',
        icon: 'i-lucide-settings',
        children: [
          { label: 'General', icon: 'i-lucide-circle' },
          { label: 'Appearance', icon: 'i-lucide-palette' },
          { label: 'Keyboard', icon: 'i-lucide-keyboard' }
        ]
      },
      {
        label: 'Extensions',
        icon: 'i-lucide-puzzle',
        children: [
          { label: 'Installed', icon: 'i-lucide-check' },
          { label: 'Recommended', icon: 'i-lucide-star' }
        ]
      }
    ]
  }
])
</script>

<template>
  <UCommandPalette
    :groups="groups"
    back
    placeholder="Search settings..."
  />
</template>
```

### With Keyboard Shortcuts
```vue
<script setup>
const groups = ref([
  {
    id: 'edit',
    label: 'Edit',
    items: [
      {
        label: 'Copy',
        icon: 'i-lucide-copy',
        kbds: ['meta', 'C']
      },
      {
        label: 'Paste',
        icon: 'i-lucide-clipboard',
        kbds: ['meta', 'V']
      },
      {
        label: 'Cut',
        icon: 'i-lucide-scissors',
        kbds: ['meta', 'X']
      }
    ]
  }
])
</script>

<template>
  <UCommandPalette :groups="groups" />
</template>
```

### Custom Item Callbacks
```vue
<script setup>
const groups = ref([
  {
    id: 'actions',
    items: [
      {
        label: 'Delete File',
        icon: 'i-lucide-trash',
        onSelect: async () => {
          await deleteFile()
          console.log('File deleted')
        }
      },
      {
        label: 'Refresh',
        icon: 'i-lucide-refresh-cw',
        onSelect: () => {
          location.reload()
        }
      }
    ]
  }
])
</script>

<template>
  <UCommandPalette :groups="groups" />
</template>
```

### With Loading States
```vue
<script setup>
const loading = ref(false)
const groups = ref([
  {
    id: 'async',
    items: [
      {
        label: 'Fetch Data',
        icon: 'i-lucide-download',
        loading: false,
        onSelect: async (item) => {
          item.loading = true
          await fetchData()
          item.loading = false
        }
      }
    ]
  }
])
</script>

<template>
  <UCommandPalette
    :groups="groups"
    :loading="loading"
    loading-icon="i-lucide-loader-circle"
  />
</template>
```

### Custom Filtering
```vue
<script setup>
const groups = ref([
  {
    id: 'users',
    label: 'Users',
    postFilter: (items, query) => {
      // Custom filtering logic - e.g., filter by role
      return items.filter(item =>
        item.label.toLowerCase().includes(query.toLowerCase()) &&
        item.role === 'admin'
      )
    },
    items: [
      { label: 'John Doe', role: 'admin' },
      { label: 'Jane Smith', role: 'user' },
      { label: 'Bob Admin', role: 'admin' }
    ]
  },
  {
    id: 'static',
    label: 'Quick Actions',
    ignoreFilter: true, // Always show these items
    items: [
      { label: 'Help', icon: 'i-lucide-help-circle' },
      { label: 'Settings', icon: 'i-lucide-settings' }
    ]
  }
])
</script>

<template>
  <UCommandPalette :groups="groups" />
</template>
```

### With Visual Enhancements
```vue
<script setup>
const groups = ref([
  {
    id: 'people',
    label: 'Team Members',
    highlightedIcon: 'i-lucide-star',
    items: [
      {
        label: 'Alice Johnson',
        avatar: { src: '/alice.jpg' },
        chip: { text: 'Online', color: 'green' },
        prefix: '👋',
        suffix: 'Lead Developer'
      },
      {
        label: 'Bob Smith',
        avatar: { src: '/bob.jpg' },
        chip: { text: 'Away', color: 'yellow' },
        suffix: 'Designer'
      }
    ]
  }
])
</script>

<template>
  <UCommandPalette :groups="groups" />
</template>
```

### With Close and Back Controls
```vue
<script setup>
const groups = ref([
  {
    id: 'nav',
    items: [
      {
        label: 'Account',
        children: [
          { label: 'Profile', to: '/profile' },
          { label: 'Settings', to: '/settings' }
        ]
      }
    ]
  }
])

function handleClose() {
  console.log('Palette closed')
}
</script>

<template>
  <UCommandPalette
    :groups="groups"
    :close="{ color: 'neutral', variant: 'ghost' }"
    close-icon="i-lucide-x"
    :back="{ color: 'neutral', variant: 'ghost' }"
    back-icon="i-lucide-arrow-left"
    @update:open="handleClose"
  />
</template>
```

## Styling Approaches

### Icon System
- **Search Icon**: Configurable via `icon` prop (default: `i-lucide-search`)
- **Selected Icon**: Configurable via `selected-icon` prop (default: `i-lucide-check`)
- **Trailing Icon**: For submenu items via `trailing-icon` prop (default: `i-lucide-chevron-right`)
- **Loading Icon**: Configurable via `loading-icon` prop (default: `i-lucide-loader-circle`)
- **Close Icon**: Configurable via `close-icon` prop (default: `i-lucide-x`)
- **Back Icon**: Configurable via `back-icon` prop (default: `i-lucide-arrow-left`)
- **Per-Item Icons**: Set via `icon` property on individual items

### Customization Patterns
1. **Button Props**: Pass Button component props to `close` and `back` for styling
   ```vue
   :close="{ color: 'primary', variant: 'soft' }"
   :back="{ color: 'neutral', variant: 'ghost' }"
   ```

2. **UI Configuration Object**: Apply custom CSS classes via `ui` property
   ```javascript
   {
     label: 'Item',
     ui: {
       itemLabel: 'custom-label-class',
       itemIcon: 'custom-icon-class'
     }
   }
   ```

3. **Item Classes**: Direct CSS class application
   ```javascript
   {
     label: 'Item',
     class: 'custom-item-class'
   }
   ```

4. **Global Configuration**: Framework-level icon and style defaults

### Keyboard Shortcut Display
The `kbds` property supports size variants for keyboard shortcut badges:
```javascript
{
  label: 'Command',
  kbds: ['meta', 'K'] // Displays as styled keyboard keys
}
```

## Accessibility Patterns

### Keyboard Navigation
- **Search Input**: Auto-focused for immediate typing
- **Arrow Keys**: Navigate through filtered results
- **Enter**: Select highlighted item or navigate into submenu
- **Escape**: Close palette or return from submenu
- **Tab/Shift+Tab**: Expected focus management

### Keyboard Shortcuts Display
- Visual representation via `kbds` property helps users discover shortcuts
- Platform-aware (displays 'meta' key appropriately for macOS/Windows)

### State Indicators
- **Disabled Items**: Visual indication via `disabled` property
- **Loading States**: Both component-level and item-level loading indicators
- **Active Items**: `active` property for current/emphasized items
- **Selected Items**: Clear visual indication via `selected-icon`

### Screen Reader Support
- Items support standard link properties (`to`, `target`) for semantic navigation
- Proper ARIA attributes implied through component structure (not explicitly documented)

## Notable Features

1. **Fuzzy Search Integration**: Built-in Fuse.js integration provides intelligent, typo-tolerant search with relevance ranking - a significant differentiator from basic string matching.

2. **Hierarchical Data Model**: Sophisticated three-level structure (groups → items → children) enables complex command organization with unlimited nesting depth.

3. **Flexible Selection Models**: Supports both single-selection (default) and multi-selection modes, making it versatile for different use cases.

4. **Hybrid Filtering System**: Combines automatic fuzzy search with custom filtering hooks (`postFilter`, `ignoreFilter`) for fine-grained control.

5. **Rich Visual Vocabulary**: Comprehensive visual elements (icons, avatars, chips, prefixes, suffixes, keyboard shortcuts) enable expressive command representations.

6. **Async-Aware Architecture**: Built-in loading states at both component and item levels support asynchronous operations seamlessly.

7. **Customizable Navigation Controls**: Configurable close and back buttons with full Button component prop support.

8. **Callback Flexibility**: Supports both global selection handlers (`@update:model-value`) and per-item callbacks (`onSelect`), enabling different architectural patterns.

9. **Link Integration**: Items can function as navigation links through `to` and `target` properties, blurring the line between command execution and navigation.

10. **Framework-Integrated**: Leverages Nuxt UI's icon system and component ecosystem (Button, Link) for consistent theming.

## Research Notes

### Strengths
- **Best-in-class search**: Fuse.js integration is a standout feature that provides genuinely useful fuzzy matching
- **Comprehensive API**: The component covers a wide range of use cases through a well-designed prop interface
- **Flexible data model**: The groups/items/children structure scales from simple to complex scenarios
- **Visual richness**: Extensive support for visual elements makes commands discoverable and attractive

### Design Decisions
- **No mention of focus management**: Documentation doesn't explicitly cover focus trap or return-focus-on-close patterns
- **Button prop inheritance**: Clever reuse of Button component props for `close` and `back` maintains consistency
- **Dual callback approach**: Supporting both `@update:model-value` and item-level `onSelect` provides flexibility but requires documentation clarity

### Potential Limitations
- **No explicit portal/modal integration**: Not clear if component handles its own overlay/positioning or expects external wrapper
- **Filtering details**: While `postFilter` is documented, the internal Fuse.js configuration (threshold, keys, etc.) is not exposed
- **Performance considerations**: No documentation on virtualization or performance with large datasets
- **Accessibility gaps**: ARIA attributes and screen reader behavior not explicitly documented

### Implementation Patterns
- The component appears designed for embedding within a modal/dialog rather than being a standalone overlay
- The fuzzy search is always-on (no option to disable or use exact matching only)
- Multiple selection mode changes UI paradigm (checkboxes) but maintains same data structure

### Comparison Notes
- More sophisticated than basic autocomplete/select components due to hierarchical navigation
- Similar to command palettes in VS Code, Raycast, or Slack (search-first, keyboard-driven)
- Less opinionated than some alternatives (doesn't enforce modal presentation)
- The Fuse.js integration is rare among UI component libraries - most implement basic string matching
