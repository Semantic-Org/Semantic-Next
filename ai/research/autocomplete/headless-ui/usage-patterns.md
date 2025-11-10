# Headless UI - Combobox Usage Patterns

## Component URL
https://headlessui.com/react/combobox
Status: ✅ Working
Version: React v2.1
Last Verified: 2025-11-10

## Documentation Quality
Comprehensive - Excellent documentation with 15+ practical examples, complete API reference, keyboard interaction guide, and integration patterns.

## Component Definition
- **Core purpose**: Build accessible autocomplete, command palette, and searchable select components with robust keyboard navigation and flexible rendering patterns
- **Mental model**: A composable system of primitives (Combobox, ComboboxInput, ComboboxButton, ComboboxOptions, ComboboxOption) that work together to create searchable dropdown interfaces. The component manages focus, keyboard navigation, and accessibility while developers control filtering logic, styling, and data flow
- **Semantic meaning**: A combined text input and listbox that allows users to filter and select from a list of options, or optionally create new values. Communicates "search and select" interaction patterns

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `multiple`, `disabled`, `value`)
- **Composed**: Via composition/children (e.g., custom option rendering, icons, labels)
- **CSS-only**: Requires custom styling (e.g., sizes, colors, animations)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text input | ✅ | Native | `ComboboxInput` component with `displayValue` prop to format selected values |
| Dropdown list | ✅ | Native | `ComboboxOptions` component with anchor positioning (`anchor="bottom"`) |
| Filtering/search | ✅ | Composed | Manual filtering via `onChange` handler - framework provides query state, developer implements filter logic |
| Multiple selection | ✅ | Native | `multiple` prop on root `Combobox` component, value becomes array |
| Custom option rendering | ✅ | Composed | Render props pattern - access `focus`, `selected` states via function children |
| Creatable options | ✅ | Composed | Add dynamic options based on query (e.g., "Create '{query}'") |
| Grouping | ❌ | N/A | Not directly supported - would require manual DOM structure |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Single select | ✅ | Native | Default behavior - `value` is single object/string |
| Multi select | ✅ | Native | `multiple` prop, `value` becomes array |
| Async/remote data | ✅ | Composed | No built-in async - manually manage loading state and update filtered options |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Loading | ✅ | Composed | Manual implementation - render loading indicator in ComboboxOptions |
| Disabled | ✅ | Native | `disabled` prop on Combobox (all options) or ComboboxOption (individual) |
| Error/Invalid | ✅ | Native | `invalid` prop on Combobox component, exposed via `data-invalid` attribute |
| Empty state | ✅ | Composed | Check filtered array length, render custom empty message |
| No results | ✅ | Composed | Use `empty:invisible` class or conditional rendering based on filtered results |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅ | CSS-only | Apply custom classes/styles - no built-in size props |
| Placeholder text | ✅ | Native | Standard HTML `placeholder` attribute on ComboboxInput |
| Clear button | ✅ | Composed | Custom button with `onClick={() => setValue(null)}` |
| Icons | ✅ | Composed | Render icons inside ComboboxButton or ComboboxOption components |
| Virtualization | ✅ | Native | `virtual` prop with options array - renders only visible items for performance |

## Code Examples

### Primary usage example - Basic combobox with filtering
```jsx
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import { useState } from 'react'

const people = [
  { id: 1, name: 'Durward Reynolds' },
  { id: 2, name: 'Kenton Towne' },
  { id: 3, name: 'Therese Wunsch' },
  { id: 4, name: 'Benedict Kessler' },
  { id: 5, name: 'Katelyn Rohan' },
]

function Example() {
  const [selectedPerson, setSelectedPerson] = useState(people[0])
  const [query, setQuery] = useState('')

  const filteredPeople =
    query === ''
      ? people
      : people.filter((person) => {
          return person.name.toLowerCase().includes(query.toLowerCase())
        })

  return (
    <Combobox value={selectedPerson} onChange={setSelectedPerson} onClose={() => setQuery('')}>
      <ComboboxInput
        aria-label="Assignee"
        displayValue={(person) => person?.name}
        onChange={(event) => setQuery(event.target.value)}
      />
      <ComboboxOptions anchor="bottom" className="border empty:invisible">
        {filteredPeople.map((person) => (
          <ComboboxOption key={person.id} value={person} className="data-focus:bg-blue-100">
            {person.name}
          </ComboboxOption>
        ))}
      </ComboboxOptions>
    </Combobox>
  )
}
```

