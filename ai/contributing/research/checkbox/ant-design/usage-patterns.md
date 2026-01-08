# Ant Design - Checkbox Usage Patterns

## Component URL
https://ant.design/components/checkbox/
Status: ✅ Working
Version: Current (5.x)
Last Verified: 2025-11-04

## Documentation Quality
Comprehensive - includes detailed API reference, multiple code examples, and interactive demos.

---

## 1. Component Overview

The Checkbox component in Ant Design is used for selecting multiple values from several options. It provides a standard checkbox input with additional features like indeterminate states for "select all" functionality, controlled/uncontrolled modes, and checkbox group management. The component integrates seamlessly with Ant Design's Form system and supports both individual checkboxes and checkbox groups for managing collections of related options.

---

## 2. Basic Usage

### Simple Checkbox

```jsx
import { Checkbox } from 'antd';

// Uncontrolled checkbox with default state
<Checkbox defaultChecked>Remember me</Checkbox>

// Basic checkbox with onChange handler
<Checkbox onChange={onChange}>Checkbox</Checkbox>
```

### Controlled Checkbox

```jsx
import React, { useState } from 'react';
import { Checkbox } from 'antd';

const ControlledCheckbox = () => {
  const [checked, setChecked] = useState(false);

  const onChange = (e) => {
    console.log('checked = ', e.target.checked);
    setChecked(e.target.checked);
  };

  return (
    <Checkbox checked={checked} onChange={onChange}>
      Controlled Checkbox
    </Checkbox>
  );
};
```

### Disabled Checkbox

```jsx
<Checkbox defaultChecked={false} disabled>
  Disabled Unchecked
</Checkbox>
<Checkbox defaultChecked disabled>
  Disabled Checked
</Checkbox>
```

---

## 3. Props/API

### Checkbox Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| autoFocus | boolean | false | If get focus when component mounted |
| checked | boolean | false | Specifies whether the checkbox is selected (controlled) |
| defaultChecked | boolean | false | Specifies the initial state: whether the checkbox is selected (uncontrolled) |
| disabled | boolean | false | If disable checkbox |
| indeterminate | boolean | false | The indeterminate checked state of checkbox. Used for "select all" scenarios |
| onChange | function(e: Event) | - | The callback function that is triggered when the state changes |
| value | any | - | Used with Checkbox.Group to identify the checkbox value |
| children | ReactNode | - | The content displayed next to the checkbox |

### Checkbox.Group Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| defaultValue | string[] \| number[] | [] | Default selected values |
| disabled | boolean | false | If disable all checkboxes |
| name | string | - | The name property of all input[type="checkbox"] children |
| options | string[] \| number[] \| Option[] | [] | Specifies options for generating checkboxes |
| value | string[] \| number[] | [] | Used for setting the currently selected values (controlled) |
| onChange | function(checkedValue) | - | The callback function that is triggered when the state changes |

### Option Type (for Checkbox.Group options)

| Property | Type | Description |
|----------|------|-------------|
| label | string \| ReactNode | Display text for the checkbox |
| value | string \| number | Value associated with the checkbox |
| disabled | boolean | Whether the checkbox is disabled |

---

## 4. Variants & Patterns

### Checkbox Groups

Generate multiple checkboxes from an array of options:

```jsx
import { Checkbox } from 'antd';

const CheckboxGroup = Checkbox.Group;

const options = [
  { label: 'Apple', value: 'Apple' },
  { label: 'Pear', value: 'Pear' },
  { label: 'Orange', value: 'Orange' },
];

const plainOptions = ['Apple', 'Pear', 'Orange'];

// Using options array with objects
<CheckboxGroup options={options} defaultValue={['Apple']} onChange={onChange} />

// Using simple string array
<CheckboxGroup options={plainOptions} defaultValue={['Apple']} onChange={onChange} />
```

### Indeterminate State (Select All Pattern)

The indeterminate property creates a "select all" effect:

```jsx
import React, { useState } from 'react';
import { Checkbox } from 'antd';

const CheckboxGroup = Checkbox.Group;

const plainOptions = ['Apple', 'Pear', 'Orange'];
const defaultCheckedList = ['Apple', 'Orange'];

const App = () => {
  const [checkedList, setCheckedList] = useState(defaultCheckedList);
  const [indeterminate, setIndeterminate] = useState(true);
  const [checkAll, setCheckAll] = useState(false);

  const onChange = (list) => {
    setCheckedList(list);
    setIndeterminate(!!list.length && list.length < plainOptions.length);
    setCheckAll(list.length === plainOptions.length);
  };

  const onCheckAllChange = (e) => {
    setCheckedList(e.target.checked ? plainOptions : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };

  return (
    <>
      <Checkbox
        indeterminate={indeterminate}
        onChange={onCheckAllChange}
        checked={checkAll}
      >
        Check all
      </Checkbox>
      <CheckboxGroup
        options={plainOptions}
        value={checkedList}
        onChange={onChange}
      />
    </>
  );
};
```

