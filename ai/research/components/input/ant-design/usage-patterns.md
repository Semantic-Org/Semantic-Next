# Ant Design Input - Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://ant.design/components/input
Status: ✅ Working
Version: 5.21.0+ (Current)
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - Excellent API documentation with detailed property descriptions, interactive code examples, and comprehensive design guidance.

## Component Definition
- **Core purpose**: Provides flexible text input with support for multiple input types, size variants, state management, prefix/suffix elements, and character counting.
- **Mental model**: A semantic text input control that layers modifiers (size, prefix/suffix, disabled, error states) to create contextually appropriate data entry fields.
- **Semantic meaning**: Communicates input type, availability (disabled), validation status (error), and optional/required state through visual and structural patterns.

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `size="large"`, `prefix={icon}`, `maxLength`)
- **Composed**: Via composition/children (e.g., wrapping with `InputGroup`, combining with labels)
- **CSS-only**: Requires custom styling (e.g., custom border colors beyond presets)

---

## Component Overview

The Ant Design Input component is a versatile text input field that extends HTML's native input with:
- Multiple input types (text, password, number, email, URL, etc.)
- Visual size variants (large, middle, small)
- Prefix and suffix content (icons, text, buttons)
- Character counting and length validation
- Error states and help text integration
- Controlled and uncontrolled modes
- Disabled and read-only states
- Auto-sizing variants for text areas

---

## Basic Usage

### Simple Text Input
```jsx
import { Input } from 'antd';

// Basic input
<Input placeholder="Enter text" />

// With default value
<Input defaultValue="Initial value" />

// Controlled input
const [value, setValue] = useState('');
<Input value={value} onChange={(e) => setValue(e.target.value)} />
```

### Input Types
```jsx
// Text input (default)
<Input type="text" placeholder="Text input" />

// Password input
<Input type="password" placeholder="Password" />

// Number input
<Input type="number" placeholder="Number" />

// Email input
<Input type="email" placeholder="Email" />

// URL input
<Input type="url" placeholder="URL" />

// Telephone
<Input type="tel" placeholder="Phone number" />

// Search
<Input type="search" placeholder="Search..." />

// Date/Time
<Input type="date" />
<Input type="time" />
<Input type="datetime-local" />
```

---

## Props/API

### State Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | Controlled value (use with onChange) |
| `defaultValue` | `string` | - | Initial value for uncontrolled input |
| `placeholder` | `string` | - | Placeholder text |
| `disabled` | `boolean` | `false` | Disables interaction |
| `readOnly` | `boolean` | `false` | Read-only (no editing, can still focus/copy) |
| `status` | `'error' \| 'warning' \| ''` | - | Validation status (empty for normal) |

