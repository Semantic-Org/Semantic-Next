# Ant Design Form - Usage Patterns

> Research Date: 2025-11-06
> Component URL: https://ant.design/components/form

## Component Overview

Ant Design's Form component provides a complete, production-ready form management system built for React applications. It combines field orchestration, validation, error handling, submission workflows, and layout management into a cohesive system. The Form component serves as the state container and coordinator, while Form.Item acts as the field wrapper that handles labels, validation messages, help text, and proper field registration. This architecture enables complex forms with cross-field dependencies, dynamic field arrays, asynchronous validation, and sophisticated error handling patterns.

**Mental Model**: Think of Form as an intelligent form orchestrator that manages a registry of fields, their values, validation state, and lifecycle. Form.Item acts as a smart wrapper that connects input components to the form's state management system while handling all presentation concerns (labels, errors, help text, layout spacing).

## Core Patterns

### Form State Management
- **Centralized State**: All field values stored in a single form instance
- **Field Registry**: Automatic registration/unregistration of fields via Form.Item
- **Validation Queue**: Manages validation execution order and dependencies
- **Value Normalization**: Supports field-level value transformation on input/output
- **Dirty Tracking**: Tracks which fields have been modified by user

### Form Architecture
- **Controller Pattern**: Form provides imperative API via `Form.useForm()` hook
- **Observer Pattern**: Fields subscribe to form state changes and re-render selectively
- **Compound Components**: Form, Form.Item, Form.List, Form.Provider work as a unified system
- **Incremental Updates**: Only changed fields re-render, not the entire form
- **Store Isolation**: Each form instance has isolated state (supports multiple forms per page)

### Integration Model
- **Input Agnostic**: Works with any component that accepts `value` and `onChange`
- **Composition-First**: Fields composed via children, not props
- **Controlled Fields**: Form manages all field values internally
- **React Integration**: Uses React Context and hooks for state management
- **Native Form Support**: Renders semantic HTML `<form>` element with proper submission handling

## Props & Configuration

### Form Component Props

#### Layout & Presentation
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `layout` | `'horizontal' \| 'vertical' \| 'inline'` | `'horizontal'` | Form layout orientation |
| `labelAlign` | `'left' \| 'right'` | `'right'` | Text alignment of labels (horizontal layout) |
| `labelCol` | `object` | - | Label grid column configuration (Col props) |
| `wrapperCol` | `object` | - | Input wrapper grid column configuration (Col props) |
| `labelWrap` | `boolean` | `false` | Whether labels wrap text instead of truncating |
| `colon` | `boolean` | `true` | Whether to display colon after label text |
| `requiredMark` | `boolean \| 'optional'` | `true` | Required field indicator strategy |
| `size` | `'small' \| 'middle' \| 'large'` | `'middle'` | Size preset for all form fields |

#### Form State & Control
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `form` | `FormInstance` | - | Form control instance from `Form.useForm()` |
| `initialValues` | `object` | - | Initial field values (only applied on mount) |
| `name` | `string` | - | Form name, used for Form.Provider communication |
| `preserve` | `boolean` | `true` | Keep field value when field is removed |
| `validateMessages` | `object` | - | Custom validation messages template |
| `validateTrigger` | `string \| string[]` | `'onChange'` | Global validation trigger timing |
| `disabled` | `boolean` | `false` | Disable all form fields |

#### Submission & Validation
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onFinish` | `(values) => void` | - | Callback on successful validation (replaces onSubmit) |
| `onFinishFailed` | `(errorInfo) => void` | - | Callback on failed validation |
| `onValuesChange` | `(changed, all) => void` | - | Callback when any field value changes |
| `onFieldsChange` | `(changed, all) => void` | - | Callback when field metadata changes (value, errors, touched) |
| `scrollToFirstError` | `boolean \| object` | `false` | Auto-scroll to first error field on submit |

#### Advanced Features
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `component` | `string \| false` | `'form'` | Form wrapper component (false for fragment) |
| `fields` | `FieldData[]` | - | Control entire form state externally (not recommended) |
| `validatePristine` | `boolean` | `false` | Validate untouched fields on mount |

## Form.Item Component

### Core Form.Item Props

#### Field Registration
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string \| string[]` | - | Field identifier for value storage (required for data binding) |
| `dependencies` | `NamePath[]` | - | Field dependencies that trigger re-validation |
| `shouldUpdate` | `boolean \| (prev, curr) => boolean` | `false` | Whether to re-render on any form value change |
| `getValueFromEvent` | `(...args) => any` | - | Extract value from onChange event (e.g., `e.target.value`) |
| `getValueProps` | `(value) => object` | - | Convert field value to component props |
| `normalize` | `(value, prevValue, allValues) => any` | - | Transform value before storing in form |
| `trigger` | `string` | `'onChange'` | Event name that triggers value collection |
| `valuePropName` | `string` | `'value'` | Prop name for value binding (e.g., 'checked' for checkboxes) |
| `preserve` | `boolean` | `true` | Keep field value when unmounted |

