# Ant Design - Input.Password Usage Patterns

## Component URL
https://ant.design/components/input/#Password
Status: ✅ Working
Version: 5.x (suffix prop supported from v5.27.0)
Last Verified: 2025-11-05

## Documentation Quality
The Ant Design Input.Password documentation is moderately comprehensive but somewhat fragmented. The component is documented as part of the larger Input component family, which makes finding password-specific features require careful reading. The documentation provides practical code examples and covers the main props, but lacks detailed accessibility information and comprehensive pattern coverage. TypeScript definitions in the source code provide additional clarity on prop types and interfaces. Overall, the documentation serves practical implementation needs but could benefit from more explicit accessibility guidance and edge case documentation.

## Component Definition
- **Core purpose**: Provides a specialized text input for password entry with built-in visibility toggle functionality, allowing users to securely enter passwords while optionally revealing the input to verify correctness.
- **Mental model**: A text input that defaults to masking characters, with an integrated toggle button (typically an eye icon) that switches between masked and visible states. The component manages the visual security of password entry while maintaining standard input functionality.
- **Semantic meaning**: Communicates a secure, sensitive text input field specifically designed for password or confidential data entry, with user-controlled visibility for verification purposes.

## Pattern Support Levels
- **Native**: Features built directly into the Input.Password component through dedicated props and internal implementation (e.g., visibilityToggle, iconRender, password masking). These work out-of-the-box without additional configuration.
- **Composed**: Patterns achieved by combining Input.Password with other Ant Design components (e.g., wrapping in Form.Item for validation, combining with Space for layout, using with Tooltip for hints). These leverage the component ecosystem.
- **CSS-only**: Styling customizations applied through className, style props, or CSS variables without changing component logic (e.g., custom colors, spacing, borders). Limited by Ant Design's design system constraints.

## Core Patterns

### Visibility Control
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Default toggle button | ✅ | Native | Eye icon toggle enabled by default (`visibilityToggle: true`) |
| Disable toggle | ✅ | Native | Set `visibilityToggle={false}` to remove toggle button |
| Controlled visibility | ✅ | Native | Object form `visibilityToggle={{ visible, onVisibleChange }}` for external control |
| Custom toggle icons | ✅ | Native | `iconRender={(visible) => ReactNode}` for custom icon rendering |
| Click toggle | ✅ | Native | Default behavior (`action: 'click'`) |
| Hover toggle | ✅ | Native | Alternative behavior (`action: 'hover'`) for mouseover interaction |

### Input Variants
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size variants | ✅ | Native | `size="large"` (40px), `size="default"` (32px), `size="small"` (24px) |
| Disabled state | ✅ | Native | `disabled={true}` prevents interaction, respects DisabledContext |
| Read-only state | ✅ | Native | `readOnly={true}` allows viewing but prevents editing |
| Allow clear | ✅ | Native | `allowClear={true}` adds clear button to remove all content |
| Placeholder text | ✅ | Native | `placeholder="text"` for empty state hint |
| Status indication | ✅ | Composed | `status="error"` / `"warning"` for validation states (via Form.Item) |

### Prefix/Suffix Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Prefix icons | ✅ | Native | `prefix={<Icon />}` adds leading icon inside input |
| Suffix content | ✅ | Native | `suffix={<ReactNode />}` supported from v5.27.0 |
| Addon before | ✅ | Native | `addonBefore={<ReactNode />}` adds content before input box |
| Addon after | ✅ | Native | `addonAfter={<ReactNode />}` adds content after input box |

### Value Management
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Uncontrolled | ✅ | Native | `defaultValue="text"` for initial value only |
| Controlled | ✅ | Native | `value={state}` + `onChange={(e) => setState(e.target.value)}` |
| Auto-clear on hide | ✅ | Native | Internal `useRemovePasswordTimeout` clears value when toggling to hidden |
| Max length | ✅ | Native | `maxLength={number}` limits character count |
| Show count | ✅ | Native | `showCount={true}` displays character counter |

