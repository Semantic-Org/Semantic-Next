# Headless UI - Listbox Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://headlessui.com/react/listbox
Status: ✅ Working
Version: v2.1 (React)
Last Verified: 2025-11-05

## Documentation Quality
Excellent - Comprehensive documentation with extensive code examples, clear API reference, and detailed explanations of features including multiple selection, keyboard navigation, positioning, and form integration. Strong emphasis on real-world usage patterns.

## Component Definition
- **Core purpose**: Provides unstyled, accessible select/dropdown menus with robust keyboard navigation and state management. Acts as a foundational primitive for building custom select controls with single or multiple selection support.
- **Mental model**: A disclosure-based selection interface where clicking a button reveals a list of options. Unlike native `<select>`, provides complete styling control and supports complex option content (icons, descriptions, etc.). The selected value is controlled or uncontrolled, similar to React input patterns.
- **Semantic meaning**: Represents a selection control that allows users to choose one or more options from a list. Provides full ARIA semantics and keyboard navigation for accessibility, matching native select behavior while supporting enhanced visual design.

## Pattern Support Levels
- **Native**: Dedicated prop/API with built-in functionality
- **Composed**: Via composition with sub-components or children
- **CSS-only**: Requires custom styling (Headless UI is unstyled)
- **Render Props**: Programmatic access to component state via function children

## Value Management Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Controlled value | ✅ | Native | `value` + `onChange` props for controlled state |
| Uncontrolled value | ✅ | Native | `defaultValue` prop for uncontrolled mode |
| Single selection | ✅ | Native | Default behavior, single value |
| Multiple selection | ✅ | Native | `multiple` prop enables array-based selection |
| Value clearing | ⚠️ | Composed | Set value to `null`/`undefined` or empty array for multiple |
| Custom comparison | ✅ | Native | `by` prop accepts key name or comparison function for object values |
| Form integration | ✅ | Native | `name` prop creates hidden input synced with selection |

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text options | ✅ | Composed | Simple text as children of `ListboxOption` |
| Icon + Text | ✅ | Composed | Full control over option layout via children |
| Rich HTML content | ✅ | Composed | Complex markup supported in options |
| Descriptions | ✅ | Composed | Additional descriptive text in options |
| Grouped options | ⚠️ | Composed | No dedicated component, but can structure with dividers/headers |
| Custom option rendering | ✅ | Composed | Any React node as option content |
| Empty state | ⚠️ | Composed | Custom handling by conditionally rendering content |
| Selected display | ✅ | Native | `ListboxSelectedOption` component for showing selection in button |
| Placeholder | ✅ | Native | `placeholder` prop on `ListboxSelectedOption` |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Disabled listbox | ✅ | Native | `disabled` prop on root `Listbox` disables entire component |
| Disabled options | ✅ | Native | `disabled` prop on individual `ListboxOption` |
| Invalid state | ✅ | Native | `invalid` prop with `data-invalid` attribute for styling |
| Selected state | ✅ | Native | Automatic `data-selected` attribute on selected options |
| Focus state | ✅ | Native | Automatic `data-focus` attribute on focused option |
| Hover state | ✅ | Native | Automatic `data-hover` attribute on hovered option |
| Open state | ✅ | Native | Automatic `data-open` attribute on root when expanded |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ❌ | CSS-only | No built-in size prop - all visual styling is custom |
| Visual variants | ❌ | CSS-only | No built-in variant system - styling via CSS/Tailwind |
| Orientation | ✅ | Native | `horizontal` prop for horizontal layout with adjusted keyboard nav |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Click to open | ✅ | Native | `ListboxButton` opens options on click |
| Keyboard navigation | ✅ | Native | Full arrow key, Enter, Space, Escape, Home/End support |
| Type-ahead search | ✅ | Native | Type letters to jump to matching options |
| Click outside closes | ✅ | Native | Default behavior closes listbox when clicking outside |
| Escape key closes | ✅ | Native | Esc key closes listbox |
| Tab closes | ✅ | Native | Tabbing away closes listbox |
| Focus management | ✅ | Native | Focus returns to button on close |
| Modal mode | ✅ | Native | `modal` prop (default: true) enables scroll locking and focus trap |
| Accessibility | ✅ | Native | Full ARIA attributes, role="listbox", aria-activedescendant |

