# Mantine - Select Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://mantine.dev/core/select/
Status: ✅ Working
Version: v8.0+
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - Exceptional documentation with clear examples, thorough prop coverage, TypeScript support, extensive code samples demonstrating all major features, performance guidance, and accessibility best practices.

## Component Definition
- **Core purpose**: Provides an opinionated dropdown input component for capturing user selections from a predefined list of options, without allowing custom values
- **Mental model**: A controlled dropdown selector built on top of the Combobox primitive, optimized for single-value selection from a known dataset with optional search/filter capabilities
- **Semantic meaning**: Represents a selection control that restricts user input to a curated list of options, with visual feedback for the selected state and optional search filtering

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `searchable`, `clearable`, `data={[]}`)
- **Composed**: Via composition/children (e.g., custom dropdown content via renderOption)
- **CSS-only**: Requires custom styling (e.g., Styles API for granular control)
- **Via Combobox**: Advanced patterns require using Combobox component directly

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text options | ✅ | Native | String array data format: `['React', 'Angular', 'Vue']` |
| Value/Label pairs | ✅ | Native | Object array format: `[{ value: 'react', label: 'React' }]` |
| Grouped options | ✅ | Native | Nested group structure: `[{ group: 'Frontend', items: ['React', 'Angular'] }]` |
| Disabled options | ✅ | Native | `disabled: true` flag in option objects |
| Custom option rendering | ✅ | Native | `renderOption` callback with checked state and option data |
| Icons in options | ✅ | Composed | Via `renderOption` callback for custom content with icons |
| Nothing found message | ✅ | Native | `nothingFoundMessage` prop displays when no matches found |

## Data Format Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| String array | ✅ | Native | Simple format: `['React', 'Angular', 'Vue', 'Svelte']` |
| Object array | ✅ | Native | With value/label: `[{ value: 'react', label: 'React' }]` |
| Grouped strings | ✅ | Native | `[{ group: 'Frontend', items: ['React', 'Angular'] }]` |
| Grouped objects | ✅ | Native | `[{ group: 'Frontend', items: [{ value: 'react', label: 'React' }] }]` |
| Large datasets | ✅ | Native | `limit` prop for performance optimization (tested with 100,000 options) |

## Selection Behavior Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Controlled value | ✅ | Native | `value` and `onChange` props for controlled state |
| Uncontrolled value | ✅ | Native | `defaultValue` prop for uncontrolled state |
| Allow deselect | ✅ | Native | `allowDeselect` prop (default: true) - clicking selected option deselects it |
| Prevent deselect | ✅ | Native | `allowDeselect={false}` prevents deselection of selected option |
| Clearable | ✅ | Native | `clearable` prop adds clear button when value present and not disabled/read-only |
| Auto-select on blur | ✅ | Native | `autoSelectOnBlur` automatically selects highlighted option when input loses focus |
| onChange with option | ✅ | Native | `onChange` receives both string value and full option object: `onChange={(_value, option) => {}}` |

## Search & Filter Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Searchable | ✅ | Native | `searchable` prop enables filtering options by user input |
| Controlled search | ✅ | Native | `searchValue` and `onSearchChange` for controlled search state |
| Custom filter function | ✅ | Native | `filter` prop accepts custom filter logic: `filter={(options, search) => {}}` |
| Sort filtered results | ✅ | Native | Via custom filter function that sorts results |
| Multi-word search | ✅ | Composed | Via custom filter function (example shows split word matching) |
| Nothing found message | ✅ | Native | `nothingFoundMessage` displays when search returns no results |

## Display & Visual Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Check icon | ✅ | Native | `withCheckIcon` toggles visibility (default: true), `checkIconPosition` controls placement ("left" or "right") |
| Left section | ✅ | Native | `leftSection` prop for icons/content on left side, `leftSectionPointerEvents` controls interaction |
| Right section | ✅ | Native | `rightSection` prop for icons/content on right side, `rightSectionPointerEvents` controls interaction |
| Custom option render | ✅ | Native | `renderOption` callback: `({ option, checked }) => ReactNode` |
| Label | ✅ | Native | `label` prop for input label |
| Description | ✅ | Native | `description` prop for helper text below input |
| Placeholder | ✅ | Native | `placeholder` prop for empty state text |
| Error state | ✅ | Native | `error` prop accepts boolean or string for error message |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Disabled | ✅ | Native | `disabled` prop disables entire component |
| Read-only | ✅ | Native | `readOnly` prop prevents interaction but allows focus |
| Loading | ❌ | Via Combobox | Select doesn't have native loading prop, requires Combobox component |
| Required | ✅ | Native | `required` prop adds required indicator and validation |