#### Presentation
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string \| ReactNode` | - | Field label content |
| `extra` | `string \| ReactNode` | - | Extra description below the field |
| `help` | `string \| ReactNode` | - | Custom help/error message (overrides validation messages) |
| `tooltip` | `string \| object` | - | Info tooltip next to label |
| `hidden` | `boolean` | `false` | Hide field but keep it in form state |
| `noStyle` | `boolean` | `false` | Render field without wrapper styling |
| `labelAlign` | `'left' \| 'right'` | - | Override form-level label alignment |
| `labelCol` | `object` | - | Override form-level label column |
| `wrapperCol` | `object` | - | Override form-level wrapper column |
| `colon` | `boolean` | - | Override form-level colon display |

#### Validation
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `rules` | `Rule[]` | - | Validation rules array |
| `validateTrigger` | `string \| string[]` | `'onChange'` | When to validate field |
| `validateFirst` | `boolean \| 'parallel'` | `false` | Stop validation on first error |
| `validateStatus` | `'success' \| 'warning' \| 'error' \| 'validating'` | - | Manual validation status override |
| `hasFeedback` | `boolean` | `false` | Show validation status icon |
| `required` | `boolean` | `false` | Display required mark (doesn't enforce validation) |
| `messageVariables` | `object` | - | Template variables for validation messages |

#### Layout & Styling
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | CSS class for wrapper |
| `style` | `CSSProperties` | - | Inline styles for wrapper |
| `htmlFor` | `string` | - | Custom id for label's htmlFor attribute |

## Validation Patterns

### Built-in Validation Rules

#### Rule Object Structure
```typescript
interface Rule {
  // Basic validation
  required?: boolean;
  message?: string;

  // Type validation
  type?: 'string' | 'number' | 'boolean' | 'method' | 'regexp' | 'integer' | 'float' |
         'array' | 'object' | 'enum' | 'date' | 'url' | 'hex' | 'email';

  // Length/Range validation
  len?: number;          // Exact length
  min?: number;          // Minimum value/length
  max?: number;          // Maximum value/length

  // Pattern validation
  pattern?: RegExp;      // Regular expression match

  // Advanced validation
  enum?: any[];          // Value must be in enum
  whitespace?: boolean;  // Fail if only whitespace
  transform?: (value) => any;  // Transform before validation

  // Custom validation
  validator?: (rule, value) => Promise<void>;
  asyncValidator?: (rule, value) => Promise<void>;

  // Conditional validation
  warningOnly?: boolean; // Show warning instead of error
}
```

#### Common Validation Patterns
```jsx
// Required field
<Form.Item
  name="username"
  rules={[{ required: true, message: 'Username is required' }]}
>
  <Input />
</Form.Item>

// Email validation
<Form.Item
  name="email"
  rules={[
    { required: true, message: 'Email is required' },
    { type: 'email', message: 'Invalid email format' }
  ]}
>
  <Input />
</Form.Item>

// Length constraints
<Form.Item
  name="password"
  rules={[
    { required: true },
    { min: 8, message: 'Password must be at least 8 characters' },
    { max: 32, message: 'Password cannot exceed 32 characters' }
  ]}
>
  <Input.Password />
</Form.Item>

// Pattern matching
<Form.Item
  name="phone"
  rules={[
    { pattern: /^\d{3}-\d{3}-\d{4}$/, message: 'Format: 555-555-5555' }
  ]}
>
  <Input placeholder="555-555-5555" />
</Form.Item>

// Custom synchronous validator
<Form.Item
  name="age"
  rules={[
    {
      validator: (_, value) => {
        if (value < 18) {
          return Promise.reject(new Error('Must be 18 or older'));
        }
        return Promise.resolve();
      }
    }
  ]}
>
  <InputNumber />
</Form.Item>

// Async validator (API check)
<Form.Item
  name="username"
  rules={[
    {
      validator: async (_, value) => {
        if (!value) return;

        const response = await fetch(`/api/check-username?name=${value}`);
        const { available } = await response.json();

        if (!available) {
          throw new Error('Username already taken');
        }
      }
    }
  ]}
  hasFeedback
  validateDebounce={500}
>
  <Input />
</Form.Item>

// Warning instead of error
<Form.Item
  name="confirmEmail"
  rules={[
    {
      warningOnly: true,
      validator: (_, value) => {
        if (value && !value.includes('+')) {
          return Promise.reject('Consider using + addressing for email filtering');
        }
        return Promise.resolve();
      }
    }
  ]}
>
  <Input />
</Form.Item>

// Stop on first error
<Form.Item
  name="password"
  validateFirst
  rules={[
    { required: true, message: 'Required' },
    { min: 8, message: 'Min 8 characters' },
    { pattern: /[A-Z]/, message: 'Needs uppercase' },
    { pattern: /[0-9]/, message: 'Needs number' }
  ]}
>
  <Input.Password />
</Form.Item>

// Run validators in parallel
<Form.Item
  name="email"
  validateFirst="parallel"
  rules={[
    { type: 'email', message: 'Invalid format' },
    {
      asyncValidator: async (_, value) => {
        // Check if email exists
      }
    }
  ]}
>
  <Input />
</Form.Item>
```

### Field Dependencies

#### Basic Dependency Validation
```jsx
<Form.Item
  name="password"
  rules={[{ required: true }]}
>
  <Input.Password />
</Form.Item>

<Form.Item
  name="confirmPassword"
  dependencies={['password']}
  rules={[
    { required: true },
    ({ getFieldValue }) => ({
      validator(_, value) {
        if (!value || getFieldValue('password') === value) {
          return Promise.resolve();
        }
        return Promise.reject(new Error('Passwords must match'));
      }
    })
  ]}
>
  <Input.Password />
</Form.Item>
```

#### Multiple Dependencies
```jsx
<Form.Item
  name="finalPrice"
  dependencies={['price', 'taxRate', 'discount']}
  rules={[
    ({ getFieldValue }) => ({
      validator() {
        const price = getFieldValue('price') || 0;
        const taxRate = getFieldValue('taxRate') || 0;
        const discount = getFieldValue('discount') || 0;
        const calculated = price * (1 + taxRate) - discount;

        if (calculated < 0) {
          return Promise.reject('Final price cannot be negative');
        }
        return Promise.resolve();
      }
    })
  ]}