## Positioning Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Top placement | ✅ | Native | `anchor="top"` or `anchor={{ to: 'top' }}` |
| Right placement | ✅ | Native | `anchor="right"` |
| Bottom placement | ✅ | Native | `anchor="bottom"` (common default) |
| Left placement | ✅ | Native | `anchor="left"` |
| Corner alignment | ✅ | Native | Combined values: `"top start"`, `"bottom end"`, etc. |
| Gap control | ✅ | Native | `anchor.gap` prop or CSS variable `--anchor-gap` |
| Offset adjustment | ✅ | Native | `anchor.offset` prop or CSS variable `--anchor-offset` |
| Viewport padding | ✅ | Native | `anchor.padding` prevents options from touching viewport edges |
| Auto-positioning | ⚠️ | Native | Anchor system automatically adjusts to viewport constraints |
| Match button width | ✅ | CSS Variable | CSS variable `--button-width` enables width matching |
| Portal rendering | ✅ | Native | `portal` prop or auto-enabled with `anchor` |

## Transition Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Built-in transitions | ✅ | Native | `transition` prop on `ListboxOptions` |
| Data attributes | ✅ | Native | `data-closed`, `data-enter`, `data-leave` for CSS transitions |
| CSS transitions | ✅ | CSS-only | Define transitions via Tailwind or custom CSS classes |
| Framer Motion | ✅ | Composed | Use `static` prop with conditional rendering for animation libraries |
| Staggered animations | ⚠️ | CSS-only | Would require custom CSS for child element staggering |

## Code Examples

### Basic Single Select
```jsx
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react'
import { useState } from 'react'

const people = [
  { id: 1, name: 'Durward Reynolds' },
  { id: 2, name: 'Kenton Towne' },
  { id: 3, name: 'Therese Wunsch' },
]

function Example() {
  const [selectedPerson, setSelectedPerson] = useState(people[0])

  return (
    <Listbox value={selectedPerson} onChange={setSelectedPerson}>
      <ListboxButton className="rounded bg-white px-4 py-2 border">
        {selectedPerson.name}
      </ListboxButton>
      <ListboxOptions
        anchor="bottom"
        className="bg-white border rounded shadow-lg"
      >
        {people.map((person) => (
          <ListboxOption
            key={person.id}
            value={person}
            className="px-4 py-2 data-focus:bg-blue-100 cursor-pointer"
          >
            {person.name}
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  )
}
```

### Using Data Attributes for Styling
```jsx
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react'
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid'

function Example() {
  const [selected, setSelected] = useState(people[0])

  return (
    <Listbox value={selected} onChange={setSelected}>
      <ListboxButton className="group flex items-center gap-2 rounded bg-white px-4 py-2 border">
        {selected.name}
        <ChevronDownIcon className="w-4 h-4 transition group-data-open:rotate-180" />
      </ListboxButton>
      <ListboxOptions
        anchor="bottom"
        className="w-[--button-width] rounded bg-white border shadow-lg p-1"
      >
        {people.map((person) => (
          <ListboxOption
            key={person.id}
            value={person}
            className="flex items-center gap-2 px-3 py-2 rounded cursor-pointer data-focus:bg-blue-50 data-selected:bg-blue-100"
          >
            <CheckIcon className="w-5 h-5 invisible data-selected:visible" />
            {person.name}
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  )
}
```

### Using Render Props for State Access
```jsx
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react'

function Example() {
  const [selected, setSelected] = useState(people[0])

  return (
    <Listbox value={selected} onChange={setSelected}>
      {({ open }) => (
        <>
          <ListboxButton className={`rounded px-4 py-2 ${open ? 'bg-blue-500' : 'bg-gray-500'}`}>
            {selected.name}
          </ListboxButton>
          <ListboxOptions anchor="bottom" className="bg-white border shadow-lg rounded">
            {people.map((person) => (
              <ListboxOption key={person.id} value={person}>
                {({ selected, focus }) => (
                  <div className={`px-4 py-2 ${focus ? 'bg-blue-50' : ''} ${selected ? 'font-bold' : ''}`}>
                    {person.name}
                  </div>
                )}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </>
      )}
    </Listbox>
  )
}
```

