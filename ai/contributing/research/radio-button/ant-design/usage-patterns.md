# Ant Design - Radio Component

## Component Overview

The Radio component is a fundamental input control that allows users to select a single option from a set of mutually exclusive choices. Ant Design provides a comprehensive Radio implementation with multiple variants (standard radios and button-style radios) and extensive customization options for different use cases.

**Key characteristics:**
- Single selection from multiple options (mutually exclusive)
- Support for individual Radio components and grouped Radio.Group containers
- Button-style variant (Radio.Button) for compact, modern UIs
- Three size variants (small, default, large)
- Data-driven options configuration
- Block-level layout support for full-width radio groups
- Controlled and uncontrolled modes
- Built-in form integration via name prop

**Common use cases:**
- Form inputs requiring single selection
- Settings and preferences selection
- Survey and questionnaire options
- Filter controls in data views
- Toggle between view modes or display options
- Configuration panels

---

## Usage Patterns

### Basic Usage

The simplest Radio implementation as a standalone component:

```jsx
import React from 'react';
import { Radio } from 'antd';

const App: React.FC = () => <Radio>Radio</Radio>;

export default App;
```

**Key elements:**
- `Radio` - Individual radio button component
- Content passed as children becomes the label
- Can be used standalone or within Radio.Group

### Radio Group with Children

Group multiple Radio components together for single selection:

```jsx
import { Radio } from 'antd';

<Radio.Group defaultValue="a" onChange={(e) => console.log('radio checked:', e.target.value)}>
  <Radio value="a">Option A</Radio>
  <Radio value="b">Option B</Radio>
  <Radio value="c">Option C</Radio>
</Radio.Group>
```

**Features:**
- `Radio.Group` - Container managing selection state
- `defaultValue` - Initial selected value (uncontrolled mode)
- `onChange` - Callback triggered on selection change
- Each Radio needs unique `value` prop

### Radio Group with Options Prop

Data-driven approach using options array:

```jsx
import { Radio } from 'antd';
import { useState } from 'react';

const App: React.FC = () => {
  const [value, setValue] = useState('Apple');

  const plainOptions = ['Apple', 'Pear', 'Orange'];

  // Or with object notation
  const options = [
    { label: 'Apple', value: 'Apple' },
    { label: 'Pear', value: 'Pear' },
    { label: 'Orange', value: 'Orange', disabled: true },
  ];

  return (
    <Radio.Group
      options={options}
      onChange={(e) => setValue(e.target.value)}
      value={value}
    />
  );
};
```

**Options format:**
- Simple array: `['Option1', 'Option2']`
- Object array: `[{ label: string, value: any, disabled?: boolean, className?: string }]`
- Enables disabled state per option
- Supports custom styling via className

### Button Style Radios

Radio buttons with button appearance for compact UIs:

```jsx
import { Radio, Flex } from 'antd';

const App: React.FC = () => (
  <Flex vertical gap="middle">
    {/* Basic button style */}
    <Radio.Group defaultValue="a" onChange={(e) => console.log('radio checked:', e.target.value)}>
      <Radio.Button value="a">Hangzhou</Radio.Button>
      <Radio.Button value="b">Shanghai</Radio.Button>
      <Radio.Button value="c">Beijing</Radio.Button>
      <Radio.Button value="d">Chengdu</Radio.Button>
    </Radio.Group>

    {/* With individual disabled button */}
    <Radio.Group defaultValue="a">
      <Radio.Button value="a">Hangzhou</Radio.Button>
      <Radio.Button value="b" disabled>Shanghai</Radio.Button>
      <Radio.Button value="c">Beijing</Radio.Button>
      <Radio.Button value="d">Chengdu</Radio.Button>
    </Radio.Group>

    {/* Entire group disabled */}
    <Radio.Group defaultValue="a" disabled>
      <Radio.Button value="a">Hangzhou</Radio.Button>
      <Radio.Button value="b">Shanghai</Radio.Button>
      <Radio.Button value="c">Beijing</Radio.Button>
      <Radio.Button value="d">Chengdu</Radio.Button>
    </Radio.Group>
  </Flex>
);
```