>
  <InputNumber prefix="$" />
</Form.Item>
```

### Validation Timing

#### Trigger Configuration
```jsx
// Validate on blur only
<Form.Item
  name="email"
  validateTrigger="onBlur"
  rules={[{ type: 'email' }]}
>
  <Input />
</Form.Item>

// Multiple triggers
<Form.Item
  name="password"
  validateTrigger={['onChange', 'onBlur']}
  rules={[{ min: 8 }]}
>
  <Input.Password />
</Form.Item>

// Different triggers for different rules
<Form.Item
  name="username"
  rules={[
    { required: true, validateTrigger: 'onBlur' },
    { min: 3, validateTrigger: 'onChange' },
    {
      asyncValidator: checkAvailability,
      validateTrigger: 'onBlur'
    }
  ]}
>
  <Input />
</Form.Item>
```

## Layout Patterns

### Horizontal Layout (Default)
```jsx
<Form
  layout="horizontal"
  labelCol={{ span: 6 }}
  wrapperCol={{ span: 18 }}
>
  <Form.Item label="Username" name="username">
    <Input />
  </Form.Item>
  <Form.Item label="Email" name="email">
    <Input />
  </Form.Item>
</Form>
```

### Vertical Layout
```jsx
<Form layout="vertical">
  <Form.Item label="Username" name="username">
    <Input />
  </Form.Item>
  <Form.Item label="Email" name="email">
    <Input />
  </Form.Item>
</Form>
```

### Inline Layout
```jsx
<Form layout="inline">
  <Form.Item name="username">
    <Input placeholder="Username" />
  </Form.Item>
  <Form.Item name="password">
    <Input.Password placeholder="Password" />
  </Form.Item>
  <Form.Item>
    <Button type="primary" htmlType="submit">
      Log in
    </Button>
  </Form.Item>
</Form>
```

### Responsive Grid Layout
```jsx
<Form>
  <Row gutter={16}>
    <Col xs={24} sm={12}>
      <Form.Item label="First Name" name="firstName">
        <Input />
      </Form.Item>
    </Col>
    <Col xs={24} sm={12}>
      <Form.Item label="Last Name" name="lastName">
        <Input />
      </Form.Item>
    </Col>
  </Row>
  <Row gutter={16}>
    <Col xs={24}>
      <Form.Item label="Address" name="address">
        <Input />
      </Form.Item>
    </Col>
  </Row>
</Form>
```

### Custom Label Alignment
```jsx
<Form
  layout="horizontal"
  labelAlign="left"
  labelCol={{ span: 8 }}
  wrapperCol={{ span: 16 }}
>
  <Form.Item label="Username" name="username">
    <Input />
  </Form.Item>

  {/* Override for specific field */}
  <Form.Item
    label="Bio"
    name="bio"
    labelCol={{ span: 24 }}
    wrapperCol={{ span: 24 }}
  >
    <Input.TextArea rows={4} />
  </Form.Item>
