# Component Pattern Research: Context Menu

> Last Modified: 2025-11-05

## Research Summary
- Frameworks surveyed: 4
- Date: 2025-11-05
- Unique patterns identified: 45+

## Component Definition Consensus

Context Menu components display contextual actions triggered by right-click (or long-press on touch devices), appearing at cursor position. Universal mental model: "OS-style right-click menu."

**Primary Purpose:** Provide quick access to contextually relevant actions and operations for the clicked element, following familiar desktop application patterns.

**Mental Model:** A floating overlay menu that appears on right-click, presenting actions specific to what was clicked, similar to native operating system context menus.

**Semantic meaning:** Represents secondary actions or contextual operations available for specific elements, communicating "here are the actions you can perform on this item."

## Terminology Variations

- **Context Menu** (3 frameworks) = ShadCN, Radix UI, Nuxt UI
- **ContextMenu** (1 framework) = PrimeReact

All frameworks use variants of "Context Menu" terminology.

## Pattern Inventory

### Activation Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Right-click trigger | Mouse right-click activation | 4/4 (100%) | **Level 1: Universal** | All | Native |
| Long-press trigger | Touch device support | 1/4 (25%) | **Level 4: Occasional** | Radix UI | Native |
| Element-targeted | Specific element trigger | 4/4 (100%) | **Level 1: Universal** | All | Native |
| Document-global | Entire page trigger | 1/4 (25%) | **Level 4: Occasional** | PrimeReact | Native |
| Programmatic show | show() method | 1/4 (25%) | **Level 4: Occasional** | PrimeReact | Native |

### Content Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Text content | Text labels for items | 4/4 (100%) | **Level 1: Universal** | All | Composed/Native |
| Icon support | Icons in menu items | 4/4 (100%) | **Level 1: Universal** | All | Composed/Native |
| Keyboard shortcuts | Shortcut display | 3/4 (75%) | **Level 2: Common** | ShadCN, Nuxt UI, Radix UI | Composed/Native |
| Section labels | Non-interactive headers | 3/4 (75%) | **Level 2: Common** | ShadCN, Nuxt UI, Radix UI | Native |
| Separators | Visual dividers | 4/4 (100%) | **Level 1: Universal** | All | Native |
| Custom content | Any React/Vue children | 4/4 (100%) | **Level 1: Universal** | All | Composed |
| Item indicators | Check/radio state display | 2/4 (50%) | **Level 3: Frequent** | ShadCN, Radix UI | Native |
| Custom templates | Template functions | 2/4 (50%) | **Level 3: Frequent** | Nuxt UI, PrimeReact | Native |

### Item Type Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Standard items | Basic clickable items | 4/4 (100%) | **Level 1: Universal** | All | Native |
| Checkbox items | Toggle state items | 3/4 (75%) | **Level 2: Common** | ShadCN, Nuxt UI, Radix UI | Native |
| Radio items | Mutually exclusive selection | 2/4 (50%) | **Level 3: Frequent** | ShadCN, Radix UI | Native |
| Link items | Navigation items | 1/4 (25%) | **Level 4: Occasional** | Nuxt UI | Native |
| Label items | Section headers | 1/4 (25%) | **Level 4: Occasional** | Nuxt UI | Native |
| Nested submenus | Multi-level menus | 4/4 (100%) | **Level 1: Universal** | All | Native |

### State Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Open/closed state | Menu visibility | 4/4 (100%) | **Level 1: Universal** | All | Native |
| Disabled items | Non-interactive items | 4/4 (100%) | **Level 1: Universal** | All | Native |
| Checked state | Checkbox state | 3/4 (75%) | **Level 2: Common** | ShadCN, Nuxt UI, Radix UI | Native |
| Selected value | Radio group value | 2/4 (50%) | **Level 3: Frequent** | ShadCN, Radix UI | Native |
| Highlighted state | Focus/hover indication | 3/4 (75%) | **Level 2: Common** | ShadCN, Radix UI, Nuxt UI | Native/CSS-only |
| Indeterminate state | Three-state checkbox | 1/4 (25%) | **Level 4: Occasional** | Radix UI | Native |
| Modal/non-modal | Background interaction | 2/4 (50%) | **Level 3: Frequent** | Nuxt UI, Radix UI | Native |

