# Chakra UI - Combobox Usage Patterns

## Component URL
https://chakra-ui.com/docs/components/combobox
Status: ✅ Working
Version: v3.19+ (Combobox introduced in version 3.19)
Last Verified: 2025-11-10

## Documentation Quality
Good - Clear description with accessible examples, though code examples require JavaScript execution to view in full detail. Official docs include Storybook integration and GitHub source links.

## Component Definition
- **Core purpose**: Combines a searchable text input with a filterable listbox to enable selection from dynamic option lists, solving the complex coordination of filtering, keyboard navigation, accessibility, and state management that developers typically implement manually.
- **Mental model**: Input + Listbox hybrid - users type to filter and click/keyboard to select. The component handles the intricate wiring between text input, option filtering, selection state, and accessibility requirements.
- **Semantic meaning**: A search-and-select control that provides progressive disclosure of options based on user input, signaling that users can both type freely and choose from structured options.

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `multiple={true}`, `disabled={true}`)
- **Composed**: Via composition/children (e.g., `<Combobox.Item>`, custom option rendering)
- **CSS-only**: Requires custom styling (e.g., custom indicator styles)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text input | ✅ | Composed | `<Combobox.Input placeholder="Type to search" />` component within Control |
| Dropdown list | ✅ | Composed | `<Combobox.Content>` with `<Combobox.Item>` children for each option |
| Filtering/search | ✅ | Native | Built-in filtering via `useFilter` hook and `onInputValueChange` event |
| Multiple selection | ✅ | Native | `multiple` prop enables multi-select mode with tag-based display |
| Custom option rendering | ✅ | Composed | Flexible composition within `<Combobox.Item>` allows rich content |
| Creatable options | ❌ | N/A | Not mentioned in documentation |
| Grouping | ❌ | N/A | Not explicitly documented, may be possible via custom rendering |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Single select | ✅ | Native | Default behavior without `multiple` prop |
| Multi select | ✅ | Native | `multiple` prop enables multi-selection with wrapped tag layout |
| Async/remote data | ✅ | Composed | Supports async loading as users type via `useListCollection` and API integration |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Loading | ⚠️ | CSS-only | Not explicitly documented, likely requires custom implementation |
| Disabled | ✅ | Native | `disabled` prop on Root disables entire combobox |
| Error/Invalid | ✅ | Native | `invalid` prop shows error state with appropriate styling |
| Empty state | ✅ | Composed | `<Combobox.Empty>No items found</Combobox.Empty>` for zero results |
| No results | ✅ | Composed | Same as empty state - displays when filtering returns no matches |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅ | Native | `size` prop changes combobox dimensions |
| Placeholder text | ✅ | Native | `placeholder` prop on `Combobox.Input` |
| Clear button | ✅ | Composed | `<Combobox.ClearTrigger />` within IndicatorGroup |
| Icons | ✅ | Composed | `<Combobox.Trigger />` and custom icons in IndicatorGroup |
| Virtualization | ✅ | Native | `limit` property on `useListCollection` for performance with large lists |

## Code Examples
```jsx
// Primary usage example - Basic Combobox
"use client"
import {
  Combobox,
  Portal,
  useFilter,
  useListCollection
} from "@chakra-ui/react"

const frameworks = [
  { label: "React", value: "react" },
  { label: "Vue", value: "vue" },
  { label: "Angular", value: "angular" },
  { label: "Svelte", value: "svelte" },
]

const BasicCombobox = () => {
  const { contains } = useFilter({ sensitivity: "base" })
  const { collection, filter } = useListCollection({
    initialItems: frameworks,
    filter: contains,
  })

  return (
    <Combobox.Root
      collection={collection}
      onInputValueChange={(e) => filter(e.inputValue)}
      width="320px"
    >
      <Combobox.Label>Select framework</Combobox.Label>
      <Combobox.Control>
        <Combobox.Input placeholder="Type to search" />
        <Combobox.IndicatorGroup>
          <Combobox.ClearTrigger />
          <Combobox.Trigger />
        </Combobox.IndicatorGroup>
      </Combobox.Control>

      <Portal>
        <Combobox.Positioner>
          <Combobox.Content>
            <Combobox.Empty>No items found</Combobox.Empty>
            {collection.items.map((item) => (
              <Combobox.Item item={item} key={item.value}>
                {item.label}
                <Combobox.ItemIndicator />
              </Combobox.Item>
            ))}
          </Combobox.Content>
        </Combobox.Positioner>
      </Portal>
    </Combobox.Root>
  )
}
```

```jsx
// Multiple selection variant
<Combobox.Root multiple collection={collection}>
  <Combobox.Label>Select frameworks</Combobox.Label>
  <Combobox.Control>
    <Combobox.Input placeholder="Select multiple" />
    <Combobox.IndicatorGroup>
      <Combobox.ClearTrigger />
      <Combobox.Trigger />
    </Combobox.IndicatorGroup>
  </Combobox.Control>
  {/* ... rest of implementation */}
</Combobox.Root>
```

```jsx
// Controlled state example
const [value, setValue] = useState([])
const [open, setOpen] = useState(false)

<Combobox.Root
  value={value}
  onValueChange={(details) => setValue(details.value)}
  open={open}
  onOpenChange={(details) => setOpen(details.open)}
  collection={collection}
>
  {/* ... implementation */}
</Combobox.Root>
```

[View Live](https://chakra-ui.com/docs/components/combobox) | [Storybook Examples](https://storybook.chakra-ui.com)

## Notable Features
- **Composition-based architecture**: Uses dot-notation namespacing (`Combobox.Root`, `Combobox.Input`, etc.) for clear component relationships and intuitive API
- **Built on Ark UI**: Leverages Ark UI's headless combobox primitive for robust accessibility and behavior
- **Filtering hooks**: `useFilter` and `useListCollection` provide declarative filtering with sensitivity options
- **Portal support**: Uses `<Portal>` for proper z-index management and positioning outside parent containers
- **Performance optimization**: Built-in `limit` property for rendering only visible items in large lists
- **React Hook Form integration**: Documented integration with Controller component for form management
- **Alternative control pattern**: `Combobox.RootProvider` and `useCombobox` hook enable accessing state/methods from outside component tree
- **Highlight composition**: Can combine `Combobox.Item` with `Highlight` component to emphasize matching text
- **CSS custom properties**: Exposes `--combobox-input-height`, `--combobox-input-padding-x`, `--combobox-indicator-size` for fine-grained styling control
- **Keyboard navigation**: Full arrow key support, Enter/Escape handling, and type-ahead built-in

## Research Notes
- The documentation page uses dynamic JavaScript rendering, so code examples are not fully visible in static HTML analysis
- Component introduced in Chakra UI v3.19 as a response to developer feedback about the complexity of building accessible combobox components
- Official resources include GitHub source code, Storybook interactive examples, and recipe configuration files
- The team emphasizes that comboboxes are "deceptively tricky" to implement correctly, making this component valuable for reducing implementation complexity
- Documentation includes examples for async data loading, form integration, and performance optimization, though detailed code requires viewing the live documentation site
- The component appears to follow Chakra UI v3's composition-first design philosophy with semantic part names