</Form>
```

## Field Management

### Dynamic Fields with Form.List

#### Basic Dynamic List
```jsx
<Form.List name="users">
  {(fields, { add, remove }) => (
    <>
      {fields.map(({ key, name, ...restField }) => (
        <Space key={key} style={{ display: 'flex', marginBottom: 8 }}>
          <Form.Item
            {...restField}
            name={[name, 'firstName']}
            rules={[{ required: true, message: 'Missing first name' }]}
          >
            <Input placeholder="First Name" />
          </Form.Item>
          <Form.Item
            {...restField}
            name={[name, 'lastName']}
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
```

#### Nested Dynamic Fields
```jsx
<Form.List name="categories">
  {(categoryFields, categoryOps) => (
    <>
      {categoryFields.map(categoryField => (
        <div key={categoryField.key}>
          <Form.Item
            name={[categoryField.name, 'name']}
            label="Category Name"
          >
            <Input />
          </Form.Item>

          <Form.List name={[categoryField.name, 'items']}>
            {(itemFields, itemOps) => (
              <>
                {itemFields.map(itemField => (
                  <Form.Item
                    key={itemField.key}
                    name={[itemField.name, 'title']}
                    label="Item Title"
                  >
                    <Input />
                  </Form.Item>
                ))}
                <Button onClick={() => itemOps.add()}>Add Item</Button>
              </>
            )}
          </Form.List>

          <Button onClick={() => categoryOps.remove(categoryField.name)}>
            Remove Category
          </Button>
        </div>
      ))}
      <Button onClick={() => categoryOps.add()}>Add Category</Button>
    </>
  )}
</Form.List>
```

#### List Operations
```jsx
<Form.List name="items">
  {(fields, { add, remove, move }) => (
    <>
      {fields.map((field, index) => (
        <div key={field.key}>
          <Form.Item {...field} name={[field.name, 'value']}>
            <Input />
          </Form.Item>

          <Button onClick={() => remove(field.name)}>Delete</Button>
          <Button onClick={() => move(index, index - 1)}>Move Up</Button>
          <Button onClick={() => move(index, index + 1)}>Move Down</Button>
        </div>
      ))}

      <Button onClick={() => add()}>Add to End</Button>
      <Button onClick={() => add({value: 'default'}, 0)}>Add to Start</Button>
    </>
  )}
</Form.List>
```

### Conditional Fields

#### Show/Hide Fields
```jsx
const [form] = Form.useForm();
const userType = Form.useWatch('userType', form);

<Form form={form}>
  <Form.Item name="userType" label="User Type">
    <Select>
      <Select.Option value="individual">Individual</Select.Option>
      <Select.Option value="business">Business</Select.Option>
    </Select>
  </Form.Item>

  {userType === 'individual' && (
    <Form.Item name="ssn" label="SSN">
      <Input />
    </Form.Item>
  )}

  {userType === 'business' && (
    <Form.Item name="taxId" label="Tax ID">
      <Input />
    </Form.Item>
  )}
</Form>
```

#### shouldUpdate for Complex Dependencies
```jsx
<Form.Item noStyle shouldUpdate={(prev, curr) => prev.country !== curr.country}>
  {({ getFieldValue }) => {
    const country = getFieldValue('country');

    return (
      <Form.Item
        name="state"
        label="State/Province"
        rules={[{ required: true }]}
      >
        <Select options={getStatesForCountry(country)} />
      </Form.Item>
    );
  }}
</Form.Item>
```

## Submission Patterns

### Basic Form Submission
```jsx
const [form] = Form.useForm();

const onFinish = (values) => {
  console.log('Form values:', values);
  // values = { username: 'john', email: 'john@example.com', ... }
};

const onFinishFailed = (errorInfo) => {
  console.log('Validation failed:', errorInfo);
  // errorInfo = {
  //   values: { username: 'john', email: 'invalid' },
  //   errorFields: [{ name: ['email'], errors: ['Invalid email'] }],
  //   outOfDate: false
  // }
};

<Form
  form={form}
  onFinish={onFinish}
  onFinishFailed={onFinishFailed}
>
  <Form.Item name="username" rules={[{ required: true }]}>
    <Input />
  </Form.Item>
  <Form.Item name="email" rules={[{ type: 'email' }]}>
    <Input />
  </Form.Item>
  <Form.Item>
    <Button type="primary" htmlType="submit">
      Submit
    </Button>
  </Form.Item>
</Form>
```

### Async Submission with Loading State
```jsx
const [loading, setLoading] = useState(false);

const onFinish = async (values) => {
  setLoading(true);
  try {
    const response = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values)
    });

    if (!response.ok) {
      throw new Error('Submission failed');
    }

    message.success('Form submitted successfully');
    form.resetFields();
  } catch (error) {
    message.error('Failed to submit form');
  } finally {
    setLoading(false);
  }
};

<Form form={form} onFinish={onFinish}>
  {/* fields */}
  <Form.Item>
    <Button type="primary" htmlType="submit" loading={loading}>
      Submit
    </Button>
  </Form.Item>
</Form>
```

### Manual Validation and Submission
```jsx
const [form] = Form.useForm();

const handleSubmit = async () => {
  try {
    const values = await form.validateFields();
    console.log('Valid values:', values);
    // Submit to API
  } catch (errorInfo) {
    console.log('Validation failed:', errorInfo);
  }
};

const handleValidateSpecificFields = async () => {
  try {
    const values = await form.validateFields(['username', 'email']);
    console.log('Validated fields:', values);
  } catch (errorInfo) {
    console.log('Validation failed:', errorInfo);
  }
};

<Form form={form}>
  {/* fields */}
  <Button onClick={handleSubmit}>Manual Submit</Button>
  <Button onClick={handleValidateSpecificFields}>Validate Specific</Button>
</Form>
```

### Scroll to First Error
```jsx
<Form
  scrollToFirstError={{
    behavior: 'smooth',
    block: 'center'
  }}
  onFinish={onFinish}
>
  {/* Many fields */}
</Form>
```

## State Management

### Form Instance API

#### Getting Form Instance
```jsx
// Option 1: Form.useForm hook
const [form] = Form.useForm();

<Form form={form}>
  {/* fields */}
</Form>

// Option 2: Ref (class components)
class MyForm extends React.Component {
  formRef = React.createRef();

  render() {
    return <Form ref={this.formRef}>{/* fields */}</Form>
  }
}
```

#### Reading Values
```jsx
const [form] = Form.useForm();

// Get single field value
const username = form.getFieldValue('username');

// Get nested field value
const city = form.getFieldValue(['address', 'city']);

// Get all values
const allValues = form.getFieldsValue();

// Get specific fields
const subset = form.getFieldsValue(['username', 'email']);

// Get with filtering
const touched = form.getFieldsValue(true); // only touched fields

// Get field error
const errors = form.getFieldError('email');
// Returns: ['Invalid email format']

// Get all errors
const allErrors = form.getFieldsError();
// Returns: [
//   { name: ['email'], errors: ['Invalid email'] },
//   { name: ['password'], errors: ['Too short'] }
// ]
```

#### Setting Values
```jsx
const [form] = Form.useForm();

// Set single field
form.setFieldValue('username', 'john');

// Set nested field
form.setFieldValue(['address', 'city'], 'New York');

// Set multiple fields
form.setFieldsValue({
  username: 'john',
  email: 'john@example.com',
  address: {
    city: 'New York',
    zip: '10001'
  }
});
```

#### Resetting Form
```jsx
// Reset all fields to initial values
form.resetFields();

// Reset specific fields
form.resetFields(['username', 'email']);

// Reset to new values
form.resetFields();
form.setFieldsValue({ username: 'new-default' });
```

#### Validation Control
```jsx
// Validate all fields
form.validateFields()
  .then(values => console.log('Valid:', values))
  .catch(errorInfo => console.log('Errors:', errorInfo));

// Validate specific fields
form.validateFields(['email', 'password']);

// Check if field has error
const hasError = form.getFieldError('email').length > 0;

// Check if form is validating
const isValidating = form.isFieldValidating('username');

// Check if field is touched
const isTouched = form.isFieldTouched('email');

// Check if any field is touched
const anyTouched = form.isFieldsTouched();

// Check if all fields are touched
const allTouched = form.isFieldsTouched(true);

// Check if fields have been modified
const isModified = form.isFieldsTouched(['username', 'email'], true); // all specified
```

#### Error Management
```jsx
// Set field error manually
form.setFields([
  {
    name: 'username',
    errors: ['Username already exists']
  }
]);

// Set multiple field errors
form.setFields([
  {
    name: 'username',
    errors: ['Too short'],
    value: 'jo'
  },
  {
    name: 'email',
    errors: ['Invalid format']
  }
]);

// Set field warnings
form.setFields([
  {
    name: 'password',
    warnings: ['Password is weak']
  }
]);
```

### Form State Watching

#### Form.useWatch Hook
```jsx
function MyForm() {
  const [form] = Form.useForm();

  // Watch single field
  const username = Form.useWatch('username', form);

  // Watch nested field
  const city = Form.useWatch(['address', 'city'], form);

  // Watch all values
  const allValues = Form.useWatch([], form);

  return (
    <Form form={form}>
      <Form.Item name="username">
        <Input />
      </Form.Item>

      <div>Current username: {username}</div>
    </Form>
  );
}
```

#### onValuesChange Callback
```jsx
<Form
  onValuesChange={(changedValues, allValues) => {
    console.log('Changed:', changedValues);
    // { username: 'new-value' }

    console.log('All values:', allValues);
    // { username: 'new-value', email: 'old@example.com' }
  }}
>
  {/* fields */}
</Form>
```

#### onFieldsChange Callback
```jsx
<Form
  onFieldsChange={(changedFields, allFields) => {
    console.log('Changed fields:', changedFields);
    // [{
    //   name: ['username'],
    //   value: 'john',
    //   touched: true,
    //   validating: false,
    //   errors: []
    // }]

    console.log('All fields:', allFields);
  }}
>
  {/* fields */}
</Form>
```

### Initial Values

#### Setting Initial Values
```jsx
<Form
  initialValues={{
    username: 'john',
    email: 'john@example.com',
    remember: true,
    address: {
      city: 'New York',
      zip: '10001'
    }
  }}
>
  {/* fields */}
</Form>
```

#### Dynamic Initial Values
```jsx
function EditForm({ userId }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser(userId).then(user => {
      form.setFieldsValue({
        username: user.name,
        email: user.email,
        bio: user.bio
      });
      setLoading(false);
    });
  }, [userId, form]);

  return (
    <Spin spinning={loading}>
      <Form form={form}>
        {/* fields */}
      </Form>
    </Spin>
  );
}
```

## Advanced Features

### Field Value Transformation

#### getValueFromEvent
```jsx
// Extract file from upload event
<Form.Item
  name="avatar"
  getValueFromEvent={(e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  }}