## Dropdown Behavior Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Controlled open state | ✅ | Native | `dropdownOpened` prop controls dropdown visibility programmatically |
| Scrollable options | ✅ | Native | `maxDropdownHeight` sets max height with scroll, `withScrollArea` toggles scroll implementation |
| Native scroll | ✅ | Native | `withScrollArea={false}` uses native browser scroll instead of Mantine's ScrollArea |
| Portal rendering | ✅ | Native | `comboboxProps={{ withinPortal: true }}` (default) renders dropdown in portal |
| No portal | ✅ | Native | `comboboxProps={{ withinPortal: false }}` for rendering in DOM hierarchy |
| Custom z-index | ✅ | Native | `comboboxProps={{ zIndex: 1000 }}` controls stacking context |
| Position control | ✅ | Native | `comboboxProps={{ position: 'top' }}` controls dropdown placement |
| Disable flip | ✅ | Native | `comboboxProps={{ middlewares: { flip: false } }}` prevents auto-flipping |
| Disable shift | ✅ | Native | `comboboxProps={{ middlewares: { shift: false } }}` prevents horizontal shifting |
| Custom offset | ✅ | Native | `comboboxProps={{ offset: 0 }}` controls dropdown distance from input |
| Custom width | ✅ | Native | `comboboxProps={{ width: 200 }}` sets fixed dropdown width |
| Dropdown padding | ✅ | Native | `comboboxProps={{ dropdownPadding: 10 }}` controls internal padding |
| Dropdown shadow | ✅ | Native | `comboboxProps={{ shadow: 'md' }}` adds shadow to dropdown |
| Dropdown animation | ✅ | Native | `comboboxProps={{ transitionProps: { transition: 'pop', duration: 200 } }}` |

## Performance Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Limit rendered options | ✅ | Native | `limit` prop restricts simultaneously rendered options (essential for large datasets) |
| Large datasets | ✅ | Native | Tested with 100,000 options using `limit` prop |
| Virtualization | ❌ | Via Combobox | Select doesn't have built-in virtualization, requires Combobox component |

## Accessibility Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Label requirement | ✅ | Native | Requires either `label` prop or `aria-label` for screen readers |
| Clear button label | ✅ | Native | `clearButtonProps={{ 'aria-label': 'Clear input' }}` for clearable selects |
| Keyboard navigation | ✅ | Native | Built-in keyboard navigation support |
| Focus management | ✅ | Native | Proper focus handling with ref support |
| Error announcement | ✅ | Native | Error messages properly associated with input |

## Integration Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Inside Popover | ✅ | Native | Works with `comboboxProps={{ withinPortal: false }}` |
| With other overlays | ✅ | Native | Z-index and portal control for stacking contexts |
| Ref support | ✅ | Native | `ref` prop for accessing underlying input element: `ref={useRef<HTMLInputElement>(null)}` |

## Code Examples

### Basic Usage
```jsx
import { Select } from '@mantine/core';

function Demo() {
  return (
    <Select
      label="Your favorite library"
      placeholder="Pick value"
      data={['React', 'Angular', 'Vue', 'Svelte']}
    />
  );
}
```

### Controlled Component
```jsx
import { useState } from 'react';
import { Select } from '@mantine/core';

function Demo() {
  const [value, setValue] = useState<string | null>('');
  return <Select data={[]} value={value} onChange={setValue} />;
}
```

### onChange Handler with Option Object
```jsx
import { useState } from 'react';
import { ComboboxItem, Select } from '@mantine/core';

function Demo() {
  const [value, setValue] = useState<ComboboxItem | null>(null);
  return (
    <Select
      data={[{ value: 'react', label: 'React library' }]}
      value={value ? value.value : null}
      onChange={(_value, option) => setValue(option)}
    />
  );
}
```