### Size & Appearance

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'large' \| 'middle' \| 'small'` | `'middle'` | Visual size variant |
| `variant` | `'outlined' \| 'filled' \| 'borderless'` | `'outlined'` | Border style variant (v5.13.0+) |
| `allowClear` | `boolean` | `false` | Shows clear button when focused with content |
| `showCount` | `boolean \| object` | `false` | Shows character count. Object: `{formatter: (info) => string}` |

### Content Integration

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `prefix` | `ReactNode` | - | Element before input text (usually icon) |
| `suffix` | `ReactNode` | - | Element after input text (usually icon or count) |
| `addonBefore` | `ReactNode` | - | Element before input (outside border) |
| `addonAfter` | `ReactNode` | - | Element after input (outside border) |

### Length & Validation

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `maxLength` | `number` | - | Maximum character length |
| `minLength` | `number` | - | Minimum character length |
| `pattern` | `string` | - | Regex pattern for validation |
| `required` | `boolean` | `false` | Required field indicator |

### Behavior

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `string` | `'text'` | HTML input type (text, password, number, email, etc.) |
| `inputMode` | `'text' \| 'none' \| 'decimal' \| 'numeric' \| 'tel' \| 'search' \| 'email' \| 'url'` | - | Mobile keyboard type hint |
| `autoComplete` | `'on' \| 'off' \| string` | `'off'` | Autocomplete hint (password, email, etc.) |
| `autoFocus` | `boolean` | `false` | Focus on mount |
| `spellCheck` | `boolean` | - | Enable spell check |
| `enterKeyHint` | `'enter' \| 'done' \| 'go' \| 'next' \| 'previous' \| 'search' \| 'send'` | - | Mobile enter key hint |

### Styling

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | CSS class |
| `style` | `CSSProperties` | - | Inline styles |
| `classNames` | `{ root?: string, input?: string, prefix?: string, suffix?: string, addonBefore?: string, addonAfter?: string }` | - | Semantic class names (v5.13.0+) |

### Events

| Event | Type | Description |
|-------|------|-------------|
| `onChange` | `(e: ChangeEvent<HTMLInputElement>) => void` | Fired on value change |
| `onBlur` | `(e: FocusEvent<HTMLInputElement>) => void` | Fired on blur |
| `onFocus` | `(e: FocusEvent<HTMLInputElement>) => void` | Fired on focus |
| `onPressEnter` | `(e: KeyboardEvent<HTMLInputElement>) => void` | Fired when Enter key pressed |
| `onKeyDown` | `(e: KeyboardEvent<HTMLInputElement>) => void` | Fired on key down |
| `onKeyUp` | `(e: KeyboardEvent<HTMLInputElement>) => void` | Fired on key up |

---

## Common Patterns

### Pattern Category 1: Basic Text Capture

#### Simple Text Entry
```jsx
<Input placeholder="Enter username" />
```

#### Controlled Text Input
```jsx
const [username, setUsername] = useState('');

<Input
  value={username}
  onChange={(e) => setUsername(e.target.value)}
  placeholder="Enter username"
/>
```

#### Text Input with Default Value
```jsx
<Input
  defaultValue="default text"
  placeholder="Enter text"
/>
```

---

### Pattern Category 2: Input with Icons/Prefix/Suffix

#### Search Input with Icon
```jsx
import { SearchOutlined } from '@ant-design/icons';

<Input
  prefix={<SearchOutlined />}
  placeholder="Search..."
/>
```

#### Input with Clear Button
```jsx
<Input
  allowClear
  placeholder="Type to clear"
/>
```

#### Input with Unit Suffix
```jsx
import { DollarOutlined } from '@ant-design/icons';

<Input
  prefix={<DollarOutlined />}
  placeholder="Amount"
/>
```

#### Email Input with Icon
```jsx
import { MailOutlined } from '@ant-design/icons';

<Input
  type="email"
  prefix={<MailOutlined />}
  placeholder="Enter email"
/>
```

#### Input with Button Addon
```jsx
import { Button } from 'antd';
import { SendOutlined } from '@ant-design/icons';

<Input.Group compact>
  <Input placeholder="Message" />
  <Button type="primary" icon={<SendOutlined />} />
</Input.Group>
```

#### URL Input with Copy Button
```jsx
import { Button } from 'antd';
import { CopyOutlined } from '@ant-design/icons';

const [url, setUrl] = useState('https://example.com');

<Input
  value={url}
  suffix={
    <Button
      type="text"
      icon={<CopyOutlined />}
      onClick={() => navigator.clipboard.writeText(url)}
    />
  }
/>
```

---

### Pattern Category 3: Character Count & Length Validation

#### With Character Count
```jsx
<Input
  placeholder="Maximum 100 characters"
  maxLength={100}
  showCount
/>
```

#### Custom Count Formatter
```jsx
<Input
  maxLength={100}
  showCount={{ formatter: (info) => `${info.value.length} / 100` }}
/>
```

#### Length Validation
```jsx
<Input
  minLength={8}
  maxLength={16}
  placeholder="Username (8-16 characters)"
  status={value.length < 8 ? 'error' : ''}
/>
```

---

### Pattern Category 4: Password Inputs

#### Simple Password Field
```jsx
<Input.Password placeholder="Enter password" />
```

#### Password with Strength Indicator
```jsx
const [password, setPassword] = useState('');

