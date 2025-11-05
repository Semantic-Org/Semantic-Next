# Ant Design - Switch Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://ant.design/components/switch
Status: ✅ Working
Version: Current (5.x)
Last Verified: 2025-11-05

## Documentation Quality
Good - The documentation provides clear API reference, multiple code examples demonstrating different use cases, and TypeScript type definitions. However, some examples require external sources for complete understanding.

## Component Definition
- **Core purpose**: Toggle the state of a single setting between two mutually exclusive states (on/off, enabled/disabled, true/false)
- **Mental model**: A physical switch that users can flip to change between two states, providing immediate visual feedback
- **Semantic meaning**: Represents a binary choice that takes immediate effect, typically used for settings that don't require confirmation

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `checked={true}`)
- **Composed**: Via composition/children (e.g., `<Switch>{content}</Switch>`)
- **CSS-only**: Requires custom styling (e.g., `style={{ ... }}`)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content (labels) | ✅ | Native | `checkedChildren` and `unCheckedChildren` props accept ReactNode for text labels displayed inside the switch |
| Icons | ✅ | Native | `checkedChildren` and `unCheckedChildren` props accept ReactNode, allowing Icon components to be rendered |
| Loading indicator | ✅ | Native | `loading` prop displays a loading spinner inside the switch, disabling interaction |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Checked/Unchecked | ✅ | Native | `checked` (controlled) and `defaultChecked` (uncontrolled) props. Also `value` and `defaultValue` as aliases (since 5.12.0) |
| Disabled | ✅ | Native | `disabled` prop prevents interaction and applies disabled styling |
| Loading | ✅ | Native | `loading` prop shows loading indicator and prevents clicking |
| Read-only | ❌ | N/A | No dedicated read-only state; use `disabled` or custom implementation |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅ | Native | `size` prop accepts 'small' or 'default' |
| Color options | ❌ | CSS-only | No native color variant prop; customization requires CSS/style overrides |
| Label placement | ✅ | Native | Internal labels via `checkedChildren`/`unCheckedChildren`; external labels must be composed separately |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Click to toggle | ✅ | Native | Default behavior - clicking toggles the switch state |
| Keyboard control | ✅ | Native | Standard HTML element behavior with focus and keyboard interaction |
| onChange handler | ✅ | Native | `onChange` callback receives boolean value when state changes |
| Controlled mode | ✅ | Native | `checked` prop with `onChange` handler for full state control |
| Uncontrolled mode | ✅ | Native | `defaultChecked` prop for initial state without ongoing control |
| onClick handler | ✅ | Native | `onClick` callback for additional click handling beyond state change |

## Code Examples

### Basic Uncontrolled Switch
```jsx
import { Switch } from 'antd';

function onChange(checked) {
  console.log(`switch to ${checked}`);
}

<Switch defaultChecked={false} onChange={onChange} />
```

### Controlled Switch with State
```jsx
import React, { useState } from 'react';
import { Switch } from 'antd';

export default function App() {
  const [currentValue, setCurrentValue] = useState(false);

  return (
    <div>
      <Switch
        checked={currentValue}
        onChange={(value) => setCurrentValue(value)}
      />
      <p>Current Mode of Switch: {`${currentValue}`}</p>
    </div>
  );
}
```

### Switch with Text Labels
```jsx
import { Switch } from 'antd';

<div>
  <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked />
  <br />
  <Switch checkedChildren="1" unCheckedChildren="0" />
</div>
```

### Switch with Icons
```jsx
import { Switch, Icon } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';

<Switch
  checkedChildren={<CheckOutlined />}
  unCheckedChildren={<CloseOutlined />}
  defaultChecked
/>
```

### Disabled Switch
```jsx
import { Switch, Button } from 'antd';

class App extends React.Component {
  state = { disabled: true };

  toggle = () => {
    this.setState({ disabled: !this.state.disabled });
  };

  render() {
    return (
      <div>
        <Switch disabled={this.state.disabled} defaultChecked />
        <br />
        <Button type="primary" onClick={this.toggle}>
          Toggle disabled
        </Button>
      </div>
    );
  }
}
```

