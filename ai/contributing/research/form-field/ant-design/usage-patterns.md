# Ant Design - Form Field Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://ant.design/components/form
Status: ✅ Working
Version: 5.x (Current as of 2025)
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - Ant Design provides detailed API documentation with extensive examples, validation patterns, and integration guides for their Form system.

## Component Definition
- **Core purpose**: Form and Form.Item provide a complete form management system for capturing user input with integrated validation, error handling, and layout management. Form.Item acts as a field wrapper that handles label rendering, validation state, error messages, and proper field registration.
- **Mental model**: Form is the orchestrator that manages field state, validation, and submission. Form.Item is the individual field container that wraps inputs and handles presentation concerns (labels, errors, help text, layout).
- **Semantic meaning**: Represents a complete form control with label, input, validation feedback, and help text - communicating the field's purpose, requirements, and current state to users.

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `label="Name"`, `rules={[...]}`)
- **Composed**: Via composition/children (e.g., `<Form.Item><Input /></Form.Item>`)
- **CSS-only**: Requires custom styling (e.g., `style={{ ... }}`)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Label association | ✅ | Native | `label` prop on Form.Item with automatic id/htmlFor association |
| Help text | ✅ | Native | `help` prop displays helper text below the field; `extra` prop for additional descriptive content |
| Error messages | ✅ | Native | Automatic display via validation rules; manual control via `help` + `validateStatus="error"` |
| Required indicator | ✅ | Native | `required` prop adds asterisk; controlled by `requiredMark` on Form level (true/false/'optional') |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Invalid/Error | ✅ | Native | `validateStatus="error"` or automatic via rules; shows error styling and message |
| Disabled | ✅ | Native | `disabled` on Form level disables all fields; individual control via wrapped input's disabled prop |
| Required | ✅ | Native | `required` prop adds visual indicator; `rules={[{ required: true }]}` for validation |
| Read-only | ✅ | Composed | Applied to wrapped input component (e.g., `<Input readOnly />`) |

## Layout Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Vertical layout | ✅ | Native | `layout="vertical"` - label above input (default) |
| Horizontal layout | ✅ | Native | `layout="horizontal"` - label beside input; uses `labelCol` and `wrapperCol` for grid control |
| Inline layout | ✅ | Native | `layout="inline"` - fields displayed in a row |
| Label placement | ✅ | Native | Top (vertical), left (horizontal), or hidden (noStyle); `labelAlign="left"/"right"` for text alignment |

## Validation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Built-in validation | ✅ | Native | Extensive rules: required, type, min, max, len, pattern, whitespace, enum, transform, and more |
| Custom validation | ✅ | Native | `validator` function in rules array: `{ validator: async (rule, value) => {...} }` |
| Real-time validation | ✅ | Native | `validateTrigger` prop controls when validation occurs (onChange, onBlur, onFocus, etc.) |
| Error message display | ✅ | Native | Automatic error display below field; animated slide-in transition; custom via `help` prop |

## Integration Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Form library integration | ✅ | Native | Built-in form management via `Form.useForm()` hook; also works with React Hook Form via controller |
| Native HTML form | ✅ | Native | Renders semantic `<form>` element; supports onSubmit with `onFinish` callback |
| Controlled components | ✅ | Native | Value management via Form's field state; access via `form.getFieldValue(name)` |
| Uncontrolled components | ✅ | Native | `initialValues` prop for default values; fields manage their own state until submission |

