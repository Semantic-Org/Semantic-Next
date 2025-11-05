# Component Pattern Research: Command Palette

> Last Modified: 2025-11-05

## Research Summary
- Frameworks surveyed: 2
- Date: 2025-11-05
- Unique patterns identified: 40+

## Component Definition Consensus

Command Palette components provide keyboard-driven searchable interfaces for quick command/action discovery and execution. Universal mental model: "VS Code Command Palette" or "macOS Spotlight."

**Primary Purpose:** Enable power users to quickly find and execute commands through keyboard-first search and navigation, bypassing traditional menu navigation.

**Mental Model:** A searchable command launcher that appears on keyboard shortcut (typically Cmd/Ctrl+K), filters commands as you type, and executes actions on selection - similar to VS Code's Command Palette (Cmd+Shift+P) or Slack's quick switcher.

**Semantic meaning:** Represents "quick access" and "power user features," communicating efficiency, discoverability, and keyboard-first interaction patterns for advanced users who want to bypass mouse navigation.

## Terminology Variations

- **Command** (1 framework) = ShadCN
- **CommandPalette** (1 framework) = Nuxt UI

Both frameworks use "Command" as the root concept, with ShadCN using the shorter form and Nuxt UI using the explicit "Palette" suffix.

## Pattern Inventory

### Search and Filtering Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Built-in text filtering | Automatic search filtering | 2/2 (100%) | **Level 1: Universal** | All | Native |
| Fuzzy search | Typo-tolerant matching | 1/2 (50%) | **Level 3: Frequent** | Nuxt UI | Native |
| Custom filter function | Override default filtering | 2/2 (100%) | **Level 1: Universal** | All | Native |
| Disable filtering | Manual control over results | 1/2 (50%) | **Level 3: Frequent** | ShadCN | Native |
| Keywords/aliases | Additional search terms | 1/2 (50%) | **Level 3: Frequent** | ShadCN | Native |
| Post-filter processing | Custom result transformation | 1/2 (50%) | **Level 3: Frequent** | Nuxt UI | Native |
| Ignore filter on groups | Skip filtering for specific groups | 1/2 (50%) | **Level 3: Frequent** | Nuxt UI | Native |

### Component Structure Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Search input | Text input for queries | 2/2 (100%) | **Level 1: Universal** | All | Native |
| Results list | Scrollable command list | 2/2 (100%) | **Level 1: Universal** | All | Native |
| Grouped items | Category organization | 2/2 (100%) | **Level 1: Universal** | All | Native |
| Group headings | Category labels | 2/2 (100%) | **Level 1: Universal** | All | Native |
| Separators | Visual dividers | 1/2 (50%) | **Level 3: Frequent** | ShadCN | Native |
| Empty state | No results messaging | 1/2 (50%) | **Level 3: Frequent** | ShadCN | Native |
| Loading state | Async loading indicator | 2/2 (100%) | **Level 1: Universal** | All | Native |
| Dialog/modal variant | Overlay presentation | 1/2 (50%) | **Level 3: Frequent** | ShadCN | Composed |

### Navigation Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Keyboard navigation | Arrow keys, Enter, Escape | 2/2 (100%) | **Level 1: Universal** | All | Native |
| Loop navigation | Wrap-around navigation | 1/2 (50%) | **Level 3: Frequent** | ShadCN | Native |
| Nested submenus | Multi-level navigation | 1/2 (50%) | **Level 3: Frequent** | Nuxt UI | Native |
| Back navigation | Return from submenu | 1/2 (50%) | **Level 3: Frequent** | Nuxt UI | Native |
| Auto-focus input | Focus on open | 2/2 (100%) | **Level 1: Universal** | All | Native |
| Click selection | Mouse interaction | 2/2 (100%) | **Level 1: Universal** | All | Native |

### State Management Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Controlled value | External state control | 2/2 (100%) | **Level 1: Universal** | All | Native |
| Uncontrolled mode | Internal state management | 2/2 (100%) | **Level 1: Universal** | All | Native |
| Selection callback | Item selection handler | 2/2 (100%) | **Level 1: Universal** | All | Native |
| Open/close state | Visibility control | 2/2 (100%) | **Level 1: Universal** | All | Native |
| Disabled items | Non-interactive items | 2/2 (100%) | **Level 1: Universal** | All | Native |
| Loading states | Async operation indication | 2/2 (100%) | **Level 1: Universal** | All | Native |
| Active items | Visual emphasis | 1/2 (50%) | **Level 3: Frequent** | Nuxt UI | Native |

### Selection Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Single selection | Choose one item | 2/2 (100%) | **Level 1: Universal** | All | Native |
| Multiple selection | Choose multiple items | 1/2 (50%) | **Level 3: Frequent** | Nuxt UI | Native |
| Selected indicator | Visual confirmation | 1/2 (50%) | **Level 3: Frequent** | Nuxt UI | Native |
| Pre-selection | Initial selected state | 1/2 (50%) | **Level 3: Frequent** | Nuxt UI | Native |