### Disabled Checkboxes

Individual checkboxes or entire groups can be disabled:

```jsx
// Disabled individual checkbox
<Checkbox disabled>Disabled</Checkbox>

// Disabled checkbox in group
const options = [
  { label: 'Apple', value: 'Apple' },
  { label: 'Pear', value: 'Pear', disabled: true },
  { label: 'Orange', value: 'Orange' },
];

// Disable entire group
<CheckboxGroup options={options} disabled />
```

### Controlled vs Uncontrolled

**Uncontrolled (using defaultChecked):**
```jsx
<Checkbox defaultChecked={false}>Uncontrolled</Checkbox>
```

**Controlled (using checked with onChange):**
```jsx
const [checked, setChecked] = useState(false);

<Checkbox
  checked={checked}
  onChange={(e) => setChecked(e.target.checked)}
>
  Controlled
</Checkbox>
```

**Checkbox.Group Uncontrolled:**
```jsx
<CheckboxGroup options={options} defaultValue={['Apple']} />
```

**Checkbox.Group Controlled:**
```jsx
const [value, setValue] = useState(['Apple']);

<CheckboxGroup
  options={options}
  value={value}
  onChange={setValue}
/>
```

### Size Variants

**Note:** Ant Design Checkbox does not have a native `size` prop. The checkbox size is controlled by the design system's default sizing. Custom sizing would require CSS overrides.

### Validation States

Ant Design checkboxes integrate with the Form component for validation:

```jsx
import { Form, Checkbox } from 'antd';

<Form>
  <Form.Item
    name="agreement"
    valuePropName="checked"
    rules={[
      {
        validator: (_, value) =>
          value ? Promise.resolve() : Promise.reject(new Error('Should accept agreement')),
      },
    ]}
  >
    <Checkbox>
      I have read the <a href="">agreement</a>
    </Checkbox>
  </Form.Item>
</Form>
```

**Important:** When using with Form.Item, use `valuePropName="checked"` because Form.Item defaults to binding to the `value` property, but Checkbox uses the `checked` property.

---

## 5. Composition Patterns

### With Forms

Ant Design checkboxes are designed to work seamlessly with the Form component:

```jsx
import { Form, Checkbox } from 'antd';

<Form>
  <Form.Item name="remember" valuePropName="checked" noStyle>
    <Checkbox>Remember me</Checkbox>
  </Form.Item>

  <Form.Item name="interests" label="Interests">
    <Checkbox.Group options={interestOptions} />
  </Form.Item>
</Form>
```

Key points:
- Use `valuePropName="checked"` for individual checkboxes
- Checkbox.Group works with the default `value` binding
- Supports all Form validation rules

### With Layouts

Checkboxes can be arranged in various layouts:

```jsx
import { Checkbox, Space, Row, Col } from 'antd';

// Horizontal layout with Space
<Space>
  <Checkbox>Option 1</Checkbox>
  <Checkbox>Option 2</Checkbox>
  <Checkbox>Option 3</Checkbox>
</Space>

// Grid layout
<Row>
  <Col span={8}>
    <Checkbox>Option 1</Checkbox>
  </Col>
  <Col span={8}>
    <Checkbox>Option 2</Checkbox>
  </Col>
  <Col span={8}>
    <Checkbox>Option 3</Checkbox>
  </Col>
</Row>

// Checkbox.Group handles layout automatically
<CheckboxGroup options={options} />
```

### Custom Content

Checkboxes can contain rich content:

```jsx
<Checkbox>
  <span>I agree to the <a href="#">terms</a> and <a href="#">conditions</a></span>
</Checkbox>

<Checkbox>
  <div>
    <strong>Premium Plan</strong>
    <p>All features included</p>
  </div>
</Checkbox>
```

---

## 6. Styling & Theming

### CSS Class Names

Ant Design provides CSS classes for customization:

- `.ant-checkbox` - Main checkbox wrapper
- `.ant-checkbox-input` - The actual input element
- `.ant-checkbox-inner` - The visual checkbox box
- `.ant-checkbox-checked` - Applied when checked
- `.ant-checkbox-disabled` - Applied when disabled
- `.ant-checkbox-indeterminate` - Applied for indeterminate state

### Custom Styling

```css
/* Custom checkbox color */
.ant-checkbox-checked .ant-checkbox-inner {
  background-color: #custom-color;
  border-color: #custom-color;
}

/* Custom size (no native size prop) */
.custom-checkbox .ant-checkbox-inner {
  width: 20px;
  height: 20px;
}
```

### Theme Customization

Using Ant Design's ConfigProvider for global theming:

```jsx
import { ConfigProvider, Checkbox } from 'antd';

<ConfigProvider
  theme={{
    components: {
      Checkbox: {
        colorPrimary: '#00b96b',
      },
    },
  }}
>
  <Checkbox>Themed Checkbox</Checkbox>
</ConfigProvider>
```

