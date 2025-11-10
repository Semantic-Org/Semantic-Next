# Ant Design - AutoComplete Usage Patterns

## Component URL
https://ant.design/components/auto-complete and https://4x.ant.design/components/auto-complete
Status: ✅ Working
Version: 4.24.16 (v4), Current v5 also available
Last Verified: 2025-11-10

## Documentation Quality
Comprehensive - Excellent code examples, complete API reference, clear use cases, migration guides, and FAQ section.

## Component Definition
- **Core purpose**: Provides intelligent text input with dropdown suggestions to help users quickly find and select from options while typing, reducing cognitive load and input errors.
- **Mental model**: An enhanced input field that assists typing rather than forcing selection. Users maintain freedom to type anything, with helpful suggestions appearing based on input.
- **Semantic meaning**: Represents "input with hints" - a form element that aids completion rather than restricts choice. Fundamentally different from Select which enforces choosing from predefined options.

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `status="error"`)
- **Composed**: Via composition/children (e.g., `<AutoComplete><TextArea /></AutoComplete>`)
- **CSS-only**: Requires custom styling (e.g., custom option layouts)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text input | ✅ | Native + Composed | Default `<Input />` or custom input via children prop; supports TextArea, Input.Search |
| Dropdown list | ✅ | Native | Menu-based suggestions list with `options` prop; replaces v3 `dataSource` |
| Filtering/search | ✅ | Native | `onSearch` callback + `filterOption` prop for custom filtering logic; case-insensitive filtering supported |
| Multiple selection | ❌ | Not supported | Single selection only; use Select for multi-select |
| Custom option rendering | ✅ | Native | Options accept `label` with JSX for rich rendering (icons, counts, links) |
| Creatable options | ✅ | Native | Users can type freely; not restricted to suggestions |
| Grouping | ✅ | Native | Nested options structure with `label` and `options` array for categories |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Single select | ✅ | Native | Core functionality; `value` prop + `onChange`/`onSelect` callbacks |
| Multi select | ❌ | Not available | Use Select component instead |
| Async/remote data | ✅ | Native | Update `options` in `onSearch` callback; demonstrated in lookup examples |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Loading | ❌ | Not native | No dedicated loading prop; implement via custom options content |
| Disabled | ✅ | Native | `disabled` boolean prop |
| Error/Invalid | ✅ | Native | `status="error"` or `status="warning"` (v4.19.0+) |
| Empty state | ✅ | Native | `notFoundContent` prop for custom "no results" message (default: "Not Found") |
| No results | ✅ | Native | Automatically shown when `options` is empty; customizable via `notFoundContent` |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅ | Composed | Via child input: `<Input.Search size="large" />` |
| Placeholder text | ✅ | Native | `placeholder` prop on AutoComplete |
| Clear button | ✅ | Native | `allowClear` boolean prop (default: false), `onClear` callback (v4.6.0+) |
| Icons | ✅ | Composed | Via custom input component (e.g., `<Input.Search />`) or in option labels |
| Virtualization | ❌ | Not documented | Not explicitly mentioned; dropdown width control via `dropdownMatchSelectWidth` |

## Code Examples

### Basic Usage
```jsx
import { AutoComplete } from 'antd';
import React, { useState } from 'react';

const mockVal = (str: string, repeat = 1) => ({
  value: str.repeat(repeat),
});

const App: React.FC = () => {
  const [value, setValue] = useState('');
  const [options, setOptions] = useState<{ value: string }[]>([]);

  const onSearch = (searchText: string) => {
    setOptions(
      !searchText ? [] : [mockVal(searchText), mockVal(searchText, 2), mockVal(searchText, 3)],
    );
  };

  const onSelect = (data: string) => {
    console.log('onSelect', data);
  };

  return (
    <AutoComplete
      options={options}
      style={{ width: 200 }}
      onSelect={onSelect}
      onSearch={onSearch}
      placeholder="input here"
    />
  );
};
```

### Custom Input Component (TextArea)
```jsx
import { AutoComplete, Input } from 'antd';

const { TextArea } = Input;

const App: React.FC = () => {
  const [options, setOptions] = useState<{ value: string }[]>([]);

  const handleSearch = (value: string) => {
    setOptions(
      !value ? [] : [{ value }, { value: value + value }, { value: value + value + value }],
    );
  };

  return (
    <AutoComplete
      options={options}
      style={{ width: 200 }}
      onSearch={handleSearch}
    >
      <TextArea
        placeholder="input here"
        style={{ height: 50 }}
      />
    </AutoComplete>
  );
};
```

### Grouped Options with Custom Rendering
```jsx
import { UserOutlined } from '@ant-design/icons';
import { AutoComplete, Input } from 'antd';

const renderTitle = (title: string) => (
  <span>
    {title}
    <a style={{ float: 'right' }} href="https://example.com">more</a>
  </span>
);

const renderItem = (title: string, count: number) => ({
  value: title,
  label: (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      {title}
      <span><UserOutlined /> {count}</span>
    </div>
  ),
});

const options = [
  {
    label: renderTitle('Libraries'),
    options: [renderItem('AntDesign', 10000), renderItem('AntDesign UI', 10600)],
  },
  {
    label: renderTitle('Solutions'),
    options: [renderItem('AntDesign FAQ', 60100)],
  },
];

const App: React.FC = () => (
  <AutoComplete
    dropdownMatchSelectWidth={500}
    style={{ width: 250 }}
    options={options}
  >
    <Input.Search size="large" placeholder="input here" />
  </AutoComplete>
);
```