### Visual Presentation Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Icons | Leading icons on items | 2/2 (100%) | **Level 1: Universal** | All | Composed/Native |
| Keyboard shortcuts display | Visual shortcut hints | 2/2 (100%) | **Level 1: Universal** | All | Native |
| Avatars | User representations | 1/2 (50%) | **Level 3: Frequent** | Nuxt UI | Native |
| Badges/chips | Status indicators | 1/2 (50%) | **Level 3: Frequent** | Nuxt UI | Native |
| Prefix/suffix text | Additional context | 1/2 (50%) | **Level 3: Frequent** | Nuxt UI | Native |
| Highlighted items | Special emphasis | 1/2 (50%) | **Level 3: Frequent** | Nuxt UI | Native |
| Trailing indicators | Submenu affordance | 1/2 (50%) | **Level 3: Frequent** | Nuxt UI | Native |

### Interaction Control Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Close button | Explicit dismiss control | 1/2 (50%) | **Level 3: Frequent** | Nuxt UI | Native |
| Close on select | Auto-dismiss behavior | 2/2 (100%) | **Level 1: Universal** | All | Native |
| Escape to close | Keyboard dismiss | 2/2 (100%) | **Level 1: Universal** | All | Native |
| Link items | Navigation integration | 1/2 (50%) | **Level 3: Frequent** | Nuxt UI | Composed |

### Customization Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Custom item rendering | Template override | 2/2 (100%) | **Level 1: Universal** | All | Composed |
| Custom styling | CSS customization | 2/2 (100%) | **Level 1: Universal** | All | CSS-only |
| Icon customization | Custom icon set | 2/2 (100%) | **Level 1: Universal** | All | Native/Composed |
| Theme integration | Design system colors | 2/2 (100%) | **Level 1: Universal** | All | CSS-only |
| Dark mode | Theme-aware styling | 2/2 (100%) | **Level 1: Universal** | All | CSS-only |

### Async Data Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Async data loading | Fetch on demand | 2/2 (100%) | **Level 1: Universal** | All | Composed |
| Loading indicator | Progress feedback | 2/2 (100%) | **Level 1: Universal** | All | Native |
| Force mount items | Skip filtering for specific items | 1/2 (50%) | **Level 3: Frequent** | ShadCN | Native |

## Notable Patterns

### Universal (100%)
- Search input with text filtering
- Keyboard navigation (arrows, Enter, Escape)
- Grouped items with headings
- Loading state indicators
- Auto-focus on open
- Controlled and uncontrolled modes
- Selection callbacks
- Custom item rendering
- Icon support
- Keyboard shortcuts display
- Close on select behavior
- Disabled item state

### ShadCN Specializations
- Built on cmdk library (battle-tested)
- Copy-paste distribution model
- CommandDialog wrapper with Radix Dialog
- CommandShortcut component for visual hints
- Loop navigation option
- Custom filter function with ranking
- Keywords/aliases for search
- Force mount for always-visible items
- Empty state component
- Separator component
- Data attributes for styling
- Tailwind-first CSS approach

### Nuxt UI Specializations
- Fuzzy search via Fuse.js integration
- Multiple selection mode with checkboxes
- Hierarchical nested navigation (unlimited depth)
- Back button for submenu navigation
- Avatar support for user items
- Chips/badges for status indicators
- Prefix/suffix text fields
- Post-filter custom processing
- Ignore filter on groups
- Link integration (to/target props)
- Close button with customization
- Platform-aware keyboard shortcuts
- Highlighted items with special icon
- Per-item loading states
- Active item state
- Selected indicator icon
- Configurable all icons (7 different icons)

## Implementation Notes

### Installation

**ShadCN:**
```bash
pnpm dlx shadcn@latest add command
```

**Nuxt UI:**
```vue
<UCommandPalette v-model="selected" :items="items" />
```

### Basic Usage Comparison

**ShadCN:**
```jsx
<Command>
  <CommandInput placeholder="Type a command..." />
  <CommandList>
    <CommandEmpty>No results found.</CommandEmpty>
    <CommandGroup heading="Suggestions">
      <CommandItem onSelect={handleProfile}>
        <User className="mr-2 h-4 w-4" />
        Profile
      </CommandItem>
      <CommandItem onSelect={handleSettings}>
        <Settings className="mr-2 h-4 w-4" />
        Settings
      </CommandItem>
    </CommandGroup>
  </CommandList>
</Command>
```

**Nuxt UI:**
```vue
<UCommandPalette v-model="selected" :items="items" />

<script setup>
const items = [{
  label: 'Suggestions',
  items: [
    { label: 'Profile', icon: 'i-lucide-user', onSelect: handleProfile },
    { label: 'Settings', icon: 'i-lucide-settings', onSelect: handleSettings }
  ]
}]
</script>
```

### Dialog/Modal Pattern

**ShadCN:**
```jsx
import { CommandDialog } from "@/components/ui/command"

export function CommandMenu() {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command..." />
      <CommandList>
        <CommandGroup heading="Actions">
          <CommandItem>Calendar</CommandItem>
          <CommandItem>Search Emoji</CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
```

