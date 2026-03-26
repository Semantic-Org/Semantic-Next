# Mantine - Search/Combobox Usage Patterns

## Component URL
https://mantine.dev/core/combobox/
Status: ✅ Working

## Documentation Quality
Comprehensive - Extremely well-documented with extensive examples covering all usage patterns. The documentation emphasizes that Combobox is a foundational component providing full control over rendering and logic rather than a pre-built styled component.

## Component Definition
- **Core purpose**: A foundational component for building custom select, autocomplete, or multiselect inputs with complete control over rendering, state management, and behavior
- **Mental model**: A composable system built around a state management hook (useCombobox) and a collection of sub-components that work together to create flexible dropdown interfaces
- **Semantic meaning**: Provides the building blocks for all types of selection and search interfaces, from simple dropdowns to complex multi-select autocomplete systems

## Architecture Patterns

### Hook-Based State Management
| Pattern | Present | Details |
|---------|---------|---------|
| State hook | ✅ | `useCombobox()` hook manages all dropdown state and behavior - must be passed to `Combobox` component via `store` prop |
| Controlled state | ✅ | Supports `opened`, `onOpenedChange` for external state control |
| Uncontrolled state | ✅ | Supports `defaultOpened` for internal state management |
| Event listeners | ✅ | `onDropdownClose`, `onDropdownOpen` callbacks with event source tracking |

### Store API
| Method/Property | Purpose | Details |
|-----------------|---------|---------|
| `dropdownOpened` | State property | Current dropdown visibility state |
| `selectedOptionIndex` | State property | Index of currently selected option |
| `listId` | State property | Identifier for ARIA attributes |
| `searchRef` | State property | Reference to search input element |
| `targetRef` | State property | Reference to target element |
| `openDropdown()` | Navigation | Opens the dropdown |
| `closeDropdown()` | Navigation | Closes the dropdown |
| `toggleDropdown()` | Navigation | Toggles dropdown state |
| `selectOption(index)` | Selection | Selects option at specific index |
| `selectFirstOption()` | Selection | Selects first available option |
| `selectNextOption()` | Selection | Moves selection down |
| `selectPreviousOption()` | Selection | Moves selection up |
| `selectActiveOption()` | Selection | Selects first option marked as active |
| `resetSelectedOption()` | Selection | Clears current selection |
| `clickSelectedOption()` | Selection | Triggers click on selected option |
| `updateSelectedOptionIndex()` | Update | Updates index when options list changes |
| `focusSearchInput()` | Focus | Moves focus to search input |
| `focusTarget()` | Focus | Moves focus to target element |

## Component Composition Patterns

### Target Variants
| Pattern | Present | Details |
|---------|---------|---------|
| Standard target | ✅ | `Combobox.Target` - Adds ARIA attributes and keyboard listeners. Requires single child that accepts `ref` and spread props |
| Events target | ✅ | `Combobox.EventsTarget` - Only adds event handlers without positioning dropdown |
| Dropdown target | ✅ | `Combobox.DropdownTarget` - Only positions dropdown without event handling |
| Split functionality | ✅ | Use both `EventsTarget` and `DropdownTarget` together for split functionality (e.g., multiselect with PillsInput) |
| Works with Mantine components | ✅ | Compatible with Button, TextInput, InputBase, PillsInput |

### Dropdown Components
| Component | Purpose | Details |
|-----------|---------|---------|
| `Combobox.Dropdown` | Container | Wraps all dropdown content with positioning |
| `Combobox.Options` | Options container | Contains all Combobox.Option children |
| `Combobox.Option` | Individual option | Single selectable option with `value` prop |
| `Combobox.Group` | Option grouping | Groups related options with optional label |
| `Combobox.Search` | Search input | Input field inside dropdown for filtering |
| `Combobox.Empty` | Empty state | Message when no options match |
| `Combobox.Header` | Header content | Content at top of dropdown |
| `Combobox.Footer` | Footer content | Content at bottom of dropdown |
| `Combobox.Chevron` | Visual indicator | Dropdown chevron icon for target button |

## Use Case Patterns