>
  <Upload>
    <Button>Upload</Button>
  </Upload>
</Form.Item>

// Extract checked value from Switch
<Form.Item
  name="enabled"
  valuePropName="checked"
  getValueFromEvent={(checked) => checked}
>
  <Switch />
</Form.Item>
```

#### normalize
```jsx
// Convert to uppercase
<Form.Item
  name="code"
  normalize={(value) => value.toUpperCase()}
>
  <Input />
</Form.Item>

// Remove non-numeric characters
<Form.Item
  name="phone"
  normalize={(value) => value.replace(/\D/g, '')}
>
  <Input />
</Form.Item>

// Limit number range
<Form.Item
  name="quantity"
  normalize={(value, prevValue) => {
    const num = parseInt(value, 10);
    if (isNaN(num)) return prevValue;
    return Math.max(1, Math.min(100, num));
  }}
>
  <InputNumber />
</Form.Item>
```

#### getValueProps
```jsx
// Format display value
<Form.Item
  name="price"
  getValueProps={(value) => ({
    value: value ? `$${value}` : ''
  })}
  getValueFromEvent={(e) => {
    const value = e.target.value.replace(/\$\s?/g, '');
    return parseFloat(value) || 0;
  }}
>
  <Input />
</Form.Item>
```

### Custom Form Controls

#### Wrapping Third-Party Components
```jsx
// Wrap non-standard component to work with Form.Item
function PriceInput({ value = {}, onChange }) {
  const [number, setNumber] = useState(value.number || 0);
  const [currency, setCurrency] = useState(value.currency || 'USD');

  const triggerChange = (changedValue) => {
    onChange?.({
      number,
      currency,
      ...value,
      ...changedValue
    });
  };

  return (
    <span>
      <Input
        type="number"
        value={number}
        onChange={(e) => {
          const newNumber = parseFloat(e.target.value);
          setNumber(newNumber);
          triggerChange({ number: newNumber });
        }}
        style={{ width: 100 }}
      />
      <Select
        value={currency}
        onChange={(newCurrency) => {
          setCurrency(newCurrency);
          triggerChange({ currency: newCurrency });
        }}
        style={{ width: 80, marginLeft: 8 }}
      >
        <Select.Option value="USD">$</Select.Option>
        <Select.Option value="EUR">€</Select.Option>
        <Select.Option value="GBP">£</Select.Option>
      </Select>
    </span>
  );
}

// Usage in form
<Form.Item
  name="price"
  label="Price"
  rules={[
    {
      validator: (_, value) => {
        if (value.number > 0) {
          return Promise.resolve();
        }
        return Promise.reject(new Error('Price must be greater than 0'));
      }
    }
  ]}