### Value/Label Format
```jsx
import { Select } from '@mantine/core';

function Demo() {
  return (
    <Select
      label="Your favorite library"
      placeholder="Pick value"
      data={[
        { value: 'react', label: 'React' },
        { value: 'ng', label: 'Angular' },
        { value: 'vue', label: 'Vue' },
        { value: 'svelte', label: 'Svelte' },
      ]}
    />
  );
}
```

### Searchable with Auto-Select on Blur
```jsx
import { Select } from '@mantine/core';

function Demo() {
  return (
    <Select
      label="Your favorite library"
      placeholder="Pick value"
      autoSelectOnBlur
      searchable
      data={['React', 'Angular', 'Vue', 'Svelte']}
    />
  );
}
```

### Clearable Select
```jsx
import { Select } from '@mantine/core';

function Demo() {
  return (
    <Select
      label="Your favorite library"
      placeholder="Pick value"
      data={['React', 'Angular', 'Vue', 'Svelte']}
      defaultValue="React"
      clearable
    />
  );
}
```

### Allow/Prevent Deselect
```jsx
import { Select } from '@mantine/core';

function Demo() {
  return (
    <>
      <Select
        label="Option can NOT be deselected"
        placeholder="Pick value"
        data={['React', 'Angular', 'Vue', 'Svelte']}
        defaultValue="React"
        allowDeselect={false}
      />

      <Select
        label="Option can be deselected"
        description="This is default behavior, click 'React' in the dropdown"
        placeholder="Pick value"
        data={['React', 'Angular', 'Vue', 'Svelte']}
        defaultValue="React"
        allowDeselect
        mt="md"
      />
    </>
  );
}
```

### Controlled Search Value
```jsx
import { useState } from 'react';
import { Select } from '@mantine/core';

function Demo() {
  const [searchValue, setSearchValue] = useState('');
  return (
    <Select
      searchable
      searchValue={searchValue}
      onSearchChange={setSearchValue}
      data={['React', 'Angular', 'Vue', 'Svelte']}
    />
  );
}
```

### Nothing Found Message
```jsx
import { Select } from '@mantine/core';

function Demo() {
  return (
    <Select
      label="Your favorite library"
      placeholder="Pick value"
      data={['React', 'Angular', 'Vue', 'Svelte']}
      searchable
      nothingFoundMessage="Nothing found..."
    />
  );
}
```

### Check Icon Position
```jsx
import { Select } from '@mantine/core';

function Demo() {
  return (
    <Select
      checkIconPosition="left"
      data={['React', 'Angular', 'Svelte', 'Vue']}
      dropdownOpened
      pb={150}
      label="Control check icon"
      placeholder="Pick value"
      defaultValue="React"
    />
  );
}
```

### Custom Filter Function
```jsx
import { Select, ComboboxItem, OptionsFilter } from '@mantine/core';

const optionsFilter: OptionsFilter = ({ options, search }) => {
  const splittedSearch = search.toLowerCase().trim().split(' ');
  return (options as ComboboxItem[]).filter((option) => {
    const words = option.label.toLowerCase().trim().split(' ');
    return splittedSearch.every((searchWord) =>
      words.some((word) => word.includes(searchWord))
    );
  });
};

function Demo() {
  return (
    <Select
      label="Your country"
      placeholder="Pick value"
      data={['Great Britain', 'Russian Federation', 'United States']}
      filter={optionsFilter}
      searchable
    />
  );
}
```

### Sort Options with Custom Filter
```jsx
import { Select, ComboboxItem, OptionsFilter } from '@mantine/core';

const optionsFilter: OptionsFilter = ({ options, search }) => {
  const filtered = (options as ComboboxItem[]).filter((option) =>
    option.label.toLowerCase().trim().includes(search.toLowerCase().trim())
  );

  filtered.sort((a, b) => a.label.localeCompare(b.label));
  return filtered;
};

function Demo() {
  return (
    <Select
      label="Your favorite library"
      placeholder="Pick value"
      data={['4 – React', '1 – Angular', '3 – Vue', '2 – Svelte']}
      filter={optionsFilter}
      nothingFoundMessage="Nothing found..."
      searchable
    />
  );
}
```

