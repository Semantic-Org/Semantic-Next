# HeroUI/NextUI - Autocomplete Usage Patterns

## Component URL
https://www.heroui.com/docs/components/autocomplete
Status: ✅ Working
Version: Current (HeroUI v2)
Last Verified: 2025-11-10

## Documentation Quality
Comprehensive - Well-organized documentation with extensive examples, API reference, accessibility notes, and performance guidance.

## Component Definition
- **Core purpose**: Provides a combined text input and filterable listbox that allows users to search and select from a list of options while typing. Optimized for accessible, keyboard-friendly selection with support for async data loading and large datasets.
- **Mental model**: Users type to filter/search through available options, with the dropdown displaying matching results in real-time. Selection can be made via keyboard navigation (arrow keys, Enter) or mouse interaction. Fundamentally a "search-to-select" pattern.
- **Semantic meaning**: A combobox control that combines the functionality of a text input field with a selection list, commonly used for search interfaces, form fields with many options, or when you need autocomplete/typeahead functionality.

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `text="Hello"`)
- **Composed**: Via composition/children (e.g., `<Component>{content}</Component>`)
- **CSS-only**: Requires custom styling (e.g., `style={{ ... }}`)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text input | ✅ | Native | Built-in text input with `placeholder` prop, `inputValue` for controlled input |
| Dropdown list | ✅ | Native | Listbox with `AutocompleteItem` children, supports both static and dynamic collections via `defaultItems` |
| Filtering/search | ✅ | Native | Real-time filtering as user types, customizable via `defaultFilter` prop for custom filter functions (default is "contains" matching) |
| Multiple selection | ❌ | N/A | Single selection only - `selectedKey`/`onSelectionChange` for one item at a time |
| Custom option rendering | ✅ | Composed | Rich item content via `AutocompleteItem` children, supports `startContent`/`endContent` for icons/metadata, descriptions |
| Creatable options | ✅ | Native | `allowsCustomValue` prop enables users to submit values not in the list |
| Grouping | ✅ | Composed | `AutocompleteSection` component for organizing items into labeled groups |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Single select | ✅ | Native | Default behavior with `selectedKey` and `onSelectionChange` |
| Multi select | ❌ | N/A | Not supported - component is designed for single selection only |
| Async/remote data | ✅ | Native | `useAsyncList` integration for async loading, supports infinite scroll, `isLoading` prop for loading states |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Loading | ✅ | Native | `isLoading` prop displays loading indicator in dropdown |
| Disabled | ✅ | Native | `isDisabled` for entire component, `disabledKeys` array for specific items |
| Error/Invalid | ✅ | Native | `isInvalid` prop + `errorMessage` prop for validation feedback |
| Empty state | ✅ | Native | Custom `emptyContent` via `listboxProps={{ emptyContent: "..." }}` |
| No results | ✅ | Native | Handled by empty state when filter returns no matches |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅ | Native | `size="sm"`, `size="md"` (default), `size="lg"` |
| Placeholder text | ✅ | Native | `placeholder` prop for input field |
| Clear button | ✅ | Native | `isClearable` prop (true by default), `onClear` event handler |
| Icons | ✅ | Native | `startContent` and `endContent` for input icons, `selectorIcon` for dropdown icon with customizable rotation via `disableSelectorIconRotation` |
| Virtualization | ✅ | Native | `isVirtualized` prop for large lists (10K+ items), configurable `itemHeight` and `maxListboxHeight`, uses `@tanstack/react-virtual` |

## Code Examples

### Basic Usage
```jsx
import {Autocomplete, AutocompleteItem} from "@heroui/react";

export const animals = [
  {label: "Cat", key: "cat", description: "The second most popular pet in the world"},
  {label: "Dog", key: "dog", description: "The most popular pet in the world"},
  {label: "Elephant", key: "elephant", description: "The largest land animal"},
  // ... additional entries
];

export default function App() {
  return (
    <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
      <Autocomplete className="max-w-xs" label="Select an animal">
        {animals.map((animal) => (
          <AutocompleteItem key={animal.key}>{animal.label}</AutocompleteItem>
        ))}
      </Autocomplete>
    </div>
  );
}
```

### Dynamic Collections
```jsx
<Autocomplete
  className="max-w-xs"
  defaultItems={animals}
  label="Favorite Animal"
  placeholder="Search an animal"
>
  {(item) => <AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>}
</Autocomplete>
```

