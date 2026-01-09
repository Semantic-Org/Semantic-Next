# Mantine - Autocomplete Usage Patterns

## Component URL
https://mantine.dev/core/autocomplete/
Status: ✅ Working
Version: v8.3.7 (@mantine/core)
Last Verified: 2025-11-10

## Documentation Quality
Comprehensive - 20+ interactive demos covering basic usage, controlled state, filtering, custom rendering, grouping, disabled states, accessibility, and advanced Combobox integration with detailed explanations.

## Component Definition
- **Core purpose**: Provides freeform text input with suggested completions that users can select or ignore, allowing any value to be entered (not restricted to suggestions)
- **Mental model**: An enhanced text input that suggests relevant options as you type, but doesn't force selection from the list - users maintain full text entry freedom
- **Semantic meaning**: "I want to help you type faster with suggestions, but you're free to enter anything you want"

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `data={['React', 'Vue']}`)
- **Composed**: Via composition/children (e.g., `<Autocomplete>{content}</Autocomplete>`)
- **CSS-only**: Requires custom styling (e.g., `style={{ ... }}`)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text input | ✅ | Native | Standard input with `value`, `onChange`, `placeholder` props |
| Dropdown list | ✅ | Native | Dropdown with filtered options based on input |
| Filtering/search | ✅ | Native | Built-in filtering with customizable `filter` function, accepts `options`, `search`, and `limit` parameters |
| Multiple selection | ❌ | N/A | Explicitly not supported - use TagsInput or PillsInput instead |
| Custom option rendering | ✅ | Native | `renderOption` callback with access to option data for custom JSX |
| Creatable options | ✅ | Native | Inherent to design - accepts any freeform text input beyond suggestions |
| Grouping | ✅ | Native | `data` prop accepts `{ group: string, items: string[] }` format |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Single select | ✅ | Native | Controlled via `value` string and `onChange` callback |
| Multi select | ❌ | N/A | Not supported - use TagsInput or PillsInput components |
| Async/remote data | ❌ | CSS-only | No built-in async support, must manage externally and pass via `data` prop |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Loading | ❌ | CSS-only | No dedicated loading state - must be implemented externally |
| Disabled | ✅ | Native | `disabled` prop disables entire input |
| Error/Invalid | ✅ | Native | `error` prop for validation state (string or boolean) |
| Empty state | ❌ | N/A | No "nothing found" messaging by design - component allows freeform entry |
| No results | ❌ | N/A | Intentionally omitted - users can enter any text |
| Read-only | ✅ | Native | `readOnly` prop prevents editing while showing value |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅ | Native | `size` prop: xs, sm, md, lg, xl |
| Placeholder text | ✅ | Native | `placeholder` prop for input hint text |
| Clear button | ✅ | Native | `clearable` prop (hidden when empty, disabled, or read-only) |
| Icons | ✅ | Native | `leftSection` and `rightSection` props with width and pointer-events control |
| Virtualization | ❌ | N/A | Not supported, but `limit` prop restricts rendered options for performance |

## Code Examples
```tsx
// Basic usage - simple string array
import { Autocomplete } from '@mantine/core';

function Demo() {
  return (
    <Autocomplete
      label="Your favorite library"
      placeholder="Pick value or enter anything"
      data={['React', 'Angular', 'Vue', 'Svelte']}
    />
  );
}
```

```tsx
// Custom rendering with Avatar and complex data
import { Autocomplete, AutocompleteProps, Avatar, Group, Text } from '@mantine/core';

const usersData: Record<string, { image: string; email: string }> = {
  'Emily Johnson': {
    image: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-7.png',
    email: 'emily92@gmail.com',
  },
  'Ava Rodriguez': {
    image: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-8.png',
    email: 'ava_rose@gmail.com',
  },
};

const renderAutocompleteOption: AutocompleteProps['renderOption'] = ({ option }) => (
  <Group gap="sm">
    <Avatar src={usersData[option.value].image} size={36} radius="xl" />
    <div>
      <Text size="sm">{option.value}</Text>
      <Text size="xs" opacity={0.5}>
        {usersData[option.value].email}
      </Text>
    </div>
  </Group>
);

function Demo() {
  return (
    <Autocomplete
      data={['Emily Johnson', 'Ava Rodriguez']}
      renderOption={renderAutocompleteOption}
      maxDropdownHeight={300}
      label="Employee of the month"
      placeholder="Search for employee"
    />
  );
}
```

```tsx
// Grouped options
import { Autocomplete } from '@mantine/core';

function Demo() {
  return (
    <Autocomplete
      label="Your favorite library"
      placeholder="Pick value or enter anything"
      data={[
        { group: 'Frontend', items: ['React', 'Angular'] },
        { group: 'Backend', items: ['Express', 'Django'] },
      ]}
    />
  );
}
```

[View Live Examples](https://mantine.dev/core/autocomplete/)

## Notable Features
- **Freeform Entry Philosophy**: Explicitly designed to allow any text input, not just selections from the list - distinguishes it from stricter Select components
- **Performance Optimization**: `limit` prop restricts simultaneous rendered options for large datasets without full virtualization
- **Auto-Selection Behaviors**: `selectFirstOptionOnChange` and `autoSelectOnBlur` props provide smart UX defaults
- **Flexible Data Formats**: Accepts simple string arrays, grouped structures, or objects with value/label pairs
- **Advanced Dropdown Control**: `dropdownOpened`, `onDropdownOpen`, `onDropdownClose` for programmatic control
- **Combobox Integration**: Built on Mantine's Combobox component with `comboboxProps` passthrough for advanced customization (positioning, z-index, animations)
- **Scroll Area Options**: `withScrollArea` toggles between custom ScrollArea component and native scrollbars
- **Disabled Options**: Individual options support `disabled` property to prevent selection and keyboard navigation
- **Input Variants**: Supports Default, Filled, and Unstyled visual styles

## Research Notes
- Documentation is exceptionally thorough with excellent accessibility guidance (emphasizes `label` or `aria-label` requirements)
- Clear boundaries defined: component explicitly states what it does NOT support (multi-select, async loading, virtualization, "nothing found" states) and recommends alternatives
- Design philosophy strongly emphasizes freeform input over strict selection - this is a core differentiator
- No access issues encountered; page loaded immediately with full interactive examples
- TypeScript support appears robust with well-typed props including `AutocompleteProps` export for custom renderers