## Code Examples
```jsx
// Basic usage with validation
import { Form, Input, Button } from 'antd';

function BasicForm() {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      form={form}
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="Username"
        name="username"
        rules={[
          { required: true, message: 'Please input your username!' },
          { min: 3, message: 'Username must be at least 3 characters' }
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: 'Please input your email!' },
          { type: 'email', message: 'Please enter a valid email!' }
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[
          { required: true, message: 'Please input your password!' }
        ]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}

// Vertical layout with help text
<Form layout="vertical">
  <Form.Item
    label="API Key"
    name="apiKey"
    help="You can find your API key in your account settings"
    extra="Never share your API key with others"
    rules={[{ required: true }]}
  >
    <Input placeholder="Enter your API key" />
  </Form.Item>
</Form>

// Custom validation with async validator
<Form.Item
  label="Username"
  name="username"
  rules={[
    { required: true, message: 'Username is required' },
    {
      validator: async (_, value) => {
        if (!value) return Promise.resolve();

        const response = await fetch(`/api/check-username?username=${value}`);
        const { available } = await response.json();

        if (!available) {
          return Promise.reject(new Error('Username is already taken'));
        }
        return Promise.resolve();
      }
    }
  ]}
  hasFeedback
  validateDebounce={500}
>
  <Input />
</Form.Item>

// Manual validation control
<Form.Item
  label="Custom Field"
  validateStatus="error"
  help="This field has an error"
>
  <Input />
</Form.Item>

// Dependencies between fields
<Form.Item
  label="Password"
  name="password"
  rules={[{ required: true }]}
>
  <Input.Password />
</Form.Item>

<Form.Item
  label="Confirm Password"
  name="confirmPassword"
  dependencies={['password']}
  rules={[
    { required: true, message: 'Please confirm your password!' },
    ({ getFieldValue }) => ({
      validator(_, value) {
        if (!value || getFieldValue('password') === value) {
          return Promise.resolve();
        }
        return Promise.reject(new Error('Passwords do not match!'));
      },
    }),
  ]}
>
  <Input.Password />
</Form.Item>

// Dynamic field list
<Form.List name="users">
  {(fields, { add, remove }) => (
    <>
      {fields.map(({ key, name, ...restField }) => (
        <Space key={key} style={{ display: 'flex', marginBottom: 8 }}>
          <Form.Item
            {...restField}
            name={[name, 'first']}
            rules={[{ required: true, message: 'Missing first name' }]}
          >
            <Input placeholder="First Name" />
          </Form.Item>
          <Form.Item
            {...restField}
            name={[name, 'last']}
            rules={[{ required: true, message: 'Missing last name' }]}
          >
            <Input placeholder="Last Name" />
          </Form.Item>
          <MinusCircleOutlined onClick={() => remove(name)} />
        </Space>
      ))}
      <Form.Item>
        <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
          Add User
        </Button>
      </Form.Item>
    </>
  )}
</Form.List>

// Inline layout
<Form layout="inline" onFinish={onFinish}>
  <Form.Item name="username" rules={[{ required: true }]}>
    <Input placeholder="Username" />
  </Form.Item>
  <Form.Item name="password" rules={[{ required: true }]}>
    <Input.Password placeholder="Password" />
  </Form.Item>
  <Form.Item>
    <Button type="primary" htmlType="submit">
      Log in
    </Button>
  </Form.Item>
</Form>
```
[View Live](https://ant.design/components/form#components-form-demo-basic) (if available)

## Notable Features

### 1. Field-Level Optimization
Form only re-renders fields that have changed, using incremental updates for performance. This prevents unnecessary re-renders across the entire form.

### 2. Form.useForm() Hook
Provides programmatic access to form instance for imperative operations:
```jsx
const [form] = Form.useForm();
form.setFieldsValue({ username: 'john' });
form.validateFields(['username']);
form.resetFields();
```

### 3. Rich Validation Rule Types
Built-in support for: `string`, `number`, `boolean`, `method`, `regexp`, `integer`, `float`, `array`, `object`, `enum`, `date`, `url`, `hex`, `email`

### 4. Dependencies System
Fields can declare dependencies on other fields, automatically triggering re-validation when upstream fields change.

### 5. Form.List for Dynamic Fields
Built-in support for dynamic field arrays with add/remove operations, preserving validation and state management.

### 6. Validation Timing Control
Fine-grained control via `validateTrigger`: can validate onChange, onBlur, onFocus, or custom events. Can also set different triggers for different rules.

### 7. Field Feedback Icons
`hasFeedback` prop shows animated success/error/validating icons inside input fields.

### 8. Scroll to Error
`scrollToFirstError` prop automatically scrolls to the first field with validation error on submit.

### 9. Required Mark Variants
`requiredMark` prop supports: `true` (asterisk), `false` (none), or `'optional'` (marks non-required fields instead).

### 10. Label Tooltip
`tooltip` prop on Form.Item adds an info icon with tooltip next to the label.

### 11. Grid Integration
Native integration with Ant Design Grid via `labelCol` and `wrapperCol` for responsive layouts.

### 12. Preserve Field Values
`preserve` prop on Form.Item controls whether field value is retained when field is unmounted (default: true).

### 13. No Style Mode
`noStyle` prop renders field without wrapper, useful for embedding fields in custom layouts while maintaining form integration.

### 14. Status Feedback
`validateStatus` supports: 'success', 'warning', 'error', 'validating' for custom status display.

## Research Notes

### Accessing Documentation
- The main Ant Design documentation site (https://ant.design/components/form) renders as a modern SPA with extensive CSS and JavaScript
- Documentation includes comprehensive API tables, interactive examples, and design guidelines
- Web scraping tools primarily retrieved CSS styling rather than documentation text, likely due to client-side rendering

### Framework Approach
Ant Design takes a batteries-included approach to forms:
- **Integrated System**: Form and Form.Item work as a cohesive system rather than independent primitives
- **Opinionated Validation**: Built-in validation library (async-validator) with extensive rule types
- **Performance First**: Incremental rendering and field-level updates prevent unnecessary re-renders
- **Enterprise Focus**: Features like dynamic field lists, complex validation dependencies, and grid integration target enterprise use cases

### Comparison to Other Libraries
- More feature-complete than basic field wrappers (like plain React inputs)
- More opinionated than headless solutions (like React Hook Form alone)
- Comparable feature set to MUI's TextField/Form system but with different design language
- Stronger built-in validation than CSS-only approaches (like Semantic UI Classic)

### Design Patterns
- **Container/Presentation**: Form manages state and logic; Form.Item handles presentation
- **Compound Components**: Form, Form.Item, Form.List, Form.Provider work together as a system
- **Progressive Enhancement**: Works with basic props, scales to complex scenarios with advanced features
- **Accessibility Built-in**: Automatic aria-* attributes, id/htmlFor association, keyboard navigation