### Multiple Selection
```jsx
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react'

function Example() {
  const [selectedPeople, setSelectedPeople] = useState([people[0], people[1]])

  return (
    <Listbox value={selectedPeople} onChange={setSelectedPeople} multiple>
      <ListboxButton className="rounded bg-white px-4 py-2 border">
        {selectedPeople.map(p => p.name).join(', ')}
      </ListboxButton>
      <ListboxOptions anchor="bottom" className="bg-white border rounded shadow-lg">
        {people.map((person) => (
          <ListboxOption
            key={person.id}
            value={person}
            className="px-4 py-2 data-focus:bg-blue-100 cursor-pointer"
          >
            <CheckIcon className="w-5 h-5 invisible data-selected:visible" />
            {person.name}
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  )
}
```

### Using ListboxSelectedOption
```jsx
import { Listbox, ListboxButton, ListboxOptions, ListboxOption, ListboxSelectedOption } from '@headlessui/react'

function Example() {
  const [selected, setSelected] = useState(people[0])

  return (
    <Listbox value={selected} onChange={setSelected}>
      <ListboxButton className="rounded bg-white px-4 py-2 border">
        <ListboxSelectedOption placeholder="Select a person...">
          {/* This automatically renders the selected option's content */}
        </ListboxSelectedOption>
      </ListboxButton>
      <ListboxOptions anchor="bottom" className="bg-white border rounded shadow-lg">
        {people.map((person) => (
          <ListboxOption key={person.id} value={person} className="px-4 py-2">
            {person.name}
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  )
}
```

### Rich Content Options with Icons and Descriptions
```jsx
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react'
import { UserIcon, BriefcaseIcon, AcademicCapIcon } from '@heroicons/react/20/solid'

const roles = [
  { id: 1, name: 'Developer', icon: UserIcon, description: 'Write and maintain code' },
  { id: 2, name: 'Manager', icon: BriefcaseIcon, description: 'Lead and coordinate teams' },
  { id: 3, name: 'Designer', icon: AcademicCapIcon, description: 'Create visual designs' },
]

function Example() {
  const [selected, setSelected] = useState(roles[0])

  return (
    <Listbox value={selected} onChange={setSelected}>
      <ListboxButton className="flex items-center gap-2 rounded bg-white px-4 py-2 border">
        <selected.icon className="w-5 h-5" />
        {selected.name}
      </ListboxButton>
      <ListboxOptions anchor="bottom" className="bg-white border rounded shadow-lg w-64">
        {roles.map((role) => (
          <ListboxOption
            key={role.id}
            value={role}
            className="flex items-start gap-3 px-4 py-3 data-focus:bg-blue-50 cursor-pointer"
          >
            <role.icon className="w-6 h-6 mt-0.5 text-gray-600" />
            <div>
              <div className="font-semibold data-selected:text-blue-600">{role.name}</div>
              <div className="text-sm text-gray-500">{role.description}</div>
            </div>
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  )
}
```

### Disabled Options
```jsx
<Listbox value={selected} onChange={setSelected}>
  <ListboxButton>{selected.name}</ListboxButton>
  <ListboxOptions anchor="bottom" className="bg-white border shadow-lg">
    {people.map((person) => (
      <ListboxOption
        key={person.id}
        value={person}
        disabled={person.unavailable}
        className="px-4 py-2 data-disabled:opacity-50 data-disabled:cursor-not-allowed data-focus:bg-blue-100"
      >
        {person.name}
        {person.unavailable && ' (Unavailable)'}
      </ListboxOption>
    ))}
  </ListboxOptions>
</Listbox>
```

### Uncontrolled with Form Integration
```jsx
<form action="/api/submit">
  <Listbox defaultValue={people[0]} name="person">
    <ListboxButton className="rounded bg-white px-4 py-2 border">
      <ListboxSelectedOption placeholder="Select a person..." />
    </ListboxButton>
    <ListboxOptions anchor="bottom" className="bg-white border shadow-lg">
      {people.map((person) => (
        <ListboxOption key={person.id} value={person} className="px-4 py-2">
          {person.name}
        </ListboxOption>
      ))}
    </ListboxOptions>
  </Listbox>

  <button type="submit">Submit</button>
</form>
```