### Large Data Sets (100,000 options)
```jsx
import { Select } from '@mantine/core';

const largeData = Array(100_000)
  .fill(0)
  .map((_, index) => `Option ${index}`);

function Demo() {
  return (
    <Select
      label="100 000 options autocomplete"
      placeholder="Use limit to optimize performance"
      limit={5}
      data={largeData}
      searchable
    />
  );
}
```

### renderOption Callback with Icons
```jsx
import {
  IconAlignCenter,
  IconAlignJustified,
  IconAlignLeft,
  IconAlignRight,
  IconCheck,
} from '@tabler/icons-react';
import { Group, Select, SelectProps } from '@mantine/core';

const iconProps = {
  stroke: 1.5,
  color: 'currentColor',
  opacity: 0.6,
  size: 18,
};

const icons: Record<string, React.ReactNode> = {
  left: <IconAlignLeft {...iconProps} />,
  center: <IconAlignCenter {...iconProps} />,
  right: <IconAlignRight {...iconProps} />,
  justify: <IconAlignJustified {...iconProps} />,
};

const renderSelectOption: SelectProps['renderOption'] = ({ option, checked }) => (
  <Group flex="1" gap="xs">
    {icons[option.value]}
    {option.label}
    {checked && <IconCheck style={{ marginInlineStart: 'auto' }} {...iconProps} />}
  </Group>
);

function Demo() {
  return (
    <Select
      label="Select with renderOption"
      placeholder="Select text align"
      data={[
        { value: 'left', label: 'Left' },
        { value: 'center', label: 'Center' },
        { value: 'right', label: 'Right' },
        { value: 'justify', label: 'Justify' },
      ]}
      renderOption={renderSelectOption}
    />
  );
}
```

### Scrollable Dropdown
```jsx
import { Select } from '@mantine/core';

const data = Array(100)
  .fill(0)
  .map((_, index) => `Option ${index}`);

function Demo() {
  return (
    <>
      <Select
        label="With scroll area (default)"
        placeholder="Pick value"
        data={data}
        maxDropdownHeight={200}
      />

      <Select
        label="With native scroll"
        placeholder="Pick value"
        data={data}
        withScrollArea={false}
        styles={{ dropdown: { maxHeight: 200, overflowY: 'auto' } }}
        mt="md"
      />
    </>
  );
}
```

### Group Options
```jsx
import { Select } from '@mantine/core';

function Demo() {
  return (
    <Select
      label="Your favorite library"
      placeholder="Pick value"
      data={[
        { group: 'Frontend', items: ['React', 'Angular'] },
        { group: 'Backend', items: ['Express', 'Django'] },
      ]}
    />
  );
}
```

### Disabled Options
```jsx
import { Select } from '@mantine/core';

function Demo() {
  return (
    <Select
      label="Your favorite library"
      placeholder="Pick value"
      data={[
        { value: 'react', label: 'React' },
        { value: 'ng', label: 'Angular' },
        { value: 'vue', label: 'Vue', disabled: true },
        { value: 'svelte', label: 'Svelte', disabled: true },
      ]}
    />
  );
}
```

### Control Dropdown Opened State
```jsx
import { Select, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

function Demo() {
  const [dropdownOpened, { toggle }] = useDisclosure();
  return (
    <>
      <Button onClick={toggle} mb="md">
        Toggle dropdown
      </Button>

      <Select
        label="Your favorite library"
        placeholder="Pick value"
        data={['React', 'Angular', 'Vue', 'Svelte']}
        dropdownOpened={dropdownOpened}
      />
    </>
  );
}
```

### Dropdown Position (Always Above)
```jsx
import { Select } from '@mantine/core';

function Demo() {
  return (
    <Select
      label="Your favorite library"
      placeholder="Pick value"
      data={['React', 'Angular', 'Vue', 'Svelte']}
      comboboxProps={{ position: 'top', middlewares: { flip: false, shift: false } }}
    />
  );
}
```

### Dropdown Width
```jsx
import { Select } from '@mantine/core';

function Demo() {
  return (
    <Select
      label="Your favorite library"
      placeholder="Pick value"
      data={['React', 'Angular', 'Vue', 'Svelte']}
      comboboxProps={{ width: 200, position: 'bottom-start' }}
    />
  );
}
```

