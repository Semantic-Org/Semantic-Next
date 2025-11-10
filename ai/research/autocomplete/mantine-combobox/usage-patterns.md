# Mantine - Combobox Usage Patterns

## Component URL
https://mantine.dev/core/combobox/
Status: ✅ Working
Version: v8.3.7 (as of documentation)
Last Verified: 2025-11-10

## Documentation Quality
Comprehensive - Excellent documentation with multiple real-world examples, detailed API reference, and clear explanation of the component's headless architecture.

## Component Definition
- **Core purpose**: Provides a flexible, headless primitive for building custom select, autocomplete, and multiselect inputs with full control over rendering and behavior.
- **Mental model**: A composable system where developers wire up state management (via `useCombobox` hook) and compose UI from building blocks (Target, Dropdown, Options, etc.). The framework handles keyboard navigation, accessibility, and dropdown positioning, while developers control filtering, selection logic, and rendering.
- **Semantic meaning**: Represents an interactive input pattern where users can select from a list of options, optionally search/filter those options, and potentially select multiple values. It's a primitive for building autocomplete, select, and combo box patterns.

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `onOptionSubmit`, `store`)
- **Composed**: Via composition/children (e.g., `<Combobox.Option>`)
- **CSS-only**: Requires custom styling (e.g., custom option layouts)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text input | ✅ | Composed | Via TextInput, InputBase, or PillsInput.Field components wrapped in Combobox.Target or Combobox.EventsTarget |
| Dropdown list | ✅ | Native/Composed | Combobox.Dropdown container with Combobox.Options wrapper and Combobox.Option children |
| Filtering/search | ✅ | Composed | Manual implementation - developer controls input state, filters options array, calls `updateSelectedOptionIndex()` when list changes |
| Multiple selection | ✅ | Composed | Toggle logic in onOptionSubmit handler, manage array state, use PillsInput for display with removable pills |
| Custom option rendering | ✅ | Composed | Full control via composition - wrap any content in Combobox.Option, shown with CheckIcon in multi-select example |
| Creatable options | ✅ | Composed | Developer manually adds non-matching search value to options or handles submission of custom values |
| Grouping | ✅ | Native | Combobox.Group component with label prop, automatically hides empty groups |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Single select | ✅ | Native/Composed | Track single value in state, onOptionSubmit sets value and closes dropdown |
| Multi select | ✅ | Composed | Track array in state, toggle items in/out via onOptionSubmit, display as pills with remove buttons |
| Async/remote data | ✅ | Composed | No built-in async - developer loads data, updates options array, calls updateSelectedOptionIndex() |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Loading | ✅ | Composed | No dedicated prop - conditionally render loading UI in Combobox.Options or disable input |
| Disabled | ✅ | Composed | Pass disabled prop to wrapper input component (TextInput, InputBase, etc.) |
| Error/Invalid | ✅ | Composed | Pass error prop to wrapper input component for validation display |
| Empty state | ✅ | Native | Combobox.Empty component for "Nothing found" messaging when filtered options.length === 0 |
| No results | ✅ | Native | Same as empty state - Combobox.Empty used in conditional: `{options.length === 0 ? <Combobox.Empty>Nothing found</Combobox.Empty> : options}` |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅ | Composed | Inherited from wrapper components - TextInput, InputBase support size prop (xs, sm, md, lg, xl) |
| Placeholder text | ✅ | Composed | Set on wrapper input component (TextInput placeholder) or use Input.Placeholder component in button-based selects |
| Clear button | ✅ | Composed | Implement via state reset and UI - not built-in, add custom button or use input's rightSection |
| Icons | ✅ | Composed | Combobox.Chevron for dropdown indicator, wrapper components support leftSection/rightSection for icons |
| Virtualization | ⚠️ | CSS-only | Not demonstrated in docs - use ScrollArea with max-height for large lists, virtualization would require custom implementation |

## Code Examples

### Primary Usage Example: Basic Select
```tsx
import { useState } from 'react';
import { Input, InputBase, Combobox, useCombobox } from '@mantine/core';

const groceries = ['🍎 Apples', '🍌 Bananas', '🥦 Broccoli', '🥕 Carrots', '🍫 Chocolate'];

function Demo() {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const [value, setValue] = useState<string | null>(null);

  const options = groceries.map((item) => (
    <Combobox.Option value={item} key={item}>
      {item}
    </Combobox.Option>
  ));

  return (
    <Combobox
      store={combobox}
      onOptionSubmit={(val) => {
        setValue(val);
        combobox.closeDropdown();
      }}
    >
      <Combobox.Target>
        <InputBase
          component="button"
          type="button"
          pointer
          rightSection={<Combobox.Chevron />}
          rightSectionPointerEvents="none"
          onClick={() => combobox.toggleDropdown()}
        >
          {value || <Input.Placeholder>Pick value</Input.Placeholder>}
        </InputBase>
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>{options}</Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
```