### Simple Selection
| Pattern | Present | Details |
|---------|---------|---------|
| Pick from list | ✅ | Button-based target with static list of options |
| Close on select | ✅ | Dropdown closes automatically after selection via `combobox.closeDropdown()` |
| Display selected | ✅ | Selected value shown in target button/input |
| Reset on close | ✅ | `onDropdownClose: () => combobox.resetSelectedOption()` |

**Code Example - Pick Value:**
```typescript
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

### Searchable/Autocomplete
| Pattern | Present | Details |
|---------|---------|---------|
| Search input | ✅ | TextInput as target with value/onChange handlers |
| Filter on type | ✅ | Options filtered based on search value |
| Open on focus | ✅ | `onFocus={() => combobox.openDropdown()}` |
| Open on click | ✅ | `onClick={() => combobox.openDropdown()}` |
| Close on blur | ✅ | `onBlur={() => combobox.closeDropdown()}` |
| Update selection index | ✅ | Call `combobox.updateSelectedOptionIndex()` when filtering options |
| Empty state | ✅ | `<Combobox.Empty>Nothing found</Combobox.Empty>` when no matches |
| Allow custom values | ✅ | Input value can differ from available options |

**Code Example - Searchable Input:**
```typescript
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

### Multi-Select
| Pattern | Present | Details |
|---------|---------|---------|
| Multiple values | ✅ | Array state holding selected values |
| Pills/tags display | ✅ | Uses `PillsInput` and `Pill` components |
| Add/remove values | ✅ | Toggle value in array on selection |
| Visual checkmarks | ✅ | `CheckIcon` shown for selected items |
| Active state tracking | ✅ | `active={value.includes(item)}` on options |
| Backspace removal | ✅ | Keyboard handling to remove last pill |
| Split targets | ✅ | Uses both `DropdownTarget` and `EventsTarget` |
| Search in multiselect | ✅ | Search field filters available options |

**Code Example - Multiselect:**
```typescript
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

### Search Inside Dropdown
| Pattern | Present | Details |
|---------|---------|---------|
| Button trigger | ✅ | Button as target instead of input |
| Search in dropdown | ✅ | `Combobox.Search` component inside dropdown |
| Auto-focus search | ✅ | `onDropdownOpen: () => combobox.focusSearchInput()` |
| Clear search on close | ✅ | Reset search value in `onDropdownClose` |
| Focus target on close | ✅ | `combobox.focusTarget()` returns focus to trigger |
| Disable auto-ARIA | ✅ | `withAriaAttributes={false}` on Target when not using input |

**Code Example - Search Inside Dropdown:**
```typescript
import { useState } from 'react';
import { Button, Combobox, useCombobox, Text, Box } from '@mantine/core';

const groceries = ['🍎 Apples', '🍌 Bananas', '🥦 Broccoli', '🥕 Carrots', '🍫 Chocolate'];

function Demo() {
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const combobox = useCombobox({
    onDropdownClose: () => {
      combobox.resetSelectedOption();
      combobox.focusTarget();
      setSearch('');
    },
    onDropdownOpen: () => {
      combobox.focusSearchInput();
    },
  });

  const options = groceries
    .filter((item) => item.toLowerCase().includes(search.toLowerCase().trim()))
    .map((item) => (
      <Combobox.Option value={item} key={item}>
        {item}
      </Combobox.Option>
    ));

  return (
    <>
      <Box mb="xs">
        <Text span size="sm" c="dimmed">
          Selected item:{' '}
        </Text>
        <Text span size="sm">
          {selectedItem || 'Nothing selected'}
        </Text>
      </Box>

      <Combobox
        store={combobox}
        width={250}
        position="bottom-start"
        withArrow
        onOptionSubmit={(val) => {
          setSelectedItem(val);
          combobox.closeDropdown();
        }}
      >
        <Combobox.Target withAriaAttributes={false}>
          <Button onClick={() => combobox.toggleDropdown()}>Pick item</Button>
        </Combobox.Target>

        <Combobox.Dropdown>
          <Combobox.Search
            value={search}
            onChange={(event) => setSearch(event.currentTarget.value)}
            placeholder="Search groceries"
          />
          <Combobox.Options>
            {options.length > 0 ? options : <Combobox.Empty>Nothing found</Combobox.Empty>}
          </Combobox.Options>
        </Combobox.Dropdown>
      </Combobox>
    </>
  );
}
```

## Advanced Patterns

### Scrollable Lists
| Pattern | Present | Details |
|---------|---------|---------|
| Max height | ✅ | Set `mah` (max-height) style prop with `overflow: auto` |
| ScrollArea component | ✅ | Use `ScrollArea.Autosize` for custom scrollbars |
| Keyboard scrolling | ✅ | Automatically scrolls to keep selected option visible |

**Code Example - Scrollable List:**
```typescript
import { useState } from 'react';
import { Input, InputBase, Combobox, useCombobox, ScrollArea } from '@mantine/core';