### Dropdown Animation
```jsx
import { Select } from '@mantine/core';

function Demo() {
  return (
    <Select
      label="Your favorite library"
      placeholder="Pick value"
      data={['React', 'Angular', 'Vue', 'Svelte']}
      comboboxProps={{ transitionProps: { transition: 'pop', duration: 200 } }}
    />
  );
}
```

### Left and Right Sections
```jsx
import { Select } from '@mantine/core';
import { IconComponents } from '@tabler/icons-react';

function Demo() {
  const icon = <IconComponents size={16} />;
  return (
    <>
      <Select
        data={['React', 'Angular', 'Vue']}
        leftSectionPointerEvents="none"
        leftSection={icon}
        label="Your favorite library"
        placeholder="Your favorite library"
      />
      <Select
        mt="md"
        data={['React', 'Angular', 'Vue']}
        rightSectionPointerEvents="none"
        rightSection={icon}
        label="Your favorite library"
        placeholder="Your favorite library"
      />
    </>
  );
}
```

### With Input Props
```jsx
import { Select } from '@mantine/core';

function Demo() {
  return (
    <Select
      label="Input label"
      description="Input description"
      placeholder="Select placeholder"
      data={['React', 'Angular', 'Vue', 'Svelte']}
    />
  );
}
```

### Read Only
```jsx
import { Select } from '@mantine/core';

function Demo() {
  return (
    <Select
      label="Your favorite library"
      placeholder="Pick value"
      data={['React', 'Angular', 'Vue', 'Svelte']}
      readOnly
    />
  );
}
```

### Disabled
```jsx
import { Select } from '@mantine/core';

function Demo() {
  return (
    <Select
      label="Your favorite library"
      placeholder="Pick value"
      data={['React', 'Angular', 'Vue', 'Svelte']}
      disabled
    />
  );
}
```

### Error State
```jsx
import { Select } from '@mantine/core';

function Demo() {
  return (
    <>
      <Select
        label="Boolean error"
        placeholder="Boolean error"
        error
        data={['React', 'Angular', 'Vue', 'Svelte']}
      />
      <Select
        mt="md"
        label="With error message"
        placeholder="With error message"
        error="Invalid name"
        data={['React', 'Angular', 'Vue', 'Svelte']}
      />
    </>
  );
}
```

### Inside Popover
```jsx
import { Popover, Button, Select } from '@mantine/core';

function Demo() {
  return (
    <Popover width={300} position="bottom" withArrow shadow="md">
      <Popover.Target>
        <Button>Toggle popover</Button>
      </Popover.Target>
      <Popover.Dropdown>
        <Select
          label="Your favorite library"
          placeholder="Pick value"
          data={['React', 'Angular', 'Vue', 'Svelte']}
          comboboxProps={{ withinPortal: false }}
        />
      </Popover.Dropdown>
    </Popover>
  );
}
```

### Prevent Horizontal Scrolling
```jsx
import { Select } from '@mantine/core';

function Demo() {
  return (
    <Select
      data={['React', 'Angular', 'Vue']}
      comboboxProps={{
        middlewares: {
          shift: { padding: 0 }
        }
      }}
    />
  );
}
```

### Get Element Ref
```jsx
import { useRef } from 'react';
import { Select } from '@mantine/core';

function Demo() {
  const ref = useRef<HTMLInputElement>(null);
  return <Select ref={ref} data={['React', 'Angular', 'Vue']} />;
}
```

### Accessibility with Clear Button
```jsx
import { Select } from '@mantine/core';

function Demo() {
  return (
    <Select
      data={['React', 'Angular', 'Vue', 'Svelte']}
      clearable
      clearButtonProps={{
        'aria-label': 'Clear input',
      }}
    />
  );
}
```

## Notable Features

### Opinionated Combobox Wrapper
- Built on top of the more flexible Combobox component
- Provides curated, simplified API for common single-select use cases
- Does not allow custom value entry (unlike Autocomplete)
- Optimized for selecting from predefined options only

### Advanced Filter & Search System
- Custom filter function support via `filter` prop
- Receives `options` array and `search` string for custom logic
- Examples demonstrate multi-word search and custom sorting
- Enables sophisticated filtering beyond basic substring matching
- Filter function has full control over result ordering