### Behavior Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Command callbacks | Action handlers | 3/4 (75%) | **Level 2: Common** | ShadCN, Nuxt UI, PrimeReact | Native |
| Router integration | Navigation URLs | 2/4 (50%) | **Level 3: Frequent** | Nuxt UI, PrimeReact | Native |
| Auto-close on select | Close after action | 4/4 (100%) | **Level 1: Universal** | All | Native |
| Portal rendering | Body-level rendering | 3/4 (75%) | **Level 2: Common** | ShadCN, Radix UI, PrimeReact | Native |
| Typeahead search | Keyboard quick nav | 1/4 (25%) | **Level 4: Occasional** | Radix UI | Native |
| Loop navigation | Wrap-around keyboard nav | 1/4 (25%) | **Level 4: Occasional** | Radix UI | Native |

### Positioning Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Cursor positioning | Appear at click location | 4/4 (100%) | **Level 1: Universal** | All | Native |
| Offset control | Adjust position | 1/4 (25%) | **Level 4: Occasional** | Radix UI | Native |
| Collision detection | Viewport-aware placement | 1/4 (25%) | **Level 4: Occasional** | Radix UI | Native |
| Sticky positioning | Priority axis control | 1/4 (25%) | **Level 4: Occasional** | Radix UI | Native |

### Styling Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Size options | Multiple size variants | 1/4 (25%) | **Level 4: Occasional** | Nuxt UI | Native |
| Color options | Semantic colors | 1/4 (25%) | **Level 4: Occasional** | Nuxt UI | Native |
| Destructive variant | Dangerous action styling | 1/4 (25%) | **Level 4: Occasional** | ShadCN | Native |
| Inset spacing | Consistent indentation | 1/4 (25%) | **Level 4: Occasional** | ShadCN | Native |
| Custom width | Width control | 2/4 (50%) | **Level 3: Frequent** | ShadCN, PrimeReact | CSS-only/Native |
| Data attributes | State-driven styling | 2/4 (50%) | **Level 3: Frequent** | ShadCN, Radix UI | CSS-only |
| CSS variables | Layout data exposure | 1/4 (25%) | **Level 4: Occasional** | Radix UI | CSS-only |

### Accessibility Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| WAI-ARIA compliance | Menu pattern implementation | 4/4 (100%) | **Level 1: Universal** | All | Native |
| Keyboard navigation | Full keyboard control | 4/4 (100%) | **Level 1: Universal** | All | Native |
| Focus management | Roving tabindex | 4/4 (100%) | **Level 1: Universal** | All | Native |
| Screen reader support | ARIA roles and states | 4/4 (100%) | **Level 1: Universal** | All | Native |
| RTL support | Right-to-left layouts | 1/4 (25%) | **Level 4: Occasional** | Radix UI | Native |

## Notable Patterns

### Universal (100%)
- Right-click activation
- Element-targeted triggering
- Text content and icon support
- Separators for grouping
- Standard clickable items
- Nested submenu support
- Disabled item state
- Open/closed management
- Auto-close on select
- Cursor positioning
- Full keyboard navigation
- WAI-ARIA compliance
- Focus management

### ShadCN Specializations
- 12 compound components
- Built on Radix UI v2.2.16
- Tailwind-first styling
- ContextMenuShortcut component
- Destructive variant
- Inset spacing pattern
- Copy-paste installation
- Comprehensive composition API

### Nuxt UI Specializations
- Built on Reka UI
- 5 size variants (xs-xl)
- Semantic color system
- Slot-based customization
- Checkbox item support
- Link type with Vue Router
- defineShortcuts() composable
- Modal prop for background
- Grouped items via arrays
- v4.1.0 with active development

### Radix UI Specializations
- Pure headless primitive
- 13+ specialized components
- 32.08 kB gzipped
- Long-press touch support
- Three-state checkbox (indeterminate)
- Typeahead navigation
- Loop navigation control
- RTL/LTR directional awareness
- CSS variables for layout data
- Origin-aware animations
- Collision detection engine
- Sticky positioning
- Modal/non-modal modes

### PrimeReact Specializations
- Model-driven API
- MenuItem configuration objects
- Document-global support
- Programmatic show() method
- Custom item templates
- DataTable integration
- Responsive breakpoints
- Command and URL navigation
- onHide callback
- PrimeIcons integration
- v10.9.7

## Implementation Notes

### Installation

**ShadCN:**
```bash
pnpm dlx shadcn@latest add context-menu
```

**Nuxt UI:**
```vue
<UContextMenu :items="items">
```

**Radix UI:**
```bash
npm install @radix-ui/react-context-menu
```

**PrimeReact:**
```jsx
import { ContextMenu } from 'primereact/contextmenu'
```

### Basic Usage Comparison