**Button style features:**
- `Radio.Button` - Button-styled radio component
- Disabled can be applied per button or entire group
- Visually connected buttons (segmented control appearance)

### Button Style with Options Prop

Data-driven button radios:

```jsx
import { Radio } from 'antd';

const options = [
  { label: 'Hangzhou', value: 'a' },
  { label: 'Shanghai', value: 'b' },
  { label: 'Beijing', value: 'c' },
  { label: 'Chengdu', value: 'd' },
];

<Radio.Group
  options={options}
  defaultValue="a"
  optionType="button"
/>

{/* Solid button style */}
<Radio.Group
  options={options}
  defaultValue="a"
  optionType="button"
  buttonStyle="solid"
/>
```

**Configuration:**
- `optionType="button"` - Renders options as buttons
- `buttonStyle="solid"` - Solid fill style (vs default outline)
- `buttonStyle="outline"` - Default outline style

### Disabled State

Control disabled state at component or group level:

```jsx
import { Radio, Button } from 'antd';
import { useState } from 'react';

const App: React.FC = () => {
  const [disabled, setDisabled] = useState(true);

  const toggleDisabled = () => {
    setDisabled(!disabled);
  };

  return (
    <>
      <Radio defaultChecked={false} disabled={disabled}>
        Disabled
      </Radio>
      <Radio defaultChecked disabled={disabled}>
        Disabled
      </Radio>
      <br />
      <Button type="primary" onClick={toggleDisabled} style={{ marginTop: 16 }}>
        Toggle disabled
      </Button>
    </>
  );
};
```

**Disabled patterns:**
- Individual `disabled` prop on Radio/Radio.Button
- Group-level `disabled` prop on Radio.Group
- Dynamic disabled state via state management

### Size Variations

Three size options for different UI densities:

```jsx
import { Radio, Flex } from 'antd';

const App: React.FC = () => (
  <Flex vertical gap="middle">
    {/* Large */}
    <Radio.Group defaultValue="a" size="large">
      <Radio.Button value="a">Hangzhou</Radio.Button>
      <Radio.Button value="b">Shanghai</Radio.Button>
      <Radio.Button value="c">Beijing</Radio.Button>
      <Radio.Button value="d">Chengdu</Radio.Button>
    </Radio.Group>

    {/* Default (medium) */}
    <Radio.Group defaultValue="a">
      <Radio.Button value="a">Hangzhou</Radio.Button>
      <Radio.Button value="b">Shanghai</Radio.Button>
      <Radio.Button value="c">Beijing</Radio.Button>
      <Radio.Button value="d">Chengdu</Radio.Button>
    </Radio.Group>

    {/* Small */}
    <Radio.Group defaultValue="a" size="small">
      <Radio.Button value="a">Hangzhou</Radio.Button>
      <Radio.Button value="b">Shanghai</Radio.Button>
      <Radio.Button value="c">Beijing</Radio.Button>
      <Radio.Button value="d">Chengdu</Radio.Button>
    </Radio.Group>
  </Flex>
);

export default App;
```

**Size options:**
- `size="large"` - Large radio buttons
- No size prop - Default (medium) size
- `size="small"` - Compact radio buttons
- Applies to both Radio and Radio.Button variants

### Block Layout

Full-width radio group spanning container width:

```jsx
import { Radio } from 'antd';

const options = ['Apple', 'Pear', 'Orange'];

<Radio.Group block options={options} defaultValue="Apple" />

{/* Button style with block */}
<Radio.Group
  block
  options={options}
  defaultValue="Apple"
  optionType="button"
/>

{/* Solid button style with block */}
<Radio.Group
  block
  options={options}
  defaultValue="Apple"
  optionType="button"
  buttonStyle="solid"
/>
```

**Block layout features:**
- `block={true}` - Makes radio group span full width
- Options distributed evenly across width
- Works with all style variants (default, button, solid)

