# Ant Design - Form Usage Patterns

## Component URL
https://ant.design/components/form
Status: ✅ Working
Version: Current (5.x)
Last Verified: 2025-11-10

## Documentation Quality
Comprehensive - Ant Design provides extensive documentation with live interactive examples, detailed API tables, comprehensive guides, and thorough coverage of all major use cases. Documentation includes TypeScript types, accessibility features, and performance optimization patterns.

## Component Definition
- **Core purpose**: High-performance form management system providing data collection, validation, submission workflows, and layout control. Manages field state, validation queue, and cross-field dependencies through a centralized form instance.
- **Mental model**: Form acts as an intelligent orchestrator managing a registry of fields. Form.Item wraps input components to connect them to the form's state management system while handling presentation concerns (labels, errors, help text, layout).
- **Semantic meaning**: Represents a complete data entry interface with built-in validation, error handling, submission workflows, and accessibility features. Communicates structured data collection with visual feedback and user guidance.

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `name="username"`, `rules={[...]}`)
- **Composed**: Via composition/children (e.g., `<Form><Form.Item><Input /></Form.Item></Form>`)
- **CSS-only**: Requires custom styling (e.g., `style={{ ... }}`)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Field grouping | ✅ | Composed | Form.Item can contain multiple fields using nested Form.Item with `noStyle` prop for complex layouts without wrapper styling |
| Field labels | ✅ | Native | `label` prop on Form.Item with automatic positioning, alignment (`labelAlign`), and grid layout control (`labelCol`) |
| Help text | ✅ | Native | `help` prop for custom messages, `extra` prop for additional description. Auto-displays validation errors when rules fail |
| Error messages | ✅ | Native | Automatic error display from validation rules. Manual control via `validateStatus` prop and `form.setFields()` method |

## Validation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Built-in validation | ✅ | Native | `rules` array with built-in validators: `required`, `type` (13+ types), `len`, `min`, `max`, `pattern`, `whitespace`, `enum`, `transform` |
| Custom validation | ✅ | Native | `validator` function in rules array with Promise-based API for sync/async validation logic |
| Async validation | ✅ | Native | Async validators with automatic 'validating' status display. `hasFeedback` shows loading indicator. `validateDebounce` for performance |
| Cross-field validation | ✅ | Native | `dependencies` prop triggers re-validation when dependent fields change. Access other field values via `getFieldValue` in validator |
| Validation triggers | ✅ | Native | `validateTrigger` prop accepts 'onChange', 'onBlur', 'onFocus' or array. Per-rule trigger override supported |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Controlled values | ✅ | Native | `Form.useForm()` hook returns form instance with complete API: `getFieldValue`, `setFieldsValue`, `getFieldsValue`, `resetFields` |
| Uncontrolled values | ✅ | Native | Form manages internal state automatically. Can omit form instance for simple cases |
| Initial values | ✅ | Native | `initialValues` prop sets defaults on mount. Dynamic loading via `form.setFieldsValue()` after data fetch |
| Dynamic fields | ✅ | Native | `Form.List` component with render prop providing `add`, `remove`, `move` operations for array-based fields |
| Field dependencies | ✅ | Native | `dependencies={['fieldName']}` re-validates when dependencies change. `shouldUpdate` for complex conditional rendering |

## Layout Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Horizontal layout | ✅ | Native | `layout="horizontal"` (default) - labels beside fields with `labelCol` and `wrapperCol` grid control |
| Vertical layout | ✅ | Native | `layout="vertical"` - labels above fields, full-width inputs |
| Inline layout | ✅ | Native | `layout="inline"` - fields flow horizontally for compact forms (login, search) |
| Grid layout | ✅ | Composed | Use Ant Design Grid (`<Row gutter={16}>`, `<Col xs={24} sm={12}>`) with Form.Item for responsive multi-column layouts |
| Responsive layout | ✅ | Native | `labelCol` and `wrapperCol` accept responsive breakpoint objects: `{ xs: 24, sm: 12, md: 8 }` |

## Submission Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Submit handling | ✅ | Native | `onFinish` prop receives validated values on successful submit (replaces traditional onSubmit). Native HTML form submission supported |
| Loading state | ✅ | Composed | Manual loading state via `useState`. Apply to submit button's `loading` prop during async operations |
| Error handling | ✅ | Native | `onFinishFailed` receives validation errors. `form.setFields()` displays server-side validation errors |
| Success handling | ✅ | Composed | Handle in `onFinish` callback. Integrate with Ant Design `message` or `notification` components for user feedback |
| Reset functionality | ✅ | Native | `form.resetFields()` resets to initial values. Optional field name array to reset specific fields |