### Controlled Component with Selection
```jsx
export default function App() {
  const [selectedKey, setSelectedKey] = React.useState(null);

  return (
    <Autocomplete
      label="Select an animal"
      selectedKey={selectedKey}
      onSelectionChange={(key) => setSelectedKey(key)}
    >
      {animals.map((animal) => (
        <AutocompleteItem key={animal.key}>{animal.label}</AutocompleteItem>
      ))}
    </Autocomplete>
  );
}
```

### Size Variations
```jsx
<Autocomplete size="sm" label="Small" />
<Autocomplete size="md" label="Medium (default)" />
<Autocomplete size="lg" label="Large" />
```

### Color Variants
```jsx
<Autocomplete color="default" />
<Autocomplete color="primary" />
<Autocomplete color="secondary" />
<Autocomplete color="success" />
<Autocomplete color="warning" />
<Autocomplete color="danger" />
```

### Style Variants
```jsx
<Autocomplete variant="flat" />
<Autocomplete variant="bordered" />
<Autocomplete variant="underlined" />
<Autocomplete variant="faded" />
```

### Disabled States
```jsx
// Disabled component
<Autocomplete isDisabled defaultSelectedKey="cat" />

// Disabled specific items
<Autocomplete disabledKeys={["zebra", "tiger", "lion", "elephant", "crocodile", "whale"]} />
```

### Required Field
```jsx
<Autocomplete isRequired label="Favorite Animal" />
```

### Label Placements
```jsx
<Autocomplete labelPlacement="inside" />
<Autocomplete labelPlacement="outside" />
<Autocomplete labelPlacement="outside-left" />
```

### With Custom Content
```jsx
<Autocomplete
  label="Select an animal"
  startContent={<SearchIcon />}
  endContent={<ClearIcon />}
>
  {animals.map((animal) => (
    <AutocompleteItem
      key={animal.key}
      startContent={<AnimalIcon type={animal.key} />}
      description={animal.description}
    >
      {animal.label}
    </AutocompleteItem>
  ))}
</Autocomplete>
```

### Async Loading with useAsyncList
```jsx
import {useAsyncList} from "@react-stately/data";

function App() {
  const list = useAsyncList({
    async load({signal, filterText}) {
      const res = await fetch(`https://api.example.com?search=${filterText}`, {signal});
      const json = await res.json();
      return {items: json.results};
    },
  });

  return (
    <Autocomplete
      items={list.items}
      isLoading={list.isLoading}
      onInputChange={list.setFilterText}
    >
      {(item) => <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>}
    </Autocomplete>
  );
}
```

### Virtualization for Large Lists
```jsx
<Autocomplete
  isVirtualized
  itemHeight={32}
  maxListboxHeight={256}
  defaultItems={largeDataset} // 10K+ items
>
  {(item) => <AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>}
</Autocomplete>
```

### Custom Filter Function
```jsx
<Autocomplete
  defaultFilter={(textValue, inputValue) => {
    // Custom matching logic
    return textValue.toLowerCase().startsWith(inputValue.toLowerCase());
  }}
>
  {/* items */}
</Autocomplete>
```

### Custom Empty State
```jsx
<Autocomplete
  listboxProps={{
    emptyContent: "No matching animals found"
  }}
>
  {/* items */}
</Autocomplete>
```

### With Sections/Grouping
```jsx
import {AutocompleteSection} from "@heroui/react";

<Autocomplete>
  <AutocompleteSection title="Mammals">
    <AutocompleteItem key="cat">Cat</AutocompleteItem>
    <AutocompleteItem key="dog">Dog</AutocompleteItem>
  </AutocompleteSection>
  <AutocompleteSection title="Reptiles">
    <AutocompleteItem key="crocodile">Crocodile</AutocompleteItem>
    <AutocompleteItem key="snake">Snake</AutocompleteItem>
  </AutocompleteSection>