### Interaction Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Focus management | ✅ | Native | `.focus()` and `.blur()` methods, prevents focus loss during toggle |
| Caret preservation | ✅ | Native | `preventDefault()` on mouseup maintains cursor position during toggle |
| Keyboard navigation | ✅ | Native | Standard input keyboard behavior (Tab, Enter, etc.) |
| onChange handler | ✅ | Native | `onChange={(e) => {}}` fires on value change |
| onPressEnter | ✅ | Native | `onPressEnter={(e) => {}}` fires on Enter key |
| onBlur/onFocus | ✅ | Native | Standard focus event handlers |

### Form Integration
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Form.Item wrapper | ✅ | Composed | Integrates with Ant Design Form for validation and layout |
| Validation status | ✅ | Composed | `validateStatus="error/warning/success"` via Form.Item |
| Help text | ✅ | Composed | `help="message"` via Form.Item for hints/errors |
| Required indicator | ✅ | Composed | `required={true}` via Form.Item shows asterisk |
| Auto validation | ✅ | Composed | Form rules trigger automatic validation on change/blur |

### Accessibility Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Autocomplete control | ✅ | Native | `autoComplete="new-password"` / `"current-password"` attributes |
| ARIA attributes | ⚠️ | Native | Standard input ARIA support (details not explicitly documented) |
| Screen reader support | ⚠️ | Native | Toggle button accessibility (implementation details not documented) |
| Keyboard-only operation | ✅ | Native | Full keyboard support for input and toggle |
| Focus indicators | ✅ | CSS-only | Visual focus states provided by Ant Design theme |

## Code Examples

### Basic Password Input
```jsx
import { Input } from 'antd';

const App = () => (
  <Input.Password placeholder="Enter password" />
);
```

### Custom Icon Rendering
```jsx
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Input } from 'antd';

const App = () => (
  <Input.Password
    placeholder="input password"
    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
  />
);
```

### Controlled Visibility Toggle
```jsx
import { Button, Input, Space } from 'antd';
import React, { useState } from 'react';

const App = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <Space direction="vertical">
      <Input.Password
        placeholder="input password"
        visibilityToggle={{
          visible: passwordVisible,
          onVisibleChange: setPasswordVisible,
        }}
      />
      <Button onClick={() => setPasswordVisible(!passwordVisible)}>
        {passwordVisible ? 'Hide' : 'Show'} Password
      </Button>
    </Space>
  );
};
```

### Size Variants
```jsx
import { Input, Space } from 'antd';

const App = () => (
  <Space direction="vertical">
    <Input.Password size="large" placeholder="Large password input" />
    <Input.Password placeholder="Default password input" />
    <Input.Password size="small" placeholder="Small password input" />
  </Space>
);
```

### With Prefix and Suffix (v5.27.0+)
```jsx
import { LockOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Input, Tooltip } from 'antd';

const App = () => (
  <Input.Password
    placeholder="Enter password"
    prefix={<LockOutlined />}
    suffix={
      <Tooltip title="Password must be 8+ characters">
        <QuestionCircleOutlined />
      </Tooltip>
    }
  />
);
```

### Disable Visibility Toggle
```jsx
import { Input } from 'antd';

const App = () => (
  <Input.Password
    placeholder="Password without toggle"
    visibilityToggle={false}
  />
);
```

### With Form Validation
```jsx
import { Form, Input, Button } from 'antd';

const App = () => {
  const [form] = Form.useForm();

  return (
    <Form form={form}>
      <Form.Item
        name="password"
        label="Password"
        rules={[
          { required: true, message: 'Please input your password!' },
          { min: 8, message: 'Password must be at least 8 characters' }
        ]}
        hasFeedback
      >
        <Input.Password placeholder="Enter password" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};
```

### With Allow Clear and Show Count
```jsx
import { Input } from 'antd';

const App = () => (
  <Input.Password
    placeholder="Password with clear and count"
    allowClear
    maxLength={20}
    showCount
  />
);
```

### Controlled with onChange
```jsx
import { Input, Typography } from 'antd';
import React, { useState } from 'react';

const App = () => {
  const [password, setPassword] = useState('');

  return (
    <>
      <Input.Password
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Type to see value"
      />
      <Typography.Text>Current value: {password.replace(/./g, '*')}</Typography.Text>
    </>
  );
};
```