const getStrength = () => {
  if (password.length < 6) return 'weak';
  if (!/[A-Z]/.test(password)) return 'fair';
  return 'strong';
};

<>
  <Input.Password
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    placeholder="Create password"
  />
  <p>Strength: {getStrength()}</p>
</>
```

#### Confirm Password Validation
```jsx
const [password, setPassword] = useState('');
const [confirm, setConfirm] = useState('');

<>
  <Input.Password
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    placeholder="Password"
  />
  <Input.Password
    value={confirm}
    onChange={(e) => setConfirm(e.target.value)}
    placeholder="Confirm password"
    status={confirm && password !== confirm ? 'error' : ''}
  />
</>
```

---

### Pattern Category 5: State & Validation

#### Error State
```jsx
<Input
  status="error"
  placeholder="Invalid input"
/>
```

#### Warning State
```jsx
<Input
  status="warning"
  placeholder="Check this value"
/>
```

#### Disabled Input
```jsx
<Input
  disabled
  value="Cannot edit"
/>
```

#### Read-Only Input
```jsx
<Input
  readOnly
  value="View only"
/>
```

#### With Error Message
```jsx
<>
  <Input
    status={error ? 'error' : ''}
    value={value}
    onChange={(e) => setValue(e.target.value)}
  />
  {error && <p style={{ color: 'red' }}>{error}</p>}
</>
```

---

### Pattern Category 6: Size Variants

#### Large Input
```jsx
<Input
  size="large"
  placeholder="Large input"
/>
```

#### Medium Input (Default)
```jsx
<Input
  size="middle"
  placeholder="Medium input (default)"
/>
```

#### Small Input
```jsx
<Input
  size="small"
  placeholder="Small input"
/>
```

#### Size in Form Context
```jsx
import { Form } from 'antd';

<Form>
  <Form.Item label="Large">
    <Input size="large" />
  </Form.Item>
  <Form.Item label="Medium">
    <Input size="middle" />
  </Form.Item>
  <Form.Item label="Small">
    <Input size="small" />
  </Form.Item>
</Form>
```

---

### Pattern Category 7: Variant Styles

#### Outlined Variant (Default)
```jsx
<Input
  variant="outlined"
  placeholder="Outlined input"
/>
```

#### Filled Variant
```jsx
<Input
  variant="filled"
  placeholder="Filled input"
/>
```

#### Borderless Variant
```jsx
<Input
  variant="borderless"
  placeholder="Borderless input"
/>
```

#### Mixed Variants
```jsx
<>
  <Input variant="outlined" placeholder="Outlined" />
  <Input variant="filled" placeholder="Filled" />
  <Input variant="borderless" placeholder="Borderless" />
</>
```

---

### Pattern Category 8: Form Integration

#### Form Field Integration
```jsx
import { Form, Input, Button } from 'antd';

<Form
  layout="vertical"
  onFinish={(values) => console.log(values)}
>
  <Form.Item
    label="Username"
    name="username"
    rules={[{ required: true, message: 'Required' }]}
  >
    <Input placeholder="Enter username" />
  </Form.Item>

  <Form.Item
    label="Email"
    name="email"
    rules={[{ type: 'email', message: 'Invalid email' }]}
  >
    <Input type="email" />
  </Form.Item>

  <Button type="primary" htmlType="submit">
    Submit
  </Button>
</Form>
```

#### Custom Validation
```jsx
<Form.Item
  label="Username"
  name="username"
  rules={[
    { required: true },
    { min: 3, message: 'At least 3 characters' },
    { max: 20, message: 'Maximum 20 characters' },
    {
      pattern: /^[a-zA-Z0-9_]+$/,
      message: 'Only letters, numbers, and underscore'
    }
  ]}
>
  <Input />
</Form.Item>
```

---

### Pattern Category 9: Input Groups & Combinations

#### Input Group with Addon
```jsx
import { Button } from 'antd';

<Input.Group compact>
  <Input style={{ width: 'calc(100% - 200px)' }} placeholder="Message" />
  <Button type="primary">Send</Button>
