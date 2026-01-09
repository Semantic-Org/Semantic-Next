# Ant Design - Search/Autocomplete Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://ant.design/components/auto-complete
Status: ✅ Working
Version: 4.x (Current as of documentation)
Last Verified: 2025-11-05

## Documentation Quality
**Comprehensive** - The documentation provides detailed API reference, multiple code examples, clear prop descriptions, and practical usage patterns covering common scenarios. Includes examples for basic usage, controlled mode, custom inputs, filtering, grouping, and validation states.

## Component Definition
- **Core purpose**: Provides an input field with text suggestions to assist users while typing. Enables free-form text entry while offering contextual hints, unlike Select which enforces selection from fixed options.
- **Mental model**: "Input with helpful hints" - Users maintain full control over their input while the component suggests relevant completions based on what they type.
- **Semantic meaning**: An intelligent text input that anticipates user needs by offering suggestions without constraining their input freedom.

## Pattern Support Levels
- **Native**: Dedicated prop/API
- **Composed**: Via composition/children
- **CSS-only**: Requires custom styling

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text input | ✅ | Native | Default `<Input />` element, customizable via `children` prop |
| Suggestion list | ✅ | Native | Controlled via `options` prop accepting `{label, value}[]` array |
| Filtering/search | ✅ | Native | `filterOption` prop (boolean or custom function), `onSearch` callback triggers on input |
| Highlight matches | ✅ | Native | `defaultActiveFirstOption` highlights first match, supports keyboard navigation |
| Custom option rendering | ✅ | Native | Options support custom labels with HTML, icons, formatting via `label` property |
| Icons/Prefixes | ✅ | Composed | Can include icons, prefixes, suffixes through custom input element or option labels |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Single selection | ✅ | Native | Primary use case - user selects one suggestion or enters freeform text |
| Multi-selection | ❌ | N/A | Not supported - AutoComplete is for single input assistance |
| Freeform input | ✅ | Native | Core feature - users can type anything, not limited to options |
| Strict selection | ❌ | N/A | By design allows freeform input; use Select component for strict selection |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Loading | ⚠️ | CSS-only | Can show loading via custom option content, no dedicated loading prop |
| Empty state | ✅ | Native | `notFoundContent` prop displays message when no matches (default: "Not Found") |
| Error state | ✅ | Native | `status="error"` prop (v4.19.0+) for validation errors |
| Disabled | ✅ | Native | `disabled` prop disables entire component |
| Focus state | ✅ | Native | `autoFocus` prop, `onFocus`/`onBlur` callbacks, `focus()`/`blur()` methods |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ⚠️ | Composed | Inherited from Input component via custom `children` (small, middle, large) |
| Async data loading | ✅ | Native | `onSearch` callback enables dynamic option population based on input |
| Debounced search | ⚠️ | CSS-only | `onSearch` provides raw input changes, debouncing requires user implementation |
| Grouped options | ✅ | Native | Options support grouping via option structure with categories/titles |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Keyboard navigation | ✅ | Native | Arrow keys navigate, Enter selects, `backfill` prop auto-fills on arrow navigation |
| Click selection | ✅ | Native | Click any option to select, triggers `onSelect` callback |
| Clear button | ✅ | Native | `allowClear` prop shows clear button, `onClear` callback (v4.6.0+) |
| onSearch callback | ✅ | Native | `onSearch(value)` fires when user types, enables dynamic data loading |
| onChange callback | ✅ | Native | `onChange(value)` fires on input change or selection |
| onSelect callback | ✅ | Native | `onSelect(value, option)` fires specifically when option selected |

## Code Examples

### Basic Usage
```jsx
import { AutoComplete } from 'antd';

const mockVal = (str, repeat = 1) => ({
  value: str.repeat(repeat),
});

const App = () => {
  const [options, setOptions] = useState([]);
  const onSearch = (searchText) => {
    setOptions(
      !searchText ? [] : [mockVal(searchText), mockVal(searchText, 2), mockVal(searchText, 3)],
    );
  };
  return (
    <AutoComplete
      options={options}
      style={{ width: 200 }}
      onSearch={onSearch}
      placeholder="input here"
    />
  );
};
```