### Custom Content with Icons

Rich content in radio labels:

```jsx
import { Radio, Flex } from 'antd';
import { LineChartOutlined, DotChartOutlined, BarChartOutlined, PieChartOutlined } from '@ant-design/icons';
import { useState } from 'react';

const App: React.FC = () => {
  const [value, setValue] = useState(1);

  const options = [
    {
      value: 1,
      className: 'chart-option',
      label: (
        <Flex align="center" gap="small">
          <LineChartOutlined style={{ fontSize: 18 }} />
          <span>Line Chart</span>
        </Flex>
      ),
    },
    {
      value: 2,
      className: 'chart-option',
      label: (
        <Flex align="center" gap="small">
          <DotChartOutlined style={{ fontSize: 18 }} />
          <span>Dot Chart</span>
        </Flex>
      ),
    },
    {
      value: 3,
      className: 'chart-option',
      label: (
        <Flex align="center" gap="small">
          <BarChartOutlined style={{ fontSize: 18 }} />
          <span>Bar Chart</span>
        </Flex>
      ),
    },
    {
      value: 4,
      className: 'chart-option',
      label: (
        <Flex align="center" gap="small">
          <PieChartOutlined style={{ fontSize: 18 }} />
          <span>Pie Chart</span>
        </Flex>
      ),
    },
  ];

  return (
    <Radio.Group
      options={options}
      onChange={(e) => setValue(e.target.value)}
      value={value}
    />
  );
};
```

**Custom content support:**
- Label can be React elements (not just strings)
- Icons, images, complex layouts supported
- Flex layout for icon + text combinations
- Full control over label appearance

### Controlled Mode

External state management with controlled component:

```jsx
import { Radio } from 'antd';
import { useState } from 'react';

const App: React.FC = () => {
  const [value, setValue] = useState('Apple');

  return (
    <>
      <Radio.Group
        value={value}
        onChange={(e) => setValue(e.target.value)}
      >
        <Radio value="Apple">Apple</Radio>
        <Radio value="Pear">Pear</Radio>
        <Radio value="Orange">Orange</Radio>
      </Radio.Group>

      <div>Selected: {value}</div>

      <button onClick={() => setValue('Pear')}>
        Select Pear Programmatically
      </button>
    </>
  );
};
```

**Controlled features:**
- `value` prop - Current selected value
- `onChange` callback - Updates external state
- Programmatic control over selection
- Full React state integration

### Form Integration

Integration with HTML forms via name prop:

```jsx
import { Radio } from 'antd';

<Radio.Group
  name="radiogroup"
  defaultValue={1}
  options={[
    { value: 1, label: 'A' },
    { value: 2, label: 'B' },
    { value: 3, label: 'C' },
    { value: 4, label: 'D' },
  ]}
/>
```

**Form integration:**
- `name` prop - HTML input name attribute
- Groups radios for native form submission
- Works with form libraries (Ant Design Form, React Hook Form, Formik)
- Standard form field behavior

---

## Component API

### Radio Props

```typescript
interface RadioProps {
  autoFocus?: boolean;          // Auto focus on component mount
  checked?: boolean;            // Controlled checked state
  defaultChecked?: boolean;     // Initial checked state (uncontrolled)
  disabled?: boolean;           // Disable the radio
  value?: any;                  // Value associated with radio
  optionType?: 'default' | 'button';  // Style type
}
```

### Radio.Group Props

```typescript
interface RadioGroupProps {
  defaultValue?: any;           // Initial value (uncontrolled)
  value?: any;                  // Current value (controlled)
  onChange?: (e: RadioChangeEvent) => void;  // Selection change handler
  size?: 'large' | 'default' | 'small';      // Size variant
  disabled?: boolean;           // Disable entire group
  name?: string;                // HTML name attribute for form
  options?: Array<string | { label: React.ReactNode, value: any, disabled?: boolean, className?: string }>;
  optionType?: 'default' | 'button';  // Render as standard or button style
  buttonStyle?: 'outline' | 'solid';  // Button appearance (when optionType="button")
  block?: boolean;              // Full width layout
  id?: string;                  // HTML id attribute
  children?: React.ReactNode;   // Radio components as children
  onMouseEnter?: (e: React.MouseEvent) => void;
  onMouseLeave?: (e: React.MouseEvent) => void;
  onFocus?: (e: React.FocusEvent) => void;
  onBlur?: (e: React.FocusEvent) => void;
}
```