**Nuxt UI:**
```vue
<template>
  <UCommandPalette v-model:open="open" :items="items" />
</template>

<script setup>
const open = ref(false)

defineShortcuts({
  'meta_k': {
    usingInput: true,
    handler: () => { open.value = !open.value }
  }
})
</script>
```

### Fuzzy Search Pattern

**ShadCN (Custom Implementation):**
```jsx
// Would require custom filter function
<Command filter={(value, search) => {
  // Custom fuzzy search implementation
  return customFuzzyScore(value, search)
}}>
```

**Nuxt UI (Built-in via Fuse.js):**
```vue
<!-- Automatic fuzzy search, no configuration needed -->
<UCommandPalette :items="items" />

<!-- Items automatically ranked by relevance -->
```

### Nested Navigation

**ShadCN:**
```jsx
// No built-in support - would require custom state management
const [pages, setPages] = useState(["home"])
const page = pages[pages.length - 1]

// Render different CommandGroups based on current page
{page === "home" && (
  <CommandGroup>
    <CommandItem onSelect={() => setPages([...pages, "settings"])}>
      Settings
    </CommandItem>
  </CommandGroup>
)}
{page === "settings" && (
  <CommandGroup>
    <CommandItem onSelect={() => setPages(pages.slice(0, -1))}>
      Back
    </CommandItem>
  </CommandGroup>
)}
```

**Nuxt UI:**
```vue
<!-- Built-in hierarchical navigation -->
<UCommandPalette :items="items" back />

<script setup>
const items = [{
  label: 'Settings',
  children: [
    { label: 'Profile Settings' },
    { label: 'Account Settings' }
  ]
}]
</script>
```

### Async Data Loading

**ShadCN:**
```jsx
const [loading, setLoading] = useState(false)
const [items, setItems] = useState([])

useEffect(() => {
  setLoading(true)
  fetchItems().then(data => {
    setItems(data)
    setLoading(false)
  })
}, [])

<Command>
  <CommandInput />
  <CommandList>
    {loading && <CommandLoading>Loading...</CommandLoading>}
    <CommandGroup>
      {items.map(item => (
        <CommandItem key={item.id}>{item.label}</CommandItem>
      ))}
    </CommandGroup>
  </CommandList>
</Command>
```

**Nuxt UI:**
```vue
<UCommandPalette :items="items" :loading="loading" />

<script setup>
const loading = ref(false)
const items = ref([])

onMounted(async () => {
  loading.value = true
  items.value = await fetchItems()
  loading.value = false
})
</script>
```

## Design Philosophy Differences

### Compositional (ShadCN)
- **Philosophy**: Headless primitives with maximum flexibility
- **Approach**: Explicit component structure, build-your-own
- **Styling**: Copy-paste model, Tailwind-first, full customization
- **Control**: Maximum control over structure and behavior
- **Audience**: Design system builders, custom implementations
- **Foundation**: cmdk library + Radix Dialog

### Data-Driven (Nuxt UI)
- **Philosophy**: Configuration over composition
- **Approach**: Array-based declarative structure
- **Styling**: Built-in Nuxt UI theme system + customization
- **Control**: Simplified API for rapid development
- **Audience**: Rapid application development, consistent UX
- **Foundation**: Fuse.js for fuzzy search + Nuxt framework integration

## Use Case Consensus

Both frameworks emphasize these primary use cases:
1. **Quick navigation** - Jump to pages/sections without menu navigation
2. **Command execution** - Trigger actions via search (save, publish, delete)
3. **Search functionality** - Find content across application
4. **Keyboard shortcuts** - Power user efficiency
5. **Documentation search** - Find help topics quickly
6. **Entity quick access** - Find users, projects, files, etc.
7. **Multi-tool interface** - Calculator, unit converter, etc.

## Key Differences

### Search Capabilities
- **ShadCN**: Basic text filtering by default, custom filter function for advanced needs
- **Nuxt UI**: Built-in fuzzy search via Fuse.js with automatic relevance ranking

### Navigation Architecture
- **ShadCN**: Single-level by default, nested navigation requires custom state management
- **Nuxt UI**: Built-in multi-level hierarchical navigation with back button support

### Selection Models
- **ShadCN**: Single selection only
- **Nuxt UI**: Single or multiple selection modes with checkbox UI

### Distribution Model
- **ShadCN**: Copy-paste components (you own the code)
- **Nuxt UI**: npm package with versioned releases

### Styling Approach
- **ShadCN**: Tailwind utilities + CSS variables, data attributes for state
- **Nuxt UI**: Theme configuration object + class overrides

### Dialog Integration
- **ShadCN**: CommandDialog wrapper component with Radix Dialog
- **Nuxt UI**: Built-in open/close state, integrates with defineShortcuts() composable

## Raw Data

- [ShadCN](./shadcn/usage-patterns.md)
- [Nuxt UI](./nuxt-ui/usage-patterns.md)