### Autocomplete Attributes
```jsx
import { Input } from 'antd';

const LoginForm = () => (
  <Input.Password
    placeholder="Current password"
    autoComplete="current-password"
  />
);

const RegisterForm = () => (
  <Input.Password
    placeholder="New password"
    autoComplete="new-password"
  />
);
```

## Styling Approaches

### Theme Integration
- **Design tokens**: Ant Design uses CSS-in-JS with theme tokens for consistent styling
- **Component tokens**: Input-specific tokens control colors, sizes, borders, and states
- **Size system**: Three predefined sizes with consistent height/padding ratios
- **Color system**: Semantic colors for default, hover, focus, error, warning states

### Customization Methods
| Method | Support | Details |
|--------|---------|---------|
| className prop | ✅ | Add custom CSS classes to input wrapper |
| style prop | ✅ | Inline styles applied to wrapper element |
| ConfigProvider | ✅ | Global theme configuration for all Input.Password instances |
| CSS variables | ✅ | Override Ant Design CSS variables for fine-tuned control |
| Custom theme | ✅ | Use `@ant-design/cssinjs` for comprehensive theme customization |

### Visual States
| State | Implementation | Details |
|-------|---------------|---------|
| Default | Built-in | Base appearance with border and background |
| Hover | Built-in | Border color change on mouse hover |
| Focus | Built-in | Border color and outline/shadow on focus |
| Disabled | Built-in | Reduced opacity, no interaction, gray background |
| Error | Built-in | Red border via `status="error"` |
| Warning | Built-in | Orange border via `status="warning"` |
| Success | Composed | Green border via Form.Item `validateStatus="success"` |

### Size Specifications
- **Large**: 40px height, larger padding and font size
- **Default**: 32px height, standard padding and font size
- **Small**: 24px height, compact padding and font size

## Accessibility Patterns

### Keyboard Navigation
| Interaction | Support | Details |
|------------|---------|---------|
| Tab navigation | ✅ | Standard tab order, input receives focus |
| Enter key | ✅ | Triggers `onPressEnter` handler if provided |
| Escape key | ⚠️ | Standard browser behavior (not explicitly documented) |
| Toggle button access | ✅ | Accessible via keyboard after tabbing to input |

### Screen Reader Support
| Feature | Support | Details |
|---------|---------|---------|
| Input role | ✅ | Native `<input type="password">` semantic meaning |
| Toggle button label | ⚠️ | Implementation details not explicitly documented |
| State announcements | ⚠️ | Visibility state changes (documentation unclear) |
| Error announcements | ✅ | Via Form.Item ARIA attributes when validation fails |

### ARIA Implementation
| Pattern | Present | Details |
|---------|---------|---------|
| aria-label | ✅ | Can be added via standard HTML props |
| aria-describedby | ✅ | Automatically linked to Form.Item help text |
| aria-invalid | ✅ | Set automatically when status="error" |
| aria-required | ✅ | Set automatically via Form.Item required prop |
| Role attributes | ⚠️ | Standard input roles (specific implementation not documented) |

### Focus Management
- **Focus method**: Programmatic `.focus()` method available via ref
- **Blur method**: Programmatic `.blur()` method available via ref
- **Focus preservation**: Internal logic prevents focus loss during visibility toggle via `e.preventDefault()` on mousedown
- **Caret preservation**: Cursor position maintained during toggle via `e.preventDefault()` on mouseup
- **Focus indicators**: Clear visual focus states provided by Ant Design theme

### Autocomplete Standards
| Pattern | Support | Details |
|---------|---------|---------|
| autocomplete="new-password" | ✅ | Browser hint for password managers (new password context) |
| autocomplete="current-password" | ✅ | Browser hint for password managers (login context) |
| autocomplete="off" | ✅ | Disable browser autofill (though browsers may ignore) |

## Notable Features