### Comprehensive Data Format Support
- Accepts simple string arrays for basic use cases
- Supports value/label object pairs for different display/storage values
- Nested group structure for organized option display
- Disabled option flags at individual item level
- Seamlessly handles grouped strings or grouped objects

### Performance Optimization for Large Datasets
- `limit` prop restricts simultaneously rendered options
- Tested with 100,000 options demonstrating scalability
- Essential for maintaining smooth performance with massive lists
- Renders only visible subset while maintaining full searchability

### Rich Dropdown Control via comboboxProps
- Extensive positioning control (top, bottom, left, right combinations)
- Middleware configuration (flip, shift, size) for smart positioning
- Custom width, offset, padding, and shadow
- Z-index management for complex stacking contexts
- Portal vs in-DOM rendering control
- Transition animations with customizable duration and type

### Flexible Selection Behavior
- `allowDeselect` controls whether clicking selected option deselects
- `clearable` adds explicit clear button
- `autoSelectOnBlur` automatically commits highlighted option on blur
- Controlled and uncontrolled value management
- `onChange` provides both value string and full option object

### Advanced Option Rendering
- `renderOption` callback receives `option` and `checked` state
- Full control over option display including icons, badges, custom layouts
- Check icon position control (left/right)
- Option to hide check icon entirely via `withCheckIcon={false}`
- Custom content sections (left/right) with pointer event control

### Sophisticated Scroll Handling
- Default: Mantine ScrollArea component for consistent UX
- Native scroll option via `withScrollArea={false}`
- `maxDropdownHeight` for default scroll behavior
- Custom styles for native scroll implementation
- Handles large option lists gracefully

### Styles API System
- Granular control over internal elements
- Targets: wrapper, input, section, root, label, required, description, error, dropdown, options, option, empty, group, groupLabel
- Supports both className and inline styles
- Enables deep customization without losing component behavior

### Integration & Composition
- Works inside Popover and other overlay components
- Portal control for proper z-index stacking
- Ref support for programmatic control
- Compatible with form libraries
- Proper focus management and keyboard navigation

### Accessibility-First Design
- Requires `label` or `aria-label` for screen reader support
- `clearButtonProps` for accessible clear button
- Proper ARIA attributes on all interactive elements
- Keyboard navigation support built-in
- Error message association with input
- Focus management follows best practices

### TypeScript Excellence
- Full type definitions for all props
- `ComboboxItem` type for option objects
- `OptionsFilter` type for custom filter functions
- `SelectProps` for component customization
- IntelliSense-friendly API with detailed JSDoc

## Research Notes

- Documentation is exceptionally comprehensive with practical examples covering all major use cases
- The component represents Mantine's "opinionated" approach - simplified API built on flexible primitives
- Clear architectural boundary: Select for curated lists, Combobox for advanced patterns, Autocomplete for custom values
- Performance testing with 100,000 options demonstrates serious consideration for real-world scale
- Custom filter function pattern is elegant and powerful, allowing sophisticated search logic
- `comboboxProps` provides escape hatch for advanced positioning/behavior without bloating main API
- Dual scroll implementation (ScrollArea vs native) shows attention to different use case requirements
- `renderOption` callback with checked state enables sophisticated custom UIs while maintaining accessibility
- The `limit` prop is critical performance feature but well-documented as essential for large datasets
- Dropdown positioning system is comprehensive with flip/shift middleware control
- Integration patterns (Popover, z-index, portal) well-documented for complex layouts
- `autoSelectOnBlur` solves common UX pattern where users type and expect selection on tab
- `allowDeselect` flag addresses debate over whether selected options should be deselectable
- Clear distinction between read-only (focusable) and disabled (not focusable) states
- Both value string and full option object in `onChange` callback prevents need for lookups
- Package: @mantine/core (part of the Mantine UI library ecosystem)
- Version 8.0+ suggests recent major version with modern patterns
- All code examples are production-ready with proper TypeScript types
- Styles API coverage is thorough with every significant element accessible
- Accessibility requirements clearly documented with specific examples
- The component strikes excellent balance between simplicity and power
- Built on Combobox primitive but doesn't expose unnecessary complexity
- Documentation explicitly contrasts Select vs Combobox vs Autocomplete use cases