### Custom Input Element
```jsx
import { AutoComplete, Input } from 'antd';
const { TextArea } = Input;

const App = () => (
  <AutoComplete
    options={options}
    onSearch={onSearch}
  >
    <TextArea
      placeholder="input here"
      style={{ height: 50 }}
    />
  </AutoComplete>
);
```

### Email Domain Suggestions
```jsx
const App = () => {
  const [result, setResult] = useState([]);

  const handleSearch = (value) => {
    let res = [];
    if (!value || value.indexOf('@') >= 0) {
      res = [];
    } else {
      res = ['gmail.com', '163.com', 'qq.com'].map((domain) => ({
        value: `${value}@${domain}`,
        label: `${value}@${domain}`,
      }));
    }
    setResult(res);
  };

  return (
    <AutoComplete
      options={result}
      onSearch={handleSearch}
      placeholder="input email"
    />
  );
};
```

### Custom Filtering
```jsx
const App = () => (
  <AutoComplete
    options={options}
    placeholder="Try to type `b`"
    filterOption={(inputValue, option) =>
      option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
    }
  />
);
```

### Grouped Categories
```jsx
const options = [
  {
    label: 'Libraries',
    options: [
      { label: 'AntDesign', value: 'AntDesign' },
      { label: 'AntDesign UI', value: 'AntDesign UI' },
    ],
  },
  {
    label: 'Solutions',
    options: [
      { label: 'AntDesign UI FAQ', value: 'AntDesign UI FAQ' },
      { label: 'AntDesign FAQ', value: 'AntDesign FAQ' },
    ],
  },
];

const App = () => (
  <AutoComplete
    style={{ width: 200 }}
    options={options}
    placeholder="input here"
    filterOption={(inputValue, option) =>
      option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
    }
  />
);
```

### Status/Validation States
```jsx
const App = () => (
  <>
    <AutoComplete status="error" placeholder="Error" />
    <AutoComplete status="warning" placeholder="Warning" />
  </>
);
```

### Controlled Mode
```jsx
const App = () => {
  const [value, setValue] = useState('');

  return (
    <AutoComplete
      value={value}
      options={options}
      onChange={setValue}
      onSearch={handleSearch}
      onSelect={handleSelect}
    />
  );
};
```

## Notable Features

- **Flexible Input Assistance**: Unlike Select, AutoComplete prioritizes helping users type rather than forcing selection from options - core distinction in mental model
- **Backfill Functionality**: Unique `backfill` prop auto-fills input when navigating with arrow keys, improving keyboard UX
- **Custom Input Elements**: `children` prop enables using TextArea, custom inputs, or any React element instead of default Input
- **Dynamic Option Labels**: Options support rich content including HTML, icons, and custom formatting via `label` property
- **Nested Grouping**: Options can be structured hierarchically with category labels for better organization
- **Validation Integration**: Built-in `status` prop (v4.19.0+) for error/warning states integrates with form validation
- **Controlled Dropdown**: `open` prop with `onDropdownVisibleChange` enables programmatic dropdown control
- **Width Matching**: `dropdownMatchSelectWidth` can be boolean or number for precise dropdown sizing
- **Method Access**: Imperative `focus()` and `blur()` methods for programmatic control

## Research Notes

- Documentation is comprehensive with clear examples for each major use case
- The component philosophy clearly distinguishes it from Select (input assistance vs. strict selection)
- Version 4.19.0+ added `status` prop for validation states, showing active development
- Version 4.6.0+ added `onClear` callback for better clear button control
- Examples demonstrate both controlled and uncontrolled modes effectively
- Grouped options pattern is well-documented with practical examples
- Some features like size variants are inherited from Input component rather than being AutoComplete-specific
- Loading states and debouncing require custom implementation, not built-in
- The `backfill` feature for keyboard navigation is a thoughtful UX detail not common in other libraries