### Custom Comparison with `by` Prop
```jsx
// Compare objects by 'name' property instead of reference
<Listbox value={selected} onChange={setSelected} by="name">
  <ListboxButton>{selected.name}</ListboxButton>
  <ListboxOptions anchor="bottom">
    {people.map((person) => (
      <ListboxOption key={person.id} value={person}>
        {person.name}
      </ListboxOption>
    ))}
  </ListboxOptions>
</Listbox>

// Custom comparison function
<Listbox
  value={selected}
  onChange={setSelected}
  by={(a, b) => a.id === b.id}
>
  {/* ... */}
</Listbox>
```

### Advanced Anchor Positioning
```jsx
<ListboxOptions
  anchor={{
    to: 'bottom start',    // Position at bottom-left of button
    gap: '8px',            // 8px space between button and options
    offset: '4px',         // Nudge 4px to the right
    padding: '16px'        // Keep 16px from viewport edges
  }}
  className="bg-white border shadow-lg rounded p-2 w-64"
>
  {/* options */}
</ListboxOptions>
```

### Horizontal Orientation
```jsx
<Listbox value={selected} onChange={setSelected} horizontal>
  <ListboxButton>Select size</ListboxButton>
  <ListboxOptions className="flex gap-2">
    {sizes.map((size) => (
      <ListboxOption key={size} value={size} className="px-4 py-2">
        {size}
      </ListboxOption>
    ))}
  </ListboxOptions>
</Listbox>
```

### With Transitions
```jsx
<ListboxOptions
  anchor="bottom"
  transition
  className="bg-white border shadow-lg rounded transition duration-200 data-closed:opacity-0 data-closed:scale-95 data-enter:opacity-100 data-enter:scale-100"
>
  {people.map((person) => (
    <ListboxOption key={person.id} value={person}>
      {person.name}
    </ListboxOption>
  ))}
</ListboxOptions>
```

### Invalid State
```jsx
<Listbox value={selected} onChange={setSelected} invalid={!isValid}>
  <ListboxButton className="rounded px-4 py-2 border data-invalid:border-red-500">
    {selected.name}
  </ListboxButton>
  <ListboxOptions anchor="bottom" className="bg-white border shadow-lg">
    {people.map((person) => (
      <ListboxOption key={person.id} value={person}>
        {person.name}
      </ListboxOption>
    ))}
  </ListboxOptions>
</Listbox>
```

## Available Props

### Listbox (Root Component)
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | T | - | Current selected value (controlled mode) |
| `defaultValue` | T | - | Initial value (uncontrolled mode) |
| `onChange` | (value: T) => void | - | Callback when selection changes |
| `disabled` | Boolean | `false` | Disables entire listbox |
| `multiple` | Boolean | `false` | Enables multiple selection (value becomes array) |
| `horizontal` | Boolean | `false` | Horizontal orientation (affects keyboard nav) |
| `by` | String \| Function | - | Property name or comparison function for object values |
| `name` | String | - | Form field name (creates hidden input) |
| `form` | String | - | Associated form ID |
| `invalid` | Boolean | `false` | Invalid state, applies `data-invalid` attribute |
| `as` | String \| Component | `Fragment` | Polymorphic prop to render as different element/component |
| `className` | String | - | CSS classes for styling |
| `children` | ReactNode \| Function | - | Content or render prop function |

**Render Prop State:**
```typescript
{
  value: T | T[],         // Current selection (single or array if multiple)
  open: boolean,          // Whether options are visible
  disabled: boolean,      // Disabled state
  invalid: boolean        // Invalid state
}
```

### ListboxButton
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `as` | String \| Component | `button` | Polymorphic prop to render as different element/component |
| `autoFocus` | Boolean | `false` | Focuses button on mount |
| `className` | String | - | CSS classes for styling |
| `children` | ReactNode | - | Button content |

### ListboxOptions
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `as` | String \| Component | `div` | Polymorphic prop to render as different element/component |
| `anchor` | String \| Object | - | Controls options positioning relative to button |
| `transition` | Boolean | `false` | Enables transition data attributes for animations |
| `static` | Boolean | `false` | Ignores managed state (useful for animation libraries) |
| `unmount` | Boolean | `true` | Removes options from DOM when closed |
| `portal` | Boolean | `false` | Renders options in React portal (auto-enabled with `anchor`) |
| `modal` | Boolean | `true` | Enables scroll locking and focus trap |
| `className` | String | - | CSS classes for styling |
| `children` | ReactNode | - | List of `ListboxOption` components |