</Input.Group>
```

#### Search with Button
```jsx
import { SearchOutlined } from '@ant-design/icons';

<Input.Group compact>
  <Input placeholder="Search..." />
  <Button type="primary" icon={<SearchOutlined />} />
</Input.Group>
```

#### Input with Select
```jsx
import { Select } from 'antd';

<Input.Group compact>
  <Select defaultValue="USD" style={{ width: 100 }}>
    <Select.Option value="USD">USD</Select.Option>
    <Select.Option value="EUR">EUR</Select.Option>
  </Select>
  <Input placeholder="Amount" style={{ width: 'calc(100% - 100px)' }} />
</Input.Group>
```

---

### Pattern Category 10: Special Input Types

#### Number Input
```jsx
<Input
  type="number"
  min="0"
  max="100"
  step="1"
  placeholder="Enter number"
/>
```

#### Date Input
```jsx
<Input
  type="date"
/>
```

#### Time Input
```jsx
<Input
  type="time"
/>
```

#### Color Input
```jsx
<Input
  type="color"
/>
```

#### Range Input
```jsx
<Input
  type="range"
  min="0"
  max="100"
  step="10"
/>
```

---

### Pattern Category 11: Controlled vs Uncontrolled

#### Uncontrolled (Use defaultValue)
```jsx
<Input defaultValue="initial" />
```

#### Controlled (Use value + onChange)
```jsx
const [value, setValue] = useState('');

<Input
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

#### Mixed Pattern (Recommended for Forms)
```jsx
const [formData, setFormData] = useState({ username: '', email: '' });

<>
  <Input
    value={formData.username}
    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
    placeholder="Username"
  />
  <Input
    type="email"
    value={formData.email}
    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
    placeholder="Email"
  />
</>
```

---

### Pattern Category 12: Accessibility Patterns

#### With Label Association
```jsx
<>
  <label htmlFor="username">Username</label>
  <Input id="username" placeholder="Enter username" />
</>
```

#### With Help Text
```jsx
<>
  <Input
    id="password"
    type="password"
    placeholder="Enter password"
    aria-describedby="password-hint"
  />
  <p id="password-hint">At least 8 characters with uppercase and numbers</p>
</>
```

#### With Error Association
```jsx
const [error, setError] = useState('');

<>
  <Input
    id="email"
    type="email"
    aria-describedby={error ? 'email-error' : undefined}
    aria-invalid={!!error}
  />
  {error && <p id="email-error" style={{ color: 'red' }}>{error}</p>}
</>
```

#### Required Field Indicator
```jsx
<>
  <label>
    <span>Email</span>
    <span style={{ color: 'red' }}>*</span>
  </label>
  <Input type="email" required />
</>
```

---

### Pattern Category 13: Event Handling

#### On Change with Validation
```jsx
const handleChange = (e) => {
  const value = e.target.value;
  // Real-time validation
  if (value.length < 3) {
    setError('Minimum 3 characters');
  } else {
    setError('');
  }
};

<Input onChange={handleChange} />
```

#### On Blur Validation
```jsx
const handleBlur = (e) => {
  const value = e.target.value;
  // Validate only on blur
  if (!value) {
    setError('This field is required');
  }
};

<Input onBlur={handleBlur} />
```

#### On Enter Submission
```jsx
const handlePressEnter = (e) => {
  console.log('Enter pressed:', e.target.value);
  // Auto-submit or trigger search
};

<Input onPressEnter={handlePressEnter} />
```

#### Debounced Search
```jsx
import { debounce } from 'lodash';

const handleSearch = debounce((value) => {
  // Perform search API call
  console.log('Searching for:', value);
}, 300);

<Input onChange={(e) => handleSearch(e.target.value)} />
```

---

### Pattern Category 14: Dynamic Input Features

#### Auto-Growing TextArea
```jsx
import { Input } from 'antd';

<Input.TextArea
  placeholder="Auto-growing textarea"
  autoSize={{ minRows: 2, maxRows: 6 }}
/>
```