### Loading State
```jsx
import { Switch } from 'antd';

<div>
  <Switch loading defaultChecked />
  <br />
  <Switch size="small" loading />
</div>
```
*Note: When loading is true, the switch cannot be clicked and onClick will not trigger*

### Size Variants
```jsx
import { Switch } from 'antd';

<div>
  <Switch defaultChecked />
  <br />
  <Switch size="small" defaultChecked />
</div>
```

### Form Integration
```jsx
import { Form, Switch } from 'antd';

<Form>
  <Form.Item
    name="switchField"
    label="Enable Feature"
    valuePropName="checked"
  >
    <Switch />
  </Form.Item>
</Form>
```
*Note: Form.Item defaults to binding the 'value' property, but Switch uses 'checked'. Use `valuePropName="checked"` to change the bind property.*

## Notable Features

- **Dual API for checked state**: Supports both `checked`/`defaultChecked` (traditional) and `value`/`defaultValue` (since 5.12.0) for consistency with form patterns
- **Loading state integration**: Built-in loading indicator that disables interaction
- **Rich content support**: Both text and icon content can be displayed inside the switch for different states
- **TypeScript support**: Comprehensive TypeScript definitions with exported types (`SwitchSize`, `SwitchChangeEventHandler`, `SwitchClickEventHandler`)
- **Standard HTML attributes**: Supports `autoFocus`, `tabIndex`, `id`, `title`, and other native attributes
- **Methods**: Provides `blur()` and `focus()` methods for programmatic focus management
- **Form compatibility**: Works seamlessly with Ant Design Form component using `valuePropName="checked"`

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| autoFocus | boolean | false | Applies focus when component mounts |
| checked | boolean | - | Indicates current switch state (controlled) |
| checkedChildren | ReactNode | - | Content displayed when checked |
| className | string | - | CSS class assignment |
| defaultChecked | boolean | false | Sets initial state (uncontrolled) |
| defaultValue | boolean | false | Alias for defaultChecked (since 5.12.0) |
| disabled | boolean | false | Disables the switch |
| loading | boolean | false | Shows loading state and disables interaction |
| size | 'small' \| 'default' | 'default' | Controls switch dimensions |
| style | CSSProperties | - | Inline styles |
| tabIndex | number | - | Tab order for keyboard navigation |
| title | string | - | Title attribute for tooltip |
| unCheckedChildren | ReactNode | - | Content displayed when unchecked |
| value | boolean | - | Alias for checked (since 5.12.0) |
| onChange | (checked: boolean, event: Event) => void | - | Callback function on state change |
| onClick | (checked: boolean, event: Event) => void | - | Callback function on click event |

### Methods

| Method | Description |
|--------|-------------|
| blur() | Removes focus from the switch element |
| focus() | Applies focus to the switch element |

### TypeScript Types

```typescript
export type SwitchSize = 'small' | 'default';

export interface SwitchProps {
  prefixCls?: string;
  size?: SwitchSize;
  className?: string;
  rootClassName?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  value?: boolean;
  defaultValue?: boolean;
  onChange?: SwitchChangeEventHandler;
  onClick?: SwitchClickEventHandler;
  checkedChildren?: React.ReactNode;
  unCheckedChildren?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  autoFocus?: boolean;
  style?: React.CSSProperties;
  title?: string;
  tabIndex?: number;
  id?: string;
}
```

## Research Notes

- Documentation URL was initially difficult to access directly; content was loaded via JavaScript
- The official documentation provides interactive examples at https://ant.design/components/switch/
- GitHub source code at https://github.com/ant-design/ant-design/blob/master/components/switch/index.tsx provides complete TypeScript definitions
- The component follows React controlled/uncontrolled component patterns consistently
- Version 5.12.0 introduced `value`/`defaultValue` aliases for better form integration consistency
- The loading state is a particularly useful pattern not found in all switch implementations
- Internal labels (checkedChildren/unCheckedChildren) are a distinctive Ant Design pattern that provides context within the switch itself