### Password Auto-Clear Mechanism
- **Timeout-based cleanup**: Uses `useRemovePasswordTimeout` hook to automatically clear password value when toggling visibility to hidden state
- **Security focus**: Prevents password from remaining in memory when user chooses to hide it
- **Automatic behavior**: No configuration needed, works out-of-the-box

### Focus and Caret Preservation
- **mousedown prevention**: `e.preventDefault()` on toggle button mousedown prevents focus loss from input
- **mouseup prevention**: `e.preventDefault()` on toggle button mouseup prevents caret position reset
- **Seamless UX**: Users can toggle visibility without losing typing position or focus

### Action Modes
- **Click mode** (default): Toggle button activates on click event
- **Hover mode**: Toggle button activates on mouseover event via `action="hover"`
- **ActionMap system**: Internal mapping of action types to React DOM event attributes

### Inheritance Model
- **Extends Input**: Input.Password inherits all props from base Input component
- **Shared functionality**: All Input props (placeholder, disabled, size, prefix, etc.) work on Password
- **Additive API**: Password-specific props (visibilityToggle, iconRender) extend base functionality

### Context Integration
- **ConfigContext**: Respects global Ant Design configuration for prefix class names
- **DisabledContext**: Honors application-wide disabled state from context
- **Form context**: Seamlessly integrates with Form validation and state management

### TypeScript Support
- **Full type definitions**: Complete TypeScript interfaces for all props
- **VisibilityToggle interface**: Typed object for controlled visibility
- **PasswordProps interface**: Extends InputProps with password-specific types
- **Generic support**: Type-safe event handlers and render functions

## Research Notes

### Documentation Gaps
- **Accessibility details**: ARIA implementation and screen reader behavior not comprehensively documented
- **Toggle button accessibility**: Keyboard access pattern and announcements unclear
- **Security best practices**: Limited guidance on password handling, storage, or validation patterns
- **Browser compatibility**: No explicit information about cross-browser visibility toggle behavior

### Implementation Observations
- **React-specific**: Component is built for React ecosystem, not framework-agnostic
- **Ant Design ecosystem dependency**: Requires Ant Design infrastructure (icons, theme, config)
- **TypeScript-first**: Source code in TypeScript with comprehensive type definitions
- **Hook-based**: Modern React patterns with hooks (useRemovePasswordTimeout, useState)

### Version Considerations
- **Suffix support**: Added in v5.27.0, not available in earlier versions
- **Breaking changes**: Migration from v4 to v5 may require updates
- **Feature evolution**: Component API has expanded over versions

### Strength/Weakness Pattern
- **Strength meter**: Not built-in to base component, requires third-party packages like `antd-password-input-strength`
- **Common extension**: Password strength visualization is a common custom addition
- **Composition approach**: Ant Design expects users to compose strength meters rather than providing built-in

### Comparison to Standard Input
- **Specialized behavior**: Type is always "password" (cannot be overridden)
- **Additional props**: visibilityToggle and iconRender are password-specific
- **Enhanced UX**: Toggle functionality provides better usability than standard password input
- **Maintained consistency**: Visual and behavioral consistency with other Ant Design inputs

### Form Integration Best Practices
- **Always use Form.Item**: Wrap in Form.Item for validation and layout consistency
- **Validation rules**: Leverage Form rules for password requirements (length, complexity)
- **Status feedback**: Use `hasFeedback` for visual validation indicators
- **Help text**: Provide clear password requirements via `help` prop

### Security Considerations
- **Client-side only**: All features are UI/UX focused, no cryptographic security
- **Browser autofill**: Autocomplete attributes hint to password managers but don't enforce security
- **Visibility trade-off**: Toggle feature improves UX but may expose password visually
- **Clear mechanism**: Auto-clear on hide toggle may surprise users expecting value persistence

### Customization Limits
- **Theme constraints**: Deep customization requires understanding Ant Design theme system
- **Icon library dependency**: Custom icons typically use @ant-design/icons package
- **CSS-in-JS**: Traditional CSS approaches may conflict with component styling
- **Design system coherence**: Heavy customization may break visual consistency with other Ant components