#### Clear Button Integration
```jsx
const [value, setValue] = useState('');

<Input
  value={value}
  onChange={(e) => setValue(e.target.value)}
  allowClear
  onClear={() => setValue('')}
/>
```

#### Disabled Based on Condition
```jsx
<Input
  disabled={!formComplete}
  placeholder="Complete form to enable"
/>
```

#### Dynamic Suffix
```jsx
const [value, setValue] = useState('');

<Input
  value={value}
  onChange={(e) => setValue(e.target.value)}
  suffix={value ? `${value.length}/100` : null}
/>
```

---

### Pattern Category 15: Prefix/Suffix Combinations

#### Currency Input
```jsx
import { DollarOutlined } from '@ant-design/icons';

<Input
  type="number"
  prefix={<DollarOutlined />}
  placeholder="0.00"
/>
```

#### Phone Number
```jsx
import { PhoneOutlined } from '@ant-design/icons';

<Input
  type="tel"
  prefix={<PhoneOutlined />}
  placeholder="123-456-7890"
/>
```

#### URL with Copy
```jsx
import { LinkOutlined, CopyOutlined } from '@ant-design/icons';

const [url, setUrl] = useState('https://example.com');

<Input
  value={url}
  prefix={<LinkOutlined />}
  suffix={
    <CopyOutlined
      onClick={() => navigator.clipboard.writeText(url)}
      style={{ cursor: 'pointer' }}
    />
  }
/>
```

#### User Icon with Account Status
```jsx
import { UserOutlined, CheckOutlined } from '@ant-design/icons';

<Input
  value={username}
  prefix={<UserOutlined />}
  suffix={isAvailable ? <CheckOutlined style={{ color: 'green' }} /> : null}
/>
```

---

## Visual Variations

### Size System
- **Large** (`size="large"`): 40px height, 12px font, larger padding
- **Middle** (`size="middle"`): 32px height, 14px font, standard padding (default)
- **Small** (`size="small"`): 24px height, 12px font, reduced padding

### Variant System
- **Outlined** (`variant="outlined"`): Visible border, background transparent
- **Filled** (`variant="filled"`): Subtle filled background, no border
- **Borderless** (`variant="borderless"`): No visible border or background (v5.13.0+)

### State Variations
- **Normal**: Standard appearance, ready for input
- **Focused**: Border/outline highlight, optional shadow
- **Disabled**: Reduced opacity, no-cursor, no interaction
- **Read-only**: Visual indication no editing possible
- **Error** (`status="error"`): Red border/text, danger color
- **Warning** (`status="warning"`): Orange/yellow border/text, warning color

---

## States

### Disabled State
```jsx
<Input
  disabled
  value="Cannot modify"
/>
```

Effects:
- Reduced opacity (typically 0.6)
- Cursor changes to not-allowed
- No focus effects
- No interaction possible

### Read-Only State
```jsx
<Input
  readOnly
  value="View only but copyable"
/>
```

Effects:
- Can still be focused and text copied
- Cannot be edited
- Cursor shows text selection

### Error State
```jsx
<Input
  status="error"
  value="Invalid value"
/>
```

Visual indicators:
- Red/danger border color
- Red text for status message
- Often paired with error message below

### Warning State
```jsx
<Input
  status="warning"
  value="Check this"
/>
```

Visual indicators:
- Orange/yellow border color
- Warning icon or text
- Less severe than error

### Focused State
```jsx
// Automatic on focus
<Input onFocus={() => console.log('focused')} />
```

Visual indicators:
- Border color highlight
- Optional shadow/glow effect
- Focus ring (for accessibility)

---

## Validation Patterns

### HTML5 Validation
```jsx
<Input
  type="email"
  required
  pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"
/>
```

### Form-Level Validation
```jsx
import { Form } from 'antd';

<Form.Item
  name="username"
  rules={[
    { required: true, message: 'Username required' },
    { min: 3, message: 'Minimum 3 characters' },
    { max: 20, message: 'Maximum 20 characters' },
    {
      pattern: /^[a-zA-Z0-9_]+$/,
      message: 'Only alphanumeric and underscore'
    }
  ]}
>
  <Input />
</Form.Item>
```