>
  <PriceInput />
</Form.Item>
```

### Form.Provider for Multiple Forms

#### Coordinating Multiple Forms
```jsx
<Form.Provider
  onFormChange={(name, info) => {
    console.log(`Form ${name} changed:`, info);
  }}
  onFormFinish={(name, { values, forms }) => {
    console.log(`Form ${name} finished:`, values);

    // Access other forms
    const otherForm = forms.otherFormName;
    const otherValues = otherForm.getFieldsValue();
  }}
>
  <Form name="form1">
    {/* fields */}
  </Form>

  <Form name="form2">
    {/* fields */}
  </Form>
</Form.Provider>
```

### Custom Validation Messages

#### Global Message Template
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
    string: {
      len: '${label} must be exactly ${len} characters',
      min: '${label} must be at least ${min} characters',
      max: '${label} cannot exceed ${max} characters',
    }
  }}
>
  <Form.Item
    name="email"
    label="Email"
    rules={[{ type: 'email', required: true }]}
  >
    <Input />
  </Form.Item>
</Form>
```

#### Field-Level Message Variables
```jsx
<Form.Item
  name="username"
  label="Username"
  messageVariables={{ name: 'Username' }}
  rules={[
    { required: true, message: '${name} is required' },
    { min: 3, message: '${name} must be at least ${min} characters' }
  ]}
>
  <Input />
</Form.Item>
```

### Preserve Field Values

#### Controlling Value Preservation
```jsx
// Global preservation (default: true)
<Form preserve={false}>
  {/* When fields unmount, values are removed */}
</Form>

// Per-field preservation
<Form.Item
  name="conditionalField"
  preserve={false}
>
  <Input />
</Form.Item>
```

### No Style Mode

#### Embedding Fields Without Wrapper
```jsx
<Form.Item label="Price">
  <Form.Item name="price" noStyle>
    <InputNumber />
  </Form.Item>
  <span style={{ marginLeft: 8 }}>USD</span>
</Form.Item>

// Common pattern: Inline grouped fields
<Form.Item label="Date Range">
  <Input.Group compact>
    <Form.Item name="startDate" noStyle>
      <DatePicker />
    </Form.Item>
    <Form.Item name="endDate" noStyle>
      <DatePicker />
    </Form.Item>
  </Input.Group>
</Form.Item>
```

## Accessibility

### Built-in Accessibility Features

#### Automatic ARIA Attributes
- **aria-required**: Automatically added when field has `required` rule
- **aria-invalid**: Added when field has validation errors
- **aria-describedby**: Links field to help text and error messages
- **id/htmlFor**: Automatic label-input association

#### Label Association
```jsx
<Form.Item
  label="Email"
  name="email"
  // Automatically generates:
  // <label for="email">Email</label>
  // <input id="email" aria-label="Email" ... />
>
  <Input />
</Form.Item>
```

#### Custom htmlFor
```jsx
<Form.Item
  label="Email"
  name="email"
  htmlFor="custom-email-id"
>
  <Input id="custom-email-id" />
</Form.Item>
```

#### Error Message Announcement
```jsx
<Form.Item
  name="email"
  rules={[{ type: 'email', message: 'Please enter a valid email' }]}
  // Error message automatically linked via aria-describedby
>
  <Input />
</Form.Item>
```

### Keyboard Support

#### Built-in Keyboard Navigation
- **Tab**: Move between form fields
- **Shift+Tab**: Move backwards
- **Enter**: Submit form (when button is focused)
- **Space**: Toggle checkboxes/switches

#### Focus Management
```jsx
const [form] = Form.useForm();

// Focus first field
useEffect(() => {
  form.getFieldInstance('username')?.focus();
}, [form]);

// Focus field on error
const onFinishFailed = ({ errorFields }) => {
  form.scrollToField(errorFields[0].name, {
    behavior: 'smooth',
    block: 'center'
  });
  form.getFieldInstance(errorFields[0].name)?.focus();
};
```

### Screen Reader Support

#### Help Text and Extra Content
```jsx
<Form.Item
  label="Password"
  name="password"
  extra="Must be at least 8 characters with uppercase, lowercase, and numbers"
  help={errors.length > 0 ? errors[0] : undefined}
  // extra and help are both announced by screen readers
>
  <Input.Password />
</Form.Item>
```

#### Tooltip Information
```jsx
<Form.Item
  label="API Key"
  name="apiKey"
  tooltip={{
    title: "You can find your API key in the account settings",
    icon: <InfoCircleOutlined />
  }}
  // Tooltip icon is keyboard accessible and announced
>
  <Input />
</Form.Item>
```

## Framework-Specific Features

### 1. RC-Field-Form Foundation
Ant Design Form is built on `rc-field-form`, a standalone React form library. This architecture enables:
- **Framework Portability**: Core logic independent of Ant Design
- **Performance Optimization**: Field-level updates without full form re-renders
- **Advanced State Management**: Sophisticated validation queue and dependency tracking

### 2. Form Store Architecture
- **Centralized Store**: Single store per form instance manages all field states
- **Subscription Model**: Fields subscribe to specific state slices
- **Change Detection**: Selective re-rendering based on actual changes
- **Batch Updates**: Multiple field changes trigger single update cycle

### 3. async-validator Integration
Deep integration with `async-validator` library provides:
- **Rich Rule Types**: 13+ built-in validation types
- **Deep Path Validation**: Nested object/array validation
- **Custom Messages**: Template-based message system with variable substitution
- **Schema Validation**: Declarative validation rules