---

## 7. Accessibility

### ARIA Attributes

Ant Design checkboxes include accessibility features:

- Uses native `<input type="checkbox">` for proper semantics
- Includes `aria-checked` attribute to expose state to assistive technology
- The `indeterminate` state is properly exposed to screen readers

### Keyboard Support

Standard keyboard interactions:

- **Space** - Toggle checkbox state
- **Tab** - Navigate to/from checkbox
- **Shift + Tab** - Navigate backwards

### Focus Management

- `autoFocus` prop available to set focus on mount
- Visual focus indicator (outline) when focused
- Note: Historical issues with keyboard UX have been addressed in current versions

### Screen Reader Support

- Label text is properly associated with the input
- State changes are announced to screen readers
- Indeterminate state is communicated appropriately

### Best Practices

1. Always provide meaningful label text or use `aria-label`
2. Use `valuePropName="checked"` when integrating with Form.Item
3. Ensure sufficient color contrast for visual accessibility
4. Group related checkboxes using Checkbox.Group for better context

---

## 8. Best Practices

### When to Use Checkboxes

- **Multiple selections:** Allow users to select multiple options from a list
- **Toggle settings:** Enable/disable individual features or preferences
- **Agreement confirmation:** Accept terms, conditions, or agreements
- **Filter options:** Select multiple filters for search or data display

### When NOT to Use Checkboxes

- **Mutually exclusive options:** Use Radio buttons instead
- **Single yes/no choice:** Consider a Switch component for binary toggles
- **Too many options:** Consider a multi-select dropdown instead

### Common Patterns

**1. Select All Pattern:**
```jsx
// Use indeterminate state for partial selection feedback
<Checkbox indeterminate={someSelected} checked={allSelected}>
  Select All
</Checkbox>
```

**2. Nested Checkboxes:**
```jsx
<Checkbox onChange={onParentChange}>
  Parent Option
</Checkbox>
<div style={{ marginLeft: 24 }}>
  <CheckboxGroup options={childOptions} />
</div>
```

**3. Checkbox with Description:**
```jsx
<Checkbox>
  <div>
    <div style={{ fontWeight: 'bold' }}>Option Title</div>
    <div style={{ color: '#666', fontSize: 12 }}>
      Helpful description text
    </div>
  </div>
</Checkbox>
```

### Gotchas

**1. Form.Item Value Binding:**
```jsx
// ❌ Wrong - Form.Item defaults to 'value' prop
<Form.Item name="agreement">
  <Checkbox>Accept</Checkbox>
</Form.Item>

// ✅ Correct - Use valuePropName="checked"
<Form.Item name="agreement" valuePropName="checked">
  <Checkbox>Accept</Checkbox>
</Form.Item>
```

**2. Controlled Component State:**
```jsx
// ❌ Wrong - mixing controlled and uncontrolled
<Checkbox checked={checked} defaultChecked>
  Mixed
</Checkbox>

// ✅ Correct - choose one approach
<Checkbox checked={checked} onChange={handleChange}>
  Controlled
</Checkbox>
```

**3. Checkbox.Group Options:**
```jsx
// Individual disabled in options can be overridden by group disabled
// Use individual checkbox disabled carefully with group disabled prop
```

**4. Event Handler Signature:**
```jsx
// onChange receives the event object, not just the boolean
const onChange = (e) => {
  console.log(e.target.checked); // ✅ Access checked state
  // not just: (checked) => console.log(checked) ❌
};
```

---

## 9. Comparison Notes

### Unique/Notable Features

**1. Indeterminate State Support:**
- Native `indeterminate` prop for "select all" patterns
- Visual indication (dash instead of checkmark)
- Properly exposed to accessibility APIs

**2. Checkbox.Group Component:**
- Dedicated component for managing checkbox collections
- Options array with label/value/disabled support
- Simplified state management for groups

**3. Form Integration:**
- Deep integration with Ant Design Form system
- Custom `valuePropName` handling
- Built-in validation support

**4. No Native Size Variants:**
- Unlike some frameworks, no built-in size prop
- Sizing controlled through design system tokens
- Requires CSS customization for different sizes

**5. ConfigProvider Theming:**
- Global theme customization through ConfigProvider
- Component-level theme overrides
- Design token system for consistent styling

### Differences from Standard HTML Checkbox

- Provides controlled and uncontrolled modes
- Enhanced styling with Ant Design visual language
- Built-in indeterminate state handling
- Group management functionality
- Form validation integration
- Theme customization capabilities

### Framework Philosophy

Ant Design's checkbox follows its enterprise-focused design philosophy:
- Comprehensive API for complex use cases
- Strong Form integration for data collection
- Accessibility built-in by default
- Consistent with broader design system
- Optimized for business applications