function Demo() {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const [value, setValue] = useState<string | null>(null);

  // Large list of options
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
        <Combobox.Options>
          <ScrollArea.Autosize type="scroll" mah={200}>
            {options}
          </ScrollArea.Autosize>
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
```

### Option Groups
| Pattern | Present | Details |
|---------|---------|---------|
| Group component | ✅ | `Combobox.Group` with `label` prop |
| Nested options | ✅ | `Combobox.Option` children inside groups |
| Auto-hide empty groups | ✅ | Groups automatically hidden if no visible children |

**Code Example - Option Groups:**
```typescript
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

### Active Option Tracking
| Pattern | Present | Details |
|---------|---------|---------|
| Active state | ✅ | `active` prop on `Combobox.Option` marks current selection |
| Select active on open | ✅ | `selectActiveOption()` in `onDropdownOpen` for keyboard navigation |
| Update to active | ✅ | `updateSelectedOptionIndex('active')` after selection |
| Visual indicators | ✅ | CheckIcon or other visual feedback for active state |
| Reset on hover | ✅ | `resetSelectionOnOptionHover` prop resets selection when hovering |

**Code Example - Active Option:**
```typescript
import { useState } from 'react';
import { Input, InputBase, Combobox, useCombobox, CheckIcon, Group } from '@mantine/core';

const groceries = ['🍎 Apples', '🍌 Bananas', '🥦 Broccoli', '🥕 Carrots', '🍫 Chocolate'];

function Demo() {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: (eventSource) => {
      if (eventSource === 'keyboard') {
        combobox.selectActiveOption();
      } else {
        combobox.updateSelectedOptionIndex('active');
      }
    },
  });

  const [value, setValue] = useState<string | null>('🥦 Broccoli');

  const options = groceries.map((item) => (
    <Combobox.Option value={item} key={item} active={item === value}>
      <Group gap="xs">
        {item === value && <CheckIcon size={12} />}
        <span>{item}</span>
      </Group>
    </Combobox.Option>
  ));

  return (
    <Combobox
      store={combobox}
      resetSelectionOnOptionHover
      onOptionSubmit={(val) => {
        setValue(val);
        combobox.updateSelectedOptionIndex('active');
      }}
    >
      <Combobox.Target targetType="button">
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

### Without Dropdown
| Pattern | Present | Details |
|---------|---------|---------|
| Inline options | ✅ | Options rendered inline without dropdown wrapper |
| Events-only target | ✅ | Use `Combobox.EventsTarget` for input without positioning |
| No popover | ✅ | Combobox works without `Combobox.Dropdown` component |

**Code Example - No Dropdown:**
```typescript
import { useState } from 'react';
import { Combobox, TextInput } from '@mantine/core';

function Demo() {
  const [value, setValue] = useState('');

  return (
    <Combobox onOptionSubmit={setValue}>
      <Combobox.EventsTarget>
        <TextInput
          placeholder="Pick value"
          value={value}
          onChange={(event) => setValue(event.currentTarget.value)}
        />
      </Combobox.EventsTarget>

      <Combobox.Options mt="sm">
        <Combobox.Option value="First">First</Combobox.Option>
        <Combobox.Option value="Second">Second</Combobox.Option>
        <Combobox.Option value="Third">Third</Combobox.Option>
      </Combobox.Options>
    </Combobox>
  );
}
```

### Controlled State
| Pattern | Present | Details |
|---------|---------|---------|
| External control | ✅ | Pass `opened` state to `useCombobox({ opened })` |
| State change callback | ✅ | `onOpenedChange` callback for state synchronization |
| Manual toggling | ✅ | Control dropdown from external buttons/logic |

**Code Example - Controlled State:**
```typescript
import { useState } from 'react';
import { TextInput, Button, Combobox, useCombobox } from '@mantine/core';

const groceries = ['🍎 Apples', '🍌 Bananas', '🥦 Broccoli', '🥕 Carrots', '🍫 Chocolate'];

function Demo() {
  const [opened, setOpened] = useState(false);
  const combobox = useCombobox({ opened });

  const options = groceries.map((item) => (
    <Combobox.Option value={item} key={item}>
      {item}
    </Combobox.Option>
  ));

  return (
    <>
      <Button mb="md" onClick={() => setOpened((o) => !o)}>
        Toggle dropdown
      </Button>

      <Combobox store={combobox}>
        <Combobox.Target>
          <TextInput
            label="Autocomplete"
            description="Dropdown is opened/closed when button is clicked"
            placeholder="Click button to toggle dropdown"
          />
        </Combobox.Target>

        <Combobox.Dropdown>
          <Combobox.Options>{options}</Combobox.Options>
        </Combobox.Dropdown>
      </Combobox>
    </>
  );
}
```

## Configuration Options

### useCombobox Hook Options
| Option | Type | Default | Purpose |
|--------|------|---------|---------|
| `defaultOpened` | boolean | false | Initial dropdown state (uncontrolled) |
| `opened` | boolean | undefined | Controlled dropdown state |
| `onOpenedChange` | function | undefined | Callback for state changes |
| `onDropdownClose` | function | undefined | Called when dropdown closes |
| `onDropdownOpen` | function | undefined | Called when dropdown opens (with event source) |
| `loop` | boolean | true | Whether arrow key navigation loops |
| `scrollBehavior` | string | 'instant' | Scroll behavior for focused items |

### Combobox Component Props
| Prop | Type | Purpose |
|------|------|---------|
| `store` | ComboboxStore | Required - Store from useCombobox |
| `onOptionSubmit` | function | Callback when option selected |
| `resetSelectionOnOptionHover` | boolean | Reset selection on mouse hover |
| `width` | number/string | Dropdown width |
| `position` | string | Popover position (e.g., 'bottom-start') |
| `withArrow` | boolean | Show arrow on dropdown |
| `middlewares` | object | Popover positioning middlewares |
| `hidden` | boolean | Conditionally hide dropdown |

### Combobox.Target Props
| Prop | Type | Default | Purpose |
|------|------|---------|---------|
| `targetType` | string | 'input' | Type of target element |
| `withAriaAttributes` | boolean | true | Add ARIA attributes |

## State Management Patterns

### Selection State Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Single value | ✅ | `useState<string \| null>()` for single selection |
| Multiple values | ✅ | `useState<string[]>()` for multi-select |
| Search value | ✅ | Separate state for search/filter input |
| Selected index | ✅ | Managed internally by useCombobox store |

### Event Source Tracking
| Pattern | Present | Details |
|---------|---------|---------|
| Source detection | ✅ | `onDropdownOpen` receives event source ('keyboard' or 'mouse') |
| Different behaviors | ✅ | Can execute different logic based on how dropdown was opened |

## Accessibility Features

| Feature | Present | Details |
|---------|---------|---------|
| ARIA attributes | ✅ | Automatic ARIA attributes on target and options |
| Keyboard navigation | ✅ | Arrow keys navigate options (with optional looping) |
| Enter to select | ✅ | Enter key selects focused option |
| Escape to close | ✅ | Escape closes dropdown |
| Focus management | ✅ | API methods for programmatic focus control |
| Screen reader support | ✅ | Proper ARIA labels and relationships |
| Option IDs | ✅ | Automatic listId generation for ARIA linking |

## Positioning & Layout

### Dropdown Positioning
| Pattern | Present | Details |
|---------|---------|---------|
| Popover integration | ✅ | Supports all Popover positioning props |
| Position options | ✅ | `position` prop: 'bottom', 'top', 'bottom-start', 'top-end', etc. |
| Middlewares | ✅ | Custom positioning middleware support |
| Arrow indicator | ✅ | `withArrow` prop adds arrow to dropdown |
| Width control | ✅ | `width` prop controls dropdown width |

## Styles API

### Available Selectors
| Selector | Element | Purpose |
|----------|---------|---------|
| `options` | Container | Wrapper for all options |
| `dropdown` | Container | Dropdown wrapper |
| `option` | Element | Individual option |
| `search` | Input | Search input field |
| `empty` | Container | Empty state message |
| `header` | Container | Dropdown header |
| `footer` | Container | Dropdown footer |
| `group` | Container | Option group |
| `groupLabel` | Text | Group label text |

## Related Components

| Component | Purpose | Relationship |
|-----------|---------|--------------|
| Autocomplete | Pre-built searchable select | Built on Combobox |
| Select | Pre-built single-value select | Built on Combobox |
| MultiSelect | Pre-built multi-value select | Built on Combobox |
| TagsInput | Tag input with dropdown | Built on Combobox |
| PillsInput | Pill-based input | Used with Combobox for multiselect |
| ScrollArea | Custom scrollbar | Used for scrollable options |

## Notable Features

### Compositional Architecture
- **Complete control**: Combobox is a foundational primitive, not a pre-styled component
- **Flexible composition**: Mix and match sub-components to build custom interfaces
- **Split functionality**: Separate EventsTarget and DropdownTarget for complex layouts
- **Works with any input**: Compatible with all Mantine input components

### State Management Excellence
- **Comprehensive hook API**: useCombobox provides complete control over all aspects of state
- **Event source tracking**: Different behavior based on keyboard vs mouse interaction
- **Focus management**: Programmatic control over focus between target and search input
- **Selection tracking**: Separate concepts of "selected" vs "active" options

### Advanced Features
- **Dynamic filtering**: Built-in support for updating options based on search
- **Keyboard navigation**: Full arrow key navigation with optional looping
- **Scrolling integration**: Automatic scroll-to-selected with customizable behavior
- **Group management**: Automatic hiding of empty groups after filtering
- **Custom empty states**: Dedicated component for "no results" messaging

### Accessibility First
- **Automatic ARIA**: Built-in ARIA attributes and relationships
- **Full keyboard support**: Complete keyboard navigation and control
- **Screen reader friendly**: Proper semantic structure and announcements

## Implementation Patterns Summary

### Core Pattern
1. Create combobox store with `useCombobox()`
2. Pass store to `Combobox` component via `store` prop
3. Implement `onOptionSubmit` handler
4. Compose Target + Dropdown + Options structure

### Search/Filter Pattern
1. Maintain search state separately from selection
2. Filter options array based on search value
3. Call `updateSelectedOptionIndex()` when options change
4. Show `Combobox.Empty` when no matches

### Multi-Select Pattern
1. Use array state for selected values
2. Toggle values in array on selection
3. Use `PillsInput` with `Pill` components for display
4. Split targets with `EventsTarget` and `DropdownTarget`
5. Mark options as `active` based on inclusion in array

### Focus Management Pattern
1. Use `focusSearchInput()` on dropdown open
2. Use `focusTarget()` on dropdown close
3. Reset selected option on close for clean navigation state

## Research Notes

- **Foundational Design**: Unlike many libraries, Mantine's Combobox is explicitly designed as a primitive building block rather than a ready-to-use component. This gives maximum flexibility but requires more setup.

- **Excellent State Management**: The useCombobox hook provides exceptional control with clear separation between dropdown state, selection state, and focus state.

- **Event Source Awareness**: The ability to detect whether dropdown was opened via keyboard or mouse allows for optimized UX (e.g., pre-selecting active option for keyboard users).

- **Split Target Pattern**: The EventsTarget/DropdownTarget split is elegant for complex cases like multiselect where you need different positioning behavior.

- **Active vs Selected**: The distinction between "active" (currently highlighted) and "selected" (current value) is well-designed for keyboard navigation.

- **Pre-built Alternatives**: Mantine provides Autocomplete, Select, and MultiSelect components built on Combobox for users who want ready-made solutions.

- **Comprehensive Examples**: Documentation includes 10+ complete examples covering all major use cases, making it easy to understand implementation patterns.

- **TypeScript First**: All examples use TypeScript with proper typing, showing best practices for type-safe implementations.

- **Integration Philosophy**: Designed to work seamlessly with other Mantine components (InputBase, PillsInput, ScrollArea, etc.).