### 4. Field Optimization Patterns

#### Incremental Rendering
```jsx
// Only username field re-renders when its value changes
<Form.Item name="username">
  <Input />
</Form.Item>

// Email field does not re-render
<Form.Item name="email">
  <Input />
</Form.Item>
```

#### Selective Updates with shouldUpdate
```jsx
// Re-render only when specific field changes
<Form.Item
  shouldUpdate={(prev, curr) => prev.country !== curr.country}
  noStyle
>
  {({ getFieldValue }) => {
    const country = getFieldValue('country');
    return (
      <Form.Item name="state">
        <Select options={getStatesFor(country)} />
      </Form.Item>
    );
  }}
</Form.Item>
```

### 5. Form.List Advanced Features

#### List Operations API
```jsx
<Form.List name="items">
  {(fields, operations, meta) => {
    // operations = { add, remove, move }
    // meta = { errors: [] }

    return (
      <>
        {fields.map(field => (
          <div key={field.key}>
            {/* field.key: Unique key for React */}
            {/* field.name: Index in array */}
            {/* field.fieldKey: Field identifier */}
            <Form.Item {...field} name={[field.name, 'value']}>
              <Input />
            </Form.Item>
          </div>
        ))}

        {meta.errors.length > 0 && (
          <Alert message={meta.errors} type="error" />
        )}
      </>
    );
  }}
</Form.List>
```

### 6. Context-Based Configuration

#### ConfigProvider Integration
```jsx
import { ConfigProvider, Form } from 'antd';

<ConfigProvider
  form={{
    validateMessages: {
      required: '${label} is required!',
    },
    requiredMark: 'optional',
    colon: false
  }}
>
  <Form>
    {/* All forms inherit these settings */}
  </Form>
</ConfigProvider>
```

### 7. Form Hook Patterns

#### useForm with External State
```jsx
const [form] = Form.useForm();

// External state management
useEffect(() => {
  const subscription = store.subscribe(() => {
    const storeData = store.getState().formData;
    form.setFieldsValue(storeData);
  });

  return () => subscription.unsubscribe();
}, [form, store]);
```

### 8. Validation Timing Optimization

#### validateDebounce (v5.9.0+)
```jsx
<Form.Item
  name="search"
  validateDebounce={500}
  rules={[
    {
      asyncValidator: async (_, value) => {
        const result = await checkAvailability(value);
        if (!result.available) {
          throw new Error('Not available');
        }
      }
    }
  ]}
>
  <Input />
</Form.Item>
```

### 9. Enhanced Type Safety

#### TypeScript Integration
```typescript
interface FormValues {
  username: string;
  email: string;
  age: number;
}

const [form] = Form.useForm<FormValues>();

const onFinish = (values: FormValues) => {
  // values is fully typed
  console.log(values.username); // string
  console.log(values.age); // number
};

<Form<FormValues>
  form={form}
  onFinish={onFinish}
>
  <Form.Item<FormValues>
    name="username"
    rules={[{ required: true }]}
  >
    <Input />
  </Form.Item>
</Form>
```

### 10. Required Mark Variants

#### Optional Mark Pattern
```jsx
// Show "(optional)" instead of asterisk for required
<Form requiredMark="optional">
  <Form.Item label="Username" name="username" required>
    <Input />
  </Form.Item>

  <Form.Item label="Bio" name="bio">
    {/* Shows "(optional)" */}
    <Input.TextArea />
  </Form.Item>
</Form>
```

### 11. Label Wrapping Control

#### labelWrap Feature
```jsx
<Form
  labelCol={{ span: 8 }}
  labelWrap
  // Long labels wrap instead of being truncated
>
  <Form.Item label="Very Long Field Label That Would Normally Truncate">
    <Input />
  </Form.Item>
</Form>
```

### 12. Validation Status Icons

#### hasFeedback Visual Indicators
```jsx
<Form.Item
  name="username"
  rules={[
    {
      asyncValidator: checkUsernameAvailability
    }
  ]}
  hasFeedback
  // Shows spinning icon while validating
  // Shows checkmark on success
  // Shows x icon on error
>
  <Input />
</Form.Item>
```

## Implementation Notes

### Architecture Design

#### Component Hierarchy
```
Form (State Container)
  └─ FormContext.Provider
      ├─ Form.Item (Field Wrapper)
      │   ├─ Label
      │   ├─ Field (cloneElement with value/onChange)
      │   ├─ Help Text / Error Messages
      │   └─ Extra Content
      ├─ Form.List (Dynamic Fields Manager)
      │   └─ Field Array Operations
      └─ Form.Provider (Multi-Form Coordinator)
```

#### State Flow
```
User Input
  ↓
onChange Event
  ↓
Form Store Update
  ↓
Validation Trigger (if configured)
  ↓
Field Re-render (selective)
  ↓
onValuesChange / onFieldsChange Callbacks
```

### API Design Philosophy

#### Declarative Configuration
- **Rules as Data**: Validation rules defined as JSON-like objects
- **Composition Over Configuration**: Complex forms built from simple primitives
- **Sensible Defaults**: Minimal code for common use cases

#### Progressive Disclosure
- **Basic Use**: Simple props for 80% of use cases
- **Advanced Use**: Hooks and APIs for complex scenarios
- **Escape Hatches**: Full control when needed (shouldUpdate, noStyle)

### Performance Characteristics