**ShadCN:**
```jsx
<ContextMenu>
  <ContextMenuTrigger>Right click</ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem>Profile</ContextMenuItem>
    <ContextMenuItem>Billing</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>
```

**Nuxt UI:**
```vue
<UContextMenu :items="items">
  <div>Right-click me</div>
</UContextMenu>

<script setup>
const items = [
  { label: 'Cut', icon: 'i-heroicons-scissors' },
  { label: 'Copy', icon: 'i-heroicons-clipboard' }
]
</script>
```

**Radix UI:**
```jsx
<ContextMenu.Root>
  <ContextMenu.Trigger>Right click</ContextMenu.Trigger>
  <ContextMenu.Portal>
    <ContextMenu.Content>
      <ContextMenu.Item>Profile</ContextMenu.Item>
      <ContextMenu.Item>Billing</ContextMenu.Item>
    </ContextMenu.Content>
  </ContextMenu.Portal>
</ContextMenu.Root>
```

**PrimeReact:**
```jsx
const cm = useRef(null);
const items = [
  { label: 'Edit', icon: 'pi pi-pencil', command: handleEdit },
  { label: 'Delete', icon: 'pi pi-trash', command: handleDelete }
];

<ContextMenu model={items} ref={cm} />
<div onContextMenu={(e) => cm.current.show(e)}>
  Right click
</div>
```

### Keyboard Navigation Patterns

All frameworks implement comprehensive keyboard support:

**Standard Keys:**
- **ArrowUp/Down**: Navigate items
- **ArrowRight**: Open submenu / Close (RTL)
- **ArrowLeft**: Close submenu / Open (RTL)
- **Enter/Space**: Activate item
- **Escape**: Close menu
- **Tab**: Exit menu (some frameworks)
- **Home/End**: First/last item (Radix UI, PrimeReact)

**Radix UI Additional:**
- **Type-ahead**: Quick navigation by typing
- **Loop**: Optional wrap-around navigation

### Checkbox and Radio Patterns

**ShadCN/Radix UI:**
```jsx
<ContextMenuCheckboxItem checked={showBookmarks}>
  Show Bookmarks
</ContextMenuCheckboxItem>

<ContextMenuRadioGroup value="pedro">
  <ContextMenuRadioItem value="pedro">Pedro</ContextMenuRadioItem>
  <ContextMenuRadioItem value="colm">Colm</ContextMenuRadioItem>
</ContextMenuRadioGroup>
```

**Nuxt UI:**
```vue
const items = computed(() => [{
  label: 'Show Toolbar',
  type: 'checkbox',
  checked: showToolbar.value,
  onUpdateChecked: (checked) => { showToolbar.value = checked }
}])
```

### Submenu Patterns

**Compositional (ShadCN/Radix):**
```jsx
<ContextMenuSub>
  <ContextMenuSubTrigger>Share</ContextMenuSubTrigger>
  <ContextMenuSubContent>
    <ContextMenuItem>Email</ContextMenuItem>
    <ContextMenuItem>Messages</ContextMenuItem>
  </ContextMenuSubContent>
</ContextMenuSub>
```

**Data-Driven (Nuxt UI/PrimeReact):**
```jsx
const items = [{
  label: 'Share',
  children: [
    { label: 'Email' },
    { label: 'Messages' }
  ]
}]
```

## Design Philosophy Differences

### Compositional (ShadCN, Radix UI)
- **Philosophy**: Headless, composable primitives
- **Approach**: Explicit component structure
- **Styling**: External (Tailwind/CSS)
- **Control**: Maximum flexibility
- **Audience**: Design system builders

### Data-Driven (Nuxt UI, PrimeReact)
- **Philosophy**: Configuration over composition
- **Approach**: Model-driven with item objects
- **Styling**: Built-in themes + customization
- **Control**: Simplified API for common cases
- **Audience**: Rapid application development

## Use Case Consensus

All frameworks emphasize these primary use cases:
1. **File/folder operations** - Copy, paste, delete, rename
2. **Text editing** - Cut, copy, paste, formatting
3. **Image operations** - Save, copy, set as background
4. **Table row actions** - Edit, delete, duplicate
5. **List item operations** - Add, remove, reorder
6. **Canvas/drawing tools** - Object manipulation
7. **IDE/code editor** - Refactor, navigate, format

## Raw Data

- [ShadCN](./shadcn/usage-patterns.md)
- [Nuxt UI](./nuxt-ui/usage-patterns.md)
- [Radix UI](./radix-ui/usage-patterns.md)
- [PrimeReact](./primereact/usage-patterns.md)