## Code Examples

### Primary Usage - Basic Form with Validation
```jsx
import { Form, Input, Button } from 'antd';

const App = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log('Form submitted:', values);
    // values = { username: 'john', email: 'john@example.com' }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Validation failed:', errorInfo);
  };

  return (
    <Form
      form={form}
      name="basic"
      layout="vertical"
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

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
        <Button htmlType="button" onClick={() => form.resetFields()} style={{ marginLeft: 8 }}>
          Reset
        </Button>
      </Form.Item>
    </Form>
  );
};
```
[View Live](https://ant.design/components/form#components-form-demo-basic)

### Async Validation with Debouncing
```jsx
<Form.Item
  name="username"
  label="Username"
  hasFeedback
  validateDebounce={500}
  rules={[
    { required: true, message: 'Please input username' },
    {
      validator: async (_, value) => {
        if (!value) return;

        // API call to check availability
        const response = await fetch(`/api/check-username?name=${value}`);
        const { available } = await response.json();

        if (!available) {
          throw new Error('Username already taken');
        }
      }
    }
  ]}
  validateTrigger="onBlur"
>
  <Input placeholder="Check availability on blur" />
</Form.Item>
```
[View Live](https://ant.design/components/form#components-form-demo-register)

### Field Dependencies - Password Confirmation
```jsx
<Form.Item
  label="Password"
  name="password"
  rules={[{ required: true, message: 'Please input your password!' }]}
>
  <Input.Password />
</Form.Item>

<Form.Item
  label="Confirm Password"
  name="confirm"
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
```
[View Live](https://ant.design/components/form#components-form-demo-register)

### Dynamic Fields with Form.List
```jsx
import { Form, Input, Button, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

<Form name="dynamic_form">
  <Form.List name="users">
    {(fields, { add, remove }) => (
      <>
        {fields.map(({ key, name, ...restField }) => (
          <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
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
          <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
            Add User
          </Button>
        </Form.Item>
      </>
    )}
  </Form.List>

  <Form.Item>
    <Button type="primary" htmlType="submit">
      Submit
    </Button>
  </Form.Item>
</Form>
```
[View Live](https://ant.design/components/form#components-form-demo-dynamic-form-item)

### Complex Layout - Nested Form.Item with noStyle
```jsx
// Multiple controls in one line with shared label
<Form.Item label="Username">
  <Form.Item
    name="username"
    noStyle
    rules={[{ required: true, message: 'Username is required' }]}
  >
    <Input style={{ width: 160 }} placeholder="Username" />
  </Form.Item>
  <span style={{ display: 'inline-block', width: 24, textAlign: 'center' }}>@</span>
  <Form.Item
    name="domain"
    noStyle
    rules={[{ required: true, message: 'Domain is required' }]}
  >
    <Input style={{ width: 160 }} placeholder="example.com" />
  </Form.Item>
</Form.Item>
```
[View Live](https://ant.design/components/form#components-form-demo-complex-form-control)

### Responsive Grid Layout
```jsx
import { Form, Input, Row, Col } from 'antd';

<Form layout="horizontal">
  <Row gutter={16}>
    <Col xs={24} sm={12}>
      <Form.Item
        label="First Name"
        name="firstName"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
    </Col>
    <Col xs={24} sm={12}>
      <Form.Item
        label="Last Name"
        name="lastName"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
    </Col>
  </Row>
  <Row gutter={16}>
    <Col xs={24}>
      <Form.Item
        label="Address"
        name="address"
      >
        <Input />
      </Form.Item>
    </Col>
  </Row>
</Form>
```
[View Live](https://ant.design/components/form#components-form-demo-layout)

### Form Instance Methods
```jsx
const [form] = Form.useForm();

// Get values
const username = form.getFieldValue('username');
const allValues = form.getFieldsValue();

// Set values
form.setFieldsValue({ username: 'john', email: 'john@example.com' });

// Validation
await form.validateFields();
await form.validateFields(['username', 'email']);

// Reset
form.resetFields();
form.resetFields(['username']);

// Error handling
form.setFields([
  { name: 'username', errors: ['Username already exists'] }
]);

// State checking
const hasError = form.getFieldError('email').length > 0;
const isValidating = form.isFieldValidating('username');
const isTouched = form.isFieldTouched('email');
```

### Async Submission with Loading State
```jsx
import { Form, Input, Button, message } from 'antd';
import { useState } from 'react';

const AsyncForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });

      if (!response.ok) throw new Error('Submission failed');

      message.success('Form submitted successfully');
      form.resetFields();
    } catch (error) {
      message.error('Failed to submit form');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} onFinish={onFinish}>
      <Form.Item name="username" label="Username" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </Button>
      </Form.Item>
    </Form>
  );
};
```

## Notable Features

### 1. RC-Field-Form Foundation
- Built on `rc-field-form` for framework-portable form logic
- Field-level updates without full form re-renders
- Sophisticated validation queue and dependency tracking

### 2. Field-Level Performance Optimization
- Only re-renders fields that have changed values
- Subscription model: fields subscribe to specific state slices
- Batch updates for multiple field changes

### 3. async-validator Integration
- 13+ built-in validation types (string, number, email, url, etc.)
- Deep path validation for nested objects/arrays
- Template-based message system with variable substitution
- Schema-based declarative validation

### 4. Flexible Validation Rules
- Declarative rules array with multiple validators per field
- Mix built-in validators with custom validator functions
- Promise-based async validation with automatic loading states
- `validateFirst` stops on first error for better UX
- `warningOnly` flag for non-blocking validation messages

### 5. Dynamic Form Building
- `Form.List` enables array-based fields with CRUD operations
- Operations: `add(defaultValue, index)`, `remove(index)`, `move(from, to)`
- Nested Form.List for complex nested data structures
- List-level validation via `rules` prop

### 6. Advanced State Management
- `Form.useWatch()` hook for reactive field value watching
- `onValuesChange` callback for value change tracking
- `onFieldsChange` callback for metadata changes (touched, validating, errors)
- `shouldUpdate` for complex conditional rendering optimization

### 7. Server-Side Integration
- `setFields()` method displays server-side validation errors
- Error/warning distinction via `errors` and `warnings` properties
- Field-level error state management
- Integration with backend validation responses

### 8. Scroll to First Error
- `scrollToFirstError` prop auto-scrolls to first validation error
- Configurable scroll behavior (smooth, instant) and position (center, start, end)
- Improves UX for long forms

### 9. Custom Validate Messages Template
```jsx
<Form
  validateMessages={{
    required: '${label} is required!',
    types: {
      email: '${label} is not a valid email!',
      number: '${label} is not a valid number!',
    },
    number: {
      range: '${label} must be between ${min} and ${max}',
    },
  }}
>
  {/* All fields use template messages */}
</Form>
```

### 10. Field Value Transformation
- `getValueFromEvent` extracts value from onChange event
- `normalize` transforms value before storage
- `getValueProps` formats value for display
- `trigger` specifies which event triggers value collection
- `valuePropName` customizes prop name (e.g., 'checked' for checkboxes)

### 11. Form.Provider for Multi-Form Coordination
- Coordinate state between multiple forms
- `onFormChange` callback for cross-form updates
- `onFormFinish` provides access to all forms in provider scope
- Useful for wizard-style multi-step forms

### 12. Built-in Accessibility
- Automatic ARIA attributes (aria-required, aria-invalid, aria-describedby)
- Label-input association via id/htmlFor
- Error message announcement for screen readers
- Keyboard navigation support (Tab, Shift+Tab, Enter, Space)

### 13. TypeScript Support
- Full generic type support for form values
- Type-safe field names and validation
- IntelliSense for form instance methods
- Type inference for `onFinish` callback values

### 14. Validation Debouncing
- `validateDebounce` prop (v5.9.0+) debounces async validation
- Reduces API calls for real-time validation
- Configurable per-field or globally

### 15. Required Mark Variants
- `requiredMark="optional"` shows "(optional)" for non-required fields
- Alternative to asterisk marking strategy
- Better UX for forms with mostly required fields

### 16. Preserve Field Values
- `preserve` prop controls value persistence when field unmounts
- Global form-level or per-field configuration
- Useful for conditional field rendering

### 17. Label Wrapping Control
- `labelWrap` prop allows long labels to wrap instead of truncate
- Better responsive behavior for complex label text
- Maintains accessibility with full label content

### 18. Validation Status Icons
- `hasFeedback` shows visual status icons (spinner, checkmark, x)
- Automatic loading indicator during async validation
- Success/error visual feedback

## Research Notes

### Accessing Documentation
- Ant Design uses React Server Components with heavy client-side rendering
- Documentation requires JavaScript to view full interactive examples
- API tables are well-organized with prop names, types, defaults, descriptions
- Live code examples are editable via CodeSandbox integration
- Examples demonstrate best practices and common patterns

### Framework Approach
**Design Philosophy:**
- **Wrapper-based pattern**: Each field wrapped in Form.Item for consistent presentation
- **Automatic binding**: `name` prop creates two-way data binding automatically
- **Centralized state**: Form instance holds all field state and validation
- **Declarative validation**: Rules defined in props rather than imperative checks
- **Composition over configuration**: Complex forms built from simple primitives

**Mental Model:**
- Form = State container + Validation orchestrator
- Form.Item = Field wrapper + Presentation layer
- Form.List = Dynamic array manager
- Form.Provider = Multi-form coordinator

### Implementation Details
**Architecture:**
- Built on `rc-field-form` (reusable React form library)
- Uses `async-validator` for validation rules
- React Context for form state distribution
- Subscription model for selective re-rendering
- WeakMap for field registration tracking

**Performance Characteristics:**
- Field isolation prevents unnecessary re-renders
- Batch updates for multiple value changes
- Memo-ization of field components
- Virtual list compatible for long forms
- Lazy validation (only dirty fields unless configured)

### Comparison to Other Libraries
**vs Formik:**
- More opinionated with built-in UI components
- Better performance for large forms (field-level updates)
- Tighter Ant Design integration
- Less verbose for simple cases
- More complex for non-Ant Design components

**vs react-hook-form:**
- More UI-focused (vs headless approach)
- Built-in validation instead of schema libraries
- Different performance strategy (context vs uncontrolled)
- Better integration with Ant Design ecosystem
- More declarative validation rules

**vs Basic HTML Forms:**
- Much more powerful validation
- Better UX with instant feedback
- Centralized state management
- Complex field dependencies
- Dynamic field support
- More JavaScript required

### Common Patterns
1. **Simple forms**: Use Form + Form.Item with `rules` array
2. **Complex forms**: Use `Form.useForm()` for programmatic control
3. **Dynamic forms**: Use `Form.List` for array fields with add/remove
4. **Layout control**: Combine with Grid or nested Form.Item with `noStyle`
5. **Async operations**: Handle in `onFinish`, loading state on submit button
6. **Multi-step forms**: Single form with conditional field rendering by step
7. **Real-time validation**: Use `validateTrigger="onChange"` with debouncing
8. **Server errors**: Use `form.setFields()` to display backend validation errors
9. **Form state persistence**: Use `onValuesChange` with localStorage
10. **Conditional fields**: Use `Form.useWatch()` or `shouldUpdate` for dependencies

### Edge Cases and Gotchas
1. **Initial values timing**: Must set `initialValues` on mount or use `setFieldsValue` after
2. **Preserve behavior**: Fields preserve values by default when conditionally rendered
3. **Name path**: Use array for nested fields: `name={['user', 'address', 'city']}`
4. **Form.List field key**: Always use `field.key` for React key, not index
5. **shouldUpdate performance**: Use sparingly as it re-renders on every change
6. **Async validator errors**: Must throw Error or return rejected Promise
7. **valuePropName**: Required for non-value props (e.g., `checked` for Switch)
8. **getFieldDecorator**: Deprecated v4 API, use Form.Item with name instead

### Best Practices
1. Use `Form.useForm()` for any programmatic control needs
2. Prefer `Form.useWatch()` over `shouldUpdate` for field watching
3. Set `validateTrigger="onBlur"` for expensive async validations
4. Use `validateDebounce` to reduce API calls
5. Always provide `key` for dynamic Form.List items
6. Use `noStyle` for layout control without extra DOM
7. Set `hasFeedback` for async validation to show loading state
8. Use `scrollToFirstError` for long forms
9. Prefer controlled components (let Form manage state)
10. Use TypeScript generics for type safety