### Real-Time Validation
```jsx
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const [email, setEmail] = useState('');
const [isValid, setIsValid] = useState(true);

<Input
  type="email"
  value={email}
  onChange={(e) => {
    setEmail(e.target.value);
    setIsValid(validateEmail(e.target.value));
  }}
  status={!isValid && email ? 'error' : ''}
/>
```

### Custom Async Validation
```jsx
const checkUsernameAvailability = async (username) => {
  const response = await fetch(`/api/check-username/${username}`);
  return response.ok;
};

<Form.Item
  name="username"
  rules={[
    { required: true },
    {
      validator: async (_, value) => {
        if (!value) return Promise.resolve();
        const available = await checkUsernameAvailability(value);
        if (available) return Promise.resolve();
        return Promise.reject(new Error('Username taken'));
      }
    }
  ]}
>
  <Input />
</Form.Item>
```

---

## Label & Placeholder Patterns

### Placeholder Text
```jsx
<Input placeholder="Type your message here..." />
```

Best practices:
- Concise, hints without overwhelming
- Gray color to distinguish from input
- Should not replace labels

### Associated Labels
```jsx
<label htmlFor="email">Email Address</label>
<Input id="email" type="email" />
```

### Required Field Indicators
```jsx
<label>
  Email
  <span style={{ color: 'red' }}> *</span>
</label>
<Input type="email" required />
```

### Help Text Below Input
```jsx
<>
  <Input type="password" />
  <small>Minimum 8 characters, include uppercase and numbers</small>
</>
```

### Inline Labels
```jsx
<Input
  prefix="https://"
  placeholder="example.com"
/>
```

---

## Prefix & Suffix Patterns

### Icon Prefix
```jsx
import { SearchOutlined, UserOutlined, MailOutlined } from '@ant-design/icons';

<Input prefix={<SearchOutlined />} placeholder="Search..." />
<Input prefix={<UserOutlined />} placeholder="Username" />
<Input prefix={<MailOutlined />} type="email" />
```

### Text Prefix
```jsx
<Input prefix="$" type="number" placeholder="Amount" />
<Input prefix="https://" placeholder="Domain" />
```

### Icon Suffix
```jsx
import { EyeOutlined, CheckOutlined } from '@ant-design/icons';

<Input suffix={<EyeOutlined />} type="text" />
<Input suffix={<CheckOutlined style={{ color: 'green' }} />} />
```

### Button Suffix
```jsx
import { Button } from 'antd';

<Input
  suffix={<Button type="text">Clear</Button>}
/>
```

### Count Suffix
```jsx
<Input
  maxLength={100}
  showCount
/>
```

---

## Input Types

### Text Input (Default)
```jsx
<Input type="text" placeholder="Enter text" />
```

### Password Input
```jsx
<Input.Password placeholder="Enter password" />
// or
<Input type="password" />
```

### Number Input
```jsx
<Input type="number" min="0" max="100" />
```

### Email Input
```jsx
<Input type="email" placeholder="user@example.com" />
```

### URL Input
```jsx
<Input type="url" placeholder="https://example.com" />
```

### Telephone Input
```jsx
<Input type="tel" placeholder="123-456-7890" />
```

### Date Input
```jsx
<Input type="date" />
```

### Time Input
```jsx
<Input type="time" />
```

### Color Input
```jsx
<Input type="color" />
```

### Search Input
```jsx
<Input type="search" placeholder="Search..." />
```

### Textarea (Multi-line)
```jsx
<Input.TextArea
  placeholder="Enter multiple lines"
  rows={4}
/>
```

### Textarea with Auto-Grow
```jsx
<Input.TextArea
  placeholder="Auto-growing"
  autoSize={{ minRows: 2, maxRows: 6 }}
/>
```

---

## Accessibility

### ARIA Patterns

#### Label Association
```jsx
<label htmlFor="username">Username</label>
<Input id="username" />
```

#### Describedby for Help Text
```jsx
<Input
  id="password"
  aria-describedby="pwd-hint"
  type="password"
/>
<p id="pwd-hint">At least 8 characters</p>
```