**Anchor Prop Options:**
- **String values**: `"top"`, `"right"`, `"bottom"`, `"left"`, `"top start"`, `"bottom end"`, etc.
- **Object shape**:
  ```typescript
  {
    to: string,      // Position direction (e.g., "bottom start")
    gap: string,     // Space between button and options (e.g., "8px")
    offset: string,  // Nudge distance from position (e.g., "4px")
    padding: string  // Minimum clearance from viewport edges (e.g., "16px")
  }
  ```

### ListboxOption
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | T | - | Option value (required) |
| `disabled` | Boolean | `false` | Disables this option |
| `as` | String \| Component | `div` | Polymorphic prop to render as different element/component |
| `className` | String | - | CSS classes for styling |
| `children` | ReactNode \| Function | - | Option content or render prop function |

**Render Prop State:**
```typescript
{
  selected: boolean,      // Whether this option is selected
  focus: boolean,         // Whether this option has focus
  disabled: boolean,      // Whether this option is disabled
  selectedOption: boolean // Available in ListboxSelectedOption context
}
```

### ListboxSelectedOption
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `placeholder` | ReactNode | - | Shown when no selection |
| `options` | ReactNode[] | - | Array of ListboxOption elements to match against |
| `as` | String \| Component | `Fragment` | Polymorphic prop to render as different element/component |
| `className` | String | - | CSS classes for styling |
| `children` | ReactNode | - | Content (automatically uses selected option's children if empty) |

## State Data Attributes

All interaction and lifecycle states are automatically exposed as data attributes for CSS styling:

### Listbox Root & Button
- `data-open` - Applied when listbox options are visible
- `data-closed` - Applied when listbox options are hidden
- `data-disabled` - Applied when listbox is disabled
- `data-invalid` - Applied when invalid prop is true

### ListboxButton
- `data-focus` - Applied when button has focus
- `data-hover` - Applied when button is hovered
- `data-active` - Applied when button is pressed/active
- `data-autofocus` - Applied when autoFocus prop was set

### ListboxOption
- `data-selected` - Applied when option is selected
- `data-focus` - Applied when option has keyboard/mouse focus
- `data-disabled` - Applied when option is disabled
- `data-hover` - Applied when option is hovered

### ListboxOptions (with `transition` prop)
- `data-closed` - Applied when closed (for exit animations)
- `data-enter` - Applied during enter transition
- `data-leave` - Applied during leave transition

### CSS Usage Examples
```css
/* Style selected options */
.option[data-selected] {
  background-color: #e0f2fe;
  font-weight: 600;
}

/* Style focused options */
.option[data-focus] {
  background-color: #f0f9ff;
}

/* Rotate chevron when open */
.button[data-open] .chevron {
  transform: rotate(180deg);
}

/* Fade in/out transitions */
.options[data-enter] {
  opacity: 1;
  transform: scale(1);
}

.options[data-closed] {
  opacity: 0;
  transform: scale(0.95);
}
```

## CSS Variables

Headless UI provides CSS variables for fine-grained positioning control:

| Variable | Description | Usage |
|----------|-------------|-------|
| `--button-width` | Width of the ListboxButton | Set options width: `w-[--button-width]` |
| `--anchor-gap` | Space between button and options | Alternative to `anchor.gap` prop |
| `--anchor-offset` | Nudge distance from position | Alternative to `anchor.offset` prop |
| `--anchor-padding` | Viewport clearance | Alternative to `anchor.padding` prop |

```jsx
<ListboxOptions
  anchor="bottom"
  className="w-[--button-width]"
  style={{
    '--anchor-gap': '12px',
    '--anchor-offset': '8px',
    '--anchor-padding': '20px'
  }}
>
  {/* options */}
</ListboxOptions>
```

## Keyboard Navigation

Full keyboard support with standard listbox patterns:

| Key | Action |
|-----|--------|
| `Space` / `ArrowDown` / `ArrowUp` | Open listbox and focus first/last option |
| `Enter` | Open listbox (when closed) or select option (when open) |
| `Escape` | Close listbox |
| `ArrowUp` / `ArrowDown` | Navigate options vertically (default) |
| `ArrowLeft` / `ArrowRight` | Navigate options horizontally (with `horizontal` prop) |
| `Home` / `End` | Jump to first/last option |
| `A-Z` | Type-ahead search: jump to option starting with typed letter |
| `Tab` | Close listbox and move focus to next element |
| `Shift+Tab` | Close listbox and move focus to previous element |

**Multiple Selection Keyboard:**
- Selections toggle with `Enter` or `Space`
- Listbox remains open after selection
- `Escape` or clicking outside closes

## Notable Features

### 1. Dual Selection Modes
The Listbox seamlessly supports both single and multiple selection:
- **Single**: Simple value in/value out pattern
- **Multiple**: Array-based value with individual option toggling
- Both modes share the same API with just a `multiple` prop difference

### 2. Smart Object Value Handling
The `by` prop enables intelligent comparison of complex objects:
- Default: Compares by `id` property for objects
- String: Compares by specified property name
- Function: Custom comparison logic
- Solves the common problem of object reference equality in React

### 3. ListboxSelectedOption Component
Unique helper component that automatically renders selected option content:
- Eliminates manual mapping of value to display text
- Supports placeholder when no selection
- Works with both simple and complex option content
- Reduces boilerplate in common use cases

### 4. Comprehensive Form Integration
Built-in form support without external libraries:
- Hidden input automatically created with `name` prop
- Value synced on selection changes
- Supports complex object serialization
- Works with native form submission
- Bracket notation for nested field names

### 5. Dual Styling API
Like other Headless UI components, provides two approaches:
- **Data attributes**: Clean, declarative CSS with Tailwind modifiers
- **Render props**: Programmatic control with JavaScript-based styling
- Both approaches can be mixed as needed

### 6. Advanced Positioning System
Comprehensive built-in anchor positioning:
- 12+ position combinations (top/right/bottom/left × start/center/end)
- Automatic viewport boundary handling
- Fine-grained gap, offset, and padding control
- Match button width via CSS variable
- Eliminates need for external positioning libraries in most cases

### 7. Type-Ahead Search
Automatic character-based search:
- Type letters to quickly find options
- Matches beginning of option text
- No configuration required
- Works with complex option content

### 8. Flexible State Management
Supports both controlled and uncontrolled patterns:
- **Controlled**: Full control with `value` + `onChange`
- **Uncontrolled**: Simpler with `defaultValue`
- Matches React form input patterns
- Easy migration between patterns

### 9. Horizontal Orientation Support
The `horizontal` prop enables:
- Left/Right arrow navigation instead of Up/Down
- Automatic `aria-orientation="horizontal"`
- Useful for button groups, tab-like selectors
- Maintains full accessibility

### 10. Modal Behavior Control
The `modal` prop (default: true) enables:
- Scroll locking when options are open
- Focus trap within options list
- Enhanced accessibility
- Can be disabled for inline dropdown behavior

### 11. Complete Polymorphic API
Every sub-component supports the `as` prop:
- Render button as link, div, or custom component
- Render options as different container elements
- Maintains behavior and accessibility
- Enables semantic HTML flexibility

### 12. Transition System
Flexible animation support:
- **Native**: Built-in `transition` prop with data attributes
- **CSS**: Standard CSS transitions and animations
- **Tailwind**: Data modifier syntax
- **Framer Motion**: Via `static` prop and conditional rendering
- Works with any animation library

## Research Notes

### Documentation Observations
- Exceptionally comprehensive documentation with extensive real-world examples
- Clear progression from simple to complex usage patterns
- Strong focus on practical patterns (multiple selection, rich content, form integration)
- Excellent explanation of object comparison with `by` prop
- Heavy Tailwind CSS integration throughout examples
- Well-structured API reference with clear prop descriptions

### Framework Philosophy
Headless UI Listbox exemplifies the unstyled component philosophy:
- **Zero default styling**: No visual appearance whatsoever
- **Behavior-focused**: Provides state management, accessibility, and keyboard navigation
- **Positioning included**: Robust anchor system eliminates external dependencies
- **Complete flexibility**: Every visual aspect controlled by consumer
- **Integration-first**: Designed to work within existing design systems

### Architectural Decisions

**Component Composition Model:**
The Listbox uses a compound component pattern:
- Root `Listbox` manages shared state and value
- Sub-components (`Button`, `Options`, `Option`) provide specific functionality
- Automatic coordination via React context
- Clear separation of concerns

**State Management Approach:**
- Internally controlled state (not externally controlled)
- Both controlled and uncontrolled modes supported
- Value exposed via render props for reading
- `onChange` callback for writing
- Balances simplicity with flexibility

**Selection Model:**
- Single and multiple modes with same API
- Smart object comparison via `by` prop
- Automatic selection toggling in multiple mode
- Form integration via hidden input

### Accessibility Strategy
Headless UI provides accessibility through:
- Semantic foundation with proper ARIA roles
- Automatic ARIA attributes (`aria-activedescendant`, `aria-expanded`, etc.)
- Full keyboard navigation with standard listbox patterns
- Type-ahead search built-in
- Focus management and restoration
- Disabled state support for options and entire component
- Modal mode with scroll locking
- Horizontal orientation with proper aria-orientation

The approach connects accessible state with visual state via data attributes, ensuring visual design reflects semantic meaning.

### Comparison to Other Select/Listbox Implementations

**vs. Native `<select>` Element:**
- Unlimited styling freedom (native select is notoriously difficult to style)
- Support for rich content (icons, descriptions, custom layouts)
- Better keyboard navigation and type-ahead
- Consistent cross-browser appearance
- More complex to implement but far more flexible

**vs. Traditional Component Libraries:**
- No built-in visual variants (primary, secondary, etc.)
- No default styling or themes
- More flexible positioning options
- Requires more setup but provides more control
- No opinions about visual design

**vs. Other Headless Libraries:**
- More opinionated structure (compound components)
- Built-in positioning (Radix UI uses Floating UI)
- Unique `ListboxSelectedOption` helper component
- React-specific (no Vue/Svelte versions)
- Simpler API than some alternatives

**vs. Dropdown/Menu Components:**
- Listbox is for selection, Menu is for actions
- Listbox maintains selected state, Menu typically doesn't
- Listbox closes on selection (single) or stays open (multiple)
- Different ARIA semantics (role="listbox" vs role="menu")

### Use Cases
Ideal for:
- Custom design systems needing behavior without visual opinions
- Select controls with rich option content (icons, descriptions, avatars)
- Multiple selection scenarios
- Form fields with complex object values
- Applications with existing design systems
- Teams using Tailwind CSS
- Projects requiring precise positioning control
- Accessible custom selects

Not ideal for:
- Simple text-only selects (native `<select>` might be simpler)
- Teams wanting pre-styled components
- Projects without existing styling infrastructure
- Rapid prototyping without design resources
- Very large option lists (thousands of items - needs virtualization)

### Developer Experience Highlights

**Strengths:**
- Excellent documentation with practical examples
- Intuitive API that matches React patterns
- TypeScript support with proper types
- Excellent Tailwind CSS integration
- Flexible enough for any design system
- Strong accessibility built-in
- Smart object comparison solves common React problem
- `ListboxSelectedOption` reduces boilerplate

**Challenges:**
- Requires CSS knowledge for all styling
- More verbose than pre-styled components
- No visual feedback during development
- Learning curve for positioning system
- React-only (limits framework choice)
- Large option lists need custom virtualization

**Best Practices from Documentation:**
- Use `by` prop for object values to avoid reference comparison issues
- Use `ListboxSelectedOption` to reduce boilerplate
- Match button width with `w-[--button-width]` for dropdown appearance
- Enable `transition` prop for smoother animations
- Use data attributes for simple state-based styling
- Use render props for complex conditional logic
- Consider `modal={false}` for inline/nested dropdowns
- Use `horizontal` orientation for tab-like selectors
- Implement custom virtualization for very long lists

### Integration Patterns

**With Tailwind CSS:**
```jsx
<Listbox value={selected} onChange={setSelected}>
  <ListboxButton className="group-data-open:ring-2">
    <ListboxSelectedOption placeholder="Select..." />
  </ListboxButton>
  <ListboxOptions className="data-closed:opacity-0 data-enter:opacity-100">
    {options.map((opt) => (
      <ListboxOption
        value={opt}
        className="data-focus:bg-blue-50 data-selected:bg-blue-100"
      >
        {opt.name}
      </ListboxOption>
    ))}
  </ListboxOptions>
</Listbox>
```

**With Framer Motion:**
```jsx
import { AnimatePresence, motion } from 'framer-motion'

<Listbox value={selected} onChange={setSelected}>
  {({ open }) => (
    <>
      <ListboxButton>{selected.name}</ListboxButton>
      <AnimatePresence>
        {open && (
          <ListboxOptions static as={motion.div} {...animations}>
            {/* options */}
          </ListboxOptions>
        )}
      </AnimatePresence>
    </>
  )}
</Listbox>
```

**With Form Libraries (React Hook Form):**
```jsx
import { Controller } from 'react-hook-form'

<Controller
  name="person"
  control={control}
  render={({ field }) => (
    <Listbox value={field.value} onChange={field.onChange}>
      <ListboxButton>
        <ListboxSelectedOption placeholder="Select person..." />
      </ListboxButton>
      <ListboxOptions>
        {people.map((person) => (
          <ListboxOption key={person.id} value={person}>
            {person.name}
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  )}
/>
```

**With Custom Virtualization:**
```jsx
import { useVirtualizer } from '@tanstack/react-virtual'

function VirtualizedListbox({ items, ...props }) {
  const parentRef = useRef()
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
  })

  return (
    <Listbox {...props}>
      <ListboxButton>{/* ... */}</ListboxButton>
      <ListboxOptions ref={parentRef} style={{ maxHeight: '300px', overflow: 'auto' }}>
        <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
          {virtualizer.getVirtualItems().map((virtualItem) => (
            <ListboxOption
              key={items[virtualItem.index].id}
              value={items[virtualItem.index]}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              {items[virtualItem.index].name}
            </ListboxOption>
          ))}
        </div>
      </ListboxOptions>
    </Listbox>
  )
}
```

### Performance Considerations
- Options unmount by default when closed (optimizes DOM size)
- Portal rendering prevents CSS overflow issues but adds React overhead
- Render props can cause re-renders if not used carefully
- Data attributes approach is more performant for simple state styling
- Large option lists benefit from custom virtualization
- Type-ahead search is efficient even with many options
- Consider `unmount={false}` for frequently toggled heavy content

### Version Notes
- This analysis is based on Headless UI v2.1 for React
- v2 introduced built-in anchor positioning (major improvement over v1)
- v2 added `ListboxSelectedOption` helper component
- v2 added transition data attributes for easier animations
- Earlier versions required external positioning libraries
- Future versions may add built-in virtualization or framework support

### Common Patterns and Recipes

**Searchable Listbox:**
```jsx
function SearchableListbox({ items, value, onChange }) {
  const [query, setQuery] = useState('')

  const filtered = items.filter(item =>
    item.name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <Listbox value={value} onChange={onChange}>
      <ListboxButton>{value?.name || 'Select...'}</ListboxButton>
      <ListboxOptions>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          className="w-full px-3 py-2 border-b"
        />
        {filtered.map((item) => (
          <ListboxOption key={item.id} value={item}>
            {item.name}
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  )
}
```

**Grouped Options:**
```jsx
<ListboxOptions>
  <div className="px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-100">
    Team Members
  </div>
  {teamMembers.map((member) => (
    <ListboxOption key={member.id} value={member}>
      {member.name}
    </ListboxOption>
  ))}

  <div className="px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-100">
    External Users
  </div>
  {externalUsers.map((user) => (
    <ListboxOption key={user.id} value={user}>
      {user.name}
    </ListboxOption>
  ))}
</ListboxOptions>
```

**Multi-Select with Tags:**
```jsx
function TaggedMultiSelect({ items, value, onChange }) {
  const removeItem = (item) => {
    onChange(value.filter(v => v.id !== item.id))
  }

  return (
    <Listbox value={value} onChange={onChange} multiple>
      <div className="flex flex-wrap gap-2 p-2 border rounded">
        {value.map((item) => (
          <span key={item.id} className="flex items-center gap-1 px-2 py-1 bg-blue-100 rounded">
            {item.name}
            <button type="button" onClick={() => removeItem(item)}>×</button>
          </span>
        ))}
        <ListboxButton className="flex-1 min-w-[100px] text-left">
          Add...
        </ListboxButton>
      </div>
      <ListboxOptions>
        {items.map((item) => (
          <ListboxOption key={item.id} value={item}>
            {item.name}
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  )
}
```