### Searchable Autocomplete Example
```tsx
import { useState } from 'react';
import { Combobox, TextInput, useCombobox } from '@mantine/core';

const groceries = ['🍎 Apples', '🍌 Bananas', '🥦 Broccoli', '🥕 Carrots', '🍫 Chocolate'];

function Demo() {
  const combobox = useCombobox();
  const [value, setValue] = useState('');
  const shouldFilterOptions = !groceries.some((item) => item === value);
  const filteredOptions = shouldFilterOptions
    ? groceries.filter((item) => item.toLowerCase().includes(value.toLowerCase().trim()))
    : groceries;

  const options = filteredOptions.map((item) => (
    <Combobox.Option value={item} key={item}>
      {item}
    </Combobox.Option>
  ));

  return (
    <Combobox
      onOptionSubmit={(optionValue) => {
        setValue(optionValue);
        combobox.closeDropdown();
      }}
      store={combobox}
    >
      <Combobox.Target>
        <TextInput
          label="Pick value or type anything"
          placeholder="Pick value or type anything"
          value={value}
          onChange={(event) => {
            setValue(event.currentTarget.value);
            combobox.openDropdown();
            combobox.updateSelectedOptionIndex();
          }}
          onClick={() => combobox.openDropdown()}
          onFocus={() => combobox.openDropdown()}
          onBlur={() => combobox.closeDropdown()}
        />
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>
          {options.length === 0 ? <Combobox.Empty>Nothing found</Combobox.Empty> : options}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
```

### Multi-Select Example
```tsx
import { useState } from 'react';
import { PillsInput, Pill, Combobox, CheckIcon, Group, useCombobox } from '@mantine/core';

const groceries = ['🍎 Apples', '🍌 Bananas', '🥦 Broccoli', '🥕 Carrots', '🍫 Chocolate'];

function Demo() {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex('active'),
  });

  const [search, setSearch] = useState('');
  const [value, setValue] = useState<string[]>([]);

  const handleValueSelect = (val: string) =>
    setValue((current) =>
      current.includes(val) ? current.filter((v) => v !== val) : [...current, val]
    );

  const handleValueRemove = (val: string) =>
    setValue((current) => current.filter((v) => v !== val));

  const values = value.map((item) => (
    <Pill key={item} withRemoveButton onRemove={() => handleValueRemove(item)}>
      {item}
    </Pill>
  ));

  const options = groceries
    .filter((item) => item.toLowerCase().includes(search.trim().toLowerCase()))
    .map((item) => (
      <Combobox.Option value={item} key={item} active={value.includes(item)}>
        <Group gap="sm">
          {value.includes(item) ? <CheckIcon size={12} /> : null}
          <span>{item}</span>
        </Group>
      </Combobox.Option>
    ));

  return (
    <Combobox store={combobox} onOptionSubmit={handleValueSelect}>
      <Combobox.DropdownTarget>
        <PillsInput onClick={() => combobox.openDropdown()}>
          <Pill.Group>
            {values}

            <Combobox.EventsTarget>
              <PillsInput.Field
                onFocus={() => combobox.openDropdown()}
                onBlur={() => combobox.closeDropdown()}
                value={search}
                placeholder="Search values"
                onChange={(event) => {
                  combobox.updateSelectedOptionIndex();
                  setSearch(event.currentTarget.value);
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Backspace' && search.length === 0 && value.length > 0) {
                    event.preventDefault();
                    handleValueRemove(value[value.length - 1]);
                  }
                }}
              />
            </Combobox.EventsTarget>
          </Pill.Group>
        </PillsInput>
      </Combobox.DropdownTarget>

      <Combobox.Dropdown>
        <Combobox.Options>
          {options.length > 0 ? options : <Combobox.Empty>Nothing found...</Combobox.Empty>}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
```

