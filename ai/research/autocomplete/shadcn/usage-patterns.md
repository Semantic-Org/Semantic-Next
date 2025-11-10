# ShadCN - Combobox Usage Patterns

## Component URL
https://ui.shadcn.com/docs/components/combobox
Status: ✅ Working
Version: Current
Last Verified: 2025-11-10

## Documentation Quality
Comprehensive - Provides multiple complete examples with different usage patterns, full code samples, and integration guidance.

## Component Definition
- **Core purpose**: Provides a searchable dropdown selection interface combining text input with a filterable list of options
- **Mental model**: A command palette pattern - users type to filter, then select from narrowed results. Combines the flexibility of autocomplete with the structure of a traditional dropdown
- **Semantic meaning**: Represents a selection input where the user can both search and choose from a predefined set of options

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `text="Hello"`)
- **Composed**: Via composition/children (e.g., `<Component>{content}</Component>`)
- **CSS-only**: Requires custom styling (e.g., `style={{ ... }}`)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text input | ✅ | Composed | Via `<CommandInput placeholder="Search..." />` component nested within Command |
| Dropdown list | ✅ | Composed | Via `<Popover>` containing `<Command>` with `<CommandList>` and `<CommandGroup>` |
| Filtering/search | ✅ | Native | Built into `<Command>` component - automatically filters `<CommandItem>` children based on input |
| Multiple selection | ❌ | - | Not demonstrated; component shows single-select patterns only |
| Custom option rendering | ✅ | Composed | Full control over CommandItem children - examples show icons, labels, badges |
| Creatable options | ❌ | - | Not shown in documentation |
| Grouping | ✅ | Composed | Via `<CommandGroup>` - can have multiple groups with headers |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Single select | ✅ | Composed | Primary pattern - uses `value` state to track selected item, toggles on re-select |
| Multi select | ❌ | - | Not demonstrated |
| Async/remote data | ❌ | - | Not explicitly shown, but structure suggests compatibility with async state updates |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Loading | ❌ | - | Not demonstrated, though Command component may support it |
| Disabled | ✅ | Native | Button component supports `disabled` prop (not shown in examples) |
| Error/Invalid | ❌ | - | Not shown in examples |
| Empty state | ✅ | Composed | Via `<CommandEmpty>No results.</CommandEmpty>` component |
| No results | ✅ | Composed | Same as empty state - shows when filter produces no matches |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅ | CSS-only | Width controlled via `className="w-[200px]"` on PopoverContent |
| Placeholder text | ✅ | Native | `placeholder` prop on CommandInput and display text in trigger Button |
| Clear button | ❌ | - | Not shown, but toggle-to-deselect pattern provides similar UX |
| Icons | ✅ | Composed | Check icon for selection state, ChevronsUpDown for dropdown affordance |
| Virtualization | ❌ | - | Not mentioned for large lists |

## Code Examples

### Primary Usage Example (Framework Selector)
```tsx
"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
]

export function ComboboxDemo() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? frameworks.find((framework) => framework.value === value)?.label
            : "Select framework..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search framework..." />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {frameworks.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === framework.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {framework.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
```

### Responsive Pattern (Mobile/Desktop)
```tsx
"use client"

import * as React from "react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type Status = {
  value: string
  label: string
}

const statuses: Status[] = [
  { value: "backlog", label: "Backlog" },
  { value: "todo", label: "Todo" },
  { value: "in progress", label: "In Progress" },
  { value: "done", label: "Done" },
  { value: "canceled", label: "Canceled" },
]

export function ComboBoxResponsive() {
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [selectedStatus, setSelectedStatus] = React.useState<Status | null>(null)

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[150px] justify-start">
            {selectedStatus ? <>{selectedStatus.label}</> : <>+ Set status</>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <StatusList setOpen={setOpen} setSelectedStatus={setSelectedStatus} />
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-[150px] justify-start">
          {selectedStatus ? <>{selectedStatus.label}</> : <>+ Set status</>}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <StatusList setOpen={setOpen} setSelectedStatus={setSelectedStatus} />
        </div>
      </DrawerContent>
    </Drawer>
  )
}

function StatusList({
  setOpen,
  setSelectedStatus,
}: {
  setOpen: (open: boolean) => void
  setSelectedStatus: (status: Status | null) => void
}) {
  return (
    <Command>
      <CommandInput placeholder="Filter status..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {statuses.map((status) => (
            <CommandItem
              key={status.value}
              value={status.value}
              onSelect={(value) => {
                setSelectedStatus(
                  statuses.find((priority) => priority.value === value) || null
                )
                setOpen(false)
              }}
            >
              {status.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
```

## Notable Features

### Composition-First Architecture
The Combobox is not a single component but a composition pattern combining:
- **Popover**: Handles positioning and overlay behavior
- **Command**: Provides search/filter functionality and keyboard navigation
- **Button**: Trigger element with custom content

This composition approach provides maximum flexibility but requires understanding multiple components.

### Toggle Selection Pattern
The component implements a toggle-to-deselect pattern:
```tsx
onSelect={(currentValue) => {
  setValue(currentValue === value ? "" : currentValue)
  setOpen(false)
}}
```
Clicking the currently selected item deselects it.

### Accessibility Built-In
- Proper ARIA attributes (`role="combobox"`, `aria-expanded`)
- Keyboard navigation via Command component
- Screen reader friendly selection feedback

### Responsive Design Pattern
Demonstrates a sophisticated responsive pattern:
- Desktop: Uses Popover for precise positioning
- Mobile: Uses Drawer for better mobile UX
- Shared component logic between both variants
- Media query hook for runtime switching

### Visual Feedback System
- Check icon with opacity transition for selection state
- ChevronsUpDown icon indicating dropdown affordance
- Empty state messaging when no results match
- Conditional className application via `cn()` utility

### Dependencies on Other ShadCN Components
Requires installation of:
- Popover component
- Command component
- Button component
- Drawer component (for responsive variant)

## Research Notes

### Documentation Strengths
- Four distinct usage examples showing different patterns
- Complete, copy-paste ready code samples
- Demonstrates responsive design considerations
- Shows integration with other component patterns (DropdownMenu)

### Implementation Approach
ShadCN's Combobox demonstrates a **composition-over-configuration** philosophy:
- No single Combobox component with props
- Instead, compose primitives together for maximum control
- More verbose but extremely flexible
- Each piece can be customized independently

### Comparison to Traditional Autocomplete
Unlike typical autocomplete components, this pattern:
- Always shows a button-style trigger (not a plain input)
- Uses a command palette mental model
- Provides rich keyboard shortcuts
- Focuses on selection from known options rather than free-form input with suggestions

### Framework Dependencies
- Built specifically for React
- Uses React hooks for state management
- Relies on Radix UI primitives (Popover) under the hood
- Requires client-side rendering ("use client" directive)