### RadioChangeEvent

```typescript
interface RadioChangeEvent {
  target: {
    checked: boolean;
    value: any;
  };
  stopPropagation: () => void;
  preventDefault: () => void;
  nativeEvent: MouseEvent;
}
```

---

## Pattern Analysis

### Content Patterns

| Pattern | Support | Details |
|---------|---------|---------|
| Text content | Native | Via children or options label prop |
| Icon support | Composed | Icons as part of label React elements |
| Custom content | Composed | Full React elements supported in labels |
| Rich content | Composed | Complex layouts, images, formatted text |

### Type Patterns

| Pattern | Support | Details |
|---------|---------|---------|
| Single radio | Native | `<Radio>` component |
| Radio group | Native | `Radio.Group` with children or options |
| Button style | Native | `Radio.Button` or `optionType="button"` |
| Solid buttons | Native | `buttonStyle="solid"` prop |

### State Patterns

| Pattern | Support | Details |
|---------|---------|---------|
| Disabled | Native | `disabled` prop on Radio or Radio.Group |
| Checked/Selected | Native | `checked`, `defaultChecked`, `value`, `defaultValue` |
| Auto focus | Native | `autoFocus` prop |

### Variation Patterns

| Pattern | Support | Details |
|---------|---------|---------|
| Size options | Native | `size="small"`, `size="large"`, default medium |
| Button styles | Native | `optionType="button"`, `buttonStyle="outline|solid"` |
| Block layout | Native | `block={true}` for full-width groups |

### Interactive Patterns

| Pattern | Support | Details |
|---------|---------|---------|
| onChange handler | Native | RadioChangeEvent with target.value |
| Controlled/Uncontrolled | Native | Both modes fully supported |
| Form integration | Native | `name` prop for form field grouping |
| Mouse events | Native | onMouseEnter, onMouseLeave |
| Focus events | Native | onFocus, onBlur |

---

## Implementation Notes

**Strengths:**
- Comprehensive API covering all common use cases
- Excellent data-driven approach with options prop
- Button style variant provides modern alternative to standard radios
- Block layout for responsive full-width designs
- Both controlled and uncontrolled modes well-supported
- Rich content support through React element labels
- TypeScript definitions included

**Design philosophy:**
- Composition-based (Radio.Group + Radio children) or data-driven (options prop)
- Flexible styling through props (optionType, buttonStyle, size, block)
- Follows React patterns for controlled components
- Consistent with Ant Design component API conventions

**Version note:**
- Documentation based on current Ant Design v5.x
- API is stable and well-established
- Active maintenance with regular updates

**Accessibility:**
- Uses semantic HTML radio inputs
- Keyboard navigation supported
- ARIA attributes applied appropriately
- Focus management included

---

## Related Components

- **Checkbox** - For multiple selection scenarios
- **Select** - For larger option sets or searchable selections
- **Switch** - For binary on/off states
- **Segmented** - Alternative button-style selection control

---

## Resources

- [Official Documentation](https://ant.design/components/radio/)
- [GitHub Source Code](https://github.com/ant-design/ant-design/tree/master/components/radio)
- [Demo Examples](https://github.com/ant-design/ant-design/tree/master/components/radio/demo)
- [TypeScript Definitions](https://github.com/ant-design/ant-design/blob/master/components/radio/interface.ts)

---

**Last Updated:** 2025-11-05
**Component Status:** ✅ Active and well-maintained
**Documentation Quality:** Comprehensive with extensive examples