#### Error Association
```jsx
<Input
  id="email"
  aria-invalid={!!error}
  aria-describedby={error ? 'email-error' : undefined}
/>
{error && <p id="email-error">{error}</p>}
```

#### Required Field
```jsx
<Input
  id="name"
  aria-required="true"
  required
/>
```

#### Readonly
```jsx
<Input
  readOnly
  aria-readonly="true"
/>
```

#### Disabled
```jsx
<Input
  disabled
  aria-disabled="true"
/>
```

### Keyboard Navigation

| Key | Action |
|-----|--------|
| `Tab` | Move focus to/from input |
| `Shift+Tab` | Move focus backward |
| `Space` | In some input types, specific behavior |
| `Enter` | Trigger onPressEnter callback |
| `Escape` | Clear input if allowClear enabled |

### Screen Reader Support

- Label associated via `<label for>` is automatically announced
- `aria-label` as fallback when no visible label
- Input type announced (text, email, password, etc.)
- Status (error, warning, disabled) should be associated via aria-describedby
- Character count helpful when `showCount` enabled

### Focus Management

- Visible focus indicator (outline, border highlight)
- Focus ring sufficient contrast (WCAG AA)
- `:focus-visible` for keyboard-only focus
- No focus trap (unless intentional)

---

## Integration Patterns

### With Form Component
```jsx
import { Form, Input, Button } from 'antd';

<Form
  layout="vertical"
  onFinish={async (values) => {
    await submitForm(values);
  }}
>
  <Form.Item
    label="Username"
    name="username"
    required
    rules={[
      { required: true, message: 'Please enter username' },
      { min: 3, message: 'Minimum 3 characters' }
    ]}
  >
    <Input placeholder="Enter username" />
  </Form.Item>

  <Button type="primary" htmlType="submit">
    Register
  </Button>
</Form>
```

### With Form Libraries (React Hook Form)
```jsx
import { useForm, Controller } from 'react-hook-form';
import { Input } from 'antd';

const { control, handleSubmit } = useForm();

<form onSubmit={handleSubmit(onSubmit)}>
  <Controller
    name="email"
    control={control}
    rules={{ required: 'Email required' }}
    render={({ field, fieldState: { error } }) => (
      <>
        <Input
          {...field}
          type="email"
          status={error ? 'error' : ''}
        />
        {error && <p>{error.message}</p>}
      </>
    )}
  />
</form>
```

### With Validation Library (Zod)
```jsx
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Minimum 8 characters')
});

const { register, formState: { errors } } = useForm({
  resolver: zodResolver(schema)
});

<Input
  {...register('email')}
  type="email"
  status={errors.email ? 'error' : ''}
/>
```

### In Table Search
```jsx
import { Input, Table } from 'antd';

const [searchText, setSearchText] = useState('');

<>
  <Input.Search
    placeholder="Search table..."
    onSearch={setSearchText}
  />
  <Table
    dataSource={data.filter(item =>
      item.name.includes(searchText)
    )}
  />
</>
```

---

## Advanced Patterns

### Character Counter with Validation
```jsx
const [value, setValue] = useState('');
const maxLength = 100;
const isLongEnough = value.length >= 10;

<>
  <Input
    value={value}
    onChange={(e) => setValue(e.target.value)}
    maxLength={maxLength}
    status={isLongEnough ? '' : 'warning'}
    suffix={`${value.length}/${maxLength}`}
  />
  {!isLongEnough && (
    <p>At least 10 characters required</p>
  )}
</>
```

### Input with Verification
```jsx
const [email, setEmail] = useState('');
const [verified, setVerified] = useState(false);

const handleVerify = async () => {
  const isValid = await verifyEmail(email);
  setVerified(isValid);
};

<>
  <Input
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    suffix={
      <Button
        type="text"
        onClick={handleVerify}
      >
        Verify
      </Button>
    }
    status={verified ? '' : email ? 'error' : ''}
  />
</>
```