</Autocomplete>
```

## API Props Summary

### Core Props
- `label` - Text label for the autocomplete
- `placeholder` - Placeholder text for input
- `defaultItems` - Initial items array for dynamic collections
- `selectedKey` - Controlled selected key
- `onSelectionChange` - Callback when selection changes
- `inputValue` - Controlled input value
- `onInputChange` - Callback when input changes

### State Props
- `isDisabled` - Disable entire component
- `isReadOnly` - Make read-only
- `isRequired` - Mark as required (shows asterisk)
- `isInvalid` - Show error state
- `errorMessage` - Error message to display
- `isLoading` - Show loading indicator
- `disabledKeys` - Array of keys to disable

### Appearance Props
- `size` - "sm" | "md" | "lg"
- `color` - "default" | "primary" | "secondary" | "success" | "warning" | "danger"
- `variant` - "flat" | "bordered" | "faded" | "underlined"
- `labelPlacement` - "inside" | "outside" | "outside-left"
- `startContent` - Icon/content before input
- `endContent` - Icon/content after input
- `selectorIcon` - Custom dropdown icon
- `disableSelectorIconRotation` - Disable icon rotation

### Behavior Props
- `isClearable` - Enable clear button (default: true)
- `allowsCustomValue` - Allow custom values not in list
- `menuTrigger` - "focus" | "input" | "manual"
- `defaultFilter` - Custom filter function
- `scrollShadowProps` - Configure scroll shadows

### Performance Props
- `isVirtualized` - Enable virtualization for large lists
- `itemHeight` - Height of virtualized items
- `maxListboxHeight` - Max height of dropdown

### Event Handlers
- `onSelectionChange` - Selection updates
- `onInputChange` - User typing
- `onOpenChange` - Dropdown visibility
- `onClear` - Clear button clicked
- `onFocus`, `onBlur`, `onKeyDown`, `onKeyUp` - Standard input events

## Notable Features

### 1. React Aria Foundation
Built on Adobe's React Aria `useComboBox` hook, ensuring high-quality accessibility and keyboard navigation out of the box. Includes ARIA semantics, focus management, and screen reader support.

### 2. Performance-First Virtualization
Native support for rendering 10K+ items efficiently using `@tanstack/react-virtual`. Configurable item heights and max list heights allow fine-tuned performance optimization.

### 3. Async Data Loading
First-class support for async operations via `useAsyncList` integration with infinite scroll capabilities. The `isLoading` prop provides built-in loading state management.

### 4. Flexible Filtering
Customizable filter logic via `defaultFilter` prop allows full control over matching behavior (contains, startsWith, fuzzy, etc.). Default uses "contains" matching.

### 5. Rich Item Customization
Items support complex layouts with `startContent`, `endContent`, and descriptions. Grouping via `AutocompleteSection` provides hierarchical organization.

### 6. Scroll Shadows
Visual feedback for scrollable content automatically adds shadows at top/bottom edges. Can be disabled or customized via `scrollShadowProps`.

### 7. Fully Controlled or Uncontrolled
Supports both controlled (`inputValue`/`selectedKey`) and uncontrolled (`defaultInputValue`/`defaultSelectedKey`) patterns for maximum flexibility.

### 8. Custom Values
`allowsCustomValue` prop enables users to submit values that don't exist in the predefined list, useful for "create new" workflows.

### 9. Theming Integration
Deeply integrated with HeroUI's theme system - all variants, colors, and sizes respect design tokens and can be customized via theme configuration.

### 10. Clear Button Control
Built-in clear functionality with `isClearable` prop and `onClear` event handler, enabled by default for better UX.

## Research Notes

### Accessibility Strengths
- Full keyboard navigation (arrows, Tab, Enter, Escape)
- Proper ARIA roles (combobox, listbox, option)
- Label association and live region announcements
- Virtual focus management for screen readers
- Touch-friendly with screen reader support

### Design Philosophy
HeroUI's Autocomplete follows a "batteries included" approach - providing comprehensive built-in features (virtualization, async loading, filtering) while maintaining flexibility through composition and prop customization. The component prioritizes accessibility and performance equally.

### Framework Integration
React-only component with deep React ecosystem integration (React Aria, React Stately). Uses modern React patterns like hooks and render props for dynamic collections.

### Comparison Notes
- More opinionated than headless solutions but less restrictive than fully-styled libraries
- Virtualization is opt-in rather than default (good for normal-sized lists)
- Single-select only design decision (simpler mental model)
- Clear separation between content (items) and behavior (props)

### Documentation Observations
The documentation is well-structured with progressive complexity - starting with simple static examples and building up to advanced patterns like async loading and virtualization. API reference is comprehensive with clear prop descriptions. The examples are production-ready and follow React best practices.