#### Rendering Optimization
- **Field Isolation**: Each Form.Item subscribes only to its own state
- **Memo-ization**: Internal use of React.memo for field components
- **Batch Updates**: Multiple value changes trigger single render cycle
- **Virtual List Support**: Compatible with rc-virtual-list for long forms

#### Validation Performance
- **Debounced Async**: Built-in debouncing for async validators
- **validateFirst**: Short-circuit validation on first error
- **Parallel Validation**: Multiple rules can validate concurrently
- **Lazy Validation**: Only validates dirty fields unless configured otherwise

### Integration Patterns

#### Form State Persistence
```jsx
// Save form state to localStorage
const onValuesChange = (_, allValues) => {
  localStorage.setItem('formDraft', JSON.stringify(allValues));
};

// Restore on mount
const initialValues = JSON.parse(
  localStorage.getItem('formDraft') || '{}'
);

<Form
  initialValues={initialValues}
  onValuesChange={onValuesChange}
>
  {/* fields */}
</Form>
```

#### Multi-Step Forms
```jsx
function MultiStepForm() {
  const [current, setCurrent] = useState(0);
  const [form] = Form.useForm();

  const next = async () => {
    try {
      await form.validateFields(getFieldsForStep(current));
      setCurrent(current + 1);
    } catch (error) {
      console.log('Validation failed:', error);
    }
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  return (
    <>
      <Steps current={current}>
        <Steps.Step title="Personal" />
        <Steps.Step title="Address" />
        <Steps.Step title="Confirmation" />
      </Steps>

      <Form form={form}>
        {current === 0 && <PersonalFields />}
        {current === 1 && <AddressFields />}
        {current === 2 && <Confirmation />}

        <div>
          {current > 0 && <Button onClick={prev}>Previous</Button>}
          {current < 2 && <Button onClick={next}>Next</Button>}
          {current === 2 && <Button htmlType="submit">Submit</Button>}
        </div>
      </Form>
    </>
  );
}
```

#### Form with URL State
```jsx
function SearchForm() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [form] = Form.useForm();

  // Sync URL to form
  useEffect(() => {
    form.setFieldsValue({
      query: searchParams.get('q'),
      category: searchParams.get('cat')
    });
  }, [searchParams, form]);

  // Sync form to URL
  const onValuesChange = (_, allValues) => {
    setSearchParams({
      q: allValues.query,
      cat: allValues.category
    });
  };

  return (
    <Form form={form} onValuesChange={onValuesChange}>
      {/* fields */}
    </Form>
  );
}
```

### Common Patterns and Best Practices

#### Avoid Over-Validation
```jsx
// ❌ Bad: Validates on every keystroke for expensive checks
<Form.Item
  name="username"
  validateTrigger="onChange"
  rules={[{ asyncValidator: expensiveApiCheck }]}
>
  <Input />
</Form.Item>

// ✅ Good: Validates on blur with debounce
<Form.Item
  name="username"
  validateTrigger="onBlur"
  validateDebounce={500}
  rules={[{ asyncValidator: expensiveApiCheck }]}
>
  <Input />
</Form.Item>
```

#### Prefer Controlled Components
```jsx
// ✅ Good: Form manages state
<Form.Item name="username">
  <Input />
</Form.Item>

// ❌ Avoid: Manual state management
const [username, setUsername] = useState('');
<Form.Item>
  <Input value={username} onChange={e => setUsername(e.target.value)} />
</Form.Item>
```

#### Use shouldUpdate Sparingly
```jsx
// ❌ Expensive: Re-renders on every form change
<Form.Item shouldUpdate>
  {({ getFieldValue }) => (
    <div>{getFieldValue('username')}</div>
  )}
</Form.Item>

// ✅ Efficient: Only watches specific field
const username = Form.useWatch('username', form);
<div>{username}</div>
```

### Version Compatibility

#### Major Features by Version
- **v4.19.0**: Added `status` prop for error/warning states
- **v4.20.0**: Added `validateDebounce` for async validation
- **v5.0.0**: Improved TypeScript types, removed IE11 support
- **v5.1.0**: Enhanced Form.List with better error handling
- **v5.9.0**: Added global `validateDebounce` configuration

### Known Limitations

#### Initial Values Timing
```jsx
// ❌ Won't work: initialValues set after mount
<Form initialValues={asyncData}>

// ✅ Works: Use setFieldsValue after data loads
useEffect(() => {
  if (data) {
    form.setFieldsValue(data);
  }
}, [data, form]);
```

#### Preserve Behavior
```jsx
// Watch out: Field values preserved by default
// when conditionally rendered
{showField && (
  <Form.Item name="conditional" preserve={false}>
    <Input />
  </Form.Item>
)}
```

#### Class Component Support
```jsx
// Limited hook support in class components
// Use Form.create() HOC for class components (legacy pattern)
```

### Testing Considerations

#### Testing Form Validation
```jsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('validates email format', async () => {
  render(<MyForm />);

  const emailInput = screen.getByLabelText('Email');
  await userEvent.type(emailInput, 'invalid-email');
  await userEvent.tab(); // Trigger blur

  await waitFor(() => {
    expect(screen.getByText('Invalid email format')).toBeInTheDocument();
  });
});
```

#### Testing Form Submission
```jsx
test('submits form with valid data', async () => {
  const onFinish = jest.fn();
  render(<MyForm onFinish={onFinish} />);

  await userEvent.type(screen.getByLabelText('Username'), 'john');
  await userEvent.type(screen.getByLabelText('Email'), 'john@example.com');
  await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

  await waitFor(() => {
    expect(onFinish).toHaveBeenCalledWith({
      username: 'john',
      email: 'john@example.com'
    });
  });
});
```