### Password Strength Meter
```jsx
const calculateStrength = (password) => {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;
  return strength;
};

const [password, setPassword] = useState('');
const strength = calculateStrength(password);

<>
  <Input.Password
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />
  <div style={{ marginTop: 8 }}>
    Strength: {['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'][strength]}
  </div>
</>
```

### Auto-Complete Integration
```jsx
import { Input, AutoComplete } from 'antd';

const [options, setOptions] = useState([]);

<AutoComplete
  options={options}
  onSearch={(value) => {
    // Fetch suggestions
    const suggestions = data.filter(item =>
      item.includes(value)
    );
    setOptions(suggestions.map(s => ({ value: s })));
  }}
>
  <Input placeholder="Search with suggestions..." />
</AutoComplete>
```

### Masked Input (Phone)
```jsx
const formatPhone = (value) => {
  return value
    .replace(/\D/g, '')
    .slice(0, 10)
    .replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
};

const [phone, setPhone] = useState('');

<Input
  value={phone}
  onChange={(e) => setPhone(formatPhone(e.target.value))}
  placeholder="(123) 456-7890"
/>
```

---

## Notes

### Important Implementation Considerations

1. **Controlled vs Uncontrolled**: Choose based on needs:
   - Uncontrolled (defaultValue): Simple cases, better performance
   - Controlled (value + onChange): Complex logic, real-time validation

2. **Accessibility First**: Always provide associated labels, either via `<label>` or `aria-label`. Placeholders alone are insufficient.

3. **Validation Timing**:
   - Real-time for UX (show error as user types)
   - On-blur for performance (validate only when leaving field)
   - On-submit for final validation

4. **Clear Button**: Use `allowClear` for optional fields, improves UX on mobile.

5. **Prefix/Suffix Icons**: Keep semantic and intuitive. Use `aria-label` on icons if needed.

6. **Form Integration**: Ant Design Form component handles validation, errors, and layout. Strongly recommended over manual management.

7. **Size Consistency**: Match size to surrounding context (size="large" for emphasized forms, size="small" for dense layouts).

8. **Autocomplete Security**: Disable on sensitive fields like passwords: `autoComplete="off"`.

9. **Mobile Considerations**:
   - Use `inputMode` for correct mobile keyboard
   - `enterKeyHint` for mobile enter key behavior
   - Ensure touch target is 44px+ minimum

10. **Performance**: For large forms, consider useCallback for handlers to prevent unnecessary re-renders.

11. **Error Messages**: Keep clear and actionable. "Invalid email" is better than "Error".

12. **TextArea**: Use `autoSize` for dynamic height instead of fixed `rows` for better UX.

### Browser Compatibility Notes

- Input component works on all modern browsers
- Password visibility toggle (Input.Password) available since Ant Design v4.20
- Variant prop (filled, borderless) added in v5.13.0
- CSS-in-JS styling ensures consistent appearance across browsers
- HTML5 input types (email, number, date) have varying support, provide fallback validation

### Performance Patterns

- Use `debounce` on onChange for expensive operations (API calls, calculations)
- Consider `useMemo` for complex validation logic
- Use controlled components only when necessary (uncontrolled when possible)
- Lazy-load dependent fields to reduce initial render

### TypeScript Support

All props are fully typed. Key types:
- `value: string | number`
- `onChange: (e: ChangeEvent<HTMLInputElement>) => void`
- `status: 'error' | 'warning' | ''`
- `size: 'large' | 'middle' | 'small'`
- `variant: 'outlined' | 'filled' | 'borderless'`

---

## Summary

The Ant Design Input component is a comprehensive, accessible, and feature-rich text input solution. It excels in:
- **Flexibility**: Multiple types, sizes, variants, and states
- **Developer Experience**: Comprehensive API, great documentation, Form integration
- **Accessibility**: ARIA support, keyboard navigation, label association
- **Visual Consistency**: Theming via CSS-in-JS, semantic design tokens
- **Performance**: Optimized rendering, efficient state management

Perfect for applications requiring robust, production-ready form inputs with extensive customization options.