### Multiple Selection
```jsx
function Example() {
  const [selectedPeople, setSelectedPeople] = useState([people[0], people[1]])
  const [query, setQuery] = useState('')

  const filteredPeople =
    query === ''
      ? people
      : people.filter((person) => {
          return person.name.toLowerCase().includes(query.toLowerCase())
        })

  return (
    <Combobox multiple value={selectedPeople} onChange={setSelectedPeople} onClose={() => setQuery('')}>
      {selectedPeople.length > 0 && (
        <ul>
          {selectedPeople.map((person) => (
            <li key={person.id}>{person.name}</li>
          ))}
        </ul>
      )}
      <ComboboxInput aria-label="Assignees" onChange={(event) => setQuery(event.target.value)} />
      <ComboboxOptions anchor="bottom" className="border empty:invisible">
        {filteredPeople.map((person) => (
          <ComboboxOption key={person.id} value={person} className="data-focus:bg-blue-100">
            {person.name}
          </ComboboxOption>
        ))}
      </ComboboxOptions>
    </Combobox>
  )
}
```

### Custom Creatable Values
```jsx
return (
  <Combobox value={selectedPerson} onChange={setSelectedPerson} onClose={() => setQuery('')}>
    <ComboboxInput
      aria-label="Assignee"
      displayValue={(person) => person?.name}
      onChange={(event) => setQuery(event.target.value)}
    />
    <ComboboxOptions anchor="bottom" className="border empty:invisible">
      {query.length > 0 && (
        <ComboboxOption value={{ id: null, name: query }} className="data-focus:bg-blue-100">
          Create <span className="font-bold">"{query}"</span>
        </ComboboxOption>
      )}
      {filteredPeople.map((person) => (
        <ComboboxOption key={person.id} value={person} className="data-focus:bg-blue-100">
          {person.name}
        </ComboboxOption>
      ))}
    </ComboboxOptions>
  </Combobox>
)
```

### Virtual Scrolling for Performance
```jsx
<Combobox
  value={selectedPerson}
  virtual={{ options: filteredPeople }}
  onChange={setSelectedPerson}
  onClose={() => setQuery('')}
>
  <ComboboxInput
    aria-label="Assignee"
    displayValue={(person) => person?.name}
    onChange={(event) => setQuery(event.target.value)}
  />
  <ComboboxOptions anchor="bottom" className="w-(--input-width) border empty:invisible">
    {({ option: person }) => (
      <ComboboxOption value={person} className="data-focus:bg-blue-100">
        {person.name}
      </ComboboxOption>
    )}
  </ComboboxOptions>
</Combobox>
```

[View Live Examples](https://headlessui.com/react/combobox)

## Notable Features

### Headless Architecture
- **Zero styling**: Completely unstyled by default, requiring developers to implement all visual design
- **Data attributes**: Style component states using `data-open`, `data-focus`, `data-selected`, `data-disabled`, `data-invalid`
- **Render props**: Access internal state (focus, selected, open) via function children pattern

### Advanced Positioning System
- **Anchor positioning**: Built-in dropdown positioning with `anchor` prop supporting top/bottom/left/right with start/end variants
- **Dynamic width**: CSS variable `--input-width` automatically syncs dropdown width to input
- **Gap and offset control**: Fine-tune positioning with `gap`, `offset`, `padding` configuration

### Performance Optimizations
- **Virtual scrolling**: Built-in virtualization via `virtual` prop efficiently handles 1000+ options
- **Order optimization**: `order` prop on options for performance hints

### Flexible Value Handling
- **Object comparison**: `by` prop for custom equality checking (field name or comparator function)
- **String or object values**: Works with both primitive and complex data types
- **Uncontrolled mode**: `defaultValue` prop for uncontrolled component usage

### Integration Features
- **HTML form support**: Automatic hidden input synchronization with `name` and `form` props
- **Transition support**: Built-in transition data attributes, works with Framer Motion
- **Portal rendering**: Optional `portal` prop to render dropdown outside DOM hierarchy
- **Modal behavior**: `modal` prop to control focus trapping

### Keyboard Navigation
- Comprehensive keyboard support: Arrow keys, Enter, Escape, Home, End, Tab
- Type-ahead search within options
- Focus management across input and options list

## Research Notes
- Documentation is exceptionally thorough with 15+ complete examples covering edge cases
- The framework philosophy is "completely unstyled" - all visual design is developer responsibility
- Filtering logic is intentionally manual - the framework manages UI state but not data filtering
- Virtual scrolling implementation is particularly elegant and performant
- Strong emphasis on accessibility (ARIA attributes, keyboard navigation, screen reader support)
- The `onClose` callback is critical for resetting query state when dropdown closes
- The composable primitive approach provides maximum flexibility but requires more boilerplate than opinionated frameworks
- Anchor positioning system is sophisticated and handles most common dropdown placement scenarios
- No built-in loading states or async data patterns - these are composition concerns left to developers