### Options Grouping Example
```tsx
import { useState } from 'react';
import { Input, InputBase, Combobox, useCombobox } from '@mantine/core';

function Demo() {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const [value, setValue] = useState<string | null>(null);

  return (
    <Combobox
      store={combobox}
      onOptionSubmit={(val) => {
        setValue(val);
        combobox.closeDropdown();
      }}
    >
      <Combobox.Target>
        <InputBase
          component="button"
          type="button"
          pointer
          rightSection={<Combobox.Chevron />}
          rightSectionPointerEvents="none"
          onClick={() => combobox.toggleDropdown()}
        >
          {value || <Input.Placeholder>Pick value</Input.Placeholder>}
        </InputBase>
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>
          <Combobox.Group label="Fruits">
            <Combobox.Option value="🍎 Apples">🍎 Apples</Combobox.Option>
            <Combobox.Option value="🍌 Bananas">🍌 Bananas</Combobox.Option>
            <Combobox.Option value="🍇 Grape">🍇 Grape</Combobox.Option>
          </Combobox.Group>

          <Combobox.Group label="Vegetables">
            <Combobox.Option value="🥦 Broccoli">🥦 Broccoli</Combobox.Option>
            <Combobox.Option value="🥕 Carrots">🥕 Carrots</Combobox.Option>
            <Combobox.Option value="🥬 Lettuce">🥬 Lettuce</Combobox.Option>
          </Combobox.Group>
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
```

[View Live Examples](https://mantine.dev/core/combobox/)

## Notable Features

### Headless Architecture
- **Full Control**: Mantine's Combobox is a headless component - it provides state management and accessibility but leaves all UI rendering to the developer
- **Hook-Based State**: `useCombobox` hook returns store object with methods like `openDropdown()`, `closeDropdown()`, `selectNextOption()`, etc.
- **Composable Components**: Building blocks (Target, Dropdown, Options, Option, Group, Empty, EventsTarget) compose to create any combobox variant

### State Management Hook (`useCombobox`)
**Store Methods:**
- Dropdown control: `openDropdown()`, `closeDropdown()`, `toggleDropdown()`
- Selection navigation: `selectOption()`, `selectFirstOption()`, `selectNextOption()`, `selectPreviousOption()`, `selectActiveOption()`
- Index management: `updateSelectedOptionIndex()` (critical when options change from filtering)
- Focus management: `focusSearchInput()`, `focusTarget()`
- State reset: `resetSelectedOption()`

**Configuration Options:**
- `onDropdownClose`, `onDropdownOpen` callbacks
- `defaultOpened` for initial state

### Keyboard Navigation
- Arrow keys navigate through options
- Enter/Space select active option
- Automatic looping through option list
- Backspace in multi-select removes last pill when search is empty
- Developer calls `updateSelectedOptionIndex()` after filtering to reset keyboard position

### Accessibility Features
- `data-combobox-active` attribute on active options for styling
- ARIA attributes automatically applied
- Keyboard navigation built-in
- Focus management helpers

### Flexible Target Patterns
- `Combobox.Target`: Standard wrapper for dropdown trigger
- `Combobox.DropdownTarget`: Alternative for complex layouts
- `Combobox.EventsTarget`: Separate event handling from dropdown trigger (used in multi-select for search field)

### Advanced Patterns Demonstrated
1. **Search inside dropdown**: Separate search field in dropdown vs. using target input
2. **Auto-select first option**: `onDropdownOpen: () => combobox.selectFirstOption()`
3. **Active option styling**: `active` prop adds `data-combobox-active` attribute
4. **Controlled dropdown**: Manage `opened` state externally
5. **Without dropdown**: Use only `EventsTarget` for keyboard navigation without overlay
6. **Mouse hover behavior**: `resetSelectionOnOptionHover` prop

### Positioning and Layout
- Inherits Popover props: `position`, `middlewares`, `width`
- `hidden` prop conditionally hides dropdown
- ScrollArea integration for large lists (max-height with native scrolling)
- Automatic empty group hiding with `Combobox.Group`

### Integration Patterns
- Works with TextInput for searchable autocomplete
- Works with InputBase for button-based selects
- Works with PillsInput for multi-select with pills
- Can use Input.Placeholder for unselected state display
- Integrates with Mantine's icon system via section props

## Research Notes

### Strengths
- Extremely well-documented with 10+ complete working examples
- Headless architecture provides maximum flexibility
- Clear separation of concerns between state management and UI
- Comprehensive keyboard navigation and accessibility
- Good TypeScript support with generic types for option values

### Implementation Approach
- **Philosophy**: Provide primitives, not opinions - developers compose their own UX
- **Trade-offs**: More boilerplate for basic cases, but unlimited customization
- **Manual wiring required**: Filtering, async loading, creatable options all require developer implementation
- **State updates**: Developer must call `updateSelectedOptionIndex()` when options array changes

### Comparison to Other Frameworks
- More low-level than traditional "select" components
- Similar approach to Radix UI's headless primitives
- Contrasts with higher-level components like React Select that provide more out-of-box features
- Requires understanding of state management patterns vs. prop-based configuration

### Documentation Observations
- Version clearly stated (v8.3.7)
- Multiple real-world patterns covered
- Code examples are production-ready, not just demos
- Good balance of simple and complex examples
- Clear explanation of when to use different sub-components
- No accessibility issues mentioned during research