### Case-Insensitive Filtering
```jsx
import { AutoComplete } from 'antd';

const options = [
  { value: 'Burns Bay Road' },
  { value: 'Downing Street' },
  { value: 'Wall Street' },
];

const App: React.FC = () => (
  <AutoComplete
    style={{ width: 200 }}
    options={options}
    placeholder="try to type `b`"
    filterOption={(inputValue, option) =>
      option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
    }
  />
);
```

### Validation Status (v4.19.0+)
```jsx
import { AutoComplete, Space } from 'antd';

const App: React.FC = () => {
  const [options, setOptions] = useState([]);

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <AutoComplete
        options={options}
        status="error"
        style={{ width: 200 }}
      />
      <AutoComplete
        options={options}
        status="warning"
        style={{ width: 200 }}
      />
    </Space>
  );
};
```

[View Live Examples](https://ant.design/components/auto-complete#components-auto-complete-demo-basic)

## API Reference

### Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `allowClear` | boolean | false | Show clear button |
| `autoFocus` | boolean | false | Auto focus on mount |
| `backfill` | boolean | false | Backfill selected item when using keyboard |
| `children` | HTMLInputElement \| HTMLTextAreaElement \| React.ReactElement | `<Input />` | Custom input element |
| `defaultActiveFirstOption` | boolean | true | Activate first option by default |
| `defaultOpen` | boolean | - | Initial open state |
| `defaultValue` | string | - | Initial value |
| `disabled` | boolean | false | Disable component |
| `dropdownMatchSelectWidth` | boolean \| number | true | Match dropdown width to input |
| `filterOption` | boolean \| function(inputValue, option) | true | Custom filter logic |
| `notFoundContent` | string | "Not Found" | Content when no results |
| `open` | boolean | - | Controlled open state |
| `options` | { label, value }[] | - | Data source |
| `placeholder` | string | - | Placeholder text |
| `popupClassName` | string | - | Dropdown CSS class (v4.23.0+) |
| `status` | 'error' \| 'warning' | - | Validation status (v4.19.0+) |
| `value` | string | - | Controlled value |

### Events

| Event | Type | Description |
|-------|------|-------------|
| `onBlur` | function() | Fired on blur |
| `onChange` | function(value) | Value change (selection or typing) |
| `onClear` | function() | Clear button clicked (v4.6.0+) |
| `onDropdownVisibleChange` | function(open) | Dropdown visibility change |
| `onFocus` | function() | Fired on focus |
| `onSearch` | function(value) | Search input change |
| `onSelect` | function(value, option) | Option selected |

### Methods

| Method | Description |
|--------|-------------|
| `blur()` | Remove focus |
| `focus()` | Set focus |

## Notable Features

### Key Distinguishing Characteristics
1. **Free-form input philosophy**: Unlike Select, users can type anything - not restricted to predefined options
2. **Input-first design**: Built as an enhancement to Input, accepts any Input/TextArea as child
3. **Search-oriented**: Primary use case is aiding input rather than forcing selection

### Implementation Highlights
1. **Performance optimization**: `options` prop (array format) recommended over JSX children for better performance
2. **Flexible filtering**: `filterOption` accepts function for custom logic (e.g., case-insensitive, fuzzy matching)
3. **Rich option rendering**: `label` prop accepts JSX for complex layouts with icons, counts, links
4. **Grouped categories**: Nested options structure for organizing suggestions
5. **Input agnostic**: Works with Input, TextArea, Input.Search, or custom input components

### Advanced Patterns
1. **Email completion**: Dynamic suffix suggestions (e.g., @gmail.com, @qq.com)
2. **Search suggestions**: Categorized results with metadata (counts, links)
3. **Async data loading**: Update `options` in `onSearch` for remote data
4. **Backfill on keyboard nav**: `backfill` prop fills input while navigating with arrows

### Migration Notes (v3 → v4)
- `dataSource` replaced with `options`
- `labelInValue` and similar display props removed
- Format changed: `{ text: 'X', value: 'Y' }` → `{ label: 'X', value: 'Y' }`

## Research Notes

### Documentation Access
- Main docs accessible at https://ant.design/components/auto-complete
- Version-specific docs available (e.g., 4x.ant.design for v4)
- Initial WebFetch returned CSS only; successful fetch on second attempt with 4x URL

### Framework Approach
- **Clear use case differentiation**: Explicit guidance on when to use AutoComplete vs Select
- **Controlled/uncontrolled modes**: Supports both patterns (value/defaultValue)
- **Composition over configuration**: Flexibility through child components rather than dozens of props
- **Performance-conscious**: Explicit recommendation for `options` array over JSX for better performance
- **TypeScript-first**: All examples include TypeScript types

### Observations
1. **Strong semantic clarity**: Documentation emphasizes "input with hints" vs "selection" mental model
2. **Real-world examples**: Lookup patterns (certain/uncertain category) mirror common use cases
3. **Accessibility implied**: Built on Ant Design's menu system with ARIA support
4. **Progressive enhancement**: Status prop added in v4.19.0 without breaking changes
5. **Developer experience**: Detailed FAQ addresses common confusion (onChange vs onSearch, composition system behavior)
